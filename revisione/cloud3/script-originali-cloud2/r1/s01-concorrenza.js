/* Concorrenza fra dispositivi online e offline: eco «presa in prestito», scritture cieche, modifiche, cancellazioni */
const L = require('../lib');
const tx = async (p, f='azioni') => (await L.testi(p, f)).sort().join(',');
(async () => {
  const srv = await L.servi(); await L.avvia();
  // ---- S1.1 due scritture quasi simultanee online
  await L.pulisciTutto();
  let A = await L.dispositivo('telefono', { tipo: 'iphone' }), B = await L.dispositivo('pc', { tipo: 'pc' }), C = await L.dispositivo('ipad', { tipo: 'ipad' });
  for (const p of [A, B, C]) await L.accedi(p, 'mario', 'mario@prova.it');
  const uid = await L.uidDi(A);
  await Promise.all([A.evaluate(() => LM.aggiungiAzione('X da telefono', null)), B.evaluate(() => LM.aggiungiAzione('Y da pc', null))]);
  await L.calmaTutti([A, B, C], 4000);
  let d = await L.docCloud(uid);
  L.esito('S1.1 scritture simultanee (telefono+pc online): tutti vedono X e Y', [A,B,C].length && (await tx(A)) === 'X da telefono,Y da pc' && (await tx(B)) === 'X da telefono,Y da pc' && (await tx(C)) === 'X da telefono,Y da pc',
    { telefono: await tx(A), pc: await tx(B), ipad: await tx(C), cloud: d.stato.azioni.map(x => x.testo).sort().join(',') });
  // ---- S1.2 eco presa in prestito: A offline aggiunge, B aggiunge dopo (orologio più avanti), A torna
  await L.pulisciTutto(); for (const p of [A,B,C]) await p.ctx.close();
  A = await L.dispositivo('telefono', { tipo: 'iphone' }); B = await L.dispositivo('pc', { tipo: 'pc' }); C = await L.dispositivo('ipad', { tipo: 'ipad' });
  for (const p of [A, B, C]) await L.accedi(p, 'mario', 'mario@prova.it');
  const uid2 = await L.uidDi(A);
  await A.ctx.setOffline(true);
  await A.evaluate(() => LM.aggiungiAzione('X offline telefono', null));
  await A.waitForTimeout(500);
  await B.evaluate(() => LM.aggiungiAzione('Y pc', null));
  await L.calmaTutti([B, C], 1500);
  // A riceve prima il documento di B (rete tornata: l'ascolto riparte) — la sua scrittura in coda parte insieme
  await A.ctx.setOffline(false);
  await L.calmaTutti([A, B, C], 6000);
  d = await L.docCloud(uid2);
  L.esito('S1.2 telefono offline aggiunge X, pc aggiunge Y, telefono torna online: tutti vedono X e Y', (await tx(B)).includes('X offline') && (await tx(C)).includes('X offline') && (await tx(A)).includes('Y pc'),
    { telefono: await tx(A), pc: await tx(B), ipad: await tx(C), cloud: d.stato.azioni.map(x => x.testo).sort().join(',') });
  // ---- S1.3 il caso dell'eco: A riceve il doc di B PRIMA di scrivere, unisce, e rimanda con l'updatedAt di B
  await L.pulisciTutto(); for (const p of [A,B,C]) await p.ctx.close();
  A = await L.dispositivo('telefono', { tipo: 'iphone' }); B = await L.dispositivo('pc', { tipo: 'pc' }); C = await L.dispositivo('ipad', { tipo: 'ipad' });
  for (const p of [A, B, C]) await L.accedi(p, 'mario', 'mario@prova.it');
  const uid3 = await L.uidDi(A);
  // telefono scrive X solo in locale (cloud chiuso per lui: simula scrittura fallita/app chiusa), poi pc scrive Y, poi il telefono riceve Y
  await A.ctx.setOffline(true);
  await A.evaluate(() => LM.aggiungiAzione('X solo telefono', null));
  await A.waitForTimeout(300);
  // la scrittura in coda del telefono si perde (la pagina viene ricaricata, come una app chiusa e riaperta) ma l'ascolto ora è vivo
  await B.waitForTimeout(500);
  await B.evaluate(() => LM.aggiungiAzione('Y pc (piu recente)', null));
  await L.calma(B, 1500);
  await A.ctx.setOffline(false);
  await L.calmaTutti([A, B, C], 6000);
  const setA = await A.evaluate(() => (window.__setDocs||[]).filter(x=>x.path.split('/').length==2).map(x=>x.at));
  const setB = await B.evaluate(() => (window.__setDocs||[]).filter(x=>x.path.split('/').length==2).map(x=>x.at));
  d = await L.docCloud(uid3);
  L.esito('S1.3 dopo il ritorno: il pc (che ha scritto per ultimo) vede la X del telefono', (await tx(B)).includes('X solo'),
    { telefono: await tx(A), pc: await tx(B), ipad: await tx(C), cloud: d.stato.azioni.map(x => x.testo).sort().join(','), scrittureTelefono: setA, scrittureP: setB });
  // il pc ora aggiunge Z: il cloud perde X?
  await B.evaluate(() => LM.aggiungiAzione('Z pc', null));
  await L.calmaTutti([A, B, C], 3000);
  d = await L.docCloud(uid3);
  L.esito('S1.3b il pc scrive ancora: X resta nel cloud e arriva al pc', d.stato.azioni.some(x => x.testo === 'X solo telefono') && (await tx(B)).includes('X solo'),
    { telefono: await tx(A), pc: await tx(B), ipad: await tx(C), cloud: d.stato.azioni.map(x => x.testo).sort().join(',') });
  // il telefono si chiude per sempre (cambio telefono): X sopravvive?
  await A.ctx.close();
  await B.evaluate(() => LM.aggiungiAzione('W pc', null)); await L.calmaTutti([B, C], 3000);
  d = await L.docCloud(uid3);
  L.esito('S1.3c il telefono non torna più (telefono cambiato): X è ancora nel cloud', d.stato.azioni.some(x => x.testo === 'X solo telefono'), { cloud: d.stato.azioni.map(x => x.testo).sort().join(','), pc: await tx(B), ipad: await tx(C) });
  const ripC = await L.dispositivo('ipad-ricaricato', { ctx: C.ctx }); await L.calma(ripC, 4000);
  L.esito('S1.3d ricaricando l’iPad, X ricompare?', (await tx(ripC)).includes('X solo'), await tx(ripC));
  console.log('log pc:\n' + (await L.registroCloud(B, 40)).join('\n'));
  L.salvaRisultati('r1-s01'); await L.browser().close(); srv.close();
})();
