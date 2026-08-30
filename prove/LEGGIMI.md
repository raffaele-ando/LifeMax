# Prove

Diciotto controlli automatici che guardano una cosa sola ciascuno, ma
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
  Poi la cosa che è costata cara: **ogni tracciato che finisce in pagina passa
  per `CSS.supports`**, su otto misure scomode per sette raggi. Un `calc(100% -
  0)` — non valido, perché da una percentuale non si può sottrarre uno zero
  senza unità — faceva buttare al browser l'intera dichiarazione, e l'elemento
  restava a spigoli. Nel foglio di stile il testo sembrava giusto. Oggi nel
  tracciato non ci sono né percentuali né funzioni, solo numeri, e anche
  QUESTO viene controllato invece che dato per buono. C'è la controprova, che
  un valore rotto venga davvero rifiutato.
  Poi le **proporzioni**, perché una maschera SVG stirata farebbe un'ellisse:
  l'angolo misura 27.5×27.3px identico su 300×90, su 90×300 e su 160×160.
  Poi che **la forma la faccia `assets/forma.js`**: che il blocco generato sia
  sparito da `app.css`, che nessuna regola scritta a mano dia una forma col
  ritaglio, che `forma.js` sia caricato prima di `app.js` (se arrivasse dopo,
  il primo disegno della pagina avrebbe gli angoli tondi normali) e che le sue
  costanti non siano divergute da `segni/apple.mjs`.
  Poi — ed è la prova che l'utente ha chiesto guardando una fotografia
  ingrandita, «non sono veri squircle di Apple» — **la curva che esce davvero**,
  misurata sui pixel di un elemento vero disegnato da `forma.js` nell'app: la
  distanza PERPENDICOLARE da ogni punto del contorno alla curva analitica.
  0.10–0.19px su un raggio di 40. In perpendicolare, e non lungo una riga:
  vicino al vertice la curva è quasi parallela al lato, e là un errore di un
  decimo di pixel in verticale ne diventa uno intero in orizzontale — si
  misurerebbe la pendenza invece della forma.
  E con la sua rete, che è la parte istruttiva: un `border-radius` puro dista in
  perpendicolare solo **0.7px** dalla curva di Apple, cioè una prova che
  guardasse solo quella si farebbe ingannare da un arco di cerchio. Quello che
  li separa senza ambiguità è **dove l'angolo si attacca al lato dritto**: un
  raggio per l'arco, 1.528665 raggi per Apple. Le due misure si confrontano fra
  loro, non col numero teorico, perché l'ultimo tratto della curva di Apple
  rientra di meno di un sesto di pixel — meno di quanto uno scatto a sei volte
  la risoluzione possa vedere.
  Poi l'**icona**, che deve avere esattamente il tracciato di `segni/apple.mjs`,
  e le PNG che iOS e Android mascherano da sé, che devono restare piene fino al
  bordo.
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
- **larghezze.js** — dieci larghezze, dal telefono piccolo al tablet. Le altre
  prove ne guardano tre — 320, 390 e 1280 — e in mezzo c'è tutta la fascia dei
  tablet (768, 810, 834, 1024, 1180) che non guardava nessuno. È la fascia dove
  le cose si rompono in modo silenzioso: se la pagina diventa più larga del
  display il browser la mostra RIMPICCIOLITA per farcela stare, e da quel
  momento tutto quello che è agganciato al riquadro d'impianto si stacca da
  quello che si vede — la barra in basso finisce in mezzo allo schermo e sembra
  bloccata lì. Il controllo è uno: la pagina non è mai più larga della
  finestra; quando lo è, la prova dice anche chi sporge, saltando chi ha
  diritto di farlo (chi sta dentro un contenitore che scorre da sé, la
  decorazione senza eventi del puntatore, e chi è fissato al riquadro).
  E una seconda parte per la barra in basso: un browser guidato non sa
  separare il riquadro visibile da quello d'impianto, quindi si prova il
  MECCANISMO — che il fondo della barra passi da `--vv-giu`, e che quel numero
  ci sia davvero qualcuno che lo scrive.
