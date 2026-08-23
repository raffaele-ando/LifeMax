/* IL TRACCIATO DI UNA SUPERELLISSE, per gli SVG.
   Serve dove `corner-shape` non arriva — cioè su Safari — e per le immagini:
   un tracciato è una superellisse vera su qualunque browser e a qualunque
   ingrandimento.

     node segni/superellisse.mjs 44 44 13        (larghezza altezza raggio)
     node segni/superellisse.mjs 44 44 13 4      (e l'esponente)

   La forma è |u|^n + |v|^n = 1 con n = 4, lo stesso esponente che dà
   `corner-shape: squircle` (misurato, non dedotto dal nome: vedi
   prove/squircle.js). n = 2 sarebbe un arco di cerchio, cioè il border-radius
   di sempre.

   I LATI DEVONO RESTARE DIRITTI. Prima versione: si campionavano i quattro
   angoli e si passava tutto per Catmull-Rom. Le tangenti agli estremi
   dell'angolo venivano calcolate dai punti vicini, che stanno sulla curva, e
   il lato diritto in mezzo si incurvava di un pelo — invisibile a 15px,
   visibile su un'icona da 512. Ora ogni angolo ha i suoi punti d'appoggio
   fantasma sul prolungamento del lato, così la tangente all'inizio e alla
   fine dell'angolo è esattamente orizzontale o verticale, e i lati sono
   segmenti dritti dichiarati. */

const F = (x) => Math.round(x * 1000) / 1000;

/* il quarto di superellisse, dal fianco al lato di sopra, dentro un angolo
   di lato r messo nell'origine */
function quarto(r, n, passi) {
  const p = [];
  for (let i = 0; i <= passi; i++) {
    const a = (i / passi) * Math.PI / 2;
    /* x = cos(a)^(2/n), y = sin(a)^(2/n) → x^n + y^n = cos²+sin² = 1 */
    const u = Math.pow(Math.abs(Math.cos(a)), 2 / n);
    const v = Math.pow(Math.abs(Math.sin(a)), 2 / n);
    p.push([r - r * u, r - r * v]);
  }
  return p;
}

/* una catena di cubiche che passa per tutti i punti, con le tangenti agli
   estremi imposte da fuori (i due «fantasmi») */
function catena(pt, primaFantasma, dopoFantasma) {
  const q = [primaFantasma, ...pt, dopoFantasma];
  let d = '';
  for (let i = 1; i < q.length - 2; i++) {
    const p0 = q[i - 1], p1 = q[i], p2 = q[i + 1], p3 = q[i + 2];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += 'C' + F(c1[0]) + ' ' + F(c1[1]) + ' ' + F(c2[0]) + ' ' + F(c2[1]) + ' ' + F(p2[0]) + ' ' + F(p2[1]);
  }
  return d;
}

export function superellisse(w, h, r, n = 4, passi = 12) {
  /* il raggio non può superare la metà del lato più corto */
  r = Math.min(r, Math.min(w, h) / 2);
  const base = quarto(r, n, passi);
  /* i quattro angoli: ognuno è il quarto specchiato e spostato.
     [segno x, segno y, origine x, origine y, verso] */
  const angoli = [
    [1, 1, 0, 0], [-1, 1, w, 0], [-1, -1, w, h], [1, -1, 0, h]
  ];
  /* in giro in senso orario partendo dal fianco sinistro, sotto l'angolo
     in alto a sinistra */
  let d = 'M0 ' + F(r);
  for (let k = 0; k < 4; k++) {
    const [sx, sy, ox, oy] = angoli[k];
    const met = (p) => [ox + sx * p[0], oy + sy * p[1]];
    /* l'angolo 0 va dal fianco al tetto; specchiando, il verso si inverte */
    const pt = (k % 2 === 0 ? base : base.slice().reverse()).map(met);
    /* i fantasmi: sul prolungamento del lato che arriva e di quello che parte,
       così la tangente agli estremi è quella del lato */
    const dir = (a, b) => [b[0] - a[0], b[1] - a[1]];
    const primo = pt[0], ultimo = pt[pt.length - 1];
    const vIn = k % 2 === 0 ? [0, -sy] : [sx, 0];       /* da dove si arriva */
    const vOut = k % 2 === 0 ? [sx, 0] : [0, sy];       /* dove si va */
    const passo = r / passi;
    const fPrima = [primo[0] - vIn[0] * passo, primo[1] - vIn[1] * passo];
    const fDopo = [ultimo[0] + vOut[0] * passo, ultimo[1] + vOut[1] * passo];
    void dir;
    d += catena(pt, fPrima, fDopo);
    /* il lato diritto fino all'inizio dell'angolo dopo */
    const succ = angoli[(k + 1) % 4];
    const metS = (p) => [succ[2] + succ[0] * p[0], succ[3] + succ[1] * p[1]];
    const ptS = ((k + 1) % 2 === 0 ? base : base.slice().reverse()).map(metS);
    d += 'L' + F(ptS[0][0]) + ' ' + F(ptS[0][1]);
  }
  return d + 'Z';
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const [w, h, r, n, passi] = process.argv.slice(2).map(Number);
  console.log(superellisse(w || 44, h || 44, r || 13, n || 4, passi || 12));
}
