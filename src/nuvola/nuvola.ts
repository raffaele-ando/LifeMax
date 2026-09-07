/* ============================================================
   LifeMax — sincronizzazione cloud (Firebase)
   Accesso con Google + salvataggio multi-dispositivo su Firestore.

   Progressive enhancement: se Firebase non si carica (offline, rete
   bloccata, script non raggiungibile) l'app continua a funzionare in
   locale su questo dispositivo. Nessun errore fatale.

   Modello di sincronizzazione: un solo documento per utente
   (users/{uid}) che contiene l'intero stato serializzato in JSON.
   Regola dei conflitti: non c'è un vincitore, si UNISCE — vedi il
   commento lungo in `primaSincronizzazione`. Un listener in tempo
   reale (onSnapshot) tiene allineati i dispositivi.
   ============================================================ */
import type { Stato } from '../tipi/stato';
import type {
  App, Auth, Db, Provider, Documento, DatiDocumento, ErroreFirebase,
  ModuloApp, ModuloAuth, ModuloFirestore, UtenteFirebase
} from './sdk';

const firebaseConfig = {
  apiKey: 'AIzaSyCDaZSbI1Emzz27QKKixn61Lmu60hrA2BM',
  authDomain: 'lifemax-9dc63.firebaseapp.com',
  projectId: 'lifemax-9dc63',
  storageBucket: 'lifemax-9dc63.firebasestorage.app',
  messagingSenderId: '168732828259',
  appId: '1:168732828259:web:de0fed5a8f807d9c2d0e56',
  measurementId: 'G-BBCW8VVENL'
};

const SDK = 'https://www.gstatic.com/firebasejs/12.16.0/';

/* ------------------------------------------------------- quello che si vede
   Le due forme che il resto dell'app legge da `window`. Erano oggetti
   costruiti a mano con `Object.assign`, e ogni punto che li leggeva doveva
   indovinare quali campi ci fossero. */
export interface Utente { uid: string; email: string; name: string; photo: string }

export interface StatoAuth {
  user: Utente | null;
  available: boolean;
  syncing: boolean;
  ascolto?: boolean;
}

/* Stato del salvataggio cloud:
     'idle'    nulla da salvare
     'saving'  scrittura in corso (breve)
     'saved'   confermato dal server
     'attesa'  scritto sul dispositivo, il server non ha ancora confermato
               (rete assente o lenta): Firestore mette la scrittura in coda e
               la promessa NON si risolve finché non torna la rete — senza
               questo stato la scritta restava "Sincronizzazione…" per sempre
     'muto'    online ma il server non conferma: quasi sempre Firestore non
               è attivo o le regole non sono pubblicate
     'error'   rifiutato (permessi, database non attivo…)                    */
export type StatoScrittura = 'idle' | 'saving' | 'saved' | 'attesa' | 'muto' | 'error';

export interface StatoSync {
  state: StatoScrittura;
  error: string;
  at: number;
  inCoda: boolean;
}

export interface CopiaNelCloud { id: string; ts: number; salvato: number; ricchezza: number }

export interface ApiCloud {
  available: boolean;
  signIn(): void | Promise<void>;
  signOut(): void | Promise<void>;
  backups?(): Promise<CopiaNelCloud[]>;
  riprendiBackup?(id: string): Promise<boolean>;
  sostituisciConBackup?(id: string): Promise<boolean>;
}

/* la risposta alla domanda sui dati di esempio: due parole e non un booleano,
   perché nel registro tecnico si legge quale delle due è stata scelta */
export type RispostaEsempio = 'unisci' | 'solo-cloud';

export interface DettaglioEsempio {
  qui: number;
  cloud: number;
  decidi(v: RispostaEsempio): void;
}

/* ------------------------------------------------------------- lo stato interno */
let AUTHM: ModuloAuth | null = null, FSM: ModuloFirestore | null = null;
let auth: Auth | null = null, db: Db | null = null, provider: Provider | null = null;
let currentUser: Utente | null = null;
let unsubDoc: (() => void) | null = null;
let applyingRemote = false;   /* stiamo scrivendo lo stato ricevuto dal cloud */
let lastWrittenAt = 0;        /* updatedAt dell'ultima nostra scrittura (evita l'eco) */
let ascoltoAttivo = false;    /* il listener degli altri dispositivi è vivo? */
let riprovaTimer: ReturnType<typeof setTimeout> | null = null;
let attesaRiprova = 0;        /* quanto aspettare la prossima volta */
let cadute = 0;               /* quante volte è caduto in questa sessione */
let pushTimer: ReturnType<typeof setTimeout> | undefined;
let pushInCorso = false;      /* una setDoc è già in volo */
let pushPendente = false;     /* sono arrivate modifiche mentre scrivevamo */

