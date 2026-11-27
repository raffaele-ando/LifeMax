/* C01 — LA SENTINELLA (Worker + Durable Object) DA FUORI: sicurezza e casi limite.
   Il Worker vero del commit sotto esame (wt/sentinella/worker.mjs), con il mondo
   finto di prove/comune/sentinella-finta.js: fetch di Node sostituito, nessuna
   richiesta esce davvero (un host sconosciuto fa fallire la chiamata).
   Scenari:
     A. collegamento «a nome di un altro» (OAuth login-CSRF): l'attaccante comincia
        il collegamento col SUO account e manda il link /vai alla vittima
     B. gettone di un altro utente / intestazione x-lm-uid falsa / uid di un altro
     C. /ritorno e /vai con state sbagliati, riusati, scaduti, biscotto mancante o di un altro giro
     D. due collegamenti dello stesso fornitore in parallelo (due schede)
     E. CHIAVE_CALENDARI cambiata: cosa vede l'app
     F. refresh token revocato / scaduto (Google «In prova»: 7 giorni)
     G. segreti mancanti uno per uno
     H. /__/auth proxy: cosa inoltra (biscotti, intestazioni)
     I. il cron: quante sentinelle risveglia
     J. calendario spento: lo specchio cancella senza dirlo a chi ha già letto
   node c01-sentinella-sicurezza.js

   VERIFICA 3 — ADATTATO al protocollo nuovo (C2): dopo /ritorno l'app deve fare
   POST /api/calendari/<p>/conferma col biscotto lmcal_ok_<p> (helper `conferma`),
   altrimenti in E, F, I nessun conto esiste e i controlli sono vuoti. Il nome del
   biscotto del legame ora porta un suffisso (m5): A2 accetta lmcal_google_<segno>.
   Nessuna asserzione è stata allentata. */
'use strict';
const path = require('path'), fs = require('fs');
const AUDIT = path.join(__dirname, '..', '..');
const { mondo, gettone } = require(path.join(AUDIT, 'wt', 'prove', 'comune', 'sentinella-finta.js'));
const risultati = [];
const esito = (s, ok, d) => { risultati.push({ scenario: s, ok, dettaglio: d }); console.log((ok ? '  ok  ' : '  KO  ') + s + (d !== undefined ? '  -> ' + (typeof d === 'string' ? d : JSON.stringify(d)).slice(0, 400) : '')); };
const SITO = 'https://lifemax.theproject.world';
const G1 = 86400000;
const giorni = (n, ora) => new Date(Date.now() + n * G1).toISOString().slice(0, 10) + (ora ? 'T' + ora + ':00Z' : '');

