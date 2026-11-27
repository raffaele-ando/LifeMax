/* IL CLOUD VERO, IN PICCOLO: FIREBASE EMULATOR SUITE.

   Le prove della sincronizzazione (prove/nuvola-*.js) non usano un Firebase
   finto come prove/cloud.js: usano LA STESSA libreria di Firebase che il
   sito scarica da gstatic, collegata all'emulatore ufficiale di Firebase
   (Auth + Firestore) che gira qui, con le regole vere di `firestore.rules`.
   È lo stesso banco della verifica del 24 novembre 2026
   (revisione/cloud/), diventato permanente: le transazioni, l'ascolto in
   tempo reale, le regole che dicono no, una sessione chiusa dal server —
   tutte cose che un finto scritto a mano imita solo fin dove chi l'ha
   scritto le ha capite.

   COSA SERVE, e non sta nel ramo (sono 450 MB e serve Java):
     npm i --prefix prove/.emulatore firebase-tools@15 firebase@12.16.0
   oppure una cartella con quei due pacchetti indicata da LIFEMAX_EMULATORE.
   Senza, le prove si fermano con questo messaggio — e falliscono: una prova
   saltata che risulta verde è una prova che mente.

   I «dispositivi» sono contesti separati di Chromium, ognuno coi suoi dati,
   e ognuno col suo orologio spostabile (`skew`, e `avanti()` per far
   passare i giorni). */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const { spawn } = require('child_process');
const { chromium, devices } = require('playwright');
const { RAMO, SERVITO } = require('./dove');

const ATTREZZI = process.env.LIFEMAX_EMULATORE || path.join(RAMO, 'prove', '.emulatore');
const FB = path.join(ATTREZZI, 'node_modules', 'firebase');
const FBT = path.join(ATTREZZI, 'node_modules', 'firebase-tools', 'lib', 'bin', 'firebase.js');
const PROGETTO = 'demo-lifemax';

function controllaAttrezzi() {
  if (fs.existsSync(FB) && fs.existsSync(FBT)) return;
  console.log('  KO  manca l’emulatore di Firebase.');
  console.log('      Installalo una volta con:');
  console.log('        npm i --prefix prove/.emulatore firebase-tools@15 firebase@12.16.0');
  console.log('      (serve anche Java), oppure indica la cartella con LIFEMAX_EMULATORE.');
  process.exit(3);
}

/* porte proprie, diverse da quelle della verifica: le due cose possono
   girare insieme */
function porte(base) {
  return { auth: base + 99, firestore: base + 80, hub: base + 92, logging: base + 93, sito: base + 1 };
}

