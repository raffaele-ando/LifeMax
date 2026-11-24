/* CONCETTI NUOVI. Non più «una macchia con due puntini»: ogni personaggio nasce da
   un'idea (come il fantasma di Phantom) e ha una sagoma che è già un racconto.
   Limiti: 3–4 forme, 3 colori piatti, niente contorni, sfumature, braccia o accessori.
   Le emozioni: deformazione, inclinazione, occhi e un elemento espressivo proprio. */
(function () {
  const IND = '#5b4cf0', INK = '#1b1640', CALDO = '#ffb020', CARTA = '#f4f1ff';

  /* ---------- occhi: non solo puntini ---------- */
  function occhio(tipo, x, y, r, col) {
    col = col || INK; r = r || 7;
    switch (tipo) {
      case 'punto': return `<ellipse cx="${x}" cy="${y}" rx="${r * .8}" ry="${r}" fill="${col}"/>`;
      case 'gioia': return `<path d="M${x - r} ${y + r * .4}Q${x} ${y - r * 1.2} ${x + r} ${y + r * .4}" fill="none" stroke="${col}" stroke-width="${r * .6}" stroke-linecap="round"/>`;
      case 'chiuso': return `<path d="M${x - r} ${y}Q${x} ${y + r} ${x + r} ${y}" fill="none" stroke="${col}" stroke-width="${r * .6}" stroke-linecap="round"/>`;
      case 'fuoco': return `<rect x="${x - r}" y="${y - r * .35}" width="${r * 2}" height="${r * .7}" rx="${r * .35}" fill="${col}"/>`;
      case 'mezzo': return `<path d="M${x - r * .85} ${y}A${r * .85} ${r * .8} 0 0 0 ${x + r * .85} ${y}Z" fill="${col}"/>`;
      case 'grande': return `<ellipse cx="${x}" cy="${y}" rx="${r * 1.05}" ry="${r * 1.3}" fill="${col}"/>`;
    }
    return '';
  }

  /* ============ A · COMETA ============
     La coda è la serie di giorni: si allunga con la costanza e non si spezza mai,
     al massimo si accorcia. Testa tonda, coda che si muove come un'emozione. */
  function cometa(e) {
    /* la coda: un ventaglio che parte dalla nuca. a = angolo, L = lunghezza, w = apertura, curva = piega */
    const P = {
      calma:   { a: 200, L: 70, w: 26, curva: 10,  incl: 0,   occ: 'punto', g: [3, 0] },
      gioia:   { a: 235, L: 92, w: 34, curva: -18, incl: -14, occ: 'gioia', g: [0, 0], su: 14 },
      fuoco:   { a: 188, L: 96, w: 14, curva: 0,   incl: 6,   occ: 'fuoco', g: [6, 3] },
      capisce: { a: 150, L: 64, w: 30, curva: 24,  incl: 10,  occ: 'grande', g: [-3, 4] },
      curioso: { a: 215, L: 58, w: 22, curva: -30, incl: -10, occ: 'grande', g: [9, -5] },
      fiero:   { a: 205, L: 104, w: 30, curva: -8, incl: -6,  occ: 'gioia', g: [0, -2] },
      dorme:   { a: 120, L: 48, w: 30, curva: 40,  incl: 16,  occ: 'chiuso', g: [0, 2] },
      affetto: { a: 200, L: 60, w: 30, curva: 10,  incl: 0,   occ: 'gioia', g: [0, 1], cuore: 1 }
    }[e];
    const cx = 132, cy = 104, r = 38, rad = d => d * Math.PI / 180;
    const ux = Math.cos(rad(P.a)), uy = Math.sin(rad(P.a)), px = -uy, py = ux;
    const b1 = [cx + px * r * .92, cy + py * r * .92], b2 = [cx - px * r * .92, cy - py * r * .92];
    const tip = [cx + ux * (r + P.L) + px * P.curva, cy + uy * (r + P.L) + py * P.curva];
    const m1 = [cx + ux * (r + P.L * .5) + px * (P.w + P.curva * .6), cy + uy * (r + P.L * .5) + py * (P.w + P.curva * .6)];
    const m2 = [cx + ux * (r + P.L * .5) - px * (P.w - P.curva * .6), cy + uy * (r + P.L * .5) - py * (P.w - P.curva * .6)];
    const f = v => v.map(n => n.toFixed(1)).join(' ');
    const coda = P.cuore
      ? `<path d="M${f(b1)}Q${f(m1)} ${f(tip)}Q${f(m2)} ${f(b2)}Z" fill="${CALDO}"/><path d="M58 86c-4-8-16-5-16 3.5 0 7 16 14 16 14s16-7 16-14c0-8.5-12-11.5-16-3.5z" fill="${CALDO}"/>`
      : `<path d="M${f(b1)}Q${f(m1)} ${f(tip)}Q${f(m2)} ${f(b2)}Z" fill="${CALDO}"/>`;
    const t = `translate(100 ${100 - (P.su || 0)}) rotate(${P.incl}) translate(-100 -100)`;
    return `<g transform="${t}">${coda}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${IND}"/>` +
      occhio(P.occ, 122 + P.g[0], 102 + P.g[1], 7.5, CARTA) + occhio(P.occ, 146 + P.g[0], 102 + P.g[1], 7.5, CARTA) + `</g>`;
  }

  /* ============ B · SEGNALIBRO ============
     Un nastro di stoffa: la tacca a V in fondo diventa due gambette. Tiene il segno,
     così puoi sempre riprendere da dove eri. La piega in alto è la sua testa che si inclina. */
  function segnalibro(e) {
    const P = {
      calma:   { piega: 0,   sx: 1,    sy: 1,    incl: 0,  occ: 'punto', g: [2, 0] },
      gioia:   { piega: -16, sx: .92,  sy: 1.1,  incl: 0,  occ: 'gioia', g: [0, 0], su: 16, gambe: 1 },
      fuoco:   { piega: 6,   sx: 1.04, sy: .96,  incl: 4,  occ: 'fuoco', g: [3, 6] },
      capisce: { piega: 24,  sx: 1,    sy: .96,  incl: 6,  occ: 'grande', g: [-2, 4] },
      curioso: { piega: -10, sx: .98,  sy: 1.03, incl: -10, occ: 'grande', g: [6, -4] },
      fiero:   { piega: -24, sx: .95,  sy: 1.07, incl: -4, occ: 'gioia', g: [0, -2] },
      dorme:   { piega: 40,  sx: 1.06, sy: .9,   incl: 8,  occ: 'chiuso', g: [0, 2] },
      affetto: { piega: 14,  sx: 1.02, sy: .98,  incl: 0,  occ: 'gioia', g: [0, 1], cuore: 1 }
    }[e];
    const su = P.su || 0;
    const t = `translate(100 ${172 - su}) rotate(${P.incl}) scale(${P.sx} ${P.sy}) translate(-100 -172)`;
    const gamba = P.gambe ? 'M70 60H130V164L108 150L100 172L92 150L70 164Z' : 'M70 60H130V172L100 148L70 172Z';
    const piega = `<g transform="rotate(${P.piega} 100 60)"><path d="M70 60H130V44Q130 32 118 32H82Q70 32 70 44Z" fill="${IND}"/><path d="M70 60H130V54H70Z" fill="${INK}" opacity=".18"/></g>`;
    return `<g transform="${t}">${piega}<path d="${gamba}" fill="${IND}"/>` +
      occhio(P.occ, 87 + P.g[0], 92 + P.g[1], 7.5, CARTA) + occhio(P.occ, 113 + P.g[0], 92 + P.g[1], 7.5, CARTA) +
      (P.cuore ? `<path d="M100 128c-3-6-12-4-12 2.5 0 5.5 12 11 12 11s12-5.5 12-11c0-6.5-9-8.5-12-2.5z" fill="${CALDO}"/>` : '') + `</g>`;
  }

  /* ============ C · AQUILONE ============
     Sale quando ti concentri, scende piano quando sei stanco. La coda a riccioli
     è l'emozione; il corpo a rombo è una sagoma che nessun'altra app ha. */
  function aquilone(e) {
    const P = {
      calma:   { incl: 0,   su: 0,  occ: 'punto', g: [2, 0],  coda: 'M100 150C92 160 108 168 100 178C92 188 106 194 102 200' },
      gioia:   { incl: -14, su: 18, occ: 'gioia', g: [0, 0],  coda: 'M100 150C78 156 118 170 92 180C70 188 104 198 84 204' },
      fuoco:   { incl: 0,   su: 8,  occ: 'fuoco', g: [3, 5],  coda: 'M100 150V200' },
      capisce: { incl: 10,  su: 0,  occ: 'grande', g: [-2, 4], coda: 'M100 150C110 162 124 160 128 172C132 184 120 190 112 186' },
      curioso: { incl: -12, su: 4,  occ: 'grande', g: [6, -4], coda: 'M100 150C104 170 82 170 86 184C90 196 104 194 106 186' },
      fiero:   { incl: 0,   su: 12, occ: 'gioia', g: [0, -2], coda: 'M100 150C84 160 116 172 100 182C84 192 116 200 100 208' },
      dorme:   { incl: 24,  su: -6, occ: 'chiuso', g: [0, 2], coda: 'M100 150C106 160 96 168 104 176' },
      affetto: { incl: 0,   su: 0,  occ: 'gioia', g: [0, 1],  coda: 'M100 150C88 160 112 168 100 176' }
    }[e];
    const t = `translate(100 ${96 - P.su}) rotate(${P.incl}) translate(-100 -96)`;
    return `<g transform="${t}"><path d="${P.coda}" fill="none" stroke="${CALDO}" stroke-width="6" stroke-linecap="round"/>` +
      (e === 'affetto' ? `<path d="M100 178c-3-6-12-4-12 2.5 0 5.5 12 11 12 11s12-5.5 12-11c0-6.5-9-8.5-12-2.5z" fill="${CALDO}"/>` : '') +
      `<path d="M100 30L146 92L100 152L54 92Z" fill="${IND}" stroke="${IND}" stroke-width="10" stroke-linejoin="round"/>` +
      `<path d="M100 30L146 92L100 92Z" fill="#fff" opacity=".12"/>` +
      occhio(P.occ, 88 + P.g[0], 96 + P.g[1], 7.5, CARTA) + occhio(P.occ, 112 + P.g[0], 96 + P.g[1], 7.5, CARTA) + `</g>`;
  }

  /* ============ D · LUNA ============
     Una falce con un solo grande occhio, come una palpebra del cielo. È calma per
     natura: perfetta per un'app che vuole togliere ansia. L'occhio unico (come Koji)
     fa tutto il lavoro: si chiude, si apre, guarda. */
  function luna(e) {
    const P = {
      calma:   { incl: 0,   occ: 'punto', g: [0, 0],  su: 0, sx: 1 },
      gioia:   { incl: -16, occ: 'gioia', g: [0, -2], su: 14, sx: .94 },
      fuoco:   { incl: 6,   occ: 'fuoco', g: [3, 4],  su: 0, sx: 1.02 },
      capisce: { incl: 14,  occ: 'grande', g: [-3, 3], su: 0, sx: 1 },
      curioso: { incl: -12, occ: 'grande', g: [5, -4], su: 4, sx: .98 },
      fiero:   { incl: -8,  occ: 'gioia', g: [0, -2], su: 6, sx: .96 },
      dorme:   { incl: 22,  occ: 'chiuso', g: [0, 2], su: 0, sx: 1.04 },
      affetto: { incl: 4,   occ: 'gioia', g: [0, 1],  su: 0, sx: 1, cuore: 1 }
    }[e];
    const t = `translate(100 ${100 - P.su}) rotate(${P.incl}) scale(${P.sx} ${2 - P.sx}) translate(-100 -100)`;
    return `<g transform="${t}"><path d="M128 34A70 70 0 1 0 128 166A56 56 0 0 1 128 34Z" fill="${IND}"/>` +
      occhio(P.occ, 52 + P.g[0], 100 + P.g[1], 10, CARTA) +
      (P.cuore ? `<path d="M138 64c-3-6-12-4-12 2.5 0 5.5 12 11 12 11s12-5.5 12-11c0-6.5-9-8.5-12-2.5z" fill="${CALDO}"/>` : '') + `</g>`;
  }

  /* ============ E · BARCHETTA ============
     Una barchetta di carta: un viaggio alla volta. La vela si gonfia di gioia,
     si affloscia quando sei stanco; lo scafo è il viso. */
  function barchetta(e) {
    const P = {
      calma:   { vela: 'M104 40L104 110L148 110Z', incl: 0,   occ: 'punto', g: [2, 0] },
      gioia:   { vela: 'M104 24C140 40 160 80 150 110L104 110Z', incl: -8, occ: 'gioia', g: [0, 0], su: 10 },
      fuoco:   { vela: 'M104 34L104 110L152 110Z', incl: 3,   occ: 'fuoco', g: [3, 3] },
      capisce: { vela: 'M104 50C116 70 120 92 114 110L104 110Z', incl: 8, occ: 'grande', g: [-2, 2] },
      curioso: { vela: 'M104 36C130 46 140 72 136 110L104 110Z', incl: -10, occ: 'grande', g: [6, -3] },
      fiero:   { vela: 'M104 22L104 110L160 110Z', incl: -4, occ: 'gioia', g: [0, -2] },
      dorme:   { vela: 'M104 74C112 86 120 98 124 110L104 110Z', incl: 10, occ: 'chiuso', g: [0, 2] },
      affetto: { vela: 'M104 56C96 40 74 46 80 62C86 78 104 88 104 88C104 88 122 78 128 62C134 46 112 40 104 56Z', incl: 0, occ: 'gioia', g: [0, 1] }
    }[e];
    const su = P.su || 0;
    const t = `translate(100 ${150 - su}) rotate(${P.incl}) translate(-100 -150)`;
    return `<g transform="${t}"><path d="${P.vela}" fill="${CALDO}"/>` +
      `<path d="M34 112H166L144 156Q140 162 132 162H68Q60 162 56 156Z" fill="${IND}"/>` +
      occhio(P.occ, 86 + P.g[0], 134 + P.g[1], 7.5, CARTA) + occhio(P.occ, 114 + P.g[0], 134 + P.g[1], 7.5, CARTA) + `</g>`;
  }

  const CONCETTI = [
    { id: 'cometa', nome: 'Cometa', idea: 'La coda è la tua serie di giorni: si allunga con la costanza e non si spezza mai.', f: cometa },
    { id: 'segnalibro', nome: 'Segno', idea: 'Un nastro segnalibro: la tacca diventa due gambe. Tiene il segno, così riparti da dove eri.', f: segnalibro },
    { id: 'aquilone', nome: 'Aquilone', idea: 'Sale quando ti concentri. La coda a riccioli è il suo umore.', f: aquilone },
    { id: 'luna', nome: 'Luna', idea: 'Una falce con un solo grande occhio: calma per natura, toglie ansia.', f: luna },
    { id: 'barchetta', nome: 'Barchetta', idea: 'Un viaggio alla volta. La vela si gonfia di gioia e si affloscia quando sei stanco.', f: barchetta }
  ];
  const EMO = [['calma', 'Calma'], ['gioia', 'Gioia'], ['fuoco', 'Concentrato'], ['capisce', 'Ti capisce'], ['curioso', 'Curioso'], ['fiero', 'Fiero'], ['dorme', 'Dorme'], ['affetto', 'Affetto']];
  function disegna(id, e, viewBox) {
    const c = CONCETTI.find(x => x.id === id);
    return `<svg viewBox="${viewBox || '0 0 200 210'}" role="img" aria-label="${c.nome}: ${e}">${c.f(e)}</svg>`;
  }
  window.CONCETTI = { CONCETTI, EMO, disegna };
})();
