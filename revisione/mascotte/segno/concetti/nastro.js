/* SEGNO, seconda versione: un NASTRO di raso, non un foglio.
   - proporzioni da nastro (1:3,2), colore corallo dei segnalibri dei libri;
   - la cima si ripiega in avanti per tutta la larghezza: è la PIEGA, e fa da palpebra,
     visiera, ciuffo o coperta. È lei la leva delle emozioni;
   - occhi piccoli e vicini, sotto la piega, che li taglia;
   - le due punte della tacca sono i piedi: si alzano, si allargano, si incrociano;
   - nessun adesivo (stelle, cuori, z): l'emozione deve stare nella sagoma. */
(function () {
  const TEMI = {
    corallo: { corpo: '#e5525c', rovescio: '#f48d93', occhi: '#2b0f1c' },
    zafferano: { corpo: '#f0a020', rovescio: '#f8c96a', occhi: '#3a2200' }
  };
  const W = 44, H = 142, TACCA = 26;

  function spina(s) {
    const pts = [], N = 48, ds = H * (s.sy || 1) / N;
    let x = 100, y = 190 - (s.su || 0);
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const th = (s.incl || 0) + (s.piega || 0) * t + (s.esse || 0) * Math.sin(t * Math.PI * 2);
      pts.push({ x, y, th });
      const r = th * Math.PI / 180; x += ds * Math.sin(r); y -= ds * Math.cos(r);
    }
    return pts;
  }
  const lato = (p, l, d) => { const r = p.th * Math.PI / 180; return [p.x + l * d * Math.cos(r), p.y + l * d * Math.sin(r)]; };
  /* un punto spostato "lungo" il nastro (verso il basso, nella direzione della spina) */
  const giu = (pt, th, d) => { const r = th * Math.PI / 180; return [pt[0] - d * Math.sin(r), pt[1] + d * Math.cos(r)]; };
  const f = p => p[0].toFixed(1) + ' ' + p[1].toFixed(1);

  function disegna(k, opz) {
    opz = opz || {};
    const s = STATI[k], C = TEMI[opz.tema || 'corallo'], hw = W / 2;
    const P = spina(s), N = P.length - 1, top = P[N];
    const iT = Math.round(N * TACCA / (H * (s.sy || 1)));
    /* piedi: le punte della tacca, ognuna con il suo spostamento */
    const [pl, pr] = s.piedi || [[0, 0], [0, 0]];
    const piedeS = lato(P[0], -1, hw), piedeD = lato(P[0], 1, hw);
    const ps = [piedeS[0] + pl[0], piedeS[1] + pl[1]], pd = [piedeD[0] + pr[0], piedeD[1] + pr[1]];
    let d = `M${f(ps)}`;
    for (let i = 2; i <= N; i++) d += `L${f(lato(P[i], -1, hw))}`;
    d += `L${f(lato(top, 1, hw))}`;
    for (let i = N - 1; i >= 2; i--) d += `L${f(lato(P[i], 1, hw))}`;
    d += `L${f(pd)}L${f([P[iT].x, P[iT].y])}Z`;

    /* occhi: piccoli, vicini, appena sotto la cima */
    const iO = Math.round(N * (1 - (s.occhiY || .15))), po = P[iO], r = po.th;
    const [gx, gy] = s.g || [0, 0];
    const occ = [-1, 1].map(l => {
      const c = lato(po, l, 9.5); const x = c[0] + gx, y = c[1] + gy;
      if (s.occhi === 'chiusi') return `<path d="M${x - 5} ${y}q5 5 10 0" fill="none" stroke="${C.occhi}" stroke-width="3.4" stroke-linecap="round" transform="rotate(${r} ${x} ${y})"/>`;
      if (s.occhi === 'felici') return `<path d="M${x - 5} ${y + 2}q5 -7 10 0" fill="none" stroke="${C.occhi}" stroke-width="3.4" stroke-linecap="round" transform="rotate(${r} ${x} ${y})"/>`;
      return `<ellipse cx="${x}" cy="${y}" rx="5.6" ry="7" fill="${C.occhi}" transform="rotate(${r} ${x} ${y})"/>`;
    }).join('');

    /* LA PIEGA: incernierata sul bordo alto. Ll e Lr = quanto scende a sinistra e a destra
       (negativo = si alza oltre la cima, come un ciuffo). */
    const [Ll, Lr] = s.piegaCima;
    const hl = lato(top, -1, hw), hr = lato(top, 1, hw), th = top.th;
    const el = giu(hl, th, Ll), er = giu(hr, th, Lr);
    const mid = giu([(el[0] + er[0]) / 2, (el[1] + er[1]) / 2], th, Math.sign(Ll + Lr) * 3);
    const piega = `<path d="M${f(hl)}L${f(el)}Q${f(mid)} ${f(er)}L${f(hr)}Z" fill="${C.rovescio}" stroke="${C.rovescio}" stroke-width="3" stroke-linejoin="round"/>`;
    /* la piega sta davanti agli occhi quando scende, dietro quando si alza */
    const giuPiega = (Ll + Lr) > 0;
    return `<svg viewBox="0 0 200 200" role="img" aria-label="Segno: ${s.n}">` +
      (giuPiega ? '' : piega) +
      `<path d="${d}" fill="${C.corpo}" stroke="${C.corpo}" stroke-width="4" stroke-linejoin="round"/>` +
      (opz.senzaViso ? '' : occ) + (giuPiega ? piega : '') + `</svg>`;
  }

  /* ogni stato: linea d'azione del corpo, piega, piedi, sguardo */
  const STATI = {
    calma:       { n: 'Calma',       esse: 4,   piegaCima: [15, 15],    g: [1, 1] },
    gioia:       { n: 'Gioia',       piega: -22, incl: 6, su: 14, sy: 1.05, piegaCima: [-28, -30], occhi: 'felici', piedi: [[-6, -10], [6, -10]] },
    concentrato: { n: 'Concentrato', incl: 7,    piegaCima: [20, 27], g: [2, 4] },
    capisce:     { n: 'Ti capisce',  piega: -34, incl: 4, piegaCima: [24, 13], g: [-2, 2] },
    curioso:     { n: 'Curioso',     incl: 14,   piegaCima: [-26, -4], g: [3, -1], piedi: [[0, 0], [4, -12]] },
    fiero:       { n: 'Fiero',       esse: -7,   piega: -10, sy: 1.04, piegaCima: [-34, -30], occhi: 'felici', piedi: [[-10, 0], [10, 0]] },
    dorme:       { n: 'Dorme',       piega: 70,  incl: -10, sy: .92, piegaCima: [34, 34], occhi: 'chiusi', occhiY: .26, piedi: [[6, -4], [-2, 0]] },
    affetto:     { n: 'Affetto',     piega: 46,  esse: 6, incl: -14, piegaCima: [20, 12], occhi: 'felici', piedi: [[9, 0], [-9, 0]] }
  };
  window.NASTRO = { disegna, STATI, TEMI };
})();
