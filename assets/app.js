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
  /* La barra a tre porte si può spegnere: chi la vuole com'era prima
     ritrova le otto voci, e nessuna schermata sparisce in nessuno dei due
     casi — cambia solo da dove ci si arriva. */
  function setNav(v) {
    var s = LM.load();
    if ((s.profilo.nav || 'tre') === v) return;
    s.profilo.nav = v;
    LM.registra('impostazioni', 'Navigazione impostata su ' + (v === 'tutte' ? 'tutte le pagine' : 'tre porte'), false);
    LM.save(); render();
  }
  function caricaDemo() {
    avviso({
      titolo: 'Sostituire i dati con quelli di esempio?',
      testo: 'Al posto dei tuoi dati vengono caricate otto settimane di esempio. Quelli di adesso restano in un backup, che trovi nelle impostazioni.',
      azione: 'Carica l’esempio'
    }, function () {
      LM.seedDemo(); applicaTema(); chiudiSheet(); render();
      toast('Dati di esempio caricati.', 0, 'refresh');
    });
  }
  function azzeraTutto() {
    avviso({
      titolo: 'Cancellare tutti i dati?',
      testo: 'Riparti da zero. I dati stanno soltanto su questo browser: una volta cancellati non tornano indietro.',
      azione: 'Cancella tutto', pericolo: true
    }, function () {
      LM.reset(); chiudiSheet(); location.hash = '#/oggi'; render();
    });
  }

  /* ---------- campi di testo ----------
     Su un telefono la tastiera cambia a seconda di cosa le si dice: il
     tasto Invio diventa «fine» invece di «vai a capo», la prima lettera si
     scrive maiuscola, il correttore si accende. Sono attributi, non
     comportamenti: metterli a mano su ogni campo significa dimenticarne
     metà, quindi li mette una volta sola chi guarda il DOM. */
  function preparaCampi(radice) {
    if (!radice || !radice.querySelectorAll) return;
    var campi = [].slice.call(radice.querySelectorAll('input[type="text"], input:not([type]), textarea'));
    if (radice.matches && radice.matches('input, textarea')) campi.push(radice);
    campi.forEach(function (c) {
      var area = c.tagName === 'TEXTAREA';
      if (!c.hasAttribute('enterkeyhint')) c.setAttribute('enterkeyhint', area ? 'enter' : 'done');
      if (!c.hasAttribute('autocapitalize')) c.setAttribute('autocapitalize', 'sentences');
      if (!c.hasAttribute('autocorrect')) c.setAttribute('autocorrect', 'on');
    });
  }
  if (window.MutationObserver) {
    var osservatore = new MutationObserver(function (mut) {
      mut.forEach(function (m) {
        [].slice.call(m.addedNodes).forEach(function (n) { if (n.nodeType === 1) preparaCampi(n); });
      });
    });
    ['vista', 'sheet-corpo', 'onboarding-root'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) osservatore.observe(el, { childList: true, subtree: true });
    });
  }

  /* ---------- avvisi ----------
     Le domande importanti le fa l'app, non il browser. Un confirm() di
     sistema arriva senza titolo, con i pulsanti «OK/Annulla» che non dicono
     cosa stanno per fare, e su iPhone si presenta come un avviso del sito.
     Le linee guida Apple (Alerts) chiedono l'opposto: un titolo che è la
     domanda, una riga che spiega la conseguenza, e pulsanti che nominano
     l'azione — con quella distruttiva in rosso. */
  var avvisoAperto = null;

  function avviso(opz, onSi) {
    if (avvisoAperto) return;
    var ovl = document.createElement('div');
    ovl.className = 'avviso-ovl';
    ovl.innerHTML = '<div class="avviso" role="alertdialog" aria-modal="true" aria-labelledby="avv-tit"' +
      (opz.testo ? ' aria-describedby="avv-txt"' : '') + ' tabindex="-1">' +
      '<h2 id="avv-tit">' + esc(opz.titolo) + '</h2>' +
      (opz.testo ? '<p id="avv-txt">' + esc(opz.testo) + '</p>' : '') +
      '<div class="avviso-azioni">' +
      '<button class="btn btn-grande avv-no">' + esc(opz.annulla || 'Annulla') + '</button>' +
      '<button class="btn btn-grande ' + (opz.pericolo ? 'btn-pericolo' : 'btn-primario') + ' avv-si">' + esc(opz.azione || 'Continua') + '</button>' +
      '</div></div>';
    document.body.appendChild(ovl);
    avvisoAperto = ovl;
    var pannello = ovl.querySelector('.avviso');
    /* se l'avviso arriva sopra un pannello, anche quello diventa inerte */
    var sottostante = $sheet.hidden ? null : $sheet;
    if (sottostante) sottostante.setAttribute('inert', '');
    bloccaSfondo(true);
    entraFuoco(pannello);
    function chiudi() {
      if (!avvisoAperto) return;
      avvisoAperto = null;
      ovl.remove();
      if (sottostante) sottostante.removeAttribute('inert');
      bloccaSfondo(false);
      esceFuoco();
      verificaModalita();
    }
    ovl.querySelector('.avv-no').addEventListener('click', chiudi);
    ovl.querySelector('.avv-si').addEventListener('click', function () { chiudi(); onSi(); });
    /* fuori dall'avviso e Esc = annulla: la via d'uscita non deve mai mancare */
    ovl.addEventListener('click', function (e) { if (e.target === ovl) chiudi(); });
    ovl.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); chiudi(); } });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape' && avvisoAperto === ovl) { chiudi(); document.removeEventListener('keydown', esc); }
      if (!avvisoAperto) document.removeEventListener('keydown', esc);
    });
  }

  /* ---------- toast ---------- */

  function toast(testo, xp, icona, azione) {
    var zona = document.getElementById('toast-zona');
    var t = document.createElement('div');
    t.className = 'toast' + (azione ? ' toast-lungo' : '');
    t.innerHTML = (icona ? ICO(icona, 16) : ICO('check', 16)) + '<span>' + esc(testo) + '</span>' +
      (xp ? ' <span class="xp">+' + xp + ' XP</span>' : '') +
      (azione ? '<button class="toast-azione">' + esc(azione.eti) + '</button>' : '');
    zona.appendChild(t);
    if (azione) {
      t.querySelector('.toast-azione').addEventListener('click', function () { t.remove(); azione.fai(); });
    }
    setTimeout(function () { t.remove(); }, azione ? 7000 : 3000);
  }

  /* Le linee guida Apple preferiscono l'annulla alla domanda: chiedere
     conferma ogni volta trasforma un gesto in una pratica, e chi la vede
     dieci volte al giorno smette di leggerla. Quindi le cancellazioni
     piccole si fanno subito, e per qualche secondo si possono rimettere a
     posto. Restano dietro un avviso solo quelle che portano via tutto. */
  function conAnnulla(testo, icona, fai) {
    var prima = JSON.parse(JSON.stringify(LM.load()));
    fai();
    toast(testo, 0, icona, { eti: 'Annulla', fai: function () {
      LM.ripristinaStato(prima);
      render();
      toast('Rimesso a posto.', 0, 'refresh');
    } });
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
    /* se era già aperto non si entra una seconda volta nella modalità:
       si entrerebbe due volte e si uscirebbe una sola, e la pila resterebbe
       con dentro un livello che non se ne va più */
    var giaAperto = !$ovl.hidden;
    $ovl.hidden = false;
    bloccaSfondo(true);
    $inp.value = '';
    if (giaAperto) $inp.focus();
    else entraFuoco($ovl.querySelector('.pannello-cattura'), true);
  }
  function chiudiCattura() { $ovl.hidden = true; bloccaSfondo(false); esceFuoco(); verificaModalita(); }

  document.getElementById('fab-cattura').innerHTML = ICO('plus', 25);
  document.getElementById('fab-cattura').addEventListener('click', apriCattura);
  var $sideCatt = document.getElementById('side-cattura');
  $sideCatt.querySelector('.cattura-cta-testo').innerHTML = ICO('bolt', 16) + ' Aggiungi una nota';
  $sideCatt.addEventListener('click', apriCattura);
  $ovl.addEventListener('click', function (e) { if (e.target === $ovl) chiudiCattura(); });
  function salvaCattura() {
    var t = $inp.value.trim();
    if (!t) return;
    var xp = LM.cattura(t);
    toast('Salvato.', xp, 'inbox');
    chiudiCattura();
    aggiornaNav(); render();
  }
  $inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') salvaCattura();
    if (e.key === 'Escape') chiudiCattura();
  });
  document.getElementById('cattura-salva').addEventListener('click', salvaCattura);

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
  /* la maniglia è il comando di chiusura col dito: si trascina giù, e se la
     si tocca chiude. Non è una decorazione accanto a una x. */
  document.getElementById('sheet-maniglia').addEventListener('click', chiudiSheet);
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

  /* ---------- modalità ----------
     Un pannello modale, secondo le linee guida Apple, prende davvero il
     controllo: quello che c'è sotto non si tocca e non si raggiunge, il
     fuoco entra dentro, il tasto Tab gira in tondo lì dentro, e quando si
     chiude il fuoco torna esattamente da dove era partito. Prima il fuoco
     restava fuori: con la tastiera si continuava a girare per la pagina
     dietro senza vedere dove si era, e chi usa un lettore di schermo
     leggeva il contenuto coperto. */
  /* i pannelli si possono impilare (un avviso sopra un pannello): si tiene
     la pila, così l'ultimo che si chiude restituisce il fuoco a quello sotto
     e lo sfondo torna vivo solo quando non c'è più niente sopra. */
  var pilaModali = [];

  function focalizzabili(radice) {
    return [].slice.call(radice.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(function (e) { var r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
  }

  /* il resto dell'app diventa inerte: niente clic, niente Tab, niente voce */
  function isolaSfondo(attiva) {
    ['.app', '.tabbar', '.fab', '#banda-demo'].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (attiva) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
        else { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
      });
    });
  }

  function entraFuoco(pannello, suCampo) {
    pilaModali.push({ pannello: pannello, prima: document.activeElement });
    isolaSfondo(true);
    setTimeout(function () {
      /* il fuoco va sul pannello, non sul primo campo: mettere a fuoco un
         campo apre la tastiera del telefono anche quando il pannello serve
         solo per leggere. Fa eccezione la cattura, che esiste per scrivere. */
      var campo = suCampo ? focalizzabili(pannello).filter(function (e) {
        return /input|textarea/i.test(e.tagName) && e.type !== 'button';
      })[0] : null;
      (campo || pannello).focus();
    }, 30);
  }
  function esceFuoco() {
    var uscito = pilaModali.pop();
    if (!pilaModali.length) isolaSfondo(false);
    if (!uscito) return;
    /* si torna dove si era. Se quel pulsante nel frattempo è stato
       ridisegnato, il fuoco va sul contenuto della pagina: mai sul nulla,
       o col Tab si ricomincia dall'inizio del documento. */
    var valido = uscito.prima && uscito.prima !== document.body && document.contains(uscito.prima);
    var dove = valido ? uscito.prima : $vista;
    if (dove) { try { dove.focus({ preventScroll: true }); } catch (e) { void e; } }
  }
  /* Tab gira dentro il pannello aperto invece di uscirne */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var pannello = avvisoAperto ? avvisoAperto.querySelector('.avviso')
      : (!$sheet.hidden ? $sheetPanel : (!$ovl.hidden ? $ovl.querySelector('.pannello-cattura') : null));
    if (!pannello) return;
    var f = focalizzabili(pannello);
    if (!f.length) { e.preventDefault(); pannello.focus(); return; }
    var primo = f[0], ultimo = f[f.length - 1];
    if (!pannello.contains(document.activeElement)) { e.preventDefault(); (e.shiftKey ? ultimo : primo).focus(); return; }
    if (e.shiftKey && document.activeElement === primo) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primo.focus(); }
  });

  /* Trascinare il pannello verso il basso per chiuderlo: su iOS è il gesto
     con cui si congeda un foglio, e la maniglia in cima esiste per dirlo.
     Il gesto parte solo dalla maniglia e dalla testata: dentro il corpo il
     dito deve poter scorrere il contenuto. */
  (function trascinaPerChiudere() {
    var y0 = null, dy = 0, t0 = 0;
    function partenza(e) {
      if (window.innerWidth > 560) return;                 /* solo il foglio dal basso */
      if (!e.target.closest('.sheet-maniglia, .sheet-testa')) return;
      /* la maniglia è un pulsante ed è anche la presa del gesto; gli altri
         pulsanti della testata (la x) restano pulsanti */
      if (e.target.closest('button') && !e.target.closest('.sheet-maniglia')) return;
      y0 = e.clientY; dy = 0; t0 = e.timeStamp;
      $sheetPanel.style.transition = 'none';
      $sheetPanel.setPointerCapture && $sheetPanel.setPointerCapture(e.pointerId);
    }
    function muovi(e) {
      if (y0 === null) return;
      dy = Math.max(0, e.clientY - y0);
      $sheetPanel.style.transform = 'translateY(' + dy + 'px)';
      $sheet.style.opacity = String(Math.max(.35, 1 - dy / 420));
    }
    function fine(e) {
      if (y0 === null) return;
      var veloce = dy / Math.max(1, e.timeStamp - t0) > 0.5;
      y0 = null;
      $sheetPanel.style.transition = '';
      $sheetPanel.style.transform = '';
      $sheet.style.opacity = '';
      if (dy > 110 || veloce) chiudiSheet();
    }
    $sheet.addEventListener('pointerdown', partenza);
    $sheet.addEventListener('pointermove', muovi);
    $sheet.addEventListener('pointerup', fine);
    $sheet.addEventListener('pointercancel', fine);
  })();

  function apriSheet(titolo, html, onWire, largo) {
    /* Un pannello che ne apre un altro (impostazioni → «le tue aree») non è
       un secondo pannello: è lo stesso foglio con dentro un'altra cosa. Se
       si entrasse di nuovo nella modalità, la pila si riempirebbe di un
       livello che nessuno toglie e il resto dell'app resterebbe inerte —
       cioè non cliccabile — per sempre. */
    var giaAperto = !$sheet.hidden;
    document.getElementById('sheet-titolo').textContent = titolo;
    document.getElementById('sheet-corpo').innerHTML = html;
    if ($sheetPanel) $sheetPanel.classList.toggle('sheet-largo', !!largo);
    $sheet.hidden = false;
    bloccaSfondo(true);
    wireSheet = onWire || null;
    if (wireSheet) wireSheet(document.getElementById('sheet-corpo'));
    if (giaAperto) { if ($sheetPanel) { $sheetPanel.scrollTop = 0; $sheetPanel.focus({ preventScroll: true }); } }
    else entraFuoco($sheetPanel);
  }
  /* Il nome di una cosa si cambia dove lo si legge: nel titolo del
     pannello. Prima c'era una riga «Nome» con dentro un campo, cioè lo
     stesso testo scritto due volte a tre centimetri di distanza. */
  function titoloSheetModificabile(valore, onCambio) {
    var t = document.getElementById('sheet-titolo');
    if (!t) return;
    t.innerHTML = '';
    /* una casella di testo, non un campo a riga sola: i nomi lunghi devono
       andare a capo come faceva il titolo, non scomparire a destra */
    var inp = document.createElement('textarea');
    inp.className = 'sheet-titolo-inp';
    inp.rows = 1;
    inp.value = valore;
    inp.setAttribute('aria-label', 'Nome');
    t.appendChild(inp);
    function adatta() { inp.style.height = 'auto'; inp.style.height = inp.scrollHeight + 'px'; }
    adatta();
    inp.addEventListener('input', adatta);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); inp.blur(); } });
    inp.addEventListener('change', function () {
      var v = inp.value.replace(/\s+/g, ' ').trim();
      if (!v) { inp.value = valore; adatta(); return; }
      valore = v;
      inp.value = v;
      adatta();
      onCambio(v);
    });
  }

  function chiudiSheet() {
    $sheet.hidden = true; wireSheet = null;
    if ($sheetPanel) $sheetPanel.classList.remove('sheet-largo');
    bloccaSfondo(false);
    esceFuoco();
    verificaModalita();
  }

  /* Rete di sicurezza: se non c'è più niente di aperto, l'app deve essere
     viva. Un livello di modalità rimasto appeso non si vede — si scopre
     scoprendo che l'app non risponde più a niente. */
  function verificaModalita() {
    var qualcosaAperto = !$sheet.hidden || !$ovl.hidden || !!avvisoAperto;
    if (qualcosaAperto) return;
    pilaModali.length = 0;
    isolaSfondo(false);
    if (document.body.classList.contains('sfondo-fermo')) bloccaSfondo(false);
  }

  /* Con un pannello aperto la pagina sotto deve stare FERMA: prima si poteva
     scorrere (e cliccare) il contenuto dietro, con lo sfocato che restava sul
     posto e mostrava un taglio netto. Congeliamo lo scorrimento mantenendo la
     posizione, e lo restituiamo alla chiusura. */
  var scrollCongelato = 0;
  function bloccaSfondo(attiva) {
    /* c'è ancora qualcosa sopra? allora lo sfondo resta fermo */
    var altro = document.querySelector('.overlay:not([hidden]), .sheet-overlay:not([hidden]), .avviso-ovl');
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
     'secondaria' = approfondimenti (sidebar, e nel menu "Altro" su mobile).

     livello = quanto peso visivo prende la voce. Sette voci tutte uguali
     costringono a rileggerle una per una ogni volta (legge di Hick: il tempo
     di scelta cresce col numero di alternative equivalenti), e l'ordine in
     cui stanno non dice niente su quale serve adesso. Tre livelli:
       'ancora'     la destinazione di quasi ogni apertura — grande, sempre lì
       'quotidiana' le pagine di tutti i giorni — peso normale
       'extra'      si leggono una volta e poi quasi mai — più piccole e mute
     L'ordine dentro ogni livello è per frequenza d'uso, non alfabetico. */

  var VISTE = [
    { id: 'oggi',        nome: 'Oggi',        icona: 'target',    gruppo: 'primaria',   livello: 'ancora' },
    { id: 'giornata',    nome: 'Giornata',    icona: 'clock',     gruppo: 'primaria',   livello: 'quotidiana' },
    { id: 'inbox',       nome: 'Attività',    icona: 'lista',     gruppo: 'primaria',   livello: 'quotidiana' },
    { id: 'rituali',     nome: 'Rituali',     icona: 'sun',       gruppo: 'primaria',   livello: 'quotidiana' },
    { id: 'plancia',     nome: 'Panoramica',  icona: 'dashboard', gruppo: 'primaria',   livello: 'quotidiana' },
    { id: 'esperimenti', nome: 'Esperimenti', icona: 'flask',     gruppo: 'secondaria', livello: 'extra' },
    { id: 'scienza',     nome: 'Perché funziona', icona: 'atom',  gruppo: 'secondaria', livello: 'extra' },
    /* stanza a parte: dieci vestiti per gli stessi elementi, da confrontare
       per scegliere la base grafica di tutto il sito */
    { id: 'lab',         nome: 'Design lab',  icona: 'palette',   gruppo: 'secondaria', livello: 'extra' }
  ];
  /* le 4 destinazioni quotidiane nella tab bar mobile; le altre primarie
     (es. Giornata) e le secondarie stanno nel menu "Altro" */
  var TAB_MOBILE = ['oggi', 'plancia', 'rituali', 'inbox'];
  /* ---------- le tre porte ----------
     Otto voci in una barra sono otto decisioni prima ancora di cominciare, e
     la decisione su DOVE andare non è il lavoro: è l'attrito che sta davanti
     al lavoro. Quindi la barra ne fa tre, e sono tre domande, non tre nomi:
     «cosa faccio adesso», «cosa ho da fare», «come sta andando».
     Le schermate restano tutte, con lo stesso indirizzo di prima: quelle
     dentro un gruppo si raggiungono da una riga di linguette sotto al titolo,
     dove sono già in vista e costano un tocco, non una ricerca. */
  var GRUPPI = [
    { id: 'oggi', nome: 'Oggi', icona: 'target', viste: [
      { id: 'oggi', eti: 'Adesso' }, { id: 'giornata', eti: 'La giornata' }, { id: 'rituali', eti: 'Rituali' }
    ] },
    { id: 'inbox', nome: 'Attività', icona: 'lista', viste: [
      { id: 'inbox', eti: 'Attività' }
    ] },
    { id: 'plancia', nome: 'Andamento', icona: 'dashboard', viste: [
      { id: 'plancia', eti: 'Panoramica' }, { id: 'esperimenti', eti: 'Esperimenti' }
    ],
      /* Queste due appartengono alla porta ma NON stanno fra le linguette:
         si leggono una volta e poi mai più, e una linguetta che non si tocca
         è solo una parola in più da scartare ogni volta che si guarda la riga.
         Si aprono dalle impostazioni, e la linguetta compare soltanto mentre
         ci sei dentro, per sapere dove sei e come tornare. */
      anche: ['scienza', 'lab'] }
  ];
  function navTre() { return ((LM.load().profilo || {}).nav || 'tre') !== 'tutte'; }
  function gruppoDi(id) {
    return GRUPPI.filter(function (g) {
      return g.viste.some(function (v) { return v.id === id; }) ||
        (g.anche || []).indexOf(id) >= 0;
    })[0] || GRUPPI[0];
  }

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

    /* sidebar desktop: l'ancora, poi le quotidiane, poi gli extra */
    var lato = document.getElementById('nav-lato');
    function voce(v) {
      var dim = v.livello === 'ancora' ? 20 : (v.livello === 'extra' ? 15 : 17);
      return '<a class="nav-item nav-' + (v.livello || 'quotidiana') + (corrente === v.id ? ' attivo' : '') + '" href="#/' + v.id + '">' +
        ICO(v.icona, dim) + '<span>' + v.nome + '</span>' + badgeInbox(v, s) + '</a>';
    }
    function livello(l) { return VISTE.filter(function (v) { return (v.livello || 'quotidiana') === l; }).map(voce).join(''); }
    /* niente etichette di gruppo: raggruppano già la distanza e il peso
       (principio di prossimità), e una scritta in più è una cosa in più da
       leggere in una barra che serve a non leggere niente */
    var tre = navTre();
    var gCorr = gruppoDi(corrente);
    function voceGruppo(g, dim) {
      return '<a class="nav-item nav-ancora' + (g.id === gCorr.id ? ' attivo' : '') + '" href="#/' + g.viste[0].id + '">' +
        ICO(g.icona, dim) + '<span>' + g.nome + '</span>' + badgeInbox({ id: g.id }, s) + '</a>';
    }
    lato.innerHTML = tre
      ? GRUPPI.map(function (g) { return voceGruppo(g, 20); }).join('')
      : livello('ancora') + livello('quotidiana') +
        '<div class="nav-sep"></div>' + livello('extra');

    /* footer sidebar: account + impostazioni */
    document.getElementById('sidebar-fondo').innerHTML = footerSidebar();
    wireFooterSidebar();

    /* tab bar mobile. Con le tre porte i pulsanti sono TRE: «Altro» era una
       quarta destinazione che non è una destinazione — un contenitore di cose
       diverse fra loro (pagine, account, impostazioni) che si apre per scoprire
       cosa c'è dentro. Le impostazioni ora stanno dove stanno sempre su
       telefono, nell'angolo in alto della schermata, e non costano una porta.
       Senza le tre porte torna la barra di prima: quattro pagine + «Altro». */
    var tab = document.getElementById('nav-tab');
    var primNav = TAB_MOBILE.map(vistaById);
    var inSecondaria = !tre && !primNav.some(function (v) { return v.id === corrente; });
    tab.innerHTML = (tre
      ? GRUPPI.map(function (g) {
        return '<button data-vai="' + g.viste[0].id + '" class="' + (g.id === gCorr.id ? 'attivo' : '') + '">' +
          '<span class="tab-ico">' + ICO(g.icona, 21) + badgeInbox({ id: g.id }, s) + '</span>' + g.nome + '</button>';
      }).join('')
      : primNav.map(function (v) {
        return '<button data-vai="' + v.id + '" class="' + (corrente === v.id ? 'attivo' : '') + '">' +
          '<span class="tab-ico">' + ICO(v.icona, 21) + badgeInbox(v, s) + '</span>' + v.nome + '</button>';
      }).join('')) +
      (tre ? '' : '<button data-menu="1" class="' + (inSecondaria ? 'attivo' : '') + '"><span class="tab-ico">' + ICO('sparkles', 21) + '</span>Altro</button>');
    tab.querySelectorAll('[data-vai]').forEach(function (b) {
      b.addEventListener('click', function () { location.hash = '#/' + b.getAttribute('data-vai'); });
    });
    var bMenu = tab.querySelector('[data-menu]');
    if (bMenu) bMenu.addEventListener('click', apriMenuAltro);
  }

  /* ---------- footer sidebar (account + impostazioni) ---------- */

  function statoSync() {
    var y = window.LM_SYNC || { state: 'idle' };
    var quando = y.at ? ' · ' + oraDi(y.at) : '';
    /* `breve` è la versione per la barra laterale, dove lo spazio è una
       colonna stretta: se andasse a capo sembrerebbe un errore di layout. */
    if (y.state === 'saving') return { ico: 'cloud', cls: '', testo: 'Salvataggio…', breve: 'Salvataggio…' };
    /* la scrittura è in coda: i dati sono già sul dispositivo, il cloud
       arriverà. Dirlo chiaramente invece di lasciare un "…" infinito. */
    if (y.state === 'attesa') return { ico: 'cloud', cls: 'sync-attesa', testo: 'Salvato qui, in attesa di rete', breve: 'In attesa di rete',
      title: 'I dati sono salvati su questo dispositivo. Appena c’è rete finiscono anche nel cloud.' + (y.at ? ' Ultimo salvataggio nel cloud: ' + oraDi(y.at) + '.' : '') };
    if (y.state === 'muto') return { ico: 'cloud', cls: 'sync-errore', testo: 'Cloud non raggiungibile', breve: 'Cloud non risponde', title: y.error };
    if (y.state === 'error') return { ico: 'cloud', cls: 'sync-errore', testo: 'Sync non riuscita', breve: 'Sync non riuscita', title: y.error };
    if (y.state === 'saved') return { ico: 'cloudCheck', cls: 'sync-ok', testo: 'Salvato nel cloud' + quando, breve: 'Salvato' + quando, title: 'Ultimo salvataggio confermato dal server alle ' + oraDi(y.at) + '.' };
    return { ico: 'cloudCheck', cls: 'sync-ok', testo: 'Tutto salvato', breve: 'Tutto salvato' };
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
        /* lo stato è cliccabile: chi legge "Salvataggio…" vuole sapere subito
           perché, e la spiegazione deve stare dietro quella parola, non
           sepolta nelle impostazioni */
        '<button type="button" class="sync-chip ' + y.cls + '" data-diag="1" title="' + esc(y.title || 'Mostra cosa sta succedendo') + '">' + ICO(y.ico, 12) + ' ' + (y.breve || y.testo) + '</button></div></div>';
    } else if (a.available) {
      acct = '<button class="btn btn-mini btn-accedi" id="fondo-accedi">' + GOOGLE_G(15) + ' Accedi con Google</button>';
    } else {
      acct = '<div class="fondo-locale">' + ICO('cloud', 13) + ' Dati salvati su questo dispositivo</div>';
    }
    return acct + '<button class="btn-strumento-largo" id="fondo-impostazioni">' + ICO('ingranaggio', 16) + '<span>Impostazioni</span></button>';
  }

  function wireFooterSidebar() {
    var acc = document.getElementById('fondo-accedi');
    if (acc) acc.addEventListener('click', function () { if (window.LMCloud && window.LMCloud.available) window.LMCloud.signIn(); });
    var imp = document.getElementById('fondo-impostazioni');
    if (imp) imp.addEventListener('click', apriImpostazioni);
    var fondo = document.getElementById('sidebar-fondo');
    if (fondo) fondo.querySelectorAll('[data-diag]').forEach(function (b) { b.addEventListener('click', apriDiagnostica); });
  }

  /* ---------- impostazioni & menu "Altro" ---------- */

  function htmlAspetto() {
    var s = LM.load();
    var modo = s.profilo.modo || 'auto';
    var skin = s.profilo.skin || 'quiete';
    function segM(v, ico, et) { return '<button data-modo="' + v + '" class="' + (modo === v ? 'attivo' : '') + '">' + ICO(ico, 15) + et + '</button>'; }
    function segS(v, et) { return '<button data-skin="' + v + '" class="' + (skin === v ? 'attivo' : '') + '">' + et + '</button>'; }
    var nav = s.profilo.nav || 'tre';
    function segN(v, et) { return '<button data-nav="' + v + '" class="' + (nav === v ? 'attivo' : '') + '">' + et + '</button>'; }
    return '<div class="imp-sezione"><div class="imp-eti">Navigazione</div>' +
      '<div class="segmenti imp-seg" id="seg-nav">' + segN('tre', 'Tre porte') + segN('tutte', 'Tutte le pagine') + '</div>' +
      '<div class="imp-nota">Con <b>Tre porte</b> nella barra restano <b>Oggi</b>, <b>Attività</b> e <b>Andamento</b>, e le altre schermate stanno dentro, in una riga di linguette sotto al titolo. Con <b>Tutte le pagine</b> torna la barra lunga di prima. In tutti e due i casi non sparisce niente: cambia solo da dove ci si arriva.</div></div>' +
      '<div class="imp-sezione"><div class="imp-eti">Personalizza</div>' +
      '<div class="imp-azioni">' +
      '<button class="btn btn-mini" id="imp-aree">' + ICO('sparkles', 14) + ' Gestisci le aree</button> ' +
      '<button class="btn btn-mini" id="imp-guida">' + ICO('aiuto', 14) + ' Come si usa</button> ' +
      '<button class="btn btn-mini" id="imp-scienza">' + ICO('atom', 14) + ' Perché funziona</button></div>' +
      '<div class="imp-nota">«Perché funziona» racconta su quali studi è appoggiata ogni scelta dell’app. Si legge una volta, quindi non occupa una linguetta.</div></div>' +
      '<div class="imp-sezione"><div class="imp-eti">La giornata</div>' +
      '<div class="imp-azioni"><button class="btn btn-mini" id="imp-ritmo">' + ICO('clock', 14) + ' Sonno e pasti</button></div>' +
      '<div class="imp-nota">La barra della giornata è sempre in cima a <b>Oggi</b>; la pagina <b>Giornata</b> mostra anche settimana, mese e anno.</div></div>' +
      '<div class="imp-sezione"><div class="imp-eti">Tema</div>' +
      '<div class="segmenti imp-seg" id="seg-modo">' + segM('auto', 'refresh', 'Auto') + segM('light', 'sun', 'Chiaro') + segM('dark', 'moon', 'Scuro') + '</div></div>' +
      '<div class="imp-sezione"><div class="imp-eti">Aspetto</div>' +
      '<div class="segmenti imp-seg" id="seg-skin">' + segS('quiete', 'Aurora') + segS('arcade', 'Arcade') + '</div>' +
      '<div class="imp-nota">Aurora è più sobrio, Arcade più acceso. Cambia solo l’aspetto, non i dati.</div>' +
      '<div class="imp-azioni" style="margin-top:10px"><button class="btn btn-mini" id="imp-lab">' + ICO('palette', 14) + ' Design lab</button></div>' +
      '<div class="imp-nota">Dieci interfacce complete per la stessa app, da confrontare per scegliere la base grafica di tutto il sito.</div></div>';
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
      '<div class="imp-nota">L’azzeramento crea comunque un backup: potrai recuperare i dati da «Backup e ripristino».</div></div>' +
      '<div class="imp-sezione"><div class="imp-eti">Se qualcosa non torna</div>' +
      '<div class="imp-azioni"><button class="btn btn-mini" id="imp-diag">' + ICO('terminale', 14) + ' Cosa sta succedendo</button></div>' +
      '<div class="imp-nota">Mostra se i dati sono davvero salvati e il registro di tutto quello che l’app sta facendo, da copiare e inviare.</div></div>';
  }

  function wireAspettoDati(root) {
    root.querySelectorAll('#seg-nav [data-nav]').forEach(function (b) {
      b.addEventListener('click', function () {
        /* il pannello resta aperto: il segmento si aggiorna da sé, così si
           vede subito la barra cambiare dietro senza chiudere niente */
        root.querySelectorAll('#seg-nav [data-nav]').forEach(function (o) { o.classList.toggle('attivo', o === b); });
        setNav(b.getAttribute('data-nav'));
      });
    });
    root.querySelectorAll('#seg-modo [data-modo]').forEach(function (b) {
      b.addEventListener('click', function () { setModo(b.getAttribute('data-modo')); });
    });
    root.querySelectorAll('#seg-skin [data-skin]').forEach(function (b) {
      b.addEventListener('click', function () { setSkin(b.getAttribute('data-skin')); });
    });
    var la = root.querySelector('#imp-accedi');
    if (la) la.addEventListener('click', function () { if (window.LMCloud && window.LMCloud.available) window.LMCloud.signIn(); });
    var le = root.querySelector('#imp-esci');
    if (le) le.addEventListener('click', function () {
      if (window.LMCloud) window.LMCloud.signOut();
      chiudiSheet(); toast('Hai effettuato la disconnessione.', 0, 'logout');
    });
    var d = root.querySelector('#imp-demo'); if (d) d.addEventListener('click', caricaDemo);
    var z = root.querySelector('#imp-azzera'); if (z) z.addEventListener('click', azzeraTutto);
    var e = root.querySelector('#imp-esporta'); if (e) e.addEventListener('click', esportaDati);
    var b2 = root.querySelector('#imp-backup'); if (b2) b2.addEventListener('click', apriBackups);
    var ar = root.querySelector('#imp-aree'); if (ar) ar.addEventListener('click', apriAree);
    var gu = root.querySelector('#imp-guida'); if (gu) gu.addEventListener('click', apriGuida);
    var sc = root.querySelector('#imp-scienza');
    if (sc) sc.addEventListener('click', function () { chiudiSheet(); location.hash = '#/scienza'; });
    var lb = root.querySelector('#imp-lab');
    if (lb) lb.addEventListener('click', function () { chiudiSheet(); location.hash = '#/lab'; });
    var ri = root.querySelector('#imp-ritmo'); if (ri) ri.addEventListener('click', apriRitmo);
    var dg = root.querySelector('#imp-diag'); if (dg) dg.addEventListener('click', apriDiagnostica);
    root.querySelectorAll('[data-diag]').forEach(function (b) { b.addEventListener('click', apriDiagnostica); });
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
          avviso({
            titolo: 'Ripristinare questo backup?',
            testo: 'I dati di adesso non vanno persi: prima di ripristinare vengono salvati come nuovo backup.',
            azione: 'Ripristina'
          }, function () {
            LM.restoreBackup(ts); chiudiSheet(); applicaTema(); render();
            toast('Backup ripristinato.', 0, 'save');
          });
        });
      });
    });
  }

  /* ---------- registro diagnostico ----------
     Quando qualcosa non torna ("dice ancora Salvataggio…") la domanda vera è
     una sola: i miei dati sono al sicuro? Qui la risposta si legge in chiaro,
     con la cronologia di cosa è successo e un pulsante che copia tutto —
     perché il problema si vede sul telefono, dove non c'è nessuna console. */

  var LOG_SOLO_PROBLEMI = false;

  function statoSalvataggioSpiegato() {
    var y = window.LM_SYNC || { state: 'idle' };
    var a = window.LM_AUTH || {};
    var locale = 'Sul telefono o computer che stai usando i dati sono salvati subito, sempre.';
    if (!a.available) return { cls: 'diag-ok', tit: 'Solo su questo dispositivo', txt: locale + ' Il cloud non è raggiungibile da qui, quindi non c’è copia online.' };
    if (!a.user) return { cls: 'diag-ok', tit: 'Solo su questo dispositivo', txt: locale + ' Accedi con Google per avere anche una copia nel cloud.' };
    if (y.state === 'saved') return { cls: 'diag-ok', tit: 'Al sicuro anche nel cloud', txt: 'Ultima conferma dal server alle ' + oraDi(y.at) + '. ' + locale };
    if (y.state === 'saving') return { cls: 'diag-corso', tit: 'Salvataggio nel cloud in corso', txt: locale + ' Sta arrivando la conferma del server.' };
    if (y.state === 'attesa') return { cls: 'diag-attesa', tit: 'Salvato qui, in coda per il cloud', txt: locale + ' La copia online partirà appena c’è rete: non serve fare niente.' + (y.at ? ' Ultima copia nel cloud: ' + oraDi(y.at) + '.' : '') };
    if (y.state === 'muto' || y.state === 'error') return { cls: 'diag-guasto', tit: 'Il cloud non sta salvando', txt: (y.error || '') + ' ' + locale };
    return { cls: 'diag-ok', tit: 'Niente in sospeso', txt: locale };
  }

  function righeLogHtml() {
    if (!window.LMLog) return '<div class="imp-nota" style="margin:0">Registro non disponibile.</div>';
    var r = LMLog.righe();
    if (LOG_SOLO_PROBLEMI) r = r.filter(function (x) { return x.liv !== 'info'; });
    if (!r.length) return '<div class="diag-vuoto">' + (LOG_SOLO_PROBLEMI ? 'Nessun problema registrato.' : 'Ancora niente da mostrare.') + '</div>';
    /* dal più recente: su un telefono l'ultima cosa avvenuta deve stare
       davanti agli occhi, non in fondo a 300 righe */
    return r.slice().reverse().map(function (x) {
      return '<div class="diag-riga liv-' + x.liv + '"><span class="diag-ora">' + LMLog.ora(x.t) + '</span>' +
        '<span class="diag-can">' + esc(x.can) + '</span>' +
        '<span class="diag-msg">' + esc(x.msg) + (x.dati ? '<i>' + esc(x.dati) + '</i>' : '') + '</span></div>';
    }).join('');
  }

  function apriDiagnostica() {
    var st = statoSalvataggioSpiegato();
    var nProblemi = window.LMLog ? LMLog.righe().filter(function (x) { return x.liv !== 'info'; }).length : 0;
    apriSheet('Cosa sta succedendo',
      '<div class="diag-stato ' + st.cls + '"><b>' + esc(st.tit) + '</b><span>' + esc(st.txt.trim()) + '</span></div>' +
      '<div class="diag-barra">' +
      '<button class="btn btn-mini btn-primario" id="diag-copia">' + ICO('copy', 14) + ' Copia tutto</button>' +
      (navigator.share ? '<button class="btn btn-mini" id="diag-condividi">' + ICO('share', 14) + ' Condividi</button>' : '') +
      '<button class="btn btn-mini" id="diag-riprova">' + ICO('refresh', 14) + ' Riprova ora</button>' +
      '<button class="btn btn-mini btn-ghost" id="diag-svuota">' + ICO('trash', 14) + ' Svuota</button>' +
      '</div>' +
      /* la nota sta SOPRA il registro: sotto c'è un'area che scorre da sola e
         quello che finisce là in fondo non lo legge nessuno */
      '<div class="imp-nota diag-nota">Il registro descrive cosa fa l’app: salvataggi, cloud, rete, errori. Non contiene il testo di quello che scrivi, e l’indirizzo email è abbreviato.</div>' +
      '<div class="segmenti diag-filtro" id="diag-filtro">' +
      '<button data-filtro="tutto" class="' + (LOG_SOLO_PROBLEMI ? '' : 'attivo') + '">Tutto</button>' +
      '<button data-filtro="problemi" class="' + (LOG_SOLO_PROBLEMI ? 'attivo' : '') + '">Solo problemi' + (nProblemi ? ' (' + nProblemi + ')' : '') + '</button></div>' +
      '<div class="diag-console" id="diag-console" tabindex="0" role="log" aria-label="Registro diagnostico">' + righeLogHtml() + '</div>' +
      '<textarea id="diag-testo" class="diag-testo" readonly aria-label="Testo del registro, da copiare a mano"></textarea>',
      wireDiagnostica, true);
  }

  function wireDiagnostica(root) {
    var cons = root.querySelector('#diag-console');
    var area = root.querySelector('#diag-testo');

    function testoCompleto() { return window.LMLog ? LMLog.testo() : ''; }

    root.querySelector('#diag-copia').addEventListener('click', function () {
      var t = testoCompleto();
      function aMano() {
        /* niente clipboard (Safari in certi contesti): mostriamo il testo già
           selezionato, così "copia" è comunque a un gesto di distanza */
        area.classList.add('mostra');
        area.value = t; area.focus(); area.select();
        toast('Testo selezionato: tienilo premuto e scegli «Copia».', 0, 'copy');
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(function () {
          toast('Registro copiato.', 0, 'copy');
        }, aMano);
      } else aMano();
    });

    var cond = root.querySelector('#diag-condividi');
    if (cond) cond.addEventListener('click', function () {
      navigator.share({ title: 'LifeMax — registro diagnostico', text: testoCompleto() }).catch(function () { /* annullato */ });
    });

    root.querySelector('#diag-riprova').addEventListener('click', function () {
      LM.save();   // forza un giro di salvataggio: rilancia anche il push sul cloud
      if (window.LMLog) LMLog.info('registro', 'Salvataggio richiesto a mano dall’utente');
      toast('Salvataggio richiesto: le righe qui sotto dicono com’è andato.', 0, 'refresh');
    });

    root.querySelector('#diag-svuota').addEventListener('click', function () {
      if (window.LMLog) LMLog.svuota();
      cons.innerHTML = righeLogHtml();
    });

    root.querySelectorAll('#diag-filtro [data-filtro]').forEach(function (b) {
      b.addEventListener('click', function () {
        LOG_SOLO_PROBLEMI = b.getAttribute('data-filtro') === 'problemi';
        root.querySelectorAll('#diag-filtro [data-filtro]').forEach(function (x) { x.classList.toggle('attivo', x === b); });
        cons.innerHTML = righeLogHtml();
        cons.scrollTop = 0;
      });
    });

    /* aggiornamento dal vivo: si aggiunge una riga in cima, il resto non si
       muove. Guardare il registro mentre agisci è metà della diagnosi. */
    function nuovaRiga(e) {
      if (!document.body.contains(cons)) { window.removeEventListener('lm:log', nuovaRiga); return; }
      var x = e.detail; if (!x) return;
      if (LOG_SOLO_PROBLEMI && x.liv === 'info') return;
      var vuoto = cons.querySelector('.diag-vuoto');
      if (vuoto) vuoto.remove();
      var d = document.createElement('div');
      d.className = 'diag-riga liv-' + x.liv + ' diag-nuova';
      d.innerHTML = '<span class="diag-ora">' + LMLog.ora(x.t) + '</span><span class="diag-can">' + esc(x.can) +
        '</span><span class="diag-msg">' + esc(x.msg) + (x.dati ? '<i>' + esc(x.dati) + '</i>' : '') + '</span>';
      cons.insertBefore(d, cons.firstChild);
      var testa = root.querySelector('.diag-stato');
      if (testa && x.can === 'sync') {
        var st = statoSalvataggioSpiegato();
        testa.className = 'diag-stato ' + st.cls;
        testa.innerHTML = '<b>' + esc(st.tit) + '</b><span>' + esc(st.txt.trim()) + '</span>';
      }
    }
    window.addEventListener('lm:log', nuovaRiga);
  }

  /* ---------- gestione aree (personalizzabili) ---------- */

  var ICONE_AREA =['book', 'heart', 'users', 'wallet', 'landmark', 'rocket', 'briefcase', 'sparkles', 'target', 'bolt', 'flask', 'star', 'flame', 'lightbulb', 'calendar', 'clock'];

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
          b.addEventListener('click', function () {
            avviso({
              titolo: 'Rimuovere questa area?',
              testo: 'Le attività che ci stavano dentro passano ad «Altro»: non si perde niente.',
              azione: 'Rimuovi', pericolo: true
            }, function () { LM.rimuoviArea(b.getAttribute('data-del-area')); render(); apriAree(); });
          });
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
      '<div class="imp-nota" style="margin-top:0">Tre passaggi: <b>annoti</b> quello che ti viene in mente, <b>decidi</b> cosa farne, <b>fai</b> una cosa per volta.</div>' +
      '<div class="guida">' +
      voce('bolt', '1 · Annota', 'Premi <kbd>C</kbd> (o il tasto ＋) e scrivi. La nota finisce in <b>Attività</b>, sezione «Sistemare»: non serve decidere altro adesso.') +
      voce('lista', '2 · Decidi cosa farne', 'In <b>Attività</b>, per ogni nota scegli <b>Oggi</b>, <b>Da fare</b> (più avanti, senza data) o <b>Scarta</b>. Quelle in «Da fare» restano in elenco, con il filtro per area, finché non le porti in Oggi.') +
      voce('target', '3 · Fai una cosa per volta', 'La schermata <b>Oggi</b> mostra una sola azione. Al mattino scegli le tre azioni del giorno in <b>Rituali</b>, la sera chiudi con la review.') +
      voce('clock', 'La giornata', 'Mostra come sono divise le tue ore: sonno, pasti, abitudini e azioni con un orario. Dove vederla si sceglie dal menù sulla timeline.') +
      voce('smile', 'Check-in', 'Energia, concentrazione, umore, su una scala da 1 a 5. Conta l’andamento nei giorni, non il numero di oggi.') +
      voce('flask', 'Esperimenti', 'Introduci un cambiamento (per esempio sport al mattino) e l’app confronta i tuoi dati prima e dopo.') +
      voce('trendUp', 'Panoramica e Diario', 'In <b>Panoramica</b> vedi progressi, costanza e andamento; nel <b>Diario</b> lo storico giorno per giorno.') +
      voce('save', 'I dati', 'Backup automatici, esportazione e importazione in .json, sincronizzazione sull’account Google fra dispositivi.') +
      '</div>', null);
  }

  /* Lo stesso blocco che stava nel menu «Altro»: chi è connesso, com'è andato
     il salvataggio, entra ed esci. Toccava sparire con «Altro», e invece è la
     cosa che si va a cercare quando si dubita che i dati siano al sicuro. */
  function htmlAccount() {
    var a = window.LM_AUTH || { available: false, user: null };
    if (a.user) {
      var y = statoSync();
      return '<div class="imp-sezione"><div class="imp-eti">Account</div>' +
        '<div class="menu-account">' + ICO('cloudCheck', 15) + ' Connesso come <b>' + esc(a.user.name || a.user.email) + '</b>' +
        '<button class="btn btn-mini btn-ghost" id="imp-esci">' + ICO('logout', 14) + ' Esci</button></div>' +
        '<button type="button" class="sync-chip sync-chip-largo ' + y.cls + '" data-diag="1" title="' + esc(y.title || 'Mostra cosa sta succedendo') + '">' +
        ICO(y.ico, 13) + ' ' + y.testo + ICO('arrowRight', 13) + '</button></div>';
    }
    if (a.available) {
      return '<div class="imp-sezione"><div class="imp-eti">Account</div>' +
        '<button class="btn btn-accedi" id="imp-accedi" style="width:100%;justify-content:center">' + GOOGLE_G(17) + ' Accedi con Google</button>' +
        '<div class="imp-nota">Accedi per ritrovare i tuoi dati su tutti i dispositivi.</div></div>';
    }
    return '<div class="imp-sezione"><div class="imp-eti">Account</div>' +
      '<div class="fondo-locale">' + ICO('cloud', 13) + ' Dati salvati su questo dispositivo</div></div>';
  }

  function apriImpostazioni() {
    apriSheet('Impostazioni', htmlAccount() + htmlAspetto() + htmlDati(), wireAspettoDati);
  }

  function apriMenuAltro() {
    var s = LM.load();
    /* stessa gerarchia della barra laterale: qui dentro finiscono le pagine
       che non stanno nella tab bar, e senza livelli sarebbero un elenco piatto
       in cui Giornata pesa come una pagina da leggere una volta sola */
    var extra = primarie().filter(function (v) { return TAB_MOBILE.indexOf(v.id) < 0; }); /* es. Giornata */
    function voceMenu(v) {
      return '<button class="menu-voce menu-' + (v.livello || 'quotidiana') + '" data-vai="' + v.id + '">' +
        ICO(v.icona, v.livello === 'extra' ? 16 : 18) + '<span>' + v.nome + '</span>' + ICO('arrowRight', 15) + '</button>';
    }
    /* con le tre porte qui non serve nessun elenco di pagine: ogni schermata
       sta a un tocco dalle linguette sotto al titolo della sua porta */
    var link = navTre() ? '' : (extra.map(voceMenu).join('') +
      (extra.length ? '<div class="nav-sep"></div>' : '') +
      VISTE.filter(function (v) { return v.gruppo === 'secondaria'; }).map(voceMenu).join(''));
    var a = window.LM_AUTH || { available: false, user: null };
    var acct;
    if (a.user) {
      var y = statoSync();
      acct = '<div class="menu-account">' + ICO('cloudCheck', 15) + ' Connesso come <b>' + esc(a.user.name || a.user.email) + '</b>' +
        '<button class="btn btn-mini btn-ghost" id="menu-esci">' + ICO('logout', 14) + ' Esci</button></div>' +
        '<button type="button" class="sync-chip sync-chip-largo ' + y.cls + '" data-diag="1" title="' + esc(y.title || 'Mostra cosa sta succedendo') + '">' + ICO(y.ico, 13) + ' ' + y.testo + ICO('arrowRight', 13) + '</button>';
    } else if (a.available) {
      acct = '<button class="btn btn-accedi" id="menu-accedi" style="width:100%;justify-content:center">' + GOOGLE_G(17) + ' Accedi con Google</button>' +
        '<div class="imp-nota">Accedi per ritrovare i tuoi dati su tutti i dispositivi.</div>';
    } else {
      acct = '<div class="fondo-locale">' + ICO('cloud', 13) + ' Dati salvati su questo dispositivo</div>';
    }
    /* Le impostazioni NON stanno più qui dentro. Prima questo pannello era
       navigazione + account + tema + aspetto + dati + ripartenza + diagnostica
       in un unico scorrimento da nove schermate: per raggiungere «Giornata»
       si passava davanti a trenta comandi che non si stavano cercando. Ora è
       un menu di pagine, e le impostazioni sono una porta sola — come su
       desktop, dove hanno sempre funzionato così. */
    apriSheet('Menu', (link ? '<div class="menu-lista">' + link + '</div>' : '') +
      '<div class="imp-sezione"><div class="imp-eti">Account</div>' + acct + '</div>' +
      '<button class="btn-strumento-largo" id="menu-impostazioni">' + ICO('ingranaggio', 16) + '<span>Impostazioni</span>' + ICO('arrowRight', 14) + '</button>',
      function (root) {
        root.querySelectorAll('[data-vai]').forEach(function (b) {
          b.addEventListener('click', function () { chiudiSheet(); location.hash = '#/' + b.getAttribute('data-vai'); });
        });
        var la = root.querySelector('#menu-accedi'); if (la) la.addEventListener('click', function () { if (window.LMCloud && window.LMCloud.available) window.LMCloud.signIn(); });
        var le = root.querySelector('#menu-esci'); if (le) le.addEventListener('click', function () { if (window.LMCloud) window.LMCloud.signOut(); chiudiSheet(); toast('Hai effettuato la disconnessione.', 0, 'logout'); });
        root.querySelectorAll('[data-diag]').forEach(function (b) { b.addEventListener('click', apriDiagnostica); });
        root.querySelector('#menu-impostazioni').addEventListener('click', apriImpostazioni);
      });
  }

  /* ---------- riga di aggiunta rapida ----------
     Aggiungere è la cosa che si fa più spesso e più di fretta: se il campo
     sta in fondo alla pagina, il pensiero si perde prima di arrivarci — con
     l'attenzione che salta, la finestra utile tra «mi è venuto in mente» e
     «l'ho scritto» si misura in secondi. Quindi sta in cima.

     Ma in cima non può occupare mezzo schermo, o coprirebbe proprio ciò che
     si è venuti a vedere. Quindi è UNA riga: il campo e il più. Le opzioni
     per pianificare (quando, area, giorni) si aprono solo mentre scrivi —
     cioè esattamente quando non stai leggendo la lista — e si richiudono da
     sole appena hai finito. A riposo non costa niente.

     Su un telefono c'è un motivo in più: la tastiera copre il fondo dello
     schermo, e un campo in basso finisce sotto la tastiera che serve a
     riempirlo. In alto resta sempre visibile. */

  function rigaAggiunta(id, segnaposto, opzioniHtml) {
    return '<form class="agg" id="' + id + '" autocomplete="off">' +
      '<div class="agg-riga">' +
      '<input type="text" class="agg-testo" placeholder="' + esc(segnaposto) + '" aria-label="' + esc(segnaposto) + '" enterkeyhint="done">' +
      /* il segno più dice da sé cosa fa: quando lo schermo è strettissimo la
         scritta sparisce e il tasto resta comunque comprensibile */
      '<button class="btn btn-mini btn-primario agg-ok" type="submit" aria-label="Aggiungi">' + ICO('piu2', 14) + '<span class="agg-ok-eti">Aggiungi</span></button></div>' +
      (opzioniHtml ? '<div class="agg-opz" hidden>' + opzioniHtml + '</div>' : '') +
      '</form>';
  }

  /* Collega la riga: le opzioni si aprono al primo carattere, si chiudono
     quando il campo torna vuoto e si perde il fuoco. `onInvio(testo, opz)`
     riceve il testo e il contenitore delle opzioni. */
  function wireRigaAggiunta(scope, id, onInvio) {
    var form = scope.querySelector('#' + id);
    if (!form) return;
    var inp = form.querySelector('.agg-testo');
    var opz = form.querySelector('.agg-opz');
    function apri(v) {
      if (!opz) return;
      opz.hidden = !v;
      form.classList.toggle('agg-aperta', !!v);
    }
    inp.addEventListener('input', function () { if (inp.value.trim()) apri(true); });
    inp.addEventListener('focus', function () { if (inp.value.trim()) apri(true); });
    /* Esc svuota e richiude: una via d'uscita senza dover cancellare a mano */
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); inp.value = ''; apri(false); inp.blur(); }
    });
    form.addEventListener('focusout', function () {
      setTimeout(function () {
        if (!form.contains(document.activeElement) && !inp.value.trim()) apri(false);
      }, 0);
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = inp.value.trim();
      if (!v) { inp.focus(); return; }
      onInvio(v, opz);
      inp.value = '';
      apri(false);
      /* il fuoco resta nel campo: chi butta giù una cosa spesso ne butta giù
         tre di seguito, e non deve ricliccare ogni volta */
      inp.focus();
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

  function selectAree(id, selezionata, etichetta, cls) {
    return '<select id="' + id + '"' + (cls ? ' class="' + cls + '"' : '') + ' aria-label="' + esc(etichetta || 'Area') + '">' + areeAttive().map(function (a) {
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

  function topbar(titolo, sottotitolo, destra, cls) {
    return '<div class="topbar' + (cls ? ' ' + cls : '') + '"><div><h1>' + titolo + '</h1>' +
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
    /* sul telefono il testo lungo occupava due righe e mangiava mezzo schermo */
    banda.innerHTML = '<div class="banda-demo"><span>' + ICO('sparkles', 13) +
      ' <b>Dati di esempio</b><span class="banda-piu">· modifica pure, tutto resta salvato</span></span>' +
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
        toast('Timer finito. Minuti registrati.', 0, 'clock');
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
    /* Il rituale di QUESTO momento, a un tocco da Oggi: prima stava a due
       tocchi più una scelta fra cinque schede, e il check-in si fa più volte
       al giorno. Compare solo se non è ancora stato fatto: appena lo fai
       sparisce e non chiede più niente. */
    function rigaRitualeAdesso() {
      var rid = ritualeDellOra();
      var st = statoRituale(rid);
      /* Il mattino e le review si fanno una volta: quando sono fatte la riga
         sparisce. Il check-in no — si fa più volte al giorno, quindi resta e
         al posto di «adesso» dice quanti ne hai già fatti. */
      if (st.fatto && rid !== 'checkin') return '';
      var r = RITUALI.filter(function (x) { return x.id === rid; })[0];
      return '<button class="rit-adesso" data-vai="rituali" data-sub="' + rid + '">' +
        ICO(r.ico, 16) + '<b>' + r.nome + '</b>' +
        (st.fatto ? '<span class="rit-stato fatto">' + ICO('check', 12) + ' ' + st.testo + '</span>'
                  : '<span class="rit-ora">adesso</span>') +
        ICO('arrowRight', 15) + '</button>';
    }
    var ritAdesso = rigaRitualeAdesso();

    var html = topbar('Oggi', 'L’azione da fare adesso.',
      '<span class="chip">' + ICO('check', 14) + ' <b>&nbsp;' + fatte + '/' + oggi.length + '</b>&nbsp;oggi</span>');
    html += '<div id="oggi-giornata"></div>';

    if (!prossima) {
      html += '<div class="focus-scena"><div class="vuoto">' + illoSole() +
        (oggi.length ? '<b>Per oggi hai finito tutto.</b><br>Puoi chiudere con la review della sera, o aggiungere qualcosa se ti va.'
                     : '<b>Oggi non hai ancora scelto cosa fare.</b><br>Bastano pochi secondi: scegli la prima cosa e parti.') +
        '</div>' +
        '<div class="focus-azioni-riga">' +
        '<button class="btn btn-primario btn-grande" data-vai="rituali" data-sub="mattina">' + ICO('sun', 18) + ' Scegli le azioni di oggi</button>' +
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
      '<span>' + (inCoda > 0
        ? '<span class="pila-coda">' + '<i></i>'.repeat(Math.min(3, inCoda)) + '</span> Dopo questa hai ancora <b>' + inCoda + '</b> ' + (inCoda === 1 ? 'azione' : 'azioni') + ', una alla volta.'
        : 'È l’ultima azione della giornata.') + '</span>' +
      /* il suggerimento cambia col dispositivo: su un telefono non c'è nessun
         tasto C da premere, c'è il pulsante + in basso. E se c'è il rituale di
         adesso lascia il posto a quello: vale più un rituale da fare che il
         promemoria di un tasto. */
      (ritAdesso ? '' :
        '<span class="solo-tastiera">·</span>' +
        '<span class="solo-tastiera">Premi <kbd>C</kbd> per aggiungere una nota.</span>' +
        '<span class="solo-tocco">Tocca <b>+</b> per aggiungere una nota.</span>') +
      '</div>' + ritAdesso +
      altreHtml +
      '</div>';

    $vista.innerHTML = html;
    montaOggiGiornata();

    $vista.querySelectorAll('[data-vai]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.getAttribute('data-sub')) sottoRituale = b.getAttribute('data-sub');
        location.hash = '#/' + b.getAttribute('data-vai');
      });
    });

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
      toast('Rimandata.', 0, 'arrowRight');
      render();
    });
    if (timerAttivo) {
      document.getElementById('btn-stop-timer').addEventListener('click', function () {
        fermaTimer(true);
        toast('Minuti registrati per ' + area.nome + '.', 0, 'clock');
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
      /* un blocco più basso di un dito non può ospitare una spunta: si
         segna come «basso» e col tocco la spunta sparisce (si apre la
         scheda del blocco, dove «Fatto» è grande quanto serve) */
      var basso = hgt < 46;
      var check = (opts.spuntabile && !opts.mini) ? '<button class="tl-blk-check" ' + attr + ' aria-label="Fatto">' + ICO('check', 11) + '</button>' : '';
      /* nella pagina Giornata il blocco si tocca per modificarlo (orario,
         durata, area) in un pannellino: niente più lista doppia sotto. */
      var clic = opts.mini ? ' data-tl-giorno="' + d.k + '"'
        : (opts.interactive ? ' data-blk-' + (e.tipo === 'azione' ? 'az' : 'ab') + '="' + e.id + '"' : '');
      /* le azioni si trascinano: su un'altra ora (stesso giorno) o su un altro
         giorno nella vista settimana */
      /* Nella settimana i blocchi sono minuscoli: non c'è posto per un manico
         separato, quindi il blocco stesso fa da manico (data-manico su di sé).
         Così col dito si prende subito, senza che il browser rubi il gesto
         per selezionare il testo. */
      if (e.tipo === 'azione') clic += ' data-drag-az="' + e.id + '"' + (opts.mini ? ' data-manico' : '');
      return '<div class="tl-blk tl-blk-att' + (fatto ? ' fatta' : '') + (basso ? ' tl-blk-basso' : '') + (opts.interactive && !opts.mini ? ' tl-blk-clic' : '') + '"' + clic + ' style="' + pos + ';--c-area:' + col + '" title="' + esc(e.testo) + '">' +
        check + (e.tipo === 'azione' && !opts.mini && opts.interactive ? '<span class="manico" data-manico aria-hidden="true">' + ICO('dots', 12) + '</span>' : '') +
        '<span class="tl-blk-t">' + (e.mit ? ICO('star', 9) + ' ' : '') + esc(e.testo) + '</span>' +
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
        var manico = el.matches('[data-manico]') ? el : el.querySelector('[data-manico]');
        var dalManico = !!(manico && (ev.target === manico || manico.contains(ev.target) || ev.target.closest('[data-manico]')));
        /* Col dito, se l'elemento ha un manico si prende SOLO da lì: toccando
           il corpo il browser vorrebbe selezionare il testo (era il bug) e la
           pagina deve restare scorribile. Preso dal manico l'intenzione è
           chiara, quindi parte subito senza tenere premuto. */
        if (tocco && manico && !dalManico) return;
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
            if (dalManico && Math.abs(dx) + Math.abs(dy) > 4) { avvia(); if (!trasc) return; }
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
        if (tocco && dalManico) { ev.preventDefault(); avvia(); }
        else if (tocco) attesa = setTimeout(function () { avvia(); spostato = true; }, 260);
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
      '<label class="campo" for="ig-ora">' + ICO('clock', 12) + ' Orario</label><input type="time" class="tl-time" id="ig-ora" value="' + (e.ora || '') + '">' +
      '<label class="campo" for="ig-dur">Durata</label><select class="tl-dur" id="ig-dur">' + durOpt + '</select>' +
      '<label class="campo" for="ig-area">Area</label>' + selectAree('ig-area', e.areaId) +
      '</div>' +
      '<div class="ig-fondo">' +
      (e.ora ? '<button class="btn btn-mini btn-ghost ig-noora">' + ICO('clock', 13) + ' Togli l’orario</button>' : '') +
      (isAz
        ? '<button class="btn btn-mini ig-indietro">' + ICO('lista', 13) + ' Togli dal giorno' + (e.passoDi ? '' : ' (torna in «Da fare»)') + '</button>' +
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
        toast(e.passoDi ? 'Tolta dal giorno: il passo resta nel progetto.' : 'Rimessa in «Da fare».', 0, 'lista');
        chiudiSheet(); ricarica();
      });
      var rim = root.querySelector('.ig-rimuovi');
      if (rim) rim.addEventListener('click', function () {
        conAnnulla('Rimossa da oggi.', 'trash', function () { LM.rimuoviAzione(id); });
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
            (e.tipo === 'azione' ? '<span class="manico" data-manico aria-hidden="true">' + ICO('dots', 12) + '</span>' : '') +
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
          '<label class="sp-lab" for="sp-aletto">' + ICO('bed', 13) + ' A letto</label><input type="time" class="tl-time" id="sp-aletto" value="' + d.sonno + '">' +
          '<label class="sp-lab" for="sp-sveglia">' + ICO('sun', 13) + ' Sveglia</label><input type="time" class="tl-time" id="sp-sveglia" value="' + d.sveglia + '">' +
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
          '<span class="sotto" style="margin:0">Ripianificare non comporta nessuna penalità.</span></div>';
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
    /* nel pop-up il titolo è già nell'intestazione del pannello: ripeterlo
       "La giornata / La giornata" era solo rumore */
    var head = opts.header === false ? '' : '<div class="tl-head"><div>' +
      (compact ? '' : '<h2>' + ICO('clock', 16) + ' ' + (opts.giorno && !d.isToday ? etichettaGiorno(k) : 'La giornata') + '</h2>') +
      '<div class="sotto">' + sottoHead + '</div></div></div>';
    var gridHtml = vuota
      ? '<div class="vuoto" style="padding:18px 8px"><b>Niente in agenda per questo giorno.</b>' + (isFuturo ? '<br>Puoi già prepararlo: aggiungi qui sotto le cose che vuoi fare.' : interactive ? '<br>Aggiungi una cosa qui sotto, o dai un orario a un’abitudine.' : '') + '</div>'
      : htmlTimeGrid(d, { interactive: interactive, spuntabile: spuntabile, nowMin: nowMin, pxh: pxh });

    if (compact) {
      var popNota = d.tray.length ? '<div class="tl-pop-note">' + ICO('clock', 12) + ' ' + d.tray.length + (d.tray.length === 1 ? ' cosa senza orario' : ' cose senza orario') + ' — dàgli un posto qui sotto.</div>' : '';
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
      if (spReset) spReset.addEventListener('click', function () { LM.azzeraRitmoGiorno(k); toast('Ripristinato il ritmo di base.', 0, 'refresh'); montaGiornata(container, opts); });
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
        /* la pastiglia è minuscola: è lei stessa il manico (niente manichino
           dentro che ruberebbe spazio e sarebbe difficile da centrare) */
        return '<span class="me-pill" data-drag-az="' + a.id + '" data-manico style="--c-area:' + LM.coloreArea(areaById(a.areaId)) + '" title="' + esc(a.testo) + '">' + esc(a.testo) + '</span>';
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
    /* Quanto siamo lontani da oggi: senza questo, spostandosi di un giorno
       cambiava solo una scritta piccola e sembrava che le frecce non
       facessero niente (i pasti e le abitudini sono uguali ogni giorno). */
    var oggi = LM.todayKey();
    var dist = orizz === 'giorno' ? LM.daysBetween(oggi, k1) : (k2 ? (k1 <= oggi && oggi <= k2 ? 0 : null) : null);
    var lontano = orizz === 'giorno' ? dist !== 0 : (giornataAncora !== oggi && dist !== 0);
    var quanto = '';
    if (orizz === 'giorno' && dist !== 0) {
      quanto = '<span class="orizz-dist' + (dist > 0 ? ' futuro' : ' passato') + '">' +
        (dist === 1 ? 'domani' : dist === -1 ? 'ieri' : dist > 0 ? 'tra ' + dist + ' giorni' : dist + ' giorni fa').replace('-', '') + '</span>';
    }
    return '<div class="orizz-barra' + (lontano ? ' via-da-oggi' : '') + '">' +
      '<button class="icona-btn" data-nav="prev" aria-label="' + (orizz === 'giorno' ? 'Giorno precedente' : 'Periodo precedente') + '">' + ICO('chevronGiu', 16) + '</button>' +
      '<span class="orizz-eti">' + testo + quanto + '</span>' +
      '<button class="icona-btn" data-nav="next" aria-label="' + (orizz === 'giorno' ? 'Giorno successivo' : 'Periodo successivo') + '">' + ICO('chevronGiu', 16) + '</button>' +
      /* "Oggi" compare solo se serve: se ci sei già non fa nulla e confondeva
         stando attaccato alla freccia "successivo" */
      (lontano ? '<button class="btn btn-mini btn-primario" data-nav="oggi">' + ICO('target', 13) + ' Oggi</button>' : '') +
      '</div>';
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
      '<div class="ritmo-riga2"><label class="campo" for="ritmo-sonno">A letto</label><input type="time" id="ritmo-sonno" value="' + esc(r.sonno) + '">' +
      '<label class="campo" for="ritmo-sveglia">Sveglia</label><input type="time" id="ritmo-sveglia" value="' + esc(r.sveglia) + '"></div>' +
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
    function orizz(id, ico, et) {
      return '<button data-orizz="' + id + '" class="' + (giornataOrizzonte === id ? 'attivo' : '') + '">' +
        '<span class="seg-ico">' + ICO(ico, 15) + '</span><span class="seg-eti">' + et + '</span></button>';
    }
    var html = topbar('La giornata', 'Le tue ore, giorno per giorno. Con ‹ › cambi giorno.');
    html += '<div class="segmenti sez-nav tabs-fisse" id="orizz-nav">' +
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
      var icoCat = { azione: 'target', abitudine: 'refresh', backlog: 'lista', inbox: 'inbox', area: 'sparkles', giornata: 'clock', focus: 'clock', impostazioni: 'ingranaggio', dati: 'save' };
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

    /* L'unica porta per le impostazioni su telefono. Sta QUI e non in cima a
       ogni schermata: un pulsante che si usa una volta al mese non può occupare
       un angolo di tutte le pagine. Sta in «Andamento» perché è la porta di
       quello che riguarda l'app e non la giornata, e su monitor non compare —
       là c'è il piede della barra laterale, dove ha sempre funzionato. */
    var html = topbar('Panoramica', 'Dati e progressi.',
      '<button type="button" class="btn btn-mini imp-porta" id="plancia-imp">' + ICO('ingranaggio', 15) + ' Impostazioni</button>',
      't-plancia');

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
    function segp(id, ico, et) {
      return '<button data-sez="' + id + '" class="' + (sezPlancia === id ? 'attivo' : '') + '">' +
        '<span class="seg-ico">' + ICO(ico, 15) + '</span><span class="seg-eti">' + et + '</span></button>';
    }
    html += '<div class="segmenti sez-nav tabs-fisse" id="sez-plancia">' + segp('riepilogo', 'dashboard', 'Riepilogo') + segp('diario', 'book', 'Diario') + segp('aree', 'sparkles', 'Aree') + segp('andamento', 'trendUp', 'Andamento') + '</div>';
    html += '<div id="sez-corpo"></div>';

    $vista.innerHTML = html;

    var bImp = document.getElementById('plancia-imp');
    if (bImp) bImp.addEventListener('click', apriImpostazioni);

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
        '<div class="sotto">Scelte in <a href="#/rituali">Rituali</a>, fatte una per volta in <a href="#/oggi">Oggi</a>. Qui sono tutte insieme.</div>' +
        '<div class="lista-azioni" id="lista-oggi"></div>' +
        '<form id="form-add" class="riga-flex mt-s"><input type="text" id="testo-add" aria-label="Aggiungi una cosa a oggi" placeholder="Aggiungi un’altra cosa a oggi…" style="flex:1;min-width:150px">' +
        '<span class="campo-area">' + selectAree('area-add') + '</span>' +
        /* pieno ce n'è uno per schermata: qui la voce principale è «Vai a
           Oggi», e aggiungere una cosa è un'azione di servizio */
        '<button class="btn btn-mini" type="submit" aria-label="Aggiungi">' + ICO('plus', 14) + '</button></form></div>' +
        '<div class="card" style="--i:1"><h2>' + ICO('trendUp', 16) + ' Costanza</h2>' +
        '<div class="sotto">XP guadagnati ogni giorno, nelle ultime 12 settimane.</div>' +
        '<div id="heatmap"></div></div></div>';

      LMCharts.heatmap(document.getElementById('heatmap'), LM.heatmapConsistenza(12));

      var lista = document.getElementById('lista-oggi');
      if (!oggi.length) {
        lista.innerHTML = '<div class="vuoto" style="padding:16px 8px">Nessuna azione scelta per oggi.<br><a href="#/rituali">Scegline in Rituali</a>.</div>';
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

  /* ============================================================
     I RITUALI, IN ORDINE DI GIORNATA
     Prima erano cinque schede pari in una barra: tre momenti del giorno,
     uno della settimana e una schermata di gestione da 38 comandi. Quattro
     nature diverse presentate come cinque scelte uguali — e la scelta
     toccava all'utente anche se l'app sa già che ora è.
     Adesso i momenti del giorno stanno in ordine (mattina, check-in, sera),
     e sotto, staccato, quello che si fa ogni tanto (settimana, abitudini).
     Ogni riga dice se è già stata fatta oggi, e quella dell'ora è già
     aperta: non c'è niente da scegliere per cominciare. */
  /* Tre nature diverse, tre gruppi — come le sezioni di un elenco iOS:
       il piano        decidere cosa fare oggi (si scrive)
       come è andata   registrare com'è andata (si misura: check-in, review)
       si ripetono     configurare le cose ricorrenti (si imposta una volta)
     Mettere «Le azioni di oggi» accanto al check-in era mettere una decisione
     accanto a una misura, e le abitudini accanto a entrambe era metterci
     dentro anche un pannello di configurazione. */
  var GRUPPI_RIT = [
    { eti: 'Il piano di oggi', ids: ['mattina'] },
    { eti: 'Come è andata',    ids: ['checkin', 'sera', 'settimana'] },
    { eti: 'Cose che si ripetono', ids: ['abitudini'] }
  ];
  /* quali sezioni sono aperte: ognuna si apre e si chiude per conto suo, e
     aprirne una non chiude le altre (linee guida Apple: le sezioni a
     scomparsa sono indipendenti, e lo stato di chi le ha aperte si rispetta) */
  var ritualiAperti = null;
  var RITUALI = [
    { id: 'mattina',   ico: 'sun',      nome: 'Le azioni di oggi',      quando: 'giorno' },
    { id: 'checkin',   ico: 'bolt',     nome: 'Check-in',               quando: 'giorno' },
    { id: 'sera',      ico: 'moon',     nome: 'Review della sera',      quando: 'giorno' },
    { id: 'settimana', ico: 'calendar', nome: 'Review della settimana', quando: 'ogni tanto' },
    { id: 'abitudini', ico: 'refresh',  nome: 'Abitudini',              quando: 'ogni tanto' }
  ];
  /* Le sezioni si ridisegnano da sole (le abitudini, per esempio, si
     riscrivono senza passare da render()): senza questo, la riga sopra
     continuava a dire «0 di 3 oggi» dopo che ne avevi spuntata una.
     Si riscrivono solo le etichette di stato: niente ridisegno, niente fuoco
     perso mentre si scrive in un campo. */
  function aggiornaStatiRituali() {
    var righe = document.querySelectorAll('#vista .rit-riga');
    if (!righe.length) return;
    righe.forEach(function (riga) {
      var id = riga.getAttribute('data-sub');
      var el = riga.querySelector('.rit-stato');
      if (!id || !el) return;
      var st = statoRituale(id);
      el.className = 'rit-stato' + (st.fatto ? ' fatto' : '');
      el.innerHTML = (st.fatto ? ICO('check', 12) + ' ' : '') + esc(st.testo);
    });
  }
  document.addEventListener('lm:change', function () {
    if (vistaCorrente() === 'rituali') aggiornaStatiRituali();
  });

  function ritualeDellOra() {
    var ora = new Date().getHours();
    return ora < 12 ? 'mattina' : (ora >= 19 ? 'sera' : 'checkin');
  }
  /* per ogni rituale: se è già stato fatto oggi e come si racconta in una riga */
  function statoRituale(id) {
    var s = LM.load(), t = LM.todayKey();
    if (id === 'mattina') {
      if (s.pianoMattina[t]) return { fatto: true, testo: 'fatto stamattina' };
      /* le azioni possono essere state scelte anche senza passare dal rituale
         (dalla Giornata, o tirandole su da Attività): dire «da fare» quando ce
         ne sono già tre in lista è una bugia che chiede una cosa già fatta */
      var n = LM.azioniDiOggi().length;
      return n ? { fatto: false, testo: n === 1 ? '1 azione scelta' : n + ' azioni scelte' }
               : { fatto: false, testo: 'da fare' };
    }
    if (id === 'checkin') {
      var n = s.checkins.filter(function (c) { return c.data === t; }).length;
      return { fatto: n > 0, testo: n === 0 ? 'nessuno oggi' : (n === 1 ? '1 oggi' : n + ' oggi') };
    }
    if (id === 'sera') {
      return s.reviewSera[t] ? { fatto: true, testo: 'fatta' } : { fatto: false, testo: 'da fare' };
    }
    if (id === 'settimana') {
      var wk = LM.weekKey(t);
      return s.reviewSettimana[wk] ? { fatto: true, testo: 'fatta' } : { fatto: false, testo: 'da fare' };
    }
    var ab = LM.abitudiniDiOggi(), f = ab.filter(function (h) { return !!h.fatti[t]; }).length;
    return { fatto: ab.length > 0 && f === ab.length, testo: ab.length ? f + ' di ' + ab.length + ' oggi' : 'nessuna per oggi' };
  }
  var inboxEditId = null;

  function vistaRituali() {
    var adesso = ritualeDellOra();
    /* alla prima apertura è aperto quello dell'ora; dopo vale quello che hai
       deciso tu, e non lo tocca più nessuno.
       Con delle abitudini ancora da spuntare si apre anche quella sezione:
       è la sola che ha un lavoro in sospeso ogni giorno, e trovarla chiusa
       significa che le abitudini di oggi non le vede chi passa di qui. */
    if (!ritualiAperti) {
      ritualiAperti = {};
      ritualiAperti[adesso] = true;
      var restano = LM.abitudiniDiOggi().filter(function (h) { return !h.fatti[LM.todayKey()]; }).length;
      if (restano) ritualiAperti.abitudini = true;
    }
    /* chi arriva da un collegamento (la riga in Oggi, «vai alle abitudini»)
       apre quella sezione SENZA chiudere le altre */
    var daScorrere = null;
    if (sottoRituale) { ritualiAperti[sottoRituale] = true; daScorrere = sottoRituale; sottoRituale = null; }

    function rigaRit(r) {
      var st = statoRituale(r.id);
      var aperto = !!ritualiAperti[r.id];
      return '<section class="rit-blocco' + (aperto ? ' aperto' : '') + '" data-rit="' + r.id + '">' +
        '<button class="rit-riga" data-sub="' + r.id + '" aria-expanded="' + aperto + '" aria-controls="corpo-rit-' + r.id + '">' +
        '<span class="rit-ico">' + ICO(r.ico, 16) + '</span>' +
        '<span class="rit-nome">' + r.nome + '</span>' +
        (r.id === adesso ? '<span class="rit-ora">adesso</span>' : '') +
        '<span class="rit-stato' + (st.fatto ? ' fatto' : '') + '">' + (st.fatto ? ICO('check', 12) + ' ' : '') + esc(st.testo) + '</span>' +
        '<span class="rit-chevron' + (aperto ? ' aperta' : '') + '">' + ICO('chevronGiu', 15) + '</span></button>' +
        (aperto ? '<div class="rit-corpo" id="corpo-rit-' + r.id + '"></div>' : '') +
        '</section>';
    }

    var corpoHtml = GRUPPI_RIT.map(function (g) {
      var righe = g.ids.map(function (id) {
        return rigaRit(RITUALI.filter(function (r) { return r.id === id; })[0]);
      }).join('');
      return '<div class="rit-eti">' + g.eti + '</div><div class="rit-gruppo">' + righe + '</div>';
    }).join('');

    $vista.innerHTML = topbar('Rituali', 'Mattina, sera e abitudini.') + corpoHtml;

    /* disegna il contenuto di TUTTE le sezioni aperte */
    var disegna = {
      mattina: ritualeMattina, abitudini: ritualeAbitudini,
      checkin: ritualeCheckin, sera: ritualeSera, settimana: ritualeSettimana
    };
    Object.keys(disegna).forEach(function (id) {
      var c = document.getElementById('corpo-rit-' + id);
      if (c) disegna[id](c);
    });

    $vista.querySelectorAll('.rit-riga').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-sub');
        var eraAperto = !!ritualiAperti[id];
        if (eraAperto) delete ritualiAperti[id]; else ritualiAperti[id] = true;
        /* la riga resta dove sta: si tiene la posizione di scorrimento di
           quella riga, così aprire una sezione in fondo non fa saltare la
           pagina sotto il dito */
        var primaY = b.getBoundingClientRect().top;
        render();
        var nuova = $vista.querySelector('.rit-riga[data-sub="' + id + '"]');
        if (nuova) {
          var delta = nuova.getBoundingClientRect().top - primaY;
          if (delta) window.scrollBy(0, delta);
          nuova.focus({ preventScroll: true });
        }
      });
    });

    if (daScorrere) {
      var el = $vista.querySelector('.rit-blocco[data-rit="' + daScorrere + '"]');
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }

  function testaRituale(icona, titolo, sotto) {
    void icona; void titolo;
    /* senza testo non resta un paragrafo vuoto a fare spazio */
    return sotto ? '<p class="rituale-intro">' + sotto + '</p>' : '';
  }

  function ritualeMattina(corpo) {
    var s = LM.load();
    var t = LM.todayKey();
    var piano = s.pianoMattina[t];
    var oggi = LM.azioniDiOggi();

    corpo.innerHTML = '<div class="card">' +
      testaRituale('sun', 'Le azioni di oggi',
        'Le scegli qui e le fai in <i>Oggi</i>. La prima è quella più importante. Ogni giorno riparte da capo.') +
      '<div class="lista-azioni" id="piano-lista"></div>' +
      /* Tre è il consiglio, non un muro: chi ha una giornata piena deve poter
         scrivere quello che gli serve. Oltre le tre lo diciamo e basta. */
      '<form id="form-piano" class="mt-s"><div class="riga-flex">' +
      '<input type="text" id="piano-testo" aria-label="Una cosa da fare oggi" placeholder="' + (oggi.length === 0 ? 'La cosa più importante di oggi…' : 'Un’altra cosa (se vuoi)…') + '" style="flex:1;min-width:180px">' +
      '<span class="campo-area">' + selectAree('piano-area') + '</span>' +
      /* il pieno di questa scheda è «Salva e parti»: aggiungere una riga
         alla lista è il passaggio, non il traguardo */
      '<button class="btn" type="submit" aria-label="Aggiungi">' + ICO('plus', 16) + '</button></div>' +
      (oggi.length >= 3 ? '<div class="sotto" style="margin:8px 0 0">Hai <b>' + oggi.length + '</b> azioni per oggi. Oltre tre diventa difficile finirle: le altre si possono spostare a domani da <i>La giornata</i>.</div>' : '') +
      '</form>' +
      '<label class="campo" for="piano-ifthen">Quando e dove inizi la prima?</label>' +
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
      : '<div class="vuoto" style="padding:14px">Niente scelto. La prima che scrivi diventa la più importante.</div>';

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

  /* ============================================================
     ABITUDINI
     Il lavoro di ogni giorno è spuntare tre righe; il lavoro di una volta
     è decidere quali sono e quando. Prima stavano nella stessa schermata,
     con lo stesso peso: ogni abitudine compariva DUE volte — una nella
     lista di oggi e una nell'elenco per modificarla — e l'elenco delle
     modifiche si prendeva il 70% dell'altezza (713 px su 1039 con tre
     abitudini, 1770 su 2256 con otto). Il gesto quotidiano finiva
     schiacciato in una striscia dentro un pannello di impostazioni.
     Adesso c'è una lista sola, in stile elenco di iOS: la riga si spunta,
     e toccandola si apre la sua scheda con tutto il resto (nome, giorni,
     area, periodo, la catena degli ultimi 28 giorni, salta oggi,
     elimina). Le cose che non tocchi quasi mai non occupano più lo
     schermo di quelle che tocchi tutti i giorni.
     ============================================================ */

  /* La catena: gli ultimi n giorni, per vedere a colpo d'occhio come sta
     andando. Le caselle passate si toccano — capita di ricordarsi la sera
     di una cosa fatta il giorno prima, e i dati lo permettevano già senza
     che ci fosse un modo per dirlo. */
  function giorniAbitudine(h, settimane) {
    /* incolonnati per giorno della settimana, come un calendario: se le
       caselle scorrono via una dietro l'altra non si vede più che «il
       martedì salta sempre», che è l'unica cosa che una griglia sa dire e
       una lista no. Si parte dal lunedì di N settimane fa e si arriva a
       fine settimana: gli ultimi giorni possono essere nel futuro. */
    var oggi = LM.todayKey();
    var inizio = LM.addDays(LM.weekKey(oggi), -7 * (settimane - 1));
    var out = [];
    for (var i = 0; i < settimane * 7; i++) {
      var k = LM.addDays(inizio, i);
      out.push({
        k: k,
        fatto: !!(h.fatti && h.fatti[k]),
        saltato: !!(h.salti && h.salti[k]),
        prevista: LM.abitudinePrevista(h, k),
        futuro: k > oggi,
        oggi: k === oggi
      });
    }
    return out;
  }

  function statoAbitudineOggi(h) {
    var k = LM.todayKey();
    return { fatta: !!(h.fatti && h.fatti[k]), saltata: !!(h.salti && h.salti[k]) };
  }

  /* Cosa dice la riga sotto al nome: la serie se c'è, altrimenti il motivo
     per cui oggi non è in lista. */
  /* «torna martedì» invece di «L M V»: il giorno in cui tocca è
     un'informazione, l'elenco delle iniziali va tradotto ogni volta. */
  function quandoTorna(h) {
    var k = LM.prossimaAbitudine(h);
    if (!k) return null;
    if (k === LM.addDays(LM.todayKey(), 1)) return 'torna domani';
    var g = LM.weekdayShort(k);
    var nomi = { lun: 'lunedì', mar: 'martedì', mer: 'mercoledì', gio: 'giovedì', ven: 'venerdì', sab: 'sabato', dom: 'domenica' };
    if (LM.daysBetween(LM.todayKey(), k) <= 7) return 'torna ' + (nomi[g] || g);
    return 'torna il ' + LM.fmtShort(k);
  }

  function sottoAbitudine(h, previstaOggi) {
    var st = statoAbitudineOggi(h);
    if (st.saltata) return { testo: 'saltata oggi', cls: 'saltata' };
    if (!previstaOggi) {
      var oggi = LM.todayKey();
      if (h.da && oggi < h.da) return { testo: 'comincia il ' + LM.fmtShort(h.da), cls: '' };
      if (h.a && oggi > h.a) return { testo: 'finita il ' + LM.fmtShort(h.a), cls: '' };
      return { testo: quandoTorna(h) || riepilogoGiorni(h.giorni), cls: '' };
    }
    /* Per le abitudini di oggi la seconda riga la merita solo la serie:
       ripetere «ogni giorno» sotto ogni riga di una lista intitolata
       «Oggi» è una parola che si legge sei volte e non dice niente. */
    var serie = LM.streakAbitudine(h);
    if (serie > 1) return { testo: serie + ' giorni di fila', cls: 'serie', ico: 'flame' };
    if (serie === 1) return { testo: 'cominciata oggi', cls: 'serie', ico: 'flame' };
    return null;
  }

  function rigaAbitudine(h, previstaOggi) {
    var st = statoAbitudineOggi(h);
    var sotto = sottoAbitudine(h, previstaOggi);
    var ar = areaById(h.areaId);
    return '<div class="lista-riga ab-riga' + (st.fatta ? ' fatta' : '') + (st.saltata ? ' saltata' : '') +
      '" data-abid="' + h.id + '" style="--c-area:' + LM.coloreArea(ar) + '">' +
      (st.saltata
        ? '<span class="lista-vuoto" aria-hidden="true">' + ICO('moon', 14) + '</span>'
        : '<button class="lista-azione spunta" data-toggle-ab="' + h.id + '" aria-pressed="' + (st.fatta ? 'true' : 'false') +
          '" aria-label="' + esc(h.testo) + (st.fatta ? ', fatta oggi' : ', segna come fatta') + '">' + ICO('check', 13) + '</button>') +
      '<button class="lista-apri" data-abdett="' + h.id + '" aria-label="Apri ' + esc(h.testo) + '">' +
      '<span class="lista-corpo"><span class="lista-tit">' + esc(h.testo) + '</span>' +
      (sotto ? '<span class="lista-sub' + (sotto.cls ? ' ' + sotto.cls : '') + '">' +
        (sotto.ico ? ICO(sotto.ico, 11, 'fiamma') + ' ' : '') + esc(sotto.testo) + '</span>' : '') + '</span>' +
      (h.ora ? '<span class="lista-val">' + esc(h.ora) + '</span>' : '') +
      '<span class="tit-area" style="--c-area:' + LM.coloreArea(ar) + '" title="' + esc(ar.nome) + '">' + ICO(ar.icona, 13) + '</span>' +
      '<span class="lista-chev">' + ICO('chevronGiu', 15) + '</span></button>' +
      '</div>';
  }

  function ritualeAbitudini(corpo) {
    var s = LM.load();
    /* con un orario la lista prende la forma della giornata: prima quelle
       che hanno un'ora, in ordine, poi quelle che si fanno quando capita */
    var oggi = LM.abitudiniDiOggi().slice().sort(function (a, b) {
      if (a.ora && b.ora) return a.ora < b.ora ? -1 : (a.ora > b.ora ? 1 : 0);
      if (a.ora) return -1;
      if (b.ora) return 1;
      return 0;
    });
    var idOggi = {};
    oggi.forEach(function (h) { idOggi[h.id] = true; });
    var altre = s.abitudini.filter(function (h) { return !idOggi[h.id]; });
    var fatte = oggi.filter(function (h) { return !!h.fatti[LM.todayKey()]; }).length;

    /* Il conto di oggi, in cima e in una riga: è la sola cosa che si
       guarda arrivando, e quando è pieno vale come premio. */
    var prog = '';
    if (oggi.length) {
      var tutte = fatte === oggi.length;
      prog = '<div class="ab-prog' + (tutte ? ' piena' : '') + '">' +
        '<div class="ab-prog-testo">' +
        (tutte ? ICO('check', 14) + ' <b>Fatte tutte</b>, per oggi ci sei.'
               : '<b>' + fatte + '</b> di ' + oggi.length + ' per oggi') + '</div>' +
        '<div class="ab-prog-barra"><span style="width:' + Math.round(fatte / oggi.length * 100) + '%"></span></div>' +
        '</div>';
    }

    /* Ordine: prima com'è messa oggi, poi le abitudini, e in fondo il campo
       per aggiungerne una — come negli elenchi di iOS, dove la riga nuova
       sta sotto quelle che ci sono già. Prima stava in cima perché sopra
       c'erano millequattrocento pixel di impostazioni da scavalcare: adesso
       che quelle sono dentro le schede, la sezione intera sta in uno schermo
       e il campo si raggiunge senza scorrere.
       La spiegazione compare solo finché non c'è niente: dopo si è già
       capito, e sarebbero due righe rilette ogni volta. */
    corpo.innerHTML = '<div class="card">' +
      (s.abitudini.length
        ? testaRituale('refresh', 'Abitudini', '')
        : testaRituale('refresh', 'Abitudini',
          'Le azioni che vuoi ripetere. Ogni volta che le fai, la serie cresce.')) +
      prog +
      (oggi.length
        ? '<div class="lista-eti">Oggi</div><div class="lista">' +
          oggi.map(function (h) { return rigaAbitudine(h, true); }).join('') + '</div>'
        : (s.abitudini.length
          ? '<div class="vuoto" style="padding:14px 8px">Per oggi non è prevista nessuna abitudine.</div>'
          : '<div class="vuoto" style="padding:14px 8px">Non ne hai ancora. Scrivine una qui sotto: «leggere 20 minuti», «camminare», quello che vuoi ripetere.</div>')) +
      (altre.length
        ? '<div class="lista-eti">Le altre</div><div class="lista">' +
          altre.map(function (h) { return rigaAbitudine(h, false); }).join('') + '</div>'
        : '') +
      '<div class="ab-nuova">' +
      rigaAggiunta('agg-ab', 'Nuova abitudine…',
        '<span class="agg-eti">In che giorni?</span>' +
        '<div id="agg-ab-giorni" class="agg-giorni">' + chipsGiorni([]) + '</div>' +
        '<span class="agg-nota">nessuno selezionato = ogni giorno</span>' +
        /* l'ora si decide adesso, mentre l'intenzione è fresca: è il
           momento in cui si sa ancora quando la si vuole fare */
        '<label class="agg-ora"><span class="agg-eti">alle</span>' +
        '<input type="time" class="tl-time" id="agg-ab-ora" aria-label="A che ora (facoltativo)"></label>' +
        '<label class="agg-area"><span class="agg-eti">in</span>' + selectAree('agg-ab-area', 'salute') + '</label>') +
      '</div>' +
      '</div>';

    corpo.querySelectorAll('[data-toggle-ab]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        feedbackSpunta(ev, LM.completaAbitudine(b.getAttribute('data-toggle-ab')), 'Fatta. Continua così', 'flame');
        ritualeAbitudini(corpo);
      });
    });
    corpo.querySelectorAll('[data-abdett]').forEach(function (b) {
      b.addEventListener('click', function () {
        apriDettaglioAbitudine(b.getAttribute('data-abdett'), function () { ritualeAbitudini(corpo); });
      });
    });
    var nuovaG = corpo.querySelector('#agg-ab-giorni');
    nuovaG.querySelectorAll('.giorno-chip').forEach(function (chip) {
      chip.addEventListener('click', function () { chip.classList.toggle('sel'); });
    });
    wireRigaAggiunta(corpo, 'agg-ab', function (testo, opz) {
      var giorni = leggiGiorni(opz.querySelector('#agg-ab-giorni'));
      var ora = opz.querySelector('#agg-ab-ora').value || null;
      LM.aggiungiAbitudine(testo, opz.querySelector('#agg-ab-area').value, giorni, { ora: ora });
      toast('«' + testo + '» ' + riepilogoGiorni(giorni) + (ora ? ' alle ' + ora : '') + ', da oggi.', 0, 'refresh');
      ritualeAbitudini(corpo);
      /* i giorni tornano vuoti e il fuoco resta nel campo: la scelta valeva
         per quell'abitudine, non per la prossima */
      var i = corpo.querySelector('#agg-ab .agg-testo');
      if (i) i.focus({ preventScroll: true });
    });
  }

  /* La scheda di un'abitudine: quello che prima stava sempre in vista per
     tutte, qui sta per una sola e solo quando serve. In cima c'è oggi
     (fatta / salta), poi la catena, poi le impostazioni. */
  function apriDettaglioAbitudine(id, dopo) {
    function trova() { return LM.load().abitudini.find(function (x) { return x.id === id; }); }
    var h0 = trova();
    if (!h0) return;

    function corpoHtml() {
      var h = trova();
      if (!h) return '';
      var st = statoAbitudineOggi(h);
      var serie = LM.streakAbitudine(h);
      var record = LM.recordAbitudine(h);
      var volte = Object.keys(h.fatti || {}).length;
      var giorni = giorniAbitudine(h, 4);
      var prevista = LM.abitudinePrevista(h, LM.todayKey());

      var catena = '<div class="abd-testa">' + GIORNI_ORD.map(function (d) {
          return '<span>' + GIORNI_LAB[d] + '</span>';
        }).join('') + '</div>' +
        '<div class="abd-catena" role="group" aria-label="Le ultime quattro settimane">' +
        giorni.map(function (g) {
          if (g.futuro) return '<span class="abd-g futuro" aria-hidden="true"></span>';
          var cls = 'abd-g' + (g.fatto ? ' fatto' : '') + (g.saltato ? ' saltato' : '') +
            (!g.prevista && !g.fatto && !g.saltato ? ' fuori' : '') + (g.oggi ? ' oggi' : '');
          var che = g.fatto ? 'fatta' : g.saltato ? 'saltata' : g.prevista ? 'non fatta' : 'non prevista';
          return '<button class="' + cls + '" data-giorno-ab="' + g.k + '" aria-pressed="' + (g.fatto ? 'true' : 'false') +
            '" aria-label="' + LM.fmtShort(g.k) + ', ' + che + '" title="' + LM.fmtShort(g.k) + '">' +
            '<span>' + LM.fmtShort(g.k).split(' ')[0] + '</span></button>';
        }).join('') + '</div>';

      return '<div class="abd">' +
        '<div class="abd-oggi">' +
        (st.saltata
          ? '<button class="btn btn-grande" id="abd-rimetti">' + ICO('refresh', 16) + ' Rimetti oggi</button>' +
            '<p class="abd-nota">Oggi è saltata: non conta come mancata e la serie non si rompe.</p>'
          : '<button class="btn btn-grande ' + (st.fatta ? 'btn-ok' : 'btn-primario') + '" id="abd-fatta">' +
            ICO('check', 16) + (st.fatta ? ' Fatta oggi' : ' Segna come fatta') + '</button>' +
            (prevista ? '<button class="btn btn-mini btn-ghost" id="abd-salta">' + ICO('moon', 14) + ' Salta oggi</button>' : '')) +
        '</div>' +
        '<div class="abd-numeri">' +
        /* una fiamma accanto a uno zero è solo un rimprovero: quando la
           serie non c'è si dice com'è, senza medaglia spenta */
        (serie > 0
          ? '<span>' + ICO('flame', 13, 'fiamma') + ' <b>' + serie + '</b> ' + (serie === 1 ? 'giorno di fila' : 'giorni di fila') + '</span>'
          : '<span>nessuna serie aperta</span>') +
        (record > serie ? '<span>record <b>' + record + '</b></span>' : '') +
        '<span><b>' + volte + '</b> ' + (volte === 1 ? 'volta in tutto' : 'volte in tutto') + '</span>' +
        '</div>' +
        catena +
        '<p class="abd-nota">Tocca un giorno passato se te ne sei ricordato dopo.</p>' +
        '<hr class="separatore">' +
        '<label class="campo" for="abd-nome">Nome</label>' +
        '<input type="text" id="abd-nome" value="' + esc(h.testo) + '">' +
        '<label class="campo">Quando ripeterla</label>' +
        '<div id="abd-giorni">' + chipsGiorni(h.giorni) + '</div>' +
        '<div class="abd-nota-giorni">' + esc(riepilogoGiorni(h.giorni)) + '</div>' +
        /* Un'abitudine attaccata a un'ora precisa si fa molto più spesso di
           una lasciata a «quando capita»: è la parte «quando e dove» delle
           intenzioni di attuazione, l'unica cosa che nella ricerca sposta
           davvero la percentuale di volte in cui una cosa viene fatta.
           E con un'ora l'abitudine compare anche nella giornata, al suo
           posto, invece di restare una riga fuori dal tempo. */
        '<label class="campo" for="abd-ora">A che ora</label>' +
        '<div class="abd-orario">' +
        '<input type="time" class="tl-time" id="abd-ora" value="' + (h.ora || '') + '">' +
        '<select class="tl-dur" id="abd-dur" aria-label="Quanto dura">' +
        DURATE.map(function (o) { return '<option value="' + o.v + '"' + ((h.durata || '') === o.v ? ' selected' : '') + '>' + o.t + '</option>'; }).join('') +
        '</select>' +
        (h.ora ? '<button class="btn btn-mini btn-ghost" id="abd-noora">' + ICO('clock', 13) + ' Togli l’orario</button>'
               : '<span class="ap-nota">senza orario: la fai quando capita</span>') +
        '</div>' +
        '<label class="campo" for="abd-area">Area</label>' + selectAree('abd-area', h.areaId) +
        '<label class="campo">Per quanto vale</label>' +
        '<div class="abd-periodo">' +
        '<label class="ap-campo">dal <input type="date" id="abd-da" value="' + (h.da || '') + '"></label>' +
        '<label class="ap-campo">al <input type="date" id="abd-a" value="' + (h.a || '') + '" min="' + (h.da || '') + '"></label>' +
        (h.a ? '<button class="btn btn-mini btn-ghost" id="abd-nofine">Senza fine</button>' : '<span class="ap-nota">vuoto = senza fine</span>') +
        '</div>' +
        '<div class="abd-fondo"><button class="btn btn-mini btn-ghost imp-pericolo" id="abd-del">' + ICO('trash', 14) + ' Elimina l’abitudine</button></div>' +
        '</div>';
    }

    function ridisegna() {
      var root = document.getElementById('sheet-corpo');
      if (!root) return;
      root.innerHTML = corpoHtml();
      collega(root);
      if (dopo) dopo();
    }

    function collega(root) {
      var h = trova();
      if (!h) { chiudiSheet(); if (dopo) dopo(); return; }
      var f = root.querySelector('#abd-fatta');
      if (f) f.addEventListener('click', function (ev) {
        feedbackSpunta(ev, LM.completaAbitudine(id), 'Fatta. Continua così', 'flame');
        ridisegna();
      });
      var salta = root.querySelector('#abd-salta');
      if (salta) salta.addEventListener('click', function () {
        LM.saltaGiornoAbitudine(id);
        toast('Saltata per oggi. La serie regge.', 0, 'moon');
        ridisegna();
      });
      var rim = root.querySelector('#abd-rimetti');
      if (rim) rim.addEventListener('click', function () { LM.saltaGiornoAbitudine(id); ridisegna(); });
      root.querySelectorAll('[data-giorno-ab]').forEach(function (b) {
        b.addEventListener('click', function () {
          var k = b.getAttribute('data-giorno-ab');
          if (k > LM.todayKey()) return;
          LM.completaAbitudine(id, k);
          ridisegna();
        });
      });
      var nome = root.querySelector('#abd-nome');
      nome.addEventListener('change', function () {
        var v = nome.value.trim();
        if (!v) { nome.value = h.testo; return; }
        LM.modificaAbitudine(id, { testo: v });
        var tit = document.getElementById('sheet-titolo');
        if (tit) tit.textContent = v;
        if (dopo) dopo();
      });
      var gg = root.querySelector('#abd-giorni');
      gg.querySelectorAll('.giorno-chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          chip.classList.toggle('sel');
          LM.modificaAbitudine(id, { giorni: leggiGiorni(gg) });
          ridisegna();
        });
      });
      var ora = root.querySelector('#abd-ora');
      ora.addEventListener('change', function () { LM.modificaAbitudine(id, { ora: ora.value || null }); ridisegna(); });
      var dur = root.querySelector('#abd-dur');
      dur.addEventListener('change', function () { LM.modificaAbitudine(id, { durata: dur.value ? +dur.value : null }); if (dopo) dopo(); });
      var noora = root.querySelector('#abd-noora');
      if (noora) noora.addEventListener('click', function () { LM.modificaAbitudine(id, { ora: null }); ridisegna(); });
      root.querySelector('#abd-area').addEventListener('change', function (e) {
        LM.modificaAbitudine(id, { areaId: e.target.value });
        if (dopo) dopo();
      });
      var da = root.querySelector('#abd-da'), a = root.querySelector('#abd-a');
      da.addEventListener('change', function () { LM.impostaPeriodoAbitudine(id, da.value || null, trova().a); ridisegna(); });
      a.addEventListener('change', function () { LM.impostaPeriodoAbitudine(id, trova().da, a.value || null); ridisegna(); });
      var nf = root.querySelector('#abd-nofine');
      if (nf) nf.addEventListener('click', function () { LM.impostaPeriodoAbitudine(id, trova().da, null); ridisegna(); });
      root.querySelector('#abd-del').addEventListener('click', function () {
        conAnnulla('Abitudine eliminata.', 'trash', function () {
          LM.rimuoviAbitudine(id);
          chiudiSheet();
          if (dopo) dopo();
        });
      });
    }

    apriSheet(h0.testo, corpoHtml(), collega);
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
        'Energia, concentrazione e umore su una scala da 1 a 5. Conta l’andamento nei giorni, non il numero di oggi.') +
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
        (base ? '<div class="scala-solito">' + ICO('trendUp', 12) +
          /* tutto il testo in un solo elemento: il contenitore è inline-flex
             con un gap, e un punto lasciato fuori diventava un pezzo a sé
             staccato di sei pixel («è 4.3 .») */
          '<span>La tua media recente è <b>' + base.toFixed(1) + '</b>.</span></div>' : '') +
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
      toast('Salvato.', xp, 'bolt');
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
        'Voto alle aree su cui hai lavorato, una cosa andata bene e un ostacolo. Due minuti.') +
      '<div id="voti-aree">' + ordinate.map(function (a) {
        return '<div class="voto-area" data-area="' + a.id + '" style="--c-area:' + LM.coloreArea(a) + '">' +
          '<span class="nome">' + ICO(a.icona, 16) + ' ' + esc(a.nome) + '</span>' +
          '<span class="stelline">' + [1, 2, 3, 4, 5].map(function (v) {
            return '<button data-v="' + v + '"' + (votiOggi[a.id] === v ? ' class="sel"' : '') + '>' + v + '</button>';
          }).join('') + '</span></div>';
      }).join('') + '</div>' +
      '<label class="campo" for="sera-vittoria">Una cosa andata bene oggi, anche piccola</label>' +
      '<input type="text" id="sera-vittoria" value="' + (rev ? esc(rev.vittoria || '') : '') + '" placeholder="Es. ho studiato 90 minuti senza guardare il telefono">' +
      '<label class="campo" for="sera-blocco">Un ostacolo che hai incontrato</label>' +
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
      toast('Giornata conclusa.', xp, 'moon');
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
        'Riepilogo della settimana e una cosa da portare in quella dopo. Dieci minuti.') +
      '<div class="eroe-statistiche" style="justify-content:center;margin-bottom:16px">' +
      '<div class="stat"><span class="stat-val">' + xpSett + '</span><span class="stat-eti">XP guadagnati</span></div>' +
      '<div class="stat"><span class="stat-val">' + azioniSett + '</span><span class="stat-eti">azioni completate</span></div>' +
      '<div class="stat"><span class="stat-val">' + attivi + '/7</span><span class="stat-eti">giorni attivi</span></div>' +
      '</div>' +
      '<label class="campo" for="w-vittorie">Cosa ha funzionato questa settimana</label><textarea id="w-vittorie">' + (rev ? esc(rev.vittorie || '') : '') + '</textarea>' +
      '<label class="campo" for="w-blocchi">Gli ostacoli che si sono ripetuti</label><textarea id="w-blocchi">' + (rev ? esc(rev.blocchi || '') : '') + '</textarea>' +
      '<label class="campo" for="w-imparato">Cosa hai imparato sul tuo metodo</label><textarea id="w-imparato">' + (rev ? esc(rev.imparato || '') : '') + '</textarea>' +
      '<label class="campo" for="w-prossima">L’unica cosa che vuoi cambiare la prossima settimana</label><textarea id="w-prossima">' + (rev ? esc(rev.prossima || '') : '') + '</textarea>' +
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

  var backlogAperte = {};   // { __tutte, __parcheggio }
  var attTab = null;        // 'sistemare' | 'dafare'
  var attTabMostrata = '';  // per animare solo al cambio di scheda
  var attArea = 'tutte';    // il filtro: 'tutte' | 'data' | 'progetti' | id area
  var attQuery = '';        // ricerca testo

  /* ============================================================
     VISTA: ATTIVITÀ
     Rifatta partendo da cosa si viene a fare qui, non da cosa si può
     mostrare. I lavori sono due: svuotare la coda delle note appena
     catturate, e scegliere cosa fare da una lista. Tutto il resto — le
     scadenze, i progetti, le aree — non è un altro posto: è un modo di
     guardare la stessa lista.

     Com'era: quattro linguette, di cui due («In arrivo», «Progetti») erano
     sottoinsiemi della terza disegnati da funzioni diverse, con impaginati
     diversi. Dentro, altri cinque modi di tagliare la stessa lista:
     pastiglie delle aree, un interruttore per le aree vuote, la ricerca,
     tre fasce di importanza, due tasti «mostra il resto». Fino a diciotto
     comandi prima di vedere un'attività. E la stessa riga aveva tre
     densità diverse a seconda della fascia, con una striscia di colore sul
     fianco che ripeteva un'informazione già data dall'icona.

     Com'è: due destinazioni e UNA fila di filtri, dove «Con una data» e
     «Progetti» stanno accanto alle aree. Una sola riga, uguale in ogni
     elenco dell'app: comando a sinistra, titolo, valore a destra,
     freccina. Toccando la riga si apre la sua scheda, che è l'unico posto
     dove si sistemano le cose (giorno, scadenza, passi, area, nome).
     ============================================================ */

  function vistaInbox() {
    var s = LM.load();
    var nInbox = s.inbox.length;
    if (attTab !== 'sistemare' || !nInbox) attTab = nInbox && attTab !== 'dafare' ? 'sistemare' : 'dafare';
    if (!nInbox) attTab = 'dafare';

    var html = topbar('Attività', 'Tutto quello che hai da fare.');
    /* Due linguette, e la prima esiste solo finché c'è una coda da
       svuotare: una destinazione sempre a zero è una parola in più da
       scartare ogni volta. */
    function tb(id, ico, et, n) {
      return '<button data-att="' + id + '" class="' + (attTab === id ? 'attivo' : '') + '">' +
        '<span class="seg-ico">' + ICO(ico, 16) + '</span>' +
        '<span class="seg-eti">' + et + '</span>' +
        (n ? '<span class="att-badge">' + n + '</span>' : '') + '</button>';
    }
    if (nInbox) {
      html += '<div class="segmenti sez-nav tabs-fisse tabs-due att-tabs" id="att-tabs">' +
        tb('sistemare', 'inbox', 'Da sistemare', nInbox) +
        tb('dafare', 'lista', 'Da fare', s.backlog.length) + '</div>';
    }
    html += '<div id="att-corpo"></div>';
    $vista.innerHTML = html;
    var tabs = document.getElementById('att-tabs');
    if (tabs) tabs.querySelectorAll('[data-att]').forEach(function (b) {
      b.addEventListener('click', function () {
        attTab = b.getAttribute('data-att');
        tabs.querySelectorAll('[data-att]').forEach(function (x) { x.classList.toggle('attivo', x.getAttribute('data-att') === attTab); });
        ridisegna();
      });
    });
    ridisegna();

    function ridisegna() {
      var c = document.getElementById('att-corpo');
      if (!c) return;
      var cambio = attTab !== attTabMostrata;
      var scrollPrima = cambio ? 0 : (window.scrollY || document.documentElement.scrollTop || 0);
      if (attTab === 'sistemare' && LM.load().inbox.length) disegnaSmista(c);
      else disegnaDaFare(c);
      attTabMostrata = attTab;
      if (cambio) animaIngresso(c);
      else if (scrollPrima) window.scrollTo(0, scrollPrima);
    }

    /* ---------- Da sistemare: le note appena catturate ---------- */
    function disegnaSmista(box) {
      var st = LM.load();
      box.innerHTML = '<div class="lista-eti">Da sistemare</div>' +
        '<div class="lista">' + st.inbox.map(function (el, idx) {
          var quando = new Date(el.creata).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
          var primo = idx === 0;
          if (el.id === inboxEditId) {
            return '<div class="lista-riga sm-riga" data-iid="' + el.id + '">' +
              '<form class="sm-modifica" data-edit="' + el.id + '">' +
              '<input type="text" value="' + esc(el.testo) + '" aria-label="Testo della nota">' +
              '<button class="btn btn-mini btn-primario" type="submit">' + ICO('save', 13) + ' Salva</button>' +
              '<button class="btn btn-mini btn-ghost" type="button" data-annulla="1">Annulla</button></form></div>';
          }
          /* Cosa è, e cosa farne: due blocchi, non cinque righe. Sopra il
             testo con la matita per correggerlo e, nella riga sotto, quando
             l'hai scritta e in che area va. Sotto, le tre scelte.
             Il pulsante pieno è solo sulla prima: sei gradienti uno sotto
             l'altro non indicano più niente. */
          return '<div class="lista-riga sm-riga" data-iid="' + el.id + '">' +
            '<div class="sm-cosa">' +
            '<button class="sm-testo" data-modifica="' + el.id + '" aria-label="Correggi il testo">' +
            '<span class="lista-tit">' + esc(el.testo) + '</span></button>' +
            '<button class="icona-btn" data-modifica="' + el.id + '" title="Correggi il testo" aria-label="Correggi il testo">' + ICO('pencil', 13) + '</button>' +
            '</div>' +
            '<div class="lista-sub sm-quando">' + esc(quando) + ' · in ' +
            selectAree('sel-' + el.id, el.areaSug || 'altro', 'Area', 'sel-compatto') + '</div>' +
            '<div class="sm-scelte">' +
            '<button class="btn btn-mini' + (primo ? ' btn-primario' : '') + '" data-fai="azione" data-iid="' + el.id + '">' + ICO('arrowRight', 13) + ' Oggi</button>' +
            '<button class="btn btn-mini" data-fai="backlog" data-iid="' + el.id + '">' + ICO('lista', 13) + ' Da fare</button>' +
            '<button class="btn btn-mini btn-ghost" data-fai="scarta" data-iid="' + el.id + '">' + ICO('trash', 13) + ' Scarta</button>' +
            '</div>' +
            '</div>';
        }).join('') + '</div>' +
        '<p class="lista-nota">Per ognuna: <b>Oggi</b> se la fai adesso, <b>Da fare</b> se la fai più avanti, <b>Scarta</b> se non serve.</p>';

      box.querySelectorAll('[data-fai]').forEach(function (b) {
        b.addEventListener('click', function () {
          var id = b.getAttribute('data-iid');
          var esito = b.getAttribute('data-fai');
          var sel = document.getElementById('sel-' + id);
          var area = sel ? sel.value : 'altro';
          if (esito === 'scarta') {
            conAnnulla('Scartata.', 'trash', function () { LM.triageInbox(id, esito, area); aggiornaNav(); ridisegna(); });
            return;
          }
          LM.triageInbox(id, esito, area);
          toast(esito === 'azione' ? 'Messa tra le cose di oggi.' : 'Aggiunta a «Da fare».', LM.XP_EVENTI.triage,
            esito === 'azione' ? 'arrowRight' : 'lista');
          aggiornaNav(); ridisegna();
        });
      });
      box.querySelectorAll('[data-modifica]').forEach(function (b) {
        b.addEventListener('click', function () { inboxEditId = b.getAttribute('data-modifica'); ridisegna(); });
      });
      box.querySelectorAll('[data-edit]').forEach(function (form) {
        var input = form.querySelector('input');
        setTimeout(function () { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }, 20);
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var v = input.value.trim();
          if (v) LM.modificaInbox(form.getAttribute('data-edit'), v);
          inboxEditId = null; ridisegna();
        });
        form.querySelector('[data-annulla]').addEventListener('click', function () { inboxEditId = null; ridisegna(); });
      });
    }

    /* ---------- Da fare: una lista, una fila di filtri ---------- */
    var MURO = 12;

    /* Le opzioni compaiono mentre scrivi, su una riga sola: prima c'era
       «QUANDO?» sopra le pastiglie e «in» davanti all'area — due etichette
       per due cose che si capiscono da sole. */
    function opzDaFare() {
      var oggiK = LM.todayKey();
      return '<button type="button" class="q-chip" data-nuovoq="' + oggiK + '">Oggi</button>' +
        '<button type="button" class="q-chip" data-nuovoq="' + LM.addDays(oggiK, 1) + '">Domani</button>' +
        '<button type="button" class="q-chip on" data-nuovoq="">Senza data</button>' +
        selectAree('agg-bk-area', areaFiltro() || 'altro', 'Area', 'agg-sel-area');
    }

    function wireAggiunta(box) {
      wireRigaAggiunta(box, 'agg-bk', function (v, opz) {
        var sel = opz.querySelector('[data-nuovoq].on');
        var giorno = sel ? sel.getAttribute('data-nuovoq') : '';
        var selArea = opz.querySelector('#agg-bk-area');
        var nb = LM.aggiungiBacklog(v, selArea ? selArea.value : 'altro');
        if (giorno) {
          LM.backlogInOggi(nb.id, giorno);
          toast('«' + v + '» messa ' + etichettaGiorno(giorno).toLowerCase() + '.', 0, 'calendar');
        } else {
          toast('«' + v + '» aggiunta a «Da fare».', 0, 'lista');
        }
        opz.querySelectorAll('[data-nuovoq]').forEach(function (c) { c.classList.toggle('on', !c.getAttribute('data-nuovoq')); });
        aggiornaNav(); ridisegna();
      });
    }

    /* i due filtri che non sono aree */
    function areaFiltro() { return (attArea === 'tutte' || attArea === 'data' || attArea === 'progetti') ? null : attArea; }
    function passaFiltro(b) {
      if (attArea === 'data') return !!b.scadenza;
      if (attArea === 'progetti') return !!(b.steps && b.steps.length);
      return true;
    }
    function nomeFiltro() {
      if (attArea === 'data') return 'Con una data';
      if (attArea === 'progetti') return 'Progetti';
      if (attArea === 'tutte') return 'Tutte';
      return areaById(attArea).nome;
    }

    function disegnaDaFare(box) {
      var st = LM.load();
      var totale = st.backlog.length;
      var conData = st.backlog.filter(function (b) { return b.scadenza; }).length;
      var nProg = st.backlog.filter(function (b) { return b.steps && b.steps.length; }).length;

      if (!totale) {
        box.innerHTML = rigaAggiunta('agg-bk', 'Aggiungi una cosa da fare…', opzDaFare()) +
          '<div class="vuoto" style="padding:22px 8px 6px">' + illoInbox() + '<b>Nessuna attività.</b><br>Aggiungine una qui sopra' +
          (st.inbox.length ? ', o sistema le note in «Da sistemare».' : '.') + '</div>';
        wireAggiunta(box);
        return;
      }

      /* I modi di guardare la lista stanno dietro UN comando che dice già
         quale è attivo. Erano una fila di pastiglie — con le due viste che
         prima erano linguette, più un'area per ogni area — e su un telefono
         diventavano cinque righe: duecento pixel di filtri sopra la cosa che
         si è venuti a leggere. Il filtro si cambia di rado; l'ordine per
         importanza è la strada principale. */
      /* Scrivere una cosa nuova e cercarne una vecchia sono due lavori
         opposti, e prima erano due campi identici affiancati dentro la
         stessa card, uno sopra l'altro nella stessa cornice. Adesso: il
         campo per aggiungere sta da solo in cima (è un'azione), e sopra la
         lista c'è una barra sottile con la lente e il filtro (sono modi di
         guardare quello che c'è già). Nessuna card intorno: una cornice in
         meno per ogni cosa. */
      var cerca = (totale >= 10 || attQuery)
        ? '<label class="att-cerca">' + ICO('lente', 15) +
          '<input type="text" id="att-q" placeholder="Cerca…" value="' + esc(attQuery) + '" aria-label="Cerca un’attività"></label>'
        : '';

      box.innerHTML =
        rigaAggiunta('agg-bk', 'Aggiungi una cosa da fare…', opzDaFare()) +
        '<div class="att-barra">' + cerca +
        '<button class="att-filtro' + (attArea === 'tutte' ? '' : ' on') + '" id="att-filtro" aria-haspopup="dialog">' +
        ICO('imbuto', 14) + '<span>' + esc(nomeFiltro()) + '</span>' +
        '<span class="lista-chev">' + ICO('chevronGiu', 14) + '</span></button>' +
        '</div>' +
        '<div id="dafare-lista"></div>';
      wireAggiunta(box);
      var q = box.querySelector('#att-q');
      if (q) q.addEventListener('input', function () { attQuery = q.value; renderLista(); });
      box.querySelector('#att-filtro').addEventListener('click', apriFiltri);
      renderLista();

      /* la scelta del filtro è un elenco, come tutti gli altri elenchi */
      function apriFiltri() {
        function voce(id, ico, eti, n) {
          return '<div class="lista-riga">' +
            '<button class="lista-apri" data-filtro="' + id + '">' +
            '<span class="lista-vuoto">' + (attArea === id ? ICO('check', 15) : '') + '</span>' +
            '<span class="lista-corpo"><span class="lista-tit">' +
            (ico ? '<span class="tit-area"' + (ico === 'area' ? ' style="--c-area:' + LM.coloreArea(areaById(id)) + '"' : '') + '>' +
              ICO(ico === 'area' ? areaById(id).icona : ico, 13) + '</span>' : '') +
            esc(eti) + '</span></span>' +
            '<span class="lista-val">' + n + '</span></button></div>';
        }
        var html = '<div class="sc">' +
          '<div class="lista-eti">Tutto</div><div class="lista">' + voce('tutte', 'lista', 'Tutte le attività', totale) + '</div>' +
          ((conData || nProg)
            ? '<div class="lista-eti">Per come sono fatte</div><div class="lista">' +
              (conData ? voce('data', 'calendar', 'Con una data', conData) : '') +
              (nProg ? voce('progetti', 'rocket', 'Divise in passi', nProg) : '') + '</div>'
            : '') +
          '<div class="lista-eti">Per area</div><div class="lista">' +
          LM.backlogPerArea().filter(function (g) { return g.items.length; })
            .map(function (g) { return voce(g.area.id, 'area', g.area.nome, g.items.length); }).join('') +
          '</div></div>';
        apriSheet('Guarda solo', html, function (root) {
          root.querySelectorAll('[data-filtro]').forEach(function (t) {
            t.addEventListener('click', function () {
              attArea = t.getAttribute('data-filtro');
              chiudiSheet();
              disegnaDaFare(box);
            });
          });
        });
      }

      function gruppo(titolo, voci, cls, opts) {
        if (!voci.length) return '';
        var lunga = (opts && opts.taglia) && voci.length > MURO;
        var tutte = !!backlogAperte.__tutte;
        var taglia = lunga && !tutte;
        var mostrate = taglia ? voci.slice(0, MURO) : voci;
        return '<div class="lista-eti">' + titolo + (voci.length > 1 ? ' <span>' + voci.length + '</span>' : '') + '</div>' +
          '<div class="lista lista-' + cls + '">' +
          mostrate.map(function (x, i) { return attRigaHtml(x.b, { primo: cls === 'ora' && i === 0, motivo: x.i && x.i.motivo, da: x.i && x.i.da }); }).join('') +
          '</div>' +
          (lunga ? '<button class="lista-altre' + (tutte ? ' aperto' : '') + '" data-tutte="1" aria-expanded="' + tutte + '">' +
            ICO('chevronGiu', 14) + (taglia ? ' Mostra le altre ' + (voci.length - MURO) : ' Mostra solo le prime ' + MURO) + '</button>' : '');
      }

      function renderLista() {
        var lista = box.querySelector('#dafare-lista');
        var query = attQuery.trim().toLowerCase();
        if (query) {
          var ris = LM.load().backlog.filter(function (b) { return b.testo.toLowerCase().indexOf(query) >= 0; });
          lista.innerHTML = '<div class="lista-eti">' + ris.length + (ris.length === 1 ? ' risultato' : ' risultati') + '</div>' +
            (ris.length
              ? '<div class="lista">' + ris.map(function (b) { return attRigaHtml(b, {}); }).join('') + '</div>'
              : '<p class="lista-nota">Nessuna corrispondenza per «' + esc(attQuery.trim()) + '».</p>');
          wireLista(lista); return;
        }
        var g = LM.backlogPerImportanza({ areaId: areaFiltro() || 'tutte', tetto: 3 });
        var ora = g.ora.filter(function (x) { return passaFiltro(x.b); });
        var poi = g.poi.filter(function (x) { return passaFiltro(x.b); });
        var parch = g.parcheggio.filter(function (x) { return passaFiltro(x.b); });
        if (!ora.length && !poi.length && !parch.length) {
          lista.innerHTML = '<p class="lista-nota">Niente in «' + esc(nomeFiltro()) + '».</p>';
          return;
        }
        var apertoParcheggio = !!backlogAperte.__parcheggio;
        lista.innerHTML =
          gruppo('Importanti', ora, 'ora') +
          gruppo('Altre', poi, 'poi', { taglia: true }) +
          (parch.length
            ? '<button class="lista-eti lista-eti-btn" data-parcheggio="1" aria-expanded="' + apertoParcheggio + '">' +
              'Inattive <span>' + parch.length + '</span>' +
              '<span class="lista-chev' + (apertoParcheggio ? ' aperta' : '') + '">' + ICO('chevronGiu', 14) + '</span></button>' +
              '<div class="lista lista-parcheggio"' + (apertoParcheggio ? '' : ' hidden') + '>' +
              parch.map(function (x) { return attRigaHtml(x.b, { motivo: x.i && x.i.motivo }); }).join('') + '</div>'
            : '');

        var bt = lista.querySelector('[data-tutte]');
        if (bt) bt.addEventListener('click', function () {
          var primaY = bt.getBoundingClientRect().top;
          backlogAperte.__tutte = !backlogAperte.__tutte;
          renderLista();
          var nuovo = lista.querySelector('[data-tutte]');
          if (nuovo) {
            var delta = nuovo.getBoundingClientRect().top - primaY;
            if (delta) window.scrollBy(0, delta);
            nuovo.focus({ preventScroll: true });
          }
        });
        var bp = lista.querySelector('[data-parcheggio]');
        if (bp) bp.addEventListener('click', function () {
          var ap = !backlogAperte.__parcheggio;
          backlogAperte.__parcheggio = ap;
          var corpo = lista.querySelector('.lista-parcheggio');
          if (corpo) corpo.hidden = !ap;
          bp.setAttribute('aria-expanded', ap);
          var ch = bp.querySelector('.lista-chev');
          if (ch) ch.classList.toggle('aperta', ap);
        });
        wireLista(lista);
      }
    }

    /* ---------- la riga, una sola in tutta l'app ----------
       comando a sinistra, titolo (più una riga sotto solo se ha qualcosa da
       dire), valore a destra, freccina. Niente tre densità, niente striscia
       di colore sul fianco: l'area la dice la sua icona davanti al titolo. */
    function attRigaHtml(b, opts) {
      var isProg = !!(b.steps && b.steps.length);
      var av = isProg ? LM.avanzamentoProgetto(b) : null;
      var ar = areaById(b.areaId);
      var inAgenda = LM.snapshot().azioni.filter(function (a) {
        return !a.done && a.data >= LM.todayKey() && (isProg ? (a.passoDi && a.passoDi.b === b.id) : a.passoDi === null && a.testo === b.testo);
      }).sort(function (x, y) { return x.data < y.data ? -1 : 1; });

      var sotto = [];
      if (b.scadenza) {
        var si = scadInfo(b.scadenza);
        sotto.push('<span class="sub-scad ' + si.cls + '">' + (si.d < 0 ? 'scaduta ' + si.testo : 'entro ' + si.testo) + '</span>');
      }
      if (inAgenda.length) {
        sotto.push('<span class="sub-agenda">' + (isProg && inAgenda.length > 1
          ? inAgenda.length + ' passi in agenda'
          : 'in agenda ' + etichettaGiorno(inAgenda[0].data).toLowerCase()) + '</span>');
      }
      /* il motivo si scrive solo se dice qualcosa che la riga non dice già:
         «iniziata, 1 di 3» accanto a «1 di 3» in coda è la stessa cosa due volte */
      if (!sotto.length && opts && opts.motivo && !isProg && !(opts.da === 'scadenza' && b.scadenza)) {
        sotto.push('<span>' + esc(opts.motivo) + '</span>');
      }

      var pieno = !!(opts && opts.primo);
      return '<div class="lista-riga att-riga" data-bid="' + b.id + '">' +
        '<button class="lista-azione' + (pieno ? ' piena' : '') + '" data-bkoggi="' + b.id + '"' +
        ' aria-label="' + (isProg ? 'Porta in Oggi il prossimo passo di ' : 'Porta in Oggi ') + esc(b.testo) + '"' +
        ' title="' + (isProg ? 'Porta in Oggi il prossimo passo' : 'Porta in Oggi') + '">' + ICO('arrowRight', 15) + '</button>' +
        '<button class="lista-apri" data-bkapri="' + b.id + '" aria-label="Apri ' + esc(b.testo) + '">' +
        '<span class="lista-corpo">' +
        '<span class="lista-tit">' +
        (b.pin ? '<span class="tit-pin" title="Tenuta in cima">' + ICO('star', 11) + '</span>' : '') +
        '<span class="tit-area" style="--c-area:' + LM.coloreArea(ar) + '" title="' + esc(ar.nome) + '">' + ICO(ar.icona, 12) + '</span>' +
        esc(b.testo) + '</span>' +
        (sotto.length ? '<span class="lista-sub">' + sotto.join(' · ') + '</span>' : '') +
        '</span>' +
        (isProg ? '<span class="lista-val">' + av.fatti + ' di ' + av.tot + '</span>' : '') +
        '<span class="lista-chev">' + ICO('chevronGiu', 15) + '</span></button>' +
        '</div>';
    }

    function wireLista(scope) {
      scope.querySelectorAll('[data-bkoggi]').forEach(function (t) {
        t.addEventListener('click', function () {
          var id = t.getAttribute('data-bkoggi');
          var it = LM.load().backlog.find(function (x) { return x.id === id; });
          if (!it) return;
          if (it.steps && it.steps.length) {
            var passo = LM.prossimoPassoInOggi(id);
            toast(passo ? 'Prossimo passo portato in Oggi.' : 'Nessun passo da fare: sono tutti in agenda o completati.', 0, passo ? 'arrowRight' : 'check');
          } else {
            LM.backlogInOggi(id);
            toast('Portata tra le cose di oggi.', 0, 'arrowRight');
          }
          aggiornaNav(); ridisegna();
        });
      });
      scope.querySelectorAll('[data-bkapri]').forEach(function (t) {
        t.addEventListener('click', function () {
          var it = LM.load().backlog.find(function (x) { return x.id === t.getAttribute('data-bkapri'); });
          if (it) apriScheda(it.id);
        });
      });
    }

    /* ---------- la scheda di un'attività ----------
       L'unico posto dove si sistema una cosa. Prima erano quattro cassetti
       grigi dentro il foglio, ognuno col titolo in maiuscolo DENTRO la
       scatola e una freccina: scatole dentro scatole, e per dare un giorno
       tre modi diversi nello stesso cassetto. Adesso è piatta: le sezioni
       sono etichette sopra il gruppo, come negli elenchi di iOS, e si
       scorre invece di aprire. */
    function apriScheda(id) {
      function trova() { return LM.load().backlog.find(function (x) { return x.id === id; }); }
      if (!trova()) return;

      function corpoHtml() {
        var b = trova();
        if (!b) return '';
        var isProg = !!(b.steps && b.steps.length);
        var oggi = LM.todayKey();
        var av = isProg ? LM.avanzamentoProgetto(b) : null;
        var aperti = (b.steps || []).filter(function (st) { return !st.done; }).length;
        var ar = areaById(b.areaId);

        function gChip(k, et) { return '<button class="q-chip" data-quando="' + k + '">' + et + '</button>'; }

        /* una riga per attributo, valore a destra: è la forma degli elenchi
           di iOS, e sostituisce tre riquadri che contenevano altri riquadri */
        function riga(eti, valore, attrib, cls) {
          return '<div class="lista-riga sc-riga' + (cls ? ' ' + cls : '') + '"' + (attrib || '') + '>' +
            '<span class="sc-eti">' + eti + '</span>' + valore + '</div>';
        }

        var passi = (b.steps || []).map(function (st) {
          var inAg = LM.snapshot().azioni.find(function (a) { return !a.done && a.passoDi && a.passoDi.b === b.id && a.passoDi.s === st.id; });
          return '<div class="lista-riga sc-passo' + (st.done ? ' fatta' : '') + '">' +
            '<button class="lista-azione spunta" data-steptoggle="' + st.id + '" aria-pressed="' + (st.done ? 'true' : 'false') +
            '" aria-label="' + esc(st.testo) + (st.done ? ', fatto' : ', segna come fatto') + '">' + ICO('check', 13) + '</button>' +
            '<span class="lista-corpo"><span class="lista-tit">' + esc(st.testo) + '</span>' +
            (inAg ? '<span class="lista-sub">in agenda ' + esc(etichettaGiorno(inAg.data).toLowerCase()) + '</span>' : '') + '</span>' +
            (st.done ? '' : '<button class="icona-btn" data-stepquando="' + st.id + '" title="Mettilo in un giorno" aria-label="Metti «' + esc(st.testo) + '» in un giorno">' + ICO('calendar', 14) + '</button>') +
            '<button class="icona-btn icona-pericolo" data-stepdel="' + st.id + '" title="Rimuovi" aria-label="Rimuovi «' + esc(st.testo) + '»">' + ICO('trash', 14) + '</button>' +
            '</div>';
        }).join('');

        return '<div class="sc">' +
          /* l'azione: una sola, e la pastiglia «Oggi» non la ripete più */
          '<button class="btn btn-primario btn-grande sc-primaria" id="sc-oggi">' + ICO('arrowRight', 16) + ' ' +
          (isProg ? 'Prossimo passo in Oggi' : 'Portala in Oggi') + '</button>' +

          '<div class="lista-eti">Se non oggi</div>' +
          '<div class="q-chips sc-quando">' +
          gChip(LM.addDays(oggi, 1), 'Domani') +
          gChip(LM.addDays(oggi, 2), etichettaGiorno(LM.addDays(oggi, 2)).split(' ')[0]) +
          gChip(LM.addDays(oggi, 7), 'Tra una settimana') +
          '<label class="q-chip q-chip-data">' + ICO('calendar', 13) + ' <span>Un altro giorno</span>' +
          '<input type="date" id="sc-quando" min="' + oggi + '" aria-label="Un altro giorno"></label>' +
          '</div>' +

          '<div class="lista-eti">Passi' + (isProg ? ' <span>' + av.fatti + ' di ' + av.tot + '</span>' : '') + '</div>' +
          '<div class="lista">' + passi +
          '<form class="lista-riga sc-agg" id="sc-passo-add">' +
          '<span class="lista-vuoto">' + ICO('plus', 15) + '</span>' +
          '<input type="text" placeholder="' + (isProg ? 'Aggiungi un passo…' : 'Dividila in passi: scrivi il primo…') + '" aria-label="Aggiungi un passo">' +
          '<button class="btn btn-mini" type="submit">Aggiungi</button></form>' +
          (isProg && aperti > 1
            ? riga('Spalma i passi aperti',
              '<span class="sc-val q-chips">' +
              '<button class="q-chip" data-distrib="1">ogni giorno</button>' +
              '<button class="q-chip" data-distrib="2">ogni 2</button>' +
              '<button class="q-chip" data-distrib="7">ogni settimana</button></span>', '', 'sc-riga-alta')
            : '') +
          '</div>' +

          '<div class="lista-eti">Dettagli</div>' +
          '<div class="lista">' +
          riga('Area', '<span class="sc-val">' + selectAree('sc-area', b.areaId, 'Area', 'sc-inline') + '</span>') +
          /* senza scadenza la riga dice «nessuna» e il campo compare al
             tocco: un «mm/gg/aaaa» vuoto in una riga di valori è l'unica
             cosa che si legge, e non dice niente */
          (b.scadenza
            ? riga('Scadenza', '<span class="sc-val">' + LM.fmtShort(b.scadenza) + ' · ' + scadInfo(b.scadenza).testo +
              '</span><button class="icona-btn" id="sc-scad-x" title="Togli la scadenza" aria-label="Togli la scadenza">' + ICO('x', 13) + '</button>' +
              '<input type="date" class="sc-nascosta" id="sc-scad" value="' + b.scadenza + '" aria-label="Scadenza">', ' data-apri-scad="1"', 'sc-tocca')
            : riga('Scadenza', '<span class="sc-val">nessuna</span>' +
              '<span class="lista-chev">' + ICO('chevronGiu', 15) + '</span>' +
              '<input type="date" class="sc-nascosta" id="sc-scad" aria-label="Scadenza">', ' data-apri-scad="1"', 'sc-tocca')) +
          '<button class="lista-riga sc-riga sc-tocca" id="sc-pin">' +
          '<span class="sc-eti">Tieni in cima</span>' +
          '<span class="sc-val">' + (b.pin ? ICO('check', 14, 'sc-si') + ' sì' : 'no') + '</span></button>' +
          '</div>' +
          '<p class="lista-nota">«Se non oggi» la mette tra le cose di quel giorno. La scadenza è solo un conto alla rovescia: non la mette in agenda.</p>' +

          '<div class="lista mt">' +
          '<button class="lista-riga sc-riga sc-tocca" id="sc-abitudine">' +
          '<span class="sc-eti">' + ICO('refresh', 14) + ' Diventa un’abitudine</span>' +
          '<span class="lista-chev">' + ICO('chevronGiu', 15) + '</span></button>' +
          '<button class="lista-riga sc-riga sc-tocca sc-pericolo" id="sc-del">' +
          '<span class="sc-eti">' + ICO('trash', 14) + ' Elimina l’attività</span></button>' +
          '</div>' +
          '</div>';
      }

      function ridisegnaScheda() {
        var root = document.getElementById('sheet-corpo');
        if (!root) return;
        root.innerHTML = corpoHtml();
        collega(root);
        ridisegna();
      }

      function collega(root) {
        var b = trova();
        if (!b) { chiudiSheet(); ridisegna(); return; }
        var isProg = !!(b.steps && b.steps.length);

        function pianifica(k) {
          if (!k) return;
          var fatto = isProg ? LM.prossimoPassoInOggi(b.id, k) : LM.backlogInOggi(b.id, k);
          if (!fatto) { toast('Nessun passo da pianificare: sono tutti in agenda o completati.', 0, 'check'); return; }
          toast(k === LM.todayKey() ? 'Messa tra le cose di oggi.' : 'Pianificata per ' + etichettaGiorno(k).toLowerCase() + '.', 0, 'calendar');
          chiudiSheet(); aggiornaNav(); ridisegna();
        }
        root.querySelector('#sc-oggi').addEventListener('click', function () { pianifica(LM.todayKey()); });
        root.querySelectorAll('[data-quando]').forEach(function (c) {
          c.addEventListener('click', function () { pianifica(c.getAttribute('data-quando')); });
        });
        var quandoData = root.querySelector('#sc-quando');
        quandoData.addEventListener('change', function () { pianifica(this.value); });
        root.querySelectorAll('[data-distrib]').forEach(function (c) {
          c.addEventListener('click', function () {
            var n = LM.distribuisciPassi(b.id, LM.todayKey(), +c.getAttribute('data-distrib'));
            toast(n ? n + (n === 1 ? ' passo messo in agenda.' : ' passi messi in agenda, uno per volta.') : 'Nessun passo da distribuire.', 0, n ? 'calendar' : 'check');
            chiudiSheet(); aggiornaNav(); ridisegna();
          });
        });
        var scad = root.querySelector('#sc-scad');
        scad.addEventListener('change', function () {
          LM.impostaScadenzaBacklog(b.id, this.value || null); ridisegnaScheda();
        });
        /* la riga è il bersaglio: tocca e si apre il calendario del sistema */
        var rigaScad = root.querySelector('[data-apri-scad]');
        if (rigaScad) rigaScad.addEventListener('click', function (ev) {
          if (ev.target.closest('#sc-scad-x')) return;
          if (scad.showPicker) { try { scad.showPicker(); return; } catch (e) { void e; } }
          scad.focus();
        });
        /* «spalma» sta in una riga di attributo, non più in un cassetto */
        var sx = root.querySelector('#sc-scad-x');
        if (sx) sx.addEventListener('click', function () { LM.impostaScadenzaBacklog(b.id, null); ridisegnaScheda(); });

        root.querySelectorAll('[data-steptoggle]').forEach(function (t) {
          t.addEventListener('click', function (ev) {
            feedbackSpunta(ev, LM.togglePasso(b.id, t.getAttribute('data-steptoggle')), 'Passo fatto.', 'check');
            ridisegnaScheda();
          });
        });
        root.querySelectorAll('[data-stepdel]').forEach(function (t) {
          t.addEventListener('click', function () {
            var sid = t.getAttribute('data-stepdel');
            conAnnulla('Passo rimosso.', 'trash', function () { LM.rimuoviPasso(b.id, sid); ridisegnaScheda(); });
          });
        });
        root.querySelectorAll('[data-stepquando]').forEach(function (t) {
          t.addEventListener('click', function () {
            var st = (trova().steps || []).find(function (x) { return x.id === t.getAttribute('data-stepquando'); });
            if (st) apriQuandoPasso(trova(), st);
          });
        });
        root.querySelector('#sc-passo-add').addEventListener('submit', function (e) {
          e.preventDefault();
          var inp = this.querySelector('input');
          var v = inp.value.trim();
          if (!v) return;
          LM.aggiungiPasso(b.id, v);
          inp.value = '';
          ridisegnaScheda();
          var nuovo = document.querySelector('#sc-passo-add input');
          if (nuovo) nuovo.focus({ preventScroll: true });
        });


        root.querySelector('#sc-area').addEventListener('change', function () { LM.cambiaAreaBacklog(b.id, this.value); ridisegna(); });
        root.querySelector('#sc-pin').addEventListener('click', function () {
          LM.appuntaBacklog(b.id);
          ridisegnaScheda();
        });
        root.querySelector('#sc-abitudine').addEventListener('click', function () { apriDaAbitudine(trova()); });
        root.querySelector('#sc-del').addEventListener('click', function () {
          conAnnulla('Attività eliminata.', 'trash', function () { LM.rimuoviBacklog(b.id); chiudiSheet(); ridisegna(); });
        });
      }

      apriSheet(trova().testo, corpoHtml(), collega);
      titoloSheetModificabile(trova().testo, function (v) { LM.modificaBacklog(id, v); ridisegna(); });
    }

    /* Quando fare UN passo: gli stessi tasti-giorno della scheda. */
    function apriQuandoPasso(prog, passo) {
      var oggi = LM.todayKey();
      var gia = LM.snapshot().azioni.find(function (a) { return !a.done && a.passoDi && a.passoDi.b === prog.id && a.passoDi.s === passo.id; });
      function chip(k, et) { return '<button class="q-chip' + (gia && gia.data === k ? ' on' : '') + '" data-qp="' + k + '">' + et + '</button>'; }
      var html = '<div class="sc">' +
        '<div class="lista-eti">Quando fare questo passo</div>' +
        '<div class="sc-gruppo">' +
        '<div class="q-chips">' + chip(oggi, 'Oggi') + chip(LM.addDays(oggi, 1), 'Domani') +
        chip(LM.addDays(oggi, 2), etichettaGiorno(LM.addDays(oggi, 2)).split(' ')[0]) +
        chip(LM.addDays(oggi, 7), 'Tra una settimana') + '</div>' +
        '<label class="sc-campo"><span>un altro giorno</span>' +
        '<input type="date" id="qp-data" min="' + oggi + '" value="' + (gia ? gia.data : LM.addDays(oggi, 1)) + '"></label>' +
        (gia ? '<button class="btn btn-mini btn-ghost" id="qp-togli">' + ICO('x', 13) + ' Togli dal giorno (' + esc(etichettaGiorno(gia.data).toLowerCase()) + ')</button>' : '') +
        '<div class="sc-nota">Comparirà tra le cose di quel giorno, in <b>La giornata</b>.</div>' +
        '</div></div>';
      apriSheet(passo.testo, html, function (root) {
        function metti(k) {
          if (!k) return;
          LM.pianificaPasso(prog.id, passo.id, k);
          toast('Passo messo ' + etichettaGiorno(k).toLowerCase() + '.', 0, 'calendar');
          chiudiSheet(); aggiornaNav(); ridisegna();
        }
        root.querySelectorAll('[data-qp]').forEach(function (c) { c.addEventListener('click', function () { metti(c.getAttribute('data-qp')); }); });
        root.querySelector('#qp-data').addEventListener('change', function () { metti(this.value); });
        var tg = root.querySelector('#qp-togli');
        if (tg) tg.addEventListener('click', function () {
          LM.azioneInBacklog(gia.id);
          toast('Passo tolto dal giorno.', 0, 'lista');
          chiudiSheet(); aggiornaNav(); ridisegna();
        });
      });
    }

    /* Da cosa-da-fare a abitudine: si scelgono i giorni e (se serve) l'ora. */
    function apriDaAbitudine(b) {
      var html = '<div class="sc">' +
        '<div class="lista-eti">In che giorni</div>' +
        '<div class="sc-gruppo">' +
        '<div id="ab-giorni">' + chipsGiorni([1, 2, 3, 4, 5, 6, 0]) + '</div>' +
        '<label class="sc-campo"><span>a che ora</span>' +
        '<input type="time" class="tl-time" id="ab-ora"></label>' +
        '<label class="sc-campo"><span>quanto dura</span>' +
        '<select class="tl-dur" id="ab-dur">' + DURATE.map(function (o) { return '<option value="' + o.v + '">' + o.t + '</option>'; }).join('') + '</select></label>' +
        '<div class="sc-nota">Vuoti vanno bene: l’abitudine resta senza orario fisso.</div>' +
        '</div>' +
        '<button class="btn btn-primario btn-grande sc-primaria" id="ab-crea">' + ICO('check', 15) + ' Crea l’abitudine</button>' +
        '<div class="sc-nota" style="text-align:center">Esce da «Da fare» e la ritrovi in <b>Rituali → Abitudini</b>.</div>' +
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
          toast('Diventata un’abitudine: la trovi in Rituali.', 0, 'refresh');
          chiudiSheet(); aggiornaNav(); ridisegna();
        });
      });
    }
  }

  /* ============================================================
     VISTA: ESPERIMENTI
     ============================================================ */

  function vistaEsperimenti() {
    var s = LM.load();
    /* con la lista vuota il pulsante sta una volta sola, dentro il riquadro
       che spiega cosa manca: due pulsanti uguali sulla stessa schermata
       sono due volte la stessa domanda */
    var vuota = !s.esperimenti.length;
    var html = topbar('Esperimenti', 'Confronto prima/dopo sui tuoi dati.',
      vuota ? '' : '<button class="btn btn-primario" id="btn-nuovo-exp">' + ICO('plus', 16) + ' Nuovo esperimento</button>') +
      '<div class="card"><div class="sotto" style="margin:0">Come funziona: prima misuri una metrica senza cambiare nulla (fase <b>A</b>, la base di partenza), poi introduci una modifica e continui a misurare (fase <b>B</b>). Il confronto tra le due fasi ti dice se la modifica ha avuto effetto. Un avvertimento onesto: senza gruppo di controllo il risultato è un’indicazione, non una prova definitiva; ripetere l’esperimento lo rende più affidabile.</div></div>' +
      '<div id="form-exp-zona"></div><div class="griglia mt" id="lista-exp" style="gap:16px"></div>';
    $vista.innerHTML = html;

    var bNuovo = document.getElementById('btn-nuovo-exp');
    if (bNuovo) bNuovo.addEventListener('click', mostraFormExp);

    var lista = document.getElementById('lista-exp');
    if (!s.esperimenti.length) {
      /* uno stato vuoto porta con sé la sua via d'uscita: il pulsante sta
         qui dentro, dove si sta guardando, non solo in cima alla pagina */
      lista.innerHTML = '<div class="card vuoto">' + illoFlask() + '<b>Non hai ancora nessun esperimento.</b><br>Qualche idea per iniziare: verificare se fare sport al mattino migliora il focus, se tenere il telefono in un’altra stanza aumenta i minuti di studio, o se andare a letto prima ti dà più energia.' +
        '<div class="vuoto-azione"><button class="btn btn-primario" id="btn-primo-exp">' + ICO('plus', 16) + ' Crea il primo esperimento</button></div></div>';
      var primo = document.getElementById('btn-primo-exp');
      if (primo) primo.addEventListener('click', mostraFormExp);
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
        '<label class="campo" for="exp-nome">Cosa vuoi scoprire</label><input type="text" id="exp-nome" placeholder="Es. studiare in biblioteca mi fa studiare di più?">' +
        '<label class="campo" for="exp-int">La modifica che vuoi testare</label><input type="text" id="exp-int" placeholder="Es. ogni pomeriggio studio in biblioteca invece che in camera">' +
        '<div class="griglia griglia-3 mt-s"><div><label class="campo" for="exp-metrica">Cosa misuri</label><select id="exp-metrica">' +
        LM.METRICHE_ESPERIMENTO.map(function (m2) { return '<option value="' + m2.id + '">' + esc(m2.nome) + '</option>'; }).join('') +
        '</select></div>' +
        '<div><label class="campo" for="exp-area">Area (se serve)</label>' + selectAree('exp-area') + '</div>' +
        '<div><label class="campo" for="exp-durata">Durata</label><select id="exp-durata">' +
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

  /* ============================================================
     VISTA: DESIGN LAB — dieci vestiti per gli stessi elementi
     ============================================================
     Il foglio di stile del laboratorio si carica SOLO qui, la prima
     volta che si apre la pagina: le altre pagine non lo scaricano
     nemmeno. E ogni sua regola è annidata sotto #lab-demo o
     #lab-scelta, quindi anche restando in memoria non può toccare
     niente fuori da questa stanza. */

  var labCssChiesto = false;
  function caricaCssLab() {
    if (labCssChiesto) return;
    labCssChiesto = true;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'assets/lab.css';
    l.id = 'lab-css';
    document.head.appendChild(l);
  }

  function vistaLab() {
    caricaCssLab();
    $vista.innerHTML = topbar('Design lab', 'Scegli la base grafica del sito.') +
      '<div id="lab-radice"></div>';
    var radice = document.getElementById('lab-radice');
    if (!window.LM_LAB) {
      radice.innerHTML = '<div class="card vuoto">Il laboratorio non si è caricato. Ricarica la pagina.</div>';
      return;
    }
    window.LM_LAB.montaIn(radice);
  }

  function vistaScienza() {
    var html = topbar('Perché l’app è fatta così', 'Le ricerche dietro ogni funzione, con le fonti.') +
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
          '<label class="campo" for="ob-nome">Nome</label><input type="text" id="ob-nome" value="' + esc(scelte.nome) + '" placeholder="Il tuo nome">' +
          '<label class="campo" for="ob-visione">In una frase, cosa vuoi ottenere migliorando</label>' +
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
  /* La riga di linguette della porta corrente. Sta SOTTO al titolo, non
     sopra: prima leggi dove sei, poi vedi cos'altro c'è dentro. Se la porta
     ha una schermata sola (Attività) non compare niente — una linguetta che
     non porta da nessuna parte è solo un'altra cosa da guardare. */
  function sottoNav(v) {
    var vecchia = $vista.querySelector('.sottonav');
    if (vecchia) vecchia.remove();
    document.documentElement.style.setProperty('--sottonav-h', '0px');
    if (!navTre()) return;
    var g = gruppoDi(v);
    var lista = g.viste.slice();
    /* se sei in una schermata «di passaggio» (Perché funziona, Design lab) la
       sua linguetta si aggiunge in fondo, attiva: non c'è normalmente, ma
       mentre ci sei dentro dice dove sei e ti riporta indietro */
    if ((g.anche || []).indexOf(v) >= 0) {
      var vi = vistaById(v);
      lista.push({ id: v, eti: (vi && vi.nome) || v });
    }
    if (lista.length < 2) return;
    var bar = document.createElement('nav');
    bar.className = 'sottonav';
    bar.setAttribute('aria-label', 'Schermate di ' + g.nome);
    bar.innerHTML = lista.map(function (x) {
      return '<a class="sottonav-voce' + (x.id === v ? ' attiva' : '') + '" href="#/' + x.id + '"' +
        (x.id === v ? ' aria-current="page"' : '') + '>' + x.eti + '</a>';
    }).join('');
    var tb = $vista.querySelector('.topbar');
    if (tb) tb.insertAdjacentElement('afterend', bar); else $vista.prepend(bar);
    /* se le linguette non ci stanno tutte (schermo stretto, «Andamento» ne ha
       quattro) l'ultima resta tagliata: una sfumatura sul bordo destro dice
       che si scorre, invece di far sembrare troncata l'interfaccia */
    if (bar.scrollWidth > bar.clientWidth + 1) bar.classList.add('scorre');
    document.documentElement.style.setProperty('--sottonav-h', (bar.offsetHeight + 14) + 'px');
  }

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
    else if (v === 'lab') vistaLab();
    sottoNav(v);
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
    if ((y.state === 'error' || y.state === 'muto') && y.error && y.error !== ultimoErroreSync) {
      ultimoErroreSync = y.error;
      toast(y.error, 0, 'cloud');
    }
    if (y.state === 'attesa' && ultimoErroreSync !== 'attesa') {
      ultimoErroreSync = 'attesa';
      toast('Nessuna rete: i dati restano salvati qui e vanno nel cloud appena torna.', 0, 'cloud');
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
