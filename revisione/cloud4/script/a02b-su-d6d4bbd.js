/* A02 — Un orologio avanti, una volta sola, senza cloud: la cosa scritta in
   quel momento resta «del futuro», e per tutto quello scarto nessuno la può
   più cambiare — nemmeno lo stesso dispositivo, che vede la sua modifica
   nuova tornare indietro da sola.
   È il seguito della correzione N4 (075c55b): quella riporta giù l'orologio
   LOGICO del dispositivo (`tetto`), ma gli orologi già scritti nei dati
   (`orologi`, `aggiornata`) restano avanti. Prima della correzione il
   dispositivo, rimasto avanti, almeno vinceva sulle sue cose.
   Caso A: telefono con l'orologio avanti di 3 ore (ora messa a mano male),
           aperto senza rete; rinomina «Riunione». Torna la rete (il telefono
           misura lo scarto). Poi, dallo stesso telefono, la rinomina di nuovo.
   Caso B: PC avanti di 2 giorni (data sbagliata), senza cloud, rinomina;
           l'orologio torna giusto; il giorno stesso il telefono rinomina.
   node a02-orologio-avanti-campo.js */
'use strict';
const { banco, esiti } = require('./lib');
const R = esiti('a02-SU-d6d4bbd');
const H = 3600000, G = 24 * H;

