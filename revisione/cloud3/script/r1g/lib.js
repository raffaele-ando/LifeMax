/* Harness for the cloud audit: real Firebase emulators (auth 9399, firestore 9380),
   the built app served on 9301, each "device" = its own Playwright context. */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium, devices } = require('playwright');
const S = __dirname;
const RADICE = process.env.RADICE || path.join(S, 'wt');
const FB = path.join(S, 'fbt/node_modules/firebase');
const PORTA = +(process.env.PORTA || 9301);
const CHROMIUM = '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };

const W_APP = `export * from './real-app.js';
import * as R from './real-app.js';
export function initializeApp(cfg, n) { return R.initializeApp(Object.assign({}, cfg, { projectId: 'demo-lifemax', apiKey: 'fake-api-key', authDomain: '127.0.0.1' }), n); }`;
const W_AUTH = `export * from './real-auth.js';
import * as R from './real-auth.js';
let A = null;
export function getAuth(app) { A = R.getAuth(app); try { R.connectAuthEmulator(A, 'http://127.0.0.1:9399', { disableWarnings: true }); } catch (e) {} window.__auth = A; window.__R_AUTH = R; return A; }
export async function signInWithPopup(a, p) {
  const c = window.__chi || { sub: 'u1', email: 'u1@prova.it' };
  if (window.__popupFail) { const e = new Error('popup'); e.code = window.__popupFail; throw e; }
  return R.signInWithCredential(a, R.GoogleAuthProvider.credential(JSON.stringify({ sub: c.sub, email: c.email, email_verified: true, name: c.name || c.email })));
}
export async function signInWithRedirect(a, p) { window.__redirectTried = (window.__redirectTried || 0) + 1; return signInWithPopup(a, p); }`;
const W_FS = `export * from './real-firestore.js';
import * as R from './real-firestore.js';
function wire(db) { try { R.connectFirestoreEmulator(db, '127.0.0.1', 9380); } catch (e) {} window.__db = db; window.__R_FS = R; return db; }
export function initializeFirestore(app, o) { return wire(R.initializeFirestore(app, o)); }
export function getFirestore(app) { return wire(R.getFirestore(app)); }
export function setDoc(ref, data, o) { (window.__setDocs = window.__setDocs || []).push({ path: ref.path, size: data && data.data ? data.data.length : 0, at: data && data.updatedAt }); return o ? R.setDoc(ref, data, o) : R.setDoc(ref, data); }`;

function servi(porta, radice) {
  radice = radice || RADICE; porta = porta || PORTA;
  return new Promise(res => {
    const srv = http.createServer((q, r) => {
      let p = decodeURIComponent(q.url.split('?')[0]);
      if (p === '/') p = '/index.html';
      fs.readFile(path.join(radice, p), (e, d) => {
        if (e) { r.statusCode = 404; r.end('x'); return; }
        r.setHeader('Content-Type', T[path.extname(p)] || 'application/octet-stream'); r.end(d);
      });
    });
    srv.listen(porta, () => res(srv));
  });
}

async function instrada(ctx) {
  await ctx.route('https://www.gstatic.com/firebasejs/**', async (route) => {
    const u = route.request().url(); const f = u.split('/').pop();
    const js = b => route.fulfill({ status: 200, contentType: 'text/javascript', body: b, headers: { 'access-control-allow-origin': '*' } });
    if (ctx.__sdkKo) return route.abort();
    if (f === 'firebase-app.js') return js(W_APP);
    if (f === 'firebase-auth.js') return js(W_AUTH);
    if (f === 'firebase-firestore.js') return js(W_FS);
    if (f.startsWith('real-')) return js(fs.readFileSync(path.join(FB, f.replace('real-', 'firebase-')), 'utf8'));
    return route.abort();
  });
}

/* clock skew + controllable time: window.__off (ms) added to Date, per device */
function orologio(skewMs) {
  return `(function(){ const D = Date; const sk = ${skewMs | 0};
    window.__off = Number((function(){try{return localStorage.getItem('__off')}catch(e){return 0}})() || 0);
    class F extends D { constructor(...a){ if(!a.length) super(D.now() + sk + window.__off); else super(...a); } static now(){ return D.now() + sk + window.__off; } }
    window.Date = F; })();`;
}

let browser = null;
async function avvia() {
  browser = await chromium.launch({ executablePath: CHROMIUM });
  return browser;
}

