/* SCRIVE IL BLOCCO DEI SUPERCERCHI in fondo ad assets/app.css.
     node segni/squircle.mjs

   Perché generato e non scritto a mano: i selettori con un angolo sono quasi
   centocinquanta e cambiano ogni volta che si tocca il CSS. Il blocco si rifà
   da zero leggendo i due fogli di stile, e prove/squircle.js lo rigenera e si
   ferma se non combacia — così non può restare indietro.

   LA CURVA è quella continua di Apple: tre Bézier per angolo, le costanti
   stanno in segni/apple.mjs. Non è una superellisse, e la differenza si vede.
   La prima versione di questo file usava |u|⁴+|v|⁴=1 e il risultato era che
   TUTTA l'app sembrava più spigolosa di prima: una superellisse a parità di
   raggio toglie all'angolo il 66% di area in meno di un arco di cerchio.
   L'angolo di Apple invece ne toglie l'1.05, quindi si legge arrotondato
   quanto prima — solo senza lo scalino di curvatura all'attacco col lato.

   COME. Un ritaglio può solo TOGLIERE, quindi il raggio si azzera e la forma
   la fa il `clip-path`. Ma allora il bordo del box, che seguiva gli spigoli,
   viene tagliato proprio sulla curva: resta una scheda col bordo sui fianchi e
   niente negli angoli. Quindi il bordo si ridisegna come anello cavo su uno
   pseudo-elemento, con riempimento evenodd.

   Due fatti CSS che hanno deciso la forma di questo codice:

   1. `var()` dentro una proprietà personalizzata si sostituisce DOVE LA
      PROPRIETÀ È DICHIARATA, non dove viene usata. Un tracciato scritto su
      :root con `var(--r-2)` dentro nasceva già azzerato. Per questo i
      tracciati su :root hanno i NUMERI dentro, non variabili — e allora sì
      che si possono tenere in un posto solo invece di ripeterli per ogni
      gruppo di selettori: da 190 kB a una decina.

   2. `*::before` colpisce DIRETTAMENTE lo pseudo-elemento, e una regola che
      colpisce direttamente batte sempre l'eredità. La riga
      `*, *::before, *::after { --sq-b: transparent }` di una versione
      precedente azzerava il colore dell'anello su OGNI elemento dell'app: il
      bordo non veniva ridisegnato da nessuna parte, e restava rotto negli
      angoli. Adesso l'asterisco è solo sugli elementi, così l'anello eredita
      dal suo. */

import fs from 'fs';
import path from 'path';
import * as A from './apple.mjs';

const QUI = path.dirname(new URL(import.meta.url).pathname);
const RADICE = path.join(QUI, '..');
const INIZIO = '/* ==== SUPERCERCHI: GENERATO da segni/squircle.mjs — non a mano ==== */';

/* La prova che il motore sa fare quello che serve. Se la risposta è no, tutto
   il blocco non si applica e resta il `border-radius`: un rettangolo
   arrotondato, come prima. Senza questa rete un motore che rifiuta il ritaglio
   si teneva il `border-radius: 0` e mostrava SPIGOLI VIVI — peggio di non aver
   fatto niente. */
/* Quanto può scostarsi la spezzata dalla curva vera. Un quinto di pixel non
   si vede nemmeno a schermo triplo, e i punti in meno si sentono sul peso del
   foglio di stile. */
const TOLLERANZA = 0.2;
const SUPPORTO = '@supports (clip-path: polygon(min(1px, 50%) 0px, ' +
  'calc(100% - min(1px, 50%)) 0px, 100% 100%))';

/* MISURATI IN PAGINA, non indovinati: l'angolo di Apple si mangia 1.528665
   raggi lungo ogni lato, quindi vuole un lato di almeno 3.06 raggi. Questi
   elementi sono più corti di così e i due angoli si scontrerebbero, con una
   strozzatura in mezzo al lato. Il raggio è quello più grande che ci sta.
   Per rifare la misura: prove/squircle.js, sezione «ci sta l'angolo». */