/* `AUTHM` non lo legge nessuno tranne l'inizializzazione: sta lì perché era
   così anche prima, e perché tenerlo dice a chi legge che il modulo di
   autenticazione è stato caricato. */
void AUTHM;

function log(liv: 'info' | 'avviso' | 'errore', msg: string, dati?: unknown): void {
  if (window.LMLog) window.LMLog.add(liv, 'cloud', msg, dati);
}

function emitAuth(extra?: Partial<StatoAuth>): void {
  window.LM_AUTH = Object.assign(
    { user: currentUser, available: true, syncing: false, ascolto: ascoltoAttivo } as StatoAuth,
    extra || {}
  );
  window.dispatchEvent(new CustomEvent('lm:auth'));
}

function emitUnavailable(): void {
  window.LM_AUTH = { user: null, available: false, syncing: false };
  window.LMCloud = { available: false, signIn: function () {}, signOut: function () {} };
  window.dispatchEvent(new CustomEvent('lm:auth'));
}

function emitSync(state: StatoScrittura, error?: string): void {
  const prec = window.LM_SYNC;
  if (prec && prec.state === state && (prec.error || '') === (error || '')) return; /* niente rumore inutile */
  const at = (state === 'saved') ? Date.now() : (prec && prec.at) || 0;
  window.LM_SYNC = { state: state, error: error || '', at: at, inCoda: state === 'attesa' };
  window.dispatchEvent(new CustomEvent('lm:sync', { detail: window.LM_SYNC }));
}

/* --- una sola clessidra per tutte le operazioni cloud ---
   Prima ogni push apriva i propri timer e ri-emetteva 'saving': con
   più operazioni sovrapposte (o una lettura iniziale che non torna
   mai) lo stato restava "Salvataggio…" per sempre. Ora le operazioni
   si contano: 'saving' si emette solo alla prima, l'esito solo quando
   l'ultima si chiude. Nessuna operazione può restare senza esito. */
const ATTESA_MS = 6000;    /* oltre questo, diciamo che è in coda */
const MUTO_MS = 25000;     /* se siamo ONLINE e ancora niente, non è la rete */

let opAperte = 0;
let tAttesa: ReturnType<typeof setTimeout> | null = null;
let tMuto: ReturnType<typeof setTimeout> | null = null;

function opInizio(che: string): void {
  opAperte++;
  log('info', 'operazione avviata: ' + che, 'in corso: ' + opAperte);
  if (opAperte > 1) return;
  emitSync('saving');
  if (tAttesa) return;   /* una clessidra è già in corsa: non ripartire da zero */
  /* Se il server non risponde entro qualche secondo NON restiamo appesi a
     "Salvataggio…": diciamo che è salvato qui e in coda per il cloud.
     La scrittura resta viva: quando il server conferma, passiamo a 'saved'. */
  tAttesa = setTimeout(function () {
    log('avviso', 'il cloud non ha ancora confermato dopo ' + (ATTESA_MS / 1000) + 's', 'online: ' + navigator.onLine);
    emitSync('attesa');
  }, ATTESA_MS);
  /* Due situazioni molto diverse per la sicurezza dei dati: senza rete è
     tutto normale (la coda si svuoterà), ma se siamo online e il server non
     risponde comunque, il problema è la configurazione del cloud e va detto
     — altrimenti l'utente crede di avere un backup che non ha. */
  tMuto = setTimeout(function () {
    if (!navigator.onLine) return;
    log('errore', 'cloud muto: online da ' + (MUTO_MS / 1000) + 's senza risposta');
    emitSync('muto', 'Il cloud non risponde pur essendoci rete: controlla che Firestore sia attivo e che le regole siano pubblicate. Per ora i dati restano su questo dispositivo.');
  }, MUTO_MS);
}

function opFine(che: string, stato: StatoScrittura, error?: string): void {
  opAperte = Math.max(0, opAperte - 1);
  log(stato === 'saved' ? 'info' : 'errore', 'operazione conclusa: ' + che + ' → ' + stato, error || '');
  if (opAperte > 0) return;      /* c'è ancora qualcosa in volo: l'esito lo darà l'ultima */
  if (tAttesa) clearTimeout(tAttesa);
  if (tMuto) clearTimeout(tMuto);
  tAttesa = tMuto = null;
  emitSync(stato, error);
}