(async () => {
  const { E, B, N, chiudi } = await banco(9400);
  const FS = 'http://127.0.0.1:' + E.P.firestore + '/**';
  const testo = (d, i) => d.evaluate((x) => (LM.load().azioni.find((a) => a.id === x) || {}).testo, i);
  const rinomina = (d, i, x) => d.evaluate(([a, b]) => { const r = LM.load().azioni.find((y) => y.id === a); r.testo = b; LM.save(); }, [i, x]);
  const riapri = async (d) => { await d.reload(); await d.waitForFunction(() => window.LM, null, { timeout: 20000 }); };
  try {
    /* ---------------------------------------------------------------- A */
    {
      await N.pulisci();
      const T = await B.dispositivo('telefono', { tipo: 'iphone' }), P = await B.dispositivo('pc');
      await B.accedi(T, 'olga', 'olga@prova.it'); await B.accedi(P, 'olga', 'olga@prova.it');
      const uid = await B.uidDi(T);
      await T.evaluate(() => LM.aggiungiAzione('Riunione', null));
      await B.calmaTutti([T, P], 3000);
      const id = await T.evaluate(() => LM.load().azioni.find((a) => a.testo === 'Riunione').id);
      /* l'orologio del telefono va avanti di 3 ore, e l'app si apre senza rete */
      await T.ctx.route(FS, (r) => r.abort());
      await B.avanti(T, 3 * H);
      await riapri(T); await T.waitForTimeout(2500);
      await rinomina(T, id, 'Riunione (telefono, senza rete)'); await T.waitForTimeout(800);
      /* torna la rete: il telefono misura lo scarto (−3 h) e manda */
      await T.ctx.unroute(FS);
      await riapri(T); await B.calmaTutti([T, P], 4000);
      const scarto = await T.evaluate(() => JSON.parse(localStorage.getItem('lm-scarto-orologio') || 'null'));
      R.ok('A02.A0 il telefono ha misurato lo scarto (circa −3 h)', !!scarto && Math.abs(scarto.ms + 3 * H) < 60000, scarto);
      /* un minuto dopo, dallo stesso telefono: di nuovo */
      await T.waitForTimeout(1500);
      await rinomina(T, id, 'Riunione spostata alle 15 (telefono, con rete)');
      const subito = await testo(T, id);
      await B.calmaTutti([T, P], 4000); await T.waitForTimeout(1500); await B.calma(T, 500);
      const a = { subitoDopoLaModifica: subito, telefono: await testo(T, id), pc: await testo(P, id) };
      a.cloud = (((await N.stato(uid)) || {}).azioni || []).filter((x) => x.id === id).map((x) => x.testo)[0];
      R.ok('A02.A1 la modifica fatta DOPO sullo stesso telefono resta (telefono, PC, cloud)', Object.keys(a).every((k) => /15/.test(a[k] || '')), a);
      /* e dal PC, mezz'ora dopo (orologio giusto) */
      await rinomina(P, id, 'Riunione annullata (dal PC)');
      await B.calmaTutti([T, P], 4000); await B.calmaTutti([T, P], 1000);
      const a2 = { pc: await testo(P, id), telefono: await testo(T, id) };
      R.ok('A02.A2 la modifica fatta dopo dal PC resta', Object.values(a2).every((v) => /PC/.test(v || '')), a2);
      await T.screenshot({ path: require('path').join(__dirname, '..', 'schermate', 'a02-a-telefono.png') }).catch(() => {});
      await T.ctx.close(); await P.ctx.close();
    }
    /* ---------------------------------------------------------------- B */
    {
      await N.pulisci();
      const P = await B.dispositivo('pc'), T = await B.dispositivo('telefono', { tipo: 'iphone' });
      await B.accedi(P, 'ugo', 'ugo@prova.it'); await B.accedi(T, 'ugo', 'ugo@prova.it');
      const uid = await B.uidDi(P);
      await P.evaluate(() => LM.aggiungiAzione('Dentista', null));
      await B.calmaTutti([P, T], 3000);
      const id = await P.evaluate(() => LM.load().azioni.find((a) => a.testo === 'Dentista').id);
      await P.ctx.route(FS, (r) => r.abort());
      await B.avanti(P, 2 * G);
      await riapri(P); await P.waitForTimeout(2500);
      await rinomina(P, id, 'Dentista (PC con la data sbagliata)'); await P.waitForTimeout(800);
      await B.avanti(P, -2 * G);
      await P.ctx.unroute(FS);
      await riapri(P); await B.calmaTutti([P, T], 4000);
      await rinomina(T, id, 'Dentista giovedì (telefono, dopo)');
      await B.calmaTutti([P, T], 4000); await riapri(P); await riapri(T); await B.calmaTutti([P, T], 4000);
      const b = { pc: await testo(P, id), telefono: await testo(T, id) };
      b.cloud = (((await N.stato(uid)) || {}).azioni || []).filter((x) => x.id === id).map((x) => x.testo)[0];
      R.ok('B02.B1 orologio del PC rimesso giusto: la modifica fatta dopo sul telefono vince, ovunque', Object.values(b).every((v) => /giovedì/.test(v || '')), b);
      /* e lo stesso PC, adesso con l'orologio giusto, la cambia ancora */
      await rinomina(P, id, 'Dentista spostato a venerdì (PC, orologio giusto)');
      const subito = await testo(P, id);
      await B.calmaTutti([P, T], 4000); await B.calmaTutti([P, T], 1000);
      const b2 = { subitoDopoLaModifica: subito, pc: await testo(P, id), telefono: await testo(T, id) };
      R.ok('B02.B2 …la modifica nuova del PC stesso resta (e non torna indietro sotto gli occhi)', Object.values(b2).every((v) => /venerdì/.test(v || '')), b2);
      const orologi = await P.evaluate((i) => { const o = LM.load().orologi || {}; const k = Object.keys(o).find((x) => x.indexOf(i) >= 0 && /testo$/.test(x)); return k ? { via: k, ora: new Date(o[k]).toISOString(), adesso: new Date(Date.now()).toISOString() } : null; }, id);
      R.nota('B02 l’orologio del campo «testo» nei dati', orologi);
      await P.ctx.close(); await T.ctx.close();
    }
  } catch (e) { R.ok('eccezione', false, String(e && e.stack || e)); }
  await chiudi();
  process.exit(R.fine() ? 1 : 0);
})();
