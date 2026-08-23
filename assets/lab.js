/* ============================================================
   LifeMax — Laboratorio di design, versione 3

   Le due versioni precedenti sbagliavano la premessa, non i dettagli.
   La prima cambiava solo la vernice sopra un markup unico. La seconda
   partiva da «posizioni» concettuali — una console, un editoriale, un
   semaforo — e finiva per essere stile senza uso: per capire cosa fare
   e cosa cliccare bisognava leggere ogni parola.

   Questa versione parte da dove doveva partire: sono dieci interfacce
   normali, del tipo che un prodotto vero spedisce. Cambiano le cose
   che cambiano davvero in un'app — dove sta la navigazione, quanto è
   densa la lista, schede o righe, chiaro o scuro, una colonna o due,
   quanto è grande il tocco — e non cambiano mai le regole di base:

   — ogni schermata ha un titolo che dice dove sei;
   — c'è UN pulsante pieno per volta, ed è la cosa che conviene fare;
   — quello che si clicca ha la forma di un pulsante, e le spunte sono
     caselle vere;
   — ogni voce ha la stessa struttura: casella, nome, area, quando;
   — si capisce in un colpo d'occhio, senza leggere tutto.

   Il CONTENUTO è identico in tutte e dieci, così il confronto è
   onesto: le stesse attività, le stesse ore, gli stessi numeri.

   ISOLAMENTO: lo stile sta in assets/lab.css, ogni regola annidata
   sotto #lab-demo o #lab-scelta, e il foglio si carica solo aprendo
   questa pagina. C'è un test che lo verifica riga per riga.
   ============================================================ */

'use strict';

