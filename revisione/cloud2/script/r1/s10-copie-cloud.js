/* Le copie di sicurezza nel cloud (users/uid/backups) crescono senza limite? quanto pesa aprire «Backup»? */
const L = require('../lib'); const genera = require('./genera');
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();
  const T = await L.dispositivo('telefono', { tipo: 'iphone' });
  await L.accedi(T, 'mario', 'mario@prova.it'); const uid = await L.uidDi(T);
  await T.evaluate('(' + genera.toString() + ')(120)'); await L.calma(T, 3000);
  const P = await L.dispositivo('pc', { tipo: 'pc' }); await L.accedi(P, 'mario', 'mario@prova.it');
  for (let i = 0; i < 10; i++) {
    // il pc scrive mentre il telefono è chiuso; il telefono si riapre: prima sincronizzazione con differenze
    await T.close();
    await P.evaluate((i) => LM.aggiungiAzione('dal pc ' + i, null), i); await L.calma(P, 800);
    const T2 = await L.dispositivo('telefono', { ctx: T.ctx }); await L.calma(T2, 2500); T.close = () => T2.close();
  }
  const r = await L.richiesta('GET', '127.0.0.1', 9380, '/v1/projects/demo-lifemax/databases/(default)/documents/users/' + uid + '/backups?pageSize=300', null, { Authorization: 'Bearer owner' });
  const j = JSON.parse(r.b); const n = (j.documents || []).length;
  const t0 = Date.now(); const lista = await P.evaluate(() => window.LMCloud.backups().then(x => x.length)); const ms = Date.now() - t0;
  L.esito('S10 10 riaperture del telefono con differenze: le copie nel cloud restano poche (o vengono sfoltite)', n <= 5, { copieNelCloud: n, MBscaricatiAprendoBackup: Math.round(r.b.length / 1048576 * 10) / 10, msPerElencarle: ms, elencate: lista });
  L.salvaRisultati('r1-s10'); await L.browser().close(); srv.close();
})();
