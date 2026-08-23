/* Il solo generatore di tracciati, esportato perché lo usi anche la prova.
   Sta a parte da squircle.mjs perché quello scrive un file, e una prova non
   deve scrivere niente per poter misurare. */
/* Quanti punti per angolo. La corda taglia dentro la curva di circa 0.008·R
   con sei passi, 0.0046·R con otto e 0.002·R con dodici: sei bastano fino a
   18px, otto fino a 34, e oltre servono dodici per stare sotto il decimo di
   pixel. Nell'app il raggio più grande è 26px — le pastiglie non passano da
   qui, restano col loro raggio — quindi i dodici passi non costano niente. */
export function passiPer(r4) {
  const r = Math.max.apply(null, [].concat(r4));
  return r <= 18 ? 6 : r <= 34 ? 8 : 12;
}

export function tracciatiPer(r4, s, n, passi) {
  const K = [];
  for (let i = 0; i <= passi; i++) {
    const a = (i / passi) * Math.PI / 2;
    K.push([1 - Math.pow(Math.abs(Math.cos(a)), 2 / n), 1 - Math.pow(Math.abs(Math.sin(a)), 2 / n)]);
  }
  const N = (x) => { const v = Math.round(x * 100) / 100; return v === 0 ? '0' : v + 'px'; };
  const lim = (x) => 'min(' + N(x) + ', 50%)';
  const K3 = (k) => Math.round(k * 1000) / 1000;
  const vicino = (R, k) => k === 0 ? '0' : 'calc(' + lim(R) + ' * ' + K3(k) + ')';
  const lontano = (R, k) => k === 0 ? '100%' : 'calc(100% - ' + lim(R) + ' * ' + K3(k) + ')';
  const vicinoI = (R, k) => k === 0 ? s + 'px'
    : 'calc(' + s + 'px + (' + lim(R) + ' - ' + s + 'px) * ' + K3(k) + ')';
  const lontanoI = (R, k) => k === 0 ? 'calc(100% - ' + s + 'px)'
    : 'calc(100% - ' + s + 'px - (' + lim(R) + ' - ' + s + 'px) * ' + K3(k) + ')';
  function contorno(fV, fL, meta) {
    const p = [meta];
    K.forEach(([kx, ky]) => p.push(fV(r4[0], kx) + ' ' + fV(r4[0], ky)));
    K.slice().reverse().forEach(([kx, ky]) => p.push(fL(r4[1], kx) + ' ' + fV(r4[1], ky)));
    K.forEach(([kx, ky]) => p.push(fL(r4[2], kx) + ' ' + fL(r4[2], ky)));
    K.slice().reverse().forEach(([kx, ky]) => p.push(fV(r4[3], kx) + ' ' + fL(r4[3], ky)));
    p.push(meta);
    return p.filter((x, i) => i === 0 || x !== p[i - 1]);
  }
  const est = contorno(vicino, lontano, '0 50%');
  const int = contorno(vicinoI, lontanoI, s + 'px 50%');
  return {
    pieno: 'polygon(' + est.join(',') + ')',
    anello: 'polygon(evenodd,' + est.join(',') + ',' + int.join(',') + ')'
  };
}
