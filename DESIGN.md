# Il design di LifeMax

Questo file esiste perché una scoperta fatta misurando: il foglio di stile
dichiarava **tredici pesi tipografici** e il browser ne disegnava **due**.
Nessuno aveva sbagliato niente — semplicemente non c'era un posto dove fosse
scritto quanti pesi ha LifeMax, e in tre anni di modifiche i numeri si sono
moltiplicati uno alla volta, ognuno ragionevole da solo.

Da qui in poi c'è scritto. Quello che sta qui vale più di qualsiasi consiglio
di design che arrivi da fuori: se una regola esterna dice il contrario di
questo file, ha ragione questo file, o si cambia questo file per primo.

## Che cosa è questa interfaccia

**È una superficie da usare, non da guardare.** Serve a portare a termine un
compito: scegliere cosa fare adesso, far partire un timer, spuntare una cosa,
chiudere la giornata. Chi la apre non è venuto ad ammirarla — la apre venti
volte al giorno, spesso di corsa, spesso stanco, a volte con una mano sola
camminando.

Ne discende una gerarchia che decide ogni caso dubbio:

1. **si legge a colpo d'occhio** — la risposta prima della domanda
2. **è sempre la stessa** — la stessa cosa nello stesso posto con lo stesso nome
3. **rispetta le abitudini del telefono** — non si inventano gesti nuovi
4. **e solo dopo: è bella** — la personalità sta nei dettagli precisi, non nell'effetto

Chi la usa ha **bassa coscienziosità, alta apertura, ADHD**. Ogni elemento in
più è una via d'uscita legittima dalla cosa che stava facendo. Non si aggiunge
niente «per dare vita alla pagina».

## La scala dei pesi

    --peso-testo:    400    il testo
    --peso-forte:    600    quello che va notato dentro al testo
    --peso-titolo:   750    titoli, etichette, numeri
    --peso-display:  850    i numeri grandi, il tempo del timer

Quattro, e non uno di più. Il numero scritto a mano nel foglio non si usa:
si usa il token.

**Perché quattro e non tredici.** Misurato in pagina, la stessa frase a tutti
e tredici i pesi che c'erano: 400 e 500 escono larghe uguali, e da 550 a 850
escono tutte larghe uguali. Fra 620 e 650 non c'è nessuna differenza che un
occhio possa vedere, nemmeno dove il font è variabile. Tredici numeri
raccontavano una gerarchia che sullo schermo non esisteva.

`<b>` e `<strong>` nascono a 700 nel foglio del browser: sono riportati a
`--peso-titolo`, se no in mezzo alla prosa c'è un peso fuori scala.

## I raggi

    --r-1: 8px    --r-2: 12px    --r-3: 18px    --r-tondo: 99px

e in modalità compatta 6 / 10 / 14. Tutte e 152 le regole del foglio usano un
token: **nel CSS non c'è un solo raggio scritto a numero.**

A schermo se ne vedono quaranta valori diversi, e non è un difetto: la forma
degli angoli è la **curva continua di Apple**, disegnata in pixel da
`forma.js` sulla misura vera di ogni elemento, che riscrive il `border-radius`
al 99% perché l'arco resti dentro al ritaglio. Più lo schiacciamento che fa il
browser sugli elementi troppo piccoli per il loro raggio.

## L'identità visiva

Il difetto di partenza l'ha detto chi la usa: **«la UI di questo sito è troppo
AI slop»**. Aveva ragione, e le skill di design lo dicono con dei nomi:

| il «tell» | dove stava |
|---|---|
| il gradiente viola→blu, *«the most common AI design fingerprint»* | il tasto «+», il logo, ogni tasto pieno |
| il kit di schede SaaS: riquadri identici, stessa ombra sotto a ognuno | tutte le schede |
| l'etichetta in MAIUSCOLETTO SPAZIATO sopra a ogni titolo | undici punti |
| le lavate di gradiente come decorazione | la scheda dell'andamento |
| l'alone colorato sotto al logo | la barra laterale |

**L'accento è inchiostro.** `#17323f` in chiaro, il suo ribaltamento in scuro.
Piatto, senza gradiente. Il perché non è gusto: le otto aree della vita
occupano già tutta la ruota dei colori, e un accento a mezza saturazione, di
qualunque tinta, sembrerebbe una nona area. E questo non è un prodotto che
vende: è uno strumento che si legge. Su uno strumento i colori appartengono ai
**dati**; l'ago e le cifre sono inchiostro.

**Le cifre hanno un carattere loro.** Un graziato di sistema — New York sugli
Apple, Cambria o Georgia su Windows, Noto Serif su Android — sul tempo del
timer, sui numeri grandi, sui titoli di schermata. Zero byte scaricati, su un
progetto dove questa settimana ne ho tolti seicentododici.

È l'unico posto in cui questa interfaccia alza la voce, ed è il posto giusto:
misurare è quello che fa. Non su tutte le cifre — quelle dentro a un elenco
restano nel sans, se no non è più un accento, è un tema.

