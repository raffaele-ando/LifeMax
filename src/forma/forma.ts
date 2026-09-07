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
   WebKit non fa e che aveva spento tutto.

   COME ARRIVA A CHI LO USA
   Nel sito di prima era `window.LM_FORMA`, messo lì da uno `<script>`. Qui è
   un modulo: `avvia()` parte all'import, esattamente come partiva alla fine
   dello `<script>`, e la funzione resta anche su `window` finché il vecchio
   `app.js` gira accanto a questo.  */

/* ---------------------------------------------------------------
   I TIPI DI QUESTO FILE, e sono quattro.
   Qui dentro si parla di angoli e di punti, e per tutta la vita del file
   erano stringhe e array di numeri qualunque. `Angolo` è la differenza fra
   «una delle quattro sigle» e «una stringa»: le mappe, i raggi, il giro e i
   vertici sono tutti indicizzati per angolo, e un `'lt'` scritto al posto di
   `'tl'` prima passava e specchiava una forma. */
type Angolo = 'tl' | 'tr' | 'br' | 'bl';
type Punto = readonly [number, number];
/* le tre Bézier di un angolo: due punti di controllo e il punto d'arrivo */
type Terna = readonly [Punto, Punto, Punto];
type Raggi = Record<Angolo, number>;

const ANGOLI: readonly Angolo[] = ['tl', 'tr', 'br', 'bl'];

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
const INIZIO = 1.528665;
const CURVE: readonly { c1: Punto; c2: Punto; p: Punto }[] = [
  { c1: [1.08849296, 0], c2: [0.86840694, 0], p: [0.63149379, 0.07491139] },
  { c1: [0.37282383, 0.16905956], c2: [0.16905956, 0.37282383], p: [0.07491139, 0.63149379] },
  { c1: [0, 0.86840694], c2: [0, 1.08849296], p: [0, 1.528665] }
];
/* il lato più corto che regge un raggio: due angoli da 1.528665 raggi
   ciascuno devono starci dentro senza incontrarsi */
const MIN_LATO = 2 * INIZIO;

/* quanto il ritaglio esce dal riquadro. Serve solo a non tagliare le ombre
   e i contorni del fuoco: dentro quel rettangolone si toglie soltanto la
   roba dei quattro angoli. */
const FUORI = 200;

