# Verifica 4 — sincronizzazione, copie, calendari (commit `a354d5c`)

Quarta verifica indipendente. Commit sotto esame: **`a354d5c`** (ramo `claude/lifemaxxing-measurement-site-3j5405`). Niente è stato pubblicato, committato o corretto: solo prove e questo rapporto.

**Come è stato provato**
- Un worktree pulito di `a354d5c` in `audit4/wt` (con `node_modules` collegato). `npm run build:nuovo` (tsc + vite) ridà lo **stesso pacco committato** (`pacco/index-DTCSx9wi.js` identico; cambia solo un percorso dentro la `.map`): le prove provano il codice vero (`ris/build.log`).
- Firebase: **solo l'emulatore** (Auth + Firestore con le regole vere di `firestore.rules`), quello di `audit-cloud/fbt`, su porte proprie (base 9400: Firestore 9480, Auth 9499, sito 9401). Mai Firebase vero.
- Browser: Chromium di `/opt/pw-browsers`, sempre lanciato dal banco del ramo (`prove/comune/emulatore.js`), quindi **senza proxy e senza risoluzione dei nomi** (`prove/comune/chiuso.js`): nessuna richiesta può uscire, nemmeno un rimando. Google è finto (la libreria GIS e l'API Calendar servite in locale, come in `prove/nuvola-calendario.js`). **Nessuna richiesta è andata in produzione** e nessun account vero è stato usato.
- Dispositivi: contesti separati di Chromium con i profili iPhone 13, iPad, Pixel e PC; ognuno col suo orologio spostabile. Fino a tre dispositivi insieme sullo stesso account.
- Motore: solo Chromium (WebKit e Firefox non ci sono su questa macchina). Il comportamento di Safari è **emulato** solo nelle dimensioni dello schermo, non nel motore.

**Cosa c'è in questa cartella**
- `script/`: i riproduttori (`a01`…`a07`, `c01`, `a02b-su-d6d4bbd.js`), `lib.js` (il banco comune), `catena.sh` (la catena delle prove del ramo, dal worktree di questa verifica).
- `ris/`: un JSON per riproduttore con ogni controllo e il suo dettaglio; `ris/catena/` con l'uscita della catena del ramo.
- `schermate/`: le foto.

---

## 1. In breve (per il fondatore)

Il giro normale della sincronizzazione regge: tre dispositivi (telefono usato da mesi, iPad riaperto dopo settimane, PC sempre aperto e a un certo punto senza rete) alla fine dicono tutti la stessa cosa, le cose cancellate non tornano e le modifiche non si perdono (`a05`, tutto verde).

I problemi trovati stanno **dove la sincronizzazione incontra altre funzioni dell'app**, e il più grave è uno che chiunque usi due dispositivi può incontrare senza fare niente di strano:

1. **(grave) «Annulla» dal Diario cancella su tutti i dispositivi le cose fatte nel frattempo sugli altri.** Togli una cosa da Oggi sul PC; intanto sul telefono aggiungi un appuntamento e rinomini un'attività; il PC li riceve. Poi sul PC tocchi «Annulla» sulla riga «Rimossa da oggi» (è l'ultima cosa fatta lì, quindi l'app non chiede niente). La cosa tolta torna — e l'appuntamento e la rinomina del telefono **spariscono, dal PC, dal telefono e dal cloud**. Nessun avviso.
2. **(grave) Dopo qualche mese d'uso le copie di sicurezza sul dispositivo smettono di farsi, in silenzio.** La memoria del browser (circa 5 MB) si riempie di copie intere dei dati; da lì «prima faccio un backup» non lo fa più. Provato: con otto mesi di dati, «Ripristina» un backup e la copia «prima di un ripristino» non c'è: quello che c'era prima del ripristino non si può più riprendere.
3. **(medio) Con la rete «appesa» (segnale sì, risposte no: metro, Wi-Fi del treno) la sincronizzazione si blocca e non riparte da sola** nemmeno quando la rete torna buona: per minuti, finché non si ricarica la pagina. L'app dice «Il cloud non risponde».
4. **(medio) Un orologio avanti di più di un giorno, anche una volta sola e senza rete, «congela» la cosa scritta in quel momento** per tutto lo scarto: nessun dispositivo la può più cambiare. Da questa versione (correzione N4) nemmeno il dispositivo stesso: la sua modifica nuova torna indietro sotto gli occhi.
5. **(medio) «Annulla» dopo aver tolto una riunione che viene dal calendario dice «Annullato», la riunione ricompare… e al giro dopo sparisce di nuovo.** Su Google intanto era già stata cancellata, e non torna.
6. **(minore) Ritoccare nome o visione butta fuori dal cloud le copie dei giorni prima.** La correzione N11 prende una copia a ogni ritocco, e il cloud ne tiene trenta in tutto: trenta ritocchi e non resta nessuna copia del giorno.
7. **(minore) Un timer avviato senza rete si spegne da solo** se nel frattempo su un altro dispositivo si è toccato qualunque altra cosa. Provato (`a07`).

Le correzioni dei tre giri precedenti, rilanciate con la catena del ramo: **22 prove su 22 verdi** (capitolo 3).

| ID | Gravità | In breve | Riproduttore (KO su a354d5c) |
|---|---|---|---|
| V4-01 | **grave** | «Annulla» dal Diario cancella ovunque le modifiche arrivate dagli altri dispositivi | `a01-annulla-dopo-cloud.js` (A01.3, A01.4) |
| V4-02 | **grave** | Con qualche mese di dati le copie locali non si scrivono più; «Ripristina» senza copia di prima | `a03-spazio-pieno.js` (A03.1, A03.2) |
| V4-03 | media | Rete «appesa»: la sincronizzazione resta bloccata anche a rete tornata, finché non si ricarica | `a06-rete-appesa.js` (A06.1, A06.2) |
| V4-04 | media | Orologio avanti >1 giorno offline: la cosa resta immodificabile; il dispositivo stesso vede tornare indietro le sue modifiche (effetto di N4) | `a02-orologio-avanti-campo.js` (B1, B2); confronto `a02b-su-d6d4bbd.js` |
| V4-05 | media | «Annulla» su una riunione tolta del calendario: torna e poi sparisce di nuovo; su Google è persa | `c01-annulla-calendario.js` (C01.3) |
| V4-06 | minore | I ritocchi a nome/visione buttano fuori dal cloud le copie dei giorni prima (N11 × 30 copie) | `a04-copie-profilo.js` (A04.1) |
| V4-07 | minore | Timer avviato senza rete spento da una modifica qualunque su un altro dispositivo | `a07-timer-offline.js` (A07.1) |
| — | ipotesi | PWA iPhone: conferma del collegamento del calendario; `hydrate` senza spazio | nessuno (non riproducibile qui) |


---

## 2. I problemi, dal più grave

Per ognuno: cosa vede chi usa l'app, come si riproduce, la prova (riproduttore e uscita), la causa (file:riga di `a354d5c`), la correzione suggerita. Tutti hanno un riproduttore che **fallisce su `a354d5c`**.

### GRAVE

#### V4-01. «Annulla» dal Diario riporta indietro anche quello che è arrivato dagli altri dispositivi, e lo cancella ovunque

**Cosa vede chi usa l'app.** PC e telefono sullo stesso account. Sul PC togli «Cosa da togliere» da Oggi. Poco dopo, sul telefono, aggiungi «Chiamare il medico» e rinomini «Bozza relazione» in «Relazione finale». Il PC li riceve (li vedi comparire). Sul PC apri il Diario e tocchi «Annulla» sulla riga «Rimossa da oggi «Cosa da togliere»» — l'ultima cosa fatta sul PC, quindi l'app annulla subito senza chiedere. Risultato: «Cosa da togliere» torna, ma «Chiamare il medico» **non c'è più** e «Relazione finale» è tornata «Bozza relazione». Su tutti e due i dispositivi e nel cloud. Il telefono non ha fatto niente, e perde il suo lavoro.

**Scenario e passi** (`script/a01-annulla-dopo-cloud.js`):
1. PC e iPhone nello stesso account (emulatore), benvenuto già fatto.
2. PC: due cose in Oggi; poi `rimuoviAzione` di una (riga di Diario «Rimossa da oggi»).
3. Telefono: una cosa nuova e una rinomina; il PC le riceve (A01.0 ok).
4. PC: Profilo → Diario → «Tutto» → tasto «Annulla» sulla riga «Rimossa da oggi» (A01.1 ok: `dopo: 0`, nessun avviso).

**Prova** (`ris/a01-annulla-dopo-cloud.json`):
```
ok  A01.0 il PC ha ricevuto le due cose del telefono  → ["Relazione finale (rinominata dal telefono)","Chiamare il medico (dal telefono)"]
ok  A01.1 … ha «Annulla» ed è l'ultima cosa fatta lì (nessun avviso)  → {"dopo":0,"avviso":false}
ok  A01.2 la cosa tolta è tornata
KO  A01.3 la cosa nuova del telefono c'è ancora (PC, telefono, cloud)
      → {"pc":["Cosa da togliere","Bozza relazione"],"telefono":["Bozza relazione","Cosa da togliere"],"cloud":["Cosa da togliere","Bozza relazione"]}
KO  A01.4 la rinomina del telefono c'è ancora (PC, telefono, cloud)  → (idem)
```
Schermata: `schermate/a01-pc-dopo-annulla.png`.

**Causa.** Un «punto di ritorno» è una copia INTERA dello stato di questo dispositivo, presa prima del gesto (`segnaPunto`, `src/dati/dati.ts:1342-1366`). Le fusioni col cloud (`hydrate`, `dati.ts:2032`, chiamata da `nuvola.ts:1138`) cambiano lo stato senza toccare i punti, e il conto «quante cose sono venute dopo» (`puntoDiRitorno`, `dati.ts:1368`) conta solo i salvataggi di QUESTO dispositivo. `tornaAlPunto` rimette quella copia per intero (`hydrate(vecchio, true)`, `dati.ts:1418`) e poi `marcaRitorno` (`dati.ts:1426` → `1446-1476`) dà una lapide a tutto quello che c'è adesso e non c'era nella copia (le cose arrivate dal telefono) e un orologio nuovo a tutto quello che la copia ha diverso (le rinomine arrivate) — così vince su tutti i dispositivi. L'interfaccia annulla senza chiedere quando `dopo` è 0 (`src/app/app.ts:5960`). Lo stesso meccanismo c'è nel messaggino «Annulla» dei sette secondi (`conAnnulla`, `app.ts:752-760`) e nel «Rimetti» dopo un annulla (`app.ts:5945`), con una finestra più corta.

**Correzione suggerita.** L'annulla deve togliere il GESTO, non tornare allo stato intero di allora. Il modo semplice: con ogni punto salvare anche lo stato subito DOPO il gesto (o la differenza fra prima e dopo), e all'annulla applicare allo stato di adesso solo l'inverso di quella differenza (le righe/chiavi che il gesto ha toccato), lasciando com'è tutto il resto. Ripiego minimo, se non si fa subito: quando una fusione dal cloud cambia qualcosa (`lm:remote` con `arrivato`), considerare quei cambiamenti «venuti dopo» (o buttare i punti più vecchi), così l'app almeno avvisa prima di riportarli indietro.

#### V4-02. Le copie di sicurezza sul dispositivo smettono di farsi, in silenzio, dopo qualche mese d'uso

**Cosa vede chi usa l'app.** Niente: ed è il problema. «Backup e ripristino» mostra sempre le stesse poche copie vecchie; le operazioni che promettono «I dati attuali verranno salvati in un nuovo backup» (Ripristina, Importa, Azzera, Togli l'esempio, Riprendi/Sostituisci dal cloud) vanno avanti lo stesso, senza copia. Se il ripristino era sbagliato, quello che c'era prima non si riprende più (nel cloud c'è solo la copia del giorno, presa al primo salvataggio della giornata: le cose fatte oggi prima del ripristino non sono in nessuna copia, `nuvola.ts:1062`). Per chi usa l'app senza account non c'è nemmeno il cloud.

