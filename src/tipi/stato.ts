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
  /* SCRITTA DOPO, non pianificata. Le mette `registraFatta`, quando la sera
     si annota una cosa fatta senza averla mai messa in lista. Serve a due
     cose: a non contarla come pianificata quando si guarda se il piano del
     mattino ha funzionato, e al blocco «Altre cose fatte» dei rituali, che
     è l'unico posto che le rilegge. Il campo lo scriveva `dati.ts` e il tipo
     non lo conosceva: chi lo leggeva non compilava. */
  dopo?: boolean;
  /* VIENE DA UN CALENDARIO (Google o Outlook), e ci torna. `null` vuol dire
     che il collegamento c'era ed è stato staccato apposta — un evento
     cancellato là quando qui era già fatto, o un account scollegato tenendo
     le attività — e non va confuso con «non c'è mai stato»: un'attività
     staccata non si riscrive in nessun calendario. Perché `null` e non un
     campo tolto: la fusione fra dispositivi riga per riga non sa togliere
     un campo (vince l'unione), sa solo far vincere il valore più recente.
     Tutta la logica sta in src/calendari/sincronia.ts. */
  esterno?: Esterno | null;
  /* QUANDO LA RIGA È STATA TOCCATA DA FUORI. La scrive la sincronizzazione
     dei calendari quando cambia un'attività, e `momentoRiga` in dati.ts la
     legge già: così, fra due dispositivi, vince la versione appena allineata
     al calendario invece di quella col `creata` più recente. */
  aggiornata?: number;
  /* UN EVENTO LONTANO, NON ANCORA UN'ATTIVITÀ. Le viste della Giornata
     mostrano anche gli eventi oltre i sessanta giorni, presi dallo specchio
     della sentinella (src/calendari/sincronia.ts, `fantasmi`): non stanno
     nei dati, e diventano un'attività vera appena li tocchi. Non si salva
     mai una riga con questo segno. */
  fantasma?: boolean;
}

/* ------------------------------------------------------------ i calendari */
export type Provenienza = 'google' | 'microsoft';

/* COM'ERA L'EVENTO ALL'ULTIMO ACCORDO. Senza una fotografia comune non si
   sa CHI ha cambiato cosa: se qui c'è scritto 15:00 e là 16:00, può averlo
   spostato chiunque dei due. Confrontando tutti e due con questa si sa. */
export interface Istantanea {
  testo: string;
  data: Giorno;
  ora: Ora | null;
  durata: number | null;
  /* l'etag di Google o la changeKey di Microsoft: quando cambia, là è
     cambiato qualcosa (magari solo la descrizione, che qui non c'è) */
  versione: string;
}

export interface Esterno {
  prov: Provenienza;
  cal: string;   /* l'id del calendario */
  id: string;    /* l'id dell'evento, o dell'istanza se si ripete */
  istantanea: Istantanea;
  /* «solo» (tuo, senza altri invitati), «tua» (tua, con altri), «altrui»
     (di qualcun altro). Decide cosa fa la sera «rimanda a domani»: solo il
     primo si sposta da sé. Manca sulle righe importate prima che si
     leggesse. */
  invito?: 'solo' | 'tua' | 'altrui';
}

/* un calendario dell'account, con la scelta di chi lo usa */
export interface CalendarioScelto {
  nome: string;
  on: boolean;
  areaId: string;
  /* sola lettura: un calendario condiviso con te senza permesso di
     scrittura. Le modifiche fatte qui restano qui. */
  lettura?: boolean;
}

export interface AccountCalendario {
  collegato: boolean;
  email: string;
  calendari: Record<string, CalendarioScelto>;
}

/* UNA CANCELLAZIONE CHIESTA DA TE, da riportare nel calendario. Non basta
   la lapide della riga: le lapidi le lasciano anche «Azzera tutto», «togli
   i dati di esempio», un backup ripristinato — e nessuna di quelle vuol
   dire «cancella la riunione di martedì su Google». Questo sì, e lo scrive
   soltanto chi elimina un'attività a mano. */
export interface Tolto { prov: Provenienza; cal: string; id: string; ts: number; fatto?: boolean }

export interface EsitoCalendari {
  ts: number;
  ok: boolean;
  testo: string;
}

