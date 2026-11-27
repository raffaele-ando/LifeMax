/* Varie: versione vecchia aperta da giorni, Azzera tutto, importazione, memoria piena, navigazione privata, SDK bloccato,
   regole che negano, chiusura subito dopo una modifica, popup bloccato, timer su due dispositivi */
const L = require('../lib'); const path = require('path');
const az = (p) => p.evaluate(() => LM.load().azioni.map(a => a.testo + (a.done ? '[x]' : '')).sort().join(' | '));
(async () => {
  const srv = await L.servi(); const srvV = await L.servi(L.PORTA + 1, path.join(L.S, 'wt-vecchio')); await L.avvia();
  // 8.1 PC con una scheda della versione di una settimana fa, telefono aggiornato
  await L.pulisciTutto();
  const T = await L.dispositivo('telefono', { tipo: 'iphone' }), V = await L.dispositivo('pc-versione-vecchia', { tipo: 'pc', porta: L.PORTA + 1 });
  for (const p of [T, V]) await L.accedi(p, 'mario', 'mario@prova.it');
  const uid = await L.uidDi(T);
  await T.evaluate(() => { LM.aggiungiAzione('dal telefono nuovo', null); LM.registraSessione({ id: 'sx', areaId: null, azioneId: null, testo: 'x', tipo: 'libero', inizio: Date.now() - 600000, minuti: 10 }); });
  await L.calmaTutti([T, V], 2500);
  await V.evaluate(() => { LM.aggiungiAzione('dalla scheda vecchia', null); const x = LM.load().azioni.find(a => a.testo === 'dal telefono nuovo'); window.__vecchiaHaRicevuto = !!x; if (x) LM.rimuoviAzione(x.id); });
  L.esito('S8.0 (round 2) la scheda VECCHIA riceve la cosa scritta dal telefono nuovo', await V.evaluate(() => window.__vecchiaHaRicevuto), await az(V));
  await L.calmaTutti([T, V], 2500);
  const campiT = await T.evaluate(() => Object.keys(LM.load()).sort().join(','));
  const campiC = Object.keys((await L.docCloud(uid)).stato).sort().join(',');
  L.esito('S8.1 scheda della versione vecchia (b3c6d4b) + telefono nuovo: stesse azioni, nessun campo perso, nessun errore', (await az(T)) === (await az(V)) && campiT === campiC && !V.__err.length && !T.__err.length, { telefono: await az(T), vecchia: await az(V), campiMancantiNelCloud: campiT.split(',').filter(k => !campiC.split(',').includes(k)), err: V.__err.concat(T.__err).slice(0, 2) });
  await T.ctx.close(); await V.ctx.close();
  // 8.2 Azzera tutto (con account) sul telefono: gli altri si svuotano e nessuno resuscita
  await L.pulisciTutto();
  const A = await L.dispositivo('telefono', { tipo: 'iphone' }), B = await L.dispositivo('pc', { tipo: 'pc' }), C = await L.dispositivo('ipad', { tipo: 'ipad' });
  for (const p of [A, B, C]) await L.accedi(p, 'mario', 'mario@prova.it');
  const uid2 = await L.uidDi(A);
  await A.evaluate(() => { for (let i = 0; i < 5; i++) LM.aggiungiAzione('cosa ' + i, null); LM.registraCheckin(3, 3, 3); LM.aggiungiArea('Musica', 'music'); LM.valutaArea('studio', 4); });
  await L.calmaTutti([A, B, C], 2500);
  await C.ctx.setOffline(true);
  await C.evaluate(() => LM.aggiungiAzione('scritta offline sull’iPad prima dell’azzeramento', null));
  await A.evaluate(() => LM.reset(true)); await L.calmaTutti([A, B], 3000);
  await C.ctx.setOffline(false); await L.calmaTutti([A, B, C], 5000);
  const conta = (p) => p.evaluate(() => { const s = LM.load(); return { azioni: s.azioni.map(a => a.testo).join(','), checkins: s.checkins.length, aree: s.aree.map(a => a.nome).join(','), valutazioni: Object.keys(s.valutazioni).length, registro: s.registro.length }; });
  const z = { telefono: await conta(A), pc: await conta(B), ipad: await conta(C) };
  L.esito('S8.2 «Azzera tutto» (account) sul telefono: anche pc/iPad si svuotano, l’area «Musica» se ne va, la cosa scritta offline DOPO resta', [z.telefono, z.pc, z.ipad].every(x => JSON.stringify(x) === JSON.stringify(z.telefono)) && !z.pc.azioni.includes('cosa') && !z.pc.aree.includes('Musica'), z);
  // 8.3 importazione di un backup mentre si è sincronizzati
  const file = await B.evaluate(() => JSON.stringify({ app: 'LifeMax', versione: 2, esportato: Date.now(), stato: Object.assign(LM.statoVuoto(), { azioni: [{ id: 'imp1', areaId: 'altro', testo: 'dal file', ifThen: '', mit: false, done: false, data: LM.todayKey(), doneAt: null, creata: Date.now() - 86400000 * 30, ora: null, durata: null, passoDi: null }] }) }));
  const ri = await A.evaluate((f) => LM.importJson(f), file); await L.calmaTutti([A, B, C], 3000);
  L.esito('S8.3 importazione da file sul telefono: arriva a pc e iPad (unione)', [await az(A), await az(B), await az(C)].every(x => x.includes('dal file')), { esito: ri, pc: await az(B) });
  // 8.4 chiudere la scheda subito dopo una modifica (iPhone: app chiusa dallo switcher)
  await A.evaluate(() => LM.aggiungiAzione('ultima prima di chiudere', null)); await A.close({ runBeforeUnload: true });
  await B.waitForTimeout(3000);
  L.esito('S8.4 app chiusa subito dopo una modifica: arriva lo stesso agli altri (la scrittura parte subito)', (await az(B)).includes('ultima prima di chiudere'), await az(B));
  // in raffica: due modifiche ravvicinate, chiusura dopo 100 ms
  const A2 = await L.dispositivo('telefono', { ctx: A.ctx }); await A2.waitForTimeout(3500);
  await A2.evaluate(() => { LM.aggiungiAzione('raffica 1', null); }); await A2.waitForTimeout(300); await A2.evaluate(() => LM.aggiungiAzione('raffica 2 (ultima)', null)); await A2.waitForTimeout(100); await A2.close();
  await B.waitForTimeout(3000);
  L.esito('S8.4b raffica + chiusura dopo 100 ms: l’ultima modifica arriva agli altri senza riaprire il telefono', (await az(B)).includes('raffica 2'), await az(B));
  // 8.5 memoria del browser piena sul pc
  await B.evaluate(() => { try { let i = 0; const x = 'x'.repeat(500000); for (;;) localStorage.setItem('riempi' + (i++), x); } catch (e) {} });
  await B.evaluate(() => LM.aggiungiAzione('scritta con memoria piena', null)); await L.calmaTutti([B, C], 3000);
  const pieno = await B.evaluate(() => ({ toast: [...document.querySelectorAll('.toast')].map(t => t.textContent).join(' / ') }));
  L.esito('S8.5 memoria piena sul pc: la modifica arriva comunque al cloud/iPad e l’utente è avvisato', (await az(C)).includes('scritta con memoria piena') && /salvare|spazio|memoria/i.test(pieno.toast), Object.assign(pieno, { ipad: await az(C) }));
  await C.evaluate(() => LM.aggiungiAzione('dall’iPad mentre il pc è pieno', null)); await L.calmaTutti([B, C], 3000);
  await B.reload(); await B.waitForTimeout(4000);
  L.esito('S8.5b pc pieno ricaricato: ha i dati (dal cloud) compresa la modifica arrivata mentre era pieno', (await az(B)).includes('dall’iPad mentre il pc è pieno') && (await az(B)).includes('scritta con memoria piena'), await az(B));
  await B.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('riempi')).forEach(k => localStorage.removeItem(k)));
  // 8.6 regole Firestore che negano (permessi tolti) sul cloud
  await L.richiesta('PUT', '127.0.0.1', L.FSP, '/emulator/v1/projects/demo-lifemax:securityRules', { rules: { files: [{ content: "rules_version='2'; service cloud.firestore { match /databases/{d}/documents { match /{x=**} { allow read, write: if false; } } }" }] } });
  await C.evaluate(() => LM.aggiungiAzione('con permessi negati', null)); await C.waitForTimeout(4000);
  const neg = await C.evaluate(() => ({ sync: window.LM_SYNC, toast: [...document.querySelectorAll('.toast')].map(t => t.textContent).join(' / '), ascolto: window.LM_AUTH.ascolto }));
  L.esito('S8.6 permesso negato dal cloud: l’utente riceve un messaggio comprensibile (non da sviluppatore)', !/regole|Firestore|console/i.test(neg.toast + neg.sync.error), neg);
  await L.richiesta('PUT', '127.0.0.1', L.FSP, '/emulator/v1/projects/demo-lifemax:securityRules', { rules: { files: [{ content: require('fs').readFileSync(path.join(L.S, 'emu/firestore.rules'), 'utf8') }] } });
  await C.evaluate(() => LM.cattura('dopo il ripristino delle regole')); await L.calmaTutti([B, C], 8000);
  const d = await L.docCloud(uid2);
  L.esito('S8.6b regole ripristinate: la modifica fatta durante il blocco arriva al cloud senza ricaricare', d.stato.azioni.some(a => a.testo === 'con permessi negati'), { ascoltoIpad: await C.evaluate(() => window.LM_AUTH.ascolto), pc: await az(B) });
  await L.calmaTutti([B, C], 70000);
  L.esito('S8.6c ...e il pc (ascolto caduto durante il blocco) la riceve entro ~1 minuto', (await az(B)).includes('con permessi negati'), { pc: await az(B), ascoltoPc: await B.evaluate(() => window.LM_AUTH.ascolto) });
  // 8.7 SDK di Firebase irraggiungibile
  const X = await L.browser().newContext(); X.__sdkKo = true;
  await X.route('https://www.gstatic.com/firebasejs/**', r => r.abort());
  const px = await L.dispositivo('telefono-senza-sdk', { ctx: X }); await px.waitForTimeout(3000);
  const sx = await px.evaluate(() => ({ auth: window.LM_AUTH, testoAccedi: (document.body.innerText.match(/Accedi[^\n]*/) || [''])[0] }));
  L.esito('S8.7 Firebase non raggiungibile (rete aziendale, blocco contenuti): l’app funziona in locale e non promette il cloud', sx.auth && sx.auth.available === false && !px.__err.length, sx);
  // 8.8 navigazione privata / localStorage bloccato
  const Pv = await L.browser().newContext(); await Pv.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError'); } }); });
  const pp = await Pv.newPage(); const errP = []; pp.on('pageerror', e => errP.push(String(e)));
  await pp.goto('http://127.0.0.1:' + L.PORTA + '/index.html'); await pp.waitForTimeout(3000);
  L.esito('S8.8 archiviazione bloccata (Safari privato vecchio / cookie bloccati): l’app si apre e lo dice', !errP.length && await pp.evaluate(() => !!window.LM), { errori: errP.slice(0, 2), avvisi: await pp.evaluate(() => [...document.querySelectorAll('.toast')].map(t => t.textContent).join(' / ')) });
  // 8.9 popup bloccato -> redirect
  const Q = await L.dispositivo('iphone-pwa', { tipo: 'iphone' });
  await Q.evaluate(() => { window.__popupFail = 'auth/popup-blocked'; window.__chi = { sub: 'mario', email: 'mario@prova.it' }; });
  await Q.waitForFunction(() => window.LMCloud && window.LMCloud.available); await Q.evaluate(() => window.LMCloud.signIn()); await Q.waitForTimeout(1500);
  L.esito('S8.9 popup bloccato: si ripiega sul redirect', await Q.evaluate(() => window.__redirectTried > 0), await Q.evaluate(() => window.__redirectTried));
  L.salvaRisultati('r1-s08'); await L.browser().close(); srv.close(); srvV.close();
})();