/* L'operazione finisce ma l'esito non è ancora deciso: subito dopo ne parte
   un'altra (tipico: la lettura iniziale che sfocia in una scrittura). La
   clessidra resta in corsa e lo stato lo darà quella, così non si vede un
   "Salvato" lampeggiare in mezzo a un salvataggio ancora aperto. */
function opCede(che: string, a: string): void {
  opAperte = Math.max(0, opAperte - 1);
  log('info', che + ' → prosegue con: ' + a);
}

/* --------------------------------------------------------------- l'avvio */
void (async function init() {
  try {
    /* `@vite-ignore`: l'indirizzo è composto a runtime e sta su gstatic, non
       nel pacco. Senza questa nota Vite prova ad analizzarlo e avvisa a ogni
       build di una cosa che è voluta. */
    const [appMod, authMod, fsMod] = await Promise.all([
      import(/* @vite-ignore */ SDK + 'firebase-app.js') as Promise<ModuloApp>,
      import(/* @vite-ignore */ SDK + 'firebase-auth.js') as Promise<ModuloAuth>,
      import(/* @vite-ignore */ SDK + 'firebase-firestore.js') as Promise<ModuloFirestore>
    ]);
    AUTHM = authMod; FSM = fsMod;
    log('info', 'SDK Firebase caricato');

    const app: App = appMod.initializeApp(firebaseConfig);
    const autenticazione = authMod.getAuth(app);
    auth = autenticazione;
    /* IL CANALE LUNGO, DICHIARATO INVECE CHE SPERATO.
       `WebChannelConnection RPC 'Listen' stream transport errored` è la firma
       di una rete che non digerisce lo streaming: dati mobili che cambiano
       cella, un proxy, una VPN, certe reti aziendali. La cura documentata è
       lasciare che Firestore si accorga da sé e ripieghi sul «long polling»,
       che è più lento ma passa dappertutto.
       Nelle versioni recenti dell'SDK questo riconoscimento è già acceso di
       suo, quindi molto probabilmente questa riga non cambia niente OGGI.
       Vale la pena scriverla lo stesso per una ragione sola: così è una scelta
       nostra e non un valore predefinito che può cambiare sotto i piedi con
       l'aggiornamento di una libreria. Se il nome dell'opzione non esiste più,
       si ripiega sul modo normale invece di far cadere tutto il cloud. */
    try {
      /* NIENTE `localCache`, ED È UNA SCELTA.
         Firestore sa tenersi una cache persistente su IndexedDB
         (`persistentLocalCache`) che mette in coda le scritture fatte offline
         e le manda quando la rete torna. Qui non si usa, e non è una
         dimenticanza: LifeMax quella coda ce l'ha già. Lo stato vero sta in
         localStorage, la fusione la fa `COME_UNIRE` in `dati.ts` con le sue
         lapidi per le cancellazioni, e quel pezzo è costato un bug vero — le
         cose cancellate che tornavano vive.
         Accendere la cache di Firestore vorrebbe dire avere DUE code offline
         che riconciliano gli stessi dati, ognuna con le sue regole. Verificato
         sulla documentazione del v12: l'API è quella giusta e non è
         deprecata; è il nostro caso che non la vuole. */
      db = fsMod.initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
      log('info', 'Firestore avviato', 'riconoscimento automatico del canale lungo attivo');
    } catch (e) {
      db = fsMod.getFirestore(app);
      log('avviso', 'Firestore avviato nel modo normale', messaggio(e));
    }
    const prov = new authMod.GoogleAuthProvider();
    prov.setCustomParameters({ prompt: 'select_account' });
    provider = prov;

    try { await authMod.setPersistence(autenticazione, authMod.browserLocalPersistence); } catch { /* ignora */ }

    window.LMCloud = {
      available: true,
      signIn: async function () {
        try {
          await authMod.signInWithPopup(autenticazione, prov);
        } catch (e) {
          /* popup bloccato o chiuso: ripiega sul redirect */
          const codice = (e as ErroreFirebase | null)?.code;
          if (codice && /popup|cancelled|blocked/i.test(codice)) {
            try { await authMod.signInWithRedirect(autenticazione, prov); } catch { /* ignora */ }
          } else {
            console.warn('LifeMax: accesso non riuscito.', messaggio(e));
          }
        }
      },
      signOut: async function () {
        try { await authMod.signOut(autenticazione); } catch { /* ignora */ }
      },
      /* LE COPIE CHE STANNO NEL CLOUD, per poterle guardare e riprendere.
         Ogni volta che il documento remoto sta per essere toccato ne viene
         messa da parte una copia in `users/{uid}/backups/{ts}` — succede da
         mesi, e finora nessuno poteva vederle: erano una rete di sicurezza
         invisibile, cioè metà rete. Quando i dati sono spariti da un
         dispositivo e da lì sono saliti, la copia buona è ESATTAMENTE là. */
      backups: async function () {
        if (!currentUser || !db) return [];
        try {
          const q = await fsMod.getDocs(fsMod.collection(db, 'users', currentUser.uid, 'backups'));
          const out: CopiaNelCloud[] = [];
          q.forEach(function (d) {
            const v = d.data() || {};
            let ricchezza = 0;
            try { ricchezza = window.LM.ricchezza(JSON.parse(v.data || 'null')); } catch { ricchezza = 0; }
            out.push({ id: d.id, ts: v.updatedAt || +d.id || 0, salvato: v.salvato || 0, ricchezza: ricchezza });
          });
          return out.sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });
        } catch (e) {
          log('errore', 'non riesco a leggere le copie nel cloud', messaggio(e));
          return [];
        }
      },
      /* riprende una copia dal cloud. Non sostituisce: UNISCE, come tutto il
         resto — chi va a ripescare una copia vuole riavere quello che manca,
         non buttare via quello che nel frattempo ha fatto. */
      riprendiBackup: async function (id: string) { return daBackup(id, false); },
      /* RIPRENDERE AGGIUNGE, SOSTITUIRE RIFÀ DA CAPO.
         «Riprendi» unisce, ed è quello che serve quasi sempre: una copia è un
         pezzo della stessa vita, e buttare il resto sarebbe una perdita.
         Ma c'è un caso in cui unire è esattamente il problema: quando quello
         che c'è adesso NON è tuo. I dati di esempio finiti nell'account a un
         accesso sono il caso vero — da lì non si torna indietro unendo, e
         finché questa via non è esistita non si tornava indietro affatto:
         la fusione aggiunge, l'importazione aggiunge, «riprendi» aggiunge, e
         l'unica cosa che sostituisce valeva solo per le copie di questo
         dispositivo, che quei dati di esempio ce li avevano già dentro.
         Prima di rifare si mette da parte una copia locale: sostituire è la
         sola cosa qui che TOGLIE, e deve avere una strada per tornare. */
      sostituisciConBackup: async function (id: string) { return daBackup(id, true); }
    };

    log('info', 'cloud pronto', 'progetto ' + firebaseConfig.projectId);

    /* completa un eventuale accesso via redirect */
    try { await authMod.getRedirectResult(autenticazione); } catch (e) { log('avviso', 'esito del redirect di accesso non recuperato', messaggio(e)); }

    authMod.onAuthStateChanged(autenticazione, async function (u: UtenteFirebase | null) {
      if (unsubDoc) { unsubDoc(); unsubDoc = null; }
      if (u) {
        currentUser = { uid: u.uid, email: u.email || '', name: u.displayName || '', photo: u.photoURL || '' };
        log('info', 'accesso riscontrato, avvio la prima sincronizzazione', 'uid ' + u.uid.slice(0, 6) + '…');
        emitAuth({ syncing: true });
        await primaSincronizzazione(u.uid);
        /* ascolta i cambiamenti dagli altri dispositivi, e riattaccalo se cade */
        ascolta(u.uid);
        emitAuth({ syncing: false });
      } else {
        currentUser = null;
        ascoltoAttivo = false;
        if (riprovaTimer) { clearTimeout(riprovaTimer); riprovaTimer = null; }
        attesaRiprova = 0;
        log('info', 'nessun account connesso: i dati restano su questo dispositivo');
        emitAuth();
        emitSync('idle');
      }
    });

    /* ogni modifica locale viene salvata sul cloud (con debounce) */
    document.addEventListener('lm:change', function () {
      if (currentUser && !applyingRemote) programmaPush();
    });

  } catch (e) {
    console.warn('LifeMax: cloud non disponibile, uso solo questo dispositivo.', messaggio(e));
    log('errore', 'SDK Firebase non caricato: si lavora solo in locale', messaggio(e));
    emitUnavailable();
  }
})();

