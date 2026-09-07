/* ============================================================
   CHI DISEGNA CHE COSA — il solo modulo che conosce React e `app.ts`
   insieme.

   `app.ts` ha due registri vuoti e una funzione per riempirli
   (`registraSchermo`, `registraFoglio`), e un gancio per lo smontaggio
   (`ganci.smontaFoglio`). Non importa React, e non è pudore: era l'unico
   modo di rompere l'anello. Ogni schermata chiama `render()`, e `render()`
   chiamava ogni schermata: due archi, e il grafo diventa un anello solo in
   cui nessuna schermata si può separare dalle altre — misurato, 444 KB di
   chiusura per ognuna e zero di parte propria.

   Qui il giro si chiude una volta, in un posto, e questo file lo importa
   `main.tsx` prima di avviare l'app.

   COS'ERA PRIMA. `react/src/monta.jsx`, che teneva anche l'elenco delle
   schermate «convertite» e la spiegazione della convivenza fra i due
   disegni: `reactAcceso()`, `?classico=1`, l'interruttore per tornare al
   codice di prima se qualcosa si rompeva sul telefono alle otto di mattina.
   Hanno fatto il loro lavoro — le sette schermate e i quindici pannelli
   sono passati uno per uno — e il codice di prima non c'è più, quindi non
   c'è più nessun posto a cui tornare. Un interruttore che porta dove non
   c'è niente è peggio che non averlo.
   ============================================================ */
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { StrictMode, createElement } from 'react';
import type { ComponentType } from 'react';

import { registraSchermo, registraFoglio, ganci } from './app';
import type { PropDiFoglio, NomeFoglio } from '../fogli/porte';

import Attivita, { lingueAttivita } from '../schermi/Attivita';
import Scienza from '../schermi/Scienza';
import Scoperte from '../schermi/Scoperte';
import Giornata from '../schermi/Giornata';
import Panoramica from '../schermi/Panoramica';
import Rituali from '../schermi/Rituali';
import Adesso from '../schermi/Adesso';
import Lab from '../schermi/Lab';

import Filtri from '../fogli/Filtri';
import Menu from '../fogli/Menu';
import Aree from '../fogli/Aree';
import Ritmo from '../fogli/Ritmo';
import Scheda from '../fogli/Scheda';
import Abitudine from '../fogli/Abitudine';
import Guida from '../fogli/Guida';
import QuandoPasso from '../fogli/QuandoPasso';
import DaAbitudine from '../fogli/DaAbitudine';
import Mancata from '../fogli/Mancata';
import Timer from '../fogli/Timer';
import Review from '../fogli/Review';
import Lezione from '../fogli/Lezione';
import Diagnostica from '../fogli/Diagnostica';
import Backup from '../fogli/Backup';

/* ================================================================
   LE LINGUETTE, E PERCHÉ STANNO IN UN PORTALE

   `sottoNav()` in `app.ts`, dopo che la pagina si è disegnata, PRENDE il
   nodo delle linguette della vista e lo SPOSTA dentro a una riga nuova,
   accanto all'ingranaggio. Il commento là lo dice: «la fila esiste già, e
   si sposta senza rifarla — i suoi fili restano attaccati».

   Per React è un problema serio: gli si porta via un figlio dall'albero, e
   al ridisegno dopo, quando deve infilare un fratello accanto a quel nodo,
   `insertBefore` lo cerca in un padre in cui non c'è più.

   Il portale è la porta che React apre apposta per questo. Il contenitore
   delle linguette lo si crea a mano, come figlio diretto di #vista — così
   `sottoNav` lo trova dove se lo aspetta — e React ci disegna DENTRO
   attraverso un portale. Il nodo può finire dove vuole: React continua a
   scrivere lì, perché di un portale gli importa il contenitore, non dove
   quel contenitore sta appeso.

   E `flushSync`, perché React di suo disegna quando gli pare: `render()`
   chiama qui e subito dopo `sottoNav`, che deve trovare il nodo già in
   pagina.
   ================================================================ */

/* come vuole essere fatta la fila delle linguette di una schermata: le
   classi le decide lei, perché dipendono da quante linguette ha */
interface Fila { id: string; classi: string }
/* una schermata riceve il contenitore delle sue linguette, quando ne ha */
type Schermo = ComponentType<{ fila: HTMLElement | null }>;

const SCHERMI: Record<string, Schermo> = {
  inbox: Attivita, scienza: Scienza, esperimenti: Scoperte,
  giornata: Giornata, plancia: Panoramica, rituali: Rituali, oggi: Adesso,
  /* il laboratorio si disegna da sé dentro al suo contenitore, ma passa da
     qui come tutti: `#vista` deve avere un padrone solo */
  lab: Lab
};

/* quali schermate hanno una fila di linguette propria, e com'è fatta.
   Solo Attività: le altre le prende `sottoNav` dalle viste della porta. */
const LINGUE: Record<string, () => Fila> = { inbox: lingueAttivita };

/* I QUINDICI PANNELLI, ognuno col tipo delle SUE proprietà.
   La tabella è scritta così — un tipo mappato su `PropDiFoglio` — perché in
   quel modo il compilatore controlla due cose insieme: che ci siano tutti
   (uno che manca è un pannello che non si apre) e che ognuno sia il
   componente che prende esattamente le proprietà che `porte.ts` dichiara
   per il suo nome. Un `Scheda` messo sotto la chiave `lezione` non
   compila. */
