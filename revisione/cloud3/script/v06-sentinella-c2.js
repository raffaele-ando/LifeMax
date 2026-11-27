/* V06 — LA SENTINELLA DOPO LE CORREZIONI (C2, M2, m2, m3, m4), da avversario.
   Worker vero del worktree, mondo finto (prove/comune/sentinella-finta.js):
   nessuna richiesta esce (fetch di Node sostituito).
     K  il giro completo con la conferma: attributi del biscotto, conferma
        dell'attaccante col biscotto «indovinato», conferma della vittima
     L  i permessi della vittima restano nella sentinella dell'attaccante
        («pendenti») anche dopo i dieci minuti?
     M  il cron a rotazione: 45 persone COLLEGATE (con la conferma), sveglie
        perse: in quante ore tornano tutte?
     N  chiave cambiata per sbaglio e poi rimessa: il conto resta «revocato»?
     P  proxy /__/auth: intestazioni in uscita e in entrata
   node v06-sentinella-c2.js */
'use strict';
const path = require('path'), fs = require('fs');
const AUDIT = path.join(__dirname, '..', '..');
const RADICE = process.env.RADICE || path.join(AUDIT, 'wt');
const { mondo, gettone } = require(path.join(RADICE, 'prove', 'comune', 'sentinella-finta.js'));
const risultati = [];
const esito = (s, ok, d) => { risultati.push({ scenario: s, ok, dettaglio: d }); console.log((ok ? '  ok  ' : '  KO  ') + s + (d !== undefined ? '  -> ' + (typeof d === 'string' ? d : JSON.stringify(d)).slice(0, 500) : '')); };
const SITO = 'https://lifemax.theproject.world';