const PROFILI = {
  iphone: devices['iPhone 13'], android: devices['Pixel 7'], ipad: devices['iPad (gen 7)'],
  pc: { viewport: { width: 1366, height: 800 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' }
};

async function dispositivo(nome, o) {
  o = o || {};
  const prof = Object.assign({}, PROFILI[o.tipo || 'pc'] || {});
  delete prof.defaultBrowserType;
  const ctx = o.ctx || await browser.newContext(Object.assign(prof, { locale: 'it-IT', timezoneId: o.tz || 'Europe/Rome', serviceWorkers: 'block' }));
  if (!o.ctx) { await instrada(ctx); await ctx.addInitScript(orologio(o.skew || 0)); }
  const p = await ctx.newPage();
  p.__nome = nome; p.__err = []; p.__cons = [];
  p.on('pageerror', e => p.__err.push(String(e)));
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') p.__cons.push(m.type() + ': ' + m.text().slice(0, 300)); });
  p.on('dialog', d => d.accept());
  await p.goto('http://' + (o.host || '127.0.0.1') + ':' + (o.porta || PORTA) + '/index.html' + (o.hash || ''));
  await p.waitForFunction(() => window.LM && window.LM_AUTH, null, { timeout: 15000 }).catch(() => {});
  p.ctx = ctx;
  return p;
}

async function accedi(p, sub, email) {
  await p.evaluate(([s, e]) => { window.__chi = { sub: s, email: e }; }, [sub, email]);
  await p.waitForFunction(() => window.LMCloud && window.LMCloud.available, null, { timeout: 15000 });
  await p.evaluate(() => window.LMCloud.signIn());
  await p.waitForFunction(() => window.LM_AUTH && window.LM_AUTH.user && !window.LM_AUTH.syncing, null, { timeout: 20000 }).catch(() => {});
  await calma(p);
}

/* wait until the device has no write in flight */
async function calma(p, ms) {
  await p.waitForTimeout(ms || 600);
  await p.waitForFunction(() => !window.LM_SYNC || window.LM_SYNC.state !== 'saving', null, { timeout: 15000 }).catch(() => {});
  await p.waitForTimeout(400);
}
async function calmaTutti(arr, ms) { for (const p of arr) await calma(p, ms); await arr[0].waitForTimeout(800); for (const p of arr) await calma(p, 200); }

/* read the cloud doc bypassing rules (emulator owner token) */
function docCloud(uid) {
  return new Promise((res) => {
    http.get({ host: '127.0.0.1', port: 9380, path: '/v1/projects/demo-lifemax/databases/(default)/documents/users/' + uid, headers: { Authorization: 'Bearer owner' } }, r => {
      let b = ''; r.on('data', d => b += d); r.on('end', () => {
        try { const j = JSON.parse(b); if (!j.fields) return res(null); const f = j.fields; res({ updatedAt: +(f.updatedAt && (f.updatedAt.integerValue || f.updatedAt.doubleValue)), stato: JSON.parse(f.data.stringValue), raw: f.data.stringValue.length, email: f.email && f.email.stringValue }); } catch (e) { res(null); }
      });
    });
  });
}
function richiesta(method, host, port, pth, body, headers) {
  return new Promise((res) => {
    const q = http.request({ host, port, path: pth, method, headers: Object.assign({ 'Content-Type': 'application/json' }, headers || {}) }, r => { let b = ''; r.on('data', d => b += d); r.on('end', () => res({ s: r.statusCode, b })); });
    q.on('error', e => res({ s: 0, b: String(e) }));
    if (body) q.write(typeof body === 'string' ? body : JSON.stringify(body)); q.end();
  });
}
async function pulisciTutto() {
  await richiesta('DELETE', '127.0.0.1', 9380, '/emulator/v1/projects/demo-lifemax/databases/(default)/documents');
  await richiesta('DELETE', '127.0.0.1', 9399, '/emulator/v1/projects/demo-lifemax/accounts');
}
/* uid the emulator gives to a google sub: read it from the page */
async function uidDi(p) { return p.evaluate(() => window.LM_AUTH && window.LM_AUTH.user && window.LM_AUTH.user.uid); }

const testi = (p, campo) => p.evaluate(c => (LM.load()[c] || []).map(x => x.testo || x.nome || x.id), campo || 'azioni');
async function avanti(p, ms) { await p.evaluate(m => { window.__off += m; try{localStorage.setItem('__off', String(window.__off))}catch(e){}; }, ms); }

const risultati = [];
function esito(scenario, ok, dettaglio) {
  risultati.push({ scenario, ok, dettaglio });
  console.log((ok ? '  ok  ' : '  KO  ') + scenario + (dettaglio ? '  -> ' + (typeof dettaglio === 'string' ? dettaglio : JSON.stringify(dettaglio)) : ''));
}
function salvaRisultati(nome) { fs.writeFileSync(path.join(S, 'risultati-' + nome + '.json'), JSON.stringify(risultati, null, 2)); }
async function registroCloud(p, n) { return p.evaluate(n => (window.LMLog && window.LMLog.righe ? window.LMLog.righe().map(r=>JSON.stringify(r).slice(0,250)) : []).slice(-(n || 15)), n).catch(() => []); }

module.exports = { servi, avvia, dispositivo, accedi, calma, calmaTutti, docCloud, pulisciTutto, uidDi, testi, avanti, esito, salvaRisultati, richiesta, registroCloud, S, browser: () => browser };
