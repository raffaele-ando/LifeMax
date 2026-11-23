/* GERMO, sesta versione. Quattro forme: seme a fagiolo + 2 occhi + germoglio.
   Correzioni del quarto giudizio:
   - sagoma a fagiolo/mandorla: punto più largo a metà altezza, cima tonda, base morbida,
     un fianco più pieno dell'altro; il germoglio nasce fuori asse (non è una cipolla);
   - occhi grandi il doppio (ognuno ~20% della larghezza), ovali verticali, bassi;
   - nessuna ombra nel personaggio: la mette l'interfaccia, se serve;
   - ogni stato ha una sagoma sua, riconoscibile anche col viso coperto. */
(function () {
  const INK = '#1d1747', VERDE = '#2fbf86';
  /* il fagiolo: alto ~130, largo ~124; il fianco destro più pieno */
  const SEME = 'M108 56C126 60 158 84 162 122C165 150 160 170 148 180C142 185 132 186 120 186H76C62 186 50 182 44 172C36 158 36 136 42 116C52 84 86 58 108 56Z';
  const BASE = [98, 186], CIMA = [108, 58];       /* da dove nasce il germoglio: fuori asse */
  const OX = 22, OY = 130, RX = 12.5, RY = 15.6;

  function occhi(s) {
    const [gx, gy] = s.g || [0, 0], k = s.scala || 1;
    const ox = OX * (s.vicini || 1), c = [[99 - ox + gx, OY + gy + (s.storti ? -2 : 0)], [99 + ox + gx, OY + gy + (s.storti ? 2 : 0)]];
    const rx = RX * k, ry = RY * k * (s.schiaccia || 1);
    if (s.o === 'archi') return c.map(([x, y]) => `<path d="M${x - 12} ${y + 5}Q${x} ${y - 12} ${x + 12} ${y + 5}" fill="none" stroke="${INK}" stroke-width="7.5" stroke-linecap="round"/>`).join('');
    if (s.o === 'chiusi') return c.map(([x, y]) => `<path d="M${x - 12} ${y}Q${x} ${y + 10} ${x + 12} ${y}" fill="none" stroke="${INK}" stroke-width="7.5" stroke-linecap="round"/>`).join('');
    /* mezzi: la parte bassa dell'ovale, con il taglio dritto: stanco ma sereno */
    if (s.o === 'mezzi') return c.map(([x, y]) => `<path d="M${x - rx} ${y + 1}Q${x} ${y - 3} ${x + rx} ${y + 1}A${rx} ${ry * .7} 0 0 1 ${x - rx} ${y + 1}Z" fill="${INK}"/>`).join('');
    if (s.o === 'su') return c.map(([x, y]) => `<path d="M${x - rx} ${y + 1}A${rx} ${ry * .8} 0 0 1 ${x + rx} ${y + 1}Q${x} ${y + 5} ${x - rx} ${y + 1}Z" fill="${INK}"/>`).join('');
    return c.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${INK}"/>`).join('');
  }

  const F = 'M0 0C7 -13 25 -15 35 -5C25 6 10 7 0 0Z';
  const foglia = (x, y, a, s) => `<path d="${F}" transform="translate(${x} ${y}) rotate(${a}) scale(${s || 1})"/>`;
  function germoglio(p, piccolo) {
    const [x0, y0] = CIMA, sw = piccolo ? 12 : 9;
    const g = (d, f) => `<g fill="${VERDE}"><path d="${d}" fill="none" stroke="${VERDE}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>${f}</g>`;
    const m = `M${x0} ${y0}`;
    switch (p) {
      case 'riposo':   return g(`${m}C${x0} 48 ${x0 + 2} 40 ${x0 + 4} 32`, foglia(x0 + 4, 33, -145, 1.05) + foglia(x0 + 4, 33, -35, 1.05));
      /* ciao: una foglia sola, alzata e aperta come una mano */
      case 'ciao':     return g(`${m}C${x0} 46 ${x0 + 4} 38 ${x0 + 8} 34`, foglia(x0 + 8, 36, 175, .6) + foglia(x0 + 8, 35, -82, 1.45));
      case 'alto':     return g(`${m}V14`, foglia(x0, 16, -128, 1.1) + foglia(x0, 16, -52, 1.1));
      case 'largo':    return g(`${m}V30`, foglia(x0, 32, 192, 1.2) + foglia(x0, 32, -12, 1.2));
      /* punto interrogativo */
      case 'domanda':  return g(`${m}C${x0} 48 ${x0 - 2} 40 ${x0 + 6} 32C${x0 + 16} 22 ${x0 + 4} 10 ${x0 - 8} 18`, foglia(x0 - 8, 18, 160, .8));
      case 'bocciolo': return g(`${m}V32`, `<path d="M${x0} 34C${x0 - 15} 32 ${x0 - 16} 16 ${x0 - 6} 12Q${x0} 17 ${x0 + 6} 12C${x0 + 16} 16 ${x0 + 15} 32 ${x0} 34Z"/>`);
      /* coppa: due foglie che salgono e si chiudono, come mani a conca */
      case 'coppa':    return g(`${m}V42`, `<path d="M${x0} 44C${x0 - 26} 44 ${x0 - 38} 30 ${x0 - 32} 12C${x0 - 26} 22 ${x0 - 16} 30 ${x0 - 4} 32Q${x0} 33 ${x0 + 4} 32C${x0 + 16} 30 ${x0 + 26} 22 ${x0 + 32} 12C${x0 + 38} 30 ${x0 + 26} 44 ${x0} 44Z"/>`);
      case 'cuore':    return g(`${m}V38`, `<path d="M${x0} 42C${x0 - 10} 33 ${x0 - 24} 28 ${x0 - 26} 16C${x0 - 28} 4 ${x0 - 11} 0 ${x0} 14C${x0 + 11} 0 ${x0 + 28} 4 ${x0 + 26} 16C${x0 + 24} 28 ${x0 + 10} 33 ${x0} 42Z"/>`);
      /* stanco: piegato di lato fino a toccare il corpo */
      case 'piegato':  return g(`${m}C${x0} 40 ${x0 + 24} 34 ${x0 + 30} 50`, foglia(x0 + 30, 50, 100, .95) + foglia(x0 + 30, 50, 70, .85));
      /* dorme: un solo grande ricciolo, leggibile anche piccolo */
      case 'ricciolo': return g(`${m}C${x0} 38 ${x0 + 28} 32 ${x0 + 28} 48C${x0 + 28} 58 ${x0 + 14} 58 ${x0 + 14} 48`, '');
    }
    return '';
  }

  /* r = altezza/larghezza (volume costante), incl = gradi, su = salto, g = sguardo */
  const STATI = [
    { k: 'felice',      n: 'Felice',      r: 1.04, incl: 0,   o: 'ovali', g: [1, -2],   ger: 'riposo' },
    { k: 'ciao',        n: 'Ciao!',       r: 1.03, incl: 10,  o: 'ovali', g: [-2, 0],   ger: 'ciao', su: 8 },
    { k: 'gioia',       n: 'Gioia',       r: 1.09, incl: 0,   o: 'archi', g: [0, -2],   ger: 'alto', su: 20, bocca: 1 },
    { k: 'fiero',       n: 'Fiero',       r: 1.06, incl: -10, o: 'su',    g: [-2, -6],  ger: 'largo' },
    { k: 'curioso',     n: 'Curioso',     r: 1.03, incl: 14,  o: 'ovali', g: [10, -5],  ger: 'domanda' },
    { k: 'concentrato', n: 'Concentrato', r: .94,  incl: 6,   o: 'ovali', g: [5, 8],    ger: 'bocciolo', schiaccia: .82 },
    { k: 'capisce',     n: 'Ti capisce',  r: .92,  incl: -9,  o: 'ovali', g: [-4, 6],   ger: 'coppa', scala: .82, vicini: .82 },
    { k: 'affetto',     n: 'Affetto',     r: .9,   incl: 0,   o: 'archi', g: [0, 2],    ger: 'cuore', vicini: .78, storti: 1 },
    { k: 'stanco',      n: 'Stanco',      r: .84,  incl: 4,   o: 'mezzi', g: [0, 5],    ger: 'piegato' },
    { k: 'dorme',       n: 'Dorme',       r: .8,   incl: -8,  o: 'chiusi', g: [0, 4],   ger: 'ricciolo' }
  ];

  function disegna(k, opz) {
    opz = opz || {};
    const s = STATI.find(x => x.k === k), sx = 1 / Math.sqrt(s.r), sy = Math.sqrt(s.r), su = s.su || 0;
    const base = `translate(${BASE[0]} ${BASE[1]}) scale(.78) translate(${-BASE[0]} ${-BASE[1]})`;
    const posa = `translate(${BASE[0]} ${BASE[1] - su}) rotate(${s.incl}) scale(${sx.toFixed(3)} ${sy.toFixed(3)}) translate(${-BASE[0]} ${-BASE[1]})`;
    const bocca = s.bocca && !opz.piccolo ? `<path d="M87 150Q99 164 111 150" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>` : '';
    return `<svg viewBox="0 0 200 200" role="img" aria-label="Germo: ${s.n}"><g transform="translate(0 6)"><g transform="${base}"><g transform="${posa}">` +
      germoglio(s.ger, opz.piccolo) + `<path d="${SEME}" fill="${opz.corpo || '#6a5cf5'}"/>` + (opz.senzaViso ? '' : occhi(s) + bocca) + `</g></g></g></svg>`;
  }
  window.GERMO7 = { disegna, STATI };
})();
