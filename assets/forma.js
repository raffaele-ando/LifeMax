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
  /* la stessa catena percorsa al contrario: si parte dall'ultimo punto e per
     ogni pezzo si scambiano i due punti di controllo */
  function alRovescio(cc, partenza) {
    var out = [], i;
    for (i = cc.length - 1; i >= 0; i--) {
      var prima = i === 0 ? partenza : cc[i - 1][2];
      out.push([cc[i][1], cc[i][0], prima]);
    }
    return out;
  }

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
      if (k === 'tl') {
        var ultimo = cc[cc.length - 1][2];
        p.push('M' + n(v[0]) + ' ' + n(v[1]) + 'L' + n(ultimo[0]) + ' ' + n(ultimo[1]));
        alRovescio(cc, a).forEach(function (t) { p.push(C(t)); });
      } else {
        p.push('M' + n(v[0]) + ' ' + n(v[1]) + 'L' + n(a[0]) + ' ' + n(a[1]));
        cc.forEach(function (t) { p.push(C(t)); });
      }
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
     LE PASTIGLIE RESTANO PASTIGLIE.
     Nel sistema di Apple una pastiglia è una `Capsule`, con le estremità a
     SEMICERCHIO: non è un supercerchio schiacciato, ed è giusto che il CSS la
     disegni da sé col suo `border-radius`. Chi dichiara un raggio grande
     quanto mezzo lato corto (`--r-tondo`, `999px`, `50%`) chiede quello. */
  function eCapsula(r, w, h) { return r >= Math.min(w, h) / 2 - 0.51; }

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
    if (!(w > 2) || !(h > 2)) return;
    var raggi = raggiDi(s);
    var max = Math.max.apply(null, raggi);
    if (max <= 0.4) { spegni(e); return; }
    if (eCapsula(max, w, h)) { spegni(e); return; }

    var ang = {
      tl: limita(raggi[0], w, h), tr: limita(raggi[1], w, h),
      br: limita(raggi[2], w, h), bl: limita(raggi[3], w, h)
    };

    /* IL COLORE DEL BORDO si legge una volta sola e si tiene da parte:
       appena glielo spegniamo, rileggerlo darebbe «trasparente» e alla
       passata dopo il filo sparirebbe. */
    var sp = parseFloat(s.borderTopWidth) || 0;
    var col = e.dataset.formaBordo;
    if (col === undefined) {
      col = (sp > 0 && !vuoto(s.borderTopColor)) ? s.borderTopColor : '';
      e.dataset.formaBordo = col;
    }

    var firma = w + 'x' + h + '|' + ang.tl + ',' + ang.tr + ',' + ang.br + ',' + ang.bl + '|' + sp + '|' + col;
    if (e.dataset.forma === firma) return;
    e.dataset.forma = firma;

    e.style.clipPath = 'path("' + ritaglio(w, h, ang) + '")';
    if (col) {
      /* Il bordo del box si spegne QUI, sullo stesso elemento e nello stesso
         momento in cui compare il filo: non c'è nessun istante in cui uno dei
         due manca o ci sono tutti e due. Lo spessore resta, perché è misura:
         toglierlo sposterebbe il contenuto di due pixel. */
      e.style.borderColor = 'transparent';
      var sotto = e.dataset.formaSfondo;
      if (sotto === undefined) {
        sotto = s.backgroundImage === 'none' ? '' : s.backgroundImage;
        e.dataset.formaSfondo = sotto;
      }
      e.style.backgroundImage = filo(w, h, ang, sp, col) + (sotto ? ', ' + sotto : '');
      e.style.backgroundRepeat = 'no-repeat' + (sotto ? ', repeat' : '');
      e.style.backgroundSize = '100% 100%' + (sotto ? ', auto' : '');
      e.style.backgroundOrigin = 'border-box' + (sotto ? ', padding-box' : '');
      e.style.backgroundClip = 'border-box' + (sotto ? ', border-box' : '');
    }
    osserva(e);
  }

  function vuoto(c) { return !c || c === 'transparent' || /rgba\(0,\s*0,\s*0,\s*0\)/.test(c); }

  function spegni(e) {
    if (e.dataset.forma === undefined) return;
    e.style.clipPath = '';
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
  var inCoda = false;
  function piano() {
    if (inCoda) return;
    inCoda = true;
    requestAnimationFrame(function () { inCoda = false; tutti(); });
  }

  var ro = typeof ResizeObserver === 'function' ? new ResizeObserver(function (voci) {
    voci.forEach(function (v) { applica(v.target); });
  }) : null;
  function osserva(e) {
    if (!ro || e.dataset.formaOss) return;
    e.dataset.formaOss = '1';
    ro.observe(e);
  }

  function tutti(radice) {
    var dove = radice || document.body;
    if (!dove) return;
    var lista = dove.querySelectorAll('*');
    for (var i = 0; i < lista.length; i++) {
      var e = lista[i];
      if (VIETATI[e.tagName]) continue;
      applica(e);
    }
    if (!radice && document.body) applica(document.body);
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
    tutti();
  }

  function avvia() {
    if (!document.body) { document.addEventListener('DOMContentLoaded', avvia); return; }
    tutti();
    new MutationObserver(piano).observe(document.body, { childList: true, subtree: true });
    /* IL TEMA lo si guarda dall'attributo, non da un evento: così questo file
       non ha bisogno di sapere niente dell'app, e nessuno deve ricordarsi di
       avvisarlo. Cambiando tema cambiano i colori dei bordi, quindi i colori
       tenuti da parte vanno buttati via. */
    new MutationObserver(scorda).observe(document.documentElement,
      { attributes: true, attributeFilter: ['data-mode', 'data-skin'] });
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
