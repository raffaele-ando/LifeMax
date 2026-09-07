/* LO STATO, DETTO UNA VOLTA SOLA.

   Queste forme non sono inventate: sono lette dai costruttori veri di
   `data.js` — `aggiungiAzione`, `aggiungiAbitudine`, `cattura`,
   `creaEsperimento` — e da `statoVuoto()`. Dove un campo è nullabile lo è
   perché là dentro ci finisce `null`, non perché sembrava prudente.

   PERCHÉ QUESTO FILE È IL MOTIVO DEL PASSAGGIO A TYPESCRIPT.
   Il difetto che è arrivato da un registro tecnico incollato in chat —
   «campi senza regola di fusione: demoChiusa» — nasceva così: un campo
   scritto a mano dentro allo stato, che `statoVuoto()` non conosceva e che
   quindi non aveva una regola per la fusione fra due dispositivi. La fusione
   lo trovava scoperto, si teneva quello del documento più recente e gridava
   nel registro di chi usa l'app. Una prova l'ha poi preso, ma solo dopo.
   Qui sotto quel difetto NON PUÒ ESISTERE: `COME_UNIRE` è dichiarato come
   «una regola per ogni campo di Stato». Se aggiungi un campo e ti dimenti-
   chi la regola, non compila; se scrivi una regola per un campo che non
   esiste, non compila.  */

/* ---------------------------------------------------------------- le aree
   Lo slot segue l'ENTITÀ, mai il rango: il colore di un'area non cambia se
   una vista la filtra o la riordina. */
export type Slot = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface Area {
  id: string;
  nome: string;
  icona: string;
  slot: Slot;
  sistema: string;
}

/* --------------------------------------------------------- data e orario
   Due stringhe che nel codice hanno un formato preciso e che, essendo
   entrambe stringhe, si scambiavano senza che nessuno se ne accorgesse.
   Il marchio non cambia niente a runtime: cambia che una funzione che vuole
   un giorno non accetta più un'ora. */
export type Giorno = string & { readonly __giorno: unique symbol };  /* 'AAAA-MM-GG' */
export type Ora = string & { readonly __ora: unique symbol };        /* 'HH:MM' */

export const giorno = (s: string) => s as Giorno;
export const ora = (s: string) => s as Ora;

/* ------------------------------------------------------------- le cose da fare */
export interface PassoDi {
  b: string;  /* l'attività divisa in passi */
  s: string;  /* il passo */
}

/* «non ci sono riuscito», con quanto ne avevi fatto: l'esito che esiste per
   non far cancellare la riga. */
export interface Mancata {
  quanto: string;
  quota: number;
  perche: string;
  nota: string;
  ts: number;
}

export interface Azione {
  id: string;
  areaId: string;
  testo: string;
  ifThen: string;
  mit: boolean;
  done: boolean;
  data: Giorno;
  doneAt: number | null;
  creata: number;
  ora: Ora | null;
  durata: number | null;
  passoDi: PassoDi | null;
  mancata?: Mancata;
}

export interface Nota {
  id: string;
  testo: string;
  creata: number;
  areaSug?: string;
}

export interface Passo {
  id: string;
  testo: string;
  done: boolean;
}

export interface Attivita {
  id: string;
  testo: string;
  areaId: string;
  creata: number;
  scadenza?: Giorno | null;
  steps?: Passo[];
  pin?: boolean;
  done?: boolean;
  mancata?: Mancata;
}

/* i giorni della settimana come li scrive `Date.getDay()`: 0 è domenica */
export type GiornoSettimana = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Abitudine {
  id: string;
  testo: string;
  areaId: string;
  giorni: GiornoSettimana[];
  ora: Ora | null;
  durata: number | null;
  creata: number;
  fatti: Record<string, boolean>;
  salti: Record<string, boolean>;
  /* da quando vale, e fino a quando. Tutt'e due possono mancare: `da` lo
     riempie `normalizza` col giorno in cui l'abitudine è nata, ma uno stato
     vecchio può arrivare senza. */
  da: Giorno | null;
  a: Giorno | null;
}

export interface Checkin {
  data: Giorno;
  ts: number;
  energia: number;
  focus: number;
  umore: number;
  contesto?: string;
}

/* ------------------------------------------------------- scoperte e prove */
export type Verso = 'si' | 'no';

export interface Lezione {
  id: string;
  testo: string;
  verso: Verso;
  forza: string;
  areaId: string | null;
  creata: number;
  aggiornata?: number;
  espId?: string | null;
}

