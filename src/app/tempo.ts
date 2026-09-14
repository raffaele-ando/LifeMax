/* L'OROLOGIO SCRITTO IN ITALIANO — quattro funzioni, e nient'altro.

   Sono uscite da `app.ts` insieme al trascinamento, e per causa sua: quel
   pezzo doveva dire «spostata a domani, alle 14:30» e per dirlo aveva
   bisogno di queste. Tenerle di là avrebbe voluto dire un anello — il
   trascinamento che importa l'app che importa il trascinamento — e un
   anello si evita una volta sola, quando si taglia.

   Non sanno niente dell'app: prendono un numero o una data e restituiscono
   una parola. `etichettaGiorno` è la sola che guarda i dati, e guarda solo
   che giorno è oggi.

   `fmtOre` e `etichettaGiorno` le importano anche i pezzi React, che le
   chiedono a `app.ts`: da là escono ancora, ri-esportate, così nessuno dei
   ventisette punti che le chiamano deve cambiare riga. */
import { LM } from '../dati/dati';
import type { Giorno } from '../tipi/stato';

export function fmtMin(m: number): string {
  m = ((m % 1440) + 1440) % 1440;
  return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
}
/* durata leggibile: 90 → "1h 30m", 45 → "45m", 120 → "2h" */
export function fmtOre(min: number): string {
  var h = Math.floor(min / 60), m = min % 60;
  return (h ? h + 'h' : '') + (h && m ? ' ' : '') + (m ? m + 'm' : (h ? '' : '0m'));
}

/* etichetta relativa del giorno: Oggi / Ieri / "lun 14 lug" */
export function etichettaGiorno(k: Giorno): string {
  var t = LM.todayKey();
  if (k === t) return 'Oggi';
  if (k === LM.addDays(t, -1)) return 'Ieri';
  /* «Domani» mancava: il tasto per rimandare diceva «Sposta a mer 19 ago»
     quando bastava «a domani», e andava a capo su due righe */
  if (k === LM.addDays(t, 1)) return 'Domani';
  var g = LM.weekdayShort(k);
  return g.charAt(0).toUpperCase() + g.slice(1) + ' ' + LM.fmtShort(k);
}

export function oraDi(ts: number): string {
  var d = new Date(ts);
  return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
}
