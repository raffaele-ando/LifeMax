# Il pacco dei segni

1776 icone, ferme qui e mai spedite al browser.

Sono di [Lucide](https://lucide.dev) (licenza ISC, il testo sta in
`LICENZA-lucide.txt`): griglia 24px, tratto 2, terminali arrotondati — le
stesse scelte dei segni che LifeMax aveva già disegnati a mano, per cui i
due insiemi stanno insieme senza stridere.

## A che serve tenerlo qui

Il problema che risolve non è «mancano le icone». È questo: quando serve un
significato nuovo e il set ne ha solo ottanta, la strada breve è riusare
quello che sembra più vicino. Così `check` è finito a dire insieme «fatto»,
«scelto fra tanti» e «salvato», e `clock` a dire un'ora, una durata e
«aspetta, non ci sono abbastanza dati». Con il pacco a portata di mano
prenderne uno nuovo costa mezzo minuto, e la strada breve smette di essere
la più breve.

## Come si usa

Cercare, per parola (le parole del pacco sono in inglese):

```sh
node segni/cerca.mjs orologio        # niente: prova in inglese
node segni/cerca.mjs clock
node segni/cerca.mjs deadline calendar
```

Per ogni candidato dice se è **già preso** e con che significato: così non
si sceglie due volte la stessa figura per due cose diverse.

Portarne uno dentro l'app:

```sh
node segni/prendi.mjs calendar-clock scadenza "una data entro cui"
```

Scrive il tracciato in `assets/icons.js`, in fondo, con accanto da dove
viene e che cosa vuol dire. Quel commento non è decorazione: `cerca.mjs` lo
legge per dire «già preso», e `prove/segni.js` per controllare che ogni
segno abbia un significato e che nessun significato sia scritto due volte.

Dopo, sempre:

```sh
node prove/segni.js
```

## Cosa NON fare

- Non aggiungere una voce a `PATHS` a mano: senza il commento di provenienza
  il segno diventa invisibile ai due controlli qui sopra.
- Non caricare `pacco.json` nel browser. Sono 360 kB per ottanta segni usati:
  `assets/icons.js` ne pesa venti e contiene solo quelli che servono.
- Non riusare un segno «che ci sta abbastanza». Costa meno prenderne uno.

## Aggiornare il pacco

```sh
npm pack lucide-static && tar xzf lucide-static-*.tgz
node segni/aggiorna.mjs ./package
```

I segni già presi restano dove sono: `assets/icons.js` è un file a sé e non
si rigenera. Se un tracciato cambia a monte, cambia solo per chi lo prende da
quel momento in poi — e se un segno che stiamo usando sparisce dal pacco,
`aggiorna.mjs` lo dice subito invece di lasciarlo scoprire a chi lo cerca.

## La forma degli angoli

In questa cartella ci sono anche i pezzi che fanno l'angolo continuo di Apple,
che non c'entra con i segni ma vive di formule come loro.

- **`apple.mjs`** — la geometria, e solo lei. Le costanti dell'angolo continuo
  di Apple in unità di raggio, la spezzata che le approssima (si infittisce da
  sé finché lo scarto dalla curva vera sta sotto la tolleranza), il contorno
  rientrato per il bordo, e il tracciato SVG per il logo e le icone.
- **`squircle.mjs`** — riscrive il blocco alla fine di `assets/app.css`: legge
  chi ha un angolo, raggruppa per raggio e spessore di bordo, azzera il
  `border-radius` e mette la curva nel `clip-path`. Si rilancia con
  `node segni/squircle.mjs` ogni volta che si cambia un raggio o si aggiunge un
  elemento con l'angolo tondo.
- **`misure.mjs`** — apre l'app e misura le due cose che dal foglio di stile non
  si vedono: quanto è grande ogni elemento (il raggio non può superare un terzo
  del lato corto) e se un selettore di bordo colpisce un elemento che ha anche
  l'angolo. Scrive `misure.json`. Va lanciato PRIMA di `squircle.mjs`, e
  rilanciato quando si cambia l'altezza di qualcosa.