**Scenario e passi** (`script/a03-spazio-pieno.js`): PC con account; otto mesi di uso realistico (6 cose al giorno, un check-in, un voto, la review, 8 righe di diario: 637 mila caratteri di stato). Poi dodici operazioni che chiamano `LM.backup(…)` (la stessa chiamata di import, ripristino, azzera…), ognuna seguita da una modifica; poi «Ripristina» il backup più vecchio.

**Prova** (`ris/a03-spazio-pieno.json`):
```
..  copie locali prima/dopo ogni backup → 0→1, 1→2, 2→3, 3→3, 3→3, 3→3 … (ferme a 3)
KO  A03.1 ogni operazione che promette «prima faccio una copia» la fa davvero → {"primaCopiaMancata":3}
KO  A03.2 dopo «Ripristina» c'è la copia «prima di un ripristino» → {"ok":true,"n0":1452,"nDopo":1440,"copiaPrimaDelRipristino":false,"copie":3}
..  punti di ritorno dopo una modifica → 3 (dovrebbero essere fino a 12)
```
Il ripristino è avvenuto (1452 → 1440 cose), la copia di prima no.

**Causa.** Tutto sta in `localStorage` (≈5 milioni di caratteri per sito su Chromium; su Safari non è stato misurato, vedi cap. 5): lo stato (`lifemax.v2`), fino a **25 copie intere** (`lifemax.backups.v1`, `dati.ts:1883-1895`) e fino a **12 copie intere** per l'annulla (`lifemax.annulla.p.*`, `dati.ts:1342-1366`). Con uno stato di S caratteri servono fino a 38·S: con 340 mila caratteri (tre mesi d'uso, misura del primo giro) sono 13 milioni. `scriviBackups` ingoia l'errore di spazio (`dati.ts:1880-1882`) e `backup()` non lo dice a nessuno; i punti dell'annulla, quando manca spazio, buttano solo sé stessi (`dati.ts:1347-1355`); `save()` in emergenza taglia le copie a 3 (`dati.ts:1661`). Il chiamante (`restoreBackup`, `dati.ts:1901-1918`; `importJson`, `dati.ts:1975`; `reset`; `riprendiProfilo`; `daCopia` in `nuvola.ts:1420`) non sa che la copia non c'è e procede.