const TROPPO_PICCOLI = {
  'select.sc-inline': 10,
  '.btn-mini': 11,
  '.gio-so-corpo': 11,
  '.segmenti.sez-nav': 17,
  '.tl-blk-check': 7,
  '.manico': 7,
  'kbd': 7,
  '.tl-blk-pasto': 7
};

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

  /* --- raggi d'angolo, colori e spessori di bordo, in ordine di sorgente --- */
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

  const tokens = {};
  const rootBlocco = fs.readFileSync(path.join(RADICE, 'assets/app.css'), 'utf8');
  [...rootBlocco.matchAll(/--(r-\d|raggio|raggio-s|r-tondo)\s*:\s*([0-9.]+)px/g)].forEach((m) => {
    if (tokens['--' + m[1]] === undefined) tokens['--' + m[1]] = parseFloat(m[2]);
  });
  const numero = (v) => {
    const t = /^var\(\s*(--[a-z0-9-]+)\s*\)$/.exec(v.trim());
    if (t) return tokens[t[1]];
    if (v.trim() === '0') return 0;          /* un angolo vivo: raggio zero */
    if (raggioPastiglia(v)) return 9999;     /* una capsula */
    const n = /^([0-9.]+)px$/.exec(v.trim());
    return n ? parseFloat(n[1]) : null;
  };

  /* Le PASTIGLIE restano capsule, e non è un'eccezione alla forma di Apple: è
     la forma di Apple. Nel loro sistema una pastiglia è una `Capsule`, con le
     estremità a semicerchio, non un supercerchio schiacciato. E in CSS non si
     potrebbe fare comunque: in un poligono le percentuali si risolvono per
     asse, quindi non si può dire «metà del lato corto», e su una pastiglia da
     300×40 il ritaglio darebbe una foglia con la punta da 99px. */
  const capsula = (v) => {
    const q = quattro(v).map(numero);
    return q.every((x) => x !== null && isFinite(x)) && Math.max.apply(null, q) >= 50;
  };
  const conAngolo = new Set(raggi.filter(([, v]) => !capsula(v)).map(([s]) => s));

  /* il raggio da usare davvero: quello dichiarato, o quello ridotto perché
     l'elemento è troppo corto per contenere l'angolo */
  const raggioVero = (s, q) => {
    const lim = TROPPO_PICCOLI[s];
    return lim === undefined ? q : q.map((x) => Math.min(x, lim));
  };

  /* chi ha davvero un bordo su tutti e quattro i lati: solo a loro serve
     l'anello */
  const conBordo = new Set(bordi.filter(([, c]) => c !== 'transparent' && c !== 'none').map(([s]) => s));

  /* --- il testo --- */
  const righe = (lista, rientro) => {
    const sp = ' '.repeat(rientro || 2);
    const out = []; let r = '';
    lista.forEach((x, i) => {
      const pezzo = x + (i < lista.length - 1 ? ',' : '');
      if ((r + ' ' + pezzo).length > 78) { out.push(r); r = pezzo; } else r = (r ? r + ' ' : '') + pezzo;
    });
    if (r) out.push(r);
    return out.map((x) => sp + x).join('\n');
  };

  /* --- i tracciati, in un posto solo su :root --- */
  const nomi = new Map();          /* chiave → { pieno, anello, nome } */
  const senzaMisura = [];
  const capsule = [];
  const perGruppo = [];            /* [selettori, nome, spessore] */

  const spessore = new Map();
  spessori.forEach(([s, w]) => spessore.set(s, w));

  /* si raggruppa per (raggio effettivo + spessore), tenendo l'ordine */
  const gruppi = new Map();
  raggi.forEach(([s, v]) => {
    if (capsula(v)) { capsule.push(s); return; }
    const q0 = quattro(v).map(numero);
    if (q0.some((x) => x === null || !isFinite(x))) { senzaMisura.push(v); return; }
    const q = raggioVero(s, q0);
    const sp = spessore.get(s) || 1;
    const k = q.join('/') + '|' + sp;
    if (!gruppi.has(k)) gruppi.set(k, []);
    if (!gruppi.get(k).includes(s)) gruppi.get(k).push(s);
  });

  let n = 0;
  for (const [k, sel] of gruppi) {
    const q = k.split('|')[0].split('/').map(Number);
    const sp = parseFloat(k.split('|')[1]);
    n++;
    const nome = '--sq-' + n;
    /* L'anello si genera SEMPRE. Sembrava un'ottimizzazione darlo solo a chi
       ha un bordo nella stessa regola del raggio, e invece è un buco: `.tl-blk`
       dichiara il raggio e `.tl-blk-att`, un'altra classe sullo stesso
       elemento, dichiara il bordo. Il gruppo del raggio non lo sapeva e quegli
       elementi restavano senza bordo negli angoli. Quando `--sq-b` è
       trasparente — il caso normale — l'anello non dipinge niente, quindi
       darlo a tutti non costa nulla a schermo. */
    const serve = true;
    nomi.set(nome, { pieno: A.poligono(q, TOLLERANZA), anello: serve ? A.anello(q, sp, TOLLERANZA) : null });
    perGruppo.push([sel, nome, sp, serve]);
  }

  let css = '\n\n' + INIZIO + '\n';
  css += [
    "/* La curva è quella CONTINUA DI APPLE: tre Bézier per angolo, costanti in",
    '   segni/apple.mjs, ricavate leggendo UIBezierPath. Non è una superellisse —',
    '   chi ha provato a sostituirla con la migliore (n = 5.2) ha misurato 1365',
    '   pixel di errore contro zero. E non è un arco di cerchio: l\'arco tiene la',
    '   curvatura costante a 1/r e nel punto in cui incontra il lato salta a zero,',
    '   e quello scalino l\'occhio lo vede. Qui i due punti di controllo della prima',
    '   Bézier stanno SUL lato insieme al punto di partenza: tre punti allineati',
    '   vogliono dire curvatura zero all\'attacco.',
    '   L\'angolo si mangia 1.528665 raggi lungo ogni lato — una volta e mezza — e',
    '   toglie 1.05 volte l\'area di un arco allo stesso raggio: per questo i raggi',
    '   restano quelli di prima e l\'app non sembra più spigolosa.',
    '   Il raggio si azzera perché un ritaglio può solo togliere. Il bordo, che',
    '   seguiva gli spigoli e verrebbe tagliato proprio sulla curva, si ridisegna',
    '   come anello cavo sullo pseudo-elemento, spesso quanto il bordo vero.',
    '   Rigenerare: node segni/squircle.mjs */',
    ''
  ].join('\n');

  css += '\n/* --- i tracciati. Stanno qui e non dentro ogni regola perché non\n' +
    '       contengono nessuna var(): una proprietà personalizzata sostituisce\n' +
    '       le var() DOVE È DICHIARATA, e su :root i raggi non esistono. Con i\n' +
    '       numeri dentro invece si possono tenere in un posto solo. --- */\n';
  css += ':root {\n';
  for (const [nome, t] of nomi) {
    css += '  ' + nome + '-p: ' + t.pieno + ';\n';
    if (t.anello) css += '  ' + nome + '-a: ' + t.anello + ';\n';
  }
  css += '}\n';

  css += '\n' + SUPPORTO + ' {\n';
  css += '\n  /* --- LA FORMA, e il bordo ridisegnato --- */\n';
  for (const [sel, nome, sp, serve] of perGruppo) {
    css += righe(sel, 2) + ' {\n    border-radius: 0;\n    clip-path: var(' + nome + '-p);\n  }\n';
    if (!serve) continue;
    const beforeQui = sel.filter((x) => !beforeOccupato.has(x));
    const afterQui = sel.filter((x) => beforeOccupato.has(x));
    const pseudo = [...beforeQui.map((x) => x + '::before'), ...afterQui.map((x) => x + '::after')];
    css += righe(pseudo, 2) + ' {\n' +
      "    content: ''; position: absolute; inset: " + (-sp) + 'px; pointer-events: none;\n' +
      '    background: var(--sq-b); clip-path: var(' + nome + '-a);\n  }\n';
  }

  const daPosizionare = [...conAngolo].filter((s) => !posiziona.has(s));
  css += "\n  /* --- l'anello ha bisogno di un riquadro di riferimento. Non si\n" +
    '         tocca chi già dichiara `position`: là sovrascriverebbe un\n' +
    '         `absolute` dichiarato da un\'altra parte. --- */\n';
  css += righe(daPosizionare, 2) + ' {\n    position: relative;\n  }\n';

  css += "\n  /* --- il colore dell'anello, dov'era il colore del bordo.\n" +
    "         L'asterisco è solo sugli ELEMENTI: `*::before` colpirebbe\n" +
    '         direttamente l\'anello, e una regola che colpisce direttamente\n' +
    "         batte l'eredità — così il bordo non si vedeva da nessuna parte. --- */\n";
  css += '  * { --sq-b: transparent; }\n';
  /* IN ORDINE DI SORGENTE, non raggruppati per colore. Raggruppando si perde
     la cascata: `.btn` dichiara un bordo grigio e `.btn-ok`, più sotto, lo
     mette trasparente. Con i gruppi per colore il trasparente finiva PRIMA del
     grigio (era il primo colore incontrato nel foglio) e allora vinceva il
     grigio — cioè comparivano bordi su pulsanti disegnati senza. Le regole
     hanno la stessa specificità, quindi conta solo chi viene dopo: l'ordine va
     tenuto quello del foglio. */
  const inOrdine = [];
  bordi.forEach(([s, c]) => {
    /* NON si filtra su «ha un raggio»: `.btn` dichiara il raggio e il bordo,
       `.btn-ok` dichiara solo `border-color: transparent`. Filtrando, quel
       trasparente veniva buttato e sui pulsanti pieni ricompariva il bordo
       grigio di `.btn`. Mettere `--sq-b` su un elemento senza forma non fa
       niente: l'anello là non esiste. */
    const ultimo = inOrdine[inOrdine.length - 1];
    if (ultimo && ultimo.c === c) { if (!ultimo.sel.includes(s)) ultimo.sel.push(s); }
    else inOrdine.push({ c, sel: [s] });
  });
  let colori = 0;
  for (const { c, sel } of inOrdine) {
    colori++;
    css += righe(sel, 2) + ' {\n    --sq-b: ' + c + ';\n  }\n';
  }

  /* IL BORDO DEL BOX SI SPEGNE, e non è un dettaglio.
     Il bordo di quest'app è quasi sempre traslucido — `rgba(16,17,22,0.08)` e
     compagni. Lasciandolo accendere, sui lati dritti veniva dipinto DUE volte
     (una il box, una l'anello sopra) e sulla curva una sola, perché là il
     ritaglio quello del box se lo mangia. Risultato: fianchi scuri e angoli
     chiari, con uno stacco netto nel punto in cui la curva comincia. Adesso il
     colore lo mette solo l'anello, uguale tutt'intorno. Lo SPESSORE resta,
     perché serve al calcolo dello spazio. */
  const daSpegnere = [];
  bordi.forEach(([s2]) => { if (!daSpegnere.includes(s2)) daSpegnere.push(s2); });
  if (daSpegnere.length) {
    css += "\n  /* --- il colore del bordo del box si spegne: lo dipinge l'anello,\n" +
      '         una volta sola e uguale su tutto il contorno --- */\n';
    css += righe(daSpegnere, 2) + ' {\n    border-color: transparent;\n  }\n';
  }
  css += '}\n';

  if (senzaMisura.length) console.log('  raggi non misurabili, lasciati come sono: ' + senzaMisura.join(' | '));
  console.log('  capsule lasciate col raggio (è la forma giusta): ' + new Set(capsule).size + ' selettori');

  return { css, gruppi: gruppi.size, selettori: conAngolo.size, bordi: colori };
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const g = genera();
  const p = path.join(RADICE, 'assets/app.css');
  let s = fs.readFileSync(p, 'utf8');
  const i = s.indexOf(INIZIO);
  if (i >= 0) s = s.slice(0, i).replace(/\s+$/, '');
  fs.writeFileSync(p, s + g.css);
  console.log('  ' + g.selettori + ' selettori con un angolo, ' + g.gruppi + ' tracciati, ' +
    g.bordi + ' colori di bordo');
  console.log('  aggiunti ' + (g.css.length / 1024).toFixed(1) + ' kB ad assets/app.css');
}
