/* I PROMEMORIA, DAL LATO DELL'APP
   Tre lavori, e nient'altro:
     1. registrare il service worker (senza di lui non esistono notifiche);
     2. chiedere il permesso — quando lo chiedi tu, non all'apertura;
     3. mandare al server il PIANO di oggi: a che ora, che cosa, e se è già
        fatto. Tutta la logica di «cosa vale la pena ricordare» sta qui, dove
        stanno i dati e le prove; il server fa solo il postino a orario.

   Senza server configurato funziona metà: il permesso si concede e le
   notifiche locali (il timer che finisce) arrivano. Le altre no, perché sul
   web non esiste un modo di programmare una notifica per domani alle 9:
   l'API che lo permetteva non è mai stata rilasciata. Serve un push da fuori.

   Il pannello sta in Impostazioni → Promemoria. */
(function () {
  'use strict';

  /* Dove sta il postino. Vuoto = niente push da fuori, e il pannello lo dice.
     Si riempie con l'indirizzo del Worker e la sua chiave pubblica VAPID. */
  var CONFIG = {
    server: '',      /* es. 'https://lifemax-promemoria.xxx.workers.dev' */
    chiave: ''       /* la chiave pubblica VAPID, base64url */
  };

  /* Si può anche riempire da fuori senza toccare il file, utile per provare
     prima di scriverlo qui dentro:
       localStorage.setItem('lifemax.promemoria.cfg',
         JSON.stringify({server:'https://…workers.dev', chiave:'B…'})) */
  try {
    var salvata = JSON.parse(localStorage.getItem('lifemax.promemoria.cfg') || 'null');
    if (salvata && salvata.server && salvata.chiave) {
      CONFIG.server = String(salvata.server).replace(/\/+$/, '');
      CONFIG.chiave = String(salvata.chiave);
    }
  } catch (e) {}

  var CHIAVE_ID = 'lifemax.promemoria.id';
  var CHIAVE_ULTIMO = 'lifemax.promemoria.ultimo';
  var reg = null;

  function stato() {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) return 'niente';
    if (!('PushManager' in window)) return 'niente';
    return Notification.permission;   /* 'default' | 'granted' | 'denied' */
  }

  function installata() {
    return window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
  }
  function iPhone() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }
  /* Su iOS il push arriva SOLO se l'app è nella schermata Home: da Safari come
     scheda normale il permesso non si può nemmeno chiedere. Dirlo prima è
     meglio che far premere un pulsante che non fa niente. */
  function serveInstallare() { return iPhone() && !installata(); }

  function idDispositivo() {
    var v = null;
    try { v = localStorage.getItem(CHIAVE_ID); } catch (e) {}
    if (!v) {
      v = 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      try { localStorage.setItem(CHIAVE_ID, v); } catch (e) {}
    }
    return v;
  }

  function daBase64Url(s) {
    var p = (s + '='.repeat((4 - s.length % 4) % 4)).replace(/-/g, '+').replace(/_/g, '/');
    var b = atob(p), u = new Uint8Array(b.length);
    for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
    return u;
  }

  /* ---------- il service worker ---------- */
  function registra() {
    if (!('serviceWorker' in navigator)) return Promise.resolve(null);
    return navigator.serviceWorker.register('sw.js').then(function (r) {
      reg = r;
      return r;
    }).catch(function () { return null; });
  }

  /* toccando una notifica il service worker dice all'app dove andare */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', function (e) {
      if (e.data && e.data.lm === 'vai' && e.data.vai) location.hash = e.data.vai;
    });
  }

  /* ---------- il piano di oggi ---------- */
  /* Poche voci e ben scelte. Una notifica per ogni abitudine sarebbe rumore
     da ignorare entro tre giorni, e allora anche quelle che contano
     diventerebbero invisibili. Qui ci sono: i momenti del giorno che l'app
     già conosce, e un solo colpetto sulla priorità se nel pomeriggio è
     ancora intatta. */
  /* I TRE MOMENTI ANCORA APERTI.
     Sta qui, da solo, per un motivo preciso: lo vogliono in due posti — il
     piano da mandare al server e il conto delle cose che ti restano — e
     quando il conto lo chiedeva al piano e il piano lo chiedeva al conto,
     l'app si fermava con lo stack pieno appena si accendeva la nota fissa.
     Un pezzo condiviso non ha versi. */
  var ORE = { mattina: '08:30', checkin: '13:00', sera: '21:30' };
  function ritualiAperti() {
    if (!window.LM) return [];
    var s = LM.load();
    var oggi = LM.todayKey();
    var out = [];
    if (!(s.pianoMattina || {})[oggi]) {
      out.push({ id: 'mattina', ora: ORE.mattina,
        titolo: 'Cosa fai oggi', corpo: 'Scegli le azioni di oggi, e la prima cosa.', vai: '#/rituali' });
    }
    if (!(s.checkins || []).some(function (c) { return c.data === oggi; })) {
      out.push({ id: 'checkin', ora: ORE.checkin,
        titolo: 'Check-in', corpo: 'Come stai adesso? Trenta secondi.', vai: '#/rituali' });
    }
    if (!(s.reviewSera || {})[oggi]) {
      out.push({ id: 'sera', ora: ORE.sera,
        titolo: 'Com’è andata oggi', corpo: 'Una vittoria e un ostacolo. Due righe.', vai: '#/rituali' });
    }
    return out;
  }

  /* LE ABITUDINI CON UN ORARIO, ancora aperte oggi. Quelle senza orario non
     entrano nel piano (una notifica per ognuna sarebbe rumore) ma entrano nel
     conto: restano comunque cose aperte. */
  function abitudiniAperte(soloConOra) {
    if (!window.LM) return [];
    var s = LM.load();
    var oggi = LM.todayKey();
    return (s.abitudini || []).filter(function (h) {
      if (soloConOra && !h.ora) return false;
      if (!LM.abitudinePrevista(h, oggi)) return false;
      return !(h.fatti && h.fatti[oggi]);
    });
  }

  function piano() {
    if (!window.LM) return [];
    var s = LM.load();
    var oggi = LM.todayKey();
    var voci = [];

    /* Gli orari dei tre momenti. L'app non li tiene come dato: `ritualeDellOra`
       li ricava dall'ora (mattina prima di mezzogiorno, sera dalle 19). Qui
       servono precisi, quindi stanno scritti una volta sola e dentro quei
       confini. Il giorno in cui diventeranno modificabili, si leggono da lì. */
    ritualiAperti().forEach(function (r) {
      voci.push({ id: r.id, ora: r.ora, ripete: true, giorni: [],
        titolo: r.titolo, corpo: r.corpo, vai: r.vai });
    });

    /* `ripete` distingue le voci che valgono anche domani da quelle che valgono
       solo oggi. Serve perché il piano lo manda l'app, e l'app la apri tu: se
       stasera non la apro, domani mattina il server ha in mano il piano di
       ieri. I tre momenti e le abitudini valgono comunque — se l'app è rimasta
       chiusa, per definizione non li hai fatti. La priorità del giorno no:
       quella era una cosa scritta ieri, e ricordarla domani sarebbe una bugia. */

    /* la priorità del giorno, se a metà pomeriggio è ancora lì */
    var mit = (s.azioni || []).filter(function (a) { return a.data === oggi && a.mit && !a.done; })[0];
    if (mit) {
      voci.push({ id: 'mit', ora: '16:30', ripete: false, giorni: [],
        titolo: 'La cosa più importante di oggi', corpo: mit.testo, vai: '#/oggi' });
    }

    /* le abitudini CON un orario: sono quelle che hai deciso di ancorare a un
       momento, quindi sono quelle che vuoi sentirti ricordare. Le altre no:
       una notifica per ognuna sarebbe rumore da ignorare entro tre giorni, e
       allora anche quelle che contano diventerebbero invisibili. */
    abitudiniAperte(true).forEach(function (h) {
      voci.push({ id: 'ab-' + h.id, ora: h.ora, ripete: true, giorni: (h.giorni || []).slice(),
        titolo: h.testo, corpo: 'È l’ora.', vai: '#/rituali' });
    });

    /* La nota fissa, se accesa: una sola voce al giorno, di prima mattina.
       Dentro l'app si riscrive da sé a ogni cambiamento e non costa niente;
       questa serve per i giorni in cui l'app non la apri, che sono quelli in
       cui serve di più. */
    if (fissaAccesa()) {
      var t = testoFissa();
      voci.push({ id: 'stato', ora: '07:30', ripete: true, giorni: [], tipo: 'stato',
        titolo: t.titolo, corpo: t.corpo, vai: '#/oggi' });
    }

    return voci.sort(function (a, b) { return a.ora < b.ora ? -1 : (a.ora > b.ora ? 1 : 0); });
  }

  /* ---------- quante cose restano oggi ----------
     Serve a due cose che sono la stessa cosa vista da due lati: il numero sul
     pallino dell'icona e la riga della nota fissa. Si conta quello che è
     ancora aperto oggi — non quello che hai fatto, perché un contatore che
     sale premia il tenere aperte le cose. */
  function restano() {
    if (!window.LM) return { n: 0, righe: [] };
    var s = LM.load();
    var oggi = LM.todayKey();
    var righe = [];

    var az = (s.azioni || []).filter(function (a) { return a.data === oggi && !a.done; });
    var mit = az.filter(function (a) { return a.mit; })[0];
    if (mit) righe.push(mit.testo);
    else if (az.length) righe.push(az[0].testo);

    var ab = abitudiniAperte(false);
    var rit = ritualiAperti();

    var n = az.length + ab.length + rit.length;
    if (az.length > 1) righe.push('e altre ' + (az.length - 1));
    if (ab.length) righe.push(ab.length === 1 ? '1 abitudine' : ab.length + ' abitudini');
    if (rit.length) righe.push(rit.length === 1 ? '1 rituale' : rit.length + ' rituali');
    return { n: n, righe: righe };
  }

  /* Il pallino col numero sull'icona: l'unica cosa che resta a vista senza
     essere una notifica. Non si scarta e non fa rumore. Zero si toglie del
     tutto — un'icona pulita vuol dire «per oggi ci sei». */
  function segnaNumero() {
    var n = restano().n;
    try {
      if (!n && navigator.clearAppBadge) navigator.clearAppBadge();
      else if (navigator.setAppBadge) navigator.setAppBadge(n);
    } catch (e) {}
    return n;
  }

  /* ---------- la nota fissa ----------
     Una notifica sola, che si riscrive al posto di quella di prima e non fa
     rumore quando lo fa. Resta nell'elenco delle notifiche finché non la
     scarti tu. Si aggiorna da sola ogni volta che apri l'app o cambi
     qualcosa: quello non costa niente a nessuno, perché la pagina è aperta.
     Chi la vuole la accende: una notifica che resta lì è esattamente il tipo
     di cosa che non si mette senza chiedere. */
  var CHIAVE_FISSA = 'lifemax.promemoria.fissa';
  function fissaAccesa() {
    try { return localStorage.getItem(CHIAVE_FISSA) === '1'; } catch (e) { return false; }
  }
  function fissa(acceso) {
    try { localStorage.setItem(CHIAVE_FISSA, acceso ? '1' : '0'); } catch (e) {}
    if (acceso) scriviFissa();
    else togliFissa();
  }
  function testoFissa() {
    var r = restano();
    if (!r.n) return { titolo: 'Per oggi ci sei', corpo: 'Niente di aperto.' };
    return {
      titolo: r.righe[0] || (r.n + (r.n === 1 ? ' cosa aperta' : ' cose aperte')),
      corpo: r.righe.slice(1).join(' · ') || 'Tocca per aprire.'
    };
  }
  function scriviFissa() {
    if (!fissaAccesa() || stato() !== 'granted' || !reg || !reg.showNotification) return false;
    var t = testoFissa();
    reg.showNotification(t.titolo, {
      body: t.corpo, icon: 'assets/icone/icona-192.png', badge: 'assets/icone/badge-96.png',
      lang: 'it', tag: 'lifemax-stato', renotify: false, silent: true, requireInteraction: true,
      data: { vai: '#/oggi', tipo: 'stato' }
    });
    return true;
  }
  function togliFissa() {
    if (!reg || !reg.getNotifications) return;
    reg.getNotifications({ tag: 'lifemax-stato' }).then(function (l) {
      l.forEach(function (n) { n.close(); });
    }).catch(function () {});
  }

  /* ---------- iscrizione e invio del piano ---------- */
  function iscrivi() {
    if (!CONFIG.server || !CONFIG.chiave || !reg) return Promise.resolve(null);
    return reg.pushManager.getSubscription().then(function (s) {
      if (s) return s;
      return reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: daBase64Url(CONFIG.chiave)
      });
    });
  }

  var ultimoInvio = 0;
  function mandaPiano(forza) {
    if (!CONFIG.server || stato() !== 'granted') return Promise.resolve(false);
    var p = piano();
    /* il giorno sta dentro l'impronta: un piano identico a quello di ieri
       (perché ieri non hai aperto l'app) va comunque rimandato, altrimenti il
       server continua a credere che sia ancora ieri */
    var impronta = LM.todayKey() + '|' + JSON.stringify(p);
    var vecchia = null;
    try { vecchia = localStorage.getItem(CHIAVE_ULTIMO); } catch (e) {}
    /* Non si scrive per ogni battito: il piano si manda solo se è cambiato, e
       non più di una volta al minuto. Lo spazio gratuito di Cloudflare ha un
       tetto di scritture al giorno, e un'app che salva a ogni tocco lo
       finirebbe in un pomeriggio. */
    if (!forza && impronta === vecchia && Date.now() - ultimoInvio < 3600000) return Promise.resolve(false);
    if (!forza && Date.now() - ultimoInvio < 60000) return Promise.resolve(false);
    return iscrivi().then(function (sub) {
      if (!sub) return false;
      ultimoInvio = Date.now();
      return fetch(CONFIG.server + '/piano', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: idDispositivo(),
          iscrizione: sub.toJSON ? sub.toJSON() : sub,
          fuso: (Intl.DateTimeFormat().resolvedOptions() || {}).timeZone || 'Europe/Rome',
          giorno: LM.todayKey(),
          numero: restano().n,
          voci: p
        })
      }).then(function (r) {
        if (r.ok) { try { localStorage.setItem(CHIAVE_ULTIMO, impronta); } catch (e) {} }
        return r.ok;
      }).catch(function () { return false; });
    });
  }

  /* ---------- accendere e spegnere ---------- */
  function accendi() {
    return registra().then(function () {
      if (stato() === 'denied') return 'negato';
      return Notification.requestPermission().then(function (p) {
        if (p !== 'granted') return 'negato';
        return mandaPiano(true).then(function () { return 'accesi'; });
      });
    });
  }

  function spegni() {
    /* spento vuol dire spento: via anche la nota fissa e il numero
       sull'icona, o resterebbe lì un pallino che nessuno aggiorna più */
    togliFissa();
    try { if (navigator.clearAppBadge) navigator.clearAppBadge(); } catch (e) {}
    if (!reg) return Promise.resolve(true);
    return reg.pushManager.getSubscription().then(function (s) {
      var via = s ? s.unsubscribe() : Promise.resolve();
      var avvisa = (CONFIG.server && s) ? fetch(CONFIG.server + '/piano/' + idDispositivo(), { method: 'DELETE' }).catch(function () {}) : Promise.resolve();
      try { localStorage.removeItem(CHIAVE_ULTIMO); } catch (e) {}
      return Promise.all([via, avvisa]).then(function () { return true; });
    });
  }

  /* ---------- una notifica adesso, senza server ---------- */
  /* Il timer che finisce mentre guardi altrove: non serve nessun push, la
     pagina è ancora viva. È l'unica cosa che sul web si può fare da soli. */
  function locale(titolo, corpo, vai) {
    if (stato() !== 'granted') return false;
    if (reg && reg.showNotification) {
      reg.showNotification(titolo, {
        body: corpo || '', icon: 'assets/icone/icona-192.png', badge: 'assets/icone/badge-96.png', lang: 'it',
        tag: 'lifemax-locale', data: { vai: vai || '#/oggi' }
      });
      return true;
    }
    try { new Notification(titolo, { body: corpo || '' }); return true; } catch (e) { return false; }
  }

  window.LM_PROMEMORIA = {
    stato: stato, accendi: accendi, spegni: spegni, locale: locale,
    piano: piano, mandaPiano: mandaPiano, registra: registra,
    serveInstallare: serveInstallare, installata: installata,
    restano: restano, segnaNumero: segnaNumero,
    fissa: fissa, fissaAccesa: fissaAccesa, testoFissa: testoFissa,
    configurato: function () { return !!(CONFIG.server && CONFIG.chiave); },
    CONFIG: CONFIG
  };

  /* Si registra da subito, e se i promemoria sono già accesi manda subito il
     piano: aprendo l'app di prima mattina il server ha ancora quello di ieri,
     e le cose che hai fatto stanotte non le sa nessuno.
     Il permesso, invece, NON si chiede qui. */
  function avvia() {
    segnaNumero();
    registra().then(function () { scriviFissa(); mandaPiano(false); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvia);
  else avvia();
  /* quando i dati cambiano, il piano di oggi può essere cambiato */
  document.addEventListener('lm:change', function () {
    /* il numero e la nota fissa si aggiornano subito e senza server: la
       pagina è aperta, e l'unica cosa che costa è un giro di conto */
    segnaNumero();
    scriviFissa();
    mandaPiano(false);
  });
})();
