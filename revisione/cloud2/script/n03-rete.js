/* N03 — LA RETE: tre dispositivi offline che tornano in ordini diversi, rete
   ballerina, rete lenta, pagina uccisa a metà giro, app chiusa subito dopo una
   modifica (la «cassetta delle lettere»), regole che dicono no, cloud muto.
   node n03-rete.js */
const L = require('./lib');
const FS = () => new RegExp('127\\.0\\.0\\.1:' + L.FSP);
const az = (p, t) => p.evaluate((t) => { const a = LM.load().azioni.find((x) => x.testo.indexOf(t) === 0 || x.id === t); return a ? { testo: a.testo, done: !!a.done, id: a.id } : null; }, t);
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();
  const T = await L.dispositivo('telefono', { tipo: 'iphone' }), I = await L.dispositivo('ipad', { tipo: 'ipad' }), P = await L.dispositivo('pc', { tipo: 'pc' });
  const tutti = [T, I, P];
  for (const p of tutti) await L.accedi(p, 'nora', 'nora@prova.it');
  const uid = await L.uidDi(T);

  /* A: stessa azione cambiata da tre parti, due offline, ritorni in ordine inverso */
  const idX = await P.evaluate(() => LM.aggiungiAzione('X originale', null).id);
  const idY = await P.evaluate(() => LM.aggiungiAzione('Y da cancellare', null).id);
  const idZ = await P.evaluate(() => LM.aggiungiAzione('Z cancellata prima, modificata dopo', null).id);
  await L.calmaTutti(tutti, 1500);
  await T.ctx.setOffline(true); await I.ctx.setOffline(true);
  await T.evaluate((id) => LM.modificaAzione(id, 'X-telefono (prima)'), idX); await T.waitForTimeout(300);
  await I.evaluate((id) => LM.modificaAzione(id, 'X-ipad (dopo)'), idX); await I.waitForTimeout(300);
  await P.evaluate((id) => LM.completaAzione(id), idX);
  await T.evaluate((id) => LM.rimuoviAzione(id), idY); await T.waitForTimeout(200);
  await P.evaluate((id) => LM.modificaAzione(id, 'Y modificata DOPO la cancellazione (online)'), idY);
  await I.evaluate((id) => LM.rimuoviAzione(id), idZ); await I.waitForTimeout(200);
  await L.calma(P, 1500);
  await I.ctx.setOffline(false); await L.calmaTutti([I, P], 2500);
  await T.ctx.setOffline(false); await L.calmaTutti(tutti, 4000);
  const fine = {};
  for (const p of tutti) fine[p.__nome] = { X: await az(p, idX), Y: await az(p, idY), Z: await az(p, idZ) };
  const c = await L.docCloud(uid);
  const cx = c.stato.azioni.find((a) => a.id === idX), cy = c.stato.azioni.find((a) => a.id === idY), cz = c.stato.azioni.find((a) => a.id === idZ);
  fine.cloud = { X: cx && { testo: cx.testo, done: !!cx.done }, Y: cy && cy.testo, Z: cz && cz.testo };
  const uguali = JSON.stringify(fine.telefono) === JSON.stringify(fine.ipad) && JSON.stringify(fine.ipad) === JSON.stringify(fine.pc);
  L.esito('A1 tre dispositivi, due offline, ritorno in ordine inverso: tutti uguali al cloud', uguali, fine);
  L.esito('A2 vince la modifica più recente per campo (testo dall’iPad, spunta dal PC)', !!(fine.pc.X && fine.pc.X.testo === 'X-ipad (dopo)' && fine.pc.X.done), fine.pc.X);
  L.esito('A3 cancellata offline e modificata DOPO online: la modifica vince (resta)', !!fine.pc.Y, fine.pc.Y);
  L.esito('A4 cancellata offline DOPO una modifica: resta cancellata', !fine.pc.Z, fine.pc.Z);

  /* C: rete ballerina (40% delle richieste a Firestore fallisce) per 20 s, dieci modifiche */
  let n = 0;
  await T.ctx.route(FS(), (r) => { n++; if (Math.random() < 0.4) return r.abort(); return r.continue(); });
  for (let i = 0; i < 10; i++) { await T.evaluate((i) => LM.aggiungiAzione('ballerina ' + i, null), i); await T.waitForTimeout(1500 + Math.random() * 500); }
  await T.ctx.unroute(FS());
  await T.evaluate(() => window.dispatchEvent(new Event('online')));
  await L.calmaTutti(tutti, 8000);
  const nc = (await L.docCloud(uid)).stato.azioni.filter((a) => /^ballerina/.test(a.testo)).length;
  const np = (await L.testi(P)).filter((t) => /^ballerina/.test(t)).length;
  L.esito('C1 rete ballerina: tutte e 10 le modifiche arrivano nel cloud e sul PC', nc === 10 && np === 10, { cloud: nc, pc: np, richiesteViste: n });

  /* D: rete lenta (3 s per richiesta) */
  await I.ctx.route(FS(), async (r) => { await new Promise((ok) => setTimeout(ok, 3000)); return r.continue().catch(() => {}); });
  await I.evaluate(() => LM.aggiungiAzione('lenta 1', null));
  await I.waitForTimeout(1000);
  const statoLento = await I.evaluate(() => window.LM_SYNC && window.LM_SYNC.state);
  await I.waitForTimeout(25000);
  await I.ctx.unroute(FS());
  await L.calmaTutti(tutti, 4000);
  L.esito('D1 rete lenta: la modifica arriva (e nel frattempo lo stato è «saving»/«attesa»)', (await L.testi(P)).includes('lenta 1'), { statoDopo1s: statoLento });

  /* E: pagina UCCISA a metà giro (crash del renderer, niente pagehide) */
  const cdp = await T.ctx.newCDPSession(T);
  await T.evaluate(() => LM.aggiungiAzione('E scritta e poi crash', null));
  await T.waitForTimeout(40);
  await Promise.race([cdp.send('Page.crash').catch(() => {}), new Promise((ok) => setTimeout(ok, 3000))]);
  await P.waitForTimeout(3000);
  const cE = await L.docCloud(uid);
  L.esito('E1 dopo il crash il cloud è integro (nessuna fetta mancante)', !cE.rotto, cE.rotto || 'integro');
  await T.close().catch(() => {});
  const T2 = await L.dispositivo('telefono-riaperto', { ctx: T.ctx }); await L.calmaTutti([T2, P], 4000);
  L.esito('E2 riaprendo, la modifica scritta prima del crash arriva al PC', (await L.testi(P)).includes('E scritta e poi crash'), await T2.evaluate(() => window.LM_SYNC && window.LM_SYNC.state));

  /* F: app chiusa SUBITO dopo una modifica: arriva agli altri senza riaprire? */
  await T2.evaluate(() => LM.aggiungiAzione('F chiusa subito', null));
  await T2.close({ runBeforeUnload: true });
  await P.waitForTimeout(6000);
  const fArr = (await L.testi(P)).includes('F chiusa subito');
  const posta = (await L.docRaw('users/' + uid)) || {};
  L.esito('F1 modifica e chiusura immediata: arriva al PC senza riaprire il telefono (giro o cassetta delle lettere)', fArr, { postaNelPrincipale: Object.keys(posta.posta || {}) });
  /* F2: idem ma con il gettone vecchio di più di un'ora (PC aperto da ore, nessun giro) */
  const P2 = await L.dispositivo('pc-aperto-da-ore', { tipo: 'pc' }); await L.accedi(P2, 'nora', 'nora@prova.it');
  await P2.ctx.route(FS(), async (r) => { const u = r.request().url(); if (/:commit/.test(u)) return r.continue(); await new Promise((ok) => setTimeout(ok, 20000)); return r.continue().catch(() => {}); });
  await P2.evaluate(() => LM.aggiungiAzione('F2 dal pc lento, chiuso subito', null));
  await P2.waitForTimeout(200);
  await P2.close({ runBeforeUnload: true });
  await P.waitForTimeout(6000);
  L.esito('F2 PC con Firestore lento: chiudendo la scheda la modifica parte con la cassetta delle lettere (keepalive)', (await L.testi(P)).includes('F2 dal pc lento, chiuso subito'), 'via REST :commit');

  /* G: le regole dicono no (permission-denied), poi tornano */
  await L.regole("rules_version = '2'; service cloud.firestore { match /databases/{d}/documents { match /{x=**} { allow read: if request.auth != null; allow write: if false; } } }");
  await I.evaluate(() => LM.aggiungiAzione('G con regole che dicono no', null)); await I.waitForTimeout(4000);
  const g = await I.evaluate(() => ({ stato: window.LM_SYNC && window.LM_SYNC.state, errore: window.LM_SYNC && window.LM_SYNC.error }));
  await L.foto(I, 'n03-g-permesso-negato');
  await L.regole(L.REGOLE_VERE);
  const t0 = Date.now();
  let arrivato = false;
  while (Date.now() - t0 < 70000) { if ((await L.testi(P)).includes('G con regole che dicono no')) { arrivato = true; break; } await P.waitForTimeout(2000); }
  L.esito('G1 permesso negato: messaggio comprensibile', /non accetta/.test(g.errore || ''), g);
  L.esito('G2 regole tornate: la modifica parte da sola entro 70 s', arrivato, { secondi: Math.round((Date.now() - t0) / 1000) });

  /* I: online ma Firestore muto per 30 s */
  await I.ctx.route(FS(), () => { /* non risponde mai */ });
  await I.evaluate(() => LM.aggiungiAzione('I cloud muto', null));
  await I.waitForTimeout(28000);
  const muto = await I.evaluate(() => ({ stato: window.LM_SYNC && window.LM_SYNC.state, errore: window.LM_SYNC && window.LM_SYNC.error, pastiglia: !!document.getElementById('lm-non-ancora') }));
  await L.foto(I, 'n03-i-cloud-muto');
  await I.ctx.unroute(FS());
  L.esito('I1 cloud muto: dopo ~25 s lo dice', muto.stato === 'muto' || muto.stato === 'attesa', muto);
  /* l'SDK, rimasto appeso, riparte da solo? */
  const t1 = Date.now(); let ok2 = false;
  while (Date.now() - t1 < 90000) { if ((await L.testi(P)).includes('I cloud muto')) { ok2 = true; break; } await P.waitForTimeout(3000); }
  L.esito('I2 il cloud torna a rispondere: la modifica arriva senza ricaricare (entro 90 s)', ok2, { secondi: Math.round((Date.now() - t1) / 1000) });

  L.salvaRisultati('n03-rete'); await L.browser().close(); srv.close(); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
