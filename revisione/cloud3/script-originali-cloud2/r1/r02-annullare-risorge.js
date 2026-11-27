/* Riproduzione: togliere una spunta / disattivare un'area / ripristinare orari su UN dispositivo
   non arriva agli altri, e alla prima scrittura degli altri torna indietro anche sul primo. */
const L = require('../lib');
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();
  const A = await L.dispositivo('telefono', { tipo: 'iphone' }), B = await L.dispositivo('pc', { tipo: 'pc' });
  for (const p of [A, B]) await L.accedi(p, 'mario', 'mario@prova.it');
  const uid = await L.uidDi(A);
  const stato = (p) => p.evaluate(() => { const s = LM.load(); const a = s.azioni[0], h = s.abitudini[0];
    return { azioneFatta: a && a.done, xp: s.xp, abitudineSpuntata: h && Object.keys(h.fatti).length > 0, areaStudioAttiva: s.areeAttive.includes('studio'), orariOggiPersonalizzati: !!(s.ritmoGiorno||{})[LM.todayKey()] }; });
  // preparazione sul pc: azione fatta, abitudine spuntata, orari personalizzati
  await B.evaluate(() => { const a = LM.aggiungiAzione('Bolletta', null); LM.completaAzione(a.id); const h = LM.aggiungiAbitudine('Leggere', null, [0,1,2,3,4,5,6]); LM.completaAbitudine(h.id); LM.setRitmoGiorno(LM.todayKey(), { sveglia: '06:30' }); });
  await L.calmaTutti([A, B], 2500);
  console.log('dopo preparazione  telefono', await stato(A), ' pc', await stato(B));
  // sul telefono si annulla tutto
  await A.evaluate(() => { const s = LM.load(); LM.completaAzione(s.azioni[0].id); LM.completaAbitudine(s.abitudini[0].id); LM.toggleArea('studio', false); LM.azzeraRitmoGiorno(LM.todayKey()); });
  await L.calmaTutti([A, B], 2500);
  const t1 = await stato(A), p1 = await stato(B), c1 = (await L.docCloud(uid)).stato;
  console.log('dopo annullare sul telefono  telefono', t1, ' pc', p1, ' cloud', { fatta: c1.azioni[0].done, xp: c1.xp, area: c1.areeAttive.includes('studio') });
  L.esito('R02a annullamenti fatti sul telefono arrivano al pc', JSON.stringify(t1) === JSON.stringify(p1), { telefono: t1, pc: p1 });
  // il pc fa una cosa qualunque
  await B.evaluate(() => LM.cattura('nota qualunque dal pc'));
  await L.calmaTutti([A, B], 2500);
  const t2 = await stato(A);
  L.esito('R02b dopo una scrittura qualunque del pc, sul telefono NON tornano spunte/area/orari annullati', !t2.azioneFatta && !t2.abitudineSpuntata && !t2.areaStudioAttiva && !t2.orariOggiPersonalizzati && t2.xp === t1.xp, { telefonoPrima: t1, telefonoDopo: t2 });
  L.salvaRisultati('r1-r02'); await L.browser().close(); srv.close();
})();
