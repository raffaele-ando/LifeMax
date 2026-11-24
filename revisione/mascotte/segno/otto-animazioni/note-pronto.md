# Segno: PRONTO (fine dell'onboarding: «ti tengo il segno, si parte»)

File: `pronto.html` (con `base.js` e `onboarding-comune.js`), `pronto.mp4` (1080×1080, 60 fps, H.264, 2,5 s, 150 fotogrammi, senza audio), `chiavi-pronto/foglio.png`, `striscia-pronto.png` (fotogrammi estratti dall'MP4).

## Idea
Chiude il cerchio col benvenuto: Segno era uscito dal libro, ora ci si rituffa e ne riemerge con la sola parte alta sporgente, come un segnalibro infilato fra le pagine. Poi ti fa l'occhiolino.
L'ultimo fotogramma è una posa ferma e pulita (il libro con Segno che spunta e fa l'occhiolino), utilizzabile anche come immagine statica.
Il libro è lo stesso del benvenuto, con un solo neutro caldo in più (`#e8c4a0`).

## Sequenza
| s | cosa succede |
|---|---|
| 0,00–0,12 | Segno accanto al libro ti guarda (stessa posa con cui finisce il benvenuto) |
| 0,12–0,36 | guarda il libro, poi di nuovo te: «allora, andiamo» |
| 0,36–0,60 | anticipazione: si acquatta inclinandosi verso il libro, gli occhi sul punto d'arrivo |
| 0,60–1,00 | salto ad arco (Bézier): si stacca allungato col risvolto alzato, sale inclinato verso il libro, si raddrizza in volo e scende a candela sopra la fessura, guardando giù |
| 1,00–1,22 | il tuffo: chiude gli occhi ed entra dritto fra le pagine alla stessa velocità con cui arriva (curva di Hermite con pendenza iniziale uguale), poi rallenta nella carta. Il libro si schiaccia e oscilla, schizzo di mini segnalibri e scintille. Il risvolto torna giù mentre sparisce. Da 1,0 a 1,8 la camera si avvicina piano al libro (×1,3) |
| 1,22–1,40 | pausa: Segno è sparito. Il libro fa un piccolo fremito, sta per riuscire |
| 1,40–1,64 | riemerge solo con la parte alta: prima il risvolto, poi gli occhi chiusi. Va oltre il punto e torna, il risvolto scatta su e ricade |
| 1,64–1,92 | apre gli occhi su di te |
| 1,92–2,32 | occhiolino: l'occhio destro si chiude in un arco felice, il risvolto si abbassa da quel lato come un sopracciglio, il corpo si piega verso l'occhiolino e si assesta con un piccolo rimbalzo. «Ting» d'oro accanto |
| 2,32–2,50 | posa ferma finale. Le scintille si chiudono entro 2,5 s |

## Continuità (nessun taglio)
- In volo Segno sta davanti al libro. Passa dietro la copertina, ritagliato alla fessura, solo quando è già sopra la fessura e coi piedi più in alto della copertina (a 0,94 s). Ho controllato ogni 10 ms fra 0,92 e 0,97: nessun cambiamento visibile.
- Sotto le pagine (1,17–1,40) il margine fra la sua cima e la fessura è di almeno 10 px, misurato con `sonda.js`. Il cambio di postura da «tuffo» a «risalita» avviene lì, al buio.
- L'occhiolino passa da ovale a fessura a arco felice senza soglie (`segnoO`, parametro `dx`).

## Revisioni
1. **Primo foglio.**
   - Nell'accovacciamento gli occhi sparivano sotto il risvolto: ho ridotto il risvolto e portato lo sguardo in orizzontale verso il libro.
   - Lo schizzo restava sospeso fino a 1,9 s e passava davanti agli occhi: meno pezzi, più grandi, vita più breve (0,42–0,56 s).
   - Il finale era troppo piccolo nel quadrato: ho aggiunto l'avvicinamento della camera mentre Segno è sotto e l'ho fatto sporgere un po' di più.
2. **Secondo foglio.** All'apice e nel tuffo il risvolto usciva dal bordo alto (cima a 5 px): arco più basso e risvolto meno alzato. Ora la cima è sempre ad almeno 35 px.
3. **Controlli ravvicinati (10 ms)** sul passaggio dietro la copertina, sulla risalita (1,39–1,44) e sull'occhiolino (1,95–2,00): nessun salto.
4. **Striscia dall'MP4.**
   - Allo stacco i piedi dello slancio bucavano il pavimento: piedi in pari al decollo.
   - Quando era inclinato verso il libro, un piede scendeva sotto il pavimento: ora il corpo si rialza quanto serve.

## Suono e vibrazione
- 0,40: piccolo «mm-hm» strumentale (due note gravi brevi), come chi si prepara. Nessuna vibrazione.
- 0,60: «fiuu» di raso al decollo. Vibrazione selection.
- 1,00: «flap» di carta più un «plop» morbido (il tuffo fra le pagine). Vibrazione impact medium, l'unica un po' piena.
- 1,30: fruscio minimo di pagine (il fremito).
- 1,42: «pop» leggero all'insù. Vibrazione impact light.
- 1,98: «ting» chiaro di campanellino sull'occhiolino. Vibrazione success soft.
- In tutto: suoni brevi e asciutti, che finiscano entro 2,3 s così la schermata successiva parte in silenzio.

## Punti deboli rimasti
- Fra 0,6 e 0,9 s, nel volo verso il libro, Segno passa davanti al bordo destro del libro e lo copre per qualche fotogramma, prima di centrarsi sulla fessura. Si legge come «salta davanti e poi dentro», ma non è un passaggio pulito di profilo.
- La risalita è molto rapida all'inizio (circa 35 px per fotogramma nei primi due): è voluto (il «pop»), ma su schermi piccoli può sembrare uno scatto.
- Nella prima metà la scena è piccola (come nel benvenuto); si ingrandisce solo con la camera dopo 1,0 s.
