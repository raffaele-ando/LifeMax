/* SONO SUPERCERCHI DAVVERO?
   `border-radius` non fa un supercerchio: fa quattro archi di CERCHIO. La
   differenza si misura. La curva di un angolo è una superellisse
   |u|^n + |v|^n = 1, dove u e v sono le due distanze dal vertice divise per
   il raggio; l'arco di cerchio è il caso n = 2, il supercerchio n = 4.

   Questa prova non guarda il CSS: guarda i PIXEL. Disegna, fotografa, trova
   dove passa il bordo e ricava n risolvendo l'equazione punto per punto. Poi
   controlla che ogni angolo dell'app abbia il ritaglio e nessuno sia restato
   un rettangolo arrotondato, che il tracciato SVG del logo e l'icona siano
   superellissi anche loro, e — la cosa che il solo ritaglio rompe — che il
   BORDO ci sia su tutta la curva dell'angolo e non solo sui fianchi.

   Il riferimento è `corner-shape: squircle`, che la superellisse la disegna il
   browser: esiste solo su Chromium recente, e per questo la forma dell'app la
   fa un poligono, che invece va su tutto. Qui serve da metro.

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
  /* a un pixel per pixel CSS un raggio di 8px sono otto pixel: troppo pochi
     perché la bisezione dia un numero sensato, e il riferimento stesso
     usciva 5.19 dove doveva uscire 4.06. Si fotografa a sei volte la
     risoluzione, così anche l'angolo piccolo ha cinquanta righe da leggere. */
  const DPR = 6;
  const p1 = await b.newPage({ viewport: { width: 360, height: 460 }, deviceScaleFactor: DPR });
  const misuraForma = async (css, R, alto) => {
    await p1.setContent('<body style="margin:10px;background:#fff">' +
      '<div id="q" style="width:' + (2 * R + 40) + 'px;height:' + (alto || 2 * R + 40) + 'px;background:#000;' +
      'border-top-left-radius:' + R + 'px;' + css + '"></div></body>');
    await p1.waitForTimeout(50);
    const png = await p1.locator('#q').screenshot();
    const m = await p1.evaluate(MISURA + '(' + JSON.stringify(png.toString('base64')) + ',' + (R * DPR) + ',' + ((alto || 2 * R + 40) * DPR) + ')');
    m.scarto = m.scarto / DPR;   /* in pixel CSS, come il resto della prova */
    return m;
  };
  const soloRaggio = await misuraForma('', 120);
  ok('col solo border-radius l’angolo è un cerchio (n≈2)',
    Math.abs(soloRaggio.n - 2) < 0.25, 'n = ' + soloRaggio.n.toFixed(2) + ' su ' + soloRaggio.campioni + ' punti');
  const sq = await misuraForma('corner-shape: squircle;', 120);
  ok('con corner-shape: squircle è un supercerchio (n≈4)',
    Math.abs(sq.n - 4) < 0.4, 'n = ' + sq.n.toFixed(2) + ' ±' + sq.disp.toFixed(2));
  /* la sorpresa da tenere scritta: il numero di superellipse() è log2 */
  const se2 = await misuraForma('corner-shape: superellipse(2);', 120);
  const se3 = await misuraForma('corner-shape: superellipse(3);', 120);
  ok('e il numero di superellipse() è il logaritmo, non l’esponente',
    Math.abs(se2.n - 4) < 0.4 && Math.abs(se3.n - 8) < 1.2,
    'superellipse(2) → n = ' + se2.n.toFixed(2) + ' · superellipse(3) → n = ' + se3.n.toFixed(2));

  /* ============ 2. il nostro tracciato dà la stessa curva ============ */
  console.log('\nIL NOSTRO TRACCIATO CONTRO IL RIFERIMENTO');
  /* `corner-shape` è il riferimento: è il browser che disegna la superellisse.
     Il nostro poligono deve dare la stessa curva — se ci fosse un errore
     nella formula, qui si vedrebbe come uno scarto fra i due numeri. */
  const { tracciatiPer, passiPer } = await import('../segni/prova-tracciato.mjs');
  for (const R of [8, 12, 18, 60]) {
    const t = tracciatiPer([R, R, R, R], 1, 4, passiPer([R]));
    const nostro = await misuraForma('border-radius:0;clip-path:' + t.pieno + ';', R, R + 40);
    const suo = await misuraForma('corner-shape:squircle;', R);
    ok('a ' + R + 'px: il nostro tracciato e corner-shape danno la stessa curva',
      nostro.n !== null && suo.n !== null && Math.abs(nostro.n - suo.n) < 0.5,
      'nostro n = ' + (nostro.n ? nostro.n.toFixed(2) : '—') +
      '   corner-shape n = ' + (suo.n ? suo.n.toFixed(2) : '—'));
  }
  /* il limite: su un elemento più basso del doppio del raggio la forma non
     deve autointersecarsi — le tacche della striscia erano diventate aghi */
  {
    const t = tracciatiPer([18, 18, 18, 18], 1, 4, passiPer([18]));
    const basso = await misuraForma('border-radius:0;clip-path:' + t.pieno + ';', 18, 10);
    ok('su un elemento più basso del raggio la forma tiene',
      basso.scarto <= 2, 'scostamento del lato ' + basso.scarto + 'px');
  }

  /* ============ 3. un elemento vero dell'app, dipinto com'è ============ */
  console.log('\nE SU UN ELEMENTO VERO, DIPINTO COM’È');
  const pv = await b.newPage({ viewport: { width: 390, height: 900 }, hasTouch: true, isMobile: true, deviceScaleFactor: 8 });
  await pv.goto('http://localhost:' + PORTA + '/index.html'); await pv.waitForTimeout(400);
  await pv.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  await pv.reload(); await pv.waitForTimeout(1000);
  /* un pulsante pieno: colore forte su fondo chiaro, quindi il bordo si vede */
  const info = await pv.evaluate(() => {
    /* si prova in ordine, perché quale pulsante sia a schermo dipende
       dall'ora e dai dati; e si prende il primo VISIBILE, perché ce n'è anche
       dentro i pannelli chiusi e fotografare un elemento nascosto non
       fallisce subito — resta ad aspettare che diventi stabile finché la
       prova non scade. Il filtro NON guarda il border-radius: il blocco
       generato lo azzera, la forma adesso è il ritaglio. */
    let b = null;
    for (const sel of ['.btn-primario', '.btn-ok', '.tabbar .tab-catt', '.eroe2-cta', '.btn-tinta', '.icona-btn']) {
      b = [...document.querySelectorAll(sel)].find(e => {
        const r = e.getBoundingClientRect(), st = getComputedStyle(e);
        const cp = st.clipPath || '';
        const q = cp.match(/min\(([0-9.]+)px, 50%\)/);
        if (!/^polygon\(/.test(cp) || !q) return false;
        /* grande almeno il doppio del raggio: se no il min(…, 50%) del
           ritaglio entra in gioco e non si sa più che raggio si sta misurando */
        return r.width >= 2 * (+q[1]) + 8 && r.height >= 2 * (+q[1]) + 8 && st.visibility !== 'hidden';
      });
      if (b) break;
    }
    if (!b) return null;
    b.id = 'sq-misura';
    const cp = getComputedStyle(b).clipPath || '';
    return { ritaglio: cp.slice(0, 40), cls: b.className, raggio: +cp.match(/min\(([0-9.]+)px, 50%\)/)[1] };
  });
  if (!info) { ok('c’è un pulsante pieno da misurare', false, 'non trovato'); }
  else {
    ok('«' + info.cls + '» chiede la forma col ritaglio', /^polygon\(/.test(info.ritaglio), info.ritaglio + '…');
    const png = await pv.locator('#sq-misura').screenshot();
    /* qui la forma è CHIARA su fondo chiaro: si misura al contrario. E il
       raggio non si chiede al CSS (è azzerato): si legge dai pixel, perché
       è l'altezza a cui il bordo sinistro smette di curvare. */
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
        /* il bordo sinistro riga per riga, nella metà alta. Il raggio NON si
           deduce da «dove il lato diventa dritto»: la superellisse arriva al
           lato appiattendosi, e l'ultimo terzo della curva sta dentro il
           mezzo pixel — si finirebbe per misurare un raggio più corto e
           leggere n = 3.1 su una forma giusta. Il raggio arriva dal ritaglio. */
        const bordo = [];
        for (let y = 0; y < (c.height >> 1); y++) {
          let xx = null;
          for (let i = 0; i < (c.width >> 1); i++) if (dentro(i, y)) { xx = i; break; }
          bordo.push(xx);
        }
        const dritto = Math.min.apply(null, bordo.filter(v => v !== null));
        if (R < 8) return { n: null, R: R, motivo: 'angolo troppo piccolo da misurare' };
        const ns = [];
        for (let y = 1; y < R - 1; y++) {
          const xx = bordo[y];
          if (xx === null) continue;
          const u = (R - (xx - dritto)) / R, v = (R - y) / R;
          if (u <= 0.06 || v <= 0.06 || u >= 0.97 || v >= 0.97) continue;
          let lo = 0.4, hi = 60;
          for (let k = 0; k < 70; k++) { const mm = (lo + hi) / 2; (Math.pow(u, mm) + Math.pow(v, mm) > 1) ? lo = mm : hi = mm; }
          ns.push((lo + hi) / 2);
        }
        ns.sort((a, b) => a - b);
        return { n: ns.length ? ns[ns.length >> 1] : null, campioni: ns.length, R: R };
      })();
    }, [png.toString('base64'), Math.round(info.raggio * 8)]);
    ok('e sui suoi pixel è un supercerchio', m.n !== null && Math.abs(m.n - 4) < 0.7,
      m.n === null ? (m.motivo || 'niente da misurare') : 'n = ' + m.n.toFixed(2) + ' su ' + m.campioni + ' punti (angolo alto ' + m.R + ' pixel di schermo)');
  }

  /* ============ 4. tutte le schermate: chi ha il ritaglio ============ */
  console.log('\nOGNI ANGOLO DELL’APP È RITAGLIATO');
  const CONTA = `(function () {
    const out = { conRitaglio: 0, senza: [], nonPoligono: [] };
    document.querySelectorAll('body *').forEach(function (e) {
      const s = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      if (r.width < 3 || r.height < 3 || s.visibility === 'hidden' || s.display === 'none') return;
      const raggi = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius']
        .map(function (k) { return parseFloat(s[k]) || 0; });
      const clip = s.clipPath;
      const nome = e.tagName.toLowerCase() + (e.className && e.className.toString ? '.' + e.className.toString().trim().split(/\s+/).slice(0, 2).join('.') : '');
      /* Un angolo tondo si riconosce da UNA delle due cose: o ha ancora un
         border-radius (e allora è rimasto indietro), o ha un ritaglio (e
         allora è a posto). Quello che NON deve esistere è un elemento con un
         raggio e senza ritaglio: quello è un rettangolo con gli angoli
         arrotondati, cioè la cosa da cui siamo partiti. */
      /* Le PASTIGLIE sono l'unica eccezione, e ha una ragione precisa: in un
         poligono le percentuali si risolvono per asse, quindi non si può dire
         «metà del lato corto» e su una pastiglia larga il ritaglio darebbe una
         foglia invece di un supercerchio. Restano col raggio, che su una
         pastiglia disegna due semicerchi tangenti ai fianchi — una forma sua,
         non un rettangolo arrotondato. Si riconoscono dal raggio grande
         insieme a un lato corto: raggio ≥ metà del lato più corto. */
      const rmax = Math.max.apply(null, raggi);
      const pastiglia = rmax >= Math.min(r.width, r.height) / 2 - 0.6;
      if (rmax >= 1 && !pastiglia) {
        if (!clip || clip === 'none') { out.senza.push(nome + ' (raggio ' + rmax + 'px)'); return; }
      }
      if (clip && clip !== 'none') {
        out.conRitaglio++;
        if (!/^polygon/.test(clip)) out.nonPoligono.push(nome + ': ' + clip.slice(0, 30));
      }
    });
    return out;
  })()`;
  /* Il ritaglio non taglia solo i quattro angoli: taglia TUTTO quello che
     sporge dal riquadro — figli, pseudo-elementi, e con loro l'area del
     tocco, perché `clip-path` conta anche per il dito (il `mask` no: quello
     lascia stare il tocco dentro il riquadro, ma quello che sporge lo porta
     via lo stesso, misurato). Sono già andati via, e per questo c'è la prova:
     il pallino in cima al segno dell'ora, il filo che stacca la cattura dalle
     linguette, e i 44px invisibili che facevano grandi le due caselle da
     spuntare. */
  const MANGIATI = `(function () {
    const nome = function (e) { return e.tagName.toLowerCase() +
      (e.className && e.className.toString ? '.' + e.className.toString().trim().split(/\\s+/).slice(0, 2).join('.') : ''); };
    const out = [];
    document.querySelectorAll('body *').forEach(function (e) {
      const s = getComputedStyle(e);
      if (!/^polygon\\(/.test(s.clipPath || '')) return;
      const r = e.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      /* i figli. Chi scorre è un altro discorso: il contenuto di un pannello
         è più alto del pannello per definizione, e lo tagliava già
         lo scorrimento prima del ritaglio. */
      if (!/^visible/.test(s.overflow) || !/^visible/.test(s.overflowY) || !/^visible/.test(s.overflowX)) return;
      for (let i = 0; i < e.children.length; i++) {
        const c = e.children[i], cs = getComputedStyle(c);
        if (cs.position === 'fixed') continue;
        const q = c.getBoundingClientRect();
        if (q.width < 1 || q.height < 1) continue;
        const fuori = Math.max(r.left - q.left, r.top - q.top, q.right - r.right, q.bottom - r.bottom);
        if (fuori > 0.6) out.push(nome(e) + ' ← ' + nome(c) + ' (' + Math.round(fuori) + 'px fuori)');
      }
      /* gli pseudo-elementi, tranne l'anello del bordo, che è nostro e sta
         giusto sul contorno */
      ['::before', '::after'].forEach(function (ps) {
        const q = getComputedStyle(e, ps);
        if (!q.content || q.content === 'none' || q.content === 'normal') return;
        if (q.position !== 'absolute' && q.position !== 'fixed') return;
        const n = function (k) { const v = parseFloat(q[k]); return isNaN(v) ? 0 : v; };
        const lati = [n('top'), n('left'), n('right'), n('bottom')];
        if (Math.min.apply(null, lati) >= -0.01) return;
        /* l'anello del bordo: un poligono con i quattro lati tirati fuori
           tutti dello stesso tanto, quanto lo spessore del bordo che
           sostituisce (uno, uno e mezzo, due…) */
        const anello = /^polygon\\(/.test(q.clipPath || '') &&
          lati.every(function (x) { return Math.abs(x - lati[0]) < 0.01; }) && lati[0] < 0;
        if (anello) return;
        out.push(nome(e) + ps + ' sporge (' + q.top + ' ' + q.left + ' ' + q.right + ' ' + q.bottom + ')');
      });
    });
    return out;
  })()`;
  /* I comandi piccoli che prima si allargavano con uno pseudo-elemento che
     sporgeva dal riquadro. Adesso l'area del dito deve stare DENTRO qualcosa
     di vero: o il comando è cresciuto (le due caselle da spuntare), o la
     tocca tutta la riga che lo contiene (l'interruttore dei promemoria, che a
     quaranta pixel di supercerchio pieno si mangiava la riga). */
  const DITA = `(function () {
    const out = {};
    [['.riga-azione .spunta', null], ['.tl-check', null],
     ['.prom-int', '.prom-riga']].forEach(function (coppia) {
      const sel = coppia[0], sopra = coppia[1];
      [].forEach.call(document.querySelectorAll(sel), function (e) {
        const bersaglio = sopra ? e.closest(sopra) : e;
        if (!bersaglio) return;
        const r = bersaglio.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return;
        const nome = sel + (sopra ? ' (tocca ' + sopra + ')' : '');
        const m = Math.round(Math.min(r.width, r.height));
        if (out[nome] === undefined || m < out[nome]) out[nome] = m;
      });
    });
    return out;
  })()`;
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
  let totClip = 0;
  const senza = new Set(), nonPoly = new Set(), mangiati = new Set(), dita = new Map();
  for (const [nome, vai, poi] of SCENE) {
    await ps.evaluate(v => { location.hash = '#/' + v; }, vai);
    await ps.reload(); await ps.waitForTimeout(vai === 'lab' ? 1600 : 800);
    if (poi) { await ps.evaluate(poi); await ps.waitForTimeout(500); }
    const r = await ps.evaluate(CONTA);
    (await ps.evaluate(MANGIATI)).forEach((x) => mangiati.add(nome + ' — ' + x));
    Object.entries(await ps.evaluate(DITA)).forEach(([k, v]) => dita.set(k, Math.min(dita.get(k) || 999, v)));
    totClip += r.conRitaglio;
    r.senza.forEach(x => senza.add(nome + ' — ' + x));
    r.nonPoligono.forEach(x => nonPoly.add(x));
    console.log('      ' + nome.padEnd(16) + String(r.conRitaglio).padStart(4) + ' ritagliati   ' +
      (r.senza.length ? r.senza.length + ' RIMASTI INDIETRO' : ''));
  }
  ok('nessun angolo rimasto un rettangolo arrotondato', senza.size === 0,
    [...senza].slice(0, 6).join(' | ') || 'nessuno');
  ok('e ogni ritaglio è un poligono', nonPoly.size === 0, [...nonPoly].slice(0, 3).join(' | ') || 'sì');
  ok('gli angoli ritagliati sono tanti', totClip > 300, totClip + ' elementi ritagliati');
  ok('e il ritaglio non si mangia niente che sporge', mangiati.size === 0,
    [...mangiati].slice(0, 6).join(' | ') || 'nessun figlio, nessuno pseudo-elemento');

  /* e i comandi piccoli, che l'area del dito ce l'hanno nel proprio riquadro
     e non più in uno pseudo-elemento che sporge */
  {
    const misure = [...dita.entries()].map(([k, v]) => k + ' ' + v + 'px');
    ok('i comandi piccoli sono grandi quanto il dito', dita.size >= 3 &&
      [...dita.values()].every((v) => v >= 40), misure.join(' · ') || 'non trovati');
  }

  /* ============ 5. il blocco generato è aggiornato ============ */
  console.log('\nIL BLOCCO È GENERATO, NON SCRITTO A MANO');
  {
    const css = fs.readFileSync(path.join(RADICE, 'assets/app.css'), 'utf8');
    const prima = css;
    const { execFileSync } = require('child_process');
    execFileSync(process.execPath, [path.join(RADICE, 'segni/squircle.mjs')], { stdio: 'ignore' });
    const dopo = fs.readFileSync(path.join(RADICE, 'assets/app.css'), 'utf8');
    ok('rigenerandolo viene identico', prima === dopo,
      prima === dopo ? '' : 'lancia: node segni/squircle.mjs');
    /* `inset(50%)` è il testo che sta solo per i lettori di schermo: quello è
       un ritaglio per nascondere, non per dare una forma */
    const fuori = [...dopo.split('/* ==== SUPERCERCHI')[0]
      .replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/clip-path\s*:\s*([^;}]+)/g)]
      .map((m) => m[1].trim()).filter((v) => v !== 'inset(50%)');
    ok('e fuori dal blocco nessuno dà una forma col ritaglio', fuori.length === 0,
      fuori.slice(0, 3).join(' | ') || 'solo il testo per i lettori di schermo');
  }

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

  /* le PNG: chi ha l'angolo tagliato e chi no, letto dall'alfa del pixel (0,0).
     Non è un dettaglio da lasciare al ricordo — è il tipo di cosa che si
     rompe rigenerando le icone dal file sbagliato, e si scopre guardando la
     schermata Home del telefono. */
  const angoloPng = async (file) => {
    const d64 = fs.readFileSync(path.join(RADICE, file)).toString('base64');
    return pi.evaluate(async (b64) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
      return x.getImageData(0, 0, 1, 1).data[3];
    }, d64);
  };
  for (const f of ['icona-180.png', 'icona-167.png', 'icona-152.png', 'icona-maskable-192.png']) {
    const a = await angoloPng('assets/icone/' + f);
    ok(f + ' è piena fino al bordo', a > 200,
      a > 200 ? 'alfa ' + a : 'ha l’angolo tagliato: dentro la maschera del sistema resterebbe un anello di niente');
  }
  for (const f of ['icona-192.png', 'icona-512.png', 'favicon-32.png']) {
    const a = await angoloPng('assets/icone/' + f);
    ok(f + ' ha l’angolo a supercerchio', a < 40, 'alfa ' + a);
  }

  /* ============ 6b. la curvatura cambia, e non salta ============ */
  console.log('\nLA CURVATURA: DOVE IL LATO DIVENTA CURVA');
  /* La prova decisiva, e la sola che distingue davvero le due forme. In un
     arco di cerchio la curvatura è COSTANTE: vale 1/R lungo tutto l'angolo, e
     dove l'angolo attacca il lato dritto (curvatura zero) salta di colpo da 0
     a 1/R — è quello lo scalino che si vede. Nella curva di Lamé la curvatura
     va a zero mentre si avvicina al lato: l'attacco è invisibile perché non
     c'è niente da vedere. Qui si misura il raggio di curvatura (l'inverso
     della curvatura) in due punti: all'attacco col lato e a metà angolo. */
  {
    const CONTORNO = `(function (b64, R) {
      return (async function () {
        const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height).data;
        const dentro = function (i, j) { const k = (j * c.width + i) * 4; return (d[k] + d[k + 1] + d[k + 2]) / 3 < 128; };
        const p = [];
        for (var y = 0; y < R; y++) {
          var xx = null;
          for (var i = 0; i < R; i++) if (dentro(i, y)) { xx = i; break; }
          p.push(xx);
        }
        return p;
      })();
    })`;
    const contorno = async (css, R) => {
      await p1.setContent('<body style="margin:10px;background:#fff">' +
        '<div id="q" style="width:' + (2 * R + 40) + 'px;height:' + (2 * R + 40) + 'px;background:#000;' +
        'border-top-left-radius:' + R + 'px;' + css + '"></div></body>');
      await p1.waitForTimeout(50);
      const png = await p1.locator('#q').screenshot();
      return p1.evaluate(CONTORNO + '(' + JSON.stringify(png.toString('base64')) + ',' + (R * DPR) + ')');
    };
    /* Il raggio del cerchio che meglio si appoggia al contorno in un punto.
       Non su tre punti: il nostro contorno è una spezzata, e tre punti presi
       dentro lo stesso segmento darebbero raggio infinito e tre a cavallo di
       un vertice lo darebbero nullo. Si prende una finestra larga e si cerca
       il cerchio ai minimi quadrati — sulla spezzata dà il raggio della curva
       che la spezzata sta approssimando, che è quello che interessa. */
    const raggioIn = (p, y, mezzaFinestra) => {
      const pt = [];
      for (let j = y - mezzaFinestra; j <= y + mezzaFinestra; j++) {
        if (j < 0 || j >= p.length || p[j] === null || p[j] === undefined) continue;
        pt.push([p[j], j]);
      }
      if (pt.length < 8) return null;
      /* x² + y² + A x + B y + C = 0 → centro (-A/2, -B/2), raggio √(A²/4+B²/4−C) */
      let s = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      let t = [0, 0, 0];
      for (const [x, yy] of pt) {
        const r2 = x * x + yy * yy;
        s[0] += x * x; s[1] += x * yy; s[2] += x;
        s[3] += x * yy; s[4] += yy * yy; s[5] += yy;
        s[6] += x; s[7] += yy; s[8] += 1;
        t[0] -= r2 * x; t[1] -= r2 * yy; t[2] -= r2;
      }
      const det = s[0] * (s[4] * s[8] - s[5] * s[7]) - s[1] * (s[3] * s[8] - s[5] * s[6]) + s[2] * (s[3] * s[7] - s[4] * s[6]);
      if (Math.abs(det) < 1e-9) return Infinity;
      const sol = (c0, c1, c2) => (
        c0 * (s[4] * s[8] - s[5] * s[7]) - s[1] * (c1 * s[8] - s[5] * c2) + s[2] * (c1 * s[7] - s[4] * c2)) / det;
      const A = sol(t[0], t[1], t[2]);
      const B = (s[0] * (t[1] * s[8] - s[5] * t[2]) - t[0] * (s[3] * s[8] - s[5] * s[6]) + s[2] * (s[3] * t[2] - t[1] * s[6])) / det;
      const C = (s[0] * (s[4] * t[2] - t[1] * s[7]) - s[1] * (s[3] * t[2] - t[1] * s[6]) + t[0] * (s[3] * s[7] - s[4] * s[6])) / det;
      const r2 = A * A / 4 + B * B / 4 - C;
      return r2 > 0 ? Math.sqrt(r2) : Infinity;
    };
    const R = 120, Rp = R * DPR;
    const arco = await contorno('', R);
    const vera = await contorno('corner-shape:squircle;', R);
    const nostro = await contorno('border-radius:0;clip-path:' + tracciatiPer([R, R, R, R], 1, 4, passiPer([R])).pieno + ';', R);
    const fin = Math.round(Rp * 0.09);
    const dove = [0.12, 0.22, 0.34, 0.46, 0.58, 0.70, 0.80];
    const serie = (p) => dove.map((f) => {
      const r = raggioIn(p, Math.round(Rp * f), fin);
      return r === null ? null : r / Rp;
    });
    const sA = serie(arco), sV = serie(vera);
    const scrivi = (s2) => s2.map((v) => v === null ? '—' : (v === Infinity || v > 99 ? '>99' : v.toFixed(2))).join('  ');
    console.log('           ' + dove.map((f) => (f * 100).toFixed(0) + '%').join('   ') + '   della strada verso il lato');
    console.log('  cerchio  ' + scrivi(sA));
    console.log('  Lamé     ' + scrivi(sV));
    const buoni = (s2) => s2.filter((v) => v !== null && isFinite(v));
    const gA = buoni(sA), gV = buoni(sV);
    ok('l’arco di cerchio ha la curvatura COSTANTE: 1/R sempre',
      gA.length >= 5 && Math.max.apply(null, gA) / Math.min.apply(null, gA) < 1.3 && Math.abs(gA[0] - 1) < 0.2,
      'il raggio di curvatura resta ' + gA[0].toFixed(2) + '·R … ' + gA[gA.length - 1].toFixed(2) + '·R');
    ok('la curva di Lamé la cambia da un capo all’altro',
      gV.length >= 4 && Math.max.apply(null, gV) / Math.min.apply(null, gV) > 2,
      'da ' + Math.min.apply(null, gV).toFixed(2) + '·R a ' +
      (Math.max.apply(null, gV) > 99 ? '>99' : Math.max.apply(null, gV).toFixed(2)) + '·R');
    ok('e verso il lato si appiattisce, così l’attacco non si vede',
      gV.length >= 4 && Math.max.apply(null, gV) > 1.3 && gV[gV.length - 1] > gV[0] * 2,
      'il raggio di curvatura arriva a ' + (Math.max.apply(null, gV) > 99 ? 'oltre 99' :
        Math.max.apply(null, gV).toFixed(1)) + '·R prima del lato dritto');
  }


  /* ============ 6b-bis. quanto ci sta vicino il poligono ============ */
  console.log('\nQUANTO IL POLIGONO STA VICINO ALLA CURVA VERA');
    /* E quanto ci sta vicino il nostro poligono. La curvatura di una spezzata
       non si può misurare — è zero sui segmenti e infinita sui vertici — ma la
       distanza dalla curva vera sì. E non si misura riga per riga: verso il
       lato la curva è quasi orizzontale, tutta la fascia x da 566 a 720 sta
       dentro il primo pixel di altezza, e una lettura per righe là darebbe
       centoventisette pixel di scarto per mezzo pixel di differenza vera.
       Si misura invece l'AREA fra le due curve, divisa per la lunghezza
       dell'arco: è lo scarto medio, e non ha versi privilegiati. */
  for (const R of [12, 26, 60]) {
    const Rp = R * DPR;
    {
      const MASCHERA = `(function (b64, R) {
        return (async function () {
          const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
          const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
          const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
          const d = x.getImageData(0, 0, R, R).data;
          const m = new Uint8Array(R * R);
          for (var j = 0; j < R; j++) for (var i = 0; i < R; i++) {
            var k = (j * R + i) * 4;
            m[j * R + i] = (d[k] + d[k + 1] + d[k + 2]) / 3 < 128 ? 1 : 0;
          }
          return Array.from(m);
        })();
      })`;
      const maschera = async (css) => {
        await p1.setContent('<body style="margin:10px;background:#fff">' +
          '<div id="q" style="width:' + (2 * R + 40) + 'px;height:' + (2 * R + 40) + 'px;background:#000;' +
          'border-top-left-radius:' + R + 'px;' + css + '"></div></body>');
        await p1.waitForTimeout(50);
        const png = await p1.locator('#q').screenshot();
        return p1.evaluate(MASCHERA + '(' + JSON.stringify(png.toString('base64')) + ',' + Rp + ')');
      };
      const mV = await maschera('corner-shape:squircle;');
      const mN = await maschera('border-radius:0;clip-path:' +
        tracciatiPer([R, R, R, R], 1, 4, passiPer([R])).pieno + ';');
      let diverse = 0;
      for (let i = 0; i < mV.length; i++) if (mV[i] !== mN[i]) diverse++;
      /* la lunghezza dell'arco della curva di Lamé, in unità di R */
      let L = 0;
      const P = (t) => { const a2 = t * Math.PI / 2;
        return [1 - Math.pow(Math.cos(a2), 0.5), 1 - Math.pow(Math.sin(a2), 0.5)]; };
      for (let i = 1; i <= 20000; i++) {
        const [x0, y0] = P((i - 1) / 20000), [x1, y1] = P(i / 20000);
        L += Math.hypot(x1 - x0, y1 - y0);
      }
      const medio = diverse / (L * Rp) / DPR;   /* in pixel CSS */
      ok('a ' + R + 'px il poligono ci sta sopra entro un decimo di pixel',
        medio < 0.1, 'scarto medio ' + medio.toFixed(3) + 'px (' +
        diverse + ' pixel di schermo di differenza su un arco di ' + Math.round(L * Rp) + ')');
    }
  }

  /* ============ 6c. su un elemento che non è quadrato ============ */
  console.log('\nSU UN ELEMENTO LARGO E SU UNO ALTO');
  /* Il difetto di chi la forma la fa con una maschera SVG fissa: la maschera
     si stira col riquadro e l'angolo diventa un'ellisse. Il nostro tracciato
     ha i pixel dentro, non le percentuali, quindi l'angolo è lo stesso su
     qualunque proporzione — e questa prova lo misura invece di prometterlo. */
  {
    const R = 24;
    const t = tracciatiPer([R, R, R, R], 1, 4, passiPer([R]));
    const MIS = `(function (b64, R) {
      return (async function () {
        const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height).data;
        const dentro = function (i, j) { const k = (j * c.width + i) * 4; return (d[k] + d[k + 1] + d[k + 2]) / 3 < 128; };
        /* quanto è larga e quanto è alta la mordicchiatura dell'angolo */
        var alto = 0, largo = 0;
        for (var j = 0; j < c.height; j++) { if (dentro(0, j)) { alto = j; break; } }
        for (var i = 0; i < c.width; i++) { if (dentro(i, 0)) { largo = i; break; } }
        return { alto: alto, largo: largo };
      })();
    })`;
    const prova = async (w, h) => {
      await p1.setContent('<body style="margin:10px;background:#fff">' +
        '<div id="q" style="width:' + w + 'px;height:' + h + 'px;background:#000;' +
        'border-radius:0;clip-path:' + t.pieno + '"></div></body>');
      await p1.waitForTimeout(50);
      const png = await p1.locator('#q').screenshot();
      return p1.evaluate(MIS + '(' + JSON.stringify(png.toString('base64')) + ',' + (R * DPR) + ')');
    };
    const largo = await prova(280, 60), alto = await prova(60, 280), quadro = await prova(160, 160);
    const px = (v) => (v / DPR).toFixed(1);
    /* Non si confronta col raggio chiesto: la superellisse arriva al lato
       appiattendosi, e l'ultimo pezzo di curva sta dentro il mezzo pixel — la
       mordicchiatura si legge sempre un po' più corta del raggio (24px letti
       20.5). Quello che conta è che le TRE misure siano la stessa. */
    const tutte = [largo, alto, quadro].flatMap((m) => [m.alto, m.largo]);
    const spread = (Math.max.apply(null, tutte) - Math.min.apply(null, tutte)) / DPR;
    ok('l’angolo misura lo stesso su tutte le proporzioni', spread < 0.6,
      '280×60 → ' + px(largo.largo) + '×' + px(largo.alto) + 'px · ' +
      '60×280 → ' + px(alto.largo) + '×' + px(alto.alto) + 'px · ' +
      '160×160 → ' + px(quadro.largo) + '×' + px(quadro.alto) + 'px · scarto ' + spread.toFixed(2) + 'px');
    ok('e non si è schiacciato in un’ellisse',
      Math.abs(largo.alto - largo.largo) < 1.5 * DPR && Math.abs(alto.alto - alto.largo) < 1.5 * DPR,
      'scarto fra i due lati dell’angolo: ' + px(Math.abs(largo.alto - largo.largo)) + 'px e ' +
      px(Math.abs(alto.alto - alto.largo)) + 'px');
  }

  /* ============ 6d. l'anello è spesso quanto il bordo che sostituisce ====== */
  console.log('\nL’ANELLO È SPESSO QUANTO IL BORDO');
  /* Un bordo da due pixel con un anello da uno si assottiglia proprio
     nell'angolo: lo stesso difetto di prima, più piccolo e più difficile da
     vedere. Il generatore legge lo spessore dal foglio di stile, e qui si
     controlla che nel blocco generato ci sia. */
  {
    const css = fs.readFileSync(path.join(RADICE, 'assets/app.css'), 'utf8');
    const blocco = css.split('/* ==== SUPERCERCHI')[1] || '';
    /* .tl-check dichiara `border: 2px solid`: il suo anello deve stare a -2px */
    const reg = new RegExp('\\.tl-check::(?:before|after)[^{]*\\{[^}]*inset:\\s*(-?[0-9.]+)px', 'm');
    const m = reg.exec(blocco);
    ok('la casella col bordo da 2px ha l’anello da 2px', !!m && Math.abs(parseFloat(m[1]) + 2) < 0.01,
      m ? 'inset ' + m[1] + 'px' : 'non trovato');
    const spessori = [...blocco.matchAll(/inset:\s*-([0-9.]+)px/g)].map((x) => x[1]);
    const conta = {};
    spessori.forEach((x) => { conta[x] = (conta[x] || 0) + 1; });
    ok('e ci sono più spessori, non uno solo per tutti', Object.keys(conta).length > 1,
      Object.keys(conta).sort((a, b) => a - b).map((k) => k + 'px×' + conta[k]).join(' · '));
  }

  /* ============ 7. il bordo c'è tutt'intorno ============ */
  console.log('\nIL BORDO SEGUE LA CURVA, NON SOLO I LATI');
  /* Il difetto della prima strada: ritagliando un box a spigoli il bordo — che
     seguiva gli spigoli — veniva tagliato proprio sulla curva, e restava una
     scheda col bordo sui fianchi e senza negli angoli. L'anello lo ridisegna;
     qui si controlla che ci sia davvero, cercando il colore del bordo lungo la
     diagonale dell'angolo. */
  {
    const { tracciatiPer: TP } = await import('../segni/prova-tracciato.mjs');
    const t = TP([40, 40, 40, 40], 1, 4, 8);
    const pb = await b.newPage({ viewport: { width: 300, height: 240 }, deviceScaleFactor: 4 });
    const disegna = async (conAnello) => {
      await pb.setContent('<style>' +
        '.q{position:relative;width:200px;height:140px;background:#fff;border:1px solid #000;' +
        'border-radius:0;clip-path:' + t.pieno + '}' +
        (conAnello ? '.q::before{content:"";position:absolute;inset:-1px;background:#000;clip-path:' + t.anello + ';pointer-events:none}' : '') +
        '</style><body style="margin:20px;background:#fff"><div class="q" id="q"></div></body>');
      await pb.waitForTimeout(80);
      return (await pb.locator('#q').screenshot()).toString('base64');
    };
    const conta = (a) => pb.evaluate((a) => {
      const [b64, R] = a;
      return (async function () {
        const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height).data;
        /* lo screenshot di un elemento è appiattito su bianco: l'alfa non dice
           niente, quindi si guarda la luce. Si parte da dentro (il centro del
           quadrato dell'angolo, che sta nel pieno) e si va verso fuori: il primo
           pixel non bianco è l'inizio del bordo, e subito dopo dev'esserci il
           nero pieno dell'anello. Se il ritaglio avesse mangiato il bordo sulla
           curva si uscirebbe dal bianco al niente, senza mai passare dal nero. */
        const luce = (i, j) => { const k = (j * c.width + i) * 4; return (d[k] + d[k + 1] + d[k + 2]) / 3; };
        let conBordo = 0, tot = 0;
        for (let g = 2; g <= 88; g += 4) {
          const a = g * Math.PI / 180;
          const dove = t2 => [Math.round(R - Math.cos(a) * t2), Math.round(R - Math.sin(a) * t2)];
          let inizio = -1;
          for (let t2 = 0; t2 < R * 1.6; t2 += 0.5) {
            const [i, j] = dove(t2);
            if (i < 0 || j < 0) break;
            if (luce(i, j) < 240) { inizio = t2; break; }
          }
          if (inizio < 0) { tot++; continue; }   /* mai uscito dal bianco: bordo assente */
          let buio = 255;
          for (let t2 = inizio; t2 <= inizio + 6; t2 += 0.5) {
            const [i, j] = dove(t2);
            if (i < 0 || j < 0) break;
            buio = Math.min(buio, luce(i, j));
          }
          tot++;
          if (buio < 110) conBordo++;
        }
        return { conBordo, tot };
      })();
    }, a);
    const m = await conta([await disegna(true), 40 * 4]);
    /* e la controprova: senza l'anello, col solo bordo del box, il ritaglio se
       lo mangia in mezzo alla curva — sui fianchi resta, perché là il bordo del
       box e la curva coincidono; è proprio la scheda «col bordo sui lati e
       niente negli angoli». Se questa non fallisse, la prova di sopra non
       starebbe misurando niente. */
    const senza = await conta([await disegna(false), 40 * 4]);
    await pb.close();
    ok('il bordo c’è su tutta la curva dell’angolo', m.tot > 15 && m.conBordo === m.tot,
      m.conBordo + ' direzioni su ' + m.tot + ' hanno il bordo');
    ok('e senza l’anello sparirebbe: la prova sa vedere il difetto',
      senza.tot - senza.conBordo >= 6,
      'col solo bordo del box il bordo manca in ' + (senza.tot - senza.conBordo) +
      ' direzioni su ' + senza.tot);
  }

  console.log(guai ? '\n>>> ' + guai + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
  await b.close(); srv.close(); process.exit(guai ? 1 : 0);
})();