const n = function (x: number): string {
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
type Mappa = (u: number, v: number, w: number, h: number, r: number) => Punto;
const MAPPE: Record<Angolo, Mappa> = {
  tr: function (u, v, w, _h, r) { return [w - u * r, v * r]; },
  br: function (u, v, w, h, r) { return [w - v * r, h - u * r]; },
  bl: function (u, v, _w, h, r) { return [u * r, h - v * r]; },
  tl: function (u, v, _w, _h, r) { return [v * r, u * r]; }
};

/* le tre Bézier di un angolo, già mappate: [c1, c2, p] in coordinate
   assolute, nell'ordine in cui le percorre il giro orario */
function curveDi(dove: Angolo, w: number, h: number, r: number): Terna[] {
  const m = MAPPE[dove];
  return CURVE.map(function (c): Terna {
    return [m(c.c1[0], c.c1[1], w, h, r), m(c.c2[0], c.c2[1], w, h, r), m(c.p[0], c.p[1], w, h, r)];
  });
}
const C = function (t: Terna): string { return 'C' + n(t[0][0]) + ' ' + n(t[0][1]) + ' ' + n(t[1][0]) + ' ' + n(t[1][1]) + ' ' + n(t[2][0]) + ' ' + n(t[2][1]); };

/* Il contorno pieno, orario: serve per il bordo. `ang` è {tl,tr,br,bl} in
   pixel, già limitati. */
function contorno(w: number, h: number, ang: Raggi, dx?: number): string {
  const rientro = dx || 0;            /* rientro, per il filo del bordo */
  const W = w - rientro * 2, H = h - rientro * 2;
  const R: Raggi = {
    tl: Math.max(0, ang.tl - rientro), tr: Math.max(0, ang.tr - rientro),
    br: Math.max(0, ang.br - rientro), bl: Math.max(0, ang.bl - rientro)
  };
  const L = function (k: Angolo) { return INIZIO * R[k]; };
  const q = function (p: Punto): Punto { return [p[0] + rientro, p[1] + rientro]; };
  const pezzi = ['M' + n(L('tl') + rientro) + ' ' + n(rientro)];
  /* IL GIRO È ORARIO e comincia dopo l'angolo in alto a sinistra: sono
     quattro angoli e non un elenco di stringhe qualunque. Prima era un array
     di array in cui la misura viaggiava accanto alla sigla e nessuno la
     leggeva — le due colonne di numeri non le guardava nessuno. */
  const giro: readonly Angolo[] = ['tr', 'br', 'bl', 'tl'];
  const lineaA: Record<Angolo, Punto> = { tr: [W - L('tr'), 0], br: [W, H - L('br')], bl: [L('bl'), H], tl: [0, L('tl')] };
  giro.forEach(function (k) {
    const a = q(lineaA[k]);
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
function ritaglio(w: number, h: number, ang: Raggi): string {
  const p = ['M' + n(-FUORI) + ' ' + n(-FUORI) + 'L' + n(w + FUORI) + ' ' + n(-FUORI) +
           'L' + n(w + FUORI) + ' ' + n(h + FUORI) + 'L' + n(-FUORI) + ' ' + n(h + FUORI) + 'Z'];
  const vertici: Record<Angolo, Punto> = { tl: [0, 0], tr: [w, 0], br: [w, h], bl: [0, h] };
  /* dove COMINCIA il giro di ogni angolo, secondo la sua mappa. Per tre
     angoli su quattro è sul primo dei due lati; per quello in alto a
     sinistra la mappa scambia gli assi, quindi comincia sul lato
     SINISTRO — scriverlo come gli altri gli fa disegnare il morso al
     rovescio, e l'angolo viene via tagliato di netto in diagonale. */
  const primo: Record<Angolo, Punto> = { tl: [0, INIZIO * ang.tl], tr: [w - INIZIO * ang.tr, 0], br: [w, h - INIZIO * ang.br], bl: [INIZIO * ang.bl, h] };
  ANGOLI.forEach(function (k) {
    if (!(ang[k] > 0)) return;
    const cc = curveDi(k, w, h, ang[k]);
    const v = vertici[k], a = primo[k];
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
function limita(r: number, w: number, h: number): number {
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
function eCapsula(r: number, w: number, h: number): boolean { return r >= Math.min(w, h) / 2 - 0.51; }
function eQuadro(w: number, h: number): boolean { return Math.abs(w - h) <= 2; }

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
/* LA RISPOSTA SI RICORDA, PER PADRE E PER CLASSE.
   Questa domanda è la stessa per tutti i fratelli che portano la stessa
   classe, e rifarla per ognuno costa il quadrato: in una mappa di calore
   con trecentosessantacinque quadratini sono centotrentamila letture di
   misura per sapere una cosa sola. Col profilatore, su due anni di dati,
   era la voce più cara di tutta l'apertura di una schermata — 630 ms su
   tremila. Adesso si risponde una volta per gruppo, e il ricordo dura una
   passata (dopo, le misure possono essere cambiate). */
let ricordoFratelli: WeakMap<Element, Record<string, boolean>> | null = null;
function fratelliQuadri(e: HTMLElement): boolean {
  const pa = e.parentElement;
  if (!pa) return true;
  const mie = (typeof e.className === 'string' ? e.className : '').trim().split(/\s+/).filter(Boolean);
  const prima = mie[0];
  if (!prima) return true;
  const chiave = e.tagName + '|' + prima;
  if (!ricordoFratelli) ricordoFratelli = new WeakMap();
  let perPadre = ricordoFratelli.get(pa);
  if (!perPadre) { perPadre = Object.create(null) as Record<string, boolean>; ricordoFratelli.set(pa, perPadre); }
  const gia = perPadre[chiave];
  if (gia !== undefined) return gia;
  const c = pa.children;
  let esito = true;
  for (let i = 0; i < c.length; i++) {
    const o = c[i] as HTMLElement | undefined;
    if (!o || o === e || o.tagName !== e.tagName) continue;
    const sue = (typeof o.className === 'string' ? o.className : '').trim().split(/\s+/);
    let insieme = false;
    for (let j = 0; j < mie.length; j++) if (sue.indexOf(mie[j] as string) >= 0) { insieme = true; break; }
    if (!insieme) continue;
    const ow = o.offsetWidth, oh = o.offsetHeight;
    if (ow > 2 && oh > 2 && !eQuadro(ow, oh)) { esito = false; break; }
  }
  perPadre[chiave] = esito;
  return esito;
}
function eTondo(r: number, w: number, h: number, e?: HTMLElement | null): boolean {
  return eCapsula(r, w, h) && eQuadro(w, h) && (!e || fratelliQuadri(e));
}

/* ---------------------------------------------------------------
   L'ANELLO DEL BORDO, SENZA NESSUNA IMMAGINE.
   Il filo era un SVG costruito al volo: uno per ogni elemento con una
   cornice, rifatto a ogni cambio di misura. Su certi telefoni è quello che
   manda in tilt la scheda grafica — provato sul campo, due volte: con le
   immagini il disturbo c'è, senza sparisce.
   Qui la stessa curva si ottiene con un secondo RITAGLIO: un tracciato con
   due giri — quello di fuori e quello rientrato di uno spessore — e la
   regola `evenodd`, che riempie quello che sta fra i due. È esattamente la
   stessa geometria del filo, disegnata da un colore pieno invece che da
   un'immagine, quindi non c'è niente da rasterizzare e niente da tenere in
   memoria. Va addosso a uno pseudo-elemento perché il ritaglio
   dell'elemento serve già a dargli la forma.

   E LA VECCHIA VIA È SPARITA DA QUI, non l'ha rimossa una scelta di stile:
   `noUnusedLocals` ha fatto notare che `filo()` non la chiamava più nessuno
   da quando c'è l'anello. Con lei sono andate via la sua cache e il suo
   contatore — venticinque righe che generavano SVG, li tenevano in un
   dizionario, lo svuotavano ogni quattrocento voci, e nessuno guardava mai
   il risultato. `scorda()` continuava a svuotare quella cache a ogni cambio
   di tema: un lavoro perfettamente eseguito su una struttura che non serviva
   a niente. */
function anello(w: number, h: number, ang: Raggi, sp: number): string {
  return 'path(evenodd, "' + contorno(w, h, ang, 0) + contorno(w, h, ang, sp) + '")';
}

/* ---------------------------------------------------------------
   APPLICARE, a un elemento solo
   --------------------------------------------------------------- */
const VIETATI: Record<string, 1> = { BR: 1, HR: 1, IMG: 1, SVG: 1, PATH: 1, CANVAS: 1, OPTION: 1 };

type Angoli4 = [number, number, number, number];
function raggiDi(s: CSSStyleDeclaration, w: number, h: number): Angoli4 {
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
  const quali = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'] as const;
  const fuori = quali.map(function (k) {
    const v = String(s[k] || '').trim().split(/\s+/)[0] || '';
    let px = parseFloat(v) || 0;
    if (v.indexOf('%') >= 0) px = px / 100 * Math.min(w || 0, h || 0);
    return px;
  });
  /* quattro, in quest'ordine: `map` su una tupla di quattro dà un array
     qualunque, e chi legge questi numeri li legge per posizione */
  return [fuori[0] || 0, fuori[1] || 0, fuori[2] || 0, fuori[3] || 0];
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
/* `as const`: sono nomi di proprietà dello stile, non stringhe qualunque.
   Con l'elenco tipato, `e.style[k]` compila; scritto come `string[]` non
   compilerebbe — ed è la stessa cosa che dice il commento lungo qui sotto
   sulle cinque corsie, detta al compilatore. */
const SFONDI = ['backgroundImage', 'backgroundRepeat', 'backgroundSize',
                'backgroundPositionX', 'backgroundPositionY',
                'backgroundOrigin', 'backgroundClip'] as const;
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
function daAzzerare(e: HTMLElement): boolean {
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
function azzeraOra(e: HTMLElement): void {
  if (e.dataset.formaFilo !== undefined) {
    e.style.removeProperty('--filo-d');
    delete e.dataset.formaFilo;
  }
  e.style.borderRadius = '';
  e.style.borderColor = '';
  SFONDI.forEach(function (k) { e.style[k] = ''; });
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
function inMano(e: HTMLElement): boolean {
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
/* IL PIANO DI UNA PASSATA, per un elemento solo.
   Due forme, e la differenza è tutta: `via` vuol dire «a questo va TOLTO
   quello che c'era», l'altra è il disegno intero. Prima era un unico oggetto
   con dentro `via: 1` e tutti gli altri campi assenti, e ogni punto che lo
   leggeva doveva ricordarsi da sé quali campi esistono in quale caso. */
interface Via { e: HTMLElement; via: true }
interface Disegno {
  e: HTMLElement;
  via?: undefined;
  w: number;
  h: number;
  ang: Raggi;
  sp: number;
  col: string;
  sotto: string;
  firma: string;
  grande: boolean;
  liberoDopo: boolean;
  statico: boolean;
}
type Piano = Via | Disegno;

function leggi(e: HTMLElement): Piano | null {
  const s = getComputedStyle(e);
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
  let raggi: number[], col: string, sotto: string;
  const raggiTenuti = e.dataset.formaRaggi, bordoTenuto = e.dataset.formaBordo;
  if (raggiTenuti === undefined || bordoTenuto === undefined) {
    raggi = raggiDi(s, w, h);
    const spBase = parseFloat(s.borderTopWidth) || 0;
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
    raggi = raggiTenuti.split(',').map(Number);
    col = bordoTenuto;
    sotto = e.dataset.formaSfondo || '';
  }
  const max = Math.max.apply(null, raggi);
  if (max <= 0.4) return { e: e, via: true };
  if (eTondo(max, w, h, e)) return { e: e, via: true };

  const ang: Raggi = {
    tl: limita(raggi[0] || 0, w, h), tr: limita(raggi[1] || 0, w, h),
    br: limita(raggi[2] || 0, w, h), bl: limita(raggi[3] || 0, w, h)
  };
  const sp = parseFloat(s.borderTopWidth) || 0;
  /* «Effetti: minimi» toglie il ritaglio a tutti, non solo ai grandi. E' lo
     strumento con cui si risponde a una domanda che da qui non si puo'
     misurare: se i rettangoli di memoria sporca su un telefono vero
     vengono dalle maschere o da qualcos'altro. Un tocco, e si sa. */
  const grande = (w > limiteW || h > limiteH) ||
    document.documentElement.getAttribute('data-effetti') === 'minimi';
  /* LO PSEUDO-ELEMENTO DEV'ESSERE LIBERO. Quaranta elementi su ottocento
     hanno già un `::after` che dice qualcosa: rubarglielo cancellerebbe
     quello che disegna. Lì il bordo lo fa il browser, che è quello che
     facevano tutti prima. */
  /* Il nostro anello NON conta come occupato. Appena lo si mette, la regola
     `[data-forma-filo]::after { content: '' }` fa risultare lo pseudo-elemento
     pieno — di roba nostra — e alla passata dopo l'elemento sembrava già
     preso da qualcun altro: l'anello non si aggiornava più, e restava
     disegnato sulla misura di prima. L'ha trovato prove/bordi.js sulla
     scheda di Panoramica, che cresce dopo essere stata disegnata (il numero
     che sale e l'anello della riuscita la fanno diventare più alta). */
  const suo = e.dataset.formaFilo !== undefined ? 'none' : getComputedStyle(e, '::after').content;
  const liberoDopo = (suo === 'none' || suo === 'normal' || suo === '');
  const firma = w + 'x' + h + '|' + ang.tl + ',' + ang.tr + ',' + ang.br + ',' + ang.bl + '|' + sp + '|' + col + (grande ? '|G' : '');
  if (e.dataset.forma === firma) return null;
  return { e: e, w: w, h: h, ang: ang, sp: sp, col: col, sotto: sotto, firma: firma,
           grande: grande, liberoDopo: liberoDopo, statico: s.position === 'static' };
}

/* TEMPO 3 — scrivere, e basta. Niente qui dentro legge l'impaginazione. */
function scrivi(p: Piano): void {
  const e = p.e;
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
  /* SENZA RITAGLIO NON SERVE NEMMENO IL FILO. Il filo esiste perché il
     bordo vero del riquadro segue l'arco del `border-radius` mentre la
     forma la fa il ritaglio: due curve diverse, e senza il filo il bordo
     sporgerebbe. Dove il ritaglio non c'è, la forma LA FA il border-radius
     — quindi il bordo nativo la segue esatta, e generare un'immagine SVG
     per disegnare la stessa curva è lavoro buttato: una texture in più
     sulla scheda grafica per ogni scheda alta della pagina. */
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
  const a = p.ang;
  /* il 99% serve a non far entrare l'arco DENTRO il ritaglio. Senza
     ritaglio non c'e' niente in cui entrare, e il raggio va pieno: e'
     lui a dare la forma. */
  const q = p.grande ? 1 : 0.99;
  e.style.borderRadius = (a.tl * q).toFixed(2) + 'px ' + (a.tr * q).toFixed(2) + 'px ' +
    (a.br * q).toFixed(2) + 'px ' + (a.bl * q).toFixed(2) + 'px';
  if (p.col && !p.grande && p.liberoDopo) {
    /* Il bordo del box si spegne QUI, sullo stesso elemento e nello stesso
       momento in cui compare l'anello: non c'è nessun istante in cui uno dei
       due manca o ci sono tutti e due. Lo spessore resta, perché è misura:
       toglierlo sposterebbe il contenuto di due pixel. */
    e.style.borderColor = 'transparent';
    /* lo pseudo-elemento si aggancia al riquadro di IMBOTTITURA, che è più
       piccolo del riquadro del bordo di uno spessore per lato: lo si tira
       fuori di tanto, così l'anello combacia con la cornice vera */
    if (p.statico) e.style.position = 'relative';
    e.style.setProperty('--filo-c', p.col);
    e.style.setProperty('--filo-sp', (-p.sp) + 'px');
    e.style.setProperty('--filo-d', anello(p.w, p.h, p.ang, p.sp));
    e.dataset.formaFilo = '1';
  }
  daOsservare.push(e);
}

/* la strada corta: un elemento solo (l'osservatore delle misure). I tre
   tempi ci sono lo stesso, sono solo tutti sullo stesso elemento. */
function applica(e: HTMLElement): void { giroSu([e]); }

/* un colore è «vuoto» se non si vede: conta l'ALFA, non quali siano i tre
   numeri davanti. `rgba(16, 17, 22, 0)` è invisibile quanto
   `rgba(0, 0, 0, 0)`, e cercare solo il secondo lasciava passare per bordo
   vero un bordo che non c'è. */
function vuoto(c: string): boolean {
  if (!c || c === 'transparent' || c === 'none') return true;
  const m = /^rgba?\(([^)]*)\)/.exec(c);
  if (!m) return false;
  const p = (m[1] || '').split(/[,/]/);
  return p.length > 3 && parseFloat(p[3] || '') < 0.004;
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
function spegni(e: HTMLElement): void {
  if (e.dataset.formaScritto === undefined) return;
  e.style.clipPath = '';
  e.style.borderRadius = '';
  if (e.dataset.formaBordo) {
    e.style.borderColor = '';
    const giu = e.dataset.formaSfondo ? e.dataset.formaSfondo.split('§') : null;
    SFONDI.forEach(function (k, i) { e.style[k] = giu ? (giu[i] || '') : ''; });
  }
  if (e.dataset.formaFilo !== undefined) {
    e.style.removeProperty('--filo-c');
    e.style.removeProperty('--filo-sp');
    e.style.removeProperty('--filo-d');
    e.style.position = '';
    delete e.dataset.formaFilo;
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
const ATTR = ['class', 'hidden', 'disabled', 'aria-checked', 'aria-expanded', 'aria-pressed'];
let mossi: HTMLElement[] = [];
let inCoda = false;
let secchi: HTMLElement[] = [];
let daOsservare: HTMLElement[] = [];   /* chi va messo in ascolto delle misure, in fondo */

function scordaUno(e: HTMLElement): void {
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
function riaccendi(): void {
  if (!secchi.length) return;
  const questi = secchi;
  secchi = [];
  /* DUE FOTOGRAMMI, NESSUN CONTO FORZATO. Il ricalcolo serve, ma il browser
     lo fa da sé prima di disegnare: aspettando il confine del fotogramma si
     ha la stessa garanzia senza chiedere niente. Due `requestAnimationFrame`
     e non uno, perché il primo gira PRIMA del ricalcolo di quel fotogramma,
     non dopo. */
  const togli = function () {
    for (let i = 0; i < questi.length; i++) {
      const q = questi[i];
      if (q && q.dataset) delete q.dataset.formaSecca;
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
let limiteW = 0, limiteH = 0;
function misuraLimite(): void {
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

/* «EFFETTI: MINIMI» VUOL DIRE SPENTO, non «un po' meno».
   Prima toglieva il ritaglio e lasciava il FILO: e il filo è un'immagine
   SVG generata al volo, una per ogni elemento con un bordo, ridisegnata a
   ogni cambio di misura. Su una schermata sono una ventina di immagini
   nuove — venti texture da tenere sulla scheda grafica, che si buttano via
   e si rifanno a ogni ridisegno. Quindi il gradino «minimi» non spegneva
   affatto il pezzo più caro del sistema, e chi lo provava per capire da
   cosa dipendeva un difetto grafico riceveva una risposta falsa.
   Adesso a «minimi» forma.js non tocca niente: raggi nativi, bordi veri,
   nessuna immagine generata. È l'interruttore che dice davvero se il
   problema è qui. */
function spentoDelTutto(): boolean {
  return document.documentElement.getAttribute('data-effetti') === 'minimi';
}
/* Questo gradino è servito a una cosa sola, e l'ha fatta: ha dimostrato,
   su un telefono vero, che il difetto grafico veniva dalle immagini
   generate. Adesso le immagini non ci sono più — il bordo è un anello
   ritagliato — quindi non c'è più niente da togliere qui: «ridotti» è
   tornato a voler dire quello che diceva prima, cioè niente sfocature
   dietro ai pannelli, che resta un modo vero di alleggerire una macchina
   lenta senza rinunciare alla forma. */

function giroSu(lista: readonly HTMLElement[]): void {
  /* i tre tempi girano tutti su questa lista, e chi non è un elemento o è
     fra i VIETATI non ci entra nemmeno: prima il controllo era ripetuto
     dentro a ognuno dei tre cicli, con tre occasioni di scriverlo diverso */
  const suCui = lista.filter(function (e) { return e.nodeType === 1 && !VIETATI[e.tagName]; });
  if (spentoDelTutto()) {
    suCui.forEach(function (e) { try { spegni(e); } catch (err) { grida(err); } });
    return;
  }
  if (!limiteH) misuraLimite();
  const daPulire: HTMLElement[] = [];
  suCui.forEach(function (e) {
    try { if (daAzzerare(e)) daPulire.push(e); } catch (err) { grida(err); }
  });
  daPulire.forEach(function (e) { try { azzeraOra(e); } catch (err) { grida(err); } });
  const piani: Piano[] = [];
  ricordoFratelli = null;      /* il ricordo dura una passata, non di più */
  suCui.forEach(function (e) {
    try { const p = leggi(e); if (p) piani.push(p); } catch (err) { grida(err); }
  });
  piani.forEach(function (p) { try { scrivi(p); } catch (err) { grida(err); } });
  daOsservare.forEach(osserva);
  daOsservare = [];
}

function passa(): void {
  const lista = mossi; mossi = [];
  /* oltre un certo numero di rami conviene rifare tutto: cercare i
     duplicati fra le sottochiome costa più che una passata sola */
  if (!lista.length || lista.length > 60) { tutti(); riaccendi(); return; }
  const tuttiQuanti: HTMLElement[] = [];
  lista.forEach(function (e) {
    if (!e.isConnected || e.nodeType !== 1) return;
    tuttiQuanti.push(e);
    e.querySelectorAll<HTMLElement>('*').forEach(function (f) { tuttiQuanti.push(f); });
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
function piano(): void {
  if (inCoda) return;
  inCoda = true;
  let fatto = false;
  const giro = function () {
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
const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(function (voci) {
  const l = voci.map(function (v) { return v.target as HTMLElement; });
  giroSu(l); riaccendi();
}) : null;
function osserva(e: HTMLElement): void {
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
/* si dice una volta e non a ogni elemento: un difetto di qui si ripete
   ottocento volte per passata, e ottocento righe uguali nel registro tecnico
   sono un registro illeggibile proprio quando serve leggerlo */
let gridato = false;
function grida(err: unknown): void {
  if (gridato) return;
  gridato = true;
  if (window.LMLog) window.LMLog.errore('forma', String(err)); else console.error('forma', err);
}

function tutti(radice?: HTMLElement): void {
  const dove = radice || document.body;
  if (!dove) return;
  const lista: HTMLElement[] = Array.prototype.slice.call(dove.querySelectorAll('*')) as HTMLElement[];
  if (!radice && document.body) lista.push(document.body);
  giroSu(lista);
}

/* il cambio di tema cambia i colori dei bordi: si buttano via i colori
   tenuti da parte e si rifà tutto */
function scorda(): void {
  document.querySelectorAll<HTMLElement>('[data-forma-bordo]').forEach(function (e) {
    delete e.dataset.formaBordo;
    delete e.dataset.formaSfondo;
    delete e.dataset.forma;
  });
  tutti(); riaccendi();
}

function avvia(): void {
  if (!document.body) { document.addEventListener('DOMContentLoaded', avvia); return; }
  const reg = document.createElement('style');
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
  const nuovoFoglio = function (n: Node): boolean {
    if (!n || n.nodeType !== 1) return false;
    const el = n as HTMLElement;
    if (el.id === 'forma-regole') return false;
    if (el.tagName === 'STYLE') return true;
    if (el.tagName === 'LINK' && /stylesheet/i.test((el as HTMLLinkElement).rel || '')) {
      el.addEventListener('load', scorda);
      return true;
    }
    return false;
  };
  new MutationObserver(function (muta) {
    let serve = false;
    muta.forEach(function (m) {
      m.addedNodes.forEach(function (n) { if (nuovoFoglio(n)) serve = true; });
    });
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
    const e = ev.target as HTMLElement | null;
    if (e && e.nodeType === 1) { mossi.push(e); piano(); }
  });

  tutti(); riaccendi();
  new MutationObserver(function (muta) {
    muta.forEach(function (m) {
      if (!m.target || m.target.nodeType !== 1) return;
      const t = m.target as HTMLElement;
      if (m.type === 'attributes') {
        /* la faccia può essere cambiata: si butta via quello che avevamo
           tenuto da parte, così alla passata dopo si rilegge dal foglio di
           stile invece che da quello che abbiamo scritto noi */
        scordaUno(t);
      }
      mossi.push(t);
    });
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
  const temaOra = function () {
    const d = document.documentElement;
    return (d.getAttribute('data-mode') || '') + '/' + (d.getAttribute('data-skin') || '');
  };
  let temaPrima = temaOra();
  new MutationObserver(function () {
    const q = temaOra();
    if (q === temaPrima) return;
    temaPrima = q; scorda();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode', 'data-skin'] });
  /* i caratteri cambiano le misure quando arrivano: senza questo la prima
     schermata resta disegnata sulle misure del carattere di ripiego */
  if (document.fonts && document.fonts.ready) void document.fonts.ready.then(piano);
  /* la misura della finestra si aggiorna QUI, non dentro la passata: e' il
     solo momento in cui puo' essere cambiata, e qui il documento e' fermo */
  window.addEventListener('resize', function () { misuraLimite(); piano(); });
}

export const LM_FORMA = {
  tutti: tutti, applica: applica, scorda: scorda, piano: piano,
  ritaglio: ritaglio, contorno: contorno, limita: limita, INIZIO: INIZIO
};
export type Forma = typeof LM_FORMA;


avvia();
