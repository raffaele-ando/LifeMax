/* ============================================================
   LifeMax — Laboratorio di design, versione 2
   Dieci direzioni di interfaccia, ciascuna come SCHERMATA VERA.

   Perché la prima versione non funzionava, detto chiaro: usava un
   markup solo e cambiava soltanto la vernice — bordi, raggi, caratteri,
   colori. Impianto, densità e gerarchia erano identici in tutte e
   dieci. Erano dieci temi, non dieci design. E il confronto avveniva su
   quattordici scatolette etichettate in colonna, dove nessun design ha
   la possibilità di sembrare buono, perché a un design serve una
   COMPOSIZIONE per esistere.

   Come è fatta adesso:
   — il CONTENUTO è uno e identico per tutte (le stesse attività, le
     stesse ore, gli stessi numeri): è quello che rende il confronto
     onesto;
   — la COMPOSIZIONE è di ciascuna. Ogni direzione scrive il proprio
     HTML: decide dove sta la navigazione, quante cose si vedono
     insieme, cosa viene prima, se esistono le schede, se esistono le
     icone. Cambia l'impianto, non la tinta;
   — si guardano due schermate intere per direzione, «Oggi» e
     «Attività», dentro una cornice che simula lo schermo, con un
     interruttore per vederle a larghezza di monitor o di telefono.

   E ogni direzione parte da una POSIZIONE su come si mostra una
   giornata a chi ha la testa che salta, non da una moda grafica.

   ISOLAMENTO: lo stile sta in assets/lab.css, ogni regola annidata
   sotto #lab-demo o #lab-scelta, e il foglio si carica solo aprendo
   questa pagina. C'è un test che lo verifica riga per riga.
   ============================================================ */

'use strict';

