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
/* Quanto può scostarsi la spezzata dalla curva vera. Un quinto di pixel
   sembrava invisibile, e su un BORDO da un pixel non lo è: lo scarto del
   contorno esterno e quello dell'interno si sommano sullo spessore, e il filo
   veniva fuori ondulato, come disegnato a mano. Un ventesimo di pixel non si
   vede nemmeno guardando l'angolo ingrandito dieci volte.
   Adesso i due contorni sono campionati NEGLI STESSI PUNTI, quindi lo spessore
   resta uniforme (0.98–1.00) a qualunque tolleranza: questo numero decide solo
   quanto è liscio il contorno in sé, e un decimo di pixel basta. */
const TOLLERANZA = 0.1;
const SUPPORTO = '@supports (clip-path: polygon(min(1px, 50%) 0px, ' +
  'calc(100% - min(1px, 50%)) 0px, 100% 100%))';

/* QUANTO È GRANDE UNA COSA non si vede dal foglio di stile: quasi tutto prende
   l'altezza dal contenuto. E bisogna saperlo, perché l'angolo di Apple si
   mangia 1.528665 raggi lungo ogni lato e quindi vuole un lato di almeno 3.057
   raggi. Sotto quella misura il ritaglio non fa un angolo più piccolo: le
   percentuali di un poligono si risolvono PER ASSE, quindi su una barretta
   alta nove pixel con un raggio da otto la curva si schiaccia solo in
   verticale e l'estremità viene a punta, come una foglia.

   Qui c'era una tabella di otto selettori «troppo piccoli», scritta a mano.
   Ne mancavano trentanove e tre numeri erano sbagliati — `.segmenti.sez-nav`
   aveva 17 dove ci stava 13.7. Adesso le misure le prende segni/misure.mjs
   aprendo l'app, e questo file le legge. Chi non c'è resta come l'ha scritto
   il foglio di stile, e il generatore lo dice.

   Nello stesso file c'è anche «angolo»: se quel selettore colpisce mai un
   elemento che ha ANCHE la forma. Serve per spegnere il colore del bordo del
   box, e dal nome non si può sapere: `.tl-blk` dichiara l'angolo e
   `.tl-blk-pasto`, un'altra classe sullo stesso elemento, dichiara il bordo. */
const MISURE = (() => {
  try { return JSON.parse(fs.readFileSync(path.join(RADICE, 'segni/misure.json'), 'utf8')); }
  catch (e) { return {}; }
})();
const latoCorto = (s2) => {
  const m = MISURE[s2];
  return m && m.corto >= 1 ? m.corto : null;
};
/* il raggio più grande che ci sta in quel lato: quello il cui angolo si mangia
   esattamente mezzo lato, cioè il caso limite dell'icona di iOS */
const raggioMax = (s2) => {
  const c = latoCorto(s2);
  /* a scalini di mezzo pixel, sempre per difetto. Un raggio esatto per ogni
     selettore vuol dire un tracciato per ogni selettore, e i tracciati sono la
     roba grossa del foglio di stile: con gli scalini i gruppi si rimettono
     insieme e il foglio pesa un terzo in meno. Mezzo pixel di raggio in meno
     sposta il contorno di mezzo pixel, sempre verso l'interno: ci sta. */
  if (c === null) return null;
  const r = c / (2 * A.INIZIO);
  /* sotto i quattro pixel a scalini di un decimo: là mezzo pixel di raggio è
     un quarto dell'angolo, e su una barretta alta sei pixel si vede che le
     estremità sono meno tonde di quanto potrebbero. I tracciati piccoli sono
     anche i più corti da scrivere, quindi i gruppi in più non costano. */
  const scalino = r < 4 ? 10 : 2;
  return Math.floor(r * scalino) / scalino;
};

/* UN CAMPO DI FORM NON PUÒ AVERE LA FORMA, e non basta accorgersene dal nome
   del selettore: `.sel-area-azione` e `.tl-dur` sono `select` e non lo dicono.
   A uno era sparito il bordo (glielo abbiamo spento aspettandoci un anello che
   lì non può esistere) e all'altro il ritaglio lo tagliava proprio
   sull'angolo. Questa coda lo chiede all'ELEMENTO.
   Vale anche un punto di specificità, e serve: il blocco generato sta in fondo
   ad app.css, ma lab.css si carica DOPO e i suoi `border: 1px solid` a pari
   specificità vincevano, riaccendendo il bordo del box sopra l'anello — sei
   elementi del Design lab col bordo doppio sui fianchi. */
