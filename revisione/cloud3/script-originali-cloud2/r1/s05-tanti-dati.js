/* Tanti dati: utente da mesi/anni. Dimensione del documento, tempi, limite di 1 MiB di Firestore */
const L = require('../lib'); const genera = require('./genera');
(async () => {
  const srv = await L.servi(); await L.avvia();
  for (const giorni of [90, 180, 365, 540, 730]) {
    await L.pulisciTutto();
    const A = await L.dispositivo('telefono', { tipo: 'iphone' });
    await L.accedi(A, 'mario', 'mario@prova.it');
    const uid = await L.uidDi(A);
    const t0 = Date.now();
    const bytes = await A.evaluate('(' + genera.toString() + ')(' + giorni + ')');
    await L.calma(A, 4000);
    const sync = await A.evaluate(() => window.LM_SYNC);
    const d = await L.docCloud(uid);
    // tempo di un salvataggio locale + fusione
    const tempi = await A.evaluate(() => { let t = performance.now(); LM.cattura('x'); const save = performance.now() - t; t = performance.now(); LM.unisci(LM.load(), JSON.parse(JSON.stringify(LM.load()))); return { saveMs: Math.round(save), unisciMs: Math.round(performance.now() - t) }; });
    await L.calma(A, 3000);
    const B = await L.dispositivo('pc', { tipo: 'pc' });
    const tb = Date.now(); await L.accedi(B, 'mario', 'mario@prova.it'); const accessoMs = Date.now() - tb;
    const nB = await B.evaluate(() => LM.load().azioni.length), nA = await A.evaluate(() => LM.load().azioni.length);
    const errUI = await A.evaluate(() => [...document.querySelectorAll('.toast')].map(t => t.textContent).join(' / '));
    L.esito('S5 storia di ' + giorni + ' giorni: ' + Math.round(bytes / 1024) + ' KB; nel cloud e sul pc arriva tutto', d && d.stato.azioni.length === nA && nB === nA,
      { KB: Math.round(bytes / 1024), sync: sync.state + ' ' + sync.error, cloudAzioni: d ? d.stato.azioni.length : 'NESSUN DOC', telefono: nA, pc: nB, tempi, accessoPcMs: accessoMs, avvisoAllUtente: errUI.slice(0, 200), lsKB: await A.evaluate(() => Math.round(Object.keys(localStorage).reduce((a, k) => a + (localStorage.getItem(k) || '').length, 0) / 1024)) });
    await A.ctx.close(); await B.ctx.close();
  }
  L.salvaRisultati('r1-s05'); await L.browser().close(); srv.close();
})();
