/* «CAMBIATO» NON VUOL DIRE LA STESSA COSA DI QUA E DI LÀ.

   Nel browser l'evento `change` di un campo di testo o di una data arriva
   quando hai FINITO: esci dal campo, o premi invio. `onChange` di React invece
   arriva a ogni tasto premuto — è l'evento `input`, con un altro nome.

   Per quasi tutta l'app la differenza non conta. Qui sì: questi campi salvano
   nei dati e fanno ridisegnare mezza pagina, e farlo a ogni lettera vorrebbe
   dire un salvataggio per carattere e — sulle date — un `null` salvato ogni
   volta che la data è scritta a metà.

   Quindi per quei campi l'ascoltatore vero si attacca a mano, e resta quello
   del browser. Vale anche per il markup che non è di React (un <select> messo
   in pagina da un aiutante di app.js): là dentro non ci sono i suoi eventi. */
import { useEffect } from 'react';

export function usaCambioNativo(rif, quando, dipende) {
  useEffect(() => {
    const nodo = rif.current;
    if (!nodo) return undefined;
    const fa = (e) => quando(e.target, e);
    nodo.addEventListener('change', fa);
    return () => nodo.removeEventListener('change', fa);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, dipende || []);
}
