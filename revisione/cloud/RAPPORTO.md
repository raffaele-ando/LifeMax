# Verifica della sincronizzazione cloud (24 novembre 2026)

Il rapporto completo della verifica fatta su più dispositivi. Le prove sono state eseguite con Firebase vero, cioè la stessa libreria del sito, collegato all'emulatore ufficiale di Firebase (Firebase Emulator Suite) con le regole di `firestore.rules`. Il progetto di produzione non è stato toccato e non sono stati usati account Google veri.

I «dispositivi» sono browser separati, ciascuno con i propri dati: iPhone, Android, iPad e PC Windows. Il motore è sempre Chromium, che imita quei dispositivi: Safari (WebKit) e Firefox non erano installati.

**Versioni provate:**
- Commit `d882a59`: s01–s06 e la prima esecuzione di r01–r04.
- Commit `60485f9`: r01–r04 rifatti (stesso esito), poi r05, s07 (calendari), s08, s09, s10, s11.
- Per la prova «versione vecchia dell'app» è stato usato `b3c6d4b`.

**Contenuto di questa cartella:**
- `script/`: i riproduttori e il banco di prova comune (`lib.js`), più `firebase.json` per l'emulatore.
- `risultati/`: l'esito di ogni prova in JSON.
- `schermate/`: le foto che documentano i problemi.

Come rilanciarli è spiegato in fondo.

## 1. In breve

Il cloud **non è sano**. Funziona bene quando c'è un solo dispositivo alla volta, online, e si fanno solo aggiunte. Con due o più dispositivi che si alternano compaiono problemi veri:
- dati che spariscono;
- dati che tornano dopo essere stati tolti;
- dati di un account che finiscono in un altro.

**I più seri** (tutti riprodotti):
1. Dati di una persona che finiscono nell'account di un'altra sullo stesso computer.
2. Il PC sempre aperto smette di ricevere: una cosa scritta sul telefono non gli arriva e, alla sua scrittura successiva, sparisce anche dal cloud.
3. Un dispositivo nuovo (o un altro indirizzo del sito) azzera il profilo su tutti i dispositivi.
4. Togliere una spunta, disattivare un'area o ripristinare gli orari non arriva agli altri dispositivi, e poi l'azione annullata torna indietro.
5. Oltre 1 MB la sincronizzazione si ferma per sempre.

### La causa comune dei problemi 2, 6 e 7

- Ogni dispositivo manda **tutto il documento** e sovrascrive quello nel cloud (`push`, `nuvola.ts:636`), senza leggere prima cosa c'è.
- Un dispositivo riconosce le proprie scritture dall'orario `updatedAt`. Ma la fusione copia l'orario dell'altro dispositivo (`hydrate`, `dati.ts:1391-1392`).
- La fusione rimanda su il risultato solo se gli elementi sono **di più** (`nuvola.ts:595`).
- Gli aggiornamenti che arrivano mentre una scrittura propria è in corso vengono scartati (`nuvola.ts:697`).

## 2. Problemi, dal più grave

### CRITICO

**1. Fuga di dati fra account** (confermato, `r04-fuga-account.js`; schermate `r04a-*`)
- **Situazione A:** Firebase chiude la sessione da solo (account disabilitato, sessione revocata o scaduta). L'app non svuota il dispositivo e non avvisa. Poi un altro account accede su quel PC e i dati del primo finiscono nel suo.
- **Situazione B:** due schede aperte, «Esci» in una. Dopo 6 secondi l'altra è ancora connessa, con i dati, e alla prossima modifica li riscrive sul dispositivo.
- **Causa:**
  - quando non c'è più un utente l'app non pulisce niente (`nuvola.ts:369-377`);
  - al primo accesso unisce qualunque dato locale, senza controllare a chi appartiene (`nuvola.ts:418-432`);
  - «Esci» pulisce solo la scheda in cui lo premi (`nuvola.ts:305-311`).

**2. Il PC sempre aperto smette di ricevere, e una cosa scritta altrove sparisce dal cloud** (confermato, `r05-pc-sordo.js`, `r01`, `s01`, `s03`)
- **Passi:**
  1. Il telefono, senza rete, scrive X e chiude l'app.
  2. Il PC, sempre aperto, scrive Y.
  3. Il telefono riapre l'app, unisce X e Y e manda il risultato con l'**orario della scrittura del PC**.
- **Cosa succede:**
  - Il PC crede che sia una sua scrittura e la ignora.
  - Alla scrittura successiva del PC, X sparisce dal cloud e dagli altri dispositivi.
  - X resta solo sul telefono, e il giro si ripete ogni volta che il telefono si riapre.
