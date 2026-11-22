/* ============================================================
   LifeMax — il guscio dell'applicazione

   COS'È QUESTO FILE, adesso che le schermate le disegna React.

   Non è la vista: è il MOTORE che la vista chiama. Il router, la barra di
   navigazione, il foglio che si apre da sotto, i toast, l'avviso,
   l'onboarding, la concentrazione, il timer, la festa, la griglia della
   giornata col trascinamento, il pannello delle impostazioni, i gesti. Più
   tutti i pezzi che costruiscono il CORPO di una schermata — `vistaFocus`,
   `disegnaOrizzonte`, `disegnaSezione`, `disegnaCorpiRituali`,
   `disegnaDaFare`, `disegnaScoperte` — che i componenti React chiamano
   invece di ricopiare: così la riga che esce è la stessa riga, non una che
   le somiglia.

   COS'È SPARITO passando a React e a Vite:
     · i sette gusci `vistaXxx()` che scrivevano in `#vista` (li disegnano i
       componenti, e chiamano gli stessi pezzi di corpo);
     · i quindici corpi dei pannelli in versione stringa (idem);
     · `reactVoluto`, `caricaIsola`, `reactPer`, `foglioReact`, `cuci` e
       `window.LM_APP` — l'interruttore e la cucitura che servivano a far
       convivere due disegni della stessa schermata;
     · `window.LM_PACCO`, la tabella dei nomi dei file col loro codice
       d'impronta, che scriveva il vecchio build: adesso è un `import()` e
       il nome lo sa Vite.
   Da 9.121 righe a queste.

   PERCHÉ È ANCORA UN FILE SOLO. Dentro questo modulo tutto si vede a
   vicenda, come si vedeva dentro alla vecchia funzione che lo racchiudeva.
   Spezzarlo in venti moduli è la cosa giusta da fare dopo, ed è un lavoro
   suo: le dipendenze qui dentro sono dense e circolari — un pannello chiama
   `render`, `render` chiama un pannello — e in moduli ES quei giri vanno
   sciolti uno per uno guardando chi chiama chi a quale istante. Farlo nello
   stesso passaggio in cui si cambia motore vuol dire non sapere più quale
   delle due cose ha rotto qualcosa. Il taglio già fatto — il registro degli
   schermi — è quello che rende possibile il resto.
   ============================================================ */
import { LM } from '../dati/dati';
import type { VoceAdesso, CosaAdesso, VoceDiario, GiornoDiDiario } from '../dati/dati';
import { ICO, GOOGLE_G, LOGO } from '../segni/segni';
import { LMCharts } from '../grafici/grafici';
import { LM_FORMA } from '../forma/forma';
import { countUp, burst, flyXp, pioggiaCoriandoli } from './moto';
import { abilitaTrascina } from './trascina';
import { fmtMin, fmtOre, etichettaGiorno, oraDi } from './tempo';
import { avviaScorrimento } from './scorri';
import { illoInbox, illoFlask, illoOrbita, mascotte } from './illustrazioni';
export { illoInbox } from './illustrazioni';
export { fmtOre, etichettaGiorno } from './tempo';
import type { OpzFesta } from './moto';
export type { OpzFesta };
/* I PROMEMORIA SI IMPORTANO, E QUINDI CI SONO SEMPRE.
   Prima si leggevano da `window.LM_PROMEMORIA`, e il controllo «e se non
   c'è?» era sparso: `if (P)` in tre punti e nient'altro negli altri sei,
   dove si chiamava `P.qualcosa()` su un niente. Non succedeva mai — il
   modulo si caricava sempre — e proprio per questo il controllo mancante
   non si vedeva. Adesso è un import: o c'è, o non compila. `P` resta il
   nome corto con cui lo chiamano le trenta righe che lo usano. */
import { LM_PROMEMORIA as P } from '../promemoria/promemoria';
import type { Lab } from '../lab/lab';
import { presa } from '../tipi/presa';
import { esc as escapa, riga as pzRiga } from '../pezzi/stringhe';
import type {
  Giorno, Ora, GiornoSettimana, Stato, Area, Azione, Attivita, Abitudine,
  Lezione, Verso, Esperimento, Passo, Pasto, Timer as TimerVivo,
  Mancata, PassoDi, ImpostazioniTimer
} from '../tipi/stato';
import { giorno as comeGiorno, ora as comeOra } from '../tipi/stato';
/* solo tipi, cancellati alla compilazione: `app.ts` non importa niente da
   nessun pannello — vedi `fogli/porte.ts` */
import type { PropDiFoglio, NomeFoglio } from '../fogli/porte';

const esc = escapa;

/* ============================================================
   I TIPI DEL GUSCIO

   Non stanno in `tipi/stato.ts` perché non sono dati: nessuno di questi
   finisce in localStorage o nel cloud. Sono le forme che i pezzi di questo
   file si passano fra loro — la scena di «Adesso», un nodo della griglia
   della giornata, il piano di un ridisegno — e per tutta la vita del file
   erano oggetti letterali costruiti in un punto e letti in un altro, con i
   campi facoltativi che comparivano in un ramo su tre.
   ============================================================ */

/* IL REGISTRO DEGLI SCHERMI, tipato. `disegna` prende il contenitore invece
   di andarselo a cercare: prima ognuna delle sette viste scriveva da sé in
   `$vista`, e questo è quello che rende possibile montarne una dentro a un
   nodo qualunque — che è esattamente cosa fa una radice di React. */
export type DisegnaSchermo = (dove: HTMLElement) => void;
/* chi disegna dentro a un pannello: il contenitore, e le proprietà che
   QUEL pannello vuole — la tabella sta in `fogli/porte.ts` */
export type MontaFoglio<K extends NomeFoglio> = (dove: HTMLElement, props: PropDiFoglio[K]) => void;

/* LA SCENA DI «ADESSO»: il dentro e le classi, senza toccare la pagina. */
/* LA FASCIA ESCE DALLA SCENA, e non è una preferenza di ordine.
   `position: fixed` si aggancia al viewport SOLO se nessun antenato ha una
   `transform` — e l'animazione di cambio schermata ne mette una proprio
   sulla scena (`.vista-enter > *`, e la scena è un figlio diretto di
   `#vista`). Per i novecento millisecondi dell'animazione la fascia si
   agganciava alla SCENA invece che allo schermo: compariva a metà pagina,
   sopra la coda, e poi scattava in fondo. Da fuori si vedeva un tremolio a
   ogni cambio di schermata.
   Quindi la scena restituisce due pezzi: il dentro, e la fascia. Chi
   disegna li mette uno accanto all'altro, non uno dentro l'altro. */
export interface Scena { dentro: string; classi: string; fascia: string }

/* ------------------------------------------------------- la giornata
   UN NODO della griglia: un pasto, un'abitudine o un'azione, con l'ora in
   minuti dalla mezzanotte (`min`) e quanto dura. `min` è `null` per le cose
   senza orario, che finiscono nel vassoio invece che sulla pista. */
export interface Nodo {
  tipo: 'pasto' | 'abitudine' | 'azione';
  min: number | null;
  ora: Ora | null;
  dur: number | null;
  id?: string;
  testo?: string;
  nome?: string;
  areaId?: string;
  pastoId?: string;
  icona?: string;
  fatto?: boolean | undefined;
  done?: boolean | undefined;
  mit?: boolean | undefined;
  streak?: number | undefined;
  mancata?: Mancata | null;
  /* UN'AZIONE PUÒ NASCERE DA UN PASSO DI UN PROGETTO, e il pannello della
     giornata lo legge per dire «il passo resta nel progetto» invece di
     «rimessa in Da fare». Non lo metteva `nodiGiorno`: lo cercava su un
     oggetto che non ce l'aveva, quindi quella frase non è mai comparsa. */
  passoDi?: PassoDi | null;
}

/* IL GIORNO INTERO, come lo legge la griglia. `wake` e `sleep` sono i due
   capi dell'asse; `sonno`/`sveglia` sono invece il RESOCONTO della notte
   passata, che è un'altra cosa — vedi il commento in `nodiGiorno`. */
export interface NodiDelGiorno {
  k: Giorno;
  isToday: boolean;
  /* DUE NUMERI, NON DUE «FORSE». Sono i due capi dell'asse, e la griglia ci
     fa i conti sopra in venti punti. Vengono da `minOf(r.sveglia)` e
     `minOf(r.sonnoRoutine)`: le ore di un ritmo ci sono sempre — le mette
     `RITMO_DEFAULT` e le difende `normalizza` — quindi il `null` che `minOf`
     sa restituire, qui non arriva. Detto una volta invece di venti. */
  wake: number;
  sleep: number;
  sveglia: Ora;
  sonno: Ora;
  sonnoRoutine: Ora;
  pasti: Pasto[];
  dalRegistro: boolean;
  placed: Nodo[];
  tray: Nodo[];
}

/* un nodo con la sua colonna, quando due cose si sovrappongono */
export interface Disposto {
  e: Nodo;
  start: number;
  end: number;
  col?: number;
  ncols?: number;
}

/* LE OPZIONI DELLA GRIGLIA, tutte quelle che il file legge davvero. Erano
   dieci campi facoltativi su un oggetto senza forma, e nessuna delle cinque
   chiamate ne passava lo stesso sottoinsieme: `mini` per la settimana,
   `rail: false` per la striscia, `nowMin` per il pop-up. Chi leggeva il
   codice doveva raccoglierli a mano dalle cinque chiamate. */
export interface OpzGriglia {
  pxh?: number | undefined;
  /* la versione piccola: settimana e mese. Niente etichette, blocchi bassi. */
  mini?: boolean;
  /* la colonna delle ore a sinistra: si spegne nella striscia */
  rail?: boolean;
  senzaEtichettaSonno?: boolean;
  /* «adesso» in minuti, per la riga rossa: nel pop-up si passa a mano */
  nowMin?: number | null;
  compact?: boolean;
  controls?: boolean;
  header?: boolean;
  interactive?: boolean;
  spuntabile?: boolean;
  taglia?: string;
  giorno?: Giorno | undefined;
}

export type Orizzonte = 'giorno' | 'settimana' | 'mese' | 'anno';

/* ------------------------------------------------------- i rituali */
export interface StatoRit { fatto: boolean; testo: string; dett?: string }

/* ------------------------------------------------------- il diario
   la forma la dichiara `dati.ts`, che è dove il diario si costruisce: qui si
   usa quella, invece di una copia che le somiglia */
export type GiornoDiario = GiornoDiDiario;

/* ------------------------------------------------------- Attività */
/* UNA VOCE DI «DA FARE» come la impagina questa schermata: l'attività e il
   perché sta dove sta (`i`, da `importanzaBacklog`). Il tipo si scrive qui e
   non nei dati perché è la forma che `backlogPerImportanza` restituisce, e
   `dati.ts` la deduce da sé: qui serve un nome per passarla a `gruppo`. */
export type VocePesata = ReturnType<typeof LM.backlogPerImportanza>['ora'][number];

export interface OpzRigaAtt {
  primo?: boolean;
  motivo?: string;
  da?: string;
  senzaArea?: boolean;
  compatta?: boolean;
}

/* ------------------------------------------------- l'esito di una prova */
export interface FaseProva { n: number; media: number | null; sd: number | null }
export interface EsitoProva {
  punti: { data: Giorno; valore: number | null; fase: 'A' | 'B' }[];
  baseline: FaseProva;
  intervento: FaseProva;
  effetto: number | null;
}


/* «PRECISO» O «CIRCA», e sono due: è quello che risponde
   `precisioneValida()` nei dati, e la stessa parola che finisce in
   `RegistroGiorno.prec`. */
type Precisione = 'preciso' | 'circa';

/* ---------------------------------------------------- i promemoria
   le cinque voci hanno un nome, e sono cinque: la stessa cosa che dice
   `src/promemoria/promemoria.ts`, e per la stessa ragione */
type VoceProm = 'mattina' | 'checkin' | 'mit' | 'sera' | 'abitudini';

/* COSA RISPONDE IL WORKER. Una forma sola per due porte — `/salute` e
   `/prova` — perché `spiegaProva` le legge insieme: la salute dice se il
   Worker ha le chiavi, la prova dice cosa ne ha fatto il servizio push, e
   la diagnosi utile nasce dal confronto fra le due. Tutto opzionale: sono
   campi che il Worker aggiunge quando li ha (vedi `postino/worker.js`).
   `stato` e `detto` sono il numero e il testo che ha risposto il servizio
   push; `dove` compare solo quando il Worker non è nemmeno arrivato a
   parlargli, e allora vale `'firma'`. */
interface RispostaProva {
  ok?: boolean;
  vapid?: boolean;
  pubblica?: string;
  soggetto?: string;
  iscritti?: number;
  errore?: string;
  stato?: number;
  detto?: string;
  dove?: 'firma';
}

/* ============================================================
   LO STATO DI VISTA

   Nove cose che non sono né dati né DOM: quale linguetta è aperta, quale
   giorno si sta sfogliando, cosa c'è scritto nel modulo a metà. Non
   finiscono in localStorage e non passano dal cloud — ricaricando la pagina
   tornano così — ma devono sopravvivere a un ridisegno, perché la pagina si
   ridisegna da sé quando arriva la risposta dell'account o un aggiornamento
   dal cloud, e ritrovarsi riportati su un'altra sezione senza aver toccato
   niente è peggio del problema che quella sezione risolve.

   STANNO IN UN OGGETTO SOLO, e la ragione è il nuovo motore. Prima erano
   `var` dentro alla funzione che racchiudeva tutto, e i componenti React ci
   scrivevano dentro passando per `window.LM_APP`. In moduli ES un nome
   importato è di sola lettura: `import { schermo.sezPlancia }` non si può assegnare.
   Un campo di un oggetto esportato sì — `schermo.sezPlancia = 'diario'`
   funziona da qualunque modulo, ed è lo stesso oggetto per tutti. Così la
   scrittura da fuori resta possibile senza rimettere in piedi una finestra
   globale.
   ============================================================ */

/* la schermata Attività: quale linguetta, quale filtro, la ricerca, e quali
   dei due gruppi a scomparsa sono aperti. `attTabMostrata` non c'è più —
   serviva ad animare solo al cambio di linguetta, e la linguetta adesso la
   tiene il componente, che sa da sé quando cambia. */
export interface StatoAttivita {
  tab: 'sistemare' | 'dafare' | 'abitudini' | null;
  area: string;   /* 'tutte' | 'data' | 'progetti' | id di un'area */
  query: string;
  tutteAperte: boolean;
  parcheggioAperto: boolean;
}

/* IL MODULO DEL NUOVO ESPERIMENTO mentre è aperto, con quello che c'è
   scritto dentro. `lez` è la riga imparata da cui è partito, quando è
   partito da lì. Tutti stringhe perché vengono da campi di testo e tendine:
   diventano date e numeri solo quando si preme Avvia. */
export interface ModuloEsperimento {
  nome: string;
  int: string;
  area: string;
  metrica: string;
  durata: string;
  lez: string | null;
}

export interface StatoSchermo {
  att: StatoAttivita;
  /* «La giornata»: il giorno di riferimento, oggi finché non si sfoglia.
     Era `null` fino al primo disegno, e i venti punti che lo leggono
     dovevano difendersi da un caso che dura un istante e non si vede mai. */
  giornataAncora: Giorno;
  /* «La giornata»: su quale scala di tempo si guarda */
  giornataOrizzonte: Orizzonte;
  /* Panoramica e Scoperte: quale sezione si guarda */
  sezPlancia: string;
  sezScoperte: string;
  /* Rituali: quali blocchi sono aperti — ognuno per conto suo, aprirne uno
     non chiude gli altri — e quale aprire arrivandoci da un collegamento
     («vai alle abitudini» da Oggi), che si consuma al primo disegno. */
  ritualiAperti: Record<string, boolean> | null;
  sottoRituale: string | null;
  /* Scoperte → esperimenti: la riga imparata da provare al prossimo
     disegno, e il modulo aperto con quello che c'è scritto dentro */
  lezDaProvare: Lezione | null;
  formExp: ModuloEsperimento | null;
  /* la diagnostica: solo i problemi, o tutto */
  logSoloProblemi: boolean;
}

export const schermo: StatoSchermo = {
  att: { tab: null, area: 'tutte', query: '', tutteAperte: false, parcheggioAperto: false },
  giornataAncora: LM.todayKey(),
  giornataOrizzonte: 'giorno',
  sezPlancia: 'riepilogo',
  sezScoperte: 'registro',
  ritualiAperti: null,
  sottoRituale: null,
  lezDaProvare: null,
  formExp: null,
  logSoloProblemi: false
};

/* ------------------------------------------------------------ PRENDERE UN NODO
   Due modi, e la differenza è tutta.

   `perId` è per i venti nodi che stanno nella pagina da sempre — `#vista`, il
   foglio, la barra, la zona dei toast: sono scritti in `index.html` e non se
   ne va nessuno. Là dentro un controllo sul niente non protegge da niente: se
   `#vista` non c'è, l'app non c'è, e conviene saperlo subito e forte.

   Per tutto il resto — un nodo che una schermata ha appena disegnato e che
   fra un giro e l'altro può non esserci — resta `document.getElementById`, e
   il controllo si scrive: quello è il caso in cui manca davvero, e in questo
   file capita spesso (una schermata cambia mentre un timer sta girando).  */
function perId<T extends HTMLElement = HTMLElement>(id: string): T {
  return presa(document.getElementById(id)) as T;
}

/* E UN CAMPO, che non è un elemento qualunque.
   `querySelector` torna un `HTMLElement`, e `value` non sta lì: sta su
   `HTMLInputElement`. Qui dentro un selettore come `'#prom-server'` è un
   campo per costruzione — l'HTML lo abbiamo scritto noi tre righe sopra — e
   scrivere il tipo esatto in venti punti sarebbe venti volte la stessa
   informazione. Queste due funzioni la dicono una volta.  */
function campo(dove: ParentNode, sel: string): HTMLInputElement {
  return presa(dove.querySelector<HTMLInputElement>(sel));
}
function campoSe(dove: ParentNode, sel: string): HTMLInputElement | null {
  return dove.querySelector<HTMLInputElement>(sel);
}
function campoId(id: string): HTMLInputElement | null {
  return document.getElementById(id) as HTMLInputElement | null;
}

const $vista = perId('vista');


/* ---------- tema & skin ---------- */

export function applicaTema(): void {
  const s = LM.load();
  const modo = s.profilo.modo || 'auto';
  const scuroOS = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const scuro = modo === 'dark' || (modo === 'auto' && scuroOS);
  document.documentElement.setAttribute('data-mode', scuro ? 'dark' : 'light');
  document.documentElement.setAttribute('data-skin', s.profilo.skin || 'quiete');
  /* gli effetti viaggiano con il tema: sono tutti e due «come si vede»,
     e tutti e due devono valere dal primo disegno, non dal secondo */
  var eff = s.profilo.effetti || 'pieni';
  if (eff === 'pieni') document.documentElement.removeAttribute('data-effetti');
  else document.documentElement.setAttribute('data-effetti', eff);
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
  applicaTema(); render();
});

function setModo(m: Stato['profilo']['modo']): void {
  const s = LM.load();
  s.profilo.modo = m;
  LM.registra('impostazioni', 'Tema impostato su ' + (m === 'auto' ? 'automatico' : m === 'dark' ? 'scuro' : 'chiaro'), false);
  LM.save(); applicaTema(); render();
}
function setSkin(sk: Stato['profilo']['skin']): void {
  const s = LM.load();
  s.profilo.skin = sk;
  LM.registra('impostazioni', 'Aspetto impostato su ' + (sk === 'arcade' ? 'Arcade' : 'Aurora'), false);
  LM.save(); applicaTema(); render();
}
/* La barra a tre porte si può spegnere: chi la vuole com'era prima
   ritrova le otto voci, e nessuna schermata sparisce in nessuno dei due
   casi — cambia solo da dove ci si arriva. */
function setNav(v: NonNullable<Stato['profilo']['nav']>): void {
  const s = LM.load();
  if ((s.profilo.nav || 'tre') === v) return;
  s.profilo.nav = v;
  LM.registra('impostazioni', 'Navigazione impostata su ' + (v === 'tutte' ? 'tutte le pagine' : 'tre porte'), false);
  LM.save(); render();
}
/* Lo sfoglio di lato si puo' spegnere. Un gesto che si scopre per sbaglio
   e non si puo' togliere e' una trappola: chi lo trova fastidioso deve
   poterlo chiudere senza cercare, non imparare a tenere il dito dritto. */
/* Gli effetti: uno strumento di misura, non una preferenza di gusto. Vedi
   il commento lungo in app.css. Cambiandoli va rifatta la forma di tutto,
   perché «minimi» toglie i ritagli e «pieni» li rimette. */
function setEffetti(v: Stato['profilo']['effetti']): void {
  const s = LM.load();
  if ((s.profilo.effetti || 'pieni') === v) return;
  s.profilo.effetti = v;
  LM.registra('impostazioni', 'Effetti impostati su ' + v, false);
  LM.save();
  applicaTema();
  /* «minimi» toglie i ritagli e «pieni» li rimette: la forma va rifatta da
     capo, se no restano quelli di prima finché non si ricarica */
  LM_FORMA.scorda();
  render();
}
/* LA FORMA DI «ADESSO». Le altre voci di «Aspetto» cambiano come si vede
   l'app; questa cambia COSA C'È SULLA SCHERMATA, e per questo non basta
   ridisegnare: `spina` e `poi` mettono in pagina anche la coda di oggi,
   che la scheda non nomina. Un `render()` basta lo stesso — la scena si
   ricostruisce da capo a ogni giro — ma la barra d'azione di `spina` e
   `poi` vive FUORI dalla scena, appoggiata in fondo allo schermo, e quella
   va tolta a mano quando si torna a `scheda`: se no resta lì, sopra una
   schermata che ha già i suoi tasti, e sono due. */
function setForma(v: NonNullable<Stato['profilo']['forma']>): void {
  const s = LM.load();
  if ((s.profilo.forma || 'poi') === v) return;
  s.profilo.forma = v;
  LM.registra('impostazioni', 'Schermata «Adesso» impostata su ' + v, false);
  LM.save();
  const vecchia = document.querySelector('.fuoco-fascia');
  if (vecchia) vecchia.remove();
  render();
}
function setScorri(v: Stato['profilo']['scorri']): void {
  const s = LM.load();
  if ((s.profilo.scorri || 'si') === v) return;
  s.profilo.scorri = v;
  LM.registra('impostazioni', 'Scorrimento fra le schermate ' + (v === 'no' ? 'spento' : 'acceso'), false);
  LM.save(); render();
}
export function caricaDemo(): void {
  /* con l'account collegato l'esempio prenderebbe il posto dei dati veri
     anche nel cloud: si carica solo staccati */
  if (window.LM_AUTH && window.LM_AUTH.user) {
    avviso({ titolo: 'Sei connesso', testo: 'Esci dall’account per caricare i dati di esempio.', azione: 'OK' });
    return;
  }
  avviso({
    titolo: 'Sostituire i dati con quelli di esempio?',
    testo: 'I dati attuali verranno sostituiti da otto settimane di esempio. Ne resta una copia in Backup e ripristino.',
    azione: 'Carica l’esempio'
  }, function () {
    LM.seedDemo(); applicaTema(); chiudiSheet(); render();
    toast('Dati di esempio caricati.', 0, 'sparkles');
  });
}
export function azzeraTutto(): void {
  avviso({
    titolo: 'Cancellare tutti i dati?',
    testo: window.LM_AUTH && window.LM_AUTH.user
      ? 'Sei collegato: si cancellano anche dall’account, su tutti i tuoi dispositivi. Prima ne resta una copia in «Backup e ripristino»: ripristinandola torna tutto, anche sugli altri dispositivi. Se volevi togliere solo i dati di esempio, usa «Togli i dati di esempio».'
      : 'Riparti da zero, su questo dispositivo. Se volevi togliere solo i dati di esempio, usa «Togli i dati di esempio».',
    azione: 'Cancella tutto', pericolo: true
  }, function () {
    LM.reset(!!(window.LM_AUTH && window.LM_AUTH.user)); chiudiSheet(); location.hash = '#/oggi'; render();
  });
}

/* ---------- campi di testo ----------
   Su un telefono la tastiera cambia a seconda di cosa le si dice: il
   tasto Invio diventa «fine» invece di «vai a capo», la prima lettera si
   scrive maiuscola, il correttore si accende. Sono attributi, non
   comportamenti: metterli a mano su ogni campo significa dimenticarne
   metà, quindi li mette una volta sola chi guarda il DOM. */
function preparaCampi(radice: HTMLElement | null): void {
  if (!radice || !radice.querySelectorAll) return;
  const campi: HTMLElement[] = Array.prototype.slice.call(
    radice.querySelectorAll<HTMLElement>('input[type="text"], input:not([type]), textarea')
  ) as HTMLElement[];
  if (radice.matches && radice.matches('input, textarea')) campi.push(radice);
  campi.forEach(function (c) {
    const area = c.tagName === 'TEXTAREA';
    if (!c.hasAttribute('enterkeyhint')) c.setAttribute('enterkeyhint', area ? 'enter' : 'done');
    if (!c.hasAttribute('autocapitalize')) c.setAttribute('autocapitalize', 'sentences');
    if (!c.hasAttribute('autocorrect')) c.setAttribute('autocorrect', 'on');
  });
}
/* Le file di linguette si distinguono a occhio dal fondo bianco, ma per chi
   usa VoiceOver quella differenza non esiste: senza aria-pressed sono tre
   pulsanti identici e non si sa quale sia aperto. La classe .attivo è già
   l'unica convenzione in tutta l'app, quindi si traduce da sola. */
function marcaSegmenti(radice: ParentNode | null): void {
  if (!radice || !radice.querySelectorAll) return;
  radice.querySelectorAll<HTMLElement>('.segmenti button').forEach(function (b) {
    b.setAttribute('aria-pressed', b.classList.contains('attivo') ? 'true' : 'false');
  });
}
/* LA PASTIGLIA ACCESA SI SPOSTA DA SÉ.
   Un segmento dice due cose insieme: fa una cosa, e dice quale delle sue
   scelte è quella in vigore. La seconda si scriveva a mano, ogni volta, in
   ogni punto dell'app che disegna un segmento — e dove non era scritta non
   succedeva. Su «Tema» (Auto · Chiaro · Scuro) e su «Aspetto» il colore del
   sito cambiava davvero e la pastiglia accesa restava su quella di prima:
   hai toccato «Scuro», il sito diventa scuro, e il comando continua a dirti
   che sei su «Chiaro». Chi guarda non pensa «manca un aggiornamento»: pensa
   di aver toccato male, e tocca di nuovo.
   Toccare una scelta È sceglierla, dappertutto e senza eccezioni, quindi la
   regola sta in un posto solo. In fase di CATTURA, così chi ridisegna la
   schermata subito dopo (la maggior parte dei casi) vince comunque: l'ultima
   parola resta a chi conosce lo stato vero. */
document.addEventListener('click', function (ev) {
  const bersaglio = ev.target as HTMLElement | null;
  const b = bersaglio && bersaglio.closest
    ? bersaglio.closest<HTMLElement>('.segmenti > button, .segmenti > a')
    : null;
  if (!b || (b as HTMLButtonElement).disabled) return;
  const fila = b.parentElement;
  if (!fila) return;
  Array.prototype.slice.call(fila.children).forEach(function (o: Element) { o.classList.toggle('attivo', o === b); });
  marcaSegmenti(fila);
}, true);
if (window.MutationObserver) {
  const osservatore = new MutationObserver(function (mut) {
    let tocca = false;
    mut.forEach(function (m) {
      if (m.type === 'attributes') { tocca = true; return; }
      m.addedNodes.forEach(function (n) {
        if (n.nodeType === 1) { preparaCampi(n as HTMLElement); tocca = true; }
      });
    });
    if (tocca) marcaSegmenti(document);
  });
  ['vista', 'sheet-corpo', 'onboarding-root'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) osservatore.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  });
}

/* ---------- avvisi ----------
   Le domande importanti le fa l'app, non il browser. Un confirm() di
   sistema arriva senza titolo, con i pulsanti «OK/Annulla» che non dicono
   cosa stanno per fare, e su iPhone si presenta come un avviso del sito.
   Le linee guida Apple (Alerts) chiedono l'opposto: un titolo che è la
   domanda, una riga che spiega la conseguenza, e pulsanti che nominano
   l'azione — con quella distruttiva in rosso. */
/* la domanda che sta aperta adesso: una sola, e chi ne fa una seconda mentre
   la prima è lì riceve un «no» invece di sovrapporsi */
let avvisoAperto: HTMLElement | null = null;

/* LE PAROLE DI UNA DOMANDA. `azione` e `annulla` nominano quello che fa il
   tasto — «Carica l'esempio», non «OK» — ed è il motivo per cui questa
   funzione esiste invece di `confirm()`. */
export interface OpzAvviso {
  titolo: string;
  testo?: string;
  azione?: string;
  annulla?: string;
  pericolo?: boolean;
}

/* `onNo` serve quando le due strade sono due SCELTE e non «fai» / «lascia
   stare»: chi chiude senza rispondere sta comunque dicendo qualcosa, e chi
   ha fatto la domanda deve poter andare avanti. */
/* UN TOCCO APRE IL CALENDARIO O L'OROLOGIO. Un campo data o ora, toccato
   fuori dalla sua iconcina (che qui non si vede), su un computer prendeva
   solo il fuoco: bisognava toccare di nuovo, e un campo nascosto steso su una
   riga (la scadenza) non si apriva proprio. Qui si chiede al browser di
   aprire il selettore subito, ovunque nell'app. */
/* il titolo della scheda si separa dal contenuto appena questo scorre */
document.addEventListener('scroll', function (e) {
  const c = e.target;
  if (!(c instanceof HTMLElement) || !c.classList.contains('sheet-corpo')) return;
  const sh = c.closest('.sheet');
  if (sh) sh.classList.toggle('scorso', c.scrollTop > 2);
}, true);
/* APRIRE IL CALENDARIO O L'OROLOGIO, OVUNQUE, CON UN TOCCO SOLO.
   Tre casi, e un'unica richiesta per tocco (due — il tocco nativo più una
   nostra — sul telefono si annullano: la ruota si apriva e si richiudeva).
   1. Il dito sul campo stesso: sul telefono ci pensa il sistema; col mouse
      un clic sul testo della data non apre niente, quindi lo apriamo noi.
   2. Il dito su una riga che porta un campo nascosto (`data-apri-campo`:
      la scadenza, «un altro giorno»): il campo non sta più steso sopra la
      riga — non la copriva tutta, e toccando «nessuna» non succedeva
      niente — e lo apriamo noi.
   3. Il dito sull'etichetta di un campo data/ora (le righe delle schede):
      si ferma l'attivazione dell'etichetta e lo apriamo noi, una volta. */
const CAMPO_DATA = 'input[type="date"], input[type="time"], input[type="datetime-local"], input[type="month"], input[type="week"]';
export function apriCampo(inp: HTMLInputElement): void {
  if (inp.disabled || inp.readOnly) return;
  const conPicker = inp as HTMLInputElement & { showPicker?: () => void };
  try {
    if (typeof conPicker.showPicker === 'function') { conPicker.showPicker(); return; }
  } catch (_e) { /* il browser non vuole: si prova a mano */ }
  try { inp.focus(); inp.click(); } catch (_e) { /* niente */ }
}
document.addEventListener('click', function (e) {
  const t = e.target;
  if (!(t instanceof Element)) return;
  if (t instanceof HTMLInputElement) {
    if (!t.matches(CAMPO_DATA) || t.disabled || t.readOnly) return;
    /* solo col puntatore fine: sul telefono il tocco l'ha già aperto */
    if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;
    if (!e.isTrusted) return;
    const conPicker = t as HTMLInputElement & { showPicker?: () => void };
    try { if (typeof conPicker.showPicker === 'function') conPicker.showPicker(); } catch (_e) { /* già aperto */ }
    return;
  }
  /* un comando dentro la riga (la «x» che toglie) fa il suo mestiere */
  if (t.closest('button, a, select, textarea, input')) return;
  const host = t.closest<HTMLElement>('[data-apri-campo], label');
  if (!host) return;
  let inp: HTMLInputElement | null = host.querySelector<HTMLInputElement>(CAMPO_DATA);
  if (!inp && host instanceof HTMLLabelElement && host.htmlFor) {
    const x = document.getElementById(host.htmlFor);
    if (x instanceof HTMLInputElement && x.matches(CAMPO_DATA)) inp = x;
  }
  if (!inp) return;
  e.preventDefault();
  apriCampo(inp);
}, true);

/* quando l'accesso con Google non riesce, lo si dice con le parole giuste */
document.addEventListener('lm:accesso-fallito', function (e) {
  const d = (e as CustomEvent<{ titolo: string; testo: string }>).detail;
  if (d) avviso({ titolo: d.titolo, testo: d.testo, azione: 'OK' });
});
export function avviso(opz: OpzAvviso, onSi?: () => void, onNo?: () => void): void {
  if (avvisoAperto) { if (onNo) onNo(); return; }
  const ovl = document.createElement('div');
  ovl.className = 'avviso-ovl';
  ovl.innerHTML = '<div class="avviso" role="alertdialog" aria-modal="true" aria-labelledby="avv-tit"' +
    (opz.testo ? ' aria-describedby="avv-txt"' : '') + ' tabindex="-1">' +
    '<h2 id="avv-tit">' + esc(opz.titolo) + '</h2>' +
    (opz.testo ? '<p id="avv-txt">' + esc(opz.testo) + '</p>' : '') +
    '<div class="avviso-azioni">' +
    '<button class="btn btn-grande avv-no">' + esc(opz.annulla || 'Annulla') + '</button>' +
    '<button class="btn btn-grande ' + (opz.pericolo ? 'btn-pericolo' : 'btn-primario') + ' avv-si">' + esc(opz.azione || 'Continua') + '</button>' +
    '</div></div>';
  document.body.appendChild(ovl);
  avvisoAperto = ovl;
  const pannello = presa(ovl.querySelector<HTMLElement>('.avviso'));
  /* se l'avviso arriva sopra un pannello, anche quello diventa inerte */
  const sottostante = $sheet.hidden ? null : $sheet;
  if (sottostante) sottostante.setAttribute('inert', '');
  bloccaSfondo(true);
  entraFuoco(pannello);
  let risposto = false;
  function chiudi(conSi?: boolean) {
    if (!avvisoAperto) return;
    avvisoAperto = null;
    ovl.remove();
    if (!conSi && !risposto && onNo) { risposto = true; onNo(); }
    if (sottostante) sottostante.removeAttribute('inert');
    bloccaSfondo(false);
    esceFuoco();
    verificaModalita();
  }
  presa(ovl.querySelector<HTMLElement>('.avv-no')).addEventListener('click', function () { chiudi(false); });
  presa(ovl.querySelector<HTMLElement>('.avv-si')).addEventListener('click', function () {
    risposto = true; chiudi(true); if (onSi) onSi();
  });
  /* fuori dall'avviso e Esc = annulla: la via d'uscita non deve mai mancare */
  let giuDentro = false;
  ovl.addEventListener('pointerdown', function (e) { giuDentro = e.target !== ovl; }, true);
  ovl.addEventListener('click', function (e) {
    const d = giuDentro; giuDentro = false;
    if (e.target === ovl && !d) chiudi();
  });
  ovl.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); chiudi(); } });
  /* la funzione ha un nome perché si stacca da sé: si chiama `viaEsc` e non
     `esc`, che in questo file è la fuga dell'HTML e la copriva */
  document.addEventListener('keydown', function viaEsc(e) {
    if (e.key === 'Escape' && avvisoAperto === ovl) { chiudi(); document.removeEventListener('keydown', viaEsc); }
    if (!avvisoAperto) document.removeEventListener('keydown', viaEsc);
  });
}

/* ---------- toast ---------- */

/* un toast con un tasto: «Annulla», e cosa fare se lo si tocca */
export interface AzioneToast { eti: string; fai: () => void }
export function toast(testo: string, xp?: number, icona?: string, azione?: AzioneToast): void {
  const zona = perId('toast-zona');
  const t = document.createElement('div');
  t.className = 'toast' + (azione ? ' toast-lungo' : '');
  t.innerHTML = (icona ? ICO(icona, 15) : ICO('check', 15)) + '<span>' + esc(testo) + '</span>' +
    (xp ? ' <span class="xp">+' + xp + ' XP</span>' : '') +
    (azione ? '<button class="toast-azione">' + esc(azione.eti) + '</button>' : '');
  zona.appendChild(t);
  let ty0 = -1, tdy = 0;
  t.addEventListener('touchstart', function (e) { const p = e.touches[0]; ty0 = p ? p.clientY : -1; tdy = 0; t.style.transition = 'none'; }, { passive: true });
  t.addEventListener('touchmove', function (e) {
    const p = e.touches[0]; if (!p || ty0 < 0) return;
    tdy = Math.min(0, p.clientY - ty0);
    if (e.cancelable) e.preventDefault();
    t.style.transform = 'translateY(' + tdy + 'px)'; t.style.opacity = String(Math.max(0, 1 + tdy / 80));
  }, { passive: false });
  t.addEventListener('touchend', function () {
    ty0 = -1; t.style.transition = '';
    if (tdy < -24) t.remove(); else { t.style.transform = ''; t.style.opacity = ''; }
  });
  if (azione) {
    const tasto = t.querySelector<HTMLElement>('.toast-azione');
    if (tasto) tasto.addEventListener('click', function () { t.remove(); azione.fai(); });
  }
  setTimeout(function () { t.remove(); }, azione ? 7000 : 3000);
}

/* Le linee guida Apple preferiscono l'annulla alla domanda: chiedere
   conferma ogni volta trasforma un gesto in una pratica, e chi la vede
   dieci volte al giorno smette di leggerla. Quindi le cancellazioni
   piccole si fanno subito, e per qualche secondo si possono rimettere a
   posto. Restano dietro un avviso solo quelle che portano via tutto. */
export function conAnnulla(testo: string, icona: string, fai: () => void): void {
  const prima = JSON.parse(JSON.stringify(LM.load())) as Stato;
  fai();
  toast(testo, 0, icona, { eti: 'Annulla', fai: function () {
    LM.ripristinaStato(prima);
    render();
    toast('Ripristinato.', 0, 'annulla');
  } });
}

/* feedback per una spunta: XP che volano + toast quando si completa;
   avviso «spunta tolta» (con gli XP restituiti) quando si annulla per errore */
export function feedbackSpunta(ev: { currentTarget: EventTarget | null }, xp: number, doneMsg: string, icona?: string): void {
  if (xp > 0) {
    const dove = ev.currentTarget as HTMLElement | null;
    if (!dove) return;
    const r = dove.getBoundingClientRect();
    flyXp(r.left + r.width / 2, r.top, xp);
    /* lo scoppio attorno al dito, non la pioggia: spuntare una riga in un
       elenco è un gesto piccolo, e una festa grande su un gesto piccolo la
       svaluta per quando servirà davvero */
    festeggia('leggero', r.left + r.width / 2, r.top + r.height / 2);
    toast(doneMsg, xp, icona);
  } else if (xp < 0) {
    toast('Spunta tolta (' + xp + ' XP)', 0, 'annulla');
  }
}

/* ---------- cattura istantanea ---------- */

const $ovl = perId('overlay-cattura');
const $inp = perId<HTMLInputElement>('input-cattura');
perId('corpo-cattura').insertAdjacentHTML('afterbegin', ICO('bolt', 18));

function apriCattura(): void {
  /* se era già aperto non si entra una seconda volta nella modalità:
     si entrerebbe due volte e si uscirebbe una sola, e la pila resterebbe
     con dentro un livello che non se ne va più */
  var giaAperto = !$ovl.hidden;
  $ovl.hidden = false;
  document.body.classList.add('cattura-su');
  bloccaSfondo(true);
  $inp.value = '';
  aggiornaSalvaCattura();
  if (giaAperto) $inp.focus();
  else entraFuoco(presa($ovl.querySelector<HTMLElement>('.pannello-cattura')), true);
}
function chiudiCattura(): void { $ovl.hidden = true; document.body.classList.remove('cattura-su'); bloccaSfondo(false); esceFuoco(); verificaModalita(); }

const $sideCatt = perId('side-cattura');
presa($sideCatt.querySelector<HTMLElement>('.cattura-cta-testo')).innerHTML = ICO('bolt', 15) + ' Aggiungi una nota';
$sideCatt.addEventListener('click', apriCattura);
let giuDentroCatt = false;
$ovl.addEventListener('pointerdown', function (e) { giuDentroCatt = e.target !== $ovl; }, true);
$ovl.addEventListener('click', function (e) {
  var dentro = giuDentroCatt; giuDentroCatt = false;
  if (e.target === $ovl && !dentro) chiudiCattura();
});
/* col dito non c'era NESSUNA via d'uscita visibile: toccare fuori funziona
   ma non si vede, e la nota che parlava di «Esc» era per la tastiera */
perId('cattura-chiudi').addEventListener('click', chiudiCattura);
function salvaCattura(): void {
  const t = $inp.value.trim();
  if (!t) return;
  const xp = LM.cattura(t);
  toast('Salvato.', xp, 'inbox');
  chiudiCattura();
  aggiornaNav(); render();
}
$inp.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') salvaCattura();
  if (e.key === 'Escape') chiudiCattura();
});
perId('cattura-salva').addEventListener('click', salvaCattura);
/* «Salva» con niente da salvare non si può premere */
function aggiornaSalvaCattura(): void { (perId('cattura-salva') as HTMLButtonElement).disabled = !$inp.value.trim(); }
$inp.addEventListener('input', aggiornaSalvaCattura);

document.addEventListener('keydown', function (e) {
  const digitando = /input|textarea|select/i.test((document.activeElement && document.activeElement.tagName) || '');
  if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); apriCattura(); return; }
  if (digitando) return;
  if (e.key === 'c' || e.key === 'C') { e.preventDefault(); apriCattura(); }
  if (e.key === 'Escape' && !$ovl.hidden) chiudiCattura();
});

/* ---------- pannello (sheet) ---------- */

const $sheet = perId('sheet-overlay');
perId('sheet-chiudi').innerHTML = ICO('x', 18);
perId('sheet-chiudi').addEventListener('click', chiudiSheet);
perId('sheet-indietro').addEventListener('click', tornaIndietroSheet);
/* la maniglia è il comando di chiusura col dito: si trascina giù, e se la
   si tocca chiude. Non è una decorazione accanto a una x. */
perId('sheet-maniglia').addEventListener('click', chiudiSheet);
/* Toccare fuori chiude — ma solo se il tocco è NATO fuori. Premendo dentro
   al foglio e rilasciando oltre il suo bordo (il dito che scivola via da un
   pulsante, il mouse trascinato) il clic arriva all'antenato comune, cioè
   all'overlay, e il foglio si chiudeva da solo: hai cambiato idea su un
   pulsante e ti sei ritrovato senza pannello. */
/* Si ricorda solo il caso che va impedito — «il tocco è nato DENTRO» — e in
   tutti gli altri si chiude. Al contrario (ricordare «è nato fuori») un clic
   senza un pointerdown davanti, come quello che manda una tecnologia
   assistiva o una prova automatica, non avrebbe chiuso niente. */
let giuDentroSheet = false;
/* quando un campo del foglio ha appena avuto il fuoco o cambiato valore:
   chiudendosi, il selettore dell'ora di Android manda un clic che può
   cadere sul velo, e il foglio si richiudeva appena scelto l'orario */
let campoToccato = 0;
$sheet.addEventListener('pointerdown', function (e) { giuDentroSheet = e.target !== $sheet; }, true);
['focusin', 'change', 'input'].forEach(function (ev) {
  $sheet.addEventListener(ev, function (e) {
    const t = e.target as HTMLElement | null;
    if (t && /^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName)) campoToccato = Date.now();
  }, true);
});
$sheet.addEventListener('click', function (e) {
  var dentro = giuDentroSheet; giuDentroSheet = false;
  if (Date.now() - campoToccato < 1200) return;
  if (e.target === $sheet && !dentro) chiudiSheet();
});

let wireSheet: ((root: HTMLElement) => void) | null = null;
const $sheetPanel = $sheet.querySelector<HTMLElement>('.sheet');
/* CHI SCORRE dentro il pannello. Non è più il pannello: il pannello sta
   fermo (testata e maniglia comprese) e scorre il suo corpo. Chi ha
   bisogno della posizione dello scorrimento — il gesto per chiudere, e il
   ritorno in cima quando il pannello cambia contenuto — deve chiederla a
   lui, se no legge sempre zero e il gesto parte anche a metà pagina. */
const $sheetScorre = $sheet.querySelector<HTMLElement>('.sheet-corpo');
/* Anima l'ingresso UNA volta e poi toglie la classe: se restasse attaccata,
   ogni elemento ricreato dopo (una spunta, un filtro) ripartirebbe con la
   stessa animazione e sembrerebbe un refresh continuo. */
/* Cambiare PAGINA e cambiare SEZIONE non sono la stessa cosa, e non devono
   avere la stessa animazione. Le tre sezioni di «Oggi» (Adesso, La giornata,
   Rituali) sono tre indirizzi diversi, quindi ogni passaggio finiva in
   «cambio pagina»: si rialzava tutto a scaglioni, titolo compreso, e anche
   la riga di linguette che avevi appena toccato — quella spariva e tornava
   sotto il dito. Settecentocinquanta millisecondi in cui si muove ogni
   cosa: da fuori è una ricarica. Nelle altre pagine (Attività, Andamento)
   si anima solo il corpo e l'intestazione sta ferma. Ora fanno tutte così:
   `sezione` lascia in pace il titolo e le linguette. */
/* Scrive solo se il contenuto è davvero cambiato. La colonna a sinistra, la
   barra in basso e il fondo della colonna venivano ricostruiti a OGNI
   ridisegno — cioè anche quando spunti una cosa, e la barra in basso è
   sempre in vista: la pastiglia col numero si buttava via e si rifaceva per
   tornare identica. Confrontare due stringhe costa niente rispetto a
   distruggere e ricreare trenta elementi. */
/* DUE COSE APPESE A UN NODO, e stanno qui perché è dove si usano.
   `__ultimoHtml` è l'HTML che ci abbiamo scritto NOI l'ultima volta;
   `__timerAnim` è la clessidra che toglie la classe dell'animazione. Sono
   proprietà nostre su un elemento del DOM: senza dichiararle il compilatore
   ha ragione a dire che non esistono. */
interface NodoConMemoria extends HTMLElement {
  __ultimoHtml?: string;
  __timerAnim?: ReturnType<typeof setTimeout>;
}

function scriviSe(el: HTMLElement | null, html: string): boolean {
  if (!el) return false;
  const n = el as NodoConMemoria;
  /* Il confronto è con la stringa che abbiamo scritto NOI, non con
     `innerHTML` riletto: il browser aggiunge `xmlns` a ogni <svg> quando
     serializza, e in quest'app di icone ce n'è in ogni riga. Rileggendo, la
     barra in basso tornava 66 caratteri più lunga di com'era stata scritta,
     il confronto non era mai vero e il guard non serviva a niente. */
  if (n.__ultimoHtml === html) return false;
  n.innerHTML = html;
  n.__ultimoHtml = html;
  return true;
}

/* RIPARTIRE SENZA RIFARE I CONTI DELL'IMPAGINAZIONE.
   Per far ripartire un'animazione CSS il modo che si trova scritto ovunque
   è togliere la classe, leggere `offsetWidth` per costringere il browser a
   prendere atto, e rimetterla. Quella lettura però rifà l'impaginazione di
   tutto quello che c'è dentro — e capita nell'istante peggiore, subito dopo
   che la pagina è stata riscritta da capo: col profilatore era la voce più
   cara di un cambio di schermata, 107 ms su dodici cambi.
   `getAnimations()` fa la stessa cosa senza impaginare: annulla quelle che
   stanno girando, e la classe rimessa ne fa partire una nuova. */
let girata = 0;
export function animaIngresso(el: HTMLElement | null, sezione?: boolean, verso?: number): void {
  if (!el) return;
  const n = el as NodoConMemoria;
  const dove = verso || 0;
  /* DI LATO, SE DI LATO SI E' ANDATI.
     Cambiando sezione ogni figlio della pagina saliva da sedici pixel piu'
     in basso sfumando, uno dopo l'altro, per mezzo secondo buono. Salire
     sfumando e' il movimento di «e' arrivata una pagina nuova», ed e'
     esattamente quello che si sentiva scorrendo di lato: sembrava che il
     sito si ricaricasse da capo invece di essersi spostato di una casella.
     Le sezioni di una pagina stanno UNA ACCANTO ALL'ALTRA — la riga di
     linguette lo dice — quindi il movimento che le lega e' orizzontale, e
     va nel verso in cui ci si e' spostati. Vale anche toccando la linguetta,
     non solo sfogliando: il modello dello spazio e' lo stesso comunque ci
     si arrivi.
     E' anche molto meno lavoro: una animazione sola sul contenitore invece
     di una per ogni figlio, e la sola `transform` che la scheda grafica sa
     fare da sé. */
  const cls = sezione ? (dove > 0 ? 'sez-enter-dx' : (dove < 0 ? 'sez-enter-sx' : 'sez-enter')) : 'vista-enter';
  el.classList.remove('sez-enter-dx');
  el.classList.remove('sez-enter-sx');
  el.classList.remove('vista-enter');
  el.classList.remove('sez-enter');
  /* PER FAR RIPARTIRE UN'ANIMAZIONE NON SERVE NÉ IMPAGINARE NÉ CHIEDERE.
     `void offsetWidth` rifà l'impaginazione di tutto; `getAnimations()` non
     impagina ma costringe lo stesso a rifare i conti dello stile — col
     profilatore erano 72 ms su un'apertura di schermata. Basta cambiare
     NOME all'animazione: due classi che si danno il cambio, e il browser ne
     vede una nuova senza che nessuno gli abbia chiesto niente. */
  girata = girata ? 0 : 1;
  el.classList.remove('anim-a'); el.classList.remove('anim-b');
  el.classList.add(girata ? 'anim-a' : 'anim-b');
  el.classList.add(cls);
  if (n.__timerAnim) clearTimeout(n.__timerAnim);
  n.__timerAnim = setTimeout(function () { el.classList.remove(cls); }, 900);
}

/* ---------- modalità ----------
   Un pannello modale, secondo le linee guida Apple, prende davvero il
   controllo: quello che c'è sotto non si tocca e non si raggiunge, il
   fuoco entra dentro, il tasto Tab gira in tondo lì dentro, e quando si
   chiude il fuoco torna esattamente da dove era partito. Prima il fuoco
   restava fuori: con la tastiera si continuava a girare per la pagina
   dietro senza vedere dove si era, e chi usa un lettore di schermo
   leggeva il contenuto coperto. */
/* i pannelli si possono impilare (un avviso sopra un pannello): si tiene
   la pila, così l'ultimo che si chiude restituisce il fuoco a quello sotto
   e lo sfondo torna vivo solo quando non c'è più niente sopra. */
const pilaModali: { pannello: HTMLElement; prima: Element | null }[] = [];

function focalizzabili(radice: HTMLElement): HTMLElement[] {
  const tutti = Array.prototype.slice.call(radice.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )) as HTMLElement[];
  return tutti.filter(function (e) { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
}

/* il resto dell'app diventa inerte: niente clic, niente Tab, niente voce */
function isolaSfondo(attiva: boolean): void {
  ['.app', '.tabbar', '#banda-demo'].forEach(function (sel) {
    document.querySelectorAll<HTMLElement>(sel).forEach(function (el) {
      if (attiva) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
      else { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
    });
  });
}

function entraFuoco(pannello: HTMLElement, suCampo?: boolean): void {
  pilaModali.push({ pannello: pannello, prima: document.activeElement });
  isolaSfondo(true);
  setTimeout(function () {
    /* il fuoco va sul pannello, non sul primo campo: mettere a fuoco un
       campo apre la tastiera del telefono anche quando il pannello serve
       solo per leggere. Fa eccezione la cattura, che esiste per scrivere. */
    const campo = suCampo ? focalizzabili(pannello).filter(function (e) {
      return /input|textarea/i.test(e.tagName) && (e as HTMLInputElement).type !== 'button';
    })[0] : null;
    (campo || pannello).focus();
  }, 30);
}
function esceFuoco(): void {
  const uscito = pilaModali.pop();
  if (!pilaModali.length) isolaSfondo(false);
  if (!uscito) return;
  /* si torna dove si era. Se quel pulsante nel frattempo è stato
     ridisegnato, il fuoco va sul contenuto della pagina: mai sul nulla,
     o col Tab si ricomincia dall'inizio del documento. */
  const valido = !!uscito.prima && uscito.prima !== document.body && document.contains(uscito.prima);
  const dove = (valido ? uscito.prima : $vista) as HTMLElement;
  if (dove) { try { dove.focus({ preventScroll: true }); } catch (e) { void e; } }
}
/* Tab gira dentro il pannello aperto invece di uscirne */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && concentrazioneAperta()) { chiudiConcentrazione(); return; }
  if (e.key !== 'Tab') return;
  const pannello = avvisoAperto ? avvisoAperto.querySelector<HTMLElement>('.avviso')
    : (!$sheet.hidden ? $sheetPanel : (!$ovl.hidden ? $ovl.querySelector<HTMLElement>('.pannello-cattura') : null));
  if (!pannello) return;
  const f = focalizzabili(pannello);
  if (!f.length) { e.preventDefault(); pannello.focus(); return; }
  const primo = presa(f[0]), ultimo = presa(f[f.length - 1]);
  if (!pannello.contains(document.activeElement)) { e.preventDefault(); (e.shiftKey ? ultimo : primo).focus(); return; }
  if (e.shiftKey && document.activeElement === primo) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primo.focus(); }
});

/* TRASCINARE IL FOGLIO PER CONGEDARLO
   Su TOUCH, e con gli eventi touch: non è un dettaglio di gusto. Con gli
   eventi pointer il browser, appena capisce che il dito si muove dentro
   qualcosa che può scorrere, si prende il gesto e manda `pointercancel` —
   e da lì il foglio non si trascina più, torna su e basta. L'unico modo per
   dirgli «questo gesto è mio» è `preventDefault()` su `touchmove`, che
   funziona solo se l'ascoltatore NON è passivo. Per questo si ascolta
   `touchstart/touchmove/touchend` e non `pointerdown/pointermove`.
   Come si comporta, come su iOS:
     · dalla maniglia e dalla testata si trascina sempre;
     · dal corpo si trascina se il contenuto è già in cima e il dito va in
       giù — cioè esattamente quando in quella direzione non c'è niente da
       scorrere. In tutti gli altri casi il dito scorre, e non si tocca
       niente di quello che fa il browser;
     · il foglio resta opaco: si schiarisce solo il velo dietro;
     · si decide dopo sei pixel, così un tocco resta un tocco;
     · al rilascio: oltre cento pixel o con un colpo secco si congeda
       scivolando giù, altrimenti torna al suo posto con una molla;
     · un gesto ANNULLATO torna sempre al suo posto: annullato non è finito.
   Col mouse il gesto non esiste (c'è la x), e il limite è lo stesso del
   foglio-dal-basso in CSS: 860px. */
(function trascinaPerChiudere() {
  const SOGLIA = 6;          /* pixel prima di decidere: sotto, è un tocco */
  const CHIUDE = 100;        /* oltre questo, congeda */
  const VELOCE = 0.5;        /* px/ms: un colpo secco congeda comunque */
  /* dov'era il dito quando è scesso, e da che parte l'ha preso. `dallaPresa`
     e non `presa`: `presa()` in questo progetto è l'affermazione «questo
     c'è», e un nome uguale a due passi di distanza è il modo di leggere la
     riga sbagliata. */
  interface Giu { y: number; x: number; top: number; dallaPresa: boolean }
  let giu: Giu | null = null;
  let modo: null | 'trascina' | 'scorri' = null;
  let dy = 0;
  let campioni: { t: number; y: number }[] = [];
  /* QUANDO è finito un trascinamento, non SE è finito. Con un interruttore
     («ho trascinato: sì») il clic da non far passare era il prossimo che
     arrivava, e dopo un trascinamento il clic non arriva: l'interruttore
     restava armato e si mangiava il tocco DOPO, quello vero. Se capitava
     sulla x o sulla maniglia il foglio non si chiudeva più e l'app restava
     inerte. Adesso è un istante, e vale un decimo di secondo. */
  let finitoIl = 0;
  const VALE = 120;          /* ms: solo il clic che nasce da QUEL gesto */

  function dalBasso(): boolean {
    return !!window.matchMedia && window.matchMedia('(max-width: 860px)').matches;
  }
  /* IL VELO E LA SFOCATURA SCENDONO INSIEME.
     Prima si schiariva solo il velo: tirando giù il foglio la pagina dietro
     diventava più chiara ma restava sfocata fino all'ultimo istante, e poi
     tornava a fuoco di colpo alla chiusura. Da fuori sembrava che il foglio
     non stesse davvero andando via — il gesto diceva «sto tornando alla
     pagina» e la pagina restava illeggibile.
     Adesso la sfocatura scala con lo stesso numero: a metà gesto la pagina
     dietro è a metà strada, e quello che stai per raggiungere si legge già.
     È il gesto che mostra la sua destinazione mentre lo fai — la stessa
     cosa che fa il pinch per chiudere un'app su iOS. */
  /* IL VELO È UN ELEMENTO SUO. Era una variabile CSS sul contenitore: a
     ogni fotogramma del gesto il browser ricalcolava lo stile di TUTTO
     quello che c'è nel foglio, ed era quello a farlo andare a scatti. */
  function scriviVelo(k: number): void {
    const v = $sheet.querySelector<HTMLElement>('.sheet-velo');
    if (v) v.style.opacity = String(k);
  }

  /* qualunque cosa sia rimasta di un gesto interrotto */
  function pulisci(): void {
    if (!$sheetPanel) return;
    /* `sheet-entra` compresa: se il dito arriva mentre il foglio sta ancora
       salendo, l'ingresso finisce lì e non riparte dopo */
    $sheetPanel.classList.remove('sheet-trascina', 'sheet-molla', 'sheet-via', 'sheet-entra');
    $sheetPanel.style.transform = '';
    scriviVelo(1);
  }

  function partenza(e: TouchEvent): void {
    giu = null; modo = null; dy = 0; campioni = [];
    /* un gesto interrotto (dito uscito dallo schermo, foglio chiuso da
       codice a metà trascinamento) lasciava il foglio spostato e il velo
       schiarito: si riparte sempre da pulito */
    pulisci();
    if (!dalBasso() || !$sheetPanel || $sheet.hidden) return;
    if (e.touches.length !== 1) return;          /* due dita non sono questo gesto */
    const t = presa(e.touches[0]);
    const bersaglio = e.target as HTMLElement | null;
    /* dentro un campo il dito seleziona il testo, non trascina il foglio */
    if (bersaglio && bersaglio.closest && bersaglio.closest('input, textarea, select, [contenteditable="true"]')) return;
    const dallaPresa = !!(bersaglio && bersaglio.closest && bersaglio.closest('.sheet-maniglia, .sheet-testa'));
    giu = { y: t.clientY, x: t.clientX, top: $sheetScorre ? $sheetScorre.scrollTop : 0, dallaPresa: dallaPresa };
    campioni = [{ t: e.timeStamp, y: t.clientY }];
  }

  function muovi(e: TouchEvent): void {
    const g = giu;
    if (!g || !$sheetPanel) return;
    if (e.touches.length !== 1) { annullaGesto(); return; }
    const t = presa(e.touches[0]);
    const d = t.clientY - g.y;
    if (modo === null) {
      if (Math.abs(d) < SOGLIA && Math.abs(t.clientX - g.x) < SOGLIA) return;
      /* in orizzontale non è il nostro gesto */
      if (Math.abs(t.clientX - g.x) > Math.abs(d)) { modo = 'scorri'; return; }
      /* si trascina dalla presa, oppure dal corpo quando il contenuto è già
         in cima e il dito va in giù: lì sotto non c'è nulla da scorrere */
      modo = (g.dallaPresa || (d > 0 && g.top <= 0)) ? 'trascina' : 'scorri';
    }
    if (modo !== 'trascina') return;
    /* tirando in SU dalla maniglia il foglio non si muove: non c'è niente
       da spegnere e niente da rimettere a posto dopo */
    if (d <= 0 && !$sheetPanel.classList.contains('sheet-trascina')) return;
    $sheetPanel.classList.add('sheet-trascina');
    /* «questo gesto è mio»: senza questo il browser lo prende per uno
       scorrimento e lo annulla, e il foglio non scende di un pixel */
    if (e.cancelable) e.preventDefault();
    dy = Math.max(0, d);
    $sheetPanel.style.transform = 'translateY(' + dy.toFixed(1) + 'px)';
    /* il velo e la sfocatura si schiariscono, il foglio no */
    scriviVelo(Math.max(0.06, 1 - dy / 420));
    campioni.push({ t: e.timeStamp, y: t.clientY });
    if (campioni.length > 6) campioni.shift();
  }

  function fine(): void {
    if (!giu || !$sheetPanel) return;
    const eraTrascina = modo === 'trascina';
    giu = null; modo = null;
    if (!eraTrascina) return;
    /* `performance.now()` e non `Date.now()`: serve un tempo che scorre
       sempre in avanti e che non si possa fermare da fuori (le prove
       fermano `Date` per avere schermate identiche, e con quello il
       confronto valeva sempre zero: il clic veniva mangiato per sempre) */
    if (dy > SOGLIA) finitoIl = performance.now();
    /* velocità sugli ultimi campioni, non su tutto il gesto: chi rallenta
       prima di lasciare non vuole chiudere */
    let v = 0;
    if (campioni.length > 1) {
      const a = presa(campioni[0]), b = presa(campioni[campioni.length - 1]);
      v = (b.y - a.y) / Math.max(1, b.t - a.t);
    }
    $sheetPanel.classList.remove('sheet-trascina');
    if (dy > CHIUDE || v > VELOCE) { congedaScivolando(); return; }
    molla();
  }

  function molla(): void {
    if (!$sheetPanel) return;
    $sheetPanel.classList.add('sheet-molla');
    $sheetPanel.style.transform = '';
    scriviVelo(1);
    setTimeout(function () { if ($sheetPanel) $sheetPanel.classList.remove('sheet-molla'); }, 320);
  }

  /* Annullato non è finito. `touchcancel` vuol dire che il sistema si è
     preso il gesto (una telefonata, il palmo appoggiato): il foglio torna
     al suo posto, sempre. Trattandolo come un rilascio, un gesto
     interrotto a novanta pixel veniva letto come un colpo secco e
     congedava il foglio da sotto le mani. */
  function annullaGesto(): void {
    if (!giu || !$sheetPanel) return;
    const eraTrascina = modo === 'trascina';
    giu = null; modo = null; dy = 0; finitoIl = 0;
    if (!eraTrascina) return;
    $sheetPanel.classList.remove('sheet-trascina');
    molla();
  }

  function congedaScivolando(): void {
    const pan = $sheetPanel;
    if (!pan) return;
    pan.classList.add('sheet-via');
    pan.style.transform = 'translateY(100%)';
    scriviVelo(0);
    let fatto = false;
    function poi() {
      if (fatto) return; fatto = true;
      if (!pan) return;
      pan.classList.remove('sheet-via');
      pan.style.transform = '';
      scriviVelo(1);
      chiudiSheet();
    }
    pan.addEventListener('transitionend', poi, { once: true });
    setTimeout(poi, 300);
  }

  $sheet.addEventListener('touchstart', partenza, { passive: true });
  /* NON passivo: è la sola condizione in cui `preventDefault()` conta */
  $sheet.addEventListener('touchmove', muovi, { passive: false });
  $sheet.addEventListener('touchend', fine);
  $sheet.addEventListener('touchcancel', annullaGesto);
  /* un trascinamento che finisce sopra un pulsante non lo preme: si mangia
     solo il clic che arriva subito dopo, non il prossimo che capita */
  $sheet.addEventListener('click', function (e) {
    if (!finitoIl || performance.now() - finitoIl > VALE) return;
    finitoIl = 0;
    e.stopPropagation(); e.preventDefault();
  }, true);
  /* se il foglio si chiude mentre il dito lo teneva, niente resta appeso */
  document.addEventListener('lm:sheet-chiuso', function () {
    giu = null; modo = null; dy = 0; finitoIl = 0; pulisci();
  });
})();

/* Come si torna da dove si è entrati. Cinque pannelli si aprono da dentro
   un altro — «Aree», «Sonno e pasti», «Backup», «Primi passi»,
   «Registro tecnico» tutti da «Impostazioni» — e finora non c'era modo
   di tornare indietro: chiudevi e riaprivi. Chi apre un pannello dice come
   si riapre lui, e da lì in poi il ritorno è automatico. */
/* COME SI RIAPRE UN PANNELLO: il suo nome (che finisce scritto sul tasto
   «‹ Impostazioni») e la funzione che lo rimette in piedi. */
export interface Riapri { nome: string; apri: () => void }

let pilaSheet: Riapri[] = [];
let riapriCorrente: Riapri | null = null;
let staTornandoSheet = false;

export function apriSheet(
  titolo: string,
  html: string,
  onWire?: ((root: HTMLElement) => void) | null,
  largo?: boolean,
  riapri?: Riapri | null
): void {
  /* Un pannello che ne apre un altro (impostazioni → «le tue aree») non è
     un secondo pannello: è lo stesso foglio con dentro un'altra cosa. Se
     si entrasse di nuovo nella modalità, la pila si riempirebbe di un
     livello che nessuno toglie e il resto dell'app resterebbe inerte —
     cioè non cliccabile — per sempre. */
  const giaAperto = !$sheet.hidden;
  /* Riaprire IL PANNELLO CHE È GIÀ APERTO non è entrare in un altro: se si
     impilasse, la via del ritorno porterebbe a se stessa e il tasto
     «Indietro» resterebbe acceso per sempre. Capita davvero adesso che la
     porta delle impostazioni sta nella barra in basso: si tocca due volte. */
  const stessoDiPrima = !!(riapri && riapriCorrente && riapri.nome === riapriCorrente.nome);
  if (!giaAperto) pilaSheet = [];
  else if (!staTornandoSheet && !stessoDiPrima && riapriCorrente) pilaSheet.push(riapriCorrente);
  riapriCorrente = riapri || null;
  scriviTestaSheet(titolo);
  /* se il corpo di prima era di React, va staccato PRIMA di riscriverlo:
     `innerHTML` gli porterebbe via i nodi da sotto e la sua radice
     resterebbe attaccata a roba che non esiste più */
  ganci.smontaFoglio();
  perId('sheet-corpo').innerHTML = html;
  if ($sheetPanel) $sheetPanel.classList.toggle('sheet-largo', !!largo);
  $sheet.hidden = false;
  bloccaSfondo(true);
  wireSheet = onWire || null;
  if (wireSheet) wireSheet(perId('sheet-corpo'));
  if (giaAperto) { if ($sheetScorre) $sheetScorre.scrollTop = 0; if ($sheetPanel) $sheetPanel.focus({ preventScroll: true }); }
  else { animaIngressoSheet(); if ($sheetPanel) entraFuoco($sheetPanel); }
}

/* L'ingresso del foglio: una volta, quando si apre. La classe se ne va da
   sola appena l'animazione finisce, così nessun'altra classe può farla
   ricominciare (vedi `.sheet-entra` nel foglio di stile). */
function animaIngressoSheet(): void {
  if (!$sheetPanel) return;
  const pan = $sheetPanel;
  $sheetPanel.classList.remove('sheet-entra');
  /* si rilegge una proprietà per forzare il ricalcolo: senza, togliere e
     rimettere la classe nello stesso giro non riparte */
  void $sheetPanel.offsetWidth;
  $sheetPanel.classList.add('sheet-entra');
  const via = function () { pan.classList.remove('sheet-entra'); };
  pan.addEventListener('animationend', via, { once: true });
  setTimeout(via, 500);
}

/* la testa del pannello: il nome di dove sei, e — se ci sei entrato da un
   altro pannello — la via per tornare da dove venivi. Il nome del posto di
   prima sta scritto sul tasto: «‹ Impostazioni» dice dove torni, una
   freccia sola no. */
function scriviTestaSheet(titolo: string): void {
  const t = perId('sheet-titolo');
  const b = perId('sheet-indietro');
  t.textContent = titolo;
  if (!b) return;
  if (pilaSheet.length) {
    const dove = presa(pilaSheet[pilaSheet.length - 1]);
    b.hidden = false;
    b.innerHTML = ICO('chevronGiu', 15) + '<span>' + esc(dove.nome || 'Indietro') + '</span>';
    b.setAttribute('aria-label', 'Torna a ' + (dove.nome || 'indietro'));
  } else {
    b.hidden = true;
    b.innerHTML = '';
  }
}

function tornaIndietroSheet(): void {
  const dove = pilaSheet.pop();
  if (!dove) { chiudiSheet(); return; }
  riapriCorrente = null;
  staTornandoSheet = true;
  dove.apri();
  staTornandoSheet = false;
}
/* Il nome di una cosa si cambia dove lo si legge: nel titolo del
   pannello. Prima c'era una riga «Nome» con dentro un campo, cioè lo
   stesso testo scritto due volte a tre centimetri di distanza. */
export function titoloSheetModificabile(valore: string, onCambio: (v: string) => void): void {
  const t = perId('sheet-titolo');
  if (!t) return;
  let nome = valore;
  t.innerHTML = '';
  /* una casella di testo, non un campo a riga sola: i nomi lunghi devono
     andare a capo come faceva il titolo, non scomparire a destra */
  const inp = document.createElement('textarea');
  inp.className = 'sheet-titolo-inp';
  inp.rows = 1;
  inp.value = nome;
  inp.setAttribute('aria-label', 'Nome');
  t.appendChild(inp);
  function adatta() { inp.style.height = 'auto'; inp.style.height = inp.scrollHeight + 'px'; }
  adatta();
  inp.addEventListener('input', adatta);
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); inp.blur(); } });
  inp.addEventListener('change', function () {
    const v = inp.value.replace(/\s+/g, ' ').trim();
    if (!v) { inp.value = nome; adatta(); return; }
    nome = v;
    inp.value = v;
    adatta();
    onCambio(v);
  });
}

export function chiudiSheet(): void {
  $sheet.hidden = true; wireSheet = null;
  ganci.smontaFoglio();
  document.dispatchEvent(new CustomEvent('lm:sheet-chiuso'));
  if ($sheetPanel) $sheetPanel.classList.remove('sheet-largo');
  bloccaSfondo(false);
  esceFuoco();
  verificaModalita();
}

/* Rete di sicurezza: se non c'è più niente di aperto, l'app deve essere
   viva. Un livello di modalità rimasto appeso non si vede — si scopre
   scoprendo che l'app non risponde più a niente. */
function verificaModalita(): void {
  const qualcosaAperto = !$sheet.hidden || !$ovl.hidden || !!avvisoAperto;
  if (qualcosaAperto) return;
  pilaModali.length = 0;
  isolaSfondo(false);
  if (document.body.classList.contains('sfondo-fermo')) bloccaSfondo(false);
}

/* Con un pannello aperto la pagina sotto deve stare FERMA: prima si poteva
   scorrere (e cliccare) il contenuto dietro, con lo sfocato che restava sul
   posto e mostrava un taglio netto. Congeliamo lo scorrimento mantenendo la
   posizione, e lo restituiamo alla chiusura. */
let scrollCongelato = 0;
function bloccaSfondo(attiva: boolean): void {
  /* c'è ancora qualcosa sopra? allora lo sfondo resta fermo */
  const altro = document.querySelector<HTMLElement>('.overlay:not([hidden]), .sheet-overlay:not([hidden]), .avviso-ovl');
  if (attiva) {
    if (document.body.classList.contains('sfondo-fermo')) return;
    scrollCongelato = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.top = (-scrollCongelato) + 'px';
    document.body.classList.add('sfondo-fermo');
  } else {
    if (!document.body.classList.contains('sfondo-fermo')) return;
    if (altro) return; // c'è ancora un altro pannello aperto
    document.body.classList.remove('sfondo-fermo');
    document.body.style.top = '';
    window.scrollTo(0, scrollCongelato);
  }
}

/* ---------- navigazione ---------- */
/* gruppo: 'primaria' = destinazioni quotidiane (sidebar + tab bar mobile);
   'secondaria' = approfondimenti (sidebar, e nel menu "Altro" su mobile).

   livello = quanto peso visivo prende la voce. Sette voci tutte uguali
   costringono a rileggerle una per una ogni volta (legge di Hick: il tempo
   di scelta cresce col numero di alternative equivalenti), e l'ordine in
   cui stanno non dice niente su quale serve adesso. Tre livelli:
     'ancora'     la destinazione di quasi ogni apertura — grande, sempre lì
     'quotidiana' le pagine di tutti i giorni — peso normale
     'extra'      si leggono una volta e poi quasi mai — più piccole e mute
   L'ordine dentro ogni livello è per frequenza d'uso, non alfabetico. */

/* UNA VOCE DELLA NAVIGAZIONE. `breve` c'è per una sola («Design lab» →
   «Lab»), e per tutta la vita del file era un campo che compariva in una riga
   su otto senza che niente lo dicesse. */
export interface Vista {
  id: string;
  nome: string;
  breve?: string;
  icona: string;
  gruppo: 'primaria' | 'secondaria';
  livello: 'ancora' | 'quotidiana' | 'extra';
}

const VISTE: Vista[] = [
  { id: 'oggi',        nome: 'Oggi',        icona: 'target',    gruppo: 'primaria',   livello: 'ancora' },
  { id: 'giornata',    nome: 'Giornata',    icona: 'giornata',  gruppo: 'primaria',   livello: 'quotidiana' },
  { id: 'inbox',       nome: 'Attività',    icona: 'lista',     gruppo: 'primaria',   livello: 'quotidiana' },
  { id: 'rituali',     nome: 'Rituali',     icona: 'rituali',   gruppo: 'primaria',   livello: 'quotidiana' },
  { id: 'plancia',     nome: 'Panoramica',  icona: 'dashboard', gruppo: 'primaria',   livello: 'quotidiana' },
  { id: 'profilo',     nome: 'Profilo',     icona: 'user',      gruppo: 'primaria',   livello: 'quotidiana' },
  /* La pagina non si chiama più «Esperimenti»: l'esperimento è UNO dei due
     modi di rispondere alla domanda che uno si fa davvero — «questa cosa a
     me funziona?». L'altro è dirlo e basta, e quello è il modo che si usa
     novantacinque volte su cento. Il nome della pagina è la domanda; il
     segno è il verdetto, e la beuta resta il segno degli esperimenti là
     dentro. */
  { id: 'esperimenti', nome: 'Scoperte', icona: 'funziona', gruppo: 'secondaria', livello: 'extra' },
  { id: 'scienza',     nome: 'Su cosa si basa',      icona: 'atom',      gruppo: 'secondaria', livello: 'extra' },
  /* stanza a parte: dieci vestiti per gli stessi elementi, da confrontare
     per scegliere la base grafica di tutto il sito */
  { id: 'lab',         nome: 'Design lab',  breve: 'Lab', icona: 'palette',  gruppo: 'secondaria', livello: 'extra' }
];
/* le 4 destinazioni quotidiane nella tab bar mobile; le altre primarie
   (es. Giornata) e le secondarie stanno nel menu "Altro" */
const TAB_MOBILE = ['oggi', 'plancia', 'rituali', 'inbox'];
/* ---------- le tre porte ----------
   Otto voci in una barra sono otto decisioni prima ancora di cominciare, e
   la decisione su DOVE andare non è il lavoro: è l'attrito che sta davanti
   al lavoro. Quindi la barra ne fa tre, e sono tre domande, non tre nomi:
   «cosa faccio adesso», «cosa ho da fare», «come sta andando».
   Le schermate restano tutte, con lo stesso indirizzo di prima: quelle
   dentro un gruppo si raggiungono da una riga di linguette sotto al titolo,
   dove sono già in vista e costano un tocco, non una ricerca. */
/* UNA PORTA. `anche` sono le viste che appartengono al gruppo ma non stanno
   fra le linguette: c'è in una porta su tre. */
interface Porta {
  id: string;
  nome: string;
  icona: string;
  viste: { id: string; eti: string }[];
  anche?: string[];
  nascosta?: boolean;
}

const GRUPPI: Porta[] = [
  { id: 'oggi', nome: 'Oggi', icona: 'target', viste: [
    { id: 'oggi', eti: 'Adesso' }, { id: 'giornata', eti: 'La giornata' }, { id: 'rituali', eti: 'Rituali' }
  ] },
  { id: 'inbox', nome: 'Attività', icona: 'lista', viste: [
    { id: 'inbox', eti: 'Attività' }
  ] },
  { id: 'plancia', nome: 'Andamento', icona: 'dashboard', viste: [
    { id: 'plancia', eti: 'Riepilogo' }, { id: 'esperimenti', eti: 'Scoperte' }
  ],
    /* Queste due appartengono alla porta ma NON stanno fra le linguette:
       si leggono una volta e poi mai più, e una linguetta che non si tocca
       è solo una parola in più da scartare ogni volta che si guarda la riga.
       Si aprono dalle impostazioni, e la linguetta compare soltanto mentre
       ci sei dentro, per sapere dove sei e come tornare. */
    anche: ['scienza', 'lab'] },
  /* IL PROFILO: tu, i tuoi numeri, e le impostazioni in righe. Prima le
     impostazioni stavano dietro un ingranaggio in alto a destra, e di «tu»
     nell'app non c'era niente. */
  { id: 'profilo', nome: 'Profilo', icona: 'user', nascosta: true, viste: [
    { id: 'profilo', eti: 'Profilo' }
  ] }
];
const PORTE = GRUPPI.filter(function (g) { return !g.nascosta; });
function navTre(): boolean { return ((LM.load().profilo || {}).nav || 'tre') !== 'tutte'; }
function gruppoDi(id: string): Porta {
  return GRUPPI.filter(function (g) {
    return g.viste.some(function (v) { return v.id === id; }) ||
      (g.anche || []).indexOf(id) >= 0;
  })[0] || presa(GRUPPI[0]);
}

function vistaById(id: string): Vista | undefined { return VISTE.find(function (v) { return v.id === id; }); }
function primarie(): Vista[] { return VISTE.filter(function (v) { return v.gruppo === 'primaria'; }); }

function vistaCorrente(): string {
  const h = (location.hash || '#/oggi').replace('#/', '').split('/')[0] || 'oggi';
  return VISTE.some(function (v) { return v.id === h; }) ? h : 'oggi';
}

/* prende solo l'`id`, e per questo lo chiede come tale: era `badgeInbox(v, s)`
   con `v` una vista intera, e in tre punti gli si passava `{ id: g.id }` —
   una vista finta con un campo solo, costruita per soddisfare una firma che
   chiedeva più di quello che le serviva. */
function badgeInbox(id: string, s: Stato): string {
  return id === 'inbox' && s.inbox.length ? '<span class="nav-badge">' + s.inbox.length + '</span>' : '';
}

export function aggiornaNav(): void {
  const s = LM.load();
  const corrente = vistaCorrente();

  /* sidebar desktop: l'ancora, poi le quotidiane, poi gli extra */
  const lato = perId('nav-lato');
  function voce(v: Vista) {
    const dim = v.livello === 'ancora' ? 18 : 15;
    return '<a class="nav-item nav-' + (v.livello || 'quotidiana') + (corrente === v.id ? ' attivo' : '') + '" href="#/' + v.id + '">' +
      ICO(v.icona, dim) + '<span>' + v.nome + '</span>' + badgeInbox(v.id, s) + '</a>';
  }
  function livello(l: string) { return VISTE.filter(function (v) { return (v.livello || 'quotidiana') === l; }).map(voce).join(''); }
  /* niente etichette di gruppo: raggruppano già la distanza e il peso
     (principio di prossimità), e una scritta in più è una cosa in più da
     leggere in una barra che serve a non leggere niente */
  const tre = navTre();
  /* il Diario si apre dal Profilo e vive dentro Andamento: nella barra deve
     restare acceso il Profilo, da dove si è arrivati e dove si torna */
  const inProfilo = corrente === 'profilo' || (corrente === 'plancia' && schermo.sezPlancia === 'diario');
  const gCorr = inProfilo ? gruppoDi('profilo') : gruppoDi(corrente);
  function voceGruppo(g: Porta, dim: number) {
    return '<a class="nav-item nav-ancora' + (g.id === gCorr.id ? ' attivo' : '') + '" href="#/' + presa(g.viste[0]).id + '">' +
      ICO(g.icona, dim) + '<span>' + g.nome + '</span>' + badgeInbox(g.id, s) + '</a>';
  }
  scriviSe(lato, tre
    ? PORTE.map(function (g) { return voceGruppo(g, 18); }).join('')
    : livello('ancora') + livello('quotidiana') +
      '<div class="nav-sep"></div>' + livello('extra'));

  /* footer sidebar: account + impostazioni */
  if (scriviSe(perId('sidebar-fondo'), footerSidebar())) wireFooterSidebar();
  const fi = document.getElementById('fondo-impostazioni');
  if (fi) { fi.classList.toggle('attivo', inProfilo); if (inProfilo) fi.setAttribute('aria-current', 'page'); else fi.removeAttribute('aria-current'); }

  /* tab bar mobile. Con le tre porte i pulsanti sono TRE, e sono tre
     destinazioni: qui sta solo quello che si tocca ogni giorno. «Altro» era
     una quarta voce che non è una destinazione — un contenitore di cose
     diverse fra loro che si apre per scoprire cosa c'è dentro — e le
     impostazioni sono state per un po' al suo posto, che è anche peggio: la
     fascia che il pollice raggiunge senza spostare la mano spesa per una
     schermata che si apre una volta al mese. Adesso stanno in alto a destra,
     fuori dalla strada e sempre nello stesso angolo (vedi `sottoNav`).
     Senza le tre porte torna la barra di prima: quattro pagine + «Altro». */
  const tab = perId('nav-tab');
  /* le quattro della barra ci sono tutte in `VISTE`: la tabella sta trenta
     righe sopra, e `presa` dice che è quella la ragione */
  const primNav = TAB_MOBILE.map(function (id) { return presa(vistaById(id)); });
  const inSecondaria = !tre && !primNav.some(function (v) { return v.id === corrente; });
  const htmlTab = (tre
    ? PORTE.map(function (g) {
      return '<button data-vai="' + presa(g.viste[0]).id + '" class="' + (g.id === gCorr.id ? 'attivo' : '') + '">' +
        '<span class="tab-ico">' + ICO(g.icona, 18) + badgeInbox(g.id, s) + '</span>' + g.nome + '</button>';
    }).join('')
    : primNav.map(function (v) {
      return '<button data-vai="' + v.id + '" class="' + (corrente === v.id ? 'attivo' : '') + '">' +
        '<span class="tab-ico">' + ICO(v.icona, 18) + badgeInbox(v.id, s) + '</span>' + v.nome + '</button>';
    }).join('')) +
    (tre ? ''
      : '<button data-menu="1" class="' + (inSecondaria ? 'attivo' : '') + '"><span class="tab-ico">' + ICO('altro', 18) + '</span>Altro</button>') +
    /* La cattura sta DENTRO la barra, non su un pulsante che galleggia sopra
       la pagina. Quello tondo, fisso in basso a destra, stava sopra un
       comando in ventun punti diversi fra sei schermate: la riga di «Review
       della settimana» ci finiva sotto per milleottocento pixel quadrati e
       non c'era modo di scorrere per liberarla. Qui non copre mai niente e
       resta a un dito di distanza, che è tutto quello che deve fare. */
    '<button class="tab-catt" data-catt="1" aria-label="Cattura un pensiero" title="Cattura un pensiero (tasto C)">' +
    ICO('plus', 18) + '</button>';
  /* i fili si riattaccano solo se la barra è stata davvero riscritta */
  if (scriviSe(tab, htmlTab)) {
    tab.querySelectorAll<HTMLElement>('[data-vai]').forEach(function (b) {
      b.addEventListener('click', function () {
        /* toccare la porta in cui sei già riporta alla sua pagina di
           partenza, in cima: è il «torna indietro» di ogni barra */
        schermo.sezPlancia = 'riepilogo';
        schermo.ritualiAperti = null;
        location.hash = '#/' + b.getAttribute('data-vai');
        window.scrollTo(0, 0);
        render();
      });
    });
    const bMenu = tab.querySelector<HTMLElement>('[data-menu]');
    if (bMenu) bMenu.addEventListener('click', apriMenuAltro);
    const bCatt = tab.querySelector<HTMLElement>('[data-catt]');
    if (bCatt) bCatt.addEventListener('click', apriCattura);
  }
}

/* ---------- footer sidebar (account + impostazioni) ---------- */

/* COM'È ANDATO IL SALVATAGGIO, in parole. `breve` è la versione per la barra
   laterale, dove lo spazio è una colonna stretta; `title` compare solo quando
   c'è qualcosa da spiegare. */
export interface StatoSalvataggio {
  ico: string;
  cls: string;
  testo: string;
  breve: string;
  title?: string;
}
export function statoSync(): StatoSalvataggio {
  const y = window.LM_SYNC || { state: 'idle' as const, error: '', at: 0, inCoda: false };
  const quando = y.at ? ' · ' + oraDi(y.at) : '';
  /* `breve` è la versione per la barra laterale, dove lo spazio è una
     colonna stretta: se andasse a capo sembrerebbe un errore di layout. */
  if (y.state === 'saving') return { ico: 'cloud', cls: '', testo: 'Salvataggio…', breve: 'Salvataggio…' };
  /* la scrittura è in coda: i dati sono già sul dispositivo, il cloud
     arriverà. Dirlo chiaramente invece di lasciare un "…" infinito. */
  if (y.state === 'attesa') return { ico: 'cloud', cls: 'sync-attesa', testo: 'Salvato qui, in attesa di rete', breve: 'In attesa di rete',
    title: 'I dati sono salvati su questo dispositivo. Appena c’è rete finiscono anche nel cloud.' + (y.at ? ' Ultimo salvataggio nel cloud: ' + oraDi(y.at) + '.' : '') };
  if (y.state === 'muto') return { ico: 'cloud', cls: 'sync-errore', testo: 'Cloud non raggiungibile', breve: 'Cloud non risponde', title: y.error };
  if (y.state === 'error') return { ico: 'cloud', cls: 'sync-errore', testo: 'Sync non riuscita', breve: 'Sync non riuscita', title: y.error };
  if (y.state === 'saved') return { ico: 'cloudCheck', cls: 'sync-ok', testo: 'Salvato nel cloud' + quando, breve: 'Salvato' + quando, title: 'Ultimo salvataggio confermato dal server alle ' + oraDi(y.at) + '.' };
  return { ico: 'cloudCheck', cls: 'sync-ok', testo: 'Tutto salvato', breve: 'Tutto salvato' };
}

function footerSidebar(): string {
  const a = window.LM_AUTH || { available: false, user: null, syncing: false };
  let acct: string;
  if (a.user) {
    const iniz = (a.user.name || a.user.email || '?').trim().charAt(0).toUpperCase();
    const avatar = a.user.photo
      ? '<img class="avatar" src="' + esc(a.user.photo) + '" alt="" referrerpolicy="no-referrer">'
      : '<span class="avatar avatar-ph">' + esc(iniz) + '</span>';
    const y = statoSync();
    acct = '<div class="fondo-account">' + avatar +
      '<div class="fondo-account-testo"><b>' + esc(a.user.name || 'Il tuo account') + '</b>' +
      /* lo stato è cliccabile: chi legge "Salvataggio…" vuole sapere subito
         perché, e la spiegazione deve stare dietro quella parola, non
         sepolta nelle impostazioni */
      '<button type="button" class="sync-chip ' + y.cls + '" data-diag="1" title="' + esc(y.title || 'Mostra cosa sta succedendo') + '">' + ICO(y.ico, 13) + ' ' + (y.breve || y.testo) + '</button></div></div>';
  } else if (a.available) {
    acct = '<button class="btn btn-mini btn-accedi" id="fondo-accedi">' + GOOGLE_G(15) + ' Accedi con Google</button>';
  } else {
    acct = '<div class="fondo-locale">' + ICO('soloQui', 13) + ' Dati salvati su questo dispositivo</div>';
  }
  return acct + '<button class="btn-strumento-largo" id="fondo-impostazioni">' + ICO('ingranaggio', 15) + '<span>Profilo e impostazioni</span></button>';
}

function wireFooterSidebar(): void {
  const acc = document.getElementById('fondo-accedi');
  if (acc) acc.addEventListener('click', function () { if (window.LMCloud && window.LMCloud.available) void window.LMCloud.signIn(); });
  const imp = document.getElementById('fondo-impostazioni');
  if (imp) imp.addEventListener('click', apriProfilo);
  const fondo = perId('sidebar-fondo');
  if (fondo) fondo.querySelectorAll<HTMLElement>('[data-diag]').forEach(function (b) { b.addEventListener('click', apriDiagnostica); });
}

/* ---------- impostazioni & menu "Altro" ---------- */

/* ============================================================
   IMPOSTAZIONI
   ============================================================

   Com'era: dieci sezioni in fila, ognuna col suo titolino maiuscolo e la sua
   riga di pastiglie, e dentro quelle pastiglie due cose diverse vestite
   uguali — «Gestisci le aree», che APRE una schermata, e «Azzera tutto», che
   CANCELLA i dati. La navigazione stava in mezzo fra il tema e i backup;
   «Tema» e «Aspetto» erano due sezioni per la stessa domanda; e per sapere
   quante aree si hanno o a che ora si va a letto bisognava aprire il
   pannello e poi tornare indietro.

   Com'è adesso, e le tre regole che tengono la schermata in piedi:

   1. UNA FORMA PER OGNI TIPO DI COSA. Una riga con la freccetta APRE una
      schermata; una riga senza freccetta FA una cosa adesso; un segmento
      cambia subito quello che si vede. Sono le stesse tre forme del resto
      dell'app (la scheda di un'attività è fatta così), quindi non c'è niente
      da imparare qui dentro.
   2. IL VALORE SI VEDE DA FUORI. «Aree · 8 attive», «Sonno e pasti ·
      23:30–07:30, 3 pasti», «Backup · 4»: alla maggior parte delle domande
      si risponde senza aprire niente. È la differenza fra un elenco di porte
      e un pannello di strumenti.
   3. SEI FAMIGLIE IN ORDINE DI QUANTO SERVONO, e quello che cancella sta in
      fondo, staccato, con la sua faccia rossa: prima era una pastiglia in
      fila con «Carica dati di esempio». */

/* una riga che APRE una schermata: freccetta a destra, e il valore di adesso
   accanto — così la risposta si legge senza entrare */
/* Da qui in giù la forma non sta più scritta qui: sta in
   `src/pezzi/stringhe.ts`, che è quello che resta della libreria in versione
   stringa. Qui rimane il nome del mestiere — «porta», «fa», «scelta» — che è
   la cosa che serve a chi legge questa parte.

   `segnoDi` è il disegno passato per mano invece che cercato: la libreria
   delle stringhe non conosce `ICO`, e non deve — è l'unica cosa che le
   serviva da fuori. */
function segnoDi(nome?: string, dim?: number): string {
  return nome ? ICO(nome, dim || 15) : '';
}

function rigaPorta(id: string, ico: string, eti: string, val?: string): string {
  return pzRiga({ mestiere: 'porta', id: id, ico: ico, eti: eti, valore: val }, segnoDi);
}
/* una riga che FA una cosa adesso: nessuna freccetta, perché non si va da
   nessuna parte. La differenza fra le due forme è tutta qui, e prima non
   c'era: «Esporta» e «Gestisci le aree» erano la stessa pastiglia. */
function rigaFa(id: string, ico: string, eti: string, cls?: string): string {
  return pzRiga({ mestiere: 'fa', id: id, ico: ico, eti: eti, piu: cls }, segnoDi);
}
/* LA RIGA A SEGMENTI, che era scritta otto volte a mano.
   Nel pannello delle impostazioni ogni scelta ripeteva la stessa forma —
   `rigaScelta(eti, '<span class="segmenti imp-seg" id="seg-X">' + … )` — e
   `prove/pezzi.js` conta esattamente questo: quante volte una forma è
   scritta a mano invece di passare da un pezzo. Il suo commento dice, con
   le sue parole, «non alzare il numero: usa il pezzo». Il pezzo non
   c'era, e adesso c'è. */
/* LA NOTA SOTTO UN ELENCO, stessa storia: `<p class="lista-nota">…</p>`
   era scritto a mano in tredici punti di questo file. Il testo arriva già
   come HTML — dentro ci sono `<b>` e virgolette — quindi non si passa dal
   pezzo che scappa il testo, ma la forma sta scritta in un posto solo. */
function nota(html: string): string { return '<p class="lista-nota">' + html + '</p>'; }
function rigaSegmenti(eti: string, id: string, bottoni: string): string {
  return rigaScelta(eti, '<span class="segmenti imp-seg" id="seg-' + id + '">' + bottoni + '</span>');
}
/* una riga con una scelta che vale subito: l'etichetta sopra, i segmenti
   larghi quanto la riga sotto (su un telefono un segmento da tre voci e
   un'etichetta sulla stessa riga non ci stanno) */
function rigaScelta(eti: string, dentro: string): string {
  /* `eti` e `dentro` qui arrivano già come HTML (ci stanno dentro un'icona e
     un segmento), quindi si compone a mano invece di passare dal pezzo, che
     scappa il testo — ma le classi restano quelle di un pezzo solo. */
  return '<div class="lista-riga sc-riga sc-riga-alta">' +
    '<span class="sc-eti">' + eti + '</span>' +
    '<span class="sc-val">' + dentro + '</span></div>';
}

/* cosa dire dei promemoria nel pannello: il valore accanto al nome, se la
   riga è una porta, la nota sotto e il tasto che la accompagna */
interface StatoPromemoria { val: string; porta: boolean; nota: string; azione: string }
function statoPromemoria(): StatoPromemoria {
  const st = P.stato();
  if (st === 'niente') {
    return { val: 'non disponibili', porta: false,
      nota: 'Questo browser non sa dare notifiche.', azione: '' };
  }
  if (P.serveInstallare()) {
    return { val: 'da installare', porta: false,
      nota: 'Sull’iPhone i promemoria arrivano solo se aggiungi LifeMax alla schermata Home: tasto Condividi → «Aggiungi a schermata Home». Poi torna qui.',
      azione: '' };
  }
  if (st === 'denied') {
    return { val: 'bloccati', porta: false,
      nota: 'Le notifiche sono bloccate per questo sito. Si riattivano dalle impostazioni del browser, alla voce di questo indirizzo.',
      azione: '' };
  }
  if (st === 'granted') {
    const n = P.piano().filter(function (v) { return v.id !== 'stato'; }).length;
    return { val: 'accesi', porta: true,
      nota: P.configurato()
        ? (n ? 'Oggi ne restano <b>' + n + '</b>.' : '')
        : 'Permesso concesso. Per adesso arriva solo la fine del timer: gli altri promemoria hanno bisogno del server.',
      azione: '<button class="btn btn-mini" id="imp-prom-off">' + ICO('campanaOff', 15) + ' Spegni</button>' };
  }
  return { val: 'spenti', porta: true,
    nota: P.configurato()
      ? 'Servono per i momenti della giornata e per le abitudini con un’ora.'
      : 'Da accesi arriva l’avviso di fine timer. Quelli a orario hanno bisogno del server, che non è ancora collegato.',
    azione: '<button class="btn btn-mini btn-tinta" id="imp-prom-on">' + ICO('campana', 15) + ' Accendi i promemoria</button>' };
}

export function htmlAspetto(): string {
  const s = LM.load();
  const modo = s.profilo.modo || 'auto';
  const skin = s.profilo.skin || 'quiete';
  const nav = s.profilo.nav || 'tre';
  function segM(v: string, ico: string, et: string) { return '<button data-modo="' + v + '" class="' + (modo === v ? 'attivo' : '') + '">' + ICO(ico, 15) + et + '</button>'; }
  function segS(v: string, et: string) { return '<button data-skin="' + v + '" class="' + (skin === v ? 'attivo' : '') + '">' + et + '</button>'; }
  function segN(v: string, et: string) { return '<button data-nav="' + v + '" class="' + (nav === v ? 'attivo' : '') + '">' + et + '</button>'; }
  const scorri = s.profilo.scorri || 'si';
  function segSc(v: string, et: string) { return '<button data-scorri="' + v + '" class="' + (scorri === v ? 'attivo' : '') + '">' + et + '</button>'; }
  const eff = s.profilo.effetti || 'pieni';
  function segEf(v: string, et: string) { return '<button data-eff="' + v + '" class="' + (eff === v ? 'attivo' : '') + '">' + et + '</button>'; }
  const forma = s.profilo.forma || 'scheda';
  /* `data-schermata`, e il nome è la parte interessante.
     Il primo tentativo era `data-forma`, che sembra l'ovvio: ma
     `data-forma` è GIÀ DI QUALCUN ALTRO — `src/forma/forma.ts` ci scrive
     dentro la firma della forma che ha disegnato (`e.dataset.forma =
     p.firma`), su ogni elemento a cui dà gli angoli a supercerchio, questi
     bottoni compresi. Il valore «spina» durava fino al primo giro del
     sistema delle forme, poi diventava «105x44|14.39,…|0|»: il gestore non
     riconosceva più niente, ripiegava su «scheda» — che è già il valore
     corrente — e `setForma` usciva subito. Si cliccava e non succedeva
     niente, senza un errore da nessuna parte.
     Il secondo tentativo era `data-adesso`, preso anche lui: lo porta la
     griglia della giornata per marcare l'ora corrente. Contesto diverso,
     quindi non si sarebbero pestati i piedi — ma un nome che significa già
     un'altra cosa è il modo di rifare lo stesso guasto fra sei mesi. */
  function segFo(v: string, et: string) { return '<button data-schermata="' + v + '" class="' + (forma === v ? 'attivo' : '') + '">' + et + '</button>'; }
  const suo = s.profilo.suono || 'si', vib = s.profilo.vibra || 'si';
  function segSu(v: string, et: string) { return '<button data-suono="' + v + '" class="' + (suo === v ? 'attivo' : '') + '">' + et + '</button>'; }
  function segVi(v: string, et: string) { return '<button data-vibra="' + v + '" class="' + (vib === v ? 'attivo' : '') + '">' + et + '</button>'; }

  function interr(eti: string, ico: string, acceso: boolean, su: string, giu: string): string {
    return '<div class="lista-riga sc-riga int-riga"><span class="sc-eti">' + ICO(ico, 15) + ' ' + eti + '</span>' +
      '<button class="interr' + (acceso ? ' on' : '') + '" role="switch" aria-checked="' + acceso + '" aria-label="' + eti +
      '" data-su="' + su + '" data-giu="' + giu + '"><i></i></button></div>';
  }
  /* quattro scelte: il tema, e tre interruttori. Le altre (stile, forma
     della Home, barra, scorrimento) restano nei dati ma non chiedono più
     niente a nessuno: i loro comandi sono qui sotto, nascosti. */
  return '<div class="sc"><div class="lista">' +
    rigaSegmenti('Tema', 'modo',
      segM('auto', 'automatico', 'Auto') + segM('light', 'sun', 'Chiaro') + segM('dark', 'moon', 'Scuro')) +
    interr('Suoni', 'campana', suo === 'si', '#seg-suono [data-suono=si]', '#seg-suono [data-suono=no]') +
    interr('Vibrazione', 'polso', vib === 'si', '#seg-vibra [data-vibra=si]', '#seg-vibra [data-vibra=no]') +
    interr('Animazioni', 'sparkles', eff !== 'minimi', '#seg-eff [data-eff=pieni]', '#seg-eff [data-eff=minimi]') +
    '</div><div hidden>' +
    rigaSegmenti('Stile', 'skin', segS('quiete', 'Aurora') + segS('arcade', 'Arcade')) +
    rigaSegmenti('Schermata', 'forma', segFo('scheda', 'Scheda') + segFo('spina', 'Spina') + segFo('poi', 'Poi')) +
    rigaSegmenti('Barra', 'nav', segN('tre', 'Tre porte') + segN('tutte', 'Tutte le pagine')) +
    rigaSegmenti('Scorri', 'scorri', segSc('si', 'Acceso') + segSc('no', 'Spento')) +
    rigaSegmenti('Effetti', 'eff', segEf('pieni', 'Pieni') + segEf('ridotti', 'Ridotti') + segEf('minimi', 'Minimi')) +
    rigaSegmenti('Suono', 'suono', segSu('si', 'Acceso') + segSu('no', 'Muto')) +
    rigaSegmenti('Vibrazione', 'vibra', segVi('si', 'Accesa') + segVi('no', 'Spenta')) +
    '</div></div>';
}

export function htmlImpostazioni(pezzo?: 'profilo'): string {
  const s = LM.load();
  const modo = s.profilo.modo || 'auto';

  const r = s.profilo.ritmo;
  const pasti = (r.pasti || []).length;
  const valRitmo = (r.sonno || '—') + '–' + (r.sveglia || '—') + (pasti ? ' · ' + pasti + ' pasti' : '');
  const nAree = (s.areeAttive || []).length;
  const nBackup = LM.listBackups().length;
  const pr = statoPromemoria();

  /* DUE PEZZI. Nel Profilo quello che si tocca spesso; il resto sta in
     «Impostazioni», che è l'ultima riga del Profilo. */
  if (pezzo === 'profilo') {
    return '<div class="sc">' +
      '<div class="lista">' +
      rigaPorta('imp-aree', 'aree', 'Aree', nAree + ' attive') +
      rigaPorta('imp-ritmo', 'ritmo', 'Sonno e pasti', valRitmo) +
      rigaPorta('imp-prom-come', 'campana', 'Promemoria', pr.val) +
      '</div>' +
      '<div class="lista mt-s">' +
      rigaPorta('imp-diario', 'quaderno', 'Diario') +
      rigaPorta('imp-tutte', 'ingranaggio', 'Impostazioni') +
      '</div></div>';
  }
  return '<div class="sc">' +
    etichetta('Account', 'user') +
    htmlAccount() +
    '<div class="lista mt-s">' +
    '<label class="lista-riga sc-riga" for="imp-area-nuova"><span class="sc-eti">' + ICO('aree', 15) + ' Area predefinita</span>' +
    '<span class="sc-val"><select id="imp-area-nuova" class="sc-inline">' +
    '<option value=""' + (s.profilo.areaNuova ? '' : ' selected') + '>Automatica</option>' +
    '<option value="-"' + (s.profilo.areaNuova === '-' ? ' selected' : '') + '>Nessuna</option>' +
    areeAttive().map(function (a) { return '<option value="' + a.id + '"' + (a.id === s.profilo.areaNuova ? ' selected' : '') + '>' + esc(a.nome) + '</option>'; }).join('') +
    '</select></span></label>' +
    rigaPorta('imp-timer', 'durata', 'Timer', (function () {
      const pr = (s.profilo.timer || {}).predefinito;
      return pr ? TIPI_TIMER[pr].nome.toLowerCase() : 'chiedi sempre';
    })()) +
    rigaPorta('imp-musica', 'cuffie', 'Musica', (s.profilo.musica && (s.profilo.musica.predefinita || Object.keys(s.profilo.musica.aree || {}).length)) ? 'impostata' : 'nessuna') +
    rigaPorta('imp-aspetto', 'palette', 'Aspetto', modo === 'auto' ? 'automatico' : modo === 'dark' ? 'scuro' : 'chiaro') +
    '</div>' +

    /* --- I TUOI DATI: due cose che si fanno e una porta --- */
    etichetta('I tuoi dati', 'dati') +
    '<div class="lista">' +
    rigaFa('imp-esporta', 'download', 'Esporta dati') +
    rigaFa('imp-importa', 'upload', 'Importa dati') +
    rigaPorta('imp-backup', 'archivio', 'Backup e ripristino', nBackup ? String(nBackup) : 'nessuno') +
    '</div>' +
    '<input type="file" id="imp-file" accept="application/json,.json" hidden>' +

    /* --- CAPIRE L'APP: le pagine che si leggono, non si usano --- */
    etichetta('Guida', 'aiuto') +
    '<div class="lista">' +
    rigaPorta('imp-guida', 'aiuto', 'Primi passi') +
    rigaPorta('imp-scienza', 'atom', 'Su cosa si basa') +
    rigaPorta('imp-diag', 'terminale', 'Registro tecnico') +
    '</div>' +

    /* --- RIPARTIRE: staccato, e in fondo. Quello che cancella non può
           stare in fila con quello che salva. --- */
    etichetta('Reimposta', 'riprova') +
    '<div class="lista">' +
    (LM.contaEsempio() ? rigaFa('imp-togli-esempio', 'sparkles', 'Rimuovi dati di esempio') : rigaFa('imp-demo', 'sparkles', 'Carica dati di esempio')) +
    '</div>' +
    /* cancellare tutto sta da solo: mai in fila con un comando innocuo */
    '<div class="lista mt">' +
    rigaFa('imp-azzera', 'trash', 'Cancella tutti i dati', 'sc-pericolo') +
    '</div>' +
    '</div>';
}

/* PROMEMORIA — il pannello per accenderli.
   Sta in Impostazioni e in un posto solo: due interruttori per la stessa
   cosa in due schermate sarebbero due modi di accendere la stessa luce.
   Il permesso si chiede QUI, quando lo chiedi tu: chiederlo all'apertura è
   il modo più sicuro di farselo negare per sempre. */
/* COME TI AVVISO — la schermata dove si sceglie tutto.
   Sta a parte per un motivo che non è di spazio: qui si decide quando una
   macchina ha il permesso di interromperti, e quella decisione merita una
   schermata sola invece di essere infilata fra il tema e i backup. */
export function apriPromemoria() {
  var c = LM.promemoria();
  var conf = P.configurato();

  function riga(id: VoceProm, nome: string, _spiega: string) {
    var v = c.voci[id] || {};
    return '<div class="gr-riga prom-riga' + (v.on ? '' : ' spenta') + '" data-voce="' + id + '">' +
      '<span class="gr-eti">' + esc(nome) + '</span>' +
      (v.ora != null && v.on
        ? '<input type="time" class="gr-val prom-ora" data-ora="' + id + '" value="' + esc(v.ora) + '" aria-label="A che ora, ' + esc(nome) + '">'
        : '') +
      '<button class="interr' + (v.on ? ' on' : '') + '" data-int="' + id + '" role="switch" aria-checked="' + !!v.on + '" aria-label="' + esc(nome) + '"><i></i></button>' +
      '</div>';
  }


  const pr = statoPromemoria();
  const acceso = P.stato() === 'granted';
  apriSheet('Promemoria',
    /* in cima: come stanno, e il tasto per cambiarlo */
    '<div class="prom-stato' + (acceso ? ' on' : (pr.val === 'bloccati' ? ' prom-bloccato' : '')) + '" id="prom-stato">' +
      '<span class="prom-stato-ico">' + ICO(acceso ? 'campana' : 'campanaOff', 26) + '</span>' +
      '<div class="prom-stato-testo"><b>' + (acceso ? 'Accesi' : (pr.val === 'bloccati' ? 'Notifiche bloccate' : pr.val.charAt(0).toUpperCase() + pr.val.slice(1))) + '</b>' +
      (pr.nota ? '<span>' + pr.nota + '</span>' : '') + '</div>' +
      (pr.azione || '') +
    '</div>' +

    /* con le notifiche bloccate gli interruttori non possono fare niente:
       si vedono spenti e non si toccano, invece di sembrare accesi */
    '<div class="gr-titolo">Notifiche</div><div class="gr' + (pr.val === 'bloccati' ? ' gr-spento' : '') + '">' +
      riga('mattina', 'Piano del giorno', '') +
      riga('checkin', 'Check-in', '') +
      riga('mit', 'Ricordami la priorità', '') +
      riga('sera', 'Fine giornata', '') +
      riga('abitudini', 'Abitudini con orario', '') +
    '</div>' +

    '<div class="gr-titolo">Non disturbare</div><div class="gr">' +
      '<div class="gr-riga"><span class="gr-eti">Attivo</span>' +
        '<button class="interr' + (c.silenzio.on ? ' on' : '') + '" id="prom-sil-int" role="switch" aria-checked="' + !!c.silenzio.on + '" aria-label="Silenzio"><i></i></button></div>' +
      (c.silenzio.on
        ? '<div class="gr-riga gr-sotto"><span class="gr-eti">Dalle</span><span class="gr-valori">' +
          '<input type="time" class="gr-val prom-t" id="prom-sil-da" value="' + esc(c.silenzio.da) + '" aria-label="Silenzio dalle">' +
          '<span class="gr-tratto">alle</span>' +
          '<input type="time" class="gr-val prom-t" id="prom-sil-a" value="' + esc(c.silenzio.a) + '" aria-label="Silenzio fino alle"></span></div>'
        : '') +
    '</div>' +

    htmlNotaFissa() +

    /* il server: si imposta una volta, quindi sta chiuso in fondo */
    '<details class="gr gr-dettagli"><summary class="gr-riga"><span class="gr-eti">' + ICO('cloudCheck', 15) + ' Server</span>' +
      '<span class="gr-fisso">' + (conf ? 'collegato' : 'da collegare') + '</span></summary>' +
      '<div class="gr-dentro">' +
      '<label class="campo" for="prom-server">Indirizzo</label>' +
      '<input type="url" id="prom-server" inputmode="url" autocapitalize="off" spellcheck="false" ' +
        'placeholder="https://….workers.dev" value="' + esc(c.server) + '">' +
      '<label class="campo mt-s" for="prom-chiave">Chiave pubblica</label>' +
      '<input type="text" id="prom-chiave" autocapitalize="off" spellcheck="false" placeholder="B…" value="' + esc(c.chiave) + '">' +
      '<div class="imp-azioni mt-s">' +
        '<button class="btn btn-mini btn-primario" id="prom-collega">Collega</button>' +
        (conf ? '<button class="btn btn-mini" id="prom-prova">Prova</button>' : '') +
        '<a class="sp-link" id="prom-fai-chiavi" href="promemoria/chiavi.html" target="_blank" rel="noopener">Crea le chiavi</a>' +
      '</div>' +
      '<div class="imp-nota" id="prom-esito"></div>' +
      '</div></details>',
    wirePromemoria, false, { nome: 'Promemoria', apri: apriPromemoria });
}

/* LA NOTA FISSA — e cosa si può davvero fare.
   Si può: una notifica sola, che si riscrive al posto di quella di prima e
   non fa rumore quando lo fa, e resta nell'elenco delle notifiche finché
   non la scarti tu. Più il numero sul pallino dell'icona.
   Non si può: una notifica che non si possa scartare, come quella di un
   navigatore. Su Android serve un servizio in primo piano, sull'iPhone una
   Live Activity: le può avere solo un'app installata dallo store. Meglio
   dirlo che far cercare un interruttore che non esiste. */
function htmlNotaFissa() {
  if (P.stato() !== 'granted') return '';
  var accesa = P.fissaAccesa();
  var t = P.testoFissa();
  return '<div class="gr-titolo">Nota fissa</div><div class="gr">' +
    '<div class="gr-riga"><span class="gr-eti">' + ICO('notaFissa', 15) + ' Quello che ti resta oggi</span>' +
      '<button class="interr' + (accesa ? ' on' : '') + '" id="imp-prom-fissa" role="switch" aria-checked="' + accesa + '" aria-label="Nota fissa"><i></i></button></div>' +
    (accesa ? '<div class="imp-anteprima">' + ICO('campana', 13) + '<span><b>' + esc(t.titolo) + '</b><br>' + esc(t.corpo) + '</span></div>' : '') +
    '</div>';
}

/* accendere e spegnere i promemoria: lo stesso tasto nel Profilo e nel foglio */
function wireAccendiSpegni(root: HTMLElement, riscriviImpostazioni: () => void): void {
  const pon = root.querySelector<HTMLButtonElement>('#imp-prom-on');
  if (pon) pon.addEventListener('click', function () {
    pon.disabled = true;
    void P.accendi().then(function (esito) {
      if (esito === 'negato') toast('Notifiche non consentite.', 0, 'avviso');
      else if (esito === 'chiave') toast('Chiave pubblica non valida.', 0, 'avviso');
      else if (esito === 'server') toast('Il server delle notifiche non risponde.', 0, 'avviso');
      else if (!P.configurato()) toast('Notifiche attive.', 0, 'campana');
      else toast('Promemoria accesi.', 0, 'campana');
      riscriviImpostazioni();
    });
  });
  const poff = root.querySelector<HTMLButtonElement>('#imp-prom-off');
  if (poff) poff.addEventListener('click', function () {
    poff.disabled = true;
    void P.spegni().then(function () {
      /* il permesso del browser non si può togliere da qui: si toglie
         l'iscrizione, e il pannello lo dice senza far finta d'altro */
      toast('Promemoria spenti.', 0, 'campanaOff');
      riscriviImpostazioni();
    });
  });
}

export function wirePromemoria(root: HTMLElement): void {
  function ridisegna() { staTornandoSheet = true; apriPromemoria(); staTornandoSheet = false; }
  /* dopo ogni cambiamento il piano va rimandato subito: aspettare il
     prossimo salvataggio vorrebbe dire che l'orario nuovo vale da domani */
  function salva(patch: Parameters<typeof LM.impostaPromemoria>[0]) { LM.impostaPromemoria(patch); void P.mandaPiano(true); }
  wireAccendiSpegni(root, function () { ridisegna(); render(); });

  /* gli interruttori delle voci */
  root.querySelectorAll<HTMLElement>('[data-int]').forEach(function (b) {
    b.addEventListener('click', function () {
      /* IL NOME DELLA VOCE, non una stringa qualunque. Sono cinque, e li
         scrive `htmlPromemoria` due dita più sopra: se un giorno se ne
         aggiunge una sesta, questa riga smette di compilare — che è meglio
         di un promemoria che parte alle nove perché il nome non combaciava. */
      const id = b.getAttribute('data-int') as VoceProm | null;
      if (!id) return;
      const era = LM.promemoria().voci[id].on;
      salva({ voci: { [id]: { on: !era } } });
      ridisegna();
    });
  });
  /* Tutta la riga accende e spegne, come farebbe un'etichetta. L'interruttore
     da solo è ventisei pixel, e il pollice ne vuole quaranta: prima quei
     quaranta li dava uno pseudo-elemento che sporgeva dal riquadro, ma la
     forma adesso è un ritaglio e un ritaglio taglia anche il tocco. La riga
     è alta più che a sufficienza, e toccare il nome per accendere una cosa è
     quello che si aspetta chiunque. Il campo dell'ora no: là si scrive. */
  root.querySelectorAll<HTMLElement>('.prom-riga[data-voce]').forEach(function (r) {
    r.addEventListener('click', function (e) {
      const t = e.target as HTMLElement | null;
      if (t && t.closest('input, select, textarea, button')) return;
      const b = r.querySelector<HTMLElement>('[data-int]');
      if (b) b.click();
    });
  });
  /* gli orari: si salvano quando il campo si chiude, non a ogni tasto */
  root.querySelectorAll<HTMLInputElement>('[data-ora]').forEach(function (i) {
    i.addEventListener('change', function () {
      const id = i.getAttribute('data-ora') as VoceProm | null;
      if (!id) return;
      if (!/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(i.value)) {
        /* un campo ora svuotato rimette quello di prima invece di lasciare
           una voce senza orario, che non partirebbe mai */
        i.value = LM.promemoria().voci[id].ora || '';
        toast('Orario non valido.', 0, 'avviso');
        return;
      }
      salva({ voci: { [id]: { on: LM.promemoria().voci[id].on, ora: comeOra(i.value) } } });
      toast('Da domani alle ' + i.value + '.', 0, 'clock');
    });
  });

  /* il silenzio */
  const si = root.querySelector<HTMLElement>('#prom-sil-int');
  if (si) si.addEventListener('click', function () {
    salva({ silenzio: { on: !LM.promemoria().silenzio.on } });
    ridisegna();
  });
  (['da', 'a'] as const).forEach(function (q) {
    const i = root.querySelector<HTMLInputElement>('#prom-sil-' + q);
    if (!i) return;
    i.addEventListener('change', function () {
      const c0 = LM.promemoria().silenzio;
      salva({ silenzio: { on: c0.on, da: q === 'da' ? comeOra(i.value) : c0.da, a: q === 'a' ? comeOra(i.value) : c0.a } });
      const c = LM.promemoria().silenzio;
      i.value = q === 'da' ? c.da : c.a;
    });
  });

  /* la nota fissa */
  const pf = root.querySelector<HTMLElement>('#imp-prom-fissa');
  if (pf) pf.addEventListener('click', function () {
    const era = P.fissaAccesa();
    P.fissa(!era);
    void P.mandaPiano(true);
    ridisegna();
  });

  /* IL POSTINO */
  var esito = root.querySelector<HTMLElement>('#prom-esito');
  function dillo(testo: string, cls?: string): void {
    if (!esito) return;
    esito.className = 'imp-nota' + (cls ? ' ' + cls : '');
    esito.innerHTML = testo;
  }
  const coll = root.querySelector<HTMLButtonElement>('#prom-collega');
  if (coll) coll.addEventListener('click', function () {
    /* il tasto si tiene in una costante: dentro alle richiamate che arrivano
       dopo, `coll` per il compilatore è ancora «forse niente» — lui non sa
       che ci si arriva solo da dentro all'`if` */
    const tasto = coll;
    var srv = (campo(root, '#prom-server').value || '').trim().replace(/\/+$/, '');
    var kk = (campo(root, '#prom-chiave').value || '').trim();
    /* si controlla PRIMA di salvare: due campi sbagliati salvati zitti
       danno «non arriva niente» e nessun indizio su quale dei due */
    if (!/^https:\/\/[^\s/]+\.[^\s/]+/.test(srv)) {
      dillo('L’indirizzo deve cominciare con <code>https://</code> — è quello che stampa Cloudflare alla fine, e finisce per <code>.workers.dev</code> se non hai messo un dominio tuo.', 'sync-errore');
      return;
    }
    if (!/^[A-Za-z0-9_-]{80,90}$/.test(kk)) {
      dillo('La chiave pubblica è una riga di 87 caratteri senza spazi. Questa ne ha ' + kk.length + ': forse è quella privata (più corta), o c’è dentro un pezzo di testo.', 'sync-errore');
      return;
    }
    tasto.disabled = true;
    dillo('Connessione…');
    /* prima si chiede al server se è vivo: così l'errore è «il server non
       risponde» invece di «le notifiche non arrivano», che è la stessa cosa
       detta in un modo che non aiuta */
    void fetch(srv + '/salute').then(function (r) { return r.json() as Promise<RispostaProva>; }).then(function (j) {
      if (!j || !j.ok) throw new Error('risposta strana');
      LM.impostaPromemoria({ server: srv, chiave: kk });
      if (!j.vapid) {
        dillo('Il server risponde, ma non ha le sue chiavi: sul pannello di Cloudflare mancano i segreti <code>VAPID_PUBBLICA</code> e <code>VAPID_PRIVATA</code>. Il resto è a posto.', 'sync-errore');
        tasto.disabled = false;
        return null;
      }
      /* IL CONFRONTO. È l'errore numero uno di chi installa da sé: si
         genera la coppia due volte, e nell'app finisce la pubblica di una
         coppia mentre sul Worker c'è l'altra. Il servizio push allora
         risponde 403 e non spiega niente. Confrontarle qui costa una riga e
         toglie di mezzo mezz'ora di tentativi. */
      if (j.pubblica && j.pubblica !== kk) {
        dillo('Il server c’è, ma <b>le due chiavi non sono la stessa coppia</b>. Qui hai scritto una chiave che comincia per <code>' + esc(kk.slice(0, 12)) + '…</code>, mentre sul Worker c’è <code>' + esc(String(j.pubblica).slice(0, 12)) + '…</code>. Copia quella del Worker in questo campo, oppure rigenera la coppia e rimetti <b>tutti e due</b> i segreti su Cloudflare.', 'sync-errore');
        tasto.disabled = false;
        return null;
      }
      dillo('Collegato.', 'sync-ok');
      return P.accendi();
    }).then(function (esito) {
      if (esito === null) return;
      if (esito === 'chiave') {
        dillo('Il server c’è, ma quella chiave il browser non la accetta: è della lunghezza giusta ma non è una chiave vera. Rigenera la coppia con <code>promemoria/chiavi.html</code> e ricorda di rimettere <b>tutti e due</b> i segreti su Cloudflare — devono essere la stessa coppia.', 'sync-errore');
        return;
      }
      if (esito === 'negato') {
        dillo('Il server è collegato, ma il permesso alle notifiche è negato: va riattivato dalle impostazioni del browser, alla voce di questo indirizzo.', 'sync-errore');
        return;
      }
      ridisegna();
    }).catch(function () {
      tasto.disabled = false;
      dillo('Non risponde. Controlla l’indirizzo, e prova ad aprirlo nel browser aggiungendo <code>/salute</code> alla fine: deve rispondere <code>{"ok":true}</code>.', 'sync-errore');
    });
  });

  /* DA UN NUMERO A UNA COSA DA FARE.
     «Il server ha risposto: 502» è vero e inutile: il 502 è il nostro, e
     dentro c'è il codice del servizio push — che è quello che sa perché ha
     detto no. Ogni codice ha una causa sola in pratica, e ognuna ha un
     gesto: qui si scrive quel gesto invece del numero. */
  function spiegaProva(risposta: RispostaProva | null, stato: number): string {
    const j: RispostaProva = risposta || {};
    const s = j.stato || 0;
    const chiave = P.cfg().chiave || '';
    const coppiaDiversa = j.pubblica && chiave && j.pubblica !== chiave;
    if (coppiaDiversa) {
      return 'Il servizio push ha detto no (<code>' + esc(String(s || stato)) + '</code>) e si vede perché: <b>le due chiavi non sono la stessa coppia</b>. Nell’app c’è <code>' + esc(chiave.slice(0, 12)) + '…</code>, sul Worker <code>' + esc(String(j.pubblica).slice(0, 12)) + '…</code>. Copia quella del Worker qui sopra e premi Collega.';
    }
    if (j.dove === 'firma') {
      return 'Non è nemmeno arrivato a parlare col servizio push: la <b>chiave privata</b> sul Worker non è una chiave valida. Di solito ci è finito dentro uno spazio o un ritorno a capo quando l’hai incollata nel segreto <code>VAPID_PRIVATA</code>. Rifallo copiandola tutta di fila. (<code>' + esc(String(j.errore || '')) + '</code>)';
    }
    const detto = j.detto ? ' Ha scritto: <code>' + esc(String(j.detto).slice(0, 160)) + '</code>' : '';
    if (s === 401 || s === 403) {
      return 'Il servizio push ha rifiutato la firma (<code>' + esc(String(s)) + '</code>). Vuol dire che la coppia VAPID sul Worker non è quella con cui questo telefono si è iscritto: rigenera la coppia con <code>promemoria/chiavi.html</code>, rimetti <b>tutti e due</b> i segreti su Cloudflare, incolla la pubblica qui sopra, premi Collega, poi spegni e riaccendi i promemoria.' + detto;
    }
    if (s === 400) {
      return 'Il servizio push ha detto che la richiesta non va (<code>400</code>). Il sospetto quasi sempre giusto: il segreto <code>VAPID_SOGGETTO</code>. Deve essere <code>mailto:</code> seguito da un tuo indirizzo email vero — Apple non accetta indirizzi finti.' + detto;
    }
    if (s === 413) return 'La notifica era troppo grande per il servizio push (<code>413</code>). Questo è un problema mio, non tuo: scrivimelo.' + detto;
    if (s === 429) return 'Il servizio push ha detto «troppe» (<code>429</code>). Aspetta un minuto e riprova.' + detto;
    if (s >= 500) return 'Il servizio push (Apple o Google) sta avendo problemi suoi (<code>' + esc(String(s)) + '</code>). Non c’è niente da sistemare: riprova fra qualche minuto.' + detto;
    if (j.errore) return 'Il server ha detto: <code>' + esc(String(j.errore)) + '</code>';
    return 'Il servizio push ha risposto <code>' + esc(String(s || stato)) + '</code> e non ha spiegato.' + detto;
  }

  const pv = root.querySelector<HTMLButtonElement>('#prom-prova');
  if (pv) pv.addEventListener('click', function () {
    const prova = pv;
    prova.disabled = true;
    dillo('Invio…');
    /* mandare il piano prima serve: se l'iscrizione è nuova, sul server non
       c'è ancora niente a cui mandare la prova */
    void P.mandaPiano(true).then(function () {
      return fetch(P.cfg().server + '/prova', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: P.idDispositivo() })
      });
    }).then(function (r) {
      return (r.json() as Promise<RispostaProva>).then(function (j) { return { r: r, j: j }; });
    }).then(function (x) {
      prova.disabled = false;
      if (x.r.ok) dillo('Partita. Se non la vedi entro qualche secondo, il permesso c’è ma il sistema la sta nascondendo: controlla le notifiche di LifeMax nelle impostazioni del telefono.', 'sync-ok');
      else if (x.r.status === 404) dillo('Il server non ha ancora un piano per questo dispositivo: spegni e riaccendi i promemoria qui sopra.', 'sync-errore');
      else if (x.r.status === 410) dillo('L’iscrizione non vale più (di solito: notifiche revocate, o app reinstallata). Spegni e riaccendi i promemoria.', 'sync-errore');
      else dillo(spiegaProva(x.j, x.r.status), 'sync-errore');
    }).catch(function () {
      prova.disabled = false;
      dillo('Non completata: il server non risponde.', 'sync-errore');
    });
  });
}

export function wireAspettoDati(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('.interr').forEach(function (b) {
    b.addEventListener('click', function () {
      const on = !b.classList.contains('on');
      b.classList.toggle('on', on); b.setAttribute('aria-checked', String(on));
      const q = root.querySelector<HTMLElement>(b.getAttribute(on ? 'data-su' : 'data-giu') || 'x-niente');
      if (q) q.click();
    });
  });
  const tutte = root.querySelector<HTMLElement>('#imp-tutte');
  if (tutte) tutte.addEventListener('click', apriImpostazioni);
  const dia = root.querySelector<HTMLElement>('#imp-diario');
  if (dia) dia.addEventListener('click', function () { schermo.sezPlancia = 'diario'; location.hash = '#/plancia'; window.scrollTo(0, 0); });
  root.querySelectorAll<HTMLElement>('#seg-suono [data-suono]').forEach(function (b) {
    b.addEventListener('click', function () {
      root.querySelectorAll<HTMLElement>('#seg-suono [data-suono]').forEach(function (o) { o.classList.toggle('attivo', o === b); });
      const st = LM.load(); st.profilo.suono = b.getAttribute('data-suono') === 'no' ? 'no' : 'si'; LM.save();
      /* si prova subito: un interruttore del suono che non fa sentire il
         suono che accende chiede di andare a cercarlo da qualche altra parte */
      if (st.profilo.suono === 'si') suona('leggero');
    });
  });
  root.querySelectorAll<HTMLElement>('#seg-vibra [data-vibra]').forEach(function (b) {
    b.addEventListener('click', function () {
      root.querySelectorAll<HTMLElement>('#seg-vibra [data-vibra]').forEach(function (o) { o.classList.toggle('attivo', o === b); });
      const st = LM.load(); st.profilo.vibra = b.getAttribute('data-vibra') === 'no' ? 'no' : 'si'; LM.save();
      if (st.profilo.vibra === 'si') vibra('leggero');
    });
  });
  root.querySelectorAll<HTMLElement>('#seg-eff [data-eff]').forEach(function (b) {
    b.addEventListener('click', function () {
      root.querySelectorAll<HTMLElement>('#seg-eff [data-eff]').forEach(function (o) { o.classList.toggle('attivo', o === b); });
      /* i tre gradini sono tre: un attributo scritto male tornava «pieni»
         per caso, e adesso lo dice il tipo invece del caso */
      const q = b.getAttribute('data-eff');
      setEffetti(q === 'minimi' ? 'minimi' : (q === 'ridotti' ? 'ridotti' : 'pieni'));
    });
  });
  root.querySelectorAll<HTMLElement>('#seg-scorri [data-scorri]').forEach(function (b) {
    b.addEventListener('click', function () {
      root.querySelectorAll<HTMLElement>('#seg-scorri [data-scorri]').forEach(function (o) { o.classList.toggle('attivo', o === b); });
      setScorri(b.getAttribute('data-scorri') === 'no' ? 'no' : 'si');
    });
  });
  /* come gli altri segmenti, ma il valore non si può indovinare con un
     ternario: sono tre. Si legge l'attributo e si scarta quello che non è
     uno dei tre — il pannello è HTML, e l'HTML lo può cambiare chiunque
     apra gli strumenti del browser. */
  root.querySelectorAll<HTMLElement>('#seg-forma [data-schermata]').forEach(function (b) {
    b.addEventListener('click', function () {
      root.querySelectorAll<HTMLElement>('#seg-forma [data-schermata]').forEach(function (o) { o.classList.toggle('attivo', o === b); });
      const q = b.getAttribute('data-schermata');
      setForma(q === 'spina' ? 'spina' : q === 'poi' ? 'poi' : 'scheda');
    });
  });
  root.querySelectorAll<HTMLElement>('#seg-nav [data-nav]').forEach(function (b) {
    b.addEventListener('click', function () {
      /* il pannello resta aperto: il segmento si aggiorna da sé, così si
         vede subito la barra cambiare dietro senza chiudere niente */
      root.querySelectorAll<HTMLElement>('#seg-nav [data-nav]').forEach(function (o) { o.classList.toggle('attivo', o === b); });
      setNav(b.getAttribute('data-nav') === 'tutte' ? 'tutte' : 'tre');
    });
  });
  root.querySelectorAll<HTMLElement>('#seg-modo [data-modo]').forEach(function (b) {
    b.addEventListener('click', function () {
      const q = b.getAttribute('data-modo');
      setModo(q === 'light' ? 'light' : (q === 'dark' ? 'dark' : 'auto'));
    });
  });
  root.querySelectorAll<HTMLElement>('#seg-skin [data-skin]').forEach(function (b) {
    b.addEventListener('click', function () {
      setSkin(b.getAttribute('data-skin') === 'arcade' ? 'arcade' : 'quiete');
    });
  });
  var la = root.querySelector<HTMLElement>('#imp-accedi');
  if (la) la.addEventListener('click', function () { if (window.LMCloud && window.LMCloud.available) window.LMCloud.signIn(); });
  var le = root.querySelector<HTMLElement>('#imp-esci');
  if (le) le.addEventListener('click', function () {
    chiudiSheet();
    Promise.resolve(window.LMCloud ? window.LMCloud.signOut() : undefined).then(function () {
      location.hash = '#/oggi'; render();
      toast('Disconnesso. I dati restano nel tuo account.', 0, 'logout');
    });
  });
  var d = root.querySelector<HTMLElement>('#imp-demo'); if (d) d.addEventListener('click', caricaDemo);
  var an = root.querySelector<HTMLSelectElement>('#imp-area-nuova');
  if (an) an.addEventListener('change', function () {
    const v = an ? an.value : '';
    const st = LM.load(); if (v) st.profilo.areaNuova = v; else delete st.profilo.areaNuova; LM.save();
    toast(v === '-' ? 'Area predefinita: nessuna' : v ? 'Area predefinita: ' + areaById(v).nome : 'Area predefinita: automatica', 0, 'aree');
  });
  var te = root.querySelector<HTMLElement>('#imp-togli-esempio');
  if (te) te.addEventListener('click', function () {
    const n = LM.contaEsempio();
    avviso({ titolo: 'Togliere i dati di esempio?', testo: 'Tolgo ' + n + ' cose d’esempio. Quello che hai scritto tu resta. Prima faccio un backup.', azione: 'Rimuovi' }, function () {
      const tolte = LM.togliEsempio();
      chiudiSheet(); render();
      toast('Tolti ' + tolte + ' dati di esempio', 0, 'sparkles');
    });
  });
  var z = root.querySelector<HTMLElement>('#imp-azzera'); if (z) z.addEventListener('click', azzeraTutto);
  var e = root.querySelector<HTMLElement>('#imp-esporta'); if (e) e.addEventListener('click', esportaDati);
  var b2 = root.querySelector<HTMLElement>('#imp-backup'); if (b2) b2.addEventListener('click', apriBackups);
  var ar = root.querySelector<HTMLElement>('#imp-aree'); if (ar) ar.addEventListener('click', apriAree);
  var asp = root.querySelector<HTMLElement>('#imp-aspetto'); if (asp) asp.addEventListener('click', apriAspetto);
  var itm = root.querySelector<HTMLElement>('#imp-timer'); if (itm) itm.addEventListener('click', function () { apriFoglio('Timer', 'imp-timer', {}); });
  var imu = root.querySelector<HTMLElement>('#imp-musica'); if (imu) imu.addEventListener('click', function () { apriFoglio('Musica', 'musica', {}); });
  var gu = root.querySelector<HTMLElement>('#imp-guida'); if (gu) gu.addEventListener('click', apriGuida);
  var sc = root.querySelector<HTMLElement>('#imp-scienza');
  if (sc) sc.addEventListener('click', function () { chiudiSheet(); location.hash = '#/scienza'; });
  var lb = root.querySelector<HTMLElement>('#imp-lab');
  if (lb) lb.addEventListener('click', function () { chiudiSheet(); location.hash = '#/lab'; });
  var ri = root.querySelector<HTMLElement>('#imp-ritmo'); if (ri) ri.addEventListener('click', apriRitmo);
  var dg = root.querySelector<HTMLElement>('#imp-diag'); if (dg) dg.addEventListener('click', apriDiagnostica);
  /* Promemoria: il pulsante racconta com'è andata, e il pannello si riscrive
     da sé — se il permesso è appena cambiato, la riga sopra deve cambiare
     con lui, altrimenti resta a dire «spenti» con le notifiche accese. */
  function riscriviImpostazioni() { render(); }
  const pc = root.querySelector<HTMLElement>('#imp-prom-come');
  if (pc) pc.addEventListener('click', apriPromemoria);
  wireAccendiSpegni(root, riscriviImpostazioni);
  root.querySelectorAll<HTMLElement>('[data-diag]').forEach(function (b) { b.addEventListener('click', apriDiagnostica); });
  const imp = root.querySelector<HTMLElement>('#imp-importa');
  const file = root.querySelector<HTMLInputElement>('#imp-file');
  if (imp && file) {
    const campoFile = file;
    imp.addEventListener('click', function () { campoFile.click(); });
    campoFile.addEventListener('change', function () {
      const f = campoFile.files && campoFile.files[0]; if (!f) return;
      const reader = new FileReader();
      reader.onload = function () {
        const r = LM.importJson(String(reader.result));
        if (r.ok) {
          chiudiSheet(); applicaTema(); render();
          /* QUANDO IL FILE È PIÙ VECCHIO DI UN «AZZERA TUTTO», va detto qui e
             non nel registro tecnico: chi ha appena ripescato il suo backup
             sta guardando questo messaggio, e «importati 322 elementi» mentre
             ne sono entrati 91 è la bugia peggiore che l'app possa dire —
             perché toglie la voglia di controllare. Si dice anche la via
             d'uscita, che c'è: la copia presa un istante fa. */
          if (r.tagliati) {
            avviso({
              titolo: 'Importazione parziale',
              testo: r.tagliati + ' righe del file sono più vecchie dell’ultimo «Azzera tutto», e l’azzeramento le tiene fuori: è quello che impedisce al cloud di rimettere indietro quello che hai cancellato.<br><br>Se volevi davvero riavere quel file com’era, in «Backup e ripristino» c’è la copia presa un istante fa, prima di questa importazione.',
              azione: 'OK'
            });
          } else {
            toast('Dati importati (' + r.ricchezza + ' elementi).', 0, 'upload');
          }
        }
        else { toast(r.err || 'Importazione non riuscita.', 0, 'avviso'); }
      };
      reader.readAsText(f);
    });
  }
}

export function esportaDati(): void {
  try {
    const blob = new Blob([LM.exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'lifemax-' + LM.todayKey() + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    LM.registra('dati', 'Dati esportati in un file .json', true); LM.save();
    toast('Dati esportati nel file .json.', 0, 'download');
  } catch (e) { toast('Esportazione non riuscita.', 0, 'avviso'); }
}

export function apriBackups() {
  apriFoglio('Backup e ripristino', 'backup', {});
}

/* ---------- registro diagnostico ----------
   Quando qualcosa non torna ("dice ancora Salvataggio…") la domanda vera è
   una sola: i miei dati sono al sicuro? Qui la risposta si legge in chiaro,
   con la cronologia di cosa è successo e un pulsante che copia tutto —
   perché il problema si vede sul telefono, dove non c'è nessuna console. */

let LOG_SOLO_PROBLEMI = false;

/* come sta il salvataggio, spiegato a chi guarda: una classe per il colore,
   un titolo e una riga di testo */
export interface Spiegazione { cls: string; tit: string; txt: string }
export function statoSalvataggioSpiegato(): Spiegazione {
  const y = window.LM_SYNC || { state: 'idle' as const, error: '', at: 0, inCoda: false };
  const a = window.LM_AUTH || { available: false, user: null, syncing: false };
  const locale = 'Sul telefono o computer che stai usando i dati sono salvati subito, sempre.';
  if (!a.available) return { cls: 'diag-ok', tit: 'Solo su questo dispositivo', txt: locale + ' Il cloud non è raggiungibile da qui, quindi non c’è copia online.' };
  if (!a.user) return { cls: 'diag-ok', tit: 'Solo su questo dispositivo', txt: locale + ' Accedi con Google per avere anche una copia nel cloud.' };
  /* L'ASCOLTO È UNA COSA A PARTE DAL SALVATAGGIO, e va detta.
     Si può stare salvando benissimo nel cloud e non SENTIRE più niente
     dagli altri dispositivi: sono due canali diversi, e quello che ascolta
     cade da solo (una galleria, un cambio di cella). Finché non lo si
     scriveva da nessuna parte, un dispositivo diventato sordo aveva
     esattamente lo stesso aspetto di uno a posto — e intanto si allontanava
     dagli altri. */
  if (a.user && a.ascolto === false) {
    return { cls: 'diag-attesa', tit: 'Salva, ma non sente gli altri dispositivi',
      txt: locale + ' Il canale che riceve le modifiche dagli altri dispositivi è caduto e si sta riattaccando da sé: le loro modifiche arriveranno con un po\u2019 di ritardo. Se sei sotto una galleria o senza campo, è normale.' };
  }
  if (y.state === 'saved') return { cls: 'diag-ok', tit: 'Al sicuro anche nel cloud', txt: 'Ultima conferma dal server alle ' + oraDi(y.at) + '. ' + locale };
  if (y.state === 'saving') return { cls: 'diag-corso', tit: 'Salvataggio nel cloud in corso', txt: locale + ' Sta arrivando la conferma del server.' };
  if (y.state === 'attesa') return { cls: 'diag-attesa', tit: 'Salvato qui, in coda per il cloud', txt: locale + ' La copia online partirà appena c’è rete: non serve fare niente.' + (y.at ? ' Ultima copia nel cloud: ' + oraDi(y.at) + '.' : '') };
  if (y.state === 'muto' || y.state === 'error') return { cls: 'diag-guasto', tit: 'Il cloud non sta salvando', txt: (y.error || '') + ' ' + locale };
  return { cls: 'diag-ok', tit: 'Niente in sospeso', txt: locale };
}

export function righeLogHtml(): string {
  const reg = window.LMLog;
  if (!reg) return '<div class="imp-nota" style="margin:0">Registro non disponibile.</div>';
  let r = reg.righe();
  if (LOG_SOLO_PROBLEMI) r = r.filter(function (x) { return x.liv !== 'info'; });
  if (!r.length) return '<div class="diag-vuoto">' + (LOG_SOLO_PROBLEMI ? 'Nessun problema registrato.' : 'Ancora niente da mostrare.') + '</div>';
  /* dal più recente: su un telefono l'ultima cosa avvenuta deve stare
     davanti agli occhi, non in fondo a 300 righe */
  return r.slice().reverse().map(function (x) {
    return '<div class="diag-riga liv-' + x.liv + '"><span class="diag-ora">' + reg.ora(x.t) + '</span>' +
      '<span class="diag-can">' + esc(x.can) + '</span>' +
      '<span class="diag-msg">' + esc(x.msg) + (x.dati ? '<i>' + esc(x.dati) + '</i>' : '') + '</span></div>';
  }).join('');
}

export function apriDiagnostica() {
  apriFoglio('Registro tecnico', 'diagnostica', {}, true);
}

/* IL CABLAGGIO DEL REGISTRO TECNICO NON STA PIÙ QUI.
   C'era `wireDiagnostica(root)`, il gemello in vanilla del pannello: le
   stesse righe che si infilano in cima, lo stesso filtro, la stessa riga di
   stato. Da quando il pannello è `fogli/Diagnostica.tsx` non lo chiamava più
   nessuno, e tenerlo costava più di quanto rendesse: riscriveva con
   `innerHTML` una riga che adesso disegna React, cioè era una copia
   funzionante del guasto che abbiamo appena tolto dai Rituali, pronta per
   chi passa di qui e copia una riga che «lì funzionava». */

/* ---------- gestione aree (personalizzabili) ---------- */

/* Solo segni delle aree: prima si potevano scegliere anche la stella, la
   fiamma, il fulmine, la provetta, il bersaglio e le stelline — che nell'app
   vogliono già dire priorità, serie, cattura, esperimenti, «Oggi» e «extra».
   Un'area con la stella finiva accanto alla stella della priorità, e le due
   figure identiche dicevano due cose diverse nella stessa riga. */
export const ICONE_AREA = ['book', 'heart', 'users', 'wallet', 'landmark', 'rocket', 'briefcase',
  'lightbulb', 'casa', 'musica', 'globo', 'pesi', 'user', 'shield'];

export function apriAree() {
  apriFoglio('Le tue aree', 'aree', {});
}

/* ---------- guida in-app ---------- */

export function apriGuida() {
  apriFoglio('Primi passi', 'guida', {});
}

/* Lo stesso blocco che stava nel menu «Altro»: chi è connesso, com'è andato
   il salvataggio, entra ed esci. Toccava sparire con «Altro», e invece è la
   cosa che si va a cercare quando si dubita che i dati siano al sicuro. */
/* IL BLOCCO DELL'ACCOUNT dentro le impostazioni. Non porta la sua etichetta:
   ce l'ha già sopra («Account»), e due titoli per lo stesso blocco erano uno
   di troppo. Lo stato del salvataggio resta CLICCABILE: chi legge
   «Salvataggio…» vuole sapere subito perché, e la spiegazione deve stare
   dietro quella parola. */
function htmlAccount() {
  var a = window.LM_AUTH || { available: false, user: null };
  if (a.user) {
    var y = statoSync();
    return '<div class="lista">' +
      '<div class="lista-riga sc-riga"><span class="sc-eti">' + ICO('cloudCheck', 15) + ' Connesso come</span>' +
      '<span class="sc-val">' + esc(a.user.name || a.user.email) + '</span></div>' +
      rigaFa('imp-esci', 'logout', 'Esci dall’account') +
      '</div>' +
      '<button type="button" class="sync-chip sync-chip-largo ' + y.cls + '" data-diag="1" title="' + esc(y.title || 'Mostra cosa sta succedendo') + '">' +
      ICO(y.ico, 13) + ' ' + y.testo + ICO('arrowRight', 13) + '</button>';
  }
  if (a.available) {
    return '<button class="btn btn-accedi" id="imp-accedi" style="width:100%;justify-content:center">' + GOOGLE_G(15) + ' Accedi con Google</button>' +
      nota('I dati stanno su questo dispositivo. Accedi per ritrovarli su tutti.');
  }
  return '<div class="lista"><div class="lista-riga sc-riga">' +
    '<span class="sc-eti">' + ICO('soloQui', 15) + ' Sincronizzazione</span>' +
    '<span class="sc-val">su questo dispositivo</span></div></div>';
}

export function apriImpostazioni() {
  apriSheet('Impostazioni', htmlImpostazioni(), wireAspettoDati, false, { nome: 'Impostazioni', apri: apriImpostazioni });
}
function apriProfilo() { chiudiSheet(); location.hash = '#/profilo'; }
export function apriAspetto() {
  apriSheet('Aspetto', htmlAspetto(), wireAspettoDati, false, { nome: 'Aspetto', apri: apriAspetto });
}

/* CHE COSA C'È NEL MENU — una sola volta, e la leggono in due.
   Stessa gerarchia della barra laterale: dentro ci finiscono le pagine che
   non stanno nella barra in basso, e sotto quelle secondarie; senza livelli
   sarebbero un elenco piatto in cui «Giornata» pesa come una pagina da
   leggere una volta sola.
   Con le tre porte non serve nessun elenco: ogni schermata sta a un tocco
   dalle linguette sotto al titolo della sua porta, e qui l'elenco è vuoto. */
export function vociMenu() {
  if (navTre()) return { extra: [], secondarie: [] };
  return {
    extra: primarie().filter(function (v) { return TAB_MOBILE.indexOf(v.id) < 0; }), /* es. Giornata */
    secondarie: VISTE.filter(function (v) { return v.gruppo === 'secondaria'; })
  };
}

export function apriMenuAltro() {
  apriFoglio('Menu', 'menu', {});
}

/* ---------- riga di aggiunta rapida ----------
   Aggiungere è la cosa che si fa più spesso e più di fretta: se il campo
   sta in fondo alla pagina, il pensiero si perde prima di arrivarci — con
   l'attenzione che salta, la finestra utile tra «mi è venuto in mente» e
   «l'ho scritto» si misura in secondi. Quindi sta in cima.

   Ma in cima non può occupare mezzo schermo, o coprirebbe proprio ciò che
   si è venuti a vedere. Quindi è UNA riga: il campo e il più. Le opzioni
   per pianificare (quando, area, giorni) si aprono solo mentre scrivi —
   cioè esattamente quando non stai leggendo la lista — e si richiudono da
   sole appena hai finito. A riposo non costa niente.

   Su un telefono c'è un motivo in più: la tastiera copre il fondo dello
   schermo, e un campo in basso finisce sotto la tastiera che serve a
   riempirlo. In alto resta sempre visibile. */

/* L'etichetta di un gruppo. Porta il segno della cosa che nomina, quando
   quella cosa ha già un segno suo: dentro una scheda lunga è quello che
   fa trovare il blocco giusto senza rileggere tutte le intestazioni. Dove
   un segno onesto non c'è — «Dopo questa», «Le altre» — non se ne inventa
   uno: un glifo scelto per riempire il posto è una figura in più da
   decifrare, non un aiuto.  */
export function etichetta(testo: string, ico?: string, conta?: number | string): string {
  return '<div class="lista-eti">' + (ico ? ICO(ico, 11) : '') + testo +
    (conta != null ? ' <span>' + conta + '</span>' : '') + '</div>';
}

export function rigaAggiunta(id: string, segnaposto: string, opzioniHtml?: string): string {
  return '<form class="agg" id="' + id + '" autocomplete="off" novalidate>' +
    '<div class="agg-riga">' +
    '<input type="text" class="agg-testo" placeholder="' + esc(segnaposto) + '" aria-label="' + esc(segnaposto) + '" enterkeyhint="done">' +
    /* il segno più dice da sé cosa fa: quando lo schermo è strettissimo la
       scritta sparisce e il tasto resta comunque comprensibile */
    '<button class="btn btn-mini btn-tinta agg-ok" type="submit" aria-label="Aggiungi">' + ICO('plus', 15) + '<span class="agg-ok-eti">Aggiungi</span></button></div>' +
    (opzioniHtml ? '<div class="agg-opz" hidden>' + opzioniHtml + '</div>' : '') +
    '</form>';
}

/* i form già collegati: vedi il commento dentro a `wireRigaAggiunta` */
const collegate = new WeakSet<Element>();

/* Collega la riga: le opzioni si aprono al primo carattere, si chiudono
   quando il campo torna vuoto e si perde il fuoco. `onInvio(testo, opz)`
   riceve il testo e il contenitore delle opzioni. */
export function wireRigaAggiunta(scope: ParentNode, id: string, onInvio: (testo: string, opz: HTMLElement) => void): void {
  const form = scope.querySelector<HTMLElement>('#' + id);
  if (!form) return;
  /* UNA VOLTA SOLA PER NODO, e non è prudenza: è una perdita misurata.
     Chi chiama è un effetto di React che gira a ogni ridisegno, e React il
     `<form>` lo TIENE fra un disegno e l'altro — è lo stesso nodo. Senza
     questo controllo ogni giro ne attaccava altri cinque: dieci ridisegni,
     cinquanta ascoltatori, e l'app sta aperta per giorni su un telefono.
     Il `submit` sembrava innocuo perché il campo si svuota e i doppioni
     escono subito dal controllo del testo vuoto — ma `input`, `focus`,
     `keydown` e `focusout` scattavano davvero N volte, e ognuno dei
     `focusout` metteva giù il suo `setTimeout`.
     Il segno sta sul NODO e non in una variabile di modulo: quando React
     rifà il form per davvero, il nodo nuovo non è in questo insieme e si
     ricollega — che è quello che deve succedere.
     E sta in un `WeakSet` e non in un attributo `data-`: un attributo è DOM,
     cioè una cosa che si vede in pagina, e `prove/impronte.js` ha ragione a
     chiamarla una differenza. Un insieme debole dice la stessa cosa senza
     lasciare traccia, e lascia andare il nodo appena la pagina lo butta. */
  if (collegate.has(form)) return;
  collegate.add(form);
  /* il campo lo ha scritto `rigaAggiunta` dentro a quel form: se non c'è,
     non c'è niente da collegare — e prima si andava avanti a chiamare
     `inp.addEventListener` su un niente */
  const inp = form.querySelector<HTMLInputElement>('.agg-testo');
  if (!inp) return;
  const opz = form.querySelector<HTMLElement>('.agg-opz');
  const ilForm = form;
  function apri(v: boolean) {
    if (!opz) return;
    opz.hidden = !v;
    ilForm.classList.toggle('agg-aperta', !!v);
  }
  inp.addEventListener('input', function () { if (inp.value.trim()) apri(true); });
  inp.addEventListener('focus', function () { if (inp.value.trim()) apri(true); });
  /* Esc svuota e richiude: una via d'uscita senza dover cancellare a mano */
  inp.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.stopPropagation(); inp.value = ''; apri(false); inp.blur(); }
  });
  form.addEventListener('focusout', function () {
    setTimeout(function () {
      if (!form.contains(document.activeElement) && !inp.value.trim()) apri(false);
    }, 0);
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const v = inp.value.trim();
    if (!v) { inp.focus(); return; }
    /* SENZA OPZIONI SI PASSA IL FORM. `onInvio` riceve il contenitore delle
       opzioni per andarci a leggere l'area scelta; dove le opzioni non ci
       sono, tutti i chiamanti fanno `sel ? sel.value : 'altro'` — cioè
       cercano dentro e non trovano. Passare il form invece di un niente è la
       stessa cosa per loro, e non è più un `null` che gira. */
    onInvio(v, opz || form);
    inp.value = '';
    apri(false);
    /* il fuoco resta nel campo: chi butta giù una cosa spesso ne butta giù
       tre di seguito, e non deve ricliccare ogni volta */
    inp.focus();
  });
}

/* ---------- helper UI ---------- */

export function areaById(id: string | null | undefined): Area {
  const aree = LM.load().aree;
  /* l'ultima è «Altro», e c'è sempre: `statoVuoto()` la mette, e le aree non
     si cancellano (si spengono) */
  return aree.find(function (a) { return a.id === id; }) || presa(aree[aree.length - 1]);
}

/* Il segno dell'area: il glifo colorato che sta accanto a una cosa da fare.
   Era scritto a mano in sei posti con quattro nomi di classe diversi, e in
   quattro di quei sei non diceva il proprio nome a nessuno — il title non
   esiste sul tocco e l'icona è aria-hidden, quindi per chi legge con la voce
   l'area non c'era affatto. Uno solo, che si annuncia. */
function segnoArea(ar: Area | null | undefined, dim?: number, cls?: string): string {
  if (!ar) return '';
  return '<span class="segno-area' + (cls ? ' ' + cls : '') + '" role="img"' +
    ' aria-label="Area: ' + esc(ar.nome) + '" title="' + esc(ar.nome) + '"' +
    ' style="--c-area:' + LM.coloreArea(ar) + '">' + ICO(ar.icona, dim || 13) + '</span>';
}

export function areeAttive() {
  var s = LM.load();
  return s.aree.filter(function (a) { return s.areeAttive.indexOf(a.id) >= 0; });
}

/* l'area con cui nasce una cosa nuova: quella scelta in Impostazioni, se c'è
   ed è ancora accesa, se no quella che dice chi chiama, se no «Altro» */
export function areaNuova(ripiego?: string): string {
  const s = LM.load();
  const scelta = s.profilo.areaNuova;
  if (scelta === '-') return 'altro';
  if (scelta && s.areeAttive.indexOf(scelta) >= 0) return scelta;
  return ripiego || 'altro';
}
export function selectAree(id: string, selezionata?: string | null, etichetta?: string, cls?: string): string {
  const sel = selezionata === undefined ? areaNuova() : selezionata;
  return '<select id="' + id + '"' + (cls ? ' class="' + cls + '"' : '') + ' aria-label="' + esc(etichetta || 'Area') + '">' + areeAttive().map(function (a) {
    return '<option value="' + a.id + '"' + (a.id === sel ? ' selected' : '') + '>' + esc(a.nome) + '</option>';
  }).join('') + '</select>';
}

/* LA TESTA DI UNA SCHERMATA
   «Cosa servono i titoli se c'è già scritto nei pulsanti i nomi?» Misurato:
   su sei schermate, quattro scrivevano lo stesso nome due volte già sul
   telefono (il titolo e la linguetta attiva), sei su sei su desktop, dove
   lo scrive anche la colonna. E il titolo non era nemmeno coerente: su
   «Adesso» diceva la porta («Oggi»), sulle altre due stanze della stessa
   porta diceva la stanza, e il nome della porta spariva.
   Adesso il nome sta in un posto solo, e quel posto è la navigazione: la
   porta la dice la barra in basso (o la colonna), la stanza la dice la
   linguetta accesa. Il titolo resta come intestazione per chi naviga con
   un lettore di schermo o per intestazioni — dove il nome è già in vista
   non si ripete, e la riga in cima si stampa solo se ha davvero qualcosa da
   tenere (un comando a destra). Su una pagina che si apre dalle
   impostazioni e non sta in nessuna barra il titolo si vede, e lì anche una
   riga di spiegazione serve: la leggi una volta e sai dove sei finito.

   `giaNellaNav`: il nome è già scritto nella navigazione. */
export function topbar(titolo: string, sottotitolo?: string, destra?: string, cls?: string, giaNellaNav?: boolean): string {
  var h1 = '<h1' + (giaNellaNav ? ' class="solo-lettori"' : '') + '>' + titolo + '</h1>';
  if (giaNellaNav && !destra && !sottotitolo) return h1;
  /* una riga che tiene solo un comando è una barra di strumenti, non una
     testa: respira meno sotto */
  return '<div class="topbar' + (giaNellaNav ? ' topbar-nuda' : '') + (cls ? ' ' + cls : '') + '">' +
    (giaNellaNav ? h1 : '<div>' + h1 + (sottotitolo ? '<div class="sottotitolo">' + sottotitolo + '</div>' : '') + '</div>') +
    '<div class="spazio"></div>' + (destra || '') + '</div>';
}

function refreshObAccount() {
  var el = document.getElementById('ob-account');
  if (!el) return;
  var a = window.LM_AUTH || { available: false, user: null };
  if (a.user) {
    el.innerHTML = '<div class="ob-account-in">' + ICO('cloudCheck', 15) + ' Accesso eseguito come <b>' + esc(a.user.name || a.user.email) + '</b></div>';
  } else if (a.available) {
    el.innerHTML = '<button class="btn btn-accedi" id="ob-accedi">' + GOOGLE_G(18) + ' Accedi con Google</button>' +
      '<div class="ob-account-nota">Accedi per ritrovare i tuoi dati su tutti i dispositivi. Puoi anche continuare senza account e collegarlo più avanti.</div>';
    var b = document.getElementById('ob-accedi');
    if (b) b.addEventListener('click', function () {
      if (window.LMCloud && window.LMCloud.available) window.LMCloud.signIn();
    });
  } else {
    el.innerHTML = '';
  }
}

function bandaDemo(): void {
  const s = LM.load();
  const banda = perId('banda-demo');
  /* l'altezza della banda finisce in una variabile CSS: serve a far stare la
     pagina "Oggi" esattamente in una schermata, senza scorrimento inutile */
  function misura() {
    document.documentElement.style.setProperty('--banda-h', (banda.offsetHeight || 0) + 'px');
  }
  if (!s.demo || s.demoChiusa) { if (scriviSe(banda, '')) misura(); return; }
  /* sul telefono il testo lungo occupava due righe e mangiava mezzo schermo */
  const htmlBanda = '<div class="banda-demo"><span>' + ICO('sparkles', 13) +
    ' <b>Dati di esempio</b></span>' +
    '<button class="sp-link banda-togli" id="banda-togli">Rimuovi</button>' +
    '<button class="banda-x" id="banda-x" aria-label="Nascondi">' + ICO('x', 15) + '</button></div>';
  /* la banda non cambia mai finché è aperta: la si riscriveva a ogni spunta */
  if (!scriviSe(banda, htmlBanda)) return;
  misura();
  /* il tasto è dentro all'HTML che abbiamo appena scritto due righe sopra */
  presa(document.getElementById('banda-togli')).addEventListener('click', function () {
    const tolte = LM.togliEsempio(); scriviSe(banda, ''); misura(); render();
    toast('Tolti ' + tolte + ' dati di esempio', 0, 'sparkles');
  });
  presa(document.getElementById('banda-x')).addEventListener('click', function () {
    LM.load().demoChiusa = true; LM.save(); scriviSe(banda, ''); misura();
  });
}

/* ============================================================
   VISTA: FOCUS
   ============================================================ */

/* ============================================================
   IL TIMER

   Quattro tipi, e non sono quattro durate: sono quattro modi diversi di
   stare davanti a una cosa.

     · avvio        cinque minuti. Non serve a fare la cosa, serve a
                    COMINCIARLA. Quando il problema è che non si parte, la
                    durata giusta è la più piccola che si riesca ad
                    accettare — e una cosa cominciata tira a tornarci
                    (Zeigarnik). Sul compito che si sta evitando è l'unica
                    offerta sensata.
     · blocco       la durata che la cosa ha già addosso, o venticinque.
                    Un pezzo di tempo dichiarato, con una fine.
     · pomodoro     blocchi con la pausa dentro. La pausa non è un premio,
                    è il pezzo che rende ripetibile il blocco: senza, il
                    secondo blocco non parte mai.
     · libero       conta in avanti, senza traguardo. Per quando dire
                    quanto durerà è già una decisione di troppo — che è
                    esattamente il momento in cui un conto alla rovescia
                    diventa un motivo per non cominciare.

   Tutto quello che serve per sapere a che punto siamo sta nei DATI, in
   istanti assoluti (`fine`, non «restano N minuti»). Quindi: chiudi il
   telefono e va avanti, ricarichi la pagina e c'è ancora, apri un altro
   dispositivo e trova lo stesso numero, senza che nessuno debba raccontare
   niente a nessuno. Il conto alla rovescia non si salva mai, perché un
   conto alla rovescia salvato invecchia appena lo scrivi.
   ============================================================ */
/* I QUATTRO MODI DI CONTARE IL TEMPO. `poi` e `pausa` esistono per uno solo
   ciascuno, e prima erano due campi che comparivano in una riga su quattro. */
export interface TipoTimer {
  nome: string;
  min: number;
  ico: string;
  dice: string;
  eti?: string;
  /* «Solo per partire»: cinque minuti, e poi va avanti da sé di questi */
  poi?: number;
  /* il pomodoro, e nessun altro */
  pausa?: number;
}
export type NomeTimer = 'avvio' | 'blocco' | 'pomodoro' | 'libero';

export const TIPI_TIMER: Record<NomeTimer, TipoTimer> = {
  avvio:    { nome: 'Avvio rapido', min: 5,  eti: '5 min',  ico: 'play', poi: 25,
              dice: 'Cinque minuti, poi va avanti da solo di 25.' },
  blocco:   { nome: 'Sessione',        min: 25, eti: '25 min', ico: 'clock',
              dice: 'Un pezzo di tempo con una fine.' },
  pomodoro: { nome: 'Pomodoro',         min: 25, pausa: 5, ico: 'refresh',
              dice: '25 minuti, poi 5 di pausa. E si ricomincia.' },
  libero:   { nome: 'Cronometro',       min: 0,  ico: 'durata',
              dice: 'Conta in avanti. Fermi tu quando vuoi.' }
};

let battitoTimer2: ReturnType<typeof setInterval> | null = null;

/* I TIPI COME LI HAI REGOLATI TU. `TIPI_TIMER` sono i valori di partenza;
   le durate vere stanno nelle impostazioni (Impostazioni → Timer). */
export function tipiTimer(): Record<NomeTimer, TipoTimer> {
  const r = (LM.load().profilo.timer || {}) as ImpostazioniTimer;
  const n = function (v: number | undefined, d: number): number { return typeof v === 'number' && v > 0 ? v : d; };
  const avvio = n(r.avvio, 5), poi = n(r.poi, 25), blocco = n(r.blocco, 25), pom = n(r.pomodoro, 25), pausa = n(r.pausa, 5);
  return {
    avvio: Object.assign({}, TIPI_TIMER.avvio, { min: avvio, poi: poi, eti: avvio + ' min',
      dice: avvio + ' minuti, poi va avanti da solo di ' + poi + '.' }),
    blocco: Object.assign({}, TIPI_TIMER.blocco, { min: blocco, eti: blocco + ' min' }),
    pomodoro: Object.assign({}, TIPI_TIMER.pomodoro, { min: pom, pausa: pausa,
      dice: pom + ' minuti, poi ' + pausa + ' di pausa. E si ricomincia.' }),
    libero: TIPI_TIMER.libero
  };
}
/* la pausa dopo il blocco numero `ciclo`: ogni quattro, quella lunga */
function pausaDopo(ciclo: number): number {
  const r = (LM.load().profilo.timer || {}) as ImpostazioniTimer;
  const corta = r.pausa && r.pausa > 0 ? r.pausa : 5;
  const lunga = r.pausaLunga && r.pausaLunga > 0 ? r.pausaLunga : 0;
  return lunga && ciclo % 4 === 0 ? lunga : corta;
}

/* QUESTO DISPOSITIVO. Il timer sa chi lo fa andare: con due telefoni aperti
   sullo stesso account tutti e due vedono lo stesso timer, ma i minuti li
   scrive uno solo. Se quello sparisce (chiuso, spento) un altro, passati due
   minuti dalla scadenza, prende il suo posto. */
const QUESTO: string = (function () {
  try {
    let v = localStorage.getItem('lm-dispositivo');
    if (!v) { v = 'd' + Math.random().toString(36).slice(2, 10); localStorage.setItem('lm-dispositivo', v); }
    return v;
  } catch (_e) { return 'd-senza-memoria'; }
})();
function mioTimer(t: TimerVivo): boolean { return !t.dispositivo || t.dispositivo === QUESTO; }

function timerOra(): TimerVivo | null { return LM.timerVivo(); }
function timerDiQuesta(id: string): TimerVivo | null { const t = timerOra(); return t && t.azioneId === id ? t : null; }

/* quanti millisecondi mancano (o sono passati, per il libero) */
function timerResta(t: TimerVivo | null): number {
  if (!t) return 0;
  if (t.inPausa) return Math.max(0, (t.pausaFine || 0) - Date.now());
  const ora = t.fermoDa || Date.now();
  if (t.tipo === 'libero') return ora - t.inizio;
  return Math.max(0, t.fine - ora);
}
/* PAUSA A MANO: il tempo si ferma; alla ripresa inizio e fine slittano di
   quanto è durata la pausa, così i minuti registrati restano solo quelli veri */
function sospendiTimer(): void {
  const t = timerOra();
  if (!t || t.inPausa || t.fermoDa) return;
  LM.aggiornaTimerDati({ fermoDa: Date.now() });
  if (concentrazioneAperta()) disegnaConcentrazione();
  passoTimer();
}
function riprendiDaPausa(): void {
  const t = timerOra();
  if (!t || !t.fermoDa) return;
  const d = Date.now() - t.fermoDa;
  LM.aggiornaTimerDati({ fermoDa: 0, inizio: t.inizio + d, fine: t.fine ? t.fine + d : t.fine });
  if (concentrazioneAperta()) disegnaConcentrazione();
  passoTimer();
}
function fmtCrono(ms: number): string {
  const sec = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(sec / 60), ss = ('0' + (sec % 60)).slice(-2);
  if (m < 60) return m + ':' + ss;
  return Math.floor(m / 60) + ':' + ('0' + (m % 60)).slice(-2) + ':' + ss;
}

/* la musica di quell'area, o quella di sempre */
export function musicaPer(areaId: string | null | undefined): string {
  const m = LM.load().profilo.musica || {};
  return (areaId && m.aree && m.aree[areaId]) || m.predefinita || '';
}
export function apriMusica(url: string): void {
  if (!url) return;
  /* si apre nell'app di Spotify o di YouTube Music: è lei che continua a
     suonare a schermo spento. Il timer va avanti per conto suo, perché
     conta dall'orologio e non dai secondi passati sulla pagina. */
  try { window.open(url, '_blank', 'noopener'); } catch (_e) { location.href = url; }
}

export function avviaTimer(azioneId: string | null, minuti: number | null, areaId?: string | null, tipo?: NomeTimer, testo?: string, giaChiesto?: boolean): void {
  /* UN TIMER STA GIÀ ANDANDO SU UN ALTRO DISPOSITIVO: non lo si butta via
     senza dirlo. Lo si guarda qui, oppure lo si sostituisce. */
  const altro = timerOra();
  if (altro && !mioTimer(altro) && !giaChiesto) {
    const az0 = LM.load().azioni.find(function (x) { return x.id === altro.azioneId; });
    avviso({
      titolo: 'Timer già attivo',
      testo: '«' + ((az0 && az0.testo) || altro.testo || 'Concentrazione') + '» su un altro dispositivo, ' +
        (altro.tipo === 'libero' ? 'da ' : 'mancano ') + fmtCrono(timerResta(altro)) + '.',
      azione: 'Sostituisci', annulla: 'Mostralo'
    }, function () {
      fermaTimer(true);
      avviaTimer(azioneId, minuti, areaId, tipo, testo, true);
    }, function () { battitoTimerAvvia(); apriConcentrazione(); });
    return;
  }
  if (altro && mioTimer(altro)) fermaTimer(true);
  const quale: NomeTimer = tipo || 'blocco';
  const T = tipiTimer()[quale];
  const min = minuti != null ? minuti : T.min;
  const ora = Date.now();
  const az = azioneId ? LM.load().azioni.find(function (x) { return x.id === azioneId; }) : null;
  LM.avviaTimerDati({
    azioneId: azioneId, areaId: areaId || null, tipo: quale,
    testo: testo || '', inizio: ora, durata: min,
    fine: min > 0 ? ora + min * 60000 : 0,
    ciclo: 1, inPausa: false, pausaFine: 0,
    fermatoA: 0,
    /* SE ERI DENTRO, CI TORNI: si segna dov'eri, e si torna lì */
    concentrato: true,
    dispositivo: QUESTO
  });
  battitoTimerAvvia();
  apriConcentrazione();
  render();
  const mus = LM.load().profilo.musica;
  if (mus && mus.conTimer) apriMusica(musicaPer(areaId || (az ? az.areaId : null)));
}

/* i minuti che il timer ha davvero macinato, per il conto delle aree */
function minutiFatti(t: TimerVivo | null): number {
  if (!t) return 0;
  if (t.inPausa) return 0;
  const ora = t.fermoDa || Date.now();
  if (t.tipo === 'libero') return Math.round((ora - t.inizio) / 60000);
  return Math.round((t.durata * 60000 - Math.max(0, t.fine - ora)) / 60000);
}
/* il blocco che si chiude diventa una riga: l'id è il suo inizio, così due
   dispositivi che lo chiudono insieme ne scrivono uno solo */
function chiudiBlocco(t: TimerVivo, minuti: number): string | null {
  if (minuti < 1) return null;
  const st = LM.load();
  const a = st.azioni.find(function (x) { return x.id === t.azioneId; });
  /* il timer può essere su un'abitudine: l'area è la sua */
  const h = a ? null : st.abitudini.find(function (x) { return x.id === t.azioneId; });
  const area = t.areaId || (a ? a.areaId : (h ? h.areaId : null));
  const id = 'ses-' + t.inizio;
  LM.registraSessione({ id: id, areaId: area, azioneId: t.azioneId, testo: (a && a.testo) || (h && h.testo) || t.testo || '',
    tipo: t.tipo, inizio: t.inizio, minuti: minuti });
  return id;
}

function fermaTimer(registra?: boolean): string | null {
  const t = timerOra();
  if (battitoTimer2) { clearInterval(battitoTimer2); battitoTimer2 = null; }
  let id: string | null = null;
  if (t && registra) id = chiudiBlocco(t, minutiFatti(t));
  LM.fermaTimerDati();
  chiudiConcentrazione();
  return id;
}
/* dopo aver fermato: i minuti scritti, e la strada per correggerli */
function dopoFermato(id: string | null, testo: string, icona: string, xp?: number): void {
  toast(testo, xp || 0, icona, id ? { eti: 'Correggi', fai: function () { apriSessioni(); } } : undefined);
}
export function apriSessioni(): void { apriFoglio('Sessioni del timer', 'sessioni', {}); }

/* IL BATTITO. Non ridisegna la pagina: scrive due numeri dove servono. */
function battitoTimerAvvia(): void {
  if (battitoTimer2) return;
  battitoTimer2 = setInterval(passoTimer, 250);
}

/* «HO CONTINUATO A LAVORARE». La pausa non l'hai fatta: il tempo da quando
   è finito il blocco torna lavoro, e il blocco nuovo parte da lì. */
function pausaSaltata(): void {
  const t = timerOra();
  if (!t || !t.inPausa) return;
  const da = t.pausaDa || Date.now();
  LM.aggiornaTimerDati({ inPausa: false, pausaFine: 0, pausaDa: 0, inizio: da,
    fine: da + t.durata * 60000, ciclo: (t.ciclo || 1) + 1, dispositivo: QUESTO });
  toast('Pausa saltata: il tempo conta come lavoro.', 0, 'play');
  disegnaConcentrazione(); render();
}

function passoTimer(): void {
  const t = timerOra();
  if (!t) { if (battitoTimer2) { clearInterval(battitoTimer2); battitoTimer2 = null; } return; }
  const resta = timerResta(t);
  const quota = t.tipo === 'libero' ? 0
    : (t.inPausa
      ? 1 - resta / Math.max(1, (t.pausaFine || 0) - (t.pausaDa || (t.pausaFine || 0) - 300000))
      : Math.min(1, 1 - resta / Math.max(1, t.durata * 60000)));
  document.querySelectorAll<HTMLElement>('[data-timer-cifre]').forEach(function (e) { e.textContent = fmtCrono(resta); });
  document.querySelectorAll<HTMLElement>('[data-timer-anello]').forEach(function (e) { e.style.setProperty('--p', quota.toFixed(4)); });
  if (t.tipo === 'libero' || t.fermoDa) return;
  if (resta > 0) return;
  /* IL TEMPO È FINITO. Se lo fa andare un altro dispositivo, è lui che
     scrive; qui si aspetta. Se dopo due minuti non l'ha fatto (spento,
     chiuso), lo si prende qui. */
  const scaduto = t.inPausa ? (t.pausaFine || 0) : t.fine;
  if (!mioTimer(t) && Date.now() - scaduto < 120000) return;
  const io = { dispositivo: QUESTO };
  if (t.inPausa) {
    const ora = Date.now();
    LM.aggiornaTimerDati(Object.assign({ inPausa: false, pausaFine: 0, pausaDa: 0, inizio: ora,
      fine: ora + t.durata * 60000, ciclo: (t.ciclo || 1) + 1 }, io));
    festeggia('leggero');
    toast('Si riparte. Sessione ' + ((t.ciclo || 1) + 1) + '.', 0, 'refresh');
    avvisoFuori('Pausa finita', 'Si riparte.');
    disegnaConcentrazione(); render();
    return;
  }
  if (t.tipo === 'pomodoro') {
    chiudiBlocco(t, t.durata);
    const p = pausaDopo(t.ciclo || 1);
    LM.aggiornaTimerDati(Object.assign({ inPausa: true, pausaDa: t.fine, pausaFine: t.fine + p * 60000 }, io));
    festeggia('leggero');
    toast('Sessione finita. ' + p + ' minuti di pausa.', 0, 'durata');
    avvisoFuori('Sessione finita', p + ' minuti di pausa.');
    disegnaConcentrazione(); render();
    return;
  }
  /* I MINUTI PER PARTIRE NON SI FERMANO: registra quelli fatti e riparte da
     solo con un blocco intero. Chi voleva smettere ha «Basta così». */
  const tipi = tipiTimer();
  if (t.tipo === 'avvio' && tipi.avvio.poi) {
    chiudiBlocco(t, t.durata);
    const pezzo = tipi.avvio.poi;
    LM.aggiornaTimerDati(Object.assign({ tipo: 'blocco' as NomeTimer, inizio: t.fine, durata: pezzo,
      fine: t.fine + pezzo * 60000, ciclo: (t.ciclo || 1) + 1, daAvvio: true }, io));
    festeggia('leggero');
    toast('Avvio completato. Continuo per ' + pezzo + '.', 0, 'play');
    avvisoFuori('Avvio completato', 'Continuo per ' + pezzo + ' minuti.');
    disegnaConcentrazione(); render();
    return;
  }
  const cosa = LM.load().azioni.find(function (x) { return x.id === t.azioneId; });
  const idS = chiudiBlocco(t, t.durata);
  LM.fermaTimerDati();
  if (battitoTimer2) { clearInterval(battitoTimer2); battitoTimer2 = null; }
  chiudiConcentrazione();
  festeggia('pieno');
  dopoFermato(idS, 'Timer finito. ' + t.durata + ' minuti registrati.', 'durata');
  avvisoFuori('Tempo scaduto', cosa ? cosa.testo : 'Il timer è finito.');
  render();
}
function avvisoFuori(titolo: string, testo: string): void {
  /* un messaggio dentro l'app lo vedi solo se stai guardando l'app, e il
     timer serve proprio per andare a fare la cosa: la fine deve poter
     arrivare anche da fuori. È l'unica notifica che il web sa dare senza un
     server, perché la pagina è ancora viva. */
  P.locale(titolo, testo, '#/oggi');
}

/* ============================================================
   L'ARCHIVIO DELLE REVIEW

   Tutte in una lista sola, dalla più recente, con dentro quello che avevi
   scritto — non un elenco di date da aprire una per una. Le review servono
   messe in fila: «cosa mi ha bloccato» ripetuto per sei sere di seguito è
   un'informazione che nessuna delle sei singole aveva.
   Le tre specie stanno insieme e si distinguono dal segno, non da un
   filtro: sono poche, e un filtro su poche cose è un comando in più per
   guardare meno roba.
   ============================================================ */
export function apriArchivioReview() {
  apriFoglio('Riflessioni passate', 'review', {});
}

/* ============================================================
   «NON CI SONO RIUSCITO»

   Il perché si chiede, ma non si pretende: cinque risposte a un tocco e un
   campo libero, e si può chiudere senza rispondere. Chiedere un perché
   obbligatorio nel momento in cui una cosa è andata male è il modo più
   rapido per far smettere di dirlo — e a quel punto si torna a cancellare,
   che è la cosa che questo esito esiste per evitare.
   Le cinque risposte non sono un questionario: sono le quattro cause che
   l'app può fare qualcosa per te (tempo, energia, dimensione, vaghezza) più
   «altro». Una cosa mancata perché «era troppo grossa» è una cosa da
   spezzare, e prima o poi sarà l'app a poterlo dire.
   ============================================================ */
/* «quanto» in parole, per le righe che lo mostrano */
export function etichettaQuanto(m: Mancata): string {
  if (!m) return '';
  var g = LM.QUANTO_FATTO.find(function (x) { return x.id === m.quanto; });
  return g ? g.eti.toLowerCase() : 'non riuscita';
}
/* chi aveva scelto questa come «la cosa di adesso» non ce l'ha più: il
   fuoco si scorda insieme all'esito */
export function scordaFuoco(id: string): void { if (fuocoScelto === id) fuocoScelto = null; }

export function chiediMancata(id: string, testo: string, dopo?: () => void): void {
  apriFoglio('Non del tutto', 'mancata', { id: id, testo: testo, dopo: dopo });
}

/* ============================================================
   SCEGLIERE IL TIMER

   Quattro voci, non quattro numeri. Un elenco di durate («5 · 10 · 25 ·
   50») chiede di decidere quanto durerà una cosa che non è ancora
   cominciata, che è una domanda a cui nel momento sbagliato non si sa
   rispondere — e restarci sopra è un ottimo modo per non cominciare.
   Quattro modi di stare davanti alla cosa si scelgono in un colpo, perché
   uno dei quattro è come ti senti adesso.
   Il minutaggio del blocco lo porta la cosa stessa (la durata che le hai
   dato trascinandola nella Giornata); dove non c'è, venticinque.
   ============================================================ */
export function scegliTimer(azioneId: string | null, areaId?: string | null, testo?: string, minBlocco?: number, chiedi?: boolean): void {
  /* IL TIMER DI SEMPRE PARTE SUBITO: se in Impostazioni ne hai scelto uno,
     il tocco su «Timer» lo avvia senza domande. Per cambiarlo c'è «Cambia»
     nello schermo della concentrazione. */
  const pred = (LM.load().profilo.timer || {}).predefinito;
  if (pred && !chiedi) {
    avviaTimer(azioneId, pred === 'blocco' && minBlocco ? minBlocco : null, areaId, pred, testo || '');
    return;
  }
  apriFoglio('Timer', 'timer', { azioneId: azioneId, areaId: areaId, testo: testo, minBlocco: minBlocco });
}

/* ============================================================
   CONCENTRAZIONE — lo schermo che non ha niente da dire

   Mentre il timer gira, tutto il resto dell'app è una distrazione con le
   credenziali in regola: le altre cose di oggi, il conteggio, la barra in
   basso che porta altrove. Sono esattamente le cose che a una testa che
   corre offrono una via d'uscita legittima dalla cosa che sta facendo.
   Quindi restano: la frase di cosa stai facendo, il tempo, e due comandi.

   Le scelte, una per una:
     · fondo quasi nero, niente aurora, niente vetro. Meno luce vuol dire
       meno cose che chiedono attenzione, e di sera vuol dire anche meno
       luce blu addosso mentre lavori.
     · il tempo è grandissimo e in cifre tabulari, così le cifre non
       ballano di larghezza a ogni secondo. Un numero che si muove da solo
       è un movimento nel campo visivo, e un movimento chiama l'occhio.
     · l'anello si riempie: dice a che punto sei senza doverlo leggere.
     · «Fatto» è il comando pieno, perché è quello che si spera di premere.
       «Ferma» è smorzato e sta sotto: fermarsi va potuto fare in un tocco,
       ma non va invitato.
     · in pausa cambia colore e lo dice, perché una pausa in cui non sai di
       essere in pausa è solo tempo perso.
     · si esce anche con Esc e col tasto indietro del telefono, e uscendo
       il timer NON si ferma: uscire dallo schermo e smettere sono due cose
       diverse, e confonderle costa il lavoro fatto.
   ============================================================ */
let $conc: HTMLElement | null = null;
export function apriConcentrazione(): void {
  const t = timerOra();
  if (!t) return;
  if (!$conc) {
    const c = document.createElement('div');
    c.className = 'concentra';
    c.setAttribute('role', 'dialog');
    c.setAttribute('aria-modal', 'true');
    c.setAttribute('aria-label', 'Timer a schermo intero');
    document.body.appendChild(c);
    $conc = c;
  }
  disegnaConcentrazione();
  document.body.classList.add('in-concentrazione');
  if (!t.concentrato) LM.aggiornaTimerDati({ concentrato: true });
  battitoTimerAvvia();
}
function disegnaConcentrazione(): void {
  const t = timerOra();
  const c = $conc;
  if (!c || !t) return;
  const T = tipiTimer()[t.tipo];
  const az = LM.load().azioni.find(function (x) { return x.id === t.azioneId; });
  const musica = musicaPer(t.areaId || (az ? az.areaId : null));
  const titolo = (az && az.testo) || t.testo || 'Concentrazione';
  c.innerHTML =
    '<button class="conc-esci" id="conc-esci" aria-label="Torna all’app">' + ICO('x', 18) + '</button>' +
    '<div class="conc-dentro">' +
    '<div class="conc-tipo">' + ICO(T.ico, 13) + ' ' +
    (t.inPausa ? 'Pausa' : (t.fermoDa ? 'In pausa' : T.nome)) +
    (t.tipo === 'pomodoro' && !t.inPausa ? ' · blocco ' + (t.ciclo || 1) : '') + '</div>' +
    '<h2 class="conc-cosa">' + esc(titolo) + '</h2>' +
    '<div class="conc-anello' + (t.inPausa || t.fermoDa ? ' in-pausa' : '') + '" data-timer-anello style="--p:0">' +
    '<div class="conc-cifre" data-timer-cifre>' + fmtCrono(timerResta(t)) + '</div>' +
    '<div class="conc-eti">' + (t.tipo === 'libero' ? 'trascorsi' : (t.inPausa ? 'di pausa' : 'restano')) + '</div>' +
    '</div>' +
    '<div class="conc-tasti">' +
    (t.inPausa ? '<button class="btn btn-grande btn-tinta" id="conc-continuato">' + ICO('play', 18) + ' Salta la pausa</button>' : '') +
    (!t.inPausa ? '<button class="btn btn-grande btn-tinta" id="conc-sospendi">' + (t.fermoDa ? ICO('play', 18) + ' Riprendi' : ICO('pause', 18) + ' Pausa') + '</button>' : '') +
    '<button class="btn btn-ok btn-grande" id="conc-fatto">' + ICO('check', 18) + ' Fatto</button>' +
    '<button class="btn btn-mini btn-ghost" id="conc-ferma">' + ICO('fineperiodo', 15) + ' ' +
    'Termina sessione</button>' +
    '<div class="conc-altri">' +
    (musica ? '<button class="btn btn-mini btn-ghost" id="conc-musica">' + ICO('cuffie', 15) + ' Musica</button>' : '') +
    '<button class="btn btn-mini btn-ghost" id="conc-cambia">' + ICO('refresh', 15) + ' Cambia timer</button>' +
    '</div>' +
    '</div></div>';
  presa(c.querySelector<HTMLElement>('#conc-esci')).addEventListener('click', chiudiConcentrazione);
  presa(c.querySelector<HTMLElement>('#conc-ferma')).addEventListener('click', function () {
    const m = minutiFatti(t);
    const id = fermaTimer(true);
    dopoFermato(id, id ? m + (m === 1 ? ' minuto registrato.' : ' minuti registrati.') : 'Fermato. Meno di un minuto: niente da registrare.', 'durata');
    render();
  });
  const sosp = c.querySelector<HTMLElement>('#conc-sospendi');
  if (sosp) sosp.addEventListener('click', function () { if (timerOra()?.fermoDa) riprendiDaPausa(); else sospendiTimer(); });
  const cont = c.querySelector<HTMLElement>('#conc-continuato');
  if (cont) cont.addEventListener('click', pausaSaltata);
  const mu = c.querySelector<HTMLElement>('#conc-musica');
  if (mu) mu.addEventListener('click', function () { apriMusica(musica); });
  presa(c.querySelector<HTMLElement>('#conc-cambia')).addEventListener('click', function () {
    /* il nuovo prende il posto di questo: i minuti fatti restano */
    scegliTimer(t.azioneId, t.areaId, t.testo, undefined, true);
  });
  presa(c.querySelector<HTMLElement>('#conc-fatto')).addEventListener('click', function () {
    /* UN TIMER LIBERO PUÒ NON ESSERE ATTACCATO A NIENTE: `azioneId` è
       nullabile per costruzione, e senza questo controllo si chiamava
       `completaAzione(null)` — che non trova niente e non dice niente. */
    const id = t.azioneId;
    fermaTimer(true);
    if (!id) { festeggia('pieno'); render(); return; }
    const s = LM.load();
    const ab = s.abitudini.some(function (h) { return h.id === id; });
    const xp = ab ? LM.completaAbitudine(id) : LM.completaAzione(id);
    festeggia('pieno');
    toast(ab ? 'Abitudine spuntata.' : 'Azione completata.', xp, ab ? 'refresh' : 'check');
    render();
  });
  passoTimer();
}
function chiudiConcentrazione(): void {
  const era = document.body.classList.contains('in-concentrazione');
  document.body.classList.remove('in-concentrazione');
  if ($conc) { $conc.innerHTML = ''; }
  /* uscire dallo schermo pieno e fermare il timer sono due cose diverse:
     qui si segna solo che non ci sei più dentro */
  if (era && LM.timerVivo()) LM.aggiornaTimerDati({ concentrato: false });
}
function concentrazioneAperta(): boolean { return document.body.classList.contains('in-concentrazione'); }

/* ============================================================
   LA FESTA — coriandoli, un suono, una vibrazione

   Tre canali per la stessa notizia, e non è ridondanza: nell'ADHD la
   ricompensa conta se è IMMEDIATA e se si sente (Barkley: la sensibilità
   alle conseguenze differite è quella che manca). Un contatore che sale in
   un'altra schermata non è una ricompensa, è un dato.
   Il suono è generato dal browser, non è un file: nessun peso da scaricare,
   nessun ritardo alla prima volta, e parte nello stesso istante del tocco.
   Due note che salgono, una quinta giusta — un intervallo consonante che
   non suona come una notifica di sistema.
   Tutto si spegne: chi lavora in silenzio non deve dover scegliere fra
   l'app e le persone intorno. E chi ha chiesto meno animazioni al sistema
   operativo non vede i coriandoli, senza doverlo dire di nuovo qui.
   ============================================================ */
/* ---------- I SUONI ----------
   Il browser li genera, non sono file: nessun peso da scaricare, nessun
   ritardo la prima volta, e partono nello stesso istante del tocco. Ogni
   voce è una o più note con la sua forma d'onda, la sua durata e il suo
   volume, e le altezze sono scelte in intervalli consonanti — mai due note
   che stridono, perché un suono che si sente cento volte al giorno deve
   poter passare inosservato.

   Perché ogni cosa suoni DIVERSA: un ritorno uguale per gesti diversi non
   dice niente in più di quanto già si vede. Diverso, invece, diventa una
   conferma che arriva prima dello sguardo — sai di aver spuntato e non
   cancellato senza guardare lo schermo. Per chi ha l'ADHD conta il doppio,
   perché è un ritorno immediato su un gesto piccolo, che è esattamente il
   tipo di ritorno che manca.

   I volumi sono bassissimi apposta (da 0.02 a 0.13): un'app che si sente
   dall'altra parte della stanza si mette in muto e non si riaccende più.

   tipo:  sine = morbido, triangle = un po' più presente
   salita/discesa: l'ordine delle note dice il verso della cosa — si apre e
   si sale, si chiude e si scende, si annulla e si torna indietro. */
/* UNA VOCE: le note, la forma d'onda, quanto dura, quanto è forte, e ogni
   quanto parte la nota dopo. `passo` ce l'ha solo chi ha più di una nota. */
interface Voce {
  note: number[];
  tipo: OscillatorType;
  dur: number;
  vol: number;
  passo?: number;
}
const SUONI: Record<string, Voce> = {
  tocco:    { note: [660],            tipo: 'sine',     dur: 0.055, vol: 0.030 },
  tastoPieno:{ note: [523.25, 659.25], tipo: 'triangle', dur: 0.085, vol: 0.055, passo: 0.045 },
  segmento: { note: [784],            tipo: 'sine',     dur: 0.05,  vol: 0.035 },
  campo:    { note: [523.25],         tipo: 'sine',     dur: 0.045, vol: 0.022 },
  apri:     { note: [440, 587.33],    tipo: 'sine',     dur: 0.10,  vol: 0.045, passo: 0.055 },
  chiudi:   { note: [587.33, 440],    tipo: 'sine',     dur: 0.10,  vol: 0.040, passo: 0.055 },
  spunta:   { note: [659.25, 987.77], tipo: 'triangle', dur: 0.13,  vol: 0.070, passo: 0.070 },
  finito:   { note: [523.25, 659.25, 783.99], tipo: 'triangle', dur: 0.20, vol: 0.100, passo: 0.080 },
  avvio:    { note: [392, 523.25],    tipo: 'sine',     dur: 0.14,  vol: 0.060, passo: 0.075 },
  fine:     { note: [783.99, 659.25, 523.25], tipo: 'sine', dur: 0.22, vol: 0.090, passo: 0.090 },
  annulla:  { note: [523.25, 392],    tipo: 'sine',     dur: 0.12,  vol: 0.050, passo: 0.060 },
  scarto:   { note: [349.23],         tipo: 'sine',     dur: 0.09,  vol: 0.040 },
  guaio:    { note: [311.13, 293.66], tipo: 'triangle', dur: 0.16,  vol: 0.070, passo: 0.070 }
};
/* i tredici nomi che stanno nella tabella qui sopra, e non uno di più: un
   nome scritto male prendeva il ripiego («tocco») senza dire niente */
type NomeSuono = keyof typeof SUONI;

let udio: AudioContext | null = null;
function suona(che: NomeSuono): void {
  const p = LM.load().profilo;
  if (p.suono === 'no') return;
  const V = SUONI[che] || presa(SUONI['tocco']);
  try {
    /* `webkitAudioContext` è il nome che usava Safari e non sta nei tipi
       standard: si chiede alla finestra invece di darlo per scontato */
    const conFinestra = window as Window & { webkitAudioContext?: typeof AudioContext };
    const AC = window.AudioContext || conFinestra.webkitAudioContext;
    if (!AC) return;
    if (!udio) udio = new AC();
    const ctx = udio;
    if (ctx.state === 'suspended') void ctx.resume();
    const t0 = ctx.currentTime;
    V.note.forEach(function (f, n) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = V.tipo; o.frequency.value = f;
      const q = t0 + n * (V.passo || 0);
      g.gain.setValueAtTime(0.0001, q);
      g.gain.exponentialRampToValueAtTime(V.vol, q + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, q + V.dur);
      o.connect(g); g.connect(ctx.destination);
      o.start(q); o.stop(q + V.dur + 0.02);
    });
  } catch { /* niente audio: si va avanti in silenzio */ }
}

/* i cinque modelli di vibrazione: sono cinque, e sono questi */
type NomeVibra = 'pieno' | 'finito' | 'spunta' | 'leggero' | 'tocco';
const VIBRAZIONI: Record<NomeVibra, number[]> = {
  pieno: [14, 40, 22], finito: [14, 40, 22], spunta: [10], leggero: [8], tocco: [6]
};
function vibra(che: NomeVibra): void {
  const p = LM.load().profilo;
  if (p.vibra === 'no') return;
  if (!navigator.vibrate) return;
  const q = VIBRAZIONI[che] || [8];
  try { navigator.vibrate(q); } catch { /* niente vibrazione */ }
}

/* OGNI COSA CHE PREMI HA IL SUO SUONO, e lo decide un posto solo.
   Attaccarlo a mano su ogni comando vorrebbe dire dimenticarsene sul
   prossimo che si scrive; qui si guarda che cosa è stato toccato e si
   sceglie la voce. Chi vuole dire la sua mette `data-suono` addosso. */
function voceDi(el: Element | null): NomeSuono | null {
  if (!el) return null;
  const esplicita = el.closest('[data-suono]');
  if (esplicita) return (esplicita.getAttribute('data-suono') as NomeSuono | null) || null;
  if (el.closest('.spunta, [data-fa-fatto], [data-steptoggle]')) return 'spunta';
  if (el.closest('.icona-pericolo, [data-stepdel], .sc-pericolo')) return 'scarto';
  if (el.closest('.segmenti button, .segmenti a, .q-chip, .att-chip, .giorno-chip')) return 'segmento';
  if (el.closest('.btn-primario, .btn-grande, .btn-ok, .btn-tinta, .fab')) return 'tastoPieno';
  if (el.closest('.lista-porta, .sc-porta, [data-bkapri], .rit-riga, .lista-eti-btn')) return 'apri';
  if (el.closest('button, a[href], [role="button"], summary')) return 'tocco';
  if (el.closest('label, input, select, textarea')) return 'campo';
  return null;
}
document.addEventListener('pointerdown', function (ev) {
  /* al TOCCO, non al clic: il suono deve arrivare col dito, non dopo che il
     browser ha deciso che era un clic — trecento millisecondi dopo un gesto
     non sono più una conferma di quel gesto */
  if (!(ev.target instanceof Element)) return;
  const v = voceDi(ev.target);
  if (!v) return;
  suona(v);
  vibra(v === 'spunta' ? 'spunta' : 'tocco');
}, true);

/* DUE FESTE, non una stringa qualunque: quella grande (una cosa finita, con
   la pioggia) e quella piccola (una riga spuntata, lo scoppio attorno al
   dito). Chi la chiamava con un terzo nome prendeva il ramo piccolo. */
type NomeFesta = 'pieno' | 'leggero';
export function festeggia(che: NomeFesta, x?: number, y?: number): void {
  if (che === 'pieno') { pioggiaCoriandoli(); suona('finito'); vibra('pieno'); return; }
  if (x != null && y != null) burst(x, y);
  suona('spunta');
  vibra('leggero');
}

/* "fuocoScelto": quando l'utente decide di fare un'altra cosa invece di
   quella suggerita dal piano, la fissa lui e resta finché non la finisce o
   torna al piano. "mostraAltre": la lista delle altre cose di oggi, a vista. */
let fuocoScelto: string | null = null;
let mostraAltre = false;
let ultimoFuocoKey = '';

/* «fra quattro ore»: un orario da solo non dice quanto manca, e quanto manca
   è la cosa che fa decidere se cominciare qualcos'altro */
/* quanto tempo È PASSATO da un'ora già andata: «era alle 15:00, un'ora fa».
   Senza, «era alle 15:00» non dice se il ritardo è di cinque minuti o di
   cinque ore, e sono due situazioni diverse. */
function daQuanto(min: number): string {
  const d = new Date();
  const q = (d.getHours() * 60 + d.getMinutes()) - min;
  if (q <= 0 || q > 12 * 60) return '';
  if (q < 60) return ', ' + q + ' minuti fa';
  var ore = Math.round(q / 60);
  return ', ' + (ore === 1 ? 'un’ora fa' : ore + ' ore fa');
}

function fraQuanto(min: number): string {
  var d = new Date();
  var q = min - (d.getHours() * 60 + d.getMinutes());
  if (q <= 0 || q > 12 * 60) return '';
  if (q < 60) return ', fra ' + q + ' minuti';
  var ore = Math.round(q / 60);
  return ', fra ' + (ore === 1 ? 'un’ora' : ore + ' ore');
}

/* ============================================================
   IL REGISTRO DEGLI SCHERMI

   Qui c'era una catena di `if`: `render()` nominava una per una tutte e
   otto le viste. Sembra la cosa più semplice del mondo, e per due anni lo
   è stata. Poi ho misurato il grafo delle dipendenze di questo file e
   quella catena è saltata fuori come UNICA causa di una cosa grossa.

   Ogni vista, quando cambia qualcosa, chiama `render()`. E `render()`
   chiamava ogni vista. Due archi, e il grafo diventa un anello solo: da
   «Adesso» si arriva a «Attività» passando per `render`, quindi «Adesso»
   dipende da «Attività», quindi le due non si possono separare. E siccome
   vale per tutte, non se ne può separare nessuna. Misurato: la chiusura di
   ogni vista era di 444 KB, cioè tutto il file, e la parte «solo sua» era
   zero per tutte e sette.

   Tagliando quel solo arco — le viste si iscrivono, `render` le cerca —
   resta questo:

     tronco condiviso fra due o più viste   187 KB
     private di una vista sola              134 KB   ← si possono caricare a parte
     fuori da ogni vista (avvio, router)     65 KB

   Cioè da qui in poi il pacco SI PUÒ dividere per schermata. Il registro
   non fa niente di più di quella catena di `if`, e non è un'astrazione
   messa lì per bellezza: è l'unico modo di scriverla che non incolla ogni
   schermata a tutte le altre.
   ============================================================ */
const SCHERMI: Record<string, DisegnaSchermo> = {};
export function registraSchermo(id: string, disegna: DisegnaSchermo): void { SCHERMI[id] = disegna; }

/* ---------------------------------------------------------- E I PANNELLI
   Lo stesso taglio, per la stessa ragione. Un pannello si apre da dentro a
   una schermata: `apriFoglio` sa aprire il foglio — la pila del ritorno, il
   gesto per chiuderlo, il titolo — e chi ci disegna dentro si iscrive qui.

   COS'È SPARITO DA QUESTO PUNTO, e perché.
   Qui c'erano `reactVoluto()`, `caricaIsola()`, `reactPer()`,
   `foglioReact()` e `cuci()`: l'interruttore delle «schermate nuove», il
   caricamento a richiesta dell'isola, e l'elenco di tutto quello che
   l'isola poteva chiamare, appeso a `window.LM_APP`.
   Servivano a far convivere due disegni della stessa schermata mentre si
   passava dall'uno all'altro, e a poter tornare indietro in due tocchi se
   qualcosa si rompeva sul telefono alle otto di mattina. Hanno fatto il
   loro lavoro: le sette schermate e i quindici pannelli sono passati uno
   per uno, ognuno con la sua prova, e il codice di prima non c'è più —
   quindi non c'è più nessun posto a cui tornare, e un interruttore che
   porta a un posto che non esiste è peggio che non averlo.
   `window.LM_APP` è sparito per una ragione più semplice: adesso questi
   sono moduli, e quello che una schermata vuole se lo importa. Un elenco
   scritto a mano di cosa è lecito chiamare era il modo di avere un confine
   senza avere i moduli.  */
/* I quindici disegnano cose diverse e vogliono proprietà diverse, quindi
   messi insieme in una tabella non hanno un tipo comune: quello che li
   accomuna è «prende un contenitore e le SUE proprietà», e in TypeScript
   quel «sue» si scrive soltanto sul singolo. I due passaggi qui sotto sono
   le due facce dello stesso confine — si mette dentro con la chiave giusta
   (`registraFoglio` è generica e lo pretende) e si tira fuori con la stessa
   chiave (`apriFoglio` è generica e lo pretende): fra i due il tipo resta
   chiuso in un cassetto, e `never` è il modo di dire che nessuno può
   aprirlo per sbaglio. */
type FoglioChiuso = (dove: HTMLElement, props: never) => void;
const FOGLI: Partial<Record<NomeFoglio, FoglioChiuso>> = {};
export function registraFoglio<K extends NomeFoglio>(id: K, monta: MontaFoglio<K>): void {
  FOGLI[id] = monta as FoglioChiuso;
}

/* IL GANCIO PER SMONTARE. Chiudendo il foglio, chi ci ha disegnato dentro
   deve poterlo sapere: React tiene i suoi nodi in mano a una radice, e
   buttarli via senza dirglielo vuol dire che al giro dopo riconcilia contro
   nodi che non esistono più. Non è un import: questo file non conosce
   React, ed è la stessa scelta del registro qui sopra. */
export const ganci: { smontaFoglio: () => void } = { smontaFoglio: function () { /* lo riempie chi monta */ } };
/* Aprire un pannello. Stessa porta di sempre — il foglio è quello, la pila
   del ritorno è quella, il gesto per chiuderlo è quello — ma il corpo lo
   possiede chi si è iscritto: si apre vuoto e ci si monta dentro. */
export function apriFoglio<K extends NomeFoglio>(titolo: string, quale: K, props: PropDiFoglio[K], largo?: boolean, riapri?: Riapri | null): void {
  apriSheet(titolo, '', function (root) {
    const monta = FOGLI[quale];
    if (monta) (monta as MontaFoglio<K>)(root, props);
  }, largo, riapri);
}

/* QUELLO CHE SERVE DOPO, quando gli elementi sono in pagina. Sta in un
   oggetto di modulo perché il cablaggio è uscito da `vistaFocus` e non vede
   più le sue variabili locali. Era `{}` e si riempiva a mano di tre campi:
   il compilatore, giustamente, non ne conosceva nessuno. */
interface FuocoOra {
  prossima: VoceAdesso | null;
  adesso: CosaAdesso;
  oggi: Azione[] | null;
  minTimer: number;
}
let fuocoOra: FuocoOra = { prossima: null, adesso: { azione: null, stato: null, min: null, fine: null }, oggi: null, minTimer: 25 };

/* LA TESTA DELLA CASA: chi sei, che giorno è, a che punto sei.
   Tre cose che ogni buona app dice appena la apri, e che qui mancavano:
   al loro posto c'era una barra del tempo senza una parola. */
export function testaCasa(): string {
  const d = new Date();
  const GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
  const oggi = LM.azioniDiOggi();
  const fatte = oggi.filter(function (a) { return a.done; }).length;
  const tot = oggi.length;
  const serie = LM.streak().corrente;
  const p = tot ? fatte / tot : 0;
  /* il rituale dell'ora, se non è ancora fatto: una porta sola, quella giusta */
  const rid = ritualeDellOra();
  const NOMI: Record<string, [string, string, string]> = {
    mattina: ['sun', 'Pianifica la giornata', 'Un minuto'],
    checkin: ['polso', 'Come stai adesso?', 'Dieci secondi'],
    sera: ['moon', 'Chiudi la giornata', 'Due minuti']
  };
  const r = NOMI[rid];
  const porta = (r && !statoRituale(rid).fatto)
    ? '<button class="casa-rito" data-vai="rituali" data-sub="' + rid + '">' +
      '<span class="casa-rito-ico">' + ICO(r[0], 18) + '</span>' +
      '<span class="casa-rito-testo"><b>' + r[1] + '</b><small>' + r[2] + '</small></span>' + ICO('arrowRight', 15) + '</button>'
    : '';
  const data = (GIORNI[d.getDay()] || '') + ' ' + d.getDate() + ' ' + (MESI[d.getMonth()] || '');
  return '<header class="casa-testa">' +
    '<div class="casa-chi"><h1 class="casa-data">' + data + '</h1>' +
    (tot ? '<div class="casa-passo" role="img" aria-label="' + fatte + ' di ' + tot + ' fatte oggi">' +
      '<div class="casa-barra"><i style="width:' + Math.round(p * 100) + '%"></i></div><b>' + fatte + ' di ' + tot + ' fatte</b></div>' : '') +
    '</div>' +
    '<div class="casa-destra">' +
    (serie > 0 ? '<span class="casa-serie" role="img" aria-label="' + serie + ' giorni di fila" title="Giorni di fila">' + ICO('flame', 15, 'fiamma') + '<b>' + serie + '</b><small>giorni</small></span>' : '') +
    '</div></header>' +
    porta;
}

/* LA SCENA DI «ADESSO», senza toccare la pagina: restituisce il dentro e le
   classi, e chi la usa disegna il contenitore. `wireFuoco()` fa quello che
   va fatto dopo, con gli elementi già attaccati. */
/* NON SCRIVE IN PAGINA, e la parola «senza» qui sopra è recente.
   Fino a ieri c'era anche l'altra metà: due code che facevano
   `$vista.innerHTML = …` e poi riattaccavano i fili a mano. Erano la strada
   del sito di prima, e da quando «Adesso» è un pezzo React non le chiamava
   più nessuno — `soloScena` arrivava sempre vero. Codice morto, ma non
   innocuo: `$vista` è il contenitore della radice di React, e scriverci
   dentro vuol dire portargli via i nodi mentre crede ancora di averli. È
   esattamente il guasto che ha fermato il Design lab, e lasciarlo scritto
   qui era lasciarlo a portata di mano di chi passa e copia una riga. */
export function vistaFocus(): Scena {
  let adesso: CosaAdesso;
  if (fuocoScelto) {
    /* la cosa scelta a mano può essere un'abitudine come una cosa di oggi:
       si cerca fra tutte e due, con la stessa forma */
    const scelto = fuocoScelto;
    const pin = LM.vociDiAdesso(LM.todayKey()).find(function (a) { return a.id === scelto; });
    if (pin) adesso = { azione: pin, stato: 'scelta', min: pin.ora ? minOf(pin.ora) : null, fine: null };
    else { fuocoScelto = null; adesso = LM.azioneAdesso(); }
  } else {
    adesso = LM.azioneAdesso();
  }
  const prossima = adesso.azione;
  /* quello che serve DOPO, quando gli elementi sono in pagina: sta in un
     oggetto di modulo perché il cablaggio è uscito da qui e non vede più le
     variabili locali di questa chiamata. Si riempie QUI e non prima: la
     prima versione lo azzerava due righe più sotto, dopo averlo riempito,
     e al primo tocco su «Fatto» leggeva un null. */
  fuocoOra = { prossima: prossima, adesso: adesso, oggi: null, minTimer: 25 };
  ultimoFuocoKey = fuocoScelto ? 'pin:' + fuocoScelto : (prossima ? prossima.id : '') + '|' + adesso.stato;
  const oggi = LM.azioniDiOggi();
  fuocoOra.oggi = oggi;
  var inCoda = oggi.filter(function (a) { return !a.done; }).length - (prossima ? 1 : 0);

  /* LA FORMA SCELTA NELLE IMPOSTAZIONI. Non cambia i dati e non cambia i
     comandi: cambia dove stanno. Va letta PRIMA di costruire, perché tre
     pezzi del markup dipendono da lei — le frasi che dichiarano un'assenza,
     il terzo esito, e i tasti, che in `spina` e `poi` scendono in una fascia
     in fondo allo schermo.
     I TASTI NON POSSONO STARE IN TUTTI E DUE I POSTI. Il cablaggio li cerca
     per `id` (`btn-fatto`, `btn-timer`, …): lasciarli nella scheda e
     ripeterli nella fascia vorrebbe dire due elementi con lo stesso id, e
     `getElementById` restituisce il primo — quello nascosto. Il tasto
     sembrerebbe morto. Quindi o di qua o di là, mai tutti e due. */
  const forma: NonNullable<Stato['profilo']['forma']> = LM.load().profilo.forma || 'poi';
  /* i comandi stanno NELLA scheda in «scheda» e nella casa nuova («poi»);
     solo la spina li porta nella fascia in fondo */
  const inScheda = forma !== 'spina';

  /* In cima non c'è niente da leggere. Prima c'erano tre nomi per la stessa
     idea a cento pixel l'uno dall'altro — il sottotitolo «L'azione da fare
     adesso.», la linguetta «Adesso» e l'occhiello «La tua prossima azione» —
     e un contatore «1/7 oggi» che con «Le altre di oggi 5» chiedeva di fare
     due conti per capire un mucchio.
     Il conto se n'è andato di proposito: quanto un compito sembra pesante è
     fra i predittori più forti del rimandarlo (Steel 2007, meta-analisi sulla
     procrastinazione), e la dimensione del mucchio letta proprio nel momento
     in cui devi cominciare è esattamente quello. Il premio arriva quando
     premi «Fatto» — XP che volano, messaggio, serie — cioè subito, che è
     l'unico momento in cui funziona per chi ha l'ADHD (Barkley 1997 sulla
     sensibilità alle conseguenze immediate contro quelle rimandate). Il
     progresso della giornata resta in «Andamento», dove lo si va a cercare. */
  /* LA SCENA ESCE DAL SUO CONTENITORE. La vista non restituisce più un
     blocco già avvolto ma il DENTRO e le classi separati: React deve poter
     disegnare lui il contenitore, se no si ritrova un elemento in più
     nell'albero — l'errore che prove/gemelle.js ha già trovato quattro
     volte. Il codice di prima riavvolge tutto due righe più sotto. */
  var scena = { classi: 'focus-scena', dentro: '', fascia: '' };
  var html = topbar('Oggi', '', '', '', true);
  html += '<div id="oggi-giornata"></div>';

  if (!prossima) {
    var finita = oggi.length > 0;
    scena.dentro += '<div class="vuoto">' + mascotte(oggi.length ? 'festa' : undefined) +
      (oggi.length ? '<b>Per oggi hai finito tutto.</b>'
                   : '<b>Cosa fai oggi?</b>') +
      '</div>' +
      /* UN pieno, ed è il passo che il testo qui sopra consiglia: a giornata
         finita la review della sera, a giornata vuota scegliere le azioni.
         Sotto, una via di scorta smorzata, e il campo per scriverla e
         basta (la riga d'aggiunta di tutta l'app).
         Erano quattro inviti pari — scegli / prendi / review / scrivi — e
         la schermata che deve far ripartire era la più difficile da leggere
         di tutte. A giornata finita «Aggiungi altro a oggi» se n'è andato:
         il campo qui sotto fa quella cosa in meno passi e senza cambiare
         schermata. Tre inviti uguali nel momento in cui non hai ancora
         cominciato sono il momento peggiore per chiedere di scegliere. */
      '<div class="focus-azioni-riga">' +
      (finita
        ? '<button class="btn btn-primario btn-grande" data-vai="rituali" data-sub="sera">' + ICO('moon', 18) + ' Fine giornata</button>'
        : '<button class="btn btn-primario btn-grande" data-vai="rituali" data-sub="mattina">' + ICO('sun', 18) + ' Scegli le azioni di oggi</button>' +
          '<button class="btn btn-mini btn-ghost" data-vai="inbox">' + ICO('inbox', 15) + ' Prendi dalle attività</button>') +
      '</div>' +
      '<div class="focus-agg">' + rigaAggiunta('agg-rapida', 'Nuova attività…') + '</div>' +
      '';
    return scena;
  }

  var area = areaById(prossima.areaId);
  var colArea = LM.coloreArea(area);
  var timerAttivo = !!timerDiQuesta(prossima.id);
  var minTimer = Math.max(1, Math.min(180, +(prossima.durata || 0) || 25));
  fuocoOra.minTimer = minTimer;

  /* Una riga sola sopra al titolo, e dice due cose che il titolo non dice:
     di che parte della tua vita è questa cosa, e perché è questa adesso.
     Prima erano due bande — l'occhiello e l'area — con due misure e due
     colori, sopra un titolo già grande: tre righe centrate per una cosa.
     E l'occhiello parlava anche quando non aveva niente da dire: «La tua
     prossima azione» sopra la prossima azione, in una sezione che si chiama
     «Adesso», sotto un sottotitolo che diceva la stessa cosa. Quando non c'è
     un motivo da spiegare resta solo l'area. */
  /* ADESSO O DOPO: la domanda a cui questa schermata deve rispondere prima
     di ogni altra cosa.
     Prima lo diceva una frase piccola in mezzo alla didascalia — «in
     programma alle 15:00», accanto al nome dell'area, sotto un titolo
     grande e sopra un tasto verde «Fatto» — e la scheda aveva lo STESSO
     aspetto sia che quella cosa fosse da fare adesso sia che fosse la
     prossima delle diciassette. Chi la leggeva capiva «questa è la prossima,
     e adesso?»: è successo davvero, ed è il motivo di questo blocco.
     Adesso lo dice una fascia sopra il titolo, con una parola sola e un
     colore: ADESSO, IN RITARDO, QUANDO VUOI, PIÙ TARDI. La parola è la
     risposta; il dettaglio (l'ora, il ritardo, il tempo che manca) sta
     accanto, più piccolo. */
  /* SI GUARDA, NON SI LEGGE.
     Qui c'era una pastiglia con dentro una parola in maiuscolo — ADESSO, IN
     RITARDO, PIÙ TARDI, QUANDO VUOI — e quella parola era l'unica cosa che
     distingueva uno stato dall'altro: il resto della scheda era identico, e
     il colore forte (il filo in cima, la tinta del fondo) diceva l'AREA, che
     è l'informazione meno urgente delle due. Aprendo «Adesso» la domanda è
     «questa è per adesso o no»: la risposta deve arrivare prima di leggere.
     Adesso la porta una barra del tempo, che è la stessa cosa detta con una
     forma:
       · in corso   la barra è piena FINO A DOVE SIAMO e si ferma lì — si
                    vede a che punto del blocco sei;
       · in ritardo la barra è piena tutta, del colore dell'avviso: il tempo
                    è finito;
       · più tardi  la barra è un binario VUOTO con un segno dove comincia —
                    non è ancora partito niente;
       · quando vuoi nessuna barra. Non c'è un tempo, e l'assenza è il segno.
     Accanto restano i numeri, che non sono un'etichetta ma il dato. La
     parola resta per chi usa un lettore di schermo, che una forma non la
     vede: `.solo-lettore`. */
  var oraAdesso = LM.oraDelGiorno();
  /* DUE DOMANDE, DUE CANALI. La scheda di «Adesso» deve rispondere a due
     cose diverse, e prima ne rispondeva a una sola:
       · QUANDO — è per adesso, è passata, è più tardi, o non ha un'ora?
       · CHE COS'È — un'abitudine che torna ogni volta, o una cosa di oggi?
     Il secondo canale non c'era: un'abitudine e un'attività avevano la
     stessa faccia, e la differenza la faceva una parola scritta piccola
     («abitudine») accanto al nome dell'area. Ma i due comandi che offrono
     NON sono gli stessi — un'abitudine si salta per oggi, un'attività si
     rimanda a domani — e chi non ha letto quella parola preme il tasto
     sbagliato. Adesso il tipo si vede: una tessera col segno a sinistra
     dello stato, e sotto il titolo la settimana dell'abitudine, che
     un'attività non ha e non può avere.
     IL TEMPO È LA BARRA, e adesso ha una forma per ognuno dei casi, non
     solo per tre:
       · in corso        piena fino a dove siamo — si vede a che punto sei;
       · in ritardo      piena tutta, colore d'avviso: il tempo è finito;
       · più tardi       binario vuoto: il blocco c'è ma non è cominciato;
       · a un'ora, senza durata  un segno solo, non un binario: è un
                         istante, non un pezzo di giornata;
       · quando vuoi     binario tratteggiato: nessun confine, e si vede.
     L'ultima riga è l'unica che cambia rispetto a prima, dove «quando vuoi»
     non aveva nessuna barra. L'assenza però non è un segno: sembrava solo
     una scheda con meno roba, e a parità di tutto il resto le due schede
     erano identiche. Un tratteggio è la stessa cosa detta con una forma. */
  const haOra = adesso.min != null;
  const haDurata = !!prossima.durata;
  /* COM'È QUESTA COSA, ADESSO: la parola in cima, il dettaglio, la classe e
     la forma della barra. `ico` può non esserci — «quando vuoi» non ha un
     segno — e prima era `null` in un ramo e una stringa in altri cinque, su
     un oggetto senza forma. */
  interface StatoScena {
    parola: string;
    dett: string;
    cls: string;
    barra: string;
    quota: number;
    ico: string | null;
  }
  /* i due capi del blocco: dove `adesso.stato` li ha, ci sono per costruzione
     — li mette `azioneAdesso` insieme allo stato. Letti una volta qui invece
     di difenderli in dodici punti dentro alle frasi. */
  const daMin = adesso.min ?? 0;
  const aMin = adesso.fine ?? 0;
  let stato: StatoScena = { parola: '', dett: '', cls: 'libera', barra: 'libera', quota: 0, ico: null };
  if (adesso.stato === 'scelta') {
    stato = { parola: 'Scelta da te', dett: haOra ? 'in programma alle ' + fmtMin(daMin) : 'quando vuoi',
      cls: 'ora', barra: 'scelta', quota: 1, ico: 'target' };
  } else if (adesso.stato === 'corso') {
    const durata = Math.max(1, aMin - daMin);
    const restano = Math.max(0, aMin - oraAdesso);
    /* «50 min», non «50′». Il primo è il segno del minuto d'arco: lo usano
       gli orologiai e le carte nautiche, non le app. Chi legge lo prende
       per un apostrofo o non lo vede proprio. */
    stato = { parola: 'Adesso', dett: fmtMin(daMin) + ' → ' + fmtMin(aMin) + ' · restano ' + restano + ' min',
      cls: 'ora', barra: 'corso', ico: 'target',
      quota: Math.max(0.02, Math.min(1, (oraAdesso - daMin) / durata)) };
  } else if (adesso.stato === 'ritardo') {
    stato = { parola: 'In ritardo', dett: 'prevista alle ' + fmtMin(daMin) + daQuanto(aMin),
      cls: 'ritardo', barra: 'ritardo', quota: 1, ico: 'avviso' };
  } else if (adesso.stato === 'programmata') {
    /* con una durata è un BLOCCO e la barra è un binario; senza durata è un
       ISTANTE e la barra è un segno solo. Sono due cose diverse da fare e
       due impegni diversi da prendere: «alle 15 per tre quarti d'ora» non è
       «alle 15». */
    stato = { parola: 'Più tardi',
      dett: 'alle ' + fmtMin(daMin) + (haDurata ? ' · ' + prossima.durata + ' min' : '') + fraQuanto(daMin),
      cls: 'dopo', barra: haDurata ? 'dopo' : 'punto', quota: 0, ico: 'clock' };
  } else if (prossima.mit) {
    stato = { parola: 'La più importante', dett: 'quando vuoi, ma prima delle altre', cls: 'mit', barra: 'libera', quota: 0, ico: 'star' };
  } else {
    stato = { parola: 'Quando vuoi', dett: 'nessun orario', cls: 'libera', barra: 'libera', quota: 0, ico: null };
  }

  /* DI CHE SPECIE È QUESTA COSA. Non più una parola in coda alla riga
     dell'area: una tessera col segno, e per le abitudini la settimana
     disegnata. Un'abitudine non si «rimanda», si salta per oggi — e chi
     guarda deve saperlo prima di premere, non dopo. */
  var tipoCls = prossima.tipo === 'abitudine' ? 'abitudine' : 'azione';
  var perche = '';
  var perCls = ' ' + stato.cls;
  if (adesso.stato === 'scelta') {
    perche = '<button class="focus-torna" id="btn-torna-piano">torna al piano</button>';
  }
  /* la settimana dell'abitudine: sette pallini, quelli in cui torna sono
     pieni, oggi ha il suo anello. È il segno che nessuna attività può
     avere, e si legge senza leggere. */
  var ripeteHtml = '';
  if (prossima.tipo === 'abitudine') {
    const oggiDow = new Date().getDay();
    const giorni = prossima.giorni && prossima.giorni.length ? prossima.giorni : GIORNI_ORD;
    /* la serie ce l'ha solo un'abitudine, e qui siamo in quel ramo: zero
       quando non c'è, che è la stessa cosa che diceva `> 0` su `undefined` */
    const serie = prossima.serie || 0;
    ripeteHtml = '<div class="focus-ripete" role="img" aria-label="' +
      esc('Abitudine' + (serie > 0 ? ', ' + serie + (serie === 1 ? ' giorno di fila' : ' giorni di fila') : '')) + '">' +
      '<span class="fr-pips">' + GIORNI_ORD.map(function (d) {
        return '<i class="' + (giorni.indexOf(d) >= 0 ? 'on' : '') + (d === oggiDow ? ' oggi' : '') + '"></i>';
      }).join('') + '</span>' +
      (serie > 0
        ? '<span class="fr-serie">' + ICO('flame', 13, 'fiamma') + '<b>' + serie + '</b></span>'
        : '') + '</div>';
  }

  /* Le ALTRE cose di oggi, a portata di mano: se devi fare qualcos'altro la
     vedi e la scegli, senza sentirti obbligato da quella suggerita. */
  var altre = oggi.filter(function (a) { return !a.done && (!prossima || a.id !== prossima.id); });
  /* «LE ALTRE DI OGGI», la fisarmonica. Esiste solo nella forma `scheda`:
     in `spina` e in `poi` la coda sta già in pagina, aperta, ed è
     esattamente la stessa lista — disegnarla due volte vorrebbe dire due
     liste delle stesse cose, una sopra l'altra. */
  var altreHtml = '';
  if (altre.length && forma === 'scheda') {
    /* L'elenco è quello di tutta l'app: un contenitore con i separatori e il
       comando da 26px DENTRO la riga. Prima era un quarto disegno — una
       spunta quadrata staccata a sinistra di una pastiglia bianca — e ogni
       riga ripeteva «Fai questa →», che è esattamente quello che fa la riga
       quando la tocchi: due comandi per lo stesso gesto, e il titolo si
       troncava per far posto all'etichetta. */
    altreHtml = '<div class="focus-altre">' +
      /* Un posto, non una domanda. «Devi fare altro?» chiede all'utente di
         rimettere in discussione la cosa che ha davanti proprio mentre
         deve cominciarla: è un invito a riaprire una scelta già fatta, e
         riaprirla è il modo in cui la scelta non si chiude più (Iyengar &
         Lepper 2000: più opzioni davanti, meno probabile che si scelga).
         Le altre restano lì, a un tocco, per quando servono davvero. */
      '<button class="lista-eti lista-eti-btn" id="btn-altre" aria-expanded="' + mostraAltre + '">' +
      (mostraAltre ? 'Nascondi le altre' : 'Le altre di oggi') + ' <span>' + altre.length + '</span>' +
      '<span class="lista-chev' + (mostraAltre ? ' aperta' : '') + '">' + ICO('chevronGiu', 15) + '</span></button>' +
      (mostraAltre ? '<div class="lista">' + altre.map(function (a) {
        var ar = areaById(a.areaId);
        return '<div class="lista-riga">' +
          '<button class="lista-azione spunta" data-fa-fatto="' + a.id + '" aria-label="Segna come fatta">' + ICO('check', 13) + '</button>' +
          '<button class="lista-apri" data-fa-fuoco="' + a.id + '" aria-label="Fai questa: ' + esc(a.testo) + '">' +
          '<span class="lista-corpo"><span class="lista-tit">' +
          segnoArea(ar, 13, 'tit-area') + esc(a.testo) +
          (a.mit ? ' ' + ICO('star', 11) : '') + '</span></span>' +
          (a.ora ? '<span class="lista-val">' + ICO('clock', 11) + ' ' + a.ora + '</span>' : '') +
          '<span class="lista-chev">' + ICO('chevronGiu', 15) + '</span></button></div>';
      }).join('') + '</div>' : '') + '</div>';
  }

  /* Due parti, non una pila. Il cuore sta in mezzo allo spazio che c'è; la
     porta per le altre cose sta in fondo, appoggiata al bordo. Prima erano
     tutti figli della stessa colonna centrata, e «Le altre di oggi» finiva
     incollata sotto ai tasti con duecento pixel di niente sotto di sé: la
     schermata sembrava interrotta a metà. */
  scena.classi = 'focus-scena forma-' + forma + (timerAttivo ? ' timer-attivo' : '');
  const dentroCuore =
    '<div class="focus-cuore st-' + stato.cls + ' tipo-' + tipoCls + '" style="--c-area:' + colArea + '">' +
    '<div class="focus-stato st-' + stato.cls + '">' +
    (stato.barra
      ? '<div class="fs-barra fs-b-' + stato.barra + '" style="--p:' + stato.quota + '" aria-hidden="true"><i></i></div>'
      : '') +
    '<div class="fs-riga">' +
    /* LA TESSERA DEL TIPO, prima di tutto il resto: il segno che ripete per
       un'abitudine, il segno dell'area per una cosa di oggi. Sta a
       sinistra perché è la prima domanda («che roba è?») e perché è nello
       stesso posto in cui sta nelle righe dei Rituali e delle liste. */
    '<span class="fs-tipo fs-tipo-' + tipoCls + '">' +
    (tipoCls === 'abitudine' ? ICO('refresh', 13) : segnoArea(area, 13, '')) + '</span>' +
    '<span class="fs-tipo-nome solo-lettori">' + (tipoCls === 'abitudine' ? 'Abitudine' : 'Attività') + '</span>' +
    (stato.ico ? '<span class="fs-ico">' + ICO(stato.ico, 13) + '</span>' : '') +
    /* la parola resta per chi non vede la forma */
    '<span class="fs-parola solo-lettori">' + stato.parola + '</span>' +
    /* «nessun orario» e «quando vuoi, ma prima delle altre» dichiarano
       un'assenza e spiegano una funzione: nelle forme nuove non ci sono, e
       la scheda senza orario diventa semplicemente la più corta. */
    (stato.dett && (forma === 'scheda' || !/nessun orario|prima delle altre/.test(stato.dett))
      ? '<span class="fs-dett">' + esc(stato.dett) + '</span>' : '') +
    '</div></div>' +
    '<div class="focus-didascalia' + perCls + '" style="--c-area:' + colArea + '">' +
    segnoArea(area, 15, 'fd-area') + '<span class="fd-nome">' + esc(area.nome) + '</span>' +
    (perche ? '<span class="fd-sep">·</span><span class="fd-perche">' + perche + '</span>' : '') +
    '</div>' +
    (timerAttivo
      ? '<div class="timer-anello" data-timer-anello style="--p:0"><div class="timer-interno">' +
        '<div class="timer-display" data-timer-cifre>' + fmtCrono(timerResta(timerOra())) + '</div>' +
        /* è un conto alla rovescia sui minuti che hai scelto tu, non il
           blocco della giornata: diceva la cosa sbagliata */
        '<div class="timer-eti">restano</div></div></div>'
      : '') +
    '<div class="focus-azione">' + esc(prossima.testo) + '</div>' +
    ripeteHtml +
    /* La risposta alla domanda «e adesso?»: quando tutto quello che resta ha
       un'ora più in là, ADESSO non c'è niente, e va detto. Prima la scheda
       mostrava la cosa delle tre del pomeriggio come se fosse da fare
       subito, e chi la leggeva alle dieci restava a chiedersi se doveva
       cominciarla. */
    /* fuori da `scheda` questa frase non serve: lo dicono già il dato
       («alle 15:00, fra 5 ore») e il tasto della fascia, che lì sotto
       diventa «Falla adesso» e cambia colore. */
    (adesso.stato === 'programmata' && forma === 'scheda'
      ? '<div class="focus-nota-dopo">Adesso non hai niente in programma.</div>'
      : '') +
    (prossima.ifThen ? '<div class="focus-ifthen">' + ICO('ancora', 15) + '<span>' + esc(prossima.ifThen) + '</span></div>' : '') +
    /* I TASTI, e solo nella forma `scheda`. In `spina` e in `poi`
       scendono nella fascia in fondo allo schermo: vedi il commento
       su `forma` qui sopra — gli stessi `id` non possono stare in
       due posti. */
    (!inScheda ? '' :
      /* gerarchia chiara: un'unica azione dominante, il resto recede */
      '<div class="focus-primaria">' +
      /* «Fatto», e basta. Il «+10 XP» sul tasto trasformava l'unico comando
         che deve essere ovvio in due cose da leggere, e prometteva un premio
         prima di averlo dato: il premio si vede quando lo premi, e lì è
         immediato per davvero.
         Quando la cosa è PIÙ TARDI il tasto pieno non può dire «Fatto»: quello
         che uno vuole fare in quel momento è deciderlo — «la faccio adesso» —
         e «Fatto» resta lì accanto, smorzato, per chi l'ha già fatta davvero. */
      (adesso.stato === 'programmata'
        ? '<button class="btn btn-primario btn-grande" id="btn-adesso">' + ICO('target', 18) + ' Falla adesso</button>'
        : '<button class="btn btn-ok btn-grande" id="btn-fatto">' + ICO('check', 18) + ' Fatto</button>') +
      '</div>' +
      '<div class="focus-secondarie">' +
      /* Un tasto, non quattro. «Timer 25′ 10′ 50′» erano tre bersagli su otto
         di tutta la schermata: il cronometro pesava come l'azione. E la
         durata era una scelta in più da fare PRIMA di cominciare, quando è
         già scritta sulla cosa stessa — quella che si dà nella «Giornata»
         trascinando un blocco. Se non c'è, venticinque minuti. */
      (adesso.stato === 'programmata'
        ? '<button class="btn btn-mini" id="btn-fatto">' + ICO('check', 15) + ' Fatto</button>'
        : (timerAttivo
          ? '<button class="btn btn-mini" id="btn-concentra">' + ICO('target', 15) + ' Torna al timer</button>'
          : '<button class="btn btn-mini" id="btn-timer" data-min="' + minTimer + '">' +
            ICO('play', 15) + ' Timer</button>')) +
      /* un'abitudine non si rimanda a domani: domani c'è già. Si salta oggi,
         e la serie lo sa. */
      (prossima.tipo === 'abitudine'
        ? '<button class="btn btn-mini btn-ghost" id="btn-salta">Salta oggi ' + ICO('salta', 15) + '</button>'
        : '<button class="btn btn-mini btn-ghost" id="btn-nonora">Più tardi ' + ICO('rimanda', 15) + '</button>') +
      /* IL TERZO ESITO. «Più tardi» dice che la farai; cancellare la fa
         sparire dal registro di quello che è successo. Quello che manca in
         mezzo — e che capita più spesso di tutti e due — è averci provato e
         non esserci riuscito. Sta qui, smorzato: va potuto dire in un tocco,
         e non va invitato. Per un'abitudine c'è già «Salta oggi», che è la
         stessa cosa detta nel modo giusto per una cosa che torna. */
      /* nella casa nuova solo dove vuol dire qualcosa: su una cosa che
         aveva un tempo. Altrove era un quarto bersaglio sempre acceso. */
      (prossima.tipo === 'abitudine' ? ''
        : '<button class="btn btn-mini btn-ghost btn-mancata" id="btn-mancata">Non ce l’ho fatta…</button>') +
      '</div>') +
    /* Quante ne restano lo dice già il contatore in cima e il tasto delle
       altre. Qui resta solo la cosa che nessuno dei due dice: che dopo
       questa non c'è più niente. Scritto come un'etichetta e non come una
       frase — «È l'ultima di oggi» suonava come una voce fuori campo che
       commenta quello che stai facendo, e un'app non ha niente da
       commentare. */
    (inCoda > 0 ? '' :
      '<div class="focus-coda"><span>Ultima di oggi</span></div>') +
    '</div>' +
    altreHtml +
    '';

  /* IL TERZO ESITO non se ne va con i tasti: «averci provato e non esserci
     riuscito» capita più spesso degli altri due, e se non si può dire
     resta solo mentire o cancellare. Qui sta sotto, smorzato, e SOLO dove
     vuol dire qualcosa — su una cosa che aveva un tempo. Su una cosa che
     puoi fare quando vuoi non significa niente, e nella scheda di oggi
     compare invece in tutte e sei le situazioni. */
  const mancata = (prossima.tipo !== 'abitudine' && (adesso.stato === 'corso' || adesso.stato === 'ritardo'))
    ? '<div class="fuoco-mancata"><button class="btn-mancata" id="btn-mancata">Non ce l’ho fatta…</button></div>'
    : '';

  /* ------------------------------------------------------------------
     LA FASCIA D'AZIONE di `spina` e `poi`: i comandi escono dalla scheda e
     si appoggiano in fondo allo schermo, dove arriva il pollice senza
     spostare la mano.
     IL COLORE DICE LO STATO, ed è l'unico posto dove un colore lo può dire
     senza che nessuno debba impararlo: la parola è scritta sopra. Verde
     «Fatto» quando c'è da spuntare, petrolio «Falla adesso» quando c'è da
     cominciare. Gli `id` sono quelli di sempre — `wireFuoco()` lega per
     `id` e non sa né vuole sapere dov'è finito il tasto. */
  const cls = adesso.stato === 'programmata' ? 'dopo' : adesso.stato === 'ritardo' ? 'ritardo' : 'ora';
  const fascia = (mancata: string) =>
    mancata + '<div class="fascia-barra fascia-' + cls + '">' +
    (adesso.stato === 'programmata'
      ? '<button class="fascia-primo" id="btn-adesso">' + ICO('target', 18) + '<b>Falla adesso</b></button>' +
        '<button class="fascia-slot" id="btn-fatto" aria-label="Segna come fatta">' + ICO('check', 18) + '</button>'
      : '<button class="fascia-primo" id="btn-fatto">' + ICO('check', 18) + '<b>Fatto</b></button>' +
        (timerAttivo
          ? '<button class="fascia-slot" id="btn-concentra" aria-label="Torna al timer">' + ICO('target', 18) + '</button>'
          : '<button class="fascia-slot" id="btn-timer" data-min="' + minTimer + '" aria-label="Timer">' + ICO('play', 18) + '</button>')) +
    (prossima.tipo === 'abitudine'
      ? '<button class="fascia-slot" id="btn-salta" aria-label="Salta oggi">' + ICO('salta', 18) + '</button>'
      : '<button class="fascia-slot" id="btn-nonora" aria-label="Rimanda a più tardi">' + ICO('rimanda', 18) + '</button>') +
    '</div>';

  if (forma === 'scheda') { scena.dentro += dentroCuore; return scena; }

  /* le due liste che riempiono il basso: quello che è già andato — le
     ultime due, non tutte: questa non è la pagina della giornata — e
     quello che viene dopo questa. */
  const fatte = oggi.filter(function (a) { return a.done; }).slice(-2);
  const restano = oggi.filter(function (a) { return !a.done && a.id !== prossima.id; });
  /* IL PALLINO SOLO DOVE NON C'È GIÀ. Nella spina ogni riga ha il suo nodo
     sul filo, a sinistra: ripetere un pallino colorato dentro la riga vuol
     dire due segni tondi per la stessa cosa, a dieci pixel l'uno
     dall'altro. In `poi` il filo non c'è, e il pallino serve — è l'unico
     posto dove si vede di che area è quella riga. */
  function rigaCoda(a: typeof oggi[number], fatta: boolean, conPunto: boolean): string {
    const ar = areaById(a.areaId);
    return '<button class="coda-riga' + (fatta ? ' coda-fatta' : '') + '" data-fa-fuoco="' + a.id + '">' +
      (conPunto ? '<i class="coda-pt" style="background:' + (fatta ? 'var(--ok)' : LM.coloreArea(ar)) + '"></i>' : '') +
      '<b>' + esc(a.testo) + '</b>' + (a.ora ? '<span>' + esc(a.ora) + '</span>' : '') + '</button>';
  }

  /* LE TESSERE: solo quello che c'è. Una cosa senza durata non porta la
     tessera della durata, e nessuno scrive «nessuna durata» — che è
     esattamente l'errore di «nessun orario» nella scheda. */
  const tessere: string[] = [];
  if (prossima.tipo === 'abitudine') {
    const h = LM.load().abitudini.find(function (x) { return x.id === prossima.id; });
    const gg = (h && h.giorni) || [];
    const NOMI = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    /* la settimana in parole e non a pallini: sei cerchi mezzi pieni sono
       un codice che va imparato, «Lun Mer Ven» no. */
    const quando = gg.length >= 7 ? 'Ogni giorno' : gg.map(function (i) { return NOMI[i] || ''; }).join(' ');
    tessere.push(ICO('refresh', 13) + '<span>' + esc(quando || 'Abitudine') + '</span>');
  }
  if (prossima.durata) tessere.push(ICO('durata', 13) + '<span>' + prossima.durata + ' min</span>');
  const tessereHtml = tessere.length
    ? '<div class="spina-tessere">' + tessere.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>'
    : '';

  if (forma === 'poi') {
    /* LA CASA: la cosa di adesso in una scheda, e sotto il resto di oggi
       come un elenco che si spunta. Niente fascia: i comandi stanno nella
       scheda, dove sta la cosa a cui si riferiscono. */
    function riga(a: typeof oggi[number]): string {
      const ar = areaById(a.areaId);
      return '<div class="lista-riga casa-riga' + (a.done ? ' fatta' : '') + '">' +
        '<button class="lista-azione spunta" data-fa-fatto="' + a.id + '" aria-label="Segna come fatta">' + ICO('check', 13) + '</button>' +
        '<button class="lista-apri" data-fa-fuoco="' + a.id + '">' +
        '<span class="lista-corpo"><span class="lista-tit">' + esc(a.testo) + '</span>' +
        '<span class="lista-sub">' + segnoArea(ar, 11, 'tit-area') + esc(ar.nome) + (a.ora ? ' · ' + esc(a.ora) : '') + '</span></span></button></div>';
    }
    /* i giorni a parole anche qui: i pallini sono un codice da imparare */
    scena.dentro += (ripeteHtml ? dentroCuore.replace(ripeteHtml, tessereHtml) : dentroCuore).replace('class="focus-cuore ', 'class="focus-cuore casa-cuore ') +
      (restano.length
        ? '<div class="casa-sez"><h2 class="casa-tit">Poi</h2><div class="lista">' + restano.map(riga).join('') + '</div></div>'
        : '') +
      '';
    return scena;
  }

  /* ------------------------------------------------------------------
     LA SPINA. Niente scheda: la schermata è una colonna di tempo, e questa
     cosa è il nodo grosso in mezzo. Risponde a due domande invece che a
     una — «e adesso?» la scheda la sapeva già dire, «e poi?» no — e
     riempie il basso con la giornata invece che con niente.
     IL TITOLO È A DUE TONI: la prima parola porta il peso, il resto scende.
     Quasi sempre la prima parola è il verbo («Confrontare piani
     telefonici», «Scrivere il changelog»), e un titolo che comincia con un
     verbo si legge come una cosa da fare invece che come un'etichetta.
     Quando il titolo è una parola sola non c'è niente da smorzare, e
     resta tutto pieno. */
  const parti = prossima.testo.trim().split(/\s+/);
  const primo = parti[0] || prossima.testo;
  const titolo = parti.length > 1
    ? '<b>' + esc(primo) + '</b> <em>' + esc(parti.slice(1).join(' ')) + '</em>'
    : '<b>' + esc(primo) + '</b>';

  function nodo(dentro: string, cls: string): string {
    return '<div class="spina-nodo ' + cls + '"><div class="spina-filo"><i></i></div>' + dentro + '</div>';
  }
  scena.dentro +=
    '<div class="spina">' +
    fatte.map(function (a) { return nodo('<div class="spina-min">' + rigaCoda(a, true, false) + '</div>', 'spina-gia'); }).join('') +
    nodo('<div class="spina-qui">' +
      '<div class="spina-area" style="color:' + colArea + '">' + esc(area.nome) + '</div>' +
      '<div class="spina-tit">' + titolo + '</div>' +
      tessereHtml +
      (prossima.ifThen ? '<div class="focus-ifthen">' + ICO('ancora', 15) + '<span>' + esc(prossima.ifThen) + '</span></div>' : '') +
      '</div>', 'spina-ora st-' + stato.cls) +
    restano.map(function (a) { return nodo('<div class="spina-min">' + rigaCoda(a, false, false) + '</div>', ''); }).join('') +
    '</div>';
  scena.fascia = fascia(mancata);
  return scena;
}

/* IL CABLAGGIO DI «ADESSO» — quello che va fatto quando gli elementi
   sono in pagina. Fuori dalla vista perché lo deve chiamare anche React,
   che il markup lo disegna per conto suo. Le poche cose che gli servono
   stanno in `fuocoOra`, riempito da chi ha appena costruito la scena. */
export function wireFuoco() {

/* UN ELEMENTO SI COLLEGA UNA VOLTA SOLA, e questa riga vale un guasto che
   spuntava tre cose per un tocco.

   `Adesso.tsx` chiama `wireFuoco()` dentro a un `useEffect` SENZA array di
   dipendenze: gira dopo ogni render, ed è giusto così — la scena può
   cambiare a ogni giro e i fili vanno rimessi. Finché React riscriveva il
   nodo a ogni render i gestori se ne andavano insieme ai vecchi elementi,
   e riattaccarli era l'unico modo di averli.
   Poi è arrivata la memoizzazione di `grezzo.ts`, che serve a tutt'altro
   (la Panoramica si rianimava a ogni giro perché l'oggetto passato a
   `dangerouslySetInnerHTML` era nuovo ogni volta, e React lo confronta per
   IDENTITÀ, non per contenuto). Da allora, quando l'HTML non cambia, React
   NON tocca il nodo: gli elementi sopravvivono, e `wireFuoco()` gli attacca
   un gestore in più a ogni render.
   Tre gestori su «Fatto» non vogliono dire tre volte la stessa cosa: il
   primo chiama `render()`, che ricalcola qual è LA PROSSIMA, e il secondo
   legge quella nuova. Un tocco solo spuntava tre attività diverse. Nessun
   errore, nessun avviso — l'ha trovato `prove/forme.js` contando quante
   volte `completaAzione` viene chiamata per una pressione.

   `collegate` è lo stesso WeakSet dei form: gli elementi ci entrano per
   riferimento, e quando React li butta via se ne vanno da soli. E quando
   l'HTML cambia gli elementi sono nuovi davvero — `innerHTML` li ricrea
   tutti — quindi il filo si riattacca, che è quello che deve succedere. */
function lega(e: Element | null, fn: (ev: Event) => void): void {
  if (!e || collegate.has(e)) return;
  collegate.add(e);
  e.addEventListener('click', fn);
}

$vista.querySelectorAll<HTMLElement>('[data-vai]').forEach(function (b) {
  lega(b, function () {
    if (b.getAttribute('data-sub') === 'checkin') { apriCheckinVeloce(); return; }
    if (b.getAttribute('data-sub')) schermo.sottoRituale = b.getAttribute('data-sub');
    location.hash = '#/' + b.getAttribute('data-vai');
  });
});

var btnAltre = document.getElementById('btn-altre');
/* passa da render(), non da vistaFocus(): questa funzione riscrive TUTTO
   $vista, riga delle sezioni compresa, e solo render() la rimette. Aprendo
   «le altre» la riga spariva fino al ridisegno successivo. Con la pagina
   che non cambia, render() conserva lo scorrimento e non anima niente. */
lega(btnAltre, function () { mostraAltre = !mostraAltre; render(); });
var btnTorna = document.getElementById('btn-torna-piano');
lega(btnTorna, function () { fuocoScelto = null; render(); });
$vista.querySelectorAll<HTMLElement>('[data-fa-fuoco]').forEach(function (b) {
  lega(b, function () { fuocoScelto = b.getAttribute('data-fa-fuoco'); mostraAltre = false; render(); });
});
$vista.querySelectorAll<HTMLElement>('[data-fa-fatto]').forEach(function (b) {
  lega(b, function (ev) {
    const id = b.getAttribute('data-fa-fatto');
    if (!id) return;
    feedbackSpunta(ev, LM.completaAzione(id), 'Fatto.', 'check');
    render();
  });
});

/* A giornata vuota «Fatto» non c'è: la scena è un altro ramo. Nel codice di
   prima quel ramo usciva prima di arrivare qui; adesso che il cablaggio è
   una funzione a sé, ci si può arrivare comunque — e senza questa guardia
   il primo tocco su una giornata vuota rompeva tutta la schermata. */
const bFatto = document.getElementById('btn-fatto');
lega(bFatto, function (ev) {
  /* SENZA UNA COSA DA FARE QUESTO TASTO NON ESISTE, e il commento qui sopra
     dice perché: la giornata vuota è un altro ramo della scena. Il controllo
     era implicito nel fatto che il tasto non ci fosse; adesso è scritto. */
  const q = fuocoOra.prossima;
  const dove = ev.currentTarget as HTMLElement | null;
  if (!q || !dove) return;
  const eraTimer = !!timerDiQuesta(q.id);
  if (eraTimer) fermaTimer(true);
  const abitudine = q.tipo === 'abitudine';
  const xp = abitudine ? LM.completaAbitudine(q.id) : LM.completaAzione(q.id);
  const r = dove.getBoundingClientRect();
  flyXp(r.left + r.width / 2, r.top, xp);
  /* la pioggia di coriandoli per QUALUNQUE cosa finita, non solo per la
     più importante: una cosa fatta è una cosa fatta, e il momento in cui
     la ricompensa conta è questo, non un contatore da un'altra parte */
  festeggia('pieno', r.left + r.width / 2, r.top + r.height / 2);
  toast(abitudine ? 'Abitudine spuntata.'
    : (q.mit ? 'Hai completato l’azione più importante di oggi.' : 'Azione completata.'),
    xp, abitudine ? 'refresh' : (q.mit ? 'star' : 'check'));
  render();
});
/* «Falla adesso» non è «Fatto»: è la scelta di spostare qui una cosa che
   il piano metteva più in là. La scheda passa a «Scelta da te», con la
   via del ritorno al piano accanto. */
const bAdesso = document.getElementById('btn-adesso');
lega(bAdesso, function () {
  const q = fuocoOra.prossima;
  if (!q) return;
  fuocoScelto = q.id; mostraAltre = false; render();
});
const bNonOra = document.getElementById('btn-nonora');
lega(bNonOra, function () {
  const q = fuocoOra.prossima;
  if (!q) return;
  fermaTimer(false);
  if (fuocoScelto === q.id) fuocoScelto = null;
  LM.rimandaAzione(q.id);
  toast('Rimandata.', 0, 'rimanda');
  render();
});
const bSalta = document.getElementById('btn-salta');
lega(bSalta, function () {
  const q = fuocoOra.prossima;
  if (!q) return;
  fermaTimer(false);
  if (fuocoScelto === q.id) fuocoScelto = null;
  LM.saltaGiornoAbitudine(q.id);
  toast('Saltata per oggi.', 0, 'salta');
  render();
});
const bm = document.getElementById('btn-mancata');
lega(bm, function () {
  const q = fuocoOra.prossima;
  if (q) chiediMancata(q.id, q.testo);
});
const bc = document.getElementById('btn-concentra');
lega(bc, function () { apriConcentrazione(); });
const bt = document.getElementById('btn-timer');
lega(bt, function () {
  const q = fuocoOra.prossima;
  if (q) scegliTimer(q.id, q.areaId, q.testo, fuocoOra.minTimer);
});
}


/* la barra compatta della giornata è sempre in cima a Oggi */
export function montaOggiGiornata(): void {
  const zona = document.getElementById('oggi-giornata');
  if (zona) montaGiornataStrip(zona);
}

/* ============================================================
   LA GIORNATA — timeline (sonno, pasti, abitudini, azioni)
   Rende visibile come è divisa la giornata: utile a chi fatica a
   percepire il tempo (Barkley 1997) e scarica dalla mente il "quando"
   (Risko & Gilbert 2016). Un solo componente, mostrato dove preferisci.
   ============================================================ */

function minOf(hhmm: string | null | undefined): number | null {
  if (!hhmm) return null;
  const p = String(hhmm).split(':');
  return (+(p[0] || 0)) * 60 + (+(p[1] || 0));
}
/* L'ORA DI UN RITMO C'È SEMPRE. `RITMO_DEFAULT` la mette e `normalizza` la
   difende, quindi `minOf` su quella non torna mai niente. Questa funzione dice
   quel «sempre» una volta, invece di far controllare il niente a ogni conto
   della griglia — e se un giorno un ritmo arrivasse senza sveglia, la
   mezzanotte è la risposta meno sorprendente di un asse che collassa. */
function minDi(o: Ora): number { return minOf(o) ?? 0; }

/* scaletta di durate ampia: dai 5 minuti (una micro-azione per partire) alle
   8 ore (una giornata di lavoro), così nessuno deve arrotondare per forza */
export const DURATE: { v: number | ''; t: string }[] = [{ v: '', t: 'Nessuna' },
  { v: 5, t: '5 min' }, { v: 10, t: '10 min' }, { v: 15, t: '15 min' }, { v: 20, t: '20 min' },
  { v: 25, t: '25 min' }, { v: 30, t: '30 min' }, { v: 45, t: '45 min' }, { v: 60, t: '1 h' },
  { v: 90, t: '1 h 30' }, { v: 120, t: '2 h' }, { v: 150, t: '2 h 30' }, { v: 180, t: '3 h' },
  { v: 240, t: '4 h' }, { v: 300, t: '5 h' }, { v: 360, t: '6 h' }, { v: 480, t: '8 h' }];

/* orizzonte della pagina "Giornata" e giorno/settimana/mese di riferimento */
let giornataSonnoAperto = false;  /* pannello sonno/pasti in cima alla pagina Giornata */
/* C'era anche un `giornataPopVista` ('vista' | 'modifica') per il pop-up su
   schermo stretto: dichiarato e mai letto, in tutta la vita del file. Il
   pop-up si apre già in modifica. */

/* eventi di un giorno qualsiasi (per giorno/settimana/mese) */
function nodiGiorno(k: Giorno): NodiDelGiorno {
  k = k || LM.todayKey();
  var s = LM.load();
  var r = LM.ritmoDi(k);
  var isToday = k === LM.todayKey();
  const placed: Nodo[] = [], tray: Nodo[] = [];
  (r.pasti || []).forEach(function (p) {
    /* `fatto` arriva dal resoconto della sera: un pasto saltato non ha
       occupato tempo, quindi dalla giornata sparisce. Il dato resta nel
       registro, che è dove lo si legge e dove lo si può cambiare. */
    if (p.fatto === false) return;
    if (p.ora) placed.push({ tipo: 'pasto', min: minOf(p.ora), ora: p.ora, dur: p.durata || 30, nome: p.nome, pastoId: p.id, fatto: p.fatto ?? undefined, icona: /colaz|coffee|breakfast/i.test((p.id || '') + ' ' + p.nome) ? 'coffee' : 'utensils' });
  });
  s.abitudini.forEach(function (h) {
    if (!LM.abitudinePrevista(h, k)) return;
    const oraH = LM.oraAbitudine(h, k);
    const e: Nodo = { tipo: 'abitudine', min: minOf(oraH), ora: oraH, dur: h.durata || null, id: h.id, testo: h.testo, areaId: h.areaId, fatto: !!h.fatti[k], streak: isToday ? LM.streakAbitudine(h) : 0 };
    (e.min == null ? tray : placed).push(e);
  });
  LM.azioniDelGiorno(k).forEach(function (a) {
    const e: Nodo = { tipo: 'azione', min: minOf(a.ora), ora: a.ora, dur: a.durata || null, id: a.id, testo: a.testo, areaId: a.areaId, mit: a.mit, done: a.done, mancata: a.mancata || null, passoDi: a.passoDi };
    (e.min == null ? tray : placed).push(e);
  });
  /* qui dentro l'ora c'è per costruzione: chi non ce l'ha è finito nel
     vassoio due righe sopra */
  placed.sort(function (a, b) { return (a.min ?? 0) - (b.min ?? 0); });
  /* wake = risveglio di stamattina (inizio della veglia); sleep = fine della
     giornata sul grafico = ora di andare a letto della ROUTINE (stanotte è un
     piano, non un fatto). sonno/sveglia restano i valori registrati (il
     resoconto della notte passata) per il pannello e per "quanto ho dormito". */
  return { k: k, isToday: isToday, wake: minDi(r.sveglia), sleep: minDi(r.sonnoRoutine), sveglia: r.sveglia, sonno: r.sonno, sonnoRoutine: r.sonnoRoutine, pasti: r.pasti, dalRegistro: r.dalRegistro, placed: placed, tray: tray };
}
function nodiGiornata(): NodiDelGiorno { return nodiGiorno(LM.todayKey()); }

/* dispone i blocchi che si sovrappongono in colonne affiancate */
function disponiBlocchi(placed: Nodo[]): Disposto[] {
  /* qui arrivano solo i nodi PIAZZATI, cioè quelli che hanno un'ora:
     `nodiGiorno` manda gli altri nel vassoio. `?? 0` è quel confine. */
  const items: Disposto[] = placed.map(function (e) {
    const st = e.min ?? 0;
    return { e: e, start: st, end: st + (e.dur || 30) };
  });
  items.sort(function (a, b) { return a.start - b.start || a.end - b.end; });
  const gruppi: Disposto[][] = [];
  let cur: Disposto[] = [], curEnd = -1;
  items.forEach(function (it) {
    if (cur.length && it.start >= curEnd) { gruppi.push(cur); cur = []; curEnd = -1; }
    cur.push(it); curEnd = Math.max(curEnd, it.end);
  });
  if (cur.length) gruppi.push(cur);
  gruppi.forEach(function (g) {
    const cols: number[] = [];
    g.forEach(function (it) {
      let piazzato = false;
      for (let c = 0; c < cols.length; c++) {
        if (it.start >= (cols[c] ?? 0)) { cols[c] = it.end; it.col = c; piazzato = true; break; }
      }
      if (!piazzato) { it.col = cols.length; cols.push(it.end); }
    });
    g.forEach(function (it) { it.ncols = cols.length; });
  });
  return items;
}

/* griglia oraria con blocchi che occupano il tempo (durata) */
function htmlTimeGrid(d: NodiDelGiorno, opzioni?: OpzGriglia): string {
  const opts: OpzGriglia = opzioni || {};
  const pxh = opts.pxh || 56;
  /* Finestra di veglia. sonno = ora di andare a letto, sveglia = risveglio.
     Se si va a letto dopo mezzanotte (bed <= wake) la notte scavalla le 24h,
     così l'asse resta monotòno invece di collassare/andare in negativo. */
  const wake = d.wake;
  let bed = d.sleep;
  if (bed <= wake) bed += 1440;
  /* minuto "effettivo" sull'asse: i blocchi alle prime ore, quando si è
     svegli oltre mezzanotte, vanno nella coda notturna (+24h). */
  function em(min: number | null): number | null { return (min != null && bed > 1440 && min < wake) ? min + 1440 : min; }
  /* La finestra deve contenere il sonno E ogni blocco piazzato: così nessun
     elemento finisce fuori dalla griglia a coprire il resto della pagina. */
  let lo = wake, hi = bed;
  d.placed.forEach(function (b) {
    const st = em(b.min); if (st == null) return;
    const en = st + (b.dur || 30);
    if (st < lo) lo = st;
    if (en > hi) hi = en;
  });
  const gs = Math.floor(lo / 60) * 60;
  let ge = Math.ceil(hi / 60) * 60;
  if (ge <= gs) ge = gs + 60;
  const H = (ge - gs) / 60 * pxh;
  function y(m: number): number { return (m - gs) / 60 * pxh; }
  let lines = '';
  for (let h = gs; h <= ge; h += 60) lines += '<div class="tl-hr" style="top:' + y(h) + 'px">' + (opts.rail === false ? '' : '<span class="tl-hr-eti">' + fmtMin(h) + '</span>') + '</div>';
  let shade = '';
  /* Nella pagina la riga in cima alla scheda dice già «23:30→07:30 · 8h»:
     ripeterlo dentro la fascia tratteggiata era lo stesso dato due volte a
     quaranta pixel di distanza. Nel pop-up quella riga non c'è, e qui serve. */
  const sonnoLbl = (opts.mini || opts.senzaEtichettaSonno) ? '' : '<span class="tl-sleep-lbl">' + ICO('bed', 11) + ' ' + fmtOre(LM.minutiSonno(d.k)) + '</span>';
  if (wake > gs) shade += '<div class="tl-sleep" style="top:0;height:' + y(wake) + 'px">' + sonnoLbl + '</div>';
  if (bed < ge) shade += '<div class="tl-sleep" style="top:' + y(bed) + 'px;height:' + (H - y(bed)) + 'px">' + (wake > gs ? '' : sonnoLbl) + '</div>';
  const blocks = disponiBlocchi(d.placed).map(function (it) {
    const e = it.e, dur = e.dur || 30;
    const top = y(em(e.min) ?? 0), hgt = Math.max(opts.mini ? 15 : 24, dur / 60 * pxh - 2);
    const quante = it.ncols || 1;
    const w = 100 / quante, left = (it.col || 0) * w;
    var pos = 'top:' + top + 'px;height:' + hgt + 'px;left:calc(' + left + '% + 1px);width:calc(' + w + '% - 3px)';
    /* QUANTE RIGHE CI STANNO DAVVERO. Nella settimana il titolo va a capo, e
       il numero di righe permesse era tre per tutti — ma il blocco e' alto
       quanto DURA l'impegno, e mezz'ora puo' valere trenta pixel. Tre righe
       in trenta pixel non ci stanno: la seconda restava tagliata a meta'
       altezza, e con il contenuto centrato usciva anche da sopra.
       Il conto lo puo' fare solo chi l'altezza ce l'ha in mano:
         · 11px di corpo per 1.12 di interlinea = 12.32px a riga;
         · 6px se ne vanno in cornice — 1+1 di bordo e 2+2 di imbottitura
           (nella colonna della settimana l'imbottitura resta anche sui
           blocchi bassi: `.wk-col .tl-blk` batte `.tl-blk-corto`).
       Se non ne sta dentro nemmeno una, il titolo non si scrive affatto:
       nove pixel di lettere tagliate sotto la linea di base si leggono
       peggio di una barra colorata, e il nome resta comunque nel
       suggerimento e toccando il giorno. `prove/disegno.js` tiene fermi
       questi numeri: se cambia il corpo o l'interlinea, va rosso. */
    var righe = opts.mini ? Math.floor((hgt - 6) / 12.32) : -1;
    if (righe >= 1) pos += ';--righe:' + righe;
    if (e.tipo === 'pasto') {
      return '<div class="tl-blk tl-blk-pasto' + (e.fatto === false ? ' saltato' : '') + '" style="' + pos + '"' +
        (e.fatto === false ? ' title="' + esc(e.nome) + ': saltato"' : '') + '>' +
        ICO(e.icona || 'utensils', 13) + (opts.mini ? '' : '<span class="tl-blk-t">' + esc(e.nome) + '</span>') + '</div>';
    }
    var ar = areaById(e.areaId), col = LM.coloreArea(ar);
    var fatto = e.tipo === 'azione' ? e.done : e.fatto;
    var attr = e.tipo === 'azione' ? 'data-tl-az="' + e.id + '"' : 'data-tl-ab="' + e.id + '"';
    /* un blocco più basso di un dito non può ospitare una spunta: si
       segna come «basso» e col tocco la spunta sparisce (si apre la
       scheda del blocco, dove «Fatto» è grande quanto serve) */
    var basso = hgt < 46;
    /* QUANTO CI STA DENTRO UN BLOCCO. Il titolo vuole quattordici pixel, la
       riga dell'orario tredici, e sopra e sotto ce ne sono tre di
       imbottitura: trentaquattro in tutto. Il blocco però è alto quanto
       DURA, e su una giornata intera in mezzo schermo un'ora sta in
       diciotto pixel — un impegno di un'ora e mezza ne vale ventisette, e
       là dentro le due righe non ci stanno. Il contenuto è centrato, quindi
       quello che avanza esce da sopra E da sotto e il ritaglio lo taglia a
       metà altezza: il titolo appariva mozzato per il lungo, con solo la
       metà bassa delle lettere. Sembrava un difetto del bordo, ed era una
       riga di troppo.
       Sotto i trentotto pixel l'orario se ne va (sta già scritto a
       sinistra, sul righello delle ore); sotto i ventiquattro anche
       l'imbottitura, perché una lettera intera vale più di due pixel di
       aria. */
    var corto = hgt < 38;
    var check = (opts.spuntabile && !opts.mini) ? '<button class="tl-blk-check" ' + attr + ' aria-label="Fatto">' + ICO('check', 11) + '</button>' : '';
    /* nella pagina Giornata il blocco si tocca per modificarlo (orario,
       durata, area) in un pannellino: niente più lista doppia sotto. */
    var clic = opts.mini ? ' data-tl-giorno="' + d.k + '"'
      : (opts.interactive ? ' data-blk-' + (e.tipo === 'azione' ? 'az' : 'ab') + '="' + e.id + '"' : '');
    /* le azioni si trascinano: su un'altra ora (stesso giorno) o su un altro
       giorno nella vista settimana */
    /* Nella settimana i blocchi sono minuscoli: non c'è posto per un manico
       separato, quindi il blocco stesso fa da manico (data-manico su di sé).
       Così col dito si prende subito, senza che il browser rubi il gesto
       per selezionare il testo. */
    /* si trascinano anche le abitudini: cambia l'ora di QUEL giorno */
    clic += ' data-dur="' + (e.dur || 30) + '"';
    if (e.tipo === 'azione') clic += ' data-drag-az="' + e.id + '"' + (opts.mini ? ' data-manico' : '');
    else clic += ' data-drag-ab="' + e.id + '" data-drag-k="' + d.k + '"' + (opts.mini ? ' data-manico' : '');
    return '<div class="tl-blk tl-blk-att' + (e.tipo === 'abitudine' ? ' tl-blk-abit' : '') + (fatto ? ' fatta' : '') + (e.mancata ? ' mancata' : '') + (basso ? ' tl-blk-basso' : '') + (corto ? ' tl-blk-corto' : '') + (opts.interactive && !opts.mini ? ' tl-blk-clic' : '') + '"' + clic + ' style="' + pos + ';--c-area:' + col + '" title="' + esc(e.testo) + '">' +
      check + (!opts.mini && opts.interactive ? '<span class="manico" data-manico aria-hidden="true">' + ICO('presa', 13) + '</span>' : '') +
      (righe === 0 ? '' : '<span class="tl-blk-t">' + (e.mit ? ICO('star', 11) + ' ' : '') + (e.tipo === 'abitudine' && !opts.mini ? ICO('refresh', 11) + ' ' : '') + esc(e.testo) + '</span>') +
      (!corto && !opts.mini ? '<span class="tl-blk-ora">' + e.ora + '–' + fmtMin((e.min ?? 0) + dur) + '</span>' : '') + '</div>';
  }).join('');
  let now = '';
  if (opts.nowMin != null) {
    const nm = em(opts.nowMin) ?? 0;
    if (nm >= gs && nm <= ge) now = '<div class="tl-now-line" style="top:' + y(nm) + 'px"><span>' + fmtMin(opts.nowMin) + '</span></div>';
  }
  /* geometria salvata sull'elemento: permette di muovere la linea "adesso"
     in tempo reale senza ridisegnare tutta la griglia. data-adesso marca
     SOLO le griglie che rappresentano oggi (le altre non devono averla). */
  return '<div class="tl-grid' + (opts.mini ? ' tl-grid-mini' : '') + (opts.rail === false ? ' tl-grid-norail' : '') + '" style="height:' + H + 'px"' +
    (opts.nowMin != null ? ' data-adesso="1"' : '') +
    ' data-gs="' + gs + '" data-ge="' + ge + '" data-pxh="' + pxh + '" data-wake="' + wake + '" data-bed="' + bed + '">' +
    '<div class="tl-lines">' + lines + '</div>' +
    '<div class="tl-blocks">' + shade + blocks + now + '</div></div>';
}
/* muove la linea "adesso" in tutte le griglie di oggi (giorno e colonna di
   oggi nella settimana), senza ridisegnarle. */
function aggiornaLineaGriglia(): void {
  /* la geometria è scritta sull'elemento da `htmlTimeGrid`: `+null` fa zero e
     `isNaN` due righe sotto ferma il giro, che è quello che faceva prima */
  const num = function (e: HTMLElement, nome: string) { return +(e.getAttribute(nome) || ''); };
  document.querySelectorAll<HTMLElement>('.tl-grid[data-adesso]').forEach(function (grid) {
    const gs = num(grid, 'data-gs'), ge = num(grid, 'data-ge'), pxh = num(grid, 'data-pxh');
    const wake = num(grid, 'data-wake'), bed = num(grid, 'data-bed');
    if (isNaN(gs) || isNaN(pxh)) return;
    const nn = new Date(); const now = nn.getHours() * 60 + nn.getMinutes();
    const nm = (bed > 1440 && now < wake) ? now + 1440 : now;
    let line = grid.querySelector<HTMLElement>('.tl-now-line');
    if (nm < gs || nm > ge) { if (line) line.remove(); return; }
    const top = (nm - gs) / 60 * pxh;
    if (!line) {
      line = document.createElement('div'); line.className = 'tl-now-line';
      line.innerHTML = '<span></span>'; presa(grid.querySelector<HTMLElement>('.tl-blocks')).appendChild(line);
    }
    line.style.top = top + 'px';
    presa(line.querySelector<HTMLElement>('span')).textContent = fmtMin(now);
  });
}

/* Pannellino per modificare UNA cosa della giornata (azione o abitudine):
   spuntala, dàlle un orario, una durata, un'area. Sostituisce la vecchia
   lista "Orari e durate" che raddoppiava tutto quello che era già nel grafico.
   onCambio() ridisegna la giornata dietro al pannello. */
function apriItemGiornata(k: Giorno, id: string, tipo: 'azione' | 'abitudine', onCambio?: () => void, spuntabileOpz?: boolean): void {
  const isAz = tipo === 'azione';
  const spuntabile = spuntabileOpz === undefined ? true : spuntabileOpz;
  const dd = nodiGiorno(k);
  const e = dd.placed.concat(dd.tray).find(function (x) { return x.id === id; });
  if (!e) return;
  /* il pannello ridisegna la giornata dietro di sé quando qualcosa cambia:
     senza `onCambio` non c'è niente da ridisegnare, e chiamarlo comunque
     voleva dire una funzione che non c'è */
  const ricarica = function () { if (onCambio) onCambio(); };
  void LM.coloreArea(areaById(e.areaId));
  const fatto = isAz ? e.done : e.fatto;
  const durOpt = DURATE.map(function (o) { return '<option value="' + o.v + '"' + ((e.dur || '') === o.v ? ' selected' : '') + '>' + o.t + '</option>'; }).join('');

  const html = '<div class="ig-ed">' +
    '<div class="abd-chi"><span>' + (isAz ? 'Attività' : ICO('refresh', 11) + ' Abitudine') + ' · ' + esc(etichettaGiorno(k)) + '</span></div>' +
    (spuntabile
      ? '<button class="btn btn-grande ' + (fatto ? 'btn-ghost' : 'btn-ok') + ' ig-fatto"><span class="ig-fatto-ico">' + ICO(fatto ? 'annulla' : 'check', 15) + '</span>' + (fatto ? 'Segna come non fatta' : 'Fatto') + '</button>'
      : '') +
    '<div class="gr">' +
    '<label class="gr-riga" for="ig-ora"><span class="gr-eti">Ora</span><span class="gr-valori">' +
      /* la «x» sta DENTRO la pillola del valore, come il tasto che svuota
         un campo di ricerca: c'è solo quando c'è qualcosa da togliere */
      '<span class="gr-pillola' + (e.ora ? ' piena' : '') + '"><input type="time" class="gr-val" id="ig-ora" value="' + (e.ora || '') + '">' +
      (e.ora ? '<button class="gr-svuota ig-noora" aria-label="Togli l’orario">' + ICO('x', 11) + '</button>' : '') + '</span></span></label>' +
    '<label class="gr-riga" for="ig-dur"><span class="gr-eti">Durata</span>' +
      '<span class="gr-pillola' + (e.dur ? ' piena' : '') + '"><select class="gr-val" id="ig-dur">' + durOpt + '</select>' +
      (e.dur ? '<button class="gr-svuota ig-nodur" aria-label="Togli la durata">' + ICO('x', 11) + '</button>' : '') + '</span></label>' +
    '<label class="gr-riga" for="ig-area"><span class="gr-eti">Area</span>' + selectAree('ig-area', e.areaId, 'Area', 'gr-val') + '</label>' +
    '</div>' +
    '<div class="gr ig-azioni">' +
    (isAz
      ? '<button class="gr-riga gr-agg ig-indietro">' + ICO('lista', 15) + (e.passoDi ? ' Togli dal giorno' : ' Sposta in Da fare') + '</button>' +
        '<button class="gr-riga gr-agg gr-rosso ig-rimuovi">' + ICO('trash', 15) + ' Elimina</button>'
      : '<button class="gr-riga gr-agg ig-salta">' + ICO('x', 15) + ' Salta ' + esc(etichettaGiorno(k).toLowerCase()) + '</button>' +
        '<button class="gr-riga gr-agg gr-rosso ig-finequi">' + ICO('fineperiodo', 15) + ' Termina l’abitudine</button>' +
        '<button class="gr-riga gr-agg ig-vairituali">' + ICO('arrowRight', 15) + ' Apri l’abitudine</button>') +
    '</div>' +

    '</div>';
  apriSheet(esc(e.testo), html, function (root) {
    /* il nome si cambia toccandolo: è il titolo del foglio */
    titoloSheetModificabile(e.testo || '', function (v) {
      if (isAz) LM.modificaAzione(id, v); else LM.modificaAbitudine(id, { testo: v });
      e.testo = v;
      ricarica();
    });
    const bFatto = root.querySelector<HTMLElement>('.ig-fatto');
    if (bFatto) bFatto.addEventListener('click', function (ev) {
      if (isAz) feedbackSpunta(ev, LM.completaAzione(id), 'Fatto.', 'check');
      else feedbackSpunta(ev, LM.completaAbitudine(id, k), 'Fatta. Continua così.', 'flame');
      chiudiSheet(); ricarica();
    });
    const ora = campo(root, '#ig-ora');
    ora.addEventListener('change', function () {
      const q = ora.value ? comeOra(ora.value) : null;
      if (isAz) LM.setOraAzione(id, q); else LM.modificaAbitudine(id, { ora: q });
      ricarica();
    });
    const dur = campo(root, '#ig-dur');
    dur.addEventListener('change', function () {
      const v = dur.value ? +dur.value : null;
      if (isAz) LM.setDurataAzione(id, v); else LM.modificaAbitudine(id, { durata: v });
      ricarica();
    });
    const area = campo(root, '#ig-area');
    area.addEventListener('change', function () {
      if (isAz) LM.cambiaAreaAzione(id, area.value); else LM.modificaAbitudine(id, { areaId: area.value });
      ricarica();
    });
    const noora = root.querySelector<HTMLElement>('.ig-noora');
    if (noora) noora.addEventListener('click', function () {
      const prima = e.ora;
      if (isAz) LM.setOraAzione(id, null); else LM.spostaAbitudineIlGiorno(id, k, '-');
      chiudiSheet(); ricarica();
      toast(isAz ? 'Orario rimosso.' : 'Oggi senza orario.', 0, 'clock', { eti: 'Annulla', fai: function () {
        if (isAz) LM.setOraAzione(id, prima || null); else LM.spostaAbitudineIlGiorno(id, k, null);
        ricarica();
      } });
    });
    const nodur = root.querySelector<HTMLElement>('.ig-nodur');
    if (nodur) nodur.addEventListener('click', function () {
      const prima = e.dur;
      if (isAz) LM.setDurataAzione(id, null); else LM.modificaAbitudine(id, { durata: null });
      chiudiSheet(); ricarica();
      toast('Durata rimossa.', 0, 'durata', { eti: 'Annulla', fai: function () {
        if (isAz) LM.setDurataAzione(id, prima || null); else LM.modificaAbitudine(id, { durata: prima || null });
        ricarica();
      } });
    });
    const ind = root.querySelector<HTMLElement>('.ig-indietro');
    if (ind) ind.addEventListener('click', function () {
      LM.azioneInBacklog(id);
      toast(e.passoDi ? 'Tolta dal giorno: il passo resta nel progetto.' : 'Rimessa in «Da fare».', 0, 'lista');
      chiudiSheet(); ricarica();
    });
    const rim = root.querySelector<HTMLElement>('.ig-rimuovi');
    if (rim) rim.addEventListener('click', function () {
      conAnnulla('Rimossa da oggi.', 'trash', function () { LM.rimuoviAzione(id); });
      chiudiSheet(); ricarica();
    });
    const salta = root.querySelector<HTMLElement>('.ig-salta');
    if (salta) salta.addEventListener('click', function () {
      LM.saltaGiornoAbitudine(id, k);
      toast('Tolta da questo giorno.', 0, 'x');
      chiudiSheet(); ricarica();
    });
    const fq = root.querySelector<HTMLElement>('.ig-finequi');
    if (fq) fq.addEventListener('click', function () {
      const hh = LM.load().abitudini.find(function (x) { return x.id === id; });
      LM.impostaPeriodoAbitudine(id, hh ? hh.da : null, k);
      toast('Abitudine terminata. Lo storico resta.', 0, 'fineperiodo');
      chiudiSheet(); ricarica();
    });
    const vai = root.querySelector<HTMLElement>('.ig-vairituali');
    if (vai) vai.addEventListener('click', function () { apriDettaglioAbitudine(id, ricarica); });
  });
}

function montaGiornata(container: HTMLElement, opzioni?: OpzGriglia): void {
  const opts: OpzGriglia = opzioni || {};
  const compact = !!opts.compact;
  const k = opts.giorno || LM.todayKey();
  const d = nodiGiorno(k);
  /* Tre modi: il passato si guarda, oggi si fa, il futuro si PIANIFICA.
     Nel futuro si può aggiungere/modificare/spostare, ma non spuntare:
     una cosa di domani non si può aver già fatta (falserebbe XP e serie). */
  const isFuturo = k > LM.todayKey();
  const interactive = true;                  /* si può sempre sistemare */
  const spuntabile = !isFuturo;              /* anche a posteriori, mai nel futuro */
  const now = new Date();
  const nowMin = d.isToday ? now.getHours() * 60 + now.getMinutes() : null;

  const vuota = !d.placed.length && !d.tray.length;

  /* Le cose SENZA orario non stanno sul grafico: le mostriamo sotto, come
     righe che si toccano per dargli un orario (o si spuntano al volo).
     Le cose CON orario si modificano toccando il loro blocco nel grafico. */
  var senzaOra = '';
  if (!compact && interactive && d.tray.length) {
    /* l'etichetta di gruppo di tutta l'app, col suo numero. Prima era
       un'etichetta sua più la frase «— toccale per dargli un posto nella
       giornata», che ogni riga qui sotto dice già da sé con «dai un orario». */
    senzaOra = '<div class="gio-so">' + etichetta('Senza orario', 'clock', d.tray.length) +
      d.tray.map(function (e) {
        var ar = areaById(e.areaId), col = LM.coloreArea(ar);
        var fatto = e.tipo === 'azione' ? e.done : e.fatto;
        var attr = e.tipo === 'azione' ? 'data-tl-az="' + e.id + '"' : 'data-tl-ab="' + e.id + '"';
        var bAttr = 'data-blk-' + (e.tipo === 'azione' ? 'az' : 'ab') + '="' + e.id + '"';
        return '<div class="gio-so-riga' + (fatto ? ' fatta' : '') + '" style="--c-area:' + col + '"' +
          (e.tipo === 'azione' ? ' data-drag-az="' + e.id + '"' : ' data-drag-ab="' + e.id + '" data-drag-k="' + k + '"') + ' data-dur="' + (e.dur || 30) + '">' +
          (spuntabile ? '<button class="tl-check" ' + attr + ' aria-label="Fatto">' + ICO('check', 13) + '</button>' : '') +
          '<span class="manico" data-manico aria-hidden="true">' + ICO('presa', 13) + '</span>' +
          '<button class="gio-so-corpo" ' + bAttr + '>' +
          segnoArea(ar, 13, 'tl-tag') +
          '<span class="gio-so-testo">' + esc(e.testo) + (e.mit ? ' ' + ICO('star', 11) : '') + '</span>' +
          /* l'orologio apre DIRETTAMENTE la ruota dell'ora: toccare la riga apre
           la scheda, toccare l'orologio mette l'orario e basta */
        '</button><label class="gio-so-ora" data-apri-campo="1" aria-label="Aggiungi orario a ' + esc(e.testo) + '">' + ICO('clock', 15) +
        '<input type="time" class="campo-velato gio-so-ora-campo" data-so-ora="' + e.id + '" data-so-tipo="' + e.tipo + '" aria-label="Orario di ' + esc(e.testo) + '"></label></div>';
      }).join('') + '</div>';
  }
  /* Aggiunta rapida: solo il testo e l'area. L'orario si dà dopo, toccando
     la cosa (meno campi da riempire = meno attrito per buttarla giù). */
  var quickAdd = '';
  if (!compact && interactive) {
    /* IL SEGNAPOSTO DEVE STARCI, e «Aggiungi qualcosa a oggi…» non ci stava:
       accanto c'è il tasto «Aggiungi», che su un telefono lascia al campo
       centosessanta pixel. Il verbo lo dice già il tasto; al campo resta da
       dire PER QUANDO, che è l'unica cosa che cambia da un giorno all'altro. */
    // (il giorno lo dice già l'intestazione)
    /* l'ultima riga d'aggiunta rimasta col vecchio schema: campo, tendina
       dell'area sempre aperta e tasto pieno, tutti in fila. Adesso è quella
       di tutte le altre — cinque schermate, una riga sola. */
    quickAdd = '<div class="tl-add">' +
      rigaAggiunta('agg-gio', 'Nuova attività…',
        '<label class="agg-area"><span class="agg-eti">in</span>' + selectAree('agg-gio-area') + '</label>') +
      '</div>';
  }

  /* sonno e pasti del giorno: UN solo posto, in cima alla pagina, con un
     riassunto sempre visibile e un pannello che si apre per modificarli. */
  var sonnoTop = '';
  if (!compact && interactive) {
    var aperto = giornataSonnoAperto;
    /* i segni dei pasti dicono già quanti sono: la parola «3 pasti» accanto
       era la stessa cosa detta due volte, e con quattro fatti su una riga la
       mandava a capo. Il gruppo di segni però deve avere un nome, o con la
       voce i pasti non esistono. */
    var nPasti = (d.pasti || []).length;
    var pastiIco = (d.pasti || []).slice(0, 5).map(function (p) { return ICO(/colaz|coffee/i.test((p.id || '') + p.nome) ? 'coffee' : 'utensils', 13); }).join(' ');
    var pastiBlocco = nPasti
      ? '<span role="img" aria-label="' + nPasti + (nPasti === 1 ? ' pasto' : ' pasti') + '">' + pastiIco + '</span>'
      : '<span>nessun pasto</span>';
    /* «dormi» era la parola di troppo che a 320px mandava la riga a capo: con
       il letto davanti e due orari, «8h» è già la durata del sonno */
    var riass = ICO('bed', 13) + ' <b>' + d.sonno + '</b>→<b>' + d.sveglia + '</b> · ' + fmtOre(LM.minutiSonno(k)) + ' · ' + pastiBlocco;
    const durOpt = function (v: number | null | undefined) { return DURATE.map(function (o) { return '<option value="' + o.v + '"' + ((v || '') === o.v ? ' selected' : '') + '>' + o.t + '</option>'; }).join(''); };
    var pastiRows = (d.pasti || []).map(function (p, i) {
      return '<div class="sp-riga" data-pi="' + i + '">' +
        '<span class="sp-ico">' + ICO(/colaz|coffee/i.test((p.id || '') + p.nome) ? 'coffee' : 'utensils', 15) + '</span>' +
        '<input type="text" class="sp-nome" data-sp-nome="' + i + '" value="' + esc(p.nome) + '" aria-label="Nome del pasto">' +
        '<input type="time" class="tl-time" data-sp-ora="' + i + '" value="' + (p.ora || '') + '" aria-label="Orario">' +
        '<select class="tl-dur" data-sp-dur="' + i + '" aria-label="Durata">' + durOpt(p.durata) + '</select>' +
        '<button class="icona-btn" data-sp-del="' + i + '" title="Rimuovi" aria-label="Rimuovi">' + ICO('trash', 13) + '</button></div>';
    }).join('');
    sonnoTop = '<div class="gio-sonno">' +
      '<button class="gio-sonno-testa" id="gio-sonno-toggle" aria-expanded="' + aperto + '"><span class="gs-riass">' + riass + '</span>' +
      '<span class="bk-chevron' + (aperto ? ' aperta' : '') + '">' + ICO('chevronGiu', 15) + '</span></button>' +
      /* il corpo c'è sempre (nascosto se chiuso): aprirlo non ricostruisce
         la pagina, così il grafico sopra non si muove */
      ('<div class="gio-sonno-corpo"' + (aperto ? '' : ' hidden') + '>' +
        '<div class="sp-sonno">' +
        '<label class="sp-lab" for="sp-aletto">' + ICO('bed', 13) + ' A letto</label><input type="time" class="tl-time" id="sp-aletto" value="' + d.sonno + '">' +
        '<label class="sp-lab" for="sp-sveglia">' + ICO('sun', 13) + ' Sveglia</label><input type="time" class="tl-time" id="sp-sveglia" value="' + d.sveglia + '">' +
        '<span class="sp-dorm">' + ICO('durata', 13) + ' dormi <b id="sp-dorm">' + fmtOre(LM.minutiSonno(k)) + '</b></span>' +
        '</div>' +
        '<div class="sp-pasti" id="sp-pasti">' + pastiRows + '</div>' +
        '<div class="sp-piede"><button class="sp-link" id="sp-add">' + ICO('plus', 13) + ' Pasto</button>' +
        (d.dalRegistro ? '<button class="sp-link" id="sp-reset">Annulla le modifiche</button>' : '') +
        '<button class="sp-link" id="sp-base">Orari abituali</button></div>' +
        '</div>') + '</div>';
  }

  var trayRo = '';
  if (!interactive && d.tray.length) {
    trayRo = '<div class="tl-tray"><div class="tl-tray-eti">Senza orario</div>' +
      d.tray.map(function (e) {
        var ar = areaById(e.areaId), col = LM.coloreArea(ar);
        return '<div class="tl-ed-riga" style="--c-area:' + col + '">' + segnoArea(ar, 13, 'tl-tag') + '<span class="tl-ed-testo">' + esc(e.testo) + '</span></div>';
      }).join('') + '</div>';
  }

  var footer = '';
  /* Ripianificare in blocco: la sera (o un giorno passato rimasto a metà) si
     porta al giorno dopo quello che non è stato fatto, senza riscrivere. */
  if (!compact) {
    var nonFatte = d.placed.concat(d.tray).filter(function (e) { return e.tipo === 'azione' && !e.done; });
    if (nonFatte.length && !isFuturo) {
      var doveVa = etichettaGiorno(LM.addDays(k, 1)).toLowerCase();
      /* la rassicurazione sta DENTRO il tasto, come «+10 XP» sta dentro
         «Fatto»: era una riga a sé sotto un tasto, due elementi per una cosa */
      footer = '<div class="tl-piede"><button class="btn btn-mini" id="tl-rimanda">' + ICO('rimanda', 15) +
        (nonFatte.length === 1 ? ' Rimanda a ' + doveVa + ' l’attività rimasta' : ' Rimanda a ' + doveVa + ' le ' + nonFatte.length + ' attività rimaste') + '</button></div>';
    }
  }
  if (compact && opts.controls !== false) {
    footer = '<div class="tl-piede"><button class="btn btn-primario btn-mini" id="tl-apri-pagina">' + ICO('calendar', 15) + ' Gestisci la giornata ' + ICO('arrowRight', 13) + '</button></div>';
  }

  /* pop-up: la griglia si adatta all'altezza disponibile, così NON si scrolla */
  var narrow = compact && window.innerWidth < 720;
  var pxh = 56;
  if (compact) {
    var bedH = d.sleep <= d.wake ? d.sleep + 1440 : d.sleep; // a letto dopo mezzanotte
    var ore = Math.max(1, Math.ceil(bedH / 60) - Math.floor(d.wake / 60));
    /* altezza-obiettivo della griglia = altezza del pannello meno il "chrome"
       (testa sheet, intestazione, nota, footer, padding), così NON si scrolla */
    var avail = window.innerHeight * (narrow ? 0.9 : 0.86) - 300;
    pxh = Math.max(18, Math.min(narrow ? 42 : 48, avail / ore));
  }
  var sommario = '';
  if (compact && nowMin != null) {
    const pross = d.placed.filter(function (e) { return (e.min ?? 0) + (e.dur || 30) > nowMin && !(e.tipo === 'azione' ? e.done : (e.tipo === 'abitudine' ? e.fatto : false)); })[0];
    sommario = 'Adesso <b>' + fmtMin(nowMin) + '</b>' + (pross ? ' · poi ' + esc(pross.nome || pross.testo) + ' alle ' + pross.ora : ' · niente altro in agenda');
  }
  /* Nella pagina il titolo diceva «La giornata» per la terza volta in
     trecento pixel — dopo il titolo della pagina e dopo la linguetta — e
     sotto c'era il manuale dei gesti («tocca, trascina, spunta»), trentotto
     pixel di lezione mostrati per sempre. Il titolo se ne va, e la riga
     sotto resta SOLO quando dice qualcosa che non puoi indovinare: che il
     giorno è futuro (lo stai preparando) o passato (lo puoi ancora
     sistemare). Per oggi non serve: i gesti si scoprono facendoli, e il
     sottotitolo della pagina spiega già le frecce. */
  var sottoHead = compact
    ? (sommario || 'Spunta quello che fai; per cambiare gli orari apri La giornata.')
    : (isFuturo ? 'Giorno futuro: le spunte si mettono quando ci arrivi.'
       : d.isToday ? ''
       : 'Giorno passato: le spunte si mettono ancora, se qualcosa era rimasto fuori.');
  /* nel pop-up il titolo è già nell'intestazione del pannello: ripeterlo
     "La giornata / La giornata" era solo rumore */
  var head = (opts.header === false || (!compact && !sottoHead)) ? '' :
    '<div class="tl-head"><div>' +
    (compact ? '' : '') +
    '<div class="sotto">' + sottoHead + '</div></div></div>';
  var gridHtml = vuota
    ? '<div class="vuoto" style="padding:18px 8px"><b>Nessuna attività in questo giorno.</b></div>'
    : htmlTimeGrid(d, { interactive: interactive, spuntabile: spuntabile, nowMin: nowMin, pxh: pxh,
        senzaEtichettaSonno: !compact && interactive });

  if (compact) {
    var popNota = d.tray.length ? '<div class="tl-pop-note">' + ICO('clock', 13) + ' ' + d.tray.length + (d.tray.length === 1 ? ' cosa senza orario' : ' cose senza orario') + ', qui sotto.</div>' : '';
    container.innerHTML = '<div class="card giornata giornata-pop">' + head + '<div id="tl-grid-host">' + gridHtml + '</div>' + popNota + footer + '</div>';
  } else {
    /* Il navigatore del giorno era una riga fuori dalla scheda, e la scheda
       aveva una sua intestazione: due teste una sopra l'altra. Adesso è la
       prima riga della scheda — è quello che dice DI CHE GIORNO stai
       guardando le ore, quindi è la sua intestazione. */
  var navGiorno = orizzNav('giorno', k);
    container.innerHTML = '<div class="card giornata">' + navGiorno + head + sonnoTop + '<div id="tl-grid-host">' + gridHtml + '</div>' + senzaOra + quickAdd + trayRo + footer + '</div>';
    wireOrizzNav(container, 'giorno');
  }

  wireRigaAggiunta(container, 'agg-gio', function (testo, opz) {
    const sel = opz.querySelector<HTMLSelectElement>('select');
    LM.aggiungiAzione(testo, sel ? sel.value : 'altro', { data: k, mit: LM.serveMit(k) });
    montaGiornata(container, opts); aggiornaNav();
  });

  if (interactive) {
    /* completare un elemento (spunta) ricostruisce tutto: non c'è un campo
       attivo da preservare. */
    function onCambio() { montaGiornata(container, opts); aggiornaNav(); }
    function wireGriglia(scope: ParentNode): void {
      scope.querySelectorAll<HTMLElement>('.tl-check[data-tl-az], .tl-blk-check[data-tl-az]').forEach(function (b) {
        b.addEventListener('click', function (ev) {
          const id = b.getAttribute('data-tl-az');
          if (!id) return;
          feedbackSpunta(ev, LM.completaAzione(id), 'Fatto.', 'check');
          onCambio();
        });
      });
      scope.querySelectorAll<HTMLElement>('.tl-check[data-tl-ab], .tl-blk-check[data-tl-ab]').forEach(function (b) {
        b.addEventListener('click', function (ev) {
          const id = b.getAttribute('data-tl-ab');
          if (!id) return;
          feedbackSpunta(ev, LM.completaAbitudine(id, k), 'Fatta. Continua così.', 'flame');
          montaGiornata(container, opts);
        });
      });
      /* toccare un blocco (o una riga «senza orario») apre il pannellino di
         modifica di QUELLA cosa: orario, durata, area, spunta. */
      scope.querySelectorAll<HTMLElement>('[data-blk-az]').forEach(function (b) {
        b.addEventListener('click', function () { const id = b.getAttribute('data-blk-az'); if (id) apriItemGiornata(k, id, 'azione', onCambio, spuntabile); });
      });
      scope.querySelectorAll<HTMLElement>('[data-blk-ab]').forEach(function (b) {
        b.addEventListener('click', function () { const id = b.getAttribute('data-blk-ab'); if (id) apriItemGiornata(k, id, 'abitudine', onCambio, spuntabile); });
      });
    }
    /* refresh SOLO della griglia visiva (usato dai cambi di sonno/pasti):
       non tocca eventuali campi con il fuoco altrove nella pagina. */
    function refreshGriglia() {
      var host = container.querySelector<HTMLElement>('#tl-grid-host');
      if (!host) { montaGiornata(container, opts); return; }
      host.innerHTML = htmlTimeGrid(nodiGiorno(k), { interactive: true, spuntabile: spuntabile, nowMin: nowMin, pxh: pxh });
      wireGriglia(host);
    }
    wireGriglia(container);
    /* trascinare: sulla griglia dà l'ora del punto in cui lasci (a 15
       minuti), sulla zona "senza orario" toglie l'orario */
    var grigliaEl = container.querySelector<HTMLElement>('.tl-grid');
    if (grigliaEl) grigliaEl.setAttribute('data-drop-ora', '1');
    var zonaSo = container.querySelector<HTMLElement>('.gio-so');
    if (zonaSo) zonaSo.setAttribute('data-drop-senzaora', '1');
    /* togliere l'orario si può sempre, anche quando la lista «Senza orario»
       non c'è o è fuori schermo: mentre trascini compare in basso una zona
       dove lasciarla */
    if (!container.querySelector('.gio-so-drop')) {
      const zona = document.createElement('div');
      zona.className = 'gio-so-drop';
      zona.setAttribute('data-drop-senzaora', '1');
      zona.innerHTML = ICO('clock', 15) + '<span>Togli l’orario</span>';
      container.appendChild(zona);
    }
    container.querySelectorAll<HTMLInputElement>('.gio-so-ora-campo').forEach(function (inp) {
      inp.addEventListener('change', function () {
        if (!inp.value) return;
        const id = inp.getAttribute('data-so-ora') || '', o = comeOra(inp.value);
        if (inp.getAttribute('data-so-tipo') === 'abitudine') LM.spostaAbitudineIlGiorno(id, k, o);
        else { LM.setOraAzione(id, o); LM.spostaAzione(id, k); }
        toast('Alle ' + o + '.', 0, 'clock');
        montaGiornata(container, opts); aggiornaNav();
      });
    });
    abilitaTrascina(container, function (id, bersaglio, _x, y) {
      if (id.indexOf('ab:') === 0) {
        const hid = id.split(':')[1] || '';
        if (bersaglio.hasAttribute('data-drop-senzaora')) {
          LM.spostaAbitudineIlGiorno(hid, k, '-');
          toast('Oggi senza orario.', 0, 'clock');
          montaGiornata(container, opts); aggiornaNav();
          return;
        }
        if (!bersaglio.hasAttribute('data-drop-ora')) { toast('Le abitudini non si spostano di giorno.', 0, 'clock'); return; }
        const gs = +(bersaglio.getAttribute('data-gs') || ''), pxh = +(bersaglio.getAttribute('data-pxh') || '');
        if (isNaN(gs) || !pxh) return;
        const r = bersaglio.getBoundingClientRect();
        const min = Math.max(0, Math.round((gs + (y - r.top) / pxh * 60) / 15) * 15) % 1440;
        LM.spostaAbitudineIlGiorno(hid, k, comeOra(fmtMin(min)));
        toast('Oggi alle ' + fmtMin(min), 0, 'clock');
        montaGiornata(container, opts); aggiornaNav();
        return;
      }
      if (bersaglio.hasAttribute('data-drop-senzaora')) {
        LM.setOraAzione(id, null);
        toast('Orario rimosso.', 0, 'clock');
      } else if (bersaglio.hasAttribute('data-drop-ora')) {
        const gs = +(bersaglio.getAttribute('data-gs') || ''), pxh = +(bersaglio.getAttribute('data-pxh') || '');
        if (isNaN(gs) || !pxh) return;
        const r = bersaglio.getBoundingClientRect();
        const grezzo = gs + (y - r.top) / pxh * 60;
        const min = Math.max(0, Math.round(grezzo / 15) * 15) % 1440;
        LM.setOraAzione(id, comeOra(fmtMin(min)));
        LM.spostaAzione(id, k);
        toast('Spostata alle ' + fmtMin(min) + '.', 0, 'clock');
      } else if (bersaglio.hasAttribute('data-drop-giorno')) {
        const g = bersaglio.getAttribute('data-drop-giorno');
        if (!g || !LM.spostaAzione(id, comeGiorno(g))) return;
        toast('Spostata a ' + etichettaGiorno(comeGiorno(g)).toLowerCase() + '.', 0, 'calendar');
      }
      montaGiornata(container, opts); aggiornaNav();
    });

    /* --- sonno e pasti del giorno (registro), modifica uno per uno --- */
    function aggiornaDorm() { const el = container.querySelector<HTMLElement>('#sp-dorm'); if (el) el.textContent = fmtOre(LM.minutiSonno(k)); }
    function leggiPasti(): Pasto[] { return JSON.parse(JSON.stringify(nodiGiorno(k).pasti || [])) as Pasto[]; }
    const spA = campoSe(container, '#sp-aletto');
    if (spA) spA.addEventListener('change', function () { LM.setRitmoGiorno(k, { sonno: spA.value ? comeOra(spA.value) : d.sonno }); aggiornaDorm(); refreshGriglia(); });
    const spS = campoSe(container, '#sp-sveglia');
    if (spS) spS.addEventListener('change', function () { LM.setRitmoGiorno(k, { sveglia: spS.value ? comeOra(spS.value) : d.sveglia }); aggiornaDorm(); refreshGriglia(); });
    container.querySelectorAll<HTMLInputElement>('[data-sp-nome]').forEach(function (inp) {
      inp.addEventListener('change', function () {
        const arr = leggiPasti(); const p = arr[+(inp.getAttribute('data-sp-nome') || '')];
        if (p) { p.nome = inp.value.trim() || 'Pasto'; LM.setRitmoGiorno(k, { pasti: arr }); }
      });
    });
    container.querySelectorAll<HTMLInputElement>('[data-sp-ora]').forEach(function (inp) {
      inp.addEventListener('change', function () {
        const arr = leggiPasti(); const p = arr[+(inp.getAttribute('data-sp-ora') || '')];
        if (p) { p.ora = comeOra(inp.value); LM.setRitmoGiorno(k, { pasti: arr }); refreshGriglia(); }
      });
    });
    container.querySelectorAll<HTMLSelectElement>('[data-sp-dur]').forEach(function (sel) {
      sel.addEventListener('change', function () {
        const arr = leggiPasti(); const p = arr[+(sel.getAttribute('data-sp-dur') || '')];
        if (p) { p.durata = sel.value ? +sel.value : 30; LM.setRitmoGiorno(k, { pasti: arr }); refreshGriglia(); }
      });
    });
    container.querySelectorAll<HTMLElement>('[data-sp-del]').forEach(function (b) {
      b.addEventListener('click', function () { const arr = leggiPasti(); arr.splice(+(b.getAttribute('data-sp-del') || ''), 1); LM.setRitmoGiorno(k, { pasti: arr }); montaGiornata(container, opts); });
    });
    const spAdd = container.querySelector<HTMLElement>('#sp-add');
    if (spAdd) spAdd.addEventListener('click', function () { const arr = leggiPasti(); arr.push({ id: 'p' + Date.now().toString(36), nome: 'Pasto', ora: comeOra(''), durata: 30 }); LM.setRitmoGiorno(k, { pasti: arr }); montaGiornata(container, opts); });
    const spReset = container.querySelector<HTMLElement>('#sp-reset');
    if (spReset) spReset.addEventListener('click', function () { LM.azzeraRitmoGiorno(k); toast('Orari ripristinati.', 0, 'annulla'); montaGiornata(container, opts); });
    const spBase = container.querySelector<HTMLElement>('#sp-base');
    if (spBase) spBase.addEventListener('click', apriRitmo);
    const gsT = container.querySelector<HTMLElement>('#gio-sonno-toggle');
    if (gsT) gsT.addEventListener('click', function () {
      giornataSonnoAperto = !giornataSonnoAperto;
      const corpo = container.querySelector<HTMLElement>('.gio-sonno-corpo');
      if (corpo) corpo.hidden = !giornataSonnoAperto;
      gsT.setAttribute('aria-expanded', String(giornataSonnoAperto));
      const ch = gsT.querySelector<HTMLElement>('.bk-chevron');
      if (ch) ch.classList.toggle('aperta', giornataSonnoAperto);
    });
  }
  var rim = container.querySelector<HTMLElement>('#tl-rimanda');
  if (rim) rim.addEventListener('click', function () {
    var n = LM.rimandaNonFatte(k, LM.addDays(k, 1));
    toast(n === 1 ? 'Spostata al giorno dopo.' : n + ' cose spostate al giorno dopo.', 0, 'rimanda');
    montaGiornata(container, opts); aggiornaNav();
  });
  var ap = container.querySelector<HTMLElement>('#tl-apri-pagina');
  if (ap) ap.addEventListener('click', function () { chiudiSheet(); location.hash = '#/giornata'; });
}

/* --- Settimana: 7 colonne con blocchi (scroll orizzontale su mobile) --- */
/* LA SETTIMANA, sul telefono: in alto i sette giorni (fermi mentre scorri,
   e sono anche i posti dove lasciare una cosa trascinata), sotto le cose di
   ogni giorno in fila, con l'ora davanti. Sette colonne larghe un dito
   tagliavano ogni nome a tre lettere. Sullo schermo largo resta la griglia. */
let settSposta: string | null = null;
function montaSettimana(container: HTMLElement): void {
  if (window.innerWidth >= 861) { montaSettimanaGriglia(container); return; }
  const lunedi = LM.weekKey(schermo.giornataAncora);
  const giorni: Giorno[] = []; for (let i = 0; i < 7; i++) giorni.push(LM.addDays(lunedi, i));
  const oggi = LM.todayKey();
  const NOMI = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  const spostata = settSposta ? LM.snapshot().azioni.find(function (a) { return a.id === settSposta; }) : null;
  let fatteSett = 0, totSett = 0;
  const striscia = giorni.map(function (k) {
    const d = nodiGiorno(k);
    const voci = d.placed.concat(d.tray).filter(function (e) { return e.tipo !== 'pasto'; });
    const fatte = voci.filter(function (e) { return e.tipo === 'azione' ? e.done : e.fatto; }).length;
    fatteSett += fatte; totSett += voci.length;
    const dt = new Date(k + 'T12:00:00');
    return '<button class="se-g' + (k === oggi ? ' oggi' : '') + (spostata ? ' bersaglio' : '') + '" data-se-g="' + k + '" data-drop-giorno="' + k + '">' +
      '<small>' + (NOMI[dt.getDay()] || '').charAt(0) + '</small>' +
      anelloGiorno(k > oggi || !voci.length ? 0 : fatte / voci.length, dt.getDate(), k === oggi ? 'oggi' : (k > oggi ? 'futuro' : '')) +
      '</button>';
  }).join('');
  const giorniHtml = giorni.map(function (k) {
    const d = nodiGiorno(k);
    const voci = d.placed.filter(function (e) { return e.tipo !== 'pasto'; }).concat(d.tray);
    const dt = new Date(k + 'T12:00:00');
    const righe = voci.map(function (e) {
      const ar = areaById(e.areaId), fatto = e.tipo === 'azione' ? e.done : e.fatto;
      const az = e.tipo === 'azione';
      return '<div class="se-riga' + (fatto ? ' fatta' : '') + (az ? '' : ' abit') + '" style="--c-area:' + LM.coloreArea(ar) + '"' +
        (az ? ' data-drag-az="' + e.id + '" data-dur="' + (e.dur || 30) + '"' : '') + '>' +
        '<span class="se-ora">' + (e.ora ? esc(e.ora) : '') + '</span>' +
        '<button class="se-apri" data-se-' + (az ? 'az' : 'ab') + '="' + e.id + '" data-se-k="' + k + '">' +
        (az ? '<span class="se-segno"></span>' : '<span class="se-segno-ab">' + ICO('refresh', 13) + '</span>') + '<span class="se-nome">' + esc(e.testo) + '</span></button>' +
        (az && !fatto ? '<button class="sp-link se-sposta" data-se-sposta="' + e.id + '">Sposta</button>' : '') +
        '</div>';
    }).join('');
    return '<section class="se-giorno' + (k === oggi ? ' oggi' : '') + (k < oggi ? ' passato' : '') + '" id="se-' + k + '">' +
      '<button class="se-testa" data-se-apri="' + k + '"><b>' + (NOMI[dt.getDay()] || '') + ' ' + dt.getDate() + '</b>' +
      (k === oggi ? '<span class="se-oggi">Oggi</span>' : '') + ICO('chevronGiu', 13) + '</button>' +
      (righe ? '<div class="se-lista">' + righe + '</div>' : '<div class="se-vuoto">Libero</div>') + '</section>';
  }).join('');
  container.innerHTML = orizzNav('settimana', presa(giorni[0]), presa(giorni[6])) +
    '<div class="se-striscia">' +
    (spostata
      ? '<div class="me-modo">' + ICO('calendar', 15) + '<span>Tocca il giorno per <b>' + esc(spostata.testo) + '</b></span><button class="sp-link" id="se-annulla">Annulla</button></div>'
      : '<div class="se-somma"><b>' + fatteSett + '</b> di ' + totSett + ' fatte questa settimana</div>') +
    '<div class="se-giorni">' + striscia + '</div></div>' +
    '<div class="se-agenda">' + giorniHtml + '</div>';
  wireOrizzNav(container, 'settimana');
  function ridisegna(): void { montaSettimana(container); aggiornaNav(); }
  container.querySelectorAll<HTMLElement>('[data-se-g]').forEach(function (b) {
    b.addEventListener('click', function () {
      const k = comeGiorno(b.getAttribute('data-se-g') || '');
      if (settSposta) {
        const id = settSposta; settSposta = null;
        if (LM.spostaAzione(id, k)) { toast('Spostata a ' + etichettaGiorno(k).toLowerCase(), 0, 'calendar'); suona('leggero'); }
        ridisegna(); return;
      }
      const sez = document.getElementById('se-' + k);
      if (sez) window.scrollTo({ top: sez.getBoundingClientRect().top + window.scrollY - 200, behavior: 'smooth' });
    });
  });
  container.querySelectorAll<HTMLElement>('[data-se-sposta]').forEach(function (b) {
    b.addEventListener('click', function () { settSposta = b.getAttribute('data-se-sposta'); ridisegna(); });
  });
  const ann = container.querySelector<HTMLElement>('#se-annulla');
  if (ann) ann.addEventListener('click', function () { settSposta = null; ridisegna(); });
  container.querySelectorAll<HTMLElement>('[data-se-apri]').forEach(function (b) {
    b.addEventListener('click', function () { setOrizzonte('giorno', comeGiorno(b.getAttribute('data-se-apri') || '')); });
  });
  container.querySelectorAll<HTMLElement>('[data-se-az], [data-se-ab]').forEach(function (b) {
    b.addEventListener('click', function () {
      const k = comeGiorno(b.getAttribute('data-se-k') || '');
      const az = b.getAttribute('data-se-az');
      apriItemGiornata(k, az || b.getAttribute('data-se-ab') || '', az ? 'azione' : 'abitudine', ridisegna, k <= oggi);
    });
  });
  abilitaTrascina(container, spostaSuGiorno);
}

function montaSettimanaGriglia(container: HTMLElement): void {
  var lunedi = LM.weekKey(schermo.giornataAncora);
  var giorni = []; for (var i = 0; i < 7; i++) giorni.push(LM.addDays(lunedi, i));
  var oggi = LM.todayKey();
  var nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  var d0 = nodiGiorno(oggi);
  var pxh = 42;
  var bed0 = d0.sleep <= d0.wake ? d0.sleep + 1440 : d0.sleep; // a letto dopo mezzanotte
  var gs = Math.floor(d0.wake / 60) * 60, ge = Math.ceil(bed0 / 60) * 60; if (ge <= gs) ge = gs + 60;
  var railLines = '';
  for (var hh = gs; hh <= ge; hh += 60) railLines += '<div class="wk-rail-h" style="top:' + ((hh - gs) / 60 * pxh) + 'px">' + fmtMin(hh) + '</div>';
  var Hs = (ge - gs) / 60 * pxh;

  var cols = giorni.map(function (k) {
    var dk = nodiGiorno(k);
    var scad = LM.snapshot().backlog.filter(function (b) { return b.scadenza === k; });
    var untimed = dk.tray.length ? '<span class="wk-untimed" title="' + dk.tray.length + ' senza orario">' + dk.tray.length + ' senza ora</span>' : '';
    var scadHtml = scad.length ? '<div class="wk-scad" title="scadenze">' + ICO('scadenza', 11) + ' ' + scad.length + '</div>' : '';
    var grid = htmlTimeGrid(dk, { pxh: pxh, rail: false, mini: true, nowMin: k === oggi ? nowMin : null });
    var lab = LM.weekdayShort(k); lab = lab.charAt(0).toUpperCase() + lab.slice(1);
    return '<div class="wk-col' + (k === oggi ? ' oggi' : '') + '" data-tl-giorno="' + k + '">' +
      '<div class="wk-col-head"><b>' + lab + '</b><span>' + LM.fmtShort(k) + '</span>' + untimed + '</div>' +
      scadHtml + grid + '</div>';
  }).join('');

  container.innerHTML = orizzNav('settimana', presa(giorni[0]), presa(giorni[6])) +
    '<div class="card"><div class="wk-wrap"><div class="wk-rail" style="height:' + Hs + 'px">' + railLines + '</div>' +
    '<div class="wk-cols">' + cols + '</div></div>' +
    '</div>';
  wireOrizzNav(container, 'settimana');
  celleGiorno(container);
  /* trascinare una cosa da un giorno all'altro: ripianificare la settimana
     muovendo i blocchi, senza aprire niente */
  abilitaTrascina(container, spostaSuGiorno);
}

/* LE CELLE DEI GIORNI, in settimana e in mese: si toccano per aprire quel
   giorno e si possono usare come bersaglio del trascinamento. Erano due
   blocchi identici a settanta righe di distanza. */
function celleGiorno(container: HTMLElement): void {
  container.querySelectorAll<HTMLElement>('[data-tl-giorno]').forEach(function (el) {
    const k = el.getAttribute('data-tl-giorno');
    if (!k) return;
    el.addEventListener('click', function () { setOrizzonte('giorno', comeGiorno(k)); });
    el.setAttribute('data-drop-giorno', k);
  });
}
/* e cosa fare quando si lascia: idem, era scritto due volte */
function spostaSuGiorno(id: string, bersaglio: HTMLElement, _x?: number, y?: number): void {
  const quale = bersaglio.getAttribute('data-drop-giorno');
  if (!quale) return;
  if (id.indexOf('ab:') === 0) {
    const parti = id.split(':'), hid = parti[1] || '', da = parti[2] || '';
    const gr = bersaglio.querySelector<HTMLElement>('[data-pxh]') || bersaglio.closest<HTMLElement>('[data-pxh]');
    if (quale !== da || !gr || y == null) { toast('Le abitudini non si spostano di giorno: cambia solo l’ora.', 0, 'calendar'); return; }
    const gs0 = +(gr.getAttribute('data-gs') || ''), px0 = +(gr.getAttribute('data-pxh') || '');
    const rr = gr.getBoundingClientRect();
    if (isNaN(gs0) || !px0) return;
    const m0 = Math.max(0, Math.round((gs0 + (y - rr.top) / px0 * 60) / 15) * 15) % 1440;
    LM.spostaAbitudineIlGiorno(hid, comeGiorno(quale), comeOra(fmtMin(m0)));
    toast(etichettaGiorno(comeGiorno(quale)) + ', ' + fmtMin(m0), 0, 'clock');
    disegnaOrizzonte(); aggiornaNav();
    return;
  }
  const g = comeGiorno(quale);
  /* nella settimana il giorno ha la sua griglia delle ore: lasciando la
     cosa a un'altezza le si dà anche l'orario, come nel giorno */
  const griglia = bersaglio.querySelector<HTMLElement>('[data-pxh]') || bersaglio.closest<HTMLElement>('[data-pxh]');
  let ora = '';
  if (griglia && y != null) {
    const gs = +(griglia.getAttribute('data-gs') || ''), pxh = +(griglia.getAttribute('data-pxh') || '');
    const r = griglia.getBoundingClientRect();
    if (!isNaN(gs) && pxh && y >= r.top && y <= r.bottom) {
      ora = fmtMin((Math.max(0, Math.round((gs + (y - r.top) / pxh * 60) / 15) * 15)) % 1440);
      LM.setOraAzione(id, comeOra(ora));
    }
  }
  if (!LM.spostaAzione(id, g) && !ora) return;
  toast('Spostata a ' + etichettaGiorno(g).toLowerCase() + (ora ? ', ' + ora : ''), 0, 'calendar');
  disegnaOrizzonte(); aggiornaNav();
}

/* --- Mese: calendario con indicatori di attività e scadenze --- */
/* IL MESE: un cerchio per giorno che si riempie con quello che hai fatto,
   e sotto le cose del giorno che tocchi. Per spostare una cosa si preme
   «Sposta» e poi si tocca il giorno d'arrivo: niente da trascinare sotto il
   dito, e si vede sempre cosa si sta spostando. */
let meseSel: Giorno | null = null;
let meseSposta: string | null = null;
function anelloGiorno(quota: number, num: number, cls: string): string {
  const r = 15, c = 2 * Math.PI * r, q = Math.max(0, Math.min(1, quota));
  return '<svg class="me-anello ' + cls + '" viewBox="0 0 36 36" aria-hidden="true">' +
    '<circle cx="18" cy="18" r="' + r + '" class="me-anello-fondo"/>' +
    (q > 0 ? '<circle cx="18" cy="18" r="' + r + '" class="me-anello-pieno" stroke-dasharray="' + (c * q).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 18 18)"/>' : '') +
    '<text x="18" y="18" dy=".35em" text-anchor="middle">' + num + '</text></svg>';
}
function montaMese(container: HTMLElement): void {
  const p = schermo.giornataAncora.split('-');
  const anno = +(p[0] || 0), mese = +(p[1] || 1) - 1;
  const primo = new Date(anno, mese, 1);
  const inizio = new Date(anno, mese, 1 - ((primo.getDay() + 6) % 7));
  const oggi = LM.todayKey();
  const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
  const s = LM.snapshot();
  const prefisso = anno + '-' + ('0' + (mese + 1)).slice(-2);
  if (!meseSel || meseSel.slice(0, 7) !== prefisso) meseSel = oggi.slice(0, 7) === prefisso ? oggi : comeGiorno(prefisso + '-01');
  const sel: Giorno = meseSel;
  let attivi = 0, fatteMese = 0;
  let celle = '';
  for (let i = 0; i < 42; i++) {
    const d = new Date(inizio.getFullYear(), inizio.getMonth(), inizio.getDate() + i);
    if (i >= 35 && d.getMonth() !== mese) break;
    const k = LM.dayKey(d);
    const fuori = d.getMonth() !== mese;
    const az = LM.azioniDelGiorno(k);
    const ab = s.abitudini.filter(function (h) { return LM.abitudinePrevista(h, k); });
    const tot = az.length + ab.length;
    const fatte = az.filter(function (a) { return a.done; }).length + ab.filter(function (h) { return h.fatti[k]; }).length;
    if (!fuori) { fatteMese += fatte; if (fatte) attivi++; }
    const daFare = az.filter(function (a) { return !a.done; });
    const punti = daFare.slice(0, 3).map(function (a) { return '<i style="background:' + LM.coloreArea(areaById(a.areaId)) + '"></i>'; }).join('');
    const scad = s.backlog.some(function (b) { return b.scadenza === k; });
    const cls = (k === oggi ? 'oggi' : '') + (k > oggi ? ' futuro' : '');
    celle += '<button class="me-g' + (fuori ? ' fuori' : '') + (k === sel ? ' sel' : '') + (meseSposta ? ' bersaglio' : '') + '" data-me-g="' + k + '"' +
      ' aria-label="' + LM.weekdayShort(k) + ' ' + LM.fmtShort(k) + (tot ? ', ' + fatte + ' di ' + tot + ' fatte' : '') + '">' +
      anelloGiorno(k > oggi || !tot ? 0 : fatte / tot, d.getDate(), cls) +
      '<span class="me-punti">' + punti + (scad ? '<b></b>' : '') + '</span></button>';
  }
  const dowh = ['L', 'M', 'M', 'G', 'V', 'S', 'D'].map(function (x) { return '<span>' + x + '</span>'; }).join('');

  /* le cose del giorno scelto */
  const azSel = LM.azioniDelGiorno(sel);
  const abSel = s.abitudini.filter(function (h) { return LM.abitudinePrevista(h, sel); });
  const spostata = meseSposta ? s.azioni.find(function (a) { return a.id === meseSposta; }) : null;
  const righe = abSel.map(function (h) {
    const ar = areaById(h.areaId), o = LM.oraAbitudine(h, sel);
    return { ora: o || '', html: '<div class="lista-riga me-riga' + (h.fatti[sel] ? ' fatta' : '') + '">' +
      '<button class="lista-apri" data-me-ab="' + h.id + '"><span class="me-pallino abit" style="--c-area:' + LM.coloreArea(ar) + '"></span>' +
      '<span class="lista-corpo"><span class="lista-tit">' + esc(h.testo) + '</span><span class="lista-sub">' + ICO('refresh', 11) + ' Abitudine' + (o ? ' · ' + o : '') + '</span></span></button></div>' };
  }).concat(azSel.map(function (a) {
    const ar = areaById(a.areaId);
    return { ora: a.ora || '', html: '<div class="lista-riga me-riga' + (a.done ? ' fatta' : '') + '">' +
      '<button class="lista-apri" data-me-az="' + a.id + '"><span class="me-pallino" style="--c-area:' + LM.coloreArea(ar) + '"></span>' +
      '<span class="lista-corpo"><span class="lista-tit">' + esc(a.testo) + '</span><span class="lista-sub">' + esc(ar.nome) + (a.ora ? ' · ' + a.ora : '') + '</span></span></button>' +
      (a.done ? '' : '<button class="sp-link me-sposta" data-me-sposta="' + a.id + '">Sposta</button>') + '</div>' };
  })).sort(function (x, y) { return (x.ora || '99') < (y.ora || '99') ? -1 : (x.ora || '99') > (y.ora || '99') ? 1 : 0; })
    .map(function (x) { return x.html; }).join('');

  container.innerHTML = orizzNav('mese', schermo.giornataAncora, null, (MESI[mese] || '') + ' ' + anno) +
    (spostata
      ? '<div class="me-modo">' + ICO('calendar', 15) + '<span>Tocca il giorno per <b>' + esc(spostata.testo) + '</b></span><button class="sp-link" id="me-annulla">Annulla</button></div>'
      : '<div class="me-somma"><span><b>' + attivi + '</b> giorni attivi</span><span><b>' + fatteMese + '</b> attività fatte</span></div>') +
    '<div class="card me-carta"><div class="me-dow">' + dowh + '</div><div class="me-griglia">' + celle + '</div></div>' +
    '<div class="me-giorno"><div class="me-giorno-testa"><h2>' + esc(etichettaGiorno(sel)) + '</h2>' +
    '<button class="sp-link" id="me-apri">Apri il giorno ' + ICO('chevronGiu', 13) + '</button></div>' +
    (righe ? '<div class="lista">' + righe + '</div>' : '<div class="me-vuoto">Niente in programma.</div>') + '</div>';
  wireOrizzNav(container, 'mese');
  function ridisegna(): void { montaMese(container); aggiornaNav(); }
  container.querySelectorAll<HTMLElement>('[data-me-g]').forEach(function (b) {
    b.addEventListener('click', function () {
      const k = comeGiorno(b.getAttribute('data-me-g') || '');
      if (meseSposta) {
        const id = meseSposta; meseSposta = null;
        if (LM.spostaAzione(id, k)) { toast('Spostata a ' + etichettaGiorno(k).toLowerCase(), 0, 'calendar'); suona('leggero'); }
        meseSel = k; ridisegna(); return;
      }
      meseSel = k; ridisegna();
    });
  });
  container.querySelectorAll<HTMLElement>('[data-me-sposta]').forEach(function (b) {
    b.addEventListener('click', function () { meseSposta = b.getAttribute('data-me-sposta'); ridisegna(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  });
  const ann = container.querySelector<HTMLElement>('#me-annulla');
  if (ann) ann.addEventListener('click', function () { meseSposta = null; ridisegna(); });
  const apri = container.querySelector<HTMLElement>('#me-apri');
  if (apri) apri.addEventListener('click', function () { setOrizzonte('giorno', sel); });
  container.querySelectorAll<HTMLElement>('[data-me-az]').forEach(function (b) {
    b.addEventListener('click', function () { apriItemGiornata(sel, b.getAttribute('data-me-az') || '', 'azione', ridisegna, sel <= oggi); });
  });
  container.querySelectorAll<HTMLElement>('[data-me-ab]').forEach(function (b) {
    b.addEventListener('click', function () { apriItemGiornata(sel, b.getAttribute('data-me-ab') || '', 'abitudine', ridisegna, sel <= oggi); });
  });
}

/* L'ANNO: dodici mesi piccoli, come il calendario del telefono. Ogni giorno
   è un quadratino che si accende con quanto hai fatto; toccando un mese
   ci si entra. */
function montaAnno(container: HTMLElement): void {
  const anno = +(schermo.giornataAncora.split('-')[0] || 0);
  const s = LM.snapshot();
  const oggi = LM.todayKey();
  const MESI = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
  let attivi = 0, maxXp = 1, xpAnno = 0;
  for (let k = comeGiorno(anno + '-01-01'); +(k.split('-')[0] || 0) === anno; k = LM.addDays(k, 1)) {
    const v = s.xpPerGiorno[k] || 0; xpAnno += v; if (v > maxXp) maxXp = v; if (LM.giornoAttivo(k)) attivi++;
  }
  const azFatte = s.azioni.filter(function (a) { return a.done && a.data.slice(0, 4) === '' + anno; }).length;
  let mesiHtml = '';
  for (let m = 0; m < 12; m++) {
    const primo = new Date(anno, m, 1), giorniMese = new Date(anno, m + 1, 0).getDate();
    let celle = '';
    for (let v = 0; v < (primo.getDay() + 6) % 7; v++) celle += '<i class="vuota"></i>';
    let attiviMese = 0;
    for (let g = 1; g <= giorniMese; g++) {
      const k = comeGiorno(anno + '-' + ('0' + (m + 1)).slice(-2) + '-' + ('0' + g).slice(-2));
      const xp = s.xpPerGiorno[k] || 0;
      const liv = xp <= 0 ? 0 : Math.min(4, Math.ceil(xp / maxXp * 4));
      if (LM.giornoAttivo(k)) attiviMese++;
      celle += '<i class="l' + liv + (k === oggi ? ' oggi' : '') + (k > oggi ? ' poi' : '') + '"></i>';
    }
    const ora = oggi.slice(0, 7) === anno + '-' + ('0' + (m + 1)).slice(-2);
    mesiHtml += '<button class="an-mese' + (ora ? ' ora' : '') + '" data-an-mese="' + m + '">' +
      '<span class="an-mese-testa"><b>' + MESI[m] + '</b>' + (attiviMese ? '<small>' + attiviMese + '</small>' : '') + '</span>' +
      '<span class="an-mese-griglia">' + celle + '</span></button>';
  }
  const scad = s.backlog.filter(function (b) { return b.scadenza && b.scadenza.slice(0, 4) === '' + anno; })
    .sort(function (a, b) { return (a.scadenza || '') < (b.scadenza || '') ? -1 : 1; });
  const scadHtml = scad.map(function (b) {
    const ar = areaById(b.areaId);
    const si = scadInfo(presa(b.scadenza));
    return '<div class="an-scad"><span class="scad-badge ' + si.cls + '">' + LM.fmtShort(presa(b.scadenza)) + '</span>' +
      '<span class="scad-testo">' + esc(b.testo) + '</span>' + segnoArea(ar, 13, 'tl-tag') + '</div>';
  }).join('');

  container.innerHTML = orizzNav('anno', schermo.giornataAncora, null, '' + anno) +
    '<div class="an-numeri"><span><b>' + attivi + '</b>giorni attivi</span><span><b>' + azFatte + '</b>attività fatte</span><span><b>' + xpAnno + '</b>XP</span></div>' +
    '<div class="an-mesi">' + mesiHtml + '</div>' +
    (scad.length ? '<div class="card mt"><h2>' + ICO('scadenza', 15) + ' Scadenze</h2><div class="an-scad-lista mt-s">' + scadHtml + '</div></div>' : '');
  wireOrizzNav(container, 'anno');
  container.querySelectorAll<HTMLElement>('[data-an-mese]').forEach(function (b) {
    b.addEventListener('click', function () {
      const m = +(b.getAttribute('data-an-mese') || 0);
      setOrizzonte('mese', comeGiorno(anno + '-' + ('0' + (m + 1)).slice(-2) + '-01'));
    });
  });
}

function orizzNav(orizz: Orizzonte, k1: Giorno, k2?: Giorno | null, etichetta?: string): string {
  /* «17–23 ago», non «17 Ago – 23 Ago»: il mese una volta sola, in minuscolo */
  const intervallo = function (a: Giorno, b: Giorno): string {
    const fa = LM.fmtShort(a).split(' '), fb = LM.fmtShort(b).split(' ');
    return fa[1] === fb[1] ? fa[0] + '–' + fb[0] + ' ' + (fb[1] || '') : LM.fmtShort(a) + ' – ' + LM.fmtShort(b);
  };
  const grezzo = etichetta || (k2 ? intervallo(k1, k2) : etichettaGiorno(k1));
  const testo = /^\d/.test(grezzo) ? grezzo : grezzo.charAt(0).toUpperCase() + grezzo.slice(1);
  /* Quanto siamo lontani da oggi: senza questo, spostandosi di un giorno
     cambiava solo una scritta piccola e sembrava che le frecce non
     facessero niente (i pasti e le abitudini sono uguali ogni giorno). */
  const oggi = LM.todayKey();
  /* `null` vuol dire «non si sa»: negli orizzonti larghi la distanza in
     giorni non è un numero che significhi qualcosa, e infatti non si scrive */
  const dist: number | null = orizz === 'giorno' ? LM.daysBetween(oggi, k1) : (k2 ? (k1 <= oggi && oggi <= k2 ? 0 : null) : null);
  const lontano = orizz === 'giorno' ? dist !== 0 : (schermo.giornataAncora !== oggi && dist !== 0);
  let quanto = '';
  if (orizz === 'giorno' && dist !== null && dist !== 0) {
    quanto = '<span class="orizz-dist' + (dist > 0 ? ' futuro' : ' passato') + '">' +
      (dist === 1 ? 'domani' : dist === -1 ? 'ieri' : dist > 0 ? 'tra ' + dist + ' giorni' : dist + ' giorni fa').replace('-', '') + '</span>';
  }
  return '<div class="orizz-barra' + (lontano ? ' via-da-oggi' : '') + '">' +
    '<button class="icona-btn" data-nav="prev" aria-label="' + (orizz === 'giorno' ? 'Giorno precedente' : 'Periodo precedente') + '">' + ICO('chevronGiu', 15) + '</button>' +
    '<span class="orizz-eti">' + testo + quanto + '</span>' +
    '<button class="icona-btn" data-nav="next" aria-label="' + (orizz === 'giorno' ? 'Giorno successivo' : 'Periodo successivo') + '">' + ICO('chevronGiu', 15) + '</button>' +
    /* "Oggi" compare solo se serve: se ci sei già non fa nulla e confondeva
       stando attaccato alla freccia "successivo" */
    (lontano ? '<button class="btn btn-mini btn-primario" data-nav="oggi">' + ICO('target', 13) + ' Oggi</button>' : '') +
    '</div>';
}
function shiftKey(k: Giorno, orizz: Orizzonte, n: number): Giorno {
  const p = k.split('-');
  const anno = +(p[0] || 0), mese = +(p[1] || 1) - 1;
  let d: Date;
  if (orizz === 'giorno') return LM.addDays(k, n);
  if (orizz === 'settimana') return LM.addDays(k, n * 7);
  if (orizz === 'mese') { d = new Date(anno, mese + n, 1); }
  else { d = new Date(anno + n, mese, 1); }
  return comeGiorno(d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2));
}
function wireOrizzNav(container: HTMLElement, orizz: Orizzonte): void {
  container.querySelectorAll<HTMLElement>('[data-nav]').forEach(function (b) {
    b.addEventListener('click', function () {
      const a = b.getAttribute('data-nav');
      if (a === 'oggi') schermo.giornataAncora = LM.todayKey();
      else schermo.giornataAncora = shiftKey(schermo.giornataAncora, orizz, a === 'next' ? 1 : -1);
      disegnaOrizzonte();
    });
  });
}

export function setOrizzonte(o: Orizzonte, ancora?: Giorno): void {
  schermo.giornataOrizzonte = o;
  if (ancora) schermo.giornataAncora = ancora;
  const nav = document.getElementById('orizz-nav');
  if (nav) nav.querySelectorAll<HTMLElement>('[data-orizz]').forEach(function (b) { b.classList.toggle('attivo', b.getAttribute('data-orizz') === o); });
  disegnaOrizzonte();
  /* un'altra vista comincia dall'alto, con le sue intestazioni in vista:
     restava lo scorrimento della vista di prima */
  if (o !== 'giorno') window.scrollTo(0, 0);
}
/* anima solo quando cambi orizzonte o giorno, non a ogni spunta */
let orizzMostrato = '';
export function disegnaOrizzonte(): void {
  const c = document.getElementById('orizz-corpo');
  if (!c) return;
  const chiave = schermo.giornataOrizzonte + '|' + schermo.giornataAncora;
  const cambio = chiave !== orizzMostrato;
  if (schermo.giornataOrizzonte === 'giorno') montaGiornata(c, { giorno: schermo.giornataAncora });
  else if (schermo.giornataOrizzonte === 'settimana') montaSettimana(c);
  else if (schermo.giornataOrizzonte === 'mese') montaMese(c);
  else montaAnno(c);
  orizzMostrato = chiave;
  if (cambio) animaIngresso(c);
}

function htmlGiornataStrip(): string {
  const d = nodiGiornata();
  const wake = d.wake;
  let bed = d.sleep;
  if (bed <= wake) bed += 1440; // a letto dopo mezzanotte
  function em(m: number | null): number | null { return (m != null && bed > 1440 && m < wake) ? m + 1440 : m; }
  const span = Math.max(60, bed - wake);
  function pct(m: number | null): number { return Math.max(0, Math.min(100, ((em(m) ?? 0) - wake) / span * 100)); }
  /* la barra distingue i tipi: blocchi con DURATA precisa come segmenti che
     occupano il tempo, le cose a un solo orario come punti, i pasti come
     tacche; le abitudini hanno il contorno, le azioni sono piene. */
  let conDur = 0, soloOra = 0, pasti = 0;
  const marks = d.placed.map(function (e) {
    const left = pct(e.min);
    if (e.tipo === 'pasto') {
      pasti++;
      return '<span class="strip-pasto" style="left:' + left.toFixed(1) + '%" title="' + esc(e.ora + ' · ' + e.nome) + '"></span>';
    }
    var col = LM.coloreArea(areaById(e.areaId));
    var fatto = e.tipo === 'azione' ? e.done : e.fatto;
    var cls = (e.tipo === 'abitudine' ? ' abit' : '') + (fatto ? ' fatta' : '');
    var tit = esc(e.ora + ' · ' + e.testo + (e.dur ? ' (' + e.dur + ' min)' : ''));
    if (e.dur) {
      conDur++;
      var w = Math.max(2, Math.min(100 - left, e.dur / span * 100));
      return '<span class="strip-seg' + cls + '" style="left:' + left.toFixed(1) + '%;width:' + w.toFixed(1) + '%;--c:' + col + '" title="' + tit + '"></span>';
    }
    soloOra++;
    return '<span class="strip-mark' + cls + '" style="left:' + left.toFixed(1) + '%;--c:' + col + '" title="' + tit + '"></span>';
  }).join('');
  var now = new Date();
  var nm = now.getHours() * 60 + now.getMinutes();
  /* `em` torna null solo se gli si passa null: qui gli si passa l'ora di
     adesso, che c'è sempre. */
  const nmEff = em(nm) ?? nm;
  var nowEl = (nmEff >= wake && nmEff <= bed) ? '<span class="strip-now" style="left:' + pct(nm).toFixed(1) + '%"></span>' : '';
  /* in `placed` finiscono solo i nodi con un orario (vedi `nodiGiorno`): il
     controllo su `min` è per il tipo, non per il caso. */
  var pross = d.placed.filter(function (e) { return e.min != null && e.min >= nm && !(e.tipo === 'azione' ? e.done : e.fatto); })[0];
  /* Prima ora, poi il nome: «alle 15:00 Confrontare piani telefonici» è un
     appuntamento, «poi Confrontare piani telefonici · 15:00» è la prossima
     cosa da fare. E la prossima cosa da fare la dice già la schermata sotto,
     che quando quella suggerita non ha un orario ne nomina UN'ALTRA: due
     risposte diverse alla stessa domanda, a cento pixel di distanza. Questa
     riga risponde a «dove sono nella giornata», non a «cosa faccio». */
  var sotto = pross ? 'alle ' + pross.ora + ' ' + esc(pross.nome || pross.testo)
    : (d.placed.length ? 'niente altro in agenda oggi' : 'nessun orario per oggi — tocca per aggiungerne');
  /* In cima a «Oggi» questa è la cosa MENO importante della schermata: dice
     dove sei nella giornata, non cosa fare. Prima aveva un titolo suo, una
     freccia e tre statistiche («4 con durata · 3 pasti · 1 senza orario»),
     pesava 131px e spingeva l'azione al quarto posto, a trecento pixel dal
     bordo. Il conto dei blocchi sta nella pagina «Giornata», a un tocco da
     qui. Qui resta quello che si guarda in mezzo secondo: quanto è passato,
     e cosa viene dopo. Da 131px a settanta. */
  return '<button class="giornata-strip" id="giornata-strip-btn" aria-label="Apri la giornata">' +
    /* il segno dell'ORA ADESSO sta FUORI dalla barra: sporge di tre pixel
       sopra e sotto, e la barra adesso è ritagliata a supercerchio — dentro
       gli si taglierebbero via le punte e il pallino. */
    '<div class="strip-pista"><div class="strip-barra">' + marks + '</div>' + nowEl + '</div>' +
    '<div class="strip-estremi"><span>' + d.sveglia + '</span>' +
    /* IL TESTO STA DENTRO UN SUO `span`, e non è un dettaglio di scrittura.
       `.strip-sotto` ha `overflow: hidden` ed è CENTRATA, e una scritta più
       lunga dello spazio in una scatola centrata non si taglia a destra: si
       taglia da tutte e due le parti. «alle 14:30 fare per 1 ora l'OFA sul
       sito» diventava «lle 14:30 fare per 1 ora l'ofa sul sito ·» — la «a»
       di «alle» mangiata a sinistra e la fine mangiata a destra, senza
       nemmeno i puntini a dire che continua.
       La regola con i puntini c'era già ed era scritta per il figlio
       (`.strip-sotto span`): mancava il figlio. Il nome della cosa da fare
       lo scrive l'utente, quindi una lunghezza non ce l'ha, quindi questo
       non è un caso limite: è il caso normale. */
    '<span class="strip-sotto"><span>' + sotto + '</span> ' + ICO('arrowRight', 11) + '</span>' +
    '<span>' + d.sonnoRoutine + '</span></div>' +
    '</button>';
}
function montaGiornataStrip(container: HTMLElement): void {
  container.innerHTML = htmlGiornataStrip();
  var b = container.querySelector<HTMLElement>('#giornata-strip-btn');
  if (b) b.addEventListener('click', function () {
    apriSheet('La giornata', '<div id="sheet-giornata"></div>', function (root) {
      montaGiornata(presa(root.querySelector<HTMLElement>('#sheet-giornata')), { compact: true });
    }, true);
  });
}

/* editor del RITMO DI BASE: sonno, sveglia, pasti (con durata). Vale per i
   giorni che non hanno un registro proprio. */
export function apriRitmo() {
  apriFoglio('Sonno e pasti', 'ritmo', {});
}


/* ============================================================
   VISTA: PLANCIA
   ============================================================ */

var sezMostrata = '';   // per animare solo al cambio di sezione
var periodoTrend = 14;
var diarioGiorni = 21;
var diarioTutto = false;


/* conto alla rovescia leggibile di una scadenza (ADHD: rende visibile il
   tempo che passa, senza allarmismi) */
/* quanti giorni mancano, come si dice, e la classe del colore. `d` c'era e
   non lo leggeva nessuno: quattro rami lo mettevano nell'oggetto e nessuno
   dei nove chiamanti lo guardava. */
/* `d` sono i giorni che mancano, negativi se è passata: il testo da solo
   non basta a chi lo legge — «ieri» va scritto «scaduta ieri» e «domani»
   «entro domani», e la differenza la dice il segno. */
export interface Scadenza { d: number; testo: string; cls: string }
export function scadInfo(scad: Giorno): Scadenza {
  const d = LM.daysBetween(LM.todayKey(), scad);
  if (d < 0) return { d: d, testo: d === -1 ? 'ieri' : (-d) + ' giorni fa', cls: 'scad-ritardo' };
  if (d === 0) return { d: 0, testo: 'oggi', cls: 'scad-oggi' };
  if (d === 1) return { d: 1, testo: 'domani', cls: 'scad-vicina' };
  return { d: d, testo: 'tra ' + d + ' giorni', cls: d <= 3 ? 'scad-vicina' : 'scad-lontana' };
}

/* una riga della timeline del Diario */
/* Chi porta il tasto «Annulla», fra due righe che raccontano lo stesso
   cambiamento (per esempio la nota annotata e la riga di registro che la
   racconta). Vince quella che ha un dato da togliere: disfare il dato
   tocca solo quella cosa, mentre il punto di ritorno riporta indietro
   anche tutto quello che è venuto dopo. A pari merito, la più recente. */
let annullaPadroni: Set<VoceDiario> | null = null;
function padroniAnnulla(giorni: GiornoDiario[]): Set<VoceDiario> {
  const perPunto: Record<string, VoceDiario> = {};
  giorni.forEach(function (g) {
    g.eventi.forEach(function (ev) {
      const pt = LM.puntoDiRitorno(ev.ts);
      if (!pt) return;
      const att = perPunto[pt.id];
      if (!att || (ev.chiave && !att.chiave)) perPunto[pt.id] = ev;
    });
  });
  const set = new Set<VoceDiario>();
  Object.keys(perPunto).forEach(function (k) { const v = perPunto[k]; if (v) set.add(v); });
  return set;
}
function eventoDiarioHtml(ev: VoceDiario): string {
  let ico: string, testo: string, cls = '';
  if (ev.tipo === 'azione') {
    const ar = areaById(ev.areaId);
    ico = '<span class="diario-ico ok">' + ICO('check', 15) + '</span>';
    testo = 'Completata · <b>' + esc(ev.testo) + '</b>' +
      ' ' + segnoArea(ar, 13, 'diario-area') +
      (ev.mit ? ' <span class="tag-mit">' + ICO('star', 11) + 'Priorità</span>' : '');
  } else if (ev.tipo === 'checkin') {
    /* il check-in ha il suo segno (il battito): il fulmine è la cattura
       rapida, e qui era rimasto da prima che li separassi */
    ico = '<span class="diario-ico">' + ICO('polso', 15) + '</span>';
    testo = 'Check-in · energia <b>' + ev.energia + '</b> · focus <b>' + ev.focus + '</b> · umore <b>' + ev.umore + '</b>';
  } else if (ev.tipo === 'mattina') {
    ico = '<span class="diario-ico">' + ICO('sun', 15) + '</span>';
    testo = 'Piano del giorno' + (ev.intenzione ? ' · <span class="diario-sec">' + esc(ev.intenzione) + '</span>' : '');
  } else if (ev.tipo === 'sera') {
    ico = '<span class="diario-ico">' + ICO('moon', 15) + '</span>';
    testo = 'Fine giornata' +
      (ev.vittoria ? ' · <span class="diario-sec">andata bene: ' + esc(ev.vittoria) + '</span>' : '') +
      (ev.blocco ? ' · <span class="diario-sec">ostacolo: ' + esc(ev.blocco) + '</span>' : '');
  } else if (ev.tipo === 'settimana') {
    ico = '<span class="diario-ico">' + ICO('calendar', 15) + '</span>';
    testo = 'Bilancio della settimana' + (ev.imparato ? ' · <span class="diario-sec">' + esc(ev.imparato) + '</span>' : '');
  } else if (ev.tipo === 'registro') {
    /* Nel diario ogni riga porta il segno della cosa di cui parla, e sono gli
       stessi segni del resto dell'app: così il registro si legge a colpo
       d'occhio invece che riga per riga. Prima «area» usava le stelline (che
       vogliono dire «extra») e «focus» il quadrante come «giornata» — due
       categorie diverse con la stessa figura. */
    const icoCat: Record<string, string> = { azione: 'target', abitudine: 'refresh', backlog: 'lista', inbox: 'inbox',
      area: 'aree', giornata: 'giornata', focus: 'mirino', impostazioni: 'ingranaggio', dati: 'dati',
      /* due categorie e non una: nel diario si deve vedere da lontano se
         quella riga racconta una cosa che funziona o una che no */
      'lezione-si': 'funziona', 'lezione-no': 'nonFunziona' };
    ico = '<span class="diario-ico' + (ev.imp ? '' : ' minore') + '">' + ICO(icoCat[ev.cat || ''] || 'lista', 13) + '</span>';
    testo = '<span class="diario-log">' + esc(ev.testo) + '</span>';
    cls = ev.imp ? '' : ' minore';
  } else { /* cattura */
    ico = '<span class="diario-ico">' + ICO('inbox', 15) + '</span>';
    testo = 'Annotato · <b>' + esc(ev.testo) + '</b>';
  }
  /* per le azioni si può riassegnare l'area anche a distanza di giorni */
  /* il diario racconta, non si modifica da qui: l'area si legge e basta
     (era un menu a tendina in ogni riga, letto come «Priorità: <area>») */
  if (ev.tipo === 'azione' && ev.id && ev.areaId) {
    testo += ' <span class="diario-area">· ' + esc(areaById(ev.areaId).nome) + '</span>';
  }
  /* Qui si annulla. Il diario è la lista di quello che hai fatto, quindi è
     il posto dove disfarlo: prima si poteva solo nei sette secondi del
     messaggino, e su due cose in croce.
     Due strade, e si prende la più precisa che c'è:
       · la riga È un dato salvato (una spunta, un check-in, una review, una
         nota, l'abitudine di ieri) → si toglie quel dato. Vale a qualunque
         distanza di tempo, ed è questo che rende l'annulla buono anche per
         quello che c'era già nel diario prima.
       · la riga racconta un cambiamento senza esserlo → il punto di ritorno,
         se c'è ancora (le ultime dodici cose).
     Un tasto per cambiamento, non per riga: una cosa sola può comparire su
     due righe (la nota annotata e la riga di registro che la racconta), e
     due tasti identici a due righe di distanza sono un doppione. Quale delle
     due lo porta lo decide padroniAnnulla, sopra. */
  const punto = LM.puntoDiRitorno(ev.ts);
  let annulla = '';
  const mostra = punto ? (!annullaPadroni || annullaPadroni.has(ev)) : !!ev.chiave;
  if (mostra) {
    annulla = '<button class="diario-annulla" data-annulla="' + ev.ts + '"' +
      (ev.chiave ? ' data-tipo="' + (ev.tipoDisfa || ev.tipo) + '" data-chiave="' + esc(String(ev.chiave)) + '"' : '') +
      ' aria-label="Annulla" title="' + (ev.chiave ? 'Disfa questa cosa' : 'Torna a com’era prima di questa cosa') + '">' +
      ICO('annulla', 13) + '<span class="da-eti">Annulla</span></button>';
  }
  return '<div class="diario-evento' + cls + '">' + ico + '<div class="diario-testo">' + testo + '</div>' +
    annulla + '<span class="diario-ora">' + oraDi(ev.ts) + '</span></div>';
}


/* ============================================================
   LE SEZIONI DI PANORAMICA, fuori da vistaPlancia.

   Stessa ragione degli aiutanti di Attività: nessuna di loro chiude su
   quella chiamata, e da fuori le deve poter chiamare anche la versione
   React della schermata. Riscriverle di là vorrebbe dire due sorgenti per
   le stesse schede.
   ============================================================ */

export function disegnaSezione(): void {
  const c = document.getElementById('sez-corpo');
  if (!c) return;
  const cambio = schermo.sezPlancia !== sezMostrata;
  if (schermo.sezPlancia === 'riepilogo') sezRiepilogo(c);
  else if (schermo.sezPlancia === 'diario') sezDiario(c);
  else if (schermo.sezPlancia === 'aree') sezAree(c);
  else sezAndamento(c);
  sezMostrata = schermo.sezPlancia;
  if (cambio) animaIngresso(c);
}

/* --- Riepilogo: azioni di oggi + costanza --- */
function sezRiepilogo(c: HTMLElement): void {
  /* i conti che prima le arrivavano da `vistaPlancia`: uscendo se li fa da
     sé. Sono le stesse chiamate, quindi gli stessi numeri. */
  const bil = LM.bilancio(30);
  c.innerHTML = '<div class="griglia griglia-2">' +
    /* le azioni di oggi stanno in Oggi: qui si guarda indietro */
    '<div class="card" style="--i:1"><h2>' + ICO('trendUp', 15) + ' Costanza</h2>' +
    '' +
    '<div id="heatmap"></div></div>' +
    /* LE REVIEW DI PRIMA, in Panoramica. Si scrivono in Rituali, ma
       rileggerle è un'altra cosa dallo scriverle: è guardare indietro, e
       guardare indietro si fa qui, accanto alla costanza e alle aree.
       In Rituali sarebbero state una porta verso il passato in mezzo alle
       cose da fare adesso. */
    /* ============================================================
       DOVE TI RIESCE E DOVE NO

       È la scheda che dice cosa fare, e le altre due no. «Ti riesce il
       64%» è una diagnosi senza indirizzo; «in Salute ne metti sei a
       settimana e ne fai una» è un indirizzo.
       Ordinate dalla PEGGIORE, che è l'ordine che serve: le aree che
       vanno bene non chiedono niente, e metterle in cima vuol dire far
       scorrere per arrivare all'unica riga che conta.
       E sotto, le cose che non sono riuscite davvero, con il motivo più
       frequente. Stavano in fondo all'elenco delle Attività, che è il
       posto dove si decide cosa fare adesso: lì erano un promemoria dei
       fallimenti in mezzo al lavoro. Qui sono quello che sono, cioè dati
       per rispondere a «cosa non funziona per me» — la stessa domanda di
       Scoperte e degli Esperimenti.
       ============================================================ */
    '<div class="card" style="--i:2"><h2>' + ICO('aree', 15) + ' Per area</h2>' +
    '' +
    (bil.aree.length
      ? '<div class="bil-aree">' + bil.aree.map(function (a) {
          var ar = areaById(a.areaId);
          return '<div class="bil-riga">' +
            '<span class="bil-nome">' + segnoArea(ar, 13, 'tit-area') + esc(ar.nome) + '</span>' +
            '<span class="bil-barra"><i style="width:' + Math.round(a.tasso * 100) + '%;--c-area:' + LM.coloreArea(ar) + '"></i></span>' +
            '<span class="bil-num"><b>' + Math.round(a.tasso * 100) + '%</b> <span>' + a.fatte + '/' + a.messe + '</span></span>' +
            '</div>';
        }).join('') + '</div>'
      : nota('Ancora nessun giorno chiuso da contare.')) +
    (function () {
      const perse = LM.mancate(90), motivi = LM.motiviMancate(90);
      if (!perse.length) return '';
      const primo = motivi[0], secondo = motivi[1];
      return '<div class="lista-eti mt">Non completata <span>' + perse.length + '</span></div>' +
        (primo ? '<p class="lista-nota bil-motivo">Più spesso: <b>' + esc(primo.eti.toLowerCase()) + '</b>' +
          (secondo ? ', poi ' + esc(secondo.eti.toLowerCase()) : '') + '.</p>' : '') +
        '<div class="lista">' + perse.slice(0, 8).map(function (a) {
          const ar = areaById(a.areaId);
          /* `mancate()` torna solo cose che ce l'hanno: è il suo filtro */
          const g = LM.QUANTO_FATTO.find(function (x) { return x.id === (a.mancata ? a.mancata.quanto : ''); });
          return '<div class="lista-riga mancata-riga">' +
            '<span class="lista-azione mancata-segno">' + ICO('annulla', 15) + '</span>' +
            '<span class="lista-corpo"><span class="lista-tit">' + segnoArea(ar, 13, 'tit-area') + esc(a.testo) + '</span>' +
            '<span class="lista-sub">' + esc(g ? g.eti.toLowerCase() : 'non riuscita') + '</span></span></div>';
        }).join('') + '</div>' +
        (perse.length > 8 ? '<p class="lista-nota">e altre ' + (perse.length - 8) + '.</p>' : '');
    })() +
    '</div>' +
    '</div>';

  /* le porte in fondo, in un riquadro solo: prima «Le review di prima» era
     un riquadro con dentro un altro riquadro con dentro una riga */
  c.insertAdjacentHTML('beforeend', '<div class="lista mt">' +
    rigaPorta('riep-review', 'archivio', 'Riflessioni passate',
      (function () { var q = LM.quanteReview(); return q ? String(q) : ''; })()) +
    rigaPorta('riep-tempo', 'durata', 'Sessioni del timer', (function () {
      var m = LM.sessioniDi(LM.todayKey()).reduce(function (n, x) { return n + (x.minuti || 0); }, 0);
      return m ? fmtOre(m) + ' oggi' : '';
    })()) +
    rigaPorta('riep-aree', 'aree', 'Aree') + rigaPorta('riep-grafici', 'trendUp', 'Grafici') + '</div>');
  [['riep-aree', 'aree'], ['riep-grafici', 'andamento']].forEach(function (x) {
    const b = document.getElementById(x[0] || '');
    if (b) b.addEventListener('click', function () { schermo.sezPlancia = x[1] || 'riepilogo'; render(); window.scrollTo(0, 0); });
  });
  /* i due contenitori li ha scritti l'HTML qui sopra */
  LMCharts.heatmap(presa(document.getElementById('heatmap')), LM.heatmapConsistenza(12));

  const bTempo = document.getElementById('riep-tempo');
  if (bTempo) bTempo.addEventListener('click', apriSessioni);
  const bRev = document.getElementById('riep-review');
  if (bRev) bRev.addEventListener('click', apriArchivioReview);
}

/* --- Aree: griglia delle aree di vita --- */
function sezAree(c: HTMLElement): void {
  c.innerHTML = '<div class="griglia griglia-aree" id="griglia-aree"></div>';
  const ga = presa(document.getElementById('griglia-aree'));
  ga.innerHTML = areeAttive().map(function (a, i) {
    const media = LM.mediaValutazioneArea(a.id, 7);
    const min7 = LM.serieMinuti(a.id, 7).reduce(function (x, p) { return x + p.valore; }, 0);
    return '<div class="card card-area card-hover" style="--i:' + i + ';--c-area:' + LM.coloreArea(a) + '">' +
      '<div class="testata"><span class="icona-area">' + ICO(a.icona, 15) + '</span>' + esc(a.nome) + '</div>' +
      '<div id="spark-' + a.id + '"></div>' +
      '<div class="area-metriche"><div><b>' + (media ? LMCharts.fmtNum(media) : '—') + '</b><span>voto medio 7g</span></div>' +
      '<div><b>' + min7 + '</b><span>minuti 7g</span></div></div>' +
      '<div class="sistema-nota">' + esc(a.sistema) + '</div></div>';
  }).join('');
  areeAttive().forEach(function (a) {
    LMCharts.sparkline(perId('spark-' + a.id), LM.serieValutazioni(a.id, 14),
      { min: 1, max: 5, colore: LM.coloreArea(a), label: 'Auto-valutazione ' + a.nome + ', 14 giorni', unita: '/5' });
  });
}

/* --- Andamento: check-in nel tempo + minuti per area --- */
function sezAndamento(c: HTMLElement): void {
  var dark = document.documentElement.getAttribute('data-mode') === 'dark';
  c.innerHTML = '<div class="card" style="--i:0"><div class="card-testa"><h2>' + ICO('polso', 15) + ' Energia, focus e umore</h2>' +
    '<div class="segmenti mini-seg" id="seg-periodo">' +
    '<button data-g="14" class="' + (periodoTrend === 14 ? 'attivo' : '') + '">14 giorni</button>' +
    '<button data-g="30" class="' + (periodoTrend === 30 ? 'attivo' : '') + '">30 giorni</button></div></div>' +
    '<div id="trend-checkin"></div></div>' +
    '<div class="card mt" style="--i:1"><h2>' + ICO('tempospeso', 15) + ' Come hai speso il tempo</h2>' +
    '<div id="hbar-minuti"></div></div>';

  LMCharts.trend(perId('trend-checkin'), [
    { nome: 'Energia', colore: dark ? '#c98500' : '#eda100', punti: LM.serieCheckin('energia', periodoTrend) },
    { nome: 'Focus',   colore: dark ? '#3987e5' : '#2a78d6', punti: LM.serieCheckin('focus', periodoTrend) },
    { nome: 'Umore',   colore: dark ? '#199e70' : '#1baf7a', punti: LM.serieCheckin('umore', periodoTrend) }
  ], { min: 1, max: 5, label: 'Andamento di energia, focus e umore' });

  LMCharts.hbar(perId('hbar-minuti'),
    LM.minutiSettimanaPerArea().sort(function (a, b) { return b.minuti - a.minuti; })
      .map(function (r) { return { label: r.area.nome, icona: ICO(r.area.icona, 15), value: r.minuti, colore: LM.coloreArea(r.area) }; }),
    { unita: 'min' });

  perId('seg-periodo').querySelectorAll<HTMLElement>('[data-g]').forEach(function (b) {
    b.addEventListener('click', function () { periodoTrend = +(b.getAttribute('data-g') || 14); disegnaSezione(); });
  });
}

/* --- Diario: cronologia di ciò che hai fatto e scritto --- */
function sezDiario(c: HTMLElement): void {
  var giorni = LM.diario(diarioGiorni, diarioTutto);
  annullaPadroni = padroniAnnulla(giorni);
  var filtro = '<div class="segmenti mini-seg" id="diario-filtro">' +
    '<button data-tutto="0" class="' + (!diarioTutto ? 'attivo' : '') + '">Cose importanti</button>' +
    '<button data-tutto="1" class="' + (diarioTutto ? 'attivo' : '') + '">Tutto</button></div>';
  let html: string;
  if (!giorni.length) {
    html = '<div class="card diario"><div class="card-testa">' + filtro + '</div>' +
      '<div class="vuoto" style="padding:20px 8px">' + ICO('quaderno', 26) + '<br><b>Ancora niente.</b></div></div>';
  } else {
    /* la riga sotto il filtro dice SOLO quello che il filtro non dice da
       sé: cosa resta fuori. Prima ci stava anche «la storia di tutto ciò
       che fai — azioni, note, scelte, impostazioni», che è la definizione
       della parola «diario» scritta sotto la parola «Diario». */
    html = '<div class="card diario"><div class="card-testa">' + filtro +
      (diarioTutto ? '' : '') + '</div>';
    giorni.forEach(function (g) {
      html += '<div class="diario-giorno">' +
        '<div class="diario-data">' + etichettaGiorno(g.data) + '</div>' +
        '<div class="diario-eventi">' + g.eventi.map(eventoDiarioHtml).join('') + '</div></div>';
    });
    html += '</div>';
    var totGiorni = LM.giorniConAttivita();
    if (totGiorni > giorni.length) {
      html += '<div style="text-align:center" class="mt"><button class="btn" id="diario-altro">' + ICO('chevronGiu', 15) + ' Mostra altri giorni</button></div>';
    }
  }
  c.innerHTML = html;
  var b = document.getElementById('diario-altro');
  if (b) b.addEventListener('click', function () { diarioGiorni += 30; disegnaSezione(); });
  presa(document.getElementById('diario-filtro')).querySelectorAll<HTMLElement>('[data-tutto]').forEach(function (bt) {
    bt.addEventListener('click', function () { diarioTutto = bt.getAttribute('data-tutto') === '1'; disegnaSezione(); });
  });
  c.querySelectorAll<HTMLElement>('[data-annulla]').forEach(function (bt) {
    bt.addEventListener('click', function () {
      /* l'etichetta è il testo della riga stessa: è quello che l'utente
         sta guardando, e finisce nella riga «Annullato: …» */
      var riga = bt.closest('.diario-evento');
      var eti = riga ? (riga.querySelector<HTMLElement>('.diario-testo') || {}).textContent : '';
      annullaDalDiario(+(bt.getAttribute('data-annulla') || 0), (eti || '').replace(/\s+/g, ' ').trim().slice(0, 60),
        bt.getAttribute('data-tipo') || undefined, bt.getAttribute('data-chiave') || undefined);
    });
  });
}

/* ============================================================
   L'EROE DI PANORAMICA — la scheda che risponde a una domanda sola.

   Stava scritto dentro a `vistaPlancia`. È uscito per la stessa ragione
   degli aiutanti di Attività: da fuori lo può chiamare anche la versione
   React della schermata, e dev'essere LA STESSA scheda, non una copia che
   le somiglia. `wireEroePlancia()` fa quello che va fatto dopo, quando gli
   elementi sono in pagina: il numero che sale e la linea dell'andamento.
   ============================================================ */
/* l'ultima serie disegnata in ogni linea d'andamento: vedi sotto */
const firmeSpark = new WeakMap<Element, string>();

/* quello che va fatto DOPO, quando gli elementi sono in pagina */
export function wireEroePlancia() {
  var pct = Math.round(LM.bilancio(30).tasso * 100);
  var serie = LM.serieRiuscita(12);
  var elPct = document.getElementById('som-pct');
  /* IL NUMERO RIPARTE DA ZERO SOLO SE È DAVVERO A ZERO.
     Questa funzione la chiama un effetto di React a ogni disegno, e deve
     essere così: quando la percentuale cambia, il nodo dell'eroe viene
     riscritto e il valore animato sparisce — se non si ripassasse resterebbe
     lo `0` del markup per sempre.
     La domanda giusta non è «React ha ridisegnato?» ma «il numero ci è già
     arrivato?», e la risposta sta scritta nel nodo stesso: se c'è già il
     valore giusto l'animazione è finita e non si rifà, se c'è lo zero del
     markup il nodo è nuovo e si parte. */
  if (elPct && elPct.textContent !== String(pct)) countUp(elPct, pct);
  var elSpark = document.getElementById('som-spark');
  /* sotto i tre punti una linea non è un andamento, è un segmento: mostrarla
     vorrebbe dire far leggere una tendenza a chi non ne ha ancora una */
  /* e non si ridisegna se dice le stesse cose: `sparkline` butta via l'SVG e
     ne fa uno nuovo, cioè una ventina di nodi, e questa funzione gira a ogni
     disegno della Panoramica. La firma è la serie stessa, e sta in una mappa
     debole e non in un attributo: un attributo si vedrebbe in pagina. */
  var firma = serie.map(function (x) { return x.valore; }).join(',');
  if (elSpark && firmeSpark.get(elSpark) === firma) elSpark = null;
  if (elSpark && serie.length >= 3) {
    firmeSpark.set(elSpark, firma);
    LMCharts.sparkline(elSpark, serie, { h: 40, min: 0, max: 100,
      colore: 'var(--accento)',
      label: 'Com’è andata la riuscita nelle ultime ' + serie.length + ' settimane, da ' +
        Math.min.apply(null, serie.map(function (x) { return x.valore; })) + '% a ' +
        Math.max.apply(null, serie.map(function (x) { return x.valore; })) + '%' });
  }
}

/* Restituisce il DENTRO e le classi, non un blocco già avvolto: chi lo usa
   disegna il contenitore. Serve a React, che se avvolge un pezzo di HTML
   già completo si ritrova un elemento in più nell'albero — ed è l'errore
   che prove/gemelle.js ha trovato quattro volte di fila. */
export function eroePlancia() {
  var html = '';
  var classi = '';
  /* i tre numeri di contorno: stavano fra i conti di `vistaPlancia`, e
     uscendo la scheda se li porta dietro */
  var st = LM.streak();
  var bil = LM.bilancio(30);
  var quante = LM.quanteFatte();
  var pct = Math.round(bil.tasso * 100);

  if (!bil.messe) {
    /* ANCORA PRESTO. Un «—» al posto di un numero fa sembrare l'app rotta,
       e uno zero è peggio: dice che hai fallito tutto quando non hai
       ancora avuto un giorno chiuso. Si dice quello che c'è, e quanto
       manca perché ci sia un conto. */
    classi = 'card som som-vuota';
    html +=
      '<div class="som-eti">Come sta andando</div>' +
      '<div class="som-vuoto"><b>Ancora presto per un conto.</b>' +
      (quante ? '<br>Intanto hai fatto ' + quante + (quante === 1 ? ' cosa' : ' cose') + '. Il conto della riuscita comincia dal primo giorno chiuso.'
              : '<br>Metti qualcosa in un giorno: da domani questo posto comincia a dirti come va.') +
      '</div>';
  } else {
    classi = 'card som';
    const sett = LM.heatmapConsistenza(1);
    const INIZ = ['D', 'L', 'M', 'M', 'G', 'V', 'S'];
    const oggiK = LM.todayKey();
    html +=
      '<div class="som-testa">' +
      '<span class="som-fiamma" role="img" aria-label="' + st.corrente + ' giorni di fila">' + ICO('flame', 26, 'fiamma') + '<b>' + st.corrente + '</b><small>' + (st.corrente === 1 ? 'giorno di fila' : 'giorni di fila') + '</small></span>' +
      '<span class="som-quota"><b><span id="som-pct">' + pct + '</span>%</b><small>fatte: ' + bil.fatte + ' di ' + bil.messe + ' in 30 giorni</small></span>' +
      '</div>' +
      '<div class="som-sett">' + sett.map(function (g) {
        const d = new Date(g.data + 'T12:00:00');
        return '<span class="som-g' + (LM.giornoAttivo(g.data) ? ' fatto' : '') + (g.data === oggiK ? ' oggi' : '') + '">' +
          '<i>' + (LM.giornoAttivo(g.data) ? ICO('check', 15) : '') + '</i><small>' + (INIZ[d.getDay()] || '') + '</small></span>';
      }).join('') + '</div>' +
      /* la serie regge un giorno vuoto: se nella striscia c'è un buco, si dice
         perché il numero non si è azzerato */
      (st.corrente > 1 && sett.some(function (g) { return g.data !== oggiK && !LM.giornoAttivo(g.data); })
        ? '<div class="som-nota">Un giorno vuoto non interrompe la serie: due di fila sì.</div>' : '');
  }
  return { classi: classi, dentro: html };
}


/* Annullare dal diario, per qualunque riga e a qualunque distanza di tempo.
   Se la riga ha un dato dietro si toglie quel dato: è un'operazione esatta,
   non tocca nient'altro e si fa subito, col «Rimetti» nel messaggio.
   Solo per le righe di registro serve il punto di ritorno, che riporta
   indietro anche tutto quello che è venuto dopo: per l'ultima cosa fatta le
   due cose coincidono, per una più vecchia si dice quante altre rientrano e
   si chiede conferma — una sorpresa qui costa più di un tocco in più. */
function annullaDalDiario(ts: number, etichetta: string, tipo?: string, chiave?: string): void {
  /* «Rimetti»: lo stato di adesso, messo da parte prima di toccarlo */
  /* torna `false` quando non c'è più niente da disfare: `LM.annullaRecord` e
     `LM.tornaAlPunto` rispondono così, e il messaggio qui sotto ci conta */
  function conRimetti(fai: () => boolean) {
    var prima = JSON.parse(JSON.stringify(LM.load()));
    if (!fai()) { toast('Non si può più annullare.', 0, 'aiuto'); return; }
    render();
    toast('Annullato.', 0, 'annulla', { eti: 'Rimetti', fai: function () {
      LM.ripristinaStato(prima);
      render();
      toast('Ripristinato.', 0, 'check');
    } });
  }

  if (tipo && chiave) {
    conRimetti(function () { return LM.annullaRecord(tipo, chiave); });
    return;
  }
  var punto = LM.puntoDiRitorno(ts);
  if (!punto) { toast('Non si può più annullare.', 0, 'aiuto'); return; }
  function fallo() { conRimetti(function () { return LM.tornaAlPunto(ts, etichetta); }); }
  /* l'ultima cosa fatta si annulla senza chiedere: annullarla non tocca
     nient'altro, e c'è il «Rimetti» nel messaggio */
  if (!punto.dopo) { fallo(); return; }
  avviso({
    titolo: 'Annullare fin qui?',
    testo: 'Annullare questa riporta indietro anche quello che hai fatto dopo: ' +
      punto.dopo + (punto.dopo === 1 ? ' cosa.' : ' cose.') + ' Si può rimettere subito dopo.',
    azione: 'Annulla fin qui', annulla: 'Non ora'
  }, fallo);
}

/* ============================================================
   VISTA: RITUALI
   ============================================================ */


/* ============================================================
   I RITUALI, IN ORDINE DI GIORNATA
   Prima erano cinque schede pari in una barra: tre momenti del giorno,
   uno della settimana e una schermata di gestione da 38 comandi. Quattro
   nature diverse presentate come cinque scelte uguali — e la scelta
   toccava all'utente anche se l'app sa già che ora è.
   Adesso i momenti del giorno stanno in ordine (mattina, check-in, sera),
   e sotto, staccato, quello che si fa ogni tanto (settimana, abitudini).
   Ogni riga dice se è già stata fatta oggi, e quella dell'ora è già
   aperta: non c'è niente da scegliere per cominciare. */
/* Tre nature diverse, tre gruppi — come le sezioni di un elenco iOS:
     il piano        decidere cosa fare oggi (si scrive)
     come è andata   registrare com'è andata (si misura: check-in, review)
     si ripetono     configurare le cose ricorrenti (si imposta una volta)
   Mettere «Le azioni di oggi» accanto al check-in era mettere una decisione
   accanto a una misura, e le abitudini accanto a entrambe era metterci
   dentro anche un pannello di configurazione. */
/* un gruppo di rituali: l'etichetta della sezione e chi ci sta dentro */
export interface GruppoRit { eti: string; ids: string[] }
export const GRUPPI_RIT: GruppoRit[] = [
  { eti: 'Il piano di oggi',   ids: ['mattina'] },
  /* IL REGISTRO HA UNA RIGA SUA, e si vede dall'elenco senza aprire niente.
     Sonno, pasti e cose fatte erano tre domande sparse in due rituali
     diversi: la notte in cima a «Le azioni di oggi», i pasti dentro la
     «Review della sera» — cioè dietro una sezione che si apre la sera e che
     parla d'altro. Chi cercava dove segnare un pasto non lo trovava, ed è
     esattamente quello che è successo. Sono tre cose che l'app non può
     sapere da sola: stanno insieme, in un posto che porta il loro nome. */
  { eti: 'Il registro di oggi', ids: ['registro'] },
  { eti: 'Bilanci',            ids: ['checkin', 'sera', 'settimana'] }
];

/* un rituale: il segno, il nome, e se è una cosa del giorno o di ogni tanto */
export interface Rituale { id: string; ico: string; nome: string; quando: 'giorno' | 'ogni tanto' }
export const RITUALI: Rituale[] = [
  { id: 'mattina',   ico: 'sun',      nome: 'Piano del giorno',      quando: 'giorno' },
  { id: 'registro',  ico: 'ritmo',    nome: 'Sonno e pasti', quando: 'giorno' },
  { id: 'checkin',   ico: 'polso',    nome: 'Check-in',               quando: 'giorno' },
  { id: 'sera',      ico: 'moon',     nome: 'Fine giornata',          quando: 'giorno' },
  { id: 'settimana', ico: 'calendar', nome: 'Bilancio della settimana', quando: 'ogni tanto' }
];
/* LA COLONNA DEGLI STATI LA DISEGNA REACT, e qui non c'è più niente.

   C'era `aggiornaStatiRituali()`: a ogni `lm:change`, se eri sui Rituali,
   riscriveva l'`innerHTML` di ogni `.rit-stato`. Aveva una buona ragione nel
   sito di prima — le sezioni si ridisegnano da sole, senza passare da
   `render()`, e senza quella riga la colonna continuava a dire «0 di 3 oggi»
   dopo che ne avevi spuntata una.
   Adesso quella colonna è JSX (`Riga` in schermi/Rituali.tsx), e `usaLM` è
   già iscritto a `lm:change`: React la rifà da sé. Le due strade insieme
   erano un guasto vero, non un doppio lavoro: React si teneva il riferimento
   allo `<span class="rs-dett">` che questa funzione aveva appena buttato via,
   e al ridisegno dopo provava a toglierlo da un padre che non ce l'aveva più
   — `NotFoundError: removeChild`, e da lì in poi la schermata non si
   aggiornava più. Si vedeva premendo «Salva» nel rituale del
   mattino, che è il tasto con cui quella schermata comincia: l'ha trovato
   `prove/doppioni.js`.
   È la stessa lezione del Design lab e della lista di «Da fare»: un nodo ha
   UN padrone. Se lo disegna React, nessun altro ci mette le mani. */

export function ritualeDellOra() {
  var ora = new Date().getHours();
  return ora < 12 ? 'mattina' : (ora >= 19 ? 'sera' : 'checkin');
}
/* per ogni rituale: se è già stato fatto oggi e come si racconta in una riga */
/* UNA COLONNA, UNA DOMANDA.
   Qui uscivano sei frasi di forma diversa nello stesso posto — «fatto
   stamattina», «2 azioni scelte», «1 oggi», «nessuno oggi», «fatta», «da
   fare» — e chi guardava la colonna doveva leggerle una per una per capire
   se erano un sì, un no o un conteggio. La colonna risponde a UNA domanda,
   «è fatto oggi?», e lo dice sempre nello stesso modo; il numero, quando
   aggiunge qualcosa, sta sotto, più piccolo e muto. */
export function statoRituale(id: string): StatoRit {
  var s = LM.load(), t = LM.todayKey();
  if (id === 'mattina') {
    if (s.pianoMattina[t]) return { fatto: true, testo: 'fatto' };
    /* le azioni possono essere state scelte anche senza passare dal rituale
       (dalla Giornata, o tirandole su da Attività): dire «da fare» e basta
       quando ce ne sono già tre in lista è una bugia che chiede una cosa
       già fatta — il conto lo dice la riga sotto */
    var n = LM.azioniDiOggi().length;
    return { fatto: false, testo: 'da fare', dett: n ? n + ' di 3' : '' };
  }
  if (id === 'registro') {
    /* la riga dice a che punto è il registro, non se «è fatto»: le cose da
       segnare sono tre e arrivano in momenti diversi della giornata */
    var g = s.ritmoGiorno[t] || {};
    var nottePronta = !!(g.sveglia || g.sonno);
    var pasti = (LM.ritmoDi(t).pasti || []);
    var risposti = pasti.filter(function (pa) { return pa.fatto === true || pa.fatto === false; }).length;
    var quante = (nottePronta ? 1 : 0) + risposti;
    var tutte = 1 + pasti.length;
    return { fatto: quante >= tutte, testo: quante >= tutte ? 'fatto' : 'da compilare',
      dett: quante >= tutte ? '' : quante + ' di ' + tutte };
  }
  if (id === 'checkin') {
    var q = s.checkins.filter(function (c) { return c.data === t; }).length;
    return { fatto: q > 0, testo: q > 0 ? 'fatto' : 'da fare', dett: q > 1 ? q + ' oggi' : '' };
  }
  if (id === 'sera') {
    return s.reviewSera[t] ? { fatto: true, testo: 'fatto' } : { fatto: false, testo: 'da fare' };
  }
  var wk = LM.weekKey(t);
  return s.reviewSettimana[wk] ? { fatto: true, testo: 'fatto' } : { fatto: false, testo: 'da fare' };
}

/* Il contenuto di TUTTE le sezioni aperte. Fuori dalla vista perché lo deve
   chiamare anche React, dopo che ha disegnato le sezioni: sono le stesse
   cinque schermate dei rituali, non copie. */
export function disegnaCorpiRituali(): void {
  const disegna: Record<string, (corpo: HTMLElement) => void> = {
    mattina: ritualeMattina, registro: ritualeRegistro,
    checkin: ritualeCheckin, sera: ritualeSera, settimana: ritualeSettimana
  };
  Object.keys(disegna).forEach(function (id) {
    const c = document.getElementById('corpo-rit-' + id);
    const f = disegna[id];
    if (c && f) f(c);
  });
}


function testaRituale(icona: string, titolo: string, sotto?: string): string {
  void icona; void titolo;
  /* senza testo non resta un paragrafo vuoto a fare spazio */
  return sotto ? '<p class="rituale-intro">' + sotto + '</p>' : '';
}

/* ============================================================
   IL RESOCONTO DELLA GIORNATA: la notte, i pasti, e quello che hai fatto
   senza scriverlo
   ============================================================

   Tre dati che l'app non può sapere da sola e che senza qualcuno che li
   chieda non esistono: a che ora hai dormito, se hai mangiato, e le cose che
   hai fatto senza avere voglia di aprire l'app. Chi ha l'ADHD non tiene un
   registro: se il dato dev'essere inserito di sua iniziativa, non c'è.

   QUANDO SI CHIEDE. Ogni domanda arriva nel momento in cui la risposta
   esiste: la notte al mattino, i pasti e il resto la sera. Una volta al
   giorno, e «non adesso» è sempre una risposta valida — la stessa domanda
   resta nei Rituali, dove sta di casa.

   LA NOTTATA. Chi è rimasto alzato fino alle quattro e riapre l'app alle
   quattro e dieci non deve sentirsi chiedere com'è andata la notte: non è
   un giorno nuovo, è lo stesso giorno che continua. Per questo si guarda il
   BUCO fra l'ultima volta che ti ho visto e adesso: sotto le tre ore la
   notte non ci sta, e non si chiede niente. E prima delle cinque non si
   chiede in nessun caso.

   LA PRECISIONE. «Mi sono svegliato alle 7:30» detto da chi ha guardato la
   sveglia e da chi tira a indovinare sono due numeri diversi con lo stesso
   aspetto. E chi tiene alla precisione, se non può dire «più o meno»,
   preferisce non rispondere: succede sempre, e produce un dato mancante
   invece di un dato onesto. Quindi ogni orario porta con sé come è stato
   dato, e la scelta è preselezionata da COME lo si è messo: il tasto «come
   sempre» vale «più o meno», toccare l'orologio e cambiare l'ora vale
   «preciso». Due voci e non cinque: «più o meno» copre tutto il resto, e
   «non me lo ricordo» non è una precisione — è una via d'uscita, quindi è
   un tasto a parte. */

/* --- la notte --- */
/* QUANDO LA NOTTE È GIÀ REGISTRATA la domanda non sparisce: diventa una riga
   che dice cosa c'è scritto, con «cambia» accanto. Sparendo lascerebbe due
   buchi: chi si è sbagliato non ha più dove correggere, e chi ha scacciato
   il pop-up si ritrova la promessa («la domanda resta nei Rituali») non
   mantenuta. */
function bloccoNotte(forzaAperto?: boolean): string {
  var t = LM.todayKey();
  var r = LM.ritmoDi(t);
  var g = LM.load().ritmoGiorno[t] || {};
  var prec = g.prec || 'circa';
  var registrata = !!(g.sveglia || g.sonno);
  if (registrata && !forzaAperto) {
    /* NOME SOPRA, VALORE SOTTO, comando a destra: la forma che hanno le
       righe in tutto il resto dell'app. Prima era una riga sola con
       l'etichetta a sinistra e il valore a destra, e siccome il valore è
       allineato a destra, quando non ci stava non sbordava a destra: sbordava
       a SINISTRA, cioè addosso all'etichetta. Su uno schermo stretto
       «verso le 23:30 → 07:30 · 8h» finiva scritto sopra la parola
       «Stanotte». Incolonnati non si possono più incontrare, a nessuna
       larghezza. */
    return '<div id="blocco-notte">' +
      '<div class="lista"><div class="lista-riga">' +
      '<span class="diario-ico" aria-hidden="true">' + ICO('bed', 15) + '</span>' +
      '<span class="lista-corpo"><span class="lista-tit">Sonno</span>' +
      '<span class="lista-sub">' + (prec === 'circa' ? 'verso le ' : '') + esc(r.sonno) + ' → ' + esc(r.sveglia) +
      ' · ' + fmtOre(LM.minutiSonno(t)) + '</span></span>' +
      '<button class="btn btn-mini" id="notte-cambia">Cambia</button></div></div>' +
      '</div>';
  }
  return '<div id="blocco-notte">' +
    /* le due righe qui sotto hanno già scritto «A letto» e «Sveglio», e
       accanto c'è la riga che chiede quanto sono precisi: la frase che
       ripeteva tutte e tre le cose andava letta prima di poter guardare i
       campi che dicevano lo stesso. Resta il permesso di non saperlo, che
       nessun campo può dare. */
    '<div class="rit-sez"><span>Sonno</span><button class="sp-link" id="notte-solito">Come sempre · ' + esc(r.sonnoRoutine) + '–' + esc(r.svegliaRoutine) + '</button></div>' +
    '<div class="lista">' +
    '<div class="lista-riga sc-riga"><span class="sc-eti">' + ICO('bed', 15) + ' A letto</span>' +
    '<span class="sc-val"><input type="time" id="notte-sonno" class="sc-inline" value="' + esc(r.sonno) + '" aria-label="A che ora sei andato a letto"></span></div>' +
    '<div class="lista-riga sc-riga"><span class="sc-eti">' + ICO('sun', 15) + ' Sveglia</span>' +
    '<span class="sc-val"><input type="time" id="notte-sveglia" class="sc-inline" value="' + esc(r.sveglia) + '" aria-label="A che ora ti sei svegliato"></span></div>' +
    '<div class="lista-riga sc-riga sc-riga-alta"><span class="sc-eti">Precisione</span>' +
    '<span class="sc-val q-chips" id="notte-prec">' +
    '<button class="q-chip' + (prec === 'circa' ? ' on' : '') + '" data-prec="circa">più o meno</button>' +
    '<button class="q-chip' + (prec === 'preciso' ? ' on' : '') + '" data-prec="preciso">precisi</button>' +
    '</span></div>' +
    '</div>' +
    '<div class="rit-azioni"><button class="btn btn-tinta" id="notte-salva">Salva</button>' +
    '<button class="sp-link" id="notte-boh">Non ricordo</button></div>' +
    '</div>';
}

function wireNotte(scope: HTMLElement, dopo?: (() => void) | null): void {
  const t = LM.todayKey();
  const cambia = scope.querySelector<HTMLElement>('#notte-cambia');
  if (cambia) {
    cambia.addEventListener('click', function () {
      const padre = scope.parentNode;
      const tmp = document.createElement('div');
      tmp.innerHTML = bloccoNotte(true);
      const nuovo = tmp.firstChild;
      if (!padre || !nuovo) return;
      padre.replaceChild(nuovo, scope);
      const dentro = (padre as ParentNode).querySelector<HTMLElement>('#blocco-notte');
      if (dentro) wireNotte(dentro, dopo);
    });
    return;
  }
  /* la precisione scelta A MANO vince su tutto: due parole e non una stringa
     qualunque — `precisioneValida` nei dati accetta soltanto queste */
  let scelta: Precisione | null = null;
  const forse = scope.querySelector<HTMLElement>('#notte-prec');
  if (!forse) return;
  /* il nodo si ricopia in un `const` già ristretto perché `prec` e
     `mettiPrec` sono dichiarazioni di funzione: risalgono in cima al blocco,
     quindi il compilatore non può sapere che nessuno le chiama prima del
     controllo qui sopra. Ricopiarlo dopo il controllo glielo dice. */
  const chips: HTMLElement = forse;
  function prec(): Precisione {
    const on = chips.querySelector<HTMLElement>('.q-chip.on');
    return (on ? on.getAttribute('data-prec') : 'circa') === 'preciso' ? 'preciso' : 'circa';
  }
  function mettiPrec(v: Precisione) {
    chips.querySelectorAll<HTMLElement>('.q-chip').forEach(function (c) {
      c.classList.toggle('on', c.getAttribute('data-prec') === v);
    });
  }
  chips.querySelectorAll<HTMLElement>('.q-chip').forEach(function (c) {
    c.addEventListener('click', function () {
      scelta = c.getAttribute('data-prec') === 'preciso' ? 'preciso' : 'circa';
      mettiPrec(scelta);
    });
  });
  /* CHI CAMBIA L'ORA STA DANDO UN NUMERO: la scelta si sposta su «precisi»
     da sé, e si VEDE spostarsi — se restasse «più o meno» dopo che uno ha
     messo 7:12 col dito, il dato racconterebbe una cosa diversa da quella
     che è appena stata fatta. Chi ha scelto a mano non viene toccato. */
  ['#notte-sonno', '#notte-sveglia'].forEach(function (sel) {
    const el = scope.querySelector<HTMLElement>(sel);
    if (el) el.addEventListener('change', function () { if (!scelta) mettiPrec('preciso'); });
  });
  function salva(sonno: Ora | null, sveglia: Ora | null, p: Precisione) {
    LM.registraNotte(t, { sonno: sonno, sveglia: sveglia, prec: p });
    const m = LM.minutiSonno(t);
    toast('Notte registrata: ' + Math.floor(m / 60) + 'h' + (m % 60 ? ' ' + (m % 60) + 'm' : '') +
      (p === 'circa' ? ' (più o meno)' : ''), 0, 'bed');
    if (dopo) dopo();
    render();
  }
  presa(scope.querySelector<HTMLElement>('#notte-solito')).addEventListener('click', function () {
    var r = LM.ritmoDi(t);
    salva(r.sonnoRoutine, r.svegliaRoutine, 'circa');
  });
  presa(scope.querySelector<HTMLElement>('#notte-salva')).addEventListener('click', function () {
    const so = campo(scope, '#notte-sonno').value, sv = campo(scope, '#notte-sveglia').value;
    salva(so ? comeOra(so) : null, sv ? comeOra(sv) : null, prec());
  });
  presa(scope.querySelector<HTMLElement>('#notte-boh')).addEventListener('click', function () {
    /* nessun orario: il giorno resta sul ritmo di base, e non si richiede.
       Meglio un dato che non c'è di un numero inventato. */
    LM.segnaChiesto(t, 'notte');
    toast('Ok, niente orari per stanotte.', 0, 'check');
    if (dopo) dopo();
    render();
  });
}

/* --- i pasti e le cose fatte senza scriverle --- */
function bloccoRecupero(tutti?: boolean): string {
  var t = LM.todayKey();
  var r = LM.ritmoDi(t);
  var ora = LM.oraDelGiorno();
  /* NEL POP-UP solo i pasti di cui si può già parlare: alle nove del mattino
     nessuno vuole sentirsi chiedere se ha cenato.
     NELLA SEZIONE invece ci sono tutti, e per una ragione precisa: quella è
     la pagina dove uno va a cercare il posto dove si segnano i pasti, e una
     pagina che a colazione mostra una voce sola e a cena tre non è un posto,
     è un indovinello. La cena di stasera si può anche segnare in anticipo:
     chi salta i pasti lo sa già a mezzogiorno. */
  var pasti = (r.pasti || []).filter(function (pa) { return tutti || LM.minutiDaOra(pa.ora) <= ora + 30; });
  var fatte = LM.load().azioni.filter(function (a) { return a.data === t && a.dopo; });

  var righePasti = pasti.map(function (pa) {
    var risp = pa.fatto;
    /* «a un’altra ora» può essere già la risposta data: allora è quella
       pastiglia a essere accesa, non «sì» */
    var altraOra = risp === true && pa.prec === 'preciso';
    /* la risposta si legge SOTTO il nome, non dentro il tasto: mettendola
       nel tasto, «sì» diventava «sì, verso le 08:00» e i tre tasti andavano
       a capo appena si rispondeva — la riga si muoveva sotto il dito */
    var sotto = risp === true
      ? (pa.prec === 'preciso' ? 'alle ' : 'verso le ') + esc(pa.ora)
      : (risp === false ? 'saltato' : 'di solito alle ' + esc(pa.ora));
    return '<div class="lista-riga sc-riga sc-riga-alta" data-pasto="' + pa.id + '" data-psolito="' + esc(pa.ora || '') + '">' +
      '<span class="sc-eti">' + ICO('utensils', 15) + ' ' + esc(pa.nome) +
      '<small class="rec-solito">' + sotto + '</small></span>' +
      '<span class="sc-val q-chips">' +
      '<button class="q-chip' + (risp === true && !altraOra ? ' on' : '') + '" data-pfatto="si">sì</button>' +
      '<button class="q-chip' + (risp === false ? ' on' : '') + '" data-pfatto="no">no</button>' +
      /* LA TERZA RISPOSTA È IL CAMPO DELL’ORA, non un tasto che apre un
         campo dell’ora. Fra il dito e l’orologio del sistema non c’è
         niente di nostro: nessun ridisegno, nessuna richiesta di fuoco,
         nessuna richiesta di aprire l’orologio.
         Ed è LO STESSO CAMPO di «A letto» e «Sveglio» qui sopra —
         `.sc-inline`, dentro la sua riga, senza cornice — non uno somigliante.
         Le tre versioni con una cornice propria si sono rotte tutte: la
         prima non apriva niente, le altre due aprivano e richiudevano
         subito. La differenza fra quelle e questa non era il `<label>`, era
         il BORDO: un campo con la cornice se la vede ridisegnare da
         `forma.ts` (colore spento, filo, ritaglio), e su Android
         l’orologio di sistema si richiude se l’elemento che l’ha aperto
         viene rimaneggiato mentre è aperto. `.sc-inline` non ha cornice né
         angolo, quindi la forma non lo tocca mai — ed è esattamente per
         questo che quello di «stanotte» ha sempre funzionato.
         (La regola generale sta dall’altra parte: adesso la forma lascia in
         pace qualunque campo abbia il fuoco. Questo qui è la cintura, quella
         sono le bretelle.)
         Parte vuoto apposta: se ci trovasse dentro l’ora solita,
         riscegliere quella stessa ora non farebbe scattare nulla. */
      '<span class="rec-alt' + (altraOra ? ' on' : '') + '"><span class="rec-alt-eti">a un’altra ora</span>' +
      '<input type="time" class="sc-inline rec-ora" data-poraval="1" value="" required aria-label="' + esc(pa.nome) + ' a un’altra ora">' +
      '<span class="rec-ico" aria-hidden="true">' + ICO('clock', 15) + '</span></span>' +
      '</span></div>';
  }).join('');

  return '<div id="blocco-recupero">' +
    /* le due etichette qui sotto dicono già «I pasti di oggi» e «Altre cose
       fatte»: la frase che le annunciava era un indice di due voci messo
       sopra due voci. */
    (righePasti
      ? '<div class="rit-sez"><span>Pasti</span></div><div class="lista">' + righePasti + '</div>'
      : '') +
    '<div class="rit-sez"><span>Altre cose fatte' + (fatte.length ? ' · ' + fatte.length : '') + '</span></div>' +
    /* la stessa riga d'aggiunta di tutto il resto dell'app: una cosa per
       volta, e l'area compare quando hai cominciato a scrivere */
    rigaAggiunta('agg-fatto', 'Una cosa che hai fatto…',
      /* si parte da «Altro / Esplorazione»: una camminata messa d'ufficio in
         «Studio» è un dato sbagliato, e la prima area della lista non ha
         niente a che vedere con quello che uno ha appena scritto */
      '<label class="agg-area"><span class="agg-eti">in</span>' + selectAree('agg-fatto-area', areaNuova()) + '</label>' +
      '<label class="agg-area"><span class="agg-eti">verso le</span>' +
      '<input type="time" id="agg-fatto-ora" class="sc-inline" aria-label="Verso che ora"></label>') +
    (fatte.length
      ? '<div class="lista mt-s">' + fatte.map(function (a) {
        var ar = areaById(a.areaId);
        return '<div class="lista-riga" data-fid="' + a.id + '">' +
          '<span class="diario-ico ok" aria-hidden="true">' + ICO('check', 15) + '</span>' +
          '<span class="lista-corpo"><span class="lista-tit">' + segnoArea(ar, 13, 'tit-area') + esc(a.testo) + '</span>' +
          (a.ora ? '<span class="lista-sub">verso le ' + esc(a.ora) + '</span>' : '') + '</span>' +
          '<button class="icona-btn icona-pericolo" data-ftogli="' + a.id + '" title="Togli" aria-label="Togli «' + esc(a.testo) + '»">' + ICO('trash', 15) + '</button>' +
          '</div>';
      }).join('') + '</div>'
      : '') +
    '<div class="rit-azioni"><button class="btn btn-primario" id="rec-fine">Fatto</button></div>' +
    '</div>';
}

function wireRecupero(scope: HTMLElement, dopo?: (() => void) | null): void {
  const t = LM.todayKey();
  function rifai() {
    const vecchio = document.getElementById('blocco-recupero');
    if (!vecchio || !vecchio.parentNode) { render(); return; }
    const tmp = document.createElement('div');
    tmp.innerHTML = bloccoRecupero();
    const nuovo = tmp.firstChild as HTMLElement | null;
    if (!nuovo) { render(); return; }
    vecchio.parentNode.replaceChild(nuovo, vecchio);
    wireRecupero(nuovo, dopo);
  }
  scope.querySelectorAll<HTMLElement>('[data-pasto]').forEach(function (riga) {
    const id = riga.getAttribute('data-pasto');
    if (!id) return;
    const solito = riga.getAttribute('data-psolito');
    const campoOra = riga.querySelector<HTMLInputElement>('[data-poraval]');
    riga.querySelectorAll<HTMLElement>('[data-pfatto]').forEach(function (b) {
      b.addEventListener('click', function () {
        const si = b.getAttribute('data-pfatto') === 'si';
        LM.registraPasto(t, id, { fatto: si, ora: si && solito ? comeOra(solito) : null, prec: 'circa' });
        rifai();
      });
    });
    /* sul campo dell’ora non c’è nessun tocco da ascoltare: aprirlo è
       affare del browser. Qui si ascolta solo l’ora SCELTA — e si salva
       quando è scelta, non prima: un pasto registrato all’ora sbagliata e
       poi corretto lascia due righe nel diario. */
    if (campoOra) campoOra.addEventListener('change', function () {
      if (!campoOra.value) return;
      LM.registraPasto(t, id, { fatto: true, ora: comeOra(campoOra.value), prec: 'preciso' });
      rifai();
    });
  });
  wireRigaAggiunta(scope, 'agg-fatto', function (testo, opz) {
    const sel = opz.querySelector<HTMLSelectElement>('#agg-fatto-area');
    const oraEl = opz.querySelector<HTMLInputElement>('#agg-fatto-ora');
    LM.registraFatta(testo, sel ? sel.value : null, { ora: oraEl && oraEl.value ? comeOra(oraEl.value) : null });
    toast('Aggiunta a Oggi.', LM.XP_EVENTI.azione, 'check');
    rifai();
    var inp = document.querySelector<HTMLElement>('#agg-fatto .agg-testo');
    if (inp) inp.focus();
  });
  scope.querySelectorAll<HTMLElement>('[data-ftogli]').forEach(function (b) {
    b.addEventListener('click', function () {
      const id = b.getAttribute('data-ftogli');
      if (!id) return;
      conAnnulla('Tolta.', 'trash', function () { LM.rimuoviAzione(id); });
      rifai();
    });
  });
  presa(scope.querySelector<HTMLElement>('#rec-fine')).addEventListener('click', function () {
    LM.segnaChiesto(t, 'giorno');
    toast('Giornata registrata.', 0, 'check');
    if (dopo) dopo();
    render();
  });
}

/* --- i due pop-up ---
   CHIUDERLO VALE «NON ADESSO». Senza questo, chi lo scaccia se lo ritrova
   davanti al prossimo ricaricamento della pagina, cioè fra dieci minuti: un
   pop-up che torna dopo che l'hai chiuso è la cosa che fa disinstallare le
   app. La domanda non sparisce, si sposta: resta nei Rituali, dove sta di
   casa, e torna da sé domani. */
/* IL REGISTRO DI OGGI: una sezione sola per le tre cose che l'app non può
   sapere da sé. Sopra la notte, sotto i pasti e quello che hai fatto senza
   scriverlo. Sono la stessa specie di domanda — «raccontami un pezzo di
   giornata che io non ho visto» — e prima stavano in due rituali diversi,
   uno dei quali (la review della sera) non le nomina nemmeno nel titolo. */
function ritualeRegistro(corpo: HTMLElement): void {
  corpo.innerHTML = '<div class="card">' + bloccoNotte() + '</div>' +
    '<div class="card">' + bloccoRecupero(true) + '</div>';
  var bn = corpo.querySelector<HTMLElement>('#blocco-notte');
  if (bn) wireNotte(bn, null);
  var br = corpo.querySelector<HTMLElement>('#blocco-recupero');
  /* UN SOLO «FATTO». Il blocco del sonno qui non ha il suo «Salva»: gli orari
     scritti si registrano col tasto in fondo, insieme ai pasti */
  var salvaNotte = corpo.querySelector<HTMLElement>('#notte-salva');
  var fine = corpo.querySelector<HTMLElement>('#rec-fine');
  const notte = bn;
  if (salvaNotte && fine && notte) {
    salvaNotte.hidden = true;
    fine.addEventListener('click', function () {
      const bn = notte;
      var so = bn.querySelector<HTMLInputElement>('#notte-sonno'), sv = bn.querySelector<HTMLInputElement>('#notte-sveglia');
      var on = bn.querySelector<HTMLElement>('#notte-prec .q-chip.on');
      if (so && sv && (so.value || sv.value)) {
        LM.registraNotte(LM.todayKey(), { sonno: so.value ? comeOra(so.value) : null, sveglia: sv.value ? comeOra(sv.value) : null,
          prec: on && on.getAttribute('data-prec') === 'preciso' ? 'preciso' : 'circa' });
      }
    }, true);
  }
  /* «Ho finito» chiude il rituale: il lavoro è fatto, la riga dice «fatto» */
  if (br) wireRecupero(br, function () {
    if (schermo.ritualiAperti) delete schermo.ritualiAperti['registro'];
    render();
  });
}

function popupGiornata(titolo: string, quale: string, html: string, wire: (root: HTMLElement) => void, riapri: () => void): void {
  var t = LM.todayKey();
  function allaChiusura() {
    document.removeEventListener('lm:sheet-chiuso', allaChiusura);
    if (!LM.giaChiesto(t, quale)) LM.segnaChiesto(t, quale);
  }
  document.addEventListener('lm:sheet-chiuso', allaChiusura);
  apriSheet(titolo, '<div class="sc">' + html + '</div>', wire, false, { nome: titolo, apri: riapri });
}
function apriChiestaNotte() {
  popupGiornata('Il sonno di stanotte', 'notte', bloccoNotte(),
    function (root) { wireNotte(root, chiudiSheet); }, apriChiestaNotte);
}
function apriChiestaGiornata() {
  popupGiornata('Pasti e cose fatte', 'giorno', bloccoRecupero(),
    function (root) { wireRecupero(root, chiudiSheet); }, apriChiestaGiornata);
}

/* QUANDO CHIEDERE. Una volta per apertura, e mai a sproposito: le regole
   stanno tutte qui perché sono la parte che si sbaglia. */
var vistoPrima = 0;
function forseChiedere() {
  var s = LM.load();
  if (!s.onboarded) return;
  /* niente domande sopra qualcosa che è già aperto */
  if (!perId('sheet-overlay').hidden) return;
  if (perId('onboarding-root').innerHTML) return;
  /* la PRIMA volta che l'app ti vede non ti chiede com'è andata: non ha
     niente con cui confrontare, e sarebbe un interrogatorio all'ingresso */
  if (!vistoPrima) return;
  var t = LM.todayKey();
  var d = new Date();
  var min = d.getHours() * 60 + d.getMinutes();
  /* LE FINESTRE LE DECIDE CHI RICEVE LE DOMANDE. Erano due numeri scritti
     qui dentro — le cinque e le diciannove — e valevano per tutti: chi si
     alza a mezzogiorno si sentiva chiedere della notte a metà pomeriggio, e
     chi cena alle dieci riceveva la domanda sui pasti mentre stava ancora
     cucinando. Adesso stanno in «Sonno e pasti», con l'interruttore per
     spegnerle del tutto: spente, il registro resta comunque nei Rituali. */
  var q = LM.chiediQuando();
  if (q.notte.on && min >= LM.minutiDaOra(q.notte.da) && min < LM.minutiDaOra(q.notte.a) && !LM.giaChiesto(t, 'notte')) {
    /* il buco in cui la notte ci sta. Sotto le tre ore non è una notte:
       è la stessa giornata che continua, e chiedere «com'è andata la notte»
       a chi non è andato a dormire è la cosa più stupida che l'app possa
       fare. */
    if (Date.now() - vistoPrima >= 3 * 3600 * 1000) { apriChiestaNotte(); return; }
  }
  if (q.giorno.on && min >= LM.minutiDaOra(q.giorno.da) && !LM.giaChiesto(t, 'giorno')) { apriChiestaGiornata(); return; }  /* il check-in si fa comunque: appena apri, una volta al giorno, te lo
     trovi davanti. Si può chiudere, e per oggi non torna. */
  let chiesto = '';
  try { chiesto = localStorage.getItem('lm-checkin-chiesto') || ''; } catch (_e) { /* senza memoria si chiede e basta */ }
  if (d.getHours() >= 5 && chiesto !== t && !s.checkins.some(function (c) { return c.data === t; })) {
    try { localStorage.setItem('lm-checkin-chiesto', t); } catch (_e) { /* idem */ }
    apriCheckinVeloce();
  }
}

/* la giornata finita si festeggia: quando l'ultima cosa di oggi passa a
   fatta, e solo in quel momento */
let fatteVisteOggi = -1;
document.addEventListener('lm:change', function () {
  const oggi = LM.azioniDiOggi();
  const fatte = oggi.filter(function (x) { return x.done; }).length;
  if (fatteVisteOggi >= 0 && fatte > fatteVisteOggi && oggi.length > 0 && fatte === oggi.length) festa();
  fatteVisteOggi = fatte;
});

/* LA FESTA: una manciata di coriandoli dal centro dello schermo. Sta su
   quello che si chiude davvero — un rituale, la giornata — non su ogni tocco. */
export function festa(): void {
  if ((LM.load().profilo.effetti || 'pieni') === 'minimi') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const strato = document.createElement('div');
  strato.className = 'festa'; strato.setAttribute('aria-hidden', 'true');
  const COL = ['#ff5a5f', '#ffb400', '#00c781', '#3b82f6', '#a855f7', '#ff7ac6'];
  let dentro = '';
  for (let i = 0; i < 36; i++) {
    const ang = (Math.PI * 2 * i) / 36 + Math.random() * 0.4;
    const forza = 110 + Math.random() * 190;
    dentro += '<i style="--x:' + Math.round(Math.cos(ang) * forza) + 'px;--y:' + Math.round(Math.sin(ang) * forza - 90) +
      'px;--r:' + Math.round(Math.random() * 720 - 360) + 'deg;--d:' + Math.round(Math.random() * 120) + 'ms;background:' +
      COL[i % COL.length] + (i % 3 === 0 ? ';border-radius:50%' : '') + '"></i>';
  }
  strato.innerHTML = dentro;
  document.body.appendChild(strato);
  setTimeout(function () { strato.remove(); }, 1500);
}

/* IL CHECK-IN IN TRE TOCCHI: tre domande, cinque facce, e alla terza
   risposta è salvato — senza un tasto da cercare. */
export function apriCheckinVeloce(): void {
  const voti: Record<Voto, number> = { energia: 0, focus: 0, umore: 0 };
  const DOM: [Voto, string][] = [['energia', 'Energia'], ['focus', 'Concentrazione'], ['umore', 'Umore']];
  const FACCE = ['😫', '😕', '😐', '🙂', '🤩'];
  apriSheet('Come stai?', '<div class="ck"><div class="ck-masc">' + mascotte() + '</div>' + DOM.map(function (q) {
    return '<div class="ck-riga"><span class="ck-eti">' + q[1] + '</span><div class="ck-scala" data-campo="' + q[0] + '">' +
      [1, 2, 3, 4, 5].map(function (v) {
        return '<button data-v="' + v + '" aria-label="' + q[1] + ': ' + ANCORE[q[0]][v - 1] + '">' + FACCE[v - 1] + '</button>';
      }).join('') + '</div></div>';
  }).join('') + '</div>', function (root) {
    root.querySelectorAll<HTMLElement>('.ck-scala').forEach(function (sc) {
      sc.querySelectorAll<HTMLElement>('button').forEach(function (b) {
        b.addEventListener('click', function () {
          sc.querySelectorAll<HTMLElement>('button').forEach(function (x) { x.classList.toggle('sel', x === b); });
          sc.classList.add('scelta');
          voti[(sc.getAttribute('data-campo') || 'energia') as Voto] = +(b.getAttribute('data-v') || 0);
          suona('leggero');
          if (!(voti.energia && voti.focus && voti.umore)) return;
          const xp = LM.registraCheckin(voti.energia, voti.focus, voti.umore);
          setTimeout(function () {
            chiudiSheet(); festa(); toast('Check-in fatto', xp, 'check'); render();
          }, 320);
        });
      });
    });
  });
}

function ritualeMattina(corpo: HTMLElement): void {
  var s = LM.load();
  var t = LM.todayKey();
  var piano = s.pianoMattina[t];
  var oggi = LM.azioniDiOggi();

  /* La notte non si racconta più qui: sta nel «Registro di oggi», insieme
     ai pasti e alle cose fatte. Erano tre domande della stessa specie
     sparse in due rituali diversi, e i pasti in particolare finivano dietro
     la review della sera, dove nessuno andava a cercarli. Questo rituale fa
     una cosa sola: scegliere le azioni di oggi. */
  corpo.innerHTML = '<div class="card">' +
    /* Della riga sotto il titolo resta la sola cosa che non si vede: che
       la prima della lista è quella che conta. «Le scegli qui e le fai in
       Oggi. Ogni giorno riparte da capo.» era il funzionamento dell'app
       raccontato sopra una lista in cui si sta già scrivendo. */
    testaRituale('sun', 'Le azioni di oggi', 'La prima è quella più importante.') +
    '<div class="lista-azioni" id="piano-lista"></div>' +
    /* Tre è il consiglio, non un muro: chi ha una giornata piena deve poter
       scrivere quello che gli serve. Oltre le tre lo diciamo e basta. */
    /* la stessa riga d'aggiunta di «Da fare» e delle abitudini: campo e
       «Aggiungi», e l'area compare solo quando hai cominciato a scrivere.
       Prima qui c'erano campo, tendina e tasto tutti in fila, che sul
       telefono andavano a capo su tre righe per aggiungere una cosa. */
    '<div class="mt-s">' +
    rigaAggiunta('agg-piano', oggi.length === 0 ? 'Priorità di oggi…' : 'Aggiungi un’altra priorità…',
      '<label class="agg-area"><span class="agg-eti">in</span>' + selectAree('agg-piano-area') + '</label>') +
    '</div>' +
    /* Tre è il consiglio, e lo diciamo in una riga sola: «Hai 5 azioni per
       oggi. Oltre tre diventa difficile finirle: le altre si possono
       spostare a domani da La giornata» erano due frasi per dire un numero
       e un posto dove andare. */
    (oggi.length >= 3 ? '<div class="sotto" style="margin:8px 0 0">' + oggi.length + ' azioni per oggi: oltre tre è difficile chiuderle tutte. Da <i>La giornata</i> puoi spostarne a domani.</div>' : '') +
    '<label class="campo" for="piano-ifthen">Quando inizi?</label>' +
    '<input type="text" id="piano-ifthen" placeholder="Es. alle 9:00, alla scrivania" value="' + (piano ? esc(piano.intenzione) : '') + '">' +
    /* Un pulsante, non due. C'erano «Salva» (pieno, con la freccia,
       +5 XP) e «Inizia ora» accanto: il primo salvava e NON si muoveva,
       nonostante la freccia e la parola «parti»; il secondo andava a Oggi
       senza salvare, quindi l'intenzione appena scritta qui sopra veniva
       buttata. Due tasti per un gesto, divisi a metà così che nessuno dei
       due lo facesse per intero. Ora «Salva» salva e parte davvero;
       quando il piano c'è già diventa «Aggiorna» e resta qui, perché stai
       correggendo, non partendo — e per andare a Oggi c'è la linguetta
       «Adesso», due centimetri sopra. */
    '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="btn-salva-piano">' + ICO('save', 15) + (piano ? ' Aggiorna' : ' Salva') + ' <small>+' + LM.XP_EVENTI.pianoMattina + ' XP</small></button></div>' +
    '</div>';

  var lista = perId('piano-lista');
  lista.innerHTML = oggi.length
    ? oggi.map(function (a) {
        var ar = areaById(a.areaId);
        return '<div class="riga-azione' + (a.done ? ' fatta' : '') + '"><span class="testo">' + esc(a.testo) + '</span>' +
          (a.mit ? '<span class="tag-mit">' + ICO('star', 11) + 'Priorità</span>' : '') +
          segnoArea(ar, 15, 'tag-area') + '</div>';
      }).join('')
    : '<div class="vuoto" style="padding:14px">Nessuna priorità. La prima diventa la più importante.</div>';

  wireRigaAggiunta(corpo, 'agg-piano', function (testo, opz) {
    var sel = opz ? opz.querySelector<HTMLSelectElement>('select') : null;
    LM.aggiungiAzione(testo, sel ? sel.value : 'altro', { mit: LM.serveMit() });
    render();
  });
  presa(document.getElementById('btn-salva-piano')).addEventListener('click', function () {
    var eraSalvato = !!piano;
    var xp = LM.salvaPianoMattina(presa(campoId('piano-ifthen')).value.trim());
    var mit = LM.azioniDiOggi().find(function (a) { return a.mit; });
    if (mit) {
      mit.ifThen = presa(campoId('piano-ifthen')).value.trim();
      LM.save();
    }
    toast(xp ? 'Piano fatto' : 'Aggiornato', xp, 'sun');
    /* la prima volta del giorno il piano è appena nato: si va a farlo. Se lo
       stai solo aggiornando resti dove sei. */
    if (!eraSalvato) { location.hash = '#/oggi'; return; }
    render();
  });
}

/* ---------- Attività → Abitudini ---------- */

/* I SETTE GIORNI, in ordine di settimana italiana (lunedì primo) e con la
   loro iniziale. `Date.getDay()` mette la domenica a zero: l'ordine qui è
   quello che si legge, non quello che dà il browser. */
export const GIORNI_ORD: readonly GiornoSettimana[] = [1, 2, 3, 4, 5, 6, 0];
export const GIORNI_LAB: Record<GiornoSettimana, string> = { 1: 'L', 2: 'M', 3: 'M', 4: 'G', 5: 'V', 6: 'S', 0: 'D' };

/* Le scelte di un'abitudine nuova, con lo stesso aspetto della sua scheda:
   un riquadro solo, i giorni in fila tonda, poi ora e area una per riga.
   L'ora si decide adesso, mentre l'intenzione è fresca. */
export function opzioniNuovaAbitudine(): string {
  return '<div class="gr agg-gr">' +
    '<div class="gr-riga"><span class="gr-eti">Giorni</span><span class="gr-fisso" id="agg-ab-quando">Ogni giorno</span></div>' +
    '<div class="gr-riga gr-giorni" id="agg-ab-giorni">' + chipsGiorni([1, 2, 3, 4, 5, 6, 0]) + '</div>' +
    '<label class="gr-riga" for="agg-ab-ora"><span class="gr-eti">Ora</span>' +
    '<span class="gr-data"><input type="time" class="gr-val" id="agg-ab-ora" required aria-label="A che ora (facoltativo)"><span class="gr-mai" aria-hidden="true">Nessuna</span></span></label>' +
    '<label class="gr-riga" for="agg-ab-area"><span class="gr-eti">Area</span>' + selectAree('agg-ab-area', areaNuova('salute'), 'Area', 'gr-val') + '</label>' +
    '</div>';
}
/* tocca una pastiglia dei giorni della riga nuova: accende e riscrive il riassunto */
export function toccaGiornoNuovo(opz: ParentNode, chip: HTMLElement): void {
  chip.classList.toggle('sel');
  const q = opz.querySelector<HTMLElement>('#agg-ab-quando');
  const g = opz.querySelector<HTMLElement>('#agg-ab-giorni');
  if (q && g) { const r = riepilogoGiorni(leggiGiorni(g)); q.textContent = r.charAt(0).toUpperCase() + r.slice(1); }
}
export function chipsGiorni(giorni: GiornoSettimana[]): string {
  return '<div class="giorni-chips">' + GIORNI_ORD.map(function (d) {
    return '<button type="button" class="giorno-chip' + (giorni.indexOf(d) >= 0 ? ' sel' : '') + '" data-giorno="' + d + '">' + GIORNI_LAB[d] + '</button>';
  }).join('') + '</div>';
}
export function leggiGiorni(root: ParentNode): GiornoSettimana[] {
  const g: GiornoSettimana[] = [];
  root.querySelectorAll<HTMLElement>('.giorno-chip.sel').forEach(function (b) {
    /* i sette valori li ha scritti `chipsGiorni` da `GIORNI_ORD`: quello che
       torna da `data-giorno` è uno di quelli */
    g.push(+(b.getAttribute('data-giorno') || 0) as GiornoSettimana);
  });
  return g;
}
export function riepilogoGiorni(giorni: GiornoSettimana[]): string {
  if (!giorni || !giorni.length) return 'ogni giorno';
  if (giorni.length === 7) return 'ogni giorno';
  const feriali: GiornoSettimana[] = [1, 2, 3, 4, 5];
  if (giorni.length === 5 && feriali.every(function (d) { return giorni.indexOf(d) >= 0; })) return 'lun–ven';
  return GIORNI_ORD.filter(function (d) { return giorni.indexOf(d) >= 0; }).map(function (d) { return GIORNI_LAB[d]; }).join(' ');
}

/* ============================================================
   ABITUDINI
   Il lavoro di ogni giorno è spuntare tre righe; il lavoro di una volta
   è decidere quali sono e quando. Prima stavano nella stessa schermata,
   con lo stesso peso: ogni abitudine compariva DUE volte — una nella
   lista di oggi e una nell'elenco per modificarla — e l'elenco delle
   modifiche si prendeva il 70% dell'altezza (713 px su 1039 con tre
   abitudini, 1770 su 2256 con otto). Il gesto quotidiano finiva
   schiacciato in una striscia dentro un pannello di impostazioni.
   Adesso c'è una lista sola, in stile elenco di iOS: la riga si spunta,
   e toccandola si apre la sua scheda con tutto il resto (nome, giorni,
   area, periodo, la catena degli ultimi 28 giorni, salta oggi,
   elimina). Le cose che non tocchi quasi mai non occupano più lo
   schermo di quelle che tocchi tutti i giorni.
   ============================================================ */

/* La catena: gli ultimi n giorni, per vedere a colpo d'occhio come sta
   andando. Le caselle passate si toccano — capita di ricordarsi la sera
   di una cosa fatta il giorno prima, e i dati lo permettevano già senza
   che ci fosse un modo per dirlo. */
/* UNA CASELLA DELLA CATENA. `fatto`/`saltato` e non `fatta`/`saltata`: il
   nome che il codice usa da sempre, e la forma che leggono la scheda
   dell'abitudine e la sua griglia. */
export interface CasellaCatena {
  k: Giorno;
  fatto: boolean;
  saltato: boolean;
  prevista: boolean;
  futuro: boolean;
  oggi: boolean;
}
export function giorniAbitudine(h: Abitudine, settimane: number): CasellaCatena[] {
  /* incolonnati per giorno della settimana, come un calendario: se le
     caselle scorrono via una dietro l'altra non si vede più che «il
     martedì salta sempre», che è l'unica cosa che una griglia sa dire e
     una lista no. Si parte dal lunedì di N settimane fa e si arriva a
     fine settimana: gli ultimi giorni possono essere nel futuro. */
  const oggi = LM.todayKey();
  const inizio = LM.addDays(LM.weekKey(oggi), -7 * (settimane - 1));
  const out: CasellaCatena[] = [];
  for (let i = 0; i < settimane * 7; i++) {
    const k = LM.addDays(inizio, i);
    out.push({
      k: k,
      fatto: !!(h.fatti && h.fatti[k]),
      saltato: !!(h.salti && h.salti[k]),
      prevista: LM.abitudinePrevista(h, k),
      futuro: k > oggi,
      oggi: k === oggi
    });
  }
  return out;
}

export function statoAbitudineOggi(h: Abitudine): { fatta: boolean; saltata: boolean } {
  const k = LM.todayKey();
  return { fatta: !!(h.fatti && h.fatti[k]), saltata: !!(h.salti && h.salti[k]) };
}

/* Cosa dice la riga sotto al nome: la serie se c'è, altrimenti il motivo
   per cui oggi non è in lista. */
/* «torna martedì» invece di «L M V»: il giorno in cui tocca è
   un'informazione, l'elenco delle iniziali va tradotto ogni volta. */
function quandoTorna(h: Abitudine): string | null {
  const k = LM.prossimaAbitudine(h);
  if (!k) return null;
  if (k === LM.addDays(LM.todayKey(), 1)) return 'torna domani';
  const g = LM.weekdayShort(k);
  const nomi: Record<string, string> = { lun: 'lunedì', mar: 'martedì', mer: 'mercoledì', gio: 'giovedì', ven: 'venerdì', sab: 'sabato', dom: 'domenica' };
  if (LM.daysBetween(LM.todayKey(), k) <= 7) return 'torna ' + (nomi[g] || g);
  return 'torna il ' + LM.fmtShort(k);
}

/* la riga sotto al nome: la serie se c'è, altrimenti il motivo per cui oggi
   non è in lista. `ico` ce l'ha solo la serie (la fiamma). */
interface SottoRiga { testo: string; cls: string; ico?: string }
function sottoAbitudine(h: Abitudine, previstaOggi: boolean): SottoRiga | null {
  const st = statoAbitudineOggi(h);
  if (st.saltata) return { testo: 'saltata oggi', cls: 'saltata' };
  if (!previstaOggi) {
    const oggi = LM.todayKey();
    if (h.da && oggi < h.da) return { testo: 'comincia il ' + LM.fmtShort(h.da), cls: '' };
    if (h.a && oggi > h.a) return { testo: 'finita il ' + LM.fmtShort(h.a), cls: '' };
    return { testo: quandoTorna(h) || riepilogoGiorni(h.giorni), cls: '' };
  }
  /* Per le abitudini di oggi la seconda riga la merita solo la serie:
     ripetere «ogni giorno» sotto ogni riga di una lista intitolata
     «Oggi» è una parola che si legge sei volte e non dice niente. */
  const serie = LM.streakAbitudine(h);
  if (serie > 1) return { testo: serie + ' giorni di fila', cls: 'serie', ico: 'flame' };
  if (serie === 1) return { testo: 'cominciata oggi', cls: 'serie', ico: 'flame' };
  return null;
}

export function rigaAbitudine(h: Abitudine, previstaOggi: boolean): string {
  const st = statoAbitudineOggi(h);
  const sotto = sottoAbitudine(h, previstaOggi);
  const ar = areaById(h.areaId);
  return '<div class="lista-riga ab-riga' + (st.fatta ? ' fatta' : '') + (st.saltata ? ' saltata' : '') +
    '" data-abid="' + h.id + '" style="--c-area:' + LM.coloreArea(ar) + '">' +
    (st.saltata
      ? '<span class="lista-vuoto" aria-hidden="true">' + ICO('salta', 15) + '</span>'
      : '<button class="lista-azione spunta" data-toggle-ab="' + h.id + '" aria-pressed="' + (st.fatta ? 'true' : 'false') +
        '" aria-label="' + esc(h.testo) + (st.fatta ? ', fatta oggi' : ', segna come fatta') + '">' + ICO('check', 13) + '</button>') +
    '<button class="lista-apri" data-abdett="' + h.id + '" aria-label="Apri ' + esc(h.testo) + '">' +
    '<span class="lista-corpo"><span class="lista-tit">' + esc(h.testo) + '</span>' +
    (sotto ? '<span class="lista-sub' + (sotto.cls ? ' ' + sotto.cls : '') + '">' +
      (sotto.ico ? ICO(sotto.ico, 11, 'fiamma') + ' ' : '') + esc(sotto.testo) + '</span>' : '') + '</span>' +
    (h.ora ? '<span class="lista-val">' + esc(h.ora) + '</span>' : '') +
    segnoArea(ar, 13, 'tit-area') +
    '<span class="lista-chev">' + ICO('chevronGiu', 15) + '</span></button>' +
    '</div>';
}

export function sezioneAbitudini(corpo: HTMLElement): void {
  var s = LM.load();
  /* con un orario la lista prende la forma della giornata: prima quelle
     che hanno un'ora, in ordine, poi quelle che si fanno quando capita */
  var oggi = LM.abitudiniDiOggi().slice().sort(function (a, b) {
    if (a.ora && b.ora) return a.ora < b.ora ? -1 : (a.ora > b.ora ? 1 : 0);
    if (a.ora) return -1;
    if (b.ora) return 1;
    return 0;
  });
  const idOggi: Record<string, true> = {};
  oggi.forEach(function (h) { idOggi[h.id] = true; });
  var altre = s.abitudini.filter(function (h) { return !idOggi[h.id]; });
  var fatte = oggi.filter(function (h) { return !!h.fatti[LM.todayKey()]; }).length;

  /* Il conto di oggi, in cima e in una riga: è la sola cosa che si
     guarda arrivando, e quando è pieno vale come premio. */
  var prog = '';
  if (oggi.length) {
    var tutte = fatte === oggi.length;
    prog = '<div class="ab-prog' + (tutte ? ' piena' : '') + '">' +
      '<div class="ab-prog-testo">' +
      (tutte ? ICO('check', 15) + ' <b>Fatte tutte</b>, per oggi ci sei.'
             : '<b>' + fatte + '</b> di ' + oggi.length + ' per oggi') + '</div>' +
      '<div class="ab-prog-barra"><span style="width:' + Math.round(fatte / oggi.length * 100) + '%"></span></div>' +
      '</div>';
  }

  /* Ordine identico a «Da fare», che adesso è la linguetta accanto: il
     conto di oggi, il campo per aggiungerne una, poi la lista. Due
     elenchi nella stessa pagina con il campo in posti diversi sono due
     posti da imparare invece di uno. */
  corpo.innerHTML =
    prog +
    '<div class="ab-nuova">' +
    rigaAggiunta('agg-ab', 'Nuova abitudine…',
      opzioniNuovaAbitudine()) +
    '</div>' +
    (oggi.length
      ? '<div class="lista-eti">Oggi</div><div class="lista">' +
        oggi.map(function (h) { return rigaAbitudine(h, true); }).join('') + '</div>'
      : (s.abitudini.length
        ? '<div class="vuoto" style="padding:20px 8px">Per oggi non è prevista nessuna abitudine.</div>'
        : '<div class="vuoto" style="padding:20px 8px">' + illoInbox() + '<b>Nessuna abitudine.</b></div>')) +
    (altre.length
      ? '<div class="lista-eti">Le altre</div><div class="lista">' +
        altre.map(function (h) { return rigaAbitudine(h, false); }).join('') + '</div>'
      : '') +
    '';

  corpo.querySelectorAll<HTMLElement>('[data-toggle-ab]').forEach(function (b) {
    b.addEventListener('click', function (ev) {
      feedbackSpunta(ev, LM.completaAbitudine(b.getAttribute('data-toggle-ab') || ''), 'Fatta. Continua così', 'flame');
      sezioneAbitudini(corpo);
    });
  });
  corpo.querySelectorAll<HTMLElement>('[data-abdett]').forEach(function (b) {
    b.addEventListener('click', function () {
      apriDettaglioAbitudine(b.getAttribute('data-abdett') || '', function () { sezioneAbitudini(corpo); });
    });
  });
  var nuovaG = presa(corpo.querySelector<HTMLElement>('#agg-ab-giorni'));
  nuovaG.querySelectorAll<HTMLElement>('.giorno-chip').forEach(function (chip) {
    chip.addEventListener('click', function () { toccaGiornoNuovo(corpo, chip); });
  });
  wireRigaAggiunta(corpo, 'agg-ab', function (testo, opz) {
    var giorni = leggiGiorni(presa(opz.querySelector<HTMLElement>('#agg-ab-giorni')));
    var ora = campo(opz, '#agg-ab-ora').value ? comeOra(campo(opz, '#agg-ab-ora').value) : null;
    LM.aggiungiAbitudine(testo, campo(opz, '#agg-ab-area').value, giorni, { ora: ora });
    toast('«' + testo + '» ' + riepilogoGiorni(giorni) + (ora ? ' alle ' + ora : '') + ', da oggi.', 0, 'refresh');
    sezioneAbitudini(corpo);
    /* i giorni tornano vuoti e il fuoco resta nel campo: la scelta valeva
       per quell'abitudine, non per la prossima */
    var i = corpo.querySelector<HTMLElement>('#agg-ab .agg-testo');
    if (i) i.focus({ preventScroll: true });
  });
}

/* La scheda di un'abitudine: quello che prima stava sempre in vista per
   tutte, qui sta per una sola e solo quando serve. In cima c'è oggi
   (fatta / salta), poi la catena, poi le impostazioni. */
export function apriDettaglioAbitudine(id: string, dopo?: () => void): void {
  var h0 = LM.load().abitudini.find(function (x) { return x.id === id; });
  if (!h0) return;
  apriFoglio(h0.testo, 'abitudine', { id: id, dopo: dopo });
}

/* Ancore comportamentali (BARS) per ogni punto della scala: descrivere
   concretamente ogni livello riduce la tendenza a rifugiarsi nel "3".
   Il riferimento "il tuo solito" (media recente) dà un punto d'appoggio
   a chi si sente sempre nella media. */
type Voto = 'energia' | 'focus' | 'umore';
const ANCORE: Record<Voto, [string, string, string, string, string]> = {
  energia: ['esausto', 'fiacco', 'normale', 'carico', 'pieno'],
  focus: ['disperso', 'a fatica', 'normale', 'lucido', 'molto concentrato'],
  umore: ['giù', 'così così', 'normale', 'bene', 'alla grande']
};

function ritualeCheckin(corpo: HTMLElement, rifai?: boolean): void {
  const diOggi = LM.load().checkins.filter(function (c) { return c.data === LM.todayKey(); }).pop();
  if (diOggi && !rifai) {
    const FACCE = ['😫', '😕', '😐', '🙂', '🤩'];
    const voce = function (eti: string, v: number): string {
      return '<span class="ck-fatto-v"><i>' + (FACCE[v - 1] || '') + '</i>' + eti + '</span>';
    };
    corpo.innerHTML = '<div class="ck-fatto">' + voce('Energia', diOggi.energia) + voce('Concentrazione', diOggi.focus) +
      voce('Umore', diOggi.umore) + '<button class="btn btn-mini btn-ghost" id="ck-rifai">Modifica</button></div>';
    perId('ck-rifai').addEventListener('click', function () { ritualeCheckin(corpo, true); });
    return;
  }
  /* rifacendolo si parte da quello che avevi detto, non da zero */
  const voti: Record<Voto, number> = diOggi ? { energia: diOggi.energia, focus: diOggi.focus, umore: diOggi.umore } : { energia: 0, focus: 0, umore: 0 };
  corpo.innerHTML = '<div class="card">' +
    testaRituale('polso', 'Energia, focus e umore',
      /* la prima metà («Energia, concentrazione e umore su una scala da 1 a
         5») è l'elenco delle tre domande che stanno subito sotto, con le
         scale accanto. Resta la seconda, che nessuna domanda dice e che
         serve a chi tiene alla precisione: il numero di oggi non è un
         voto. */
      'Conta l’andamento nei giorni, non il numero di oggi.') +
    scala('energia', 'batteria', 'Quanta energia hai?') +
    scala('focus', 'mirino', 'Quanto riesci a concentrarti?') +
    scala('umore', 'smile', 'Come ti senti?') +
    '<div class="riga-flex mt"><button class="btn btn-tonale btn-grande" id="btn-salva-checkin" disabled>' + ICO('save', 15) + ' Registra <small>+' + LM.XP_EVENTI.checkin + ' XP</small></button></div>' +
    '</div><div class="card mt"><h2>' + ICO('trendUp', 15) + ' Andamento degli ultimi 14 giorni</h2><div id="mini-trend"></div></div>';

  /* il parametro si chiamava `campo`, come l'aiutante che prende un input
     in questo file: dentro `scala` quello spariva. */
  function scala(quale: Voto, icona: string, nome: string): string {
    var base = LM.baselineCheckin(quale, 30);
    var anc = ANCORE[quale];
    return '<div class="scala-blocco"><label class="campo">' + ICO(icona, 13) + ' ' + nome + '</label>' +
      '<div class="scala" data-campo="' + quale + '">' +
      [1, 2, 3, 4, 5].map(function (v) {
        return '<button data-v="' + v + '"' + (voti[quale] === v ? ' class="sel" aria-pressed="true"' : '') + ' aria-label="' + v + ', ' + anc[v - 1] + '">' + v + '</button>';
      }).join('') + '</div>' +
      '<div class="scala-legenda"><span>1 · ' + anc[0] + '</span><span>3 · ' + anc[2] + '</span><span>5 · ' + anc[4] + '</span></div>' +
      (base ? '<div class="scala-solito">' + ICO('solito', 13) +
        /* tutto il testo in un solo elemento: il contenitore è inline-flex
           con un gap, e un punto lasciato fuori diventava un pezzo a sé
           staccato di sei pixel («è 4.3 .») */
        '<span>Media recente <b>' + base.toFixed(1).replace('.', ',') + '</b></span></div>' : '') +
      '</div>';
  }
  corpo.querySelectorAll<HTMLElement>('.scala').forEach(function (sc) {
    sc.querySelectorAll<HTMLElement>('button').forEach(function (b) {
      b.addEventListener('click', function () {
        sc.querySelectorAll<HTMLElement>('button').forEach(function (x) { x.classList.remove('sel'); });
        b.classList.add('sel');
        /* i tre nomi li scrive `scala` qui sopra, da `ANCORE` */
        voti[(sc.getAttribute('data-campo') || 'energia') as Voto] = +(b.getAttribute('data-v') || 0);
        (perId<HTMLButtonElement>('btn-salva-checkin')).disabled = !(voti.energia && voti.focus && voti.umore);
      });
    });
  });
  perId('btn-salva-checkin').addEventListener('click', function (ev) {
    var xp = LM.registraCheckin(voti.energia, voti.focus, voti.umore);
    var r = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    flyXp(r.left + r.width / 2, r.top, xp);
    festa(); toast('Check-in fatto', xp, 'check');
    schermo.ritualiAperti = null;
    location.hash = '#/oggi';
    render();
  });

  var dark = document.documentElement.getAttribute('data-mode') === 'dark';
  LMCharts.trend(perId('mini-trend'), [
    { nome: 'Energia', colore: dark ? '#c98500' : '#eda100', punti: LM.serieCheckin('energia', 14) },
    { nome: 'Focus',   colore: dark ? '#3987e5' : '#2a78d6', punti: LM.serieCheckin('focus', 14) },
    { nome: 'Umore',   colore: dark ? '#199e70' : '#1baf7a', punti: LM.serieCheckin('umore', 14) }
  ], { min: 1, max: 5, h: 180 });
}

/* «TIENILA»: prende quello che c'è in un campo della review e ne fa una riga
   fra le cose che hai capito su di te. Il campo resta com'è — la review è il
   racconto di quel giorno, la riga è quello che ne hai imparato: due cose
   diverse, e cancellare la prima per avere la seconda sarebbe una perdita.
   Il tasto si nasconde da sé quando il campo è vuoto o quando quella riga
   c'è già, così non promette due volte la stessa cosa. */
function collegaTenutaLezione(scope: ParentNode, idCampo: string, idTasto: string, verso: 'si' | 'no', forza?: string): void {
  const forseCampo = scope.querySelector<HTMLInputElement | HTMLTextAreaElement>('#' + idCampo);
  const forseTasto = scope.querySelector<HTMLElement>('#' + idTasto);
  if (!forseCampo || !forseTasto) return;
  /* ricopiati dopo il controllo: `giaC` e `aggiorna` sono dichiarazioni di
     funzione e risalgono in cima, quindi il compilatore non tiene il
     controllo qui sopra (vedi la stessa cosa in `wireNotte`). */
  const campo = forseCampo, tasto = forseTasto;
  function giaC(v: string): boolean {
    return LM.load().lezioni.some(function (l) {
      return l.verso === verso && l.testo.toLowerCase() === v.toLowerCase();
    });
  }
  function aggiorna() {
    var v = campo.value.trim();
    tasto.hidden = !v || giaC(v);
  }
  campo.addEventListener('input', aggiorna);
  tasto.addEventListener('click', function () {
    var v = campo.value.trim();
    if (!v) return;
    LM.aggiungiLezione(v, verso, { forza: forza || 'notato' });
    toast(verso === 'si' ? 'Salvata fra le Scoperte, in «Funziona».' : 'Salvata fra le Scoperte, in «Non funziona».',
      0, verso === 'si' ? 'funziona' : 'nonFunziona');
    aggiorna();
    aggiornaNav();
  });
  aggiorna();
}

function ritualeSera(corpo: HTMLElement): void {
  var s = LM.load();
  var t = LM.todayKey();
  var rev = s.reviewSera[t];
  const toccate: Record<string, true> = {};
  LM.azioniDiOggi().forEach(function (a) { toccate[a.areaId] = true; });
  var ordinate = areeAttive().slice().sort(function (a, b) { return (toccate[b.id] ? 1 : 0) - (toccate[a.id] ? 1 : 0); });
  var votiOggi = s.valutazioni[t] || {};

  /* I pasti e le cose fatte stavano qui in cima, e qui non si trovavano:
     questa sezione si apre la sera e parla di com'è andata, non di cosa hai
     mangiato. Adesso hanno una riga loro, «Il registro di oggi», due righe
     più su in questa stessa pagina. */
  corpo.innerHTML = '<div class="card">' +
    /* i campi qui sotto portano ognuno la sua domanda scritta sopra: la
       riga che riassumeva tutte e tre («Voto alle aree su cui hai lavorato,
       una cosa andata bene e un ostacolo») era l'indice di una pagina lunga
       mezzo schermo. Resta il tempo che ci vuole, che nessun campo dice. */
    testaRituale('moon', 'Fine giornata', 'Due minuti.') +
    '<label class="campo">Com’è andata, area per area? <span class="campo-nota"><span class="nowrap">1 = male</span> · <span class="nowrap">5 = benissimo</span></span></label>' +
    '<div id="voti-aree">' + ordinate.map(function (a) {
      return '<div class="voto-area" data-area="' + a.id + '" style="--c-area:' + LM.coloreArea(a) + '">' +
        '<span class="nome">' + ICO(a.icona, 15) + ' ' + esc(a.nome) + '</span>' +
        '<span class="stelline">' + [1, 2, 3, 4, 5].map(function (v) {
          return '<button data-v="' + v + '"' + (votiOggi[a.id] === v ? ' class="sel"' : '') + '>' + v + '</button>';
        }).join('') + '</span></div>';
    }).join('') + '</div>' +
    '<label class="campo" for="sera-vittoria">Cosa è andato bene oggi?</label>' +
    '<input type="text" id="sera-vittoria" value="' + (rev ? esc(rev.vittoria || '') : '') + '" placeholder="Es. ho studiato 90 minuti senza guardare il telefono">' +
    /* QUI L'INSEGNAMENTO È FRESCO E GIÀ SCRITTO. Queste due righe finivano
       in un campo di testo che nessuno riapre: il tasto le porta fra le cose
       che hai capito su di te, dove restano e si contano. La forza è
       «notato una volta», perché è quello che è: un giorno, un'osservazione. */
    '<button class="btn btn-mini" id="sera-vitt-lez" hidden>' + ICO('funziona', 15) + ' Salvala fra le Scoperte</button>' +
    '<label class="campo" for="sera-blocco">Cosa ti ha bloccato?</label>' +
    '<input type="text" id="sera-blocco" value="' + (rev ? esc(rev.blocco || '') : '') + '" placeholder="Es. ho iniziato tardi, mi hanno distratto le notifiche">' +
    '<button class="btn btn-mini" id="sera-blocco-lez" hidden>' + ICO('nonFunziona', 15) + ' Salvalo fra le Scoperte</button>' +
    '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="btn-salva-sera">' + (rev ? ICO('save', 15) + ' Aggiorna' : ICO('moon', 15) + ' Salva') + ' <small>+' + LM.XP_EVENTI.reviewSera + ' XP</small></button></div>' +
    '</div>';

  /* il tasto compare solo quando c'è qualcosa da tenere, e sparisce quando
     quella riga è già stata tenuta: un tasto sempre acceso che a volte non fa
     niente è un tasto che non si tocca più */
  collegaTenutaLezione(corpo, 'sera-vittoria', 'sera-vitt-lez', 'si');
  collegaTenutaLezione(corpo, 'sera-blocco', 'sera-blocco-lez', 'no');

  corpo.querySelectorAll<HTMLElement>('.voto-area').forEach(function (riga) {
    riga.querySelectorAll<HTMLElement>('button').forEach(function (b) {
      b.addEventListener('click', function () {
        riga.querySelectorAll<HTMLElement>('button').forEach(function (x) { x.classList.remove('sel'); });
        b.classList.add('sel');
        LM.valutaArea(riga.getAttribute('data-area') || '', +(b.getAttribute('data-v') || 0));
      });
    });
  });
  perId('btn-salva-sera').addEventListener('click', function () {
    var xp = LM.salvaReviewSera({
      vittoria: presa(campoId('sera-vittoria')).value.trim(),
      blocco: presa(campoId('sera-blocco')).value.trim(),
      shutdown: true
    });
    toast('Giornata chiusa', xp, 'moon');
    if (xp) { festa(); schermo.ritualiAperti = null; location.hash = '#/oggi'; }
    render();
  });
}

function ritualeSettimana(corpo: HTMLElement): void {
  var s = LM.load();
  var wk = LM.weekKey(LM.todayKey());
  var rev = s.reviewSettimana[wk];
  var giorni = LM.lastNDays(7);
  var xpSett = giorni.reduce(function (x, k) { return x + (s.xpPerGiorno[k] || 0); }, 0);
  var azioniSett = s.azioni.filter(function (a) { return giorni.indexOf(a.data) >= 0 && a.done; }).length;
  var attivi = giorni.filter(function (k) { return LM.giornoAttivo(k); }).length;

  corpo.innerHTML = '<div class="card">' +
    testaRituale('unaSettimana', 'Bilancio della settimana', 'Dieci minuti.') +
    '<div class="stat-periodo">Ultimi 7 giorni</div>' +
    '<div class="eroe-statistiche" style="justify-content:center;margin-bottom:16px">' +
    '<div class="stat"><span class="stat-val">' + xpSett + '</span><span class="stat-eti">XP guadagnati</span></div>' +
    '<div class="stat"><span class="stat-val">' + azioniSett + '</span><span class="stat-eti">attività fatte</span></div>' +
    '<div class="stat"><span class="stat-val">' + attivi + '/7</span><span class="stat-eti">giorni attivi</span></div>' +
    '</div>' +
    '<label class="campo" for="w-vittorie">Cosa ha funzionato questa settimana</label><textarea id="w-vittorie">' + (rev ? esc(rev.vittorie || '') : '') + '</textarea>' +
    /* La review della settimana parla di quello che si è RIPETUTO: la riga
       che ne nasce lo dice, e vale più di un'osservazione di un giorno. */
    '<button class="btn btn-mini" id="w-vitt-lez" hidden>' + ICO('funziona', 15) + ' Salvala fra le Scoperte</button>' +
    '<label class="campo" for="w-blocchi">Cosa ti ha bloccato</label><textarea id="w-blocchi">' + (rev ? esc(rev.blocchi || '') : '') + '</textarea>' +
    '<button class="btn btn-mini" id="w-blocchi-lez" hidden>' + ICO('nonFunziona', 15) + ' Salvali fra le Scoperte</button>' +
    '<label class="campo" for="w-imparato">Cosa hai imparato</label><textarea id="w-imparato">' + (rev ? esc(rev.imparato || '') : '') + '</textarea>' +
    '<label class="campo" for="w-prossima">Cosa cambierai la prossima settimana</label><textarea id="w-prossima">' + (rev ? esc(rev.prossima || '') : '') + '</textarea>' +
    '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="btn-salva-sett">' + ICO('save', 15) + (rev ? ' Aggiorna' : ' Salva') + ' <small>+' + LM.XP_EVENTI.reviewSettimana + ' XP</small></button>' +
    '<button class="btn btn-ghost" data-vai="esperimenti">' + ICO('flask', 15) + ' Apri le Scoperte</button></div>' +
    '</div>';

  collegaTenutaLezione(corpo, 'w-vittorie', 'w-vitt-lez', 'si', 'ripetuto');
  collegaTenutaLezione(corpo, 'w-blocchi', 'w-blocchi-lez', 'no', 'ripetuto');

  presa(document.getElementById('btn-salva-sett')).addEventListener('click', function () {
    var xp = LM.salvaReviewSettimana({
      vittorie: presa(campoId('w-vittorie')).value.trim(),
      blocchi: presa(campoId('w-blocchi')).value.trim(),
      imparato: presa(campoId('w-imparato')).value.trim(),
      prossima: presa(campoId('w-prossima')).value.trim()
    });
    toast('Review salvata', xp, 'calendar');
    if (xp) { festa(); schermo.ritualiAperti = null; location.hash = '#/oggi'; }
    render();
  });
  corpo.querySelectorAll<HTMLElement>('[data-vai]').forEach(function (b) {
    b.addEventListener('click', function () { location.hash = '#/' + b.getAttribute('data-vai'); });
  });
}

/* lo stato di questa schermata vive in `schermo.att`, in cima al file:
   qui c'è solo il nome corto con cui lo chiamano le righe qui sotto — è lo
   stesso oggetto, non una copia. */
const att = schermo.att;

/* ============================================================
   VISTA: ATTIVITÀ
   Rifatta partendo da cosa si viene a fare qui, non da cosa si può
   mostrare. I lavori sono due: svuotare la coda delle note appena
   catturate, e scegliere cosa fare da una lista. Tutto il resto — le
   scadenze, i progetti, le aree — non è un altro posto: è un modo di
   guardare la stessa lista.

   Com'era: quattro linguette, di cui due («In arrivo», «Progetti») erano
   sottoinsiemi della terza disegnati da funzioni diverse, con impaginati
   diversi. Dentro, altri cinque modi di tagliare la stessa lista:
   pastiglie delle aree, un interruttore per le aree vuote, la ricerca,
   tre fasce di importanza, due tasti «mostra il resto». Fino a diciotto
   comandi prima di vedere un'attività. E la stessa riga aveva tre
   densità diverse a seconda della fascia, con una striscia di colore sul
   fianco che ripeteva un'informazione già data dall'icona.

   Com'è: due destinazioni e UNA fila di filtri, dove «Con una data» e
   «Progetti» stanno accanto alle aree. Una sola riga, uguale in ogni
   elenco dell'app: comando a sinistra, titolo, valore a destra,
   freccina. Toccando la riga si apre la sua scheda, che è l'unico posto
   dove si sistemano le cose (giorno, scadenza, passi, area, nome).
   ============================================================ */


/* ============================================================
   GLI AIUTANTI DI ATTIVITÀ.

   Stavano dentro alla vecchia `vistaInbox` per abitudine, non per
   necessità: nessuno di loro chiude su qualcosa di quella chiamata. Sono
   usciti perché li chiama il componente, e `attRigaHtml` deve produrre la
   stessa identica riga di prima: l'unico modo di esserne certi è che sia la
   stessa funzione invece di una copia.
   ============================================================ */
/* ---------- Da fare: una lista, una fila di filtri ---------- */
/* quante ne mostra il gruppo «Altre» prima di chiedere se vuoi le altre */
export const MURO = 12;

/* Le opzioni compaiono mentre scrivi, su una riga sola: prima c'era
   «QUANDO?» sopra le pastiglie e «in» davanti all'area — due etichette
   per due cose che si capiscono da sole. */

export function opzDaFare() {
  var oggiK = LM.todayKey();
  return '<button type="button" class="q-chip" data-nuovoq="' + oggiK + '">Oggi</button>' +
    '<button type="button" class="q-chip" data-nuovoq="' + LM.addDays(oggiK, 1) + '">Domani</button>' +
    '<button type="button" class="q-chip on" data-nuovoq="">Senza data</button>' +
    selectAree('agg-bk-area', areaFiltro() || areaNuova(), 'Area', 'agg-sel-area');
}

export function wireAggiunta(box: HTMLElement): void {
  wireRigaAggiunta(box, 'agg-bk', function (v, opz) {
    var sel = opz.querySelector<HTMLElement>('[data-nuovoq].on');
    /* i tre valori li scrive `opzDaFare`: oggi, domani, o vuoto */
    const quando = sel ? sel.getAttribute('data-nuovoq') || '' : '';
    var selArea = opz.querySelector<HTMLSelectElement>('#agg-bk-area');
    var nb = LM.aggiungiBacklog(v, selArea ? selArea.value : 'altro');
    if (quando) {
      const g = comeGiorno(quando);
      LM.backlogInOggi(nb.id, g);
      toast('«' + v + '» messa ' + etichettaGiorno(g).toLowerCase() + '.', 0, 'calendar');
    } else {
      toast('«' + v + '» aggiunta a «Da fare».', 0, 'lista');
    }
    opz.querySelectorAll<HTMLElement>('[data-nuovoq]').forEach(function (c) { c.classList.toggle('on', !c.getAttribute('data-nuovoq')); });
    aggiornaNav(); render();
  });
}

/* i due filtri che non sono aree */
export function areaFiltro() { return (att.area === 'tutte' || att.area === 'data' || att.area === 'progetti') ? null : att.area; }
export function passaFiltro(b: Attivita): boolean {
  if (att.area === 'data') return !!b.scadenza;
  if (att.area === 'progetti') return !!(b.steps && b.steps.length);
  return true;
}
export function nomeFiltro() {
  if (att.area === 'data') return 'Con una data';
  if (att.area === 'progetti') return 'Progetti';
  if (att.area === 'tutte') return 'Tutte';
  return areaById(att.area).nome;
}

/* «DA FARE» LO DISEGNA IL COMPONENTE, e qui non c'è più.

   C'era `disegnaDaFare(box)`: centosessantaquattro righe che costruivano a
   mano la barra, il pannello dei filtri, i tre gruppi e i loro fili. Le
   stesse cose le fa `schermi/Attivita.tsx`, che chiama da qui gli aiutanti
   veri — `attRigaHtml` per le righe, `opzDaFare` e `wireAggiunta` per la
   riga d'aggiunta, `areaFiltro`/`passaFiltro`/`nomeFiltro` per il filtro —
   e disegna la struttura per conto suo. Tenere anche l'altra versione
   voleva dire due sorgenti per la stessa schermata, che è il difetto da cui
   viene tutto questo lavoro.

   Con lei è sparito `ridisegnaAtt`, il gancio che puntava «a chi sta
   disegnando in questo momento»: adesso chi disegna è React, `LM.save()`
   manda `lm:change` e il ridisegno arriva da sé. Dove il gancio si chiamava
   per una cosa che i dati non toccano — il titolo del pannello appena
   cambiato a mano — si chiama `render()`. */

/* ---------- la riga, una sola in tutta l'app ----------
   comando a sinistra, titolo (più una riga sotto solo se ha qualcosa da
   dire), valore a destra, freccina. Niente tre densità, niente striscia
   di colore sul fianco: l'area la dice la sua icona davanti al titolo. */
export function attRigaHtml(b: Attivita, opts?: OpzRigaAtt): string {
  var isProg = !!(b.steps && b.steps.length);
  var av = isProg ? LM.avanzamentoProgetto(b) : null;
  var ar = areaById(b.areaId);
  var inAgenda = LM.snapshot().azioni.filter(function (a) {
    return !a.done && a.data >= LM.todayKey() && (isProg ? (a.passoDi && a.passoDi.b === b.id) : a.passoDi === null && a.testo === b.testo);
  }).sort(function (x, y) { return x.data < y.data ? -1 : 1; });

  var sotto = [];
  if (b.scadenza) {
    var si = scadInfo(b.scadenza);
    sotto.push('<span class="sub-scad ' + si.cls + '">' + (si.d < 0 ? 'scaduta ' + si.testo : 'scade ' + si.testo) + '</span>');
  }
  if (inAgenda.length) {
    sotto.push('<span class="sub-agenda">' + (isProg && inAgenda.length > 1
      ? inAgenda.length + ' passi in agenda'
      /* `inAgenda.length` è > 0: il ramo è dentro il suo controllo */
      : 'in agenda ' + etichettaGiorno(presa(inAgenda[0]).data).toLowerCase()) + '</span>');
  }
  /* il motivo si scrive solo se dice qualcosa che la riga non dice già:
     «iniziata, 1 di 3» accanto a «1 di 3» in coda è la stessa cosa due volte */
  if (!sotto.length && opts && opts.motivo && !isProg && !(opts.da === 'scadenza' && b.scadenza)) {
    sotto.push('<span>' + esc(opts.motivo) + '</span>');
  }

  var pieno = !!(opts && opts.primo);
  /* «PORTA IN OGGI» NON È UNA SPUNTA. Stava a sinistra, quadrato, dove
     in ogni app c'è la casella per segnare fatto, e tutti lo prendevano per
     quella. Adesso è una pastiglia con scritto «Oggi», a destra, prima della
     freccia: dice cosa fa. */
  var vaOggi = '<button class="va-oggi' + (pieno ? ' piena' : '') + '" data-bkoggi="' + b.id + '"' +
    ' aria-label="' + (isProg ? 'Porta in Oggi il prossimo passo di ' : 'Porta in Oggi ') + esc(b.testo) + '">' +
    ICO('plus', 13) + '<span>Oggi</span></button>';
  return '<div class="lista-riga att-riga' + (b.mancata ? ' mancata-riga' : '') + '" data-bid="' + b.id + '">' +
    '<button class="lista-apri" data-bkapri="' + b.id + '" aria-label="Apri ' + esc(b.testo) + '">' +
    '<span class="lista-corpo">' +
    '<span class="lista-tit">' +
    (b.pin ? '<span class="tit-pin" title="Tenuta in cima">' + ICO('pin', 11) + '</span>' : '') +
    segnoArea(ar, 13, 'tit-area') +
    esc(b.testo) + '</span>' +
    (sotto.length ? '<span class="lista-sub">' + sotto.join(' · ') + '</span>' : '') +
    '</span>' +
    /* `av` c'è esattamente quando `isProg`: le due nascono dalla stessa riga */
    (isProg && av ? '<span class="lista-val">' + av.fatti + ' di ' + av.tot + '</span>' : '') +
    '</button>' + vaOggi +
    '</div>';
}

export function wireLista(scope: ParentNode): void {
  scope.querySelectorAll<HTMLElement>('[data-bkoggi]').forEach(function (t) {
    t.addEventListener('click', function () {
      const id = t.getAttribute('data-bkoggi') || '';
      var it = LM.load().backlog.find(function (x) { return x.id === id; });
      if (!it) return;
      if (it.steps && it.steps.length) {
        var passo = LM.prossimoPassoInOggi(id);
        toast(passo ? 'Prossimo passo portato in Oggi.' : 'Nessun passo da fare: sono tutti in agenda o completati.', 0, passo ? 'arrowRight' : 'check');
      } else {
        LM.backlogInOggi(id);
        toast('Aggiunta a Oggi.', 0, 'arrowRight');
      }
      aggiornaNav(); render();
    });
  });
  scope.querySelectorAll<HTMLElement>('[data-bkapri]').forEach(function (t) {
    t.addEventListener('click', function () {
      var it = LM.load().backlog.find(function (x) { return x.id === t.getAttribute('data-bkapri'); });
      if (it) apriScheda(it.id);
    });
  });
}

/* ---------- la scheda di un'attività ----------
   L'unico posto dove si sistema una cosa. Prima erano quattro cassetti
   grigi dentro il foglio, ognuno col titolo in maiuscolo DENTRO la
   scatola e una freccina: scatole dentro scatole, e per dare un giorno
   tre modi diversi nello stesso cassetto. Adesso è piatta: le sezioni
   sono etichette sopra il gruppo, come negli elenchi di iOS, e si
   scorre invece di aprire. */
export function apriScheda(id: string): void {
  function trova() { return LM.load().backlog.find(function (x) { return x.id === id; }); }
  var b = trova();
  if (!b) return;
  apriFoglio(b.testo, 'scheda', { id: id });
  titoloSheetModificabile(b.testo, function (v) { LM.modificaBacklog(id, v); render(); });
}

/* Quando fare UN passo: gli stessi tasti-giorno della scheda. */
export function apriQuandoPasso(prog: Attivita, passo: Passo): void {
  apriFoglio(passo.testo, 'quando-passo', { prog: prog, passo: passo });
}

/* Da cosa-da-fare a abitudine: si scelgono i giorni e (se serve) l'ora. */
export function apriDaAbitudine(b: Attivita): void {
  apriFoglio(b.testo, 'da-abitudine', { id: b.id });
}

/* ============================================================
   COSA FUNZIONA PER ME (senza esperimento)
   ============================================================

   Perché esiste. L'esperimento N-of-1 è la cosa giusta e nessuno la fa: due
   settimane di base, due di intervento, e intanto le cose che uno capisce su
   di sé arrivano ogni giorno — «in biblioteca studio, in camera no», «se dico
   "dopo" senza scrivere quando, non lo faccio più». Se l'unico posto dove
   metterle è un esperimento, non le scrive nessuno e a fine mese sono
   sparite. Qui una riga basta.

   Le tre scelte di questa schermata, e il perché:

   · DUE MUCCHI, non un voto. «Mi funziona» / «Non mi funziona» è il verdetto
     che uno ha già in testa quando apre l'app; una scala da 1 a 5 sarebbe una
     domanda in più a cui rispondere, e su una cosa che non è una misura.

   · COME FAI A SAPERLO, scritto accanto. La pagina della scienza etichetta
     ogni studio (alta / media / euristica): la stessa onestà applicata a te.
     Serve a chi vuole essere preciso: senza quell'etichetta, scrivere «mi
     funziona» dopo averlo visto UNA volta sembra un'affermazione più grossa
     di quella che è, e allora chi tiene alla precisione non scrive niente.
     Tre gradini e non cinque: notato una volta, lo noto ogni volta, misurato.

   · SI GIRA. Una cosa che funzionava smette di funzionare, e succede spesso:
     il tasto a sinistra della riga sposta la riga nell'altro mucchio senza
     aprire niente. Senza quello, l'unica strada era cancellare e riscrivere,
     cioè perdere che una volta funzionava. */

var LEZ_VERSI = {
  si: { ico: 'funziona', eti: 'Funziona', breve: 'Funziona' },
  no: { ico: 'nonFunziona', eti: 'Non funziona', breve: 'Non funziona' }
};

/* l'area è FACOLTATIVA: «le liste lunghissime mi bloccano» non è di
   un'area, è di te. Il selettore normale non ha il posto per dire «nessuna». */
export function selectAreeOpz(id: string, selezionata?: string | null, cls?: string): string {
  return '<select id="' + id + '"' + (cls ? ' class="' + cls + '"' : '') + ' aria-label="Area">' +
    '<option value=""' + (selezionata ? '' : ' selected') + '>nessuna in particolare</option>' +
    areeAttive().map(function (a) {
      return '<option value="' + a.id + '"' + (a.id === selezionata ? ' selected' : '') + '>' + esc(a.nome) + '</option>';
    }).join('') + '</select>';
}

function rigaLezioneHtml(l: Lezione): string {
  var v = LEZ_VERSI[l.verso] || LEZ_VERSI.si;
  var altro = l.verso === 'si' ? LEZ_VERSI.no : LEZ_VERSI.si;
  var ar = l.areaId ? areaById(l.areaId) : null;
  var sotto = [LM.forzaLezione(l.forza).eti];
  if (l.espId) {
    var e = LM.load().esperimenti.find(function (x) { return x.id === l.espId; });
    if (e) sotto[0] = 'misurato con «' + esc(e.nome) + '»';
  }
  return '<div class="lista-riga lez-riga" data-lid="' + l.id + '">' +
    '<button class="lista-azione lez-verso lez-' + l.verso + '" data-lezgira="' + l.id + '"' +
    ' title="Spostala in «' + altro.breve + '»"' +
    ' aria-label="«' + esc(l.testo) + '»: spostala in «' + altro.breve + '»">' +
    ICO(v.ico, 15) + '</button>' +
    '<button class="lista-apri" data-lezapri="' + l.id + '" aria-label="Apri «' + esc(l.testo) + '»">' +
    '<span class="lista-corpo">' +
    '<span class="lista-tit">' + esc(l.testo) + '</span>' +
    '<span class="lista-sub">' + (ar ? segnoArea(ar, 13) + ' ' + esc(ar.nome) + ' · ' : '') + sotto.join(' · ') + '</span>' +
    '</span><span class="lista-chev">' + ICO('chevronGiu', 15) + '</span></button>' +
    '</div>';
}

function bloccoLezioniHtml() {
  var si = LM.lezioni('si'), no = LM.lezioni('no');
  /* NIENTE PARAGRAFO SOTTO IL TITOLO. Ce n'era uno di quattro righe che
     spiegava perché il registro esiste e cosa vuol dire l'etichetta accanto a
     ogni riga. Sotto c'erano già: il campo con scritto cosa scriverci, i due
     tasti «funziona / non funziona» e i due mucchi con il loro nome. Se la
     spiegazione serve, il comando è scritto male; e questa era una
     spiegazione che si legge una volta e poi resta lì per sempre, in cima
     alla cosa che si usa ogni giorno. L'esempio invece resta finché i mucchi
     sono vuoti — là non c'è niente da guardare, e serve capire che tipo di
     frase ci va. */
  return '<div class="card lez-card">' +
    rigaAggiunta('agg-lez', 'Aggiungi una scoperta…',
      '<div class="q-chips lez-scelta-verso">' +
      '<button type="button" class="q-chip on" data-verso="si">' + ICO('funziona', 13) + ' Funziona</button>' +
      '<button type="button" class="q-chip" data-verso="no">' + ICO('nonFunziona', 13) + ' Non funziona</button>' +
      '</div>' +
      '<label class="agg-area"><span class="agg-eti">in</span>' + selectAreeOpz('agg-lez-area', null) + '</label>') +
    (si.length
      ? etichetta('Funziona', 'funziona', si.length) +
        '<div class="lista">' + si.map(rigaLezioneHtml).join('') + '</div>'
      : '') +
    (no.length
      ? etichetta('Non funziona', 'nonFunziona', no.length) +
        '<div class="lista">' + no.map(rigaLezioneHtml).join('') + '</div>'
      : '') +
    '</div>';
}

/* IL RIQUADRO SI RIFÀ DA SÉ, non tutta la pagina. Un `render()` intero qui
   avrebbe due difetti: butta via il campo in cui si sta scrivendo (e chi
   butta giù una riga spesso ne butta giù tre di fila) e fa ripartire i
   grafici degli esperimenti sotto, che non c'entrano niente. */
export function ridisegnaLezioni(tornaNelCampo?: boolean): void {
  var vecchia = document.querySelector<HTMLElement>('.lez-card');
  if (!vecchia || !vecchia.parentNode) { render(); return; }
  var tmp = document.createElement('div');
  tmp.innerHTML = bloccoLezioniHtml();
  /* `bloccoLezioniHtml` scrive un `div` e uno solo: il figlio c'è */
  const nuova = presa(tmp.firstElementChild) as HTMLElement;
  vecchia.parentNode.replaceChild(nuova, vecchia);
  wireLezioni(nuova);
  if (tornaNelCampo) {
    var inp = nuova.querySelector<HTMLElement>('#agg-lez .agg-testo');
    if (inp) inp.focus();
  }
}

function wireLezioni(scope: HTMLElement): void {
  wireRigaAggiunta(scope, 'agg-lez', function (testo, opz) {
    var sceltoVerso = opz ? opz.querySelector<HTMLElement>('.lez-scelta-verso .q-chip.on') : null;
    /* i due valori li scrive la riga di opzioni qui accanto: 'si' o 'no' */
    const verso: Verso = sceltoVerso && sceltoVerso.getAttribute('data-verso') === 'no' ? 'no' : 'si';
    var sel = opz ? opz.querySelector<HTMLSelectElement>('#agg-lez-area') : null;
    LM.aggiungiLezione(testo, verso, { areaId: sel ? sel.value : null, forza: 'notato' });
    /* il messaggio dice in quale mucchio è finita: la scelta sta in una riga
       di opzioni che si apre scrivendo, e chi non l'ha guardata deve poter
       accorgersi qui che è andata dove non voleva */
    toast(verso === 'si' ? 'Aggiunta in «Funziona».' : 'Aggiunta in «Non funziona».',
      0, verso === 'si' ? 'funziona' : 'nonFunziona');
    ridisegnaLezioni(true);
  });
  /* la scelta del verso nella riga di aggiunta */
  scope.querySelectorAll<HTMLElement>('.lez-scelta-verso .q-chip').forEach(function (b) {
    b.addEventListener('click', function () {
      presa(b.parentElement).querySelectorAll<HTMLElement>('.q-chip').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
    });
  });
  scope.querySelectorAll<HTMLElement>('[data-lezgira]').forEach(function (b) {
    b.addEventListener('click', function () {
      var l = LM.giraLezione(b.getAttribute('data-lezgira') || '');
      if (!l) return;
      toast(l.verso === 'si' ? 'Spostata in «Funziona».' : 'Spostata in «Non funziona».',
        0, l.verso === 'si' ? 'funziona' : 'nonFunziona');
      ridisegnaLezioni();
    });
  });
  scope.querySelectorAll<HTMLElement>('[data-lezapri]').forEach(function (b) {
    b.addEventListener('click', function () { apriLezione(b.getAttribute('data-lezapri') || ''); });
  });
}

/* la scheda di una cosa imparata: come per le attività, un posto solo dove
   si sistema tutto quello che c'è da sistemare */
export function apriLezione(id: string): void {
  if (!LM.trovaLezione(id)) return;
  apriFoglio('Una cosa che hai capito', 'lezione', { id: id }, false,
    { nome: 'Una cosa che hai capito', apri: function () { apriLezione(id); } });
}


/* ============================================================
   VISTA: ESPERIMENTI
   ============================================================ */

/* QUALE DELLE DUE SEZIONI È APERTA. Sta fuori dalla funzione perché deve
   sopravvivere a un ridisegno: la pagina si rifà da sé quando arriva la
   risposta dell'account o un aggiornamento dal cloud, e ritrovarsi
   riportati sull'altra sezione senza aver toccato niente è peggio del
   problema che questa divisione risolve. */


export function disegnaScoperte() {
  var s = LM.load();
  var c = document.getElementById('scop-corpo');
  if (!c) return;
  if (schermo.sezScoperte === 'registro') {
    c.innerHTML = bloccoLezioniHtml();
    wireLezioni(c);
    return;
  }
  /* con la lista vuota il pulsante sta una volta sola, dentro il riquadro
     che spiega cosa manca: due pulsanti uguali sulla stessa schermata
     sono due volte la stessa domanda */
  var vuota = !s.esperimenti.length;
  /* IL PARAGRAFO CHE È RIMASTO, e perché. Quasi tutti quelli sotto un titolo
     sono andati via: dicevano a parole quello che il comando sotto diceva
     già da sé. Questo no — un confronto A/B su una persona sola non si
     indovina guardando lo schermo, e senza sapere che i primi giorni servono
     come base di partenza non si capisce perché l'app chieda di aspettare.
     Riscritto in tre frasi invece di sei righe, e il limite del metodo sta
     dove serve leggerlo: sotto il verdetto, non prima di cominciare. */
  c.innerHTML = '<div class="card"><div class="sotto" style="margin:0">' +
    'Per prima cosa l’app misura come vanno le cose adesso, senza cambiare niente: è la <b>base di partenza</b>. Poi introduci la modifica e continua a misurare. La differenza fra i due periodi è la risposta.' +
    (vuota ? '' : '</div><div class="riga-flex mt-s"><button class="btn btn-mini" id="btn-nuovo-exp">' + ICO('plus', 15) + ' Nuovo esperimento</button></div>') +
    '</div>' +
    '<div id="form-exp-zona"></div><div class="griglia mt" id="lista-exp" style="gap:16px"></div>';

  var bNuovo = document.getElementById('btn-nuovo-exp');
  /* avvolto: `mostraFormExp` prende una riga imparata, non un evento */
  if (bNuovo) bNuovo.addEventListener('click', function () { mostraFormExp(); });

  const lista = perId('lista-exp');
  if (!s.esperimenti.length) {
    /* uno stato vuoto porta con sé la sua via d'uscita: il pulsante sta
       qui dentro, dove si sta guardando, non solo in cima alla pagina */
    lista.innerHTML = '<div class="card vuoto">' + illoFlask() + '<b>Non hai ancora nessun esperimento.</b><br>Qualche idea per iniziare: verificare se fare sport al mattino migliora il focus, se tenere il telefono in un’altra stanza aumenta i minuti di studio, o se andare a letto prima ti dà più energia.' +
      '<div class="vuoto-azione"><button class="btn btn-primario" id="btn-primo-exp">' + ICO('plus', 15) + ' Crea il primo esperimento</button></div></div>';
    var primo = document.getElementById('btn-primo-exp');
    if (primo) primo.addEventListener('click', function () { mostraFormExp(); });
  }
  s.esperimenti.forEach(function (e, i) {
    var ris = LM.risultatiEsperimento(e);
    var m = LM.METRICHE_ESPERIMENTO.find(function (x) { return x.id === e.metrica; });
    var card = document.createElement('div');
    card.className = 'card exp-card';
    card.style.setProperty('--i', String(i));
    var verdetto = '';
    if (ris.baseline.n > 1 && ris.intervento.n > 1 && ris.baseline.media !== null && ris.intervento.media !== null) {
      /* `media` è `null` solo con zero giorni misurati, e qui i giorni sono
         più di uno per fase: il controllo qui sopra è per il tipo. */
      var diff = ris.intervento.media - ris.baseline.media;
      var dEff = ris.effetto;
      var forza = dEff === null ? '' : (Math.abs(dEff) < 0.2 ? 'trascurabile' : Math.abs(dEff) < 0.5 ? 'piccola' : Math.abs(dEff) < 0.8 ? 'media' : 'grande');
      verdetto = '<div class="exp-verdetto">' + ICO('confronto', 15) +
        '<span>Nella fase iniziale la media era <b>' + LMCharts.fmtNum(ris.baseline.media) + '</b> (su ' + ris.baseline.n + ' giorni); dopo la modifica è <b>' + LMCharts.fmtNum(ris.intervento.media) + '</b> (su ' + ris.intervento.n + ' giorni), con una differenza di <b>' + (diff > 0 ? '+' : '') + LMCharts.fmtNum(diff) + '</b>' +
        (dEff !== null ? '. L’entità del cambiamento è <b>' + forza + '</b>' : '') + '.' +
        '<br><small>È un indizio utile, non una prova definitiva: se il risultato ti interessa, ripeti l’esperimento per confermarlo.</small></span></div>' +
        /* IL RISULTATO DIVENTA UNA RIGA. Un esperimento che finisce e resta
           un grafico non serve a niente il mese dopo: quello che uno vuole
           ritrovare è la frase, con scritto che quella l'ha misurata. Se
           l'esperimento è nato da una riga, questo tasto aggiorna QUELLA
           invece di scriverne una seconda uguale. */
        '<div class="riga-flex mt-s"><button class="btn btn-mini" data-expsalva="' + e.id + '">' +
        ICO(diff > 0 ? 'funziona' : 'nonFunziona', 15) + ' ' +
        (lezDi(e) ? 'Aggiorna la riga: adesso è misurata' : (diff > 0 ? 'Salvala in «Funziona»' : 'Salvala in «Non funziona»')) +
        '</button></div>';
    } else {
      verdetto = '<div class="exp-verdetto">' + ICO('attesa', 15) + '<span>Non ci sono ancora abbastanza dati: servono almeno due giorni con una misura in ciascuna fase. Continua a fare i check-in.</span></div>';
    }
    card.innerHTML = '<div class="exp-testa"><h2>' + esc(e.nome) + '</h2>' +
      '<span class="chip">' + (e.stato === 'attivo' ? '<span class="punto-vivo"></span> attivo' : ICO('concluso', 13) + ' concluso') + '</span>' +
      '<span class="chip">' + esc(m ? m.nome : e.metrica) + (e.areaId ? ' · ' + esc(areaById(e.areaId).nome) : '') + '</span></div>' +
      /* «Intervento» era la parola del metodo, non quella del modulo: nel
         modulo il campo si chiama «La modifica che vuoi testare», e la
         scheda lo chiamava con un altro nome. */
      (e.intervento ? '<div class="sotto" style="margin:0">La modifica: ' + esc(e.intervento) + '</div>' : '') +
      '<div id="exp-chart-' + i + '"></div>' + verdetto;
    lista.appendChild(card);
    var bSalva = card.querySelector<HTMLElement>('[data-expsalva]');
    if (bSalva) bSalva.addEventListener('click', function () { salvaEsitoInLezione(e, ris); });
    LMCharts.experiment(perId('exp-chart-' + i), ris, {
      label: 'Esperimento ' + e.nome,
      max: (m && m.fonte !== 'minuti' && m.fonte !== 'xp') ? 5 : undefined,
      ticks: (m && m.fonte !== 'minuti' && m.fonte !== 'xp') ? [1, 3, 5] : undefined,
      min: 0
    });
  });

  /* IL MODULO SOPRAVVIVE A UN RIDISEGNO, e non è un lusso: la pagina si
     ridisegna da sé quando arriva la risposta dell'account, quando il cloud
     porta un aggiornamento, quando la rete cade. Prima il modulo stava solo
     nel DOM, quindi uno che aveva scritto mezza domanda se la vedeva sparire
     senza aver toccato niente — e la stessa cosa faceva sparire il modulo già
     compilato che si apre da una riga imparata (trovato da prove/lezioni.js,
     che gira senza cloud e quindi riceve subito «account non disponibile»).
     Adesso quello che c'è scritto vive in `formExp`, e il disegno lo rimette. */
  function mostraFormExp(daLezione?: Lezione | null): void {
    const forseZona = document.getElementById('form-exp-zona');
    if (!forseZona) return;
    const zona = forseZona;
    /* la riga da cui parte, se parte da una riga: il nome è la domanda,
       l'intervento è la cosa stessa */
    const pre: ModuloEsperimento = daLezione && daLezione.testo
      ? { nome: '«' + daLezione.testo + '»: è vero?', int: daLezione.testo, area: daLezione.areaId || '',
          metrica: '', durata: '', lez: daLezione.id }
      : (schermo.formExp || { nome: '', int: '', area: '', metrica: '', durata: '', lez: null });
    schermo.formExp = { nome: pre.nome, int: pre.int, area: pre.area, metrica: pre.metrica, durata: pre.durata, lez: pre.lez };
    zona.innerHTML = '<div class="card mt">' +
      '<h2>Nuovo esperimento</h2>' +
      '<label class="campo" for="exp-nome">Cosa vuoi scoprire</label><input type="text" id="exp-nome" value="' + esc(pre.nome) + '" placeholder="Es. studiare in biblioteca mi fa studiare di più?">' +
      '<label class="campo" for="exp-int">La modifica che vuoi testare</label><input type="text" id="exp-int" value="' + esc(pre.int) + '" placeholder="Es. ogni pomeriggio studio in biblioteca invece che in camera">' +
      '<div class="griglia griglia-3 mt-s"><div><label class="campo" for="exp-metrica">Cosa misuri</label><select id="exp-metrica">' +
      LM.METRICHE_ESPERIMENTO.map(function (m2) { return '<option value="' + m2.id + '">' + esc(m2.nome) + '</option>'; }).join('') +
      '</select></div>' +
      '<div><label class="campo" for="exp-area">Area (se serve)</label>' + selectAree('exp-area') + '</div>' +
      '<div><label class="campo" for="exp-durata">Durata</label><select id="exp-durata">' +
      '<option value="7-14">7 giorni di base, 14 di test</option>' +
      '<option value="14-14" selected>14 giorni di base, 14 di test</option>' +
      '<option value="14-21">14 giorni di base, 21 di test</option>' +
      '</select></div></div>' +
      '<div class="riga-flex mt"><button class="btn btn-primario" id="exp-crea">' + ICO('flask', 15) + ' Avvia</button>' +
      '<button class="btn btn-ghost" id="exp-annulla">Annulla</button></div></div>';
    presa(document.getElementById('exp-annulla')).addEventListener('click', function () {
      schermo.formExp = null; zona.innerHTML = '';
    });
    /* i valori scelti si rimettono dopo, non nell'HTML: un `selected` da
       costruire dentro tre `map` diversi è tre posti dove sbagliarsi. I
       cinque nodi li ha appena scritti la riga qui sopra: `dentro` li
       prende dalla zona del modulo, non da tutta la pagina. */
    const dentro = function (id: string): HTMLInputElement | HTMLSelectElement {
      return presa(zona.querySelector<HTMLInputElement | HTMLSelectElement>('#' + id));
    };
    if (pre.area) dentro('exp-area').value = pre.area;
    if (pre.metrica) dentro('exp-metrica').value = pre.metrica;
    if (pre.durata) dentro('exp-durata').value = pre.durata;
    /* quello che si scrive resta scritto anche se la pagina si ridisegna */
    const tieni = function (id: string, chiave: keyof ModuloEsperimento): void {
      const el = dentro(id);
      const scrivi = function () { if (schermo.formExp) schermo.formExp[chiave] = el.value; };
      el.addEventListener('input', scrivi);
      el.addEventListener('change', scrivi);
    };
    tieni('exp-nome', 'nome'); tieni('exp-int', 'int');
    tieni('exp-metrica', 'metrica'); tieni('exp-area', 'area'); tieni('exp-durata', 'durata');
    zona.scrollIntoView({ block: 'nearest' });
    const primo = dentro('exp-nome');
    if (!pre.nome && !daLezione) primo.focus();
    dentro('exp-crea').addEventListener('click', function () {
      var nome = dentro('exp-nome').value.trim();
      if (!nome) { toast('Scrivi il nome dell’esperimento.', 0, 'flask'); return; }
      /* «14-14»: giorni di base e giorni di test */
      const dur = dentro('exp-durata').value.split('-');
      var t = LM.todayKey();
      LM.creaEsperimento({
        nome: nome,
        intervento: dentro('exp-int').value.trim(),
        metrica: dentro('exp-metrica').value,
        areaId: dentro('exp-area').value,
        inizioBaseline: LM.addDays(t, -(+(dur[0] || 14))),
        inizioIntervento: t,
        fine: LM.addDays(t, +(dur[1] || 14)),
        lezioneId: pre.lez
      });
      schermo.formExp = null;
      toast('Esperimento avviato.', 0, 'flask');
      render();
    });
  }
  /* chi è arrivato qui da una riga imparata trova il modulo già aperto e
     già scritto; chi lo aveva aperto e stava scrivendo lo ritrova com'era */
  if (schermo.lezDaProvare) { var daQui = schermo.lezDaProvare; schermo.lezDaProvare = null; mostraFormExp(daQui); }
  else if (schermo.formExp) mostraFormExp();
}

/* la riga imparata da cui è nato un esperimento, se c'è ancora */
function lezDi(e: Esperimento): Lezione | null {
  return e.lezioneId ? LM.trovaLezione(e.lezioneId) : null;
}

/* IL RISULTATO DI UN ESPERIMENTO, MESSO IN UNA RIGA. Tutte le metriche di
   questa app sono «più è meglio» (focus, energia, umore, voto, minuti, XP),
   quindi il verso lo decide il segno della differenza. */
function salvaEsitoInLezione(e: Esperimento, ris: EsitoProva): void {
  /* il tasto che porta qui compare solo con un verdetto in mano, e il
     verdetto ha bisogno di due medie: qui ci sono */
  var diff = (ris.intervento.media ?? 0) - (ris.baseline.media ?? 0);
  const verso: Verso = diff > 0 ? 'si' : 'no';
  var testo = e.intervento || e.nome;
  var l = lezDi(e);
  if (l) {
    LM.modificaLezione(l.id, { verso: verso, forza: 'misurato', espId: e.id });
    toast('Scoperta aggiornata.', 0, verso === 'si' ? 'funziona' : 'nonFunziona');
  } else {
    var nuova = LM.aggiungiLezione(testo, verso, { forza: 'misurato', areaId: e.areaId, espId: e.id });
    if (nuova) LM.creaLegameEsperimento(e.id, nuova.id);
    toast(verso === 'si' ? 'Salvata in «Funziona», con l’etichetta «misurato».'
      : 'Salvata in «Non funziona», con l’etichetta «misurato».',
      0, verso === 'si' ? 'funziona' : 'nonFunziona');
  }
  render();
}

/* ============================================================
   VISTA: SCIENZA
   ============================================================ */

/* UN PRINCIPIO su cui è costruita l'app: cosa dice, quanto è solido, dove
   si vede nell'app, e da dove viene. `evidenza` sono tre gradi e non un
   testo libero: la schermata li colora. */
export interface Principio {
  titolo: string;
  /* tre gradi, e la parola è quella che si legge in pagina: `alta` è
     meta-analisi o studi clinici controllati, `media` studi solidi ma non
     conclusivi, `euristica` pratica clinica ragionevole e non dimostrata.
     Non è `bassa`: «bassa evidenza» suona come «probabilmente falso», e
     una pratica sensata non ancora misurata è un'altra cosa. */
  evidenza: 'alta' | 'media' | 'euristica';
  claim: string;
  uso: string;
  fonti: string;
}
export const PRINCIPI: Principio[] = [
  {
    titolo: 'Cattura istantanea',
    evidenza: 'alta',
    claim: 'Nell’ADHD i pensieri arrivano di continuo e la memoria di lavoro ha una capacità limitata. Annotarli subito da qualche parte libera attenzione per il compito in corso e riduce l’ansia di doverli ricordare.',
    uso: 'Il tasto + è in ogni schermata (da tastiera, C oppure ⌘K): un solo campo, nessuna categoria da scegliere mentre annoti. Cosa farne lo decidi dopo, in Attività → Da sistemare.',
    fonti: 'Knouse & Safren (2010), Clinical Psychology Review — la CBT per ADHD adulto prescrive sistemi esterni di cattura · Risko & Gilbert (2016), Trends in Cognitive Sciences — cognitive offloading.'
  },
  {
    titolo: 'Una sola prossima azione',
    evidenza: 'media',
    claim: 'Quando le risorse di autocontrollo sono limitate, ogni scelta in più ha un costo e aumenta la probabilità di distrarsi. Mostrare una sola opzione riduce il rischio di bloccarsi davanti a troppe possibilità.',
    uso: 'La schermata «Adesso» mostra una sola azione. Le altre di oggi restano a un tocco di distanza, e con «Più tardi» passi alla successiva senza nessuna penalità.',
    fonti: 'Barkley (1997), Psychological Bulletin — ADHD come deficit di inibizione/funzioni esecutive · Iyengar & Lepper (2000), JPSP — il sovraccarico di scelta riduce l’azione.'
  },
  {
    titolo: 'Intenzioni «Se… allora…» (implementation intentions)',
    evidenza: 'alta',
    claim: 'Legare l’azione a un segnale concreto («se sono alla scrivania alle 9, allora…») quasi raddoppia la probabilità di eseguirla: l’avvio diventa automatico invece che affidato alla volontà.',
    uso: 'Il piano del mattino chiede una sola intenzione «se… allora…», collegata all’azione più importante, che poi ricompare nella schermata «Adesso».',
    fonti: 'Gollwitzer & Sheeran (2006), Advances in Experimental Social Psychology — meta-analisi, 94 studi, effetto medio-grande (d≈0.65) · Gawrilow & Gollwitzer (2008) — efficacia specifica in ADHD.'
  },
  {
    titolo: 'Auto-monitoraggio con feedback visivo',
    evidenza: 'alta',
    claim: 'Monitorare il progresso verso un obiettivo aumenta di per sé la probabilità di raggiungerlo, e l’effetto cresce se il progresso è registrato e reso visibile.',
    uso: 'Il check-in da dieci secondi, la mappa della costanza e i mini-grafici per ogni area ti fanno rivedere tutto quello che registri.',
    fonti: 'Harkin et al. (2016), Psychological Bulletin — meta-analisi di 138 RCT: monitorare il progresso migliora il goal attainment · Korotitsch & Nelson-Gray (1999) — reattività dell’auto-monitoraggio.'
  },
  {
    titolo: 'Ricompense immediate (XP a ogni micro-azione)',
    evidenza: 'media',
    claim: 'Nell’ADHD le ricompense lontane nel tempo perdono valore più in fretta: una ricompensa immediata motiva molto più di una futura. Per questo l’app dà un riscontro subito, a ogni piccolo passo.',
    uso: 'XP immediati con un riscontro visivo per ogni azione: annotare un pensiero (+1), fare un check-in (+3), completare un’azione (+10), completare quella più importante (+15). I punti di ogni giorno disegnano la mappa della costanza, in Andamento.',
    fonti: 'Jackson & MacKillop (2016), J. of Attention Disorders — meta-analisi: maggiore delay discounting in ADHD · Sonuga-Barke (2003) — delay aversion · Hamari et al. (2014); Sailer & Homner (2020), Educational Psychology Review — la gamification funziona, ma dipende dal design.'
  },
  {
    titolo: 'La serie non punisce mai',
    evidenza: 'media',
    claim: 'Perdere una serie lunga a causa di un solo giorno storto scoraggia molto, soprattutto chi fa già fatica a essere costante. Dopo un errore, criticarsi si associa a più procrastinazione; trattarsi con indulgenza si associa invece alla ripresa.',
    uso: 'Un giorno saltato da solo non azzera la serie: servono due giorni vuoti di fila. E al mattino il conteggio parte da ieri, finché non registri qualcosa oggi, così non ti scoraggia troppo presto.',
    fonti: 'Wohl, Pychyl & Bennett (2010), Personality and Individual Differences — perdonarsi riduce la procrastinazione futura · Breines & Chen (2012), Pers Soc Psychol Bull — self-compassion aumenta la motivazione al miglioramento.'
  },
  {
    titolo: 'Rituali con orario: struttura esterna',
    evidenza: 'alta',
    claim: 'I trattamenti non farmacologici per ADHD adulto che reggono ai trial hanno un tratto comune: routine esterne brevi e ripetute (pianificazione quotidiana, revisione, liste corte) che sostituiscono l’auto-regolazione con l’ambiente.',
    uso: 'La mattina in un minuto (al massimo tre azioni), la sera in due minuti (voto, cosa è andata bene, ostacolo) e la settimana in dieci minuti. Ogni volta gli stessi passaggi, nello stesso ordine.',
    fonti: 'Safren et al. (2005; 2010 JAMA) — RCT: CBT strutturata per adulti ADHD già in farmacoterapia · Solanto et al. (2010), Am J Psychiatry — RCT terapia meta-cognitiva centrata su pianificazione e gestione del tempo.'
  },
  {
    titolo: 'Massimo 3 azioni al giorno',
    evidenza: 'media',
    claim: 'Obiettivi pochi e specifici portano a risultati migliori di obiettivi tanti e vaghi. Una lista troppo lunga tende a generare senso di colpa invece che azione, perché costringe a rimandare la maggior parte delle cose.',
    uso: 'Il piano del mattino non accetta più di tre azioni. La prima è quella più importante: se completi solo quella, la giornata è comunque positiva.',
    fonti: 'Locke & Latham (2002), American Psychologist — 35 anni di goal-setting: specificità e difficoltà calibrata · Masicampo & Baumeister (2011), JPSP — pianificare libera la mente dai task aperti (effetto Zeigarnik).'
  },
  {
    titolo: 'Esperimenti N-of-1 su te stesso',
    evidenza: 'alta',
    claim: 'Le medie calcolate su tanti individui non dicono cosa funziona per te in particolare. Il confronto tra una fase iniziale e una fase con la modifica, sulla stessa persona e con misure ripetute, è un metodo riconosciuto per personalizzare gli interventi. È l’idea scientifica su cui si basa questa app.',
    uso: 'In Andamento → Scoperte, gli esperimenti confrontano il periodo di base con quello della modifica su una misura che già registri (focus, minuti, energia…): le due medie, quanto è grande la differenza, e l’avvertenza onesta sui limiti.',
    fonti: 'Lillie et al. (2011), Personalized Medicine — the n-of-1 clinical trial · Vohra et al. (2015), BMJ — CENT: standard di reporting per trial N-of-1.'
  },
  {
    titolo: 'Novità e varietà controllata',
    evidenza: 'euristica',
    claim: 'Nell’ADHD l’interesse è la fonte di motivazione più affidabile: quando uno strumento annoia, viene abbandonato. Conviene quindi dare spazio al bisogno di novità dentro l’app, invece di ignorarlo.',
    uso: 'Tre schermate da cui partire (Oggi, Panoramica, Rituali), tre forme per «Adesso» e due stili (Aurora e Arcade) mostrano gli stessi dati in modi diversi. Si cambia dalle impostazioni quando vuoi, senza perdere nulla.',
    fonti: 'Coerente con la self-determination theory (Deci & Ryan 2000: autonomia e scelta sostengono la motivazione intrinseca); la prescrizione specifica «varietà di interfaccia» è pratica clinica, non ancora letteratura sperimentale.'
  },
  {
    titolo: 'Ripartenze pulite (fresh start)',
    evidenza: 'media',
    claim: 'I confini temporali (lunedì, primo del mese, «da oggi») aumentano davvero i comportamenti aspirazionali: ogni giorno è trattato come un episodio nuovo, mai come il saldo di un debito.',
    uso: 'Il piano del mattino ricorda che ogni giorno inizia da capo. La review della sera chiude la giornata. Le azioni non completate non si accumulano: restano nel giorno in cui le avevi previste.',
    fonti: 'Dai, Milkman & Riis (2014), Management Science — the fresh start effect.'
  },
  {
    titolo: 'Meno frizione = più comportamento',
    evidenza: 'alta',
    claim: 'Piccole barriere cambiano i comportamenti più della motivazione: la formazione di abitudini dipende dalla ripetizione in contesto stabile a basso costo di innesco.',
    uso: 'Annoti un pensiero con un gesto, fai un check-in con tre tocchi, non ci sono campi obbligatori oltre l’essenziale e il timer registra i minuti da solo. Ogni operazione richiede secondi, non minuti.',
    fonti: 'Lally et al. (2010), European J. of Social Psychology — curva di formazione delle abitudini (mediana 66 giorni, conta la ripetizione) · Wood & Neal (2016), Behavioral Science & Policy — friction e contesto guidano l’abitudine.'
  },
  {
    titolo: 'Un posto per le cose da fare',
    evidenza: 'media',
    claim: 'Le intenzioni non ancora completate restano attive nella mente e disturbano finché non hanno un posto affidabile dove stare. Un elenco esterno, diviso per area, chiude questi «cerchi aperti» e libera attenzione, senza costringere a decidere subito.',
    uso: 'In Attività quello che annoti resta in «Da sistemare» finché non decidi cosa farne; le cose «Da fare» sono divise per area, e in «Oggi» ne porti poche per volta. Così l’elenco non diventa una lista infinita e ansiogena.',
    fonti: 'Masicampo & Baumeister (2011), JPSP — fare un piano concreto attenua l’effetto Zeigarnik dei compiti aperti · Risko & Gilbert (2016), Trends in Cognitive Sciences — cognitive offloading.'
  },
  {
    titolo: 'Scala ancorata e riferita a te',
    evidenza: 'media',
    claim: 'Dare a ogni punto della scala una descrizione concreta, e valutare rispetto al proprio «solito» invece che in assoluto, riduce la tendenza a scegliere sempre il valore centrale e rende le misure ripetute più affidabili.',
    uso: 'Il check-in mostra un’etichetta per ogni valore (es. energia: esausto → pieno) e «il tuo solito» (la tua media recente) come riferimento. Conta la coerenza nel tempo, non la precisione del singolo numero.',
    fonti: 'Smith & Kendall (1963), J. of Applied Psychology — behaviorally anchored rating scales · Shiffman, Stone & Hufford (2008), Annual Review of Clinical Psychology — ecological momentary assessment.'
  },
  {
    titolo: 'Categorie tue (autonomia)',
    evidenza: 'media',
    claim: 'Poter definire e nominare le proprie categorie aumenta il senso di controllo e la voglia di usare lo strumento: le cose «tue» ricevono più attenzione di quelle imposte dall’alto.',
    uso: 'Le aree si rinominano, si creano e si rimuovono (per esempio i tuoi progetti). Colori, grafici e liste si adattano di conseguenza.',
    fonti: 'Deci & Ryan (2000), Psychological Inquiry — self-determination theory: l’autonomia sostiene la motivazione intrinseca · Patall, Cooper & Robinson (2008), Psychological Bulletin — la possibilità di scelta aumenta motivazione e impegno.'
  }
];

/* ============================================================
   VISTA: DESIGN LAB — dieci vestiti per gli stessi elementi
   ============================================================
   Il foglio di stile del laboratorio si carica SOLO qui, la prima
   volta che si apre la pagina: le altre pagine non lo scaricano
   nemmeno. E ogni sua regola è annidata sotto #lab-demo o
   #lab-scelta, quindi anche restando in memoria non può toccare
   niente fuori da questa stanza. */

/* IL LABORATORIO SI CARICA QUANDO LO APRI, NON PRIMA.
   Sono sessantun kilobyte di codice e settantacinque di stile per una
   schermata in cui non entra quasi nessuno, e finora venivano scaricati e
   analizzati a ogni avvio dell'app — su un telefono, ogni volta, per
   niente.
   Prima erano uno `<script>` e un `<link>` costruiti a mano, coi nomi dei
   file presi da `window.LM_PACCO` — una tabella che scriveva il build,
   perché quei nomi hanno l'impronta del contenuto dentro. Adesso è un
   `import()`: Vite lo riconosce, mette quel codice e quello stile in un
   pezzo a parte, e del nome col trattino si occupa lui. Una tabella in meno
   da tenere allineata a mano. */
let labChiesto: Promise<Lab> | null = null;
export function caricaLab(): Promise<Lab> {
  if (labChiesto) return labChiesto;
  labChiesto = Promise.all([
    import('../lab/lab'),
    import('../stile/lab.css')
  ]).then(function (parti) {
    return parti[0].LM_LAB;
  }).catch(function (e) {
    /* se la rete è caduta a metà, la prossima volta si riprova: tenere in
       mano una promessa rifiutata vorrebbe dire che il laboratorio resta
       rotto fino a un ricarico della pagina */
    labChiesto = null;
    throw e;
  });
  return labChiesto;
}

/* La schermata sta in `schermi/Lab.tsx`, come tutte le altre. Qui c'era
   l'ultima scritta a mano, `dove.innerHTML = …`, e non era una
   semplificazione: `#vista` lo possiede la radice di React, e scriverci
   sopra gli porta via nodi che lui crede ancora di avere. */


/* ============================================================
   ONBOARDING
   ============================================================ */

function onboarding() {
  var root = perId('onboarding-root');
  var passo = 0;
  /* `modo` è la schermata su cui si apre l'app la prima volta: il valore
     è l'id di una vista, e i tasti che lo scrivono lo portano dentro */
  const scelte: { nome: string; visione: string; aree: string[]; modo: string } =
    { nome: '', visione: '', aree: LM.AREE_DEFAULT.map(function (a) { return a.id; }), modo: 'oggi' };

  function disegna() {
    var step = '';
    if (passo === 0) {
      step = '<div class="card"><h2>Come ti chiami</h2>' +
        '<label class="campo" for="ob-nome">Nome</label><input type="text" id="ob-nome" value="' + esc(scelte.nome) + '" placeholder="Il tuo nome">' +
        '<label class="campo" for="ob-visione">In una frase, cosa vuoi ottenere</label>' +
        '<textarea id="ob-visione" placeholder="Es. restare in salute e finire gli studi">' + esc(scelte.visione) + '</textarea>' +
        '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="ob-avanti">Avanti ' + ICO('arrowRight', 15) + '</button>' +
        '<button class="btn btn-ghost" id="ob-demo">Salta e guarda un esempio</button></div></div>';
    } else if (passo === 1) {
      step = '<div class="card"><h2>Le aree della tua vita</h2>' +
        '<div class="selettore-aree">' + LM.AREE_DEFAULT.map(function (a) {
          var sel = scelte.aree.indexOf(a.id) >= 0;
          return '<button data-area="' + a.id + '" class="' + (sel ? 'sel' : '') + '" style="--c-area:' + LM.SLOT_COLORI[a.slot][0] + '">' +
            ICO(a.icona, 18) + esc(a.nome) + '<span class="segno">' + ICO('scelto', 15) + '</span></button>';
        }).join('') + '</div>' +
        '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="ob-avanti">Avanti ' + ICO('arrowRight', 15) + '</button>' +
        '<button class="btn btn-ghost" id="ob-indietro">Indietro</button></div></div>';
    } else {
      step = '<div class="card"><h2>Da dove vuoi partire?</h2>' +
        '<div class="selettore-modi">' +
        modo('oggi', 'target', 'Oggi', 'Una sola azione alla volta, per quando hai già tante cose in mente.') +
        modo('plancia', 'dashboard', 'Panoramica', 'Una schermata da tenere aperta, con numeri e grafici sempre a portata.') +
        modo('rituali', 'rituali', 'Rituali', 'Brevi routine al mattino e alla sera che ti danno una struttura fissa.') +
        '</div>' +
        '<div class="riga-flex mt">' +
        '<button class="btn btn-primario btn-grande" id="ob-fine-demo">' + ICO('sparkles', 15) + ' Parti con i dati di esempio</button>' +
        '<button class="btn" id="ob-fine-vuoto">Parti da zero</button>' +
        '<button class="btn btn-ghost" id="ob-indietro">Indietro</button></div></div>';
    }

    /* `ob-p0`, `ob-p1`, `ob-p2`: il passo sta scritto sul contenitore perché
       su un telefono la presentazione si accorcia dopo il primo — vedi il
       blocco «il primo avvio su un telefono» in app.css. */
    root.innerHTML = '<div class="onboarding ob-p' + passo + '"><div class="ob-grid">' +
      '<aside class="ob-brand">' +
      '<div class="logo">' + LOGO(34) + ' LifeMax</div>' +
      '<div class="ob-titolo">Misura. Ingegnerizza.<br><em>Massimizza.</em></div>' +
      '<p>Uno spazio unico per organizzare, misurare e migliorare le diverse aree della tua vita. È pensato per chi fatica a mantenere costanza e concentrazione: poca fatica per usarlo, riscontro immediato.</p>' +
      '<div class="ob-punti">' +
      '<div class="ob-punto">' + ICO('bolt', 15) + '<span><b>Annota subito.</b> Un tasto per salvare qualsiasi pensiero; deciderai dopo cosa farne.</span></div>' +
      '<div class="ob-punto">' + ICO('target', 15) + '<span><b>Una cosa alla volta.</b> Ti proponiamo la prossima azione, così eviti la paralisi da troppe scelte.</span></div>' +
      '<div class="ob-punto">' + ICO('flask', 15) + '<span><b>Scienza applicata a te.</b> Esperimenti sui tuoi dati per capire cosa funziona davvero, non sulle medie di altri.</span></div>' +
      '</div>' +
      '<div id="ob-account" class="ob-account"></div>' +
      illoOrbita() + '</aside>' +
      '<section class="ob-step"><div class="passi-punti">' +
      [0, 1, 2].map(function (i) { return '<span class="' + (i === passo ? 'attivo' : '') + '"></span>'; }).join('') +
      '</div>' + step + '</section>' +
      '</div></div>';

    function modo(id: string, icona: string, nome: string, desc: string): string {
      return '<button data-modo="' + id + '" class="' + (scelte.modo === id ? 'sel' : '') + '">' +
        '<span class="icona-modo">' + ICO(icona, 18) + '</span>' +
        '<span><span class="titolo-modo">' + nome + '</span><div class="desc-modo">' + desc + '</div></span></button>';
    }

    refreshObAccount();

    var demo = document.getElementById('ob-demo');
    if (demo) demo.addEventListener('click', function () { fine(true); });
    var avanti = document.getElementById('ob-avanti');
    if (avanti) avanti.addEventListener('click', function () {
      if (passo === 0) {
        scelte.nome = presa(campoId('ob-nome')).value.trim();
        scelte.visione = presa(campoId('ob-visione')).value.trim();
      }
      passo++; disegna();
    });
    var indietro = document.getElementById('ob-indietro');
    if (indietro) indietro.addEventListener('click', function () { passo--; disegna(); });
    root.querySelectorAll<HTMLElement>('[data-area]').forEach(function (b) {
      b.addEventListener('click', function () {
        const id = b.getAttribute('data-area') || '';
        var i = scelte.aree.indexOf(id);
        if (i >= 0) { if (scelte.aree.length > 1) scelte.aree.splice(i, 1); }
        else scelte.aree.push(id);
        disegna();
      });
    });
    root.querySelectorAll<HTMLElement>('[data-modo]').forEach(function (b) {
      b.addEventListener('click', function () { scelte.modo = b.getAttribute('data-modo') || 'oggi'; disegna(); });
    });
    var fineDemo = document.getElementById('ob-fine-demo');
    if (fineDemo) fineDemo.addEventListener('click', function () { fine(true); });
    var fineVuoto = document.getElementById('ob-fine-vuoto');
    if (fineVuoto) fineVuoto.addEventListener('click', function () { fine(false); });
  }

  function fine(conDemo?: boolean): void {
    if (conDemo) LM.seedDemo();
    var s = LM.load();
    s.onboarded = true;
    if (scelte.nome) s.profilo.nome = scelte.nome;
    if (scelte.visione) s.profilo.visione = scelte.visione;
    s.areeAttive = scelte.aree;
    LM.save();
    root.innerHTML = '';
    location.hash = '#/' + scelte.modo;
    applicaTema();
    render();
    toast(conDemo ? 'Tutto pronto. Esplora pure: i dati sono reali e puoi modificarli.' : 'Tutto pronto. Ti consiglio di iniziare dal piano del mattino.', 0, 'sparkles');
  }

  disegna();
}

/* ---------- render ---------- */

/* L'animazione d'ingresso serve quando CAMBI pagina, non ogni volta che
   spunti qualcosa: se la si riavvia a ogni ridisegno tutto sembra
   "sfarfallare" e sparire/riapparire. Qui la si concede solo alla vera
   navigazione, e si conserva la posizione di scorrimento quando la pagina
   è la stessa — così gli elementi restano fermi sotto il dito. */
/* La riga di linguette della porta corrente. Sta SOTTO al titolo, non
   sopra: prima leggi dove sei, poi vedi cos'altro c'è dentro. Se la porta
   ha una schermata sola (Attività) non compare niente — una linguetta che
   non porta da nessuna parte è solo un'altra cosa da guardare. */
/* C'è un rituale da fare in questo momento? Il mattino e le review si fanno
   una volta e poi sono fatte; il check-in si può rifare, quindi conta come
   «da fare» solo se non l'hai ancora fatto oggi. */
function rituliDaFare() {
  var rid = ritualeDellOra();
  var st = statoRituale(rid);
  return !st.fatto;
}

/* LA PORTA DELLE IMPOSTAZIONI, su telefono.
   È stata in due posti sbagliati, per due ragioni opposte. Prima nella testa
   di «Panoramica»: l'unica porta dell'app stava nell'angolo di UNA schermata,
   e per trovarla bisognava già sapere che era là. Poi nella barra in basso,
   accanto alle tre porte: trovabile sì, ma la barra in basso è il posto delle
   cose che si toccano venti volte al giorno, e le impostazioni si aprono
   forse una volta al mese. Un quarto della barra — la fascia più preziosa
   dello schermo, quella che il pollice raggiunge senza spostare la mano —
   spesa per una cosa che quasi non si usa.
   Adesso sta dove l'ha messa tutto il resto del mondo: in alto a destra,
   l'angolo più lontano dal pollice, lo stesso su ogni schermata. Fuori dalla
   strada, e sempre nello stesso punto. Sul desktop non c'è: là la colonna la
   tiene già in fondo, che è lo stesso ragionamento. */

function sottoNav(v: string): void {
  /* SOLO la riga che ha creato questa funzione: `.sez-nav` è la classe
     condivisa dello stile e ce l'hanno anche le linguette proprie di
     Attività e Andamento — cercandola qui le si cancellava a ogni ridisegno */
  var vecchia = $vista.querySelector<HTMLElement>('.testa-porta');
  if (vecchia) vecchia.remove();
  document.documentElement.style.setProperty('--sottonav-h', '0px');
  /* il Diario è del Profilo: niente linguette dell'Andamento sopra */
  if (v === 'plancia' && schermo.sezPlancia === 'diario') return;
  var g = gruppoDi(v);
  var lista = g.viste.slice();
  /* se sei in una schermata «di passaggio» (Scienza, Design lab) la
     sua linguetta si aggiunge in fondo, attiva: non c'è normalmente, ma
     mentre ci sei dentro dice dove sei e ti riporta indietro */
  if ((g.anche || []).indexOf(v) >= 0) {
    /* si usa il nome breve se ce n'è uno: la linguetta è quella su cui SEI
       e il titolo sopra lo scrive già per intero. Quando la pagina della
       scienza si chiamava «Perché funziona» quel nome da solo si mangiava
       cento pixel e mandava la riga a scorrere sul telefono — adesso i nomi
       sono nomi, e ci stanno. */
    var vi = vistaById(v);
    lista.push({ id: v, eti: (vi && (vi.breve || vi.nome)) || v });
  }
  /* La riga delle sezioni è LA STESSA di tutte le altre pagine. Prima qui
     c'erano linguette sottolineate e in Attività e Andamento pastiglie a
     segmenti: due controlli per lo stesso mestiere («scegli una sezione di
     questa pagina»), e chi li usa non ha modo di sapere che sotto uno ci
     sono tre indirizzi e sotto l'altro tre pannelli. Il commento di
     `.segmenti.tabs-fisse` diceva già «vale per TUTTE le barre di sezione»:
     mancava solo che questa la usasse. */
  var riga = document.createElement('div');
  riga.className = 'testa-porta';
  var bar = document.createElement('nav');
  bar.className = 'segmenti sez-nav porta-nav tabs-fisse' + (lista.length === 2 ? ' tabs-due' : '');
  bar.setAttribute('aria-label', 'Sezioni di ' + g.nome);
  bar.innerHTML = lista.map(function (x) {
    /* la stessa icona della barra in basso e della colonna sul desktop: è
       la stessa destinazione, quindi è lo stesso segno. Prima qui c'era
       solo la parola, e la riga di linguette non somigliava a nessuna
       delle altre due navigazioni. */
    var vi = vistaById(x.id);
    /* Se in «Rituali» c'è qualcosa da fare adesso, lo dice una pastiglia
       sulla linguetta. Prima lo diceva un pulsante in fondo alla schermata
       («Check-in — adesso →»), che portava esattamente dove porta questa
       linguetta: un bersaglio in più e l'ultimo doppione rimasto. Il numero
       sta dove sta la destinazione, come per «Attività». */
    var bollo = (x.id === 'rituali' && x.id !== v && rituliDaFare()) ? '<span class="att-badge att-badge-punto" aria-label="Un rituale da fare adesso"></span>' : '';
    return '<a class="' + (x.id === v ? 'attivo' : '') + '" href="#/' + x.id + '"' +
      (x.id === v ? ' aria-current="page"' : '') + '>' +
      '<span class="seg-ico">' + ((vi && vi.icona) ? ICO(vi.icona, 15) : '') + bollo + '</span>' +
      '<span class="seg-eti">' + x.eti + '</span></a>';
  }).join('');
  /* la riga delle sezioni è SEMPRE il primo blocco della pagina. Prima
     veniva dopo la testa quando c'era una testa, e da quando le teste sono
     rimaste solo dove tengono un comando il contenuto cominciava sessanta
     pixel più in basso su tre pagine e in cima sulle altre sette: cambiando
     porta la pagina saltava. La barra di strumenti, se c'è, viene dopo. */
  var conNav = navTre() && lista.length >= 2;
  if (conNav) riga.appendChild(bar);
  else {
    /* NIENTE RIGA VUOTA CON UN INGRANAGGIO IN FONDO.
       «Attività» è una porta con una stanza sola, quindi di linguette di
       porta non ne ha: l'ingranaggio si ritrovava da solo su una riga sua,
       sopra le linguette della pagina — più in alto che su ogni altra
       schermata, e attaccato a niente. Qui la riga se la prende in prestito:
       la fila di sezioni che la pagina ha già disegnato (Da sistemare · Da
       fare · Abitudini) sale accanto all'ingranaggio, e l'angolo in alto a
       destra torna a essere lo stesso posto dappertutto.
       Funziona perché `sottoNav` gira DOPO che la pagina si è disegnata: la
       fila esiste già, e si sposta senza rifarla — i suoi fili restano
       attaccati. */
    var sua = $vista.querySelector<HTMLElement>(':scope > .segmenti.sez-nav');
    if (sua) riga.appendChild(sua);
    else riga.className += ' testa-porta-sola';
  }
  if (!riga.firstElementChild) return;
  /* TU, in cima a ogni pagina, accanto alle linguette */
  if (v !== 'profilo') {
    const nomeTuo = ((LM.load().profilo.nome || '').trim() || 'Tu');
    const av = document.createElement('a');
    av.className = 'casa-avatar nav-avatar'; av.href = '#/profilo'; av.setAttribute('aria-label', 'Profilo');
    av.textContent = nomeTuo.charAt(0).toUpperCase();
    riga.appendChild(av);
  }
  /* la riga delle sezioni è SEMPRE il primo blocco della pagina */
  $vista.prepend(riga);
  /* niente più sfumatura di scorrimento: a colonne uguali la riga ci sta per
     costruzione a qualunque larghezza, come nelle altre pagine */
  /* L'ALTEZZA SI MISURA UNA VOLTA PER FORMA, non a ogni ridisegno.
     `offsetHeight` qui costringe il browser a impaginare tutta la pagina
     appena riscritta, e questa riga è alta sempre uguale: dipende dalla
     larghezza della finestra e da quante linguette ci sono, e da nient'altro.
     Col profilatore `sottoNav` era 88 ms su dodici cambi di schermata, quasi
     tutti qui. */
  var chiave = innerWidth + '|' + lista.length + '|' + (conNav ? 1 : 0);
  if (chiave !== sottonavChiave) {
    sottonavChiave = chiave;
    document.documentElement.style.setProperty('--sottonav-h', (riga.offsetHeight + 14) + 'px');
  }
}

/* dove stava la sezione di prima nella sua riga di linguette: serve a
   sapere da che parte deve entrare quella nuova */
var postoSezione = -1;
function postoDi(id: string): number {
  var g = gruppoDi(id);
  if (!g || !g.viste) return -1;
  for (var i = 0; i < g.viste.length; i++) if (presa(g.viste[i]).id === id) return i;
  return -1;
}

var sottonavChiave = '';
window.addEventListener('resize', function () { sottonavChiave = ''; });

var vistaMostrata = '';

/* QUANTE VOLTE SI È DISEGNATO DA CAPO, e a che cosa serve saperlo.

   `render()` e un cambiamento dei dati non sono la stessa cosa, e una
   schermata che li tratta uguali butta via quello che stai scrivendo.
   Nel codice di prima la differenza era ovvia perché erano due strade
   diverse: `render()` rifaceva la schermata, mentre l'ascoltatore di
   `lm:change` sui Rituali aggiornava SOLO la colonna degli stati — apposta,
   perché i corpi dei rituali contengono campi a metà.
   Con React le due strade arrivano allo stesso posto: tutt'e due fanno
   ridisegnare il componente. Questo contatore le distingue di nuovo — chi
   deve rifare qualcosa di imperativo lo confronta col giro di prima. */
let giriDiDisegno = 0;
export function giroDiDisegno(): number { return giriDiDisegno; }

export function render() {
  giriDiDisegno++;
  var s = LM.load();
  if (!s.onboarded) {
    if (!perId('onboarding-root').innerHTML) onboarding();
    return;
  }
  perId('onboarding-root').innerHTML = '';
  LMCharts.hideTip();
  aggiornaNav();
  bandaDemo();
  var v = vistaCorrente();
  var cambioPagina = v !== vistaMostrata;
  /* dentro la stessa porta si cambia sezione, non pagina: è quello che
     succede fra Adesso, La giornata e Rituali */
  const cambioSezione = !!(cambioPagina && vistaMostrata &&
    gruppoDi(v).id === gruppoDi(vistaMostrata).id);
  var scrollPrima = cambioPagina ? 0 : (window.scrollY || document.documentElement.scrollTop || 0);
  /* IL RAMO PER REACT NON C'È PIÙ, ed è la cosa migliore che sia successa a
     questa funzione. Qui c'era un `if`: React se la schermata era fra quelle
     convertite e l'interruttore era acceso, il codice di prima se no.
     Adesso c'è un disegno solo per ogni indirizzo, e lo fa chi si è iscritto
     al registro.

     NIENTE `innerHTML = ''` QUI, e questo resta. Sembra la cosa prudente —
     si pulisce e si ridisegna — ed è invece il modo di rompere React in
     silenzio: quei nodi li possiede lui, e svuotarli glieli porta via mentre
     crede ancora di averli. Al primo montaggio non si vede niente (ci pensa
     `createRoot`, che il contenitore lo pulisce da sé); dal secondo giro in
     poi riconcilia contro nodi che non esistono più e disegna nel vuoto. Era
     la linguetta «Da fare» che restava bianca. */
  var disegna = SCHERMI[v];
  if (disegna) disegna($vista);
  sottoNav(v);
  $vista.classList.toggle('vista-oggi', v === 'oggi');
  vistaMostrata = v;
  /* lo schermo della concentrazione è una schermata anche lui: se è aperto
     va ridisegnato con tutto il resto, se no resta a dire «blocco 1» mentre
     il pomodoro è già passato alla pausa */
  if (concentrazioneAperta()) disegnaConcentrazione();
  var postoOra = postoDi(v);
  var verso = (cambioSezione && postoSezione >= 0 && postoOra >= 0)
    ? (postoOra > postoSezione ? 1 : (postoOra < postoSezione ? -1 : 0)) : 0;
  postoSezione = postoOra;
  if (cambioPagina) { animaIngresso($vista, cambioSezione, verso); window.scrollTo(0, 0); }
  else if (scrollPrima) window.scrollTo(0, scrollPrima);
}

window.addEventListener('hashchange', function () {
  if (vistaCorrente() !== 'rituali') schermo.sottoRituale = null;
  /* il Diario si apre dal Profilo dentro la pagina dell'Andamento: uscendo,
     l'Andamento torna al suo Riepilogo, se no al ritorno c'era ancora il Diario */
  if (vistaCorrente() !== 'plancia') schermo.sezPlancia = 'riepilogo';
  chiudiSheet();
  render();
});

function staDigitando() {
  return /input|textarea|select/i.test(document.activeElement && document.activeElement.tagName || '');
}

/* login/logout: aggiorna l'interfaccia. Durante l'onboarding evita di
   ricostruire i campi (perderebbe ciò che l'utente sta scrivendo): se
   è arrivato un utente carica i suoi dati, altrimenti aggiorna solo il
   pulsante di accesso dell'onboarding. */
window.addEventListener('lm:auth', function () {
  var inOnboarding = !!perId('onboarding-root').innerHTML;
  /* la nuvola può non esserci affatto: senza SDK non c'è nessun utente */
  const chi = window.LM_AUTH ? window.LM_AUTH.user : null;
  if (inOnboarding && !chi) { refreshObAccount(); return; }
  if (staDigitando() && !chi) return;
  render();
});

/* L'ESEMPIO NON ENTRA NELL'ACCOUNT SENZA CHIEDERE.
   La prima sincronizzazione UNISCE, apposta, per non perdere niente. Ma se
   su questo dispositivo ci sono i DATI DI ESEMPIO, unire vuol dire infilare
   otto settimane di roba inventata dentro a un account vero — e da una
   fusione non si torna indietro: aggiungono tutte le strade, la fusione,
   l'importazione da un file, «riprendi una copia». È successo, e chi l'ha
   subito non aveva nessun modo di rimediare.
   L'app non può sapere da sé se quell'esempio è ancora esempio o se ci hai
   lavorato sopra per un mese. Quindi non decide: chiede. */
/* NELL'ACCOUNT C'È L'ESEMPIO: è entrato prima che l'app sapesse tenerlo
   fuori. Lo si dice una volta, all'accesso, e lo si toglie con un tocco. */
window.addEventListener('lm:esempio-nell-account', function (e) {
  var n = (e && e.detail) || 0;
  if (!n) return;
  /* «Lascia stare» vale finché non cambia niente: non lo si richiede a ogni apertura */
  try { if (localStorage.getItem('lm-esempio-lasciato') === String(n)) return; } catch (_e) { /* chiede */ }
  avviso({
    titolo: 'Dati di esempio nell’account',
    testo: 'Trovati ' + n + ' elementi di esempio. Vuoi rimuoverli? I tuoi dati restano.',
    azione: 'Rimuovi',
    annulla: 'Non ora'
  }, function () {
    var tolte = LM.togliEsempio(); render();
    toast(tolte ? 'Tolti i dati di esempio.' : 'Niente da togliere.', 0, 'sparkles');
  }, function () {
    try { localStorage.setItem('lm-esempio-lasciato', String(n)); } catch (_e) { /* pazienza */ }
  });
});

/* aggiornamento arrivato da un altro dispositivo */
var remotoInAttesa = false;
window.addEventListener('lm:remote', function () {
  /* MENTRE SCRIVI NON SI RIDISEGNA — MA NON SI DIMENTICA.
     Ridisegnare sotto le dita butterebbe via quello che stai scrivendo.
     Prima però il ridisegno si perdeva e basta: la modifica arrivata da un
     altro dispositivo restava nei dati e non compariva sullo schermo
     finché non succedeva qualcos'altro. Fino a una ricarica, esattamente
     la cosa che non deve servire. Adesso si tiene da parte e si fa appena
     il campo perde il fuoco. */
  if (staDigitando()) { remotoInAttesa = true; return; }
  render();
  toast('Dati aggiornati da un altro dispositivo.', 0, 'cloudCheck');
});
document.addEventListener('focusout', function () {
  if (!remotoInAttesa) return;
  setTimeout(function () {
    if (staDigitando() || !remotoInAttesa) return;
    remotoInAttesa = false;
    render();
    toast('Dati aggiornati da un altro dispositivo.', 0, 'cloudCheck');
  }, 120);
});

/* cambio area di un'azione (da Focus o dal Diario), anche a distanza
   di tempo — listener delegato unico */
document.addEventListener('change', function (e) {
  const sel = e.target as HTMLSelectElement | null;
  if (sel && sel.matches && sel.matches('select[data-azione-area]')) {
    LM.cambiaAreaAzione(sel.getAttribute('data-azione-area') || '', sel.value);
    toast('Area aggiornata.', 0, 'check');
    render();
  }
});

/* stato del salvataggio cloud: aggiorna il footer senza ridisegnare la
   vista (non disturba ciò che stai facendo) e segnala gli errori una volta */
var ultimoErroreSync = '';
window.addEventListener('lm:sync', function (e) {
  var fondo = perId('sidebar-fondo');
  if (fondo && (window.LM_AUTH || {}).user && scriviSe(fondo, footerSidebar())) wireFooterSidebar();
  var y = (e && e.detail) || window.LM_SYNC || {};
  if ((y.state === 'error' || y.state === 'muto') && y.error && y.error !== ultimoErroreSync) {
    ultimoErroreSync = y.error;
    toast(y.error, 0, 'cloud');
  }
  if (y.state === 'attesa' && ultimoErroreSync !== 'attesa') {
    ultimoErroreSync = 'attesa';
    toast('Sei offline: sincronizzo appena torna la rete.', 0, 'cloud');
  }
  if (y.state === 'saved') ultimoErroreSync = '';
});

/* Esc chiude il pannello se aperto */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !$sheet.hidden) chiudiSheet();
});

/* il salvataggio locale non funziona: meglio dirlo subito e chiaramente,
   così puoi esportare i dati prima di perderli */
document.addEventListener('lm:errore-salvataggio', function () {
  toast('Impossibile salvare su questo dispositivo. Esporta i dati da Impostazioni.', 0, 'cloud');
});

/* chrome statico */
perId('logo-blocco').innerHTML = LOGO(30) + ' LifeMax <span class="logo-tag">Beta</span>';

/* OROLOGIO VIVO: ogni 15s aggiorna la barra della giornata e la linea
   "adesso", così vedi che ora è e in che punto del piano sei senza dover
   ricaricare. Se cambia la cosa da fare in questo momento (e non l'hai
   scelta tu), la schermata Oggi si aggiorna da sola. */
function battito() {
  var ob = perId('onboarding-root');
  if (ob && ob.innerHTML) return;
  var v = vistaCorrente();
  if (v === 'oggi') {
    montaOggiGiornata(); // la barra si muove sempre
    var occupato = staDigitando() || !$sheet.hidden || timerOra() || fuocoScelto;
    if (occupato) return;
    var a = LM.azioneAdesso();
    var key = (a.azione ? a.azione.id : '') + '|' + a.stato;
    if (key !== ultimoFuocoKey) render(); // la cosa da fare adesso è cambiata
  } else if (v === 'giornata') {
    if ($sheet.hidden && !staDigitando()) aggiornaLineaGriglia();
  }
}
/* a schermo spento o in un'altra scheda non serve battere (batteria); al
   ritorno si riallinea subito, senza aspettare il prossimo giro. */
let battitoTimer: ReturnType<typeof setInterval> | null = null;
function avviaBattito() {
  if (battitoTimer) return;
  battitoTimer = setInterval(battito, 15000);
}
function fermaBattito() { if (battitoTimer) { clearInterval(battitoTimer); battitoTimer = null; } }
document.addEventListener('visibilitychange', function () {
  if (document.hidden) fermaBattito();
  else {
    battito(); avviaBattito();
    /* CHI NON CHIUDE MAI L'APP. Su telefono la scheda resta aperta per
       giorni: senza questo, la domanda della sera arriverebbe solo a chi
       ricarica la pagina, cioè quasi a nessuno. Tornare sull'app è
       esattamente il momento in cui la domanda ha senso. */
    vistoPrima = LM.segnaVisto();
    /* tornando sull'app dopo averla chiusa, il timer va riagganciato: il
       conto è andato avanti da sé (l'ora di fine è assoluta), ma il battito
       che scrive le cifre a schermo era stato fermato per non consumare */
    if (LM.timerVivo()) { battitoTimerAvvia(); passoTimer(); }
    setTimeout(forseChiedere, 400);
  }
});
avviaBattito();

/* IL TIMER CHE C'ERA GIA'. Sta nei dati, quindi al caricamento può già
   esserci — perché l'hai lasciato girare chiudendo il telefono, o perché
   l'hai fatto partire su un altro dispositivo e è arrivato qui dalla nuvola.
   In tutti e due i casi non va «riavviato»: va solo ripreso a contare, che
   è quello che ha continuato a fare da sé (l'ora di fine è un istante
   assoluto). */
function riprendiTimer() {
  var t = LM.timerVivo();
  if (!t) { if (concentrazioneAperta()) chiudiConcentrazione(); return; }
  battitoTimerAvvia();
  if (t.concentrato && !concentrazioneAperta()) apriConcentrazione();
  passoTimer();
}
riprendiTimer();
/* un timer arrivato da un altro dispositivo si vede subito, senza
   ricaricare: `lm:remote` è l'evento che la nuvola manda quando cambia
   qualcosa di là */
window.addEventListener('lm:remote', function () { riprendiTimer(); if (concentrazioneAperta()) disegnaConcentrazione(); });

function qualcosaSopra() {
  if (!$sheet.hidden) return true;
  if ($ovl && !$ovl.hidden) return true;
  if (document.querySelector<HTMLElement>('.avviso-ovl')) return true;
  if (perId('onboarding-root').innerHTML) return true;
  return false;
}


/* IL FONDO DI QUELLO CHE SI VEDE.
   `position: fixed` si aggancia al riquadro di IMPIANTO della pagina, che
   non è quello che hai davanti agli occhi. Su un tablet i due si separano
   spesso: la modalità desktop mostra la pagina rimpicciolita, due dita la
   allargano, la barra del browser si ritira e torna. Quando si separano, la
   barra in basso resta agganciata a un fondo che non è più il fondo dello
   schermo — sotto il bordo, o in mezzo allo schermo, ferma lì mentre
   scorri. Qui si misura la differenza e si passa al foglio di stile.
   Dove i due riquadri coincidono (ogni telefono, ogni computer) vale zero e
   non cambia niente. */
const forseVV = window.visualViewport;
if (forseVV) {
  /* ricopiato dopo il controllo: `misuraFondo` gira più tardi, a ogni
     `resize` e a ogni `scroll`, e il compilatore non tiene il controllo di
     qui dentro una funzione che vive oltre */
  const vv = forseVV;
  var ultimoGiu = -1;
  var misuraFondo = function () {
    var impianto = document.documentElement.clientHeight;
    var giu = Math.max(0, Math.round(impianto - (vv.height + vv.offsetTop)));
    /* si riscrive solo quando cambia davvero: `scroll` batte a ogni pixel */
    if (giu === ultimoGiu) return;
    ultimoGiu = giu;
    document.documentElement.style.setProperty('--vv-giu', giu + 'px');
  };
  vv.addEventListener('resize', misuraFondo);
  vv.addEventListener('scroll', misuraFondo);
  misuraFondo();
}

/* ============================================================
   L'AVVIO

   Queste quattro righe stavano in fondo al file e giravano da sé: era la
   fine di uno `<script>`, e quando il browser ci arrivava tutto il resto
   era già stato letto.

   Adesso sono una funzione, e la chiama `main.tsx` DOPO aver iscritto le
   schermate e i pannelli al registro. Non è una formalità: `render()` cerca
   nel registro chi disegna la schermata di adesso, e se l'iscrizione non è
   ancora avvenuta non trova nessuno e la pagina resta bianca. Con uno
   `<script>` l'ordine lo garantiva la pagina; con i moduli lo deve
   garantire qualcuno, e quel qualcuno è scritto e si vede.
   ============================================================ */
export function avvia(): void {
  applicaTema();
  /* lo sfoglio di lato: gli si dice come si riconosce «c'è qualcosa aperto
     sopra», che è l'unica cosa dell'app che gli serve sapere */
  avviaScorrimento(qualcosaSopra);
  /* si segna la visita PRIMA del disegno e si tiene da parte quella di prima:
     è l'unico modo di sapere se in mezzo c'è stata una notte */
  vistoPrima = LM.segnaVisto();
  render();
  /* la domanda arriva a schermata già disegnata: un pop-up che compare mentre
     l'app sta ancora entrando si prende l'animazione e sembra un errore */
  setTimeout(forseChiedere, 900);
}
