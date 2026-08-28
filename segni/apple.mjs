/* L'ANGOLO CONTINUO DI APPLE, quello vero.
   Non è una superellisse. Non è un arco di cerchio. È un mosaico di TRE curve
   di Bézier per angolo, tarate a mano, e le costanti qui sotto sono quelle
   ricavate leggendo `UIBezierPath(roundedRect:cornerRadius:)`. Chi ha provato
   a rimpiazzarle con una superellisse ha misurato l'errore: la migliore, con
   n = 5.2, sbagliava 1365 pixel dove le Bézier ne sbagliavano zero.
   (fonti in segni/LEGGIMI.md)

   Le coordinate sono in unità di RAGGIO e partono dal vertice dell'angolo: la
   x va verso l'interno lungo un lato, la y lungo l'altro. La curva comincia a
   1.528665 raggi dal vertice — cioè l'angolo si mangia UNA VOLTA E MEZZA il
   raggio nominale lungo il bordo, ed è per questo che a parità di numero non
   sembra più quadrato di un arco: è il contrario.

   La proprietà che conta non è la forma in sé, è la CURVATURA. I due punti di
   controllo della prima Bézier stanno sul lato (y = 0) insieme al punto di
   partenza: tre punti allineati vogliono dire curvatura ZERO all'attacco. Da
   là sale, si appiattisce in mezzo, e riscende sull'altro lato. L'arco di
   cerchio invece ha curvatura 1/R costante e nel punto d'attacco salta a zero:
   quello scalino è ciò che l'occhio vede senza saper dire cosa.  */

/* --- le costanti, in unità di raggio --- */
export const INIZIO = 1.528665;
export const CURVE = [
  { c1: [1.08849296, 0], c2: [0.86840694, 0], p: [0.63149379, 0.07491139] },
  { c1: [0.37282383, 0.16905956], c2: [0.16905956, 0.37282383], p: [0.07491139, 0.63149379] },
  { c1: [0, 0.86840694], c2: [0, 1.08849296], p: [0, 1.528665] }
];

const bez = (p0, c1, c2, p3, t) => {
  const u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return [a * p0[0] + b * c1[0] + c * c2[0] + d * p3[0],
          a * p0[1] + b * c1[1] + c * c2[1] + d * p3[1]];
};

/* Il tracciato dell'angolo, dal lato «x» al lato «y», in punti.
   La spezzata si infittisce dove serve: si raddoppia il numero di segmenti
   finché lo scarto dalla curva vera sta sotto la tolleranza. Non a occhio —
   lo scarto si misura, campionando la curva fra due punti e guardando quanto
   si allontana dalla corda. */
/* quanti segmenti per ognuna delle tre Bézier, dato il raggio e la tolleranza */
function passi(r, tolleranza) {
  const fuori = [];
  let p0 = [INIZIO, 0];
  for (const { c1, c2, p } of CURVE) {
    let n = 2;
    while (n < 512) {
      let peggio = 0;
      for (let i = 0; i < n; i++) {
        const a = bez(p0, c1, c2, p, i / n), b = bez(p0, c1, c2, p, (i + 1) / n);
        for (let k = 1; k < 12; k++) {
          const t = (i + k / 12) / n, q = bez(p0, c1, c2, p, t);
          const dx = b[0] - a[0], dy = b[1] - a[1], ll = dx * dx + dy * dy;
          let u = ll ? ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / ll : 0;
          u = Math.max(0, Math.min(1, u));
          peggio = Math.max(peggio, Math.hypot(q[0] - (a[0] + dx * u), q[1] - (a[1] + dy * u)));
        }
      }
      if (peggio * r <= tolleranza) break;
      n *= 2;
    }
    fuori.push(n);
    p0 = p;
  }
  return fuori;
}

/* la spezzata, con un numero di segmenti dato (o calcolato dalla tolleranza) */
function spezzata(r, tolleranza, quanti) {
  const n3 = quanti || passi(r, tolleranza);
  const fuori = [];
  let p0 = [INIZIO, 0];
  CURVE.forEach(({ c1, c2, p }, k) => {
    for (let i = 1; i <= n3[k]; i++) fuori.push(bez(p0, c1, c2, p, i / n3[k]));
    p0 = p;
  });
  return { punti: [[INIZIO, 0], ...fuori].map(([x, y]) => [x * r, y * r]), n3: n3 };
}