(async () => {
  const W = await mondo();
  const { G, env, ns, worker } = W;
  async function chiedi(via, corpo, o) {
    o = o || {};
    const h = Object.assign({ Origin: SITO }, o.testa || {});
    if (o.biscotto) h.Cookie = o.biscotto;
    const req = new Request(SITO + via, corpo === undefined ? { method: 'GET', headers: h }
      : { method: 'POST', headers: Object.assign(h, { 'Content-Type': 'text/plain;charset=UTF-8' }), body: JSON.stringify(Object.assign({ gettone: o.gettone }, corpo)) });
    const r = await worker.fetch(req, env, { waitUntil() {} });
    const t = await r.text(); let j; try { j = JSON.parse(t); } catch { j = t; }
    return { r, j, biscotti: r.headers.getSetCookie ? r.headers.getSetCookie() : [] };
  }
  const rel = (u) => new URL(u).pathname + new URL(u).search;
  const valore = (lista, nome) => { const b = lista.find((x) => x.indexOf(nome + '=') === 0); return b ? b.split(';')[0] : ''; };
  /* il giro come lo fa un browser: inizia (app) → vai → Google → ritorno → conferma (app) */
  async function collega(tokInizia, tokConferma, o) {
    o = o || {};
    const a = await chiedi('/api/calendari/google/inizia', { ritorno: SITO + '/' }, { gettone: tokInizia });
    const vai = await chiedi(rel(a.j.url));
    const legame = vai.biscotti[0] ? vai.biscotti[0].split(';')[0] : '';
    const c = W.consenso(vai.r.headers.get('location'));
    const rit = await chiedi(rel(c.url), undefined, { biscotto: legame });
    const ok = rit.biscotti.find((x) => /^lmcal_ok_google=/.test(x)) || '';
    const conf = o.niente ? null : await chiedi('/api/calendari/google/conferma', {}, { gettone: tokConferma, biscotto: o.biscotto !== undefined ? o.biscotto : ok.split(';')[0] });
    return { ritorno: rit.r.headers.get('location'), biscottoOk: ok, conferma: conf && conf.j, puliti: conf ? conf.biscotti : [] };
  }
  const contoDi = async (tok) => { const r = await chiedi('/api/calendari/cambi', { dopo: 0, accesi: { google: ['io@esempio.it'] } }, { gettone: tok }); return { collegato: !!(r.j.conti && r.j.conti.google && r.j.conti.google.collegato), revocato: !!(r.j.conti && r.j.conti.google && r.j.conti.google.revocato), titoli: (r.j.eventi || []).map((e) => e.t) }; };
  G.metti('io@esempio.it', { id: 'p1', summary: 'Visita oncologica (privato)', start: { dateTime: new Date(Date.now() + 2 * 864e5).toISOString() }, end: { dateTime: new Date(Date.now() + 2 * 864e5 + 36e5).toISOString() }, organizer: { self: true } });

  console.log('\nK. LA CONFERMA');
  {
    const tA = gettone('attaccante'), tV = gettone('vittima');
    const g = await collega(tA, tV);
    esito('K1 il biscotto della conferma è HttpOnly, Secure, SameSite=Lax, solo su /api/calendari/, 10 minuti', /HttpOnly/.test(g.biscottoOk) && /Secure/.test(g.biscottoOk) && /SameSite=Lax/.test(g.biscottoOk) && /Path=\/api\/calendari\//.test(g.biscottoOk) && /Max-Age=600/.test(g.biscottoOk), g.biscottoOk.replace(/=[0-9a-f]{64}\.[\w-]+/, '=<id>.<segreto>'));
    esito('K2 link dell’attaccante aperto dalla vittima: il ritorno dice «da-confermare», non «ok»', /esito=da-confermare/.test(g.ritorno || ''), g.ritorno);
    esito('K3 la conferma della vittima (suo gettone, suo browser) va alla SUA sentinella e non collega niente', g.conferma && !!g.conferma.errore && !g.conferma.ok, g.conferma);
    const idA = W.ns.idFromName('attaccante').toString();
    const finto = await chiedi('/api/calendari/google/conferma', {}, { gettone: tA, biscotto: 'lmcal_ok_google=' + idA + '.indovinato' });
    const finto2 = await chiedi('/api/calendari/google/conferma', { biscotto: idA + '.indovinato' }, { gettone: tA });
    const cA = await contoDi(tA), cV = await contoDi(tV);
    esito('K4 l’attaccante non conferma con un biscotto inventato né col segreto nel corpo', finto.j.errore === 'altro-browser' && !!finto2.j.errore && !cA.collegato && !cA.titoli.length, { finto: finto.j.errore, nelCorpo: finto2.j.errore, attaccante: cA });
    esito('K5 la vittima non risulta collegata (nessun effetto collaterale)', !cV.collegato, cV);
    const leg = await collega(tV, tV);
    const cV2 = await contoDi(tV);
    esito('K6 controllo: il giro normale (stesso account, stesso browser) collega e legge', leg.conferma && leg.conferma.ok && cV2.collegato && cV2.titoli.length > 0, { conferma: leg.conferma, conto: cV2 });
    esito('K7 dopo la conferma il biscotto si cancella', leg.puliti.some((x) => /^lmcal_ok_google=;/.test(x) && /Max-Age=0/.test(x)), leg.puliti);
  }

  console.log('\nL. I PERMESSI DELLA VITTIMA NELLA SENTINELLA DELL’ATTACCANTE');
  {
    const tA = gettone('attaccante2'), tV = gettone('vittima2');
    await collega(tA, tV);
    const s = ns.istanze.get(ns.idFromName('attaccante2').toString());
    const vero = Date.now; Date.now = () => vero() + 30 * 60000;
    try { await chiedi('/api/calendari/cambi', { dopo: 0 }, { gettone: gettone('attaccante2') }); if (s && s.obj && s.obj.alarm) await s.obj.alarm(); } catch (e) { /* niente */ }
    Date.now = vero;
    const righe = s ? s.db.prepare('SELECT p, scade, length(rt) AS rt FROM pendenti').all().map((r) => Object.assign({}, r)) : [];
    esito('L1 scaduti i dieci minuti (qui: trenta), il refresh token della vittima NON resta nella sentinella dell’attaccante', !righe.length, { pendenti: righe.map((r) => ({ p: r.p, scadeDopoMin: Math.round((r.scade - vero()) / 60000), rtCifratoCaratteri: r.rt })), nota: 'la riga si cancella solo a un nuovo ritorno o a una conferma dell’attaccante; è cifrata e senza il segreto non si usa' });
  }

  console.log('\nM. IL CRON A ROTAZIONE (45 persone collegate davvero)');
  {
    for (let i = 0; i < 45; i++) { const t = gettone('cron-' + i); await collega(t, t); }
    const el = ns.istanze.get(ns.idFromName('__elenco').toString());
    const iscritti = el ? el.db.prepare('SELECT COUNT(*) AS n FROM elenco').get().n : 0;
    const visti = new Set(); const vero = Date.now; const perOra = [];
    for (let ora = 0; ora < 3; ora++) {
      for (const [, s] of ns.istanze) s.sveglia = null;
      Date.now = () => vero() + ora * 3600000;
      await worker.scheduled({}, env, {});
      Date.now = vero;
      let n = 0; for (const [h, s] of ns.istanze) if (s.sveglia) { visti.add(h); n++; }
      perOra.push(n);
    }
    esito('M1 dopo la conferma, la sentinella è nell’elenco del cron', iscritti >= 45, { iscritti });
    esito('M2 sveglie perse: in due ore il cron le riarma tutte (40 all’ora a rotazione)', visti.size >= iscritti, { riarmatePerOra: perOra, diverseInTutto: visti.size, iscritti });
  }

  console.log('\nN. CHIAVE CAMBIATA PER SBAGLIO E POI RIMESSA');
  {
    const t = gettone('nina'); await collega(t, t);
    const prima = await contoDi(t);
    const giusta = env.CHIAVE_CALENDARI;
    env.CHIAVE_CALENDARI = require('crypto').randomBytes(32).toString('base64'); ns.dimentica && ns.dimentica();
    for (const [, s] of ns.istanze) { try { s.db.prepare('UPDATE conti SET at_scade = 0').run(); } catch (e) { /* niente */ } }
    const vero = Date.now; Date.now = () => vero() + 5 * 60000;
    const durante = await contoDi(t);
    env.CHIAVE_CALENDARI = giusta; ns.dimentica && ns.dimentica();
    Date.now = () => vero() + 10 * 60000;
    const dopo = await contoDi(t);
    Date.now = vero;
    esito('N1 [M2] chiave sbagliata: il conto si segna «revocato» (l’app chiederà Ricollega)', durante.revocato, { prima, durante });
    esito('N2 [rischio] rimessa la chiave giusta, il collegamento riparte da solo (senza Ricollega)', !dopo.revocato, { dopo });
  }

  console.log('\nR. m3: PERMESSO RITIRATO, CODA VUOTA → NESSUNA SVEGLIA');
  {
    const t = gettone('rita'); await collega(t, t);
    const h = ns.idFromName('rita').toString(); const s = ns.istanze.get(h);
    const vero = Date.now;
    s.db.prepare("UPDATE conti SET stato = 'revocato'").run(); s.db.prepare('DELETE FROM coda').run();
    s.sveglia = vero() - 1; await ns.suona(false);
    const dopoRevoca = s.sveglia;
    s.db.prepare("UPDATE conti SET stato = 'ok'").run();
    s.sveglia = vero() - 1; await ns.suona(false);
    esito('R1 [m3] conto ritirato e coda vuota: la sentinella non si rimette la sveglia', dopoRevoca === null, { sveglia: dopoRevoca });
    esito('R2 controllo: conto vivo → la sveglia si rimette', s.sveglia !== null, { sveglia: s.sveglia });
  }

  console.log('\nD. m5: DUE COLLEGAMENTI INSIEME (due schede), con un barattolo di biscotti come quello del browser');
  {
    const t = gettone('dora');
    const a1 = await chiedi('/api/calendari/google/inizia', { ritorno: SITO + '/' }, { gettone: t });
    const a2 = await chiedi('/api/calendari/google/inizia', { ritorno: SITO + '/' }, { gettone: t });
    const v1 = await chiedi(rel(a1.j.url)); const v2 = await chiedi(rel(a2.j.url));
    const barattolo = {}; for (const v of [v1, v2]) for (const b of v.biscotti) { const c = b.split(';')[0]; const i = c.indexOf('='); barattolo[c.slice(0, i)] = c.slice(i + 1); }
    const jar = Object.keys(barattolo).map((k) => k + '=' + barattolo[k]).join('; ');
    const c1 = W.consenso(v1.r.headers.get('location'));
    const r1 = await chiedi(rel(c1.url), undefined, { biscotto: jar });
    esito('D1b [m5] la prima scheda finisce il «sì» dopo che la seconda è passata da /vai (due biscotti diversi)', /esito=da-confermare/.test(r1.r.headers.get('location') || ''), { biscotti: Object.keys(barattolo), ritorno: r1.r.headers.get('location') });
  }

  console.log('\nP. IL PROXY /__/auth');
  {
    const visti = []; const prima = globalThis.fetch;
    globalThis.fetch = async (url, opz) => {
      const u = typeof url === 'string' ? url : url.url;
      if (/firebaseapp\.com/.test(u)) {
        visti.push({ u, h: Object.fromEntries(new Headers((opz && opz.headers) || {}).entries()) });
        const hh = new Headers({ 'Content-Type': 'text/html', 'Strict-Transport-Security': 'max-age=31556926; includeSubDomains; preload' });
        hh.append('Set-Cookie', 'a=1; Path=/'); hh.append('Set-Cookie', 'b=2; Path=/; Domain=theproject.world');
        return new Response('<html>handler</html>', { status: 200, headers: hh });
      }
      return prima(url, opz);
    };
    const r = await worker.fetch(new Request(SITO + '/__/auth/handler?apiKey=k', { headers: { Cookie: 'lmcal_google_x=SEGRETO; lmcal_ok_google=ALTRO', Authorization: 'Bearer abc', 'Proxy-Authorization': 'Basic xyz', 'X-Forwarded-For': '1.2.3.4' } }), env, {});
    const r2 = await worker.fetch(new Request(SITO + '/__/firebase/init.json', { headers: { COOKIE: 'x=1', authorization: 'Bearer z' } }), env, {});
    globalThis.fetch = prima;
    const h = visti[0] ? visti[0].h : {}, h2 = visti[1] ? visti[1].h : {};
    esito('P1 in uscita verso firebaseapp.com: niente Cookie né Authorization (anche scritti in maiuscolo)', !h.cookie && !h.authorization && !h2.cookie && !h2.authorization, { uscita1: Object.keys(h), uscita2: Object.keys(h2) });
    esito('P2 in uscita: Proxy-Authorization (nota: non tolta)', true, { proxyAuthorization: h['proxy-authorization'] || null });
    esito('P3 in entrata: niente Set-Cookie né HSTS sul dominio di LifeMax', !r.headers.get('set-cookie') && !r.headers.get('strict-transport-security') && !r2.headers.get('set-cookie'), { setCookie: r.headers.get('set-cookie'), hsts: r.headers.get('strict-transport-security') });
  }

  fs.writeFileSync(path.join(AUDIT, 'consegna', 'risultati', 'v06-sentinella-c2.json'), JSON.stringify({ script: 'v06', quando: new Date().toISOString(), radice: RADICE, risultati }, null, 2));
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
