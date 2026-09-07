/* ============================================================
   LifeMax — micro-libreria grafici (SVG, zero dipendenze)
   Regole applicate: una sola scala Y per grafico, linee 2px,
   estremità dati arrotondate 4px ancorate alla baseline,
   griglia hairline recessiva, tooltip su hover di default,
   testo nei token di inchiostro (mai nel colore della serie),
   legenda presente quando le serie sono ≥ 2.

   COME ARRIVA A CHI DISEGNA
   Nel sito di prima era `var LMCharts = (function () { ... })()`, e stava su
   `window` perché era una variabile globale di uno `<script>`. Qui è un
   modulo, e resta anche su `window` finché il vecchio `app.js` gira accanto
   a questo.

   OGNI GRAFICO PRENDE UN CONTENITORE E CI SCRIVE DENTRO — `innerHTML = ''`
   e poi costruisce. Non è una scelta rifatta adesso: è la scelta di prima, e
   in React ci si arriva da un `useEffect` con un `ref`, che è esattamente il
   punto in cui si ha in mano un nodo vero. Riscrivere sei grafici SVG come
   alberi di JSX sarebbe un altro lavoro, e non è questo.
   ============================================================ */
import type { Giorno } from '../tipi/stato';
import { presa } from '../tipi/presa';

/* ------------------------------------------------------------- i tipi
   UN PUNTO PUÒ NON AVERE UN VALORE, e `null` non è un buco: vuol dire «quel
   giorno non hai misurato», che è diverso da zero. Tutti e sei i grafici
   ci contano sopra — la sparkline salta i giorni senza misura, la mappa di
   calore li lascia scoloriti — e per tutta la vita del file era una cosa
   che si sapeva leggendo il codice. */
export interface Punto { data: Giorno; valore: number | null }
export interface Serie { nome: string; colore: string; punti: Punto[] }
/* una barra orizzontale: l'etichetta si vede SEMPRE, non solo al passaggio
   del mouse — è la cosa che rimedia ai colori sotto il 3:1 su fondo chiaro */
export interface Voce { label: string; value: number; colore?: string; icona?: string }
export interface GiornoCaldo { data: Giorno; valore: number | null }

/* le opzioni: nessuna è obbligatoria, e questo era già vero */
export interface Opzioni {
  w?: number;
  h?: number;
  min?: number;
  max?: number;
  colore?: string;
  label?: string;
  unita?: string;
  /* i valori dell'asse verticale, scritti a mano dal chiamante */
  ticks?: number[];
  /* solo l'anello */
  size?: number;
  centro?: string;
  fontSize?: number;
}

/* il punto di un esperimento sa anche in che fase sta: prima o dopo */
export interface PuntoProva extends Punto { fase: 'A' | 'B' }
export interface Fase { n: number; media: number | null; sd: number | null }
export interface EsitoProva {
  punti: PuntoProva[];
  baseline: Fase;
  intervento: Fase;
  effetto: number | null;
}
const NS = 'http://www.w3.org/2000/svg';
const RIDOTTO = !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* animazione draw-in delle linee (disattivata con reduced-motion) */
function drawIn(pathEl: SVGPathElement, dur?: number): void {
  if (RIDOTTO) return;
  try {
    const len = pathEl.getTotalLength();
    if (!len) return;
    pathEl.style.strokeDasharray = String(len);
    pathEl.style.strokeDashoffset = String(len);
    pathEl.getBoundingClientRect();
    pathEl.style.transition = 'stroke-dashoffset ' + (dur || 700) + 'ms cubic-bezier(.22,1,.36,1)';
    pathEl.style.strokeDashoffset = '0';
    setTimeout(function () { pathEl.style.strokeDasharray = 'none'; pathEl.style.transition = ''; }, (dur || 700) + 80);
  } catch (e) { /* path non ancora in DOM: nessuna animazione */ }
}

/* IL COSTRUTTORE DI UN NODO SVG. `Attributi` con valori numerici oltre che
   stringhe perché mezzo file scrive `{ r: 1.9, cx: X(i) }`, e obbligare a
   `String(...)` in duecento posti non avrebbe reso più chiaro niente.
   Il tipo di ritorno è generico sulla mappa dei tag: `el('path', ...)` torna
   un `SVGPathElement`, che è quello che serve a `drawIn`. */
