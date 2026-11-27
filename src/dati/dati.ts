/* ============================================================
   LifeMax — LIVELLO DATI

   Stato unico in localStorage, selettori per le viste, motore XP,
   serie gentili, esperimenti N-of-1. Nessuna dipendenza esterna.

   QUESTO FILE NON È STATO RIBATTUTO A MANO, ed è una scelta.
   Dentro ci sono la fusione fra due dispositivi, le lapidi delle
   cancellazioni e i backup: tremiladuecento righe che sono costate difetti
   veri — le Scoperte svuotate da un documento più povero, i dati di esempio
   entrati in un account, una nota che si portava dietro il testo di un'altra.
   Ricopiarle a mano vorrebbe dire rischiare un errore di trascrizione
   esattamente dove costa di più. Quindi la logica è quella, riga per riga, e
   quello che è cambiato sono i TIPI: le firme, i campi dello stato, i due
   marchi su «giorno» e «ora».

   Da qui in poi è un modulo, non un globale: `import { LM } from './dati'`.
   `window.LM` resta assegnato finché l'ultimo pezzo non è passato — e poi
   sparisce anche quello.
   ============================================================ */
import type {
  Stato, Area, Azione, Attivita, Abitudine, Lezione, Esperimento,
  Ritmo, Pasto, Timer, VoceRegistro, Slot, Disfa,
  Giorno, Ora, GiornoSettimana, Verso, ModoFusione, PassoDi, Mancata,
  RegistroGiorno, Promemoria, VocePromemoria, Chiedi, PatchChiedi, Sessione, Lapide
} from '../tipi/stato';
import { COME_UNIRE, giorno, ora } from '../tipi/stato';
import type { ImprontaEsempio } from '../tipi/stato';
import { TESTI_ESEMPIO, PROFILO_ESEMPIO, DIARIO_ESEMPIO } from './esempio';
import { presa } from '../tipi/presa';

/* ---------------------------------------------------------------- ADESSO
   Queste due forme escono dalla chiusura di `creaLM` e stanno qui perché le
   legge anche il guscio: `vistaFocus` costruisce tutta la schermata «Adesso»
   su `azioneAdesso()`, e finché il tipo viveva dentro alla funzione doveva
   ricavarselo dai cinque `return`.

   UNA VOCE DI ADESSO è un'azione o un'abitudine viste con la stessa faccia:
   è tutto il punto di quella schermata — «cosa faccio ora» non distingue fra
   le due — e i tre campi in più (`serie`, `giorni`, `record`) ce li ha solo
   l'abitudine. */
export interface VoceAdesso {
  tipo: 'azione' | 'abitudine';
  id: string;
  testo: string;
  areaId: string;
  ora: Ora | null;
  durata: number | null;
  mit: boolean;
  ifThen: string;
  mancata?: Mancata | null;
  serie?: number;
  giorni?: GiornoSettimana[];
  record?: number;
}

/* COSA DICE IL PIANO ADESSO. Cinque uscite diverse, e tutte hanno la stessa
   forma: la cosa, in che stato è, e i due capi del suo blocco quando ce li ha. */
export interface CosaAdesso {
  azione: VoceAdesso | null;
  stato: 'corso' | 'ritardo' | 'libera' | 'programmata' | 'scelta' | null;
  min: number | null;
  fine: number | null;
}

/* UNA VOCE DEL DIARIO. Il diario è una vista sola su sette fonti diverse
   (registro, azioni fatte, check-in, i tre rituali, catture): sono
   raccolte in una forma unica perché la schermata le impagina insieme,
   in ordine di orologio. I campi oltre i primi due valgono per una fonte
   sola — `energia` solo per i check-in, `vittorie` solo per la settimana —
   e restano opzionali per questo, non per pigrizia. */
export interface VoceDiario {
  ts: number;
  tipo: 'registro' | 'azione' | 'checkin' | 'mattina' | 'sera' | 'settimana' | 'cattura';
  chiave?: string;
  cat?: string;
  imp?: boolean;
  tipoDisfa?: string;
  id?: string;
  testo?: string;
  areaId?: string;
  mit?: boolean;
  energia?: number;
  focus?: number;
  umore?: number;
  intenzione?: string;
  vittoria?: string;
  blocco?: string;
  vittorie?: string;
  blocchi?: string;
  imparato?: string;
  prossima?: string;
}

/* Un giorno di diario: la data e le sue voci, dalla più recente. */
export interface GiornoDiDiario {
  data: Giorno;
  eventi: VoceDiario[];
}

