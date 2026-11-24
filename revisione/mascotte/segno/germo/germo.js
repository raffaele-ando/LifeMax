/* GERMO — un seme che cresce con te. Tenero, testardo, ottimista.
   Tutto in un viewBox 0 0 200 200; il personaggio è rimpicciolito attorno alla
   base per lasciare un margine di sicurezza (germoglio, cuori, z dentro la cella).
   Il suo tic: il germoglio si piega verso di te quando ti saluta. */
(function () {
  const INK = '#1d1747', CORPO = '#6a5cf5', BORDO = '#4f41d8', PANCIA = '#c9c4ff', VERDE = '#2fbf86', VERDE2 = '#4fd9a0', STELO = '#1f9e6c';
  let N = 0;

  /* ogni emozione è un insieme di scelte coerenti: sguardo, bocca, postura, gesto, germoglio */
  const EMO = {
    felice:      { n: 'Felice', occhi: 'aperti', pup: [1, 1], bocca: 'sorriso', guance: .55, sx: 1, sy: 1, su: 0, incl: 0, sx_: null, braccia: ['riposo', 'saluto'], germo: 'saluta' },
    gioia:       { n: 'Gioia', occhi: 'archi', bocca: 'risata', guance: .8, sx: .95, sy: 1.07, su: 16, incl: 0, braccia: ['alto', 'alto'], germo: 'dritto', festa: 1 },
    concentrato: { n: 'Concentrato', occhi: 'aperti', pup: [5, 6], brow: 'dritte', bocca: 'lingua', guance: .35, sx: 1.02, sy: .98, su: 0, incl: 5, braccia: ['tiene', 'tiene'], germo: 'attento', oggetto: 'compito' },
    fiero:       { n: 'Fiero', occhi: 'archi', bocca: 'sorrisoChiuso', guance: .65, sx: .98, sy: 1.06, su: 0, incl: 0, braccia: ['fianchi', 'fianchi'], germo: 'dritto', stella: 1 },
    incoraggia:  { n: 'Ce la fai', occhi: 'occhiolino', pup: [1, 0], bocca: 'sorrisoAperto', guance: .65, sx: 1, sy: 1.02, su: 0, incl: -4, braccia: ['riposo', 'pollice'], germo: 'saluta' },
    capisce:     { n: 'Ti capisce', occhi: 'dolci', brow: 'gentili', bocca: 'sorrisoDolce', guance: .6, sx: 1, sy: 1, su: 0, incl: 10, braccia: ['riposo', 'cuore'], germo: 'piegato' },
    sorpreso:    { n: 'Sorpreso', occhi: 'aperti', pup: [0, -1], pupPiccola: 1, brow: 'alte', bocca: 'o', guance: .3, sx: .97, sy: 1.05, su: 5, incl: 0, braccia: ['guance', 'guance'], germo: 'dritto' },
    assonnato:   { n: 'Assonnato', occhi: 'chiusi', bocca: 'sbadiglio', guance: .35, sx: 1.05, sy: .95, su: 0, incl: -3, braccia: ['riposo', 'riposo'], germo: 'giu', zz: 1 },
    abbraccio:   { n: 'Abbraccio', occhi: 'archi', bocca: 'sorriso', guance: .85, sx: 1.02, sy: .98, su: 0, incl: 0, braccia: ['avanti', 'avanti'], germo: 'saluta', cuore: 1 }
  };

  /* ---------- viso: grande e basso, lo schema del cucciolo ---------- */
  const OX = 22, OY = 120, RX = 16, RY = 19;   /* occhi: distanza dal centro, altezza, raggi */
  function occhio(e, x, lato) {
    const y = OY;
    if (e.occhi === 'archi' || (e.occhi === 'occhiolino' && lato > 0))
      return `<path d="M${x - 12} ${y + 4}Q${x} ${y - 11} ${x + 12} ${y + 4}" fill="none" stroke="${INK}" stroke-width="5.4" stroke-linecap="round"/>`;
    if (e.occhi === 'chiusi')
      return `<path d="M${x - 12} ${y}Q${x} ${y + 10} ${x + 12} ${y}" fill="none" stroke="${INK}" stroke-width="5.4" stroke-linecap="round"/>`;
    if (e.occhi === 'dolci') /* socchiusi e morbidi: archi bassi, un filo di pupilla */
      return `<path d="M${x - 12} ${y + 1}Q${x} ${y + 9} ${x + 12} ${y + 1}" fill="none" stroke="${INK}" stroke-width="5.4" stroke-linecap="round"/>`;
    const id = 'g' + (++N), [px, py] = e.pup || [0, 0], pr = e.pupPiccola ? 7 : RX * .72;
    return `<clipPath id="${id}"><ellipse cx="${x}" cy="${y}" rx="${RX}" ry="${RY}"/></clipPath>` +
      `<ellipse cx="${x}" cy="${y}" rx="${RX}" ry="${RY}" fill="#fff"/>` +
      `<g clip-path="url(#${id})"><circle cx="${x + px}" cy="${y + py + 1.5}" r="${pr}" fill="${INK}"/>` +
      `<circle cx="${x + px - 3.6}" cy="${y + py - 4}" r="${e.pupPiccola ? 2.4 : 4.2}" fill="#fff"/>` +
      `<circle cx="${x + px + 3.8}" cy="${y + py + 4.6}" r="${e.pupPiccola ? 1.2 : 2}" fill="#fff"/></g>`;
  }
  function sopracciglia(e) {
    if (!e.brow) return '';
    const y = OY - RY - 9;
    const tratto = (x, lato) => {
      if (e.brow === 'dritte') return `M${x - 9} ${y + 2}H${x + 9}`;
      if (e.brow === 'alte') return `M${x - 9} ${y - 4}Q${x} ${y - 11} ${x + 9} ${y - 4}`;
      /* gentili: la parte interna appena alzata, mai giù al centro */
      const xi = x - lato * 9, xe = x + lato * 9;
      return `M${xi} ${y - 3}Q${x} ${y - 4} ${xe} ${y + 1}`;
    };
    return `<path d="${tratto(100 - OX, -1)} ${tratto(100 + OX, 1)}" fill="none" stroke="${INK}" stroke-width="4.4" stroke-linecap="round"/>`;
  }
  function bocca(e) {
    const x = 100, y = OY + 25;
    switch (e.bocca) {
      case 'sorriso': return `<path d="M${x - 11} ${y}Q${x} ${y + 11} ${x + 11} ${y}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
      case 'sorrisoChiuso': return `<path d="M${x - 15} ${y - 2}Q${x} ${y + 13} ${x + 15} ${y - 2}" fill="none" stroke="${INK}" stroke-width="5.2" stroke-linecap="round"/>`;
      case 'sorrisoDolce': return `<path d="M${x - 9} ${y + 1}Q${x} ${y + 8} ${x + 9} ${y + 1}" fill="none" stroke="${INK}" stroke-width="4.6" stroke-linecap="round"/>`;
      case 'sorrisoAperto': return `<path d="M${x - 13} ${y - 2}Q${x} ${y + 1} ${x + 13} ${y - 2}Q${x + 11} ${y + 14} ${x} ${y + 14}Q${x - 11} ${y + 14} ${x - 13} ${y - 2}Z" fill="${INK}"/><ellipse cx="${x}" cy="${y + 10}" rx="7" ry="3.6" fill="#ff7b8a"/>`;
      case 'risata': return `<path d="M${x - 15} ${y - 3}Q${x} ${y} ${x + 15} ${y - 3}Q${x + 14} ${y + 20} ${x} ${y + 20}Q${x - 14} ${y + 20} ${x - 15} ${y - 3}Z" fill="${INK}"/><ellipse cx="${x}" cy="${y + 15}" rx="8.5" ry="5" fill="#ff7b8a"/>`;
      case 'lingua': return `<path d="M${x - 7} ${y + 2}Q${x} ${y + 5} ${x + 7} ${y + 2}" fill="none" stroke="${INK}" stroke-width="4.6" stroke-linecap="round"/><path d="M${x + 1} ${y + 4}q2 7 7 5q3-2 0-7z" fill="#ff7b8a"/>`;
      case 'o': return `<ellipse cx="${x}" cy="${y + 5}" rx="7" ry="9" fill="${INK}"/>`;
      case 'sbadiglio': return `<ellipse cx="${x}" cy="${y + 4}" rx="6.5" ry="7.5" fill="${INK}"/><ellipse cx="${x}" cy="${y + 8}" rx="3.8" ry="2.6" fill="#ff7b8a"/>`;
    }
    return '';
  }
  function viso(e) {
    const g = `<ellipse cx="${100 - 40}" cy="${OY + 18}" rx="10" ry="6" fill="#ff7aa0" opacity="${e.guance}"/><ellipse cx="${100 + 40}" cy="${OY + 18}" rx="10" ry="6" fill="#ff7aa0" opacity="${e.guance}"/>`;
    return g + sopracciglia(e) + occhio(e, 100 - OX, -1) + occhio(e, 100 + OX, 1) + bocca(e);
  }

  /* ---------- le mani: muffole che si allargano in fondo, con un accenno di pollice ---------- */
  function muffola(x, y, r, ang, pollice) {
    const a = ang * Math.PI / 180;
    const tx = x + Math.cos(a + 1.1) * r * .85, ty = y - Math.sin(a + 1.1) * r * .85;
    return `<circle cx="${x}" cy="${y}" r="${r + 2.2}" fill="${BORDO}"/>` +
      (pollice ? `<ellipse cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" rx="5.2" ry="7.5" fill="${BORDO}" transform="rotate(${-ang} ${tx.toFixed(1)} ${ty.toFixed(1)})"/><ellipse cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" rx="3.4" ry="5.6" fill="${CORPO}" transform="rotate(${-ang} ${tx.toFixed(1)} ${ty.toFixed(1)})"/>` : '') +
      `<circle cx="${x}" cy="${y}" r="${r}" fill="${CORPO}"/>`;
  }
  function arto(x0, y0, x1, y1) {
    return `<path d="M${x0} ${y0}L${x1} ${y1}" stroke="${BORDO}" stroke-width="18" stroke-linecap="round"/>` +
      `<path d="M${x0} ${y0}L${x1} ${y1}" stroke="${CORPO}" stroke-width="13.6" stroke-linecap="round"/>`;
  }
  /* le pose: dove va la mano rispetto alla spalla (lato sinistro; il destro è specchiato) */
  function braccio(posa, lato) {
    const sx = 100 + lato * 52, sy = 148;
    const m = (dx, dy, pol) => { const x = sx + lato * dx, y = sy + dy; return arto(sx, sy, x, y) + muffola(x, y, 10.5, lato > 0 ? 60 : 120, pol); };
    switch (posa) {
      case 'riposo': return m(10, 16);
      case 'saluto': return m(22, -38);
      case 'alto': return m(20, -48);
      case 'tiene': return m(-14, 10);
      case 'fianchi': return m(12, 4);
      case 'pollice': return m(24, -24, true);
      case 'cuore': return lato > 0 ? arto(sx, sy, sx - 26, sy + 10) + muffola(sx - 26, sy + 10, 10.5, 90) + '<path d="M125 152c-2-3.5-7.5-2.5-7.5 1.5 0 3.5 7.5 7.5 7.5 7.5s7.5-4 7.5-7.5c0-4-5.5-5-7.5-1.5z" fill="#ff5c8a"/>' : m(10, 16);
      case 'guance': return m(-2, -6);
      case 'avanti': return arto(sx, sy, sx - lato * 18, sy + 18) + muffola(sx - lato * 18, sy + 18, 13, 90);
    }
    return '';
  }

  /* ---------- il germoglio: la sua antenna emotiva ---------- */
  function germoglio(stato) {
    const foglie = (x, y, a, s) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s || 1})">` +
      `<path d="M0 0C-7 -13 -22 -14 -27 -6C-20 4 -8 5 0 0Z" fill="${VERDE}"/><path d="M0 0C8 -12 22 -12 26 -4C19 5 7 5 0 0Z" fill="${VERDE2}"/>` +
      `<path d="M2 -1C8 -5 15 -7 20 -6" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".45"/></g>`;
    switch (stato) {
      case 'dritto': return `<path d="M100 66C100 52 100 42 100 30" fill="none" stroke="${STELO}" stroke-width="6" stroke-linecap="round"/>` + foglie(100, 32, 0, 1.05);
      case 'saluta': return `<path d="M100 66C100 52 106 42 116 36" fill="none" stroke="${STELO}" stroke-width="6" stroke-linecap="round"/>` + foglie(116, 37, 32);
      case 'attento': return `<path d="M100 66C100 54 102 46 106 40" fill="none" stroke="${STELO}" stroke-width="6" stroke-linecap="round"/>` + foglie(106, 41, 12, .9);
      case 'piegato': return `<path d="M100 66C100 54 108 46 118 46" fill="none" stroke="${STELO}" stroke-width="6" stroke-linecap="round"/>` + foglie(118, 47, 70, .9);
      case 'giu': return `<path d="M100 66C100 52 112 46 120 54" fill="none" stroke="${STELO}" stroke-width="6" stroke-linecap="round"/>` + foglie(120, 55, 120, .85);
    }
    return '';
  }

  const CORPO_D = 'M100 62C143 62 166 98 166 134C166 168 140 186 100 186C60 186 34 168 34 134C34 98 57 62 100 62Z';
  const PANCIA_D = 'M100 150C124 150 138 160 138 172C138 184 124 190 100 190C76 190 62 184 62 172C62 160 76 150 100 150Z';

  function disegna(chiave, opz) {
    opz = opz || {};
    const e = EMO[chiave], id = 'gb' + (++N);
    /* scala .82 attorno alla base: resta un margine per germoglio, cuori e z */
    const base = `translate(100 186) scale(.82) translate(-100 -186)`;
    const posa = `translate(100 ${186 - e.su}) rotate(${e.incl}) scale(${e.sx} ${e.sy}) translate(-100 -186)`;
    const ombra = `<ellipse cx="100" cy="190" rx="${(50 * (e.su > 8 ? .66 : 1)).toFixed(1)}" ry="6" fill="#000" opacity="${e.su > 8 ? .07 : .11}"/>`;
    const piedi = `<ellipse cx="80" cy="186" rx="16" ry="9" fill="${BORDO}"/><ellipse cx="120" cy="186" rx="16" ry="9" fill="${BORDO}"/>`;
    const dietro = ['avanti'].includes(e.braccia[0]) ? '' : '';
    const corpo = `<clipPath id="${id}"><path d="${CORPO_D}"/></clipPath><path d="${CORPO_D}" fill="${CORPO}"/>` +
      `<g clip-path="url(#${id})"><path d="${PANCIA_D}" fill="${PANCIA}" opacity=".55"/>` +
      `<path d="M150 96C162 116 164 140 156 160" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".18"/></g>`;
    const oggetto = e.oggetto === 'compito'
      ? `<g transform="translate(100 168) rotate(-6)"><rect x="-22" y="-16" width="44" height="30" rx="7" fill="#fff" stroke="${BORDO}" stroke-width="2"/><path d="M-13 -5l5 5 9-10" fill="none" stroke="${VERDE}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 -4h10M5 4h10M-13 7h12" stroke="#c9c4ff" stroke-width="3" stroke-linecap="round"/></g>` : '';
    const festa = e.festa ? '<path d="M40 60l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#ffb020"/><path d="M160 56l2.4 6 6 2.4-6 2.4-2.4 6-2.4-6-6-2.4 6-2.4z" fill="#ff7aa0"/><rect x="152" y="104" width="10" height="5" rx="2" fill="#2fbf86" transform="rotate(30 157 106)"/><rect x="34" y="110" width="10" height="5" rx="2" fill="#4cc3ff" transform="rotate(-25 39 112)"/>' : '';
    const stella = e.stella ? '<path d="M152 58l4 9 10 1-7.5 6.5 2.5 10-9-5.5-9 5.5 2.5-10-7.5-6.5 10-1z" fill="#ffb020"/>' : '';
    const cuore = e.cuore ? '<path d="M152 54c-4-7-15-5-15 3 0 7 15 15 15 15s15-8 15-15c0-8-11-10-15-3z" fill="#ff5c8a"/>' : '';
    const zz = e.zz ? `<path d="M140 52h10l-10 11h10M156 38h7l-7 8h7" fill="none" stroke="#9a90ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` : '';
    const [bs, bd] = e.braccia;
    const tieneMani = e.braccia[0] === 'tiene';
    return `<svg viewBox="0 0 200 200" role="img" aria-label="Germo: ${e.n}">${ombra}${festa}${stella}${cuore}${zz}` +
      `<g transform="${base}"><g transform="${posa}">${piedi}${germoglio(e.germo)}${corpo}${viso(e)}${oggetto}` +
      `${braccio(bs, -1)}${braccio(bd, 1)}</g></g></svg>`;
  }

  /* crescita: la ricompensa della costanza (mai il contrario: se salti, al massimo dorme) */
  function crescita(fase) {
    const F = ['M0 0C-7 -13 -22 -14 -27 -6C-20 4 -8 5 0 0Z', 'M0 0C8 -12 22 -12 26 -4C19 5 7 5 0 0Z'];
    let s = `<svg viewBox="0 0 200 200" role="img" aria-label="Germo, fase ${fase + 1}"><ellipse cx="100" cy="190" rx="50" ry="6" fill="#000" opacity=".11"/><g transform="translate(100 186) scale(.82) translate(-100 -186)">` +
      `<ellipse cx="80" cy="186" rx="16" ry="9" fill="${BORDO}"/><ellipse cx="120" cy="186" rx="16" ry="9" fill="${BORDO}"/>`;
    const h = [30, 22, 14, 6][fase];
    s += `<path d="M100 66V${h + 6}" stroke="${STELO}" stroke-width="6" stroke-linecap="round"/>`;
    s += `<g transform="translate(100 ${h + 8})"><path d="${F[0]}" fill="${VERDE}"/><path d="${F[1]}" fill="${VERDE2}"/></g>`;
    if (fase >= 1) s += `<g transform="translate(100 ${h + 30}) scale(.8)"><path d="${F[0]}" fill="${VERDE}"/><path d="${F[1]}" fill="${VERDE2}"/></g>`;
    if (fase === 2) s += `<ellipse cx="100" cy="${h}" rx="9" ry="12" fill="#ff8fb1"/><path d="M93 ${h + 6}Q100 ${h - 2} 107 ${h + 6}" fill="${VERDE}"/>`;
    if (fase === 3) s += [0, 72, 144, 216, 288].map(a => `<ellipse cx="100" cy="${h - 10}" rx="8" ry="12" fill="#ffb020" transform="rotate(${a} 100 ${h})"/>`).join('') + `<circle cx="100" cy="${h}" r="7" fill="#ff7a59"/>`;
    s += `<path d="${CORPO_D}" fill="${CORPO}"/>` + viso(EMO.felice) + braccio('riposo', -1) + braccio('riposo', 1) + '</g></svg>';
    return s;
  }

  window.GERMO = { disegna, crescita, EMO };
})();
