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
      toast('Dati di esempio caricati.', 0, 'sparkles');
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
  /* Le file di linguette si distinguono a occhio dal fondo bianco, ma per chi
     usa VoiceOver quella differenza non esiste: senza aria-pressed sono tre
     pulsanti identici e non si sa quale sia aperto. La classe .attivo è già
     l'unica convenzione in tutta l'app, quindi si traduce da sola. */
  function marcaSegmenti(radice) {
    if (!radice || !radice.querySelectorAll) return;
    [].slice.call(radice.querySelectorAll('.segmenti button')).forEach(function (b) {
      b.setAttribute('aria-pressed', b.classList.contains('attivo') ? 'true' : 'false');
    });
  }
  /* LA PASTIGLIA ACCESA SI SPOSTA DA SÉ.
     Un segmento dice due cose insieme: fa una cosa, e dice quale delle sue
     scelte è quella in vigore. La seconda si scriveva a mano, ogni volta, in
     ogni punto dell'app che disegna un segmento — e dove non era scritta non
     succedeva. Su «Tema» (Auto · Chiaro · Scuro) e su «Aspetto» il colore del
     sito cambiava davvero e la pastiglia accesa restava su quella di prima:
     hai toccato «Scuro», il sito diventa scuro, e il comando continua a dirti
     che sei su «Chiaro». Chi guarda non pensa «manca un aggiornamento»: pensa
     di aver toccato male, e tocca di nuovo.
     Toccare una scelta È sceglierla, dappertutto e senza eccezioni, quindi la
     regola sta in un posto solo. In fase di CATTURA, così chi ridisegna la
     schermata subito dopo (la maggior parte dei casi) vince comunque: l'ultima
     parola resta a chi conosce lo stato vero. */
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('.segmenti > button, .segmenti > a');
    if (!b || b.disabled) return;
    var fila = b.parentElement;
    [].slice.call(fila.children).forEach(function (o) { o.classList.toggle('attivo', o === b); });
    marcaSegmenti(fila);
  }, true);
  if (window.MutationObserver) {
    var osservatore = new MutationObserver(function (mut) {
      var tocca = false;
      mut.forEach(function (m) {
        if (m.type === 'attributes') { tocca = true; return; }
        [].slice.call(m.addedNodes).forEach(function (n) {
          if (n.nodeType === 1) { preparaCampi(n); tocca = true; }
        });
      });
      if (tocca) marcaSegmenti(document);
    });
    ['vista', 'sheet-corpo', 'onboarding-root'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) osservatore.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
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
    var giuDentro = false;
    ovl.addEventListener('pointerdown', function (e) { giuDentro = e.target !== ovl; }, true);
    ovl.addEventListener('click', function (e) {
      var d = giuDentro; giuDentro = false;
      if (e.target === ovl && !d) chiudi();
    });
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
    t.innerHTML = (icona ? ICO(icona, 15) : ICO('check', 15)) + '<span>' + esc(testo) + '</span>' +
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
      toast('Rimesso a posto.', 0, 'annulla');
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
      toast('Spunta tolta (' + xp + ' XP)', 0, 'annulla');
    }
  }

  /* ---------- cattura istantanea ---------- */

  var $ovl = document.getElementById('overlay-cattura');
  var $inp = document.getElementById('input-cattura');
  document.getElementById('corpo-cattura').insertAdjacentHTML('afterbegin', ICO('bolt', 18));

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

  var $sideCatt = document.getElementById('side-cattura');
  $sideCatt.querySelector('.cattura-cta-testo').innerHTML = ICO('bolt', 15) + ' Aggiungi una nota';
  $sideCatt.addEventListener('click', apriCattura);
  var giuDentroCatt = false;
  $ovl.addEventListener('pointerdown', function (e) { giuDentroCatt = e.target !== $ovl; }, true);
  $ovl.addEventListener('click', function (e) {
    var dentro = giuDentroCatt; giuDentroCatt = false;
    if (e.target === $ovl && !dentro) chiudiCattura();
  });
  /* col dito non c'era NESSUNA via d'uscita visibile: toccare fuori funziona
     ma non si vede, e la nota che parlava di «Esc» era per la tastiera */
  document.getElementById('cattura-chiudi').addEventListener('click', chiudiCattura);
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
  document.getElementById('sheet-indietro').addEventListener('click', tornaIndietroSheet);
  /* la maniglia è il comando di chiusura col dito: si trascina giù, e se la
     si tocca chiude. Non è una decorazione accanto a una x. */
  document.getElementById('sheet-maniglia').addEventListener('click', chiudiSheet);
  /* Toccare fuori chiude — ma solo se il tocco è NATO fuori. Premendo dentro
     al foglio e rilasciando oltre il suo bordo (il dito che scivola via da un
     pulsante, il mouse trascinato) il clic arriva all'antenato comune, cioè
     all'overlay, e il foglio si chiudeva da solo: hai cambiato idea su un
     pulsante e ti sei ritrovato senza pannello. */
  /* Si ricorda solo il caso che va impedito — «il tocco è nato DENTRO» — e in
     tutti gli altri si chiude. Al contrario (ricordare «è nato fuori») un clic
     senza un pointerdown davanti, come quello che manda una tecnologia
     assistiva o una prova automatica, non avrebbe chiuso niente. */
  var giuDentroSheet = false;
  $sheet.addEventListener('pointerdown', function (e) { giuDentroSheet = e.target !== $sheet; }, true);
  $sheet.addEventListener('click', function (e) {
    var dentro = giuDentroSheet; giuDentroSheet = false;
    if (e.target === $sheet && !dentro) chiudiSheet();
  });

  var wireSheet = null;
  var $sheetPanel = $sheet.querySelector('.sheet');
  /* Anima l'ingresso UNA volta e poi toglie la classe: se restasse attaccata,
     ogni elemento ricreato dopo (una spunta, un filtro) ripartirebbe con la
     stessa animazione e sembrerebbe un refresh continuo. */
  /* Cambiare PAGINA e cambiare SEZIONE non sono la stessa cosa, e non devono
     avere la stessa animazione. Le tre sezioni di «Oggi» (Adesso, La giornata,
     Rituali) sono tre indirizzi diversi, quindi ogni passaggio finiva in
     «cambio pagina»: si rialzava tutto a scaglioni, titolo compreso, e anche
     la riga di linguette che avevi appena toccato — quella spariva e tornava
     sotto il dito. Settecentocinquanta millisecondi in cui si muove ogni
     cosa: da fuori è una ricarica. Nelle altre pagine (Attività, Andamento)
     si anima solo il corpo e l'intestazione sta ferma. Ora fanno tutte così:
     `sezione` lascia in pace il titolo e le linguette. */
  /* Scrive solo se il contenuto è davvero cambiato. La colonna a sinistra, la
     barra in basso e il fondo della colonna venivano ricostruiti a OGNI
     ridisegno — cioè anche quando spunti una cosa, e la barra in basso è
     sempre in vista: la pastiglia col numero si buttava via e si rifaceva per
     tornare identica. Confrontare due stringhe costa niente rispetto a
     distruggere e ricreare trenta elementi. */
  function scriviSe(el, html) {
    if (!el) return false;
    /* Il confronto è con la stringa che abbiamo scritto NOI, non con
       `innerHTML` riletto: il browser aggiunge `xmlns` a ogni <svg> quando
       serializza, e in quest'app di icone ce n'è in ogni riga. Rileggendo, la
       barra in basso tornava 66 caratteri più lunga di com'era stata scritta,
       il confronto non era mai vero e il guard non serviva a niente. */
    if (el.__ultimoHtml === html) return false;
    el.innerHTML = html;
    el.__ultimoHtml = html;
    return true;
  }

  function animaIngresso(el, sezione) {
    if (!el) return;
    var cls = sezione ? 'sez-enter' : 'vista-enter';
    el.classList.remove('vista-enter');
    el.classList.remove('sez-enter');
    void el.offsetWidth;
    el.classList.add(cls);
    if (el.__timerAnim) clearTimeout(el.__timerAnim);
    el.__timerAnim = setTimeout(function () { el.classList.remove(cls); }, 900);
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
    ['.app', '.tabbar', '#banda-demo'].forEach(function (sel) {
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

  /* TRASCINARE IL FOGLIO PER CONGEDARLO
     Su TOUCH, e con gli eventi touch: non è un dettaglio di gusto. Con gli
     eventi pointer il browser, appena capisce che il dito si muove dentro
     qualcosa che può scorrere, si prende il gesto e manda `pointercancel` —
     e da lì il foglio non si trascina più, torna su e basta. L'unico modo per
     dirgli «questo gesto è mio» è `preventDefault()` su `touchmove`, che
     funziona solo se l'ascoltatore NON è passivo. Per questo si ascolta
     `touchstart/touchmove/touchend` e non `pointerdown/pointermove`.
     Come si comporta, come su iOS:
       · dalla maniglia e dalla testata si trascina sempre;
       · dal corpo si trascina se il contenuto è già in cima e il dito va in
         giù — cioè esattamente quando in quella direzione non c'è niente da
         scorrere. In tutti gli altri casi il dito scorre, e non si tocca
         niente di quello che fa il browser;
       · il foglio resta opaco: si schiarisce solo il velo dietro;
       · si decide dopo sei pixel, così un tocco resta un tocco;
       · al rilascio: oltre cento pixel o con un colpo secco si congeda
         scivolando giù, altrimenti torna al suo posto con una molla;
       · un gesto ANNULLATO torna sempre al suo posto: annullato non è finito.
     Col mouse il gesto non esiste (c'è la x), e il limite è lo stesso del
     foglio-dal-basso in CSS: 860px. */
  (function trascinaPerChiudere() {
    var SOGLIA = 6;            /* pixel prima di decidere: sotto, è un tocco */
    var CHIUDE = 100;          /* oltre questo, congeda */
    var VELOCE = 0.5;          /* px/ms: un colpo secco congeda comunque */
    var giu = null;            /* {y, x, top, presa} al touchstart */
    var modo = null;           /* null = non deciso | 'trascina' | 'scorri' */
    var dy = 0, campioni = [];
    /* QUANDO è finito un trascinamento, non SE è finito. Con un interruttore
       («ho trascinato: sì») il clic da non far passare era il prossimo che
       arrivava, e dopo un trascinamento il clic non arriva: l'interruttore
       restava armato e si mangiava il tocco DOPO, quello vero. Se capitava
       sulla x o sulla maniglia il foglio non si chiudeva più e l'app restava
       inerte. Adesso è un istante, e vale un decimo di secondo. */
    var finitoIl = 0;
    var VALE = 120;            /* ms: solo il clic che nasce da QUEL gesto */

    function dalBasso() {
      return window.matchMedia && window.matchMedia('(max-width: 860px)').matches;
    }
    function scriviVelo(k) { $sheet.style.setProperty('--velo', String(k)); }

    /* qualunque cosa sia rimasta di un gesto interrotto */
    function pulisci() {
      if (!$sheetPanel) return;
      /* `sheet-entra` compresa: se il dito arriva mentre il foglio sta ancora
         salendo, l'ingresso finisce lì e non riparte dopo */
      $sheetPanel.classList.remove('sheet-trascina', 'sheet-molla', 'sheet-via', 'sheet-entra');
      $sheetPanel.style.transform = '';
      scriviVelo(1);
    }

    function partenza(e) {
      giu = null; modo = null; dy = 0; campioni = [];
      /* un gesto interrotto (dito uscito dallo schermo, foglio chiuso da
         codice a metà trascinamento) lasciava il foglio spostato e il velo
         schiarito: si riparte sempre da pulito */
      pulisci();
      if (!dalBasso() || !$sheetPanel || $sheet.hidden) return;
      if (e.touches.length !== 1) return;          /* due dita non sono questo gesto */
      var t = e.touches[0];
      /* dentro un campo il dito seleziona il testo, non trascina il foglio */
      if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      var presa = !!(e.target.closest && e.target.closest('.sheet-maniglia, .sheet-testa'));
      giu = { y: t.clientY, x: t.clientX, top: $sheetPanel.scrollTop, presa: presa };
      campioni = [{ t: e.timeStamp, y: t.clientY }];
    }

    function muovi(e) {
      if (!giu) return;
      if (e.touches.length !== 1) { annullaGesto(); return; }
      var t = e.touches[0];
      var d = t.clientY - giu.y;
      if (modo === null) {
        if (Math.abs(d) < SOGLIA && Math.abs(t.clientX - giu.x) < SOGLIA) return;
        /* in orizzontale non è il nostro gesto */
        if (Math.abs(t.clientX - giu.x) > Math.abs(d)) { modo = 'scorri'; return; }
        /* si trascina dalla presa, oppure dal corpo quando il contenuto è già
           in cima e il dito va in giù: lì sotto non c'è nulla da scorrere */
        modo = (giu.presa || (d > 0 && giu.top <= 0)) ? 'trascina' : 'scorri';
      }
      if (modo !== 'trascina') return;
      /* tirando in SU dalla maniglia il foglio non si muove: non c'è niente
         da spegnere e niente da rimettere a posto dopo */
      if (d <= 0 && !$sheetPanel.classList.contains('sheet-trascina')) return;
      $sheetPanel.classList.add('sheet-trascina');
      /* «questo gesto è mio»: senza questo il browser lo prende per uno
         scorrimento e lo annulla, e il foglio non scende di un pixel */
      if (e.cancelable) e.preventDefault();
      dy = Math.max(0, d);
      $sheetPanel.style.transform = 'translateY(' + dy.toFixed(1) + 'px)';
      /* il velo si schiarisce, il foglio no */
      scriviVelo(Math.max(0.12, 1 - dy / 420));
      campioni.push({ t: e.timeStamp, y: t.clientY });
      if (campioni.length > 6) campioni.shift();
    }

    function fine() {
      if (!giu) return;
      var eraTrascina = modo === 'trascina';
      giu = null; modo = null;
      if (!eraTrascina) return;
      /* `performance.now()` e non `Date.now()`: serve un tempo che scorre
         sempre in avanti e che non si possa fermare da fuori (le prove
         fermano `Date` per avere schermate identiche, e con quello il
         confronto valeva sempre zero: il clic veniva mangiato per sempre) */
      if (dy > SOGLIA) finitoIl = performance.now();
      /* velocità sugli ultimi campioni, non su tutto il gesto: chi rallenta
         prima di lasciare non vuole chiudere */
      var v = 0;
      if (campioni.length > 1) {
        var a = campioni[0], b = campioni[campioni.length - 1];
        v = (b.y - a.y) / Math.max(1, b.t - a.t);
      }
      $sheetPanel.classList.remove('sheet-trascina');
      if (dy > CHIUDE || v > VELOCE) { congedaScivolando(); return; }
      molla();
    }

    function molla() {
      $sheetPanel.classList.add('sheet-molla');
      $sheetPanel.style.transform = '';
      scriviVelo(1);
      setTimeout(function () { if ($sheetPanel) $sheetPanel.classList.remove('sheet-molla'); }, 320);
    }

    /* Annullato non è finito. `touchcancel` vuol dire che il sistema si è
       preso il gesto (una telefonata, il palmo appoggiato): il foglio torna
       al suo posto, sempre. Trattandolo come un rilascio, un gesto
       interrotto a novanta pixel veniva letto come un colpo secco e
       congedava il foglio da sotto le mani. */
    function annullaGesto() {
      if (!giu) return;
      var eraTrascina = modo === 'trascina';
      giu = null; modo = null; dy = 0; finitoIl = 0;
      if (!eraTrascina) return;
      $sheetPanel.classList.remove('sheet-trascina');
      molla();
    }

    function congedaScivolando() {
      var pan = $sheetPanel;
      pan.classList.add('sheet-via');
      pan.style.transform = 'translateY(100%)';
      scriviVelo(0);
      var fatto = false;
      function poi() {
        if (fatto) return; fatto = true;
        pan.classList.remove('sheet-via');
        pan.style.transform = '';
        scriviVelo(1);
        chiudiSheet();
      }
      pan.addEventListener('transitionend', poi, { once: true });
      setTimeout(poi, 300);
    }

    $sheet.addEventListener('touchstart', partenza, { passive: true });
    /* NON passivo: è la sola condizione in cui `preventDefault()` conta */
    $sheet.addEventListener('touchmove', muovi, { passive: false });
    $sheet.addEventListener('touchend', fine);
    $sheet.addEventListener('touchcancel', annullaGesto);
    /* un trascinamento che finisce sopra un pulsante non lo preme: si mangia
       solo il clic che arriva subito dopo, non il prossimo che capita */
    $sheet.addEventListener('click', function (e) {
      if (!finitoIl || performance.now() - finitoIl > VALE) return;
      finitoIl = 0;
      e.stopPropagation(); e.preventDefault();
    }, true);
    /* se il foglio si chiude mentre il dito lo teneva, niente resta appeso */
    document.addEventListener('lm:sheet-chiuso', function () {
      giu = null; modo = null; dy = 0; finitoIl = 0; pulisci();
    });
  })();

  /* Come si torna da dove si è entrati. Cinque pannelli si aprono da dentro
     un altro — «Le tue aree», «Sonno e pasti», «Backup», «Come si usa»,
     «Registro tecnico» tutti da «Impostazioni» — e finora non c'era modo
     di tornare indietro: chiudevi e riaprivi. Chi apre un pannello dice come
     si riapre lui, e da lì in poi il ritorno è automatico. */
  var pilaSheet = [];
  var riapriCorrente = null;
  var staTornandoSheet = false;

  function apriSheet(titolo, html, onWire, largo, riapri) {
    /* Un pannello che ne apre un altro (impostazioni → «le tue aree») non è
       un secondo pannello: è lo stesso foglio con dentro un'altra cosa. Se
       si entrasse di nuovo nella modalità, la pila si riempirebbe di un
       livello che nessuno toglie e il resto dell'app resterebbe inerte —
       cioè non cliccabile — per sempre. */
    var giaAperto = !$sheet.hidden;
    /* Riaprire IL PANNELLO CHE È GIÀ APERTO non è entrare in un altro: se si
       impilasse, la via del ritorno porterebbe a se stessa e il tasto
       «Indietro» resterebbe acceso per sempre. Capita davvero adesso che la
       porta delle impostazioni sta nella barra in basso: si tocca due volte. */
    var stessoDiPrima = !!(riapri && riapriCorrente && riapri.nome === riapriCorrente.nome);
    if (!giaAperto) pilaSheet = [];
    else if (!staTornandoSheet && !stessoDiPrima && riapriCorrente) pilaSheet.push(riapriCorrente);
    riapriCorrente = riapri || null;
    scriviTestaSheet(titolo);
    document.getElementById('sheet-corpo').innerHTML = html;
    if ($sheetPanel) $sheetPanel.classList.toggle('sheet-largo', !!largo);
    $sheet.hidden = false;
    bloccaSfondo(true);
    wireSheet = onWire || null;
    if (wireSheet) wireSheet(document.getElementById('sheet-corpo'));
    if (giaAperto) { if ($sheetPanel) { $sheetPanel.scrollTop = 0; $sheetPanel.focus({ preventScroll: true }); } }
    else { animaIngressoSheet(); entraFuoco($sheetPanel); }
  }

  /* L'ingresso del foglio: una volta, quando si apre. La classe se ne va da
     sola appena l'animazione finisce, così nessun'altra classe può farla
     ricominciare (vedi `.sheet-entra` nel foglio di stile). */
  function animaIngressoSheet() {
    if (!$sheetPanel) return;
    $sheetPanel.classList.remove('sheet-entra');
    /* si rilegge una proprietà per forzare il ricalcolo: senza, togliere e
       rimettere la classe nello stesso giro non riparte */
    void $sheetPanel.offsetWidth;
    $sheetPanel.classList.add('sheet-entra');
    var via = function () { $sheetPanel.classList.remove('sheet-entra'); };
    $sheetPanel.addEventListener('animationend', via, { once: true });
    setTimeout(via, 500);
  }

  /* la testa del pannello: il nome di dove sei, e — se ci sei entrato da un
     altro pannello — la via per tornare da dove venivi. Il nome del posto di
     prima sta scritto sul tasto: «‹ Impostazioni» dice dove torni, una
     freccia sola no. */
  function scriviTestaSheet(titolo) {
    var t = document.getElementById('sheet-titolo');
    var b = document.getElementById('sheet-indietro');
    t.textContent = titolo;
    if (!b) return;
    if (pilaSheet.length) {
      var dove = pilaSheet[pilaSheet.length - 1];
      b.hidden = false;
      b.innerHTML = ICO('chevronGiu', 15) + '<span>' + esc(dove.nome || 'Indietro') + '</span>';
      b.setAttribute('aria-label', 'Torna a ' + (dove.nome || 'indietro'));
    } else {
      b.hidden = true;
      b.innerHTML = '';
    }
  }

  function tornaIndietroSheet() {
    if (!pilaSheet.length) { chiudiSheet(); return; }
    var dove = pilaSheet.pop();
    riapriCorrente = null;
    staTornandoSheet = true;
    dove.apri();
    staTornandoSheet = false;
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
    document.dispatchEvent(new CustomEvent('lm:sheet-chiuso'));
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
    { id: 'giornata',    nome: 'Giornata',    icona: 'giornata',  gruppo: 'primaria',   livello: 'quotidiana' },
    { id: 'inbox',       nome: 'Attività',    icona: 'lista',     gruppo: 'primaria',   livello: 'quotidiana' },
    { id: 'rituali',     nome: 'Rituali',     icona: 'rituali',   gruppo: 'primaria',   livello: 'quotidiana' },
    { id: 'plancia',     nome: 'Panoramica',  icona: 'dashboard', gruppo: 'primaria',   livello: 'quotidiana' },
    /* La pagina non si chiama più «Esperimenti»: l'esperimento è UNO dei due
       modi di rispondere alla domanda che uno si fa davvero — «questa cosa a
       me funziona?». L'altro è dirlo e basta, e quello è il modo che si usa
       novantacinque volte su cento. Il nome della pagina è la domanda; il
       segno è il verdetto, e la beuta resta il segno degli esperimenti là
       dentro. */
    { id: 'esperimenti', nome: 'Scoperte', icona: 'funziona', gruppo: 'secondaria', livello: 'extra' },
    { id: 'scienza',     nome: 'Perché funziona', breve: 'Scienza', icona: 'atom', gruppo: 'secondaria', livello: 'extra' },
    /* stanza a parte: dieci vestiti per gli stessi elementi, da confrontare
       per scegliere la base grafica di tutto il sito */
    { id: 'lab',         nome: 'Design lab',  breve: 'Lab', icona: 'palette',  gruppo: 'secondaria', livello: 'extra' }
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
      { id: 'plancia', eti: 'Panoramica' }, { id: 'esperimenti', eti: 'Scoperte' }
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
      var dim = v.livello === 'ancora' ? 18 : 15;
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
    scriviSe(lato, tre
      ? GRUPPI.map(function (g) { return voceGruppo(g, 18); }).join('')
      : livello('ancora') + livello('quotidiana') +
        '<div class="nav-sep"></div>' + livello('extra'));

    /* footer sidebar: account + impostazioni */
    if (scriviSe(document.getElementById('sidebar-fondo'), footerSidebar())) wireFooterSidebar();

    /* tab bar mobile. Con le tre porte i pulsanti sono TRE, e sono tre
       destinazioni: qui sta solo quello che si tocca ogni giorno. «Altro» era
       una quarta voce che non è una destinazione — un contenitore di cose
       diverse fra loro che si apre per scoprire cosa c'è dentro — e le
       impostazioni sono state per un po' al suo posto, che è anche peggio: la
       fascia che il pollice raggiunge senza spostare la mano spesa per una
       schermata che si apre una volta al mese. Adesso stanno in alto a destra,
       fuori dalla strada e sempre nello stesso angolo (vedi `sottoNav`).
       Senza le tre porte torna la barra di prima: quattro pagine + «Altro». */
    var tab = document.getElementById('nav-tab');
    var primNav = TAB_MOBILE.map(vistaById);
    var inSecondaria = !tre && !primNav.some(function (v) { return v.id === corrente; });
    var htmlTab = (tre
      ? GRUPPI.map(function (g) {
        return '<button data-vai="' + g.viste[0].id + '" class="' + (g.id === gCorr.id ? 'attivo' : '') + '">' +
          '<span class="tab-ico">' + ICO(g.icona, 18) + badgeInbox({ id: g.id }, s) + '</span>' + g.nome + '</button>';
      }).join('')
      : primNav.map(function (v) {
        return '<button data-vai="' + v.id + '" class="' + (corrente === v.id ? 'attivo' : '') + '">' +
          '<span class="tab-ico">' + ICO(v.icona, 18) + badgeInbox(v, s) + '</span>' + v.nome + '</button>';
      }).join('')) +
      (tre ? ''
        : '<button data-menu="1" class="' + (inSecondaria ? 'attivo' : '') + '"><span class="tab-ico">' + ICO('altro', 18) + '</span>Altro</button>') +
      /* La cattura sta DENTRO la barra, non su un pulsante che galleggia sopra
         la pagina. Quello tondo, fisso in basso a destra, stava sopra un
         comando in ventun punti diversi fra sei schermate: la riga di «Review
         della settimana» ci finiva sotto per milleottocento pixel quadrati e
         non c'era modo di scorrere per liberarla. Qui non copre mai niente e
         resta a un dito di distanza, che è tutto quello che deve fare. */
      '<button class="tab-catt" data-catt="1" aria-label="Cattura un pensiero" title="Cattura un pensiero (tasto C)">' +
      ICO('plus', 18) + '</button>';
    /* i fili si riattaccano solo se la barra è stata davvero riscritta */
    if (scriviSe(tab, htmlTab)) {
      tab.querySelectorAll('[data-vai]').forEach(function (b) {
        b.addEventListener('click', function () { location.hash = '#/' + b.getAttribute('data-vai'); });
      });
      var bMenu = tab.querySelector('[data-menu]');
      if (bMenu) bMenu.addEventListener('click', apriMenuAltro);
      var bCatt = tab.querySelector('[data-catt]');
      if (bCatt) bCatt.addEventListener('click', apriCattura);
    }
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
        '<button type="button" class="sync-chip ' + y.cls + '" data-diag="1" title="' + esc(y.title || 'Mostra cosa sta succedendo') + '">' + ICO(y.ico, 13) + ' ' + (y.breve || y.testo) + '</button></div></div>';
    } else if (a.available) {
      acct = '<button class="btn btn-mini btn-accedi" id="fondo-accedi">' + GOOGLE_G(15) + ' Accedi con Google</button>';
    } else {
      acct = '<div class="fondo-locale">' + ICO('soloQui', 13) + ' Dati salvati su questo dispositivo</div>';
    }
    return acct + '<button class="btn-strumento-largo" id="fondo-impostazioni">' + ICO('ingranaggio', 15) + '<span>Impostazioni</span></button>';
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

  /* ============================================================
     IMPOSTAZIONI
     ============================================================

     Com'era: dieci sezioni in fila, ognuna col suo titolino maiuscolo e la sua
     riga di pastiglie, e dentro quelle pastiglie due cose diverse vestite
     uguali — «Gestisci le aree», che APRE una schermata, e «Azzera tutto», che
     CANCELLA i dati. La navigazione stava in mezzo fra il tema e i backup;
     «Tema» e «Aspetto» erano due sezioni per la stessa domanda; e per sapere
     quante aree si hanno o a che ora si va a letto bisognava aprire il
     pannello e poi tornare indietro.

     Com'è adesso, e le tre regole che tengono la schermata in piedi:

     1. UNA FORMA PER OGNI TIPO DI COSA. Una riga con la freccetta APRE una
        schermata; una riga senza freccetta FA una cosa adesso; un segmento
        cambia subito quello che si vede. Sono le stesse tre forme del resto
        dell'app (la scheda di un'attività è fatta così), quindi non c'è niente
        da imparare qui dentro.
     2. IL VALORE SI VEDE DA FUORI. «Aree · 8 attive», «Sonno e pasti ·
        23:30–07:30, 3 pasti», «Backup · 4»: alla maggior parte delle domande
        si risponde senza aprire niente. È la differenza fra un elenco di porte
        e un pannello di strumenti.
     3. SEI FAMIGLIE IN ORDINE DI QUANTO SERVONO, e quello che cancella sta in
        fondo, staccato, con la sua faccia rossa: prima era una pastiglia in
        fila con «Carica dati di esempio». */

  /* una riga che APRE una schermata: freccetta a destra, e il valore di adesso
     accanto — così la risposta si legge senza entrare */
  function rigaPorta(id, ico, eti, val) {
    return '<button class="lista-riga sc-riga sc-tocca" id="' + id + '">' +
      '<span class="sc-eti">' + ICO(ico, 15) + ' ' + eti + '</span>' +
      (val ? '<span class="sc-val">' + val + '</span>' : '') +
      '<span class="lista-chev">' + ICO('chevronGiu', 15) + '</span></button>';
  }
  /* una riga che FA una cosa adesso: nessuna freccetta, perché non si va da
     nessuna parte. La differenza fra le due forme è tutta qui, e prima non
     c'era: «Esporta» e «Gestisci le aree» erano la stessa pastiglia. */
  function rigaFa(id, ico, eti, cls) {
    return '<button class="lista-riga sc-riga sc-tocca' + (cls ? ' ' + cls : '') + '" id="' + id + '">' +
      '<span class="sc-eti">' + ICO(ico, 15) + ' ' + eti + '</span></button>';
  }
  /* una riga con una scelta che vale subito: l'etichetta sopra, i segmenti
     larghi quanto la riga sotto (su un telefono un segmento da tre voci e
     un'etichetta sulla stessa riga non ci stanno) */
  function rigaScelta(eti, dentro) {
    return '<div class="lista-riga sc-riga sc-riga-alta">' +
      '<span class="sc-eti">' + eti + '</span>' +
      '<span class="sc-val">' + dentro + '</span></div>';
  }

  function statoPromemoria() {
    var P = window.LM_PROMEMORIA;
    if (!P) return { val: 'non disponibili', porta: false, nota: '', azione: '' };
    var st = P.stato();
    if (st === 'niente') {
      return { val: 'non disponibili', porta: false,
        nota: 'Questo browser non sa dare notifiche.', azione: '' };
    }
    if (P.serveInstallare()) {
      return { val: 'da installare', porta: false,
        nota: 'Sull’iPhone i promemoria arrivano solo se aggiungi LifeMax alla schermata Home: tasto Condividi → «Aggiungi a schermata Home». Poi torna qui.',
        azione: '' };
    }
    if (st === 'denied') {
      return { val: 'bloccati', porta: false,
        nota: 'Le notifiche sono bloccate per questo sito. Si riattivano dalle impostazioni del browser, alla voce di questo indirizzo.',
        azione: '' };
    }
    if (st === 'granted') {
      var n = P.piano().filter(function (v) { return v.id !== 'stato'; }).length;
      return { val: 'accesi', porta: true,
        nota: P.configurato()
          ? (n ? 'Oggi ne restano <b>' + n + '</b>.' : '')
          : 'Permesso concesso. Per adesso arriva solo la fine del timer: gli altri promemoria hanno bisogno del server.',
        azione: '<button class="btn btn-mini" id="imp-prom-off">' + ICO('campanaOff', 15) + ' Spegni</button>' };
    }
    return { val: 'spenti', porta: true,
      nota: P.configurato()
        ? 'Servono per i momenti della giornata e per le abitudini con un’ora.'
        : 'Da accesi arriva l’avviso di fine timer. Quelli a orario hanno bisogno del server, che non è ancora collegato.',
      azione: '<button class="btn btn-mini btn-tinta" id="imp-prom-on">' + ICO('campana', 15) + ' Accendi i promemoria</button>' };
  }

  function htmlImpostazioni() {
    var s = LM.load();
    var modo = s.profilo.modo || 'auto';
    var skin = s.profilo.skin || 'quiete';
    var nav = s.profilo.nav || 'tre';
    function segM(v, ico, et) { return '<button data-modo="' + v + '" class="' + (modo === v ? 'attivo' : '') + '">' + ICO(ico, 15) + et + '</button>'; }
    function segS(v, et) { return '<button data-skin="' + v + '" class="' + (skin === v ? 'attivo' : '') + '">' + et + '</button>'; }
    function segN(v, et) { return '<button data-nav="' + v + '" class="' + (nav === v ? 'attivo' : '') + '">' + et + '</button>'; }

    var r = s.profilo.ritmo || {};
    var pasti = (r.pasti || []).length;
    var valRitmo = (r.sonno || '—') + '–' + (r.sveglia || '—') + (pasti ? ' · ' + pasti + ' pasti' : '');
    var nAree = (s.areeAttive || []).length;
    var nBackup = LM.listBackups().length;
    var pr = statoPromemoria();

    return '<div class="sc">' +
      /* --- TU: chi sei e dove stanno i dati --- */
      etichetta('Account', 'user') +
      htmlAccount() +

      /* --- LE TUE COSE: quello che l'app sa di te --- */
      etichetta('Il tuo profilo', 'aree') +
      '<div class="lista">' +
      rigaPorta('imp-aree', 'aree', 'Aree', nAree + ' attive') +
      rigaPorta('imp-ritmo', 'ritmo', 'Sonno e pasti', valRitmo) +
      (pr.porta
        ? rigaPorta('imp-prom-come', 'campana', 'Promemoria', pr.val)
        : '<div class="lista-riga sc-riga"><span class="sc-eti">' + ICO('campana', 15) + ' Promemoria</span>' +
          '<span class="sc-val">' + pr.val + '</span></div>') +
      '</div>' +
      (pr.nota ? '<p class="lista-nota">' + pr.nota + '</p>' : '') +
      (pr.azione ? '<div class="imp-azioni">' + pr.azione + '</div>' : '') +

      /* --- COME SI VEDE: tre scelte che valgono subito, tutte insieme.
             Prima «Tema» e «Aspetto» erano due sezioni diverse per la stessa
             domanda, e «Navigazione» stava in mezzo ai backup. --- */
      etichetta('Aspetto', 'palette') +
      '<div class="lista">' +
      rigaScelta('Tema', '<span class="segmenti imp-seg" id="seg-modo">' +
        segM('auto', 'automatico', 'Auto') + segM('light', 'sun', 'Chiaro') + segM('dark', 'moon', 'Scuro') + '</span>') +
      rigaScelta('Stile', '<span class="segmenti imp-seg" id="seg-skin">' +
        segS('quiete', 'Aurora') + segS('arcade', 'Arcade') + '</span>') +
      rigaScelta('Barra di navigazione', '<span class="segmenti imp-seg" id="seg-nav">' +
        segN('tre', 'Tre porte') + segN('tutte', 'Tutte le pagine') + '</span>') +
      '</div>' +
      '<p class="lista-nota">Aurora è più sobrio, Arcade più acceso. Con <b>tre porte</b> le altre schermate stanno in una riga di linguette sotto al titolo; con <b>tutte le pagine</b> torna la barra lunga. In entrambi i casi ci sono tutte: cambia solo da dove ci si arriva.</p>' +

      /* --- I TUOI DATI: due cose che si fanno e una porta --- */
      etichetta('I tuoi dati', 'dati') +
      '<div class="lista">' +
      rigaFa('imp-esporta', 'download', 'Esporta tutto in un file (.json)') +
      rigaFa('imp-importa', 'upload', 'Importa da un file') +
      rigaPorta('imp-backup', 'archivio', 'Backup e ripristino', nBackup ? String(nBackup) : 'nessuno') +
      '</div>' +
      '<input type="file" id="imp-file" accept="application/json,.json" hidden>' +
      '<p class="lista-nota">Prima di sostituire i dati l’app fa sempre un backup, e da lì si torna indietro.</p>' +

      /* --- CAPIRE L'APP: le pagine che si leggono, non si usano --- */
      etichetta('Guida', 'aiuto') +
      '<div class="lista">' +
      rigaPorta('imp-guida', 'aiuto', 'Come si usa') +
      rigaPorta('imp-scienza', 'atom', 'Perché funziona') +
      rigaPorta('imp-diag', 'terminale', 'Registro tecnico') +
      rigaPorta('imp-lab', 'palette', 'Design lab') +
      '</div>' +
      '<p class="lista-nota">Il registro tecnico mostra se i dati sono davvero salvati: si copia e si manda quando qualcosa non torna.</p>' +

      /* --- RIPARTIRE: staccato, e in fondo. Quello che cancella non può
             stare in fila con quello che salva. --- */
      etichetta('Ripartire da zero', 'riprova') +
      '<div class="lista">' +
      rigaFa('imp-demo', 'sparkles', 'Carica dati di esempio') +
      rigaFa('imp-azzera', 'trash', 'Azzera tutto', 'sc-pericolo') +
      '</div>' +
      '<p class="lista-nota">Anche l’azzeramento fa un backup: i dati si recuperano da «Backup e ripristino».</p>' +
      '</div>';
  }

  /* PROMEMORIA — il pannello per accenderli.
     Sta in Impostazioni e in un posto solo: due interruttori per la stessa
     cosa in due schermate sarebbero due modi di accendere la stessa luce.
     Il permesso si chiede QUI, quando lo chiedi tu: chiederlo all'apertura è
     il modo più sicuro di farselo negare per sempre. */
  /* COME TI AVVISO — la schermata dove si sceglie tutto.
     Sta a parte per un motivo che non è di spazio: qui si decide quando una
     macchina ha il permesso di interromperti, e quella decisione merita una
     schermata sola invece di essere infilata fra il tema e i backup. */
  function apriPromemoria() {
    var P = window.LM_PROMEMORIA;
    var c = LM.promemoria();
    var conf = P && P.configurato();

    function riga(id, nome, spiega) {
      var v = c.voci[id] || {};
      return '<div class="prom-riga' + (v.on ? '' : ' spenta') + '" data-voce="' + id + '">' +
        '<button class="prom-int" data-int="' + id + '" role="switch" aria-checked="' + !!v.on + '" ' +
          'aria-label="' + esc(nome) + (v.on ? ', acceso' : ', spento') + '">' +
          ICO(v.on ? 'check' : 'x', 13) + '</button>' +
        '<div class="prom-testo"><b>' + esc(nome) + '</b><span>' + spiega + '</span></div>' +
        (v.ora != null
          ? '<input type="time" class="prom-ora" data-ora="' + id + '" value="' + esc(v.ora) + '" ' +
            'aria-label="A che ora, ' + esc(nome) + '"' + (v.on ? '' : ' disabled') + '>'
          : '<span class="prom-ora-no">l’ora di ognuna</span>') +
        '</div>';
    }

    apriSheet('Come ti avviso',
      /* IL POSTINO — prima cosa, perché senza questo il resto non parte */
      '<div class="imp-sezione" style="padding-top:0"><div class="imp-eti">Il postino</div>' +
        '<div class="imp-nota" style="margin-top:0">' +
          (conf ? 'Collegato. Da qui si cambia, se serve.'
                : 'Le notifiche a orario hanno bisogno di un piccolo servizio che stia sveglio: una pagina chiusa non si sveglia da sé. Si fa una volta, è gratis, e le istruzioni sono nel file <code>promemoria/LEGGIMI.md</code>.') +
        '</div>' +
        '<label class="campo mt-s" for="prom-server">Indirizzo</label>' +
        '<input type="url" id="prom-server" inputmode="url" autocapitalize="off" spellcheck="false" ' +
          'placeholder="https://lifemax-promemoria.tuonome.workers.dev" value="' + esc(c.server) + '">' +
        '<label class="campo mt-s" for="prom-chiave">Chiave pubblica</label>' +
        '<input type="text" id="prom-chiave" autocapitalize="off" spellcheck="false" ' +
          'placeholder="B…" value="' + esc(c.chiave) + '">' +
        /* La pagina che fa le chiavi sta nel sito, non sul computer: un file
           dentro il progetto non si apre se non hai il progetto, e senza le
           chiavi non si va avanti. Da qui è a un tocco. Si apre a parte
           perché la sua unica regola è non mandare niente da nessuna parte:
           dentro l'app perderebbe quella garanzia. */
        '<div class="imp-azioni mt-s">' +
          '<a class="btn btn-mini" id="prom-fai-chiavi" href="promemoria/chiavi.html" target="_blank" rel="noopener">' +
          ICO('chiavi', 15) + ' Non le hai? Fattele qui' + ICO('share', 13) + '</a></div>' +
        '<div class="imp-azioni mt-s">' +
          '<button class="btn btn-mini btn-tinta" id="prom-collega">' + ICO('cloudCheck', 15) + ' Collega</button>' +
          (conf ? '<button class="btn btn-mini" id="prom-prova">' + ICO('campana', 15) + ' Mandamene una adesso</button>' : '') +
        '</div>' +
        '<div class="imp-nota" id="prom-esito"></div>' +
        '<div class="imp-nota">La chiave <b>privata</b> non va qui e non va da nessuna parte: resta sul server. Se un campo te la chiede, è il campo sbagliato.</div>' +
        /* La domanda che viene naturale: «e sull\'altro telefono?». Meglio
           risponderla qui che farla nascere. */
        '<div class="imp-nota">È <b>una coppia sola per tutti i dispositivi</b>: le chiavi dicono chi manda, non a chi. ' +
        'Su un telefono nuovo basta accendere i promemoria — l’iscrizione la fa il browser da sé' +
        (window.LMCloud && window.LMCloud.available ? ', e con l’accesso Google queste due righe ti arrivano già scritte' : '') + '.</div>' +
      '</div>' +

      /* COSA TI ARRIVA */
      '<div class="imp-sezione"><div class="imp-eti">Cosa ti arriva</div>' +
        riga('mattina', 'Il piano del mattino', 'Solo se non l’hai già fatto.') +
        riga('checkin', 'Il check-in', 'Solo se non ne hai ancora fatto uno.') +
        riga('mit', 'La priorità del giorno', 'Un colpetto, se è ancora lì intatta.') +
        riga('sera', 'La chiusura della giornata', 'Solo se non hai ancora chiuso.') +
        riga('abitudini', 'Le abitudini con un’ora', 'Quelle senza orario non suonano mai.') +
        '<div class="imp-nota">Spegnere un promemoria non cancella la cosa: la review della sera resta da fare, solo senza avviso.</div>' +
      '</div>' +

      /* SILENZIO */
      '<div class="imp-sezione"><div class="imp-eti">Silenzio</div>' +
        '<div class="prom-riga' + (c.silenzio.on ? '' : ' spenta') + '">' +
          '<button class="prom-int" id="prom-sil-int" role="switch" aria-checked="' + !!c.silenzio.on + '" ' +
            'aria-label="Fascia di silenzio, ' + (c.silenzio.on ? 'accesa' : 'spenta') + '">' +
            ICO(c.silenzio.on ? 'check' : 'x', 13) + '</button>' +
          '<div class="prom-testo"><b>Non disturbarmi</b><span>Dentro questa fascia non arriva niente.</span></div>' +
        '</div>' +
        '<div class="prom-fascia mt-s">' +
          '<label class="campo" for="prom-sil-da">Da</label>' +
          '<input type="time" class="prom-t" id="prom-sil-da" value="' + esc(c.silenzio.da) + '"' + (c.silenzio.on ? '' : ' disabled') + '>' +
          '<label class="campo" for="prom-sil-a">A</label>' +
          '<input type="time" class="prom-t" id="prom-sil-a" value="' + esc(c.silenzio.a) + '"' + (c.silenzio.on ? '' : ' disabled') + '>' +
        '</div>' +
        '<div class="imp-nota">Un promemoria alle due di notte non si legge: sveglia, e insegna a spegnere tutto.</div>' +
      '</div>' +

      /* LA NOTA FISSA */
      htmlNotaFissa(),
      wirePromemoria, false, { nome: 'Come ti avviso', apri: apriPromemoria });
  }

  /* LA NOTA FISSA — e cosa si può davvero fare.
     Si può: una notifica sola, che si riscrive al posto di quella di prima e
     non fa rumore quando lo fa, e resta nell'elenco delle notifiche finché
     non la scarti tu. Più il numero sul pallino dell'icona.
     Non si può: una notifica che non si possa scartare, come quella di un
     navigatore. Su Android serve un servizio in primo piano, sull'iPhone una
     Live Activity: le può avere solo un'app installata dallo store. Meglio
     dirlo che far cercare un interruttore che non esiste. */
  function htmlNotaFissa() {
    var P = window.LM_PROMEMORIA;
    if (!P || P.stato() !== 'granted') return '';
    var accesa = P.fissaAccesa();
    var t = P.testoFissa();
    return '<div class="imp-sezione"><div class="imp-eti">La nota che resta</div>' +
      '<div class="prom-riga' + (accesa ? '' : ' spenta') + '">' +
        '<button class="prom-int" id="imp-prom-fissa" role="switch" aria-checked="' + accesa + '" ' +
          'aria-label="Nota fissa, ' + (accesa ? 'accesa' : 'spenta') + '">' +
          ICO(accesa ? 'check' : 'x', 13) + '</button>' +
        '<div class="prom-testo"><b>' + ICO('notaFissa', 13) + ' Tienimi una nota fissa</b>' +
        '<span>Una notifica sola, sempre la stessa, con quello che ti resta oggi. ' +
        'Si riscrive in silenzio e resta lì finché non la scarti tu. ' +
        'Sull’icona compare il numero delle cose aperte.</span></div>' +
      '</div>' +
      (accesa ? '<div class="imp-anteprima">' + ICO('campana', 13) +
        '<span><b>' + esc(t.titolo) + '</b><br>' + esc(t.corpo) + '</span></div>' : '') +
      '<div class="imp-nota">Una notifica che non si può scartare — come quella di un ' +
      'navigatore — sul web non esiste: la può avere solo un’app scaricata dallo store. ' +
      'Questa si scarta, ma torna da sé il giorno dopo.</div>' +
      '</div>';
  }

  function wirePromemoria(root) {
    var P = window.LM_PROMEMORIA;
    function ridisegna() { staTornandoSheet = true; apriPromemoria(); staTornandoSheet = false; }
    /* dopo ogni cambiamento il piano va rimandato subito: aspettare il
       prossimo salvataggio vorrebbe dire che l'orario nuovo vale da domani */
    function salva(patch) { LM.impostaPromemoria(patch); if (P) P.mandaPiano(true); }

    /* gli interruttori delle voci */
    root.querySelectorAll('[data-int]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-int');
        var era = LM.promemoria().voci[id].on;
        var patch = { voci: {} }; patch.voci[id] = { on: !era };
        salva(patch);
        ridisegna();
      });
    });
    /* Tutta la riga accende e spegne, come farebbe un'etichetta. L'interruttore
       da solo è ventisei pixel, e il pollice ne vuole quaranta: prima quei
       quaranta li dava uno pseudo-elemento che sporgeva dal riquadro, ma la
       forma adesso è un ritaglio e un ritaglio taglia anche il tocco. La riga
       è alta più che a sufficienza, e toccare il nome per accendere una cosa è
       quello che si aspetta chiunque. Il campo dell'ora no: là si scrive. */
    root.querySelectorAll('.prom-riga[data-voce]').forEach(function (r) {
      r.addEventListener('click', function (e) {
        if (e.target.closest('input, select, textarea, button')) return;
        var b = r.querySelector('[data-int]');
        if (b) b.click();
      });
    });
    /* gli orari: si salvano quando il campo si chiude, non a ogni tasto */
    root.querySelectorAll('[data-ora]').forEach(function (i) {
      i.addEventListener('change', function () {
        var id = i.getAttribute('data-ora');
        if (!/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(i.value)) {
          /* un campo ora svuotato rimette quello di prima invece di lasciare
             una voce senza orario, che non partirebbe mai */
          i.value = LM.promemoria().voci[id].ora;
          toast('L’ora deve essere scritta per intero.', 0, 'avviso');
          return;
        }
        var patch = { voci: {} }; patch.voci[id] = { ora: i.value };
        salva(patch);
        toast('Da domani alle ' + i.value + '.', 0, 'clock');
      });
    });

    /* il silenzio */
    var si = root.querySelector('#prom-sil-int');
    if (si) si.addEventListener('click', function () {
      salva({ silenzio: { on: !LM.promemoria().silenzio.on } });
      ridisegna();
    });
    ['da', 'a'].forEach(function (q) {
      var i = root.querySelector('#prom-sil-' + q);
      if (!i) return;
      i.addEventListener('change', function () {
        var patch = { silenzio: {} }; patch.silenzio[q] = i.value;
        salva(patch);
        var c = LM.promemoria().silenzio;
        i.value = q === 'da' ? c.da : c.a;
      });
    });

    /* la nota fissa */
    var pf = root.querySelector('#imp-prom-fissa');
    if (pf) pf.addEventListener('click', function () {
      var era = P.fissaAccesa();
      P.fissa(!era);
      P.mandaPiano(true);
      ridisegna();
    });

    /* IL POSTINO */
    var esito = root.querySelector('#prom-esito');
    function dillo(testo, cls) {
      if (!esito) return;
      esito.className = 'imp-nota' + (cls ? ' ' + cls : '');
      esito.innerHTML = testo;
    }
    var coll = root.querySelector('#prom-collega');
    if (coll) coll.addEventListener('click', function () {
      var srv = (root.querySelector('#prom-server').value || '').trim().replace(/\/+$/, '');
      var kk = (root.querySelector('#prom-chiave').value || '').trim();
      /* si controlla PRIMA di salvare: due campi sbagliati salvati zitti
         danno «non arriva niente» e nessun indizio su quale dei due */
      if (!/^https:\/\/[^\s/]+\.[^\s/]+/.test(srv)) {
        dillo('L’indirizzo deve cominciare con <code>https://</code> — è quello che stampa Cloudflare alla fine, e finisce per <code>.workers.dev</code> se non hai messo un dominio tuo.', 'sync-errore');
        return;
      }
      if (!/^[A-Za-z0-9_-]{80,90}$/.test(kk)) {
        dillo('La chiave pubblica è una riga di 87 caratteri senza spazi. Questa ne ha ' + kk.length + ': forse è quella privata (più corta), o c’è dentro un pezzo di testo.', 'sync-errore');
        return;
      }
      coll.disabled = true;
      dillo('Sto provando a parlargli…');
      /* prima si chiede al server se è vivo: così l'errore è «il server non
         risponde» invece di «le notifiche non arrivano», che è la stessa cosa
         detta in un modo che non aiuta */
      fetch(srv + '/salute').then(function (r) { return r.json(); }).then(function (j) {
        if (!j || !j.ok) throw new Error('risposta strana');
        LM.impostaPromemoria({ server: srv, chiave: kk });
        if (!j.vapid) {
          dillo('Il server risponde, ma non ha le sue chiavi: sul pannello di Cloudflare mancano i segreti <code>VAPID_PUBBLICA</code> e <code>VAPID_PRIVATA</code>. Il resto è a posto.', 'sync-errore');
          coll.disabled = false;
          return null;
        }
        /* IL CONFRONTO. È l'errore numero uno di chi installa da sé: si
           genera la coppia due volte, e nell'app finisce la pubblica di una
           coppia mentre sul Worker c'è l'altra. Il servizio push allora
           risponde 403 e non spiega niente. Confrontarle qui costa una riga e
           toglie di mezzo mezz'ora di tentativi. */
        if (j.pubblica && j.pubblica !== kk) {
          dillo('Il server c’è, ma <b>le due chiavi non sono la stessa coppia</b>. Qui hai scritto una chiave che comincia per <code>' + esc(kk.slice(0, 12)) + '…</code>, mentre sul Worker c’è <code>' + esc(String(j.pubblica).slice(0, 12)) + '…</code>. Copia quella del Worker in questo campo, oppure rigenera la coppia e rimetti <b>tutti e due</b> i segreti su Cloudflare.', 'sync-errore');
          coll.disabled = false;
          return null;
        }
        dillo('Collegato.', 'sync-ok');
        return P.accendi();
      }).then(function (esito) {
        if (esito === null) return;
        if (esito === 'chiave') {
          dillo('Il server c’è, ma quella chiave il browser non la accetta: è della lunghezza giusta ma non è una chiave vera. Rigenera la coppia con <code>promemoria/chiavi.html</code> e ricorda di rimettere <b>tutti e due</b> i segreti su Cloudflare — devono essere la stessa coppia.', 'sync-errore');
          return;
        }
        if (esito === 'negato') {
          dillo('Il server è collegato, ma il permesso alle notifiche è negato: va riattivato dalle impostazioni del browser, alla voce di questo indirizzo.', 'sync-errore');
          return;
        }
        ridisegna();
      }).catch(function (e) {
        coll.disabled = false;
        dillo('Non risponde. Controlla l’indirizzo, e prova ad aprirlo nel browser aggiungendo <code>/salute</code> alla fine: deve rispondere <code>{"ok":true}</code>.', 'sync-errore');
      });
    });

    /* DA UN NUMERO A UNA COSA DA FARE.
       «Il server ha risposto: 502» è vero e inutile: il 502 è il nostro, e
       dentro c'è il codice del servizio push — che è quello che sa perché ha
       detto no. Ogni codice ha una causa sola in pratica, e ognuna ha un
       gesto: qui si scrive quel gesto invece del numero. */
    function spiegaProva(j, stato) {
      j = j || {};
      var s = j.stato || 0;
      var chiave = (P.cfg().chiave || '');
      var coppiaDiversa = j.pubblica && chiave && j.pubblica !== chiave;
      if (coppiaDiversa) {
        return 'Il servizio push ha detto no (<code>' + esc(String(s || stato)) + '</code>) e si vede perché: <b>le due chiavi non sono la stessa coppia</b>. Nell’app c’è <code>' + esc(chiave.slice(0, 12)) + '…</code>, sul Worker <code>' + esc(String(j.pubblica).slice(0, 12)) + '…</code>. Copia quella del Worker qui sopra e premi Collega.';
      }
      if (j.dove === 'firma') {
        return 'Non è nemmeno arrivato a parlare col servizio push: la <b>chiave privata</b> sul Worker non è una chiave valida. Di solito ci è finito dentro uno spazio o un ritorno a capo quando l’hai incollata nel segreto <code>VAPID_PRIVATA</code>. Rifallo copiandola tutta di fila. (<code>' + esc(String(j.errore || '')) + '</code>)';
      }
      var detto = j.detto ? ' Ha scritto: <code>' + esc(String(j.detto).slice(0, 160)) + '</code>' : '';
      if (s === 401 || s === 403) {
        return 'Il servizio push ha rifiutato la firma (<code>' + esc(String(s)) + '</code>). Vuol dire che la coppia VAPID sul Worker non è quella con cui questo telefono si è iscritto: rigenera la coppia con <code>promemoria/chiavi.html</code>, rimetti <b>tutti e due</b> i segreti su Cloudflare, incolla la pubblica qui sopra, premi Collega, poi spegni e riaccendi i promemoria.' + detto;
      }
      if (s === 400) {
        return 'Il servizio push ha detto che la richiesta non va (<code>400</code>). Il sospetto quasi sempre giusto: il segreto <code>VAPID_SOGGETTO</code>. Deve essere <code>mailto:</code> seguito da un tuo indirizzo email vero — Apple non accetta indirizzi finti.' + detto;
      }
      if (s === 413) return 'La notifica era troppo grande per il servizio push (<code>413</code>). Questo è un problema mio, non tuo: scrivimelo.' + detto;
      if (s === 429) return 'Il servizio push ha detto «troppe» (<code>429</code>). Aspetta un minuto e riprova.' + detto;
      if (s >= 500) return 'Il servizio push (Apple o Google) sta avendo problemi suoi (<code>' + esc(String(s)) + '</code>). Non c’è niente da sistemare: riprova fra qualche minuto.' + detto;
      if (j.errore) return 'Il server ha detto: <code>' + esc(String(j.errore)) + '</code>';
      return 'Il servizio push ha risposto <code>' + esc(String(s || stato)) + '</code> e non ha spiegato.' + detto;
    }

    var pv = root.querySelector('#prom-prova');
    if (pv) pv.addEventListener('click', function () {
      pv.disabled = true;
      dillo('Sto mandando…');
      /* mandare il piano prima serve: se l'iscrizione è nuova, sul server non
         c'è ancora niente a cui mandare la prova */
      P.mandaPiano(true).then(function () {
        return fetch(P.cfg().server + '/prova', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: P.idDispositivo() })
        });
      }).then(function (r) {
        return r.json().then(function (j) { return { r: r, j: j }; });
      }).then(function (x) {
        pv.disabled = false;
        if (x.r.ok) dillo('Partita. Se non la vedi entro qualche secondo, il permesso c’è ma il sistema la sta nascondendo: controlla le notifiche di LifeMax nelle impostazioni del telefono.', 'sync-ok');
        else if (x.r.status === 404) dillo('Il server non ha ancora un piano per questo dispositivo: spegni e riaccendi i promemoria qui sopra.', 'sync-errore');
        else if (x.r.status === 410) dillo('L’iscrizione non vale più (di solito: notifiche revocate, o app reinstallata). Spegni e riaccendi i promemoria.', 'sync-errore');
        else dillo(spiegaProva(x.j, x.r.status), 'sync-errore');
      }).catch(function () {
        pv.disabled = false;
        dillo('Non ci sono riuscito: il server non risponde.', 'sync-errore');
      });
    });
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
    /* Promemoria: il pulsante racconta com'è andata, e il pannello si riscrive
       da sé — se il permesso è appena cambiato, la riga sopra deve cambiare
       con lui, altrimenti resta a dire «spenti» con le notifiche accese. */
    function riscriviImpostazioni() { staTornandoSheet = true; apriImpostazioni(); staTornandoSheet = false; }
    var pon = root.querySelector('#imp-prom-on');
    if (pon) pon.addEventListener('click', function () {
      pon.disabled = true;
      window.LM_PROMEMORIA.accendi().then(function (esito) {
        if (esito === 'negato') toast('Il permesso è stato negato: senza quello non arrivano notifiche.', 0, 'avviso');
        else if (esito === 'chiave') toast('La chiave pubblica non va bene: guarda in «Come ti avviso».', 0, 'avviso');
        else if (esito === 'server') toast('Il permesso c’è, ma il server non risponde: guarda in «Come ti avviso».', 0, 'avviso');
        else if (!window.LM_PROMEMORIA.configurato()) toast('Acceso. Per ora arriva solo la fine del timer.', 0, 'campana');
        else toast('Promemoria accesi.', 0, 'campana');
        riscriviImpostazioni();
      });
    });
    var pc = root.querySelector('#imp-prom-come');
    if (pc) pc.addEventListener('click', apriPromemoria);
    var poff = root.querySelector('#imp-prom-off');
    if (poff) poff.addEventListener('click', function () {
      poff.disabled = true;
      window.LM_PROMEMORIA.spegni().then(function () {
        /* il permesso del browser non si può togliere da qui: si toglie
           l'iscrizione, e il pannello lo dice senza far finta d'altro */
        toast('Promemoria spenti.', 0, 'campanaOff');
        riscriviImpostazioni();
      });
    });
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
          else { toast(r.err, 0, 'avviso'); }
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
    } catch (e) { toast('Esportazione non riuscita.', 0, 'avviso'); }
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
            toast('Backup ripristinato.', 0, 'archivio');
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
    apriSheet('Registro tecnico',
      '<div class="diag-stato ' + st.cls + '"><b>' + esc(st.tit) + '</b><span>' + esc(st.txt.trim()) + '</span></div>' +
      '<div class="diag-barra">' +
      '<button class="btn btn-mini btn-primario" id="diag-copia">' + ICO('copy', 15) + ' Copia tutto</button>' +
      (navigator.share ? '<button class="btn btn-mini" id="diag-condividi">' + ICO('share', 15) + ' Condividi</button>' : '') +
      '<button class="btn btn-mini" id="diag-riprova">' + ICO('riprova', 15) + ' Riprova ora</button>' +
      '<button class="btn btn-mini btn-ghost" id="diag-svuota">' + ICO('trash', 15) + ' Svuota</button>' +
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
      toast('Salvataggio richiesto: l’esito è nelle righe qui sotto.', 0, 'riprova');
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

  /* Solo segni delle aree: prima si potevano scegliere anche la stella, la
     fiamma, il fulmine, la provetta, il bersaglio e le stelline — che nell'app
     vogliono già dire priorità, serie, cattura, esperimenti, «Oggi» e «extra».
     Un'area con la stella finiva accanto alla stella della priorità, e le due
     figure identiche dicevano due cose diverse nella stessa riga. */
  var ICONE_AREA = ['book', 'heart', 'users', 'wallet', 'landmark', 'rocket', 'briefcase',
    'lightbulb', 'casa', 'musica', 'globo', 'pesi', 'user', 'shield'];

  function apriAree() {
    var s = LM.load();
    var righe = s.aree.map(function (a) {
      var attiva = s.areeAttive.indexOf(a.id) >= 0;
      return '<div class="area-riga' + (attiva ? '' : ' spenta') + '" style="--c-area:' + LM.coloreArea(a) + '">' +
        '<span class="icona-area">' + ICO(a.icona, 15) + '</span>' +
        '<input type="text" class="area-nome-input" data-rin="' + a.id + '" value="' + esc(a.nome) + '" aria-label="Nome dell’area">' +
        /* il title non basta: col dito non esiste e con la voce l'icona è
           aria-hidden, quindi questi otto tasti non avevano nome — e nemmeno
           dicevano DI QUALE area erano */
        /* «acceso», non «fatto»: il verde pieno in tutta l'app vuol dire che
           una cosa è finita, e otto spunte verdi in colonna facevano sembrare
           questa una lista di cose completate invece dell'interruttore di
           ognuna. Cambia il colore, non il segno — provata anche la presa, ma
           quel puntinato si legge come «trascina per riordinare». */
        '<button class="icona-btn area-on' + (attiva ? ' on' : '') + '" data-toggle-area="' + a.id + '"' +
        ' aria-pressed="' + (attiva ? 'true' : 'false') + '"' +
        ' aria-label="' + esc(a.nome) + ': ' + (attiva ? 'attiva, tocca per disattivarla' : 'disattivata, tocca per attivarla') + '"' +
        ' title="' + (attiva ? 'Attiva (tocca per disattivare)' : 'Disattivata (tocca per attivare)') + '">' + ICO(attiva ? 'check' : 'x', 15) + '</button>' +
        '<button class="icona-btn" data-del-area="' + a.id + '" title="Rimuovi">' + ICO('trash', 15) + '</button>' +
        '</div>';
    }).join('');
    var picker = ICONE_AREA.map(function (ic, i) { return '<button class="ico-pick' + (i === 0 ? ' sel' : '') + '" data-ico="' + ic + '" aria-label="' + ic + '">' + ICO(ic, 15) + '</button>'; }).join('');
    apriSheet('Le tue aree',
      '<div class="imp-nota" style="margin-top:0">Rinomina, disattiva o rimuovi le aree, oppure creane di tue (es. i tuoi progetti). Rimuovendo un’area, le sue attività passano ad «Altro»: nulla va perso.</div>' +
      '<div class="aree-lista">' + righe + '</div>' +
      /* Prima il nome, poi il segno — e il segno si vede solo quando hai
         cominciato a scrivere. Quattordici tasti icona stavano sempre aperti
         per un'area che non avevi ancora deciso di creare: metà dei comandi
         della schermata erano per una cosa che non esiste. È lo stesso
         comportamento della riga d'aggiunta di tutta l'app, che scopre le sue
         opzioni al primo tasto premuto.
         E «Aggiungi» scende al tono intermedio: questa è la schermata dove si
         sistemano le aree che HAI, non dove se ne fanno di nuove, e l'unico
         tasto pieno diceva il contrario. */
      '<div class="imp-sezione"><div class="imp-eti">Nuova area</div>' +
      '<form class="riga-flex" id="area-nuova"><input type="text" id="area-nuova-nome" placeholder="Nome della nuova area…" style="flex:1;min-width:150px"><button class="btn btn-mini btn-tinta" type="submit">' + ICO('plus', 13) + ' Aggiungi</button></form>' +
      '<div class="ico-picker mt-s" id="ico-picker" hidden>' + picker + '</div></div>',
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
        var campoNuova = r.querySelector('#area-nuova-nome');
        var pick = r.querySelector('#ico-picker');
        campoNuova.addEventListener('input', function () {
          pick.hidden = !campoNuova.value.trim();
        });
        r.querySelectorAll('.ico-pick').forEach(function (b) {
          b.addEventListener('click', function () { r.querySelectorAll('.ico-pick').forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); icoSel = b.getAttribute('data-ico'); });
        });
        r.querySelector('#area-nuova').addEventListener('submit', function (e) {
          e.preventDefault();
          var nome = r.querySelector('#area-nuova-nome').value.trim();
          if (!nome) return;
          LM.aggiungiArea(nome, icoSel); render(); apriAree(); toast('Area creata.', 0, 'aree');
        });
      });
  }

  /* ---------- guida in-app ---------- */

  function apriGuida() {
    function voce(ico, tit, testo) {
      return '<div class="guida-voce"><span class="guida-ico">' + ICO(ico, 15) + '</span><div><b>' + tit + '</b><p>' + testo + '</p></div></div>';
    }
    apriSheet('Come si usa LifeMax',
      '<div class="imp-nota" style="margin-top:0">Tre passaggi: <b>annoti</b> quello che ti viene in mente, <b>decidi</b> cosa farne, <b>fai</b> una cosa per volta.</div>' +
      '<div class="guida">' +
      voce('bolt', '1 · Annota', 'Premi <kbd>C</kbd> (o il tasto ＋) e scrivi. La nota finisce in <b>Attività</b>, sezione «Sistemare»: non serve decidere altro adesso.') +
      voce('lista', '2 · Decidi cosa farne', 'In <b>Attività</b>, per ogni nota scegli <b>Oggi</b>, <b>Da fare</b> (più avanti, senza data) o <b>Scarta</b>. Quelle in «Da fare» restano in elenco, con il filtro per area, finché non le porti in Oggi.') +
      voce('target', '3 · Fai una cosa per volta', 'La schermata <b>Oggi</b> mostra una sola azione. Al mattino scegli le tre azioni del giorno in <b>Rituali</b>, la sera chiudi con la review.') +
      voce('giornata', 'La giornata', 'Mostra come sono divise le tue ore: sonno, pasti, abitudini e azioni con un orario. Dove vederla si sceglie dal menù sulla timeline.') +
      voce('polso', 'Check-in', 'Energia, concentrazione, umore, su una scala da 1 a 5. Conta l’andamento nei giorni, non il numero di oggi.') +
      voce('funziona', 'Scoperte', 'Una riga per ogni cosa che hai capito su di te, in due mucchi: <b>Funziona</b> e <b>Non funziona</b>. Accanto a ognuna sta scritta l’<b>evidenza</b> — notato una volta, lo noto ogni volta, misurato — così una riga si può scrivere anche senza esserne sicuro.') +
      voce('flask', 'Esperimenti', 'La seconda sezione di <b>Scoperte</b>, per quando di una cosa vuoi essere sicuro: introduci un cambiamento (per esempio sport al mattino) e l’app confronta i tuoi dati prima e dopo.') +
      voce('dashboard', 'Panoramica e Diario', 'In <b>Panoramica</b> vedi progressi, costanza e andamento; nel <b>Diario</b> lo storico giorno per giorno.') +
      voce('dati', 'I dati', 'Backup automatici, esportazione e importazione in .json, sincronizzazione sull’account Google fra dispositivi.') +
      '</div>', null);
  }

  /* Lo stesso blocco che stava nel menu «Altro»: chi è connesso, com'è andato
     il salvataggio, entra ed esci. Toccava sparire con «Altro», e invece è la
     cosa che si va a cercare quando si dubita che i dati siano al sicuro. */
  /* IL BLOCCO DELL'ACCOUNT dentro le impostazioni. Non porta la sua etichetta:
     ce l'ha già sopra («Account»), e due titoli per lo stesso blocco erano uno
     di troppo. Lo stato del salvataggio resta CLICCABILE: chi legge
     «Salvataggio…» vuole sapere subito perché, e la spiegazione deve stare
     dietro quella parola. */
  function htmlAccount() {
    var a = window.LM_AUTH || { available: false, user: null };
    if (a.user) {
      var y = statoSync();
      return '<div class="lista">' +
        '<div class="lista-riga sc-riga"><span class="sc-eti">' + ICO('cloudCheck', 15) + ' Connesso come</span>' +
        '<span class="sc-val">' + esc(a.user.name || a.user.email) + '</span></div>' +
        rigaFa('imp-esci', 'logout', 'Esci dall’account') +
        '</div>' +
        '<button type="button" class="sync-chip sync-chip-largo ' + y.cls + '" data-diag="1" title="' + esc(y.title || 'Mostra cosa sta succedendo') + '">' +
        ICO(y.ico, 13) + ' ' + y.testo + ICO('arrowRight', 13) + '</button>';
    }
    if (a.available) {
      return '<button class="btn btn-accedi" id="imp-accedi" style="width:100%;justify-content:center">' + GOOGLE_G(15) + ' Accedi con Google</button>' +
        '<p class="lista-nota">I dati stanno su questo dispositivo. Accedi per ritrovarli su tutti.</p>';
    }
    return '<div class="lista"><div class="lista-riga sc-riga">' +
      '<span class="sc-eti">' + ICO('soloQui', 15) + ' Dove stanno i dati</span>' +
      '<span class="sc-val">su questo dispositivo</span></div></div>';
  }

  function apriImpostazioni() {
    apriSheet('Impostazioni', htmlImpostazioni(), wireAspettoDati, false,
      { nome: 'Impostazioni', apri: apriImpostazioni });
  }

  function apriMenuAltro() {
    var s = LM.load();
    /* stessa gerarchia della barra laterale: qui dentro finiscono le pagine
       che non stanno nella tab bar, e senza livelli sarebbero un elenco piatto
       in cui Giornata pesa come una pagina da leggere una volta sola */
    var extra = primarie().filter(function (v) { return TAB_MOBILE.indexOf(v.id) < 0; }); /* es. Giornata */
    function voceMenu(v) {
      return '<button class="menu-voce menu-' + (v.livello || 'quotidiana') + '" data-vai="' + v.id + '">' +
        ICO(v.icona, v.livello === 'extra' ? 15 : 18) + '<span>' + v.nome + '</span>' + ICO('arrowRight', 15) + '</button>';
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
        '<button class="btn btn-mini btn-ghost" id="menu-esci">' + ICO('logout', 15) + ' Esci</button></div>' +
        '<button type="button" class="sync-chip sync-chip-largo ' + y.cls + '" data-diag="1" title="' + esc(y.title || 'Mostra cosa sta succedendo') + '">' + ICO(y.ico, 13) + ' ' + y.testo + ICO('arrowRight', 13) + '</button>';
    } else if (a.available) {
      acct = '<button class="btn btn-accedi" id="menu-accedi" style="width:100%;justify-content:center">' + GOOGLE_G(15) + ' Accedi con Google</button>' +
        '<div class="imp-nota">Accedi per ritrovare i tuoi dati su tutti i dispositivi.</div>';
    } else {
      acct = '<div class="fondo-locale">' + ICO('soloQui', 13) + ' Dati salvati su questo dispositivo</div>';
    }
    /* Le impostazioni NON stanno qui dentro, e non ci stanno nemmeno per un
       pezzo. Prima questo pannello era navigazione + account + tema + aspetto
       + dati + ripartenza + diagnostica in un unico scorrimento da nove
       schermate: per raggiungere «Giornata» si passava davanti a trenta
       comandi che non si stavano cercando. Poi ci era rimasto un pulsante
       «Impostazioni», che era un secondo modo di aprire la stessa porta: da
       quando l'ingranaggio sta in alto a destra su ogni schermata, questo era
       il doppione. Qui c'è un menu di pagine e il tuo account. */
    apriSheet('Menu', (link ? '<div class="menu-lista">' + link + '</div>' : '') +
      '<div class="imp-sezione"><div class="imp-eti">Account</div>' + acct + '</div>',
      function (root) {
        root.querySelectorAll('[data-vai]').forEach(function (b) {
          b.addEventListener('click', function () { chiudiSheet(); location.hash = '#/' + b.getAttribute('data-vai'); });
        });
        var la = root.querySelector('#menu-accedi'); if (la) la.addEventListener('click', function () { if (window.LMCloud && window.LMCloud.available) window.LMCloud.signIn(); });
        var le = root.querySelector('#menu-esci'); if (le) le.addEventListener('click', function () { if (window.LMCloud) window.LMCloud.signOut(); chiudiSheet(); toast('Hai effettuato la disconnessione.', 0, 'logout'); });
        root.querySelectorAll('[data-diag]').forEach(function (b) { b.addEventListener('click', apriDiagnostica); });
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

  /* L'etichetta di un gruppo. Porta il segno della cosa che nomina, quando
     quella cosa ha già un segno suo: dentro una scheda lunga è quello che
     fa trovare il blocco giusto senza rileggere tutte le intestazioni. Dove
     un segno onesto non c'è — «Dopo questa», «Le altre» — non se ne inventa
     uno: un glifo scelto per riempire il posto è una figura in più da
     decifrare, non un aiuto.  */
  function etichetta(testo, ico, conta) {
    return '<div class="lista-eti">' + (ico ? ICO(ico, 11) : '') + testo +
      (conta != null ? ' <span>' + conta + '</span>' : '') + '</div>';
  }

  function rigaAggiunta(id, segnaposto, opzioniHtml) {
    return '<form class="agg" id="' + id + '" autocomplete="off">' +
      '<div class="agg-riga">' +
      '<input type="text" class="agg-testo" placeholder="' + esc(segnaposto) + '" aria-label="' + esc(segnaposto) + '" enterkeyhint="done">' +
      /* il segno più dice da sé cosa fa: quando lo schermo è strettissimo la
         scritta sparisce e il tasto resta comunque comprensibile */
      '<button class="btn btn-mini btn-tinta agg-ok" type="submit" aria-label="Aggiungi">' + ICO('plus', 15) + '<span class="agg-ok-eti">Aggiungi</span></button></div>' +
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

  /* Il segno dell'area: il glifo colorato che sta accanto a una cosa da fare.
     Era scritto a mano in sei posti con quattro nomi di classe diversi, e in
     quattro di quei sei non diceva il proprio nome a nessuno — il title non
     esiste sul tocco e l'icona è aria-hidden, quindi per chi legge con la voce
     l'area non c'era affatto. Uno solo, che si annuncia. */
  function segnoArea(ar, dim, cls) {
    if (!ar) return '';
    return '<span class="segno-area' + (cls ? ' ' + cls : '') + '" role="img"' +
      ' aria-label="Area: ' + esc(ar.nome) + '" title="' + esc(ar.nome) + '"' +
      ' style="--c-area:' + LM.coloreArea(ar) + '">' + ICO(ar.icona, dim || 13) + '</span>';
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

  /* LA TESTA DI UNA SCHERMATA
     «Cosa servono i titoli se c'è già scritto nei pulsanti i nomi?» Misurato:
     su sei schermate, quattro scrivevano lo stesso nome due volte già sul
     telefono (il titolo e la linguetta attiva), sei su sei su desktop, dove
     lo scrive anche la colonna. E il titolo non era nemmeno coerente: su
     «Adesso» diceva la porta («Oggi»), sulle altre due stanze della stessa
     porta diceva la stanza, e il nome della porta spariva.
     Adesso il nome sta in un posto solo, e quel posto è la navigazione: la
     porta la dice la barra in basso (o la colonna), la stanza la dice la
     linguetta accesa. Il titolo resta come intestazione per chi naviga con
     un lettore di schermo o per intestazioni — dove il nome è già in vista
     non si ripete, e la riga in cima si stampa solo se ha davvero qualcosa da
     tenere (un comando a destra). Su una pagina che si apre dalle
     impostazioni e non sta in nessuna barra il titolo si vede, e lì anche una
     riga di spiegazione serve: la leggi una volta e sai dove sei finito.

     `giaNellaNav`: il nome è già scritto nella navigazione. */
  function topbar(titolo, sottotitolo, destra, cls, giaNellaNav) {
    var h1 = '<h1' + (giaNellaNav ? ' class="solo-lettori"' : '') + '>' + titolo + '</h1>';
    if (giaNellaNav && !destra && !sottotitolo) return h1;
    /* una riga che tiene solo un comando è una barra di strumenti, non una
       testa: respira meno sotto */
    return '<div class="topbar' + (giaNellaNav ? ' topbar-nuda' : '') + (cls ? ' ' + cls : '') + '">' +
      (giaNellaNav ? h1 : '<div>' + h1 + (sottotitolo ? '<div class="sottotitolo">' + sottotitolo + '</div>' : '') + '</div>') +
      '<div class="spazio"></div>' + (destra || '') + '</div>';
  }

  function refreshObAccount() {
    var el = document.getElementById('ob-account');
    if (!el) return;
    var a = window.LM_AUTH || { available: false, user: null };
    if (a.user) {
      el.innerHTML = '<div class="ob-account-in">' + ICO('cloudCheck', 15) + ' Accesso eseguito come <b>' + esc(a.user.name || a.user.email) + '</b></div>';
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
    if (!s.demo || s.demoChiusa) { if (scriviSe(banda, '')) misura(); return; }
    /* sul telefono il testo lungo occupava due righe e mangiava mezzo schermo */
    var htmlBanda = '<div class="banda-demo"><span>' + ICO('sparkles', 13) +
      ' <b>Dati di esempio</b><span class="banda-piu">· modifica pure, tutto resta salvato</span></span>' +
      '<button class="banda-x" id="banda-x" aria-label="Nascondi">' + ICO('x', 15) + '</button></div>';
    /* la banda non cambia mai finché è aperta: la si riscriveva a ogni spunta */
    if (!scriviSe(banda, htmlBanda)) return;
    misura();
    document.getElementById('banda-x').addEventListener('click', function () {
      LM.load().demoChiusa = true; LM.save(); scriviSe(banda, ''); misura();
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
        /* l'area la porta il timer: cercarla fra le azioni non funziona più da
           quando qui può esserci anche un'abitudine, e i minuti sarebbero
           finiti nel nulla */
        var a = LM.load().azioni.find(function (x) { return x.id === timer.azioneId; });
        var areaMin = timer.areaId || (a ? a.areaId : null);
        if (areaMin) LM.registraMinuti(areaMin, trascorsi);
      }
    }
    timer = { azioneId: null, areaId: null, fine: null, durata: 0, intervallo: null };
  }

  function avviaTimer(azioneId, minuti, areaId) {
    fermaTimer(false);
    timer.azioneId = azioneId;
    timer.areaId = areaId || null;
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
        var quale = LM.load().azioni.find(function (x) { return x.id === timer.azioneId; });
        fermaTimer(true);
        toast('Timer finito. Minuti registrati.', 0, 'durata');
        /* un messaggio dentro l'app lo vedi solo se stai guardando l'app: il
           timer serve proprio per andare a fare la cosa, quindi la fine deve
           poter arrivare anche da fuori. È l'unica notifica che il web sa
           dare senza un server, perché la pagina è ancora viva. */
        if (window.LM_PROMEMORIA) {
          LM_PROMEMORIA.locale('Tempo scaduto',
            quale ? quale.testo : 'Il timer è finito.', '#/oggi');
        }
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

  /* «fra quattro ore»: un orario da solo non dice quanto manca, e quanto manca
     è la cosa che fa decidere se cominciare qualcos'altro */
  function fraQuanto(min) {
    var d = new Date();
    var q = min - (d.getHours() * 60 + d.getMinutes());
    if (q <= 0 || q > 12 * 60) return '';
    if (q < 60) return ', fra ' + q + ' minuti';
    var ore = Math.round(q / 60);
    return ', fra ' + (ore === 1 ? 'un’ora' : ore + ' ore');
  }

  function vistaFocus() {
    var adesso;
    if (fuocoScelto) {
      /* la cosa scelta a mano può essere un'abitudine come una cosa di oggi:
         si cerca fra tutte e due, con la stessa forma */
      var pin = LM.vociDiAdesso().find(function (a) { return a.id === fuocoScelto; });
      if (pin) adesso = { azione: pin, stato: 'scelta', min: pin.ora ? minOf(pin.ora) : null, fine: null };
      else { fuocoScelto = null; adesso = LM.azioneAdesso(); }
    } else {
      adesso = LM.azioneAdesso();
    }
    var prossima = adesso.azione;
    ultimoFuocoKey = fuocoScelto ? 'pin:' + fuocoScelto : (prossima ? prossima.id : '') + '|' + adesso.stato;
    var oggi = LM.azioniDiOggi();
    var inCoda = oggi.filter(function (a) { return !a.done; }).length - (prossima ? 1 : 0);

    /* In cima non c'è niente da leggere. Prima c'erano tre nomi per la stessa
       idea a cento pixel l'uno dall'altro — il sottotitolo «L'azione da fare
       adesso.», la linguetta «Adesso» e l'occhiello «La tua prossima azione» —
       e un contatore «1/7 oggi» che con «Le altre di oggi 5» chiedeva di fare
       due conti per capire un mucchio.
       Il conto se n'è andato di proposito: quanto un compito sembra pesante è
       fra i predittori più forti del rimandarlo (Steel 2007, meta-analisi sulla
       procrastinazione), e la dimensione del mucchio letta proprio nel momento
       in cui devi cominciare è esattamente quello. Il premio arriva quando
       premi «Fatto» — XP che volano, messaggio, serie — cioè subito, che è
       l'unico momento in cui funziona per chi ha l'ADHD (Barkley 1997 sulla
       sensibilità alle conseguenze immediate contro quelle rimandate). Il
       progresso della giornata resta in «Andamento», dove lo si va a cercare. */
    var html = topbar('Oggi', '', '', '', true);
    html += '<div id="oggi-giornata"></div>';

    if (!prossima) {
      var finita = oggi.length > 0;
      html += '<div class="focus-scena"><div class="vuoto">' + illoSole() +
        (oggi.length ? '<b>Per oggi hai finito tutto.</b><br>Restano la review della sera, o una cosa in più se ne hai voglia.'
                     : '<b>Oggi non hai ancora scelto cosa fare.</b><br>Bastano pochi secondi: scegli la prima cosa e parti.') +
        '</div>' +
        /* UN pieno, ed è il passo che il testo qui sopra consiglia: a giornata
           finita la review della sera, a giornata vuota scegliere le azioni.
           Sotto, una via di scorta smorzata, e il campo per scriverla e
           basta (la riga d'aggiunta di tutta l'app).
           Erano quattro inviti pari — scegli / prendi / review / scrivi — e
           la schermata che deve far ripartire era la più difficile da leggere
           di tutte. A giornata finita «Aggiungi altro a oggi» se n'è andato:
           il campo qui sotto fa quella cosa in meno passi e senza cambiare
           schermata. Tre inviti uguali nel momento in cui non hai ancora
           cominciato sono il momento peggiore per chiedere di scegliere. */
        '<div class="focus-azioni-riga">' +
        (finita
          ? '<button class="btn btn-primario btn-grande" data-vai="rituali" data-sub="sera">' + ICO('moon', 18) + ' Review della sera</button>'
          : '<button class="btn btn-primario btn-grande" data-vai="rituali" data-sub="mattina">' + ICO('sun', 18) + ' Scegli le azioni di oggi</button>' +
            '<button class="btn btn-mini btn-ghost" data-vai="inbox">' + ICO('inbox', 15) + ' Prendi dalle attività</button>') +
        '</div>' +
        '<div class="focus-agg">' + rigaAggiunta('agg-rapida', 'Scrivi una cosa da fare…') + '</div>' +
        '</div>';
      $vista.innerHTML = html;
      montaOggiGiornata();
      $vista.querySelectorAll('[data-vai]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.getAttribute('data-sub')) sottoRituale = b.getAttribute('data-sub');
          location.hash = '#/' + b.getAttribute('data-vai');
        });
      });
      wireRigaAggiunta($vista, 'agg-rapida', function (testo) {
        LM.aggiungiAzione(testo, 'altro', { mit: LM.serveMit() });
        render();
      });
      return;
    }

    var area = areaById(prossima.areaId);
    var colArea = LM.coloreArea(area);
    var timerAttivo = timer.azioneId === prossima.id && timer.fine;
    var minTimer = Math.max(1, Math.min(180, +(prossima.durata || 0) || 25));

    /* Una riga sola sopra al titolo, e dice due cose che il titolo non dice:
       di che parte della tua vita è questa cosa, e perché è questa adesso.
       Prima erano due bande — l'occhiello e l'area — con due misure e due
       colori, sopra un titolo già grande: tre righe centrate per una cosa.
       E l'occhiello parlava anche quando non aveva niente da dire: «La tua
       prossima azione» sopra la prossima azione, in una sezione che si chiama
       «Adesso», sotto un sottotitolo che diceva la stessa cosa. Quando non c'è
       un motivo da spiegare resta solo l'area. */
    /* ADESSO O DOPO: la domanda a cui questa schermata deve rispondere prima
       di ogni altra cosa.
       Prima lo diceva una frase piccola in mezzo alla didascalia — «in
       programma alle 15:00», accanto al nome dell'area, sotto un titolo
       grande e sopra un tasto verde «Fatto» — e la scheda aveva lo STESSO
       aspetto sia che quella cosa fosse da fare adesso sia che fosse la
       prossima delle diciassette. Chi la leggeva capiva «questa è la prossima,
       e adesso?»: è successo davvero, ed è il motivo di questo blocco.
       Adesso lo dice una fascia sopra il titolo, con una parola sola e un
       colore: ADESSO, IN RITARDO, QUANDO VUOI, PIÙ TARDI. La parola è la
       risposta; il dettaglio (l'ora, il ritardo, il tempo che manca) sta
       accanto, più piccolo. */
    var stato = { parola: '', dett: '', cls: 'libera' };
    if (adesso.stato === 'scelta') {
      stato = { parola: 'Scelta da te', dett: adesso.min != null ? 'in programma alle ' + fmtMin(adesso.min) : '', cls: 'ora' };
    } else if (adesso.stato === 'corso') {
      stato = { parola: 'Adesso', dett: fmtMin(adesso.min) + ' → ' + fmtMin(adesso.fine), cls: 'ora' };
    } else if (adesso.stato === 'ritardo') {
      stato = { parola: 'In ritardo', dett: 'era alle ' + fmtMin(adesso.min), cls: 'ritardo' };
    } else if (adesso.stato === 'programmata') {
      stato = { parola: 'Più tardi', dett: 'alle ' + fmtMin(adesso.min) + fraQuanto(adesso.min), cls: 'dopo' };
    } else if (prossima.mit) {
      stato = { parola: 'La più importante', dett: 'quando vuoi', cls: 'mit' };
    } else {
      /* nessun dettaglio: «Quando vuoi» e «nessun orario» sono la stessa
         informazione scritta due volte nella stessa fascia */
      stato = { parola: 'Quando vuoi', dett: '', cls: 'libera' };
    }
    /* di che specie è questa cosa: un'abitudine non si «rimanda», si salta
       per oggi, e chi guarda deve saperlo prima di premere */
    var perche = '';
    var perCls = ' ' + stato.cls;
    if (prossima.tipo === 'abitudine') {
      perche = ICO('refresh', 13) + ' abitudine' + (prossima.serie > 1 ? ' · ' + prossima.serie + ' giorni di fila' : '');
    }
    if (adesso.stato === 'scelta') {
      perche = (perche ? perche + ' · ' : '') + '<button class="focus-torna" id="btn-torna-piano">torna al piano</button>';
    }

    /* Le ALTRE cose di oggi, a portata di mano: se devi fare qualcos'altro la
       vedi e la scegli, senza sentirti obbligato da quella suggerita. */
    var altre = oggi.filter(function (a) { return !a.done && (!prossima || a.id !== prossima.id); });
    var altreHtml = '';
    if (altre.length) {
      /* L'elenco è quello di tutta l'app: un contenitore con i separatori e il
         comando da 26px DENTRO la riga. Prima era un quarto disegno — una
         spunta quadrata staccata a sinistra di una pastiglia bianca — e ogni
         riga ripeteva «Fai questa →», che è esattamente quello che fa la riga
         quando la tocchi: due comandi per lo stesso gesto, e il titolo si
         troncava per far posto all'etichetta. */
      altreHtml = '<div class="focus-altre">' +
        /* Un posto, non una domanda. «Devi fare altro?» chiede all'utente di
           rimettere in discussione la cosa che ha davanti proprio mentre
           deve cominciarla: è un invito a riaprire una scelta già fatta, e
           riaprirla è il modo in cui la scelta non si chiude più (Iyengar &
           Lepper 2000: più opzioni davanti, meno probabile che si scelga).
           Le altre restano lì, a un tocco, per quando servono davvero. */
        '<button class="lista-eti lista-eti-btn" id="btn-altre" aria-expanded="' + mostraAltre + '">' +
        (mostraAltre ? 'Nascondi le altre' : 'Le altre di oggi') + ' <span>' + altre.length + '</span>' +
        '<span class="lista-chev' + (mostraAltre ? ' aperta' : '') + '">' + ICO('chevronGiu', 15) + '</span></button>' +
        (mostraAltre ? '<div class="lista">' + altre.map(function (a) {
          var ar = areaById(a.areaId);
          return '<div class="lista-riga">' +
            '<button class="lista-azione spunta" data-fa-fatto="' + a.id + '" aria-label="Segna come fatta">' + ICO('check', 13) + '</button>' +
            '<button class="lista-apri" data-fa-fuoco="' + a.id + '" aria-label="Fai questa: ' + esc(a.testo) + '">' +
            '<span class="lista-corpo"><span class="lista-tit">' +
            segnoArea(ar, 13, 'tit-area') + esc(a.testo) +
            (a.mit ? ' ' + ICO('star', 11) : '') + '</span></span>' +
            (a.ora ? '<span class="lista-val">' + ICO('clock', 11) + ' ' + a.ora + '</span>' : '') +
            '<span class="lista-chev">' + ICO('chevronGiu', 15) + '</span></button></div>';
        }).join('') + '</div>' : '') + '</div>';
    }

    /* Due parti, non una pila. Il cuore sta in mezzo allo spazio che c'è; la
       porta per le altre cose sta in fondo, appoggiata al bordo. Prima erano
       tutti figli della stessa colonna centrata, e «Le altre di oggi» finiva
       incollata sotto ai tasti con duecento pixel di niente sotto di sé: la
       schermata sembrava interrotta a metà. */
    html += '<div class="focus-scena' + (timerAttivo ? ' timer-attivo' : '') + '">' +
      '<div class="focus-cuore" style="--c-area:' + colArea + '">' +
      '<div class="chip focus-stato st-' + stato.cls + '">' +
      '<span class="fs-parola">' + stato.parola + '</span>' +
      (stato.dett ? '<span class="fs-dett">' + esc(stato.dett) + '</span>' : '') +
      '</div>' +
      '<div class="focus-didascalia' + perCls + '" style="--c-area:' + colArea + '">' +
      segnoArea(area, 15, 'fd-area') + '<span class="fd-nome">' + esc(area.nome) + '</span>' +
      (perche ? '<span class="fd-sep">·</span><span class="fd-perche">' + perche + '</span>' : '') +
      '</div>' +
      (timerAttivo
        ? '<div class="timer-anello" id="timer-anello" style="--p:0"><div class="timer-interno">' +
          '<div class="timer-display" id="timer-display">–:––</div>' +
          /* è un conto alla rovescia sui minuti che hai scelto tu, non il
             blocco della giornata: diceva la cosa sbagliata */
          '<div class="timer-eti">restano</div></div></div>'
        : '') +
      '<div class="focus-azione">' + esc(prossima.testo) + '</div>' +
      /* La risposta alla domanda «e adesso?»: quando tutto quello che resta ha
         un'ora più in là, ADESSO non c'è niente, e va detto. Prima la scheda
         mostrava la cosa delle tre del pomeriggio come se fosse da fare
         subito, e chi la leggeva alle dieci restava a chiedersi se doveva
         cominciarla. */
      (adesso.stato === 'programmata'
        ? '<div class="focus-nota-dopo">Adesso non hai niente in programma.</div>'
        : '') +
      (prossima.ifThen ? '<div class="focus-ifthen">' + ICO('ancora', 15) + '<span>' + esc(prossima.ifThen) + '</span></div>' : '') +
      /* gerarchia chiara: un'unica azione dominante, il resto recede */
      '<div class="focus-primaria">' +
      /* «Fatto», e basta. Il «+10 XP» sul tasto trasformava l'unico comando
         che deve essere ovvio in due cose da leggere, e prometteva un premio
         prima di averlo dato: il premio si vede quando lo premi, e lì è
         immediato per davvero.
         Quando la cosa è PIÙ TARDI il tasto pieno non può dire «Fatto»: quello
         che uno vuole fare in quel momento è deciderlo — «la faccio adesso» —
         e «Fatto» resta lì accanto, smorzato, per chi l'ha già fatta davvero. */
      (adesso.stato === 'programmata'
        ? '<button class="btn btn-primario btn-grande" id="btn-adesso">' + ICO('target', 18) + ' Falla adesso</button>'
        : '<button class="btn btn-ok btn-grande" id="btn-fatto">' + ICO('check', 18) + ' Fatto</button>') +
      '</div>' +
      '<div class="focus-secondarie">' +
      /* Un tasto, non quattro. «Timer 25′ 10′ 50′» erano tre bersagli su otto
         di tutta la schermata: il cronometro pesava come l'azione. E la
         durata era una scelta in più da fare PRIMA di cominciare, quando è
         già scritta sulla cosa stessa — quella che si dà nella «Giornata»
         trascinando un blocco. Se non c'è, venticinque minuti. */
      (adesso.stato === 'programmata'
        ? '<button class="btn btn-mini" id="btn-fatto">' + ICO('check', 15) + ' Fatto</button>'
        : (timerAttivo
          ? '<button class="btn btn-mini" id="btn-stop-timer">' + ICO('pause', 15) + ' Ferma e registra</button>'
          : '<button class="btn btn-mini" id="btn-timer" data-min="' + minTimer + '">' +
            ICO('play', 15) + ' Timer ' + minTimer + '′</button>')) +
      /* un'abitudine non si rimanda a domani: domani c'è già. Si salta oggi,
         e la serie lo sa. */
      (prossima.tipo === 'abitudine'
        ? '<button class="btn btn-mini btn-ghost" id="btn-salta">Salta oggi ' + ICO('salta', 15) + '</button>'
        : '<button class="btn btn-mini btn-ghost" id="btn-nonora">Più tardi ' + ICO('rimanda', 15) + '</button>') +
      '</div>' +
      /* Quante ne restano lo dice già il contatore in cima e il tasto delle
         altre. Qui resta solo la cosa che nessuno dei due dice: che dopo
         questa non c'è più niente. Scritto come un'etichetta e non come una
         frase — «È l'ultima di oggi» suonava come una voce fuori campo che
         commenta quello che stai facendo, e un'app non ha niente da
         commentare. */
      (inCoda > 0 ? '' :
        '<div class="focus-coda"><span>Ultima di oggi</span></div>') +
      '</div>' +
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
    /* passa da render(), non da vistaFocus(): questa funzione riscrive TUTTO
       $vista, riga delle sezioni compresa, e solo render() la rimette. Aprendo
       «le altre» la riga spariva fino al ridisegno successivo. Con la pagina
       che non cambia, render() conserva lo scorrimento e non anima niente. */
    if (btnAltre) btnAltre.addEventListener('click', function () { mostraAltre = !mostraAltre; render(); });
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
      var abitudine = prossima.tipo === 'abitudine';
      var xp = abitudine ? LM.completaAbitudine(prossima.id) : LM.completaAzione(prossima.id);
      var r = ev.currentTarget.getBoundingClientRect();
      flyXp(r.left + r.width / 2, r.top, xp);
      if (prossima.mit) burst(r.left + r.width / 2, r.top + r.height / 2);
      toast(abitudine ? 'Abitudine spuntata.'
        : (prossima.mit ? 'Hai completato l’azione più importante di oggi.' : 'Azione completata.'),
        xp, abitudine ? 'refresh' : (prossima.mit ? 'star' : 'check'));
      render();
    });
    /* «Falla adesso» non è «Fatto»: è la scelta di spostare qui una cosa che
       il piano metteva più in là. La scheda passa a «Scelta da te», con la
       via del ritorno al piano accanto. */
    var bAdesso = document.getElementById('btn-adesso');
    if (bAdesso) bAdesso.addEventListener('click', function () {
      fuocoScelto = prossima.id; mostraAltre = false; render();
    });
    var bNonOra = document.getElementById('btn-nonora');
    if (bNonOra) bNonOra.addEventListener('click', function () {
      fermaTimer(false);
      if (fuocoScelto === prossima.id) fuocoScelto = null;
      LM.rimandaAzione(prossima.id);
      toast('Rimandata.', 0, 'rimanda');
      render();
    });
    var bSalta = document.getElementById('btn-salta');
    if (bSalta) bSalta.addEventListener('click', function () {
      fermaTimer(false);
      if (fuocoScelto === prossima.id) fuocoScelto = null;
      LM.saltaGiornoAbitudine(prossima.id);
      toast('Saltata per oggi: la serie non si azzera.', 0, 'salta');
      render();
    });
    if (timerAttivo) {
      document.getElementById('btn-stop-timer').addEventListener('click', function () {
        fermaTimer(true);
        toast('Minuti registrati per ' + area.nome + '.', 0, 'durata');
        render();
      });
    } else {
      var bt = document.getElementById('btn-timer');
      if (bt) bt.addEventListener('click', function () { avviaTimer(prossima.id, minTimer, prossima.areaId); });
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
      /* `fatto` arriva dal resoconto della sera: `false` non è un buco, è una
         risposta — quel pasto si vede SALTATO, non scomparso, perché «non ho
         pranzato» è un dato che serve */
      if (p.ora) placed.push({ tipo: 'pasto', min: minOf(p.ora), ora: p.ora, dur: p.durata || 30, nome: p.nome, pastoId: p.id, fatto: p.fatto, icona: /colaz|coffee|breakfast/i.test((p.id || '') + ' ' + p.nome) ? 'coffee' : 'utensils' });
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
    /* Nella pagina la riga in cima alla scheda dice già «23:30→07:30 · 8h»:
       ripeterlo dentro la fascia tratteggiata era lo stesso dato due volte a
       quaranta pixel di distanza. Nel pop-up quella riga non c'è, e qui serve. */
    var sonnoLbl = (opts.mini || opts.senzaEtichettaSonno) ? '' : '<span class="tl-sleep-lbl">' + ICO('bed', 11) + ' ' + fmtOre(LM.minutiSonno(d.k)) + '</span>';
    if (wake > gs) shade += '<div class="tl-sleep" style="top:0;height:' + y(wake) + 'px">' + sonnoLbl + '</div>';
    if (bed < ge) shade += '<div class="tl-sleep" style="top:' + y(bed) + 'px;height:' + (H - y(bed)) + 'px">' + (wake > gs ? '' : sonnoLbl) + '</div>';
    var blocks = disponiBlocchi(d.placed).map(function (it) {
      var e = it.e, dur = e.dur || 30;
      var top = y(em(e.min)), hgt = Math.max(opts.mini ? 15 : 24, dur / 60 * pxh - 2);
      var w = 100 / it.ncols, left = it.col * w;
      var pos = 'top:' + top + 'px;height:' + hgt + 'px;left:calc(' + left + '% + 1px);width:calc(' + w + '% - 3px)';
      if (e.tipo === 'pasto') {
        return '<div class="tl-blk tl-blk-pasto' + (e.fatto === false ? ' saltato' : '') + '" style="' + pos + '"' +
          (e.fatto === false ? ' title="' + esc(e.nome) + ': saltato"' : '') + '>' +
          ICO(e.icona, 13) + (opts.mini ? '' : '<span class="tl-blk-t">' + esc(e.nome) + '</span>') + '</div>';
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
        check + (e.tipo === 'azione' && !opts.mini && opts.interactive ? '<span class="manico" data-manico aria-hidden="true">' + ICO('presa', 13) + '</span>' : '') +
        '<span class="tl-blk-t">' + (e.mit ? ICO('star', 11) + ' ' : '') + esc(e.testo) + '</span>' +
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
        ? '<button class="btn ' + (fatto ? 'btn-ghost' : 'btn-primario') + ' ig-fatto"><span class="ig-fatto-ico">' + ICO(fatto ? 'annulla' : 'check', 15) + '</span>' + (fatto ? 'Fatta — togli la spunta' : 'Segna come fatta') + '</button>'
        : '<div class="ig-nota-futuro">' + ICO('calendar', 13) + ' La spunterai quando arriva il giorno.</div>') +
      '<div class="ig-griglia">' +
      '<label class="campo" for="ig-ora">' + ICO('clock', 13) + ' Orario</label><input type="time" class="tl-time" id="ig-ora" value="' + (e.ora || '') + '">' +
      '<label class="campo" for="ig-dur">Durata</label><select class="tl-dur" id="ig-dur">' + durOpt + '</select>' +
      '<label class="campo" for="ig-area">Area</label>' + selectAree('ig-area', e.areaId) +
      '</div>' +
      '<div class="ig-fondo">' +
      (e.ora ? '<button class="btn btn-mini btn-ghost ig-noora">' + ICO('clock', 13) + ' Togli l’orario</button>' : '') +
      (isAz
        ? '<button class="btn btn-mini ig-indietro">' + ICO('lista', 13) + ' Togli dal giorno' + (e.passoDi ? '' : ' (torna in «Da fare»)') + '</button>' +
          '<button class="btn btn-mini btn-ghost imp-pericolo ig-rimuovi">' + ICO('trash', 13) + ' Elimina</button>'
        : /* un'abitudine si toglie da QUESTO giorno senza cancellarla né
             toccare le altre; il resto si gestisce fra le Abitudini */
          '<button class="btn btn-mini ig-salta">' + ICO('x', 13) + ' Togli solo da ' + esc(etichettaGiorno(k).toLowerCase()) + '</button>' +
          '<button class="btn btn-mini ig-finequi">' + ICO('fineperiodo', 13) + ' Finisce qui (non più da domani)</button>' +
          '<button class="btn btn-mini btn-ghost ig-vairituali">' + ICO('arrowRight', 13) + ' Gestiscila in Attività</button>') +
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
        toast('Da domani non comparirà più. Lo storico resta.', 0, 'fineperiodo');
        chiudiSheet(); ricarica();
      });
      var vai = root.querySelector('.ig-vairituali');
      if (vai) vai.addEventListener('click', function () { chiudiSheet(); attTab = 'abitudini'; location.hash = '#/inbox'; });
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
      /* l'etichetta di gruppo di tutta l'app, col suo numero. Prima era
         un'etichetta sua più la frase «— toccale per dargli un posto nella
         giornata», che ogni riga qui sotto dice già da sé con «dai un orario». */
      senzaOra = '<div class="gio-so">' + etichetta('Senza orario', 'clock', d.tray.length) +
        d.tray.map(function (e) {
          var ar = areaById(e.areaId), col = LM.coloreArea(ar);
          var fatto = e.tipo === 'azione' ? e.done : e.fatto;
          var attr = e.tipo === 'azione' ? 'data-tl-az="' + e.id + '"' : 'data-tl-ab="' + e.id + '"';
          var bAttr = 'data-blk-' + (e.tipo === 'azione' ? 'az' : 'ab') + '="' + e.id + '"';
          return '<div class="gio-so-riga' + (fatto ? ' fatta' : '') + '" style="--c-area:' + col + '"' +
            (e.tipo === 'azione' ? ' data-drag-az="' + e.id + '"' : '') + '>' +
            (spuntabile ? '<button class="tl-check" ' + attr + ' aria-label="Fatto">' + ICO('check', 13) + '</button>' : '') +
            (e.tipo === 'azione' ? '<span class="manico" data-manico aria-hidden="true">' + ICO('presa', 13) + '</span>' : '') +
            '<button class="gio-so-corpo" ' + bAttr + '>' +
            segnoArea(ar, 13, 'tl-tag') +
            '<span class="gio-so-testo">' + esc(e.testo) + (e.mit ? ' ' + ICO('star', 11) : '') + '</span>' +
            '<span class="gio-so-cta">' + ICO('clock', 13) + ' dai un orario</span></button></div>';
        }).join('') + '</div>';
    }
    /* Aggiunta rapida: solo il testo e l'area. L'orario si dà dopo, toccando
       la cosa (meno campi da riempire = meno attrito per buttarla giù). */
    var quickAdd = '';
    if (!compact && interactive) {
      var doveAdd = d.isToday ? 'a oggi' : ('a ' + etichettaGiorno(k).toLowerCase());
      /* l'ultima riga d'aggiunta rimasta col vecchio schema: campo, tendina
         dell'area sempre aperta e tasto pieno, tutti in fila. Adesso è quella
         di tutte le altre — cinque schermate, una riga sola. */
      quickAdd = '<div class="tl-add">' +
        rigaAggiunta('agg-gio', 'Aggiungi qualcosa ' + doveAdd + '…',
          '<label class="agg-area"><span class="agg-eti">in</span>' + selectAree('agg-gio-area') + '</label>') +
        '</div>';
    }

    /* sonno e pasti del giorno: UN solo posto, in cima alla pagina, con un
       riassunto sempre visibile e un pannello che si apre per modificarli. */
    var sonnoTop = '';
    if (!compact && interactive) {
      var aperto = giornataSonnoAperto;
      /* i segni dei pasti dicono già quanti sono: la parola «3 pasti» accanto
         era la stessa cosa detta due volte, e con quattro fatti su una riga la
         mandava a capo. Il gruppo di segni però deve avere un nome, o con la
         voce i pasti non esistono. */
      var nPasti = (d.pasti || []).length;
      var pastiIco = (d.pasti || []).slice(0, 5).map(function (p) { return ICO(/colaz|coffee/i.test((p.id || '') + p.nome) ? 'coffee' : 'utensils', 13); }).join(' ');
      var pastiBlocco = nPasti
        ? '<span role="img" aria-label="' + nPasti + (nPasti === 1 ? ' pasto' : ' pasti') + '">' + pastiIco + '</span>'
        : '<span>nessun pasto</span>';
      /* «dormi» era la parola di troppo che a 320px mandava la riga a capo: con
         il letto davanti e due orari, «8h» è già la durata del sonno */
      var riass = ICO('bed', 13) + ' <b>' + d.sonno + '</b>→<b>' + d.sveglia + '</b> · ' + fmtOre(LM.minutiSonno(k)) + ' · ' + pastiBlocco;
      var durOpt = function (v) { return DURATE.map(function (o) { return '<option value="' + o.v + '"' + ((v || '') === o.v ? ' selected' : '') + '>' + o.t + '</option>'; }).join(''); };
      var pastiRows = (d.pasti || []).map(function (p, i) {
        return '<div class="sp-riga" data-pi="' + i + '">' +
          '<span class="sp-ico">' + ICO(/colaz|coffee/i.test((p.id || '') + p.nome) ? 'coffee' : 'utensils', 15) + '</span>' +
          '<input type="text" class="sp-nome" data-sp-nome="' + i + '" value="' + esc(p.nome) + '" aria-label="Nome del pasto">' +
          '<input type="time" class="tl-time" data-sp-ora="' + i + '" value="' + (p.ora || '') + '" aria-label="Orario">' +
          '<select class="tl-dur" data-sp-dur="' + i + '" aria-label="Durata">' + durOpt(p.durata) + '</select>' +
          '<button class="icona-btn" data-sp-del="' + i + '" title="Rimuovi" aria-label="Rimuovi">' + ICO('trash', 13) + '</button></div>';
      }).join('');
      sonnoTop = '<div class="gio-sonno">' +
        '<button class="gio-sonno-testa" id="gio-sonno-toggle" aria-expanded="' + aperto + '"><span class="gs-riass">' + riass + (d.dalRegistro ? ' <span class="tl-ed-badge">registrato</span>' : '') + '</span>' +
        '<span class="bk-chevron' + (aperto ? ' aperta' : '') + '">' + ICO('chevronGiu', 15) + '</span></button>' +
        /* il corpo c'è sempre (nascosto se chiuso): aprirlo non ricostruisce
           la pagina, così il grafico sopra non si muove */
        ('<div class="gio-sonno-corpo"' + (aperto ? '' : ' hidden') + '>' +
          '<div class="sp-sonno">' +
          '<label class="sp-lab" for="sp-aletto">' + ICO('bed', 13) + ' A letto</label><input type="time" class="tl-time" id="sp-aletto" value="' + d.sonno + '">' +
          '<label class="sp-lab" for="sp-sveglia">' + ICO('sun', 13) + ' Sveglia</label><input type="time" class="tl-time" id="sp-sveglia" value="' + d.sveglia + '">' +
          '<span class="sp-dorm">' + ICO('durata', 13) + ' dormi <b id="sp-dorm">' + fmtOre(LM.minutiSonno(k)) + '</b></span>' +
          '</div>' +
          '<div class="sp-pasti" id="sp-pasti">' + pastiRows + '</div>' +
          '<div class="riga-flex mt-s"><button class="btn btn-mini" id="sp-add">' + ICO('plus', 13) + ' Aggiungi un pasto</button>' +
          (d.dalRegistro ? '<button class="btn btn-mini btn-ghost" id="sp-reset">Torna al ritmo di base</button>' : '') +
          '<button class="btn btn-mini btn-ghost" id="sp-base">' + ICO('ritmo', 13) + ' Cambia il ritmo di base</button></div>' +
          '<div class="imp-nota" style="margin-top:8px">Vale per <b>questo giorno</b> e resta nel registro. Il ritmo di base (per gli altri giorni) si cambia da «Cambia il ritmo di base».</div>' +
          '</div>') + '</div>';
    }

    var trayRo = '';
    if (!interactive && d.tray.length) {
      trayRo = '<div class="tl-tray"><div class="tl-tray-eti">Senza orario</div>' +
        d.tray.map(function (e) {
          var ar = areaById(e.areaId), col = LM.coloreArea(ar);
          return '<div class="tl-ed-riga" style="--c-area:' + col + '">' + segnoArea(ar, 13, 'tl-tag') + '<span class="tl-ed-testo">' + esc(e.testo) + '</span></div>';
        }).join('') + '</div>';
    }

    var footer = '';
    /* Ripianificare in blocco: la sera (o un giorno passato rimasto a metà) si
       porta al giorno dopo quello che non è stato fatto, senza riscrivere. */
    if (!compact) {
      var nonFatte = d.placed.concat(d.tray).filter(function (e) { return e.tipo === 'azione' && !e.done; });
      if (nonFatte.length && !isFuturo) {
        var doveVa = etichettaGiorno(LM.addDays(k, 1)).toLowerCase();
        /* la rassicurazione sta DENTRO il tasto, come «+10 XP» sta dentro
           «Fatto»: era una riga a sé sotto un tasto, due elementi per una cosa */
        footer = '<div class="tl-piede"><button class="btn btn-mini" id="tl-rimanda">' + ICO('rimanda', 15) +
          ' Sposta le ' + nonFatte.length + ' non fatte a ' + doveVa + ' <small>senza penalità</small></button></div>';
      }
    }
    if (compact && opts.controls !== false) {
      footer = '<div class="tl-piede"><button class="btn btn-primario btn-mini" id="tl-apri-pagina">' + ICO('calendar', 15) + ' Gestisci la giornata ' + ICO('arrowRight', 13) + '</button></div>';
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
    /* Nella pagina il titolo diceva «La giornata» per la terza volta in
       trecento pixel — dopo il titolo della pagina e dopo la linguetta — e
       sotto c'era il manuale dei gesti («tocca, trascina, spunta»), trentotto
       pixel di lezione mostrati per sempre. Il titolo se ne va, e la riga
       sotto resta SOLO quando dice qualcosa che non puoi indovinare: che il
       giorno è futuro (lo stai preparando) o passato (lo puoi ancora
       sistemare). Per oggi non serve: i gesti si scoprono facendoli, e il
       sottotitolo della pagina spiega già le frecce. */
    var sottoHead = compact
      ? (sommario || 'Spunta quello che fai; per cambiare gli orari apri La giornata.')
      : (isFuturo ? 'Giorno futuro: le spunte si mettono quando ci arrivi.'
         : d.isToday ? ''
         : 'Giorno passato: le spunte si mettono ancora, se qualcosa era rimasto fuori.');
    /* nel pop-up il titolo è già nell'intestazione del pannello: ripeterlo
       "La giornata / La giornata" era solo rumore */
    var head = (opts.header === false || (!compact && !sottoHead)) ? '' :
      '<div class="tl-head"><div>' +
      (compact ? '' : '') +
      '<div class="sotto">' + sottoHead + '</div></div></div>';
    var gridHtml = vuota
      ? '<div class="vuoto" style="padding:18px 8px"><b>Niente in agenda per questo giorno.</b>' + (isFuturo ? '<br>Puoi già prepararlo: aggiungi qui sotto le cose che vuoi fare.' : interactive ? '<br>Aggiungi una cosa qui sotto, o dai un orario a un’abitudine.' : '') + '</div>'
      : htmlTimeGrid(d, { interactive: interactive, spuntabile: spuntabile, nowMin: nowMin, pxh: pxh,
          senzaEtichettaSonno: !compact && interactive });

    if (compact) {
      var popNota = d.tray.length ? '<div class="tl-pop-note">' + ICO('clock', 13) + ' ' + d.tray.length + (d.tray.length === 1 ? ' cosa senza orario' : ' cose senza orario') + ', qui sotto.</div>' : '';
      container.innerHTML = '<div class="card giornata giornata-pop">' + head + '<div id="tl-grid-host">' + gridHtml + '</div>' + popNota + footer + '</div>';
    } else {
      /* Il navigatore del giorno era una riga fuori dalla scheda, e la scheda
         aveva una sua intestazione: due teste una sopra l'altra. Adesso è la
         prima riga della scheda — è quello che dice DI CHE GIORNO stai
         guardando le ore, quindi è la sua intestazione. */
      var navGiorno = orizzNav('giorno', k);
      container.innerHTML = '<div class="card giornata">' + navGiorno + head + sonnoTop + '<div id="tl-grid-host">' + gridHtml + '</div>' + senzaOra + quickAdd + trayRo + footer + '</div>';
      wireOrizzNav(container, 'giorno');
    }

    wireRigaAggiunta(container, 'agg-gio', function (testo, opz) {
      var sel = opz && opz.querySelector('select');
      LM.aggiungiAzione(testo, sel ? sel.value : 'altro', { data: k, mit: LM.serveMit(k) });
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
      if (spReset) spReset.addEventListener('click', function () { LM.azzeraRitmoGiorno(k); toast('Ripristinato il ritmo di base.', 0, 'annulla'); montaGiornata(container, opts); });
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
      toast(n === 1 ? 'Spostata al giorno dopo.' : n + ' cose spostate al giorno dopo.', 0, 'rimanda');
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
      var scadHtml = scad.length ? '<div class="wk-scad" title="scadenze">' + ICO('scadenza', 11) + ' ' + scad.length + '</div>' : '';
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
      var scadBadge = scadG.length ? '<span class="me-scad" title="' + esc(scadG.map(function (b) { return b.testo; }).join(', ')) + '">' + ICO('scadenza', 11) + (scadG.length > 1 ? ' ' + scadG.length : '') + '</span>' : '';
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
      /* le sette colonne stanno dentro un contenitore che SCORRE di lato: su un
         telefono da 320px, sette colonne in duecentottanta pixel fanno celle da
         trentun pixel, dove non ci sta né una pastiglia né un numero. Meglio
         celle vere e un trascinamento laterale — che è quello che fa qualunque
         calendario su un telefono — che sette colonne illeggibili.
         Il giorno della settimana scorre insieme alla griglia: sono la stessa
         tabella, e se scorresse solo una delle due le lettere finirebbero sopra
         la colonna sbagliata. */
      '<div class="card"><div class="me-scorri"><div class="me-tabella">' +
      '<div class="me-dow">' + dowh + '</div><div class="me-grid">' + celle + '</div></div></div>' +
      '<div class="me-legenda"><span class="lg"><i class="me-heatkey"></i> più lo sfondo è acceso, più la giornata è stata piena</span>' +
      '<span class="lg"><i class="me-sqkey"></i> ogni quadretto è una cosa fatta, col colore dell’area</span>' +
      '<span class="lg">' + ICO('scadenza', 11) + ' scadenza · tocca un giorno per aprirlo</span></div></div>';
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
        segnoArea(ar, 13, 'tl-tag') + '</div>';
    }).join('') : '<div class="sotto" style="margin:0">Nessuna scadenza registrata per il ' + anno + '.</div>';

    container.innerHTML = orizzNav('anno', giornataAncora, null, '' + anno) +
      '<div class="card"><div class="eroe-statistiche" style="justify-content:flex-start;margin-bottom:14px">' +
      '<div class="stat"><span class="stat-val">' + attivi + '</span><span class="stat-eti">giorni attivi</span></div>' +
      '<div class="stat"><span class="stat-val">' + azFatte + '</span><span class="stat-eti">azioni fatte</span></div>' +
      '<div class="stat"><span class="stat-val">' + xpAnno + '</span><span class="stat-eti">XP</span></div></div>' +
      '<h2 style="font-size:14px">' + ICO('trendUp', 15) + ' La tua attività, giorno per giorno</h2>' +
      '<div class="an-heat-wrap"><div id="an-heat"></div></div></div>' +
      '<div class="card mt"><h2>' + ICO('scadenza', 15) + ' Scadenze del ' + anno + '</h2><div class="an-scad-lista mt-s">' + scadHtml + '</div></div>';
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
      '<button class="icona-btn" data-nav="prev" aria-label="' + (orizz === 'giorno' ? 'Giorno precedente' : 'Periodo precedente') + '">' + ICO('chevronGiu', 15) + '</button>' +
      '<span class="orizz-eti">' + testo + quanto + '</span>' +
      '<button class="icona-btn" data-nav="next" aria-label="' + (orizz === 'giorno' ? 'Giorno successivo' : 'Periodo successivo') + '">' + ICO('chevronGiu', 15) + '</button>' +
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
    /* Prima ora, poi il nome: «alle 15:00 Confrontare piani telefonici» è un
       appuntamento, «poi Confrontare piani telefonici · 15:00» è la prossima
       cosa da fare. E la prossima cosa da fare la dice già la schermata sotto,
       che quando quella suggerita non ha un orario ne nomina UN'ALTRA: due
       risposte diverse alla stessa domanda, a cento pixel di distanza. Questa
       riga risponde a «dove sono nella giornata», non a «cosa faccio». */
    var sotto = pross ? 'alle ' + pross.ora + ' ' + esc(pross.nome || pross.testo)
      : (d.placed.length ? 'niente altro in agenda oggi' : 'nessun orario per oggi — tocca per aggiungerne');
    /* In cima a «Oggi» questa è la cosa MENO importante della schermata: dice
       dove sei nella giornata, non cosa fare. Prima aveva un titolo suo, una
       freccia e tre statistiche («4 con durata · 3 pasti · 1 senza orario»),
       pesava 131px e spingeva l'azione al quarto posto, a trecento pixel dal
       bordo. Il conto dei blocchi sta nella pagina «Giornata», a un tocco da
       qui. Qui resta quello che si guarda in mezzo secondo: quanto è passato,
       e cosa viene dopo. Da 131px a settanta. */
    return '<button class="giornata-strip" id="giornata-strip-btn" aria-label="Apri la giornata">' +
      /* il segno dell'ORA ADESSO sta FUORI dalla barra: sporge di tre pixel
         sopra e sotto, e la barra adesso è ritagliata a supercerchio — dentro
         gli si taglierebbero via le punte e il pallino. */
      '<div class="strip-pista"><div class="strip-barra">' + marks + '</div>' + nowEl + '</div>' +
      '<div class="strip-estremi"><span>' + d.sveglia + '</span>' +
      '<span class="strip-sotto">' + sotto + ' ' + ICO('arrowRight', 11) + '</span>' +
      '<span>' + d.sonnoRoutine + '</span></div>' +
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
      '<div class="imp-nota" style="margin-top:0">È il ritmo di base, quello che disegna lo sfondo della giornata. Un singolo giorno si registra a parte, dalla pagina <i>Giornata</i>.</div>' +
      '<div class="ritmo-riga2"><label class="campo" for="ritmo-sonno">A letto</label><input type="time" id="ritmo-sonno" value="' + esc(r.sonno) + '">' +
      '<label class="campo" for="ritmo-sveglia">Sveglia</label><input type="time" id="ritmo-sveglia" value="' + esc(r.sveglia) + '"></div>' +
      '<div class="sp-dorm" style="margin:2px 0 4px">' + ICO('durata', 13) + ' dormi <b id="ritmo-dorm">' + fmtOre(durSonno(r.sonno, r.sveglia)) + '</b></div>' +
      /* «Pasti (nome · ora · durata)» erano le intestazioni di una tabella
         scritte nel titolo, sopra tre campi che dicono già cosa sono */
      '<div class="imp-sezione"><div class="imp-eti">Pasti</div><div id="ritmo-pasti">' + (r.pasti || []).map(pastoRiga).join('') + '</div>' +
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
        '<span class="seg-ico">' + ICO(ico, 13) + '</span><span class="seg-eti">' + et + '</span></button>';
    }
    var html = topbar('La giornata', '', '', '', true);
    /* Due gradini della stessa famiglia. Sopra si scegle la SEZIONE della porta
       (Adesso, La giornata, Rituali); qui un VALORE dentro la sezione — quale
       scala di tempo guardo. La differenza è la MISURA, non l'icona: per un
       primo colpo d'occhio un segno vale più di una parola, e togliere le
       icone per distinguere i due gradini era pagare il prezzo sbagliato.
       Segno più piccolo, parola più piccola, riga più bassa. */
    html += '<div class="segmenti mini-seg sotto-seg" id="orizz-nav">' +
      orizz('giorno', 'unGiorno', 'Giorno') + orizz('settimana', 'unaSettimana', 'Settimana') +
      orizz('mese', 'unMese', 'Mese') + orizz('anno', 'unAnno', 'Anno') + '</div>' +
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
    /* «Domani» mancava: il tasto per rimandare diceva «Sposta a mer 19 ago»
       quando bastava «a domani», e andava a capo su due righe */
    if (k === LM.addDays(t, 1)) return 'Domani';
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
  /* Chi porta il tasto «Annulla», fra due righe che raccontano lo stesso
     cambiamento (per esempio la nota annotata e la riga di registro che la
     racconta). Vince quella che ha un dato da togliere: disfare il dato
     tocca solo quella cosa, mentre il punto di ritorno riporta indietro
     anche tutto quello che è venuto dopo. A pari merito, la più recente. */
  var annullaPadroni = null;
  function padroniAnnulla(giorni) {
    var perPunto = {};
    giorni.forEach(function (g) {
      g.eventi.forEach(function (ev) {
        var pt = LM.puntoDiRitorno(ev.ts);
        if (!pt) return;
        var att = perPunto[pt.id];
        if (!att || (ev.chiave && !att.chiave)) perPunto[pt.id] = ev;
      });
    });
    var set = new Set();
    Object.keys(perPunto).forEach(function (k) { set.add(perPunto[k]); });
    return set;
  }
  function eventoDiarioHtml(ev) {
    var ico, testo, cls = '';
    if (ev.tipo === 'azione') {
      var ar = areaById(ev.areaId);
      ico = '<span class="diario-ico ok">' + ICO('check', 15) + '</span>';
      testo = 'Completata · <b>' + esc(ev.testo) + '</b>' +
        ' ' + segnoArea(ar, 13, 'diario-area') +
        (ev.mit ? ' <span class="tag-mit">' + ICO('star', 11) + 'Priorità</span>' : '');
    } else if (ev.tipo === 'checkin') {
      /* il check-in ha il suo segno (il battito): il fulmine è la cattura
         rapida, e qui era rimasto da prima che li separassi */
      ico = '<span class="diario-ico">' + ICO('polso', 15) + '</span>';
      testo = 'Check-in · energia <b>' + ev.energia + '</b> · focus <b>' + ev.focus + '</b> · umore <b>' + ev.umore + '</b>';
    } else if (ev.tipo === 'mattina') {
      ico = '<span class="diario-ico">' + ICO('sun', 15) + '</span>';
      testo = 'Piano del mattino' + (ev.intenzione ? ' · <span class="diario-sec">' + esc(ev.intenzione) + '</span>' : '');
    } else if (ev.tipo === 'sera') {
      ico = '<span class="diario-ico">' + ICO('moon', 15) + '</span>';
      testo = 'Review della sera' +
        (ev.vittoria ? ' · <span class="diario-sec">andata bene: ' + esc(ev.vittoria) + '</span>' : '') +
        (ev.blocco ? ' · <span class="diario-sec">ostacolo: ' + esc(ev.blocco) + '</span>' : '');
    } else if (ev.tipo === 'settimana') {
      ico = '<span class="diario-ico">' + ICO('calendar', 15) + '</span>';
      testo = 'Review della settimana' + (ev.imparato ? ' · <span class="diario-sec">' + esc(ev.imparato) + '</span>' : '');
    } else if (ev.tipo === 'registro') {
      /* Nel diario ogni riga porta il segno della cosa di cui parla, e sono gli
         stessi segni del resto dell'app: così il registro si legge a colpo
         d'occhio invece che riga per riga. Prima «area» usava le stelline (che
         vogliono dire «extra») e «focus» il quadrante come «giornata» — due
         categorie diverse con la stessa figura. */
      var icoCat = { azione: 'target', abitudine: 'refresh', backlog: 'lista', inbox: 'inbox',
        area: 'aree', giornata: 'giornata', focus: 'mirino', impostazioni: 'ingranaggio', dati: 'dati',
        /* due categorie e non una: nel diario si deve vedere da lontano se
           quella riga racconta una cosa che funziona o una che no */
        'lezione-si': 'funziona', 'lezione-no': 'nonFunziona' };
      ico = '<span class="diario-ico' + (ev.imp ? '' : ' minore') + '">' + ICO(icoCat[ev.cat] || 'lista', 13) + '</span>';
      testo = '<span class="diario-log">' + esc(ev.testo) + '</span>';
      cls = ev.imp ? '' : ' minore';
    } else { /* cattura */
      ico = '<span class="diario-ico">' + ICO('inbox', 15) + '</span>';
      testo = 'Annotato · <b>' + esc(ev.testo) + '</b>';
    }
    /* per le azioni si può riassegnare l'area anche a distanza di giorni */
    if (ev.tipo === 'azione' && ev.id) {
      testo += ' <span class="diario-cambia">' + selectAreaAzione(ev.id, ev.areaId, 'mini') + '</span>';
    }
    /* Qui si annulla. Il diario è la lista di quello che hai fatto, quindi è
       il posto dove disfarlo: prima si poteva solo nei sette secondi del
       messaggino, e su due cose in croce.
       Due strade, e si prende la più precisa che c'è:
         · la riga È un dato salvato (una spunta, un check-in, una review, una
           nota, l'abitudine di ieri) → si toglie quel dato. Vale a qualunque
           distanza di tempo, ed è questo che rende l'annulla buono anche per
           quello che c'era già nel diario prima.
         · la riga racconta un cambiamento senza esserlo → il punto di ritorno,
           se c'è ancora (le ultime dodici cose).
       Un tasto per cambiamento, non per riga: una cosa sola può comparire su
       due righe (la nota annotata e la riga di registro che la racconta), e
       due tasti identici a due righe di distanza sono un doppione. Quale delle
       due lo porta lo decide padroniAnnulla, sopra. */
    var punto = LM.puntoDiRitorno(ev.ts);
    var annulla = '';
    var mostra = punto ? (!annullaPadroni || annullaPadroni.has(ev)) : !!ev.chiave;
    if (mostra) {
      annulla = '<button class="diario-annulla" data-annulla="' + ev.ts + '"' +
        (ev.chiave ? ' data-tipo="' + (ev.tipoDisfa || ev.tipo) + '" data-chiave="' + esc(String(ev.chiave)) + '"' : '') +
        ' aria-label="Annulla" title="' + (ev.chiave ? 'Disfa questa cosa' : 'Torna a com’era prima di questa cosa') + '">' +
        ICO('annulla', 13) + '<span class="da-eti">Annulla</span></button>';
    }
    return '<div class="diario-evento' + cls + '">' + ico + '<div class="diario-testo">' + testo + '</div>' +
      annulla + '<span class="diario-ora">' + oraDi(ev.ts) + '</span></div>';
  }

  function vistaPlancia() {
    var s = LM.load();
    var lvl = LM.livelloDaXp(s.xp);
    var st = LM.streak();
    var oggi = LM.azioniDiOggi();
    var fatte = oggi.filter(function (a) { return a.done; }).length;
    var t = LM.todayKey();
    var checkinOggi = s.checkins.filter(function (c) { return c.data === t; }).length;

    /* La porta delle impostazioni stava QUI, nella testa di questa schermata:
       su telefono era l'unica di tutta l'app, e per arrivarci bisognava sapere
       che era nell'angolo di «Panoramica». Adesso sta nella barra in basso, che
       è dove uno cerca le porte, e su monitor nel piede della barra laterale —
       due posti fissi, uguali su ogni schermata. */
    var html = topbar('Panoramica', '', '', 't-plancia', true);

    /* eroe essenziale: anello + XP + tre indicatori come chip (niente
       muro di didascalie: le spiegazioni stanno nei tooltip) */
    function chip(ico, testo, cls, titolo) {
      return '<span class="chip"' + (titolo ? ' title="' + esc(titolo) + '"' : '') + '>' + ICO(ico, 15, cls) + ' ' + testo + '</span>';
    }
    html += '<div class="card eroe2">' +
      '<div id="anello-livello" title="Progresso verso il prossimo livello"></div>' +
      '<div class="eroe2-corpo">' +
      '<div class="eroe2-xp"><span id="xp-contatore">0</span> <span class="eroe2-unita">XP</span></div>' +
      '<div class="eroe2-sub">Livello ' + lvl.livello + ' · ancora ' + (lvl.prossimo - s.xp) + ' XP al livello ' + (lvl.livello + 1) + '</div>' +
      '<div class="eroe2-chips">' +
      chip('flame', '<b>' + st.corrente + '</b> giorni di fila', 'fiamma', 'Un giorno saltato non azzera la serie.') +
      chip('check', '<b>' + fatte + '/' + oggi.length + '</b> azioni oggi') +
      chip('polso', '<b>' + checkinOggi + '</b> check-in oggi') +
      '</div></div>' +
      '<button class="btn btn-primario eroe2-cta" data-vai="oggi">' + ICO('target', 15) + ' Vai a Oggi</button>' +
      '</div>';

    /* schede interne: si vede una sezione per volta */
    function segp(id, ico, et) {
      return '<button data-sez="' + id + '" class="' + (sezPlancia === id ? 'attivo' : '') + '">' +
        '<span class="seg-ico">' + ICO(ico, 13) + '</span><span class="seg-eti">' + et + '</span></button>';
    }
    /* Una riga di sezione per schermata. Qui la porta «Andamento» ha già la
       sua (Panoramica / Esperimenti): questa sceglie COSA guardare dentro
       Panoramica, quindi è il gradino compatto — segno e parola più piccoli,
       riga più bassa. Le icone restano: sono il modo più rapido di trovare la
       voce giusta, e a rinunciarci si perde più di quanto si guadagni. */
    html += '<div class="segmenti mini-seg sotto-seg" id="sez-plancia">' + segp('riepilogo', 'riepilogo', 'Riepilogo') + segp('diario', 'quaderno', 'Diario') + segp('aree', 'aree', 'Aree') + segp('andamento', 'trendUp', 'Grafici') + '</div>';
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
        '<div class="card" style="--i:0"><h2>' + ICO('target', 15) + ' Le azioni di oggi</h2>' +
        /* «Oggi» non è più un link: il pulsante pieno «Vai a Oggi» sta due
           riquadri sopra, nella stessa schermata, e portava esattamente allo
           stesso posto. «Rituali» resta, da questa scheda non si raggiunge
           altrimenti. */
        /* Il paragrafo che stava qui («Scelte in Rituali, fatte una per volta
     in Oggi. Qui sono tutte insieme.») spiegava l'architettura dell'app
     sopra una lista di due righe che si legge da sé. Il titolo dice cosa
     sono, le spunte dicono come si usano: la mappa del sito non serve. */
        '<div class="lista-azioni" id="lista-oggi"></div>' +
        /* la stessa riga d'aggiunta di tutte le altre: era la terza variante
           in tre schermate — qui campo, tendina e tasto in fila; in Rituali
           gli stessi tre su tre righe; in «Da fare» e nelle abitudini quella
           giusta. Ora è una sola, e l'area si apre solo quando serve. */
        '<div class="mt-s">' +
        rigaAggiunta('agg-riep', 'Aggiungi un’altra cosa a oggi…',
          '<label class="agg-area"><span class="agg-eti">in</span>' + selectAree('agg-riep-area') + '</label>') +
        '</div></div>' +
        '<div class="card" style="--i:1"><h2>' + ICO('trendUp', 15) + ' Costanza</h2>' +
        '<div class="sotto">XP di ogni giorno, nelle ultime 12 settimane.</div>' +
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
            (a.mit ? '<span class="tag-mit">' + ICO('star', 11) + 'Priorità</span>' : '') +
            segnoArea(ar, 15, 'tag-area') + '</div>';
        }).join('');
        lista.querySelectorAll('.spunta').forEach(function (b) {
          b.addEventListener('click', function (ev) {
            feedbackSpunta(ev, LM.completaAzione(b.getAttribute('data-id')), 'Azione completata.', 'check');
            render();
          });
        });
      }
      wireRigaAggiunta(c, 'agg-riep', function (testo, opz) {
        var sel = opz && opz.querySelector('select');
        LM.aggiungiAzione(testo, sel ? sel.value : 'altro', { mit: LM.serveMit() });
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
          '<div class="testata"><span class="icona-area">' + ICO(a.icona, 15) + '</span>' + esc(a.nome) + '</div>' +
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
      c.innerHTML = '<div class="card" style="--i:0"><div class="card-testa"><h2>' + ICO('polso', 15) + ' Energia, focus e umore</h2>' +
        '<div class="segmenti mini-seg" id="seg-periodo">' +
        '<button data-g="14" class="' + (periodoTrend === 14 ? 'attivo' : '') + '">14 giorni</button>' +
        '<button data-g="30" class="' + (periodoTrend === 30 ? 'attivo' : '') + '">30 giorni</button></div></div>' +
        '<div class="sotto">Media dei check-in, da 1 a 5.</div><div id="trend-checkin"></div></div>' +
        '<div class="card mt" style="--i:1"><h2>' + ICO('tempospeso', 15) + ' Come hai speso il tempo</h2>' +
        '<div class="sotto">Minuti per area, negli ultimi 7 giorni.</div><div id="hbar-minuti"></div></div>';

      LMCharts.trend(document.getElementById('trend-checkin'), [
        { nome: 'Energia', colore: dark ? '#c98500' : '#eda100', punti: LM.serieCheckin('energia', periodoTrend) },
        { nome: 'Focus',   colore: dark ? '#3987e5' : '#2a78d6', punti: LM.serieCheckin('focus', periodoTrend) },
        { nome: 'Umore',   colore: dark ? '#199e70' : '#1baf7a', punti: LM.serieCheckin('umore', periodoTrend) }
      ], { min: 1, max: 5, label: 'Andamento di energia, focus e umore' });

      LMCharts.hbar(document.getElementById('hbar-minuti'),
        LM.minutiSettimanaPerArea().sort(function (a, b) { return b.minuti - a.minuti; })
          .map(function (r) { return { label: r.area.nome, icona: ICO(r.area.icona, 15), value: r.minuti, colore: LM.coloreArea(r.area) }; }),
        { unita: 'min' });

      document.getElementById('seg-periodo').querySelectorAll('[data-g]').forEach(function (b) {
        b.addEventListener('click', function () { periodoTrend = +b.getAttribute('data-g'); disegnaSezione(); });
      });
    }

    /* --- Diario: cronologia di ciò che hai fatto e scritto --- */
    function sezDiario(c) {
      var giorni = LM.diario(diarioGiorni, diarioTutto);
      annullaPadroni = padroniAnnulla(giorni);
      var filtro = '<div class="segmenti mini-seg" id="diario-filtro">' +
        '<button data-tutto="0" class="' + (!diarioTutto ? 'attivo' : '') + '">Cose importanti</button>' +
        '<button data-tutto="1" class="' + (diarioTutto ? 'attivo' : '') + '">Tutto</button></div>';
      var html;
      if (!giorni.length) {
        html = '<div class="card diario"><div class="card-testa">' + filtro + '</div>' +
          '<div class="vuoto" style="padding:20px 8px">' + ICO('quaderno', 26) + '<br><b>Ancora niente da mostrare.</b><br>Appena fai qualcosa comparirà qui, giorno per giorno.</div></div>';
      } else {
        /* la riga sotto il filtro dice SOLO quello che il filtro non dice da
           sé: cosa resta fuori. Prima ci stava anche «la storia di tutto ciò
           che fai — azioni, note, scelte, impostazioni», che è la definizione
           della parola «diario» scritta sotto la parola «Diario». */
        html = '<div class="card diario"><div class="card-testa">' + filtro +
          (diarioTutto ? '' : '<div class="sotto" style="margin:0">Con «Tutto» compaiono anche le modifiche minori.</div>') + '</div>';
        giorni.forEach(function (g) {
          html += '<div class="diario-giorno">' +
            '<div class="diario-data">' + etichettaGiorno(g.data) + '</div>' +
            '<div class="diario-eventi">' + g.eventi.map(eventoDiarioHtml).join('') + '</div></div>';
        });
        html += '</div>';
        var totGiorni = LM.giorniConAttivita();
        if (totGiorni > giorni.length) {
          html += '<div style="text-align:center" class="mt"><button class="btn" id="diario-altro">' + ICO('chevronGiu', 15) + ' Mostra altri giorni</button></div>';
        }
      }
      c.innerHTML = html;
      var b = document.getElementById('diario-altro');
      if (b) b.addEventListener('click', function () { diarioGiorni += 30; disegnaSezione(); });
      document.getElementById('diario-filtro').querySelectorAll('[data-tutto]').forEach(function (bt) {
        bt.addEventListener('click', function () { diarioTutto = bt.getAttribute('data-tutto') === '1'; disegnaSezione(); });
      });
      c.querySelectorAll('[data-annulla]').forEach(function (bt) {
        bt.addEventListener('click', function () {
          /* l'etichetta è il testo della riga stessa: è quello che l'utente
             sta guardando, e finisce nella riga «Annullato: …» */
          var riga = bt.closest('.diario-evento');
          var eti = riga ? (riga.querySelector('.diario-testo') || {}).textContent : '';
          annullaDalDiario(+bt.getAttribute('data-annulla'), (eti || '').replace(/\s+/g, ' ').trim().slice(0, 60),
            bt.getAttribute('data-tipo'), bt.getAttribute('data-chiave'));
        });
      });
    }
  }

  /* Annullare dal diario, per qualunque riga e a qualunque distanza di tempo.
     Se la riga ha un dato dietro si toglie quel dato: è un'operazione esatta,
     non tocca nient'altro e si fa subito, col «Rimetti» nel messaggio.
     Solo per le righe di registro serve il punto di ritorno, che riporta
     indietro anche tutto quello che è venuto dopo: per l'ultima cosa fatta le
     due cose coincidono, per una più vecchia si dice quante altre rientrano e
     si chiede conferma — una sorpresa qui costa più di un tocco in più. */
  function annullaDalDiario(ts, etichetta, tipo, chiave) {
    /* «Rimetti»: lo stato di adesso, messo da parte prima di toccarlo */
    function conRimetti(fai) {
      var prima = JSON.parse(JSON.stringify(LM.load()));
      if (!fai()) { toast('Questa non si può più annullare.', 0, 'aiuto'); return; }
      render();
      toast('Annullato.', 0, 'annulla', { eti: 'Rimetti', fai: function () {
        LM.ripristinaStato(prima);
        render();
        toast('Rimesso com’era.', 0, 'check');
      } });
    }
    if (tipo && chiave) {
      conRimetti(function () { return LM.annullaRecord(tipo, chiave); });
      return;
    }
    var punto = LM.puntoDiRitorno(ts);
    if (!punto) { toast('Questa è troppo indietro: non si può più annullare.', 0, 'aiuto'); return; }
    function fallo() { conRimetti(function () { return LM.tornaAlPunto(ts, etichetta); }); }
    /* l'ultima cosa fatta si annulla senza chiedere: annullarla non tocca
       nient'altro, e c'è il «Rimetti» nel messaggio */
    if (!punto.dopo) { fallo(); return; }
    avviso({
      titolo: 'Torniamo indietro fin qui?',
      testo: 'Annullare questa riporta indietro anche quello che hai fatto dopo: ' +
        punto.dopo + (punto.dopo === 1 ? ' cosa.' : ' cose.') + ' Si può rimettere subito dopo.',
      azione: 'Torna indietro', annulla: 'Lascia stare'
    }, fallo);
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
    { eti: 'Bilanci',          ids: ['checkin', 'sera', 'settimana'] }
  ];
  /* quali sezioni sono aperte: ognuna si apre e si chiude per conto suo, e
     aprirne una non chiude le altre (linee guida Apple: le sezioni a
     scomparsa sono indipendenti, e lo stato di chi le ha aperte si rispetta) */
  var ritualiAperti = null;
  var RITUALI = [
    { id: 'mattina',   ico: 'sun',      nome: 'Le azioni di oggi',      quando: 'giorno' },
    { id: 'checkin',   ico: 'polso',    nome: 'Check-in',               quando: 'giorno' },
    { id: 'sera',      ico: 'moon',     nome: 'Review della sera',      quando: 'giorno' },
    { id: 'settimana', ico: 'calendar', nome: 'Review della settimana', quando: 'ogni tanto' }
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
      el.innerHTML = (st.fatto ? ICO('check', 13) + ' ' : '') + esc(st.testo);
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
    var wk = LM.weekKey(t);
    return s.reviewSettimana[wk] ? { fatto: true, testo: 'fatta' } : { fatto: false, testo: 'da fare' };
  }

  function vistaRituali() {
    var adesso = ritualeDellOra();
    /* alla prima apertura è aperto quello dell'ora; dopo vale quello che hai
       deciso tu, e non lo tocca più nessuno.
       Con delle abitudini ancora da spuntare si apre anche quella sezione:
       è la sola che ha un lavoro in sospeso ogni giorno, e trovarla chiusa
       significa che le abitudini di oggi non le vede chi passa di qui. */
    if (!ritualiAperti) { ritualiAperti = {}; ritualiAperti[adesso] = true; }
    /* chi arriva da un collegamento (la riga in Oggi, «vai alle abitudini»)
       apre quella sezione SENZA chiudere le altre */
    var daScorrere = null;
    if (sottoRituale) { ritualiAperti[sottoRituale] = true; daScorrere = sottoRituale; sottoRituale = null; }

    function rigaRit(r) {
      var st = statoRituale(r.id);
      var aperto = !!ritualiAperti[r.id];
      return '<section class="rit-blocco' + (aperto ? ' aperto' : '') + '" data-rit="' + r.id + '">' +
        '<button class="rit-riga" data-sub="' + r.id + '" aria-expanded="' + aperto + '" aria-controls="corpo-rit-' + r.id + '">' +
        '<span class="rit-ico">' + ICO(r.ico, 15) + '</span>' +
        '<span class="rit-nome">' + r.nome + '</span>' +
        (r.id === adesso ? '<span class="rit-ora">adesso</span>' : '') +
        '<span class="rit-stato' + (st.fatto ? ' fatto' : '') + '">' + (st.fatto ? ICO('check', 13) + ' ' : '') + esc(st.testo) + '</span>' +
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

    $vista.innerHTML = topbar('Rituali', '', '', '', true) + corpoHtml;

    /* disegna il contenuto di TUTTE le sezioni aperte */
    var disegna = {
      mattina: ritualeMattina,
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

  /* ============================================================
     IL RESOCONTO DELLA GIORNATA: la notte, i pasti, e quello che hai fatto
     senza scriverlo
     ============================================================

     Tre dati che l'app non può sapere da sola e che senza qualcuno che li
     chieda non esistono: a che ora hai dormito, se hai mangiato, e le cose che
     hai fatto senza avere voglia di aprire l'app. Chi ha l'ADHD non tiene un
     registro: se il dato dev'essere inserito di sua iniziativa, non c'è.

     QUANDO SI CHIEDE. Ogni domanda arriva nel momento in cui la risposta
     esiste: la notte al mattino, i pasti e il resto la sera. Una volta al
     giorno, e «non adesso» è sempre una risposta valida — la stessa domanda
     resta nei Rituali, dove sta di casa.

     LA NOTTATA. Chi è rimasto alzato fino alle quattro e riapre l'app alle
     quattro e dieci non deve sentirsi chiedere com'è andata la notte: non è
     un giorno nuovo, è lo stesso giorno che continua. Per questo si guarda il
     BUCO fra l'ultima volta che ti ho visto e adesso: sotto le tre ore la
     notte non ci sta, e non si chiede niente. E prima delle cinque non si
     chiede in nessun caso.

     LA PRECISIONE. «Mi sono svegliato alle 7:30» detto da chi ha guardato la
     sveglia e da chi tira a indovinare sono due numeri diversi con lo stesso
     aspetto. E chi tiene alla precisione, se non può dire «più o meno»,
     preferisce non rispondere: succede sempre, e produce un dato mancante
     invece di un dato onesto. Quindi ogni orario porta con sé come è stato
     dato, e la scelta è preselezionata da COME lo si è messo: il tasto «come
     sempre» vale «più o meno», toccare l'orologio e cambiare l'ora vale
     «preciso». Due voci e non cinque: «più o meno» copre tutto il resto, e
     «non me lo ricordo» non è una precisione — è una via d'uscita, quindi è
     un tasto a parte. */

  /* --- la notte --- */
  /* QUANDO LA NOTTE È GIÀ REGISTRATA la domanda non sparisce: diventa una riga
     che dice cosa c'è scritto, con «cambia» accanto. Sparendo lascerebbe due
     buchi: chi si è sbagliato non ha più dove correggere, e chi ha scacciato
     il pop-up si ritrova la promessa («la domanda resta nei Rituali») non
     mantenuta. */
  function bloccoNotte(forzaAperto) {
    var t = LM.todayKey();
    var r = LM.ritmoDi(t);
    var g = LM.load().ritmoGiorno[t] || {};
    var prec = g.prec || 'circa';
    var registrata = !!(g.sveglia || g.sonno);
    if (registrata && !forzaAperto) {
      return '<div id="blocco-notte">' +
        '<div class="lista"><div class="lista-riga sc-riga">' +
        '<span class="sc-eti">' + ICO('bed', 15) + ' Stanotte</span>' +
        '<span class="sc-val">' + (prec === 'circa' ? 'verso le ' : '') + esc(r.sonno) + ' → ' + esc(r.sveglia) +
        ' · ' + fmtOre(LM.minutiSonno(t)) + '</span>' +
        '<button class="btn btn-mini" id="notte-cambia">Cambia</button></div></div>' +
        '</div>';
    }
    return '<div id="blocco-notte">' +
      /* le due righe qui sotto hanno già scritto «A letto» e «Sveglio», e
         accanto c'è la riga che chiede quanto sono precisi: la frase che
         ripeteva tutte e tre le cose andava letta prima di poter guardare i
         campi che dicevano lo stesso. Resta il permesso di non saperlo, che
         nessun campo può dare. */
      '<p class="rituale-intro">Se non lo sai al minuto va bene comunque.</p>' +
      '<button class="btn btn-primario btn-grande btn-due-righe" id="notte-solito">' + ICO('bed', 15) +
      ' Come sempre <small>a letto ' + esc(r.sonnoRoutine) + ', sveglio ' + esc(r.svegliaRoutine) + '</small></button>' +
      '<div class="lista mt-s">' +
      '<div class="lista-riga sc-riga"><span class="sc-eti">' + ICO('bed', 15) + ' A letto</span>' +
      '<span class="sc-val"><input type="time" id="notte-sonno" class="sc-inline" value="' + esc(r.sonno) + '" aria-label="A che ora sei andato a letto"></span></div>' +
      '<div class="lista-riga sc-riga"><span class="sc-eti">' + ICO('sun', 15) + ' Sveglio</span>' +
      '<span class="sc-val"><input type="time" id="notte-sveglia" class="sc-inline" value="' + esc(r.sveglia) + '" aria-label="A che ora ti sei svegliato"></span></div>' +
      '<div class="lista-riga sc-riga sc-riga-alta"><span class="sc-eti">Precisione</span>' +
      '<span class="sc-val q-chips" id="notte-prec">' +
      '<button class="q-chip' + (prec === 'circa' ? ' on' : '') + '" data-prec="circa">più o meno</button>' +
      '<button class="q-chip' + (prec === 'preciso' ? ' on' : '') + '" data-prec="preciso">precisi</button>' +
      '</span></div>' +
      '</div>' +
      '<div class="riga-flex mt"><button class="btn btn-primario" id="notte-salva">' + ICO('save', 15) + ' Salva</button>' +
      '<button class="btn btn-ghost" id="notte-boh">Non me lo ricordo</button></div>' +
      '<p class="lista-nota">Gli orari «più o meno» restano segnati come tali e non fanno da misura. Se chiudi senza rispondere la domanda non torna oggi: resta nei <b>Rituali</b>.</p>' +
      '</div>';
  }

  function wireNotte(scope, dopo) {
    var t = LM.todayKey();
    var cambia = scope.querySelector('#notte-cambia');
    if (cambia) {
      cambia.addEventListener('click', function () {
        var padre = scope.parentNode;
        var tmp = document.createElement('div');
        tmp.innerHTML = bloccoNotte(true);
        padre.replaceChild(tmp.firstChild, scope);
        wireNotte(padre.querySelector('#blocco-notte'), dopo);
      });
      return;
    }
    var scelta = null;   /* la precisione scelta A MANO vince su tutto */
    var chips = scope.querySelector('#notte-prec');
    function prec() {
      var on = chips.querySelector('.q-chip.on');
      return on ? on.getAttribute('data-prec') : 'circa';
    }
    function mettiPrec(v) {
      chips.querySelectorAll('.q-chip').forEach(function (c) {
        c.classList.toggle('on', c.getAttribute('data-prec') === v);
      });
    }
    chips.querySelectorAll('.q-chip').forEach(function (c) {
      c.addEventListener('click', function () { scelta = c.getAttribute('data-prec'); mettiPrec(scelta); });
    });
    /* CHI CAMBIA L'ORA STA DANDO UN NUMERO: la scelta si sposta su «precisi»
       da sé, e si VEDE spostarsi — se restasse «più o meno» dopo che uno ha
       messo 7:12 col dito, il dato racconterebbe una cosa diversa da quella
       che è appena stata fatta. Chi ha scelto a mano non viene toccato. */
    ['#notte-sonno', '#notte-sveglia'].forEach(function (sel) {
      var el = scope.querySelector(sel);
      el.addEventListener('change', function () { if (!scelta) mettiPrec('preciso'); });
    });
    function salva(sonno, sveglia, p) {
      LM.registraNotte(t, { sonno: sonno, sveglia: sveglia, prec: p });
      var m = LM.minutiSonno(t);
      toast('Notte registrata: ' + Math.floor(m / 60) + 'h' + (m % 60 ? ' ' + (m % 60) + 'm' : '') +
        (p === 'circa' ? ' (più o meno)' : ''), 0, 'bed');
      if (dopo) dopo();
      render();
    }
    scope.querySelector('#notte-solito').addEventListener('click', function () {
      var r = LM.ritmoDi(t);
      salva(r.sonnoRoutine, r.svegliaRoutine, 'circa');
    });
    scope.querySelector('#notte-salva').addEventListener('click', function () {
      salva(scope.querySelector('#notte-sonno').value || null,
        scope.querySelector('#notte-sveglia').value || null, prec());
    });
    scope.querySelector('#notte-boh').addEventListener('click', function () {
      /* nessun orario: il giorno resta sul ritmo di base, e non si richiede.
         Meglio un dato che non c'è di un numero inventato. */
      LM.segnaChiesto(t, 'notte');
      toast('Niente orari per stanotte. La domanda non torna oggi.', 0, 'check');
      if (dopo) dopo();
      render();
    });
  }

  /* --- i pasti e le cose fatte senza scriverle --- */
  function bloccoRecupero() {
    var t = LM.todayKey();
    var r = LM.ritmoDi(t);
    var ora = LM.oraDelGiorno();
    /* solo i pasti di cui si può ancora parlare: alle nove del mattino non si
       chiede se hai cenato */
    var pasti = (r.pasti || []).filter(function (pa) { return LM.minutiDaOra(pa.ora) <= ora + 30; });
    var fatte = LM.load().azioni.filter(function (a) { return a.data === t && a.dopo; });

    var righePasti = pasti.map(function (pa) {
      var risp = pa.fatto;
      /* «a un’altra ora» può essere già la risposta data: allora è quella
         pastiglia a essere accesa, non «sì» */
      var altraOra = risp === true && pa.prec === 'preciso';
      /* la risposta si legge SOTTO il nome, non dentro il tasto: mettendola
         nel tasto, «sì» diventava «sì, verso le 08:00» e i tre tasti andavano
         a capo appena si rispondeva — la riga si muoveva sotto il dito */
      var sotto = risp === true
        ? (pa.prec === 'preciso' ? 'alle ' : 'verso le ') + esc(pa.ora)
        : (risp === false ? 'saltato' : 'di solito alle ' + esc(pa.ora));
      return '<div class="lista-riga sc-riga sc-riga-alta" data-pasto="' + pa.id + '" data-psolito="' + esc(pa.ora || '') + '">' +
        '<span class="sc-eti">' + ICO('utensils', 15) + ' ' + esc(pa.nome) +
        '<small class="rec-solito">' + sotto + '</small></span>' +
        '<span class="sc-val q-chips">' +
        '<button class="q-chip' + (risp === true && !altraOra ? ' on' : '') + '" data-pfatto="si">sì</button>' +
        '<button class="q-chip' + (risp === false ? ' on' : '') + '" data-pfatto="no">no</button>' +
        /* LA TERZA RISPOSTA È IL CAMPO DELL’ORA, non un tasto che apre un
           campo dell’ora. Fra il dito e l’orologio del sistema non c’è
           niente di nostro: nessun ridisegno, nessuna richiesta di fuoco,
           nessuna richiesta di aprire l’orologio. Le due versioni con
           qualcosa in mezzo si sono rotte tutte e due — la prima non apriva
           niente, la seconda apriva e richiudeva.
           Ed è un campo COME GLI ALTRI dell’app: la stessa forma, lo stesso
           bordo, la stessa regola di stile dei campi dell’ora dei promemoria
           e del ritmo di base, che hanno sempre funzionato. Niente
           `<label>` attorno — un’etichetta che avvolge il suo campo gli
           rimanda addosso un secondo tocco, e un orologio che riceve due
           tocchi si apre col primo e si chiude col secondo. Le parole stanno
           accanto, non intorno.
           Parte vuoto apposta: se ci trovasse dentro l’ora solita,
           riscegliere quella stessa ora non farebbe scattare nulla. */
        '<span class="rec-alt' + (altraOra ? ' on' : '') + '"><span class="rec-alt-eti">a un’altra ora</span>' +
        '<input type="time" class="rec-ora" data-poraval="1" value="" aria-label="' + esc(pa.nome) + ' a un’altra ora"></span>' +
        '</span></div>';
    }).join('');

    return '<div id="blocco-recupero">' +
      /* le due etichette qui sotto dicono già «I pasti di oggi» e «Altre cose
         fatte»: la frase che le annunciava era un indice di due voci messo
         sopra due voci. */
      (righePasti
        ? etichetta('I pasti di oggi', 'utensils') + '<div class="lista">' + righePasti + '</div>'
        : '') +
      etichetta('Altre cose fatte', 'check', fatte.length || null) +
      /* la stessa riga d'aggiunta di tutto il resto dell'app: una cosa per
         volta, e l'area compare quando hai cominciato a scrivere */
      rigaAggiunta('agg-fatto', 'Una cosa che hai fatto…',
        /* si parte da «Altro / Esplorazione»: una camminata messa d'ufficio in
           «Studio» è un dato sbagliato, e la prima area della lista non ha
           niente a che vedere con quello che uno ha appena scritto */
        '<label class="agg-area"><span class="agg-eti">in</span>' + selectAree('agg-fatto-area', 'altro') + '</label>' +
        '<label class="agg-area"><span class="agg-eti">verso le</span>' +
        '<input type="time" id="agg-fatto-ora" class="sc-inline" aria-label="Verso che ora"></label>') +
      (fatte.length
        ? '<div class="lista mt-s">' + fatte.map(function (a) {
          var ar = areaById(a.areaId);
          return '<div class="lista-riga" data-fid="' + a.id + '">' +
            '<span class="diario-ico ok" aria-hidden="true">' + ICO('check', 15) + '</span>' +
            '<span class="lista-corpo"><span class="lista-tit">' + segnoArea(ar, 13, 'tit-area') + esc(a.testo) + '</span>' +
            (a.ora ? '<span class="lista-sub">verso le ' + esc(a.ora) + '</span>' : '') + '</span>' +
            '<button class="icona-btn icona-pericolo" data-ftogli="' + a.id + '" title="Togli" aria-label="Togli «' + esc(a.testo) + '»">' + ICO('trash', 15) + '</button>' +
            '</div>';
        }).join('') + '</div>'
        : '<p class="lista-nota">Per esempio: «camminata di mezz’ora», «chiamato mio fratello». Vale come una cosa fatta oggi, con i suoi XP: che l’abbia scritta prima o dopo non cambia niente.</p>') +
      '<div class="riga-flex mt"><button class="btn btn-primario" id="rec-fine">' + ICO('check', 15) + ' Ho finito</button></div>' +
      '</div>';
  }

  function wireRecupero(scope, dopo) {
    var t = LM.todayKey();
    function rifai() {
      var vecchio = document.getElementById('blocco-recupero');
      if (!vecchio || !vecchio.parentNode) { render(); return; }
      var tmp = document.createElement('div');
      tmp.innerHTML = bloccoRecupero();
      var nuovo = tmp.firstChild;
      vecchio.parentNode.replaceChild(nuovo, vecchio);
      wireRecupero(nuovo, dopo);
    }
    scope.querySelectorAll('[data-pasto]').forEach(function (riga) {
      var id = riga.getAttribute('data-pasto');
      var solito = riga.getAttribute('data-psolito') || null;
      var campoOra = riga.querySelector('[data-poraval]');
      riga.querySelectorAll('[data-pfatto]').forEach(function (b) {
        b.addEventListener('click', function () {
          var si = b.getAttribute('data-pfatto') === 'si';
          LM.registraPasto(t, id, { fatto: si, ora: si ? solito : null, prec: 'circa' });
          rifai();
        });
      });
      /* sul campo dell’ora non c’è nessun tocco da ascoltare: aprirlo è
         affare del browser. Qui si ascolta solo l’ora SCELTA — e si salva
         quando è scelta, non prima: un pasto registrato all’ora sbagliata e
         poi corretto lascia due righe nel diario. */
      if (campoOra) campoOra.addEventListener('change', function () {
        if (!campoOra.value) return;
        LM.registraPasto(t, id, { fatto: true, ora: campoOra.value, prec: 'preciso' });
        rifai();
      });
    });
    wireRigaAggiunta(scope, 'agg-fatto', function (testo, opz) {
      var sel = opz ? opz.querySelector('#agg-fatto-area') : null;
      var oraEl = opz ? opz.querySelector('#agg-fatto-ora') : null;
      LM.registraFatta(testo, sel ? sel.value : null, { ora: oraEl && oraEl.value ? oraEl.value : null });
      toast('Segnata fra le cose di oggi.', LM.XP_EVENTI.azione, 'check');
      rifai();
      var inp = document.querySelector('#agg-fatto .agg-testo');
      if (inp) inp.focus();
    });
    scope.querySelectorAll('[data-ftogli]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-ftogli');
        conAnnulla('Tolta.', 'trash', function () { LM.rimuoviAzione(id); });
        rifai();
      });
    });
    scope.querySelector('#rec-fine').addEventListener('click', function () {
      LM.segnaChiesto(t, 'giorno');
      toast('Giornata registrata.', 0, 'check');
      if (dopo) dopo();
      render();
    });
  }

  /* --- i due pop-up ---
     CHIUDERLO VALE «NON ADESSO». Senza questo, chi lo scaccia se lo ritrova
     davanti al prossimo ricaricamento della pagina, cioè fra dieci minuti: un
     pop-up che torna dopo che l'hai chiuso è la cosa che fa disinstallare le
     app. La domanda non sparisce, si sposta: resta nei Rituali, dove sta di
     casa, e torna da sé domani. */
  function popupGiornata(titolo, quale, html, wire, riapri) {
    var t = LM.todayKey();
    function allaChiusura() {
      document.removeEventListener('lm:sheet-chiuso', allaChiusura);
      if (!LM.giaChiesto(t, quale)) LM.segnaChiesto(t, quale);
    }
    document.addEventListener('lm:sheet-chiuso', allaChiusura);
    apriSheet(titolo, '<div class="sc">' + html + '</div>', wire, false, { nome: titolo, apri: riapri });
  }
  function apriChiestaNotte() {
    popupGiornata('Il sonno di stanotte', 'notte', bloccoNotte(),
      function (root) { wireNotte(root, chiudiSheet); }, apriChiestaNotte);
  }
  function apriChiestaGiornata() {
    popupGiornata('Pasti e cose fatte', 'giorno', bloccoRecupero(),
      function (root) { wireRecupero(root, chiudiSheet); }, apriChiestaGiornata);
  }

  /* QUANDO CHIEDERE. Una volta per apertura, e mai a sproposito: le regole
     stanno tutte qui perché sono la parte che si sbaglia. */
  var vistoPrima = 0;
  function forseChiedere() {
    var s = LM.load();
    if (!s.onboarded) return;
    /* niente domande sopra qualcosa che è già aperto */
    if (!document.getElementById('sheet-overlay').hidden) return;
    if (document.getElementById('onboarding-root').innerHTML) return;
    /* la PRIMA volta che l'app ti vede non ti chiede com'è andata: non ha
       niente con cui confrontare, e sarebbe un interrogatorio all'ingresso */
    if (!vistoPrima) return;
    var t = LM.todayKey();
    var ora = new Date().getHours();
    if (ora >= 5 && ora < 14 && !LM.giaChiesto(t, 'notte')) {
      /* il buco in cui la notte ci sta. Sotto le tre ore non è una notte:
         è la stessa giornata che continua, e chiedere «com'è andata la notte»
         a chi non è andato a dormire è la cosa più stupida che l'app possa
         fare. */
      if (Date.now() - vistoPrima >= 3 * 3600 * 1000) { apriChiestaNotte(); return; }
    }
    if (ora >= 19 && !LM.giaChiesto(t, 'giorno')) { apriChiestaGiornata(); return; }
  }

  function ritualeMattina(corpo) {
    var s = LM.load();
    var t = LM.todayKey();
    var piano = s.pianoMattina[t];
    var oggi = LM.azioniDiOggi();

    /* La notte si racconta QUI, in cima al rituale del mattino: è la prima
       cosa della giornata, e se il pop-up è stato scacciato la domanda deve
       restare in un posto dove si sa di trovarla. Registrata o no, il blocco
       c'è: quando c'è già una risposta si stringe in una riga con «cambia». */
    var notte = '<div class="card">' + bloccoNotte() + '</div>';

    corpo.innerHTML = notte + '<div class="card">' +
      /* Della riga sotto il titolo resta la sola cosa che non si vede: che
         la prima della lista è quella che conta. «Le scegli qui e le fai in
         Oggi. Ogni giorno riparte da capo.» era il funzionamento dell'app
         raccontato sopra una lista in cui si sta già scrivendo. */
      testaRituale('sun', 'Le azioni di oggi', 'La prima è quella più importante.') +
      '<div class="lista-azioni" id="piano-lista"></div>' +
      /* Tre è il consiglio, non un muro: chi ha una giornata piena deve poter
         scrivere quello che gli serve. Oltre le tre lo diciamo e basta. */
      /* la stessa riga d'aggiunta di «Da fare» e delle abitudini: campo e
         «Aggiungi», e l'area compare solo quando hai cominciato a scrivere.
         Prima qui c'erano campo, tendina e tasto tutti in fila, che sul
         telefono andavano a capo su tre righe per aggiungere una cosa. */
      '<div class="mt-s">' +
      rigaAggiunta('agg-piano', oggi.length === 0 ? 'La cosa più importante di oggi…' : 'Un’altra cosa (se vuoi)…',
        '<label class="agg-area"><span class="agg-eti">in</span>' + selectAree('agg-piano-area') + '</label>') +
      '</div>' +
      /* Tre è il consiglio, e lo diciamo in una riga sola: «Hai 5 azioni per
         oggi. Oltre tre diventa difficile finirle: le altre si possono
         spostare a domani da La giornata» erano due frasi per dire un numero
         e un posto dove andare. */
      (oggi.length >= 3 ? '<div class="sotto" style="margin:8px 0 0">' + oggi.length + ' azioni per oggi: oltre tre è difficile chiuderle tutte. Da <i>La giornata</i> puoi spostarne a domani.</div>' : '') +
      '<label class="campo" for="piano-ifthen">Quando e dove inizi la prima</label>' +
      '<input type="text" id="piano-ifthen" placeholder="Es. alle 9:00, appena mi siedo alla scrivania, apro solo il file su cui devo lavorare" value="' + (piano ? esc(piano.intenzione) : '') + '">' +
      /* Un pulsante, non due. C'erano «Salva e parti» (pieno, con la freccia,
         +5 XP) e «Inizia ora» accanto: il primo salvava e NON si muoveva,
         nonostante la freccia e la parola «parti»; il secondo andava a Oggi
         senza salvare, quindi l'intenzione appena scritta qui sopra veniva
         buttata. Due tasti per un gesto, divisi a metà così che nessuno dei
         due lo facesse per intero. Ora «Salva e parti» salva e parte davvero;
         quando il piano c'è già diventa «Aggiorna» e resta qui, perché stai
         correggendo, non partendo — e per andare a Oggi c'è la linguetta
         «Adesso», due centimetri sopra. */
      '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="btn-salva-piano">' + ICO('save', 15) + (piano ? ' Aggiorna' : ' Salva e parti') + ' <small>+' + LM.XP_EVENTI.pianoMattina + ' XP</small></button></div>' +
      '</div>';

    var bn = corpo.querySelector('#blocco-notte');
    if (bn) wireNotte(bn, null);

    var lista = document.getElementById('piano-lista');
    lista.innerHTML = oggi.length
      ? oggi.map(function (a) {
          var ar = areaById(a.areaId);
          return '<div class="riga-azione' + (a.done ? ' fatta' : '') + '"><span class="testo">' + esc(a.testo) + '</span>' +
            (a.mit ? '<span class="tag-mit">' + ICO('star', 11) + 'Priorità</span>' : '') +
            segnoArea(ar, 15, 'tag-area') + '</div>';
        }).join('')
      : '<div class="vuoto" style="padding:14px">Niente scelto. La prima che scrivi diventa la più importante.</div>';

    wireRigaAggiunta(corpo, 'agg-piano', function (testo, opz) {
      var sel = opz && opz.querySelector('select');
      LM.aggiungiAzione(testo, sel ? sel.value : 'altro', { mit: LM.serveMit() });
      render();
    });
    document.getElementById('btn-salva-piano').addEventListener('click', function () {
      var eraSalvato = !!piano;
      var xp = LM.salvaPianoMattina(document.getElementById('piano-ifthen').value.trim());
      var mit = LM.azioniDiOggi().find(function (a) { return a.mit; });
      if (mit) {
        mit.ifThen = document.getElementById('piano-ifthen').value.trim();
        LM.save();
      }
      toast(xp ? 'Fatto. Ora pensa solo alla prima cosa.' : 'Aggiornato.', xp, 'sun');
      /* la prima volta del giorno il piano è appena nato: si va a farlo. Se lo
         stai solo aggiornando resti dove sei. */
      if (!eraSalvato) { location.hash = '#/oggi'; return; }
      render();
    });
  }

  /* ---------- Attività → Abitudini ---------- */

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
        ? '<span class="lista-vuoto" aria-hidden="true">' + ICO('salta', 15) + '</span>'
        : '<button class="lista-azione spunta" data-toggle-ab="' + h.id + '" aria-pressed="' + (st.fatta ? 'true' : 'false') +
          '" aria-label="' + esc(h.testo) + (st.fatta ? ', fatta oggi' : ', segna come fatta') + '">' + ICO('check', 13) + '</button>') +
      '<button class="lista-apri" data-abdett="' + h.id + '" aria-label="Apri ' + esc(h.testo) + '">' +
      '<span class="lista-corpo"><span class="lista-tit">' + esc(h.testo) + '</span>' +
      (sotto ? '<span class="lista-sub' + (sotto.cls ? ' ' + sotto.cls : '') + '">' +
        (sotto.ico ? ICO(sotto.ico, 11, 'fiamma') + ' ' : '') + esc(sotto.testo) + '</span>' : '') + '</span>' +
      (h.ora ? '<span class="lista-val">' + esc(h.ora) + '</span>' : '') +
      segnoArea(ar, 13, 'tit-area') +
      '<span class="lista-chev">' + ICO('chevronGiu', 15) + '</span></button>' +
      '</div>';
  }

  function sezioneAbitudini(corpo) {
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
        (tutte ? ICO('check', 15) + ' <b>Fatte tutte</b>, per oggi ci sei.'
               : '<b>' + fatte + '</b> di ' + oggi.length + ' per oggi') + '</div>' +
        '<div class="ab-prog-barra"><span style="width:' + Math.round(fatte / oggi.length * 100) + '%"></span></div>' +
        '</div>';
    }

    /* Ordine identico a «Da fare», che adesso è la linguetta accanto: il
       conto di oggi, il campo per aggiungerne una, poi la lista. Due
       elenchi nella stessa pagina con il campo in posti diversi sono due
       posti da imparare invece di uno. */
    corpo.innerHTML =
      prog +
      '<div class="ab-nuova">' +
      rigaAggiunta('agg-ab', 'Nuova abitudine…',
        '<span class="agg-eti">In che giorni</span>' +
        '<div id="agg-ab-giorni" class="agg-giorni">' + chipsGiorni([]) + '</div>' +
        '<span class="agg-nota">nessuno selezionato = ogni giorno</span>' +
        /* l'ora si decide adesso, mentre l'intenzione è fresca: è il
           momento in cui si sa ancora quando la si vuole fare */
        '<label class="agg-ora"><span class="agg-eti">alle</span>' +
        '<input type="time" class="tl-time" id="agg-ab-ora" aria-label="A che ora (facoltativo)"></label>' +
        '<label class="agg-area"><span class="agg-eti">in</span>' + selectAree('agg-ab-area', 'salute') + '</label>') +
      '</div>' +
      (oggi.length
        ? '<div class="lista-eti">Oggi</div><div class="lista">' +
          oggi.map(function (h) { return rigaAbitudine(h, true); }).join('') + '</div>'
        : (s.abitudini.length
          ? '<div class="vuoto" style="padding:20px 8px">Per oggi non è prevista nessuna abitudine.</div>'
          : '<div class="vuoto" style="padding:20px 8px">' + illoInbox() + '<b>Nessuna abitudine.</b><br>Le azioni che vuoi ripetere: ogni volta che le fai, la serie cresce. Scrivine una qui sopra — «leggere 20 minuti», «camminare».</div>')) +
      (altre.length
        ? '<div class="lista-eti">Le altre</div><div class="lista">' +
          altre.map(function (h) { return rigaAbitudine(h, false); }).join('') + '</div>'
        : '') +
      '';

    corpo.querySelectorAll('[data-toggle-ab]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        feedbackSpunta(ev, LM.completaAbitudine(b.getAttribute('data-toggle-ab')), 'Fatta. Continua così', 'flame');
        sezioneAbitudini(corpo);
      });
    });
    corpo.querySelectorAll('[data-abdett]').forEach(function (b) {
      b.addEventListener('click', function () {
        apriDettaglioAbitudine(b.getAttribute('data-abdett'), function () { sezioneAbitudini(corpo); });
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
      sezioneAbitudini(corpo);
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
    /* chiusa ogni volta che si apre la scheda: aprirla è una decisione, non
       una preferenza da ricordare */
    var abdApertaConfig = false;

    function corpoHtml() {
      var h = trova();
      if (!h) return '';
      var st = statoAbitudineOggi(h);
      var serie = LM.streakAbitudine(h);
      var record = LM.recordAbitudine(h);
      var volte = Object.keys(h.fatti || {}).length;
      var giorni = giorniAbitudine(h, 4);
      var prevista = LM.abitudinePrevista(h, LM.todayKey());

      /* LA GRIGLIA DICE QUAL È, E I GIORNI CHE NON SONO ARRIVATI NON CI SONO.
         Sette colonne con L M M G V S D sopra e i numeri dei giorni dentro
         sono un calendario del mese, a guardarli: e allora ad agosto uno vede
         una griglia che comincia il 3 e finisce il 28 e si chiede dove siano
         gli altri tre giorni. Sono le ultime quattro settimane, e adesso c'è
         scritto.
         I giorni che devono ancora arrivare erano `.abd-g.futuro`: senza fondo
         e senza bordo, ma pur sempre caselle — con l'altezza di una casella e
         con `.abd-g:hover`, scritto più in basso nel foglio, che gliene
         riaccendeva il bordo appena ci passavi sopra. Sembravano vuote e si
         accendevano al tocco. Adesso non sono caselle: tengono il posto nella
         griglia e basta. */
      var catena = etichetta('Ultime 4 settimane', 'unaSettimana') +
        '<div class="abd-testa">' + GIORNI_ORD.map(function (d) {
          return '<span>' + GIORNI_LAB[d] + '</span>';
        }).join('') + '</div>' +
        '<div class="abd-catena" role="group" aria-label="Le ultime quattro settimane">' +
        giorni.map(function (g) {
          if (g.futuro) return '<span class="abd-vuoto" aria-hidden="true"></span>';
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
          ? '<button class="btn btn-grande" id="abd-rimetti">' + ICO('annulla', 15) + ' Rimetti oggi</button>' +
            '<p class="abd-nota">Oggi è saltata: non conta come mancata e la serie non si rompe.</p>'
          : '<button class="btn btn-grande ' + (st.fatta ? 'btn-ok' : 'btn-primario') + '" id="abd-fatta">' +
            ICO('check', 15) + (st.fatta ? ' Fatta oggi' : ' Segna come fatta') + '</button>' +
            (prevista ? '<button class="btn btn-mini btn-ghost" id="abd-salta">' + ICO('salta', 15) + ' Salta oggi</button>' : '')) +
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
        /* Come è impostata: chiusa, finché non la si vuole cambiare.
           Questo pannello faceva tre cose in una sola colonna da quaranta
           comandi — spuntare l'abitudine di oggi, guardare come sta andando,
           e cambiarne le regole — mentre la ragione per cui lo si apre è
           quasi sempre la prima. Le regole si mettono una volta e poi non si
           toccano più: stanno dietro una riga, come le altre di oggi in
           «Adesso» e come il selettore dei segni nelle aree. Anche
           «Elimina» sta qui dentro: è raro e non si torna indietro. */
        '<button class="lista-eti lista-eti-btn" id="abd-piu" aria-expanded="' + (abdApertaConfig ? 'true' : 'false') + '" aria-controls="abd-config">' +
        ICO('ingranaggio', 13) + 'Come è impostata' +
        '<span class="lista-chev' + (abdApertaConfig ? ' aperta' : '') + '">' + ICO('chevronGiu', 15) + '</span></button>' +
        '<div id="abd-config"' + (abdApertaConfig ? '' : ' hidden') + '>' +
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
        '<div class="abd-fondo"><button class="btn btn-mini btn-ghost imp-pericolo" id="abd-del">' + ICO('trash', 15) + ' Elimina l’abitudine</button></div>' +
        '</div>' +
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
      var piu = root.querySelector('#abd-piu');
      if (piu) piu.addEventListener('click', function () {
        abdApertaConfig = !abdApertaConfig;
        var box = root.querySelector('#abd-config');
        box.hidden = !abdApertaConfig;
        piu.setAttribute('aria-expanded', abdApertaConfig ? 'true' : 'false');
        piu.querySelector('.lista-chev').classList.toggle('aperta', abdApertaConfig);
      });
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
      testaRituale('polso', 'Energia, focus e umore',
        /* la prima metà («Energia, concentrazione e umore su una scala da 1 a
           5») è l'elenco delle tre domande che stanno subito sotto, con le
           scale accanto. Resta la seconda, che nessuna domanda dice e che
           serve a chi tiene alla precisione: il numero di oggi non è un
           voto. */
        'Conta l’andamento nei giorni, non il numero di oggi.') +
      scala('energia', 'batteria', 'Quanta energia hai?') +
      scala('focus', 'mirino', 'Quanto riesci a concentrarti?') +
      scala('umore', 'smile', 'Come ti senti?') +
      '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="btn-salva-checkin" disabled>' + ICO('save', 15) + ' Registra <small>+' + LM.XP_EVENTI.checkin + ' XP</small></button></div>' +
      '</div><div class="card mt"><h2>' + ICO('trendUp', 15) + ' Andamento degli ultimi 14 giorni</h2><div id="mini-trend"></div></div>';

    function scala(campo, icona, nome) {
      var base = LM.baselineCheckin(campo, 30);
      var anc = ANCORE[campo];
      return '<div class="scala-blocco"><label class="campo">' + ICO(icona, 13) + ' ' + nome + '</label>' +
        '<div class="scala" data-campo="' + campo + '">' +
        [1, 2, 3, 4, 5].map(function (v) {
          return '<button data-v="' + v + '" aria-label="' + v + ', ' + anc[v - 1] + '">' + v + '</button>';
        }).join('') + '</div>' +
        '<div class="scala-legenda"><span>1 · ' + anc[0] + '</span><span>3 · ' + anc[2] + '</span><span>5 · ' + anc[4] + '</span></div>' +
        (base ? '<div class="scala-solito">' + ICO('solito', 13) +
          /* tutto il testo in un solo elemento: il contenitore è inline-flex
             con un gap, e un punto lasciato fuori diventava un pezzo a sé
             staccato di sei pixel («è 4.3 .») */
          '<span>Media recente <b>' + base.toFixed(1) + '</b></span></div>' : '') +
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
      toast('Salvato.', xp, 'polso');
      render();
    });

    var dark = document.documentElement.getAttribute('data-mode') === 'dark';
    LMCharts.trend(document.getElementById('mini-trend'), [
      { nome: 'Energia', colore: dark ? '#c98500' : '#eda100', punti: LM.serieCheckin('energia', 14) },
      { nome: 'Focus',   colore: dark ? '#3987e5' : '#2a78d6', punti: LM.serieCheckin('focus', 14) },
      { nome: 'Umore',   colore: dark ? '#199e70' : '#1baf7a', punti: LM.serieCheckin('umore', 14) }
    ], { min: 1, max: 5, h: 180 });
  }

  /* «TIENILA»: prende quello che c'è in un campo della review e ne fa una riga
     fra le cose che hai capito su di te. Il campo resta com'è — la review è il
     racconto di quel giorno, la riga è quello che ne hai imparato: due cose
     diverse, e cancellare la prima per avere la seconda sarebbe una perdita.
     Il tasto si nasconde da sé quando il campo è vuoto o quando quella riga
     c'è già, così non promette due volte la stessa cosa. */
  function collegaTenutaLezione(scope, idCampo, idTasto, verso, forza) {
    var campo = scope.querySelector('#' + idCampo);
    var tasto = scope.querySelector('#' + idTasto);
    if (!campo || !tasto) return;
    function giaC(v) {
      return LM.load().lezioni.some(function (l) {
        return l.verso === verso && l.testo.toLowerCase() === v.toLowerCase();
      });
    }
    function aggiorna() {
      var v = campo.value.trim();
      tasto.hidden = !v || giaC(v);
    }
    campo.addEventListener('input', aggiorna);
    tasto.addEventListener('click', function () {
      var v = campo.value.trim();
      if (!v) return;
      LM.aggiungiLezione(v, verso, { forza: forza || 'notato' });
      toast(verso === 'si' ? 'Salvata fra le Scoperte, in «Funziona».' : 'Salvata fra le Scoperte, in «Non funziona».',
        0, verso === 'si' ? 'funziona' : 'nonFunziona');
      aggiorna();
      aggiornaNav();
    });
    aggiorna();
  }

  function ritualeSera(corpo) {
    var s = LM.load();
    var t = LM.todayKey();
    var rev = s.reviewSera[t];
    var toccate = {};
    LM.azioniDiOggi().forEach(function (a) { toccate[a.areaId] = true; });
    var ordinate = areeAttive().slice().sort(function (a, b) { return (toccate[b.id] ? 1 : 0) - (toccate[a.id] ? 1 : 0); });
    var votiOggi = s.valutazioni[t] || {};

    /* Prima di raccontare com'è andata, quello che è andato e non è stato
       scritto: i pasti e le cose fatte senza aprire l'app. Se si chiedesse
       dopo la review, la review parlerebbe di una giornata incompleta. E qui
       il blocco resta anche dopo aver risposto: la sera si continua a fare
       cose, e questo è il posto dove segnarle. */
    var recupero = '<div class="card">' + bloccoRecupero() + '</div>';

    corpo.innerHTML = recupero + '<div class="card">' +
      /* i campi qui sotto portano ognuno la sua domanda scritta sopra: la
         riga che riassumeva tutte e tre («Voto alle aree su cui hai lavorato,
         una cosa andata bene e un ostacolo») era l'indice di una pagina lunga
         mezzo schermo. Resta il tempo che ci vuole, che nessun campo dice. */
      testaRituale('moon', 'Review della sera', 'Due minuti.') +
      '<div id="voti-aree">' + ordinate.map(function (a) {
        return '<div class="voto-area" data-area="' + a.id + '" style="--c-area:' + LM.coloreArea(a) + '">' +
          '<span class="nome">' + ICO(a.icona, 15) + ' ' + esc(a.nome) + '</span>' +
          '<span class="stelline">' + [1, 2, 3, 4, 5].map(function (v) {
            return '<button data-v="' + v + '"' + (votiOggi[a.id] === v ? ' class="sel"' : '') + '>' + v + '</button>';
          }).join('') + '</span></div>';
      }).join('') + '</div>' +
      '<label class="campo" for="sera-vittoria">Una cosa andata bene oggi, anche piccola</label>' +
      '<input type="text" id="sera-vittoria" value="' + (rev ? esc(rev.vittoria || '') : '') + '" placeholder="Es. ho studiato 90 minuti senza guardare il telefono">' +
      /* QUI L'INSEGNAMENTO È FRESCO E GIÀ SCRITTO. Queste due righe finivano
         in un campo di testo che nessuno riapre: il tasto le porta fra le cose
         che hai capito su di te, dove restano e si contano. La forza è
         «notato una volta», perché è quello che è: un giorno, un'osservazione. */
      '<button class="btn btn-mini" id="sera-vitt-lez" hidden>' + ICO('funziona', 15) + ' Salvala fra le Scoperte</button>' +
      '<label class="campo" for="sera-blocco">Un ostacolo che hai incontrato</label>' +
      '<input type="text" id="sera-blocco" value="' + (rev ? esc(rev.blocco || '') : '') + '" placeholder="Es. ho iniziato tardi, mi hanno distratto le notifiche">' +
      '<button class="btn btn-mini" id="sera-blocco-lez" hidden>' + ICO('nonFunziona', 15) + ' Salvalo fra le Scoperte</button>' +
      '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="btn-salva-sera">' + (rev ? ICO('save', 15) + ' Aggiorna' : ICO('moon', 15) + ' Concludi la giornata') + ' <small>+' + LM.XP_EVENTI.reviewSera + ' XP</small></button></div>' +
      '</div>';

    /* il tasto compare solo quando c'è qualcosa da tenere, e sparisce quando
       quella riga è già stata tenuta: un tasto sempre acceso che a volte non fa
       niente è un tasto che non si tocca più */
    collegaTenutaLezione(corpo, 'sera-vittoria', 'sera-vitt-lez', 'si');
    collegaTenutaLezione(corpo, 'sera-blocco', 'sera-blocco-lez', 'no');

    var br = corpo.querySelector('#blocco-recupero');
    if (br) wireRecupero(br, null);

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
      testaRituale('unaSettimana', 'Review della settimana', 'Dieci minuti.') +
      '<div class="eroe-statistiche" style="justify-content:center;margin-bottom:16px">' +
      '<div class="stat"><span class="stat-val">' + xpSett + '</span><span class="stat-eti">XP guadagnati</span></div>' +
      '<div class="stat"><span class="stat-val">' + azioniSett + '</span><span class="stat-eti">azioni completate</span></div>' +
      '<div class="stat"><span class="stat-val">' + attivi + '/7</span><span class="stat-eti">giorni attivi</span></div>' +
      '</div>' +
      '<label class="campo" for="w-vittorie">Cosa ha funzionato questa settimana</label><textarea id="w-vittorie">' + (rev ? esc(rev.vittorie || '') : '') + '</textarea>' +
      /* La review della settimana parla di quello che si è RIPETUTO: la riga
         che ne nasce lo dice, e vale più di un'osservazione di un giorno. */
      '<button class="btn btn-mini" id="w-vitt-lez" hidden>' + ICO('funziona', 15) + ' Salvala fra le Scoperte</button>' +
      '<label class="campo" for="w-blocchi">Gli ostacoli che si sono ripetuti</label><textarea id="w-blocchi">' + (rev ? esc(rev.blocchi || '') : '') + '</textarea>' +
      '<button class="btn btn-mini" id="w-blocchi-lez" hidden>' + ICO('nonFunziona', 15) + ' Salvali fra le Scoperte</button>' +
      '<label class="campo" for="w-imparato">Cosa hai imparato sul tuo metodo</label><textarea id="w-imparato">' + (rev ? esc(rev.imparato || '') : '') + '</textarea>' +
      '<label class="campo" for="w-prossima">Una cosa da cambiare la settimana prossima</label><textarea id="w-prossima">' + (rev ? esc(rev.prossima || '') : '') + '</textarea>' +
      '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="btn-salva-sett">' + ICO('save', 15) + (rev ? ' Aggiorna' : ' Salva la review') + ' <small>+' + LM.XP_EVENTI.reviewSettimana + ' XP</small></button>' +
      '<button class="btn btn-ghost" data-vai="esperimenti">' + ICO('flask', 15) + ' Apri le Scoperte</button></div>' +
      '</div>';

    collegaTenutaLezione(corpo, 'w-vittorie', 'w-vitt-lez', 'si', 'ripetuto');
    collegaTenutaLezione(corpo, 'w-blocchi', 'w-blocchi-lez', 'no', 'ripetuto');

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
    var ammessi = { dafare: 1, abitudini: 1 };
    if (nInbox) ammessi.sistemare = 1;
    if (!attTab || !ammessi[attTab]) attTab = nInbox ? 'sistemare' : 'dafare';

    var html = topbar('Attività', '', '', '', true);
    /* Tre linguette, e la prima esiste solo finché c'è una coda da
       svuotare: una destinazione sempre a zero è una parola in più da
       scartare ogni volta.
       Le abitudini stanno qui e non fra i Rituali: un'abitudine è una cosa
       da fare che torna, non un momento della giornata. Nei Rituali erano
       un pannello di configurazione in mezzo a un piano e a due resoconti. */
    function tb(id, ico, et, n) {
      return '<button data-att="' + id + '" class="' + (attTab === id ? 'attivo' : '') + '">' +
        '<span class="seg-ico">' + ICO(ico, 15) + '</span>' +
        '<span class="seg-eti">' + et + '</span>' +
        (n ? '<span class="att-badge">' + n + '</span>' : '') + '</button>';
    }
    var nAb = LM.abitudiniDiOggi().filter(function (h) { return !h.fatti[LM.todayKey()]; }).length;
    html += '<div class="segmenti sez-nav tabs-fisse' + (nInbox ? '' : ' tabs-due') + ' att-tabs" id="att-tabs">' +
      (nInbox ? tb('sistemare', 'inbox', 'Da sistemare', nInbox) : '') +
      tb('dafare', 'lista', 'Da fare', s.backlog.length) +
      tb('abitudini', 'refresh', 'Abitudini', nAb) + '</div>';
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
      if (attTab === 'abitudini') sezioneAbitudini(c);
      else if (attTab === 'sistemare' && LM.load().inbox.length) disegnaSmista(c);
      else disegnaDaFare(c);
      attTabMostrata = attTab;
      if (cambio) animaIngresso(c);
      else if (scrollPrima) window.scrollTo(0, scrollPrima);
    }

    /* ---------- Da sistemare: una nota per volta ----------
       Il lavoro è svuotare una coda: per ogni nota, una decisione fra tre.
       Prima la coda si mostrava tutta insieme — sei note da centosettanta
       pixel, sei comandi ciascuna, trentasei comandi in una schermata e tre
       note su sei visibili senza scorrere. Per svuotarla bisognava prima
       scegliere DA QUALE cominciare: una decisione in più, e la più costosa,
       ripetuta ogni volta che si torna qui.
       Adesso la coda ne mostra una: quella che hai scritto per ultima, con
       la sua decisione davanti e quello che viene dopo elencato sotto, come
       promemoria e non come scelta. È la stessa forma della schermata Oggi,
       che mostra un'azione sola: una decisione per volta, e la successiva
       arriva quando questa è chiusa. */
    function disegnaSmista(box) {
      var st = LM.load();
      /* la più recente prima: di quella ti ricordi ancora perché l'hai
         scritta, e il ricordo è metà della decisione */
      var coda = st.inbox.slice().sort(function (a, b) { return (b.creata || 0) - (a.creata || 0); });
      var nota = coda[0];
      if (!nota) { disegnaDaFare(box); return; }
      var resto = coda.slice(1);
      var quando = new Date(nota.creata).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      var MOSTRA = 4;

      box.innerHTML =
        /* una colonna sola, larga quanto si legge comodamente: sullo schermo
           grande la decisione non deve attraversare mezzo metro di monitor */
        '<div class="sm-uno">' +
        etichetta('Da sistemare', 'inbox', coda.length) +
        '<div class="lista">' +
        /* il testo è un campo, non un testo con una matita accanto: si
           corregge scrivendoci sopra, senza entrare e uscire da un modo */
        '<div class="lista-riga sm-testa">' +
        '<textarea class="sm-titolo" id="sm-testo" rows="1" aria-label="Testo della nota">' + esc(nota.testo) + '</textarea>' +
        '</div>' +
        '<div class="lista-riga sc-riga"><span class="sc-eti">Scritta</span><span class="sc-val">' + esc(quando) + '</span></div>' +
        '<div class="lista-riga sc-riga"><span class="sc-eti">Area</span>' +
        '<span class="sc-val">' + selectAree('sm-area', nota.areaSug || 'altro', 'Area', 'sc-inline') + '</span></div>' +
        '</div>' +

        '<button class="btn btn-primario btn-grande sc-primaria" data-fai="azione">' +
        ICO('target', 15) + ' Portala in Oggi</button>' +
        '<div class="lista">' +
        '<button class="lista-riga sc-riga sc-tocca" data-fai="backlog">' +
        '<span class="sc-eti">' + ICO('lista', 15) + ' Mettila in «Da fare»</span>' +
        '<span class="sc-val">più avanti</span></button>' +
        '<button class="lista-riga sc-riga sc-tocca sc-pericolo" data-fai="scarta">' +
        '<span class="sc-eti">' + ICO('trash', 15) + ' Scarta</span>' +
        '<span class="sc-val">non serve</span></button>' +
        '</div>' +

        (resto.length
          ? '<div class="lista-eti">Dopo questa <span>' + resto.length + '</span></div>' +
            '<div class="sm-coda">' +
            resto.slice(0, MOSTRA).map(function (x) { return '<p>' + esc(x.testo) + '</p>'; }).join('') +
            (resto.length > MOSTRA
              ? '<p class="sm-coda-piu">' + (resto.length - MOSTRA === 1 ? 'e un’altra' : 'e altre ' + (resto.length - MOSTRA)) + '</p>'
              : '') +
            '</div>'
          : '<p class="lista-nota">Ultima della coda.</p>') +
        '</div>';

      /* il testo si salva quando si esce dal campo: nessun tasto «salva» per
         una correzione di due lettere */
      var testo = box.querySelector('#sm-testo');
      function adatta() { testo.style.height = 'auto'; testo.style.height = testo.scrollHeight + 'px'; }
      adatta();
      testo.addEventListener('input', adatta);
      testo.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); testo.blur(); } });
      testo.addEventListener('change', function () {
        var v = testo.value.replace(/\s+/g, ' ').trim();
        if (!v) { testo.value = nota.testo; adatta(); return; }
        LM.modificaInbox(nota.id, v);
      });

      box.querySelectorAll('[data-fai]').forEach(function (b) {
        b.addEventListener('click', function () {
          var esito = b.getAttribute('data-fai');
          var sel = box.querySelector('#sm-area');
          var area = sel ? sel.value : 'altro';
          /* il testo appena corretto e non ancora salvato non si perde */
          var v = testo.value.replace(/\s+/g, ' ').trim();
          if (v && v !== nota.testo) LM.modificaInbox(nota.id, v);

          function fatto() {
            LM.triageInbox(nota.id, esito, area);
            aggiornaNav();
            if (!LM.load().inbox.length) {
              /* coda finita: la linguetta non ha più ragione di esistere */
              attTab = 'dafare';
              render();
              toast('Coda svuotata: non c’è più niente da sistemare.', 0, 'check');
              return;
            }
            ridisegna();
            animaIngresso(document.getElementById('att-corpo'));
          }
          if (esito === 'scarta') { conAnnulla('Scartata.', 'trash', fatto); return; }
          toast(esito === 'azione' ? 'Messa tra le cose di oggi.' : 'Aggiunta a «Da fare».', LM.XP_EVENTI.triage,
            esito === 'azione' ? 'arrowRight' : 'lista');
          fatto();
        });
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
        ICO('imbuto', 15) + '<span>' + esc(nomeFiltro()) + '</span>' +
        '<span class="lista-chev">' + ICO('chevronGiu', 15) + '</span></button>' +
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
            '<span class="lista-vuoto">' + (attArea === id ? ICO('scelto', 15) : '') + '</span>' +
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
          etichetta('Per area', 'aree') + '<div class="lista">' +
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
            ICO('chevronGiu', 15) + (taglia ? ' Mostra le altre ' + (voci.length - MURO) : ' Mostra solo le prime ' + MURO) + '</button>' : '');
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
              '<span class="lista-chev' + (apertoParcheggio ? ' aperta' : '') + '">' + ICO('chevronGiu', 15) + '</span></button>' +
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
        ' title="' + (isProg ? 'Porta in Oggi il prossimo passo' : 'Porta in Oggi') + '">' + ICO('target', 15) + '</button>' +
        '<button class="lista-apri" data-bkapri="' + b.id + '" aria-label="Apri ' + esc(b.testo) + '">' +
        '<span class="lista-corpo">' +
        '<span class="lista-tit">' +
        (b.pin ? '<span class="tit-pin" title="Tenuta in cima">' + ICO('pin', 11) + '</span>' : '') +
        segnoArea(ar, 13, 'tit-area') +
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
            (st.done ? '' : '<button class="icona-btn" data-stepquando="' + st.id + '" title="Mettilo in un giorno" aria-label="Metti «' + esc(st.testo) + '» in un giorno">' + ICO('calendar', 15) + '</button>') +
            '<button class="icona-btn icona-pericolo" data-stepdel="' + st.id + '" title="Rimuovi" aria-label="Rimuovi «' + esc(st.testo) + '»">' + ICO('trash', 15) + '</button>' +
            '</div>';
        }).join('');

        return '<div class="sc">' +
          /* l'azione: una sola, e la pastiglia «Oggi» non la ripete più */
          '<button class="btn btn-primario btn-grande sc-primaria" id="sc-oggi">' + ICO('target', 15) + ' ' +
          (isProg ? 'Prossimo passo in Oggi' : 'Portala in Oggi') + '</button>' +

          etichetta('Rimanda a', 'calendar') +
          '<div class="q-chips sc-quando">' +
          gChip(LM.addDays(oggi, 1), 'Domani') +
          gChip(LM.addDays(oggi, 2), etichettaGiorno(LM.addDays(oggi, 2)).split(' ')[0]) +
          gChip(LM.addDays(oggi, 7), 'Tra una settimana') +
          '<label class="q-chip q-chip-data">' + ICO('calendar', 13) + ' <span>Un altro giorno</span>' +
          '<input type="date" id="sc-quando" min="' + oggi + '" aria-label="Un altro giorno"></label>' +
          '</div>' +

          etichetta('Passi', 'lista', isProg ? av.fatti + ' di ' + av.tot : null) +
          '<div class="lista">' + passi +
          '<form class="lista-riga sc-agg" id="sc-passo-add">' +
          '<span class="lista-vuoto">' + ICO('plus', 15) + '</span>' +
          '<input type="text" placeholder="' + (isProg ? 'Aggiungi un passo…' : 'Dividila in passi: scrivi il primo…') + '" aria-label="Aggiungi un passo">' +
          /* il «più» sta già in testa alla riga, dove si allinea alle spunte
             dei passi sopra: qui la parola basta, e il colore è quello di
             tutti gli altri «Aggiungi» dell'app. Due segni «più» nella
             stessa riga per la stessa azione erano uno di troppo. */
          '<button class="btn btn-mini btn-tinta" type="submit">Aggiungi</button></form>' +
          (isProg && aperti > 1
            ? riga('Spalma i passi aperti',
              '<span class="sc-val q-chips">' +
              '<button class="q-chip" data-distrib="1">ogni giorno</button>' +
              '<button class="q-chip" data-distrib="2">ogni 2</button>' +
              '<button class="q-chip" data-distrib="7">ogni settimana</button></span>', '', 'sc-riga-alta')
            : '') +
          '</div>' +

          etichetta('Dettagli', 'ingranaggio') +
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
          '<span class="sc-val">' + (b.pin ? ICO('pin', 15, 'sc-si') + ' sì' : 'no') + '</span></button>' +
          '</div>' +
          '<p class="lista-nota">«Rimanda a» la sposta fra le cose di quel giorno. La scadenza fa solo da conto alla rovescia e non la mette in agenda.</p>' +

          '<div class="lista mt">' +
          '<button class="lista-riga sc-riga sc-tocca" id="sc-abitudine">' +
          '<span class="sc-eti">' + ICO('refresh', 15) + ' Diventa un’abitudine</span>' +
          '<span class="lista-chev">' + ICO('chevronGiu', 15) + '</span></button>' +
          '<button class="lista-riga sc-riga sc-tocca sc-pericolo" id="sc-del">' +
          '<span class="sc-eti">' + ICO('trash', 15) + ' Elimina l’attività</span></button>' +
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
        /* la riga è il bersaglio: il campo VERO ci sta steso sopra,
           trasparente e grande quanto lei, così il tocco arriva al calendario
           del sistema senza passare da noi. Aprirlo a mano su un campo alto
           un pixel e senza eventi del puntatore non apriva niente. */
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
        etichetta('Quando fare questo passo', 'calendar') +
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
        etichetta('In che giorni', 'calendar') +
        '<div class="sc-gruppo">' +
        '<div id="ab-giorni">' + chipsGiorni([1, 2, 3, 4, 5, 6, 0]) + '</div>' +
        '<label class="sc-campo"><span>a che ora</span>' +
        '<input type="time" class="tl-time" id="ab-ora"></label>' +
        '<label class="sc-campo"><span>quanto dura</span>' +
        '<select class="tl-dur" id="ab-dur">' + DURATE.map(function (o) { return '<option value="' + o.v + '">' + o.t + '</option>'; }).join('') + '</select></label>' +
        '<div class="sc-nota">Vuoti vanno bene: l’abitudine resta senza orario fisso.</div>' +
        '</div>' +
        '<button class="btn btn-primario btn-grande sc-primaria" id="ab-crea">' + ICO('plus', 15) + ' Crea l’abitudine</button>' +
        '<div class="sc-nota" style="text-align:center">Esce da «Da fare» e la ritrovi in <b>Attività → Abitudini</b>.</div>' +
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
          toast('Diventata un’abitudine: la trovi fra le Abitudini.', 0, 'refresh');
          chiudiSheet(); aggiornaNav(); ridisegna();
        });
      });
    }
  }

  /* ============================================================
     COSA FUNZIONA PER ME (senza esperimento)
     ============================================================

     Perché esiste. L'esperimento N-of-1 è la cosa giusta e nessuno la fa: due
     settimane di base, due di intervento, e intanto le cose che uno capisce su
     di sé arrivano ogni giorno — «in biblioteca studio, in camera no», «se dico
     "dopo" senza scrivere quando, non lo faccio più». Se l'unico posto dove
     metterle è un esperimento, non le scrive nessuno e a fine mese sono
     sparite. Qui una riga basta.

     Le tre scelte di questa schermata, e il perché:

     · DUE MUCCHI, non un voto. «Mi funziona» / «Non mi funziona» è il verdetto
       che uno ha già in testa quando apre l'app; una scala da 1 a 5 sarebbe una
       domanda in più a cui rispondere, e su una cosa che non è una misura.

     · COME FAI A SAPERLO, scritto accanto. La pagina della scienza etichetta
       ogni studio (alta / media / euristica): la stessa onestà applicata a te.
       Serve a chi vuole essere preciso: senza quell'etichetta, scrivere «mi
       funziona» dopo averlo visto UNA volta sembra un'affermazione più grossa
       di quella che è, e allora chi tiene alla precisione non scrive niente.
       Tre gradini e non cinque: notato una volta, lo noto ogni volta, misurato.

     · SI GIRA. Una cosa che funzionava smette di funzionare, e succede spesso:
       il tasto a sinistra della riga sposta la riga nell'altro mucchio senza
       aprire niente. Senza quello, l'unica strada era cancellare e riscrivere,
       cioè perdere che una volta funzionava. */

  var LEZ_VERSI = {
    si: { ico: 'funziona', eti: 'Funziona', breve: 'Funziona' },
    no: { ico: 'nonFunziona', eti: 'Non funziona', breve: 'Non funziona' }
  };

  /* l'area è FACOLTATIVA: «le liste lunghissime mi bloccano» non è di
     un'area, è di te. Il selettore normale non ha il posto per dire «nessuna». */
  function selectAreeOpz(id, selezionata, cls) {
    return '<select id="' + id + '"' + (cls ? ' class="' + cls + '"' : '') + ' aria-label="Area">' +
      '<option value=""' + (selezionata ? '' : ' selected') + '>nessuna in particolare</option>' +
      areeAttive().map(function (a) {
        return '<option value="' + a.id + '"' + (a.id === selezionata ? ' selected' : '') + '>' + esc(a.nome) + '</option>';
      }).join('') + '</select>';
  }

  function rigaLezioneHtml(l) {
    var v = LEZ_VERSI[l.verso] || LEZ_VERSI.si;
    var altro = l.verso === 'si' ? LEZ_VERSI.no : LEZ_VERSI.si;
    var ar = l.areaId ? areaById(l.areaId) : null;
    var sotto = [LM.forzaLezione(l.forza).eti];
    if (l.espId) {
      var e = LM.load().esperimenti.find(function (x) { return x.id === l.espId; });
      if (e) sotto[0] = 'misurato con «' + esc(e.nome) + '»';
    }
    return '<div class="lista-riga lez-riga" data-lid="' + l.id + '">' +
      '<button class="lista-azione lez-verso lez-' + l.verso + '" data-lezgira="' + l.id + '"' +
      ' title="Spostala in «' + altro.breve + '»"' +
      ' aria-label="«' + esc(l.testo) + '»: spostala in «' + altro.breve + '»">' +
      ICO(v.ico, 15) + '</button>' +
      '<button class="lista-apri" data-lezapri="' + l.id + '" aria-label="Apri «' + esc(l.testo) + '»">' +
      '<span class="lista-corpo">' +
      '<span class="lista-tit">' + (ar ? segnoArea(ar, 13, 'tit-area') : '') + esc(l.testo) + '</span>' +
      '<span class="lista-sub">' + sotto.join(' · ') + '</span>' +
      '</span><span class="lista-chev">' + ICO('chevronGiu', 15) + '</span></button>' +
      '</div>';
  }

  function bloccoLezioniHtml() {
    var si = LM.lezioni('si'), no = LM.lezioni('no');
    var vuoto = !si.length && !no.length;
    /* NIENTE PARAGRAFO SOTTO IL TITOLO. Ce n'era uno di quattro righe che
       spiegava perché il registro esiste e cosa vuol dire l'etichetta accanto a
       ogni riga. Sotto c'erano già: il campo con scritto cosa scriverci, i due
       tasti «funziona / non funziona» e i due mucchi con il loro nome. Se la
       spiegazione serve, il comando è scritto male; e questa era una
       spiegazione che si legge una volta e poi resta lì per sempre, in cima
       alla cosa che si usa ogni giorno. L'esempio invece resta finché i mucchi
       sono vuoti — là non c'è niente da guardare, e serve capire che tipo di
       frase ci va. */
    return '<div class="card lez-card">' +
      rigaAggiunta('agg-lez', 'Cosa hai capito su di te…',
        '<div class="q-chips lez-scelta-verso">' +
        '<button type="button" class="q-chip on" data-verso="si">' + ICO('funziona', 13) + ' Funziona</button>' +
        '<button type="button" class="q-chip" data-verso="no">' + ICO('nonFunziona', 13) + ' Non funziona</button>' +
        '</div>' +
        '<label class="agg-area"><span class="agg-eti">in</span>' + selectAreeOpz('agg-lez-area', null) + '</label>') +
      (vuoto
        ? '<p class="lista-nota">Per esempio: «studiare in biblioteca invece che in camera» fra le cose che funzionano, «dire <i>lo faccio dopo</i> senza scrivere quando» fra quelle che no.</p>'
        : '') +
      (si.length
        ? etichetta('Funziona', 'funziona', si.length) +
          '<div class="lista">' + si.map(rigaLezioneHtml).join('') + '</div>'
        : '') +
      (no.length
        ? etichetta('Non funziona', 'nonFunziona', no.length) +
          '<div class="lista">' + no.map(rigaLezioneHtml).join('') + '</div>'
        : '') +
      '</div>';
  }

  /* IL RIQUADRO SI RIFÀ DA SÉ, non tutta la pagina. Un `render()` intero qui
     avrebbe due difetti: butta via il campo in cui si sta scrivendo (e chi
     butta giù una riga spesso ne butta giù tre di fila) e fa ripartire i
     grafici degli esperimenti sotto, che non c'entrano niente. */
  function ridisegnaLezioni(tornaNelCampo) {
    var vecchia = document.querySelector('.lez-card');
    if (!vecchia || !vecchia.parentNode) { render(); return; }
    var tmp = document.createElement('div');
    tmp.innerHTML = bloccoLezioniHtml();
    var nuova = tmp.firstChild;
    vecchia.parentNode.replaceChild(nuova, vecchia);
    wireLezioni(nuova);
    if (tornaNelCampo) {
      var inp = nuova.querySelector('#agg-lez .agg-testo');
      if (inp) inp.focus();
    }
  }

  function wireLezioni(scope) {
    wireRigaAggiunta(scope, 'agg-lez', function (testo, opz) {
      var sceltoVerso = opz ? opz.querySelector('.lez-scelta-verso .q-chip.on') : null;
      var verso = sceltoVerso ? sceltoVerso.getAttribute('data-verso') : 'si';
      var sel = opz ? opz.querySelector('#agg-lez-area') : null;
      LM.aggiungiLezione(testo, verso, { areaId: sel ? sel.value : null, forza: 'notato' });
      /* il messaggio dice in quale mucchio è finita: la scelta sta in una riga
         di opzioni che si apre scrivendo, e chi non l'ha guardata deve poter
         accorgersi qui che è andata dove non voleva */
      toast(verso === 'si' ? 'Aggiunta in «Funziona».' : 'Aggiunta in «Non funziona».',
        0, verso === 'si' ? 'funziona' : 'nonFunziona');
      ridisegnaLezioni(true);
    });
    /* la scelta del verso nella riga di aggiunta */
    scope.querySelectorAll('.lez-scelta-verso .q-chip').forEach(function (b) {
      b.addEventListener('click', function () {
        b.parentNode.querySelectorAll('.q-chip').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
      });
    });
    scope.querySelectorAll('[data-lezgira]').forEach(function (b) {
      b.addEventListener('click', function () {
        var l = LM.giraLezione(b.getAttribute('data-lezgira'));
        if (!l) return;
        toast(l.verso === 'si' ? 'Spostata in «Funziona».' : 'Spostata in «Non funziona».',
          0, l.verso === 'si' ? 'funziona' : 'nonFunziona');
        ridisegnaLezioni();
      });
    });
    scope.querySelectorAll('[data-lezapri]').forEach(function (b) {
      b.addEventListener('click', function () { apriLezione(b.getAttribute('data-lezapri')); });
    });
  }

  /* la scheda di una cosa imparata: come per le attività, un posto solo dove
     si sistema tutto quello che c'è da sistemare */
  function apriLezione(id) {
    function trova() { return LM.trovaLezione(id); }
    if (!trova()) return;

    function corpoHtml() {
      var l = trova();
      if (!l) return '';
      var esp = l.espId ? LM.load().esperimenti.find(function (x) { return x.id === l.espId; }) : null;
      function riga(eti, valore, attrib, cls) {
        return '<div class="lista-riga sc-riga' + (cls ? ' ' + cls : '') + '"' + (attrib || '') + '>' +
          '<span class="sc-eti">' + eti + '</span>' + valore + '</div>';
      }
      return '<div class="sc">' +
        '<label class="campo" for="lez-testo">Cosa hai capito</label>' +
        '<textarea id="lez-testo" rows="2">' + esc(l.testo) + '</textarea>' +

        etichetta('Evidenza', 'confronto') +
        '<div class="q-chips">' + LM.FORZE_LEZIONE.map(function (f) {
          return '<button class="q-chip' + (f.id === l.forza ? ' on' : '') + '" data-forza="' + f.id + '">' + esc(f.eti) + '</button>';
        }).join('') + '</div>' +
        '<p class="lista-nota">Dice quanto è solida questa riga, non quanto vali tu. Serve a poterla scrivere anche dopo averla vista una volta sola.</p>' +

        etichetta('Dettagli', 'ingranaggio') +
        '<div class="lista">' +
        riga('Esito', '<span class="sc-val q-chips">' +
          '<button class="q-chip' + (l.verso === 'si' ? ' on' : '') + '" data-verso="si">' + ICO('funziona', 13) + ' funziona</button>' +
          '<button class="q-chip' + (l.verso === 'no' ? ' on' : '') + '" data-verso="no">' + ICO('nonFunziona', 13) + ' non funziona</button>' +
          '</span>', '', 'sc-riga-alta') +
        riga('Area', '<span class="sc-val">' + selectAreeOpz('lez-area', l.areaId, 'sc-inline') + '</span>') +
        (esp ? riga('Misurato con', '<span class="sc-val">' + esc(esp.nome) + '</span>') : '') +
        riga('Scritta', '<span class="sc-val">' + LM.fmtShort(LM.dayKey(new Date(l.creata))) + '</span>') +
        '</div>' +

        '<div class="lista mt">' +
        '<button class="lista-riga sc-riga sc-tocca" id="lez-esp">' +
        '<span class="sc-eti">' + ICO('flask', 15) + ' Provalo con un esperimento</span>' +
        '<span class="lista-chev">' + ICO('chevronGiu', 15) + '</span></button>' +
        '<button class="lista-riga sc-riga sc-tocca sc-pericolo" id="lez-del">' +
        '<span class="sc-eti">' + ICO('trash', 15) + ' Togli questa riga</span></button>' +
        '</div>' +
        '</div>';
    }

    function collega(root) {
      var l = trova();
      if (!l) { chiudiSheet(); ridisegna(); return; }
      var ta = root.querySelector('#lez-testo');
      /* si salva uscendo dal campo, come le altre schede: un tasto «salva» per
         una riga di testo è un tasto che si dimentica di premere */
      ta.addEventListener('blur', function () {
        var v = ta.value.trim();
        if (v && v !== trova().testo) { LM.modificaLezione(id, { testo: v }); ridisegnaLezioni(); }
      });
      root.querySelectorAll('[data-forza]').forEach(function (b) {
        b.addEventListener('click', function () {
          LM.modificaLezione(id, { forza: b.getAttribute('data-forza') });
          ridisegnaScheda();
        });
      });
      root.querySelectorAll('[data-verso]').forEach(function (b) {
        b.addEventListener('click', function () {
          LM.modificaLezione(id, { verso: b.getAttribute('data-verso') });
          ridisegnaScheda();
        });
      });
      root.querySelector('#lez-area').addEventListener('change', function (e) {
        LM.modificaLezione(id, { areaId: e.target.value || null });
        ridisegnaLezioni();
      });
      root.querySelector('#lez-esp').addEventListener('click', function () {
        /* Il modulo dell'esperimento si apre già scritto con la riga di qui:
           chi vuole verificare una cosa che ha già capito non deve ribatterla.
           Si passa per una variabile e non per una chiamata a caldo: la vista
           si ridisegna da zero, e un `setTimeout` che va a cercare il modulo
           dopo sessanta millesimi funziona o no a seconda di cos'altro sta
           succedendo. Così invece è il disegno stesso che lo apre. */
        lezDaProvare = trova();
        chiudiSheet();
        location.hash = '#/esperimenti';
        render();
      });
      root.querySelector('#lez-del').addEventListener('click', function () {
        var q = trova();
        conAnnulla('Riga tolta.', 'trash', function () { LM.rimuoviLezione(id); });
        chiudiSheet(); ridisegnaLezioni();
        void q;
      });
    }

    function ridisegnaScheda() {
      var root = document.getElementById('sheet-corpo');
      if (!root) return;
      root.innerHTML = corpoHtml();
      collega(root);
      ridisegnaLezioni();
    }

    apriSheet('Una cosa che hai capito', corpoHtml(), collega, false,
      { nome: 'Una cosa che hai capito', apri: function () { apriLezione(id); } });
  }

  /* la riga da cui aprire il modulo dell'esperimento al prossimo disegno della
     pagina: la mette la scheda di una riga imparata, la consuma la vista */
  var lezDaProvare = null;
  /* il modulo del nuovo esperimento mentre è aperto, con quello che c'è
     scritto dentro: sopravvive ai ridisegni della pagina */
  var formExp = null;

  /* ============================================================
     VISTA: ESPERIMENTI
     ============================================================ */

  /* QUALE DELLE DUE SEZIONI È APERTA. Sta fuori dalla funzione perché deve
     sopravvivere a un ridisegno: la pagina si rifà da sé quando arriva la
     risposta dell'account o un aggiornamento dal cloud, e ritrovarsi
     riportati sull'altra sezione senza aver toccato niente è peggio del
     problema che questa divisione risolve. */
  var sezScoperte = 'registro';

  function vistaEsperimenti() {
    var s = LM.load();

    /* DUE SEZIONI, NON UNA COLONNA LUNGA.
       Prima stavano una sopra l'altra: il registro in cima — è la cosa che si
       usa ogni giorno e si scrive in dieci secondi — e gli esperimenti sotto.
       Funzionava con sei righe. Con quaranta, per arrivare agli esperimenti
       bisognava scorrere davanti a tutto quello che si sa già, ogni volta, e
       la lunghezza della strada dipendeva da quanto uno ha scritto: più usi il
       registro, più lontano diventa l'altra metà della pagina.
       Adesso sono due sezioni, come in «Panoramica»: si vede una per volta e
       ognuna comincia in cima. La riga di linguette è la stessa di tutte le
       altre pagine, quindi non c'è niente di nuovo da capire. */
    function segs(id, ico, et, quanti) {
      return '<button data-scop="' + id + '" class="' + (sezScoperte === id ? 'attivo' : '') + '">' +
        '<span class="seg-ico">' + ICO(ico, 13) + '</span><span class="seg-eti">' + et +
        (quanti ? ' <span class="seg-n">' + quanti + '</span>' : '') + '</span></button>';
    }
    /* chi arriva qui per aprire un esperimento — dalla scheda di una riga, o
       perché ne aveva uno mezzo scritto — entra dalla parte degli esperimenti:
       il modulo vive là dentro, e aprire la pagina sul registro vorrebbe dire
       far sparire quello che stava scrivendo. */
    if (lezDaProvare || formExp) sezScoperte = 'esperimenti';
    var nLez = LM.load().lezioni.length;
    var html = topbar('Scoperte', '', '', '', true) +
      '<div class="segmenti mini-seg sotto-seg" id="sez-scoperte">' +
      segs('registro', 'funziona', 'Registro', nLez || null) +
      segs('esperimenti', 'flask', 'Esperimenti', s.esperimenti.length || null) +
      '</div><div id="scop-corpo"></div>';
    $vista.innerHTML = html;
    $vista.querySelector('#sez-scoperte').querySelectorAll('[data-scop]').forEach(function (b) {
      b.addEventListener('click', function () {
        sezScoperte = b.getAttribute('data-scop');
        disegnaScoperte();
      });
    });
    disegnaScoperte();
  }

  function disegnaScoperte() {
    var s = LM.load();
    var c = document.getElementById('scop-corpo');
    if (!c) return;
    if (sezScoperte === 'registro') {
      c.innerHTML = bloccoLezioniHtml();
      wireLezioni(c);
      return;
    }
    /* con la lista vuota il pulsante sta una volta sola, dentro il riquadro
       che spiega cosa manca: due pulsanti uguali sulla stessa schermata
       sono due volte la stessa domanda */
    var vuota = !s.esperimenti.length;
    /* IL PARAGRAFO CHE È RIMASTO, e perché. Quasi tutti quelli sotto un titolo
       sono andati via: dicevano a parole quello che il comando sotto diceva
       già da sé. Questo no — un confronto A/B su una persona sola non si
       indovina guardando lo schermo, e senza sapere che i primi giorni servono
       come base di partenza non si capisce perché l'app chieda di aspettare.
       Riscritto in tre frasi invece di sei righe, e il limite del metodo sta
       dove serve leggerlo: sotto il verdetto, non prima di cominciare. */
    c.innerHTML = '<div class="card"><div class="sotto" style="margin:0">' +
      'Per prima cosa l’app misura come vanno le cose adesso, senza cambiare niente: è la <b>base di partenza</b>. Poi introduci la modifica e continua a misurare. La differenza fra i due periodi è la risposta.' +
      (vuota ? '' : '</div><div class="riga-flex mt-s"><button class="btn btn-mini" id="btn-nuovo-exp">' + ICO('plus', 15) + ' Nuovo esperimento</button></div>') +
      '</div>' +
      '<div id="form-exp-zona"></div><div class="griglia mt" id="lista-exp" style="gap:16px"></div>';

    var bNuovo = document.getElementById('btn-nuovo-exp');
    if (bNuovo) bNuovo.addEventListener('click', mostraFormExp);

    var lista = document.getElementById('lista-exp');
    if (!s.esperimenti.length) {
      /* uno stato vuoto porta con sé la sua via d'uscita: il pulsante sta
         qui dentro, dove si sta guardando, non solo in cima alla pagina */
      lista.innerHTML = '<div class="card vuoto">' + illoFlask() + '<b>Non hai ancora nessun esperimento.</b><br>Qualche idea per iniziare: verificare se fare sport al mattino migliora il focus, se tenere il telefono in un’altra stanza aumenta i minuti di studio, o se andare a letto prima ti dà più energia.' +
        '<div class="vuoto-azione"><button class="btn btn-primario" id="btn-primo-exp">' + ICO('plus', 15) + ' Crea il primo esperimento</button></div></div>';
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
        verdetto = '<div class="exp-verdetto">' + ICO('confronto', 15) +
          '<span>Nella fase iniziale la media era <b>' + LMCharts.fmtNum(ris.baseline.media) + '</b> (su ' + ris.baseline.n + ' giorni); dopo la modifica è <b>' + LMCharts.fmtNum(ris.intervento.media) + '</b> (su ' + ris.intervento.n + ' giorni), con una differenza di <b>' + (diff > 0 ? '+' : '') + LMCharts.fmtNum(diff) + '</b>' +
          (dEff !== null ? '. L’entità del cambiamento è <b>' + forza + '</b> (d≈' + LMCharts.fmtNum(dEff) + ')' : '') + '.' +
          '<br><small>È un indizio utile, non una prova definitiva: se il risultato ti interessa, ripeti l’esperimento per confermarlo.</small></span></div>' +
          /* IL RISULTATO DIVENTA UNA RIGA. Un esperimento che finisce e resta
             un grafico non serve a niente il mese dopo: quello che uno vuole
             ritrovare è la frase, con scritto che quella l'ha misurata. Se
             l'esperimento è nato da una riga, questo tasto aggiorna QUELLA
             invece di scriverne una seconda uguale. */
          '<div class="riga-flex mt-s"><button class="btn btn-mini" data-expsalva="' + e.id + '">' +
          ICO(diff > 0 ? 'funziona' : 'nonFunziona', 15) + ' ' +
          (lezDi(e) ? 'Aggiorna la riga: adesso è misurata' : (diff > 0 ? 'Salvala in «Funziona»' : 'Salvala in «Non funziona»')) +
          '</button></div>';
      } else {
        verdetto = '<div class="exp-verdetto">' + ICO('attesa', 15) + '<span>Non ci sono ancora abbastanza dati: servono almeno due giorni con una misura in ciascuna fase. Continua a fare i check-in.</span></div>';
      }
      card.innerHTML = '<div class="exp-testa"><h2>' + esc(e.nome) + '</h2>' +
        '<span class="chip">' + (e.stato === 'attivo' ? '<span class="punto-vivo"></span> attivo' : ICO('concluso', 13) + ' concluso') + '</span>' +
        '<span class="chip">' + esc(m ? m.nome : e.metrica) + (e.areaId ? ' · ' + esc(areaById(e.areaId).nome) : '') + '</span></div>' +
        /* «Intervento» era la parola del metodo, non quella del modulo: nel
           modulo il campo si chiama «La modifica che vuoi testare», e la
           scheda lo chiamava con un altro nome. */
        (e.intervento ? '<div class="sotto" style="margin:0">La modifica: ' + esc(e.intervento) + '</div>' : '') +
        '<div id="exp-chart-' + i + '"></div>' + verdetto;
      lista.appendChild(card);
      var bSalva = card.querySelector('[data-expsalva]');
      if (bSalva) bSalva.addEventListener('click', function () { salvaEsitoInLezione(e, ris); });
      LMCharts.experiment(document.getElementById('exp-chart-' + i), ris, {
        label: 'Esperimento ' + e.nome,
        max: (m && m.fonte !== 'minuti' && m.fonte !== 'xp') ? 5 : undefined,
        ticks: (m && m.fonte !== 'minuti' && m.fonte !== 'xp') ? [1, 3, 5] : undefined,
        min: 0
      });
    });

    /* IL MODULO SOPRAVVIVE A UN RIDISEGNO, e non è un lusso: la pagina si
       ridisegna da sé quando arriva la risposta dell'account, quando il cloud
       porta un aggiornamento, quando la rete cade. Prima il modulo stava solo
       nel DOM, quindi uno che aveva scritto mezza domanda se la vedeva sparire
       senza aver toccato niente — e la stessa cosa faceva sparire il modulo già
       compilato che si apre da una riga imparata (trovato da prove/lezioni.js,
       che gira senza cloud e quindi riceve subito «account non disponibile»).
       Adesso quello che c'è scritto vive in `formExp`, e il disegno lo rimette. */
    function mostraFormExp(daLezione) {
      var zona = document.getElementById('form-exp-zona');
      if (!zona) return;
      /* la riga da cui parte, se parte da una riga: il nome è la domanda,
         l'intervento è la cosa stessa */
      var pre = daLezione && daLezione.testo
        ? { nome: '«' + daLezione.testo + '»: è vero?', int: daLezione.testo, area: daLezione.areaId || '',
            metrica: '', durata: '', lez: daLezione.id }
        : (formExp || { nome: '', int: '', area: '', metrica: '', durata: '', lez: null });
      formExp = { nome: pre.nome, int: pre.int, area: pre.area, metrica: pre.metrica, durata: pre.durata, lez: pre.lez };
      zona.innerHTML = '<div class="card mt">' +
        '<h2>Nuovo esperimento</h2><div class="sotto">I giorni già passati fanno da base di partenza; la modifica che vuoi testare inizia oggi.</div>' +
        '<label class="campo" for="exp-nome">Cosa vuoi scoprire</label><input type="text" id="exp-nome" value="' + esc(pre.nome) + '" placeholder="Es. studiare in biblioteca mi fa studiare di più?">' +
        '<label class="campo" for="exp-int">La modifica che vuoi testare</label><input type="text" id="exp-int" value="' + esc(pre.int) + '" placeholder="Es. ogni pomeriggio studio in biblioteca invece che in camera">' +
        '<div class="griglia griglia-3 mt-s"><div><label class="campo" for="exp-metrica">Cosa misuri</label><select id="exp-metrica">' +
        LM.METRICHE_ESPERIMENTO.map(function (m2) { return '<option value="' + m2.id + '">' + esc(m2.nome) + '</option>'; }).join('') +
        '</select></div>' +
        '<div><label class="campo" for="exp-area">Area (se serve)</label>' + selectAree('exp-area') + '</div>' +
        '<div><label class="campo" for="exp-durata">Durata</label><select id="exp-durata">' +
        '<option value="7-14">7 giorni di base, 14 di test</option>' +
        '<option value="14-14" selected>14 giorni di base, 14 di test</option>' +
        '<option value="14-21">14 giorni di base, 21 di test</option>' +
        '</select></div></div>' +
        '<div class="riga-flex mt"><button class="btn btn-primario" id="exp-crea">' + ICO('flask', 15) + ' Avvia</button>' +
        '<button class="btn btn-ghost" id="exp-annulla">Annulla</button></div></div>';
      document.getElementById('exp-annulla').addEventListener('click', function () {
        formExp = null; zona.innerHTML = '';
      });
      /* i valori scelti si rimettono dopo, non nell'HTML: un `selected` da
         costruire dentro tre `map` diversi è tre posti dove sbagliarsi */
      var campo = function (id) { return document.getElementById(id); };
      if (pre.area) campo('exp-area').value = pre.area;
      if (pre.metrica) campo('exp-metrica').value = pre.metrica;
      if (pre.durata) campo('exp-durata').value = pre.durata;
      /* quello che si scrive resta scritto anche se la pagina si ridisegna */
      var tieni = function (id, chiave) {
        var el = campo(id);
        if (!el) return;
        var scrivi = function () { if (formExp) formExp[chiave] = el.value; };
        el.addEventListener('input', scrivi);
        el.addEventListener('change', scrivi);
      };
      tieni('exp-nome', 'nome'); tieni('exp-int', 'int');
      tieni('exp-metrica', 'metrica'); tieni('exp-area', 'area'); tieni('exp-durata', 'durata');
      zona.scrollIntoView({ block: 'nearest' });
      var primo = campo('exp-nome');
      if (primo && !pre.nome && !daLezione) primo.focus();
      campo('exp-crea').addEventListener('click', function () {
        var nome = campo('exp-nome').value.trim();
        if (!nome) { toast('Scrivi cosa vuoi scoprire con l’esperimento.', 0, 'flask'); return; }
        var dur = campo('exp-durata').value.split('-');
        var t = LM.todayKey();
        LM.creaEsperimento({
          nome: nome,
          intervento: campo('exp-int').value.trim(),
          metrica: campo('exp-metrica').value,
          areaId: campo('exp-area').value,
          inizioBaseline: LM.addDays(t, -(+dur[0])),
          inizioIntervento: t,
          fine: LM.addDays(t, +dur[1]),
          lezioneId: pre.lez
        });
        formExp = null;
        toast('Esperimento avviato.', 0, 'flask');
        render();
      });
    }
    /* chi è arrivato qui da una riga imparata trova il modulo già aperto e
       già scritto; chi lo aveva aperto e stava scrivendo lo ritrova com'era */
    if (lezDaProvare) { var daQui = lezDaProvare; lezDaProvare = null; mostraFormExp(daQui); }
    else if (formExp) mostraFormExp();
  }

  /* la riga imparata da cui è nato un esperimento, se c'è ancora */
  function lezDi(e) {
    return e.lezioneId ? LM.trovaLezione(e.lezioneId) : null;
  }

  /* IL RISULTATO DI UN ESPERIMENTO, MESSO IN UNA RIGA. Tutte le metriche di
     questa app sono «più è meglio» (focus, energia, umore, voto, minuti, XP),
     quindi il verso lo decide il segno della differenza. */
  function salvaEsitoInLezione(e, ris) {
    var diff = ris.intervento.media - ris.baseline.media;
    var verso = diff > 0 ? 'si' : 'no';
    var testo = e.intervento || e.nome;
    var l = lezDi(e);
    if (l) {
      LM.modificaLezione(l.id, { verso: verso, forza: 'misurato', espId: e.id });
      toast('Riga aggiornata: adesso c’è scritto che l’hai misurata.', 0, verso === 'si' ? 'funziona' : 'nonFunziona');
    } else {
      var nuova = LM.aggiungiLezione(testo, verso, { forza: 'misurato', areaId: e.areaId, espId: e.id });
      if (nuova) LM.creaLegameEsperimento(e.id, nuova.id);
      toast(verso === 'si' ? 'Salvata in «Funziona», con l’etichetta «misurato».'
        : 'Salvata in «Non funziona», con l’etichetta «misurato».',
        0, verso === 'si' ? 'funziona' : 'nonFunziona');
    }
    render();
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
      '<div class="card"><div class="sotto" style="margin:0">Le etichette dicono quanto è solida ogni prova: <span class="evidenza evidenza-alta">evidenza alta</span> significa meta-analisi o studi clinici controllati; <span class="evidenza evidenza-media">media</span> significa studi solidi ma non conclusivi; <span class="evidenza evidenza-euristica">euristica</span> significa pratica clinica ragionevole, non ancora dimostrata. La verifica finale spetta comunque a te, e serve a questo la pagina <b>Scoperte</b>.</div></div>' +
      '<div class="griglia griglia-2 mt">' +
      PRINCIPI.map(function (p, i) {
        var cls = p.evidenza === 'alta' ? 'evidenza-alta' : (p.evidenza === 'media' ? 'evidenza-media' : 'evidenza-euristica');
        var eti = p.evidenza === 'alta' ? 'Evidenza alta' : (p.evidenza === 'media' ? 'Media' : 'Euristica');
        return '<div class="card scienza-card" style="--i:' + i + '">' +
          '<div class="riga-flex" style="justify-content:space-between;flex-wrap:nowrap;align-items:flex-start"><h2 style="margin:0">' + p.titolo + '</h2><span class="evidenza ' + cls + '">' + eti + '</span></div>' +
          '<p style="font-size:13.5px;color:var(--inchiostro-2)">' + p.claim + '</p>' +
          '<div class="uso"><b>Nel prototipo:</b> ' + p.uso + '</div>' +
          '<div class="fonte">' + ICO('fonte', 15) + '<span>' + p.fonti + '</span></div>' +
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
          '<label class="campo" for="ob-visione">In una frase, cosa vuoi ottenere</label>' +
          '<textarea id="ob-visione" placeholder="Es. imparare più in fretta, restare in salute e costruire progetti che contano">' + esc(scelte.visione) + '</textarea>' +
          '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="ob-avanti">Avanti ' + ICO('arrowRight', 15) + '</button>' +
          '<button class="btn btn-ghost" id="ob-demo">Salta e vai alla demo</button></div></div>';
      } else if (passo === 1) {
        step = '<div class="card"><h2>Le aree della tua vita</h2><div class="sotto">Sono tutte attive: disattiva quelle che non ti servono, potrai riattivarle quando vuoi.</div>' +
          '<div class="selettore-aree">' + LM.AREE_DEFAULT.map(function (a) {
            var sel = scelte.aree.indexOf(a.id) >= 0;
            return '<button data-area="' + a.id + '" class="' + (sel ? 'sel' : '') + '" style="--c-area:' + LM.SLOT_COLORI[a.slot][0] + '">' +
              ICO(a.icona, 18) + esc(a.nome) + '<span class="segno">' + ICO('scelto', 15) + '</span></button>';
          }).join('') + '</div>' +
          '<div class="riga-flex mt"><button class="btn btn-primario btn-grande" id="ob-avanti">Avanti ' + ICO('arrowRight', 15) + '</button>' +
          '<button class="btn btn-ghost" id="ob-indietro">Indietro</button></div></div>';
      } else {
        step = '<div class="card"><h2>Da dove vuoi partire?</h2><div class="sotto">Sono tre modi di usare la stessa app, sugli stessi dati. Scegline uno per iniziare: potrai cambiare quando vuoi.</div>' +
          '<div class="selettore-modi">' +
          modo('oggi', 'target', 'Oggi', 'Una sola azione alla volta, per quando hai già tante cose in mente.') +
          modo('plancia', 'dashboard', 'Panoramica', 'Una schermata da tenere aperta, con numeri e grafici sempre a portata.') +
          modo('rituali', 'rituali', 'Rituali', 'Brevi routine al mattino e alla sera che ti danno una struttura fissa.') +
          '</div>' +
          '<div class="riga-flex mt">' +
          '<button class="btn btn-primario btn-grande" id="ob-fine-demo">' + ICO('sparkles', 15) + ' Parti con 8 settimane di dati demo</button>' +
          '<button class="btn" id="ob-fine-vuoto">Parti da zero</button>' +
          '<button class="btn btn-ghost" id="ob-indietro">Indietro</button></div></div>';
      }

      root.innerHTML = '<div class="onboarding"><div class="ob-grid">' +
        '<aside class="ob-brand">' +
        '<div class="logo">' + LOGO(34) + ' LifeMax</div>' +
        '<div class="ob-titolo">Misura. Ingegnerizza.<br><em>Massimizza.</em></div>' +
        '<p>Uno spazio unico per organizzare, misurare e migliorare le diverse aree della tua vita. È pensato per chi fatica a mantenere costanza e concentrazione: poca fatica per usarlo, riscontro immediato.</p>' +
        '<div class="ob-punti">' +
        '<div class="ob-punto">' + ICO('bolt', 15) + '<span><b>Annota subito.</b> Un tasto per salvare qualsiasi pensiero; deciderai dopo cosa farne.</span></div>' +
        '<div class="ob-punto">' + ICO('target', 15) + '<span><b>Una cosa alla volta.</b> Ti proponiamo la prossima azione, così eviti la paralisi da troppe scelte.</span></div>' +
        '<div class="ob-punto">' + ICO('flask', 15) + '<span><b>Scienza applicata a te.</b> Esperimenti sui tuoi dati per capire cosa funziona davvero, non sulle medie di altri.</span></div>' +
        '</div>' +
        '<div id="ob-account" class="ob-account"></div>' +
        illoOrbita() + '</aside>' +
        '<section class="ob-step"><div class="passi-punti">' +
        [0, 1, 2].map(function (i) { return '<span class="' + (i === passo ? 'attivo' : '') + '"></span>'; }).join('') +
        '</div>' + step + '</section>' +
        '</div></div>';

      function modo(id, icona, nome, desc) {
        return '<button data-modo="' + id + '" class="' + (scelte.modo === id ? 'sel' : '') + '">' +
          '<span class="icona-modo">' + ICO(icona, 18) + '</span>' +
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
  /* C'è un rituale da fare in questo momento? Il mattino e le review si fanno
     una volta e poi sono fatte; il check-in si può rifare, quindi conta come
     «da fare» solo se non l'hai ancora fatto oggi. */
  function rituliDaFare() {
    var rid = ritualeDellOra();
    var st = statoRituale(rid);
    return !st.fatto;
  }

  /* LA PORTA DELLE IMPOSTAZIONI, su telefono.
     È stata in due posti sbagliati, per due ragioni opposte. Prima nella testa
     di «Panoramica»: l'unica porta dell'app stava nell'angolo di UNA schermata,
     e per trovarla bisognava già sapere che era là. Poi nella barra in basso,
     accanto alle tre porte: trovabile sì, ma la barra in basso è il posto delle
     cose che si toccano venti volte al giorno, e le impostazioni si aprono
     forse una volta al mese. Un quarto della barra — la fascia più preziosa
     dello schermo, quella che il pollice raggiunge senza spostare la mano —
     spesa per una cosa che quasi non si usa.
     Adesso sta dove l'ha messa tutto il resto del mondo: in alto a destra,
     l'angolo più lontano dal pollice, lo stesso su ogni schermata. Fuori dalla
     strada, e sempre nello stesso punto. Sul desktop non c'è: là la colonna la
     tiene già in fondo, che è lo stesso ragionamento. */
  function bottoneImpostazioni() {
    return '<button type="button" class="btn-tu" data-imp="1" aria-label="Impostazioni" ' +
      'title="Impostazioni">' + ICO('ingranaggio', 18) + '</button>';
  }

  function sottoNav(v) {
    /* SOLO la riga che ha creato questa funzione: `.sez-nav` è la classe
       condivisa dello stile e ce l'hanno anche le linguette proprie di
       Attività e Andamento — cercandola qui le si cancellava a ogni ridisegno */
    var vecchia = $vista.querySelector('.testa-porta');
    if (vecchia) vecchia.remove();
    document.documentElement.style.setProperty('--sottonav-h', '0px');
    var g = gruppoDi(v);
    var lista = g.viste.slice();
    /* se sei in una schermata «di passaggio» (Perché funziona, Design lab) la
       sua linguetta si aggiunge in fondo, attiva: non c'è normalmente, ma
       mentre ci sei dentro dice dove sei e ti riporta indietro */
    if ((g.anche || []).indexOf(v) >= 0) {
      /* qui il nome sta corto: la linguetta è quella su cui SEI e il titolo
         sopra lo scrive già per intero, mentre «Perché funziona» da solo si
         mangiava cento pixel e mandava la riga a scorrere sul telefono */
      var vi = vistaById(v);
      lista.push({ id: v, eti: (vi && (vi.breve || vi.nome)) || v });
    }
    /* La riga delle sezioni è LA STESSA di tutte le altre pagine. Prima qui
       c'erano linguette sottolineate e in Attività e Andamento pastiglie a
       segmenti: due controlli per lo stesso mestiere («scegli una sezione di
       questa pagina»), e chi li usa non ha modo di sapere che sotto uno ci
       sono tre indirizzi e sotto l'altro tre pannelli. Il commento di
       `.segmenti.tabs-fisse` diceva già «vale per TUTTE le barre di sezione»:
       mancava solo che questa la usasse. */
    var riga = document.createElement('div');
    riga.className = 'testa-porta';
    var bar = document.createElement('nav');
    bar.className = 'segmenti sez-nav porta-nav tabs-fisse' + (lista.length === 2 ? ' tabs-due' : '');
    bar.setAttribute('aria-label', 'Sezioni di ' + g.nome);
    bar.innerHTML = lista.map(function (x) {
      /* la stessa icona della barra in basso e della colonna sul desktop: è
         la stessa destinazione, quindi è lo stesso segno. Prima qui c'era
         solo la parola, e la riga di linguette non somigliava a nessuna
         delle altre due navigazioni. */
      var vi = vistaById(x.id);
      /* Se in «Rituali» c'è qualcosa da fare adesso, lo dice una pastiglia
         sulla linguetta. Prima lo diceva un pulsante in fondo alla schermata
         («Check-in — adesso →»), che portava esattamente dove porta questa
         linguetta: un bersaglio in più e l'ultimo doppione rimasto. Il numero
         sta dove sta la destinazione, come per «Attività». */
      var bollo = (x.id === 'rituali' && x.id !== v && rituliDaFare()) ? '<span class="att-badge">1</span>' : '';
      return '<a class="' + (x.id === v ? 'attivo' : '') + '" href="#/' + x.id + '"' +
        (x.id === v ? ' aria-current="page"' : '') + '>' +
        '<span class="seg-ico">' + ((vi && vi.icona) ? ICO(vi.icona, 15) : '') + bollo + '</span>' +
        '<span class="seg-eti">' + x.eti + '</span></a>';
    }).join('');
    /* la riga delle sezioni è SEMPRE il primo blocco della pagina. Prima
       veniva dopo la testa quando c'era una testa, e da quando le teste sono
       rimaste solo dove tengono un comando il contenuto cominciava sessanta
       pixel più in basso su tre pagine e in cima sulle altre sette: cambiando
       porta la pagina saltava. La barra di strumenti, se c'è, viene dopo. */
    var conNav = navTre() && lista.length >= 2;
    if (conNav) riga.appendChild(bar);
    else {
      /* NIENTE RIGA VUOTA CON UN INGRANAGGIO IN FONDO.
         «Attività» è una porta con una stanza sola, quindi di linguette di
         porta non ne ha: l'ingranaggio si ritrovava da solo su una riga sua,
         sopra le linguette della pagina — più in alto che su ogni altra
         schermata, e attaccato a niente. Qui la riga se la prende in prestito:
         la fila di sezioni che la pagina ha già disegnato (Da sistemare · Da
         fare · Abitudini) sale accanto all'ingranaggio, e l'angolo in alto a
         destra torna a essere lo stesso posto dappertutto.
         Funziona perché `sottoNav` gira DOPO che la pagina si è disegnata: la
         fila esiste già, e si sposta senza rifarla — i suoi fili restano
         attaccati. */
      var sua = $vista.querySelector(':scope > .segmenti.sez-nav');
      if (sua) riga.appendChild(sua);
      else riga.className += ' testa-porta-sola';
    }
    riga.insertAdjacentHTML('beforeend', bottoneImpostazioni());
    riga.querySelector('[data-imp]').addEventListener('click', apriImpostazioni);
    /* la riga delle sezioni è SEMPRE il primo blocco della pagina */
    $vista.prepend(riga);
    /* niente più sfumatura di scorrimento: a colonne uguali la riga ci sta per
       costruzione a qualunque larghezza, come nelle altre pagine */
    document.documentElement.style.setProperty('--sottonav-h', (riga.offsetHeight + 14) + 'px');
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
    /* dentro la stessa porta si cambia sezione, non pagina: è quello che
       succede fra Adesso, La giornata e Rituali */
    var cambioSezione = cambioPagina && vistaMostrata &&
      gruppoDi(v).id === gruppoDi(vistaMostrata).id;
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
    if (cambioPagina) { animaIngresso($vista, cambioSezione); window.scrollTo(0, 0); }
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
    if (fondo && (window.LM_AUTH || {}).user && scriviSe(fondo, footerSidebar())) wireFooterSidebar();
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
    else {
      battito(); avviaBattito();
      /* CHI NON CHIUDE MAI L'APP. Su telefono la scheda resta aperta per
         giorni: senza questo, la domanda della sera arriverebbe solo a chi
         ricarica la pagina, cioè quasi a nessuno. Tornare sull'app è
         esattamente il momento in cui la domanda ha senso. */
      vistoPrima = LM.segnaVisto();
      setTimeout(forseChiedere, 400);
    }
  });
  avviaBattito();

  applicaTema();
  /* si segna la visita PRIMA del disegno e si tiene da parte quella di prima:
     è l'unico modo di sapere se in mezzo c'è stata una notte */
  vistoPrima = LM.segnaVisto();
  render();
  /* la domanda arriva a schermata già disegnata: un pop-up che compare mentre
     l'app sta ancora entrando si prende l'animazione e sembra un errore */
  setTimeout(forseChiedere, 900);
})();