function creaLM() {

  /* ---------------------------------------------------------------------
     TRE FORME CHE VIVONO SOLO QUI DENTRO. Non stanno in `tipi/stato.ts`
     perché nessuna vista le vede mai: sono attrezzi del livello dati.
     --------------------------------------------------------------------- */

  /* un punto a cui tornare: la finestra di tempo che copre, e la copia dello
     stato di prima messa da parte sotto la sua chiave */
  interface PuntoRitorno { id: string; da: number; fino: number }

  /* una copia di sicurezza locale: quando, perché, e lo stato per intero */
  /* `chi`: di chi sono i dati della copia — l'uid dell'account collegato
     quando è stata presa, o '' per chi usa l'app senza account (vedi
     `proprietario`). Le copie senza `chi` sono quelle di prima della verifica
     del 25 novembre 2026 (vedi `sistemaCopieSenzaProprietario`). */
  interface CopiaSalvata { ts: number; motivo: string; data: string; chi?: string }

  /* quello che si può dire in più mettendo giù un'azione. Tutto facoltativo:
     la strada normale è scrivere il testo e basta, e ogni campo qui è una
     cosa che qualcuno ha voluto aggiungere DOPO aver scritto. */
  interface OpzAzione {
    data?: Giorno;
    ifThen?: string;
    mit?: boolean;
    ora?: Ora | null;
    durata?: number | null;
    passoDi?: PassoDi | null;
    interna?: boolean;
  }


  var STORAGE_KEY = 'lifemax.v2';

  /* LA GENERAZIONE DEI DATI DI QUESTO BROWSER. Cambia quando il dispositivo
     viene svuotato apposta: uscendo da un account, o lasciando l'esempio per
     entrare in uno. Serve alle ALTRE finestre aperte sulla stessa app: prima
     una scheda rimasta aperta, dopo «Esci» nell'altra, alla sua prima
     modifica riscriveva sul dispositivo tutti i dati dell'account appena
     chiuso — e da lì potevano finire nell'account di chi entrava dopo. Una
     finestra che trova la generazione cambiata butta quello che ha in
     memoria e rilegge. */
  var GEN_KEY = 'lifemax.generazione';
  var generazione: string | null = null;
  function leggiGenerazione(): string {
    try { return localStorage.getItem(GEN_KEY) || ''; } catch (e) { return ''; }
  }
  function nuovaGenerazione(): void {
    var g = 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    try { localStorage.setItem(GEN_KEY, g); } catch (e) { /* senza memoria: c'è una finestra sola */ }
    generazione = g;
  }
  /* il testo che QUESTA finestra ha letto o scritto per ultimo: è il «com'era
     prima» da cui si capisce cosa ha cambiato lei, e non un'altra finestra */
  var ultimoScritto: string | null = null;

  /* ==================================================================
     L'OROLOGIO DEI DATI
     ==================================================================
     Fra due dispositivi vince la modifica più recente, e «più recente» lo
     dice un orologio. Prima era quello del dispositivo e basta: un computer
     indietro di due minuti faceva risorgere una cosa cancellata, uno avanti
     di tre ore vinceva su modifiche fatte dopo di lui.
     Le ore che decidono la fusione passano tutte da qui, con due correzioni:
       · lo SCARTO col server: la nuvola misura di quanto l'orologio di
         questo dispositivo è avanti o indietro rispetto a quello di
         Firestore (`impostaScarto`, chiamata da nuvola.ts) e lo toglie;
       · e non si torna MAI indietro rispetto a un'ora già vista arrivare
         dagli altri: una cosa fatta qui dopo averne vista una fatta là ha
         sempre un'ora più grande. È l'idea dell'«orologio logico ibrido». */
  /* OROLOGI MOLTO SBAGLIATI (verifica del 25 novembre 2026, M7). Prima lo
     scarto si misurava solo all'accesso, stava solo in memoria e oltre 400
     giorni non si applicava: un telefono avanti di tre ore aperto senza
     cloud vinceva su modifiche fatte dopo, un tablet tornato al 2001
     faceva tornare indietro rinomine e cancellazioni, un PC avanti di due
     anni buttava tutte le lapidi. Adesso:
       · lo scarto misurato si RICORDA (`lm-scarto-orologio`), e vale anche
         quando il cloud non risponde; si rimisura a ogni ritorno della rete;
       · un orologio prima del PAVIMENTO (il giorno di questa versione) è
         certamente sbagliato: finché non c'è una misura si scrive dal
         pavimento in su, e le ore che arrivano dagli altri si prendono;
       · anche l'ultima ora vista si ricorda (`lm-ultimo-istante`), così
         riaprendo non si scrive mai più indietro di prima;
       · lapidi e orologi delle chiavi scadono solo con un orologio misurato
         (`scadenzaSicura`), e contando con l'ora corretta. */
  var SCARTO_KEY = 'lm-scarto-orologio';
  var ISTANTE_KEY = 'lm-ultimo-istante';
  var PAVIMENTO = Date.UTC(2026, 10, 25);
  var scartoServer = 0;
  var scartoMisurato = false;
  var ultimoIstante = 0;
  (function () {
    try {
      var v = JSON.parse(localStorage.getItem(SCARTO_KEY) || 'null');
      if (v && typeof v.ms === 'number' && isFinite(v.ms)) { scartoServer = v.ms; scartoMisurato = true; }
      var u = Number(localStorage.getItem(ISTANTE_KEY)) || 0;
      if (u > 0 && isFinite(u)) ultimoIstante = u;
    } catch (e) { /* senza memoria si parte da zero */ }
  })();
  function oraCorretta(): number {
    var t = Date.now() + scartoServer;
    return (!scartoMisurato && t < PAVIMENTO) ? PAVIMENTO : t;
  }
  function adesso(): number {
    var t = oraCorretta();
    if (t <= ultimoIstante) t = ultimoIstante + 1;
    ultimoIstante = t;
    return t;
  }
  /* un'ora arrivata da fuori: da qui in poi non si scrive niente di più
     vecchio. Un'ora più avanti di un giorno non si prende: è un orologio
     rotto, e seguirlo vorrebbe dire rompere anche questo — tranne quando il
     rotto è questo (prima del pavimento, e non ancora misurato). */
  function osserva(t: unknown): void {
    if (typeof t !== 'number' || !isFinite(t)) return;
    var dubbio = !scartoMisurato && Date.now() + scartoServer < PAVIMENTO;
    if (!dubbio && t > oraCorretta() + 86400000) return;
    if (t > ultimoIstante) ultimoIstante = t;
  }
  /* sotto i cinque secondi non vale la pena correggere: è il tempo di un
     giro di rete, e la misura stessa non è più precisa di così. Nessun tetto
     di giorni: un orologio indietro di venticinque anni va corretto più di
     tutti. */
  function impostaScarto(ms: number): void {
    if (typeof ms !== 'number' || !isFinite(ms)) return;
    scartoServer = Math.abs(ms) > 5000 ? Math.round(ms) : 0;
    scartoMisurato = true;
    /* UN OROLOGIO CHE ERA AVANTI NON AVVELENA PIÙ IL DISPOSITIVO (verifica 3,
       N4). Prima l'orologio logico non si riportava mai indietro: un PC
       rimasto un momento avanti di 400 giorni scriveva, per 400 giorni, ore
       che vincevano su tutto quello che gli altri facevano DOPO. La regola
       «una modifica fatta dopo qui ha un'ora più grande» vale per i
       secondi, non per un anno: adesso, misurato l'orologio, l'orologio
       logico si riporta al più a un secondo davanti all'ora vera. Le ore
       scritte nel frattempo restano quelle che sono. */
    tetto();
    try { localStorage.setItem(SCARTO_KEY, JSON.stringify({ ms: scartoServer, quando: Date.now() + scartoServer })); } catch (e) { /* vale per questa sessione */ }
  }
  /* quanto l'orologio logico può stare davanti all'ora vera (misurata) */
  var ANTICIPO_MAX = 1000;
  function tetto(): void {
    if (!scartoMisurato) return;
    var limite = Date.now() + scartoServer + ANTICIPO_MAX;
    if (ultimoIstante > limite) ultimoIstante = limite;
  }
  /* da quando in là lapidi e orologi possono scadere; null = non si sa, e
     allora non scade niente */
  function scadenzaSicura(durata: number): number | null {
    if (!scartoMisurato) return null;
    return Date.now() + scartoServer - durata;
  }

  /* IL NOME DI QUESTO DISPOSITIVO, lo stesso che usano il timer e i
     promemoria. Serve ai punti (`xpConti`): ognuno conta i suoi. */
  var questoDispositivo = '';
  function idDispositivo(): string {
    if (questoDispositivo) return questoDispositivo;
    var v = '';
    try { v = localStorage.getItem('lm-dispositivo') || ''; } catch (e) { v = ''; }
    if (!v) {
      v = 'd' + Math.random().toString(36).slice(2, 10);
      try { localStorage.setItem('lm-dispositivo', v); } catch (e) { /* vale per questa sessione */ }
    }
    questoDispositivo = v;
    return v;
  }

  /* ---------- date utils (sempre timezone locale) ---------- */

  function pad(n: number): string { return (n < 10 ? '0' : '') + n; }

  /* IL SOLO POSTO DOVE UNA STRINGA DIVENTA UN «GIORNO».
     Il marchio su `Giorno` esiste per una ragione vista dal vero: un giorno
     ('2026-09-07') e un'ora ('07:30') erano entrambi stringhe, e scambiarli
     passava liscio. Qui c'è l'unico punto in cui un giorno si costruisce da
     zero, quindi qui c'è l'unica conversione — da tutte le altre parti il
     tipo si porta dietro da sé. */
  function dayKey(d: Date): Giorno {
    return (d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())) as Giorno;
  }

  function parseKey(k: Giorno): Date {
    var p = k.split('-');
    return new Date(+(p[0] || 0), +(p[1] || 1) - 1, +(p[2] || 1));
  }

  function todayKey(): Giorno { return dayKey(new Date()); }

  function addDays(k: Giorno, n: number): Giorno {
    var d = parseKey(k);
    d.setDate(d.getDate() + n);
    return dayKey(d);
  }

  /* `.getTime()` e non due Date sottratte: in JavaScript funzionava per
     conversione implicita, ed è il genere di riga che si legge due volte */
  function daysBetween(a: Giorno, b: Giorno): number {
    return Math.round((parseKey(b).getTime() - parseKey(a).getTime()) / 86400000);
  }

  function lastNDays(n: number): Giorno[] {
    var out: Giorno[] = [], t = todayKey();
    for (var i = n - 1; i >= 0; i--) out.push(addDays(t, -i));
    return out;
  }

  var GIORNI_BREVI = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'] as const;
  function weekdayShort(k: Giorno): string {
    return GIORNI_BREVI[parseKey(k).getDay()] || '';
  }

  var MESI_BREVI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'] as const;
  function fmtShort(k: Giorno): string {
    var d = parseKey(k);
    return d.getDate() + ' ' + (MESI_BREVI[d.getMonth()] || '');
  }

  /* Lunedì della settimana di k — chiave per le review settimanali */
  function weekKey(k: Giorno): Giorno {
    var d = parseKey(k);
    var dow = (d.getDay() + 6) % 7; // 0 = lunedì
    d.setDate(d.getDate() - dow);
    return dayKey(d);
  }

  /* ---------- aree di vita (ordine fisso ⇒ slot colore fisso) ---------- */
  /* Lo slot colore segue l'entità, mai il rango: la mappatura non cambia
     se un'area viene filtrata o riordinata in una vista. */

  var AREE_DEFAULT: Area[] = [
    { id: 'studio',       nome: 'Studio / Università', icona: 'book',      slot: 1, sistema: 'Sessioni di studio profondo pianificate la sera prima' },
    { id: 'salute',       nome: 'Salute & Sport',      icona: 'heart',     slot: 2, sistema: 'Allenamento o camminata prima delle 10:00' },
    { id: 'relazioni',    nome: 'Relazioni & Sociale', icona: 'users',     slot: 3, sistema: 'Un contatto significativo al giorno' },
    { id: 'finanze',      nome: 'Finanze',             icona: 'wallet',    slot: 4, sistema: 'Revisione spese ogni domenica sera' },
    { id: 'associazioni', nome: 'Associazioni',        icona: 'landmark',  slot: 5, sistema: 'Blocco settimanale dedicato, non frammentato' },
    { id: 'founder',      nome: 'Progetti Founder',    icona: 'rocket',    slot: 6, sistema: 'Prima ora del mattino sul progetto, prima delle mail' },
    { id: 'lavoro',       nome: 'Lavoro',              icona: 'briefcase', slot: 7, sistema: 'Chiusura giornata con lista per domani' },
    { id: 'altro',        nome: 'Altro / Esplorazione',icona: 'lightbulb', slot: 8, sistema: 'Spazio libero per la novità: una cosa nuova a settimana' }
  ];

  /* IL COLORE DI UN'AREA È UN NOME, NON UN VALORE.
     Qui c'era la tavolozza scritta a mano — slot → [chiaro, scuro] — e
     `coloreArea()` sceglieva fra i due guardando il tema IN QUEL MOMENTO.
     Due difetti venivano da lì: chi la chiamava senza passare da qui
     (l'onboarding prendeva sempre il valore chiaro, anche al buio) e chi
     aveva già disegnato restava del tema vecchio finché non ridisegnava.
     Adesso restituisce `var(--area-N)`, e i valori per chiaro e scuro
     stanno in token.css con tutti gli altri colori: il browser sceglie da
     sé, sempre.
     I colori sono quelli del sistema «Kubo» (Studio non è più blu, perché
     il blu è il tasto; Salute non è più verde, perché il verde è «fatto»).
     NON sono distinguibili fra loro da chi ha una carenza cromatica — in
     deuteranopia Salute, Finanze e Altro si avvicinano — e non devono
     esserlo: un'area non si dice mai col colore da solo, c'è sempre il suo
     segno e il suo nome (SC 1.4.1).

     I DATI SALVATI NON CAMBIANO. Un'area salvata porta il suo `slot`, mai un
     colore: il colore si ricava dallo slot a ogni disegno. Per questo il
     nuovo sistema arriva a tutti — anche alle aree rinominate o aggiunte a
     mano, che tengono nome, icona e slot — senza nessuna migrazione dello
     stato, e un dispositivo col codice vecchio che si sincronizza con uno
     nuovo non riceve niente da tradurre. */
  function coloreArea(area: Area): string {
    var slot = area && area.slot >= 1 && area.slot <= 8 ? area.slot : 8;
    return 'var(--area-' + slot + ')';
  }

  /* ---------- XP ---------- */

  var XP_EVENTI = {
    azione: 10,       // azione completata
    mit: 15,          // la MIT (Most Important Task) del giorno
    checkin: 3,       // check-in rapido (10 secondi)
    pianoMattina: 5,  // piano del mattino compilato
    reviewSera: 8,    // chiusura serale
    reviewSettimana: 25,
    cattura: 1,       // brain dump: ricompensa piccola ma immediata
    triage: 2,        // smistare un elemento dall'inbox
    abitudine: 8      // completare un'abitudine ricorrente del giorno
  };

  /* ---------- stato ---------- */

  /* Ritmo della giornata: sonno, sveglia e pasti. Serve alla timeline
     "La giornata", che rende visibile come è divisa la giornata (utile
     contro la difficoltà a percepire il tempo — Barkley 1997). */
  /* QUANDO L'APP FA LE SUE DUE DOMANDE, e se le fa.
     Sono le uniche due volte in cui l'app apre qualcosa senza che glielo si
     sia chiesto, e per questo devono stare in mano a chi le riceve: c'è chi si
     alza alle undici e chi cena alle dieci, e un pop-up che arriva nel momento
     sbagliato non è un promemoria, è un'interruzione. `on` spegne la domanda
     senza spegnere il posto dove si risponde: il registro resta nei Rituali,
     dove sta di casa. */
  var CHIEDI_DEFAULT = {
    notte: { on: true, da: '05:00', a: '14:00' },
    giorno: { on: true, da: '19:00' }
  };
  var RITMO_DEFAULT = {
    sveglia: '07:30',
    sonno: '23:30',
    pasti: [
      { id: 'colazione', nome: 'Colazione', ora: '08:00', durata: 15 },
      { id: 'pranzo', nome: 'Pranzo', ora: '13:00', durata: 45 },
      { id: 'cena', nome: 'Cena', ora: '20:00', durata: 45 }
    ]
  };

  function statoVuoto(): Stato {
    return {
      versione: 1,
      updatedAt: 0,
      onboarded: false,
      demo: false,
      /* la banda «dati di esempio» è stata chiusa a mano? Una volta chiusa
         resta chiusa, anche se l'altro dispositivo non lo sa ancora: per
         questo si fonde con 'oppure' e non «vince il più recente». */
      demoChiusa: false,
      /* giornataPos: dove mostrare la timeline della giornata
         ('oggi-strip' | 'panoramica' | 'oggi-full' | 'menu') */
      profilo: { nome: '', visione: '', skin: 'quiete', modo: 'auto', scorri: 'si', effetti: 'pieni', suono: 'si', vibra: 'si', giornataPos: 'oggi-strip', ritmo: JSON.parse(JSON.stringify(RITMO_DEFAULT)), chiedi: JSON.parse(JSON.stringify(CHIEDI_DEFAULT)) },
      ritmoGiorno: {},   // ritmoGiorno[data] = {sveglia?, sonno?, prec?, pasti?, chiesto?} — registro di sonno e pasti del singolo giorno
      /* l'ultima volta che ti ho visto. Serve a una cosa sola, ed è
         importante: sapere se fra ieri e oggi c'è stato un BUCO in cui la
         notte ci sta. Chi è rimasto sveglio fino alle quattro e riapre l'app
         alle quattro e dieci non deve sentirsi chiedere com'è andata la
         notte. */
      visto: 0,
      aree: JSON.parse(JSON.stringify(AREE_DEFAULT)),
      areeAttive: AREE_DEFAULT.map(function (a) { return a.id; }),
      azioni: [],        // {id, areaId, testo, ifThen, mit, done, data, doneAt, creata}
      inbox: [],         // {id, testo, creata} — cattura grezza, ancora da smistare
      backlog: [],       // {id, testo, areaId, creata, scadenza?} — attività "da fare" senza data (con scadenza opzionale)
      abitudini: [],     // {id, testo, areaId, giorni:[0..6], creata, fatti:{data:true}} — ricorrenti
      checkins: [],      // {data, ts, energia, focus, umore, contesto}
      valutazioni: {},   // valutazioni[data][areaId] = 1..5 (sera)
      minuti: {},        // minuti[data][areaId] = minuti dedicati
      pianoMattina: {},  // pianoMattina[data] = {compilato:true, intenzione}
      reviewSera: {},    // reviewSera[data] = {vittoria, blocco, shutdown}
      reviewSettimana: {}, // reviewSettimana[lunedì] = {vittorie, blocchi, imparato, prossima}
      esperimenti: [],   // vedi motore N-of-1 sotto
      /* Quello che hai capito su di te SENZA esperimento: una riga, un verso
         (mi funziona / non mi funziona) e come fai a saperlo. Un esperimento
         N-of-1 dura settimane, e nel frattempo le cose che uno impara su di sé
         arrivano ogni giorno e se ne vanno: se l'unico posto dove metterle è
         un esperimento, non le scrive nessuno. */
      lezioni: [],       // {id, testo, verso:'si'|'no', forza, areaId, creata, aggiornata, espId?}
      xp: 0,
      xpPerGiorno: {},   // xpPerGiorno[data] = n
      log: [],           // (deprecato) eventi recenti per feedback immediato
      registro: [],      // {ts, cat, testo, imp} — storico di tutto ciò che fai (Diario)
      /* LE LAPIDI: {k, chiave, ts} per ogni riga tolta davvero. Servono alla
         fusione fra dispositivi — senza, una riga cancellata qui tornerebbe
         viva al primo scambio con un telefono che non lo sapeva ancora. Se le
         scrive `save()` da sé, guardando cos'è sparito. */
      cancellati: [],
      /* {azioneId, areaId, tipo, testo, inizio, fine, durata, ciclo, inPausa,
          fermatoA} — null quando non c'è nessun timer in giro */
      timer: null,
      sessioni: [],
      /* quello che è arrivato storto e che invece di buttare si è messo da
         parte: {campo: {quando, valore}} */
      recuperati: {},
      /* l'ora di un «Azzera tutto» dichiarato. È l'unica cosa che dà alla
         fusione il permesso di togliere: senza, azzerare un dispositivo si
         annullerebbe da sé alla prima sincronizzazione con l'altro. */
      azzerato: 0,
      esempio: null,
      /* le ore delle chiavi cambiate o tolte (vedi `segnaOrologi`) */
      orologi: {},
      /* i punti contati dispositivo per dispositivo (vedi `ricalcolaXp`) */
      xpConti: {}
    };
  }


  /* ==================================================================
     FONDERE DUE COPIE SENZA PERDERE NIENTE
     ==================================================================
     PERCHÉ ESISTE. Fino a ieri due dispositivi si scambiavano il documento
     INTERO e vinceva il più recente. C'era una sola protezione: non adottare
     mai un documento VUOTO. Non bastava, e si è visto: basta che una copia sia
     più povera in UN punto — un iPad con otto scoperte e un telefono con zero,
     perché quelle scoperte sono nate quando il telefono era offline — e alla
     prima cosa fatta sul telefono il suo documento diventa il più recente,
     sale, e le otto scoperte spariscono da tutte le parti. Il conto totale
     degli elementi era alto (il telefono aveva un mucchio di azioni), quindi
     la protezione contro il vuoto non scattava. Il registro delle Scoperte si
     è svuotato così.
     La cura non è un'altra soglia: è smettere di scegliere un vincitore.
     Due copie si UNISCONO, riga per riga, e quello che c'è da una parte sola
     resta. Vince il più recente solo dove le due dicono davvero cose diverse
     sulla STESSA riga.

     COME SI FA A NON DIMENTICARSENE DOMANI. La tabella qui sotto deve nominare
     OGNI campo dello stato. Se domani se ne aggiunge uno e non lo si nomina,
     `unisci` alza le mani e `prove/dati.js` diventa rosso con scritto quale
     campo manca. Non è una convenzione da ricordare: è una prova che non passa.
     ------------------------------------------------------------------ */

  /* LE REGOLE DI FUSIONE STANNO IN UN POSTO SOLO, e non è più questo.
     Qui c'era la loro copia: la stessa tabella scritta due volte, una in
     `src/tipi/stato.ts` e una qui — e questa, essendo locale, oscurava
     quella. Cioè la garanzia del compilatore («una regola per ogni campo di
     Stato, o non compila») in questo file non proteggeva niente.
     È esattamente il difetto che quella garanzia esiste per impedire, e ce
     l'aveva in casa. Adesso la tabella è una, arriva da `../tipi/stato`, e
     il suo tipo dice che se aggiungi un campo senza regola non si compila.
     I modi — elenco, insieme, mappa, ramo, recente, massimo, oppure — sono
     spiegati uno per uno là, accanto al tipo `ModoFusione`. */

  /* IL TIPO ONESTO DELLA MACCHINA DELLA FUSIONE.
     Da qui alla fine di `unisci` il codice cammina su chiavi qualunque di
     oggetti qualunque: non sa — e non deve sapere — se sta guardando
     un'azione o un'abitudine. Il tipo giusto non è `Stato`: è «un dizionario
     di cui non conosco il contenuto», e ogni volta che si scende dentro si
     controlla invece di fidarsi. Dare `Stato` a queste funzioni vorrebbe dire
     mentire, e mentire al compilatore costa più che tacergli qualcosa. */
  type Mappa = Record<string, unknown>;

  function eMappa(v: unknown): v is Mappa {
    return !!v && typeof v === 'object' && !Array.isArray(v);
  }

  /* L'IDENTITÀ DI UNA RIGA. Quasi tutte hanno un `id`. Quelle che non ce
     l'hanno — il registro, i check-in — hanno un istante e un testo, e due
     righe con lo stesso istante e lo stesso testo sono la stessa riga. Senza
     questo, ogni fusione raddoppierebbe il diario. */
  function chiaveRiga(r: unknown): string {
    if (!eMappa(r)) return 'v' + JSON.stringify(r);
    /* UNA LAPIDE SI RICONOSCE DA COSA SEPPELLISCE, non dall'ora. Prima cadeva
       nel caso «ts»: tutte le lapidi nate nello stesso gesto (togliere
       l'esempio, svuotare un elenco) avevano la stessa chiave, alla prima
       fusione ne restava UNA, e tutto il resto tornava in vita. */
    if (typeof r['k'] === 'string' && r['chiave'] !== undefined) return 'L' + r['k'] + '|' + String(r['chiave']);
    if (r['id'] !== undefined && r['id'] !== null && r['id'] !== '') return 'i' + String(r['id']);
    if (r['ts'] !== undefined && r['ts'] !== null) {
      return 't' + String(r['ts']) + '|' + String(r['testo'] || r['cat'] || r['data'] || '');
    }
    if (r['data'] !== undefined && r['data'] !== null) return 'd' + String(r['data']);
    return 'v' + JSON.stringify(r);
  }

  /* QUANDO QUESTA RIGA È STATA TOCCATA L'ULTIMA VOLTA.
     Se la riga porta `aggiornata`, decide quella e basta: la scrive
     `segnaOrologi` a ogni salvataggio che cambia la riga, con l'orologio
     corretto (vedi `adesso`), anche quando il cambiamento è TOGLIERE
     qualcosa. Prima si prendeva il più grande fra tutti i campi con un'ora,
     e togliere una spunta azzerava `doneAt`: la versione «fatta» sembrava
     sempre la più recente, e la spunta tolta tornava indietro alla prima
     fusione. E un `creata` scritto da un dispositivo con l'orologio avanti
     di tre ore batteva tutte le modifiche fatte dopo.
     Le righe scritte prima di questo cambiamento non hanno `aggiornata`, e
     per loro vale la regola di prima: il più grande dei campi con un'ora,
     o l'orologio del documento da cui vengono. */
  var CAMPI_MOMENTO = ['aggiornata', 'doneAt', 'ts', 'completatoAt', 'chiusoAt', 'creata'] as const;
  function momentoRiga(r: unknown, quandoDoc: number): number {
    var v = 0;
    if (eMappa(r)) {
      var agg = r['aggiornata'];
      if (typeof agg === 'number' && agg > 0) return agg;
      for (var i = 0; i < CAMPI_MOMENTO.length; i++) {
        var nome = CAMPI_MOMENTO[i];
        var x = nome === undefined ? undefined : r[nome];
        if (typeof x === 'number' && x > v) v = x;
      }
    }
    return v || quandoDoc || 0;
  }

  /* ==================================================================
     LA FUSIONE CON GLI OROLOGI
     ==================================================================
     Due copie si uniscono chiave per chiave, e dove dicono cose diverse
     decide chi ha toccato quella chiave per ultimo. Chi l'ha toccata lo
     dicono gli `orologi` di ognuna delle due copie (vedi `segnaOrologi`):
     un orologio su una chiave vuol dire «questa chiave l'ho cambiata, o
     TOLTA, a quest'ora». Un orologio su un ramo intero (`valutazioni`, o un
     giorno) vale per tutto quello che ci sta sotto, a meno che sotto ci sia
     un orologio più recente.
     Così, per la prima volta, togliere qualcosa da una mappa arriva agli
     altri dispositivi: una spunta tolta, un orario rimesso come prima, un
     voto cancellato. Prima la fusione univa le chiavi e basta, e quello
     che era stato tolto da una parte tornava dall'altra.
     Dove nessuna delle due ha un orologio — i dati scritti prima di questo
     cambiamento, o due dispositivi che scrivono la stessa chiave per la
     prima volta — vale la regola di sempre: vince il documento più recente,
     e quello che c'è da una parte sola resta. */
  interface Fusione { oa: Record<string, number>; ob: Record<string, number>; qa: number; qb: number }
  type Foglia = (x: unknown, y: unknown, qx: number, qy: number) => unknown;
  var NIENTE: Record<string, number> = {};

  /* un pezzo della strada: la «/» separa i pezzi, quindi dentro un pezzo non ci può stare */
  function pezzoVia(k: string): string { return String(k).replace(/%/g, '%25').replace(/\//g, '%2F'); }
  function orologioDi(o: Record<string, number>, via: string, eredita: number): number {
    var v = o[via];
    return (typeof v === 'number' && v > eredita) ? v : eredita;
  }
  function stessoValore(x: unknown, y: unknown): boolean {
    if (x === y) return true;
    if (!x || !y || typeof x !== 'object' || typeof y !== 'object') return false;
    try { return JSON.stringify(x) === JSON.stringify(y); } catch (e) { return false; }
  }
  function vinceRecente(x: unknown, y: unknown, qx: number, qy: number): unknown { return (qy >= qx) ? y : x; }
  /* due conti di punti dello stesso dispositivo: [dati, tolti] crescono e
     basta, quindi il più grande è sempre il più aggiornato */
  function massimoConto(x: unknown, y: unknown, qx: number, qy: number): unknown {
    if (!Array.isArray(x) || !Array.isArray(y)) return vinceRecente(x, y, qx, qy);
    return [Math.max(Number(x[0]) || 0, Number(y[0]) || 0), Math.max(Number(x[1]) || 0, Number(y[1]) || 0)];
  }

  /* due dizionari, con la strada fino a loro e l'orologio ereditato da sopra */
  function unisciNodo(x: Mappa, y: Mappa, via: string, ea: number, eb: number, f: Fusione, foglia: Foglia): Mappa {
    var out: Mappa = {};
    var chiavi = Object.keys(x);
    Object.keys(y).forEach(function (k) { if (!Object.prototype.hasOwnProperty.call(x, k)) chiavi.push(k); });
    chiavi.forEach(function (k) {
      var p = via + '/' + pezzoVia(k);
      var pa = orologioDi(f.oa, p, ea), pb = orologioDi(f.ob, p, eb);
      var inX = Object.prototype.hasOwnProperty.call(x, k), inY = Object.prototype.hasOwnProperty.call(y, k);
      var vx = x[k], vy = y[k];
      if (inX && inY) {
        if (eMappa(vx) && eMappa(vy)) { out[k] = unisciNodo(vx, vy, p, pa, pb, f, foglia); return; }
        if (stessoValore(vx, vy)) { out[k] = vx; return; }
        if (pa > pb) out[k] = vx;
        else if (pb > pa) out[k] = vy;
        else out[k] = foglia(vx, vy, f.qa, f.qb);
        return;
      }
      /* C'È DA UNA PARTE SOLA. Resta, a meno che l'altra parte l'abbia tolta
         DOPO l'ultima volta che questa l'ha toccata. Se è un ramo, si guarda
         dentro: quello che sotto è stato toccato dopo la cancellazione resta. */
      var solo = inX ? vx : vy, mio = inX ? pa : pb, suo = inX ? pb : pa;
      if (!(suo > mio)) { out[k] = solo; return; }
      if (eMappa(solo)) {
        var resto = inX ? unisciNodo(solo, {}, p, pa, pb, f, foglia) : unisciNodo({}, solo, p, pa, pb, f, foglia);
        if (Object.keys(resto).length) out[k] = resto;
      }
    });
    return out;
  }
  /* la radice di un campo che è un dizionario (una mappa, il profilo) */
  function unisciRadice(va: unknown, vb: unknown, via: string, f: Fusione, foglia: Foglia): unknown {
    if (!eMappa(va) || !eMappa(vb)) return foglia(va, vb, f.qa, f.qb);
    return unisciNodo(va, vb, via, orologioDi(f.oa, via, 0), orologioDi(f.ob, via, 0), f, foglia);
  }

  /* due versioni della STESSA riga. Vince la più recente campo per campo, ma
     i dizionari dentro la riga si uniscono chiave per chiave, con gli
     orologi: le spunte di un'abitudine (`fatti`, `salti`) sono un giorno per
     chiave, e prendere in blocco quelle di una copia sola vuol dire buttare
     via le spunte messe sull'altro dispositivo — mentre unirle e basta
     faceva tornare quelle tolte. */
  function unisciRiga(x: unknown, y: unknown, qx: number, qy: number, via?: string, f?: Fusione): unknown {
    if (!eMappa(x) || !eMappa(y)) return (qy >= qx) ? y : x;
    var dx = x, dy = y;
    var fr: Fusione = { oa: f ? f.oa : NIENTE, ob: f ? f.ob : NIENTE, qa: qx, qb: qy };
    var base = (via || '?') + '/';
    var out: Mappa = {};
    var chiavi = Object.keys(dx);
    Object.keys(dy).forEach(function (k) { if (!Object.prototype.hasOwnProperty.call(dx, k)) chiavi.push(k); });
    /* CAMPO PER CAMPO (verifica del 25 novembre 2026, G1). Prima vinceva la
       riga più recente INTERA: rinominare un'azione sul telefono senza rete e
       spuntarla poco dopo dal computer faceva sparire la rinomina, ovunque —
       e lo stesso col titolo cambiato in Google e la spunta data in LifeMax.
       Adesso ogni campo cambiato ha il suo orologio (`azioni/<id>/testo`,
       `…/done`: li scrive `segnaOrologi`), e per ogni campo vince chi l'ha
       toccato per ultimo. Dove nessuna delle due ha un orologio per quel
       campo (le righe scritte prima), vale la regola di prima: la riga più
       recente. */
    chiavi.forEach(function (k) {
      var inX = Object.prototype.hasOwnProperty.call(dx, k), inY = Object.prototype.hasOwnProperty.call(dy, k);
      var vx = dx[k], vy = dy[k];
      if (k === 'aggiornata') { out[k] = Math.max(Number(vx) || 0, Number(vy) || 0) || (inX ? vx : vy); return; }
      if (eMappa(vx) && eMappa(vy)) { out[k] = unisciRadice(vx, vy, base + pezzoVia(k), fr, vinceRecente); return; }
      if (inX && inY && stessoValore(vx, vy)) { out[k] = vx; return; }
      var p = base + pezzoVia(k);
      var ca = f ? orologioDi(f.oa, p, 0) : 0, cb = f ? orologioDi(f.ob, p, 0) : 0;
      var daY = ca !== cb ? cb > ca : qy >= qx;
      var da = daY ? dy : dx, altra = daY ? dx : dy;
      if (Object.prototype.hasOwnProperty.call(da, k)) out[k] = da[k];
      /* il campo manca nella versione scelta: se lo decide un orologio vuol
         dire «tolto», se no (righe di prima) resta quello che c'è */
      else if (ca === cb && Object.prototype.hasOwnProperty.call(altra, k)) out[k] = altra[k];
    });
    return out;
  }

  function unisciElenco(x: unknown, y: unknown, qx: number, qy: number, campo?: string, f?: Fusione): unknown[] {
    var out: { r: unknown; q: number; c: string }[] = [];
    var indice: Record<string, number> = {};
    var metti = function (arr: unknown, q: number) {
      if (!Array.isArray(arr)) return;
      for (var i = 0; i < arr.length; i++) {
        var r: unknown = arr[i], k = chiaveRiga(r);
        var dove = indice[k];
        if (dove === undefined) { indice[k] = out.length; out.push({ r: r, q: momentoRiga(r, q), c: k }); continue; }
        var g = out[dove];
        if (!g) continue;
        var qr = momentoRiga(r, q);
        g.r = unisciRiga(g.r, r, g.q, qr, (campo || '?') + '/' + pezzoVia(k), f);
        g.q = Math.max(g.q, qr);
      }
    };
    metti(x, qx); metti(y, qy);
    return out.map(function (g) { return g.r; });
  }

  /* LE AREE ATTIVE, CON L'ORA. Prima erano un insieme che si univa e basta:
     un'area spenta su un dispositivo tornava accesa alla prima fusione con
     un altro, che l'aveva ancora. Adesso spegnere e accendere lascia un
     orologio (`areeAttive/<id>`), e un'area che c'è da una parte sola resta
     solo se l'altra non l'ha spenta dopo. */
  function unisciInsieme(x: unknown, y: unknown, campo?: string, f?: Fusione): unknown[] {
    var out: unknown[] = [];
    var visti: Record<string, boolean> = {};
    var inX: Record<string, boolean> = {}, inY: Record<string, boolean> = {};
    if (Array.isArray(x)) x.forEach(function (v: unknown) { inX[String(v)] = true; });
    if (Array.isArray(y)) y.forEach(function (v: unknown) { inY[String(v)] = true; });
    [x, y].forEach(function (arr) {
      if (!Array.isArray(arr)) return;
      arr.forEach(function (v: unknown) {
        var k = String(v);
        if (visti[k]) return;
        visti[k] = true;
        if (f && campo && !(inX[k] && inY[k])) {
          var p = campo + '/' + pezzoVia(k);
          var pa = orologioDi(f.oa, p, 0), pb = orologioDi(f.ob, p, 0);
          if (inX[k] ? pb > pa : pa > pb) return;   /* spenta dall'altra parte, dopo */
        }
        out.push(v);
      });
    });
    return out;
  }

  /* LE LAPIDI. Senza, una riga cancellata su un telefono tornerebbe viva alla
     prima fusione con un dispositivo che non lo sapeva ancora. Non le scrive
     nessuna delle venti funzioni che cancellano: le scrive `save()` da sé
     confrontando com'era e com'è (vedi `segnaLapidi`), così una funzione che
     cancella e che verrà scritta domani è già coperta. */
  /* QUANTO DURA UNA LAPIDE (e un orologio). Erano sei mesi, e un iPad
     lasciato in un cassetto più a lungo poteva far risorgere quello che era
     stato cancellato nel frattempo. Adesso sono due anni; e per chi torna
     dopo ancora più tempo c'è la regola dell'assenza lunga (vedi `unisci`). */
  var DURATA_LAPIDI = 730 * 24 * 3600 * 1000;
  function applicaLapidi(s: Stato): Stato {
    if (!Array.isArray(s.cancellati) || !s.cancellati.length) return s;
    var perCampo: Record<string, Record<string, number>> = {};
    /* la stessa cosa vista per chiave: questo giro passa su campi che non
       sa quali sono, e li tratta tutti allo stesso modo */
    var perChiave = s as unknown as Record<string, unknown>;
    var ultima: Record<string, { ts: number; vivo: boolean; firma: number | undefined }> = {};
    s.cancellati.forEach(function (t) {
      if (!t || !t.k || !t.chiave) return;
      var id = t.k + '\u0000' + t.chiave;
      var pre = ultima[id];
      if (!pre || t.ts >= pre.ts) ultima[id] = { ts: t.ts, vivo: !!t.vivo, firma: t.firma };
    });
    var firme: Record<string, Record<string, number>> = {};
    Object.keys(ultima).forEach(function (id) {
      var u = ultima[id]; if (!u || u.vivo) return;   /* tornata: niente da togliere */
      var pz = id.split('\u0000'), k = pz[0] || '', chiave = pz.slice(1).join('\u0000');
      var p = perCampo[k] || (perCampo[k] = {});
      p[chiave] = u.ts;
      if (u.firma !== undefined) (firme[k] || (firme[k] = {}))[chiave] = u.firma;
    });
    Object.keys(perCampo).forEach(function (k) {
      var lista = perChiave[k];
      var p = perCampo[k];
      /* anche i giorni di una mappa (il diario, i voti): la chiave è il giorno */
      if (p && eMappa(lista)) {
        var m = lista as Record<string, unknown>, lp = p;
        Object.keys(lp).forEach(function (g) {
          if (!(g in m)) return;
          var v = m[g];
          var fk = firme[k] && firme[k][g];
          if (fk !== undefined) { if (firma(v) === fk) delete m[g]; return; }
          var quando = eMappa(v) ? momentoRiga(v, 0) : 0;
          if ((lp[g] as number) >= quando) delete m[g];
        });
        return;
      }
      if (!Array.isArray(lista) || !p) return;
      var lapidi = p;
      perChiave[k] = lista.filter(function (r: unknown) {
        var t = lapidi[chiaveRiga(r)];
        /* «maggiore O UGUALE», e non è un dettaglio: creare e cancellare la
           stessa riga possono capitare nello stesso millesimo di secondo — la
           prova lo fa, e un utente veloce pure — e con il confronto stretto la
           lapide non contava niente e la riga tornava viva. Nel dubbio, fra
           una cancellazione e una modifica dello stesso istante, vince la
           cancellazione: è la sola delle due che qualcuno ha chiesto due
           volte (togliere, e confermare). */
        return !(t && t >= momentoRiga(r, 0));
      });
    });
    /* NIENTE PIÙ TETTO DI TREMILA. «Azzera tutto» su chi ha più di tremila
       righe ne lasciava senza lapide le più vecchie, che alla prima fusione
       tornavano. Le lapidi adesso viaggiano nel cloud divise per mese (vedi
       src/nuvola/pezzi.ts), quindi il loro numero non pesa più su un
       documento solo; resta solo la scadenza. */
    var soglia = scadenzaSicura(DURATA_LAPIDI);
    s.cancellati = s.cancellati.filter(function (t) { return t && (soglia === null || t.ts > soglia); });
    return s;
  }

  /* COME SI UNISCE, OLTRE AI DUE STATI.
     `nuovo`: quale delle due copie viene da un dispositivo che con questo
     account NON si è mai unito (un telefono nuovo, l'app reinstallata, un
     browser che ha cancellato i dati, l'altro indirizzo del sito). Quella
     copia non vince MAI dove le due dicono cose diverse senza un orologio a
     decidere, e i suoi orologi del profilo non contano: è il caso in cui un
     telefono appena aperto, coi valori di partenza e l'ora di adesso,
     azzerava nome, visione e sveglia su tutti i dispositivi.
     `assenzaLunga`: la copia `a` viene da un dispositivo che non si è
     sincronizzato da più tempo di quanto durano le lapidi. Quello che quella
     copia ha e l'altra no, ed era già lì all'ultima sincronizzazione (`da`),
     era nel cloud allora: se adesso nel cloud non c'è, è stato tolto — anche
     se la lapide, nel frattempo, è scaduta. */
  interface OpzUnisci { nuovo?: 'a' | 'b'; assenzaLunga?: { da: number } }

  /* IL PUNTO DI ENTRATA. `a` e `b` sono due stati interi; torna un terzo che
     contiene tutto quello che c'era nei due. Non tocca né `a` né `b`. */
  function unisci(a: unknown, b: unknown, opz?: OpzUnisci): Stato | null {
    if (!eMappa(a)) return b ? JSON.parse(JSON.stringify(b)) : null;
    if (!eMappa(b)) return JSON.parse(JSON.stringify(a));
    var qa = Number(a.updatedAt) || 0, qb = Number(b.updatedAt) || 0;
    var oa = eMappa(a['orologi']) ? a['orologi'] as Record<string, number> : NIENTE;
    var ob = eMappa(b['orologi']) ? b['orologi'] as Record<string, number> : NIENTE;
    /* la copia mai unita: perde i pareggi, e il suo profilo non ha orologi */
    var senzaProfilo = function (o: Record<string, number>) {
      var r: Record<string, number> = {};
      Object.keys(o).forEach(function (k) { if (k.indexOf('profilo/') !== 0 && k !== 'profilo') { var v = o[k]; if (typeof v === 'number') r[k] = v; } });
      return r;
    };
    if (opz && opz.nuovo === 'a') { qa = 0; oa = senzaProfilo(oa); }
    if (opz && opz.nuovo === 'b') { qb = 0; ob = senzaProfilo(ob); }
    var f: Fusione = { oa: oa, ob: ob, qa: qa, qb: qb };
    var out: Mappa = {};
    var chiavi: Record<string, 1> = {};
    Object.keys(a).forEach(function (k) { chiavi[k] = 1; });
    Object.keys(b).forEach(function (k) { chiavi[k] = 1; });
    Object.keys(statoVuoto()).forEach(function (k) { chiavi[k] = 1; });
    var scoperti: string[] = [];
    /* la tabella delle regole vista per chiave: `Object.keys` dà stringhe
       qualunque, e qui si passa su tutte — comprese quelle che nella tabella
       non ci sono, che è tutto il punto di `scoperti` */
    var regole = COME_UNIRE as unknown as Record<string, ModoFusione | undefined>;
    Object.keys(chiavi).forEach(function (k) {
      var modo = regole[k];
      var va = a[k], vb = b[k];
      if (va === undefined) { out[k] = vb; if (!modo) scoperti.push(k); return; }
      if (vb === undefined) { out[k] = va; if (!modo) scoperti.push(k); return; }
      if (!modo) {
        /* UN CAMPO CHE NESSUNO HA DICHIARATO. Non si tira a indovinare: si
           tiene quello del documento più recente e si grida, perché è
           esattamente il modo in cui un campo nuovo comincia a perdere dati in
           silenzio. prove/dati.js fallisce su questo. */
        scoperti.push(k);
        out[k] = (qb >= qa) ? vb : va;
        return;
      }
      switch (modo) {
        case 'elenco':  out[k] = unisciElenco(va, vb, qa, qb, k, f); break;
        case 'insieme': out[k] = unisciInsieme(va, vb, k, f); break;
        case 'mappa':   out[k] = unisciRadice(va, vb, k, f, vinceRecente); break;
        case 'ramo':    out[k] = unisciRadice(va, vb, k, f, vinceRecente); break;
        case 'contatore': out[k] = unisciRadice(va, vb, k, f, massimoConto); break;
        case 'orologi': {
          var o: Record<string, number> = {};
          [va, vb].forEach(function (m) {
            if (!eMappa(m)) return;
            Object.keys(m).forEach(function (c) { var t = Number(m[c]) || 0; if (t > (o[c] || 0)) o[c] = t; });
          });
          /* un orologio vale quanto una lapide, e scade come lei */
          var limite = scadenzaSicura(DURATA_LAPIDI);
          if (limite !== null) { var lim = limite; Object.keys(o).forEach(function (c) { if ((o[c] || 0) < lim) delete o[c]; }); }
          out[k] = o;
          break;
        }
        case 'massimo': out[k] = Math.max(Number(va as number) || 0, Number(vb as number) || 0); break;
        case 'oppure':  out[k] = !!(va || vb); break;
        case 'recente': out[k] = (qb >= qa) ? vb : va; break;
        default:        out[k] = (qb >= qa) ? vb : va;
      }
    });
    out['updatedAt'] = Math.max(Number(a.updatedAt) || 0, Number(b.updatedAt) || 0);
    /* L'ASSENZA LUNGA (vedi `OpzUnisci`): quello che `a` aveva già all'ultima
       sincronizzazione e `b` non ha più, se ne va. Le righe guardano la loro
       ora; i giorni delle mappe guardano il giorno. */
    if (opz && opz.assenzaLunga) {
      var da = opz.assenzaLunga.da, giornoDa = dayKey(new Date(da));
      Object.keys(regole).forEach(function (k) {
        var modo = regole[k], lb = b[k], lo = out[k];
        if (modo === 'elenco' && Array.isArray(lo) && k !== 'cancellati' && k !== 'registro' && k !== 'log') {
          var inB: Record<string, 1> = {};
          if (Array.isArray(lb)) lb.forEach(function (r: unknown) { inB[chiaveRiga(r)] = 1; });
          out[k] = lo.filter(function (r: unknown) { return inB[chiaveRiga(r)] || momentoRiga(r, 0) > da; });
        } else if (modo === 'mappa' && eMappa(lo)) {
          var mo = lo;
          Object.keys(mo).forEach(function (g) {
            if (/^\d{4}-\d\d-\d\d$/.test(g) && g <= giornoDa && !(eMappa(lb) && g in lb)) delete mo[g];
          });
        }
      });
    }
    var fuso = out as unknown as Stato;
    applicaLapidi(fuso);
    if (scoperti.length) {
      var rec = eMappa(out['recuperati']) ? out['recuperati'] as Record<string, unknown> : {};
      rec['campiSenzaRegola'] = scoperti.join(',');
      out['recuperati'] = rec;
      if (window.LMLog) window.LMLog.errore('dati', 'campi senza regola di fusione: ' + scoperti.join(', '));
    }
    return fuso;
  }

  /* LE LAPIDI SE LE SCRIVE `save()`, NON CHI CANCELLA.
     Ci sono una ventina di funzioni che tolgono qualcosa, e ne arriveranno
     altre: chiedere a ognuna di ricordarsi anche di segnare la lapide è il
     modo sicuro per averne una che se ne dimentica, e quel giorno la riga
     cancellata tornerebbe viva al primo scambio con l'altro dispositivo.
     Qui si guarda invece il risultato: cos'era salvato prima, cos'è salvato
     adesso, e quello che non c'è più prende la sua lapide. Una funzione che
     cancella e che verrà scritta l'anno prossimo è già coperta. */
  function leggiOggetto(raw: string | Mappa | null): Mappa | null {
    if (!raw) return null;
    if (typeof raw !== 'string') return raw;
    var grezzo: unknown;
    try { grezzo = JSON.parse(raw); } catch (e) { return null; }
    return eMappa(grezzo) ? grezzo : null;
  }
  function segnaLapidi(primaRaw: string | Mappa | null, s: Stato) {
    var prima = leggiOggetto(primaRaw);
    if (!prima) return;
    var adesso2 = s as unknown as Record<string, unknown>;
    var regole = COME_UNIRE as unknown as Record<string, ModoFusione | undefined>;
    var ora = adesso();
    var nate = s.cancellati || (s.cancellati = []);
    Object.keys(regole).forEach(function (k) {
      if (regole[k] !== 'elenco' || k === 'cancellati' || k === 'registro' || k === 'log') return;
      var era = prima ? prima[k] : undefined, ce = adesso2[k];
      if (!Array.isArray(era) || !Array.isArray(ce)) return;
      var restano: Record<string, 1> = {};
      ce.forEach(function (r: unknown) { restano[chiaveRiga(r)] = 1; });
      era.forEach(function (r: unknown) {
        var c = chiaveRiga(r);
        if (restano[c]) return;
        nate.push({ k: k, chiave: c, ts: ora, vivo: false });
      });
    });
    /* una sola voce per chiave: la più recente (una lapide nuova prende il
       posto di un «tornata» di prima, e viceversa) */
    var ultimaDi: Record<string, number> = {};
    nate.forEach(function (t, i) { if (t) ultimaDi[t.k + '|' + t.chiave] = i; });
    s.cancellati = nate.filter(function (t, i) { return !t || ultimaDi[t.k + '|' + t.chiave] === i; });
  }

  /* GLI OROLOGI SE LI SCRIVE `save()`, come le lapidi.
     Si confronta com'era con com'è, e:
       · una RIGA cambiata (o nata) prende `aggiornata` = adesso: è l'ora che
         decide fra due versioni della stessa riga (vedi `momentoRiga`);
       · in un DIZIONARIO (una mappa per giorno, il profilo, le spunte di
         un'abitudine dentro la sua riga) ogni chiave cambiata o tolta prende
         il suo orologio; una chiave nuova lo prende solo se lì c'era già
         stato un orologio (cioè se torna dopo essere stata tolta), così le
         aggiunte normali — che sono la quasi totalità — non pesano niente;
       · un dizionario svuotato di molte chiavi in un colpo («Azzera tutto»)
         prende un orologio solo, sul ramo intero;
       · un'area accesa o spenta prende `areeAttive/<id>`.
     `xpPerGiorno` non ne ha bisogno: si ricava da `xpConti`. */
  var SENZA_OROLOGI: Record<string, 1> = { cancellati: 1, registro: 1, log: 1, xpPerGiorno: 1, orologi: 1, updatedAt: 1 };
  function haOrologio(o: Record<string, number>, via: string): boolean {
    if (o[via]) return true;
    var i = via.lastIndexOf('/');
    while (i > 0) { if (o[via.slice(0, i)]) return true; i = via.lastIndexOf('/', i - 1); }
    return false;
  }
  function segnaNodo(a: unknown, b: unknown, via: string, o: Record<string, number>, t: number, soloStruttura: boolean): void {
    if (!eMappa(a) || !eMappa(b)) { if (!stessoValore(a, b) && !soloStruttura) o[via] = t; return; }
    var ka = Object.keys(a), kb = Object.keys(b);
    var tolte = ka.filter(function (k) { return !Object.prototype.hasOwnProperty.call(b, k); });
    if (tolte.length > 20 && tolte.length === ka.length) { o[via] = t; return; }
    tolte.forEach(function (k) { o[via + '/' + pezzoVia(k)] = t; });
    kb.forEach(function (k) {
      var p = via + '/' + pezzoVia(k);
      if (!Object.prototype.hasOwnProperty.call(a, k)) { if (haOrologio(o, p)) o[p] = t; return; }
      var va = a[k], vb = b[k];
      if (stessoValore(va, vb)) return;
      if (eMappa(va) && eMappa(vb)) segnaNodo(va, vb, p, o, t, soloStruttura);
      else if (!soloStruttura) o[p] = t;
    });
  }
  function segnaOrologi(primaRaw: string | Mappa | null, s: Stato): void {
    var prima = leggiOggetto(primaRaw);
    if (!prima) return;
    if (!eMappa(s.orologi)) s.orologi = {};
    var o = s.orologi;
    var t = adesso();
    var ora2 = s as unknown as Record<string, unknown>;
    var regole = COME_UNIRE as unknown as Record<string, ModoFusione | undefined>;
    Object.keys(regole).forEach(function (k) {
      if (SENZA_OROLOGI[k]) return;
      var modo = regole[k], era = prima ? prima[k] : undefined, ce = ora2[k];
      if (modo === 'elenco') {
        if (!Array.isArray(ce)) return;
        var prime: Record<string, unknown> = {};
        if (Array.isArray(era)) era.forEach(function (r: unknown) { prime[chiaveRiga(r)] = r; });
        ce.forEach(function (r: unknown) {
          if (!eMappa(r)) return;
          var c = chiaveRiga(r), pr = prime[c];
          /* una riga nuova che porta già la sua ora (le scoperte, le sessioni
             del timer: la usano anche per metterle in fila) la tiene */
          if (pr === undefined) { if (typeof r['aggiornata'] !== 'number') r['aggiornata'] = t; return; }
          if (stessoValore(pr, r)) return;
          r['aggiornata'] = t;
          if (!eMappa(pr)) return;
          var vr = k + '/' + pezzoVia(c), riga = r, primaRiga = pr;
          var campi = Object.keys(riga);
          Object.keys(primaRiga).forEach(function (cc) { if (!Object.prototype.hasOwnProperty.call(riga, cc)) campi.push(cc); });
          campi.forEach(function (cc) {
            if (cc === 'aggiornata') return;
            var nv = riga[cc], vv = primaRiga[cc];
            if (stessoValore(nv, vv)) return;
            if (eMappa(nv) || eMappa(vv)) {
              segnaNodo(eMappa(vv) ? vv : {}, eMappa(nv) ? nv : {}, vr + '/' + pezzoVia(cc), o, t, false);
            } else {
              /* un orologio per CAMPO: vedi `unisciRiga` */
              o[vr + '/' + pezzoVia(cc)] = t;
            }
          });
        });
      } else if (modo === 'mappa' || modo === 'ramo' || modo === 'contatore') {
        if (stessoValore(era, ce)) return;
        segnaNodo(eMappa(era) ? era : {}, eMappa(ce) ? ce : {}, k, o, t, modo === 'contatore');
      } else if (modo === 'insieme') {
        var x: Record<string, 1> = {}, y: Record<string, 1> = {};
        if (Array.isArray(era)) era.forEach(function (v: unknown) { x[String(v)] = 1; });
        if (Array.isArray(ce)) ce.forEach(function (v: unknown) { y[String(v)] = 1; });
        Object.keys(x).forEach(function (v) { if (!y[v]) o[k + '/' + pezzoVia(v)] = t; });
        Object.keys(y).forEach(function (v) { if (!x[v]) o[k + '/' + pezzoVia(v)] = t; });
      }
    });
  }

  /* I PUNTI SI RICAVANO DAI CONTI (vedi `xpConti` in tipi/stato.ts).
     Prima `xp` si univa col «più grande dei due»: due dispositivi che
     guadagnavano punti insieme ne tenevano uno solo, e una spunta tolta su
     un telefono non toglieva i punti sugli altri. Qui ogni giorno somma i
     conti di tutti i dispositivi. Uno stato che i conti non li ha ancora
     (scritto prima, o arrivato da una versione vecchia dell'app aperta in
     un'altra scheda) li riceve dai numeri che ha, sotto il nome `base`. */
  function ricalcolaXp(s: Stato, primaVolta?: boolean): void {
    if (!eMappa(s.xpConti)) s.xpConti = {};
    var conti = s.xpConti;
    if (!eMappa(s.xpPerGiorno)) s.xpPerGiorno = {};
    var perGiorno = s.xpPerGiorno;
    var somma = 0;
    Object.keys(perGiorno).forEach(function (g) {
      var v = Number(perGiorno[g]) || 0;
      somma += v;
      /* un giorno che i conti hanno già conosciuto (e magari tolto, con
         «Azzera tutto») non si riaccende da un numero rimasto indietro */
      if (!conti[g] && v > 0 && !haOrologio(s.orologi || NIENTE, 'xpConti/' + pezzoVia(g))) conti[g] = { base: [v, 0] };
    });
    if (primaVolta) {
      var resto = (Number(s.xp) || 0) - somma;
      if (resto > 0 && !conti['_']) conti['_'] = { base: [resto, 0] };
    }
    var tot = 0, nuovo: Record<string, number> = {};
    Object.keys(conti).forEach(function (g) {
      var c = conti[g];
      if (!c || !eMappa(c)) { delete conti[g]; return; }
      var cc = c;
      var p = 0, n = 0;
      Object.keys(cc).forEach(function (d) { var v = cc[d]; if (Array.isArray(v)) { p += Number(v[0]) || 0; n += Number(v[1]) || 0; } });
      var val = Math.max(0, p - n);
      tot += val;
      if (g !== '_') nuovo[g] = val;
    });
    s.xpPerGiorno = nuovo;
    s.xp = tot;
  }

  var state: Stato | null = null;

  /* IL SALVATAGGIO ILLEGGIBILE NON SI BUTTA VIA.
     Qui c'era `catch { state = statoVuoto() }`, e basta: se il testo salvato
     non si riusciva a leggere — un byte storto, un salvataggio interrotto a
     metà, la memoria piena a metà scrittura — l'app ripartiva vuota, senza
     dire niente, e al PRIMO salvataggio successivo scriveva lo stato vuoto
     sopra a quello vero. Un solo carattere fuori posto, e tutto sparito per
     sempre. Adesso il testo che non si legge viene messo da parte in un
     contenitore suo, che nessuno tocca più, e l'app lo dice. */
  var RECUPERO_PRE = 'lifemax.recupero.';
  function load(): Stato {
    if (state) return state;
    var raw = null;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) { raw = null; }
    generazione = leggiGenerazione();
    ultimoScritto = null;
    if (raw) {
      try {
        state = JSON.parse(raw) as Stato;
        ultimoScritto = raw;
      } catch (e) {
        state = null;
        try { localStorage.setItem(RECUPERO_PRE + Date.now(), raw); } catch (e2) { /* pieno */ }
        if (window.LMLog) window.LMLog.errore('dati', 'salvataggio illeggibile: messo da parte in ' + RECUPERO_PRE + '*, ' + raw.length + ' caratteri');
        try { document.dispatchEvent(new CustomEvent('lm:dati-illeggibili')); } catch (e3) { /* niente */ }
      }
    }
    /* SI PRENDE QUELLO CHE `normalizza` RESTITUISCE.
       Prima la riga era `normalizza(state);` e basta: funzionava perché
       quella funzione lavora sull'oggetto che le si dà, e quindi il risultato
       era lo stesso oggetto. Ma è una certezza che dipende da come è scritta
       dentro, non da come è dichiarata — e il giorno che qualcuno la
       riscrivesse per restituire una copia (che è la cosa più naturale del
       mondo), qui si sarebbe tenuto lo stato non normalizzato senza che
       niente si lamentasse. */
    var partenza: unknown = (!state || typeof state !== 'object') ? statoVuoto() : state;
    state = normalizza(partenza);
    osserva(state.updatedAt);
    return state;
  }
  /* RILEGGE DALLA MEMORIA DEL DISPOSITIVO, buttando quello che questa
     finestra aveva in mano: un'altra finestra ha svuotato il dispositivo
     (uscita dall'account) o la nuvola l'ha appena rimesso a posto. */
  function ricarica(): Stato {
    state = null;
    var s = load();
    /* `ricarica` nel dettaglio: non è una modifica fatta qui, e la nuvola
       non deve trattarla come tale */
    try { document.dispatchEvent(new CustomEvent('lm:change', { detail: 'ricarica' as unknown as void })); } catch (e) { /* niente */ }
    try { window.dispatchEvent(new CustomEvent('lm:remote')); } catch (e) { /* niente */ }
    return s;
  }
  /* i pezzi messi da parte, per poterli mostrare e riprovare a leggerli */
  function recuperi(): { chiave: string; ts: number; testo: string | null }[] {
    var out: { chiave: string; ts: number; testo: string | null }[] = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(RECUPERO_PRE) === 0) {
          out.push({ chiave: k, ts: +k.slice(RECUPERO_PRE.length) || 0, testo: localStorage.getItem(k) });
        }
      }
    } catch (e) { /* niente */ }
    return out.sort(function (a, b) { return b.ts - a.ts; });
  }

  /* Riempie i campi mancanti negli stati salvati prima di un aggiornamento
     (o arrivati dal cloud): nessun dato viene perso, si aggiunge solo. */
  /* IL CONFINE. Questa funzione prende qualcosa che DICE di essere uno stato
     — un salvataggio vecchio, un file importato, un documento arrivato dalla
     nuvola — e restituisce uno stato vero. È l'unico punto dell'app in cui un
     dato non fidato diventa fidato, e per questo tutti i controlli stanno
     qui: campo per campo, e quello che non regge viene messo da parte invece
     che buttato.
     Dentro si lavora COME SE fosse già uno Stato, con una conversione sola e
     dichiarata. L'alternativa sarebbe scrivere ogni controllo due volte — una
     per il compilatore e una per davvero — e due copie dello stesso controllo
     sono il posto dove prima o poi una delle due resta indietro. */
  function normalizza(grezzo: unknown): Stato {
    var s = (eMappa(grezzo) ? grezzo : {}) as unknown as Stato;
    /* la stessa cosa vista per chiave, per i due giri che passano su TUTTI i
       campi senza sapere quali sono */
    var perChiave = s as unknown as Record<string, unknown>;
    var vuoto = statoVuoto();
    var vuotoPerChiave = vuoto as unknown as Record<string, unknown>;
    /* uno stato che i conti dei punti non li ha mai avuti: si fanno adesso,
       una volta sola, dai numeri che ha (vedi `ricalcolaXp`) */
    var senzaConti = !eMappa(perChiave['xpConti']);
    Object.keys(vuoto).forEach(function (k) {
      if (perChiave[k] === undefined || perChiave[k] === null) perChiave[k] = vuotoPerChiave[k];
    });
    if (!eMappa(perChiave['orologi'])) perChiave['orologi'] = {};
    /* UN CAMPO DEL TIPO SBAGLIATO NON SI BUTTA, SI METTE DA PARTE.
       Qui c'erano righe come `if (!Array.isArray(s.lezioni)) s.lezioni = []`:
       se per qualunque motivo quel campo arrivava storto, il suo contenuto
       spariva in silenzio e non tornava più. Adesso quello che c'era finisce
       in `recuperati`, che viaggia con lo stato e si può guardare dal
       Registro tecnico. */
    var salva = function (k: string, buono: (v: unknown) => boolean) {
      if (buono(perChiave[k])) return;
      if (perChiave[k] !== undefined && perChiave[k] !== null) {
        s.recuperati = s.recuperati || {};
        s.recuperati[k] = { quando: Date.now(), valore: perChiave[k] };
        if (window.LMLog) window.LMLog.errore('dati', 'campo «' + k + '» del tipo sbagliato: messo da parte invece che buttato');
      }
      perChiave[k] = vuotoPerChiave[k] !== undefined ? JSON.parse(JSON.stringify(vuotoPerChiave[k])) : [];
    };
    var eLista = function (v: unknown) { return Array.isArray(v); };
    ['backlog', 'abitudini', 'lezioni', 'azioni', 'inbox', 'checkins', 'esperimenti',
     'registro', 'log', 'aree', 'areeAttive', 'cancellati', 'sessioni'].forEach(function (k) { salva(k, eLista); });
    if (!s.recuperati || typeof s.recuperati !== 'object') s.recuperati = {};
    /* il vecchio taglio dell'azzeramento non vale più (vedi `unisci`): uno
       rimasto in un documento salvato prima non deve poter riapparire */
    s.azzerato = 0;
    if (typeof s.visto !== 'number') s.visto = 0;
    if (!Array.isArray(s.aree) || !s.aree.length) s.aree = JSON.parse(JSON.stringify(AREE_DEFAULT));
    /* profilo e ritmo della giornata (stati vecchi o dal cloud) */
    if (!s.profilo || typeof s.profilo !== 'object') s.profilo = vuoto.profilo;
    if (!s.profilo.giornataPos) s.profilo.giornataPos = 'oggi-strip';
    if (!s.profilo.ritmo || typeof s.profilo.ritmo !== 'object') s.profilo.ritmo = JSON.parse(JSON.stringify(RITMO_DEFAULT));
    if (!s.profilo.chiedi || typeof s.profilo.chiedi !== 'object') s.profilo.chiedi = JSON.parse(JSON.stringify(CHIEDI_DEFAULT));
    /* le due domande sono due e si chiamano così: dichiararlo al
       compilatore costa `as const` e gli fa controllare le chiavi */
    (['notte', 'giorno'] as const).forEach(function (q) {
      var tutte = s.profilo.chiedi as unknown as Record<string, { on: boolean; da: Ora; a?: Ora } | undefined>;
      var c = tutte[q];
      if (!c || typeof c !== 'object') { tutte[q] = JSON.parse(JSON.stringify(CHIEDI_DEFAULT[q])); return; }
      if (typeof c.on !== 'boolean') c.on = true;
      if (!/^\d\d:\d\d$/.test(c.da || '')) c.da = CHIEDI_DEFAULT[q].da as Ora;
      if (q === 'notte' && !/^\d\d:\d\d$/.test(c.a || '')) c.a = CHIEDI_DEFAULT.notte.a as Ora;
    });
    /* i promemoria: uno stato salvato prima che esistessero non ce li ha, e
       uno che arriva da un dispositivo aggiornato potrebbe averne solo una
       parte. Si riempie quello che manca senza toccare quello che c'è. */
    if (!s.profilo.promemoria || typeof s.profilo.promemoria !== 'object') {
      s.profilo.promemoria = JSON.parse(JSON.stringify(PROMEMORIA_DEFAULT));
    }
    /* Stesso confine di `normalizza`: quello che arriva qui dice di essere
       una configurazione dei promemoria, e il lavoro di queste righe è
       renderla tale. Le voci si guardano una per una perché uno stato che
       viene da un dispositivo più vecchio può averne solo una parte. */
    (function (c: Promemoria) {
      var voci = c.voci as unknown as Record<string, VocePromemoria | undefined>;
      if (typeof c.server !== 'string') c.server = '';
      if (typeof c.chiave !== 'string') c.chiave = '';
      c.fissa = !!c.fissa;
      if (!c.voci || typeof c.voci !== 'object') { c.voci = {} as Promemoria['voci']; voci = c.voci as unknown as Record<string, VocePromemoria | undefined>; }
      (Object.keys(PROMEMORIA_DEFAULT.voci) as (keyof Promemoria['voci'])[]).forEach(function (k) {
        var d = PROMEMORIA_DEFAULT.voci[k] as { on: boolean; ora?: string };
        var v = voci[k];
        if (!v || typeof v !== 'object') { v = JSON.parse(JSON.stringify(d)) as VocePromemoria; voci[k] = v; }
        if (typeof v.on !== 'boolean') v.on = d.on;
        /* le abitudini non hanno un'ora qui: ognuna ha la sua */
        if (d.ora != null && !ORA_VALIDA.test(v.ora || '')) v.ora = d.ora as Ora;
      });
      if (!c.silenzio || typeof c.silenzio !== 'object') c.silenzio = JSON.parse(JSON.stringify(PROMEMORIA_DEFAULT.silenzio));
      if (typeof c.silenzio.on !== 'boolean') c.silenzio.on = PROMEMORIA_DEFAULT.silenzio.on;
      if (!ORA_VALIDA.test(c.silenzio.da || '')) c.silenzio.da = PROMEMORIA_DEFAULT.silenzio.da as Ora;
      if (!ORA_VALIDA.test(c.silenzio.a || '')) c.silenzio.a = PROMEMORIA_DEFAULT.silenzio.a as Ora;
    })(s.profilo.promemoria as Promemoria);
    if (!s.profilo.ritmo.sveglia) s.profilo.ritmo.sveglia = RITMO_DEFAULT.sveglia as Ora;
    if (!s.profilo.ritmo.sonno) s.profilo.ritmo.sonno = RITMO_DEFAULT.sonno as Ora;
    if (!Array.isArray(s.profilo.ritmo.pasti)) s.profilo.ritmo.pasti = JSON.parse(JSON.stringify(RITMO_DEFAULT.pasti));
    s.profilo.ritmo.pasti.forEach(function (p) { if (p.durata == null) p.durata = 30; });
    if (!s.ritmoGiorno || typeof s.ritmoGiorno !== 'object') s.ritmoGiorno = {};
    if (!Array.isArray(s.registro)) s.registro = [];
    /* abitudini di stati vecchi: senza un inizio comparirebbero anche su tutti
       i giorni passati. Il primo giorno valido è quello in cui sono nate. */
    if (Array.isArray(s.abitudini)) {
      s.abitudini.forEach(function (h) {
        if (!h.salti || typeof h.salti !== 'object') h.salti = {};
        if (h.a === undefined) h.a = null;
        if (!h.da) h.da = h.creata ? dayKey(new Date(h.creata)) : null;
      });
    }
    /* ripara stati vecchi con più di una priorità nello stesso giorno:
       ne tiene una sola (la prima), com'è l'invariante ora. */
    if (Array.isArray(s.azioni)) {
      var mitVisti: Record<string, boolean> = {};
      s.azioni.forEach(function (a) {
        if (!a.mit) return;
        if (mitVisti[a.data]) a.mit = false; else mitVisti[a.data] = true;
      });
    }
    ricalcolaXp(s, senzaConti);
    return s;
  }

  /* Se il salvataggio locale fallisce (spazio esaurito, navigazione privata)
     NON restiamo zitti: perdere dati senza accorgersene è il guaio peggiore
     per un'app che serve a misurare. Avvisiamo una volta e proviamo a fare
     spazio buttando le voci più vecchie del registro. */
  var salvataggioRotto = false;
  /* mentre si innesta uno stato intero (dal cloud, da un file, dai dati di
     esempio) non si segnano lapidi: là non è sparito niente, è cambiato tutto
     insieme — e segnarle vorrebbe dire mandare all'altro dispositivo l'ordine
     di cancellare quello che ha. */
  var senzaLapidi = 0;
  /* ---------- punti a cui tornare ----------
     Ogni cosa che finisce nel diario si può annullare da lì. Un gancio solo,
     invece di scriverne l'inverso in cinquantuno posti: prima di ogni
     salvataggio che cambia davvero qualcosa si mette da parte lo stato
     COM'ERA, e dal diario si torna a quel punto.

     Non basta guardare il registro: completare una cosa non ci scrive niente
     — il diario la ricava dai dati — e proprio quella è la cosa che più
     spesso si vuole disfare. Quindi il punto si segna quando lo stato
     cambia, e si lega alla RIGA del diario per tempo: ogni punto copre la
     finestra fra il salvataggio precedente e il suo, e una riga che cade in
     quella finestra è roba sua.

     Le copie stanno in contenitori loro, uno per punto, e non dentro lo
     stato: così non finiscono nel cloud, non gonfiano il file esportato, e
     ogni azione riscrive solo la copia nuova invece di tutta la pila. Se lo
     spazio finisce si buttano, senza toccare i dati veri.

     Attenzione a cosa vuol dire: tornare a un punto riporta indietro TUTTO
     quello che è venuto dopo. Per l'ultima cosa fatta le due cose
     coincidono; per una più vecchia no, e l'interfaccia lo dice prima. */
  var PUNTI_KEY = 'lifemax.annulla.v1';
  var PUNTO_PRE = 'lifemax.annulla.p.';
  var PUNTI_MAX = 12;
  var staTornandoIndietro = false;
  var ultimoPuntoFino = 0;

  function leggiIndice(): PuntoRitorno[] {
    try { return (JSON.parse(String(localStorage.getItem(PUNTI_KEY))) || []) as PuntoRitorno[]; } catch (e) { return []; }
  }
  function scriviIndice(arr: PuntoRitorno[]) {
    try { localStorage.setItem(PUNTI_KEY, JSON.stringify(arr)); } catch (e) { /* quota */ }
  }
  function buttaPunto(id: string) {
    try { localStorage.removeItem(PUNTO_PRE + id); } catch (e) { /* niente */ }
  }
  function scordaPunti() {
    leggiIndice().forEach(function (p) { buttaPunto(p.id); });
    try { localStorage.removeItem(PUNTI_KEY); } catch (e) { /* niente */ }
    ultimoPuntoFino = 0;
  }

  /* lo stato è cambiato: si tiene com'era. `prima` è ciò che c'era scritto. */
  function segnaPunto(prima: string | null, primaNudo: string | null, adessoNudo: string | null) {
    if (!prima || primaNudo === adessoNudo) return;   /* niente è cambiato davvero */
    var ora = Date.now();
    var arr = leggiIndice();
    var id = 'p' + ora.toString(36) + Math.random().toString(36).slice(2, 6);
    try { localStorage.setItem(PUNTO_PRE + id, prima); }
    catch (e) {
      /* spazio finito: si butta il più vecchio e si riprova una volta sola */
      var v = arr.pop();
      if (v) buttaPunto(v.id);
      try { localStorage.setItem(PUNTO_PRE + id, prima); }
      catch (e2) { scriviIndice(arr); return; }
    }
    /* La finestra parte dal salvataggio precedente, ma non più di cinque
       secondi indietro: senza questo limite il primo punto aveva `da: 0` e si
       prendeva TUTTO il passato — ogni riga del diario, anche di mesi prima,
       sembrava annullabile e annullarla riportava a ieri. */
    arr.unshift({ id: id, da: Math.max(ultimoPuntoFino, ora - 5000), fino: ora });
    ultimoPuntoFino = ora;
    while (arr.length > PUNTI_MAX) { var vecchio = arr.pop(); if (vecchio) buttaPunto(vecchio.id); }
    scriviIndice(arr);
  }

  /* la riga del diario con questo istante appartiene a quale punto?
     `dopo` dice quante cose sono state fatte DOPO: se è zero, annullare quel
     punto annulla esattamente quella cosa e nient'altro. */
  function puntoDiRitorno(ts: number) {
    var arr = leggiIndice();
    for (var i = 0; i < arr.length; i++) {
      var p = arr[i];
      if (p && ts > p.da && ts <= p.fino + 1500) return { id: p.id, dopo: i };
    }
    return null;
  }
  function puntiDiRitorno() {
    return leggiIndice().map(function (p, i) { return { id: p.id, da: p.da, fino: p.fino, dopo: i }; });
  }

  /* Torna a com'era. Il registro NON si conserva: se tornasse indietro anche
     lui il diario mostrerebbe cose che non sono più vere. Al suo posto resta
     una riga che dice che sei tornato. */
  function tornaAlPunto(ts: number, etichetta?: string) {
    var arr = leggiIndice();
    var trovato: PuntoRitorno | null = null;
    var i = -1;
    for (var j = 0; j < arr.length; j++) {
      var q = arr[j];
      if (q && ts > q.da && ts <= q.fino + 1500) { trovato = q; i = j; break; }
    }
    if (!trovato || i < 0) return false;
    /* UN GESTO PUÒ FARE PIÙ SALVATAGGI. «Diventa un'abitudine» ne fa due —
       crea l'abitudine, poi toglie l'attività — e ognuno lascia il suo punto.
       La riga del diario cade sul secondo, e tornare lì toglieva l'attività
       ma lasciava l'abitudine: metà annullamento. I punti nati nello stesso
       istante (meno di 80 ms: lo stesso giro di codice) sono lo stesso gesto, e si torna al primo. */
    while (i + 1 < arr.length) {
      var piuVecchio = arr[i + 1], questo = arr[i];
      if (!piuVecchio || !questo || questo.fino - piuVecchio.fino > 80) break;
      i++; trovato = piuVecchio;
    }
    var quello = trovato;
    var raw: string | null;
    try { raw = localStorage.getItem(PUNTO_PRE + quello.id); } catch (e) { raw = null; }
    var vecchio = raw ? safeParse(raw) : null;
    if (!vecchio) return false;
    /* i punti da qui in avanti descrivono uno stato che non esiste più */
    for (var k = 0; k <= i; k++) { var vecchioP = arr[k]; if (vecchioP) buttaPunto(vecchioP.id); }
    var resto = arr.slice(i + 1);
    scriviIndice(resto);
    var primo = resto[0];
    ultimoPuntoFino = primo ? primo.fino : 0;
    var primaRaw: string | null = null;
    try { primaRaw = localStorage.getItem(STORAGE_KEY); } catch (e) { primaRaw = null; }
    staTornandoIndietro = true;
    /* SOSTITUISCE. Vedi `ripristinaStato`: unire qui vorrebbe dire tenere sia
       il prima sia il dopo, cioè non annullare niente. */
    hydrate(vecchio, true);
    /* E DEVE VALERE ANCHE PER GLI ALTRI DISPOSITIVI (e per il cloud). Prima
       si rimetteva lo stato di allora e basta: quello che il ritorno toglieva
       non lasciava lapidi, e quello che rimetteva aveva ancora la lapide di
       quando era stato cancellato. Alla prima fusione tornava tutto: annullando
       «diventa un'abitudine» ci si trovava sia l'attività sia l'abitudine.
       Adesso ciò che il ritorno toglie prende la sua lapide, e ciò che rimette
       diventa più recente della lapide che aveva. */
    marcaRitorno(primaRaw, load());
    registra('dati', 'Annullato: «' + (etichetta || 'una cosa fatta') + '»', true);
    save();
    staTornandoIndietro = false;
    return true;
  }

  /* --- l'inverso esatto di una cosa fatta ---
     I punti di ritorno esistono solo da quando l'app è aperta: le righe già
     nel diario da prima non ne hanno una, e restavano lì senza modo di
     disfarle. Ma quasi ogni riga del diario È un dato salvato — una spunta,
     un check-in, una review, una nota — e togliere quel dato è un'operazione
     precisa: funziona a qualunque distanza di tempo, non tocca nient'altro e
     quindi non c'è niente da avvertire prima.
     Restano fuori le righe di registro, che raccontano un cambiamento senza
     esserlo: quelle si annullano col punto di ritorno, quando c'è — a meno
     che la riga si porti dietro il suo inverso (`disfa`, vedi registra). */
  /* `chiave` arriva da `Object.keys` di un dizionario indicizzato per
     giorno: per il compilatore è una stringa qualunque, e `giorno()` è il
     punto in cui si dichiara che è un giorno. Una riga, non trenta. */
  function marcaRitorno(primaRaw: string | null, st: Stato): void {
    var primaObj = primaRaw ? safeParse(primaRaw) : null;
    if (!primaObj || !eMappa(primaObj)) return;
    var regoleU = COME_UNIRE as unknown as Record<string, ModoFusione | undefined>;
    var ora = adesso();
    var tornate: Record<string, 1> = {};
    Object.keys(regoleU).forEach(function (k) {
      if (regoleU[k] !== 'elenco' || k === 'cancellati' || k === 'registro' || k === 'log') return;
      var era = (primaObj as unknown as Record<string, unknown>)[k], ce = (st as unknown as Record<string, unknown>)[k];
      if (!Array.isArray(ce)) return;
      var cePrima: Record<string, 1> = {};
      if (Array.isArray(era)) era.forEach(function (r: unknown) { cePrima[chiaveRiga(r)] = 1; });
      ce.forEach(function (r: unknown) {
        var c = chiaveRiga(r);
        if (!cePrima[c] && eMappa(r)) { (r as Record<string, unknown>)['aggiornata'] = ora; tornate[k + '|' + c] = 1; }
      });
    });
    /* anche i giorni delle mappe (il diario, i voti) */
    Object.keys(regoleU).forEach(function (k) {
      if (regoleU[k] !== 'mappa') return;
      var era = (primaObj as unknown as Record<string, unknown>)[k], ce = (st as unknown as Record<string, unknown>)[k];
      if (!eMappa(ce)) return;
      Object.keys(ce).forEach(function (g) { if (!eMappa(era) || !(g in era)) tornate[k + '|' + g] = 1; });
    });
    rivivi(st, tornate, ora);
    segnaLapidi(primaRaw, st);
    /* e quello che il ritorno ha cambiato prende il suo orologio: una spunta
       tolta tornando indietro deve restare tolta anche sugli altri */
    segnaOrologi(primaRaw, st);
  }

  /* le righe tornate prendono una lapide «viva» con la stessa chiave: la
     fusione tiene la più recente, e su tutti i dispositivi vince il ritorno */
  function rivivi(st: Stato, tornate: Record<string, 1>, ora: number): void {
    if (!Array.isArray(st.cancellati)) st.cancellati = [];
    var sepolte: Record<string, 1> = {};
    st.cancellati.forEach(function (t) { if (t && !t.vivo) sepolte[t.k + '|' + t.chiave] = 1; });
    var resta = st.cancellati.filter(function (t) { return !(t && tornate[t.k + '|' + t.chiave]); });
    Object.keys(tornate).forEach(function (id) {
      var i = id.indexOf('|');
      resta.push({ k: id.slice(0, i), chiave: id.slice(i + 1), ts: ora, vivo: true });
    });
    void sepolte;
    st.cancellati = resta;
  }
  /* PRENDERE DA UNA COPIA (un backup, il cloud) SENZA SOSTITUIRE: quello che
     la copia ha e qui era stato cancellato torna, e torna per tutti */
  function riprendiCopia(obj: unknown): boolean {
    if (!eMappa(obj)) return false;
    var copia = JSON.parse(JSON.stringify(obj)) as Record<string, unknown>;
    var ora = adesso(), tornate: Record<string, 1> = {};
    var regoleU = COME_UNIRE as unknown as Record<string, ModoFusione | undefined>;
    var qui = load() as unknown as Record<string, unknown>;
    /* gli orologi della copia: quello che torna diventa «toccato adesso»,
       così vince sulla cancellazione che l'aveva tolto */
    var oc: Record<string, number> = {};
    Object.keys(regoleU).forEach(function (k) {
      var v = copia[k], h = qui[k];
      if (regoleU[k] === 'elenco' && Array.isArray(v) && k !== 'cancellati' && k !== 'registro' && k !== 'log') {
        /* SOLO LE RIGHE CHE QUI MANCANO tornano «nuove»: una riga che c'è
           già, magari cambiata dopo la copia, resta com'è adesso — riprendere
           aggiunge, non riporta indietro */
        var ci: Record<string, 1> = {};
        if (Array.isArray(h)) h.forEach(function (r: unknown) { ci[chiaveRiga(r)] = 1; });
        v.forEach(function (r: unknown) {
          if (!eMappa(r)) return;
          var c = chiaveRiga(r);
          tornate[k + '|' + c] = 1;
          if (!ci[c]) r['aggiornata'] = ora;
        });
      } else if (regoleU[k] === 'mappa' && eMappa(v)) {
        Object.keys(v).forEach(function (g) {
          tornate[k + '|' + g] = 1;
          if (!(eMappa(h) && g in h)) oc[k + '/' + pezzoVia(g)] = ora;
        });
      }
    });
    copia['orologi'] = oc;
    copia['cancellati'] = [];
    /* prima le lapidi «vive», poi la copia: al contrario la fusione la
       ritaglierebbe con le lapidi vecchie prima che il ritorno conti */
    var s = load();
    rivivi(s, tornate, ora);
    senzaLapidi++; save(); senzaLapidi--;
    hydrate(copia, false);
    return true;
  }

  function annullaRecord(tipo: string, chiaveGrezza: string) {
    var chiave = giorno(chiaveGrezza);
    var s = load();
    /* la riga «Annullato…» dice anche QUANDO, se non è oggi: annullare la
       review di una sera di tre settimane fa e leggere solo «Annullata la
       review della sera» non dice quale */
    function quando(k: Giorno) { return k === todayKey() ? '' : ' del ' + fmtShort(k); }
    if (tipo === 'azione') {
      var a = s.azioni.find(function (x) { return x.id === chiave; });
      if (!a || !a.done) return false;
      completaAzione(chiave);   /* toglie spunta, XP del giorno giusto e passo del progetto */
      return true;
    }
    if (tipo === 'checkin') {
      var i = s.checkins.findIndex(function (c) {
        return String(c.ts || parseKey(c.data).getTime()) === String(chiave);
      });
      if (i < 0) return false;
      var c = presa(s.checkins.splice(i, 1)[0]);
      togliXp(XP_EVENTI.checkin, c.data);
      registra('dati', 'Annullato un check-in' + quando(c.data), true);
      save();
      return true;
    }
    if (tipo === 'mattina') {
      if (!s.pianoMattina[chiave]) return false;
      delete s.pianoMattina[chiave];
      togliXp(XP_EVENTI.pianoMattina, chiave);
      registra('dati', 'Annullato il piano del mattino' + quando(chiave), true);
      save();
      return true;
    }
    if (tipo === 'sera') {
      if (!s.reviewSera[chiave]) return false;
      delete s.reviewSera[chiave];
      togliXp(XP_EVENTI.reviewSera, chiave);
      registra('dati', 'Annullata la review della sera' + quando(chiave), true);
      save();
      return true;
    }
    if (tipo === 'settimana') {
      var r = s.reviewSettimana[chiave];
      if (!r) return false;
      delete s.reviewSettimana[chiave];
      /* gli XP erano finiti sul giorno in cui l'hai compilata, non sul lunedì */
      togliXp(XP_EVENTI.reviewSettimana, r.ts ? dayKey(new Date(r.ts)) : chiave);
      registra('dati', 'Annullata la review della settimana del ' + fmtShort(chiave), true);
      save();
      return true;
    }
    if (tipo === 'abitudine') {
      var pz = String(chiave).split('|');
      var quale = pz[0] || '', quandoK = pz[1] || '';
      var h = s.abitudini.find(function (x) { return x.id === quale; });
      if (!h || !quandoK) return false;
      var vuole = pz[2] === '1';
      if (!!h.fatti[quandoK] === vuole) return false;  /* già come deve stare */
      completaAbitudine(quale, giorno(quandoK));       /* interruttore: XP e registro compresi */
      return true;
    }
    if (tipo === 'cattura') {
      var j = s.inbox.findIndex(function (x) { return x.id === chiave; });
      if (j < 0) return false;
      var el = presa(s.inbox.splice(j, 1)[0]);
      togliXp(XP_EVENTI.cattura, dayKey(new Date(el.creata)));
      registra('dati', 'Annullata la nota «' + el.testo + '»', true);
      save();
      return true;
    }
    return false;
  }

  function save() {
    /* UN'ALTRA FINESTRA HA SVUOTATO IL DISPOSITIVO (si è usciti
       dall'account là). Quello che questa finestra ha in mano è dell'account
       appena chiuso: riscriverlo vorrebbe dire rimetterlo sul dispositivo,
       a disposizione di chi entra dopo. Si butta e si rilegge. */
    if (state && generazione !== null && leggiGenerazione() !== generazione) {
      if (window.LMLog) window.LMLog.add('avviso', 'dati', 'un’altra finestra ha svuotato il dispositivo: rileggo invece di riscrivere');
      ricarica();
      return;
    }
    /* com'era prima: quello che QUESTA finestra ha letto o scritto per
       ultimo. Non si rilegge dalla memoria: se nel frattempo un'altra
       finestra ha scritto, le sue righe nuove sembrerebbero cancellate da
       questa, e prenderebbero una lapide. */
    var prima = staTornandoIndietro ? null : ultimoScritto;
    /* QUELLO CHE È SPARITO PRENDE LA SUA LAPIDE, e quello che è cambiato il
       suo orologio. Va fatto PRIMA di scrivere, perché confronta il
       salvataggio vecchio con lo stato nuovo. Durante un ritorno indietro
       non si segna niente qui: lo fa `marcaRitorno`, che sa com'era prima. */
    var suo = load();
    if (!staTornandoIndietro && !senzaLapidi) {
      var primaObj = leggiOggetto(prima);
      segnaLapidi(primaObj, suo);
      segnaOrologi(primaObj, suo);
    }
    ricalcolaXp(suo);
    /* DUE FINESTRE DELLA STESSA APP. Se un'altra ha scritto dopo l'ultima
       volta che questa ha letto, non si scrive sopra: si unisce. L'evento
       `storage` di solito arriva prima, ma non è garantito che arrivi in
       tempo — due tocchi ravvicinati in due finestre bastano. */
    var fuori: string | null = null;
    try { fuori = localStorage.getItem(STORAGE_KEY); } catch (e) { fuori = null; }
    /* (non quando si SOSTITUISCE apposta — uscire, ripristinare una copia:
       unire lì vorrebbe dire non sostituire) */
    if (!senzaLapidi && fuori && fuori !== ultimoScritto) {
      var loro = leggiOggetto(fuori);
      var insieme = loro ? unisci(loro, suo) : null;
      if (insieme) { state = normalizza(insieme); suo = state; }
    }
    suo.updatedAt = adesso();
    var ok = true;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      ok = false;
      /* SPAZIO FINITO. Prima di toccare i dati veri si butta quello che si può
         rifare: i punti a cui tornare (una copia intera dello stato ciascuno,
         sono la cosa più voluminosa che ci sia) e le copie di sicurezza più
         vecchie. Il registro è il diario dell'utente, e sfoltirlo in silenzio
         è la cosa che qui non si vuole fare. */
      try { scordaPunti(); localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); ok = true; }
      catch (e2) { /* ancora niente */ }
      if (!ok) {
        try {
          var bk = leggiBackups();
          if (bk.length > 3) { scriviBackups(bk.slice(0, 3)); localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); ok = true; }
        } catch (e3) { /* ancora niente */ }
      }
      if (!ok) {
        /* ultima spiaggia: si sfoltisce il registro, ma lo si DICE — sia
           nell'app (l'evento qui sotto) sia nel registro stesso, così resta
           scritto che c'è un pezzo di storia che non c'è più */
        try {
          if (Array.isArray(suo.registro) && suo.registro.length > 400) {
            var quanti = suo.registro.length - 400;
            suo.registro = suo.registro.slice(-400);
            suo.registro.push({ ts: Date.now(), cat: 'dati', imp: true,
              testo: 'Spazio esaurito: tolte ' + quanti + ' righe vecchie dal diario per poter salvare.' });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            ok = true;
          }
        } catch (e4) { /* niente da fare: i dati restano in memoria */ }
      }
    }
    if (!ok && !salvataggioRotto) {
      salvataggioRotto = true;
      document.dispatchEvent(new CustomEvent('lm:errore-salvataggio'));
    }
    if (ok) salvataggioRotto = false;
    var scritto: string | null = null;
    try { scritto = localStorage.getItem(STORAGE_KEY); } catch (e) { scritto = null; }
    if (ok) ultimoScritto = scritto;
    /* si ricorda l'ultima ora vista solo fin dove è credibile: mai più di un
       secondo davanti all'ora (corretta, se misurata) — un'ora più avanti
       l'ha inventata un orologio sbagliato (N4) */
    try { localStorage.setItem(ISTANTE_KEY, String(Math.min(ultimoIstante, oraCorretta() + ANTICIPO_MAX))); } catch (e) { /* niente */ }
    if (!staTornandoIndietro) {
      /* `updatedAt` cambia a ogni salvataggio: si toglie da entrambi, altrimenti
         ogni salvataggio sembrerebbe un cambiamento */
      segnaPunto(prima, senzaOrologio(prima), senzaOrologio(scritto));
    }
    document.dispatchEvent(new CustomEvent('lm:change'));
  }
  function senzaOrologio(raw: string | null) {
    return raw ? raw.replace(/"updatedAt":\s*\d+,?/, '') : raw;
  }

  /* AZZERARE. Da soli si riparte da zero su questo dispositivo, e basta.
     Collegati a un account si toglie anche dal cloud: ogni riga prende la
     sua lapide e ogni dizionario svuotato il suo orologio — come una
     cancellazione qualunque — così un backup ripristinato dopo li riporta in
     vita, su tutti i dispositivi.
     PRIMA RESTAVANO FUORI LE AREE, LE RINOMINE E IL DIARIO: le aree create e
     quelle spente tornavano dagli altri dispositivi, i nomi cambiati pure, e
     il diario restava intero. Adesso si azzera passando da `save()` come
     ogni altra modifica, quindi tutto quello che cambia lascia la sua
     traccia; il diario, che `save()` lascia fuori apposta perché si accorcia
     da sé, prende le lapidi qui. Restano invece le lapidi e gli orologi di
     prima: sono la memoria di quello che era già stato tolto. */
  function reset(perAccount?: boolean) {
    backup('prima-azzeramento');
    scordaPunti();
    var prima = load();
    var nuovo = statoVuoto();
    nuovo.azzerato = 0;
    nuovo.cancellati = Array.isArray(prima.cancellati) ? prima.cancellati.slice() : [];
    nuovo.orologi = eMappa(prima.orologi) ? JSON.parse(JSON.stringify(prima.orologi)) : {};
    if (perAccount) {
      var ora = adesso();
      (prima.registro || []).forEach(function (r) {
        nuovo.cancellati.push({ k: 'registro', chiave: chiaveRiga(r), ts: ora, vivo: false });
      });
      nuovo.onboarded = true;
    }
    nuovo.profilo.skin = prima.profilo.skin;
    nuovo.profilo.modo = prima.profilo.modo;
    state = nuovo;
    registra('dati', perAccount ? 'Dati azzerati, anche nell’account' : 'Dati azzerati su questo dispositivo', true);
    if (perAccount) { save(); return; }
    /* DA SOLI, SOLO QUI: niente lapidi e niente orologi, che un giorno
       potrebbero andare in un account e togliere dati veri */
    nuovo.cancellati = [];
    nuovo.orologi = {};
    senzaLapidi++; save(); senzaLapidi--;
  }

  /* ---------- backup, ricchezza, export/import ----------
     Ogni sostituzione potenzialmente distruttiva dei dati salva prima una
     copia in un contenitore dedicato (localStorage), così nulla va perso
     davvero: si può sempre ripristinare da Impostazioni. */

  var BACKUP_KEY = 'lifemax.backups.v1';

  function leggiBackups(): CopiaSalvata[] {
    try { return (JSON.parse(String(localStorage.getItem(BACKUP_KEY))) || []) as CopiaSalvata[]; } catch (e) { return []; }
  }
  /* DI CHI SONO I DATI ADESSO: l'account a cui il dispositivo è unito (lo
     scrive la nuvola in `lm-account-unito`), o '' per l'ospite. */
  var CHI_KEY = 'lm-account-unito';
  function proprietario(): string {
    try { return localStorage.getItem(CHI_KEY) || ''; } catch (e) { return ''; }
  }
  /* LE COPIE DI SICUREZZA HANNO UN PROPRIETARIO (verifica del 25 novembre
     2026, problema C1). Prima le vedeva e le ripristinava chiunque usasse
     quel browser: Mario esce, Luigi apre «Backup e ripristino», trova la copia
     «all'uscita dall'account», la ripristina, e i dati di Mario finiscono
     nell'account di Luigi. Adesso ognuno vede soltanto le sue.

     LE COPIE DI PRIMA, SENZA PROPRIETARIO (verifica 3, N1 e N5). La prima
     regola le dava all'account unito al dispositivo ADESSO: ma «adesso» non
     dice chi c'era quando la copia è stata presa, e su un PC condiviso la
     copia di Mario finiva a Luigi. Adesso una copia si dà a qualcuno solo con
     una prova: le cose che contiene sono le sue. Le righe hanno un id a caso
     (`uid`), e una copia della stessa vita ne ha in comune con lo stato di
     adesso — o con le sue lapidi, se nel frattempo sono state tolte — almeno
     metà (`stessaVita`). Senza prova:
       · quelle prese uscendo da un account («uscita-dall-account») hanno i
         dati di quell'account, che stanno nel suo cloud: si buttano;
       · tutte le altre — anche «prima-di-entrare-nell-account», che ha i dati
         dell'OSPITE che entrava, non di chi usciva — restano «senza
         proprietario» (`chi: '?'`): non le vede né le ripristina nessuno, ma
         si trovano in «Backup e ripristino» → «Copie senza proprietario»,
         con l'avviso, e si possono solo scaricare in un file o eliminare.
         Mai buttate in silenzio: per un ospite possono essere l'unica copia.
     Le copie «senza proprietario» si riguardano ogni volta: se un giorno lo
     stato di chi c'è è la stessa vita, diventano sue.
     E le copie che la versione del 25 novembre aveva già dato all'account di
     adesso con la regola vecchia si riguardano una volta con la regola nuova
     (`RIESAME_KEY`). */
  var COPIE_DI_USCITA: Record<string, 1> = { 'uscita-dall-account': 1 };
  var SENZA_PROPRIETARIO = '?';
  var RIESAME_KEY = 'lm-copie-riesaminate';
  var LISTE_CON_ID = ['azioni', 'inbox', 'backlog', 'abitudini', 'esperimenti', 'lezioni', 'checkins'];
  function chiaviDi(st: unknown, conLapidi: boolean): string[] {
    var out: string[] = [];
    if (!eMappa(st)) return out;
    LISTE_CON_ID.forEach(function (k) {
      var l = (st as Mappa)[k];
      if (!Array.isArray(l)) return;
      l.forEach(function (r: unknown) { if (eMappa(r) && r['id'] !== undefined && r['id'] !== null && r['id'] !== '') out.push('i' + String(r['id'])); });
    });
    if (conLapidi) {
      var c = (st as Mappa)['cancellati'];
      if (Array.isArray(c)) c.forEach(function (x: unknown) { if (eMappa(x) && x['chiave'] !== undefined) out.push(String(x['chiave'])); });
    }
    return out;
  }
  /* la copia è della stessa vita dello stato di adesso? */
  function stessaVita(copia: unknown, adesso: unknown): boolean {
    var sue = chiaviDi(copia, false);
    if (!sue.length) {
      /* niente righe: si dà solo se non c'è niente di personale */
      var p = eMappa(copia) ? (copia as Mappa)['profilo'] : null;
      var nome = eMappa(p) ? String(p['nome'] || '') : '';
      return ricchezza(copia) === 0 && !nome;
    }
    var qui: Record<string, 1> = {};
    chiaviDi(adesso, true).forEach(function (k) { qui[k] = 1; });
    var comuni = 0;
    sue.forEach(function (k) { if (qui[k]) comuni++; });
    return comuni * 2 >= sue.length;
  }
  /* `diChi`: di chi è lo stato che c'è adesso sul dispositivo, se non è
     ancora (o non è più) scritto in `lm-account-unito` — all'uscita, lo stato
     è ancora quello dell'account che esce */
  function sistemaCopieSenzaProprietario(diChi?: string): void {
    var arr = leggiBackups();
    var riesame = false;
    try { riesame = !localStorage.getItem(RIESAME_KEY); } catch (e) { riesame = false; }
    var chi = diChi !== undefined ? diChi : proprietario();
    var daGuardare = arr.some(function (b) {
      return b && (typeof b.chi !== 'string' || b.chi === SENZA_PROPRIETARIO || (riesame && !!b.chi && b.chi === chi));
    });
    if (!daGuardare) {
      if (riesame) { try { localStorage.setItem(RIESAME_KEY, String(Date.now())); } catch (e) { /* si riguarda la prossima volta */ } }
      return;
    }
    var adesso: unknown = null;
    try { adesso = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (e) { adesso = null; }
    if (!adesso) adesso = state;
    var resta: CopiaSalvata[] = [], date = 0, tolte = 0, sospese = 0;
    arr.forEach(function (b) {
      if (!b) return;
      var senza = typeof b.chi !== 'string' || b.chi === SENZA_PROPRIETARIO;
      var vecchiaDiAdesso = riesame && !!b.chi && b.chi === chi;
      if (!senza && !vecchiaDiAdesso) { resta.push(b); return; }
      if (stessaVita(safeParse(b.data), adesso)) {
        if (b.chi !== chi) date++;
        b.chi = chi; resta.push(b); return;
      }
      if (typeof b.chi !== 'string' && COPIE_DI_USCITA[b.motivo]) { tolte++; return; }
      if (b.chi !== SENZA_PROPRIETARIO) sospese++;
      b.chi = SENZA_PROPRIETARIO; resta.push(b);
    });
    scriviBackups(resta);
    if (riesame) { try { localStorage.setItem(RIESAME_KEY, String(Date.now())); } catch (e) { /* niente */ } }
    if ((date || tolte || sospese) && window.LMLog) {
      window.LMLog.add('info', 'dati', 'copie di sicurezza senza proprietario riguardate', date + ' date a chi c’è, ' + tolte + ' tolte, ' + sospese + ' messe da parte senza proprietario');
    }
  }
  function mie(): CopiaSalvata[] {
    sistemaCopieSenzaProprietario();
    var chi = proprietario();
    return leggiBackups().filter(function (b) { return b && (b.chi || '') === chi; });
  }
  /* le copie che non sono di nessuno: solo per scaricarle o eliminarle */
  function copieSenzaProprietario() {
    sistemaCopieSenzaProprietario();
    return leggiBackups().filter(function (b) { return b && b.chi === SENZA_PROPRIETARIO; }).map(function (b) {
      return { ts: b.ts, motivo: b.motivo, ricchezza: ricchezza(safeParse(b.data)) };
    });
  }
  function fileCopiaSenzaProprietario(ts: number): string | null {
    var b = leggiBackups().find(function (x) { return x && x.chi === SENZA_PROPRIETARIO && x.ts === ts; });
    if (!b) return null;
    return JSON.stringify({ app: 'LifeMax', versione: 2, esportato: Date.now(), copiaSenzaProprietario: true, stato: safeParse(b.data) }, null, 2);
  }
  function eliminaCopiaSenzaProprietario(ts: number): boolean {
    var arr = leggiBackups();
    var resta = arr.filter(function (x) { return !(x && x.chi === SENZA_PROPRIETARIO && x.ts === ts); });
    if (resta.length === arr.length) return false;
    scriviBackups(resta);
    return true;
  }
  function scriviBackups(arr: CopiaSalvata[]) {
    try { localStorage.setItem(BACKUP_KEY, JSON.stringify(arr)); } catch (e) { /* quota */ }
  }
  function backup(motivo?: string, perChi?: string) {
    var raw;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) { raw = null; }
    if (!raw) { try { raw = JSON.stringify(load()); } catch (e) { return; } }
    sistemaCopieSenzaProprietario();
    var arr = leggiBackups();
    var chi = perChi !== undefined ? perChi : proprietario();
    var ultima = arr[0];
    if (ultima && ultima.data === raw && (ultima.chi || '') === chi) return; // niente duplicati consecutivi
    arr.unshift({ ts: Date.now(), motivo: motivo || '', data: raw, chi: chi });
    if (arr.length > 25) arr = arr.slice(0, 25);
    scriviBackups(arr);
  }
  function listBackups() {
    return mie().map(function (b) {
      return { ts: b.ts, motivo: b.motivo, ricchezza: ricchezza(safeParse(b.data)) };
    });
  }
  function restoreBackup(ts: number) {
    /* solo una copia di chi c'è adesso: una copia di un altro non si rimette */
    var b = mie().find(function (x) { return x.ts === ts; });
    if (!b) return false;
    backup('prima-del-ripristino');
    scordaPunti();
    /* RIPRISTINARE SOSTITUISCE, e qui è giusto: chi torna a una copia di
       sicurezza sta dicendo «rivoglio esattamente com'era», non «aggiungi
       quella roba a questa». È l'unico posto dell'app dove si sostituisce. La
       copia di un istante fa l'abbiamo appena presa, due righe più su. */
    /* e chi torna, torna per tutti: senza `marcaRitorno` le righe del backup
       restavano sotto le lapidi degli altri dispositivi, e il telefono
       restava vuoto mentre il computer era a posto */
    ripristinaStato(safeParse(b.data));
    registra('dati', 'Ripristinato un backup', true);
    save();
    return true;
  }
  function safeParse(t: string | null): Stato { try { return normalizza(JSON.parse(String(t))); } catch (e) { return statoVuoto(); } }

  /* Quanto è "pieno" uno stato: serve a non far mai sovrascrivere dati
     reali da uno stato vuoto (la causa del bug di perdita dati). */
  /* QUANTA ROBA C'È DENTRO. Si chiama su documenti che possono essere
     incompleti — uno che arriva dalla nuvola, uno letto da una copia di
     sicurezza — quindi la firma dice `Partial<Stato>` e non `Stato`: mentire
     qui vorrebbe dire leggere campi che possono non esserci.
     Serve a una cosa sola e importante: confrontare due copie prima di
     toccarle, e gridare se dopo una fusione ce n'è MENO di prima. */
  function ricchezza(grezzo: unknown): number {
    if (!eMappa(grezzo)) return 0;
    var s = grezzo as Partial<Stato>;
    var quanti = function (v: unknown) { return Array.isArray(v) ? v.length : 0; };
    var chiavi = function (v: unknown) { return eMappa(v) ? Object.keys(v).length : 0; };
    return quanti(s.azioni) + quanti(s.checkins) + quanti(s.inbox) +
      chiavi(s.valutazioni) + chiavi(s.reviewSera) + chiavi(s.reviewSettimana) +
      quanti(s.esperimenti) + quanti(s.lezioni);
  }

  function exportJson() {
    return JSON.stringify({ app: 'LifeMax', versione: 2, esportato: Date.now(), stato: load() }, null, 2);
  }
  /* Ripristino leggero, per l'annulla subito dopo un'azione: rimette lo
     stato com'era un attimo prima, senza backup e senza riga di diario —
     quello che è stato annullato non è mai successo. */
  /* TORNARE INDIETRO SOSTITUISCE, non unisce.
     `hydrate` adesso UNISCE — è la cura alla perdita di dati fra dispositivi —
     e per un attimo l'ha usata anche l'annulla, che così non annullava
     niente: la riga tolta rientrava, ma quella aggiunta restava, perché unire
     due copie tiene tutto di tutte e due. Le prove `annulla` e `lezioni`
     l'hanno detto subito.
     Le due cose sono opposte per natura. Unire vuol dire «queste sono due
     mezze verità della stessa storia»; tornare indietro vuol dire «questa
     storia non è mai successa». */
  function ripristinaStato(obj: unknown) {
    if (!obj || typeof obj !== 'object') return false;
    var primaRaw: string | null = null;
    try { primaRaw = localStorage.getItem(STORAGE_KEY); } catch (e) { primaRaw = null; }
    hydrate(obj, true);
    /* come il ritorno a un punto: quello che torna vince sulla sua lapide,
       quello che se ne va ne prende una (le segna `marcaRitorno`) */
    marcaRitorno(primaRaw, load());
    senzaLapidi++;
    save();
    senzaLapidi--;
    return true;
  }

  function importJson(text: string) {
    var obj;
    try { obj = JSON.parse(text); } catch (e) { return { ok: false, err: 'File non valido: non è JSON leggibile.' }; }
    var st = (obj && obj.stato) ? obj.stato : obj; // accetta il file esportato o lo stato nudo
    if (!st || typeof st !== 'object' || !Array.isArray(st.azioni)) {
      return { ok: false, err: 'Il file non contiene dati LifeMax.' };
    }
    backup('prima-import');
    scordaPunti();
    st.updatedAt = Date.now();
    /* IMPORTARE AGGIUNGE, NON SOSTITUISCE. Un file portato da un altro
       dispositivo è una copia parziale della stessa vita, non una vita
       diversa: sostituire vorrebbe dire buttare via tutto quello che c'è qui
       e che nel file non c'è. La copia di sicurezza qui sopra resta comunque,
       per chi voleva davvero ripartire da quel file: da Impostazioni →
       Backup si torna a com'era un istante fa. */
    var quanti = ricchezza(st);
    /* QUANTO DI QUESTO FILE NON ENTRERÀ, e perché va detto PRIMA di dire
       «fatto». «Azzera tutto» scrive l'istante in cui è stato chiesto, e la
       fusione taglia tutto quello che è più vecchio: serve, se no il cloud
       si rimangerebbe l'azzeramento alla prima sincronizzazione (vedi il
       commento lungo in `unisci`). Ma vuol dire che chi azzera e POI
       ripesca il suo backup si ritrova quasi niente — e finora l'app gli
       diceva «Dati importati (322 elementi)», che era il conto di quello
       che stava NEL FILE, non di quello che era entrato. Misurato: 322
       dichiarati, 91 arrivati, e nessuno lo diceva.
       Si contano le righe che il taglio prenderà, una per una. Non si guarda
       invece «quanto è cresciuto lo stato», che sarebbe zero anche
       reimportando un file che hai già — e gridare al lupo lì sarebbe il
       modo di non farsi più credere il giorno che il lupo c'è. */
    var taglio = Number((load() as unknown as Mappa)['azzerato']) || 0;
    var tagliati = 0;
    if (taglio && eMappa(st)) {
      var regoleImp = COME_UNIRE as unknown as Record<string, ModoFusione | undefined>;
      Object.keys(st).forEach(function (k) {
        if (regoleImp[k] !== 'elenco' || k === 'cancellati') return;
        var lista = (st as Mappa)[k];
        if (!Array.isArray(lista)) return;
        lista.forEach(function (r: unknown) { if (momentoRiga(r, 0) < taglio) tagliati++; });
      });
    }
    hydrate(st);
    registra('dati', tagliati
      ? 'Dati importati da file (' + quanti + ' elementi; ' + tagliati +
        ' righe più vecchie dell\u2019ultimo «Azzera tutto» non sono rientrate)'
      : 'Dati importati da file (' + quanti + ' elementi, uniti a quelli che c\u2019erano)', true);
    senzaLapidi++;
    save();
    senzaLapidi--;
    return { ok: true, ricchezza: quanti, tagliati: tagliati };
  }

  /* METTE DENTRO UNO STATO CHE ARRIVA DA FUORI (il cloud, un file).
     Questa funzione SOSTITUIVA tutto, e da lì è nata la perdita: bastava che
     il documento in arrivo fosse più povero in un punto solo — un telefono
     con zero scoperte perché quelle scoperte erano nate mentre lui era
     offline — e quel punto spariva anche di qua.
     Adesso i due si UNISCONO: quello che c'è da una parte sola resta, e il
     più recente vince solo dove le due dicono cose diverse sulla stessa riga.
     `updatedAt` del documento remoto non si rigenera, così i dispositivi
     continuano a capirsi su chi è più avanti. */
  /* `sostituisci` è vero SOLO per le tre cose che vogliono dire «questa storia
     non è mai successa»: annullare, tornare a un punto, ripristinare una copia
     di sicurezza. Tutto il resto — il cloud, un file importato — unisce. */
  function hydrate(obj: unknown, sostituisci?: boolean, opz?: OpzUnisci) {
    if (!obj || typeof obj !== 'object') return;
    var qui = load();
    var fuso = (sostituisci ? obj : unisci(qui, obj, opz)) as Stato | null;
    if (!fuso) return;
    var quando = eMappa(obj) ? obj['updatedAt'] : undefined;
    if (typeof quando === 'number') fuso.updatedAt = Math.max(fuso.updatedAt || 0, quando);
    /* QUELLO CHE SI SAPEVA RESTA SAPUTO. Anche quando si sostituisce
       (annullare, tornare a una copia) gli orologi di adesso non si buttano:
       dicono cosa è stato tolto e quando, e senza di loro una cosa rimessa al
       suo posto da una copia vecchia sparirebbe di nuovo alla prima fusione
       con un dispositivo che sa della cancellazione. */
    if (sostituisci && eMappa(qui.orologi)) {
      var o: Record<string, number> = eMappa(fuso.orologi) ? JSON.parse(JSON.stringify(fuso.orologi)) : {};
      Object.keys(qui.orologi).forEach(function (k) { var t = qui.orologi[k] || 0; if (t > (o[k] || 0)) o[k] = t; });
      fuso.orologi = o;
    }
    /* le ore viste arrivare da fuori: da qui in poi non si scrive niente di più vecchio */
    osserva(fuso.updatedAt);
    if (eMappa(fuso.orologi)) { var mx = 0; Object.keys(fuso.orologi).forEach(function (k) { var t = fuso && fuso.orologi[k] || 0; if (t > mx) mx = t; }); osserva(mx); }
    senzaLapidi++;
    state = normalizza(fuso);
    try {
      var testo = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, testo);
      ultimoScritto = testo;
    } catch (e) { /* ignora */ }
    senzaLapidi--;
    document.dispatchEvent(new CustomEvent('lm:change'));
  }

  function snapshot(): Stato { return load(); }

  function uid() {
    return 'id' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  /* ---------- mutazioni ---------- */

  /* I PUNTI VANNO NEL CONTO DI QUESTO DISPOSITIVO (vedi `xpConti`), e
     `xp` e `xpPerGiorno` si rifanno da lì. Dare aggiunge alla prima colonna,
     togliere alla seconda: nessuna delle due torna mai indietro, ed è per
     questo che due dispositivi si possono unire senza perdere niente. */
  function contoDi(s: Stato, k: string): [number, number] {
    if (!eMappa(s.xpConti)) s.xpConti = {};
    var g = s.xpConti[k] || (s.xpConti[k] = {});
    var d = idDispositivo();
    var c = g[d];
    if (!c || !Array.isArray(c)) { c = [0, 0]; g[d] = c; }
    return c;
  }
  function premiaXp(tipo: keyof typeof XP_EVENTI, quando?: Giorno) {
    var s = load();
    var punti = XP_EVENTI[tipo] || 0;
    var k = quando || todayKey();
    var c = contoDi(s, k);
    c[0] += punti;
    ricalcolaXp(s);
    return punti;
  }
  /* XP in una misura che non sta nella tabella degli eventi: serve per il
     pezzo di una cosa lasciata a metà, che vale in proporzione a quanto ne
     hai fatto e non un valore fisso */
  function dammiXp(punti: number, quando?: Giorno) {
    var s = load();
    var k = quando || todayKey();
    var c = contoDi(s, k);
    c[0] += punti;
    ricalcolaXp(s);
    return punti;
  }
  /* toglie XP già assegnati (es. quando si toglie la spunta a una task).
     Come prima, un giorno non va sotto zero: si toglie al massimo quello
     che quel giorno ha. */
  function togliXp(punti: number, quando?: Giorno) {
    var s = load();
    var k = quando || todayKey();
    ricalcolaXp(s);
    var ha = s.xpPerGiorno[k] || 0;
    var via = Math.min(Math.max(0, punti), ha);
    if (!via) return;
    var c = contoDi(s, k);
    c[1] += via;
    ricalcolaXp(s);
  }

  /* Registro: storia di TUTTO ciò che si fa (impostazioni, scritte, selezioni,
     eliminazioni…). `imp` = importante (mostrato di default nel Diario; il
     resto si vede col flag "mostra tutto"). Non salva da solo: lo fa il
     chiamante col suo save(). Cap per non gonfiare lo stato/il cloud. */
  /* `disfa` è come si torna indietro da questa riga: {t: tipo, k: chiave} per
     annullaRecord. La portano le righe che raccontano un cambiamento di cui
     esiste un inverso preciso ma che nel diario non hanno una riga loro — la
     spunta di un'abitudine, per esempio, che come evento a sé riempirebbe il
     diario di una riga per abitudine al giorno. */
  function registra(cat: string, testo: string, imp?: boolean, disfa?: Disfa | null) {
    var s = load();
    if (!Array.isArray(s.registro)) s.registro = [];
    var e: VoceRegistro = { ts: Date.now(), cat: cat, testo: testo, imp: !!imp };
    if (disfa) e.disfa = disfa;
    s.registro.push(e);
    if (s.registro.length > 800) s.registro = s.registro.slice(-800);
  }

  /* La priorità del giorno (MIT) è UNA sola: "se fai solo quella, la giornata
     è a posto". Serve una nuova MIT solo se il giorno non ne ha ancora
     nessuna — anche già completata, altrimenti finire la priorità e
     aggiungere un'altra cosa creerebbe una seconda priorità (e XP gonfiati). */
  function serveMit(k?: Giorno) {
    k = k || todayKey();
    return !load().azioni.some(function (a) { return a.data === k && a.mit; });
  }

  /* UN'ATTIVITÀ CHE VIENE DA UN CALENDARIO, TOLTA A MANO: la cancellazione
     va riportata là. Si scrive qui, nei due soli gesti che vogliono dire
     «non c'è più» — eliminarla e rimetterla fra le cose da fare — e non
     nelle lapidi, che nascono anche da un «Azzera tutto» o da un backup
     ripristinato: nessuno dei due deve svuotare il calendario di Google.
     A spedirla ci pensa src/calendari/sincronia.ts. */
  function segnaTolta(s: Stato, a: Azione) {
    var e = a.esterno;
    if (!e) return;
    var c = s.profilo.calendari || (s.profilo.calendari = {});
    var t = c.tolti || (c.tolti = {});
    t[a.id] = { prov: e.prov, cal: e.cal, id: e.id, ts: Date.now() };
  }

  function aggiungiAzione(testo: string, areaId: string | null, opts?: OpzAzione) {
    var s = load();
    opts = opts || {};
    var data = opts.data || todayKey();
    var a = {
      id: uid(),
      areaId: areaId || 'altro',
      testo: testo,
      ifThen: opts.ifThen || '',
      mit: !!opts.mit,
      done: false,
      data: data,
      doneAt: null,
      creata: Date.now(),
      ora: opts.ora || null,          // 'HH:MM' se ha un orario nella giornata
      durata: opts.durata || null,    // minuti che occupa (per i blocchi della timeline)
      passoDi: opts.passoDi || null   // {b: idProgetto, s: idPasso} se nasce da un progetto
    };
    /* invariante: una sola MIT per giorno */
    if (a.mit) s.azioni.forEach(function (x) { if (x.data === data) x.mit = false; });
    s.azioni.push(a);
    if (!opts.interna) registra('azione', 'Aggiunta a oggi «' + testo + '»', false);
    save();
    return a;
  }

  function completaAzione(id: string) {
    var s = load();
    var a = s.azioni.find(function (x) { return x.id === id; });
    if (!a) return 0;
    /* togliere la spunta (messa per errore): rimuove gli XP dati */
    if (a.done) {
      var tolti = a.mit ? XP_EVENTI.mit : XP_EVENTI.azione;
      togliXp(tolti, a.doneAt ? dayKey(new Date(a.doneAt)) : a.data);
      a.done = false;
      a.doneAt = null;
      /* `a.passoDi` dentro a una closure perde la restrizione dell'`if`:
         si tiene per mano in una variabile, che è anche più chiaro */
      const pd0 = a.passoDi;
      if (pd0) {
        var prog0 = s.backlog.find(function (x) { return x.id === pd0.b; });
        if (prog0 && prog0.steps) { var st0 = prog0.steps.find(function (x) { return x.id === pd0.s; }); if (st0) st0.done = false; }
      }
      registra('azione', 'Tolta la spunta a «' + a.testo + '» (−' + tolti + ' XP)', false);
      save();
      return -tolti;
    }
    a.done = true;
    /* spuntare a posteriori: gli XP e la data del "fatto" vanno sul giorno
       dell'azione, non su oggi, altrimenti falserebbero le statistiche. */
    a.doneAt = (a.data === todayKey()) ? Date.now() : (parseKey(a.data).getTime() + 12 * 3600000);
    var punti = premiaXp(a.mit ? 'mit' : 'azione', a.data);
    /* se l'azione era il passo di un progetto, spuntalo; se il progetto
       è completo, lo rimuove dalle cose da fare */
    const pd = a.passoDi;
    if (pd) {
      var prog = s.backlog.find(function (x) { return x.id === pd.b; });
      if (prog && prog.steps) {
        var quale = prog, passiQ = prog.steps;
        var st = passiQ.find(function (x) { return x.id === pd.s; });
        if (st) st.done = true;
        if (passiQ.length && passiQ.every(function (x) { return x.done; })) {
          s.backlog = s.backlog.filter(function (x) { return x.id !== quale.id; });
        }
      }
    }
    save();
    return punti;
  }

  /* ANNULLA una pianificazione: l'azione esce dal giorno e torna tra le cose
     da fare. Serve per disdire un giorno messo per sbaglio: prima l'unica via
     era cancellare e riscrivere. Se era il passo di un progetto, il passo
     torna semplicemente "non pianificato" (il progetto non si tocca). */
  function azioneInBacklog(id: string) {
    var s = load();
    var i = s.azioni.findIndex(function (x) { return x.id === id; });
    if (i < 0) return null;
    var a = presa(s.azioni[i]);
    var eraPasso = !!a.passoDi;
    s.azioni.splice(i, 1);
    segnaTolta(s, a);
    if (a.mit) {
      var erede = s.azioni.find(function (x) { return x.data === a.data && !x.done; });
      if (erede) erede.mit = true;
    }
    var b = null;
    if (!eraPasso) {
      b = { id: uid(), testo: a.testo, areaId: a.areaId, creata: Date.now(), scadenza: null, steps: [] };
      s.backlog.unshift(b);
    }
    registra('azione', eraPasso
      ? 'Tolta dal giorno: «' + a.testo + '» (il passo resta nel progetto)'
      : 'Rimessa tra le cose da fare: «' + a.testo + '»', true);
    save();
    return b || a;
  }

  /* Sposta un'azione in un altro giorno (ripianificare senza riscrivere).
     Serve al trascinamento tra i giorni e al pulsante "rimanda a domani". */
  function spostaAzione(id: string, giorno: Giorno) {
    var s = load();
    var a = s.azioni.find(function (x) { return x.id === id; });
    if (!a || !giorno || a.data === giorno) return null;
    var vecchio = a.data;
    a.data = giorno;
    /* la priorità vale per giorno: se se ne va, non resta appesa al vecchio */
    if (a.mit) {
      a.mit = false;
      var erede = s.azioni.find(function (x) { return x.data === vecchio && !x.done; });
      if (erede) erede.mit = true;
      if (!s.azioni.some(function (x) { return x.data === giorno && x.mit; })) a.mit = true;
    }
    registra('giornata', 'Spostata «' + a.testo + '» al ' + fmtShort(giorno), true);
    save();
    return a;
  }

  /* UN IMPEGNO DEL CALENDARIO, LA SERA: SI SPOSTA DA SOLO? Sì solo se è
     tuo e basta — l'hai organizzato tu, non c'è nessun altro invitato, e il
     calendario si può scrivere. Allora spostarlo a domani (alla stessa ora,
     con la stessa durata) non disturba nessuno, e lo fa anche là la
     sincronizzazione, come per uno spostamento a mano. Una riunione con
     altre persone no: la riunione di oggi non diventa quella di domani
     perché non l'hai spuntata. Per quelle la Giornata chiede, una per una
     (`riunioniDaDecidere`), e dice perché. */
  function perche(s: Stato, x: Azione): string {
    var e = x.esterno;
    if (!e) return '';
    var acc = s.profilo.calendari && s.profilo.calendari[e.prov];
    var sc = acc && acc.collegato ? acc.calendari[e.cal] : undefined;
    if (!sc || sc.lettura) return 'lettura';
    if (e.invito === 'solo') return '';
    return e.invito || 'ignoto';
  }
  function siSpostaDaSola(s: Stato, x: Azione) { return !x.esterno || perche(s, x) === ''; }
  function riunioniDaDecidere(daGiorno: Giorno) {
    var s = load();
    var spiega: Record<string, string> = {
      tua: 'Ci sono altri invitati: se la sposti, si sposta per tutti.',
      altrui: 'L’ha organizzata qualcun altro: nel calendario non la puoi spostare, qui sì.',
      lettura: 'Il calendario è in sola lettura: là non si sposta, qui sì.',
      ignoto: 'Non so ancora se ci sono altri invitati: decidi tu.'
    };
    /* «saltata» (non ci sei riuscito) è già una risposta: non si richiede */
    return s.azioni.filter(function (x) { return x.data === daGiorno && !x.done && !x.mancata && !!x.esterno && !siSpostaDaSola(s, x); })
      .map(function (x) {
        var m = perche(s, x);
        /* «staccare» vuol dire spostarla solo qui: là non si può scrivere */
        return { id: x.id, testo: x.testo, ora: x.ora, perche: spiega[m] || '', stacca: m === 'altrui' || m === 'lettura' };
      });
  }
  /* SPOSTARE SOLO QUI una riunione che il calendario non lascia spostare:
     si stacca (non si sincronizza più) e si sposta. Il calendario resta
     com'è. */
  function spostaStaccata(id: string, giorno: Giorno) {
    var s = load();
    var a = s.azioni.find(function (x) { return x.id === id; });
    if (!a) return null;
    if (a.esterno) { a.esterno = null; a.aggiornata = Date.now(); }
    return spostaAzione(id, giorno);
  }

  /* Porta al giorno dopo tutto quello che non è stato fatto: la sera si
     ripulisce la giornata senza riscrivere niente (e senza penalità). */
  function rimandaNonFatte(daGiorno: Giorno, aGiorno: Giorno) {
    var s = load();
    var da = daGiorno || todayKey();
    var a2 = aGiorno || addDays(da, 1);
    /* gli impegni solo tuoi del calendario vanno con le altre; le riunioni
       con altre persone restano, e le decidi una per una (vedi sopra) */
    var mosse = s.azioni.filter(function (x) { return x.data === da && !x.done && siSpostaDaSola(s, x); });
    if (!mosse.length) return 0;
    mosse.forEach(function (x) { x.data = a2; x.mit = false; });
    /* nel giorno di arrivo serve una sola priorità */
    if (!s.azioni.some(function (x) { return x.data === a2 && x.mit; }) && mosse[0]) mosse[0].mit = true;
    registra('giornata', mosse.length + (mosse.length === 1 ? ' cosa non fatta spostata al ' : ' cose non fatte spostate al ') + fmtShort(a2), true);
    save();
    return mosse.length;
  }

  function rimandaAzione(id: string) {
    /* "non ora" senza punizione: sposta in fondo alla lista di oggi */
    var s = load();
    var i = s.azioni.findIndex(function (x) { return x.id === id; });
    if (i < 0) return;
    var a = presa(s.azioni.splice(i, 1)[0]);
    a.mit = false;
    s.azioni.push(a);
    save();
  }

  /* ---------- «NON CI SONO RIUSCITO» ----------
     Non è cancellare, e non è rimandare. È il terzo esito, e finora non
     esisteva: una cosa che avevi deciso di fare si poteva solo finire,
     spostare più in là, o far sparire.

     Cancellandola sparisce anche dal registro di quello che è successo, e il
     registro diventa un elenco delle sole cose andate bene — che è
     esattamente il registro che non serve a niente, perché per capire cosa
     funziona per te devi poter vedere anche cosa non ha funzionato. Le
     Scoperte, gli Esperimenti e le lezioni di quest'app girano tutti intorno
     a quella domanda: senza i mancati, rispondono guardando metà dei dati.

     Non toglie XP e non rompe niente. Il senso di colpa non è un dato utile:
     quello che serve è il fatto, insieme al perché se ti va di scriverlo. */
  /* QUANTO NE HAI FATTO DAVVERO.
     «Fatto» e «non fatto» sono due caselle per una cosa che quasi mai sta in
     una delle due: le cose si lasciano a metà, e chiamare «niente» un'ora di
     lavoro perché non è finita è falso due volte — falso nei dati, e falso
     addosso a chi l'ha fatta.
     Quattro gradini e non un cursore da zero a cento: un cursore chiede di
     stabilire una cifra su una cosa che una cifra non ce l'ha, e nel momento
     in cui hai appena mollato è una domanda a cui non si vuole rispondere.
     Quattro parole si toccano senza pensarci.
     Gli XP vanno in proporzione, con il minimo di uno per chi ha fatto
     qualcosa: premiare il pezzo fatto è il punto (il progresso, per piccolo
     che sia, è il motore più forte che c'è), e dare zero a chi ha lavorato
     mezz'ora insegna che vale la pena solo finire. */
  var QUANTO_FATTO = [
    { id: 'niente',  eti: 'Niente',      quota: 0 },
    { id: 'pezzo',   eti: 'Un pezzo',    quota: 0.25 },
    { id: 'meta',    eti: 'Circa metà',  quota: 0.5 },
    { id: 'quasi',   eti: 'Quasi tutta', quota: 0.8 }
  ];
  var PERCHE_MANCATA = [
    { id: 'tempo',    eti: 'Non c\'era tempo' },
    { id: 'energia',  eti: 'Non avevo energie' },
    { id: 'grossa',   eti: 'Era troppo grossa' },
    { id: 'vaga',     eti: 'Non sapevo da dove partire' },
    { id: 'altro',    eti: 'Altro' }
  ];
  /* vale sia per una cosa messa in un giorno sia per una che sta ancora
     nell'elenco «Da fare»: fallire una cosa non richiede di averla prima
     messa in agenda, e chiedere di programmarla per poter dire che non è
     andata sarebbe un giro assurdo */
  function trovaCosa(s: Stato, id: string): Azione | Attivita | null {
    return s.azioni.find(function (x) { return x.id === id; }) ||
      s.backlog.find(function (x) { return x.id === id; }) || null;
  }
  function segnaMancata(id: string, perche: string, nota: string, quanto: string) {
    var s = load();
    var a = trovaCosa(s, id);
    if (!a) return 0;
    var G = QUANTO_FATTO.find(function (x) { return x.id === quanto; }) || presa(QUANTO_FATTO[0]);
    a.done = false;
    if ('doneAt' in a) (a as Azione).doneAt = null;
    a.mancata = { ts: Date.now(), perche: perche || 'altro', nota: nota || '', quanto: G.id, quota: G.quota };
    var punti = 0;
    if (G.quota > 0) {
      /* gli XP del pezzo fatto, arrotondati per eccesso e almeno uno */
      /* «non ci sono riuscito» si dice sia di una cosa di oggi sia di una da
         fare, e solo la prima ha una priorità e un giorno: si guarda invece
         di dare per scontato che ci siano */
      var eAzione = 'data' in a;
      var pieni = (eAzione && (a as Azione).mit) ? XP_EVENTI.mit : XP_EVENTI.azione;
      punti = Math.max(1, Math.round(pieni * G.quota));
      dammiXp(punti, eAzione ? (a as Azione).data : todayKey());
    }
    var motivo = a.mancata ? a.mancata.perche : 'altro';
    var q = (PERCHE_MANCATA.find(function (x) { return x.id === motivo; }) || { eti: '' }).eti || '';
    registra('azione',
      (G.quota > 0 ? G.eti.toLowerCase() + ' di «' + a.testo + '»' : 'Non completata: «' + a.testo + '»') +
      (q ? ' — ' + q.toLowerCase() : '') + (punti ? ' (+' + punti + ' XP)' : ''), false);
    save();
    return punti;
  }
  function togliMancata(id: string) {
    var s = load();
    var a = trovaCosa(s, id);
    if (!a || !a.mancata) return false;
    /* gli XP del pezzo fatto tornano indietro con lui */
    if (a.mancata.quota > 0) {
      var eraAzione = 'data' in a;
      var pieni = (eraAzione && (a as Azione).mit) ? XP_EVENTI.mit : XP_EVENTI.azione;
      togliXp(Math.max(1, Math.round(pieni * a.mancata.quota)), eraAzione ? (a as Azione).data : todayKey());
    }
    delete a.mancata;
    registra('azione', 'Rimessa fra le cose da fare: «' + a.testo + '»', false);
    save();
    return true;
  }
  function mancate(giorni: number) {
    var s = load();
    var limite = giorni ? Date.now() - giorni * 86400000 : 0;
    var tutte: (Azione | Attivita)[] = (s.azioni as (Azione | Attivita)[]).concat(s.backlog);
    return tutte
      .filter(function (a) { return !!a.mancata && a.mancata.ts >= limite; })
      .sort(function (x, y) { return (y.mancata ? y.mancata.ts : 0) - (x.mancata ? x.mancata.ts : 0); });
  }

  function cattura(testo: string) {
    var s = load();
    var el = { id: uid(), testo: testo, creata: Date.now() };
    s.inbox.unshift(el);
    var punti = premiaXp('cattura');
    save();
    return punti;
  }

  function modificaInbox(id: string, testo: string) {
    var s = load();
    var el = s.inbox.find(function (x) { return x.id === id; });
    if (!el) return;
    el.testo = testo;
    registra('inbox', 'Modificata una nota da sistemare', false);
    save();
  }

  function cambiaAreaAzione(id: string, areaId: string) {
    var s = load();
    var a = s.azioni.find(function (x) { return x.id === id; });
    if (!a) return;
    a.areaId = areaId;
    var ar = s.aree.find(function (x) { return x.id === areaId; });
    registra('azione', 'Cambiata area di «' + a.testo + '» → ' + (ar ? ar.nome : areaId), false);
    save();
  }
  /* rinomina un'azione di oggi */
  function modificaAzione(id: string, testo: string) {
    var s = load();
    var a = s.azioni.find(function (x) { return x.id === id; });
    if (!a || !testo) return;
    a.testo = testo;
    registra('azione', 'Modificata «' + testo + '»', false);
    save();
  }
  /* elimina un'azione di oggi (senza penalità: era una scelta, non un fallimento) */
  function rimuoviAzione(id: string) {
    var s = load();
    var i = s.azioni.findIndex(function (x) { return x.id === id; });
    if (i < 0) return;
    var a = presa(s.azioni.splice(i, 1)[0]);
    segnaTolta(s, a);
    /* se era la priorità, il giorno non deve restare senza: promuovi la
       prima cosa ancora da fare, così resta chiaro da dove ripartire. */
    if (a.mit) {
      var next = s.azioni.find(function (x) { return x.data === a.data && !x.done; });
      if (next) next.mit = true;
    }
    registra('azione', 'Rimossa da oggi «' + a.testo + '»', true);
    save();
  }
  /* assegna o toglie l'orario di un'azione nella giornata */
  function setOraAzione(id: string, ora: Ora | null) {
    var s = load();
    var a = s.azioni.find(function (x) { return x.id === id; });
    if (!a) return;
    a.ora = ora || null;
    registra('giornata', ora ? 'Orario di «' + a.testo + '» → ' + ora : 'Tolto l’orario a «' + a.testo + '»', false);
    save();
  }
  /* durata (in minuti) che l'azione occupa nella giornata */
  function setDurataAzione(id: string, minuti: number | null) {
    var s = load();
    var a = s.azioni.find(function (x) { return x.id === id; });
    if (!a) return;
    a.durata = minuti || null;
    registra('giornata', 'Durata di «' + a.testo + '» → ' + (minuti ? minuti + ' min' : 'nessuna'), false);
    save();
  }
  /* azioni di un giorno qualsiasi (per le viste settimana/mese). Con i
     calendari collegati alla sentinella ci sono anche i FANTASMI: gli eventi
     lontani che non sono ancora attività (src/calendari/sincronia.ts). Non
     stanno nei dati: li si aggiunge qui, a chi guarda. */
  var fantasmiDi: ((k: Giorno) => Azione[]) | null = null;
  function registraFantasmi(f: (k: Giorno) => Azione[]) { fantasmiDi = f; }
  function azioniDelGiorno(k: Giorno): Azione[] {
    var vere = load().azioni.filter(function (a) { return a.data === k; });
    if (!fantasmiDi) return vere;
    try { return vere.concat(fantasmiDi(k)); } catch (e) { return vere; }
  }

  /* ---------- i promemoria ----------
     Le scelte stanno QUI e non in localStorage perché sono tue, non del
     dispositivo: cambiando telefono, o accedendo con Google, gli orari e gli
     interruttori si portano dietro insieme a tutto il resto. E finiscono
     nell'esportazione, così un backup contiene anche com'era configurato.

     `server` e `chiave` sono l'indirizzo del postino e la sua chiave
     pubblica: si scrivono da Impostazioni, senza toccare il codice. La
     privata non passa mai da qui — sta su Cloudflare e basta. */
  /* dichiarato `Promemoria` e non lasciato indovinare: e' la forma che il
     pannello, `normalizza` e il modulo dei promemoria si passano fra loro, e
     scritta a mano `voci.abitudini` non aveva l'`ora` facoltativa — quindi
     chi la leggeva per nome non compilava */
  var PROMEMORIA_DEFAULT: Promemoria = {
    server: '', chiave: '',
    fissa: false,
    voci: {
      mattina:   { on: true, ora: ora('08:30') },
      checkin:   { on: true, ora: ora('13:00') },
      mit:       { on: true, ora: ora('16:30') },
      sera:      { on: true, ora: ora('21:30') },
      /* le abitudini non hanno un'ora qui: ognuna ha la sua */
      abitudini: { on: true }
    },
    /* la fascia in cui non arriva niente. Non è un dettaglio: un promemoria
       alle due di notte non si legge, sveglia, e insegna a spegnere tutto. */
    silenzio: { on: true, da: ora('23:00'), a: ora('07:00') }
  };
  var ORA_VALIDA = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;

  /* torna sempre una configurazione: se non c'è la mette la riga di sopra.
     `presa` dice al compilatore quello che dice quella riga — senza, chi
     legge `promemoria().voci.mattina` deve controllare il niente a ogni
     chiamata per un caso che non esiste. */
  function promemoria(): Promemoria {
    var s = load();
    if (!s.profilo.promemoria) s.profilo.promemoria = JSON.parse(JSON.stringify(PROMEMORIA_DEFAULT)) as Promemoria;
    return presa(s.profilo.promemoria);
  }

  /* Una toppa per volta, e ogni pezzo controllato: questi valori arrivano da
     due campi di testo, e un orario scritto male qui vorrebbe dire un
     promemoria che non parte mai senza che nessuno capisca perché. */
  function impostaPromemoria(patch: Record<string, unknown>) {
    var c = promemoria() as Promemoria;
    if (patch['server'] != null) c.server = String(patch['server']).trim().replace(/\/+$/, '');
    if (patch['chiave'] != null) c.chiave = String(patch['chiave']).trim();
    if (patch['fissa'] != null) c.fissa = !!patch['fissa'];
    var vociPatch = eMappa(patch['voci']) ? patch['voci'] as Record<string, unknown> : null;
    if (vociPatch) {
      var mie = c.voci as unknown as Record<string, VocePromemoria | undefined>;
      var vociPatch2 = vociPatch;
      Object.keys(vociPatch2).forEach(function (k) {
        var mia = mie[k];
        if (!mia) return;                             /* niente voci inventate */
        var v = eMappa(vociPatch2[k]) ? vociPatch2[k] as Record<string, unknown> : null;
        if (!v) return;
        if (v['on'] != null) mia.on = !!v['on'];
        var oraNuova = v['ora'];
        if (oraNuova != null && ORA_VALIDA.test(String(oraNuova)) && mia.ora != null) mia.ora = oraNuova as Ora;
      });
    }
    var sil = eMappa(patch['silenzio']) ? patch['silenzio'] as Record<string, unknown> : null;
    if (sil) {
      if (sil['on'] != null) c.silenzio.on = !!sil['on'];
      if (ORA_VALIDA.test(String(sil['da'] || ''))) c.silenzio.da = sil['da'] as Ora;
      if (ORA_VALIDA.test(String(sil['a'] || ''))) c.silenzio.a = sil['a'] as Ora;
    }
    registra('impostazioni', 'Cambiate le impostazioni dei promemoria', false);
    save();
    return c;
  }

  /* ---------- ritmo della giornata e preferenza di visualizzazione ---------- */

  /* ritmo di BASE (vale per i giorni senza un registro loro) */
  /* Una toppa: uno dei due gruppi, uno dei suoi campi. Chi chiama ne cambia
     un pezzo per volta — l'interruttore, o un'ora — e non deve riscrivere
     tutto il resto per farlo. */
  function impostaChiedi(patch: PatchChiedi) {
    var s = load();
    if (!s.profilo.chiedi) s.profilo.chiedi = JSON.parse(JSON.stringify(CHIEDI_DEFAULT));
    var tutte = s.profilo.chiedi as unknown as Record<string, { on: boolean; da: Ora; a?: Ora } | undefined>;
    (['notte', 'giorno'] as const).forEach(function (q) {
      const p = patch[q];
      if (!p) return;
      var c = tutte[q] || (tutte[q] = JSON.parse(JSON.stringify(CHIEDI_DEFAULT[q])));
      if (!c) return;
      if (typeof p.on === 'boolean') c.on = p.on;
      if (p.da) c.da = p.da;
      /* `a` — «non dopo le» — ce l'ha solo la domanda della notte: quella
         del giorno è una volta sola, a fine giornata. */
      if ('a' in p && p.a) c.a = p.a;
    });
    registra('impostazioni', 'Cambiato quando l\u2019app chiede del sonno e dei pasti', false);
    save();
  }
  /* una COPIA, non l'originale: chi la riceve la tiene in mano e ci scrive
     dentro (il pannello del ritmo lo fa), e scrivere nell'oggetto vivo dei
     dati vorrebbe dire cambiarli senza passare da `save` */
  function chiediQuando(): Chiedi {
    var c = load().profilo.chiedi || CHIEDI_DEFAULT;
    return JSON.parse(JSON.stringify(c)) as Chiedi;
  }

  function impostaRitmo(patch: Partial<Ritmo>) {
    var s = load();
    if (!s.profilo.ritmo) s.profilo.ritmo = JSON.parse(JSON.stringify(RITMO_DEFAULT));
    if (patch.sveglia != null) s.profilo.ritmo.sveglia = patch.sveglia;
    if (patch.sonno != null) s.profilo.ritmo.sonno = patch.sonno;
    if (Array.isArray(patch.pasti)) s.profilo.ritmo.pasti = patch.pasti;
    registra('impostazioni', 'Aggiornato il ritmo di base (sonno e pasti)', false);
    save();
  }
  /* sonno e pasti EFFETTIVI di un giorno: il registro del giorno se c'è,
     altrimenti il ritmo di base. */
  function ritmoDi(k: Giorno) {
    var s = load();
    var base = s.profilo.ritmo || RITMO_DEFAULT;
    var g = (s.ritmoGiorno && s.ritmoGiorno[k]) || {};
    return {
      sveglia: g.sveglia || base.sveglia,
      sonno: g.sonno || base.sonno,
      /* Il sonno/sveglia registrato per un giorno è il RESOCONTO della notte
         appena passata (a che ora sono andato a letto e mi sono svegliato).
         La fine della giornata sul grafico, invece, è la routine pianificata:
         "stanotte" non è ancora successo, quindi segue il ritmo di base. */
      sonnoRoutine: base.sonno,
      svegliaRoutine: base.sveglia,
      pasti: Array.isArray(g.pasti) ? g.pasti : base.pasti,
      dalRegistro: !!(s.ritmoGiorno && s.ritmoGiorno[k])
    };
  }
  /* registra sonno/pasti per un singolo giorno (registro). patch può avere
     sveglia, sonno, pasti. */
  function setRitmoGiorno(k: Giorno, patch: Partial<RegistroGiorno>) {
    var s = load();
    if (!s.ritmoGiorno) s.ritmoGiorno = {};
    var cur = s.ritmoGiorno[k];
    if (!cur) { var b = ritmoDi(k); cur = { sveglia: b.sveglia, sonno: b.sonno, pasti: JSON.parse(JSON.stringify(b.pasti)) }; }
    if (patch.sveglia != null) cur.sveglia = patch.sveglia;
    if (patch.sonno != null) cur.sonno = patch.sonno;
    if (Array.isArray(patch.pasti)) cur.pasti = patch.pasti;
    s.ritmoGiorno[k] = cur;
    registra('giornata', 'Registrato sonno/pasti del ' + fmtShort(k), false);
    save();
  }
  /* rimuove il registro di un giorno: torna al ritmo di base */
  function azzeraRitmoGiorno(k: Giorno) {
    var s = load();
    if (s.ritmoGiorno && s.ritmoGiorno[k]) { delete s.ritmoGiorno[k]; registra('giornata', 'Sonno/pasti del ' + fmtShort(k) + ' tornati al ritmo di base', false); save(); }
  }
  /* minuti di sonno di un giorno (a letto → sveglia, attraversa la mezzanotte) */
  function minutiSonno(k: Giorno) {
    var r = ritmoDi(k);
    function m(hhmm: string | null | undefined) { var p = String(hhmm).split(':'); return (+(p[0] || 0)) * 60 + (+(p[1] || 0)); }
    var a = m(r.sonno), b = m(r.sveglia);
    var dur = b - a; if (dur <= 0) dur += 1440;
    return dur;
  }

  /* ---------- backlog (attività "da fare", senza data) ---------- */

  function aggiungiBacklog(testo: string, areaId: string | null, interna?: boolean) {
    var s = load();
    var b = { id: uid(), testo: testo, areaId: areaId || 'altro', creata: Date.now() };
    s.backlog.push(b);
    if (!interna) registra('backlog', 'Aggiunta a «Da fare»: «' + testo + '»', false);
    save();
    return b;
  }
  function modificaBacklog(id: string, testo: string) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === id; });
    if (!b) return; b.testo = testo; registra('backlog', 'Rinominata un’attività → «' + testo + '»', false); save();
  }
  function cambiaAreaBacklog(id: string, areaId: string) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === id; });
    if (!b) return; b.areaId = areaId;
    var ar = s.aree.find(function (x) { return x.id === areaId; });
    registra('backlog', 'Cambiata area di «' + b.testo + '» → ' + (ar ? ar.nome : areaId), false); save();
  }
  function rimuoviBacklog(id: string) {
    var s = load();
    var i = s.backlog.findIndex(function (x) { return x.id === id; });
    if (i >= 0) { registra('backlog', 'Eliminata l’attività «' + presa(s.backlog[i]).testo + '»', true); s.backlog.splice(i, 1); save(); }
  }
  /* porta un elemento del backlog tra le azioni di oggi (senza XP: è solo
     spostamento). mit true se oggi non c'è ancora nessuna azione. */
  /* Porta una cosa da fare in un giorno: oggi (default) o un giorno futuro,
     così si può distribuire il lavoro sulla settimana invece di ammucchiarlo
     tutto su oggi. */
  function backlogInOggi(id: string, giorno?: Giorno) {
    var s = load();
    var i = s.backlog.findIndex(function (x) { return x.id === id; });
    if (i < 0) return null;
    var k = giorno || todayKey();
    var b = presa(s.backlog.splice(i, 1)[0]);
    var a = aggiungiAzione(b.testo, b.areaId, { data: k, mit: serveMit(k), interna: true });
    registra('azione', k === todayKey()
      ? 'Portata in Oggi: «' + b.testo + '»'
      : 'Pianificata per il ' + fmtShort(k) + ': «' + b.testo + '»', true);
    save();
    return a;
  }
  /* ---------- progetti: un'attività "da fare" con passi ordinati ---------- */

  function aggiungiPasso(bid: string, testo: string) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === bid; });
    if (!b) return;
    if (!Array.isArray(b.steps)) b.steps = [];
    var passi = b.steps;
    passi.push({ id: uid(), testo: testo, done: false });
    registra('backlog', 'Aggiunto un passo a «' + b.testo + '»: ' + testo, false);
    save();
  }
  function rimuoviPasso(bid: string, sid: string) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === bid; });
    if (!b || !b.steps) return;
    var st = b.steps.find(function (x) { return x.id === sid; });
    b.steps = b.steps.filter(function (x) { return x.id !== sid; });
    registra('backlog', 'Eliminato un passo di «' + b.testo + '»' + (st ? ': ' + st.testo : ''), false);
    save();
  }
  /* Torna `true` se il passo è stato SPUNTATO, `false` se la spunta è stata
     tolta, `null` se quel passo non c'è (cancellato, o arrivata la fusione da
     un altro dispositivo mentre la scheda era aperta).
     Prima non tornava niente, e la scheda ci passava sopra il risultato a
     `feedbackSpunta(ev, xp, …)` — che con `undefined` non fa niente: nessuna
     conferma, nessuno scoppio, nessun toast. Spuntare un passo di un progetto
     è sempre stato l'unico gesto di questo tipo senza risposta. I punti non
     ce li ha e non deve averceli (li dà l'azione che nasce dal passo): quello
     che mancava è il «fatto». */
  function togglePasso(bid: string, sid: string): boolean | null {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === bid; });
    var st = b && b.steps && b.steps.find(function (x) { return x.id === sid; });
    if (!st || !b) return null;
    st.done = !st.done;
    var suoT = b, passiT = b.steps || [];
    registra('backlog', (st.done ? 'Fatto un passo' : 'Tolta la spunta a un passo') + ' di «' + suoT.testo + '»: ' + st.testo, false);
    /* progetto completato a mano: lo rimuove dalle cose da fare */
    if (passiT.length && passiT.every(function (x) { return x.done; })) {
      registra('backlog', 'Progetto completato: «' + suoT.testo + '»', true);
      s.backlog = s.backlog.filter(function (x) { return x.id !== suoT.id; });
    }
    save();
    return st.done;
  }
  function avanzamentoProgetto(b: Attivita) {
    var tot = (b.steps || []).length;
    var fatti = (b.steps || []).filter(function (x) { return x.done; }).length;
    return { fatti: fatti, tot: tot, pct: tot ? Math.round(fatti / tot * 100) : 0 };
  }
  /* porta in Oggi il prossimo passo non fatto e non già in lista oggi */
  function prossimoPassoInOggi(bid: string, giorno?: Giorno) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === bid; });
    if (!b || !b.steps) return null;
    var k = giorno || todayKey();
    var gia: Record<string, boolean> = {};
    azioniDelGiorno(k).forEach(function (a) { if (!a.done && a.passoDi && a.passoDi.b === bid) gia[a.passoDi.s] = true; });
    var st = b.steps.find(function (x) { return !x.done && !gia[x.id]; });
    if (!st) return null;
    var az = aggiungiAzione(st.testo, b.areaId, { data: k, mit: serveMit(k), passoDi: { b: bid, s: st.id }, interna: true });
    registra('azione', (k === todayKey() ? 'Portato in Oggi' : 'Pianificato per il ' + fmtShort(k)) + ' il passo di «' + b.testo + '»: ' + st.testo, true);
    save();
    return az;
  }

  /* Distribuisci i passi ancora aperti UNO PER GIORNO a partire da un giorno.
     Un progetto non sta in una sola giornata: così si spalma da solo.
     `ogniQuanti` = 1 tutti i giorni, 7 una volta a settimana, ecc. */
  function distribuisciPassi(bid: string, daGiorno: Giorno, ogniQuanti: number) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === bid; });
    if (!b || !b.steps || !b.steps.length) return 0;
    var passo = Math.max(1, ogniQuanti || 1);
    var k = daGiorno || todayKey();
    /* i passi già in agenda non si duplicano */
    var giaFuori: Record<string, boolean> = {};
    s.azioni.forEach(function (a) { if (!a.done && a.passoDi && a.passoDi.b === bid) giaFuori[a.passoDi.s] = true; });
    var daFare = b.steps.filter(function (st) { return !st.done && !giaFuori[st.id]; });
    if (!daFare.length) return 0;
    var suo = b;
    daFare.forEach(function (st, i) {
      var quando = addDays(k, i * passo);
      aggiungiAzione(st.testo, suo.areaId, { data: quando, mit: serveMit(quando), passoDi: { b: bid, s: st.id }, interna: true });
    });
    registra('backlog', daFare.length + ' passi di «' + suo.testo + '» distribuiti da ' + fmtShort(k) +
      (passo === 1 ? ', uno al giorno' : ', uno ogni ' + passo + ' giorni'), true);
    save();
    return daFare.length;
  }

  /* Trasforma una cosa da fare (o un progetto) in ABITUDINE ricorrente: per gli
     obiettivi che non si chiudono in un giorno ma si costruiscono ripetendo. */
  function backlogInAbitudine(bid: string, giorni: GiornoSettimana[], opts?: { ora?: Ora | null; durata?: number | null }) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === bid; });
    if (!b) return null;
    var h = aggiungiAbitudine(b.testo, b.areaId, giorni && giorni.length ? giorni : [1, 2, 3, 4, 5, 6, 0], opts || {});
    if (!opts || (opts as { mantieni?: boolean }).mantieni !== true) {
      s = load();
      s.backlog = s.backlog.filter(function (x) { return x.id !== bid; });
    }
    registra('abitudine', '«' + b.testo + '» è diventata un’abitudine', true);
    save();
    return h;
  }

  /* Mette UN passo specifico in un giorno (o lo sposta se già in agenda) */
  function pianificaPasso(bid: string, sid: string, giorno: Giorno) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === bid; });
    if (!b || !b.steps) return null;
    var st = b.steps.find(function (x) { return x.id === sid; });
    if (!st) return null;
    var k = giorno || todayKey();
    var gia = s.azioni.find(function (a) { return !a.done && a.passoDi && a.passoDi.b === bid && a.passoDi.s === sid; });
    if (gia) return spostaAzione(gia.id, k) || gia;
    var az = aggiungiAzione(st.testo, b.areaId, { data: k, mit: serveMit(k), passoDi: { b: bid, s: sid }, interna: true });
    registra('backlog', 'Passo «' + st.testo + '» di «' + b.testo + '» messo il ' + fmtShort(k), true);
    save();
    return az;
  }

  function backlogPerArea() {
    var s = load();
    var perArea: Record<string, Attivita[]> = {};
    s.backlog.forEach(function (b) { (perArea[b.areaId] = perArea[b.areaId] || []).push(b); });
    var out = s.aree.filter(function (a) { return s.areeAttive.indexOf(a.id) >= 0; }).map(function (a) {
      return { area: a, items: perArea[a.id] || [] };
    });
    /* elementi in aree non più attive: raccolti sotto "Altro" per non perderli */
    var idsAttive = out.map(function (o) { return o.area.id; });
    var orfani = s.backlog.filter(function (b) { return idsAttive.indexOf(b.areaId) < 0; });
    if (orfani.length) {
      var altro = out.find(function (o) { return o.area.id === 'altro'; });
      if (altro) altro.items = altro.items.concat(orfani);
    }
    return out;
  }

  /* ---------- importanza delle cose da fare ----------
     Una lista dove tutto pesa uguale non è una lista: è un muro. E con
     poca coscienziosità + ADHD il muro non si scala, si evita — la
     letteratura sul delay discounting (Sonuga-Barke 2003; Barkley 1997)
     dice che il valore soggettivo di un compito crolla con la distanza
     temporale, quindi ciò che è vicino DEVE sembrare vicino.

     L'importanza non la inventiamo: la ricaviamo dai segnali che
     l'utente ha già dato — una scadenza, un giorno scelto in agenda, un
     progetto già iniziato (effetto Zeigarnik: le cose aperte premono),
     o una spilla messa a mano. Chi non ha dato nessun segnale finisce
     in mezzo, e chi è fermo da settimane scende, senza sparire. */

  var FERMA_GIORNI = 21;   // oltre questo, senza segnali, è roba parcheggiata

  function appuntaBacklog(id: string, valore?: boolean) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === id; });
    if (!b) return;
    var v = valore === undefined ? !b.pin : !!valore;
    if (v) b.pin = true; else delete b.pin;
    registra('backlog', (v ? 'Appuntata come importante' : 'Non più appuntata') + ': «' + b.testo + '»', false);
    save();
  }

  /* Ritorna { peso, fascia, motivo, da }:
       fascia 'ora'      → chiede attenzione adesso (in cima, poche)
       fascia 'poi'      → il corpo della lista
       fascia 'parcheggio' → ferma da un po', nessun segnale
     `motivo` è la ragione in chiaro, da mostrare: un ordine che non si
     spiega sembra arbitrario e si smette di fidarsi. `da` dice da quale
     segnale viene, così l'interfaccia non ripete un'informazione che sta
     già mostrando da un'altra parte. */
  function importanzaBacklog(b: Attivita, oggi: Giorno) {
    var k = oggi || todayKey();
    var peso = 0, motivo = '', fascia = 'poi', da = '';

    if (b.scadenza) {
      var g = daysBetween(k, b.scadenza);
      da = 'scadenza';
      if (g < 0) { peso += 1000 - g; motivo = 'era per ' + fmtShort(b.scadenza); fascia = 'ora'; }
      else if (g === 0) { peso += 900; motivo = 'scade oggi'; fascia = 'ora'; }
      else if (g <= 3) { peso += 800 - g * 10; motivo = 'scade tra ' + g + (g === 1 ? ' giorno' : ' giorni'); fascia = 'ora'; }
      else if (g <= 14) { peso += 400 - g; motivo = 'entro ' + fmtShort(b.scadenza); }
      else { peso += 120; da = ''; }
    }

    /* già messa in un giorno: la decisione è presa, va rispettata */
    var inAg = azioniDiBacklog(b, k);
    if (inAg.length) {
      var gg = daysBetween(k, presa(inAg[0]).data);
      if (gg <= 0) { peso += 700; if (!motivo) { motivo = 'in agenda oggi'; da = 'agenda'; } fascia = 'ora'; }
      else if (gg === 1) { peso += 500; if (!motivo) { motivo = 'in agenda domani'; da = 'agenda'; } if (fascia !== 'ora') fascia = 'ora'; }
      else { peso += 300 - gg; if (!motivo) { motivo = 'in agenda tra ' + gg + ' giorni'; da = 'agenda'; } }
    }

    if (b.pin) { peso += 650; if (!motivo) { motivo = 'appuntata'; da = 'pin'; } fascia = 'ora'; }

    /* progetto già cominciato: lasciarlo a metà costa più che finirlo */
    if (b.steps && b.steps.length) {
      var av = avanzamentoProgetto(b);
      if (av.fatti && av.fatti < av.tot) {
        peso += 260 + Math.round(av.pct / 2);
        if (!motivo) { motivo = 'iniziata, ' + av.fatti + ' di ' + av.tot; da = 'progetto'; }
      } else if (!av.fatti) peso += 60;
    }

    var eta = Math.floor((Date.now() - (b.creata || Date.now())) / 86400000);
    if (fascia === 'poi' && !b.scadenza && !inAg.length && !b.pin && eta >= FERMA_GIORNI) {
      fascia = 'parcheggio';
      motivo = 'inattiva da ' + (eta >= 60 ? 'oltre due mesi' : eta + ' giorni');
      da = 'ferma';
    }
    /* a pari merito viene prima la più recente: quella vecchia è già
       stata guardata e scartata mille volte */
    peso += Math.max(0, 40 - eta) / 10;
    return { peso: peso, fascia: fascia, motivo: motivo, da: da, eta: eta, inAgenda: inAg };
  }

  /* azioni future non fatte che vengono da questa cosa da fare */
  function azioniDiBacklog(b: Attivita, oggi: Giorno) {
    var s = load();
    var k = oggi || todayKey();
    var isProg = !!(b.steps && b.steps.length);
    return s.azioni.filter(function (a) {
      if (a.done || a.data < k) return false;
      return isProg ? !!(a.passoDi && a.passoDi.b === b.id) : (!a.passoDi && a.testo === b.testo);
    }).sort(function (x, y) { return x.data < y.data ? -1 : 1; });
  }

  /* La lista ordinata per importanza, divisa nelle tre fasce. `tetto`
     limita quante ne stanno in cima: tenerne più di 3-4 a mente non si
     può (Cowan 2001), e una fascia "urgente" lunga non è più urgente. */
  function backlogPerImportanza(opts?: { areaId?: string; tetto?: number }) {
    var s = load();
    var k = todayKey();
    var tetto = (opts && opts.tetto) || 3;
    var filtro = opts && opts.areaId && opts.areaId !== 'tutte' ? opts.areaId : null;
    var lista = s.backlog
      .filter(function (b) { return !filtro || b.areaId === filtro; })
      .map(function (b) { return { b: b, i: importanzaBacklog(b, k) }; })
      .sort(function (x, y) { return y.i.peso - x.i.peso; });

    var ora = lista.filter(function (x) { return x.i.fascia === 'ora'; });
    var parcheggio = lista.filter(function (x) { return x.i.fascia === 'parcheggio'; });
    var poi = lista.filter(function (x) { return x.i.fascia === 'poi'; });
    /* se in cima ce n'è troppa, la coda scende tra le prossime: resta
       visibile e in ordine, ma smette di gridare */
    if (ora.length > tetto) { poi = ora.slice(tetto).concat(poi); ora = ora.slice(0, tetto); }
    /* E se i segnali non bastano a riempirla, si promuovono le più in alto
       fino a tre. Una fascia con UNA voce sola non è una gerarchia, è un
       ordine: togliere la scelta non aiuta, ridurla a due o tre sì. */
    while (ora.length < tetto && poi.length) { var q = poi.shift(); if (q) ora.push(q); }
    return { ora: ora, poi: poi, parcheggio: parcheggio, totale: lista.length };
  }

  /* scadenza opzionale su un'attività da fare */
  function impostaScadenzaBacklog(id: string, scadenza: Giorno | null) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === id; });
    if (!b) return;
    if (scadenza) b.scadenza = scadenza; else delete b.scadenza;
    registra('backlog', scadenza ? 'Scadenza a «' + b.testo + '» → ' + fmtShort(scadenza) : 'Tolta la scadenza a «' + b.testo + '»', false);
    save();
  }

  /* ---------- abitudini ricorrenti ---------- */

  function aggiungiAbitudine(testo: string, areaId: string | null, giorni: GiornoSettimana[], opts?: { ora?: Ora | null; durata?: number | null; da?: Giorno; a?: Giorno | null }) {
    var s = load();
    var h = { id: uid(), testo: testo, areaId: areaId || 'salute', giorni: Array.isArray(giorni) ? giorni : [],
      ora: (opts && opts.ora) || null, durata: (opts && opts.durata) || null, creata: Date.now(), fatti: {},
      da: (opts && opts.da) || todayKey(),   // da oggi in avanti, mai a ritroso
      a: (opts && opts.a) || null, salti: {} };
    s.abitudini.push(h);
    registra('abitudine', 'Nuova abitudine: «' + testo + '»', false);
    save();
    return h;
  }
  function modificaAbitudine(id: string, dati: Partial<Abitudine>) {
    var s = load();
    var h = s.abitudini.find(function (x) { return x.id === id; });
    if (!h) return;
    if (dati.testo != null) h.testo = dati.testo;
    if (dati.areaId) h.areaId = dati.areaId;
    if (dati.giorni) h.giorni = dati.giorni;
    if ('ora' in dati) h.ora = dati.ora || null;
    if ('durata' in dati) h.durata = dati.durata || null;
    if ('da' in dati) h.da = dati.da || null;
    if ('a' in dati) h.a = dati.a || null;
    registra('abitudine', 'Modificata l’abitudine «' + h.testo + '»', false);
    save();
  }
  function rimuoviAbitudine(id: string) {
    var s = load();
    var i = s.abitudini.findIndex(function (x) { return x.id === id; });
    if (i >= 0) { registra('abitudine', 'Eliminata l’abitudine «' + presa(s.abitudini[i]).testo + '»', true); s.abitudini.splice(i, 1); save(); }
  }
  /* prevista in un dato giorno? giorni vuoto = ogni giorno */
  /* Un'abitudine vale da quando la crei in avanti, non a ritroso: prima
     comparivamo anche su tutti i giorni passati, come se l'avessi sempre
     avuta (e questo falsava le serie e il diario).
       h.da    = primo giorno valido (di default il giorno in cui la crei)
       h.a     = ultimo giorno valido (vuoto = senza scadenza)
       h.salti = giorni saltati uno a uno ({'2026-07-25': true}) */
  function abitudinePrevista(h: Abitudine, k: Giorno) {
    k = k || todayKey();
    if (h.da && k < h.da) return false;             // non retroattiva
    if (h.a && k > h.a) return false;               // periodo finito
    if (h.salti && h.salti[k]) return false;        // saltata solo quel giorno
    if (!h.giorni || !h.giorni.length) return true;
    return h.giorni.indexOf(parseKey(k).getDay() as GiornoSettimana) >= 0;
  }
  /* periodo di validità: da/a (null = da sempre / per sempre) */
  function impostaPeriodoAbitudine(id: string, da: Giorno | null, a: Giorno | null) {
    var s = load();
    var h = s.abitudini.find(function (x) { return x.id === id; });
    if (!h) return;
    h.da = da || null;
    h.a = a || null;
    registra('abitudine', 'Periodo di «' + h.testo + '»: ' + (da ? 'dal ' + fmtShort(da) : 'da sempre') + (a ? ' al ' + fmtShort(a) : ' senza fine'), false);
    save();
  }
  /* toglie (o rimette) l'abitudine in UN solo giorno, senza toccare le altre
     né l'abitudine stessa */
  /* l'orario di un'abitudine in un giorno: quello spostato per quel giorno,
     se c'è, se no il suo di sempre */
  function oraAbitudine(h: Abitudine, k: Giorno): Ora | null {
    const o = h.oreGiorno && h.oreGiorno[k];
    if (o === '-') return null;
    return o || h.ora;
  }
  /* `o` null torna all'ora di sempre; '-' toglie l'ora solo per quel giorno */
  function spostaAbitudineIlGiorno(id: string, k: Giorno, o: Ora | '-' | null) {
    const h = load().abitudini.find(function (x) { return x.id === id; });
    if (!h) return false;
    h.oreGiorno = h.oreGiorno || {};
    if (o === '-' && !h.ora) delete h.oreGiorno[k];
    else if (o) h.oreGiorno[k] = o; else delete h.oreGiorno[k];
    (h as { aggiornata?: number }).aggiornata = Date.now();
    save();
    return true;
  }
  function saltaGiornoAbitudine(id: string, k?: Giorno) {
    var s = load();
    var h = s.abitudini.find(function (x) { return x.id === id; });
    if (!h) return false;
    if (!h.salti) h.salti = {};
    k = k || todayKey();
    var saltata;
    if (h.salti[k]) { delete h.salti[k]; saltata = false; }
    else { h.salti[k] = true; saltata = true; if (h.fatti && h.fatti[k]) delete h.fatti[k]; }
    registra('abitudine', (saltata ? 'Saltata «' : 'Rimessa «') + h.testo + '» il ' + fmtShort(k), false);
    save();
    return saltata;
  }
  function abitudiniDiOggi() {
    var k = todayKey();
    return load().abitudini.filter(function (h) { return abitudinePrevista(h, k); });
  }
  /* completa/annulla l'abitudine per oggi (toggle) */
  function completaAbitudine(id: string, giorno?: Giorno) {
    var s = load();
    var h = s.abitudini.find(function (x) { return x.id === id; });
    if (!h) return 0;
    /* si può spuntare anche un giorno passato (te ne sei ricordato dopo):
       XP e registro finiscono su QUEL giorno. */
    var k = giorno || todayKey();
    if (h.fatti[k]) {
      delete h.fatti[k];
      togliXp(XP_EVENTI.abitudine, k);
      /* la chiave dice anche come deve finire (1 = fatta): completaAbitudine
         è un interruttore, e senza lo stato d'arrivo annullare due volte la
         stessa riga la spunterebbe e la rispunterebbe */
      registra('abitudine', 'Tolta la spunta a «' + h.testo + '»' + (k === todayKey() ? '' : ' del ' + fmtShort(k)) + ' (−' + XP_EVENTI.abitudine + ' XP)', false,
        { t: 'abitudine', k: id + '|' + k + '|1' });
      save();
      return -XP_EVENTI.abitudine;
    }
    h.fatti[k] = true;
    var punti = premiaXp('abitudine', k);
    registra('abitudine', 'Fatta l’abitudine «' + h.testo + '»' + (k === todayKey() ? '' : ' (del ' + fmtShort(k) + ')'), true,
      { t: 'abitudine', k: id + '|' + k + '|0' });
    save();
    return punti;
  }
  /* serie di giorni previsti consecutivi completati, con grazia per oggi
     (oggi non ancora fatto non rompe la serie) */
  function streakAbitudine(h: Abitudine) {
    var oggi = todayKey(), k = oggi, count = 0;
    for (var i = 0; i < 400; i++) {
      if (h.da && k < h.da) break;   // prima dell'inizio non c'era: la serie finisce lì
      if (abitudinePrevista(h, k)) {
        if (h.fatti[k]) count++;
        else if (k !== oggi) break;
      }
      k = addDays(k, -1);
    }
    return count;
  }

  /* La serie più lunga mai fatta. Serve dopo un giorno saltato: la serie
     corrente riparte da zero, e senza un record da riprendere il numero
     appena perso sembra sparito per sempre — che è il momento in cui si
     molla. */
  function recordAbitudine(h: Abitudine) {
    var giorni = Object.keys(h.fatti || {});
    if (!giorni.length) return 0;
    giorni.sort();
    var k: Giorno = giorno(presa(giorni[0])), fine = todayKey(), record = 0, corrente = 0;
    for (var i = 0; i < 1500 && k <= fine; i++) {
      if (abitudinePrevista(h, k) || (h.fatti && h.fatti[k])) {
        if (h.fatti && h.fatti[k]) { corrente++; if (corrente > record) record = corrente; }
        else corrente = 0;
      }
      k = addDays(k, 1);
    }
    return record;
  }

  /* Il prossimo giorno in cui tocca, entro un anno: «torna martedì» dice
     più di «L M V», che va riletto e tradotto ogni volta. */
  function prossimaAbitudine(h: Abitudine) {
    var k = todayKey();
    for (var i = 1; i <= 366; i++) {
      k = addDays(k, 1);
      if (h.a && k > h.a) return null;
      if (abitudinePrevista(h, k)) return k;
    }
    return null;
  }

  /* ---------- gestione aree (personalizzabili) ---------- */

  function rinominaArea(id: string, nome: string) {
    var s = load();
    var a = s.aree.find(function (x) { return x.id === id; });
    if (a && nome.trim()) { registra('area', 'Area rinominata «' + a.nome + '» → «' + nome.trim() + '»', false); a.nome = nome.trim(); save(); }
  }
  function toggleArea(id: string, attiva: boolean) {
    var s = load();
    var i = s.areeAttive.indexOf(id);
    if (attiva && i < 0) s.areeAttive.push(id);
    if (!attiva && i >= 0) s.areeAttive.splice(i, 1);
    if (!s.areeAttive.length) s.areeAttive.push(id); // almeno una attiva
    var a = s.aree.find(function (x) { return x.id === id; });
    registra('area', (attiva ? 'Attivata' : 'Disattivata') + ' l’area «' + (a ? a.nome : id) + '»', false);
    save();
  }
  function aggiungiArea(nome: string, icona: string, slot?: Slot) {
    var s = load();
    var id = 'a' + uid();
    var usati = s.aree.map(function (a) { return a.slot; });
    var scelto: Slot = slot || 1;
    if (!slot) {
      for (var n = 1 as Slot; n <= 8; n = (n + 1) as Slot) {
        if (usati.indexOf(n) < 0) { scelto = n; break; }
        scelto = (((s.aree.length) % 8) + 1) as Slot;
      }
    }
    s.aree.push({ id: id, nome: nome.trim() || 'Nuova area', icona: icona || 'lightbulb', slot: scelto, sistema: '' });
    s.areeAttive.push(id);
    registra('area', 'Nuova area: «' + (nome.trim() || 'Nuova area') + '»', true);
    save();
    return id;
  }
  function rimuoviArea(id: string) {
    var s = load();
    if (s.aree.length <= 1) return;
    var rimossa = s.aree.find(function (a) { return a.id === id; });
    registra('area', 'Eliminata l’area «' + (rimossa ? rimossa.nome : id) + '» (le sue cose passano ad Altro)', true);
    s.aree = s.aree.filter(function (a) { return a.id !== id; });
    var i = s.areeAttive.indexOf(id); if (i >= 0) s.areeAttive.splice(i, 1);
    /* le azioni/backlog di quell'area passano a "altro" se esiste, così
       nessun elemento resta orfano e invisibile */
    var fallback = s.aree.find(function (a) { return a.id === 'altro'; });
    var fid = fallback ? fallback.id : presa(s.aree[0]).id;
    s.azioni.forEach(function (a) { if (a.areaId === id) a.areaId = fid; });
    s.backlog.forEach(function (b) { if (b.areaId === id) b.areaId = fid; });
    save();
  }

  /* baseline personale di un check-in: la media recente, usata come
     punto di riferimento ("il tuo solito") per rendere la scala meno
     ambigua — chi si sente "sempre nella media" ha così un riferimento. */
  function baselineCheckin(campo: 'energia' | 'focus' | 'umore', giorni: number) {
    var s = load();
    var vals: number[] = [];
    var limite = giorni ? Date.now() - giorni * 86400000 : 0;
    s.checkins.forEach(function (c) { if (c[campo] != null && (!giorni || c.ts >= limite)) vals.push(c[campo]); });
    if (!vals.length) return null;
    return Math.round(vals.reduce(function (a, b) { return a + b; }, 0) / vals.length * 10) / 10;
  }

  function triageInbox(id: string, esito: 'azione' | 'backlog' | 'scarta', areaId: string) {
    /* esito: 'azione' (fai oggi) | 'backlog' (da fare, senza data) | 'scarta' */
    var s = load();
    var i = s.inbox.findIndex(function (x) { return x.id === id; });
    if (i < 0) return;
    var nota = presa(s.inbox[i]);
    if (esito === 'azione') {
      s.inbox.splice(i, 1);
      aggiungiAzione(nota.testo, areaId, { interna: true });
      registra('inbox', 'Smistata in Oggi: «' + nota.testo + '»', true);
      premiaXp('triage');
    } else if (esito === 'backlog') {
      s.inbox.splice(i, 1);
      aggiungiBacklog(nota.testo, areaId, true);
      registra('inbox', 'Smistata tra le cose da fare: «' + nota.testo + '»', true);
      premiaXp('triage');
    } else if (esito === 'scarta') {
      s.inbox.splice(i, 1);
      registra('inbox', 'Scartata la nota: «' + nota.testo + '»', true);
      premiaXp('triage');
    }
    save();
  }

  function registraCheckin(energia: number, focus: number, umore: number, contesto?: string) {
    var s = load();
    s.checkins.push({ data: todayKey(), ts: Date.now(), energia: energia, focus: focus, umore: umore, contesto: contesto || '' });
    var punti = premiaXp('checkin');
    save();
    return punti;
  }

  function salvaPianoMattina(intenzione: string) {
    var s = load();
    var k = todayKey();
    var nuovo = !s.pianoMattina[k];
    s.pianoMattina[k] = { compilato: true, intenzione: intenzione || '', ts: Date.now() };
    var punti = nuovo ? premiaXp('pianoMattina') : 0;
    save();
    return punti;
  }

  function valutaArea(areaId: string, voto: number, quando?: Giorno) {
    var s = load();
    var k = quando || todayKey();
    var delGiorno = s.valutazioni[k] || (s.valutazioni[k] = {});
    delGiorno[areaId] = voto;
    save();
  }

  /* ---------- IL TIMER, che sta nei dati ----------
     Tutto quello che serve per sapere a che punto è sta qui dentro, e sono
     istanti assoluti: qualunque dispositivo, in qualunque momento, ricava lo
     stesso numero senza aver visto partire niente. Il conto alla rovescia non
     si salva mai, perché un numero di minuti salvato invecchia. */
  /* Il timer «senza fine» ha `fine` a zero: è il modo di dire che un traguardo
     non c'è. Qui `!t.fine` lo scambiava per un timer rotto e lo buttava via,
     quindi partiva, si salvava, e l'app non lo vedeva mai — premevi e non
     succedeva niente. Da qui in giù «vivo» e «ha una fine» sono due domande
     diverse. */
  var SENZA_FINE_MAX = 12 * 3600000;
  function timerVivo() {
    var t = load().timer;
    if (!t || !t.inizio) return null;
    if (!t.fine) {
      /* Anche uno che conta in avanti a un certo punto è di ieri. Dodici ore
         perché non è una sessione: è un telefono chiuso mentre girava. Sotto
         non si taglia niente — una mattina intera di studio è una cosa vera e
         non va cancellata a metà. */
      return Date.now() - t.inizio > SENZA_FINE_MAX ? null : t;
    }
    /* un timer finito da più di sei ore è roba di ieri che nessuno ha chiuso:
       non deve riapparire addosso a chi apre l'app la mattina dopo */
    if (t.fermoDa) return Date.now() - t.fermoDa > SENZA_FINE_MAX ? null : t;
    if (!t.inPausa && Date.now() - t.fine > 6 * 3600000) return null;
    return t;
  }
  function avviaTimerDati(patch: Timer) {
    var s = load();
    s.timer = patch;
    save();
    return s.timer;
  }
  function fermaTimerDati() {
    var s = load();
    s.timer = null;
    save();
  }
  function aggiornaTimerDati(patch: Partial<Timer>) {
    var s = load();
    if (!s.timer) return null;
    var mio = s.timer as unknown as Record<string, unknown>;
    var toppa = patch as unknown as Record<string, unknown>;
    for (var k in toppa) if (Object.prototype.hasOwnProperty.call(toppa, k)) mio[k] = toppa[k];
    save();
    return s.timer;
  }

  /* ---------- TUTTE LE REVIEW, in una fila sola ----------
     Le tre specie messe insieme e ordinate dalla più recente: una review
     serve confrontata con le altre, e finché ognuna sta chiusa nel suo
     giorno quel confronto non lo fa nessuno.
     Qui si scarta il vuoto: una review compilata senza scrivere niente non è
     una riga da rileggere, è un giorno in cui si è premuto «salva». */
  /* la forma di una riga di questa fila: la legge la scheda «Le review di
     prima», e averla scritta qui vuol dire che il pannello non può leggere un
     campo che non esiste */
  interface RigaReview {
    tipo: 'mattina' | 'sera' | 'settimana';
    ico: string;
    k: string;
    quando: string;
    campi: { eti: string; val: string }[];
  }

  function tutteLeReview(): RigaReview[] {
    var s = load();
    var out: RigaReview[] = [];
    function pulisci(campi: { eti: string; val: unknown }[]) {
      return campi.filter(function (c) { return c.val && String(c.val).trim(); })
        .map(function (c) { return { eti: c.eti, val: String(c.val).trim() }; });
    }
    /* LA DATA COME LA SI LEGGE, non come la si archivia. Qui c'era
       `'Mattina · ' + k`, e `k` è la chiave del giorno: «Mattina ·
       2026-08-17». È il formato giusto per ordinare e quello sbagliato per
       una persona — l'archivio delle review era l'unico posto dell'app dove
       una data usciva così. */
    function quando(k: string) { return weekdayShort(giorno(k)) + ' ' + fmtShort(giorno(k)); }
    Object.keys(s.pianoMattina || {}).forEach(function (k) {
      var v = s.pianoMattina[k];
      if (!v) return;
      var campi = pulisci([{ eti: 'Intenzione', val: v.intenzione }]);
      if (campi.length) out.push({ tipo: 'mattina', ico: 'sun', k: k, quando: 'Mattina · ' + quando(k), campi: campi });
    });
    Object.keys(s.reviewSera || {}).forEach(function (k) {
      var v = s.reviewSera[k];
      if (!v) return;
      /* `shutdown` NON È UNA COSA SCRITTA: è il segno che la giornata è
         stata chiusa, un sì/no, e la review della sera lo salva sempre a
         `true`. Messo qui in mezzo ai campi finiva in pagina come «Domani
         true», su ogni sera dell'archivio. */
      var campi = pulisci([
        { eti: 'È andata bene', val: v.vittoria },
        { eti: 'Mi ha bloccato', val: v.blocco }
      ]);
      if (campi.length) out.push({ tipo: 'sera', ico: 'moon', k: k, quando: 'Sera · ' + quando(k), campi: campi });
    });
    Object.keys(s.reviewSettimana || {}).forEach(function (k) {
      var v = s.reviewSettimana[k];
      if (!v) return;
      var campi = pulisci([
        { eti: 'Vittorie', val: v.vittorie },
        { eti: 'Blocchi', val: v.blocchi },
        { eti: 'Ho imparato', val: v.imparato },
        { eti: 'La prossima', val: v.prossima }
      ]);
      if (campi.length) out.push({ tipo: 'settimana', ico: 'calendar', k: k, quando: 'Settimana del ' + fmtShort(giorno(k)), campi: campi });
    });
    out.sort(function (a, b) { return a.k < b.k ? 1 : (a.k > b.k ? -1 : 0); });
    return out;
  }
  function quanteReview() { return tutteLeReview().length; }

  /* ---------- COME STA ANDANDO: numeri concreti, non punti ----------
     I punti e i livelli non dicono niente di vero: sono una scala inventata
     che sale comunque, e sale anche nei periodi in cui le cose non vanno.
     Quello che funziona sono tre numeri di specie diversa:

       · QUANTE ne hai fatte — un conto di cose vere, che sale e basta. È il
         numero che risponde a «ho combinato qualcosa in questi mesi?», e a
         quella domanda un livello non risponde.
       · QUANTO TE NE RIESCE — di quelle che ti eri messo in un giorno,
         quante ne hai fatte. È una percentuale onesta, quindi può anche
         scendere: è l'unico dei tre che può dirti che stai peggiorando, ed è
         per questo che serve.
       · DOVE non ti riesce — la stessa percentuale spezzata per area, dalla
         peggiore. È quella che dice cosa fare: non «impegnati di più», ma
         «in Salute metti sei cose a settimana e ne fai una».

     Il giorno di OGGI resta fuori dal conto della riuscita. Una giornata
     appena cominciata è a zero per costruzione, e aprire l'app la mattina per
     leggere che stai allo 0% è il modo migliore per non riaprirla. */
  function chiuso(k: Giorno) { return k < todayKey(); }

  /* `salta` sposta la finestra indietro: serve per confrontare gli ultimi
     trenta giorni con i trenta di prima. Una percentuale da sola non si legge
     — «66%» non dice se va bene — e l'unica cosa che la rende leggibile è
     sapere da dove viene. */
  function bilancio(giorni: number, salta?: number) {
    var s = load();
    var indietro = salta || 0;
    var a2 = addDays(todayKey(), -indietro);
    var da = giorni ? addDays(a2, -giorni) : giorno('0000-00-00');
    var fino = a2;
    var perArea: Record<string, { areaId: string; messe: number; fatte: number; mancate: number; tasso: number }> = {};
    var messe = 0, fatte = 0, mancate = 0;
    function segna(areaId: string, fatta: number, persa: number) {
      var a = perArea[areaId] || (perArea[areaId] = { areaId: areaId, messe: 0, fatte: 0, mancate: 0, tasso: 0 });
      a.messe++; messe++;
      if (fatta) { a.fatte++; fatte++; }
      if (persa) { a.mancate++; mancate++; }
    }
    s.azioni.forEach(function (a) {
      if (!a.data || a.data < da || a.data >= fino || !chiuso(a.data)) return;
      segna(a.areaId || 'altro', a.done ? 1 : 0, a.mancata ? 1 : 0);
    });
    /* le abitudini contano come le altre: un giorno in cui l'abitudine era
       prevista è una cosa che ti eri messo */
    s.abitudini.forEach(function (h) {
      for (var g = 0; g < (giorni || 90); g++) {
        var q = addDays(fino, -(g + 1));
        if (q < da) break;
        if (!abitudinePrevista(h, q)) continue;
        segna(h.areaId || 'altro', h.fatti[q] ? 1 : 0, 0);
      }
    });
    var righe = Object.keys(perArea).map(function (id) {
      var a = presa(perArea[id]);
      a.tasso = a.messe ? a.fatte / a.messe : 0;
      return a;
    }).sort(function (x, y) { return x.tasso - y.tasso; });
    return {
      messe: messe, fatte: fatte, mancate: mancate,
      tasso: messe ? fatte / messe : 0,
      aree: righe
    };
  }

  /* LA RIUSCITA SETTIMANA PER SETTIMANA.
     Una percentuale sola dice come stai; la sua forma nel tempo dice se la
     cosa si muove — che è l'unica domanda a cui un numero da solo non può
     rispondere. Le settimane senza niente in programma non fanno un punto a
     zero: uno zero vuol dire «ci hai provato e non è andata», e una settimana
     in cui non ti eri messo niente non è quello. */
  function serieRiuscita(settimane: number) {
    var s = load();
    var n = settimane || 12;
    var secchi: { da: Giorno; a: Giorno; messe: number; fatte: number; pct: number | null }[] = [];
    for (var w = n - 1; w >= 0; w--) {
      var fine = addDays(todayKey(), -(w * 7));
      var inizio = addDays(fine, -7);
      secchi.push({ da: inizio, a: fine, fatte: 0, messe: 0, pct: null });
    }
    function metti(k: Giorno, fatta: boolean) {
      for (var i = 0; i < secchi.length; i++) {
        var sec = secchi[i];
        if (sec && k >= sec.da && k < sec.a) { sec.messe++; if (fatta) sec.fatte++; return; }
      }
    }
    s.azioni.forEach(function (a) { if (a.data && chiuso(a.data)) metti(a.data, !!a.done); });
    s.abitudini.forEach(function (h) {
      for (var g = 1; g <= n * 7; g++) {
        var q = addDays(todayKey(), -g);
        if (!abitudinePrevista(h, q)) continue;
        metti(q, !!h.fatti[q]);
      }
    });
    return secchi.filter(function (b) { return b.messe > 0; })
      .map(function (b) { return { data: b.da, valore: Math.round(100 * b.fatte / b.messe) }; });
  }

  /* il numero che sale e basta: quante cose hai portato a termine, in tutto.
     Le abitudini spuntate contano: sono cose fatte quanto le altre.
     `giorni` a zero — o non passato — vuol dire DA SEMPRE: è il conto che
     sta in fondo al riassunto («da quando hai cominciato»). */
  function quanteFatte(giorni: number = 0) {
    var s = load();
    var da = giorni ? addDays(todayKey(), -giorni) : '';
    var n = 0;
    s.azioni.forEach(function (a) { if (a.done && (!da || a.data >= da)) n++; });
    s.abitudini.forEach(function (h) {
      Object.keys(h.fatti || {}).forEach(function (k) { if (h.fatti[k] && (!da || k >= da)) n++; });
    });
    return n;
  }

  /* i motivi delle cose non riuscite, dal piu' frequente: e' la riga che
     dice su cosa lavorare, e non si puo' sapere senza averli registrati */
  function motiviMancate(giorni: number) {
    var conta: Record<string, number> = {};
    mancate(giorni).forEach(function (a) {
      var q = (a.mancata && a.mancata.perche) || 'altro';
      conta[q] = (conta[q] || 0) + 1;
    });
    return Object.keys(conta).map(function (k) {
      var d = PERCHE_MANCATA.find(function (x) { return x.id === k; });
      return { id: k, eti: d ? d.eti : k, n: conta[k] || 0 };
    }).sort(function (a, b) { return b.n - a.n; });
  }

  /* I MINUTI DI UN GIORNO: quelli di prima (scritti nella mappa) più le
     sessioni del timer, che sono righe e si sommano qui */
  function minutiDi(k: Giorno): Record<string, number> {
    var s = load();
    var out: Record<string, number> = {};
    var vecchi = s.minuti[k] || {};
    Object.keys(vecchi).forEach(function (a) { out[a] = (out[a] || 0) + (vecchi[a] || 0); });
    (s.sessioni || []).forEach(function (x) {
      if (x.giorno !== k || !x.areaId) return;
      out[x.areaId] = (out[x.areaId] || 0) + (x.minuti || 0);
    });
    return out;
  }
  /* registra un pezzo di tempo del timer. Torna false se c'era già: due
     dispositivi che chiudono lo stesso blocco scrivono una riga sola */
  function registraSessione(d: { id: string; areaId: string | null; azioneId: string | null; testo: string; tipo: Sessione['tipo']; inizio: number; minuti: number }): boolean {
    var s = load();
    if (!s.sessioni) s.sessioni = [];
    if (d.minuti < 1) return false;
    if (s.sessioni.some(function (x) { return x.id === d.id; })) return false;
    var ora = Date.now();
    s.sessioni.push({ id: d.id, giorno: dayKey(new Date(d.inizio)), areaId: d.areaId, azioneId: d.azioneId,
      testo: d.testo, tipo: d.tipo, inizio: d.inizio, minuti: Math.round(d.minuti), creata: ora, aggiornata: ora });
    var ar = d.areaId ? s.aree.find(function (x) { return x.id === d.areaId; }) : null;
    registra('focus', 'Timer: ' + Math.round(d.minuti) + ' min' + (ar ? ' su ' + ar.nome : ''), true);
    save();
    return true;
  }
  /* correggere dopo: i minuti giusti, o l'area giusta */
  function modificaSessione(id: string, patch: { minuti?: number; areaId?: string | null }) {
    var s = load();
    var x = (s.sessioni || []).find(function (q) { return q.id === id; });
    if (!x) return null;
    if (patch.minuti != null) x.minuti = Math.max(0, Math.round(patch.minuti));
    if (patch.areaId !== undefined) x.areaId = patch.areaId;
    x.aggiornata = Date.now();
    registra('focus', 'Corretta una sessione: ' + x.minuti + ' min', false);
    save();
    return x;
  }
  function togliSessione(id: string) {
    var s = load();
    var prima = (s.sessioni || []).length;
    s.sessioni = (s.sessioni || []).filter(function (q) { return q.id !== id; });
    if (s.sessioni.length !== prima) { registra('focus', 'Tolta una sessione', false); save(); }
  }
  function sessioniDi(k: Giorno): Sessione[] {
    return (load().sessioni || []).filter(function (x) { return x.giorno === k; })
      .sort(function (a, b) { return a.inizio - b.inizio; });
  }
  function registraMinuti(areaId: string, minuti: number, quando?: Giorno) {
    var s = load();
    var k = quando || todayKey();
    var delGiorno = s.minuti[k] || (s.minuti[k] = {});
    delGiorno[areaId] = (delGiorno[areaId] || 0) + minuti;
    var ar = s.aree.find(function (x) { return x.id === areaId; });
    registra('focus', 'Timer: ' + minuti + ' min su ' + (ar ? ar.nome : areaId), true);
    save();
  }

  function salvaReviewSera(dati: { vittoria: string; blocco: string; shutdown: boolean }) {
    var s = load();
    var k = todayKey();
    var nuovo = !s.reviewSera[k];
    s.reviewSera[k] = Object.assign({ ts: Date.now() }, dati);
    var punti = nuovo ? premiaXp('reviewSera') : 0;
    save();
    return punti;
  }

  function salvaReviewSettimana(dati: { vittorie: string; blocchi: string; imparato: string; prossima: string }) {
    var s = load();
    var k = weekKey(todayKey());
    var nuovo = !s.reviewSettimana[k];
    s.reviewSettimana[k] = Object.assign({ ts: Date.now() }, dati);
    var punti = nuovo ? premiaXp('reviewSettimana') : 0;
    save();
    return punti;
  }

  /* ---------- selettori ---------- */

  function azioniDiOggi() {
    var t = todayKey();
    return load().azioni.filter(function (a) { return a.data === t; });
  }

  /* "Cosa dovrei fare ADESSO", riconciliando le Azioni di oggi con il piano
     orario de La Giornata. Restituisce { azione, stato, min, fine }:
       - 'corso'      : una cosa con orario il cui blocco contiene adesso
       - 'ritardo'    : una cosa con orario il cui blocco è già passato, non fatta
       - 'libera'     : nessun blocco su adesso → la priorità (MIT) o la prima
                        cosa senza orario (lavoro flessibile nei vuoti del piano)
       - 'programmata': niente di flessibile, la prossima cosa in agenda
     Così "Oggi" mostra quello che La Giornata dice di fare in questo momento. */
  /* LE COSE FRA CUI SCEGLIERE «ADESSO». Sono di due specie e la domanda è una
     sola: cosa dovrei fare in questo momento. Le abitudini prima non entravano
     nel conto, e chi apriva la schermata alle sette non vedeva la corsa delle
     sette — l'unica cosa che aveva in programma. Ognuna porta con sé di che
     specie è, perché a schermo si vedono diverse e i comandi cambiano: una
     cosa di oggi si «rimanda», un'abitudine si «salta per oggi». */
  /* la forma di una voce di «Adesso»: la leggono la schermata e i suoi
     comandi, e scriverla qui vuol dire che una delle due non può leggere un
     campo che l'altra non mette */

  function voceAzione(a: Azione): VoceAdesso {
    return { tipo: 'azione', id: a.id, testo: a.testo, areaId: a.areaId, ora: a.ora,
      durata: a.durata, mit: !!a.mit, ifThen: a.ifThen || '', mancata: a.mancata || null };
  }
  function voceAbitudine(h: Abitudine): VoceAdesso {
    /* `giorni` e `record` viaggiano con la voce perché la scheda di «Adesso»
       ci disegna sopra la settimana dell'abitudine: quali giorni si ripete e
       a che punto è la serie. Senza, la scheda dovrebbe ripescare l'abitudine
       intera dallo stato per disegnare sette pallini. */
    return { tipo: 'abitudine', id: h.id, testo: h.testo, areaId: h.areaId, ora: oraAbitudine(h, todayKey()),
      durata: h.durata, mit: false, ifThen: '', serie: streakAbitudine(h),
      giorni: (h.giorni || []).slice(), record: recordAbitudine(h) };
  }
  function vociDiAdesso(k: Giorno) {
    var s = load();
    k = k || todayKey();
    /* una cosa segnata «non ci sono riuscito» è chiusa per oggi: resta nel
       registro e nella giornata, ma non torna a chiedere di essere fatta */
    var out = azioniDiOggi().filter(function (a) { return !a.done && !a.mancata; }).map(voceAzione);
    s.abitudini.forEach(function (h) {
      if (!abitudinePrevista(h, k) || h.fatti[k]) return;
      out.push(voceAbitudine(h));
    });
    return out;
  }

  /* COSA DICE IL PIANO ADESSO. Cinque uscite diverse, e tutte hanno la stessa
     forma: la cosa, in che stato è, e i due capi del suo blocco quando ce li
     ha. Era un'unione di cinque oggetti letterali, e chi la leggeva —
     `vistaFocus`, che ci costruisce sopra tutta la schermata «Adesso» — doveva
     ricavarsela dai cinque `return`. */
  function azioneAdesso(nowMin?: number): CosaAdesso {
    if (nowMin == null) { var dd = new Date(); nowMin = dd.getHours() * 60 + dd.getMinutes(); }
    var adesso: number = nowMin;
    void adesso;
    function mm(hhmm: string | null | undefined) { var p = String(hhmm).split(':'); return (+(p[0] || 0)) * 60 + (+(p[1] || 0)); }
    var k0 = todayKey();
    var oggi = vociDiAdesso(k0);
    /* i confini servono a sapere dove finisce un blocco senza durata: sono
       tutte le ore piantate nella giornata, anche quelle già fatte */
    var confini = azioniDiOggi().filter(function (a) { return a.ora; }).map(function (a) { return mm(a.ora); })
      .concat(load().abitudini.filter(function (h) { return oraAbitudine(h, k0) && abitudinePrevista(h, k0); }).map(function (h) { return mm(oraAbitudine(h, k0)); }))
      .sort(function (x, y) { return x - y; });
    var timed = oggi.filter(function (a) { return a.ora; }).map(function (a) { return { a: a, min: mm(a.ora) }; }).sort(function (x, y) { return x.min - y.min; });
    function fineSlot(min: number, durata: number | null) {
      if (durata) return min + durata;
      var next = confini.find(function (m) { return m > min; });
      return next != null ? next : min + 90;
    }
    /* 1. blocco che contiene adesso → è quello che il piano dice ora */
    var corso = timed.filter(function (t) { return t.min <= nowMin && nowMin < fineSlot(t.min, t.a.durata); });
    if (corso.length) { var c = presa(corso[0]); return { azione: c.a, stato: 'corso', min: c.min, fine: fineSlot(c.min, c.a.durata) }; }
    /* 2. blocco già passato e non fatto → riprendilo (in ordine) */
    var ritardo = timed.filter(function (t) { return nowMin >= fineSlot(t.min, t.a.durata); });
    if (ritardo.length) { var r = presa(ritardo[0]); return { azione: r.a, stato: 'ritardo', min: r.min, fine: fineSlot(r.min, r.a.durata) }; }
    /* 3. vuoto nel piano → lavoro flessibile: la priorità, poi le altre cose
          di oggi senza orario, e per ultime le abitudini senza orario — una
          cosa che hai scelto stamattina viene prima di una che fai sempre */
    var mit = oggi.find(function (a) { return a.mit && !a.ora; });
    if (mit) return { azione: mit, stato: 'libera', min: null, fine: null };
    var libera = oggi.find(function (a) { return !a.ora && a.tipo === 'azione'; });
    if (libera) return { azione: libera, stato: 'libera', min: null, fine: null };
    var abit = oggi.find(function (a) { return !a.ora; });
    if (abit) return { azione: abit, stato: 'libera', min: null, fine: null };
    /* 4. tutto in agenda più tardi → la prossima in programma */
    if (timed.length) { var u = presa(timed[0]); return { azione: u.a, stato: 'programmata', min: u.min, fine: fineSlot(u.min, u.a.durata) }; }
    return { azione: null, stato: null, min: null, fine: null };
  }

  function giornoAttivo(k: Giorno) {
    var s = load();
    if ((s.xpPerGiorno[k] || 0) > 0) return true;
    var voti = s.valutazioni[k];
    if (voti && Object.keys(voti).length) return true;
    if (s.checkins.some(function (c) { return c.data === k; })) return true;
    if (s.azioni.some(function (a) { return a.data === k && a.done; })) return true;
    return false;
  }

  /* Streak gentile: un giorno vuoto ISOLATO non azzera la serie.
     Due giorni vuoti consecutivi sì. Il conteggio parte da ieri se
     oggi non è ancora attivo (niente ansia al mattino). */
  function streak() {
    var k = todayKey();
    var count = 0, gapUsati = 0, gap = false;
    if (!giornoAttivo(k)) k = addDays(k, -1);
    for (var i = 0; i < 3660; i++) {
      if (giornoAttivo(k)) {
        count++;
        gap = false;
      } else {
        if (gap) break;          // secondo vuoto consecutivo → stop
        gap = true;
        gapUsati++;
      }
      k = addDays(k, -1);
    }
    return { corrente: count, ripari: gapUsati };
  }

  /* Serie per grafici */

  function serieValutazioni(areaId: string, giorni: number) {
    var s = load();
    return lastNDays(giorni).map(function (k) {
      var v = s.valutazioni[k] && s.valutazioni[k][areaId];
      return { data: k, valore: (v === undefined ? null : v) };
    });
  }

  function serieMinuti(areaId: string, giorni: number) {
    return lastNDays(giorni).map(function (k) {
      return { data: k, valore: minutiDi(k)[areaId] || 0 };
    });
  }

  function serieCheckin(campo: 'energia' | 'focus' | 'umore', giorni: number) {
    var s = load();
    var perGiorno: Record<string, number[]> = {};
    s.checkins.forEach(function (c) {
      var lista = perGiorno[c.data] || (perGiorno[c.data] = []);
      lista.push(c[campo]);
    });
    return lastNDays(giorni).map(function (k) {
      var arr = perGiorno[k];
      var media = arr ? arr.reduce(function (x, y) { return x + y; }, 0) / arr.length : null;
      return { data: k, valore: media === null ? null : Math.round(media * 10) / 10 };
    });
  }


  function heatmapConsistenza(settimane: number) {
    /* celle = XP del giorno, ultime N settimane concluse a oggi */
    var s = load();
    var giorni = settimane * 7;
    return lastNDays(giorni).map(function (k) {
      return { data: k, valore: s.xpPerGiorno[k] || 0 };
    });
  }

  function minutiSettimanaPerArea() {
    var s = load();
    var giorni = lastNDays(7);
    return s.aree.filter(function (a) { return s.areeAttive.indexOf(a.id) >= 0; }).map(function (a) {
      var tot = 0;
      giorni.forEach(function (k) { tot += minutiDi(k)[a.id] || 0; });
      return { area: a, minuti: tot };
    });
  }

  function mediaValutazioneArea(areaId: string, giorni: number) {
    var vals = serieValutazioni(areaId, giorni).filter(function (p) { return p.valore !== null; });
    if (!vals.length) return null;
    return vals.reduce(function (x, p) { return x + (p.valore || 0); }, 0) / vals.length;
  }

  /* ---------- diario / storico ---------- */
  /* Ricostruisce la cronologia degli eventi dai dati già registrati
     (azioni completate, check-in, piani, review, catture), raggruppati
     per giorno e ordinati dal più recente. Nessun log separato da tenere
     allineato: la storia è sempre coerente con lo stato reale. */

  function diario(giorniMax: number, tutto?: boolean) {
    var s = load();
    var perGiorno: Record<string, VoceDiario[]> = {};
    function agg(k: Giorno, ev: VoceDiario) { (perGiorno[k] = perGiorno[k] || []).push(ev); }

    /* `chiave` è come si ritrova il dato che sta dietro alla riga, per poterlo
       disfare da lì (vedi annullaRecord). Le righe di registro di norma non ne
       hanno — raccontano un cambiamento, non sono il cambiamento — tranne
       quelle che se la portano scritta dietro (`disfa`). */
    /* registro di tutto ciò che è stato fatto: di default solo le cose
       importanti; con `tutto` anche le minori (impostazioni, modifiche…). */
    (s.registro || []).forEach(function (rg) {
      if (!tutto && !rg.imp) return;
      var ev: VoceDiario = { ts: rg.ts, tipo: 'registro', cat: rg.cat, testo: rg.testo, imp: rg.imp };
      if (rg.disfa) { ev.chiave = rg.disfa.k; ev.tipoDisfa = rg.disfa.t; }
      agg(dayKey(new Date(rg.ts)), ev);
    });

    s.azioni.forEach(function (a) {
      if (!a.done) return;
      var k = a.doneAt ? dayKey(new Date(a.doneAt)) : a.data;
      agg(k, { ts: a.doneAt || parseKey(a.data).getTime() + 12 * 3600000, tipo: 'azione', id: a.id, chiave: a.id, testo: a.testo, areaId: a.areaId, mit: a.mit });
    });
    s.checkins.forEach(function (c) {
      agg(c.data, { ts: c.ts || parseKey(c.data).getTime(), tipo: 'checkin', chiave: String(c.ts || parseKey(c.data).getTime()), energia: c.energia, focus: c.focus, umore: c.umore });
    });
    Object.keys(s.pianoMattina).forEach(function (kk) {
      var k = giorno(kk), p = s.pianoMattina[kk];
      if (!p) return;
      agg(k, { ts: p.ts || parseKey(k).getTime() + 8 * 3600000, tipo: 'mattina', chiave: k, intenzione: p.intenzione });
    });
    Object.keys(s.reviewSera).forEach(function (kk) {
      var k = giorno(kk), r = s.reviewSera[kk];
      if (!r) return;
      agg(k, { ts: r.ts || parseKey(k).getTime() + 21 * 3600000, tipo: 'sera', chiave: k, vittoria: r.vittoria, blocco: r.blocco });
    });
    Object.keys(s.reviewSettimana).forEach(function (kk) {
      var k = giorno(kk), r = s.reviewSettimana[kk];
      if (!r) return;
      agg(k, { ts: r.ts || parseKey(k).getTime() + 20 * 3600000, tipo: 'settimana', chiave: k, vittorie: r.vittorie, blocchi: r.blocchi, imparato: r.imparato, prossima: r.prossima });
    });
    s.inbox.forEach(function (el) {
      agg(dayKey(new Date(el.creata)), { ts: el.creata, tipo: 'cattura', chiave: el.id, testo: el.testo });
    });

    var giorni = Object.keys(perGiorno).sort().reverse();
    if (giorniMax) giorni = giorni.slice(0, giorniMax);
    return giorni.map(function (k) {
      var eventi = perGiorno[k] || [];
      return { data: giorno(k), eventi: eventi.sort(function (a, b) { return b.ts - a.ts; }) };
    });
  }

  function giorniConAttivita() {
    var s = load();
    var set: Record<string, 1> = {};
    s.azioni.forEach(function (a) { if (a.done) set[a.doneAt ? dayKey(new Date(a.doneAt)) : a.data] = 1; });
    s.checkins.forEach(function (c) { set[c.data] = 1; });
    Object.keys(s.reviewSera).forEach(function (k) { set[k] = 1; });
    Object.keys(s.pianoMattina).forEach(function (k) { set[k] = 1; });
    return Object.keys(set).length;
  }

  /* ---------- il resoconto della giornata: notte, pasti, e quello che hai
       fatto senza scriverlo ----------

     Tre cose che l'app non può sapere da sola e che senza di lei si perdono:
     a che ora hai dormito, se hai mangiato, e le cose che hai fatto senza
     avere voglia di aprire l'app per scriverle. Si chiedono UNA volta al
     giorno, nel momento in cui la risposta esiste — la notte al mattino, i
     pasti e il resto la sera — e si può sempre dire «non adesso».

     LA PRECISIONE È UN DATO, non un dettaglio. «Mi sono svegliato alle 7:30»
     detto da chi ha guardato la sveglia e da chi tira a indovinare sono due
     numeri diversi con lo stesso aspetto: mescolarli avvelena qualunque media
     si calcoli dopo. E chi tiene alla precisione, se non può dire «più o
     meno», preferisce non rispondere: l'abbiamo già visto con le righe di
     «cosa funziona». Quindi ogni orario porta con sé come è stato dato. */

  var PRECISIONE = {
    preciso: { eti: 'preciso', breve: '' },
    circa: { eti: 'più o meno', breve: 'circa ' }
  };
  function precisioneValida(x: unknown): 'preciso' | 'circa' { return x === 'preciso' ? 'preciso' : 'circa'; }

  /* l'ultima volta che ti ho visto, e la segna adesso. Torna il valore di
     PRIMA: è quello che serve per capire se in mezzo c'è stata una notte. */
  function segnaVisto() {
    var s = load();
    var prima = s.visto || 0;
    /* Non si scrive a ogni ritorno sulla scheda: chi passa da un'app all'altra
       lo farebbe cento volte in un'ora, e ogni volta è un salvataggio e un
       giro di sincronizzazione. Sotto i cinque minuti non è nemmeno
       un'assenza. */
    if (Date.now() - prima < 5 * 60 * 1000) return prima;
    s.visto = Date.now();
    save();
    return prima;
  }

  /* IL RESOCONTO DELLA NOTTE. `prec` vale per tutti e due gli orari: sono
     stati dati insieme, nello stesso momento e con la stessa faccia. */
  function registraNotte(k: Giorno, dati: Record<string, unknown>) {
    var s = load();
    k = k || todayKey();
    var patch: Partial<RegistroGiorno> = {};
    if (dati['sonno']) patch.sonno = dati['sonno'] as Ora;
    if (dati['sveglia']) patch.sveglia = dati['sveglia'] as Ora;
    if (Object.keys(patch).length) setRitmoGiorno(k, patch);
    var g = s.ritmoGiorno[k] || (s.ritmoGiorno[k] = {});
    g.prec = precisioneValida(dati['prec']);
    g.chiestoNotte = true;
    if (dati['sonno'] || dati['sveglia']) {
      var m = minutiSonno(k);
      registra('giornata', 'Notte registrata: a letto ' + (patch.sonno || g.sonno) +
        ', sveglio ' + (patch.sveglia || g.sveglia) +
        (m ? ' (' + Math.floor(m / 60) + 'h ' + (m % 60 ? (m % 60) + 'm' : '').trim() + ')' : '') +
        (g.prec === 'circa' ? ' — più o meno' : ''), false);
    }
    save();
  }

  /* UN PASTO DEL GIORNO. `fatto: false` non è un buco: è un'informazione, e
     nel grafico della giornata quel pasto si vede saltato. */
  function registraPasto(k: Giorno, id: string, dati: Record<string, unknown>) {
    load();
    k = k || todayKey();
    var base = ritmoDi(k);
    var pasti = JSON.parse(JSON.stringify(base.pasti || [])) as Pasto[];
    var pas = pasti.find(function (x) { return x.id === id; });
    if (!pas) return null;
    if (dati['ora']) pas.ora = dati['ora'] as Ora;
    pas.fatto = dati['fatto'] !== false;
    pas.prec = precisioneValida(dati['prec']);
    setRitmoGiorno(k, { pasti: pasti });
    registra('giornata', pas.fatto
      ? pas.nome + (dati['ora'] ? ' alle ' + pas.ora : '') + (pas.prec === 'circa' ? ' (più o meno)' : '')
      : pas.nome + ': saltato', false);
    save();
    return pas;
  }

  /* «l'ho chiesto e mi hai detto non adesso»: non si richiede oggi, e la
     domanda resta dove sta di casa (nei rituali) per chi la vuole */
  function segnaChiesto(k: Giorno, quale: string) {
    var s = load();
    k = k || todayKey();
    if (!s.ritmoGiorno) s.ritmoGiorno = {};
    var g = s.ritmoGiorno[k] || (s.ritmoGiorno[k] = {});
    if (quale === 'notte') g.chiestoNotte = true; else g.chiestoGiorno = true;
    save();
  }
  function giaChiesto(k: Giorno, quale: string) {
    var g = load().ritmoGiorno[k || todayKey()] || {};
    return !!g[quale === 'notte' ? 'chiestoNotte' : 'chiestoGiorno'];
  }

  /* I PASTI DI CUI SI PUÒ ANCORA PARLARE: quelli la cui ora è passata. Alle
     nove del mattino non si chiede se hai cenato. */
  /* `oraOra` sono MINUTI dalla mezzanotte, non un 'HH:MM': gli avevo messo
     `Ora` per il nome, e il confronto con `+ 30` qui sotto non ha piu' avuto
     senso. Nessuno la passa: il ripiego e' l'ora di adesso. */
  function oraDelGiorno() {
    var d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }
  function minutiDaOra(hhmm: string | null | undefined) {
    var m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || ''));
    return m ? (+(m[1] || 0)) * 60 + (+(m[2] || 0)) : 0;
  }

  /* UNA COSA FATTA E SCRITTA DOPO. Non è un'azione da fare che poi si spunta:
     nasce già fatta, e il diario lo dice — se dicesse «aggiunta» e poi
     «completata» racconterebbe due gesti dove ce n'è stato uno.
     Gli XP sono quelli di un'azione qualunque: il lavoro l'hai fatto, che tu
     l'abbia scritto prima o dopo non cambia niente. */
  function registraFatta(testo: string, areaId: string | null, opts?: OpzAzione) {
    var s = load();
    opts = opts || {};
    var data = opts.data || todayKey();
    var a = {
      id: uid(),
      areaId: areaId || 'altro',
      testo: String(testo || '').trim(),
      ifThen: '', mit: false,
      done: true,
      data: data,
      doneAt: data === todayKey() ? Date.now() : (parseKey(data).getTime() + 12 * 3600000),
      creata: Date.now(),
      ora: opts.ora || null,
      durata: opts.durata || null,
      passoDi: null,
      /* scritta dopo: serve a saperlo guardando i dati, e a non contarla come
         una cosa pianificata quando si guarda se il piano del mattino ha
         funzionato */
      dopo: true
    };
    if (!a.testo) return null;
    s.azioni.push(a);
    var punti = premiaXp('azione', data);
    registra('azione', 'Fatta oggi, scritta dopo: «' + a.testo + '»' +
      (a.ora ? ' (' + a.ora + ')' : '') + ' (+' + punti + ' XP)', true);
    save();
    return a;
  }

  /* ---------- quello che funziona per te, senza esperimento ----------
     Fra «mi sono accorto di una cosa su di me» e «ho fatto un esperimento
     N-of-1 di quattro settimane» non c'era niente, e l'esperimento è troppo
     per il novantacinque per cento di quello che uno capisce di sé. Qui una
     riga di testo, un verso e COME FAI A SAPERLO: la stessa onestà che la
     pagina della scienza usa per gli studi (alta / media / euristica),
     applicata a te.

     La forza non è un giudizio su di te, è un'etichetta su quella riga: serve
     a chi vuole essere preciso per dire «questa l'ho vista una volta» senza
     dover scegliere fra tacere e affermare. */

  interface ForzaLezione { id: string; eti: string; breve: string; peso: number }
  var FORZE_LEZIONE: ForzaLezione[] = [
    { id: 'notato',   eti: 'notato una volta',   breve: 'una volta',   peso: 1 },
    { id: 'ripetuto', eti: 'lo noto ogni volta', breve: 'ogni volta',  peso: 2 },
    { id: 'misurato', eti: 'misurato',           breve: 'misurato',    peso: 3 }
  ];
  /* `id` puo mancare: la chiamano anche con quello che arriva da un campo.
     Il ripiego e' la prima forza, e `presa` dice perche' quell'indice c'e'. */
  function forzaLezione(id?: string): ForzaLezione {
    return FORZE_LEZIONE.find(function (f) { return f.id === id; }) || presa(FORZE_LEZIONE[0]);
  }
  function nomeArea(id: string) {
    var a = load().aree.find(function (x) { return x.id === id; });
    return a ? a.nome : id;
  }
  /* la riga di diario, con il segno del verso: due categorie e non una, così
     nel diario si vede da lontano se è una cosa che funziona o una che no */
  function registraLezione(l: Lezione, testo: string) {
    registra(l.verso === 'no' ? 'lezione-no' : 'lezione-si', testo, false);
  }
  function aggiungiLezione(testo: string, verso: Verso, opts?: { forza?: string; areaId?: string | null; espId?: string | null }) {
    var s = load();
    opts = opts || {};
    var l = {
      id: uid(),
      testo: String(testo || '').trim(),
      verso: (verso === 'no' ? 'no' : 'si') as Verso,
      forza: forzaLezione(opts.forza).id,
      areaId: opts.areaId || null,
      espId: opts.espId || null,
      creata: Date.now(),
      aggiornata: Date.now()
    };
    if (!l.testo) return null;
    s.lezioni.unshift(l);
    if (!(opts as { interna?: boolean }).interna) {
      registraLezione(l, 'Scoperta · ' + (l.verso === 'si' ? 'funziona' : 'non funziona') + ': «' + l.testo + '»');
    }
    save();
    return l;
  }
  function trovaLezione(id: string) {
    return load().lezioni.find(function (x) { return x.id === id; }) || null;
  }
  function modificaLezione(id: string, campi: Partial<Lezione>) {
    load();
    var l = trovaLezione(id);
    if (!l) return null;
    var prima = { testo: l.testo, verso: l.verso, forza: l.forza, areaId: l.areaId };
    if (campi.testo !== undefined) l.testo = String(campi.testo).trim() || l.testo;
    if (campi.verso !== undefined) l.verso = campi.verso === 'no' ? 'no' : 'si';
    if (campi.forza !== undefined) l.forza = forzaLezione(campi.forza).id;
    if (campi.areaId !== undefined) l.areaId = campi.areaId || null;
    if (campi.espId !== undefined) l.espId = campi.espId || null;
    l.aggiornata = Date.now();
    /* si racconta solo quello che è cambiato davvero: «rinominata» su una
       riga in cui è cambiata l'area sarebbe una riga di diario che mente */
    if (!(campi as { interna?: boolean }).interna) {
      if (prima.verso !== l.verso) {
        registraLezione(l, 'Spostata: «' + l.testo + '» adesso è fra quelle che ' +
          (l.verso === 'si' ? 'funzionano' : 'non funzionano'));
      } else if (prima.testo !== l.testo) {
        registraLezione(l, 'Riscritta una scoperta → «' + l.testo + '»');
      } else if (prima.forza !== l.forza) {
        registraLezione(l, '«' + l.testo + '» · ' + forzaLezione(l.forza).eti);
      } else if (prima.areaId !== l.areaId) {
        registraLezione(l, 'Area di «' + l.testo + '» → ' + (l.areaId ? nomeArea(l.areaId) : 'nessuna'));
      }
    }
    save();
    return l;
  }
  function giraLezione(id: string) {
    var l = trovaLezione(id);
    if (!l) return null;
    return modificaLezione(id, { verso: l.verso === 'si' ? 'no' : 'si' });
  }
  function rimuoviLezione(id: string) {
    var s = load();
    var i = s.lezioni.findIndex(function (x) { return x.id === id; });
    if (i < 0) return;
    var l = presa(s.lezioni[i]);
    s.lezioni.splice(i, 1);
    registraLezione(l, 'Tolta dalle Scoperte: «' + l.testo + '»');
    save();
  }
  /* ordinate per quanto sono solide, poi per quanto sono recenti: in cima
     quello che sai davvero, e a pari forza quello di cui ti sei accorto ora */
  function lezioni(verso?: Verso) {
    var s = load();
    return s.lezioni
      .filter(function (l) { return !verso || l.verso === verso; })
      .slice()
      .sort(function (a, b) {
        var d = forzaLezione(b.forza).peso - forzaLezione(a.forza).peso;
        return d !== 0 ? d : (b.aggiornata || b.creata) - (a.aggiornata || a.creata);
      });
  }

  /* ---------- motore esperimenti (N-of-1) ---------- */
  /* Un esperimento confronta una metrica esistente tra una fase di
     baseline (A) e una di intervento (B). Onestà scientifica:
     niente p-value su 10 punti — riportiamo medie, differenza e
     un effect size con l'avvertenza esplicita dei limiti. */

  var METRICHE_ESPERIMENTO = [
    { id: 'focus',   nome: 'Focus (da check-in, 1–5)',    fonte: 'checkin', campo: 'focus' },
    { id: 'energia', nome: 'Energia (da check-in, 1–5)',  fonte: 'checkin', campo: 'energia' },
    { id: 'umore',   nome: 'Umore (da check-in, 1–5)',    fonte: 'checkin', campo: 'umore' },
    { id: 'voto',    nome: 'Voto a un’area (1–5)',        fonte: 'valutazione' },
    { id: 'minuti',  nome: 'Minuti dedicati a un’area',   fonte: 'minuti' },
    { id: 'xp',      nome: 'XP guadagnati nel giorno',    fonte: 'xp' }
  ];

  function creaEsperimento(dati: Omit<Esperimento, 'id' | 'stato'> & { stato?: Esperimento['stato'] }) {
    var s = load();
    var e: Esperimento = {
      id: uid(),
      nome: dati.nome,
      intervento: dati.intervento || '',
      metrica: dati.metrica,
      areaId: dati.areaId || null,
      inizioBaseline: dati.inizioBaseline,
      inizioIntervento: dati.inizioIntervento,
      fine: dati.fine,
      stato: 'attivo',
      /* la riga imparata da cui è nato, se è nato da una: serve a non
         scriverne una seconda quando l'esperimento finisce — quella riga si
         aggiorna, non si duplica */
      lezioneId: dati.lezioneId || null
    };
    s.esperimenti.unshift(e);
    save();
    return e;
  }

  /* il legame nell'altro verso: l'esperimento è già avviato e la riga nasce
     dal suo risultato */
  function creaLegameEsperimento(espId: string, lezId: string) {
    var s = load();
    var e = s.esperimenti.find(function (x) { return x.id === espId; });
    if (!e) return;
    e.lezioneId = lezId;
    save();
  }

  function valoreMetrica(e: Esperimento, k: Giorno) {
    var s = load();
    var m = METRICHE_ESPERIMENTO.find(function (x) { return x.id === e.metrica; });
    if (!m) return null;
    if (m.fonte === 'checkin') {
      var quale = m as { campo: 'energia' | 'focus' | 'umore' };
      var vals = s.checkins.filter(function (c) { return c.data === k; }).map(function (c) { return c[quale.campo]; });
      return vals.length ? vals.reduce(function (a, b) { return a + b; }, 0) / vals.length : null;
    }
    /* SENZA AREA NON C'E' NIENTE DA LEGGERE. In JavaScript `[null]` tornava
       `undefined` e la riga dopo lo trasformava in `null`: lo stesso risultato,
       detto una riga prima invece che per caso. */
    if (m.fonte === 'valutazione') {
      if (!e.areaId) return null;
      var voti = s.valutazioni[k];
      var v = voti ? voti[e.areaId] : undefined;
      return v === undefined ? null : v;
    }
    if (m.fonte === 'minuti') {
      if (!e.areaId) return null;
      return minutiDi(k)[e.areaId] || null;
    }
    if (m.fonte === 'xp') {
      return s.xpPerGiorno[k] || null;
    }
    return null;
  }

  function risultatiEsperimento(e: Esperimento) {
    /* i nomi dei due campi sono `data` e `valore`, e non `k`/`v`: li legge
       `LMCharts.experiment`, che disegna il grafico dell'esperimento. */
    var punti: { data: Giorno; valore: number | null; fase: 'A' | 'B' }[] = [];
    var k: Giorno = e.inizioBaseline;
    var fine = e.fine || todayKey();
    if (daysBetween(k, fine) > 366) fine = addDays(k, 366);
    while (daysBetween(k, fine) >= 0) {
      const fase: 'A' | 'B' = daysBetween(e.inizioIntervento, k) >= 0 ? 'B' : 'A';
      punti.push({ data: k, valore: valoreMetrica(e, k), fase: fase });
      k = addDays(k, 1);
    }
    function stats(fase: 'A' | 'B'): { n: number; media: number | null; sd: number | null } {
      var v = punti.filter(function (p) { return p.fase === fase && p.valore !== null; }).map(function (p) { return p.valore as number; });
      if (!v.length) return { n: 0, media: null, sd: null };
      var m = v.reduce(function (a, b) { return a + b; }, 0) / v.length;
      var sd = v.length > 1 ? Math.sqrt(v.reduce(function (a, b) { return a + (b - m) * (b - m); }, 0) / (v.length - 1)) : 0;
      return { n: v.length, media: m, sd: sd };
    }
    var A = stats('A'), B = stats('B');
    var d: number | null = null;
    if (A.n > 1 && B.n > 1 && A.sd !== null && B.sd !== null && A.media !== null && B.media !== null) {
      var sdA = A.sd, sdB = B.sd, mA = A.media, mB = B.media;
      var pooled = Math.sqrt(((A.n - 1) * sdA * sdA + (B.n - 1) * sdB * sdB) / (A.n + B.n - 2));
      d = pooled > 0 ? (mB - mA) / pooled : null;
    }
    return { punti: punti, baseline: A, intervento: B, effetto: d };
  }

  /* ---------- dati demo ---------- */
  /* PRNG con seed fisso: la demo è identica per tutti, così il
     prototipo si valuta su dati stabili e realistici. */

  function mulberry32(seed: number) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function seedDemo() {
    reset();
    /* `load()` e non `state`: dicono la stessa cosa — `reset()` ha appena
       riempito lo stato — ma `state` è «forse niente» per tutta la vita del
       modulo, e leggerlo qui costringeva a quarantasei controlli inutili in
       una funzione che sa benissimo di avere uno stato in mano. */
    var s = load();
    /* i dati di esempio non sono un azzeramento dichiarato: hanno una storia
       di otto settimane, e il taglio messo da `reset()` li porterebbe via tutti
       alla prima fusione (sono più vecchi dell'istante in cui li si carica) */
    s.azzerato = 0;
    var rnd = mulberry32(20260719);
    var giorni = lastNDays(56); // 8 settimane
    var oggi = todayKey();

    s.onboarded = true;
    s.demo = true;
    s.profilo.nome = 'Raffaele';
    s.profilo.visione = 'Costruire cose che contano, imparare più veloce di chiunque, restare curioso e in salute.';

    /* indicizzata col nome dell'area, e le chiavi qui sotto sono esattamente
       gli id delle aree di partenza: senza il tipo, `esempiAzioni[area]` era
       `any` e un'area in piu' avrebbe fatto crollare la demo in silenzio. */
    var esempiAzioni: Record<string, string[]> = {
      studio:       ['Capitolo di Analisi II + 10 esercizi', 'Ripasso attivo con flashcard (30 min)', 'Preparare domande per il ricevimento', 'Sessione deep work biblioteca (90′)'],
      salute:       ['Allenamento forza — gambe', 'Corsa 5 km zona 2', 'Prep pasti per 3 giorni', 'In letto entro le 23:30'],
      relazioni:    ['Chiamare i nonni', 'Organizzare cena con il gruppo', 'Rispondere a Marco con proposta concreta'],
      finanze:      ['Registrare spese settimana', 'Spostare 10% su conto risparmio', 'Confrontare piani telefonici'],
      associazioni: ['Agenda per il direttivo', 'Onboarding dei due nuovi membri', 'Draft sponsorship per l’evento'],
      founder:      ['Intervistare 2 utenti target', 'Spedire la landing v2', 'Scrivere il changelog e postarlo', 'Fix onboarding: primo utente in <60s'],
      lavoro:       ['Chiudere il report per il cliente', 'Preparare demo di venerdì', 'Inbox a zero + piani per domani'],
      altro:        ['Provare la lezione di arrampicata', 'Leggere 20 pagine del saggio nuovo']
    };
    var esempiInbox = [
      'Idea: bot che trasforma i vocali in task',
      'Chiedere a Sara del bando Erasmus+ startup',
      'Guardare paper su spaced repetition e sonno',
      'Regalo per il compleanno di mamma (tra 3 settimane!)',
      'Provare a studiare al parco invece che in camera',
      'Domanda: il progetto X vale ancora la mia energia?'
    ];
    var vittorie = DIARIO_ESEMPIO.vittorie;
    var blocchi = DIARIO_ESEMPIO.blocchi;

    function pick<T>(arr: readonly T[]): T { return arr[Math.floor(rnd() * arr.length)] as T; }

    giorni.forEach(function (k, idx) {
      var dow = parseKey(k).getDay();
      var futuro = k === oggi;
      /* trend leggero di miglioramento nelle ultime 3 settimane
         (l'esperimento demo "sport al mattino" parte al giorno 28) */
      var boost = idx >= 28 ? 0.6 : 0;
      /* ~1 giorno saltato a settimana: realismo per bassa coscienziosità */
      var saltato = rnd() < 0.13 && !futuro;
      if (saltato) return;

      /* azioni: 2-3 al giorno, 60-90% completate */
      var nAz = 2 + Math.floor(rnd() * 2);
      var areeGiorno: string[] = [];
      for (var i = 0; i < nAz; i++) {
        var area = pick(s.aree).id;
        areeGiorno.push(area);
        /* TRE CAMPI CHE QUI MANCAVANO e che `aggiungiAzione` scrive sempre:
           `ora`, `durata`, `passoDi`. Da spenti valgono `null` in tutt'e due i
           casi, quindi non cambia niente di quello che si vede; cambia che
           un'azione d'esempio ha adesso la stessa forma di una vera, e che
           `ogAz[0].ora = ...` piu' sotto scrive su un campo che esiste. */
        var a: Azione = {
          id: uid() + idx + '' + i,
          areaId: area,
          testo: pick(presa(esempiAzioni[area])),
          ifThen: '',
          mit: i === 0,
          done: futuro ? i === 0 : rnd() < (0.6 + boost * 0.3),
          data: k,
          doneAt: null,
          creata: parseKey(k).getTime() + 8 * 3600000,
          ora: null,
          durata: null,
          passoDi: null
        };
        if (a.done) {
          a.doneAt = parseKey(k).getTime() + (10 + i * 3) * 3600000;
          var punti = a.mit ? XP_EVENTI.mit : XP_EVENTI.azione;
          s.xp += punti;
          s.xpPerGiorno[k] = (s.xpPerGiorno[k] || 0) + punti;
        }
        s.azioni.push(a);
      }

      /* check-in: 1-3 al giorno */
      var nCk = futuro ? 1 : 1 + Math.floor(rnd() * 3);
      for (var c = 0; c < nCk; c++) {
        var baseE = 2.6 + boost + (dow === 0 || dow === 6 ? 0.3 : 0);
        s.checkins.push({
          data: k,
          ts: parseKey(k).getTime() + (9 + c * 4) * 3600000,
          energia: Math.max(1, Math.min(5, Math.round(baseE + rnd() * 1.8))),
          focus: Math.max(1, Math.min(5, Math.round(2.4 + boost * 1.4 + rnd() * 1.9))),
          umore: Math.max(1, Math.min(5, Math.round(2.8 + boost + rnd() * 1.7))),
          contesto: ''
        });
        s.xp += XP_EVENTI.checkin;
        s.xpPerGiorno[k] = (s.xpPerGiorno[k] || 0) + XP_EVENTI.checkin;
      }

      /* minuti + valutazioni serali sulle aree toccate */
      if (!futuro) {
        var votiDelGiorno: Record<string, number> = {};
        var minutiDelGiorno: Record<string, number> = {};
        s.valutazioni[k] = votiDelGiorno;
        s.minuti[k] = minutiDelGiorno;
        areeGiorno.forEach(function (areaId) {
          votiDelGiorno[areaId] = Math.max(1, Math.min(5, Math.round(2.5 + boost + rnd() * 2)));
          minutiDelGiorno[areaId] = 25 * (1 + Math.floor(rnd() * 5));
        });
        if (rnd() < 0.75) {
          s.reviewSera[k] = { vittoria: pick(vittorie), blocco: pick(blocchi), shutdown: rnd() < 0.7, ts: parseKey(k).getTime() + 21 * 3600000 };
          s.xp += XP_EVENTI.reviewSera;
          s.xpPerGiorno[k] = (s.xpPerGiorno[k] || 0) + XP_EVENTI.reviewSera;
        }
        if (rnd() < 0.8) {
          s.pianoMattina[k] = { compilato: true, intenzione: DIARIO_ESEMPIO.intenzione, ts: parseKey(k).getTime() + 8 * 3600000 };
          s.xp += XP_EVENTI.pianoMattina;
          s.xpPerGiorno[k] = (s.xpPerGiorno[k] || 0) + XP_EVENTI.pianoMattina;
        }
      }
    });

    /* review settimanali sulle settimane concluse */
    var settimane: Record<string, boolean> = {};
    giorni.forEach(function (k) { settimane[weekKey(k)] = true; });
    Object.keys(settimane).sort().slice(0, -1).forEach(function (chiave) {
      /* `Object.keys` torna stringhe qualunque, ma queste chiavi le ha scritte
         `weekKey`: sono il lunedi' della settimana, un giorno come gli altri */
      var wk = giorno(chiave);
      if (rnd() < 0.8) {
        s.reviewSettimana[wk] = {
          vittorie: pick(vittorie),
          blocchi: pick(blocchi),
          imparato: DIARIO_ESEMPIO.imparato,
          prossima: DIARIO_ESEMPIO.prossima,
          ts: parseKey(wk).getTime()
        };
        s.xp += XP_EVENTI.reviewSettimana;
        s.xpPerGiorno[wk] = (s.xpPerGiorno[wk] || 0) + XP_EVENTI.reviewSettimana;
      }
    });

    /* inbox */
    esempiInbox.forEach(function (t, i) {
      s.inbox.push({ id: uid() + 'ib' + i, testo: t, creata: Date.now() - i * 7200000 });
    });

    /* backlog demo: attività "da fare" senza data, divise per area */
    var esempiBacklog: [string, string][] = [
      ['studio', 'Recuperare i corsi di ingegneria gestionale'],
      ['studio', 'Studiare le risposte per l’OFA di inglese'],
      ['studio', 'Leggere il libro di esercizi di Analisi 1'],
      ['founder', 'Scrivere i primi 30 script per Agorà'],
      ['founder', 'Scrivere i primi 30 script per Atlas'],
      ['salute', 'Leggere 1 ora al giorno un libro personale'],
      ['lavoro', 'Trovare lavoro per agosto'],
      ['altro', 'Mettere su Vinted i pantaloni'],
      ['altro', 'Confrontare iPhone 15 Pro e GH5']
    ];
    esempiBacklog.forEach(function (b, i) {
      s.backlog.push({ id: uid() + 'bk' + i, testo: b[1], areaId: b[0], creata: Date.now() - i * 3600000 });
    });
    /* una scadenza d'esempio: "trovare lavoro" entro ~3 settimane */
    var conScad = s.backlog.find(function (b) { return b.areaId === 'lavoro'; });
    if (conScad) conScad.scadenza = addDays(oggi, 20);

    /* due progetti d'esempio scomposti in passi */
    var pAgora = s.backlog.find(function (b) { return /Agorà/.test(b.testo); });
    if (pAgora) pAgora.steps = [
      { id: uid() + 's1', testo: 'Definire 5 temi ricorrenti', done: true },
      { id: uid() + 's2', testo: 'Scrivere gli hook dei primi 10', done: false },
      { id: uid() + 's3', testo: 'Bozza completa 1–10', done: false },
      { id: uid() + 's4', testo: 'Bozza completa 11–30', done: false }
    ];
    var pCorsi = s.backlog.find(function (b) { return /corsi di ing/i.test(b.testo); });
    if (pCorsi) pCorsi.steps = [
      { id: uid() + 'c1', testo: 'Elenco lezioni arretrate', done: true },
      { id: uid() + 'c2', testo: 'Recuperare modulo 1', done: false },
      { id: uid() + 'c3', testo: 'Recuperare modulo 2', done: false }
    ];

    /* abitudini demo con storico per le serie */
    /* area, testo, e i giorni della settimana in cui vale: vuoto = tutti */
    var esempiAbit: [string, string, GiornoSettimana[]][] = [
      ['salute', 'Leggere 20 minuti', []],
      ['studio', 'Ripasso flashcard', []],
      ['salute', 'Camminata / movimento', [1, 2, 3, 4, 5]]
    ];
    esempiAbit.forEach(function (h, i) {
      var fatti: Record<string, boolean> = {};
      var quandoVale = h[2];
      for (var d = 1; d <= 12; d++) {
        var k = addDays(oggi, -d);
        if ((quandoVale.length === 0 || quandoVale.indexOf(parseKey(k).getDay() as GiornoSettimana) >= 0) && rnd() < 0.8) fatti[k] = true;
      }
      /* i dati di esempio hanno una storia: l'abitudine "esiste" da 20 giorni */
      s.abitudini.push({ id: uid() + 'ab' + i, testo: h[1], areaId: h[0], giorni: quandoVale, creata: Date.now(),
        fatti: fatti, ora: null, durata: null, da: addDays(oggi, -20), a: null, salti: {} });
    });

    /* orari d'esempio per la giornata di oggi, così la timeline "La giornata"
       si vede subito piena */
    var ogAz = s.azioni.filter(function (a) { return a.data === oggi; });
    var az0 = ogAz[0], az1 = ogAz[1];
    if (az0) { az0.ora = ora('09:30'); az0.durata = 90; }
    if (az1) { az1.ora = ora('15:00'); az1.durata = 60; }
    s.abitudini.forEach(function (h) {
      if (/camminata|movimento/i.test(h.testo)) { h.ora = ora('18:00'); h.durata = 45; }
      else if (/leggere/i.test(h.testo)) { h.ora = ora('22:00'); h.durata = 30; }
    });

    /* esperimento demo: sport al mattino → focus */
    s.esperimenti.push({
      id: uid() + 'exp1',
      nome: DIARIO_ESEMPIO.esperimenti[0],
      intervento: 'Allenamento o camminata veloce prima delle 10:00, poi sessione di lavoro.',
      metrica: 'focus',
      areaId: null,
      /* `presa` e non un punto interrogativo: `lastNDays(56)` torna
         cinquantasei giorni, questi indici ci sono. Se un giorno non ci
         fossero, meglio saperlo subito che avere una demo con date vuote. */
      inizioBaseline: presa(giorni[14]),
      inizioIntervento: presa(giorni[28]),
      fine: presa(giorni[52]),
      stato: 'concluso',
      /* `lezioneId` mancava: `creaEsperimento` lo scrive sempre, qui no. Da
         spento e' `null` in tutt'e due i casi. */
      lezioneId: null
    });
    s.esperimenti.push({
      id: uid() + 'exp2',
      nome: DIARIO_ESEMPIO.esperimenti[1],
      intervento: 'Telefono in un’altra stanza durante le sessioni di studio del pomeriggio.',
      metrica: 'minuti',
      areaId: 'studio',
      inizioBaseline: presa(giorni[42]),
      inizioIntervento: presa(giorni[49]),
      fine: null,
      stato: 'attivo',
      lezioneId: null
    });

    /* quello che ha capito su di sé senza esperimento: mescolate le tre
       forze, e una col verso girato — perché succede davvero che una cosa
       smetta di funzionare */
    var esempiLezioni: [string, Verso, string, string | null][] = [
      ['Studiare in biblioteca invece che in camera', 'si', 'ripetuto', 'studio'],
      ['Iniziare dalla cosa più difficile appena mi sveglio', 'si', 'ripetuto', null],
      ['Mettere il telefono in un’altra stanza', 'si', 'misurato', 'studio'],
      ['Camminare venti minuti dopo pranzo', 'si', 'notato', 'salute'],
      ['Dire «lo faccio dopo» senza scrivere quando', 'no', 'ripetuto', null],
      ['Le liste lunghissime: mi bloccano invece di aiutarmi', 'no', 'ripetuto', null],
      ['Studiare dopo cena', 'no', 'notato', 'studio'],
      ['Le sveglie multiple: le spengo tutte e dormo di più', 'no', 'notato', 'salute']
    ];
    esempiLezioni.forEach(function (r, i) {
      s.lezioni.push({
        id: uid() + 'lez' + i,
        testo: r[0], verso: r[1], forza: r[2], areaId: r[3], espId: null,
        creata: parseKey(presa(giorni[20 + i * 3])).getTime(),
        aggiornata: parseKey(presa(giorni[30 + i * 2])).getTime()
      });
    });

    /* I DATI DI ESEMPIO ARRIVANO CON LA GIORNATA GIÀ RACCONTATA: chiedere
       «com'è andata la notte» sopra una storia inventata non ha senso, e
       soprattutto rende prevedibile l'app per le prove, che partono tutte da
       qui. Domani le domande tornano. */
    var oggiRitmo = s.ritmoGiorno[oggi] || (s.ritmoGiorno[oggi] = {});
    oggiRitmo.chiestoNotte = true;
    oggiRitmo.chiestoGiorno = true;

    s.registro = []; // la demo parte con un diario-registro pulito
    s.esempio = improntaEsempio(s);
    save();
  }

  /* ==================================================================
     I DATI DI ESEMPIO NON SONO LA TUA VITA
     ==================================================================
     Si caricano per provare l'app, e prima o poi si collega l'account vero.
     Erano due guai: l'esempio finiva nel cloud mescolato ai dati veri (e da
     lì su tutti i dispositivi), e per toglierlo si usava «Azzera tutto», il
     cui taglio, alla prima sincronizzazione, cancellava anche i dati veri del
     telefono. Adesso l'esempio porta un'impronta: cosa ha scritto e com'era.
     Con quella si toglie preciso, solo quello, e non esce mai di qui. */
  const MAPPE_ESEMPIO = ['valutazioni', 'minuti', 'xpPerGiorno', 'pianoMattina', 'reviewSera', 'reviewSettimana', 'ritmoGiorno'] as const;
  const ELENCHI_ESEMPIO = ['azioni', 'inbox', 'backlog', 'abitudini', 'checkins', 'esperimenti', 'lezioni'] as const;
  function firma(v: unknown): number {
    var t = JSON.stringify(v) || '', h = 5381;
    for (var i = 0; i < t.length; i++) h = ((h * 33) ^ t.charCodeAt(i)) >>> 0;
    return h;
  }
  function idDi(r: unknown): string {
    var m = r as { id?: string; ts?: number };
    return m && (m.id || (m.ts != null ? 'ts' + m.ts : '')) || '';
  }
  function improntaEsempio(st: Stato): ImprontaEsempio {
    var imp: ImprontaEsempio = { ids: {}, giorni: {} };
    var grezzo = st as unknown as Record<string, unknown>;
    ELENCHI_ESEMPIO.forEach(function (k) {
      var l = grezzo[k];
      imp.ids[k] = Array.isArray(l) ? l.map(idDi).filter(Boolean) : [];
    });
    MAPPE_ESEMPIO.forEach(function (k) {
      var m = grezzo[k], f: Record<string, number> = {};
      if (eMappa(m)) Object.keys(m).forEach(function (g) { f[g] = firma((m as Record<string, unknown>)[g]); });
      imp.giorni[k] = f;
    });
    return imp;
  }
  /* toglie da `st` quello che è d'esempio. Con l'impronta, solo quello che
     l'esempio ha scritto e nessuno ha più toccato; con `ancheTesti` anche le
     righe che hanno esattamente i testi dell'esempio (per l'esempio finito
     nel cloud prima che ci fosse l'impronta). Torna quante cose ha tolto. */
  function togliEsempioDa(st: Stato, ancheTesti?: boolean): number {
    var tolte = 0;
    var grezzo = st as unknown as Record<string, unknown>;
    var imp = st.esempio || null;
    var testi = TESTI_ESEMPIO as unknown as Record<string, readonly string[]>;
    ELENCHI_ESEMPIO.forEach(function (k) {
      var l = grezzo[k];
      if (!Array.isArray(l)) return;
      var ids: Record<string, 1> = {};
      ((imp && imp.ids[k]) || []).forEach(function (i) { ids[i] = 1; });
      var t = ancheTesti ? (testi[k] || []) : [];
      var resta = l.filter(function (r: unknown) {
        var via = !!ids[idDi(r)] || (t.length > 0 && t.indexOf(String((r as { testo?: string }).testo || '')) >= 0);
        if (via) tolte++;
        return !via;
      });
      grezzo[k] = resta;
    });
    if (imp) {
      var giorniImp = imp.giorni;
      MAPPE_ESEMPIO.forEach(function (k) {
        var m = grezzo[k], f = giorniImp[k] || {};
        if (!eMappa(m)) return;
        Object.keys(f).forEach(function (g) {
          if (g in (m as Record<string, unknown>) && firma((m as Record<string, unknown>)[g]) === f[g]) {
            delete (m as Record<string, unknown>)[g]; tolte++;
          }
        });
      });
    }
    if (ancheTesti) tolte += togliDiarioEsempio(st);
    /* i punti si ricavano dai conti: un giorno d'esempio tolto da
       `xpPerGiorno` se ne va anche da lì, se no tornerebbe al primo calcolo */
    if (eMappa(st.xpConti)) {
      var conti = st.xpConti, perGiorno = st.xpPerGiorno || {};
      Object.keys(conti).forEach(function (g) { if (g !== '_' && !(g in perGiorno)) delete conti[g]; });
      ricalcolaXp(st);
    }
    if (imp || ancheTesti) {
      if (st.profilo.visione === PROFILO_ESEMPIO.visione) st.profilo.visione = '';
    }
    st.demo = false;
    st.esempio = null;
    return tolte;
  }
  /* quante cose d'esempio ci sono (con l'impronta e coi testi) */
  /* IL DIARIO DELL'ESEMPIO FINITO NELL'ACCOUNT. Le frasi sono sempre
     quelle (mattina, sera, settimana): una voce che le ha TUTTE uguali
     all'esempio non l'hai scritta tu. Con loro se ne vanno anche i numeri
     inventati di quei giorni — i check-in alle 9, 13 e 17 in punto senza
     contesto, i voti, i minuti e i punti — ma solo nei giorni in cui non
     c'è niente di tuo. Ogni giorno tolto lascia la sua lapide, così un
     altro dispositivo non lo rimette. */
  function togliDiarioEsempio(st: Stato): number {
    var D = DIARIO_ESEMPIO, tolte = 0, ora = Date.now();
    var lapidi = st.cancellati || (st.cancellati = []);
    var giorniEsempio: Record<string, 1> = {};
    function via(campo: string, g: string) {
      var m = (st as unknown as Record<string, unknown>)[campo];
      if (!eMappa(m) || !(g in m)) return;
      var val = (m as Record<string, unknown>)[g];
      delete (m as Record<string, unknown>)[g];
      /* il diario ha la sua ora; i numeri (voti, minuti, punti) no: per quelli
         si toglie solo quel valore, e uno nuovo dello stesso giorno resta */
      var l: Lapide = { k: campo, chiave: g, ts: ora, vivo: false };
      if (!eMappa(val) || !momentoRiga(val, 0)) l.firma = firma(val);
      lapidi.push(l);
      giorniEsempio[g] = 1; tolte++;
    }
    var vit = D.vittorie as readonly string[], blo = D.blocchi as readonly string[];
    Object.keys(st.pianoMattina || {}).forEach(function (g) {
      var v = (st.pianoMattina as Record<string, { intenzione?: string }>)[g];
      if (v && v.intenzione === D.intenzione) via('pianoMattina', g);
    });
    Object.keys(st.reviewSera || {}).forEach(function (g) {
      var v = (st.reviewSera as Record<string, { vittoria?: string; blocco?: string }>)[g];
      if (v && vit.indexOf(String(v.vittoria)) >= 0 && blo.indexOf(String(v.blocco)) >= 0) via('reviewSera', g);
    });
    Object.keys(st.reviewSettimana || {}).forEach(function (g) {
      var v = (st.reviewSettimana as Record<string, { imparato?: string; prossima?: string }>)[g];
      if (v && v.imparato === D.imparato && v.prossima === D.prossima) via('reviewSettimana', g);
    });
    /* le azioni dell'esempio scritte giorno per giorno: nate alle 8 in punto */
    (st.azioni || []).forEach(function (a) {
      if (a && a.data && (TESTI_ESEMPIO.azioni as readonly string[]).indexOf(a.testo) >= 0 &&
          a.creata === parseKey(a.data).getTime() + 8 * 3600000) giorniEsempio[a.data] = 1;
    });
    var primaCk = (st.checkins || []).length;
    st.checkins = (st.checkins || []).filter(function (c) {
      if (!c || c.contesto || !c.data) return true;
      var d = c.ts - parseKey(c.data).getTime();
      var inventato = d === 9 * 3600000 || d === 13 * 3600000 || d === 17 * 3600000;
      if (inventato) giorniEsempio[c.data] = 1;
      return !inventato;
    });
    tolte += primaCk - st.checkins.length;
    /* i giorni in cui c'è qualcosa di tuo restano come sono */
    var tuoi: Record<string, 1> = {};
    (st.azioni || []).forEach(function (a) {
      if (a && a.data && (TESTI_ESEMPIO.azioni as readonly string[]).indexOf(a.testo) < 0) tuoi[a.data] = 1;
    });
    (st.checkins || []).forEach(function (c) { if (c && c.data) tuoi[c.data] = 1; });
    ['pianoMattina', 'reviewSera'].forEach(function (campo) {
      Object.keys((st as unknown as Record<string, Record<string, unknown>>)[campo] || {}).forEach(function (g) { tuoi[g] = 1; });
    });
    Object.keys(giorniEsempio).forEach(function (g) {
      if (tuoi[g]) return;
      var xp = (st.xpPerGiorno || {})[g];
      if (typeof xp === 'number') st.xp = Math.max(0, (st.xp || 0) - xp);
      ['valutazioni', 'minuti', 'xpPerGiorno'].forEach(function (campo) { via(campo, g); });
    });
    var primaEs = (st.esperimenti || []).length;
    st.esperimenti = (st.esperimenti || []).filter(function (e) { return !(e && (D.esperimenti as readonly string[]).indexOf(e.nome) >= 0); });
    tolte += primaEs - st.esperimenti.length;
    if (st.profilo && st.profilo.visione === PROFILO_ESEMPIO.visione) { st.profilo.visione = ''; tolte++; }
    return tolte;
  }
  function contaEsempio(): number {
    var copia = JSON.parse(JSON.stringify(load())) as Stato;
    return togliEsempioDa(copia, true);
  }
  /* il tasto «Togli i dati di esempio» */
  function togliEsempio(): number {
    backup('prima-di-togliere-i-dati-di-esempio');
    var n = togliEsempioDa(load(), true);
    registra('dati', 'Tolti i dati di esempio (' + n + ')', true);
    save();
    return n;
  }
  /* quello che va nel cloud: tutto, tranne l'esempio contrassegnato */
  function snapshotPerCloud(): Stato {
    var copia = JSON.parse(JSON.stringify(load())) as Stato;
    if (copia.esempio) togliEsempioDa(copia, false);
    return copia;
  }
  /* PRIMA DI UNIRSI A UN ACCOUNT per la prima volta, da questo dispositivo:
     · l'esempio contrassegnato resta fuori;
     · un «Azzera tutto» fatto QUI prima di collegarsi non taglia il cloud.
       Quel taglio voleva dire «via quello che avevo qui», e qui non c'era
       niente dell'account: applicato alla fusione, cancellava tutti i dati
       veri dell'altro dispositivo (ed è quello che succedeva). */
  function primaUnione(uid?: string): void {
    var st = load();
    var cambiato = false;
    /* i dati dell'ospite entrano adesso in questo account: con loro le sue
       copie di sicurezza, che contengono le stesse cose (prima di C1 si
       vedevano sempre tutte; adesso sono dell'account in cui sono entrati i
       loro dati, e di nessun altro) */
    if (uid) {
      sistemaCopieSenzaProprietario();
      var copie = leggiBackups(), passate = false;
      copie.forEach(function (b) { if (b && (b.chi || '') === '') { b.chi = uid; passate = true; } });
      if (passate) scriviBackups(copie);
    }
    if (st.esempio) { togliEsempioDa(st, false); cambiato = true; }
    if (st.azzerato) { st.azzerato = 0; cambiato = true; }
    /* le cancellazioni fatte qui da ospite riguardavano righe di qui: nel
       cloud non devono togliere niente */
    if (st.cancellati && st.cancellati.length) { st.cancellati = []; cambiato = true; }
    /* e così gli orologi: «Azzera tutto» fatto qui da ospite lascia un
       orologio su ogni dizionario svuotato, e portato nell'account
       toglierebbe i voti e i diari veri degli altri dispositivi */
    if (st.orologi && Object.keys(st.orologi).length) { st.orologi = {}; cambiato = true; }
    if (cambiato) { senzaLapidi++; save(); senzaLapidi--; }
  }

  /* UN DISPOSITIVO PULITO, che non dichiara niente: niente azzeramento,
     niente lapidi, solo l'aspetto scelto e il benvenuto già fatto. È lo
     stato da cui si riparte quando si esce da un account o si lascia
     l'esempio per entrare in uno: quello che c'era prima va nei backup. */
  /* `uscente`: l'account che se ne va. Uscendo da un account NON si prende
     una copia di sicurezza dei suoi dati (stanno nel cloud, e quello che non
     c'era ancora va in `mettiDaParte`, che è per account): era proprio quella
     copia, lasciata nel browser, la porta della fuga C1. E le sue copie di
     prima se ne vanno con lui. */
  /* `entrante`: l'account in cui stanno entrando i dati di prima (vedi
     `lasciaEsempio`): la copia è sua */
  function pulito(perche: string, uscente?: string, entrante?: string): void {
    var prima = load();
    if (uscente === undefined) backup(perche, entrante);
    else {
      if (uscente) sistemaCopieSenzaProprietario(uscente);
      if (uscente) scriviBackups(leggiBackups().filter(function (b) { return b && b.chi !== uscente; }));
    }
    scordaPunti();
    var nuovo = statoVuoto();
    nuovo.onboarded = true;
    nuovo.profilo.skin = prima.profilo.skin;
    nuovo.profilo.modo = prima.profilo.modo;
    nuovo.azzerato = 0;
    state = nuovo;
    /* le altre finestre aperte devono saperlo: quello che hanno in mano non
       è più di questo dispositivo (vedi GEN_KEY) */
    nuovaGenerazione();
    senzaLapidi++; save(); senzaLapidi--;
    /* il salvataggio qui sopra ha lasciato un «punto a cui tornare» con i
       dati di prima: via anche quello */
    scordaPunti();
    if (uscente !== undefined) {
      /* E QUELLO CHE I CALENDARI TENEVANO PER QUELL'ACCOUNT: la copia del
         calendario della sentinella (titoli e orari fino a un anno avanti) e i
         permessi della strada del browser. Restavano nel browser dopo «Esci»
         (verifica del 25 novembre 2026, C1 e M3). */
      ['lifemax.calendari.specchio', 'lifemax.calendari.google', 'lifemax.calendari.microsoft',
       'lifemax.calendari.microsoft.attesa', 'lifemax.calendari.qui', 'lifemax.calendari.ritorno'].forEach(function (k) {
        try { localStorage.removeItem(k); } catch (e) { /* niente */ }
      });
    }
  }
  /* entrando in un account: se qui c'è l'esempio, si mette da parte tutto */
  function lasciaEsempio(giaUnito?: boolean, uid?: string): boolean {
    var st = load();
    /* l'esempio caricato QUI (porta l'impronta), oppure — su un dispositivo
       mai unito a quell'account — uno stato che dice di essere l'esempio */
    if (!st.esempio && !(st.demo && !giaUnito)) return false;
    /* la copia ha l'esempio E quello che l'ospite ci ha scritto sopra: è di
       chi sta entrando, che la deve poter vedere da dentro l'account
       (verifica 3, N5; è lo stesso ragionamento delle copie dell'ospite in
       `primaUnione`). Prima prendeva `chi: ''` e dall'account non si vedeva. */
    pulito('prima-di-entrare-nell-account', undefined, uid);
    return true;
  }
  function lasciaAccount(uid?: string): void { pulito('uscita-dall-account', uid || ''); }

  /* UNA COPIA DA PARTE PER UN ACCOUNT, quando si esce senza che il cloud
     abbia ancora tutto: «Esci» senza rete, o la sessione chiusa da Firebase
     (account disabilitato, sessione scaduta, dati del browser cancellati).
     Il dispositivo si svuota lo stesso — i dati di un account non restano
     a disposizione di chi entra dopo — ma questa copia resta qui, in un
     contenitore che porta il nome dell'account e che nessun altro legge.
     Quando QUELLO stesso account rientra su questo dispositivo, la copia si
     unisce e se ne va: quello che non era ancora arrivato nel cloud ci
     arriva. Se entra un altro account, la copia non la tocca. */
  var DA_PARTE_PRE = 'lifemax.daparte.';
  function mettiDaParte(uid: string): boolean {
    if (!uid) return false;
    try {
      localStorage.setItem(DA_PARTE_PRE + uid, JSON.stringify({ ts: Date.now(), stato: snapshotPerCloud() }));
      return true;
    } catch (e) { return false; }
  }
  function haDaParte(uid: string): boolean {
    try { return !!localStorage.getItem(DA_PARTE_PRE + uid); } catch (e) { return false; }
  }
  /* la copia messa da parte, senza toccare quello che c'è qui: serve a
     mandarla nel cloud quando si è usciti senza rete (vedi nuvola.ts) */
  function copiaDaParte(uid: string): Stato | null {
    var raw: string | null = null;
    try { raw = localStorage.getItem(DA_PARTE_PRE + uid); } catch (e) { raw = null; }
    if (!raw) return null;
    var obj: unknown;
    try { obj = JSON.parse(raw); } catch (e) { obj = null; }
    var st = eMappa(obj) ? obj['stato'] : null;
    return eMappa(st) ? normalizza(st) : null;
  }
  function scartaDaParte(uid: string): void {
    try { localStorage.removeItem(DA_PARTE_PRE + uid); } catch (e) { /* niente */ }
  }
  function riprendiDaParte(uid: string): boolean {
    var raw: string | null = null;
    try { raw = localStorage.getItem(DA_PARTE_PRE + uid); } catch (e) { raw = null; }
    if (!raw) return false;
    var obj: unknown;
    try { obj = JSON.parse(raw); } catch (e) { obj = null; }
    var st = eMappa(obj) ? obj['stato'] : null;
    if (eMappa(st)) hydrate(st);
    try { localStorage.removeItem(DA_PARTE_PRE + uid); } catch (e) { /* resta: si riunirà la prossima volta, senza danni */ }
    return eMappa(st);
  }

  /* QUELLO CHE È CAMBIATO DOPO UN CERTO ISTANTE, come uno stato piccolo.
     Serve a una cosa sola: la pagina che si chiude subito dopo una modifica
     (vedi `pagehide` in nuvola.ts) ha il tempo di mandare UNA richiesta
     piccola, non di fare un giro intero. Unito con `unisci` a quello che c'è
     nel cloud porta le modifiche e non toglie niente: quello che qui manca
     manca solo da questo pezzetto, e le cancellazioni viaggiano come lapidi e
     orologi. Dentro: tutti i campi piccoli, le righe toccate dopo `da`, i
     giorni delle mappe degli ultimi sette giorni o con un orologio dopo `da`,
     le lapidi e gli orologi dopo `da`. */
  function cambiateDopo(da: number): Stato {
    var st = snapshotPerCloud() as unknown as Record<string, unknown>;
    var out: Record<string, unknown> = {};
    var regoleU = COME_UNIRE as unknown as Record<string, ModoFusione | undefined>;
    var o = eMappa(st['orologi']) ? st['orologi'] as Record<string, number> : NIENTE;
    var recenti = dayKey(new Date(Date.now() - 7 * 86400000));
    Object.keys(st).forEach(function (k) {
      var v = st[k], modo = regoleU[k];
      if (k === 'cancellati' && Array.isArray(v)) { out[k] = v.filter(function (t: Lapide) { return t && t.ts > da; }); return; }
      if (k === 'orologi' && eMappa(v)) { var oo: Record<string, number> = {}, ov = v; Object.keys(ov).forEach(function (c) { var t = Number(ov[c]) || 0; if (t > da) oo[c] = t; }); out[k] = oo; return; }
      if (modo === 'elenco' && Array.isArray(v) && v.length > 50) { out[k] = v.filter(function (r: unknown) { return momentoRiga(r, 0) > da; }); return; }
      if ((modo === 'mappa' || modo === 'contatore') && eMappa(v) && Object.keys(v).length > 14) {
        var m: Record<string, unknown> = {}, vm = v;
        Object.keys(vm).forEach(function (g) {
          if (g >= recenti || !/^\d{4}-\d\d-\d\d$/.test(g)) { m[g] = vm[g]; return; }
          var p = k + '/' + pezzoVia(g);
          var tocca = Object.keys(o).some(function (c) { return (c === p || c.indexOf(p + '/') === 0) && (o[c] || 0) > da; });
          if (tocca) m[g] = vm[g];
        });
        out[k] = m;
        return;
      }
      out[k] = v;
    });
    return out as unknown as Stato;
  }

  /* RIPRENDERE SOLO IL PROFILO da una copia (nome, visione, sveglia, tema,
     impostazioni del timer…). È la strada per chi si è visto azzerare il
     profilo da un dispositivo nuovo: le sue cose fatte nel frattempo restano
     come sono, e torna solo quello. Ogni campo della copia va sopra a quello
     di adesso, e quelli che la copia non ha restano. Passa da `save()`, quindi
     ogni campo rimesso prende il suo orologio e vince su tutti i dispositivi. */
  function riprendiProfilo(profilo: unknown): boolean {
    if (!eMappa(profilo)) return false;
    backup('prima-di-riprendere-il-profilo');
    var s = load();
    var sopra = function (dove: Mappa, da: Mappa) {
      Object.keys(da).forEach(function (k) {
        var v = da[k];
        if (eMappa(v) && eMappa(dove[k])) sopra(dove[k] as Mappa, v);
        else dove[k] = JSON.parse(JSON.stringify(v === undefined ? null : v));
      });
    };
    sopra(s.profilo as unknown as Mappa, profilo);
    registra('dati', 'Ripreso il profilo da una copia nel cloud', true);
    save();
    return true;
  }

  /* ==================================================================
     DUE FINESTRE DELLA STESSA APP, SULLO STESSO DISPOSITIVO
     ==================================================================
     Succede più di quanto sembri: la scheda aperta ieri e mai chiusa, l'app
     installata accanto al sito nel browser, il computer con due finestre.
     Ognuna teneva il suo stato in memoria e scriveva sopra a quello
     dell'altra: l'ultima che salvava vinceva, e quello che avevi fatto
     nell'altra spariva senza dire niente. Con l'account acceso se ne
     accorgeva il cloud, dopo un giro dal server; senza account — che è come
     parte l'app — non se ne accorgeva nessuno.
     Il browser lo dice da sé: l'evento `storage` arriva alle ALTRE finestre
     quando una scrive, e porta il testo nuovo. Da lì è lo stesso lavoro che
     si fa con un altro dispositivo: si unisce.
     E si unisce solo se cambia qualcosa davvero. Senza questo controllo le
     due finestre si rispondono a vicenda — io scrivo, tu ricevi e scrivi, io
     ricevo e scrivo — e non si fermano più. */
  window.addEventListener('storage', function (ev) {
    /* un'altra finestra ha svuotato il dispositivo (uscita dall'account):
       qui non si unisce niente, si butta quello che si ha e si rilegge */
    if (ev.key === GEN_KEY) {
      if (generazione !== null && (ev.newValue || '') !== generazione) {
        if (window.LMLog) window.LMLog.add('info', 'dati', 'un’altra finestra ha svuotato il dispositivo: rileggo');
        ricarica();
      }
      return;
    }
    if (ev.key !== STORAGE_KEY || !ev.newValue) return;
    if (generazione !== null && leggiGenerazione() !== generazione) { ricarica(); return; }
    if (ev.newValue === ultimoScritto) return;
    var venuto: unknown;
    try { venuto = JSON.parse(ev.newValue); } catch (e) { return; }
    if (!venuto || typeof venuto !== 'object') return;
    var fuso = unisci(load(), venuto);
    if (!fuso) return;
    /* si confronta quello che verrebbe fuori con quello che c'è già, senza
       l'orologio: `updatedAt` cambia a ogni salvataggio e da solo farebbe
       sembrare un cambiamento ogni volta */
    if (senzaOrologio(JSON.stringify(normalizza(fuso))) === senzaOrologio(JSON.stringify(state))) {
      /* uguale a quello che abbiamo: da qui in poi è quello il «com'era» */
      ultimoScritto = ev.newValue;
      return;
    }
    if (window.LMLog) window.LMLog.add('info', 'dati', 'un’altra finestra ha salvato: unisco');
    hydrate(venuto);
    try { window.dispatchEvent(new CustomEvent('lm:remote')); } catch (e) { /* niente */ }
  });

  /* ---------- API pubblica ---------- */

  return {
    AREE_DEFAULT: AREE_DEFAULT,
    METRICHE_ESPERIMENTO: METRICHE_ESPERIMENTO,
    XP_EVENTI: XP_EVENTI,
    load: load, save: save, reset: reset, seedDemo: seedDemo,
    togliEsempio: togliEsempio, contaEsempio: contaEsempio, snapshotPerCloud: snapshotPerCloud, primaUnione: primaUnione, lasciaEsempio: lasciaEsempio, lasciaAccount: lasciaAccount, hydrate: hydrate, snapshot: snapshot,
    mettiDaParte: mettiDaParte, haDaParte: haDaParte, riprendiDaParte: riprendiDaParte, copiaDaParte: copiaDaParte, scartaDaParte: scartaDaParte, riprendiProfilo: riprendiProfilo,
    adesso: adesso, osserva: osserva, impostaScarto: impostaScarto, idDispositivo: idDispositivo, ricarica: ricarica, normalizza: normalizza,
    generazione: function () { load(); return generazione || ''; }, cambiateDopo: cambiateDopo,
    unisci: unisci, recuperi: recuperi, COME_UNIRE: COME_UNIRE, statoVuoto: statoVuoto,
    backup: backup, listBackups: listBackups, restoreBackup: restoreBackup,
    copieSenzaProprietario: copieSenzaProprietario, fileCopiaSenzaProprietario: fileCopiaSenzaProprietario, eliminaCopiaSenzaProprietario: eliminaCopiaSenzaProprietario, ricchezza: ricchezza,
    exportJson: exportJson, importJson: importJson, ripristinaStato: ripristinaStato, riprendiCopia: riprendiCopia,
    puntoDiRitorno: puntoDiRitorno, puntiDiRitorno: puntiDiRitorno,
    tornaAlPunto: tornaAlPunto, annullaRecord: annullaRecord, scordaPunti: scordaPunti,
    todayKey: todayKey, dayKey: dayKey, addDays: addDays, lastNDays: lastNDays,
    weekKey: weekKey, weekdayShort: weekdayShort, fmtShort: fmtShort, daysBetween: daysBetween,
    coloreArea: coloreArea,
    aggiungiAzione: aggiungiAzione, completaAzione: completaAzione, rimandaAzione: rimandaAzione,
    segnaMancata: segnaMancata, togliMancata: togliMancata, mancate: mancate,
    PERCHE_MANCATA: PERCHE_MANCATA, QUANTO_FATTO: QUANTO_FATTO,
    cattura: cattura, triageInbox: triageInbox, modificaInbox: modificaInbox, cambiaAreaAzione: cambiaAreaAzione,
    modificaAzione: modificaAzione, rimuoviAzione: rimuoviAzione, serveMit: serveMit,
    spostaAzione: spostaAzione, rimandaNonFatte: rimandaNonFatte, azioneInBacklog: azioneInBacklog,
    riunioniDaDecidere: riunioniDaDecidere, spostaStaccata: spostaStaccata, registraFantasmi: registraFantasmi,
    setOraAzione: setOraAzione, setDurataAzione: setDurataAzione, azioniDelGiorno: azioniDelGiorno,
    impostaRitmo: impostaRitmo, RITMO_DEFAULT: RITMO_DEFAULT,
    impostaChiedi: impostaChiedi, chiediQuando: chiediQuando, CHIEDI_DEFAULT: CHIEDI_DEFAULT,
    promemoria: promemoria, impostaPromemoria: impostaPromemoria, PROMEMORIA_DEFAULT: PROMEMORIA_DEFAULT,
    ritmoDi: ritmoDi, setRitmoGiorno: setRitmoGiorno, azzeraRitmoGiorno: azzeraRitmoGiorno, minutiSonno: minutiSonno,
    aggiungiBacklog: aggiungiBacklog, modificaBacklog: modificaBacklog, cambiaAreaBacklog: cambiaAreaBacklog,
    rimuoviBacklog: rimuoviBacklog, backlogInOggi: backlogInOggi, backlogPerArea: backlogPerArea,
    aggiungiPasso: aggiungiPasso, rimuoviPasso: rimuoviPasso, togglePasso: togglePasso,
    distribuisciPassi: distribuisciPassi, backlogInAbitudine: backlogInAbitudine, pianificaPasso: pianificaPasso,
    avanzamentoProgetto: avanzamentoProgetto, prossimoPassoInOggi: prossimoPassoInOggi,
    impostaScadenzaBacklog: impostaScadenzaBacklog,
    appuntaBacklog: appuntaBacklog, importanzaBacklog: importanzaBacklog,
    backlogPerImportanza: backlogPerImportanza, azioniDiBacklog: azioniDiBacklog,
    aggiungiAbitudine: aggiungiAbitudine, modificaAbitudine: modificaAbitudine, rimuoviAbitudine: rimuoviAbitudine,
    abitudinePrevista: abitudinePrevista, abitudiniDiOggi: abitudiniDiOggi, completaAbitudine: completaAbitudine, streakAbitudine: streakAbitudine,
    impostaPeriodoAbitudine: impostaPeriodoAbitudine, saltaGiornoAbitudine: saltaGiornoAbitudine,
    oraAbitudine: oraAbitudine, spostaAbitudineIlGiorno: spostaAbitudineIlGiorno,
    recordAbitudine: recordAbitudine, prossimaAbitudine: prossimaAbitudine,
    rinominaArea: rinominaArea, toggleArea: toggleArea,
    aggiungiArea: aggiungiArea, rimuoviArea: rimuoviArea, baselineCheckin: baselineCheckin,
    registraCheckin: registraCheckin, salvaPianoMattina: salvaPianoMattina,
    valutaArea: valutaArea, registraMinuti: registraMinuti, minutiDi: minutiDi, registraSessione: registraSessione, modificaSessione: modificaSessione, togliSessione: togliSessione, sessioniDi: sessioniDi,
    tutteLeReview: tutteLeReview, quanteReview: quanteReview,
    bilancio: bilancio, quanteFatte: quanteFatte, motiviMancate: motiviMancate,
    serieRiuscita: serieRiuscita,
    timerVivo: timerVivo, avviaTimerDati: avviaTimerDati, fermaTimerDati: fermaTimerDati, aggiornaTimerDati: aggiornaTimerDati,
    salvaReviewSera: salvaReviewSera, salvaReviewSettimana: salvaReviewSettimana,
    azioniDiOggi: azioniDiOggi, azioneAdesso: azioneAdesso,
    vociDiAdesso: vociDiAdesso,
    giornoAttivo: giornoAttivo, streak: streak,
    serieValutazioni: serieValutazioni, serieMinuti: serieMinuti, serieCheckin: serieCheckin,
    heatmapConsistenza: heatmapConsistenza,
    minutiSettimanaPerArea: minutiSettimanaPerArea, mediaValutazioneArea: mediaValutazioneArea,
    diario: diario, giorniConAttivita: giorniConAttivita, registra: registra,
    creaEsperimento: creaEsperimento, risultatiEsperimento: risultatiEsperimento,
    creaLegameEsperimento: creaLegameEsperimento,
    PRECISIONE: PRECISIONE, segnaVisto: segnaVisto,
    registraNotte: registraNotte, registraPasto: registraPasto,
    segnaChiesto: segnaChiesto, giaChiesto: giaChiesto,
    oraDelGiorno: oraDelGiorno, minutiDaOra: minutiDaOra,
    registraFatta: registraFatta,
    FORZE_LEZIONE: FORZE_LEZIONE, forzaLezione: forzaLezione, lezioni: lezioni,
    aggiungiLezione: aggiungiLezione, modificaLezione: modificaLezione,
    giraLezione: giraLezione, rimuoviLezione: rimuoviLezione, trovaLezione: trovaLezione,
    uid: uid
  };
}

/* IL LIVELLO DATI, UNA VOLTA SOLA. Non è una classe e non ha stato suo oltre
   a quello che sta in localStorage: è la stessa forma di prima, con un nome
   che si importa invece di trovarselo attaccato a `window`. */
export const LM = creaLM();
export type ApiLM = ReturnType<typeof creaLM>;

/* IL GLOBALE È UN PONTE, E HA UNA DATA DI SCADENZA.
   Finché ci sono pezzi non ancora passati che leggono `window.LM`, questa
   riga li tiene in piedi. Quando l'ultimo è passato, si toglie — e allora chi
   volesse leggere i dati da fuori non può più farlo per sbaglio. */
declare global {
  interface Window { LM: ApiLM }
}
window.LM = LM;
