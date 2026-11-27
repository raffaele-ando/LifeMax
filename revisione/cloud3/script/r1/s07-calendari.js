/* Calendari collegati + cloud, 3 dispositivi (commit 60485f9). Google finto di prove/calendari.js. */
const L = require('../lib'); const F = require('./finti-calendari');
const { G } = F;
async function conCalendari(p) {
  const ctx = p.ctx;
}
async function disp(nome, tipo) {
  const p = await L.dispositivo(nome, { tipo, hash: '' });
  const ctx = p.ctx;
  await ctx.route('https://accounts.google.com/gsi/client', (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: F.GIS_FINTA }));
  await ctx.route('https://accounts.google.com/__permesso', (r) => { const t = 'g-tok-' + (++G.n); G.token.add(t); return F.rispondi(r, 200, { t }); });
  await ctx.route('https://www.googleapis.com/**', F.googleApi);
  await p.evaluate(() => { const s = LM.load(); s.onboarded = true; LM.save(); }); await p.reload(); await p.waitForFunction(() => window.LM && window.LMCloud, null, { timeout: 15000 }); await p.waitForTimeout(800);
  return p;
}
const apri = async (p) => { await p.evaluate(() => { location.hash = '#/profilo'; }); await p.waitForTimeout(500); await p.evaluate(() => { const r = document.getElementById('imp-calendari'); if (r) r.click(); }); await p.waitForTimeout(700); };
const giro = (p) => p.evaluate(() => window.__PROVE__.calendari.sincronizza('prova'));
const col = (p) => p.evaluate(() => LM.load().azioni.filter(a => a.esterno).map(a => a.esterno.id + ':' + a.testo + (a.done ? '[x]' : '')).sort().join(' | '));
const stato = async (arr, uid) => { const r = {}; for (const p of arr) r[p.__nome] = await col(p); const c = (await L.docCloud(uid)).stato; r.cloud = c.azioni.filter(a => a.esterno).map(a => a.esterno.id + ':' + a.testo + (a.done ? '[x]' : '')).sort().join(' | '); r.eventiGoogle = Object.values(G.eventi['lavoro@gruppo']).map(e => e.id + ':' + e.summary).sort().join(' | '); return r; };
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();
  const T = await disp('telefono', 'iphone'), P = await disp('pc', 'pc'), I = await disp('ipad', 'ipad');
  for (const p of [T, P, I]) await L.accedi(p, 'mario', 'mario@prova.it');
  const uid = await L.uidDi(T);
  // telefono: incolla ID, collega, accende il calendario di lavoro, sincronizza
  await apri(T);
  /* round 2: il Client ID ora è scritto in config.ts, il campo non c'è più */
  if (await T.$('#cal-google-id')) { await T.fill('#cal-google-id', '1234-finto.apps.googleusercontent.com'); await T.press('#cal-google-id', 'Enter'); await T.waitForTimeout(500); }
  await T.click('#cal-google-collega'); await T.waitForTimeout(900);
  await T.click('#cal-google [data-cal="lavoro@gruppo"]'); await T.waitForTimeout(400);
  await giro(T); await L.calmaTutti([T, P, I], 3000);
  let r = await stato([T, P, I], uid);
  L.esito('C1 telefono importa gli eventi: arrivano a pc e iPad via cloud', r.telefono && r.telefono === r.pc && r.pc === r.ipad, r);
  await apri(P);
  const sp = await P.evaluate(() => (document.getElementById('cal-google-stato') || {}).textContent);
  L.esito('C2 sul pc il pannello dice «collegato su un altro dispositivo»', /altro dispositivo|Collega anche qui/i.test(sp || ''), sp);
  // il pc si collega anche lui e sincronizza: nessun doppione
  const bott = await P.evaluate(() => { const b = document.getElementById('cal-google-collega'); if (b) { b.click(); return b.textContent; } return null; }); await P.waitForTimeout(900);
  await giro(P); await L.calmaTutti([T, P, I], 3000);
  r = await stato([T, P, I], uid);
  const n = (s) => (s || '').split(' | ').filter(Boolean).length;
  L.esito('C3 anche il pc si collega e sincronizza: nessun doppione', n(r.pc) === n(r.telefono) && r.pc === r.telefono && r.telefono === r.ipad, Object.assign({ tasto: bott }, r));
  // evento cancellato nel calendario: il pc se ne accorge, gli altri seguono, nessuno lo resuscita
  delete G.eventi['lavoro@gruppo'].g3;
  await giro(P); await L.calmaTutti([T, P, I], 3000); await giro(T); await L.calmaTutti([T, P, I], 3000);
  r = await stato([T, P, I], uid);
  L.esito('C4 «Dentista» cancellato nel calendario: sparisce dappertutto e non torna', !r.telefono.includes('g3') && !r.pc.includes('g3') && !r.ipad.includes('g3') && !r.cloud.includes('g3'), r);
  // attività calendario cancellata in LifeMax sull'iPad (non collegato): il calendario va aggiornato da un dispositivo collegato
  await I.evaluate(() => { const a = LM.load().azioni.find(a => a.esterno && a.esterno.id === 'g5'); LM.rimuoviAzione(a.id); });
  await L.calmaTutti([T, P, I], 3000); await giro(T); await L.calmaTutti([T, P, I], 3000); await giro(P); await L.calmaTutti([T, P, I], 3000);
  r = await stato([T, P, I], uid);
  L.esito('C5 «Treno di notte» tolto in LifeMax sull’iPad (non collegato): sparisce da tutti e dal calendario, non risorge', !Object.values(r).some(v => v.includes('g5')), r);
  // telefono completa una riunione, ma il pc NON riceve il cloud (Firestore irraggiungibile solo per lui) e intanto il calendario cambia il titolo
  await P.ctx.route('http://127.0.0.1:' + L.FSP + '/**', (x) => x.abort());
  await T.evaluate(() => { const a = LM.load().azioni.find(a => a.esterno && a.esterno.id === 'g7'); LM.completaAzione(a.id); });
  await L.calma(T, 2000);
  G.eventi['lavoro@gruppo'].g7.summary = 'Colloquio (spostato sala B)'; G.eventi['lavoro@gruppo'].g7.etag = F.nuovoEtag();
  await giro(P); await P.waitForTimeout(500);
  await P.ctx.unroute('http://127.0.0.1:' + L.FSP + '/**');
  await P.evaluate(() => window.dispatchEvent(new Event('online'))); await L.calmaTutti([T, P, I], 8000);
  r = await stato([T, P, I], uid);
  L.esito('C6 riunione fatta sul telefono + titolo cambiato nel calendario letto dal pc staccato dal cloud: alla fine è «fatta» e col titolo nuovo ovunque', Object.entries(r).filter(([k]) => k !== 'eventiGoogle').every(([k, v]) => /g7:Colloquio \(spostato sala B\)\[x\]/.test(v)), r);
  for (const p of [T, P, I]) L.esito('C errori in pagina su ' + p.__nome, !p.__err.length, p.__err.slice(0, 3));
  L.salvaRisultati('r1-s07'); await L.browser().close(); srv.close();
})();