- **adesso.js** ha una sezione nuova, «SI GUARDA, NON SI LEGGE». Nasce da
  «migliora la ux della card nella pagina adesso: non ci deve essere scritto
  cosa è, devo guardarlo e capirlo subito». Prima l'unica differenza fra
  «questa è per adesso» e «questa comincia fra cinque ore» era una parola in
  maiuscolo dentro una pastiglia: tutto il resto della scheda era identico, e
  il segnale più forte — il filo colorato in cima — diceva l'AREA, che è
  l'informazione meno urgente delle due. La prova costruisce i quattro stati,
  butta via le parole e guarda solo le FORME: il colore del filo in cima, il
  fondo, e quanto è piena la barra del tempo. Se due stati danno la stessa
  terna, a occhio non si distinguono, e la prova non passa. In più pretende che
  la barra dica davvero il tempo.
  Poi è arrivata la seconda metà della stessa richiesta — «la card deve avere
  una ux differente ogni volta: abitudine, senza orario, con orario, con
  durata, senza durata, attività» — e i casi sono diventati sette, perché le
  domande sono due e non una: QUANDO sta questa cosa nel tempo, e CHE COS'È.
  Il secondo canale non c'era proprio: un'abitudine e un'attività avevano la
  stessa faccia e la differenza la faceva la parola «abitudine» scritta piccola
  in fondo alla riga dell'area. Conta perché i comandi non sono gli stessi —
  un'abitudine si salta per oggi, una cosa di oggi si rimanda a domani — e chi
  non ha letto quella parola preme il tasto sbagliato.
  L'impronta che la prova confronta è quindi più larga: colore del filo in
  cima, fondo, quanto è piena la barra, COM'È FATTA la barra (piena, vuota,
  tratteggiata, o un segno solo) e che tessera porta il tipo. Sette casi, sette
  impronte diverse. E cinque forme di barra con un significato ciascuna: piena
  a metà mentre la cosa è in corso, piena tutta quando è passata, un binario
  vuoto quando il blocco deve ancora cominciare, un SEGNO solo quando c'è
  un'ora ma non una durata (è un istante, non un pezzo di giornata), un binario
  TRATTEGGIATO quando un orario non c'è. Quest'ultima è l'unica che cambia
  rispetto a prima, dove «quando vuoi» non aveva nessuna barra: l'assenza però
  non è un segno — sembrava solo una scheda con meno roba, e a parità di tutto
  il resto le due schede erano identiche.