export function puntiAngolo(r, tolleranza = 0.1) {
  return spezzata(r, tolleranza).punti;
}

/* IL TRACCIATO RIENTRATO di «s» pixel, per l'anello del bordo.
   È la STESSA curva col raggio r−s, spostata di s: così il contorno interno è
   liscio per costruzione, e campionandolo negli stessi punti di quello esterno
   i due sbagliano nella stessa direzione — la fascia resta dello stesso
   spessore tutt'intorno.
   Prima spostavo ogni punto lungo la propria normale. Su una spezzata quello
   non dà una fascia uniforme: nei vertici la distanza cresce di 1/cos(θ/2), e
   sommato allo scarto delle corde faceva ballare lo spessore di quasi mezzo
   pixel. Su un filo da un pixel si vedeva a occhio: il bordo sembrava
   disegnato a mano. */
export function puntiAngoloDentro(r, s, tolleranza = 0.1) {
  const dentro = Math.max(r - s, 0.01);
  const n3 = passi(r, tolleranza);
  const p = spezzata(dentro, tolleranza, n3).punti;
  const out = p.map(([x, y]) => [x + s, y + s]);
  /* i due capi devono stare esattamente sul lato rientrato */
  out[0][1] = s;
  out[out.length - 1][0] = s;
  return out;
}

/* ---------- da punti a CSS ---------- */
/* un decimale basta: mezzo centesimo di pixel non lo vede nessuno, e i numeri
   corti fanno un foglio di stile più corto */
const arrotonda = (x) => Math.round(x * 10) / 10;
const N = (x) => (arrotonda(x) === 0 ? '0' : arrotonda(x) + 'px');
/* Solo pixel e `calc(100% - Npx)`. Niente `min()`, niente percentuali dentro
   la matematica: quella sintassi non l'ho potuta provare fuori da Chromium, e
   quando un motore la rifiuta butta l'intera dichiarazione — lasciando lo
   spigolo vivo, che è peggio di non aver fatto niente. Questa forma invece è
   ferma dal 2013 su ogni motore. */
/* IL LIMITE, e perché è scritto così.
   L'angolo si mangia 1.528665 raggi lungo il lato, quindi su un elemento più
   corto di tre raggi i due angoli si scontrano: il poligono si autointerseca e
   viene fuori una cosa strozzata. Un segno da 9 pixel col raggio da 8 diventava
   una ciambella.
   Il limite è `min(Xpx, P%)` con P = 50 · X / lunghezza-dell-angolo: così ogni
   punto si accorcia dello STESSO fattore, che è quello che serve — la curva si
   rimpicciolisce invece di deformarsi. La moltiplicazione non c'è: la
   proporzione è già dentro la percentuale, e `min(px, %)` è la forma più
   semplice che esista di funzione matematica in CSS.
   `calc(100% - 0)` invece NON è CSS valido — da una percentuale non si può
   sottrarre uno zero senza unità — e il browser butta l'intera dichiarazione:
   il ritaglio diventa `none`, resta un rettangolo a spigoli, e l'anello
   dipinge un rettangolo pieno sopra tutto. Il controllo va fatto sul valore
   ARROTONDATO: 0.02px non è zero, ma stampato diventa «0». */
const limite = (x, lung) => {
  if (arrotonda(x) === 0) return null;
  /* un angolo col raggio ZERO (capita: `border-radius: 0 0 18px 18px`) non ha
     lunghezza, e la proporzione darebbe `Infinity%` — che è CSS non valido e
     fa buttare tutto il tracciato */
  if (!(lung > 0)) return N(x);
  const perc = Math.round((50 * x / lung) * 100) / 100;
  return 'min(' + N(x) + ', ' + perc + '%)';
};
const vicino = (x, lung) => limite(x, lung) || '0';
const lontano = (x, lung) => {
  const l = limite(x, lung);
  return l ? 'calc(100% - ' + l + ')' : '100%';
};