function messaggio(e: unknown): string {
  if (e instanceof Error) return e.message;
  const f = e as ErroreFirebase | null;
  return (f && (f.message || f.code)) || '';
}

async function primaSincronizzazione(uid: string): Promise<void> {
  if (!FSM || !db) return;
  const fs = FSM, base = db;
  const ref = fs.doc(base, 'users', uid);
  let snap: Documento;
  opInizio('lettura iniziale');
  try {
    snap = await fs.getDoc(ref);
    /* La lettura è andata: da qui in poi l'esito lo decide il ramo scelto.
       Prima questa funzione poteva terminare senza mai chiudere lo stato, e
       la scritta "Salvataggio…" restava lì per sempre. */
    log('info', 'lettura iniziale completata', snap.exists() ? 'documento presente' : 'nessun documento nel cloud');
  } catch (e) {
    opFine('lettura iniziale', 'error', erroreLeggibile(e));
    console.warn('LifeMax: lettura cloud non riuscita.', messaggio(e));
    return;
  }
  const locale = window.LM.snapshot();
  const localAt = locale.updatedAt || 0;
  const localR = window.LM.ricchezza(locale);
  const dati = snap.data();

  if (snap.exists() && dati && dati.data) {
    const remObj = parseDoc(dati);
    const remoteR = window.LM.ricchezza(remObj);
    const remoteAt = dati.updatedAt || 0;
    log('info', 'confronto', 'qui ' + localR + ' elementi (' + quando(localAt) + ') · cloud ' + remoteR + ' elementi (' + quando(remoteAt) + ')');

    /* NON SI SCEGLIE PIÙ UN VINCITORE: SI UNISCE.
       Qui c'erano quattro rami e tre di questi ADOTTAVANO un documento intero,
       buttando via l'altro. L'unica protezione era «non adottare mai il vuoto»,
       e non bastava: basta che una copia sia più povera in UN punto — un
       telefono con zero scoperte perché sono nate mentre lui era offline — e
       alla prima cosa fatta su quel telefono il suo documento diventa il più
       recente, sale, e le scoperte spariscono da tutte le parti. Il conto
       totale restava alto, quindi la protezione contro il vuoto non scattava.
       È così che il registro delle Scoperte si è svuotato.
       `LM.unisci` tiene tutto quello che c'è da una parte sola e lascia
       decidere al più recente solo dove le due dicono cose diverse sulla
       STESSA riga. Poi si rimanda su il risultato, così anche il cloud ha
       tutto. La copia del documento remoto si prende lo stesso, prima di
       toccarlo: se anche la fusione sbagliasse, quello che c'era è ancora là. */
    /* L'ESEMPIO NON ENTRA SENZA CHIEDERE. Unire è la regola e resta la
       regola; ma i dati di esempio non sono «un pezzo della stessa vita»,
       sono inventati — e una volta uniti non c'è più una strada per toglierli.
       Lo stato di esempio si riconosce da sé (`demo`), e allora si domanda.
       Non si decide al posto suo: chi ha caricato l'esempio può averci
       lavorato sopra per settimane, e l'app non ha modo di saperlo. */
    let sostituendo = false;
    if (locale.demo && remoteR > 0) {
      log('info', 'qui ci sono i dati di esempio e nel cloud ce ne sono di veri: chiedo prima di unire');
      sostituendo = (await chiediDellEsempio(localR, remoteR)) === 'solo-cloud';
      log('info', 'risposto', sostituendo ? 'tieni solo quelli del cloud' : 'unisci lo stesso');
    }
    await backupRemoto(uid, dati);
    window.LM.backup(sostituendo ? 'prima-di-togliere-i-dati-di-esempio' : 'prima-di-unire-col-cloud');
    applicaRemoto(dati, false, sostituendo);
    const dopo = window.LM.ricchezza(window.LM.snapshot());
    log('info', sostituendo ? 'tenuti quelli del cloud' : 'uniti', 'adesso ' + dopo + ' elementi (erano ' + localR + ' qui e ' + remoteR + ' nel cloud)');
    opCede('lettura iniziale', 'scrittura');
    await push(uid);
  } else {
    /* Nessun documento cloud: carica ciò che c'è in locale. */
    log('info', 'primo salvataggio per questo account');
    opCede('lettura iniziale', 'scrittura');
    await push(uid);
  }
}