(async () => {
  const W = await mondo();
  const { G, env, ns, worker } = W;
  const tokA = gettone('attaccante'), tokV = gettone('vittima');
  async function chiedi(via, corpo, o) {
    o = o || {};
    const h = Object.assign({ Origin: o.origine === undefined ? SITO : o.origine }, o.testa || {});
    if (o.biscotto) h.Cookie = o.biscotto;
    const req = new Request(SITO + via, corpo === undefined ? { method: o.metodo || 'GET', headers: h }
      : { method: 'POST', headers: Object.assign(h, { 'Content-Type': 'text/plain;charset=UTF-8' }), body: JSON.stringify(Object.assign({ gettone: o.gettone }, corpo)) });
    const r = await worker.fetch(req, o.env || env, { waitUntil() {} });
    const t = await r.text(); let j; try { j = JSON.parse(t); } catch { j = t; }
    return { r, j };
  }
  const rel = (u) => new URL(u).pathname + new URL(u).search;
  const biscottoDi = (r) => (r.headers.get('set-cookie') || '').split(';')[0];
  /* verifica 3: la conferma dell'app (protocollo nuovo, C2) */
  const conferma = async (rit, tok) => { const ok = (rit.r.headers.getSetCookie() || []).find((x) => /^lmcal_ok_google=/.test(x)) || ''; return chiedi('/api/calendari/google/conferma', {}, { gettone: tok, biscotto: ok.split(';')[0] }); };

  /* il calendario della VITTIMA (nel finto c'è un Google solo: i suoi eventi sono quelli della vittima) */
  G.metti('io@esempio.it', { id: 'priv1', summary: 'Visita oncologica (privato)', start: { dateTime: giorni(2, '09:00') }, end: { dateTime: giorni(2, '10:00') }, organizer: { self: true } });
  G.metti('io@esempio.it', { id: 'priv2', summary: 'Colloquio di lavoro segreto', start: { dateTime: giorni(5, '15:00') }, end: { dateTime: giorni(5, '16:00') }, organizer: { self: true } });

  console.log('\nA. COLLEGAMENTO A NOME DI UN ALTRO (login CSRF)');
  {
    /* 1. l'attaccante, con il SUO gettone, comincia il collegamento e NON apre il link */
    const a = await chiedi('/api/calendari/google/inizia', { ritorno: SITO + '/' }, { gettone: tokA });
    const link = a.j.url;
    esito('A1 l’attaccante ottiene un link sul dominio vero di LifeMax', /^https:\/\/lifemax\.theproject\.world\/api\/calendari\/google\/vai\?s=/.test(link || ''), link && link.slice(0, 90));
    /* 2. la vittima (altro browser, nessun biscotto) apre il link entro 10 minuti */
    const vai = await chiedi(rel(link));
    const bisV = biscottoDi(vai.r);
    esito('A2 /vai lascia il biscotto del «legame» nel browser della VITTIMA', vai.r.status === 302 && /^lmcal_google(_[A-Za-z0-9_-]+)?=/.test(bisV), vai.r.status + ' ' + bisV.slice(0, 30));
    /* 3. la vittima dice «sì» a Google (il SUO account Google) */
    const c = W.consenso(vai.r.headers.get('location'));
    const rit = await chiedi(rel(c.url), undefined, { biscotto: bisV });
    const dove = rit.r.headers.get('location') || '';
    esito('A3 il ritorno è accettato (esito=ok), anche se il giro l’ha cominciato un altro', /esito=ok/.test(dove), dove);
    /* 4. l'attaccante accende il calendario e legge lo specchio */
    const cal = await chiedi('/api/calendari/cambi', { dopo: 0, accesi: { google: ['io@esempio.it'] } }, { gettone: tokA });
    const titoli = (cal.j.eventi || []).map((e) => e.t);
    esito('A4 [VULNERABILITÀ se KO] l’attaccante NON legge il calendario della vittima', !titoli.some((t) => /oncologica|segreto/.test(t)), { titoliVisti: titoli, contoAttaccante: cal.j.conti && cal.j.conti.google && { collegato: cal.j.conti.google.collegato, email: cal.j.conti.google.email } });
    /* 5. e può scrivere nel calendario della vittima */
    const w = await chiedi('/api/calendari/scrivi', { ops: [{ k: 'x1', p: 'google', tipo: 'crea', c: 'io@esempio.it', testo: 'Evento piantato dall’attaccante', tempo: { tuttoIlGiorno: false, inizio: Date.now() + 3 * G1, fine: Date.now() + 3 * G1 + 3600e3, dataInizio: giorni(3), dataFine: giorni(3) }, chiave: 'attacco1' }] }, { gettone: tokA });
    const piantato = Object.values(G.eventi['io@esempio.it']).some((e) => /attaccante/.test(e.summary || ''));
    esito('A5 [VULNERABILITÀ se KO] l’attaccante NON scrive nel calendario della vittima', !piantato, w.j && w.j.esiti);
    const v = await chiedi('/api/calendari/cambi', { dopo: 0 }, { gettone: tokV });
    esito('A6 e la vittima, nel SUO LifeMax, non vede niente collegato (non sa di niente)', !(v.j.conti && v.j.conti.google && v.j.conti.google.collegato), v.j.conti && v.j.conti.google);
  }

  console.log('\nB. GETTONI E UID DI ALTRI');
  {
    const x = await chiedi('/api/calendari/cambi', { dopo: 0 }, { gettone: gettone('terzo'), testa: { 'x-lm-uid': 'attaccante' } });
    esito('B1 un terzo con x-lm-uid=attaccante nell’intestazione non vede lo specchio dell’attaccante', !(x.j.eventi || []).length && !(x.j.conti && x.j.conti.google && x.j.conti.google.collegato), (x.j.eventi || []).length);
    const y = await chiedi('/api/calendari/cambi', { dopo: 0, uid: 'attaccante' }, { gettone: gettone('terzo') });
    esito('B2 un uid nel corpo non conta', !(y.j.eventi || []).length);
    const s = await chiedi('/api/calendari/cambi', { dopo: 0 }, { gettone: gettone('attaccante', { corpo: { exp: Math.floor(Date.now() / 1000) + 30 } }) });
    esito('B3 gettone che scade fra 30 s: ancora valido (normale, nota)', s.r.status === 200, s.r.status);
    const sx = await chiedi('/api/calendari/cambi', { dopo: 0 }, { gettone: gettone('attaccante', { corpo: { iat: Math.floor(Date.now() / 1000) + 3600 } }) });
    esito('B4 gettone emesso «nel futuro» di un’ora: rifiutato', sx.r.status === 401, sx.r.status);
    const lungo = await chiedi('/api/calendari/cambi', { dopo: 0 }, { gettone: gettone('a'.repeat(129)) });
    esito('B5 uid più lungo di 128: rifiutato', lungo.r.status === 401, lungo.r.status);
    const ops = await chiedi('/api/calendari/scrivi', { ops: [{ k: 'y', p: 'google', tipo: 'togli', c: 'io@esempio.it', id: 'priv1' }] }, { gettone: gettone('terzo') });
    esito('B6 un utente senza collegamento non può cancellare eventi (togli)', G.eventi['io@esempio.it'].priv1.status !== 'cancelled', ops.j);
  }

  console.log('\nC. /vai E /ritorno CON STATE SBAGLIATI');
  {
    const nuovoGiro = async (tok) => { const a = await chiedi('/api/calendari/google/inizia', { ritorno: SITO + '/' }, { gettone: tok }); return a.j.url; };
    const l1 = await nuovoGiro(tokV);
    const v1 = await chiedi(rel(l1));
    const v1b = await chiedi(rel(l1));
    esito('C1 /vai usato due volte: la seconda è rifiutata', v1b.r.status === 400, v1b.r.status);
    const c1 = W.consenso(v1.r.headers.get('location'));
    const r1 = await chiedi(rel(c1.url), undefined, {});
    esito('C2 ritorno senza biscotto: «altro-browser»', /altro-browser/.test(r1.r.headers.get('location') || ''), r1.r.headers.get('location'));
    const r1b = await chiedi(rel(c1.url), undefined, { biscotto: biscottoDi(v1.r) });
    esito('C3 lo stesso ritorno ripetuto col biscotto giusto: «scaduto» (state usa e getta)', /scaduto/.test(r1b.r.headers.get('location') || ''), r1b.r.headers.get('location'));
    const r2 = await chiedi('/api/calendari/google/ritorno?state=' + 'f'.repeat(64) + '.abc&code=x');
    esito('C4 state con un id di sentinella inventato: niente (scaduto)', r2.r.status === 302 && /scaduto/.test(r2.r.headers.get('location') || ''), r2.r.headers.get('location'));
    const r3 = await chiedi('/api/calendari/google/ritorno?state=zzz&code=x');
    esito('C5 state malformato: pagina «non valido» (400)', r3.r.status === 400, r3.r.status);
    const l4 = await nuovoGiro(tokV); const v4 = await chiedi(rel(l4));
    const c4 = W.consenso(v4.r.headers.get('location'));
    const r4 = await chiedi(rel(c4.url).replace('/google/', '/microsoft/'), undefined, { biscotto: biscottoDi(v4.r).replace('lmcal_google', 'lmcal_microsoft') });
    esito('C6 ritorno di Google presentato come Microsoft: rifiutato', !/esito=ok/.test(r4.r.headers.get('location') || ''), r4.r.headers.get('location'));
    /* scaduto: 11 minuti dopo */
    const l5 = await nuovoGiro(tokV); const v5 = await chiedi(rel(l5));
    const c5 = W.consenso(v5.r.headers.get('location'));
    const vero = Date.now; Date.now = () => vero() + 11 * 60000;
    const r5 = await chiedi(rel(c5.url), undefined, { biscotto: biscottoDi(v5.r) });
    Date.now = vero;
    esito('C7 ritorno dopo 11 minuti: scaduto', /scaduto/.test(r5.r.headers.get('location') || ''), r5.r.headers.get('location'));
    const l6 = await nuovoGiro(tokV);
    const r6 = await chiedi('/api/calendari/google/inizia', { ritorno: 'https://cattivo.example/' }, { gettone: tokV });
    esito('C8 ritorno verso un sito estraneo: rifiutato', r6.j.errore === 'ritorno', r6.j);
    const r7 = await chiedi('/api/calendari/google/inizia', { ritorno: 'https://lifemax.theproject.world.cattivo.example/' }, { gettone: tokV });
    esito('C9 ritorno verso lifemax.theproject.world.cattivo.example: rifiutato', r7.j.errore === 'ritorno', r7.j);
    const r8 = await chiedi('/api/calendari/google/inizia', { ritorno: 'https://raffaele-ando.github.io/LifeMax/../altro-repo/' }, { gettone: tokV });
    esito('C10 ritorno verso un ALTRO progetto di raffaele-ando.github.io (prefisso): ' + (r8.j.errore ? 'rifiutato' : 'ACCETTATO'), !!r8.j.errore || true, r8.j);
    void l6;
  }

  console.log('\nD. DUE COLLEGAMENTI GOOGLE IN PARALLELO (due schede)');
  {
    const a1 = await chiedi('/api/calendari/google/inizia', { ritorno: SITO + '/' }, { gettone: tokV });
    const a2 = await chiedi('/api/calendari/google/inizia', { ritorno: SITO + '/' }, { gettone: tokV });
    const v1 = await chiedi(rel(a1.j.url)); const v2 = await chiedi(rel(a2.j.url));
    const jar = biscottoDi(v2.r); /* il secondo biscotto sovrascrive il primo (stesso nome, stesso path) */
    const c1 = W.consenso(v1.r.headers.get('location'));
    const r1 = await chiedi(rel(c1.url), undefined, { biscotto: jar });
    esito('D1 la prima scheda finisce il «sì» dopo che la seconda è passata da /vai: ' + (/esito=ok/.test(r1.r.headers.get('location')) ? 'ok' : 'fallisce'), true, r1.r.headers.get('location'));
  }

  console.log('\nE. CHIAVE_CALENDARI CAMBIATA');
  {
    /* la vittima si collega davvero (nel SUO LifeMax) */
    const a = await chiedi('/api/calendari/google/inizia', { ritorno: SITO + '/' }, { gettone: tokV });
    const v = await chiedi(rel(a.j.url)); const c = W.consenso(v.r.headers.get('location'));
    const ritE = await chiedi(rel(c.url), undefined, { biscotto: biscottoDi(v.r) });
    const confE = await conferma(ritE, tokV);
    esito('E0 (verifica 3) la vittima conferma il suo collegamento', !!(confE.j && confE.j.ok), confE.j);
    await chiedi('/api/calendari/cambi', { dopo: 0, accesi: { google: ['io@esempio.it'] } }, { gettone: tokV });
    /* il Durable Object legge l'env condiviso del mondo: si cambia LÌ (come un segreto cambiato in Cloudflare) */
    const chiaveVecchia = env.CHIAVE_CALENDARI;
    env.CHIAVE_CALENDARI = require('crypto').randomBytes(32).toString('base64');
    const env2 = env;
    ns.dimentica();
    /* il permesso breve è ancora buono? farlo scadere per forzare decifra del refresh token */
    for (const [, s] of ns.istanze) { try { s.db.prepare('UPDATE conti SET at_scade = 0').run(); } catch (e) { /* tabella assente */ } }
    G.metti('io@esempio.it', { id: 'dopo', summary: 'Evento nuovo dopo il cambio chiave', start: { dateTime: giorni(4, '11:00') }, end: { dateTime: giorni(4, '12:00') } });
    const vero = Date.now; Date.now = () => vero() + 3 * 60000;
    const k1 = await chiedi('/api/calendari/cambi', { dopo: 0, accesi: { google: ['io@esempio.it'] } }, { gettone: tokV, env: env2 });
    Date.now = vero;
    const conto = k1.j.conti && k1.j.conti.google;
    const visto = (k1.j.eventi || []).some((e) => /dopo il cambio/.test(e.t));
    esito('E1 dopo il cambio di chiave «cambi» risponde 200 e dice ancora collegato/non revocato (l’app non sa che serve Ricollega)', !(k1.r.status === 200 && conto && conto.collegato && !conto.revocato), { stato: k1.r.status, conto: conto && { collegato: conto.collegato, revocato: conto.revocato }, eventoNuovoArrivato: visto });
    esito('E2 l’evento nuovo arriva lo stesso?', visto, { eventoNuovoArrivato: visto });
    const w = await chiedi('/api/calendari/scrivi', { ops: [{ k: 'e1', p: 'google', tipo: 'togli', c: 'io@esempio.it', id: 'priv2' }] }, { gettone: tokV, env: env2 });
    esito('E3 una scrittura: che errore riceve l’app (tipo «token» → Ricollega; «rete»/«altro» → riprova in silenzio)', !!(w.j && w.j.esiti && w.j.esiti.e1 && w.j.esiti.e1.tipo === 'token'), { http: w.r.status, esiti: w.j && w.j.esiti });
    env.CHIAVE_CALENDARI = chiaveVecchia;
    ns.dimentica();
  }

  console.log('\nF. PERMESSO DI GOOGLE SCADUTO (app «In prova»: 7 giorni) O RITIRATO');
  {
    G.rinnovi.clear(); G.scadiAccessi();
    for (const [, s] of ns.istanze) { try { s.db.prepare('UPDATE conti SET at_scade = 0').run(); } catch (e) { /* niente */ } }
    await chiedi('/api/calendari/scrivi', { ops: [{ k: 'f1', p: 'google', tipo: 'togli', c: 'io@esempio.it', id: 'priv1' }] }, { gettone: tokV });
    const vero = Date.now; Date.now = () => vero() + 5 * 60000;
    const k = await chiedi('/api/calendari/cambi', { dopo: 0 }, { gettone: tokV });
    Date.now = vero;
    esito('F1 dopo invalid_grant il conto risulta «revocato» (l’app può dire Ricollega)', !!(k.j.conti && k.j.conti.google && k.j.conti.google.revocato), k.j.conti && k.j.conti.google && { revocato: k.j.conti.google.revocato });
    let coda = [];
    for (const [, s] of ns.istanze) { try { coda = coda.concat(s.db.prepare('SELECT k, stato, tent FROM coda').all()); } catch (e) { /* niente */ } }
    esito('F2 la modifica fatta mentre il permesso era scaduto resta in coda (non persa)', coda.some((r) => r.k === 'f1' && r.stato === 'attesa'), coda.filter((r) => r.k === 'f1'));
    /* la sveglia continua comunque ogni 10 minuti per sempre? */
    let sveglie = 0;
    for (const [, s] of ns.istanze) if (s.sveglia) sveglie++;
    esito('F3 nota: sentinelle con sveglia attiva anche se il permesso è revocato', true, sveglie);
  }

  console.log('\nG. SEGRETI MANCANTI');
  {
    for (const [nome, patch] of [['senza GOOGLE_CLIENT_SECRET', { GOOGLE_CLIENT_SECRET: '' }], ['senza MICROSOFT_CLIENT_SECRET', { MICROSOFT_CLIENT_SECRET: '' }], ['CHIAVE_CALENDARI corta (31)', { CHIAVE_CALENDARI: 'x'.repeat(31) }], ['senza niente', { GOOGLE_CLIENT_SECRET: '', MICROSOFT_CLIENT_SECRET: '', CHIAVE_CALENDARI: '' }]]) {
      const salvati = {}; Object.keys(patch).forEach((k) => { salvati[k] = env[k]; env[k] = patch[k]; });
      const e2 = env; ns.dimentica();
      const s = await chiedi('/api/calendari/stato', undefined, { env: e2 });
      const c = await chiedi('/api/calendari/cambi', { dopo: 0 }, { gettone: tokV, env: e2 });
      const sc = await chiedi('/api/calendari/google/scollega', {}, { gettone: gettone('nessuno'), env: e2 });
      Object.keys(salvati).forEach((k) => { env[k] = salvati[k]; }); ns.dimentica();
      esito('G ' + nome + ': stato ' + JSON.stringify(s.j.servizio) + ', cambi ' + c.r.status + ', scollega ' + sc.r.status, s.r.status === 200 && c.r.status < 500, { cambi: c.r.status, conti: c.j.conti && c.j.conti.google && { servizio: c.j.conti.google.servizio, collegato: c.j.conti.google.collegato } });
    }
  }

  console.log('\nH. IL PROXY /__/auth (nel Worker, attivo in produzione)');
  {
    const visti = [];
    const prima = globalThis.fetch;
    globalThis.fetch = async (url, opz) => {
      const u = typeof url === 'string' ? url : url.url;
      if (/firebaseapp\.com/.test(u)) {
        visti.push({ u, h: Object.fromEntries(new Headers((opz && opz.headers) || {}).entries()) });
        return new Response('<html>handler</html>', { status: 200, headers: { 'Set-Cookie': 'x=1; Path=/', 'Strict-Transport-Security': 'max-age=31556926; includeSubDomains; preload', 'Content-Type': 'text/html' } });
      }
      return prima(url, opz);
    };
    const r = await worker.fetch(new Request(SITO + '/__/auth/handler?apiKey=k', { headers: { Cookie: 'lmcal_google=SEGRETO; altro=1', Authorization: 'Bearer abc', 'X-Forwarded-For': '1.2.3.4' } }), env, {});
    const r2 = await worker.fetch(new Request(SITO + '/__/auth/../../api/calendari/stato'), env, {});
    const r3 = await worker.fetch(new Request(SITO + '/__/firebase/%2e%2e/%2e%2e/x'), env, {});
    globalThis.fetch = prima;
    const h = visti[0] ? visti[0].h : {};
    esito('H1 il proxy inoltra a firebaseapp.com i biscotti del dominio (cookie)', !h.cookie, { cookieInoltrato: h.cookie || '', authorization: h.authorization || '' });
    esito('H2 e rimanda indietro Set-Cookie/HSTS di firebaseapp.com sul dominio di LifeMax (nota)', true, { setCookie: r.headers.get('set-cookie'), hsts: r.headers.get('strict-transport-security') });
    esito('H3 niente traversata fuori da /__/auth', visti.length === 1 || visti.every((v) => /\/__\/(auth|firebase)\//.test(new URL(v.u).pathname)), visti.map((v) => v.u));
    void r2; void r3;
  }

  console.log('\nI. IL CRON DI RISERVA');
  {
    for (let i = 0; i < 45; i++) {
      const t = gettone('u-cron-' + i);
      const a = await chiedi('/api/calendari/google/inizia', { ritorno: SITO + '/' }, { gettone: t });
      const v = await chiedi(rel(a.j.url)); const c = W.consenso(v.r.headers.get('location'));
      const rit = await chiedi(rel(c.url), undefined, { biscotto: biscottoDi(v.r) });
      await conferma(rit, t);
    }
    for (const [, s] of ns.istanze) s.sveglia = null; /* tutte le sveglie perse */
    await worker.scheduled({}, env, {});
    let riarmate = 0; for (const [, s] of ns.istanze) if (s.sveglia) riarmate++;
    esito('I1 con 45+ persone e tutte le sveglie perse, il cron le riarma tutte', riarmate >= 45, { riarmate });
  }

  console.log('\nJ. CALENDARIO SPENTO E RIACCESO DA DUE DISPOSITIVI');
  {
    const t = gettone('due-disp');
    const a = await chiedi('/api/calendari/google/inizia', { ritorno: SITO + '/' }, { gettone: t });
    const v = await chiedi(rel(a.j.url)); const c = W.consenso(v.r.headers.get('location'));
    await chiedi(rel(c.url), undefined, { biscotto: biscottoDi(v.r) });
    const d1 = await chiedi('/api/calendari/cambi', { dopo: 0, accesi: { google: ['io@esempio.it'] } }, { gettone: t });
    const seq1 = d1.j.seq;
    /* il telefono (dati vecchi) dice «spento»; il PC (dati nuovi) chiede le novità dopo seq1 con «acceso» */
    await chiedi('/api/calendari/cambi', { dopo: seq1, accesi: { google: [] } }, { gettone: t });
    const vero = Date.now; Date.now = () => vero() + 3 * 60000;
    const d3 = await chiedi('/api/calendari/cambi', { dopo: seq1, accesi: { google: ['io@esempio.it'] } }, { gettone: t });
    Date.now = vero;
    esito('J1 spento/riacceso da due dispositivi: il secondo riceve di nuovo gli eventi (completo o tutti)', (d3.j.eventi || []).length >= 2 || d3.j.completo, { seq1, seq3: d3.j.seq, eventi: (d3.j.eventi || []).length, completo: d3.j.completo });
  }

  fs.writeFileSync(path.join(AUDIT, 'consegna', 'risultati', 'c01-adattato-conferma.json'), JSON.stringify({ script: 'c01', quando: new Date().toISOString(), risultati }, null, 2));
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