async function aspettaPorta(porta, ms) {
  const fine = Date.now() + ms;
  while (Date.now() < fine) {
    const ok = await new Promise((r) => {
      const q = http.get({ host: '127.0.0.1', port: porta, path: '/' }, (x) => { x.resume(); r(true); });
      q.on('error', () => r(false));
      q.setTimeout(1500, () => { q.destroy(); r(false); });
    });
    if (ok) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function accendi(base) {
  controllaAttrezzi();
  const P = porte(base);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lifemax-emu-'));
  fs.copyFileSync(path.join(RAMO, 'firestore.rules'), path.join(dir, 'firestore.rules'));
  fs.writeFileSync(path.join(dir, 'firebase.json'), JSON.stringify({
    firestore: { rules: 'firestore.rules' },
    emulators: {
      auth: { host: '127.0.0.1', port: P.auth }, firestore: { host: '127.0.0.1', port: P.firestore, websocketPort: base + 50 },
      hub: { port: P.hub }, logging: { port: P.logging }, ui: { enabled: false }, singleProjectMode: true
    }
  }));
  const figlio = spawn(process.execPath, [FBT, 'emulators:start', '--only', 'auth,firestore', '--project', PROGETTO], {
    cwd: dir, stdio: ['ignore', 'pipe', 'pipe'], env: Object.assign({}, process.env, { FIREBASE_CLI_DISABLE_UPDATE_CHECK: 'true' })
  });
  let uscita = '';
  figlio.stdout.on('data', (d) => { uscita += d; });
  figlio.stderr.on('data', (d) => { uscita += d; });
  const pronti = await aspettaPorta(P.firestore, 90000) && await aspettaPorta(P.auth, 30000);
  if (!pronti) {
    try { figlio.kill('SIGKILL'); } catch (e) { /* già via */ }
    console.log(uscita.slice(-2000));
    throw new Error('l’emulatore non è partito');
  }
  /* il registro dell'emulatore non serve a niente se va tutto bene */
  const spegni = () => new Promise((r) => {
    if (figlio.exitCode !== null) return r();
    figlio.once('exit', () => r());
    try { figlio.kill('SIGINT'); } catch (e) { r(); }
    setTimeout(() => { try { figlio.kill('SIGKILL'); } catch (e) { /* già via */ } r(); }, 8000);
  });
  return { P, dir, spegni, regole: fs.readFileSync(path.join(RAMO, 'firestore.rules'), 'utf8') };
}

const TIPI = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };
function servi(porta, radice) {
  return new Promise((ok) => {
    const srv = http.createServer((q, r) => {
      let p = decodeURIComponent(q.url.split('?')[0]);
      if (p === '/') p = '/index.html';
      fs.readFile(path.join(radice || process.env.LIFEMAX_SITO || SERVITO, p), (e, d) => {
        if (e) { r.statusCode = 404; r.end('x'); return; }
        r.setHeader('Content-Type', TIPI[path.extname(p)] || 'application/octet-stream'); r.end(d);
      });
    });
    srv.listen(porta, () => ok(srv));
  });
}

/* le tre librerie di Firebase arrivano da qui, avvolte quel tanto che serve
   a parlarle con l'emulatore invece che col progetto vero */
function involucri(P) {
  return {
    app: `export * from './real-app.js';
import * as R from './real-app.js';
export function initializeApp(cfg, n) { return R.initializeApp(Object.assign({}, cfg, { projectId: '${PROGETTO}', apiKey: 'fake-api-key', authDomain: '127.0.0.1' }), n); }`,
    auth: `export * from './real-auth.js';
import * as R from './real-auth.js';
let A = null;
export function getAuth(app) { A = R.getAuth(app); try { R.connectAuthEmulator(A, 'http://127.0.0.1:${P.auth}', { disableWarnings: true }); } catch (e) {} window.__auth = A; window.__R_AUTH = R; return A; }
export async function signInWithPopup(a, p) {
  const c = window.__chi || { sub: 'u1', email: 'u1@prova.it' };
  if (window.__popupFail) { const e = new Error('popup'); e.code = window.__popupFail; throw e; }
  return R.signInWithCredential(a, R.GoogleAuthProvider.credential(JSON.stringify({ sub: c.sub, email: c.email, email_verified: true, name: c.name || c.email })));
}
export async function signInWithRedirect(a, p) { window.__redirectTried = (window.__redirectTried || 0) + 1; return signInWithPopup(a, p); }`,
    firestore: `export * from './real-firestore.js';
import * as R from './real-firestore.js';
function wire(db) { try { R.connectFirestoreEmulator(db, '127.0.0.1', ${P.firestore}); } catch (e) {} window.__db = db; window.__R_FS = R; return db; }
/* la «cassetta delle lettere» (pagehide in nuvola.ts) parla REST: qui con l'emulatore */
window.__LM_FIRESTORE_REST = 'http://127.0.0.1:${P.firestore}/v1/projects/${PROGETTO}/databases/(default)/documents';
export function initializeFirestore(app, o) { return wire(R.initializeFirestore(app, o)); }
export function getFirestore(app) { return wire(R.getFirestore(app)); }`
  };
}

function orologio(skewMs) {
  return `(function(){ const D = Date; const sk = ${Math.round(Number(skewMs) || 0)}; /* niente «| 0»: anni di scarto non stanno in 32 bit */
    window.__off = Number((function(){try{return localStorage.getItem('__off')}catch(e){return 0}})() || 0);
    class F extends D { constructor(...a){ if(!a.length) super(D.now() + sk + window.__off); else super(...a); } static now(){ return D.now() + sk + window.__off; } }
    window.Date = F; })();`;
}

const PROFILI = {
  iphone: devices['iPhone 13'], android: devices['Pixel 7'], ipad: devices['iPad (gen 7)'],
  pc: { viewport: { width: 1366, height: 800 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' }
};

function banco(E) {
  const P = E.P;
  const inv = involucri(P);
  let browser = null;
  const tutti = [];

  async function avvia() {
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: require('./chiuso') });
    return browser;
  }
  async function instrada(ctx) {
    await ctx.route('https://www.gstatic.com/firebasejs/**', async (route) => {
      const f = route.request().url().split('/').pop();
      const js = (b) => route.fulfill({ status: 200, contentType: 'text/javascript', body: b, headers: { 'access-control-allow-origin': '*' } });
      if (ctx.__sdkKo) return route.abort();
      if (f === 'firebase-app.js') return js(inv.app);
      if (f === 'firebase-auth.js') return js(inv.auth);
      if (f === 'firebase-firestore.js') return js(inv.firestore);
      if (f.startsWith('real-')) return js(fs.readFileSync(path.join(FB, f.replace('real-', 'firebase-')), 'utf8'));
      return route.abort();
    });
  }
  async function contesto(o) {
    o = o || {};
    const prof = Object.assign({}, PROFILI[o.tipo || 'pc'] || {});
    delete prof.defaultBrowserType;
    const ctx = await browser.newContext(Object.assign(prof, { locale: 'it-IT', timezoneId: 'Europe/Rome', serviceWorkers: 'block' }));
    await instrada(ctx);
    await ctx.addInitScript(orologio(o.skew || 0));
    if (o.init) await ctx.addInitScript(o.init);
    return ctx;
  }
  async function dispositivo(nome, o) {
    o = o || {};
    const ctx = o.ctx || await contesto(o);
    const p = await ctx.newPage();
    p.__nome = nome; p.__err = [];
    p.on('pageerror', (e) => p.__err.push(String(e)));
    p.on('dialog', (d) => d.accept());
    await p.goto('http://' + (o.host || '127.0.0.1') + ':' + (o.porta || P.sito) + '/index.html' + (o.hash || ''));
    await p.waitForFunction(() => window.LM && window.LM_AUTH, null, { timeout: 20000 }).catch(() => {});
    p.ctx = ctx;
    tutti.push(p);
    return p;
  }
  async function accedi(p, sub, email) {
    await p.evaluate(([s, e]) => { window.__chi = { sub: s, email: e }; }, [sub, email]);
    await p.waitForFunction(() => window.LMCloud && window.LMCloud.available, null, { timeout: 20000 });
    await p.evaluate(() => window.LMCloud.signIn());
    await p.waitForFunction(() => window.LM_AUTH && window.LM_AUTH.user && !window.LM_AUTH.syncing, null, { timeout: 30000 }).catch(() => {});
    await calma(p);
  }
  async function calma(p, ms) {
    await p.waitForTimeout(ms || 600);
    await p.waitForFunction(() => !window.LM_SYNC || window.LM_SYNC.state !== 'saving', null, { timeout: 20000 }).catch(() => {});
    await p.waitForTimeout(400);
  }
  async function calmaTutti(arr, ms) { for (const p of arr) await calma(p, ms); await arr[0].waitForTimeout(800); for (const p of arr) await calma(p, 200); }
  const uidDi = (p) => p.evaluate(() => window.LM_AUTH && window.LM_AUTH.user && window.LM_AUTH.user.uid);
  async function avanti(p, ms) { await p.evaluate((m) => { window.__off += m; try { localStorage.setItem('__off', String(window.__off)); } catch (e) {} }, ms); }
  async function chiudi() { if (browser) await browser.close().catch(() => {}); }
  return { avvia, contesto, dispositivo, accedi, calma, calmaTutti, uidDi, avanti, chiudi, browser: () => browser, tutti };
}

/* ------------------------------------------------- il cloud visto da fuori
   Si legge con il gettone del proprietario dell'emulatore, che passa sopra
   alle regole: la prova guarda cosa c'è DAVVERO nel cloud, non cosa l'app
   crede che ci sia. */
function richiesta(method, port, via, body, headers) {
  return new Promise((ok) => {
    const q = http.request({ host: '127.0.0.1', port, path: via, method, headers: Object.assign({ 'Content-Type': 'application/json', Authorization: 'Bearer owner' }, headers || {}) }, (r) => {
      let b = ''; r.on('data', (d) => b += d); r.on('end', () => ok({ s: r.statusCode, b }));
    });
    q.on('error', (e) => ok({ s: 0, b: String(e) }));
    if (body) q.write(typeof body === 'string' ? body : JSON.stringify(body));
    q.end();
  });
}
function valore(v) {
  if (!v || typeof v !== 'object') return v;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return Date.parse(v.timestampValue);
  if ('mapValue' in v) { const o = {}; const f = v.mapValue.fields || {}; Object.keys(f).forEach((k) => { o[k] = valore(f[k]); }); return o; }
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(valore);
  return v;
}
function campi(doc) { const o = {}; const f = (doc && doc.fields) || {}; Object.keys(f).forEach((k) => { o[k] = valore(f[k]); }); return o; }
function cifra(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'string') return { stringValue: v };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(cifra) } };
  const f = {}; Object.keys(v).forEach((k) => { f[k] = cifra(v[k]); });
  return { mapValue: { fields: f } };
}

