/* Il contrasto del testo, su tutta l'app e nei due temi.
   Nasce da un errore che l'occhio non vede: scritto `var(--inchiostro)` al
   posto di `var(--inchiostro-1)`, il color-mix diventa invalido e il testo
   torna al colore ereditato — grigio su bianco, cioè un colore plausibile.
   Il nome dell'area sulla schermata «Adesso» è rimasto grigio per un giro
   intero senza che si notasse, e a scoprirlo è stata una misura.

   Per ogni schermata e per ogni tema legge il colore CALCOLATO di ogni testo
   visibile e il fondo davvero dipinto sotto di lui, e pretende il minimo di
   WCAG AA: 4.5:1 per il testo normale, 3:1 per quello grande (≥24px, o ≥18.66
   se in grassetto). I colori si fanno risolvere al browser dipingendoli su un
   pixel: `getComputedStyle` restituisce i color-mix come `color(srgb …)` o
   `oklab(…)`, e leggerli con una regex dà zero.

   node prove/colori.js        (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..');
const PORTA = 8756;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' };

/* le schermate, e come ci si arriva */
const SCENE = [
  { nome: 'Oggi', vai: 'oggi' },
  { nome: 'Oggi · priorità', vai: 'oggi', prep: () => { const s = LM.load(), t = LM.todayKey();
      s.azioni = s.azioni.filter(x => x.data !== t); LM.save();
      const a = LM.aggiungiAzione('Una cosa da fare', 'finanze', { mit: true });
      a.ifThen = 'Quando succede X, allora faccio Y'; LM.save(); } },
  { nome: 'Oggi · in ritardo', ora: '16:40', vai: 'oggi' },
  { nome: 'Oggi · finita', ora: '21:00', vai: 'oggi', prep: () => { const s = LM.load(), t = LM.todayKey();
      s.azioni.filter(a => a.data === t).forEach(a => { a.done = true; a.doneAt = Date.now(); }); LM.save(); } },
  { nome: 'La giornata', vai: 'giornata' },
  { nome: 'Attività', vai: 'inbox' },
  { nome: 'Rituali', vai: 'rituali' },
  { nome: 'Andamento', vai: 'plancia' },
  { nome: 'Esperimenti', vai: 'esperimenti' },
  /* i pannelli, che prima restavano fuori: là i grigi piccoli sono più
     frequenti che nelle pagine (righe di spiegazione sotto un titolo, note
     sotto un campo) ed è proprio quella la combinazione che scivola sotto il
     minimo senza che si veda */
  { nome: 'Impostazioni', vai: 'plancia', apri: p => p.evaluate(() => {
      const b = (document.getElementById('fondo-impostazioni') || document.querySelector('[data-imp]'));
      if (b) b.click();
    }) },
  { nome: 'Promemoria', vai: 'plancia', apri: p => p.evaluate(() => {
      const b = (document.getElementById('fondo-impostazioni') || document.querySelector('[data-imp]'));
      if (b) b.click();
      const c = document.getElementById('imp-prom-come');
      if (c) c.click();
    }) }
];

