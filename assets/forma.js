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
  function eQuadro(w, h) { return Math.abs(w - h) <= 2; }

  /* ...MA NON SE HA UN FRATELLO UGUALE CHE QUADRATO NON E'.
     Le due pastiglie «sì» e «no», una accanto all'altra, stesso mestiere,
     stessa classe: «sì» veniva 45x44 (quadrata: cerchio) e «no» 48x44 (non
     quadrata: supercerchio a raggio lato/3.057). Tre pixel di parola in piu'
     e la forma cambiava famiglia. Una tonda e una rettangolare, appaiate, si
     leggono come uno sbaglio — che e' esattamente quello che questo commento
     dice piu' sopra, e che questa regola faceva succedere proprio nel punto
     di confine.
     Un pallino di stato, una pastiglia col numero, l'anello del timer sono
     quadrati per come sono fatti, e i loro fratelli lo sono quanto loro.
     Una pastiglia che viene quadrata per via di quante lettere ha dentro no.
     La differenza si legge dai fratelli: se uno che porta la stessa classe
     non e' quadrato, allora quadrato lo sei per caso, e la forma la prendi
     come lui. Guardati su tutte le schermate: gli unici quadrati con un
     fratello di misura diversa erano quelle due pastiglie. */
  function fratelliQuadri(e) {
    var pa = e.parentNode;
    if (!pa || pa.nodeType !== 1) return true;
    var mie = (typeof e.className === 'string' ? e.className : '').trim().split(/\s+/).filter(Boolean);
    if (!mie.length) return true;
    var c = pa.children;
    for (var i = 0; i < c.length; i++) {
      var o = c[i];
      if (o === e || o.tagName !== e.tagName) continue;
      var sue = (typeof o.className === 'string' ? o.className : '').trim().split(/\s+/);
      var insieme = false;
      for (var j = 0; j < mie.length; j++) if (sue.indexOf(mie[j]) >= 0) { insieme = true; break; }
      if (!insieme) continue;
      var ow = o.offsetWidth, oh = o.offsetHeight;
      if (ow > 2 && oh > 2 && !eQuadro(ow, oh)) return false;
    }
    return true;
  }
  function eTondo(r, w, h, e) {
    return eCapsula(r, w, h) && eQuadro(w, h) && (!e || fratelliQuadri(e));
  }

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

  function raggiDi(s, w, h) {
    /* `border-top-left-radius` può essere ellittico («8px 12px»): si prende il
       primo numero, che è quello orizzontale — nell'app non ce ne sono di
       ellittici, e se ne comparisse uno è meglio una curva sola che una forma
       sbagliata.

       E PUÒ ESSERE UNA PERCENTUALE. Lo stile calcolato di `border-radius: 50%`
       resta «50%», non diventa pixel: `parseFloat` ne cavava 50, e cinquanta
       pixel su un elemento da duecentocinquanta non sono un cerchio, sono un
       rettangolo con gli angoli tondi. L'anello del timer veniva fuori così —
       un supercerchio con la fetta dell'avanzamento che sporgeva in cima come
       una linguetta squadrata — e la stessa cosa sarebbe successa a qualunque
       cerchio scritto in percentuale. La percentuale si risolve sulla misura
       giusta: la larghezza per gli angoli orizzontali, e siccome qui il raggio
       è uno scalare si prende il lato più corto, che è quello che comanda. */
    return ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius']
      .map(function (k) {
        var v = String(s[k] || '').trim().split(/\s+/)[0];
        var n = parseFloat(v) || 0;
        if (v.indexOf('%') >= 0) n = n / 100 * Math.min(w || 0, h || 0);
        return n;
      });
  }

  /* ---------------------------------------------------------------
     UNA PASSATA È IN TRE TEMPI, E NON SI MESCOLANO MAI.
     Prima erano uno solo: per ogni elemento si leggeva (`offsetWidth`, lo
     stile calcolato) e subito dopo si scriveva (il ritaglio, il raggio, il
     filo). Scrivere invalida i conti del browser, quindi la lettura
     dell'elemento DOPO li rifà da capo: con quattrocento elementi si
     chiedono quattrocento ricalcoli invece di uno. È il difetto più vecchio
     del mestiere — si chiama layout thrashing — e non si vede su un computer,
     dove un ricalcolo costa un decimo di millisecondo. Si vede su un telefono
     Android di fascia media, dove costa dieci volte tanto e la passata intera
     supera il decimo di secondo: il filo principale resta occupato, il
     compositore continua a mostrare le piastrelle vecchie, e la pagina si
     disegna a fasce — un pezzo aggiornato e un pezzo di due schermate fa.
     Le foto dell'utente su Android erano esattamente quelle fasce.
     Adesso una passata è in quattro tempi, e i tempi non si mescolano mai:
       1. si guarda A CHI va azzerato quello che avevamo scritto (solo letture);
       2. si azzera (solo scritture);
       3. si legge tutto e si prepara il piano (un ricalcolo solo);
       4. si scrive tutto (nessuno legge più, quindi il browser rimanda i conti
          alla fine, una volta).
     Da N ricalcoli a due. */

  /* TEMPO 1 — via quello che abbiamo scritto noi, così la lettura vede il
     foglio di stile.
     Serve solo a chi non ha ancora la sua roba da parte: capita una volta per
     elemento, e ogni volta che gli cambia la faccia (una classe). Nessuna di
     queste proprietà sposta niente, quindi azzerarle non costa un ricalcolo:
     è per questo che possono stare tutte insieme, prima delle letture. */
  /* LA POSIZIONE SI LEGGE E SI SCRIVE SUI DUE ASSI, non con la scorciatoia.
     `background-position: right 6px center` — la forma a tre valori, quella
     che serve a staccare la freccina dal bordo destro — Chrome la CALCOLA
     come `right 6px 50%`, e quella stringa Chrome stesso la rifiuta se gliela
     si riscrive: mescola una coppia parola-più-scarto con una percentuale
     nuda, e la grammatica non lo prevede. Misurato: riscriverla dà
     «rifiutata», e l'elemento resta con la posizione di prima — cioè quella
     di una sola corsia su due immagini.
     I due assi separati invece tornano `calc(100% - 6px)` e `50%`, che si
     rimettono a posto tali e quali. */
  var SFONDI = ['backgroundImage', 'backgroundRepeat', 'backgroundSize',
                'backgroundPositionX', 'backgroundPositionY',
                'backgroundOrigin', 'backgroundClip'];
  /* DECIDERE E CANCELLARE SONO DUE COSE, E STANNO IN DUE TEMPI DIVERSI.
     Cancellare quello che abbiamo scritto serve solo a chi poi lo RIscriverà.
     Quando le due cose stavano insieme c'era un buco: si cancellava, e poi il
     tempo 2 se ne andava senza un piano perché in quel momento l'elemento non
     si poteva misurare — nascosto, alto zero pixel, dentro un pannello che si
     sta aprendo. Restava col raggio del foglio di stile addosso e il ritaglio
     VECCHIO ancora attaccato.
     Il primo rimedio è stato spegnerlo del tutto, e si è rivelato una porta a
     senso unico: la forma spariva e non tornava più, perché per tornare
     serviva che qualcosa si muovesse, e non si muoveva niente. Aprendo un
     avviso, tutta la schermata dietro perdeva gli angoli e restava così.
     La cura giusta è non cancellare a chi non si può misurare. Chi decide
     LEGGE soltanto, e sta prima di ogni scrittura; chi cancella SCRIVE
     soltanto, e sta dopo che tutti hanno deciso. Un ricalcolo in più per
     passata, non uno per elemento. */
  function daAzzerare(e) {
    if (inMano(e)) return false;
    if (e.dataset.formaRaggi !== undefined && e.dataset.formaBordo !== undefined) return false;
    /* SI CANCELLA SOLO QUELLO CHE ABBIAMO SCRITTO NOI.
       Queste proprietà in linea non sono per forza nostre: possono esserci
       state messe da chi ha scritto la pagina — uno `style` con dentro un
       angolo è un modo legittimo di chiederlo. Azzerandole alla cieca gliele
       si porta via, e l'elemento resta senza: nel foglio di stile non c'è
       niente, quindi il raggio riletto è zero, quindi non gli si fa nessuna
       forma. Da fuori: un elemento che chiede un angolo e non ce l'ha, per
       sempre. L'ha trovata prove/squircle.js, che per misurare la curva si
       costruisce un elemento con il raggio scritto in linea.
       Il segno `formaScritto` non si butta mai via, nemmeno quando si buttano
       i valori tenuti da parte: quelli si rileggono, questo no. */
    if (e.dataset.formaScritto === undefined) return false;
    /* e solo a chi in questo momento si può misurare, cioè a chi il tempo 2
       saprà riscrivere */
    var s = getComputedStyle(e);
    if (s.display === 'none' || s.visibility === 'hidden') return false;
    return e.offsetWidth > 2 && e.offsetHeight > 2;
  }
  function azzeraOra(e) {
    e.style.borderRadius = '';
    e.style.borderColor = '';
    for (var i = 0; i < SFONDI.length; i++) e.style[SFONDI[i]] = '';
    delete e.dataset.forma;          /* la firma di prima non vale più */
  }

  /* CHI STA PARLANDO COL SISTEMA NON SI TOCCA.
     Un `<input type="time">`, un `<input type="date">` e un `<select>` non
     sono riquadri: sono una porta sull'orologio e sulla lista del sistema
     operativo. Su Android quella porta si richiude se l'elemento che l'ha
     aperta viene rimaneggiato mentre è aperta — e qui dentro un elemento col
     bordo si rimaneggia parecchio: colore spento, sei proprietà di sfondo,
     il ritaglio. Bastava una passata qualunque (ne parte una a ogni
     ridisegno) per far comparire e sparire l'orologio nello stesso istante.
     Il fuoco dice esattamente questo: «adesso questo elemento è in mano al
     sistema». Si lascia stare finché ce l'ha, e lo si rifà quando lo perde —
     `focusout` sale, quindi ne basta uno per tutta la pagina.
     Non è un caso particolare del campo dell'ora: vale per ogni campo, e
     toglie di mezzo tutta la specie. */
  function inMano(e) {
    /* «Già vestito» è parte della condizione. Un campo che il fuoco ce l'ha
       dal primo istante — quello della cattura rapida, che si apre col
       cursore già dentro — non ha ancora nessuna forma: saltarlo vuol dire
       lasciarlo senza per tutto il tempo in cui uno ci scrive, e la
       schermata più usata dell'app aveva il suo campo principale con
       l'angolo tondo normale mentre tutto il resto era a supercerchio.
       E un campo che non ha ancora una forma non può avere un orologio
       aperto: l'orologio si apre toccandolo, e per essere toccato doveva già
       essere lì disegnato. Il rischio esiste solo per chi è già a posto. */
    return e.dataset.forma !== undefined &&
      e === document.activeElement &&
      (e.tagName === 'INPUT' || e.tagName === 'SELECT' || e.tagName === 'TEXTAREA');
  }

  /* TEMPO 2 — leggere, e basta. Torna il piano di cosa scrivere, o null. */
  /* CHI NON SI PUÒ MISURARE SI LASCIA COM'È, e non gli si è cancellato
     niente (vedi `daAzzerare`): la forma che ha addosso resta valida finché
     non cambia misura, e quando cambia lo risveglia l'osservatore. */
  function leggi(e) {
    var s = getComputedStyle(e);
    if (s.display === 'none' || s.visibility === 'hidden') return null;
    if (inMano(e)) return null;
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
       toccano. */
    var w = e.offsetWidth, h = e.offsetHeight;
    if (!(w > 2) || !(h > 2)) {
      /* NON HA ANCORA UNA MISURA, MA CE L'AVRÀ. Se ce ne andiamo e basta,
         quando crescerà non se ne accorgerà nessuno: l'osservatore delle
         misure lo attacchiamo in fondo, e in fondo non ci si arriva mai.
         Succedeva al telaio del Design lab, che nasce chiuso e poi si apre.
         Ci si mette in ascolto solo se ha un angolo da fare. */
      if ((parseFloat(s.borderTopLeftRadius) || 0) > 0.4) daOsservare.push(e);
      return null;
    }
    /* ─────────────────────────────────────────────────────────────
       LEGGERE L'ORIGINALE, MAI QUELLO CHE ABBIAMO SCRITTO NOI.
       Qui dentro si scrivono tre cose sull'elemento: il raggio (ridotto al
       99%, serve all'ombra), il colore del bordo (spento, perché lo ridisegna
       il filo) e lo sfondo (il filo, davanti a quello che c'era). Tutte e
       tre, rilette alla passata dopo, darebbero il valore NOSTRO e non quello
       del foglio di stile — e da lì nascono i guasti che si sono visti:
         · il raggio si riduceva del 99% del 99% del 99%… La barra in basso,
           che è l'unico elemento che non viene mai ricreato, dichiarava 18
           pixel e ne disegnava 5.8: centododici giri. E siccome ogni elemento
           ne subiva un numero diverso a seconda di quanto era vissuto, l'app
           finiva con forme diverse in punti diversi — era questo a farle
           sembrare di famiglie diverse, non la curva;
         · il colore del bordo, riletto dopo averlo spento, torna
           «trasparente»: il filo non veniva più ridisegnato e restava quello
           vecchio, disegnato su una misura di prima.
       Quindi si legge una volta sola e si tiene da parte; e se quello che
       avevamo tenuto da parte non c'è più, prima di leggere si azzera (tempo
       1). Costa un ricalcolo, e capita una volta per elemento. */
    var raggi, col, sotto;
    if (e.dataset.formaRaggi === undefined || e.dataset.formaBordo === undefined) {
      raggi = raggiDi(s, w, h);
      var spBase = parseFloat(s.borderTopWidth) || 0;
      col = (spBase > 0 && !vuoto(s.borderTopColor)) ? s.borderTopColor : '';
      /* LO SFONDO DI SOTTO SI PORTA DIETRO TUTTE LE SUE REGOLE, non solo
         l'immagine.
         Il filo si mette DAVANTI a quello che c'era, e un elenco di sfondi in
         CSS è a più corsie: `background-repeat`, `-size`, `-position`,
         `-origin` e `-clip` sono elenchi anche loro, letti in parallelo alle
         immagini. Mettendo davanti un'immagine e lasciando quegli elenchi
         come stavano, ogni regola scala di un posto e finisce addosso
         all'immagine sbagliata.
         Si è visto sul selettore dell'area nel Diario: la sua freccina è
         un'immagine di sfondo con `no-repeat`, `12px` e «a destra, sei pixel
         dal bordo». Il filo le ha rubato quelle tre regole e a lei è toccato
         quello che restava — ripetuta, a grandezza naturale — e nel riquadro
         del menù comparivano cinque o sei spuntoni grigi sopra il nome
         dell'area. Da fuori sembrava un carattere rotto.
         Adesso le si tengono tutte e cinque, per intero, e davanti gli si
         mette il valore del filo. */
      sotto = s.backgroundImage === 'none' ? '' : SFONDI.map(function (k) { return s[k]; }).join('§');
      e.dataset.formaRaggi = raggi.join(',');
      e.dataset.formaBordo = col;
      e.dataset.formaSfondo = sotto;
    } else {
      raggi = e.dataset.formaRaggi.split(',').map(Number);
      col = e.dataset.formaBordo;
      sotto = e.dataset.formaSfondo || '';
    }
    var max = Math.max.apply(null, raggi);
    if (max <= 0.4) return { e: e, via: 1 };
    if (eTondo(max, w, h, e)) return { e: e, via: 1 };

    var ang = {
      tl: limita(raggi[0], w, h), tr: limita(raggi[1], w, h),
      br: limita(raggi[2], w, h), bl: limita(raggi[3], w, h)
    };
    var sp = parseFloat(s.borderTopWidth) || 0;
    /* «Effetti: minimi» toglie il ritaglio a tutti, non solo ai grandi. E' lo
       strumento con cui si risponde a una domanda che da qui non si puo'
       misurare: se i rettangoli di memoria sporca su un telefono vero
       vengono dalle maschere o da qualcos'altro. Un tocco, e si sa. */
    var grande = (w > limiteW || h > limiteH) ||
      document.documentElement.getAttribute('data-effetti') === 'minimi';
    var firma = w + 'x' + h + '|' + ang.tl + ',' + ang.tr + ',' + ang.br + ',' + ang.bl + '|' + sp + '|' + col + (grande ? '|G' : '');
    if (e.dataset.forma === firma) return null;
    return { e: e, w: w, h: h, ang: ang, sp: sp, col: col, sotto: sotto, firma: firma, grande: grande };
  }

  /* TEMPO 3 — scrivere, e basta. Niente qui dentro legge l'impaginazione. */
  function scrivi(p) {
    var e = p.e;
    if (p.via) { spegni(e); return; }
    e.dataset.forma = p.firma;
    e.dataset.formaScritto = '1';
    /* SENZA SFUMARE, e non solo chi ha un bordo.
       Questo pezzo stava più in basso, dentro il ramo di chi ha una cornice,
       perché il difetto che l'ha fatto scrivere era il bordo doppio: spegnendo
       il colore del bordo, quello non sparisce — ci mette un decimo di secondo
       a sfumare, e in quel decimo di secondo il filo nuovo e il bordo vecchio
       si vedono tutti e due.
       Ma il RAGGIO lo riscriviamo a tutti, e `transition: all` non è raro (la
       spunta di un'azione ce l'ha): il raggio si mette ad animare da 8 a 7.92,
       e per un decimo di secondo l'ombra dell'elemento gira su un raggio che
       non è né quello di prima né quello di dopo. È microscopico a occhio, ma
       la prova dei bordi lo pescava a metà strada e diceva «raggio ristretto»
       su un elemento diverso a ogni giro: sembrava un capriccio della prova,
       ed era un'animazione vera che non doveva esserci.
       Le transizioni si spengono con un attributo che noi non osserviamo (se
       fosse una classe, l'osservatore degli attributi si risveglierebbe e il
       giro non finirebbe), e si riaccendono in fondo alla passata, dopo un
       ricalcolo solo. */
    e.dataset.formaSecca = '1';
    secchi.push(e);
    if (p.grande) e.style.clipPath = '';
    else e.style.clipPath = 'path("' + ritaglio(p.w, p.h, p.ang) + '")';
    /* IL `border-radius` RESTA, AL 99 PER CENTO. Non serve più a dare la
       forma — quella la fa il ritaglio — ma serve ancora all'OMBRA e al
       contorno del fuoco, che seguono lui e che un raggio a zero renderebbe
       due rettangoli spigolosi attorno a una cosa tonda.
       Il taglio del 99% non è una precauzione a caso: il ritaglio può solo
       TOGLIERE, quindi dove l'arco del `border-radius` passa più interno
       della curva di Apple vince l'arco, e in quella fascia la forma torna
       ad avere lo scalino di curvatura che tutta questa storia esiste per
       togliere. Misurato: a raggio pieno l'arco entra dentro la curva per
       0.1125 px; al 99% non entra mai più, in nessun punto.
       Si scrive il raggio EFFETTIVO, non quello dichiarato: una pastiglia
       dichiara 999px, e lasciandoglielo l'ombra le girerebbe intorno a
       semicerchio mentre la forma è un supercerchio. */
    var a = p.ang;
    /* il 99% serve a non far entrare l'arco DENTRO il ritaglio. Senza
       ritaglio non c'e' niente in cui entrare, e il raggio va pieno: e'
       lui a dare la forma. */
    var q = p.grande ? 1 : 0.99;
    e.style.borderRadius = (a.tl * q).toFixed(2) + 'px ' + (a.tr * q).toFixed(2) + 'px ' +
      (a.br * q).toFixed(2) + 'px ' + (a.bl * q).toFixed(2) + 'px';
    if (p.col) {
      /* Il bordo del box si spegne QUI, sullo stesso elemento e nello stesso
         momento in cui compare il filo: non c'è nessun istante in cui uno dei
         due manca o ci sono tutti e due. Lo spessore resta, perché è misura:
         toglierlo sposterebbe il contenuto di due pixel. */
      e.style.borderColor = 'transparent';
      var giu = p.sotto ? p.sotto.split('§') : null;
      var mio = [filo(p.w, p.h, p.ang, p.sp, p.col), 'no-repeat', '100% 100%', '0%', '0%', 'border-box', 'border-box'];
      for (var i = 0; i < SFONDI.length; i++)
        e.style[SFONDI[i]] = giu ? mio[i] + ', ' + giu[i] : mio[i];
    }
    daOsservare.push(e);
  }

  /* la strada corta: un elemento solo (l'osservatore delle misure). I tre
     tempi ci sono lo stesso, sono solo tutti sullo stesso elemento. */
  function applica(e) { giroSu([e]); }

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

  /* SPEGNERE VUOL DIRE TOGLIERE, ANCHE SE NON CI RICORDIAMO DI AVER ACCESO.
     Qui la guardia era «se non ha la firma, esci», e c'era un buco: il tempo 2
     cancella proprio quella firma, quindi un elemento azzerato e poi spento —
     succede quando dopo l'azzeramento risulta senza angolo, o diventato un
     tondo — usciva di qui senza che gli si togliesse niente. Il
     `border-radius` tornava quello del foglio di stile e il RITAGLIO restava
     addosso, quello vecchio: la forma diceva una cosa e il raggio un'altra.
     Da fuori non si vedeva quasi mai, ma bastava a far dire alla prova
     «raggio ristretto» su un elemento a caso, in una schermata diversa a ogni
     giro — il tipo di difetto che si liquida come un capriccio della prova.
     `formaScritto` non lo cancella nessuno, quindi risponde alla domanda
     giusta: «qui dentro abbiamo scritto?». */
  function spegni(e) {
    if (e.dataset.formaScritto === undefined) return;
    e.style.clipPath = '';
    e.style.borderRadius = '';
    if (e.dataset.formaBordo) {
      e.style.borderColor = '';
      var giu = e.dataset.formaSfondo ? e.dataset.formaSfondo.split('§') : null;
      for (var i = 0; i < SFONDI.length; i++) e.style[SFONDI[i]] = giu ? giu[i] : '';
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
  var daOsservare = [];   /* chi va messo in ascolto delle misure, in fondo */

  function scordaUno(e) {
    delete e.dataset.formaRaggi;
    delete e.dataset.formaBordo;
    delete e.dataset.formaSfondo;
    delete e.dataset.forma;
  }

  /* le transizioni si riaccendono in fondo alla passata, dopo aver costretto
     il browser a fare i conti una volta: così il valore «trasparente» è già
     quello buono e riaccendere non fa ripartire niente. Un ricalcolo per
     passata, non uno per elemento.

     I CONTI DELLO STILE, NON QUELLI DELL'IMPAGINAZIONE. Qui c'era
     `void document.body.offsetWidth`, che costringe il browser a rifare
     l'impaginazione di TUTTA la pagina — e capita subito dopo che la pagina
     e' stata riscritta da capo, cioe' quando quell'impaginazione costa il
     massimo possibile. Ma quello che serve qui non e' sapere dove stanno le
     cose: serve solo che i valori appena scritti siano gia' quelli in vigore
     prima di riaccendere le transizioni. Per quello basta chiedere uno stile
     calcolato, che ricalcola lo stile e basta. Misurato: 87 ms su dodici
     cambi di schermata, e sono la stessa garanzia. */
  function riaccendi() {
    if (!secchi.length) return;
    var questi = secchi;
    secchi = [];
    /* DUE FOTOGRAMMI, NESSUN CONTO FORZATO. Il ricalcolo serve, ma il browser
       lo fa da sé prima di disegnare: aspettando il confine del fotogramma si
       ha la stessa garanzia senza chiedere niente. Due `requestAnimationFrame`
       e non uno, perché il primo gira PRIMA del ricalcolo di quel fotogramma,
       non dopo. */
    var togli = function () {
      for (var i = 0; i < questi.length; i++) {
        if (questi[i] && questi[i].dataset) delete questi[i].dataset.formaSecca;
      }
    };
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(function () { requestAnimationFrame(togli); });
    } else togli();
  }

  /* UNA PASSATA, NEI SUOI QUATTRO TEMPI.
     Il ciclo non è più «per ogni elemento: leggi e scrivi», che costava un
     ricalcolo dell'impaginazione a testa. Adesso sono quattro cicli, e nessuno
     ne mescola due: si decide chi azzerare (leggendo), si azzera (scrivendo),
     si legge tutto, si scrive tutto.
     Su quattrocento elementi si passa da quattrocento ricalcoli a due.
     La sicurezza contro le eccezioni sta in ogni tempo, non attorno al ciclo:
     un elemento che scoppia non può portarsi via la forma di tutti quelli che
     vengono dopo — è successo, ed è sparita mezza pagina. */
  /* PIU' GRANDE DELLO SCHERMO: NIENTE RITAGLIO.
     Un `clip-path: path(...)` e' una MASCHERA, e una maschera e' una texture
     sulla scheda grafica, grande quanto l'elemento moltiplicato per la
     densita' dello schermo. La scheda della Giornata, su un telefono a 390
     pixel con densita' 3, e' 1074 x 4188 pixel veri: oltre il limite di
     texture di 4096 che quasi tutte le schede grafiche dei telefoni hanno.
     Sopra quel limite l'allocazione fallisce, e quello che si vede al posto
     dell'elemento e' memoria non inizializzata — rettangoli grigi, neri o di
     rumore colorato a spigolo vivo. E anche restando sotto il limite, le
     maschere di una schermata sola sommavano 40 MB.

     Sopra la misura dello schermo il ritaglio non si mette. Quello che si
     perde e' 0,7 px di curvatura su quattro angoli di una scheda alta
     millequattrocento — la differenza fra la curva di Apple e l'arco del
     `border-radius`, misurata in `prove/squircle.js`. Quello che si guadagna
     e' che la scheda si disegni. Il filo (lo sfondo SVG) continua a
     descrivere la curva vera, quindi il contorno che si vede non cambia.

     Un elemento piu' alto dello schermo non lo si vede mai tutto insieme: i
     suoi quattro angoli non stanno nello stesso sguardo, e non c'e' nessun
     confronto da fare fra loro. E' anche il motivo per cui la soglia e' la
     misura della finestra e non un numero scelto a mano. */
  /* CHIESTA UNA VOLTA, NON A OGNI PASSATA. `innerWidth` e `innerHeight`
     sembrano due numeri gratis e non lo sono: leggerli mentre il documento e'
     sporco costringe il browser a rifare i conti dell'impaginazione seduta
     stante, e a ogni cambio di sezione il documento e' sporcissimo — l'ha
     appena riscritto tutto. Misurato col profilatore, questa funzione da sola
     si prendeva 27 ms su dodici cambi di schermata, per due numeri che
     cambiano solo quando cambia la finestra. Adesso li chiede la finestra
     quando cambia, e la passata li trova gia' pronti. */
  var limiteW = 0, limiteH = 0;
  function misuraLimite() {
    /* La misura che conta e' l'ALTEZZA, e la soglia e' mezzo schermo. Un
       elemento piu' alto di cosi' non lo si tiene nell'occhio come una forma
       sola: si scorre accanto, e i suoi due capi non si incontrano mai nello
       stesso sguardo. Non c'e' nessun confronto da fare fra i suoi angoli,
       che e' l'unica cosa per cui la curva continua esiste. Con lo schermo
       intero come soglia le sette colonne della settimana passavano tutte, e
       da sole facevano 22 MB di maschere.
       Sulla LARGHEZZA la soglia resta lo schermo pieno: una scheda larga
       quanto la pagina e alta trecento pixel si vede benissimo tutta intera,
       e i suoi angoli si guardano. A meta' schermo anche la barra in basso e
       la scheda di «Adesso» perdevano il ritaglio, che e' il contrario di
       quello che serve. Piu' larga dello schermo puo' essere solo una
       griglia che scorre di lato, e quella e' proprio il caso caro. */
    limiteW = (window.innerWidth || 1024);
    limiteH = (window.innerHeight || 768) / 2;
  }

  function giroSu(lista) {
    var i, e;
    var daPulire = [];
    if (!limiteH) misuraLimite();
    for (i = 0; i < lista.length; i++) {
      e = lista[i];
      if (e.nodeType !== 1 || VIETATI[e.tagName]) continue;
      try { if (daAzzerare(e)) daPulire.push(e); } catch (err) { grida(err); }
    }
    for (i = 0; i < daPulire.length; i++) {
      try { azzeraOra(daPulire[i]); } catch (err) { grida(err); }
    }
    var piani = [];
    for (i = 0; i < lista.length; i++) {
      e = lista[i];
      if (e.nodeType !== 1 || VIETATI[e.tagName]) continue;
      try { var p = leggi(e); if (p) piani.push(p); } catch (err) { grida(err); }
    }
    for (i = 0; i < piani.length; i++) {
      try { scrivi(piani[i]); } catch (err) { grida(err); }
    }
    for (i = 0; i < daOsservare.length; i++) osserva(daOsservare[i]);
    daOsservare = [];
  }

  function passa() {
    var lista = mossi; mossi = [];
    /* oltre un certo numero di rami conviene rifare tutto: cercare i
       duplicati fra le sottochiome costa più che una passata sola */
    if (!lista.length || lista.length > 60) { tutti(); riaccendi(); return; }
    var tuttiQuanti = [];
    lista.forEach(function (e) {
      if (!e.isConnected || e.nodeType !== 1) return;
      tuttiQuanti.push(e);
      var f = e.querySelectorAll('*');
      for (var i = 0; i < f.length; i++) tuttiQuanti.push(f[i]);
    });
    giroSu(tuttiQuanti);
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
     misura cambia forma, e il tracciato è in pixel.
     Le misure che arrivano insieme si fanno insieme, con gli stessi tre
     tempi: quando cambia la larghezza della finestra ne arrivano trecento in
     un colpo solo, e una per una sarebbero trecento ricalcoli. */
  var ro = typeof ResizeObserver === 'function' ? new ResizeObserver(function (voci) {
    var l = [];
    for (var i = 0; i < voci.length; i++) l.push(voci[i].target);
    giroSu(l); riaccendi();
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
  function grida(err) {
    if (grida.detto) return;
    grida.detto = 1;
    if (window.LMLog) LMLog.errore('forma', String(err)); else console.error('forma', err);
  }
  function prova(e) { giroSu([e]); }

  function tutti(radice) {
    var dove = radice || document.body;
    if (!dove) return;
    var lista = [].slice.call(dove.querySelectorAll('*'));
    if (!radice && document.body) lista.push(document.body);
    giroSu(lista);
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

    /* QUANDO IL CAMPO TORNA NOSTRO.
       Finché un campo ha il fuoco lo si lascia stare (vedi `inMano`), quindi
       se in quel frattempo è cambiato — ha cambiato misura, gli è cambiata la
       classe — la sua forma è rimasta indietro. Appena lo lascia, si rifà.
       `focusout` sale fino a qui, quindi ne basta uno solo per tutta la
       pagina, e non costa niente finché nessuno tocca un campo. */
    document.addEventListener('focusout', function (ev) {
      var e = ev.target;
      if (e && e.nodeType === 1) { mossi.push(e); piano(); }
    });

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
    /* la misura della finestra si aggiorna QUI, non dentro la passata: e' il
       solo momento in cui puo' essere cambiata, e qui il documento e' fermo */
    window.addEventListener('resize', function () { misuraLimite(); piano(); });
  }

  window.LM_FORMA = {
    tutti: tutti, applica: applica, scorda: scorda, piano: piano,
    ritaglio: ritaglio, contorno: contorno, limita: limita, INIZIO: INIZIO
  };
  avvia();
})();