type Attributi = Record<string, string | number>;
function el<K extends keyof SVGElementTagNameMap>(
  tag: K, attrs: Attributi, parent?: Element
): SVGElementTagNameMap[K] {
  const n = document.createElementNS(NS, tag) as SVGElementTagNameMap[K];
  for (const k in attrs) n.setAttribute(k, String(attrs[k]));
  if (parent) parent.appendChild(n);
  return n;
}

/* ---------- tooltip condiviso ---------- */

let tip: HTMLDivElement | null = null;
function tooltip(): HTMLDivElement {
  if (!tip) {
    tip = document.createElement('div');
    tip.className = 'lm-tooltip';
    tip.setAttribute('role', 'status');
    document.body.appendChild(tip);
  }
  return tip;
}
function showTip(html: string, x: number, y: number): void {
  const t = tooltip();
  t.innerHTML = html;
  t.style.display = 'block';
  const r = t.getBoundingClientRect();
  const left = Math.min(window.innerWidth - r.width - 8, x + 12);
  let top = y - r.height - 10;
  if (top < 4) top = y + 14;
  t.style.left = Math.max(4, left) + 'px';
  t.style.top = top + 'px';
}
function hideTip(): void { if (tip) tip.style.display = 'none'; }

/* ---------- sparkline (linea singola, in card) ---------- */
/* valori: [{data, valore|null}]. Scala Y dichiarata dal chiamante
   (min/max) così tutte le card della stessa metrica condividono
   la scala e restano confrontabili. */

