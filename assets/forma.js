/* LA FORMA DI OGNI COSA: l'angolo continuo di Apple, disegnato a runtime.

   ────────────────────────────────────────────────────────────────────────
   PERCHÉ NON È PIÙ UN FOGLIO DI STILE GENERATO
   ────────────────────────────────────────────────────────────────────────
   Fino a ieri la forma la faceva un blocco di CSS generato — trecento
   kilobyte di `clip-path: polygon(...)` con dentro `min()` e `calc()` per
   ogni singola coordinata — e il bordo, che il ritaglio taglia proprio
   sull'angolo, veniva RIDISEGNATO come anello cavo su uno pseudo-elemento.
   Erano due disegni per una cosa sola, e ogni difetto trovato in due mesi
   nasce da lì: l'anello che scorre col contenuto e finisce in mezzo al testo,
   l'anello che atterra sullo pseudo-elemento di qualcun altro, il bordo
   dipinto due volte, l'`overflow` che se lo mangia, l'ombra dura usata al suo
   posto che negli angoli lascia una fessura. Undici modi di rompersi, tutti
   con la stessa faccia: «il bordo sembra tagliato».
   E in più le percentuali di un poligono si risolvono PER ASSE, quindi il
   raggio andava tagliato in anticipo sul lato più corto — il che richiedeva di
   MISURARE l'app con un browser, tenere una tabella (segni/misure.json), e
   accettare che i cinquantun selettori mai apparsi in una scena si tenessero
   un arco di cerchio. E i campi di form restavano fuori del tutto: `input`,
   `select` e `textarea` non generano pseudo-elementi, quindi non potevano
   avere l'anello, quindi non potevano avere la forma.

   Qui il tracciato si calcola in PIXEL, sulla misura vera di quell'elemento in
   quel momento. Da questo discende tutto il resto:
     · niente `min()`, niente `calc()`, niente regola di riempimento dentro il
       valore: solo numeri. È la cosa più noiosa che un motore possa leggere, e
       la fragilità di WebKit che aveva spento i bordi sull'iPad non può più
       esistere;
     · niente tabella dei raggi e niente misure: il limite si applica qui, con
       la misura in mano;
     · niente selettori dimenticati: si guarda il DOM, non un elenco;
     · i campi di form ce l'hanno anche loro.

   ────────────────────────────────────────────────────────────────────────
   IL BORDO VIENE DALLO STESSO TRACCIATO
   ────────────────────────────────────────────────────────────────────────
   È la parte che conta. Il contorno non è più un secondo elemento: è
   un'IMMAGINE DI SFONDO, un SVG grande esattamente quanto il riquadro del
   bordo, con dentro lo stesso `d` del ritaglio, disegnato come linea.
   Uno sfondo si dipinge insieme all'elemento, dentro il suo riquadro del
   bordo. Quindi:
     · non può scorrere via, perché non è posizionato: sta attaccato al
       riquadro, non al contenuto (è il senso di `background-attachment:
       scroll`, che è il valore normale);
     · non può finire sullo pseudo-elemento di qualcun altro, perché non è uno
       pseudo-elemento;
     · non può essere dipinto due volte, perché il bordo del box lo spegniamo
       noi qui, sullo stesso elemento e nello stesso istante;
     · non può essere mangiato da un `overflow`, che taglia il CONTENUTO e non
       lo sfondo di chi taglia;
     · e non può disegnare una curva diversa da quella della forma, perché è
       la stessa stringa.

   ────────────────────────────────────────────────────────────────────────
   PERCHÉ UN RITAGLIO E NON UNA MASCHERA
   ────────────────────────────────────────────────────────────────────────
   Una maschera SVG (`mask-image`) è la strada più corta e dà la stessa forma.
   Ma una maschera si applica DOPO tutto, e porta via l'ombra dell'elemento —
   misurato: con la maschera addosso sparisce sia il `box-shadow` sia un
   `filter: drop-shadow()` messo sullo stesso elemento; per riaverla ci vuole
   un involucro attorno a ogni cosa che ne ha una. Qui le ombre dichiarate sono
   centoventi e i contorni del fuoco stanno su tutto: un involucro per ognuno
   vuol dire toccare ogni schermata.
   Il ritaglio invece si può fare più LARGO del riquadro: il tracciato comincia
   duecento pixel fuori da ogni lato e toglie solo i quattro morsi d'angolo.
   Ombre, aloni e contorni del fuoco continuano a vedersi, esattamente come
   prima, e la forma è la stessa.
   Il buco negli angoli si fa girando i morsi al CONTRARIO del rettangolone:
   due contorni in versi opposti fanno un buco anche col riempimento normale,
   quindi non serve nessuna regola di riempimento — che è poi la funzione che
   WebKit non fa e che aveva spento tutto.  */

