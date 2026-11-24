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
  const SEME = 'M96 58C130 56 158 82 160 118C162 154 136 184 98 184C62 184 38 158 38 122C38 86 62 60 96 58Z';
  const BASE = [98, 184], CIMA = [106, 59];       /* da dove nasce il germoglio: fuori asse */
  const OX = 22, OY = 128, RX = 12.5, RY = 15.6;

  function occhi(s) {
    const [gx, gy] = s.g || [0, 0], k = s.scala || 1;
    const c = [[99 - OX + gx, OY + gy], [99 + OX + gx, OY + gy]];
    const rx = RX * k, ry = RY * k * (s.schiaccia || 1);
    if (s.o === 'archi') return c.map(([x, y]) => `<path d="M${x - 12} ${y + 5}Q${x} ${y - 12} ${x + 12} ${y + 5}" fill="none" stroke="${INK}" stroke-width="7.5" stroke-linecap="round"/>`).join('');
    if (s.o === 'chiusi') return c.map(([x, y]) => `<path d="M${x - 12} ${y}Q${x} ${y + 10} ${x + 12} ${y}" fill="none" stroke="${INK}" stroke-width="7.5" stroke-linecap="round"/>`).join('');
    /* mezzi: la parte bassa dell'ovale, con il taglio dritto: stanco ma sereno */
    if (s.o === 'mezzi') return c.map(([x, y]) => `<path d="M${x - rx} ${y - 2}A${rx} ${ry * .62} 0 0 0 ${x + rx} ${y - 2}Z" fill="${INK}"/>`).join('');
    return c.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${INK}"/>`).join('');
  }

  const F = 'M0 0C7 -13 25 -15 35 -5C25 6 10 7 0 0Z';
  const foglia = (x, y, a, s) => `<path d="${F}" transform="translate(${x} ${y}) rotate(${a}) scale(${s || 1})"/>`;
  function germoglio(p, piccolo) {
    const [x0, y0] = CIMA, sw = piccolo ? 12 : 9;
    const g = (d, f) => `<g fill="${VERDE}"><path d="${d}" fill="none" stroke="${VERDE}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>${f}</g>`;
    const m = `M${x0} ${y0}`;
    switch (p) {
      case 'riposo':   return g(`${m}C${x0} 48 ${x0 + 2} 40 ${x0 + 5} 34`, foglia(x0 + 5, 35, -160) + foglia(x0 + 5, 35, -22));
      /* ciao: una foglia sola, alzata e aperta come una mano */
      case 'ciao':     return g(`${m}C${x0} 46 ${x0 + 4} 38 ${x0 + 8} 34`, foglia(x0 + 8, 35, -160, .85) + foglia(x0 + 8, 35, -75, 1.25));
      case 'alto':     return g(`${m}V14`, foglia(x0, 16, -128, 1.1) + foglia(x0, 16, -52, 1.1));
      case 'largo':    return g(`${m}V30`, foglia(x0, 32, 192, 1.2) + foglia(x0, 32, -12, 1.2));
      /* punto interrogativo */
      case 'domanda':  return g(`${m}C${x0} 48 ${x0 - 2} 40 ${x0 + 6} 32C${x0 + 16} 22 ${x0 + 4} 10 ${x0 - 8} 18`, foglia(x0 - 8, 18, 160, .8));
      case 'bocciolo': return g(`${m}V30`, `<path d="M${x0} 32C${x0 - 9} 26 ${x0 - 9} 12 ${x0} 4C${x0 + 9} 12 ${x0 + 9} 26 ${x0} 32Z"/>`);
      /* coppa: due foglie che salgono e si chiudono, come mani a conca */
      case 'coppa':    return g(`${m}V40`, `<path d="M${x0} 42C${x0 - 16} 40 ${x0 - 24} 26 ${x0 - 20} 12C${x0 - 12} 20 ${x0 - 4} 30 ${x0} 42C${x0 + 4} 30 ${x0 + 12} 20 ${x0 + 20} 12C${x0 + 24} 26 ${x0 + 16} 40 ${x0} 42Z"/>`);
      case 'cuore':    return g(`${m}V38`, `<path d="M${x0} 42C${x0 - 10} 33 ${x0 - 24} 28 ${x0 - 26} 16C${x0 - 28} 4 ${x0 - 11} 0 ${x0} 14C${x0 + 11} 0 ${x0 + 28} 4 ${x0 + 26} 16C${x0 + 24} 28 ${x0 + 10} 33 ${x0} 42Z"/>`);
      /* stanco: piegato di lato fino a toccare il corpo */
      case 'piegato':  return g(`${m}C${x0} 46 ${x0 + 14} 38 ${x0 + 30} 52`, foglia(x0 + 30, 53, 75, .95) + foglia(x0 + 30, 53, 120, .85));
      /* dorme: un solo grande ricciolo, leggibile anche piccolo */
      case 'ricciolo': return g(`${m}C${x0} 38 ${x0 + 28} 32 ${x0 + 28} 48C${x0 + 28} 58 ${x0 + 14} 58 ${x0 + 14} 48`, '');
    }
    return '';
  }

  /* r = altezza/larghezza (volume costante), incl = gradi, su = salto, g = sguardo */
  const STATI = [
    { k: 'felice',      n: 'Felice',      r: 1,    incl: 0,   o: 'ovali', g: [2, 1],    ger: 'riposo' },
    { k: 'ciao',        n: 'Ciao!',       r: 1.03, incl: 0,   o: 'ovali', g: [0, -1],   ger: 'ciao', su: 8 },
    { k: 'gioia',       n: 'Gioia',       r: 1.09, incl: 0,   o: 'archi', g: [0, -2],   ger: 'alto', su: 20, bocca: 1 },
    { k: 'fiero',       n: 'Fiero',       r: 1.06, incl: -9,  o: 'ovali', g: [-2, -7],  ger: 'largo' },
    { k: 'curioso',     n: 'Curioso',     r: 1.03, incl: 14,  o: 'ovali', g: [10, -5],  ger: 'domanda' },
    { k: 'concentrato', n: 'Concentrato', r: .95,  incl: 6,   o: 'ovali', g: [5, 8],    ger: 'bocciolo', schiaccia: .82 },
    { k: 'capisce',     n: 'Ti capisce',  r: .9,   incl: -7,  o: 'ovali', g: [-3, 5],   ger: 'coppa', scala: 1.08 },
    { k: 'affetto',     n: 'Affetto',     r: .95,  incl: 0,   o: 'archi', g: [0, 2],    ger: 'cuore' },
    { k: 'stanco',      n: 'Stanco',      r: .84,  incl: 3,   o: 'mezzi', g: [0, 4],    ger: 'piegato' },
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
  window.GERMO6 = { disegna, STATI };
})();
