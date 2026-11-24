# I calendari collegati — Google e Outlook

**Se non vuoi leggere niente:** [le istruzioni cliccabili sono qui sotto, dal
punto 1](#cosa-devi-fare). Non serve il terminale, non serve installare nulla.
Sono due registrazioni (una da Google, una da Microsoft) e due ID da
incollare nell'app.

Tre risposte veloci, prima:

- **Funziona nei due sensi.** Gli eventi dei calendari che scegli diventano
  attività di LifeMax. Se in LifeMax sposti un'attività, le cambi durata o
  nome, o la elimini, cambia anche nel calendario. «Fatto» resta solo in
  LifeMax: un calendario non sa cosa vuol dire.
- **Non serve un server.** Tutto parte dal browser di chi usa l'app. Il sito
  resta su GitHub Pages così com'è.
- **Il permesso non va nel cloud.** Quali calendari, con che area, dove
  scrivere: questo si sincronizza con i tuoi dati. Il permesso di leggere e
  scrivere il calendario invece resta nel browser: ogni dispositivo si
  collega da sé, con un tocco.

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

## Come funziona, in breve

**Quando.** All'apertura dell'app, quando ci torni (non più di una volta
ogni cinque minuti), pochi secondi dopo che cambi un'attività collegata, e
con «Sincronizza ora». Mai due giri insieme. Senza rete aspetta che torni.

**Cosa entra.** Gli eventi da oggi a sessanta giorni avanti dei calendari
accesi. Il passato no (comparirebbe come cose non fatte). Non entrano gli
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

**Scollegare.** L'app chiede cosa fare delle attività arrivate da lì:
tenerle (staccate, diventano attività normali) o toglierle (tranne quelle
già fatte). Il calendario non si tocca in nessuno dei due casi.

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

---

## Quello che non fa (ancora)

- **Gira solo ad app aperta.** Senza un server nessuno guarda il calendario
  mentre LifeMax è chiusa: le novità arrivano quando la apri.
- **Il permesso di Google dura un'ora**, e Google non permette di
  rinnovarlo senza una finestrella: se scade mentre l'app lavora da sola,
  compare «Ricollega» invece di una finestra che si apre da sé. Quello di
  Microsoft si rinnova da solo per 24 ore, poi serve un tocco.
- **Più di 100 persone su Google** richiedono la verifica (punto 3).
- **Sull'iPhone con l'app sulla schermata Home** il ritorno da Microsoft può
  finire in Safari invece che nell'app: se succede, collega Outlook da
  Safari, oppure da un altro dispositivo e poi tocca «Collega anche qui».
- La finestra guarda **sessanta giorni avanti**: un evento più lontano
  arriva quando ci entra.
- Una cancellazione fatta **qui** su un evento di un calendario in **sola
  lettura** (condiviso con te senza permesso di modifica) resta qui: là non
  si può scrivere.
- La «cosa non fatta» della sera (**porta a domani le non fatte**) salta le
  attività dei calendari: una riunione non si sposta in blocco. Una per
  una sì.

---

## Le parti, per chi guarda il codice

| file | cosa fa |
|---|---|
| `src/calendari/config.ts` | i due Client ID (vuoti: si incollano dall'app) |
| `src/calendari/fornitore.ts` | il contratto comune ai due calendari, e i conti col tempo |
| `src/calendari/google.ts` | Google Identity Services (token client) + Calendar API v3 |
| `src/calendari/microsoft.ts` | Authorization Code + PKCE scritto a mano + Microsoft Graph; nel commento in cima il perché niente MSAL |
| `src/calendari/sincronia.ts` | l'algoritmo: chi ha ragione, le cancellazioni, quando girare |
| `src/fogli/Calendari.tsx` | il pannello |
| `prove/calendari.js` | la prova, con un Google e un Microsoft finti |
