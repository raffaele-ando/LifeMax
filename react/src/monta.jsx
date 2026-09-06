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
import { flushSync } from 'react-dom';
import { StrictMode } from 'react';
/* LE SCHERMATE CONVERTITE. Vuoto, e per una regola precisa: qui dentro entra
   una schermata solo quando è IDENTICA a quella di prima — stesso markup,
   stesse classi, stesso comportamento. Passare a React non è l'occasione per
   ridisegnare: è un cambio di motore, e chi guarda non se ne deve accorgere.
   Ci avevo messo una versione «mia» di Attività, con altre linguette e altro
   contenuto. Era sbagliato e l'ho tolta. */
import Attivita from './schermi/Attivita.jsx';

const SCHERMI = { inbox: Attivita };

/* una radice per contenitore: React vuole tenersela fra un disegno e
   l'altro, e ricrearla a ogni giro butterebbe via lo stato dei componenti
   (un campo a metà, un elenco aperto) proprio come faceva il ridisegno
   totale che stiamo cercando di togliere di mezzo */
const radici = new WeakMap();

/* ================================================================
   LE LINGUETTE, E PERCHÉ STANNO IN UN PORTALE

   `sottoNav()` in app.js, dopo che la pagina si è disegnata, PRENDE il nodo
   delle linguette della vista e lo SPOSTA dentro a una riga nuova, accanto
   all'ingranaggio. Il commento là lo dice: «la fila esiste già, e si sposta
   senza rifarla — i suoi fili restano attaccati». Per il codice di prima è
   una furbizia che funziona.

   Per React è un problema serio: gli si porta via un figlio dall'albero, e
   al ridisegno dopo, quando deve infilare un fratello accanto a quel nodo,
   `insertBefore` lo cerca in un padre in cui non c'è più.

   Il portale è la porta che React apre apposta per questo. Il contenitore
   delle linguette lo crea `monta` a mano, come figlio diretto di #vista —
   così `sottoNav` lo trova dove se lo aspetta — e React ci disegna DENTRO
   attraverso un portale. Il nodo può finire dove vuole: React continua a
   scrivere lì, perché di un portale gli importa il contenitore, non dove
   quel contenitore sta appeso.

   E `flushSync`, perché React di suo disegna quando gli pare: `render()` in
   app.js chiama `monta` e subito dopo `sottoNav`, che deve trovare il nodo
   già in pagina.
   ================================================================ */
const filaDi = new WeakMap();

function fila(dove, chiede) {
  if (!chiede) return null;
  let f = filaDi.get(dove);
  /* se sta ancora appesa da qualche parte va bene: sottoNav l'ha spostata,
     non buttata. Se non c'è più (siamo tornati e ripartiti) se ne fa una. */
  if (f && f.isConnected) { f.className = chiede.classi; return f; }
  f = document.createElement('div');
  f.className = chiede.classi;
  if (chiede.id) f.id = chiede.id;
  dove.appendChild(f);
  filaDi.set(dove, f);
  return f;
}

function monta(quale, dove) {
  const Schermo = SCHERMI[quale];
  if (!Schermo || !dove) return false;
  let r = radici.get(dove);
  const primaVolta = !r;
  if (!r) { r = createRoot(dove); radici.set(dove, r); }
  const chiede = Schermo.lingue && Schermo.lingue();

  /* AL PRIMO MONTAGGIO SI DISEGNA DUE VOLTE, e c'è un motivo.
     `createRoot(...).render()` la prima volta SVUOTA il contenitore: una fila
     appesa prima se la porterebbe via. Quindi prima si lascia che React
     riempia il contenitore, poi ci si appende la fila accanto, e si ridisegna
     perché il portale ci finisca dentro. Tutt'e due i giri sono `flushSync`,
     quindi fra l'uno e l'altro non c'è nessun disegno sullo schermo: chi
     guarda non vede niente. Dal secondo montaggio in poi la fila c'è già —
     spostata da sottoNav, ma c'è — e il giro è uno solo. */
  if (primaVolta) {
    flushSync(() => { r.render(<StrictMode><Schermo fila={null} /></StrictMode>); });
  }
  const suaFila = fila(dove, chiede);
  flushSync(() => { r.render(<StrictMode><Schermo fila={suaFila} /></StrictMode>); });
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
  const f = filaDi.get(dove);
  if (f && f.parentNode) f.parentNode.removeChild(f);
  filaDi.delete(dove);
}

window.LM_REACT = {
  monta: monta,
  smonta: smonta,
  /* chi c'è: serve al router per sapere se questa schermata la disegna React */
  conosce: (quale) => Object.prototype.hasOwnProperty.call(SCHERMI, quale),
  schermi: Object.keys(SCHERMI)
};
