/* IL SUPERCERCHIO SENZA `corner-shape`, cioè su qualunque browser.
   Due tracciati, generati una volta e messi in due variabili CSS:

     --sq        il PIENO: ritaglia l'elemento alla superellisse
     --sq-anello l'ANELLO: il bordo, come una superellisse cava

   Perché servono in due. Un ritaglio può solo TOGLIERE, mai aggiungere: e la
   superellisse è più PIENA dell'arco di cerchio, quindi ritagliando un box che
   ha già `border-radius` non cambia niente. Bisogna partire da un box a
   spigoli (`border-radius: 0`) e ritagliare la curva. Ma allora il bordo, che
   segue gli spigoli, viene tagliato via proprio sulla curva — e resta una
   scheda col bordo sui lati e senza bordo negli angoli. Misurato guardando: è
   il caso 2 di scratchpad/zoomb.png.
   Quindi il bordo si ridisegna: un anello ritagliato su un pseudo-elemento,
   con la regola di riempimento `evenodd` che rende cavo il contorno interno.

   IL PONTE. `polygon()` in CSS è UN solo contorno chiuso, non due: per fare un
   anello si percorre l'esterno, si salta all'interno, si percorre quello, e si
   torna. I due salti sono segmenti veri e lasciano una tacca visibile. Qui i
   salti stanno a metà del fianco sinistro, dove esterno e interno distano
   quanto lo spessore e sono alla stessa altezza: il ponte è un triangolo di
   area zero, e non si vede.

   Quello che questa strada NON può avere è l'ombra esterna: qualsiasi
   ritaglio la cancella (misurato). In quest'app costa poco, perché la
   separazione la fanno i bordi da 1px — vedi scratchpad/omb-*.png.

     node segni/anello.mjs            stampa le due variabili
     node segni/anello.mjs 4 12       esponente e punti per angolo */

export function costanti(n = 4, passi = 12) {
  const k = [];
  for (let i = 0; i <= passi; i++) {
    const a = (i / passi) * Math.PI / 2;
    const u = Math.pow(Math.abs(Math.cos(a)), 2 / n);
    const v = Math.pow(Math.abs(Math.sin(a)), 2 / n);
    k.push([1 - u, 1 - v]);
  }
  return k;
}

const N = (x) => { const v = Math.round(x * 10000) / 10000; return v === 0 ? '0' : String(v); };

/* un contorno chiuso, dato come si scrive una coordinata «dal bordo vicino»
   e una «dal bordo lontano». Parte e finisce a metà del fianco sinistro. */
function contorno(vicino, lontano, meta) {
  const k = costanti.ultimo;
  const p = [meta];
  /* dal fianco sinistro in giù? no: in su, verso l'angolo in alto a sinistra */
  k.forEach(([kx, ky]) => p.push(vicino(kx) + ' ' + vicino(ky)));
  k.slice().reverse().forEach(([kx, ky]) => p.push(lontano(kx) + ' ' + vicino(ky)));
  k.forEach(([kx, ky]) => p.push(lontano(kx) + ' ' + lontano(ky)));
  k.slice().reverse().forEach(([kx, ky]) => p.push(vicino(kx) + ' ' + lontano(ky)));
  p.push(meta);
  return p.filter((x, i) => i === 0 || x !== p[i - 1]);
}

export function tracciati(n = 4, passi = 12, R = 'var(--sq-r)', S = 'var(--sq-s)') {
  costanti.ultimo = costanti(n, passi);
  /* esterno: raggio R, dal bordo del box */
  const eV = (k) => k === 0 ? '0' : 'calc(' + R + ' * ' + N(k) + ')';
  const eL = (k) => k === 0 ? '100%' : 'calc(100% - ' + R + ' * ' + N(k) + ')';
  /* interno: spostato di S, raggio R-S */
  const iV = (k) => k === 0 ? S : 'calc(' + S + ' + (' + R + ' - ' + S + ') * ' + N(k) + ')';
  const iL = (k) => k === 0 ? 'calc(100% - ' + S + ')'
    : 'calc(100% - ' + S + ' - (' + R + ' - ' + S + ') * ' + N(k) + ')';
  const est = contorno(eV, eL, '0 50%');
  const int = contorno(iV, iL, 'calc(' + S + ') 50%');
  return {
    pieno: 'polygon(' + est.join(',') + ')',
    anello: 'polygon(evenodd,' + est.join(',') + ',' + int.join(',') + ')'
  };
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const t = tracciati(Number(process.argv[2]) || 4, Number(process.argv[3]) || 12);
  console.log('--sq: ' + t.pieno + ';');
  console.log('--sq-anello: ' + t.anello + ';');
  console.error('  pieno ' + t.pieno.length + ' car · anello ' + t.anello.length + ' car');
}