- **`scene.json`** — le cinquantuno schermate, pannelli e stati su cui girano
  `misure.mjs`, `prove/bordi.js` e `prove/stati.js`: le pagine, i pannelli delle
  impostazioni, la *Giornata* nei suoi quattro orizzonti, le due sezioni di
  *Scoperte*, la review della sera, la barra della ricerca, un avviso di
  conferma, il menu «Altro», il timer avviato, il toast con l'annulla, e le
  dieci interfacce del Design lab (sei anche nella loro seconda schermata, dove
  stanno i chip). Una lista sola per tutte: quando erano due, quella delle
  misure era rimasta indietro di quattro pannelli, ed è esattamente là che si
  sono trovate le pastiglie mai misurate.
  Ogni voce porta un **`prova`**: un selettore che DEVE esserci quando la scena
  è pronta. Senza, una scena che sbaglia strada mostra un'altra schermata e la
  corsa la promuove — è così che otto scene sono rimaste per settimane a
  misurare la pagina sbagliata. Per coprire uno stato in più si aggiunge una
  scena qui, col suo `prova`.
- **`icone.mjs`** — rifà l'icona dell'app, il logo dentro `icons.js` e tutte le
  PNG. `node segni/icone.mjs`.

L'ordine è: `node segni/misure.mjs` → `node segni/squircle.mjs` →
`node prove/bordi.js` e `node prove/squircle.js`.

### Che cos'è, esattamente

Tre forme diverse si chiamano tutte «squircle»:

| | l'angolo | curvatura | area tolta (misurata) |
|---|---|---|---|
| `border-radius` | arco di **cerchio** | costante 1/R, e all'attacco col lato **salta** a zero | 0.2148 · r² |
| `corner-shape: squircle` | **superellisse** \|x\|ⁿ+\|y\|ⁿ=1, n≈4 | cambia in continuo | 0.0726 · r² |
| **Apple** (questa) | **tre Bézier** per angolo | cambia, e verso il lato si appiattisce fino a zero | 0.2254 · r² |

La colonna che conta è l'ultima. La superellisse a parità di raggio toglie
all'angolo il **66% in meno** di un arco: per questo la prima versione di
questo codice, che usava n = 4, aveva reso TUTTA l'app più spigolosa di prima.
L'angolo di Apple ne toglie l'1.05, quindi si legge arrotondato come sempre —
solo senza lo scalino di curvatura, che è la cosa che l'occhio vede senza saper
dire cosa.

E non è una superellisse travestita: chi ha provato a sostituirla con la
migliore (n = 5.2) ha misurato **1365 pixel di errore** dove le Bézier ne
sbagliano zero.

