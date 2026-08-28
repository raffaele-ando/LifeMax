/* DIECI LARGHEZZE, DAL TELEFONO PICCOLO AL TABLET.

   Nasce da «ci sono problemi se la schermata/sotto è troppo stretto» e dalla
   barra in basso che su un tablet finiva in mezzo allo schermo.

   Le altre prove guardano tre larghezze: 320, 390 e 1280. In mezzo c'è tutta
   la fascia dei tablet — 768, 810, 834, 1024, 1180 — che non guardava nessuno,
   ed è la fascia dove le cose si rompono in modo silenzioso: la pagina diventa
   più larga del display, il browser la mostra RIMPICCIOLITA per farcela stare,
   e da quel momento tutto quello che sta agganciato al riquadro d'impianto —
   la barra in basso, per esempio — si stacca da quello che si vede. La barra
   finisce in mezzo allo schermo e sembra bloccata lì.

   Il controllo è uno solo, e vale per tutte: la pagina non deve MAI essere
   più larga della finestra. Quando lo è, la prova dice anche chi sporge, e
   salta chi ha diritto di farlo — quello che sta dentro un contenitore che
   scorre da sé (il calendario del mese, le fasce orarie), quello che è
   decorazione senza eventi del puntatore, e quello che è fissato al riquadro.

   node prove/larghezze.js        (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const LARGHEZZE = [320, 360, 390, 412, 768, 810, 834, 1024, 1180, 1280];
const VIE = ['oggi', 'giornata', 'rituali', 'inbox', 'plancia', 'esperimenti', 'scienza'];
let fail = 0;
const ok = (n, c, d) => { if (!c) fail++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

const CHI_SPORGE = `(() => {
  const largo = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  const fuori = [];
  if (largo > innerWidth + 1) {
    document.querySelectorAll('*').forEach((e) => {
      const r = e.getBoundingClientRect();
      if (r.width <= 0 || r.right <= innerWidth + 1) return;
      /* chi sta dentro qualcosa che scorre in orizzontale ha diritto di
         sporgere: e' proprio il suo mestiere */
      let a = e.parentElement, scorre = false;
      while (a && a !== document.body) {
        if (/auto|scroll/.test(getComputedStyle(a).overflowX)) { scorre = true; break; }
        a = a.parentElement;
      }
      const cs = getComputedStyle(e);
      if (scorre || cs.position === 'fixed' || cs.pointerEvents === 'none') return;
      fuori.push((e.tagName + '.' + (e.className || '')).slice(0, 52) + ' fino a ' + Math.round(r.right));
    });
  }
  return { largo: largo, finestra: innerWidth, fuori: fuori.slice(0, 3) };
})()`;

(async () => {
  const srv = http.createServer((q, r) => {
    let u = decodeURIComponent(q.url.split('?')[0]); if (u === '/') u = '/index.html';
    fs.readFile(path.join(RADICE, u), (e, d) => {
      if (e) { r.statusCode = 404; r.end('x'); return; }
      r.setHeader('Content-Type', T[path.extname(u)] || 'application/octet-stream'); r.end(d);
    });
  });
  await new Promise(r => srv.listen(8768, r));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

  console.log('LA PAGINA NON È MAI PIÙ LARGA DELLA FINESTRA');
  for (const W of LARGHEZZE) {
    const ctx = await b.newContext({ viewport: { width: W, height: 1024 }, hasTouch: W < 1100, isMobile: W < 900 });
    const p = await ctx.newPage();
    await p.goto('http://localhost:8768/index.html'); await p.waitForTimeout(300);
    await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
    let peggio = null;
    for (const v of VIE) {
      await p.evaluate((x) => { location.hash = '#/' + x; }, v);
      await p.waitForTimeout(420);
      const r = await p.evaluate(CHI_SPORGE);
      if (r.largo > r.finestra + 1 && (!peggio || r.largo > peggio.largo)) peggio = Object.assign({ v: v }, r);
    }
    ok(W + 'px', !peggio,
      peggio ? 'la pagina è larga ' + peggio.largo + ' su ' + peggio.finestra + ' («' + peggio.v + '»): ' + peggio.fuori.join(' | ') : '');
    await ctx.close();
  }

  /* LA BARRA IN BASSO STA IN FONDO A QUELLO CHE SI VEDE.
     Il riquadro visibile e quello d'impianto si separano quando la pagina
     viene mostrata rimpicciolita o ingrandita: un browser guidato non lo sa
     fare, e allora si prova il MECCANISMO, che è quello che si e' rotto — che
     la barra legga `--vv-giu`, e che quel numero lo scriva davvero qualcuno. */
  console.log('\nLA BARRA IN BASSO SEGUE IL FONDO VISIBILE');
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    await p.goto('http://localhost:8768/index.html'); await p.waitForTimeout(600);
    const r = await p.evaluate(() => {
      const t = document.querySelector('.tabbar');
      const cs = t ? getComputedStyle(t) : null;
      return {
        regola: [...document.styleSheets].some((f) => {
          try { return [...f.cssRules].some((x) => (x.cssText || '').indexOf('--vv-giu') >= 0 || [...(x.cssRules || [])].some((y) => (y.cssText || '').indexOf('--vv-giu') >= 0)); }
          catch (e) { return false; }
        }),
        scritto: document.documentElement.style.getPropertyValue('--vv-giu'),
        fondo: cs ? cs.bottom : null,
        fisso: cs ? cs.position : null
      };
    });
    ok('la barra è agganciata e sta in fondo', r.fisso === 'fixed', r.fisso + ' · ' + r.fondo);
    ok('e il suo fondo passa da «--vv-giu»', r.regola === true,
      r.regola ? 'il foglio la nomina' : 'la regola non la nomina: la barra non seguirebbe niente');
    ok('e qualcuno quel numero lo scrive', r.scritto !== '',
      r.scritto ? 'adesso vale ' + r.scritto : 'nessuno lo scrive: resterebbe al valore di scorta');
    await ctx.close();
  }

  await b.close(); srv.close();
  console.log(fail ? '\n>>> ' + fail + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
  process.exit(fail ? 1 : 0);
})();
