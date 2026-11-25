/* ============================================================
   LA SENTINELLA DI UNA PERSONA — un Durable Object per ogni utente.

   Un «Durable Object» è un pezzetto di Cloudflare con dentro un piccolo
   database SQLite suo, che vive accanto al Worker e non ha bisogno di
   essere creato a mano: nasce la prima volta che lo si chiama per nome.
   Qui il nome è l'uid di Firebase, quindi OGNI PERSONA HA IL SUO: i
   permessi e lo specchio del calendario di uno non stanno nemmeno nello
   stesso database di quelli di un altro.

   Cosa tiene, tabella per tabella:
     conti    i due permessi (Google, Microsoft), CIFRATI (vedi cifra.mjs),
              e l'email dell'account
     cal      i calendari dell'account, quali sono accesi, il syncToken
     ev       LO SPECCHIO: gli eventi dei calendari accesi, da 7 giorni fa a
              400 giorni avanti, nella forma neutra di fornitori.mjs. Ogni
              cambiamento prende un numero (`seq`) che cresce: l'app chiede
              «cosa è cambiato dopo il numero tale» e riceve solo quello.
     coda     le modifiche fatte in LifeMax da riportare nel calendario,
              con i tentativi: se Google non risponde si riprova da qui,
              anche ad app chiusa, finché non va
     attese   i collegamenti in corso (lo `state` di OAuth e la sfida PKCE):
              valgono dieci minuti e si usano una volta sola

   LA SVEGLIA. Ogni dieci minuti il Durable Object si sveglia da solo (un
   «alarm»), guarda i calendari, ritenta la coda e si rimette la sveglia.
   Nessuno deve tenere aperta l'app. Il cron del Worker, una volta all'ora,
   controlla soltanto che nessuna sveglia sia andata persa.

   La sentinella NON scrive mai nel documento Firestore dell'utente: tiene
   le sue cose qui, e l'app le prende quando si apre. Le attività le crea e
   le cambia sempre l'app, con le regole di sempre (src/calendari/sincronia.ts).
   ============================================================ */
import { config, attivo, redirect, PROVENIENZE } from './config.mjs';
import { FORNITORI, Errore, giaScritta } from './fornitori.mjs';
import { cifra, decifra, caso, sfidaPkce } from './cifra.mjs';

export const GIRO_MS = 10 * 60000;          /* ogni quanto si guarda il calendario */
const PRIMA_MS = 7 * 86400000;              /* lo specchio guarda indietro una settimana */
export const DOPO_MS = 400 * 86400000;      /* e avanti più di un anno */
const PIENO_MS = 24 * 3600000;              /* una lettura completa al giorno (la finestra scorre) */
const FRESCO_MS = 2 * 60000;                /* aprendo l'app: si rilegge se l'ultima è più vecchia */
const ATTESA_MS = 10 * 60000;               /* un collegamento iniziato vale dieci minuti */
const LAPIDI_MS = 30 * 86400000;            /* i «cancellato» si ricordano un mese */

function json(o, stato) {
  return new Response(JSON.stringify(o), { status: stato || 200, headers: { 'Content-Type': 'application/json' } });
}

