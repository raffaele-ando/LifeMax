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
   da cambiare e il nodo resta in pace. Il magazzino è piccolo apposta: le
   stringhe in giro sono una ventina di posti, e quando sfonda il tetto si
   butta la più vecchia. */
const MAGAZZINO = new Map<string, { dangerouslySetInnerHTML: { __html: string } }>();
const TETTO = 256;

export function html(s: string): { dangerouslySetInnerHTML: { __html: string } } {
  const gia = MAGAZZINO.get(s);
  if (gia) return gia;
  const nuovo = { dangerouslySetInnerHTML: { __html: s } };
  if (MAGAZZINO.size >= TETTO) {
    const primo = MAGAZZINO.keys().next();
    if (!primo.done) MAGAZZINO.delete(primo.value);
  }
  MAGAZZINO.set(s, nuovo);
  return nuovo;
}