type Pannelli = { [K in NomeFoglio]: ComponentType<PropDiFoglio[K]> };

const FOGLI: Pannelli = {
  filtri: Filtri, menu: Menu, aree: Aree, ritmo: Ritmo,
  scheda: Scheda, abitudine: Abitudine, guida: Guida,
  'quando-passo': QuandoPasso, 'da-abitudine': DaAbitudine,
  mancata: Mancata, timer: Timer, review: Review,
  lezione: Lezione, diagnostica: Diagnostica, backup: Backup
};

/* una radice per contenitore: React vuole tenersela fra un disegno e
   l'altro, e ricrearla a ogni giro butterebbe via lo stato dei componenti
   (un campo a metà, un elenco aperto) proprio come faceva il ridisegno
   totale che si è tolto di mezzo */
const radici = new WeakMap<HTMLElement, Root>();
const fileDi = new WeakMap<HTMLElement, HTMLElement>();

function fila(dove: HTMLElement, chiede: Fila | null): HTMLElement | null {
  if (!chiede) return null;
  const gia = fileDi.get(dove);
  /* LA FILA VA RIPORTATA A CASA PRIMA DI OGNI DISEGNO.
     `sottoNav()` comincia togliendo la `.testa-porta` del giro prima — e
     dentro a quella riga c'è la nostra fila, perché ce l'ha messa lui. Al
     secondo `render()` sparirebbe, e `sottoNav` non trovando nessun
     `.sez-nav` marcherebbe la riga come «testa-porta-sola»: le linguette
     scomparivano dalla schermata.
     Basta pretendere che sia figlia DIRETTA del contenitore: se sta dentro a
     una testa-porta, si riprende prima che quella venga buttata. */
  if (gia) {
    gia.className = chiede.classi;
    if (gia.parentNode !== dove) dove.appendChild(gia);
    return gia;
  }
  const f = document.createElement('div');
  f.className = chiede.classi;
  if (chiede.id) f.id = chiede.id;
  dove.appendChild(f);
  fileDi.set(dove, f);
  return f;
}

function montaSchermo(quale: string, Schermata: Schermo, dove: HTMLElement): void {
  let r = radici.get(dove);
  const primaVolta = !r;
  if (!r) { r = createRoot(dove); radici.set(dove, r); }
  const radice = r;
  const chiede = LINGUE[quale] ? (LINGUE[quale] as () => Fila)() : null;

  /* AL PRIMO MONTAGGIO SI DISEGNA DUE VOLTE, e c'è un motivo.
     `createRoot(...).render()` la prima volta SVUOTA il contenitore: una fila
     appesa prima se la porterebbe via. Quindi prima si lascia che React
     riempia il contenitore, poi ci si appende la fila accanto, e si ridisegna
     perché il portale ci finisca dentro. Tutt'e due i giri sono `flushSync`,
     quindi fra l'uno e l'altro non c'è nessun disegno sullo schermo: chi
     guarda non vede niente. Dal secondo montaggio in poi la fila c'è già —
     spostata da `sottoNav`, ma c'è — e il giro è uno solo. */
  if (primaVolta) {
    flushSync(() => { radice.render(<StrictMode><Schermata fila={null} /></StrictMode>); });
  }
  const suaFila = fila(dove, chiede);
  flushSync(() => { radice.render(<StrictMode><Schermata fila={suaFila} /></StrictMode>); });
}

Object.keys(SCHERMI).forEach(function (quale) {
  const Schermata = SCHERMI[quale] as Schermo;
  registraSchermo(quale, function (dove) { montaSchermo(quale, Schermata, dove); });
});

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
let radiceFoglio: Root | null = null;

function smontaFoglio(): void {
  if (!radiceFoglio) return;
  const r = radiceFoglio;
  radiceFoglio = null;
  r.unmount();
}

/* l'iscrizione è generica sul nome: dentro al giro `K` è il nome di QUEL
   pannello, quindi `Pannello` e le proprietà che `registraFoglio` pretende
   sono la stessa cosa — e `Object.keys` da solo darebbe `string[]`, che
   perderebbe proprio quello */
function iscriviFoglio<K extends NomeFoglio>(quale: K): void {
  const Pannello = FOGLI[quale];
  registraFoglio(quale, function (dove, props) {
    smontaFoglio();
    const r = createRoot(dove);
    radiceFoglio = r;
    /* `createElement` e non `<Pannello {...props} />`: in JSX il componente
       deve avere un tipo concreto, e qui `Pannello` è generico su `K` —
       scritto in JSX il compilatore non riesce a mettere insieme le
       proprietà con il componente, pur essendo per costruzione le sue. */
    const dentro = createElement(Pannello, props);
    flushSync(() => { r.render(<StrictMode>{dentro}</StrictMode>); });
  });
}
(Object.keys(FOGLI) as NomeFoglio[]).forEach(function (quale) { iscriviFoglio(quale); });

/* chiudendo il foglio, `app.ts` chiama qui: React tiene i suoi nodi in mano
   a una radice, e buttarli via senza dirglielo vuol dire che al giro dopo
   riconcilia contro nodi che non esistono più */
ganci.smontaFoglio = smontaFoglio;