- **campi.js** — i campi che si aprono col tocco: l'ora di un pasto, la
  scadenza di un'attività. Nasce da «non funziona il pulsante "a un'altra ora"
  quando indico i pasti della giornata in Rituali», ed è finita in tre puntate,
  che raccontano tutte la stessa cosa.
  UNO. Il tasto c'era e si premeva; sotto ci stava un `input[type=time]` largo
  un pixel, trasparente, ritagliato via e con `pointer-events: none`. Il dito
  non poteva raggiungerlo, e l'unica strada era chiedere al browser di aprire
  l'orologio di sistema su un elemento che non si vede: una richiesta che a
  volte non fa niente, non solleva un errore e non lascia traccia.
  DUE. Il campo diventa visibile, e il tasto chiede il fuoco e poi l'orologio.
  Due richieste in fila: sulla maggior parte dei telefoni il fuoco su un campo
  dell'ora apre già la ruota, quindi la seconda richiudeva quello che aveva
  aperto la prima. L'orologio compariva e spariva.
  TRE, quella buona: **la terza risposta È il campo dell'ora**, ed è un campo
  come tutti gli altri dell'app. Fra il dito e l'orologio non c'è più niente di
  nostro — nessun ridisegno, nessuna richiesta di fuoco, nessuna richiesta di
  aprire niente — e attorno al campo non c'è nemmeno un `<label>`: un'etichetta
  che avvolge il suo campo gli rimanda addosso un secondo tocco, perché è il
  suo compito, e un orologio che ne riceve due si apre col primo e si chiude
  col secondo. Le parole stanno accanto, non intorno. Il campo poi ha la
  stessa identica regola di stile di quelli dei promemoria e del ritmo di base
  — bordo suo, fondo suo, niente sopra — che è la ragione per cui quelli hanno
  sempre funzionato: la traccia che ha risolto il caso è stata «tutti gli altri
  orologi funzionano». Quello che sta in mezzo è la cosa che si rompe.
  La prova chiede al browser CHI RICEVE il tocco nel mezzo del campo — la
  domanda che tutte e tre le versioni hanno risposto diversamente — e poi che
  il campo parta VUOTO (con dentro l'ora solita, riscegliere quella stessa ora
  non fa scattare nessun evento e il tocco va perso), che toccarlo NON lo
  rifaccia da capo (un orologio appeso a un elemento che viene buttato via si
  chiude da solo: è la puntata due), che non abbia nessuna etichetta attorno,
  che abbia un bordo e un fondo suoi come i campi che funzionano, che l'ora
  scelta si salvi come precisa, e che «sì» resti l'ora solita più o meno. Sulla scadenza
  controlla anche che la ✕ resti sopra al campo steso sulla riga: sotto,
  togliere la scadenza avrebbe aperto il calendario.
  Un pop-up di sistema da fuori non si vede — nessun browser guidato lo
  disegna, nemmeno con uno schermo vero sotto: provato — e allora quella parte
  la prova la legge nel codice: chiedere l'orologio A MANO è la strada che si è
  rotta due volte, e l'app non la prende più da nessuna parte.
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
- **dati.js** — NIENTE VA PERSO, MAI. Nasce dal registro delle Scoperte di un
  utente che si è svuotato da solo. La parte che conta non è il controllo: è
  che non si possa dimenticare. Quasi tutti i controlli sono GENERICI sulla
  forma dei dati — girano su `LM.statoVuoto()` invece di nominare i campi —
  quindi un campo aggiunto fra sei mesi rompe la prova finché non gli si dice
  come si unisce, e un elenco nuovo che nessuna scena riempie viene segnalato
  per nome. Dieci controlli: ogni campo ha una regola di fusione dichiarata;
  quello che si salva si rilegge identico campo per campo; unire due copie non
  perde niente (i due stati di prova se li costruisce da sé mettendo una riga
  diversa in ogni elenco, così un campo nuovo entra da solo nel controllo); il
  caso vero delle otto scoperte contro un telefono che non le ha; le spunte di
  un'abitudine messe su due dispositivi che si sommano; una cancellazione vera
  che non torna viva; «Azzera tutto» che funziona lo stesso; un salvataggio
  illeggibile messo da parte invece che buttato; nove cose fatte nell'app che
  sopravvivono a un ricaricamento; e nessun elenco senza copertura.
  Da oggi le lapidi sono provate su OGNI elenco e non su uno solo: si mette
  una riga in ognuno, la si toglie, e si pretende che non torni viva — da
  tutti e due i versi della fusione, perché «chi sono io e chi è l'altro»
  cambia a ogni scambio. Con la controprova che senza lapide la riga torna
  eccome, se no il controllo sarebbe verde perché la fusione non unisce
  niente.

