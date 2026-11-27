/* V01 — C2: LA CONFERMA DEL COLLEGAMENTO DAL VECCHIO INDIRIZZO (github.io).
   Verifica 3. L'app sul vecchio indirizzo chiama la sentinella su un ALTRO
   sito (https://lifemax.theproject.world/api/calendari/, vedi base() in
   src/calendari/server.ts:56). Il biscotto della conferma `lmcal_ok_<p>` è
   SameSite=Lax e la fetch di `manda` non ha `credentials: 'include'`:
   da github.io la conferma NON porta il biscotto → «altro-browser».
   Controllo: lo stesso giro con l'app sul dominio nuovo (stesso sito) va.
   Tutto è servito qui: i due indirizzi sono intercettati (route) e girati a
   file locali e al Worker vero del worktree con Google finto. Ogni altro
   indirizzo è bloccato e contato. */
'use strict';
const fs = require('fs'), path = require('path');
const AUDIT = path.join(__dirname, '..', '..');
const RADICE = process.env.RADICE || path.join(AUDIT, 'wt');
const { mondo, gettone } = require(path.join(RADICE, 'prove', 'comune', 'sentinella-finta.js'));
const { chromium } = require('playwright');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const DOM = 'https://lifemax.theproject.world', GH = 'https://raffaele-ando.github.io';
const risultati = [];
const esito = (s, ok, d) => { risultati.push({ scenario: s, ok, dettaglio: d }); console.log((ok ? '  ok  ' : '  KO  ') + s + (d !== undefined ? '  -> ' + (typeof d === 'string' ? d : JSON.stringify(d)).slice(0, 600) : '')); };

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
  /* rete chiusa anche se route sbagliasse: niente proxy, nessun nome risolto */
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--no-proxy-server', '--host-resolver-rules=MAP * ~NOTFOUND'] });
  const bloccati = [], cookieArrivati = [];

  async function giro(nome, sito) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, timezoneId: 'Europe/Rome', locale: 'it-IT', deviceScaleFactor: 1, serviceWorkers: 'block' });
    await ctx.route(() => true, async (route) => {
      const q = route.request(); const u = new URL(q.url());
      if (/gstatic\.com$/.test(u.hostname) && /firebasejs/.test(u.pathname)) return route.fulfill({ status: 200, contentType: 'text/javascript', body: /firebase-app/.test(u.pathname) ? FINTO_APP : /firebase-auth/.test(u.pathname) ? FINTO_AUTH : FINTO_FS });
      if (u.origin === DOM && u.pathname.indexOf('/api/') === 0) {
        const h = new Headers(q.headers());
        if (/conferma$/.test(u.pathname)) cookieArrivati.push({ giro: nome, cookie: h.get('cookie') || '' });
        const body = q.method() === 'GET' || q.method() === 'HEAD' ? undefined : q.postDataBuffer();
        const r = await worker.fetch(new Request(u.href, { method: q.method(), headers: h, body }), env, { waitUntil() {} });
        const testa = {}; r.headers.forEach((v, k) => { testa[k] = k === 'set-cookie' ? r.headers.getSetCookie().join('\n') : v; });
        if (testa.location && /^https:\/\/accounts\.google\.com\//.test(testa.location)) testa.location = W.consenso(testa.location).url;
        /* un 302 lasciato al browser NON passerebbe di nuovo da route (verifica 3:
           così una richiesta è uscita davvero). Il rimando si fa dalla pagina. */
        if (r.status >= 300 && r.status < 400 && testa.location) {
          const dove = testa.location; delete testa.location; testa['content-type'] = 'text/html';
          return route.fulfill({ status: 200, headers: testa, body: '<script>location.replace(' + JSON.stringify(dove) + ')</script>' });
        }
        return route.fulfill({ status: r.status, headers: testa, body: Buffer.from(await r.arrayBuffer()) });
      }
      const prefisso = sito === GH ? '/LifeMax' : '';
      if (u.origin === sito && u.pathname.indexOf(prefisso) === 0) {
        let p = u.pathname.slice(prefisso.length) || '/'; if (p === '/') p = '/index.html';
        try { return route.fulfill({ status: 200, contentType: T[path.extname(p)] || 'application/octet-stream', body: fs.readFileSync(path.join(RADICE, p)) }); }
        catch (e) { return route.fulfill({ status: 404, body: 'x' }); }
      }
      bloccati.push(q.url().slice(0, 120)); return route.abort();
    });
    await ctx.exposeFunction('__gettone', (uid) => gettone(uid));
    const p = await ctx.newPage();
    const errori = []; p.on('pageerror', (e) => errori.push(String(e).split('\n')[0]));
    const radice = sito === GH ? GH + '/LifeMax/' : DOM + '/';
    await p.goto(radice + 'index.html'); await p.waitForTimeout(1500);
    await p.evaluate(() => { const s = LM.load(); s.onboarded = true; LM.save(); try { localStorage.setItem('lm-traslocato', '1'); } catch (e) {} });
    await p.reload(); await p.waitForTimeout(1500);
    await p.evaluate(() => { window.__prossimo = { uid: 'anna', email: 'anna@prova.it' }; return window.LMCloud.signIn(); }); await p.waitForTimeout(2500);
    await p.evaluate(() => { location.hash = '#/profilo'; }); await p.waitForTimeout(500);
    await p.evaluate(() => { const r = document.getElementById('imp-calendari'); if (r) r.click(); }); await p.waitForTimeout(900);
    const bottone = await p.$('#cal-google-collega');
    await Promise.all([p.waitForNavigation({ url: /lmcal=google/, timeout: 15000 }).catch(() => null), bottone ? bottone.click() : Promise.resolve()]);
    await p.waitForTimeout(3000);
    const url = p.url();
    const biscotti = (await ctx.cookies(DOM + '/api/calendari/')).map((c) => c.name + ' (SameSite=' + c.sameSite + ')');
    const stato = await p.evaluate(() => { const s = window.__PROVE__ && window.__PROVE__.calendari && window.__PROVE__.calendari.statoQui(); return { errore: s && s.errore, collegato: s && s.conti, pannello: ((document.getElementById('cal-google') || {}).innerText || '').slice(0, 300) }; }).catch((e) => ({ e: String(e) }));
    const conti = [];
    for (const [h, s] of W.ns.istanze) { try { conti.push({ do: h.slice(0, 8), conti: s.db.prepare('SELECT p, stato FROM conti').all().map((r) => Object.assign({}, r)), pendenti: s.db.prepare('SELECT p FROM pendenti').all().length }); } catch (e) { /* tabelle non ancora */ } }
    await p.screenshot({ path: path.join(AUDIT, 'consegna', 'schermate', 'v01-' + nome + '.png') }).catch(() => {});
    await ctx.close();
    for (const [, s] of W.ns.istanze) { try { s.db.prepare('DELETE FROM conti').run(); s.db.prepare('DELETE FROM pendenti').run(); } catch (e) { /* niente */ } }
    return { bottone: !!bottone, url, biscotti, stato, conti, errori };
  }

  G.metti('io@esempio.it', { id: 'e1', summary: 'Evento di Anna', start: { dateTime: new Date(Date.now() + 86400000).toISOString() }, end: { dateTime: new Date(Date.now() + 90000000).toISOString() }, organizer: { self: true } });
  const a = await giro('dominio', DOM);
  esito('V01.0 controllo: sul dominio nuovo il collegamento si conferma (conto «ok» nella sentinella di Anna)', a.conti.some((c) => c.conti.some((x) => x.p === 'google' && x.stato === 'ok')), a);
  const g = await giro('github-io', GH);
  esito('V01.1 [regressione C2] dal vecchio indirizzo github.io il collegamento si conferma', g.conti.some((c) => c.conti.some((x) => x.p === 'google' && x.stato === 'ok')), g);
  esito('V01.2 la richiesta di conferma da github.io porta il biscotto lmcal_ok_google', cookieArrivati.filter((c) => c.giro === 'github-io').some((c) => /lmcal_ok_google=/.test(c.cookie)), cookieArrivati);
  esito('nessuna richiesta verso fuori', true, bloccati.slice(0, 10));
  fs.writeFileSync(path.join(AUDIT, 'consegna', 'risultati', 'v01-conferma-da-github-io.json'), JSON.stringify({ script: 'v01', quando: new Date().toISOString(), risultati, bloccati }, null, 2));
  await b.close(); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
