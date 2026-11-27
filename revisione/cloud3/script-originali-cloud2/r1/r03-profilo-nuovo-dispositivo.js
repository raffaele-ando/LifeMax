/* Riproduzione: un dispositivo NUOVO (mai usato) che accede a un account esistente sovrascrive il profilo con i valori predefiniti */
const L = require('../lib');
const prof = (p) => p.evaluate(() => { const s = LM.load(); return { nome: s.profilo.nome, visione: s.profilo.visione, sveglia: s.profilo.ritmo && s.profilo.ritmo.sveglia, pomodoro: s.profilo.timer && s.profilo.timer.pomodoro, modo: s.profilo.modo, updatedAt: s.updatedAt }; });
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();
  const A = await L.dispositivo('telefono', { tipo: 'iphone' });
  await L.accedi(A, 'mario', 'mario@prova.it');
  await A.evaluate(() => { const s = LM.load(); s.onboarded = true; s.profilo.nome = 'Mario'; s.profilo.visione = 'Vivere con calma'; s.profilo.ritmo.sveglia = '06:00'; s.profilo.timer = { pomodoro: 50, pausa: 10 }; s.profilo.modo = 'scuro'; LM.save(); });
  await L.calma(A, 2000);
  const prima = await prof(A);
  // iPad nuovo: apre l'app, vede il benvenuto, lo chiude senza scrivere niente (o lo lascia lì), poi accede
  const C = await L.dispositivo('ipad-nuovo', { tipo: 'ipad' });
  await C.waitForTimeout(1500);
  const cPrima = await C.evaluate(() => ({ updatedAt: LM.load().updatedAt, onboarded: LM.load().onboarded, benvenuto: !!document.getElementById('onboarding-root').innerHTML }));
  await L.accedi(C, 'mario', 'mario@prova.it');
  await L.calmaTutti([A, C], 3000);
  const dopoA = await prof(A), dopoC = await prof(C);
  L.esito('R03 iPad nuovo accede: il profilo del telefono resta (nome, visione, sveglia, timer, tema)', ['nome', 'visione', 'sveglia', 'pomodoro', 'modo'].every(k => dopoA[k] === prima[k] && dopoC[k] === prima[k]), { telefonoPrima: prima, iPadAppenaAperto: cPrima, telefonoDopo: dopoA, iPadDopo: dopoC });
  await C.screenshot({ path: L.CONSEGNA + '/schermate/r1-r03-ipad-dopo-accesso.png' });
  L.salvaRisultati('r1-r03'); await L.browser().close(); srv.close();
})();
