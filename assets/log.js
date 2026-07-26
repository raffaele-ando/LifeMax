/* ============================================================
   LifeMax — registro diagnostico
   Una console interna che scrive tutto quello che succede sotto il
   cofano: salvataggi, cloud, accesso, rete, errori JavaScript.

   Perché esiste: quando l'app dice "Salvataggio…" e non cambia più,
   dall'esterno non si capisce se il dato è al sicuro o perso. Una
   riga di stato non basta; serve la cronologia. E siccome il
   problema si vede sul telefono — dove non c'è nessuna console per
   sviluppatori — il registro deve stare dentro l'app, con un
   pulsante che copia tutto in un colpo.

   Va caricato PRIMO, prima di ogni altro script, così cattura anche
   gli errori dei moduli che si caricano dopo.
   ============================================================ */

(function () {
  'use strict';

  var MAX = 500;            // righe tenute in memoria
  var MAX_SALVATE = 150;    // righe che sopravvivono a un ricaricamento
  var TETTO_BYTE = 24000;   // tetto duro: il registro non deve mai rubare spazio ai dati
  var CHIAVE = 'lifemax.log.v1';
  var T0 = Date.now();

  var righe = [];
  var salvaTimer = null;
  var soloMemoria = false;  // se lo spazio è agli sgoccioli si smette di scrivere su disco

  /* ---------- persistenza ----------
     Il registro serve soprattutto DOPO: "prima si era piantato".
     Se sparisse a ogni ricaricamento sarebbe inutile proprio nel
     momento in cui serve. Lo teniamo in localStorage, troncato. */
  try {
    var vecchie = JSON.parse(localStorage.getItem(CHIAVE) || '[]');
    if (Array.isArray(vecchie)) {
      righe = vecchie.slice(-MAX_SALVATE);
      if (righe.length) righe.push(riga('info', 'sessione', '— nuova sessione: righe sopra da una sessione precedente —'));
    }
  } catch (e) { righe = []; }

  function salvaDopo() {
    if (soloMemoria || salvaTimer) return;
    salvaTimer = setTimeout(function () {
      salvaTimer = null;
      if (soloMemoria) return;
      try {
        var n = MAX_SALVATE, testo = JSON.stringify(righe.slice(-n));
        /* sotto il tetto a forza di dimezzare: meglio un registro corto che un
           salvataggio dei dati che non entra più */
        while (testo.length > TETTO_BYTE && n > 20) { n = Math.floor(n / 2); testo = JSON.stringify(righe.slice(-n)); }
        localStorage.setItem(CHIAVE, testo);
      } catch (e) { soloMemoria = true; }
    }, 600);
  }

  /* Se il salvataggio dei DATI non entra più, il registro si fa da parte
     subito: è uno strumento di servizio, non può essere la causa del guasto
     che dovrebbe aiutare a capire. */
  function cedilPosto() {
    soloMemoria = true;
    try { localStorage.removeItem(CHIAVE); } catch (e) { /* ignora */ }
    aggiungi('avviso', 'registro', 'Spazio agli sgoccioli: il registro resta solo in memoria e non occupa più disco');
  }

  function riga(livello, canale, msg, dati) {
    return { t: Date.now(), ms: Date.now() - T0, liv: livello, can: canale, msg: String(msg == null ? '' : msg), dati: pulisci(dati) };
  }

  /* i dati allegati devono essere sempre serializzabili e mai enormi */
  function pulisci(d) {
    if (d === undefined || d === null) return '';
    if (typeof d === 'string') return d.length > 600 ? d.slice(0, 600) + '…' : d;
    if (typeof d === 'number' || typeof d === 'boolean') return String(d);
    try {
      var s = JSON.stringify(d, function (k, v) {
        if (typeof v === 'string' && v.length > 200) return v.slice(0, 200) + '…';
        return v;
      });
      return s && s.length > 600 ? s.slice(0, 600) + '…' : (s || '');
    } catch (e) { return '[non serializzabile]'; }
  }

  function aggiungi(livello, canale, msg, dati) {
    var r = riga(livello, canale, msg, dati);
    righe.push(r);
    if (righe.length > MAX) righe.splice(0, righe.length - MAX);
    salvaDopo();
    try { window.dispatchEvent(new CustomEvent('lm:log', { detail: r })); } catch (e) { /* ignora */ }
    return r;
  }

  /* ---------- formattazione ---------- */

  function ora(t) {
    var d = new Date(t);
    function p(n, l) { return String(n).padStart(l || 2, '0'); }
    return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()) + '.' + p(d.getMilliseconds(), 3);
  }

  function mascheraEmail(e) {
    if (!e || e.indexOf('@') < 0) return e || '';
    var p = e.split('@');
    return p[0].slice(0, 2) + '***@' + p[1];
  }

  /* Fotografia dell'ambiente: metà delle segnalazioni si risolvono
     qui (modalità app installata, spazio localStorage, offline…). */
  function ambiente() {
    var a = [];
    function add(k, v) { a.push(k + ': ' + v); }
    add('quando', new Date().toString());
    add('url', location.href);
    add('userAgent', navigator.userAgent);
    add('lingua', navigator.language || '?');
    add('fuso', (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { return '?'; } })());
    add('schermo', window.innerWidth + '×' + window.innerHeight + ' @' + (window.devicePixelRatio || 1) + 'x');
    add('online', String(navigator.onLine));
    add('installata (standalone)', String(
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true
    ));
    add('puntatore', (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ? 'tocco' : 'preciso');
    add('cookie/storage abilitati', String(navigator.cookieEnabled));
    try {
      var tot = 0, mio = 0;
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i), v = localStorage.getItem(k) || '';
        tot += k.length + v.length;
        if (k.indexOf('lifemax') === 0) mio += k.length + v.length;
      }
      add('localStorage', Math.round(tot / 1024) + ' KB in totale, ' + Math.round(mio / 1024) + ' KB di LifeMax');
    } catch (e) { add('localStorage', 'non accessibile (' + (e && e.message) + ')'); }
    try {
      var s = window.LM && LM.load();
      if (s) {
        add('dati', 'inbox ' + (s.inbox || []).length + ' · azioni ' + (s.azioni || []).length +
          ' · abitudini ' + (s.abitudini || []).length + ' · backlog ' + (s.backlog || []).length +
          ' · misure ' + Object.keys(s.misure || {}).length);
        add('ultima modifica locale', s.updatedAt ? new Date(s.updatedAt).toLocaleString('it-IT') : 'mai');
      }
    } catch (e) { /* ignora */ }
    var au = window.LM_AUTH || {};
    add('cloud disponibile', String(!!au.available));
    add('account', au.user ? mascheraEmail(au.user.email) : 'non connesso');
    var sy = window.LM_SYNC;
    add('stato sync', (sy && sy.state) || 'sconosciuto');
    if (sy && sy.error) add('ultimo errore sync', sy.error);
    if (sy && sy.at) add('ultima conferma dal cloud', new Date(sy.at).toLocaleString('it-IT'));
    return a.join('\n');
  }

  function testo() {
    var corpo = righe.map(function (r) {
      return ora(r.t) + '  +' + String(Math.round(r.ms / 100) / 10) + 's  [' + r.liv.toUpperCase() + '] ' +
        r.can + ' — ' + r.msg + (r.dati ? '  ' + r.dati : '');
    }).join('\n');
    return 'LifeMax — registro diagnostico\n' +
      '================================\n' + ambiente() +
      '\n\nCRONOLOGIA (' + righe.length + ' righe)\n' +
      '--------------------------------\n' + (corpo || '(vuoto)') + '\n';
  }

  /* ---------- cattura automatica ---------- */

  window.addEventListener('error', function (e) {
    if (e && e.target && e.target !== window && e.target.tagName) {
      aggiungi('errore', 'risorsa', 'Risorsa non caricata: ' + (e.target.src || e.target.href || e.target.tagName));
      return;
    }
    aggiungi('errore', 'js', (e && e.message) || 'Errore sconosciuto',
      e && e.filename ? (e.filename.split('/').pop() + ':' + e.lineno + ':' + e.colno) : '');
  }, true);

  window.addEventListener('unhandledrejection', function (e) {
    var r = e && e.reason;
    aggiungi('errore', 'promessa', (r && (r.message || r.code)) || String(r), r && r.stack ? String(r.stack).split('\n')[1] : '');
  });

  /* Anche i console.warn/error passano dal registro: molti moduli
     (Firebase compreso) parlano solo attraverso la console. */
  ['warn', 'error'].forEach(function (m) {
    var orig = console[m];
    console[m] = function () {
      try {
        var parti = Array.prototype.slice.call(arguments).map(function (x) {
          if (typeof x === 'string') return x;
          if (x instanceof Error) return x.message;
          try { return JSON.stringify(x); } catch (e) { return String(x); }
        });
        aggiungi(m === 'error' ? 'errore' : 'avviso', 'console', parti.join(' '));
      } catch (e) { /* mai far fallire una console.log */ }
      return orig.apply(console, arguments);
    };
  });

  window.addEventListener('online', function () { aggiungi('info', 'rete', 'Rete tornata disponibile'); });
  window.addEventListener('offline', function () { aggiungi('avviso', 'rete', 'Rete assente'); });

  window.addEventListener('lm:sync', function (e) {
    var d = (e && e.detail) || {};
    aggiungi(d.state === 'error' || d.state === 'muto' ? 'errore' : (d.state === 'attesa' ? 'avviso' : 'info'),
      'sync', 'stato → ' + d.state + (d.error ? ' — ' + d.error : ''));
  });

  window.addEventListener('lm:auth', function () {
    var a = window.LM_AUTH || {};
    aggiungi('info', 'account', a.user ? ('connesso come ' + mascheraEmail(a.user.email)) :
      (a.available ? 'non connesso (cloud disponibile)' : 'cloud non disponibile'));
  });

  window.addEventListener('lm:remote', function () { aggiungi('info', 'cloud', 'Ricevuto aggiornamento da un altro dispositivo'); });

  document.addEventListener('lm:errore-salvataggio', function () {
    aggiungi('errore', 'locale', 'Salvataggio su questo dispositivo non riuscito (spazio esaurito?)');
    if (!soloMemoria) cedilPosto();
  });

  var nCambi = 0, cambiTimer = null;
  document.addEventListener('lm:change', function () {
    nCambi++;
    clearTimeout(cambiTimer);
    /* le modifiche arrivano a raffica: le raggruppiamo, altrimenti il
       registro diventa illeggibile proprio quando serve leggerlo */
    cambiTimer = setTimeout(function () {
      aggiungi('info', 'dati', nCambi === 1 ? 'Modifica salvata sul dispositivo' : nCambi + ' modifiche salvate sul dispositivo');
      nCambi = 0;
    }, 500);
  });

  window.addEventListener('hashchange', function () { aggiungi('info', 'navigazione', location.hash || '#/'); });

  document.addEventListener('visibilitychange', function () {
    aggiungi('info', 'app', document.hidden ? 'in secondo piano' : 'in primo piano');
  });

  window.addEventListener('load', function () {
    try {
      var n = performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
      aggiungi('info', 'app', 'Pagina caricata' + (n ? ' in ' + Math.round(n.duration) + ' ms (' + n.type + ')' : ''));
    } catch (e) { aggiungi('info', 'app', 'Pagina caricata'); }
  });

  aggiungi('info', 'app', 'Registro avviato');

  window.LMLog = {
    add: aggiungi,
    info: function (c, m, d) { return aggiungi('info', c, m, d); },
    avviso: function (c, m, d) { return aggiungi('avviso', c, m, d); },
    errore: function (c, m, d) { return aggiungi('errore', c, m, d); },
    righe: function () { return righe.slice(); },
    ora: ora,
    ambiente: ambiente,
    testo: testo,
    svuota: function () {
      righe = [aggiungi('info', 'registro', 'Registro svuotato dall’utente')];
      try { localStorage.setItem(CHIAVE, JSON.stringify(righe)); } catch (e) { /* ignora */ }
    }
  };
})();
