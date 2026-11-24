# Segno — «Non ce l'ho fatta» (capisce.html / capisce.mp4)
3,0 s · 1080×1080 · 60 fps · H.264, senza audio. Foglio: `chiavi-capisce/foglio.png`.
Sorgente: `emo-src/emo.js` (copia estesa di `segno()`, base.js non toccato) + `emo-src/capisce.js`, unite da `emo-src/build.sh`.

## Sequenza
- 0.00–0.15 calma, respira, ti guarda.
- 0.15–0.42 anticipazione: respira dentro e si tira appena indietro.
- 0.42–1.15 si piega verso di te nella curva a C di «capisce» (piega −22, incl 6), lento ease in-out. Gli occhi diventano gocce a partire da 0.55, il risvolto arriva per ultimo (0.58–1.25), come stoffa che segue.
- 1.12–1.50 il risvolto cala sugli occhi come una palpebra comprensiva.
- 1.45–2.14 due cenni lenti: la cima si piega e il corpo si accorcia; il secondo cenno è più piccolo. Il risvolto segue con 90–110 ms di ritardo.
- 2.10–2.55 si raddrizza. Il risvolto torna su con un piccolo rimbalzo smorzato e gli occhi passano da goccia a sorriso calmo in continuità (stessa forma interpolata).
- 2.42–2.75 «si mette di segno»: un piccolo affondo, i piedi si allargano e un assestamento smorzato, come un segnalibro che si sistema fra le pagine.
- 2.75–3.00 fermo e sorridente, respira.
Niente particelle, niente lacrime. La tristezza resta solo nelle gocce degli occhi e dura meno di un secondo prima del cenno e del sorriso.

## Revisioni
1. Primo giro: con gli archi felici fatti dalla forma a ellisse le estremità erano verticali, «a ferro di cavallo». Ho aggiunto il parametro `arco`, con le maniglie della parabola di base, e ora coincidono con il `q7 -10 14 0` originale. Ho controllato goccia→sorriso a 60 ms l'uno dall'altro (2.20–2.50): continuo.
2. Secondo giro: inclinandosi, un piede affondava nel pavimento. Ora `poni()` tiene la punta più bassa sul suolo. Ho reso più leggibile il «mettersi di segno» (affondo più marcato, ondeggiamento smorzato, S che si assesta) e ho controllato la striscia dell'MP4.

## Suono e vibrazione
- Suono: un «mm-hm» di due note discendenti e morbide (legno/marimba ovattata, ~120 ms l'una) sui due cenni (1.6 s e 1.95 s), poi un fruscio di carta leggerissimo all'assestamento (2.5 s). Volume basso, niente accordi minori.
- Vibrazione: due tocchi molto leggeri (intensità ~0.3, 15 ms) sui cenni, uno morbido (0.4, 25 ms) a 2.5 s quando si mette di segno.
