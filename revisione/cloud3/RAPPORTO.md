# Verifica 3 — controllo indipendente delle correzioni (commit `d6d4bbd`)

Terza verifica, fatta da chi non ha scritto né le verifiche di prima né le correzioni. Commit sotto esame: **`d6d4bbd`** (ramo `claude/lifemaxxing-measurement-site-3j5405`), che è anche quello **già in produzione**: `GET https://lifemax.theproject.world/` e `GET https://raffaele-ando.github.io/LifeMax/` servono `pacco/index-C0BtCH-d.js`, lo stesso pacco del commit; `/sw.js` di produzione è quello nuovo; `/api/calendari/stato` risponde `{"servizio":{"google":true,"microsoft":true}}`.

Domande: le correzioni dei due giri precedenti tengono davvero? Hanno rotto qualcos'altro?

**Come è stato provato**
- Un worktree pulito di `d6d4bbd` (`audit-3/wt`), più `1548c72` (`audit-3/wt-1548`, il codice di prima delle correzioni) e `1a85823` (`audit-3/wt-vecchio`, la «scheda vecchia» delle prove).
- Il sito costruito è quello committato; ricostruito da zero (`tsc --noEmit` e `vite build` in una copia) dà **file identici byte per byte** (`risultati/log/tsc.txt`, `build.txt`): le prove provano il codice sorgente vero.
- Firebase: **solo l'emulatore** (Auth + Firestore, regole vere), due istanze su porte proprie (9480/9499 per i riproduttori dei giri 1 e 2, 9580/9599 per le prove nuove), mai Firebase vero. Calendari: Google e Microsoft finti, Worker e Durable Object veri in Node (`prove/comune/sentinella-finta.js`). Nei browser ogni indirizzo vero è bloccato (`route.abort`) e, per le prove nuove, Chromium è lanciato **senza proxy e senza risoluzione dei nomi** (`--no-proxy-server --host-resolver-rules=MAP * ~NOTFOUND`), così nemmeno un rimando (redirect) può uscire.
- Produzione: solo letture `GET`.
- Motore: solo Chromium (niente Safari, niente Firefox su questa macchina).

**Cosa c'è in questa cartella**
- `script/`: i riproduttori del giro 2 (`n01`–`n09`, `n01b`, `c01`, `c02`), quelli del giro 1 nella forma adattata dal giro 2 (`r1/`), le copie originali del giro 1 (`r1g/`, per riferimento), `script-originali-cloud2/` (gli script del giro 2 prima del cambio di porte: unica differenza, le porte e in `lib.js` il browser lanciato senza proxy né DNS), le prove nuove di questa verifica (`v01`–`v07`, `c01-adattato-conferma.js`), `esegui-tutti.sh` (rilancia tutto) e `catena-ramo.sh` (la catena di prove del ramo, dal worktree di questa verifica).
- `risultati/`: un JSON per script, `log/` con l'uscita di ogni script, `catena-ramo/` con l'uscita della catena del ramo.
- `schermate/`: le foto (scala 1).

---

## 1. In breve (per il fondatore)

**Le correzioni reggono quasi tutte.** Verdetti (capitolo 2): giro 2 — 14 RISOLTO (C2, G1, G2, G3, M1, M2, M3, M4, M6, m1–m5, m12), 4 PARZIALE (C1, M5, M7, m11), 1 NON RISOLTO (M9: il suo riproduttore è rosso come prima), 4 NON RISOLTO per scelta (M8, m6, m7, m13), 3 NON VERIFICABILE (m8, m9, m10); giro 1 — quasi tutti RISOLTO, 8 PARZIALE (regressione N4), S-iPhone NON VERIFICABILE, tutti gli script `r1/` finiti. La catena di prove del ramo (18 prove) è tutta verde anche da qui.

Le due cose critiche del secondo giro:
- **Il calendario di un altro collegato al proprio LifeMax (C2): chiuso.** Il link preparato da un malintenzionato non gli dà più né la lettura né la scrittura del calendario della vittima (provato in tre modi diversi).
- **I dati di Mario ripresi da Luigi dai «Backup» (C1): chiuso per le copie nuove, NON per quelle vecchie.** Su un computer condiviso che aveva già delle copie prese PRIMA dell'aggiornamento, una copia con i dati di Mario viene data a chi è dentro adesso (Luigi), che la vede, la ripristina, e i dati di Mario finiscono nel suo account. Provato.

