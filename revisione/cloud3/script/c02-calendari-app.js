/* C02 — I CALENDARI NELL'APP VERA, DAVANTI ALLA SENTINELLA VERA (Worker del commit
   sotto esame), con Google/Microsoft finti (prove/comune/sentinella-finta.js) e un
   Firebase finto che permette di CAMBIARE ACCOUNT (Mario → esce → Luigi).
   Nessuna richiesta esce: il Worker parla con il fetch finto, il browser ha tutto
   bloccato tranne il sito locale.
   1 collegare, importare, fantasmi       2 cambiato da tutte e due le parti
   3 cancellato nel calendario (fatto / non fatto)   4 tutto il giorno, più giorni, ricorrenti
   5 una cancellazione che Google rifiuta UNA volta: la coda «avvelenata»
   6 permesso scaduto/revocato (Google «In prova»)  7 CHIAVE_CALENDARI cambiata
   8 Mario esce: cosa resta del suo calendario sul dispositivo   9 entra Luigi
   node c02-calendari-app.js */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const AUDIT = path.join(__dirname, '..', '..');
const RADICE = path.join(AUDIT, 'wt');
const { mondo, gettone } = require(path.join(RADICE, 'prove', 'comune', 'sentinella-finta.js'));
const { chromium } = require('playwright');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const PORTA = +(process.env.PORTA_C02 || 8971), SITO = 'http://localhost:' + PORTA;
const risultati = [];
const esito = (s, ok, d) => { risultati.push({ scenario: s, ok, dettaglio: d }); console.log((ok ? '  ok  ' : '  KO  ') + s + (d !== undefined ? '  -> ' + (typeof d === 'string' ? d : JSON.stringify(d)).slice(0, 500) : '')); };
const aspetta = (ms) => new Promise((r) => setTimeout(r, ms));

const FINTO_APP = 'export function initializeApp() { return { finto: true }; }';
const FINTO_AUTH = `
const B = (window.__fb = window.__fb || { cbs: [] });
const fatto = (v) => v ? { uid: v.uid, email: v.email, displayName: v.uid, photoURL: null, getIdToken: function () { return window.__gettone(v.uid); } } : null;
B.utente = (function () { try { return fatto(JSON.parse(localStorage.getItem('__fbutente') || 'null')); } catch (e) { return null; } })();
export function getAuth() { return { finto: true }; }
export function onAuthStateChanged(a, cb) { B.cbs.push(cb); setTimeout(() => cb(B.utente), 0); return () => {}; }
export function GoogleAuthProvider() { this.setCustomParameters = () => {}; }
export const browserLocalPersistence = 'locale';
export function setPersistence() { return Promise.resolve(); }
export function signInWithPopup() { const v = window.__prossimo || { uid: 'mario', email: 'mario@prova.it' }; localStorage.setItem('__fbutente', JSON.stringify(v)); B.utente = fatto(v); B.cbs.forEach((cb) => cb(B.utente)); return Promise.resolve(); }
export function signInWithRedirect() { return signInWithPopup(); }
export function getRedirectResult() { return Promise.resolve(null); }
export function signOut() { localStorage.removeItem('__fbutente'); B.utente = null; B.cbs.forEach((cb) => cb(null)); return Promise.resolve(); }`;
const FINTO_FS = `
export function getFirestore() { return { finto: true }; }
export function initializeFirestore() { return { finto: true }; }
export function doc() { return { via: [].slice.call(arguments, 1).join('/') }; }
export function collection() { return { via: [].slice.call(arguments, 1).join('/') }; }
export function getDoc() { return Promise.resolve({ exists: () => false, data: () => null, id: 'x' }); }
export function getDocs() { return Promise.resolve({ forEach: () => {} }); }
export function setDoc() { return Promise.resolve(); }
export function onSnapshot() { return function () {}; }
export function serverTimestamp() { return {}; }
export function deleteDoc() { return Promise.resolve(); }
export function writeBatch() { const b = { set() { return b; }, delete() { return b; }, commit: () => Promise.resolve() }; return b; }
export async function runTransaction(db, f) { const tx = { get: () => Promise.resolve({ exists: () => false, data: () => undefined, id: 'x' }), set() { return tx; }, delete() { return tx; } }; return f(tx); }`;

