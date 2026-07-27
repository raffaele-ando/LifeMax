/* ============================================================
   LifeMax — Laboratorio di design
   Dieci direzioni di interfaccia sugli STESSI elementi, per poterle
   confrontare e scegliere quella che diventerà la base del sito.

   Come funziona, e perché così:
   il markup è UNO SOLO. Ogni design non riscrive gli elementi: li
   riveste. È l'unico modo per un confronto onesto — se cambiasse anche
   la struttura non si saprebbe più se la differenza sta nel design o
   nel contenuto. Ed è anche il modo in cui il cambiamento si applicherà
   davvero al sito: gli elementi restano quelli, cambia la pelle.

   Gli elementi non sono inventati per la vetrina: sono presi dalle
   pagine vere (l'intestazione di Attività, la barra a sinistra, l'eroe
   di Oggi con «Fatto +10 XP», la barra della giornata, la riga di
   aggiunta, le tre fasce di «Da fare», il progetto a passi,
   l'abitudine con la serie, le pastiglie di stato, la carta di una
   metrica, lo stato del salvataggio, un pannello). Così si vede il
   cambiamento su cose che si usano ogni giorno.

   ISOLAMENTO: tutto lo stile sta in assets/lab.css e ogni regola è
   annidata sotto #lab-demo o #lab-scelta. Il foglio viene caricato solo
   quando si apre questa pagina. Nessun'altra pagina del sito ne è
   toccata — c'è un test che lo verifica riga per riga.
   ============================================================ */

'use strict';