/* Il contorno completo, in senso orario, partendo da metà del lato sinistro —
   così quando servono due contorni (l'anello) il ponte fra i due ha area zero
   e non si vede.

   La lista di un angolo va dal punto sul PRIMO lato (x = 1.528665·r, y = 0) al
   punto sul SECONDO (x = 0, y = 1.528665·r). Girando in senso orario, ogni
   angolo si attraversa entrando da un lato e uscendo dall'altro, e quale dei
   due sia cambia da angolo a angolo: per questo la x locale finisce una volta
   sull'asse orizzontale e una volta su quello verticale. Sbagliare questa
   corrispondenza non dà una forma un po' storta — dà bandiere strappate, con
   un morso in un angolo e una punta in quello di fronte. (È successo.) */
function contorno(r4, punti, dentro) {
  const [tl, tr, br, bl] = r4;
  const p = [dentro ? N(dentro) + ' 50%' : '0 50%'];
  const spingi = (raggio, mappa, alRovescio) => {
    const L = punti(raggio);
    const lung = INIZIO * raggio;          /* quanto è lungo l'angolo sul lato */
    (alRovescio ? L.slice().reverse() : L).forEach(([x, y]) => p.push(mappa(x, y, lung)));
  };
  /* si arriva dal lato sinistro salendo, si esce sul lato alto → al rovescio */
  spingi(tl, (x, y, L) => vicino(x, L) + ' ' + vicino(y, L), true);
  /* si arriva dal lato alto, si esce sul lato destro */
  spingi(tr, (x, y, L) => lontano(x, L) + ' ' + vicino(y, L), false);
  /* si arriva dal lato destro scendendo, si esce sul lato basso */
  spingi(br, (x, y, L) => lontano(y, L) + ' ' + lontano(x, L), false);
  /* si arriva dal lato basso andando a sinistra, si esce sul lato sinistro */
  spingi(bl, (x, y, L) => vicino(x, L) + ' ' + lontano(y, L), false);
  p.push(p[0]);
  return p.filter((x, i) => i === 0 || x !== p[i - 1]);
}

export function poligono(r4, tolleranza = 0.1) {
  const est = contorno(r4, (r) => puntiAngolo(r, tolleranza), 0);
  return 'polygon(' + est.join(',') + ')';
}

/* ============================================================
   SOLO I QUATTRO MORSI — il ritaglio che non porta via nient'altro
   ============================================================

   Il problema, misurato riquadro per riquadro. Un `clip-path` taglia TUTTO il
   disegno dell'elemento, e fuori dal riquadro del bordo l'elemento disegna
   ancora due cose che contano:

     · `box-shadow`, l'ombra. L'app ne dichiara tre livelli (--e1, --e2, --e3) e
       li usa in centoventi punti: la scheda che si stacca dal fondo, il
       pulsante che si alza quando ci passi sopra, la pastiglia accesa dentro un
       segmento. Con il ritaglio pieno NON SE NE VEDEVA NESSUNA. Tutta l'app era
       piatta, e su «Chiaro · Auto · Scuro» l'unico segno che dicesse quale
       fosse la scelta in vigore era proprio quell'ombra: si toccava «Scuro», il
       sito diventava scuro, e il comando sembrava non aver ricevuto il tocco.
     · `outline`, il contorno di messa a fuoco. Chi va a tastiera vedeva
       spostarsi il fuoco senza nessun segno di dove fosse arrivato.

   Nessuno dei due si può ridisegnare dentro l'elemento: uno pseudo-elemento è
   un discendente, e il ritaglio del padre taglia anche lui (provato: un
   `::before` a `inset: -10px` sotto un padre ritagliato non esce di un pixel).
   `filter: drop-shadow()` nemmeno: il filtro si applica PRIMA del ritaglio,
   quindi l'ombra nasce e viene tagliata via nello stesso passaggio.

   Il ritaglio però non ha bisogno di togliere tutto quello che sta fuori: gli
   serve togliere QUATTRO MORSI, uno per angolo. Quindi il tracciato diventa un
   rettangolone larghissimo (200px oltre l'elemento da ogni parte, più di
   qualunque ombra dichiarata) meno le quattro zone d'angolo, ognuna chiusa fra
   i due lati e la curva. Riempimento `evenodd`: dentro il rettangolone e dentro
   un morso fa due, cioè fuori.
   Il fondo e il bordo restano ritagliati come prima — un `background` non esce
   dal riquadro del bordo per conto suo — e l'ombra e il contorno, che stanno
   fuori, non li tocca più nessuno.

   I quattro morsi non si sovrappongono mai: ogni coordinata è limitata a metà
   del lato (`min(px, 50%)`), quindi al massimo si toccano sulla mezzeria. Se si
   sovrapponessero, l'evenodd li annullerebbe a vicenda e l'angolo tornerebbe
   quadrato.

   L'ombra, sì, tiene gli spigoli vivi: `border-radius` è zero, quindi la sua
   sagoma è un rettangolo. Sotto una sfocatura da dieci pixel la differenza fra
   un angolo quadrato e un supercerchio non esiste — e il confronto vero non è
   con un'ombra perfetta, è con nessuna ombra. */