(async () => {
  const W = await mondo({ indirizzo: SITO, ritorni: SITO + '/', origini: SITO });
  const { G, ns, worker, env } = W;
  /* Google che rifiuta UNA cancellazione con un 400 (un intoppo qualunque, non «rete») */
  const finto = globalThis.fetch; let rifiutaUna = '';
  globalThis.fetch = async (url, o) => {
    const u = typeof url === 'string' ? url : url.url;
    if (rifiutaUna && /www\.googleapis\.com/.test(u) && (o && o.method) === 'DELETE' && u.indexOf(rifiutaUna) >= 0) { rifiutaUna = ''; return new Response(JSON.stringify({ error: { message: 'Bad Request' } }), { status: 400, headers: { 'Content-Type': 'application/json' } }); }
    return finto(url, o);
  };
  const srv = http.createServer(async (q, r) => {
    if (q.url.indexOf('/api/') === 0) {
      const pezzi = []; for await (const c of q) pezzi.push(c);
      const h = new Headers(); Object.keys(q.headers).forEach((k) => { const v = q.headers[k]; if (typeof v === 'string') h.set(k, v); });
      const risp = await worker.fetch(new Request(SITO + q.url, { method: q.method, headers: h, body: q.method === 'GET' || q.method === 'HEAD' ? undefined : Buffer.concat(pezzi) }), env, { waitUntil() {} });
      const testa = {}; risp.headers.forEach((v, k) => { testa[k] = v; });
      if (testa.location && /^https:\/\/accounts\.google\.com\//.test(testa.location)) testa.location = W.consenso(testa.location).url;
      r.writeHead(risp.status, testa); r.end(Buffer.from(await risp.arrayBuffer())); return;
    }
    let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
    fs.readFile(path.join(RADICE, p), (e, d) => { if (e) { r.statusCode = 404; r.end('x'); return; } r.setHeader('Content-Type', T[path.extname(p)] || 'application/octet-stream'); r.end(d); });
  });
  await new Promise((r) => srv.listen(PORTA, r));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
  const bloccati = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, timezoneId: 'Europe/Rome', locale: 'it-IT', deviceScaleFactor: 1 });
  await ctx.route((u) => { const h = new URL(u).hostname; return h !== 'localhost'; }, (route) => {
    const u = route.request().url();
    if (/gstatic\.com\/firebasejs/.test(u)) return route.fulfill({ status: 200, contentType: 'text/javascript', body: /firebase-app/.test(u) ? FINTO_APP : /firebase-auth/.test(u) ? FINTO_AUTH : FINTO_FS });
    bloccati.push(u.slice(0, 120)); return route.abort();
  });
  await ctx.exposeFunction('__gettone', (uid) => gettone(uid));
  const errori = [];
  const apri = async () => { const p = await ctx.newPage(); p.on('pageerror', (e) => errori.push(String(e).split('\n')[0])); await p.goto(SITO + '/index.html'); await p.waitForTimeout(1500); return p; };
  const apriPannello = async (p) => { await p.evaluate(() => { location.hash = '#/profilo'; }); await p.waitForTimeout(500); await p.evaluate(() => { const r = document.getElementById('imp-calendari'); if (r) r.click(); }); await p.waitForTimeout(800); };
  const giro = (p) => p.evaluate(() => window.__PROVE__.calendari.sincronizza('prova'));
  const collegate = (p) => p.evaluate(() => LM.load().azioni.filter((a) => a.esterno && a.esterno.prov === 'google').map((a) => ({ id: a.id, ev: a.esterno.id, testo: a.testo, data: a.data, ora: a.ora, durata: a.durata, done: !!a.done })));
  const foto = (p, n) => p.screenshot({ path: path.join(AUDIT, 'consegna', 'schermate', n + '.png') }).catch(() => {});
  const accedi = async (p, uid) => { await p.evaluate((u) => { window.__prossimo = { uid: u, email: u + '@prova.it' }; return window.LMCloud.signIn(); }, uid); await p.waitForTimeout(2500); };

  let p = await apri();
  await p.evaluate(() => { const s = LM.load(); s.onboarded = true; LM.save(); }); await p.reload(); await p.waitForTimeout(1500);
  const oggi = await p.evaluate(() => LM.todayKey());
  const piu = (n) => { const d = new Date(oggi + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const ora = (g, hh) => ({ dateTime: g + 'T' + hh + ':00+01:00' });
  const CAL = 'lavoro@gruppo';
  G.metti(CAL, { id: 'priv', summary: 'Terapia di coppia (privato di Mario)', start: ora(piu(1), '18:00'), end: ora(piu(1), '19:00'), organizer: { self: true } });
  G.metti(CAL, { id: 'conf', summary: 'Riunione da cambiare', start: ora(piu(2), '10:00'), end: ora(piu(2), '11:00'), organizer: { self: true } });
  G.metti(CAL, { id: 'canc1', summary: 'Da cancellare là (non fatta)', start: ora(oggi, '23:00'), end: ora(oggi, '23:30'), organizer: { self: true } });
  G.metti(CAL, { id: 'canc2', summary: 'Da cancellare là (fatta)', start: ora(oggi, '22:00'), end: ora(oggi, '22:30'), organizer: { self: true } });
  G.metti(CAL, { id: 'tutto', summary: 'Ferie (tutto il giorno, 3 giorni)', start: { date: piu(5) }, end: { date: piu(8) }, organizer: { self: true } });
  G.metti(CAL, { id: 'rec_1', recurringEventId: 'rec', summary: 'Palestra (ricorrente)', start: ora(piu(3), '07:00'), end: ora(piu(3), '08:00'), organizer: { self: true } });
  G.metti(CAL, { id: 'rec_2', recurringEventId: 'rec', summary: 'Palestra (ricorrente)', start: ora(piu(10), '07:00'), end: ora(piu(10), '08:00'), organizer: { self: true } });
  G.metti(CAL, { id: 'poison', summary: 'Da togliere (Google dirà 400 una volta)', start: ora(piu(4), '12:00'), end: ora(piu(4), '13:00'), organizer: { self: true } });
  G.metti(CAL, { id: 'lontano', summary: 'Matrimonio (fra 300 giorni)', start: { date: piu(300) }, end: { date: piu(301) }, organizer: { self: true } });

  /* 1 */
  await accedi(p, 'mario');
  await apriPannello(p);
  await Promise.all([p.waitForNavigation({ url: /lmcal=google/ }).catch(() => null), p.click('#cal-google-collega').catch(() => null)]);
  await p.waitForTimeout(2500);
  await p.click('#cal-google [data-cal="' + CAL + '"]').catch(() => {}); await p.waitForTimeout(400);
  await giro(p);
  let az = await collegate(p);
  const per = (e) => az.find((a) => a.ev === e) || {};
  esito('1.1 Mario collega Google dalla sentinella e importa', ['priv', 'conf', 'canc1', 'canc2', 'tutto', 'rec_1', 'rec_2', 'poison'].every((e) => per(e).id), az.map((a) => a.ev));
  const fant = await p.evaluate((k) => LM.azioniDelGiorno(k).filter((a) => a.fantasma).map((a) => a.testo), piu(300));
  esito('1.2 il fantasma fra 300 giorni si vede', fant.length === 1, fant);
  esito('4.1 tutto il giorno su 3 giorni: un’attività senza orario il primo giorno', per('tutto').ora === null && per('tutto').data === piu(5), per('tutto'));
  esito('4.2 le occorrenze di un evento ricorrente sono attività separate', per('rec_1').data === piu(3) && per('rec_2').data === piu(10), [per('rec_1'), per('rec_2')]);
  await p.evaluate((id) => LM.spostaAzione(id, LM.addDays(LM.todayKey(), 4)), per('rec_1').id); await aspetta(300); await giro(p);
  esito('4.3 spostata UNA occorrenza in LifeMax: si sposta solo quella in Google', /T/.test(G.eventi[CAL].rec_1.start.dateTime) && G.eventi[CAL].rec_1.start.dateTime.slice(0, 10) === piu(4) && G.eventi[CAL].rec_2.start.dateTime.slice(0, 10) === piu(10), { rec1: G.eventi[CAL].rec_1.start, rec2: G.eventi[CAL].rec_2.start });

  /* 2: cambiato da tutte e due le parti */
  await p.evaluate((id) => LM.setOraAzione(id, '15:00'), per('conf').id);
  G.metti(CAL, Object.assign({}, G.eventi[CAL].conf, { summary: 'Riunione spostata da loro', start: ora(piu(2), '16:00'), end: ora(piu(2), '17:00') }));
  await ns.suona(true); await aspetta(300);
  await giro(p);
  az = await collegate(p);
  const dia = await p.evaluate(() => (LM.load().registro || []).filter((r) => r.cat === 'calendario').map((r) => r.testo).slice(-3));
  esito('2.1 cambiata qui e là: vince il calendario, e il Diario lo racconta', per('conf').ora === '16:00' && per('conf').testo === 'Riunione spostata da loro' && dia.some((t) => /calendario/.test(t)), { riga: per('conf'), diario: dia, google: G.eventi[CAL].conf.start });

  /* 3: cancellati nel calendario */
  await p.evaluate((id) => LM.completaAzione(id), per('canc2').id);
  G.togli(CAL, 'canc1'); G.togli(CAL, 'canc2');
  await ns.suona(true); await giro(p);
  const dopoC = await p.evaluate(() => LM.load().azioni.filter((a) => /Da cancellare là/.test(a.testo)).map((a) => ({ testo: a.testo, done: !!a.done, esterno: a.esterno === undefined ? 'undefined' : a.esterno === null ? 'staccata' : 'collegata' })));
  esito('3.1 cancellato là: la non fatta sparisce, la fatta resta staccata', dopoC.length === 1 && dopoC[0].done && dopoC[0].esterno === 'staccata', dopoC);

  /* 5: la coda avvelenata */
  rifiutaUna = '/poison';
  await p.evaluate((id) => LM.rimuoviAzione(id), per('poison').id); await aspetta(300);
  await giro(p);
  const e5a = await p.evaluate(() => (LM.load().profilo.calendari.esito || {}).testo || '');
  G.metti(CAL, { id: 'nuovo-dopo', summary: 'Evento nuovo, aggiunto in Google dopo l’intoppo', start: ora(piu(2), '09:00'), end: ora(piu(2), '09:30'), organizer: { self: true } });
  await ns.suona(true);
  for (let i = 0; i < 3; i++) { await aspetta(300); await giro(p); }
  az = await collegate(p);
  const e5b = await p.evaluate(() => (LM.load().profilo.calendari.esito || {}).testo || '');
  esito('5.1 Google rifiuta una cancellazione UNA volta (400): dopo, gli altri cambiamenti continuano ad arrivare', !!per('nuovo-dopo').id, { esitoSubito: e5a, esitoDopo3Giri: e5b, nuovoImportato: !!per('nuovo-dopo').id, eventoAncoraInGoogle: G.eventi[CAL].poison.status });
  await apriPannello(p); await foto(p, 'c02-5-coda-avvelenata-pannello');
  await p.keyboard.press('Escape');

  /* 6: permesso revocato/scaduto (Google «In prova»: 7 giorni) */
  G.rinnovi.clear(); G.scadiAccessi();
  for (const [, s] of ns.istanze) { try { s.db.prepare('UPDATE conti SET at_scade = 0').run(); } catch (e) { /* niente */ } }
  await ns.suona(true);
  await p.evaluate(() => { const s = window.__PROVE__; void s; });
  await aspetta(300);
  /* il giro del server dopo 2 minuti di «freschezza» */
  const vero = Date.now; Date.now = () => vero() + 3 * 60000; await giro(p); Date.now = vero;
  await apriPannello(p);
  const v6 = await p.evaluate(() => ({ nota: window.__PROVE__.calendari.statoQui().nota, ricollega: window.__PROVE__.calendari.statoQui().ricollega, pannello: (document.getElementById('cal-google') || {}).innerText || '' }));
  await foto(p, 'c02-6-permesso-scaduto');
  esito('6.1 permesso scaduto/revocato: il pannello dice «Ricollega»', /Ricollega/.test(v6.nota + v6.pannello), v6);
  await p.keyboard.press('Escape');
  /* si ricollega */
  await apriPannello(p);
  await Promise.all([p.waitForNavigation({ url: /lmcal=google/ }).catch(() => null), p.evaluate(() => { const b = document.querySelector('#cal-google-ricollega, #cal-google-collega'); if (b) b.click(); })]);
  await p.waitForTimeout(2500); await giro(p);
  const v6b = await p.evaluate(() => window.__PROVE__.calendari.statoQui());
  esito('6.2 dopo «Ricollega» si riparte', !v6b.ricollega.google, v6b);

  /* 7: CHIAVE_CALENDARI cambiata */
  const vecchia = env.CHIAVE_CALENDARI; env.CHIAVE_CALENDARI = require('crypto').randomBytes(32).toString('base64'); ns.dimentica();
  for (const [, s] of ns.istanze) { try { s.db.prepare('UPDATE conti SET at_scade = 0').run(); } catch (e) { /* niente */ } }
  G.metti(CAL, { id: 'dopo-chiave', summary: 'Evento dopo il cambio di chiave', start: ora(piu(2), '11:00'), end: ora(piu(2), '11:30'), organizer: { self: true } });
  Date.now = () => vero() + 6 * 60000; await giro(p); Date.now = vero;
  await apriPannello(p);
  const v7 = await p.evaluate(() => ({ nota: window.__PROVE__.calendari.statoQui().nota, esito: (LM.load().profilo.calendari.esito || {}).testo, pannello: (document.getElementById('cal-google') || {}).innerText || '' }));
  az = await collegate(p);
  await foto(p, 'c02-7-chiave-cambiata');
  esito('7.1 chiave dei permessi cambiata: l’app dice di ricollegare (invece di tacere)', /Ricollega/.test(v7.nota + v7.pannello + (v7.esito || '')), Object.assign({ importato: !!per('dopo-chiave').id }, v7));
  env.CHIAVE_CALENDARI = vecchia; ns.dimentica();
  await p.keyboard.press('Escape');

  /* 8: Mario esce */
  await p.evaluate(() => window.LMCloud.signOut()); await p.waitForTimeout(2000);
  const resto = await p.evaluate((k) => {
    const out = {}; for (let i = 0; i < localStorage.length; i++) { const kk = localStorage.key(i); const v = localStorage.getItem(kk) || ''; if (/Terapia di coppia|Matrimonio/.test(v)) out[kk] = v.length; }
    return { chiavi: out, fantasmiDaOspite: LM.azioniDelGiorno(k).filter((a) => a.fantasma).length, specchioUid: (JSON.parse(localStorage.getItem('lifemax.calendari.specchio') || '{}') || {}).uid };
  }, piu(300));
  esito('8.1 [privacy] dopo «Esci» il calendario di Mario (titoli degli eventi) NON resta nel browser', !Object.keys(resto.chiavi).length, resto);
  esito('8.2 da ospite non si vedono i fantasmi di Mario', resto.fantasmiDaOspite === 0, resto.fantasmiDaOspite);

  /* 9: entra Luigi */
  await accedi(p, 'luigi'); await giro(p);
  const lu = await p.evaluate((k) => ({ fantasmi: LM.azioniDelGiorno(k).filter((a) => a.fantasma).length, collegate: LM.load().azioni.filter((a) => a.esterno).length, specchio: (JSON.parse(localStorage.getItem('lifemax.calendari.specchio') || '{}') || {}).uid, mario: /Terapia di coppia/.test(localStorage.getItem('lifemax.calendari.specchio') || '') }), piu(300));
  esito('9.1 Luigi sullo stesso dispositivo: niente calendario di Mario', lu.fantasmi === 0 && lu.collegate === 0 && !lu.mario, lu);
  const bk = await p.evaluate(() => LM.listBackups().map((x) => x.motivo + ':' + x.ricchezza));
  esito('9.2 [privacy] ma nei Backup di Luigi c’è la copia di Mario con le attività del calendario', !bk.some((x) => /^uscita-dall-account:[1-9]/.test(x)), bk);

  esito('nessun errore nella pagina', !errori.length, errori.slice(0, 5));
  esito('nessuna richiesta verso fuori (bloccate)', true, bloccati.slice(0, 10));
  fs.writeFileSync(path.join(AUDIT, 'consegna', 'risultati', 'c02-calendari-app.json'), JSON.stringify({ script: 'c02', quando: new Date().toISOString(), risultati, bloccati }, null, 2));
  await b.close(); srv.close(); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
