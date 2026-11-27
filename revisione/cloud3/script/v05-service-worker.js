/* V05 — G3 RILETTO DA AVVERSARIO: il service worker (sw.js, cassa 'lifemax-app-1').
   Verifica 3. Sito servito con le intestazioni della produzione, service worker
   attivo, emulatore separato, gstatic finto (lib.js).
     A  «rete che finge di esserci» (metro, treno: il server non risponde mai
        alla pagina): l'app si apre dalla cassa entro 15 s?
     B  senza rete, le parti che si caricano dopo (il Laboratorio, il cloud)
        ci sono?
     C  con la rete, dopo una pubblicazione nuova, si vede SEMPRE la nuova
        (una ricarica sola)
   node v05-service-worker.js */
'use strict';
const L = require('./lib');
const http = require('http'), fs = require('fs'), path = require('path');
const PORTA = L.PORTA + 7;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
let appesa = false, versione = 1;
(async () => {
  const srv = http.createServer((q, r) => {
    let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
    if (appesa && p === '/index.html') return; /* non risponde mai */
    fs.readFile(path.join(L.RADICE, p), (e, d) => {
      if (e) { r.statusCode = 404; r.end('x'); return; }
      if (p === '/index.html' && versione > 1) d = Buffer.from(String(d).replace('<head>', '<head><meta name="lm-v" content="' + versione + '">'));
      r.setHeader('Content-Type', T[path.extname(p)] || 'application/octet-stream');
      r.setHeader('Cache-Control', /^\/pacco\//.test(p) ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate');
      r.end(d);
    });
  });
  await new Promise((ok) => srv.listen(PORTA, ok));
  await L.avvia(); await L.pulisciTutto();

  const ctx = await L.contesto({ tipo: 'iphone', sw: true });
  const A = await L.dispositivo('iphone-pwa', { ctx, porta: PORTA });
  await L.accedi(A, 'pia', 'pia@prova.it');
  await A.evaluate(() => LM.aggiungiAzione('scritta ieri', null)); await L.calma(A, 1500);
  await A.reload(); await A.waitForTimeout(2500); /* la pagina entra in cassa */
  const cassa = await A.evaluate(async () => { const c = await caches.open('lifemax-app-1'); return (await c.keys()).map((k) => k.url.replace(location.origin + '/', '')); });

  /* A: rete che non risponde */
  appesa = true;
  const t0 = Date.now(); let apertaA = false, errA = '';
  try { await A.reload({ waitUntil: 'load', timeout: 15000 }); apertaA = await A.evaluate(() => !!window.LM).catch(() => false); } catch (e) { errA = String(e).split('\n')[0].slice(0, 140); }
  L.esito('A1 [G3] rete che finge di esserci (la pagina non risponde): l’app si apre dalla cassa entro 15 s', apertaA, { secondi: Math.round((Date.now() - t0) / 1000), errore: errA, cassa });
  appesa = false;
  await A.goto('http://127.0.0.1:' + PORTA + '/index.html').catch(() => {}); await A.waitForTimeout(2000);

  /* B: senza rete, il Laboratorio */
  await ctx.setOffline(true);
  let apertaB = false;
  try { await A.reload({ waitUntil: 'load', timeout: 15000 }); apertaB = await A.evaluate(() => !!window.LM); } catch (e) { /* niente */ }
  const errori = []; A.on('pageerror', (e) => errori.push(String(e).slice(0, 160)));
  await A.evaluate(() => { location.hash = '#/lab'; }).catch(() => {}); await A.waitForTimeout(2500);
  const lab = await A.evaluate(() => ({ testo: (document.querySelector('main') || document.body).innerText.slice(0, 160), azioni: LM.load().azioni.map((a) => a.testo) })).catch((e) => ({ e: String(e) }));
  await L.foto(A, 'v05-b-laboratorio-senza-rete');
  L.esito('B1 senza rete l’app si apre con i dati', apertaB && (lab.azioni || []).includes('scritta ieri'), lab);
  L.esito('B2 senza rete il Laboratorio (caricato dopo) si apre senza errori', errori.length === 0, { errori, lab: lab.testo });
  await ctx.setOffline(false); await A.waitForTimeout(3000);

  /* C: pubblicazione nuova, con la rete: una ricarica basta */
  versione = 2;
  /* una navigazione vera (un goto che cambia solo il # non ricarica) */
  await A.reload({ waitUntil: 'load' }); await A.waitForTimeout(1500);
  const v = await A.evaluate(() => { const m = document.querySelector('meta[name="lm-v"]'); return m ? m.content : '1'; });
  L.esito('C1 con la rete, dopo una pubblicazione nuova, una ricarica mostra la nuova', v === '2', v);

  /* D: la stessa domanda in un contesto che non è mai stato «offline» (la
     modalità offline di Playwright può restare appiccicata al service worker) */
  versione = 1;
  const ctx2 = await L.contesto({ tipo: 'pc', sw: true });
  const D = await L.dispositivo('pc-pwa', { ctx: ctx2, porta: PORTA });
  await D.waitForTimeout(1500); await D.reload(); await D.waitForTimeout(2000);
  const controllato = await D.evaluate(() => !!(navigator.serviceWorker && navigator.serviceWorker.controller));
  versione = 3;
  await D.reload({ waitUntil: 'load' }); await D.waitForTimeout(1000);
  const v1 = await D.evaluate(() => { const m = document.querySelector('meta[name="lm-v"]'); return m ? m.content : '1'; });
  await D.reload({ waitUntil: 'load' }); await D.waitForTimeout(1000);
  const v2 = await D.evaluate(() => { const m = document.querySelector('meta[name="lm-v"]'); return m ? m.content : '1'; });
  L.esito('D1 (contesto mai offline) dopo una pubblicazione nuova, la prima ricarica con la rete mostra la nuova', controllato && v1 === '3', { serviceWorker: controllato, primaRicarica: v1, secondaRicarica: v2 });
  L.salvaRisultati('v05-service-worker'); await L.browser().close(); srv.close(); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
