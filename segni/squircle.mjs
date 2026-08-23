/* SCRIVE IL BLOCCO DEI SUPERCERCHI in fondo ad assets/app.css.
     node segni/squircle.mjs

   Perché generato e non scritto a mano: i selettori con un angolo sono 180 e
   cambiano ogni volta che si tocca il CSS. Il blocco si rifà da zero leggendo
   i due fogli di stile, e prove/squircle.js lo rigenera e si ferma se non
   combacia — così non può restare indietro.

   COME FUNZIONA, in breve. Un ritaglio può solo TOGLIERE, e la superellisse è
   più PIENA dell'arco di cerchio: quindi non basta ritagliare un box che ha
   già `border-radius`. Si azzera il raggio, si ritaglia la curva, e il bordo
   — che seguiva gli spigoli e verrebbe tagliato proprio sulla curva — si
   ridisegna come anello su uno pseudo-elemento. Vedi segni/anello.mjs.

   Quello che si perde: l'ombra ESTERNA, perché qualsiasi ritaglio la cancella
   (misurato). In quest'app costa poco: la separazione la fanno i bordi da
   1px, e con le ombre spente la schermata è quasi identica. */

import fs from 'fs';
import path from 'path';
import { tracciatiPer, passiPer } from './prova-tracciato.mjs';

const QUI = path.dirname(new URL(import.meta.url).pathname);
const RADICE = path.join(QUI, '..');
const INIZIO = '/* ==== SUPERCERCHI: GENERATO da segni/squircle.mjs — non a mano ==== */';

/* --- lettura grezza: selettore + corpo, in ordine, @media compresi --- */
function regole(file) {
  /* Il blocco generato si taglia PRIMA di leggere. Senza questo il generatore
     si avvelena col proprio output: le regole dell'anello contengono
     `X::before`, e alla passata dopo ogni selettore risultava «::before già
     occupato» — l'anello si spostava su ::after e il file cambiava a ogni
     rigenerazione senza che nulla fosse cambiato. */
  let src = fs.readFileSync(path.join(RADICE, file), 'utf8');
  const tagl = src.indexOf(INIZIO);
  if (tagl >= 0) src = src.slice(0, tagl);
  const out = [];
  let i = 0;
  while (i < src.length) {
    const apre = src.indexOf('{', i); if (apre < 0) break;
    let testa = src.slice(i, apre).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[}\s]+/, '').trim();
    if (/^@/.test(testa)) { i = apre + 1; continue; }
    let liv = 1, j = apre + 1;
    while (j < src.length && liv > 0) { if (src[j] === '{') liv++; else if (src[j] === '}') liv--; j++; }
    out.push({ testa, corpo: src.slice(apre + 1, j - 1) });
    i = j;
  }
  return out;
}

/* Le pastiglie NON sono un'eccezione: `min(R, 50%)` su un raggio da 99px
   diventa esattamente il 50%, cioè una capsula — ma con le estremità a
   superellisse invece che a semicerchio. Era stata lasciata fuori per scelta
   mia; la richiesta era «ogni cosa», e ogni cosa vuol dire anche queste. */
