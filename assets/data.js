/* ============================================================
   LifeMax — livello dati
   Stato unico in localStorage, selettori per le viste,
   motore XP / streak gentile / esperimenti N-of-1.
   Nessuna dipendenza esterna.
   ============================================================ */
'use strict';

var LM = (function () {

  var STORAGE_KEY = 'lifemax.v1';

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
    { id: 'studio',       nome: 'Studio / Università', icona: '📚', slot: 1, sistema: 'Sessioni di studio profondo pianificate la sera prima' },
    { id: 'salute',       nome: 'Salute & Sport',      icona: '💪', slot: 2, sistema: 'Allenamento o camminata prima delle 10:00' },
    { id: 'relazioni',    nome: 'Relazioni & Sociale', icona: '🤝', slot: 3, sistema: 'Un contatto significativo al giorno' },
    { id: 'finanze',      nome: 'Finanze',             icona: '💶', slot: 4, sistema: 'Revisione spese ogni domenica sera' },
    { id: 'associazioni', nome: 'Associazioni',        icona: '🏛️', slot: 5, sistema: 'Blocco settimanale dedicato, non frammentato' },
    { id: 'founder',      nome: 'Progetti Founder',    icona: '🚀', slot: 6, sistema: 'Prima ora del mattino sul progetto, prima delle mail' },
    { id: 'lavoro',       nome: 'Lavoro',              icona: '💼', slot: 7, sistema: 'Chiusura giornata con lista per domani' },
    { id: 'altro',        nome: 'Altro / Esplorazione',icona: '✨', slot: 8, sistema: 'Spazio libero per la novità: una cosa nuova a settimana' }
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
    triage: 2         // smistare un elemento dall'inbox
  };

  function livelloDaXp(xp) {
    var lvl = Math.floor(Math.sqrt(Math.max(0, xp) / 50)) + 1;
    var base = 50 * (lvl - 1) * (lvl - 1);
    var next = 50 * lvl * lvl;
    return { livello: lvl, base: base, prossimo: next, pct: Math.min(1, (xp - base) / (next - base)) };
  }

  /* ---------- stato ---------- */

  function statoVuoto() {
    return {
      versione: 1,
      onboarded: false,
      demo: false,
      profilo: { nome: '', visione: '', skin: 'quiete', modo: 'auto' },
      aree: JSON.parse(JSON.stringify(AREE_DEFAULT)),
      areeAttive: AREE_DEFAULT.map(function (a) { return a.id; }),
      azioni: [],        // {id, areaId, testo, ifThen, mit, done, data, doneAt, creata}
      inbox: [],         // {id, testo, creata, area?}
      checkins: [],      // {data, ts, energia, focus, umore, contesto}
      valutazioni: {},   // valutazioni[data][areaId] = 1..5 (sera)
      minuti: {},        // minuti[data][areaId] = minuti dedicati
      pianoMattina: {},  // pianoMattina[data] = {compilato:true, intenzione}
      reviewSera: {},    // reviewSera[data] = {vittoria, blocco, shutdown}
      reviewSettimana: {}, // reviewSettimana[lunedì] = {vittorie, blocchi, imparato, prossima}
      esperimenti: [],   // vedi motore N-of-1 sotto
      xp: 0,
      xpPerGiorno: {},   // xpPerGiorno[data] = n
      log: []            // eventi recenti per feedback immediato
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
    return state;
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* quota: il prototipo resta in RAM */ }
    document.dispatchEvent(new CustomEvent('lm:change'));
  }

  function reset() {
    state = statoVuoto();
    save();
  }

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
      creata: Date.now()
    };
    s.azioni.push(a);
    save();
    return a;
  }

  function completaAzione(id) {
    var s = load();
    var a = s.azioni.find(function (x) { return x.id === id; });
    if (!a || a.done) return 0;
    a.done = true;
    a.doneAt = Date.now();
    var punti = premiaXp(a.mit ? 'mit' : 'azione');
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

  function triageInbox(id, esito, areaId) {
    /* esito: 'azione' | 'scarta' | 'tieni' */
    var s = load();
    var i = s.inbox.findIndex(function (x) { return x.id === id; });
    if (i < 0) return;
    var el = s.inbox[i];
    if (esito === 'azione') {
      s.inbox.splice(i, 1);
      aggiungiAzione(el.testo, areaId);
      premiaXp('triage');
    } else if (esito === 'scarta') {
      s.inbox.splice(i, 1);
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

  /* ---------- motore esperimenti (N-of-1) ---------- */
  /* Un esperimento confronta una metrica esistente tra una fase di
     baseline (A) e una di intervento (B). Onestà scientifica:
     niente p-value su 10 punti — riportiamo medie, differenza e
     un effect size con l'avvertenza esplicita dei limiti. */

  var METRICHE_ESPERIMENTO = [
    { id: 'focus',   nome: 'Focus medio (check-in 1–5)',   fonte: 'checkin', campo: 'focus' },
    { id: 'energia', nome: 'Energia media (check-in 1–5)', fonte: 'checkin', campo: 'energia' },
    { id: 'umore',   nome: 'Umore medio (check-in 1–5)',   fonte: 'checkin', campo: 'umore' },
    { id: 'voto',    nome: 'Auto-valutazione area (1–5)',  fonte: 'valutazione' },
    { id: 'minuti',  nome: 'Minuti dedicati a un’area',fonte: 'minuti' },
    { id: 'xp',      nome: 'XP del giorno (output totale)', fonte: 'xp' }
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
          s.pianoMattina[k] = { compilato: true, intenzione: 'Se alle 9:00 sono alla scrivania, allora inizio dalla MIT senza aprire chat.', ts: parseKey(k).getTime() + 8 * 3600000 };
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
          imparato: 'Il contesto batte la forza di volontà: dove studio decide quanto studio.',
          prossima: 'Proteggere la prima ora del mattino, 5 giorni su 7.',
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

    /* esperimento demo: sport al mattino → focus */
    s.esperimenti.push({
      id: uid() + 'exp1',
      nome: 'Sport al mattino → più focus?',
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

    save();
  }

  /* ---------- API pubblica ---------- */

  return {
    AREE_DEFAULT: AREE_DEFAULT,
    SLOT_COLORI: SLOT_COLORI,
    METRICHE_ESPERIMENTO: METRICHE_ESPERIMENTO,
    XP_EVENTI: XP_EVENTI,
    load: load, save: save, reset: reset, seedDemo: seedDemo,
    todayKey: todayKey, dayKey: dayKey, addDays: addDays, lastNDays: lastNDays,
    weekKey: weekKey, weekdayShort: weekdayShort, fmtShort: fmtShort, daysBetween: daysBetween,
    coloreArea: coloreArea, livelloDaXp: livelloDaXp,
    aggiungiAzione: aggiungiAzione, completaAzione: completaAzione, rimandaAzione: rimandaAzione,
    cattura: cattura, triageInbox: triageInbox,
    registraCheckin: registraCheckin, salvaPianoMattina: salvaPianoMattina,
    valutaArea: valutaArea, registraMinuti: registraMinuti,
    salvaReviewSera: salvaReviewSera, salvaReviewSettimana: salvaReviewSettimana,
    azioniDiOggi: azioniDiOggi, prossimaAzione: prossimaAzione,
    giornoAttivo: giornoAttivo, streak: streak,
    serieValutazioni: serieValutazioni, serieMinuti: serieMinuti, serieCheckin: serieCheckin,
    serieXp: serieXp, heatmapConsistenza: heatmapConsistenza,
    minutiSettimanaPerArea: minutiSettimanaPerArea, mediaValutazioneArea: mediaValutazioneArea,
    creaEsperimento: creaEsperimento, risultatiEsperimento: risultatiEsperimento,
    uid: uid
  };
})();