function nuvola(E) {
  const P = E.P;
  const radice = '/v1/projects/' + PROGETTO + '/databases/(default)/documents';
  async function doc(via) {
    const r = await richiesta('GET', P.firestore, radice + '/' + via);
    if (r.s !== 200) return null;
    const j = JSON.parse(r.b);
    return Object.assign({ __id: j.name.split('/').pop() }, campi(j));
  }
  async function elenco(via) {
    const out = []; let pagina = '';
    for (;;) {
      const r = await richiesta('GET', P.firestore, radice + '/' + via + '?pageSize=300' + (pagina ? '&pageToken=' + encodeURIComponent(pagina) : ''));
      if (r.s !== 200) return out;
      const j = JSON.parse(r.b);
      (j.documents || []).forEach((d) => out.push(Object.assign({ __id: d.name.split('/').pop(), __byte: JSON.stringify(d).length }, campi(d))));
      if (!j.nextPageToken) return out;
      pagina = j.nextPageToken;
    }
  }
  async function scriviDoc(via, dati) {
    const f = {}; Object.keys(dati).forEach((k) => { f[k] = cifra(dati[k]); });
    return richiesta('PATCH', P.firestore, radice + '/' + via, { fields: f });
  }
  /* LO STATO NEL CLOUD, ricomposto come lo ricompone l'app: i pezzi che il
     documento principale elenca; e il documento vecchio (un JSON solo) se
     c'è ancora */
  async function stato(uid) {
    const m = await doc('users/' + uid);
    if (!m) return null;
    const testi = [];
    if (m.pezzi && typeof m.pezzi === 'object') {
      const tutte = await elenco('users/' + uid + '/pezzi');
      const per = {}; tutte.forEach((f) => { per[f.__id] = f.data; });
      for (const n of Object.keys(m.pezzi).sort()) {
        const v = m.pezzi[n]; let t = '';
        for (let i = 0; i < v.n; i++) {
          const k = n + '~' + v.h + '~' + i;
          if (per[k] === undefined) return { rotto: 'manca la fetta ' + k };
          t += per[k];
        }
        testi.push(t);
      }
    }
    const out = {};
    testi.forEach((t) => {
      const parte = JSON.parse(t);
      Object.keys(parte).forEach((k) => {
        const v = parte[k], c = out[k];
        if (Array.isArray(v)) out[k] = (Array.isArray(c) ? c : []).concat(v);
        else if (v && typeof v === 'object' && c && typeof c === 'object' && !Array.isArray(c)) Object.assign(c, v);
        else out[k] = v;
      });
    });
    if (typeof m.data === 'string') out.__vecchio = JSON.parse(m.data);
    out.__principale = m;
    return out;
  }
  async function pulisci() {
    await richiesta('DELETE', P.firestore, '/emulator/v1/projects/' + PROGETTO + '/databases/(default)/documents');
    await richiesta('DELETE', P.auth, '/emulator/v1/projects/' + PROGETTO + '/accounts');
  }
  async function disabilita(uid) {
    return richiesta('POST', P.auth, '/identitytoolkit.googleapis.com/v1/projects/' + PROGETTO + '/accounts:update', { localId: uid, disableUser: true });
  }
  async function regole(testo) {
    return richiesta('PUT', P.firestore, '/emulator/v1/projects/' + PROGETTO + ':securityRules', { rules: { files: [{ content: testo }] } });
  }
  return { doc, elenco, stato, scriviDoc, pulisci, disabilita, regole, richiesta: (m, v, b) => richiesta(m, P.firestore, radice + '/' + v, b) };
}

/* il conto delle prove, come nelle altre */
function conto() {
  let guai = 0;
  const ok = (n, c, d) => {
    if (!c) guai++;
    console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d !== undefined && (!c || process.env.DETTAGLI) ? '  → ' + (typeof d === 'string' ? d : JSON.stringify(d)).slice(0, 900) : ''));
  };
  return { ok, guai: () => guai };
}

module.exports = { accendi, servi, banco, nuvola, conto, porte };
