/* BANCO DI PROVA DELLA VERIFICA 2 (25-26 novembre 2026).
   Derivato da revisione/cloud/script/lib.js (round 1), con:
   - lettura del cloud NUOVO (users/{uid} + users/{uid}/pezzi, schema 2),
     ricomposto come fa l'app (stessa logica di prove/comune/emulatore.js);
   - la «cassetta delle lettere» (imbuca, keepalive REST) dirottata sull'emulatore;
   - TUTTO il traffico verso Google/Microsoft/Firebase veri bloccato in ogni
     contesto (route.abort) e contato: la prova fallisce se qualcosa ci prova.
   Emulatore: auth 9399, firestore 9380 (firebase.json di revisione/cloud/script).
   Sito costruito servito su 9301 (RADICE = worktree del commit sotto esame). */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium, devices } = require('playwright');
const AUDIT = process.env.AUDIT || path.join(__dirname, '..', '..');
const CONSEGNA = path.join(AUDIT, 'consegna');
const RADICE = process.env.RADICE || path.join(AUDIT, 'wt');
const FB = process.env.FBSDK || path.join(AUDIT, '..', 'audit-cloud', 'fbt', 'node_modules', 'firebase');
const PORTA = +(process.env.PORTA || 9301);
const CHROMIUM = process.env.CHROMIUM || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const FSP = +(process.env.FSP || 9380), AUP = +(process.env.AUP || 9399), PROJ = 'demo-lifemax';
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };

const W_APP = `export * from './real-app.js';
import * as R from './real-app.js';
export function initializeApp(cfg, n) { window.__cfgVero = cfg; return R.initializeApp(Object.assign({}, cfg, { projectId: '${PROJ}', apiKey: 'fake-api-key', authDomain: '127.0.0.1' }), n); }`;
const W_AUTH = `export * from './real-auth.js';
import * as R from './real-auth.js';
let A = null;
export function getAuth(app) { A = R.getAuth(app); try { R.connectAuthEmulator(A, 'http://127.0.0.1:${AUP}', { disableWarnings: true }); } catch (e) {} window.__auth = A; window.__R_AUTH = R; return A; }
export async function signInWithPopup(a, p) {
  window.__popupTried = (window.__popupTried || 0) + 1;
  const c = window.__chi || { sub: 'u1', email: 'u1@prova.it' };
  if (window.__popupDelay) await new Promise((r) => setTimeout(r, window.__popupDelay));
  if (window.__popupFail) { const e = new Error('popup'); e.code = window.__popupFail; throw e; }
  return R.signInWithCredential(a, R.GoogleAuthProvider.credential(JSON.stringify({ sub: c.sub, email: c.email, email_verified: true, name: c.name || c.email })));
}
export async function signInWithRedirect(a, p) { window.__redirectTried = (window.__redirectTried || 0) + 1; if (window.__redirectFail) { const e = new Error('redirect'); e.code = window.__redirectFail; throw e; } return signInWithPopup(a, p); }`;
const W_FS = `export * from './real-firestore.js';
import * as R from './real-firestore.js';
window.__LM_FIRESTORE_REST = 'http://127.0.0.1:${FSP}/v1/projects/${PROJ}/databases/(default)/documents';
function wire(db) { try { R.connectFirestoreEmulator(db, '127.0.0.1', ${FSP}); } catch (e) {} window.__db = db; window.__R_FS = R; return db; }
export function initializeFirestore(app, o) { return wire(R.initializeFirestore(app, o)); }
export function getFirestore(app) { return wire(R.getFirestore(app)); }`;

