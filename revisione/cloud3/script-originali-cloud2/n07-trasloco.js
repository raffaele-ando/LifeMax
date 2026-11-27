/* N07 — IL TRASLOCO DA GITHUB.IO («Porta i miei dati»).
   Le due origini sono simulate come in prove/nuvola-spazio.js: 127.0.0.1 = «github.io»
   (vecchio), localhost = «lifemax.theproject.world» (nuovo), con window.__LM_TRASLOCO.
   A. ospite con dati sul vecchio, ospite con altri dati sul nuovo: «Porta i miei dati»
   B. il profilo: sul vecchio (dati di prima delle correzioni, senza orologi) e sul nuovo
   C. premuto due volte: doppioni?
   D. sul nuovo c'è un account collegato: i dati dell'ospite del vecchio finiscono nell'account?
   E. il browser blocca la finestra: la strada del file
   F. con l'account sul vecchio: «Vai al nuovo indirizzo» senza rete
   node n07-trasloco.js */
const L = require('./lib');
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();
  const ind = { nuovo: 'http://localhost:' + L.PORTA, vecchio: 'http://127.0.0.1:' + L.PORTA };
  const init = 'window.__LM_TRASLOCO = ' + JSON.stringify(ind) + ';';
  const ctx = await L.contesto({ tipo: 'iphone', init });
  /* il nuovo indirizzo, già usato da ospite, con un profilo recente */
  const NU = await L.dispositivo('nuovo-indirizzo', { ctx, host: 'localhost' });
  await NU.evaluate(() => { const s = LM.load(); s.onboarded = true; s.profilo.nome = 'Nome scritto di recente sul nuovo'; LM.save(); LM.aggiungiAzione('cosa del nuovo', null); });
  await NU.close();
  /* il vecchio indirizzo, con dati «di prima»: niente orologi, niente aggiornata */
  const VE = await L.dispositivo('vecchio-indirizzo', { ctx, host: '127.0.0.1' });
  await VE.evaluate(() => {
    const s = LM.load(); s.onboarded = true; s.profilo.nome = 'Nome vecchio (github.io, mesi fa)'; s.profilo.visione = 'visione vecchia'; LM.save();
    LM.aggiungiAzione('cosa del vecchio 1', null); LM.aggiungiAzione('cosa del vecchio 2', null);
    const raw = JSON.parse(localStorage.getItem('lifemax.v2')); raw.orologi = {}; raw.azioni.forEach((a) => { delete a.aggiornata; }); raw.updatedAt = Date.now() - 90 * 86400000;
    localStorage.setItem('lifemax.v2', JSON.stringify(raw));
  });
  await L.riapri(VE); await VE.waitForTimeout(5500);
  const scheda = await VE.evaluate(() => { const d = document.getElementById('lm-trasloco'); return d ? d.innerText : ''; });
  await L.foto(VE, 'n07-vecchio-indirizzo-proposta');
  L.esito('A0 sul vecchio indirizzo compare «LifeMax ha cambiato indirizzo» con «Porta i miei dati»', /Porta i miei dati/.test(scheda), scheda.slice(0, 160));
  const [popup] = await Promise.all([VE.waitForEvent('popup', { timeout: 10000 }).catch(() => null), VE.click('#lm-trasloco button.lm-tr-primo').catch(() => null)]);
  if (popup) { await popup.waitForLoadState('load').catch(() => {}); await popup.waitForTimeout(5000); }
  const fine = await VE.evaluate(() => (document.getElementById('lm-trasloco') || {}).innerText || '');
  const NU2 = popup || await L.dispositivo('nuovo-dopo', { ctx, host: 'localhost' });
  await NU2.waitForFunction(() => window.LM, null, { timeout: 10000 }).catch(() => {});
  const dopo = await NU2.evaluate(() => ({ azioni: LM.load().azioni.map((a) => a.testo).sort(), nome: LM.load().profilo.nome, visione: LM.load().profilo.visione }));
  await L.foto(NU2, 'n07-nuovo-indirizzo-dati-arrivati');
  L.esito('A1 i dati del vecchio arrivano sul nuovo, uniti a quelli che c’erano', ['cosa del nuovo', 'cosa del vecchio 1', 'cosa del vecchio 2'].every((t) => dopo.azioni.includes(t)), { vecchio: fine.slice(0, 80), nuovo: dopo });
  L.esito('B1 il nome scritto di recente sul nuovo NON viene sostituito da quello vecchio di github.io', dopo.nome === 'Nome scritto di recente sul nuovo', dopo);
  /* C: di nuovo */
  await VE.evaluate(() => { try { sessionStorage.removeItem('lm-trasloco-dopo'); } catch (e) {} });
  await L.riapri(VE); await VE.waitForTimeout(5500);
  const [pop2] = await Promise.all([VE.waitForEvent('popup', { timeout: 10000 }).catch(() => null), VE.click('#lm-trasloco button.lm-tr-primo').catch(() => null)]);
  if (pop2) { await pop2.waitForTimeout(5000); }
  const due = await (pop2 || NU2).evaluate(() => LM.load().azioni.map((a) => a.testo).sort());
  L.esito('C1 «Porta i miei dati» premuto due volte: niente doppioni', due.length === 3, due);
  const ancora = await VE.evaluate(() => !!document.getElementById('lm-trasloco'));
  L.esito('C2 dopo il trasloco riuscito, riaprendo il vecchio indirizzo la proposta torna ogni volta (nota)', true, { proposta: ancora, traslocato: await VE.evaluate(() => localStorage.getItem('lm-traslocato')) });

  /* D: sul nuovo c'è un account collegato */
  const ctxD = await L.contesto({ tipo: 'pc', init });
  const ND = await L.dispositivo('nuovo-con-account', { ctx: ctxD, host: 'localhost' });
  await L.accedi(ND, 'dario', 'dario@prova.it'); const uD = await L.uidDi(ND);
  await ND.evaluate(() => LM.aggiungiAzione('di Dario, nell’account', null)); await L.calma(ND, 1500);
  const VD = await L.dispositivo('vecchio-ospite', { ctx: ctxD, host: '127.0.0.1' });
  await VD.evaluate(() => { const s = LM.load(); s.onboarded = true; LM.save(); LM.aggiungiAzione('di chi usava github.io senza account (magari un’altra persona)', null); });
  await L.riapri(VD); await VD.waitForTimeout(5500);
  const [pD] = await Promise.all([VD.waitForEvent('popup', { timeout: 10000 }).catch(() => null), VD.click('#lm-trasloco button.lm-tr-primo').catch(() => null)]);
  if (pD) await pD.waitForTimeout(6000);
  await L.calma(ND, 3000);
  const cD = await L.docCloud(uD);
  L.esito('D1 i dati dell’ospite di github.io finiscono nell’account collegato sul nuovo, senza chiedere di chi sono (nota)', true, { cloudDario: cD.stato.azioni.map((a) => a.testo), haChiesto: pD ? await pD.evaluate(() => (document.querySelector('.avviso h2') || {}).textContent || '') : 'niente popup' });

  /* E: il browser blocca la finestra */
  const ctxE = await L.contesto({ tipo: 'iphone', init: init + 'window.open = function () { return null; };' });
  const VE2 = await L.dispositivo('vecchio-popup-bloccato', { ctx: ctxE, host: '127.0.0.1' });
  await VE2.evaluate(() => { const s = LM.load(); s.onboarded = true; LM.save(); LM.aggiungiAzione('da portare col file', null); });
  await L.riapri(VE2); await VE2.waitForTimeout(5500);
  await VE2.click('#lm-trasloco button.lm-tr-primo').catch(() => {});
  await VE2.waitForTimeout(800);
  const e1 = await VE2.evaluate(() => (document.getElementById('lm-trasloco') || {}).innerText || '');
  L.esito('E1 finestra bloccata (app sulla schermata Home): propone il file', /file/i.test(e1), e1.slice(0, 160));

  /* F: con l'account sul vecchio, senza rete */
  const ctxF = await L.contesto({ tipo: 'iphone', init });
  const VF = await L.dispositivo('vecchio-con-account', { ctx: ctxF, host: '127.0.0.1' });
  await L.accedi(VF, 'fabio', 'fabio@prova.it');
  await VF.evaluate(() => { try { sessionStorage.removeItem('lm-trasloco-dopo'); } catch (e) {} });
  await L.riapri(VF); await VF.waitForTimeout(6000);
  await VF.ctx.setOffline(true);
  await VF.evaluate(() => LM.aggiungiAzione('ultima cosa sul vecchio, senza rete', null));
  await VF.click('#lm-trasloco button.lm-tr-primo').catch(() => {});
  await VF.waitForTimeout(1500);
  const f1 = { url: VF.url(), testo: await VF.evaluate(() => (document.getElementById('lm-trasloco') || {}).innerText || '').catch(() => '') };
  L.esito('F1 con l’account e senza rete: NON si va al nuovo indirizzo finché il cloud non ha tutto', /127\.0\.0\.1/.test(f1.url), f1);
  await VF.ctx.setOffline(false);

  L.salvaRisultati('n07-trasloco'); await L.browser().close(); srv.close(); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