(function () {

  var CHIAVE = 'lifemax.lab3';

  /* Le misure sono i cinque gradini della scala (11/13/15/18/26) come in tutto
     il resto: `ICO` ci tira comunque il numero più vicino, quindi qui c'erano
     dei 12, 14, 16, 20 e 22 che il file diceva e nessuno disegnava. */
  function I(n, s) { return window.ICO ? ICO(n, s) : ''; }
  /* Il marchio, non un'icona. Prima qui stava la freccia in salita, che in
     tutta l'app vuol dire «l'andamento nel tempo»: nei mock faceva da logo, e
     un mock che mostra un marchio che non esiste non serve a confrontare
     niente. */
  function L(s) { return window.LOGO ? LOGO(s) : ''; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* ============================================================
     IL CONTENUTO — uno solo, per tutte e dieci
     ============================================================ */

  var C = {
    ora: '14:12',
    giorno: 'Giovedì 13 agosto',
    /* la cosa che conta adesso */
    mit: 'Confrontare piani telefonici',
    mitArea: 'Finanze', mitOra: '15:00 – 15:45', mitTra: 'tra 48 minuti',
    fatte: 1, totali: 2,
    /* la giornata */
    blocchi: [
      { t: 'Ripasso flashcard', da: '09:00', a: '09:40', area: 'Studio', fatto: true },
      { t: 'Leggere il libro di Analisi 1', da: '11:15', a: '12:30', area: 'Studio', fatto: false },
      { t: 'Confrontare piani telefonici', da: '15:00', a: '15:45', area: 'Finanze', fatto: false, adesso: true },
      { t: 'Camminata', da: '18:30', a: '19:10', area: 'Salute', fatto: false }
    ],
    senzaOra: [{ t: 'Mettere su Vinted i pantaloni', area: 'Altro' }],
    abitudini: [
      { t: 'Leggere 20 minuti', fatta: false, serie: 0 },
      { t: 'Camminata', fatta: true, serie: 3 },
      { t: 'Ripasso flashcard', fatta: false, serie: 0 }
    ],
    /* le cose da fare */
    prima: [
      { t: 'Consegnare il modulo ISEE', area: 'Finanze', quando: 'Scaduta 2 giorni fa', urgente: true },
      { t: 'Recuperare i corsi di gestionale', area: 'Studio', quando: 'Passo 1 di 3' },
      { t: 'Scrivere i primi 30 script', area: 'Founder', quando: 'Passo 1 di 4' }
    ],
    poi: [
      { t: 'Studiare le risposte per l’OFA', area: 'Studio', quando: '' },
      { t: 'Trovare lavoro per agosto', area: 'Lavoro', quando: 'Tra 20 giorni' },
      { t: 'Confrontare iPhone 15 Pro e GH5', area: 'Altro', quando: 'In agenda domani' }
    ],
    altre: 3, ferme: 3, totaleDaFare: 9,
    aree: ['Studio', 'Salute', 'Founder', 'Lavoro', 'Finanze', 'Altro'],
    pagine: [
      { id: 'oggi', nome: 'Oggi', ico: 'target' },
      { id: 'giornata', nome: 'Giornata', ico: 'giornata' },
      { id: 'attivita', nome: 'Attività', ico: 'lista', badge: 9 },
      { id: 'rituali', nome: 'Rituali', ico: 'rituali' },
      { id: 'panoramica', nome: 'Panoramica', ico: 'dashboard' }
    ]
  };

  /* posizione di un orario nella giornata, in percentuale (07:30 → 23:30) */
  function pc(hhmm) {
    var p = hhmm.split(':'), m = +p[0] * 60 + +p[1];
    var a = 7 * 60 + 30, b = 23 * 60 + 30;
    return Math.max(0, Math.min(100, (m - a) / (b - a) * 100));
  }
  function perc() { return Math.round(C.fatte / C.totali * 100); }

  /* ============================================================
     1. SCHEDE — il taglio classico: barra laterale a sinistra,
     schede bianche su fondo tenue, una scheda per argomento.
     ============================================================ */
  var D1 = {
    id: 'schede', nome: 'Schede',
    stanza: 'Barra laterale a sinistra, schede bianche su fondo tenue, un pulsante pieno per schermata. Il taglio più riconoscibile: si sa dove guardare senza impararlo.',
    oggi: function () {
      return '<div class="s1">' +
        '<aside class="s1-nav">' +
          '<div class="s1-marchio">' + L(18) + '<b>LifeMax</b></div>' +
          '<nav>' + C.pagine.map(function (p) {
            return '<a class="s1-voce' + (p.id === 'oggi' ? ' qui' : '') + '">' + I(p.ico, 18) + '<span>' + p.nome + '</span>' +
              (p.badge ? '<em>' + p.badge + '</em>' : '') + '</a>';
          }).join('') + '</nav>' +
        '</aside>' +
        '<div class="s1-corpo">' +
          '<header class="s1-testa">' +
            '<div><h2 class="lab-h">Oggi</h2><p>' + C.giorno + ' · ' + C.ora + '</p></div>' +
            '<button class="s1-btn">' + I('plus', 15) + 'Aggiungi</button>' +
          '</header>' +
          '<section class="s1-adesso">' +
            '<p class="s1-eti">Adesso · ' + C.mitTra + '</p>' +
            '<h2>' + esc(C.mit) + '</h2>' +
            '<p class="s1-sotto">' + C.mitOra + ' · ' + C.mitArea + '</p>' +
            '<div class="s1-azioni">' +
              '<button class="s1-btn s1-pieno">' + I('check', 15) + 'Fatto</button>' +
              '<button class="s1-btn">Rinvia</button>' +
            '</div>' +
          '</section>' +
          '<div class="s1-griglia">' +
            '<section class="s1-card">' +
              '<div class="s1-cardtesta"><h3>La giornata</h3><span>' + C.fatte + ' di ' + C.totali + '</span></div>' +
              '<div class="s1-barra"><i style="width:' + perc() + '%"></i></div>' +
              C.blocchi.map(function (b) {
                return '<label class="s1-riga' + (b.adesso ? ' ades' : '') + '">' +
                  '<input type="checkbox"' + (b.fatto ? ' checked' : '') + '>' +
                  '<span class="s1-orario">' + b.da + '</span>' +
                  '<span class="s1-nome">' + esc(b.t) + '</span>' +
                  '<span class="s1-tag">' + b.area + '</span></label>';
              }).join('') +
              C.senzaOra.map(function (b) {
                return '<label class="s1-riga"><input type="checkbox">' +
                  '<span class="s1-orario s1-vuoto">—</span>' +
                  '<span class="s1-nome">' + esc(b.t) + '</span>' +
                  '<span class="s1-tag">' + b.area + '</span></label>';
              }).join('') +
            '</section>' +
            '<section class="s1-card">' +
              '<div class="s1-cardtesta"><h3>Abitudini</h3><span>1 di 3</span></div>' +
              C.abitudini.map(function (a) {
                return '<label class="s1-riga"><input type="checkbox"' + (a.fatta ? ' checked' : '') + '>' +
                  '<span class="s1-nome">' + esc(a.t) + '</span>' +
                  (a.serie ? '<span class="s1-serie">' + I('flame', 13) + a.serie + '</span>' : '') + '</label>';
              }).join('') +
            '</section>' +
          '</div>' +
        '</div>' +
      '</div>';
    },
    attivita: function () {
      return '<div class="s1">' +
        '<aside class="s1-nav">' +
          '<div class="s1-marchio">' + L(18) + '<b>LifeMax</b></div>' +
          '<nav>' + C.pagine.map(function (p) {
            return '<a class="s1-voce' + (p.id === 'attivita' ? ' qui' : '') + '">' + I(p.ico, 18) + '<span>' + p.nome + '</span>' +
              (p.badge ? '<em>' + p.badge + '</em>' : '') + '</a>';
          }).join('') + '</nav>' +
        '</aside>' +
        '<div class="s1-corpo">' +
          '<header class="s1-testa">' +
            '<div><h2 class="lab-h">Attività</h2><p>' + C.totaleDaFare + ' cose da fare</p></div>' +
          '</header>' +
          '<form class="s1-agg"><input type="text" placeholder="Aggiungi una cosa da fare">' +
            '<button class="s1-btn s1-pieno" type="submit">' + I('plus', 15) + 'Aggiungi</button></form>' +
          '<div class="s1-chip">' + ['Tutte'].concat(C.aree).map(function (a, i) {
            return '<button class="' + (i === 0 ? 'on' : '') + '">' + a + '</button>';
          }).join('') + '</div>' +
          '<section class="s1-card">' +
            '<div class="s1-cardtesta"><h3>Importanti</h3><span>3</span></div>' +
            C.prima.map(function (b) {
              return '<div class="s1-cosa">' +
                '<input type="checkbox" aria-label="Segna fatta">' +
                '<div class="s1-cosatesto"><b>' + esc(b.t) + '</b>' +
                  '<span class="s1-meta"><i class="s1-tag">' + b.area + '</i>' +
                  (b.quando ? '<i class="s1-quando' + (b.urgente ? ' rosso' : '') + '">' + b.quando + '</i>' : '') + '</span></div>' +
                '<button class="s1-btn s1-mini">Fai oggi</button>' +
                '<button class="s1-icona" aria-label="Altre opzioni">' + I('altreOpzioni', 15) + '</button>' +
              '</div>';
            }).join('') +
          '</section>' +
          '<section class="s1-card s1-tenue">' +
            '<div class="s1-cardtesta"><h3>Altre</h3><span>3</span></div>' +
            C.poi.map(function (b) {
              return '<div class="s1-cosa">' +
                '<input type="checkbox" aria-label="Segna fatta">' +
                '<div class="s1-cosatesto"><b>' + esc(b.t) + '</b>' +
                  '<span class="s1-meta"><i class="s1-tag">' + b.area + '</i>' +
                  (b.quando ? '<i class="s1-quando">' + b.quando + '</i>' : '') + '</span></div>' +
                '<button class="s1-icona" aria-label="Altre opzioni">' + I('altreOpzioni', 15) + '</button>' +
              '</div>';
            }).join('') +
            '<button class="s1-altre">' + I('chevronGiu', 15) + 'Mostra le altre ' + C.altre + '</button>' +
          '</section>' +
          '<p class="s1-piede">' + C.ferme + ' inattive da tre settimane. <button class="s1-link">Rivedile</button></p>' +
        '</div>' +
      '</div>';
    }
  };

  /* ============================================================
     2. ELENCO COMPATTO — righe fitte, tutto in vista, barra
     laterale sottile. Per chi vuole vedere molto senza scorrere.
     ============================================================ */
  var D2 = {
    id: 'compatto', nome: 'Elenco compatto',
    stanza: 'Righe fitte separate da una linea, niente ombre, barra laterale sottile. Vedi molto insieme e scorri poco: utile quando la giornata è piena.',
    oggi: function () {
      return '<div class="c2">' +
        '<aside class="c2-nav">' + C.pagine.map(function (p) {
          return '<a class="' + (p.id === 'oggi' ? 'qui' : '') + '">' + I(p.ico, 16) + '<span>' + p.nome + '</span>' +
            (p.badge ? '<em>' + p.badge + '</em>' : '') + '</a>';
        }).join('') + '</aside>' +
        '<div class="c2-corpo">' +
          '<header class="c2-testa"><h2 class="lab-h">Oggi</h2>' +
            '<span class="c2-data">' + C.giorno + '</span>' +
            '<span class="c2-avanz">' + C.fatte + '/' + C.totali + '<i><b style="width:' + perc() + '%"></b></i></span>' +
            '<button class="c2-btn c2-pieno">' + I('plus', 15) + 'Aggiungi</button>' +
          '</header>' +
          '<div class="c2-adesso">' +
            '<span class="c2-tacca">Adesso</span>' +
            '<b>' + esc(C.mit) + '</b>' +
            '<span class="c2-min">' + C.mitOra + ' · ' + C.mitArea + ' · ' + C.mitTra + '</span>' +
            '<button class="c2-btn c2-pieno">' + I('check', 15) + 'Fatto</button>' +
            '<button class="c2-btn">Rinvia</button>' +
          '</div>' +
          '<h2 class="c2-sez">La giornata<span>5</span></h2>' +
          '<ul class="c2-lista">' + C.blocchi.map(function (b) {
            return '<li' + (b.adesso ? ' class="ades"' : '') + '>' +
              '<label class="c2-sp"><input type="checkbox"' + (b.fatto ? ' checked' : '') + '>' +
              '<span class="c2-ora">' + b.da + '–' + b.a + '</span>' +
              '<span class="c2-nome">' + esc(b.t) + '</span></label>' +
              '<span class="c2-tag">' + b.area + '</span>' +
              '<button class="c2-ico" aria-label="Altre opzioni">' + I('altreOpzioni', 15) + '</button></li>';
          }).join('') + C.senzaOra.map(function (b) {
            return '<li><label class="c2-sp"><input type="checkbox"><span class="c2-ora c2-sen">senza ora</span>' +
              '<span class="c2-nome">' + esc(b.t) + '</span></label><span class="c2-tag">' + b.area + '</span>' +
              '<button class="c2-ico" aria-label="Altre opzioni">' + I('altreOpzioni', 15) + '</button></li>';
          }).join('') + '</ul>' +
          '<h2 class="c2-sez">Abitudini di oggi<span>3</span></h2>' +
          '<ul class="c2-lista">' + C.abitudini.map(function (a) {
            return '<li><label class="c2-sp"><input type="checkbox"' + (a.fatta ? ' checked' : '') + '>' +
              '<span class="c2-nome">' + esc(a.t) + '</span></label>' +
              (a.serie ? '<span class="c2-tag">' + I('flame', 11) + ' ' + a.serie + ' giorni</span>' : '<span class="c2-tag c2-sen">nuova</span>') +
              '</li>';
          }).join('') + '</ul>' +
        '</div>' +
      '</div>';
    },
    attivita: function () {
      var riga = function (b, primo) {
        return '<li><label class="c2-sp"><input type="checkbox">' +
          '<span class="c2-nome">' + esc(b.t) + '</span></label>' +
          '<span class="c2-tag">' + b.area + '</span>' +
          (b.quando ? '<span class="c2-tag' + (b.urgente ? ' rosso' : '') + '">' + b.quando + '</span>' : '') +
          (primo ? '<button class="c2-btn c2-mini">Fai oggi</button>' : '') +
          '<button class="c2-ico" aria-label="Altre opzioni">' + I('altreOpzioni', 15) + '</button></li>';
      };
      return '<div class="c2">' +
        '<aside class="c2-nav">' + C.pagine.map(function (p) {
          return '<a class="' + (p.id === 'attivita' ? 'qui' : '') + '">' + I(p.ico, 16) + '<span>' + p.nome + '</span>' +
            (p.badge ? '<em>' + p.badge + '</em>' : '') + '</a>';
        }).join('') + '</aside>' +
        '<div class="c2-corpo">' +
          '<header class="c2-testa"><h2 class="lab-h">Attività</h2><span class="c2-data">' + C.totaleDaFare + ' da fare</span></header>' +
          '<form class="c2-agg"><input type="text" placeholder="Aggiungi una cosa da fare">' +
            '<button class="c2-btn c2-pieno" type="submit">' + I('plus', 15) + 'Aggiungi</button></form>' +
          '<div class="c2-chip">' + ['Tutte'].concat(C.aree).map(function (a, i) {
            return '<button class="' + (i === 0 ? 'on' : '') + '">' + a + '</button>';
          }).join('') + '</div>' +
          '<h2 class="c2-sez">Importanti<span>3</span></h2>' +
          '<ul class="c2-lista">' + C.prima.map(function (b) { return riga(b, true); }).join('') + '</ul>' +
          '<h2 class="c2-sez">Altre<span>3</span></h2>' +
          '<ul class="c2-lista c2-tenue">' + C.poi.map(function (b) { return riga(b, false); }).join('') + '</ul>' +
          '<div class="c2-piede">' +
            '<button class="c2-btn">' + I('chevronGiu', 15) + 'Mostra le altre ' + C.altre + '</button>' +
            '<span>' + C.ferme + ' inattive da tre settimane</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }
  };

  /* ============================================================
     3. MORBIDO — angoli larghi, spazi generosi, pulsanti grandi,
     navigazione in basso. Pensato prima per il telefono.
     ============================================================ */
  var D3 = {
    id: 'morbido', nome: 'Morbido',
    stanza: 'Angoli larghi, spazi generosi, pulsanti larghi quanto lo schermo, navigazione in basso dove arriva il pollice. Pensato prima per il telefono.',
    oggi: function () {
      return '<div class="m3">' +
        '<div class="m3-scorri">' +
          '<header class="m3-testa"><p>' + C.giorno + '</p><h2 class="lab-h">Oggi</h2></header>' +
          '<section class="m3-ades">' +
            '<span class="m3-eti">Adesso</span>' +
            '<h2>' + esc(C.mit) + '</h2>' +
            '<p>' + C.mitOra + ' · ' + C.mitArea + '</p>' +
            '<button class="m3-grosso">' + I('check', 18) + 'Fatto</button>' +
            '<div class="m3-due"><button class="m3-btn">Rinvia</button><button class="m3-btn">Cambia ora</button></div>' +
          '</section>' +
          '<section class="m3-box">' +
            '<div class="m3-boxtesta"><h3>La giornata</h3><span>' + C.fatte + ' di ' + C.totali + '</span></div>' +
            '<div class="m3-barra"><i style="width:' + perc() + '%"></i></div>' +
            C.blocchi.concat(C.senzaOra).map(function (b) {
              return '<label class="m3-riga"><input type="checkbox"' + (b.fatto ? ' checked' : '') + '>' +
                '<span class="m3-testo"><b>' + esc(b.t) + '</b>' +
                '<i>' + (b.da ? b.da + ' – ' + b.a : 'senza ora') + ' · ' + b.area + '</i></span></label>';
            }).join('') +
          '</section>' +
          '<section class="m3-box">' +
            '<div class="m3-boxtesta"><h3>Abitudini</h3><span>1 di 3</span></div>' +
            C.abitudini.map(function (a) {
              return '<label class="m3-riga"><input type="checkbox"' + (a.fatta ? ' checked' : '') + '>' +
                '<span class="m3-testo"><b>' + esc(a.t) + '</b>' +
                '<i>' + (a.serie ? a.serie + ' giorni di fila' : 'da cominciare') + '</i></span></label>';
            }).join('') +
          '</section>' +
        '</div>' +
        '<nav class="m3-barrabasso">' + C.pagine.map(function (p) {
          return '<a class="' + (p.id === 'oggi' ? 'qui' : '') + '">' + I(p.ico, 22) + '<span>' + p.nome + '</span></a>';
        }).join('') + '</nav>' +
      '</div>';
    },
    attivita: function () {
      return '<div class="m3">' +
        '<div class="m3-scorri">' +
          '<header class="m3-testa"><p>' + C.totaleDaFare + ' cose da fare</p><h2 class="lab-h">Attività</h2></header>' +
          '<form class="m3-agg"><input type="text" placeholder="Aggiungi una cosa da fare">' +
            '<button class="m3-tondo" type="submit" aria-label="Aggiungi">' + I('plus', 18) + '</button></form>' +
          '<div class="m3-chip">' + ['Tutte'].concat(C.aree).map(function (a, i) {
            return '<button class="' + (i === 0 ? 'on' : '') + '">' + a + '</button>';
          }).join('') + '</div>' +
          '<h2 class="m3-sez">Importanti</h2>' +
          C.prima.map(function (b) {
            return '<div class="m3-cosa">' +
              '<label class="m3-riga m3-nudo"><input type="checkbox">' +
                '<span class="m3-testo"><b>' + esc(b.t) + '</b>' +
                '<i>' + b.area + (b.quando ? ' · <em' + (b.urgente ? ' class="rosso"' : '') + '>' + b.quando + '</em>' : '') + '</i></span></label>' +
              '<div class="m3-due"><button class="m3-btn m3-forte">Fai oggi</button><button class="m3-btn">Sposta</button></div>' +
            '</div>';
          }).join('') +
          '<h2 class="m3-sez">Altre</h2>' +
          '<section class="m3-box">' + C.poi.map(function (b) {
            return '<label class="m3-riga"><input type="checkbox">' +
              '<span class="m3-testo"><b>' + esc(b.t) + '</b>' +
              '<i>' + b.area + (b.quando ? ' · ' + b.quando : '') + '</i></span></label>';
          }).join('') + '</section>' +
          '<button class="m3-largo">' + I('chevronGiu', 15) + 'Mostra le altre ' + C.altre + '</button>' +
          '<p class="m3-piede">' + C.ferme + ' inattive da tre settimane</p>' +
        '</div>' +
        '<nav class="m3-barrabasso">' + C.pagine.map(function (p) {
          return '<a class="' + (p.id === 'attivita' ? 'qui' : '') + '">' + I(p.ico, 22) + '<span>' + p.nome + '</span></a>';
        }).join('') + '</nav>' +
      '</div>';
    }
  };

  /* ============================================================
     4. NETTO — bordi invece di ombre, angoli quasi quadri, molto
     contrasto, navigazione in alto a schede.
     ============================================================ */
  var D4 = {
    id: 'netto', nome: 'Netto',
    stanza: 'Bordi invece di ombre, angoli quasi quadri, contrasto alto, navigazione in alto a schede. Ogni confine è visibile: niente si confonde con lo sfondo.',
    oggi: function () {
      return '<div class="n4">' +
        '<div class="n4-cima"><b>' + L(16) + 'LifeMax</b>' +
          '<nav>' + C.pagine.map(function (p) {
            return '<a class="' + (p.id === 'oggi' ? 'qui' : '') + '">' + p.nome + (p.badge ? ' <em>' + p.badge + '</em>' : '') + '</a>';
          }).join('') + '</nav>' +
          '<button class="n4-btn n4-pieno">' + I('plus', 15) + 'Aggiungi</button>' +
        '</div>' +
        '<div class="n4-corpo">' +
          '<div class="n4-testa"><h2 class="lab-h">Oggi</h2><span>' + C.giorno + ' · ' + C.ora + '</span></div>' +
          '<section class="n4-ades">' +
            '<div class="n4-adestesto">' +
              '<span class="n4-eti">Adesso</span>' +
              '<h2>' + esc(C.mit) + '</h2>' +
              '<p>' + C.mitOra + ' · ' + C.mitArea + ' · ' + C.mitTra + '</p>' +
            '</div>' +
            '<div class="n4-adesbtn">' +
              '<button class="n4-btn n4-pieno">' + I('check', 15) + 'Fatto</button>' +
              '<button class="n4-btn">Rinvia</button>' +
            '</div>' +
          '</section>' +
          '<div class="n4-quadri">' +
            '<section class="n4-box">' +
              '<h3>La giornata <b>' + C.fatte + '/' + C.totali + '</b></h3>' +
              '<div class="n4-barra"><i style="width:' + perc() + '%"></i></div>' +
              C.blocchi.concat(C.senzaOra).map(function (b) {
                return '<label class="n4-riga"><input type="checkbox"' + (b.fatto ? ' checked' : '') + '>' +
                  '<span class="n4-ora">' + (b.da || '--:--') + '</span>' +
                  '<span class="n4-nome">' + esc(b.t) + '</span>' +
                  '<span class="n4-tag">' + b.area + '</span></label>';
              }).join('') +
            '</section>' +
            '<section class="n4-box">' +
              '<h3>Abitudini <b>1/3</b></h3>' +
              C.abitudini.map(function (a) {
                return '<label class="n4-riga"><input type="checkbox"' + (a.fatta ? ' checked' : '') + '>' +
                  '<span class="n4-nome">' + esc(a.t) + '</span>' +
                  '<span class="n4-tag">' + (a.serie ? a.serie + ' gg' : 'nuova') + '</span></label>';
              }).join('') +
            '</section>' +
          '</div>' +
        '</div>' +
      '</div>';
    },
    attivita: function () {
      var riga = function (b, primo) {
        return '<div class="n4-cosa">' +
          '<input type="checkbox" aria-label="Segna fatta">' +
          '<div class="n4-cosatesto"><b>' + esc(b.t) + '</b>' +
            '<span><i class="n4-tag">' + b.area + '</i>' +
            (b.quando ? '<i class="n4-tag' + (b.urgente ? ' rosso' : '') + '">' + b.quando + '</i>' : '') + '</span></div>' +
          (primo ? '<button class="n4-btn n4-pieno n4-mini">Fai oggi</button>' : '<button class="n4-btn n4-mini">Pianifica</button>') +
          '<button class="n4-ico" aria-label="Altre opzioni">' + I('altreOpzioni', 15) + '</button>' +
        '</div>';
      };
      return '<div class="n4">' +
        '<div class="n4-cima"><b>' + L(16) + 'LifeMax</b>' +
          '<nav>' + C.pagine.map(function (p) {
            return '<a class="' + (p.id === 'attivita' ? 'qui' : '') + '">' + p.nome + (p.badge ? ' <em>' + p.badge + '</em>' : '') + '</a>';
          }).join('') + '</nav>' +
        '</div>' +
        '<div class="n4-corpo">' +
          '<div class="n4-testa"><h2 class="lab-h">Attività</h2><span>' + C.totaleDaFare + ' cose da fare</span></div>' +
          '<form class="n4-agg"><input type="text" placeholder="Aggiungi una cosa da fare">' +
            '<button class="n4-btn n4-pieno" type="submit">' + I('plus', 15) + 'Aggiungi</button></form>' +
          '<div class="n4-chip">' + ['Tutte'].concat(C.aree).map(function (a, i) {
            return '<button class="' + (i === 0 ? 'on' : '') + '">' + a + '</button>';
          }).join('') + '</div>' +
          '<section class="n4-box">' +
            '<h3>Importanti <b>3</b></h3>' + C.prima.map(function (b) { return riga(b, true); }).join('') +
          '</section>' +
          '<section class="n4-box">' +
            '<h3>Altre <b>3</b></h3>' + C.poi.map(function (b) { return riga(b, false); }).join('') +
            '<button class="n4-largo">' + I('chevronGiu', 15) + 'Mostra le altre ' + C.altre + '</button>' +
          '</section>' +
          '<p class="n4-piede">' + C.ferme + ' inattive da tre settimane. <button class="n4-link">Rivedile</button></p>' +
        '</div>' +
      '</div>';
    }
  };

  /* ============================================================
     5. DUE COLONNE — a sinistra la cosa da fare adesso e la
     giornata, a destra le cose da fare. Niente cambio di pagina.
     ============================================================ */
  var D5 = {
    id: 'duecolonne', nome: 'Due colonne',
    stanza: 'A sinistra cosa fare adesso e la giornata, a destra le cose da fare: le due domande stanno nella stessa schermata, senza cambiare pagina. Sul telefono le colonne si impilano.',
    oggi: function () {
      return '<div class="d5">' +
        '<div class="d5-cima"><b>' + L(16) + 'LifeMax</b>' +
          '<nav>' + C.pagine.map(function (p) {
            return '<a class="' + (p.id === 'oggi' ? 'qui' : '') + '">' + I(p.ico, 15) + p.nome + '</a>';
          }).join('') + '</nav>' +
          '<button class="d5-btn d5-pieno">' + I('plus', 15) + 'Aggiungi</button>' +
        '</div>' +
        '<div class="d5-due">' +
          '<section class="d5-col">' +
            '<h2 class="lab-h d5-h">Oggi <span>' + C.giorno + '</span></h2>' +
            '<div class="d5-ades">' +
              '<span class="d5-eti">Adesso · ' + C.mitTra + '</span>' +
              '<h2>' + esc(C.mit) + '</h2>' +
              '<p>' + C.mitOra + ' · ' + C.mitArea + '</p>' +
              '<div class="d5-azioni"><button class="d5-btn d5-pieno">' + I('check', 15) + 'Fatto</button>' +
                '<button class="d5-btn">Rinvia</button></div>' +
            '</div>' +
            '<div class="d5-avanz"><span>' + C.fatte + ' di ' + C.totali + ' fatte</span><i><b style="width:' + perc() + '%"></b></i></div>' +
            C.blocchi.concat(C.senzaOra).map(function (b) {
              return '<label class="d5-riga' + (b.adesso ? ' ades' : '') + '"><input type="checkbox"' + (b.fatto ? ' checked' : '') + '>' +
                '<span class="d5-ora">' + (b.da || '—') + '</span>' +
                '<span class="d5-nome">' + esc(b.t) + '</span>' +
                '<span class="d5-tag">' + b.area + '</span></label>';
            }).join('') +
          '</section>' +
          '<section class="d5-col d5-lato">' +
            '<h2 class="d5-h2">Da fare <span>' + C.totaleDaFare + '</span></h2>' +
            '<form class="d5-agg"><input type="text" placeholder="Aggiungi"><button class="d5-btn" type="submit" aria-label="Aggiungi">' + I('plus', 15) + '</button></form>' +
            '<p class="d5-eti2">Importanti</p>' +
            C.prima.map(function (b) {
              return '<div class="d5-cosa"><input type="checkbox" aria-label="Segna fatta">' +
                '<div><b>' + esc(b.t) + '</b><span><i class="d5-tag">' + b.area + '</i>' +
                (b.quando ? '<i class="d5-quando' + (b.urgente ? ' rosso' : '') + '">' + b.quando + '</i>' : '') + '</span></div>' +
                '<button class="d5-btn d5-mini">Oggi</button></div>';
            }).join('') +
            '<p class="d5-eti2">Altre</p>' +
            C.poi.map(function (b) {
              return '<div class="d5-cosa d5-tenue"><input type="checkbox" aria-label="Segna fatta">' +
                '<div><b>' + esc(b.t) + '</b><span><i class="d5-tag">' + b.area + '</i></span></div></div>';
            }).join('') +
            '<button class="d5-largo">Mostra le altre ' + C.altre + '</button>' +
          '</section>' +
        '</div>' +
      '</div>';
    },
    attivita: function () {
      return '<div class="d5">' +
        '<div class="d5-cima"><b>' + L(16) + 'LifeMax</b>' +
          '<nav>' + C.pagine.map(function (p) {
            return '<a class="' + (p.id === 'attivita' ? 'qui' : '') + '">' + I(p.ico, 15) + p.nome + '</a>';
          }).join('') + '</nav>' +
        '</div>' +
        '<div class="d5-due d5-rovescio">' +
          '<section class="d5-col">' +
            '<h2 class="lab-h d5-h">Attività <span>' + C.totaleDaFare + ' da fare</span></h2>' +
            '<form class="d5-agg d5-aggl"><input type="text" placeholder="Aggiungi una cosa da fare">' +
              '<button class="d5-btn d5-pieno" type="submit">' + I('plus', 15) + 'Aggiungi</button></form>' +
            '<div class="d5-chip">' + ['Tutte'].concat(C.aree).map(function (a, i) {
              return '<button class="' + (i === 0 ? 'on' : '') + '">' + a + '</button>';
            }).join('') + '</div>' +
            '<p class="d5-eti2">Importanti <b>3</b></p>' +
            C.prima.map(function (b) {
              return '<div class="d5-cosa d5-grande"><input type="checkbox" aria-label="Segna fatta">' +
                '<div><b>' + esc(b.t) + '</b><span><i class="d5-tag">' + b.area + '</i>' +
                (b.quando ? '<i class="d5-quando' + (b.urgente ? ' rosso' : '') + '">' + b.quando + '</i>' : '') + '</span></div>' +
                '<button class="d5-btn d5-pieno d5-mini">Fai oggi</button>' +
                '<button class="d5-ico" aria-label="Altre opzioni">' + I('altreOpzioni', 15) + '</button></div>';
            }).join('') +
            '<p class="d5-eti2">Altre <b>3</b></p>' +
            C.poi.map(function (b) {
              return '<div class="d5-cosa d5-grande d5-tenue"><input type="checkbox" aria-label="Segna fatta">' +
                '<div><b>' + esc(b.t) + '</b><span><i class="d5-tag">' + b.area + '</i>' +
                (b.quando ? '<i class="d5-quando">' + b.quando + '</i>' : '') + '</span></div>' +
                '<button class="d5-btn d5-mini">Pianifica</button>' +
                '<button class="d5-ico" aria-label="Altre opzioni">' + I('altreOpzioni', 15) + '</button></div>';
            }).join('') +
            '<button class="d5-largo">Mostra le altre ' + C.altre + '</button>' +
          '</section>' +
          '<section class="d5-col d5-lato">' +
            '<h2 class="d5-h2">Oggi</h2>' +
            '<div class="d5-ades d5-piccolo">' +
              '<span class="d5-eti">Adesso</span><b>' + esc(C.mit) + '</b>' +
              '<p>' + C.mitOra + '</p>' +
              '<button class="d5-btn d5-pieno">' + I('check', 15) + 'Fatto</button>' +
            '</div>' +
            '<p class="d5-eti2">Dopo</p>' +
            C.blocchi.slice(3).concat(C.senzaOra).map(function (b) {
              return '<label class="d5-riga"><input type="checkbox">' +
                '<span class="d5-ora">' + (b.da || '—') + '</span>' +
                '<span class="d5-nome">' + esc(b.t) + '</span></label>';
            }).join('') +
            '<p class="d5-eti2">Abitudini</p>' +
            C.abitudini.map(function (a) {
              return '<label class="d5-riga"><input type="checkbox"' + (a.fatta ? ' checked' : '') + '>' +
                '<span class="d5-nome">' + esc(a.t) + '</span></label>';
            }).join('') +
          '</section>' +
        '</div>' +
      '</div>';
    }
  };

  /* ============================================================
     6. TESTATA A COLORE — una fascia colorata in cima con il
     riepilogo e l'azione, il contenuto bianco che le sale sopra.
     ============================================================ */
  var D6 = {
    id: 'testata', nome: 'Testata a colore',
    stanza: 'Una fascia colorata in cima con il riepilogo e l’azione principale, il contenuto bianco che le sale sopra. Il colore fa da segnale: quello che conta sta lì.',
    oggi: function () {
      return '<div class="t6">' +
        '<header class="t6-fascia">' +
          '<div class="t6-riga1"><span>' + C.giorno + '</span>' +
            '<button class="t6-ico" aria-label="Impostazioni">' + I('ingranaggio', 18) + '</button></div>' +
          '<h2 class="lab-h">Oggi</h2>' +
          '<div class="t6-ades">' +
            '<span class="t6-eti">Adesso · ' + C.mitTra + '</span>' +
            '<b>' + esc(C.mit) + '</b>' +
            '<span class="t6-min">' + C.mitOra + ' · ' + C.mitArea + '</span>' +
            '<div class="t6-azioni"><button class="t6-btn t6-chiaro">' + I('check', 15) + 'Fatto</button>' +
              '<button class="t6-btn t6-vuoto">Rinvia</button></div>' +
          '</div>' +
          '<div class="t6-avanz"><i><b style="width:' + perc() + '%"></b></i><span>' + C.fatte + ' di ' + C.totali + ' fatte</span></div>' +
        '</header>' +
        '<div class="t6-foglio">' +
          '<h2 class="t6-sez">La giornata<button class="t6-link">Modifica</button></h2>' +
          C.blocchi.concat(C.senzaOra).map(function (b) {
            return '<label class="t6-riga"><input type="checkbox"' + (b.fatto ? ' checked' : '') + '>' +
              '<span class="t6-testo"><b>' + esc(b.t) + '</b><i>' + (b.da ? b.da + ' – ' + b.a : 'senza ora') + ' · ' + b.area + '</i></span>' +
              '<button class="t6-ico2" aria-label="Altre opzioni">' + I('altreOpzioni', 15) + '</button></label>';
          }).join('') +
          '<h2 class="t6-sez">Abitudini<span>1 di 3</span></h2>' +
          C.abitudini.map(function (a) {
            return '<label class="t6-riga"><input type="checkbox"' + (a.fatta ? ' checked' : '') + '>' +
              '<span class="t6-testo"><b>' + esc(a.t) + '</b><i>' + (a.serie ? a.serie + ' giorni di fila' : 'da cominciare') + '</i></span></label>';
          }).join('') +
        '</div>' +
        '<nav class="t6-basso">' + C.pagine.map(function (p) {
          return '<a class="' + (p.id === 'oggi' ? 'qui' : '') + '">' + I(p.ico, 21) + '<span>' + p.nome + '</span></a>';
        }).join('') + '</nav>' +
      '</div>';
    },
    attivita: function () {
      return '<div class="t6">' +
        '<header class="t6-fascia t6-corta">' +
          '<div class="t6-riga1"><span>' + C.totaleDaFare + ' cose da fare</span>' +
            '<button class="t6-ico" aria-label="Impostazioni">' + I('ingranaggio', 18) + '</button></div>' +
          '<h2 class="lab-h">Attività</h2>' +
          '<form class="t6-agg"><input type="text" placeholder="Aggiungi una cosa da fare">' +
            '<button class="t6-btn t6-chiaro" type="submit">' + I('plus', 15) + 'Aggiungi</button></form>' +
        '</header>' +
        '<div class="t6-foglio">' +
          '<div class="t6-chip">' + ['Tutte'].concat(C.aree).map(function (a, i) {
            return '<button class="' + (i === 0 ? 'on' : '') + '">' + a + '</button>';
          }).join('') + '</div>' +
          '<h2 class="t6-sez">Importanti<span>3</span></h2>' +
          C.prima.map(function (b) {
            return '<div class="t6-cosa"><input type="checkbox" aria-label="Segna fatta">' +
              '<div class="t6-testo"><b>' + esc(b.t) + '</b>' +
              '<i>' + b.area + (b.quando ? ' · <em' + (b.urgente ? ' class="rosso"' : '') + '>' + b.quando + '</em>' : '') + '</i></div>' +
              '<button class="t6-btn t6-forte">Fai oggi</button></div>';
          }).join('') +
          '<h2 class="t6-sez">Altre<span>3</span></h2>' +
          C.poi.map(function (b) {
            return '<div class="t6-cosa"><input type="checkbox" aria-label="Segna fatta">' +
              '<div class="t6-testo"><b>' + esc(b.t) + '</b><i>' + b.area + (b.quando ? ' · ' + b.quando : '') + '</i></div>' +
              '<button class="t6-ico2" aria-label="Altre opzioni">' + I('altreOpzioni', 15) + '</button></div>';
          }).join('') +
          '<button class="t6-largo">' + I('chevronGiu', 15) + 'Mostra le altre ' + C.altre + '</button>' +
          '<p class="t6-piede">' + C.ferme + ' inattive da tre settimane</p>' +
        '</div>' +
        '<nav class="t6-basso">' + C.pagine.map(function (p) {
          return '<a class="' + (p.id === 'attivita' ? 'qui' : '') + '">' + I(p.ico, 21) + '<span>' + p.nome + '</span></a>';
        }).join('') + '</nav>' +
      '</div>';
    }
  };

  /* ============================================================
     7. SCURO — fondo scuro, superfici sollevate, un accento solo.
     Stessa struttura di sempre, meno luce addosso.
     ============================================================ */
  var D7 = {
    id: 'scuro', nome: 'Scuro',
    stanza: 'Fondo scuro, superfici sollevate a gradini, un accento solo che indica sempre la stessa cosa: cosa fare adesso. Comodo di sera e per chi tiene lo schermo alto.',
    oggi: function () {
      return '<div class="k7">' +
        '<aside class="k7-nav">' +
          '<div class="k7-marchio">' + L(17) + '<b>LifeMax</b></div>' +
          C.pagine.map(function (p) {
            return '<a class="' + (p.id === 'oggi' ? 'qui' : '') + '">' + I(p.ico, 17) + '<span>' + p.nome + '</span>' +
              (p.badge ? '<em>' + p.badge + '</em>' : '') + '</a>';
          }).join('') +
        '</aside>' +
        '<div class="k7-corpo">' +
          '<header class="k7-testa"><div><h2 class="lab-h">Oggi</h2><p>' + C.giorno + ' · ' + C.ora + '</p></div>' +
            '<button class="k7-btn k7-pieno">' + I('plus', 15) + 'Aggiungi</button></header>' +
          '<section class="k7-ades">' +
            '<span class="k7-eti">' + I('bolt', 13) + 'Adesso · ' + C.mitTra + '</span>' +
            '<h2>' + esc(C.mit) + '</h2>' +
            '<p>' + C.mitOra + ' · ' + C.mitArea + '</p>' +
            '<div class="k7-azioni"><button class="k7-btn k7-pieno">' + I('check', 15) + 'Fatto</button>' +
              '<button class="k7-btn">Rinvia</button>' +
              '<button class="k7-ico" aria-label="Altre opzioni">' + I('altreOpzioni', 15) + '</button></div>' +
          '</section>' +
          '<div class="k7-griglia">' +
            '<section class="k7-box"><div class="k7-boxtesta"><h3>La giornata</h3>' +
              '<span>' + C.fatte + '/' + C.totali + '</span></div>' +
              '<div class="k7-barra"><i style="width:' + perc() + '%"></i></div>' +
              C.blocchi.concat(C.senzaOra).map(function (b) {
                return '<label class="k7-riga' + (b.adesso ? ' ades' : '') + '"><input type="checkbox"' + (b.fatto ? ' checked' : '') + '>' +
                  '<span class="k7-ora">' + (b.da || '—') + '</span>' +
                  '<span class="k7-nome">' + esc(b.t) + '</span>' +
                  '<span class="k7-tag">' + b.area + '</span></label>';
              }).join('') +
            '</section>' +
            '<section class="k7-box"><div class="k7-boxtesta"><h3>Abitudini</h3><span>1/3</span></div>' +
              C.abitudini.map(function (a) {
                return '<label class="k7-riga"><input type="checkbox"' + (a.fatta ? ' checked' : '') + '>' +
                  '<span class="k7-nome">' + esc(a.t) + '</span>' +
                  '<span class="k7-tag">' + (a.serie ? I('flame', 11) + ' ' + a.serie : 'nuova') + '</span></label>';
              }).join('') +
            '</section>' +
          '</div>' +
        '</div>' +
      '</div>';
    },
    attivita: function () {
      var riga = function (b, primo) {
        return '<div class="k7-cosa"><input type="checkbox" aria-label="Segna fatta">' +
          '<div class="k7-cosatesto"><b>' + esc(b.t) + '</b>' +
            '<span><i class="k7-tag">' + b.area + '</i>' +
            (b.quando ? '<i class="k7-tag' + (b.urgente ? ' rosso' : '') + '">' + b.quando + '</i>' : '') + '</span></div>' +
          (primo ? '<button class="k7-btn k7-pieno k7-mini">Fai oggi</button>' : '<button class="k7-btn k7-mini">Pianifica</button>') +
          '<button class="k7-ico" aria-label="Altre opzioni">' + I('altreOpzioni', 15) + '</button></div>';
      };
      return '<div class="k7">' +
        '<aside class="k7-nav">' +
          '<div class="k7-marchio">' + L(17) + '<b>LifeMax</b></div>' +
          C.pagine.map(function (p) {
            return '<a class="' + (p.id === 'attivita' ? 'qui' : '') + '">' + I(p.ico, 17) + '<span>' + p.nome + '</span>' +
              (p.badge ? '<em>' + p.badge + '</em>' : '') + '</a>';
          }).join('') +
        '</aside>' +
        '<div class="k7-corpo">' +
          '<header class="k7-testa"><div><h2 class="lab-h">Attività</h2><p>' + C.totaleDaFare + ' cose da fare</p></div></header>' +
          '<form class="k7-agg"><input type="text" placeholder="Aggiungi una cosa da fare">' +
            '<button class="k7-btn k7-pieno" type="submit">' + I('plus', 15) + 'Aggiungi</button></form>' +
          '<div class="k7-chip">' + ['Tutte'].concat(C.aree).map(function (a, i) {
            return '<button class="' + (i === 0 ? 'on' : '') + '">' + a + '</button>';
          }).join('') + '</div>' +
          '<section class="k7-box"><div class="k7-boxtesta"><h3>Importanti</h3><span>3</span></div>' +
            C.prima.map(function (b) { return riga(b, true); }).join('') + '</section>' +
          '<section class="k7-box"><div class="k7-boxtesta"><h3>Altre</h3><span>3</span></div>' +
            C.poi.map(function (b) { return riga(b, false); }).join('') +
            '<button class="k7-largo">' + I('chevronGiu', 15) + 'Mostra le altre ' + C.altre + '</button></section>' +
          '<p class="k7-piede">' + C.ferme + ' inattive da tre settimane. <button class="k7-link">Rivedile</button></p>' +
        '</div>' +
      '</div>';
    }
  };

  /* ============================================================
     8. TOCCHI GRANDI — pochi elementi, molto grandi. Pulsanti da
     56 px, testi larghi, il resto dietro un pulsante «Mostra».
     ============================================================ */
  var D8 = {
    id: 'grandi', nome: 'Tocchi grandi',
    stanza: 'Pochi elementi, tutti grandi: pulsanti alti, testo largo, tre voci per volta e il resto dietro «Mostra». Si usa con una mano e senza mirare.',
    oggi: function () {
      return '<div class="g8">' +
        '<div class="g8-scorri">' +
          '<header class="g8-testa"><span>' + C.giorno + '</span><h2 class="lab-h">Oggi</h2>' +
            '<div class="g8-avanz"><i><b style="width:' + perc() + '%"></b></i><span>' + C.fatte + ' di ' + C.totali + '</span></div>' +
          '</header>' +
          '<section class="g8-ades">' +
            '<span class="g8-eti">Adesso</span>' +
            '<h2>' + esc(C.mit) + '</h2>' +
            '<p>' + C.mitOra + ' · ' + C.mitArea + '</p>' +
            '<button class="g8-mega">' + I('check', 26) + 'Fatto</button>' +
            '<button class="g8-btn">Rinvia di un’ora</button>' +
          '</section>' +
          '<h2 class="g8-sez">Altre oggi</h2>' +
          C.blocchi.slice(3).concat(C.senzaOra).map(function (b) {
            return '<label class="g8-riga"><input type="checkbox">' +
              '<span><b>' + esc(b.t) + '</b><i>' + (b.da ? b.da : 'senza ora') + ' · ' + b.area + '</i></span></label>';
          }).join('') +
          '<button class="g8-btn g8-largo">' + I('chevronGiu', 18) + 'Mostra tutta la giornata</button>' +
          '<h2 class="g8-sez">Abitudini</h2>' +
          C.abitudini.map(function (a) {
            return '<label class="g8-riga"><input type="checkbox"' + (a.fatta ? ' checked' : '') + '>' +
              '<span><b>' + esc(a.t) + '</b><i>' + (a.serie ? a.serie + ' giorni di fila' : 'da cominciare') + '</i></span></label>';
          }).join('') +
        '</div>' +
        '<nav class="g8-basso">' + C.pagine.slice(0, 4).map(function (p) {
          return '<a class="' + (p.id === 'oggi' ? 'qui' : '') + '">' + I(p.ico, 26) + '<span>' + p.nome + '</span></a>';
        }).join('') + '</nav>' +
      '</div>';
    },
    attivita: function () {
      return '<div class="g8">' +
        '<div class="g8-scorri">' +
          '<header class="g8-testa"><span>' + C.totaleDaFare + ' cose da fare</span><h2 class="lab-h">Attività</h2></header>' +
          '<form class="g8-agg"><input type="text" placeholder="Cosa devi fare?">' +
            '<button class="g8-mega g8-corto" type="submit">' + I('plus', 18) + 'Aggiungi</button></form>' +
          '<h2 class="g8-sez">Importanti</h2>' +
          C.prima.map(function (b) {
            return '<div class="g8-cosa">' +
              '<label><input type="checkbox"><span><b>' + esc(b.t) + '</b>' +
              '<i>' + b.area + (b.quando ? ' · <em' + (b.urgente ? ' class="rosso"' : '') + '>' + b.quando + '</em>' : '') + '</i></span></label>' +
              '<button class="g8-mega g8-corto">Fai oggi</button>' +
            '</div>';
          }).join('') +
          '<h2 class="g8-sez">Altre</h2>' +
          C.poi.map(function (b) {
            return '<label class="g8-riga"><input type="checkbox">' +
              '<span><b>' + esc(b.t) + '</b><i>' + b.area + (b.quando ? ' · ' + b.quando : '') + '</i></span></label>';
          }).join('') +
          '<button class="g8-btn g8-largo">' + I('chevronGiu', 18) + 'Mostra le altre ' + C.altre + '</button>' +
          '<p class="g8-piede">' + C.ferme + ' inattive da tre settimane</p>' +
        '</div>' +
        '<nav class="g8-basso">' + C.pagine.slice(0, 4).map(function (p) {
          return '<a class="' + (p.id === 'attivita' ? 'qui' : '') + '">' + I(p.ico, 26) + '<span>' + p.nome + '</span></a>';
        }).join('') + '</nav>' +
      '</div>';
    }
  };

  /* ============================================================
     9. AGENDA A ORE — la giornata come la vede un calendario:
     ore nella colonna a sinistra, blocchi accanto, la riga
     dell'ora attuale. Le cose da fare restano un elenco normale.
     ============================================================ */
  var D9 = {
    id: 'agenda', nome: 'Agenda a ore',
    stanza: 'La giornata come in un calendario: le ore nella colonna a sinistra, i blocchi accanto, una riga che segna adesso. Si vede subito quanto tempo resta libero.',
    oggi: function () {
      var ore = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
      var H = 540; /* altezza della pista in pixel: 16 ore in 540 px */
      var px = function (hhmm) { return Math.round(pc(hhmm) * H / 100); };
      return '<div class="a9">' +
        '<div class="a9-cima"><b>' + L(15) + 'LifeMax</b>' +
          '<nav>' + C.pagine.map(function (p) {
            return '<a class="' + (p.id === 'oggi' ? 'qui' : '') + '">' + p.nome + '</a>';
          }).join('') + '</nav>' +
          '<button class="a9-btn a9-pieno">' + I('plus', 15) + 'Aggiungi</button></div>' +
        '<div class="a9-testa"><h2 class="lab-h">Oggi</h2><span>' + C.giorno + ' · ' + C.ora + '</span>' +
          '<span class="a9-conta">' + C.fatte + ' di ' + C.totali + ' fatte</span></div>' +
        '<div class="a9-ades">' +
          '<span class="a9-eti">Adesso · ' + C.mitTra + '</span>' +
          '<b>' + esc(C.mit) + '</b><span class="a9-min">' + C.mitOra + ' · ' + C.mitArea + '</span>' +
          '<button class="a9-btn a9-pieno">' + I('check', 15) + 'Fatto</button>' +
          '<button class="a9-btn">Rinvia</button>' +
        '</div>' +
        '<div class="a9-tela">' +
          '<div class="a9-ore" style="height:' + H + 'px">' + ore.map(function (o) {
            return '<span style="top:' + px(o) + 'px">' + o + '</span>';
          }).join('') + '</div>' +
          '<div class="a9-pista" style="height:' + H + 'px">' +
            ore.map(function (o) { return '<i class="a9-linea" style="top:' + px(o) + 'px"></i>'; }).join('') +
            C.blocchi.map(function (b) {
              var t = px(b.da), h = px(b.a) - t, corto = h < 48;
              return '<button class="a9-blocco' + (b.fatto ? ' fatto' : '') + (b.adesso ? ' ades' : '') +
                (corto ? ' corto' : '') + '" style="top:' + t + 'px;height:' + Math.max(38, h) + 'px">' +
                '<b>' + esc(b.t) + '</b><span>' + b.da + '–' + b.a + ' · ' + b.area + '</span></button>';
            }).join('') +
            '<div class="a9-adessolinea" style="top:' + px(C.ora) + 'px"><i></i><span>' + C.ora + '</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="a9-senza">' +
          '<h2>Senza ora<span>1</span></h2>' +
          C.senzaOra.map(function (b) {
            return '<label class="a9-riga"><input type="checkbox">' +
              '<span class="a9-nome">' + esc(b.t) + '</span><span class="a9-tag">' + b.area + '</span>' +
              '<button class="a9-btn a9-mini">Dagli un’ora</button></label>';
          }).join('') +
        '</div>' +
      '</div>';
    },
    attivita: function () {
      var riga = function (b, primo) {
        return '<label class="a9-riga"><input type="checkbox">' +
          '<span class="a9-nome">' + esc(b.t) + '</span>' +
          '<span class="a9-tag">' + b.area + '</span>' +
          (b.quando ? '<span class="a9-tag' + (b.urgente ? ' rosso' : '') + '">' + b.quando + '</span>' : '') +
          '<button class="a9-btn a9-mini' + (primo ? ' a9-pieno' : '') + '">' + (primo ? 'Fai oggi' : 'Pianifica') + '</button>' +
          '<button class="a9-ico" aria-label="Altre opzioni">' + I('altreOpzioni', 15) + '</button></label>';
      };
      return '<div class="a9">' +
        '<div class="a9-cima"><b>' + L(15) + 'LifeMax</b>' +
          '<nav>' + C.pagine.map(function (p) {
            return '<a class="' + (p.id === 'attivita' ? 'qui' : '') + '">' + p.nome + '</a>';
          }).join('') + '</nav></div>' +
        '<div class="a9-testa"><h2 class="lab-h">Attività</h2><span>' + C.totaleDaFare + ' cose da fare</span></div>' +
        '<div class="a9-senza a9-pieno-largo">' +
          '<form class="a9-agg"><input type="text" placeholder="Aggiungi una cosa da fare">' +
            '<button class="a9-btn a9-pieno" type="submit">' + I('plus', 15) + 'Aggiungi</button></form>' +
          '<div class="a9-chip">' + ['Tutte'].concat(C.aree).map(function (a, i) {
            return '<button class="' + (i === 0 ? 'on' : '') + '">' + a + '</button>';
          }).join('') + '</div>' +
          '<h2>Importanti<span>3</span></h2>' +
          C.prima.map(function (b) { return riga(b, true); }).join('') +
          '<h2>Altre<span>3</span></h2>' +
          C.poi.map(function (b) { return riga(b, false); }).join('') +
          '<div class="a9-coda"><button class="a9-btn">' + I('chevronGiu', 15) + 'Mostra le altre ' + C.altre + '</button>' +
            '<span>' + C.ferme + ' inattive da tre settimane</span></div>' +
        '</div>' +
      '</div>';
    }
  };

  /* ============================================================
     10. GUIDATO — una cosa in primo piano con i suoi pulsanti, e
     appena sotto «dopo questa». Il resto si apre quando lo chiedi.
     ============================================================ */
  var D10 = {
    id: 'guidato', nome: 'Guidato',
    stanza: 'Una cosa in primo piano con i suoi pulsanti e, appena sotto, quella dopo. Il resto della lista si apre quando lo chiedi: la schermata non ti mette davanti nove scelte.',
    oggi: function () {
      return '<div class="p10">' +
        '<div class="p10-scorri">' +
          '<header class="p10-testa">' +
            '<div class="p10-riga1"><span>Oggi · ' + C.giorno + '</span>' +
              '<button class="p10-ico" aria-label="Impostazioni">' + I('ingranaggio', 18) + '</button></div>' +
            '<div class="p10-passi"><i class="on"></i><i></i><span>' + C.fatte + ' di ' + C.totali + ' fatte</span></div>' +
          '</header>' +
          '<section class="p10-carta">' +
            '<span class="p10-eti">Da fare adesso · ' + C.mitTra + '</span>' +
            '<h2 class="lab-h">' + esc(C.mit) + '</h2>' +
            '<p class="p10-quando">' + C.mitOra + ' · ' + C.mitArea + '</p>' +
            '<button class="p10-primo">' + I('check', 18) + 'Fatto</button>' +
            '<div class="p10-due"><button class="p10-btn">Rinvia</button><button class="p10-btn">Cambia</button></div>' +
          '</section>' +
          '<section class="p10-dopo">' +
            '<span class="p10-eti2">Dopo questa</span>' +
            '<div class="p10-riga"><span class="p10-ora">18:30</span><b>Camminata</b><span class="p10-tag">Salute</span></div>' +
            '<button class="p10-apri">' + I('chevronGiu', 15) + 'Vedi tutta la giornata (5)</button>' +
          '</section>' +
          '<section class="p10-abit">' +
            '<span class="p10-eti2">Abitudini di oggi</span>' +
            C.abitudini.map(function (a) {
              return '<label class="p10-riga p10-cliccabile"><input type="checkbox"' + (a.fatta ? ' checked' : '') + '>' +
                '<b>' + esc(a.t) + '</b>' +
                (a.serie ? '<span class="p10-tag">' + I('flame', 11) + ' ' + a.serie + '</span>' : '') + '</label>';
            }).join('') +
          '</section>' +
        '</div>' +
        '<nav class="p10-basso">' + C.pagine.map(function (p) {
          return '<a class="' + (p.id === 'oggi' ? 'qui' : '') + '">' + I(p.ico, 20) + '<span>' + p.nome + '</span></a>';
        }).join('') + '</nav>' +
      '</div>';
    },
    attivita: function () {
      return '<div class="p10">' +
        '<div class="p10-scorri">' +
          '<header class="p10-testa">' +
            '<div class="p10-riga1"><span>Attività · ' + C.totaleDaFare + ' da fare</span>' +
              '<button class="p10-ico" aria-label="Impostazioni">' + I('ingranaggio', 18) + '</button></div>' +
            '<form class="p10-agg"><input type="text" placeholder="Aggiungi una cosa da fare">' +
              '<button class="p10-tondo" type="submit" aria-label="Aggiungi">' + I('plus', 18) + '</button></form>' +
          '</header>' +
          '<section class="p10-carta">' +
            '<span class="p10-eti">La più urgente</span>' +
            '<h2 class="lab-h">' + esc(C.prima[0].t) + '</h2>' +
            '<p class="p10-quando p10-rosso">' + C.prima[0].quando + ' · ' + C.prima[0].area + '</p>' +
            '<button class="p10-primo">' + I('check', 18) + 'Fatta</button>' +
            '<div class="p10-due"><button class="p10-btn">Mettila oggi</button><button class="p10-btn">Sposta</button></div>' +
          '</section>' +
          '<section class="p10-dopo">' +
            '<span class="p10-eti2">Altre queste due</span>' +
            C.prima.slice(1).map(function (b) {
              return '<div class="p10-riga p10-cliccabile"><input type="checkbox" aria-label="Segna fatta">' +
                '<b>' + esc(b.t) + '</b><span class="p10-tag">' + b.quando + '</span>' +
                '<button class="p10-btn p10-mini">Oggi</button></div>';
            }).join('') +
            '<button class="p10-apri">' + I('chevronGiu', 15) + 'Vedi tutte le ' + C.totaleDaFare + '</button>' +
          '</section>' +
          '<section class="p10-abit">' +
            '<span class="p10-eti2">Per area</span>' +
            '<div class="p10-aree">' + C.aree.map(function (a) {
              return '<button>' + a + '</button>';
            }).join('') + '</div>' +
            '<p class="p10-piede">' + C.ferme + ' inattive da tre settimane. <button class="p10-link">Rivedile</button></p>' +
          '</section>' +
        '</div>' +
        '<nav class="p10-basso">' + C.pagine.map(function (p) {
          return '<a class="' + (p.id === 'attivita' ? 'qui' : '') + '">' + I(p.ico, 20) + '<span>' + p.nome + '</span></a>';
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
        '<p class="lab-guida">Dieci interfacce vere per la stessa app. In tutte c’è un titolo che dice dove sei, ' +
        'un solo pulsante pieno con la cosa che conviene fare, caselle da spuntare e voci fatte allo stesso modo. ' +
        'Cambia il resto: dove sta la navigazione, quanto è densa la lista, chiaro o scuro, una colonna o due, ' +
        'quanto è grande il tocco. I contenuti sono identici in tutte, così il confronto è onesto.</p>' +
        '<div class="lab-rail" role="tablist" aria-label="Dieci interfacce">' +
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
              '<button data-w="si" class="' + (largo ? 'on' : '') + '" title="Larghezza da monitor">' + I('schermoGrande', 15) + '</button>' +
              '<button data-w="no" class="' + (largo ? '' : 'on') + '" title="Larghezza da telefono">' + I('schermoPiccolo', 15) + '</button>' +
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
