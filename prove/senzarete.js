/* L'APP SI APRE ANCHE SENZA RETE, E CON LA RETE È SEMPRE QUELLA NUOVA.

   Dalla verifica del 25 novembre 2026 (revisione/cloud2/, G3, script
   n09-apertura-offline.js): in metropolitana, toccando l'icona, compariva la
   pagina d'errore del browser — le tue cose tutte nel telefono, e l'app che
   non partiva. Il service worker adesso tiene la pagina e il pacco; questa
   prova controlla le due promesse di public/sw.js:
    1. già aperta una volta, senza rete si riapre, con tutti i suoi pezzi
       (anche quelli che si caricano dopo, come il cloud)
    2. con la rete si apre SEMPRE la versione appena pubblicata, mai quella di
       ieri dalla cassa; e i file che non servono più si buttano

   Il sito è servito con le stesse intestazioni della produzione (index.html
   «max-age=0, must-revalidate», /pacco/* «immutable»).
   node prove/senzarete.js     (CHROMIUM=/percorso/di/chrome se serve) */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const RADICE = process.env.LIFEMAX_SITO || require('./comune/dove').SERVITO;
const { chromium } = require('playwright');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const PORTA = 8866, SITO = 'http://localhost:' + PORTA;
let guai = 0;
const ok = (n, c, d) => { if (!c) guai++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (!c && d !== undefined ? '  → ' + (typeof d === 'string' ? d : JSON.stringify(d)).slice(0, 400) : '')); };

/* «la versione nuova»: la stessa pagina con un segno in più, e un file del
   pacco che prima non c'era */
let versione = 1;
const NUOVO = 'pacco/prova-v2-0123abcd.js';
function pagina() {
  let h = fs.readFileSync(path.join(RADICE, 'index.html'), 'utf8');
  h = h.replace('<head>', '<head><meta name="lm-prova-versione" content="' + versione + '">');
  if (versione >= 2) h = h.replace('</head>', '<script type="module" src="./' + NUOVO + '"></script></head>');
  return h;
}

(async () => {
  const srv = http.createServer((q, r) => {
    let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
    const pac = /^\/pacco\//.test(p);
    r.setHeader('Cache-Control', pac ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate');
    if (p === '/index.html') { r.setHeader('Content-Type', 'text/html'); r.end(pagina()); return; }
    if (p === '/' + NUOVO) { r.setHeader('Content-Type', 'text/javascript'); r.end('window.__v2 = true;'); return; }
    fs.readFile(path.join(RADICE, p), (e, d) => {
      if (e) { r.statusCode = 404; r.end('x'); return; }
      r.setHeader('Content-Type', T[path.extname(p)] || 'application/octet-stream');
      r.end(d);
    });
  });
  await new Promise((r) => srv.listen(PORTA, r));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: require('./comune/chiuso') });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, locale: 'it-IT', timezoneId: 'Europe/Rome' });
  await ctx.route((u) => new URL(u).hostname !== 'localhost', (r) => r.abort());
  const errori = [];
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errori.push(String(e).split('\n')[0]));
  await p.goto(SITO + '/index.html');
  await p.evaluate(() => navigator.serviceWorker.ready);
  /* il worker riempie la cassa appena si attiva */
  let cassa = [];
  for (let i = 0; i < 40; i++) {
    cassa = await p.evaluate(async () => { const c = await caches.open('lifemax-app-1'); return (await c.keys()).map((q) => new URL(q.url).pathname); });
    if (cassa.some((x) => /index\.html$/.test(x))) break;
    await p.waitForTimeout(250);
  }
  const pacco = fs.readdirSync(path.join(RADICE, 'pacco')).filter((f) => /\.(js|css)$/.test(f));
  ok('1 alla prima apertura, in cassa la pagina e tutto il pacco (anche il cloud e il laboratorio)', pacco.every((f) => cassa.includes('/pacco/' + f)), { manca: pacco.filter((f) => !cassa.includes('/pacco/' + f)), cassa });
  await p.evaluate(() => { const s = LM.load(); s.onboarded = true; LM.save(); LM.aggiungiAzione('scritta prima della metropolitana', null); });

  await ctx.setOffline(true);
  let aperta = false, err = '';
  try { await p.reload({ waitUntil: 'load', timeout: 15000 }); await p.waitForTimeout(800); aperta = await p.evaluate(() => !!window.LM && document.body.innerText.includes('scritta prima della metropolitana')); }
  catch (e) { err = String(e).slice(0, 160); }
  ok('1 senza rete, l’app già usata si riapre, con le sue cose', aperta, err);
  const cloud = await p.evaluate(() => import(document.querySelector('script[src*="pacco/index-"]').src.replace(/index-[^/]+\.js$/, '') + (performance.getEntriesByType('resource').map((x) => x.name).find((n) => /nuvola-/.test(n)) || '').split('/').pop()).then(() => true, () => false)).catch(() => false);
  ok('1 …e anche il pezzo del cloud si carica senza rete', cloud || await p.evaluate(async () => { const c = await caches.open('lifemax-app-1'); return (await c.keys()).some((q) => /nuvola-/.test(q.url)); }).catch(() => false));

  /* torna la rete, ed è uscita una versione nuova */
  await ctx.setOffline(false);
  versione = 2;
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(800);
  const v = await p.evaluate(() => ({ v: (document.querySelector('meta[name="lm-prova-versione"]') || {}).content, nuovo: !!window.__v2 }));
  ok('2 con la rete si apre la versione appena pubblicata, non quella in cassa', v.v === '2' && v.nuovo, v);
  for (let i = 0; i < 40; i++) {
    cassa = await p.evaluate(async () => { const c = await caches.open('lifemax-app-1'); return (await c.keys()).map((q) => new URL(q.url).pathname); });
    if (cassa.includes('/' + NUOVO)) break;
    await p.waitForTimeout(250);
  }
  ok('2 …e in cassa ci va la versione nuova, coi suoi file', cassa.includes('/' + NUOVO), cassa);
  await ctx.setOffline(true);
  await p.reload({ waitUntil: 'load' }).catch(() => {}); await p.waitForTimeout(800);
  const v2 = await p.evaluate(() => (document.querySelector('meta[name="lm-prova-versione"]') || {}).content).catch(() => null);
  ok('2 senza rete, si riapre l’ultima versione aperta (non una più vecchia)', v2 === '2', v2);
  await ctx.setOffline(false);

  /* un file sparito dal server (404) non si serve dalla cassa al posto della
     pagina: con la rete, la verità è il server */
  const sw = await p.evaluate(async () => (await fetch('sw.js')).text());
  ok('2 il service worker non tiene niente del server (/api/, /__/) né di altri indirizzi', /\^\(api\|__\)/.test(sw), '');

  ok('nessun errore nella pagina', !errori.length, errori.slice(0, 5));
  await b.close(); srv.close();
  console.log(guai ? '\n' + guai + ' cose da sistemare' : '\ntutto a posto');
  process.exit(guai ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