/* La domanda la fa l'app, non questo file: qui non c'è niente che sappia
   disegnare. Si manda l'evento e si aspetta la risposta.
   E c'è un salvagente: se non risponde nessuno — l'app non è ancora in piedi,
   o è una versione che questa domanda non la conosce — dopo venti secondi si
   UNISCE, che è la scelta che non toglie niente. Una sincronizzazione appesa
   per sempre in attesa di una risposta che non arriva è peggio del problema
   che stiamo evitando: è già successo una volta, con «Salvataggio…» che
   restava lì per sempre. */
function chiediDellEsempio(qui: number, cloud: number): Promise<RispostaEsempio> {
  return new Promise(function (risolvi) {
    let risposto = false;
    const una = function (v: RispostaEsempio) { if (risposto) return; risposto = true; risolvi(v); };
    const salvagente = setTimeout(function () {
      log('avviso', 'nessuna risposta sulla domanda dell’esempio: unisco', 'passati 20 secondi');
      una('unisci');
    }, 20000);
    const dettaglio: DettaglioEsempio = {
      qui: qui, cloud: cloud,
      decidi: function (v: RispostaEsempio) { clearTimeout(salvagente); una(v); }
    };
    window.dispatchEvent(new CustomEvent('lm:esempio-al-cloud', { detail: dettaglio }));
  });
}

