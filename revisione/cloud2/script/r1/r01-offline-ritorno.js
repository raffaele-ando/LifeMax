/* Riproduzione: telefono offline aggiunge X; il pc aggiunge Y; il telefono torna online -> Y sparisce dal cloud e dal telefono */
const L = require('../lib');
const tx = async (p) => (await L.testi(p)).sort().join(',');
const log = async (p) => (await p.evaluate(() => LMLog.righe().filter(r => r.can === 'cloud').map(r => new Date(r.t).toISOString().slice(17,23) + ' ' + r.msg + ' ' + (r.dati || '')))).join('\n   ');
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();
  const N = +(process.env.N || 2);
  const devs = [await L.dispositivo('telefono', { tipo: 'iphone' }), await L.dispositivo('pc', { tipo: 'pc' })];
  if (N > 2) devs.push(await L.dispositivo('ipad', { tipo: 'ipad' }));
  const [A, B] = devs;
  for (const p of devs) await L.accedi(p, 'mario', 'mario@prova.it');
  const uid = await L.uidDi(A);
  await A.ctx.setOffline(true);
  await A.evaluate(() => LM.aggiungiAzione('X offline telefono', null));
  await A.waitForTimeout(500);
  await B.evaluate(() => LM.aggiungiAzione('Y pc', null));
  await L.calmaTutti(devs.slice(1), 1500);
  await A.ctx.setOffline(false);
  await L.calmaTutti(devs, 8000);
  const d = await L.docCloud(uid);
  const r = { telefono: await tx(A), pc: await tx(B), cloud: d.stato.azioni.map(x => x.testo).sort().join(',') };
  if (N > 2) r.ipad = await tx(devs[2]);
  L.esito('R01 (' + N + ' dispositivi) dopo il ritorno online del telefono tutti hanno X e Y', Object.values(r).every(v => v.includes('X') && v.includes('Y')), r);
  console.log(' telefono:\n   ' + await log(A)); console.log(' pc:\n   ' + await log(B));
  await L.browser().close(); srv.close();
})();
