/* LA SUPERELLISSE COME clip-path: polygon(), con gli angoli in PIXEL.
   Serve perché `corner-shape` esiste solo su Chromium recente: questo invece
   funziona su qualunque browser che sappia ritagliare un poligono, cioè tutti
   da dieci anni.

   Il problema da risolvere: `polygon()` accetta percentuali, ma un angolo
   espresso in percentuale si deforma quando il rettangolo si allunga — su una
   scheda larga e bassa gli angoli diventano ovali. La soluzione è che ogni
   coordinata è o `calc(R * k)` o `calc(100% - R * k)`, dove R è un pixel fisso
   e k una costante della curva: così i lati si allungano e gli angoli no.

   R non è scritto dentro: è `var(--sq-r)`. Il tracciato si definisce UNA volta
   in una variabile, e ogni gruppo di selettori dice solo quanto è grande il
   suo raggio. Le variabili CSS si sostituiscono al momento dell'uso, quindi
   `--sq-r` viene letto sull'elemento che ritaglia, non dove è definito.

     node segni/poligono.mjs           (n = 4, 10 punti per angolo)
     node segni/poligono.mjs 4 14 */

/* i k della curva, da (0,r) sul fianco a (r,0) sul tetto */
export function costanti(n = 4, passi = 10) {
  const k = [];
  for (let i = 0; i <= passi; i++) {
    const a = (i / passi) * Math.PI / 2;
    const u = Math.pow(Math.abs(Math.cos(a)), 2 / n);
    const v = Math.pow(Math.abs(Math.sin(a)), 2 / n);
    k.push([1 - u, 1 - v]);           /* [x/r, y/r] */
  }
  return k;
}

const N = (x) => {
  const v = Math.round(x * 10000) / 10000;
  return v === 0 ? '0' : String(v);
};
/* una coordinata: dal bordo vicino o da quello lontano */
const da = (k, R) => k === 0 ? '0' : 'calc(' + R + ' * ' + N(k) + ')';
const a = (k, R) => k === 0 ? '100%' : 'calc(100% - ' + R + ' * ' + N(k) + ')';

export function poligono(n = 4, passi = 10, R = 'var(--sq-r)') {
  const k = costanti(n, passi);
  const p = [];
  /* in giro in senso orario: alto-sx, alto-dx, basso-dx, basso-sx */
  k.forEach(([kx, ky]) => p.push(da(kx, R) + ' ' + da(ky, R)));
  k.slice().reverse().forEach(([kx, ky]) => p.push(a(kx, R) + ' ' + da(ky, R)));
  k.forEach(([kx, ky]) => p.push(a(kx, R) + ' ' + a(ky, R)));
  k.slice().reverse().forEach(([kx, ky]) => p.push(da(kx, R) + ' ' + a(ky, R)));
  /* i doppioni consecutivi non servono a niente */
  const q = p.filter((x, i) => i === 0 || x !== p[i - 1]);
  return 'polygon(' + q.join(',') + ')';
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const n = Number(process.argv[2]) || 4, passi = Number(process.argv[3]) || 10;
  const s = poligono(n, passi);
  console.log(s);
  console.error('  ' + s.length + ' caratteri, ' + (s.split(',').length) + ' punti');
}
