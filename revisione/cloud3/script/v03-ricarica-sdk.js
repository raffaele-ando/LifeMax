/* V03 — M6 RILETTO DA AVVERSARIO: la ricarica automatica quando l'SDK torna.
   Verifica 3. Due domande:
     A  chi sta scrivendo la review della sera (testo scritto, poi tocca le
        stelline: il fuoco va su un BOTTONE, non su un campo) perde quello che
        ha scritto quando la rete torna e l'app si ricarica da sola?
     B  se l'SDK non parte per una ragione che non è la rete (qui: il modulo
        di Firestore che il browser non riesce a usare, come un browser vecchio
        o un filtro che blocca solo quel file) mentre gstatic risponde, l'app
        si ricarica da sola ogni minuto, per sempre?
   Emulatore separato; gstatic finto (lib.js); niente rete vera.
   node v03-ricarica-sdk.js */
'use strict';
const L = require('./lib');
const TESTO = 'Oggi ho finito il capitolo 3 senza distrazioni';
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();

  /* ------------------------------------------------------------ A */
  const ctx = await L.contesto({ tipo: 'iphone' });
  const P = await L.dispositivo('telefono', { ctx });
  await P.evaluate(() => { const s = LM.load(); s.onboarded = true; s.profilo.nome = 'Sara'; LM.save(); });
  await L.accedi(P, 'sara', 'sara@prova.it'); await L.calma(P, 1500);
  /* riapertura con gstatic che non risponde (rete ballerina all'apertura) */
  ctx.__sdkKo = true;
  await L.riapri(P); await P.waitForTimeout(2500);
  const senza = await P.evaluate(() => !!(window.LMCloud && window.LMCloud.available));
  await P.evaluate(() => { location.hash = '#/rituali'; }); await P.waitForTimeout(700);
  await P.evaluate(() => { const b = document.querySelector('[data-rit="sera"] button'); if (b && b.getAttribute('aria-expanded') !== 'true') b.click(); }).catch(() => {}); await P.waitForTimeout(700);
  const campo = await P.$('#sera-vittoria');
  if (campo) { await campo.click(); await P.keyboard.type(TESTO, { delay: 5 }); }
  /* tocco su una stellina: il campo perde il fuoco (su iPhone un bottone
     toccato non prende il fuoco: resta BODY; altrove va al bottone) */
  await P.evaluate(() => { const b = document.querySelector('.voto-area button'); if (b) { b.scrollIntoView(); b.focus(); b.click(); } });
  await P.waitForTimeout(300);
  const prima = await P.evaluate(() => ({ campo: (document.getElementById('sera-vittoria') || {}).value || null, fuoco: document.activeElement && document.activeElement.tagName, salvato: !!LM.load().reviewSera[LM.todayKey()] }));
  await L.foto(P, 'v03-a-review-scritta-prima-della-rete');
  /* torna la rete */
  ctx.__sdkKo = false;
  let ricaricata = false;
  P.once('load', () => { ricaricata = true; });
  await P.evaluate(() => window.dispatchEvent(new Event('online')));
  await P.waitForTimeout(6000);
  await P.evaluate(() => { location.hash = '#/rituali'; }).catch(() => {}); await P.waitForTimeout(500);
  await P.evaluate(() => { const b = document.querySelector('[data-rit="sera"] button'); if (b && b.getAttribute('aria-expanded') !== 'true') b.click(); }).catch(() => {}); await P.waitForTimeout(700);
  const dopo = await P.evaluate(() => ({ campo: (document.getElementById('sera-vittoria') || {}).value || '', salvato: !!LM.load().reviewSera[LM.todayKey()], cloud: !!(window.LMCloud && window.LMCloud.available) })).catch((e) => ({ e: String(e) }));
  await L.foto(P, 'v03-a-dopo-la-ricarica-automatica');
  L.esito('A0 condizioni: cloud spento all’apertura, testo scritto, fuoco su una stellina (non su un campo)', !senza && prima.campo === TESTO && !/INPUT|TEXTAREA|SELECT/.test(prima.fuoco || '') && !prima.salvato, Object.assign({ cloudAllApertura: senza }, prima));
  L.esito('A1 [M6] tornata la rete, quello che stavi scrivendo nella review della sera NON si perde', !ricaricata || dopo.campo === TESTO || dopo.salvato, { ricaricata, dopo });
  await ctx.close();

  /* ------------------------------------------------------------ B */
  const ctx2 = await L.contesto({ tipo: 'pc' });
  /* il modulo di Firestore arriva ma il browser non riesce a usarlo; gli
     altri due sì, e gstatic risponde (route aggiunta dopo: vince lei) */
  await ctx2.route(/firebase-firestore\.js$/, (r) => r.fulfill({ status: 200, contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' }, body: 'export const x = ;' }));
  const Q = await L.dispositivo('pc', { ctx: ctx2 });
  let caricamenti = 0;
  Q.on('load', () => { caricamenti++; });
  const t0 = Date.now();
  await Q.waitForTimeout(200000);
  const durata = Math.round((Date.now() - t0) / 1000);
  const reg = await Q.evaluate(() => (window.LMLog && window.LMLog.righe ? window.LMLog.righe() : []).filter((r) => /SDK|ricarico/i.test(JSON.stringify(r))).length).catch(() => -1);
  L.esito('B1 [M6] un SDK che non parte per una ragione che non è la rete NON fa ricaricare la pagina ogni minuto', caricamenti <= 1, { ricaricamentiIn: durata + ' s', ricaricamenti: caricamenti, righeRegistro: reg });
  await ctx2.close();

  L.salvaRisultati('v03-ricarica-sdk');
  await L.browser().close(); srv.close(); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
