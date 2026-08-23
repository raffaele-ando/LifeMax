# Prove

Undici controlli automatici che guardano una cosa sola ciascuno, ma
quella cosa fa morire l'app — o la fa diventare illeggibile — quando si
rompe. Sono nati da problemi veri.

Le prove dei promemoria stanno di là, in `promemoria/`, perché lì c'è anche
la parte che gira sul server: `prova.mjs` (la cifratura, byte per byte contro
`http_ece`), `prova-piano.mjs` (chi tocca adesso: fusi e ora legale),
`prova-worker.mjs` (il giro intero con un KV finto, e il pacchetto decifrato
per vedere che cosa è arrivato davvero) e `prova-chiavi.mjs` (la pagina che
genera le chiavi, in un browser vero).

- **clic.js** — dove finisce davvero il dito. Campiona una griglia di punti
  su tutta la pagina, scorrendola per intero, e chiede al browser chi
  riceve il clic in ognuno. Controlla due cose opposte: che nessun
  elemento si prenda punti molto oltre il proprio rettangolo (un'area
  invisibile che ruba i clic di quelli intorno) e che ogni comando visibile
  riceva il clic quando lo si tocca nel mezzo. E una terza: che ogni comando
  abbia uno stato «premuto». Su un telefono il passaggio del mouse non esiste,
  quindi tutte le regole `:hover` non fanno niente e un comando senza `:active`
  non dà nessuna conferma al dito — misurato una volta, 304 comandi su 336
  erano muti. Non li preme (premerne uno lo attiva e mezza app cambierebbe
  sotto la prova): guarda se una regola `:active` del foglio lo riguarda,
  scendendo anche nelle `@media` che valgono adesso e negli pseudo-elementi.
- **modalita.js** — apre tutti i pannelli da tutte le loro strade e li
  chiude in tutti i modi (la x, Esc, toccando fuori). Dopo ogni
  combinazione controlla che niente sia rimasto `inert`, che lo
  scorrimento sia tornato e che la barra in basso riceva i clic. Un
  livello di modalità rimasto appeso non si vede: si scopre solo che
  l'app non risponde più a niente. Controlla anche la via del ritorno: i
  cinque pannelli che si aprono da dentro «Impostazioni» devono avere un tasto
  che porta scritto il nome del posto da cui vieni e che ti riporta lì — non
  che chiude tutto. Prima non c'era: si chiudeva e si riapriva.
- **segni.js** — un segno, una cosa. Non guarda i pixel: legge il codice.
  Nessun disegno esiste sotto due nomi; nessun segno è invocato senza
  esistere né disegnato senza servire; un'icona delle aree non è mai anche
  un comando (altrimenti la stessa figura dice «la tua area» e due righe
  sopra «priorità»); tutte le misure stanno sui cinque gradini della scala;
  il tratto arriva sempre alla stessa densità. Poi la parte che nasce dal
  problema di partenza — «vedo più icone usate per cose diverse» — e che è
  arrivata dopo, perché le regole di sopra non bastavano a impedirlo: ogni
  segno dichiara in `SENSO` che cosa vuol dire, nessun significato è scritto
  due volte, e la prova conta con quante frasi diverse ogni segno compare
  nell'app, fermandosi alla sesta. Conta le frasi e non i posti: la prima
  versione contava anche la classe CSS del contenitore e si fermava su
  `star` e `clock` — cinque posti diversi, un significato solo. Un conto che
  scatta su un caso giusto si impara a ignorare.
  Controlla anche sé stessa: quello che legge dal file deve cominciare con
  `<`, cioè essere davvero un tracciato. Senza quel controllo un taglio
  sbagliato le faceva confrontare i *significati* invece dei disegni, e
  passava dicendo «nessun disegno sotto due nomi» — vero, e senza senso.
