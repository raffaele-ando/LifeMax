/* ============================================================
   LifeMax — sincronizzazione cloud (Firebase)
   Accesso con Google + salvataggio multi-dispositivo su Firestore.

   Progressive enhancement: se Firebase non si carica (offline, rete
   bloccata, script non raggiungibile) l'app continua a funzionare in
   locale su questo dispositivo. Nessun errore fatale.

   Modello di sincronizzazione: un solo documento per utente
   (users/{uid}) che contiene l'intero stato serializzato in JSON.
   Regola dei conflitti: l'ultima modifica vince (updatedAt). Un
   listener in tempo reale (onSnapshot) tiene allineati i dispositivi.
   ============================================================ */

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

let AUTHM = null, FSM = null, auth = null, db = null, provider = null;
let currentUser = null;
let unsubDoc = null;
let applyingRemote = false;   // stiamo scrivendo lo stato ricevuto dal cloud
let lastWrittenAt = 0;        // updatedAt dell'ultima nostra scrittura (evita l'eco)
let ascoltoAttivo = false;    // il listener degli altri dispositivi è vivo?
let riprovaTimer = null;      // quando riprovare ad attaccarlo
let attesaRiprova = 0;        // quanto aspettare la prossima volta
let cadute = 0;               // quante volte è caduto in questa sessione
let pushTimer = null;
let pushInCorso = false;      // una setDoc è già in volo
let pushPendente = false;     // sono arrivate modifiche mentre scrivevamo

function log(liv, msg, dati) {
  if (window.LMLog) window.LMLog.add(liv, 'cloud', msg, dati);
}

function emitAuth(extra) {
  window.LM_AUTH = Object.assign({ user: currentUser, available: true, syncing: false, ascolto: ascoltoAttivo }, extra || {});
  window.dispatchEvent(new CustomEvent('lm:auth'));
}