(function () {
  'use strict';

  /* ---------------------------------------------------------------
     LE COSTANTI DELL'ANGOLO DI APPLE
     Sono in unità di raggio e partono dal vertice: la prima coordinata corre
     lungo un lato, la seconda lungo l'altro. Vengono da
     `UIBezierPath(roundedRect:cornerRadius:)`, e sono le stesse che stanno in
     segni/apple.mjs — se si toccano là vanno toccate qui.
     La proprietà che conta non è la forma, è la CURVATURA: i due punti di
     controllo della prima Bézier stanno SUL lato insieme al punto di
     partenza, e tre punti allineati vogliono dire curvatura zero all'attacco.
     Un arco di cerchio invece tiene 1/r fino al lato e poi salta a zero:
     quello scalino l'occhio lo vede senza saper dire cosa sia.
     L'angolo si mangia 1.528665 raggi lungo OGNI lato — una volta e mezza —
     ed è per questo che a parità di numero non sembra più squadrato di un
     arco: toglie l'1.05 della sua area, cioè un filo di più.  */
  var INIZIO = 1.528665;
  var CURVE = [
    { c1: [1.08849296, 0], c2: [0.86840694, 0], p: [0.63149379, 0.07491139] },
    { c1: [0.37282383, 0.16905956], c2: [0.16905956, 0.37282383], p: [0.07491139, 0.63149379] },
    { c1: [0, 0.86840694], c2: [0, 1.08849296], p: [0, 1.528665] }
  ];
  /* il lato più corto che regge un raggio: due angoli da 1.528665 raggi
     ciascuno devono starci dentro senza incontrarsi */
  var MIN_LATO = 2 * INIZIO;

  /* quanto il ritaglio esce dal riquadro. Serve solo a non tagliare le ombre
     e i contorni del fuoco: dentro quel rettangolone si toglie soltanto la
     roba dei quattro angoli. */
  var FUORI = 200;

  var n = function (x) {
    /* due decimali: un centesimo di pixel non lo vede nessuno nemmeno a
       schermo triplo, e i numeri corti tengono corta la stringa */
    var v = Math.round(x * 100) / 100;
    return v === 0 ? '0' : String(v);
  };

  /* ---------------------------------------------------------------
     I QUATTRO ANGOLI, e come si mappano sul riquadro.
     Il giro è ORARIO e comincia in cima a sinistra, subito dopo l'angolo.
     Ogni mappa porta le coordinate canoniche (u lungo un lato, v lungo
     l'altro, misurate dal vertice) al punto assoluto dentro un riquadro
     w × h. Sono scritte a mano una volta e non si toccano più: sbagliarne
     una specchia un angolo, e si vede subito. */
  var MAPPE = {
    tr: function (u, v, w, h, r) { return [w - u * r, v * r]; },
    br: function (u, v, w, h, r) { return [w - v * r, h - u * r]; },
    bl: function (u, v, w, h, r) { return [u * r, h - v * r]; },
    tl: function (u, v, w, h, r) { return [v * r, u * r]; }
  };

  /* le tre Bézier di un angolo, già mappate: [c1, c2, p] in coordinate
     assolute, nell'ordine in cui le percorre il giro orario */
  function curveDi(dove, w, h, r) {
    var m = MAPPE[dove];
    return CURVE.map(function (c) {
      return [m(c.c1[0], c.c1[1], w, h, r), m(c.c2[0], c.c2[1], w, h, r), m(c.p[0], c.p[1], w, h, r)];
    });
  }
  var C = function (t) { return 'C' + n(t[0][0]) + ' ' + n(t[0][1]) + ' ' + n(t[1][0]) + ' ' + n(t[1][1]) + ' ' + n(t[2][0]) + ' ' + n(t[2][1]); };

  /* Il contorno pieno, orario: serve per il bordo. `ang` è {tl,tr,br,bl} in
     pixel, già limitati. */
  function contorno(w, h, ang, dx) {
    dx = dx || 0;                       /* rientro, per il filo del bordo */
    var W = w - dx * 2, H = h - dx * 2;
    var R = { tl: Math.max(0, ang.tl - dx), tr: Math.max(0, ang.tr - dx), br: Math.max(0, ang.br - dx), bl: Math.max(0, ang.bl - dx) };
    var L = function (k) { return INIZIO * R[k]; };
    var q = function (p) { return [p[0] + dx, p[1] + dx]; };
    var pezzi = ['M' + n(L('tl') + dx) + ' ' + n(dx)];
    var giro = [['tr', W, 0], ['br', W, H], ['bl', 0, H], ['tl', 0, 0]];
    var lineaA = { tr: [W - L('tr'), 0], br: [W, H - L('br')], bl: [L('bl'), H], tl: [0, L('tl')] };
    giro.forEach(function (g) {
      var k = g[0];
      var a = q(lineaA[k]);
      pezzi.push('L' + n(a[0]) + ' ' + n(a[1]));
      if (R[k] > 0) curveDi(k, W, H, R[k]).forEach(function (t) { pezzi.push(C([q(t[0]), q(t[1]), q(t[2])])); });
    });
    pezzi.push('Z');
    return pezzi.join('');
  }

  /* Il tracciato del RITAGLIO: un rettangolone che esce di duecento pixel da
     ogni lato, meno i quattro morsi d'angolo. Il rettangolone gira in un
     verso, i morsi nell'altro, e col riempimento normale il verso opposto fa
     il buco: nessuna regola di riempimento da dichiarare, e quindi niente da
     far rifiutare a un motore.
     Solo il morso in alto a sinistra gira già come il rettangolone (le mappe
     degli altri tre scambiano o specchiano gli assi), quindi quello va
     percorso al contrario. */
  function ritaglio(w, h, ang) {
    var p = ['M' + n(-FUORI) + ' ' + n(-FUORI) + 'L' + n(w + FUORI) + ' ' + n(-FUORI) +
             'L' + n(w + FUORI) + ' ' + n(h + FUORI) + 'L' + n(-FUORI) + ' ' + n(h + FUORI) + 'Z'];
    var vertici = { tl: [0, 0], tr: [w, 0], br: [w, h], bl: [0, h] };
    /* dove COMINCIA il giro di ogni angolo, secondo la sua mappa. Per tre
       angoli su quattro è sul primo dei due lati; per quello in alto a
       sinistra la mappa scambia gli assi, quindi comincia sul lato
       SINISTRO — scriverlo come gli altri gli fa disegnare il morso al
       rovescio, e l'angolo viene via tagliato di netto in diagonale. */
    var primo = { tl: [0, INIZIO * ang.tl], tr: [w - INIZIO * ang.tr, 0], br: [w, h - INIZIO * ang.br], bl: [INIZIO * ang.bl, h] };
    ['tl', 'tr', 'br', 'bl'].forEach(function (k) {
      if (!(ang[k] > 0)) return;
      var cc = curveDi(k, w, h, ang[k]);
      var v = vertici[k], a = primo[k];
      /* IL VERSO. Il morso deve girare al CONTRARIO del rettangolone, se no il
         riempimento normale non ci fa un buco: lo unisce, e il morso non
         toglie niente. Sembra un dettaglio e non lo è — con il morso unito
         resta a vista soltanto il `border-radius`, cioè un arco di cerchio,
         e tutto il lavoro della curva di Apple non si vede.
         Misurato per AREA CON SEGNO su un riquadro 200×200 col raggio 40: il
         rettangolone dà +360000, e i quattro morsi scritti così danno tutti
         −1870. Vanno tutti e quattro nello stesso verso, e nessuno va
         rovesciato: la mappa dell'angolo in alto a sinistra scambia già i due
         assi, e lo scambio da solo gli gira il verso. Rovesciarlo «per
         simmetria» con gli altri lo rimetteva concorde al rettangolone. */
      p.push('M' + n(v[0]) + ' ' + n(v[1]) + 'L' + n(a[0]) + ' ' + n(a[1]));
      cc.forEach(function (t) { p.push(C(t)); });
      p.push('Z');
    });
    return p.join('');
  }

  /* ---------------------------------------------------------------
     QUANTO PUÒ ESSERE GRANDE UN ANGOLO
     I due angoli di un lato si mangiano 1.528665 raggi ciascuno: se il lato è
     più corto della loro somma si incontrano, e la forma si strozza in una
     punta — una barretta alta nove pixel col raggio da otto diventava una
     foglia. Qui la misura ce l'abbiamo, quindi il limite si applica sul posto
     e non serve nessuna tabella. */
  function limita(r, w, h) {
    return Math.max(0, Math.min(r, Math.min(w, h) / MIN_LATO));
  }

  /* ---------------------------------------------------------------
     UNA FAMIGLIA SOLA, E DUE ECCEZIONI CHE NON SONO ECCEZIONI.
     Per un po' le pastiglie sono rimaste fuori: nel sistema di Apple una
     pastiglia è una `Capsule` con le estremità a semicerchio, e sembrava
     giusto lasciargliele. Guardato da vicino era sbagliato: la barra delle
     sezioni è un supercerchio e il tasto acceso che ci sta DENTRO era una
     capsula, a tre pixel di distanza. Due famiglie di forme nello stesso
     posto si leggono come uno sbaglio, e lo sono.
     Adesso chiunque dichiari un raggio da pastiglia prende la stessa curva,
     al raggio più grande che ci sta: lato corto diviso 3.057, cioè il caso in
     cui i due angoli si toccano esattamente a metà del lato corto. È la forma
     dell'icona di iOS applicata a un'estremità — più tonda di un rettangolo
     arrotondato, meno di un semicerchio, e della stessa famiglia di tutto il
     resto.
     Resta fuori una cosa sola: il TONDO. Un elemento quadrato che chiede
     mezzo lato di raggio non sta chiedendo una pastiglia, sta chiedendo un
     cerchio — un pallino di stato, un'immagine di profilo — e un cerchio non
     è una forma della famiglia: è quello che è. */
  function eCapsula(r, w, h) { return r >= Math.min(w, h) / 2 - 0.51; }
  function eTondo(r, w, h) { return eCapsula(r, w, h) && Math.abs(w - h) <= 2; }

  /* ---------------------------------------------------------------
     IL FILO DEL BORDO, come immagine di sfondo.
     L'SVG è grande esattamente quanto il riquadro del bordo e la linea è
     centrata su un tracciato rientrato di mezzo spessore: così il filo occupa
     esattamente l'area che occuperebbe un bordo vero, che il CSS disegna
     DENTRO il riquadro. */
  var cache = Object.create(null);
  var quanti = 0;
  function filo(w, h, ang, sp, colore) {
    var chiave = w + '|' + h + '|' + ang.tl + '|' + ang.tr + '|' + ang.br + '|' + ang.bl + '|' + sp + '|' + colore;
    if (cache[chiave]) return cache[chiave];
    var d = contorno(w, h, ang, sp / 2);
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
      '<path d="' + d + '" fill="none" stroke="' + colore + '" stroke-width="' + sp + '"/></svg>';
    var url = 'url("data:image/svg+xml,' + encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22') + '")';
    /* la cache non cresce all'infinito: le misure si ripetono moltissimo (i
       trecentosessantacinque quadratini dell'anno sono tutti uguali), e quando
       smette di ripetersi vuol dire che è cambiata la pagina */
    if (quanti > 400) { cache = Object.create(null); quanti = 0; }
    cache[chiave] = url; quanti++;
    return url;
  }

  /* ---------------------------------------------------------------
     APPLICARE, a un elemento solo
     --------------------------------------------------------------- */
  var VIETATI = { BR: 1, HR: 1, IMG: 1, SVG: 1, PATH: 1, CANVAS: 1, OPTION: 1 };

  function raggiDi(s) {
    /* `border-top-left-radius` può essere ellittico («8px 12px»): si prende il
       primo numero, che è quello orizzontale — nell'app non ce ne sono di
       ellittici, e se ne comparisse uno è meglio una curva sola che una forma
       sbagliata */
    return ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius']
      .map(function (k) { return parseFloat(s[k]) || 0; });
  }

  function applica(e) {
    var s = getComputedStyle(e);
    if (s.display === 'none' || s.visibility === 'hidden') return;
    /* LA MISURA SI CHIEDE AL LAYOUT, NON ALLO SCHERMO.
       `getBoundingClientRect()` restituisce il riquadro DIPINTO, cioè con
       dentro le trasformazioni: se un elemento viene misurato mentre la sua
       schermata sta ancora entrando (l'animazione la scala da 0.98 a 1) il
       tracciato nasce su una misura che fra due decimi di secondo non esiste
       più — e nessuno lo risveglia, perché il riquadro di LAYOUT non è mai
       cambiato e l'osservatore delle misure guarda quello. Si vedeva come un
       filo di fondo che sporgeva dall'angolo di qualche tasto, sempre di
       schermate diverse.
       `offsetWidth` invece è la misura di layout, e le trasformazioni non la
       toccano. È un intero: mezzo pixel di scarto sposta la curva di un
       quarto di pixel e allunga il filo dello 0.2 per cento. */
    var w = e.offsetWidth, h = e.offsetHeight;
    if (!(w > 2) || !(h > 2)) {
      /* NON HA ANCORA UNA MISURA, MA CE L'AVRÀ. Se ce ne andiamo e basta,
         quando crescerà non se ne accorgerà nessuno: l'osservatore delle
         misure lo attacchiamo in fondo, e in fondo non ci si arriva mai.
         Succedeva al telaio del Design lab, che nasce chiuso e poi si apre.
         Ci si mette in ascolto solo se ha un angolo da fare: mettersi in
         ascolto su tutto quello che in questo momento è alto zero pixel vuol
         dire ascoltare mezza pagina. */
      if ((parseFloat(s.borderTopLeftRadius) || 0) > 0.4) osserva(e);
      return;
    }
    /* IL RAGGIO SI LEGGE SEMPRE DAL FOGLIO DI STILE, MAI DA QUELLO CHE
       ABBIAMO SCRITTO NOI.
       Poco più sotto il raggio lo riscriviamo al 99% (serve all'ombra, vedi
       là). Se alla passata dopo si rileggesse quel valore, il 99% si
       applicherebbe al 99% del 99%, e ogni giro l'angolo si smusserebbe di un
       altro punto percentuale. Non è teoria: la barra in basso, che è l'unico
       elemento che non viene mai ricreato, dichiarava un raggio da 18 pixel e
       ne disegnava 5.8 — centododici riduzioni una sull'altra. E siccome ogni
       elemento ne subiva un numero diverso a seconda di quanto a lungo era
       vissuto, l'app finiva con forme diverse in punti diversi: era questo, e
       non la curva, a farle sembrare di famiglie diverse.
       La cura non è ricordarsi il valore in un attributo — un attributo si può
       perdere, e infatti si perdeva a ogni cambio di tema. È azzerare quello
       che abbiamo scritto noi e chiedere di nuovo al foglio di stile: quello
       non cambia mai, e il conto riparte sempre dallo stesso numero. */
    /* ─────────────────────────────────────────────────────────────
       LEGGERE L'ORIGINALE, MAI QUELLO CHE ABBIAMO SCRITTO NOI.
       Qui dentro si scrivono tre cose sull'elemento: il raggio (ridotto al
       99%, serve all'ombra), il colore del bordo (spento, perché lo ridisegna
       il filo) e l'immagine di sfondo (il filo). Tutte e tre, rilette alla
       passata dopo, darebbero il valore NOSTRO e non quello del foglio di
       stile — e da lì nascono due guasti che si sono visti tutti e due:
         · il raggio si riduceva del 99% del 99% del 99%… La barra in basso,
           che è l'unico elemento che non viene mai ricreato, dichiarava 18
           pixel e ne disegnava 5.8: centododici giri. E siccome ogni elemento
           ne subiva un numero diverso a seconda di quanto era vissuto, l'app
           finiva con forme diverse in punti diversi — era questo a farle
           sembrare di famiglie diverse, non la curva;
         · il colore del bordo, riletto dopo averlo spento, torna
           «trasparente»: il filo non veniva più ridisegnato e restava quello
           vecchio, disegnato su una misura di prima. Nella barra in basso si
           vedeva come una seconda cornice, più piccola, in mezzo alle icone.
       Quindi: si legge una volta sola e si tiene da parte; e se quello che
       avevamo tenuto da parte non c'è più, prima di rileggere si AZZERA tutto
       quello che avevamo scritto. Costa un ricalcolo, e capita una volta per
       elemento. */
    var raggi, col, sotto;
    if (e.dataset.formaRaggi === undefined || e.dataset.formaBordo === undefined) {
      e.style.borderRadius = '';
      e.style.borderColor = '';
      e.style.backgroundImage = '';
      s = getComputedStyle(e);
      raggi = raggiDi(s);
      var spBase = parseFloat(s.borderTopWidth) || 0;
      col = (spBase > 0 && !vuoto(s.borderTopColor)) ? s.borderTopColor : '';
      sotto = s.backgroundImage === 'none' ? '' : s.backgroundImage;
      e.dataset.formaRaggi = raggi.join(',');
      e.dataset.formaBordo = col;
      e.dataset.formaSfondo = sotto;
      delete e.dataset.forma;          /* la firma di prima non vale più */
    } else {
      raggi = e.dataset.formaRaggi.split(',').map(Number);
      col = e.dataset.formaBordo;
      sotto = e.dataset.formaSfondo || '';
    }
    var max = Math.max.apply(null, raggi);
    if (max <= 0.4) { spegni(e); return; }
    if (eTondo(max, w, h)) { spegni(e); return; }

    var ang = {
      tl: limita(raggi[0], w, h), tr: limita(raggi[1], w, h),
      br: limita(raggi[2], w, h), bl: limita(raggi[3], w, h)
    };
    var sp = parseFloat(s.borderTopWidth) || 0;

    var firma = w + 'x' + h + '|' + ang.tl + ',' + ang.tr + ',' + ang.br + ',' + ang.bl + '|' + sp + '|' + col;
    if (e.dataset.forma === firma) return;
    e.dataset.forma = firma;

    e.style.clipPath = 'path("' + ritaglio(w, h, ang) + '")';
    /* IL `border-radius` RESTA, AL 99 PER CENTO. Non serve più a dare la
       forma — quella la fa il ritaglio — ma serve ancora all'OMBRA e al
       contorno del fuoco, che seguono lui e che un raggio a zero renderebbe
       due rettangoli spigolosi attorno a una cosa tonda.
       Il taglio del 99% non è una precauzione a caso: il ritaglio può solo
       TOGLIERE, quindi dove l'arco del `border-radius` passa più interno
       della curva di Apple vince l'arco, e in quella fascia la forma torna
       ad avere lo scalino di curvatura che tutta questa storia esiste per
       togliere. Misurato: a raggio pieno l'arco entra dentro la curva per
       0.1125 px; al 99% non entra mai più, in nessun punto. */
    /* si scrive il raggio EFFETTIVO, non quello dichiarato: una pastiglia
       dichiara 999px, e lasciandoglielo l'ombra le girerebbe intorno a
       semicerchio mentre la forma è un supercerchio — l'ombra sporgerebbe
       dalle estremità. */
    var giu = [ang.tl, ang.tr, ang.br, ang.bl].map(function (x) { return (x * 0.99).toFixed(2) + 'px'; });
    e.style.borderRadius = giu[0] + ' ' + giu[1] + ' ' + giu[2] + ' ' + giu[3];
    if (col) {
      /* Il bordo del box si spegne QUI, sullo stesso elemento e nello stesso
         momento in cui compare il filo: non c'è nessun istante in cui uno dei
         due manca o ci sono tutti e due. Lo spessore resta, perché è misura:
         toglierlo sposterebbe il contenuto di due pixel. */
      /* SENZA SFUMARE. Quasi tutti questi elementi hanno una transizione sul
         colore del bordo (`.btn`, `.card`, i tasti degli stati): spegnendolo,
         il colore non sparisce — ci mette un decimo di secondo a sfumare, e
         in quel decimo di secondo il filo nuovo e il bordo vecchio si vedono
         TUTTI E DUE. Su un ridisegno per volta è un lampo; su una schermata
         che si ricostruisce mentre ci si muove dentro è il bordo doppio che
         si vede nelle foto.
         La transizione si spegne con un attributo che noi non osserviamo (se
         fosse una classe, l'osservatore degli attributi si risveglierebbe e
         il giro non finirebbe), e si riaccende dopo che il valore è stato
         messo davvero — una sola volta per passata, in fondo. */
      e.dataset.formaSecca = '1';
      secchi.push(e);
      e.style.borderColor = 'transparent';
      e.style.backgroundImage = filo(w, h, ang, sp, col) + (sotto ? ', ' + sotto : '');
      e.style.backgroundRepeat = 'no-repeat' + (sotto ? ', repeat' : '');
      e.style.backgroundSize = '100% 100%' + (sotto ? ', auto' : '');
      e.style.backgroundOrigin = 'border-box' + (sotto ? ', padding-box' : '');
      e.style.backgroundClip = 'border-box' + (sotto ? ', border-box' : '');
    }
    osserva(e);
  }

  /* un colore è «vuoto» se non si vede: conta l'ALFA, non quali siano i tre
     numeri davanti. `rgba(16, 17, 22, 0)` è invisibile quanto
     `rgba(0, 0, 0, 0)`, e cercare solo il secondo lasciava passare per bordo
     vero un bordo che non c'è. */
  function vuoto(c) {
    if (!c || c === 'transparent' || c === 'none') return true;
    var m = /^rgba?\(([^)]*)\)/.exec(c);
    if (!m) return false;
    var p = m[1].split(/[,/]/);
    return p.length > 3 && parseFloat(p[3]) < 0.004;
  }

  function spegni(e) {
    if (e.dataset.forma === undefined) return;
    e.style.clipPath = '';
    e.style.borderRadius = '';
    if (e.dataset.formaBordo) {
      e.style.borderColor = '';
      e.style.backgroundImage = e.dataset.formaSfondo || '';
      e.style.backgroundRepeat = ''; e.style.backgroundSize = '';
      e.style.backgroundOrigin = ''; e.style.backgroundClip = '';
    }
    delete e.dataset.forma;
  }

  /* ---------------------------------------------------------------
     QUANDO RIFARE I CONTI
     Tre cose cambiano la forma di un elemento: che compaia, che cambi misura,
     e che cambi il tema (i colori del bordo). Per le prime due ci sono i due
     osservatori; il tema arriva come evento.
     Gli osservatori guardano SOLO la comparsa dei figli e la misura: se
     guardassero anche gli attributi, scrivere lo stile qui dentro li
     risveglierebbe e il giro non finirebbe mai. */
  /* CHI SI È MOSSO. Non basta guardare i figli che compaiono: un elemento può
     cambiare faccia senza che nasca o muoia niente.
       · un pannello nascosto si mostra togliendo `hidden`: nessun figlio
         nuovo, e finché era nascosto non aveva misura, quindi non era stato
         disegnato. La cattura rapida restava con l'angolo tondo normale;
       · una classe cambia il COLORE del bordo — un tasto che diventa primario,
         una scheda che si accende. Il colore che avevamo tenuto da parte non
         vale più: il bordo del box torna a vedersi, e sopra ci resta il filo
         vecchio. Da fuori è un bordo doppio.
     Quindi si guardano anche gli attributi, ma solo quelli che NOI non
     scriviamo mai: `class`, `hidden`, `disabled` e i tre `aria-` degli stati.
     Su `style` non si può, perché lo scriviamo qui dentro e il giro non
     finirebbe più. */
  var ATTR = ['class', 'hidden', 'disabled', 'aria-checked', 'aria-expanded', 'aria-pressed'];
  var mossi = [];
  var inCoda = false;
  var secchi = [];

  function scordaUno(e) {
    delete e.dataset.formaRaggi;
    delete e.dataset.formaBordo;
    delete e.dataset.formaSfondo;
    delete e.dataset.forma;
  }

  /* le transizioni si riaccendono in fondo alla passata, dopo aver costretto
     il browser a fare i conti una volta: così il valore «trasparente» è già
     quello buono e riaccendere non fa ripartire niente. Un ricalcolo per
     passata, non uno per elemento. */
  function riaccendi() {
    if (!secchi.length) return;
    void document.body.offsetWidth;
    for (var i = 0; i < secchi.length; i++) delete secchi[i].dataset.formaSecca;
    secchi = [];
  }

  function passa() {
    var lista = mossi; mossi = [];
    /* oltre un certo numero di rami conviene rifare tutto: cercare i
       duplicati fra le sottochiome costa più che una passata sola */
    if (!lista.length || lista.length > 60) { tutti(); riaccendi(); return; }
    lista.forEach(function (e) {
      if (!e.isConnected) return;
      tutti(e);
      if (e.nodeType === 1 && !VIETATI[e.tagName]) prova(e);
    });
    riaccendi();
  }

  /* SI ASPETTA IL PRIMO DEI DUE, non il fotogramma.
     `requestAnimationFrame` è la scelta giusta finché la pagina si disegna,
     perché fa i conti una volta sola per fotogramma. Ma in una scheda in
     secondo piano il browser NON disegna, quindi quel fotogramma non arriva
     mai — e la pagina resta con gli angoli tondi normali finché non torna
     davanti. Si vede quando qualcuno fotografa la pagina senza guardarla, ed
     è come si è visto qui: la sonda che gira su cinquanta schermate ne
     trovava una decina «senza forma» a caso, e guardate una per una erano a
     posto. Il timer arriva anche al buio; chi arriva primo fa il lavoro. */
  function piano() {
    if (inCoda) return;
    inCoda = true;
    var fatto = false;
    var giro = function () {
      if (fatto) return;
      fatto = true; inCoda = false;
      passa();
    };
    requestAnimationFrame(giro);
    setTimeout(giro, 32);
  }
  /* L'OSSERVATORE DELLE MISURE, uno solo per tutti: un elemento che cambia
     misura cambia forma, e il tracciato è in pixel. */
  var ro = typeof ResizeObserver === 'function' ? new ResizeObserver(function (voci) {
    voci.forEach(function (v) { prova(v.target); });
  }) : null;
  function osserva(e) {
    if (!ro || e.dataset.formaOss) return;
    e.dataset.formaOss = '1';
    ro.observe(e);
  }

  /* UN ELEMENTO CHE SCOPPIA NON PUÒ PORTARSI DIETRO TUTTI GLI ALTRI.
     La passata è un ciclo solo su tutta la pagina: un'eccezione a metà lo
     interrompe, e da lì in poi nessuno ha più la forma. È successo davvero —
     una funzione spostata durante una riscrittura, e con lei sono spariti gli
     angoli di ventisette caselle su ventisette e di tutto quello che veniva
     dopo. Il difetto non si vedeva dove nasceva: si vedeva ovunque. */
  function prova(e) {
    try { applica(e); }
    catch (err) {
      if (!prova.detto) { prova.detto = 1; if (window.LMLog) LMLog.errore('forma', String(err)); else console.error('forma', err); }
    }
  }

  function tutti(radice) {
    var dove = radice || document.body;
    if (!dove) return;
    var lista = dove.querySelectorAll('*');
    for (var i = 0; i < lista.length; i++) {
      var e = lista[i];
      if (VIETATI[e.tagName]) continue;
      prova(e);
    }
    if (!radice && document.body) prova(document.body);
  }

  /* il cambio di tema cambia i colori dei bordi: si buttano via i colori
     tenuti da parte e si rifà tutto */
  function scorda() {
    cache = Object.create(null); quanti = 0;
    var lista = document.querySelectorAll('[data-forma-bordo]');
    for (var i = 0; i < lista.length; i++) {
      delete lista[i].dataset.formaBordo;
      delete lista[i].dataset.formaSfondo;
      delete lista[i].dataset.forma;
    }
    tutti(); riaccendi();
  }

  function avvia() {
    if (!document.body) { document.addEventListener('DOMContentLoaded', avvia); return; }
    var reg = document.createElement('style');
    reg.id = 'forma-regole';
    reg.textContent = '[data-forma-secca]{transition:none!important}';
    document.head.appendChild(reg);

    /* UN FOGLIO DI STILE CHE ARRIVA DOPO CAMBIA I RAGGI.
       Il raggio si legge una volta e si tiene da parte (se lo si rileggesse
       si rileggerebbe quello ridotto da noi, vedi sopra). Ma «una volta»
       vuol dire «al momento in cui l'elemento è comparso», e se il foglio di
       stile che gli dà l'angolo arriva DOPO, quel momento aveva ragione a
       dire zero. È il Design lab: il suo foglio se lo carica lui quando lo
       apri, e il telaio restava senza forma per sempre.
       Quindi si guarda la testata: ogni `<link>` o `<style>` che compare
       butta via tutto quello che avevamo tenuto da parte. Capita tre o
       quattro volte in tutta la vita della pagina. */
    var nuovoFoglio = function (n) {
      if (!n || n.nodeType !== 1 || n.id === 'forma-regole') return false;
      if (n.tagName === 'STYLE') return true;
      if (n.tagName === 'LINK' && /stylesheet/i.test(n.rel || '')) {
        n.addEventListener('load', scorda);
        return true;
      }
      return false;
    };
    new MutationObserver(function (muta) {
      var serve = false;
      for (var i = 0; i < muta.length; i++)
        for (var j = 0; j < muta[i].addedNodes.length; j++)
          if (nuovoFoglio(muta[i].addedNodes[j])) serve = true;
      if (serve) scorda();
    }).observe(document.head, { childList: true });
    /* e una volta quando la pagina ha finito di caricare tutto */
    if (document.readyState !== 'complete') window.addEventListener('load', scorda);

    tutti(); riaccendi();
    new MutationObserver(function (muta) {
      for (var i = 0; i < muta.length; i++) {
        var m = muta[i];
        if (m.type === 'attributes') {
          /* la faccia può essere cambiata: si butta via quello che avevamo
             tenuto da parte, così alla passata dopo si rilegge dal foglio di
             stile invece che da quello che abbiamo scritto noi */
          if (m.target.nodeType === 1) { scordaUno(m.target); mossi.push(m.target); }
        } else if (m.target && m.target.nodeType === 1) {
          mossi.push(m.target);
        }
      }
      piano();
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ATTR });
    /* IL TEMA lo si guarda dall'attributo, non da un evento: così questo file
       non ha bisogno di sapere niente dell'app, e nessuno deve ricordarsi di
       avvisarlo. Cambiando tema cambiano i colori dei bordi, quindi i colori
       tenuti da parte vanno buttati via. */
    /* e solo se è cambiato DAVVERO: l'app riscrive quei due attributi a ogni
       ridisegno, anche con lo stesso valore, e un osservatore si sveglia lo
       stesso. Rifare tutto da capo cento volte al minuto non serve a
       nessuno. */
    var temaOra = function () {
      var d = document.documentElement;
      return (d.getAttribute('data-mode') || '') + '/' + (d.getAttribute('data-skin') || '');
    };
    var temaPrima = temaOra();
    new MutationObserver(function () {
      var q = temaOra();
      if (q === temaPrima) return;
      temaPrima = q; scorda();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode', 'data-skin'] });
    /* i caratteri cambiano le misure quando arrivano: senza questo la prima
       schermata resta disegnata sulle misure del carattere di ripiego */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(piano);
    window.addEventListener('resize', piano);
  }

  window.LM_FORMA = {
    tutti: tutti, applica: applica, scorda: scorda, piano: piano,
    ritaglio: ritaglio, contorno: contorno, limita: limita, INIZIO: INIZIO
  };
  avvia();
})();