(function () {

  var CHIAVE = 'lifemax.lab';

  /* Ogni voce: nome, una riga che dice la direzione, e la famiglia di
     colore (serve solo alla pastiglia di scelta, per riconoscerle). */
  var DESIGN = [
    { n: 1,  id: 'carta',      nome: 'Carta',        idea: 'Editoriale: grazie, filetti al posto delle schede, niente ombre. Legge come una pagina stampata.', c: '#8c2f1f' },
    { n: 2,  id: 'brutale',    nome: 'Brutalista',   idea: 'Bordi neri spessi, ombre dure, blocchi pieni. Nessun angolo tondo, nessuna gentilezza.', c: '#ff4d00' },
    { n: 3,  id: 'vetro',      nome: 'Vetro',        idea: 'Pannelli traslucidi su fondo profondo, sfocature e bagliori. Tutto galleggia.', c: '#5eead4' },
    { n: 4,  id: 'terminale',  nome: 'Terminale',    idea: 'Monospaziato, fondo scuro, verde fosforo. Denso, da tastiera, senza decorazione.', c: '#7ee787' },
    { n: 5,  id: 'morbido',    nome: 'Morbido',      idea: 'Superfici in rilievo appena accennato, angoli molto tondi, tutto a pastiglia.', c: '#6b5bd2' },
    { n: 6,  id: 'svizzero',   nome: 'Svizzero',     idea: 'Griglia severa, rosso unico accento, numeri grandi, microtesto maiuscolo.', c: '#e2231a' },
    { n: 7,  id: 'compatto',   nome: 'Compatto',     idea: 'Da strumento professionale: righe basse, tabelle, cifre allineate, molta roba a schermo.', c: '#2563eb' },
    { n: 8,  id: 'vibrante',   nome: 'Vibrante',     idea: 'Gradienti decisi, carte colorate per area, pulsanti grossi e tondi. Da app di consumo.', c: '#be185d' },
    { n: 9,  id: 'lineare',    nome: 'Notte lineare', idea: 'Solo contorni sottili su nero, nessun riempimento, molto vuoto.', c: '#a5b4fc' },
    { n: 10, id: 'tattile',    nome: 'Tattile',      idea: 'Tutto grande per il pollice: bersagli da 56px, testo da 18px, una azione per riga.', c: '#067647' }
  ];

  function leggiScelta() {
    try { var v = +localStorage.getItem(CHIAVE); return v >= 1 && v <= 10 ? v : 1; } catch (e) { return 1; }
  }
  function salvaScelta(n) { try { localStorage.setItem(CHIAVE, String(n)); } catch (e) { /* ignora */ } }

  function I(nome, size) { return window.ICO ? ICO(nome, size) : ''; }

  /* ---------- il kit: un solo markup per tutti e dieci ---------- */

  function kit() {
    return '' +
    /* 1 — intestazione di pagina (da «Attività») */
    '<div class="k-blocco" data-k="Intestazione di pagina">' +
      '<header class="k-testa">' +
        '<div class="k-testa-testo"><h3 class="k-titolo">Attività</h3>' +
        '<p class="k-sotto">Butta giù tutto, decidi dopo.</p></div>' +
        '<button class="k-btn k-btn-primario">' + I('piu2', 14) + '<span>Nuova</span></button>' +
      '</header>' +
    '</div>' +

    /* 2 — la barra a sinistra, con i suoi tre livelli */
    '<div class="k-blocco" data-k="Barra di navigazione">' +
      '<nav class="k-nav" aria-label="Esempio di navigazione">' +
        '<a class="k-nav-v k-nav-ancora k-attivo">' + I('target', 19) + '<span>Oggi</span></a>' +
        '<a class="k-nav-v">' + I('clock', 17) + '<span>Giornata</span></a>' +
        '<a class="k-nav-v">' + I('lista', 17) + '<span>Attività</span><em class="k-nav-badge">6</em></a>' +
        '<a class="k-nav-v">' + I('sun', 17) + '<span>Rituali</span></a>' +
        '<a class="k-nav-v">' + I('dashboard', 17) + '<span>Panoramica</span></a>' +
        '<span class="k-nav-sep"></span>' +
        '<a class="k-nav-v k-nav-extra">' + I('flask', 15) + '<span>Esperimenti</span></a>' +
        '<a class="k-nav-v k-nav-extra">' + I('atom', 15) + '<span>Perché funziona</span></a>' +
      '</nav>' +
    '</div>' +

    /* 3 — segmenti (le schede di Attività) */
    '<div class="k-blocco" data-k="Schede">' +
      '<div class="k-segmenti">' +
        '<button>' + I('inbox', 14) + 'Da sistemare <em>6</em></button>' +
        '<button class="k-attivo">' + I('lista', 14) + 'Da fare <em>9</em></button>' +
        '<button>' + I('calendar', 14) + 'In arrivo <em>1</em></button>' +
        '<button>' + I('rocket', 14) + 'Progetti <em>2</em></button>' +
      '</div>' +
    '</div>' +

    /* 4 — l'eroe di «Oggi»: una cosa sola, grande */
    '<div class="k-blocco" data-k="La prossima azione (Oggi)">' +
      '<section class="k-eroe">' +
        '<span class="k-eroe-eti">' + I('clock', 13) + ' In programma alle 15:00</span>' +
        '<h3 class="k-eroe-titolo">Confrontare piani telefonici</h3>' +
        '<span class="k-tag-area k-area-finanze">' + I('wallet', 13) + ' Finanze</span>' +
        '<button class="k-fatto">' + I('check', 17) + ' Fatto <em>+10 XP</em></button>' +
        '<div class="k-timer"><span class="k-timer-eti">' + I('play', 12) + ' Timer</span>' +
          '<button>25′</button><button>10′</button><button>50′</button>' +
          '<button class="k-piu-tardi">Più tardi ' + I('arrowRight', 12) + '</button></div>' +
      '</section>' +
    '</div>' +

    /* 5 — la barra della giornata */
    '<div class="k-blocco" data-k="Barra della giornata">' +
      '<div class="k-strip">' +
        '<div class="k-strip-testa"><b>' + I('clock', 14) + ' La giornata</b>' +
          '<span class="k-strip-poi">poi Confrontare piani telefonici · 15:00 ' + I('arrowRight', 12) + '</span></div>' +
        '<div class="k-strip-barra">' +
          '<i class="k-seg k-seg-1" style="left:8%;width:16%"></i>' +
          '<i class="k-seg k-seg-2" style="left:32%;width:11%"></i>' +
          '<i class="k-seg k-seg-3" style="left:62%;width:9%"></i>' +
          '<i class="k-seg k-seg-4" style="left:86%;width:7%"></i>' +
          '<u class="k-pasto" style="left:21%"></u><u class="k-pasto" style="left:47%"></u><u class="k-pasto" style="left:78%"></u>' +
          '<b class="k-adesso" style="left:41%"></b>' +
        '</div>' +
        '<div class="k-strip-ore"><span>07:30</span><span>23:30</span></div>' +
        '<div class="k-strip-legenda"><span>' + I('lista', 11) + ' 3 con durata</span><span>' + I('utensils', 11) + ' 3 pasti</span><span>' + I('clock', 11) + ' 1 senza orario</span></div>' +
      '</div>' +
    '</div>' +

    /* 6 — la riga per aggiungere, con le opzioni aperte */
    '<div class="k-blocco" data-k="Riga per aggiungere">' +
      '<div class="k-agg">' +
        '<div class="k-agg-riga">' +
          '<input class="k-agg-testo" type="text" value="Prenotare il dentista" aria-label="Aggiungi una cosa da fare">' +
          '<button class="k-btn k-btn-primario">' + I('piu2', 14) + '<span>Aggiungi</span></button>' +
        '</div>' +
        '<div class="k-agg-opz">' +
          '<span class="k-eti">Quando?</span>' +
          '<div class="k-qchips"><button>Oggi</button><button>Domani</button><button class="k-attivo">Poi, senza data</button></div>' +
          '<label class="k-agg-area"><span class="k-eti">in</span>' +
          '<select aria-label="Area"><option>Altro / Esplorazione</option><option>Studio / Università</option></select></label>' +
        '</div>' +
      '</div>' +
    '</div>' +

    /* 7 — pastiglie per filtrare le aree */
    '<div class="k-blocco" data-k="Filtri per area">' +
      '<div class="k-chips">' +
        '<button class="k-chip k-attivo">Tutte <em>9</em></button>' +
        '<button class="k-chip k-area-studio">' + I('book', 13) + ' Studio / Università <em>3</em></button>' +
        '<button class="k-chip k-area-salute">' + I('heart', 13) + ' Salute &amp; Sport <em>1</em></button>' +
        '<button class="k-chip k-area-founder">' + I('rocket', 13) + ' Progetti Founder <em>2</em></button>' +
        '<button class="k-chip k-vuota">' + I('plus', 12) + ' 3 aree vuote</button>' +
      '</div>' +
    '</div>' +

    /* 8 — le tre fasce di importanza di «Da fare» */
    '<div class="k-blocco" data-k="Le tre fasce di «Da fare»">' +
      '<div class="k-fascia k-fascia-ora">' +
        '<div class="k-fascia-testa"><span class="k-fascia-tit">Prima queste</span><em class="k-fascia-n">3</em></div>' +
        '<div class="k-riga k-riga-ora k-area-finanze">' +
          '<div class="k-riga-corpo">' +
            '<div class="k-riga-tit"><span class="k-tag-area">' + I('wallet', 12) + '</span>Consegnare il modulo ISEE</div>' +
            '<div class="k-riga-meta"><span class="k-badge k-badge-ritardo">' + I('calendar', 10) + ' scaduta 2g fa</span></div>' +
          '</div>' +
          '<div class="k-riga-azioni"><button class="k-btn k-btn-primario">' + I('arrowRight', 13) + '<span>Oggi</span></button>' +
            '<button class="k-icona" aria-label="Altro">' + I('dots', 16) + '</button></div>' +
        '</div>' +
        '<div class="k-riga k-riga-ora k-progetto k-area-studio">' +
          '<div class="k-riga-corpo">' +
            '<div class="k-riga-tit"><span class="k-tag-area">' + I('book', 12) + '</span>Recuperare i corsi di ingegneria gestionale</div>' +
            '<div class="k-prog"><span class="k-prog-segmenti"><i class="k-on"></i><i></i><i></i></span><span class="k-prog-eti"><b>1</b> di <b>3</b> passi</span></div>' +
          '</div>' +
          '<div class="k-riga-azioni"><button class="k-btn k-btn-primario">' + I('arrowRight', 13) + '<span>Passo</span></button>' +
            '<button class="k-icona" aria-label="Passi">' + I('lista', 14) + '</button>' +
            '<button class="k-icona" aria-label="Altro">' + I('dots', 16) + '</button></div>' +
        '</div>' +
      '</div>' +
      '<div class="k-fascia k-fascia-poi">' +
        '<div class="k-fascia-testa"><span class="k-fascia-tit">Le altre</span><em class="k-fascia-n">6</em></div>' +
        '<div class="k-riga k-riga-poi k-area-studio">' +
          '<div class="k-riga-corpo"><div class="k-riga-tit"><span class="k-tag-area">' + I('book', 12) + '</span>Studiare le risposte per l’OFA di inglese</div></div>' +
          '<div class="k-riga-azioni"><button class="k-btn">' + I('arrowRight', 13) + '<span>Oggi</span></button>' +
            '<button class="k-icona" aria-label="Altro">' + I('dots', 16) + '</button></div>' +
        '</div>' +
        '<div class="k-riga k-riga-poi k-area-altro">' +
          '<div class="k-riga-corpo"><div class="k-riga-tit"><span class="k-tag-area">' + I('sparkles', 12) + '</span>Confrontare iPhone 15 Pro e GH5</div>' +
            '<div class="k-riga-meta"><span class="k-badge k-badge-agenda">' + I('calendar', 10) + ' in agenda domani</span></div></div>' +
          '<div class="k-riga-azioni"><button class="k-btn">' + I('arrowRight', 13) + '<span>Oggi</span></button>' +
            '<button class="k-icona" aria-label="Altro">' + I('dots', 16) + '</button></div>' +
        '</div>' +
      '</div>' +
      '<div class="k-fascia k-fascia-parcheggio">' +
        '<button class="k-fascia-testa k-fascia-btn"><span class="k-fascia-tit">Ferme da un po’</span><em class="k-fascia-n">3</em>' +
          '<span class="k-chevron">' + I('chevronGiu', 15) + '</span></button>' +
      '</div>' +
      '<button class="k-altre">' + I('chevronGiu', 14) + ' Mostra le altre 9</button>' +
    '</div>' +

    /* 9 — abitudine con la serie */
    '<div class="k-blocco" data-k="Abitudini di oggi">' +
      '<div class="k-abit-lista">' +
        '<div class="k-abit"><button class="k-spunta" aria-label="Segna come fatta">' + I('check', 13) + '</button>' +
          '<span class="k-abit-testo">Leggere 20 minuti</span>' +
          '<span class="k-tag-area k-area-salute">' + I('heart', 13) + '</span></div>' +
        '<div class="k-abit k-fatta"><button class="k-spunta" aria-label="Segna come fatta">' + I('check', 13) + '</button>' +
          '<span class="k-abit-testo">Camminata / movimento</span>' +
          '<span class="k-streak">' + I('flame', 12) + ' 3</span>' +
          '<span class="k-tag-area k-area-salute">' + I('heart', 13) + '</span></div>' +
        '<div class="k-abit"><button class="k-spunta" aria-label="Segna come fatta">' + I('check', 13) + '</button>' +
          '<span class="k-abit-testo">Ripasso flashcard</span>' +
          '<span class="k-giorni"><i class="k-on">L</i><i class="k-on">M</i><i>M</i><i class="k-on">G</i><i>V</i><i>S</i><i>D</i></span>' +
          '<span class="k-tag-area k-area-studio">' + I('book', 13) + '</span></div>' +
      '</div>' +
    '</div>' +

    /* 10 — pastiglie di stato */
    '<div class="k-blocco" data-k="Pastiglie di stato">' +
      '<div class="k-badges">' +
        '<span class="k-badge k-badge-ritardo">' + I('calendar', 10) + ' scaduta 2g fa</span>' +
        '<span class="k-badge k-badge-oggi">' + I('calendar', 10) + ' entro oggi</span>' +
        '<span class="k-badge k-badge-agenda">' + I('calendar', 10) + ' in agenda oggi</span>' +
        '<span class="k-badge k-badge-pin">' + I('star', 10) + ' appuntata</span>' +
        '<span class="k-badge k-badge-serie">' + I('flame', 10) + ' serie di 3</span>' +
      '</div>' +
    '</div>' +

    /* 11 — carta di una metrica (da Panoramica) */
    '<div class="k-blocco" data-k="Metrica">' +
      '<div class="k-metriche">' +
        '<div class="k-metrica"><span class="k-metrica-eti">Costanza</span>' +
          '<b class="k-metrica-num">78<i>%</i></b>' +
          '<span class="k-metrica-delta k-su">' + I('trendUp', 12) + ' +6</span>' +
          '<svg class="k-spark" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true">' +
          '<polyline points="0,22 14,18 28,20 42,12 56,14 70,7 84,9 100,4"/></svg>' +
          '<span class="k-metrica-nota">ultimi 14 giorni</span></div>' +
        '<div class="k-metrica"><span class="k-metrica-eti">Azioni fatte</span>' +
          '<b class="k-metrica-num">1<i>/2</i></b>' +
          '<span class="k-metrica-delta">oggi</span>' +
          '<div class="k-barra"><span style="width:50%"></span></div>' +
          '<span class="k-metrica-nota">una alla volta</span></div>' +
      '</div>' +
    '</div>' +

    /* 12 — stato del salvataggio + avviso */
    '<div class="k-blocco" data-k="Stato e avvisi">' +
      '<div class="k-stati">' +
        '<button class="k-sync k-sync-ok">' + I('cloudCheck', 13) + ' Salvato nel cloud · 13:42</button>' +
        '<button class="k-sync k-sync-attesa">' + I('cloud', 13) + ' Salvato qui, in attesa di rete</button>' +
        '<div class="k-toast">' + I('flame', 15) + ' Fatta. Continua così <em>+10 XP</em></div>' +
      '</div>' +
    '</div>' +

    /* 13 — pannello (il bottom sheet) */
    '<div class="k-blocco" data-k="Pannello">' +
      '<div class="k-sheet">' +
        '<div class="k-sheet-testa"><h4>Quando farla</h4><button class="k-icona" aria-label="Chiudi">' + I('x', 15) + '</button></div>' +
        '<div class="k-sheet-corpo">' +
          '<div class="k-qchips"><button class="k-attivo">Oggi</button><button>Domani</button><button>Mercoledì</button><button>Tra una settimana</button></div>' +
          '<p class="k-nota">Finisce tra le cose di quel giorno, in <b>La giornata</b>.</p>' +
          '<div class="k-sheet-azioni"><button class="k-btn k-btn-primario">' + I('check', 14) + '<span>Conferma</span></button>' +
            '<button class="k-btn k-btn-fantasma">' + I('trash', 13) + '<span>Rimuovi</span></button></div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    /* 14 — stato vuoto */
    '<div class="k-blocco" data-k="Stato vuoto">' +
      '<div class="k-vuoto">' + I('inbox', 30) + '<b>Niente da fare, per ora.</b>' +
      '<span>Scrivi qui sopra, oppure sistema ciò che hai buttato giù.</span>' +
      '<button class="k-btn k-btn-primario">' + I('piu2', 14) + '<span>Aggiungi la prima</span></button></div>' +
    '</div>';
  }

  /* ---------- la pagina ---------- */

  function montaIn(el, onScelta) {
    var scelto = leggiScelta();
    var d = DESIGN[scelto - 1];

    el.innerHTML =
      '<div id="lab-scelta">' +
        '<div class="lab-intro">' +
          '<h2>Laboratorio di design</h2>' +
          '<p>Dieci vestiti diversi per gli stessi elementi, presi dalle pagine vere. ' +
          'Guardali, poi dimmi il numero di quello che vuoi come base per tutto il sito. ' +
          'Qui dentro non cambia niente del resto: è una stanza a parte.</p>' +
        '</div>' +
        '<div class="lab-rail" role="tablist" aria-label="Dieci design">' +
          DESIGN.map(function (x) {
            return '<button role="tab" class="lab-tab' + (x.n === scelto ? ' on' : '') + '" data-d="' + x.n + '"' +
              ' aria-selected="' + (x.n === scelto) + '" style="--lab-c:' + x.c + '">' +
              '<em>' + x.n + '</em><span>' + x.nome + '</span></button>';
          }).join('') +
        '</div>' +
        '<div class="lab-barra">' +
          '<button class="btn btn-mini" id="lab-prec">' + I('arrowRight', 14) + ' Precedente</button>' +
          '<div class="lab-corrente"><b id="lab-nome"></b><span id="lab-idea"></span></div>' +
          '<button class="btn btn-mini" id="lab-succ">Successivo ' + I('arrowRight', 14) + '</button>' +
        '</div>' +
      '</div>' +
      '<div id="lab-demo" data-design="' + d.id + '" data-n="' + scelto + '">' +
        '<div class="k-canvas">' + kit() + '</div>' +
      '</div>';

    var demo = el.querySelector('#lab-demo');
    var nome = el.querySelector('#lab-nome');
    var idea = el.querySelector('#lab-idea');

    function applica(n, muoviFuoco) {
      var x = DESIGN[n - 1];
      scelto = n;
      salvaScelta(n);
      demo.setAttribute('data-design', x.id);
      demo.setAttribute('data-n', String(n));
      nome.textContent = x.n + '. ' + x.nome;
      idea.textContent = x.idea;
      el.querySelectorAll('.lab-tab').forEach(function (t) {
        var on = +t.getAttribute('data-d') === n;
        t.classList.toggle('on', on);
        t.setAttribute('aria-selected', String(on));
        if (on && muoviFuoco) t.focus({ preventScroll: true });
        if (on) t.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      });
      if (onScelta) onScelta(x);
    }

    el.querySelectorAll('.lab-tab').forEach(function (t) {
      t.addEventListener('click', function () { applica(+t.getAttribute('data-d')); });
    });
    el.querySelector('#lab-prec').addEventListener('click', function () { applica(scelto === 1 ? 10 : scelto - 1, true); });
    el.querySelector('#lab-succ').addEventListener('click', function () { applica(scelto === 10 ? 1 : scelto + 1, true); });
    /* frecce anche da tastiera dentro la fila delle pastiglie */
    el.querySelector('.lab-rail').addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); applica(scelto === 10 ? 1 : scelto + 1, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); applica(scelto === 1 ? 10 : scelto - 1, true); }
    });

    applica(scelto);
  }

  window.LM_LAB = { montaIn: montaIn, DESIGN: DESIGN, scelta: leggiScelta };
})();
