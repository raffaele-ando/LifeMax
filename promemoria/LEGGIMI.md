# I promemoria

LifeMax è un sito statico: nessun server, tutto nel browser. Le notifiche a
orario sono l'unica cosa che da soli non si può fare. Non è una scelta di
comodo: sul web non esiste un modo di programmare una notifica per domani
alle 8:30. L'unica API che lo permetteva — Notification Triggers — non è mai
uscita dalla sperimentazione ed è stata rimossa. Una pagina chiusa non si
sveglia. O la notifica arriva da fuori, o non arriva.

Quindi serve una cosa piccolissima che sta sveglia: un Cloudflare Worker che
ogni cinque minuti guarda chi tocca e manda. Sta tutto nel piano gratuito e
resta gratuito — sotto c'è il conto.

**Dove sta la testa e dove stanno le gambe.** La decisione — che cosa vale la
pena ricordarti oggi — la prende l'app, dove stanno i tuoi dati e dove ci sono
le prove. Il Worker non sa niente di te: riceve una lista di «alle 08:30 dì
questo» e la spedisce. Sul server non finisce nemmeno una nota del diario.

---

## Le parti

| file | cosa fa |
|---|---|
| `sw.js` (nella radice) | il service worker: riceve la notifica e la mostra. Senza cache, di proposito |
| `assets/promemoria.js` | il lato app: registra il service worker, chiede il permesso quando lo chiedi tu, costruisce il piano di oggi e lo manda |
| `promemoria/push.js` | la cifratura (RFC 8291, `aes128gcm`) e la firma (RFC 8292, VAPID), con la sola WebCrypto |
| `promemoria/piano.js` | l'unica decisione del server: chi tocca adesso, nel fuso di chi riceve |
| `promemoria/worker.js` | il Worker: due porte e una sveglia ogni cinque minuti |
| `promemoria/chiavi.mjs` | genera la coppia di chiavi VAPID |
| `promemoria/wrangler.toml` | la configurazione del Worker |

Le prove, da lanciare senza installare niente e senza toccare Cloudflare:

```sh
node promemoria/prova.mjs         # la cifratura, byte per byte contro http_ece
node promemoria/prova-piano.mjs   # chi tocca adesso, fusi e ora legale compresi
node promemoria/prova-worker.mjs  # il giro intero, con un KV finto
node prove/promemoria.js          # il lato app, dentro un browser vero
```

`prova.mjs` ha bisogno di `npm i http_ece` (serve solo a confrontare, non al
codice). Le altre tre no.

---

## Che cosa devi fare

Cinque passaggi. Il quarto è quello che va fatto sul tuo computer e non
altrove: la chiave privata non deve uscire da lì.

### 1. Metti l'app sul telefono

Sull'iPhone il push arriva **solo** se LifeMax sta nella schermata Home. Da
Safari come scheda normale il permesso non si può nemmeno chiedere — è una
regola di Apple, non un dettaglio da aggirare.

Safari → **Condividi** → **Aggiungi a schermata Home** → apri LifeMax da lì.

Su Android e su desktop non serve, ma installarla conviene comunque.

### 2. Un account Cloudflare

Quello gratuito. Poi, una volta sola, sul tuo computer:

```sh
npx wrangler login
```

### 3. Lo spazio dove tenere i piani

```sh
cd promemoria
npx wrangler kv namespace create PROMEMORIA
```

Stampa un `id`. Aprilo `wrangler.toml` e mettilo al posto di
`METTI_QUI_L_ID_DEL_KV`.

### 4. Le due chiavi

```sh
node chiavi.mjs
```

Stampa una **pubblica** e una **privata**.

> La privata non si manda a nessuno: non a me, non in chat, e non va scritta
> in nessun file del repository. Chi ha quella può mandare notifiche a nome
> tuo. Va solo dentro il comando qui sotto, che la mette su Cloudflare e non
> la stampa più.

```sh
npx wrangler secret put VAPID_PRIVATA     # incolla la privata
npx wrangler secret put VAPID_PUBBLICA    # incolla la pubblica
npx wrangler secret put VAPID_SOGGETTO    # scrivi mailto:la-tua@mail
```

Il `VAPID_SOGGETTO` è un contatto: i servizi push lo vogliono per sapere chi
chiamare se qualcosa va storto.

### 5. Manda su il Worker

```sh
npx wrangler deploy
```

Alla fine stampa un indirizzo, tipo
`https://lifemax-promemoria.tuonome.workers.dev`. Controlla che sia vivo:

```sh
curl https://lifemax-promemoria.tuonome.workers.dev/salute
# {"ok":true,"vapid":true}
```

Se `vapid` è `false`, i tre segreti del passo 4 non sono arrivati.

---

## Cosa mandarmi

Due righe, e sono entrambe pubbliche:

1. l'**indirizzo del Worker** (`https://….workers.dev`)
2. la **chiave pubblica** VAPID

Le metto in `assets/promemoria.js`, dentro `CONFIG`, e i promemoria si
accendono da Impostazioni → Promemoria.

**La chiave privata no.** Se te la chiedo, ho sbagliato: non serve, non deve
passare da qui e non c'è modo di annullare l'invio di un segreto.

### O senza aspettarmi

Se vuoi provare subito, da console del browser sull'app:

```js
localStorage.setItem('lifemax.promemoria.cfg', JSON.stringify({
  server: 'https://lifemax-promemoria.tuonome.workers.dev',
  chiave: 'la-tua-chiave-pubblica'
}));
location.reload();
```

Poi Impostazioni → Promemoria → **Accendi i promemoria**.

---

## Che cosa ti arriva

| quando | cosa |
|---|---|
| 08:30 | «Cosa fai oggi» — se non hai ancora fatto il piano del mattino |
| 13:00 | «Check-in» — se non ne hai ancora fatto uno |
| 16:30 | la priorità del giorno, se è ancora lì intatta |
| 21:30 | «Com'è andata oggi» — se non hai chiuso la giornata |
| l'ora che hai messo tu | le abitudini a cui hai dato un orario |

Le abitudini senza orario non suonano mai, di proposito. Una notifica per
ognuna diventa rumore che si impara a ignorare in tre giorni, e da quel
momento anche quelle che contano sono invisibili.

Quattro regole che valgono per tutte:

- **niente in ritardo.** Passata un'ora e mezza, il promemoria non parte più:
  se il telefono era spento alle 8:30 e si riaccende a mezzogiorno, «Cosa fai
  oggi» non serve più a niente.
- **una volta sola.** Ogni voce parte una volta per giorno, e il segno si mette
  dopo la consegna: se il servizio push è giù, la passata dopo riprova.
- **niente raffiche.** Al massimo tre in un colpo. Una pila di notifiche si
  scarta tutta insieme, comprese quelle buone.
- **se l'app resta chiusa,** i tre momenti e le abitudini valgono comunque —
  se non l'hai aperta, per definizione non li hai fatti. La priorità del
  giorno no: quella era una cosa scritta ieri, e ricordarla domani sarebbe
  una bugia.

Il **timer che finisce** è l'unica notifica che arriva senza server, perché lì
la pagina è ancora aperta. Funziona appena dai il permesso.

---

## Quanto costa

Zero, e non per un pelo.

| | quanto ne serve | quanto ne dà il piano gratuito |
|---|---|---|
| richieste al Worker | 288 sveglie al giorno, più una quando salvi | 100.000 al giorno |
| letture da KV | ~600 al giorno | 100.000 al giorno |
| scritture su KV | una per notifica mandata, più una quando l'app risalva | 1.000 al giorno |
| spazio | qualche kB per dispositivo | 1 GB |

Le scritture sono l'unica cosa con un tetto basso, e per quello l'app manda il
piano **solo se è cambiato** e non più di una volta al minuto: senza quel
freno, un pomeriggio di spunte lo esaurirebbe. I record scadono da soli dopo
trenta giorni di silenzio, così un telefono che non si fa più vivo sparisce
senza che nessuno se ne ricordi.

---

## Se non arriva niente

- `curl .../salute` → `{"ok":true,"vapid":true}`. Se `vapid` è `false`,
  rifai il passo 4.
- `npx wrangler tail` mentre aspetti: ogni giro stampa
  `giro: N dispositivi, M notifiche`. Se N è 0, il piano non è mai arrivato —
  controlla che in Impostazioni i promemoria risultino accesi.
- Se stampa `rifiutata … 401` o `403`, la coppia VAPID nell'app e quella nei
  segreti non sono la stessa.
- Sull'iPhone, se il pannello dice «aggiungi alla schermata Home», l'app è
  aperta come scheda di Safari: da lì non funzionerà mai.
- Se hai negato il permesso una volta, il browser non lo richiede più: va
  riattivato dalle sue impostazioni, alla voce di questo indirizzo.
