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
import Scienza from './schermi/Scienza.jsx';
import Scoperte from './schermi/Scoperte.jsx';
import Giornata from './schermi/Giornata.jsx';
import Panoramica from './schermi/Panoramica.jsx';
import Rituali from './schermi/Rituali.jsx';
import Adesso from './schermi/Adesso.jsx';
import Filtri from './fogli/Filtri.jsx';
import Menu from './fogli/Menu.jsx';
import Aree from './fogli/Aree.jsx';
import Ritmo from './fogli/Ritmo.jsx';
import Scheda from './fogli/Scheda.jsx';
import Abitudine from './fogli/Abitudine.jsx';
import Guida from './fogli/Guida.jsx';
import QuandoPasso from './fogli/QuandoPasso.jsx';
import DaAbitudine from './fogli/DaAbitudine.jsx';
import Mancata from './fogli/Mancata.jsx';
import Timer from './fogli/Timer.jsx';
import Review from './fogli/Review.jsx';
import Lezione from './fogli/Lezione.jsx';
import Diagnostica from './fogli/Diagnostica.jsx';
import Backup from './fogli/Backup.jsx';

const SCHERMI = {
  inbox: Attivita, scienza: Scienza, esperimenti: Scoperte,
  giornata: Giornata, plancia: Panoramica, rituali: Rituali, oggi: Adesso
};

/* I PANNELLI CONVERTITI. Stessa regola delle schermate: qui dentro entra un
   pannello solo quando `prove/fogli.js` dice che è identico a quello di
   prima. Il pannello non è una schermata più piccola — si apre sopra a
   quello che stavi guardando, e chi lo apre resta vivo dietro — ma la strada
   per portarlo di qua è la stessa: un ramo solo in chi lo apre. */
const FOGLI = {
  filtri: Filtri, menu: Menu, aree: Aree, ritmo: Ritmo,
  scheda: Scheda, abitudine: Abitudine, guida: Guida,
  'quando-passo': QuandoPasso, 'da-abitudine': DaAbitudine,
  mancata: Mancata, timer: Timer, review: Review, lezione: Lezione,
  diagnostica: Diagnostica, backup: Backup
};

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
  /* LA FILA VA RIPORTATA A CASA PRIMA DI OGNI DISEGNO.
     `sottoNav()` comincia con `$vista.querySelector('.testa-porta').remove()`:
     cancella la riga del giro prima — e dentro a quella riga c'è la nostra
     fila, perché ce l'ha messa lui. Al secondo `render()` sparirebbe, e
     `sottoNav` non trovando nessun `.sez-nav` marcherebbe la riga come
     «testa-porta-sola»: le linguette scomparivano dalla schermata.
     Basta pretendere che sia figlia DIRETTA del contenitore: se sta dentro a
     una testa-porta, si riprende prima che quella venga buttata. */
  if (f) {
    f.className = chiede.classi;
    if (f.parentNode !== dove) dove.appendChild(f);
    return f;
  }
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

/* ================================================================
   I PANNELLI

   Un pannello non vive quanto una schermata: si apre, si guarda, si chiude.
   Quindi niente radice tenuta da parte — se ne fa una all'apertura e la si
   butta alla chiusura. Tenerla sarebbe anche peggio che inutile: `apriSheet`
   riscrive `#sheet-corpo` con `innerHTML` ogni volta che apre qualcosa, e
   una radice rimasta appesa punterebbe a nodi che non esistono più.

   `flushSync` perché chi apre il foglio si aspetta il contenuto in pagina
   subito dopo la chiamata: mette a fuoco, misura, scorre in cima.
   ================================================================ */
let radiceFoglio = null;

function montaFoglio(quale, dove, props) {
  const Foglio = FOGLI[quale];
  if (!Foglio || !dove) return false;
  smontaFoglio();
  const r = createRoot(dove);
  radiceFoglio = r;
  flushSync(() => { r.render(<StrictMode><Foglio {...(props || {})} /></StrictMode>); });
  return true;
}

function smontaFoglio() {
  if (!radiceFoglio) return;
  const r = radiceFoglio;
  radiceFoglio = null;
  r.unmount();
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
  montaFoglio: montaFoglio,
  smontaFoglio: smontaFoglio,
  /* chi c'è: serve al router per sapere se questa schermata la disegna React */
  conosce: (quale) => Object.prototype.hasOwnProperty.call(SCHERMI, quale),
  conosceFoglio: (quale) => Object.prototype.hasOwnProperty.call(FOGLI, quale),
  schermi: Object.keys(SCHERMI),
  fogli: Object.keys(FOGLI)
};
