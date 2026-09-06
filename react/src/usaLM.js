/* IL PONTE COI DATI — venti righe, ed è tutto il ponte che serve.

   `data.js` non si tocca e non si porta dentro React: resta lui la verità.
   Sono tremiladuecento righe che sanno fondere due dispositivi, tenere le
   lapidi delle cancellazioni e non perdere niente, ed è costato un bug vero
   arrivarci. React qui è una VISTA, non un modello.

   L'app annuncia già ogni cambiamento con l'evento `lm:change`. Quindi il
   ponte è: iscriviti a quello, e quando arriva ridisegna. `useSyncExternalStore`
   è la porta che React apre apposta per una fonte di dati che sta fuori — non
   è una via di fuga, è la strada.  */
import { useSyncExternalStore, useCallback } from 'react';

const EVENTI = ['lm:change', 'lm:remote'];

function iscrivi(riDisegna) {
  EVENTI.forEach((e) => window.addEventListener(e, riDisegna));
  return () => EVENTI.forEach((e) => window.removeEventListener(e, riDisegna));
}

/* Il numero di versione dei dati. React confronta il RISULTATO di questa
   funzione per decidere se ridisegnare, e `LM.load()` restituisce ogni volta
   un oggetto nuovo: confrontandolo si ridisegnerebbe sempre. Si confronta un
   contatore, e i dati si leggono dentro al componente. */
let versione = 0;
EVENTI.forEach((e) => window.addEventListener(e, () => { versione++; }));
const leggiVersione = () => versione;

export function usaLM(scegli) {
  const stato = useSyncExternalStore(iscrivi, leggiVersione, leggiVersione);
  /* `stato` serve solo a far ridisegnare: il dato vero si prende adesso, così
     è sempre quello di questo istante e non una copia che invecchia */
  return scegli ? scegli(window.LM, stato) : window.LM;
}

/* Fare una cosa sui dati. `LM` emette `lm:change` da sé, quindi non c'è
   niente da avvisare: si chiama e basta. */
export function usaAzione(fa) {
  return useCallback((...a) => fa(window.LM, ...a), [fa]);
}
