/* ============================================================
   LifeMax — applicazione (v2)
   Tre modalità UX sugli stessi dati + motion system:
   entrate staggered, count-up, coriandoli sulla MIT, particelle
   XP, timer con anello conico, illustrazioni negli stati vuoti.
   ============================================================ */
'use strict';

(function () {

  var esc = LMCharts.esc;
  var $vista = document.getElementById('vista');
  var RIDOTTO = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- motion utilities ---------- */

  function countUp(el, to, opts) {
    opts = opts || {};
    var fmt = opts.fmt || function (v) { return Math.round(v).toLocaleString('it-IT'); };
    if (RIDOTTO) { el.textContent = fmt(to); return; }
    var dur = opts.dur || 900, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur);
      k = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(to * k);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var COLORI_FESTA = ['#7c5df0', '#4a7bf5', '#2ab8e8', '#0ca30c', '#eda100', '#e87ba4'];

  function burst(x, y) {
    if (RIDOTTO) return;
    for (var i = 0; i < 18; i++) {
      var s = document.createElement('i');
      s.className = 'coriandolo';
      var ang = Math.random() * Math.PI * 2;
      var dist = 55 + Math.random() * 95;
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      s.style.background = COLORI_FESTA[i % COLORI_FESTA.length];
      s.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(0) + 'px');
      s.style.setProperty('--dy', (Math.sin(ang) * dist - 46).toFixed(0) + 'px');
      s.style.setProperty('--rot', (Math.random() * 560 - 280).toFixed(0) + 'deg');
      document.body.appendChild(s);
      (function (n) { setTimeout(function () { n.remove(); }, 980); })(s);
    }
  }

  function flyXp(x, y, punti) {
    if (RIDOTTO || !punti) return;
    var s = document.createElement('span');
    s.className = 'vola-xp';
    s.textContent = '+' + punti + ' XP';
    s.style.left = (x - 20) + 'px';
    s.style.top = (y - 14) + 'px';
    document.body.appendChild(s);
    setTimeout(function () { s.remove(); }, 900);
  }

  /* ---------- illustrazioni ---------- */

  function illoSole() {
    return '<svg class="illo" viewBox="0 0 200 120" aria-hidden="true">' +
      '<defs><linearGradient id="ilA" x1="0" y1="1" x2="1" y2="0">' +
      '<stop offset="0" style="stop-color:var(--brand-a)"/><stop offset=".6" style="stop-color:var(--brand-b)"/><stop offset="1" style="stop-color:var(--brand-c)"/></linearGradient></defs>' +
      '<g stroke="url(#ilA)" stroke-width="3" stroke-linecap="round" opacity=".7">' +
      '<path d="M100 18v-8M62 32l-6-6M138 32l6-6M42 62h-9M158 62h9"/></g>' +
      '<circle cx="100" cy="74" r="32" fill="url(#ilA)"/>' +
      '<path d="M0 92 Q 52 74 104 92 T 200 90 V120 H0 Z" fill="var(--superficie-3)"/>' +
      '<path d="M0 104 Q 60 90 120 104 T 200 102 V120 H0 Z" fill="var(--superficie-2)"/>' +
      '</svg>';
  }

  function illoInbox() {
    return '<svg class="illo" viewBox="0 0 200 120" aria-hidden="true">' +
      '<defs><linearGradient id="ilB" x1="0" y1="1" x2="1" y2="0">' +
      '<stop offset="0" style="stop-color:var(--brand-a)"/><stop offset="1" style="stop-color:var(--brand-c)"/></linearGradient></defs>' +
      '<rect x="48" y="26" width="104" height="60" rx="12" fill="var(--superficie-3)" transform="rotate(-7 100 56)"/>' +
      '<rect x="48" y="30" width="104" height="60" rx="12" fill="var(--superficie-2)" transform="rotate(4 100 60)"/>' +
      '<rect x="46" y="38" width="108" height="62" rx="12" fill="var(--superficie-1)" stroke="var(--bordo-forte)"/>' +
      '<circle cx="100" cy="69" r="17" fill="url(#ilB)"/>' +
      '<path d="M92.5 69.5l5 5 10.5-11" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  }

  function illoFlask() {
    return '<svg class="illo" viewBox="0 0 200 120" aria-hidden="true">' +
      '<defs><linearGradient id="ilC" x1="0" y1="1" x2="1" y2="0">' +
      '<stop offset="0" style="stop-color:var(--brand-b)"/><stop offset="1" style="stop-color:var(--brand-c)"/></linearGradient></defs>' +
      '<path d="M88 22h24M92 22v26l-24 42a8 8 0 0 0 7 12h50a8 8 0 0 0 7-12l-24-42V22" fill="none" stroke="var(--inchiostro-muto)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M80.5 74h39l12.5 22a4 4 0 0 1-3.5 6H71.5a4 4 0 0 1-3.5-6z" fill="url(#ilC)" opacity=".9"/>' +
      '<circle cx="92" cy="88" r="3.4" fill="#fff" opacity=".85"><animate attributeName="cy" values="92;80;92" dur="3.2s" repeatCount="indefinite"/></circle>' +
      '<circle cx="108" cy="92" r="2.6" fill="#fff" opacity=".7"><animate attributeName="cy" values="96;84;96" dur="2.6s" repeatCount="indefinite"/></circle>' +
      '</svg>';
  }

  function illoOrbita() {
    return '<svg class="ob-illo" viewBox="0 0 300 300" aria-hidden="true">' +
      '<defs><linearGradient id="ilD" x1="0" y1="1" x2="1" y2="0">' +
      '<stop offset="0" style="stop-color:var(--brand-a)"/><stop offset=".55" style="stop-color:var(--brand-b)"/><stop offset="1" style="stop-color:var(--brand-c)"/></linearGradient></defs>' +
      '<circle cx="150" cy="150" r="74" fill="none" stroke="var(--bordo-forte)" stroke-dasharray="3 8"/>' +
      '<circle cx="150" cy="150" r="120" fill="none" stroke="var(--bordo)" stroke-dasharray="3 8"/>' +
      '<g class="orbita"><circle cx="150" cy="76" r="11" fill="url(#ilD)"/></g>' +
      '<g class="orbita orbita-2"><circle cx="270" cy="150" r="7" fill="var(--brand-c)"/><circle cx="150" cy="270" r="5" fill="var(--brand-a)" opacity=".8"/></g>' +
      '<rect x="126" y="126" width="48" height="48" rx="14" fill="url(#ilD)"/>' +
      '<path d="M137 158l7.5-7.5 5.5 5.5 12-12.5" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M153.5 143h8.5v8.5" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  }

  /* ---------- tema & skin ---------- */

  function applicaTema() {
    var s = LM.load();
    var modo = s.profilo.modo || 'auto';
    var scuroOS = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var scuro = modo === 'dark' || (modo === 'auto' && scuroOS);
    document.documentElement.setAttribute('data-mode', scuro ? 'dark' : 'light');
    document.documentElement.setAttribute('data-skin', s.profilo.skin || 'quiete');
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    applicaTema(); render();
  });

  document.getElementById('btn-tema').addEventListener('click', function () {
    var s = LM.load();
    var ciclo = { auto: 'light', light: 'dark', dark: 'auto' };
    s.profilo.modo = ciclo[s.profilo.modo || 'auto'];
    LM.save(); applicaTema(); render();
    toast('Modalità: ' + ({ auto: 'automatica', light: 'chiara', dark: 'scura' })[s.profilo.modo], 0, s.profilo.modo === 'dark' ? 'moon' : 'sun');
  });

  document.getElementById('btn-skin').addEventListener('click', function () {
    var s = LM.load();
    s.profilo.skin = s.profilo.skin === 'arcade' ? 'quiete' : 'arcade';
    LM.save(); applicaTema(); render();
    toast('Skin: ' + (s.profilo.skin === 'arcade' ? 'Arcade' : 'Aurora'), 0, 'palette');
  });

  document.getElementById('btn-demo').addEventListener('click', function () {
    if (confirm('Sostituisco i dati attuali con 8 settimane di dati demo?')) {
      LM.seedDemo(); applicaTema(); render();
      toast('Dati demo caricati', 0, 'refresh');
    }
  });

  document.getElementById('btn-azzera').addEventListener('click', function () {
    if (confirm('Azzero davvero tutto? (il prototipo salva solo su questo browser)')) {
      LM.reset(); location.hash = '#/oggi'; render();
    }
  });

  /* ---------- toast ---------- */

  function toast(testo, xp, icona) {
    var zona = document.getElementById('toast-zona');
    var t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = (icona ? ICO(icona, 16) : ICO('check', 16)) + '<span>' + esc(testo) + '</span>' +
      (xp ? ' <span class="xp">+' + xp + ' XP</span>' : '');
    zona.appendChild(t);
    setTimeout(function () { t.remove(); }, 3000);
  }

  /* ---------- cattura istantanea ---------- */

  var $ovl = document.getElementById('overlay-cattura');
  var $inp = document.getElementById('input-cattura');
  document.getElementById('corpo-cattura').insertAdjacentHTML('afterbegin', ICO('bolt', 20));

  function apriCattura() {
    $ovl.hidden = false;
    $inp.value = '';
    setTimeout(function () { $inp.focus(); }, 30);
  }
  function chiudiCattura() { $ovl.hidden = true; }

  document.getElementById('fab-cattura').innerHTML = ICO('plus', 25);
  document.getElementById('fab-cattura').addEventListener('click', apriCattura);
  $ovl.addEventListener('click', function (e) { if (e.target === $ovl) chiudiCattura(); });
  $inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && $inp.value.trim()) {
      var xp = LM.cattura($inp.value.trim());
      toast('Nell’inbox. Torna a ciò che stavi facendo', xp, 'inbox');
      chiudiCattura();
      aggiornaNav(); render();
    }
    if (e.key === 'Escape') chiudiCattura();
  });

  document.addEventListener('keydown', function (e) {
    var digitando = /input|textarea|select/i.test(document.activeElement.tagName);
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); apriCattura(); return; }
    if (digitando) return;
    if (e.key === 'c' || e.key === 'C') { e.preventDefault(); apriCattura(); }
    if (e.key === 'Escape' && !$ovl.hidden) chiudiCattura();
  });

  /* ---------- navigazione ---------- */

  var VISTE = [
    { id: 'oggi',        nome: 'Focus',       icona: 'target' },
    { id: 'plancia',     nome: 'Plancia',     icona: 'dashboard' },
    { id: 'rituali',     nome: 'Rituali',     icona: 'sun' },
    { id: 'inbox',       nome: 'Inbox',       icona: 'inbox' },
    { id: 'esperimenti', nome: 'Esperimenti', icona: 'flask' },
    { id: 'scienza',     nome: 'Scienza',     icona: 'atom' }
  ];

  function vistaCorrente() {
    var h = (location.hash || '#/oggi').replace('#/', '').split('/')[0];
    return VISTE.some(function (v) { return v.id === h; }) ? h : 'oggi';
  }

  function aggiornaNav() {
    var s = LM.load();
    var corrente = vistaCorrente();
    var lato = document.getElementById('nav-lato');
    var tab = document.getElementById('nav-tab');
    lato.innerHTML = VISTE.map(function (v) {
      var badge = v.id === 'inbox' && s.inbox.length ? '<span class="nav-badge">' + s.inbox.length + '</span>' : '';
      return '<a class="nav-item' + (corrente === v.id ? ' attivo' : '') + '" href="#/' + v.id + '">' +
        ICO(v.icona, 17) + v.nome + badge + '</a>';
    }).join('');
    tab.innerHTML = VISTE.slice(0, 5).map(function (v) {
      return '<button data-vai="' + v.id + '" class="' + (corrente === v.id ? 'attivo' : '') + '">' +
        ICO(v.icona, 21) + v.nome + '</button>';
    }).join('');
    tab.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { location.hash = '#/' + b.getAttribute('data-vai'); });
    });
  }

  /* ---------- helper UI ---------- */

  function areaById(id) {
    return LM.load().aree.find(function (a) { return a.id === id; }) || LM.load().aree[LM.load().aree.length - 1];
  }

  function areeAttive() {
    var s = LM.load();
    return s.aree.filter(function (a) { return s.areeAttive.indexOf(a.id) >= 0; });
  }

  function selectAree(id, selezionata) {
    return '<select id="' + id + '">' + areeAttive().map(function (a) {
      return '<option value="' + a.id + '"' + (a.id === selezionata ? ' selected' : '') + '>' + esc(a.nome) + '</option>';
    }).join('') + '</select>';
  }

  function topbar(titolo, sottotitolo, destra) {
    return '<div class="topbar"><div><h1>' + titolo + '</h1>' +
      (sottotitolo ? '<div class="sottotitolo">' + sottotitolo + '</div>' : '') +
      '</div><div class="spazio"></div>' + (destra || '') + '</div>';
  }

  function bandaDemo() {
    var s = LM.load();
    document.getElementById('banda-demo').innerHTML = s.demo
      ? '<div class="banda-demo">Stai guardando <b>8 settimane di dati demo</b> — tutto è cliccabile e persistente. Azzera dagli strumenti in basso a sinistra per partire dai tuoi dati veri.</div>'
      : '';
  }

  /* ============================================================
     VISTA: FOCUS
     ============================================================ */

  var timer = { azioneId: null, fine: null, durata: 0, intervallo: null };

  function fermaTimer(registra) {
    if (timer.intervallo) clearInterval(timer.intervallo);
    if (registra && timer.azioneId) {
      var trascorsi = Math.round((timer.durata * 60000 - Math.max(0, timer.fine - Date.now())) / 60000);
      if (trascorsi >= 1) {
        var a = LM.load().azioni.find(function (x) { return x.id === timer.azioneId; });
        if (a) LM.registraMinuti(a.areaId, trascorsi);
      }
    }
    timer = { azioneId: null, fine: null, durata: 0, intervallo: null };
  }

  function avviaTimer(azioneId, minuti) {
    fermaTimer(false);
    timer.azioneId = azioneId;
    timer.durata = minuti;
    timer.fine = Date.now() + minuti * 60000;
    timer.intervallo = setInterval(function () {
      var resta = timer.fine - Date.now();
      var eld = document.getElementById('timer-display');
      var ela = document.getElementById('timer-anello');
      if (eld) {
        var sec = Math.max(0, Math.round(resta / 1000));
        eld.textContent = Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2);
      }
      if (ela) ela.style.setProperty('--p', Math.min(1, 1 - resta / (timer.durata * 60000)).toFixed(4));
      if (resta <= 0) {
        fermaTimer(true);
        toast('Blocco finito: minuti registrati. Fatto o pausa?', 0, 'clock');
        render();
      }
    }, 250);
    render();
  }

  function vistaFocus() {
    var prossima = LM.prossimaAzione();
    var oggi = LM.azioniDiOggi();
    var fatte = oggi.filter(function (a) { return a.done; }).length;
    var inCoda = oggi.filter(function (a) { return !a.done; }).length - (prossima ? 1 : 0);
    var html = topbar('Focus', 'Una cosa alla volta. Il resto aspetta.',
      '<span class="chip">' + ICO('check', 14) + ' Oggi <b>&nbsp;' + fatte + '/' + oggi.length + '</b></span>');

    if (!prossima) {
      html += '<div class="focus-scena"><div class="vuoto">' + illoSole() +
        (oggi.length ? '<b>Tutto fatto per oggi.</b><br>Chiudi in bellezza con la review serale, o pesca qualcosa di nuovo.'
                     : '<b>Nessun piano per oggi — nessun problema.</b><br>Bastano 60 secondi: scegli la prossima cosa e basta.') +
        '</div>' +
        '<div class="focus-azioni-riga">' +
        '<button class="btn btn-primario btn-grande" data-vai="rituali">' + ICO('sun', 18) + ' Fai il piano del mattino</button>' +
        '<button class="btn" data-vai="inbox">' + ICO('inbox', 17) + ' Pesca dall’inbox</button>' +
        (oggi.length ? '<button class="btn" data-vai="rituali" data-sub="sera">' + ICO('moon', 17) + ' Review serale</button>' : '') +
        '</div>' +
        '<form id="form-rapida" class="riga-flex" style="max-width:580px;width:100%">' +
        '<input type="text" id="testo-rapida" placeholder="…oppure scrivi qui la prossima azione" style="flex:1;min-width:220px">' +
        '<button class="btn btn-primario" type="submit">' + ICO('arrowRight', 17) + '</button></form>' +
        '</div>';
      $vista.innerHTML = html;
      $vista.querySelectorAll('[data-vai]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.getAttribute('data-sub')) sottoRituale = b.getAttribute('data-sub');
          location.hash = '#/' + b.getAttribute('data-vai');
        });
      });
      document.getElementById('form-rapida').addEventListener('submit', function (e) {
        e.preventDefault();
        var t = document.getElementById('testo-rapida').value.trim();
        if (!t) return;
        LM.aggiungiAzione(t, 'altro', { mit: oggi.length === 0 });
        render();
      });
      return;
    }

    var area = areaById(prossima.areaId);
    var colArea = LM.coloreArea(area);
    var timerAttivo = timer.azioneId === prossima.id && timer.fine;
    var xpPrevisti = prossima.mit ? LM.XP_EVENTI.mit : LM.XP_EVENTI.azione;

    html += '<div class="focus-scena' + (timerAttivo ? ' timer-attivo' : '') + '">' +
      '<div class="focus-eyebrow' + (prossima.mit ? ' mit' : '') + '">' +
      (prossima.mit ? ICO('star', 15) + ' La cosa più importante di oggi' : ICO('target', 15) + ' La prossima azione — solo questa') + '</div>' +
      (timerAttivo
        ? '<div class="timer-anello" id="timer-anello" style="--p:0"><div class="timer-interno">' +
          '<div class="timer-display" id="timer-display">–:––</div>' +
          '<div class="timer-eti">nel blocco</div></div></div>'
        : '') +
      '<div class="focus-azione">' + esc(prossima.testo) + '</div>' +
      '<div class="focus-area" style="--c-area:' + colArea + '">' +
      '<span class="pallino" style="width:8px;height:8px;border-radius:50%;background:' + colArea + ';display:inline-block"></span>' +
      '<span style="color:' + colArea + ';display:inline-flex">' + ICO(area.icona, 15) + '</span> ' + esc(area.nome) + '</div>' +
      (prossima.ifThen ? '<div class="focus-ifthen">' + ICO('bolt', 15) + '<span>' + esc(prossima.ifThen) + '</span></div>' : '') +
      '<div class="focus-azioni-riga">' +
      '<button class="btn btn-ok btn-grande" id="btn-fatto">' + ICO('check', 18) + ' Fatto <small>+' + xpPrevisti + ' XP</small></button>' +
      (timerAttivo
        ? '<button class="btn btn-grande" id="btn-stop-timer">' + ICO('pause', 17) + ' Ferma e registra</button>'
        : '<button class="btn btn-grande" id="btn-timer">' + ICO('play', 17) + ' Blocco 25′</button>' +
          '<button class="btn" id="btn-timer-10">10′</button><button class="btn" id="btn-timer-50">50′</button>') +
      '<button class="btn btn-ghost" id="btn-nonora">Non ora ' + ICO('arrowRight', 15) + '</button>' +
      '</div>' +
      '<div class="focus-coda">' +
      (inCoda > 0
        ? '<span class="pila-coda">' + '<i></i>'.repeat(Math.min(3, inCoda)) + '</span> In coda dopo questa: <b>' + inCoda + '</b> · le vedrai una alla volta'
        : 'Ultima della lista: poi hai finito') +
      '<span>·</span><span>pensiero in testa? <kbd>C</kbd> e lo parcheggi</span></div>' +
      '</div>';

    $vista.innerHTML = html;

    document.getElementById('btn-fatto').addEventListener('click', function (ev) {
      var eraTimer = timer.azioneId === prossima.id;
      if (eraTimer) fermaTimer(true);
      var xp = LM.completaAzione(prossima.id);
      var r = ev.currentTarget.getBoundingClientRect();
      flyXp(r.left + r.width / 2, r.top, xp);
      if (prossima.mit) burst(r.left + r.width / 2, r.top + r.height / 2);
      toast(prossima.mit ? 'MIT completata. Giornata vinta' : 'Fatta.', xp, prossima.mit ? 'star' : 'check');
      render();
    });
    document.getElementById('btn-nonora').addEventListener('click', function () {
      fermaTimer(false);
      LM.rimandaAzione(prossima.id);
      toast('Ok, dopo. Ecco la prossima', 0, 'arrowRight');
      render();
    });
    if (timerAttivo) {
      document.getElementById('btn-stop-timer').addEventListener('click', function () {
        fermaTimer(true);
        toast('Minuti registrati su ' + area.nome, 0, 'clock');
        render();
      });
    } else {
      document.getElementById('btn-timer').addEventListener('click', function () { avviaTimer(prossima.id, 25); });
      document.getElementById('btn-timer-10').addEventListener('click', function () { avviaTimer(prossima.id, 10); });
      document.getElementById('btn-timer-50').addEventListener('click', function () { avviaTimer(prossima.id, 50); });
    }
  }

  /* ============================================================
     VISTA: PLANCIA
     ============================================================ */

  function vistaPlancia() {
    var s = LM.load();
    var lvl = LM.livelloDaXp(s.xp);
    var st = LM.streak();
    var oggi = LM.azioniDiOggi();
    var fatte = oggi.filter(function (a) { return a.done; }).length;
    var t = LM.todayKey();
    var checkinOggi = s.checkins.filter(function (c) { return c.data === t; }).length;
    var xpOggi = s.xpPerGiorno[t] || 0;
    var xpIeri = s.xpPerGiorno[LM.addDays(t, -1)] || 0;

    var html = topbar('Plancia', 'Quello che misuri, migliora. Quello che vedi, lo misuri volentieri.',
      '<span class="chip">' + ICO('calendar', 14) + ' ' + new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }) + '</span>');

    /* eroe */
    html += '<div class="card eroe">' +
      '<div id="anello-livello" title="XP verso il prossimo livello"></div>' +
      '<div class="eroe-statistiche">' +
      stat('<span id="xp-contatore">0</span>&nbsp;XP', 'Livello ' + lvl.livello, (lvl.prossimo - s.xp) + ' XP al prossimo') +
      stat(ICO('flame', 22, 'fiamma') + ' ' + st.corrente, 'giorni di serie', 'gentile: un buco isolato non azzera') +
      stat(fatte + '/' + oggi.length, 'azioni oggi', xpOggi >= xpIeri && xpOggi > 0 ? '<span class="delta-ok">▲ sopra ieri</span>' : 'XP oggi: ' + xpOggi) +
      stat('' + checkinOggi, 'check-in oggi', checkinOggi === 0 ? 'fanne uno: 10 secondi' : 'ottimo ritmo') +
      '</div>' +
      '<div><button class="btn btn-primario" data-vai="oggi">' + ICO('target', 16) + ' Prossima azione</button></div>' +
      '</div>';

    /* oggi + heatmap */
    html += '<div class="griglia griglia-2 mt">';
    html += '<div class="card" style="--i:0"><h2>Oggi <small style="font-weight:500;color:var(--inchiostro-muto)">· max 3, la scarsità è il punto</small></h2>' +
      '<div class="sotto">La MIT per prima. Tutto il resto è bonus.</div>' +
      '<div class="lista-azioni" id="lista-oggi"></div>' +
      '<form id="form-add" class="riga-flex mt-s"><input type="text" id="testo-add" placeholder="Aggiungi un’azione per oggi…" style="flex:1;min-width:160px">' +
      '<span style="width:140px">' + selectAree('area-add') + '</span>' +
      '<button class="btn btn-mini btn-primario" type="submit">' + ICO('plus', 14) + '</button></form></div>';
    html += '<div class="card" style="--i:1"><h2>' + ICO('trendUp', 16) + ' Consistenza</h2><div class="sotto">XP per giorno, ultime 12 settimane. Il pattern conta più del singolo giorno.</div>' +
      '<div id="heatmap"></div></div>';
    html += '</div>';

    /* trend check-in + minuti per area */
    html += '<div class="griglia griglia-2 mt">';
    html += '<div class="card" style="--i:0"><h2>' + ICO('bolt', 16) + ' Energia · Focus · Umore</h2><div class="sotto">Media dei check-in, ultimi 14 giorni (scala 1–5).</div><div id="trend-checkin"></div></div>';
    html += '<div class="card" style="--i:1"><h2>' + ICO('clock', 16) + ' Dove va il tempo</h2><div class="sotto">Minuti registrati per area, ultimi 7 giorni.</div><div id="hbar-minuti"></div></div>';
    html += '</div>';

    /* aree */
    html += '<div class="titolo-sezione">' + ICO('dashboard', 17) + ' Le tue aree</div><div class="griglia griglia-aree" id="griglia-aree"></div>';

    $vista.innerHTML = html;

    countUp(document.getElementById('xp-contatore'), s.xp);
    LMCharts.ring(document.getElementById('anello-livello'), lvl.pct, { size: 92, centro: 'L' + lvl.livello, label: 'Livello ' + lvl.livello + ', ' + Math.round(lvl.pct * 100) + '% verso il prossimo' });
    LMCharts.heatmap(document.getElementById('heatmap'), LM.heatmapConsistenza(12));

    var dark = document.documentElement.getAttribute('data-mode') === 'dark';
    LMCharts.trend(document.getElementById('trend-checkin'), [
      { nome: 'Energia', colore: dark ? '#c98500' : '#eda100', punti: LM.serieCheckin('energia', 14) },
      { nome: 'Focus',   colore: dark ? '#3987e5' : '#2a78d6', punti: LM.serieCheckin('focus', 14) },
      { nome: 'Umore',   colore: dark ? '#199e70' : '#1baf7a', punti: LM.serieCheckin('umore', 14) }
    ], { min: 1, max: 5, label: 'Trend di energia, focus e umore negli ultimi 14 giorni' });

    LMCharts.hbar(document.getElementById('hbar-minuti'),
      LM.minutiSettimanaPerArea()
        .sort(function (a, b) { return b.minuti - a.minuti; })
        .map(function (r) { return { label: r.area.nome, icona: ICO(r.area.icona, 14), value: r.minuti, colore: LM.coloreArea(r.area) }; }),
      { unita: 'min' });

    /* lista oggi */
    var lista = document.getElementById('lista-oggi');
    if (!oggi.length) {
      lista.innerHTML = '<div class="vuoto" style="padding:14px">Niente in lista. Il piano del mattino richiede 60 secondi → <a href="#/rituali">Rituali</a></div>';
    } else {
      lista.innerHTML = oggi.map(function (a) {
        var ar = areaById(a.areaId);
        return '<div class="riga-azione' + (a.done ? ' fatta' : '') + '">' +
          '<button class="spunta" data-id="' + a.id + '" aria-label="Completa">' + ICO('check', 13) + '</button>' +
          '<span class="testo">' + esc(a.testo) + '</span>' +
          (a.mit ? '<span class="tag-mit">' + ICO('star', 10) + 'MIT</span>' : '') +
          '<span class="tag-area" style="--c-area:' + LM.coloreArea(ar) + '" title="' + esc(ar.nome) + '">' + ICO(ar.icona, 15) + '</span>' +
          '</div>';
      }).join('');
      lista.querySelectorAll('.spunta').forEach(function (b) {
        b.addEventListener('click', function (ev) {
          var xp = LM.completaAzione(b.getAttribute('data-id'));
          if (xp) {
            var r = ev.currentTarget.getBoundingClientRect();
            flyXp(r.left + r.width / 2, r.top, xp);
            toast('Fatta.', xp);
          }
          render();
        });
      });
    }
    document.getElementById('form-add').addEventListener('submit', function (e) {
      e.preventDefault();
      var t2 = document.getElementById('testo-add').value.trim();
      if (!t2) return;
      LM.aggiungiAzione(t2, document.getElementById('area-add').value, { mit: oggi.length === 0 });
      render();
    });

    /* card aree */
    var ga = document.getElementById('griglia-aree');
    ga.innerHTML = areeAttive().map(function (a, i) {
      var media = LM.mediaValutazioneArea(a.id, 7);
      var min7 = LM.serieMinuti(a.id, 7).reduce(function (x, p) { return x + p.valore; }, 0);
      var col = LM.coloreArea(a);
      return '<div class="card card-area card-hover" style="--i:' + i + ';--c-area:' + col + '">' +
        '<div class="testata"><span class="icona-area">' + ICO(a.icona, 16) + '</span>' + esc(a.nome) + '</div>' +
        '<div id="spark-' + a.id + '"></div>' +
        '<div class="metrica-riga"><b>' + (media ? LMCharts.fmtNum(media) : '—') + '</b> auto-valutazione media 7g</div>' +
        '<div class="metrica-riga"><b>' + min7 + '</b> minuti negli ultimi 7g</div>' +
        '<div class="sistema-nota">Sistema: ' + esc(a.sistema) + '</div>' +
        '</div>';
    }).join('');
    areeAttive().forEach(function (a) {
      LMCharts.sparkline(document.getElementById('spark-' + a.id), LM.serieValutazioni(a.id, 14),
        { min: 1, max: 5, colore: LM.coloreArea(a), label: 'Auto-valutazione ' + a.nome + ', 14 giorni', unita: '/5' });
    });

    $vista.querySelectorAll('[data-vai]').forEach(function (b) {
      b.addEventListener('click', function () { location.hash = '#/' + b.getAttribute('data-vai'); });
    });

    function stat(val, eti, sub) {
      return '<div class="stat"><span class="stat-val">' + val + '</span><span class="stat-eti">' + eti + '</span>' +
        (sub ? '<span class="stat-sub">' + sub + '</span>' : '') + '</div>';
    }
  }

  /* ============================================================
     VISTA: RITUALI
     ============================================================ */

  var sottoRituale = null;

  function vistaRituali() {
    var ora = new Date().getHours();
    var sub = sottoRituale || (ora < 12 ? 'mattina' : (ora >= 19 ? 'sera' : 'checkin'));
    sottoRituale = sub;

    var html = topbar('Rituali', 'La struttura lavora al posto della disciplina.',
      '<div class="segmenti" id="seg-rituali">' +
      seg('mattina', 'sun', 'Mattina') + seg('checkin', 'bolt', 'Check-in') + seg('sera', 'moon', 'Sera') + seg('settimana', 'calendar', 'Settimana') +
      '</div>') + '<div class="passo-rituale" id="corpo-rituale"></div>';
    $vista.innerHTML = html;

    document.getElementById('seg-rituali').querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { sottoRituale = b.getAttribute('data-sub'); render(); });
    });

    var corpo = document.getElementById('corpo-rituale');
    if (sub === 'mattina') ritualeMattina(corpo);
    if (sub === 'checkin') ritualeCheckin(corpo);
    if (sub === 'sera') ritualeSera(corpo);
    if (sub === 'settimana') ritualeSettimana(corpo);

    function seg(id, icona, nome) {
      return '<button data-sub="' + id + '" class="' + (sub === id ? 'attivo' : '') + '">' + ICO(icona, 15) + nome + '</button>';
    }
  }

  function testaRituale(icona, titolo, sotto) {
    return '<div class="rituale-testa"><div class="rituale-icona">' + ICO(icona, 24) + '</div>' +
      '<h2>' + titolo + '</h2><p>' + sotto + '</p></div>';
  }

  function ritualeMattina(corpo) {
    var s = LM.load();
    var t = LM.todayKey();
    var piano = s.pianoMattina[t];
    var oggi = LM.azioniDiOggi();

    corpo.innerHTML = '<div class="card">' +
      testaRituale('sun', 'Piano del mattino — 60 secondi',
        'Ogni giorno riparte da zero: ieri non conta, né in bene né in male.<br>Massimo <b>3 azioni</b>. La prima è la MIT: se fai solo quella, la giornata vale.') +
      '<div class="lista-azioni" id="piano-lista"></div>' +
      (oggi.length < 3
        ? '<form id="form-piano" class="mt-s"><div class="riga-flex">' +
          '<input type="text" id="piano-testo" placeholder="' + (oggi.length === 0 ? 'La cosa più importante di oggi…' : 'Un’altra azione (facoltativa)…') + '" style="flex:1;min-width:180px">' +
          '<span style="width:155px">' + selectAree('piano-area') + '</span>' +
          '<button class="btn btn-primario" type="submit">' + ICO('plus', 16) + '</button></div></form>'
        : '<div class="sotto mt-s">Tre su tre: basta così. Aggiungere la quarta è il modo migliore per non farne nessuna.</div>') +
      '<label class="campo">Intenzione «Se… allora…» — decidi ORA quando e dove parte la MIT</label>' +
      '<input type="text" id="piano-ifthen" placeholder="Se alle 9:00 sono alla scrivania, allora apro solo il file della MIT" value="' + (piano ? esc(piano.intenzione) : '') + '">' +
      '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="btn-salva-piano">' + (piano ? 'Aggiorna il piano' : 'Chiudi il piano') + ' <small>+' + LM.XP_EVENTI.pianoMattina + ' XP</small></button>' +
      '<button class="btn btn-ghost" id="btn-vai-focus">Vai in Focus ' + ICO('arrowRight', 15) + '</button></div>' +
      '</div>';

    var lista = document.getElementById('piano-lista');
    lista.innerHTML = oggi.length
      ? oggi.map(function (a) {
          var ar = areaById(a.areaId);
          return '<div class="riga-azione' + (a.done ? ' fatta' : '') + '"><span class="testo">' + esc(a.testo) + '</span>' +
            (a.mit ? '<span class="tag-mit">' + ICO('star', 10) + 'MIT</span>' : '') +
            '<span class="tag-area" style="--c-area:' + LM.coloreArea(ar) + '" title="' + esc(ar.nome) + '">' + ICO(ar.icona, 15) + '</span></div>';
        }).join('')
      : '<div class="vuoto" style="padding:14px">Ancora vuoto. Scrivi la prima: sarà la tua MIT.</div>';

    var form = document.getElementById('form-piano');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      var testo = document.getElementById('piano-testo').value.trim();
      if (!testo) return;
      LM.aggiungiAzione(testo, document.getElementById('piano-area').value, { mit: oggi.length === 0 });
      render();
    });
    document.getElementById('btn-salva-piano').addEventListener('click', function () {
      var xp = LM.salvaPianoMattina(document.getElementById('piano-ifthen').value.trim());
      var mit = LM.azioniDiOggi().find(function (a) { return a.mit; });
      if (mit) {
        mit.ifThen = document.getElementById('piano-ifthen').value.trim();
        LM.save();
      }
      toast(xp ? 'Piano chiuso. Ora esegui, non decidere' : 'Piano aggiornato', xp, 'sun');
      render();
    });
    document.getElementById('btn-vai-focus').addEventListener('click', function () { location.hash = '#/oggi'; });
  }

  function ritualeCheckin(corpo) {
    var voti = { energia: 0, focus: 0, umore: 0 };
    corpo.innerHTML = '<div class="card">' +
      testaRituale('bolt', 'Check-in — 10 secondi', 'Tre tap. Nessun testo. È il sensore che alimenta i tuoi esperimenti.') +
      scala('energia', 'bolt', 'Energia') + scala('focus', 'target', 'Focus') + scala('umore', 'smile', 'Umore') +
      '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="btn-salva-checkin" disabled>Registra <small>+' + LM.XP_EVENTI.checkin + ' XP</small></button></div>' +
      '</div><div class="card mt"><h2>' + ICO('trendUp', 16) + ' Ultimi 14 giorni</h2><div id="mini-trend"></div></div>';

    function scala(campo, icona, nome) {
      return '<label class="campo">' + ICO(icona, 13) + ' ' + nome + '</label><div class="scala" data-campo="' + campo + '">' +
        [1, 2, 3, 4, 5].map(function (v) { return '<button data-v="' + v + '">' + v + '</button>'; }).join('') + '</div>';
    }
    corpo.querySelectorAll('.scala').forEach(function (sc) {
      sc.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          sc.querySelectorAll('button').forEach(function (x) { x.classList.remove('sel'); });
          b.classList.add('sel');
          voti[sc.getAttribute('data-campo')] = +b.getAttribute('data-v');
          document.getElementById('btn-salva-checkin').disabled = !(voti.energia && voti.focus && voti.umore);
        });
      });
    });
    document.getElementById('btn-salva-checkin').addEventListener('click', function (ev) {
      var xp = LM.registraCheckin(voti.energia, voti.focus, voti.umore);
      var r = ev.currentTarget.getBoundingClientRect();
      flyXp(r.left + r.width / 2, r.top, xp);
      toast('Registrato. Torna pure a ciò che facevi', xp, 'bolt');
      render();
    });

    var dark = document.documentElement.getAttribute('data-mode') === 'dark';
    LMCharts.trend(document.getElementById('mini-trend'), [
      { nome: 'Energia', colore: dark ? '#c98500' : '#eda100', punti: LM.serieCheckin('energia', 14) },
      { nome: 'Focus',   colore: dark ? '#3987e5' : '#2a78d6', punti: LM.serieCheckin('focus', 14) },
      { nome: 'Umore',   colore: dark ? '#199e70' : '#1baf7a', punti: LM.serieCheckin('umore', 14) }
    ], { min: 1, max: 5, h: 180 });
  }

  function ritualeSera(corpo) {
    var s = LM.load();
    var t = LM.todayKey();
    var rev = s.reviewSera[t];
    var toccate = {};
    LM.azioniDiOggi().forEach(function (a) { toccate[a.areaId] = true; });
    var ordinate = areeAttive().slice().sort(function (a, b) { return (toccate[b.id] ? 1 : 0) - (toccate[a.id] ? 1 : 0); });
    var votiOggi = s.valutazioni[t] || {};

    corpo.innerHTML = '<div class="card">' +
      testaRituale('moon', 'Chiusura serale — 2 minuti',
        'Un voto alle aree che hai toccato, una vittoria, un blocco. Poi la giornata è <b>chiusa</b>: il cervello può smettere di girarci sopra.') +
      '<div id="voti-aree">' + ordinate.map(function (a) {
        return '<div class="voto-area" data-area="' + a.id + '" style="--c-area:' + LM.coloreArea(a) + '">' +
          '<span class="nome">' + ICO(a.icona, 16) + ' ' + esc(a.nome) + '</span>' +
          '<span class="stelline">' + [1, 2, 3, 4, 5].map(function (v) {
            return '<button data-v="' + v + '"' + (votiOggi[a.id] === v ? ' class="sel"' : '') + '>' + v + '</button>';
          }).join('') + '</span></div>';
      }).join('') + '</div>' +
      '<label class="campo">La vittoria di oggi — anche piccola: conta ciò che noti</label>' +
      '<input type="text" id="sera-vittoria" value="' + (rev ? esc(rev.vittoria || '') : '') + '" placeholder="Es. 90 minuti senza telefono">' +
      '<label class="campo">Cosa mi ha bloccato</label>' +
      '<input type="text" id="sera-blocco" value="' + (rev ? esc(rev.blocco || '') : '') + '" placeholder="Es. iniziato tardi, notifiche">' +
      '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="btn-salva-sera">' + (rev ? 'Aggiorna' : 'Chiudi la giornata') + ' <small>+' + LM.XP_EVENTI.reviewSera + ' XP</small></button></div>' +
      '</div>';

    corpo.querySelectorAll('.voto-area').forEach(function (riga) {
      riga.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          riga.querySelectorAll('button').forEach(function (x) { x.classList.remove('sel'); });
          b.classList.add('sel');
          LM.valutaArea(riga.getAttribute('data-area'), +b.getAttribute('data-v'));
        });
      });
    });
    document.getElementById('btn-salva-sera').addEventListener('click', function () {
      var xp = LM.salvaReviewSera({
        vittoria: document.getElementById('sera-vittoria').value.trim(),
        blocco: document.getElementById('sera-blocco').value.trim(),
        shutdown: true
      });
      toast('Giornata chiusa. Domani si riparte da zero', xp, 'moon');
      render();
    });
  }

  function ritualeSettimana(corpo) {
    var s = LM.load();
    var wk = LM.weekKey(LM.todayKey());
    var rev = s.reviewSettimana[wk];
    var giorni = LM.lastNDays(7);
    var xpSett = giorni.reduce(function (x, k) { return x + (s.xpPerGiorno[k] || 0); }, 0);
    var azioniSett = s.azioni.filter(function (a) { return giorni.indexOf(a.data) >= 0 && a.done; }).length;
    var attivi = giorni.filter(function (k) { return LM.giornoAttivo(k); }).length;

    corpo.innerHTML = '<div class="card">' +
      testaRituale('calendar', 'Review della settimana',
        'Qui non si giudica: si <b>estraggono dati</b>. Cosa ha funzionato è un’informazione, cosa non ha funzionato pure.') +
      '<div class="eroe-statistiche" style="justify-content:center;margin-bottom:16px">' +
      '<div class="stat"><span class="stat-val">' + xpSett + '</span><span class="stat-eti">XP</span></div>' +
      '<div class="stat"><span class="stat-val">' + azioniSett + '</span><span class="stat-eti">azioni fatte</span></div>' +
      '<div class="stat"><span class="stat-val">' + attivi + '/7</span><span class="stat-eti">giorni attivi</span></div>' +
      '</div>' +
      '<label class="campo">Le vittorie</label><textarea id="w-vittorie">' + (rev ? esc(rev.vittorie || '') : '') + '</textarea>' +
      '<label class="campo">I blocchi ricorrenti</label><textarea id="w-blocchi">' + (rev ? esc(rev.blocchi || '') : '') + '</textarea>' +
      '<label class="campo">Cosa ho imparato sul mio sistema (non su di me)</label><textarea id="w-imparato">' + (rev ? esc(rev.imparato || '') : '') + '</textarea>' +
      '<label class="campo">L’unica modifica per la prossima settimana</label><textarea id="w-prossima">' + (rev ? esc(rev.prossima || '') : '') + '</textarea>' +
      '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="btn-salva-sett">' + (rev ? 'Aggiorna' : 'Salva la review') + ' <small>+' + LM.XP_EVENTI.reviewSettimana + ' XP</small></button>' +
      '<button class="btn btn-ghost" data-vai="esperimenti">' + ICO('flask', 16) + ' Trasformala in un esperimento</button></div>' +
      '</div>';

    document.getElementById('btn-salva-sett').addEventListener('click', function () {
      var xp = LM.salvaReviewSettimana({
        vittorie: document.getElementById('w-vittorie').value.trim(),
        blocchi: document.getElementById('w-blocchi').value.trim(),
        imparato: document.getElementById('w-imparato').value.trim(),
        prossima: document.getElementById('w-prossima').value.trim()
      });
      toast('Review salvata. Sistema aggiornato', xp, 'calendar');
      render();
    });
    corpo.querySelectorAll('[data-vai]').forEach(function (b) {
      b.addEventListener('click', function () { location.hash = '#/' + b.getAttribute('data-vai'); });
    });
  }

  /* ============================================================
     VISTA: INBOX
     ============================================================ */

  function vistaInbox() {
    var s = LM.load();
    var html = topbar('Inbox', 'Catturare è gratis. Decidere si fa qui, quando vuoi tu.',
      '<span class="chip">' + ICO('inbox', 14) + ' <b>' + s.inbox.length + '</b>&nbsp;da smistare</span>') +
      '<div class="card"><div class="sotto" style="margin:0 0 14px">Regola dei 10 secondi a voce: <b>Azione</b> (diventa un’azione di oggi), <b>Scarta</b> (via senza sensi di colpa). Ciò che resta qui non ti insegue.</div>' +
      '<div class="griglia" id="lista-inbox" style="gap:9px"></div></div>';
    $vista.innerHTML = html;

    var lista = document.getElementById('lista-inbox');
    if (!s.inbox.length) {
      lista.innerHTML = '<div class="vuoto">' + illoInbox() + '<b>Inbox vuota. La mente pure, si spera.</b><br>Premi <kbd>C</kbd> ovunque per catturare al volo.</div>';
      return;
    }
    lista.innerHTML = s.inbox.map(function (el, i) {
      var quando = new Date(el.creata).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      return '<div class="riga-inbox" data-id="' + el.id + '" style="--i:' + i + '">' +
        '<div style="flex:1"><div class="testo">' + esc(el.testo) + '</div><div class="quando">' + quando + '</div>' +
        '<div class="azioni-riga mt-s">' +
        '<span style="width:155px;display:inline-block">' + selectAree('sel-' + el.id) + '</span>' +
        '<button class="btn btn-mini btn-primario" data-fai="azione">' + ICO('arrowRight', 13) + ' Azione oggi</button>' +
        '<button class="btn btn-mini btn-ghost" data-fai="scarta">' + ICO('trash', 13) + ' Scarta</button>' +
        '</div></div></div>';
    }).join('');
    lista.querySelectorAll('.riga-inbox').forEach(function (riga) {
      var id = riga.getAttribute('data-id');
      riga.querySelectorAll('[data-fai]').forEach(function (b) {
        b.addEventListener('click', function () {
          var esito = b.getAttribute('data-fai');
          var area = document.getElementById('sel-' + id).value;
          LM.triageInbox(id, esito, area);
          toast(esito === 'azione' ? 'In lista per oggi' : 'Scartato. Spazio mentale liberato', LM.XP_EVENTI.triage, esito === 'azione' ? 'arrowRight' : 'trash');
          aggiornaNav(); render();
        });
      });
    });
  }

  /* ============================================================
     VISTA: ESPERIMENTI
     ============================================================ */

  function vistaEsperimenti() {
    var s = LM.load();
    var html = topbar('Esperimenti', 'Non «funziona per la gente media»: funziona su di te, misurato.',
      '<button class="btn btn-primario" id="btn-nuovo-exp">' + ICO('plus', 16) + ' Nuovo esperimento</button>') +
      '<div class="card"><div class="sotto" style="margin:0">Il metodo: <b>baseline (A)</b> → <b>intervento (B)</b> sulla stessa metrica. Onestà: senza cieco né randomizzazione è un’indicazione, non una prova — ripetere l’esperimento la rafforza.</div></div>' +
      '<div id="form-exp-zona"></div><div class="griglia mt" id="lista-exp" style="gap:16px"></div>';
    $vista.innerHTML = html;

    document.getElementById('btn-nuovo-exp').addEventListener('click', mostraFormExp);

    var lista = document.getElementById('lista-exp');
    if (!s.esperimenti.length) {
      lista.innerHTML = '<div class="card vuoto">' + illoFlask() + '<b>Nessun esperimento.</b> Idee da cui partire:<br>«sport al mattino → focus», «telefono fuori stanza → minuti di studio», «in letto alle 23:30 → energia».</div>';
    }
    s.esperimenti.forEach(function (e, i) {
      var ris = LM.risultatiEsperimento(e);
      var m = LM.METRICHE_ESPERIMENTO.find(function (x) { return x.id === e.metrica; });
      var card = document.createElement('div');
      card.className = 'card exp-card';
      card.style.setProperty('--i', i);
      var verdetto = '';
      if (ris.baseline.n > 1 && ris.intervento.n > 1) {
        var diff = ris.intervento.media - ris.baseline.media;
        var dEff = ris.effetto;
        var forza = dEff === null ? '' : (Math.abs(dEff) < 0.2 ? 'trascurabile' : Math.abs(dEff) < 0.5 ? 'piccolo' : Math.abs(dEff) < 0.8 ? 'medio' : 'grande');
        verdetto = '<div class="exp-verdetto">' + ICO('trendUp', 16) +
          '<span>Media A <b>' + LMCharts.fmtNum(ris.baseline.media) + '</b> (' + ris.baseline.n + ' giorni) → B <b>' + LMCharts.fmtNum(ris.intervento.media) + '</b> (' + ris.intervento.n + ' giorni) · differenza <b>' + (diff > 0 ? '+' : '') + LMCharts.fmtNum(diff) + '</b>' +
          (dEff !== null ? ' · effetto <b>d≈' + LMCharts.fmtNum(dEff) + '</b> (' + forza + ')' : '') +
          '<br><small>N-of-1 senza cieco: trattala come un indizio forte, non come una sentenza.</small></span></div>';
      } else {
        verdetto = '<div class="exp-verdetto">' + ICO('clock', 16) + '<span>Dati ancora insufficienti: servono almeno 2 giorni con misura in ogni fase. I check-in sono il carburante.</span></div>';
      }
      card.innerHTML = '<div class="exp-testa"><h3>' + esc(e.nome) + '</h3>' +
        '<span class="chip">' + (e.stato === 'attivo' ? '<span class="punto-vivo"></span> attivo' : ICO('check', 13) + ' concluso') + '</span>' +
        '<span class="chip">' + esc(m ? m.nome : e.metrica) + (e.areaId ? ' · ' + esc(areaById(e.areaId).nome) : '') + '</span></div>' +
        (e.intervento ? '<div class="sotto" style="margin:0">Intervento: ' + esc(e.intervento) + '</div>' : '') +
        '<div id="exp-chart-' + i + '"></div>' + verdetto;
      lista.appendChild(card);
      LMCharts.experiment(document.getElementById('exp-chart-' + i), ris, {
        label: 'Esperimento ' + e.nome,
        max: (m && m.fonte !== 'minuti' && m.fonte !== 'xp') ? 5 : undefined,
        ticks: (m && m.fonte !== 'minuti' && m.fonte !== 'xp') ? [1, 3, 5] : undefined,
        min: 0
      });
    });

    function mostraFormExp() {
      var zona = document.getElementById('form-exp-zona');
      zona.innerHTML = '<div class="card mt">' +
        '<h2>Nuovo esperimento</h2><div class="sotto">Gli ultimi N giorni diventano la baseline; l’intervento parte oggi.</div>' +
        '<label class="campo">Domanda / nome</label><input type="text" id="exp-nome" placeholder="Es. Studiare in biblioteca → più minuti di studio?">' +
        '<label class="campo">Cosa cambi concretamente (l’intervento)</label><input type="text" id="exp-int" placeholder="Es. Ogni pomeriggio studio in biblioteca, non in camera">' +
        '<div class="griglia griglia-3 mt-s"><div><label class="campo">Metrica</label><select id="exp-metrica">' +
        LM.METRICHE_ESPERIMENTO.map(function (m2) { return '<option value="' + m2.id + '">' + esc(m2.nome) + '</option>'; }).join('') +
        '</select></div>' +
        '<div><label class="campo">Area (se serve)</label>' + selectAree('exp-area') + '</div>' +
        '<div><label class="campo">Baseline / durata</label><select id="exp-durata">' +
        '<option value="7-14">7 giorni indietro · 14 avanti</option>' +
        '<option value="14-14" selected>14 giorni indietro · 14 avanti</option>' +
        '<option value="14-21">14 giorni indietro · 21 avanti</option>' +
        '</select></div></div>' +
        '<div class="riga-flex mt"><button class="btn btn-primario" id="exp-crea">' + ICO('flask', 16) + ' Avvia</button>' +
        '<button class="btn btn-ghost" id="exp-annulla">Annulla</button></div></div>';
      document.getElementById('exp-annulla').addEventListener('click', function () { zona.innerHTML = ''; });
      document.getElementById('exp-crea').addEventListener('click', function () {
        var nome = document.getElementById('exp-nome').value.trim();
        if (!nome) { toast('Dai un nome all’esperimento', 0, 'flask'); return; }
        var dur = document.getElementById('exp-durata').value.split('-');
        var t = LM.todayKey();
        LM.creaEsperimento({
          nome: nome,
          intervento: document.getElementById('exp-int').value.trim(),
          metrica: document.getElementById('exp-metrica').value,
          areaId: document.getElementById('exp-area').value,
          inizioBaseline: LM.addDays(t, -(+dur[0])),
          inizioIntervento: t,
          fine: LM.addDays(t, +dur[1])
        });
        toast('Esperimento avviato', 0, 'flask');
        render();
      });
    }
  }

  /* ============================================================
     VISTA: SCIENZA
     ============================================================ */

  var PRINCIPI = [
    {
      titolo: 'Cattura istantanea (brain dump)',
      evidenza: 'alta',
      claim: 'La mente ADHD genera pensieri di continuo e la memoria di lavoro è il collo di bottiglia: scaricare subito su un supporto esterno libera risorse cognitive e riduce l’ansia da «me lo devo ricordare».',
      uso: 'Tasto C / ⌘K / bottone + ovunque: un solo campo, zero categorie al momento della cattura. Le decisioni sono rimandate al triage.',
      fonti: 'Knouse & Safren (2010), Clinical Psychology Review — la CBT per ADHD adulto prescrive sistemi esterni di cattura · Risko & Gilbert (2016), Trends in Cognitive Sciences — cognitive offloading.'
    },
    {
      titolo: 'Una sola prossima azione',
      evidenza: 'media',
      claim: 'Con basse risorse di controllo esecutivo, ogni scelta in più è un costo e un’occasione di fuga. Ridurre il menu a UNA voce elimina la paralisi da scelta.',
      uso: 'La vista Focus mostra una sola azione a schermo intero. Le altre esistono ma non si vedono: «Non ora» le fa ruotare senza punizione.',
      fonti: 'Barkley (1997), Psychological Bulletin — ADHD come deficit di inibizione/funzioni esecutive · Iyengar & Lepper (2000), JPSP — il sovraccarico di scelta riduce l’azione.'
    },
    {
      titolo: 'Intenzioni «Se… allora…» (implementation intentions)',
      evidenza: 'alta',
      claim: 'Legare l’azione a un segnale concreto («se sono alla scrivania alle 9, allora…») quasi raddoppia la probabilità di eseguirla: l’avvio diventa automatico invece che affidato alla volontà.',
      uso: 'Il piano del mattino chiede una sola intenzione se-allora, agganciata alla MIT, che poi ricompare nella vista Focus.',
      fonti: 'Gollwitzer & Sheeran (2006), Advances in Experimental Social Psychology — meta-analisi, 94 studi, effetto medio-grande (d≈0.65) · Gawrilow & Gollwitzer (2008) — efficacia specifica in ADHD.'
    },
    {
      titolo: 'Auto-monitoraggio con feedback visivo',
      evidenza: 'alta',
      claim: 'Monitorare il progresso verso un obiettivo aumenta di per sé la probabilità di raggiungerlo, e l’effetto cresce se il progresso è registrato e reso visibile.',
      uso: 'Check-in da 10 secondi, heatmap di consistenza, sparkline per area: tutto ciò che registri lo rivedi, sempre.',
      fonti: 'Harkin et al. (2016), Psychological Bulletin — meta-analisi di 138 RCT: monitorare il progresso migliora il goal attainment · Korotitsch & Nelson-Gray (1999) — reattività dell’auto-monitoraggio.'
    },
    {
      titolo: 'Ricompense immediate (XP a ogni micro-azione)',
      evidenza: 'media',
      claim: 'Nell’ADHD la svalutazione delle ricompense lontane è più ripida: ciò che paga «adesso» vince su ciò che paga «a giugno». Quindi il sistema paga subito, a ogni passo, anche minuscolo.',
      uso: 'XP istantanei con feedback animato per ogni cattura (+1), check-in (+3), azione (+10), MIT (+15). Livelli con anello di progresso sempre visibile.',
      fonti: 'Jackson & MacKillop (2016), J. of Attention Disorders — meta-analisi: maggiore delay discounting in ADHD · Sonuga-Barke (2003) — delay aversion · Hamari et al. (2014); Sailer & Homner (2020), Educational Psychology Review — la gamification funziona, ma dipende dal design.'
    },
    {
      titolo: 'Streak gentile (mai punitiva)',
      evidenza: 'media',
      claim: 'Perdere una serie lunga per un giorno storto demolisce la motivazione proprio in chi ha consistenza fragile. L’auto-critica dopo un fallimento predice più procrastinazione; l’auto-indulgenza strutturata predice la ripresa.',
      uso: 'Un giorno vuoto isolato NON azzera la serie (due consecutivi sì). Il conteggio di oggi non ti rimprovera al mattino: parte da ieri finché oggi non è attivo.',
      fonti: 'Wohl, Pychyl & Bennett (2010), Personality and Individual Differences — perdonarsi riduce la procrastinazione futura · Breines & Chen (2012), Pers Soc Psychol Bull — self-compassion aumenta la motivazione al miglioramento.'
    },
    {
      titolo: 'Rituali con orario: struttura esterna',
      evidenza: 'alta',
      claim: 'I trattamenti non farmacologici per ADHD adulto che reggono ai trial hanno un tratto comune: routine esterne brevi e ripetute (pianificazione quotidiana, revisione, liste corte) che sostituiscono l’auto-regolazione con l’ambiente.',
      uso: 'Mattina 60 secondi (max 3 azioni), sera 2 minuti (voto + vittoria + blocco), settimana 10 minuti. Sempre gli stessi passi, sempre nello stesso ordine.',
      fonti: 'Safren et al. (2005; 2010 JAMA) — RCT: CBT strutturata per adulti ADHD già in farmacoterapia · Solanto et al. (2010), Am J Psychiatry — RCT terapia meta-cognitiva centrata su pianificazione e gestione del tempo.'
    },
    {
      titolo: 'Massimo 3 azioni al giorno',
      evidenza: 'media',
      claim: 'Obiettivi specifici e pochi battono obiettivi vaghi e tanti. Una lista lunga è un generatore di senso di colpa, non un piano: la scarsità forza la scelta di ciò che conta.',
      uso: 'Il piano del mattino si blocca a 3. La prima è la MIT: la giornata è «vinta» se fai solo quella.',
      fonti: 'Locke & Latham (2002), American Psychologist — 35 anni di goal-setting: specificità e difficoltà calibrata · Masicampo & Baumeister (2011), JPSP — pianificare libera la mente dai task aperti (effetto Zeigarnik).'
    },
    {
      titolo: 'Esperimenti N-of-1 su te stesso',
      evidenza: 'alta',
      claim: 'Le medie di gruppo non ti dicono cosa funziona su di te. Il disegno A→B sulla singola persona, con misure ripetute, è un metodo riconosciuto per personalizzare gli interventi — è il cuore «scientifico» di questo sito.',
      uso: 'La vista Esperimenti confronta baseline e intervento su una metrica che già registri (focus, minuti, energia…), con medie, effect size e l’avvertenza onesta sui limiti.',
      fonti: 'Lillie et al. (2011), Personalized Medicine — the n-of-1 clinical trial · Vohra et al. (2015), BMJ — CENT: standard di reporting per trial N-of-1.'
    },
    {
      titolo: 'Novità e varietà controllata',
      evidenza: 'euristica',
      claim: 'L’interesse è il carburante motivazionale più affidabile nell’ADHD: quando l’app annoia, si abbandona. Meglio incanalare la fame di novità dentro il sistema che subirla.',
      uso: 'Tre modalità intercambiabili (Focus / Plancia / Rituali) e due skin (Aurora / Arcade): stessi dati, contenitore nuovo quando serve. Cambiare pelle non costa dati.',
      fonti: 'Coerente con la self-determination theory (Deci & Ryan 2000: autonomia e scelta sostengono la motivazione intrinseca); la prescrizione specifica «varietà di interfaccia» è pratica clinica, non ancora letteratura sperimentale.'
    },
    {
      titolo: 'Ripartenze pulite (fresh start)',
      evidenza: 'media',
      claim: 'I confini temporali (lunedì, primo del mese, «da oggi») aumentano davvero i comportamenti aspirazionali: ogni giorno è trattato come un episodio nuovo, mai come il saldo di un debito.',
      uso: 'Il piano del mattino dichiara «ieri non conta». La chiusura serale sigilla la giornata. Niente backlog che ti insegue: le azioni non fatte muoiono con il giorno.',
      fonti: 'Dai, Milkman & Riis (2014), Management Science — the fresh start effect.'
    },
    {
      titolo: 'Meno frizione = più comportamento',
      evidenza: 'alta',
      claim: 'Piccole barriere cambiano i comportamenti più della motivazione: la formazione di abitudini dipende dalla ripetizione in contesto stabile a basso costo di innesco.',
      uso: 'Cattura in 1 gesto, check-in in 3 tap, nessun campo obbligatorio oltre l’essenziale, il timer registra i minuti da solo. Ogni flusso è misurato in secondi, non minuti.',
      fonti: 'Lally et al. (2010), European J. of Social Psychology — curva di formazione delle abitudini (mediana 66 giorni, conta la ripetizione) · Wood & Neal (2016), Behavioral Science & Policy — friction e contesto guidano l’abitudine.'
    }
  ];

  function vistaScienza() {
    var html = topbar('Perché è fatto così', 'Ogni scelta di design, con le fonti accanto.') +
      '<div class="card"><div class="sotto" style="margin:0">Etichette oneste: <span class="evidenza evidenza-alta">evidenza alta</span> = meta-analisi o RCT · <span class="evidenza evidenza-media">media</span> = studi solidi ma non conclusivi · <span class="evidenza evidenza-euristica">euristica</span> = pratica clinica ragionevole, non ancora provata. Il giudice finale però sei tu: la vista Esperimenti serve a verificare <b>sul tuo caso</b> cosa regge.</div></div>' +
      '<div class="griglia griglia-2 mt">' +
      PRINCIPI.map(function (p, i) {
        var cls = p.evidenza === 'alta' ? 'evidenza-alta' : (p.evidenza === 'media' ? 'evidenza-media' : 'evidenza-euristica');
        var eti = p.evidenza === 'alta' ? 'Evidenza alta' : (p.evidenza === 'media' ? 'Media' : 'Euristica');
        return '<div class="card scienza-card" style="--i:' + i + '">' +
          '<div class="riga-flex" style="justify-content:space-between;flex-wrap:nowrap;align-items:flex-start"><h2 style="margin:0">' + p.titolo + '</h2><span class="evidenza ' + cls + '">' + eti + '</span></div>' +
          '<p style="font-size:13.5px;color:var(--inchiostro-2)">' + p.claim + '</p>' +
          '<div class="uso"><b>Nel prototipo:</b> ' + p.uso + '</div>' +
          '<div class="fonte">' + ICO('book', 14) + '<span>' + p.fonti + '</span></div>' +
          '</div>';
      }).join('') + '</div>';
    $vista.innerHTML = html;
  }

  /* ============================================================
     ONBOARDING
     ============================================================ */

  function onboarding() {
    var root = document.getElementById('onboarding-root');
    var passo = 0;
    var scelte = { nome: '', visione: '', aree: LM.AREE_DEFAULT.map(function (a) { return a.id; }), modo: 'oggi' };

    function disegna() {
      var step = '';
      if (passo === 0) {
        step = '<div class="card"><h2>Chi sei</h2><div class="sotto">Facoltativo, come quasi tutto qui dentro.</div>' +
          '<label class="campo">Nome</label><input type="text" id="ob-nome" value="' + esc(scelte.nome) + '" placeholder="Come ti chiamiamo?">' +
          '<label class="campo">La tua visione in una riga — il «perché» dietro tutto</label>' +
          '<textarea id="ob-visione" placeholder="Es. costruire cose che contano, imparare più veloce di chiunque, restare in salute">' + esc(scelte.visione) + '</textarea>' +
          '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="ob-avanti">Avanti ' + ICO('arrowRight', 16) + '</button>' +
          '<button class="btn btn-ghost" id="ob-demo">Salta tutto, fammi esplorare la demo</button></div></div>';
      } else if (passo === 1) {
        step = '<div class="card"><h2>Le aree della tua vita</h2><div class="sotto">Tutte attive di default: disattiva pure, riattivi quando vuoi.</div>' +
          '<div class="selettore-aree">' + LM.AREE_DEFAULT.map(function (a) {
            var sel = scelte.aree.indexOf(a.id) >= 0;
            return '<button data-area="' + a.id + '" class="' + (sel ? 'sel' : '') + '" style="--c-area:' + LM.SLOT_COLORI[a.slot][0] + '">' +
              ICO(a.icona, 17) + esc(a.nome) + '<span class="segno">' + ICO('check', 15) + '</span></button>';
          }).join('') + '</div>' +
          '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="ob-avanti">Avanti ' + ICO('arrowRight', 16) + '</button>' +
          '<button class="btn btn-ghost" id="ob-indietro">Indietro</button></div></div>';
      } else {
        step = '<div class="card"><h2>Da dove vuoi partire?</h2><div class="sotto">Sono tre facce della stessa app, sugli stessi dati: cambierai quando vuoi. È una funzione, non un difetto.</div>' +
          '<div class="selettore-modi">' +
          modo('oggi', 'target', 'Focus', 'Una sola azione a schermo. Per quando la testa è già piena.') +
          modo('plancia', 'dashboard', 'Plancia', 'La dashboard aperta tutto il giorno: numeri, serie, heatmap.') +
          modo('rituali', 'sun', 'Rituali', 'Mattina 60″ e sera 2′: la struttura fa il lavoro al posto della disciplina.') +
          '</div>' +
          '<div class="riga-flex mt">' +
          '<button class="btn btn-primario btn-grande" id="ob-fine-demo">Parti con 8 settimane di dati demo</button>' +
          '<button class="btn" id="ob-fine-vuoto">Parti da zero</button>' +
          '<button class="btn btn-ghost" id="ob-indietro">Indietro</button></div></div>';
      }

      root.innerHTML = '<div class="onboarding"><div class="ob-grid">' +
        '<aside class="ob-brand">' +
        '<div class="logo">' + LOGO(34) + ' LifeMax</div>' +
        '<div class="ob-titolo">Misura. Ingegnerizza.<br><em>Massimizza.</em></div>' +
        '<p>Il sistema operativo personale per il miglioramento continuo — progettato per una mente che corre.</p>' +
        '<div class="ob-punti">' +
        '<div class="ob-punto">' + ICO('bolt', 16) + '<span><b>Catturare è gratis.</b> Un tasto, zero categorie: decidere si fa dopo.</span></div>' +
        '<div class="ob-punto">' + ICO('target', 16) + '<span><b>Una cosa alla volta.</b> Il sistema sceglie la prossima azione, tu la fai.</span></div>' +
        '<div class="ob-punto">' + ICO('flask', 16) + '<span><b>Scienza su di te.</b> Esperimenti A→B sulle tue metriche, non sulle medie altrui.</span></div>' +
        '</div>' + illoOrbita() + '</aside>' +
        '<section class="ob-step"><div class="passi-punti">' +
        [0, 1, 2].map(function (i) { return '<span class="' + (i === passo ? 'attivo' : '') + '"></span>'; }).join('') +
        '</div>' + step + '</section>' +
        '</div></div>';

      function modo(id, icona, nome, desc) {
        return '<button data-modo="' + id + '" class="' + (scelte.modo === id ? 'sel' : '') + '">' +
          '<span class="icona-modo">' + ICO(icona, 20) + '</span>' +
          '<span><span class="titolo-modo">' + nome + '</span><div class="desc-modo">' + desc + '</div></span></button>';
      }

      var demo = document.getElementById('ob-demo');
      if (demo) demo.addEventListener('click', function () { fine(true); });
      var avanti = document.getElementById('ob-avanti');
      if (avanti) avanti.addEventListener('click', function () {
        if (passo === 0) {
          scelte.nome = document.getElementById('ob-nome').value.trim();
          scelte.visione = document.getElementById('ob-visione').value.trim();
        }
        passo++; disegna();
      });
      var indietro = document.getElementById('ob-indietro');
      if (indietro) indietro.addEventListener('click', function () { passo--; disegna(); });
      root.querySelectorAll('[data-area]').forEach(function (b) {
        b.addEventListener('click', function () {
          var id = b.getAttribute('data-area');
          var i = scelte.aree.indexOf(id);
          if (i >= 0) { if (scelte.aree.length > 1) scelte.aree.splice(i, 1); }
          else scelte.aree.push(id);
          disegna();
        });
      });
      root.querySelectorAll('[data-modo]').forEach(function (b) {
        b.addEventListener('click', function () { scelte.modo = b.getAttribute('data-modo'); disegna(); });
      });
      var fineDemo = document.getElementById('ob-fine-demo');
      if (fineDemo) fineDemo.addEventListener('click', function () { fine(true); });
      var fineVuoto = document.getElementById('ob-fine-vuoto');
      if (fineVuoto) fineVuoto.addEventListener('click', function () { fine(false); });
    }

    function fine(conDemo) {
      if (conDemo) LM.seedDemo();
      var s = LM.load();
      s.onboarded = true;
      if (scelte.nome) s.profilo.nome = scelte.nome;
      if (scelte.visione) s.profilo.visione = scelte.visione;
      s.areeAttive = scelte.aree;
      LM.save();
      root.innerHTML = '';
      location.hash = '#/' + scelte.modo;
      applicaTema();
      render();
      toast(conDemo ? 'Benvenuto. Esplora: è tutto vivo' : 'Si parte. Prima mossa: piano del mattino', 0, 'sparkles');
    }

    disegna();
  }

  /* ---------- render ---------- */

  function render() {
    var s = LM.load();
    if (!s.onboarded) {
      if (!document.getElementById('onboarding-root').innerHTML) onboarding();
      return;
    }
    document.getElementById('onboarding-root').innerHTML = '';
    LMCharts.hideTip();
    aggiornaNav();
    bandaDemo();
    /* riattiva le animazioni d'ingresso della vista */
    $vista.classList.remove('vista-enter');
    void $vista.offsetWidth;
    var v = vistaCorrente();
    if (v === 'oggi') vistaFocus();
    else if (v === 'plancia') vistaPlancia();
    else if (v === 'rituali') vistaRituali();
    else if (v === 'inbox') vistaInbox();
    else if (v === 'esperimenti') vistaEsperimenti();
    else if (v === 'scienza') vistaScienza();
    $vista.classList.add('vista-enter');
  }

  window.addEventListener('hashchange', function () {
    if (vistaCorrente() !== 'rituali') sottoRituale = null;
    render();
  });

  /* chrome statico */
  document.getElementById('logo-blocco').innerHTML = LOGO(30) + ' LifeMax <span class="logo-tag">Beta</span>';
  document.getElementById('btn-tema').innerHTML = ICO('moon', 17);
  document.getElementById('btn-skin').innerHTML = ICO('palette', 17);
  document.getElementById('btn-demo').innerHTML = ICO('refresh', 17);
  document.getElementById('btn-azzera').innerHTML = ICO('trash', 17);

  applicaTema();
  render();
})();
