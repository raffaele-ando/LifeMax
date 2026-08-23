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

In questa cartella ci sono anche i quattro pezzi che fanno il supercerchio, che
non c'entra con i segni ma vive di formule come loro.

- **`prova-tracciato.mjs`** — il generatore, e solo lui: dati i quattro raggi
  restituisce il poligono pieno e l'anello del bordo. Sta a parte perché una
  prova deve poterlo chiamare senza che nessuno scriva un file.
- **`squircle.mjs`** — riscrive il blocco alla fine di `assets/app.css`: legge
  chi ha un angolo, raggruppa per raggio, azzera il `border-radius` e mette la
  curva nel `clip-path`. Si rilancia con `node segni/squircle.mjs` ogni volta
  che si cambia un raggio o si aggiunge un elemento con l'angolo tondo.
- **`superellisse.mjs`** e **`poligono.mjs`** — la stessa curva come tracciato
  SVG e come poligono singolo, per il logo e per le icone.
- **`anello.mjs`** — il bordo. Un ritaglio taglia anche il bordo del box, e
  proprio negli angoli: l'anello lo ridisegna come contorno vuoto su uno
  pseudo-elemento, con riempimento `evenodd`.

Le **pastiglie** restano col loro raggio, e non è una resa: in un poligono le
percentuali si risolvono per asse — `50%` in una x è metà della larghezza, in
una y metà dell'altezza — mentre `border-radius`, quando il raggio non ci sta,
lo taglia con lo STESSO fattore su tutti e due. Su una pastiglia da 300×40 il
nostro `min(99px, 50%)` darebbe 99px in orizzontale e 20 in verticale: non un
supercerchio, una foglia. E una pastiglia non è un rettangolo con gli angoli
arrotondati — i suoi fianchi sono tangenti a due semicerchi interi, è una forma
sua. Dove `corner-shape` c'è, il generatore glielo chiede e il browser fa il
supercerchio da sé, che il raggio lo sa tagliare come si deve.

Perché un poligono e non `corner-shape: squircle`, che sarebbe una riga sola:
`corner-shape` esiste solo su Chromium 139 e oltre. Su Safari e Firefox non
c'è, e restavano rettangoli arrotondati. Il poligono va su tutto.
Quello che si perde è l'ombra ESTERNA: qualsiasi ritaglio la cancella. Qui
costa poco, la separazione la fanno i bordi da 1px.
