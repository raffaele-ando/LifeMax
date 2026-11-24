# Segno: BENVENUTO (schermata iniziale dell'onboarding)

File: `benvenuto.html` (con `base.js` e `onboarding-comune.js`), `benvenuto.mp4` (1080×1080, 60 fps, H.264, 3,0 s, 180 fotogrammi, senza audio), `chiavi-benvenuto/foglio.png`, `striscia-benvenuto.png` (fotogrammi estratti dall'MP4).

## Idea
Segno è un segnalibro, quindi si presenta uscendo da un libro: sbuca dalla fessura fra le pagine, si guarda intorno, salta fuori, atterra, ti guarda e ti saluta alzando il risvolto come un cappello.
Il libro è disegnato a forme piatte e usa un solo colore in più, un neutro caldo (`#e8c4a0`). Per le pagine usa i colori già nella famiglia (fondo `#fff6f1`, righe `#f3dcd6`).

## Sequenza
| s | cosa succede |
|---|---|
| 0,00–0,22 | un libro chiuso, in piedi, inquadrato da vicino (×1,2). Bussa due volte da dentro: si inclina e si schiaccia |
| 0,24–0,52 | Segno sale dalla fessura a occhi chiusi, col risvolto trascinato in giù; va oltre il punto e torna (overshoot), il risvolto scatta su e ricade |
| 0,52–0,90 | apre gli occhi e sbircia a sinistra, poi a destra. Due scintille. Intanto la camera si allarga piano fino all'inquadratura intera (0,45–1,0) |
| 0,90–1,00 | anticipazione: si acquatta nella fessura e guarda in alto a destra |
| 1,00–1,58 | salto ad arco: esce dritto, sale allungato col risvolto alzato e i piedi che seguono, piega in avanti, poi guarda giù dove atterra. Il libro rincula con una molla |
| 1,58–1,98 | atterra: schiacciamento, occhi strizzati; il risvolto arriva in ritardo e gli cade sugli occhi come un cappello calato, poi rimbalzo smorzato fino alla calma |
| 1,86–2,12 | ti guarda: gli occhi salgono su di te e si ingrandiscono, il risvolto si alza come sopracciglia, poi un battito di ciglia |
| 2,12–2,72 | saluto: piccola anticipazione, saltello; il risvolto si solleva di lato come un cappello, gli occhi diventano felici e partono tre scintille d'oro. Poi ricade, si rimette il «cappello» con una piccola oscillazione |
| 2,72–3,00 | riapre gli occhi su di te e resta fermo (respiro minimo): posa finale |

## Continuità (nessun taglio)
- Segno esce davvero dal libro: è ritagliato con una `clipPath` alla linea della fessura. Il ritaglio e l'ordine dei livelli (prima dietro la copertina, poi davanti) cambiano solo quando i piedi sono già sopra la fessura e la copertina (a 1,11 s), quindi il cambio non si vede. L'ho verificato con fotogrammi ogni 10 ms fra 1,08 e 1,14.
- `segnoO` è una copia rinominata di `segno()` (`base.js` è intatto), con due correzioni:
  - il risvolto si disegna sempre sopra il corpo e la sua curva passa per lo zero senza scatto. In `segno()` l'ordine dei livelli si invertiva quando il risvolto passava da abbassato ad alzato, e nel saluto si vedeva uno scatto rosa di circa 20 px;
  - gli occhi passano in modo continuo da aperti a chiusi a felici, con un parametro `felici` da 0 a 1 invece di una soglia.
- Le camere sono zoom e spostamenti continui (eIO), mai stacchi.

## Revisioni
1. **Primo foglio.**
   - Dal libro spuntava un filo rosa già a t = 0: ho fatto partire Segno più in fondo.
   - Nell'anticipazione gli occhi sparivano sotto il risvolto: ho ridotto l'accovacciamento e il risvolto.
   - Il cappello si leggeva poco: ho reso il risvolto più asimmetrico ([-40,-6]).
2. **Fotogrammi a piena risoluzione.**
   - Il libro sembrava una scatola. L'ho ridisegnato di tre quarti: copertina di dietro sfalsata, blocco delle pagine visibile in alto e a destra, dorso con nervature, etichetta.
   - Il salto usciva dall'inquadratura in alto: ho abbassato il terreno a 880, ridotto l'allungamento e alzato l'arco con una curva di Bézier che esce dritta dalla fessura.
   - In uscita lo spostamento orizzontale partiva troppo presto e Segno «scivolava» fra le pagine: ora parte dopo.
3. **Controlli ravvicinati (10 ms)** sul cambio di ritaglio, sull'atterraggio, sul cambio di segno del risvolto e sul passaggio occhi felici → occhi aperti.
   - Ho trovato lo scatto del risvolto descritto sopra e l'ho corretto in `segnoO`.
   - Ho aggiunto la camera iniziale (libro centrato e più grande).
4. **Striscia dall'MP4.** Il piede scendeva sotto il pavimento quando Segno era inclinato e al contatto dell'atterraggio. Corretto: piedi in pari all'impatto e corpo rialzato quanto serve quando è inclinato.

## Suono e vibrazione
- 0,05 e 0,15: due «toc» di legno sordo, morbidi (qualcuno bussa dentro il libro). Nessuna vibrazione.
- 0,30: fruscio di carta breve, che sale (pagine). 0,52: «plin» leggerissimo per le scintille.
- 1,00: «fiuu» di raso che si alza. Vibrazione leggera (selection) al decollo.
- 1,58: «pof» morbido d'atterraggio. Vibrazione impact light.
- 2,07: nessun suono (battito di ciglia).
- 2,30: due note brevi che salgono, tipo «ta-dà» con xilofono o celesta, più tre micro scintillii. Vibrazione: due tocchi leggeri (success soft).
- Volume complessivo basso: è la prima schermata e non deve spaventare.

## Punti deboli rimasti
- Nella seconda metà la composizione resta nella metà bassa del quadrato (terreno a 880), perché all'apice del salto serve spazio sopra. Se l'MP4 va in un riquadro più basso, conviene ritagliarlo in alto o scalarlo.
- Il cappello alzato è leggibile ma resta un'astrazione: il risvolto che si solleva di lato, con i bordi dritti.
- Il «bussare» del libro dura appena 0,2 s: a velocità piena si percepisce più come un fremito che come due colpi distinti.
