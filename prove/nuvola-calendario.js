/* IL CALENDARIO E IL CLOUD INSIEME, NEL GIRO VERO (verifica del 27 novembre
   2026, revisione/cloud3/RAPPORTO.md, N13; il riproduttore è r1/s07, C6).
   Tre dispositivi dello stesso account, col cloud vero in piccolo
   (comune/emulatore.js) e un Google finto per la strada del browser.
     · il telefono segna fatta una riunione che viene dal calendario;
     · intanto il PC, che in quel momento non raggiunge il cloud, legge da
       Google il titolo nuovo di quella riunione;
     · tornato il cloud: ovunque la riunione è fatta E col titolo nuovo, e i
       giri dopo non la riportano indietro.
   Le date sono relative a oggi (s07 le aveva fisse, e sono passate).
   node prove/nuvola-calendario.js     (CHROMIUM=/percorso/di/chrome se serve) */
'use strict';
const em = require('./comune/emulatore');
const { ok, guai } = em.conto();

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
  const E = await em.accendi(9200);
  const srv = await em.servi(E.P.sito, process.env.LIFEMAX_SITO);
  const B = em.banco(E), N = em.nuvola(E);
  await B.avvia();
  const FS = 'http://127.0.0.1:' + E.P.firestore + '/**';
  const giorno = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const ora = (g, hh) => ({ dateTime: g + 'T' + hh + ':00+01:00' });
  G.eventi['lavoro@gruppo'] = {
    r1: { id: 'r1', summary: 'Riunione di progetto', start: ora(giorno(1), '10:00'), end: ora(giorno(1), '11:00') },
    g7: { id: 'g7', start: ora(giorno(2), '09:00'), end: ora(giorno(2), '09:30') }
  };
  Object.values(G.eventi['lavoro@gruppo']).forEach((e) => { e.etag = nuovoEtag(); e.status = 'confirmed'; });
  const disp = async (nome, tipo) => {
    const ctx = await B.contesto({ tipo });
    await ctx.route('https://accounts.google.com/gsi/client', (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: GIS_FINTA }));
    await ctx.route('https://accounts.google.com/__permesso', (r) => { const t = 'g-tok-' + (++G.n); G.token.add(t); return rispondi(r, 200, { t }); });
    await ctx.route('https://www.googleapis.com/**', googleApi);
    const p = await B.dispositivo(nome, { ctx });
    await p.evaluate(() => { const s = LM.load(); s.onboarded = true; LM.save(); });
    await p.reload(); await p.waitForFunction(() => window.LM && window.LMCloud, null, { timeout: 15000 }); await p.waitForTimeout(800);
    return p;
  };
  const apri = async (p) => { await p.evaluate(() => { location.hash = '#/profilo'; }); await p.waitForTimeout(500); await p.evaluate(() => { const r = document.getElementById('imp-calendari'); if (r) r.click(); }); await p.waitForTimeout(700); };
  const giro = (p) => p.evaluate(() => window.__PROVE__.calendari.sincronizza('prova'));
  const riga = (arr) => { const a = (arr || []).find((x) => x.esterno && x.esterno.id === 'g7'); return a ? a.testo + (a.done ? '[x]' : '') : '—'; };
  const qui = (p) => p.evaluate(() => LM.load().azioni.filter((a) => a.esterno).map((a) => ({ testo: a.testo, done: a.done, esterno: { id: a.esterno.id } })));
  try {
    const T = await disp('telefono', 'iphone'), P = await disp('pc', 'pc'), I = await disp('ipad', 'ipad');
    for (const p of [T, P, I]) await B.accedi(p, 'mario', 'mario@prova.it');
    const uid = await B.uidDi(T);
    await apri(T);
    await T.click('#cal-google-collega'); await T.waitForTimeout(900);
    await T.click('#cal-google [data-cal="lavoro@gruppo"]'); await T.waitForTimeout(400);
    await giro(T); await B.calmaTutti([T, P, I], 3000);
    await apri(P);
    /* sul PC il calendario è «collegato su un altro dispositivo»: «Collega anche qui» */
    await P.evaluate(() => { const b = document.getElementById('cal-google-ricollega') || document.getElementById('cal-google-collega'); if (b) b.click(); }); await P.waitForTimeout(900);
    await giro(P); await B.calmaTutti([T, P, I], 3000);
    const prima = { telefono: riga(await qui(T)), pc: riga(await qui(P)) };
    ok('(preparazione) la riunione senza titolo è arrivata come «Impegno» su telefono e PC', prima.telefono === 'Impegno' && prima.pc === 'Impegno', prima);
    /* il telefono la segna fatta; il PC non raggiunge il cloud e legge il titolo nuovo */
    await P.ctx.route(FS, (x) => x.abort());
    await T.evaluate(() => { const a = LM.load().azioni.find((x) => x.esterno && x.esterno.id === 'g7'); LM.completaAzione(a.id); });
    await B.calma(T, 2000);
    G.eventi['lavoro@gruppo'].g7.summary = 'Colloquio (spostato sala B)'; G.eventi['lavoro@gruppo'].g7.etag = nuovoEtag();
    await giro(P); await P.waitForTimeout(500);
    await P.ctx.unroute(FS);
    await P.evaluate(() => window.dispatchEvent(new Event('online'))); await B.calmaTutti([T, P, I], 8000);
    const dopo = { telefono: riga(await qui(T)), pc: riga(await qui(P)), ipad: riga(await qui(I)), cloud: riga(((await N.stato(uid)) || {}).azioni) };
    const giusto = 'Colloquio (spostato sala B)[x]';
    ok('N13 alla fine la riunione è fatta E col titolo nuovo, su tutti i dispositivi e nel cloud', Object.values(dopo).every((v) => v === giusto), dopo);
    /* altri giri del calendario e del cloud non la riportano indietro */
    await giro(T); await giro(P); await B.calmaTutti([T, P, I], 4000);
    const ancora = { telefono: riga(await qui(T)), pc: riga(await qui(P)), ipad: riga(await qui(I)), cloud: riga(((await N.stato(uid)) || {}).azioni) };
    ok('N13 …e i giri dopo non la riportano indietro', Object.values(ancora).every((v) => v === giusto), ancora);
    for (const p of B.tutti) if (p.__err && p.__err.length) ok('nessun errore in pagina su ' + p.__nome, false, p.__err.slice(0, 2));
  } catch (e) {
    ok('la prova è arrivata in fondo', false, String(e && e.stack || e));
  } finally {
    await B.chiudi(); srv.close(); await E.spegni();
  }
  console.log(guai() ? '\n' + guai() + ' problemi' : '\ntutto a posto');
  process.exit(guai() ? 1 : 0);
})();