const NON_CAMPO = ':not(input,select,textarea,progress,meter)';

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

/* I CONTROLLI DI FORM NON POSSONO AVERE L'ANELLO.
   `input`, `select` e `textarea` non generano pseudo-elementi: il browser non
   crea la scatola di `::before`/`::after` su di loro. Provato — su un `div` il
   colore di prova si vede, su tutti e tre no. Quindi il bordo lì lo può
   dipingere solo il box, e se glielo spegniamo per ridisegnarlo con l'anello
   il campo resta senza bordo del tutto: è quello che era successo a ogni campo
   di testo dell'app.
   Restano col loro `border-radius`, cioè un arco di cerchio. È l'unica forma
   che il CSS sa dare a un campo senza togliergli il bordo: un ritaglio
   taglierebbe il bordo del box proprio sulla curva, e non c'è nessuno che
   possa ridisegnarlo là dentro. */
const formControl = (s2) => /(^|[\s>+~])(input|select|textarea|progress|meter)\b/.test(s2);

const raggioPastiglia = (v) => /--r-tondo|(^|\s)50%|9{2,}px/.test(v);
const selettori = (testa) => testa.split(',').map((t) => t.trim())
  .filter((t) => /^[.#a-z:[*]/i.test(t) && !/::(before|after|first-line|marker|placeholder|selection)/.test(t));

/* LO SCANDAGLIO dei due fogli di stile: chi ha un angolo, chi ha un bordo,
   chi taglia, chi si posiziona. Sta in una funzione a sé perché lo usa anche
   segni/misure.mjs: la lista di cosa misurare e la lista di cosa disegnare
   devono venire dalla stessa lettura, se no si misura una cosa e si disegna
   un'altra. (È già successo: le misure ferme a ventuno schermate e il
   generatore a venticinque.) */
function scandaglia() {
  const R = [...regole('assets/app.css'), ...regole('assets/lab.css')];

  /* chi tocca `position`: a quelli non si aggiunge `position: relative`,
     perché sovrascriverebbe un `absolute` dichiarato da un'altra parte */
  const posiziona = new Set();
  /* chi usa già ::before: l'anello gli va su ::after */
  const beforeOccupato = new Set();
  /* selettore → hidden | auto | scroll | clip */
  const taglia = new Map();
  R.forEach(({ testa, corpo }) => {
    testa.split(',').map((t) => t.trim()).forEach((t) => {
      if (/::before/.test(t)) beforeOccupato.add(t.replace(/::before.*/, '').trim());
    });
    if (/(^|[;\s])position\s*:/.test(corpo)) selettori(testa).forEach((s) => posiziona.add(s));
    /* CHI TAGLIA. `overflow` non visibile taglia al riquadro INTERNO, e
       l'anello del bordo sta nell'area del bordo, cioè fuori: veniva via tutto
       e quegli elementi restavano senza bordo. Si vedeva sulla scheda di
       «Adesso», dove restava solo il filo colorato dell'area, tagliato. */
    const ov = /(^|[;\s])overflow(-x|-y)?\s*:\s*(hidden|auto|scroll|clip)/.exec(corpo);
    if (ov) selettori(testa).forEach((s) => taglia.set(s, ov[3]));
  });

  /* --- raggi d'angolo, colori e spessori di bordo, in ordine di sorgente --- */
  const raggi = [];      /* [selettore, valore] */
  const bordi = [];      /* [selettore, colore] */
  const spessori = [];   /* [selettore, px] */
  const lati = [];       /* [selettore, lato, colore]: le fascette d'accento */
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
    /* LE FASCETTE D'ACCENTO, un lato solo. `.tl-blk-att` ha un filo da 1px su
       tutti i lati e una fascia da 3px a sinistra col colore dell'area;
       `.diag-stato` la stessa cosa col colore dello stato. Spegnendo
       `border-color` per far dipingere l'anello si spegneva anche quella, e
       l'accento spariva: va rimesso lato per lato, dopo. */
    [...corpo.matchAll(/(?:^|[;\s])border-(left|right|top|bottom)\s*:\s*[0-9.]+px\s+(?:solid|dashed|dotted)\s+([^;}]+)/g)]
      .forEach((m) => sel.forEach((s) => lati.push([s, m[1], m[2].trim()])));
    [...corpo.matchAll(/(?:^|[;\s])border-(left|right|top|bottom)-color\s*:\s*([^;}]+)/g)]
      .forEach((m) => sel.forEach((s) => lati.push([s, m[1], m[2].trim()])));
  });

  return { R, posiziona, beforeOccupato, taglia, raggi, bordi, spessori, lati };
}