export interface Calendari {
  google?: AccountCalendario;
  microsoft?: AccountCalendario;
  /* gli ID dell'app (Client ID) quando non stanno in src/calendari/config.ts:
     si incollano dal pannello, come l'indirizzo del postino. Non sono
     segreti — finiscono comunque nel browser di chiunque apra l'app. */
  idGoogle?: string;
  idMicrosoft?: string;
  /* dove scrivere le NUOVE attività con orario: 'google|<id>' o '' */
  destinazione?: string;
  /* da quando vale la destinazione: le attività nate prima non si spediscono */
  destinazioneDa?: number;
  tolti?: Record<string, Tolto | null>;
  esito?: EsitoCalendari;
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
  /* l'orario di un giorno solo, quando la sposti nel calendario */
  /* l'ora di un giorno solo; '-' vuol dire «quel giorno senza orario» */
  oreGiorno?: Record<string, Ora | '-'>;
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

/* una toppa su `Chiedi`: un campo per volta, di uno dei due gruppi. È quello
   che manda il pannello del ritmo quando si tocca un interruttore o si
   cambia un'ora. */
export interface PatchChiedi {
  notte?: { on?: boolean; da?: Ora | null; a?: Ora | null };
  giorno?: { on?: boolean; da?: Ora | null };
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
/* DUE TIPI CHE AVEVO INVENTATO, e il compilatore l'ha detto appena qualcuno
   ha provato a confrontarli.
   `Skin` non ha un valore `'aurora'`: «Aurora» è l'ETICHETTA che si legge nel
   pannello, e il valore è `'quiete'`. Ne avevo fatto un terzo valore leggendo
   la parola sullo schermo invece del codice.
   `Modo` non parla italiano: sono `'light'` e `'dark'`, come li scrive
   `data-mode` sul documento e come li mandano i tasti del pannello. Ci avevo
   messo `'chiaro'` e `'scuro'` — che sono, di nuovo, le parole sui tasti. */
export type Skin = 'quiete' | 'arcade';
export type Modo = 'auto' | 'light' | 'dark';
export type Effetti = 'pieni' | 'ridotti' | 'minimi';
export type SiNo = 'si' | 'no';
export type GiornataPos = 'oggi-strip' | 'panoramica' | 'oggi-full' | 'menu';
export type Nav = 'tre' | 'tutte';
/* LA FORMA DELLA SCHERMATA «ADESSO».
   Non è un tema e non è un gusto: sono tre risposte diverse alla stessa
   domanda, e quale sia la migliore dipende da come è fatta la tua giornata.
     · `scheda`  quella di sempre: una cosa sola, in mezzo, grande.
     · `spina`   la giornata come una colonna: sopra quello che hai già
                 fatto, in mezzo questa, sotto quello che viene. Risponde
                 anche a «e poi?», che la scheda da sola non fa.
     · `poi`     la scheda dov'è, e sotto la coda di oggi aperta invece che
                 chiusa in una fisarmonica.
   In `spina` e `poi` il comando scende in fondo allo schermo, dove arriva
   il pollice, e cambia colore con lo stato. */
export type Forma = 'scheda' | 'spina' | 'poi';

export interface Profilo {
  /* l'area con cui nasce una cosa nuova, ovunque la si crei */
  areaNuova?: string;
  /* la difficoltà scelta al primo avvio: decide da dove si parte e il timer */
  difficolta?: 'cominciare' | 'concentrazione' | 'costanza' | 'ricordare' | 'capire';
  /* come parte il timer e quanto dura ogni tipo */
  timer?: ImpostazioniTimer;
  /* la musica da mettere sotto: una per tutto e una per area */
  musica?: Musica;
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
  forma?: Forma;
  promemoria?: Promemoria;
  /* I CALENDARI COLLEGATI: quali, con che area, dove scrivere. Nel profilo,
     che si fonde campo per campo: la scelta si ritrova su ogni dispositivo.
     I permessi (i token) invece NO — stanno solo in questo browser. */
  calendari?: Calendari;
  /* L'INTERRUTTORE DELLE SCHERMATE NUOVE, e non lo legge più nessuno.
     Serviva mentre le schermate passavano una per una al motore nuovo; adesso
     ce n'è uno solo, e il campo resta dichiarato per una ragione sola: c'è
     scritto nei dati di chi l'ha toccato, arriva dal cloud, e `COME_UNIRE`
     pretende una regola per ogni campo di `Stato` — quindi togliere il campo
     e lasciare il dato vorrebbe dire un campo scoperto alla prima fusione,
     che è esattamente il difetto da cui è nato tutto questo file. Se ne va
     quando `normalizza` lo butterà via, e quello è un altro lavoro. */
  react?: boolean;
}

/* ------------------------------------------------------------- il timer */
export type NomeTimerDati = 'avvio' | 'blocco' | 'pomodoro' | 'libero';
export interface ImpostazioniTimer {
  /* '' o assente: si chiede ogni volta */
  predefinito?: NomeTimerDati | '';
  avvio?: number;      /* i minuti per partire */
  poi?: number;        /* quanto va avanti da solo dopo */
  blocco?: number;
  pomodoro?: number;
  pausa?: number;
  pausaLunga?: number; /* ogni quattro blocchi */
}
export interface Musica {
  predefinita?: string;
  aree?: Record<string, string>;
  /* si apre da sola quando parte il timer */
  conTimer?: boolean;
}
/* UN PEZZO DI TEMPO FATTO COL TIMER. È la riga, non il totale: i minuti del
   giorno si contano da qui, così due dispositivi non si rubano i minuti
   l'uno con l'altro (ognuno aggiunge la sua riga, la fusione le tiene
   tutte) e una sessione si può correggere dopo. L'id è fatto dall'inizio
   del blocco: se due dispositivi registrano lo stesso blocco, è una riga sola. */
export interface Sessione {
  id: string;
  giorno: Giorno;
  areaId: string | null;
  azioneId: string | null;
  testo: string;
  tipo: NomeTimerDati;
  inizio: number;
  minuti: number;
  creata: number;
  aggiornata: number;
}
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
  /* DUE CAMPI CHE MANCAVANO, e li scrive `app.ts`.
     `pausaFine` è quando finisce la pausa del pomodoro: senza, un timer in
     pausa non sapeva quando ripartire. `daAvvio` dice che il timer è nato
     come «cinque minuti per cominciare» e poi è andato avanti da sé — e in
     quel caso il tasto non dice «Ferma e registra i minuti» ma «Basta così».
     Erano scritti a mano dentro all'oggetto del timer e letti in tre punti,
     e per il tipo non esistevano: `aggiornaTimerDati` li lasciava passare
     perché fondeva le chiavi una per una senza guardare quali. */
  pausaFine?: number;
  daAvvio?: boolean;
  /* messo in pausa a mano: da quando. Alla ripresa inizio e fine si spostano avanti */
  fermoDa?: number;
  /* SE ERI DENTRO, CI TORNI. Lo schermo della concentrazione è aperto o no, e
     la risposta sta nei dati: chiudendo il telefono mentre stai lavorando, al
     ritorno lo si ritrova aperto invece di essere riportati indietro alla
     schermata da cui si era usciti apposta. Terzo campo che `app.ts` scriveva
     e che il tipo non conosceva. */
  concentrato?: boolean;
  /* chi lo fa andare: registra i minuti solo lui, se no due telefoni
     aperti li registrerebbero due volte */
  dispositivo?: string;
  /* quando è cominciata la pausa: se poi dici «ho continuato», quel tempo
     torna lavoro */
  pausaDa?: number;
}

/* LE LAPIDI. Per ogni riga tolta davvero: serve alla fusione fra dispositivi,
   perché senza, una riga cancellata qui tornerebbe viva al primo scambio con
   un telefono che non lo sapeva ancora. Le scrive `save()` da sé, guardando
   cos'è sparito — non chi cancella, che prima o poi se ne dimentica. */
export interface Lapide {
  k: string;
  chiave: string;
  ts: number;
  /* RIPORTATA IN VITA: la riga è tornata (un ripristino, un annulla). Ha la
     stessa chiave della lapide, e la fusione tiene la più recente — così il
     ritorno arriva a tutti i dispositivi, invece di essere ri-sepolto dalla
     lapide che gli altri hanno ancora. */
  vivo?: boolean;
  /* per i valori senza un'ora (un numero, i voti del giorno): si toglie solo
     QUEL valore, non quello che ci scriverai dopo nello stesso giorno */
  firma?: number;
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
  sessioni: Sessione[];
  /* quello che è arrivato storto e che invece di buttare si è messo da parte */
  recuperati: Record<string, unknown>;
  /* l'ora di un «Azzera tutto» dichiarato: è l'unica cosa che dà alla fusione
     il permesso di TOGLIERE. Senza, azzerare un dispositivo si annullerebbe
     da sé alla prima sincronizzazione con l'altro. */
  azzerato: number;
  /* L'IMPRONTA DEI DATI DI ESEMPIO: che cosa ha scritto `seedDemo`, per
     poterlo togliere e per non mandarlo mai nel cloud. `null` quando non ce
     n'è. Resta su questo dispositivo. */
  esempio?: ImprontaEsempio | null;
}
export interface ImprontaEsempio {
  ids: Record<string, string[]>;
  giorni: Record<string, Record<string, number>>;
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
  esempio: 'recente',
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
  timer: 'recente',
  sessioni: 'elenco'
} as const;