export interface Esperimento {
  id: string;
  nome: string;
  intervento: string;
  metrica: string;
  areaId: string | null;
  inizioBaseline: Giorno;
  inizioIntervento: Giorno;
  /* PUO' NON AVERE UNA FINE: un esperimento ancora aperto la lascia vuota, e
     `esitoEsperimento` gia' scriveva `e.fine || todayKey()`. Il tipo diceva
     `Giorno` e i dati d'esempio ne creano uno con `fine: null`. */
  fine: Giorno | null;
  /* DUE STATI, E SONO QUESTI DUE. Li ho scritti guardando il codice: avevo
     messo 'finito' e 'annullato', che non esistono da nessuna parte.
     E c'è una cosa che il tipo ha fatto venire fuori: `'concluso'` lo scrive
     SOLTANTO `seedDemo`. Nel giro vero nessuno lo mette mai — quindi un
     esperimento resta «attivo» per sempre, anche dopo la sua data di fine, e
     la pastiglia nella scheda dice «attivo» a tempo indeterminato. Non lo
     cambio dentro a una migrazione: cambiare comportamento mentre si sposta
     il pavimento è il modo di non sapere più quale delle due cose ha rotto
     qualcosa. Sta scritto qui, e si sistema dopo, da solo. */
  stato: 'attivo' | 'concluso';
  lezioneId: string | null;
}

/* ------------------------------------------------------------- il ritmo */
export interface Pasto {
  id: string;
  nome: string;
  ora: Ora;
  durata: number;
  /* SOLO NEL REGISTRO DI UN GIORNO, e `false` non è un buco: è
     un'informazione. Nel grafico della giornata quel pasto si vede saltato,
     che è diverso da «non risposto». Nel ritmo di BASE non ci sono. */
  fatto?: boolean;
  /* con che faccia l'hai detto: «preciso» o «circa». Vale sia per un pasto
     sia per gli orari della notte, perché sono dati insieme. */
  prec?: 'preciso' | 'circa';
}

export interface Ritmo {
  sveglia: Ora;
  sonno: Ora;
  pasti: Pasto[];
}

/* QUANDO L'APP FA LE SUE DUE DOMANDE. Sono le uniche due volte in cui apre
   qualcosa senza che glielo si sia chiesto, e per questo stanno in mano a chi
   le riceve: `on` spegne la domanda e lascia in piedi il posto dove si
   risponde, che è il Registro di oggi nei Rituali. */
export interface Chiedi {
  notte: { on: boolean; da: Ora; a: Ora };
  giorno: { on: boolean; da: Ora };
}

export interface RegistroGiorno {
  sveglia?: Ora;
  sonno?: Ora;
  /* CON CHE FACCIA L'HAI DETTO, non un'ora. Ci avevo messo `Ora` guardando i
     campi vicini; `precisioneValida()` torna una di queste due parole e il
     compilatore l'ha detto subito. Avevo anche inventato un campo
     `precisione` che nel codice non esiste da nessuna parte: via. */
  prec?: 'preciso' | 'circa';
  pasti?: Pasto[];
  /* le due domande dell'app, segnate una per una: chiedere due volte la
     stessa cosa nello stesso giorno è il modo di farsi spegnere */
  chiestoNotte?: boolean;
  chiestoGiorno?: boolean;
}

/* ------------------------------------------------------------ i promemoria
   Stavano nei dati e non in nessun tipo: è la stessa specie di buco di
   `demoChiusa`, e questa volta l'ha trovato il compilatore invece di un
   registro incollato in chat.
   LA CHIAVE PRIVATA NON STA QUI, e non ci deve stare: `chiave` è quella
   PUBBLICA. Quella privata vive solo come segreto del Worker — se un campo
   te la chiede, è il campo sbagliato. */
export interface VocePromemoria { on: boolean; ora?: Ora }

export interface Promemoria {
  server: string;
  chiave: string;
  fissa: boolean;
  voci: {
    mattina: VocePromemoria;
    checkin: VocePromemoria;
    mit: VocePromemoria;
    sera: VocePromemoria;
    /* le abitudini non hanno un'ora qui: ognuna ha la sua */
    abitudini: VocePromemoria;
  };
  /* la fascia in cui non arriva niente. Un promemoria alle due di notte non
     si legge: sveglia, e insegna a spegnere tutto. */
  silenzio: { on: boolean; da: Ora; a: Ora };
}

/* ------------------------------------------------------------- il profilo */
export type Skin = 'quiete' | 'aurora' | 'arcade';
export type Modo = 'auto' | 'chiaro' | 'scuro';
export type Effetti = 'pieni' | 'ridotti' | 'minimi';
export type SiNo = 'si' | 'no';
export type GiornataPos = 'oggi-strip' | 'panoramica' | 'oggi-full' | 'menu';
export type Nav = 'tre' | 'tutte';

export interface Profilo {
  nome: string;
  visione: string;
  skin: Skin;
  modo: Modo;
  scorri: SiNo;
  effetti: Effetti;
  suono: SiNo;
  vibra: SiNo;
  giornataPos: GiornataPos;
  ritmo: Ritmo;
  chiedi: Chiedi;
  nav?: Nav;
  promemoria?: Promemoria;
  /* L'INTERRUTTORE DELLE SCHERMATE NUOVE STA ANCORA QUI, ed è l'ultima
     parola per chi ce l'aveva già messo — ma la scelta vera vive in
     localStorage, perché `profilo` si sincronizza e una via d'uscita che un
     altro dispositivo può riaccendere da lontano non è una via d'uscita. */
  react?: boolean;
}

