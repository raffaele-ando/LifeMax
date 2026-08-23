# I promemoria

**Se non vuoi leggere niente:** [le istruzioni cliccabili sono qui sotto, dal
punto 1](#cosa-devi-fare). Non serve il terminale, non serve installare nulla,
non serve capire il codice. Sono sei cose da fare col mouse.

Tre risposte veloci, prima:

- **Il sito resta su GitHub Pages.** Il Worker non lo ospita: è solo una
  sveglia che sta da un'altra parte. Non serve Cloudflare Pages.
- **Con un dominio tuo funziona**, ma prima esporta i dati: per il browser un
  indirizzo nuovo è un sito nuovo. [Dettagli qui sotto](#il-sito-resta-dovè).
- **Cambiare idea sui promemoria non richiede di rifare niente su Cloudflare.**
  Orari, interruttori e silenzio si cambiano dall'app; un tipo nuovo si
  aggiunge nel codice del sito. [Perché](#se-cambio-idea).

---

## Perché serve un pezzo fuori dal sito

LifeMax è un sito statico: nessun server, tutto nel browser. Le notifiche a
orario sono l'unica cosa che da soli non si può fare — sul web non esiste un
modo di programmare una notifica per domani alle 8:30. L'unica API che lo
permetteva (Notification Triggers) non è mai uscita dalla sperimentazione ed è
stata rimossa. Una pagina chiusa non si sveglia: o la notifica arriva da fuori,
o non arriva.

Quindi serve una cosa piccolissima che sta sveglia: un Cloudflare Worker che
ogni cinque minuti guarda chi tocca e manda. Sta tutto nel piano gratuito, e
sotto c'è il conto esatto.

**Dove sta la testa e dove stanno le gambe.** La decisione — che cosa vale la
pena ricordarti oggi — la prende l'app, dove stanno i tuoi dati e dove ci sono
le prove. Il Worker non sa niente di te: riceve una lista di «alle 08:30 dì
questo» e la spedisce. Sul server non finisce nemmeno una nota del diario.

---

## Cosa devi fare

Cinque passi. Tutti dal sito di Cloudflare, col mouse.

### 1 · Metti l'app sul telefono

Sull'iPhone i promemoria arrivano **solo** se LifeMax sta nella schermata Home.
Da Safari come scheda normale il permesso non si può nemmeno chiedere: è una
regola di Apple, non un dettaglio da aggirare.

> Safari → tasto **Condividi** (il quadrato con la freccia in su) →
> **Aggiungi a schermata Home** → apri LifeMax da quell'icona.

Su Android e su computer non serve, ma conviene comunque.

### 2 · Crea il Worker e incolla il codice

1. Vai su [dash.cloudflare.com](https://dash.cloudflare.com) (account gratuito).
2. Nel menù a sinistra: **Compute (Workers)** → **Workers & Pages**.
3. **Create** → **Start with Hello World!** → **Get started**.
4. Come nome scrivi `lifemax-promemoria` → **Deploy**.
5. Ora premi **Edit code** (o **< > Edit code**).
6. Nell'editor: **seleziona tutto quello che c'è e cancellalo.**
7. Apri il file **`promemoria/worker-unico.js`** di questo progetto, copia
   tutto, e incollalo lì.
8. **Deploy** (in alto a destra).

> È un file solo di proposito. Il Worker in realtà sono tre file — uno per la
> crittografia, uno per la decisione, uno per le porte — ma spiegare come si
> creano tre moduli in un editor web è un modo di far fallire l'installazione
> al primo passo. `worker-unico.js` è la loro somma, generata da un comando, e
> in cima c'è scritto di non modificarlo a mano.

Alla fine, in alto, c'è l'indirizzo del Worker: qualcosa come
`https://lifemax-promemoria.tuonome.workers.dev`. **Copialo e tienilo da
parte.**

### 3 · Crea lo spazio dove tenere i piani

1. Menù a sinistra: **Storage & Databases** → **KV**.
2. **Create instance** (o **Create a namespace**).
3. Nome: `PROMEMORIA` → **Create**.
4. Torna su **Workers & Pages** → clicca `lifemax-promemoria`.
5. Scheda **Bindings** → **Add binding** → **KV namespace** → **Add binding**.
6. **Variable name**: scrivi esattamente `PROMEMORIA` (in maiuscolo).
7. Nel menù a tendina scegli il namespace `PROMEMORIA` che hai appena creato.
8. **Add binding**.

> Il nome della variabile deve essere `PROMEMORIA` in maiuscolo, identico: è
> il nome con cui il codice lo cerca. Se lo scrivi diverso, il Worker parte e
> non trova niente.

### 4 · Le due chiavi

> **UNA COPPIA SOLA, PER SEMPRE, PER TUTTI I DISPOSITIVI.**
> Non una per telefono, non una per iPhone e una per Android. Le chiavi VAPID
> dicono *chi manda*, non *a chi*: sono l'identità del mittente, e il mittente
> è uno — il tuo Worker. Le fai una volta e non ci torni più.
>
> Quello che è diverso da dispositivo a dispositivo è l'**iscrizione**, e quella
> la fabbrica il browser da sé quando accendi i promemoria su quel dispositivo:
> non la vedi, non la incolli, non la gestisci. iPhone, Android, computer —
> ognuno si registra col suo indirizzo, tutti con la stessa chiave pubblica.

Servono ai servizi push (Apple, Google) per sapere che quelle notifiche le
manda sempre lo stesso mittente. Sono una coppia.

**Dall'app**, in *Impostazioni → Promemoria → Come ti avviso*, sotto il campo
della chiave: **«Non le hai? Fattele qui»**. Si apre una pagina che genera la
coppia. (Se preferisci: è il file `promemoria/chiavi.html`, e sul sito sta
all'indirizzo del sito più `/promemoria/chiavi.html`.)

Premi **Genera le due chiavi**.

> Quella pagina non manda niente da nessuna parte: usa la crittografia che il
> browser ha già dentro, e non c'è una riga di rete in tutto il file. Puoi
> anche staccare il wi-fi prima di premere il pulsante.
>
> **Tieni la pagina aperta fino alla fine del passo 4:** se la chiudi le
> chiavi spariscono e bisogna rifare tutto da capo.

Poi su Cloudflare, dentro `lifemax-promemoria`:

1. Scheda **Settings**.
2. Sezione **Variables and Secrets** → **Add**.
3. **Type**: scegli **Secret**.

Aggiungine tre, uno per volta:

| Variable name | Value |
|---|---|
| `VAPID_PUBBLICA` | la chiave **pubblica** della pagina |
| `VAPID_PRIVATA` | la chiave **privata** della pagina |
| `VAPID_SOGGETTO` | `mailto:` seguito dalla tua mail |

4. **Deploy**.

> **La privata non si manda a nessuno.** Non a me, non in chat, non per mail,
> e non dentro un file del progetto. Chi ce l'ha può mandare notifiche a nome
> tuo, e un segreto spedito non si può richiamare. Va solo in quella casella
> di Cloudflare, che la tiene e non la mostra più.

### 5 · La sveglia ogni cinque minuti

1. Sempre in `lifemax-promemoria`: **Settings** → **Triggers**.
2. Sezione **Cron Triggers** → **Add Cron Trigger**.
3. Scrivi: `*/5 * * * *`
4. **Add**.

Fatto. Per controllare che sia vivo, apri nel browser
`https://…workers.dev/salute`: deve rispondere

```json
{"ok":true,"vapid":true}
```

Se `vapid` è `false`, i tre segreti del passo 4 non sono arrivati.

---

### 6 · Dillo all'app

Non serve mandarmi niente e non serve toccare il codice.

> **Impostazioni → Promemoria → Come ti avviso**

In cima ci sono due campi: **Indirizzo** (quello del punto 2) e **Chiave
pubblica** (quella del punto 4). Premi **Collega**.

L'app prima chiede al server se è vivo, e poi dice cosa non torna: se
l'indirizzo è scritto male, se la chiave non è una chiave, se il server
risponde ma non ha i suoi segreti. Un campo sbagliato non viene salvato in
silenzio.

Poi premi **Mandamene una adesso**: arriva una notifica di prova, subito. È
il modo di sapere che funziona senza aspettare le 08:30 di domani.

Le due cose che scrivi lì stanno nei tuoi dati, non nel telefono: se accedi
con Google le ritrovi anche sull'altro dispositivo, e finiscono
nell'esportazione insieme a tutto il resto.

**La chiave privata non va in nessuno dei due campi.** Se un campo te la
chiede, è il campo sbagliato.

---

## Più di un dispositivo

Non c'è niente da rifare. La coppia di chiavi è una e vale per tutti; su ogni
dispositivo nuovo servono solo due gesti:

1. aprire LifeMax su quel dispositivo (sull'iPhone: aggiunto alla schermata
   Home, altrimenti il permesso non si può nemmeno chiedere);
2. **Impostazioni → Promemoria → Accendi i promemoria.**

L'indirizzo del Worker e la chiave pubblica **non** si reincollano, se hai
fatto l'accesso con Google: stanno nei tuoi dati e si sincronizzano insieme a
tutto il resto. Senza accesso, li incolli anche là — sono le stesse due righe,
copiate identiche.

Il permesso invece va dato su ogni dispositivo, sempre: quello non si
sincronizza per definizione, perché è un permesso che dai a *quel* browser su
*quel* telefono.

Poi ogni dispositivo si prende la sua riga sul server, e riceve le sue
notifiche. Sul Worker li vedi contati: `giro: 3 dispositivi, 2 notifiche`.

**Se un dispositivo smette di ricevere** (l'hai reinstallata, hai revocato le
notifiche, hai cambiato indirizzo del sito): spegni e riaccendi i promemoria
lì. L'iscrizione vecchia scade da sé e il server la butta al primo rifiuto —
non serve toccare né le chiavi né Cloudflare.

**Quando invece SÌ bisogna rifare le chiavi:** solo se la privata è finita
dove non doveva (mandata per sbaglio, incollata in un file pubblico). In quel
caso: rigeneri la coppia, rimetti tutti e due i segreti su Cloudflare, cambi
la pubblica nell'app, e su ogni dispositivo spegni e riaccendi. L'app se ne
accorge da sé che la chiave è cambiata e rifà l'iscrizione — ma il permesso
resta, quindi è un tocco.

---

## Il sito resta dov'è

**GitHub Pages va benissimo, e non cambia niente.** Il Worker non ospita il
sito: è solo una sveglia che sta da un'altra parte. Il sito continua a stare su
GitHub Pages, il Worker su Cloudflare, e si parlano quando serve.

Non serve Cloudflare Pages. Non serve spostare niente.

### Con un dominio tuo

Funziona, ma c'è una cosa da sapere prima di farlo, perché non è ovvia.

Il permesso alle notifiche, l'iscrizione al servizio push e **tutti i tuoi
dati** sono legati all'**indirizzo** del sito. Per il browser
`raffaele-ando.github.io/lifemax/` e `lifemax.tuodominio.it` sono due siti
diversi, anche se il contenuto è identico. Quindi, cambiando indirizzo:

- il permesso va dato di nuovo;
- l'iscrizione si rifà da sola alla prima accensione (quella vecchia sul server
  scade e viene buttata: è previsto);
- sull'iPhone va **ri-aggiunto alla schermata Home**;
- e soprattutto: **i dati non si spostano da soli.** Sono nel browser, sotto il
  vecchio indirizzo.

Quindi, prima di cambiare: **Impostazioni → I tuoi dati → Esporta**, e dal
nuovo indirizzo **Importa**. Oppure accedi con Google prima e dopo, e li
ritrovi.

L'indirizzo del **Worker** invece non c'entra: quello resta uguale, e non va
ritoccato.

---

## Se cambio idea

**Aggiungere, togliere o cambiare un promemoria non richiede di rifare niente
su Cloudflare.** È il motivo per cui è fatto così.

Il Worker non sa cosa sono un check-in o un'abitudine. Riceve una lista di
«alle 08:30 dì questo, e porta a quella schermata» e la spedisce all'ora
giusta. Chi decide *cosa* c'è in quella lista è l'app, e l'app viaggia col
sito: la aggiorni pubblicando su GitHub Pages, come qualsiasi altra modifica.

Quindi:

| se vuoi | dove si cambia | Cloudflare |
|---|---|---|
| accendere o spegnere un promemoria | Impostazioni → Come ti avviso | — |
| cambiare l'ora di uno | Impostazioni → Come ti avviso | — |
| la fascia di silenzio | Impostazioni → Come ti avviso | — |
| la nota fissa | Impostazioni → Come ti avviso | — |
| **un tipo di promemoria nuovo** | `piano()` in `assets/promemoria.js` | — |
| **cambiare il testo di uno** | `assets/promemoria.js` | — |
| un pulsante *dentro* la notifica | `assets/promemoria.js` + `sw.js` | — |

L'unico caso che tocca il Worker è aggiungere un **campo nuovo** al pacchetto
(oggi passano: titolo, corpo, dove andare, tag, tipo, il numero per l'icona).
Il Worker controlla i campi uno per uno di proposito — così quello che arriva
da fuori non può inventarsi cose — quindi un campo nuovo va aggiunto anche là,
si rifà `impacchetta.mjs` e si reincolla. È l'unico caso, e non capita
cambiando idea su *quando* essere avvisati.

---

## Cosa ti arriva

Gli orari qui sotto sono quelli di partenza: **si cambiano dall'app**, in
Impostazioni → Come ti avviso, e ognuno si può anche spegnere.

| quando | cosa |
|---|---|
| 07:30 | la nota fissa con quello che ti resta oggi (se l'hai accesa) |
| 08:30 | «Cosa fai oggi» — se non hai ancora fatto il piano del mattino |
| 13:00 | «Check-in» — se non ne hai ancora fatto uno |
| 16:30 | la priorità del giorno, se è ancora lì intatta |
| 21:30 | «Com'è andata oggi» — se non hai chiuso la giornata |
| l'ora che hai messo tu | le abitudini a cui hai dato un orario |

Più una **fascia di silenzio** (di partenza 23:00 → 07:00): dentro quella non
arriva niente, nemmeno un promemoria in ritardo che ci finirebbe dentro in
punta di piedi.

Spegnere un promemoria **non cancella la cosa**: la review della sera resta da
fare, semplicemente non te lo dice nessuno.

Le abitudini senza orario non suonano mai, di proposito. Una notifica per
ognuna diventa rumore che si impara a ignorare in tre giorni, e da quel momento
anche quelle che contano sono invisibili.

Quattro regole per tutte:

- **niente in ritardo.** Passata un'ora e mezza il promemoria non parte più: se
  il telefono era spento alle 8:30 e si riaccende a mezzogiorno, «Cosa fai
  oggi» non serve più a niente.
- **una volta sola.** Ogni voce parte una volta al giorno, e il segno si mette
  *dopo* la consegna: se il servizio push è giù, la passata dopo riprova.
- **niente raffiche.** Al massimo tre in un colpo. Una pila di notifiche si
  scarta tutta insieme, comprese quelle buone.
- **se l'app resta chiusa,** i tre momenti e le abitudini valgono comunque —
  se non l'hai aperta, per definizione non li hai fatti. La priorità del giorno
  no: quella era una cosa scritta ieri, e ricordarla domani sarebbe una bugia.

Il **timer che finisce** è l'unica notifica che arriva senza server, perché lì
la pagina è ancora aperta. Funziona appena dai il permesso.

---

## La nota fissa, e cosa si può davvero fare

**Impostazioni → Promemoria → Tienimi una nota fissa.**

Quello che si può fare:

- **una notifica sola**, sempre la stessa, che si riscrive al posto di quella
  di prima invece di aggiungersene una accanto;
- **senza rumore** quando si aggiorna, così non la spegni per fastidio;
- **resta nell'elenco** delle notifiche finché non la scarti tu — su Android
  nella tendina, su iPhone e Mac nel centro notifiche;
- su computer **non sparisce da sé** dopo venti secondi come fanno le altre;
- e **il numero sull'icona**: il pallino con quante cose ti restano oggi,
  sulla schermata Home. Quello non si scarta, non fa rumore e non è in nessuna
  lista. Zero lo togli del tutto — un'icona pulita vuol dire «per oggi ci sei».

Quello che **non** si può fare, e nessuno può: una notifica **bloccata**, che
non si possa scartare, come quella di un navigatore o di un lettore musicale.
Su Android serve un *servizio in primo piano*, sull'iPhone una *Live Activity*:
sono due cose che solo un'app scaricata dallo store può avere. Un sito no,
nemmeno aggiunto alla schermata Home. Quella che c'è si scarta — ma torna da sé
il mattino dopo, e il numero sull'icona resta comunque.

Il numero sull'icona, sull'iPhone, ha bisogno di due cose: l'app **aggiunta
alla schermata Home** e il **permesso alle notifiche** dato. Si può impostare
anche senza, ma non si vede.

---

## Quanto costa

Zero, e non per un pelo.

| | quanto serve | quanto dà il piano gratuito |
|---|---|---|
| richieste al Worker | 288 sveglie al giorno, più una quando salvi | 100.000 al giorno |
| letture da KV | ~600 al giorno | 100.000 al giorno |
| scritture su KV | una per notifica mandata, più una quando l'app risalva | 1.000 al giorno |
| spazio | qualche kB per dispositivo | 1 GB |
| sveglie programmate | 1 | 5 per account |

Le scritture sono l'unica cosa con un tetto basso, e per quello l'app manda il
piano **solo se è cambiato** e non più di una volta al minuto: senza quel
freno, un pomeriggio di spunte lo esaurirebbe. I record scadono da soli dopo
trenta giorni di silenzio, così un telefono che non si fa più vivo sparisce
senza che nessuno se ne ricordi.

---

## Se non arriva niente

- `https://…workers.dev/salute` → deve dire `{"ok":true,"vapid":true}`. Se
  `vapid` è `false`, rifai il passo 4.
- **Impostazioni → Come ti avviso → Mandamene una adesso.** È la prima cosa
  da provare: dice se il problema è il server, l'iscrizione o il permesso,
  invece di lasciarti indovinare.
- Su Cloudflare, in `lifemax-promemoria`: scheda **Logs** → **Begin log
  stream**, e aspetta. Ogni giro stampa `giro: N dispositivi, M notifiche`. Se
  N è 0, il piano non è mai arrivato: controlla che in **Impostazioni →
  Promemoria** risultino accesi.
- Se stampa `rifiutata … 401` o `403`: la chiave pubblica nell'app e quella nei
  segreti non sono la stessa coppia.
- Se stampa `manca la coppia VAPID`: i segreti non ci sono, o hanno un nome
  diverso da `VAPID_PUBBLICA` / `VAPID_PRIVATA`.
- Sull'iPhone, se il pannello dice «aggiungi alla schermata Home», l'app è
  aperta come scheda di Safari: da lì non funzionerà mai.
- Se hai negato il permesso una volta, il browser non lo richiede più: va
  riattivato dalle sue impostazioni, alla voce di questo indirizzo.

---

## Le parti, per chi guarda il codice

| file | cosa fa |
|---|---|
| `sw.js` (nella radice) | il service worker: riceve la notifica, la mostra, mette il numero sull'icona |
| `assets/promemoria.js` | il lato app: registra il service worker, chiede il permesso quando lo chiedi tu, costruisce il piano e lo manda |
| `promemoria/push.js` | la cifratura (RFC 8291, `aes128gcm`) e la firma (RFC 8292, VAPID), con la sola WebCrypto |
| `promemoria/piano.js` | l'unica decisione del server: chi tocca adesso, nel fuso di chi riceve |
| `promemoria/worker.js` | il Worker: due porte e una sveglia |
| `promemoria/worker-unico.js` | **generato** — i tre di sopra in un file, per il pannello di Cloudflare |
| `promemoria/impacchetta.mjs` | lo rifà: `node promemoria/impacchetta.mjs` |
| `promemoria/chiavi.html` | genera la coppia VAPID nel browser, senza rete — si apre dall'app, in «Come ti avviso» |
| `promemoria/wrangler.toml` | per chi preferisce il terminale a mano (`npx wrangler deploy`) |

Le prove, senza installare niente e senza toccare Cloudflare:

```sh
node promemoria/prova.mjs                  # la cifratura, byte per byte contro http_ece
node promemoria/prova-piano.mjs            # chi tocca adesso: fusi, ora legale, ritardi
node promemoria/prova-worker.mjs           # il giro intero, con un KV finto
node promemoria/prova-worker.mjs --unico   # lo stesso, sul file da incollare
node promemoria/prova-chiavi.mjs           # la pagina delle chiavi, in un browser vero
node prove/promemoria.js                   # il lato app, in un browser vero
```

`prova.mjs` ha bisogno di `npm i http_ece` (serve solo a confrontare, non al
codice). Le altre no. `prova-worker.mjs` controlla anche che
`worker-unico.js` sia aggiornato: se qualcuno modifica un modulo e si dimentica
di rifare il pacco, si ferma.

Perché `aes128gcm` e non `aesgcm`: `aesgcm` è lo schema vecchio, e il servizio
push di Apple — quello che serve le app aggiunte alla schermata Home
dell'iPhone — accetta solo il nuovo. Con quello vecchio le notifiche
arriverebbero su Android e non sull'iPhone.
