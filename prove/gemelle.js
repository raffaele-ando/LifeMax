/* LE DUE GEMELLE — la schermata di React è identica a quella di prima?

   Questa prova non guarda se React «funziona»: guarda se si vede la STESSA
   COSA. Disegna la schermata col codice di prima, si prende il DOM; la
   ridisegna con React, si riprende il DOM; e confronta.

   Perché serve uno strumento e non un'occhiata. Una differenza di una classe
   su una riga di elenco non si vede in una fotografia, ma il giorno che
   qualcuno cambia il CSS quella riga si comporta diversamente da tutte le
   altre — ed è il tipo di difetto che poi costa giorni. «Identica» deve
   essere una misura.

   Cosa confronta, in ordine di quanto conta:
     1. l'albero: quali tag, annidati come, in che ordine
     2. le classi di ogni elemento
     3. il testo che si legge
     4. gli id e i data- da cui dipendono i comandi
   Non confronta gli stili calcolati: quelli vengono dalle classi, e se le
   classi combaciano vengono uguali per costruzione.

   node prove/gemelle.js            tutte le schermate convertite
   node prove/gemelle.js inbox      una sola                                */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..'), PORTA = 8799;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

let guai = 0;
const ok = (n, c, d) => { if (!c) guai++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

/* L'IMPRONTA DI UN ALBERO. Si scende in profondità e si scrive una riga per
   elemento: tag, classi ordinate, id, i data-, e il testo proprio (non quello
   dei figli, se no ogni testo comparirebbe a ogni livello). */
const IMPRONTA = `(function (radice) {
  function testoProprio(e) {
    var t = '';
    for (var i = 0; i < e.childNodes.length; i++) {
      var n = e.childNodes[i];
      if (n.nodeType === 3) t += n.nodeValue;
    }
    return t.replace(/\\s+/g, ' ').trim();
  }
  var out = [];
  function scendi(e, liv) {
    if (!e || e.nodeType !== 1) return;
    /* dentro a un <svg> non si guarda: i disegni li fa icons.js, che è lo
       stesso di qua e di là, e i suoi nodi interni sono decine per icona */
    var tag = e.tagName.toLowerCase();
    var cl = (e.getAttribute('class') || '').trim().split(/\\s+/).filter(Boolean).sort().join('.');
    var dati = [];
    for (var i = 0; i < e.attributes.length; i++) {
      var a = e.attributes[i];
      /* i data-forma-* non sono markup: sono gli appunti che forma.js si
         prende mentre lavora (misure, «questa l'ho gia fatta», «questa e
         secca»). Cambiano a seconda di QUANDO gira rispetto al disegno, non
         di che cosa e stato disegnato. I data- che contano sono quelli da cui
         dipendono i comandi.
         NIENTE APICI ROVESCI QUI DENTRO: questo pezzo vive dentro a un
         template literal, e un apice rovescio lo chiude. */
      if (a.name.indexOf('data-') === 0 && a.name.indexOf('data-forma') !== 0) dati.push(a.name + '=' + a.value);
    }
    out.push(liv + '|' + tag + '|' + cl + '|' + (e.id || '') + '|' + dati.sort().join(',') + '|' + testoProprio(e));
    if (tag === 'svg') return;
    for (var j = 0; j < e.children.length; j++) scendi(e.children[j], liv + 1);
  }
  for (var k = 0; k < radice.children.length; k++) scendi(radice.children[k], 0);
  return out;
})(document.getElementById('vista'))`;

(async () => {
  const srv = http.createServer((q, r) => {
    let u = decodeURIComponent(q.url.split('?')[0]); if (u === '/') u = '/index.html';
    fs.readFile(path.join(RADICE, u), (e, d) => {
      if (e) { r.statusCode = 404; r.end('x'); return; }
      r.setHeader('Content-Type', T[path.extname(u)] || 'application/octet-stream'); r.end(d);
    });
  });
  await new Promise((r) => srv.listen(PORTA, r));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  const err = []; p.on('pageerror', (e) => err.push('' + e));
  /* la stessa ora e gli stessi dati nei due giri, se no si confrontano due
     giornate diverse invece di due disegni */
  await p.addInitScript((t) => {
    const D = Date;
    class F extends D { constructor(...a) { if (!a.length) super(t); else super(...a); } static now() { return t; } }
    window.Date = F;
  }, new Date('2026-08-18T10:30:00').getTime());

  await p.goto('http://localhost:' + PORTA + '/index.html'); await p.waitForTimeout(300);
  await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });

  /* quali schermate ci sono da confrontare: lo dice l'isola */
  await p.evaluate(() => { const s = LM.load(); s.profilo.react = true; LM.save(); });
  await p.reload(); await p.waitForTimeout(1200);
  const quali = process.argv[2]
    ? [process.argv[2]]
    : await p.evaluate(() => (window.LM_REACT && window.LM_REACT.schermi) || []);

  if (!quali.length) {
    console.log('  --  nessuna schermata convertita: niente da confrontare');
    console.log('\n>>> PROVA SALTATA');
    await b.close(); srv.close(); process.exit(0);
  }

  for (const via of quali) {
    console.log('\nSCHERMATA «' + via + '»');
    /* --- il giro col codice di prima --- */
    await p.evaluate(() => { const s = LM.load(); s.profilo.react = false; LM.save(); });
    await p.evaluate((v) => { location.hash = '#/' + v; }, via);
    await p.reload(); await p.waitForTimeout(900);
    const vecchia = await p.evaluate(IMPRONTA);

    /* --- e quello con React --- */
    await p.evaluate(() => { const s = LM.load(); s.profilo.react = true; LM.save(); });
    await p.reload(); await p.waitForTimeout(1400);
    const nuova = await p.evaluate(IMPRONTA);

    ok('l’albero ha lo stesso numero di elementi', vecchia.length === nuova.length,
      vecchia.length + ' prima, ' + nuova.length + ' dopo');

    /* la prima differenza è quella che conta: le altre di solito sono la sua
       eco, e un elenco di trecento righe non lo legge nessuno */
    const quante = Math.min(vecchia.length, nuova.length);
    const diverse = [];
    for (let i = 0; i < quante; i++) if (vecchia[i] !== nuova[i]) diverse.push(i);
    ok('e ogni elemento combacia', diverse.length === 0,
      diverse.length ? diverse.length + ' righe diverse' : 'tutte uguali');
    if (diverse.length) {
      console.log('      le prime tre differenze, prima → dopo:');
      diverse.slice(0, 3).forEach((i) => {
        console.log('        prima: ' + vecchia[i]);
        console.log('        dopo:  ' + nuova[i]);
      });
      if (vecchia.length !== nuova.length) {
        const piu = vecchia.length > nuova.length ? vecchia : nuova;
        console.log('      e ' + (piu === vecchia ? 'di là' : 'di qua') + ' ce ne sono altre, la prima è:');
        console.log('        ' + piu[quante]);
      }
    }
  }
  ok('nessun errore in pagina', err.length === 0, [...new Set(err)].slice(0, 2).join(' · '));

  await b.close(); srv.close();
  console.log(guai ? '\n>>> ' + guai + (guai === 1 ? ' PROBLEMA' : ' PROBLEMI') : '\n>>> TUTTO A POSTO');
  process.exit(guai ? 1 : 0);
})();
