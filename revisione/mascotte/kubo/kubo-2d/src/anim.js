/* Kubo — «7 giorni di fila». Animazione deterministica: window.render(t).
 * - tracce a spline di Hermite (tangenti Catmull-Rom non uniformi → velocità continua);
 * - antenna, mani, piedi, rimbalzo del corpo: molle integrate a passo fisso (1/480 s),
 *   precalcolate una volta sola → ogni t dà sempre lo stesso fotogramma.
 */
(function () {
  'use strict';
  const R = window.KuboRig, P = R.PALETTE, G = R.G;
  const DURATION = 4.4, FPS_SIM = 480;

  // ───────────── tracce: [t, valore, tangenteIn?, tangenteOut?] ─────────────
  function track(keys) {
    const n = keys.length, m = [];
    for (let i = 0; i < n; i++) {
      const k = keys[i];
      let def = 0;
      if (i > 0 && i < n - 1) def = (keys[i + 1][1] - keys[i - 1][1]) / (keys[i + 1][0] - keys[i - 1][0]);
      m.push([k[2] ?? def, k[3] ?? k[2] ?? def]);
    }
    return t => {
      if (t <= keys[0][0]) return keys[0][1];
      if (t >= keys[n - 1][0]) return keys[n - 1][1];
      let i = 0; while (keys[i + 1][0] < t) i++;
      const [t0, p0] = keys[i], [t1, p1] = keys[i + 1], h = t1 - t0, s = (t - t0) / h;
      const s2 = s * s, s3 = s2 * s;
      return (2 * s3 - 3 * s2 + 1) * p0 + (s3 - 2 * s2 + s) * h * m[i][1] + (-2 * s3 + 3 * s2) * p1 + (s3 - s2) * h * m[i + 1][0];
    };
  }
  const smoother = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * x * (x * (x * 6 - 15) + 10);

  // ───────────── la recitazione ─────────────
  const T_TAKEOFF = 0.70, T_APEX = 0.99, T_LAND = 1.30;
  const tr = {
    // radice: spinta (0.62→0.70), parabola esatta (tangenti coerenti), atterraggio
    y: track([[0, 0], [0.62, 0, 0], [T_TAKEOFF, -70, -1448], [T_APEX, -280, 0], [T_LAND, 0, 1806, 0], [DURATION, 0, 0]]),
    x: track([[0, 0], [0.62, 0, 0], [T_LAND, 26, 60, 0], [2.4, 26, 0], [3.9, 0, 0], [DURATION, 0, 0]]),
    // schiacciamento/allungamento disegnato (il rimbalzo elastico dopo l'atterraggio è una molla)
    sy: track([[0, 1], [0.12, 1.012], [0.28, 0.995, 0], [0.52, 0.80, 0], [0.585, 0.83], [0.665, 1.15], [0.82, 1.06], [T_APEX, 1.0], [1.22, 1.06], [T_LAND, 1.05, 0.4, 0], [3.0, 1.0], [3.4, 1.01], [DURATION, 1, 0]]),
    rot: track([[0, 0], [0.3, 0.5], [0.58, 4, 0], [0.72, -5], [T_APEX, -7], [T_LAND, 3], [1.5, 0], [1.7, -5], [2.4, -4], [2.75, 5], [3.5, 5], [3.95, 0], [DURATION, 0, 0]]),
    turn: track([[0, 0], [1.45, 0, 0], [1.75, -0.4], [2.45, -0.35], [2.75, 0.05], [3.6, 0.0], [DURATION, 0]]),
    gazeX: track([[0, 0], [1.45, 0, 0], [1.62, -16], [2.4, -14], [2.65, 0], [DURATION, 0]]),
    gazeY: track([[0, 0], [0.3, 0], [0.55, 8], [0.75, -8], [1.1, -10], [T_LAND, 4], [1.45, 0], [1.62, -14], [2.4, -10], [2.65, 0], [DURATION, 0]]),
    mouth: track([[0, 0], [0.6, 0, 0], [0.74, 0.75], [1.2, 0.6], [1.45, 0.35], [1.78, 0.9], [2.3, 0.8], [2.6, 0.45], [3.4, 0.5], [3.8, 0], [DURATION, 0]]),
    eyeScale: track([[0, 1], [1.5, 1, 0], [1.6, 1.16], [1.75, 0.98], [1.9, 1.05], [2.1, 1], [DURATION, 1]]),
    // mani: offset rispetto al corpo [x, y, rot] per lato (−1 sinistra schermo, +1 destra)
    hLx: track([[0, 0], [0.3, 0], [0.58, -12], [0.82, -20], [1.15, -26], [1.45, -10], [1.8, -14], [2.4, -10], [2.8, 0], [3.6, 6], [4.0, 0], [DURATION, 0]]),
    hLy: track([[0, 0], [0.3, 0], [0.58, 46, 0], [0.82, -200], [1.15, -215], [1.45, -40], [1.8, -110], [2.4, -90], [2.8, 10], [3.6, 14], [4.0, 0], [DURATION, 0]]),
    hLr: track([[0, 0], [0.3, 0], [0.58, 22], [0.82, -35], [1.15, -30], [1.45, -10], [1.8, 30], [2.4, 26], [2.8, -4], [4.0, 0], [DURATION, 0]]),
    hRx: track([[0, 0], [0.3, 0], [0.58, 12], [0.82, 20], [1.15, 26], [1.45, 10], [1.8, 14], [2.4, 10], [2.7, 46], [3.55, 46], [3.95, 0], [DURATION, 0]]),
    hRy: track([[0, 0], [0.3, 0], [0.58, 46, 0], [0.82, -200], [1.15, -215], [1.45, -40], [1.8, -110], [2.4, -90], [2.7, -175], [3.55, -175], [3.95, 0], [DURATION, 0]]),
    // saluto: oscillazione continua (Catmull-Rom → arco morbido, niente soste)
    hRr: track([[0, 0], [0.3, 0], [0.58, -22], [0.82, 35], [1.15, 30], [1.45, 10], [1.8, -30], [2.4, -26], [2.7, 30], [2.88, -6], [3.06, 34], [3.24, -6], [3.42, 30], [3.62, 6], [3.95, 0], [DURATION, 0]]),
    badge: track([[0, 0], [1.40, 0, 0], [1.56, 1.2], [1.68, 0.92], [1.80, 1.04], [1.95, 0.99], [2.1, 1, 0], [DURATION, 1]]),
    badgeRot: track([[0, -18], [1.40, -18, 0], [1.58, 6], [1.75, -3], [1.95, 0], [DURATION, 0]]),
    sparks: track([[0, 0], [1.30, 0, 0], [1.42, 1.25], [1.56, 0.92], [1.7, 1.0], [2.2, 1.0], [2.5, 0, 0], [DURATION, 0]]),
  };
  // occhi: transizioni fra espressioni (morph continuo dei contorni)
  const EYES = [
    [0, 'aperti', 0], [0.34, 'concentrato', 0.16], [0.63, 'felici', 0.10],
    [1.50, 'aperti', 0.08], [1.74, 'stelle', 0.14], [2.50, 'felici', 0.12],
    [2.98, 'occhiolino', 0.10], [3.40, 'felici', 0.12], [3.92, 'aperti', 0.14], [4.16, 'battito', 0.05], [4.23, 'aperti', 0.08],
  ];
  function eyeWeights(t) {
    let w = { [EYES[0][1]]: 1 };
    for (let i = 1; i < EYES.length; i++) {
      const [t0, name, d] = EYES[i]; if (t < t0) break;
      const u = smoother((t - t0) / d), nw = {};
      for (const k in w) nw[k] = (nw[k] || 0) + w[k] * (1 - u);
      nw[name] = (nw[name] || 0) + u; w = nw;
    }
    return w;
  }

  // ───────────── simulazione a molla, passo fisso ─────────────
  function spring(x, v, target, f, zeta, dt) { // f in Hz
    const w = 2 * Math.PI * f; const a = w * w * (target - x) - 2 * zeta * w * v;
    v += a * dt; x += v * dt; return [x, v];
  }
  function basePose(t) {
    return { x: tr.x(t), y: tr.y(t), rot: tr.rot(t), sy: tr.sy(t), turn: tr.turn(t) };
  }
  const N = Math.ceil(DURATION * FPS_SIM) + 2, dt = 1 / FPS_SIM;
  const SIM = []; // per passo: {q, rq, hands[2]{x,y,r}, feet[2]{x,y,r}, ant, cap, st}
  (function simulate() {
    let q = 0, qv = 0, rq = 0, rqv = 0, landed = false, took = false;
    const handRest = [-1, 1].map(s => [s * G.hand.dx, G.hand.cy]);
    const footRest = [-1, 1].map(s => [s * G.foot.dx, G.foot.cy]);
    const H = [{}, {}], F = [{}, {}];
    let ant = 0, antv = 0, cap = 0, capv = 0, st = 0, stv = 0;
    let prevBase = null, prevBaseV = [0, 0]; const accF = [0, 0];
    for (let i = 0; i < N; i++) {
      const t = i * dt, b = basePose(t);
      if (!landed && t >= T_LAND) { landed = true; qv += -4.4; rqv += 60; }
      if (!took && t >= T_TAKEOFF) { took = true; rqv -= 20; }
      [q, qv] = spring(q, qv, 0, 3.1, 0.32, dt);
      [rq, rqv] = spring(rq, rqv, 0, 2.6, 0.35, dt);
      const pose = { ...b, sy: b.sy * (1 + q), rot: b.rot + rq }; pose.sx = Math.pow(pose.sy, -0.6);
      // mani (spazio mondo = radice + locale)
      const side = [-1, 1];
      const off = [[tr.hLx(t), tr.hLy(t), tr.hLr(t)], [tr.hRx(t), tr.hRy(t), tr.hRr(t)]];
      for (let k = 0; k < 2; k++) {
        const a = R.bodyPoint(pose, handRest[k][0], handRest[k][1]);
        const tx = b.x + a[0] + off[k][0], ty = b.y + a[1] + off[k][1], trr = off[k][2] + pose.rot;
        const h = H[k];
        if (i === 0) Object.assign(h, { x: tx, y: ty, r: trr, vx: 0, vy: 0, vr: 0 });
        [h.x, h.vx] = spring(h.x, h.vx, tx, 3.4, 0.5, dt);
        [h.y, h.vy] = spring(h.y, h.vy, ty, 3.4, 0.5, dt);
        [h.r, h.vr] = spring(h.r, h.vr, trr, 2.6, 0.42, dt);
      }
      // piedi: penzolano in aria, molla più rigida
      const air = Math.max(0, Math.min(1, -b.y / 60));
      const fOff = [[-8 * air, -22 * air, 20 * air], [14 * air, -44 * air, -26 * air]];
      for (let k = 0; k < 2; k++) {
        const tx = b.x + footRest[k][0] + fOff[k][0], ty = b.y + footRest[k][1] + fOff[k][1];
        const f = F[k];
        if (i === 0) Object.assign(f, { x: tx, y: ty, r: 0, vx: 0, vy: 0, vr: 0 });
        [f.x, f.vx] = spring(f.x, f.vx, tx, 6, 0.55, dt);
        [f.y, f.vy] = spring(f.y, f.vy, Math.min(ty, b.y + footRest[k][1] + 0), 6, 0.55, dt);
        if (f.y > footRest[k][1]) { f.y = footRest[k][1]; f.vy = Math.min(0, f.vy); } // non sotto terra
        [f.r, f.vr] = spring(f.r, f.vr, fOff[k][2], 4, 0.45, dt);
      }
      // antenna: accelerazione della base → inclinazione e compressione dello stelo
      const base = R.bodyPoint(pose, 0, G.antenna.base[1]); const bw = [b.x + base[0], b.y + base[1]];
      let acc = [0, 0];
      if (prevBase) {
        const v = [(bw[0] - prevBase[0]) / dt, (bw[1] - prevBase[1]) / dt];
        if (i > 1) acc = [(v[0] - prevBaseV[0]) / dt, (v[1] - prevBaseV[1]) / dt];
        prevBaseV = v;
      }
      prevBase = bw;
      acc = acc.map(a => Math.max(-30000, Math.min(30000, a)));
      // filtro passa-basso (~20 ms): la molla sente la spinta, non il singolo campione
      accF[0] += (acc[0] - accF[0]) * (dt / 0.02); accF[1] += (acc[1] - accF[1]) * (dt / 0.02); acc = accF.slice();
      // angolo (gradi): spinta laterale + piccola coppia dalla rotazione del corpo
      { const w = 2 * Math.PI * 2.4, z = 0.16; const a = -w * w * ant - 2 * z * w * antv - acc[0] * 0.012; antv += a * dt; ant += antv * dt; }
      // stelo: compressione (accelerazione verso l'alto → la capsula resta indietro)
      { const w = 2 * Math.PI * 3.2, z = 0.2; const a = -w * w * st - 2 * z * w * stv + acc[1] * 0.000028; stv += a * dt; st += stv * dt; }
      // capsula: segue l'angolo dello stelo con ulteriore ritardo
      { const w = 2 * Math.PI * 3.0, z = 0.3; const a = w * w * (-ant * 0.6 - cap) - 2 * z * w * capv; capv += a * dt; cap += capv * dt; }
      SIM.push({ q, rq, H: H.map(h => ({ x: h.x, y: h.y, r: h.r })), F: F.map(f => ({ x: f.x, y: f.y, r: f.r })), ant, st, cap, stv });
    }
  })();
  function simAt(t) {
    const f = Math.max(0, Math.min(N - 2, t * FPS_SIM)), i = Math.floor(f), u = f - i, a = SIM[i], b = SIM[i + 1];
    const L = (x, y) => x + (y - x) * u;
    return {
      q: L(a.q, b.q), rq: L(a.rq, b.rq), ant: L(a.ant, b.ant), st: L(a.st, b.st), cap: L(a.cap, b.cap), stv: L(a.stv, b.stv),
      H: a.H.map((h, k) => ({ x: L(h.x, b.H[k].x), y: L(h.y, b.H[k].y), r: L(h.r, b.H[k].r) })),
      F: a.F.map((h, k) => ({ x: L(h.x, b.F[k].x), y: L(h.y, b.F[k].y), r: L(h.r, b.F[k].r) })),
    };
  }

  // ───────────── scena ─────────────
  const stage = document.getElementById('stage');
  stage.innerHTML = R.build({ viewBox: '-640 -940 1120 1120', attrs: 'width="100%" height="100%" preserveAspectRatio="xMidYMid meet"' });
  const svg = stage.firstElementChild, $ = id => svg.querySelector('#' + id), NS = 'http://www.w3.org/2000/svg';
  const doc = { getElementById: $ };
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); (parent || svg).appendChild(e); return e; };
  // badge «7»: disco blu, 7 oro (tratti tondi), scritta
  const BX = -370, BY = -700;
  const badge = el('g', { id: 'traguardo-badge' }); $('kubo-scena').insertBefore(badge, $('kubo'));
  const cl2 = el('clipPath', { id: 'clip-badge' }, badge); el('circle', { cx: BX, cy: BY, r: 150 }, cl2);
  el('circle', { cx: BX, cy: BY, r: 150, fill: P.bluOmbra }, badge);
  el('circle', { cx: BX - 8, cy: BY - 12, r: 150, fill: P.blu, 'clip-path': 'url(#clip-badge)' }, badge);
  const seven = 'M' + (BX - 52) + ' ' + (BY - 62) + ' L' + (BX + 56) + ' ' + (BY - 62) + ' Q' + (BX + 62) + ' ' + (BY - 62) + ' ' + (BX + 56) + ' ' + (BY - 52) + ' L' + (BX - 6) + ' ' + (BY + 74);
  el('path', { d: seven, fill: 'none', stroke: P.visore, 'stroke-width': 46, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: 'translate(6 9)', opacity: 0.35 }, badge);
  el('path', { d: seven, fill: 'none', stroke: P.oro, 'stroke-width': 46, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, badge);
  const label = el('g', { id: 'traguardo-scritta' });
  $('kubo-scena').insertBefore(label, $('kubo'));
  const tx = el('text', { x: BX, y: BY + 228, 'text-anchor': 'middle', fill: P.visore, 'font-family': 'Inter, "Inter Display", system-ui, sans-serif', 'font-weight': 800, 'font-size': 62, 'letter-spacing': '-0.5' }, label);
  tx.textContent = 'giorni di fila';

  // particelle: oro, blu, bianco (deterministiche)
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const rnd = rng(7), PARTS = [], pg = el('g', { id: 'particelle' });
  const COLS = [P.oro, P.oro, P.blu, P.corpo];
  for (let i = 0; i < 30; i++) {
    const col = COLS[i % 4], white = col === P.corpo;
    const ang = (i / 30) * Math.PI * 2 + rnd() * 0.35, spd = white ? 90 + rnd() * 90 : 650 + rnd() * 650, r0 = white ? 108 + rnd() * 26 : 128;
    const kind = white ? 0 : i % 3; const sz = (white ? 7 : 10) + rnd() * (white ? 7 : 14);
    let node;
    if (kind === 0) { // scintilla a 4 punte
      const pts = []; for (let k = 0; k < 32; k++) { const tt = k / 32 * Math.PI * 2, c = Math.cos(tt), s = Math.sin(tt); pts.push([sz * 1.5 * Math.sign(c) * Math.abs(c) ** 2.4, sz * 1.5 * Math.sign(s) * Math.abs(s) ** 2.4]); }
      node = el('path', { d: R.smoothClosed(pts), fill: col }, pg);
    } else if (kind === 1) node = el('circle', { r: sz * 0.55, fill: col }, pg);
    else node = el('path', { d: R.tapered([0, -sz], [0, sz], sz * 0.32, sz * 0.32), fill: col }, pg);
    PARTS.push({ node, ang, spd, r0, t0: 1.47 + rnd() * 0.08, life: 0.9 + rnd() * 0.6, spin: (rnd() - 0.5) * 540, white });
  }
  $('kubo-scena').insertBefore(pg, $('kubo'));
  // le scintille bianche stanno davanti al disco blu: porta il gruppo sopra al badge
  $('kubo-scena').insertBefore(badge, pg);
  $('kubo-scena').insertBefore(label, $('kubo')); // la scritta resta sopra le particelle

  // ───────────── render(t) ─────────────
  function render(t) {
    t = Math.max(0, Math.min(DURATION, t));
    const b = basePose(t), s = simAt(t);
    const sy = b.sy * (1 + s.q), rot = b.rot + s.rq;
    const pose = {
      x: b.x, y: b.y, rot, sy, sx: Math.pow(sy, -0.6), turn: b.turn,
      gazeX: tr.gazeX(t), gazeY: tr.gazeY(t), expr: eyeWeights(t), mouth: tr.mouth(t), eyeScale: tr.eyeScale(t),
      eyeSy: 1 + (sy - 1) * 0.5,
      antRot: s.ant, antStretch: 1 + Math.max(-0.55, Math.min(0.9, s.st)), capRot: s.cap, capSx: 1 + s.stv * 0.004, capSy: 1 - s.stv * 0.004,
      shadowS: 1 - 0.5 * Math.min(1, -b.y / 300) + (1 - sy) * 0.6,
    };
    pose.handL = { world: true, x: s.H[0].x - b.x - (-G.hand.dx), y: s.H[0].y - b.y - G.hand.cy, rot: s.H[0].r };
    pose.handR = { world: true, x: s.H[1].x - b.x - G.hand.dx, y: s.H[1].y - b.y - G.hand.cy, rot: s.H[1].r };
    pose.footL = { x: s.F[0].x - b.x - (-G.foot.dx), y: s.F[0].y - b.y - G.foot.cy, rot: s.F[0].r };
    pose.footR = { x: s.F[1].x - b.x - G.foot.dx, y: s.F[1].y - b.y - G.foot.cy, rot: s.F[1].r };
    R.applyPose(doc, pose);
    // scintille sopra la testa: seguono Kubo
    const sp = tr.sparks(t);
    $('scintille').setAttribute('transform', `translate(${R.f1(b.x)} ${R.f1(b.y)}) translate(250 -496) scale(${Math.max(0, sp).toFixed(3)}) rotate(${((1 - Math.min(1, sp)) * -25).toFixed(2)}) translate(-250 496)`);
    $('scintille').setAttribute('opacity', Math.min(1, Math.max(0, sp * 1.5)).toFixed(3));
    // badge
    const bs = Math.max(0, tr.badge(t)), bob = t > 2.1 ? Math.sin((t - 2.1) * 3.2) * 6 * Math.min(1, (t - 2.1) * 2) : 0;
    badge.setAttribute('transform', `translate(${BX} ${R.f1(BY + bob)}) rotate(${tr.badgeRot(t).toFixed(2)}) scale(${bs.toFixed(4)}) translate(${-BX} ${-BY})`);
    const ls = smoother((t - 1.62) / 0.28);
    label.setAttribute('opacity', ls.toFixed(3));
    label.setAttribute('transform', `translate(0 ${R.f1((1 - ls) * 30)})`);
    // particelle
    for (const p of PARTS) {
      const tau = t - p.t0;
      if (tau <= 0 || tau >= p.life) { p.node.setAttribute('opacity', 0); continue; }
      const k = 3.2, g = 900, e = Math.exp(-k * tau);
      const dx = Math.cos(p.ang) * p.spd * (1 - e) / k, dy = Math.sin(p.ang) * p.spd * (1 - e) / k + g * (tau / k - (1 - e) / (k * k));
      const sc = smoother(tau / 0.08) * (1 - smoother((tau - p.life * 0.55) / (p.life * 0.45)));
      p.node.setAttribute('opacity', 1);
      p.node.setAttribute('transform', `translate(${R.f1(BX + dx + Math.cos(p.ang) * p.r0)} ${R.f1(BY + dy + Math.sin(p.ang) * p.r0)}) rotate(${(p.spin * tau).toFixed(1)}) scale(${sc.toFixed(3)})`);
    }
  }
  window.render = render; window.DURATION = DURATION;
  window.__debug = { tr, basePose, simAt, eyeWeights };
  render(0);
  if (!/capture/.test(location.search)) {
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) render(3.1); else { let t0 = null; const loop = ts => { if (t0 === null) t0 = ts; render(((ts - t0) / 1000) % (DURATION + 0.8)); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
  }
})();