- **cloud.js** — LA SINCRONIZZAZIONE, PROVATA CON UN FIREBASE FINTO. Firebase
  qui non c'è e non deve esserci: una prova che dipende dalla rete non è una
  prova. Le tre librerie vengono intercettate e servite da noi, e il finto sa
  fare tre cose — dire che c'è un utente, consegnare un documento, e ROMPERSI
  a comando. Da lì si guarda cosa fa l'app: che l'ascolto si attacchi, che
  quando cade lo DICA invece di tacere, che si riattacchi da sé senza
  ricaricare la pagina, che le attese raddoppino (2, 4, 8) e ripartano da capo
  solo quando arriva un dato davvero, e che un ritorno sull'app riprovi subito.
  Gli ultimi due controlli sono il caso dell'utente per intero, per la strada
  vera: un documento remoto più povero che NON cancella le scoperte, e le
  trenta azioni dell'altro dispositivo che arrivano lo stesso.
  Da oggi guarda anche la parte che l'utente vede: che un aggiornamento
  arrivato dall'altro dispositivo **compaia sullo schermo** senza ricaricare
  (uno che entra nei dati e non si vede non è arrivato: chi guarda ricarica
  la pagina, che è proprio la cosa che non deve servire), che MENTRE SCRIVI
  lo schermo non si rifaccia sotto le dita ma che quello arrivato compaia
  appena lasci il campo, e che un gesto isolato parta subito mentre otto
  gesti di fila restano una scrittura sola.
  Le due controprove: rimettendo l'ascolto che non si riattacca diventano rosse
  quattro righe; rimettendo il documento che sostituisce invece di unire, una
  riga sola e dice tutto — «le scoperte che stavano solo qui: 9 → 0».
- **scorri.js** — SFOGLIARE DI LATO FRA LE SCHERMATE. Di un gesto così la
  parte facile è riconoscerlo; la parte che decide se l'app resta usabile è
  NON riconoscerlo quando non c'è. Un'app che cambia schermata mentre provi a
  scorrere in basso è inservibile, e chi la usa non pensa «ho fatto un gesto
  storto»: pensa che l'app sia impazzita, perché ha perso il posto in cui era
  senza aver chiesto niente. Quindi i controlli sono venti contro sei — che il
  gesto non parta scorrendo in verticale, in diagonale, dentro le colonne
  della settimana che scorrono già di lato, su un blocco che si trascina, in
  un campo, dal bordo dello schermo (che è del browser, che ci fa indietro e
  avanti), con un foglio aperto, col mouse, e da spento.
  Il dito è vero (`CDP Input.dispatchTouchEvent`): `p.mouse` manda
  `pointerType: mouse`, cioè proprio quello che il gesto rifiuta. E il punto
  in cui si sfoglia non è fisso ma **scelto guardando la pagina**: su «La
  giornata» metà schermo sono blocchi trascinabili, e provare lì misura la
  fortuna invece del gesto.
  Ha trovato due cose. La prima: il gesto scritto con gli eventi puntatore non
  finiva mai, perché il browser manda `pointercancel` appena crede che il dito
  stia scorrendo — la stessa cosa era già scritta con le stesse parole sopra
  al trascinamento del foglio, e ci sono ricascato lo stesso. La seconda: un
  ascoltatore che ingoiava il clic sintetizzato dopo il gesto non ingoiava
  niente, perché a quelle distanze quel clic non arriva. Al suo posto adesso
  c'è una misura: si cerca dove Chromium smette di sintetizzare il clic (a 12
  px sì, a 20 no) e si pretende che la soglia del colpo secco stia sopra.
