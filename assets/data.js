/* ============================================================
   LifeMax — livello dati
   Stato unico in localStorage, selettori per le viste,
   motore XP / streak gentile / esperimenti N-of-1.
   Nessuna dipendenza esterna.
   ============================================================ */
'use strict';

var LM = (function () {

  var STORAGE_KEY = 'lifemax.v2';

  /* ---------- date utils (sempre timezone locale) ---------- */

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function dayKey(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function parseKey(k) {
    var p = k.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  function todayKey() { return dayKey(new Date()); }

  function addDays(k, n) {
    var d = parseKey(k);
    d.setDate(d.getDate() + n);
    return dayKey(d);
  }

  function daysBetween(a, b) {
    return Math.round((parseKey(b) - parseKey(a)) / 86400000);
  }

  function lastNDays(n) {
    var out = [], t = todayKey();
    for (var i = n - 1; i >= 0; i--) out.push(addDays(t, -i));
    return out;
  }

  function weekdayShort(k) {
    return ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'][parseKey(k).getDay()];
  }

  function fmtShort(k) {
    var d = parseKey(k);
    var mesi = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
    return d.getDate() + ' ' + mesi[d.getMonth()];
  }

  /* Lunedì della settimana di k — chiave per le review settimanali */
  function weekKey(k) {
    var d = parseKey(k);
    var dow = (d.getDay() + 6) % 7; // 0 = lunedì
    d.setDate(d.getDate() - dow);
    return dayKey(d);
  }

  /* ---------- aree di vita (ordine fisso ⇒ slot colore fisso) ---------- */
  /* Lo slot colore segue l'entità, mai il rango: la mappatura non cambia
     se un'area viene filtrata o riordinata in una vista. */

  var AREE_DEFAULT = [
    { id: 'studio',       nome: 'Studio / Università', icona: 'book',      slot: 1, sistema: 'Sessioni di studio profondo pianificate la sera prima' },
    { id: 'salute',       nome: 'Salute & Sport',      icona: 'heart',     slot: 2, sistema: 'Allenamento o camminata prima delle 10:00' },
    { id: 'relazioni',    nome: 'Relazioni & Sociale', icona: 'users',     slot: 3, sistema: 'Un contatto significativo al giorno' },
    { id: 'finanze',      nome: 'Finanze',             icona: 'wallet',    slot: 4, sistema: 'Revisione spese ogni domenica sera' },
    { id: 'associazioni', nome: 'Associazioni',        icona: 'landmark',  slot: 5, sistema: 'Blocco settimanale dedicato, non frammentato' },
    { id: 'founder',      nome: 'Progetti Founder',    icona: 'rocket',    slot: 6, sistema: 'Prima ora del mattino sul progetto, prima delle mail' },
    { id: 'lavoro',       nome: 'Lavoro',              icona: 'briefcase', slot: 7, sistema: 'Chiusura giornata con lista per domani' },
    { id: 'altro',        nome: 'Altro / Esplorazione',icona: 'lightbulb', slot: 8, sistema: 'Spazio libero per la novità: una cosa nuova a settimana' }
  ];

  /* Palette categorica di riferimento (validata: vedi README).
     slot → [light, dark]. Il colore non porta mai il significato da solo:
     ogni uso è accompagnato da icona + etichetta. */
  var SLOT_COLORI = {
    1: ['#2a78d6', '#3987e5'],
    2: ['#008300', '#008300'],
    3: ['#e87ba4', '#d55181'],
    4: ['#eda100', '#c98500'],
    5: ['#1baf7a', '#199e70'],
    6: ['#eb6834', '#d95926'],
    7: ['#4a3aa7', '#9085e9'],
    8: ['#e34948', '#e66767']
  };

  function coloreArea(area) {
    var dark = document.documentElement.getAttribute('data-mode') === 'dark';
    return SLOT_COLORI[area.slot][dark ? 1 : 0];
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

  function livelloDaXp(xp) {
    var lvl = Math.floor(Math.sqrt(Math.max(0, xp) / 50)) + 1;
    var base = 50 * (lvl - 1) * (lvl - 1);
    var next = 50 * lvl * lvl;
    return { livello: lvl, base: base, prossimo: next, pct: Math.min(1, (xp - base) / (next - base)) };
  }

  /* ---------- stato ---------- */

  /* Ritmo della giornata: sonno, sveglia e pasti. Serve alla timeline
     "La giornata", che rende visibile come è divisa la giornata (utile
     contro la difficoltà a percepire il tempo — Barkley 1997). */
  var RITMO_DEFAULT = {
    sveglia: '07:30',
    sonno: '23:30',
    pasti: [
      { id: 'colazione', nome: 'Colazione', ora: '08:00', durata: 15 },
      { id: 'pranzo', nome: 'Pranzo', ora: '13:00', durata: 45 },
      { id: 'cena', nome: 'Cena', ora: '20:00', durata: 45 }
    ]
  };

  function statoVuoto() {
    return {
      versione: 1,
      updatedAt: 0,
      onboarded: false,
      demo: false,
      /* giornataPos: dove mostrare la timeline della giornata
         ('oggi-strip' | 'panoramica' | 'oggi-full' | 'menu') */
      profilo: { nome: '', visione: '', skin: 'quiete', modo: 'auto', giornataPos: 'oggi-strip', ritmo: JSON.parse(JSON.stringify(RITMO_DEFAULT)) },
      ritmoGiorno: {},   // ritmoGiorno[data] = {sveglia?, sonno?, pasti?} — registro di sonno e pasti del singolo giorno
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
      xp: 0,
      xpPerGiorno: {},   // xpPerGiorno[data] = n
      log: [],           // (deprecato) eventi recenti per feedback immediato
      registro: []       // {ts, cat, testo, imp} — storico di tutto ciò che fai (Diario)
    };
  }

  var state = null;

  function load() {
    if (state) return state;
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      state = raw ? JSON.parse(raw) : statoVuoto();
    } catch (e) {
      state = statoVuoto();
    }
    normalizza(state);
    return state;
  }

  /* Riempie i campi mancanti negli stati salvati prima di un aggiornamento
     (o arrivati dal cloud): nessun dato viene perso, si aggiunge solo. */
  function normalizza(s) {
    var vuoto = statoVuoto();
    Object.keys(vuoto).forEach(function (k) {
      if (s[k] === undefined || s[k] === null) s[k] = vuoto[k];
    });
    if (!Array.isArray(s.backlog)) s.backlog = [];
    if (!Array.isArray(s.abitudini)) s.abitudini = [];
    if (!Array.isArray(s.aree) || !s.aree.length) s.aree = JSON.parse(JSON.stringify(AREE_DEFAULT));
    /* profilo e ritmo della giornata (stati vecchi o dal cloud) */
    if (!s.profilo || typeof s.profilo !== 'object') s.profilo = vuoto.profilo;
    if (!s.profilo.giornataPos) s.profilo.giornataPos = 'oggi-strip';
    if (!s.profilo.ritmo || typeof s.profilo.ritmo !== 'object') s.profilo.ritmo = JSON.parse(JSON.stringify(RITMO_DEFAULT));
    if (!s.profilo.ritmo.sveglia) s.profilo.ritmo.sveglia = RITMO_DEFAULT.sveglia;
    if (!s.profilo.ritmo.sonno) s.profilo.ritmo.sonno = RITMO_DEFAULT.sonno;
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
      var mitVisti = {};
      s.azioni.forEach(function (a) {
        if (!a.mit) return;
        if (mitVisti[a.data]) a.mit = false; else mitVisti[a.data] = true;
      });
    }
    return s;
  }

  /* Se il salvataggio locale fallisce (spazio esaurito, navigazione privata)
     NON restiamo zitti: perdere dati senza accorgersene è il guaio peggiore
     per un'app che serve a misurare. Avvisiamo una volta e proviamo a fare
     spazio buttando le voci più vecchie del registro. */
  var salvataggioRotto = false;
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

  function leggiIndice() {
    try { return JSON.parse(localStorage.getItem(PUNTI_KEY)) || []; } catch (e) { return []; }
  }
  function scriviIndice(arr) {
    try { localStorage.setItem(PUNTI_KEY, JSON.stringify(arr)); } catch (e) { /* quota */ }
  }
  function buttaPunto(id) {
    try { localStorage.removeItem(PUNTO_PRE + id); } catch (e) { /* niente */ }
  }
  function scordaPunti() {
    leggiIndice().forEach(function (p) { buttaPunto(p.id); });
    try { localStorage.removeItem(PUNTI_KEY); } catch (e) { /* niente */ }
    ultimoPuntoFino = 0;
  }

  /* lo stato è cambiato: si tiene com'era. `prima` è ciò che c'era scritto. */
  function segnaPunto(prima, primaNudo, adessoNudo) {
    if (!prima || primaNudo === adessoNudo) return;   /* niente è cambiato davvero */
    var ora = Date.now();
    var arr = leggiIndice();
    var id = 'p' + ora.toString(36) + Math.random().toString(36).slice(2, 6);
    try { localStorage.setItem(PUNTO_PRE + id, prima); }
    catch (e) {
      /* spazio finito: si butta il più vecchio e si riprova una volta sola */
      if (arr.length) { var v = arr.pop(); buttaPunto(v.id); }
      try { localStorage.setItem(PUNTO_PRE + id, prima); }
      catch (e2) { scriviIndice(arr); return; }
    }
    /* La finestra parte dal salvataggio precedente, ma non più di cinque
       secondi indietro: senza questo limite il primo punto aveva `da: 0` e si
       prendeva TUTTO il passato — ogni riga del diario, anche di mesi prima,
       sembrava annullabile e annullarla riportava a ieri. */
    arr.unshift({ id: id, da: Math.max(ultimoPuntoFino, ora - 5000), fino: ora });
    ultimoPuntoFino = ora;
    while (arr.length > PUNTI_MAX) buttaPunto(arr.pop().id);
    scriviIndice(arr);
  }

  /* la riga del diario con questo istante appartiene a quale punto?
     `dopo` dice quante cose sono state fatte DOPO: se è zero, annullare quel
     punto annulla esattamente quella cosa e nient'altro. */
  function puntoDiRitorno(ts) {
    var arr = leggiIndice();
    for (var i = 0; i < arr.length; i++) {
      if (ts > arr[i].da && ts <= arr[i].fino + 1500) return { id: arr[i].id, dopo: i };
    }
    return null;
  }
  function puntiDiRitorno() {
    return leggiIndice().map(function (p, i) { return { id: p.id, da: p.da, fino: p.fino, dopo: i }; });
  }

  /* Torna a com'era. Il registro NON si conserva: se tornasse indietro anche
     lui il diario mostrerebbe cose che non sono più vere. Al suo posto resta
     una riga che dice che sei tornato. */
  function tornaAlPunto(ts, etichetta) {
    var arr = leggiIndice();
    var i = -1;
    for (var j = 0; j < arr.length; j++) { if (ts > arr[j].da && ts <= arr[j].fino + 1500) { i = j; break; } }
    if (i < 0) return false;
    var raw;
    try { raw = localStorage.getItem(PUNTO_PRE + arr[i].id); } catch (e) { raw = null; }
    var vecchio = raw ? safeParse(raw) : null;
    if (!vecchio) return false;
    /* i punti da qui in avanti descrivono uno stato che non esiste più */
    for (var k = 0; k <= i; k++) buttaPunto(arr[k].id);
    var resto = arr.slice(i + 1);
    scriviIndice(resto);
    ultimoPuntoFino = resto.length ? resto[0].fino : 0;
    staTornandoIndietro = true;
    hydrate(vecchio);
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
  function annullaRecord(tipo, chiave) {
    var s = load();
    /* la riga «Annullato…» dice anche QUANDO, se non è oggi: annullare la
       review di una sera di tre settimane fa e leggere solo «Annullata la
       review della sera» non dice quale */
    function quando(k) { return k === todayKey() ? '' : ' del ' + fmtShort(k); }
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
      var c = s.checkins.splice(i, 1)[0];
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
      var h = s.abitudini.find(function (x) { return x.id === pz[0]; });
      if (!h || !pz[1]) return false;
      var vuole = pz[2] === '1';
      if (!!h.fatti[pz[1]] === vuole) return false;   /* già come deve stare */
      completaAbitudine(pz[0], pz[1]);                /* interruttore: XP e registro compresi */
      return true;
    }
    if (tipo === 'cattura') {
      var j = s.inbox.findIndex(function (x) { return x.id === chiave; });
      if (j < 0) return false;
      var el = s.inbox.splice(j, 1)[0];
      togliXp(XP_EVENTI.cattura, dayKey(new Date(el.creata)));
      registra('dati', 'Annullata la nota «' + el.testo + '»', true);
      save();
      return true;
    }
    return false;
  }

  function save() {
    /* com'era prima: si legge dal salvataggio, che è ancora quello vecchio */
    var prima = null;
    if (!staTornandoIndietro) {
      try { prima = localStorage.getItem(STORAGE_KEY); } catch (e) { prima = null; }
    }
    if (state) state.updatedAt = Date.now();
    var ok = true;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      ok = false;
      /* secondo tentativo: registro ridotto (è la parte più voluminosa e meno
         essenziale — le azioni, le abitudini e le misure restano intatte) */
      try {
        if (Array.isArray(state.registro) && state.registro.length > 100) {
          state.registro = state.registro.slice(-100);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
          ok = true;
        }
      } catch (e2) { /* niente da fare: i dati restano in memoria */ }
    }
    if (!ok && !salvataggioRotto) {
      salvataggioRotto = true;
      document.dispatchEvent(new CustomEvent('lm:errore-salvataggio'));
    }
    if (ok) salvataggioRotto = false;
    if (!staTornandoIndietro) {
      var adesso = null;
      try { adesso = localStorage.getItem(STORAGE_KEY); } catch (e) { adesso = null; }
      /* `updatedAt` cambia a ogni salvataggio: si toglie da entrambi, altrimenti
         ogni salvataggio sembrerebbe un cambiamento */
      segnaPunto(prima, senzaOrologio(prima), senzaOrologio(adesso));
    }
    document.dispatchEvent(new CustomEvent('lm:change'));
  }
  function senzaOrologio(raw) {
    return raw ? raw.replace(/"updatedAt":\s*\d+,?/, '') : raw;
  }

  function reset() {
    backup('prima-azzeramento');
    /* i punti a cui tornare parlavano di dati che non ci sono più */
    scordaPunti();
    state = statoVuoto();
    registra('dati', 'Dati azzerati (ripartenza da zero)', true);
    save();
  }

  /* ---------- backup, ricchezza, export/import ----------
     Ogni sostituzione potenzialmente distruttiva dei dati salva prima una
     copia in un contenitore dedicato (localStorage), così nulla va perso
     davvero: si può sempre ripristinare da Impostazioni. */

  var BACKUP_KEY = 'lifemax.backups.v1';

  function leggiBackups() {
    try { return JSON.parse(localStorage.getItem(BACKUP_KEY)) || []; } catch (e) { return []; }
  }
  function scriviBackups(arr) {
    try { localStorage.setItem(BACKUP_KEY, JSON.stringify(arr)); } catch (e) { /* quota */ }
  }
  function backup(motivo) {
    var raw;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) { raw = null; }
    if (!raw) { try { raw = JSON.stringify(load()); } catch (e) { return; } }
    var arr = leggiBackups();
    if (arr.length && arr[0].data === raw) return; // niente duplicati consecutivi
    arr.unshift({ ts: Date.now(), motivo: motivo || '', data: raw });
    if (arr.length > 25) arr = arr.slice(0, 25);
    scriviBackups(arr);
  }
  function listBackups() {
    return leggiBackups().map(function (b) {
      return { ts: b.ts, motivo: b.motivo, ricchezza: ricchezza(safeParse(b.data)) };
    });
  }
  function restoreBackup(ts) {
    var b = leggiBackups().find(function (x) { return x.ts === ts; });
    if (!b) return false;
    backup('prima-del-ripristino');
    scordaPunti();
    hydrate(safeParse(b.data));
    registra('dati', 'Ripristinato un backup', true);
    save();
    return true;
  }
  function safeParse(t) { try { return JSON.parse(t); } catch (e) { return statoVuoto(); } }

  /* Quanto è "pieno" uno stato: serve a non far mai sovrascrivere dati
     reali da uno stato vuoto (la causa del bug di perdita dati). */
  function ricchezza(s) {
    if (!s || typeof s !== 'object') return 0;
    return (s.azioni ? s.azioni.length : 0) +
      (s.checkins ? s.checkins.length : 0) +
      (s.inbox ? s.inbox.length : 0) +
      (s.valutazioni ? Object.keys(s.valutazioni).length : 0) +
      (s.reviewSera ? Object.keys(s.reviewSera).length : 0) +
      (s.reviewSettimana ? Object.keys(s.reviewSettimana).length : 0) +
      (s.esperimenti ? s.esperimenti.length : 0);
  }

  function exportJson() {
    return JSON.stringify({ app: 'LifeMax', versione: 2, esportato: Date.now(), stato: load() }, null, 2);
  }
  /* Ripristino leggero, per l'annulla subito dopo un'azione: rimette lo
     stato com'era un attimo prima, senza backup e senza riga di diario —
     quello che è stato annullato non è mai successo. */
  function ripristinaStato(obj) {
    if (!obj || typeof obj !== 'object') return false;
    hydrate(obj);
    save();
    return true;
  }

  function importJson(text) {
    var obj;
    try { obj = JSON.parse(text); } catch (e) { return { ok: false, err: 'File non valido: non è JSON leggibile.' }; }
    var st = (obj && obj.stato) ? obj.stato : obj; // accetta il file esportato o lo stato nudo
    if (!st || typeof st !== 'object' || !Array.isArray(st.azioni)) {
      return { ok: false, err: 'Il file non contiene dati LifeMax.' };
    }
    backup('prima-import');
    scordaPunti();
    st.updatedAt = Date.now();
    hydrate(st);
    registra('dati', 'Dati importati da file (' + ricchezza(st) + ' elementi)', true);
    save();
    return { ok: true, ricchezza: ricchezza(st) };
  }

  /* Sostituisce l'intero stato con uno proveniente dal cloud.
     Preserva updatedAt del documento remoto (non lo rigenera come save),
     così la logica "l'ultima modifica vince" resta coerente tra dispositivi. */
  function hydrate(obj) {
    if (!obj || typeof obj !== 'object') return;
    state = normalizza(obj);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignora */ }
    document.dispatchEvent(new CustomEvent('lm:change'));
  }

  function snapshot() { return load(); }

  function uid() {
    return 'id' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  /* ---------- mutazioni ---------- */

  function premiaXp(tipo, quando) {
    var s = load();
    var punti = XP_EVENTI[tipo] || 0;
    var k = quando || todayKey();
    s.xp += punti;
    s.xpPerGiorno[k] = (s.xpPerGiorno[k] || 0) + punti;
    return punti;
  }
  /* toglie XP già assegnati (es. quando si toglie la spunta a una task) */
  function togliXp(punti, quando) {
    var s = load();
    var k = quando || todayKey();
    s.xp = Math.max(0, s.xp - punti);
    s.xpPerGiorno[k] = Math.max(0, (s.xpPerGiorno[k] || 0) - punti);
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
  function registra(cat, testo, imp, disfa) {
    var s = load();
    if (!Array.isArray(s.registro)) s.registro = [];
    var e = { ts: Date.now(), cat: cat, testo: testo, imp: !!imp };
    if (disfa) e.disfa = disfa;
    s.registro.push(e);
    if (s.registro.length > 800) s.registro = s.registro.slice(-800);
  }

  /* La priorità del giorno (MIT) è UNA sola: "se fai solo quella, la giornata
     è a posto". Serve una nuova MIT solo se il giorno non ne ha ancora
     nessuna — anche già completata, altrimenti finire la priorità e
     aggiungere un'altra cosa creerebbe una seconda priorità (e XP gonfiati). */
  function serveMit(k) {
    k = k || todayKey();
    return !load().azioni.some(function (a) { return a.data === k && a.mit; });
  }

  function aggiungiAzione(testo, areaId, opts) {
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

  function completaAzione(id) {
    var s = load();
    var a = s.azioni.find(function (x) { return x.id === id; });
    if (!a) return 0;
    /* togliere la spunta (messa per errore): rimuove gli XP dati */
    if (a.done) {
      var tolti = a.mit ? XP_EVENTI.mit : XP_EVENTI.azione;
      togliXp(tolti, a.doneAt ? dayKey(new Date(a.doneAt)) : a.data);
      a.done = false;
      a.doneAt = null;
      if (a.passoDi) {
        var prog0 = s.backlog.find(function (x) { return x.id === a.passoDi.b; });
        if (prog0 && prog0.steps) { var st0 = prog0.steps.find(function (x) { return x.id === a.passoDi.s; }); if (st0) st0.done = false; }
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
    if (a.passoDi) {
      var prog = s.backlog.find(function (x) { return x.id === a.passoDi.b; });
      if (prog && prog.steps) {
        var st = prog.steps.find(function (x) { return x.id === a.passoDi.s; });
        if (st) st.done = true;
        if (prog.steps.length && prog.steps.every(function (x) { return x.done; })) {
          s.backlog = s.backlog.filter(function (x) { return x.id !== prog.id; });
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
  function azioneInBacklog(id) {
    var s = load();
    var i = s.azioni.findIndex(function (x) { return x.id === id; });
    if (i < 0) return null;
    var a = s.azioni[i];
    var eraPasso = !!a.passoDi;
    s.azioni.splice(i, 1);
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
  function spostaAzione(id, giorno) {
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

  /* Porta al giorno dopo tutto quello che non è stato fatto: la sera si
     ripulisce la giornata senza riscrivere niente (e senza penalità). */
  function rimandaNonFatte(daGiorno, aGiorno) {
    var s = load();
    var da = daGiorno || todayKey();
    var a2 = aGiorno || addDays(da, 1);
    var mosse = s.azioni.filter(function (x) { return x.data === da && !x.done; });
    if (!mosse.length) return 0;
    mosse.forEach(function (x) { x.data = a2; x.mit = false; });
    /* nel giorno di arrivo serve una sola priorità */
    if (!s.azioni.some(function (x) { return x.data === a2 && x.mit; }) && mosse[0]) mosse[0].mit = true;
    registra('giornata', mosse.length + (mosse.length === 1 ? ' cosa non fatta spostata al ' : ' cose non fatte spostate al ') + fmtShort(a2), true);
    save();
    return mosse.length;
  }

  function rimandaAzione(id) {
    /* "non ora" senza punizione: sposta in fondo alla lista di oggi */
    var s = load();
    var i = s.azioni.findIndex(function (x) { return x.id === id; });
    if (i < 0) return;
    var a = s.azioni.splice(i, 1)[0];
    a.mit = false;
    s.azioni.push(a);
    save();
  }

  function cattura(testo) {
    var s = load();
    var el = { id: uid(), testo: testo, creata: Date.now() };
    s.inbox.unshift(el);
    var punti = premiaXp('cattura');
    save();
    return punti;
  }

  function modificaInbox(id, testo) {
    var s = load();
    var el = s.inbox.find(function (x) { return x.id === id; });
    if (!el) return;
    el.testo = testo;
    registra('inbox', 'Modificata una nota da sistemare', false);
    save();
  }

  function cambiaAreaAzione(id, areaId) {
    var s = load();
    var a = s.azioni.find(function (x) { return x.id === id; });
    if (!a) return;
    a.areaId = areaId;
    var ar = s.aree.find(function (x) { return x.id === areaId; });
    registra('azione', 'Cambiata area di «' + a.testo + '» → ' + (ar ? ar.nome : areaId), false);
    save();
  }
  /* rinomina un'azione di oggi */
  function modificaAzione(id, testo) {
    var s = load();
    var a = s.azioni.find(function (x) { return x.id === id; });
    if (!a || !testo) return;
    a.testo = testo;
    registra('azione', 'Modificata «' + testo + '»', false);
    save();
  }
  /* elimina un'azione di oggi (senza penalità: era una scelta, non un fallimento) */
  function rimuoviAzione(id) {
    var s = load();
    var i = s.azioni.findIndex(function (x) { return x.id === id; });
    if (i < 0) return;
    var a = s.azioni.splice(i, 1)[0];
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
  function setOraAzione(id, ora) {
    var s = load();
    var a = s.azioni.find(function (x) { return x.id === id; });
    if (!a) return;
    a.ora = ora || null;
    registra('giornata', ora ? 'Orario di «' + a.testo + '» → ' + ora : 'Tolto l’orario a «' + a.testo + '»', false);
    save();
  }
  /* durata (in minuti) che l'azione occupa nella giornata */
  function setDurataAzione(id, minuti) {
    var s = load();
    var a = s.azioni.find(function (x) { return x.id === id; });
    if (!a) return;
    a.durata = minuti || null;
    registra('giornata', 'Durata di «' + a.testo + '» → ' + (minuti ? minuti + ' min' : 'nessuna'), false);
    save();
  }
  /* azioni di un giorno qualsiasi (per le viste settimana/mese) */
  function azioniDelGiorno(k) {
    return load().azioni.filter(function (a) { return a.data === k; });
  }

  /* ---------- ritmo della giornata e preferenza di visualizzazione ---------- */

  /* ritmo di BASE (vale per i giorni senza un registro loro) */
  function impostaRitmo(patch) {
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
  function ritmoDi(k) {
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
  function setRitmoGiorno(k, patch) {
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
  function azzeraRitmoGiorno(k) {
    var s = load();
    if (s.ritmoGiorno && s.ritmoGiorno[k]) { delete s.ritmoGiorno[k]; registra('giornata', 'Sonno/pasti del ' + fmtShort(k) + ' tornati al ritmo di base', false); save(); }
  }
  /* minuti di sonno di un giorno (a letto → sveglia, attraversa la mezzanotte) */
  function minutiSonno(k) {
    var r = ritmoDi(k);
    function m(hhmm) { var p = String(hhmm).split(':'); return (+p[0]) * 60 + (+p[1]); }
    var a = m(r.sonno), b = m(r.sveglia);
    var dur = b - a; if (dur <= 0) dur += 1440;
    return dur;
  }
  function impostaGiornataPos(pos) {
    var s = load();
    s.profilo.giornataPos = pos;
    registra('impostazioni', 'Cambiata la posizione della «Giornata»', false);
    save();
  }

  /* ---------- backlog (attività "da fare", senza data) ---------- */

  function aggiungiBacklog(testo, areaId, interna) {
    var s = load();
    var b = { id: uid(), testo: testo, areaId: areaId || 'altro', creata: Date.now() };
    s.backlog.push(b);
    if (!interna) registra('backlog', 'Aggiunta a «Da fare»: «' + testo + '»', false);
    save();
    return b;
  }
  function modificaBacklog(id, testo) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === id; });
    if (!b) return; b.testo = testo; registra('backlog', 'Rinominata un’attività → «' + testo + '»', false); save();
  }
  function cambiaAreaBacklog(id, areaId) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === id; });
    if (!b) return; b.areaId = areaId;
    var ar = s.aree.find(function (x) { return x.id === areaId; });
    registra('backlog', 'Cambiata area di «' + b.testo + '» → ' + (ar ? ar.nome : areaId), false); save();
  }
  function rimuoviBacklog(id) {
    var s = load();
    var i = s.backlog.findIndex(function (x) { return x.id === id; });
    if (i >= 0) { registra('backlog', 'Eliminata l’attività «' + s.backlog[i].testo + '»', true); s.backlog.splice(i, 1); save(); }
  }
  /* porta un elemento del backlog tra le azioni di oggi (senza XP: è solo
     spostamento). mit true se oggi non c'è ancora nessuna azione. */
  /* Porta una cosa da fare in un giorno: oggi (default) o un giorno futuro,
     così si può distribuire il lavoro sulla settimana invece di ammucchiarlo
     tutto su oggi. */
  function backlogInOggi(id, giorno) {
    var s = load();
    var i = s.backlog.findIndex(function (x) { return x.id === id; });
    if (i < 0) return null;
    var k = giorno || todayKey();
    var b = s.backlog.splice(i, 1)[0];
    var a = aggiungiAzione(b.testo, b.areaId, { data: k, mit: serveMit(k), interna: true });
    registra('azione', k === todayKey()
      ? 'Portata in Oggi: «' + b.testo + '»'
      : 'Pianificata per il ' + fmtShort(k) + ': «' + b.testo + '»', true);
    save();
    return a;
  }
  /* ---------- progetti: un'attività "da fare" con passi ordinati ---------- */

  function aggiungiPasso(bid, testo) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === bid; });
    if (!b) return;
    if (!Array.isArray(b.steps)) b.steps = [];
    b.steps.push({ id: uid(), testo: testo, done: false });
    registra('backlog', 'Aggiunto un passo a «' + b.testo + '»: ' + testo, false);
    save();
  }
  function modificaPasso(bid, sid, testo) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === bid; });
    var st = b && b.steps && b.steps.find(function (x) { return x.id === sid; });
    if (st) { st.testo = testo; registra('backlog', 'Modificato un passo di «' + b.testo + '»', false); save(); }
  }
  function rimuoviPasso(bid, sid) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === bid; });
    if (!b || !b.steps) return;
    var st = b.steps.find(function (x) { return x.id === sid; });
    b.steps = b.steps.filter(function (x) { return x.id !== sid; });
    registra('backlog', 'Eliminato un passo di «' + b.testo + '»' + (st ? ': ' + st.testo : ''), false);
    save();
  }
  function togglePasso(bid, sid) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === bid; });
    var st = b && b.steps && b.steps.find(function (x) { return x.id === sid; });
    if (!st) return;
    st.done = !st.done;
    registra('backlog', (st.done ? 'Fatto un passo' : 'Tolta la spunta a un passo') + ' di «' + b.testo + '»: ' + st.testo, false);
    /* progetto completato a mano: lo rimuove dalle cose da fare */
    if (b.steps.length && b.steps.every(function (x) { return x.done; })) {
      registra('backlog', 'Progetto completato: «' + b.testo + '»', true);
      s.backlog = s.backlog.filter(function (x) { return x.id !== b.id; });
    }
    save();
  }
  function avanzamentoProgetto(b) {
    var tot = (b.steps || []).length;
    var fatti = (b.steps || []).filter(function (x) { return x.done; }).length;
    return { fatti: fatti, tot: tot, pct: tot ? Math.round(fatti / tot * 100) : 0 };
  }
  /* porta in Oggi il prossimo passo non fatto e non già in lista oggi */
  function prossimoPassoInOggi(bid, giorno) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === bid; });
    if (!b || !b.steps) return null;
    var k = giorno || todayKey();
    var gia = {};
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
  function distribuisciPassi(bid, daGiorno, ogniQuanti) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === bid; });
    if (!b || !b.steps || !b.steps.length) return 0;
    var passo = Math.max(1, ogniQuanti || 1);
    var k = daGiorno || todayKey();
    /* i passi già in agenda non si duplicano */
    var giaFuori = {};
    s.azioni.forEach(function (a) { if (!a.done && a.passoDi && a.passoDi.b === bid) giaFuori[a.passoDi.s] = true; });
    var daFare = b.steps.filter(function (st) { return !st.done && !giaFuori[st.id]; });
    if (!daFare.length) return 0;
    daFare.forEach(function (st, i) {
      var giorno = addDays(k, i * passo);
      aggiungiAzione(st.testo, b.areaId, { data: giorno, mit: serveMit(giorno), passoDi: { b: bid, s: st.id }, interna: true });
    });
    registra('backlog', daFare.length + ' passi di «' + b.testo + '» distribuiti da ' + fmtShort(k) +
      (passo === 1 ? ', uno al giorno' : ', uno ogni ' + passo + ' giorni'), true);
    save();
    return daFare.length;
  }

  /* Trasforma una cosa da fare (o un progetto) in ABITUDINE ricorrente: per gli
     obiettivi che non si chiudono in un giorno ma si costruiscono ripetendo. */
  function backlogInAbitudine(bid, giorni, opts) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === bid; });
    if (!b) return null;
    var h = aggiungiAbitudine(b.testo, b.areaId, giorni && giorni.length ? giorni : [1, 2, 3, 4, 5, 6, 0], opts || {});
    if (!opts || opts.mantieni !== true) {
      s = load();
      s.backlog = s.backlog.filter(function (x) { return x.id !== bid; });
    }
    registra('abitudine', '«' + b.testo + '» è diventata un’abitudine', true);
    save();
    return h;
  }

  /* Mette UN passo specifico in un giorno (o lo sposta se già in agenda) */
  function pianificaPasso(bid, sid, giorno) {
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
    var perArea = {};
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

  function appuntaBacklog(id, valore) {
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
  function importanzaBacklog(b, oggi) {
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
      var gg = daysBetween(k, inAg[0].data);
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
  function azioniDiBacklog(b, oggi) {
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
  function backlogPerImportanza(opts) {
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
    while (ora.length < tetto && poi.length) ora.push(poi.shift());
    return { ora: ora, poi: poi, parcheggio: parcheggio, totale: lista.length };
  }

  /* scadenza opzionale su un'attività da fare */
  function impostaScadenzaBacklog(id, scadenza) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === id; });
    if (!b) return;
    if (scadenza) b.scadenza = scadenza; else delete b.scadenza;
    registra('backlog', scadenza ? 'Scadenza a «' + b.testo + '» → ' + fmtShort(scadenza) : 'Tolta la scadenza a «' + b.testo + '»', false);
    save();
  }
  /* attività con scadenza entro N giorni (o già scadute), dalla più vicina */
  function scadenzeVicine(giorni) {
    var s = load();
    var oggi = todayKey();
    return s.backlog.filter(function (b) { return b.scadenza; })
      .filter(function (b) { return daysBetween(oggi, b.scadenza) <= (giorni == null ? 3650 : giorni); })
      .sort(function (a, b) { return a.scadenza < b.scadenza ? -1 : 1; });
  }

  /* ---------- abitudini ricorrenti ---------- */

  function aggiungiAbitudine(testo, areaId, giorni, opts) {
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
  function modificaAbitudine(id, dati) {
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
  function rimuoviAbitudine(id) {
    var s = load();
    var i = s.abitudini.findIndex(function (x) { return x.id === id; });
    if (i >= 0) { registra('abitudine', 'Eliminata l’abitudine «' + s.abitudini[i].testo + '»', true); s.abitudini.splice(i, 1); save(); }
  }
  /* prevista in un dato giorno? giorni vuoto = ogni giorno */
  /* Un'abitudine vale da quando la crei in avanti, non a ritroso: prima
     comparivamo anche su tutti i giorni passati, come se l'avessi sempre
     avuta (e questo falsava le serie e il diario).
       h.da    = primo giorno valido (di default il giorno in cui la crei)
       h.a     = ultimo giorno valido (vuoto = senza scadenza)
       h.salti = giorni saltati uno a uno ({'2026-07-25': true}) */
  function abitudinePrevista(h, k) {
    k = k || todayKey();
    if (h.da && k < h.da) return false;             // non retroattiva
    if (h.a && k > h.a) return false;               // periodo finito
    if (h.salti && h.salti[k]) return false;        // saltata solo quel giorno
    if (!h.giorni || !h.giorni.length) return true;
    return h.giorni.indexOf(parseKey(k).getDay()) >= 0;
  }
  /* periodo di validità: da/a (null = da sempre / per sempre) */
  function impostaPeriodoAbitudine(id, da, a) {
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
  function saltaGiornoAbitudine(id, k) {
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
  function completaAbitudine(id, giorno) {
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
  function streakAbitudine(h) {
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
  function recordAbitudine(h) {
    var giorni = Object.keys(h.fatti || {});
    if (!giorni.length) return 0;
    giorni.sort();
    var k = giorni[0], fine = todayKey(), record = 0, corrente = 0;
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
  function prossimaAbitudine(h) {
    var k = todayKey();
    for (var i = 1; i <= 366; i++) {
      k = addDays(k, 1);
      if (h.a && k > h.a) return null;
      if (abitudinePrevista(h, k)) return k;
    }
    return null;
  }

  /* ---------- gestione aree (personalizzabili) ---------- */

  function rinominaArea(id, nome) {
    var s = load();
    var a = s.aree.find(function (x) { return x.id === id; });
    if (a && nome.trim()) { registra('area', 'Area rinominata «' + a.nome + '» → «' + nome.trim() + '»', false); a.nome = nome.trim(); save(); }
  }
  function modificaRegolaArea(id, regola) {
    var s = load();
    var a = s.aree.find(function (x) { return x.id === id; });
    if (a) { a.sistema = regola; registra('area', 'Modificata la regola dell’area «' + a.nome + '»', false); save(); }
  }
  function toggleArea(id, attiva) {
    var s = load();
    var i = s.areeAttive.indexOf(id);
    if (attiva && i < 0) s.areeAttive.push(id);
    if (!attiva && i >= 0) s.areeAttive.splice(i, 1);
    if (!s.areeAttive.length) s.areeAttive.push(id); // almeno una attiva
    var a = s.aree.find(function (x) { return x.id === id; });
    registra('area', (attiva ? 'Attivata' : 'Disattivata') + ' l’area «' + (a ? a.nome : id) + '»', false);
    save();
  }
  function aggiungiArea(nome, icona, slot) {
    var s = load();
    var id = 'a' + uid();
    var usati = s.aree.map(function (a) { return a.slot; });
    var scelto = slot || 1;
    if (!slot) { for (var n = 1; n <= 8; n++) { if (usati.indexOf(n) < 0) { scelto = n; break; } scelto = ((s.aree.length) % 8) + 1; } }
    s.aree.push({ id: id, nome: nome.trim() || 'Nuova area', icona: icona || 'lightbulb', slot: scelto, sistema: '' });
    s.areeAttive.push(id);
    registra('area', 'Nuova area: «' + (nome.trim() || 'Nuova area') + '»', true);
    save();
    return id;
  }
  function rimuoviArea(id) {
    var s = load();
    if (s.aree.length <= 1) return;
    var rimossa = s.aree.find(function (a) { return a.id === id; });
    registra('area', 'Eliminata l’area «' + (rimossa ? rimossa.nome : id) + '» (le sue cose passano ad Altro)', true);
    s.aree = s.aree.filter(function (a) { return a.id !== id; });
    var i = s.areeAttive.indexOf(id); if (i >= 0) s.areeAttive.splice(i, 1);
    /* le azioni/backlog di quell'area passano a "altro" se esiste, così
       nessun elemento resta orfano e invisibile */
    var fallback = s.aree.find(function (a) { return a.id === 'altro'; });
    var fid = fallback ? fallback.id : s.aree[0].id;
    s.azioni.forEach(function (a) { if (a.areaId === id) a.areaId = fid; });
    s.backlog.forEach(function (b) { if (b.areaId === id) b.areaId = fid; });
    save();
  }

  /* baseline personale di un check-in: la media recente, usata come
     punto di riferimento ("il tuo solito") per rendere la scala meno
     ambigua — chi si sente "sempre nella media" ha così un riferimento. */
  function baselineCheckin(campo, giorni) {
    var s = load();
    var vals = [];
    var limite = giorni ? Date.now() - giorni * 86400000 : 0;
    s.checkins.forEach(function (c) { if (c[campo] != null && (!giorni || c.ts >= limite)) vals.push(c[campo]); });
    if (!vals.length) return null;
    return Math.round(vals.reduce(function (a, b) { return a + b; }, 0) / vals.length * 10) / 10;
  }

  function triageInbox(id, esito, areaId) {
    /* esito: 'azione' (fai oggi) | 'backlog' (da fare, senza data) | 'scarta' */
    var s = load();
    var i = s.inbox.findIndex(function (x) { return x.id === id; });
    if (i < 0) return;
    var el = s.inbox[i];
    if (esito === 'azione') {
      s.inbox.splice(i, 1);
      aggiungiAzione(el.testo, areaId, { interna: true });
      registra('inbox', 'Smistata in Oggi: «' + el.testo + '»', true);
      premiaXp('triage');
    } else if (esito === 'backlog') {
      s.inbox.splice(i, 1);
      aggiungiBacklog(el.testo, areaId, true);
      registra('inbox', 'Smistata tra le cose da fare: «' + el.testo + '»', true);
      premiaXp('triage');
    } else if (esito === 'scarta') {
      s.inbox.splice(i, 1);
      registra('inbox', 'Scartata la nota: «' + el.testo + '»', true);
      premiaXp('triage');
    }
    save();
  }

  function registraCheckin(energia, focus, umore, contesto) {
    var s = load();
    s.checkins.push({ data: todayKey(), ts: Date.now(), energia: energia, focus: focus, umore: umore, contesto: contesto || '' });
    var punti = premiaXp('checkin');
    save();
    return punti;
  }

  function salvaPianoMattina(intenzione) {
    var s = load();
    var k = todayKey();
    var nuovo = !s.pianoMattina[k];
    s.pianoMattina[k] = { compilato: true, intenzione: intenzione || '', ts: Date.now() };
    var punti = nuovo ? premiaXp('pianoMattina') : 0;
    save();
    return punti;
  }

  function valutaArea(areaId, voto, quando) {
    var s = load();
    var k = quando || todayKey();
    if (!s.valutazioni[k]) s.valutazioni[k] = {};
    s.valutazioni[k][areaId] = voto;
    save();
  }

  function registraMinuti(areaId, minuti, quando) {
    var s = load();
    var k = quando || todayKey();
    if (!s.minuti[k]) s.minuti[k] = {};
    s.minuti[k][areaId] = (s.minuti[k][areaId] || 0) + minuti;
    var ar = s.aree.find(function (x) { return x.id === areaId; });
    registra('focus', 'Timer: ' + minuti + ' min su ' + (ar ? ar.nome : areaId), true);
    save();
  }

  function salvaReviewSera(dati) {
    var s = load();
    var k = todayKey();
    var nuovo = !s.reviewSera[k];
    s.reviewSera[k] = Object.assign({ ts: Date.now() }, dati);
    var punti = nuovo ? premiaXp('reviewSera') : 0;
    save();
    return punti;
  }

  function salvaReviewSettimana(dati) {
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
  function azioneAdesso(nowMin) {
    if (nowMin == null) { var dd = new Date(); nowMin = dd.getHours() * 60 + dd.getMinutes(); }
    function mm(hhmm) { var p = String(hhmm).split(':'); return (+p[0]) * 60 + (+p[1]); }
    var oggi = azioniDiOggi().filter(function (a) { return !a.done; });
    var confini = azioniDiOggi().filter(function (a) { return a.ora; }).map(function (a) { return mm(a.ora); }).sort(function (x, y) { return x - y; });
    var timed = oggi.filter(function (a) { return a.ora; }).map(function (a) { return { a: a, min: mm(a.ora) }; }).sort(function (x, y) { return x.min - y.min; });
    function fineSlot(min, durata) {
      if (durata) return min + durata;
      var next = confini.find(function (m) { return m > min; });
      return next != null ? next : min + 90;
    }
    /* 1. blocco che contiene adesso → è quello che il piano dice ora */
    var corso = timed.filter(function (t) { return t.min <= nowMin && nowMin < fineSlot(t.min, t.a.durata); });
    if (corso.length) { var c = corso[0]; return { azione: c.a, stato: 'corso', min: c.min, fine: fineSlot(c.min, c.a.durata) }; }
    /* 2. blocco già passato e non fatto → riprendilo (in ordine) */
    var ritardo = timed.filter(function (t) { return nowMin >= fineSlot(t.min, t.a.durata); });
    if (ritardo.length) { var r = ritardo[0]; return { azione: r.a, stato: 'ritardo', min: r.min, fine: fineSlot(r.min, r.a.durata) }; }
    /* 3. vuoto nel piano → lavoro flessibile: la priorità, poi le altre senza orario */
    var mit = oggi.find(function (a) { return a.mit && !a.ora; });
    if (mit) return { azione: mit, stato: 'libera', min: null, fine: null };
    var libera = oggi.find(function (a) { return !a.ora; });
    if (libera) return { azione: libera, stato: 'libera', min: null, fine: null };
    /* 4. tutto in agenda più tardi → la prossima in programma */
    if (timed.length) { var u = timed[0]; return { azione: u.a, stato: 'programmata', min: u.min, fine: fineSlot(u.min, u.a.durata) }; }
    return { azione: null, stato: null, min: null, fine: null };
  }
  function prossimaAzione() { return azioneAdesso().azione; }

  function giornoAttivo(k) {
    var s = load();
    if (s.xpPerGiorno[k] > 0) return true;
    if (s.valutazioni[k] && Object.keys(s.valutazioni[k]).length) return true;
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

  function serieValutazioni(areaId, giorni) {
    var s = load();
    return lastNDays(giorni).map(function (k) {
      var v = s.valutazioni[k] && s.valutazioni[k][areaId];
      return { data: k, valore: (v === undefined ? null : v) };
    });
  }

  function serieMinuti(areaId, giorni) {
    var s = load();
    return lastNDays(giorni).map(function (k) {
      return { data: k, valore: (s.minuti[k] && s.minuti[k][areaId]) || 0 };
    });
  }

  function serieCheckin(campo, giorni) {
    var s = load();
    var perGiorno = {};
    s.checkins.forEach(function (c) {
      if (!perGiorno[c.data]) perGiorno[c.data] = [];
      perGiorno[c.data].push(c[campo]);
    });
    return lastNDays(giorni).map(function (k) {
      var arr = perGiorno[k];
      var media = arr ? arr.reduce(function (x, y) { return x + y; }, 0) / arr.length : null;
      return { data: k, valore: media === null ? null : Math.round(media * 10) / 10 };
    });
  }

  function serieXp(giorni) {
    var s = load();
    return lastNDays(giorni).map(function (k) {
      return { data: k, valore: s.xpPerGiorno[k] || 0 };
    });
  }

  function heatmapConsistenza(settimane) {
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
      giorni.forEach(function (k) { tot += (s.minuti[k] && s.minuti[k][a.id]) || 0; });
      return { area: a, minuti: tot };
    });
  }

  function mediaValutazioneArea(areaId, giorni) {
    var vals = serieValutazioni(areaId, giorni).filter(function (p) { return p.valore !== null; });
    if (!vals.length) return null;
    return vals.reduce(function (x, p) { return x + p.valore; }, 0) / vals.length;
  }

  /* ---------- diario / storico ---------- */
  /* Ricostruisce la cronologia degli eventi dai dati già registrati
     (azioni completate, check-in, piani, review, catture), raggruppati
     per giorno e ordinati dal più recente. Nessun log separato da tenere
     allineato: la storia è sempre coerente con lo stato reale. */

  function diario(giorniMax, tutto) {
    var s = load();
    var perGiorno = {};
    function agg(k, ev) { (perGiorno[k] = perGiorno[k] || []).push(ev); }

    /* `chiave` è come si ritrova il dato che sta dietro alla riga, per poterlo
       disfare da lì (vedi annullaRecord). Le righe di registro di norma non ne
       hanno — raccontano un cambiamento, non sono il cambiamento — tranne
       quelle che se la portano scritta dietro (`disfa`). */
    /* registro di tutto ciò che è stato fatto: di default solo le cose
       importanti; con `tutto` anche le minori (impostazioni, modifiche…). */
    (s.registro || []).forEach(function (rg) {
      if (!tutto && !rg.imp) return;
      var ev = { ts: rg.ts, tipo: 'registro', cat: rg.cat, testo: rg.testo, imp: rg.imp };
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
    Object.keys(s.pianoMattina).forEach(function (k) {
      var p = s.pianoMattina[k];
      agg(k, { ts: p.ts || parseKey(k).getTime() + 8 * 3600000, tipo: 'mattina', chiave: k, intenzione: p.intenzione });
    });
    Object.keys(s.reviewSera).forEach(function (k) {
      var r = s.reviewSera[k];
      agg(k, { ts: r.ts || parseKey(k).getTime() + 21 * 3600000, tipo: 'sera', chiave: k, vittoria: r.vittoria, blocco: r.blocco });
    });
    Object.keys(s.reviewSettimana).forEach(function (k) {
      var r = s.reviewSettimana[k];
      agg(k, { ts: r.ts || parseKey(k).getTime() + 20 * 3600000, tipo: 'settimana', chiave: k, vittorie: r.vittorie, blocchi: r.blocchi, imparato: r.imparato, prossima: r.prossima });
    });
    s.inbox.forEach(function (el) {
      agg(dayKey(new Date(el.creata)), { ts: el.creata, tipo: 'cattura', chiave: el.id, testo: el.testo });
    });

    var giorni = Object.keys(perGiorno).sort().reverse();
    if (giorniMax) giorni = giorni.slice(0, giorniMax);
    return giorni.map(function (k) {
      return { data: k, eventi: perGiorno[k].sort(function (a, b) { return b.ts - a.ts; }) };
    });
  }

  function giorniConAttivita() {
    var s = load();
    var set = {};
    s.azioni.forEach(function (a) { if (a.done) set[a.doneAt ? dayKey(new Date(a.doneAt)) : a.data] = 1; });
    s.checkins.forEach(function (c) { set[c.data] = 1; });
    Object.keys(s.reviewSera).forEach(function (k) { set[k] = 1; });
    Object.keys(s.pianoMattina).forEach(function (k) { set[k] = 1; });
    return Object.keys(set).length;
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

  function creaEsperimento(dati) {
    var s = load();
    var e = {
      id: uid(),
      nome: dati.nome,
      intervento: dati.intervento || '',
      metrica: dati.metrica,
      areaId: dati.areaId || null,
      inizioBaseline: dati.inizioBaseline,
      inizioIntervento: dati.inizioIntervento,
      fine: dati.fine,
      stato: 'attivo'
    };
    s.esperimenti.unshift(e);
    save();
    return e;
  }

  function valoreMetrica(e, k) {
    var s = load();
    var m = METRICHE_ESPERIMENTO.find(function (x) { return x.id === e.metrica; });
    if (!m) return null;
    if (m.fonte === 'checkin') {
      var vals = s.checkins.filter(function (c) { return c.data === k; }).map(function (c) { return c[m.campo]; });
      return vals.length ? vals.reduce(function (a, b) { return a + b; }, 0) / vals.length : null;
    }
    if (m.fonte === 'valutazione') {
      var v = s.valutazioni[k] && s.valutazioni[k][e.areaId];
      return v === undefined ? null : v;
    }
    if (m.fonte === 'minuti') {
      return (s.minuti[k] && s.minuti[k][e.areaId]) || null;
    }
    if (m.fonte === 'xp') {
      return s.xpPerGiorno[k] || null;
    }
    return null;
  }

  function risultatiEsperimento(e) {
    var punti = [];
    var k = e.inizioBaseline;
    var fine = e.fine || todayKey();
    if (daysBetween(k, fine) > 366) fine = addDays(k, 366);
    while (daysBetween(k, fine) >= 0) {
      var fase = daysBetween(e.inizioIntervento, k) >= 0 ? 'B' : 'A';
      punti.push({ data: k, valore: valoreMetrica(e, k), fase: fase });
      k = addDays(k, 1);
    }
    function stats(fase) {
      var v = punti.filter(function (p) { return p.fase === fase && p.valore !== null; }).map(function (p) { return p.valore; });
      if (!v.length) return { n: 0, media: null, sd: null };
      var m = v.reduce(function (a, b) { return a + b; }, 0) / v.length;
      var sd = v.length > 1 ? Math.sqrt(v.reduce(function (a, b) { return a + (b - m) * (b - m); }, 0) / (v.length - 1)) : 0;
      return { n: v.length, media: m, sd: sd };
    }
    var A = stats('A'), B = stats('B');
    var d = null;
    if (A.n > 1 && B.n > 1) {
      var pooled = Math.sqrt(((A.n - 1) * A.sd * A.sd + (B.n - 1) * B.sd * B.sd) / (A.n + B.n - 2));
      d = pooled > 0 ? (B.media - A.media) / pooled : null;
    }
    return { punti: punti, baseline: A, intervento: B, effetto: d };
  }

  /* ---------- dati demo ---------- */
  /* PRNG con seed fisso: la demo è identica per tutti, così il
     prototipo si valuta su dati stabili e realistici. */

  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function seedDemo() {
    reset();
    var s = state;
    var rnd = mulberry32(20260719);
    var giorni = lastNDays(56); // 8 settimane
    var oggi = todayKey();

    s.onboarded = true;
    s.demo = true;
    s.profilo.nome = 'Raffaele';
    s.profilo.visione = 'Costruire cose che contano, imparare più veloce di chiunque, restare curioso e in salute.';

    var esempiAzioni = {
      studio:       ['Capitolo di Analisi II + 10 esercizi', 'Ripasso attivo con flashcard (30′)', 'Preparare domande per il ricevimento', 'Sessione deep work biblioteca (90′)'],
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
    var vittorie = [
      'Finita la sessione da 90′ senza telefono',
      'Prima call utente andata benissimo',
      'Allenamento fatto anche se non ne avevo voglia',
      'Detto di no a una cosa che non era mia',
      'Studiato prima di aprire i social'
    ];
    var blocchi = [
      'Pomeriggio perso tra notifiche e tab aperte',
      'Iniziato tardi: colazione infinita',
      'Troppe cose in lista, paralisi da scelta',
      'Riunione associazione sforata di un’ora'
    ];

    function pick(arr) { return arr[Math.floor(rnd() * arr.length)]; }

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
      var areeGiorno = [];
      for (var i = 0; i < nAz; i++) {
        var area = pick(s.aree).id;
        areeGiorno.push(area);
        var a = {
          id: uid() + idx + '' + i,
          areaId: area,
          testo: pick(esempiAzioni[area]),
          ifThen: '',
          mit: i === 0,
          done: futuro ? i === 0 : rnd() < (0.6 + boost * 0.3),
          data: k,
          doneAt: null,
          creata: parseKey(k).getTime() + 8 * 3600000
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
        s.valutazioni[k] = {};
        s.minuti[k] = {};
        areeGiorno.forEach(function (areaId) {
          s.valutazioni[k][areaId] = Math.max(1, Math.min(5, Math.round(2.5 + boost + rnd() * 2)));
          s.minuti[k][areaId] = 25 * (1 + Math.floor(rnd() * 5));
        });
        if (rnd() < 0.75) {
          s.reviewSera[k] = { vittoria: pick(vittorie), blocco: pick(blocchi), shutdown: rnd() < 0.7, ts: parseKey(k).getTime() + 21 * 3600000 };
          s.xp += XP_EVENTI.reviewSera;
          s.xpPerGiorno[k] = (s.xpPerGiorno[k] || 0) + XP_EVENTI.reviewSera;
        }
        if (rnd() < 0.8) {
          s.pianoMattina[k] = { compilato: true, intenzione: 'Alle 9:00, appena mi siedo alla scrivania, inizio dall’attività più importante senza aprire le chat.', ts: parseKey(k).getTime() + 8 * 3600000 };
          s.xp += XP_EVENTI.pianoMattina;
          s.xpPerGiorno[k] = (s.xpPerGiorno[k] || 0) + XP_EVENTI.pianoMattina;
        }
      }
    });

    /* review settimanali sulle settimane concluse */
    var settimane = {};
    giorni.forEach(function (k) { settimane[weekKey(k)] = true; });
    Object.keys(settimane).sort().slice(0, -1).forEach(function (wk) {
      if (rnd() < 0.8) {
        s.reviewSettimana[wk] = {
          vittorie: pick(vittorie),
          blocchi: pick(blocchi),
          imparato: 'Quando studio fuori casa rendo di più: cambiare ambiente mi aiuta a concentrarmi.',
          prossima: 'Dedicare la prima ora del mattino allo studio, almeno 5 giorni su 7.',
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
    var esempiBacklog = [
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
    var esempiAbit = [
      ['salute', 'Leggere 20 minuti', []],
      ['studio', 'Ripasso flashcard', []],
      ['salute', 'Camminata / movimento', [1, 2, 3, 4, 5]]
    ];
    esempiAbit.forEach(function (h, i) {
      var fatti = {};
      for (var d = 1; d <= 12; d++) {
        var k = addDays(oggi, -d);
        if ((h[2].length === 0 || h[2].indexOf(parseKey(k).getDay()) >= 0) && rnd() < 0.8) fatti[k] = true;
      }
      /* i dati di esempio hanno una storia: l'abitudine "esiste" da 20 giorni */
      s.abitudini.push({ id: uid() + 'ab' + i, testo: h[1], areaId: h[0], giorni: h[2], creata: Date.now(),
        fatti: fatti, da: addDays(oggi, -20), a: null, salti: {} });
    });

    /* orari d'esempio per la giornata di oggi, così la timeline "La giornata"
       si vede subito piena */
    var ogAz = s.azioni.filter(function (a) { return a.data === oggi; });
    if (ogAz[0]) { ogAz[0].ora = '09:30'; ogAz[0].durata = 90; }
    if (ogAz[1]) { ogAz[1].ora = '15:00'; ogAz[1].durata = 60; }
    s.abitudini.forEach(function (h) {
      if (/camminata|movimento/i.test(h.testo)) { h.ora = '18:00'; h.durata = 45; }
      else if (/leggere/i.test(h.testo)) { h.ora = '22:00'; h.durata = 30; }
    });

    /* esperimento demo: sport al mattino → focus */
    s.esperimenti.push({
      id: uid() + 'exp1',
      nome: 'Fare sport al mattino aumenta il mio focus?',
      intervento: 'Allenamento o camminata veloce prima delle 10:00, poi sessione di lavoro.',
      metrica: 'focus',
      areaId: null,
      inizioBaseline: giorni[14],
      inizioIntervento: giorni[28],
      fine: giorni[52],
      stato: 'concluso'
    });
    s.esperimenti.push({
      id: uid() + 'exp2',
      nome: 'Telefono fuori stanza mentre studio',
      intervento: 'Telefono in un’altra stanza durante le sessioni di studio del pomeriggio.',
      metrica: 'minuti',
      areaId: 'studio',
      inizioBaseline: giorni[42],
      inizioIntervento: giorni[49],
      fine: null,
      stato: 'attivo'
    });

    s.registro = []; // la demo parte con un diario-registro pulito
    save();
  }

  /* ---------- API pubblica ---------- */

  return {
    AREE_DEFAULT: AREE_DEFAULT,
    SLOT_COLORI: SLOT_COLORI,
    METRICHE_ESPERIMENTO: METRICHE_ESPERIMENTO,
    XP_EVENTI: XP_EVENTI,
    load: load, save: save, reset: reset, seedDemo: seedDemo, hydrate: hydrate, snapshot: snapshot,
    backup: backup, listBackups: listBackups, restoreBackup: restoreBackup, ricchezza: ricchezza,
    exportJson: exportJson, importJson: importJson, ripristinaStato: ripristinaStato,
    puntoDiRitorno: puntoDiRitorno, puntiDiRitorno: puntiDiRitorno,
    tornaAlPunto: tornaAlPunto, annullaRecord: annullaRecord, scordaPunti: scordaPunti,
    todayKey: todayKey, dayKey: dayKey, addDays: addDays, lastNDays: lastNDays,
    weekKey: weekKey, weekdayShort: weekdayShort, fmtShort: fmtShort, daysBetween: daysBetween,
    coloreArea: coloreArea, livelloDaXp: livelloDaXp,
    aggiungiAzione: aggiungiAzione, completaAzione: completaAzione, rimandaAzione: rimandaAzione,
    cattura: cattura, triageInbox: triageInbox, modificaInbox: modificaInbox, cambiaAreaAzione: cambiaAreaAzione,
    modificaAzione: modificaAzione, rimuoviAzione: rimuoviAzione, serveMit: serveMit,
    spostaAzione: spostaAzione, rimandaNonFatte: rimandaNonFatte, azioneInBacklog: azioneInBacklog,
    setOraAzione: setOraAzione, setDurataAzione: setDurataAzione, azioniDelGiorno: azioniDelGiorno,
    impostaRitmo: impostaRitmo, impostaGiornataPos: impostaGiornataPos, RITMO_DEFAULT: RITMO_DEFAULT,
    ritmoDi: ritmoDi, setRitmoGiorno: setRitmoGiorno, azzeraRitmoGiorno: azzeraRitmoGiorno, minutiSonno: minutiSonno,
    aggiungiBacklog: aggiungiBacklog, modificaBacklog: modificaBacklog, cambiaAreaBacklog: cambiaAreaBacklog,
    rimuoviBacklog: rimuoviBacklog, backlogInOggi: backlogInOggi, backlogPerArea: backlogPerArea,
    aggiungiPasso: aggiungiPasso, modificaPasso: modificaPasso, rimuoviPasso: rimuoviPasso, togglePasso: togglePasso,
    distribuisciPassi: distribuisciPassi, backlogInAbitudine: backlogInAbitudine, pianificaPasso: pianificaPasso,
    avanzamentoProgetto: avanzamentoProgetto, prossimoPassoInOggi: prossimoPassoInOggi,
    impostaScadenzaBacklog: impostaScadenzaBacklog, scadenzeVicine: scadenzeVicine,
    appuntaBacklog: appuntaBacklog, importanzaBacklog: importanzaBacklog,
    backlogPerImportanza: backlogPerImportanza, azioniDiBacklog: azioniDiBacklog,
    aggiungiAbitudine: aggiungiAbitudine, modificaAbitudine: modificaAbitudine, rimuoviAbitudine: rimuoviAbitudine,
    abitudinePrevista: abitudinePrevista, abitudiniDiOggi: abitudiniDiOggi, completaAbitudine: completaAbitudine, streakAbitudine: streakAbitudine,
    impostaPeriodoAbitudine: impostaPeriodoAbitudine, saltaGiornoAbitudine: saltaGiornoAbitudine,
    recordAbitudine: recordAbitudine, prossimaAbitudine: prossimaAbitudine,
    rinominaArea: rinominaArea, modificaRegolaArea: modificaRegolaArea, toggleArea: toggleArea,
    aggiungiArea: aggiungiArea, rimuoviArea: rimuoviArea, baselineCheckin: baselineCheckin,
    registraCheckin: registraCheckin, salvaPianoMattina: salvaPianoMattina,
    valutaArea: valutaArea, registraMinuti: registraMinuti,
    salvaReviewSera: salvaReviewSera, salvaReviewSettimana: salvaReviewSettimana,
    azioniDiOggi: azioniDiOggi, prossimaAzione: prossimaAzione, azioneAdesso: azioneAdesso,
    giornoAttivo: giornoAttivo, streak: streak,
    serieValutazioni: serieValutazioni, serieMinuti: serieMinuti, serieCheckin: serieCheckin,
    serieXp: serieXp, heatmapConsistenza: heatmapConsistenza,
    minutiSettimanaPerArea: minutiSettimanaPerArea, mediaValutazioneArea: mediaValutazioneArea,
    diario: diario, giorniConAttivita: giorniConAttivita, registra: registra,
    creaEsperimento: creaEsperimento, risultatiEsperimento: risultatiEsperimento,
    uid: uid
  };
})();
