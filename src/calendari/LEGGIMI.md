# I calendari collegati — Google e Outlook

**Se non vuoi leggere niente:** [le istruzioni cliccabili sono qui sotto, dal
punto 1](#cosa-devi-fare). Non serve il terminale, non serve installare nulla.
Sono due registrazioni (una da Google, una da Microsoft) e due ID da
incollare nell'app. **Poi** c'è [la sentinella](#la-sentinella--il-calendario-anche-ad-app-chiusa):
tre segreti da mettere in Cloudflare, e il calendario resta allineato anche
ad app chiusa, senza più «Ricollega».

Tre risposte veloci, prima:

- **Funziona nei due sensi.** Gli eventi dei calendari che scegli diventano
  attività di LifeMax. Se in LifeMax sposti un'attività, le cambi durata o
  nome, o la elimini, cambia anche nel calendario. «Fatto» resta solo in
  LifeMax: un calendario non sa cosa vuol dire.
- **Due strade.** Senza server tutto parte dal browser di chi usa l'app, e
  il permesso resta lì (dura un'ora con Google, un giorno con Microsoft).
  Con **la sentinella** — un piccolo server dentro il Worker `lifemax` di
  Cloudflare, che si pubblica da solo col sito — il permesso lo tiene il
  server, cifrato, e non scade; il calendario si guarda anche ad app chiusa.
  L'app usa la sentinella da sola quando c'è (segreti messi) e hai fatto
  l'accesso a LifeMax con Google; se no, la strada di prima.
- **Quello che va nel cloud.** Quali calendari, con che area, dove
  scrivere: questo si sincronizza con i tuoi dati. Il permesso no: nel
  browser (senza sentinella) o cifrato nella sentinella, mai in Firestore.

---

## Cosa devi fare

L'indirizzo che usi è **`https://lifemax.theproject.world/`**. Lo stesso sito
risponde anche su `https://raffaele-ando.github.io/LifeMax/`: per il browser
sono due siti diversi, con dati e permessi separati, quindi qui sotto li
registri tutti e due (se usi solo il primo, il secondo puoi saltarlo).

### 1 · Google: attiva l'API del calendario

1. Vai su [console.cloud.google.com](https://console.cloud.google.com) con
   l'account Google che ha creato il progetto Firebase.
2. In alto, nel selettore dei progetti, scegli **`lifemax-9dc63`**. È lo
   stesso progetto di Firebase: Firebase è un pezzo di Google Cloud.
3. Menù a sinistra → **API e servizi** → **Libreria**.
4. Cerca **Google Calendar API** → aprila → **Abilita**.

### 2 · Google: la schermata di consenso

È la finestrella che chi usa l'app vede la prima volta: «LifeMax vuole
accedere al tuo calendario».

1. **API e servizi** → **Schermata consenso OAuth** (nelle versioni nuove
   della console si chiama **Google Auth Platform** → **Branding**).
2. Se te lo chiede, tipo di utenti: **Esterno**.
3. Nome dell'app: `LifeMax`. Email di assistenza: la tua. In fondo, email
   dello sviluppatore: la tua. **Salva**.
4. Sezione **Accesso ai dati** (o **Ambiti** / *Scopes*) → **Aggiungi o
   rimuovi ambiti**. Incolla questi due, uno per riga, nel campo in fondo
   («Aggiungi manualmente gli ambiti») e conferma:

   ```
   https://www.googleapis.com/auth/calendar.calendarlist.readonly
   https://www.googleapis.com/auth/calendar.events
   ```

   Il primo serve a farti vedere l'**elenco** dei tuoi calendari per
   scegliere quali importare; il secondo a leggere e scrivere gli
   **eventi**. Sono i più stretti che bastano: LifeMax non chiede di creare
   o cancellare calendari interi né di cambiarne la condivisione.
5. **Salva**.

### 3 · Google: chi può usarla (gli utenti di prova)

Finché l'app è «in prova», Google la lascia usare **solo agli indirizzi che
scrivi tu, fino a 100**, senza nessun controllo da parte sua.

1. Sezione **Pubblico** (o **Utenti di prova**) → **Aggiungi utenti**.
2. Scrivi la tua email Google (e quelle di chi vuoi far provare) → **Salva**.

> **Quando serve la verifica di Google.** I due ambiti del calendario sono
> «sensibili». Per farli usare a **chiunque** (non solo ai 100 di prova)
> bisogna premere **Pubblica app** e chiedere la **verifica**: Google vuole
> un dominio verificato, una pagina con l'informativa sulla privacy, un
> video che mostra come l'app usa il calendario, e ci mette da qualche
> giorno a qualche settimana. Per te e pochi altri non serve: restate utenti
> di prova.

### 4 · Google: il Client ID

1. **API e servizi** → **Credenziali** (o **Google Auth Platform** →
   **Client**) → **Crea credenziali** → **ID client OAuth**.
2. Tipo di applicazione: **Applicazione web**. Nome: `LifeMax`.
3. **Origini JavaScript autorizzate** → **Aggiungi URI**:

   ```
   https://lifemax.theproject.world
   ```

   e, con un secondo «Aggiungi URI», `https://raffaele-ando.github.io`.
   Solo l'origine: senza `/LifeMax/`, senza `/` finale. Per provare in
   locale aggiungi anche `http://localhost:5173`.
4. **URI di reindirizzamento autorizzati**: lascialo vuoto. Il permesso di
   Google arriva con una finestrella, non con un rimando.
5. **Crea**. Compare un riquadro con l'**ID client**: una stringa che finisce
   con `.apps.googleusercontent.com`. **Copiala.** Il «client secret» che
   compare accanto non serve e non va incollato da nessuna parte.

> L'ID client **non è un segreto**: finisce comunque nel browser di chi apre
> l'app. Quello che lo protegge è l'elenco delle origini del punto 3.

### 5 · Microsoft: registra l'app

1. Vai su [entra.microsoft.com](https://entra.microsoft.com) (oppure
   [portal.azure.com](https://portal.azure.com) → **Microsoft Entra ID**).
   Va bene un account Microsoft personale: se non hai una «directory», il
   portale te ne crea una gratuita.
2. **Applicazioni** → **Registrazioni app** → **Nuova registrazione**.
3. Nome: `LifeMax`.
4. **Tipi di account supportati**: scegli **Account in qualsiasi directory
   organizzativa e account Microsoft personali** (la voce che nomina sia le
   organizzazioni sia Skype/Xbox/Outlook.com). Così funzionano sia gli
   account di lavoro o di scuola sia quelli personali.
5. **URI di reindirizzamento**: nel menù a tendina scegli **Applicazione a
   pagina singola (SPA)** — *non* «Web» — e scrivi:

   ```
   https://lifemax.theproject.world/
   ```

   Con la `/` finale. Dopo la registrazione, in **Autenticazione**, aggiungi
   anche `https://raffaele-ando.github.io/LifeMax/` (sempre SPA). Per provare in locale, dopo, aggiungi anche
   `http://localhost:5173/` (sempre come SPA).
6. **Registra**.
7. Nella pagina che si apre, in alto: **ID applicazione (client)**. È una
   stringa come `1a2b3c4d-…`. **Copiala.**

> **Perché proprio «a pagina singola».** LifeMax non ha un server: lo
> scambio fra il codice che Microsoft rimanda e il permesso vero lo fa il
> browser. Microsoft lo accetta solo dagli indirizzi registrati come SPA; con
> «Web» lo rifiuta, e l'app dice che Microsoft non risponde.

### 6 · Microsoft: i permessi

1. Nella registrazione di LifeMax: **Autorizzazioni API** → **Aggiungi
   un'autorizzazione** → **Microsoft Graph** → **Autorizzazioni delegate**.
2. Spunta **Calendars.ReadWrite**. **User.Read** di solito c'è già; se non
   c'è, spunta anche quello.
3. **Aggiungi autorizzazioni**.

L'app chiede anche `offline_access`, `openid` e `profile`: sono quelli che
servono a rinnovare il permesso senza farti rientrare ogni ora, e Microsoft
non li vuole elencati qui.

> **Account di lavoro o di scuola.** Molte aziende non lasciano dare a un'app
> il permesso sul calendario senza l'ok dell'amministratore: in quel caso,
> al collegamento, Microsoft mostra «Richiede l'approvazione
> dell'amministratore». Non è un errore dell'app. Se l'amministratore sei tu,
> in **Autorizzazioni API** c'è **Concedi consenso amministratore per …**;
> se no, va chiesto a chi gestisce gli account. Con un account personale
> (outlook.com, hotmail.com, live.com) non serve.

### 7 · Incolla i due ID nell'app

Non serve toccare il codice.

> **Profilo → Calendari collegati**

Sotto **Google Calendar** c'è il campo **Client ID**: incolla quello del
punto 4 e premi Invio. Sotto **Outlook e Microsoft 365** lo stesso, con
quello del punto 5. Lo stato passa da «Da configurare» a «Da collegare».

Gli ID stanno nei tuoi dati: se hai fatto l'accesso con Google li ritrovi su
ogni dispositivo, e non vanno reincollati.

*(In alternativa, per chi costruisce il sito: si possono scrivere in
`src/calendari/config.ts`, in `GOOGLE_CLIENT_ID` e `MICROSOFT_CLIENT_ID`. Lì
vincono su quelli incollati nell'app, ma servono `npm run build:nuovo` e un
commit del sito costruito: la strada dall'app non ha bisogno di niente.)*

### 8 · Collega e scegli

1. **Collega Google** (o **Collega Outlook**). Google apre una finestrella;
   Microsoft porta alla sua pagina e poi torna all'app, che riapre il
   pannello da sé.
2. Compare l'elenco dei tuoi calendari, **tutti spenti**. Accendi quelli che
   vuoi vedere fra le attività e scegli per ognuno l'**area** di LifeMax.
3. Se vuoi, **Scrivi le nuove attività con orario in…**: le attività che
   crei in LifeMax con un orario, da quel momento, diventano eventi lì. Di
   partenza è **Nessuno**.
4. **Sincronizza ora**. Poi va da sola.

---

## La sentinella — il calendario anche ad app chiusa

È il server che risolve i quattro limiti di prima (il permesso di Google di
un'ora, i sessanta giorni, la «porta a domani» che saltava le riunioni,
l'app che deve essere aperta). Il codice è già pubblicato con il sito: sta
in `sentinella/` e gira nel Worker `lifemax`, sulle sole strade `/api/…`.
**Finché non metti i tre segreti qui sotto, non fa niente**: risponde «non
configurato» e l'app continua esattamente come prima. Non va creato nessun
database: lo spazio per i dati (un «Durable Object» per ogni utente) nasce
da solo.

### S1 · Google: il segreto nuovo e l'indirizzo di ritorno

Il segreto incollato in chat va considerato **bruciato**: se ne fa uno
nuovo, e quello vecchio si cancella.

1. [console.cloud.google.com](https://console.cloud.google.com) → progetto
   **`lifemax-9dc63`** → **API e servizi** → **Credenziali** (o **Google
   Auth Platform** → **Client**).
2. Apri il client **LifeMax** (quello che finisce con
   `…r62fu4bc9ppa5fdtljdmffj6qib16epa.apps.googleusercontent.com`).
3. **URI di reindirizzamento autorizzati** → **Aggiungi URI** → incolla,
   identico:

   ```
   https://lifemax.theproject.world/api/calendari/google/ritorno
   ```

   (Le «origini JavaScript» restano come sono: servono alla strada senza
   server.) **Salva**.
4. Nella stessa pagina, riquadro **Client secret** → **Aggiungi secret**
   (*Add secret*). Compare il segreto nuovo: **copialo adesso** (dopo non
   si rivede per intero).
5. Il segreto vecchio, nello stesso riquadro: **Disattiva** e poi
   **Elimina**.
6. **Pubblico** (*Audience*): se l'app è ancora **In prova** (*Testing*),
   Google fa scadere il permesso dopo **7 giorni**, anche con il server. Per
   toglierlo premi **Pubblica app** (*Publish app*) → **Conferma**: finché la
   verifica di Google non è finita, chi collega vede l'avviso «app non
   verificata» (si va avanti con *Avanzate* → *Vai a LifeMax*), e resta il
   limite di 100 persone. Se preferisci restare «In prova», ogni 7 giorni
   servirà un tocco su «Ricollega».

### S2 · Microsoft: la piattaforma «Web» e il segreto

La registrazione è la stessa di prima: si aggiunge un secondo modo di
collegarsi, accanto a quello «a pagina singola», che resta.

1. [entra.microsoft.com](https://entra.microsoft.com) → **Applicazioni** →
   **Registrazioni app** → **LifeMax**.
2. **Autenticazione** → **Aggiungi una piattaforma** → **Web** (questa volta
   sì, «Web»). URI di reindirizzamento, identico:

   ```
   https://lifemax.theproject.world/api/calendari/microsoft/ritorno
   ```

   Lascia spente le due caselle dei token («Token di accesso», «Token ID»).
   **Configura**.
3. **Certificati e segreti** → **Segreti client** → **Nuovo segreto client**.
   Descrizione: `sentinella`. Scadenza: **24 mesi**. **Aggiungi**.
4. Copia la colonna **Valore** (*Value*) — **non** «ID segreto». Si vede
   solo adesso. Segnati la data di scadenza: fra due anni si rifà questo
   punto e si aggiorna il segreto in Cloudflare (punto S4).

### S3 · La chiave che cifra i permessi

Una stringa a caso, lunga, che non devi ricordare. Il modo più semplice:
apri [lifemax.theproject.world](https://lifemax.theproject.world) nel
browser del computer, premi **F12** (o tasto destro → *Ispeziona*) →
scheda **Console**, incolla questa riga e premi Invio:

```
btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
```

Esce una stringa di 44 caratteri che finisce con `=`: **copiala** (senza
le virgolette). Va bene anche una password lunga almeno 32 caratteri presa
da un gestore di password.

> **Non cambiarla più.** I permessi salvati sono cifrati con questa chiave:
> se la cambi, la sentinella non li sa più leggere e a ognuno serve un
> tocco su «Ricollega».

### S4 · Cloudflare: i tre segreti

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers e Pages**
   (o **Compute (Workers)**) → **`lifemax`**.
2. **Impostazioni** (*Settings*) → **Variabili e segreti** (*Variables and
   Secrets*) → **Aggiungi** (*Add*).
3. Tipo: **Segreto** (*Secret*). Nome e valore, uno alla volta:

   | nome | valore |
   |---|---|
   | `GOOGLE_CLIENT_SECRET` | il segreto del punto S1.4 |
   | `MICROSOFT_CLIENT_SECRET` | il valore del punto S2.4 |
   | `CHIAVE_CALENDARI` | la stringa del punto S3 |

4. **Distribuisci** (*Deploy*). I segreti restano anche ai prossimi
   aggiornamenti del sito: non vanno rimessi.
5. Controllo: apri
   [lifemax.theproject.world/api/calendari/stato](https://lifemax.theproject.world/api/calendari/stato).
   Deve dire `{"servizio":{"google":true,"microsoft":true}}`. Un `false`
   vuol dire che manca il segreto di quel servizio (o la chiave).

Va bene anche metterne solo una parte: con il solo segreto di Google (e la
chiave), Google passa dalla sentinella e Outlook resta nel browser.

### S5 · Nell'app, una volta

Profilo → **Calendari collegati**: accanto a ogni calendario già collegato
c'è **Ricollega**. Un tocco, il «sì» a Google o a Microsoft, e basta: da lì
vale su tutti i tuoi dispositivi in cui hai fatto l'accesso a LifeMax, e il
pannello dice «Resta allineato anche ad app chiusa».

---

## Come funziona, in breve

**Quando.** All'apertura dell'app, quando ci torni (non più di una volta
ogni cinque minuti), pochi secondi dopo che cambi un'attività collegata, e
con «Sincronizza ora». Mai due giri insieme. Senza rete aspetta che torni.
**Con la sentinella** in più: il server guarda il calendario ogni dieci
minuti anche ad app chiusa (con il syncToken di Google legge solo quello
che è cambiato); una modifica fatta qui parte dopo un quarto di secondo in
una richiesta che arriva anche se chiudi subito l'app, e se il calendario
non risponde la riprova il server da solo; aprendo l'app arriva in un colpo
solo tutto quello che è cambiato.

**Cosa entra.** Gli eventi da oggi a sessanta giorni avanti dei calendari
accesi diventano attività. **Con la sentinella** la Giornata (giorno,
settimana, mese) mostra anche quelli più lontani, fino a circa 13 mesi: non
sono attività finché non ne tocchi uno (allora lo diventa) o finché non
entra nei sessanta giorni — così un anno di riunioni non gonfia i tuoi dati
nel cloud. Il passato no (comparirebbe come cose non fatte). Non entrano gli
eventi cancellati, quelli che hai **rifiutato**, e il «luogo di lavoro» di
Google. Un evento privato di un calendario condiviso, che arriva senza
titolo, entra come «Impegno» — e quel nome non viene mai scritto là.

**I fusi orari.** Un evento con orario è un istante, e compare all'ora di
dove sei: la riunione delle 9 a New York, vista da Roma, è alle 15. Un
evento di **tutto il giorno** diventa un'attività **senza orario**, in quel
giorno, ovunque tu sia. Un evento di **più giorni** compare il giorno in cui
comincia; con orario, qui arriva al massimo fino a mezzanotte. Spostarlo in
LifeMax sposta tutto l'evento senza accorciarlo; cambiarne la durata cambia
davvero la fine.

**Chi ha ragione.** Ogni attività collegata ricorda com'era all'ultimo
accordo. Se è cambiata solo nel calendario, cambia qui; se è cambiata solo
qui, si manda là. Se è cambiata **da tutte e due le parti**, vince il
calendario, e il **Diario** lo racconta.

**Le cancellazioni.** Cancellata nel calendario → sparisce anche qui, ma se
l'avevi già fatta resta, staccata. Eliminata qui (o rimessa fra le cose da
fare) → si cancella anche là. «Azzera tutto», togliere i dati di esempio o
riprendere un backup **non** cancellano niente nel calendario.

**Due dispositivi.** Lo stesso evento importato da due telefoni diventa una
riga sola: l'attività prende un nome che nasce dall'evento.

**La sera, «rimanda a domani».** Un evento che hai organizzato tu, senza
altri invitati, in un calendario dove puoi scrivere, si sposta a domani
con le altre cose non fatte: stessa ora, stessa durata, e anche nel
calendario. Una riunione con altre persone (o organizzata da altri, o in un
calendario in sola lettura) non si sposta da sola: resta sotto il tasto,
con il perché in una riga e tre risposte — **Fatta**, **Saltata**,
**Sposta…** (scegli il giorno; se là non si può spostare, si stacca e si
sposta solo qui). Per saperlo LifeMax legge solo se sei l'organizzatore e
se ci sono altri invitati, non chi sono.

**Scollegare.** L'app chiede cosa fare delle attività arrivate da lì:
tenerle (staccate, diventano attività normali) o toglierle (tranne quelle
già fatte). Il calendario non si tocca in nessuno dei due casi. Con la
sentinella, in più, il permesso si ritira presso Google e il server
cancella tutto quello che aveva di quel calendario.

---

## Se qualcosa non va

| vedi | vuol dire | si fa così |
|---|---|---|
| «Da configurare» | manca l'ID dell'app | punti 4 o 5, poi punto 7 |
| «Collegato su un altro dispositivo» | la scelta è arrivata dal cloud, il permesso no | tocca **Collega anche qui** |
| «Ricollega» | il permesso di questo browser è scaduto | un tocco su **Ricollega** |
| la finestra di Google dice «Accesso bloccato: app non verificata» o «non hai accesso» | la tua email non è fra gli utenti di prova | punto 3 |
| Google dice `origin_mismatch` | l'indirizzo del sito non è fra le origini | punto 4.3, solo origine, senza `/` finale |
| Microsoft dice che l'indirizzo di reindirizzamento non corrisponde (`AADSTS50011`) | il redirect non è scritto identico | punto 5.5, con la `/` finale |
| «Microsoft non risponde» subito dopo il ritorno | il redirect è registrato come «Web» | punto 5.5: va come **SPA** |
| «Richiede l'approvazione dell'amministratore» | account aziendale | punto 6, l'ultimo riquadro |
| `/api/calendari/stato` dice `false` | manca un segreto in Cloudflare | punto S4 |
| Google dice `redirect_uri_mismatch` dopo «Ricollega» | manca l'indirizzo di ritorno della sentinella | punto S1.3 |
| Microsoft dice `AADSTS50011` dopo «Ricollega» | manca la piattaforma «Web» | punto S2.2 |
| «Il collegamento è tornato su un browser diverso» | il «sì» è stato dato in un'altra app o finestra | ricomincia dal pannello, nello stesso browser |
| «Ricollega» torna ogni 7 giorni con Google | l'app Google è ancora «In prova» | punto S1.6 |

---

## Quello che non fa (ancora)

Con la sentinella attiva e l'accesso a LifeMax fatto, i limiti di prima
(app aperta, un'ora, sessanta giorni, la sera) non ci sono più. Restano:

- **Senza accesso a LifeMax** (o prima dei segreti) vale la strada del
  browser, con i suoi limiti: gira ad app aperta, il permesso di Google dura
  un'ora (poi «Ricollega»), quello di Microsoft 24 ore, la finestra è di
  sessanta giorni.
- **Il permesso si può ancora perdere**: se lo ritiri dalla pagina di
  Google, se l'app Google resta «In prova» (7 giorni, punto S1.6), se non
  usi Outlook per 90 giorni, o se cambi la chiave del punto S3. Allora,
  una volta, «Ricollega».
- **Oltre i 13 mesi** la Giornata non mostra gli eventi del calendario.
- **I promemoria push** prima di una riunione non partono ancora dalla
  sentinella: il posto dove agganciarli c'è (`dopoNovita` in
  `sentinella/sentinella.mjs`), va deciso quando e quali.
- **Outlook si rilegge intero** a ogni giro (Microsoft non dà un «solo i
  cambiamenti» affidabile per un calendario scelto): con calendari enormi
  costa qualche richiesta in più, ma non cambia niente per chi usa l'app.
- **Più di 100 persone su Google** richiedono la verifica (punto 3).
- **Sull'iPhone con l'app sulla schermata Home** il ritorno da Microsoft può
  finire in Safari invece che nell'app: se succede, collega Outlook da
  Safari, oppure da un altro dispositivo e poi tocca «Collega anche qui».
- La finestra guarda **sessanta giorni avanti**: un evento più lontano
  arriva quando ci entra.
- Una cancellazione fatta **qui** su un evento di un calendario in **sola
  lettura** (condiviso con te senza permesso di modifica) resta qui: là non
  si può scrivere.

---

## Le parti, per chi guarda il codice

| file | cosa fa |
|---|---|
| `src/calendari/config.ts` | i due Client ID (vuoti: si incollano dall'app) |
| `src/calendari/fornitore.ts` | il contratto comune ai due calendari, e i conti col tempo |
| `src/calendari/google.ts` | Google Identity Services (token client) + Calendar API v3 |
| `src/calendari/microsoft.ts` | Authorization Code + PKCE scritto a mano + Microsoft Graph; nel commento in cima il perché niente MSAL |
| `src/calendari/sincronia.ts` | l'algoritmo: chi ha ragione, le cancellazioni, quando girare; i «fantasmi» oltre i sessanta giorni |
| `src/calendari/server.ts` | il fornitore che parla con la sentinella: lo specchio, la coda, il collegamento |
| `sentinella/worker.mjs` | il Worker: il sito come prima, più `/api/calendari/…` |
| `sentinella/sentinella.mjs` | il Durable Object di ogni utente: permessi cifrati, specchio, coda, sveglia ogni 10 minuti |
| `sentinella/fornitori.mjs`, `identita.mjs`, `cifra.mjs`, `config.mjs` | Google e Microsoft dal server, il gettone di Firebase, la cifratura, i segreti |
| `src/fogli/Calendari.tsx` | il pannello |
| `prove/calendari.js` | la prova della strada nel browser, con un Google e un Microsoft finti |
| `prove/sentinella.js` | la sentinella da sola: sicurezza, cifratura, rinnovo, sveglia, coda |
| `prove/calendari-server.js` | l'app vera davanti alla sentinella: collegare, fantasmi, app chiusa, la sera |