/* una copia dal cloud, unita o messa al posto di tutto. Le due strade
   condividono tutto tranne una parola, e tenerle separate voleva dire due
   posti dove sbagliare il salvataggio di sicurezza. */
async function daBackup(id: string, sostituisci: boolean): Promise<boolean> {
  if (!currentUser || !FSM || !db) return false;
  try {
    const d = await FSM.getDoc(FSM.doc(db, 'users', currentUser.uid, 'backups', String(id)));
    const dati = d.data();
    if (!d.exists() || !dati) return false;
    window.LM.backup(sostituisci ? 'prima-di-sostituire-con-una-copia-dal-cloud' : 'prima-di-riprendere-una-copia-dal-cloud');
    applicaRemoto(dati, false, sostituisci);
    await push(currentUser.uid);
    return true;
  } catch (e) {
    log('errore', sostituisci ? 'non riesco a sostituire con la copia' : 'non riesco a riprendere la copia', messaggio(e));
    return false;
  }
}

function quando(t: number): string {
  return t ? new Date(t).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'mai';
}

/* Copia il documento cloud esistente in una sotto-collezione di backup
   prima di sovrascriverlo: users/{uid}/backups/{timestamp}. */
async function backupRemoto(uid: string, docData: DatiDocumento): Promise<void> {
  if (!FSM || !db) return;
  /* SENZA `data` NON C'È NIENTE DA METTERE DA PARTE, e Firestore rifiuta un
     campo `undefined`: una copia di sicurezza che va in errore proprio nel
     momento in cui serve è peggio di nessuna copia. Chi chiama ha già
     guardato che ci sia — questo è il controllo che lo dice. */
  if (docData.data === undefined) {
    log('avviso', 'niente copia del documento remoto: era senza dati');
    return;
  }
  try {
    const ts = String(docData.updatedAt || Date.now());
    await FSM.setDoc(FSM.doc(db, 'users', uid, 'backups', ts), {
      data: docData.data, updatedAt: docData.updatedAt || 0, salvato: Date.now()
    });
  } catch (e) { console.warn('LifeMax: backup cloud non riuscito.', messaggio(e)); }
}

function parseDoc(d: DatiDocumento): unknown {
  try { return JSON.parse(d.data || 'null'); } catch { return null; }
}

function applicaRemoto(d: DatiDocumento, notifica: boolean, sostituisci?: boolean): void {
  const obj = parseDoc(d);
  if (!obj) return;
  const prima = window.LM.ricchezza(window.LM.snapshot());
  log('info', (sostituisci ? 'sostituisco con i dati' : 'unisco i dati ') + (notifica ? ' arrivati da un altro dispositivo' : ' del cloud'), window.LM.ricchezza(obj) + ' elementi');
  if (notifica) window.LM.backup('prima-di-aggiornamento-da-altro-dispositivo');
  applyingRemote = true;
  lastWrittenAt = d.updatedAt || (obj as Partial<Stato>).updatedAt || 0;
  /* arrivano dati da un altro dispositivo: i punti a cui tornare parlavano di
     una storia diversa e tornarci mescolerebbe due timeline */
  if (window.LM.scordaPunti) window.LM.scordaPunti();
  /* si UNISCE, non si sostituisce: vedi il commento lungo in
     primaSincronizzazione, e LM.unisci in src/dati/dati.ts. L'unica eccezione
     è `sostituisci`, che si chiede a mano da «Backup e ripristino» quando
     quello che c'è adesso non è roba tua. */
  window.LM.hydrate(obj, !!sostituisci);
  applyingRemote = false;
  const dopo = window.LM.ricchezza(window.LM.snapshot());
  if (!sostituisci && dopo < prima) {
    /* non deve poter succedere: la fusione toglie solo dove c'è una lapide o
       un azzeramento dichiarato. Se succede lo stesso, si grida — e la copia
       di sicurezza presa qui sopra è la via di uscita. */
    log('errore', 'dopo la fusione ci sono MENO elementi di prima', prima + ' → ' + dopo);
  }
  if (notifica) window.dispatchEvent(new CustomEvent('lm:remote'));
}