/* ------------------------------------------------------------- il timer */
export interface Timer {
  azioneId: string | null;
  areaId: string | null;
  tipo: 'avvio' | 'blocco' | 'pomodoro' | 'libero';
  testo: string;
  inizio: number;
  fine: number;
  durata: number;
  ciclo: number;
  inPausa: boolean;
  fermatoA: number;
}

/* LE LAPIDI. Per ogni riga tolta davvero: serve alla fusione fra dispositivi,
   perché senza, una riga cancellata qui tornerebbe viva al primo scambio con
   un telefono che non lo sapeva ancora. Le scrive `save()` da sé, guardando
   cos'è sparito — non chi cancella, che prima o poi se ne dimentica. */
export interface Lapide {
  k: string;
  chiave: string;
  ts: number;
}

/* COME SI TORNA INDIETRO DA QUESTA RIGA. Non tutte le righe del diario si
   possono disfare, e quelle che si possono se lo portano scritto dietro:
   `disfa` dice di che tipo è e su quale chiave agisce. Il resto non ce l'ha,
   e per questo è facoltativo. */
export interface Disfa { t: string; k: string }

export interface VoceRegistro {
  ts: number;
  cat: string;
  testo: string;
  imp: boolean;
  disfa?: Disfa;
}

/* ============================================================== LO STATO */
export interface Stato {
  versione: number;
  updatedAt: number;
  onboarded: boolean;
  demo: boolean;
  demoChiusa: boolean;
  profilo: Profilo;
  ritmoGiorno: Record<string, RegistroGiorno>;
  /* l'ultima volta che ti ho visto. Serve a sapere se fra ieri e oggi c'è
     stato un BUCO in cui la notte ci sta: chi è rimasto sveglio fino alle
     quattro e riapre alle quattro e dieci non deve sentirsi chiedere com'è
     andata la notte. */
  visto: number;
  aree: Area[];
  areeAttive: string[];
  azioni: Azione[];
  inbox: Nota[];
  backlog: Attivita[];
  abitudini: Abitudine[];
  checkins: Checkin[];
  valutazioni: Record<string, Record<string, number>>;
  minuti: Record<string, Record<string, number>>;
  pianoMattina: Record<string, { compilato: boolean; intenzione: string; ts?: number }>;
  reviewSera: Record<string, { vittoria: string; blocco: string; shutdown: boolean; ts?: number }>;
  reviewSettimana: Record<string, { vittorie: string; blocchi: string; imparato: string; prossima: string; ts?: number }>;
  esperimenti: Esperimento[];
  lezioni: Lezione[];
  xp: number;
  xpPerGiorno: Record<string, number>;
  /* (deprecato) eventi recenti per il riscontro immediato */
  log: unknown[];
  registro: VoceRegistro[];
  cancellati: Lapide[];
  timer: Timer | null;
  /* quello che è arrivato storto e che invece di buttare si è messo da parte */
  recuperati: Record<string, unknown>;
  /* l'ora di un «Azzera tutto» dichiarato: è l'unica cosa che dà alla fusione
     il permesso di TOGLIERE. Senza, azzerare un dispositivo si annullerebbe
     da sé alla prima sincronizzazione con l'altro. */
  azzerato: number;
}

/* ====================================================== COME SI FONDONO
   `elenco`  una lista di righe con un id: si tengono tutte, e su una riga
             che esiste da entrambe le parti decide la più recente
   `mappa`   un oggetto indicizzato per giorno: chiave per chiave
   `insieme` un'unione senza doppioni (le aree attive)
   `ramo`    un oggetto di preferenze: campo per campo, vince il più recente
   `massimo` un numero che non torna indietro (un'ora, un contatore)
   `oppure`  un sì che non torna un no (chiusa una volta, resta chiusa)
   `recente` vince quello del documento più recente, e basta            */
export type ModoFusione = 'elenco' | 'mappa' | 'insieme' | 'ramo' | 'massimo' | 'oppure' | 'recente';

/* UNA REGOLA PER OGNI CAMPO, E IL COMPILATORE LO PRETENDE.
   È il difetto `demoChiusa` reso impossibile: manca una regola e non
   compila, c'è una regola per un campo che non esiste e non compila. */
export const COME_UNIRE: { readonly [K in keyof Stato]-?: ModoFusione } = {
  versione: 'massimo',
  updatedAt: 'massimo',
  azzerato: 'massimo',
  visto: 'massimo',
  xp: 'massimo',
  onboarded: 'oppure',
  demo: 'recente',
  demoChiusa: 'oppure',
  profilo: 'ramo',
  ritmoGiorno: 'mappa',
  valutazioni: 'mappa',
  minuti: 'mappa',
  pianoMattina: 'mappa',
  reviewSera: 'mappa',
  reviewSettimana: 'mappa',
  xpPerGiorno: 'mappa',
  recuperati: 'mappa',
  aree: 'elenco',
  areeAttive: 'insieme',
  azioni: 'elenco',
  inbox: 'elenco',
  backlog: 'elenco',
  abitudini: 'elenco',
  checkins: 'elenco',
  esperimenti: 'elenco',
  lezioni: 'elenco',
  registro: 'elenco',
  cancellati: 'elenco',
  log: 'elenco',
  timer: 'recente'
} as const;