/* dentro la pagina: ogni testo visibile, il suo contrasto col fondo dipinto */
const CONTRASTI = `(function () {
  var cv = document.createElement('canvas'); cv.width = cv.height = 1;
  var cx = cv.getContext('2d', { willReadFrequently: true });
  /* Un colore CSS qualunque → [r, g, b, a], alfa compresa.
     Serve dipingerlo due volte, su bianco e su nero: getComputedStyle
     restituisce i color-mix come \`color(srgb …)\` o \`oklab(…)\`, e leggerli
     con una regex dà zero; e dipingerlo una volta sola perde l'alfa, che è
     il pezzo che conta quando una pastiglia è «accento al 18%». */
  function pinta(fondo, c) {
    cx.fillStyle = fondo; cx.fillRect(0, 0, 1, 1);
    cx.fillStyle = c; cx.fillRect(0, 0, 1, 1);
    var d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2]];
  }
  function risolvi(c) {
    var b = pinta('#000', c), w = pinta('#fff', c);
    /* su bianco: c·a + 255(1−a);  su nero: c·a  ⇒  a = 1 − (w−b)/255 */
    var a = 1 - (w[0] - b[0]) / 255;
    if (a <= 0.004) return [0, 0, 0, 0];
    return [b[0] / a, b[1] / a, b[2] / a, Math.min(1, a)];
  }
  function sopra(f, s) {
    var a = f[3];
    return [f[0] * a + s[0] * (1 - a), f[1] * a + s[1] * (1 - a), f[2] * a + s[2] * (1 - a), 1];
  }
  function lum(c) {
    var v = [c[0], c[1], c[2]].map(function (x) { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  function rapporto(f, s) {
    var a = lum(f), b = lum(s);
    return Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100;
  }

  /* gli strati sotto al testo, dal più vicino al più lontano. Ogni strato è
     un elenco di colori possibili: una tinta ne ha uno, una sfumatura ne ha
     uno per fermata (e si prende il caso peggiore, perché il testo ci passa
     sopra tutta). */
  function strati(el) {
    var out = [], e = el;
    while (e) {
      var st = getComputedStyle(e);
      var bi = st.backgroundImage;
      if (bi && bi !== 'none') {
        var f = bi.match(/rgba?\\([^)]*\\)|#[0-9a-fA-F]{3,8}|\\b(?:white|black)\\b/g);
        if (f && f.length) out.push(f.slice(0, 4));
      }
      var bg = st.backgroundColor;
      if (bg && bg !== 'transparent' && !/rgba\\(0, *0, *0, *0\\)/.test(bg)) {
        var r = risolvi(bg);
        out.push([bg]);
        if (r[3] >= 0.995) break;   /* opaco: sotto non si vede più niente */
      }
      e = e.parentElement;
    }
    var radice = getComputedStyle(document.documentElement).backgroundColor;
    out.push([(radice && !/rgba\\(0, *0, *0, *0\\)/.test(radice)) ? radice : '#fff']);
    return out;
  }

  /* il fondo composto, per ogni combinazione di fermate: si parte dal fondo
     e si sovrappongono gli strati venendo verso il testo */
  function fondi(el) {
    var st = strati(el);
    var combo = [[]];
    for (var i = 0; i < st.length; i++) {
      var nuove = [];
      for (var k = 0; k < combo.length; k++) {
        for (var j = 0; j < st[i].length; j++) {
          nuove.push(combo[k].concat([st[i][j]]));
          if (nuove.length >= 12) break;   /* basta: interessa il caso peggiore, non tutti */
        }
      }
      combo = nuove;
    }
    return combo.map(function (via) {
      var acc = risolvi(via[via.length - 1]); acc[3] = 1;
      for (var i = via.length - 2; i >= 0; i--) acc = sopra(risolvi(via[i]), acc);
      return acc;
    });
  }

  var fuori = [], ammessi = [], visti = 0;
  document.querySelectorAll('body *').forEach(function (el) {
    /* solo chi ha testo proprio: se lo contasse anche il genitore, lo stesso
       testo finirebbe misurato dieci volte col colore di dieci scatole */
    var proprio = [].slice.call(el.childNodes)
      .filter(function (n) { return n.nodeType === 3 && n.textContent.trim(); })
      .map(function (n) { return n.textContent.trim(); }).join(' ');
    if (!proprio) return;
    var r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    var st = getComputedStyle(el);
    if (st.visibility === 'hidden' || +st.opacity < 0.35) return;
    if (el.closest('[hidden], .lab-demo')) return;
    var px = parseFloat(st.fontSize);
    var grosso = px >= 24 || (px >= 18.66 && parseInt(st.fontWeight, 10) >= 700);
    var minimo = grosso ? 3 : 4.5;
    /* Su un fondo di marca il testo bianco non passa: il ramo chiaro della
       sfumatura arriva a 2.3:1. È un difetto vero e sta scritto qui invece di
       essere nascosto — per sistemarlo servirebbe scurire la sfumatura di
       tutta l'app (il viola e il blu cambiano appena, #7c5df0→#7a5bf0 e
       #4a7bf5→#356bf4; il ciano diventa un turchese, #2ab8e8→#127fa3), che è
       una decisione sull'aspetto, non un ritocco. */
    var ammesso = !!el.closest('.btn-primario, .tab-catt, .eroe2-cta');
    var peggio = null;
    fondi(el).forEach(function (bg) {
      var testo = sopra(risolvi(st.color), bg);
      var rap = rapporto(testo, bg);
      if (peggio === null || rap < peggio) peggio = rap;
    });
    visti++;
    if (peggio < minimo) {
      (ammesso ? ammessi : fuori).push({ testo: proprio.slice(0, 42), cls: el.className && el.className.toString().slice(0, 30),
        px: Math.round(px * 10) / 10, peso: st.fontWeight, rap: peggio, minimo: minimo });
    }
  });
  return { visti: visti, fuori: fuori, ammessi: ammessi };
})()`;

