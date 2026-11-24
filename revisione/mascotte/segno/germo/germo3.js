/* GERMO, terza versione. Un seme che si è appena aperto: la punta in alto,
   la crepa del guscio, il germoglio che ne esce. Tenero, testardo, ottimista.
   Le emozioni le dicono il corpo, gli occhi e soprattutto il germoglio: nessun
   oggetto di scena. Nessun contorno da nessuna parte. */
(function () {
  const INK = '#1d1747', CORPO = '#6a5cf5', ARTO = '#5b4de6', CREPA = '#4b3dd0', GUANCIA = '#ff8db5';
  const F1 = '#2fbf86', F2 = '#52dba3', STELO = '#1f9e6c';
  let N = 0;

  const EMO = {
    felice:      { n: 'Felice',       occhi: 'aperti', pup: [0, 1],  bocca: 'sorriso',       braccia: [18, 18],   incl: 0,  sx: 1,    sy: 1,    su: 0,  ant: 'felice' },
    gioia:       { n: 'Gioia',        occhi: 'archi',                 bocca: 'risata',        braccia: [165, 165], incl: 0,  sx: .95,  sy: 1.07, su: 16, ant: 'gioia' },
    concentrato: { n: 'Concentrato',  occhi: 'aperti', pup: [6, 7],  bocca: 'lingua',        braccia: [-35, -35], incl: 4,  sx: 1.02, sy: .98,  su: 0,  ant: 'concentrato' },
    fiero:       { n: 'Fiero',        occhi: 'fieri',  pup: [5, -1], bocca: 'sorrisone',     braccia: [42, 42],   incl: 0,  sx: .97,  sy: 1.07, su: 0,  ant: 'fiero', faccia: -5 },
    incoraggia:  { n: 'Ce la fai',    occhi: 'aperti', pup: [-1, 0], bocca: 'grande',        braccia: [12, 170],  incl: -6, sx: 1,    sy: 1.03, su: 4,  ant: 'incoraggia', lucidi: 1 },
    capisce:     { n: 'Ti capisce',   occhi: 'aperti', pup: [0, 2],  bocca: 'dolce', brow: 'gentili', braccia: [14, -60], incl: 10, sx: 1, sy: 1, su: 0, ant: 'capisce', lucidi: 1 },
    sorpreso:    { n: 'Sorpreso',     occhi: 'aperti', pup: [0, -1], piccole: 1, bocca: 'o', brow: 'alte', braccia: [125, 125], incl: 0, sx: .96, sy: 1.06, su: 6, ant: 'sorpreso' },
    assonnato:   { n: 'Assonnato',    occhi: 'chiusi',                bocca: 'sbadiglio',     braccia: [4, 4],     incl: -4, sx: 1.05, sy: .95,  su: 0,  ant: 'assonnato' },
    abbraccio:   { n: 'Abbraccio',    occhi: 'aperti', pup: [0, 1],  bocca: 'sorrisone',     braccia: [92, 92],   incl: 0,  sx: 1.03, sy: .99,  su: 0,  ant: 'cuore', lucidi: 1 }
  };

  /* ---------- il viso ---------- */
  const OX = 23, OY = 124, RX = 16, RY = 19.5;
  function occhio(e, x, y) {
    if (e.occhi === 'archi') return `<path d="M${x - 12} ${y + 4}Q${x} ${y - 12} ${x + 12} ${y + 4}" fill="none" stroke="${INK}" stroke-width="5.6" stroke-linecap="round"/>`;
    if (e.occhi === 'chiusi') return `<path d="M${x - 12} ${y}Q${x} ${y + 10} ${x + 12} ${y}" fill="none" stroke="${INK}" stroke-width="5.6" stroke-linecap="round"/>`;
    const id = 'o' + (++N), [px, py] = e.pup || [0, 0], pr = e.piccole ? 7 : 11.5;
    let s = `<clipPath id="${id}"><ellipse cx="${x}" cy="${y}" rx="${RX}" ry="${RY}"/></clipPath><ellipse cx="${x}" cy="${y}" rx="${RX}" ry="${RY}" fill="#fff"/>` +
      `<g clip-path="url(#${id})"><circle cx="${x + px}" cy="${y + py + 1.5}" r="${pr}" fill="${INK}"/>` +
      `<circle cx="${x + px - 3.8}" cy="${y + py - 4.2}" r="${e.piccole ? 2.4 : (e.lucidi ? 4.8 : 4.2)}" fill="#fff"/>` +
      `<circle cx="${x + px + 4}" cy="${y + py + 4.6}" r="${e.piccole ? 1.2 : (e.lucidi ? 2.8 : 2)}" fill="#fff"/>` +
      (e.lucidi ? `<circle cx="${x + px + 4.6}" cy="${y + py - 3}" r="1.5" fill="#fff"/>` : '');
    /* fiero: palpebra a metà, dall'alto, dritta — soddisfatto, non annoiato */
    if (e.occhi === 'fieri') s += `<path d="M${x - RX - 1} ${y - RY - 1}H${x + RX + 1}V${y - 3}Q${x} ${y - 6} ${x - RX - 1} ${y - 3}Z" fill="${CORPO}"/><path d="M${x - RX + 1} ${y - 3.4}Q${x} ${y - 6.4} ${x + RX - 1} ${y - 3.4}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    return s + '</g>';
  }
  function sopracciglia(e) {
    if (!e.brow) return '';
    const y = OY - RY - 9, t = (x, lato) => e.brow === 'alte'
      ? `M${x - 9} ${y - 4}Q${x} ${y - 11} ${x + 9} ${y - 4}`
      : `M${x - lato * 9} ${y - 3}Q${x} ${y - 3.5} ${x + lato * 9} ${y + 1}`;
    return `<path d="${t(100 - OX, -1)} ${t(100 + OX, 1)}" fill="none" stroke="${INK}" stroke-width="4.6" stroke-linecap="round"/>`;
  }
  function bocca(e) {
    const x = 100, y = OY + 26;
    switch (e.bocca) {
      case 'sorriso': return `<path d="M${x - 14} ${y - 1}Q${x} ${y + 13} ${x + 14} ${y - 1}" fill="none" stroke="${INK}" stroke-width="5.4" stroke-linecap="round"/>`;
      case 'sorrisone': return `<path d="M${x - 17} ${y - 3}Q${x} ${y + 16} ${x + 17} ${y - 3}" fill="none" stroke="${INK}" stroke-width="5.6" stroke-linecap="round"/>`;
      case 'dolce': return `<path d="M${x - 11} ${y}Q${x} ${y + 9} ${x + 11} ${y}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
      case 'grande': return `<path d="M${x - 15} ${y - 3}Q${x} ${y} ${x + 15} ${y - 3}Q${x + 13} ${y + 15} ${x} ${y + 15}Q${x - 13} ${y + 15} ${x - 15} ${y - 3}Z" fill="${INK}"/><ellipse cx="${x}" cy="${y + 11}" rx="7.5" ry="4" fill="#ff7b8a"/>`;
      case 'risata': return `<path d="M${x - 17} ${y - 4}Q${x} ${y} ${x + 17} ${y - 4}Q${x + 16} ${y + 21} ${x} ${y + 21}Q${x - 16} ${y + 21} ${x - 17} ${y - 4}Z" fill="${INK}"/><ellipse cx="${x}" cy="${y + 16}" rx="9" ry="5" fill="#ff7b8a"/>`;
      case 'lingua': return `<path d="M${x - 9} ${y + 2}Q${x} ${y + 7} ${x + 9} ${y + 2}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M${x + 4} ${y + 4.5}c0 6 3 9 7 8c3-1 3-5 0-9z" fill="#ff7b8a"/>`;
      case 'o': return `<ellipse cx="${x}" cy="${y + 4}" rx="8" ry="10" fill="${INK}"/>`;
      case 'sbadiglio': return `<ellipse cx="${x}" cy="${y + 3}" rx="7" ry="8" fill="${INK}"/><ellipse cx="${x}" cy="${y + 7}" rx="4" ry="2.6" fill="#ff7b8a"/>`;
    }
    return '';
  }
  function viso(e) {
    const g = `<ellipse cx="${100 - 42}" cy="${OY + 20}" rx="10.5" ry="6.5" fill="${GUANCIA}"/><ellipse cx="${100 + 42}" cy="${OY + 20}" rx="10.5" ry="6.5" fill="${GUANCIA}"/>`;
    return `<g transform="translate(0 ${e.faccia || 0})">` + g + sopracciglia(e) + occhio(e, 100 - OX, OY) + occhio(e, 100 + OX, OY) + bocca(e) + '</g>';
  }

  /* ---------- le braccine: gocce corte attaccate ai fianchi ----------
     angolo 0 = giù lungo il fianco, 90 = in fuori, 180 = in alto, negativo = verso il centro */
  function braccio(ang, lato) {
    const x = 100 + lato * 58, y = 146;
    const goccia = 'M0 -10C9 -10 12 2 10 14C8 26 -8 26 -10 14C-12 2 -9 -10 0 -10Z';
    return `<path d="${goccia}" fill="${ARTO}" transform="translate(${x} ${y}) rotate(${-lato * ang})"/>`;
  }

  /* ---------- il germoglio: un vocabolario di forme ---------- */
  const FOGLIA = 'M0 0C6 -11 21 -13 29 -4C21 5 8 6 0 0Z';
  function foglia(x, y, ang, s, col) { return `<path d="${FOGLIA}" fill="${col || F1}" transform="translate(${x} ${y}) rotate(${ang}) scale(${s || 1})"/>`; }
  function stelo(d, w) { return `<path d="${d}" fill="none" stroke="${STELO}" stroke-width="${w || 6}" stroke-linecap="round" stroke-linejoin="round"/>`; }
  function antenna(stato, alto) {
    const h = alto || 0;           /* quanto è cresciuto (per le fasi) */
    const T = 62;                  /* da dove esce: la punta del seme */
    switch (stato) {
      case 'felice': return stelo(`M100 ${T}C100 ${50 - h} 103 ${40 - h} 107 ${32 - h}`) + foglia(107, 33 - h, -160, 1, F1) + foglia(107, 33 - h, -25, 1, F2);
      case 'gioia': return stelo(`M100 ${T}V${18 - h}`) + foglia(100, 19 - h, -125, 1.1, F1) + foglia(100, 19 - h, -55, 1.1, F2) +
        `<path d="M76 ${26 - h}l-8-4M74 ${36 - h}l-9 0M124 ${26 - h}l8-4M126 ${36 - h}l9 0" stroke="${F2}" stroke-width="3.4" stroke-linecap="round"/>`;
      case 'concentrato': return stelo(`M100 ${T}V${28 - h}`) + foglia(100, 29 - h, -98, .95, F1) + foglia(100, 29 - h, -82, .95, F2);
      case 'fiero': return stelo(`M100 ${T}V${30 - h}`) + foglia(100, 31 - h, 188, 1.2, F1) + foglia(100, 31 - h, -8, 1.2, F2);
      case 'incoraggia': return stelo(`M100 ${T}C100 ${50 - h} 108 ${38 - h} 118 ${34 - h}`) + foglia(118, 35 - h, -70, 1.05, F2) + foglia(118, 35 - h, 10, .95, F1);
      case 'capisce': return stelo(`M100 ${T}C102 ${52 - h} 112 ${44 - h} 124 ${42 - h}`) + foglia(124, 43 - h, 30, 1, F2) + foglia(124, 43 - h, 150, .95, F1);
      case 'sorpreso': return stelo(`M100 ${T}l-7-6 14-6-14-6 14-6-7-6`, 5) + foglia(100, 33, -150, 1, F1) + foglia(100, 33, -30, 1, F2) +
        `<path d="M84 22q-4 6 0 12M116 22q4 6 0 12" fill="none" stroke="${F2}" stroke-width="3" stroke-linecap="round"/>`;
      case 'assonnato': return stelo(`M100 ${T}C100 ${46 - h} 120 ${40 - h} 122 ${52 - h}C123 ${60 - h} 112 ${62 - h} 112 ${54 - h}`) + foglia(112, 54 - h, 110, .75, F1) + foglia(112, 54 - h, 80, .75, F2);
      case 'cuore': return stelo(`M100 ${T}V${36 - h}`) +
        /* due foglie che si chiudono a cuore */
        `<path d="M100 ${38 - h}C92 ${30 - h} 80 ${26 - h} 78 ${16 - h}C76 ${6 - h} 90 ${2 - h} 100 ${14 - h}Z" fill="${F1}"/><path d="M100 ${38 - h}C108 ${30 - h} 120 ${26 - h} 122 ${16 - h}C124 ${6 - h} 110 ${2 - h} 100 ${14 - h}Z" fill="${F2}"/>`;
    }
    return '';
  }

  /* il corpo: un seme con la punta in alto e la crepa del guscio */
  const CORPO_D = 'M100 58C124 58 162 94 164 136C166 168 140 186 100 186C60 186 34 168 36 136C38 94 76 58 100 58Z';
  function corpo() {
    return `<path d="${CORPO_D}" fill="${CORPO}"/>` +
      `<path d="M96 64Q88 74 92 86" fill="none" stroke="${CREPA}" stroke-width="3.2" stroke-linecap="round" opacity=".65"/>` +
      /* la luce: una mezzaluna sul bordo destro, sempre uguale */
      `<path d="M146 104C156 120 158 140 152 158" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".2"/>`;
  }

  function disegna(chiave, opz) {
    opz = opz || {};
    const e = EMO[chiave];
    const base = 'translate(100 186) scale(.8) translate(-100 -186)';
    const posa = `translate(100 ${186 - e.su}) rotate(${e.incl}) scale(${e.sx} ${e.sy}) translate(-100 -186)`;
    const ombra = `<ellipse cx="100" cy="190" rx="${(48 * (e.su > 8 ? .66 : 1)).toFixed(1)}" ry="6" fill="#000" opacity="${e.su > 8 ? .07 : .11}"/>`;
    const piedi = `<ellipse cx="80" cy="186" rx="15" ry="8.5" fill="${ARTO}"/><ellipse cx="120" cy="186" rx="15" ry="8.5" fill="${ARTO}"/>`;
    const senzaViso = opz.senzaViso ? '' : viso(e);
    return `<svg viewBox="0 0 200 200" role="img" aria-label="Germo: ${e.n}">${ombra}<g transform="${base}"><g transform="${posa}">` +
      piedi + antenna(e.ant, opz.alto) + braccio(e.braccia[0], -1) + braccio(e.braccia[1], 1) + corpo() + senzaViso +
      `</g></g></svg>`;
  }

  /* LE FASI: la costanza fa crescere. Lo stelo si allunga, le foglie aumentano,
     poi un bocciolo, poi un fiore grande. Anche il corpo festeggia un poco. */
  function fase(f, chiave) {
    const e = Object.assign({}, EMO[chiave || 'felice']);
    const alt = [0, 14, 28, 40][f];
    const base = 'translate(100 186) scale(.74) translate(-100 -186)';
    const posa = `translate(100 186) scale(${f === 3 ? .98 : 1} ${f === 3 ? 1.03 : 1}) translate(-100 -186)`;
    let a = '';
    const top = 62 - 32 - alt;
    const dorme = chiave === 'assonnato';
    a += stelo(`M100 62V${top}`);
    /* foglie lungo lo stelo: 2, 4, 6 */
    const coppie = [1, 2, 3, 3][f];
    for (let i = 0; i < coppie; i++) {
      const y = 62 - 14 - i * 14 - (i ? 0 : 0), s = 1 + i * .12;
      a += foglia(100, y, 200 - i * 6, s * .9, F1) + foglia(100, y, -20 + i * 6, s * .9, F2);
    }
    if (f === 2 || (f === 3 && dorme)) a += `<ellipse cx="100" cy="${top - 8}" rx="13" ry="17" fill="#ff8fb1"/><path d="M88 ${top}Q100 ${top - 14} 112 ${top}Q106 ${top + 6} 100 ${top + 4}Q94 ${top + 6} 88 ${top}Z" fill="${F1}"/>`;
    if (f === 3 && !dorme) a += `<circle cx="100" cy="${top - 12}" r="40" fill="#ffd166" opacity=".18"/>` +
      [0, 60, 120, 180, 240, 300].map(r => `<ellipse cx="100" cy="${top - 30}" rx="11" ry="17" fill="#ffb020" transform="rotate(${r} 100 ${top - 12})"/>`).join('') + `<circle cx="100" cy="${top - 12}" r="11" fill="#ff7a59"/>`;
    if (f < 3 || dorme) { if (f === 0 || f === 1) a += ''; }
    const ex = Object.assign({}, e, f >= 2 ? { lucidi: 1 } : {});
    return `<svg viewBox="0 0 200 200" role="img" aria-label="Germo, fase ${f + 1}"><ellipse cx="100" cy="190" rx="44" ry="6" fill="#000" opacity=".11"/><g transform="${base}"><g transform="${posa}">` +
      `<ellipse cx="80" cy="186" rx="15" ry="8.5" fill="${ARTO}"/><ellipse cx="120" cy="186" rx="15" ry="8.5" fill="${ARTO}"/>` + a +
      braccio(ex.braccia[0], -1) + braccio(ex.braccia[1], 1) + corpo() + viso(ex) + `</g></g></svg>`;
  }

  window.GERMO3 = { disegna, fase, EMO };
})();