(function () {

  var CHIAVE = 'lifemax.lab2';

  function I(n, s) { return window.ICO ? ICO(n, s) : ''; }

  /* ============================================================
     IL CONTENUTO — uno solo, per tutte e dieci
     ============================================================ */

  var C = {
    ora: '14:12',
    sveglia: '07:30', letto: '23:30',
    /* la cosa che conta adesso */
    mit: 'Confrontare piani telefonici',
    mitArea: 'Finanze', mitAreaId: 'finanze', mitOra: '15:00', mitDur: '45 min',
    fatte: 1, totali: 2,
    /* il resto della giornata */
    blocchi: [
      { t: 'Ripasso flashcard', da: '09:00', a: '09:40', area: 'studio', fatto: true },
      { t: 'Leggere il libro di esercizi di Analisi 1', da: '11:15', a: '12:30', area: 'studio', fatto: false },
      { t: 'Confrontare piani telefonici', da: '15:00', a: '15:45', area: 'finanze', fatto: false, adesso: false },
      { t: 'Camminata / movimento', da: '18:30', a: '19:10', area: 'salute', fatto: false }
    ],
    senzaOra: [{ t: 'Mettere su Vinted i pantaloni', area: 'altro' }],
    pasti: ['08:10', '13:00', '20:00'],
    abitudini: [
      { t: 'Leggere 20 minuti', fatta: false, serie: 0, area: 'salute' },
      { t: 'Camminata / movimento', fatta: true, serie: 3, area: 'salute' },
      { t: 'Ripasso flashcard', fatta: false, serie: 0, area: 'studio', giorni: 'lun mer gio' }
    ],
    /* le cose da fare, con la loro fascia di importanza */
    prima: [
      { t: 'Consegnare il modulo ISEE', area: 'finanze', stato: 'ritardo', nota: 'scaduta 2 giorni fa' },
      { t: 'Recuperare i corsi di ingegneria gestionale', area: 'studio', passi: [1, 3], nota: 'già cominciato' },
      { t: 'Scrivere i primi 30 script per Agorà', area: 'founder', passi: [1, 4], nota: 'già cominciato' }
    ],
    altre: [
      { t: 'Studiare le risposte per l’OFA di inglese', area: 'studio' },
      { t: 'Trovare lavoro per agosto', area: 'lavoro', stato: 'attesa', nota: 'entro tra 20 giorni' },
      { t: 'Leggere 1 ora al giorno un libro personale', area: 'salute' },
      { t: 'Confrontare iPhone 15 Pro e GH5', area: 'altro', stato: 'agenda', nota: 'in agenda domani' },
      { t: 'Mettere su Vinted i pantaloni', area: 'altro' },
      { t: 'Scrivere i primi 30 script per Atlas', area: 'founder' }
    ],
    ferme: 3,
    aree: [
      { id: 'studio', nome: 'Studio', n: 3 }, { id: 'salute', nome: 'Salute', n: 1 },
      { id: 'founder', nome: 'Founder', n: 2 }, { id: 'lavoro', nome: 'Lavoro', n: 1 },
      { id: 'finanze', nome: 'Finanze', n: 1 }, { id: 'altro', nome: 'Altro', n: 2 }
    ],
    metriche: [
      { eti: 'Costanza', num: '78', suf: '%', delta: '+6', nota: 'ultimi 14 giorni' },
      { eti: 'Serie più lunga', num: '12', suf: ' gg', delta: '', nota: 'camminata' }
    ],
    pagine: [
      { id: 'oggi', nome: 'Oggi', ico: 'target' },
      { id: 'giornata', nome: 'Giornata', ico: 'clock' },
      { id: 'attivita', nome: 'Attività', ico: 'lista', badge: 6 },
      { id: 'rituali', nome: 'Rituali', ico: 'sun' },
      { id: 'panoramica', nome: 'Panoramica', ico: 'dashboard' }
    ]
  };

  /* posizione di un orario nella giornata, in percentuale (07:30 → 23:30) */
  function pc(hhmm) {
    var p = hhmm.split(':'), m = +p[0] * 60 + +p[1];
    var a = 7 * 60 + 30, b = 23 * 60 + 30;
    return Math.max(0, Math.min(100, (m - a) / (b - a) * 100));
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* ============================================================
     1. UNA COSA SOLA
     Posizione: se la testa salta, lo schermo non deve offrire niente
     su cui saltare. Nessuna navigazione visibile, nessuna lista,
     nessun numero: una cosa, e come farla. Tutto il resto sta dietro
     un gesto. Attività è un mazzo che si scorre una carta per volta.
     ============================================================ */
  var D1 = {
    id: 'unacosa', nome: 'Una cosa sola',
    stanza: 'Niente su cui saltare: una cosa alla volta, a schermo pieno. La navigazione non si vede finché non la cerchi.',
    oggi: function () {
      return '<div class="u1">' +
        '<button class="u1-menu" aria-label="Apri il menu">' + I('dots', 20) + '</button>' +
        '<div class="u1-centro">' +
          '<p class="u1-quando">tra 48 minuti</p>' +
          '<h1 class="u1-cosa">' + esc(C.mit) + '</h1>' +
          '<p class="u1-dove">' + esc(C.mitArea) + ' · ' + C.mitDur + '</p>' +
          '<button class="u1-fatto">Fatto</button>' +
          '<div class="u1-sotto"><button>Non adesso</button><button>Cambia</button></div>' +
        '</div>' +
        '<p class="u1-coda">poi niente, per oggi</p>' +
      '</div>';
    },
    attivita: function () {
      return '<div class="u1">' +
        '<button class="u1-menu" aria-label="Apri il menu">' + I('dots', 20) + '</button>' +
        '<div class="u1-centro">' +
          '<p class="u1-quando">9 cose da fare · questa è la prima</p>' +
          '<h1 class="u1-cosa">' + esc(C.prima[0].t) + '</h1>' +
          '<p class="u1-dove">scaduta 2 giorni fa</p>' +
          '<div class="u1-scelte"><button class="u1-fatto u1-piccolo">Oggi</button>' +
            '<button class="u1-fatto u1-piccolo u1-vuoto">Domani</button></div>' +
          '<div class="u1-sotto"><button>Salta</button><button>Butta</button></div>' +
        '</div>' +
        '<div class="u1-mazzo"><i></i><i></i><i></i><span>altre 8 sotto</span></div>' +
      '</div>';
    }
  };

  /* ============================================================
     2. IL QUADERNO
     Posizione: la app non deve sembrare un software da configurare, ma
     il quaderno su cui già scrivi. Nessun riquadro, nessun pulsante
     pieno: righe, margini, segni a mano. Le azioni sono segni sul
     foglio. La navigazione è l'indice nel margine.
     ============================================================ */
  var D2 = {
    id: 'quaderno', nome: 'Il quaderno',
    stanza: 'Non un software: il tuo quaderno. Righe, margini, segni a penna. Le azioni sono segni sul foglio, la navigazione è l’indice nel margine.',
    oggi: function () {
      var righe = C.blocchi.map(function (b) {
        return '<li class="q-riga' + (b.fatto ? ' q-fatta' : '') + '">' +
          '<span class="q-ora">' + b.da + '</span>' +
          '<span class="q-testo">' + esc(b.t) + '</span>' +
          '<span class="q-segno">' + (b.fatto ? '✓' : '') + '</span></li>';
      }).join('');
      var senza = C.senzaOra.map(function (b) {
        return '<li class="q-riga q-noora"><span class="q-ora">—</span><span class="q-testo">' + esc(b.t) + '</span><span class="q-segno"></span></li>';
      }).join('');
      return '<div class="q">' +
        '<aside class="q-indice"><b>LifeMax</b>' +
          C.pagine.map(function (p, i) { return '<a class="' + (p.id === 'oggi' ? 'q-qui' : '') + '"><i>' + (i + 1) + '</i>' + p.nome + '</a>'; }).join('') +
        '</aside>' +
        '<div class="q-foglio">' +
          '<header class="q-testa"><h1>Martedì 28</h1><span>sveglia ' + C.sveglia + ' · a letto ' + C.letto + '</span></header>' +
          '<p class="q-mano">La cosa che conta oggi</p>' +
          '<h2 class="q-mit">' + esc(C.mit) + '<span class="q-ora-mit">alle ' + C.mitOra + '</span></h2>' +
          '<hr class="q-filo">' +
          '<p class="q-mano">Il resto della giornata</p>' +
          '<ul class="q-lista">' + righe + senza + '</ul>' +
          '<hr class="q-filo">' +
          '<p class="q-mano">Da ripetere</p>' +
          '<ul class="q-lista q-abit">' + C.abitudini.map(function (h) {
            return '<li class="q-riga' + (h.fatta ? ' q-fatta' : '') + '"><span class="q-ora">○</span><span class="q-testo">' + esc(h.t) +
              (h.serie ? ' <em>' + h.serie + ' di fila</em>' : '') + '</span><span class="q-segno">' + (h.fatta ? '✓' : '') + '</span></li>';
          }).join('') + '</ul>' +
          '<p class="q-nota">1 di 2 fatte. Domani si riparte.</p>' +
        '</div>' +
      '</div>';
    },
    attivita: function () {
      function grp(tit, voci) {
        return '<p class="q-mano">' + tit + '</p><ul class="q-lista">' + voci.map(function (b) {
          return '<li class="q-riga"><span class="q-ora">·</span><span class="q-testo">' + esc(b.t) +
            (b.nota ? ' <em>' + esc(b.nota) + '</em>' : '') + '</span><span class="q-segno">→</span></li>';
        }).join('') + '</ul>';
      }
      return '<div class="q">' +
        '<aside class="q-indice"><b>LifeMax</b>' +
          C.pagine.map(function (p, i) { return '<a class="' + (p.id === 'attivita' ? 'q-qui' : '') + '"><i>' + (i + 1) + '</i>' + p.nome + '</a>'; }).join('') +
        '</aside>' +
        '<div class="q-foglio">' +
          '<header class="q-testa"><h1>Da fare</h1><span>9 cose · 3 ferme da un po’</span></header>' +
          '<form class="q-scrivi"><input type="text" placeholder="scrivi qui e va in fondo alla lista…" aria-label="Aggiungi"><button>segna</button></form>' +
          grp('Prima queste', C.prima) +
          '<hr class="q-filo">' +
          grp('Le altre', C.altre.slice(0, 4)) +
          '<p class="q-nota">Altre 2 più giù. E 3 ferme da un po’, in fondo al quaderno.</p>' +
        '</div>' +
      '</div>';
    }
  };

  /* ============================================================
     3. LA LINEA DEL GIORNO
     Posizione: l'unico ordine che significa qualcosa è il tempo. Non
     liste: una spina verticale con le ore, le cose attaccate dove
     cadono, e un vassoio laterale con quelle senza orario da
     trascinare sulla spina.
     ============================================================ */
  var D3 = {
    id: 'linea', nome: 'La linea del giorno',
    stanza: 'L’unico ordine che significa qualcosa è il tempo. Le cose stanno attaccate all’ora in cui cadono, non in una lista; quelle senza orario aspettano in un vassoio.',
    oggi: function () {
      var nodi = C.blocchi.map(function (b) {
        return '<div class="l-nodo' + (b.fatto ? ' l-fatto' : '') + '" style="--y:' + pc(b.da).toFixed(1) + '">' +
          '<i class="l-punto l-a-' + b.area + '"></i>' +
          '<div class="l-carta"><b>' + b.da + '–' + b.a + '</b><span>' + esc(b.t) + '</span></div></div>';
      }).join('');
      var pasti = C.pasti.map(function (p) { return '<i class="l-pasto" style="--y:' + pc(p).toFixed(1) + '"></i>'; }).join('');
      return '<div class="l">' +
        '<header class="l-testa"><b>Martedì 28</b><span>' + C.ora + '</span>' +
          '<nav>' + C.pagine.map(function (p) { return '<a class="' + (p.id === 'oggi' ? 'l-qui' : '') + '">' + p.nome + '</a>'; }).join('') + '</nav></header>' +
        '<div class="l-corpo">' +
          '<div class="l-spina">' +
            '<span class="l-cima">' + C.sveglia + '</span><span class="l-fondo">' + C.letto + '</span>' +
            '<div class="l-asse"></div>' + pasti + nodi +
            '<div class="l-adesso" style="--y:' + pc(C.ora).toFixed(1) + '"><b>' + C.ora + '</b></div>' +
          '</div>' +
          '<aside class="l-vassoio"><p class="l-eti">Senza orario · trascina sulla linea</p>' +
            C.senzaOra.concat(C.prima.slice(0, 2)).map(function (b) {
              return '<div class="l-tessera l-a-' + b.area + '">' + esc(b.t) + '</div>';
            }).join('') +
            '<p class="l-eti l-eti2">Fatto oggi</p><div class="l-conta"><b>1</b> di 2 · 1 abitudine su 3</div>' +
          '</aside>' +
        '</div>' +
      '</div>';
    },
    attivita: function () {
      function col(tit, voci, cls) {
        return '<div class="l-colonna ' + cls + '"><p class="l-eti">' + tit + ' <em>' + voci.length + '</em></p>' +
          voci.map(function (b) {
            return '<div class="l-tessera l-a-' + b.area + '">' + esc(b.t) +
              (b.nota ? '<i>' + esc(b.nota) + '</i>' : '') + '</div>';
          }).join('') + '</div>';
      }
      return '<div class="l">' +
        '<header class="l-testa"><b>Da fare</b><span>9</span>' +
          '<nav>' + C.pagine.map(function (p) { return '<a class="' + (p.id === 'attivita' ? 'l-qui' : '') + '">' + p.nome + '</a>'; }).join('') + '</nav></header>' +
        '<div class="l-binari">' +
          col('Oggi', [C.blocchi[2]], 'l-oggi') +
          col('Domani', [C.altre[3]], 'l-domani') +
          col('Questa settimana', C.prima, 'l-sett') +
          col('Senza data', C.altre.slice(0, 3), 'l-senza') +
        '</div>' +
        '<footer class="l-piede"><input type="text" placeholder="Aggiungi e trascina in una colonna…" aria-label="Aggiungi"><button>Aggiungi</button></footer>' +
      '</div>';
    }
  };

  /* ============================================================
     4. SEMAFORO
     Posizione: non devo leggere per sapere cos'è urgente. Tre bande di
     colore — adesso, poi, dopo — e le cose stanno dentro la banda che
     le riguarda. Niente schede: le zone di colore sono il contenitore.
     ============================================================ */
  var D4 = {
    id: 'semaforo', nome: 'Semaforo',
    stanza: 'Non devo leggere per sapere cos’è urgente. Tre bande di colore — adesso, poi, dopo — e le cose vivono dentro la banda che le riguarda.',
    oggi: function () {
      return '<div class="s">' +
        '<div class="s-rail">' + C.pagine.map(function (p) {
          return '<a class="' + (p.id === 'oggi' ? 's-qui' : '') + '" title="' + p.nome + '">' + I(p.ico, 20) + '</a>';
        }).join('') + '</div>' +
        '<div class="s-bande">' +
          '<section class="s-banda s-rosso">' +
            '<h2>Adesso</h2>' +
            '<p class="s-grande">' + esc(C.mit) + '</p>' +
            '<p class="s-info">' + C.mitOra + ' · ' + C.mitDur + ' · ' + C.mitArea + '</p>' +
            '<button class="s-btn">Fatto</button>' +
          '</section>' +
          '<section class="s-banda s-giallo">' +
            '<h2>Poi, oggi</h2>' +
            '<ul>' + C.blocchi.slice(3).concat(C.senzaOra).map(function (b) {
              return '<li>' + esc(b.t) + (b.da ? '<span>' + b.da + '</span>' : '<span>quando capita</span>') + '</li>';
            }).join('') + '</ul>' +
          '</section>' +
          '<section class="s-banda s-verde">' +
            '<h2>Fatto</h2>' +
            '<ul>' + C.blocchi.filter(function (b) { return b.fatto; }).concat(C.abitudini.filter(function (h) { return h.fatta; })).map(function (b) {
              return '<li>' + esc(b.t) + '<span>✓</span></li>';
            }).join('') + '</ul>' +
            '<p class="s-info">1 di 2 azioni · 1 abitudine su 3</p>' +
          '</section>' +
        '</div>' +
      '</div>';
    },
    attivita: function () {
      function banda(cls, tit, voci, coda) {
        return '<section class="s-banda ' + cls + '"><h2>' + tit + ' <em>' + voci.length + '</em></h2><ul>' +
          voci.map(function (b) { return '<li>' + esc(b.t) + '<span>' + (b.nota ? esc(b.nota) : '→') + '</span></li>'; }).join('') +
          '</ul>' + (coda ? '<p class="s-info">' + coda + '</p>' : '') + '</section>';
      }
      return '<div class="s">' +
        '<div class="s-rail">' + C.pagine.map(function (p) {
          return '<a class="' + (p.id === 'attivita' ? 's-qui' : '') + '" title="' + p.nome + '">' + I(p.ico, 20) + '</a>';
        }).join('') + '</div>' +
        '<div class="s-bande">' +
          '<form class="s-scrivi"><input type="text" placeholder="Aggiungi una cosa da fare…" aria-label="Aggiungi"><button class="s-btn s-btn-mini">Aggiungi</button></form>' +
          banda('s-rosso', 'In ritardo', [C.prima[0]]) +
          banda('s-giallo', 'Da fare', C.prima.slice(1).concat(C.altre.slice(0, 3))) +
          banda('s-grigio', 'Ferme da un po’', C.altre.slice(3), 'Nessuno le guarda da tre settimane.') +
        '</div>' +
      '</div>';
    }
  };

  /* ============================================================
     5. CONSOLE
     Posizione: per i giorni in cui non voglio essere accompagnato ma
     comandare. Tutto visibile insieme, due pannelli (elenco + dettaglio),
     barra dei comandi in cima, niente nascosto, niente animato.
     ============================================================ */
  var D5 = {
    id: 'console', nome: 'Console',
    stanza: 'Per i giorni in cui non vuoi essere accompagnato ma comandare: tutto visibile insieme, due pannelli, barra dei comandi, niente nascosto.',
    oggi: function () {
      var righe = C.blocchi.map(function (b, i) {
        return '<tr class="' + (i === 2 ? 'c-sel' : '') + (b.fatto ? ' c-ok' : '') + '"><td class="c-t">' + b.da + '</td>' +
          '<td class="c-n">' + esc(b.t) + '</td><td class="c-a">' + b.area + '</td>' +
          '<td class="c-s">' + (b.fatto ? 'fatta' : 'aperta') + '</td></tr>';
      }).join('');
      return '<div class="c">' +
        '<div class="c-barra"><span class="c-logo">lifemax</span>' +
          '<code class="c-cmd">:oggi</code>' +
          '<span class="c-vie">' + C.pagine.map(function (p) { return '<a class="' + (p.id === 'oggi' ? 'c-qui' : '') + '">' + p.nome.toLowerCase() + '</a>'; }).join('') + '</span>' +
          '<span class="c-stato">1/2 · 14:12 · salvato</span></div>' +
        '<div class="c-due">' +
          '<div class="c-lista">' +
            '<table><thead><tr><th>ora</th><th>cosa</th><th>area</th><th>stato</th></tr></thead><tbody>' + righe + '</tbody></table>' +
            '<div class="c-sez">senza orario</div>' +
            '<table><tbody>' + C.senzaOra.map(function (b) { return '<tr><td class="c-t">—</td><td class="c-n">' + esc(b.t) + '</td><td class="c-a">' + b.area + '</td><td class="c-s">aperta</td></tr>'; }).join('') + '</tbody></table>' +
            '<div class="c-sez">abitudini</div>' +
            '<table><tbody>' + C.abitudini.map(function (h) {
              return '<tr class="' + (h.fatta ? 'c-ok' : '') + '"><td class="c-t">' + (h.fatta ? '[x]' : '[ ]') + '</td><td class="c-n">' + esc(h.t) + '</td>' +
                '<td class="c-a">' + h.area + '</td><td class="c-s">' + (h.serie ? h.serie + 'gg' : '—') + '</td></tr>';
            }).join('') + '</tbody></table>' +
          '</div>' +
          '<div class="c-dett">' +
            '<div class="c-dett-testa">' + esc(C.mit) + '</div>' +
            '<dl><dt>quando</dt><dd>' + C.mitOra + ' → 15:45</dd>' +
              '<dt>durata</dt><dd>' + C.mitDur + '</dd>' +
              '<dt>area</dt><dd>' + C.mitArea + '</dd>' +
              '<dt>xp</dt><dd>+10</dd></dl>' +
            '<div class="c-azioni"><button class="c-b c-b-1">fatto <kbd>↵</kbd></button>' +
              '<button class="c-b">rinvia <kbd>r</kbd></button><button class="c-b">timer <kbd>t</kbd></button></div>' +
            '<div class="c-graf"><span class="c-eti">costanza 14gg</span>' +
              '<svg viewBox="0 0 100 26" preserveAspectRatio="none"><polyline points="0,20 14,17 28,19 42,11 56,13 70,6 84,8 100,3"/></svg>' +
              '<b>78%</b></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    },
    attivita: function () {
      var tutte = C.prima.map(function (b) { return { b: b, f: 'prima' }; })
        .concat(C.altre.map(function (b) { return { b: b, f: 'altre' }; }));
      return '<div class="c">' +
        '<div class="c-barra"><span class="c-logo">lifemax</span><code class="c-cmd">:dafare --tutte</code>' +
          '<span class="c-vie">' + C.pagine.map(function (p) { return '<a class="' + (p.id === 'attivita' ? 'c-qui' : '') + '">' + p.nome.toLowerCase() + '</a>'; }).join('') + '</span>' +
          '<span class="c-stato">9 aperte · 3 ferme</span></div>' +
        '<div class="c-due">' +
          '<div class="c-lista">' +
            '<div class="c-filtri">' + C.aree.map(function (a) { return '<button>' + a.nome.toLowerCase() + ' <em>' + a.n + '</em></button>'; }).join('') + '</div>' +
            '<table><thead><tr><th>fascia</th><th>cosa</th><th>area</th><th>nota</th></tr></thead><tbody>' +
            tutte.map(function (x, i) {
              return '<tr class="' + (i === 0 ? 'c-sel' : '') + '"><td class="c-t">' + x.f + '</td><td class="c-n">' + esc(x.b.t) + '</td>' +
                '<td class="c-a">' + x.b.area + '</td><td class="c-s">' + (x.b.nota ? esc(x.b.nota) : '—') + '</td></tr>';
            }).join('') + '</tbody></table>' +
          '</div>' +
          '<div class="c-dett">' +
            '<div class="c-dett-testa">' + esc(C.prima[0].t) + '</div>' +
            '<dl><dt>scadenza</dt><dd>2 giorni fa</dd><dt>area</dt><dd>finanze</dd><dt>età</dt><dd>18 giorni</dd></dl>' +
            '<div class="c-azioni"><button class="c-b c-b-1">→ oggi <kbd>o</kbd></button><button class="c-b">→ domani</button><button class="c-b">appunta</button></div>' +
            '<div class="c-nuovo"><input type="text" placeholder="nuova cosa da fare" aria-label="Aggiungi"><button class="c-b">+</button></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }
  };

  /* ============================================================
     6. LA PILA
     Posizione: la soddisfazione di spostare un oggetto. Le cose sono
     carte fisiche in una pila: quella sopra è quella che stai facendo,
     dietro si intravede la prossima, e finita se ne va davvero.
     ============================================================ */
  var D6 = {
    id: 'pila', nome: 'La pila',
    stanza: 'La soddisfazione di spostare un oggetto. Le cose sono carte in una pila: quella sopra è la tua, dietro si intravede la prossima, e finita se ne va davvero.',
    oggi: function () {
      return '<div class="p">' +
        '<header class="p-testa"><b>Oggi</b><span>1 di 2</span>' +
          '<nav>' + C.pagine.map(function (p) { return '<a class="' + (p.id === 'oggi' ? 'p-qui' : '') + '">' + p.nome + '</a>'; }).join('') + '</nav></header>' +
        '<div class="p-tavolo">' +
          '<div class="p-carta p-c3"></div>' +
          '<div class="p-carta p-c2"><span>' + esc(C.blocchi[3].t) + '</span></div>' +
          '<div class="p-carta p-c1">' +
            '<span class="p-tag p-a-' + C.mitAreaId + '">' + C.mitArea + '</span>' +
            '<h1>' + esc(C.mit) + '</h1>' +
            '<p>' + C.mitOra + ' · ' + C.mitDur + '</p>' +
            '<div class="p-mani"><button class="p-no">Rimanda</button><button class="p-si">Fatto ✓</button></div>' +
            '<p class="p-gesto">trascina a destra per fatto, a sinistra per rimandare</p>' +
          '</div>' +
        '</div>' +
        '<div class="p-fondo">' +
          '<div class="p-pilette">' +
            '<div class="p-piletta"><b>2</b><span>ancora oggi</span></div>' +
            '<div class="p-piletta p-fatte"><b>1</b><span>già fatte</span></div>' +
            '<div class="p-piletta"><b>3</b><span>abitudini</span></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    },
    attivita: function () {
      var mazzi = C.aree.slice(0, 4).map(function (a, i) {
        return '<div class="p-mazzo p-a-' + a.id + '" style="--i:' + i + '">' +
          '<div class="p-mazzo-carte"><i></i><i></i><i></i></div>' +
          '<b>' + a.nome + '</b><span>' + a.n + (a.n === 1 ? ' carta' : ' carte') + '</span></div>';
      }).join('');
      return '<div class="p">' +
        '<header class="p-testa"><b>Da fare</b><span>9 carte</span>' +
          '<nav>' + C.pagine.map(function (p) { return '<a class="' + (p.id === 'attivita' ? 'p-qui' : '') + '">' + p.nome + '</a>'; }).join('') + '</nav></header>' +
        '<div class="p-tavolo p-tavolo-mazzi">' +
          '<div class="p-carta p-c1 p-carta-mini">' +
            '<span class="p-tag p-a-finanze">Finanze</span>' +
            '<h1>' + esc(C.prima[0].t) + '</h1><p>scaduta 2 giorni fa</p>' +
            '<div class="p-mani"><button class="p-no">Domani</button><button class="p-si">Oggi →</button></div></div>' +
          '<div class="p-mazzi">' + mazzi + '</div>' +
        '</div>' +
        '<div class="p-fondo"><form class="p-scrivi"><input type="text" placeholder="Scrivi e finisce in cima alla pila…" aria-label="Aggiungi"><button class="p-si">Aggiungi</button></form></div>' +
      '</div>';
    }
  };

  /* ============================================================
     7. EDITORIALE
     Posizione: la tua giornata merita di essere composta, non
     elencata. Un titolo grande come in un giornale, un sommario, e le
     cose minori nelle colonne di fianco. Gerarchia tipografica al
     posto dei riquadri.
     ============================================================ */
  var D7 = {
    id: 'editoriale', nome: 'Editoriale',
    stanza: 'La tua giornata merita di essere composta, non elencata. Un titolo grande, un sommario, e il minore nelle colonne di fianco: gerarchia di caratteri al posto dei riquadri.',
    oggi: function () {
      return '<div class="e">' +
        '<header class="e-testata"><span class="e-data">Martedì 28 luglio</span>' +
          '<b class="e-nome">LifeMax</b>' +
          '<nav class="e-nav">' + C.pagine.map(function (p) { return '<a class="' + (p.id === 'oggi' ? 'e-qui' : '') + '">' + p.nome + '</a>'; }).join('') + '</nav></header>' +
        '<div class="e-griglia">' +
          '<article class="e-apertura">' +
            '<span class="e-rubrica">' + C.mitArea + ' · alle ' + C.mitOra + '</span>' +
            '<h1>' + esc(C.mit) + '</h1>' +
            '<p class="e-sommario">Quarantacinque minuti. È l’unica cosa che oggi ha davvero un peso: il resto può slittare senza conseguenze.</p>' +
            '<div class="e-azioni"><button class="e-btn">Fatto — vale 10 punti</button><button class="e-link">più tardi</button></div>' +
          '</article>' +
          '<aside class="e-spalla">' +
            '<h2 class="e-cappello">Nel resto del giorno</h2>' +
            '<ol class="e-agenda">' + C.blocchi.map(function (b) {
              return '<li' + (b.fatto ? ' class="e-fatta"' : '') + '><b>' + b.da + '</b> ' + esc(b.t) + '</li>';
            }).join('') + '</ol>' +
            '<h2 class="e-cappello">Da ripetere</h2>' +
            '<ul class="e-abit">' + C.abitudini.map(function (h) {
              return '<li' + (h.fatta ? ' class="e-fatta"' : '') + '>' + esc(h.t) + (h.serie ? ' <em>' + h.serie + ' di fila</em>' : '') + '</li>';
            }).join('') + '</ul>' +
          '</aside>' +
          '<section class="e-fascia">' +
            C.metriche.map(function (m) {
              return '<div class="e-dato"><b>' + m.num + '<i>' + m.suf + '</i></b><span>' + m.eti + '</span><small>' + m.nota + '</small></div>';
            }).join('') +
            '<div class="e-dato e-dato-larga"><b>' + C.fatte + '<i>/' + C.totali + '</i></b><span>azioni chiuse</span><small>una alla volta</small></div>' +
          '</section>' +
        '</div>' +
      '</div>';
    },
    attivita: function () {
      return '<div class="e">' +
        '<header class="e-testata"><span class="e-data">Archivio · 9 voci</span><b class="e-nome">Da fare</b>' +
          '<nav class="e-nav">' + C.pagine.map(function (p) { return '<a class="' + (p.id === 'attivita' ? 'e-qui' : '') + '">' + p.nome + '</a>'; }).join('') + '</nav></header>' +
        '<form class="e-scrivi"><input type="text" placeholder="Aggiungi una voce…" aria-label="Aggiungi"><button class="e-btn e-btn-mini">Aggiungi</button></form>' +
        '<div class="e-colonne">' +
          '<div class="e-col">' +
            '<h2 class="e-cappello e-cappello-forte">Prima queste</h2>' +
            C.prima.map(function (b, i) {
              return '<article class="e-voce' + (i === 0 ? ' e-voce-1' : '') + '"><h3>' + esc(b.t) + '</h3>' +
                '<p>' + (b.nota ? esc(b.nota) : '') + (b.passi ? ' · ' + b.passi[0] + ' di ' + b.passi[1] + ' passi' : '') + '</p>' +
                '<button class="e-link">porta in oggi →</button></article>';
            }).join('') +
          '</div>' +
          '<div class="e-col">' +
            '<h2 class="e-cappello">Le altre</h2>' +
            '<ul class="e-brevi">' + C.altre.map(function (b) {
              return '<li>' + esc(b.t) + (b.nota ? ' <em>' + esc(b.nota) + '</em>' : '') + '</li>';
            }).join('') + '</ul>' +
            '<p class="e-piede">In fondo: 3 voci ferme da più di tre settimane.</p>' +
          '</div>' +
        '</div>' +
      '</div>';
    }
  };

  /* ============================================================
     8. CRUSCOTTO
     Posizione: voglio lo stato delle cose in un colpo d'occhio, in
     numeri e quadranti, senza leggere frasi. La lista è uno strumento
     fra gli altri, non il centro.
     ============================================================ */
  var D8 = {
    id: 'cruscotto', nome: 'Cruscotto',
    stanza: 'Lo stato delle cose in un colpo d’occhio: quadranti e numeri, non frasi. La lista è uno strumento fra gli altri, non il centro.',
    oggi: function () {
      var giro = 62;
      return '<div class="k">' +
        '<div class="k-testa"><b>Oggi</b><span>' + C.ora + '</span>' +
          '<nav>' + C.pagine.map(function (p) { return '<a class="' + (p.id === 'oggi' ? 'k-qui' : '') + '">' + I(p.ico, 16) + p.nome + '</a>'; }).join('') + '</nav></div>' +
        '<div class="k-griglia">' +
          '<div class="k-str k-str-arco"><span class="k-eti">Giornata</span>' +
            '<div class="k-arco" style="--v:' + giro + '"><b>' + giro + '<i>%</i></b></div>' +
            '<span class="k-nota">' + C.sveglia + ' → ' + C.letto + '</span></div>' +
          '<div class="k-str k-str-focus"><span class="k-eti">Adesso</span>' +
            '<b class="k-focus">' + esc(C.mit) + '</b>' +
            '<span class="k-nota">' + C.mitOra + ' · ' + C.mitDur + ' · ' + C.mitArea + '</span>' +
            '<button class="k-btn">Fatto</button></div>' +
          '<div class="k-str"><span class="k-eti">Azioni</span><b class="k-num">' + C.fatte + '<i>/' + C.totali + '</i></b>' +
            '<div class="k-barra"><span style="width:50%"></span></div></div>' +
          '<div class="k-str"><span class="k-eti">Costanza</span><b class="k-num">78<i>%</i></b>' +
            '<svg class="k-spark" viewBox="0 0 100 26" preserveAspectRatio="none"><polyline points="0,20 14,17 28,19 42,11 56,13 70,6 84,8 100,3"/></svg></div>' +
          '<div class="k-str"><span class="k-eti">Serie</span>' +
            '<div class="k-anelli">' + C.abitudini.map(function (h) {
              return '<div class="k-anello' + (h.fatta ? ' k-on' : '') + '"><b>' + (h.serie || 0) + '</b><span>' + esc(h.t.split(' ')[0]) + '</span></div>';
            }).join('') + '</div></div>' +
          '<div class="k-str k-str-larga"><span class="k-eti">La giornata</span>' +
            '<div class="k-timeline">' +
              C.blocchi.map(function (b) {
                return '<i class="k-blk k-a-' + b.area + '" style="left:' + pc(b.da).toFixed(1) + '%;width:' + Math.max(4, pc(b.a) - pc(b.da)).toFixed(1) + '%" title="' + esc(b.t) + '"></i>';
              }).join('') +
              '<b class="k-now" style="left:' + pc(C.ora).toFixed(1) + '%"></b>' +
            '</div>' +
            '<div class="k-ore"><span>' + C.sveglia + '</span><span>' + C.letto + '</span></div></div>' +
          '<div class="k-str k-str-larga k-str-lista"><span class="k-eti">Da fare adesso</span>' +
            '<ul>' + C.blocchi.filter(function (b) { return !b.fatto; }).map(function (b) {
              return '<li><b>' + b.da + '</b>' + esc(b.t) + '</li>';
            }).join('') + '</ul></div>' +
        '</div>' +
      '</div>';
    },
    attivita: function () {
      return '<div class="k">' +
        '<div class="k-testa"><b>Da fare</b><span>9 aperte</span>' +
          '<nav>' + C.pagine.map(function (p) { return '<a class="' + (p.id === 'attivita' ? 'k-qui' : '') + '">' + I(p.ico, 16) + p.nome + '</a>'; }).join('') + '</nav></div>' +
        '<div class="k-griglia">' +
          '<div class="k-str"><span class="k-eti">In ritardo</span><b class="k-num k-rosso">1</b><span class="k-nota">da 2 giorni</span></div>' +
          '<div class="k-str"><span class="k-eti">Cominciate</span><b class="k-num">2</b><span class="k-nota">progetti a metà</span></div>' +
          '<div class="k-str"><span class="k-eti">Ferme</span><b class="k-num k-muto">3</b><span class="k-nota">oltre 3 settimane</span></div>' +
          '<div class="k-str"><span class="k-eti">Per area</span>' +
            '<div class="k-istog">' + C.aree.map(function (a) {
              return '<div class="k-col k-a-' + a.id + '"><i style="height:' + (a.n * 26) + '%"></i><span>' + a.nome.slice(0, 3) + '</span><b>' + a.n + '</b></div>';
            }).join('') + '</div></div>' +
          '<div class="k-str k-str-larga k-str-lista"><span class="k-eti">Prima queste</span>' +
            '<ul>' + C.prima.map(function (b) {
              return '<li><b>' + (b.passi ? b.passi[0] + '/' + b.passi[1] : '!') + '</b>' + esc(b.t) + '<em>' + (b.nota || '') + '</em></li>';
            }).join('') + '</ul>' +
            '<form class="k-scrivi"><input type="text" placeholder="Aggiungi…" aria-label="Aggiungi"><button class="k-btn k-btn-mini">+</button></form></div>' +
        '</div>' +
      '</div>';
    }
  };

  /* ============================================================
     9. CHIARO
     Posizione: niente deve competere con le parole. Nessun colore,
     nessuna icona, nessun bordo, nessuna scheda: una colonna stretta,
     molto respiro, un solo peso di carattere. Il contrario di un
     cruscotto.
     ============================================================ */
  var D9 = {
    id: 'chiaro', nome: 'Chiaro',
    stanza: 'Niente compete con le parole: nessun colore, nessuna icona, nessun bordo. Una colonna stretta, molto respiro, un carattere solo. Il contrario di un cruscotto.',
    oggi: function () {
      return '<div class="ch">' +
        '<nav class="ch-nav">' + C.pagine.map(function (p) { return '<a class="' + (p.id === 'oggi' ? 'ch-qui' : '') + '">' + p.nome + '</a>'; }).join('') + '</nav>' +
        '<div class="ch-colonna">' +
          '<p class="ch-occhio">Martedì, ' + C.ora + '</p>' +
          '<h1 class="ch-uno">' + esc(C.mit) + '</h1>' +
          '<p class="ch-riga">Alle ' + C.mitOra + ', quarantacinque minuti.</p>' +
          '<p class="ch-azione"><button>Fatto</button><button class="ch-secondo">più tardi</button></p>' +
          '<hr>' +
          '<p class="ch-occhio">Dopo</p>' +
          '<ul class="ch-lista">' + C.blocchi.slice(3).concat(C.senzaOra).map(function (b) {
            return '<li>' + (b.da ? b.da + ' — ' : '') + esc(b.t) + '</li>';
          }).join('') + '</ul>' +
          '<hr>' +
          '<p class="ch-occhio">Da ripetere</p>' +
          '<ul class="ch-lista ch-lista-abit">' + C.abitudini.map(function (h) {
            return '<li class="' + (h.fatta ? 'ch-fatta' : '') + '">' + esc(h.t) + (h.serie ? ' — ' + h.serie + ' di fila' : '') + '</li>';
          }).join('') + '</ul>' +
          '<hr>' +
          '<p class="ch-coda">Una fatta su due. La costanza dell’ultimo mese è al settantotto per cento.</p>' +
        '</div>' +
      '</div>';
    },
    attivita: function () {
      return '<div class="ch">' +
        '<nav class="ch-nav">' + C.pagine.map(function (p) { return '<a class="' + (p.id === 'attivita' ? 'ch-qui' : '') + '">' + p.nome + '</a>'; }).join('') + '</nav>' +
        '<div class="ch-colonna">' +
          '<p class="ch-occhio">Nove cose da fare</p>' +
          '<form class="ch-scrivi"><input type="text" placeholder="Scrivine una…" aria-label="Aggiungi"></form>' +
          '<h2 class="ch-due">Prima queste</h2>' +
          '<ul class="ch-lista ch-lista-grande">' + C.prima.map(function (b) {
            return '<li>' + esc(b.t) + (b.nota ? '<span>' + esc(b.nota) + '</span>' : '') + '</li>';
          }).join('') + '</ul>' +
          '<hr>' +
          '<h2 class="ch-due">Le altre</h2>' +
          '<ul class="ch-lista">' + C.altre.map(function (b) {
            return '<li>' + esc(b.t) + (b.nota ? ' — ' + esc(b.nota) : '') + '</li>';
          }).join('') + '</ul>' +
          '<hr>' +
          '<p class="ch-coda">Tre sono ferme da più di tre settimane. <button class="ch-secondo">guardale</button></p>' +
        '</div>' +
      '</div>';
    }
  };

  /* ============================================================
     10. NOTTURNO
     Posizione: quasi tutta la pianificazione avviene la sera, stanchi,
     al buio, a letto. Fondo profondo, nessuna luce che punge, accenti
     caldi e bassi, righe alte da colpire con il pollice mezzo addormentato.
     ============================================================ */
  var D10 = {
    id: 'notturno', nome: 'Notturno',
    stanza: 'Quasi tutta la pianificazione avviene la sera, stanchi, al buio. Fondo profondo, nessuna luce che punge, accenti caldi, righe alte da colpire mezzo addormentato.',
    oggi: function () {
      return '<div class="n">' +
        '<div class="n-testa"><b>Buonasera</b><span>' + C.ora + ' · resta poco</span></div>' +
        '<div class="n-corpo">' +
          '<section class="n-uno">' +
            '<span class="n-eti">Ancora una cosa</span>' +
            '<h1>' + esc(C.mit) + '</h1>' +
            '<p>' + C.mitOra + ' · ' + C.mitDur + '</p>' +
            '<button class="n-btn">Fatto</button>' +
            '<button class="n-btn n-btn-2">Sposta a domani</button>' +
          '</section>' +
          '<section class="n-lista"><span class="n-eti">Rimaste oggi</span>' +
            C.blocchi.slice(3).concat(C.senzaOra).map(function (b) {
              return '<button class="n-riga"><i></i><span>' + esc(b.t) + '</span><em>' + (b.da || 'senza ora') + '</em></button>';
            }).join('') +
          '</section>' +
          '<section class="n-lista"><span class="n-eti">Abitudini</span>' +
            C.abitudini.map(function (h) {
              return '<button class="n-riga' + (h.fatta ? ' n-fatta' : '') + '"><i></i><span>' + esc(h.t) + '</span>' +
                '<em>' + (h.serie ? h.serie + ' di fila' : '') + '</em></button>';
            }).join('') +
          '</section>' +
          '<p class="n-coda">Sonno previsto: 8h 20m. Chiudi qui, domani è pronto.</p>' +
        '</div>' +
        '<nav class="n-barra">' + C.pagine.map(function (p) {
          return '<a class="' + (p.id === 'oggi' ? 'n-qui' : '') + '">' + I(p.ico, 22) + '<span>' + p.nome + '</span></a>';
        }).join('') + '</nav>' +
      '</div>';
    },
    attivita: function () {
      return '<div class="n">' +
        '<div class="n-testa"><b>Da fare</b><span>9 · niente scade stanotte</span></div>' +
        '<div class="n-corpo">' +
          '<form class="n-scrivi"><input type="text" placeholder="Scrivila e dormici sopra…" aria-label="Aggiungi"><button class="n-btn n-btn-mini">Aggiungi</button></form>' +
          '<section class="n-lista"><span class="n-eti">Domani, se ce la fai</span>' +
            C.prima.map(function (b) {
              return '<button class="n-riga n-riga-alta"><i></i><span>' + esc(b.t) + (b.nota ? '<em>' + esc(b.nota) + '</em>' : '') + '</span></button>';
            }).join('') +
          '</section>' +
          '<section class="n-lista"><span class="n-eti">Quando capita</span>' +
            C.altre.slice(0, 4).map(function (b) {
              return '<button class="n-riga"><i></i><span>' + esc(b.t) + '</span></button>';
            }).join('') +
          '</section>' +
          '<p class="n-coda">Altre 2, e 3 ferme da un po’. Non stanotte.</p>' +
        '</div>' +
        '<nav class="n-barra">' + C.pagine.map(function (p) {
          return '<a class="' + (p.id === 'attivita' ? 'n-qui' : '') + '">' + I(p.ico, 22) + '<span>' + p.nome + '</span></a>';
        }).join('') + '</nav>' +
      '</div>';
    }
  };

  var DESIGN = [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10];
  DESIGN.forEach(function (d, i) { d.n = i + 1; });

  /* ============================================================
     LA VETRINA
     ============================================================ */

  function leggi(k, dif) { try { var v = localStorage.getItem(CHIAVE + '.' + k); return v == null ? dif : v; } catch (e) { return dif; } }
  function scrivi(k, v) { try { localStorage.setItem(CHIAVE + '.' + k, v); } catch (e) { /* ignora */ } }

  function montaIn(el) {
    var scelto = Math.min(10, Math.max(1, +leggi('n', 1) || 1));
    var schermo = leggi('schermo', 'oggi') === 'attivita' ? 'attivita' : 'oggi';
    var largo = leggi('largo', 'si') !== 'no';

    el.innerHTML =
      '<div id="lab-scelta">' +
        '<p class="lab-guida">Dieci modi diversi di costruire la stessa app, non dieci colori: cambia dove sta la ' +
        'navigazione, quanto vedi per volta, cosa viene prima. I contenuti sono identici in tutte, così il confronto è onesto. ' +
        'Guardale e dimmi il numero.</p>' +
        '<div class="lab-rail" role="tablist" aria-label="Dieci direzioni di design">' +
          DESIGN.map(function (d) {
            return '<button role="tab" class="lab-tab' + (d.n === scelto ? ' on' : '') + '" data-d="' + d.n + '" aria-selected="' + (d.n === scelto) + '">' +
              '<em>' + d.n + '</em><span>' + d.nome + '</span></button>';
          }).join('') +
        '</div>' +
        '<div class="lab-riga">' +
          '<div class="lab-titolo"><b id="lab-nome"></b><span id="lab-stanza"></span></div>' +
          '<div class="lab-comandi">' +
            '<div class="lab-seg" id="lab-schermo" role="group" aria-label="Quale schermata">' +
              '<button data-s="oggi" class="' + (schermo === 'oggi' ? 'on' : '') + '">Oggi</button>' +
              '<button data-s="attivita" class="' + (schermo === 'attivita' ? 'on' : '') + '">Attività</button>' +
            '</div>' +
            '<div class="lab-seg" id="lab-largo" role="group" aria-label="Larghezza dello schermo">' +
              '<button data-w="si" class="' + (largo ? 'on' : '') + '" title="Larghezza da monitor">' + I('dashboard', 14) + '</button>' +
              '<button data-w="no" class="' + (largo ? '' : 'on') + '" title="Larghezza da telefono">' + I('user', 14) + '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div id="lab-demo" data-design="" data-n="" data-schermo="" class="' + (largo ? '' : 'stretto') + '">' +
        '<div class="lab-telaio"><div class="lab-schermo" id="lab-schermo-corpo"></div></div>' +
      '</div>';

    var demo = el.querySelector('#lab-demo');
    var corpo = el.querySelector('#lab-schermo-corpo');
    var nome = el.querySelector('#lab-nome');
    var stanza = el.querySelector('#lab-stanza');

    function disegna(muoviFuoco) {
      var d = DESIGN[scelto - 1];
      demo.setAttribute('data-design', d.id);
      demo.setAttribute('data-n', String(scelto));
      demo.setAttribute('data-schermo', schermo);
      demo.classList.toggle('stretto', !largo);
      corpo.innerHTML = schermo === 'attivita' ? d.attivita() : d.oggi();
      nome.textContent = d.n + '. ' + d.nome;
      stanza.textContent = d.stanza;
      el.querySelectorAll('.lab-tab').forEach(function (t) {
        var on = +t.getAttribute('data-d') === scelto;
        t.classList.toggle('on', on);
        t.setAttribute('aria-selected', String(on));
        if (on) { t.scrollIntoView({ block: 'nearest', inline: 'nearest' }); if (muoviFuoco) t.focus({ preventScroll: true }); }
      });
      el.querySelectorAll('#lab-schermo [data-s]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-s') === schermo); });
      el.querySelectorAll('#lab-largo [data-w]').forEach(function (b) { b.classList.toggle('on', (b.getAttribute('data-w') === 'si') === largo); });
      scrivi('n', String(scelto)); scrivi('schermo', schermo); scrivi('largo', largo ? 'si' : 'no');
    }

    el.querySelectorAll('.lab-tab').forEach(function (t) {
      t.addEventListener('click', function () { scelto = +t.getAttribute('data-d'); disegna(); });
    });
    el.querySelectorAll('#lab-schermo [data-s]').forEach(function (b) {
      b.addEventListener('click', function () { schermo = b.getAttribute('data-s'); disegna(); });
    });
    el.querySelectorAll('#lab-largo [data-w]').forEach(function (b) {
      b.addEventListener('click', function () { largo = b.getAttribute('data-w') === 'si'; disegna(); });
    });
    el.querySelector('.lab-rail').addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); scelto = scelto === 10 ? 1 : scelto + 1; disegna(true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); scelto = scelto === 1 ? 10 : scelto - 1; disegna(true); }
    });

    disegna();
  }

  window.LM_LAB = { montaIn: montaIn, DESIGN: DESIGN, CONTENUTO: C };
})();