- **Causa:** il riconoscimento delle proprie scritture per orario (`nuvola.ts:700` con `dati.ts:1391`), più la causa comune.

**3. Un dispositivo nuovo azzera il profilo su tutti** (confermato, `r03`, `s09`, `s11`)
- Nome, visione, sveglia e tema tornano vuoti o ai valori iniziali su tutti i dispositivi.
- **Quando succede:**
  - telefono nuovo o PWA reinstallata;
  - Safari che cancella i dati;
  - **primo accesso dall'altro indirizzo del sito** (github.io ↔ lifemax.theproject.world).
- **Causa:** il dispositivo nuovo salva appena si apre, quindi sembra «più recente», e il profilo dà ragione al documento più recente (`dati.ts:439-450`).
- Il profilo vecchio resta nelle copie del cloud (`users/{uid}/backups`).

### GRAVE

**4. Annullare non arriva agli altri e poi torna indietro** (confermato, `r02`, `s02`)
- **Cosa si annulla:** spunta di un'azione e i suoi XP, spunta di un'abitudine, area disattivata o eliminata, «ripristina orari».
- **Cosa succede:** gli altri dispositivi restano col valore vecchio. Alla loro prossima scrittura, sul telefono torna tutto com'era prima dell'annullamento.
- **Causa:**
  - `doneAt` viene azzerato quando togli la spunta, quindi la versione «fatta» sembra più recente;
  - spunte e mappe dei giorni si uniscono senza lapidi (`dati.ts:420`, `636-640`);
  - le aree attive si uniscono come insieme (`dati.ts:472`);
  - gli XP prendono il valore più alto (`stato.ts:496`).

**5. Limite di 1 MB del documento** (confermato, `s05-tanti-dati.js`)
- **Misure:** 90 giorni di storia = 339 KB, 180 giorni = 585 KB, 365 giorni = 1087 KB, e lì la sincronizzazione si rompe.
- **Cosa succede:** ogni salvataggio fallisce per sempre, con il messaggio «Controlla la configurazione di Firestore». Con un uso normale ci si arriva in circa 1,5–2 anni.

**6. Modifiche e cancellazioni fatte offline si perdono** (confermato, `s03`, `s07`)
- Vince il dispositivo che torna online per ultimo, non la modifica più recente.
- Cancellazione da una parte e modifica dall'altra: i dispositivi restano diversi fra loro e dal cloud.
- L'evento «online» fa partire subito una scrittura cieca (`nuvola.ts:751`).

**7. App chiusa subito dopo una modifica** (confermato, `s08`)
- La modifica arriva agli altri solo quando quel dispositivo si riapre.
- Non c'è un salvataggio alla chiusura né un segnale «non ancora nel cloud».

**8. Orologio sbagliato di un dispositivo** (confermato, `s03`)
- **Indietro di 2 minuti:** una cosa cancellata risorge.
- **Avanti di 3 ore:** vince modifiche fatte dopo.
- La lapide vale solo se è più recente della data di creazione (`dati.ts:538`).

**9. «Esci» senza rete perde l'ultima modifica** (confermato, `s04`)

### MEDIO
- **10.** Gli XP guadagnati in parallelo non si sommano: si prende il valore più alto (`s03`).
- **11.** La sessione chiusa da Firebase non viene detta all'utente. I messaggi d'errore sono per programmatori (`nuvola.ts:756-762`).
- **12.** Le copie di sicurezza nel cloud crescono senza limite: dopo 10 riaperture sono già circa 5 MB da scaricare per aprire «Backup» (`s10`, `nuvola.ts:318-334`, `525-541`).
- **13.** «Azzera tutto» con account non azzera aree, rinomine e diario (`dati.ts:1205`).

### MINORE
- **14.** Due schede dello stesso browser: ognuna scrive per conto suo.
- **15.** Un iPad riaperto dopo settimane mostra per 1–2 secondi i dati vecchi.

### SOSPETTI (letti nel codice, non riprodotti)
- Le lapidi vengono cancellate dopo 180 giorni: un dispositivo fermo più a lungo potrebbe far risorgere cose cancellate.
- «Azzera tutto» oltre 3000 righe: le righe più vecchie potrebbero risorgere.
- Check-in e diario sono identificati da orario e testo: modificare il testo potrebbe creare un doppione.
- **Accesso con Google su iPhone:** `authDomain` è `lifemax-9dc63.firebaseapp.com`, diverso dal dominio del sito. Con Safari 16.1+ e lo spazio di terze parti bloccato, l'accesso con redirect (la strada di riserva quando il popup è bloccato, `nuvola.ts:291`) può non funzionare.
  - **Correzione:** servire `/__/auth/*` da lifemax.theproject.world e impostare lì `authDomain`.

