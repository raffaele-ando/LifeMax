# Materiale per la revisione del colore di LifeMax

## Il prodotto
**LifeMax** è una PWA italiana per organizzarsi, pensata per persone con ADHD.
- **Cosa offre:** «una cosa alla volta» (la scheda Adesso), attività, rituali e abitudini, un timer di concentrazione, giorni di fila, aree della vita, scoperte ed esperimenti.
- **Tono:** caldo, mai colpevolizzante.
- **Riferimenti dichiarati:** Duolingo, Headspace, Brilliant, Phantom, Airbnb.
- **Mascotte:** Segno, un nastro segnalibro di raso, oggi corallo `#d9445a` con risvolto rosa `#f4a3ae`, occhi `#2b0f1c` e oro `#f5b440` per le particelle. Non è ancora nell'app: è in fase di progetto.

## Foto
Ci sono **349 foto**, tutte nella cartella `/tmp/claude-0/-home-user-LifeMax/99c3d469-10e9-545a-afc2-1ce7e01478d1/scratchpad/colori/`.

**Le foto singole** sono in due sottocartelle:
- `schermi/`: ogni schermata e scheda dell'app. Formati: telefono chiaro e scuro, tablet chiaro, computer chiaro e scuro.
- `azioni/`: l'onboarding completo e sequenze di fotogrammi presi a pochi millisecondi l'uno dall'altro. Le sequenze coprono:
  - l'attività spuntata con la festa leggera;
  - «Fatto» sulla scheda Adesso;
  - il toast;
  - il foglio che si apre;
  - «Non ce l'ho fatta»;
  - il timer in corso e in pausa;
  - i pulsanti premuti e in hover;
  - il focus da tastiera;
  - gli stati vuoti.

  Formati: telefono chiaro e scuro, computer chiaro.

**Gli indici:**
- `INDICE-TUTTO.txt` descrive ogni file.
- **I fogli** riuniscono 6–8 foto ciascuno. Sono nella sottocartella `fogli/`, il file per file è in `fogli/ELENCO.txt`. Guardali con lo strumento Read: partire dai fogli e aprire le foto singole quando serve ingrandire è il modo più rapido.

## La mascotte animata
Le animazioni di Segno (fogli dei fotogrammi chiave) sono in `/tmp/claude-0/-home-user-LifeMax/99c3d469-10e9-545a-afc2-1ce7e01478d1/scratchpad/`:
- `anim-v3/chiavi/`: il traguardo dei 7 giorni di fila, con Segno che diventa una coccarda;
- `anim-tutte/chiavi-*/foglio.png`: cosa fatta, giornata chiusa, fine concentrazione, non ce l'ho fatta, bentornato, attesa.

## Il codice del colore
- `/home/user/LifeMax/src/stile/app.css`: le variabili CSS, che iniziano con `--`, per tema chiaro e scuro, e tutto il resto.
- `/home/user/LifeMax/src/stile/lab.css`
- `/home/user/LifeMax/prove/colori.js`: la prova automatica sui colori.
- Per trovare dove sono definiti i colori delle aree, cerca «area» e i loro colori in `/home/user/LifeMax/src/dati/dati.ts` e in `/home/user/LifeMax/src/app/app.ts`.

**Non modificare nessun file del progetto:** il compito è solo di analisi.
