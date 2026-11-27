/* Account: ospite→accesso, uscita, uscita offline, sessione persa, cambio account, due schede, memoria cancellata, account eliminato */
const L = require('./lib');
const az = (p) => p.evaluate(() => LM.load().azioni.map(a => a.testo).sort().join(' | '));
const URL = 'http://127.0.0.1:9301/';
async function svuotaIDB(p) { await p.goto(URL + 'manifest.webmanifest'); await p.evaluate(() => new Promise(r => { const q = indexedDB.deleteDatabase('firebaseLocalStorageDb'); q.onsuccess = q.onerror = q.onblocked = () => r(); })); }
async function svuotaLS(p) { await p.goto(URL + 'manifest.webmanifest'); await p.evaluate(() => localStorage.clear()); }
const riapri = async (p, nome) => { await p.goto(URL + 'index.html'); await p.waitForFunction(() => window.LM && window.LM_AUTH, null, { timeout: 15000 }); await p.waitForTimeout(2500); await L.calma(p, 1500); p.__nome = nome || p.__nome; return p; };
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();
  // 4.1 utente nuovo: ospite, onboarding, poi accesso
  const A = await L.dispositivo('telefono', { tipo: 'iphone' });
  const ob = await A.evaluate(() => !!document.getElementById('onboarding-root').innerHTML);
  L.esito('S4.1a primo avvio: si vede il benvenuto (onboarding)', ob);
  await A.evaluate(() => { const s = LM.load(); s.onboarded = true; s.profilo.nome = 'Mario'; LM.save(); LM.aggiungiAzione('da ospite', null); });
  await L.accedi(A, 'mario', 'mario@prova.it');
  const uidM = await L.uidDi(A);
  let d = await L.docCloud(uidM);
  L.esito('S4.1b dati da ospite salgono nel nuovo account', d && d.stato.azioni.some(a => a.testo === 'da ospite'), d && d.stato.azioni.map(a => a.testo));
  // 4.2 secondo dispositivo, fresco: benvenuto? nome?
  const B = await L.dispositivo('pc', { tipo: 'pc' });
  await L.accedi(B, 'mario', 'mario@prova.it');
  const bOb = await B.evaluate(() => ({ onb: LM.load().onboarded, nome: LM.load().profilo.nome, overlay: !!document.getElementById('onboarding-root').innerHTML, az: LM.load().azioni.length }));
  L.esito('S4.2 nuovo dispositivo, account esistente: prende nome/dati e non ripropone il benvenuto dopo l’accesso', bOb.onb && bOb.nome === 'Mario' && bOb.az === 1 && !bOb.overlay, bOb);
  // 4.2b secondo dispositivo con dati da ospite entra nell'account: i dati ospite si uniscono
  const C = await L.dispositivo('ipad', { tipo: 'ipad' });
  await C.evaluate(() => { const s = LM.load(); s.onboarded = true; s.profilo.nome = 'Ospite iPad'; LM.save(); LM.aggiungiAzione('ospite ipad', null); });
  await L.accedi(C, 'mario', 'mario@prova.it'); await L.calmaTutti([A, B, C], 2500);
  L.esito('S4.2b iPad con dati da ospite entra: i dati ospite finiscono nell’account (comportamento voluto: unione)', (await az(A)).includes('ospite ipad'), { telefono: await az(A), nomeTelefono: await A.evaluate(() => LM.load().profilo.nome) });
  // 4.3 uscita normale sul pc, il pc si svuota, il cloud resta
  await B.evaluate(() => LM.aggiungiAzione('ultima dal pc prima di uscire', null));
  await B.evaluate(() => window.LMCloud.signOut()); await B.waitForTimeout(1500);
  d = await L.docCloud(uidM);
  L.esito('S4.3 uscita: il pc si svuota, l’ultima modifica è nel cloud', (await az(B)) === '' && d.stato.azioni.some(a => a.testo === 'ultima dal pc prima di uscire'), { pc: await az(B) });
  await L.accedi(B, 'mario', 'mario@prova.it');
  L.esito('S4.3b rientro sul pc: i dati tornano', (await az(B)).includes('ultima dal pc'), await az(B));
  // 4.4 uscita OFFLINE
  await B.ctx.setOffline(true);
  await B.evaluate(() => LM.aggiungiAzione('scritta offline poi esco', null));
  const t0 = Date.now();
  const fine = await B.evaluate(() => Promise.race([Promise.resolve(window.LMCloud.signOut()).then(() => 'uscito'), new Promise(r => setTimeout(() => r('ancora appeso dopo 20s'), 20000))]));
  const dopo = await B.evaluate(() => ({ user: !!(window.LM_AUTH && window.LM_AUTH.user), az: LM.load().azioni.length }));
  L.esito('S4.4 «Esci» senza rete: l’uscita si completa e lo dice', fine === 'uscito', { esito: fine, ms: Date.now() - t0, dopo });
  await B.ctx.setOffline(false); await B.waitForTimeout(4000);
  const dopo2 = await B.evaluate(() => ({ user: !!(window.LM_AUTH && window.LM_AUTH.user), az: LM.load().azioni.map(a=>a.testo) }));
  d = await L.docCloud(uidM);
  L.esito('S4.4b tornata la rete: la modifica fatta offline prima di uscire è nel cloud', d.stato.azioni.some(a => a.testo === 'scritta offline poi esco'), { pcDopo: dopo2, cloud: d.stato.azioni.map(a => a.testo) });
  await B.ctx.close();
  // 4.5 sessione persa senza «Esci» (dati del browser per il sito di Google/Firebase cancellati, token revocato): poi entra Luigi
  await svuotaIDB(C); await riapri(C, 'ipad');
  const cDopo = await C.evaluate(() => ({ user: !!(window.LM_AUTH && window.LM_AUTH.user), az: LM.load().azioni.length }));
  L.esito('S4.5a iPad perde la sessione (IndexedDB cancellato): l’app è disconnessa e i dati di Mario restano visibili sul dispositivo', !cDopo.user, cDopo);
  await L.accedi(C, 'luigi', 'luigi@prova.it');
  const uidL = await L.uidDi(C);
  const dl = await L.docCloud(uidL);
  L.esito('S4.5b poi entra LUIGI sull’iPad: nel suo account NON devono finire i dati di Mario', !dl || !dl.stato.azioni.some(a => /ospite|pc|da ospite/.test(a.testo)), dl && dl.stato.azioni.map(a => a.testo));
  // 4.6 due schede: esco in una, l'altra resta con i dati
  const T1 = await L.dispositivo('pc2-scheda1', { tipo: 'pc' });
  await L.accedi(T1, 'mario', 'mario@prova.it');
  const T2 = await L.dispositivo('pc2-scheda2', { ctx: T1.ctx }); await T2.waitForTimeout(3000);
  L.esito('S4.6a seconda scheda: già dentro con gli stessi dati', (await az(T2)) === (await az(T1)) && await T2.evaluate(() => !!(window.LM_AUTH && window.LM_AUTH.user)), await az(T2));
  await T1.evaluate(() => window.LMCloud.signOut()); await T1.waitForTimeout(2500);
  const t2 = await T2.evaluate(() => ({ user: !!(window.LM_AUTH && window.LM_AUTH.user), az: LM.load().azioni.length }));
  await T2.evaluate(() => LM.cattura('nota scritta nella seconda scheda dopo l’uscita'));
  await T2.waitForTimeout(500);
  const ls = await T1.evaluate(() => JSON.parse(localStorage.getItem('lifemax.v1') || localStorage.getItem(Object.keys(localStorage).find(k => /^lifemax\.v/.test(k))) || '{}').azioni?.length);
  L.esito('S4.6b esco nella scheda 1: anche la scheda 2 si svuota e non rimette i dati nel dispositivo', t2.az === 0 && !ls, { scheda2: t2, azioniNelSalvataggioDopoScritturaScheda2: ls });
  await L.accedi(T1, 'luigi', 'luigi@prova.it'); await L.calmaTutti([T1, T2], 3000);
  const dl2 = await L.docCloud(uidL);
  L.esito('S4.6c poi Luigi entra in quella finestra: niente dati di Mario nel suo account', !dl2.stato.azioni.some(a => /ospite|pc|da ospite/.test(a.testo)), dl2.stato.azioni.map(a => a.testo));
  // 4.7 account eliminato/disabilitato mentre il telefono è dentro
  const r = await L.richiesta('POST', '127.0.0.1', 9399, '/identitytoolkit.googleapis.com/v1/projects/demo-lifemax/accounts:update', { localId: uidM, disableUser: true }, { Authorization: 'Bearer owner' });
  await A.evaluate(() => window.__auth.currentUser.getIdToken(true).catch(e => (window.__tokErr = e.code)));
  await A.evaluate(() => LM.aggiungiAzione('scritta con account disabilitato', null)); await A.waitForTimeout(4000);
  const aSt = await A.evaluate(() => ({ user: !!(window.LM_AUTH && window.LM_AUTH.user), sync: window.LM_SYNC, tokErr: window.__tokErr, toast: [...document.querySelectorAll('.toast')].map(t => t.textContent).join(' / ') }));
  L.esito('S4.7 account disabilitato: l’app lo dice in modo comprensibile e tiene la modifica sul dispositivo', /account|sessione|accedi/i.test(JSON.stringify(aSt)) && (await az(A)).includes('scritta con account disabilitato'), { disable: r.s, stato: aSt });
  for (const p of [A, C, T1, T2]) L.esito('S4 errori in pagina su ' + p.__nome, p.__err.length === 0, p.__err.slice(0, 3));
  L.salvaRisultati('s04'); await L.browser().close(); srv.close();
})();