**Correzione suggerita.** (1) `backup()` deve restituire se la copia è stata scritta; se no, prima liberare spazio nell'ordine giusto (i punti dell'annulla e le copie più vecchie, non lo stato) e riprovare; se ancora no, **fermare** l'operazione distruttiva con un avviso («Non c'è spazio per la copia di sicurezza: scarica un file prima di continuare») invece di andare avanti. (2) Mettere un tetto in caratteri, non in numero: per esempio copie locali + punti ≤ 40% della memoria, togliendo prima le copie automatiche più vecchie. (3) Più avanti: punti dell'annulla come differenze invece che copie intere (serve anche a V4-01).

### MEDIO

#### V4-03. Con la rete «appesa» la sincronizzazione resta bloccata anche quando la rete torna buona

**Cosa vede chi usa l'app.** In metro o su un Wi-Fi che «c'è ma non va», fai una modifica: l'app dice prima «Non ancora nel cloud», poi «Il cloud non risponde da un po'». Esci dalla galleria, la rete va benissimo — ma l'app resta su «Il cloud non risponde», e nemmeno le modifiche nuove partono. Tornare sull'app non serve; serve ricaricare la pagina (o che il sistema, dopo molti minuti, chiuda la connessione morta).

**Scenario e passi** (`script/a06-rete-appesa.js`): iPhone con account; le richieste a Firestore vengono trattenute senza risposta (come una connessione TCP che non risponde); si aggiunge una cosa; dopo 40 s le richieste NUOVE tornano a passare (quelle già appese restano appese) e si manda l'evento `online`; si guarda il cloud per due minuti; poi si aggiunge un'altra cosa e si guarda per un altro minuto.

