# Prove

Diciassette controlli automatici che guardano una cosa sola ciascuno, ma
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
  E una quarta: che **la scelta toccata si accenda**. Un segmento dice due cose
  insieme — fa una cosa, e dice quale delle sue scelte è quella in vigore — e la
  seconda si scriveva a mano in ogni punto dell'app che disegna un segmento.
  Dove non era scritta non succedeva: su «Tema» (Auto · Chiaro · Scuro) e su
  «Stile» il sito cambiava davvero e la pastiglia accesa restava su quella di
  prima. Chi guarda non pensa «manca un aggiornamento»: pensa di aver toccato
  male, e tocca di nuovo. La prova tocca ogni voce di ogni segmento di ogni
  pannello e pretende che l'accesa sia quella toccata.
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
- **squircle.js** — gli angoli sono quelli **continui di Apple**, non archi di
  cerchio e nemmeno superellissi. Non guarda il CSS: guarda i pixel.
  La misura che separa le tre forme senza ambiguità è l'**area che l'angolo
  toglie** al quadrato, in unità di r² — non dipende da come si campiona e i
  numeri sono lontanissimi: arco di cerchio 0.2148 (teoria 1-π/4), superellisse
  n=4 **0.0726** (il 66% in meno: è la ragione per cui la prima versione aveva
  reso tutta l'app più spigolosa), angolo di Apple **0.2254** (1.05 volte
  l'arco, quindi arrotondato come sempre).
  Poi la **curvatura**, che è la cosa che l'occhio vede: il cerchio la tiene
  costante e all'attacco col lato salta a zero; quella di Apple, campionata sul
  proprio angolo (lungo 1.53 raggi, non uno), va da 0.88·R a 3.13·R e si
  appiattisce verso il lato, così l'attacco non esiste.
  Poi la **distanza** fra la spezzata del `clip-path` e le Bézier vere, misurata
  come area fra le due divisa per la lunghezza dell'arco: 0.03–0.05px a 8, 12,
  18 e 26px di raggio.
  Poi la cosa che mancava e che è costata caro: **ogni tracciato generato passa
  per `CSS.supports`**. Un `calc(100% - 0)` — non valido, perché da una
  percentuale non si può sottrarre uno zero senza unità — faceva buttare al
  browser l'intera dichiarazione: il ritaglio diventava `none`, l'elemento
  restava a spigoli e l'anello dipingeva un rettangolo pieno sopra tutta la
  scheda. Nel foglio di stile il testo sembrava giusto. C'è anche la
  controprova, che quel valore venga davvero rifiutato.
  Poi l'app, su nove schermate: che ogni angolo abbia il ritaglio, che nessuno
  sia rimasto un rettangolo arrotondato, che **ogni elemento col bordo abbia
  l'anello ACCESO** (una riga `*::before { --sq-b: transparent }` lo aveva
  spento su tutta l'app, lasciando il bordo rotto in ogni angolo), e che il
  ritaglio non si mangi niente che sporge — figli o pseudo-elementi, e con loro
  l'area del tocco, perché `clip-path` conta anche per il dito.
  Poi il **bordo sui pixel** di un elemento vero, cercando il colore del bordo
  lungo venti direzioni dell'angolo. Poi le **proporzioni**, perché una maschera
  SVG stirata farebbe un'ellisse: l'angolo misura 27.5×27.3px identico su
  300×90, su 90×300 e su 160×160. Poi che il blocco sia generato e stia dentro
  un `@supports`. Poi l'**icona**, che deve avere esattamente il tracciato di
  `segni/apple.mjs`, e le PNG che iOS e Android mascherano da sé, che devono
  restare piene fino al bordo.
  Le trappole che ha corretto su sé stessa: il riquadro di prova troppo piccolo
  (con un raggio da 120 in un box da 280 scatta il limite proporzionale e la
  curva di Apple usciva come una superellisse con n = 2.8); il lato «dritto»
  misurato da un raggio in poi invece che dopo la lunghezza dell'angolo; un
  `background:#000` che copriva la maschera di riferimento; le virgolette
  doppie di un `url("data:...")` dentro un attributo `style`, che chiudevano
  l'attributo; e il giro delle schermate che lasciava la pagina sull'ultima,
  dove l'elemento da misurare non c'è.
- **adesso.js** — «adesso o dopo», la domanda a cui la schermata *Oggi* deve
  rispondere. Nasce da «mi sono confuso: l'attività che c'era mi sembrava
  quella dopo, per come era scritta», ed erano due difetti insieme: la scheda
  aveva lo stesso aspetto per «questa è di adesso» e «questa è la prossima, fra
  cinque ore» (cambiava una frase piccola in mezzo alla didascalia, e il tasto
  pieno diceva «Fatto» in tutti e due i casi), e le abitudini non entravano
  proprio nel conto — chi apriva la schermata alle sette non vedeva la corsa
  delle sette.
  La prova costruisce quattro giornate con l'orologio fermo e pretende quattro
  facce diverse: la parola della fascia, il suo colore, la nota che dice cosa
  succede adesso, e quale comando è quello pieno. Poi mette un'abitudine alle
  sette e controlla che diventi la cosa di adesso, che si veda che è
  un'abitudine, che al posto di «Più tardi» ci sia «Salta oggi», che «Fatto» la
  spunti davvero — e che il timer non perda i suoi minuti (cercando l'azione
  per id non la troverebbe, e i minuti sparirebbero).
- **giornata.js** — il resoconto della giornata: la notte, i pasti, le cose
  fatte senza scriverle. Tre famiglie di cose che si possono sbagliare.
  QUANDO SI CHIEDE: al mattino la notte, dalle 19 la giornata, una volta sola,
  mai sopra un pannello già aperto, mai alla primissima visita, e — la regola
  che conta — **mai a chi non è andato a dormire**: se fra l'ultima volta che
  l'app ti ha visto e adesso non c'è un buco di almeno tre ore, la notte non ci
  sta. La prova mette l'orologio alle 4:30 con mezz'ora di assenza e pretende
  silenzio.
  LA PRECISIONE: di partenza «più o meno», si sposta da sé su «precisi» quando
  cambi l'ora col dito, e chi sceglie a mano non viene sovrascritto. «Non me lo
  ricordo» non scrive nessun orario.
  QUELLO CHE RESTA NEI DATI: un pasto saltato è `fatto: false` e nella giornata
  si vede sbiadito e barrato (controllato sul CSS calcolato, non sul markup);
  una cosa scritta dopo nasce già fatta, con gli XP e col segno `dopo`.
  E il pop-up chiuso vale «non adesso»: ricaricando non torna, ma la domanda
  si trova ancora nei Rituali — la promessa scritta nella nota è verificata.
- **campi.js** — i campi che si aprono col tocco: l'ora di un pasto, la
  scadenza di un'attività. Nasce da «non funziona il pulsante "a un'altra ora"
  quando indico i pasti della giornata in Rituali». Il tasto c'era e si
  premeva; sotto ci stava un `input[type=time]` largo un pixel, trasparente,
  ritagliato via e con `pointer-events: none`. Il dito non poteva raggiungerlo
  in nessun modo, e l'unica strada era chiedere al browser di aprire l'orologio
  di sistema su un elemento che non si vede: una richiesta che a volte non fa
  niente, non solleva un errore e non lascia traccia. Da fuori il tasto sembra
  rotto — e per un anno, in due punti dell'app, lo era. In più il campo nasceva
  già pieno dell'ora solita, quindi anche a orologio aperto riscegliere quella
  stessa ora non faceva scattare nessun evento.
  La prova chiede al browser CHI RICEVE il tocco nel mezzo del campo: è la
  domanda che il tasto rotto sbagliava, e l'unica che conta. Poi che il tocco
  lasci un segno (la pastiglia si accende, il campo compare), che il campo
  dell'ora parta VUOTO, che quello che si sceglie si salvi come ora precisa,
  che si possa cambiare idea, e che «sì» resti l'ora solita più o meno. Sulla
  scadenza controlla anche che la ✕ resti sopra al campo steso sulla riga:
  sotto, togliere la scadenza avrebbe aperto il calendario.
- **lezioni.js** — «cosa funziona per me»: le righe che si scrivono senza fare un
  esperimento. Il pericolo di una funzione così è che diventi un cimitero — si
  scrivono dieci righe, non le rivede nessuno, e fra un mese non sono né dati né
  ricordi — quindi la prova non guarda solo che il campo salvi: guarda i punti in
  cui quelle righe devono ENTRARE e USCIRE. Che una riga si scriva in un campo
  solo e finisca nel mucchio giusto; che parta dalla forza più debole («notato
  una volta») invece di affermare più di quello che sai; che il tasto a sinistra
  la giri nell'altro mucchio senza perdere il testo; che la review della sera la
  sappia tenere e che il tasto si spenga dopo, per non promettere due volte la
  stessa cosa; che un esperimento che finisce aggiorni LA SUA riga invece di
  scriverne una seconda uguale; che dalla riga si parta per l'esperimento col
  modulo già compilato.
  Ha trovato un difetto che c'era già da prima: il modulo del nuovo esperimento
  viveva solo nel DOM, e la pagina si ridisegna da sé quando arriva la risposta
  dell'account o un aggiornamento dal cloud — chi aveva scritto mezza domanda se
  la vedeva sparire senza aver toccato niente. Adesso quello che c'è scritto
  sopravvive al ridisegno, e la prova lo verifica forzando l'evento vero.
- **bordi.js** — la stessa cosa, ma DAPPERTUTTO. La forma degli angoli la
  misura `squircle.js` su nove schermate; questa guarda una cosa sola — che il
  bordo sia dove deve essere, di un colore solo, dipinto una volta sola — e la
  guarda su cinquanta schermate, pannelli e stati (`segni/scene.json`) per
  cinque combinazioni di larghezza e tema: 250 schermate, più di quattordicimila
  angoli ritagliati.
  Nasce da «quelli sono solo alcuni, ce ne sono in varie sezioni e pagine»: i
  difetti li aveva trovati l'occhio, tre o quattro per volta, e ogni volta la
  causa era un'altra con lo stesso aspetto — «il bordo sembra tagliato». Le
  nove cause, tutte in una prova:
  1. un angolo tondo senza ritaglio (è rimasto un arco di cerchio);
  2. un bordo con lo spessore e nessuno che lo dipinge (bordo sparito);
  3. un bordo dipinto DUE volte, box e anello (fianchi scuri, angoli chiari);
  4. un anello che dipinge senza forma (un rettangolo pieno di colore);
  5. un `overflow` che si mangia l'anello;
  6. un ritaglio che mangia quello che sporge — figli, pseudo-elementi, e con
     loro l'area del dito;
  7. un angolo più grande di mezzo lato, che si strozza in una punta;
  8. l'anello messo sullo pseudo-elemento di qualcun altro. `::before` è uno
     per elemento: se lo usava già una barretta, un pallino o una freccia, le
     due regole finiscono sullo stesso pezzo di schermo e quel disegno prende
     addosso il ritaglio dell'anello. È successo alla barretta dell'accento
     nella colonna di sinistra (`.nav-item.attivo::before`), che ne usciva a
     trattini. Il generatore ora sa che `.nav-item` e `.nav-item.attivo` sono
     lo stesso elemento in due momenti; la prova controlla il risultato;
  9. un blocco più largo della pagina. Finché il ritaglio portava via tutto
     quello che stava fuori dal riquadro, un blocco troppo largo non si vedeva
     uscire: si vedeva TAGLIATO, e sembrava un difetto del bordo. Il calendario
     del mese era larghissimo per davvero — 1561 pixel in un riquadro da 955,
     perché `repeat(7, 1fr)` non fa scendere una colonna sotto il titolo più
     lungo che ha dentro — e due colonne su sette stavano fuori dalla pagina.
  Alla prima passata: settanta casi, in pagine che a occhio non erano mai state
  guardate — «La scienza», «Backup», «Come si usa», il Design lab. Stampa
  TUTTI i casi, uno per riga, e non i primi sei: con l'elenco tagliato si
  lavorava tre volte sugli stessi e mai sugli altri.

  **E che ogni scena sia arrivata dove doveva.** Ogni voce di
  `segni/scene.json` porta un `prova`: un selettore che DEVE esserci quando la
  scena è pronta. Senza, una scena che sbaglia strada non fallisce — mostra
  un'altra schermata, e la prova promuove quella. È esattamente quello che è
  successo: il giorno in cui la porta delle impostazioni si è spostata, otto
  scene su quarantadue hanno smesso di aprire il pannello e sono rimaste sulla
  pagina che c'era sotto. Per settimane il generatore ha misurato la stessa
  schermata otto volte e la prova ha detto che andava tutto bene, mentre le
  pastiglie di quei pannelli restavano archi di cerchio. Adesso la corsa si
  ferma e stampa quali scene non ci sono arrivate.

- **stati.js** — l'app MENTRE REAGISCE: sopra col mouse, a fuoco da tastiera,
  premuta. Le altre prove la guardano ferma, e c'era una famiglia di difetti
  che si vedeva solo tenendo premuto.
  Un `clip-path` taglia tutto il disegno dell'elemento, anche quello che sta
  FUORI dal riquadro del bordo — e fuori un elemento disegna due cose che
  contano solo quando reagisce: l'**ombra** (`box-shadow`, tre livelli
  dichiarati e usati in centoventi punti) e il **contorno di messa a fuoco**
  (`outline`). Col ritaglio pieno non se ne vedeva nessuna delle due: l'app era
  piatta senza saperlo, e chi navigava col Tab vedeva il fuoco spostarsi senza
  nessun segno di dove fosse arrivato. Su «Chiaro · Auto · Scuro» quell'ombra
  era l'unica differenza fra la pastiglia scelta e le altre.
  Nessuna prova poteva accorgersene: `bordi.js` controlla che il BORDO ci sia,
  e il bordo c'era. Gli stati si accendono con `CSS.forcePseudoState` del
  protocollo di Chrome — `:hover` non si simula da JavaScript, e passare il
  mouse su duemila elementi uno per volta costerebbe mezz'ora per schermata.
  Tre controlli: nessun contorno tagliato, nessuna ombra tagliata, nessuna
  evidenziazione a spigoli vivi appoggiata al bordo di un contenitore tondo.
  Nasce da «quando è selezionato o ci passo sopra col mouse non evidenzia tutto
  l'elemento, sembra tagliato o rettangolare» e da «in altri elementi ci
  dovrebbe essere un bordo che li circonda e non sembra esserci».
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
  E il TEMPO glielo diamo noi, col `timestamp` di ogni evento. Senza, il tempo
  fra i due campioni che restano dopo la fusione è la latenza della macchina:
  misurata fra 90 e 180 ms, cioè da 0.39 a 0.78 px/ms con la soglia (0.5) in
  mezzo. La prova passava o non passava a caso — e per un po' è sembrata colpa
  di un foglio di stile che era stato appena toccato. Col tempo dichiarato la
  velocità è sempre 1.40 px/ms: si prova la regola, non la macchina.
  Nasce da «c'è un bug con questi bottom sheet, si blocca tutto» e da «non si
  riesce a portare giù la tendina».

## Come si lanciano

    npm install playwright
    node prove/clic.js
    node prove/modalita.js
    node prove/segni.js      # solo Node, niente browser
    node prove/lezioni.js
    node prove/campi.js
    node prove/giornata.js
    node prove/adesso.js
    node prove/squircle.js
    node prove/bordi.js      # 250 schermate, una decina di minuti
    node prove/stati.js      # 50 schermate × 4 stati × 2 vie
    node prove/promemoria.js
    node prove/doppioni.js   # qualche minuto
    node prove/sezioni.js
    node prove/annulla.js
    node prove/colori.js
    node prove/spazi.js
    node prove/gesto.js

Servono Node e Chromium (segni.js si accontenta di Node). Se Chromium sta in un posto suo:

    CHROMIUM=/percorso/di/chrome node prove/clic.js