## 3. Cosa funziona
- Scritture simultanee con tutti online.
- Quasi tutte le funzioni dell'app, fatte una dopo l'altra su dispositivi diversi.
- Utente nuovo con i dati da ospite che salgono nell'account.
- Uscire e rientrare.
- iPad fermo 45 o 200 giorni, a parte i problemi 3 e 4.
- Calendari fra più dispositivi: niente doppioni, cancellazioni propagate.
- Una scheda con la versione vecchia dell'app insieme a un telefono aggiornato.
- Importazione di un file durante la sincronizzazione.
- Memoria piena o bloccata.
- SDK di Firebase bloccato: l'app resta in locale.
- Popup bloccato: l'accesso passa al redirect.
- L'ascolto del cloud che si riattacca da solo.
- Fino a circa 600 KB la fusione è veloce (10–77 ms).

## 4. Cosa non è stato provato
- Safari vero su iPhone e iPad, e Firefox.
- PWA installata.
- Popup e redirect di Google veri.
- Cancellazione dopo 7 giorni di Safari: simulata con un browser vuoto.
- Scadenza reale del token Google.
- Reti lente o instabili.
- Aggiornamento del service worker.
- Promemoria push.
- Outlook.

## 5. Correzioni suggerite, in ordine
1. **Account:**
   - salvare nei dati a quale account appartengono (uid) e non unire mai con un account diverso;
   - avvisare e svuotare quando la sessione finisce;
   - propagare «Esci» a tutte le schede (BroadcastChannel / evento `storage`).
2. **Scrittura nel cloud:**
   - leggere, unire e scrivere in una transazione (`runTransaction`);
   - riconoscere le proprie scritture con un id univoco, non con l'orario;
   - rimandare su ogni volta che la fusione cambia qualcosa;
   - non scartare gli aggiornamenti che arrivano durante una scrittura.
3. **Orari di modifica per riga e per campo**, anche quando si annulla:
   - lapidi anche nelle mappe;
   - aree attive con orario;
   - XP calcolati dagli eventi.
4. **Profilo:** un dispositivo mai unito all'account non vince sul profilo; meglio un orario per ogni campo.
5. **Dividere il documento unico**, per anno o con sottocollezioni, e avvisare in chiaro vicino al limite.
6. **Non perdere l'ultima modifica:**
   - salvare quando la pagina si nasconde;
   - segnare «non ancora nel cloud»;
   - chiedere conferma prima di «Esci» senza rete.
7. **Orologi:** usare l'orario del server o un orologio logico.
8. **Messaggi:** scritti per chi usa l'app.
9. **Copie nel cloud:** tenerne solo le ultime N ed elencarle senza scaricarle intere.
10. **«Azzera tutto»:** includere aree e diario.
11. **Un indirizzo solo:** github.io manda a lifemax.theproject.world, dopo le correzioni 1–4.

## Come rilanciare le prove
Gli script si aspettano, nella variabile `S` di `lib.js`, una cartella che contenga:
- `wt/`: un worktree del sito già costruito (`git worktree add --detach <S>/wt <commit>` e poi `npm run build:nuovo`);
- `fbt/`: `npm i firebase-tools firebase` in quella cartella.

Poi:
1. Avvia l'emulatore: `firebase emulators:start --only auth,firestore --project demo-lifemax`, con `firebase.json` e `firestore.rules` nella cartella da cui lo lanci.
2. Lancia uno script: `node script/r05-pc-sordo.js`.

Ogni correzione va verificata rilanciando il riproduttore del problema che chiude.

## Correzioni (25 novembre 2026)

Tutti i problemi qui sopra sono stati corretti. Ogni correzione ha una prova che resta nel ramo e che usa Firebase vero contro l'emulatore ufficiale, come questa verifica:
- `prove/nuvola-fusione.js`: più dispositivi sullo stesso account;
- `prove/nuvola-account.js`: i dati di un account restano di quell'account;
- `prove/nuvola-spazio.js`: tanti dati, versioni vecchie, copie, chiusure, indirizzi.

Sono spiegate in `prove/LEGGIMI.md`. Serve l'emulatore, che non sta nel ramo: `npm i --prefix prove/.emulatore firebase-tools@15 firebase@12.16.0` (e Java).

Sul codice di prima (commit `1a85823`) le tre prove falliscono; su quello nuovo passano. I conti precisi sono in fondo.

