/* Riproduzione «PC sempre aperto diventa sordo»: il telefono ha cose scritte offline (app chiusa), il PC scrive dopo;
   il telefono si riapre, unisce, e rimanda il risultato con l'ORARIO del PC: il PC lo scambia per la propria eco e lo ignora. */
const L = require('../lib');
const tx = async (p) => (await L.testi(p)).sort().join(',');
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();
  const T = await L.dispositivo('telefono', { tipo: 'iphone' }), P = await L.dispositivo('pc', { tipo: 'pc' });
  for (const p of [T, P]) await L.accedi(p, 'mario', 'mario@prova.it');
  const uid = await L.uidDi(T);
  // in metropolitana: telefono senza rete, scrive e chiude l'app
  await T.ctx.setOffline(true);
  await T.evaluate(() => LM.aggiungiAzione('Scritta in metro (telefono)', null));
  await T.waitForTimeout(300); await T.close();
  // in ufficio il PC (sempre aperto) scrive dopo
  await P.evaluate(() => LM.aggiungiAzione('Scritta in ufficio (pc)', null)); await L.calma(P, 2000);
  // il telefono esce dalla metro e riapre l'app
  await T.ctx.setOffline(false);
  const T2 = await L.dispositivo('telefono', { ctx: T.ctx }); await L.calmaTutti([T2, P], 6000);
  const d = await L.docCloud(uid);
  const r = { telefono: await tx(T2), pc: await tx(P), cloud: d.stato.azioni.map(a => a.testo).sort().join(','), updatedAtCloud: d.updatedAt, scrittureDelPc: await P.evaluate(() => (window.__setDocs || []).filter(x => x.path.split('/').length === 2).map(x => x.at)) };
  L.esito('R05 PC sempre aperto riceve la cosa scritta in metro dal telefono', r.pc.includes('metro'), r);
  await P.waitForTimeout(+(process.env.ATTESA||60000));
  L.esito('R05b ...neanche dopo un minuto?', (await tx(P)).includes('metro'), await tx(P));
  await T2.close();
  await P.evaluate(() => LM.aggiungiAzione('Altra cosa dal pc, telefono in tasca', null)); await L.calma(P, 3000);
  const d2 = await L.docCloud(uid);
  L.esito('R05c il telefono va in tasca (app chiusa) e il PC scrive ancora: la cosa della metro resta nel cloud', d2.stato.azioni.some(a => /metro/.test(a.testo)), d2.stato.azioni.map(a => a.testo));
  const I = await L.dispositivo('ipad', { tipo: 'ipad' }); await L.accedi(I, 'mario', 'mario@prova.it');
  L.esito('R05d un iPad che accede adesso vede la cosa della metro', (await tx(I)).includes('metro'), await tx(I));
  await P.screenshot({ path: L.CONSEGNA + '/schermate/r1-r05-pc-senza-la-cosa-del-telefono.png' });
  L.salvaRisultati('r1-r05'); await L.browser().close(); srv.close();
})();
