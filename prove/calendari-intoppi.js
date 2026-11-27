/* I CALENDARI QUANDO QUALCOSA VA STORTO — l'app vera, la sentinella vera,
   Google finto (comune/sentinella-finta.js) che ogni tanto dice di no.

   Nasce dalla verifica del 25 novembre 2026 (revisione/cloud2/), dal suo
   script c02-calendari-app.js:
    G2  Google rifiuta UNA cancellazione (un 400, non la rete): prima tutto il
        giro di Google si fermava per sette giorni, e il pannello diceva
        «Tutto allineato». Adesso gli altri cambiamenti continuano ad
        arrivare, e il pannello dice che una modifica non è stata accettata.
    M2  la chiave dei permessi della sentinella cambia: prima l'app diceva
        «Collegato» e smetteva di funzionare in silenzio; adesso chiede
        «Ricollega».
    M3  dopo «Esci», niente del calendario resta nel browser.

   node prove/calendari-intoppi.js    (CHROMIUM=/percorso/di/chrome se serve)
   Con LIFEMAX_SITO=<cartella> prova un altro costruito. */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const RADICE = process.env.LIFEMAX_SITO || require('./comune/dove').SERVITO;
const { mondo, gettone } = require('./comune/sentinella-finta');
const { chromium } = require('playwright');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const PORTA = 8864, SITO = 'http://localhost:' + PORTA;
let guai = 0;
const ok = (n, c, d) => { if (!c) guai++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (!c && d !== undefined ? '  → ' + (typeof d === 'string' ? d : JSON.stringify(d)).slice(0, 400) : '')); };
const aspetta = (ms) => new Promise((r) => setTimeout(r, ms));

