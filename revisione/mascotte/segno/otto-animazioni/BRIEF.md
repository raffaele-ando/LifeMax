# Animazioni di Segno: brief comune

## Il personaggio e l'app
**Segno** è la mascotte di **LifeMax**, un'app italiana per organizzarsi pensata per persone con ADHD (attività, rituali e abitudini, timer di concentrazione, giorni di fila). Segno è un **nastro segnalibro di raso**: «ti ho tenuto il segno, riprendiamo da qui». Non giudica mai.

La sua anatomia:
- corpo corallo `#d9445a`;
- un **risvolto** chiaro `#f4a3ae` in cima, che fa da sopracciglio, visiera, ciuffo o coperta. È la leva principale delle emozioni;
- occhi `#2b0f1c`, che possono essere ovali, archi felici, chiusi o abbassati;
- due **piedi**, cioè le punte della tacca a V in basso;
- colori piatti: niente contorni, niente sfumature, niente ombre tranne l'ellisse a terra.

## Riferimento approvato
`/tmp/claude-0/-home-user-LifeMax/99c3d469-10e9-545a-afc2-1ce7e01478d1/scratchpad/anim-v3/segno.html` mostra Segno che si trasforma in una coccarda per i «7 giorni di fila». L'utente l'ha approvata. Studiala prima di cominciare, sia il codice sia il video `anim-v3/segno-traguardo-v3.mp4`, da cui puoi estrarre fotogrammi con ffmpeg.

Cosa è piaciuto:
- il finale curato: si assesta con un rimbalzo, ha i suoi tempi, gli occhi vivi (sguardo e battito di ciglia), le particelle;
- una trasformazione che si vede **tutta, in continuità**.

Cosa NON è piaciuto in versioni precedenti:
- un giro di 360° di tutto il corpo, che «sembra un taglio per arrivare alla vera animazione»;
- forme che compaiono o spariscono senza un'animazione che le colleghi.

## Regole
1. **Nessun taglio.** Ogni cambio di forma o di stato è animato in continuità: niente dissolvenze tra disegni diversi, niente teletrasporti, niente salti visibili tra due fotogrammi. Se cambi modello di disegno a metà, come fa v3 passando da `segno()` a `ventaglio()`, i due disegni devono combaciare al pixel nell'istante del cambio. Verificalo con fotogrammi chiave a 10 ms l'uno dall'altro.
2. **Principi Disney:**
   - anticipazione;
   - schiacciamento e allungamento;
   - movimenti che seguono e si sovrappongono (il risvolto e i piedi arrivano in ritardo);
   - accelerazioni e rallentamenti;
   - archi;
   - assestamento con un rimbalzo smorzato.

   L'emozione deve leggersi dalla sagoma.
3. **Stile:** nient'altro che i colori di Segno, più l'oro `#f5b440` solo per particelle e scintille. Fondo `#fff6f1`.
4. **Tono:** caldo e mai colpevolizzante. Niente lacrime, niente punizioni, nessun «hai perso».
5. **Formato:** 1080×1080 a 60 fps, H.264, senza audio. Per ogni animazione scrivi nelle note un suggerimento di suono e di vibrazione.
6. **Tecnica:** usa lo stesso metodo di v3.
   - Una pagina HTML con `<svg id="scena" width="1080" height="1080">`, una costante `DURATA` e una funzione deterministica `window.render(t)`.
   - La pagina carica `<script src="base.js"></script>`. La base comune contiene: `segno(s)` parametrico, gli stati `S` (calma, guarda, carica, slancio), `mix`, le easing, `molla`, `creaBurst`/`particelle`, `stella`, `minisegno` e `ventaglio`.
   - Puoi aggiungere stati e parametri. Ad esempio gli stati di `mascotte5/nastro3.js` (concentrato, capisce, curioso, fiero, dorme, affetto, con occhi a goccia, occhi chiusi, un occhio più grande) vanno portati nel formato di `BASE`.
   - **NON modificare `base.js`**: lo usano altri agenti in parallelo. Se ti serve cambiare una funzione, copiala nella tua pagina con un altro nome.
   - Cattura con `node cattura.js tua.html chiavi 0.1,0.5,...`: crea `chiavi-tua/foglio.png`, da guardare con lo strumento Read. Per il video usa `node cattura.js tua.html video tua.mp4`. Lancia i comandi dalla cartella `anim-tutte/`.
7. **Processo obbligatorio**, lo stesso del video 3. Per ogni animazione:
   1. scrivi la sequenza secondo per secondo;
   2. costruiscila;
   3. guarda il foglio dei fotogrammi chiave;
   4. cerca soprattutto tagli, salti e pose poco leggibili, poi correggi;
   5. guarda i punti di cambio con fotogrammi ravvicinati;
   6. solo alla fine genera l'MP4, estrai una striscia di fotogrammi dal video e controllala.

   Fai almeno due giri di revisione.

## Cosa consegnare
Lavora nella cartella `anim-tutte/` e consegna, per ogni animazione:
- `NOME.html`;
- `NOME.mp4`;
- il foglio dei fotogrammi chiave finale.

Annota in `note-NOME.md`: sequenza, revisioni fatte, suono e vibrazione. Nel rapporto finale elenca i percorsi assoluti, descrivi in breve ogni animazione e indica i punti deboli rimasti.
