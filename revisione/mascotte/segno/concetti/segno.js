/* SEGNO — un nastro segnalibro che ti tiene il punto. «Ti ho tenuto il segno,
   riprendiamo da qui.» Mai giudicante.
   Il corpo è un NASTRO: lo si costruisce lungo una spina dorsale che si curva, così
   può piegarsi, arricciarsi, afflosciarsi e recitare con tutta la sagoma.
   Forme: corpo, orecchia (il rovescio del nastro), occhi, un accento ambra (solo
   in alcuni stati). Colori piatti, niente ombre. */
(function () {
  const COL = { corpo: '#5a4fe0', orecchia: '#9088f5', occhi: '#fff7ec', ambra: '#ffb224' };
  const W = 66, H = 128;            /* larghezza e lunghezza del nastro (1:1,6) */
  const R = W * .12;                 /* raggio degli angoli in alto */
  const TACCA = H * .3;            /* profondità della tacca */

  /* la spina: dal centro dei piedi (t=0) alla testa (t=1). theta in gradi:
     inclinazione + piega che cresce salendo + una S opzionale */
  function spina(s) {
    const pts = [], N = 40, ds = (H * (s.sy || 1)) / N;
    let x = 100, y = 186 - (s.su || 0), th = 0;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      th = (s.incl || 0) + (s.piega || 0) * t + (s.esse || 0) * Math.sin(t * Math.PI * 2);
      pts.push({ x, y, th });
      const r = th * Math.PI / 180;
      x += ds * Math.sin(r); y -= ds * Math.cos(r);
    }
    return pts;
  }
  /* punto sul bordo: lato -1 sinistra, +1 destra, a distanza d dalla spina */
  function bordo(p, lato, d) {
    const r = p.th * Math.PI / 180;
    return [p.x + lato * d * Math.cos(r), p.y + lato * d * Math.sin(r)];
  }
  const f = p => p[0].toFixed(1) + ' ' + p[1].toFixed(1);

  function disegna(stato, opz) {
    opz = opz || {};
    const s = STATI[stato], w = W * (s.sx || 1), hw = w / 2;
    const P = spina(s), N = P.length - 1, top = P[N];
    const iR = Math.round(N * (1 - R / (H * (s.sy || 1))));     /* dove inizia l'arrotondamento */
    const iT = Math.round(N * (TACCA / (H * (s.sy || 1))));     /* altezza della tacca */
    const piede = s.piede || 0;                                  /* curioso: un piede sollevato */
    const largo = s.piedi || 1;                                  /* fiero: piedi divaricati */
    /* l'orecchia: l'angolo in alto a destra è ripiegato. A e B sono i punti della piega */
    const ePiega = w * .46;
    const A = bordo(top, 1, hw - ePiega);                         /* sul bordo alto */
    const iB = Math.round(N * (1 - ePiega / (H * (s.sy || 1))));
    const B = bordo(P[iB], 1, hw);                               /* sul fianco destro */
    /* corpo: fianco sinistro dal piede alla testa, testa tonda, angolo tagliato, fianco destro, tacca */
    let d = `M${f(bordo(P[0], -1, hw * largo))}`;
    for (let i = 1; i <= iR; i++) d += `L${f(bordo(P[i], -1, hw))}`;
    d += `Q${f(bordo(top, -1, hw))} ${f(bordo(top, -1, hw - R))}`;
    d += `L${f(A)}L${f(B)}`;
    for (let i = iB - 1; i >= 0; i--) d += `L${f(bordo(P[i], 1, hw * (i === 0 ? largo : 1)))}`;
    /* il piede destro sollevato: l'ultimo punto sale */
    if (piede) d = d.replace(/L([\d.]+) ([\d.]+)$/, (m, x, y) => `L${x} ${(+y - piede).toFixed(1)}`);
    d += `L${f([P[iT].x, P[iT].y])}Z`;
    /* l'orecchia: un triangolo incernierato su A-B, la punta a un angolo dato.
       0° = ripiegata sul corpo (orecchia della pagina), 90° = dritta in fuori */
    const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
    const hx = B[0] - A[0], hy = B[1] - A[1], hl = Math.hypot(hx, hy);
    const nx = -hy / hl, ny = hx / hl;                           /* normale verso l'interno */
    const a = (s.orecchia == null ? 30 : s.orecchia) * Math.PI / 180, L = hl * .72;
    /* a=0 punta verso l'interno del corpo; a=90 perpendicolare in fuori verso l'alto/destra */
    const dirx = nx * Math.cos(a) - nx * 0 + (-nx) * 0, diry = ny * Math.cos(a);
    const outx = -nx, outy = -ny;
    const tx = mx + L * (nx * Math.cos(a) + outx * 0) * 1 + L * Math.sin(a) * (outx * .2 + (A[0] - B[0]) / hl * -0.0),
          ty = my + L * (ny * Math.cos(a)) + L * Math.sin(a) * (outy * 1);
    const tip = [mx + L * (nx * Math.cos(a) + outx * Math.sin(a)), my + L * (ny * Math.cos(a) + outy * Math.sin(a))];
    const orecchia = `<path d="M${f(A)}L${f(tip)}L${f(B)}Z" fill="${COL.orecchia}" stroke="${COL.orecchia}" stroke-width="5" stroke-linejoin="round"/>`;
    /* occhi: al 32% dall'alto, lungo la spina */
    const iO = Math.round(N * (1 - (s.occhiY || .32)));
    const po = P[iO], dO = w * .2;
    const occhi = [-1, 1].map(l => occhio(s, bordo(po, l, dO), po.th, l)).join('');
    const extra = accento(s, top, P);
    /* rotondità ai piedi: un tratto dello stesso colore con giunzioni tonde */
    return `<svg viewBox="0 0 200 200" role="img" aria-label="Segno: ${s.n}">` +
      `<path d="${d}" fill="${opz.corpo || COL.corpo}" stroke="${opz.corpo || COL.corpo}" stroke-width="6" stroke-linejoin="round"/>` +
      (s.orecchiaDavanti ? occhi + orecchia : orecchia + (opz.senzaViso ? '' : occhi)) + extra + `</svg>`;
  }

  function occhio(s, c, th, lato) {
    const [x, y] = c, k = (s.occhioGrande && lato === 1) ? 1.15 : 1;
    const rx = 8.4 * k, ry = 11 * k, col = COL.occhi;
    const rot = th + (s.occhiRuota ? lato * -s.occhiRuota : 0);
    switch (s.occhi) {
      case 'archiSu': return `<path d="M${x - 8} ${y + 3}Q${x} ${y - 9} ${x + 8} ${y + 3}" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round" transform="rotate(${th} ${x} ${y})"/>`;
      case 'archiGiu': return `<path d="M${x - 8} ${y}Q${x} ${y + 8} ${x + 8} ${y}" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round" transform="rotate(${th} ${x} ${y})"/>`;
      case 'palpebra': return `<path d="M${x - rx} ${y - ry * .3}H${x + rx}A${rx} ${ry * .7} 0 0 1 ${x - rx} ${y - ry * .3}Z" fill="${col}" transform="rotate(${th} ${x} ${y})"/>`;
      /* ti capisce: ovali piegati verso il centro, gli angoli interni più bassi */
      case 'dolci': return `<path d="M${x - rx} ${y - ry * .2}Q${x} ${y - ry * (lato > 0 ? .9 : .9)} ${x + rx} ${y - ry * .2}A${rx} ${ry * .75} 0 0 1 ${x - rx} ${y - ry * .2}Z" fill="${col}" transform="rotate(${rot} ${x} ${y})"/>`;
    }
    return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${col}" transform="rotate(${th} ${x} ${y})"/>`;
  }

  function accento(s, top, P) {
    const a = COL.ambra;
    if (s.accento === 'cuore') return `<path d="M152 52c-3.5-7-14-5-14 3 0 6.5 14 13 14 13s14-6.5 14-13c0-8-10.5-10-14-3z" fill="${a}"/>`;
    if (s.accento === 'zeta') return `<path d="M146 58h10l-10 11h10M160 42h7l-7 8h7" fill="none" stroke="${a}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (s.accento === 'scintilla') return `<path d="M50 50l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="${a}"/><path d="M154 60l2.4 6 6 2.4-6 2.4-2.4 6-2.4-6-6-2.4 6-2.4z" fill="${a}"/>`;
    return '';
  }

  const STATI = {
    calma:       { n: 'Calma',       occhi: 'ovali',    orecchia: 30 },
    gioia:       { n: 'Gioia',       occhi: 'archiSu',  orecchia: 62, su: 16, sy: 1.08, sx: .94, accento: 'scintilla' },
    concentrato: { n: 'Concentrato', occhi: 'palpebra', orecchia: 18 },
    capisce:     { n: 'Ti capisce',  occhi: 'dolci',    orecchia: -10, piega: -22, incl: -2, occhiRuota: 10 },
    curioso:     { n: 'Curioso',     occhi: 'ovali',    orecchia: 85, incl: 12, occhioGrande: 1, piede: 12 },
    fiero:       { n: 'Fiero',       occhi: 'archiSu',  orecchia: 88, sy: 1.06, sx: .96, piedi: 1.35, incl: -3 },
    dorme:       { n: 'Dorme',       occhi: 'archiGiu', orecchia: -38, piega: 48, sy: .92, occhiY: .38, accento: 'zeta' },
    affetto:     { n: 'Affetto',     occhi: 'archiSu',  orecchia: 40, esse: 9, accento: 'cuore' }
  };
  window.SEGNO = { disegna, STATI };
})();
