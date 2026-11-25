/* N01 — UN DISPOSITIVO CONDIVISO: due persone, due account, lo stesso PC.
   Domande:
     A. dopo «Esci», i dati di Mario restano sul PC in qualche forma? (backup
        locali, copia «da parte», Registro tecnico, specchio dei calendari)
     B. Luigi (ospite) li può vedere e ripristinare dal pannello «Backup»?
     C. e poi, accedendo, finiscono nel SUO account?
     D. Luigi già collegato ripristina il backup «all'uscita dall'account» di Mario
     E. sessione chiusa dal server (account disabilitato): stesso giro
     F. Mario ↔ Luigi che si alternano più volte: nessuna contaminazione
     G. «Esci» senza cloud raggiungibile (rete «finta»: c'è, ma Firestore no) e
        Luigi che entra prima che la modifica di Mario parta
   node n01-dispositivo-condiviso.js */
const L = require('./lib');
const PRIV = 'Visita dallo psichiatra (privato Mario)';
const cerca = (s, t) => JSON.stringify(s || {}).indexOf(t) >= 0;
async function apriBackup(p) {
  await p.evaluate(() => { location.hash = '#/profilo'; });
  await p.waitForTimeout(800);
  const b = await p.$('#imp-backup');
  if (b) { await b.click().catch(() => {}); await p.waitForTimeout(800); return true; }
  return false;
}
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();

  /* ---------- A/B/C: Esci online, poi Luigi ospite ---------- */
  const P = await L.dispositivo('pc-condiviso', { tipo: 'pc' });
  await L.accedi(P, 'mario', 'mario@prova.it');
  const uidM = await L.uidDi(P);
  await P.evaluate((t) => { LM.aggiungiAzione(t, null); LM.registraCheckin(2, 2, 1, 'giornata nera'); LM.salvaReviewSera({ vittoria: 'niente', blocco: 'ansia forte', shutdown: true }); LM.load().profilo.nome = 'Mario Rossi'; LM.save(); }, PRIV);
  await L.calma(P, 2500);
  const cloudM = await L.docCloud(uidM);
  L.esito('A0 i dati di Mario sono nel suo cloud', cerca(cloudM.stato, PRIV));
  await P.evaluate(() => window.LMCloud.signOut()); await L.calma(P, 1500);
  const dopo = await P.evaluate((t) => {
    const out = { schermo: JSON.stringify(LM.load()).indexOf(t) >= 0, chiavi: {} };
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); const v = localStorage.getItem(k) || ''; if (v.indexOf(t) >= 0 || v.indexOf('ansia forte') >= 0 || v.indexOf('mario@prova.it') >= 0) out.chiavi[k] = v.length; }
    out.backups = LM.listBackups();
    out.utenteFirebase = !!(window.__auth && window.__auth.currentUser);
    return out;
  }, PRIV);
  L.esito('A1 dopo «Esci» lo schermo è vuoto', !dopo.schermo, { utenteFirebase: dopo.utenteFirebase });
  L.esito('A2 [privacy] dopo «Esci» NESSUNA copia dei dati di Mario resta nel browser', Object.keys(dopo.chiavi).length === 0, { chiaviConDatiDiMario: dopo.chiavi, backups: dopo.backups });
  const aperto = await apriBackup(P);
  await L.foto(P, 'n01-backup-dopo-esci-di-mario');
  L.esito('A3 il pannello Backup (aperto da ospite) elenca la copia «all’uscita dall’account»', aperto && (await P.evaluate(() => document.body.innerText.indexOf('all’uscita dall’account') >= 0)), aperto);
  /* B: Luigi ospite tocca «Ripristina» su quella copia */
  const ts = dopo.backups.find((b) => b.motivo === 'uscita-dall-account');
  if (ts) await P.evaluate((t) => LM.restoreBackup(t), ts.ts);
  await P.evaluate(() => { location.hash = '#/oggi'; }); await P.waitForTimeout(800);
  const vede = await P.evaluate((t) => ({ azione: LM.load().azioni.some((a) => a.testo === t), nome: LM.load().profilo.nome, sera: JSON.stringify(LM.load().reviewSera).indexOf('ansia') >= 0 }), PRIV);
  await L.foto(P, 'n01-luigi-ospite-vede-i-dati-di-mario');
  L.esito('B1 [privacy] Luigi ospite NON può riportare in vita i dati di Mario', !vede.azione, vede);
  /* C: Luigi accede col suo account */
  await L.accedi(P, 'luigi', 'luigi@prova.it');
  const uidL = await L.uidDi(P);
  await L.calma(P, 2500);
  const cloudL = await L.docCloud(uidL);
  L.esito('C1 [fuga fra account] l’account di Luigi NON contiene i dati di Mario', !cerca(cloudL && cloudL.stato, PRIV) && !cerca(cloudL && cloudL.stato, 'ansia forte'), { azioniLuigi: cloudL && cloudL.stato && cloudL.stato.azioni.map((a) => a.testo), nomeProfilo: cloudL && cloudL.stato && cloudL.stato.profilo && cloudL.stato.profilo.nome });

  /* ---------- D: Luigi già dentro ripristina la copia di Mario ---------- */
  await L.pulisciTutto();
  const Q = await L.dispositivo('pc-condiviso-2', { tipo: 'pc' });
  await L.accedi(Q, 'mario', 'mario@prova.it');
  await Q.evaluate((t) => LM.aggiungiAzione(t, null), PRIV); await L.calma(Q, 2000);
  await Q.evaluate(() => window.LMCloud.signOut()); await L.calma(Q, 1000);
  await L.accedi(Q, 'luigi', 'luigi@prova.it'); const uidL2 = await L.uidDi(Q);
  const bk = await Q.evaluate(() => LM.listBackups());
  const suo = bk.find((b) => b.motivo === 'uscita-dall-account' && b.ricchezza > 0);
  if (suo) await Q.evaluate((t) => LM.restoreBackup(t), suo.ts);
  await L.calma(Q, 3000);
  const cL2 = await L.docCloud(uidL2);
  L.esito('D1 [fuga fra account] Luigi collegato vede nei Backup la copia di Mario e ripristinandola la manda nel SUO cloud', !cerca(cL2 && cL2.stato, PRIV), { copieInElenco: bk.map((b) => b.motivo + ':' + b.ricchezza), cloudLuigi: cL2 && cL2.stato && cL2.stato.azioni.map((a) => a.testo) });

  /* ---------- E: sessione chiusa dal server ---------- */
  await L.pulisciTutto();
  const R = await L.dispositivo('pc-condiviso-3', { tipo: 'pc' });
  await L.accedi(R, 'mario', 'mario@prova.it'); const uidM3 = await L.uidDi(R);
  await R.evaluate((t) => LM.aggiungiAzione(t, null), PRIV); await L.calma(R, 2000);
  await L.utenteAuth(uidM3, { disableUser: true });
  await R.evaluate(() => window.__auth.currentUser.getIdToken(true).catch((e) => String(e && e.code))); await R.waitForTimeout(2500);
  const e1 = await R.evaluate((t) => ({ connesso: !!(window.LM_AUTH && window.LM_AUTH.user), schermo: JSON.stringify(LM.load()).indexOf(t) >= 0, backup: LM.listBackups().map((b) => b.motivo + ':' + b.ricchezza) }), PRIV);
  L.esito('E1 sessione chiusa dal server: schermo vuoto, utente fuori', !e1.connesso && !e1.schermo, e1);
  L.esito('E2 [privacy] …ma la copia «all’uscita dall’account» con i dati di Mario è nel pannello Backup', !e1.backup.some((b) => /^uscita-dall-account:[1-9]/.test(b)), e1.backup);

  /* ---------- F: si alternano ---------- */
  await L.pulisciTutto();
  const S = await L.dispositivo('pc-condiviso-4', { tipo: 'pc' });
  const giri = [];
  for (let i = 0; i < 3; i++) {
    for (const [chi, mail] of [['mario', 'mario@prova.it'], ['luigi', 'luigi@prova.it']]) {
      await L.accedi(S, chi, mail);
      await S.evaluate(([c, n]) => LM.aggiungiAzione('cosa di ' + c + ' #' + n, null), [chi, i]);
      await L.calma(S, 1500);
      await S.evaluate(() => window.LMCloud.signOut()); await L.calma(S, 800);
    }
  }
  await L.accedi(S, 'mario', 'mario@prova.it'); const uM = await L.uidDi(S);
  const azM = (await L.testi(S)).sort();
  await S.evaluate(() => window.LMCloud.signOut()); await L.calma(S, 800);
  await L.accedi(S, 'luigi', 'luigi@prova.it'); const uL = await L.uidDi(S);
  const azL = (await L.testi(S)).sort();
  const cM = await L.docCloud(uM), cL = await L.docCloud(uL);
  L.esito('F1 tre giri Mario/Luigi: ognuno ha solo le sue 3 cose (schermo e cloud)', azM.length === 3 && azM.every((t) => /mario/.test(t)) && azL.length === 3 && azL.every((t) => /luigi/.test(t)) &&
    cM.stato.azioni.every((a) => /mario/.test(a.testo)) && cL.stato.azioni.every((a) => /luigi/.test(a.testo)), { mario: azM, luigi: azL });
  const nb = await S.evaluate(() => LM.listBackups().map((b) => b.motivo + ':' + b.ricchezza));
  L.esito('F2 [privacy] backup locali che contengono dati di account usciti (dopo 6 uscite)', !nb.some((b) => /^uscita-dall-account:[1-9]/.test(b)), nb);

  /* ---------- G: Esci con Firestore irraggiungibile, poi entra Luigi ---------- */
  await L.pulisciTutto();
  const U = await L.dispositivo('pc-condiviso-5', { tipo: 'pc' });
  await L.accedi(U, 'mario', 'mario@prova.it'); const uM5 = await L.uidDi(U);
  await U.ctx.route(new RegExp("127\\.0\\.0\\.1:" + L.FSP), (r) => r.abort());
  await U.evaluate(() => LM.aggiungiAzione('Ultima cosa di Mario prima di uscire', null));
  await U.waitForTimeout(500);
  const esitoUscita = await U.evaluate(() => window.LMCloud.signOut());
  await U.waitForTimeout(1500);
  const g0 = await U.evaluate(() => ({ visibile: !!(window.LM_AUTH && window.LM_AUTH.user), firebase: window.__auth && window.__auth.currentUser && window.__auth.currentUser.email, inAttesa: localStorage.getItem('lm-uscita-in-attesa') }));
  L.esito('G0 «Esci» senza cloud: l’app esce dallo schermo ma la sessione Firebase di Mario resta viva di nascosto', true, Object.assign({ esitoUscita }, g0));
  await L.accedi(U, 'luigi', 'luigi@prova.it');
  await U.ctx.unroute(new RegExp("127\\.0\\.0\\.1:" + L.FSP));
  await U.evaluate(() => window.dispatchEvent(new Event('online'))); await L.calma(U, 4000);
  const cM5 = await L.docCloud(uM5);
  const resta = await U.evaluate((u) => !!localStorage.getItem('lifemax.daparte.' + u), uM5);
  L.esito('G1 la modifica di Mario arriva comunque nel SUO cloud (anche se nel frattempo è entrato Luigi)', !!(cM5 && cM5.stato && cM5.stato.azioni.some((a) => /Ultima cosa di Mario/.test(a.testo))), { cloudMario: cM5 && cM5.stato && cM5.stato.azioni.map((a) => a.testo), copiaDaParteAncoraSulPC: resta });

  L.salvaRisultati('n01-dispositivo-condiviso'); await L.browser().close(); srv.close(); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
