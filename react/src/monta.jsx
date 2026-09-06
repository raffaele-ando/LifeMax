/* L'ISOLA — come React entra in un'app che è già viva, e come se ne va.

   La strategia è quella del fico strangolatore: non si riscrive tutto e poi
   si spera. Si converte UNA schermata per volta, e finché non è finita
   convivono le due. Il router di app.js ha un ramo solo:

       if (SCHERMI_REACT[v] && reactAcceso()) montaReact(v, $vista);
       else                                   disegnaVecchia();

   E QUESTA È LA PARTE CHE CONTA: `reactAcceso()` legge un'impostazione
   dell'app, più `?classico=1` nell'indirizzo. Se React si rompe sul telefono
   alle otto di mattina, si tocca un interruttore e si è tornati al codice di
   prima — senza aspettare un rilascio e senza chiedere niente a nessuno.
   È la differenza fra una migrazione e una scommessa.

   Regola: una schermata è «convertita» solo quando TUTTE le prove passano con
   l'interruttore acceso E con l'interruttore spento. Le prove pilotano un
   browser vero e interrogano il DOM da fuori: non sanno né gli importa chi
   ha scritto il markup.  */
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import Attivita from './schermi/Attivita.jsx';

/* le schermate convertite. Finché una non è qui dentro, la disegna il codice
   di prima — che resta al suo posto, intatto. */
const SCHERMI = {
  inbox: Attivita
};

/* una radice per contenitore: React vuole tenersela fra un disegno e
   l'altro, e ricrearla a ogni giro butterebbe via lo stato dei componenti
   (un campo a metà, un elenco aperto) proprio come faceva il ridisegno
   totale che stiamo cercando di togliere di mezzo */
const radici = new WeakMap();

function monta(quale, dove) {
  const Schermo = SCHERMI[quale];
  if (!Schermo || !dove) return false;
  let r = radici.get(dove);
  if (!r) { r = createRoot(dove); radici.set(dove, r); }
  r.render(<StrictMode><Schermo /></StrictMode>);
  return true;
}

/* Smontare serve: quando si torna a una schermata vecchia, React deve
   lasciare il contenitore pulito, se no il codice di prima ci scrive dentro
   sopra e si vedono due interfacce sovrapposte. */
function smonta(dove) {
  const r = dove && radici.get(dove);
  if (!r) return;
  r.unmount();
  radici.delete(dove);
}

window.LM_REACT = {
  monta: monta,
  smonta: smonta,
  /* chi c'è: serve al router per sapere se questa schermata la disegna React */
  conosce: (quale) => Object.prototype.hasOwnProperty.call(SCHERMI, quale),
  schermi: Object.keys(SCHERMI)
};
