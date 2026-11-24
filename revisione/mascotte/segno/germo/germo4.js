/* GERMO, quarta versione: dentro i limiti delle analisi.
   Forme: corpo (seme) + 2 occhi pieni + germoglio = 4. Bocca (un arco) solo nella gioia.
   Colori: indaco, inchiostro, verde. Niente contorni, riflessi, braccia, sopracciglia, guance.
   Le emozioni nascono solo da: deformazione del corpo, forma e direzione degli occhi,
   posa del germoglio. */
(function () {
  const INK = '#1d1747', CORPO = '#6a5cf5', VERDE = '#2fbf86';
  const CORPO_D = 'M100 58C124 58 162 94 164 136C166 168 140 186 100 186C60 186 34 168 36 136C38 94 76 58 100 58Z';

  /* occhi: ovali pieni, insieme ~27% della larghezza del corpo */
  const OX = 22, OY = 126;
  function occhi(tipo, g) {
    const [gx, gy] = g || [0, 0];
    const due = f => f(100 - OX + gx, OY + gy, -1) + f(100 + OX + gx, OY + gy, 1);
    switch (tipo) {
      case 'ovali':   return due((x, y) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="11" fill="${INK}"/>`);
      case 'grandi':  return due((x, y) => `<ellipse cx="${x}" cy="${y - 2}" rx="9.5" ry="13.5" fill="${INK}"/>`);
      case 'fessure': return due((x, y) => `<rect x="${x - 9}" y="${y - 3}" width="18" height="6.5" rx="3.25" fill="${INK}"/>`);
      case 'archi':   return due((x, y) => `<path d="M${x - 10} ${y + 4}Q${x} ${y - 10} ${x + 10} ${y + 4}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`);
      case 'chiusi':  return due((x, y) => `<path d="M${x - 10} ${y - 1}Q${x} ${y + 9} ${x + 10} ${y - 1}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`);
      /* mezzi: la metà bassa dell'ovale — stanco, ma non triste */
      case 'mezzi':   return due((x, y) => `<path d="M${x - 8} ${y + 1}A8 9 0 0 0 ${x + 8} ${y + 1}Z" fill="${INK}"/>`);
      /* fieri: la metà bassa con il taglio leggermente inclinato verso l'esterno */
      case 'fieri':   return due((x, y, l) => `<path d="M${x - 8} ${y + (l < 0 ? 0 : -3)}L${x + 8} ${y + (l < 0 ? -3 : 0)}A8 9 0 0 1 ${x - 8} ${y + (l < 0 ? 0 : -3)}Z" fill="${INK}"/>`);
    }
    return '';
  }

  /* il germoglio: un solo pezzo verde (stelo + due foglie), mille pose */
  function foglia(x, y, a, s) { return `<path d="M0 0C6 -11 21 -13 29 -4C21 5 8 6 0 0Z" transform="translate(${x} ${y}) rotate(${a}) scale(${s || 1})"/>`; }
  function germoglio(p) {
    const g = (d, f) => `<g fill="${VERDE}"><path d="${d}" fill="none" stroke="${VERDE}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>${f}</g>`;
    switch (p) {
      case 'riposo':     return g('M100 62C100 50 103 40 107 33', foglia(107, 34, -158) + foglia(107, 34, -26));
      case 'su':         return g('M100 62V18', foglia(100, 19, -128, 1.1) + foglia(100, 19, -52, 1.1));
      case 'teso':       return g('M100 62V26', foglia(100, 27, -97, .95) + foglia(100, 27, -83, .95));
      case 'largo':      return g('M100 62V30', foglia(100, 31, 186, 1.2) + foglia(100, 31, -6, 1.2));
      case 'verso':      return g('M100 62C102 52 112 44 124 42', foglia(124, 43, 28) + foglia(124, 43, 152, .95));
      case 'molla':      return g('M100 62l-7-6 14-6-14-6 14-6-7-6', foglia(100, 33, -150) + foglia(100, 33, -30));
      case 'giu':        return g('M100 62C100 48 114 42 122 50', foglia(122, 51, 70, .9) + foglia(122, 51, 115, .85));
      case 'ricciolo':   return g('M100 62C100 46 120 40 122 52C123 60 112 62 112 54', foglia(112, 54, 108, .75) + foglia(112, 54, 82, .75));
      case 'cuore':      return g('M100 62V36', `<path d="M100 38C92 30 80 26 78 16C76 6 90 2 100 14C110 2 124 6 122 16C120 26 108 30 100 38Z"/>`);
      case 'saluto':     return g('M100 62C100 50 108 40 118 36', foglia(118, 37, -60, 1.05) + foglia(118, 37, 15, .95));
    }
    return '';
  }

  /* gli stati: ognuno cambia solo corpo, occhi e germoglio */
  const STATI = [
    { k: 'felice',      n: 'Felice',       o: 'ovali',   g: [3, 1],  ger: 'riposo',   sx: 1,    sy: 1,    su: 0,  incl: 0 },
    { k: 'gioia',       n: 'Gioia',        o: 'archi',   g: [0, 0],  ger: 'su',       sx: .92,  sy: 1.1,  su: 18, incl: 0, bocca: 1 },
    { k: 'concentrato', n: 'Concentrato',  o: 'fessure', g: [5, 4],  ger: 'teso',     sx: 1.06, sy: .95,  su: 0,  incl: 4 },
    { k: 'fiero',       n: 'Fiero',        o: 'fieri',   g: [2, -3], ger: 'largo',    sx: .95,  sy: 1.08, su: 0,  incl: -3 },
    { k: 'saluto',      n: 'Ciao!',        o: 'ovali',   g: [-2, -1], ger: 'saluto',  sx: .97,  sy: 1.04, su: 6,  incl: -6 },
    { k: 'capisce',     n: 'Ti capisce',   o: 'grandi',  g: [0, 2],  ger: 'verso',    sx: 1.03, sy: .97,  su: 0,  incl: 10 },
    { k: 'curioso',     n: 'Curioso',      o: 'grandi',  g: [6, -3], ger: 'molla',    sx: .97,  sy: 1.05, su: 4,  incl: -10 },
    { k: 'stanco',      n: 'Stanco',       o: 'mezzi',   g: [0, 3],  ger: 'giu',      sx: 1.09, sy: .91,  su: 0,  incl: 0 },
    { k: 'dorme',       n: 'Dorme',        o: 'chiusi',  g: [0, 4],  ger: 'ricciolo', sx: 1.08, sy: .93,  su: 0,  incl: -4 },
    { k: 'affetto',     n: 'Affetto',      o: 'archi',   g: [0, 2],  ger: 'cuore',    sx: 1.04, sy: .98,  su: 0,  incl: 6 }
  ];

  function disegna(k, opz) {
    opz = opz || {};
    const s = STATI.find(x => x.k === k);
    const base = 'translate(100 186) scale(.8) translate(-100 -186)';
    const posa = `translate(100 ${186 - s.su}) rotate(${s.incl}) scale(${s.sx} ${s.sy}) translate(-100 -186)`;
    const ombra = `<rect x="${100 - 44 * (s.su > 8 ? .68 : 1)}" y="185" width="${88 * (s.su > 8 ? .68 : 1)}" height="9" rx="4.5" fill="${opz.terra || 'rgba(27,22,64,.12)'}"/>`;
    const bocca = s.bocca ? `<path d="M88 146Q100 160 112 146" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` : '';
    return `<svg viewBox="0 0 200 200" role="img" aria-label="Germo: ${s.n}">${ombra}<g transform="${base}"><g transform="${posa}">` +
      germoglio(s.ger) + `<path d="${CORPO_D}" fill="${opz.corpo || CORPO}"/>` + (opz.senzaViso ? '' : occhi(s.o, s.g) + bocca) +
      `</g></g></svg>`;
  }
  window.GERMO4 = { disegna, STATI };
})();