const pastiglia = () => false;
const raggioPastiglia = (v) => /--r-tondo|(^|\s)50%|9{2,}px/.test(v);
const selettori = (testa) => testa.split(',').map((t) => t.trim())
  .filter((t) => /^[.#a-z:[*]/i.test(t) && !/::(before|after|first-line|marker|placeholder|selection)/.test(t));

export function genera() {
  const R = [...regole('assets/app.css'), ...regole('assets/lab.css')];

  /* chi tocca `position`: a quelli non si aggiunge `position: relative`,
     perché sovrascriverebbe un `absolute` dichiarato da un'altra parte */
  const posiziona = new Set();
  /* chi usa già ::before: l'anello gli va su ::after */
  const beforeOccupato = new Set();
  R.forEach(({ testa, corpo }) => {
    testa.split(',').map((t) => t.trim()).forEach((t) => {
      if (/::before/.test(t)) beforeOccupato.add(t.replace(/::before.*/, '').trim());
    });
    if (/(^|[;\s])position\s*:/.test(corpo)) selettori(testa).forEach((s) => posiziona.add(s));
  });

  /* --- raggi d'angolo e colori di bordo, in ordine di sorgente --- */
  const raggi = [];      /* [selettore, valore] */
  const bordi = [];      /* [selettore, colore] */
  const spessori = [];   /* [selettore, px] */
  R.forEach(({ testa, corpo }) => {
    const sel = selettori(testa);
    if (!sel.length) return;
    [...corpo.matchAll(/border-radius\s*:\s*([^;}]+)/g)].forEach((m) => {
      const v = m[1].trim();
      if (v === '0') return;
      sel.forEach((s) => raggi.push([s, v]));
    });
    /* Il colore del bordo, e solo da una dichiarazione che vale per TUTTI E
       QUATTRO i lati. Un `border-left: 3px solid` è una fascetta d'accento,
       non un bordo: se l'anello prendesse il colore da là, disegnerebbe una
       cornice intera dove ce n'era una striscia sola. Quelle restano al
       proprio posto — il ritaglio le smussa negli angoli, che è giusto. */
    [...corpo.matchAll(/(?:^|[;\s])border-color\s*:\s*([^;}]+)/g)]
      .forEach((m) => sel.forEach((s) => bordi.push([s, m[1].trim()])));
    [...corpo.matchAll(/(?:^|[;\s])border\s*:\s*([^;}]+)/g)].forEach((m) => {
      const v = m[1].trim();
      if (/^(0|none)$/.test(v)) { sel.forEach((s) => bordi.push([s, 'transparent'])); return; }
      const c = /(?:solid|dashed|dotted)\s+(.+)$/.exec(v);
      if (c) sel.forEach((s) => bordi.push([s, c[1].trim()]));
      /* lo SPESSORE, che non è sempre un pixel: se l'anello ne disegnasse uno
         dove il bordo è di due, il bordo si assottiglierebbe proprio
         nell'angolo — che è esattamente il difetto da cui siamo partiti,
         solo più piccolo. */
      const w = /^([0-9.]+)px/.exec(v);
      if (w) sel.forEach((s) => spessori.push([s, parseFloat(w[1])]));
    });
    [...corpo.matchAll(/(?:^|[;\s])border-width\s*:\s*([0-9.]+)px/g)]
      .forEach((m) => sel.forEach((s) => spessori.push([s, parseFloat(m[1])])));
  });

  /* --- un raggio può avere fino a quattro valori --- */
  function quattro(v) {
    const p = v.split(/\s+(?![^(]*\))/).filter(Boolean);
    if (p.length === 1) return [p[0], p[0], p[0], p[0]];
    if (p.length === 2) return [p[0], p[1], p[0], p[1]];
    if (p.length === 3) return [p[0], p[1], p[2], p[1]];
    return [p[0], p[1], p[2], p[3]];
  }

  /* --- si raggruppa per valore, tenendo l'ordine di sorgente --- */
  /* l'ultimo spessore dichiarato per quel selettore, uno se non lo dice */
  const spessore = new Map();
  spessori.forEach(([s, w]) => spessore.set(s, w));
  const gruppi = new Map();
  raggi.forEach(([s, v]) => {
    /* la chiave è raggio + spessore: sono le due cose che cambiano il
       tracciato */
    const k = v + '|' + (spessore.get(s) || 1);
    if (!gruppi.has(k)) gruppi.set(k, []);
    if (!gruppi.get(k).includes(s)) gruppi.get(k).push(s);
  });
  const gruppiBordo = new Map();
  bordi.forEach(([s, c]) => {
    if (!gruppiBordo.has(c)) gruppiBordo.set(c, []);
    if (!gruppiBordo.get(c).includes(s)) gruppiBordo.get(c).push(s);
  });

  const tokens = {};
  const rootBlocco = fs.readFileSync(path.join(RADICE, 'assets/app.css'), 'utf8');
  [...rootBlocco.matchAll(/--(r-\d|raggio|raggio-s|r-tondo)\s*:\s*([0-9.]+)px/g)].forEach((m) => {
    if (tokens['--' + m[1]] === undefined) tokens['--' + m[1]] = parseFloat(m[2]);
  });
  const numero = (v) => {
    const t = /^var\(\s*(--[a-z0-9-]+)\s*\)$/.exec(v.trim());
    if (t) return tokens[t[1]];
    if (v.trim() === '0') return 0;          /* un angolo vivo: raggio zero */
    /* una pastiglia: `min(R, 50%)` la limita da sé alla metà del lato */
    if (raggioPastiglia(v)) return 9999;
    const n = /^([0-9.]+)px$/.exec(v.trim());
    return n ? parseFloat(n[1]) : null;
  };

  /* solo chi prende davvero il ritaglio: le pastiglie restano col raggio (il
     perché sta più sotto, dove si generano i tracciati) e non vogliono né
     l'anello né il `position: relative` */
  const pastiglia = (v) => {
    const q = quattro(v).map(numero);
    return q.every((x) => x !== null && isFinite(x)) && Math.max.apply(null, q) >= 50;
  };
  const conAngolo = new Set(raggi.filter(([, v]) => !pastiglia(v)).map(([s]) => s));
  const anelloBefore = [...conAngolo].filter((s) => !beforeOccupato.has(s));
  const anelloAfter = [...conAngolo].filter((s) => beforeOccupato.has(s));

  /* --- il testo --- */
  const righe = (lista) => {
    const out = []; let r = '';
    lista.forEach((x, i) => {
      const pezzo = x + (i < lista.length - 1 ? ',' : '');
      if ((r + ' ' + pezzo).length > 78) { out.push(r); r = pezzo; } else r = (r ? r + ' ' : '') + pezzo;
    });
    if (r) out.push(r);
    return out.map((x) => '  ' + x).join('\n');
  };
  /* un raggio scritto come `var(--r-2)` non si può moltiplicare a mano: si
     legge il valore che quella variabile ha davvero, dal foglio di stile */
  let css = '\n\n' + INIZIO + '\n';
  css += [
    '/* La curva: |u|^n + |v|^n = 1 con n = 4, cioè il supercerchio — non un',
    '   incrocio fra un rettangolo e un cerchio, una curva sua. L\'arco di cerchio',
    '   del border-radius è il caso n = 2, e si vede: la curvatura salta da zero a',
    '   1/r di colpo nel punto dove l\'arco comincia.',
    '   Un ritaglio può solo TOGLIERE, e la superellisse è più PIENA dell\'arco:',
    '   quindi il raggio si azzera e la forma la fa il ritaglio. Ma allora il bordo,',
    '   che seguiva gli spigoli, verrebbe tagliato proprio sulla curva — e resta una',
    '   scheda col bordo sui lati e senza negli angoli. Quindi il bordo si',
    '   ridisegna: un anello cavo su uno pseudo-elemento, con la regola di',
    '   riempimento evenodd.',
    '   I numeri sono dentro il tracciato e non in variabili: var() dentro una',
    '   proprietà personalizzata si sostituisce DOVE LA PROPRIETÀ È DICHIARATA, non',
    '   dove viene usata — su :root il raggio valeva zero e il poligono nasceva',
    '   già azzerato. È testo ripetitivo e si comprime quasi a niente.',
    '   Quello che si perde è l\'ombra ESTERNA: qualsiasi ritaglio la cancella. Qui',
    '   costa poco, la separazione la fanno i bordi da 1px.',
    '   Rigenerare: node segni/squircle.mjs */',
    ''
  ].join('\n');
  /* le variabili non servono più: il tracciato ha i numeri dentro. Resta solo
     il posizionamento, che serve all'anello. */
  css += '\n/* --- LA FORMA: raggio azzerato, curva dal ritaglio; e il bordo\n' +
    '       ridisegnato come anello sullo pseudo-elemento --- */\n';
  const senzaMisura = [];
  const pastiglie = [];
  for (const [chiave, sel] of gruppi) {
    const v = chiave.split('|')[0], sp = parseFloat(chiave.split('|')[1]);
    const q = quattro(v).map(numero);
    if (q.some((x) => x === null || !isFinite(x))) { senzaMisura.push(v); continue; }
    /* LE PASTIGLIE RESTANO PASTIGLIE, e non è una resa: è che il CSS non sa
       dire «metà del lato CORTO». In un poligono le percentuali si risolvono
       per asse — 50% in una x è metà della larghezza, in una y metà
       dell'altezza — mentre `border-radius` quando taglia il raggio lo taglia
       con lo STESSO fattore su tutti e due. Su una pastiglia da 300×40 il
       nostro min(99px, 50%) darebbe 99px in orizzontale e 20 in verticale:
       non un supercerchio, una foglia. E una pastiglia non è un rettangolo
       con gli angoli arrotondati: i suoi fianchi sono tangenti a due
       semicerchi interi, è una forma sua. Resta col raggio. */
    if (Math.max.apply(null, q) >= 50) { pastiglie.push(sel); continue; }
    const t = tracciatiPer(q, sp, 4, passiPer(q));
    const beforeQui = sel.filter((x) => !beforeOccupato.has(x));
    const afterQui = sel.filter((x) => beforeOccupato.has(x));
    css += righe(sel) + ' {\n    border-radius: 0;\n    clip-path: ' + t.pieno + ';\n  }\n';
    const pseudo = [...beforeQui.map((x) => x + '::before'), ...afterQui.map((x) => x + '::after')];
    css += righe(pseudo) + ' {\n' +
      "    content: ''; position: absolute; inset: " + (-sp) + 'px; pointer-events: none;\n' +
      '    background: var(--sq-b); clip-path: ' + t.anello + ';\n  }\n';
  }
  if (senzaMisura.length) console.log('  raggi non misurabili, lasciati come sono: ' + senzaMisura.join(' | '));
  /* Alle pastiglie il supercerchio glielo può dare solo il browser, che il
     raggio lo taglia con lo stesso fattore sui due assi. Dove c'è
     `corner-shape` lo fa; dove non c'è restano due semicerchi tangenti ai
     fianchi, che è comunque una forma sua e non un rettangolo arrotondato. */
  const tuttePastiglie = [...new Set(pastiglie.flat())];
  if (tuttePastiglie.length) {
    css += '\n/* --- le pastiglie: il raggio resta, e il supercerchio lo mette\n' +
      '       il browser dove sa farlo (il ritaglio no: in un poligono le\n' +
      "       percentuali si risolvono per asse e non si può dire «metà del lato\n" +
      '       corto», così su una pastiglia larga verrebbe una foglia) --- */\n';
    css += '@supports (corner-shape: squircle) {\n  ' +
      righe(tuttePastiglie).replace(/\n/g, '\n  ') + ' {\n    corner-shape: squircle;\n  }\n}\n';
    console.log('  pastiglie lasciate col raggio: ' + tuttePastiglie.length + ' selettori');
  }

  const daPosizionare = [...conAngolo].filter((s) => !posiziona.has(s));
  css += "\n/* --- l'anello ha bisogno di un riquadro di riferimento. Non si tocca\n" +
    "       chi già dichiara `position`: là sovrascriverebbe un `absolute`. --- */\n";
  css += righe(daPosizionare) + ' {\n    position: relative;\n  }\n';

  css += "\n/* --- il colore dell'anello, dov'era il colore del bordo --- */\n";
  css += '*, *::before, *::after { --sq-b: transparent; }\n';
  for (const [c, sel] of gruppiBordo) {
    const s2 = sel.filter((x) => conAngolo.has(x));
    if (!s2.length) continue;
    css += righe(s2) + ' {\n    --sq-b: ' + c + ';\n  }\n';
  }

  return { css, gruppi: gruppi.size, selettori: conAngolo.size, bordi: gruppiBordo.size };
}

