/* ============================================================
   LifeMax — micro-libreria grafici (SVG, zero dipendenze)
   Regole applicate: una sola scala Y per grafico, linee 2px,
   estremità dati arrotondate 4px ancorate alla baseline,
   griglia hairline recessiva, tooltip su hover di default,
   testo nei token di inchiostro (mai nel colore della serie),
   legenda presente quando le serie sono ≥ 2.
   ============================================================ */
'use strict';

var LMCharts = (function () {

  var NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  /* ---------- tooltip condiviso ---------- */

  var tip = null;
  function tooltip() {
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'lm-tooltip';
      tip.setAttribute('role', 'status');
      document.body.appendChild(tip);
    }
    return tip;
  }
  function showTip(html, x, y) {
    var t = tooltip();
    t.innerHTML = html;
    t.style.display = 'block';
    var r = t.getBoundingClientRect();
    var left = Math.min(window.innerWidth - r.width - 8, x + 12);
    var top = y - r.height - 10;
    if (top < 4) top = y + 14;
    t.style.left = Math.max(4, left) + 'px';
    t.style.top = top + 'px';
  }
  function hideTip() { if (tip) tip.style.display = 'none'; }

  /* ---------- sparkline (linea singola, in card) ---------- */
  /* valori: [{data, valore|null}]. Scala Y dichiarata dal chiamante
     (min/max) così tutte le card della stessa metrica condividono
     la scala e restano confrontabili. */

  function sparkline(container, punti, opts) {
    opts = opts || {};
    container.innerHTML = '';
    var W = opts.w || container.clientWidth || 220;
    var H = opts.h || 44;
    var pad = 3;
    var min = opts.min !== undefined ? opts.min : 0;
    var max = opts.max !== undefined ? opts.max : Math.max.apply(null, punti.map(function (p) { return p.valore || 0; }).concat([1]));
    var colore = opts.colore || 'var(--serie-1)';

    var svg = el('svg', { width: '100%', height: H, viewBox: '0 0 ' + W + ' ' + H, 'aria-hidden': 'false', role: 'img' }, container);
    if (opts.label) el('title', {}, svg).textContent = opts.label;

    function X(i) { return pad + (W - 2 * pad) * (punti.length < 2 ? 0.5 : i / (punti.length - 1)); }
    function Y(v) { return H - pad - (H - 2 * pad) * ((v - min) / (max - min || 1)); }

    /* segmenti continui (i null spezzano la linea); i punti isolati
       — frequenti quando si registra a giorni alterni — diventano pallini,
       altrimenti la sparkline sembra vuota */
    var d = '', started = false, ultimo = null;
    punti.forEach(function (p, i) {
      if (p.valore === null) { started = false; return; }
      d += (started ? 'L' : 'M') + X(i).toFixed(1) + ',' + Y(p.valore).toFixed(1);
      started = true;
      ultimo = { i: i, v: p.valore };
    });
    if (d) el('path', { d: d, fill: 'none', stroke: colore, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
    punti.forEach(function (p, i) {
      if (p.valore === null) return;
      var soloPrima = i === 0 || punti[i - 1].valore === null;
      var soloDopo = i === punti.length - 1 || punti[i + 1].valore === null;
      if (soloPrima && soloDopo) el('circle', { cx: X(i), cy: Y(p.valore), r: 2, fill: colore }, svg);
    });
    if (ultimo) el('circle', { cx: X(ultimo.i), cy: Y(ultimo.v), r: 3, fill: colore, stroke: 'var(--superficie-1)', 'stroke-width': 2 }, svg);

    /* hover leggero: overlay che segue il punto più vicino */
    var hover = el('rect', { x: 0, y: 0, width: W, height: H, fill: 'transparent' }, svg);
    hover.addEventListener('mousemove', function (ev) {
      var r = svg.getBoundingClientRect();
      var fx = (ev.clientX - r.left) / r.width * W;
      var best = null, bd = 1e9;
      punti.forEach(function (p, i) {
        if (p.valore === null) return;
        var dd = Math.abs(X(i) - fx);
        if (dd < bd) { bd = dd; best = { p: p, i: i }; }
      });
      if (best) {
        showTip('<b>' + LM.fmtShort(best.p.data) + '</b> · ' + fmtNum(best.p.valore) + (opts.unita ? ' ' + opts.unita : ''), ev.clientX, ev.clientY);
      }
    });
    hover.addEventListener('mouseleave', hideTip);
  }

  /* ---------- linea multi-serie con assi (trend check-in) ---------- */
  /* serie: [{nome, colore, punti:[{data,valore|null}]}] — max 4.
     Una sola scala Y. Legenda sempre presente (≥2 serie) +
     etichetta diretta a fine linea. Crosshair + tooltip. */

  function trend(container, serie, opts) {
    opts = opts || {};
    container.innerHTML = '';
    var W = opts.w || container.clientWidth || 640;
    var H = opts.h || 220;
    var m = { t: 12, r: 84, b: 24, l: 30 };
    var min = opts.min !== undefined ? opts.min : 0;
    var max = opts.max !== undefined ? opts.max : 5;

    var wrap = document.createElement('div');
    wrap.className = 'lm-chart';
    container.appendChild(wrap);

    /* legenda (identità mai affidata al solo colore) */
    if (serie.length >= 2) {
      var leg = document.createElement('div');
      leg.className = 'lm-legend';
      serie.forEach(function (s) {
        var it = document.createElement('span');
        it.className = 'lm-legend-item';
        it.innerHTML = '<span class="lm-swatch" style="background:' + s.colore + '"></span>' + s.nome;
        leg.appendChild(it);
      });
      wrap.appendChild(leg);
    }

    var svg = el('svg', { width: '100%', viewBox: '0 0 ' + W + ' ' + H, role: 'img' }, wrap);
    if (opts.label) el('title', {}, svg).textContent = opts.label;

    var giorni = serie[0] ? serie[0].punti.map(function (p) { return p.data; }) : [];
    function X(i) { return m.l + (W - m.l - m.r) * (giorni.length < 2 ? 0.5 : i / (giorni.length - 1)); }
    function Y(v) { return H - m.b - (H - m.t - m.b) * ((v - min) / (max - min || 1)); }

    /* griglia hairline + tick Y */
    var ticks = opts.ticks || [1, 2, 3, 4, 5];
    ticks.forEach(function (tv) {
      el('line', { x1: m.l, x2: W - m.r, y1: Y(tv), y2: Y(tv), stroke: 'var(--griglia)', 'stroke-width': 1 }, svg);
      var t = el('text', { x: m.l - 8, y: Y(tv) + 4, 'text-anchor': 'end', 'font-size': 11, fill: 'var(--inchiostro-muto)' }, svg);
      t.style.fontVariantNumeric = 'tabular-nums';
      t.textContent = tv;
    });
    /* tick X: primo, centrale, ultimo */
    [0, Math.floor((giorni.length - 1) / 2), giorni.length - 1].forEach(function (i) {
      if (i < 0 || !giorni[i]) return;
      var t = el('text', { x: X(i), y: H - 6, 'text-anchor': i === 0 ? 'start' : (i === giorni.length - 1 ? 'end' : 'middle'), 'font-size': 11, fill: 'var(--inchiostro-muto)' }, svg);
      t.textContent = LM.fmtShort(giorni[i]);
    });
    /* baseline */
    el('line', { x1: m.l, x2: W - m.r, y1: Y(min), y2: Y(min), stroke: 'var(--baseline)', 'stroke-width': 1 }, svg);

    var finali = [];
    serie.forEach(function (s) {
      var d = '', started = false, ultimo = null;
      s.punti.forEach(function (p, i) {
        if (p.valore === null) { started = false; return; }
        d += (started ? 'L' : 'M') + X(i).toFixed(1) + ',' + Y(p.valore).toFixed(1);
        started = true;
        ultimo = { i: i, v: p.valore };
      });
      if (d) el('path', { d: d, fill: 'none', stroke: s.colore, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
      if (ultimo) {
        el('circle', { cx: X(ultimo.i), cy: Y(ultimo.v), r: 3.5, fill: s.colore, stroke: 'var(--superficie-1)', 'stroke-width': 2 }, svg);
        finali.push({ s: s, y: Y(ultimo.v) });
      }
    });

    /* etichette dirette a fine linea, de-collise verticalmente:
       se più serie chiudono sullo stesso valore le etichette si
       distanziano di almeno 14px (testo in inchiostro, swatch a lato) */
    finali.sort(function (a, b) { return a.y - b.y; });
    for (var fi = 1; fi < finali.length; fi++) {
      if (finali[fi].y - finali[fi - 1].y < 14) finali[fi].y = finali[fi - 1].y + 14;
    }
    if (finali.length) {
      var overflow = finali[finali.length - 1].y - (H - m.b - 4);
      if (overflow > 0) finali.forEach(function (f) { f.y -= overflow; });
    }
    finali.forEach(function (f) {
      var yl = Math.max(m.t + 8, f.y);
      el('circle', { cx: W - m.r + 4, cy: yl, r: 3, fill: f.s.colore }, svg);
      var lbl = el('text', { x: W - m.r + 10, y: yl + 4, 'font-size': 11, fill: 'var(--inchiostro-2)' }, svg);
      lbl.textContent = f.s.nome;
    });

    /* crosshair + tooltip */
    var cross = el('line', { x1: 0, x2: 0, y1: m.t, y2: H - m.b, stroke: 'var(--baseline)', 'stroke-width': 1, 'stroke-dasharray': '2 3', visibility: 'hidden' }, svg);
    var hover = el('rect', { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b, fill: 'transparent' }, svg);
    hover.addEventListener('mousemove', function (ev) {
      var r = svg.getBoundingClientRect();
      var fx = (ev.clientX - r.left) / r.width * W;
      var best = 0, bd = 1e9;
      giorni.forEach(function (_, i) {
        var dd = Math.abs(X(i) - fx);
        if (dd < bd) { bd = dd; best = i; }
      });
      cross.setAttribute('x1', X(best));
      cross.setAttribute('x2', X(best));
      cross.setAttribute('visibility', 'visible');
      var righe = serie.map(function (s) {
        var p = s.punti[best];
        return '<span class="lm-swatch" style="background:' + s.colore + '"></span>' + s.nome + ': <b>' +
          (p && p.valore !== null ? fmtNum(p.valore) : '—') + '</b>';
      }).join('<br>');
      showTip('<b>' + LM.fmtShort(giorni[best]) + '</b><br>' + righe, ev.clientX, ev.clientY);
    });
    hover.addEventListener('mouseleave', function () { cross.setAttribute('visibility', 'hidden'); hideTip(); });
  }

  /* ---------- barre orizzontali (minuti per area) ---------- */
  /* items: [{label, icona, value, colore}] — etichetta diretta sempre
     visibile (mitiga i colori sotto 3:1 su superficie chiara). */

  function hbar(container, items, opts) {
    opts = opts || {};
    container.innerHTML = '';
    var max = Math.max.apply(null, items.map(function (i) { return i.value; }).concat([1]));
    var list = document.createElement('div');
    list.className = 'lm-hbar';
    items.forEach(function (it) {
      var row = document.createElement('div');
      row.className = 'lm-hbar-row';
      var pct = Math.max(0, it.value / max * 100);
      row.innerHTML =
        '<span class="lm-hbar-label">' + (it.icona ? it.icona + ' ' : '') + esc(it.label) + '</span>' +
        '<span class="lm-hbar-track"><span class="lm-hbar-fill" style="width:' + pct.toFixed(1) + '%;background:' + it.colore + '"></span></span>' +
        '<span class="lm-hbar-val">' + fmtNum(it.value) + (opts.unita ? '<small> ' + opts.unita + '</small>' : '') + '</span>';
      row.addEventListener('mousemove', function (ev) {
        showTip('<b>' + esc(it.label) + '</b> · ' + fmtNum(it.value) + (opts.unita ? ' ' + opts.unita : ''), ev.clientX, ev.clientY);
      });
      row.addEventListener('mouseleave', hideTip);
      list.appendChild(row);
    });
    container.appendChild(list);
  }

  /* ---------- heatmap consistenza (sequenziale, un solo blu) ---------- */
  /* giorni: [{data, valore}] — bin 0 recede verso la superficie,
     poi 4 passi della rampa blu (chiaro→scuro = poco→tanto). */

  var RAMPA_LIGHT = ['#cde2fb', '#86b6ef', '#3987e5', '#184f95'];
  var RAMPA_DARK  = ['#0d366b', '#1c5cab', '#3987e5', '#86b6ef'];

  function heatmap(container, giorni, opts) {
    opts = opts || {};
    container.innerHTML = '';
    var dark = document.documentElement.getAttribute('data-mode') === 'dark';
    var rampa = dark ? RAMPA_DARK : RAMPA_LIGHT;
    var max = Math.max.apply(null, giorni.map(function (g) { return g.valore; }).concat([1]));

    /* allinea la prima colonna a lunedì */
    var wrap = document.createElement('div');
    wrap.className = 'lm-heatmap';
    var primo = giorni[0];
    var offset = primo ? (new Date(primo.data.split('-')[0], primo.data.split('-')[1] - 1, primo.data.split('-')[2]).getDay() + 6) % 7 : 0;

    for (var i = 0; i < offset; i++) {
      var vuoto = document.createElement('span');
      vuoto.className = 'lm-cell lm-cell-vuota';
      wrap.appendChild(vuoto);
    }
    giorni.forEach(function (g) {
      var c = document.createElement('span');
      c.className = 'lm-cell';
      var bin = g.valore <= 0 ? -1 : Math.min(3, Math.floor(g.valore / max * 4));
      if (bin >= 0) c.style.background = rampa[bin];
      c.setAttribute('data-bin', bin);
      c.addEventListener('mousemove', function (ev) {
        showTip('<b>' + LM.weekdayShort(g.data) + ' ' + LM.fmtShort(g.data) + '</b> · ' + g.valore + ' XP', ev.clientX, ev.clientY);
      });
      c.addEventListener('mouseleave', hideTip);
      wrap.appendChild(c);
    });
    container.appendChild(wrap);

    var legenda = document.createElement('div');
    legenda.className = 'lm-heatmap-legend';
    legenda.innerHTML = '<span>meno</span>' +
      '<span class="lm-cell" data-bin="-1"></span>' +
      rampa.map(function (col) { return '<span class="lm-cell" style="background:' + col + '"></span>'; }).join('') +
      '<span>più</span>';
    container.appendChild(legenda);
  }

  /* ---------- anello progresso XP ---------- */

  function ring(container, pct, opts) {
    opts = opts || {};
    container.innerHTML = '';
    var S = opts.size || 84, r = (S - 10) / 2, C = 2 * Math.PI * r;
    var svg = el('svg', { width: S, height: S, viewBox: '0 0 ' + S + ' ' + S, role: 'img' }, container);
    el('title', {}, svg).textContent = opts.label || ('Progresso ' + Math.round(pct * 100) + '%');
    el('circle', { cx: S / 2, cy: S / 2, r: r, fill: 'none', stroke: 'var(--griglia)', 'stroke-width': 6 }, svg);
    var arc = el('circle', {
      cx: S / 2, cy: S / 2, r: r, fill: 'none', stroke: opts.colore || 'var(--serie-1)',
      'stroke-width': 6, 'stroke-linecap': 'round',
      'stroke-dasharray': C, 'stroke-dashoffset': C * (1 - Math.max(0, Math.min(1, pct))),
      transform: 'rotate(-90 ' + S / 2 + ' ' + S / 2 + ')'
    }, svg);
    arc.style.transition = 'stroke-dashoffset .6s cubic-bezier(.22,1,.36,1)';
    if (opts.centro) {
      var t = el('text', { x: S / 2, y: S / 2 + 1, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-size': opts.fontSize || 18, 'font-weight': 700, fill: 'var(--inchiostro-1)' }, svg);
      t.textContent = opts.centro;
    }
  }

  /* ---------- grafico esperimento A/B (N-of-1) ---------- */
  /* punti: [{data, valore|null, fase:'A'|'B'}]. Punti + segmento di
     media per fase. Fase B in blu pieno, fase A in grigio-blu:
     la distinzione è portata da colore + fascia + etichette. */

  function experiment(container, ris, opts) {
    opts = opts || {};
    container.innerHTML = '';
    var punti = ris.punti;
    var W = opts.w || container.clientWidth || 640;
    var H = opts.h || 200;
    var m = { t: 26, r: 14, b: 24, l: 30 };
    var vals = punti.filter(function (p) { return p.valore !== null; }).map(function (p) { return p.valore; });
    var min = opts.min !== undefined ? opts.min : 0;
    var max = opts.max !== undefined ? opts.max : niceCeil(Math.max.apply(null, vals.concat([1])) * 1.1);

    var svg = el('svg', { width: '100%', viewBox: '0 0 ' + W + ' ' + H, role: 'img' }, container);
    el('title', {}, svg).textContent = opts.label || 'Esperimento: baseline vs intervento';

    function X(i) { return m.l + (W - m.l - m.r) * (punti.length < 2 ? 0.5 : i / (punti.length - 1)); }
    function Y(v) { return H - m.b - (H - m.t - m.b) * ((v - min) / (max - min || 1)); }

    /* fascia della fase B (wash leggerissimo, non satura) */
    var primoB = punti.findIndex(function (p) { return p.fase === 'B'; });
    if (primoB > 0) {
      el('rect', { x: X(primoB), y: m.t, width: W - m.r - X(primoB), height: H - m.t - m.b, fill: 'var(--wash-b)' }, svg);
      var tb = el('text', { x: X(primoB) + 6, y: m.t - 8, 'font-size': 11, fill: 'var(--inchiostro-2)', 'font-weight': 600 }, svg);
      tb.textContent = 'Intervento (B)';
      var ta = el('text', { x: m.l, y: m.t - 8, 'font-size': 11, fill: 'var(--inchiostro-muto)', 'font-weight': 600 }, svg);
      ta.textContent = 'Baseline (A)';
    }

    /* griglia */
    var ticks = opts.ticks || [Math.round(min), Math.round((min + max) / 2), Math.round(max)];
    ticks.forEach(function (tv) {
      el('line', { x1: m.l, x2: W - m.r, y1: Y(tv), y2: Y(tv), stroke: 'var(--griglia)', 'stroke-width': 1 }, svg);
      var t = el('text', { x: m.l - 8, y: Y(tv) + 4, 'text-anchor': 'end', 'font-size': 11, fill: 'var(--inchiostro-muto)' }, svg);
      t.style.fontVariantNumeric = 'tabular-nums';
      t.textContent = tv;
    });

    var colA = 'var(--inchiostro-muto)', colB = 'var(--serie-1)';

    /* punti giorno */
    punti.forEach(function (p, i) {
      if (p.valore === null) return;
      var dot = el('circle', { cx: X(i), cy: Y(p.valore), r: 3.5, fill: p.fase === 'B' ? colB : colA, stroke: 'var(--superficie-1)', 'stroke-width': 2 }, svg);
      dot.addEventListener('mousemove', function (ev) {
        showTip('<b>' + LM.fmtShort(p.data) + '</b> · fase ' + p.fase + ' · <b>' + fmtNum(p.valore) + '</b>', ev.clientX, ev.clientY);
      });
      dot.addEventListener('mouseleave', hideTip);
    });

    /* segmenti media per fase */
    function mediaSeg(fase, media, colore) {
      if (media === null) return;
      var idx = punti.map(function (p, i) { return p.fase === fase ? i : -1; }).filter(function (i) { return i >= 0; });
      if (!idx.length) return;
      el('line', {
        x1: X(idx[0]), x2: X(idx[idx.length - 1]), y1: Y(media), y2: Y(media),
        stroke: colore, 'stroke-width': 2.5, 'stroke-dasharray': '6 4', 'stroke-linecap': 'round'
      }, svg);
      var t = el('text', { x: X(idx[idx.length - 1]), y: Y(media) - 7, 'text-anchor': 'end', 'font-size': 11, 'font-weight': 700, fill: 'var(--inchiostro-1)' }, svg);
      t.style.fontVariantNumeric = 'tabular-nums';
      t.textContent = 'media ' + fmtNum(media);
    }
    mediaSeg('A', ris.baseline.media, colA);
    mediaSeg('B', ris.intervento.media, colB);

    el('line', { x1: m.l, x2: W - m.r, y1: Y(min), y2: Y(min), stroke: 'var(--baseline)', 'stroke-width': 1 }, svg);
  }

  /* ---------- helper ---------- */

  function niceCeil(v) {
    /* arrotonda verso l'alto a 1/2/5 × 10^k, per assi leggibili */
    if (v <= 0) return 1;
    var k = Math.pow(10, Math.floor(Math.log10(v)));
    var f = v / k;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * k;
  }

  function fmtNum(v) {
    if (v === null || v === undefined) return '—';
    return (Math.round(v * 10) / 10).toLocaleString('it-IT');
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  return { sparkline: sparkline, trend: trend, hbar: hbar, heatmap: heatmap, ring: ring, experiment: experiment, hideTip: hideTip, esc: esc, fmtNum: fmtNum };
})();