const FUORI = 200;
const F0 = -FUORI + 'px';
const F1 = 'calc(100% + ' + FUORI + 'px)';

export function poligonoAngoli(r4, tolleranza = 0.1) {
  const [tl, tr, br, bl] = r4;
  const perno = F0 + ' ' + F0;
  /* il rettangolone, in senso orario dal perno */
  const p = [perno, F1 + ' ' + F0, F1 + ' ' + F1, F0 + ' ' + F1, perno];
  /* un morso: il vertice, il lato, la curva, l'altro lato, e ritorno al perno.
     Il ponte perno→vertice si percorre due volte in versi opposti, quindi ha
     area zero e non si vede. */
  const morso = (raggio, vertice, mappa, alRovescio) => {
    if (!(raggio > 0)) return;
    const L = puntiAngolo(raggio, tolleranza);
    const lung = INIZIO * raggio;
    p.push(vertice);
    (alRovescio ? L.slice().reverse() : L).forEach(([x, y]) => p.push(mappa(x, y, lung)));
    p.push(vertice, perno);
  };
  /* Il morso in alto a sinistra gira NELLO STESSO VERSO del rettangolone —
     gli altri tre no, perché le loro mappe scambiano o specchiano gli assi —
     quindi va percorso al rovescio. Misurato: l'area con segno di ognuno dei
     quattro, confrontata con quella del rettangolo. */
  morso(tl, '0 0', (x, y, L) => vicino(x, L) + ' ' + vicino(y, L), true);
  morso(tr, '100% 0', (x, y, L) => lontano(x, L) + ' ' + vicino(y, L), false);
  morso(br, '100% 100%', (x, y, L) => lontano(y, L) + ' ' + lontano(x, L), false);
  morso(bl, '0 100%', (x, y, L) => vicino(x, L) + ' ' + lontano(y, L), false);
  /* l'ultimo perno è di troppo: il poligono si chiude da sé */
  if (p[p.length - 1] === perno) p.pop();
  return 'polygon(' + p.filter((x, i) => i === 0 || x !== p[i - 1]).join(',') + ')';
}

/* L'ANELLO, e perché il contorno esterno è un RETTANGOLO e non la curva.
   L'anello sta su uno pseudo-elemento dentro l'elemento ritagliato, quindi il
   ritaglio del padre lo taglia già lui. Dandogli anche la curva come contorno
   esterno, quel bordo veniva sfumato DUE volte — una dal proprio ritaglio e
   una da quello del padre — e sulla curva usciva più chiaro che sui lati
   dritti. Si vedeva a occhio: bordo scuro sui fianchi e un velo chiaro
   sull'angolo. Col rettangolo la curva la disegna il padre, una volta sola, e
   l'anello si occupa solo del contorno INTERNO. */
export function anello(r4, s, tolleranza = 0.1) {
  /* Il rettangolo parte da metà del lato sinistro come il contorno interno: un
     `polygon()` è UN contorno chiuso, quindi i due si collegano con un ponte, e
     il ponte deve avere area zero o si vede. Partendo da `0 0` il ponte
     diventava una scheggia diagonale che tagliava via un pezzo di anello — una
     fessura bianca in mezzo al fianco. */
  const est = ['0 50%', '0 0', '100% 0', '100% 100%', '0 100%', '0 50%'];
  /* il contorno interno gira AL ROVESCIO di quello esterno: due contorni in
     versi opposti fanno un buco anche col riempimento normale, e così il
     tracciato non ha bisogno di `evenodd` — che WebKit dentro `polygon()`
     non fa, e senza il quale su iPad l'anello diventava un rettangolo pieno */
  const int = contorno(r4, (r) => puntiAngoloDentro(r, s, tolleranza), s).slice().reverse();
  return 'polygon(' + est.join(',') + ',' + int.join(',') + ')';
}