- **timer.js** — IL TIMER CHE VA AVANTI QUANDO NON LO GUARDI. Nasce da «se
  faccio partire un timer e chiudo il telefono deve continuare, e su
  qualsiasi dispositivo deve andare in tempo reale». Prima viveva in una
  variabile della pagina: chiudevi il telefono e non era mai esistito.
  Adesso sta nei dati, e quello che si salva è l'**ora di fine**, non i
  minuti che restano — un istante assoluto lo legge uguale qualunque
  dispositivo in qualunque momento, mentre un conto alla rovescia salvato
  invecchia appena lo scrivi. Da lì viene tutto il resto gratis.
  «L'altro dispositivo» qui è una seconda scheda del browser: due pagine
  sullo stesso `localStorage` sono la stessa cosa di due telefoni sullo
  stesso documento nella nuvola — quello che si vuole sapere è se l'app
  RILEGGE quello stato invece di fidarsi della sua memoria.
  Controlla anche i quattro tipi (e che quello per partire sia il più corto),
  che il pomodoro vada in pausa da solo e che **lo dica** (una pausa che non
  sai di avere è solo tempo perso), che uscire dallo schermo pieno non fermi
  il timer, che ci si torni dentro se il telefono si è chiuso mentre eri lì,
  e che un timer finito da quaranta ore non salti addosso a chi apre l'app la
  mattina dopo.
  Controlla anche i cinque minuti che NON si fermano: «solo per partire»
  esiste per superare l'avvio, e quando ci riesce fermarsi allo scadere è la
  cosa peggiore che possa succedere — per continuare bisognerebbe tirare
  fuori il telefono, e tirare fuori il telefono mentre stai finalmente
  lavorando è il modo più affidabile di smettere. Quindi registra i cinque
  minuti fatti e riparte da solo con un blocco intero, dicendolo.
  E «quanto ne hai fatto davvero»: quattro gradini invece di due caselle, con
  gli XP in proporzione al pezzo fatto — dare zero a chi ha lavorato mezz'ora
  insegna che vale la pena solo finire.
- **disegno.js** — QUANTO COSTA STARE FERMI. Nasce da «su android ci sono lag
  e bug continui rispetto all'iPad» e dalle foto con rettangoli grigi o neri a
  spigolo vivo in mezzo alle schermate e ai pannelli: erano la stessa cosa. Il
  fondo dell'app — l'aurora, tre aloni che si muovono piano — aveva il blur
  sul contenitore e le animazioni sui figli. Un `filter` sul padre toglie ai
  figli la scheda grafica: il risultato sfocato va rifatto da capo ogni volta
  che dentro si muove qualcosa, e lì dentro qualcosa si muove sempre. Un
  rettangolo di 140vw x 140vh risfocato dal thread principale sessanta volte
  al secondo, a schermo fermo, su ogni pagina. Quando la memoria della scheda
  grafica finisce, le tessere non disegnate restano del colore di riempimento:
  i rettangoli delle foto.
  Tre reti: che niente si muova dentro un `filter` (la regola strutturale, che
  non dipende da quanto è veloce la macchina che fa girare la prova); che a
  schermo fermo, con la CPU rallentata sei volte, si stia sopra i 45
  fotogrammi al secondo; e che nessun titolo esca dal suo blocco nella
  giornata e nella settimana — il blocco è alto quanto DURA l'impegno, e tre
  righe fisse in trenta pixel tagliavano la seconda a metà altezza.
  Da oggi guarda anche LA FESTA e I SUONI. I coriandoli erano trentaquattro
  elementi animati aggiunti tutti insieme — cioè trentaquattro strati nuovi
  sulla scheda grafica, creati proprio nell'istante in cui l'app deve sembrare
  svelta. Misurato con la CPU rallentata sei volte: 601 ms al primo fotogramma
  e 33 fps con gli elementi, 360 ms e 54 fps con una tela sola. La controprova
  rimette i trentaquattro elementi e scende a 22 fps.
  E i suoni: ogni cosa che si preme ne ha uno, e devono essere DIVERSI — un
  ritorno uguale per gesti diversi non dice niente in più di quanto già si
  vede, mentre diverso diventa una conferma che arriva prima dello sguardo.
  La prova non fa rumore: intercetta l'oscillatore quando parte e legge le
  frequenze, quindi non dipende dalla scheda audio della macchina.

  Le controprove sono tre, e una è nata da un errore: rimettere i due difetti
  del testo INSIEME nascondeva il secondo, perché `center` spartisce lo sbordo
  fra sopra e sotto e ogni lato restava sotto la tolleranza. Rimessi uno per
  volta: 18,1 fotogrammi al secondo col filtro, 1,13px di titolo tagliato con
  le tre righe fisse, 0,56px di sbordo in cima togliendo il `safe` al centro.
  (La seconda metà di quella storia sta in **bordi.js**: i rettangoli grigi
  non erano solo l'aurora. Un `clip-path` è una maschera, cioè una texture
  grande quanto l'elemento per la densità dello schermo, e la scheda della
  Giornata su un telefono arrivava a 1074x4188 pixel veri — oltre il limite
  di 4096 di quasi tutte le schede grafiche dei telefoni. Sopra mezzo schermo
  di altezza il ritaglio non si mette più: le maschere di una schermata sono
  passate da 40 MB a 8, e `bordi.js` adesso controlla l'esenzione nei due
  versi e conta quanti elementi la usano, se no i due controlli sono muti.)