/* Il tracciato sta in segni/prova-tracciato.mjs: lo usa anche prove/squircle.js,
   che deve poter misurare la curva senza far scrivere niente a nessuno. Il
   fatto CSS che ha deciso la forma di questo codice: `var()` dentro una
   proprietà personalizzata si sostituisce DOVE LA PROPRIETÀ È DICHIARATA, non
   dove viene usata. Con il tracciato in una variabile su :root il raggio
   valeva zero e il poligono nasceva già azzerato — il ritaglio veniva un
   rettangolo a spigoli. Quindi i numeri stanno dentro, un tracciato per
   raggio: è testo ripetitivo e si comprime quasi a niente. */

if (import.meta.url === 'file://' + process.argv[1]) {
  const g = genera();
  const p = path.join(RADICE, 'assets/app.css');
  let s = fs.readFileSync(p, 'utf8');
  const i = s.indexOf(INIZIO);
  if (i >= 0) s = s.slice(0, i).replace(/\s+$/, '');
  fs.writeFileSync(p, s + g.css);
  console.log('  ' + g.selettori + ' selettori con un angolo, ' + g.gruppi + ' raggi diversi, ' +
    g.bordi + ' colori di bordo');
  console.log('  aggiunti ' + (g.css.length / 1024).toFixed(1) + ' kB ad assets/app.css');
}