/* un Firebase finto in cui si può entrare e uscire */
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
export function getDocs() { return Promise.resolve({ forEach: () => {}, docs: [] }); }
export function setDoc() { return Promise.resolve(); }
export function onSnapshot() { return function () {}; }
export function serverTimestamp() { return {}; }
export function deleteDoc() { return Promise.resolve(); }
export function writeBatch() { const b = { set() { return b; }, delete() { return b; }, commit: () => Promise.resolve() }; return b; }
export async function runTransaction(db, f) { const tx = { get: () => Promise.resolve({ exists: () => false, data: () => undefined, id: 'x' }), set() { return tx; }, delete() { return tx; } }; return f(tx); }`;

(async () => {
  const W = await mondo({ indirizzo: SITO, ritorni: SITO + '/', origini: SITO });
  const { G, ns, worker, env } = W;
  /* Google che rifiuta UNA cancellazione con un 400 */
  const finto = globalThis.fetch; let rifiutaUna = '';
  globalThis.fetch = async (url, o) => {
    const u = typeof url === 'string' ? url : url.url;
    if (rifiutaUna && /www\.googleapis\.com/.test(u) && (o && o.method) === 'DELETE' && u.indexOf(rifiutaUna) >= 0) {
      rifiutaUna = '';
      return new Response(JSON.stringify({ error: { message: 'Bad Request' } }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    return finto(url, o);
  };
  const srv = http.createServer(async (q, r) => {
    if (q.url.indexOf('/api/') === 0) {
      const pezzi = []; for await (const c of q) pezzi.push(c);
      const h = new Headers(); Object.keys(q.headers).forEach((k) => { const v = q.headers[k]; if (typeof v === 'string') h.set(k, v); });
      const risp = await worker.fetch(new Request(SITO + q.url, { method: q.method, headers: h, body: q.method === 'GET' || q.method === 'HEAD' ? undefined : Buffer.concat(pezzi) }), env, { waitUntil() {} });
      const testa = {}; risp.headers.forEach((v, k) => { if (k !== 'set-cookie') testa[k] = v; });
      const biscotti = risp.headers.getSetCookie ? risp.headers.getSetCookie() : [];
      if (biscotti.length) testa['set-cookie'] = biscotti;
      if (testa.location && /^https:\/\/accounts\.google\.com\//.test(testa.location)) testa.location = W.consenso(testa.location).url;
      r.writeHead(risp.status, testa); r.end(Buffer.from(await risp.arrayBuffer())); return;
    }
    let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
    fs.readFile(path.join(RADICE, p), (e, d) => { if (e) { r.statusCode = 404; r.end('x'); return; } r.setHeader('Content-Type', T[path.extname(p)] || 'application/octet-stream'); r.end(d); });
  });
  await new Promise((r) => srv.listen(PORTA, r));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: require('./comune/chiuso') });
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, timezoneId: 'Europe/Rome', locale: 'it-IT' });
  await ctx.route((u) => new URL(u).hostname !== 'localhost', (route) => {
    const u = route.request().url();
    if (/gstatic\.com\/firebasejs/.test(u)) return route.fulfill({ status: 200, contentType: 'text/javascript', body: /firebase-app/.test(u) ? FINTO_APP : /firebase-auth/.test(u) ? FINTO_AUTH : FINTO_FS });
    return route.abort();
  });
  await ctx.exposeFunction('__gettone', (uid) => gettone(uid));
  const errori = [];
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errori.push(String(e).split('\n')[0]));
  await p.goto(SITO + '/index.html'); await p.waitForTimeout(1500);
  const apriPannello = async () => { await p.evaluate(() => { location.hash = '#/profilo'; }); await p.waitForTimeout(500); await p.evaluate(() => { const r = document.getElementById('imp-calendari'); if (r) r.click(); }); await p.waitForTimeout(800); };
  const giro = () => p.evaluate(() => window.__PROVE__.calendari.sincronizza('prova'));
  const collegate = () => p.evaluate(() => LM.load().azioni.filter((a) => a.esterno && a.esterno.prov === 'google').map((a) => ({ id: a.id, ev: a.esterno.id, testo: a.testo })));
  const esitoTesto = () => p.evaluate(() => (LM.load().profilo.calendari.esito || {}));

  await p.evaluate(() => { const s = LM.load(); s.onboarded = true; LM.save(); }); await p.reload(); await p.waitForTimeout(1500);
  const oggi = await p.evaluate(() => LM.todayKey());
  const piu = (n) => { const d = new Date(oggi + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const ora = (g, hh) => ({ dateTime: g + 'T' + hh + ':00+01:00' });
  const CAL = 'lavoro@gruppo';
  G.metti(CAL, { id: 'priv', summary: 'Visita privata di Mario', start: ora(piu(1), '18:00'), end: ora(piu(1), '19:00'), organizer: { self: true } });
  G.metti(CAL, { id: 'poison', summary: 'Da togliere (Google dirà 400 una volta)', start: ora(piu(4), '12:00'), end: ora(piu(4), '13:00'), organizer: { self: true } });

  await p.evaluate(() => { window.__prossimo = { uid: 'mario', email: 'mario@prova.it' }; return window.LMCloud.signIn(); }); await p.waitForTimeout(2500);
  await apriPannello();
  await Promise.all([p.waitForNavigation({ url: /lmcal=google/ }).catch(() => null), p.click('#cal-google-collega').catch(() => null)]);
  await p.waitForTimeout(2500);
  await p.click('#cal-google [data-cal="' + CAL + '"]').catch(() => {}); await p.waitForTimeout(400);
  await giro();
  let az = await collegate();
  const per = (e) => az.find((a) => a.ev === e) || {};
  ok('(preparazione) collegato e importato', !!per('priv').id && !!per('poison').id, az);

  /* G2 */
  rifiutaUna = '/poison';
  await p.evaluate((id) => LM.rimuoviAzione(id), per('poison').id); await aspetta(300);
  await giro();
  const e1 = await esitoTesto();
  ok('G2 Google rifiuta una cancellazione: il pannello non dice «Tutto allineato»', !/Tutto allineato/.test(e1.testo || '') && e1.ok === false, e1);
  ok('G2 …e dice che una modifica non è stata accettata', /non accettat/.test(e1.testo || ''), e1);
  G.metti(CAL, { id: 'nuovo-dopo', summary: 'Evento nuovo, aggiunto dopo l’intoppo', start: ora(piu(2), '09:00'), end: ora(piu(2), '09:30'), organizer: { self: true } });
  await ns.suona(true);
  for (let i = 0; i < 2; i++) { await aspetta(300); await giro(); }
  az = await collegate();
  ok('G2 dopo il no, gli altri cambiamenti di Google continuano ad arrivare', !!per('nuovo-dopo').id, az.map((a) => a.ev));
  /* il tempo passa (qui e alla sentinella): la cancellazione si riprova, e
     stavolta Google dice sì */
  const vero = Date.now;
  let avanti = 0;
  const passa = async (min) => {
    avanti += min * 60000; Date.now = () => vero() + avanti;
    await p.evaluate((ms) => { const v = window.__veroAdesso || (window.__veroAdesso = Date.now); Date.now = () => v() + ms; }, avanti);
  };
  await passa(11); await giro();
  const ev = G.eventi[CAL].poison;
  ok('G2 un no di una volta sola non è per sempre: dopo un po’ la cancellazione arriva a Google', !ev || ev.status === 'cancelled', ev && ev.status);
  const e2 = await esitoTesto();
  ok('G2 …e il pannello torna a posto', e2.ok === true && !/non accettat/.test(e2.testo || ''), e2);
  /* un evento che Google non lascia cancellare mai: alla terza volta (a
     distanza di tempo) si lascia stare, e il Diario lo dice */
  G.metti(CAL, { id: 'duro', summary: 'Evento che Google non lascia togliere', start: ora(piu(3), '12:00'), end: ora(piu(3), '13:00'), organizer: { self: true } });
  await ns.suona(true); await giro();
  az = await collegate();
  const fetchPrima = globalThis.fetch;
  globalThis.fetch = async (url, o) => {
    const u = typeof url === 'string' ? url : url.url;
    if (/www\.googleapis\.com/.test(u) && (o && o.method) === 'DELETE' && u.indexOf('/duro') >= 0) return new Response('{"error":{"message":"Forbidden"}}', { status: 400, headers: { 'Content-Type': 'application/json' } });
    return fetchPrima(url, o);
  };
  await p.evaluate((id) => LM.rimuoviAzione(id), per('duro').id); await aspetta(300);
  for (let i = 0; i < 4; i++) { await giro(); await passa(11); }
  const dia = await p.evaluate(() => (LM.load().registro || []).filter((r) => r.cat === 'calendario').map((r) => r.testo));
  ok('G2 dopo tre no, il Diario dice che l’evento resta su Google', dia.some((t) => /non ha accettato 3 volte/.test(t)), dia.slice(-3));
  await giro();
  const e3 = await esitoTesto();
  ok('G2 …e la cancellazione non si riprova più', e3.ok === true, e3);
  globalThis.fetch = fetchPrima;
  Date.now = vero; await p.evaluate(() => { if (window.__veroAdesso) Date.now = window.__veroAdesso; });

  /* M2 */
  env.CHIAVE_CALENDARI = require('crypto').randomBytes(32).toString('base64'); ns.dimentica();
  for (const [, s] of ns.istanze) { try { s.db.prepare('UPDATE conti SET at_scade = 0').run(); } catch (e) { /* niente */ } }
  G.metti(CAL, { id: 'dopo-chiave', summary: 'Evento dopo il cambio di chiave', start: ora(piu(2), '11:00'), end: ora(piu(2), '11:30'), organizer: { self: true } });
  /* la sentinella rilegge solo se l'ultima lettura ha più di due minuti */
  Date.now = () => vero() + avanti + 6 * 60000; await giro(); Date.now = vero;
  await apriPannello();
  const v7 = await p.evaluate(() => ({ nota: window.__PROVE__.calendari.statoQui().nota, esito: (LM.load().profilo.calendari.esito || {}).testo, pannello: (document.getElementById('cal-google') || {}).innerText || '' }));
  ok('M2 chiave dei permessi cambiata: l’app chiede «Ricollega» invece di tacere', /Ricollega/.test(v7.nota + v7.pannello + (v7.esito || '')), v7);
  await p.keyboard.press('Escape');

  /* M3 */
  await p.evaluate(() => window.LMCloud.signOut()); await p.waitForTimeout(2000);
  const resto = await p.evaluate(() => {
    const out = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/Visita privata di Mario/.test(localStorage.getItem(k) || '')) out.push(k); }
    return out;
  });
  ok('M3 dopo «Esci» niente del calendario di Mario resta nel browser', !resto.length, resto);

  ok('nessun errore nella pagina', !errori.length, errori.slice(0, 5));
  await b.close(); srv.close();
  console.log(guai ? '\n' + guai + ' cose da sistemare' : '\ntutto a posto');
  process.exit(guai ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
