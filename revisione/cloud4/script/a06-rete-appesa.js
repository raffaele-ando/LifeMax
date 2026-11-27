/* A06 — La rete «appesa»: il segnale c'è, la richiesta parte e non torna
   mai (metro, Wi-Fi del treno, un captive portal). Le richieste rimaste
   appese restano appese; quelle nuove, dopo, passano.
   Atteso: tornata la rete buona, la modifica fatta durante il buco arriva
   nel cloud da sola, in tempi ragionevoli (diciamo entro un minuto), anche
   se qualche richiesta di prima non ha mai avuto risposta.
   node a06-rete-appesa.js */
'use strict';
const { banco, esiti } = require('./lib');
const R = esiti('a06-rete-appesa');

(async () => {
  const { E, B, N, chiudi } = await banco(9400);
  const FS = 'http://127.0.0.1:' + E.P.firestore + '/**';
  try {
    await N.pulisci();
    const T = await B.dispositivo('telefono', { tipo: 'iphone' });
    await B.accedi(T, 'gea', 'gea@prova.it');
    const uid = await B.uidDi(T);
    await T.evaluate(() => { const s = LM.load(); s.onboarded = true; LM.save(); LM.aggiungiAzione('Prima del buco', null); });
    await B.calma(T, 2500);
    /* la rete si appende: tutto quello che va a Firestore non torna più */
    const appese = [];
    let appendi = true;
    await T.ctx.route(FS, (r) => { if (appendi) appese.push(r); else r.continue(); });
    await T.evaluate(() => LM.aggiungiAzione('Scritta durante il buco', null));
    await T.waitForTimeout(40000);
    const durante = await T.evaluate(() => window.LM_SYNC && window.LM_SYNC.state);
    R.nota('A06 stato del salvataggio durante il buco (40 s)', { stato: durante, richiesteAppese: appese.length, quali: appese.map((r) => r.request().method() + ' ' + r.request().url().replace(/\?.*$/, '').slice(-90)) });
    /* torna la rete buona: le richieste nuove passano, quelle appese restano appese */
    appendi = false;
    await T.evaluate(() => window.dispatchEvent(new Event('online')));
    const t0 = Date.now(); let arrivata = false;
    while (Date.now() - t0 < 120000) {
      const st = await N.stato(uid);
      if (st && (st.azioni || []).some((a) => a.testo === 'Scritta durante il buco')) { arrivata = true; break; }
      await T.waitForTimeout(3000);
    }
    const dopo = Math.round((Date.now() - t0) / 1000);
    const stato = await T.evaluate(() => window.LM_SYNC && window.LM_SYNC.state);
    R.ok('A06.1 tornata la rete, la modifica fatta durante il buco arriva nel cloud entro un minuto', arrivata && dopo <= 60, { arrivata, secondi: dopo, statoNellApp: stato });
    /* e una modifica nuova, adesso? */
    await T.evaluate(() => LM.aggiungiAzione('Scritta dopo il buco', null));
    const t1 = Date.now(); let nuova = false;
    while (Date.now() - t1 < 60000) {
      const st = await N.stato(uid);
      if (st && (st.azioni || []).some((a) => a.testo === 'Scritta dopo il buco')) { nuova = true; break; }
      await T.waitForTimeout(3000);
    }
    R.ok('A06.2 una modifica nuova, a rete buona, arriva nel cloud', nuova, { secondi: Math.round((Date.now() - t1) / 1000), statoNellApp: await T.evaluate(() => window.LM_SYNC && window.LM_SYNC.state) });
    const reg = await T.evaluate(() => { try { return JSON.parse(localStorage.getItem('lifemax.log.v1') || 'null').slice(-14).map((v) => JSON.stringify(v).slice(0, 160)); } catch (e) { return String(e); } });
    R.nota('A06 ultime righe del registro tecnico', reg);
    appese.forEach((r) => r.abort().catch(() => {}));
  } catch (e) { R.ok('eccezione', false, String(e && e.stack || e)); }
  await chiudi();
  process.exit(R.fine() ? 1 : 0);
})();