function servi(porta, radice) {
  radice = radice || RADICE; porta = porta || PORTA;
  return new Promise((res) => {
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

/* gli host veri: mai raggiunti. Ogni tentativo è contato in `bloccati`. */
const VIETATI = /(^|\.)(google\.com|googleapis\.com|gstatic\.com|googleusercontent\.com|firebaseapp\.com|firebaseio\.com|microsoftonline\.com|microsoft\.com|live\.com|cloudflare\.com|theproject\.world|github\.io)$/i;
const bloccati = [];
async function instrada(ctx) {
  await ctx.route((u) => { try { return VIETATI.test(new URL(u).hostname); } catch (e) { return false; } }, async (route) => {
    const u = route.request().url();
    const f = u.split('?')[0].split('/').pop();
    if (/^https:\/\/www\.gstatic\.com\/firebasejs\//.test(u)) {
      const js = (b) => route.fulfill({ status: 200, contentType: 'text/javascript', body: b, headers: { 'access-control-allow-origin': '*' } });
      if (ctx.__sdkKo) return route.abort();
      if (f === 'firebase-app.js') return js(W_APP);
      if (f === 'firebase-auth.js') return js(W_AUTH);
      if (f === 'firebase-firestore.js') return js(W_FS);
      if (f.startsWith('real-')) return js(fs.readFileSync(path.join(FB, f.replace('real-', 'firebase-')), 'utf8'));
    }
    if (ctx.__mock) { const m = await ctx.__mock(route, u); if (m) return; }
    bloccati.push(u.slice(0, 160));
    return route.abort();
  });
}

function orologio(skewMs) {
  return `(function(){ const D = Date; const sk = ${Math.round(skewMs || 0)};
    window.__off = Number((function(){try{return localStorage.getItem('__off')}catch(e){return 0}})() || 0);
    class F extends D { constructor(...a){ if(!a.length) super(D.now() + sk + window.__off); else super(...a); } static now(){ return D.now() + sk + window.__off; } }
    window.Date = F; })();`;
}

let browser = null;
/* verifica 3: anche se una route sbagliasse, il browser non esce (niente proxy, nessun nome risolto tranne il locale) */
const CHIUSO = ['--no-proxy-server', '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost, EXCLUDE 127.0.0.1'];
async function avvia() { browser = await chromium.launch({ executablePath: CHROMIUM, args: CHIUSO }); return browser; }

const PROFILI = {
  iphone: devices['iPhone 13'], android: devices['Pixel 7'], ipad: devices['iPad (gen 7)'],
  pc: { viewport: { width: 1366, height: 800 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' },
  mac: { viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15' }
};

async function contesto(o) {
  o = o || {};
  const prof = Object.assign({}, PROFILI[o.tipo || 'pc'] || {});
  delete prof.defaultBrowserType;
  const ctx = await browser.newContext(Object.assign(prof, { locale: 'it-IT', timezoneId: o.tz || 'Europe/Rome', serviceWorkers: o.sw ? 'allow' : 'block', deviceScaleFactor: 1 }));
  await instrada(ctx);
  await ctx.addInitScript(orologio(o.skew || 0));
  if (o.init) await ctx.addInitScript(o.init);
  return ctx;
}

async function dispositivo(nome, o) {
  o = o || {};
  const ctx = o.ctx || await contesto(o);
  const p = await ctx.newPage();
  p.__nome = nome; p.__err = []; p.__cons = [];
  p.on('pageerror', (e) => p.__err.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error') p.__cons.push(m.text().slice(0, 300)); });
  p.on('dialog', (d) => d.accept());
  await p.goto('http://' + (o.host || '127.0.0.1') + ':' + (o.porta || PORTA) + (o.via || '/index.html') + (o.hash || ''));
  await p.waitForFunction(() => window.LM && window.LM_AUTH, null, { timeout: 20000 }).catch(() => {});
  p.ctx = ctx;
  return p;
}
async function riapri(p, o) {
  o = o || {};
  await p.goto(p.url().split('#')[0] + (o.hash || ''), { waitUntil: 'load' }).catch(() => {});
  await p.waitForFunction(() => window.LM && window.LM_AUTH, null, { timeout: 20000 }).catch(() => {});
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

function richiesta(method, host, port, pth, body, headers) {
  return new Promise((res) => {
    const q = http.request({ host, port, path: pth, method, headers: Object.assign({ 'Content-Type': 'application/json' }, headers || {}) }, (r) => { let b = ''; r.on('data', (d) => b += d); r.on('end', () => res({ s: r.statusCode, b })); });
    q.on('error', (e) => res({ s: 0, b: String(e) }));
    if (body) q.write(typeof body === 'string' ? body : JSON.stringify(body)); q.end();
  });
}
const RAD = '/v1/projects/' + PROJ + '/databases/(default)/documents';
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
function campi(d) { const o = {}; const f = (d && d.fields) || {}; Object.keys(f).forEach((k) => { o[k] = valore(f[k]); }); return o; }
function cifra(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'string') return { stringValue: v };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(cifra) } };
  const f = {}; Object.keys(v).forEach((k) => { f[k] = cifra(v[k]); });
  return { mapValue: { fields: f } };
}
async function docRaw(via) {
  const r = await richiesta('GET', '127.0.0.1', FSP, RAD + '/' + via, null, { Authorization: 'Bearer owner' });
  if (r.s !== 200) return null;
  const j = JSON.parse(r.b); return Object.assign({ __id: j.name.split('/').pop() }, campi(j));
}
async function elenco(via) {
  const out = []; let pag = '';
  for (;;) {
    const r = await richiesta('GET', '127.0.0.1', FSP, RAD + '/' + via + '?pageSize=300' + (pag ? '&pageToken=' + encodeURIComponent(pag) : ''), null, { Authorization: 'Bearer owner' });
    if (r.s !== 200) return out;
    const j = JSON.parse(r.b);
    (j.documents || []).forEach((d) => out.push(Object.assign({ __id: d.name.split('/').pop(), __byte: JSON.stringify(d).length }, campi(d))));
    if (!j.nextPageToken) return out; pag = j.nextPageToken;
  }
}
async function scriviDoc(via, dati) {
  const f = {}; Object.keys(dati).forEach((k) => { f[k] = cifra(dati[k]); });
  return richiesta('PATCH', '127.0.0.1', FSP, RAD + '/' + via, { fields: f }, { Authorization: 'Bearer owner' });
}
/* IL CLOUD RICOMPOSTO: come l'app (pezzi elencati nel principale) + il documento vecchio */
async function docCloud(uid) {
  const m = await docRaw('users/' + uid);
  if (!m) return null;
  let stato = null, raw = 0;
  if (m.pezzi && typeof m.pezzi === 'object') {
    const tutte = await elenco('users/' + uid + '/pezzi');
    const per = {}; tutte.forEach((f) => { per[f.__id] = f.data; raw += (f.data || '').length; });
    stato = {};
    for (const n of Object.keys(m.pezzi).sort()) {
      const v = m.pezzi[n]; let t = '';
      for (let i = 0; i < v.n; i++) { const k = n + '~' + v.h + '~' + i; if (per[k] === undefined) return { rotto: 'manca la fetta ' + k, principale: m }; t += per[k]; }
      const parte = JSON.parse(t);
      Object.keys(parte).forEach((k) => {
        const val = parte[k], c = stato[k];
        if (Array.isArray(val)) stato[k] = (Array.isArray(c) ? c : []).concat(val);
        else if (val && typeof val === 'object' && c && typeof c === 'object' && !Array.isArray(c)) Object.assign(c, val);
        else stato[k] = val;
      });
    }
  }
  let vecchio = null;
  if (typeof m.data === 'string') { try { vecchio = JSON.parse(m.data); } catch (e) { vecchio = 'illeggibile'; } }
  return { updatedAt: m.updatedAt, stato: stato || vecchio, vecchio, raw: raw || (m.data || '').length, email: m.email, principale: m };
}
async function pulisciTutto() {
  await richiesta('DELETE', '127.0.0.1', FSP, '/emulator/v1/projects/' + PROJ + '/databases/(default)/documents');
  await richiesta('DELETE', '127.0.0.1', AUP, '/emulator/v1/projects/' + PROJ + '/accounts');
}
async function regole(testo) {
  return richiesta('PUT', '127.0.0.1', FSP, '/emulator/v1/projects/' + PROJ + ':securityRules', { rules: { files: [{ content: testo }] } });
}
const REGOLE_VERE = fs.readFileSync(path.join(RADICE, 'firestore.rules'), 'utf8');
async function utenteAuth(uid, patch) {
  return richiesta('POST', '127.0.0.1', AUP, '/identitytoolkit.googleapis.com/v1/projects/' + PROJ + '/accounts:update', Object.assign({ localId: uid }, patch), { Authorization: 'Bearer owner' });
}
async function cancellaUtenteAuth(uid) {
  return richiesta('POST', '127.0.0.1', AUP, '/identitytoolkit.googleapis.com/v1/projects/' + PROJ + '/accounts:delete', { localId: uid }, { Authorization: 'Bearer owner' });
}
async function uidDi(p) { return p.evaluate(() => window.LM_AUTH && window.LM_AUTH.user && window.LM_AUTH.user.uid); }
const testi = (p, campo) => p.evaluate((c) => (LM.load()[c] || []).map((x) => x.testo || x.nome || x.id), campo || 'azioni');
async function avanti(p, ms) { await p.evaluate((m) => { window.__off += m; try { localStorage.setItem('__off', String(window.__off)); } catch (e) {} }, ms); }
async function registro(p, n) {
  return p.evaluate((n) => { try { const r = window.LMLog && (window.LMLog.righe ? window.LMLog.righe() : window.LMLog.tutte ? window.LMLog.tutte() : []); return (r || []).slice(-(n || 20)).map((x) => JSON.stringify(x).slice(0, 220)); } catch (e) { return ['?' + e]; } }, n).catch(() => []);
}
async function foto(p, nome) { try { await p.screenshot({ path: path.join(CONSEGNA, 'schermate', nome + '.png') }); } catch (e) { /* niente */ } }

const risultati = [];
function esito(scenario, ok, dettaglio, extra) {
  risultati.push(Object.assign({ scenario, ok, dettaglio }, extra || {}));
  console.log((ok ? '  ok  ' : '  KO  ') + scenario + (dettaglio !== undefined ? '  -> ' + (typeof dettaglio === 'string' ? dettaglio : JSON.stringify(dettaglio)).slice(0, 700) : ''));
}
function salvaRisultati(nome, piu) {
  const out = { script: nome, quando: new Date().toISOString(), radice: RADICE, bloccati: bloccati.slice(0, 50), nBloccati: bloccati.length, risultati };
  Object.assign(out, piu || {});
  fs.writeFileSync(path.join(CONSEGNA, 'risultati', nome + '.json'), JSON.stringify(out, null, 2));
}
module.exports = { registroCloud: registro, servi, avvia, contesto, dispositivo, riapri, accedi, calma, calmaTutti, docCloud, docRaw, elenco, scriviDoc, pulisciTutto, regole, REGOLE_VERE,
  utenteAuth, cancellaUtenteAuth, uidDi, testi, avanti, esito, salvaRisultati, richiesta, registro, foto, bloccati, CONSEGNA, RADICE, PORTA, FSP, AUP, PROJ, browser: () => browser,
  S: AUDIT };
