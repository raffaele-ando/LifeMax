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

**Le pastiglie restano capsule.** Non è un'eccezione: nel sistema di Apple una
pastiglia è una `Capsule`, con le estremità a semicerchio. E in CSS non si
potrebbe fare altrimenti — in un poligono le percentuali si risolvono per asse,
quindi non si può dire «metà del lato corto», e su una pastiglia da 300×40 il
ritaglio darebbe una foglia con la punta da 99px.

**Il bordo si ridisegna.** Un ritaglio taglia anche il bordo del box, e proprio
negli angoli: resterebbe una scheda col bordo sui fianchi e niente sulla curva.
L'anello lo ridisegna come contorno vuoto su uno pseudo-elemento, con
riempimento `evenodd`, spesso quanto il bordo che sostituisce.

**Quello che si perde è l'ombra ESTERNA:** qualsiasi ritaglio la cancella, e
anche `filter: drop-shadow` (misurato — il ritaglio si applica dopo il filtro).

### Tre errori che è costato caro trovare

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
