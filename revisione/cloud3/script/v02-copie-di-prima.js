/* V02 — C1 RILETTO DA AVVERSARIO: le copie locali di PRIMA dell'aggiornamento,
   e la copia «prima di entrare nell'account» dell'ospite con l'esempio.
   Verifica 3. Emulatore separato (FSP/AUP propri), stesso indirizzo per la
   versione vecchia (1548c72, wt-1548) e la nuova (d6d4bbd, wt): il server si
   chiude e si riapre sulla stessa porta con l'altra cartella, così la memoria
   del browser (localStorage) passa dall'una all'altra come in un aggiornamento.
     A  Mario (versione vecchia) prende una copia automatica dei SUOI dati
        («prima di riprendere una copia dal cloud»), esce; entra Luigi; arriva
        la versione nuova → Luigi vede/ripristina la copia di Mario?
     B  ospite con l'esempio + una cosa sua, versione vecchia, accede: la
        copia «prima di entrare nell'account» (unico posto dove sta la cosa
        sua) sopravvive all'aggiornamento?
     C  stessa cosa tutta sulla versione nuova: la copia si vede da dentro
        l'account (prima di C1 sì)?
   node v02-copie-di-prima.js */
'use strict';
const path = require('path');
const L = require('./lib');
const VECCHIA = path.join(L.S, 'wt-1548'), NUOVA = L.RADICE;
const SEG = 'Segreto di Mario (privato)', MIA = 'La mia cosa vera scritta sopra l’esempio';
let srv = null;
async function servi(radice) {
  if (srv) { srv.closeAllConnections && srv.closeAllConnections(); await new Promise((r) => srv.close(r)); }
  srv = await L.servi(L.PORTA, radice);
}
const contiene = (bk, t) => bk.filter((b) => (b.data || '').indexOf(t) >= 0).map((b) => ({ motivo: b.motivo, chi: b.chi }));
(async () => {
  await L.avvia(); await L.pulisciTutto();

  /* ------------------------------------------------------------ A */
  await servi(VECCHIA);
  const P = await L.dispositivo('pc-condiviso', { tipo: 'pc' });
  await L.accedi(P, 'mario', 'mario@prova.it');
  await P.evaluate((t) => { LM.aggiungiAzione(t, null); LM.load().profilo.nome = 'Mario Rossi'; LM.save(); }, SEG);
  await L.calma(P, 2000);
  /* la copia che la nuvola prende prima di «Riprendi una copia dal cloud» (nuvola.ts:1308) */
  await P.evaluate(() => LM.backup('prima-di-riprendere-una-copia-dal-cloud'));
  await P.evaluate(() => window.LMCloud.signOut()); await L.calma(P, 1500);
  await L.accedi(P, 'luigi', 'luigi@prova.it');
  const uidL = await L.uidDi(P);
  await L.calma(P, 1500);
  const primaAgg = await P.evaluate(() => JSON.parse(localStorage.getItem('lifemax.backups.v1') || '[]'));
  L.esito('A0 (versione vecchia) nel browser di Luigi c’è una copia senza proprietario con i dati di Mario', contiene(primaAgg, SEG).length > 0, contiene(primaAgg, SEG));
  await servi(NUOVA);
  await L.riapri(P); await L.calma(P, 2500);
  const elenco = await P.evaluate(() => LM.listBackups());
  const dopoAgg = await P.evaluate(() => JSON.parse(localStorage.getItem('lifemax.backups.v1') || '[]'));
  const diMario = contiene(dopoAgg, SEG);
  L.esito('A1 [fuga, copie di prima] dopo l’aggiornamento Luigi NON ha fra le sue copie quella con i dati di Mario', !diMario.some((b) => b.chi === uidL), { copieConDatiDiMario: diMario, elencoLuigi: elenco });
  const t = (await P.evaluate((s) => JSON.parse(localStorage.getItem('lifemax.backups.v1') || '[]').filter((b) => (b.data || '').indexOf(s) >= 0 && b.chi === (localStorage.getItem('lm-account-unito') || '')).map((b) => b.ts)[0], SEG));
  if (t) { await P.evaluate((x) => LM.restoreBackup(x), t); await L.calma(P, 3000); }
  const cloudL = await L.docCloud(uidL);
  L.esito('A2 [fuga, copie di prima] ripristinandola, i dati di Mario NON finiscono nel cloud di Luigi', JSON.stringify((cloudL && cloudL.stato) || {}).indexOf(SEG) < 0, { ripristinata: !!t, nomeNelCloudDiLuigi: cloudL && cloudL.stato && cloudL.stato.profilo && cloudL.stato.profilo.nome });
  await L.foto(P, 'v02-a-luigi-dopo-ripristino-copia-di-prima');
  await P.ctx.close();

  /* ------------------------------------------------------------ B */
  await L.pulisciTutto();
  await servi(VECCHIA);
  const Q = await L.dispositivo('telefono-ospite', { tipo: 'iphone' });
  await Q.evaluate(() => { LM.seedDemo(); });
  await L.riapri(Q);
  await Q.evaluate((t) => LM.aggiungiAzione(t, null), MIA); await L.calma(Q, 500);
  await L.accedi(Q, 'bea', 'bea@prova.it'); await L.calma(Q, 2000);
  const bkV = await Q.evaluate(() => JSON.parse(localStorage.getItem('lifemax.backups.v1') || '[]'));
  const schermoV = await Q.evaluate((t) => LM.load().azioni.some((a) => a.testo === t), MIA);
  L.esito('B0 (versione vecchia) entrando, la cosa scritta sopra l’esempio esce dallo schermo e sta SOLO nella copia «prima di entrare nell’account»', !schermoV && contiene(bkV, MIA).length > 0, { sulloSchermo: schermoV, copie: contiene(bkV, MIA) });
  await servi(NUOVA);
  await L.riapri(Q); await L.calma(Q, 2500);
  const elencoB = await Q.evaluate(() => LM.listBackups());
  const bkN = await Q.evaluate(() => JSON.parse(localStorage.getItem('lifemax.backups.v1') || '[]'));
  L.esito('B1 [perdita, copie di prima] dopo l’aggiornamento la copia con la cosa sua esiste ancora nel browser', contiene(bkN, MIA).length > 0, { copie: contiene(bkN, MIA), elencoVisibile: elencoB });
  await Q.ctx.close();

  /* ------------------------------------------------------------ C */
  await L.pulisciTutto();
  const R = await L.dispositivo('telefono-ospite-nuovo', { tipo: 'iphone' });
  await R.evaluate(() => { LM.seedDemo(); });
  await L.riapri(R);
  await R.evaluate((t) => LM.aggiungiAzione(t, null), MIA); await L.calma(R, 500);
  await L.accedi(R, 'carla', 'carla@prova.it'); await L.calma(R, 2000);
  const sch = await R.evaluate((t) => LM.load().azioni.some((a) => a.testo === t), MIA);
  const bkC = await R.evaluate(() => JSON.parse(localStorage.getItem('lifemax.backups.v1') || '[]'));
  const visC = await R.evaluate(() => LM.listBackups());
  const dentro = contiene(bkC, MIA);
  L.esito('C0 entrando, la cosa scritta sopra l’esempio esce dallo schermo e va in una copia', !sch && dentro.length > 0, { sulloSchermo: sch, copie: dentro });
  L.esito('C1 [regressione C1] quella copia si vede (e si ripristina) da «Backup e ripristino» stando nell’account', visC.some((b) => b.motivo === 'prima-di-entrare-nell-account'), { elencoNellAccount: visC, proprietarioCopia: dentro });
  await R.evaluate(() => { location.hash = '#/profilo'; }); await R.waitForTimeout(600);
  const bt = await R.$('#imp-backup'); if (bt) { await bt.click().catch(() => {}); await R.waitForTimeout(900); }
  await L.foto(R, 'v02-c-backup-nell-account-senza-la-copia-dell-ospite');
  await R.ctx.close();

  L.salvaRisultati('v02-copie-di-prima');
  await L.browser().close(); srv.close(); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