let fail = 0;
const ok = (n, c, d) => { if (!c) fail++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

(async () => {
  const srv = http.createServer((q, r) => {
    let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
    fs.readFile(path.join(RADICE, p), (e, d) => {
      if (e) { r.statusCode = 404; r.end('x'); return; }
      r.setHeader('Content-Type', T[path.extname(p)] || 'application/octet-stream'); r.end(d);
    });
  });
  await new Promise(r => srv.listen(PORTA, r));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
  let totale = 0;
  const noti = new Set();

  for (const scuro of [false, true]) {
    console.log('\n' + (scuro ? 'TEMA SCURO' : 'TEMA CHIARO'));
    for (const s of SCENE) {
      const p = await b.newPage({ viewport: { width: 390, height: 900 }, hasTouch: true, isMobile: true,
        colorScheme: scuro ? 'dark' : 'light' });
      await p.addInitScript(t => {
        const D = Date;
        class F extends D { constructor(...a) { if (!a.length) super(t); else super(...a); } static now() { return t; } }
        window.Date = F;
      }, new Date('2026-08-18T' + (s.ora || '10:30') + ':00').getTime());
      await p.goto('http://localhost:' + PORTA + '/index.html'); await p.waitForTimeout(320);
      await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
      if (s.prep) await p.evaluate(s.prep);
      await p.evaluate(v => { location.hash = '#/' + v; }, s.vai);
      await p.reload(); await p.waitForTimeout(700);
      if (s.apri) { await s.apri(p); await p.waitForTimeout(500); }
      const r = await p.evaluate(CONTRASTI);
      totale += r.visti;
      const dillo = x => '«' + x.testo + '» ' + x.rap + ' < ' + x.minimo + ' (' + x.px + 'px/' + x.peso + (x.cls ? ' .' + x.cls : '') + ')';
      ok(s.nome.padEnd(20) + r.visti + ' testi', r.fuori.length === 0,
        r.fuori.length ? r.fuori.map(dillo).join(' | ') : 'tutti sopra il minimo');
      r.ammessi.forEach(x => noti.add(dillo(x)));
      await p.close();
    }
  }
  console.log('\n' + totale + ' testi misurati');
  if (noti.size) {
    console.log('\n--- sotto il minimo, e lo sappiamo: il bianco sul pieno di marca ---');
    console.log('    (per sistemarlo va scurita la sfumatura di tutta l\u2019app: viola e blu');
    console.log('     cambiano appena, il ciano diventa turchese. \u00c8 una scelta sull\u2019aspetto.)');
    [...noti].sort().forEach(x => console.log('  ' + x));
  }
  console.log(fail ? '>>> ' + fail + ' PROBLEMI' : '>>> TUTTO A POSTO');
  await b.close(); srv.close(); process.exit(fail ? 1 : 0);
})();
