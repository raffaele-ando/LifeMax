# Segno — Bentornato (bentornato.html / bentornato.mp4)
3,5 s · 1080×1080 · 60 fps · H.264, senza audio. Foglio: `chiavi-bentornato/foglio.png`.
Sorgente: `emo-src/emo.js` + `emo-src/bentornato.js`. Nessun riferimento alla serie: solo gioia di rivederti.

## Sequenza
- 0.00–0.75 dorme. È lo stato «dorme» di nastro3, girato un poco verso di te perché si veda l'occhio (piega 75, incl −20): risvolto calato come una coperta, occhi chiusi, respiro lento (1,25 s).
- 0.72–1.10 si raggomitola un filo (anticipazione del risveglio).
- 0.95–1.24 apre l'occhio sinistro: prima assonnato, a mezza palpebra, poi del tutto. Lo sguardo si guarda intorno.
- 1.00–1.50 comincia a sollevarsi e la coperta-risvolto scivola via.
- 1.30–1.42 apre anche l'altro occhio.
- 1.34–1.86 si stira: si allunga oltre la verticale (sy 1,15, sx 0,88), il risvolto si alza come braccia, gli occhi si strizzano nello sbadiglio e al culmine arriva un tremito.
- 1.94–2.24 si rilassa in calma; il risvolto ricade con un rimbalzo.
- 2.18–2.34 ti riconosce: occhi più grandi del 22% con un piccolo pop, il risvolto si alza come sopracciglia.
- 2.36–2.56 anticipazione: si schiaccia, i piedi si allargano.
- 2.56–2.78 saltello di gioia: si allunga alla spinta, i piedi restano indietro, arco parabolico di 74 px, gli occhi diventano felici, il risvolto si alza.
- 2.78 atterra: si schiaccia con un rimbalzo smorzato.
- 2.82–3.42 saluta: un'onda passa da un lato all'altro del risvolto e la cima ondeggia, smorzandosi.
- 3.42–3.50 fermo, felice.

## Revisioni
1. Primo giro: con l'incl −26 di nastro3, nel sonno un piede affondava nel suolo e l'altro galleggiava. Ho aggiunto l'appoggio sulla punta più bassa. L'occhio che si apre per primo era nascosto sotto il risvolto, quindi ho creato la posa DORME (risvolto asimmetrico [16,30]), che lascia vedere l'occhio sinistro chiuso.
2. Secondo giro: tra 1.52 e 1.56 il raddrizzamento era troppo brusco (cubica ripida a metà). Ora usa un'easing sinusoidale su una finestra più lunga; ho anche ritardato l'apertura del secondo occhio dopo che la coperta si è sollevata e ampliato l'onda del saluto. Ho controllato a 10 ms i tre punti in cui il risvolto passa da davanti a dietro il corpo (1.569, 2.095, 2.477): nessun salto.

## Suono e vibrazione
- Suono: un respiro lento appena udibile nel sonno; un «plin» piccolo a ogni occhio che si apre (due note salenti, 1.0 s e 1.35 s); uno sbadiglio-stiramento fatto con un glissando morbido verso l'alto (1.4–1.85 s); al riconoscimento (2.2 s) un «oh!» di campanella; il salto con un «boing» corto e l'atterraggio con un tonfo di stoffa (2.78 s); il saluto con un trillo leggero di tre note.
- Vibrazione: un tocco leggero alla sveglia (1.0 s); un doppio tocco allegro (0.5 e 0.7 di intensità, a 60 ms di distanza) all'atterraggio a 2.78 s.
