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

  function setModo(m) {
    var s = LM.load();
    s.profilo.modo = m;
    LM.save(); applicaTema(); render();
  }
  function setSkin(sk) {
    var s = LM.load();
    s.profilo.skin = sk;
    LM.save(); applicaTema(); render();
  }
  function caricaDemo() {
    if (confirm('Vuoi sostituire i dati attuali con 8 settimane di dati di esempio?')) {
      LM.seedDemo(); applicaTema(); chiudiSheet(); render();
      toast('Dati di esempio caricati.', 0, 'refresh');
    }
  }
  function azzeraTutto() {
    if (confirm('Vuoi cancellare tutti i dati e ripartire da zero? I dati sono salvati solo su questo browser.')) {
      LM.reset(); chiudiSheet(); location.hash = '#/oggi'; render();
    }
  }

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
  var $sideCatt = document.getElementById('side-cattura');
  $sideCatt.querySelector('.cattura-cta-testo').innerHTML = ICO('bolt', 16) + ' Cattura un pensiero';
  $sideCatt.addEventListener('click', apriCattura);
  $ovl.addEventListener('click', function (e) { if (e.target === $ovl) chiudiCattura(); });
  $inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && $inp.value.trim()) {
      var xp = LM.cattura($inp.value.trim());
      toast('Salvato nell’inbox. Puoi tornare a ciò che stavi facendo.', xp, 'inbox');
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

  /* ---------- pannello (sheet) ---------- */

  var $sheet = document.getElementById('sheet-overlay');
  document.getElementById('sheet-chiudi').innerHTML = ICO('x', 18);
  document.getElementById('sheet-chiudi').addEventListener('click', chiudiSheet);
  $sheet.addEventListener('click', function (e) { if (e.target === $sheet) chiudiSheet(); });

  var wireSheet = null;
  function apriSheet(titolo, html, onWire) {
    document.getElementById('sheet-titolo').textContent = titolo;
    document.getElementById('sheet-corpo').innerHTML = html;
    $sheet.hidden = false;
    wireSheet = onWire || null;
    if (wireSheet) wireSheet(document.getElementById('sheet-corpo'));
  }
  function chiudiSheet() { $sheet.hidden = true; wireSheet = null; }

  /* ---------- navigazione ---------- */
  /* gruppo: 'primaria' = destinazioni quotidiane (sidebar + tab bar mobile);
     'secondaria' = approfondimenti (sidebar, e nel menu "Altro" su mobile). */

  var VISTE = [
    { id: 'oggi',        nome: 'Oggi',        icona: 'target',    gruppo: 'primaria' },
    { id: 'plancia',     nome: 'Panoramica',  icona: 'dashboard', gruppo: 'primaria' },
    { id: 'rituali',     nome: 'Rituali',     icona: 'sun',       gruppo: 'primaria' },
    { id: 'inbox',       nome: 'Inbox',       icona: 'inbox',     gruppo: 'primaria' },
    { id: 'esperimenti', nome: 'Esperimenti', icona: 'flask',     gruppo: 'secondaria' },
    { id: 'scienza',     nome: 'Perché funziona', icona: 'atom',  gruppo: 'secondaria' }
  ];
  function vistaById(id) { return VISTE.find(function (v) { return v.id === id; }); }

  function vistaCorrente() {
    var h = (location.hash || '#/oggi').replace('#/', '').split('/')[0];
    return VISTE.some(function (v) { return v.id === h; }) ? h : 'oggi';
  }

  function badgeInbox(v, s) {
    return v.id === 'inbox' && s.inbox.length ? '<span class="nav-badge">' + s.inbox.length + '</span>' : '';
  }

  function aggiornaNav() {
    var s = LM.load();
    var corrente = vistaCorrente();

    /* sidebar desktop: primarie, poi separatore, poi secondarie */
    var lato = document.getElementById('nav-lato');
    function voce(v) {
      return '<a class="nav-item' + (corrente === v.id ? ' attivo' : '') + '" href="#/' + v.id + '">' +
        ICO(v.icona, 17) + '<span>' + v.nome + '</span>' + badgeInbox(v, s) + '</a>';
    }
    lato.innerHTML =
      VISTE.filter(function (v) { return v.gruppo === 'primaria'; }).map(voce).join('') +
      '<div class="nav-sep"></div>' +
      VISTE.filter(function (v) { return v.gruppo === 'secondaria'; }).map(voce).join('');

    /* footer sidebar: account + impostazioni */
    document.getElementById('sidebar-fondo').innerHTML = footerSidebar();
    wireFooterSidebar();

    /* tab bar mobile: 4 primarie + "Altro" */
    var tab = document.getElementById('nav-tab');
    var primarie = VISTE.filter(function (v) { return v.gruppo === 'primaria'; });
    var inSecondaria = corrente === 'esperimenti' || corrente === 'scienza';
    tab.innerHTML = primarie.map(function (v) {
      return '<button data-vai="' + v.id + '" class="' + (corrente === v.id ? 'attivo' : '') + '">' +
        '<span class="tab-ico">' + ICO(v.icona, 21) + badgeInbox(v, s) + '</span>' + v.nome + '</button>';
    }).join('') +
      '<button data-menu="1" class="' + (inSecondaria ? 'attivo' : '') + '"><span class="tab-ico">' + ICO('sparkles', 21) + '</span>Altro</button>';
    tab.querySelectorAll('[data-vai]').forEach(function (b) {
      b.addEventListener('click', function () { location.hash = '#/' + b.getAttribute('data-vai'); });
    });
    tab.querySelector('[data-menu]').addEventListener('click', apriMenuAltro);
  }

  /* ---------- footer sidebar (account + impostazioni) ---------- */

  function footerSidebar() {
    var a = window.LM_AUTH || { available: false, user: null };
    var acct;
    if (a.user) {
      var iniz = (a.user.name || a.user.email || '?').trim().charAt(0).toUpperCase();
      var avatar = a.user.photo
        ? '<img class="avatar" src="' + esc(a.user.photo) + '" alt="" referrerpolicy="no-referrer">'
        : '<span class="avatar avatar-ph">' + esc(iniz) + '</span>';
      acct = '<div class="fondo-account">' + avatar +
        '<div class="fondo-account-testo"><b>' + esc(a.user.name || 'Il tuo account') + '</b>' +
        '<small>' + ICO('cloudCheck', 12) + ' Sincronizzato</small></div></div>';
    } else if (a.available) {
      acct = '<button class="btn btn-mini btn-accedi" id="fondo-accedi">' + GOOGLE_G(15) + ' Accedi con Google</button>';
    } else {
      acct = '<div class="fondo-locale">' + ICO('cloud', 13) + ' Dati salvati su questo dispositivo</div>';
    }
    return acct + '<button class="btn-strumento-largo" id="fondo-impostazioni">' + ICO('sun', 16) + '<span>Impostazioni</span></button>';
  }

  function wireFooterSidebar() {
    var acc = document.getElementById('fondo-accedi');
    if (acc) acc.addEventListener('click', function () { if (window.LMCloud && window.LMCloud.available) window.LMCloud.signIn(); });
    var imp = document.getElementById('fondo-impostazioni');
    if (imp) imp.addEventListener('click', apriImpostazioni);
  }

  /* ---------- impostazioni & menu "Altro" ---------- */

  function htmlAspetto() {
    var s = LM.load();
    var modo = s.profilo.modo || 'auto';
    var skin = s.profilo.skin || 'quiete';
    function segM(v, ico, et) { return '<button data-modo="' + v + '" class="' + (modo === v ? 'attivo' : '') + '">' + ICO(ico, 15) + et + '</button>'; }
    function segS(v, et) { return '<button data-skin="' + v + '" class="' + (skin === v ? 'attivo' : '') + '">' + et + '</button>'; }
    return '<div class="imp-sezione"><div class="imp-eti">Tema</div>' +
      '<div class="segmenti imp-seg" id="seg-modo">' + segM('auto', 'refresh', 'Auto') + segM('light', 'sun', 'Chiaro') + segM('dark', 'moon', 'Scuro') + '</div></div>' +
      '<div class="imp-sezione"><div class="imp-eti">Aspetto</div>' +
      '<div class="segmenti imp-seg" id="seg-skin">' + segS('quiete', 'Aurora') + segS('arcade', 'Arcade') + '</div>' +
      '<div class="imp-nota">Aurora è più sobrio, Arcade più acceso. Cambia solo l’aspetto, non i dati.</div></div>';
  }

  function htmlDati() {
    return '<div class="imp-sezione"><div class="imp-eti">Dati</div>' +
      '<button class="btn btn-mini" id="imp-demo">' + ICO('refresh', 14) + ' Carica dati di esempio</button> ' +
      '<button class="btn btn-mini imp-pericolo" id="imp-azzera">' + ICO('trash', 14) + ' Azzera tutto</button>' +
      '<div class="imp-nota">Azzera cancella definitivamente i dati di questo dispositivo.</div></div>';
  }

  function wireAspettoDati(root) {
    root.querySelectorAll('#seg-modo [data-modo]').forEach(function (b) {
      b.addEventListener('click', function () { setModo(b.getAttribute('data-modo')); });
    });
    root.querySelectorAll('#seg-skin [data-skin]').forEach(function (b) {
      b.addEventListener('click', function () { setSkin(b.getAttribute('data-skin')); });
    });
    var d = root.querySelector('#imp-demo'); if (d) d.addEventListener('click', caricaDemo);
    var z = root.querySelector('#imp-azzera'); if (z) z.addEventListener('click', azzeraTutto);
  }

  function apriImpostazioni() {
    apriSheet('Impostazioni', htmlAspetto() + htmlDati(), wireAspettoDati);
  }

  function apriMenuAltro() {
    var s = LM.load();
    var link = VISTE.filter(function (v) { return v.gruppo === 'secondaria'; }).map(function (v) {
      return '<button class="menu-voce" data-vai="' + v.id + '">' + ICO(v.icona, 18) + '<span>' + v.nome + '</span>' + ICO('arrowRight', 15) + '</button>';
    }).join('');
    var a = window.LM_AUTH || { available: false, user: null };
    var acct;
    if (a.user) {
      acct = '<div class="menu-account">' + ICO('cloudCheck', 15) + ' Connesso come <b>' + esc(a.user.name || a.user.email) + '</b>' +
        '<button class="btn btn-mini btn-ghost" id="menu-esci">' + ICO('logout', 14) + ' Esci</button></div>';
    } else if (a.available) {
      acct = '<button class="btn btn-accedi" id="menu-accedi" style="width:100%;justify-content:center">' + GOOGLE_G(17) + ' Accedi con Google</button>' +
        '<div class="imp-nota">Accedi per ritrovare i tuoi dati su tutti i dispositivi.</div>';
    } else {
      acct = '<div class="fondo-locale">' + ICO('cloud', 13) + ' Dati salvati su questo dispositivo</div>';
    }
    apriSheet('Menu', '<div class="menu-lista">' + link + '</div>' +
      '<div class="imp-sezione"><div class="imp-eti">Account</div>' + acct + '</div>' +
      htmlAspetto() + htmlDati(), function (root) {
      root.querySelectorAll('[data-vai]').forEach(function (b) {
        b.addEventListener('click', function () { chiudiSheet(); location.hash = '#/' + b.getAttribute('data-vai'); });
      });
      var la = root.querySelector('#menu-accedi'); if (la) la.addEventListener('click', function () { if (window.LMCloud && window.LMCloud.available) window.LMCloud.signIn(); });
      var le = root.querySelector('#menu-esci'); if (le) le.addEventListener('click', function () { if (window.LMCloud) window.LMCloud.signOut(); chiudiSheet(); toast('Hai effettuato la disconnessione.', 0, 'logout'); });
      wireAspettoDati(root);
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

  function refreshObAccount() {
    var el = document.getElementById('ob-account');
    if (!el) return;
    var a = window.LM_AUTH || { available: false, user: null };
    if (a.user) {
      el.innerHTML = '<div class="ob-account-in">' + ICO('cloudCheck', 16) + ' Accesso eseguito come <b>' + esc(a.user.name || a.user.email) + '</b></div>';
    } else if (a.available) {
      el.innerHTML = '<button class="btn btn-accedi" id="ob-accedi">' + GOOGLE_G(18) + ' Accedi con Google</button>' +
        '<div class="ob-account-nota">Accedi per ritrovare i tuoi dati su tutti i dispositivi. Puoi anche continuare senza account e collegarlo più avanti.</div>';
      var b = document.getElementById('ob-accedi');
      if (b) b.addEventListener('click', function () {
        if (window.LMCloud && window.LMCloud.available) window.LMCloud.signIn();
      });
    } else {
      el.innerHTML = '';
    }
  }

  function bandaDemo() {
    var s = LM.load();
    var banda = document.getElementById('banda-demo');
    if (!s.demo || s.demoChiusa) { banda.innerHTML = ''; return; }
    banda.innerHTML = '<div class="banda-demo"><span>' + ICO('sparkles', 13) +
      ' Stai esplorando <b>dati di esempio</b>: modifica pure, tutto resta salvato.</span>' +
      '<button class="banda-x" id="banda-x" aria-label="Nascondi">' + ICO('x', 14) + '</button></div>';
    document.getElementById('banda-x').addEventListener('click', function () {
      LM.load().demoChiusa = true; LM.save(); banda.innerHTML = '';
    });
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
        toast('Timer finito. Ho registrato i minuti: continua o fai una pausa.', 0, 'clock');
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
    var html = topbar('Oggi', 'Una sola azione per volta, così puoi concentrarti su quella.',
      '<span class="chip">' + ICO('check', 14) + ' <b>&nbsp;' + fatte + '/' + oggi.length + '</b>&nbsp;oggi</span>');

    if (!prossima) {
      html += '<div class="focus-scena"><div class="vuoto">' + illoSole() +
        (oggi.length ? '<b>Hai completato tutte le azioni di oggi.</b><br>Se vuoi, puoi fare la review della sera oppure aggiungere qualcosa di nuovo.'
                     : '<b>Non hai ancora pianificato la giornata, e va bene così.</b><br>Bastano sessanta secondi per scegliere la prima azione.') +
        '</div>' +
        '<div class="focus-azioni-riga">' +
        '<button class="btn btn-primario btn-grande" data-vai="rituali">' + ICO('sun', 18) + ' Pianifica la giornata</button>' +
        '<button class="btn" data-vai="inbox">' + ICO('inbox', 17) + ' Scegli dall’inbox</button>' +
        (oggi.length ? '<button class="btn" data-vai="rituali" data-sub="sera">' + ICO('moon', 17) + ' Review della sera</button>' : '') +
        '</div>' +
        '<form id="form-rapida" class="riga-flex" style="max-width:580px;width:100%">' +
        '<input type="text" id="testo-rapida" placeholder="Oppure scrivi qui la prossima azione" style="flex:1;min-width:220px">' +
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
      (prossima.mit ? ICO('star', 15) + ' L’azione più importante di oggi' : ICO('target', 15) + ' La tua prossima azione') + '</div>' +
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
      /* gerarchia chiara: un'unica azione dominante, il resto recede */
      '<div class="focus-primaria">' +
      '<button class="btn btn-ok btn-grande" id="btn-fatto">' + ICO('check', 18) + ' Fatto <small>+' + xpPrevisti + ' XP</small></button>' +
      '</div>' +
      '<div class="focus-secondarie">' +
      (timerAttivo
        ? '<button class="btn btn-mini" id="btn-stop-timer">' + ICO('pause', 15) + ' Ferma e registra</button>'
        : '<span class="timer-gruppo">' + ICO('play', 14) + ' Timer' +
          '<button class="chip-tempo" data-min="25" id="btn-timer">25′</button>' +
          '<button class="chip-tempo" data-min="10">10′</button>' +
          '<button class="chip-tempo" data-min="50">50′</button></span>') +
      '<button class="btn btn-mini btn-ghost" id="btn-nonora">Più tardi ' + ICO('arrowRight', 14) + '</button>' +
      '</div>' +
      '<div class="focus-coda">' +
      (inCoda > 0
        ? '<span class="pila-coda">' + '<i></i>'.repeat(Math.min(3, inCoda)) + '</span> Dopo questa hai ancora <b>' + inCoda + '</b> ' + (inCoda === 1 ? 'azione' : 'azioni') + ', una alla volta.'
        : 'È l’ultima azione della giornata.') +
      '<span>·</span><span>Ti è venuto in mente qualcosa? Premi <kbd>C</kbd> per annotarlo senza perdere il filo.</span></div>' +
      '</div>';

    $vista.innerHTML = html;

    document.getElementById('btn-fatto').addEventListener('click', function (ev) {
      var eraTimer = timer.azioneId === prossima.id;
      if (eraTimer) fermaTimer(true);
      var xp = LM.completaAzione(prossima.id);
      var r = ev.currentTarget.getBoundingClientRect();
      flyXp(r.left + r.width / 2, r.top, xp);
      if (prossima.mit) burst(r.left + r.width / 2, r.top + r.height / 2);
      toast(prossima.mit ? 'Hai completato l’azione più importante di oggi.' : 'Azione completata.', xp, prossima.mit ? 'star' : 'check');
      render();
    });
    document.getElementById('btn-nonora').addEventListener('click', function () {
      fermaTimer(false);
      LM.rimandaAzione(prossima.id);
      toast('Va bene, la rivedrai più tardi.', 0, 'arrowRight');
      render();
    });
    if (timerAttivo) {
      document.getElementById('btn-stop-timer').addEventListener('click', function () {
        fermaTimer(true);
        toast('Ho registrato i minuti dedicati a ' + area.nome + '.', 0, 'clock');
        render();
      });
    } else {
      $vista.querySelectorAll('.chip-tempo').forEach(function (b) {
        b.addEventListener('click', function () { avviaTimer(prossima.id, +b.getAttribute('data-min')); });
      });
    }
  }

  /* ============================================================
     VISTA: PLANCIA
     ============================================================ */

  var sezPlancia = 'riepilogo';
  var periodoTrend = 14;

  function vistaPlancia() {
    var s = LM.load();
    var lvl = LM.livelloDaXp(s.xp);
    var st = LM.streak();
    var oggi = LM.azioniDiOggi();
    var fatte = oggi.filter(function (a) { return a.done; }).length;
    var t = LM.todayKey();
    var checkinOggi = s.checkins.filter(function (c) { return c.data === t; }).length;

    var html = topbar('Panoramica', 'Il quadro dei tuoi dati, una sezione alla volta.');

    /* eroe essenziale: anello + XP + tre indicatori come chip (niente
       muro di didascalie: le spiegazioni stanno nei tooltip) */
    function chip(ico, testo, cls, titolo) {
      return '<span class="chip"' + (titolo ? ' title="' + esc(titolo) + '"' : '') + '>' + ICO(ico, 14, cls) + ' ' + testo + '</span>';
    }
    html += '<div class="card eroe2">' +
      '<div id="anello-livello" title="Progresso verso il prossimo livello"></div>' +
      '<div class="eroe2-corpo">' +
      '<div class="eroe2-xp"><span id="xp-contatore">0</span> <span class="eroe2-unita">XP</span></div>' +
      '<div class="eroe2-sub">Livello ' + lvl.livello + ' · ancora ' + (lvl.prossimo - s.xp) + ' XP al livello ' + (lvl.livello + 1) + '</div>' +
      '<div class="eroe2-chips">' +
      chip('flame', '<b>' + st.corrente + '</b> giorni di fila', 'fiamma', 'Un giorno saltato non azzera la serie.') +
      chip('check', '<b>' + fatte + '/' + oggi.length + '</b> azioni oggi') +
      chip('bolt', '<b>' + checkinOggi + '</b> check-in oggi') +
      '</div></div>' +
      '<button class="btn btn-primario eroe2-cta" data-vai="oggi">' + ICO('target', 16) + ' Prossima azione</button>' +
      '</div>';

    /* schede interne: si vede una sezione per volta */
    function segp(id, ico, et) { return '<button data-sez="' + id + '" class="' + (sezPlancia === id ? 'attivo' : '') + '">' + ICO(ico, 15) + et + '</button>'; }
    html += '<div class="segmenti sez-nav" id="sez-plancia">' + segp('riepilogo', 'dashboard', 'Riepilogo') + segp('aree', 'sparkles', 'Aree') + segp('andamento', 'trendUp', 'Andamento') + '</div>';
    html += '<div id="sez-corpo"></div>';

    $vista.innerHTML = html;

    countUp(document.getElementById('xp-contatore'), s.xp);
    LMCharts.ring(document.getElementById('anello-livello'), lvl.pct, { size: 96, centro: 'L' + lvl.livello, label: 'Livello ' + lvl.livello + ', ' + Math.round(lvl.pct * 100) + '% verso il prossimo' });

    document.getElementById('sez-plancia').querySelectorAll('[data-sez]').forEach(function (b) {
      b.addEventListener('click', function () { sezPlancia = b.getAttribute('data-sez'); disegnaSezione(); aggiornaSegP(); });
    });
    $vista.querySelectorAll('[data-vai]').forEach(function (b) {
      b.addEventListener('click', function () { location.hash = '#/' + b.getAttribute('data-vai'); });
    });

    disegnaSezione();

    function aggiornaSegP() {
      document.getElementById('sez-plancia').querySelectorAll('[data-sez]').forEach(function (b) {
        b.classList.toggle('attivo', b.getAttribute('data-sez') === sezPlancia);
      });
    }

    function disegnaSezione() {
      var c = document.getElementById('sez-corpo');
      c.classList.remove('vista-enter'); void c.offsetWidth;
      if (sezPlancia === 'riepilogo') sezRiepilogo(c);
      else if (sezPlancia === 'aree') sezAree(c);
      else sezAndamento(c);
      c.classList.add('vista-enter');
    }

    /* --- Riepilogo: azioni di oggi + costanza --- */
    function sezRiepilogo(c) {
      c.innerHTML = '<div class="griglia griglia-2">' +
        '<div class="card" style="--i:0"><h2>' + ICO('target', 16) + ' Azioni di oggi</h2>' +
        '<div class="sotto">Inizia dall’azione più importante. Le altre vengono dopo.</div>' +
        '<div class="lista-azioni" id="lista-oggi"></div>' +
        '<form id="form-add" class="riga-flex mt-s"><input type="text" id="testo-add" placeholder="Aggiungi un’azione per oggi…" style="flex:1;min-width:150px">' +
        '<span style="width:132px">' + selectAree('area-add') + '</span>' +
        '<button class="btn btn-mini btn-primario" type="submit">' + ICO('plus', 14) + '</button></form></div>' +
        '<div class="card" style="--i:1"><h2>' + ICO('trendUp', 16) + ' Costanza</h2>' +
        '<div class="sotto">XP per giorno, ultime 12 settimane. Conta il ritmo nel tempo, più del singolo giorno.</div>' +
        '<div id="heatmap"></div></div></div>';

      LMCharts.heatmap(document.getElementById('heatmap'), LM.heatmapConsistenza(12));

      var lista = document.getElementById('lista-oggi');
      if (!oggi.length) {
        lista.innerHTML = '<div class="vuoto" style="padding:16px 8px">Non hai ancora scelto le azioni di oggi.<br><a href="#/rituali">Pianifica la giornata</a> in un minuto.</div>';
      } else {
        lista.innerHTML = oggi.map(function (a) {
          var ar = areaById(a.areaId);
          return '<div class="riga-azione' + (a.done ? ' fatta' : '') + '">' +
            '<button class="spunta" data-id="' + a.id + '" aria-label="Completa">' + ICO('check', 13) + '</button>' +
            '<span class="testo">' + esc(a.testo) + '</span>' +
            (a.mit ? '<span class="tag-mit">' + ICO('star', 10) + 'Priorità</span>' : '') +
            '<span class="tag-area" style="--c-area:' + LM.coloreArea(ar) + '" title="' + esc(ar.nome) + '">' + ICO(ar.icona, 15) + '</span></div>';
        }).join('');
        lista.querySelectorAll('.spunta').forEach(function (b) {
          b.addEventListener('click', function (ev) {
            var xp = LM.completaAzione(b.getAttribute('data-id'));
            if (xp) { var r = ev.currentTarget.getBoundingClientRect(); flyXp(r.left + r.width / 2, r.top, xp); toast('Azione completata.', xp); }
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
    }

    /* --- Aree: griglia delle aree di vita --- */
    function sezAree(c) {
      c.innerHTML = '<div class="griglia griglia-aree" id="griglia-aree"></div>';
      var ga = document.getElementById('griglia-aree');
      ga.innerHTML = areeAttive().map(function (a, i) {
        var media = LM.mediaValutazioneArea(a.id, 7);
        var min7 = LM.serieMinuti(a.id, 7).reduce(function (x, p) { return x + p.valore; }, 0);
        return '<div class="card card-area card-hover" style="--i:' + i + ';--c-area:' + LM.coloreArea(a) + '">' +
          '<div class="testata"><span class="icona-area">' + ICO(a.icona, 16) + '</span>' + esc(a.nome) + '</div>' +
          '<div id="spark-' + a.id + '"></div>' +
          '<div class="area-metriche"><div><b>' + (media ? LMCharts.fmtNum(media) : '—') + '</b><span>voto medio 7g</span></div>' +
          '<div><b>' + min7 + '</b><span>minuti 7g</span></div></div>' +
          '<div class="sistema-nota">' + esc(a.sistema) + '</div></div>';
      }).join('');
      areeAttive().forEach(function (a) {
        LMCharts.sparkline(document.getElementById('spark-' + a.id), LM.serieValutazioni(a.id, 14),
          { min: 1, max: 5, colore: LM.coloreArea(a), label: 'Auto-valutazione ' + a.nome + ', 14 giorni', unita: '/5' });
      });
    }

    /* --- Andamento: check-in nel tempo + minuti per area --- */
    function sezAndamento(c) {
      var dark = document.documentElement.getAttribute('data-mode') === 'dark';
      c.innerHTML = '<div class="card" style="--i:0"><div class="card-testa"><h2>' + ICO('bolt', 16) + ' Energia, focus e umore</h2>' +
        '<div class="segmenti mini-seg" id="seg-periodo">' +
        '<button data-g="14" class="' + (periodoTrend === 14 ? 'attivo' : '') + '">14 giorni</button>' +
        '<button data-g="30" class="' + (periodoTrend === 30 ? 'attivo' : '') + '">30 giorni</button></div></div>' +
        '<div class="sotto">Media dei tuoi check-in, su una scala da 1 a 5.</div><div id="trend-checkin"></div></div>' +
        '<div class="card mt" style="--i:1"><h2>' + ICO('clock', 16) + ' Come hai speso il tempo</h2>' +
        '<div class="sotto">Minuti registrati per ciascuna area negli ultimi 7 giorni.</div><div id="hbar-minuti"></div></div>';

      LMCharts.trend(document.getElementById('trend-checkin'), [
        { nome: 'Energia', colore: dark ? '#c98500' : '#eda100', punti: LM.serieCheckin('energia', periodoTrend) },
        { nome: 'Focus',   colore: dark ? '#3987e5' : '#2a78d6', punti: LM.serieCheckin('focus', periodoTrend) },
        { nome: 'Umore',   colore: dark ? '#199e70' : '#1baf7a', punti: LM.serieCheckin('umore', periodoTrend) }
      ], { min: 1, max: 5, label: 'Andamento di energia, focus e umore' });

      LMCharts.hbar(document.getElementById('hbar-minuti'),
        LM.minutiSettimanaPerArea().sort(function (a, b) { return b.minuti - a.minuti; })
          .map(function (r) { return { label: r.area.nome, icona: ICO(r.area.icona, 14), value: r.minuti, colore: LM.coloreArea(r.area) }; }),
        { unita: 'min' });

      document.getElementById('seg-periodo').querySelectorAll('[data-g]').forEach(function (b) {
        b.addEventListener('click', function () { periodoTrend = +b.getAttribute('data-g'); disegnaSezione(); });
      });
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

    var suggerito = (ora < 12 ? 'mattina' : (ora >= 19 ? 'sera' : 'checkin'));
    var html = topbar('Rituali', 'Poche azioni fisse ogni giorno, così non devi decidere tutto ogni volta.') +
      '<div class="rituali-nav segmenti" id="seg-rituali">' +
      seg('mattina', 'sun', 'Mattina') + seg('checkin', 'bolt', 'Check-in') + seg('sera', 'moon', 'Sera') + seg('settimana', 'calendar', 'Settimana') +
      '</div>' +
      '<div class="passo-rituale" id="corpo-rituale"></div>';
    $vista.innerHTML = html;
    void suggerito;

    document.getElementById('seg-rituali').querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { sottoRituale = b.getAttribute('data-sub'); render(); });
    });

    var corpo = document.getElementById('corpo-rituale');
    if (sub === 'mattina') ritualeMattina(corpo);
    if (sub === 'checkin') ritualeCheckin(corpo);
    if (sub === 'sera') ritualeSera(corpo);
    if (sub === 'settimana') ritualeSettimana(corpo);

    function seg(id, icona, nome) {
      var ora2 = new Date().getHours();
      var sugg = (ora2 < 12 ? 'mattina' : (ora2 >= 19 ? 'sera' : 'checkin'));
      var puntino = (id === sugg && sub !== id) ? '<span class="seg-ora" title="Consigliato ora"></span>' : '';
      return '<button data-sub="' + id + '" class="' + (sub === id ? 'attivo' : '') + '">' + ICO(icona, 15) + nome + puntino + '</button>';
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
      testaRituale('sun', 'Piano del mattino',
        'Un minuto per iniziare la giornata. Ogni giorno riparte da capo, indipendentemente da com’è andato ieri. Scegli al massimo <b>tre azioni</b>: la prima è la più importante, e se completi solo quella è comunque una buona giornata.') +
      '<div class="lista-azioni" id="piano-lista"></div>' +
      (oggi.length < 3
        ? '<form id="form-piano" class="mt-s"><div class="riga-flex">' +
          '<input type="text" id="piano-testo" placeholder="' + (oggi.length === 0 ? 'La cosa più importante di oggi…' : 'Un’altra azione (facoltativa)…') + '" style="flex:1;min-width:180px">' +
          '<span style="width:155px">' + selectAree('piano-area') + '</span>' +
          '<button class="btn btn-primario" type="submit">' + ICO('plus', 16) + '</button></div></form>'
        : '<div class="sotto mt-s">Hai già tre azioni: sono sufficienti. Aggiungerne altre rende meno probabile completarle.</div>') +
      '<label class="campo">Decidi adesso quando e dove inizierai l’azione più importante</label>' +
      '<input type="text" id="piano-ifthen" placeholder="Es. alle 9:00, appena mi siedo alla scrivania, apro solo il file su cui devo lavorare" value="' + (piano ? esc(piano.intenzione) : '') + '">' +
      '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="btn-salva-piano">' + (piano ? 'Aggiorna il piano' : 'Salva il piano') + ' <small>+' + LM.XP_EVENTI.pianoMattina + ' XP</small></button>' +
      '<button class="btn btn-ghost" id="btn-vai-focus">Inizia ora ' + ICO('arrowRight', 15) + '</button></div>' +
      '</div>';

    var lista = document.getElementById('piano-lista');
    lista.innerHTML = oggi.length
      ? oggi.map(function (a) {
          var ar = areaById(a.areaId);
          return '<div class="riga-azione' + (a.done ? ' fatta' : '') + '"><span class="testo">' + esc(a.testo) + '</span>' +
            (a.mit ? '<span class="tag-mit">' + ICO('star', 10) + 'Priorità</span>' : '') +
            '<span class="tag-area" style="--c-area:' + LM.coloreArea(ar) + '" title="' + esc(ar.nome) + '">' + ICO(ar.icona, 15) + '</span></div>';
        }).join('')
      : '<div class="vuoto" style="padding:14px">Nessuna azione per ora. La prima che scrivi sarà quella più importante.</div>';

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
      toast(xp ? 'Piano salvato. Ora puoi concentrarti sull’esecuzione.' : 'Piano aggiornato.', xp, 'sun');
      render();
    });
    document.getElementById('btn-vai-focus').addEventListener('click', function () { location.hash = '#/oggi'; });
  }

  function ritualeCheckin(corpo) {
    var voti = { energia: 0, focus: 0, umore: 0 };
    corpo.innerHTML = '<div class="card">' +
      testaRituale('bolt', 'Come stai adesso', 'Rispondi a tre domande veloci, senza scrivere nulla. Questi dati sono la base dei tuoi esperimenti.') +
      scala('energia', 'bolt', 'Quanta energia hai?') + scala('focus', 'target', 'Quanto riesci a concentrarti?') + scala('umore', 'smile', 'Come ti senti?') +
      '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="btn-salva-checkin" disabled>Registra <small>+' + LM.XP_EVENTI.checkin + ' XP</small></button></div>' +
      '</div><div class="card mt"><h2>' + ICO('trendUp', 16) + ' Andamento degli ultimi 14 giorni</h2><div id="mini-trend"></div></div>';

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
      toast('Salvato. Puoi tornare a ciò che stavi facendo.', xp, 'bolt');
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
      testaRituale('moon', 'Review della sera',
        'Due minuti per chiudere la giornata. Dai un voto alle aree su cui hai lavorato, annota una cosa andata bene e un ostacolo. Poi la giornata è <b>conclusa</b> e puoi lasciarla andare.') +
      '<div id="voti-aree">' + ordinate.map(function (a) {
        return '<div class="voto-area" data-area="' + a.id + '" style="--c-area:' + LM.coloreArea(a) + '">' +
          '<span class="nome">' + ICO(a.icona, 16) + ' ' + esc(a.nome) + '</span>' +
          '<span class="stelline">' + [1, 2, 3, 4, 5].map(function (v) {
            return '<button data-v="' + v + '"' + (votiOggi[a.id] === v ? ' class="sel"' : '') + '>' + v + '</button>';
          }).join('') + '</span></div>';
      }).join('') + '</div>' +
      '<label class="campo">Una cosa andata bene oggi, anche piccola</label>' +
      '<input type="text" id="sera-vittoria" value="' + (rev ? esc(rev.vittoria || '') : '') + '" placeholder="Es. ho studiato 90 minuti senza guardare il telefono">' +
      '<label class="campo">Un ostacolo che hai incontrato</label>' +
      '<input type="text" id="sera-blocco" value="' + (rev ? esc(rev.blocco || '') : '') + '" placeholder="Es. ho iniziato tardi, mi hanno distratto le notifiche">' +
      '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="btn-salva-sera">' + (rev ? 'Aggiorna' : 'Concludi la giornata') + ' <small>+' + LM.XP_EVENTI.reviewSera + ' XP</small></button></div>' +
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
      toast('Giornata conclusa. Domani si ricomincia.', xp, 'moon');
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
        'Questa review serve a capire, non a giudicarti. Sia ciò che ha funzionato sia ciò che non ha funzionato sono informazioni utili per la settimana che arriva.') +
      '<div class="eroe-statistiche" style="justify-content:center;margin-bottom:16px">' +
      '<div class="stat"><span class="stat-val">' + xpSett + '</span><span class="stat-eti">XP guadagnati</span></div>' +
      '<div class="stat"><span class="stat-val">' + azioniSett + '</span><span class="stat-eti">azioni completate</span></div>' +
      '<div class="stat"><span class="stat-val">' + attivi + '/7</span><span class="stat-eti">giorni attivi</span></div>' +
      '</div>' +
      '<label class="campo">Cosa ha funzionato questa settimana</label><textarea id="w-vittorie">' + (rev ? esc(rev.vittorie || '') : '') + '</textarea>' +
      '<label class="campo">Gli ostacoli che si sono ripetuti</label><textarea id="w-blocchi">' + (rev ? esc(rev.blocchi || '') : '') + '</textarea>' +
      '<label class="campo">Cosa hai imparato sul tuo metodo</label><textarea id="w-imparato">' + (rev ? esc(rev.imparato || '') : '') + '</textarea>' +
      '<label class="campo">L’unica cosa che vuoi cambiare la prossima settimana</label><textarea id="w-prossima">' + (rev ? esc(rev.prossima || '') : '') + '</textarea>' +
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
      toast('Review della settimana salvata.', xp, 'calendar');
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
    var html = topbar('Inbox', 'Annota qualsiasi pensiero in un secondo. Deciderai qui cosa farne, quando avrai tempo.',
      '<span class="chip">' + ICO('inbox', 14) + ' <b>' + s.inbox.length + '</b>&nbsp;da rivedere</span>') +
      '<div class="card"><div class="sotto" style="margin:0 0 14px">Per ogni pensiero decidi in fretta: <b>trasformalo in un’azione</b> di oggi, oppure <b>scartalo</b>. Quello che lasci qui non ti mette fretta.</div>' +
      '<div class="griglia" id="lista-inbox" style="gap:9px"></div></div>';
    $vista.innerHTML = html;

    var lista = document.getElementById('lista-inbox');
    if (!s.inbox.length) {
      lista.innerHTML = '<div class="vuoto">' + illoInbox() + '<b>L’inbox è vuota.</b><br>Premi <kbd>C</kbd> in qualsiasi momento per annotare un pensiero.</div>';
      return;
    }
    lista.innerHTML = s.inbox.map(function (el, i) {
      var quando = new Date(el.creata).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      return '<div class="riga-inbox" data-id="' + el.id + '" style="--i:' + i + '">' +
        '<div style="flex:1"><div class="testo">' + esc(el.testo) + '</div><div class="quando">' + quando + '</div>' +
        '<div class="azioni-riga mt-s">' +
        '<span style="width:155px;display:inline-block">' + selectAree('sel-' + el.id) + '</span>' +
        '<button class="btn btn-mini btn-primario" data-fai="azione">' + ICO('arrowRight', 13) + ' Fai oggi</button>' +
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
          toast(esito === 'azione' ? 'Aggiunto alle azioni di oggi.' : 'Scartato.', LM.XP_EVENTI.triage, esito === 'azione' ? 'arrowRight' : 'trash');
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
    var html = topbar('Esperimenti', 'Verifica cosa funziona davvero per te, usando i tuoi dati.',
      '<button class="btn btn-primario" id="btn-nuovo-exp">' + ICO('plus', 16) + ' Nuovo esperimento</button>') +
      '<div class="card"><div class="sotto" style="margin:0">Come funziona: prima misuri una metrica senza cambiare nulla (fase <b>A</b>, la base di partenza), poi introduci una modifica e continui a misurare (fase <b>B</b>). Il confronto tra le due fasi ti dice se la modifica ha avuto effetto. Un avvertimento onesto: senza gruppo di controllo il risultato è un’indicazione, non una prova definitiva; ripetere l’esperimento lo rende più affidabile.</div></div>' +
      '<div id="form-exp-zona"></div><div class="griglia mt" id="lista-exp" style="gap:16px"></div>';
    $vista.innerHTML = html;

    document.getElementById('btn-nuovo-exp').addEventListener('click', mostraFormExp);

    var lista = document.getElementById('lista-exp');
    if (!s.esperimenti.length) {
      lista.innerHTML = '<div class="card vuoto">' + illoFlask() + '<b>Non hai ancora nessun esperimento.</b><br>Qualche idea per iniziare: verificare se fare sport al mattino migliora il focus, se tenere il telefono in un’altra stanza aumenta i minuti di studio, o se andare a letto prima ti dà più energia.</div>';
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
        var forza = dEff === null ? '' : (Math.abs(dEff) < 0.2 ? 'trascurabile' : Math.abs(dEff) < 0.5 ? 'piccola' : Math.abs(dEff) < 0.8 ? 'media' : 'grande');
        verdetto = '<div class="exp-verdetto">' + ICO('trendUp', 16) +
          '<span>Nella fase iniziale la media era <b>' + LMCharts.fmtNum(ris.baseline.media) + '</b> (su ' + ris.baseline.n + ' giorni); dopo la modifica è <b>' + LMCharts.fmtNum(ris.intervento.media) + '</b> (su ' + ris.intervento.n + ' giorni), con una differenza di <b>' + (diff > 0 ? '+' : '') + LMCharts.fmtNum(diff) + '</b>' +
          (dEff !== null ? '. L’entità del cambiamento è <b>' + forza + '</b> (d≈' + LMCharts.fmtNum(dEff) + ')' : '') + '.' +
          '<br><small>È un indizio utile, non una prova definitiva: se il risultato ti interessa, ripeti l’esperimento per confermarlo.</small></span></div>';
      } else {
        verdetto = '<div class="exp-verdetto">' + ICO('clock', 16) + '<span>Non ci sono ancora abbastanza dati: servono almeno due giorni con una misura in ciascuna fase. Continua a fare i check-in.</span></div>';
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
        '<h2>Nuovo esperimento</h2><div class="sotto">I giorni già passati fanno da base di partenza; la modifica che vuoi testare inizia oggi.</div>' +
        '<label class="campo">Cosa vuoi scoprire</label><input type="text" id="exp-nome" placeholder="Es. studiare in biblioteca mi fa studiare di più?">' +
        '<label class="campo">La modifica che vuoi testare</label><input type="text" id="exp-int" placeholder="Es. ogni pomeriggio studio in biblioteca invece che in camera">' +
        '<div class="griglia griglia-3 mt-s"><div><label class="campo">Cosa misuri</label><select id="exp-metrica">' +
        LM.METRICHE_ESPERIMENTO.map(function (m2) { return '<option value="' + m2.id + '">' + esc(m2.nome) + '</option>'; }).join('') +
        '</select></div>' +
        '<div><label class="campo">Area (se serve)</label>' + selectAree('exp-area') + '</div>' +
        '<div><label class="campo">Durata</label><select id="exp-durata">' +
        '<option value="7-14">7 giorni di base, 14 di test</option>' +
        '<option value="14-14" selected>14 giorni di base, 14 di test</option>' +
        '<option value="14-21">14 giorni di base, 21 di test</option>' +
        '</select></div></div>' +
        '<div class="riga-flex mt"><button class="btn btn-primario" id="exp-crea">' + ICO('flask', 16) + ' Avvia</button>' +
        '<button class="btn btn-ghost" id="exp-annulla">Annulla</button></div></div>';
      document.getElementById('exp-annulla').addEventListener('click', function () { zona.innerHTML = ''; });
      document.getElementById('exp-crea').addEventListener('click', function () {
        var nome = document.getElementById('exp-nome').value.trim();
        if (!nome) { toast('Scrivi cosa vuoi scoprire con l’esperimento.', 0, 'flask'); return; }
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
        toast('Esperimento avviato.', 0, 'flask');
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
      claim: 'Nell’ADHD i pensieri arrivano di continuo e la memoria di lavoro ha una capacità limitata. Annotarli subito da qualche parte libera attenzione per il compito in corso e riduce l’ansia di doverli ricordare.',
      uso: 'Tasto C / ⌘K / bottone + ovunque: un solo campo, zero categorie al momento della cattura. Le decisioni sono rimandate al triage.',
      fonti: 'Knouse & Safren (2010), Clinical Psychology Review — la CBT per ADHD adulto prescrive sistemi esterni di cattura · Risko & Gilbert (2016), Trends in Cognitive Sciences — cognitive offloading.'
    },
    {
      titolo: 'Una sola prossima azione',
      evidenza: 'media',
      claim: 'Quando le risorse di autocontrollo sono limitate, ogni scelta in più ha un costo e aumenta la probabilità di distrarsi. Mostrare una sola opzione riduce il rischio di bloccarsi davanti a troppe possibilità.',
      uso: 'La vista Focus mostra una sola azione a schermo intero. Le altre restano in lista ma non sono visibili; con «Più tardi» le fai scorrere una alla volta, senza penalità.',
      fonti: 'Barkley (1997), Psychological Bulletin — ADHD come deficit di inibizione/funzioni esecutive · Iyengar & Lepper (2000), JPSP — il sovraccarico di scelta riduce l’azione.'
    },
    {
      titolo: 'Intenzioni «Se… allora…» (implementation intentions)',
      evidenza: 'alta',
      claim: 'Legare l’azione a un segnale concreto («se sono alla scrivania alle 9, allora…») quasi raddoppia la probabilità di eseguirla: l’avvio diventa automatico invece che affidato alla volontà.',
      uso: 'Il piano del mattino chiede una sola intenzione «se… allora…», collegata all’azione più importante, che poi ricompare nella vista Focus.',
      fonti: 'Gollwitzer & Sheeran (2006), Advances in Experimental Social Psychology — meta-analisi, 94 studi, effetto medio-grande (d≈0.65) · Gawrilow & Gollwitzer (2008) — efficacia specifica in ADHD.'
    },
    {
      titolo: 'Auto-monitoraggio con feedback visivo',
      evidenza: 'alta',
      claim: 'Monitorare il progresso verso un obiettivo aumenta di per sé la probabilità di raggiungerlo, e l’effetto cresce se il progresso è registrato e reso visibile.',
      uso: 'Il check-in da dieci secondi, la mappa della costanza e i mini-grafici per ogni area ti fanno rivedere tutto quello che registri.',
      fonti: 'Harkin et al. (2016), Psychological Bulletin — meta-analisi di 138 RCT: monitorare il progresso migliora il goal attainment · Korotitsch & Nelson-Gray (1999) — reattività dell’auto-monitoraggio.'
    },
    {
      titolo: 'Ricompense immediate (XP a ogni micro-azione)',
      evidenza: 'media',
      claim: 'Nell’ADHD le ricompense lontane nel tempo perdono valore più in fretta: una ricompensa immediata motiva molto più di una futura. Per questo l’app dà un riscontro subito, a ogni piccolo passo.',
      uso: 'XP immediati con un riscontro visivo per ogni azione: annotare un pensiero (+1), fare un check-in (+3), completare un’azione (+10), completare quella più importante (+15). I livelli e l’anello di progresso sono sempre visibili.',
      fonti: 'Jackson & MacKillop (2016), J. of Attention Disorders — meta-analisi: maggiore delay discounting in ADHD · Sonuga-Barke (2003) — delay aversion · Hamari et al. (2014); Sailer & Homner (2020), Educational Psychology Review — la gamification funziona, ma dipende dal design.'
    },
    {
      titolo: 'La serie non punisce mai',
      evidenza: 'media',
      claim: 'Perdere una serie lunga a causa di un solo giorno storto scoraggia molto, soprattutto chi fa già fatica a essere costante. Dopo un errore, criticarsi si associa a più procrastinazione; trattarsi con indulgenza si associa invece alla ripresa.',
      uso: 'Un giorno saltato da solo non azzera la serie: servono due giorni vuoti di fila. E al mattino il conteggio parte da ieri, finché non registri qualcosa oggi, così non ti scoraggia troppo presto.',
      fonti: 'Wohl, Pychyl & Bennett (2010), Personality and Individual Differences — perdonarsi riduce la procrastinazione futura · Breines & Chen (2012), Pers Soc Psychol Bull — self-compassion aumenta la motivazione al miglioramento.'
    },
    {
      titolo: 'Rituali con orario: struttura esterna',
      evidenza: 'alta',
      claim: 'I trattamenti non farmacologici per ADHD adulto che reggono ai trial hanno un tratto comune: routine esterne brevi e ripetute (pianificazione quotidiana, revisione, liste corte) che sostituiscono l’auto-regolazione con l’ambiente.',
      uso: 'La mattina in un minuto (al massimo tre azioni), la sera in due minuti (voto, cosa è andata bene, ostacolo) e la settimana in dieci minuti. Ogni volta gli stessi passaggi, nello stesso ordine.',
      fonti: 'Safren et al. (2005; 2010 JAMA) — RCT: CBT strutturata per adulti ADHD già in farmacoterapia · Solanto et al. (2010), Am J Psychiatry — RCT terapia meta-cognitiva centrata su pianificazione e gestione del tempo.'
    },
    {
      titolo: 'Massimo 3 azioni al giorno',
      evidenza: 'media',
      claim: 'Obiettivi pochi e specifici portano a risultati migliori di obiettivi tanti e vaghi. Una lista troppo lunga tende a generare senso di colpa invece che azione, perché costringe a rimandare la maggior parte delle cose.',
      uso: 'Il piano del mattino non accetta più di tre azioni. La prima è quella più importante: se completi solo quella, la giornata è comunque positiva.',
      fonti: 'Locke & Latham (2002), American Psychologist — 35 anni di goal-setting: specificità e difficoltà calibrata · Masicampo & Baumeister (2011), JPSP — pianificare libera la mente dai task aperti (effetto Zeigarnik).'
    },
    {
      titolo: 'Esperimenti N-of-1 su te stesso',
      evidenza: 'alta',
      claim: 'Le medie calcolate su tanti individui non dicono cosa funziona per te in particolare. Il confronto tra una fase iniziale e una fase con la modifica, sulla stessa persona e con misure ripetute, è un metodo riconosciuto per personalizzare gli interventi. È l’idea scientifica su cui si basa questa app.',
      uso: 'La vista Esperimenti confronta baseline e intervento su una metrica che già registri (focus, minuti, energia…), con medie, effect size e l’avvertenza onesta sui limiti.',
      fonti: 'Lillie et al. (2011), Personalized Medicine — the n-of-1 clinical trial · Vohra et al. (2015), BMJ — CENT: standard di reporting per trial N-of-1.'
    },
    {
      titolo: 'Novità e varietà controllata',
      evidenza: 'euristica',
      claim: 'Nell’ADHD l’interesse è la fonte di motivazione più affidabile: quando uno strumento annoia, viene abbandonato. Conviene quindi dare spazio al bisogno di novità dentro l’app, invece di ignorarlo.',
      uso: 'Tre modalità intercambiabili (Focus, Panoramica, Rituali) e due temi visivi (Aurora e Arcade) mostrano gli stessi dati in forme diverse. Puoi cambiare aspetto quando vuoi, senza perdere nulla.',
      fonti: 'Coerente con la self-determination theory (Deci & Ryan 2000: autonomia e scelta sostengono la motivazione intrinseca); la prescrizione specifica «varietà di interfaccia» è pratica clinica, non ancora letteratura sperimentale.'
    },
    {
      titolo: 'Ripartenze pulite (fresh start)',
      evidenza: 'media',
      claim: 'I confini temporali (lunedì, primo del mese, «da oggi») aumentano davvero i comportamenti aspirazionali: ogni giorno è trattato come un episodio nuovo, mai come il saldo di un debito.',
      uso: 'Il piano del mattino ricorda che ogni giorno inizia da capo. La review della sera chiude la giornata. Le azioni non completate non si accumulano: restano nel giorno in cui le avevi previste.',
      fonti: 'Dai, Milkman & Riis (2014), Management Science — the fresh start effect.'
    },
    {
      titolo: 'Meno frizione = più comportamento',
      evidenza: 'alta',
      claim: 'Piccole barriere cambiano i comportamenti più della motivazione: la formazione di abitudini dipende dalla ripetizione in contesto stabile a basso costo di innesco.',
      uso: 'Annoti un pensiero con un gesto, fai un check-in con tre tocchi, non ci sono campi obbligatori oltre l’essenziale e il timer registra i minuti da solo. Ogni operazione richiede secondi, non minuti.',
      fonti: 'Lally et al. (2010), European J. of Social Psychology — curva di formazione delle abitudini (mediana 66 giorni, conta la ripetizione) · Wood & Neal (2016), Behavioral Science & Policy — friction e contesto guidano l’abitudine.'
    }
  ];

  function vistaScienza() {
    var html = topbar('Perché l’app è fatta così', 'Ogni funzione nasce da una ricerca. Qui trovi quale, con le fonti.') +
      '<div class="card"><div class="sotto" style="margin:0">Le etichette dicono quanto è solida ogni prova: <span class="evidenza evidenza-alta">evidenza alta</span> significa meta-analisi o studi clinici controllati; <span class="evidenza evidenza-media">media</span> significa studi solidi ma non conclusivi; <span class="evidenza evidenza-euristica">euristica</span> significa pratica clinica ragionevole, non ancora dimostrata. In ogni caso la verifica finale spetta a te: la sezione Esperimenti serve proprio a controllare cosa funziona <b>nel tuo caso</b>.</div></div>' +
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
        step = '<div class="card"><h2>Come ti chiami</h2><div class="sotto">Puoi compilare ora oppure saltare: quasi tutto qui è facoltativo.</div>' +
          '<label class="campo">Nome</label><input type="text" id="ob-nome" value="' + esc(scelte.nome) + '" placeholder="Il tuo nome">' +
          '<label class="campo">In una frase, cosa vuoi ottenere migliorando</label>' +
          '<textarea id="ob-visione" placeholder="Es. imparare più in fretta, restare in salute e costruire progetti che contano">' + esc(scelte.visione) + '</textarea>' +
          '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="ob-avanti">Avanti ' + ICO('arrowRight', 16) + '</button>' +
          '<button class="btn btn-ghost" id="ob-demo">Salta e vai alla demo</button></div></div>';
      } else if (passo === 1) {
        step = '<div class="card"><h2>Le aree della tua vita</h2><div class="sotto">Sono tutte attive: disattiva quelle che non ti servono, potrai riattivarle quando vuoi.</div>' +
          '<div class="selettore-aree">' + LM.AREE_DEFAULT.map(function (a) {
            var sel = scelte.aree.indexOf(a.id) >= 0;
            return '<button data-area="' + a.id + '" class="' + (sel ? 'sel' : '') + '" style="--c-area:' + LM.SLOT_COLORI[a.slot][0] + '">' +
              ICO(a.icona, 17) + esc(a.nome) + '<span class="segno">' + ICO('check', 15) + '</span></button>';
          }).join('') + '</div>' +
          '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="ob-avanti">Avanti ' + ICO('arrowRight', 16) + '</button>' +
          '<button class="btn btn-ghost" id="ob-indietro">Indietro</button></div></div>';
      } else {
        step = '<div class="card"><h2>Da dove vuoi partire?</h2><div class="sotto">Sono tre modi di usare la stessa app, sugli stessi dati. Scegline uno per iniziare: potrai cambiare quando vuoi.</div>' +
          '<div class="selettore-modi">' +
          modo('oggi', 'target', 'Oggi', 'Una sola azione alla volta, per quando hai già tante cose in mente.') +
          modo('plancia', 'dashboard', 'Panoramica', 'Una schermata da tenere aperta, con numeri e grafici sempre a portata.') +
          modo('rituali', 'sun', 'Rituali', 'Brevi routine al mattino e alla sera che ti danno una struttura fissa.') +
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
        '<p>Uno spazio unico per organizzare, misurare e migliorare le diverse aree della tua vita. È pensato per chi fatica a mantenere costanza e concentrazione: poca fatica per usarlo, riscontro immediato.</p>' +
        '<div class="ob-punti">' +
        '<div class="ob-punto">' + ICO('bolt', 16) + '<span><b>Annota subito.</b> Un tasto per salvare qualsiasi pensiero; deciderai dopo cosa farne.</span></div>' +
        '<div class="ob-punto">' + ICO('target', 16) + '<span><b>Una cosa alla volta.</b> Ti proponiamo la prossima azione, così eviti la paralisi da troppe scelte.</span></div>' +
        '<div class="ob-punto">' + ICO('flask', 16) + '<span><b>Scienza applicata a te.</b> Esperimenti sui tuoi dati per capire cosa funziona davvero, non sulle medie di altri.</span></div>' +
        '</div>' +
        '<div id="ob-account" class="ob-account"></div>' +
        illoOrbita() + '</aside>' +
        '<section class="ob-step"><div class="passi-punti">' +
        [0, 1, 2].map(function (i) { return '<span class="' + (i === passo ? 'attivo' : '') + '"></span>'; }).join('') +
        '</div>' + step + '</section>' +
        '</div></div>';

      function modo(id, icona, nome, desc) {
        return '<button data-modo="' + id + '" class="' + (scelte.modo === id ? 'sel' : '') + '">' +
          '<span class="icona-modo">' + ICO(icona, 20) + '</span>' +
          '<span><span class="titolo-modo">' + nome + '</span><div class="desc-modo">' + desc + '</div></span></button>';
      }

      refreshObAccount();

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
      toast(conDemo ? 'Tutto pronto. Esplora pure: i dati sono reali e puoi modificarli.' : 'Tutto pronto. Ti consiglio di iniziare dal piano del mattino.', 0, 'sparkles');
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
    chiudiSheet();
    render();
  });

  function staDigitando() {
    return /input|textarea|select/i.test(document.activeElement && document.activeElement.tagName || '');
  }

  /* login/logout: aggiorna l'interfaccia. Durante l'onboarding evita di
     ricostruire i campi (perderebbe ciò che l'utente sta scrivendo): se
     è arrivato un utente carica i suoi dati, altrimenti aggiorna solo il
     pulsante di accesso dell'onboarding. */
  window.addEventListener('lm:auth', function () {
    var inOnboarding = !!document.getElementById('onboarding-root').innerHTML;
    var a = window.LM_AUTH || {};
    if (inOnboarding && !a.user) { refreshObAccount(); return; }
    if (staDigitando() && !a.user) return;
    render();
  });

  /* aggiornamento arrivato da un altro dispositivo */
  window.addEventListener('lm:remote', function () {
    if (staDigitando()) return;
    render();
    toast('Dati aggiornati da un altro dispositivo.', 0, 'cloudCheck');
  });

  /* Esc chiude il pannello se aperto */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !$sheet.hidden) chiudiSheet();
  });

  /* chrome statico */
  document.getElementById('logo-blocco').innerHTML = LOGO(30) + ' LifeMax <span class="logo-tag">Beta</span>';

  applicaTema();
  render();
})();