- **bordi.js** — la stessa cosa, ma DAPPERTUTTO. Guarda ogni elemento di
  cinquantadue schermate, pannelli e stati (`segni/scene.json`) per cinque
  combinazioni di larghezza e tema: 260 schermate, più di ventimila angoli.
  Nasce da «quelli sono solo alcuni, ce ne sono in varie sezioni e pagine»: i
  difetti li aveva trovati l'occhio, tre o quattro per volta, e ogni volta la
  causa era un'altra con lo stesso aspetto — «il bordo sembra tagliato».

  **Tre delle undici cause di allora non possono più esistere**, e non perché
  siano state sistemate: perché non c'è più il pezzo che le produceva. Il bordo
  era un ANELLO su uno pseudo-elemento, e da lì venivano «l'anello finito sullo
  pseudo-elemento di qualcun altro», «l'anello mangiato dall'`overflow`» e
  «l'anello che scorre col contenuto e finisce in mezzo alle parole». Adesso il
  bordo è un'immagine di sfondo dello stesso elemento: non è posizionato, non è
  uno pseudo-elemento, e uno sfondo non lo taglia l'`overflow` di chi taglia.
  Al posto di tre controlli ne resta uno, che costa niente: che nessuno
  pseudo-elemento porti un ritaglio.

  Le nuove nascono tutte dallo stesso posto — **rileggere quello che abbiamo
  scritto noi**. `forma.js` riscrive il raggio al 99% (serve all'ombra), spegne
  il colore del bordo (lo ridisegna il filo) e mette il filo davanti allo
  sfondo. Tutti e tre, riletti alla passata dopo, danno il valore NOSTRO invece
  di quello del foglio di stile. Le cose che cerca:

  1. un angolo tondo senza la curva (è rimasto un arco di cerchio);
  2. un bordo con lo spessore e nessuno che lo dipinge (bordo sparito);
  3. un bordo dipinto DUE volte (fianchi scuri, angoli chiari);
  4. **il filo e il ritaglio che non dicono la stessa curva.** Sono la stessa
     funzione con un rientro di mezzo spessore: si estraggono i quattro raggi
     da tutti e due i tracciati e devono tornare;
  5. **il filo disegnato su una misura vecchia.** Il colore del bordo, riletto
     dopo che l'avevamo spento, torna «trasparente»: il filo non veniva più
     ridisegnato e restava quello di prima, tarato su un'altra larghezza. Nella
     barra in basso si vedeva come una seconda cornice, più piccola, in mezzo
     alle icone. Si controlla che la larghezza dell'SVG sia quella di adesso;
  6. **il raggio ristretto giro dopo giro.** Il 99% applicato al 99% del 99%:
     la barra in basso, che è l'unico elemento che non viene mai ricreato,
     dichiarava 18 pixel e ne disegnava 5.8 — centododici riduzioni una
     sull'altra. E siccome ogni elemento ne subiva un numero diverso a seconda
     di quanto era vissuto, l'app finiva con forme diverse in punti diversi:
     era questo, e non la curva, a farle sembrare di famiglie diverse;
  7. **le corsie dello sfondo scalate di un posto.** Un elenco di sfondi in CSS
     è a più corsie: ripetizione, misura, posizione, origine e ritaglio sono
     elenchi anche loro, letti in parallelo alle immagini. Mettendo il filo
     davanti senza riportare dietro le regole di quello che c'era, ogni regola
     scivola di un posto. Si è visto sul selettore dell'area nel Diario: la sua
     freccina è «no-repeat, 12px, a destra», si è vista rubare quelle tre
     regole e ha preso quello che restava — ripetuta, a grandezza naturale — e
     nel riquadro comparivano cinque spuntoni grigi sopra il nome dell'area.
     Da fuori sembrava un carattere rotto;
  8. un ritaglio che sta DENTRO il riquadro e mangia quello che sporge. Quello
     di `forma.js` comincia duecento pixel fuori da ogni lato e toglie solo le
     quattro zone d'angolo, quindi non può mangiare niente — ed è per questo
     che la barretta dell'accento della colonna, che sta quattordici pixel
     FUORI dalla voce di menù, si vede;
  9. un angolo più grande di mezzo lato, che si strozza in una punta;
 10. un ritaglio su uno pseudo-elemento: non deve più esistercene;
 11. un blocco più largo della pagina. Il calendario del mese era larghissimo
     per davvero — 1561 pixel in un riquadro da 955, perché `repeat(7, 1fr)`
     non fa scendere una colonna sotto il titolo più lungo che ha dentro — e
     due colonne su sette stavano fuori dalla pagina;
 12. **un'ombra DURA usata al posto di un bordo, anche col fuoco addosso.**
     `box-shadow: 0 0 0 2px` non è un'ombra: è un contorno travestito, e un
     contorno segue il `border-radius`, che è un arco. Quello che si vede
     dell'elemento lo decide il ritaglio, che è la curva di Apple: sui lati
     dritti combaciano, sui quarantacinque gradi l'arco sporge, e negli angoli
     resta una fessura. Un'ombra SFOCATA no: la fessura c'è lo stesso ma la
     sfocatura la copre.
     La parte «col fuoco addosso» è arrivata dopo, da una fotografia
     ingrandita: l'alone viola dei campi era proprio questo, tre pixel e mezzo
     di spread senza sfocatura, e attorno a un campo si vedeva un alone
     squadrato attorno a una cosa che squadrata non è. Un alone esiste solo
     mentre il campo è toccato, quindi guardando la pagina ferma non si vedeva
     mai: la prova adesso tocca i campi uno per uno e guarda l'alone che
     compare. Lo fa su una vista sola — l'alone non dipende dalla larghezza né
     dal tema, e su cinque erano ventitremila messe a fuoco.

  E una rete contro la prova che non prova niente: se il codice mandato in
  pagina si rompe, ogni scena finisce fra le «rotte» e tutti gli altri elenchi
  restano VUOTI, cioè la prova stampa dodici righe verdi che non vogliono dire
  niente. Zero angoli misurati adesso è un fallimento a sé, detto per primo.

  E una riga prima di tutto il resto: il codice che va dentro la pagina si
  COMPILA prima di aprire il browser. `CONTROLLA` è una stringa fra apici
  inversi e là dentro ogni barra rovescia va scritta doppia; chi ne scrive una
  sola non vede un errore di sintassi, vede centocinquantasei scene che «hanno
  sbagliato strada» tutte con lo stesso messaggio, e zero angoli misurati. È
  successo cinque volte con la stessa faccia: adesso è una riga sola, detta
  subito.
  Alla prima passata: settanta casi, in pagine che a occhio non erano mai state
  guardate — «Scienza», «Backup», «Primi passi», il Design lab. Stampa
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
    node prove/larghezze.js
    node prove/giornata.js
    node prove/adesso.js
    node prove/squircle.js
    node prove/dati.js       # niente va perso
    node prove/cloud.js      # la sincronizzazione, con un Firebase finto
    node prove/bordi.js      # 312 schermate, una ventina di minuti
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
