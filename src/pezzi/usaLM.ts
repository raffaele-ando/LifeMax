/* IL PONTE COI DATI — venti righe, ed è tutto il ponte che serve.

   `dati.ts` non si porta dentro React: resta lui la verità. Sono tremilaseicento
   righe che sanno fondere due dispositivi, tenere le lapidi delle cancellazioni
   e non perdere niente, ed è costato un bug vero arrivarci. React qui è una
   VISTA, non un modello.

   L'app annuncia già ogni cambiamento con l'evento `lm:change`. Quindi il
   ponte è: iscriviti a quello, e quando arriva ridisegna. `useSyncExternalStore`
   è la porta che React apre apposta per una fonte di dati che sta fuori — non
   è una via di fuga, è la strada.  */
import { useSyncExternalStore, useCallback } from 'react';
import { LM } from '../dati/dati';
import type { ApiLM } from '../dati/dati';

/* SOLO `lm:change`, e MAI mentre si scrive.

   `lm:remote` — la modifica arrivata da un altro dispositivo — non si ascolta
   qui: la ascolta `app.ts`, che sa già cosa farne. La sua regola è «mentre
   scrivi non si ridisegna, ma non si dimentica»: si tiene da parte e si fa
   appena il campo perde il fuoco. Ridisegnare sotto le dita butterebbe via
   quello che stai scrivendo, e prima quel ridisegno si perdeva e basta — la
   modifica restava nei dati e non compariva fino a una ricarica.
   Ascoltandolo anche di qua, React ridisegnava lo stesso e la regola saltava.

   Lo stesso vale per `lm:change`: se arriva mentre un campo ha il fuoco si
   segna e si aspetta. `prove/cloud.js` è la prova che lo pretende. */

function staDigitando(): boolean {
  const e = document.activeElement;
  return !!e && /input|textarea|select/i.test(e.tagName);
}

/* Il numero di versione dei dati. React confronta il RISULTATO di questa
   funzione per decidere se ridisegnare, e `LM.load()` restituisce ogni volta
   un oggetto nuovo: confrontandolo si ridisegnerebbe sempre. Si confronta un
   contatore, e i dati si leggono dentro al componente. */
let versione = 0;
let inAttesa = false;
const svegliaTutti = new Set<() => void>();
function segnala(): void {
  versione++;
  svegliaTutti.forEach(function (f) { f(); });
}

document.addEventListener('lm:change', function () {
  if (staDigitando()) { inAttesa = true; return; }
  segnala();
});

/* e quando il campo lascia il fuoco si recupera quello che si era tenuto */
document.addEventListener('focusout', function () {
  if (!inAttesa) return;
  setTimeout(function () {
    if (staDigitando() || !inAttesa) return;
    inAttesa = false;
    segnala();
  }, 0);
});

function iscrivi(riDisegna: () => void): () => void {
  svegliaTutti.add(riDisegna);
  return function () { svegliaTutti.delete(riDisegna); };
}
const leggiVersione = (): number => versione;

/* Senza `scegli` torna `LM`: il componente legge quello che gli serve da sé.
   Con `scegli` torna quello che ha scelto, e il secondo argomento è il
   contatore — serve solo a chi vuole scriverlo in una chiave di React. */
export function usaLM(): ApiLM;
export function usaLM<T>(scegli: (lm: ApiLM, versione: number) => T): T;
export function usaLM<T>(scegli?: (lm: ApiLM, versione: number) => T): T | ApiLM {
  const stato = useSyncExternalStore(iscrivi, leggiVersione, leggiVersione);
  /* `stato` serve solo a far ridisegnare: il dato vero si prende adesso, così
     è sempre quello di questo istante e non una copia che invecchia */
  return scegli ? scegli(LM, stato) : LM;
}

/* Fare una cosa sui dati. `LM` emette `lm:change` da sé, quindi non c'è
   niente da avvisare: si chiama e basta. */
export function usaAzione<A extends unknown[], R>(
  fa: (lm: ApiLM, ...a: A) => R
): (...a: A) => R {
  return useCallback(function (...a: A) { return fa(LM, ...a); }, [fa]);
}
