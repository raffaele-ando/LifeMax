/* Riproduzione fuga di dati fra account.
   a) Firebase chiude la sessione da solo (account disabilitato / token revocato / sessione scaduta): i dati di Mario restano sul dispositivo; poi accede Luigi.
   b) Due schede: «Esci» nella prima; la seconda continua e riscrive i dati; poi Luigi accede. */
const L = require('./lib');
const az = (p) => p.evaluate(() => LM.load().azioni.map(a => a.testo).sort().join(' | '));
(async () => {
  const srv = await L.servi(); await L.avvia();
  // (a)
  await L.pulisciTutto();
  const A = await L.dispositivo('pc-di-casa', { tipo: 'pc' });
  await L.accedi(A, 'mario', 'mario@prova.it');
  const uidM = await L.uidDi(A);
  await A.evaluate(() => { LM.aggiungiAzione('Analisi del sangue (privato di Mario)', null); LM.registraCheckin(1, 1, 1, 'giornata pessima'); });
  await L.calma(A, 2000);
  await L.richiesta('POST', '127.0.0.1', 9399, '/identitytoolkit.googleapis.com/v1/projects/demo-lifemax/accounts:update', { localId: uidM, disableUser: true }, { Authorization: 'Bearer owner' });
  await A.evaluate(() => window.__auth.currentUser.getIdToken(true).catch(e => e.code));
  await A.waitForTimeout(2000);
  const st = await A.evaluate(() => ({ connesso: !!(window.LM_AUTH && window.LM_AUTH.user), azioni: LM.load().azioni.length, avvisi: [...document.querySelectorAll('.toast, [role=alert], [role=status]')].map(t => t.textContent.trim()).filter(Boolean) }));
  L.esito('R04a.1 sessione chiusa da Firebase (account disabilitato): l’utente viene avvisato', st.avvisi.some(t => /sessione|account|accedi/i.test(t)), st);
  await A.screenshot({ path: L.S + '/r04a-dopo-sessione-chiusa.png' });
  await L.accedi(A, 'luigi', 'luigi@prova.it');
  const uidL = await L.uidDi(A);
  const dl = await L.docCloud(uidL);
  L.esito('R04a.2 Luigi accede sullo stesso pc: il suo account NON contiene i dati di Mario', !dl.stato.azioni.some(a => /Mario/.test(a.testo)) && !dl.stato.checkins.length, { cloudLuigi: dl.stato.azioni.map(a => a.testo), checkinsLuigi: dl.stato.checkins.length, schermoLuigi: await az(A) });
  await A.screenshot({ path: L.S + '/r04a-luigi-vede-mario.png' });
  await A.ctx.close();
  // (b)
  await L.pulisciTutto();
  const T1 = await L.dispositivo('scheda1', { tipo: 'pc' });
  await L.accedi(T1, 'mario', 'mario@prova.it');
  await T1.evaluate(() => LM.aggiungiAzione('Colloquio di lavoro segreto (Mario)', null)); await L.calma(T1, 1500);
  const T2 = await L.dispositivo('scheda2', { ctx: T1.ctx }); await T2.waitForTimeout(3000);
  await T1.evaluate(() => window.LMCloud.signOut());
  await T1.waitForTimeout(6000);
  const s2 = await T2.evaluate(() => ({ connesso: !!(window.LM_AUTH && window.LM_AUTH.user), azioni: LM.load().azioni.length }));
  L.esito('R04b.1 «Esci» nella scheda 1: dopo 6 s la scheda 2 è disconnessa e vuota', !s2.connesso && s2.azioni === 0, s2);
  await T2.evaluate(() => LM.cattura('appunto scritto nella scheda 2'));
  await T2.waitForTimeout(800);
  const nelDispositivo = await T1.evaluate(() => { const k = Object.keys(localStorage).find(k => /^lifemax\.v\d$/.test(k)) || 'lifemax.v1'; try { return JSON.parse(localStorage.getItem(k)).azioni.map(a => a.testo); } catch (e) { return 'chiave? ' + Object.keys(localStorage).join(','); } });
  L.esito('R04b.2 dopo una scrittura nella scheda 2, il salvataggio del dispositivo resta pulito', Array.isArray(nelDispositivo) && nelDispositivo.length === 0, nelDispositivo);
  await L.accedi(T1, 'luigi', 'luigi@prova.it'); await L.calmaTutti([T1, T2], 3000);
  const uidL2 = await L.uidDi(T1);
  const dl2 = await L.docCloud(uidL2);
  L.esito('R04b.3 Luigi accede nella scheda 1: nessun dato di Mario nel suo account', dl2 && !dl2.stato.azioni.some(a => /Mario/.test(a.testo)), dl2 && dl2.stato.azioni.map(a => a.testo));
  L.salvaRisultati('r04'); await L.browser().close(); srv.close();
})();
