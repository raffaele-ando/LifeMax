# LifeMax — Misura. Ingegnerizza. Massimizza.

Prototipo interattivo ad alta fedeltà di un **sistema operativo personale per il
miglioramento continuo**: studio/università, salute, progetti da founder, finanze,
relazioni, associazioni, lavoro — tutto misurabile, tutto ingegnerizzabile.

Progettato esplicitamente per un profilo con **bassa coscienziosità, alta apertura
mentale e ADHD**: ogni scelta di design discende da letteratura scientifica (vedi la
vista **Scienza** dentro l'app e la tabella sotto).

## Avvio

TypeScript + React + Vite. Serve `npm install` una volta, e poi:

```bash
npm run dev            # server di sviluppo, ricarica a caldo
npm run build:nuovo    # tsc --noEmit && vite build → esce in docs/
npm run tipi           # solo il controllo dei tipi
```

Il sito costruito sta in **`docs/`**, ed è quello che GitHub Pages serve — il
ramo così com'è, senza nessun passaggio di build. Vuol dire che `docs/` va
**committato**, e che se è vecchio il sito è vecchio: `node prove/pacco.js`
ricostruisce in una cartella temporanea e lo confronta, così quel «vecchio» si
scopre lì invece che in rete.

## Com'è fatto

Un motore solo: `tsc` per i tipi, Vite per il pacco, React per le schermate.
Prima erano due build — esbuild per il sito e Vite in modalità libreria per
l'isola React — e due motori vogliono dire due posti dove una regola può
essere diversa: infatti per un giro intero l'isola è finita nel pacco in
versione di sviluppo senza che nessuno lo notasse.

```
src/
  main.tsx            l'avvio: l'ordine in cui i pezzi entrano, e perché
  index.html          lo scheletro (un solo <script type="module">)
  app/app.ts          il motore: router, navigazione, fogli, toast, timer,
                      gesti, e i pezzi di corpo che i componenti chiamano
  app/registro-schermi.tsx   il solo modulo che conosce React e app.ts insieme
  schermi/*.tsx       le sette schermate
  fogli/*.tsx         i quindici pannelli, più fogli/porte.ts (il contratto
                      delle loro proprietà)
  pezzi/              i pezzi dell'interfaccia, usaLM, e le quattro funzioni
                      di stringa che restano
  dati/dati.ts        la verità: fusione, lapidi, backup — non si tocca
  tipi/stato.ts       la forma dei dati, e COME_UNIRE
  segni/ grafici/ forma/ nuvola/ promemoria/ registro/ lab/
```

### Il registro degli schermi, e perché il pacco non si divideva

`render()` nominava una per una tutte e otto le viste, in una catena di `if`.
E ogni vista, quando cambia qualcosa, chiama `render()`. Due archi, e il grafo
delle dipendenze diventa **un anello solo**: da «Adesso» si arriva ad
«Attività» passando per `render`, quindi «Adesso» dipende da «Attività»,
quindi non si possono separare — e siccome vale per tutte, non se ne separa
nessuna. Misurato: la chiusura di ogni vista era **444 KB**, cioè tutto il
file, e la parte «solo sua» era **zero** per tutte e sette.

Adesso le viste si iscrivono (`registraSchermo('inbox', …)`) e `render` le
cerca. Il registro non fa niente di più di quella catena di `if`: è solo
l'unico modo di scriverla che non incolla ogni schermata a tutte le altre.

Tagliato l'anello, il codice si divide così:

| | |
|---|---|
| tronco condiviso fra due o più viste | 300 KB |
| private di una vista sola | **141 KB** |
| fuori da ogni vista (avvio, router, pannelli, timer) | 43 KB |

Dividere per schermata sposta fuori dal primo caricamento **141 KB dei 444**,
non molto di più: le sette schermate sono costruite con gli stessi pezzi — le
righe di elenco, i pannelli, le pastiglie, i grafici — e quei pezzi servono
dappertutto. Vale la pena farlo, ma è il secondo ordine di grandezza, non il
primo.

**Ed è quel taglio che rende possibile la regola di adesso: `app.ts` non
importa React.** Il registro è vuoto e chi disegna si iscrive; il modulo che
conosce tutti e due — `app/registro-schermi.tsx` — è uno, e lo importa
`main.tsx` all'avvio. Se `app.ts` conoscesse i componenti, l'anello
tornerebbe con un altro nome.

Due cose si caricano da sé quando servono, e non prima:

- **il Design lab**, sessantun kilobyte di codice e settantacinque di stile
  per una schermata in cui non entra quasi nessuno. È un `import()` dentro a
  `caricaLab`: Vite lo riconosce e mette quel codice in un pezzo a parte.
  Prima erano uno `<script>` e un `<link>` costruiti a mano coi nomi presi da
  una tabella che scriveva il build — una tabella in meno da tenere allineata;
- **la nuvola**, che va a prendere l'SDK di Firebase dalla rete. L'app
  funziona lo stesso senza — solo su questo dispositivo — e farle aspettare la
  rete vorrebbe dire uno schermo bianco a chi non ce l'ha.

`node prove/pacco.js` tiene ferme tutte e due, perché un `import` messo in
cima al file le rimetterebbe dentro al pezzo principale senza che Vite si
lamenti.

### Perché i tipi, e cosa hanno trovato

`tsconfig.json` è stretto davvero — `strict`, più
`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals` —
e non per gusto del rigore. Questa app è arrivata a diecimila righe con dieci
oggetti globali che si parlavano fra loro, e i difetti che ha prodotto — una
casella che mostrava il testo della nota di prima, un campo senza regola di
fusione, uno stato letto un disegno troppo presto — sono tutti difetti di
**contratto fra due pezzi**: esattamente quelli che un tipo prende a
compilazione invece di farli scoprire a chi usa l'app.

Cos'è venuto fuori convertendo, e nessuna prova lo guardava:

- **`s.misure` non esiste, e non è mai esistito.** Una riga del registro
  tecnico scriveva «misure 0» in ogni fotografia dell'ambiente, da mesi.
- **Il `Timer` nei dati aveva quattro campi che nessuno dichiarava**
  (`pausaFine`, `daAvvio`, `concentrato`, `fermatoA`): li scriveva
  `aggiornaTimerDati` una chiave per volta, senza guardare.
- **`Nodo.passoDi` non c'era**: il pannello della giornata lo leggeva su un
  oggetto che non ce l'aveva, quindi «il passo resta nel progetto» non è mai
  comparso.
- **`togglePasso` non tornava niente** e la scheda passava quel niente a
  `feedbackSpunta`, che con `undefined` sta zitta: spuntare un passo di un
  progetto era l'unico gesto dell'app senza risposta.
- **`filo()` in `forma.js` era morto** da quando `anello()` l'ha sostituito,
  con la sua cache e il suo contatore. L'ha trovato `noUnusedLocals`.
- **Due punti in `charts.js` leggevano una variabile riempita in un
  `forEach`** e letta dopo — la stessa forma del difetto che in React è
  costato uno stato letto troppo presto.
- **`backupRemoto` poteva scrivere `data: undefined`**, che Firestore
  rifiuta: la copia di sicurezza non si faceva e nessuno lo sapeva.

C'è **una** asserzione non controllata in tutto il progetto, `presa()`, e sta
in un file suo (`src/tipi/presa.ts`) perché così si può contare.

### I pezzi

In `app.js` c'erano **566 punti** in cui una forma che esiste già veniva
riscritta a mano come stringa: 86 tasti, 35 schede, 31 righe di elenco, 30
campi. Riscrivere una forma a mano non è più lento — è più **fragile**: la
differenza fra due righe scritte in due punti diversi non si vede finché
qualcuno non cambia il CSS, e allora si rompe in una schermata sola. È così
che sono nati quasi tutti i difetti dell'audit.

Ogni pezzo dice il **ruolo** e mai l'aspetto — `tipo="pieno"` e non
`tipo="blu"` — così la regola di `DESIGN.md` («uno pieno per schermata») vive
nel codice invece che nelle teste.

`prove/pezzi.js` sono **due cricchetti**, e dicono la stessa cosa da due lati:
quante volte una forma è scritta a mano (230, tetto 230) e quali pezzi
esistono e non li chiama nessuno (13 su 19). Non sono due problemi, è uno — le
schermate scrivono il markup invece di chiedere il pezzo. Nessuno dei due
numeri può salire; ogni volta che scendono si abbassa il tetto. Il debito si
paga a rate.

Il cricchetto leggeva solo `app.js` mentre le stesse forme le scrivevano anche
i componenti: **misurava mezzo codice.** Adesso legge tutto `src/`, `class` e
`className` insieme, e i tetti ripartono da quello che c'è davvero — il numero
è salito perché è salito il campo visivo, non il debito.

Il catalogo completo — tutte le forme, i doppioni che ciascuna assorbe e
l'ordine in cui migrarle — sta in **`COMPONENTI.md`**.

### Cosa ha insegnato React

Le sette schermate e i quindici pannelli sono passati **uno per volta**, e
finché non era finito convivevano i due disegni della stessa cosa: nel router
un `if`, e un interruttore in *Impostazioni → Schermate nuove* più
`?classico=1` nell'indirizzo, che spegneva tutto **anche se l'app non
rispondeva più**. A pretendere «identica» c'erano due prove che disegnavano
ogni schermata e ogni pannello nei due modi e confrontavano l'albero elemento
per elemento — tag, classi, testo, id e i `data-` da cui dipendono i comandi:
**sedici sezioni su sette schermate e quindici pannelli, tutti identici**.

Adesso il codice di prima non c'è più, quindi non c'è più nessun posto a cui
tornare, e un interruttore che porta dove non c'è niente è peggio che non
averlo. Quelle due prove sono diventate `prove/impronte.js`: la stessa
macchina, un'altra domanda — l'albero è ancora quello di ieri? Le impronte
stanno in `prove/impronte.json` e si aggiornano con `--aggiorna`, così una
differenza voluta si vede nel diff accanto al codice che l'ha causata.

Le quattro cose che si sono imparate portandole, in ordine di quanto costano:

**«Cambiato» non vuol dire la stessa cosa di qua e di là.** Nel browser
l'evento `change` di un campo di testo o di una data arriva quando hai finito
— esci dal campo, o premi invio. `onChange` di React arriva a ogni tasto
premuto: è `input` con un altro nome. Per rinominare un'area voleva dire un
salvataggio (e un ridisegno di mezza app) per carattere; per la scadenza di
un'attività, una data scritta a metà salvata come «nessuna». Quei campi
tengono l'ascoltatore vero del browser, e la ragione sta in
`src/pezzi/nativo.ts`.

**`defaultValue` vale solo al montaggio.** Il codice di prima rifaceva tutto
`#sheet-corpo` a ogni ridisegno, quindi il campo era un elemento nuovo e
ripartiva da quello che dicono i dati; React invece riusa il nodo che sta
nella stessa posizione. Togliendo la scadenza di un'attività, il campo
continuava a mostrare la data appena tolta. L'ha visto `prove/campi.js`. La
cura è una `key` che cambia: il nodo rinasce, che è esattamente quello che
succedeva prima.

**E in una CODA CHE AVANZA riscrive i dati.** Stessa trappola, morso diverso,
e l'ha trovata chi usa l'app — non una prova. In «Da sistemare» smisti una
nota, la coda avanza, e React riusa il nodo che sta nella stessa posizione:
dentro la casella resta il testo della nota precedente. Poi il tasto «Oggi»
legge il campo, lo trova diverso dal testo della nota, e lo **salva**: la nota
nuova viene ribattezzata col nome di quella appena smistata. Una coda di
cinque note diventa cinque copie della prima, e i testi originali non tornano
più. Nessuna prova lo poteva vedere: guardano **uno schermo**, disegnato una
volta. Da qui `prove/smista.js`, che conta la **sequenza** — smisti, la coda
avanza, e la domanda è se quello che vedi adesso è la nota di adesso, gesto
per gesto fino a svuotarla.

**E la più insidiosa: uno stato di React si vede al disegno DOPO.** La scelta
di «Non del tutto» stava in due variabili normali — toccare una pastiglia le
cambiava, e il tasto «Segna e vai avanti» leggeva il valore di quel momento.
Con uno stato, chi preme le due cose una in fila all'altra arriva al tasto
prima che il disegno sia stato rifatto, e il tasto legge ancora «nessuna
scelta»: quello che avevi fatto non veniva registrato e non valeva i suoi
punti. L'ha preso `prove/timer.js`. La cura è la traduzione fedele — un
riferimento accanto allo stato, dove lo stato accende la pastiglia e il
riferimento risponde a «cos'hai scelto» adesso — e dove il codice di prima
leggeva i CAMPI (il ritmo di base, il nome di una nuova area) li rilegge anche
questo. Leggere i campi è l'unica risposta che non può essere in ritardo.

**E una cosa dei moduli, non di React.** `sottoNav()` **sposta** il nodo delle
linguette della vista dentro a una riga nuova, dopo che la pagina si è
disegnata. Per il codice di prima è una furbizia che funziona; per React è un
figlio portato via dall'albero, e al ridisegno dopo `insertBefore` lo cerca in
un padre in cui non c'è più. La soluzione è un **portale**: il contenitore
delle linguette lo crea il registro a mano come figlio diretto di `#vista`, e
React ci disegna dentro — il nodo può finire dove vuole, di un portale gli
importa il contenitore e non dove sta appeso.

**Portare in React non è ridisegnare.** Una schermata entrava fra le
convertite solo quando era *identica* a quella di prima. È un cambio di
motore, e chi guarda non se ne deve accorgere. (Il primo tentativo qui era una
versione «mia» di Attività, con altre linguette e altro contenuto. Era
sbagliato ed è stato tolto.)


### Una via d'uscita che qualcun altro può annullare da lontano non è una via d'uscita

L'interruttore *Schermate nuove* non c'è più — non c'è più il posto dove
tornare — ma quello che ha insegnato resta, e vale per ogni prossima leva
d'emergenza. Stava in `profilo`, che si sincronizza, e `profilo` si fonde
prendendo quello del documento più recente: bastava che da un altro
dispositivo arrivasse un `react: true` più nuovo, e lo «spento» appena messo
si riaccendeva da solo. È finito in `localStorage`, che per natura è di questo
browser e di nessun altro.

Il campo `profilo.react` è ancora dichiarato in `tipi/stato.ts`, e c'è un
commento accanto che dice perché: `COME_UNIRE` pretende una regola per ogni
campo, e i dati di chi ce l'aveva già messo quel campo ce l'hanno ancora.
Togliere la dichiarazione lasciando il dato vivo vorrebbe dire un campo senza
regola alla prima fusione — che è esattamente il difetto di `demoChiusa`.

### Unire non si può disfare — e per un caso serviva poterlo

Dappertutto, quando due copie dei dati si incontrano, **si unisce**: la
sincronizzazione col cloud, l'importazione da un file, «riprendi una copia».
È una scelta presa dopo una perdita di dati vera, e resta giusta: una copia è
un pezzo della stessa vita, e sceglierne una vuol dire buttare l'altra.

Ma da una fusione non si torna indietro, e c'è un caso in cui unire è
esattamente il problema: **quando quello che c'è adesso non è tuo.** Guardi
l'app con i dati di esempio, fai l'accesso, e otto settimane di roba inventata
entrano nell'account vero. Da lì non c'era nessuna strada: la fusione
aggiunge, l'importazione aggiunge, «riprendi» aggiunge, e l'unica cosa che
sostituisce vale per le copie di *questo* dispositivo — che l'esempio ce
l'avevano già dentro. Succedeva, e non si rimediava.

Adesso ci sono due cose, e sono cose diverse:

- **Non succede più senza che tu lo dica.** Lo stato di esempio si riconosce
  da sé (`demo`), e all'accesso l'app *chiede* invece di unire: «tieni solo i
  miei» oppure «uniscili lo stesso». Non decide al posto tuo, perché non può
  saperlo: chi ha caricato l'esempio può averci lavorato sopra per settimane.
  Se non risponde nessuno entro venti secondi si unisce — la scelta che non
  toglie niente — perché una sincronizzazione appesa è peggio.
- **E se è già successo, si torna indietro.** Prima di unire, il documento del
  cloud viene messo da parte in `users/{uid}/backups/`, e quella copia non la
  tocca più nessuno. In *Backup e ripristino → Nel cloud* adesso ci sono due
  tasti: **Riprendi** aggiunge quello che manca, **Sostituisci** mette quella
  copia al posto di tutto. Il secondo è la sola cosa nell'app che toglie, e
  quindi prende una copia locale prima di farlo.

`prove/cloud.js` tiene tutt'e due le strade, con un Firebase finto che adesso
si ricorda anche le copie di sicurezza — prima le buttava via, e la rete di
sicurezza dell'accesso non la guardava nessuno.

### Dove sta ospitato, e cosa cambierebbe a spostarlo

Oggi è su **GitHub Pages**, che serve il ramo così com'è: `git push` e in un
minuto è online — nessun passaggio di build, per questo `docs/` è committato.
Ogni risposta esce con `Cache-Control: max-age=600`, e non si può cambiare.

C'è un `_headers` pronto per **Cloudflare Pages**, che quel limite non ce l'ha
e che comprime in Brotli invece che in gzip. Quanto vale, misurato allo stesso
modo di sopra:

| | GitHub Pages | Cloudflare Pages |
|---|---|---|
| prima apertura | 1412 ms · 140 KB | **1314 ms · 119 KB** (Brotli) |
| si torna entro dieci minuti | 398 ms | 398 ms |
| si torna il giorno dopo | 677 ms | **576 ms** |

Un decimo di secondo per parte. **Vale la pena perché costa niente, non
perché cambia la vita** — e i 585 KB del build, quelli, valgono dieci volte
tanto. Il passaggio sono due cose: collegare il deposito su Cloudflare Pages
senza comando di build (i file costruiti stanno già dentro, in `docs/`), e
aggiungere il nuovo dominio ai **domini autorizzati** di Firebase, se no
l'accesso con Google smette di funzionare.

`_headers` ha una regola sola, e ci sono due motivi per cui deve restarne una
sola — tutti e due irreparabili dal lato del server. `node
prove/intestazioni.js` li tiene fermi; stanno scritti dentro il file.

Tutto persiste in `localStorage` del browser. Al primo avvio parte l'onboarding
(3 passi, <2 minuti) con l'opzione **"Parti con 8 settimane di dati demo"** per
esplorare il prototipo pieno di dati realistici.

## Il flusso completo (alta fedeltà, funzionante end-to-end)

Il "loop quotidiano" è implementato per intero e persistente:

**☀️ Mattina (60″)** max 3 azioni + intenzione «Se… allora…» → **🎯 Focus** una sola
azione a schermo, timer 10/25/50′ che registra i minuti da solo → **⚡ Check-in (10″)**
energia/focus/umore in 3 tap → **🌙 Sera (2′)** voto alle aree + vittoria + blocco →
**🗓️ Settimana** review strutturata → **👍 Scoperte** quello che hai capito su di
te, e gli **esperimenti** N-of-1 quando vuoi esserne sicuro.

In ogni momento: **cattura istantanea** con `C`, `⌘K` o il bottone `＋` — un campo,
zero categorie, le decisioni si prendono dopo.

Il vocabolario è volutamente ridotto a tre parole — **butta giù → decidi → fai** —
ripetute uguali ovunque, così non ci sono nomi diversi per la stessa cosa (scelta di
progettazione per ridurre il carico su chi ha ADHD/bassa coscienziosità). «Le azioni di
oggi» hanno lo stesso nome in tutti e tre i punti in cui compaiono, con ruoli chiari: le
**scegli** in *Rituali → Mattina*, le **fai** una alla volta in *Oggi*, le **rivedi** in
*Panoramica*.

**📋 Attività** è organizzata in **quattro schede** (una alla volta, così la pagina
resta corta anche con decine di voci): **Da sistemare** (le catture da smistare in
*Oggi* / *Da fare* / *Scarta*), **Da fare** (il backlog, con **chip per area**,
**ricerca** e aree richiuse di default: niente scroll infinito), **In arrivo** (le cose
con una scadenza, dalla più vicina) e **Progetti**. Una cosa da fare può diventare un
**progetto**: la spezzi in **passi** ordinati, vedi una barra di avanzamento e il
pulsante **Passo** porta in *Oggi* solo il prossimo passo non ancora fatto — un po' per
volta invece di tutto insieme. Le **abitudini
ricorrenti** (Rituali → Abitudini) sono separate dalle azioni del giorno, con scelta
dei giorni e serie di costanza. Le **aree** sono personalizzabili (rinomina, crea,
rimuovi) da *Impostazioni → Aree*. Il **check-in** usa una scala ancorata
con descrittori e il riferimento «il tuo solito» (media recente), così il punteggio
è meno ambiguo. Una **guida in-app** (*Impostazioni → Come si usa*) riassume il tutto.

**🎯 Adesso, o più tardi.** La schermata *Oggi* risponde a una domanda sola —
cosa dovrei fare in questo momento — e la risposta si legge prima del titolo, in
una fascia con una parola e un colore: **ADESSO** (con l'ora di inizio e fine),
**IN RITARDO** (con l'ora che era), **QUANDO VUOI** (nessun orario), **PIÙ
TARDI** (con l'ora e quanto manca), **LA PIÙ IMPORTANTE**. Quando tutto quello
che resta è programmato più in là, la scheda lo dice — «adesso non hai niente in
programma» — e il tasto pieno non è più «Fatto» ma **«Falla adesso»**, che porta
qui una cosa di dopo per scelta tua, con la via del ritorno al piano. Fra le
cose di adesso ci sono anche le **abitudini** del giorno: quella delle 7:00 è
quello che devi fare alle 7:00, e la scheda lo dice — con «Salta oggi» al posto
di «Più tardi», perché un'abitudine non si rimanda a domani.

**🕒 La giornata** è una **griglia oraria a blocchi**: sonno, pasti, abitudini e cose di
oggi occupano il tempo che scegli (durata regolabile), con gli spazi liberi visibili e
la riga «adesso». Rende concreto il tempo per chi fatica a percepirlo (time blindness).
È **sempre presente in due posti fissi**, con ruoli diversi: una **barra compatta in
cima a *Oggi*** per uno sguardo veloce, e la **pagina *Giornata*** a sé per la gestione
completa. La **barra** distingue i tipi a colpo d'occhio — le cose con una **durata**
precisa come segmenti che occupano il tempo, quelle a un **solo orario** come punti, i
**pasti** come tacche, le abitudini col contorno — con una piccola legenda dei conteggi;
toccandola si apre un **pop-up leggero** (solo la griglia della giornata, che si adatta
all'altezza dello schermo così non si scorre, con le spunte e un tasto «Gestisci la
giornata»). La **pagina *Giornata*** ha invece la **gestione completa**: in cima, un
unico pannello **Sonno e pasti** (riassunto sempre visibile, si apre per modificare) —
a letto/sveglia con le **ore di sonno** calcolate e ogni **pasto** uno per uno (nome,
ora, durata); vale per quel giorno e resta come registro, mentre il ritmo di base per
gli altri giorni si cambia da lì con «Cambia il ritmo di base» (o da *Impostazioni*).
Sotto: la griglia, l'editor sempre aperto di **orari e durate** e l'**aggiunta rapida**
di cose a oggi. La pagina ha poi quattro **orizzonti** — **Giorno**,
**Settimana** (7 colonne a blocchi, testo a più righe invece che troncato), **Mese** e
**Anno**. Il **Mese** è un calendario «a calore»: lo sfondo di ogni giorno si accende con
quanto è stato pieno e dei mattoncini colorati mostrano le cose fatte per area (i giorni
futuri sono tratteggiati). Da settimana e mese si apre il singolo giorno con un tocco.
Sonno, sveglia e pasti si impostano da *Sonno e pasti*.

**🛏️ Il resoconto della giornata.** Tre dati che l'app non può sapere da sola e
che senza qualcuno che li chieda non esistono: a che ora hai dormito, se hai
mangiato, e le cose che hai fatto senza avere voglia di aprire l'app per
scriverle. Ogni domanda arriva **nel momento in cui la risposta esiste** — la
notte al mattino, i pasti e il resto la sera — una volta al giorno, e «non
adesso» è sempre una risposta valida: la domanda resta nei **Rituali**, dove sta
di casa. Chi è rimasto sveglio fino alle quattro e riapre l'app alle quattro e
dieci **non** si sente chiedere com'è andata la notte: si guarda il buco fra
l'ultima volta che l'app ti ha visto e adesso, e sotto le tre ore una notte non
ci sta. Ogni orario porta con sé **come è stato dato**: «è andata come sempre»
vale *più o meno*, toccare l'orologio e mettere 7:12 vale *preciso*, e la scelta
si sposta da sé (ma chi la fa a mano vince). «Non me lo ricordo» non scrive
nessun orario: meglio un dato che non c'è di un numero inventato. Un pasto
saltato è un dato, non un buco — nella *Giornata* resta al suo posto, sbiadito e
barrato. Le cose scritte dopo nascono già fatte, con i loro XP, e restano
marcate come recuperate.

**👍 Scoperte** (*Andamento → Scoperte*) è il registro di quello che
hai capito su di te, diviso in due mucchi: **Funziona** e **Non funziona**. Una riga di
testo, e accanto l'**evidenza** — *notato una volta*, *lo noto ogni volta*, *misurato* —
perché senza quell'etichetta scrivere «funziona» dopo averlo visto una volta sembra
un'affermazione più grossa di quella che è, e chi tiene alla precisione preferisce non
scrivere niente. Il tasto a sinistra della riga la **gira** nell'altro mucchio: una cosa
che funzionava smette di funzionare, e quello va registrato senza cancellare e
riscrivere. Le due review sanno **salvare** la riga che hai appena scritto (la sera con
«notato una volta», la settimana con «lo noto ogni volta»).

La pagina ha **due sezioni**, non una colonna lunga: *Registro* e **🧪 Esperimenti**.
Erano una sopra l'altra, e con quaranta righe nel registro per arrivare agli esperimenti
bisognava scorrere davanti a tutto quello che si sa già — la strada si allungava proprio
per chi usa il registro di più. Un esperimento si avvia da una riga col modulo già
compilato, e quando dà un verdetto quella riga si aggiorna da sé in «misurato»: è il
ponte fra un'intuizione e quattro settimane di misure.

## Più approcci UX, stessi dati (di proposito)

Tre modalità intercambiabili — la varietà è incanalata nel sistema invece che subita:

| Modalità | Per quando | Principio |
|---|---|---|
| 🎯 **Focus** | la testa è piena | una sola scelta possibile, ricompensa immediata |
| 📊 **Panoramica** | dashboard aperta tutto il giorno (desktop) | auto-monitoraggio reattivo, progresso visibile |
| 🌗 **Rituali** | mattina/sera/settimana | struttura esterna al posto della disciplina |

Due **skin** (🌿 Quiete a bassa stimolazione, 🕹️ Arcade ad alta salienza) e modalità
chiaro/scuro/auto. Desktop-first con sidebar; sotto 860px layout mobile con tab bar.
Le **impostazioni** stanno in fondo alla colonna su desktop e in alto a destra su
telefono, con lo stesso ragionamento: una porta che si apre una volta al mese non può
occupare un quarto della barra che il pollice raggiunge senza spostare la mano.
L'ingranaggio divide la riga con le linguette della schermata — quelle della porta se
ci sono, quelle della pagina se no — così l'angolo in alto a destra è lo stesso posto
su ogni schermata invece di essere una riga vuota su quelle che di linguette di porta
non ne hanno.

Gli angoli sono **supercerchi di Apple** — tre Bézier per angolo, non un arco di
cerchio e non una superellisse — e la forma la fa un `clip-path` generato
(`segni/squircle.mjs`), perché `corner-shape` non c'è ancora. Il ritaglio toglie
**soltanto i quattro morsi d'angolo**: fuori dal riquadro del bordo un elemento
disegna l'ombra e il contorno di messa a fuoco, e un ritaglio pieno li portava via
tutti e due — l'app non aveva più nemmeno un'ombra in centoventi punti che ne
dichiaravano una, e il fuoco da tastiera si spostava senza lasciare traccia. Il
dettaglio sta in `segni/LEGGIMI.md`; le prove che lo tengono in piedi sono
`prove/squircle.js` (i pixel), `prove/bordi.js` (250 schermate) e `prove/stati.js`
(l'app mentre reagisce).

## Perché è fatto così (sintesi — la vista Scienza cita tutto)

| Scelta di design | Base scientifica |
|---|---|
| Cattura istantanea, zero categorie | CBT per ADHD adulto (Knouse & Safren 2010); cognitive offloading (Risko & Gilbert 2016) |
| Una sola prossima azione | deficit di funzioni esecutive (Barkley 1997); choice overload (Iyengar & Lepper 2000) |
| Intenzioni «Se… allora…» | Gollwitzer & Sheeran 2006, meta-analisi d≈0.65; Gawrilow & Gollwitzer 2008 su ADHD |
| Auto-monitoraggio visivo (heatmap, sparkline) | Harkin et al. 2016, meta-analisi di 138 RCT |
| XP immediati a ogni micro-azione | delay discounting in ADHD (Jackson & MacKillop 2016); gamification (Sailer & Homner 2020) |
| Streak **gentile** (un buco isolato non azzera) | auto-perdono e ripresa (Wohl et al. 2010; Breines & Chen 2012) |
| Rituali brevi a orario fisso | RCT CBT/meta-cognitiva per ADHD adulto (Safren et al. 2005, 2010; Solanto et al. 2010) |
| Max 3 azioni al giorno | goal-setting (Locke & Latham 2002); effetto Zeigarnik e pianificazione (Masicampo & Baumeister 2011) |
| Esperimenti N-of-1 | Lillie et al. 2011; standard CENT (Vohra et al. 2015, BMJ) |
| Progetti spezzati in passi, uno per volta in Oggi | sotto-obiettivi prossimali (Bandura & Schunk 1981); goal-setting (Locke & Latham 2002) |
| Timeline «La giornata» (sonno, pasti, abitudini, azioni) | difficoltà a percepire il tempo nell'ADHD (Barkley 1997); cognitive offloading del «quando» (Risko & Gilbert 2016) |
| Un solo vocabolario ripetuto ovunque (butta giù → decidi → fai) | struttura esterna coerente (Safren 2005; Solanto 2010); riduzione del carico da scelta (Iyengar & Lepper 2000) |
| Azioni non fatte muoiono col giorno | fresh start effect (Dai, Milkman & Riis 2014) |
| Frizione minima ovunque | formazione abitudini (Lally et al. 2010; Wood & Neal 2016) |

Le etichette di evidenza nell'app sono oneste: **alta** = meta-analisi/RCT,
**media** = studi solidi non conclusivi, **euristica** = pratica clinica ragionevole.
Il giudice finale è la vista Esperimenti: verifica sul singolo caso, non sulla media.

## Account e sincronizzazione cloud (Firebase)

L'app può funzionare in due modi:

- **Ospite (solo questo dispositivo):** i dati restano in `localStorage`. È il
  comportamento predefinito e l'unico fallback se Firebase non è raggiungibile.
- **Con account Google:** accedendo, tutti i dati vengono salvati su Firestore
  nel documento `users/{uid}` e sincronizzati in tempo reale su ogni dispositivo
  in cui usi lo stesso account Google.

L'integrazione è **progressive enhancement**: se lo script Firebase non si carica
(offline, rete bloccata), l'app continua a funzionare in locale senza errori.

### Come funziona la sincronizzazione (sicura contro la perdita di dati)

- Un solo documento per utente contiene l'intero stato serializzato in JSON.
- **Tutto viene salvato**: ogni azione, scritta, impostazione, selezione o
  eliminazione passa da un'unica funzione `save()` che persiste in `localStorage`
  ed emette l'evento `lm:change`; lo stesso evento fa partire il push sul cloud.
  Non esiste una modifica che aggiorni lo stato senza salvarlo.
- Le modifiche locali vengono salvate sul cloud con un piccolo ritardo (debounce).
- Un listener in tempo reale (`onSnapshot`) applica le modifiche fatte su altri
  dispositivi; se stai scrivendo in un campo, l'aggiornamento viene rimandato per
  non interrompere la digitazione.
- **Uno stato vuoto non sovrascrive mai dati reali.** Al primo accesso su un
  dispositivo si confronta la "ricchezza" (quantità di dati), non solo il
  timestamp: se il cloud ha dati e il dispositivo è vuoto, si adottano i dati del
  cloud (e viceversa). In tempo reale, un aggiornamento vuoto proveniente da un
  altro dispositivo viene ignorato se qui ci sono dati.
- **Backup automatici prima di ogni sostituzione**: in locale (contenitore
  dedicato in `localStorage`, ripristinabili da *Impostazioni → Backup e
  ripristino*) e sul cloud (sotto-collezione `users/{uid}/backups`). Nulla viene
  perso in modo irreversibile.

### Esporta / importa i tuoi dati

In *Impostazioni → I tuoi dati* puoi **esportare** l'intero stato in un file
`.json` (per conservarlo o spostarlo su un altro dispositivo) e **importarlo**.
L'import crea prima un backup dello stato attuale.

### Configurazione lato Firebase (una tantum)

Nella console del progetto `lifemax-9dc63`:

1. **Authentication → Sign-in method:** abilita il provider **Google**.
2. **Firestore Database:** crea il database (modalità produzione va bene).
3. **Firestore → Rules:** incolla il contenuto di [`firestore.rules`](firestore.rules)
   e pubblica. Garantisce che ogni utente acceda solo ai propri dati.
4. **Authentication → Settings → Authorized domains:** aggiungi il dominio su cui
   pubblichi l'app (per lo sviluppo locale `localhost` è già autorizzato).

Il login con Google richiede che la pagina sia servita via **http/https** (non
funziona aprendo il file con `file://`): usa un server statico, anche locale.

### Se il salvataggio cloud non funziona

L'app mostra lo stato di sincronizzazione accanto al tuo nome (footer della
sidebar su desktop, menu «Altro» su mobile): *Sincronizzazione… → Salvato nel
cloud*, oppure un messaggio di errore. Se vedi un errore, quasi sempre manca uno
dei passaggi di configurazione qui sopra:

- **«Database Firestore non raggiungibile»** → il database non è stato creato
  (punto 2): crealo nella console.
- **«Permessi Firestore negati»** → le regole non sono pubblicate (punto 3):
  incolla `firestore.rules` e pubblica.
- L'accesso funziona ma non salva → verifica che il dominio sia tra quelli
  autorizzati (punto 4).

Lo storico di **tutto ciò che fai** è nella scheda **Diario** dentro Panoramica,
giorno per giorno: azioni completate, check-in, review e note catturate, ma anche
un **registro** di ogni scelta e modifica (cose portate in Oggi, smistate, eliminate,
rinominate, cambi di area, orari e durate, sonno e pasti, impostazioni…). Di default
mostra le **cose importanti**; con il flag **«Tutto»** vedi anche le modifiche minori.
Il registro fa parte dello stato, quindi si salva e si sincronizza come il resto.

Nota sugli XP: completare una cosa dà XP; se **togli la spunta** (l'avevi messa per
errore) gli XP vengono **restituiti**, così il conteggio resta corretto.

## Struttura

```
src/index.html      lo scheletro (nav, overlay cattura, toast) e un <script>
src/main.tsx        l'avvio: l'ordine in cui i pezzi entrano, e perché
src/app/app.ts      router, navigazione, fogli, toast, timer, gesti, onboarding,
                    e i pezzi di corpo che i componenti chiamano
src/app/registro-schermi.tsx   chi disegna che cosa: il solo modulo che
                    conosce React e app.ts insieme
src/schermi/*.tsx   le sette schermate
src/fogli/*.tsx     i quindici pannelli
src/fogli/porte.ts  che proprietà vuole ciascuno: un contratto, non un elenco
src/pezzi/          i pezzi, usaLM (il ponte coi dati), le funzioni di stringa
src/dati/dati.ts    stato, XP/serie/esperimenti, fusione, lapidi, seed demo
src/tipi/stato.ts   la forma dei dati, e COME_UNIRE
src/segni/segni.ts  iconografia SVG proprietaria + logo Google
src/grafici/        micro-libreria SVG: sparkline, trend, heatmap, barre, anello, A/B
src/forma/          la curva di Apple applicata al DOM vero, a runtime
src/nuvola/         Firebase: accesso Google + sync Firestore
src/promemoria/     le notifiche: il pezzo che parla col Worker postino
src/registro/       il registro tecnico
src/stile/app.css   design system: token, 2 skin, chiaro/scuro, mobile
public/             icone, manifest, sw.js, _headers: copiati così come sono
docs/               ← il sito costruito, committato: è quello che Pages serve
prove/              trenta controlli, e prove/dove.js dice da dove servire
firestore.rules     regole di sicurezza (accesso limitato ai propri dati)
promemoria/         il Worker su Cloudflare, con le sue prove
segni/              gli strumenti che generano le icone (Node, fuori dal sito)
```

**Cosa non c'è più.** `costruisci.mjs` e `assets/` (il build a esbuild e i
nove file che serviva), `index.sorgente.html` con `index.html` generato,
`react/` (l'isola e il suo Vite in modalità libreria), `assets/pezzi.js` (le
quindici forme come stringhe: ne restano quattro in `src/pezzi/stringhe.ts`,
che `app.ts` usa dove costruisce ancora HTML). E le dieci finestre globali —
`LM_APP`, `LM_REACT`, `LM_PACCO`, `PZ` — che erano il modo di avere un
confine senza avere i moduli.

### Grafici

La palette categorica (8 slot fissi, un colore per area di vita) è la palette di
riferimento validata per visione normale e CVD in entrambe le modalità
(ΔE adiacente ≥8 CVD, ≥15 visione normale); i tre colori sotto 3:1 su superficie
chiara sono sempre accompagnati da etichetta+icona, mai colore da solo. Sequenziale =
un solo blu chiaro→scuro (heatmap). Una sola scala Y per grafico. Tooltip su hover
ovunque; legenda sempre presente da 2 serie in su.

## Limiti del prototipo

- Senza account i dati restano solo in `localStorage` su quel dispositivo; con
  l'accesso Google vengono sincronizzati via Firestore (vedi sopra).
- Gli "input automatici" (calendario, wearable, screen time) sono fuori scope qui:
  il modello dati (`minuti[data][area]`, check-in timestampati) è già pronto a riceverli.
- L'analisi N-of-1 riporta medie ed effect size con avvertenze esplicite; non è
  un'inferenza statistica completa (niente autocorrelazione, niente randomizzazione).
