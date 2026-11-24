# Segno — Attesa (calma.html / calma.mp4), loop
4,0 s · 1080×1080 · 60 fps · 240 fotogrammi · H.264, senza audio. Foglio: `chiavi-calma/foglio.png`.
Sorgente: `emo-src/emo.js` + `emo-src/calma.js`.

## Sequenza
- Per tutto il giro respira (2 respiri da 2 s: si allunga inspirando, si allarga un filo espirando). Il corpo oscilla lentissimo (incl ±0,9°) e la cima segue sfasata. Il risvolto ondeggia come stoffa nell'aria, con due onde per lato (4 s e 2 s) sfasate tra sinistra e destra.
- 1.10–1.34 un battito di ciglia: chiude in 70 ms, resta chiuso 20 ms e riapre in 150 ms.
- 2.00–3.25 lo sguardo va un attimo in alto a destra, la cima lo segue appena e il risvolto si solleva di poco; poi torna da te.

## Loop senza cuciture
Ogni movimento continuo è una sinusoide con periodo di 4 s o di 2 s. Gli eventi (battito, sguardo) sono "bump" che partono e finiscono a zero con velocità nulla dentro il giro. `render()` non usa il modulo, quindi `render(4)` viene davvero calcolato.
Verifiche:
- `render(0)` e `render(4)` producono SVG identici, carattere per carattere.
- I parametri a 3.9833 / 4.0 / 4.0167 avanzano con gli stessi incrementi di 0 / 0.0167, quindi anche la velocità è continua.
- Nell'MP4 ho confrontato l'ultimo fotogramma (239) con il primo (0): PSNR 46,6 dB, contro ~50 dB tra due fotogrammi consecutivi interni. La differenza è sub-pixel (bordi), dovuta all'arrotondamento a 0,1 delle coordinate. Visto ingrandito, non si nota.

## Revisioni
1. Primo giro: rimosso il `t % DURATA` che avrebbe nascosto un eventuale salto; verificata la giunta.
2. Secondo giro: lo sguardo era troppo timido (13 px), portato a 18 px orizzontali e 9 px verticali. Controllata la striscia dell'MP4.

## Suono e vibrazione
- Suono: nessuno di default (è uno stato d'attesa). Al massimo un fruscio di stoffa quasi impercettibile ogni 2–3 giri, mai a ogni loop.
- Vibrazione: nessuna.
