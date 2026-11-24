/* SEGNO, terza versione del nastro. Correzioni del giudizio:
   1. una vera piega di tessuto: il risvolto è un trapezio con lo spigolo in diagonale e
      il bordo curvo, in tono chiaro (il rovescio del raso). È il sopracciglio del personaggio;
   2. occhi grandi il doppio, ovali verticali, che la piega può tagliare a metà;
   3. corpo più corto (−25%) e più largo, con la vita stretta e una S morbida;
      punte della tacca lunghe, piedi veri.
   Colore: corallo profondo, verso il cremisi rosato. */
(function () {
  const C = { corpo: '#d9445a', rovescio: '#f4a3ae', occhi: '#2b0f1c' };
  const W = 60, H = 108, TACCA = 30;

  function spina(s) {
    const pts = [], N = 48, ds = H * (s.sy || 1) / N;
    let x = 100, y = 186 - (s.su || 0);
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const th = (s.incl || 0) + (s.piega || 0) * t + (s.esse == null ? 3 : s.esse) * Math.sin(t * Math.PI * 2);
      pts.push({ x, y, th, t });
      const r = th * Math.PI / 180; x += ds * Math.sin(r); y -= ds * Math.cos(r);
    }
    return pts;
  }
  /* la larghezza cambia lungo il nastro: vita stretta a metà, spalle e piedi pieni */
  const larg = (t, s) => W * (s.sx || 1) * (1 - .14 * Math.sin(Math.PI * Math.min(1, t * 1.15))) / 2;
  const lato = (p, l, d) => { const r = p.th * Math.PI / 180; return [p.x + l * d * Math.cos(r), p.y + l * d * Math.sin(r)]; };
  const lungo = (pt, th, d) => { const r = th * Math.PI / 180; return [pt[0] - d * Math.sin(r), pt[1] + d * Math.cos(r)]; };
  const f = p => p[0].toFixed(1) + ' ' + p[1].toFixed(1);

  function disegna(k, opz) {
    opz = opz || {};
    const s = STATI[k];
    const P = spina(s), N = P.length - 1, top = P[N];
    const iT = Math.round(N * TACCA / (H * (s.sy || 1)));
    const [pl, pr] = s.piedi || [[0, 0], [0, 0]];
    /* piedi: le punte sporgono un po' in fuori, come stoffa tagliata a coda di rondine */
    const ps0 = lato(P[0], -1, larg(0, s) + 4), pd0 = lato(P[0], 1, larg(0, s) + 4);
    const ps = [ps0[0] + pl[0], ps0[1] + pl[1]], pd = [pd0[0] + pr[0], pd0[1] + pr[1]];
    let d = `M${f(ps)}`;
    for (let i = 3; i <= N; i++) d += `L${f(lato(P[i], -1, larg(P[i].t, s)))}`;
    d += `L${f(lato(top, 1, larg(1, s)))}`;
    for (let i = N - 1; i >= 3; i--) d += `L${f(lato(P[i], 1, larg(P[i].t, s)))}`;
    d += `L${f(pd)}L${f([P[iT].x, P[iT].y])}Z`;

    /* occhi: grandi, al 30% dall'alto */
    const iO = Math.round(N * (1 - (s.occhiY || .3))), po = P[iO], r = po.th;
    const [gx, gy] = s.g || [0, 0];
    const occhi = [-1, 1].map(l => {
      const c = lato(po, l, 12), x = c[0] + gx, y = c[1] + gy, k2 = (s.uno && l === s.uno) ? 1.18 : 1;
      const rx = 7.2 * k2, ry = 9.6 * k2;
      if (s.occhi === 'chiusi') return `<path d="M${x - 7} ${y}q7 7 14 0" fill="none" stroke="${C.occhi}" stroke-width="4.2" stroke-linecap="round" transform="rotate(${r} ${x} ${y})"/>`;
      if (s.occhi === 'felici') return `<path d="M${x - 7} ${y + 3}q7 -10 14 0" fill="none" stroke="${C.occhi}" stroke-width="4.2" stroke-linecap="round" transform="rotate(${r} ${x} ${y})"/>`;
      if (s.occhi === 'gocce') return `<path d="M${x} ${y - ry}C${x + rx * 1.1} ${y - ry * .2} ${x + rx} ${y + ry} ${x} ${y + ry}C${x - rx} ${y + ry} ${x - rx * 1.1} ${y - ry * .2} ${x} ${y - ry}Z" fill="${C.occhi}" transform="rotate(${r + l * -12} ${x} ${y})"/>`;
      return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${C.occhi}" transform="rotate(${r} ${x} ${y})"/>`;
    }).join('');

    /* LA PIEGA: il risvolto del nastro. Cerniera sul bordo alto; Ll e Lr quanto scende a
       sinistra e a destra (lo spigolo in diagonale nasce da Ll ≠ Lr); negativo = alzata. */
    const [Ll, Lr] = s.risvolto, th = top.th, hw = larg(1, s);
    const hl = lato(top, -1, hw + 1), hr = lato(top, 1, hw + 1);
    const el = lungo(hl, th, Ll), er = lungo(hr, th, Lr);
    const sotto = Ll + Lr > 0;
    /* il bordo del risvolto è curvo (stoffa), e quando è alzato si apre un poco a ventaglio */
    const apri = sotto ? 0 : 6;
    const el2 = lato({ x: el[0], y: el[1], th }, -1, apri), er2 = lato({ x: er[0], y: er[1], th }, 1, apri);
    const cm = lungo([(el2[0] + er2[0]) / 2, (el2[1] + er2[1]) / 2], th, sotto ? 5 : -4);
    const risvolto = `<path d="M${f(hl)}L${f(el2)}Q${f(cm)} ${f(er2)}L${f(hr)}Z" fill="${C.rovescio}" stroke="${C.rovescio}" stroke-width="3" stroke-linejoin="round"/>`;
    return `<svg viewBox="0 0 200 200" role="img" aria-label="Segno: ${s.n}">` + (sotto ? '' : risvolto) +
      `<path d="${d}" fill="${C.corpo}" stroke="${C.corpo}" stroke-width="5" stroke-linejoin="round"/>` +
      (opz.senzaViso ? '' : occhi) + (sotto ? risvolto : '') + `</svg>`;
  }

  /* ogni stato ha una silhouette sua: dritto, S, C, chiocciola, punto interrogativo, in avanti */
  const STATI = {
    calma:       { n: 'Calma',       esse: 6,  risvolto: [17, 15], g: [1, 1] },
    gioia:       { n: 'Gioia',       esse: 12, piega: -26, su: 18, sy: 1.04, risvolto: [-26, -32], occhi: 'felici', piedi: [[-12, -6], [12, -6]] },
    concentrato: { n: 'Concentrato', esse: 0,  incl: 10, risvolto: [14, 26], g: [2, 3] },
    capisce:     { n: 'Ti capisce',  esse: 4,  piega: -22, incl: 6, risvolto: [22, 10], occhi: 'gocce', g: [-1, 2] },
    curioso:     { n: 'Curioso',     esse: 0,  piega: 34, incl: -16, risvolto: [-24, 6], uno: 1, g: [3, -2], piedi: [[0, 0], [5, -14]] },
    fiero:       { n: 'Fiero',       esse: 0,  sy: 1.1, sx: .95, risvolto: [-30, -30], occhi: 'felici', occhiY: .32, piedi: [[-14, 0], [14, 0]] },
    dorme:       { n: 'Dorme',       esse: 0,  piega: 96, incl: -26, sy: .9, risvolto: [30, 30], occhi: 'chiusi', occhiY: .36 },
    affetto:     { n: 'Affetto',     esse: 0,  piega: -64, incl: 22, risvolto: [20, 8], occhi: 'felici', occhiY: .3, piedi: [[14, 0], [-14, 0]] }
  };
  window.NASTRO3 = { disegna, STATI };
})();
