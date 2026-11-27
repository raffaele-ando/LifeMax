/* Dati del sito cancellati mentre si è dentro: solo localStorage; tutto (come ITP di Safari dopo 7 giorni / reinstallazione PWA) */
const L = require('../lib');
const URL = 'http://127.0.0.1:' + L.PORTA + '/';
const vista = (p) => p.evaluate(() => { const s = LM.load(); return { azioni: s.azioni.length, nome: s.profilo.nome, onb: s.onboarded, benvenuto: !!document.getElementById('onboarding-root').innerHTML, connesso: !!(window.LM_AUTH && window.LM_AUTH.user) }; });
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();
  const T = await L.dispositivo('telefono', { tipo: 'iphone' }), P = await L.dispositivo('pc', { tipo: 'pc' });
  for (const p of [T, P]) await L.accedi(p, 'mario', 'mario@prova.it');
  const uid = await L.uidDi(T);
  await T.evaluate(() => { const s = LM.load(); s.onboarded = true; s.profilo.nome = 'Mario'; LM.save(); for (let i = 0; i < 4; i++) LM.aggiungiAzione('cosa ' + i, null); });
  await L.calmaTutti([T, P], 2500);
  // solo localStorage cancellato, sessione Firebase intatta
  await T.goto(URL + 'manifest.webmanifest'); await T.evaluate(() => localStorage.clear());
  await T.goto(URL + 'index.html'); await T.waitForFunction(() => window.LM); await T.waitForTimeout(1200);
  const subito = await vista(T);
  await L.calmaTutti([T, P], 4000);
  const dopo = await vista(T), pc = await vista(P);
  L.esito('S9.1 localStorage cancellato (sessione ancora valida): i dati tornano dal cloud, il nome resta, niente benvenuto', dopo.azioni === 4 && dopo.nome === 'Mario' && pc.nome === 'Mario' && !dopo.benvenuto, { appenaAperto: subito, dopo, pc });
  // tutto cancellato (nuovo contesto = come ITP/reinstallazione), poi accesso
  const T3 = await L.dispositivo('telefono-reinstallato', { tipo: 'iphone' });
  const subito3 = await vista(T3);
  await L.accedi(T3, 'mario', 'mario@prova.it'); await L.calmaTutti([T3, P], 3000);
  const dopo3 = await vista(T3), pc3 = await vista(P);
  L.esito('S9.2 PWA reinstallata / Safari ha cancellato i dati (7 giorni): dopo l’accesso tutto torna e il nome NON si perde', dopo3.azioni === 4 && dopo3.nome === 'Mario' && pc3.nome === 'Mario', { appenaAperto: subito3, dopo: dopo3, pc: pc3 });
  L.salvaRisultati('r1-s09'); await L.browser().close(); srv.close();
})();