- **doppioni.js** — due comandi che fanno la stessa cosa nella stessa
  schermata. Non guarda i nomi né le classi: clicca. Per ogni comando
  visibile parte da uno stato identico, lo preme, e registra cosa lascia —
  dove sei finito, com'è cambiato il salvataggio, che pannello si è
  aperto, che messaggio è comparso. Due comandi che lasciano lo stesso
  stato esatto sono due modi per la stessa cosa; N righe di un elenco
  toccano cose diverse, lasciano salvataggi diversi, e non si confondono
  con i doppioni. In fondo al file c'è la lista dei doppioni tenuti di
  proposito, con la ragione. Di comandi identici per costruzione — le righe
  di un elenco, l'«Annulla» su ogni riga del diario — ne prova sei per tipo e
  stampa quanti ne lascia fuori: un taglio muto si leggerebbe come «provato
  tutto». Nasce da «verifica se nella stessa schermata non ci sono elementi
  che fanno le stesse cose». Ci mette qualche minuto: apre una pagina pulita
  per ogni comando.

- **sezioni.js** — cambiare sezione non è ricaricare la pagina. Dentro la
  stessa porta si anima solo il corpo (titolo e riga di linguette restano
  immobili), cambiando porta si anima tutto, e quello che sta FUORI dalla
  vista — barra in basso, colonna, banda — non viene ricostruito né quando
  cambi sezione né quando spunti una cosa. Controlla anche che le barre di
  sezione abbiano tutte la stessa forma. Nasce da «se passo da una schermata
  all'altra deve ricaricare tutto».

- **annulla.js** — annullare dal diario, anche quello di mesi fa. Quasi ogni
  riga del diario è un dato salvato (una spunta, un check-in, una review, una
  nota) e si disfa togliendo quel dato: vale a qualunque distanza di tempo e
  non tocca nient'altro. Le righe di registro raccontano un cambiamento senza
  esserlo, e per quelle serve il punto di ritorno — gli ultimi dodici, in
  contenitori loro fuori dai dati sincronizzati. Controlla che una riga
  vecchia si annulli con la memoria dei punti vuota, che gli XP scendano sul
  giorno giusto e non su oggi, che ogni tipo di riga abbia il suo inverso e
  che una chiave inventata non combini niente, che il tasto compaia una volta
  sola per cambiamento e mai dove non c'è niente da disfare, che l'annulla si
  possa a sua volta annullare, e che passare dal punto avverta di quante
  altre cose rientrano. Nasce da «non posso annullare le cose che faccio per
  ogni cosa» e da «non è retroattivo rispetto a quelli che ho già messo nel
  passato».

- **colori.js** — il contrasto del testo, su tutta l'app e nei due temi. Per
  ogni schermata legge il colore calcolato di ogni testo visibile e il fondo
  davvero dipinto sotto di lui — alfa composte e sfumature comprese, prendendo
  la fermata peggiore — e pretende il minimo di WCAG AA: 4.5:1, o 3:1 per il
  testo grande. I colori si fanno risolvere al browser dipingendoli due volte,
  su bianco e su nero: `getComputedStyle` restituisce i color-mix come
  `color(srgb …)` e leggerli con una regex dà zero, dipingerli una volta sola
  perde l'alfa. In fondo stampa quello che sta sotto il minimo di proposito (il
  bianco sul pieno di marca) con la misura, invece di nasconderlo. Nasce da un
  errore che l'occhio non vede: `var(--inchiostro)` invece di
  `var(--inchiostro-1)` rende invalido il color-mix e il testo torna al grigio
  ereditato, che è un colore plausibile.

- **spazi.js** — gli spazi fra gli elementi, misurati come una griglia. Per
  ogni schermata e a quattro larghezze prende la distanza fra due elementi
  incolonnati e pretende che stia sulla scala 0/4/8/12/16/24/32/40; che il
  contenuto cominci alla stessa altezza su tutte le pagine (la riga delle
  sezioni è il primo blocco, sempre); che lo spazio FRA due gruppi non sia minore di quello DENTRO un
  gruppo, riempimenti compresi; e che niente sbordi in orizzontale. Misura con
  le animazioni spente: le schermate entrano a scaglioni e misurare durante
  l'ingresso dava 10, 17.9, 27, 37.6 per la stessa coppia a ogni giro — non
  erano spazi, erano fotogrammi. Nasce da «analizza ogni spazio tra elementi e
  misura tipo griglia»: la prima misura aveva trovato 38 valori diversi, con
  7-8-9-10-11 usati per lo stesso mestiere, e quasi nessuno scelto — nascevano
  dal collasso di due margini indipendenti, e cambiavano da soli quando un
  contenitore diventava flex.

