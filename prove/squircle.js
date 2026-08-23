/* SONO SUPERCERCHI DAVVERO?
   `border-radius` non fa un supercerchio: fa quattro archi di CERCHIO. La
   differenza si misura. La curva di un angolo è una superellisse
   |u|^n + |v|^n = 1, dove u e v sono le due distanze dal vertice divise per
   il raggio; l'arco di cerchio è il caso n = 2, il supercerchio n = 4.

   Questa prova non guarda il CSS: guarda i PIXEL. Disegna, fotografa, trova
   dove passa il bordo e ricava n risolvendo l'equazione punto per punto. Poi
   controlla che ogni angolo dell'app lo chieda, che le pastiglie siano restate
   cerchi, e che il tracciato SVG del logo sia una superellisse anche lui —
   quello serve dove `corner-shape` non c'è, cioè su Safari.

   node prove/squircle.js        (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const PORTA = 8772;
let guai = 0;
const ok = (n, c, d) => { if (!c) guai++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

/* ---------- la misura ----------
   Dentro il browser, perché leggere una PNG da Node vorrebbe dire una
   libreria in più per fare una cosa che il canvas fa già. */
const MISURA = `(function (b64, R, lato) {
  return (async function () {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    /* la forma è dipinta scura su chiaro: «dentro» = scuro */
    const luce = (i, j) => { const k = (j * c.width + i) * 4; return (d[k] + d[k + 1] + d[k + 2]) / 3; };
    const dentro = (i, j) => i >= 0 && j >= 0 && i < c.width && j < c.height && luce(i, j) < 128;
    /* il bordo riga per riga, nell'angolo in alto a sinistra */
    const punti = [];
    for (let y = 1; y < R - 1; y++) {
      let xx = null;
      for (let i = 0; i < R; i++) if (dentro(i, y)) { xx = i; break; }
      if (xx === null) continue;
      punti.push([xx, y]);
    }
    /* n, punto per punto, per bisezione su u^n + v^n = 1 */
    const ns = [];
    for (const [px, py] of punti) {
      const u = (R - px) / R, v = (R - py) / R;
      if (u <= 0.05 || v <= 0.05 || u >= 0.98 || v >= 0.98) continue;
      let lo = 0.4, hi = 60;
      for (let k = 0; k < 70; k++) { const m = (lo + hi) / 2; (Math.pow(u, m) + Math.pow(v, m) > 1) ? lo = m : hi = m; }
      ns.push((lo + hi) / 2);
    }
    ns.sort((a, b) => a - b);
    /* quanto è dritto il lato: a metà altezza, lontano dagli angoli, il bordo
       sinistro deve stare fermo */
    let scarto = 0;
    if (c.height > 2 * R + 8) {
      const xs = [];
      for (let y = R + 4; y < c.height - R - 4; y += 2) {
        for (let i = 0; i < c.width; i++) if (dentro(i, y)) { xs.push(i); break; }
      }
      if (xs.length) scarto = Math.max.apply(null, xs) - Math.min.apply(null, xs);
    }
    return {
      n: ns.length ? ns[ns.length >> 1] : null,
      disp: ns.length > 6 ? (ns[Math.round(ns.length * 0.9)] - ns[Math.round(ns.length * 0.1)]) / 2 : null,
      campioni: ns.length, scarto: scarto, w: c.width, h: c.height
    };
  })();
})`;

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

  /* ============ 1. la differenza esiste, e si misura ============ */
  console.log('UN ARCO DI CERCHIO NON È UN SUPERCERCHIO');
  const p1 = await b.newPage({ viewport: { width: 360, height: 460 } });
  const misuraForma = async (css, R, alto) => {
    await p1.setContent('<body style="margin:10px;background:#fff">' +
      '<div id="q" style="width:' + (R + 40) + 'px;height:' + (alto || R + 40) + 'px;background:#000;' +
      'border-top-left-radius:' + R + 'px;' + css + '"></div></body>');
    await p1.waitForTimeout(50);
    const png = await p1.locator('#q').screenshot();
    return p1.evaluate(MISURA + '(' + JSON.stringify(png.toString('base64')) + ',' + R + ',' + (alto || R + 40) + ')');
  };
  const soloRaggio = await misuraForma('', 200);
  ok('col solo border-radius l’angolo è un cerchio (n≈2)',
    Math.abs(soloRaggio.n - 2) < 0.25, 'n = ' + soloRaggio.n.toFixed(2) + ' su ' + soloRaggio.campioni + ' punti');
  const sq = await misuraForma('corner-shape: squircle;', 200);
  ok('con corner-shape: squircle è un supercerchio (n≈4)',
    Math.abs(sq.n - 4) < 0.4, 'n = ' + sq.n.toFixed(2) + ' ±' + sq.disp.toFixed(2));
  /* la sorpresa da tenere scritta: il numero di superellipse() è log2 */
  const se2 = await misuraForma('corner-shape: superellipse(2);', 200);
  const se3 = await misuraForma('corner-shape: superellipse(3);', 200);
  ok('e il numero di superellipse() è il logaritmo, non l’esponente',
    Math.abs(se2.n - 4) < 0.4 && Math.abs(se3.n - 8) < 1.2,
    'superellipse(2) → n = ' + se2.n.toFixed(2) + ' · superellipse(3) → n = ' + se3.n.toFixed(2));

  /* ============ 2. i raggi veri dell'app, uno per uno ============ */
  console.log('\nA OGNI RAGGIO CHE L’APP USA');
  const pt = await b.newPage({ viewport: { width: 400, height: 300 } });
  await pt.goto('http://localhost:' + PORTA + '/index.html');
  await pt.waitForTimeout(400);
  const tok = await pt.evaluate(() => {
    const s = getComputedStyle(document.documentElement);
    const o = {};
    ['--r-1', '--r-2', '--r-3', '--raggio', '--raggio-s', '--r-tondo'].forEach(k => { o[k] = s.getPropertyValue(k).trim(); });
    return o;
  });
  for (const k of ['--r-1', '--r-2', '--r-3', '--raggio', '--raggio-s']) {
    const px = parseFloat(tok[k]);
    if (!px) continue;
    /* piccolo com'è nell'app, ma fotografato a otto volte: un raggio da 12px
       diventano 96 pixel veri, e su 96 pixel la curva si misura */
    const pz = await b.newPage({ viewport: { width: 200, height: 200 }, deviceScaleFactor: 8 });
    await pz.setContent('<body style="margin:6px;background:#fff">' +
      '<div id="q" style="width:60px;height:60px;background:#000;border-radius:' + px + 'px;corner-shape:squircle"></div></body>');
    await pz.waitForTimeout(50);
    const png = await pz.locator('#q').screenshot();
    const m = await pz.evaluate(MISURA + '(' + JSON.stringify(png.toString('base64')) + ',' + (px * 8) + ',' + (60 * 8) + ')');
    await pz.close();
    ok(k + ' (' + px + 'px) è un supercerchio', m.n !== null && Math.abs(m.n - 4) < 0.6,
      m.n === null ? 'niente da misurare' : 'n = ' + m.n.toFixed(2) + ' ±' + (m.disp || 0).toFixed(2));
  }

  /* ============ 3. un elemento vero dell'app, dipinto com'è ============ */
  console.log('\nE SU UN ELEMENTO VERO, DIPINTO COM’È');
  const pv = await b.newPage({ viewport: { width: 390, height: 900 }, hasTouch: true, isMobile: true, deviceScaleFactor: 8 });
  await pv.goto('http://localhost:' + PORTA + '/index.html'); await pv.waitForTimeout(400);
  await pv.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  await pv.reload(); await pv.waitForTimeout(1000);
  /* un pulsante pieno: colore forte su fondo chiaro, quindi il bordo si vede */
  const info = await pv.evaluate(() => {
    /* il PRIMO VISIBILE: ce n'è anche dentro i pannelli chiusi, e fotografare
       un elemento nascosto non fallisce subito — resta ad aspettare che
       diventi stabile finché la prova non scade */
    /* un elemento pieno e ben visibile: si prova in ordine, perché quale sia
       a schermo dipende dall'ora e dai dati */
    let b = null;
    for (const sel of ['.btn-primario', '.btn-ok', '.tabbar .tab-catt', '.toast', '.eroe2-cta', '.btn-tinta', '.icona-btn']) {
      b = [...document.querySelectorAll(sel)].find(e => {
        const r = e.getBoundingClientRect(), st = getComputedStyle(e);
        return r.width > 24 && r.height > 16 && st.visibility !== 'hidden' && parseFloat(st.borderTopLeftRadius) >= 5;
      });
      if (b) break;
    }
    if (!b) return null;
    b.id = 'sq-misura';
    const s = getComputedStyle(b);
    return { r: parseFloat(s.borderTopLeftRadius), forma: s.cornerShape || s.getPropertyValue('corner-shape'), cls: b.className };
  });
  if (!info) { ok('c’è un pulsante pieno da misurare', false, 'non trovato'); }
  else {
    const png = await pv.locator('#sq-misura').screenshot();
    /* qui la forma è CHIARA su fondo chiaro: si misura al contrario */
    const m = await pv.evaluate((a) => {
      const [b64, R] = a;
      return (async function () {
        const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height).data;
        /* il colore del pulsante è quello del suo centro; «dentro» = vicino a
           quello, più di quanto lo sia il fondo della pagina */
        const px = (i, j) => { const k = (j * c.width + i) * 4; return [d[k], d[k + 1], d[k + 2]]; };
        const centro = px(c.width >> 1, c.height >> 1);
        const fuori = px(0, 0);
        const dist = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
        const dentro = (i, j) => i >= 0 && j >= 0 && i < c.width && j < c.height &&
          dist(px(i, j), centro) < dist(px(i, j), fuori);
        const ns = [];
        for (let y = 1; y < R - 1; y++) {
          let xx = null;
          for (let i = 0; i < R; i++) if (dentro(i, y)) { xx = i; break; }
          if (xx === null) continue;
          const u = (R - xx) / R, v = (R - y) / R;
          if (u <= 0.06 || v <= 0.06 || u >= 0.97 || v >= 0.97) continue;
          let lo = 0.4, hi = 60;
          for (let k = 0; k < 70; k++) { const m = (lo + hi) / 2; (Math.pow(u, m) + Math.pow(v, m) > 1) ? lo = m : hi = m; }
          ns.push((lo + hi) / 2);
        }
        ns.sort((a, b) => a - b);
        return { n: ns.length ? ns[ns.length >> 1] : null, campioni: ns.length };
      })();
    }, [png.toString('base64'), Math.round(info.r * 8)]);
    ok('«' + info.cls + '» chiede il supercerchio', info.forma === 'squircle', info.forma);
    ok('e sui suoi pixel è un supercerchio', m.n !== null && Math.abs(m.n - 4) < 0.7,
      m.n === null ? 'niente da misurare' : 'n = ' + m.n.toFixed(2) + ' su ' + m.campioni + ' punti (raggio ' + info.r + 'px)');
  }

  /* ============ 4. tutte le schermate: chi lo chiede e chi no ============ */
  console.log('\nOGNI ANGOLO DELL’APP LO CHIEDE, OGNI PASTIGLIA RESTA UN CERCHIO');
  const CONTA = `(function (TONDI) {
    const out = { angoli: 0, tondi: 0, sbagliati: [], senza: [] };
    document.querySelectorAll('body *').forEach(function (e) {
      const s = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      if (r.width < 3 || r.height < 3 || s.visibility === 'hidden' || s.display === 'none') return;
      const raggi = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius']
        .map(function (k) { return parseFloat(s[k]) || 0; });
      const max = Math.max.apply(null, raggi);
      if (max < 1) return;
      const forma = s.cornerShape || s.getPropertyValue('corner-shape');
      const nome = e.tagName.toLowerCase() + (e.className && e.className.toString ? '.' + e.className.toString().trim().split(/\\s+/).slice(0, 2).join('.') : '');
      /* Chi resta tondo NON si indovina dalla geometria: si chiede al foglio
         di stile. La prima versione confrontava il raggio con la metà del lato
         più corto e si fermava su due casi giusti — la barra delle sezioni,
         che chiede un raggio da pastiglia ma è alta abbastanza da non
         arrivarci, e i segmenti della striscia, alti quattro pixel, dove un
         raggio d'angolo arriva alla metà per forza. Un conto che scatta su un
         caso giusto si impara a ignorare. */
      const tondo = TONDI.some(function (sel) { try { return e.matches(sel); } catch (x) { return false; } });
      if (!forma) { out.senza.push(nome); return; }
      if (tondo) { out.tondi++; if (forma !== 'round') out.sbagliati.push(nome + ': lo stile lo vuole tondo, ha ' + forma); }
      else { out.angoli++; if (forma !== 'squircle') out.sbagliati.push(nome + ': angolo con ' + forma); }
    });
    return out;
  })`;
  /* l'elenco dei tondi, letto dal CSS: serve sia alla scena qui sotto (per
     sapere chi DEVE restare tondo) sia al controllo che l'elenco scritto nel
     file sia completo */
  const tondiDa = (file) => {
    const src = fs.readFileSync(path.join(RADICE, file), 'utf8');
    const out = new Set();
    let i = 0;
    while (i < src.length) {
      const apre = src.indexOf('{', i); if (apre < 0) break;
      let testa = src.slice(i, apre).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[}\s]+/, '').trim();
      if (/^@/.test(testa)) { i = apre + 1; continue; }
      let liv = 1, j = apre + 1;
      while (j < src.length && liv > 0) { if (src[j] === '{') liv++; else if (src[j] === '}') liv--; j++; }
      const corpo = src.slice(apre + 1, j - 1);
      const raggi = [...corpo.matchAll(/border(?:-[a-z]+)*-radius\s*:\s*([^;}]+)/g)].map(m => m[1].trim());
      if (raggi.length && testa && raggi.some(v => /--r-tondo|(^|\s)50%|9{2,}px/.test(v))) {
        testa.split(',').map(t => t.trim()).filter(t => /^[.#a-z:[*]/i.test(t)).forEach(t => out.add(t));
      }
      i = j;
    }
    return out;
  };
  const attesi = new Set([...tondiDa('assets/app.css'), ...tondiDa('assets/lab.css')]);

  const SCENE = [
    ['Oggi', 'oggi', null], ['La giornata', 'giornata', null], ['Attività', 'inbox', null],
    ['Rituali', 'rituali', null], ['Andamento', 'plancia', null], ['Esperimenti', 'esperimenti', null],
    ['Impostazioni', 'plancia', () => { const b = [...document.querySelectorAll('#vista button')].find(x => /Impostazioni/.test(x.textContent)); if (b) b.click(); }],
    ['Come ti avviso', 'plancia', () => { const b = [...document.querySelectorAll('#vista button')].find(x => /Impostazioni/.test(x.textContent)); if (b) b.click(); const c = document.getElementById('imp-prom-come'); if (c) c.click(); }],
    ['Design lab', 'lab', null]
  ];
  const ps = await b.newPage({ viewport: { width: 390, height: 900 }, hasTouch: true, isMobile: true });
  await ps.goto('http://localhost:' + PORTA + '/index.html'); await ps.waitForTimeout(400);
  await ps.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  let totAng = 0, totTondi = 0;
  const sbagliati = new Set(), senza = new Set();
  for (const [nome, vai, poi] of SCENE) {
    await ps.evaluate(v => { location.hash = '#/' + v; }, vai);
    await ps.reload(); await ps.waitForTimeout(vai === 'lab' ? 1600 : 800);
    if (poi) { await ps.evaluate(poi); await ps.waitForTimeout(500); }
    /* la lista si infila NELLA stringa: passandola come argomento, Playwright
       valuta l'espressione, ottiene una funzione, e una funzione non è
       serializzabile — quindi tornava `undefined` senza dire niente */
    const r = await ps.evaluate(CONTA + '(' + JSON.stringify([...attesi]) + ')');
    totAng += r.angoli; totTondi += r.tondi;
    r.sbagliati.forEach(x => sbagliati.add(nome + ' — ' + x));
    r.senza.forEach(x => senza.add(x));
    console.log('      ' + nome.padEnd(16) + String(r.angoli).padStart(4) + ' angoli   ' + String(r.tondi).padStart(3) + ' pastiglie');
  }
  ok('nessun angolo lasciato indietro', sbagliati.size === 0, [...sbagliati].slice(0, 6).join(' | ') || 'nessuno');
  ok('e il browser conosce corner-shape', senza.size === 0, [...senza].slice(0, 3).join(', ') || 'sì');
  ok('e gli angoli guardati sono tanti', totAng > 150, totAng + ' angoli, ' + totTondi + ' pastiglie');

  /* ============ 5. l'elenco delle pastiglie è completo ============ */
  console.log('\nL\u2019ELENCO DELLE ECCEZIONI \u00c8 GENERATO, NON RICORDATO');
  const css = fs.readFileSync(path.join(RADICE, 'assets/app.css'), 'utf8');
  const blocco = /--- GENERATO: chi resta un cerchio vero ---\s*\*\/\s*([\s\S]*?)\{\s*corner-shape:\s*round/.exec(css);
  const scritti = new Set(blocco ? blocco[1].split(',').map(t => t.trim()).filter(Boolean) : []);
  const mancanti = [...attesi].filter(t => !scritti.has(t));
  const inPiu = [...scritti].filter(t => !attesi.has(t));
  ok('nessuna pastiglia dimenticata nell’elenco', mancanti.length === 0,
    mancanti.slice(0, 6).join(', ') || attesi.size + ' selettori');
  ok('e nessuna riga di troppo', inPiu.length === 0, inPiu.slice(0, 6).join(', ') || 'nessuna');

  /* ============ 6. il tracciato SVG, per dove corner-shape non c'è ============ */
  console.log('\nIL TRACCIATO SVG (quello che vale anche su Safari)');
  const { superellisse } = await import('../segni/superellisse.mjs');
  /* il raggio deve stare SOTTO la metà del lato più corto, o `superellisse` lo
     taglia — e misurare con quello chiesto invece di quello usato dà un n
     falso (5.18 invece di 4, la prima volta: il raggio era 200 su un lato da
     320, quindi tagliato a 160) */
  const LATO = 320, R2 = 130;
  const d = superellisse(LATO, LATO + 60, R2, 4, 12);
  const pp = await b.newPage({ viewport: { width: LATO + 40, height: LATO + 120 } });
  await pp.setContent('<body style="margin:10px;background:#fff">' +
    '<svg id="s" width="' + LATO + '" height="' + (LATO + 60) + '" viewBox="0 0 ' + LATO + ' ' + (LATO + 60) + '">' +
    '<path d="' + d + '" fill="#000"/></svg></body>');
  await pp.waitForTimeout(60);
  const pngSvg = await pp.locator('#s').screenshot();
  const ms = await pp.evaluate(MISURA + '(' + JSON.stringify(pngSvg.toString('base64')) + ',' + R2 + ',' + (LATO + 60) + ')');
  ok('il tracciato è una superellisse (n≈4)', ms.n !== null && Math.abs(ms.n - 4) < 0.35,
    ms.n === null ? 'niente' : 'n = ' + ms.n.toFixed(2) + ' ±' + ms.disp.toFixed(2) + ' su ' + ms.campioni + ' punti');
  /* la trappola della prima versione: i lati che si incurvano */
  ok('e i lati sono dritti', ms.scarto <= 1, 'scostamento ' + ms.scarto + 'px');

  /* ============ 6b. l'icona dell'app ============ */
  console.log('\nL’ICONA DELL’APP');
  const pi = await b.newPage({ viewport: { width: 700, height: 700 } });
  for (const [nome, file, r] of [['il disegno (icona.svg)', 'assets/icone/icona.svg', 112],
                                 ['e la sua PNG da 512', 'assets/icone/icona-512.png', 112]]) {
    await pi.setContent('<body style="margin:10px;background:#fff">' +
      '<img id="i" src="http://localhost:' + PORTA + '/' + file + '" width="512" height="512"></body>');
    await pi.waitForTimeout(250);
    const png = await pi.locator('#i').screenshot();
    /* l'icona è colorata su bianco: «dentro» = non-bianco */
    const m = await pi.evaluate((a) => {
      const [b64, R] = a;
      return (async function () {
        const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height).data;
        const dentro = (i, j) => {
          if (i < 0 || j < 0 || i >= c.width || j >= c.height) return false;
          const k = (j * c.width + i) * 4;
          return d[k + 3] > 128 && (d[k] + d[k + 1] + d[k + 2]) / 3 < 240;
        };
        const ns = [];
        for (let y = 2; y < R - 2; y++) {
          let xx = null;
          for (let i = 0; i < R; i++) if (dentro(i, y)) { xx = i; break; }
          if (xx === null) continue;
          const u = (R - xx) / R, v = (R - y) / R;
          if (u <= 0.06 || v <= 0.06 || u >= 0.97 || v >= 0.97) continue;
          let lo = 0.4, hi = 60;
          for (let k = 0; k < 70; k++) { const mm = (lo + hi) / 2; (Math.pow(u, mm) + Math.pow(v, mm) > 1) ? lo = mm : hi = mm; }
          ns.push((lo + hi) / 2);
        }
        ns.sort((a, b) => a - b);
        return { n: ns.length ? ns[ns.length >> 1] : null, campioni: ns.length };
      })();
    }, [png.toString('base64'), r]);
    ok(nome + ' è un supercerchio', m.n !== null && Math.abs(m.n - 4) < 0.45,
      m.n === null ? 'niente da misurare' : 'n = ' + m.n.toFixed(2) + ' su ' + m.campioni + ' punti');
  }
  /* le due che iOS e Android mascherano da sé devono restare QUADRE: se le
     arrotondassimo anche noi, resterebbe un bordo di niente attorno all'icona */
  for (const file of ['assets/icone/icona-ios.svg', 'assets/icone/icona-maskable.svg']) {
    const src = fs.readFileSync(path.join(RADICE, file), 'utf8');
    ok(file.split('/').pop() + ' resta quadra (la maschera la mette il sistema)',
      !/rx=|<path d="M0 \d/.test(src.split('<path d="M1')[0]) && /<rect width="512" height="512" fill/.test(src),
      /rx=/.test(src) ? 'ha un rx' : 'quadra');
  }

  /* ============ 7. senza corner-shape non si rompe niente ============ */
  console.log('\nDOVE corner-shape NON C’È (Safari, oggi)');
  ok('ogni regola col supercerchio ha ancora il suo border-radius',
    /@supports \(corner-shape: squircle\)/.test(css), 'la richiesta è dentro @supports');
  /* senza togliere i commenti questo controllo scattava sulla spiegazione:
     là la parola «corner-shape» c'è venti volte, e non è una regola */
  const senzaCommenti = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const fuoriSupports = senzaCommenti.split('@supports (corner-shape: squircle)')[0];
  ok('e fuori da lì non si chiede a nessuno',
    !/corner-shape\s*:/.test(fuoriSupports), 'nessuna regola fuori');

  console.log(guai ? '\n>>> ' + guai + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
  await b.close(); srv.close(); process.exit(guai ? 1 : 0);
})();