**Prova** (`ris/a06-rete-appesa.json`):
```
..  durante il buco (40 s) → {"stato":"muto","richiesteAppese":1,"quali":["POST …/documents:batchGet"]}
KO  A06.1 tornata la rete, la modifica fatta durante il buco arriva nel cloud entro un minuto → {"arrivata":false,"secondi":121,"statoNellApp":"muto"}
KO  A06.2 una modifica nuova, a rete buona, arriva nel cloud → {"secondi":60,"statoNellApp":"muto"}
```
Una sola richiesta appesa (la lettura dentro la transazione) basta a fermare tutto per più di tre minuti.

**Causa.** `sincronizza()` tiene una sola promessa per volta (`syncInCorso`) e chi arriva mentre c'è un giro in corso si accoda a quella (`src/nuvola/nuvola.ts:1237`), compreso il ritorno della rete (`nuvola.ts:1616-1625`) e il ritorno sull'app (`nuvola.ts:1562-1567`). Il giro (`giro`, `nuvola.ts:1003`, `runTransaction` a `1021`) non ha un tempo massimo, e l'SDK di Firestore non ne mette uno alla `batchGet` della transazione: se quella richiesta non torna, `syncInCorso` non si chiude mai e nessun giro nuovo parte. Il tempo massimo c'è solo su «Esci» e su `svuota` (`conTempo`, `nuvola.ts:1293`).

