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
    LM.registra('impostazioni', 'Tema impostato su ' + (m === 'auto' ? 'automatico' : m === 'dark' ? 'scuro' : 'chiaro'), false);
    LM.save(); applicaTema(); render();
  }
  function setSkin(sk) {
    var s = LM.load();
    s.profilo.skin = sk;
    LM.registra('impostazioni', 'Aspetto impostato su ' + (sk === 'arcade' ? 'Arcade' : 'Aurora'), false);
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

  /* feedback per una spunta: XP che volano + toast quando si completa;
     avviso «spunta tolta» (con gli XP restituiti) quando si annulla per errore */
  function feedbackSpunta(ev, xp, doneMsg, icona) {
    if (xp > 0) {
      var r = ev.currentTarget.getBoundingClientRect();
      flyXp(r.left + r.width / 2, r.top, xp);
      toast(doneMsg, xp, icona);
    } else if (xp < 0) {
      toast('Spunta tolta (' + xp + ' XP)', 0, 'refresh');
    }
  }

  /* ---------- cattura istantanea ---------- */

  var $ovl = document.getElementById('overlay-cattura');
  var $inp = document.getElementById('input-cattura');
  document.getElementById('corpo-cattura').insertAdjacentHTML('afterbegin', ICO('bolt', 20));

  function apriCattura() {
    $ovl.hidden = false;
    bloccaSfondo(true);
    $inp.value = '';
    setTimeout(function () { $inp.focus(); }, 30);
  }
  function chiudiCattura() { $ovl.hidden = true; bloccaSfondo(false); }

  document.getElementById('fab-cattura').innerHTML = ICO('plus', 25);
  document.getElementById('fab-cattura').addEventListener('click', apriCattura);
  var $sideCatt = document.getElementById('side-cattura');
  $sideCatt.querySelector('.cattura-cta-testo').innerHTML = ICO('bolt', 16) + ' Cattura un pensiero';
  $sideCatt.addEventListener('click', apriCattura);
  $ovl.addEventListener('click', function (e) { if (e.target === $ovl) chiudiCattura(); });
  $inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && $inp.value.trim()) {
      var xp = LM.cattura($inp.value.trim());
      toast('Salvato. Torna pure a quello che stavi facendo.', xp, 'inbox');
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
  var $sheetPanel = $sheet.querySelector('.sheet');
  /* Anima l'ingresso UNA volta e poi toglie la classe: se restasse attaccata,
     ogni elemento ricreato dopo (una spunta, un filtro) ripartirebbe con la
     stessa animazione e sembrerebbe un refresh continuo. */
  function animaIngresso(el) {
    if (!el) return;
    el.classList.remove('vista-enter');
    void el.offsetWidth;
    el.classList.add('vista-enter');
    if (el.__timerAnim) clearTimeout(el.__timerAnim);
    el.__timerAnim = setTimeout(function () { el.classList.remove('vista-enter'); }, 900);
  }

  function apriSheet(titolo, html, onWire, largo) {
    document.getElementById('sheet-titolo').textContent = titolo;
    document.getElementById('sheet-corpo').innerHTML = html;
    if ($sheetPanel) $sheetPanel.classList.toggle('sheet-largo', !!largo);
    $sheet.hidden = false;
    bloccaSfondo(true);
    wireSheet = onWire || null;
    if (wireSheet) wireSheet(document.getElementById('sheet-corpo'));
  }
  function chiudiSheet() {
    $sheet.hidden = true; wireSheet = null;
    if ($sheetPanel) $sheetPanel.classList.remove('sheet-largo');
    bloccaSfondo(false);
  }

  /* Con un pannello aperto la pagina sotto deve stare FERMA: prima si poteva
     scorrere (e cliccare) il contenuto dietro, con lo sfocato che restava sul
     posto e mostrava un taglio netto. Congeliamo lo scorrimento mantenendo la
     posizione, e lo restituiamo alla chiusura. */
  var scrollCongelato = 0;
  function bloccaSfondo(attiva) {
    var altro = document.querySelector('.overlay:not([hidden])');
    if (attiva) {
      if (document.body.classList.contains('sfondo-fermo')) return;
      scrollCongelato = window.scrollY || document.documentElement.scrollTop || 0;
      document.body.style.top = (-scrollCongelato) + 'px';
      document.body.classList.add('sfondo-fermo');
    } else {
      if (!document.body.classList.contains('sfondo-fermo')) return;
      if (altro) return; // c'è ancora un altro pannello aperto
      document.body.classList.remove('sfondo-fermo');
      document.body.style.top = '';
      window.scrollTo(0, scrollCongelato);
    }
  }

  /* ---------- navigazione ---------- */
  /* gruppo: 'primaria' = destinazioni quotidiane (sidebar + tab bar mobile);
     'secondaria' = approfondimenti (sidebar, e nel menu "Altro" su mobile). */

  var VISTE = [
    { id: 'oggi',        nome: 'Oggi',        icona: 'target',    gruppo: 'primaria' },
    { id: 'giornata',    nome: 'Giornata',    icona: 'clock',     gruppo: 'primaria' },
    { id: 'plancia',     nome: 'Panoramica',  icona: 'dashboard', gruppo: 'primaria' },
    { id: 'rituali',     nome: 'Rituali',     icona: 'sun',       gruppo: 'primaria' },
    { id: 'inbox',       nome: 'Attività',    icona: 'lista',     gruppo: 'primaria' },
    { id: 'esperimenti', nome: 'Esperimenti', icona: 'flask',     gruppo: 'secondaria' },
    { id: 'scienza',     nome: 'Perché funziona', icona: 'atom',  gruppo: 'secondaria' }
  ];
  /* le 4 destinazioni quotidiane nella tab bar mobile; le altre primarie
     (es. Giornata) e le secondarie stanno nel menu "Altro" */
  var TAB_MOBILE = ['oggi', 'plancia', 'rituali', 'inbox'];
  function vistaById(id) { return VISTE.find(function (v) { return v.id === id; }); }
  function primarie() { return VISTE.filter(function (v) { return v.gruppo === 'primaria'; }); }

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
      primarie().map(voce).join('') +
      '<div class="nav-sep"></div>' +
      VISTE.filter(function (v) { return v.gruppo === 'secondaria'; }).map(voce).join('');

    /* footer sidebar: account + impostazioni */
    document.getElementById('sidebar-fondo').innerHTML = footerSidebar();
    wireFooterSidebar();

    /* tab bar mobile: 4 destinazioni quotidiane + "Altro" (Giornata e le
       secondarie stanno in "Altro"; in Oggi c'è comunque la barra compatta) */
    var tab = document.getElementById('nav-tab');
    var primNav = TAB_MOBILE.map(vistaById);
    var inSecondaria = !primNav.some(function (v) { return v.id === corrente; });
    tab.innerHTML = primNav.map(function (v) {
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

  function statoSync() {
    var y = window.LM_SYNC || { state: 'idle' };
    if (y.state === 'saving') return { ico: 'cloud', cls: '', testo: 'Sincronizzazione…' };
    if (y.state === 'error') return { ico: 'cloud', cls: 'sync-errore', testo: 'Sync non riuscita', title: y.error };
    if (y.state === 'saved') return { ico: 'cloudCheck', cls: 'sync-ok', testo: 'Salvato nel cloud' };
    return { ico: 'cloudCheck', cls: 'sync-ok', testo: 'Sincronizzato' };
  }

  function footerSidebar() {
    var a = window.LM_AUTH || { available: false, user: null };
    var acct;
    if (a.user) {
      var iniz = (a.user.name || a.user.email || '?').trim().charAt(0).toUpperCase();
      var avatar = a.user.photo
        ? '<img class="avatar" src="' + esc(a.user.photo) + '" alt="" referrerpolicy="no-referrer">'
        : '<span class="avatar avatar-ph">' + esc(iniz) + '</span>';
      var y = statoSync();
      acct = '<div class="fondo-account">' + avatar +
        '<div class="fondo-account-testo"><b>' + esc(a.user.name || 'Il tuo account') + '</b>' +
        '<small class="' + y.cls + '"' + (y.title ? ' title="' + esc(y.title) + '"' : '') + '>' + ICO(y.ico, 12) + ' ' + y.testo + '</small></div></div>';
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
    return '<div class="imp-sezione"><div class="imp-eti">Personalizza</div>' +
      '<div class="imp-azioni">' +
      '<button class="btn btn-mini" id="imp-aree">' + ICO('sparkles', 14) + ' Gestisci le aree</button> ' +
      '<button class="btn btn-mini" id="imp-guida">' + ICO('aiuto', 14) + ' Come si usa</button></div></div>' +
      '<div class="imp-sezione"><div class="imp-eti">La giornata</div>' +
      '<div class="imp-azioni"><button class="btn btn-mini" id="imp-ritmo">' + ICO('clock', 14) + ' Sonno e pasti</button></div>' +
      '<div class="imp-nota">La barra della giornata è sempre in cima a <b>Oggi</b>; la pagina <b>Giornata</b> mostra anche settimana, mese e anno.</div></div>' +
      '<div class="imp-sezione"><div class="imp-eti">Tema</div>' +
      '<div class="segmenti imp-seg" id="seg-modo">' + segM('auto', 'refresh', 'Auto') + segM('light', 'sun', 'Chiaro') + segM('dark', 'moon', 'Scuro') + '</div></div>' +
      '<div class="imp-sezione"><div class="imp-eti">Aspetto</div>' +
      '<div class="segmenti imp-seg" id="seg-skin">' + segS('quiete', 'Aurora') + segS('arcade', 'Arcade') + '</div>' +
      '<div class="imp-nota">Aurora è più sobrio, Arcade più acceso. Cambia solo l’aspetto, non i dati.</div></div>';
  }

  function htmlDati() {
    var nBackup = LM.listBackups().length;
    return '<div class="imp-sezione"><div class="imp-eti">I tuoi dati</div>' +
      '<div class="imp-azioni">' +
      '<button class="btn btn-mini" id="imp-esporta">' + ICO('download', 14) + ' Esporta (.json)</button> ' +
      '<button class="btn btn-mini" id="imp-importa">' + ICO('upload', 14) + ' Importa da file</button> ' +
      '<button class="btn btn-mini" id="imp-backup">' + ICO('save', 14) + ' Backup e ripristino' + (nBackup ? ' (' + nBackup + ')' : '') + '</button>' +
      '<input type="file" id="imp-file" accept="application/json,.json" hidden></div>' +
      '<div class="imp-nota">Esporta un file con tutti i tuoi dati per conservarlo o spostarlo. Ogni operazione che sostituisce i dati crea prima un backup ripristinabile.</div>' +
      '</div>' +
      '<div class="imp-sezione"><div class="imp-eti">Ripartenza</div>' +
      '<div class="imp-azioni">' +
      '<button class="btn btn-mini" id="imp-demo">' + ICO('refresh', 14) + ' Carica dati di esempio</button> ' +
      '<button class="btn btn-mini imp-pericolo" id="imp-azzera">' + ICO('trash', 14) + ' Azzera tutto</button></div>' +
      '<div class="imp-nota">L’azzeramento crea comunque un backup: potrai recuperare i dati da «Backup e ripristino».</div></div>';
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
    var e = root.querySelector('#imp-esporta'); if (e) e.addEventListener('click', esportaDati);
    var b2 = root.querySelector('#imp-backup'); if (b2) b2.addEventListener('click', apriBackups);
    var ar = root.querySelector('#imp-aree'); if (ar) ar.addEventListener('click', apriAree);
    var gu = root.querySelector('#imp-guida'); if (gu) gu.addEventListener('click', apriGuida);
    var ri = root.querySelector('#imp-ritmo'); if (ri) ri.addEventListener('click', apriRitmo);
    var imp = root.querySelector('#imp-importa'); var file = root.querySelector('#imp-file');
    if (imp && file) {
      imp.addEventListener('click', function () { file.click(); });
      file.addEventListener('change', function () {
        var f = file.files && file.files[0]; if (!f) return;
        var reader = new FileReader();
        reader.onload = function () {
          var r = LM.importJson(String(reader.result));
          if (r.ok) { chiudiSheet(); applicaTema(); render(); toast('Dati importati (' + r.ricchezza + ' elementi).', 0, 'upload'); }
          else { toast(r.err, 0, 'trash'); }
        };
        reader.readAsText(f);
      });
    }
  }

  function esportaDati() {
    try {
      var blob = new Blob([LM.exportJson()], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'lifemax-' + LM.todayKey() + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      LM.registra('dati', 'Dati esportati in un file .json', true); LM.save();
      toast('Dati esportati nel file .json.', 0, 'download');
    } catch (e) { toast('Esportazione non riuscita.', 0, 'trash'); }
  }

  function apriBackups() {
    var lista = LM.listBackups();
    var motivi = {
      'prima-azzeramento': 'prima di azzerare',
      'prima-import': 'prima di un import',
      'prima-del-ripristino': 'prima di un ripristino',
      'prima-di-adottare-cloud': 'prima di caricare dal cloud',
      'questo-dispositivo-prima-di-adottare-cloud': 'prima di caricare dal cloud',
      'prima-di-aggiornamento-da-altro-dispositivo': 'prima di un aggiornamento da un altro dispositivo'
    };
    var corpo;
    if (!lista.length) {
      corpo = '<div class="imp-nota" style="margin:0">Non ci sono ancora backup. Vengono creati automaticamente ogni volta che i dati stanno per essere sostituiti.</div>';
    } else {
      corpo = '<div class="backup-lista">' + lista.map(function (b) {
        var data = new Date(b.ts).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
        return '<div class="backup-riga"><div><b>' + data + '</b><small>' + b.ricchezza + ' elementi' + (motivi[b.motivo] ? ' · ' + motivi[b.motivo] : '') + '</small></div>' +
          '<button class="btn btn-mini" data-ts="' + b.ts + '">Ripristina</button></div>';
      }).join('') + '</div>';
    }
    apriSheet('Backup e ripristino', '<div class="imp-nota" style="margin-top:0">Ogni voce è una copia salvata prima di una sostituzione dei dati. Ripristinandone una, lo stato attuale viene comunque salvato come nuovo backup.</div>' + corpo, function (r) {
      r.querySelectorAll('[data-ts]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var ts = +btn.getAttribute('data-ts');
          if (confirm('Ripristinare questo backup? Lo stato attuale verrà salvato come backup.')) {
            LM.restoreBackup(ts); chiudiSheet(); applicaTema(); render();
            toast('Backup ripristinato.', 0, 'save');
          }
        });
      });
    });
  }

  /* ---------- gestione aree (personalizzabili) ---------- */

  var ICONE_AREA = ['book', 'heart', 'users', 'wallet', 'landmark', 'rocket', 'briefcase', 'sparkles', 'target', 'bolt', 'flask', 'star', 'flame', 'lightbulb', 'calendar', 'clock'];

  function apriAree() {
    var s = LM.load();
    var righe = s.aree.map(function (a) {
      var attiva = s.areeAttive.indexOf(a.id) >= 0;
      return '<div class="area-riga' + (attiva ? '' : ' spenta') + '" style="--c-area:' + LM.coloreArea(a) + '">' +
        '<span class="icona-area">' + ICO(a.icona, 15) + '</span>' +
        '<input type="text" class="area-nome-input" data-rin="' + a.id + '" value="' + esc(a.nome) + '" aria-label="Nome dell’area">' +
        '<button class="icona-btn' + (attiva ? ' on' : '') + '" data-toggle-area="' + a.id + '" title="' + (attiva ? 'Attiva (tocca per disattivare)' : 'Disattivata (tocca per attivare)') + '">' + ICO(attiva ? 'check' : 'x', 14) + '</button>' +
        '<button class="icona-btn" data-del-area="' + a.id + '" title="Rimuovi">' + ICO('trash', 14) + '</button>' +
        '</div>';
    }).join('');
    var picker = ICONE_AREA.map(function (ic, i) { return '<button class="ico-pick' + (i === 0 ? ' sel' : '') + '" data-ico="' + ic + '" aria-label="' + ic + '">' + ICO(ic, 16) + '</button>'; }).join('');
    apriSheet('Le tue aree',
      '<div class="imp-nota" style="margin-top:0">Rinomina, disattiva o rimuovi le aree, oppure creane di tue (es. i tuoi progetti). Rimuovendo un’area, le sue attività passano ad «Altro»: nulla va perso.</div>' +
      '<div class="aree-lista">' + righe + '</div>' +
      '<div class="imp-sezione"><div class="imp-eti">Nuova area</div>' +
      '<div class="ico-picker" id="ico-picker">' + picker + '</div>' +
      '<form class="riga-flex mt-s" id="area-nuova"><input type="text" id="area-nuova-nome" placeholder="Nome della nuova area…" style="flex:1;min-width:150px"><button class="btn btn-mini btn-primario" type="submit">' + ICO('plus', 13) + ' Aggiungi</button></form></div>',
      function (r) {
        var icoSel = ICONE_AREA[0];
        r.querySelectorAll('[data-rin]').forEach(function (inp) {
          inp.addEventListener('change', function () { LM.rinominaArea(inp.getAttribute('data-rin'), inp.value); render(); toast('Area rinominata.', 0, 'check'); });
        });
        r.querySelectorAll('[data-toggle-area]').forEach(function (b) {
          b.addEventListener('click', function () { var id = b.getAttribute('data-toggle-area'); var attiva = LM.load().areeAttive.indexOf(id) >= 0; LM.toggleArea(id, !attiva); render(); apriAree(); });
        });
        r.querySelectorAll('[data-del-area]').forEach(function (b) {
          b.addEventListener('click', function () { if (confirm('Rimuovere questa area? Le sue attività passano ad «Altro».')) { LM.rimuoviArea(b.getAttribute('data-del-area')); render(); apriAree(); } });
        });
        r.querySelectorAll('.ico-pick').forEach(function (b) {
          b.addEventListener('click', function () { r.querySelectorAll('.ico-pick').forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); icoSel = b.getAttribute('data-ico'); });
        });
        r.querySelector('#area-nuova').addEventListener('submit', function (e) {
          e.preventDefault();
          var nome = r.querySelector('#area-nuova-nome').value.trim();
          if (!nome) return;
          LM.aggiungiArea(nome, icoSel); render(); apriAree(); toast('Area creata.', 0, 'sparkles');
        });
      });
  }

  /* ---------- guida in-app ---------- */

  function apriGuida() {
    function voce(ico, tit, testo) {
      return '<div class="guida-voce"><span class="guida-ico">' + ICO(ico, 16) + '</span><div><b>' + tit + '</b><p>' + testo + '</p></div></div>';
    }
    apriSheet('Come si usa LifeMax',
      '<div class="imp-nota" style="margin-top:0">Tutto gira intorno a tre parole: <b>butta giù</b> un pensiero, <b>decidi</b> cosa farne, <b>fai</b> una cosa alla volta. Bastano pochi minuti al giorno.</div>' +
      '<div class="guida">' +
      voce('bolt', '1 · Butta giù tutto', 'Ti viene in mente qualcosa? Premi <kbd>C</kbd> (o il tasto ＋) e scrivilo al volo. Non devi decidere niente adesso: finisce in <b>Attività</b>, alla voce «Da sistemare».') +
      voce('lista', '2 · Decidi cosa farne', 'In <b>Attività</b>, per ogni nota scegli <b>Oggi</b> (la fai oggi), <b>Da fare</b> (più avanti, senza data) o <b>Scarta</b>. Le cose «Da fare» restano lì, divise per area, finché non le porti in Oggi.') +
      voce('target', '3 · Fai, una alla volta', 'La schermata <b>Oggi</b> ti mette davanti una cosa sola: fai quella, poi arriva la prossima. Al mattino scegli le tue tre cose in <b>Rituali</b>; la sera chiudi con la review. Ogni giorno riparte pulito.') +
      voce('clock', 'La giornata', 'La timeline «La giornata» mostra come sono divise le tue ore: sonno, pasti, abitudini e cose di oggi con un orario. Puoi scegliere dove vederla dal menù a tendina sulla timeline.') +
      voce('smile', 'Check-in in 10 secondi', 'Energia, concentrazione, umore. Rispondi a istinto partendo dal «tuo solito». Serve a vedere l’andamento nei giorni, più che il numero di oggi.') +
      voce('flask', 'Esperimenti su di te', 'Provi un cambiamento (es. sport al mattino) e l’app confronta il prima e il dopo sui tuoi numeri. Così scopri cosa funziona <b>per te</b>.') +
      voce('trendUp', 'Panoramica e Diario', 'In <b>Panoramica</b> vedi progressi, costanza e andamento; nel <b>Diario</b> lo storico giorno per giorno.') +
      voce('save', 'I tuoi dati sono al sicuro', 'Backup automatici, esporta e importa in .json, e sincronizzazione sul tuo account Google tra dispositivi.') +
      '</div>', null);
  }

  function apriImpostazioni() {
    apriSheet('Impostazioni', htmlAspetto() + htmlDati(), wireAspettoDati);
  }

  function apriMenuAltro() {
    var s = LM.load();
    var extra = primarie().filter(function (v) { return TAB_MOBILE.indexOf(v.id) < 0; }); /* es. Giornata */
    var link = extra.concat(VISTE.filter(function (v) { return v.gruppo === 'secondaria'; })).map(function (v) {
      return '<button class="menu-voce" data-vai="' + v.id + '">' + ICO(v.icona, 18) + '<span>' + v.nome + '</span>' + ICO('arrowRight', 15) + '</button>';
    }).join('');
    var a = window.LM_AUTH || { available: false, user: null };
    var acct;
    if (a.user) {
      var y = statoSync();
      acct = '<div class="menu-account">' + ICO('cloudCheck', 15) + ' Connesso come <b>' + esc(a.user.name || a.user.email) + '</b>' +
        '<button class="btn btn-mini btn-ghost" id="menu-esci">' + ICO('logout', 14) + ' Esci</button></div>' +
        '<div class="imp-nota ' + y.cls + '"' + (y.title ? ' title="' + esc(y.title) + '"' : '') + '>' + ICO(y.ico, 13) + ' ' + y.testo + '</div>';
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

  function selectAree(id, selezionata, etichetta) {
    return '<select id="' + id + '" aria-label="' + esc(etichetta || 'Area') + '">' + areeAttive().map(function (a) {
      return '<option value="' + a.id + '"' + (a.id === selezionata ? ' selected' : '') + '>' + esc(a.nome) + '</option>';
    }).join('') + '</select>';
  }

  /* selettore compatto per (ri)assegnare l'area di un'azione, anche a
     distanza di tempo. Gestito da un listener delegato unico. */
  function selectAreaAzione(id, areaId, cls) {
    return '<select class="sel-area-azione ' + (cls || '') + '" data-azione-area="' + id + '" title="Cambia area" aria-label="Cambia area">' +
      areeAttive().map(function (a) {
        return '<option value="' + a.id + '"' + (a.id === areaId ? ' selected' : '') + '>' + esc(a.nome) + '</option>';
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
    /* l'altezza della banda finisce in una variabile CSS: serve a far stare la
       pagina "Oggi" esattamente in una schermata, senza scorrimento inutile */
    function misura() {
      document.documentElement.style.setProperty('--banda-h', (banda.offsetHeight || 0) + 'px');
    }
    if (!s.demo || s.demoChiusa) { banda.innerHTML = ''; misura(); return; }
    banda.innerHTML = '<div class="banda-demo"><span>' + ICO('sparkles', 13) +
      ' Stai esplorando <b>dati di esempio</b>: modifica pure, tutto resta salvato.</span>' +
      '<button class="banda-x" id="banda-x" aria-label="Nascondi">' + ICO('x', 14) + '</button></div>';
    misura();
    document.getElementById('banda-x').addEventListener('click', function () {
      LM.load().demoChiusa = true; LM.save(); banda.innerHTML = ''; misura();
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

  /* "fuocoScelto": quando l'utente decide di fare un'altra cosa invece di
     quella suggerita dal piano, la fissa lui e resta finché non la finisce o
     torna al piano. "mostraAltre": la lista delle altre cose di oggi, a vista. */
  var fuocoScelto = null;
  var mostraAltre = false;
  var ultimoFuocoKey = '';

  function vistaFocus() {
    var adesso;
    if (fuocoScelto) {
      var pin = LM.azioniDiOggi().find(function (a) { return a.id === fuocoScelto && !a.done; });
      if (pin) adesso = { azione: pin, stato: 'scelta', min: pin.ora ? minOf(pin.ora) : null, fine: null };
      else { fuocoScelto = null; adesso = LM.azioneAdesso(); }
    } else {
      adesso = LM.azioneAdesso();
    }
    var prossima = adesso.azione;
    ultimoFuocoKey = fuocoScelto ? 'pin:' + fuocoScelto : (prossima ? prossima.id : '') + '|' + adesso.stato;
    var oggi = LM.azioniDiOggi();
    var fatte = oggi.filter(function (a) { return a.done; }).length;
    var inCoda = oggi.filter(function (a) { return !a.done; }).length - (prossima ? 1 : 0);
    var html = topbar('Oggi', 'Una cosa alla volta. Finisci questa, poi arriva la prossima.',
      '<span class="chip">' + ICO('check', 14) + ' <b>&nbsp;' + fatte + '/' + oggi.length + '</b>&nbsp;oggi</span>');
    html += '<div id="oggi-giornata"></div>';

    if (!prossima) {
      html += '<div class="focus-scena"><div class="vuoto">' + illoSole() +
        (oggi.length ? '<b>Per oggi hai finito tutto.</b><br>Puoi chiudere con la review della sera, o aggiungere qualcosa se ti va.'
                     : '<b>Oggi non hai ancora scelto cosa fare.</b><br>Bastano pochi secondi: scegli la prima cosa e parti.') +
        '</div>' +
        '<div class="focus-azioni-riga">' +
        '<button class="btn btn-primario btn-grande" data-vai="rituali">' + ICO('sun', 18) + ' Scegli le azioni di oggi</button>' +
        '<button class="btn" data-vai="inbox">' + ICO('inbox', 17) + ' Prendi dalle attività</button>' +
        (oggi.length ? '<button class="btn" data-vai="rituali" data-sub="sera">' + ICO('moon', 17) + ' Review della sera</button>' : '') +
        '</div>' +
        '<form id="form-rapida" class="riga-flex" style="max-width:580px;width:100%">' +
        '<input type="text" id="testo-rapida" placeholder="Oppure scrivi qui una cosa da fare" style="flex:1;min-width:220px">' +
        '<button class="btn btn-primario" type="submit" aria-label="Aggiungi e parti">' + ICO('arrowRight', 17) + '</button></form>' +
        '</div>';
      $vista.innerHTML = html;
      montaOggiGiornata();
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
        LM.aggiungiAzione(t, 'altro', { mit: LM.serveMit() });
        render();
      });
      return;
    }

    var area = areaById(prossima.areaId);
    var colArea = LM.coloreArea(area);
    var timerAttivo = timer.azioneId === prossima.id && timer.fine;
    var xpPrevisti = prossima.mit ? LM.XP_EVENTI.mit : LM.XP_EVENTI.azione;

    /* l'occhiello dice PERCHÉ è questa la cosa adesso, legando Oggi al piano
       de La Giornata: in corso / in ritardo / in programma / (libera → MIT). */
    var eyebrow, eyebrowCls = '';
    if (adesso.stato === 'scelta') { eyebrow = ICO('target', 15) + ' Scelta da te' + (adesso.min != null ? ' · in programma alle ' + fmtMin(adesso.min) : '') + ' <button class="focus-torna" id="btn-torna-piano">torna al piano</button>'; eyebrowCls = ' ora'; }
    else if (adesso.stato === 'corso') { eyebrow = ICO('clock', 15) + ' Adesso nel piano · ' + fmtMin(adesso.min) + '–' + fmtMin(adesso.fine); eyebrowCls = ' ora'; }
    else if (adesso.stato === 'ritardo') { eyebrow = ICO('clock', 15) + ' Era in programma alle ' + fmtMin(adesso.min) + ' — riprendila'; eyebrowCls = ' ritardo'; }
    else if (adesso.stato === 'programmata') { eyebrow = ICO('clock', 15) + ' In programma alle ' + fmtMin(adesso.min); eyebrowCls = ' ora'; }
    else if (prossima.mit) { eyebrow = ICO('star', 15) + ' L’azione più importante di oggi'; eyebrowCls = ' mit'; }
    else { eyebrow = ICO('target', 15) + ' La tua prossima azione'; }

    /* Le ALTRE cose di oggi, a portata di mano: se devi fare qualcos'altro la
       vedi e la scegli, senza sentirti obbligato da quella suggerita. */
    var altre = oggi.filter(function (a) { return !a.done && (!prossima || a.id !== prossima.id); });
    var altreHtml = '';
    if (altre.length) {
      altreHtml = '<div class="focus-altre">' +
        '<button class="focus-altre-toggle" id="btn-altre" aria-expanded="' + mostraAltre + '">' +
        (mostraAltre ? 'Nascondi le altre' : 'Devi fare altro? Scegli tra le altre') + ' <b>' + altre.length + '</b>' +
        '<span class="bk-chevron' + (mostraAltre ? ' aperta' : '') + '">' + ICO('chevronGiu', 15) + '</span></button>' +
        (mostraAltre ? '<div class="focus-altre-lista">' + altre.map(function (a) {
          var ar = areaById(a.areaId), col = LM.coloreArea(ar);
          return '<div class="fa-riga" style="--c-area:' + col + '">' +
            '<button class="tl-check" data-fa-fatto="' + a.id + '" aria-label="Fatto">' + ICO('check', 12) + '</button>' +
            '<button class="fa-corpo" data-fa-fuoco="' + a.id + '">' +
            '<span class="tl-tag" style="color:' + col + '">' + ICO(ar.icona, 13) + '</span>' +
            '<span class="fa-testo">' + esc(a.testo) + (a.mit ? ' ' + ICO('star', 9) : '') + '</span>' +
            (a.ora ? '<span class="fa-ora">' + ICO('clock', 10) + ' ' + a.ora + '</span>' : '') +
            '<span class="fa-fai">Fai questa ' + ICO('arrowRight', 12) + '</span></button></div>';
        }).join('') + '</div>' : '') + '</div>';
    }

    html += '<div class="focus-scena' + (timerAttivo ? ' timer-attivo' : '') + '">' +
      '<div class="focus-eyebrow' + eyebrowCls + '">' + eyebrow + '</div>' +
      (timerAttivo
        ? '<div class="timer-anello" id="timer-anello" style="--p:0"><div class="timer-interno">' +
          '<div class="timer-display" id="timer-display">–:––</div>' +
          '<div class="timer-eti">nel blocco</div></div></div>'
        : '') +
      '<div class="focus-azione">' + esc(prossima.testo) + '</div>' +
      '<div class="focus-area" style="--c-area:' + colArea + '">' +
      '<span style="color:' + colArea + ';display:inline-flex">' + ICO(area.icona, 15) + '</span>' +
      selectAreaAzione(prossima.id, prossima.areaId) + '</div>' +
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
      altreHtml +
      '</div>';

    $vista.innerHTML = html;
    montaOggiGiornata();

    var btnAltre = document.getElementById('btn-altre');
    if (btnAltre) btnAltre.addEventListener('click', function () { mostraAltre = !mostraAltre; vistaFocus(); });
    var btnTorna = document.getElementById('btn-torna-piano');
    if (btnTorna) btnTorna.addEventListener('click', function () { fuocoScelto = null; render(); });
    $vista.querySelectorAll('[data-fa-fuoco]').forEach(function (b) {
      b.addEventListener('click', function () { fuocoScelto = b.getAttribute('data-fa-fuoco'); mostraAltre = false; render(); });
    });
    $vista.querySelectorAll('[data-fa-fatto]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        feedbackSpunta(ev, LM.completaAzione(b.getAttribute('data-fa-fatto')), 'Fatto.', 'check');
        render();
      });
    });

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
      if (fuocoScelto === prossima.id) fuocoScelto = null;
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

  /* la barra compatta della giornata è sempre in cima a Oggi */
  function montaOggiGiornata() {
    var zona = document.getElementById('oggi-giornata');
    if (zona) montaGiornataStrip(zona);
  }

  /* ============================================================
     LA GIORNATA — timeline (sonno, pasti, abitudini, azioni)
     Rende visibile come è divisa la giornata: utile a chi fatica a
     percepire il tempo (Barkley 1997) e scarica dalla mente il "quando"
     (Risko & Gilbert 2016). Un solo componente, mostrato dove preferisci.
     ============================================================ */

  function minOf(hhmm) {
    if (!hhmm) return null;
    var p = String(hhmm).split(':');
    return (+p[0]) * 60 + (+p[1]);
  }
  function fmtMin(m) {
    m = ((m % 1440) + 1440) % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  }
  /* durata leggibile: 90 → "1h 30m", 45 → "45m", 120 → "2h" */
  function fmtOre(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return (h ? h + 'h' : '') + (h && m ? ' ' : '') + (m ? m + 'm' : (h ? '' : '0m'));
  }

  /* scaletta di durate ampia: dai 5 minuti (una micro-azione per partire) alle
     8 ore (una giornata di lavoro), così nessuno deve arrotondare per forza */
  var DURATE = [{ v: '', t: 'durata —' },
    { v: 5, t: '5 min' }, { v: 10, t: '10 min' }, { v: 15, t: '15 min' }, { v: 20, t: '20 min' },
    { v: 25, t: '25 min' }, { v: 30, t: '30 min' }, { v: 45, t: '45 min' }, { v: 60, t: '1 h' },
    { v: 90, t: '1 h 30' }, { v: 120, t: '2 h' }, { v: 150, t: '2 h 30' }, { v: 180, t: '3 h' },
    { v: 240, t: '4 h' }, { v: 300, t: '5 h' }, { v: 360, t: '6 h' }, { v: 480, t: '8 h' }];

  /* orizzonte della pagina "Giornata" e giorno/settimana/mese di riferimento */
  var giornataOrizzonte = 'giorno';
  var giornataAncora = null;
  var giornataSonnoAperto = false; // pannello sonno/pasti in cima alla pagina Giornata
  var giornataPopVista = 'vista'; // pop-up su schermo stretto: 'vista' | 'modifica'

  /* eventi di un giorno qualsiasi (per giorno/settimana/mese) */
  function nodiGiorno(k) {
    k = k || LM.todayKey();
    var s = LM.load();
    var r = LM.ritmoDi(k);
    var isToday = k === LM.todayKey();
    var placed = [], tray = [];
    (r.pasti || []).forEach(function (p) {
      if (p.ora) placed.push({ tipo: 'pasto', min: minOf(p.ora), ora: p.ora, dur: p.durata || 30, nome: p.nome, pastoId: p.id, icona: /colaz|coffee|breakfast/i.test((p.id || '') + ' ' + p.nome) ? 'coffee' : 'utensils' });
    });
    s.abitudini.forEach(function (h) {
      if (!LM.abitudinePrevista(h, k)) return;
      var e = { tipo: 'abitudine', min: minOf(h.ora), ora: h.ora, dur: h.durata || null, id: h.id, testo: h.testo, areaId: h.areaId, fatto: !!h.fatti[k], streak: isToday ? LM.streakAbitudine(h) : 0 };
      (e.min == null ? tray : placed).push(e);
    });
    LM.azioniDelGiorno(k).forEach(function (a) {
      var e = { tipo: 'azione', min: minOf(a.ora), ora: a.ora, dur: a.durata || null, id: a.id, testo: a.testo, areaId: a.areaId, mit: a.mit, done: a.done };
      (e.min == null ? tray : placed).push(e);
    });
    placed.sort(function (a, b) { return a.min - b.min; });
    /* wake = risveglio di stamattina (inizio della veglia); sleep = fine della
       giornata sul grafico = ora di andare a letto della ROUTINE (stanotte è un
       piano, non un fatto). sonno/sveglia restano i valori registrati (il
       resoconto della notte passata) per il pannello e per "quanto ho dormito". */
    return { k: k, isToday: isToday, wake: minOf(r.sveglia), sleep: minOf(r.sonnoRoutine), sveglia: r.sveglia, sonno: r.sonno, sonnoRoutine: r.sonnoRoutine, pasti: r.pasti, dalRegistro: r.dalRegistro, placed: placed, tray: tray };
  }
  function nodiGiornata() { return nodiGiorno(LM.todayKey()); }

  /* dispone i blocchi che si sovrappongono in colonne affiancate */
  function disponiBlocchi(placed) {
    var items = placed.map(function (e) { return { e: e, start: e.min, end: e.min + (e.dur || 30) }; });
    items.sort(function (a, b) { return a.start - b.start || a.end - b.end; });
    var gruppi = [], cur = [], curEnd = -1;
    items.forEach(function (it) {
      if (cur.length && it.start >= curEnd) { gruppi.push(cur); cur = []; curEnd = -1; }
      cur.push(it); curEnd = Math.max(curEnd, it.end);
    });
    if (cur.length) gruppi.push(cur);
    gruppi.forEach(function (g) {
      var cols = [];
      g.forEach(function (it) {
        var piazzato = false;
        for (var c = 0; c < cols.length; c++) { if (it.start >= cols[c]) { cols[c] = it.end; it.col = c; piazzato = true; break; } }
        if (!piazzato) { it.col = cols.length; cols.push(it.end); }
      });
      g.forEach(function (it) { it.ncols = cols.length; });
    });
    return items;
  }

  /* griglia oraria con blocchi che occupano il tempo (durata) */
  function htmlTimeGrid(d, opts) {
    opts = opts || {};
    var pxh = opts.pxh || 56;
    /* Finestra di veglia. sonno = ora di andare a letto, sveglia = risveglio.
       Se si va a letto dopo mezzanotte (bed <= wake) la notte scavalla le 24h,
       così l'asse resta monotòno invece di collassare/andare in negativo. */
    var wake = d.wake, bed = d.sleep;
    if (bed <= wake) bed += 1440;
    /* minuto "effettivo" sull'asse: i blocchi alle prime ore, quando si è
       svegli oltre mezzanotte, vanno nella coda notturna (+24h). */
    function em(min) { return (min != null && bed > 1440 && min < wake) ? min + 1440 : min; }
    /* La finestra deve contenere il sonno E ogni blocco piazzato: così nessun
       elemento finisce fuori dalla griglia a coprire il resto della pagina. */
    var lo = wake, hi = bed;
    d.placed.forEach(function (b) {
      var st = em(b.min); if (st == null) return;
      var en = st + (b.dur || 30);
      if (st < lo) lo = st; if (en > hi) hi = en;
    });
    var gs = Math.floor(lo / 60) * 60, ge = Math.ceil(hi / 60) * 60;
    if (ge <= gs) ge = gs + 60;
    var H = (ge - gs) / 60 * pxh;
    function y(m) { return (m - gs) / 60 * pxh; }
    var lines = '';
    for (var h = gs; h <= ge; h += 60) lines += '<div class="tl-hr" style="top:' + y(h) + 'px">' + (opts.rail === false ? '' : '<span class="tl-hr-eti">' + fmtMin(h) + '</span>') + '</div>';
    var shade = '';
    var sonnoLbl = opts.mini ? '' : '<span class="tl-sleep-lbl">' + ICO('bed', 11) + ' ' + fmtOre(LM.minutiSonno(d.k)) + '</span>';
    if (wake > gs) shade += '<div class="tl-sleep" style="top:0;height:' + y(wake) + 'px">' + sonnoLbl + '</div>';
    if (bed < ge) shade += '<div class="tl-sleep" style="top:' + y(bed) + 'px;height:' + (H - y(bed)) + 'px">' + (wake > gs ? '' : sonnoLbl) + '</div>';
    var blocks = disponiBlocchi(d.placed).map(function (it) {
      var e = it.e, dur = e.dur || 30;
      var top = y(em(e.min)), hgt = Math.max(opts.mini ? 15 : 24, dur / 60 * pxh - 2);
      var w = 100 / it.ncols, left = it.col * w;
      var pos = 'top:' + top + 'px;height:' + hgt + 'px;left:calc(' + left + '% + 1px);width:calc(' + w + '% - 3px)';
      if (e.tipo === 'pasto') {
        return '<div class="tl-blk tl-blk-pasto" style="' + pos + '">' + ICO(e.icona, 12) + (opts.mini ? '' : '<span class="tl-blk-t">' + esc(e.nome) + '</span>') + '</div>';
      }
      var ar = areaById(e.areaId), col = LM.coloreArea(ar);
      var fatto = e.tipo === 'azione' ? e.done : e.fatto;
      var attr = e.tipo === 'azione' ? 'data-tl-az="' + e.id + '"' : 'data-tl-ab="' + e.id + '"';
      var check = (opts.spuntabile && !opts.mini) ? '<button class="tl-blk-check" ' + attr + ' aria-label="Fatto">' + ICO('check', 11) + '</button>' : '';
      /* nella pagina Giornata il blocco si tocca per modificarlo (orario,
         durata, area) in un pannellino: niente più lista doppia sotto. */
      var clic = opts.mini ? ' data-tl-giorno="' + d.k + '"'
        : (opts.interactive ? ' data-blk-' + (e.tipo === 'azione' ? 'az' : 'ab') + '="' + e.id + '"' : '');
      /* le azioni si trascinano: su un'altra ora (stesso giorno) o su un altro
         giorno nella vista settimana */
      if (e.tipo === 'azione') clic += ' data-drag-az="' + e.id + '"';
      return '<div class="tl-blk tl-blk-att' + (fatto ? ' fatta' : '') + (opts.interactive && !opts.mini ? ' tl-blk-clic' : '') + '"' + clic + ' style="' + pos + ';--c-area:' + col + '" title="' + esc(e.testo) + '">' +
        check + '<span class="tl-blk-t">' + (e.mit ? ICO('star', 9) + ' ' : '') + esc(e.testo) + '</span>' +
        (hgt > 30 && !opts.mini ? '<span class="tl-blk-ora">' + e.ora + '–' + fmtMin(e.min + dur) + '</span>' : '') + '</div>';
    }).join('');
    var now = '';
    if (opts.nowMin != null) { var nm = em(opts.nowMin); if (nm >= gs && nm <= ge) now = '<div class="tl-now-line" style="top:' + y(nm) + 'px"><span>' + fmtMin(opts.nowMin) + '</span></div>'; }
    /* geometria salvata sull'elemento: permette di muovere la linea "adesso"
       in tempo reale senza ridisegnare tutta la griglia. data-adesso marca
       SOLO le griglie che rappresentano oggi (le altre non devono averla). */
    return '<div class="tl-grid' + (opts.mini ? ' tl-grid-mini' : '') + (opts.rail === false ? ' tl-grid-norail' : '') + '" style="height:' + H + 'px"' +
      (opts.nowMin != null ? ' data-adesso="1"' : '') +
      ' data-gs="' + gs + '" data-ge="' + ge + '" data-pxh="' + pxh + '" data-wake="' + wake + '" data-bed="' + bed + '">' +
      '<div class="tl-lines">' + lines + '</div>' +
      '<div class="tl-blocks">' + shade + blocks + now + '</div></div>';
  }
  /* muove la linea "adesso" in tutte le griglie di oggi (giorno e colonna di
     oggi nella settimana), senza ridisegnarle. */
  function aggiornaLineaGriglia() {
    document.querySelectorAll('.tl-grid[data-adesso]').forEach(function (grid) {
      var gs = +grid.getAttribute('data-gs'), ge = +grid.getAttribute('data-ge'), pxh = +grid.getAttribute('data-pxh');
      var wake = +grid.getAttribute('data-wake'), bed = +grid.getAttribute('data-bed');
      if (isNaN(gs) || isNaN(pxh)) return;
      var nn = new Date(); var now = nn.getHours() * 60 + nn.getMinutes();
      var nm = (bed > 1440 && now < wake) ? now + 1440 : now;
      var line = grid.querySelector('.tl-now-line');
      if (nm < gs || nm > ge) { if (line) line.remove(); return; }
      var top = (nm - gs) / 60 * pxh;
      if (!line) {
        line = document.createElement('div'); line.className = 'tl-now-line';
        line.innerHTML = '<span></span>'; grid.querySelector('.tl-blocks').appendChild(line);
      }
      line.style.top = top + 'px';
      line.querySelector('span').textContent = fmtMin(now);
    });
  }

  /* ---------- TRASCINAMENTO (mouse, dito e penna) ----------
     Non usiamo il drag&drop nativo di HTML: sui touch non esiste, quindi da
     telefono e iPad non funzionava. Qui lo facciamo con gli eventi puntatore,
     che valgono per tutti i dispositivi.
     Come si distingue un trascinamento da un tocco: col mouse basta muoversi
     di 6px; col dito serve tenere premuto ~220ms (altrimenti la pagina non si
     potrebbe più scorrere).
     I bersagli si dichiarano con attributi, così ogni vista può offrire i suoi:
       data-drop-giorno="AAAA-MM-GG"  → sposta in quel giorno
       data-drop-ora="1"              → dà l'ora corrispondente al punto
       data-drop-senzaora="1"         → toglie l'orario                        */
  var trasc = null;

  function bersaglioSotto(x, y) {
    var el = document.elementFromPoint(x, y);
    while (el && el !== document.body) {
      if (el.hasAttribute && (el.hasAttribute('data-drop-giorno') || el.hasAttribute('data-drop-ora') || el.hasAttribute('data-drop-senzaora'))) return el;
      el = el.parentElement;
    }
    return null;
  }
  /* Dove finirà la cosa: lo diciamo a parole nell'etichetta che segue il dito,
     e sulla griglia mostriamo anche una riga all'ora esatta. Senza questo si
     trascinava "alla cieca". */
  function anteprima(bers, y) {
    if (!bers) return { testo: 'Lascia su un giorno o su un’ora' };
    if (bers.hasAttribute('data-drop-senzaora')) return { testo: 'Senza orario' };
    if (bers.hasAttribute('data-drop-giorno')) return { testo: etichettaGiorno(bers.getAttribute('data-drop-giorno')) };
    if (bers.hasAttribute('data-drop-ora')) {
      var gs = +bers.getAttribute('data-gs'), pxh = +bers.getAttribute('data-pxh');
      if (isNaN(gs) || !pxh) return { testo: '' };
      var r = bers.getBoundingClientRect();
      var min = Math.max(0, Math.round((gs + (y - r.top) / pxh * 60) / 15) * 15);
      return { testo: 'alle ' + fmtMin(min % 1440), min: min, top: (min - gs) / 60 * pxh, host: bers };
    }
    return { testo: '' };
  }
  function guida(ap) {
    var g = document.getElementById('trasc-guida');
    if (!ap || ap.top == null || !ap.host) { if (g) g.remove(); return; }
    if (!g || g.parentNode !== ap.host) {
      if (g) g.remove();
      g = document.createElement('div'); g.id = 'trasc-guida'; g.className = 'trasc-guida';
      g.innerHTML = '<span></span>';
      (ap.host.querySelector('.tl-blocks') || ap.host).appendChild(g);
    }
    g.style.top = ap.top + 'px';
    g.querySelector('span').textContent = fmtMin(ap.min % 1440);
  }
  function evidenzia(el) {
    if (trasc && trasc.bersaglio === el) return;
    if (trasc && trasc.bersaglio) trasc.bersaglio.classList.remove('drop-attivo');
    if (trasc) trasc.bersaglio = el;
    if (el) el.classList.add('drop-attivo');
  }
  function fineTrascina() {
    if (!trasc) return;
    if (trasc.bersaglio) trasc.bersaglio.classList.remove('drop-attivo');
    if (trasc.fantasma && trasc.fantasma.parentNode) trasc.fantasma.parentNode.removeChild(trasc.fantasma);
    if (trasc.sorgente) trasc.sorgente.classList.remove('sto-prendendo');
    guida(null);
    document.body.classList.remove('sto-trascinando');
    trasc = null;
  }

  /* onRilascio(id, bersaglio, x, y) */
  function abilitaTrascina(scope, onRilascio) {
    scope.querySelectorAll('[data-drag-az]').forEach(function (el) {
      el.addEventListener('pointerdown', function (ev) {
        if (ev.button > 0) return;
        var btnDentro = ev.target.closest('button');
        if (btnDentro && btnDentro !== el && el.contains(btnDentro)) return;  // i pulsanti interni restano cliccabili
        var id = el.getAttribute('data-drag-az');
        var x0 = ev.clientX, y0 = ev.clientY;
        var tocco = ev.pointerType === 'touch';
        var attesa = null, spostato = false, morto = false;

        /* col dito il browser vuole scorrere la pagina: dopo il "tieni premuto"
           blocchiamo lo scorrimento, altrimenti il gesto ci viene strappato. */
        function bloccaTouch(e) { if (trasc) e.preventDefault(); }

        function avvia() {
          if (morto || trasc) return;
          var r = el.getBoundingClientRect();
          var f = document.createElement('div');
          f.className = 'trasc-fantasma';
          f.innerHTML = '<b></b><i></i>';
          f.querySelector('b').textContent = (el.getAttribute('title') || el.textContent || '').trim().slice(0, 44);
          f.style.width = Math.min(280, Math.max(150, r.width)) + 'px';
          document.body.appendChild(f);
          trasc = { id: id, fantasma: f, bersaglio: null, sorgente: el };
          el.classList.add('sto-prendendo');
          document.body.classList.add('sto-trascinando');
          try { el.setPointerCapture(ev.pointerId); } catch (e2) { }
          document.addEventListener('touchmove', bloccaTouch, { passive: false });
          muovi(x0, y0);
        }
        function muovi(x, y) {
          if (!trasc) return;
          trasc.fantasma.style.left = x + 'px';
          trasc.fantasma.style.top = y + 'px';
          var b = bersaglioSotto(x, y);
          evidenzia(b);
          var ap = anteprima(b, y);
          trasc.fantasma.querySelector('i').textContent = ap.testo;
          trasc.fantasma.classList.toggle('pronto', !!b);
          guida(ap);
        }
        function onMove(e) {
          var dx = e.clientX - x0, dy = e.clientY - y0;
          if (!trasc) {
            /* soglia generosa: un clic con la mano un po' mossa NON deve
               diventare un trascinamento (era la causa dei "pulsanti che non
               funzionano": il clic finiva in uno spostamento). */
            if (tocco) { if (Math.abs(dx) + Math.abs(dy) > 16) { morto = true; clearTimeout(attesa); } return; }
            if (Math.abs(dx) + Math.abs(dy) < 14) return;
            avvia();
            if (!trasc) return;
          }
          spostato = true;
          e.preventDefault();
          muovi(e.clientX, e.clientY);
        }
        function onUp(e) {
          clearTimeout(attesa);
          var fatto = false;
          if (trasc && spostato) {
            var b = bersaglioSotto(e.clientX, e.clientY);
            var idFin = trasc.id;
            fineTrascina();
            if (b) { fatto = true; onRilascio(idFin, b, e.clientX, e.clientY); }
          }
          /* il clic va ingoiato SOLO se abbiamo davvero spostato qualcosa,
             altrimenti si bloccherebbero i clic normali */
          if (fatto) {
            var ingoia = function (ce) { ce.stopPropagation(); ce.preventDefault(); };
            window.addEventListener('click', ingoia, true);
            setTimeout(function () { window.removeEventListener('click', ingoia, true); }, 350);
          }
          pulisci();
        }
        function pulisci() {
          clearTimeout(attesa);
          fineTrascina();
          document.removeEventListener('touchmove', bloccaTouch, { passive: false });
          el.removeEventListener('pointermove', onMove);
          el.removeEventListener('pointerup', onUp);
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          window.removeEventListener('pointercancel', suCancel);
        }
        /* se il gesto viene annullato PRIMA di iniziare (il browser ha deciso
           che era uno scorrimento) lasciamo perdere; se il trascinamento è già
           partito lo teniamo: abbiamo la cattura del puntatore. */
        function suCancel() { if (!trasc) { morto = true; pulisci(); } }

        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerup', onUp);
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', suCancel);
        if (tocco) attesa = setTimeout(function () { avvia(); spostato = true; }, 260);
      });
    });
  }

  /* Pannellino per modificare UNA cosa della giornata (azione o abitudine):
     spuntala, dàlle un orario, una durata, un'area. Sostituisce la vecchia
     lista "Orari e durate" che raddoppiava tutto quello che era già nel grafico.
     onCambio() ridisegna la giornata dietro al pannello. */
  function apriItemGiornata(k, id, tipo, onCambio, spuntabile) {
    var isAz = tipo === 'azione';
    if (spuntabile === undefined) spuntabile = true;
    function trova() {
      var dd = nodiGiorno(k);
      return dd.placed.concat(dd.tray).find(function (x) { return x.id === id; });
    }
    var e = trova();
    if (!e) return;
    var ar = areaById(e.areaId), col = LM.coloreArea(ar);
    var fatto = isAz ? e.done : e.fatto;
    var durOpt = DURATE.map(function (o) { return '<option value="' + o.v + '"' + ((e.dur || '') === o.v ? ' selected' : '') + '>' + o.t + '</option>'; }).join('');
    var html = '<div class="ig-ed">' +
      '<input type="text" class="ig-nome" id="ig-nome" value="' + esc(e.testo) + '" aria-label="Testo" placeholder="Cosa devi fare">' +
      /* su un giorno futuro non si spunta: si sta pianificando, non facendo */
      (spuntabile
        ? '<button class="btn ' + (fatto ? 'btn-ghost' : 'btn-primario') + ' ig-fatto"><span class="ig-fatto-ico">' + ICO(fatto ? 'refresh' : 'check', 16) + '</span>' + (fatto ? 'Fatta — togli la spunta' : 'Segna come fatta') + '</button>'
        : '<div class="ig-nota-futuro">' + ICO('calendar', 13) + ' La spunterai quando arriva il giorno.</div>') +
      '<div class="ig-griglia">' +
      '<label class="campo">' + ICO('clock', 12) + ' Orario</label><input type="time" class="tl-time" id="ig-ora" value="' + (e.ora || '') + '">' +
      '<label class="campo">Durata</label><select class="tl-dur" id="ig-dur">' + durOpt + '</select>' +
      '<label class="campo">Area</label>' + selectAree('ig-area', e.areaId) +
      '</div>' +
      '<div class="ig-fondo">' +
      (e.ora ? '<button class="btn btn-mini btn-ghost ig-noora">' + ICO('clock', 13) + ' Togli l’orario</button>' : '') +
      (isAz
        ? '<button class="btn btn-mini ig-indietro">' + ICO('lista', 13) + ' Togli dal giorno' + (e.passoDi ? '' : ' (torna tra le cose da fare)') + '</button>' +
          '<button class="btn btn-mini btn-ghost imp-pericolo ig-rimuovi">' + ICO('trash', 13) + ' Elimina</button>'
        : /* un'abitudine si toglie da QUESTO giorno senza cancellarla né
             toccare le altre; il resto si gestisce in Rituali */
          '<button class="btn btn-mini ig-salta">' + ICO('x', 13) + ' Togli solo da ' + esc(etichettaGiorno(k).toLowerCase()) + '</button>' +
          '<button class="btn btn-mini ig-finequi">' + ICO('calendar', 13) + ' Finisce qui (non più da domani)</button>' +
          '<button class="btn btn-mini btn-ghost ig-vairituali">' + ICO('refresh', 13) + ' Gestiscila in Rituali</button>') +
      '</div>' +
      '</div>';
    apriSheet(esc(e.testo), html, function (root) {
      function ricarica() { onCambio(); }
      var nome = root.querySelector('#ig-nome');
      nome.addEventListener('change', function () {
        var v = nome.value.trim();
        if (!v) { nome.value = e.testo; return; }
        if (isAz) LM.modificaAzione(id, v); else LM.modificaAbitudine(id, { testo: v });
        e.testo = v;
        var tit = document.getElementById('sheet-titolo'); if (tit) tit.textContent = v;
        ricarica();
      });
      var bFatto = root.querySelector('.ig-fatto');
      if (bFatto) bFatto.addEventListener('click', function (ev) {
        if (isAz) feedbackSpunta(ev, LM.completaAzione(id), 'Fatto.', 'check');
        else feedbackSpunta(ev, LM.completaAbitudine(id, k), 'Fatta. Continua così.', 'flame');
        chiudiSheet(); ricarica();
      });
      var ora = root.querySelector('#ig-ora');
      ora.addEventListener('change', function () {
        if (isAz) LM.setOraAzione(id, ora.value || null); else LM.modificaAbitudine(id, { ora: ora.value || null });
        ricarica();
      });
      var dur = root.querySelector('#ig-dur');
      dur.addEventListener('change', function () {
        var v = dur.value ? +dur.value : null;
        if (isAz) LM.setDurataAzione(id, v); else LM.modificaAbitudine(id, { durata: v });
        ricarica();
      });
      var area = root.querySelector('#ig-area');
      area.addEventListener('change', function () {
        if (isAz) LM.cambiaAreaAzione(id, area.value); else LM.modificaAbitudine(id, { areaId: area.value });
        ricarica();
      });
      var noora = root.querySelector('.ig-noora');
      if (noora) noora.addEventListener('click', function () {
        if (isAz) LM.setOraAzione(id, null); else LM.modificaAbitudine(id, { ora: null });
        chiudiSheet(); ricarica();
      });
      var ind = root.querySelector('.ig-indietro');
      if (ind) ind.addEventListener('click', function () {
        LM.azioneInBacklog(id);
        toast(e.passoDi ? 'Tolta dal giorno: il passo resta nel progetto.' : 'Rimessa tra le cose da fare.', 0, 'lista');
        chiudiSheet(); ricarica();
      });
      var rim = root.querySelector('.ig-rimuovi');
      if (rim) rim.addEventListener('click', function () {
        LM.rimuoviAzione(id); toast('Rimossa da oggi.', 0, 'trash');
        chiudiSheet(); ricarica();
      });
      var salta = root.querySelector('.ig-salta');
      if (salta) salta.addEventListener('click', function () {
        LM.saltaGiornoAbitudine(id, k);
        toast('Tolta solo da questo giorno: le altre e i prossimi giorni non cambiano.', 0, 'x');
        chiudiSheet(); ricarica();
      });
      var fq = root.querySelector('.ig-finequi');
      if (fq) fq.addEventListener('click', function () {
        var hh = LM.load().abitudini.find(function (x) { return x.id === id; });
        LM.impostaPeriodoAbitudine(id, hh ? hh.da : null, k);
        toast('Da domani non comparirà più. Lo storico resta.', 0, 'calendar');
        chiudiSheet(); ricarica();
      });
      var vai = root.querySelector('.ig-vairituali');
      if (vai) vai.addEventListener('click', function () { chiudiSheet(); sottoRituale = 'abitudini'; location.hash = '#/rituali'; });
    });
  }

  function montaGiornata(container, opts) {
    opts = opts || {};
    var compact = !!opts.compact;
    var k = opts.giorno || LM.todayKey();
    var d = nodiGiorno(k);
    /* Tre modi: il passato si guarda, oggi si fa, il futuro si PIANIFICA.
       Nel futuro si può aggiungere/modificare/spostare, ma non spuntare:
       una cosa di domani non si può aver già fatta (falserebbe XP e serie). */
    var isFuturo = k > LM.todayKey();
    var interactive = true;                    // si può sempre sistemare
    var spuntabile = !isFuturo;                // anche a posteriori, mai nel futuro
    var now = new Date();
    var nowMin = d.isToday ? now.getHours() * 60 + now.getMinutes() : null;

    var vuota = !d.placed.length && !d.tray.length;

    /* Le cose SENZA orario non stanno sul grafico: le mostriamo sotto, come
       righe che si toccano per dargli un orario (o si spuntano al volo).
       Le cose CON orario si modificano toccando il loro blocco nel grafico. */
    var senzaOra = '';
    if (!compact && interactive && d.tray.length) {
      senzaOra = '<div class="gio-so"><div class="gio-so-eti">' + ICO('clock', 12) + ' Senza orario <span class="gio-so-n">' + d.tray.length + '</span> — toccale per dargli un posto nella giornata</div>' +
        d.tray.map(function (e) {
          var ar = areaById(e.areaId), col = LM.coloreArea(ar);
          var fatto = e.tipo === 'azione' ? e.done : e.fatto;
          var attr = e.tipo === 'azione' ? 'data-tl-az="' + e.id + '"' : 'data-tl-ab="' + e.id + '"';
          var bAttr = 'data-blk-' + (e.tipo === 'azione' ? 'az' : 'ab') + '="' + e.id + '"';
          return '<div class="gio-so-riga' + (fatto ? ' fatta' : '') + '" style="--c-area:' + col + '"' +
            (e.tipo === 'azione' ? ' data-drag-az="' + e.id + '"' : '') + '>' +
            (spuntabile ? '<button class="tl-check" ' + attr + ' aria-label="Fatto">' + ICO('check', 12) + '</button>' : '') +
            '<button class="gio-so-corpo" ' + bAttr + '>' +
            '<span class="tl-tag" style="color:' + col + '" title="' + esc(ar.nome) + '">' + ICO(ar.icona, 13) + '</span>' +
            '<span class="gio-so-testo">' + esc(e.testo) + (e.mit ? ' ' + ICO('star', 9) : '') + '</span>' +
            '<span class="gio-so-cta">' + ICO('clock', 12) + ' dai un orario</span></button></div>';
        }).join('') + '</div>';
    }
    /* Aggiunta rapida: solo il testo e l'area. L'orario si dà dopo, toccando
       la cosa (meno campi da riempire = meno attrito per buttarla giù). */
    var quickAdd = '';
    if (!compact && interactive) {
      var doveAdd = d.isToday ? 'a oggi' : ('a ' + etichettaGiorno(k).toLowerCase());
      quickAdd = '<form class="tl-add" id="tl-add"><input type="text" id="tl-add-testo" placeholder="Aggiungi qualcosa ' + esc(doveAdd) + '…" aria-label="Aggiungi">' +
        '<span class="tl-add-area">' + selectAree('tl-add-area') + '</span>' +
        '<button class="btn btn-mini btn-primario" type="submit">' + ICO('plus', 14) + ' Aggiungi</button></form>';
    }

    /* sonno e pasti del giorno: UN solo posto, in cima alla pagina, con un
       riassunto sempre visibile e un pannello che si apre per modificarli. */
    var sonnoTop = '';
    if (!compact && interactive) {
      var aperto = giornataSonnoAperto;
      var pastiIco = (d.pasti || []).slice(0, 5).map(function (p) { return ICO(/colaz|coffee/i.test((p.id || '') + p.nome) ? 'coffee' : 'utensils', 12); }).join(' ');
      var riass = ICO('bed', 13) + ' <b>' + d.sonno + '</b>→<b>' + d.sveglia + '</b> · dormi ' + fmtOre(LM.minutiSonno(k)) + ' · ' + (pastiIco || '—') + ' ' + (d.pasti || []).length + ' pasti';
      var durOpt = function (v) { return DURATE.map(function (o) { return '<option value="' + o.v + '"' + ((v || '') === o.v ? ' selected' : '') + '>' + o.t + '</option>'; }).join(''); };
      var pastiRows = (d.pasti || []).map(function (p, i) {
        return '<div class="sp-riga" data-pi="' + i + '">' +
          '<span class="sp-ico">' + ICO(/colaz|coffee/i.test((p.id || '') + p.nome) ? 'coffee' : 'utensils', 14) + '</span>' +
          '<input type="text" class="sp-nome" data-sp-nome="' + i + '" value="' + esc(p.nome) + '" aria-label="Nome del pasto">' +
          '<input type="time" class="tl-time" data-sp-ora="' + i + '" value="' + (p.ora || '') + '" aria-label="Orario">' +
          '<select class="tl-dur" data-sp-dur="' + i + '" aria-label="Durata">' + durOpt(p.durata) + '</select>' +
          '<button class="icona-btn" data-sp-del="' + i + '" title="Rimuovi" aria-label="Rimuovi">' + ICO('trash', 13) + '</button></div>';
      }).join('');
      sonnoTop = '<div class="gio-sonno">' +
        '<button class="gio-sonno-testa" id="gio-sonno-toggle" aria-expanded="' + aperto + '"><span class="gs-riass">' + riass + (d.dalRegistro ? ' <span class="tl-ed-badge">registrato</span>' : '') + '</span>' +
        '<span class="bk-chevron' + (aperto ? ' aperta' : '') + '">' + ICO('chevronGiu', 16) + '</span></button>' +
        /* il corpo c'è sempre (nascosto se chiuso): aprirlo non ricostruisce
           la pagina, così il grafico sopra non si muove */
        ('<div class="gio-sonno-corpo"' + (aperto ? '' : ' hidden') + '>' +
          '<div class="sp-sonno">' +
          '<label class="sp-lab">' + ICO('bed', 13) + ' A letto</label><input type="time" class="tl-time" id="sp-aletto" value="' + d.sonno + '">' +
          '<label class="sp-lab">' + ICO('sun', 13) + ' Sveglia</label><input type="time" class="tl-time" id="sp-sveglia" value="' + d.sveglia + '">' +
          '<span class="sp-dorm">' + ICO('clock', 12) + ' dormi <b id="sp-dorm">' + fmtOre(LM.minutiSonno(k)) + '</b></span>' +
          '</div>' +
          '<div class="sp-pasti" id="sp-pasti">' + pastiRows + '</div>' +
          '<div class="riga-flex mt-s"><button class="btn btn-mini" id="sp-add">' + ICO('plus', 13) + ' Aggiungi un pasto</button>' +
          (d.dalRegistro ? '<button class="btn btn-mini btn-ghost" id="sp-reset">Torna al ritmo di base</button>' : '') +
          '<button class="btn btn-mini btn-ghost" id="sp-base">' + ICO('sun', 13) + ' Cambia il ritmo di base</button></div>' +
          '<div class="imp-nota" style="margin-top:8px">Vale per <b>questo giorno</b> e resta nel registro. Il ritmo di base (per gli altri giorni) si cambia da «Cambia il ritmo di base».</div>' +
          '</div>') + '</div>';
    }

    var trayRo = '';
    if (!interactive && d.tray.length) {
      trayRo = '<div class="tl-tray"><div class="tl-tray-eti">Senza orario</div>' +
        d.tray.map(function (e) {
          var ar = areaById(e.areaId), col = LM.coloreArea(ar);
          return '<div class="tl-ed-riga" style="--c-area:' + col + '"><span class="tl-tag" style="color:' + col + '">' + ICO(ar.icona, 13) + '</span><span class="tl-ed-testo">' + esc(e.testo) + '</span></div>';
        }).join('') + '</div>';
    }

    var footer = '';
    /* Ripianificare in blocco: la sera (o un giorno passato rimasto a metà) si
       porta al giorno dopo quello che non è stato fatto, senza riscrivere. */
    if (!compact) {
      var nonFatte = d.placed.concat(d.tray).filter(function (e) { return e.tipo === 'azione' && !e.done; });
      if (nonFatte.length && !isFuturo) {
        var doveVa = etichettaGiorno(LM.addDays(k, 1)).toLowerCase();
        footer = '<div class="tl-piede"><button class="btn btn-mini" id="tl-rimanda">' + ICO('arrowRight', 14) + ' Sposta a ' + doveVa + ' le ' + nonFatte.length + ' cose non fatte</button>' +
          '<span class="sotto" style="margin:0">Niente penalità: ripianificare è parte del gioco.</span></div>';
      }
    }
    if (compact && opts.controls !== false) {
      footer = '<div class="tl-piede"><button class="btn btn-primario btn-mini" id="tl-apri-pagina">' + ICO('calendar', 14) + ' Gestisci la giornata ' + ICO('arrowRight', 13) + '</button></div>';
    }

    /* pop-up: la griglia si adatta all'altezza disponibile, così NON si scrolla */
    var narrow = compact && window.innerWidth < 720;
    var pxh = 56;
    if (compact) {
      var bedH = d.sleep <= d.wake ? d.sleep + 1440 : d.sleep; // a letto dopo mezzanotte
      var ore = Math.max(1, Math.ceil(bedH / 60) - Math.floor(d.wake / 60));
      /* altezza-obiettivo della griglia = altezza del pannello meno il "chrome"
         (testa sheet, intestazione, nota, footer, padding), così NON si scrolla */
      var avail = window.innerHeight * (narrow ? 0.9 : 0.86) - 300;
      pxh = Math.max(18, Math.min(narrow ? 42 : 48, avail / ore));
    }
    var sommario = '';
    if (compact && nowMin != null) {
      var pross = d.placed.filter(function (e) { return e.min + (e.dur || 30) > nowMin && !(e.tipo === 'azione' ? e.done : (e.tipo === 'abitudine' ? e.fatto : false)); })[0];
      sommario = 'Adesso <b>' + fmtMin(nowMin) + '</b>' + (pross ? ' · poi ' + esc(pross.nome || pross.testo) + ' alle ' + pross.ora : ' · niente altro in agenda');
    }
    var sottoHead = compact
      ? (sommario || 'Come è divisa la tua giornata. Spunta ciò che fai; per cambiarla apri Giornata.')
      : (isFuturo ? 'Prepara questa giornata: aggiungi le cose e dàgli un orario. Le spunterai quando arriva il giorno.'
         : d.isToday ? 'Tocca un blocco per dargli orario o durata; trascinalo per spostarlo; spunta ciò che fai.'
         : 'Puoi ancora sistemarla: spunta quello che avevi fatto e non avevi segnato.');
    var head = opts.header === false ? '' : '<div class="tl-head"><div><h2>' + ICO('clock', 16) + ' ' + (opts.giorno && !d.isToday ? etichettaGiorno(k) : 'La giornata') + '</h2>' +
      '<div class="sotto">' + sottoHead + '</div></div></div>';
    var gridHtml = vuota
      ? '<div class="vuoto" style="padding:18px 8px"><b>Niente in agenda per questo giorno.</b>' + (isFuturo ? '<br>Puoi già prepararlo: aggiungi qui sotto le cose che vuoi fare.' : interactive ? '<br>Aggiungi una cosa qui sotto, o dai un orario a un’abitudine.' : '') + '</div>'
      : htmlTimeGrid(d, { interactive: interactive, spuntabile: spuntabile, nowMin: nowMin, pxh: pxh });

    if (compact) {
      var popNota = d.tray.length ? '<div class="tl-pop-note">' + ICO('clock', 12) + ' ' + d.tray.length + (d.tray.length === 1 ? ' cosa senza orario' : ' cose senza orario') + ' — assegnale un orario in <b>Giornata</b>.</div>' : '';
      container.innerHTML = '<div class="card giornata giornata-pop">' + head + '<div id="tl-grid-host">' + gridHtml + '</div>' + popNota + footer + '</div>';
    } else {
      var navGiorno = orizzNav('giorno', k);
      container.innerHTML = navGiorno + '<div class="card giornata">' + head + sonnoTop + '<div id="tl-grid-host">' + gridHtml + '</div>' + senzaOra + quickAdd + trayRo + footer + '</div>';
      wireOrizzNav(container, 'giorno');
    }

    var af = container.querySelector('#tl-add');
    if (af) af.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = container.querySelector('#tl-add-testo').value.trim();
      if (!t) return;
      LM.aggiungiAzione(t, container.querySelector('#tl-add-area').value, { data: k, mit: LM.serveMit(k) });
      montaGiornata(container, opts); aggiornaNav();
    });

    if (interactive) {
      /* completare un elemento (spunta) ricostruisce tutto: non c'è un campo
         attivo da preservare. */
      function onCambio() { montaGiornata(container, opts); aggiornaNav(); }
      function wireGriglia(scope) {
        scope.querySelectorAll('.tl-check[data-tl-az], .tl-blk-check[data-tl-az]').forEach(function (b) {
          b.addEventListener('click', function (ev) {
            feedbackSpunta(ev, LM.completaAzione(b.getAttribute('data-tl-az')), 'Fatto.', 'check');
            onCambio();
          });
        });
        scope.querySelectorAll('.tl-check[data-tl-ab], .tl-blk-check[data-tl-ab]').forEach(function (b) {
          b.addEventListener('click', function (ev) {
            feedbackSpunta(ev, LM.completaAbitudine(b.getAttribute('data-tl-ab'), k), 'Fatta. Continua così.', 'flame');
            montaGiornata(container, opts);
          });
        });
        /* toccare un blocco (o una riga «senza orario») apre il pannellino di
           modifica di QUELLA cosa: orario, durata, area, spunta. */
        scope.querySelectorAll('[data-blk-az]').forEach(function (b) {
          b.addEventListener('click', function () { apriItemGiornata(k, b.getAttribute('data-blk-az'), 'azione', onCambio, spuntabile); });
        });
        scope.querySelectorAll('[data-blk-ab]').forEach(function (b) {
          b.addEventListener('click', function () { apriItemGiornata(k, b.getAttribute('data-blk-ab'), 'abitudine', onCambio, spuntabile); });
        });
      }
      /* refresh SOLO della griglia visiva (usato dai cambi di sonno/pasti):
         non tocca eventuali campi con il fuoco altrove nella pagina. */
      function refreshGriglia() {
        var host = container.querySelector('#tl-grid-host');
        if (!host) { montaGiornata(container, opts); return; }
        host.innerHTML = htmlTimeGrid(nodiGiorno(k), { interactive: true, spuntabile: spuntabile, nowMin: nowMin, pxh: pxh });
        wireGriglia(host);
      }
      wireGriglia(container);
      /* trascinare: sulla griglia dà l'ora del punto in cui lasci (a 15
         minuti), sulla zona "senza orario" toglie l'orario */
      var grigliaEl = container.querySelector('.tl-grid');
      if (grigliaEl) grigliaEl.setAttribute('data-drop-ora', '1');
      var zonaSo = container.querySelector('.gio-so');
      if (zonaSo) zonaSo.setAttribute('data-drop-senzaora', '1');
      abilitaTrascina(container, function (id, bersaglio, x, y) {
        if (bersaglio.hasAttribute('data-drop-senzaora')) {
          LM.setOraAzione(id, null);
          toast('Tolto l’orario: resta tra le cose senza orario.', 0, 'clock');
        } else if (bersaglio.hasAttribute('data-drop-ora')) {
          var gs = +bersaglio.getAttribute('data-gs'), pxh = +bersaglio.getAttribute('data-pxh');
          if (isNaN(gs) || !pxh) return;
          var r = bersaglio.getBoundingClientRect();
          var min = gs + (y - r.top) / pxh * 60;
          min = Math.max(0, Math.round(min / 15) * 15) % 1440;
          LM.setOraAzione(id, fmtMin(min));
          LM.spostaAzione(id, k);
          toast('Spostata alle ' + fmtMin(min) + '.', 0, 'clock');
        } else if (bersaglio.hasAttribute('data-drop-giorno')) {
          var g = bersaglio.getAttribute('data-drop-giorno');
          if (!LM.spostaAzione(id, g)) return;
          toast('Spostata a ' + etichettaGiorno(g).toLowerCase() + '.', 0, 'calendar');
        }
        montaGiornata(container, opts); aggiornaNav();
      });

      /* --- sonno e pasti del giorno (registro), modifica uno per uno --- */
      function aggiornaDorm() { var el = container.querySelector('#sp-dorm'); if (el) el.textContent = fmtOre(LM.minutiSonno(k)); }
      function leggiPasti() { return JSON.parse(JSON.stringify(nodiGiorno(k).pasti || [])); }
      var spA = container.querySelector('#sp-aletto');
      if (spA) spA.addEventListener('change', function () { LM.setRitmoGiorno(k, { sonno: spA.value || d.sonno }); aggiornaDorm(); refreshGriglia(); });
      var spS = container.querySelector('#sp-sveglia');
      if (spS) spS.addEventListener('change', function () { LM.setRitmoGiorno(k, { sveglia: spS.value || d.sveglia }); aggiornaDorm(); refreshGriglia(); });
      container.querySelectorAll('[data-sp-nome]').forEach(function (inp) {
        inp.addEventListener('change', function () { var i = +inp.getAttribute('data-sp-nome'); var arr = leggiPasti(); if (arr[i]) { arr[i].nome = inp.value.trim() || 'Pasto'; LM.setRitmoGiorno(k, { pasti: arr }); } });
      });
      container.querySelectorAll('[data-sp-ora]').forEach(function (inp) {
        inp.addEventListener('change', function () { var i = +inp.getAttribute('data-sp-ora'); var arr = leggiPasti(); if (arr[i]) { arr[i].ora = inp.value || null; LM.setRitmoGiorno(k, { pasti: arr }); refreshGriglia(); } });
      });
      container.querySelectorAll('[data-sp-dur]').forEach(function (sel) {
        sel.addEventListener('change', function () { var i = +sel.getAttribute('data-sp-dur'); var arr = leggiPasti(); if (arr[i]) { arr[i].durata = sel.value ? +sel.value : 30; LM.setRitmoGiorno(k, { pasti: arr }); refreshGriglia(); } });
      });
      container.querySelectorAll('[data-sp-del]').forEach(function (b) {
        b.addEventListener('click', function () { var i = +b.getAttribute('data-sp-del'); var arr = leggiPasti(); arr.splice(i, 1); LM.setRitmoGiorno(k, { pasti: arr }); montaGiornata(container, opts); });
      });
      var spAdd = container.querySelector('#sp-add');
      if (spAdd) spAdd.addEventListener('click', function () { var arr = leggiPasti(); arr.push({ id: 'p' + Date.now().toString(36), nome: 'Pasto', ora: '', durata: 30 }); LM.setRitmoGiorno(k, { pasti: arr }); montaGiornata(container, opts); });
      var spReset = container.querySelector('#sp-reset');
      if (spReset) spReset.addEventListener('click', function () { LM.azzeraRitmoGiorno(k); toast('Torna al ritmo di base.', 0, 'refresh'); montaGiornata(container, opts); });
      var spBase = container.querySelector('#sp-base');
      if (spBase) spBase.addEventListener('click', apriRitmo);
      var gsT = container.querySelector('#gio-sonno-toggle');
      if (gsT) gsT.addEventListener('click', function () {
        giornataSonnoAperto = !giornataSonnoAperto;
        var corpo = container.querySelector('.gio-sonno-corpo');
        if (corpo) corpo.hidden = !giornataSonnoAperto;
        gsT.setAttribute('aria-expanded', giornataSonnoAperto);
        var ch = gsT.querySelector('.bk-chevron');
        if (ch) ch.classList.toggle('aperta', giornataSonnoAperto);
      });
    }
    var rim = container.querySelector('#tl-rimanda');
    if (rim) rim.addEventListener('click', function () {
      var n = LM.rimandaNonFatte(k, LM.addDays(k, 1));
      toast(n === 1 ? 'Spostata al giorno dopo.' : n + ' cose spostate al giorno dopo.', 0, 'arrowRight');
      montaGiornata(container, opts); aggiornaNav();
    });
    var ap = container.querySelector('#tl-apri-pagina');
    if (ap) ap.addEventListener('click', function () { chiudiSheet(); location.hash = '#/giornata'; });
  }

  /* --- Settimana: 7 colonne con blocchi (scroll orizzontale su mobile) --- */
  function montaSettimana(container) {
    var lunedi = LM.weekKey(giornataAncora);
    var giorni = []; for (var i = 0; i < 7; i++) giorni.push(LM.addDays(lunedi, i));
    var oggi = LM.todayKey();
    var nowMin = new Date().getHours() * 60 + new Date().getMinutes();
    var d0 = nodiGiorno(oggi);
    var pxh = 42;
    var bed0 = d0.sleep <= d0.wake ? d0.sleep + 1440 : d0.sleep; // a letto dopo mezzanotte
    var gs = Math.floor(d0.wake / 60) * 60, ge = Math.ceil(bed0 / 60) * 60; if (ge <= gs) ge = gs + 60;
    var railLines = '';
    for (var hh = gs; hh <= ge; hh += 60) railLines += '<div class="wk-rail-h" style="top:' + ((hh - gs) / 60 * pxh) + 'px">' + fmtMin(hh) + '</div>';
    var Hs = (ge - gs) / 60 * pxh;

    var cols = giorni.map(function (k) {
      var dk = nodiGiorno(k);
      var scad = LM.snapshot().backlog.filter(function (b) { return b.scadenza === k; });
      var untimed = dk.tray.length ? '<span class="wk-untimed" title="senza orario">+' + dk.tray.length + '</span>' : '';
      var scadHtml = scad.length ? '<div class="wk-scad" title="scadenze">' + ICO('calendar', 11) + ' ' + scad.length + '</div>' : '';
      var grid = htmlTimeGrid(dk, { pxh: pxh, rail: false, mini: true, nowMin: k === oggi ? nowMin : null });
      var lab = LM.weekdayShort(k); lab = lab.charAt(0).toUpperCase() + lab.slice(1);
      return '<div class="wk-col' + (k === oggi ? ' oggi' : '') + '" data-tl-giorno="' + k + '">' +
        '<div class="wk-col-head"><b>' + lab + '</b><span>' + LM.fmtShort(k) + '</span>' + untimed + '</div>' +
        scadHtml + grid + '</div>';
    }).join('');

    container.innerHTML = orizzNav('settimana', giorni[0], giorni[6]) +
      '<div class="card"><div class="wk-wrap"><div class="wk-rail" style="height:' + Hs + 'px">' + railLines + '</div>' +
      '<div class="wk-cols">' + cols + '</div></div>' +
      '<div class="sotto mt-s">Tocca un giorno per aprirlo. I blocchi mostrano quanto tempo occupano le cose con un orario.</div></div>';
    wireOrizzNav(container, 'settimana');
    container.querySelectorAll('[data-tl-giorno]').forEach(function (el) {
      el.addEventListener('click', function () { setOrizzonte('giorno', el.getAttribute('data-tl-giorno')); });
      el.setAttribute('data-drop-giorno', el.getAttribute('data-tl-giorno'));
    });
    /* trascinare una cosa da un giorno all'altro: ripianificare la settimana
       muovendo i blocchi, senza aprire niente */
    abilitaTrascina(container, function (id, bersaglio) {
      var giorno = bersaglio.getAttribute('data-drop-giorno');
      if (!giorno || !LM.spostaAzione(id, giorno)) return;
      toast('Spostata a ' + etichettaGiorno(giorno).toLowerCase() + '.', 0, 'calendar');
      disegnaOrizzonte(); aggiornaNav();
    });
  }

  /* --- Mese: calendario con indicatori di attività e scadenze --- */
  function montaMese(container) {
    var p = giornataAncora.split('-');
    var anno = +p[0], mese = +p[1] - 1;
    var primo = new Date(anno, mese, 1);
    var inizio = new Date(anno, mese, 1 - ((primo.getDay() + 6) % 7));
    var oggi = LM.todayKey();
    var mesi = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
    var s = LM.snapshot();
    var meseXp = [];
    for (var j = 0; j < 42; j++) { var dj = new Date(inizio.getFullYear(), inizio.getMonth(), inizio.getDate() + j); meseXp.push(s.xpPerGiorno[LM.dayKey(dj)] || 0); }
    var maxXp = Math.max.apply(null, meseXp.concat([1]));
    var celle = '';
    for (var i = 0; i < 42; i++) {
      var d = new Date(inizio.getFullYear(), inizio.getMonth(), inizio.getDate() + i);
      var k = LM.dayKey(d);
      var fuori = d.getMonth() !== mese;
      var futuro = k > oggi;
      /* mattoncini colorati per area = composizione della giornata (azioni
         completate + abitudini fatte); lo sfondo "scalda" con l'intensità (XP) */
      var fatti = LM.azioniDelGiorno(k).filter(function (a) { return a.done; }).map(function (a) { return a.areaId; })
        .concat(s.abitudini.filter(function (h) { return h.fatti[k]; }).map(function (h) { return h.areaId; }));
      var scadG = s.backlog.filter(function (b) { return b.scadenza === k; });
      var xp = s.xpPerGiorno[k] || 0;
      var heat = xp <= 0 ? 0 : Math.min(3, Math.ceil(xp / maxXp * 3));
      var mattoni = fatti.slice(0, 10).map(function (aid) { return '<i style="background:' + LM.coloreArea(areaById(aid)) + '"></i>'; }).join('') +
        (fatti.length > 10 ? '<span class="me-piu">+' + (fatti.length - 10) + '</span>' : '');
      var scadBadge = scadG.length ? '<span class="me-scad" title="' + esc(scadG.map(function (b) { return b.testo; }).join(', ')) + '">' + ICO('calendar', 9) + (scadG.length > 1 ? ' ' + scadG.length : '') + '</span>' : '';
      /* le cose ancora da fare diventano pastiglie che si possono prendere e
         portare su un altro giorno (ripianificare guardando tutto il mese) */
      var daFare = LM.azioniDelGiorno(k).filter(function (a) { return !a.done; });
      var pastiglie = daFare.slice(0, 3).map(function (a) {
        return '<span class="me-pill" data-drag-az="' + a.id + '" style="--c-area:' + LM.coloreArea(areaById(a.areaId)) + '" title="' + esc(a.testo) + '">' + esc(a.testo) + '</span>';
      }).join('') + (daFare.length > 3 ? '<span class="me-pill-piu">+' + (daFare.length - 3) + '</span>' : '');
      /* i giorni fuori dal mese restano neutri: colorarli renderebbe il numero
         illeggibile e confonderebbe il colpo d'occhio sul mese vero */
      celle += '<button class="me-cella ' + (fuori ? 'fuori' : 'heat-' + heat) + (k === oggi ? ' oggi' : '') + (futuro ? ' futuro' : '') + '" data-tl-giorno="' + k + '" aria-label="' + LM.weekdayShort(k) + ' ' + LM.fmtShort(k) + '">' +
        '<span class="me-testa"><span class="me-num">' + d.getDate() + '</span>' + scadBadge + '</span>' +
        (daFare.length ? '<span class="me-pills">' + pastiglie + '</span>' : '') +
        (fatti.length ? '<span class="me-mattoni">' + mattoni + '</span>' : '') + '</button>';
    }
    var dowh = ['L', 'M', 'M', 'G', 'V', 'S', 'D'].map(function (x) { return '<span>' + x + '</span>'; }).join('');
    container.innerHTML = orizzNav('mese', giornataAncora, null, mesi[mese] + ' ' + anno) +
      '<div class="card"><div class="me-dow">' + dowh + '</div><div class="me-grid">' + celle + '</div>' +
      '<div class="me-legenda"><span class="lg"><i class="me-heatkey"></i> più lo sfondo è acceso, più la giornata è stata piena</span>' +
      '<span class="lg"><i class="me-sqkey"></i> ogni quadretto è una cosa fatta, col colore dell’area</span>' +
      '<span class="lg">' + ICO('calendar', 11) + ' scadenza · tocca un giorno per aprirlo</span></div></div>';
    wireOrizzNav(container, 'mese');
    container.querySelectorAll('[data-tl-giorno]').forEach(function (el) {
      el.addEventListener('click', function () { setOrizzonte('giorno', el.getAttribute('data-tl-giorno')); });
      el.setAttribute('data-drop-giorno', el.getAttribute('data-tl-giorno'));
    });
    /* nel mese si trascinano le cose ancora da fare (le pastiglie in fondo alla
       cella) e si lasciano su un altro giorno: ripianificare a colpo d'occhio */
    abilitaTrascina(container, function (id, bersaglio) {
      var giorno = bersaglio.getAttribute('data-drop-giorno');
      if (!giorno || !LM.spostaAzione(id, giorno)) return;
      toast('Spostata a ' + etichettaGiorno(giorno).toLowerCase() + '.', 0, 'calendar');
      disegnaOrizzonte(); aggiornaNav();
    });
  }

  /* --- Anno: mappa dell'attività + scadenze dei prossimi mesi --- */
  function montaAnno(container) {
    var anno = +giornataAncora.split('-')[0];
    var s = LM.snapshot();
    var giorni = [];
    var k = anno + '-01-01';
    while (+k.split('-')[0] === anno) { giorni.push({ data: k, valore: s.xpPerGiorno[k] || 0 }); k = LM.addDays(k, 1); }
    var attivi = giorni.filter(function (g) { return LM.giornoAttivo(g.data); }).length;
    var azFatte = s.azioni.filter(function (a) { return a.done && a.data.slice(0, 4) === '' + anno; }).length;
    var xpAnno = giorni.reduce(function (n, g) { return n + g.valore; }, 0);
    var scad = s.backlog.filter(function (b) { return b.scadenza && b.scadenza.slice(0, 4) === '' + anno; }).sort(function (a, b) { return a.scadenza < b.scadenza ? -1 : 1; });
    var scadHtml = scad.length ? scad.map(function (b) {
      var ar = areaById(b.areaId); var si = scadInfo(b.scadenza);
      return '<div class="an-scad"><span class="scad-badge ' + si.cls + '">' + LM.fmtShort(b.scadenza) + '</span>' +
        '<span class="scad-testo">' + esc(b.testo) + '</span>' +
        '<span class="tl-tag" style="color:' + LM.coloreArea(ar) + '">' + ICO(ar.icona, 13) + '</span></div>';
    }).join('') : '<div class="sotto" style="margin:0">Nessuna scadenza registrata per il ' + anno + '.</div>';

    container.innerHTML = orizzNav('anno', giornataAncora, null, '' + anno) +
      '<div class="card"><div class="eroe-statistiche" style="justify-content:flex-start;margin-bottom:14px">' +
      '<div class="stat"><span class="stat-val">' + attivi + '</span><span class="stat-eti">giorni attivi</span></div>' +
      '<div class="stat"><span class="stat-val">' + azFatte + '</span><span class="stat-eti">azioni fatte</span></div>' +
      '<div class="stat"><span class="stat-val">' + xpAnno + '</span><span class="stat-eti">XP</span></div></div>' +
      '<h2 style="font-size:14px">' + ICO('trendUp', 15) + ' La tua attività, giorno per giorno</h2>' +
      '<div class="an-heat-wrap"><div id="an-heat"></div></div></div>' +
      '<div class="card mt"><h2>' + ICO('calendar', 16) + ' Scadenze del ' + anno + '</h2><div class="an-scad-lista mt-s">' + scadHtml + '</div></div>';
    LMCharts.heatmap(document.getElementById('an-heat'), giorni);
    wireOrizzNav(container, 'anno');
  }

  /* barra di navigazione comune agli orizzonti (‹ periodo › + Oggi) */
  function orizzNav(orizz, k1, k2, etichetta) {
    var testo = etichetta || (k2 ? LM.fmtShort(k1) + ' – ' + LM.fmtShort(k2) : etichettaGiorno(k1));
    return '<div class="orizz-barra"><button class="icona-btn" data-nav="prev" aria-label="Precedente">' + ICO('chevronGiu', 16) + '</button>' +
      '<span class="orizz-eti">' + testo + '</span>' +
      '<button class="icona-btn" data-nav="next" aria-label="Successivo">' + ICO('chevronGiu', 16) + '</button>' +
      '<button class="btn btn-mini" data-nav="oggi">Oggi</button></div>';
  }
  function shiftKey(k, orizz, n) {
    var p = k.split('-'); var d;
    if (orizz === 'giorno') return LM.addDays(k, n);
    if (orizz === 'settimana') return LM.addDays(k, n * 7);
    if (orizz === 'mese') { d = new Date(+p[0], +p[1] - 1 + n, 1); }
    else { d = new Date(+p[0] + n, +p[1] - 1, 1); }
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  function wireOrizzNav(container, orizz) {
    container.querySelectorAll('[data-nav]').forEach(function (b) {
      b.addEventListener('click', function () {
        var a = b.getAttribute('data-nav');
        if (a === 'oggi') giornataAncora = LM.todayKey();
        else giornataAncora = shiftKey(giornataAncora, orizz, a === 'next' ? 1 : -1);
        disegnaOrizzonte();
      });
    });
  }

  function setOrizzonte(o, ancora) {
    giornataOrizzonte = o;
    if (ancora) giornataAncora = ancora;
    var nav = document.getElementById('orizz-nav');
    if (nav) nav.querySelectorAll('[data-orizz]').forEach(function (b) { b.classList.toggle('attivo', b.getAttribute('data-orizz') === o); });
    disegnaOrizzonte();
  }
  /* anima solo quando cambi orizzonte o giorno, non a ogni spunta */
  var orizzMostrato = '';
  function disegnaOrizzonte() {
    var c = document.getElementById('orizz-corpo');
    if (!c) return;
    var chiave = giornataOrizzonte + '|' + giornataAncora;
    var cambio = chiave !== orizzMostrato;
    if (giornataOrizzonte === 'giorno') montaGiornata(c, { giorno: giornataAncora });
    else if (giornataOrizzonte === 'settimana') montaSettimana(c);
    else if (giornataOrizzonte === 'mese') montaMese(c);
    else montaAnno(c);
    orizzMostrato = chiave;
    if (cambio) animaIngresso(c);
  }

  function htmlGiornataStrip() {
    var d = nodiGiornata();
    var wake = d.wake, bed = d.sleep;
    if (bed <= wake) bed += 1440; // a letto dopo mezzanotte
    function em(m) { return (m != null && bed > 1440 && m < wake) ? m + 1440 : m; }
    var span = Math.max(60, bed - wake);
    function pct(m) { return Math.max(0, Math.min(100, (em(m) - wake) / span * 100)); }
    /* la barra distingue i tipi: blocchi con DURATA precisa come segmenti che
       occupano il tempo, le cose a un solo orario come punti, i pasti come
       tacche; le abitudini hanno il contorno, le azioni sono piene. */
    var conDur = 0, soloOra = 0, pasti = 0;
    var marks = d.placed.map(function (e) {
      var left = pct(e.min);
      if (e.tipo === 'pasto') {
        pasti++;
        return '<span class="strip-pasto" style="left:' + left.toFixed(1) + '%" title="' + esc(e.ora + ' · ' + e.nome) + '"></span>';
      }
      var col = LM.coloreArea(areaById(e.areaId));
      var fatto = e.tipo === 'azione' ? e.done : e.fatto;
      var cls = (e.tipo === 'abitudine' ? ' abit' : '') + (fatto ? ' fatta' : '');
      var tit = esc(e.ora + ' · ' + e.testo + (e.dur ? ' (' + e.dur + ' min)' : ''));
      if (e.dur) {
        conDur++;
        var w = Math.max(2, Math.min(100 - left, e.dur / span * 100));
        return '<span class="strip-seg' + cls + '" style="left:' + left.toFixed(1) + '%;width:' + w.toFixed(1) + '%;--c:' + col + '" title="' + tit + '"></span>';
      }
      soloOra++;
      return '<span class="strip-mark' + cls + '" style="left:' + left.toFixed(1) + '%;--c:' + col + '" title="' + tit + '"></span>';
    }).join('');
    var now = new Date();
    var nm = now.getHours() * 60 + now.getMinutes();
    var nowEl = (em(nm) >= wake && em(nm) <= bed) ? '<span class="strip-now" style="left:' + pct(nm).toFixed(1) + '%"></span>' : '';
    var pross = d.placed.filter(function (e) { return e.min >= nm && !(e.tipo === 'azione' ? e.done : e.fatto); })[0];
    var sotto = pross ? 'poi ' + esc(pross.nome || pross.testo) + ' · ' + pross.ora
      : (d.placed.length ? 'niente altro in agenda oggi' : 'nessun orario per oggi — tocca per aggiungerne');
    var lg = [];
    if (conDur) lg.push('<span class="lg"><i class="lg-seg"></i>' + conDur + ' con durata</span>');
    if (soloOra) lg.push('<span class="lg"><i class="lg-dot"></i>' + soloOra + ' a un orario</span>');
    if (pasti) lg.push('<span class="lg"><i class="lg-pasto"></i>' + pasti + ' pasti</span>');
    if (d.tray.length) lg.push('<span class="lg"><i class="lg-none"></i>' + d.tray.length + ' senza orario</span>');
    var legenda = lg.length ? '<div class="strip-legenda">' + lg.join('') + '</div>' : '';
    return '<button class="giornata-strip" id="giornata-strip-btn" aria-label="Apri la giornata">' +
      '<div class="strip-testa"><span class="strip-tit">' + ICO('clock', 14) + ' La giornata</span>' +
      '<span class="strip-sotto">' + sotto + ' ' + ICO('arrowRight', 13) + '</span></div>' +
      '<div class="strip-barra">' + marks + nowEl + '</div>' +
      '<div class="strip-estremi"><span>' + d.sveglia + '</span><span>' + d.sonnoRoutine + '</span></div>' +
      legenda +
      '</button>';
  }
  function montaGiornataStrip(container) {
    container.innerHTML = htmlGiornataStrip();
    var b = container.querySelector('#giornata-strip-btn');
    if (b) b.addEventListener('click', function () {
      apriSheet('La giornata', '<div id="sheet-giornata"></div>', function (root) {
        montaGiornata(root.querySelector('#sheet-giornata'), { compact: true });
      }, true);
    });
  }

  /* editor del RITMO DI BASE: sonno, sveglia, pasti (con durata). Vale per i
     giorni che non hanno un registro proprio. */
  function apriRitmo() {
    var r = LM.load().profilo.ritmo || LM.RITMO_DEFAULT;
    function durOpt(v) { return DURATE.map(function (o) { return '<option value="' + o.v + '"' + ((v || '') === o.v ? ' selected' : '') + '>' + o.t + '</option>'; }).join(''); }
    function pastoRiga(p, i) {
      return '<div class="ritmo-pasto" data-pi="' + i + '">' +
        '<input type="text" class="ritmo-nome" value="' + esc(p.nome) + '" aria-label="Nome del pasto">' +
        '<input type="time" class="ritmo-ora" value="' + (p.ora || '') + '" aria-label="Orario">' +
        '<select class="ritmo-dur tl-dur" aria-label="Durata">' + durOpt(p.durata) + '</select>' +
        '<button class="icona-btn" data-pdel="' + i + '" title="Rimuovi" aria-label="Rimuovi">' + ICO('trash', 13) + '</button></div>';
    }
    function durSonno(aletto, sveglia) {
      function m(x) { var q = String(x).split(':'); return (+q[0]) * 60 + (+q[1]); }
      var dd = m(sveglia) - m(aletto); if (dd <= 0) dd += 1440; return dd;
    }
    apriSheet('Sonno e pasti',
      '<div class="imp-nota" style="margin-top:0">È il tuo ritmo di base: disegna lo sfondo della giornata. Un singolo giorno lo puoi registrare a parte dalla pagina <i>Giornata</i>.</div>' +
      '<div class="ritmo-riga2"><label class="campo">A letto</label><input type="time" id="ritmo-sonno" value="' + esc(r.sonno) + '">' +
      '<label class="campo">Sveglia</label><input type="time" id="ritmo-sveglia" value="' + esc(r.sveglia) + '"></div>' +
      '<div class="sp-dorm" style="margin:2px 0 4px">' + ICO('clock', 12) + ' dormi <b id="ritmo-dorm">' + fmtOre(durSonno(r.sonno, r.sveglia)) + '</b></div>' +
      '<div class="imp-sezione"><div class="imp-eti">Pasti (nome · ora · durata)</div><div id="ritmo-pasti">' + (r.pasti || []).map(pastoRiga).join('') + '</div>' +
      '<button class="btn btn-mini mt-s" id="ritmo-add">' + ICO('plus', 13) + ' Aggiungi un pasto</button></div>' +
      '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="ritmo-salva">' + ICO('save', 15) + ' Salva</button></div>',
      function (root) {
        function aggiornaDorm() {
          root.querySelector('#ritmo-dorm').textContent = fmtOre(durSonno(root.querySelector('#ritmo-sonno').value || '23:30', root.querySelector('#ritmo-sveglia').value || '07:30'));
        }
        root.querySelector('#ritmo-sonno').addEventListener('change', aggiornaDorm);
        root.querySelector('#ritmo-sveglia').addEventListener('change', aggiornaDorm);
        root.querySelector('#ritmo-add').addEventListener('click', function () {
          var box = root.querySelector('#ritmo-pasti');
          var i = box.querySelectorAll('.ritmo-pasto').length;
          box.insertAdjacentHTML('beforeend', pastoRiga({ nome: 'Pasto', ora: '', durata: 30 }, i));
          wirePdel();
        });
        function wirePdel() {
          root.querySelectorAll('[data-pdel]').forEach(function (b) {
            b.onclick = function () { b.closest('.ritmo-pasto').remove(); };
          });
        }
        wirePdel();
        root.querySelector('#ritmo-salva').addEventListener('click', function () {
          var pasti = [];
          root.querySelectorAll('.ritmo-pasto').forEach(function (row, i) {
            var nome = row.querySelector('.ritmo-nome').value.trim() || 'Pasto';
            var ora = row.querySelector('.ritmo-ora').value;
            var dur = row.querySelector('.ritmo-dur').value;
            if (ora) pasti.push({ id: 'p' + i, nome: nome, ora: ora, durata: dur ? +dur : 30 });
          });
          LM.impostaRitmo({
            sveglia: root.querySelector('#ritmo-sveglia').value || '07:30',
            sonno: root.querySelector('#ritmo-sonno').value || '23:30',
            pasti: pasti
          });
          chiudiSheet(); render(); toast('Ritmo di base aggiornato.', 0, 'check');
        });
      });
  }

  function vistaGiornata() {
    if (!giornataAncora) giornataAncora = LM.todayKey();
    function orizz(id, ico, et) { return '<button data-orizz="' + id + '" class="' + (giornataOrizzonte === id ? 'attivo' : '') + '">' + ICO(ico, 15) + et + '</button>'; }
    var html = topbar('La giornata', 'Con le frecce ‹ › vai avanti e indietro: i giorni futuri puoi già prepararli. Oppure allarga lo sguardo con settimana, mese e anno.');
    html += '<div class="segmenti sez-nav" id="orizz-nav">' +
      orizz('giorno', 'clock', 'Giorno') + orizz('settimana', 'calendar', 'Settimana') +
      orizz('mese', 'dashboard', 'Mese') + orizz('anno', 'trendUp', 'Anno') + '</div>' +
      '<div id="orizz-corpo"></div>';
    $vista.innerHTML = html;
    document.getElementById('orizz-nav').querySelectorAll('[data-orizz]').forEach(function (b) {
      b.addEventListener('click', function () { setOrizzonte(b.getAttribute('data-orizz')); });
    });
    disegnaOrizzonte();
  }

  /* ============================================================
     VISTA: PLANCIA
     ============================================================ */

  var sezPlancia = 'riepilogo';
  var sezMostrata = '';   // per animare solo al cambio di sezione
  var periodoTrend = 14;
  var diarioGiorni = 21;
  var diarioTutto = false;

  /* etichetta relativa del giorno: Oggi / Ieri / "lun 14 lug" */
  function etichettaGiorno(k) {
    var t = LM.todayKey();
    if (k === t) return 'Oggi';
    if (k === LM.addDays(t, -1)) return 'Ieri';
    var g = LM.weekdayShort(k);
    return g.charAt(0).toUpperCase() + g.slice(1) + ' ' + LM.fmtShort(k);
  }

  function oraDi(ts) {
    var d = new Date(ts);
    return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  }

  /* conto alla rovescia leggibile di una scadenza (ADHD: rende visibile il
     tempo che passa, senza allarmismi) */
  function scadInfo(scad) {
    var d = LM.daysBetween(LM.todayKey(), scad);
    if (d < 0) return { d: d, testo: d === -1 ? 'ieri' : (-d) + 'g fa', cls: 'scad-ritardo' };
    if (d === 0) return { d: 0, testo: 'oggi', cls: 'scad-oggi' };
    if (d === 1) return { d: 1, testo: 'domani', cls: 'scad-vicina' };
    return { d: d, testo: 'tra ' + d + 'g', cls: d <= 3 ? 'scad-vicina' : 'scad-lontana' };
  }

  /* una riga della timeline del Diario */
  function eventoDiarioHtml(ev) {
    var ico, testo, cls = '';
    if (ev.tipo === 'azione') {
      var ar = areaById(ev.areaId);
      ico = '<span class="diario-ico ok">' + ICO('check', 14) + '</span>';
      testo = 'Completata · <b>' + esc(ev.testo) + '</b>' +
        ' <span class="diario-area" style="color:' + LM.coloreArea(ar) + '" title="' + esc(ar.nome) + '">' + ICO(ar.icona, 13) + '</span>' +
        (ev.mit ? ' <span class="tag-mit">' + ICO('star', 9) + 'Priorità</span>' : '');
    } else if (ev.tipo === 'checkin') {
      ico = '<span class="diario-ico">' + ICO('bolt', 14) + '</span>';
      testo = 'Check-in · energia <b>' + ev.energia + '</b> · focus <b>' + ev.focus + '</b> · umore <b>' + ev.umore + '</b>';
    } else if (ev.tipo === 'mattina') {
      ico = '<span class="diario-ico">' + ICO('sun', 14) + '</span>';
      testo = 'Piano del mattino' + (ev.intenzione ? ' · <span class="diario-sec">' + esc(ev.intenzione) + '</span>' : '');
    } else if (ev.tipo === 'sera') {
      ico = '<span class="diario-ico">' + ICO('moon', 14) + '</span>';
      testo = 'Review della sera' +
        (ev.vittoria ? ' · <span class="diario-sec">andata bene: ' + esc(ev.vittoria) + '</span>' : '') +
        (ev.blocco ? ' · <span class="diario-sec">ostacolo: ' + esc(ev.blocco) + '</span>' : '');
    } else if (ev.tipo === 'settimana') {
      ico = '<span class="diario-ico">' + ICO('calendar', 14) + '</span>';
      testo = 'Review della settimana' + (ev.imparato ? ' · <span class="diario-sec">' + esc(ev.imparato) + '</span>' : '');
    } else if (ev.tipo === 'registro') {
      var icoCat = { azione: 'target', abitudine: 'refresh', backlog: 'lista', inbox: 'inbox', area: 'sparkles', giornata: 'clock', focus: 'clock', impostazioni: 'sun', dati: 'save' };
      ico = '<span class="diario-ico' + (ev.imp ? '' : ' minore') + '">' + ICO(icoCat[ev.cat] || 'bolt', 13) + '</span>';
      testo = '<span class="diario-log">' + esc(ev.testo) + '</span>';
      cls = ev.imp ? '' : ' minore';
    } else { /* cattura */
      ico = '<span class="diario-ico">' + ICO('inbox', 14) + '</span>';
      testo = 'Annotato · <b>' + esc(ev.testo) + '</b>';
    }
    /* per le azioni si può riassegnare l'area anche a distanza di giorni */
    if (ev.tipo === 'azione' && ev.id) {
      testo += ' <span class="diario-cambia">' + selectAreaAzione(ev.id, ev.areaId, 'mini') + '</span>';
    }
    return '<div class="diario-evento' + cls + '">' + ico + '<div class="diario-testo">' + testo + '</div>' +
      '<span class="diario-ora">' + oraDi(ev.ts) + '</span></div>';
  }

  function vistaPlancia() {
    var s = LM.load();
    var lvl = LM.livelloDaXp(s.xp);
    var st = LM.streak();
    var oggi = LM.azioniDiOggi();
    var fatte = oggi.filter(function (a) { return a.done; }).length;
    var t = LM.todayKey();
    var checkinOggi = s.checkins.filter(function (c) { return c.data === t; }).length;

    var html = topbar('Panoramica', 'I tuoi dati e i tuoi progressi, una sezione per volta.');

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
      '<button class="btn btn-primario eroe2-cta" data-vai="oggi">' + ICO('target', 16) + ' Vai a Oggi</button>' +
      '</div>';

    /* schede interne: si vede una sezione per volta */
    function segp(id, ico, et) { return '<button data-sez="' + id + '" class="' + (sezPlancia === id ? 'attivo' : '') + '">' + ICO(ico, 15) + et + '</button>'; }
    html += '<div class="segmenti sez-nav" id="sez-plancia">' + segp('riepilogo', 'dashboard', 'Riepilogo') + segp('diario', 'book', 'Diario') + segp('aree', 'sparkles', 'Aree') + segp('andamento', 'trendUp', 'Andamento') + '</div>';
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
      var cambio = sezPlancia !== sezMostrata;
      if (sezPlancia === 'riepilogo') sezRiepilogo(c);
      else if (sezPlancia === 'diario') sezDiario(c);
      else if (sezPlancia === 'aree') sezAree(c);
      else sezAndamento(c);
      sezMostrata = sezPlancia;
      if (cambio) animaIngresso(c);
    }

    /* --- Riepilogo: azioni di oggi + costanza --- */
    function sezRiepilogo(c) {
      c.innerHTML = '<div class="griglia griglia-2">' +
        '<div class="card" style="--i:0"><h2>' + ICO('target', 16) + ' Le azioni di oggi</h2>' +
        '<div class="sotto">Le scegli la mattina in <a href="#/rituali">Rituali</a>, le fai una alla volta in <a href="#/oggi">Oggi</a>. Qui le vedi tutte insieme.</div>' +
        '<div class="lista-azioni" id="lista-oggi"></div>' +
        '<form id="form-add" class="riga-flex mt-s"><input type="text" id="testo-add" placeholder="Aggiungi un’altra cosa a oggi…" style="flex:1;min-width:150px">' +
        '<span style="width:132px">' + selectAree('area-add') + '</span>' +
        '<button class="btn btn-mini btn-primario" type="submit" aria-label="Aggiungi">' + ICO('plus', 14) + '</button></form></div>' +
        '<div class="card" style="--i:1"><h2>' + ICO('trendUp', 16) + ' Costanza</h2>' +
        '<div class="sotto">XP guadagnati ogni giorno, nelle ultime 12 settimane. Quello che conta è tornarci spesso.</div>' +
        '<div id="heatmap"></div></div></div>';

      LMCharts.heatmap(document.getElementById('heatmap'), LM.heatmapConsistenza(12));

      var lista = document.getElementById('lista-oggi');
      if (!oggi.length) {
        lista.innerHTML = '<div class="vuoto" style="padding:16px 8px">Non hai ancora scelto le azioni di oggi.<br><a href="#/rituali">Scegli cosa fare</a> in un minuto.</div>';
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
            feedbackSpunta(ev, LM.completaAzione(b.getAttribute('data-id')), 'Azione completata.', 'check');
            render();
          });
        });
      }
      document.getElementById('form-add').addEventListener('submit', function (e) {
        e.preventDefault();
        var t2 = document.getElementById('testo-add').value.trim();
        if (!t2) return;
        LM.aggiungiAzione(t2, document.getElementById('area-add').value, { mit: LM.serveMit() });
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

    /* --- Diario: cronologia di ciò che hai fatto e scritto --- */
    function sezDiario(c) {
      var giorni = LM.diario(diarioGiorni, diarioTutto);
      var filtro = '<div class="segmenti mini-seg" id="diario-filtro">' +
        '<button data-tutto="0" class="' + (!diarioTutto ? 'attivo' : '') + '">Cose importanti</button>' +
        '<button data-tutto="1" class="' + (diarioTutto ? 'attivo' : '') + '">Tutto</button></div>';
      var html;
      if (!giorni.length) {
        html = '<div class="card diario"><div class="card-testa"><div class="sotto" style="margin:0">La storia di tutto ciò che fai, dal più recente.</div>' + filtro + '</div>' +
          '<div class="vuoto" style="padding:20px 8px">' + ICO('book', 28) + '<br><b>Ancora niente da mostrare.</b><br>Appena fai qualcosa comparirà qui, giorno per giorno.</div></div>';
      } else {
        html = '<div class="card diario"><div class="card-testa"><div class="sotto" style="margin:0">La storia di tutto ciò che fai — azioni, note, scelte, impostazioni. ' + (diarioTutto ? 'Stai vedendo <b>tutto</b>.' : 'Mostro le <b>cose importanti</b>; con «Tutto» vedi anche le modifiche minori.') + '</div>' + filtro + '</div>';
        giorni.forEach(function (g) {
          html += '<div class="diario-giorno">' +
            '<div class="diario-data">' + etichettaGiorno(g.data) + '</div>' +
            '<div class="diario-eventi">' + g.eventi.map(eventoDiarioHtml).join('') + '</div></div>';
        });
        html += '</div>';
        var totGiorni = LM.giorniConAttivita();
        if (totGiorni > giorni.length) {
          html += '<div style="text-align:center" class="mt"><button class="btn" id="diario-altro">' + ICO('refresh', 15) + ' Mostra altri giorni</button></div>';
        }
      }
      c.innerHTML = html;
      var b = document.getElementById('diario-altro');
      if (b) b.addEventListener('click', function () { diarioGiorni += 30; disegnaSezione(); });
      document.getElementById('diario-filtro').querySelectorAll('[data-tutto]').forEach(function (bt) {
        bt.addEventListener('click', function () { diarioTutto = bt.getAttribute('data-tutto') === '1'; disegnaSezione(); });
      });
    }
  }

  /* ============================================================
     VISTA: RITUALI
     ============================================================ */

  var sottoRituale = null;
  var inboxEditId = null;

  function vistaRituali() {
    var ora = new Date().getHours();
    var sub = sottoRituale || (ora < 12 ? 'mattina' : (ora >= 19 ? 'sera' : 'checkin'));
    sottoRituale = sub;

    var suggerito = (ora < 12 ? 'mattina' : (ora >= 19 ? 'sera' : 'checkin'));
    var html = topbar('Rituali', 'Piccole routine fisse: te le trovi già pronte, così non devi ripensarci ogni volta.') +
      '<div class="rituali-nav segmenti" id="seg-rituali">' +
      seg('mattina', 'sun', 'Mattina') + seg('abitudini', 'refresh', 'Abitudini') + seg('checkin', 'bolt', 'Check-in') + seg('sera', 'moon', 'Sera') + seg('settimana', 'calendar', 'Settimana') +
      '</div>' +
      '<div class="passo-rituale" id="corpo-rituale"></div>';
    $vista.innerHTML = html;
    void suggerito;

    document.getElementById('seg-rituali').querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { sottoRituale = b.getAttribute('data-sub'); render(); });
    });

    var corpo = document.getElementById('corpo-rituale');
    if (sub === 'mattina') ritualeMattina(corpo);
    if (sub === 'abitudini') ritualeAbitudini(corpo);
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
      testaRituale('sun', 'Le azioni di oggi',
        'Qui le <b>scegli</b> (poi le fai in <i>Oggi</i>). La prima è la più importante: se fai solo quella, la giornata è già a posto. Domani si riparte da capo.') +
      '<div class="lista-azioni" id="piano-lista"></div>' +
      /* Tre è il consiglio, non un muro: chi ha una giornata piena deve poter
         scrivere quello che gli serve. Oltre le tre lo diciamo e basta. */
      '<form id="form-piano" class="mt-s"><div class="riga-flex">' +
      '<input type="text" id="piano-testo" placeholder="' + (oggi.length === 0 ? 'La cosa più importante di oggi…' : 'Un’altra cosa (se vuoi)…') + '" style="flex:1;min-width:180px">' +
      '<span style="width:155px">' + selectAree('piano-area') + '</span>' +
      '<button class="btn btn-primario" type="submit" aria-label="Aggiungi">' + ICO('plus', 16) + '</button></div>' +
      (oggi.length >= 3 ? '<div class="sotto" style="margin:8px 0 0">Hai già <b>' + oggi.length + '</b> cose per oggi. Tre bastano quasi sempre: se ne aggiungi altre, valuta se qualcuna può aspettare domani (la sposti da <i>La giornata</i>).</div>' : '') +
      '</form>' +
      '<label class="campo">Quando e dove inizi la prima?</label>' +
      '<input type="text" id="piano-ifthen" placeholder="Es. alle 9:00, appena mi siedo alla scrivania, apro solo il file su cui devo lavorare" value="' + (piano ? esc(piano.intenzione) : '') + '">' +
      '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="btn-salva-piano">' + (piano ? 'Aggiorna' : 'Salva e parti') + ' <small>+' + LM.XP_EVENTI.pianoMattina + ' XP</small></button>' +
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
      : '<div class="vuoto" style="padding:14px">Ancora niente. La prima cosa che scrivi diventa quella più importante.</div>';

    var form = document.getElementById('form-piano');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      var testo = document.getElementById('piano-testo').value.trim();
      if (!testo) return;
      LM.aggiungiAzione(testo, document.getElementById('piano-area').value, { mit: LM.serveMit() });
      render();
    });
    document.getElementById('btn-salva-piano').addEventListener('click', function () {
      var xp = LM.salvaPianoMattina(document.getElementById('piano-ifthen').value.trim());
      var mit = LM.azioniDiOggi().find(function (a) { return a.mit; });
      if (mit) {
        mit.ifThen = document.getElementById('piano-ifthen').value.trim();
        LM.save();
      }
      toast(xp ? 'Fatto. Ora pensa solo alla prima cosa.' : 'Aggiornato.', xp, 'sun');
      render();
    });
    document.getElementById('btn-vai-focus').addEventListener('click', function () { location.hash = '#/oggi'; });
  }

  /* ---------- Rituali → Abitudini ---------- */

  var GIORNI_ORD = [1, 2, 3, 4, 5, 6, 0];
  var GIORNI_LAB = { 1: 'L', 2: 'M', 3: 'M', 4: 'G', 5: 'V', 6: 'S', 0: 'D' };

  function chipsGiorni(giorni) {
    return '<div class="giorni-chips">' + GIORNI_ORD.map(function (d) {
      return '<button type="button" class="giorno-chip' + (giorni.indexOf(d) >= 0 ? ' sel' : '') + '" data-giorno="' + d + '">' + GIORNI_LAB[d] + '</button>';
    }).join('') + '</div>';
  }
  function leggiGiorni(root) {
    var g = [];
    root.querySelectorAll('.giorno-chip.sel').forEach(function (b) { g.push(+b.getAttribute('data-giorno')); });
    return g;
  }
  function riepilogoGiorni(giorni) {
    if (!giorni || !giorni.length) return 'ogni giorno';
    if (giorni.length === 7) return 'ogni giorno';
    var feriali = [1, 2, 3, 4, 5];
    if (giorni.length === 5 && feriali.every(function (d) { return giorni.indexOf(d) >= 0; })) return 'lun–ven';
    return GIORNI_ORD.filter(function (d) { return giorni.indexOf(d) >= 0; }).map(function (d) { return GIORNI_LAB[d]; }).join(' ');
  }

  function ritualeAbitudini(corpo) {
    var s = LM.load();
    var oggi = LM.abitudiniDiOggi();
    var tutte = s.abitudini;

    var listaOggi = oggi.length
      ? oggi.map(function (h) {
        var fatto = !!h.fatti[LM.todayKey()];
        var st = LM.streakAbitudine(h);
        var ar = areaById(h.areaId);
        return '<div class="abit-oggi' + (fatto ? ' fatta' : '') + '" data-ab="' + h.id + '">' +
          '<button class="spunta" data-toggle-ab="' + h.id + '" aria-label="Segna come fatta">' + ICO('check', 13) + '</button>' +
          '<span class="testo">' + esc(h.testo) + '</span>' +
          (st > 0 ? '<span class="abit-streak">' + ICO('flame', 12, 'fiamma') + ' ' + st + '</span>' : '') +
          '<span class="tag-area" style="--c-area:' + LM.coloreArea(ar) + '" title="' + esc(ar.nome) + '">' + ICO(ar.icona, 14) + '</span></div>';
      }).join('')
      : '<div class="vuoto" style="padding:14px 8px">Nessuna abitudine prevista per oggi.</div>';

    var listaTutte = tutte.length
      ? tutte.map(function (h) {
        return '<div class="abit-riga" data-abrow="' + h.id + '" style="--c-area:' + LM.coloreArea(areaById(h.areaId)) + '">' +
          '<div class="abit-riga-top">' +
          '<span class="tag-area">' + ICO(areaById(h.areaId).icona, 14) + '</span>' +
          '<input type="text" class="abit-nome" data-abnome="' + h.id + '" value="' + esc(h.testo) + '" aria-label="Nome abitudine">' +
          '<button class="icona-btn" data-abdel="' + h.id + '" title="Rimuovi">' + ICO('trash', 14) + '</button></div>' +
          '<div class="abit-riga-giorni">' + chipsGiorni(h.giorni) + '<span class="abit-giorni-rec">' + riepilogoGiorni(h.giorni) + '</span></div>' +
          /* Per quanto tempo vale: di default da quando l'hai creata e senza
             fine, ma si può dare un periodo preciso (es. "per un mese"). */
          '<div class="abit-periodo">' +
          '<span class="ap-eti">' + ICO('calendar', 12) + ' vale</span>' +
          '<label class="ap-campo">dal <input type="date" data-abda="' + h.id + '" value="' + (h.da || '') + '" aria-label="Dal giorno"></label>' +
          '<label class="ap-campo">al <input type="date" data-aba="' + h.id + '" value="' + (h.a || '') + '" min="' + (h.da || '') + '" aria-label="Al giorno (vuoto = senza fine)"></label>' +
          (h.a ? '<button class="btn btn-mini btn-ghost" data-abnofine="' + h.id + '">Senza fine</button>' : '<span class="ap-nota">vuoto = senza fine</span>') +
          (Object.keys(h.salti || {}).length ? (function () { var n = Object.keys(h.salti).length;
            return '<span class="ap-salti" title="' + esc(Object.keys(h.salti).sort().map(LM.fmtShort).join(', ')) + '">' + n + (n === 1 ? ' giorno saltato' : ' giorni saltati') + '</span>'; })() : '') +
          '</div>' +
          '</div>';
      }).join('')
      : '';

    corpo.innerHTML = '<div class="card">' +
      testaRituale('refresh', 'Abitudini',
        'Le cose che vuoi ripetere spesso. Stanno per conto loro, quindi non rubano posto alle tre azioni di oggi. Ogni volta che le fai, la serie cresce.') +
      '<h2 style="font-size:14px">Oggi</h2><div class="abit-lista-oggi">' + listaOggi + '</div>' +
      '</div>' +
      '<div class="card mt"><h2>' + ICO('lista', 16) + ' Le tue abitudini</h2>' +
      '<div class="sotto">Tocca i giorni per scegliere quando ripeterla. Nessun giorno selezionato = ogni giorno.</div>' +
      '<div class="abit-tutte">' + listaTutte + '</div>' +
      '<form id="abit-nuova" class="abit-nuova"><div class="riga-flex">' +
      '<input type="text" id="abit-testo" placeholder="Nuova abitudine…" style="flex:1;min-width:150px">' +
      '<span style="width:150px">' + selectAree('abit-area') + '</span></div>' +
      '<div class="riga-flex mt-s" id="abit-giorni-nuova">' + chipsGiorni([]) + '<button class="btn btn-mini btn-primario" type="submit">' + ICO('plus', 13) + ' Aggiungi</button></div>' +
      '</form></div>';

    corpo.querySelectorAll('[data-toggle-ab]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        feedbackSpunta(ev, LM.completaAbitudine(b.getAttribute('data-toggle-ab')), 'Fatta. Continua così', 'flame');
        ritualeAbitudini(corpo);
      });
    });
    corpo.querySelectorAll('[data-abdel]').forEach(function (b) {
      b.addEventListener('click', function () { LM.rimuoviAbitudine(b.getAttribute('data-abdel')); ritualeAbitudini(corpo); });
    });
    corpo.querySelectorAll('[data-abda]').forEach(function (inp) {
      inp.addEventListener('change', function () {
        var h = LM.load().abitudini.find(function (x) { return x.id === inp.getAttribute('data-abda'); });
        LM.impostaPeriodoAbitudine(inp.getAttribute('data-abda'), inp.value || null, h ? h.a : null);
        ritualeAbitudini(corpo);
      });
    });
    corpo.querySelectorAll('[data-aba]').forEach(function (inp) {
      inp.addEventListener('change', function () {
        var h = LM.load().abitudini.find(function (x) { return x.id === inp.getAttribute('data-aba'); });
        LM.impostaPeriodoAbitudine(inp.getAttribute('data-aba'), h ? h.da : null, inp.value || null);
        ritualeAbitudini(corpo);
      });
    });
    corpo.querySelectorAll('[data-abnofine]').forEach(function (b) {
      b.addEventListener('click', function () {
        var h = LM.load().abitudini.find(function (x) { return x.id === b.getAttribute('data-abnofine'); });
        LM.impostaPeriodoAbitudine(b.getAttribute('data-abnofine'), h ? h.da : null, null);
        ritualeAbitudini(corpo);
      });
    });
    corpo.querySelectorAll('[data-abnome]').forEach(function (inp) {
      inp.addEventListener('change', function () { LM.modificaAbitudine(inp.getAttribute('data-abnome'), { testo: inp.value.trim() }); });
    });
    corpo.querySelectorAll('[data-abrow]').forEach(function (row) {
      row.querySelectorAll('.giorno-chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          chip.classList.toggle('sel');
          LM.modificaAbitudine(row.getAttribute('data-abrow'), { giorni: leggiGiorni(row) });
          row.querySelector('.abit-giorni-rec').textContent = riepilogoGiorni(leggiGiorni(row));
        });
      });
    });
    var nuova = document.getElementById('abit-giorni-nuova');
    nuova.querySelectorAll('.giorno-chip').forEach(function (chip) {
      chip.addEventListener('click', function () { chip.classList.toggle('sel'); });
    });
    document.getElementById('abit-nuova').addEventListener('submit', function (e) {
      e.preventDefault();
      var testo = document.getElementById('abit-testo').value.trim();
      if (!testo) return;
      LM.aggiungiAbitudine(testo, document.getElementById('abit-area').value, leggiGiorni(nuova));
      ritualeAbitudini(corpo);
      toast('Abitudine creata.', 0, 'refresh');
    });
  }

  /* Ancore comportamentali (BARS) per ogni punto della scala: descrivere
     concretamente ogni livello riduce la tendenza a rifugiarsi nel "3".
     Il riferimento "il tuo solito" (media recente) dà un punto d'appoggio
     a chi si sente sempre nella media. */
  var ANCORE = {
    energia: ['esausto', 'fiacco', 'normale', 'carico', 'pieno'],
    focus: ['disperso', 'a fatica', 'normale', 'lucido', 'concentratissimo'],
    umore: ['giù', 'così così', 'normale', 'bene', 'alla grande']
  };

  function ritualeCheckin(corpo) {
    var voti = { energia: 0, focus: 0, umore: 0 };
    corpo.innerHTML = '<div class="card">' +
      testaRituale('bolt', 'Come stai adesso',
        'Tre tocchi, a istinto. Rispondi com’è la giornata per te adesso, senza pensarci troppo. Ti serve a vedere come cambi nei giorni, un numero da solo non dice molto.') +
      scala('energia', 'bolt', 'Quanta energia hai?') +
      scala('focus', 'target', 'Quanto riesci a concentrarti?') +
      scala('umore', 'smile', 'Come ti senti?') +
      '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="btn-salva-checkin" disabled>Registra <small>+' + LM.XP_EVENTI.checkin + ' XP</small></button></div>' +
      '</div><div class="card mt"><h2>' + ICO('trendUp', 16) + ' Andamento degli ultimi 14 giorni</h2><div id="mini-trend"></div></div>';

    function scala(campo, icona, nome) {
      var base = LM.baselineCheckin(campo, 30);
      var anc = ANCORE[campo];
      return '<div class="scala-blocco"><label class="campo">' + ICO(icona, 13) + ' ' + nome + '</label>' +
        '<div class="scala" data-campo="' + campo + '">' +
        [1, 2, 3, 4, 5].map(function (v) {
          return '<button data-v="' + v + '" aria-label="' + v + ', ' + anc[v - 1] + '">' + v + '</button>';
        }).join('') + '</div>' +
        '<div class="scala-legenda"><span>1 · ' + anc[0] + '</span><span>3 · ' + anc[2] + '</span><span>5 · ' + anc[4] + '</span></div>' +
        (base ? '<div class="scala-solito">' + ICO('trendUp', 12) + ' Di solito qui stai intorno a <b>' + base.toFixed(1) + '</b>. Parti da lì: oggi sei sopra o sotto?</div>' : '') +
        '</div>';
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
        'Due minuti per chiudere la giornata. Vota le aree su cui hai lavorato, scrivi una cosa andata bene e un ostacolo. Poi è <b>finita</b>: puoi staccare.') +
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
        'Dieci minuti per guardare la settimana da fuori e portarti dietro una cosa utile per quella che arriva. Niente pagelle: serve solo a te.') +
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
     VISTA: ATTIVITÀ (cattura da smistare + backlog per area)
     ============================================================ */

  var backlogAperte = {};
  var backlogEditId = null;
  var progettiAperti = {};
  var attTab = null;      // 'sistemare' | 'dafare' | 'arrivo' | 'progetti'
  var attTabMostrata = ''; // per animare solo al cambio di scheda
  var attArea = 'tutte';  // filtro area nel tab "Da fare"
  var attQuery = '';      // ricerca testo

  function vistaInbox() {
    var s = LM.load();
    var nInbox = s.inbox.length;
    var nProg = s.backlog.filter(function (b) { return b.steps && b.steps.length; }).length;
    var nArrivo = LM.scadenzeVicine(14).length;
    if (!attTab || (attTab === 'sistemare' && !nInbox)) attTab = nInbox ? 'sistemare' : 'dafare';

    var html = topbar('Attività', 'Butta giù tutto. Poi decidi con calma: oggi, più avanti, o lascia perdere.',
      '<span class="chip">' + ICO('lista', 14) + ' <b>' + s.backlog.length + '</b>&nbsp;da fare</span>');
    function tb(id, ico, et, n) {
      return '<button data-att="' + id + '" class="' + (attTab === id ? 'attivo' : '') + '">' + ICO(ico, 15) + et + (n ? ' <span class="att-badge">' + n + '</span>' : '') + '</button>';
    }
    html += '<div class="segmenti sez-nav att-tabs" id="att-tabs">' +
      tb('sistemare', 'inbox', 'Da sistemare', nInbox) + tb('dafare', 'lista', 'Da fare', s.backlog.length) +
      tb('arrivo', 'calendar', 'In arrivo', nArrivo) + tb('progetti', 'rocket', 'Progetti', nProg) + '</div>' +
      '<div id="att-corpo"></div>';
    $vista.innerHTML = html;
    document.getElementById('att-tabs').querySelectorAll('[data-att]').forEach(function (b) {
      b.addEventListener('click', function () {
        attTab = b.getAttribute('data-att');
        document.getElementById('att-tabs').querySelectorAll('[data-att]').forEach(function (x) { x.classList.toggle('attivo', x.getAttribute('data-att') === attTab); });
        ridisegna();
      });
    });
    ridisegna();

    function ridisegna() {
      var c = document.getElementById('att-corpo');
      var cambio = attTab !== attTabMostrata;
      var scrollPrima = cambio ? 0 : (window.scrollY || document.documentElement.scrollTop || 0);
      if (attTab === 'sistemare') disegnaSmista(c);
      else if (attTab === 'dafare') disegnaDaFare(c);
      else if (attTab === 'arrivo') disegnaArrivo(c);
      else disegnaProgetti(c);
      attTabMostrata = attTab;
      if (cambio) animaIngresso(c);
      else if (scrollPrima) window.scrollTo(0, scrollPrima);
    }

    /* --- In arrivo: attività con una data vicina o già passata --- */
    function disegnaArrivo(box) {
      var vic = LM.scadenzeVicine(60);
      if (!vic.length) {
        box.innerHTML = '<div class="card"><div class="vuoto" style="padding:22px 8px">' + ICO('calendar', 28) + '<br><b>Niente con una data, per ora.</b><br>Dai una scadenza a una cosa «Da fare» e comparirà qui, con il conto alla rovescia.</div></div>';
        return;
      }
      box.innerHTML = '<div class="card"><div class="sotto" style="margin-top:0">Cose da fare con una data, dalla più vicina. Tirale in «Oggi» prima che diventino una corsa.</div>' +
        '<div class="scad-lista">' + vic.map(function (b) {
          var ar = areaById(b.areaId); var si = scadInfo(b.scadenza);
          /* stessa grammatica delle altre schede: azione principale + «⋯»,
             così da qui si può anche pianificare, rinominare o rimuovere */
          return '<div class="scad-riga"><span class="scad-badge ' + si.cls + '">' + si.testo + '</span>' +
            '<span class="scad-testo">' + esc(b.testo) + '</span>' +
            '<span class="tag-area" style="--c-area:' + LM.coloreArea(ar) + '" title="' + esc(ar.nome) + '">' + ICO(ar.icona, 13) + '</span>' +
            '<button class="btn btn-mini btn-primario" data-scadoggi="' + b.id + '">' + ICO('arrowRight', 12) + ' Oggi</button>' +
            '<button class="icona-btn" data-bkmenu="' + b.id + '" title="Altro" aria-label="Altro">' + ICO('dots', 16) + '</button></div>';
        }).join('') + '</div></div>';
      box.querySelectorAll('[data-scadoggi]').forEach(function (b) {
        b.addEventListener('click', function () { LM.backlogInOggi(b.getAttribute('data-scadoggi')); toast('Portato tra le azioni di oggi.', 0, 'arrowRight'); ridisegna(); aggiornaNav(); });
      });
      wireBk(box);
    }

    /* --- Da sistemare: le catture grezze --- */
    function disegnaSmista(box) {
      var st = LM.load();
      if (!st.inbox.length) {
        box.innerHTML = '<div class="card"><div class="vuoto" style="padding:22px 8px">' + illoInbox() + '<b>Non c’è niente da sistemare.</b><br>Premi <kbd>C</kbd> per buttare giù un pensiero: lo ritrovi qui e decidi con calma.</div></div>';
        return;
      }
      box.innerHTML = '<div class="card"><div class="sotto" style="margin-top:0">Le cose che hai buttato giù. Per ognuna scegli: <b>Oggi</b> se la fai oggi, <b>Da fare</b> se la rimandi, <b>Scarta</b> se lasci perdere.</div>' +
        '<div class="griglia" id="lista-inbox" style="gap:9px"></div></div>';
      var lista = document.getElementById('lista-inbox');
      lista.innerHTML = st.inbox.map(function (el, i) {
        var quando = new Date(el.creata).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
        var inMod = el.id === inboxEditId;
        var contenuto = inMod
          ? '<form class="inbox-modifica" data-edit="' + el.id + '"><input type="text" class="inbox-input" value="' + esc(el.testo) + '" aria-label="Modifica il testo">' +
            '<button class="btn btn-mini btn-primario" type="submit">' + ICO('save', 13) + ' Salva</button>' +
            '<button class="btn btn-mini btn-ghost" type="button" data-annulla="1">Annulla</button></form>'
          : '<div class="inbox-testo-riga"><div class="testo">' + esc(el.testo) + '</div>' +
            '<button class="inbox-edit" data-modifica="' + el.id + '" title="Modifica" aria-label="Modifica">' + ICO('pencil', 14) + '</button></div>' +
            '<div class="quando">' + quando + '</div>' +
            '<div class="azioni-riga mt-s">' +
            '<span style="min-width:0;flex:1 1 150px">' + selectAree('sel-' + el.id) + '</span>' +
            '<button class="btn btn-mini btn-primario" data-fai="azione">' + ICO('arrowRight', 13) + ' Oggi</button>' +
            '<button class="btn btn-mini" data-fai="backlog">' + ICO('lista', 13) + ' Da fare</button>' +
            '<button class="btn btn-mini btn-ghost" data-fai="scarta">' + ICO('trash', 13) + ' Scarta</button></div>';
        return '<div class="riga-inbox" data-id="' + el.id + '" style="--i:' + i + '"><div style="flex:1;min-width:0">' + contenuto + '</div></div>';
      }).join('');

      lista.querySelectorAll('.riga-inbox').forEach(function (riga) {
        var id = riga.getAttribute('data-id');
        riga.querySelectorAll('[data-fai]').forEach(function (b) {
          b.addEventListener('click', function () {
            var esito = b.getAttribute('data-fai');
            var area = document.getElementById('sel-' + id).value;
            LM.triageInbox(id, esito, area);
            toast(esito === 'azione' ? 'Ora è tra le cose di oggi.' : esito === 'backlog' ? 'Messo tra le cose da fare.' : 'Scartato.', LM.XP_EVENTI.triage,
              esito === 'azione' ? 'arrowRight' : esito === 'backlog' ? 'lista' : 'trash');
            aggiornaNav(); ridisegna();
          });
        });
        var edit = riga.querySelector('[data-modifica]');
        if (edit) edit.addEventListener('click', function () { inboxEditId = id; ridisegna(); });
        var form = riga.querySelector('[data-edit]');
        if (form) {
          var input = form.querySelector('.inbox-input');
          setTimeout(function () { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }, 20);
          form.addEventListener('submit', function (e) { e.preventDefault(); var v = input.value.trim(); if (v) LM.modificaInbox(id, v); inboxEditId = null; ridisegna(); toast('Nota aggiornata.', 0, 'save'); });
          form.querySelector('[data-annulla]').addEventListener('click', function () { inboxEditId = null; ridisegna(); });
          input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { inboxEditId = null; ridisegna(); } });
        }
      });
    }

    /* Menu "⋯" di una cosa da fare: le azioni poco frequenti (scadenza, area,
       passi, rinomina, rimuovi) tolte dalla riga per non affollarla. */
    function apriBkMenu(b) {
      var isProg = b.steps && b.steps.length;
      var oggi = LM.todayKey();
      /* Tre blocchi con un compito chiaro ciascuno: QUANDO farla, ENTRO quando,
         come sistemarla. I giorni più usati sono tasti diretti: un tocco invece
         di aprire un calendario. */
      function gChip(k, et) { return '<button class="q-chip" data-quando="' + k + '">' + et + '</button>'; }
      var html = '<div class="bk-menu">' +
        '<div class="bk-sez">' +
        '<div class="bk-sez-tit">' + ICO('clock', 13) + ' ' + (isProg ? 'Quando fare il prossimo passo' : 'Quando farla') + '</div>' +
        '<div class="q-chips">' + gChip(oggi, 'Oggi') + gChip(LM.addDays(oggi, 1), 'Domani') +
        gChip(LM.addDays(oggi, 2), etichettaGiorno(LM.addDays(oggi, 2)).split(' ')[0]) +
        gChip(LM.addDays(oggi, 7), 'Tra una settimana') + '</div>' +
        '<div class="bk-menu-scad mt-s"><input type="date" id="bkm-quando" min="' + oggi + '" aria-label="Un altro giorno">' +
        '<button class="btn btn-mini" id="bkm-pianifica">Pianifica</button></div>' +
        '<div class="bk-sez-nota">Finisce tra le cose di quel giorno, in <b>La giornata</b>.</div>' +
        '</div>' +
        '<div class="bk-sez">' +
        '<div class="bk-sez-tit">' + ICO('calendar', 13) + ' Entro quando (scadenza)</div>' +
        '<div class="bk-menu-scad"><input type="date" id="bkm-scad" aria-label="Scadenza"' + (b.scadenza ? ' value="' + b.scadenza + '"' : '') + '>' +
        (b.scadenza ? '<button class="btn btn-mini btn-ghost" id="bkm-scad-x">Togli</button>' : '') + '</div>' +
        '<div class="bk-sez-nota">Solo il conto alla rovescia: non la mette in agenda.</div>' +
        '</div>' +
        (isProg ? '<div class="bk-sez">' +
          '<div class="bk-sez-tit">' + ICO('lista', 13) + ' Tutti i passi, spalmati</div>' +
          '<div class="bk-sez-nota" style="margin:0 0 9px">Un progetto non sta in un giorno solo: mette in agenda ogni passo aperto, uno per volta.</div>' +
          '<div class="q-chips">' +
          '<button class="q-chip" data-distrib="1">Uno al giorno</button>' +
          '<button class="q-chip" data-distrib="2">Uno ogni 2 giorni</button>' +
          '<button class="q-chip" data-distrib="7">Uno a settimana</button>' +
          '</div>' +
          '<div class="bk-menu-scad mt-s"><input type="date" id="bkm-dadata" min="' + oggi + '" value="' + oggi + '" aria-label="Da quale giorno">' +
          '<span class="bk-menu-eti">da qui</span></div>' +
          '</div>' : '') +
        '<div class="bk-sez">' +
        '<div class="bk-sez-tit">' + ICO('refresh', 13) + ' Se è una cosa da ripetere</div>' +
        '<div class="bk-sez-nota" style="margin:0 0 9px">Gli obiettivi che si costruiscono ripetendo (studiare, allenarsi) funzionano meglio come abitudine.</div>' +
        '<button class="btn btn-mini" id="bkm-abitudine">' + ICO('refresh', 13) + ' Trasformala in abitudine</button>' +
        '</div>' +
        '<div class="bk-sez">' +
        '<div class="bk-sez-tit">' + ICO('sparkles', 13) + ' Sistemala</div>' +
        '<div class="bk-menu-riga"><span class="bk-menu-eti">Area</span>' + selectAree('bkm-area', b.areaId) + '</div>' +
        '<div class="bk-menu-azioni">' +
        '<button class="btn btn-mini" id="bkm-steps">' + ICO('lista', 13) + ' ' + (isProg ? 'Apri i passi' : 'Dividi in passi') + '</button>' +
        '<button class="btn btn-mini" id="bkm-mod">' + ICO('pencil', 13) + ' Rinomina</button>' +
        '<button class="btn btn-mini btn-ghost imp-pericolo" id="bkm-del">' + ICO('trash', 13) + ' Rimuovi</button>' +
        '</div></div></div>';
      apriSheet(b.testo, html, function (root) {
        function pianifica(k) {
          if (!k) return;
          var fatto = isProg ? LM.prossimoPassoInOggi(b.id, k) : LM.backlogInOggi(b.id, k);
          if (!fatto) { toast('Nessun passo da pianificare: sono tutti aperti o completati.', 0, 'check'); return; }
          toast(k === LM.todayKey() ? 'Messa tra le cose di oggi.' : 'Pianificata per ' + etichettaGiorno(k).toLowerCase() + '.', 0, 'calendar');
          chiudiSheet(); aggiornaNav(); ridisegna();
        }
        root.querySelectorAll('[data-quando]').forEach(function (c) {
          c.addEventListener('click', function () { pianifica(c.getAttribute('data-quando')); });
        });
        root.querySelector('#bkm-pianifica').addEventListener('click', function () { pianifica(root.querySelector('#bkm-quando').value); });
        root.querySelector('#bkm-scad').addEventListener('change', function () { LM.impostaScadenzaBacklog(b.id, this.value || null); chiudiSheet(); ridisegna(); });
        var sx = root.querySelector('#bkm-scad-x');
        if (sx) sx.addEventListener('click', function () { LM.impostaScadenzaBacklog(b.id, null); chiudiSheet(); ridisegna(); });
        root.querySelector('#bkm-area').addEventListener('change', function () { LM.cambiaAreaBacklog(b.id, this.value); chiudiSheet(); ridisegna(); });
        root.querySelectorAll('[data-distrib]').forEach(function (c) {
          c.addEventListener('click', function () {
            var da = (root.querySelector('#bkm-dadata') || {}).value || LM.todayKey();
            var n = LM.distribuisciPassi(b.id, da, +c.getAttribute('data-distrib'));
            toast(n ? n + (n === 1 ? ' passo messo in agenda.' : ' passi messi in agenda, uno per volta.') : 'Nessun passo da distribuire: sono già in agenda o completati.', 0, n ? 'calendar' : 'check');
            chiudiSheet(); aggiornaNav(); ridisegna();
          });
        });
        root.querySelector('#bkm-abitudine').addEventListener('click', function () { apriDaAbitudine(b); });
        root.querySelector('#bkm-steps').addEventListener('click', function () { progettiAperti[b.id] = true; chiudiSheet(); ridisegna(); });
        root.querySelector('#bkm-mod').addEventListener('click', function () { backlogEditId = b.id; chiudiSheet(); ridisegna(); });
        root.querySelector('#bkm-del').addEventListener('click', function () { LM.rimuoviBacklog(b.id); chiudiSheet(); ridisegna(); });
      });
    }

    /* Da cosa-da-fare a abitudine: si scelgono i giorni e (se serve) l'ora. */
    function apriDaAbitudine(b) {
      var html = '<div class="bk-menu">' +
        '<div class="bk-sez">' +
        '<div class="bk-sez-tit">' + ICO('refresh', 13) + ' In che giorni</div>' +
        '<div class="riga-flex" id="ab-giorni">' + chipsGiorni([1, 2, 3, 4, 5, 6, 0]) + '</div>' +
        '<div class="bk-menu-riga mt-s"><span class="bk-menu-eti">Orario</span>' +
        '<input type="time" class="tl-time" id="ab-ora" aria-label="Orario"> ' +
        '<select class="tl-dur" id="ab-dur" aria-label="Durata">' + DURATE.map(function (o) { return '<option value="' + o.v + '">' + o.t + '</option>'; }).join('') + '</select></div>' +
        '<div class="bk-sez-nota">Vuoti vanno bene: l’abitudine resta senza orario fisso.</div>' +
        '</div>' +
        '<button class="btn btn-primario" id="ab-crea">' + ICO('check', 15) + ' Crea l’abitudine</button>' +
        '<div class="bk-sez-nota" style="text-align:center">Esce dalle cose da fare e la ritrovi in <b>Rituali → Abitudini</b>.</div>' +
        '</div>';
      apriSheet(b.testo, html, function (root) {
        root.querySelectorAll('#ab-giorni .giorno-chip').forEach(function (c) {
          c.addEventListener('click', function () { c.classList.toggle('sel'); });
        });
        root.querySelector('#ab-crea').addEventListener('click', function () {
          var giorni = leggiGiorni(root.querySelector('#ab-giorni'));
          var ora = root.querySelector('#ab-ora').value || null;
          var dur = root.querySelector('#ab-dur').value;
          LM.backlogInAbitudine(b.id, giorni, { ora: ora, durata: dur ? +dur : null });
          toast('Ora è un’abitudine: la trovi in Rituali.', 0, 'refresh');
          chiudiSheet(); aggiornaNav(); ridisegna();
        });
      });
    }

    /* --- HTML di un elemento "da fare" (anche progetto con passi) --- */
    function bkItemHtml(b) {
      if (b.id === backlogEditId) {
        return '<div class="bk-item"><form class="inbox-modifica" data-bkedit="' + b.id + '" style="flex:1">' +
          '<input type="text" class="inbox-input" value="' + esc(b.testo) + '" aria-label="Modifica">' +
          '<button class="btn btn-mini btn-primario" type="submit" aria-label="Salva">' + ICO('save', 13) + '</button>' +
          '<button class="btn btn-mini btn-ghost" type="button" data-bkannulla="1">Annulla</button></form></div>';
      }
      var isProg = b.steps && b.steps.length;
      var av = isProg ? LM.avanzamentoProgetto(b) : null;
      var apertoP = !!progettiAperti[b.id];
      var passi = '';
      if (apertoP) {
        passi = '<div class="steps-panel">' +
          (b.steps || []).map(function (st) {
            /* ogni passo si può mettere in un giorno preciso, uno per uno */
            var inAg = LM.snapshot().azioni.find(function (a) { return !a.done && a.passoDi && a.passoDi.b === b.id && a.passoDi.s === st.id; });
            return '<div class="step-riga' + (st.done ? ' fatta' : '') + '">' +
              '<button class="spunta-mini" data-steptoggle="' + b.id + '|' + st.id + '" aria-label="Segna passo">' + ICO('check', 12) + '</button>' +
              '<span class="step-testo">' + esc(st.testo) + '</span>' +
              (inAg ? '<button class="step-quando" data-steppulisci="' + inAg.id + '" title="Togli dal giorno">' + ICO('calendar', 10) + ' ' + esc(etichettaGiorno(inAg.data).toLowerCase()) + ' ' + ICO('x', 9) + '</button>' : '') +
              (st.done ? '' : '<label class="scad-set" title="Mettilo in un giorno">' + ICO('calendar', 13) +
                '<input type="date" data-stepdata="' + b.id + '|' + st.id + '" min="' + LM.todayKey() + '"' + (inAg ? ' value="' + inAg.data + '"' : '') + '></label>') +
              '<button class="icona-btn" data-stepdel="' + b.id + '|' + st.id + '" title="Rimuovi passo" aria-label="Rimuovi passo">' + ICO('trash', 13) + '</button></div>';
          }).join('') +
          '<form class="step-add" data-stepadd="' + b.id + '"><input type="text" placeholder="Aggiungi un passo…" aria-label="Aggiungi un passo"><button class="btn btn-mini" type="submit" aria-label="Aggiungi un passo">' + ICO('plus', 12) + '</button></form>' +
          '</div>';
      }
      /* Cosa è GIA' IN AGENDA di questa attività: senza questo, dopo aver
         pianificato qualcosa la riga sembrava identica a una mai toccata. */
      var inAgenda = LM.snapshot().azioni.filter(function (a) {
        return !a.done && a.data >= LM.todayKey() && (isProg ? (a.passoDi && a.passoDi.b === b.id) : a.passoDi === null && a.testo === b.testo);
      }).sort(function (x, y) { return x.data < y.data ? -1 : 1; });
      var badgeAgenda = inAgenda.length
        ? '<span class="bk-inagenda" title="' + esc(inAgenda.map(function (a) { return a.testo + ' — ' + etichettaGiorno(a.data); }).join('\n')) + '">' + ICO('calendar', 11) + ' ' +
          (isProg && inAgenda.length > 1 ? inAgenda.length + ' passi in agenda' : 'in agenda ' + etichettaGiorno(inAgenda[0].data).toLowerCase()) + '</span>'
        : '';
      /* Avanzamento a segmenti: con pochi passi si contano a occhio, molto più
         leggibile di una barra continua. Con tanti passi torna a barra. */
      var avanz = '';
      if (isProg) {
        if (av.tot <= 12) {
          var seg = '';
          for (var si = 0; si < av.tot; si++) seg += '<i' + (si < av.fatti ? ' class="on"' : '') + '></i>';
          avanz = '<div class="prog-riga"><span class="prog-segmenti">' + seg + '</span>' +
            '<span class="prog-eti"><b>' + av.fatti + '</b> di <b>' + av.tot + '</b> passi' + (av.fatti === av.tot ? ' · finito' : '') + '</span></div>';
        } else {
          avanz = '<div class="prog-riga"><span class="prog-barra"><span style="width:' + av.pct + '%"></span></span>' +
            '<span class="prog-eti"><b>' + av.fatti + '</b> di <b>' + av.tot + '</b> passi</span></div>';
        }
      }
      return '<div class="bk-item' + (isProg ? ' progetto' : '') + '" data-bid="' + b.id + '">' +
        '<div class="bk-item-riga">' +
        '<div class="bk-item-corpo">' +
        '<div class="bk-item-testo">' + esc(b.testo) + '</div>' +
        ((b.scadenza || badgeAgenda || isProg) ? '<div class="bk-item-meta">' +
          (b.scadenza ? '<span class="scad-badge ' + scadInfo(b.scadenza).cls + '">' + ICO('calendar', 10) + ' entro ' + scadInfo(b.scadenza).testo + '</span>' : '') +
          badgeAgenda + '</div>' : '') +
        avanz +
        '</div>' +
        /* una sola azione in evidenza (Oggi / Passo). Tutto il resto sta dietro
           «⋯». I pulsanti non vanno mai a capo: il testo si accorcia, loro no. */
        '<div class="bk-item-azioni">' +
        (isProg
          ? '<button class="btn btn-mini btn-primario" data-bkpasso="' + b.id + '" title="Porta in Oggi il prossimo passo">' + ICO('arrowRight', 13) + ' Passo</button>' +
            '<button class="icona-btn' + (apertoP ? ' on' : '') + '" data-bksteps="' + b.id + '" title="Passi del progetto" aria-label="Passi del progetto">' + ICO('lista', 14) + '</button>'
          : '<button class="btn btn-mini btn-primario" data-bkoggi="' + b.id + '">' + ICO('arrowRight', 13) + ' Oggi</button>') +
        '<button class="icona-btn" data-bkmenu="' + b.id + '" title="Altro" aria-label="Altro">' + ICO('dots', 16) + '</button>' +
        '</div></div>' +
        passi + '</div>';
    }

    /* --- collega gli eventi degli elementi "da fare" dentro `scope` --- */
    function wireBk(scope) {
      scope.querySelectorAll('[data-bkoggi]').forEach(function (b) {
        b.addEventListener('click', function () { LM.backlogInOggi(b.getAttribute('data-bkoggi')); toast('Portato tra le azioni di oggi.', 0, 'arrowRight'); aggiornaNav(); ridisegna(); });
      });
      scope.querySelectorAll('[data-bkdel]').forEach(function (b) {
        b.addEventListener('click', function () { LM.rimuoviBacklog(b.getAttribute('data-bkdel')); ridisegna(); });
      });
      scope.querySelectorAll('[data-bkmod]').forEach(function (b) {
        b.addEventListener('click', function () { backlogEditId = b.getAttribute('data-bkmod'); ridisegna(); });
      });
      scope.querySelectorAll('[data-bkedit]').forEach(function (form) {
        var input = form.querySelector('.inbox-input');
        setTimeout(function () { if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); } }, 20);
        form.addEventListener('submit', function (e) { e.preventDefault(); var v = input.value.trim(); if (v) LM.modificaBacklog(form.getAttribute('data-bkedit'), v); backlogEditId = null; ridisegna(); });
        form.querySelector('[data-bkannulla]').addEventListener('click', function () { backlogEditId = null; ridisegna(); });
      });
      scope.querySelectorAll('select[data-bk-area]').forEach(function (sel) {
        sel.addEventListener('change', function () { LM.cambiaAreaBacklog(sel.getAttribute('data-bk-area'), sel.value); ridisegna(); });
      });
      scope.querySelectorAll('[data-scaddate]').forEach(function (inp) {
        inp.addEventListener('change', function () { LM.impostaScadenzaBacklog(inp.getAttribute('data-scaddate'), inp.value || null); ridisegna(); });
      });
      scope.querySelectorAll('[data-bkmenu]').forEach(function (b) {
        b.addEventListener('click', function () {
          var it = LM.load().backlog.find(function (x) { return x.id === b.getAttribute('data-bkmenu'); });
          if (it) apriBkMenu(it);
        });
      });
      scope.querySelectorAll('[data-bksteps]').forEach(function (b) {
        b.addEventListener('click', function () { var id = b.getAttribute('data-bksteps'); progettiAperti[id] = !progettiAperti[id]; ridisegna(); });
      });
      scope.querySelectorAll('[data-bkpasso]').forEach(function (b) {
        b.addEventListener('click', function () {
          var passo = LM.prossimoPassoInOggi(b.getAttribute('data-bkpasso'));
          toast(passo ? 'Prossimo passo portato in Oggi.' : 'Nessun passo da fare: sono tutti aperti o completati.', 0, passo ? 'arrowRight' : 'check');
          aggiornaNav(); ridisegna();
        });
      });
      scope.querySelectorAll('[data-steptoggle]').forEach(function (b) {
        b.addEventListener('click', function () { var p = b.getAttribute('data-steptoggle').split('|'); LM.togglePasso(p[0], p[1]); ridisegna(); });
      });
      scope.querySelectorAll('[data-steppulisci]').forEach(function (b) {
        b.addEventListener('click', function () {
          LM.azioneInBacklog(b.getAttribute('data-steppulisci'));
          toast('Passo tolto dal giorno.', 0, 'lista');
          aggiornaNav(); ridisegna();
        });
      });
      scope.querySelectorAll('[data-stepdata]').forEach(function (inp) {
        inp.addEventListener('change', function () {
          var pz = inp.getAttribute('data-stepdata').split('|');
          if (!inp.value) return;
          var az = LM.pianificaPasso(pz[0], pz[1], inp.value);
          toast(az ? 'Passo messo ' + etichettaGiorno(inp.value).toLowerCase() + '.' : 'Non riesco a metterlo in agenda.', 0, 'calendar');
          aggiornaNav(); ridisegna();
        });
      });
      scope.querySelectorAll('[data-stepdel]').forEach(function (b) {
        b.addEventListener('click', function () { var p = b.getAttribute('data-stepdel').split('|'); LM.rimuoviPasso(p[0], p[1]); ridisegna(); });
      });
      scope.querySelectorAll('[data-stepadd]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var bid = form.getAttribute('data-stepadd');
          var input = form.querySelector('input'); var v = input.value.trim();
          if (!v) return;
          LM.aggiungiPasso(bid, v); progettiAperti[bid] = true; ridisegna();
        });
      });
    }

    /* collega i form "aggiungi una cosa da fare" dentro `scope` */
    function wireAdd(scope) {
      scope.querySelectorAll('[data-addarea]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var input = form.querySelector('input'); var v = input.value.trim();
          if (!v) return;
          var area = form.getAttribute('data-addarea');
          LM.aggiungiBacklog(v, area); backlogAperte[area] = true; ridisegna();
        });
      });
    }

    /* --- Da fare: chip per area + ricerca + lista --- */
    function disegnaDaFare(box) {
      var perArea = LM.backlogPerArea();
      var totale = perArea.reduce(function (n, g) { return n + g.items.length; }, 0);
      if (!totale) {
        box.innerHTML = '<div class="card"><div class="vuoto" style="padding:22px 8px">' + illoInbox() + '<b>Niente da fare, per ora.</b><br>Aggiungi qui sotto, oppure sistema ciò che hai buttato giù.</div>' +
          '<form class="bk-add" data-addarea="altro" style="max-width:520px;margin:0 auto"><input type="text" placeholder="Aggiungi una cosa da fare…" aria-label="Aggiungi"><button class="btn btn-mini btn-primario" type="submit" aria-label="Aggiungi">' + ICO('plus', 13) + '</button></form></div>';
        wireAdd(box); return;
      }
      var chips = '<button class="att-chip' + (attArea === 'tutte' ? ' on' : '') + '" data-chip="tutte">Tutte <span>' + totale + '</span></button>' +
        perArea.map(function (g) {
          return '<button class="att-chip' + (attArea === g.area.id ? ' on' : '') + '" data-chip="' + g.area.id + '" style="--c-area:' + LM.coloreArea(g.area) + '">' + ICO(g.area.icona, 13) + ' ' + esc(g.area.nome) + ' <span>' + g.items.length + '</span></button>';
        }).join('');
      box.innerHTML = '<div class="card"><div class="att-cerca">' + ICO('target', 14) + '<input type="text" id="att-q" placeholder="Cerca tra le cose da fare…" value="' + esc(attQuery) + '" aria-label="Cerca"></div>' +
        '<div class="att-chips">' + chips + '</div>' +
        '<div id="dafare-lista"></div></div>';
      var q = box.querySelector('#att-q');
      q.addEventListener('input', function () { attQuery = q.value; renderLista(); });
      box.querySelectorAll('[data-chip]').forEach(function (b) {
        b.addEventListener('click', function () { attArea = b.getAttribute('data-chip'); box.querySelectorAll('[data-chip]').forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-chip') === attArea); }); renderLista(); });
      });
      renderLista();

      function renderLista() {
        var lista = box.querySelector('#dafare-lista');
        var query = attQuery.trim().toLowerCase();
        if (query) {
          var ris = LM.load().backlog.filter(function (b) { return b.testo.toLowerCase().indexOf(query) >= 0; });
          lista.innerHTML = '<div class="sotto">' + ris.length + (ris.length === 1 ? ' risultato' : ' risultati') + ' per «' + esc(attQuery.trim()) + '»</div>' +
            '<div class="backlog-piatto">' + (ris.map(bkItemHtml).join('') || '<div class="bk-vuoto">Nessuna corrispondenza.</div>') + '</div>';
          wireBk(lista); return;
        }
        if (attArea !== 'tutte') {
          var g0 = perArea.find(function (g) { return g.area.id === attArea; }) || { area: areaById(attArea), items: [] };
          lista.innerHTML = '<div class="backlog-piatto">' + (g0.items.map(bkItemHtml).join('') || '<div class="bk-vuoto">Niente in «' + esc(g0.area.nome) + '». Aggiungi qui sotto.</div>') + '</div>' +
            '<form class="bk-add" data-addarea="' + attArea + '"><input type="text" placeholder="Aggiungi a «' + esc(g0.area.nome) + '»…" aria-label="Aggiungi"><button class="btn btn-mini btn-primario" type="submit" aria-label="Aggiungi">' + ICO('plus', 13) + '</button></form>';
          wireBk(lista); wireAdd(lista); return;
        }
        /* Le aree con qualcosa dentro sono APERTE da sola: prima si arrivava su
           una pagina di cassetti chiusi, senza vedere nemmeno un'attività.
           Quelle vuote non si elencano (si raggiungono dai chip sopra). */
        var conRoba = perArea.filter(function (g) { return g.items.length; });
        var vuote = perArea.length - conRoba.length;
        lista.innerHTML = '<div class="backlog-aree">' + conRoba.map(function (g) {
          var aperta = backlogAperte[g.area.id] === undefined ? true : !!backlogAperte[g.area.id];
          return '<div class="bk-area" style="--c-area:' + LM.coloreArea(g.area) + '">' +
            '<button class="bk-testa" data-toggle="' + g.area.id + '" aria-expanded="' + aperta + '">' +
            '<span class="icona-area">' + ICO(g.area.icona, 15) + '</span>' +
            '<span class="bk-nome">' + esc(g.area.nome) + '</span>' +
            '<span class="bk-conta">' + g.items.length + '</span>' +
            '<span class="bk-chevron' + (aperta ? ' aperta' : '') + '">' + ICO('chevronGiu', 16) + '</span></button>' +
            '<div class="bk-corpo"' + (aperta ? '' : ' hidden') + '>' +
            (g.items.length ? g.items.map(bkItemHtml).join('') : '<div class="bk-vuoto">Niente qui.</div>') +
            '<form class="bk-add" data-addarea="' + g.area.id + '"><input type="text" placeholder="Aggiungi a «' + esc(g.area.nome) + '»…" aria-label="Aggiungi"><button class="btn btn-mini" type="submit" aria-label="Aggiungi">' + ICO('plus', 13) + '</button></form>' +
            '</div></div>';
        }).join('') + '</div>' +
          (vuote ? '<div class="sotto" style="margin:12px 0 0">' + (vuote === 1 ? 'Un’altra area è vuota' : vuote + ' altre aree sono vuote') + ': usa i tasti qui sopra per aprirle e aggiungerci qualcosa.</div>' : '');
        /* aprire/chiudere un'area mostra o nasconde SOLO quel pezzo: niente
           ricostruzione della lista, così il resto non si muove di un pixel */
        lista.querySelectorAll('[data-toggle]').forEach(function (b) {
          b.addEventListener('click', function () {
            var id = b.getAttribute('data-toggle');
            var aperta = !backlogAperte[id];
            backlogAperte[id] = aperta;
            var corpo = b.parentNode.querySelector('.bk-corpo');
            if (corpo) corpo.hidden = !aperta;
            b.setAttribute('aria-expanded', aperta);
            var chev = b.querySelector('.bk-chevron');
            if (chev) chev.classList.toggle('aperta', aperta);
          });
        });
        wireBk(lista); wireAdd(lista);
      }
    }

    /* --- Progetti: cose da fare divise in passi --- */
    function disegnaProgetti(box) {
      var prog = LM.load().backlog.filter(function (b) { return (b.steps && b.steps.length) || progettiAperti[b.id]; });
      prog.forEach(function (b) { if (progettiAperti[b.id] === undefined) progettiAperti[b.id] = true; });
      var lista = prog.length ? '<div class="backlog-piatto">' + prog.map(bkItemHtml).join('') + '</div>'
        : '<div class="vuoto" style="padding:20px 8px">' + illoInbox() + '<b>Nessun progetto, per ora.</b><br>Un progetto è una cosa grande divisa in passi: la fai un pezzo per volta.</div>';
      box.innerHTML = '<div class="card"><div class="sotto" style="margin-top:0">Le cose grandi, spezzate in <b>passi</b>. Il pulsante «Passo» porta in Oggi solo il prossimo, così parti senza sentirti sopraffatto.</div>' +
        lista +
        '<form class="bk-add mt" id="nuovo-prog"><input type="text" placeholder="Nuovo progetto…" aria-label="Nuovo progetto"><span style="width:150px">' + selectAree('prog-area') + '</span><button class="btn btn-mini btn-primario" type="submit">' + ICO('plus', 13) + ' Crea</button></form></div>';
      wireBk(box);
      box.querySelector('#nuovo-prog').addEventListener('submit', function (e) {
        e.preventDefault();
        var inp = box.querySelector('#nuovo-prog input'); var v = inp.value.trim();
        if (!v) return;
        var nb = LM.aggiungiBacklog(v, box.querySelector('#prog-area').value);
        progettiAperti[nb.id] = true; ridisegna();
      });
    }
  }

  function selectBacklogArea(id, areaId) {
    return '<select class="sel-area-azione mini" data-bk-area="' + id + '" title="Cambia area" aria-label="Cambia area">' +
      areeAttive().map(function (a) { return '<option value="' + a.id + '"' + (a.id === areaId ? ' selected' : '') + '>' + esc(a.nome) + '</option>'; }).join('') + '</select>';
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
      card.innerHTML = '<div class="exp-testa"><h2>' + esc(e.nome) + '</h2>' +
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
    },
    {
      titolo: 'Un posto per le cose da fare',
      evidenza: 'media',
      claim: 'Le intenzioni non ancora completate restano attive nella mente e disturbano finché non hanno un posto affidabile dove stare. Un elenco esterno, diviso per area, chiude questi «cerchi aperti» e libera attenzione, senza costringere a decidere subito.',
      uso: 'La vista Attività separa la cattura grezza dalle cose «Da fare» divise per area: da lì porti in «Oggi» poche cose per volta, così l’inbox non diventa una lista infinita e ansiogena.',
      fonti: 'Masicampo & Baumeister (2011), JPSP — fare un piano concreto attenua l’effetto Zeigarnik dei compiti aperti · Risko & Gilbert (2016), Trends in Cognitive Sciences — cognitive offloading.'
    },
    {
      titolo: 'Scala ancorata e riferita a te',
      evidenza: 'media',
      claim: 'Dare a ogni punto della scala una descrizione concreta, e valutare rispetto al proprio «solito» invece che in assoluto, riduce la tendenza a scegliere sempre il valore centrale e rende le misure ripetute più affidabili.',
      uso: 'Il check-in mostra un’etichetta per ogni valore (es. energia: esausto → pieno) e «il tuo solito» (la tua media recente) come riferimento. Conta la coerenza nel tempo, non la precisione del singolo numero.',
      fonti: 'Smith & Kendall (1963), J. of Applied Psychology — behaviorally anchored rating scales · Shiffman, Stone & Hufford (2008), Annual Review of Clinical Psychology — ecological momentary assessment.'
    },
    {
      titolo: 'Categorie tue (autonomia)',
      evidenza: 'media',
      claim: 'Poter definire e nominare le proprie categorie aumenta il senso di controllo e la voglia di usare lo strumento: le cose «tue» ricevono più attenzione di quelle imposte dall’alto.',
      uso: 'Le aree si rinominano, si creano e si rimuovono (per esempio i tuoi progetti). Colori, grafici e liste si adattano di conseguenza.',
      fonti: 'Deci & Ryan (2000), Psychological Inquiry — self-determination theory: l’autonomia sostiene la motivazione intrinseca · Patall, Cooper & Robinson (2008), Psychological Bulletin — la possibilità di scelta aumenta motivazione e impegno.'
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

  /* L'animazione d'ingresso serve quando CAMBI pagina, non ogni volta che
     spunti qualcosa: se la si riavvia a ogni ridisegno tutto sembra
     "sfarfallare" e sparire/riapparire. Qui la si concede solo alla vera
     navigazione, e si conserva la posizione di scorrimento quando la pagina
     è la stessa — così gli elementi restano fermi sotto il dito. */
  var vistaMostrata = '';
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
    var v = vistaCorrente();
    var cambioPagina = v !== vistaMostrata;
    var scrollPrima = cambioPagina ? 0 : (window.scrollY || document.documentElement.scrollTop || 0);
    if (v === 'oggi') vistaFocus();
    else if (v === 'giornata') vistaGiornata();
    else if (v === 'plancia') vistaPlancia();
    else if (v === 'rituali') vistaRituali();
    else if (v === 'inbox') vistaInbox();
    else if (v === 'esperimenti') vistaEsperimenti();
    else if (v === 'scienza') vistaScienza();
    $vista.classList.toggle('vista-oggi', v === 'oggi');
    vistaMostrata = v;
    if (cambioPagina) { animaIngresso($vista); window.scrollTo(0, 0); }
    else if (scrollPrima) window.scrollTo(0, scrollPrima);
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

  /* cambio area di un'azione (da Focus o dal Diario), anche a distanza
     di tempo — listener delegato unico */
  document.addEventListener('change', function (e) {
    var sel = e.target;
    if (sel && sel.matches && sel.matches('select[data-azione-area]')) {
      LM.cambiaAreaAzione(sel.getAttribute('data-azione-area'), sel.value);
      toast('Area aggiornata.', 0, 'check');
      render();
    }
  });

  /* stato del salvataggio cloud: aggiorna il footer senza ridisegnare la
     vista (non disturba ciò che stai facendo) e segnala gli errori una volta */
  var ultimoErroreSync = '';
  window.addEventListener('lm:sync', function (e) {
    var fondo = document.getElementById('sidebar-fondo');
    if (fondo && (window.LM_AUTH || {}).user) { fondo.innerHTML = footerSidebar(); wireFooterSidebar(); }
    var y = (e && e.detail) || window.LM_SYNC || {};
    if (y.state === 'error' && y.error && y.error !== ultimoErroreSync) {
      ultimoErroreSync = y.error;
      toast(y.error, 0, 'cloud');
    }
    if (y.state === 'saved') ultimoErroreSync = '';
  });

  /* Esc chiude il pannello se aperto */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !$sheet.hidden) chiudiSheet();
  });

  /* il salvataggio locale non funziona: meglio dirlo subito e chiaramente,
     così puoi esportare i dati prima di perderli */
  document.addEventListener('lm:errore-salvataggio', function () {
    toast('Non riesco a salvare su questo dispositivo (spazio esaurito o navigazione privata). Esporta i dati da Impostazioni per non perderli.', 0, 'cloud');
  });

  /* chrome statico */
  document.getElementById('logo-blocco').innerHTML = LOGO(30) + ' LifeMax <span class="logo-tag">Beta</span>';

  /* OROLOGIO VIVO: ogni 15s aggiorna la barra della giornata e la linea
     "adesso", così vedi che ora è e in che punto del piano sei senza dover
     ricaricare. Se cambia la cosa da fare in questo momento (e non l'hai
     scelta tu), la schermata Oggi si aggiorna da sola. */
  function battito() {
    var ob = document.getElementById('onboarding-root');
    if (ob && ob.innerHTML) return;
    var v = vistaCorrente();
    if (v === 'oggi') {
      montaOggiGiornata(); // la barra si muove sempre
      var occupato = staDigitando() || !$sheet.hidden || timer.fine || fuocoScelto;
      if (occupato) return;
      var a = LM.azioneAdesso();
      var key = (a.azione ? a.azione.id : '') + '|' + a.stato;
      if (key !== ultimoFuocoKey) render(); // la cosa da fare adesso è cambiata
    } else if (v === 'giornata') {
      if ($sheet.hidden && !staDigitando()) aggiornaLineaGriglia();
    }
  }
  /* a schermo spento o in un'altra scheda non serve battere (batteria); al
     ritorno si riallinea subito, senza aspettare il prossimo giro. */
  var battitoTimer = null;
  function avviaBattito() {
    if (battitoTimer) return;
    battitoTimer = setInterval(battito, 15000);
  }
  function fermaBattito() { if (battitoTimer) { clearInterval(battitoTimer); battitoTimer = null; } }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) fermaBattito();
    else { battito(); avviaBattito(); }
  });
  avviaBattito();

  applicaTema();
  render();
})();
