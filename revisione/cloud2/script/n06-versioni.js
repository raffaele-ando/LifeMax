/* N06 — VERSIONI E FORMATI: l'app VECCHIA (1a85823, un documento solo) e quella nuova.
   A. account usato solo con la versione vecchia → primo accesso con la nuova (passaggio ai pezzi)
   B. una scheda con la versione vecchia RIMASTA APERTA (PC sempre acceso, mai ricaricato) mentre
      gli altri usano la nuova: scritture alternate, cancellazioni, «Azzera tutto»
   C. la scheda vecchia viene avvisata? riceve le cose nuove?
   D. utente di mesi (365 giorni) che entra su un dispositivo nuovo: tempi e dimensioni
   node n06-versioni.js */
const L = require('./lib');
const path = require('path');
const genera = require('./r1/genera');
const PV = 9302;
const tx = async (p) => (await L.testi(p)).sort();
(async () => {
  const srv = await L.servi(); const srvV = await L.servi(PV, path.join(L.CONSEGNA, '..', 'wt-vecchio'));
  await L.avvia(); await L.pulisciTutto();

  /* A: solo versione vecchia, poi la nuova */
  const V = await L.dispositivo('pc-versione-vecchia', { tipo: 'pc', porta: PV });
  await L.accedi(V, 'vera', 'vera@prova.it'); const uid = await L.uidDi(V);
  await V.evaluate(() => { const s = LM.load(); s.onboarded = true; s.profilo.nome = 'Vera'; s.profilo.visione = 'una vita semplice'; LM.save(); LM.aggiungiAzione('V1 vecchia', null); const a = LM.aggiungiAzione('V2 fatta', null); LM.completaAzione(a.id); LM.registraCheckin(3, 3, 3, 'casa'); });
  await L.calma(V, 3000);
  const d0 = await L.docRaw('users/' + uid);
  L.esito('A0 la versione vecchia scrive il documento unico (campo data)', !!(d0 && typeof d0.data === 'string' && !d0.pezzi), d0 && Object.keys(d0));
  const N = await L.dispositivo('telefono-versione-nuova', { tipo: 'iphone' });
  await L.accedi(N, 'vera', 'vera@prova.it'); await L.calma(N, 3000);
  const d1 = await L.docCloud(uid);
  const copie = await L.elenco('users/' + uid + '/copie');
  const nN = await N.evaluate(() => ({ azioni: LM.load().azioni.map((a) => a.testo + (a.done ? '[x]' : '')).sort(), nome: LM.load().profilo.nome, visione: LM.load().profilo.visione, checkins: LM.load().checkins.length }));
  L.esito('A1 primo accesso con la nuova: dati e profilo arrivano interi', nN.azioni.join() === 'V1 vecchia,V2 fatta[x]' && nN.nome === 'Vera' && nN.visione === 'una vita semplice' && nN.checkins === 1, nN);
  L.esito('A2 il cloud passa ai pezzi, con una copia «prima di dividere»', !!(d1.principale.schema === 2 && d1.principale.pezzi && copie.some((c) => c.motivo === 'prima-di-dividere-il-documento')), { schema: d1.principale.schema, copie: copie.map((c) => c.motivo) });

  /* B: la scheda vecchia resta aperta e continua a scrivere */
  await V.evaluate(() => LM.aggiungiAzione('B1 dalla scheda vecchia', null)); await L.calma(V, 2500);
  await L.calmaTutti([N], 3000);
  await N.evaluate(() => LM.aggiungiAzione('B2 dalla nuova', null)); await L.calma(N, 2500);
  await V.evaluate(() => LM.aggiungiAzione('B3 dalla scheda vecchia', null)); await L.calma(V, 2500);
  await L.calmaTutti([N], 3500);
  const cB = (await L.docCloud(uid)).stato.azioni.map((a) => a.testo).sort();
  L.esito('B1 scritture alternate vecchia/nuova: il cloud (forma nuova) ha tutto', ['B1 dalla scheda vecchia', 'B2 dalla nuova', 'B3 dalla scheda vecchia'].every((t) => cB.includes(t)), cB);
  L.esito('B2 la nuova vede quello che scrive la vecchia', (await tx(N)).includes('B3 dalla scheda vecchia'), await tx(N));
  const tV = await tx(V);
  L.esito('C1 la scheda vecchia riceve le cose scritte dalla nuova', tV.includes('B2 dalla nuova'), tV);
  const avvisoV = await V.evaluate(() => document.body.innerText.match(/ricaric|versione|aggiorna/i) ? document.body.innerText.slice(0, 200) : '');
  await L.foto(V, 'n06-scheda-vecchia-aperta');
  L.esito('C2 la scheda vecchia viene avvisata che deve ricaricare', !!avvisoV, avvisoV || 'nessun avviso');
  /* cancellazione sulla nuova, poi la vecchia scrive ancora */
  const idB1 = await N.evaluate(() => { const a = LM.load().azioni.find((x) => x.testo === 'B1 dalla scheda vecchia'); LM.rimuoviAzione(a.id); return a.id; });
  await L.calma(N, 2500);
  await V.evaluate(() => LM.aggiungiAzione('B4 dalla scheda vecchia dopo la cancellazione', null)); await L.calma(V, 2500);
  await L.calmaTutti([N], 3500);
  const cB2 = (await L.docCloud(uid)).stato.azioni.map((a) => a.testo);
  L.esito('B3 cancellata sulla nuova, la vecchia (che l’ha ancora) riscrive: NON risorge', !cB2.includes('B1 dalla scheda vecchia') && cB2.includes('B4 dalla scheda vecchia dopo la cancellazione'), cB2);
  /* modifica di profilo sulla nuova, poi scrive la vecchia (profilo vecchio, senza orologi) */
  await N.evaluate(() => { const s = LM.load(); s.profilo.nome = 'Vera Rossi'; LM.save(); }); await L.calma(N, 2500);
  await V.evaluate(() => LM.aggiungiAzione('B5 vecchia ancora', null)); await L.calma(V, 2500);
  await L.calmaTutti([N], 3500);
  const nomeC = (await L.docCloud(uid)).stato.profilo.nome;
  L.esito('B4 nome cambiato sulla nuova, poi la vecchia riscrive col nome vecchio: resta quello nuovo', nomeC === 'Vera Rossi', { cloud: nomeC, nuova: await N.evaluate(() => LM.load().profilo.nome), vecchia: await V.evaluate(() => LM.load().profilo.nome) });
  const xp = { nuova: await N.evaluate(() => LM.load().xp), vecchia: await V.evaluate(() => LM.load().xp), cloud: (await L.docCloud(uid)).stato.xp };
  L.esito('B5 i punti non si gonfiano a ogni giro vecchia/nuova', xp.nuova === xp.cloud && xp.nuova <= 40, xp);

  /* D: utente di un anno su un dispositivo nuovo */
  await L.pulisciTutto();
  const A = await L.dispositivo('pc-un-anno', { tipo: 'pc' });
  await A.evaluate('(' + genera.toString() + ')(365)');
  const t0 = Date.now(); await L.accedi(A, 'anna', 'anna@prova.it'); await L.calma(A, 3000); const tA = Date.now() - t0;
  const uA = await L.uidDi(A);
  const fette = await L.elenco('users/' + uA + '/pezzi');
  const prin = await L.docRaw('users/' + uA);
  const B = await L.dispositivo('telefono-nuovo', { tipo: 'iphone' });
  const t1 = Date.now(); await L.accedi(B, 'anna', 'anna@prova.it'); const tB = Date.now() - t1;
  const nA = await A.evaluate(() => LM.load().azioni.length), nB = await B.evaluate(() => LM.load().azioni.length);
  L.esito('D1 un anno di dati: primo caricamento e un telefono nuovo che entra', nA === nB && nA > 2000, { azioni: nA, telefono: nB, msPrimoCaricamento: tA, msTelefono: tB, fette: fette.length, fettaPiuGrossaKB: Math.round(Math.max(...fette.map((f) => f.__byte)) / 1024), principaleKB: Math.round(JSON.stringify(prin).length / 1024) });
  const tMod = Date.now(); await B.evaluate(() => LM.aggiungiAzione('una cosa in più', null)); await L.calmaTutti([A, B], 1500);
  L.esito('D2 una modifica con un anno di dati arriva in pochi secondi', (await tx(A)).includes('una cosa in più'), { ms: Date.now() - tMod });

  L.salvaRisultati('n06-versioni'); await L.browser().close(); srv.close(); srvV.close(); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
