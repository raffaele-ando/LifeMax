/* IL CALENDARIO DAL VECCHIO INDIRIZZO (github.io) — verifica del 27 novembre
   2026 (revisione/cloud3/RAPPORTO.md, N2, script v01).
   Da github.io la conferma del collegamento (C2) non poteva funzionare: il
   biscotto del ritorno sta sul dominio ed è SameSite=Lax apposta. Adesso da
   github.io «Collega» porta sul dominio, dove il giro intero sta sullo
   stesso sito; collegato lì, il calendario vale anche su github.io.
     1  da github.io «Collega Google» va sul dominio, col pannello e una nota;
        nessun permesso resta in sospeso nella sentinella
     2  sul dominio il collegamento si conferma
     3  tornati su github.io, gli eventi arrivano
   I due indirizzi sono intercettati e serviti qui (file del ramo, Worker
   vero, Google finto); il browser non ha proxy né nomi (comune/chiuso.js), e
   i rimandi si fanno dalla pagina, mai lasciati al browser.
   node prove/calendari-github.js     (CHROMIUM=/percorso/di/chrome se serve) */
'use strict';
const fs = require('fs'), path = require('path');
const RADICE = process.env.LIFEMAX_SITO || require('./comune/dove').SERVITO;
const { mondo, gettone } = require('./comune/sentinella-finta');
const { chromium } = require('playwright');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const DOM = 'https://lifemax.theproject.world', GH = 'https://raffaele-ando.github.io';
let guai = 0;
const ok = (n, c, d) => { if (!c) guai++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (!c && d !== undefined ? '  → ' + (typeof d === 'string' ? d : JSON.stringify(d)).slice(0, 500) : '')); };

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
  const W = await mondo({ indirizzo: DOM, ritorni: DOM + '/,' + GH + '/LifeMax/', origini: DOM + ',' + GH });
  const { G, worker, env } = W;
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: require('./comune/chiuso') });
  const fuori = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, timezoneId: 'Europe/Rome', locale: 'it-IT', serviceWorkers: 'block' });
  await ctx.route(() => true, async (route) => {
    const q = route.request(); const u = new URL(q.url());
    if (/gstatic\.com$/.test(u.hostname) && /firebasejs/.test(u.pathname)) return route.fulfill({ status: 200, contentType: 'text/javascript', body: /firebase-app/.test(u.pathname) ? FINTO_APP : /firebase-auth/.test(u.pathname) ? FINTO_AUTH : FINTO_FS });
    if (u.origin === DOM && u.pathname.indexOf('/api/') === 0) {
      const h = new Headers(q.headers());
      const body = q.method() === 'GET' || q.method() === 'HEAD' ? undefined : q.postDataBuffer();
      const r = await worker.fetch(new Request(u.href, { method: q.method(), headers: h, body }), env, { waitUntil() {} });
      const testa = {}; r.headers.forEach((v, k) => { testa[k] = k === 'set-cookie' ? r.headers.getSetCookie().join('\n') : v; });
      if (testa.location && /^https:\/\/accounts\.google\.com\//.test(testa.location)) testa.location = W.consenso(testa.location).url;
      if (r.status >= 300 && r.status < 400 && testa.location) {
        const dove = testa.location; delete testa.location; testa['content-type'] = 'text/html';
        return route.fulfill({ status: 200, headers: testa, body: '<script>location.replace(' + JSON.stringify(dove) + ')</script>' });
      }
      return route.fulfill({ status: r.status, headers: testa, body: Buffer.from(await r.arrayBuffer()) });
    }
    for (const [sito, pre] of [[GH, '/LifeMax'], [DOM, '']]) {
      if (u.origin === sito && u.pathname.indexOf(pre) === 0) {
        let p = u.pathname.slice(pre.length) || '/'; if (p === '/') p = '/index.html';
        try { return route.fulfill({ status: 200, contentType: T[path.extname(p)] || 'application/octet-stream', body: fs.readFileSync(path.join(RADICE, p)) }); }
        catch (e) { return route.fulfill({ status: 404, body: 'x' }); }
      }
    }
    fuori.push(q.url().slice(0, 120)); return route.abort();
  });
  await ctx.exposeFunction('__gettone', (uid) => gettone(uid));
  const pendenti = () => { let n = 0; for (const [, s] of W.ns.istanze) { try { n += s.db.prepare('SELECT COUNT(*) AS n FROM pendenti').get().n; } catch (e) { /* tabella non ancora */ } } return n; };
  const conti = () => { const o = []; for (const [, s] of W.ns.istanze) { try { o.push(...s.db.prepare('SELECT p, stato FROM conti').all().map((r) => r.p + ':' + r.stato)); } catch (e) { /* niente */ } } return o; };
  const prepara = async (p) => {
    await p.waitForTimeout(1500);
    await p.evaluate(() => { const s = LM.load(); s.onboarded = true; LM.save(); try { localStorage.setItem('lm-traslocato', '1'); sessionStorage.setItem('lm-trasloco-dopo', '1'); } catch (e) {} });
    await p.reload(); await p.waitForTimeout(1500);
    await p.evaluate(() => { window.__prossimo = { uid: 'anna', email: 'anna@prova.it' }; return window.LMCloud.signIn(); }); await p.waitForTimeout(2500);
  };
  const pannello = async (p) => { await p.evaluate(() => { location.hash = '#/profilo'; }); await p.waitForTimeout(500); await p.evaluate(() => { const r = document.getElementById('imp-calendari'); if (r) r.click(); }); await p.waitForTimeout(900); };
  const errori = [];
  G.metti('io@esempio.it', { id: 'e1', summary: 'Evento di Anna', start: { dateTime: new Date(Date.now() + 86400000).toISOString() }, end: { dateTime: new Date(Date.now() + 90000000).toISOString() }, organizer: { self: true } });

  /* 1 */
  const p = await ctx.newPage(); p.on('pageerror', (e) => errori.push(String(e).split('\n')[0]));
  await p.goto(GH + '/LifeMax/index.html'); await prepara(p); await pannello(p);
  await Promise.all([p.waitForNavigation({ timeout: 15000 }).catch(() => null), p.click('#cal-google-collega').catch(() => null)]);
  await p.waitForTimeout(2500);
  const dove = new URL(p.url());
  ok('1 da github.io «Collega Google» porta sul dominio', dove.origin === DOM, p.url());
  ok('1 …e nessun permesso resta in sospeso nella sentinella (il giro non è partito da github.io)', pendenti() === 0 && !conti().length, { pendenti: pendenti(), conti: conti() });
  /* 2: sul dominio (memoria sua: si accede con lo stesso account) */
  if (dove.origin === DOM) {
    await prepara(p); await pannello(p);
    const nota = await p.evaluate(() => (document.getElementById('cal-google') || document.body).innerText);
    void nota;
    await Promise.all([p.waitForNavigation({ url: /lmcal=google/, timeout: 15000 }).catch(() => null), p.click('#cal-google-collega').catch(() => null)]);
    await p.waitForTimeout(3500);
  }
  ok('2 sul dominio il collegamento si conferma', conti().includes('google:ok'), conti());
  /* 3: di nuovo su github.io. Il profilo (che dice «Google collegato»)
     viaggerebbe col cloud, che qui è finto: lo si porta a mano */
  const prof = await p.evaluate(() => JSON.stringify(LM.load().profilo.calendari || {})).catch(() => '{}');
  await p.goto(GH + '/LifeMax/index.html'); await p.waitForTimeout(3000);
  await p.evaluate((c) => { const s = LM.load(); s.profilo.calendari = JSON.parse(c); LM.save(); }, prof);
  await p.evaluate(() => window.__PROVE__.calendari.sincronizza('prova')).catch(() => {});
  await pannello(p);
  await p.click('#cal-google [data-cal="io@esempio.it"]').catch(() => {}); await p.waitForTimeout(500);
  await p.evaluate(() => window.__PROVE__.calendari.sincronizza('prova')).catch(() => {});
  const arrivato = await p.evaluate(() => LM.load().azioni.some((a) => a.testo === 'Evento di Anna'));
  ok('3 tornati su github.io il calendario c’è: gli eventi arrivano', arrivato);
  ok('nessun errore nella pagina', !errori.length, errori.slice(0, 4));
  ok('nessuna richiesta verso fuori', !fuori.length, fuori.slice(0, 5));
  await b.close();
  console.log(guai ? '\n' + guai + ' cose da sistemare' : '\ntutto a posto');
  process.exit(guai ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
