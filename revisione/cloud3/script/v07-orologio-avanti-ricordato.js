/* V07 — M7 RILETTO DA AVVERSARIO: l'ultima ora vista adesso si RICORDA
   (`lm-ultimo-istante`, src/dati/dati.ts) e l'orologio logico «non si riporta
   indietro». Domanda: un orologio andato AVANTI per sbaglio una volta sola
   (qui: +400 giorni, aperto mentre il cloud non risponde) avvelena il
   dispositivo anche DOPO che l'orologio è stato rimesso giusto e misurato?
   Se sì, per 400 giorni ogni modifica fatta lì vince su quelle fatte DOPO
   sugli altri dispositivi.
   Si può far girare anche sul codice di prima (RADICE=.../wt-1548) per il
   confronto. Emulatore separato; niente rete vera.
   node v07-orologio-avanti-ricordato.js */
'use strict';
const L = require('./lib');
const G = 86400000;
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();
  const P = await L.dispositivo('pc', { tipo: 'pc' }), T = await L.dispositivo('telefono', { tipo: 'iphone' });
  for (const d of [P, T]) await d.evaluate(() => { const s = LM.load(); s.onboarded = true; LM.save(); });
  await L.accedi(P, 'olga', 'olga@prova.it'); await L.accedi(T, 'olga', 'olga@prova.it');
  await P.evaluate(() => { LM.aggiungiAzione('Riunione', null); LM.aggiungiAzione('Altra cosa', null); });
  await L.calmaTutti([P, T], 3000);
  const id = await P.evaluate(() => LM.load().azioni.find((a) => a.testo === 'Riunione').id);

  /* 1. il PC apre con l'orologio avanti di 400 giorni mentre il cloud non risponde, e scrive */
  const blocca = (r) => r.abort();
  await P.ctx.route('http://127.0.0.1:' + L.FSP + '/**', blocca);
  await L.avanti(P, 400 * G);
  await L.riapri(P); await P.waitForTimeout(2500);
  await P.evaluate(() => { const a = LM.load().azioni.find((x) => x.testo === 'Altra cosa'); LM.rinominaAzione ? LM.rinominaAzione(a.id, 'Altra cosa (dal pc)') : (a.testo = 'Altra cosa (dal pc)', LM.save()); });
  await P.waitForTimeout(800);
  const istante = await P.evaluate(() => Number(localStorage.getItem('lm-ultimo-istante')) || 0);

  /* 2. l'orologio torna giusto, il cloud risponde, il PC riapre e misura */
  await L.avanti(P, -400 * G);
  await P.ctx.unroute('http://127.0.0.1:' + L.FSP + '/**', blocca);
  await L.riapri(P); await L.calmaTutti([P, T], 4000);
  const scarto = await P.evaluate(() => localStorage.getItem('lm-scarto-orologio'));

  /* 3. il PC rinomina «Riunione»; DUE MINUTI DOPO il telefono la rinomina di nuovo */
  const rinomina = (d, t) => d.evaluate(([i, x]) => { const a = LM.load().azioni.find((y) => y.id === i); if (LM.rinominaAzione) LM.rinominaAzione(i, x); else { a.testo = x; LM.save(); } }, [id, t]);
  await rinomina(P, 'Riunione (scritto dal PC alle 10:00)');
  await L.calmaTutti([P, T], 3000);
  await T.waitForTimeout(2000);
  await rinomina(T, 'Riunione (scritto dal telefono alle 10:02)');
  await L.calmaTutti([P, T], 4000);
  await L.riapri(P); await L.riapri(T); await L.calmaTutti([P, T], 4000);
  const fine = { pc: await P.evaluate((i) => LM.load().azioni.find((a) => a.id === i).testo, id), telefono: await T.evaluate((i) => LM.load().azioni.find((a) => a.id === i).testo, id) };
  const uid = await L.uidDi(P); const c = await L.docCloud(uid);
  fine.cloud = ((c.stato && c.stato.azioni) || []).filter((a) => a.id === id).map((a) => a.testo)[0];
  L.esito('V07.0 condizioni: il PC ha scritto con l’orologio avanti, poi l’orologio è stato rimesso e rimisurato', istante > Date.now() + 300 * G, { ultimoIstanteRicordato: new Date(istante).toISOString(), scartoDopo: scarto });
  L.esito('V07.1 [M7, regressione?] la modifica fatta DOPO (telefono, 10:02) vince su quella fatta prima (PC, 10:00), su tutti', fine.pc === fine.telefono && /telefono/.test(fine.telefono) && /telefono/.test(fine.cloud || ''), fine);
  L.salvaRisultati('v07-orologio-avanti-ricordato' + (process.env.ETICHETTA ? '-' + process.env.ETICHETTA : ''));
  await L.browser().close(); srv.close(); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
