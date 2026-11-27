/* A01 — «Annulla» dal Diario dopo che è arrivato qualcosa dagli altri dispositivi.
   Due dispositivi dello stesso account (PC, iPhone). Sul PC si toglie una cosa
   da Oggi; poi sul telefono si aggiunge una cosa nuova e se ne rinomina
   un'altra; il PC le riceve dal cloud. Sul PC, dal Diario, si tocca «Annulla»
   sulla riga «Rimossa da oggi» (l'ultima cosa fatta SU QUEL PC: nessun avviso).
   Atteso: torna la cosa tolta, e basta. Le cose del telefono restano.
   node a01-annulla-dopo-cloud.js */
'use strict';
const { banco, esiti } = require('./lib');
const R = esiti('a01-annulla-dopo-cloud');

(async () => {
  const { B, N, chiudi } = await banco(9400);
  try {
    await N.pulisci();
    const P = await B.dispositivo('pc'), T = await B.dispositivo('telefono', { tipo: 'iphone' });
    await B.accedi(P, 'anna', 'anna@prova.it'); await B.accedi(T, 'anna', 'anna@prova.it');
    const uid = await B.uidDi(P);
    /* il benvenuto già fatto, come per chi usa l'app da tempo */
    await P.evaluate(() => { const s = LM.load(); s.onboarded = true; LM.save(); });
    await B.calmaTutti([P, T], 2000);
    for (const d of [P, T]) { await d.reload(); await d.waitForFunction(() => window.LM && window.LM_AUTH && window.LM_AUTH.user, null, { timeout: 20000 }); }
    await B.calmaTutti([P, T], 2000);
    await P.evaluate(() => { LM.aggiungiAzione('Cosa da togliere', null); LM.aggiungiAzione('Bozza relazione', null); });
    await B.calmaTutti([P, T], 3000);
    /* sul PC: «Rimossa da oggi» */
    await P.evaluate(() => { const a = LM.load().azioni.find((x) => x.testo === 'Cosa da togliere'); LM.rimuoviAzione(a.id); });
    await B.calmaTutti([P, T], 3000);
    /* sul telefono, dopo: una cosa nuova e una rinomina */
    await T.evaluate(() => {
      LM.aggiungiAzione('Chiamare il medico (dal telefono)', null);
      const b = LM.load().azioni.find((x) => x.testo === 'Bozza relazione'); b.testo = 'Relazione finale (rinominata dal telefono)'; LM.save();
    });
    await B.calmaTutti([P, T], 3000); await P.waitForTimeout(1500); await B.calma(P, 1000);
    const pcPrima = await P.evaluate(() => LM.load().azioni.map((a) => a.testo));
    R.ok('A01.0 il PC ha ricevuto le due cose del telefono', pcPrima.includes('Chiamare il medico (dal telefono)') && pcPrima.includes('Relazione finale (rinominata dal telefono)'), pcPrima);
    /* sul PC, dal Diario: «Annulla» sulla riga «Rimossa da oggi» */
    await P.evaluate(() => { location.hash = '#/profilo'; }); await P.waitForTimeout(700);
    await P.evaluate(() => { const t = document.getElementById('imp-diario'); if (t) t.click(); }); await P.waitForTimeout(700);
    await P.evaluate(() => { const t = [...document.querySelectorAll('#diario-filtro button')].find((x) => /Tutto/.test(x.textContent)); if (t) t.click(); }); await P.waitForTimeout(600);
    const riga = await P.evaluate(() => {
      const r = [...document.querySelectorAll('.diario-evento')].find((e) => /Rimossa da oggi/.test(e.textContent) && e.querySelector('[data-annulla]'));
      if (!r) return null;
      const b = r.querySelector('[data-annulla]');
      const pt = LM.puntoDiRitorno(+b.getAttribute('data-annulla'));
      b.click();
      return { testo: r.textContent.replace(/\s+/g, ' ').trim().slice(0, 80), dopo: pt && pt.dopo, avviso: !!document.querySelector('.avviso-ovl') };
    });
    R.ok('A01.1 sul PC la riga «Rimossa da oggi» ha «Annulla» ed è l’ultima cosa fatta lì (nessun avviso)', !!riga && riga.dopo === 0 && !riga.avviso, riga);
    await P.screenshot({ path: require('path').join(__dirname, '..', 'schermate', 'a01-pc-dopo-annulla.png') }).catch(() => {});
    await B.calmaTutti([P, T], 4000); await T.waitForTimeout(2000); await B.calmaTutti([P, T], 2000);
    const dopo = {
      pc: await P.evaluate(() => LM.load().azioni.map((a) => a.testo)),
      telefono: await T.evaluate(() => LM.load().azioni.map((a) => a.testo)),
      cloud: (((await N.stato(uid)) || {}).azioni || []).map((a) => a.testo)
    };
    R.ok('A01.2 la cosa tolta è tornata', dopo.pc.includes('Cosa da togliere'), dopo);
    R.ok('A01.3 la cosa nuova del telefono c’è ancora (PC, telefono, cloud)', ['pc', 'telefono', 'cloud'].every((k) => dopo[k].includes('Chiamare il medico (dal telefono)')), dopo);
    R.ok('A01.4 la rinomina del telefono c’è ancora (PC, telefono, cloud)', ['pc', 'telefono', 'cloud'].every((k) => dopo[k].includes('Relazione finale (rinominata dal telefono)')), dopo);
    await P.ctx.close(); await T.ctx.close();
  } catch (e) { R.ok('eccezione', false, String(e && e.stack || e)); }
  await chiudi();
  process.exit(R.fine() ? 1 : 0);
})();
