# Prove

Sei controlli automatici che guardano una cosa sola ciascuno, ma
quella cosa fa morire l'app — o la fa diventare illeggibile — quando si
rompe. Sono nati da problemi veri.

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
    node prove/doppioni.js   # qualche minuto
    node prove/sezioni.js
    node prove/annulla.js
    node prove/colori.js
    node prove/spazi.js
    node prove/gesto.js

Servono Node e Chromium (segni.js si accontenta di Node). Se Chromium sta in un posto suo:

    CHROMIUM=/percorso/di/chrome node prove/clic.js