/* L'ANELLO PER CHI SCORRE. `overflow: auto` taglia al riquadro interno (il
   padding box), quindi un anello messo nell'area del bordo viene via tutto e
   l'elemento resta senza bordo. Per quei pochi l'anello si disegna DENTRO: la
   fascia sta fra s e 2s dal contorno, cioè il bordo appare rientrato di un
   pixel. Su un pannello con un filo da 1px non si distingue, e l'alternativa
   era non avere bordo. */
export function anelloDentro(r4, s, tolleranza = 0.1) {
  const est = contorno(r4, (r) => puntiAngoloDentro(r, s, tolleranza), s);
  const int = contorno(r4, (r) => puntiAngoloDentro(r, 2 * s, tolleranza), 2 * s).slice().reverse();
  return 'polygon(' + est.join(',') + ',' + int.join(',') + ')';
}

/* il tracciato SVG, per il logo e per le icone: là le Bézier ci stanno per
   quello che sono, senza spezzarle in segmenti */
export function tracciatoSvg(w, h, r) {
  const P = (x, y) => Math.round(x * 1000) / 1000 + ' ' + Math.round(y * 1000) / 1000;
  const d = [];
  const angolo = (ox, oy, sx, sy) => {
    /* (ox,oy) il vertice, (sx,sy) i versi verso l'interno */
    d.push('C ' + CURVE.map((c, i) => {
      const q = [c.c1, c.c2, c.p].map(([x, y]) => P(ox + x * r * sx, oy + y * r * sy));
      return (i ? 'C ' : '') + q.join(' ');
    }).join(' '));
  };
  d.push('M ' + P(INIZIO * r, 0));
  d.push('L ' + P(w - INIZIO * r, 0));
  angolo(w, 0, -1, 1);
  d.push('L ' + P(w, h - INIZIO * r));
  d.push('C ' + CURVE.map((c, i) => (i ? 'C ' : '') + [c.c1, c.c2, c.p]
    .map(([x, y]) => P(w - y * r, h - x * r)).join(' ')).join(' '));
  d.push('L ' + P(INIZIO * r, h));
  d.push('C ' + CURVE.map((c, i) => (i ? 'C ' : '') + [c.c1, c.c2, c.p]
    .map(([x, y]) => P(x * r, h - y * r)).join(' ')).join(' '));
  d.push('L ' + P(0, INIZIO * r));
  d.push('C ' + CURVE.map((c, i) => (i ? 'C ' : '') + [c.c1, c.c2, c.p]
    .map(([x, y]) => P(y * r, x * r)).join(' ')).join(' '));
  d.push('Z');
  return d.join(' ');
}

/* ---------- quanto «sembra» tondo ----------
   Serve a ritarare i raggi. L'angolo di Apple si mangia 1.53 raggi lungo il
   lato, quindi a parità di numero toglie PIÙ area di un arco: il raggio va
   abbassato, non alzato, per lasciare l'aspetto dov'era. Il conto è l'area
   sottratta all'angolo, in unità di r². */
export function areaTolta(passi = 20000) {
  /* area sotto il tracciato dell'angolo, dentro il quadrato INIZIO × INIZIO */
  const p = puntiAngolo(1, 0.00002);
  let a = 0;
  for (let i = 1; i < p.length; i++) {
    const [x0, y0] = p[i - 1], [x1, y1] = p[i];
    a += (x0 - x1) * ((y0 + y1) / 2);      /* trapezi, x che scende */
  }
  void passi;
  return a;                                 /* area fra la curva e i due lati */
}
export const AREA_ARCO = 1 - Math.PI / 4;   /* 0.2146 · R², l'arco di cerchio */

/* il raggio d'arco che toglie la stessa area: due forme con lo stesso «morso»
   si leggono come ugualmente arrotondate */
export const arcoEquivalente = (r) => r * Math.sqrt(areaTolta() / AREA_ARCO);
export const raggioDaArco = (rArco) => rArco / Math.sqrt(areaTolta() / AREA_ARCO);

/* sotto questo lato i due angoli si scontrerebbero */
export const latoMinimo = (r) => 2 * INIZIO * r;
