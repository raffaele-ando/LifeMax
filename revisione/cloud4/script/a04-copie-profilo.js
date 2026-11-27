/* A04 — Le copie nel cloud «prima di cambiare nome o visione» (correzione N11,
   0420bee) e il tetto di trenta copie: chi ritocca la visione qualche volta
   di seguito fa uscire dal cloud le copie dei giorni prima — proprio quelle
   da cui «Riprendi» e «Sostituisci» dovrebbero ripartire.
   Qui: due giorni di copie del giorno, poi la visione ritoccata 30 volte
   (ogni ritocco è un salvataggio a parte, come uscire dal campo).
   node a04-copie-profilo.js */
'use strict';
const { banco, esiti } = require('./lib');
const R = esiti('a04-copie-profilo');
const G = 86400000;

(async () => {
  const { B, N, chiudi } = await banco(9400);
  try {
    await N.pulisci();
    const P = await B.dispositivo('pc');
    await B.accedi(P, 'lia', 'lia@prova.it');
    const uid = await B.uidDi(P);
    await P.evaluate(() => { const s = LM.load(); s.onboarded = true; s.profilo.nome = 'Lia'; s.profilo.visione = 'Prima versione'; LM.aggiungiAzione('Cosa di lunedì', null); LM.save(); });
    await B.calma(P, 2000);
    /* due giorni dopo, e poi un altro: ogni giorno la sua copia del giorno */
    for (let g = 1; g <= 2; g++) {
      await B.avanti(P, G); await P.reload(); await P.waitForFunction(() => window.LM && window.LM_AUTH && window.LM_AUTH.user, null, { timeout: 20000 }); await B.calma(P, 1500);
      await P.evaluate((n) => LM.aggiungiAzione('Cosa del giorno ' + n, null), g); await B.calma(P, 2500);
    }
    const prima = (await N.elenco('users/' + uid + '/copie')).map((c) => ({ motivo: c.motivo, salvato: new Date(c.salvato).toISOString().slice(0, 16) }));
    R.nota('A04 copie nel cloud prima dei ritocchi', prima);
    const delGiorno0 = prima.filter((c) => c.motivo === 'copia-del-giorno').length;
    /* la visione ritoccata 30 volte, uscendo dal campo ogni volta */
    for (let i = 1; i <= 30; i++) {
      await P.evaluate((n) => { const s = LM.load(); s.profilo.visione = 'Visione, ritocco ' + n; LM.save(); }, i);
      await P.waitForTimeout(2300); await B.calma(P, 200);
    }
    await B.calma(P, 3000); await P.waitForTimeout(3000);
    const dopo = (await N.elenco('users/' + uid + '/copie')).map((c) => ({ motivo: c.motivo, salvato: new Date(c.salvato).toISOString().slice(0, 16) }));
    const conti = {}; dopo.forEach((c) => { conti[c.motivo] = (conti[c.motivo] || 0) + 1; });
    R.nota('A04 copie nel cloud dopo i ritocchi (per motivo)', conti);
    const delGiorno = dopo.filter((c) => c.motivo === 'copia-del-giorno').length;
    R.ok('A04.1 le copie dei giorni prima restano nel cloud dopo aver ritoccato la visione', delGiorno0 > 0 && delGiorno === delGiorno0, { primaDelGiorno: delGiorno0, dopoDelGiorno: delGiorno, totale: dopo.length });
    await P.ctx.close();
  } catch (e) { R.ok('eccezione', false, String(e && e.stack || e)); }
  await chiudi();
  process.exit(R.fine() ? 1 : 0);
})();
