/* Conflitti offline e orologi sbagliati, 3 dispositivi */
const L = require('../lib');
const az = (p) => p.evaluate(() => LM.load().azioni.map(a => a.testo + (a.done ? '[x]' : '')).sort().join(' | '));
async function tre(o) {
  await L.pulisciTutto();
  const A = await L.dispositivo('telefono', Object.assign({ tipo: 'iphone' }, o && o.A)), B = await L.dispositivo('pc', Object.assign({ tipo: 'pc' }, o && o.B)), C = await L.dispositivo('ipad', Object.assign({ tipo: 'ipad' }, o && o.C));
  for (const p of [A, B, C]) await L.accedi(p, 'mario', 'mario@prova.it');
  return [A, B, C, await L.uidDi(A)];
}
const chiudi = async (arr) => { for (const p of arr) await p.ctx.close(); };
const tutto = async (arr, uid) => { const r = {}; for (const p of arr) r[p.__nome] = await az(p); r.cloud = (await L.docCloud(uid)).stato.azioni.map(a => a.testo + (a.done ? '[x]' : '')).sort().join(' | '); return r; };
const uguali = (r) => new Set(Object.values(r)).size === 1;
(async () => {
  const srv = await L.servi(); await L.avvia();
  let [A, B, C, uid] = await tre();
  // S3.1 modifica vs modifica della stessa riga, offline su due dispositivi, telefono torna prima
  await A.evaluate(() => LM.aggiungiAzione('Telefonare al medico', null)); await L.calmaTutti([A, B, C], 2000);
  await A.ctx.setOffline(true); await B.ctx.setOffline(true);
  await A.evaluate(() => LM.modificaAzione(LM.load().azioni[0].id, 'Telefonare al medico (lunedì)'));
  await A.waitForTimeout(1000);
  await B.evaluate(() => LM.modificaAzione(LM.load().azioni[0].id, 'Telefonare al medico ORE 9'));
  await A.ctx.setOffline(false); await L.calmaTutti([A, C], 3000); await B.ctx.setOffline(false); await L.calmaTutti([A, B, C], 5000);
  let r = await tutto([A, B, C], uid);
  L.esito('S3.1 modifica vs modifica offline (pc modifica per ultimo, torna per ultimo): tutti uguali e vince l’ultima modifica (ORE 9)', uguali(r) && r.cloud.includes('ORE 9'), r);
  // S3.2 stessa cosa ma torna prima il pc
  await A.ctx.setOffline(true); await B.ctx.setOffline(true);
  await A.evaluate(() => LM.modificaAzione(LM.load().azioni[0].id, 'v-telefono'));
  await A.waitForTimeout(1000);
  await B.evaluate(() => LM.modificaAzione(LM.load().azioni[0].id, 'v-pc-ultima'));
  await B.ctx.setOffline(false); await L.calmaTutti([B, C], 3000); await A.ctx.setOffline(false); await L.calmaTutti([A, B, C], 5000);
  r = await tutto([A, B, C], uid);
  L.esito('S3.2 modifica vs modifica offline (pc modifica per ultimo, torna per PRIMO): tutti uguali e vince v-pc-ultima', uguali(r) && r.cloud.includes('v-pc-ultima'), r);
  // S3.3 cancella (telefono, offline) vs modifica (pc, offline, dopo)
  await A.ctx.setOffline(true); await B.ctx.setOffline(true);
  await A.evaluate(() => LM.rimuoviAzione(LM.load().azioni[0].id));
  await A.waitForTimeout(1000);
  await B.evaluate(() => LM.modificaAzione(LM.load().azioni[0].id, 'modificata dopo la cancellazione'));
  await A.ctx.setOffline(false); await L.calmaTutti([A, C], 3000); await B.ctx.setOffline(false); await L.calmaTutti([A, B, C], 5000);
  r = await tutto([A, B, C], uid);
  L.esito('S3.3 cancella (telefono) vs modifica successiva (pc), offline: tutti uguali (qualunque esito, ma uguale)', uguali(r), r);
  await chiudi([A, B, C]);
  // S3.4 cancellazione offline su telefono, pc aggiunge altro online, telefono torna: la cancellazione arriva a tutti?
  [A, B, C, uid] = await tre();
  await A.evaluate(() => { LM.aggiungiAzione('da cancellare', null); LM.aggiungiAzione('da tenere', null); }); await L.calmaTutti([A, B, C], 2000);
  await A.ctx.setOffline(true);
  await A.evaluate(() => LM.rimuoviAzione(LM.load().azioni.find(a => a.testo === 'da cancellare').id));
  await B.evaluate(() => LM.aggiungiAzione('nuova dal pc', null)); await L.calmaTutti([B, C], 2000);
  await A.ctx.setOffline(false); await L.calmaTutti([A, B, C], 6000);
  r = await tutto([A, B, C], uid);
  L.esito('S3.4 cancellazione offline + aggiunta online altrove: nessuno ha più «da cancellare», tutti hanno «nuova dal pc»', Object.values(r).every(v => !v.includes('da cancellare') && v.includes('nuova dal pc')), r);
  // il pc scrive ancora: la cosa cancellata torna?
  await B.evaluate(() => LM.cattura('x')); await L.calmaTutti([A, B, C], 3000);
  r = await tutto([A, B, C], uid);
  L.esito('S3.4b dopo un’altra scrittura del pc la cosa cancellata non risorge', Object.values(r).every(v => !v.includes('da cancellare')), r);
  await chiudi([A, B, C]);
  // S3.5 creare la stessa cosa (stesso testo) su due dispositivi offline
  [A, B, C, uid] = await tre();
  await A.ctx.setOffline(true); await B.ctx.setOffline(true);
  await A.evaluate(() => LM.aggiungiAzione('Palestra', null)); await B.evaluate(() => LM.aggiungiAzione('Palestra', null));
  await A.ctx.setOffline(false); await B.ctx.setOffline(false); await L.calmaTutti([A, B, C], 6000);
  r = await tutto([A, B, C], uid);
  L.esito('S3.5 stessa cosa creata su due dispositivi offline: tutti uguali (2 righe «Palestra», non deduplicate: atteso)', uguali(r), r);
  // S3.6 tre dispositivi offline aggiungono cose diverse, tornano in ordine C, A, B
  await A.ctx.setOffline(true); await B.ctx.setOffline(true); await C.ctx.setOffline(true);
  await A.evaluate(() => LM.aggiungiAzione('T1', null)); await B.evaluate(() => LM.aggiungiAzione('P1', null)); await C.evaluate(() => LM.aggiungiAzione('I1', null));
  await A.evaluate(() => LM.aggiungiAzione('T2', null)); await B.evaluate(() => LM.aggiungiAzione('P2', null));
  await C.ctx.setOffline(false); await C.waitForTimeout(1500); await A.ctx.setOffline(false); await A.waitForTimeout(300); await B.ctx.setOffline(false);
  await L.calmaTutti([A, B, C], 8000);
  r = await tutto([A, B, C], uid);
  L.esito('S3.6 tre dispositivi offline, ritorno a raffica C→A→B: tutti hanno T1,T2,P1,P2,I1', Object.values(r).every(v => ['T1', 'T2', 'P1', 'P2', 'I1'].every(x => v.includes(x))), r);
  await chiudi([A, B, C]);
  // S3.7 orologio del pc indietro di 2 minuti: il telefono crea, il pc cancella subito
  [A, B, C, uid] = await tre({ B: { skew: -120000 } });
  await A.evaluate(() => LM.aggiungiAzione('creata sul telefono', null)); await L.calmaTutti([A, B, C], 2000);
  await B.evaluate(() => LM.rimuoviAzione(LM.load().azioni.find(a => a.testo === 'creata sul telefono').id)); await L.calmaTutti([A, B, C], 3000);
  r = await tutto([A, B, C], uid);
  L.esito('S3.7 pc con orologio 2 min indietro cancella una cosa creata sul telefono: sparisce dappertutto', Object.values(r).every(v => !v.includes('creata sul telefono')), r);
  await A.evaluate(() => LM.cattura('scrive il telefono')); await L.calmaTutti([A, B, C], 3000);
  r = await tutto([A, B, C], uid);
  L.esito('S3.7b ...e non risorge dopo una scrittura del telefono', Object.values(r).every(v => !v.includes('creata sul telefono')), r);
  // S3.8 orologio avanti 3h sul pc: modifica il profilo; poi il telefono (orologio giusto) cambia il tema
  await chiudi([A, B, C]);
  [A, B, C, uid] = await tre({ B: { skew: 3 * 3600000 } });
  await B.evaluate(() => { const s = LM.load(); s.profilo.modo = 'scuro'; LM.save(); }); await L.calmaTutti([A, B, C], 2000);
  await A.evaluate(() => { const s = LM.load(); s.profilo.modo = 'chiaro'; LM.save(); }); await L.calmaTutti([A, B, C], 2000);
  await C.ctx.setOffline(true); await C.evaluate(() => LM.cattura('ipad')); await C.ctx.setOffline(false);
  await B.evaluate(() => LM.cattura('pc scrive')); await L.calmaTutti([A, B, C], 3000);
  const modi = []; for (const p of [A, B, C]) modi.push(await p.evaluate(() => LM.load().profilo.modo));
  L.esito('S3.8 pc con orologio 3h avanti: il telefono cambia tema DOPO, ma alla prima scrittura del pc vince il pc? (atteso: chiaro ovunque)', modi.every(m => m === 'chiaro'), modi);
  await chiudi([A, B, C]);
  // S3.9 XP guadagnati in parallelo su due dispositivi offline
  [A, B, C, uid] = await tre();
  await A.ctx.setOffline(true); await B.ctx.setOffline(true);
  await A.evaluate(() => { const a = LM.aggiungiAzione('t', null); LM.completaAzione(a.id); });
  await B.evaluate(() => { const a = LM.aggiungiAzione('p', null); LM.completaAzione(a.id); const b = LM.aggiungiAzione('p2', null); LM.completaAzione(b.id); });
  const xpA = await A.evaluate(() => LM.load().xp), xpB = await B.evaluate(() => LM.load().xp);
  await A.ctx.setOffline(false); await B.ctx.setOffline(false); await L.calmaTutti([A, B, C], 6000);
  const xs = []; for (const p of [A, B, C]) xs.push(await p.evaluate(() => [LM.load().xp, LM.load().azioni.filter(a => a.done).length]));
  L.esito('S3.9 XP guadagnati offline su due dispositivi si sommano (telefono ' + xpA + ' + pc ' + xpB + ')', xs.every(x => x[0] === xpA + xpB), xs);
  L.salvaRisultati('r1-s03'); await L.browser().close(); srv.close();
})();
