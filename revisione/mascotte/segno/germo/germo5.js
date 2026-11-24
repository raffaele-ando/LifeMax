/* GERMO, quinta versione. Dentro i limiti: seme + 2 occhi + germoglio (4 forme),
   3 colori piatti, bocca solo nella gioia. Correzioni del terzo giudizio:
   - sagoma da seme: punta morbida in alto che diventa lo stelo, base piatta e larga;
   - occhi al 14% della larghezza ciascuno (28% insieme), ovali 1:1,25, al 60% dell'altezza;
   - lo sguardo guarda sempre qualcosa; nessun occhio tagliato o a trattino;
   - scala di deformazione obbligatoria (altezza/larghezza), a volume costante;
   - germoglio = coda del cane: una regola sola (alto = energia, coppa = cura,
     piegato = stanchezza, spirale = sonno, cuore = affetto);
   - stelo al 7% della larghezza, foglie al 30%: leggibile anche piccolo. */
(function () {
  const INK = '#1d1747', CORPO = '#6a5cf5', VERDE = '#2fbf86';
  /* il seme: punta in alto (x=100, y=50), fianchi pieni, base piatta da 60 a 140 */
  const SEME = 'M100 50C111 52 130 72 147 96C163 118 168 140 166 160C164 177 155 186 140 186H60C45 186 36 177 34 160C32 140 37 118 53 96C70 72 89 52 100 50Z';
  const L = 132;                       /* larghezza del corpo */
  const OX = 22.5, OY = 132, RX = 9.3, RY = 11.6;

  function occhi(s) {
    const [gx, gy] = s.g || [0, 0], k = s.scala || 1, ox = OX * (s.vicini || 1);
    const pos = [[100 - ox + gx, OY + gy], [100 + ox + gx, OY + gy]];
    const rx = RX * k, ry = RY * k * (s.schiaccia || 1);
    if (s.o === 'archi') return pos.map(([x, y]) => `<path d="M${x - 10} ${y + 4}Q${x} ${y - 11} ${x + 10} ${y + 4}" fill="none" stroke="${INK}" stroke-width="6.5" stroke-linecap="round"/>`).join('');
    if (s.o === 'chiusi') return pos.map(([x, y]) => `<path d="M${x - 10} ${y}Q${x} ${y + 9} ${x + 10} ${y}" fill="none" stroke="${INK}" stroke-width="6.5" stroke-linecap="round"/>`).join('');
    return pos.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${INK}"/>`).join('');
  }

  /* il germoglio: stelo spesso e foglie lunghe. fogliaS = foglia "a coppa" (curva verso l'alto) */
  const F = 'M0 0C7 -13 25 -15 35 -5C25 6 10 7 0 0Z';
  const foglia = (x, y, a, s, coppa) => `<path d="${F}" transform="translate(${x} ${y}) rotate(${a}) scale(${s || 1} ${(s || 1) * (coppa ? -1 : 1)})"/>`;
  const SW = 9;
  function germoglio(p) {
    const st = d => `<path d="${d}" fill="none" stroke="${VERDE}" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const g = (d, f) => `<g fill="${VERDE}">${st(d)}${f}</g>`;
    switch (p) {
      case 'riposo':  return g('M100 54C100 44 102 36 105 30', foglia(105, 31, -160) + foglia(105, 31, -22));
      case 'alto':    return g('M100 54V12', foglia(100, 14, -130, 1.12) + foglia(100, 14, -50, 1.12));
      case 'teso':    return g('M100 54V24', foglia(100, 26, -100, .9) + foglia(100, 26, -80, .9));
      case 'aperto':  return g('M100 54V26', foglia(100, 28, 190, 1.15) + foglia(100, 28, -10, 1.15));
      case 'saluto':  return g('M100 54C100 42 108 32 118 28', foglia(118, 29, -62, 1.05) + foglia(118, 29, 14, .95));
      case 'coppa':   return g('M100 54C100 44 104 38 110 34', foglia(110, 35, 215, 1.05, true) + foglia(110, 35, -35, 1.05, true));
      case 'inclinato': return g('M100 54L114 18', foglia(114, 20, -140, 1) + foglia(114, 20, -60, 1));
      case 'molla':   return g('M100 54l-8-6 16-6-16-6 16-6-8-6', foglia(100, 26, -150) + foglia(100, 26, -30));
      case 'piegato': return g('M100 54C100 44 106 36 122 38', foglia(122, 39, 80, .95) + foglia(122, 39, 120, .9));
      case 'spirale': return g('M100 54C100 40 118 36 120 46C121 54 110 56 110 48', foglia(110, 48, -70, .75) + foglia(110, 48, -100, .7));
      case 'cuore':   return g('M100 54V36', '<path d="M100 40C90 31 76 26 74 14C72 2 89 -2 100 12C111 -2 128 2 126 14C124 26 110 31 100 40Z"/>');
    }
    return '';
  }

  /* r = altezza/larghezza del corpo (1 = forma di base). Volume costante: sx=1/√r, sy=√r */
  const STATI = [
    { k: 'felice',      n: 'Felice',      r: 1.00, o: 'ovali', g: [3, 1],    ger: 'riposo',   incl: 0 },
    { k: 'gioia',       n: 'Gioia',       r: 1.20, o: 'archi', g: [0, -2],   ger: 'alto',     incl: 0, su: 18, bocca: 1 },
    { k: 'fiero',       n: 'Fiero',       r: 1.10, o: 'ovali', g: [2, -6],   ger: 'aperto',   incl: -3 },
    { k: 'sorpreso',    n: 'Sorpreso',    r: 1.12, o: 'ovali', g: [0, -3],   ger: 'molla',    incl: 0, scala: 1.2, su: 6 },
    { k: 'curioso',     n: 'Curioso',     r: 1.05, o: 'ovali', g: [13, -2],  ger: 'inclinato', incl: 6 },
    { k: 'ciao',        n: 'Ciao!',       r: 1.00, o: 'ovali', g: [-3, -1],  ger: 'saluto',   incl: -8, su: 6 },
    { k: 'concentrato', n: 'Concentrato', r: .92,  o: 'ovali', g: [4, 8],    ger: 'teso',     incl: 3, scala: .72, vicini: .75 },
    { k: 'capisce',     n: 'Ti capisce',  r: .92,  o: 'ovali', g: [0, 4],    ger: 'coppa',    incl: 8 },
    { k: 'affetto',     n: 'Affetto',     r: .95,  o: 'ovali', g: [0, 2],    ger: 'cuore',    incl: 0, scala: 1.06 },
    { k: 'stanco',      n: 'Stanco',      r: .82,  o: 'ovali', g: [0, 5],    ger: 'piegato',  incl: 4, schiaccia: .62 },
    { k: 'dorme',       n: 'Dorme',       r: .78,  o: 'chiusi', g: [0, 4],   ger: 'spirale',  incl: 0 }
  ];

  function disegna(k, opz) {
    opz = opz || {};
    const s = STATI.find(x => x.k === k), sx = 1 / Math.sqrt(s.r), sy = Math.sqrt(s.r), su = s.su || 0;
    const base = 'translate(100 186) scale(.8) translate(-100 -186)';
    const posa = `translate(100 ${186 - su}) rotate(${s.incl}) scale(${sx.toFixed(3)} ${sy.toFixed(3)}) translate(-100 -186)`;
    const w = 96 * sx * (su > 8 ? .7 : 1);
    const ombra = `<rect x="${(100 - w / 2).toFixed(1)}" y="185" width="${w.toFixed(1)}" height="9" rx="4.5" fill="${opz.terra || 'rgba(90,76,230,.18)'}"/>`;
    const bocca = s.bocca ? `<path d="M88 152Q100 166 112 152" fill="none" stroke="${INK}" stroke-width="6.5" stroke-linecap="round"/>` : '';
    return `<svg viewBox="0 0 200 200" role="img" aria-label="Germo: ${s.n}">${ombra}<g transform="${base}"><g transform="${posa}">` +
      germoglio(s.ger) + `<path d="${SEME}" fill="${opz.corpo || CORPO}"/>` + (opz.senzaViso ? '' : occhi(s) + bocca) + `</g></g></svg>`;
  }
  window.GERMO5 = { disegna, STATI };
})();