**Una scheda non galleggia.** L'ombra `--e2` è di una cosa staccata dalla
pagina; sotto a ogni scheda voleva dire che tutto galleggiava allo stesso
modo, cioè che niente galleggiava. Una scheda sta *sulla* pagina: la separa un
filo. L'ombra resta dov'è un'informazione — questa cosa sta sopra a quella, e
sotto ci torni.

## Il colore

Un accento solo, e vive in due varianti che non sono intercambiabili:

- `--accento` per le **linee e le superfici**
- `--accento-testo` per le **parole** — è la variante scura, quella che passa
  il contrasto AA

Confonderle è già successo: un «+10» verde scritto col colore delle linee
faceva 2.89:1. `prove/colori.js` misura il contrasto di ogni testo dell'app
nei due temi, ed è lui ad avere l'ultima parola.

Gli otto colori delle aree sono una palette categorica scelta per essere
distinguibile anche da chi ha una carenza cromatica; i tre che sotto i 3:1 su
chiaro non ci arrivano portano **sempre** anche un'etichetta e un'icona. Il
colore da solo non dice mai niente.

## I comandi

**Uno pieno per schermata.** Pieno vuol dire: questa è la cosa che sei venuto
a fare qui. Se ce ne sono due, non ce n'è nessuno.

- `.btn-primario` — l'azione della schermata. Uno.
- `.btn-tonale` — salva un blocco dentro una schermata più lunga. Stessa
  forma, stessa misura, stesso posto: alza meno la voce.
- `.btn-ok` — verde, la conferma che chiude qualcosa.

Su «Rituali» ce n'erano quattro pieni insieme: «Come sempre», «Salva», «Ho
finito», «Concludi la giornata». Adesso pieno è solo quello che chiude il
rituale.

## Il testo

- `text-wrap: pretty` su tutto il corpo. Tocca solo l'ultima riga di un blocco
  che va a capo, e toglie le parole rimaste sole in fondo: erano sessanta.
- `text-wrap: balance` sui titoli, che su due righe le divide a metà.
- **La misura: `max-width: 52ch`** sulla prosa. Il numero è misurato, non
  scelto: `ch` è la larghezza dello zero, che qui è il 45% più largo della
  lettera media, quindi 64ch tenevano ancora 84 caratteri. 52ch ne tengono
  settantasei, che è il punto oltre il quale l'occhio non ritrova più da solo
  l'inizio della riga dopo.

## Il movimento

Si muove solo quello che dice qualcosa. Ogni animazione è stata misurata, non
sentita: un'aurora sfocata dietro a elementi che si muovevano portava l'app a
**18,7 fps**, e non si vedeva (massimo 3 su 255 di differenza). È stata tolta.

Le regole che ne restano, tutte pagate con un bug vero:

- niente `filter` su un genitore di cose che si animano — decompositano i
  figli e ogni fotogramma si ridisegna da capo
- niente immagini generate per fare un bordo — su Android la scheda grafica
  finiva la memoria delle texture e mostrava rettangoli di memoria sporca
- niente maschere più alte di mezzo schermo, per lo stesso motivo
- niente letture del layout in mezzo a un'animazione
- «Effetti» ha tre gradini fino a **minimi**, che spegne tutto. Non è
  un'impostazione di comodo: è lo strumento con cui si è trovata la causa dei
  rettangoli grigi, e resta lì per la prossima volta.

## Il suono

Tredici voci, una per tipo di gesto, tutte in Web Audio senza un file. Il
suono conferma il tocco, non lo commenta: dura meno di 120ms e non copre mai
la voce di sistema.

## Chi ha l'ultima parola

Le prove in `prove/` non sono controlli di qualità: sono **il sistema di
design scritto in forma eseguibile**. Il contrasto lo decide `colori.js`, la
griglia `spazi.js`, un'icona una cosa `segni.js`, gli stati `stati.js`, gli
angoli e i bordi `bordi.js` su 312 schermate, le dieci larghezze
`larghezze.js`.

`prove/audit.js` è l'unico che non giudica: conta quanti valori diversi usa il
sistema e stampa un rapporto da leggere.

**Se un consiglio di design fa diventare rossa una prova, non è il consiglio a
vincere e non è la prova: è una domanda da portare a chi decide, con i due
numeri davanti.**

## Due cose imparate contando

Vale la pena tenerle qui, perché tutte e due sembravano difetti gravi e non lo
erano.

**«Quarantuno raggi diversi, sistema incoerente.»** Falso: 152 regole su 152
usano un token, la dispersione la fa `forma.js` apposta.

**«Ottantaquattro caratteri per riga sul diario.»** Falso: il blocco è largo
390px e ne tiene sessantasette. Era lo stimatore a sbagliare — divideva
l'altezza per l'interlinea invece di contare le righe vere.

Un numero grosso non è una diagnosi. Prima di scrivere «incoerente» si va a
vedere da dove viene.
