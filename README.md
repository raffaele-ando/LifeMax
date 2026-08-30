# LifeMax — Misura. Ingegnerizza. Massimizza.

Prototipo interattivo ad alta fedeltà di un **sistema operativo personale per il
miglioramento continuo**: studio/università, salute, progetti da founder, finanze,
relazioni, associazioni, lavoro — tutto misurabile, tutto ingegnerizzabile.

Progettato esplicitamente per un profilo con **bassa coscienziosità, alta apertura
mentale e ADHD**: ogni scelta di design discende da letteratura scientifica (vedi la
vista **Scienza** dentro l'app e la tabella sotto).

## Avvio

Resta un sito statico: nessun server, nessun framework, nessuna compilazione
per farlo partire.

```bash
# 1) doppio click su index.html, oppure
# 2) un server statico qualsiasi:
python3 -m http.server 8080   # → http://localhost:8080
```

## Il build

`index.html` è **generato**. Il file scritto a mano è `index.sorgente.html`: si
cambia quello, e poi si ricostruisce.

```bash
npm install          # una volta sola: serve esbuild, e basta quello
node costruisci.mjs  # scrive assets/pacco/ e riscrive index.html
```

Cosa fa, e perché. Il browser, all'apertura, scaricava e analizzava 1,1 MB di
codice, e per **1,9 secondi** lo schermo restava vuoto. Il 40% di quel
megabyte erano commenti e spazi: nel sorgente valgono più del codice, nel
browser sono peso morto. Il build li tiene dove servono.

- unisce i sette script in **un** file solo, nell'ordine in cui stanno
  nell'HTML — che conta, perché `forma.js` disegna già la prima schermata e
  caricato dopo si vedrebbe un lampo di angoli tondi normali. Il nome del
  sorgente resta scritto in cima a ogni pezzo, così un errore in produzione
  può ancora dire da dove viene;
- tiene **fuori il Design lab**: 101 KB fra codice e stile, analizzati a ogni
  avvio per una pagina in cui non entra quasi nessuno. Adesso se li va a
  prendere da sé quando la si apre;
- lascia `cloud.js` per conto suo, perché è un modulo e importa Firebase da
  fuori a runtime;
- mette **l'impronta del contenuto nel nome** di ogni file. Serve soprattutto
  al contrario di come sembra: appena una riga cambia, cambia il nome, e
  nessuno si ritrova con mezza app vecchia in cache e mezza nuova. (Su GitHub
  Pages la cache dura dieci minuti e non si può allungare; il giorno che il
  sito sta dietro a un CDN configurabile, con questi nomi si può dire
  «tienili per sempre» senza pensarci più.)

Quanto pesa, misurato:

| | prima | dopo |
|---|---|---|
| codice in tutto | 1168 KB | 583 KB |
| **serve per il primo schermo** | **1032 KB** | **481 KB** |
| primo disegno (telefono lento, CPU × 6) | 1944 ms | 1140 ms |

`node prove/pacco.js` rifà i conti in memoria e li confronta col disco: se
qualcuno cambia il codice e dimentica di ricostruire, se ne accorge lì invece
che in rete. **Le prove girano sul pacco**, non sui sorgenti — cioè su quello
che gira davvero: si ricostruisce prima di lanciarle.

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
index.sorgente.html shell scritta a mano (nav, overlay cattura, toast)
index.html          ← generato da costruisci.mjs: non si tocca
costruisci.mjs      il build: un pacco solo, minificato, con l'impronta nel nome
assets/pacco/       ← generato: quello che il browser scarica davvero
assets/app.css      design system: token, 2 skin, chiaro/scuro, mobile
assets/icons.js     iconografia SVG proprietaria + logo Google
assets/data.js      stato, XP/streak/esperimenti, hydrate/snapshot, seed demo
assets/charts.js    micro-libreria SVG: sparkline, trend, heatmap, barre, anello, A/B
assets/app.js       router, viste, timeline "La giornata", onboarding, cattura, UI account
assets/cloud.js     Firebase: accesso Google + sync Firestore (modulo ES)
firestore.rules     regole di sicurezza (accesso limitato ai propri dati)
```

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
