/* Storia: telefono sempre usato, PC sempre aperto, iPad lasciato fermo GIORNI settimane mesi e poi riaperto */
const L = require('../lib');
const GIORNI = +(process.env.GIORNI || 45);
const G = 86400000;
const URL = 'http://127.0.0.1:9301/index.html';
const vista = (p) => p.evaluate(() => { const s = LM.load(); return { azioni: s.azioni.map(a => a.testo + (a.done ? '[x]' : '')).sort().join(' | '), nome: s.profilo.nome, sveglia: s.profilo.ritmo.sveglia, modo: s.profilo.modo, areaStudio: s.areeAttive.includes('studio'), abitudine: s.abitudini.map(h => h.testo).join(',') }; });
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();
  const T = await L.dispositivo('telefono', { tipo: 'iphone' }), P = await L.dispositivo('pc', { tipo: 'pc' }), I = await L.dispositivo('ipad', { tipo: 'ipad' });
  for (const p of [T, P, I]) await L.accedi(p, 'mario', 'mario@prova.it');
  const uid = await L.uidDi(T);
  await T.evaluate(() => { const s = LM.load(); s.profilo.nome = 'Mario'; s.profilo.ritmo.sveglia = '07:00'; LM.save();
    LM.aggiungiAzione('Vecchia cosa da cancellare', null); LM.aggiungiAzione('Rinnovare passaporto', null); LM.aggiungiAbitudine('Meditare', null, [0,1,2,3,4,5,6]); });
  await L.calmaTutti([T, P, I], 3000);
  // l'iPad viene messo nel cassetto (pagina chiusa: app chiusa)
  await I.close();
  // passano GIORNI giorni: il telefono cambia molte cose, il PC resta aperto
  if (process.env.PRESTO) { await T.evaluate(() => LM.rimuoviAzione(LM.load().azioni.find(a => a.testo === 'Vecchia cosa da cancellare').id)); await L.calmaTutti([T, P], 2000); }
  await L.avanti(T, GIORNI * G); await L.avanti(P, GIORNI * G);
  await T.evaluate(() => { const s = LM.load();
    const v = s.azioni.find(a => a.testo === 'Vecchia cosa da cancellare'); if (v) LM.rimuoviAzione(v.id);
    LM.modificaAzione(s.azioni.find(a => a.testo === 'Rinnovare passaporto').id, 'Rinnovare passaporto (fatto il modulo)');
    LM.modificaAbitudine(s.abitudini[0].id, { testo: 'Meditare 10 minuti' });
    LM.toggleArea('studio', false);
    const s2 = LM.load(); s2.profilo.nome = 'Mario Rossi'; s2.profilo.ritmo.sveglia = '06:15'; s2.profilo.modo = 'scuro'; LM.save(); });
  await L.calmaTutti([T, P], 3000);
  const atteso = await vista(T);
  const pcVede = await vista(P);
  L.esito('S6.0 PC sempre aperto vede le modifiche del telefono (' + GIORNI + ' giorni dopo)', JSON.stringify(pcVede) === JSON.stringify(atteso), { telefono: atteso, pc: pcVede });
  // l'iPad viene riaperto GIORNI giorni dopo
  const I2 = await I.ctx.newPage(); I2.__nome = 'ipad'; I2.__err = []; I2.on('pageerror', e => I2.__err.push(String(e)));
  await I2.addInitScript((ms) => { try { localStorage.setItem('__off', String(ms)); } catch (e) {} }, GIORNI * G);
  await I2.goto(URL);
  await I2.waitForFunction(() => window.LM, null, { timeout: 15000 });
  const primaSchermata = await vista(I2);
  await I2.screenshot({ path: L.CONSEGNA + '/schermate/r1-s06-ipad-appena-aperto-' + GIORNI + 'g.png' });
  await I2.waitForFunction(() => window.LM_AUTH && window.LM_AUTH.user && !window.LM_AUTH.syncing, null, { timeout: 20000 }).catch(() => {});
  await L.calmaTutti([I2, T, P], 4000);
  const dopo = { telefono: await vista(T), pc: await vista(P), ipad: await vista(I2) };
  const cloud = (await L.docCloud(uid)).stato;
  L.esito('S6.1 iPad riaperto dopo ' + GIORNI + ' giorni: mostra subito i dati vecchi prima di sincronizzare (atteso, ma da sapere)', true, { primaSchermataIpad: primaSchermata });
  L.esito('S6.2 dopo la sincronizzazione TUTTI uguali al telefono (niente cancellazioni risorte, niente modifiche perse, profilo del telefono)', [dopo.telefono, dopo.pc, dopo.ipad].every(v => JSON.stringify(v) === JSON.stringify(atteso)), { atteso, dopo, sessioneIpad: await I2.evaluate(() => !!(window.LM_AUTH && window.LM_AUTH.user)) });
  console.log(' cloud: ', cloud.azioni.map(a => a.testo), cloud.profilo.nome, cloud.profilo.ritmo.sveglia);
  L.salvaRisultati('r1-s06-' + GIORNI + (process.env.PRESTO ? '-presto' : '')); await L.browser().close(); srv.close();
})();
