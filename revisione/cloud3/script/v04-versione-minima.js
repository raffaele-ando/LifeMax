/* V04 — M5 RILETTO DA AVVERSARIO: `versioneMinima` nel documento principale.
     A  oggi (VERSIONE_APP = VERSIONE_MINIMA = 1) due schede della versione di
        oggi non si chiudono fuori a vicenda: scrivono e ricevono
     B  se un giorno una versione scrive versioneMinima 2 e poi si torna
        indietro (rollback del deploy), le schede della versione 1 restano
        fuori per sempre? (il campo sale e non scende: Math.max in nuvola.ts)
   node v04-versione-minima.js */
'use strict';
const L = require('./lib');
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();
  const A = await L.dispositivo('pc', { tipo: 'pc' }), B = await L.dispositivo('telefono', { tipo: 'iphone' });
  await L.accedi(A, 'vera', 'vera@prova.it'); await L.accedi(B, 'vera', 'vera@prova.it');
  const uid = await L.uidDi(A);
  await A.evaluate(() => LM.aggiungiAzione('dal pc', null)); await B.evaluate(() => LM.aggiungiAzione('dal telefono', null));
  await L.calmaTutti([A, B], 3000);
  const m = await L.docRaw('users/' + uid);
  const ta = await L.testi(A), tb = await L.testi(B);
  L.esito('A1 versione di oggi: due dispositivi scrivono e ricevono, nessuna striscia «versione nuova»', ta.includes('dal telefono') && tb.includes('dal pc') && !(await A.$('#lm-versione-nuova')), { versioneMinimaNelCloud: m && m.versioneMinima, pc: ta, telefono: tb });

  /* B: una versione futura ha scritto 2, poi il sito torna alla versione 1 */
  await L.scriviDoc('users/' + uid + '?updateMask.fieldPaths=versioneMinima', { versioneMinima: 2 });
  await A.waitForTimeout(1500);
  await A.evaluate(() => LM.aggiungiAzione('scritta dopo il rollback', null)); await L.calma(A, 3000);
  await L.riapri(A); await L.calma(A, 3000);
  const cloud = await L.docCloud(uid);
  const striscia = await A.evaluate(() => (document.getElementById('lm-versione-nuova') || {}).innerText || '');
  await L.foto(A, 'v04-b-rollback-striscia-per-sempre');
  L.esito('B1 [rischio M5] dopo un rollback la versione 1 (che è quella sul server) torna a salvare dopo «Ricarica»', JSON.stringify(cloud.stato || {}).indexOf('scritta dopo il rollback') >= 0, { striscia, versioneMinima: cloud.principale.versioneMinima });
  L.salvaRisultati('v04-versione-minima'); await L.browser().close(); srv.close(); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