function sparkline(container: HTMLElement, punti: Punto[], opzioni?: Opzioni): void {
  const opts: Opzioni = opzioni || {};
  container.innerHTML = '';
  const W = opts.w || container.clientWidth || 220;
  const H = opts.h || 44;
  const pad = 3;
  const min = opts.min !== undefined ? opts.min : 0;
  const max = opts.max !== undefined ? opts.max : Math.max.apply(null, punti.map(function (p) { return p.valore || 0; }).concat([1]));
  const colore = opts.colore || 'var(--serie-1)';

  const svg = el('svg', { width: '100%', height: H, viewBox: '0 0 ' + W + ' ' + H, 'aria-hidden': 'false', role: 'img' }, container);
  /* un titolo c'è sempre: un grafico senza nome è muto per chi usa lo screen reader */
  el('title', {}, svg).textContent = opts.label || 'Andamento nel tempo';

  function X(i: number) { return pad + (W - 2 * pad) * (punti.length < 2 ? 0.5 : i / (punti.length - 1)); }
  function Y(v: number) { return H - pad - (H - 2 * pad) * ((v - min) / (max - min || 1)); }

  /* la sparkline collega i punti misurati saltando i giorni senza
     misura (comportamento standard); i pallini marcano i giorni
     in cui la misura c'è davvero, così la densità resta leggibile */
  /* «il punto i, che vale v»: prima era un oggetto senza nome dentro a un
     array senza tipo, e la `i` di dentro e la `i` del ciclo di fuori si
     somigliavano fin troppo */
  const noti: { i: number; v: number }[] = [];
  punti.forEach(function (p, i) { if (p.valore !== null) noti.push({ i: i, v: p.valore }); });
  let d = '';
  const ultimo = noti.length ? presa(noti[noti.length - 1]) : null;
  noti.forEach(function (n, j) {
    d += (j ? 'L' : 'M') + X(n.i).toFixed(1) + ',' + Y(n.v).toFixed(1);
  });
  /* area sfumata sotto la linea (solo estetica: 14% → 0) */
  if (d) {
    const gid = 'sg' + Math.random().toString(36).slice(2, 8);
    const defs = el('defs', {}, svg);
    const grad = el('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    const s1 = el('stop', { offset: '0', 'stop-opacity': '.16' }, grad); s1.setAttribute('stop-color', colore.indexOf('var(') === 0 ? '#2a78d6' : colore);
    const s2 = el('stop', { offset: '1', 'stop-opacity': '0' }, grad); s2.setAttribute('stop-color', colore.indexOf('var(') === 0 ? '#2a78d6' : colore);
    void s1; void s2;
    /* area chiusa sulla baseline lungo i punti noti */
    if (noti.length > 1) {
      let dArea = 'M' + X(presa(noti[0]).i).toFixed(1) + ',' + (H - pad);
      noti.forEach(function (n) { dArea += 'L' + X(n.i).toFixed(1) + ',' + Y(n.v).toFixed(1); });
      dArea += 'L' + X(presa(noti[noti.length - 1]).i).toFixed(1) + ',' + (H - pad) + 'Z';
      el('path', { d: dArea, fill: 'url(#' + gid + ')', stroke: 'none' }, svg);
    }
    const linea = el('path', { d: d, fill: 'none', stroke: colore, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
    drawIn(linea);
  }
  noti.forEach(function (n) {
    el('circle', { cx: X(n.i), cy: Y(n.v), r: 1.9, fill: colore }, svg);
  });
  if (ultimo) {
    el('circle', { cx: X(ultimo.i), cy: Y(ultimo.v), r: 6.5, fill: colore, opacity: '.16' }, svg);
    el('circle', { cx: X(ultimo.i), cy: Y(ultimo.v), r: 3, fill: colore, stroke: 'var(--superficie-1)', 'stroke-width': 2 }, svg);
  }

  /* hover leggero: overlay che segue il punto più vicino */
  const hover = el('rect', { x: 0, y: 0, width: W, height: H, fill: 'transparent' }, svg);
  hover.addEventListener('mousemove', function (ev) {
    const r = svg.getBoundingClientRect();
    const fx = (ev.clientX - r.left) / r.width * W;
    /* IL PIÙ VICINO, CERCATO E NON RICORDATO. Prima era una variabile
       riempita dentro alla richiamata e letta fuori: funziona, ma il
       compilatore non può sapere che quella richiamata è già girata quando
       si arriva a leggerla — e infatti qui diceva «questo è sempre niente».
       Aveva ragione a non fidarsi: è la stessa forma di uno stato di React
       letto troppo presto, che in questo progetto è già costato un difetto
       vero (il «Non del tutto» del timer che non registrava niente). */
    const vicino = punti.reduce<{ p: Punto; i: number } | null>(function (meglio, p, i) {
      if (p.valore === null) return meglio;
      const dd = Math.abs(X(i) - fx);
      return (meglio === null || dd < Math.abs(X(meglio.i) - fx)) ? { p: p, i: i } : meglio;
    }, null);
    if (vicino) {
      showTip('<b>' + window.LM.fmtShort(vicino.p.data) + '</b> · ' + fmtNum(vicino.p.valore) + (opts.unita ? ' ' + opts.unita : ''), ev.clientX, ev.clientY);
    }
  });
  hover.addEventListener('mouseleave', hideTip);
}

/* ---------- linea multi-serie con assi (trend check-in) ---------- */
/* serie: [{nome, colore, punti:[{data,valore|null}]}] — max 4.
   Una sola scala Y. Legenda sempre presente (≥2 serie) +
   etichetta diretta a fine linea. Crosshair + tooltip. */

function trend(container: HTMLElement, serie: Serie[], opzioni?: Opzioni): void {
  const opts: Opzioni = opzioni || {};
  container.innerHTML = '';
  const W = opts.w || container.clientWidth || 640;
  const H = opts.h || 220;
  const m = { t: 12, r: 84, b: 24, l: 30 };
  const min = opts.min !== undefined ? opts.min : 0;
  const max = opts.max !== undefined ? opts.max : 5;

  const wrap = document.createElement('div');
  wrap.className = 'lm-chart';
  container.appendChild(wrap);

  /* legenda (identità mai affidata al solo colore) */
  if (serie.length >= 2) {
    const leg = document.createElement('div');
    leg.className = 'lm-legend';
    serie.forEach(function (s) {
      const it = document.createElement('span');
      it.className = 'lm-legend-item';
      it.innerHTML = '<span class="lm-swatch" style="background:' + s.colore + '"></span>' + s.nome;
      leg.appendChild(it);
    });
    wrap.appendChild(leg);
  }

  const svg = el('svg', { width: '100%', viewBox: '0 0 ' + W + ' ' + H, role: 'img' }, wrap);
  el('title', {}, svg).textContent = opts.label || 'Confronto tra serie nel tempo';

  const prima = serie[0];
  const giorni: Giorno[] = prima ? prima.punti.map(function (p) { return p.data; }) : [];
  function X(i: number) { return m.l + (W - m.l - m.r) * (giorni.length < 2 ? 0.5 : i / (giorni.length - 1)); }
  function Y(v: number) { return H - m.b - (H - m.t - m.b) * ((v - min) / (max - min || 1)); }

  /* griglia hairline + tick Y */
  const ticks = opts.ticks || [1, 2, 3, 4, 5];
  ticks.forEach(function (tv) {
    el('line', { x1: m.l, x2: W - m.r, y1: Y(tv), y2: Y(tv), stroke: 'var(--griglia)', 'stroke-width': 1 }, svg);
    const t = el('text', { x: m.l - 8, y: Y(tv) + 4, 'text-anchor': 'end', 'font-size': 11, fill: 'var(--inchiostro-muto)' }, svg);
    t.style.fontVariantNumeric = 'tabular-nums';
    t.textContent = String(tv);
  });
  /* tick X: primo, centrale, ultimo */
  [0, Math.floor((giorni.length - 1) / 2), giorni.length - 1].forEach(function (i) {
    const g = giorni[i];
    if (i < 0 || !g) return;
    const t = el('text', { x: X(i), y: H - 6, 'text-anchor': i === 0 ? 'start' : (i === giorni.length - 1 ? 'end' : 'middle'), 'font-size': 11, fill: 'var(--inchiostro-muto)' }, svg);
    t.textContent = window.LM.fmtShort(g);
  });
  /* baseline */
  el('line', { x1: m.l, x2: W - m.r, y1: Y(min), y2: Y(min), stroke: 'var(--baseline)', 'stroke-width': 1 }, svg);

  const finali: { s: Serie; y: number }[] = [];
  serie.forEach(function (s) {
    let d = '', started = false;
    s.punti.forEach(function (p, i) {
      if (p.valore === null) { started = false; return; }
      d += (started ? 'L' : 'M') + X(i).toFixed(1) + ',' + Y(p.valore).toFixed(1);
      started = true;
    });
    /* l'ultimo punto misurato si CERCA, non si ricorda dentro al ciclo: vedi
       il commento nella sparkline qui sopra */
    const noti = s.punti
      .map(function (p, i) { return { i: i, v: p.valore }; })
      .filter(function (x): x is { i: number; v: number } { return x.v !== null; });
    const ultimo = noti.length ? presa(noti[noti.length - 1]) : null;
    if (d) drawIn(el('path', { d: d, fill: 'none', stroke: s.colore, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg), 800);
    if (ultimo) {
      el('circle', { cx: X(ultimo.i), cy: Y(ultimo.v), r: 3.5, fill: s.colore, stroke: 'var(--superficie-1)', 'stroke-width': 2 }, svg);
      finali.push({ s: s, y: Y(ultimo.v) });
    }
  });

  /* etichette dirette a fine linea, de-collise verticalmente:
     se più serie chiudono sullo stesso valore le etichette si
     distanziano di almeno 14px (testo in inchiostro, swatch a lato) */
  /* La distanza minima si applicava, ma poi ogni etichetta veniva riportata
     dentro il bordo alto UNA PER UNA (Math.max(m.t + 8, y)): due etichette
     spinte oltre il bordo finivano schiacciate sulla stessa riga e si
     leggevano sovrapposte («Focus» sopra «Umore»). Ora la sistemata è una
     sola per tutte: passata in avanti dal bordo alto, e se si sfonda quello
     basso passata all'indietro con lo stesso passo — che si stringe se le
     serie sono tante e il grafico è basso. */
  finali.sort(function (a, b) { return a.y - b.y; });
  const n = finali.length;
  if (n) {
    const alto = m.t + 8, basso = H - m.b - 4;
    let passo = 14;
    if (n > 1 && (n - 1) * passo > basso - alto) passo = Math.max(9, (basso - alto) / (n - 1));
    let k;
    for (k = 0; k < n; k++) {
      const qui = presa(finali[k]);
      const minimo = k === 0 ? alto : presa(finali[k - 1]).y + passo;
      if (qui.y < minimo) qui.y = minimo;
    }
    if (presa(finali[n - 1]).y > basso) {
      presa(finali[n - 1]).y = basso;
      for (k = n - 2; k >= 0; k--) {
        const qui = presa(finali[k]), dopo = presa(finali[k + 1]);
        if (qui.y > dopo.y - passo) qui.y = dopo.y - passo;
      }
      if (presa(finali[0]).y < alto) for (k = 0; k < n; k++) presa(finali[k]).y = alto + k * passo;
    }
  }
  finali.forEach(function (f) {
    el('circle', { cx: W - m.r + 4, cy: f.y, r: 3, fill: f.s.colore }, svg);
    const lbl = el('text', { x: W - m.r + 10, y: f.y + 4, 'font-size': 11, fill: 'var(--inchiostro-2)' }, svg);
    lbl.textContent = f.s.nome;
  });

  /* crosshair + tooltip */
  const cross = el('line', { x1: 0, x2: 0, y1: m.t, y2: H - m.b, stroke: 'var(--baseline)', 'stroke-width': 1, 'stroke-dasharray': '2 3', visibility: 'hidden' }, svg);
  const hover = el('rect', { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b, fill: 'transparent' }, svg);
  hover.addEventListener('mousemove', function (ev) {
    const r = svg.getBoundingClientRect();
    const fx = (ev.clientX - r.left) / r.width * W;
    let best = 0, bd = 1e9;
    giorni.forEach(function (_, i) {
      const dd = Math.abs(X(i) - fx);
      if (dd < bd) { bd = dd; best = i; }
    });
    cross.setAttribute('x1', String(X(best)));
    cross.setAttribute('x2', String(X(best)));
    cross.setAttribute('visibility', 'visible');
    const righe = serie.map(function (s) {
      const p = s.punti[best];
      return '<span class="lm-swatch" style="background:' + s.colore + '"></span>' + s.nome + ': <b>' +
        (p && p.valore !== null ? fmtNum(p.valore) : '—') + '</b>';
    }).join('<br>');
    const g = giorni[best];
    showTip('<b>' + (g ? window.LM.fmtShort(g) : '—') + '</b><br>' + righe, ev.clientX, ev.clientY);
  });
  hover.addEventListener('mouseleave', function () { cross.setAttribute('visibility', 'hidden'); hideTip(); });
}

/* ---------- barre orizzontali (minuti per area) ---------- */
/* items: [{label, icona, value, colore}] — etichetta diretta sempre
   visibile (mitiga i colori sotto 3:1 su superficie chiara). */

function hbar(container: HTMLElement, items: Voce[], opzioni?: Opzioni): void {
  const opts: Opzioni = opzioni || {};
  container.innerHTML = '';
  const max = Math.max.apply(null, items.map(function (i) { return i.value; }).concat([1]));
  const list = document.createElement('div');
  list.className = 'lm-hbar';
  items.forEach(function (it) {
    const row = document.createElement('div');
    row.className = 'lm-hbar-row';
    const pct = Math.max(0, it.value / max * 100);
    row.innerHTML =
      '<span class="lm-hbar-label" style="--c-riga:' + it.colore + '">' + (it.icona ? it.icona + ' ' : '') + esc(it.label) + '</span>' +
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

const RAMPA_LIGHT = ['#cde2fb', '#86b6ef', '#3987e5', '#184f95'];
const RAMPA_DARK  = ['#0d366b', '#1c5cab', '#3987e5', '#86b6ef'];

function heatmap(container: HTMLElement, giorni: GiornoCaldo[], opzioni?: Opzioni): void {
  void (opzioni || {});
  container.innerHTML = '';
  const dark = document.documentElement.getAttribute('data-mode') === 'dark';
  const rampa = dark ? RAMPA_DARK : RAMPA_LIGHT;
  const max = Math.max.apply(null, giorni.map(function (g) { return g.valore || 0; }).concat([1]));

  /* allinea la prima colonna a lunedì */
  const wrap = document.createElement('div');
  wrap.className = 'lm-heatmap';
  const primo = giorni[0];
  const pezzi = primo ? primo.data.split('-') : [];
  const offset = primo ? (new Date(+(pezzi[0] || 0), +(pezzi[1] || 1) - 1, +(pezzi[2] || 1)).getDay() + 6) % 7 : 0;

  for (let i = 0; i < offset; i++) {
    const vuoto = document.createElement('span');
    vuoto.className = 'lm-cell lm-cell-vuota';
    wrap.appendChild(vuoto);
  }
  giorni.forEach(function (g, gi) {
    const c = document.createElement('span');
    c.className = 'lm-cell';
    c.style.setProperty('--i', String(gi));
    const quanto = g.valore || 0;
    const bin = quanto <= 0 ? -1 : Math.min(3, Math.floor(quanto / max * 4));
    if (bin >= 0) c.style.background = rampa[bin] || '';
    c.setAttribute('data-bin', String(bin));
    c.addEventListener('mousemove', function (ev) {
      showTip('<b>' + window.LM.weekdayShort(g.data) + ' ' + window.LM.fmtShort(g.data) + '</b> · ' + quanto + ' XP', ev.clientX, ev.clientY);
    });
    c.addEventListener('mouseleave', hideTip);
    wrap.appendChild(c);
  });
  container.appendChild(wrap);

  const legenda = document.createElement('div');
  legenda.className = 'lm-heatmap-legend';
  legenda.innerHTML = '<span>meno</span>' +
    '<span class="lm-cell" data-bin="-1"></span>' +
    rampa.map(function (col) { return '<span class="lm-cell" style="background:' + col + '"></span>'; }).join('') +
    '<span>più</span>';
  container.appendChild(legenda);
}

/* ---------- anello progresso XP ---------- */

function ring(container: HTMLElement, pct: number, opzioni?: Opzioni): void {
  const opts: Opzioni = opzioni || {};
  container.innerHTML = '';
  const S = opts.size || 84, r = (S - 10) / 2, C = 2 * Math.PI * r;
  const svg = el('svg', { width: S, height: S, viewBox: '0 0 ' + S + ' ' + S, role: 'img' }, container);
  el('title', {}, svg).textContent = opts.label || ('Progresso ' + Math.round(pct * 100) + '%');
  /* stroke con gradiente brand (i grafici-dato restano sulla palette serie) */
  const rgId = 'rg' + Math.random().toString(36).slice(2, 8);
  const rgDefs = el('defs', {}, svg);
  const rgGrad = el('linearGradient', { id: rgId, x1: 0, y1: 1, x2: 1, y2: 0 }, rgDefs);
  el('stop', { offset: '0', style: 'stop-color:var(--brand-a)' }, rgGrad);
  el('stop', { offset: '.55', style: 'stop-color:var(--brand-b)' }, rgGrad);
  el('stop', { offset: '1', style: 'stop-color:var(--brand-c)' }, rgGrad);
  el('circle', { cx: S / 2, cy: S / 2, r: r, fill: 'none', stroke: 'var(--griglia)', 'stroke-width': 6 }, svg);
  const arc = el('circle', {
    cx: S / 2, cy: S / 2, r: r, fill: 'none', stroke: opts.colore || ('url(#' + rgId + ')'),
    'stroke-width': 6, 'stroke-linecap': 'round',
    'stroke-dasharray': C, 'stroke-dashoffset': C * (1 - Math.max(0, Math.min(1, pct))),
    transform: 'rotate(-90 ' + S / 2 + ' ' + S / 2 + ')'
  }, svg);
  arc.style.transition = 'stroke-dashoffset .6s cubic-bezier(.22,1,.36,1)';
  if (opts.centro) {
    const t = el('text', { x: S / 2, y: S / 2 + 1, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-size': opts.fontSize || 18, 'font-weight': 700, fill: 'var(--inchiostro-1)' }, svg);
    t.textContent = opts.centro;
  }
}

/* ---------- grafico esperimento A/B (N-of-1) ---------- */
/* punti: [{data, valore|null, fase:'A'|'B'}]. Punti + segmento di
   media per fase. Fase B in blu pieno, fase A in grigio-blu:
   la distinzione è portata da colore + fascia + etichette. */

function experiment(container: HTMLElement, ris: EsitoProva, opzioni?: Opzioni): void {
  const opts: Opzioni = opzioni || {};
  container.innerHTML = '';
  const punti = ris.punti;
  const W = opts.w || container.clientWidth || 640;
  const H = opts.h || 200;
  const m = { t: 26, r: 14, b: 24, l: 30 };
  const vals = punti.filter(function (p) { return p.valore !== null; }).map(function (p) { return p.valore || 0; });
  const min = opts.min !== undefined ? opts.min : 0;
  const max = opts.max !== undefined ? opts.max : niceCeil(Math.max.apply(null, vals.concat([1])) * 1.1);

  const svg = el('svg', { width: '100%', viewBox: '0 0 ' + W + ' ' + H, role: 'img' }, container);
  el('title', {}, svg).textContent = opts.label || 'Esperimento: baseline vs intervento';

  function X(i: number) { return m.l + (W - m.l - m.r) * (punti.length < 2 ? 0.5 : i / (punti.length - 1)); }
  function Y(v: number) { return H - m.b - (H - m.t - m.b) * ((v - min) / (max - min || 1)); }

  /* fascia della fase B (wash leggerissimo, non satura) */
  const primoB = punti.findIndex(function (p) { return p.fase === 'B'; });
  if (primoB > 0) {
    el('rect', { x: X(primoB), y: m.t, width: W - m.r - X(primoB), height: H - m.t - m.b, fill: 'var(--wash-b)' }, svg);
    const tb = el('text', { x: X(primoB) + 6, y: m.t - 8, 'font-size': 11, fill: 'var(--inchiostro-2)', 'font-weight': 600 }, svg);
    tb.textContent = 'Dopo la modifica';
    const ta = el('text', { x: m.l, y: m.t - 8, 'font-size': 11, fill: 'var(--inchiostro-muto)', 'font-weight': 600 }, svg);
    ta.textContent = 'Prima (base)';
  }

  /* griglia */
  const ticks = opts.ticks || [Math.round(min), Math.round((min + max) / 2), Math.round(max)];
  ticks.forEach(function (tv) {
    el('line', { x1: m.l, x2: W - m.r, y1: Y(tv), y2: Y(tv), stroke: 'var(--griglia)', 'stroke-width': 1 }, svg);
    const t = el('text', { x: m.l - 8, y: Y(tv) + 4, 'text-anchor': 'end', 'font-size': 11, fill: 'var(--inchiostro-muto)' }, svg);
    t.style.fontVariantNumeric = 'tabular-nums';
    t.textContent = String(tv);
  });

  const colA = 'var(--inchiostro-muto)', colB = 'var(--serie-1)';

  /* punti giorno */
  punti.forEach(function (p, i) {
    const v = p.valore;
    if (v === null) return;
    const dot = el('circle', { cx: X(i), cy: Y(v), r: 3.5, fill: p.fase === 'B' ? colB : colA, stroke: 'var(--superficie-1)', 'stroke-width': 2 }, svg);
    dot.addEventListener('mousemove', function (ev) {
      showTip('<b>' + window.LM.fmtShort(p.data) + '</b> · ' + (p.fase === 'B' ? 'dopo la modifica' : 'prima') + ' · <b>' + fmtNum(v) + '</b>', ev.clientX, ev.clientY);
    });
    dot.addEventListener('mouseleave', hideTip);
  });

  /* segmenti media per fase */
  function mediaSeg(fase: 'A' | 'B', media: number | null, colore: string) {
    if (media === null) return;
    const idx = punti.map(function (p, i) { return p.fase === fase ? i : -1; }).filter(function (i) { return i >= 0; });
    if (!idx.length) return;
    const primo = presa(idx[0]), ultimo = presa(idx[idx.length - 1]);
    el('line', {
      x1: X(primo), x2: X(ultimo), y1: Y(media), y2: Y(media),
      stroke: colore, 'stroke-width': 2.5, 'stroke-dasharray': '6 4', 'stroke-linecap': 'round'
    }, svg);
    const t = el('text', { x: X(ultimo), y: Y(media) - 7, 'text-anchor': 'end', 'font-size': 11, 'font-weight': 700, fill: 'var(--inchiostro-1)' }, svg);
    t.style.fontVariantNumeric = 'tabular-nums';
    t.textContent = 'media ' + fmtNum(media);
  }
  mediaSeg('A', ris.baseline.media, colA);
  mediaSeg('B', ris.intervento.media, colB);

  el('line', { x1: m.l, x2: W - m.r, y1: Y(min), y2: Y(min), stroke: 'var(--baseline)', 'stroke-width': 1 }, svg);
}

/* ---------- helper ---------- */

function niceCeil(v: number): number {
  /* arrotonda verso l'alto a 1/2/5 × 10^k, per assi leggibili */
  if (v <= 0) return 1;
  const k = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / k;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * k;
}

function fmtNum(v: number | null | undefined): string {
  if (v === null || v === undefined) return '—';
  return (Math.round(v * 10) / 10).toLocaleString('it-IT');
}

const FUGA: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
function esc(s: unknown): string {
  return String(s).replace(/[&<>"']/g, function (c) { return FUGA[c] || c; });
}

export const LMCharts = {
  sparkline: sparkline, trend: trend, hbar: hbar, heatmap: heatmap,
  ring: ring, experiment: experiment, hideTip: hideTip, esc: esc, fmtNum: fmtNum
};
export type Grafici = typeof LMCharts;

/* finché il vecchio `app.js` gira accanto a questo */
window.LMCharts = LMCharts;