### Come funziona adesso, in breve
- **I dati nel cloud sono divisi in pezzi** (`src/nuvola/pezzi.ts`): per campo e per trimestre (`azioni.2026q4`, `giorni.2026q4`, `base`…). Il documento principale `users/{uid}` tiene solo l'elenco dei pezzi. Un salvataggio riscrive solo i pezzi cambiati.
- **Ogni salvataggio è una transazione**: legge il cloud, unisce, scrive solo se il risultato è diverso. Se intanto un altro dispositivo ha scritto, si rifà il giro. Non esistono più scritture «cieche».
- **Ogni modifica lascia la sua ora**: le righe hanno `aggiornata`, e le chiavi dei dizionari (voti, spunte delle abitudini, profilo, aree attive) hanno un «orologio» in `orologi`, anche quando la modifica è togliere. La fusione fa vincere chi ha toccato per ultimo.
- **L'orologio dei dati** (`adesso` in `src/dati/dati.ts`) corregge lo scarto col server e non torna mai indietro rispetto alle ore viste arrivare dagli altri.
- **I punti** si contano per dispositivo (`xpConti`): si sommano invece di prendere il più grande.
- **I dati sul dispositivo hanno un proprietario** (l'account) e non si uniscono mai con un altro account.

### Problema → correzione → prova
| # | Problema | Correzione | Prova |
|---|---|---|---|
| 1 | Fuga di dati fra account | Proprietario dei dati sul dispositivo. Sessione chiusa da Firebase: il dispositivo si svuota, l'app lo dice («La sessione è finita»), e quello che non era ancora nel cloud resta da parte solo per quell'account. «Esci» fa uscire tutte le schede (`lifemax.generazione`, evento `storage`). Un giro di sincronizzazione finito dopo un cambio d'account non rimette niente sul dispositivo. | `nuvola-account.js` |
| 2 | PC sordo, scritture cieche | Transazione leggi-unisci-scrivi; le proprie scritture si riconoscono da un nome a caso (`scrittore`), non dall'ora; ogni cambiamento del cloud fa un giro; si rimanda su ogni volta che il risultato è diverso dal cloud; niente si scarta durante una scrittura in corso. | `nuvola-fusione.js` |
| 3 | Dispositivo nuovo azzera il profilo | Orologi per ogni campo del profilo; un dispositivo mai unito all'account non vince mai sul profilo né sui pareggi. | `nuvola-fusione.js` |
| 4 | Annullare non arriva e torna | `aggiornata` scritta a ogni modifica di una riga (anche togliere la spunta); orologi per le chiavi dei dizionari (anche quelle tolte); aree attive con orologio; punti dai conti per dispositivo. Vale anche per «annulla» dal diario. | `nuvola-fusione.js` |
| 5 | Limite di 1 MB | Dati divisi in pezzi per campo e trimestre, e ogni pezzo in fette sotto i 300 mila caratteri. Il passaggio dal documento vecchio è automatico, ripetibile senza danni, con una copia di sicurezza presa prima. Una scheda con la versione vecchia che riscrive il documento non distrugge niente: la forma nuova si ricostruisce da sola e quello che ha scritto entra. | `nuvola-spazio.js` (420 giorni, 1,3 MB: il pezzo più grosso 201 KB, il documento principale 3 KB) |
| 6 | Modifiche offline perse | Vince la modifica fatta per ultima (la sua ora), non chi torna online per ultimo. | `nuvola-fusione.js` |
| 7 | Ultima modifica persa chiudendo | Un gesto isolato parte subito; quando l'app va in secondo piano o la pagina si chiude si manda quello che manca; a pagina chiusa parte una richiesta piccola (`keepalive`) nella «cassetta delle lettere» del documento principale. Si vede «Non ancora nel cloud», anche riaprendo. | `nuvola-spazio.js` |
| 8 | Orologio sbagliato | Scarto misurato col server all'accesso (`users/{uid}/dispositivi/`) e orologio logico ibrido. | `nuvola-fusione.js` |
| 9 | «Esci» senza rete | Si esce dallo schermo subito, la modifica resta da parte e parte appena torna la rete (anche ad app chiusa e riaperta); solo allora la sessione si chiude. L'app lo dice. | `nuvola-account.js` |
| 10 | Punti in parallelo | Conti per dispositivo, che si sommano. | `nuvola-fusione.js` |
| 11 | Sessione chiusa in silenzio, messaggi da programmatore | Avviso «La sessione è finita» con «Accedi di nuovo»; tutti i messaggi riscritti per chi usa l'app (i dettagli tecnici restano nel Registro tecnico). | `nuvola-account.js` |
| 12 | Copie nel cloud senza limite | Al massimo una al giorno (più quelle prima di un ripristino), ne restano trenta, e si elencano senza scaricarle (`users/{uid}/copie`). | `nuvola-spazio.js` |
| 13 | «Azzera tutto» lascia aree e diario | Azzerare passa dalla stessa strada di ogni modifica: aree create, nomi cambiati, aree spente e diario se ne vanno anche dagli altri dispositivi. | `nuvola-fusione.js` |
| 14 | Due schede | Ogni salvataggio unisce con quello che l'altra scheda ha scritto nel frattempo. | `nuvola-account.js` |
| 15 | Dati vecchi per un attimo | Se l'ultima sincronizzazione è lontana, finché non arriva l'aggiornamento si vede «Aggiornamento dal cloud…» e i dati sotto sono sbiaditi. | `nuvola-spazio.js` |
| S | Lapidi scadute (dispositivo fermo a lungo) | Lapidi e orologi durano due anni; oltre, la regola dell'assenza lunga toglie quello che c'era già all'ultima sincronizzazione e nel cloud non c'è più. | `nuvola-fusione.js` |
| S | Oltre 3000 lapidi | Il tetto di 3000 non c'è più. | `nuvola-fusione.js` |
| S | Check-in e diario modificati | Provato innocuo: un check-in modificato resta uno, il diario non raddoppia. | `nuvola-fusione.js` |
| S | Accesso su iPhone (`authDomain`) | Il Worker serve `/__/auth/*` e `/__/firebase/*` da lifemax.theproject.world. L'app NON lo usa ancora: interruttore `ACCESSO_DAL_DOMINIO` in `src/nuvola/nuvola.ts`, da accendere dopo i passi qui sotto. | `nuvola-spazio.js` |
| - | Due indirizzi | Su github.io compare «LifeMax ha cambiato indirizzo». Con l'account: si va solo dopo che il cloud ha confermato tutto. Senza account: «Porta i miei dati» li passa con un tocco al nuovo indirizzo (o con un file). Niente si cancella. | `nuvola-spazio.js` |
| - | Profilo già azzerato | In «Backup e ripristino» → «Nel cloud»: «Riprendi il profilo» da una copia, anche dalle copie di prima. | `nuvola-spazio.js` |

### Accesso su iPhone: i passi a mano (dopo, si cambia una riga)
1. Google Cloud Console (console.cloud.google.com), progetto **lifemax-9dc63** → menu → **API e servizi** → **Credenziali**.
2. In «ID client OAuth 2.0» apri **Web client (auto created by Google Service)**.
3. In **URI di reindirizzamento autorizzati** → **Aggiungi URI** → `https://lifemax.theproject.world/__/auth/handler`. In **Origini JavaScript autorizzate** controlla che ci sia `https://lifemax.theproject.world` (se no aggiungilo). **Salva**.
4. Firebase console (console.firebase.google.com) → progetto lifemax-9dc63 → **Authentication** → **Settings** (Impostazioni) → **Authorized domains** (Domini autorizzati): deve esserci `lifemax.theproject.world` (se no **Add domain**).
5. Controllo: apri `https://lifemax.theproject.world/__/firebase/init.json`. Deve comparire un testo con `"projectId":"lifemax-9dc63"`, non l'app.
6. Solo dopo: in `src/nuvola/nuvola.ts` la riga `const ACCESSO_DAL_DOMINIO = false;` diventa `true`, si ricostruisce (`npm run build:nuovo`) e si pubblica.

### Le regole di Firestore
Non cambiano: la regola esistente copre già le nuove raccolte (`pezzi`, `copie`, `dispositivi`). Nel file è cambiato solo il commento; ripubblicarle non serve.

### Il profilo già azzerato (il caso del fondatore)
1. Apri LifeMax da lifemax.theproject.world e accedi.
2. Impostazioni → **Backup e ripristino** → sezione **Nel cloud**.
3. Tocca **Cerca anche le copie di prima (fino a novembre 2026)**: sono le copie che la versione di prima metteva da parte; possono volerci alcuni secondi.
4. Ogni copia mostra la data, quanti elementi ha e il nome del profilo. Scegli una copia **di prima** dell'azzeramento, col tuo nome.
5. Tocca **Riprendi il profilo** e conferma. Tornano nome, visione, sveglia, tema e impostazioni, su tutti i dispositivi; le cose fatte, i voti e il diario restano come sono. Prima viene preso un backup.