- **promemoria.js** — le notifiche, dal lato app. Il service worker si
  registra da sé; il permesso NON si chiede all'apertura (chiederlo appena
  apri è il modo più sicuro di farselo negare, e negato è senza appello); il
  piano di oggi perde le cose appena le fai e non contiene le abitudini senza
  orario né quelle di un altro giorno della settimana. Poi il numero sul
  pallino dell'icona — che deve scendere quando spunti e sparire a zero — e la
  nota fissa, che deve avere le quattro cose che la rendono fissa invece di una
  notifica qualsiasi: un tag sempre uguale, nessun rumore, nessun ri-suono,
  e non sparire da sé sul computer.
  Dentro c'è anche la prova di un bug preciso: `restano()` chiedeva i rituali
  aperti a `piano()` mentre `piano()` chiedeva a `restano()` il testo della
  nota. Con la nota spenta non si vedeva; accendendola l'app si fermava con lo
  stack pieno e la schermata restava a metà.
- **squircle.js** — gli angoli sono supercerchi, non rettangoli arrotondati.
  Non guarda il CSS: guarda i pixel. La curva di un angolo è una superellisse
  |u|^n + |v|^n = 1, e l'arco di cerchio del `border-radius` è il caso n = 2;
  il supercerchio è n = 4. La prova disegna, fotografa, trova dove passa il
  bordo e ricava n risolvendo l'equazione punto per punto.
  In ordine: che le due forme siano davvero diverse (n = 2.00 col solo raggio,
  n = 4.03 con `corner-shape: squircle`, che è il riferimento perché lo disegna
  il browser); che il nostro poligono dia la stessa curva del riferimento a
  8, 12, 18 e 60px, e che su un elemento più basso del raggio non si
  autointersechi; che un pulsante vero, dipinto com'è, misuri n ≈ 4; che tutti
  gli angoli di nove schermate abbiano il ritaglio e nessuno sia restato un
  rettangolo arrotondato; che il blocco generato venga identico rigenerandolo;
  che il tracciato SVG del logo e l'icona dell'app siano superellissi, e che
  le icone che iOS e Android mascherano da sé siano piene fino al bordo.
  Poi le tre prove che dicono se è davvero una curva di Lamé e non un
  arrotondamento qualsiasi: la **curvatura** (l'arco di cerchio la tiene
  costante a 1/R fino all'attacco col lato e là salta a zero — è quello lo
  scalino che si vede; la curva di Lamé la cambia da 0.43·R a 1.5·R e si
  appiattisce verso il lato, così l'attacco non c'è); la **distanza** fra il
  nostro poligono e la curva vera del browser, misurata come area fra le due
  divisa per la lunghezza dell'arco (0.06–0.08px a 12, 26 e 60px di raggio); e
  le **proporzioni**, perché una maschera SVG che si stira farebbe un'ellisse
  mentre l'angolo dev'essere lo stesso su 280×60, su 60×280 e su 160×160.
  E lo **spessore dell'anello**: un bordo da 2px con un anello da 1px si
  assottiglia proprio nell'angolo, quindi il generatore lo legge dal foglio di
  stile e qui si controlla che nel blocco ci siano più spessori.
  Alla fine la cosa che il ritaglio da solo rompe: il **bordo sulla curva**.
  Ritagliando un box a spigoli il suo bordo viene tagliato proprio negli
  angoli e resta una scheda col bordo sui fianchi e niente agli angoli; qui si
  cerca il colore del bordo lungo ventidue direzioni dell'angolo, e la
  controprova (la stessa forma senza l'anello) deve fallire, altrimenti la
  prova non sta misurando niente.
  Cinque cose le ha corrette di sé stessa: che `superellipse(2)` dà n = 4 e
  `superellipse(3)` dà n = 8 (il numero è il logaritmo dell'esponente, non
  l'esponente); che chi resta tondo va chiesto al foglio di stile e non
  indovinato dalla geometria, perché indovinandolo si fermava su due casi
  giusti; che misurare con il raggio CHIESTO invece di quello USATO — dove
  viene tagliato alla metà del lato — dà un n falso, ed è per questo che
  l'elemento di prova è largo il doppio del raggio; che a un pixel per pixel
  CSS il riferimento stesso usciva 5.19 dove doveva uscire 4.03, e serve
  fotografare a sei volte la risoluzione; e che il raggio di un elemento vero
  non si deduce da «dove il lato diventa dritto», perché la superellisse
  arriva al lato appiattendosi e l'ultimo terzo della curva sta dentro il
  mezzo pixel — si leggeva n = 3.15 su una forma giusta.
  E una cosa l'ha trovata sull'app, non su sé stessa: il ritaglio taglia anche
  quello che SPORGE dal riquadro — figli, pseudo-elementi, e con loro l'area
  del tocco, perché `clip-path` conta anche per il dito. Erano andati via il
  pallino in cima al segno dell'ora, il filo che stacca la cattura dalle
  linguette, e i 44px invisibili che facevano grandi le caselle da spuntare e
  l'interruttore dei promemoria. Adesso c'è una prova per ognuna delle tre
  cose, su nove schermate.
- **gesto.js** — il foglio dal basso: il gesto, e che dopo si possa ancora
  toccare. Prima di tutto campiona la SUPERFICIE del foglio aperto e pretende
  che ogni punto arrivi al foglio: nasce da una regressione in cui il velo
  dietro era diventato un pseudo-elemento assoluto e il foglio finiva sotto al
  suo stesso velo — grigio e sordo, con solo la testata (`sticky`, quindi
  posizionata) bianca e cliccabile. I comandi rispondevano ancora, perché
  quasi tutti hanno un `position: relative` per l'area del dito: per questo la
  prova sui comandi coperti non se ne accorgeva. Poi fa ogni gesto possibile —
  tiro corto, lungo, in su, dalla maniglia, interrotto, due di fila, col
  colpo secco, col mouse — e dopo ognuno pretende che il foglio sia nello
  stato giusto, che l'app sia viva, che niente sia rimasto appeso, e che il
  tocco SUCCESSIVO funzioni davvero. Controlla anche il contrario: che il dito
  possa ancora SCORRERE il contenuto senza che il gesto glielo rubi.
  Manda tocchi VERI (`Input.dispatchTouchEvent` via CDP) e non eventi
  sintetici: quelli non passano dal motore dei gesti, e con quelli la prova
  passava mentre il gesto era rotto per davvero. Un andata e ritorno CDP costa
  un decimo di secondo, quindi la velocità massima simulabile aspettando le
  risposte è 0.1 px/ms: per provare la regola del colpo secco gli invii vanno
  messi in coda tutti insieme, e il browser li fonde in un movimento solo.
  Nasce da «c'è un bug con questi bottom sheet, si blocca tutto» e da «non si
  riesce a portare giù la tendina».

## Come si lanciano

    npm install playwright
    node prove/clic.js
    node prove/modalita.js
    node prove/segni.js      # solo Node, niente browser
    node prove/squircle.js
    node prove/promemoria.js
    node prove/doppioni.js   # qualche minuto
    node prove/sezioni.js
    node prove/annulla.js
    node prove/colori.js
    node prove/spazi.js
    node prove/gesto.js

Servono Node e Chromium (segni.js si accontenta di Node). Se Chromium sta in un posto suo:

    CHROMIUM=/percorso/di/chrome node prove/clic.js
