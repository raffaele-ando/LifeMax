/* A07 — Il timer avviato senza rete. Il campo `timer` si unisce con la regola
   «recente» (COME_UNIRE: vince il DOCUMENTO salvato per ultimo, non il
   timer toccato per ultimo). Telefono in metro, senza rete: fa partire un
   blocco di concentrazione da 50 minuti. Intanto sul PC si spunta una cosa
   qualunque (niente a che vedere col timer). Il telefono ritrova la rete.
   Atteso: il timer che sta girando sul telefono continua a girare.
   node a07-timer-offline.js */
'use strict';
const { banco, esiti } = require('./lib');
const R = esiti('a07-timer-offline');

(async () => {
  const { E, B, N, chiudi } = await banco(9400);
  const FS = 'http://127.0.0.1:' + E.P.firestore + '/**';
  try {
    await N.pulisci();
    const T = await B.dispositivo('telefono', { tipo: 'iphone' }), P = await B.dispositivo('pc');
    await B.accedi(T, 'teo', 'teo@prova.it'); await B.accedi(P, 'teo', 'teo@prova.it');
    await T.evaluate(() => { const s = LM.load(); s.onboarded = true; LM.save(); LM.aggiungiAzione('Scrivere il capitolo', null); LM.aggiungiAzione('Pagare la bolletta', null); });
    await B.calmaTutti([T, P], 3000);
    /* il telefono perde la rete e fa partire il timer */
    await T.ctx.route(FS, (r) => r.abort());
    await T.evaluate(() => window.dispatchEvent(new Event('offline')));
    await T.evaluate(() => { const ora = Date.now(); LM.avviaTimerDati({ azioneId: null, areaId: null, tipo: 'blocco', testo: 'Scrivere il capitolo', inizio: ora, fine: ora + 50 * 60000, durata: 50, ciclo: 0, inPausa: false, fermatoA: 0 }); });
    await T.waitForTimeout(1500);
    const vivo0 = await T.evaluate(() => !!LM.timerVivo());
    R.ok('A07.0 il timer gira sul telefono', vivo0);
    /* un minuto dopo, sul PC, si spunta un'altra cosa */
    await P.waitForTimeout(1500);
    await P.evaluate(() => { const a = LM.load().azioni.find((x) => x.testo === 'Pagare la bolletta'); LM.completaAzione(a.id); });
    await B.calma(P, 2500);
    /* il telefono ritrova la rete */
    await T.ctx.unroute(FS);
    await T.evaluate(() => window.dispatchEvent(new Event('online')));
    await B.calmaTutti([T, P], 4000); await B.calmaTutti([T, P], 2000);
    const dopo = { telefono: await T.evaluate(() => !!LM.timerVivo()), pc: await P.evaluate(() => !!LM.timerVivo()) };
    R.ok('A07.1 tornata la rete, il timer del telefono gira ancora (e il PC lo vede)', dopo.telefono && dopo.pc, dopo);
  } catch (e) { R.ok('eccezione', false, String(e && e.stack || e)); }
  await chiudi();
  process.exit(R.fine() ? 1 : 0);
})();
