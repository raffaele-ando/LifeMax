/* GREZZO — l'HTML che arriva già scritto da `app.ts`, dato a React.

   Serve un oggetto `{ dangerouslySetInnerHTML: { __html } }`, e scriverlo a
   mano dentro al JSX sembra la cosa più innocua del mondo. Non lo è.

   React confronta quel campo per IDENTITÀ, non per contenuto: se l'oggetto è
   nuovo — e scrivendolo nel JSX è nuovo a ogni disegno — riscrive il nodo,
   anche quando la stringa dentro è la stessa lettera per lettera. Riscrivere
   vuol dire ributtare via i figli e ri-analizzare l'HTML da capo, e con la
   scheda in cima alla Panoramica voleva dire qualcosa di visibile: il numero
   grande tornava allo `0` scritto nel markup e ricontava da zero a ogni
   salvataggio. Misurato con un osservatore sul nodo: cinque figli tolti e
   cinque rimessi, a ogni commit, senza che una virgola fosse cambiata.

   Qui la stessa stringa ridà lo stesso oggetto, così React non trova niente
   da cambiare e il nodo resta in pace.

   IL MAGAZZINO HA DUE TETTI, e il secondo conta più del primo. Alcune di
   queste stringhe sono minuscole («Da sistemare» con la sua icona), altre
   sono la lista intera delle attività — decine di migliaia di caratteri che
   cambiano a ogni modifica, quindi una voce nuova ogni volta. Contare solo
   quante voci ci sono vorrebbe dire tenersi in casa duecentocinquantasei
   liste vecchie: un magazzino che ricorda tutto è una perdita di memoria con
   un altro nome. Si contano anche i caratteri, e si butta la più vecchia
   finché non si rientra. Le stringhe che tornano davvero uguali — le icone,
   le etichette, le schede ferme — restano dentro comunque, perché ogni volta
   che si ripresentano si rimettono in coda. */
const MAGAZZINO = new Map<string, { dangerouslySetInnerHTML: { __html: string } }>();
const TETTO = 256;
const TETTO_CARATTERI = 1 << 20;   /* un megabyte scarso */
let quantiCaratteri = 0;

export function html(s: string): { dangerouslySetInnerHTML: { __html: string } } {
  const gia = MAGAZZINO.get(s);
  if (gia) {
    /* rimessa in coda: così la più vecchia è davvero quella che nessuno usa */
    MAGAZZINO.delete(s);
    MAGAZZINO.set(s, gia);
    return gia;
  }
  const nuovo = { dangerouslySetInnerHTML: { __html: s } };
  MAGAZZINO.set(s, nuovo);
  quantiCaratteri += s.length;
  while (MAGAZZINO.size > TETTO || quantiCaratteri > TETTO_CARATTERI) {
    const primo = MAGAZZINO.keys().next();
    if (primo.done || MAGAZZINO.size <= 1) break;
    quantiCaratteri -= primo.value.length;
    MAGAZZINO.delete(primo.value);
  }
  return nuovo;
}
