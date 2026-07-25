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
    { id: 'altro',        nome: 'Altro / Esplorazione',icona: 'sparkles',  slot: 8, sistema: 'Spazio libero per la novità: una cosa nuova a settimana' }
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
    return s;
  }

  function save() {
    if (state) state.updatedAt = Date.now();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* quota: il prototipo resta in RAM */ }
    document.dispatchEvent(new CustomEvent('lm:change'));
  }

  function reset() {
    backup('prima-azzeramento');
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
  function importJson(text) {
    var obj;
    try { obj = JSON.parse(text); } catch (e) { return { ok: false, err: 'File non valido: non è JSON leggibile.' }; }
    var st = (obj && obj.stato) ? obj.stato : obj; // accetta il file esportato o lo stato nudo
    if (!st || typeof st !== 'object' || !Array.isArray(st.azioni)) {
      return { ok: false, err: 'Il file non contiene dati LifeMax.' };
    }
    backup('prima-import');
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
  function registra(cat, testo, imp) {
    var s = load();
    if (!Array.isArray(s.registro)) s.registro = [];
    s.registro.push({ ts: Date.now(), cat: cat, testo: testo, imp: !!imp });
    if (s.registro.length > 800) s.registro = s.registro.slice(-800);
  }

  function aggiungiAzione(testo, areaId, opts) {
    var s = load();
    opts = opts || {};
    var a = {
      id: uid(),
      areaId: areaId || 'altro',
      testo: testo,
      ifThen: opts.ifThen || '',
      mit: !!opts.mit,
      done: false,
      data: opts.data || todayKey(),
      doneAt: null,
      creata: Date.now(),
      ora: opts.ora || null,          // 'HH:MM' se ha un orario nella giornata
      durata: opts.durata || null,    // minuti che occupa (per i blocchi della timeline)
      passoDi: opts.passoDi || null   // {b: idProgetto, s: idPasso} se nasce da un progetto
    };
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
    a.doneAt = Date.now();
    var punti = premiaXp(a.mit ? 'mit' : 'azione');
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
    if (!interna) registra('backlog', 'Aggiunta tra le cose da fare: «' + testo + '»', false);
    save();
    return b;
  }
  function modificaBacklog(id, testo) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === id; });
    if (!b) return; b.testo = testo; registra('backlog', 'Modificata una cosa da fare → «' + testo + '»', false); save();
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
    if (i >= 0) { registra('backlog', 'Eliminata la cosa da fare «' + s.backlog[i].testo + '»', true); s.backlog.splice(i, 1); save(); }
  }
  /* porta un elemento del backlog tra le azioni di oggi (senza XP: è solo
     spostamento). mit true se oggi non c'è ancora nessuna azione. */
  function backlogInOggi(id) {
    var s = load();
    var i = s.backlog.findIndex(function (x) { return x.id === id; });
    if (i < 0) return null;
    var b = s.backlog.splice(i, 1)[0];
    var mit = azioniDiOggi().filter(function (a) { return !a.done; }).length === 0;
    var a = aggiungiAzione(b.testo, b.areaId, { mit: mit, interna: true });
    registra('azione', 'Portata in Oggi: «' + b.testo + '»', true);
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
  function prossimoPassoInOggi(bid) {
    var s = load();
    var b = s.backlog.find(function (x) { return x.id === bid; });
    if (!b || !b.steps) return null;
    var giaOggi = {};
    azioniDiOggi().forEach(function (a) { if (!a.done && a.passoDi && a.passoDi.b === bid) giaOggi[a.passoDi.s] = true; });
    var st = b.steps.find(function (x) { return !x.done && !giaOggi[x.id]; });
    if (!st) return null;
    var mit = azioniDiOggi().filter(function (a) { return !a.done; }).length === 0;
    var az = aggiungiAzione(st.testo, b.areaId, { mit: mit, passoDi: { b: bid, s: st.id }, interna: true });
    registra('azione', 'Portato in Oggi il passo di «' + b.testo + '»: ' + st.testo, true);
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
    var h = { id: uid(), testo: testo, areaId: areaId || 'salute', giorni: Array.isArray(giorni) ? giorni : [], ora: (opts && opts.ora) || null, durata: (opts && opts.durata) || null, creata: Date.now(), fatti: {} };
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
    registra('abitudine', 'Modificata l’abitudine «' + h.testo + '»', false);
    save();
  }
  function rimuoviAbitudine(id) {
    var s = load();
    var i = s.abitudini.findIndex(function (x) { return x.id === id; });
    if (i >= 0) { registra('abitudine', 'Eliminata l’abitudine «' + s.abitudini[i].testo + '»', true); s.abitudini.splice(i, 1); save(); }
  }
  /* prevista in un dato giorno? giorni vuoto = ogni giorno */
  function abitudinePrevista(h, k) {
    k = k || todayKey();
    if (!h.giorni || !h.giorni.length) return true;
    return h.giorni.indexOf(parseKey(k).getDay()) >= 0;
  }
  function abitudiniDiOggi() {
    var k = todayKey();
    return load().abitudini.filter(function (h) { return abitudinePrevista(h, k); });
  }
  /* completa/annulla l'abitudine per oggi (toggle) */
  function completaAbitudine(id) {
    var s = load();
    var h = s.abitudini.find(function (x) { return x.id === id; });
    if (!h) return 0;
    var k = todayKey();
    if (h.fatti[k]) {
      delete h.fatti[k];
      togliXp(XP_EVENTI.abitudine, k);
      registra('abitudine', 'Tolta la spunta a «' + h.testo + '» (−' + XP_EVENTI.abitudine + ' XP)', false);
      save();
      return -XP_EVENTI.abitudine;
    }
    h.fatti[k] = true;
    var punti = premiaXp('abitudine');
    registra('abitudine', 'Fatta l’abitudine «' + h.testo + '»', true);
    save();
    return punti;
  }
  /* serie di giorni previsti consecutivi completati, con grazia per oggi
     (oggi non ancora fatto non rompe la serie) */
  function streakAbitudine(h) {
    var oggi = todayKey(), k = oggi, count = 0;
    for (var i = 0; i < 400; i++) {
      if (abitudinePrevista(h, k)) {
        if (h.fatti[k]) count++;
        else if (k !== oggi) break;
      }
      k = addDays(k, -1);
    }
    return count;
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
    s.aree.push({ id: id, nome: nome.trim() || 'Nuova area', icona: icona || 'sparkles', slot: scelto, sistema: '' });
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

  function prossimaAzione() {
    var oggi = azioniDiOggi().filter(function (a) { return !a.done; });
    var mit = oggi.find(function (a) { return a.mit; });
    return mit || oggi[0] || null;
  }

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

    /* registro di tutto ciò che è stato fatto: di default solo le cose
       importanti; con `tutto` anche le minori (impostazioni, modifiche…). */
    (s.registro || []).forEach(function (rg) {
      if (!tutto && !rg.imp) return;
      agg(dayKey(new Date(rg.ts)), { ts: rg.ts, tipo: 'registro', cat: rg.cat, testo: rg.testo, imp: rg.imp });
    });

    s.azioni.forEach(function (a) {
      if (!a.done) return;
      var k = a.doneAt ? dayKey(new Date(a.doneAt)) : a.data;
      agg(k, { ts: a.doneAt || parseKey(a.data).getTime() + 12 * 3600000, tipo: 'azione', id: a.id, testo: a.testo, areaId: a.areaId, mit: a.mit });
    });
    s.checkins.forEach(function (c) {
      agg(c.data, { ts: c.ts || parseKey(c.data).getTime(), tipo: 'checkin', energia: c.energia, focus: c.focus, umore: c.umore });
    });
    Object.keys(s.pianoMattina).forEach(function (k) {
      var p = s.pianoMattina[k];
      agg(k, { ts: p.ts || parseKey(k).getTime() + 8 * 3600000, tipo: 'mattina', intenzione: p.intenzione });
    });
    Object.keys(s.reviewSera).forEach(function (k) {
      var r = s.reviewSera[k];
      agg(k, { ts: r.ts || parseKey(k).getTime() + 21 * 3600000, tipo: 'sera', vittoria: r.vittoria, blocco: r.blocco });
    });
    Object.keys(s.reviewSettimana).forEach(function (k) {
      var r = s.reviewSettimana[k];
      agg(k, { ts: r.ts || parseKey(k).getTime() + 20 * 3600000, tipo: 'settimana', vittorie: r.vittorie, blocchi: r.blocchi, imparato: r.imparato, prossima: r.prossima });
    });
    s.inbox.forEach(function (el) {
      agg(dayKey(new Date(el.creata)), { ts: el.creata, tipo: 'cattura', testo: el.testo });
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
      s.abitudini.push({ id: uid() + 'ab' + i, testo: h[1], areaId: h[0], giorni: h[2], creata: Date.now(), fatti: fatti });
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
    exportJson: exportJson, importJson: importJson,
    todayKey: todayKey, dayKey: dayKey, addDays: addDays, lastNDays: lastNDays,
    weekKey: weekKey, weekdayShort: weekdayShort, fmtShort: fmtShort, daysBetween: daysBetween,
    coloreArea: coloreArea, livelloDaXp: livelloDaXp,
    aggiungiAzione: aggiungiAzione, completaAzione: completaAzione, rimandaAzione: rimandaAzione,
    cattura: cattura, triageInbox: triageInbox, modificaInbox: modificaInbox, cambiaAreaAzione: cambiaAreaAzione,
    setOraAzione: setOraAzione, setDurataAzione: setDurataAzione, azioniDelGiorno: azioniDelGiorno,
    impostaRitmo: impostaRitmo, impostaGiornataPos: impostaGiornataPos, RITMO_DEFAULT: RITMO_DEFAULT,
    ritmoDi: ritmoDi, setRitmoGiorno: setRitmoGiorno, azzeraRitmoGiorno: azzeraRitmoGiorno, minutiSonno: minutiSonno,
    aggiungiBacklog: aggiungiBacklog, modificaBacklog: modificaBacklog, cambiaAreaBacklog: cambiaAreaBacklog,
    rimuoviBacklog: rimuoviBacklog, backlogInOggi: backlogInOggi, backlogPerArea: backlogPerArea,
    aggiungiPasso: aggiungiPasso, modificaPasso: modificaPasso, rimuoviPasso: rimuoviPasso, togglePasso: togglePasso,
    avanzamentoProgetto: avanzamentoProgetto, prossimoPassoInOggi: prossimoPassoInOggi,
    impostaScadenzaBacklog: impostaScadenzaBacklog, scadenzeVicine: scadenzeVicine,
    aggiungiAbitudine: aggiungiAbitudine, modificaAbitudine: modificaAbitudine, rimuoviAbitudine: rimuoviAbitudine,
    abitudinePrevista: abitudinePrevista, abitudiniDiOggi: abitudiniDiOggi, completaAbitudine: completaAbitudine, streakAbitudine: streakAbitudine,
    rinominaArea: rinominaArea, modificaRegolaArea: modificaRegolaArea, toggleArea: toggleArea,
    aggiungiArea: aggiungiArea, rimuoviArea: rimuoviArea, baselineCheckin: baselineCheckin,
    registraCheckin: registraCheckin, salvaPianoMattina: salvaPianoMattina,
    valutaArea: valutaArea, registraMinuti: registraMinuti,
    salvaReviewSera: salvaReviewSera, salvaReviewSettimana: salvaReviewSettimana,
    azioniDiOggi: azioniDiOggi, prossimaAzione: prossimaAzione,
    giornoAttivo: giornoAttivo, streak: streak,
    serieValutazioni: serieValutazioni, serieMinuti: serieMinuti, serieCheckin: serieCheckin,
    serieXp: serieXp, heatmapConsistenza: heatmapConsistenza,
    minutiSettimanaPerArea: minutiSettimanaPerArea, mediaValutazioneArea: mediaValutazioneArea,
    diario: diario, giorniConAttivita: giorniConAttivita, registra: registra,
    creaEsperimento: creaEsperimento, risultatiEsperimento: risultatiEsperimento,
    uid: uid
  };
})();