/* quello che segni/misure.mjs deve andare a misurare in pagina */
export function daMisurare() {
  const { raggi, bordi } = scandaglia();
  /* i selettori che avranno la forma: i campi di form no, quelli restano col
     loro raggio */
  const forma = [...new Set(raggi.filter(([s]) => !formControl(s)).map(([s]) => s))];
  return { raggi: forma, forma, bordi: [...new Set(bordi.map(([s]) => s))] };
}

export function genera() {
  const { R, posiziona, beforeOccupato, taglia, raggi, bordi, spessori, lati } = scandaglia();

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
  const eraPastiglia = (v) => {
    const q = quattro(v).map(numero);
    return q.every((x) => x !== null && isFinite(x)) && Math.max.apply(null, q) >= 50;
  };
  /* IL RAGGIO DI UNA PASTIGLIA. `border-radius: 99px` vuol dire «tondo quanto
     basta» e il browser lo taglia da sé a metà del lato corto. Il ritaglio no,
     quindi il raggio glielo diamo noi: lato corto MISURATO diviso 3.057, che è
     il raggio il cui angolo si mangia esattamente mezzo lato. Viene l'angolo
     pieno, lo stesso caso dell'icona di iOS — una pastiglia con le estremità a
     supercerchio invece che a semicerchio.
     Se quel selettore non è mai stato visto in pagina resta capsula: meglio un
     arco di cerchio che una foglia. */
  const capsula = (s2, v) => eraPastiglia(v) && raggioMax(s2) === null;
  const conAngolo = new Set(raggi
    .filter(([s2, v]) => !capsula(s2, v) && !formControl(s2)).map(([s]) => s));

  /* IL RAGGIO DA USARE DAVVERO: quello dichiarato, tagliato a quello che ci
     sta nel lato corto misurato. Senza questo taglio l'app aveva trentanove
     elementi con l'angolo più lungo di mezzo lato — le barrette dei grafici,
     le celle del calendario, i pulsanti piccoli, le barre di sezione — e là il
     ritaglio non fa un angolo più piccolo: schiaccia la curva su un asse solo
     e l'estremità viene a punta. */
  const stretti = [];
  const raggioVero = (s2, q) => {
    const max = raggioMax(s2);
    if (max === null) return q;
    if (Math.max.apply(null, q) > max + 0.05) stretti.push(s2 + ' ' + Math.max.apply(null, q) + '→' + max);
    return q.map((x) => Math.min(x, max));
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
      /* `r &&`: un selettore che da solo passa i 78 caratteri — con la coda
         `:not(...)` capita spesso — mandava a capo una riga ancora vuota, e nel
         foglio restavano righe di due spazi */
      if (r && (r + ' ' + pezzo).length > 78) { out.push(r); r = pezzo; } else r = (r ? r + ' ' : '') + pezzo;
    });
    if (r) out.push(r);
    return out.map((x) => sp + x).join('\n');
  };

  /* --- i tracciati, in un posto solo su :root --- */
  const nomi = new Map();          /* chiave → { pieno, anello, nome } */
  const senzaMisura = [];
  const restateCapsule = [];
  const perGruppo = [];            /* [selettori, nome, spessore] */

  const spessore = new Map();
  spessori.forEach(([s, w]) => spessore.set(s, w));

  /* si raggruppa per (raggio effettivo + spessore), tenendo l'ordine */
  const gruppi = new Map();
  const campi = [];
  raggi.forEach(([s, v]) => {
    if (formControl(s)) { if (!campi.includes(s)) campi.push(s); return; }
    let q0;
    if (eraPastiglia(v)) {
      const r = raggioMax(s);
      if (r === null) { restateCapsule.push(s); return; }
      q0 = [r, r, r, r];
    } else {
      q0 = quattro(v).map(numero);
    }
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
    /* se in questo gruppo c'è qualcuno che SCORRE, gli serve l'anello
       rientrato: quello normale glielo taglierebbe l'overflow */
    const scorre = sel.some((x) => /auto|scroll|clip/.test(taglia.get(x) || ''));
    /* IL RAGGIO CHE RESTA AL BOX, e perché non è più zero.
       Serviva a zero perché il ritaglio pieno tagliava anche il bordo del box:
       lasciargli un raggio voleva dire due angoli diversi sovrapposti. Adesso
       il ritaglio toglie solo i quattro morsi, e allora il raggio torna utile
       per una cosa che il ritaglio non sa fare: dare all'OMBRA un angolo tondo.
       L'ombra si disegna dalla sagoma del box, e con raggio zero usciva un
       rettangolo a spigoli — un alone quadrato attorno a una scheda tonda.
       Il raggio si tiene un filo sotto quello nominale (0.99) perché a 0.995
       l'arco tocca esattamente la curva di Apple sulla diagonale: misurato, il
       punto più vicino al vertice sta a 0.41225 raggi e l'arco ci arriva a
       0.41421. Sotto quel valore l'arco contiene la curva dappertutto, quindi
       la forma che si vede resta esattamente quella di Apple e l'arco lavora
       solo per l'ombra. */
    const rOmbra = q.map((x) => Math.round(x * 0.99 * 10) / 10);
    nomi.set(nome, {
      rOmbra: rOmbra.every((x) => x === rOmbra[0]) ? (rOmbra[0] + 'px')
        : rOmbra.map((x) => x + 'px').join(' '),
      /* `poligonoAngoli` e non `poligono`: il ritaglio toglie i quattro morsi
         d'angolo e lascia stare tutto il resto, così l'ombra e il contorno di
         messa a fuoco — che stanno FUORI dal riquadro del bordo — continuano a
         esistere. Col ritaglio pieno l'app non aveva più nemmeno un'ombra, in
         centoventi punti che ne dichiaravano una. (Il perché sta in
         segni/apple.mjs, sopra `poligonoAngoli`.) */
      pieno: A.poligonoAngoli(q, TOLLERANZA),
      anello: A.anello(q, sp, TOLLERANZA),
      dentro: scorre ? A.anelloDentro(q, sp, TOLLERANZA) : null
    });
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
    '   Il ritaglio toglie SOLO i quattro morsi d\'angolo: fuori dal riquadro del',
    '   bordo l\'elemento disegna ancora l\'ombra e il contorno di messa a fuoco, e',
    '   un ritaglio pieno li portava via tutti e due — l\'app non aveva più',
    '   nemmeno un\'ombra in centoventi punti che ne dichiaravano una.',
    '   Il bordo, che seguiva gli spigoli e verrebbe tagliato proprio sulla curva,',
    '   si ridisegna come anello cavo sullo pseudo-elemento, spesso quanto il',
    '   bordo vero. Il border-radius resta (99% di quello nominale) e serve solo',
    '   a dare un angolo tondo all\'ombra: la forma che si vede la decide il',
    '   ritaglio, che è più stretto dappertutto.',
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
    if (t.dentro) css += '  ' + nome + '-d: ' + t.dentro + ';\n';
  }
  css += '}\n';

  css += '\n' + SUPPORTO + ' {\n';
  css += '\n  /* --- LA FORMA, e il bordo ridisegnato --- */\n';
  /* la coda `:not(campo)` su ogni selettore della forma: tiene i campi di form
     fuori dal ritaglio (là il bordo lo può dipingere solo il box) e vale un
     punto di specificità, che serve a stare sopra lab.css */
  const coda = (x) => x + NON_CAMPO;
  const perOverflow = new Map();      /* spessore → selettori che tagliavano */
  for (const [sel, nome, sp, serve] of perGruppo) {
    css += righe(sel.map(coda), 2) + ' {\n    border-radius: ' + nomi.get(nome).rOmbra +
      ';\n    clip-path: var(' + nome + '-p);\n  }\n';
    if (!serve) continue;
    const scorre = (x) => /auto|scroll|clip/.test(taglia.get(x) || '');
    const fuori = sel.filter((x) => !scorre(x)), dentro = sel.filter(scorre);
    /* «QUESTO ::before È GIÀ DI QUALCUNO?» non si risponde confrontando il
       testo del selettore. `.nav-item.attivo::before` disegna la barretta
       dell'accento a sinistra della voce di menu accesa; il gruppo della forma
       si chiama `.nav-item`, che è un altro testo — e così l'anello del bordo
       finiva sullo STESSO pseudo-elemento della barretta, sullo stesso
       elemento, quando quella voce era accesa. Il risultato: la barretta
       prendeva il `clip-path` dell'anello e usciva a pezzi, due trattini
       invece di una riga.
       Per un anno non si è visto perché il ritaglio pieno tagliava via tutto
       quello che stava fuori dal riquadro, barretta compresa: il difetto è
       comparso il giorno in cui il ritaglio ha smesso di farlo.
       Due selettori si pestano i piedi se uno è l'altro più un pezzo attaccato
       senza spazi — `.nav-item` e `.nav-item.attivo` sono lo stesso elemento in
       due momenti. Con uno spazio in mezzo invece sono due elementi diversi. */
    const attaccato = (a, b) => a.startsWith(b) && /^[.:#[]/.test(a.slice(b.length));
    const beforePreso = (x) => [...beforeOccupato].some((o) => o === x || attaccato(o, x) || attaccato(x, o));
    const psDi = (lista) => [...lista.filter((x) => !beforePreso(x)).map((x) => coda(x) + '::before'),
      ...lista.filter((x) => beforePreso(x)).map((x) => coda(x) + '::after')];
    if (fuori.length) {
      css += righe(psDi(fuori), 2) + ' {\n' +
        "    content: ''; position: absolute; inset: " + (-sp) + 'px; pointer-events: none;\n' +
        '    background: var(--sq-b); clip-path: var(' + nome + '-a);\n  }\n';
    }
    if (dentro.length) {
      css += righe(psDi(dentro), 2) + ' {\n' +
        "    content: ''; position: absolute; inset: 0; pointer-events: none;\n" +
        '    background: var(--sq-b); clip-path: var(' + nome + '-d);\n  }\n';
    }
    /* chi tagliava con `hidden` va trattato per spessore: il margine di
       ritaglio deve valere esattamente quanto il bordo */
    sel.filter((x) => taglia.get(x) === 'hidden').forEach((x) => {
      if (!perOverflow.has(sp)) perOverflow.set(sp, []);
      if (!perOverflow.get(sp).includes(x)) perOverflow.get(sp).push(x);
    });
  }

  if (perOverflow.size) {
    css += "\n  /* --- CHI TAGLIAVA CON `overflow: hidden` passa a `clip`.\n" +
      "         `hidden` taglia al riquadro INTERNO, e l'anello del bordo sta\n" +
      "         nell'area del bordo, cioè fuori: veniva via tutto e quegli\n" +
      '         elementi restavano senza bordo — si vedeva sulla scheda di\n' +
      "         «Adesso», dov'era rimasto solo il filo colorato dell'area.\n" +
      '         Spegnere del tutto l’overflow però ridava ai figli il diritto di\n' +
      '         sporgere, e il ritaglio glielo tagliava comunque: la spunta\n' +
      "         nell'angolo di un blocco corto ne perdeva un pixel. `clip` fa\n" +
      '         quello che faceva `hidden` e in più accetta\n' +
      '         `overflow-clip-margin`: taglia un pixel più in fuori, cioè\n' +
      "         esattamente dove sta l'anello. (Con `hidden` il margine non ha\n" +
      '         nessun effetto: misurato.) --- */\n';
    for (const [sp, lista] of perOverflow) {
      css += righe(lista.map(coda), 2) + ' {\n    overflow: clip; overflow-clip-margin: ' + sp + 'px;\n  }\n';
    }
  }

  const daPosizionare = [...conAngolo].filter((s) => !posiziona.has(s));
  css += "\n  /* --- l'anello ha bisogno di un riquadro di riferimento. Non si\n" +
    '         tocca chi già dichiara `position`: là sovrascriverebbe un\n' +
    '         `absolute` dichiarato da un\'altra parte. --- */\n';
  css += righe(daPosizionare.map(coda), 2) + ' {\n    position: relative;\n  }\n';

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
  /* SOLO a chi ha davvero il ritaglio e l'anello. Spegnendolo a tutti si
     spegneva anche a chi non ha nessuno che glielo ridisegni — le capsule, e
     gli elementi con un bordo e nessun raggio: quaranta elementi dell'app
     avevano perso il bordo del tutto (il filo bianco intorno al badge, i chip,
     il pulsante dei filtri). Misurato su ventuno schermate. */
  /* Anche alle VARIANTI DI STATO. `.btn` dichiara il raggio e il bordo, e
     `.btn:hover` dichiara solo un altro colore di bordo: quello non era nella
     lista, quindi al passaggio del mouse il bordo del box si riaccendeva SOPRA
     l'anello — doppio sui fianchi, singolo sulla curva, cioè il bordo che si
     illumina in modo diverso a metà. Vale per `:hover`, `:focus`, `.attivo`,
     `[aria-checked]` e compagnia: tutto quello che è lo STESSO elemento con
     qualcosa attaccato dietro. */
  /* Chi ha l'angolo non si capisce sempre dal NOME del selettore: `.tl-blk`
     dichiara l'angolo e `.tl-blk-pasto`, un'altra classe sullo stesso
     elemento, dichiara il bordo — nessuna regola scritta sui nomi lo vede, e
     quei blocchi avevano il bordo doppio sui fianchi. Quelli li segna
     segni/misure.json, che l'ha chiesto all'elemento in pagina.
     La regola sui nomi resta e serve ancora: uno STATO come `.btn:hover` in
     pagina non si vede mai, quindi misurarlo non si può. Le due liste si
     sommano. */
  const misurati = new Set(bordi.map(([s2]) => s2)
    .filter((s2) => MISURE[s2] && MISURE[s2].angolo));
  const conForma = new Set([...conAngolo, ...misurati]);
  const variante = (s2) => {
    if (conForma.has(s2)) return true;
    for (const k of conForma) {
      if (s2.length > k.length && s2.startsWith(k) && /^[:.[]/.test(s2.slice(k.length))) return true;
    }
    return false;
  };
  const daSpegnere = [];
  bordi.forEach(([s2]) => {
    if (!variante(s2)) return;
    if (!daSpegnere.includes(s2)) daSpegnere.push(s2);
  });
  if (daSpegnere.length) {
    css += "\n  /* --- il colore del bordo del box si spegne: lo dipinge l'anello,\n" +
      '         una volta sola e uguale su tutto il contorno --- */\n';
    css += righe(daSpegnere.map(coda), 2) + ' {\n    border-color: transparent;\n  }\n';
    /* E SUBITO DOPO, LE FASCETTE D'ACCENTO. Un `border-left: 3px solid` non è
       un bordo: è una fascetta, e l'anello non la sa disegnare (disegnerebbe
       una cornice intera dove ce n'era una striscia sola). Spegnendo
       `border-color` si spegneva anche lei, e la striscia colorata dell'area
       sui blocchi della giornata e quella dello stato in «Cosa sta
       succedendo» erano sparite. Il colore glielo rimettiamo lato per lato:
       il ritaglio le smussa negli angoli, che è giusto. */
    const rimessi = [];
    lati.forEach(([s2, lato, c]) => {
      if (!daSpegnere.includes(s2)) return;
      if (/^(transparent|none|0)$/.test(c)) return;
      const ultimo = rimessi[rimessi.length - 1];
      if (ultimo && ultimo.s === s2) { if (!ultimo.lati.some((x) => x[0] === lato)) ultimo.lati.push([lato, c]); }
      else rimessi.push({ s: s2, lati: [[lato, c]] });
    });
    if (rimessi.length) {
      css += "\n  /* --- e le FASCETTE d'accento tornano: un lato solo, che\n" +
        "         l'anello non sa disegnare e lo spegnimento si portava via --- */\n";
      rimessi.forEach(({ s: s2, lati: L }) => {
        css += '  ' + coda(s2) + ' {\n' +
          L.map(([lato, c]) => '    border-' + lato + '-color: ' + c + ';').join('\n') + '\n  }\n';
      });
    }
  }
  css += '}\n';

  if (senzaMisura.length) console.log('  raggi non misurabili, lasciati come sono: ' + senzaMisura.join(' | '));
  if (restateCapsule.length) console.log('  capsule lasciate col raggio (mai viste in pagina): ' +
    new Set(restateCapsule).size + ' selettori — lancia node segni/misure.mjs');
  if (process.env.ELENCO) console.log('   ' + [...new Set(restateCapsule)].join('\n   '));
  if (stretti.length) console.log('  raggi tagliati al lato corto misurato: ' + stretti.length +
    ' — ' + stretti.slice(0, 8).join(', ') + (stretti.length > 8 ? ', …' : ''));
  if (campi.length) console.log('  campi di form lasciati col raggio (non hanno pseudo-elementi): ' +
    campi.length + ' selettori');

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
