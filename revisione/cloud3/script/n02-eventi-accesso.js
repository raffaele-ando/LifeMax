/* N02 — TUTTO QUELLO CHE PUÒ SUCCEDERE ALL'ACCESSO.
   A popup bloccato → redirect           B popup chiuso subito (<2,5 s)
   C dominio non autorizzato             D niente rete al momento di accedere
   E account disabilitato a metà uso, con una modifica non ancora nel cloud
   F account CANCELLATO sul server       G biscotti cancellati (sessione Google scaduta)
   H localStorage cancellato (resta IndexedDB)    I tutto cancellato (Safari ITP 7 giorni)
   K due schede: modifica non ancora partita nella scheda A, «Esci» nella scheda B
   L due schede: nella scheda B entra un altro account
   node n02-eventi-accesso.js */
const L = require('./lib');
const nuovo = async (nome, o) => L.dispositivo(nome, o);
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();
  const dettagli = {};

  /* A/B/C/D: gli errori del popup */
  for (const [k, cod, attesa] of [['A popup bloccato', 'auth/popup-blocked', 0], ['B popup chiuso subito dall’utente', 'auth/popup-closed-by-user', 0], ['B2 popup chiuso dopo 3 s', 'auth/popup-closed-by-user', 3000],
    ['C dominio non autorizzato', 'auth/unauthorized-domain', 0], ['D niente rete', 'auth/network-request-failed', 0], ['D2 errore sconosciuto', 'auth/internal-error', 0]]) {
    const p = await nuovo('accesso-' + k, { tipo: 'iphone' });
    await p.waitForFunction(() => window.LMCloud && window.LMCloud.available, null, { timeout: 20000 });
    await p.evaluate(([c, ms]) => { window.__chi = { sub: 'redir', email: 'r@prova.it' }; window.__popupFail = c; window.__redirectFail = 'auth/redirect-cancelled-by-user';
      if (ms) { const vero = window.__R_AUTH; void vero; } window.__avvisi = []; document.addEventListener('lm:accesso-fallito', (e) => window.__avvisi.push(e.detail && e.detail.titolo)); }, [cod, attesa]);
    if (attesa) await p.evaluate((ms) => { window.__popupDelay = ms; }, attesa);
    await p.evaluate(() => window.LMCloud.signIn());
    await p.waitForTimeout(800 + attesa);
    const r = await p.evaluate(() => ({ redirect: window.__redirectTried || 0, avvisi: window.__avvisi, dialogo: (document.querySelector('.avviso h2') || {}).textContent || '' }));
    dettagli[k] = r;
    L.esito('N02' + k + ': redirect ' + r.redirect + ', avviso «' + (r.dialogo || r.avvisi.join('/')) + '»', true, r);
    if (k === 'A popup bloccato') await L.foto(p, 'n02-a-popup-bloccato-redirect-fallito');
    await p.close();
  }
  L.esito('N02B l’utente che chiude il popup appena aperto NON viene mandato a Google col redirect', dettagli['B popup chiuso subito dall’utente'].redirect === 0, dettagli['B popup chiuso subito dall’utente']);

  /* E: disabilitato a metà uso, con una modifica che il cloud non ha */
  const E = await nuovo('telefono-E', { tipo: 'iphone' });
  await L.accedi(E, 'elena', 'elena@prova.it'); const uE = await L.uidDi(E);
  await E.evaluate(() => LM.aggiungiAzione('E1 già nel cloud', null)); await L.calma(E, 1500);
  await E.ctx.setOffline(true);
  await E.evaluate(() => LM.aggiungiAzione('E2 fatta in metro, non ancora nel cloud', null)); await E.waitForTimeout(500);
  await L.utenteAuth(uE, { disableUser: true });
  await E.ctx.setOffline(false);
  await E.evaluate(() => window.__auth.currentUser.getIdToken(true).catch(() => 0)); await E.waitForTimeout(3000);
  const e1 = await E.evaluate((u) => ({ dentro: !!(window.LM_AUTH && window.LM_AUTH.user), schermo: LM.load().azioni.map((a) => a.testo), daParte: !!localStorage.getItem('lifemax.daparte.' + u), dialogo: (document.querySelector('.avviso h2') || {}).textContent || '' }), uE);
  await L.foto(E, 'n02-e-sessione-finita');
  L.esito('N02E1 account disabilitato: avviso «La sessione è finita», schermo vuoto, la modifica non salita messa da parte', !e1.dentro && e1.schermo.length === 0 && e1.daParte && /sessione/i.test(e1.dialogo), e1);
  await L.utenteAuth(uE, { disableUser: false });
  await L.accedi(E, 'elena', 'elena@prova.it'); await L.calma(E, 2500);
  const cE = await L.docCloud(uE);
  L.esito('N02E2 riattivato e rientrato: la modifica fatta in metro arriva nel cloud', !!cE && cE.stato.azioni.some((a) => /^E2/.test(a.testo)), cE && cE.stato.azioni.map((a) => a.testo));

  /* F: account cancellato sul server (es. l'utente lo cancella da un altro dispositivo o l'admin) */
  const F = await nuovo('pc-F', { tipo: 'pc' });
  await L.accedi(F, 'franco', 'franco@prova.it'); const uF = await L.uidDi(F);
  await F.evaluate(() => LM.aggiungiAzione('F1', null)); await L.calma(F, 1500);
  await L.cancellaUtenteAuth(uF);
  await F.evaluate(() => window.__auth.currentUser.getIdToken(true).catch(() => 0)); await F.waitForTimeout(2500);
  const f1 = await F.evaluate(() => ({ dentro: !!(window.LM_AUTH && window.LM_AUTH.user), dialogo: (document.querySelector('.avviso h2') || {}).textContent || '' }));
  L.esito('N02F account cancellato sul server: l’app lo dice (sessione finita)', !f1.dentro && /sessione/i.test(f1.dialogo), f1);
  await L.accedi(F, 'franco', 'franco@prova.it'); const uF2 = await L.uidDi(F);
  const cF2 = await L.docCloud(uF2);
  L.esito('N02F2 rientrando con lo stesso Google dopo la cancellazione: nuovo uid, i dati del vecchio uid restano orfani in Firestore', uF2 === uF, { uidPrima: uF, uidDopo: uF2, datiNuovo: cF2 && cF2.stato && cF2.stato.azioni.length, datiVecchioRestano: !!(await L.docCloud(uF)) });

  /* G: biscotti cancellati */
  const G = await nuovo('pc-G', { tipo: 'pc' });
  await L.accedi(G, 'gino', 'gino@prova.it');
  await G.evaluate(() => LM.aggiungiAzione('G1', null)); await L.calma(G, 1200);
  await G.ctx.clearCookies(); await L.riapri(G); await G.waitForTimeout(2500);
  const g1 = await G.evaluate(() => ({ dentro: !!(window.LM_AUTH && window.LM_AUTH.user), azioni: LM.load().azioni.map((a) => a.testo), chiaveAuth: Object.keys(localStorage).filter((k) => /firebase:authUser/.test(k)).length }));
  L.esito('N02G biscotti cancellati (o sessione Google scaduta): LifeMax resta dentro e i dati ci sono', g1.dentro && g1.azioni.includes('G1'), g1);

  /* H: localStorage cancellato, il resto no */
  const H = await nuovo('pc-H', { tipo: 'pc' });
  await L.accedi(H, 'hugo', 'hugo@prova.it'); const uH = await L.uidDi(H);
  await H.evaluate(() => { LM.aggiungiAzione('H1', null); const s = LM.load(); s.profilo.nome = 'Hugo'; LM.save(); }); await L.calma(H, 1500);
  await H.ctx.setOffline(true);
  await H.evaluate(() => LM.aggiungiAzione('H2 non ancora nel cloud', null)); await H.waitForTimeout(400);
  await H.evaluate(() => localStorage.clear());
  await H.ctx.setOffline(false);
  await L.riapri(H); await H.waitForTimeout(3000);
  const h1 = await H.evaluate(() => ({ dentro: !!(window.LM_AUTH && window.LM_AUTH.user), azioni: LM.load().azioni.map((a) => a.testo), dialogo: (document.querySelector('.avviso h2') || {}).textContent || '' }));
  L.esito('N02H1 localStorage cancellato: com’è l’app riaprendo (dentro? dati?)', true, h1);
  if (!h1.dentro) await L.accedi(H, 'hugo', 'hugo@prova.it');
  await L.calma(H, 2000);
  const h2 = await H.evaluate(() => ({ azioni: LM.load().azioni.map((a) => a.testo), nome: LM.load().profilo.nome }));
  L.esito('N02H2 rientrato: H1 e il nome tornano dal cloud', h2.azioni.includes('H1') && h2.nome === 'Hugo', h2);
  L.esito('N02H3 la modifica fatta offline prima della cancellazione: persa (atteso, ma l’app lo può dire?)', h2.azioni.some((t) => /^H2/.test(t)), h2.azioni);
  void uH;

  /* I: ITP di Safari — dopo 7 giorni senza aprire, TUTTO cancellato */
  const Iph = await nuovo('iphone-I', { tipo: 'iphone' });
  await L.accedi(Iph, 'irene', 'irene@prova.it'); const uI = await L.uidDi(Iph);
  await Iph.evaluate(() => { LM.aggiungiAzione('I1', null); const s = LM.load(); s.profilo.nome = 'Irene'; s.profilo.visione = 'calma'; LM.save(); }); await L.calma(Iph, 1500);
  const pc = await nuovo('pc-I', { tipo: 'pc' }); await L.accedi(pc, 'irene', 'irene@prova.it');
  await Iph.close();
  await pc.evaluate(() => LM.aggiungiAzione('I2 dal pc mentre l’iPhone è chiuso', null)); await L.calma(pc, 1500);
  const ctxNuovo = await L.contesto({ tipo: 'iphone' });
  const I2 = await L.dispositivo('iphone-I-dopo-ITP', { ctx: ctxNuovo });
  await I2.waitForTimeout(1500);
  const i0 = await I2.evaluate(() => ({ dentro: !!(window.LM_AUTH && window.LM_AUTH.user), azioni: LM.load().azioni.length, onboarding: !LM.load().onboarded }));
  await L.foto(I2, 'n02-i-iphone-dopo-itp-prima-di-accedere');
  await L.accedi(I2, 'irene', 'irene@prova.it'); await L.calmaTutti([I2, pc], 2000);
  const i1 = await I2.evaluate(() => ({ azioni: LM.load().azioni.map((a) => a.testo).sort(), nome: LM.load().profilo.nome, visione: LM.load().profilo.visione }));
  const cI = await L.docCloud(uI);
  L.esito('N02I iPhone svuotato da Safari: riaccede e ritrova tutto, il profilo NON si azzera', i1.azioni.length === 2 && i1.nome === 'Irene' && cI.stato.profilo.nome === 'Irene' && cI.stato.profilo.visione === 'calma', { primaDiAccedere: i0, dopo: i1 });

  /* K: due schede; la A ha una modifica non ancora nel cloud; «Esci» nella B */
  const ctxK = await L.contesto({ tipo: 'pc' });
  const KA = await L.dispositivo('scheda-A', { ctx: ctxK }); await L.accedi(KA, 'katia', 'katia@prova.it'); const uK = await L.uidDi(KA);
  const KB = await L.dispositivo('scheda-B', { ctx: ctxK }); await KB.waitForTimeout(2500); await L.calma(KB, 1000);
  await KA.route(new RegExp('127\\.0\\.0\\.1:' + L.FSP), (r) => r.abort());
  await KA.evaluate(() => LM.aggiungiAzione('K1 scritta nella scheda A (rete lenta)', null)); await KA.waitForTimeout(1500);
  const sospB = await KB.evaluate(() => ({ sospeso: localStorage.getItem('lm-sospeso'), inSospeso: window.LMCloud.inSospeso && window.LMCloud.inSospeso() }));
  const esitoB = await KB.evaluate(() => window.LMCloud.signOut()); await KB.waitForTimeout(2000);
  await KA.unroute(new RegExp('127\\.0\\.0\\.1:' + L.FSP)); await KA.waitForTimeout(3000);
  const cK = await L.docCloud(uK);
  const daParteK = await KB.evaluate((u) => !!localStorage.getItem('lifemax.daparte.' + u), uK);
  L.esito('N02K «Esci» nella scheda B mentre la scheda A ha una modifica non ancora partita: la modifica NON si perde', !!(cK && cK.stato.azioni.some((a) => /^K1/.test(a.testo))) || daParteK,
    { esitoEsciInB: esitoB, vistaDaB: sospB, nelCloud: cK && cK.stato.azioni.map((a) => a.testo), messaDaParte: daParteK });

  /* L: due schede, nella B entra un altro account */
  const ctxL = await L.contesto({ tipo: 'pc' });
  const LA = await L.dispositivo('scheda-A', { ctx: ctxL }); await L.accedi(LA, 'lara', 'lara@prova.it'); const uLa = await L.uidDi(LA);
  await LA.evaluate(() => LM.aggiungiAzione('di Lara', null)); await L.calma(LA, 1200);
  const LB = await L.dispositivo('scheda-B', { ctx: ctxL }); await LB.waitForTimeout(2500);
  await LB.evaluate(() => window.LMCloud.signOut()); await LB.waitForTimeout(1500);
  await L.accedi(LB, 'leo', 'leo@prova.it'); const uLeo = await L.uidDi(LB);
  await LA.waitForTimeout(3000);
  const la = await LA.evaluate(() => ({ chi: window.LM_AUTH && window.LM_AUTH.user && window.LM_AUTH.user.email, azioni: LM.load().azioni.map((a) => a.testo) }));
  await LA.evaluate(() => LM.aggiungiAzione('scritta nella scheda A dopo il cambio', null)); await L.calmaTutti([LA, LB], 2000);
  const cLeo = await L.docCloud(uLeo), cLa = await L.docCloud(uLa);
  L.esito('N02L la scheda A segue il cambio d’account senza mescolare: Leo non ha cose di Lara', !cLeo.stato.azioni.some((a) => a.testo === 'di Lara') && cLa.stato.azioni.some((a) => a.testo === 'di Lara'), { schedaA: la, cloudLeo: cLeo.stato.azioni.map((a) => a.testo) });

  L.salvaRisultati('n02-eventi-accesso', { dettagli }); await L.browser().close(); srv.close(); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
