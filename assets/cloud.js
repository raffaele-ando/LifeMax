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
let pushTimer = null;

function emitAuth(extra) {
  window.LM_AUTH = Object.assign({ user: currentUser, available: true, syncing: false }, extra || {});
  window.dispatchEvent(new CustomEvent('lm:auth'));
}

function emitUnavailable() {
  window.LM_AUTH = { user: null, available: false, syncing: false };
  window.LMCloud = { available: false, signIn: function () {}, signOut: function () {} };
  window.dispatchEvent(new CustomEvent('lm:auth'));
}

/* stato del salvataggio cloud: 'idle' | 'saving' | 'saved' | 'error' */
function emitSync(state, error) {
  var at = (state === 'saved') ? Date.now() : (window.LM_SYNC && window.LM_SYNC.at) || 0;
  window.LM_SYNC = { state: state, error: error || '', at: at };
  window.dispatchEvent(new CustomEvent('lm:sync', { detail: window.LM_SYNC }));
}

(async function init() {
  try {
    const [appMod, authMod, fsMod] = await Promise.all([
      import(SDK + 'firebase-app.js'),
      import(SDK + 'firebase-auth.js'),
      import(SDK + 'firebase-firestore.js')
    ]);
    AUTHM = authMod; FSM = fsMod;

    const app = appMod.initializeApp(firebaseConfig);
    auth = authMod.getAuth(app);
    db = fsMod.getFirestore(app);
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
      }
    };

    // completa un eventuale accesso via redirect
    try { await authMod.getRedirectResult(auth); } catch (e) { /* ignora */ }

    authMod.onAuthStateChanged(auth, async function (u) {
      if (unsubDoc) { unsubDoc(); unsubDoc = null; }
      if (u) {
        currentUser = { uid: u.uid, email: u.email || '', name: u.displayName || '', photo: u.photoURL || '' };
        emitAuth({ syncing: true });
        emitSync('saving');
        await primaSincronizzazione(u.uid);
        // ascolta i cambiamenti dagli altri dispositivi
        unsubDoc = fsMod.onSnapshot(fsMod.doc(db, 'users', u.uid), function (snap) {
          if (!snap.exists()) return;
          const d = snap.data();
          if (d && typeof d.updatedAt === 'number' && d.updatedAt === lastWrittenAt) return; // nostra scrittura
          applicaRemoto(d, true);
        }, function (err) { console.warn('LifeMax: ascolto cloud interrotto.', err && err.message); });
        emitAuth({ syncing: false });
      } else {
        currentUser = null;
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
    emitUnavailable();
  }
})();

async function primaSincronizzazione(uid) {
  const ref = FSM.doc(db, 'users', uid);
  let snap;
  try {
    snap = await FSM.getDoc(ref);
  } catch (e) {
    emitSync('error', erroreLeggibile(e));
    console.warn('LifeMax: lettura cloud non riuscita.', e && e.message);
    return;
  }
  const locale = LM.snapshot();
  const localeAt = locale.updatedAt || 0;

  if (snap.exists() && snap.data() && snap.data().data) {
    const remoteAt = snap.data().updatedAt || 0;
    // il cloud vince se è più recente, oppure se in locale non c'è nulla di configurato
    if (remoteAt >= localeAt || !locale.onboarded) {
      applicaRemoto(snap.data(), false);
    } else {
      await push(uid);
    }
  } else {
    // primo accesso su questo account: carica ciò che c'è in locale
    await push(uid);
  }
}

function parseDoc(d) {
  try { return JSON.parse(d.data); } catch (e) { return null; }
}

function applicaRemoto(d, notifica) {
  const obj = parseDoc(d);
  if (!obj) return;
  applyingRemote = true;
  lastWrittenAt = (d && d.updatedAt) || obj.updatedAt || 0;
  LM.hydrate(obj);
  applyingRemote = false;
  if (notifica) window.dispatchEvent(new CustomEvent('lm:remote'));
}

function programmaPush() {
  clearTimeout(pushTimer);
  pushTimer = setTimeout(function () {
    if (currentUser) push(currentUser.uid);
  }, 700);
}

async function push(uid) {
  const s = LM.snapshot();
  const at = s.updatedAt || Date.now();
  lastWrittenAt = at;
  emitSync('saving');
  try {
    await FSM.setDoc(FSM.doc(db, 'users', uid), {
      data: JSON.stringify(s),
      updatedAt: at,
      email: currentUser ? currentUser.email : '',
      name: currentUser ? currentUser.name : ''
    });
    emitSync('saved');
  } catch (e) {
    emitSync('error', erroreLeggibile(e));
    console.warn('LifeMax: salvataggio sul cloud non riuscito.', e && e.message);
  }
}

/* traduce i codici d'errore Firestore più comuni in messaggi utili */
function erroreLeggibile(e) {
  var code = (e && (e.code || e.message)) || '';
  if (/permission-denied|insufficient/i.test(code)) return 'Permessi Firestore negati: pubblica le regole di sicurezza.';
  if (/unavailable|not-found|Cloud Firestore API|database/i.test(code)) return 'Database Firestore non raggiungibile: attivalo nella console Firebase.';
  if (/unauthenticated/i.test(code)) return 'Sessione scaduta: riprova ad accedere.';
  return 'Salvataggio non riuscito. Controlla la configurazione di Firestore.';
}