function emitUnavailable() {
  window.LM_AUTH = { user: null, available: false, syncing: false };
  window.LMCloud = { available: false, signIn: function () {}, signOut: function () {} };
  window.dispatchEvent(new CustomEvent('lm:auth'));
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
function emitSync(state, error) {
  var prec = window.LM_SYNC || {};
  if (prec.state === state && (prec.error || '') === (error || '')) return; // niente rumore inutile
  var at = (state === 'saved') ? Date.now() : prec.at || 0;
  window.LM_SYNC = { state: state, error: error || '', at: at, inCoda: state === 'attesa' };
  window.dispatchEvent(new CustomEvent('lm:sync', { detail: window.LM_SYNC }));
}

/* --- una sola clessidra per tutte le operazioni cloud ---
   Prima ogni push apriva i propri timer e ri-emetteva 'saving': con
   più operazioni sovrapposte (o una lettura iniziale che non torna
   mai) lo stato restava "Salvataggio…" per sempre. Ora le operazioni
   si contano: 'saving' si emette solo alla prima, l'esito solo quando
   l'ultima si chiude. Nessuna operazione può restare senza esito. */
const ATTESA_MS = 6000;    // oltre questo, diciamo che è in coda
const MUTO_MS = 25000;    // se siamo ONLINE e ancora niente, non è la rete

let opAperte = 0, tAttesa = null, tMuto = null;

function opInizio(che) {
  opAperte++;
  log('info', 'operazione avviata: ' + che, 'in corso: ' + opAperte);
  if (opAperte > 1) return;
  emitSync('saving');
  if (tAttesa) return;   // una clessidra è già in corsa: non ripartire da zero
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

function opFine(che, stato, error) {
  opAperte = Math.max(0, opAperte - 1);
  log(stato === 'saved' ? 'info' : 'errore', 'operazione conclusa: ' + che + ' → ' + stato, error || '');
  if (opAperte > 0) return;      // c'è ancora qualcosa in volo: l'esito lo darà l'ultima
  clearTimeout(tAttesa); clearTimeout(tMuto);
  tAttesa = tMuto = null;
  emitSync(stato, error);
}

/* L'operazione finisce ma l'esito non è ancora deciso: subito dopo ne parte
   un'altra (tipico: la lettura iniziale che sfocia in una scrittura). La
   clessidra resta in corsa e lo stato lo darà quella, così non si vede un
   "Salvato" lampeggiare in mezzo a un salvataggio ancora aperto. */
function opCede(che, a) {
  opAperte = Math.max(0, opAperte - 1);
  log('info', che + ' → prosegue con: ' + a);
}

(async function init() {
  try {
    const [appMod, authMod, fsMod] = await Promise.all([
      import(SDK + 'firebase-app.js'),
      import(SDK + 'firebase-auth.js'),
      import(SDK + 'firebase-firestore.js')
    ]);
    AUTHM = authMod; FSM = fsMod;
    log('info', 'SDK Firebase caricato');

    const app = appMod.initializeApp(firebaseConfig);
    auth = authMod.getAuth(app);
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
      db = fsMod.initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
      log('info', 'Firestore avviato', 'riconoscimento automatico del canale lungo attivo');
    } catch (e) {
      db = fsMod.getFirestore(app);
      log('avviso', 'Firestore avviato nel modo normale', e && e.message);
    }
    provider = new authMod.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try { await authMod.setPersistence(auth, authMod.browserLocalPersistence); } catch (e) { /* ignora */ }

    window.LMCloud = {
      available: true,
      signIn: async function () {
        try {
          await authMod.signInWithPopup(auth, provider);
        } catch (e) {
          // popup bloccato o chiuso: ripiega sul redirect
          if (e && e.code && /popup|cancelled|blocked/i.test(e.code)) {
            try { await authMod.signInWithRedirect(auth, provider); } catch (_) { /* ignora */ }
          } else {
            console.warn('LifeMax: accesso non riuscito.', e && e.message);
          }
        }
      },
      signOut: async function () {
        try { await authMod.signOut(auth); } catch (e) { /* ignora */ }
      },
      /* LE COPIE CHE STANNO NEL CLOUD, per poterle guardare e riprendere.
         Ogni volta che il documento remoto sta per essere toccato ne viene
         messa da parte una copia in `users/{uid}/backups/{ts}` — succede da
         mesi, e finora nessuno poteva vederle: erano una rete di sicurezza
         invisibile, cioè metà rete. Quando i dati sono spariti da un
         dispositivo e da lì sono saliti, la copia buona è ESATTAMENTE là. */
      backups: async function () {
        if (!currentUser) return [];
        try {
          const q = await fsMod.getDocs(fsMod.collection(db, 'users', currentUser.uid, 'backups'));
          const out = [];
          q.forEach(function (d) {
            const v = d.data() || {};
            let ricchezza = 0;
            try { ricchezza = LM.ricchezza(JSON.parse(v.data)); } catch (e) { ricchezza = 0; }
            out.push({ id: d.id, ts: v.updatedAt || +d.id || 0, salvato: v.salvato || 0, ricchezza: ricchezza });
          });
          return out.sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });
        } catch (e) {
          log('errore', 'non riesco a leggere le copie nel cloud', e && e.message);
          return [];
        }
      },
      /* riprende una copia dal cloud. Non sostituisce: UNISCE, come tutto il
         resto — chi va a ripescare una copia vuole riavere quello che manca,
         non buttare via quello che nel frattempo ha fatto. */
      riprendiBackup: async function (id) {
        if (!currentUser) return false;
        try {
          const d = await fsMod.getDoc(fsMod.doc(db, 'users', currentUser.uid, 'backups', String(id)));
          if (!d.exists()) return false;
          LM.backup('prima-di-riprendere-una-copia-dal-cloud');
          applicaRemoto(d.data(), false);
          await push(currentUser.uid);
          return true;
        } catch (e) {
          log('errore', 'non riesco a riprendere la copia', e && e.message);
          return false;
        }
      }
    };

    log('info', 'cloud pronto', 'progetto ' + firebaseConfig.projectId);

    // completa un eventuale accesso via redirect
    try { await authMod.getRedirectResult(auth); } catch (e) { log('avviso', 'esito del redirect di accesso non recuperato', e && e.message); }

    authMod.onAuthStateChanged(auth, async function (u) {
      if (unsubDoc) { unsubDoc(); unsubDoc = null; }
      if (u) {
        currentUser = { uid: u.uid, email: u.email || '', name: u.displayName || '', photo: u.photoURL || '' };
        log('info', 'accesso riscontrato, avvio la prima sincronizzazione', 'uid ' + u.uid.slice(0, 6) + '…');
        emitAuth({ syncing: true });
        await primaSincronizzazione(u.uid);
        // ascolta i cambiamenti dagli altri dispositivi, e riattaccalo se cade
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

    // ogni modifica locale viene salvata sul cloud (con debounce)
    document.addEventListener('lm:change', function () {
      if (currentUser && !applyingRemote) programmaPush();
    });

  } catch (e) {
    console.warn('LifeMax: cloud non disponibile, uso solo questo dispositivo.', e && e.message);
    log('errore', 'SDK Firebase non caricato: si lavora solo in locale', e && e.message);
    emitUnavailable();
  }
})();

async function primaSincronizzazione(uid) {
  const ref = FSM.doc(db, 'users', uid);
  let snap;
  opInizio('lettura iniziale');
  try {
    snap = await FSM.getDoc(ref);
    /* La lettura è andata: da qui in poi l'esito lo decide il ramo scelto.
       Prima questa funzione poteva terminare senza mai chiudere lo stato, e
       la scritta "Salvataggio…" restava lì per sempre. */
    log('info', 'lettura iniziale completata', snap.exists() ? 'documento presente' : 'nessun documento nel cloud');
  } catch (e) {
    opFine('lettura iniziale', 'error', erroreLeggibile(e));
    console.warn('LifeMax: lettura cloud non riuscita.', e && e.message);
    return;
  }
  const locale = LM.snapshot();
  const localAt = locale.updatedAt || 0;
  const localR = LM.ricchezza(locale);

  if (snap.exists() && snap.data() && snap.data().data) {
    const remObj = parseDoc(snap.data());
    const remoteR = LM.ricchezza(remObj);
    const remoteAt = snap.data().updatedAt || 0;
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
    await backupRemoto(uid, snap.data());
    LM.backup('prima-di-unire-col-cloud');
    applicaRemoto(snap.data(), false);
    const dopo = LM.ricchezza(LM.snapshot());
    log('info', 'uniti', 'adesso ' + dopo + ' elementi (erano ' + localR + ' qui e ' + remoteR + ' nel cloud)');
    opCede('lettura iniziale', 'scrittura');
    await push(uid);
  } else {
    // Nessun documento cloud: carica ciò che c'è in locale.
    log('info', 'primo salvataggio per questo account');
    opCede('lettura iniziale', 'scrittura');
    await push(uid);
  }
}

function quando(t) {
  return t ? new Date(t).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'mai';
}

/* Copia il documento cloud esistente in una sotto-collezione di backup
   prima di sovrascriverlo: users/{uid}/backups/{timestamp}. */
async function backupRemoto(uid, docData) {
  try {
    var ts = String(docData.updatedAt || Date.now());
    await FSM.setDoc(FSM.doc(db, 'users', uid, 'backups', ts), {
      data: docData.data, updatedAt: docData.updatedAt || 0, salvato: Date.now()
    });
  } catch (e) { console.warn('LifeMax: backup cloud non riuscito.', e && e.message); }
}

function parseDoc(d) {
  try { return JSON.parse(d.data); } catch (e) { return null; }
}

function applicaRemoto(d, notifica) {
  const obj = parseDoc(d);
  if (!obj) return;
  const prima = LM.ricchezza(LM.snapshot());
  log('info', 'unisco i dati ' + (notifica ? 'arrivati da un altro dispositivo' : 'del cloud'), LM.ricchezza(obj) + ' elementi');
  if (notifica) LM.backup('prima-di-aggiornamento-da-altro-dispositivo');
  applyingRemote = true;
  lastWrittenAt = (d && d.updatedAt) || obj.updatedAt || 0;
  /* arrivano dati da un altro dispositivo: i punti a cui tornare parlavano di
     una storia diversa e tornarci mescolerebbe due timeline */
  if (LM.scordaPunti) LM.scordaPunti();
  /* si UNISCE, non si sostituisce: vedi il commento lungo in
     primaSincronizzazione, e LM.unisci in assets/data.js */
  LM.hydrate(obj);
  applyingRemote = false;
  const dopo = LM.ricchezza(LM.snapshot());
  if (dopo < prima) {
    /* non deve poter succedere: la fusione toglie solo dove c'è una lapide o
       un azzeramento dichiarato. Se succede lo stesso, si grida — e la copia
       di sicurezza presa qui sopra è la via di uscita. */
    log('errore', 'dopo la fusione ci sono MENO elementi di prima', prima + ' → ' + dopo);
  }
  if (notifica) window.dispatchEvent(new CustomEvent('lm:remote'));
}

function programmaPush() {
  clearTimeout(pushTimer);
  /* ADHD: si tocca tanto e in fretta. Un debounce raccoglie la raffica in
     una sola scrittura invece di bombardare il server (e la batteria). */
  pushTimer = setTimeout(function () {
    if (currentUser) push(currentUser.uid);
  }, 700);
}

/* Le scritture non si sovrappongono: Firestore non garantisce l'ordine di
   due setDoc in volo, e due push concorrenti facevano rimbalzare lo stato.
   Se arrivano modifiche mentre scriviamo, ne teniamo nota e rifacciamo il
   giro subito dopo con lo stato più fresco. */
async function push(uid) {
  if (pushInCorso) { pushPendente = true; log('info', 'scrittura già in volo: accodo le nuove modifiche'); return; }
  pushInCorso = true;
  const s = LM.snapshot();
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
    console.warn('LifeMax: salvataggio sul cloud non riuscito.', e && e.message);
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
function ascolta(uid) {
  if (!FSM || !db) return;
  if (unsubDoc) { try { unsubDoc(); } catch (e) { /* niente */ } unsubDoc = null; }
  if (riprovaTimer) { clearTimeout(riprovaTimer); riprovaTimer = null; }
  try {
    unsubDoc = FSM.onSnapshot(FSM.doc(db, 'users', uid), function (snap) {
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
      if (d && typeof d.updatedAt === 'number' && d.updatedAt === lastWrittenAt) return; // nostra scrittura
      applicaRemoto(d, true);
    }, function (err) {
      ascoltoAttivo = false;
      unsubDoc = null;
      cadute++;
      log('errore', 'l\u2019ascolto degli altri dispositivi si \u00e8 interrotto (' + cadute + '\u00aa volta)',
        (err && err.code ? err.code + ' \u00b7 ' : '') + ((err && err.message) || ''));
      emitAuth();
      riattacca(uid);
    });
    ascoltoAttivo = true;
    log('info', 'ascolto in tempo reale attivo');
    emitAuth();
  } catch (e) {
    ascoltoAttivo = false;
    log('errore', 'non riesco a mettermi in ascolto', e && e.message);
    emitAuth();
    riattacca(uid);
  }
}

function riattacca(uid) {
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
function riprovaSubito(perche) {
  if (!currentUser || ascoltoAttivo) return;
  log('info', 'riprovo l\u2019ascolto subito: ' + perche);
  attesaRiprova = 0;
  ascolta(currentUser.uid);
}
document.addEventListener('visibilitychange', function () {
  if (!document.hidden) riprovaSubito('sei tornato sull\u2019app');
});

/* rete che va e viene: appena torna, riprova subito e aggiorna lo stato */
window.addEventListener('offline', function () {
  if (currentUser) emitSync('attesa');
});
window.addEventListener('online', function () {
  if (currentUser) { log('info', 'rete tornata: riprovo il salvataggio'); programmaPush(); }
  riprovaSubito('\u00e8 tornata la rete');
});

/* traduce i codici d'errore Firestore più comuni in messaggi utili */
function erroreLeggibile(e) {
  var code = (e && (e.code || e.message)) || '';
  if (/permission-denied|insufficient/i.test(code)) return 'Permessi Firestore negati: pubblica le regole di sicurezza.';
  if (/unavailable|not-found|Cloud Firestore API|database/i.test(code)) return 'Database Firestore non raggiungibile: attivalo nella console Firebase.';
  if (/unauthenticated/i.test(code)) return 'Sessione scaduta: riprova ad accedere.';
  return 'Salvataggio non riuscito. Controlla la configurazione di Firestore.';
}
