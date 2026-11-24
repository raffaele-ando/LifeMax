# Note animazione Segno — traguardo serie
- Avvio: Mon Nov 23 11:55:47 UTC 2026

## Parte 1 — Ricerca (passo 1)
FONTE blog.duolingo.com/streak-milestone-design-animation (LETTO):
- obiettivi: streak universale, celebrativa, condivisibile.
- metafora "on fire" non universale -> scartati schizzi Duo con s'more, candela, becher sul fuoco ("non scalabili").
- idea centrale: milestone come "power up" da videogioco: Duo cambia fisicamente. "Fire Duo" = parte più difficile.
- scelta: fenice (mito transculturale; bandiere/sigilli con uccello di profilo).
- versione precedente: Duo con palloncini numerati (50/100/365) "cute but not quite celebratory enough, energy-wise".
- processo: più passate di animazione grezza, poi rifinitura di "ritmo ed energia"; il timing conta quanto il design.
- share card quadrata con Duo infuocato. Metriche iniziali positive iOS/Android (senza numeri).
- NON cita strumenti, durate, suoni.
FONTE ricerca web (sintesi di terzi): Duo "gira in aria ed esplode in fiamma arancione"; animazioni speciali solo nei giorni milestone; claim (non verificato) +1.7% retention giorno 7.
Streak Society (Dribbble 2022): 30gg icona app Duo fenice, 100gg 3 freeze, 365gg flair.
blog streak-celebration-parties: niente sull'animazione.

## Parte 1 — Ricerca (passo 2)
- blog.duolingo.com/how-duolingo-streak-builds-habit (LETTO): nuova animazione dopo estensione streak; alt GIF: Duo appare con numero giorni, poi gira in aria ed esplode in fiamma arancione. Versione più elaborata nei milestone. TEST: animazione -> +1.7% probabilità che nuovo utente sia attivo a 7 giorni (confermato sul blog ufficiale). 7 giorni: chi li raggiunge 3.6x più probabile finire il corso. Logica: all'inizio ogni giorno pesa di più (2->3 = +50%).
- deconstructoroffun (terzi): animazioni speciali solo nei milestone; flusso: XP -> piccola celebrazione -> Continua -> fiamma a schermo pieno + contatore che sale; Perfect streak: alone giallo; share card -> 5-10x condivisioni.
- blog world-character-visemes (LETTO): Duolingo usa Rive + State Machine (stati pose + bocche, idle: blink/nods/eyebrows; stato finale di reazione).
- rive.app blog Lily: blending, 8 teste x 8 corpi = 64 movimenti, file < 1 MB.
- lottiefiles case study: Duolingo usa anche Lottie ("thousands of files") -> per la fenice lo strumento NON è documentato (Rive o Lottie: deduzione).
- LinkedIn "Inside Design Studio #3" (secondaria, non accessibile direttamente): 5 principi motion: 1 "Make people feel something", 2 "Find a rhythm" (beat anche senza suono), ... ultimo: arrivare al punto, non seppellire il payoff. Progetto Interactive Streak Unfreeze: ricreato in Rive per renderlo interattivo.
- blog shape-language: poche forme, silhouette chiare, esagerazione quasi caricaturale, "bold, bouncy, bright", spazio negativo bianco.
- Audio/aptica: nessuna fonte ufficiale per la fenice. Fonti terze: suono "chime" sulle risposte giuste; fanfara/coriandoli a fine lezione.
- Nessuna analisi fotogramma per fotogramma trovata.

## Deduzioni (motion design, non lette)
Struttura tipica: 1) anticipazione (Duo si accuccia/rannicchia, ~0.3s) 2) spin in aria con stretch verticale (~0.4s) 3) burst: fiamma che avvolge, flash, particelle/scintille radiali (~0.2s impatto) 4) hold sulla forma fenice con ali aperte, fiamme in loop 5) numero che conta in su con pop overshoot 6) assestamento in loop idle. Easing: ease-in prima dell'impatto, overshoot elastico dopo. Palette: arancio/giallo caldo su sfondo che si scalda. Emozione: "power up" da videogioco = trasformazione fisica del personaggio, non solo decorazione; il timing è il cuore.

