/* N09 — APRIRE L'APP SENZA RETE (metropolitana, aereo, montagna).
   Il sito è servito con le STESSE intestazioni di cache della produzione
   (Cloudflare: index.html «max-age=0, must-revalidate»; /pacco/* «immutable»;
   gstatic con cache lunga) e il service worker attivo, come sul telefono.
   A. app già aperta ieri, oggi riaperta (ricaricata) senza rete: si apre?
   B. app aperta con rete ma SENZA l'SDK di Firebase (gstatic irraggiungibile o lento):
      quando la rete torna, la sincronizzazione riparte da sola?
   C. le modifiche fatte in B arrivano agli altri dispositivi, e quando?
   node n09-apertura-offline.js */
const L = require('./lib');
const http = require('http'), fs = require('fs'), path = require('path');
const PORTA = L.PORTA + 5;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
(async () => {
  const srv = http.createServer((q, r) => {
    let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
    fs.readFile(path.join(L.RADICE, p), (e, d) => {
      if (e) { r.statusCode = 404; r.end('x'); return; }
      r.setHeader('Content-Type', T[path.extname(p)] || 'application/octet-stream');
      r.setHeader('Cache-Control', /^\/pacco\//.test(p) ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate');
      r.setHeader('ETag', '"' + d.length + '"');
      r.end(d);
    });
  });
  await new Promise((ok) => srv.listen(PORTA, ok));
  await L.avvia(); await L.pulisciTutto();

  /* A */
  const ctx = await L.contesto({ tipo: 'iphone', sw: true });
  const A = await L.dispositivo('iphone-pwa', { ctx, porta: PORTA });
  await L.accedi(A, 'otto', 'otto@prova.it');
  await A.evaluate(() => LM.aggiungiAzione('ieri', null)); await L.calma(A, 1500);
  const sw = await A.evaluate(() => navigator.serviceWorker && navigator.serviceWorker.controller ? 'attivo' : 'nessuno');
  await ctx.setOffline(true);
  let aperta = false, errore = '';
  try { await A.reload({ waitUntil: 'load', timeout: 15000 }); aperta = await A.evaluate(() => !!window.LM).catch(() => false); } catch (e) { errore = String(e).slice(0, 120); }
  await L.foto(A, 'n09-a-riaperta-senza-rete');
  L.esito('A1 l’app (già usata) riaperta SENZA rete si apre', aperta, { serviceWorker: sw, errore, testoPagina: (await A.evaluate(() => document.body && document.body.innerText.slice(0, 120)).catch(() => '?')) });
  await ctx.setOffline(false);

  /* B: si apre con la rete ma l'SDK di Firebase non arriva (gstatic giù / rete che va e viene) */
  const ctxB = await L.contesto({ tipo: 'android' });
  const B0 = await L.dispositivo('android', { ctx: ctxB, porta: PORTA });
  await L.accedi(B0, 'otto', 'otto@prova.it'); await L.calma(B0, 1000);
  ctxB.__sdkKo = true;
  await B0.reload(); await B0.waitForTimeout(3000);
  const b1 = await B0.evaluate(() => ({ cloud: window.LM_AUTH && window.LM_AUTH.available, utente: !!(window.LM_AUTH && window.LM_AUTH.user) }));
  await B0.evaluate(() => LM.aggiungiAzione('scritta mentre il cloud non si era caricato', null));
  ctxB.__sdkKo = false;
  await B0.evaluate(() => { window.dispatchEvent(new Event('online')); document.dispatchEvent(new Event('visibilitychange')); });
  await B0.waitForTimeout(8000);
  const b2 = await B0.evaluate(() => ({ cloud: window.LM_AUTH && window.LM_AUTH.available, utente: !!(window.LM_AUTH && window.LM_AUTH.user), pastiglia: !!document.getElementById('lm-non-ancora'), sync: window.LM_SYNC && window.LM_SYNC.state }));
  await L.foto(B0, 'n09-b-sdk-non-caricato');
  const P = await L.dispositivo('pc', { tipo: 'pc', porta: PORTA }); await L.accedi(P, 'otto', 'otto@prova.it'); await L.calma(P, 2000);
  const arrivata = (await L.testi(P)).includes('scritta mentre il cloud non si era caricato');
  L.esito('B1 SDK di Firebase non caricato all’apertura: quando torna, il cloud riparte da solo (senza chiudere l’app)', b2.cloud === true, { allApertura: b1, dopoRitornoRete: b2 });
  L.esito('B2 …e l’app dice che c’è qualcosa «non ancora nel cloud»', b2.pastiglia || b2.sync === 'attesa', b2);
  L.esito('C1 la modifica fatta in quel momento arriva agli altri senza riaprire l’app', arrivata, await L.testi(P));
  await B0.reload(); await L.calmaTutti([B0, P], 4000);
  L.esito('C2 riaprendo l’app (con l’SDK), la modifica arriva', (await L.testi(P)).includes('scritta mentre il cloud non si era caricato'));

  L.salvaRisultati('n09-apertura-offline'); await L.browser().close(); srv.close(); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