export class Sentinella {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.sql = state.storage.sql;
    this.cfg = config(env);
    this.pronto = false;
    this.inVolo = new Map();     /* una scrittura già in corso, per chiave */
    this.rinnovi = new Map();    /* un rinnovo del permesso già in corso, per fornitore */
  }

  /* ----------------------------------------------------------- il database */
  q(s, ...a) { return this.sql.exec(s, ...a.map(function (x) { return x === undefined ? null : (typeof x === 'boolean' ? (x ? 1 : 0) : x); })).toArray(); }
  uno(s, ...a) { return this.q(s, ...a)[0] || null; }
  schema() {
    if (this.pronto) return;
    this.sql.exec('CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT)');
    this.sql.exec('CREATE TABLE IF NOT EXISTS conti (p TEXT PRIMARY KEY, email TEXT, rt TEXT, at TEXT, at_scade INTEGER, stato TEXT, dal INTEGER)');
    this.sql.exec('CREATE TABLE IF NOT EXISTS cal (p TEXT, c TEXT, nome TEXT, lettura INTEGER, principale INTEGER, acceso INTEGER, token TEXT, pieno INTEGER, PRIMARY KEY (p, c))');
    this.sql.exec('CREATE TABLE IF NOT EXISTS ev (p TEXT, c TEXT, id TEXT, j TEXT, seq INTEGER, agg INTEGER, PRIMARY KEY (p, c, id))');
    this.sql.exec('CREATE INDEX IF NOT EXISTS ev_seq ON ev (seq)');
    this.sql.exec('CREATE TABLE IF NOT EXISTS coda (k TEXT PRIMARY KEY, p TEXT, j TEXT, stato TEXT, tent INTEGER, prossimo INTEGER, esito TEXT, ts INTEGER)');
    this.sql.exec('CREATE TABLE IF NOT EXISTS attese (s TEXT PRIMARY KEY, p TEXT, ver TEXT, ritorno TEXT, scade INTEGER, legame TEXT, partito INTEGER)');
    this.sql.exec('CREATE TABLE IF NOT EXISTS elenco (h TEXT PRIMARY KEY)');
    /* i permessi tornati da Google o Microsoft ma non ancora CONFERMATI
       dall'app che ha cominciato il collegamento (vedi `ritorno` e
       `conferma`): finché stanno qui non si usano per niente */
    this.sql.exec('CREATE TABLE IF NOT EXISTS pendenti (p TEXT PRIMARY KEY, segreto TEXT, rt TEXT, at TEXT, at_scade INTEGER, email TEXT, cal TEXT, scade INTEGER)');
    this.pronto = true;
  }
  meta(k) { const r = this.uno('SELECT v FROM meta WHERE k = ?', k); return r ? r.v : ''; }
  setMeta(k, v) { this.q('INSERT INTO meta (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v', k, String(v)); }

  /* ------------------------------------------------------------- l'ingresso
     Il Worker chiama qui con l'uid già controllato nell'intestazione
     `x-lm-uid`. Il Durable Object non si raggiunge da fuori: solo il Worker
     può parlargli. */
  async fetch(req) {
    this.schema();
    const az = new URL(req.url).pathname.replace(/^\/+/, '');
    let corpo = {};
    try { corpo = await req.json(); } catch { corpo = {}; }
    const uid = req.headers.get('x-lm-uid') || '';
    try {
      if (az === 'ritorno') return json(await this.ritorno(corpo));
      if (az === 'vai') return json(await this.vai(corpo));
      if (az === 'sveglia') { await this.sveglia(); return json({ ok: true }); }
      if (az === 'elenco/registra') { this.q('INSERT OR IGNORE INTO elenco (h) VALUES (?)', String(corpo.h || '')); return json({ ok: true }); }
      if (az === 'elenco/togli') { this.q('DELETE FROM elenco WHERE h = ?', String(corpo.h || '')); return json({ ok: true }); }
      if (az === 'elenco/lista') return json({ h: this.q('SELECT h FROM elenco').map(function (r) { return r.h; }) });
      if (!uid) return json({ errore: 'chi?' }, 401);
      const mio = this.meta('uid');
      if (!mio) this.setMeta('uid', uid);
      else if (mio !== uid) return json({ errore: 'non tuo' }, 403);
      if (az === 'inizia') return json(await this.inizia(corpo));
      if (az === 'conferma') return json(await this.conferma(corpo));
      if (az === 'cambi') return json(await this.cambi(corpo));
      if (az === 'calendari') return json(await this.calendari(corpo));
      if (az === 'evento') return json(await this.evento(corpo));
      if (az === 'scrivi') return json(await this.scrivi(corpo));
      if (az === 'scollega') return json(await this.scollega(corpo));
      return json({ errore: 'non so fare ' + az }, 404);
    } catch (e) {
      /* il messaggio dice il tipo, mai un permesso: i token non finiscono nei log */
      const tipo = e instanceof Errore ? e.tipo : 'altro';
      return json({ errore: tipo, messaggio: e instanceof Errore ? e.message : 'errore interno' }, tipo === 'rete' ? 503 : 500);
    }
  }

  async alarm() {
    this.schema();
    const conti = this.q('SELECT p, stato FROM conti');
    if (!conti.length) return;
    const cambiati = [];
    for (const c of conti) {
      if (c.stato !== 'ok' || !attivo(this.cfg, this.env, c.p)) continue;
      try { cambiati.push(...(await this.giro(c.p))); } catch { /* si riprova alla prossima sveglia */ }
    }
    await this.ritentaCoda();
    this.pota();
    this.dopoNovita(cambiati);
    await this.state.storage.setAlarm(Date.now() + GIRO_MS + Math.floor(Math.random() * 60000));
  }

  /* IL GANCIO PER I PROMEMORIA. Qui arrivano gli eventi nuovi o cambiati
     trovati mentre l'app era chiusa. È il posto giusto per chiedere al
     postino (postino/) di mandare un promemoria push prima di una riunione
     — oggi non lo fa: serve decidere con chi usa l'app quando e quali. */
  dopoNovita(_cambiati) { /* per ora niente */ }

  async sveglia() {
    const n = this.uno('SELECT COUNT(*) AS n FROM conti WHERE stato = ?', 'ok');
    if (!n || !n.n) return;
    const s = await this.state.storage.getAlarm();
    if (s === null || s === undefined) await this.state.storage.setAlarm(Date.now() + 1000);
  }

  elenco(az) {
    const ns = this.env.SENTINELLA;
    const stub = ns.get(ns.idFromName('__elenco'));
    return stub.fetch(new Request('https://sentinella.interno/elenco/' + az, { method: 'POST', body: JSON.stringify({ h: this.state.id.toString() }) }));
  }

  /* ============================================================ COLLEGARE */
  async inizia(o) {
    const p = o.p;
    if (!attivo(this.cfg, this.env, p)) return { errore: 'non-configurato' };
    /* si torna SOLO a uno degli indirizzi dell'app, scelto da qui: un
       indirizzo scritto da chi chiama non si usa mai (niente rimandi aperti) */
    const ritorno = this.cfg.ritorni.find(function (r) { return typeof o.ritorno === 'string' && o.ritorno.indexOf(r) === 0; });
    if (!ritorno) return { errore: 'ritorno' };
    const stato = this.state.id.toString() + '.' + caso(24);
    this.q('DELETE FROM attese WHERE scade < ?', Date.now());
    this.q('INSERT INTO attese (s, p, ver, ritorno, scade, legame, partito) VALUES (?, ?, ?, ?, ?, ?, 0)', stato, p, caso(48), ritorno, Date.now() + ATTESA_MS, caso(24));
    /* l'app non va dritta da Google: passa da /vai, sul NOSTRO indirizzo,
       che lascia nel browser un biscotto col «legame» (vedi `vai`) */
    return { url: this.cfg.base + '/api/calendari/' + p + '/vai?s=' + encodeURIComponent(stato) };
  }

  /* IL LEGAME COL BROWSER. Il passaggio da /vai lascia un biscotto (HttpOnly,
     solo su /api/calendari/) con un segreto che il ritorno deve riportare:
     così il ritorno arriva dallo stesso browser che è passato da /vai.
     ATTENZIONE: questo da solo NON basta, e la verifica del 25 novembre 2026
     (revisione/cloud2/) l'ha provato. Qualcuno può cominciare un
     collegamento col SUO account, mandarti l'indirizzo di /vai — che è un
     indirizzo vero di LifeMax — e se tu lo apri e dici sì a Google, il
     biscotto ce l'hai TU, quindi il ritorno passa. Il permesso che torna NON
     si usa: resta «da confermare» (vedi `ritorno` e `conferma`). */
  async vai(o) {
    const riga = this.uno('SELECT * FROM attese WHERE s = ? AND p = ?', String(o.stato || ''), String(o.p || ''));
    if (!riga || riga.partito || riga.scade < Date.now() || !attivo(this.cfg, this.env, riga.p)) return { errore: 'scaduto' };
    this.q('UPDATE attese SET partito = 1 WHERE s = ?', riga.s);
    return { url: FORNITORI[riga.p].autorizza(this.cfg[riga.p], riga.s, await sfidaPkce(riga.ver), redirect(this.cfg, riga.p)), legame: riga.legame };
  }

  async ritorno(o) {
    const p = o.p;
    const riga = this.uno('SELECT * FROM attese WHERE s = ? AND p = ?', String(o.stato || ''), String(p || ''));
    /* UNA VOLTA SOLA: la si toglie prima di fare qualunque altra cosa */
    this.q('DELETE FROM attese WHERE s = ?', String(o.stato || ''));
    if (!riga) return { esito: 'scaduto', ritorno: this.cfg.ritorni[0] };
    if (riga.scade < Date.now() || !riga.partito) return { esito: 'scaduto', ritorno: riga.ritorno };
    if (!o.legame || o.legame !== riga.legame) return { esito: 'altro-browser', ritorno: riga.ritorno };
    if (o.errore) return { esito: o.errore === 'access_denied' ? 'negato' : 'errore', ritorno: riga.ritorno };
    if (!attivo(this.cfg, this.env, p) || !this.meta('uid')) return { esito: 'errore', ritorno: riga.ritorno };
    try {
      const F = FORNITORI[p];
      const t = await F.scambia(this.cfg[p], String(o.codice || ''), riga.ver, redirect(this.cfg, p));
      const elenco = await F.calendari(t.at);
      const email = await F.email(t.at, elenco);
      /* IL PERMESSO NON DIVENTA DI QUESTO ACCOUNT ADESSO. Resta in sospeso
         dieci minuti, cifrato, e serve una conferma che può dare SOLO il
         browser che è appena tornato da Google (ha il biscotto con un
         segreto nuovo, che lascia il Worker) E che è dentro LifeMax con
         questo stesso account (il gettone di Firebase porta qui). Un
         collegamento cominciato da un altro e aperto da te torna nel TUO
         browser, che però è dentro col TUO account: la sua conferma arriva
         alla tua sentinella, non a questa, e qui il permesso scade da solo.
         Chi ha cominciato, dal suo browser, il biscotto non ce l'ha. */
      const uid = this.meta('uid');
      const segreto = caso(32);
      this.q('DELETE FROM pendenti WHERE scade < ?', Date.now());
      this.q('INSERT INTO pendenti (p, segreto, rt, at, at_scade, email, cal, scade) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ' +
        'ON CONFLICT(p) DO UPDATE SET segreto = excluded.segreto, rt = excluded.rt, at = excluded.at, at_scade = excluded.at_scade, email = excluded.email, cal = excluded.cal, scade = excluded.scade',
        p, segreto, await cifra(this.cfg.chiave, t.rt, uid + '|' + p + '|rt'), await cifra(this.cfg.chiave, t.at, uid + '|' + p + '|at'),
        t.scade, email, JSON.stringify(elenco), Date.now() + ATTESA_MS);
      return { esito: 'da-confermare', ritorno: riga.ritorno, conferma: this.state.id.toString() + '.' + segreto };
    } catch (e) {
      return { esito: e instanceof Errore && e.tipo === 'permesso' ? 'caselle' : 'errore', ritorno: riga.ritorno };
    }
  }

  /* LA CONFERMA: dall'app, col gettone di Firebase (quindi da questo
     account: il Worker porta qui solo il proprietario) e col biscotto lasciato
     al ritorno (quindi dal browser che è tornato da Google). Solo così il
     permesso in sospeso diventa un collegamento. */
  async conferma(o) {
    const p = o.p;
    const pz = String(o.biscotto || '').split('.');
    const riga = this.uno('SELECT * FROM pendenti WHERE p = ?', String(p || ''));
    if (!riga || riga.scade < Date.now()) { this.q('DELETE FROM pendenti WHERE p = ?', String(p || '')); return { errore: 'scaduto' }; }
    if (pz.length !== 2 || pz[0] !== this.state.id.toString() || !pz[1] || pz[1] !== riga.segreto) return { errore: 'altro-browser' };
    this.q('DELETE FROM pendenti WHERE p = ?', p);
    this.q('INSERT INTO conti (p, email, rt, at, at_scade, stato, dal) VALUES (?, ?, ?, ?, ?, ?, ?) ' +
      'ON CONFLICT(p) DO UPDATE SET email = excluded.email, rt = excluded.rt, at = excluded.at, at_scade = excluded.at_scade, stato = excluded.stato',
      p, riga.email || '', riga.rt, riga.at, riga.at_scade, 'ok', Date.now());
    let elenco = [];
    try { elenco = JSON.parse(riga.cal || '[]'); } catch { elenco = []; }
    this.salvaCalendari(p, elenco);
    try { await this.elenco('registra'); } catch { /* il cron serve solo da riserva */ }
    await this.state.storage.setAlarm(Date.now() + GIRO_MS);
    return { ok: true, email: riga.email || '' };
  }

  async salvaConto(p, t) {
    const uid = this.meta('uid');
    const rt = await cifra(this.cfg.chiave, t.rt, uid + '|' + p + '|rt');
    const at = await cifra(this.cfg.chiave, t.at, uid + '|' + p + '|at');
    this.q('INSERT INTO conti (p, email, rt, at, at_scade, stato, dal) VALUES (?, ?, ?, ?, ?, ?, ?) ' +
      'ON CONFLICT(p) DO UPDATE SET rt = excluded.rt, at = excluded.at, at_scade = excluded.at_scade, stato = excluded.stato',
      p, '', rt, at, t.scade, 'ok', Date.now());
  }

  salvaCalendari(p, elenco) {
    for (const c of elenco) {
      this.q('INSERT INTO cal (p, c, nome, lettura, principale, acceso, token, pieno) VALUES (?, ?, ?, ?, ?, 0, NULL, 0) ' +
        'ON CONFLICT(p, c) DO UPDATE SET nome = excluded.nome, lettura = excluded.lettura, principale = excluded.principale',
        p, c.id, c.nome, c.lettura, c.principale);
    }
  }

  /* IL PERMESSO DI ADESSO. Quello breve se vale ancora, se no uno nuovo dal
     refresh token: è qui che il problema dell'«ora sola» di Google sparisce. */
  async gettone(p, forza) {
    const riga = this.uno('SELECT * FROM conti WHERE p = ?', p);
    if (!riga) throw new Errore('token', 'non collegato');
    if (riga.stato === 'revocato') throw new Errore('revocato', 'permesso ritirato');
    const uid = this.meta('uid');
    if (!forza && riga.at && riga.at_scade > Date.now() + 60000) return decifra(this.cfg.chiave, riga.at, uid + '|' + p + '|at');
    if (this.rinnovi.has(p)) return this.rinnovi.get(p);
    const lavoro = (async () => {
      const rt = await decifra(this.cfg.chiave, riga.rt, uid + '|' + p + '|rt');
      let t;
      try { t = await FORNITORI[p].rinnova(this.cfg[p], rt); }
      catch (e) {
        if (e instanceof Errore && e.tipo === 'revocato') this.q('UPDATE conti SET stato = ? WHERE p = ?', 'revocato', p);
        throw e;
      }
      const at = await cifra(this.cfg.chiave, t.at, uid + '|' + p + '|at');
      if (t.rt) {
        const nuovo = await cifra(this.cfg.chiave, t.rt, uid + '|' + p + '|rt');
        this.q('UPDATE conti SET at = ?, at_scade = ?, rt = ? WHERE p = ?', at, t.scade, nuovo, p);
      } else {
        this.q('UPDATE conti SET at = ?, at_scade = ? WHERE p = ?', at, t.scade, p);
      }
      return t.at;
    })().finally(() => { this.rinnovi.delete(p); });
    this.rinnovi.set(p, lavoro);
    return lavoro;
  }
  /* una chiamata con il permesso; se il fornitore lo rifiuta (401), uno
     nuovo e si riprova una volta */
  async con(p, fai) {
    try { return await fai(await this.gettone(p, false)); }
    catch (e) {
      if (!(e instanceof Errore && e.tipo === 'token')) throw e;
      return fai(await this.gettone(p, true));
    }
  }

  /* ============================================================ LO SPECCHIO */
  finestra() { const ora = Date.now(); return { da: ora - PRIMA_MS, a: ora + DOPO_MS }; }
  dentro(n) { const w = this.finestra(); return n.f >= w.da && n.i <= w.a; }
  prossimo() { const s = (+this.meta('seq') || 0) + 1; this.setMeta('seq', s); return s; }
  /* scrive un evento SOLO se è cambiato: così `seq` racconta solo novità vere */
  metti(p, c, n) {
    const j = JSON.stringify(n);
    const gia = this.uno('SELECT j FROM ev WHERE p = ? AND c = ? AND id = ?', p, c, n.id);
    if (gia && gia.j === j) return false;
    if (!gia && (n.via || n.fuori)) return false;
    this.q('INSERT INTO ev (p, c, id, j, seq, agg) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(p, c, id) DO UPDATE SET j = excluded.j, seq = excluded.seq, agg = excluded.agg',
      p, c, n.id, j, this.prossimo(), Date.now());
    return true;
  }
  /* un evento visto per altre vie (una scrittura, una lettura singola):
     nello specchio se sta nella finestra; se è uscito, si segna «fuori» */
  vedi(p, c, n) {
    if (!n) return;
    if (n.via) { this.metti(p, c, { id: n.id, via: true }); return; }
    if (this.dentro(n)) this.metti(p, c, n);
    else this.metti(p, c, { id: n.id, fuori: true });
  }

  /* UN CALENDARIO, LETTO. Google con il syncToken porta solo i cambiamenti;
     una volta al giorno (e quando il token non vale più) si rilegge tutta
     la finestra. Microsoft si rilegge sempre tutta. Quello che una lettura
     completa non restituisce più non è dato per cancellato: è «fuori» —
     potrebbe essere stato spostato lontano. L'app, per una riga collegata,
     chiede quell'evento uno per uno prima di toglierla. */
  async leggi(p, c, pieno) {
    const F = FORNITORI[p];
    const cr = this.uno('SELECT * FROM cal WHERE p = ? AND c = ?', p, c);
    if (!cr) return [];
    const w = this.finestra();
    const incrementale = !pieno && p === 'google' && !!cr.token && Date.now() - (cr.pieno || 0) < PIENO_MS;
    const visti = new Set();
    const cambiati = [];
    let pagina = '', nuovoToken = '';
    for (let giro = 0; giro < 25; giro++) {
      let r;
      try {
        r = await this.con(p, function (at) { return F.pagina(at, c, { da: w.da, a: w.a, gettone: incrementale ? cr.token : '', pagina: pagina }); });
      } catch (e) {
        /* 410: il syncToken è troppo vecchio. Si ricomincia da capo */
        if (incrementale && e instanceof Errore && e.tipo === 'sparito') { this.q('UPDATE cal SET token = NULL WHERE p = ? AND c = ?', p, c); return this.leggi(p, c, true); }
        throw e;
      }
      for (const n of r.eventi) {
        visti.add(n.id);
        const prima = this.uno('SELECT seq FROM ev WHERE p = ? AND c = ? AND id = ?', p, c, n.id);
        let cambiato;
        if (n.via) cambiato = this.metti(p, c, { id: n.id, via: true });
        else if (this.dentro(n)) cambiato = this.metti(p, c, n);
        else cambiato = prima ? this.metti(p, c, { id: n.id, fuori: true }) : false;
        if (cambiato && !n.via) cambiati.push(n);
      }
      if (r.gettone) nuovoToken = r.gettone;
      pagina = r.pagina;
      if (!pagina) break;
    }
    if (!incrementale) {
      for (const riga of this.q('SELECT id, j FROM ev WHERE p = ? AND c = ?', p, c)) {
        if (visti.has(riga.id)) continue;
        const n = JSON.parse(riga.j);
        if (!n.via && !n.fuori) this.metti(p, c, { id: riga.id, fuori: true });
      }
      this.q('UPDATE cal SET token = ?, pieno = ? WHERE p = ? AND c = ?', nuovoToken || null, Date.now(), p, c);
    } else if (nuovoToken) {
      this.q('UPDATE cal SET token = ? WHERE p = ? AND c = ?', nuovoToken, p, c);
    }
    return cambiati;
  }

  async giro(p) {
    const cambiati = [];
    this.setMeta('giro_' + p, Date.now());
    for (const cr of this.q('SELECT c FROM cal WHERE p = ? AND acceso = 1', p)) {
      try { cambiati.push(...(await this.leggi(p, cr.c, false))); }
      catch (e) { if (e instanceof Errore && (e.tipo === 'revocato' || e.tipo === 'token')) throw e; /* un calendario che non risponde non ferma gli altri */ }
    }
    return cambiati;
  }

  pota() {
    const soglia = Date.now() - LAPIDI_MS;
    let potato = +this.meta('potato') || 0;
    for (const r of this.q('SELECT p, c, id, j, seq FROM ev WHERE agg < ?', soglia)) {
      const n = JSON.parse(r.j);
      if (!n.via && !n.fuori) continue;
      if (r.seq > potato) potato = r.seq;
      this.q('DELETE FROM ev WHERE p = ? AND c = ? AND id = ?', r.p, r.c, r.id);
    }
    this.setMeta('potato', potato);
    this.q('DELETE FROM coda WHERE stato = ? AND ts < ?', 'fatto', Date.now() - 7 * 86400000);
    this.q('DELETE FROM attese WHERE scade < ?', Date.now());
  }

  stato() {
    const out = {};
    for (const p of PROVENIENZE) {
      const c = this.uno('SELECT p, email, stato FROM conti WHERE p = ?', p);
      out[p] = {
        servizio: attivo(this.cfg, this.env, p),
        collegato: !!c,
        revocato: !!c && c.stato === 'revocato',
        email: c ? c.email || '' : '',
        calendari: c ? this.q('SELECT c, nome, lettura, principale FROM cal WHERE p = ?', p)
          .map(function (r) { return { id: r.c, nome: r.nome, lettura: !!r.lettura, principale: !!r.principale }; }) : []
      };
    }
    return out;
  }

  /* L'APP SI È APERTA: «cosa è cambiato dopo il numero tale?». Prima, se
     l'app ha acceso o spento un calendario, lo specchio si adegua; e se
     l'ultima lettura è di più di due minuti fa, si rilegge adesso. */
  async cambi(o) {
    const accesi = o.accesi || {};
    for (const p of PROVENIENZE) {
      const conto = this.uno('SELECT stato FROM conti WHERE p = ?', p);
      if (!conto) continue;
      if (Array.isArray(accesi[p])) {
        const voluti = new Set(accesi[p].map(String));
        for (const cr of this.q('SELECT c, acceso FROM cal WHERE p = ?', p)) {
          const on = voluti.has(cr.c);
          if (on && !cr.acceso) this.q('UPDATE cal SET acceso = 1, token = NULL, pieno = 0 WHERE p = ? AND c = ?', p, cr.c);
          if (!on && cr.acceso) {
            this.q('UPDATE cal SET acceso = 0, token = NULL, pieno = 0 WHERE p = ? AND c = ?', p, cr.c);
            this.q('DELETE FROM ev WHERE p = ? AND c = ?', p, cr.c);
          }
        }
      }
      if (conto.stato !== 'ok' || !attivo(this.cfg, this.env, p)) continue;
      const nuovi = this.q('SELECT c FROM cal WHERE p = ? AND acceso = 1 AND pieno = 0', p).length;
      if (nuovi || Date.now() - (+this.meta('giro_' + p) || 0) > FRESCO_MS) {
        try { await this.giro(p); } catch { /* lo specchio di prima resta buono */ }
      }
    }
    const dopo = Math.max(0, +o.dopo || 0);
    const potato = +this.meta('potato') || 0;
    const completo = !dopo || dopo < potato;
    const righe = completo ? this.q('SELECT p, c, j, seq FROM ev') : this.q('SELECT p, c, j, seq FROM ev WHERE seq > ?', dopo);
    const eventi = [];
    for (const r of righe) {
      const n = JSON.parse(r.j);
      if (completo && (n.via || n.fuori)) continue;
      n.p = r.p; n.c = r.c;
      eventi.push(n);
    }
    return { seq: +this.meta('seq') || 0, completo: completo, eventi: eventi, conti: this.stato(), finestra: DOPO_MS };
  }

  async calendari(o) {
    const p = o.p;
    const elenco = await this.con(p, function (at) { return FORNITORI[p].calendari(at); });
    this.salvaCalendari(p, elenco);
    return { calendari: elenco };
  }

  async evento(o) {
    const p = o.p, c = String(o.c || ''), id = String(o.id || '');
    const n = await this.con(p, function (at) { return FORNITORI[p].evento(at, c, id); });
    if (n) this.vedi(p, c, n);
    return { e: n };
  }

  /* ================================================================ LA CODA
     Ogni modifica arriva con una CHIAVE che nasce da quello che chiede
     (fornitore, calendario, evento, cosa scrivere, versione di partenza).
     La stessa modifica mandata due volte — dall'app che si chiude e poi dal
     giro normale, o da due dispositivi — si fa una volta sola, e la seconda
     riceve la risposta della prima. */
  async scrivi(o) {
    const esiti = {};
    const ops = Array.isArray(o.ops) ? o.ops.slice(0, 60) : [];
    for (const op of ops) {
      if (!op || typeof op.k !== 'string' || op.k.length > 300 || PROVENIENZE.indexOf(op.p) < 0) continue;
      esiti[op.k] = await this.esegui(op);
    }
    const resta = this.uno('SELECT COUNT(*) AS n FROM coda WHERE stato = ?', 'attesa');
    if (resta && resta.n) { const s = await this.state.storage.getAlarm(); if (s === null || s === undefined) await this.state.storage.setAlarm(Date.now() + 60000); }
    return { esiti: esiti };
  }

  async esegui(op) {
    const riga = this.uno('SELECT stato, esito FROM coda WHERE k = ?', op.k);
    if (riga && riga.stato === 'fatto') return JSON.parse(riga.esito);
    if (this.inVolo.has(op.k)) return this.inVolo.get(op.k);
    if (!riga) this.q('INSERT INTO coda (k, p, j, stato, tent, prossimo, esito, ts) VALUES (?, ?, ?, ?, 0, 0, NULL, ?)', op.k, op.p, JSON.stringify(op), 'attesa', Date.now());
    const lavoro = this.fai(op).finally(() => { this.inVolo.delete(op.k); });
    this.inVolo.set(op.k, lavoro);
    return lavoro;
  }

  async fai(op) {
    try {
      const esito = await this.operazione(op);
      this.q('UPDATE coda SET stato = ?, esito = ?, ts = ? WHERE k = ?', 'fatto', JSON.stringify(esito), Date.now(), op.k);
      return esito;
    } catch (e) {
      const tipo = e instanceof Errore ? e.tipo : 'altro';
      if (tipo === 'rete' || tipo === 'token' || tipo === 'revocato') {
        /* da riprovare: 2, 4, 8… minuti, fino a sei ore, per una ventina di volte */
        const r = this.uno('SELECT tent FROM coda WHERE k = ?', op.k);
        const tent = (r ? r.tent : 0) + 1;
        if (tent >= 20) {
          const esito = { ok: false, tipo: 'altro' };
          this.q('UPDATE coda SET stato = ?, esito = ?, ts = ? WHERE k = ?', 'fatto', JSON.stringify(esito), Date.now(), op.k);
          return esito;
        }
        this.q('UPDATE coda SET tent = ?, prossimo = ? WHERE k = ?', tent, Date.now() + Math.min(60000 * Math.pow(2, tent), 6 * 3600000), op.k);
        return { ok: false, tipo: tipo === 'revocato' ? 'token' : tipo };
      }
      const esito = { ok: false, tipo: tipo === 'esiste' ? 'altro' : tipo };
      this.q('UPDATE coda SET stato = ?, esito = ?, ts = ? WHERE k = ?', 'fatto', JSON.stringify(esito), Date.now(), op.k);
      return esito;
    }
  }

  async operazione(op) {
    const p = op.p, c = String(op.c || ''), F = FORNITORI[p];
    if (!attivo(this.cfg, this.env, p)) throw new Errore('rete', 'servizio spento');
    if (op.tipo === 'aggiorna') {
      const id = String(op.id || ''), w = op.w || {};
      const scrittura = {};
      if (w.testo !== undefined) scrittura.testo = String(w.testo);
      if (w.tempo) scrittura.tempo = w.tempo;
      return this.con(p, async (at) => {
        /* PRIMA SI GUARDA COM'È ADESSO, e vale la regola di sempre: se là
           è cambiato da quando l'app l'ha visto, vince il calendario */
        const ora = await F.evento(at, c, id);
        if (!ora || ora.via) { this.metti(p, c, { id: id, via: true }); return { ok: false, tipo: 'sparito' }; }
        if (giaScritta(ora, scrittura)) { this.vedi(p, c, ora); return { ok: true, e: ora }; }
        if (w.se && ora.v !== w.se) { this.vedi(p, c, ora); return { ok: true, conflitto: true, e: ora }; }
        const n = await F.aggiorna(at, c, id, scrittura);
        this.vedi(p, c, n);
        return { ok: true, e: n };
      });
    }
    if (op.tipo === 'togli') {
      const id = String(op.id || '');
      await this.con(p, function (at) { return F.togli(at, c, id); });
      this.metti(p, c, { id: id, via: true });
      return { ok: true };
    }
    if (op.tipo === 'crea') {
      const n = await this.con(p, function (at) { return F.crea(at, c, String(op.testo || ''), op.tempo, String(op.chiave || '')); });
      this.vedi(p, c, n);
      return { ok: true, e: n };
    }
    return { ok: false, tipo: 'altro' };
  }

  async ritentaCoda() {
    const ora = Date.now();
    for (const r of this.q('SELECT k, j FROM coda WHERE stato = ? AND prossimo <= ? LIMIT 20', 'attesa', ora)) {
      await this.esegui(JSON.parse(r.j));
    }
  }

  /* ============================================================ SCOLLEGARE
     Si ritira il permesso presso Google (Microsoft non ha un modo per uno
     solo: lo si dimentica) e si cancella TUTTO quello che riguarda quel
     calendario: permesso, elenco, specchio, coda. */
  async scollega(o) {
    const p = o.p;
    const c = this.uno('SELECT rt FROM conti WHERE p = ?', p);
    if (c && c.rt) {
      try {
        const rt = await decifra(this.cfg.chiave, c.rt, this.meta('uid') + '|' + p + '|rt');
        await FORNITORI[p].revoca(this.cfg[p], rt);
      } catch { /* si cancella comunque */ }
    }
    this.q('DELETE FROM conti WHERE p = ?', p);
    this.q('DELETE FROM cal WHERE p = ?', p);
    this.q('DELETE FROM ev WHERE p = ?', p);
    this.q('DELETE FROM coda WHERE p = ?', p);
    this.q('DELETE FROM attese WHERE p = ?', p);
    if (!this.uno('SELECT p FROM conti')) {
      await this.state.storage.deleteAlarm();
      try { await this.elenco('togli'); } catch { /* niente */ }
    }
    return { ok: true, conti: this.stato() };
  }
}