Fonti: [Desperately seeking squircles (Figma)](https://www.figma.com/blog/desperately-seeking-squircles/)
· [My Quest for the Apple Icon Shape](https://liamrosenfeld.com/posts/apple_icon_quest/)
· [Squircles, Apple design, and curvature (John D. Cook)](https://www.johndcook.com/blog/2018/02/13/squircle-curvature/)

### Le scelte, e perché

**Un `clip-path: polygon()` e non `corner-shape`.** `corner-shape` sarebbe una
riga, ma esiste solo su Chromium 139 e oltre — su Safari no, e resterebbero
rettangoli arrotondati. E comunque darebbe la superellisse, non Apple.

**Solo pixel e `min(px, %)`, niente moltiplicazioni.** L'angolo di Apple si
definisce in pixel dal vertice, quindi non serve nessuna percentuale per la
forma: resta identico su ogni proporzione, che è esattamente ciò che una
maschera SVG stirata non sa fare. Il `min(px, %)` c'è solo come limite: sotto
tre raggi di lato i due angoli si scontrerebbero, e il limite li rimpicciolisce
in proporzione invece di lasciarli strozzare.

**Tutto dentro un `@supports`.** Se il motore non sa fare quel ritaglio, il
blocco non si applica e resta il `border-radius`: un rettangolo arrotondato,
come prima. Senza quella rete un motore che rifiuta la sintassi si teneva il
`border-radius: 0` e mostrava **spigoli vivi** — peggio di non aver fatto
niente.

**I tracciati stanno su `:root`, non dentro ogni regola.** Si può fare solo
perché non contengono nessuna `var()`: una proprietà personalizzata sostituisce
le `var()` DOVE È DICHIARATA, e su `:root` i raggi dell'app non esistono. Con i
numeri dentro invece si tengono in un posto solo.

**Anche le pastiglie hanno l'angolo continuo, e per averlo si MISURANO.**
`border-radius: 99px` vuol dire «tondo quanto basta» e il browser lo taglia da
sé a metà del lato corto. Un `clip-path` no: in un poligono le percentuali si
risolvono per asse, quindi non si può dire «metà del lato CORTO», e su una
pastiglia da 300×54 il ritaglio darebbe una foglia con la punta da 151px invece
di un angolo da 27. L'unico modo di dare anche a loro la curva è sapere quanto
sono alte, e l'unico modo onesto di saperlo è aprire l'app e misurarle:
`node segni/misure.mjs` gira le cinquantuno scene di `segni/scene.json` su tre
combinazioni di larghezza e tema e scrive `segni/misure.json` col lato corto più
piccolo che ogni selettore assume. Il raggio è quel lato diviso 3.057 —
l'angolo si mangia esattamente mezzo lato, cioè lo stesso caso limite
dell'icona di iOS, una pastiglia con le estremità a supercerchio invece che a
semicerchio.
Si prende il lato più PICCOLO fra tutte le comparse: se lo stesso chip a volte
è alto 24 e a volte 32, l'angolo tarato su 24 sta dentro entrambi; al contrario
si strozzerebbe. Chi non è mai stato visto in pagina resta capsula, e il
generatore stampa l'elenco: adesso sono diciotto pastiglie che vivono in stati
dove il giro non passa — l'accoglienza al primo avvio, la guida che compare
mentre si trascina, il segnino della scadenza nel mese, la legenda della
striscia. Per farle entrare basta una scena in più in `segni/scene.json`.

**E la stessa misura taglia TUTTI i raggi, non solo quelli delle pastiglie.**
Il limite `min(px, %)` dentro il tracciato non basta: le percentuali di un
poligono si risolvono per ASSE, quindi su una barretta lunga e alta nove pixel
si stringe solo la parte verticale della curva e l'estremità viene a punta,
come una foglia. Il raggio va tagliato prima, a `lato corto / 3.057`. Prima
qui c'era una tabella scritta a mano di otto selettori «troppo piccoli»: ne
mancavano trentanove — le barrette dei grafici, le celle del calendario, i
pulsanti piccoli, le barre di sezione — e tre degli otto numeri erano
sbagliati (`.segmenti.sez-nav` aveva 17 dove ci stava 13.7). Adesso il taglio
lo fa la misura, a scalini di mezzo pixel: gli scalini rimettono insieme i
gruppi, e senza di loro un tracciato per selettore faceva crescere il foglio di
stile di un terzo.
Il taglio si applica al selettore che dichiara il raggio, e questo copre anche
le sue varianti: `.btn-mini` non dichiara nessun raggio — lo prende da `.btn` —
ma è un `.btn` anche lui, quindi entra nella misura di `.btn` e la fa
scendere.

**Il bordo si ridisegna, e quello del box si spegne SOLO a chi ha l'anello.** Un ritaglio taglia anche
il bordo del box, e proprio negli angoli: resterebbe una scheda col bordo sui
fianchi e niente sulla curva. L'anello lo ridisegna come contorno vuoto su uno
pseudo-elemento, con riempimento `evenodd`, spesso quanto il bordo che
sostituisce. Ma il bordo del box va anche spento (`border-color: transparent`,
lo spessore resta perché serve allo spazio): lasciandolo accendere, sui lati
dritti veniva dipinto DUE volte — una il box, una l'anello sopra — e i bordi di
quest'app sono traslucidi, quindi i fianchi uscivano scuri e gli angoli chiari,
con uno stacco netto dove comincia la curva.
Spegnerlo a TUTTI però è un altro difetto: quaranta elementi hanno un bordo e
nessuno che glielo ridisegni, e l'avevano perso del tutto — il filo bianco
intorno al badge, i chip, il pulsante dei filtri. Si spegne solo a chi ha
davvero il ritaglio e l'anello.

**Il contorno esterno dell'anello è un rettangolo, non la curva.** L'anello sta
dentro l'elemento ritagliato, quindi il ritaglio del padre lo taglia già lui.
Dandogli anche la curva, quel contorno veniva sfumato due volte e sulla curva
usciva più chiaro. Col rettangolo la curva la disegna il padre, una volta sola.
E il rettangolo parte da metà del lato sinistro come il contorno interno,
perché un `polygon()` è UN contorno chiuso: i due si collegano con un ponte, e
il ponte deve avere area zero o si vede — partendo da `0 0` diventava una
scheggia diagonale che apriva una fessura bianca in mezzo al fianco.

**Il ritaglio toglie SOLO i quattro morsi d'angolo.** Questa è la cosa che ha
cambiato tutto, e ci si è arrivati misurando. Un `clip-path` taglia tutto il
disegno dell'elemento, e fuori dal riquadro del bordo un elemento disegna ancora
due cose:

- `box-shadow`, l'**ombra**. L'app ne dichiara tre livelli (`--e1`, `--e2`,
  `--e3`) e li usa in centoventi punti — la scheda che si stacca dal fondo, il
  pulsante che si alza sotto il puntatore, la pastiglia accesa in un segmento.
  Con il ritaglio pieno **non se ne vedeva nessuna**: l'app era piatta senza che
  nessuno se ne fosse accorto, e su «Chiaro · Auto · Scuro» quell'ombra era
  l'unico segno di quale fosse la scelta in vigore.
- `outline`, il **contorno di messa a fuoco**. Chi navigava col Tab vedeva il
  fuoco spostarsi senza nessun segno di dove fosse arrivato.

Nessuno dei due si può ridisegnare dentro l'elemento: uno pseudo-elemento è un
discendente e il ritaglio del padre taglia anche lui (provato: un `::before` a
`inset: -10px` sotto un padre ritagliato non esce di un pixel).
`filter: drop-shadow()` nemmeno — il filtro si applica PRIMA del ritaglio,
quindi l'ombra nasce e viene tagliata via nello stesso passaggio (misurato).

Ma al ritaglio non serve togliere tutto quello che sta fuori: gli serve togliere
**quattro morsi**, uno per angolo. Quindi `poligonoAngoli()` scrive un
rettangolone (200px oltre l'elemento da ogni parte, più di qualunque ombra
dichiarata) meno le quattro zone d'angolo, ognuna chiusa fra i due lati e la
curva, con riempimento `evenodd`: dentro il rettangolone e dentro un morso fa
due, cioè fuori. Il fondo e il bordo restano ritagliati come prima — un
`background` non esce dal riquadro del bordo per conto suo — e l'ombra e il
contorno non li tocca più nessuno.

I quattro morsi non si sovrappongono mai, perché ogni coordinata è limitata a
metà del lato (`min(px, 50%)`): al massimo si toccano sulla mezzeria. Se si
sovrapponessero, l'`evenodd` li annullerebbe a vicenda e l'angolo tornerebbe
quadrato.

**E il `border-radius` torna, al 99%.** Era a zero perché il ritaglio pieno
tagliava anche il bordo del box e due angoli diversi sovrapposti non hanno
senso. Adesso serve per l'unica cosa che il ritaglio non sa fare: dare all'ombra
un angolo tondo. L'ombra si disegna dalla sagoma del box, e a raggio zero
usciva un alone quadrato attorno a una scheda tonda. Il numero è 0.99 perché a
0.995 l'arco tocca esattamente la curva di Apple sulla diagonale — misurato: il
punto della curva più vicino al vertice sta a 0.41225 raggi, e l'arco ci arriva
a 0.41421. Sotto quel valore l'arco contiene la curva **dappertutto**, quindi la
forma che si vede resta esattamente quella di Apple e l'arco lavora solo per
l'ombra. (L'ombra tiene gli spigoli dell'arco, non del supercerchio: sotto una
sfocatura da dieci pixel la differenza non esiste, e il confronto vero non è con
un'ombra perfetta ma con nessuna ombra.)

### I raggi

Sono 8, 12 e 18px (6, 10, 14 nella variante compatta) e non possono crescere:
l'angolo vuole **3.06 raggi di lato**. Provati a 11/16/24 per rendere la curva
più evidente, e trenta elementi dell'app non ci stavano più — un pulsante alto
44px non regge un raggio da 16, che ne vorrebbe 49 di lato. Questi tre numeri
sono già il massimo che le altezze attuali consentono: per angoli più generosi
bisogna prima fare più alti gli elementi.

Su chi è più piccolo di così il raggio scende da sé, alla misura presa in
pagina (`segni/misure.json`): il generatore stampa l'elenco di chi è stato
tagliato e di quanto, e sono diciotto — da `.btn` (12 → 11) a `.lm-hbar-fill`
(8 → 1.5, una barretta alta sei pixel).

### L'unica cosa che resta con l'arco di cerchio: i campi

`input`, `select` e `textarea` **non generano pseudo-elementi**. Non è una
questione di CSS scritto male: il browser non crea la scatola di
`::before`/`::after` su di loro (provato — su un `div` il colore di prova si
vede, su tutti e tre no). Quindi il bordo di un campo lo può dipingere solo il
box, e ritagliandolo verrebbe tagliato sulla curva senza nessuno che possa
ridisegnarlo: il campo resta **senza bordo del tutto**. È esattamente quello
che era successo a ogni campo di testo dell'app.

Restano quindi col loro `border-radius`. Per dargli la curva vera servirebbe un
`border-image` con un SVG a nove fette (gli angoli di un 9-slice non si
stirano) — funziona anche sui campi e non ha bisogno di pseudo-elementi, ma il
colore va cotto dentro l'SVG, quindi una copia per ogni colore di bordo e per
ogni tema. È fattibile e non è fatto.

### Chi taglia si mangia l'anello

Un `overflow` non visibile taglia al riquadro **interno**, e l'anello del bordo
sta nell'area del bordo, cioè fuori. Veniva via tutto e quegli elementi
restavano senza bordo: si vedeva sulla scheda di «Adesso» (restava solo il filo
colorato dell'area, tagliato di netto) e sulla lista delle attività, dove il
bordo del contenitore spariva e restavano quelli delle righe, di un altro
colore. Da qui i «bordi tagliati o con due colori».

Chi ha `overflow: hidden` passa a **`overflow: clip` con
`overflow-clip-margin` pari allo spessore del bordo**: taglia come prima, ma un
pixel più in fuori, cioè esattamente dove sta l'anello. (Il margine funziona
solo con `clip`: con `hidden` non ha nessun effetto, misurato.)

La prima versione invece spegneva l'overflow del tutto, e non era la stessa
cosa: ridava ai figli il diritto di sporgere, e il ritaglio glielo tagliava
comunque — la spunta nell'angolo di un blocco corto della giornata ne perdeva
un pixel, e prima quel pixel lo teneva dentro `hidden`, di proposito. Con
`clip` chi ha scritto il foglio continua a decidere cosa resta dentro.

Chi SCORRE (`overflow: auto`) non si può toccare, perché `clip` non fa un
contenitore scorrevole: per quei tre l'anello si disegna dentro il riquadro
interno, cioè il bordo appare rientrato di un pixel. Su un pannello con un filo
da 1px non si distingue, e l'alternativa era non avere bordo.

I pixel dicono che funziona: su `.focus-cuore`, `.tl-blk-att` e `.lista` il
bordo c'è in tutte e ventiquattro le direzioni, con la stessa luminanza.

### Errori che è costato caro trovare

1. `*, *::before, *::after { --sq-b: transparent }`. L'asterisco sugli
   pseudo-elementi colpisce DIRETTAMENTE l'anello, e una regola che colpisce
   direttamente batte l'eredità: il bordo non veniva ridisegnato **su nessun
   elemento dell'app**, e restava rotto in ogni angolo. Adesso l'asterisco è
   solo sugli elementi.
2. `calc(100% - 0)` non è CSS valido — da una percentuale non si può sottrarre
   uno zero senza unità — e il browser butta l'INTERA dichiarazione: il
   ritaglio diventa `none`, l'elemento resta a spigoli e l'anello, senza più
   ritaglio, dipinge un rettangolo pieno di colore sopra tutta la scheda. Il
   controllo va fatto sul valore ARROTONDATO: 0.02px non è zero, ma stampato
   diventa «0». Adesso `prove/squircle.js` passa ogni tracciato generato a
   `CSS.supports`.
3. La corrispondenza fra la lista di punti dell'angolo e gli assi del box
   cambia da angolo a angolo, perché girando in senso orario si entra da un
   lato e si esce dall'altro. Sbagliarla non dà una forma un po' storta: dà
   bandiere strappate, con un morso in un angolo e una punta in quello di
   fronte.
4. `border-color: transparent` dato a tutti i selettori con un bordo, non solo
   a quelli con l'anello: quaranta elementi hanno perso il bordo del tutto.
   Trovato con un censimento su ventuno schermate, non su nove.
5. Il bordo dipinto due volte sui lati dritti e una sola sulla curva: fianchi
   scuri, angoli chiari.
6. `border-color: transparent` dato al selettore base ma non alle sue VARIANTI
   di stato: `.btn` era nella lista, `.btn:hover` no, quindi al passaggio del
   mouse il bordo del box si riaccendeva sopra l'anello. Il bordo si illuminava
   in modo diverso a metà.
7. Il contorno interno dell'anello costruito spostando ogni punto lungo la
   propria normale: su una spezzata non dà una fascia uniforme (nei vertici la
   distanza cresce di 1/cos(θ/2)), e lo spessore ballava di quasi mezzo pixel —
   il filo sembrava disegnato a mano. Adesso i due contorni sono la stessa
   curva a raggi diversi, campionata NEGLI STESSI PUNTI: sbagliano nella stessa
   direzione e la fascia resta fra 0.98 e 1.00. Si vedeva a occhio prima che una prova lo misurasse —
   adesso `prove/squircle.js` confronta quanto è scuro il bordo sul fianco e
   sulla curva e pretende che combacino entro 12 valori su 255.

Gli ultimi quattro li ha trovati una prova sola, `prove/bordi.js`, che guarda
OGNI bordo in cinquanta schermate per cinque combinazioni di larghezza e
tema. A occhio se ne erano visti tre o quattro; lei ne ha contati settanta.

8. **Chi ha l'angolo si capiva dal NOME del selettore**, e dal nome non si può:
   `.tl-blk` dichiara l'angolo e `.tl-blk-pasto`, un'altra classe sullo STESSO
   elemento, dichiara il bordo. Nessuna regola scritta sui nomi lo vede, e quei
   blocchi avevano il bordo dipinto due volte. Adesso la domanda «questo
   elemento ha l'angolo?» si fa all'elemento, in pagina
   (`segni/misure.json`, campo `angolo`), e la regola sui nomi resta solo per
   gli STATI — `.btn:hover` in pagina non si vede mai, quindi misurarlo non si
   può.
9. **Un `select` che nel selettore non dice di essere un `select`.**
   `.sel-area-azione` e `.tl-dur` sono campi, e il generatore li trattava come
   div: a uno ha spento il bordo aspettandosi un anello che lì non può
   esistere, all'altro ha dato il ritaglio, che gli tagliava il bordo proprio
   sull'angolo. Adesso ogni regola della forma finisce con
   `:not(input,select,textarea,progress,meter)`: la domanda la risolve
   l'elemento, non il nome.
10. **lab.css si carica DOPO app.css.** Il blocco generato sta in fondo ad
    app.css, quindi a pari specificità i `border: 1px solid` di lab.css
    vincevano e riaccendevano il bordo del box sopra l'anello: sei elementi del
    Design lab col bordo doppio sui fianchi. La coda `:not(...)` del punto 9
    vale anche un punto di specificità, e li rimette in ordine senza nessun
    `!important`.
11. **L'area del dito non può venire da uno pseudo-elemento che sporge**, se
    l'elemento è ritagliato: un ritaglio taglia anche il tocco. Due comandi su
    sei si erano salvati alla prima passata; gli altri li ha trovati la prova
    che misura quello che sporge — `.lista-azione` perdeva undici pixel per
    lato, `.diario-annulla` sedici. Adesso quei due sono grandi 40px per
    davvero, col dito.
12. **Le scene possono sbagliare strada, e nessuno se ne accorge.** Il giorno
    in cui la porta delle impostazioni si è spostata dalla testa di
    «Panoramica» alla barra in basso, otto voci di `segni/scene.json` su
    quarantadue hanno smesso di aprire il pannello: il clic finiva nel vuoto e
    la scena misurava la pagina che c'era sotto. Otto misure identiche della
    stessa schermata, e nessun errore da nessuna parte — il generatore ha
    continuato a dire che andava tutto bene, `prove/bordi.js` a passare, e le
    pastiglie di Impostazioni, Backup, Primi passi, Sonno e pasti, Aree,
    Promemoria, Registro tecnico e Scienza sono rimaste archi di cerchio
    finché non le ha viste un occhio. Adesso ogni scena porta un `prova`: un
    selettore che DEVE esserci quando la scena è pronta. Se manca, la corsa si
    ferma, elenca le scene che non ci sono arrivate e NON riscrive
    `misure.json`. Alla prima passata con la rete ne ha pescate altre tre che
    erano rotte da prima.
13. **Lo pseudo-elemento di qualcun altro.** `::before` è uno per elemento, e
    `beforeOccupato` confrontava il TESTO dei selettori:
    `.nav-item.attivo::before` disegna la barretta dell'accento accanto alla
    voce di menu accesa, il gruppo della forma si chiama `.nav-item`, testi
    diversi — quindi l'anello del bordo finiva sullo stesso pseudo-elemento
    della barretta, che ne usciva a trattini col `clip-path` dell'anello
    addosso. Per un anno non si è visto perché il ritaglio pieno portava via
    tutto quello che stava fuori dal riquadro, barretta compresa: il difetto è
    comparso il giorno in cui il ritaglio ha smesso di farlo. Adesso due
    selettori si considerano lo stesso elemento se uno è l'altro più un pezzo
    attaccato senza spazi.
15. **La rete non provava la cosa che stava proteggendo.** Il blocco sta
    dentro un `@supports` che chiedeva al motore se sa fare `min()` e `calc()`
    dentro un `polygon()`. Ma ogni tracciato cominciava con `evenodd`, che
    dentro `polygon()` è un'altra funzione, e che WebKit non fa: su un iPad il
    test passava, il blocco entrava, e ogni `clip-path` finiva invalido. E qui
    la cosa peggiora, perché un valore che arriva da una `var()` e non è valido
    non fa cadere la regola — la porta a `unset`. Spariva il ritaglio
    dell'elemento, che tornava un rettangolo, e spariva quello dell'anello, che
    senza il suo ritaglio smette di essere un anello e diventa un rettangolo
    PIENO del colore del bordo, un pixel più grande dell'elemento. Rettangoli
    col colore del bordo sopra le forme tonde, e nei pannelli — dove i raggi
    sono grandi — più che altrove. Per un mese l'app su iPad si è vista così.
    Adesso `evenodd` non serve più: due contorni che girano in versi opposti
    fanno un buco anche col riempimento normale. Il morso in alto a sinistra
    gira nello stesso verso del rettangolone (le mappe degli altri tre
    scambiano o specchiano gli assi) e va percorso al rovescio; nell'anello va
    al rovescio il contorno interno. La forma sui pixel è identica, misurata.
    E `prove/squircle.js` adesso raccoglie i pezzi di sintassi che i tracciati
    usano davvero e pretende che la condizione del `@supports` li nomini tutti:
    una rete che non prova quello che protegge non è una rete.
14. **Una scena che misurava a seconda dell'ora del giorno.** La scena della
    review della sera apriva la sezione cliccandoci sopra. Ma nei Rituali la
    sezione dell'ORA è già aperta da sé — quella del mattino la mattina, il
    check-in nel pomeriggio, la review dalle 19 in poi — e su una sezione già
    aperta quel clic la CHIUDE. Lanciata di giorno la corsa misurava la review;
    lanciata di sera trovava la riga chiusa, e la rete del `prova` la fermava.
    Il rovescio era peggio, perché non fermava niente: alle 20 il check-in è
    chiuso e nessuna scena lo apriva, quindi i cinque tasti della scala da 1 a 5
    sparivano dall'elenco dei misurati e si ritrovavano un arco di cerchio al
    posto dell'angolo — un difetto che compare solo se rigeneri dopo cena.
    Adesso le scene dei rituali aprono la loro sezione SOLO se è chiusa, e il
    check-in ha una scena sua: quello che si misura non dipende più da che ora
    è quando lanci il comando.