let ultimaPartenza = 0;
function programmaPush(): void {
  clearTimeout(pushTimer);
  /* ADHD: si tocca tanto e in fretta. Un debounce raccoglie la raffica in
     una sola scrittura invece di bombardare il server (e la batteria).

     Ma l'attesa serve SOLO dentro una raffica. Un gesto isolato — far
     partire un timer, spuntare una cosa — aspettava sette decimi di secondo
     per niente, e quei sette decimi si sommano alla rete e al giro
     dell'altro dispositivo: da fuori sembra che il sito ci pensi su. Se
     l'ultima scrittura è vecchia di più di due secondi, questa è la prima di
     una raffica che forse non ci sarà: parte subito, e se poi la raffica
     arriva davvero le successive tornano ad aspettare. */
  const soli = Date.now() - ultimaPartenza > 2000;
  pushTimer = setTimeout(function () {
    ultimaPartenza = Date.now();
    if (currentUser) void push(currentUser.uid);
  }, soli ? 0 : 700);
}

/* Le scritture non si sovrappongono: Firestore non garantisce l'ordine di
   due setDoc in volo, e due push concorrenti facevano rimbalzare lo stato.
   Se arrivano modifiche mentre scriviamo, ne teniamo nota e rifacciamo il
   giro subito dopo con lo stato più fresco. */
async function push(uid: string): Promise<void> {
  if (!FSM || !db) return;
  if (pushInCorso) { pushPendente = true; log('info', 'scrittura già in volo: accodo le nuove modifiche'); return; }
  pushInCorso = true;
  const s = window.LM.snapshot();
  const at = s.updatedAt || Date.now();
  const payload = JSON.stringify(s);
  lastWrittenAt = at;
  opInizio('scrittura');
  log('info', 'scrivo nel cloud', Math.round(payload.length / 1024) + ' KB · updatedAt ' + new Date(at).toLocaleTimeString('it-IT'));
  try {
    await FSM.setDoc(FSM.doc(db, 'users', uid), {
      data: payload,
      updatedAt: at,
      email: currentUser ? currentUser.email : '',
      name: currentUser ? currentUser.name : ''
    });
    opFine('scrittura', 'saved');
  } catch (e) {
    opFine('scrittura', 'error', erroreLeggibile(e));
    console.warn('LifeMax: salvataggio sul cloud non riuscito.', messaggio(e));
  } finally {
    pushInCorso = false;
  }
  if (pushPendente) { pushPendente = false; return push(uid); }
}

/* ==================================================================
   L'ASCOLTO DEGLI ALTRI DISPOSITIVI, E COSA SUCCEDE QUANDO CADE
   ==================================================================
   Nei registri comparivano righe come:
     WebChannelConnection RPC 'Listen' stream 0x... transport errored
   Quel messaggio da solo è quasi sempre rumore: è Firestore che dice «il
   canale si è rotto» e se lo ripara da sé — succede a ogni passaggio fra wifi
   e dati, a ogni galleria, a ogni proxy che non digerisce lo streaming. Ma
   guardando come l'app lo trattava è saltato fuori un guasto vero.

   `onSnapshot` prende due funzioni: una per i dati, una per gli errori. Quella
   degli errori NON è una notifica di un intoppo passeggero: quando viene
   chiamata, l'ascolto è FINITO e Firestore non lo riattacca. Qui dentro
   faceva `console.warn` e basta. Cioè: al primo errore che arrivava fin lì,
   questo dispositivo smetteva di ricevere qualunque cosa dagli altri per
   tutto il resto della sessione — in silenzio, senza che niente cambiasse
   sullo schermo, finché non si ricaricava la pagina. E un dispositivo sordo è
   un dispositivo che si allontana dagli altri: è la condizione da cui è nata
   la sparizione delle Scoperte.

   Adesso: quando cade lo si dice (nel Registro tecnico, non solo in una
   console che sul telefono non esiste), si riattacca da sé con attese che
   raddoppiano fino a un minuto, e si riprova SUBITO quando torna la rete o
   quando si torna sull'app — che sono i due momenti in cui ha davvero senso. */
