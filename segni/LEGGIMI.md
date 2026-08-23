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
- **`icone.mjs`** — rifà l'icona dell'app, il logo dentro `icons.js` e tutte le
  PNG. `node segni/icone.mjs`.

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
`node segni/altezze.mjs` gira ventuno schermate su due larghezze e scrive
`segni/altezze.json` col lato corto più piccolo che ogni selettore assume. Il
raggio è quel lato diviso 3.057 — l'angolo si mangia esattamente mezzo lato,
cioè lo stesso caso limite dell'icona di iOS, una pastiglia con le estremità a
supercerchio invece che a semicerchio.
Si prende il lato più PICCOLO fra tutte le comparse: se lo stesso chip a volte
è alto 24 e a volte 32, l'angolo tarato su 24 sta dentro entrambi; al contrario
si strozzerebbe. Chi non è mai stato visto in pagina resta capsula, e il
generatore lo dice.

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

**Quello che si perde è l'ombra ESTERNA:** qualsiasi ritaglio la cancella, e
anche `filter: drop-shadow` (misurato — il ritaglio si applica dopo il filtro).

### I raggi

Sono 8, 12 e 18px (6, 10, 14 nella variante compatta) e non possono crescere:
l'angolo vuole **3.06 raggi di lato**. Provati a 11/16/24 per rendere la curva
più evidente, e trenta elementi dell'app non ci stavano più — un pulsante alto
44px non regge un raggio da 16, che ne vorrebbe 49 di lato. Questi tre numeri
sono già il massimo che le altezze attuali consentono: per angoli più generosi
bisogna prima fare più alti gli elementi.

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

Chi ha `overflow: hidden` e un ritaglio non ne ha più bisogno — il ritaglio
arrotonda i figli meglio di lui — e allora si spegne. Chi SCORRE
(`overflow: auto`) non si può toccare: per quei pochi l'anello si disegna
dentro il riquadro interno, cioè il bordo appare rientrato di un pixel. Su un
pannello con un filo da 1px non si distingue, e l'alternativa era non avere
bordo.

`overflow-clip-margin` sembrava la via pulita e non lo è: funziona solo con
`overflow: clip`, non con `hidden` né con `auto` (provato).

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
