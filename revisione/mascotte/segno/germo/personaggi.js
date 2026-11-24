/* PERSONAGGI CON EMOZIONI. Un sistema unico per il viso (occhi con pupilla e
   riflessi, sopracciglia, bocca, guance) e per i gesti (braccine), applicato a
   corpi diversi. Le emozioni sono costruite come le fa un animatore: sguardo,
   sopracciglia, bocca, postura e gesto insieme. viewBox 0 0 200 200, terra a y=184. */
(function () {
  const INK = '#1d1747';
  let N = 0;

  /* ---------- emozioni: ogni parte del viso e del corpo ---------- */
  const EMO = {
    felice:      { n: 'Felice',       occhi: 'aperti', pup: [1, 1],  brow: [-6, 'su'],   bocca: 'sorriso', guance: .55, sx: 1, sy: 1, su: 0, braccia: ['giu', 'saluto'] },
    gioia:       { n: 'Gioia',        occhi: 'archi',  pup: [0, 0],  brow: [-10, 'su'],  bocca: 'risata', guance: .75, sx: .94, sy: 1.08, su: 14, braccia: ['alto', 'alto'], festa: 1 },
    concentrato: { n: 'Concentrato',  occhi: 'aperti', pup: [4, 5],  brow: [-2, 'giu'],  bocca: 'piccola', guance: .3, sx: 1.03, sy: .97, su: 0, braccia: ['avanti', 'avanti'], palpebra: .28 },
    fiero:       { n: 'Fiero',        occhi: 'chiusi', pup: [0, 0],  brow: [-8, 'su'],   bocca: 'sorrisone', guance: .6, sx: 1, sy: 1.04, su: 0, braccia: ['fianchi', 'fianchi'] },
    incoraggia:  { n: 'Incoraggia',   occhi: 'occhiolino', pup: [2, 0], brow: [-8, 'su'], bocca: 'sorriso', guance: .6, sx: 1, sy: 1, su: 0, braccia: ['giu', 'pugno'] },
    triste:      { n: 'Ti capisce',   occhi: 'lucidi', pup: [0, 3],  brow: [-4, 'triste'], bocca: 'tremola', guance: .35, sx: 1.05, sy: .94, su: 0, braccia: ['giu', 'giu'] },
    sorpreso:    { n: 'Sorpreso',     occhi: 'aperti', pup: [0, -1], brow: [-14, 'su'],  bocca: 'o', guance: .3, sx: .97, sy: 1.05, su: 4, braccia: ['su', 'su'], pupPiccola: 1 },
    assonnato:   { n: 'Assonnato',    occhi: 'aperti', pup: [0, 3],  brow: [-2, 'piatte'], bocca: 'sbadiglio', guance: .3, sx: 1.05, sy: .95, su: 0, braccia: ['giu', 'bocca'], palpebra: .55 },
    affetto:     { n: 'Abbraccio',    occhi: 'chiusi', pup: [0, 0],  brow: [-6, 'su'],   bocca: 'sorriso', guance: .8, sx: 1, sy: 1, su: 0, braccia: ['abbraccio', 'abbraccio'], cuore: 1 }
  };

  /* ---------- il viso ---------- */
  function occhio(e, x, y, lato, corpo) {
    const id = 'c' + (++N);
    const rx = 13, ry = 15.5;
    if (e.occhi === 'archi' || (e.occhi === 'occhiolino' && lato > 0))
      return `<path d="M${x - 10} ${y + 3}Q${x} ${y - 10} ${x + 10} ${y + 3}" fill="none" stroke="${INK}" stroke-width="4.6" stroke-linecap="round"/>`;
    if (e.occhi === 'chiusi')
      return `<path d="M${x - 10} ${y - 1}Q${x} ${y + 9} ${x + 10} ${y - 1}" fill="none" stroke="${INK}" stroke-width="4.6" stroke-linecap="round"/>`;
    const [px, py] = e.pup, pr = e.pupPiccola ? 5.5 : 8.8;
    let s = `<clipPath id="${id}"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/></clipPath>` +
      `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff"/>` +
      `<g clip-path="url(#${id})"><circle cx="${x + px}" cy="${y + py + 1}" r="${pr}" fill="${INK}"/>` +
      `<circle cx="${x + px - 2.6}" cy="${y + py - 2.6}" r="${e.occhi === 'lucidi' ? 3.6 : 2.8}" fill="#fff"/>` +
      `<circle cx="${x + px + 2.6}" cy="${y + py + 3}" r="${e.occhi === 'lucidi' ? 2 : 1.3}" fill="#fff"/>`;
    if (e.occhi === 'lucidi') s += `<path d="M${x - rx} ${y + 8}Q${x} ${y + 12} ${x + rx} ${y + 8}V${y + ry}H${x - rx}Z" fill="#cfe9ff" opacity=".7"/>`;
    if (e.palpebra) s += `<rect x="${x - rx - 1}" y="${y - ry - 1}" width="${rx * 2 + 2}" height="${(ry * 2) * e.palpebra + 1}" fill="${corpo}"/>` +
      `<path d="M${x - rx} ${y - ry + ry * 2 * e.palpebra}H${x + rx}" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
    return s + '</g>';
  }
  function ciglio(e, x, y, lato) {
    const [dy, tipo] = e.brow, yb = y - 23 + dy;
    let a = 0; /* inclinazione: lato interno su o giù */
    if (tipo === 'giu') a = 9; if (tipo === 'triste') a = -10; if (tipo === 'su') a = -3;
    const xi = x - lato * 7, xe = x + lato * 7;
    const yi = yb + a * .5, ye = yb - a * .5;
    return `<path d="M${xi} ${yi}Q${x} ${Math.min(yi, ye) - (tipo === 'piatte' ? 0 : 3)} ${xe} ${ye}" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  }
  function bocca(e, x, y) {
    switch (e.bocca) {
      case 'sorriso': return `<path d="M${x - 8} ${y}Q${x} ${y + 8} ${x + 8} ${y}" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
      case 'sorrisone': return `<path d="M${x - 11} ${y - 1}Q${x} ${y + 12} ${x + 11} ${y - 1}" fill="none" stroke="${INK}" stroke-width="4.2" stroke-linecap="round"/>`;
      case 'piccola': return `<path d="M${x - 4} ${y + 2}H${x + 4}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
      case 'risata': return `<path d="M${x - 12} ${y - 2}Q${x} ${y} ${x + 12} ${y - 2}Q${x + 11} ${y + 16} ${x} ${y + 16}Q${x - 11} ${y + 16} ${x - 12} ${y - 2}Z" fill="${INK}"/><ellipse cx="${x}" cy="${y + 12}" rx="6.5" ry="4" fill="#ff7b8a"/>`;
      case 'o': return `<ellipse cx="${x}" cy="${y + 4}" rx="5.5" ry="7" fill="${INK}"/>`;
      case 'tremola': return `<path d="M${x - 9} ${y + 5}Q${x - 4.5} ${y + 1} ${x} ${y + 3}Q${x + 4.5} ${y + 5} ${x + 9} ${y + 2}" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>`;
      case 'sbadiglio': return `<ellipse cx="${x}" cy="${y + 5}" rx="7" ry="8.5" fill="${INK}"/><ellipse cx="${x}" cy="${y + 9}" rx="4" ry="3" fill="#ff7b8a"/>`;
    }
    return '';
  }
  function viso(e, fx, fy, corpo) {
    const g = e.guance ? `<ellipse cx="${fx - 31}" cy="${fy + 14}" rx="8.5" ry="5" fill="#ff7aa0" opacity="${e.guance}"/><ellipse cx="${fx + 31}" cy="${fy + 14}" rx="8.5" ry="5" fill="#ff7aa0" opacity="${e.guance}"/>` : '';
    return g + ciglio(e, fx - 19, fy, -1) + ciglio(e, fx + 19, fy, 1) +
      occhio(e, fx - 19, fy, -1, corpo) + occhio(e, fx + 19, fy, 1, corpo) + bocca(e, fx, fy + 22);
  }

  /* ---------- le braccine: capsule che partono dai fianchi ---------- */
  const POSA = {
    giu: [200, 18], saluto: [-40, 24], alto: [-25, 26], avanti: [130, 18], fianchi: [150, 15],
    pugno: [-60, 22], su: [-10, 20], bocca: [-150, 22], abbraccio: [35, 30]
  };
  function braccio(nome, sx, sy, lato, col) {
    const p = POSA[nome]; if (!p) return '';
    const ang = (lato < 0 ? 180 - p[0] : p[0]) * Math.PI / 180, L = p[1];
    const ex = sx + Math.cos(ang) * L * (lato < 0 ? 1 : 1), ey = sy - Math.sin(ang) * L;
    /* le dita: un pallino in fondo, più grande se è un pugno */
    return `<path d="M${sx} ${sy}L${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="${col}" stroke-width="13" stroke-linecap="round"/>` +
      (nome === 'pugno' ? `<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="8.5" fill="${col}"/>` : '');
  }

  /* ---------- i corpi ---------- */
  const CORPI = {
    /* A · Mochi: una pagnottina morbida, larga in basso */
    mochi: {
      nome: 'Mochi', colore: '#6a5cf5', scuro: '#4d3fd6', faccia: [100, 118], spalle: [[42, 140], [158, 140]],
      corpo: () => `<path d="M100 52C142 52 166 84 166 124C166 160 140 178 100 178C60 178 34 160 34 124C34 84 58 52 100 52Z"/>`,
      extra: () => '', piedi: [[78, 180], [122, 180]]
    },
    /* B · Pip: tondo con due orecchie morbide (che si abbassano quando è giù) */
    pip: {
      nome: 'Pip', colore: '#6a5cf5', scuro: '#4d3fd6', faccia: [100, 120], spalle: [[42, 140], [158, 140]],
      corpo: () => `<circle cx="100" cy="118" r="62"/>`,
      extra: (e, col) => { const giu = e === EMO.triste || e === EMO.assonnato; const a = giu ? 40 : (e === EMO.gioia || e === EMO.sorpreso ? -12 : 0);
        return [[-1, 62], [1, 138]].map(([l, x]) => `<g transform="rotate(${l * a} ${x} 70)"><ellipse cx="${x}" cy="58" rx="15" ry="22" fill="${col}" transform="rotate(${l * 24} ${x} 58)"/><ellipse cx="${x}" cy="60" rx="7" ry="12" fill="#ff9bbd" opacity=".75" transform="rotate(${l * 24} ${x} 60)"/></g>`).join(''); },
      piedi: [[80, 180], [120, 180]]
    },
    /* C · Germo: un seme con un germoglio che fa da antenna emotiva */
    germo: {
      nome: 'Germo', colore: '#6a5cf5', scuro: '#4d3fd6', faccia: [100, 124], spalle: [[44, 144], [156, 144]],
      corpo: () => `<path d="M100 56C140 56 160 92 160 128C160 162 136 180 100 180C64 180 40 162 40 128C40 92 60 56 100 56Z"/>`,
      extra: e => { let d, foglie;
        if (e === EMO.triste || e === EMO.assonnato) { d = 'M100 58C100 46 108 40 118 44'; foglie = `<path d="M118 44C128 46 132 56 126 64C118 62 114 52 118 44Z" fill="#2fbf86"/>`; }
        else if (e === EMO.gioia || e === EMO.fiero || e === EMO.sorpreso) { d = 'M100 58C100 44 100 34 100 24'; foglie = `<path d="M100 26C92 12 78 12 74 20C80 30 92 32 100 26Z" fill="#2fbf86"/><path d="M100 26C108 12 122 12 126 20C120 30 108 32 100 26Z" fill="#45d69b"/>`; }
        else { d = 'M100 58C100 46 102 38 106 32'; foglie = `<path d="M106 32C100 18 86 18 82 26C88 36 100 38 106 32Z" fill="#2fbf86"/><path d="M106 32C114 20 128 20 131 28C124 37 112 38 106 32Z" fill="#45d69b"/>`; }
        return `<path d="${d}" fill="none" stroke="#1f9e6c" stroke-width="5" stroke-linecap="round"/>` + foglie; },
      piedi: [[80, 182], [120, 182]]
    }
  };

  function disegna(chi, chiaveEmo, opz) {
    opz = opz || {};
    const C = CORPI[chi], e = EMO[chiaveEmo];
    const col = opz.colore || C.colore, scuro = opz.scuro || C.scuro;
    const t = `translate(100 ${184 - e.su}) scale(${e.sx} ${e.sy}) translate(-100 -184)`;
    const ombra = `<ellipse cx="100" cy="188" rx="${(52 * (e.su ? .75 : 1)).toFixed(1)}" ry="6" fill="#000" opacity=".1"/>`;
    const festa = e.festa ? '<path d="M38 52l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#ffb020"/><path d="M168 40l2.4 6 6 2.4-6 2.4-2.4 6-2.4-6-6-2.4 6-2.4z" fill="#ff7aa0"/><rect x="152" y="80" width="10" height="5" rx="2" fill="#2fbf86" transform="rotate(30 157 82)"/><rect x="30" y="96" width="10" height="5" rx="2" fill="#4cc3ff" transform="rotate(-25 35 98)"/>' : '';
    const cuore = e.cuore ? '<path d="M150 50c-4-7-14-5-14 3 0 7 14 14 14 14s14-7 14-14c0-8-10-10-14-3z" fill="#ff5c8a"/>' : '';
    const zz = chiaveEmo === 'assonnato' ? '<text x="150" y="58" font-family="system-ui" font-weight="700" font-size="18" fill="#9a90ff">z</text><text x="164" y="42" font-family="system-ui" font-weight="700" font-size="13" fill="#9a90ff">z</text>' : '';
    const piedi = C.piedi.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="15" ry="8" fill="${scuro}"/>`).join('');
    const [bs, bd] = e.braccia;
    const dietro = '';
    const davanti = braccio(bs, C.spalle[0][0] + 6, C.spalle[0][1], -1, scuro) + braccio(bd, C.spalle[1][0] - 6, C.spalle[1][1], 1, scuro);
    const riflesso = `<ellipse cx="72" cy="${C.faccia[1] - 40}" rx="14" ry="7" fill="#fff" opacity=".22" transform="rotate(-30 72 ${C.faccia[1] - 40})"/>`;
    return `<svg viewBox="0 0 200 200" role="img" aria-label="${C.nome}: ${e.n}">${ombra}${festa}` +
      `<g transform="${t}">${piedi}${dietro}${C.extra(e, col)}<g fill="${col}">${C.corpo()}</g>${riflesso}` +
      viso(e, C.faccia[0], C.faccia[1], col) + davanti + `</g>${cuore}${zz}</svg>`;
  }

  window.MASC = { disegna, EMO, CORPI };
})();