**Problemi nuovi portati dalle correzioni** (dal più grave):
1. **(grave) C1 a metà**, come sopra: le copie di prima dell'aggiornamento vanno all'account che c'è adesso, anche quando sono di un altro.
2. **(medio) Dal vecchio indirizzo (github.io) non si può più collegare il calendario.** La nuova conferma del collegamento non funziona da lì: compare «Questo collegamento non era partito da qui…». Prima funzionava.
3. **(medio) Se Firebase non parte per un motivo che non è la rete** (un browser vecchio che non capisce il codice di Firebase, un filtro che blocca un solo file), **l'app si ricarica da sola ogni minuto, per sempre**, anche per chi non ha l'account.
4. **(medio) Un orologio andato avanti una volta sola avvelena il dispositivo per tutto quel tempo**: per mesi le modifiche fatte su quel dispositivo vincono su quelle fatte dopo altrove (sul codice di prima no).
5. **(medio) Una cosa scritta da ospite sopra l'esempio, entrando nell'account, finisce in una copia che dall'account non si vede più**; e le copie di quel tipo prese prima dell'aggiornamento vengono buttate (unico posto dove stava quella cosa).
6. **(medio-basso) La ricarica automatica del punto 3 cancella quello che stavi scrivendo** se in quel momento il dito non è su un campo (per esempio: scrivi la review della sera, poi tocchi le stelline; torna la rete; la pagina si ricarica; il testo è perso).
7. (basso) Una chiave dei permessi sbagliata anche solo per qualche minuto costringe tutti a toccare «Ricollega», anche dopo che la chiave è stata rimessa giusta.
8. (basso) Con la «rete che finge di esserci» (metro, treno: il segnale c'è ma non passa niente) l'app ancora non si apre: il service worker aspetta la rete senza limite.
9. (basso, da sapere) Il campo `versioneMinima` sale e non scende: se un giorno si pubblica una versione che lo alza e poi si torna indietro, tutte le schede restano ferme con «C'è una versione nuova» per sempre.

Le cose lasciate apposta (M8, m6–m10, m13, m7) sono al capitolo 5, con il rischio reale di ognuna.

**Un incidente da dichiarare.** Durante la prima prova di `v01` due richieste `GET` sono arrivate davvero a `https://lifemax.theproject.world/api/calendari/google/ritorno?code=codice-finto&state=<id inventato>`: un rimando (302) restituito da una route di Playwright non ripassa dalla route, e Chromium ha usato il proxy di sistema. Erano `GET` di sola lettura, con un codice e uno state inventati (la sentinella di produzione risponde con la pagina «collegamento non valido o scaduto»), nessun dato vero e nessun account. Lo script è stato corretto (i rimandi si fanno dalla pagina) e da lì in poi tutte le prove nuove girano con il browser senza proxy e senza DNS.

---

## 2. I verdetti

Legenda: **RISOLTO** = un riproduttore lo prova; **PARZIALE**; **NON RISOLTO**; **NON VERIFICABILE** (con il perché). «Atteso obsoleto» = il controllo descriveva il difetto o un dettaglio che la correzione ha cambiato apposta; si spiega perché e si indica la prova che lo sostituisce. Nessuna asserzione è stata allentata; dove serviva un adattamento del banco c'è uno script a parte (`c01-adattato-conferma.js`) e quello originale è stato rilanciato così com'è.

### 2.1 Primo giro (`revisione/cloud/RAPPORTO.md`)

Gli script originali del giro 1 (`script/r1g/`) leggono il cloud nel formato a documento unico (`users/{uid}.data`), che il codice non scrive più dal giro 1: sono rilanciati nella forma adattata dal giro 2 (`script/r1/`, cambia solo la lettura del cloud e le porte), con l'emulatore di questa verifica.

Tutti gli script `r1/` sono finiti (`risultati/log/esiti.txt`, ultima riga `FINE`). `r1/s07` va letto in quella prima corsa (25 novembre): i suoi eventi finti hanno date fisse attorno al 23–27 novembre 2026, e una seconda corsa il 27 (`log-r1-s07-calendari-bis.txt`) si ferma a C5 perché l'evento «Treno di notte» è ormai nel passato: non vale come prova. `r1/s06` con 45 e con 200 giorni: 3/3 ok.

| # | Problema del giro 1 | Riproduttori oggi | Verdetto |
|---|---|---|---|
| 1 | Fuga di dati fra account | `r1/r04` R04a.1–b.3 **5/5 ok**; `n02` E, K ok. Residuo per le copie di prima dell'aggiornamento: N1 | **RISOLTO** (le strade del giro 1); vedi C1/N1 |
| 2 | PC sordo, cosa scritta altrove sparisce | `r1/r05` **4/4 ok**, `r1/r01` ok, `r1/s01` **6/6 ok** | **RISOLTO** |
| 3 | Dispositivo nuovo azzera il profilo | `r1/r03` ok; `n02` I ok; `r1/s11` **4/4 ok**; `r1/s09` 9.2 ok, 9.1 rosso come nel giro 2 (supponeva la sessione ancora valida dopo aver cancellato `localStorage`: atteso obsoleto) | **RISOLTO** |
| 4 | Annullare non arriva / torna | `r1/r02` R02a ok; R02b rosso come nel giro 2 solo per 1 punto guadagnato dal PC catturando una nota (spunte, area, orari NON tornano); `r1/s02` ok sulle righe lette | **RISOLTO** |
| 5 | Limite di 1 MB | `n06` D1–D2 ok (2562 azioni, 22 fette); `r1/s05` **5/5 ok** (90–730 giorni) | **RISOLTO** |
| 6 | Modifiche offline perse | `n03` A1–A4 ok (A2 = G1), `r1/s01` S1.2 ok; `r1/s03` **11/11 ok** | **RISOLTO** |
| 7 | App chiusa subito dopo una modifica | `n03` F1–F2 ok (keepalive); `r1/s08` 8.4, 8.4b ok | **RISOLTO** |
| 8 | Orologio sbagliato | `n04` A1–A3 ok, `n08` ok; regressione N4 (`v07`) | **PARZIALE** |
| 9 | «Esci» senza rete perde l'ultima modifica | `n02` E1–E2 ok, `n01` G1 ok; `r1/s04` 16 ok, 2 KO: S4.7 si aspettava la modifica ancora sullo schermo (ora va messa da parte, `n02` E1–E2 la ritrova: atteso obsoleto, come nel giro 2); S4.5a si aspettava l'app disconnessa dopo la cancellazione di IndexedDB, resta dentro lo stesso account (nessuna fuga) | **RISOLTO** |
| 10 | Punti in parallelo | `r1/s03` 3.9 ok; `n06` B5 ok | **RISOLTO** |
| 11 | Sessione chiusa in silenzio | `r1/r04` R04a.1 ok, `n02` E1 ok | **RISOLTO** |
| 12 | Copie nel cloud senza limite | `r1/s10` **ok** | **RISOLTO** |
| 13 | «Azzera tutto» lascia aree e diario | `n05` A1 ok | **RISOLTO** |
| 14 | Due schede | `n02` K ok, `r1/r04` b ok | **RISOLTO** |
| 15 | iPad mostra dati vecchi | `r1/s06` 200 giorni S6.0–S6.2 ok | **RISOLTO** (mitigato) |
| S | Lapidi che scadono | `n08` B1–B2 ok | **RISOLTO** |
| S | Oltre 3000 lapidi | nessun riproduttore delle verifiche; `prove/nuvola-fusione.js` verde | **RISOLTO** solo per la prova del ramo |
| S | Check-in/diario doppioni | idem | **RISOLTO** solo per la prova del ramo |
| S | Accesso iPhone (`authDomain`) | interruttore spento; serve Safari e Google veri | **NON VERIFICABILE** |

### 2.2 Secondo giro (`revisione/cloud2/RAPPORTO.md`)

| ID | Problema (giro 2) | Riproduttori rilanciati, esito oggi | Verdetto |
|---|---|---|---|
| **C1** | Dopo «Esci» i dati restano nei Backup e un altro li porta nel suo account | `n01` A2, B1, C1, D1, E1, E2, F1, F2 tutti **ok** (A3 è rosso perché descriveva il difetto: la copia «all'uscita» non c'è più); `n01b` idem (il primo controllo descriveva il difetto); `c02` 9.2 ok. **Ma** `v02` A1–A2 **KO**: le copie di PRIMA dell'aggiornamento vanno all'account che c'è adesso → la fuga continua per chi le ha (N1). E `v02` B1, C1 KO (N5) | **PARZIALE** |
| **C2** | Il calendario della vittima collegato al LifeMax dell'attaccante | `c01` A4, A5 **ok** (A2 e A3 rossi: A2 cercava il nome di biscotto di prima, cambiato apposta da m5; A3 descriveva il difetto: oggi il ritorno è «da-confermare»); `c01-adattato-conferma` A2 ok; `v06` K1–K7 ok. Regressione: da github.io non si collega più (N2) | **RISOLTO** (con regressione N2) |
| **G1** | Due modifiche a campi diversi della stessa cosa: una sparisce | `n03` A2 **ok** (`testo: "X-ipad (dopo)", done: true`); `n04` F2 ok | **RISOLTO** |
| **G2** | Un no di Google blocca il calendario 7 giorni, «Tutto allineato» | `c02` 5.1 **ok** («1 modifica non accettata… (riprovo più tardi)», l'evento nuovo arriva) | **RISOLTO** |
| **G3** | Senza rete l'app non si apre | `n09` A1 **ok**; `v05` B1–B2, C1, D1 ok (e nessuna versione vecchia dalla cassa). Con la rete che non risponde (metro) ancora no: `v05` A1 KO (N8) | **RISOLTO** (limite N8) |
| **M1** | «Esci» senza cloud, poi entra un altro: la modifica di Mario resta bloccata | `n01` G1 **ok** (`cloudMario: ["Ultima cosa di Mario prima di uscire"]`); G0 ok (descrittivo) | **RISOLTO** |
| **M2** | Chiave dei permessi cambiata: «Collegato» e silenzio | `c02` 7.1 **ok** («Ricollega»); `c01-adattato-conferma` E1 ok (`revocato: true`; nel `c01` originale E1 è verde solo perché nessun conto esiste senza la conferma, vedi sotto); `v06` N1 ok. E2 resta rosso: l'evento nuovo non può arrivare con la chiave sbagliata (atteso obsoleto). Rischio nuovo N7 | **RISOLTO** |
| **M3** | Il calendario resta nel browser dopo «Esci» | `c02` 8.1, 8.2, 9.1 **ok** | **RISOLTO** |
| **M4** | Il controllo delle istruzioni per l'iPhone non può passare | `revisione/cloud/RAPPORTO.md:232` ora controlla `/__/auth/handler`; `GET` in produzione: 200. L'accesso su iPhone resta non provato | **RISOLTO** (le istruzioni); l'accesso da iPhone **NON VERIFICABILE** |
| **M5** | Scheda con la versione vecchia: non riceve, nessun avviso | `n06` C1, C2 **KO** come prima (scheda `1a85823`: per le schede di prima del campo non c'è rimedio, detto anche dal correttore); `n06` B1–B5 ok; `r1/s08` 8.0 e 8.1 **KO** (stessa ragione). Per il futuro: `v04` A1 ok, `prove/nuvola-verifica2.js` ok. Rischio N9 | **PARZIALE** (per costruzione) |
| **M6** | SDK non arrivato all'apertura: il cloud non riparte | `n09` B1, C1, C2 **ok** (B2 rosso: controlla la pastiglia «non ancora nel cloud» 8 s dopo, quando la pagina si è già ricaricata e ha già salvato: atteso obsoleto; la pastiglia prima della ricarica la prova `prove/nuvola-verifica2.js`). Regressioni N3 e N6 | **RISOLTO** (con regressioni N3, N6) |
| **M7** | Orologio molto sbagliato: modifiche perse o tornate indietro | `n04` A1–A3 **ok** (A2 era il rosso del giro 2); `n08` A1–A3, B1, B2 **ok**. Ma `v07` V07.1 **KO**, verde su `1548c72` (N4); `n08` A4 il giorno resta 2001 (N12) | **PARZIALE** (regressione N4) |
| **M8** | «Azzera tutto» e una cosa scritta offline prima: torna | `n05` A2 **KO**; `r1/s08` 8.2 ok (il suo caso non ha la scrittura offline prima) | **NON RISOLTO** (scelta, capitolo 5) |
| **M9** | Titolo cambiato in Google perso se l'attività è segnata fatta altrove | `r1/s07` C6 **KO come nel giro 2**: alla fine telefono, PC, iPad e cloud hanno «Impegno» fatta, Google ha «Colloquio (spostato sala B)» (C1–C5 ok). La prova del ramo `prove/nuvola-fusione.js` «G1/M9» è verde, ma prova solo la fusione dei dati, non il giro vero app + calendario (N13) | **NON RISOLTO** |
| **m1** | Popup chiuso subito → redirect | `n02` B **ok** (redirect 0) | **RISOLTO** |
| **m2** | Il cron sveglia sempre le stesse 40 | `c01-adattato-conferma` I1: 39 riarmate in UN giro del cron, l'asserzione originale («tutte in un giro») è rossa; ma la correzione è «40 all'ora a rotazione» e `v06` M2 prova che in due ore tornano tutte (46/46). `c01` I1 originale: 0, perché senza conferma nessuno entra nell'elenco | **RISOLTO** (come rotazione) |
| **m3** | Sveglia ogni 10 minuti anche con il permesso ritirato | `v06` R1 **ok**, R2 ok | **RISOLTO** |
| **m4** | Il proxy `/__/auth` porta fuori biscotti e Authorization | `c01` H1, H2 **ok**; `v06` P1, P3 ok | **RISOLTO** |
| **m5** | Due collegamenti insieme: il primo fallisce | `v06` D1b **ok**. (`c01` D1 è descrittivo e modella un barattolo in cui il secondo biscotto sostituisce il primo — vero prima, falso adesso che i nomi sono diversi: atteso obsoleto) | **RISOLTO** |
| **m6** | Offline + memoria cancellata: perso | `n02` H3 **KO** | **NON RISOLTO** (scelta) |
| **m7** | Due schede, nella seconda un altro account | `n02` L: la cosa scritta nella scheda A finisce nel cloud di Leo | **NON RISOLTO** (scelta) |
| **m8** | Account cancellato sul server | `n02` F, F2 **KO** come prima | **NON VERIFICABILE** (serve Firebase vero) |
| **m9** | Gettoni di un utente disabilitato validi fino a un'ora | codice invariato | **NON VERIFICABILE** (serve Firebase vero) |
| **m10** | Nessun limite di spazio, chiunque crea utenti | regole invariate | **NON VERIFICABILE** (serve la console) |
| **m11** | «Riprendi il profilo» non aiuta lo stesso giorno | `n05` C1 **KO** (N11) | **PARZIALE** |
| **m12** | Trasloco senza chiedere; proposta che ritorna | `n07` C2 (`proposta: false`) e D1 (nel cloud di Dario solo la sua cosa) — erano controlli descrittivi del difetto, oggi mostrano il contrario; `prove/nuvola-verifica2.js` m12 ok | **RISOLTO** |
| **m13** | Fusi orari | `n04` C1 (comportamento voluto) | **NON RISOLTO** (voluto) |

Gli scenari «NON VERIFICATO» / «NON CHIARO» del giro 2 restano tali: `n04` E2 (lo schermo a mezzanotte: il controllo guarda l'intestazione «LifeMax», che non cambia) e `n03` I2 (cloud muto che torna: le richieste appese della prova non si chiudono come in una rete vera) sono rossi come allora, per le stesse ragioni.

---

## 3. Problemi nuovi o tornati, dal più grave

Per ognuno: cosa vede chi usa l'app, la prova, la causa (file:riga di `d6d4bbd`), la correzione suggerita. Tutti **confermati da uno script**, salvo dove è scritto.

### GRAVE

#### N1. C1 a metà: le copie locali di PRIMA dell'aggiornamento vanno all'account che c'è adesso, anche quando sono di un altro

**Cosa vede chi usa l'app.** PC di casa, prima dell'aggiornamento. Mario, dentro col suo account, fa una cosa che lascia una copia automatica dei SUOI dati (per esempio «Riprendi una copia dal cloud», che prima ne prende una «prima di riprendere una copia dal cloud»; lo stesso fanno ripristino, importazione, «Azzera tutto», «Riprendi il profilo»). Mario esce; entra Luigi. Arriva la versione nuova. Luigi apre «Backup e ripristino»: fra le SUE copie c'è quella con le cose di Mario. La ripristina: nel cloud di Luigi ora c'è il nome «Mario Rossi» e l'azione privata di Mario.

**Prova.** `script/v02-copie-di-prima.js`, caso A: versione `1548c72` e poi `d6d4bbd` sullo stesso indirizzo (la memoria del browser passa dall'una all'altra come in un aggiornamento). A0 la copia senza proprietario c'è; **A1 KO**: dopo l'aggiornamento la copia ha `chi` = uid di Luigi ed è nel suo elenco; **A2 KO**: ripristinata, `nomeNelCloudDiLuigi: "Mario Rossi"`. Schermata `v02-a-luigi-dopo-ripristino-copia-di-prima.png`.

**Causa.** `sistemaCopieSenzaProprietario()` (`src/dati/dati.ts:1745-1758`): una copia senza proprietario che non sia «uscita»/«prima di entrare» va a chi è unito al dispositivo ADESSO (`dati.ts:1754`, `if (chi) { b.chi = chi; … }`). Ma «adesso» non dice niente su chi era dentro quando la copia è stata presa: su un dispositivo condiviso, prima dell'aggiornamento, c'era chiunque.

**Correzione suggerita.** Una copia senza proprietario non si può attribuire: buttarla, oppure darla solo se il dispositivo non è MAI uscito da un account (nessuna «generazione», come già si fa per l'ospite, `dati.ts:1755`). In alternativa confrontare il contenuto (`profilo.nome`, email) con l'account; ma la regola semplice è più sicura. Le copie nel cloud restano comunque per ogni account.

### MEDIO

#### N2. Dal vecchio indirizzo (github.io) il collegamento del calendario non si conferma più

**Cosa vede chi usa l'app.** Su `raffaele-ando.github.io/LifeMax/`, dentro col proprio account, Impostazioni → Calendari → «Collega Google» → sì a Google → di ritorno l'app dice «Questo collegamento non era partito da qui, o non da questo account: per sicurezza non l'ho usato» e il calendario resta «Da collegare». Ogni volta. Sul dominio nuovo funziona. Prima della correzione C2 funzionava anche da github.io.

**Prova.** `script/v01-conferma-da-github-io.js`: l'app vera servita sui due indirizzi (intercettati e serviti in locale), Worker vero, Google finto. V01.0 (dominio) **ok**; **V01.1 KO** (github.io: «Da collegare», la sentinella ha il permesso solo in «pendenti»); **V01.2 KO**: la richiesta di conferma da github.io arriva SENZA biscotto (`"cookie": ""`), mentre dal dominio lo porta. Sul codice di prima (`RADICE=…/wt-1548`, `risultati/v01-conferma-da-github-io-SU-1548c72.json`) il pannello dice «Collegato» su tutti e due gli indirizzi. Schermate `v01-dominio.png`, `v01-github-io.png`.

**Causa.** Da github.io l'app chiama la sentinella su un ALTRO sito (`src/calendari/server.ts:56-57`) con una `fetch` senza `credentials: 'include'` (`server.ts:121`); e il biscotto `lmcal_ok_<p>` è `SameSite=Lax` (`sentinella/worker.mjs:122`), che il browser non manda in una richiesta da un altro sito comunque. Quindi `corpo.biscotto` è vuoto e `conferma` risponde «altro-browser» (`sentinella.mjs:239`).

**Correzione suggerita.** La più semplice: da github.io il collegamento del calendario porta sul dominio nuovo («Il calendario si collega da lifemax.theproject.world»), che è comunque dove va il trasloco. Non mettere `SameSite=None` sul biscotto: indebolirebbe proprio la difesa di C2.

#### N3. Se Firebase non parte per un motivo che non è la rete, l'app si ricarica da sola ogni minuto, per sempre

**Cosa vede chi usa l'app.** L'app si apre, poi dopo un minuto la pagina si ricarica da sola; poi ancora, e ancora, finché resta aperta e a vista. Succede anche a chi non ha l'account. Chi sta leggendo, scorrendo, o ha un foglio aperto lo perde ogni minuto.

**Quando.** Quando il codice di Firebase arriva da gstatic ma non si riesce a usarlo: un browser troppo vecchio per Firebase 12 (un iPad fermo a una versione vecchia di iOS), un filtro o un'estensione che blocca solo uno dei tre file, un errore dentro l'avvio dopo gli `import`.

**Prova.** `script/v03-ricarica-sdk.js`, caso B: `firebase-firestore.js` servito non eseguibile, gli altri due normali. **B1 KO**: 3 ricariche in 200 secondi (`risultati/v03-ricarica-sdk.json`).

**Causa.** `src/nuvola/nuvola.ts:416-433`: se l'avvio fallisce (`catch` a `nuvola.ts:603-610`, qualunque errore) si arma un controllo ogni minuto che, se `firebase-app.js` risponde, ricarica la pagina (`nuvola.ts:427`). Il controllo guarda solo che gstatic risponda, non perché l'avvio è fallito; il limite «una volta al minuto» (`sessionStorage`) non ferma il giro.

**Correzione suggerita.** Ricaricare da sola al massimo UNA volta per sessione (o due), e solo se l'errore era di rete (`TypeError: Failed to fetch dynamically imported module` / `navigator.onLine` falso all'apertura); poi mostrare «Il cloud non è partito: Ricarica» e lasciare il tocco alla persona.

#### N4. Un orologio andato avanti una volta sola avvelena il dispositivo per tutto quel tempo

**Cosa vede chi usa l'app.** Il PC ha per un momento l'orologio sbagliato in avanti (qui: +400 giorni; succede con una data impostata a mano male, un BIOS resettato in avanti, un test), e in quel momento si apre LifeMax mentre il cloud non risponde e si scrive qualcosa. Poi l'orologio torna giusto e il cloud risponde. Da quel momento, **per 400 giorni**, ogni modifica fatta su quel PC vince su qualunque modifica fatta DOPO sugli altri dispositivi alla stessa cosa: rinomini «Riunione» dal PC alle 10:00, la rinomini dal telefono alle 10:02 → resta quella del PC, ovunque.

**Prova.** `script/v07-orologio-avanti-ricordato.js`. Su `d6d4bbd`: V07.0 ok (l'ultima ora ricordata è `2027-12-30`, lo scarto rimisurato è 0), **V07.1 KO**: `{"pc":"Riunione (scritto dal PC alle 10:00)","telefono":"…dal PC alle 10:00","cloud":"…dal PC alle 10:00"}`. **Sul codice di prima (`1548c72`) la stessa prova è verde** (vince il telefono): è una regressione della correzione M7 (`risultati/v07-orologio-avanti-ricordato-SU-1548c72.json`; lì V07.0 è rosso solo perché la chiave `lm-ultimo-istante` non esisteva).

**Causa.** La correzione M7 ricorda l'ultima ora vista in `localStorage` (`lm-ultimo-istante`, scritta a ogni salvataggio `src/dati/dati.ts:1662`, riletta all'apertura `dati.ts:196`) e `adesso()` non scende mai sotto di essa (`dati.ts:206`). Un'ora sbagliata in avanti, una volta scritta, resta il pavimento dell'orologio logico finché l'ora vera non la raggiunge; prima stava solo in memoria e spariva alla ricarica. Gli altri dispositivi non la seguono (scartano un'ora più avanti di un giorno, `dati.ts:211-217`), quindi scrivono sempre «prima» di lui. Peggio: un dispositivo con l'orologio prima del pavimento e non misurato accetta qualunque ora arrivi (`osserva`, «dubbio»), quindi l'ora avvelenata può propagarsi.

**Correzione suggerita.** Ricordare l'ultima ora vista solo se non è più avanti dell'ora corretta di più di qualche minuto; e quando arriva una misura nuova dello scarto (`impostaScarto`), riportare `ultimoIstante` a `min(ultimoIstante, oraCorretta() + 1 giorno)`. L'argomento del commento («una modifica fatta dopo deve sempre avere un'ora più grande di una fatta prima qui») vale per pochi secondi di differenza, non per un anno.

#### N5. La cosa scritta da ospite sopra l'esempio: entrando nell'account finisce in una copia che dall'account non si vede, e quelle di prima dell'aggiornamento vengono buttate

**Cosa vede chi usa l'app.** Una persona prova l'app con «Carica l'esempio», ci aggiunge cose sue, poi accede con Google. Lo schermo si riempie con i dati dell'account; le cose sue spariscono (è il comportamento deciso: l'esempio, e quello che c'era sopra, va in una copia «prima di entrare nell'account»). Prima la copia si vedeva in «Backup e ripristino» e si poteva riprendere quello che serviva. **Adesso, stando dentro l'account, quella copia non compare**: la si vede solo uscendo. E chi aveva già una copia del genere presa prima dell'aggiornamento la **perde**: l'aggiornamento la butta.

**Prova.** `script/v02-copie-di-prima.js`. Caso C (tutto su `d6d4bbd`): C0 la cosa sua è solo nella copia (`chi: ""`); **C1 KO**: l'elenco «Backup e ripristino» nell'account è vuoto (schermata `v02-c-backup-nell-account-senza-la-copia-dell-ospite.png`). Caso B (copia presa con `1548c72`, poi aggiornamento): **B1 KO**: dopo l'aggiornamento la copia con la cosa sua non esiste più nel browser.

**Causa.** `lasciaEsempio()` chiama `pulito('prima-di-entrare-nell-account')` (`dati.ts:4644`) PRIMA che la nuvola scriva il proprietario del dispositivo (`nuvola.ts:761` contro `nuvola.ts:1142`), quindi la copia prende `chi: ''` (`dati.ts:1777`) e `mie()` (`dati.ts:1760`) la nasconde all'account; e in quel ramo `primaUnione(uid)`, che passerebbe le copie dell'ospite all'account (correzione `a6a33ec`), non si chiama (`nuvola.ts:762-765`). La migrazione mette `prima-di-entrare-nell-account` fra le «copie di uscita» da buttare (`dati.ts:1743`, `1753`), ma quella copia non contiene i dati di un account che esce: contiene i dati dell'ospite che entra.

**Correzione suggerita.** In `lasciaEsempio` passare l'uid che entra e dare quella copia a lui (è lo stesso ragionamento di `a6a33ec`); togliere `prima-di-entrare-nell-account` da `COPIE_DI_USCITA` e trattarla come le copie dell'ospite.

#### N6. La ricarica automatica (M6) cancella quello che stavi scrivendo, se in quel momento il dito non è su un campo

**Cosa vede chi usa l'app.** App aperta con la rete che va e viene: il cloud non è partito. Apri la review della sera, scrivi «Oggi ho finito il capitolo 3», poi tocchi le stelline per dare i voti alle aree. Torna la rete: la pagina si ricarica da sola. La review è vuota, il testo è perso (non era ancora salvato: si salva con «Salva»).

**Prova.** `script/v03-ricarica-sdk.js`, caso A: A0 condizioni vere (testo nel campo, fuoco su una stellina, niente salvato); **A1 KO**: `ricaricata: true`, campo vuoto. Schermate `v03-a-review-scritta-prima-della-rete.png`, `v03-a-dopo-la-ricarica-automatica.png`.

**Causa.** `staiScrivendo()` (`nuvola.ts:412-415`) guarda solo l'elemento col fuoco. Ma nei fogli dell'app (review della sera e della settimana, esperimenti, piano, benvenuto…) il testo scritto vive nei campi finché non si tocca «Salva», e i bottoni dentro il foglio prendono il fuoco (su iPhone il fuoco va al corpo della pagina). Il commento «i dati sono già tutti salvati sul dispositivo a ogni modifica» vale per i dati, non per un foglio a metà.

**Correzione suggerita.** Ricaricare da sola solo se nessun foglio è aperto e nessun campo della pagina ha un valore diverso da quello iniziale; altrimenti mostrare la striscia con «Ricarica» (come per la versione nuova) e lasciar decidere.

### BASSO

#### N7. Una chiave dei permessi sbagliata anche per pochi minuti costringe tutti a «Ricollega», anche dopo averla rimessa giusta

`script/v06-sentinella-c2.js` N: chiave cambiata → al primo giro il conto diventa «revocato» (N1 ok, è la correzione M2); chiave rimessa → **resta «revocato»** (N2 KO). Causa: `sentinella.mjs:281-286` scrive `revocato` per qualunque errore di decifrazione, e niente lo riporta indietro. Rischio: basso (serve un errore di configurazione), ma il costo è un tocco su «Ricollega» per ogni persona. Correzione: segnare un errore di decifrazione come stato a parte («illeggibile») che si riprova a ogni giro e diventa «revocato» solo dopo un po' (per esempio 24 ore).

#### N8. «Rete che finge di esserci»: l'app non si apre

`script/v05-service-worker.js` A1 KO: il server non risponde alla pagina (succede in metro e in treno: il segnale c'è, i dati no); dopo 15 secondi la pagina è ancora bianca, anche se in cassa c'è tutto. Causa: `sw.js:98-110` aspetta la rete senza limite prima di usare la cassa. Non è una regressione (prima non si apriva nemmeno senza rete), ma è il caso più comune del «senza rete» vero. Correzione: un tempo massimo (3–4 s) per la pagina, poi la cassa.

#### N9. `versioneMinima` sale e non scende: un rollback chiude fuori tutti

`script/v04-versione-minima.js` B1 KO: con `versioneMinima: 2` nel documento (come lo scriverebbe una versione futura) e il sito tornato alla versione 1, la scheda mostra «C'è una versione nuova» e non salva più, anche dopo «Ricarica», per sempre (`nuvola.ts:939`, `nuvola.ts:996` `Math.max`). Oggi non succede (`v04` A1: `versioneMinima` = 1). Da sapere: alzare `VERSIONE_MINIMA` è un'operazione senza ritorno; serve un modo di riportarlo giù (a mano dalla console, documentato) prima del primo rialzo.

#### N10. I permessi della vittima restano (cifrati) nella sentinella dell'attaccante

`v06` L1: dopo il tentativo C2 la riga `pendenti` con il refresh token cifrato della vittima resta finché l'attaccante non fa un altro collegamento (`sentinella.mjs:220`). Senza il segreto (che sta solo nel browser della vittima) non si usa. Correzione: cancellare le righe scadute anche nella sveglia e in `cambi`.

#### N11. m11 ancora rosso nel suo riproduttore

`n05` C1 KO: il profilo rovinato lo stesso giorno, su un dispositivo già unito, non si riprende con «Riprendi il profilo» (le uniche copie nel cloud sono le due «primo accesso di un dispositivo», prese quando il profilo era ancora vuoto). La correzione copre solo il primo accesso di un dispositivo nuovo, non il caso del riproduttore. Correzione: una copia nel cloud prima di ogni cambiamento di nome/visione (sono rari).

#### N13. M9 non è corretto nel giro vero dell'app

`r1/s07` C6 (giro 1, rosso anche nel giro 2): il telefono segna fatta la riunione, il PC staccato dal cloud legge da Google il titolo nuovo; alla fine LifeMax ovunque ha «Impegno» e Google «Colloquio (spostato sala B)», e i giri dopo non li riallineano. La correzione `74fd19c` rende verde la prova del ramo, che fonde due stati scritti a mano, ma nel giro vero il titolo arriva dal calendario per una strada che non lascia l'orologio del campo `testo` più recente della spunta (da guardare in `src/calendari/sincronia.ts`, `applica`, e in `segnaOrologi`). Gravità come nel giro 2: medio.

#### N12. M7: le cose scritte su un tablet tornato al 2001 finiscono ancora nel giorno 1° gennaio 2001

`n08` A4 (descrittivo): `giornoTablet: "2001-01-01"`. Le ore sono corrette dalla correzione, il giorno no (il «giorno di oggi» usa l'orologio del dispositivo). Nessuna perdita, ma la cosa non si vede in «Oggi». Correzione: calcolare `todayKey` con l'ora corretta quando l'orologio è sotto il pavimento.

---

## 4. Le correzioni lette da avversario: cosa regge

Ogni commit di `git log 1548c72..d6d4bbd` è stato letto cercando un modo di romperlo. Quello che ha retto:

- **C2, la conferma (`bef9ed6`).** Il biscotto `lmcal_ok_<p>` è `HttpOnly; Secure; SameSite=Lax; Path=/api/calendari/; Max-Age=600` (`sentinella/worker.mjs:122`), si cancella dopo la conferma (`worker.mjs:165-167`), e il Worker lo legge solo dall'intestazione Cookie (`worker.mjs:158`): mettere il segreto nel corpo non serve (`v06` K4). Il segreto porta l'id della sentinella e la conferma lo confronta con il proprio (`sentinella.mjs:239`): un id inventato o il segreto di un altro giro danno «altro-browser» (`v06` K4). Il link dell'attaccante aperto dalla vittima torna «da-confermare», la conferma della vittima va alla SUA sentinella e non collega niente, l'attaccante non legge e non scrive (`c01` A4–A5, `v06` K2–K5); il giro normale collega (`v06` K6, `c02` 1.1). Il cron non si confonde: una sentinella entra nell'elenco solo dopo la conferma (`v06` M1) e l'id del Durable Object è sempre quello del gettone (`idFromName(uid)`), mai uno passato da fuori, tranne in `/vai` e `/ritorno` che però trovano solo uno state esistente. Unica cosa che resta: i permessi della vittima, cifrati, restano nella sentinella dell'attaccante finché lui non fa un altro collegamento (la riga `pendenti` si cancella solo a un nuovo ritorno, `sentinella.mjs:220`; `v06` L1). Senza il segreto non si usano: rischio basso, ma andrebbero cancellati alla scadenza (anche nella sveglia).
- **Il proxy di `/__/auth` (`11c7ec2`).** In uscita niente `Cookie` né `Authorization` (anche scritti in maiuscolo: `Headers` è insensibile alle maiuscole), in entrata niente `Set-Cookie` né HSTS (`v06` P1, P3; `c01` H1–H2). Passa `Proxy-Authorization` (`v06` P2): innocuo (il browser non lo manda a un sito), da togliere per pulizia. Nessuna traversata fuori da `/__/` (`c01` H3).
- **m2, m3, m5 (`11c7ec2`).** Il cron sveglia 40 sentinelle all'ora a rotazione: con 46 collegate, in due ore tornano tutte (`v06` M2). Un conto ritirato con la coda vuota non si rimette la sveglia, un conto vivo sì (`v06` R1–R2). Due collegamenti insieme: i due biscotti hanno nomi diversi e il primo «sì» passa (`v06` D1b).
- **G1/M9, la fusione campo per campo (`74fd19c`).** La rinomina offline resta anche con una spunta più recente altrove (`n03` A2), ma il caso del calendario NON regge nel giro vero (`r1/s07` C6 rosso, N13), e nessuno dei 30 riproduttori del giro 1 e 2 che toccano la fusione è peggiorato. Le schede della versione `1a85823` che riscrivono non distruggono niente (`n06` B1–B5). Nota: una scheda di una versione di PRIMA (per esempio `1548c72`, rimasta aperta da ieri) fonde ancora riga per riga, quindi finché resta aperta può rifare G1 una volta; si esaurisce da sé alla ricarica.
- **G2 (`1e6bcbd`).** Un no di Google su una riga non ferma più il giro e il pannello lo dice (`c02` 5.1: «1 modifica non accettata dal calendario (riprovo più tardi)»).
- **G3, il service worker (`4cdfe14`).** Senza rete l'app si apre con i dati e anche le parti caricate dopo (Laboratorio, cloud) ci sono (`n09` A1, `v05` B1–B2). **Nessuna trappola di «versione di ieri»**: con la rete, dopo una pubblicazione nuova, la prima ricarica mostra la nuova (`v05` C1, D1). La cassa ha un nome fisso (`lifemax-app-1`) ma tiene solo file con l'impronta nel nome e `index.html`, che si prende sempre dalla rete prima: il nome fisso non è un problema. Limite: senza un tempo massimo la «rete che finge di esserci» blocca l'apertura (problema N8).
- **M1 (`f319d7b`).** La modifica di Mario uscito senza cloud arriva nel SUO cloud anche se poi entra Luigi (`n01` G1).
- **M5 per le versioni future.** Con la versione di oggi due dispositivi non si chiudono fuori a vicenda (`v04` A1: `versioneMinima` = 1, nessuna striscia); la striscia «C'è una versione nuova» compare quando serve (`prove/nuvola-verifica2.js`, verde).
- **M7 nei casi del giro 2.** `n04` A1–A3 e `n08` A1–A3, B1–B2 tutti verdi: tablet nel 2001, PC con l'anno avanti, orologio +3 h aperto senza cloud.

---

## 5. Le cose lasciate apposta: rischio reale

Rilanciati i loro riproduttori: sono tutti ancora come nel giro 2 (nessuno è peggiorato).

| # | Cosa | Riproduttore oggi | Rischio reale | Giudizio |
|---|---|---|---|---|
| **M8** | «Azzera tutto» mentre un altro dispositivo è senza rete e ha appena scritto: quella cosa ricompare | `n05` A2 **KO** (la riga torna su telefono, PC e iPad) | Basso. Serve «Azzera tutto» (raro) PIÙ un altro dispositivo offline con una scrittura nuova. L'effetto è una cosa in più che ricompare, non una cosa persa; si toglie a mano. La scelta del correttore (non rimettere il «taglio», che nel giro 1 cancellava dati veri) è giusta: il rimedio sbagliato perde dati, il difetto no. | Accettabile; dirlo nella finestra di «Azzera tutto» («se hai altri dispositivi senza rete, ricollegali prima») |
| **m6** | Modifiche offline e poi memoria cancellata dal browser (Safari dopo 7 giorni, «Cancella dati»): perse | `n02` H3 **KO** | Medio su iPhone: Safari cancella la memoria di un sito non usato per 7 giorni, ma solo se in quei 7 giorni l'app non è stata aperta — e una modifica offline non salita vuol dire che dopo non c'è mai stata rete con l'app aperta. Caso stretto. Inevitabile lato codice (la memoria non c'è più). | Accettabile; la PWA installata sulla schermata Home è esente dalla regola dei 7 giorni: consigliarla |
| **m7** | Due schede: nella seconda entra un altro account; quello che scrivi nella prima finisce nell'account nuovo | `n02` L: la cosa scritta nella scheda A dopo il cambio è nel cloud di Leo (`cloudLeo: ["scritta nella scheda A dopo il cambio"]`) | Medio-basso. Serve un browser condiviso con due schede aperte e un cambio d'account in una sola. Chi scrive nella prima scheda vede «non collegato» ma la sua cosa va nell'account dell'altro: è una piccola fuga di privacy nella direzione «da me a lui». | Da correggere quando si può: la prima scheda, vedendo `lm-account-unito` cambiare, dovrebbe smettere di salvare e mostrare «Qui è entrato un altro account: ricarica» (non serve ricaricare da sola) |
| **m8** | Account cancellato sul server: l'app non se ne accorge; rientrando nasce un uid nuovo, vuoto | `n02` F, F2 **KO** come prima (solo emulatore) | Basso per la sicurezza, alto per la confusione se succede (dati «spariti», in realtà orfani). Succede solo se qualcuno cancella l'utente dalla console di Firebase. | NON VERIFICABILE senza Firebase vero; non cancellare utenti dalla console |
| **m9** | Il Worker accetta il gettone di un utente disabilitato fino alla sua scadenza (un'ora) | lettura del codice: `sentinella/identita.mjs` invariato | Basso: un'ora di accesso al proprio calendario dopo una disabilitazione. | Accettabile (servirebbe l'SDK Admin) |
| **m10** | Nessun limite di spazio per account in Firestore, chiunque con Google può creare utenti | `firestore.rules` invariato | Basso oggi (pochi utenti, piano gratuito con tetti di Google); diventa un costo se qualcuno abusa. | NON VERIFICABILE senza console; mettere un avviso di spesa sul progetto Firebase |
| **m13** | Abitudine spuntata la sera a New York: per Roma è «ieri» | `n04` C1 (comportamento voluto) | Nessun danno ai dati; solo chi viaggia lo nota. | Accettabile |

---

## 6. La catena di prove del ramo

`script/catena-ramo.sh` è la copia di `smoke/tutte.sh` del correttore, ma gira dal worktree di questa verifica (`audit-3/wt`) con l'emulatore di `audit-cloud/fbt` (`LIFEMAX_EMULATORE`). Risultato (`risultati/catena-ramo/esiti.txt`): **18 su 18 verdi** — `nuvola-spazio`, `nuvola-account`, `nuvola-fusione`, `impronte`, `lezioni`, `dati`, `cloud`, `ripristino`, `pacco`, `duedispositivi`, `trasloco`, `annulla`, `calendari-server`, `sentinella`, `calendari-intoppi`, `calendari`, `senzarete`, `nuvola-verifica2`. Più `tsc --noEmit` (0 errori) e `vite build` (pacco identico a quello committato).

La catena è verde ma **non copre** nessuno dei problemi nuovi del capitolo 3: non prova le copie di prima dell'aggiornamento con un proprietario sbagliato, il collegamento da github.io, l'SDK che fallisce per un motivo diverso dalla rete, l'orologio avanti ricordato, la copia dell'ospite con l'esempio.

---

## 7. Cosa NON si è potuto verificare

| Cosa | Perché | Cosa è stato fatto al posto |
|---|---|---|
| Safari vero (iPhone, iPad, Mac), Firefox | Solo Chromium su questa macchina; non si installano browser | Profili iPhone/iPad di Chromium. In particolare il comportamento di Safari con il service worker nuovo (G3), con la ricarica automatica (M6) e con il biscotto della conferma (C2) è **non provato** |
| PWA installata sulla schermata Home | Serve un telefono | Contesti con service worker attivo (`n09`, `v05`) |
| Accesso con Google vero, `ACCESSO_DAL_DOMINIO` acceso (S4 del giro 1, M4) | Vietato usare account veri; serve Safari | `GET` in produzione: `/__/auth/handler` risponde 200, il passo 5 delle istruzioni ora controlla quello; il proxy non porta fuori Cookie/Authorization e non riporta Set-Cookie/HSTS (provato in Node). Se l'handler di Firebase abbia bisogno di un suo biscotto (che ora il proxy toglie) **non si sa**: da provare su un iPhone vero prima di accendere l'interruttore |
| Firebase vero: revoca e scadenza dei gettoni, utente cancellato (m8, m9), quote (m10) | Solo emulatore | Riproduttori del giro 2 rilanciati sull'emulatore |
| Google Calendar e Microsoft Graph veri | Vietato | I finti di `prove/comune/sentinella-finta.js` |
| Cloudflare vero (Durable Object, cron, limiti) | Niente `wrangler`; vietato | Worker vero in Node con il namespace finto; il cron chiamato a mano a ore diverse (`v06` M) |
| Un vero browser vecchio che non capisce l'SDK di Firebase 12 | Non c'è | Imitato servendo un `firebase-firestore.js` che non si può eseguire (`v03` B); la causa reale più probabile (iPad con iOS vecchio) non è provata |

---

## 8. Come rilanciare

1. Worktree: `git worktree add --detach <cartella>/wt d6d4bbd`, `<cartella>/wt-vecchio` a `1a85823`, `<cartella>/wt-1548` a `1548c72`; in ognuno un collegamento a `node_modules`. L'SDK di Firebase in `<cartella>/../audit-cloud/fbt/node_modules/firebase`.
2. Due emulatori (`firebase emulators:start --only auth,firestore --project demo-lifemax`) con le `firebase.json` di `audit-3/emu` (9480/9499, ws 9450, hub 9492, log 9493) e `audit-3/emu2` (9580/9599, ws 9550, hub 9592, log 9593). Le porte sono scelte per non incrociare `prove/` (basi 9600–9900, siti 87xx–88xx).
3. `script/esegui-tutti.sh` rilancia giro 1 e giro 2 (FSP=9480 AUP=9499 PORTA=9411). Le prove nuove: `AUDIT=<cartella> FSP=9580 AUP=9599 PORTA=9511 node script/v0X-….js`; `v01`, `v06` e `c01-adattato-conferma` non usano l'emulatore. `RADICE=<cartella>/wt-1548` fa girare `v01` e `v07` sul codice di prima, per il confronto.
4. `script/catena-ramo.sh` per la catena del ramo.
