/* N05 — LE FUNZIONI «GROSSE» SU PIÙ DISPOSITIVI (oltre a quelle di r1/s02):
   A. «Azzera tutto» (con account) mentre un iPad offline ha creato una cosa PRIMA dell'azzeramento
   B. ripristino di un backup locale: arriva agli altri (anche quello che era stato cancellato dopo)?
   C. «Riprendi il profilo» da una copia nel cloud
   D. annullare dal Diario (check-in, review della sera) su un altro dispositivo
   E. ospite con i dati di ESEMPIO che entra in un account che ha già dati
   F. utente nuovissimo: benvenuto, primo accesso, secondo dispositivo
   G. «Riprendi tutto» / «Sostituisci» da una copia nel cloud
   node n05-funzioni.js */
const L = require('./lib');
const azz = (p) => p.evaluate(() => LM.load().azioni.map((a) => a.testo).sort());
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();
  const T = await L.dispositivo('telefono', { tipo: 'iphone' }), P = await L.dispositivo('pc', { tipo: 'pc' }), I = await L.dispositivo('ipad', { tipo: 'ipad' });
  for (const p of [T, P, I]) await L.accedi(p, 'zoe', 'zoe@prova.it');
  const uid = await L.uidDi(T);
  await T.evaluate(() => { for (let i = 0; i < 4; i++) LM.aggiungiAzione('cosa ' + i, null); const s = LM.load(); s.profilo.nome = 'Zoe'; s.profilo.visione = 'leggera'; LM.save(); LM.registraCheckin(4, 4, 4, 'casa'); LM.salvaReviewSera({ vittoria: 'v', blocco: 'b', shutdown: true }); });
  await L.calmaTutti([T, P, I], 2500);

  /* A */
  await I.ctx.setOffline(true);
  await I.evaluate(() => LM.aggiungiAzione('scritta sull’iPad offline PRIMA dell’azzeramento', null));
  await I.waitForTimeout(1500);
  await T.evaluate(() => LM.reset(true)); await L.calmaTutti([T, P], 3000);
  await I.ctx.setOffline(false); await L.calmaTutti([T, P, I], 5000);
  const a = { telefono: await azz(T), pc: await azz(P), ipad: await azz(I) };
  L.esito('A1 «Azzera tutto»: le cose di prima spariscono ovunque', !a.pc.some((t) => /^cosa /.test(t)) && !a.ipad.some((t) => /^cosa /.test(t)), a);
  L.esito('A2 «Azzera tutto»: una cosa creata offline PRIMA dell’azzeramento torna (l’azzeramento non la conosceva)', !a.pc.some((t) => /PRIMA dell’azzeramento/.test(t)), a);

  /* B: ripristino backup locale sul pc (quello «prima della cancellazione») */
  const bk = await T.evaluate(() => LM.listBackups().find((b) => b.motivo === 'prima-azzeramento'));
  if (bk) await T.evaluate((ts) => LM.restoreBackup(ts), bk.ts);
  await L.calmaTutti([T, P, I], 4000);
  const b = { telefono: await azz(T), pc: await azz(P), ipad: await azz(I), nomePc: await P.evaluate(() => LM.load().profilo.nome) };
  L.esito('B1 ripristino del backup di prima dell’azzeramento: torna tutto, su tutti', ['cosa 0', 'cosa 1', 'cosa 2', 'cosa 3'].every((t) => b.pc.includes(t) && b.ipad.includes(t)) && b.nomePc === 'Zoe', b);

  /* C: «Riprendi il profilo» da una copia nel cloud */
  await P.evaluate(() => { const s = LM.load(); s.profilo.nome = 'Nome rovinato'; s.profilo.visione = ''; LM.save(); }); await L.calmaTutti([T, P, I], 2500);
  const copie = await I.evaluate(() => window.LMCloud.backups());
  const buona = copie.find((c) => c.nome === 'Zoe');
  const ok = buona ? await I.evaluate((id) => window.LMCloud.riprendiProfilo(id), buona.id) : false;
  await L.calmaTutti([T, P, I], 3000);
  const c = { copie: copie.map((x) => x.motivo + ':' + x.nome), riuscito: ok, nomeT: await T.evaluate(() => LM.load().profilo.nome), visioneP: await P.evaluate(() => LM.load().profilo.visione) };
  L.esito('C1 «Riprendi il profilo» da una copia nel cloud: torna su tutti', c.nomeT === 'Zoe' && c.visioneP === 'leggera', c);

  /* D: annullare dal Diario sul pc un check-in fatto sul telefono */
  await T.evaluate(() => LM.registraCheckin(1, 1, 1, 'ufficio')); await L.calmaTutti([T, P, I], 2500);
  const ts = await P.evaluate(() => { const c = LM.load().checkins.find((x) => x.contesto === 'ufficio'); return c && String(c.ts); });
  const fatto = await P.evaluate((t) => LM.annullaRecord('checkin', t), ts); await L.calmaTutti([T, P, I], 3000);
  const d = { annullato: fatto, telefono: await T.evaluate(() => LM.load().checkins.filter((x) => x.contesto === 'ufficio').length), ipad: await I.evaluate(() => LM.load().checkins.filter((x) => x.contesto === 'ufficio').length) };
  L.esito('D1 check-in annullato dal Diario sul pc: sparisce anche dal telefono e dall’iPad', d.annullato && d.telefono === 0 && d.ipad === 0, d);

  /* E: ospite con i dati di esempio che entra nell'account */
  const E = await L.dispositivo('ipad-della-figlia', { tipo: 'ipad' });
  await E.evaluate(() => LM.seedDemo()); await E.waitForTimeout(500);
  const nEs = await E.evaluate(() => LM.load().azioni.length);
  await L.accedi(E, 'zoe', 'zoe@prova.it'); await L.calmaTutti([E, T], 3000);
  const cE = await L.docCloud(uid);
  const e = { esempioPrima: nEs, cloudAzioni: cE.stato.azioni.length, telefono: (await azz(T)).length, demoNelCloud: !!cE.stato.demo };
  L.esito('E1 esempio sull’iPad, poi accesso: l’esempio NON entra nell’account', e.cloudAzioni === e.telefono && e.cloudAzioni < 10 && !e.demoNelCloud, e);

  /* F: utente nuovissimo */
  const N1 = await L.dispositivo('telefono-nuovo-utente', { tipo: 'android' });
  const f0 = await N1.evaluate(() => ({ benvenuto: !LM.load().onboarded, azioni: LM.load().azioni.length }));
  await L.accedi(N1, 'nuovo', 'nuovo@prova.it'); const uN = await L.uidDi(N1);
  const N2 = await L.dispositivo('pc-nuovo-utente', { tipo: 'pc' });
  await L.accedi(N2, 'nuovo', 'nuovo@prova.it');
  const f1 = await N2.evaluate(() => ({ benvenuto: !LM.load().onboarded, overlay: !!document.querySelector('.benvenuto, #benvenuto, [data-benvenuto]') }));
  const cN = await L.docCloud(uN);
  L.esito('F1 utente nuovissimo: il primo accesso crea il cloud; il secondo dispositivo entra senza errori', !!cN && !N1.__err.length && !N2.__err.length, { primoAvvio: f0, secondoDispositivo: f1, cloudCreato: !!cN, errori: N1.__err.concat(N2.__err).slice(0, 3) });

  /* G: «Sostituisci» con una copia nel cloud */
  await T.evaluate(() => LM.aggiungiAzione('dopo la copia', null)); await L.calmaTutti([T, P, I], 2500);
  const copie2 = await P.evaluate(() => window.LMCloud.backups());
  const vecchia = copie2[copie2.length - 1];
  const s = vecchia ? await P.evaluate((id) => window.LMCloud.sostituisciConBackup(id), vecchia.id) : false;
  await L.calmaTutti([T, P, I], 3500);
  const g = { sostituito: s, copiaDel: vecchia && new Date(vecchia.salvato).toISOString(), telefono: await azz(T), ipad: await azz(I) };
  L.esito('G1 «Sostituisci» con una copia nel cloud: tutti i dispositivi tornano a quella copia', s && JSON.stringify(g.telefono) === JSON.stringify(g.ipad) && !g.telefono.includes('dopo la copia'), g);

  for (const p of [T, P, I, E]) L.esito('errori in pagina su ' + p.__nome, !p.__err.length, p.__err.slice(0, 3));
  L.salvaRisultati('n05-funzioni'); await L.browser().close(); srv.close(); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