**Correzione suggerita.** Un tempo massimo sul giro dentro `sincronizza` (per esempio 30–45 s, `Promise.race`): scaduto, lo si tratta come errore di rete (stato «attesa», nuovo tentativo con le attese che raddoppiano) e si libera `syncInCorso`, così il giro dopo apre una richiesta nuova. Il giro vecchio, se un giorno torna, non fa danni (è una transazione che unisce, e il controllo `generazione` c'è già). Se il problema si ripete, chiudere e ricreare il client Firestore (`terminate`) per buttare la connessione morta.

#### V4-04. Un orologio avanti di più di un giorno, anche una volta sola: quella cosa resta «del futuro» e nessuno la può più cambiare — da questa versione nemmeno il dispositivo stesso

**Cosa vede chi usa l'app.** Il PC ha per un po' la data sbagliata in avanti (qui: due giorni; succede con una data messa a mano male, un BIOS resettato, chi sposta la data per un gioco) e in quel momento LifeMax si apre senza cloud e rinomini «Dentista». Poi l'orologio torna giusto e il cloud risponde. Per i due giorni successivi:
- se rinomini «Dentista» dal telefono, il nome torna quello scritto dal PC (come nel giro 3, N4);
- **se lo rinomini dal PC stesso, la tua modifica torna indietro sotto gli occhi**: la scrivi, dopo un secondo c'è di nuovo il nome di prima. Questo è nuovo: prima della correzione N4 il PC almeno vinceva sulle sue cose.

**Scenario e passi** (`script/a02-orologio-avanti-campo.js`, caso B): PC e iPhone nello stesso account; il PC perde il cloud, l'orologio va avanti di 2 giorni, l'app si riapre e rinomina; l'orologio torna giusto, il cloud torna, l'app si riapre (misura lo scarto); il telefono rinomina; poi il PC rinomina ancora.

**Prova** (`ris/a02-orologio-avanti-campo.json`):
```
KO  B02.B1 … la modifica fatta dopo sul telefono vince, ovunque
      → {"pc":"Dentista (PC con la data sbagliata)","telefono":"Dentista (PC con la data sbagliata)","cloud":"Dentista (PC con la data sbagliata)"}
KO  B02.B2 …la modifica nuova del PC stesso resta
      → {"subitoDopoLaModifica":"Dentista spostato a venerdì (PC, orologio giusto)","pc":"Dentista (PC con la data sbagliata)","telefono":"Dentista (PC con la data sbagliata)"}
..  l'orologio del campo «testo» nei dati → {"ora":"2026-11-29T06:42","adesso":"2026-11-27T06:43"}
```
Lo stesso riproduttore sul sito di `d6d4bbd` (prima della correzione N4; `script/a02b-su-d6d4bbd.js`, `ris/a02-SU-d6d4bbd.json`): B1 KO come qui, **B2 ok**. Quindi B2 è un effetto della correzione N4. Il caso A (orologio avanti di 3 ore, meno di un giorno) è verde: lì tutti i dispositivi «seguono» l'ora avanti e l'ordine resta giusto.

**Causa.** Gli orologi dei campi e `aggiornata` delle righe si scrivono con l'ora logica (`segnaOrologi`, `src/dati/dati.ts:1009-1060`, righe `1031` e `1044`), che senza misura è l'ora del dispositivo. La correzione N4 riporta giù solo l'orologio LOGICO (`tetto`, `dati.ts:241-245`, chiamata da `impostaScarto`) e il ricordo dell’ultima ora (`dati.ts:1691`), ma gli orologi già scritti nei dati restano due giorni avanti, e la fusione campo per campo li confronta così come sono (`unisciRiga`, `dati.ts:693`; mappe a `627-656`). Gli altri dispositivi scartano un'ora più avanti di un giorno (`osserva`, `dati.ts:214-219`) e quindi scrivono «prima»; adesso anche il dispositivo stesso scrive «prima». (Sotto il giorno `osserva` la accetta, e per questo il caso A va bene.)

**Correzione suggerita.** Quando un orologio è misurato (`impostaScarto`), «riportare a terra» anche i dati di questo dispositivo: ogni orologio di campo, `aggiornata` e lapide più avanti di `oraCorretta() + ANTICIPO_MAX` scende a `oraCorretta()` (sono ore inventate, e il dispositivo che le ha inventate è l'unico che le può riconoscere come sue). E nella fusione, un orologio più avanti di un giorno dell'ora corretta si tratta come «adesso» invece che come il futuro. Lo specchio dello stesso difetto è l'orologio INDIETRO di giorni senza misura: le modifiche fatte offline perdono contro quelle più vecchie degli altri (non provato a parte: stessa causa).

#### V4-05. «Annulla» dopo aver tolto una riunione del calendario: dice «Annullato», ma al giro dopo la riunione sparisce di nuovo, e su Google non c'è più

**Cosa vede chi usa l'app.** Il calendario Google è collegato. Togli da Oggi la «Riunione di progetto» che arriva da lì: LifeMax, come promette, la cancella anche su Google (al giro del calendario, pochi secondi dopo). Ti accorgi dell'errore e dal Diario tocchi «Annulla»: «Annullato», e la riunione è di nuovo in Oggi. Al giro dopo del calendario (tornando sull'app, o da solo) sparisce di nuovo, e nel Diario compare «è stata cancellata su Google: tolta anche qui». Su Google non c'è più. L'annulla ha detto una cosa non vera.

**Scenario e passi** (`script/c01-annulla-calendario.js`): iPhone con account, Google collegato dalla strada del browser (Google finto, come in `prove/nuvola-calendario.js`), calendario «Lavoro» acceso; la riunione `r1` di domani arriva in Oggi; `rimuoviAzione`; giro del calendario; Diario → «Annulla» su «Rimossa da oggi» (si conferma se chiede); giro del calendario.

**Prova** (`ris/c01-annulla-calendario.json`, schermata `schermate/c01-dopo-annulla.png`):
```
ok  C01.1 tolta in LifeMax, è stata cancellata anche su Google (come promesso)
ok  C01.2 «Annulla»: la riunione torna in Oggi
KO  C01.3 dopo il giro del calendario quello che «Annulla» ha rimesso c'è ancora (in LifeMax o su Google)
      → {"inLifeMax":false,"suGoogle":false,"diario":["Annullato: «Rimossa da oggi «Riunione di progetto»»","Rimossa da oggi «Riunione di progetto»","«Riunione di progetto» è stata cancellata su Google: tolta anche qui."]}
```

**Causa.** La cancellazione su Google parte dal registro `tolti` (`segnaTolta`, `dati.ts:2151-2157`; giro in `src/calendari/sincronia.ts:276-297`). Il caso «tornata in vita prima del giro» è coperto (`sincronia.ts:282`), quello «tornata in vita DOPO che il giro l'ha già cancellata là» no: l'attività torna col suo legame (`esterno`) a un evento che non esiste più, e il giro dopo la tratta come «sparita là» e la toglie (`sincronia.ts:443-455`).

**Correzione suggerita.** Quando un annulla / un ripristino rimette un'attività il cui `tolti[id]` è già `fatto`, staccarla (`esterno = null`, come per le fatte a `sincronia.ts:447-449`) oppure ricrearla nel calendario di destinazione; e in ogni caso non dire «Annullato» senza dire che su Google non torna.

### MINORE

#### V4-06. Ritoccare nome o visione fa uscire dal cloud le copie dei giorni prima

**Cosa vede chi usa l'app.** Chi sistema la sua visione un po' alla volta (scrive, esce dal campo, rilegge, ritocca) lascia nel cloud una copia «prima di cambiare nome o visione» per ogni ritocco. Il cloud ne tiene trenta in tutto, quindi ogni ritocco fa uscire la copia più vecchia: dopo trenta ritocchi in «Backup e ripristino → Nel cloud» ci sono solo trenta copie della stessa mezz'ora, e nessuna dei giorni prima — proprio quelle che servirebbero per «Sostituisci» o «Riprendi tutto».

**Prova** (`script/a04-copie-profilo.js`, `ris/a04-copie-profilo.json`): tre copie del giorno (27, 28, 29 novembre), poi 30 ritocchi della visione.
```
KO  A04.1 le copie dei giorni prima restano nel cloud → {"primaDelGiorno":3,"dopoDelGiorno":0,"totale":30}
    (dopo: {"prima-di-cambiare-il-profilo":30})
```

**Causa.** La correzione N11 (`guardaProfilo`, `src/nuvola/nuvola.ts:1222-1226`) chiede una copia a OGNI cambiamento di nome/visione, e la potatura tiene le ultime trenta di qualunque tipo (`potaCopie`, `nuvola.ts:1331-1349`, `COPIE_DA_TENERE` a `110`).

**Correzione suggerita.** Al più una copia «prima di cambiare il profilo» ogni ora (o una al giorno: serve la versione di PRIMA della giornata di ritocchi), e la potatura per tipo: le copie del giorno hanno i loro trenta posti, quelle «prima di…» un numero piccolo a parte.

#### V4-07. Un timer avviato senza rete si spegne se su un altro dispositivo si tocca qualunque cosa

**Cosa vede chi usa l'app.** In metro, senza rete, fai partire un blocco di concentrazione da 50 minuti sul telefono. Intanto sul PC si spunta una cosa qualsiasi. Il telefono ritrova la rete: il timer sparisce, su tutti e due.

**Prova** (`script/a07-timer-offline.js`, `ris/a07-timer-offline.json`):
```
ok  A07.0 il timer gira sul telefono
KO  A07.1 tornata la rete, il timer del telefono gira ancora (e il PC lo vede) → {"telefono":false,"pc":false}
```

**Causa (dal codice).** Il campo `timer` si unisce con la regola `recente` (`src/tipi/stato.ts:645`): vince il timer del DOCUMENTO salvato per ultimo (`dati.ts:898`), non quello toccato per ultimo, e `segnaOrologi` non gli dà un orologio. Il telefono offline fa partire il timer (documento all'ora t1); il PC spunta una cosa qualsiasi (documento a t2 > t1); tornata la rete, nella fusione vince il documento del PC, che non ha timer.

**Correzione suggerita.** Dare al timer un suo orologio (`orologi.timer`) scritto da `avviaTimerDati`/`fermaTimerDati`/`aggiornaTimerDati`, e unirlo con quello invece che con l'ora del documento.

### IPOTESI (non riprodotte)

- **iPhone, app sulla schermata Home: collegare il calendario.** Il giro di collegamento lascia l'app (Google) e torna su `/api/calendari/<p>/ritorno`, che mette il biscotto `lmcal_ok_<p>`; la conferma la fa l'app, con il gettone di Firebase. Su iOS una PWA installata ha memoria e biscotti separati da Safari, e una navigazione verso un altro sito può finire nella vista di Safari dentro l'app: se il ritorno arriva lì e non nella PWA, la conferma non trova o il biscotto o l'accesso, e il pannello resterebbe «Da collegare» («Questo collegamento non era partito da qui…»). Non verificabile qui (serve un iPhone vero). Da provare a mano prima di dire «funziona su iPhone».
- **Spazio pieno anche per la fusione dal cloud.** `hydrate` ignora l'errore di spazio (`dati.ts:2052-2058`): lo stato unito resta solo in memoria e `ultimoScritto` resta quello vecchio, così il salvataggio dopo attribuisce a questo dispositivo, con l'ora di adesso, tutti i cambiamenti arrivati dagli altri. Letto nel codice, non provato a parte (è il seguito di V4-02).

---

## 3. Le correzioni dei giri precedenti, rilanciate

`script/catena.sh` ha fatto girare, da sola, dal worktree di `a354d5c` e con l'emulatore, le 22 prove della catena del correttore (`smoke/tutte.sh`): **22 su 22 verdi**, 627 controlli `ok`, nessun KO (`ris/catena/esiti.txt` e `ris/catena/r-*.txt`): `nuvola-spazio`, `nuvola-account`, `nuvola-fusione`, `impronte`, `lezioni`, `dati`, `cloud`, `ripristino`, `pacco`, `duedispositivi`, `trasloco`, `annulla`, `calendari-server`, `sentinella`, `calendari-intoppi`, `calendari`, `senzarete`, `nuvola-verifica2`, `nuvola-verifica3`, `calendari-github`, `nuvola-ricarica`, `nuvola-calendario`.

Quindi le correzioni dei giri 1–3 fanno quello che le loro prove chiedono: C1/N1/N5 (copie con proprietario), C2 e N2 (conferma del collegamento, anche da github.io verso il dominio), G1/M9/N13 (fusione campo per campo, anche col calendario nel giro vero), G2/N7/N10 (rifiuti, stato «illeggibile», permessi in sospeso che scadono), G3/N8 (service worker, i 3,5 secondi), M1, M5, M6/N3/N6 (ricarica automatica con i tre freni), M7/N4/N12 (orologi), N11 (copia prima di cambiare il profilo).

**Le interazioni fra correzioni trovate qui, che la catena non copre:**
- **N4 × fusione campo per campo** → V4-04 B2: il dispositivo che aveva l'orologio avanti ora vede tornare indietro le sue modifiche (verde su `d6d4bbd`, rosso su `a354d5c`).
- **N11 × tetto delle trenta copie** → V4-06.
- **Annulla (punti di ritorno) × fusione dal cloud** → V4-01; **annulla × calendario** → V4-05. Non sono regressioni delle correzioni, ma la prova `annulla.js` gira su un dispositivo solo e non le può vedere.
- **Le copie locali con proprietario (C1/N1) × spazio** → V4-02: la logica delle copie è giusta, ma oltre qualche mese d'uso le copie nuove non si scrivono proprio.

Nessun incidente: nessuna richiesta verso la produzione (tutti i browser con `chiuso.js`, nessuna chiamata di rete da Node fuori da 127.0.0.1).

---

## 4. Cosa ho provato e funziona

| Scenario | Come | Esito |
|---|---|---|
| Telefono usato da mesi (310 cose), iPad aperto una volta e poi chiuso per «settimane», PC sempre aperto; sul telefono 10 cancellazioni, 10 spunte, 10 rinomine, 15 cose nuove, visione nuova, spunta di un'abitudine; sul PC 5 rinomine, poi senza rete 5 spunte, una cosa nuova e una rinomina in conflitto con una fatta dopo sul telefono; l'iPad si riapre; il PC ritrova la rete | `script/a05-tre-dispositivi-mesi.js` | **tutto verde**: telefono, iPad, PC e cloud uguali (316 cose), niente risorto, niente perso, vince la modifica fatta dopo |
| Ospite con tre mesi di dati che entra nell'account (primo accesso) e altri due dispositivi che entrano dopo | `a05` (A05.0) | i tre uguali subito |
| Orologio avanti di 3 ore, aperto senza rete, poi misurato: modifiche dopo sullo stesso dispositivo e da un altro | `a02` caso A | verde (sotto il giorno la correzione N4 + `osserva` tengono l'ordine) |
| Le correzioni dei giri 1–3 | catena del ramo, 22 prove | 22/22 verdi (cap. 3) |
| La correzione N11 (copia prima di cambiare il profilo) | `a04` | la copia c'è (30 copie «prima di cambiare…»): funziona, ma vedi V4-06 |
| Il build | `npm run build:nuovo` nel worktree | pacco identico a quello committato |

---

## 5. Cosa NON si è potuto provare, e perché

| Cosa | Perché | Cosa è stato fatto al posto |
|---|---|---|
| Safari vero (iPhone, iPad, Mac), PWA sulla schermata Home, ITP (cancellazione dopo 7 giorni), navigazione privata di Safari | Solo Chromium su questa macchina (niente WebKit in `/opt/pw-browsers`); non si installano browser | Profili iPhone/iPad di Chromium (solo schermo e user agent). Il limite di memoria di Safari per V4-02 **non è misurato**: se è più basso, V4-02 arriva prima |
| Firefox | Non c'è | — |
| Accesso Google vero, redirect di Safari, revoca/scadenza vera dei gettoni Firebase, utente cancellato | Vietato usare account veri; serve Firebase vero | Emulatore (Auth+Firestore). I riproduttori dei giri precedenti su sessione chiusa e cambio d'account sono nella catena |
| Google Calendar e Microsoft Graph veri, Cloudflare vero (Durable Object, cron) | Vietato / non disponibile | Google finto nel browser (`c01`); la catena rilancia `sentinella`, `calendari-server`, `calendari-intoppi`, `calendari-github`, `nuvola-calendario` (Worker e Durable Object veri in Node, fornitori finti) |
| Una connessione davvero morta (TCP senza risposta) per i minuti che servono al sistema a chiuderla | Playwright tiene la richiesta appesa senza limite | `a06` dimostra che l'app non si sblocca da sola; quanto duri nella realtà dipende dal sistema (da pochi secondi se cambia la rete, a molti minuti se la rete resta la stessa) |
| Rete lenta vera (3G), quote di Firestore, migliaia di utenti | Emulatore locale | — |

---

## 6. Come rilanciare

1. Worktree: `git worktree add --detach <cartella>/wt a354d5c`, con un collegamento a `node_modules`. L'emulatore in `audit-cloud/fbt` (o `LIFEMAX_EMULATORE`).
2. Ogni riproduttore: `node script/<nome>.js` (porte base 9400; uno alla volta). Escono con 1 se c'è un KO, e scrivono `ris/<nome>.json`. `LIFEMAX_SITO=<cartella di un altro commit>` serve il sito di quel commit col banco di questo (così è stato fatto `a02b` su `d6d4bbd`).
3. La catena del ramo: `script/catena.sh` (da sola, non insieme ad altro).

---

## Correzioni

Ramo locale `correzioni-verifica4`, sopra `a354d5c`. Ogni correzione ha la sua parte in una prova nuova, `prove/nuvola-verifica4.js` (emulatore, browser chiusi con `prove/comune/chiuso.js`, Google finto), che si lancia intera o a pezzi (`node prove/nuvola-verifica4.js annulla spazio rete orologio calendario copie timer`). Ogni parte è stata rilanciata col sito di `a354d5c` (`LIFEMAX_SITO=` sul worktree della verifica): **rossa su `a354d5c`**, verde dopo. I riproduttori originali sono in `script/` (con i percorsi della macchina di allora).

| # | Correzione | Prova | Commit |
|---|---|---|---|
| V4-01 | Un punto di ritorno non è più una copia intera dello stato: è la differenza fatta dal gesto (righe nate, tolte, cambiate campo per campo; chiavi dei dizionari; aree; punti dati o tolti, disfatti al contrario sul conto del dispositivo). «Annulla» dal Diario, il messaggino dei sette secondi e «Rimetti» applicano l'inverso allo stato di adesso, con lapidi e orologi nuovi (`marcaRitorno`): si fonde come ogni modifica e quello che è arrivato dagli altri dispositivi resta. Se una cosa toccata dal gesto è cambiata dopo, non si tocca niente e si dice perché. I punti vecchi (copie intere) si buttano al primo avvio. «Annulla fin qui» disfa ancora anche i gesti fatti dopo *su questo dispositivo*. | `annulla` | `1b367f5` |
| V4-02 | Copie locali compresse (LZW a 15 bit per carattere, mai surrogati), con la ricchezza a parte; tetto di 1,7 milioni di caratteri e 25 copie, togliendo le più vecchie — mai la nuova, mai quelle senza proprietario. Senza posto si fa spazio (copie vecchie, poi punti dell'annulla) e si riprova; se ancora no `backup()` torna `false` e lo dice. Ripristina, Importa, Azzera, Carica/Togli l'esempio, Riprendi il profilo e le copie dal cloud si fermano e propongono «Scarica e continua». Ipotesi della verifica **confermata**: una fusione dal cloud non salvata per spazio faceva diventare, al salvataggio dopo, le modifiche degli altri modifiche di questo dispositivo: adesso si fa spazio, e `ultimoScritto` è comunque lo stato unito. | `spazio` | `a125dfd` |
| V4-03 | Tempo massimo sul giro (40 s, raddoppia fino a 4 min se scade, torna giù al primo giro riuscito); scaduto, o al ritorno della rete / sull'app, il giro si lascia e il prossimo apre richieste nuove. Il giro lasciato non scrive nel cloud né sul dispositivo se risponde tardi. | `rete` | `b22f848` |
| V4-04 | Una modifica fatta dopo aver visto un valore vince su quel valore: se la chiave ha già un orologio più avanti di adesso, la modifica prende quello più uno (anche `aggiornata` della riga); una lapide nuova sta sopra all'ora della riga che cancella. N4 resta com'è (l'orologio del dispositivo non segue). | `orologio` | `1ce133b` |
| V4-05 | L'annulla non rimette una riunione già cancellata sul calendario: lo dice («…è già stata cancellata anche su Google Calendar, e da qui non si rimette là») invece di «Annullato». Prima che la cancellazione parta, l'annulla rimette tutto. Se l'annulla arriva mentre il giro la cancella, resta in LifeMax staccata, e il Diario lo dice. | `calendario` | `b7e2b27` (e `1b367f5`) |
| V4-06 | La copia «prima di cambiare il profilo» al più una volta all'ora per dispositivo; la potatura tiene 30 copie del giorno e, a parte, 10 delle altre. `prove/nuvola-spazio.js` (12) aggiornata a questa regola. | `copie` | `bd9c329` |
| V4-07 | I campi «recente» (il timer) hanno un orologio scritto da `segnaOrologi`, e la fusione decide con quello. | `timer` | `1ce133b` |

Catena del ramo (`smoke/tutte.sh`, con `nuvola-verifica4` in fondo), da sola: vedi l'esito nel messaggio di consegna.

Cose da sapere:
- Annullare non riporta più indietro quello che è arrivato dagli altri dispositivi; quando l'inverso esatto non c'è (la stessa cosa cambiata altrove dopo), l'annulla si rifiuta invece di indovinare.
- Un gesto che cambia più di 200 000 caratteri (togliere l'esempio, rimandare un mese di cose) non diventa un punto: per quelli resta la copia di sicurezza.
- «Scarica e continua»: senza spazio per la copia sul dispositivo, il file scaricato fa da copia e l'operazione riparte. Entrare in un account e uscirne non si fermano: se la copia non si scrive, l'app lo dice con un messaggio.
- Le «Copie senza proprietario» restano come deciso: non si buttano per far spazio, si scaricano o si eliminano a mano.