## Parte 2 — Concept (passo 3)
Trasformazione: «Segno» diventa una COCCARDA (rosetta di nastro, quella dei premi). È la "fenice" del segnalibro:
un nastro che si plissetta in cerchio = medaglia di stoffa. Mappatura: corpo corallo -> corona plissettata esterna + due code;
risvolto chiaro -> corona plissettata interna (il rovescio del raso); occhi -> restano al centro; tacca/piedi -> le due code a coda di rondine.
Palette: #d9445a, #f4a3ae, #2b0f1c + oro caldo #f5b440 solo per particelle/raggi; fondo crema #fff6f1.
Timeline (4.5 s, 60 fps):
0.00-0.35 calma, guarda in su | 0.35-0.75 anticipazione: squash, risvolto cala sugli occhi |
0.75-1.20 stacco: stretch, salita, spin 360°, risvolto in drag | 1.15-1.40 il nastro si avvolge: Segno si rimpicciolisce al centro, la coccarda si apre a ventaglio |
1.35 CLIMAX flash + burst di mini-segnalibri e scintille, fondo si scalda | 1.40-2.2 coccarda in overshoot, code in pendolo smorzato, occhi felici |
1.95-2.5 contatore 6 -> 7 con pop + mini burst | 2.4-2.9 "giorni di fila" | 2.3 guarda il numero, 3.0 guarda te felice, 4.0 blink | fino 4.5 coriandoli cadono, respiro.

## Revisione 1 (foglio chiavi/foglio1.png)
OK: anticipazione (squash + risvolto sugli occhi), stretch, flash oro, burst, contatore 6->7, finale leggibile.
Problemi: coccarda troppo seghettata (sembra una sega/sole, non stoffa); la trasformazione è un semplice rimpicciolirsi (poco leggibile: il nastro dovrebbe AVVOLGERSI);
alone circolare con bordo netto; raggi un po' invadenti; il 7 tocca le code; Segno iniziale un po' piccolo.
Correzioni: pieghe arrotondate (smerlo) e meno numerose; il corpo si arriccia in un anello (piega -> 330°) ruotando sul baricentro; niente cerchio d'alone, fondo che vira; layout alzato.

## Revisione 2 (chiavi/foglio2.png)
OK: ora il nastro si arriccia davvero in anello durante lo spin (1.02-1.34 s) e la coccarda nasce da quell'anello: trasformazione leggibile.
Sguardo verso il numero a 2.3 s funziona; layout respirabile, il 7 non tocca più le code.
Da rifinire: pieghe ancora troppo profonde (sembra un fiore) -> smerlo più fitto e meno profondo; nel finale manca vita -> scintille che pulsano attorno alla coccarda.

## Revisione 3 e consegna
Pieghe rifatte: valle a V netta (piega) + cima arrotondata, pieghe orientate in un verso -> sembra una vera coccarda plissettata, non un fiore.
Video finale: segno-traguardo.mp4, 1080x1080, 60 fps, 270 fotogrammi, 4.5 s, H.264 crf16 (frames/ cancellata dopo il montaggio; rigenerabile con node cattura.js frames 60).
Fotogrammi chiave in chiavi/ (t0.00 ... t4.49) + fogli di contatto foglio1/2/3, striscia-video.png.
Suggerimento audio/aptica (non nel video): tick leggero a 0.75 (stacco), whoosh in salita durante lo spin, "fruscio di stoffa" 1.02-1.34, colpo + campanella a 1.36 con aptica impact medium, "tick" + nota più alta al 6->7 (2.2 s) con aptica leggera.
- striscia-video.png rigenerata dal video finale (0.7-1.5 s, ogni 3 fotogrammi).
