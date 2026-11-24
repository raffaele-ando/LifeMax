/* Kubo 2D — rig vettoriale.
 * Un solo file per: palette, geometria (curve di Bézier), espressioni degli occhi
 * (forme a punti corrispondenti, quindi interpolabili con continuità) e posa.
 * Funziona sia in Node (genera kubo.svg) sia nel browser (window.KuboRig).
 * Coordinate: origine a terra sotto Kubo, y verso il basso. "sinistra"/"destra"
 * = lato dello schermo (di chi guarda).
 */
(function (root) {
  'use strict';

  // ───────────────────────── PALETTE (unico posto) ─────────────────────────
  const PALETTE = {
    blu: '#0151e3',
    visore: '#1d2a62',
    corpo: '#ffffff',
    mezzitoni: '#e2e4f6',
    ombra: '#cbcef1',
    oro: '#fec72d',
    luce: '#f1eee9',        // occhi-luce
    fondoChiaro: '#f9f6f2',
    fondoScuro: '#0c0f18',
  };
  // Toni derivati (calcolati dalla palette, non colori nuovi a mano):
  function hex(c) { return [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); }
  function toHex(a) { return '#' + a.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join(''); }
  function mix(c1, c2, t) { const a = hex(c1), b = hex(c2); return toHex(a.map((v, i) => v + (b[i] - v) * t)); }
  PALETTE.bluOmbra = mix(PALETTE.blu, PALETTE.visore, 0.42);   // forma d'ombra delle parti blu
  PALETTE.bluLuce = mix(PALETTE.blu, '#ffffff', 0.30);         // forma di luce delle parti blu
  PALETTE.visoreLuce = mix(PALETTE.visore, '#ffffff', 0.07);    // forma di luce del visore
  PALETTE.guance = mix(PALETTE.blu, PALETTE.luce, 0.58);       // trattini delle guance

  // ───────────────────────── utilità geometriche ─────────────────────────
  const TAU = Math.PI * 2;
  const f1 = v => (Math.round(v * 10) / 10).toString();

  // Catmull-Rom chiusa → curve di Bézier cubiche (tangenti continue).
  function smoothClosed(p) {
    const n = p.length; let d = `M${f1(p[0][0])} ${f1(p[0][1])}`;
    for (let i = 0; i < n; i++) {
      const p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n];
      d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
    }
    return d + 'Z';
  }
  // superellisse: angoli "a cuscino" morbidi; nTop/nBot diversi = base più piatta
  function superellipse(cx, cy, a, b, nTop, nBot, N = 48, skew = 0) {
    const pts = [];
    for (let i = 0; i < N; i++) {
      const t = Math.PI + (i / N) * TAU; // parte da sinistra, sale sopra (orario a schermo)
      const c = Math.cos(t), s = Math.sin(t);
      const n = s < 0 ? nTop : (nBot || nTop);
      const x = a * Math.sign(c) * Math.pow(Math.abs(c), 2 / n);
      const y = b * Math.sign(s) * Math.pow(Math.abs(s), 2 / n);
      pts.push([cx + x + skew * y, cy + y]);
    }
    return pts;
  }
  function rot(pts, cx, cy, deg) {
    const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
    return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]);
  }
  function chaikin(pts, it) {
    for (let k = 0; k < it; k++) {
      const o = []; const n = pts.length;
      for (let i = 0; i < n; i++) {
        const a = pts[i], b = pts[(i + 1) % n];
        o.push([a[0] * .75 + b[0] * .25, a[1] * .75 + b[1] * .25], [a[0] * .25 + b[0] * .75, a[1] * .25 + b[1] * .75]);
      }
      pts = o;
    }
    return pts;
  }
  function area(p) { let s = 0; for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; s += a[0] * b[1] - b[0] * a[1]; } return s / 2; }
  // normalizza: verso orario a schermo, partenza dal punto più a sinistra, M punti a passo d'arco uniforme
  const M = 96;
  function normalize(p) {
    if (area(p) < 0) p = p.slice().reverse();
    let k = 0; for (let i = 1; i < p.length; i++) if (p[i][0] < p[k][0] - 1e-6 || (Math.abs(p[i][0] - p[k][0]) < 1e-6 && p[i][1] < p[k][1])) k = i;
    p = p.slice(k).concat(p.slice(0, k));
    const L = [0]; for (let i = 1; i <= p.length; i++) { const a = p[i - 1], b = p[i % p.length]; L.push(L[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
    const tot = L[L.length - 1], out = []; let j = 0;
    for (let i = 0; i < M; i++) {
      const s = tot * i / M; while (L[j + 1] < s) j++;
      const a = p[j], b = p[(j + 1) % p.length], u = (s - L[j]) / ((L[j + 1] - L[j]) || 1);
      out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]);
    }
    return out;
  }
  // contorno di un tratto spesso a capi tondi lungo una linea centrale
  function strokeOutline(center, w0, w1) {
    const n = center.length, L = [], R = [];
    for (let i = 0; i < n; i++) {
      const a = center[Math.max(0, i - 1)], b = center[Math.min(n - 1, i + 1)];
      let tx = b[0] - a[0], ty = b[1] - a[1]; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
      const w = (w0 + (w1 - w0) * i / (n - 1)) / 2;
      L.push([center[i][0] + ty * w, center[i][1] - tx * w]); // normale "alta"
      R.push([center[i][0] - ty * w, center[i][1] + tx * w]);
    }
    const cap = (c, a0, r) => { const o = []; for (let k = 1; k < 12; k++) { const t = a0 + Math.PI * k / 12; o.push([c[0] + Math.cos(t) * r, c[1] + Math.sin(t) * r]); } return o; };
    const e = center[n - 1], e2 = center[n - 2], s = center[0], s2 = center[1];
    const ae = Math.atan2(e[1] - e2[1], e[0] - e2[0]) - Math.PI / 2;
    const as = Math.atan2(s[1] - s2[1], s[0] - s2[0]) - Math.PI / 2;
    return L.concat(cap(e, ae, w1 / 2), R.reverse(), cap(s, as, w0 / 2));
  }

  // ───────────────────────── proporzioni di Kubo ─────────────────────────
  const G = {
    body: { cx: 0, cy: -246, a: 246, b: 196, n: 2.9 },
    visor: { cx: 0, cy: -256, a: 174, b: 122, n: 3.3 },
    eye: { dx: 84, cy: -264 },
    cheek: { dx: 124, cy: -216 },
    mouth: { cx: 0, cy: -228 },
    antenna: { base: [0, -440], top: [0, -494], cap: [0, -528] },
    hand: { dx: 270, cy: -252, a: 56, b: 70, tilt: 10 },
    foot: { dx: 86, cy: -52, a: 72, b: 52 },
    ground: 0,
  };

  // ───────────────────────── occhi: forme base ─────────────────────────
  // ogni forma ritorna un contorno chiuso (coordinate relative al centro occhio)
  const EyeShapes = {
    open: () => superellipse(0, 0, 32, 52, 2.4, 2.4, 64),
    happy: (side, k = 1) => { // arco ∩ spesso
      const r = 44, c = []; for (let i = 0; i <= 20; i++) { const t = Math.PI + Math.PI * (0.04 + 0.92 * i / 20); c.push([Math.cos(t) * r * 1.1, 18 + Math.sin(t) * r * 0.82 * k]); }
      return strokeOutline(c, 23, 23);
    },
    calm: () => { // arco ∪ chiuso e sereno
      const r = 30, c = []; for (let i = 0; i <= 20; i++) { const t = Math.PI * (0.92 - 0.84 * i / 20); c.push([Math.cos(t) * r * 1.05, -8 + Math.sin(t) * r * 0.62]); }
      return strokeOutline(c, 18, 18);
    },
    wink: () => { // occhio che strizza: arco basso e teso
      const c = []; for (let i = 0; i <= 20; i++) { const u = i / 20 * 2 - 1; c.push([u * 32, 4 - 16 * (1 - u * u)]); }
      return strokeOutline(c, 17, 17);
    },
    blink: () => {
      const c = []; for (let i = 0; i <= 20; i++) { const u = i / 20 * 2 - 1; c.push([u * 29, 8 + 3 * (1 - u * u)]); }
      return strokeOutline(c, 12, 12);
    },
    star: () => {
      // stella a 4 punte con lati concavi (come gli occhi "Entusiasta" di Kubo)
      const p = []; for (let i = 0; i < 64; i++) { const t = i / 64 * TAU, c = Math.cos(t), s = Math.sin(t); p.push([46 * Math.sign(c) * Math.pow(Math.abs(c), 2.3), 2 + 48 * Math.sign(s) * Math.pow(Math.abs(s), 2.3)]); }
      return chaikin(p, 2);
    },
    focus: (side) => { // determinato: palpebra tagliata in diagonale verso il centro
      const p = superellipse(0, 4, 33, 40, 2.4, 2.4, 80);
      return chaikin(p.map(([x, y]) => { const lim = -8 - 0.5 * x * side; return [x, Math.max(y, lim)]; }), 2);
    },
    sleepy: (side) => { // mezzo ovale: palpebra superiore curva, cala verso l'esterno
      const p = superellipse(0, -6, 36, 46, 2.2, 2.2, 96);
      return chaikin(p.map(([x, y]) => { const u = x / 36; const lid = -4 + 0.22 * x * side + 5 * (1 - u * u); return [x, Math.max(y, lid)]; }), 2);
    },
    spiral: (side) => {
      const c = []; const turns = 2.15; for (let i = 0; i <= 60; i++) { const t = i / 60 * turns * TAU; const r = 5 + 15 * t / TAU; c.push([side * Math.cos(t) * r, 2 + Math.sin(t) * r]); }
      return strokeOutline(c, 10, 12);
    },
  };

  // espressioni = forma per occhio + colore + guance + offset di sguardo + bocca
  const EXPR = {
    aperti:      { L: 'open',  R: 'open',  fill: 'luce', cheeks: 0.0, mouth: 0 },
    felici:      { L: 'happy', R: 'happy', fill: 'luce', cheeks: 1, mouth: 0.8 },
    battito:     { L: 'blink', R: 'blink', fill: 'luce', cheeks: 0.0, mouth: 0 },
    occhiolino:  { L: 'open',  R: 'wink',  fill: 'luce', cheeks: 1, mouth: 0 },
    stelle:      { L: 'star',  R: 'star',  fill: 'oro',  cheeks: 0.9, mouth: 0.85 },
    concentrato: { L: 'focus', R: 'focus', fill: 'luce', cheeks: 0, mouth: 0 },
    assonnato:   { L: 'sleepy', R: 'sleepy', fill: 'luce', cheeks: 0, mouth: 0 },
    confuso:     { L: 'spiral', R: 'spiral', fill: 'luce', cheeks: 0, mouth: 0 },
    sereno:      { L: 'calm', R: 'calm', fill: 'luce', cheeks: 0.8, mouth: 0 },
  };
  const EXPR_NAMES = Object.keys(EXPR);
  const shapeCache = {};
  function eyePts(name, side) { // side: -1 sinistra (schermo), +1 destra
    const key = name + side;
    if (!shapeCache[key]) {
      const e = EXPR[name]; const shape = side < 0 ? e.L : e.R;
      shapeCache[key] = normalize(EyeShapes[shape](side));
    }
    return shapeCache[key];
  }
  // weights: {nome: peso}; ritorna punti miscelati + colore
  function blendEyes(weights, side) {
    let tot = 0; for (const k in weights) tot += weights[k];
    const out = Array.from({ length: M }, () => [0, 0]); let col = [0, 0, 0], cheeks = 0, mouth = 0;
    for (const k in weights) {
      const w = weights[k] / tot; if (!w) continue;
      const p = eyePts(k, side); for (let i = 0; i < M; i++) { out[i][0] += p[i][0] * w; out[i][1] += p[i][1] * w; }
      const c = hex(PALETTE[EXPR[k].fill]); col = col.map((v, i) => v + c[i] * w);
      cheeks += EXPR[k].cheeks * w; mouth += EXPR[k].mouth * w;
    }
    return { pts: out, fill: toHex(col), cheeks, mouth };
  }
  function eyePath(pts, cx, cy, s = 1, sy = 1) { return smoothClosed(pts.map(([x, y]) => [cx + x * s, cy + y * s * sy])); }

  // ───────────────────────── altri pezzi ─────────────────────────
  function tapered(p0, p1, r0, r1) {
    const c = []; for (let i = 0; i <= 8; i++) { const u = i / 8; c.push([p0[0] + (p1[0] - p0[0]) * u, p0[1] + (p1[1] - p0[1]) * u]); }
    return smoothClosed(strokeOutline(c, r0 * 2, r1 * 2));
  }
  function handPts(side) {
    const { a, b } = G.hand; const p = [];
    for (let i = 0; i < 64; i++) {
      const t = Math.PI + i / 64 * TAU, c = Math.cos(t), s = Math.sin(t);
      // fagiolo: più largo in basso, lato verso il corpo leggermente piatto
      let x = a * Math.sign(c) * Math.pow(Math.abs(c), 2 / 2.3) * (1 + 0.13 * s);
      if (x * side < 0) x *= 0.86;
      p.push([x, b * Math.sign(s) * Math.pow(Math.abs(s), 2 / 2.2)]);
    }
    return p;
  }

  // forma "faccia" spostata in alto a sinistra: lascia una mezzaluna d'ombra in basso a destra
  function faceShift(pts, dx, dy, cx, cy, kx, ky) { return pts.map(([x, y]) => [cx + (x - cx) * kx + dx, cy + (y - cy) * ky + dy]); }

  // ───────────────────────── costruzione SVG ─────────────────────────
  function build(opts = {}) {
    const P = PALETTE, B = G.body, V = G.visor;
    const bodyPts = superellipse(B.cx, B.cy, B.a, B.b, B.n, B.n - 0.3, 72);
    const visPts = superellipse(V.cx, V.cy, V.a, V.b, V.n, V.n, 64);
    // luce sul visore: falce sottile in alto a sinistra
    const vl = []; for (let i = 0; i <= 14; i++) { const u = i / 14; const t = Math.PI * (1.08 + 0.36 * u); vl.push([V.cx - 30 + Math.cos(t) * (V.a - 26), V.cy + 18 + Math.sin(t) * (V.b - 6)]); }
    const visorLight = smoothClosed(strokeOutline(vl, 6, 13));

    const ex = blendEyes({ aperti: 1 }, -1), ex2 = blendEyes({ aperti: 1 }, 1);
    const cheek = (side) => { let d = ''; for (let i = 0; i < 3; i++) { const x = side * G.cheek.dx + (i - 1) * 13; d += tapered([x + 4, G.cheek.cy - 9], [x - 4, G.cheek.cy + 9], 4.6, 4.6); } return d; };

    const hand = (side, id) => {
      const pts = rot(handPts(side).map(([x, y]) => [side * G.hand.dx + x, G.hand.cy + y]), side * G.hand.dx, G.hand.cy, side * G.hand.tilt);
      const cx = side * G.hand.dx, cy = G.hand.cy;
      const d = smoothClosed(pts);
      return `<g id="${id}" data-perno="${f1(side * (G.hand.dx - 40))},${f1(G.hand.cy + 10)}">
      <clipPath id="clip-${id}"><path d="${d}"/></clipPath>
      <path fill="${P.bluOmbra}" d="${d}"/>
      <g clip-path="url(#clip-${id})"><path fill="${P.blu}" transform="translate(-9 -12)" d="${d}"/></g>
    </g>`;
    };
    const foot = (side, id) => {
      const cx = side * G.foot.dx, cy = G.foot.cy;
      const pts = superellipse(cx, cy, G.foot.a, G.foot.b, 2.0, 2.6, 64, side * -0.12);
      const d = smoothClosed(pts);
      return `<g id="${id}" data-perno="${f1(cx)},${f1(G.ground)}">
      <clipPath id="clip-${id}"><path d="${d}"/></clipPath>
      <path fill="${P.bluOmbra}" d="${d}"/>
      <g clip-path="url(#clip-${id})"><path fill="${P.blu}" transform="translate(-6 -11)" d="${d}"/></g>
    </g>`;
    };
    const A = G.antenna;
    const capPts = superellipse(A.cap[0], A.cap[1], 94, 45, 2.3, 3.0, 64);
    const sparks = [
      tapered([214, -512], [250, -584], 9, 14),
      tapered([262, -462], [318, -516], 9, 14),
      tapered([284, -402], [346, -426], 8, 12.5),
    ].map(d => `<path d="${d}"/>`).join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${opts.viewBox || '-420 -700 840 780'}" ${opts.attrs || ''}>
  <title>Kubo</title>
  <g id="kubo-scena">
  <g id="ombra-terra" data-perno="0,${G.ground}">
    <rect x="-160" y="${G.ground + 2}" width="320" height="24" rx="12" fill="${P.ombra}"/>
  </g>
  <g id="kubo" data-perno="0,0">
    ${foot(-1, 'piede-sinistro')}
    ${foot(1, 'piede-destro')}
    <g id="antenna" data-perno="${A.base.join(',')}">
      <g id="antenna-stelo">
        <rect x="-24" y="${A.top[1]}" width="48" height="${A.base[1] - A.top[1] + 18}" rx="12" fill="${P.bluOmbra}"/>
      </g>
      <g id="antenna-capsula" data-perno="${A.top.join(',')}">
        <clipPath id="clip-capsula"><path d="${smoothClosed(capPts)}"/></clipPath>
        <path fill="${P.bluOmbra}" d="${smoothClosed(capPts)}"/>
        <g clip-path="url(#clip-capsula)"><path fill="${P.blu}" transform="translate(-6 -12)" d="${smoothClosed(capPts)}"/></g>
        <path fill="${P.bluLuce}" d="${tapered([-58, -548], [-26, -558], 7, 6)}"/>
      </g>
    </g>
    ${hand(-1, 'mano-sinistra')}
    ${hand(1, 'mano-destra')}
    <g id="corpo" data-perno="0,${B.cy + B.b}">
      <clipPath id="clip-corpo"><path d="${smoothClosed(bodyPts)}"/></clipPath>
      <path id="corpo-ombra" fill="${P.ombra}" d="${smoothClosed(bodyPts)}"/>
      <g clip-path="url(#clip-corpo)"><ellipse id="corpo-faccia" fill="${P.corpo}" cx="-26" cy="${B.cy - 30}" rx="270" ry="214"/></g>
      <g id="visore" data-perno="${V.cx},${V.cy}">
        <clipPath id="clip-visore"><path d="${smoothClosed(visPts)}"/></clipPath>
        <path fill="${P.visore}" d="${smoothClosed(visPts)}"/>
        <path id="visore-luce" fill="${P.visoreLuce}" clip-path="url(#clip-visore)" d="${visorLight}"/>
        <g id="guance" data-perno="0,${G.cheek.cy}">
          <path id="guancia-sinistra" fill="${P.guance}" d="${cheek(-1)}"/>
          <path id="guancia-destra" fill="${P.guance}" d="${cheek(1)}"/>
        </g>
        <g id="occhio-sinistro" data-perno="${-G.eye.dx},${G.eye.cy}"><path id="occhio-sinistro-luce" fill="${ex.fill}" d="${eyePath(ex.pts, -G.eye.dx, G.eye.cy)}"/></g>
        <g id="occhio-destro" data-perno="${G.eye.dx},${G.eye.cy}"><path id="occhio-destro-luce" fill="${ex2.fill}" d="${eyePath(ex2.pts, G.eye.dx, G.eye.cy)}"/></g>
        <g id="bocca" data-perno="${G.mouth.cx},${G.mouth.cy}"><path id="bocca-forma" fill="${P.mezzitoni}" d=""/></g>
      </g>
    </g>
  </g>
  <g id="scintille" fill="${P.oro}">${sparks}</g>
  </g>
</svg>`;
  }

  // ───────────────────────── posa ─────────────────────────
  // pose: { x, y, rot, sx, sy, gazeX, gazeY, expr:{nome:peso}, eyeScale, eyeSy,
  //   handL:{x,y,rot,s}, handR:{...}, footL:{x,y,rot}, footR, antRot, antStretch,
  //   capRot, shadowS, sparks(0..1), mouth(0..1) }
  function tf(px, py, tx, ty, r, sx, sy) {
    return `translate(${f1(px + tx)} ${f1(py + ty)}) rotate(${(r || 0).toFixed(2)}) scale(${(sx ?? 1).toFixed(4)} ${(sy ?? sx ?? 1).toFixed(4)}) translate(${f1(-px)} ${f1(-py)})`;
  }
  function applyPose(doc, p) {
    const $ = id => doc.getElementById(id);
    const B = G.body, bodyPivotY = B.cy + B.b;
    const sx = p.sx ?? 1, sy = p.sy ?? 1, r = p.rot || 0;
    $('kubo').setAttribute('transform', `translate(${f1(p.x || 0)} ${f1(p.y || 0)})`);
    $('corpo').setAttribute('transform', tf(0, bodyPivotY, 0, 0, r, sx, sy));
    // punto della base antenna dopo la trasformazione del corpo
    const turn = p.turn || 0;
    $('corpo-faccia').setAttribute('cx', f1(-26 + 52 * turn));
    $('visore').setAttribute('transform', tf(G.visor.cx, G.visor.cy, 24 * turn, 0, 0, 1 - 0.07 * Math.abs(turn), 1));
    const rr = r * Math.PI / 180, bx = (G.antenna.base[0] + 16 * turn) * sx, by = (G.antenna.base[1] - bodyPivotY) * sy;
    const ax = bx * Math.cos(rr) - by * Math.sin(rr), ay = bodyPivotY + bx * Math.sin(rr) + by * Math.cos(rr);
    const A = G.antenna;
    const st = p.antStretch ?? 1, stemLen = A.base[1] - A.top[1];
    $('antenna').setAttribute('transform', `translate(${f1(ax)} ${f1(ay)}) rotate(${(r + (p.antRot || 0)).toFixed(2)}) translate(${f1(-A.base[0])} ${f1(-A.base[1])})`);
    $('antenna-stelo').setAttribute('transform', tf(A.base[0], A.base[1], 0, 0, 0, 1, st));
    $('antenna-capsula').setAttribute('transform', tf(A.top[0], A.top[1], 0, -(st - 1) * stemLen, p.capRot || 0, p.capSx ?? 1, p.capSy ?? 1));
    // punto del corpo trasformato (per attaccare mani)
    const bodyPt = (x, y) => { const X = x * sx, Y = (y - bodyPivotY) * sy; return [X * Math.cos(rr) - Y * Math.sin(rr), bodyPivotY + X * Math.sin(rr) + Y * Math.cos(rr)]; };
    for (const [id, side, h] of [['mano-sinistra', -1, p.handL], ['mano-destra', 1, p.handR]]) {
      const hp = h || {}; const cx = side * G.hand.dx, cy = G.hand.cy;
      const anchor = hp.world ? [cx, cy] : bodyPt(cx, cy);
      $(id).setAttribute('transform', tf(cx, cy, anchor[0] - cx + (hp.x || 0), anchor[1] - cy + (hp.y || 0), (hp.rot || 0) + (hp.world ? 0 : r), hp.s ?? 1, (hp.s ?? 1) * (hp.sy ?? 1)));
    }
    for (const [id, side, f] of [['piede-sinistro', -1, p.footL], ['piede-destro', 1, p.footR]]) {
      const fp = f || {}; const cx = side * G.foot.dx;
      $(id).setAttribute('transform', tf(cx, G.foot.cy, fp.x || 0, fp.y || 0, fp.rot || 0, fp.s ?? 1, (fp.s ?? 1) * (fp.sy ?? 1)));
    }
    // occhi
    // mani dietro al corpo (come «cuffie») salvo richiesta: davanti per scrivere, abbracciare…
    if (doc.getElementById('corpo').parentNode) {
      const corpo = $('corpo'), k = corpo.parentNode, front = !!p.handsFront;
      for (const id of ['mano-sinistra', 'mano-destra']) { const h = $(id); if (front) k.appendChild(h); else k.insertBefore(h, corpo); }
    }
    const w = p.expr || { aperti: 1 };
    let cheeks = 0, mouth = 0;
    for (const [side, id] of [[-1, 'occhio-sinistro'], [1, 'occhio-destro']]) {
      const e = blendEyes((side < 0 ? p.exprL : p.exprR) || w, side);
      const es = p.eyeScale ?? 1;
      const cx = side * G.eye.dx + (p.gazeX || 0) * (side * (p.gazeX || 0) > 0 ? 1.1 : 0.9), cy = G.eye.cy + (p.gazeY || 0);
      const el = $(id + '-luce'); el.setAttribute('d', eyePath(e.pts, cx, cy, es, p.eyeSy ?? 1)); el.setAttribute('fill', e.fill);
      cheeks += e.cheeks / 2; mouth += e.mouth / 2;
    }
    const ch = p.cheeks ?? cheeks;
    $('guance').setAttribute('opacity', Math.max(0, Math.min(1, ch)).toFixed(3));
    $('guance').setAttribute('transform', tf(0, G.cheek.cy, (p.gazeX || 0) * 0.6, (p.gazeY || 0) * 0.5, 0, 0.6 + 0.4 * ch, 0.6 + 0.4 * ch));
    const m = p.mouth ?? mouth;
    const mp = $('bocca-forma');
    if (m > 0.01) {
      const cx = G.mouth.cx + (p.gazeX || 0) * 0.7, cy = G.mouth.cy + (p.gazeY || 0) * 0.6;
      const pts = []; const wd = 22 + 10 * m, hd = 38 * m;
      for (let i = 0; i < 48; i++) { const t = Math.PI + i / 48 * TAU; const c = Math.cos(t), s = Math.sin(t); pts.push(s < 0 ? [cx + wd * Math.sign(c) * Math.pow(Math.abs(c), 0.3), cy - 3 * m * Math.pow(-s, 0.5)] : [cx + wd * Math.sign(c) * Math.pow(Math.abs(c), 0.8), cy + hd * Math.pow(s, 0.9)]); }
      mp.setAttribute('d', smoothClosed(pts));
    } else mp.setAttribute('d', '');
    if (p.shadowS !== undefined) { $('ombra-terra').setAttribute('transform', tf(0, G.ground + 14, p.x || 0, 0, 0, p.shadowS, 1)); $('ombra-terra').setAttribute('opacity', Math.max(0.35, Math.min(1, p.shadowS * 1.2 - 0.1)).toFixed(3)); }
    const sc = $('scintille'); if (sc && p.sparks !== undefined) { sc.setAttribute('opacity', p.sparks.toFixed(3)); }
  }

  // punto del corpo dopo squash/rotazione (coordinate locali di #kubo)
  function bodyPoint(p, x, y) {
    const py = G.body.cy + G.body.b, sx = p.sx ?? 1, sy = p.sy ?? 1, rr = (p.rot || 0) * Math.PI / 180;
    const X = x * sx, Y = (y - py) * sy; return [X * Math.cos(rr) - Y * Math.sin(rr), py + X * Math.sin(rr) + Y * Math.cos(rr)];
  }
  const api = { bodyPoint, PALETTE, G, EXPR, EXPR_NAMES, build, applyPose, blendEyes, smoothClosed, superellipse, tapered, strokeOutline, normalize, chaikin, mix, f1 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KuboRig = api;
})(typeof window !== 'undefined' ? window : globalThis);
