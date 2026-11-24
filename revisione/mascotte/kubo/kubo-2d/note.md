# Kubo 2D — note di lavoro

Cartella: `/tmp/claude-0/-home-user-LifeMax/99c3d469-10e9-545a-afc2-1ce7e01478d1/scratchpad/kubo-2d/`

| File | Cosa contiene |
|---|---|
| `kubo.svg` | Kubo a riposo, vettoriale, gruppi nominati con perno (`data-perno`) |
| `kubo-espressioni.png` | le 8 espressioni degli occhi, ciascuna con una posa del corpo |
| `confronto.png` | originale accanto al 2D: felice in salto, calmo, concentrato, assonnato |
| `traguardo.html` | animazione «7 giorni di fila», `window.render(t)` deterministica, file unico |
| `traguardo.mp4` | 1080×1080, 60 fps, 265 fotogrammi (4,4 s), H.264 |
| `src/rig.js` | sorgente del personaggio: palette, geometria, occhi, `applyPose()` |
| `src/anim.js` | sorgente dell'animazione: tracce a spline, molle, scena |
| `src/make-*.js`, `src/*.html`, `src/poses-*.js` | script che rigenerano SVG, tavole e pagina |
| `tools/` | script Playwright: tavole, fotogrammi, cattura, misura degli scatti (`jerk.js`) |
| `build/` | fotogrammi, strisce di controllo, tavole dei giri di revisione, galleria inviata ai revisori |
| `ref/` | i 21 PNG originali ridotti a 800 px (lasciati dall'agente precedente) |

Rigenerare tutto: `node src/make-svg.js && node src/make-html.js`; le tavole e i fotogrammi si fanno con gli script in `tools/` (Playwright + ffmpeg), es. `node tools/esp.js kubo-espressioni.png src/poses-espressioni.js src/espressioni.html`, `node tools/confronto.js confronto.png src/poses-confronto.js`, `node tools/capture.js traguardo.html build/frames 60` e poi `ffmpeg -framerate 60 -i build/frames/f%04d.png -c:v libx264 -pix_fmt yuv420p -crf 16 traguardo.mp4`.

---

## 1. Ricerca: come si fanno e si animano le mascotte delle app

### Come lavora Duolingo
- **Disegno.** L'illustrazione di Duolingo è vettoriale da anni: il team è passato dal disegno raster a software vettoriale perché scala su telefoni e tablet e accelera la produzione. Lo stile usa il minimo di forme necessario, silhouette leggibili, esagerazione dei dettagli chiave e molto spazio bianco attorno ([Duolingo blog, *Shape language*](https://blog.duolingo.com/shape-language-duolingos-art-style/)).
- **Regole dello «shape language»** (guida di design di Duolingo, oggi confluita nel blog design): solo forme con angoli arrotondati («pointy shapes are off-brand»); testa e corpo fatti di 1–2 forme base ciascuno, con forme ripetute per coerenza; occhi geometrici; pochi colori; **l'ombra a terra è una pillola, mai un ovale** («gli ovali implicano prospettiva»); i piedi di Duo «svolazzano» staccati sotto il corpo ([design.duolingo.com/illustration](https://design.duolingo.com/illustration), [hub design](https://blog.duolingo.com/hub/design/), [*How to draw Duo*](https://blog.duolingo.com/how-to-draw-duo-the-owl)). Nelle immagini di riferimento si vede la stessa grammatica: colore base piatto, una forma più scura (ali, fianco) e una più chiara (maschera del viso), niente contorni.
- **Animazione.** I personaggi dell'app sono animati in **Rive**, con le **State Machine**: un insieme di stati per le pose del corpo e uno per le bocche, che girano insieme e vengono comandati dal codice; il tutto esportato in **un solo file runtime**. Gli ingegneri attivano gli stati con i tempi dell'audio, invece di «spedire un piccolo filmato», e i personaggi fanno anche gesti a riposo come battiti di ciglia e cenni ([Duolingo blog, *World character visemes*](https://blog.duolingo.com/world-character-visemes)). Per il personaggio Lily nelle videochiamate l'animatore spiega che animare a mano ogni reazione avrebbe reso il file troppo grande: hanno usato pezzi modulari con transizioni comandate dalla state machine ([Rive blog, Lily](https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life)).

### I formati
- **Lottie / Bodymovin (After Effects).** Si anima in After Effects e si esporta in JSON con il plugin Bodymovin. Funzionano bene i livelli di forma, posizione, scala, rotazione, opacità, trim path; espressioni supportate in parte (meglio «cuocerle» in chiavi); la maggior parte degli effetti, 3D, luci e stili di livello non passano ([LottieFiles, compatibilità AE](https://docs.lottiefiles.com/en/integrations/after-effects/09_lottie-compatibility), [aescripts Bodymovin](https://aescripts.com/bodymovin/)). È un filmato vettoriale lineare: per reagire allo stato dell'app si spezzettano segmenti e si gestiscono a codice.
- **Rive.** Editor web con ossa, mesh, vincoli e **State Machine** con input (booleani, numeri, trigger) leggibili dal codice: è nato per personaggi interattivi. Il runtime web è WebAssembly. I confronti di dimensione dei file pubblicati sono quasi tutti di parte (Rive dichiara file 10–15× più piccoli del Lottie equivalente; LottieFiles cita un caso inverso) ([Rive vs Lottie, Rive](https://rive.app/blog/rive-as-a-lottie-alternative), [LottieFiles](https://lottiefiles.com/blog/working-with-lottie-animations/lottiefiles-or-rive), [Callstack](https://callstack.com/blog/lottie-vs-rive-optimizing-mobile-app-animation)). Con l'arrivo del testo il WASM è cresciuto (~261 kB brotli dalla v2) ([Rive, migrazione v2](https://rive.app/docs/runtimes/web/migrating-from-v1-to-v2)); esiste `@rive-app/canvas-lite` senza testo/layout/audio.
- **SVG animato a codice.** Nessun runtime: il personaggio è DOM SVG e lo muove TypeScript. Massimo controllo e peso minimo, ma l'animatore deve lavorare in codice (o con uno strumento fatto in casa).

### Pesi misurati qui (gzip -9, pacchetti npm scaricati in questa sessione)
| Cosa | Peso |
|---|---|
| `lottie-web` 5.13.0, `lottie_light.min.js` (solo SVG, niente espressioni) | 168 kB → **46 kB gzip** |
| `lottie-web` 5.13.0, `lottie.min.js` completo | 306 kB → 76 kB gzip |
| `@rive-app/canvas-lite` 2.31.2: `rive.js` + `rive.wasm` | 54 kB + **238 kB gzip** (WASM) |
| Kubo qui: `rig.js` + `anim.js` (personaggio + animazione completi) | **13 kB gzip** (`traguardo.html` intero: 13 kB gzip) |
| `kubo.svg` statico | 73 kB → 14 kB gzip (le curve sono esportate a 1 decimale e con molti punti: si può dimezzare) |

`render(t)` costa **0,24 ms per fotogramma** in Chromium desktop (misurato su 600 chiamate): su un telefono medio resta ben sotto i 16 ms.

---

## 2. Raccomandazione di formato per LifeMax (PWA TypeScript + Vite)

**In breve: oggi SVG animato a codice; Rive quando arriva un animatore.**

1. **Adesso: SVG + TypeScript (il rig di questa cartella).** Kubo è fatto di poche forme rigide (cubo, visore, antenna, 4 appendici staccate) e gli occhi sono il 90% della recitazione: è il caso ideale per un rig a codice. Pesa ~13 kB gzip compresa l'animazione, zero dipendenze, colori presi dalle variabili della palette (tema scuro gratis), risponde allo stato dell'app senza fatica (`applyPose`, espressioni miscelabili), funziona offline nella PWA. Si porta in `src/` come modulo TS con `prefers-reduced-motion`.
2. **Quando Kubo deve diventare davvero interattivo** (reazioni a ogni azione, guardare il cursore, parlare, decine di stati): **Rive**, come Duolingo. Costa ~290 kB gzip di runtime (una volta, in cache nel service worker) ma dà all'animatore un editor visuale e una State Machine che il codice comanda per nome. È la strada giusta a medio termine, non per una sola animazione di traguardo.
3. **Lottie lo sconsiglio come formato principale**: richiede After Effects, è lineare (le state machine ci sono solo nel nuovo dotLottie con player WASM ~500 kB), e ogni stato in più è un altro file JSON da gestire. Ha senso solo se un motion designer esterno lavora già in AE e consegna animazioni «una tantum» (es. un'illustrazione animata di onboarding).

**Cosa si può produrre qui** (Node, Playwright/Chromium, ffmpeg): il personaggio in SVG, un rig a codice, animazioni deterministiche, MP4/GIF per marketing e store, tavole PNG. **Cosa serve a un designer umano**: (a) un illustratore che rifinisca le forme in Illustrator/Figma partendo da `kubo.svg` (le curve qui sono generate da parametri, non disegnate a mano libera); (b) per Rive, un animatore che importi l'SVG nell'editor di Rive, ricostruisca gli occhi come forme con vertici animabili e costruisca la State Machine (input proposti: `espressione` numerico, `trigger` festa/saluto/occhiolino, `guarda_x/guarda_y`). L'editor di Rive non è disponibile qui, quindi un file `.riv` non si può produrre in questa sessione.

Non ho generato un Lottie JSON: non lo raccomando come formato, quindi il passo facoltativo non si applicava.

---

## 3. Il personaggio

- **Palette** in un solo posto (`PALETTE` in `src/rig.js`). Tre toni sono **derivati** per calcolo dalla palette, non scelti a mano: `bluOmbra` = blu mescolato al 42% col visore (forma d'ombra di mani, piedi, antenna), `bluLuce` = blu + 30% bianco (riflesso sulla capsula), `visoreLuce` = visore + 7% bianco (riflesso sul visore), `guance` = blu + 58% luce occhi. Se il fondatore li vuole nella palette ufficiale vanno approvati; altrimenti si possono rendere come il colore base con opacità.
- **Stile**: forme piatte, nessun contorno, nessun gradiente. Corpo bianco con **una** forma d'ombra (mezzaluna `#cbcef1` in basso a destra, ottenuta dall'intersezione fra il corpo e un'ellisse: spessa dove il volume gira, nulla in alto a sinistra) e la luce come forma sul visore e sulla capsula. Ombra a terra a **pillola** `#cbcef1`, come prescrive Duolingo; si restringe e schiarisce nel salto.
- **Gruppi nominati** (`kubo.svg`): `kubo-scena` › `ombra-terra`, `kubo` › `piede-sinistro`, `piede-destro`, `antenna` (`antenna-stelo`, `antenna-capsula`), `mano-sinistra`, `mano-destra`, `corpo` (`corpo-ombra`, `corpo-faccia`, `visore` › `visore-luce`, `guance`, `occhio-sinistro`, `occhio-destro`, `bocca`), più `scintille`. Ogni gruppo ha `data-perno`. «Sinistra/destra» = lato dello schermo. Le mani stanno dietro al corpo («cuffie», come negli originali); `handsFront` le porta davanti.
- **Occhi**: ogni forma (ovale, arco felice, linea, occhiolino, stella a 4 punte, palpebra diagonale, mezza luna, spirale, arco sereno) è un contorno chiuso ricampionato a **96 punti con lo stesso verso e lo stesso punto di partenza**; un'espressione è un insieme di pesi e la forma è la media pesata → passaggio continuo fra qualunque coppia, colore compreso (luce → oro per le stelle). Espressioni: `aperti`, `felici`, `battito`, `occhiolino`, `stelle`, `concentrato`, `assonnato`, `confuso`, più `sereno` (per «calmo»). La bocca a D e le guance seguono l'espressione.

## 4. L'animazione «7 giorni di fila» (`traguardo.html`)

- `window.render(t)` (0 ≤ t ≤ 4,4 s) è **deterministica**: le tracce sono spline di **Hermite** con tangenti **Catmull-Rom non uniformi** (velocità continua, nessuna sosta sulle chiavi); dove serve la fisica le tangenti sono imposte (la parabola del salto è esatta: le tangenti coerenti a decollo, apice e atterraggio riproducono una parabola). Le parti secondarie sono **molle integrate a passo fisso 1/480 s** e precalcolate una volta: mani e piedi inseguono il bersaglio nello spazio mondo (ritardo e sovrapposizione), l'antenna si inclina e si comprime con l'accelerazione della base (filtrata 20 ms), la capsula ha un secondo ritardo, il corpo rimbalza con una molla dopo l'impatto.
- Recitazione: 0–0,5 s calma, poi **anticipazione** (si accuccia, schiacciamento 0,80, occhi «concentrato»); **stacco** con allungamento 1,15, occhi felici, bocca aperta, mani al cielo che arrivano in ritardo, antenna che si comprime e poi oscilla; **atterraggio** a 1,30 s con impulso di schiacciamento e assestamento elastico; il **badge 7** spunta con rimbalzo, scintille oro/blu/bianche (bianche solo sul disco blu), Kubo si gira e lo guarda (occhi aperti, poi stelle); **saluto** con la mano destra (oscillazione Catmull-Rom continua + molla) e **occhiolino**; ritorno a riposo e battito di ciglia finale.
- Controlli fatti: fotogrammi chiave (`build/kf-sheet.png`), fotogrammi consecutivi a decollo e atterraggio (`build/fr-takeoff.png`, `build/fr-land.png`), misura numerica dell'accelerazione per fotogramma di 9 elementi (`tools/jerk.js`): i picchi residui sono solo i punti voluti (picco dello stiramento al decollo, impatto, battito di ciglia di 3 fotogrammi, pop del badge). Dopo il montaggio: striscia di 24 fotogrammi estratta dall'MP4 (`build/strip.png`) controllata a vista.

---

## 5. Revisione indipendente

Lo strumento Agent non era disponibile in questa sessione. Per avere un revisore **senza contesto** ho usato una sessione Claude Code nuova per ogni giro (`create_session`), a cui ho passato solo una galleria privata con: i 21 originali, le 8 immagini di riferimento Duo e le due tavole da giudicare (artifact privato `https://claude.ai/artifact/WL6QzxUWmGg6uqQyr7LuX2`). Ogni revisore ha pubblicato il giudizio come artifact privato.

### Giro 1 — fedeltà 6/10, disegno 5/10, **NON ANCORA**
([giudizio](https://claude.ai/artifact/6d4RJApDUwCrztMPv6fjmG))
Problemi: arti staccati (silhouette in 5 pezzi), pose tutte frontali e uguali, visore troppo grande (effetto televisore), ombra fatta come contorno sfalsato (doppio bordo), occhi felici sottili, guance ovunque, antenna piccola, ombra a terra statica. Le pose del confronto non avevano portatile né «seduto».
Correzioni: visore ridotto (~72% del corpo), angoli più tondi, archi felici più spessi e grandi, occhi aperti più alti, mezzaluna d'ombra senza anello, guance solo nelle espressioni felici, antenna più grossa con colletto, ombra a terra che si stringe nel salto, piedi inclinati e asimmetrici, portatile e sbuffo nel confronto. Rifiutato il consiglio di guance rosa e corpo lavanda (fuori palette).

### Giro 2 — fedeltà 6/10, disegno 5/10, **NON ANCORA**
([giudizio](https://claude.ai/artifact/9GRFBWen39Hhtwp4bq7Hti))
Problemi: pose ancora rigide, mani troppo grandi e «a guantone» invece dei mezzi dischi attaccati ai fianchi, piedi troppo visibili (silhouette alta), ombra ancora letta come copia sfalsata, bocca timida, antenna che si stacca da assonnato.
Correzioni: mani più piccole e **dietro al corpo** a metà visore (~40% coperte), piedi bassi e larghi (1,3:1) che sporgono solo per metà, corpo abbassato e più compatto, **ombra come mezzaluna d'intersezione con un'ellisse** (volume, non offset), bocca a D in felice e stelle, antenna inclinata meno nelle pose, pose con peso e squash diversi. Mantenuto il corpo bianco (vincolo della palette).

### Giro 3
([giudizio](https://claude.ai/artifact/6gRJQ2WrKBDVSeEt4bLprn)) — fedeltà 6/10, disegno 5/10, **QUASI**.
Il revisore: «Kubo si riconosce: visore navy grande, cornice bianca, antenna a fungo, arti blu staccati, gli occhi ad arco. La palette è rispettata e le ombre sono forme piatte.» Restavano: corpo troppo quadrato (serve cuscino ~1,2:1), mani e piedi piccoli e senza peso, pose che ruotano senza deformarsi, antenna con collare staccato e stelo a due toni, una punta del riflesso che usciva dal bordo del visore, silhouette debole bianco su crema, archi felici troppo pesanti.

**Correzioni applicate dopo il giro 3** (non è seguito un quarto giro: il massimo era 3; le ho verificate io a vista sulle tavole rigenerate):
- corpo più largo (492×392, ~1,25:1) con angoli inferiori più tondi; visore allargato in proporzione (~71%);
- mezzaluna d'ombra del corpo in `#cbcef1` (ombra della palette) invece di `#e2e4f6`: la sagoma ora si legge sul fondo crema;
- mani spostate in fuori (coperte ~30%), piedi più grandi (~30% della larghezza del corpo) che sporgono per metà;
- antenna: stelo in un solo tono, collare tolto, capsula inclinata al massimo ~6° rispetto allo stelo nelle pose;
- riflesso del visore ritagliato sulla forma del visore (sparita la punta sul bordo);
- archi felici più sottili (−25%) e più aperti.
Le tavole del giro 3 così come le ha viste il revisore sono in `build/esp-r3-reviewed.png` e `build/confronto-r3-reviewed.png`; quelle dei giri 1 e 2 in `build/esp-r1.png`, `build/confronto-r1.png`, `build/esp-r2.png`, `build/confronto-r2.png`.

**Giudizio finale del revisore (giro 3): QUASI** — «La base grafica e la palette sono giuste e il personaggio è riconoscibile. Prima di approvare servono il corpo più largo, arti più grandi e di misura fissa, pose con squash e stretch e la correzione dei tre errori di costruzione (antenna, bordo del visore, collare).» Corpo, arti, antenna, bordo del visore e collare sono stati corretti dopo; la deformazione per posa resta parziale (vedi punti deboli).

---

## 6. Punti deboli noti

- **Le curve non sono «di mano»**: sono superellissi e contorni parametrici levigati con Catmull-Rom. Sono pulite e coerenti, ma un illustratore in Illustrator/Figma darebbe più carattere (asimmetrie volute, tensione delle curve). `kubo.svg` è un buon punto di partenza da ridisegnare, non il master definitivo.
- **Vista quasi frontale**: il «tre quarti» è simulato spostando visore, antenna e mezzaluna d'ombra (`turn`). Gli originali sono spesso in prospettiva; un vero 3/4 richiede disegni dedicati per vista (come fa Duolingo con pose diverse).
- **Deformazione per posa parziale**: le pose usano rotazione, squash/stretch globale e «turn», ma non disegni dedicati del corpo per posa (piegato, seduto vero). È il limite principale rispetto a Duo, ed è lavoro da illustratore.
- **Mani senza braccia** sollevate sopra la spalla restano un po' «fluttuanti» nel saluto: è nello stile di Kubo (appendici staccate) ma va calibrato a occhio da un animatore.
- **Toni derivati** (`bluOmbra`, `bluLuce`, `visoreLuce`, `guance`) non sono nella palette ufficiale: da approvare.
- **Il badge «7»** è un elemento grafico di servizio (disco blu, 7 oro a tratti tondi, testo Inter): andrebbe integrato col design system dell'app.
- **Il testo «giorni di fila»** usa il font Inter installato qui; nella PWA va caricato il font dell'app.
- **`kubo.svg` pesa 73 kB** (14 kB gzip) per l'alta densità di punti: si può semplificare senza perdita visibile.
- Le scintille bianche si vedono solo sul disco blu: sul fondo chiaro il bianco sparisce, per scelta resto dentro la palette.