function ascolta(uid: string): void {
  if (!FSM || !db) return;
  const fs = FSM, base = db;
  if (unsubDoc) { try { unsubDoc(); } catch { /* niente */ } unsubDoc = null; }
  if (riprovaTimer) { clearTimeout(riprovaTimer); riprovaTimer = null; }
  try {
    unsubDoc = fs.onSnapshot(fs.doc(base, 'users', uid), function (snap) {
      /* L'ATTESA RIPARTE DA ZERO SOLO QUANDO ARRIVA QUALCOSA DAVVERO.
         Prima ripartiva appena `onSnapshot` tornava senza lamentarsi — ma
         quello vuol dire soltanto «ho registrato l'ascolto», non «il canale
         funziona». Con un server irraggiungibile il giro diventava:
         attacco, errore, due secondi, attacco, errore, due secondi… per
         sempre, ogni due secondi, senza mai rallentare. Cioè il contrario di
         quello che l'attesa che raddoppia serve a fare, e su dati mobili è un
         modo eccellente di consumare la batteria.
         Un dato ricevuto è l'unica prova che il canale è vivo. */
      attesaRiprova = 0;
      if (!ascoltoAttivo) { ascoltoAttivo = true; emitAuth(); }
      if (!snap.exists()) return;
      const d = snap.data();
      if (!d) return;
      if (typeof d.updatedAt === 'number' && d.updatedAt === lastWrittenAt) return; /* nostra scrittura */
      applicaRemoto(d, true);
    }, function (err) {
      ascoltoAttivo = false;
      unsubDoc = null;
      cadute++;
      log('errore', 'l’ascolto degli altri dispositivi si è interrotto (' + cadute + 'ª volta)',
        (err && err.code ? err.code + ' · ' : '') + ((err && err.message) || ''));
      emitAuth();
      riattacca(uid);
    });
    ascoltoAttivo = true;
    log('info', 'ascolto in tempo reale attivo');
    emitAuth();
  } catch (e) {
    ascoltoAttivo = false;
    log('errore', 'non riesco a mettermi in ascolto', messaggio(e));
    emitAuth();
    riattacca(uid);
  }
}

function riattacca(uid: string): void {
  if (riprovaTimer) return;
  /* si raddoppia fino a un minuto: se la rete è via per un'ora non ha senso
     bussare ogni due secondi, e se è un intoppo di un attimo si riprende
     subito */
  attesaRiprova = attesaRiprova ? Math.min(attesaRiprova * 2, 60000) : 2000;
  log('avviso', 'riprovo a mettermi in ascolto fra ' + Math.round(attesaRiprova / 1000) + ' secondi');
  riprovaTimer = setTimeout(function () {
    riprovaTimer = null;
    if (currentUser && currentUser.uid === uid) ascolta(uid);
  }, attesaRiprova);
}

/* i due momenti in cui vale la pena riprovare subito invece di aspettare */
function riprovaSubito(perche: string): void {
  if (!currentUser || ascoltoAttivo) return;
  log('info', 'riprovo l’ascolto subito: ' + perche);
  attesaRiprova = 0;
  ascolta(currentUser.uid);
}
document.addEventListener('visibilitychange', function () {
  if (!document.hidden) riprovaSubito('sei tornato sull’app');
});

/* rete che va e viene: appena torna, riprova subito e aggiorna lo stato */
window.addEventListener('offline', function () {
  if (currentUser) emitSync('attesa');
});
window.addEventListener('online', function () {
  if (currentUser) { log('info', 'rete tornata: riprovo il salvataggio'); programmaPush(); }
  riprovaSubito('è tornata la rete');
});

/* traduce i codici d'errore Firestore più comuni in messaggi utili */
function erroreLeggibile(e: unknown): string {
  const code = messaggio(e) || ((e as ErroreFirebase | null)?.code || '');
  if (/permission-denied|insufficient/i.test(code)) return 'Permessi Firestore negati: pubblica le regole di sicurezza.';
  if (/unavailable|not-found|Cloud Firestore API|database/i.test(code)) return 'Database Firestore non raggiungibile: attivalo nella console Firebase.';
  if (/unauthenticated/i.test(code)) return 'Sessione scaduta: riprova ad accedere.';
  return 'Salvataggio non riuscito. Controlla la configurazione di Firestore.';
}

/* `auth` e `provider` restano a livello di modulo come prima: non li legge
   nessun altro, ma tenerli è la differenza fra «l'SDK è avviato» e «l'SDK è
   avviato e ce l'abbiamo ancora in mano». */
void auth; void provider;
