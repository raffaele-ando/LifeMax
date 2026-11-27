/* C01 — «Annulla» dopo aver tolto un'attività che viene dal calendario.
   Telefono collegato a Google (strada del browser, Google finto). Si toglie
   da Oggi la riunione che arriva dal calendario: LifeMax, come promette, la
   cancella anche su Google al giro dopo. Poi, dal Diario, «Annulla» su
   «Rimossa da oggi». Atteso: la riunione torna — qui e sul calendario — o,
   almeno, quello che l'app mostra resta vero dopo il giro.
   node c01-annulla-calendario.js */
'use strict';
const { banco, esiti } = require('./lib');
const R = esiti('c01-annulla-calendario');
const G = { token: new Set(), n: 0, eventi: {} };
let etag = 0;
const nuovoEtag = () => '"e' + (++etag) + '"';
const rispondi = (route, stato, corpo) => route.fulfill({ status: stato, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: corpo === undefined ? '' : JSON.stringify(corpo) });
async function googleApi(route) {
  const q = route.request(); const u = new URL(q.url()); const metodo = q.method();
  if (metodo === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' } });
  const tok = (q.headers()['authorization'] || '').replace('Bearer ', '');
  const via = decodeURIComponent(u.pathname.replace('/calendar/v3', ''));
  const corpo = q.postData() ? JSON.parse(q.postData()) : null;
  if (!G.token.has(tok)) return rispondi(route, 401, { error: { message: 'Invalid Credentials' } });
  if (via === '/users/me/calendarList') return rispondi(route, 200, { items: [{ id: 'io@esempio.it', summary: 'io', primary: true, accessRole: 'owner' }, { id: 'lavoro@gruppo', summary: 'Lavoro', accessRole: 'writer' }] });
  const m = /^\/calendars\/([^/]+)\/events(?:\/(.+))?$/.exec(via);
  if (!m) return rispondi(route, 404, { error: { message: 'no' } });
  const cal = G.eventi[m[1]] || (G.eventi[m[1]] = {});
  const id = m[2];
  if (!id && metodo === 'GET') return rispondi(route, 200, { items: Object.values(cal) });
  if (!id && metodo === 'POST') { const nid = corpo.id || ('n' + Date.now()); cal[nid] = Object.assign({ status: 'confirmed' }, corpo, { id: nid, etag: nuovoEtag() }); return rispondi(route, 200, cal[nid]); }
  const e = cal[id];
  if (!e) return rispondi(route, 404, { error: { message: 'Not Found' } });
  if (metodo === 'GET') return rispondi(route, 200, e);
  if (metodo === 'DELETE') { delete cal[id]; return route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*' }, body: '' }); }
  if (metodo === 'PATCH') { Object.keys(corpo).forEach((k) => { e[k] = corpo[k]; }); e.etag = nuovoEtag(); return rispondi(route, 200, e); }
  return rispondi(route, 405, {});
}
const GIS_FINTA = `
window.google = { accounts: { oauth2: {
  initTokenClient: function (cfg) { return { requestAccessToken: function () {
    fetch('https://accounts.google.com/__permesso').then(function (r) { return r.json(); })
      .then(function (j) { cfg.callback({ access_token: j.t, expires_in: 3599, scope: cfg.scope }); }); } }; },
  hasGrantedAllScopes: function () { return true; }, revoke: function () {}
} } };`;


(async () => {
  const { B, N, chiudi } = await banco(9400);
  const giorno = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const ora = (g, hh) => ({ dateTime: g + 'T' + hh + ':00+01:00' });
  G.eventi['lavoro@gruppo'] = { r1: { id: 'r1', summary: 'Riunione di progetto', start: ora(giorno(1), '10:00'), end: ora(giorno(1), '11:00') } };
  Object.values(G.eventi['lavoro@gruppo']).forEach((e) => { e.etag = nuovoEtag(); e.status = 'confirmed'; });
  try {
    await N.pulisci();
    const ctx = await B.contesto({ tipo: 'iphone' });
    await ctx.route('https://accounts.google.com/gsi/client', (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: GIS_FINTA }));
    await ctx.route('https://accounts.google.com/__permesso', (r) => { const t = 'g-tok-' + (++G.n); G.token.add(t); return rispondi(r, 200, { t }); });
    await ctx.route('https://www.googleapis.com/**', googleApi);
    const T = await B.dispositivo('telefono', { ctx });
    await T.evaluate(() => { const s = LM.load(); s.onboarded = true; LM.save(); });
    await T.reload(); await T.waitForFunction(() => window.LM && window.LMCloud, null, { timeout: 15000 });
    await B.accedi(T, 'mario', 'mario@prova.it');
    await T.evaluate(() => { location.hash = '#/profilo'; }); await T.waitForTimeout(500);
    await T.evaluate(() => { const r = document.getElementById('imp-calendari'); if (r) r.click(); }); await T.waitForTimeout(700);
    await T.click('#cal-google-collega'); await T.waitForTimeout(900);
    await T.click('#cal-google [data-cal="lavoro@gruppo"]'); await T.waitForTimeout(400);
    const giro = () => T.evaluate(() => window.__PROVE__.calendari.sincronizza('prova'));
    await giro(); await B.calma(T, 2000);
    await T.keyboard.press('Escape').catch(() => {});
    const az = await T.evaluate(() => (LM.load().azioni.find((a) => a.esterno && a.esterno.id === 'r1') || {}).id);
    R.ok('C01.0 la riunione del calendario è arrivata in LifeMax', !!az, az);
    await T.evaluate((i) => LM.rimuoviAzione(i), az);
    await giro(); await B.calma(T, 1500);
    R.ok('C01.1 tolta in LifeMax, è stata cancellata anche su Google (come promesso)', !G.eventi['lavoro@gruppo'].r1, Object.keys(G.eventi['lavoro@gruppo']));
    /* dal Diario: «Annulla» sulla riga «Rimossa da oggi» */
    await T.evaluate(() => { location.hash = '#/oggi'; }); await T.waitForTimeout(400);
    await T.evaluate(() => { location.hash = '#/profilo'; }); await T.waitForTimeout(700);
    await T.evaluate(() => { const t = document.getElementById('imp-diario'); if (t) t.click(); }); await T.waitForTimeout(800);
    await T.evaluate(() => { const t = [...document.querySelectorAll('#diario-filtro button')].find((x) => /Tutto/.test(x.textContent)); if (t) t.click(); }); await T.waitForTimeout(600);
    const riga = await T.evaluate(() => {
      const r = [...document.querySelectorAll('.diario-evento')].find((e) => /Rimossa da oggi/.test(e.textContent) && e.querySelector('[data-annulla]'));
      if (!r) return null; const b = r.querySelector('[data-annulla]'); b.click(); return r.textContent.replace(/\s+/g, ' ').trim().slice(0, 80);
    });
    await T.waitForTimeout(600);
    /* se chiede «Annullare fin qui?» si conferma */
    await T.evaluate(() => { const b = [...document.querySelectorAll('.avviso-ovl button')].find((x) => /Annulla fin qui/.test(x.textContent)); if (b) b.click(); });
    await T.waitForTimeout(800);
    const subito = await T.evaluate((i) => LM.load().azioni.some((a) => a.id === i), az);
    R.ok('C01.2 «Annulla»: la riunione torna in Oggi', !!riga && subito, { riga, subito });
    await T.screenshot({ path: require('path').join(__dirname, '..', 'schermate', 'c01-dopo-annulla.png') }).catch(() => {});
    /* il giro del calendario dopo (all'apertura, tornando sull'app, o da solo) */
    await giro(); await B.calma(T, 2000);
    const dopo = { inLifeMax: await T.evaluate((i) => LM.load().azioni.some((a) => a.id === i), az), suGoogle: !!G.eventi['lavoro@gruppo'].r1 || Object.values(G.eventi['lavoro@gruppo']).some((e) => e.summary === 'Riunione di progetto'),
      diario: await T.evaluate(() => LM.load().registro.slice(-3).map((r) => r.testo)) };
    R.ok('C01.3 dopo il giro del calendario quello che «Annulla» ha rimesso c’è ancora (in LifeMax o su Google)', dopo.inLifeMax || dopo.suGoogle, dopo);
    R.ok('C01.4 …e LifeMax e Google dicono la stessa cosa', dopo.inLifeMax === dopo.suGoogle, dopo);
  } catch (e) { R.ok('eccezione', false, String(e && e.stack || e)); }
  await chiudi();
  process.exit(R.fine() ? 1 : 0);
})();
