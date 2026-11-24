# LifeMax: identità di marca e colore

*Il punto di vista di questo rapporto: brand e teoria del colore. Le foto citate sono in `colori/schermi/`, `colori/azioni/` e `colori/fogli/`; i fogli di Segno sono in `anim-tutte/` e `anim-v3/`. Ho misurato i valori campionando i pixel delle foto e li ho confrontati con `src/stile/app.css`, `src/dati/dati.ts`, `src/app/moto.ts` e `src/app/illustrazioni.ts`. Le distanze di colore sono ΔE76 in CIELAB; i contrasti seguono WCAG.*

---

## 0. In breve

1. **L'app oggi non ha un colore di marca: ha un colore di default.** Il primario visibile è un indaco elettrico, `#5b4ff5`: tinta 303°, croma 97, il colore più saturo dell'app. Dista ΔE 18 dall'indigo-500 di Tailwind (`#6366f1`), cioè è praticamente lo stesso colore. Insieme al logo (un quadrato indaco con una freccia che sale) e al fondo grigio-lilla, dà la faccia del template SaaS.
2. **Il codice contraddice sé stesso su tre livelli.** L'intestazione parla ancora del gradiente «Momentum». Il commento successivo sceglie l'«inchiostro di petrolio» `#17323f`. Poi una «seconda pelle» a riga 4422 sovrascrive tutto con l'indaco. Le ragioni scritte per l'inchiostro («un accento di qualunque tinta sembrerebbe una nona area») sono diventate vere: l'indaco ha **la stessa identica tinta (303°) dell'area Lavoro** `#4a3aa7`.
3. **Nel momento che conta, la marca non c'è.** Sulla scheda Adesso il pulsante principale («Fatto») è verde, la carta prende la tinta dell'area, la fiamma è arancio e l'icona del piano è gialla. Su una schermata che promette «una cosa alla volta» si vedono 5 tinte.
4. **Segno (corallo `#d9445a`) non ha niente in comune con l'app attuale.** Litiga con l'indaco: sono due identità diverse. È a ΔE 14 dal rosso di errore `#d03b3b` e a ΔE 14 dall'area «Altro» `#e34948`. Il suo oro `#f5b440` è quasi il giallo di avviso `#fab219` (ΔE 12). Segno è disegnato su un fondo caldo `#fff6f1`, l'app usa un fondo freddo `#f7f6fb`. In più, nell'app esiste già una *seconda* mascotte: una pallina indaco sorridente negli stati vuoti.
5. **Raccomandazione: Direzione A, «Corallo Segno».** Segno diventa la marca e il corallo è il colore primario, usato con parsimonia. I neutri diventano caldi. L'errore viene spostato verso il mattone. L'area rossa e la fiamma arancio vengono ricolorate. Così marca e mascotte coincidono, come fanno Duolingo, Headspace e Phantom.

---

## 1. La palette reale

### 1.1 Cosa si vede davvero (misurato sulle foto)

Ho analizzato tutte le schermate in `schermi/` (213 foto, 5 formati), riducendole a 1/3 e classificando ogni pixel per tinta. Un pixel conta come neutro se lo scarto tra il canale più alto e il più basso è sotto 28, quindi anche le tinte molto chiare (carta Adesso, pastiglie lilla) contano come neutre.

| Formato | Neutri | Colore | Indaco/viola | Verde | Arancio/giallo | Blu | Rosso |
|---|---|---|---|---|---|---|---|
| tel-light | 96,1% | 3,9% | **55%** del colore | 26% | 13% | 4% | 3% |
| tel-dark | 96,4% | 3,6% | **51%** | 28% | 14% | 5% | 3% |
| pc-light | 97,9% | 2,1% | **49%** | 25% | 17% | 7% | 2% |
| pc-dark | 97,7% | 2,3% | **59%** | 23% | 11% | 6% | 1% |
| tab-light | 97,2% | 2,8% | **51%** | 24% | 18% | 5% | 2% |

**Le dominanti, in ordine:**
1. il neutro grigio-lilla freddo;
2. l'indaco `#5b4ff5`: pulsante «+», tab attiva, «Aggiungi», interruttori, «Continua»/«Inizia»;
3. il verde `#0a7a42` / `#16b364`: «Fatto», barra della giornata, anelli delle abitudini;
4. l'arancio-pesca: la fiamma dei giorni di fila, l'icona del piano, la carta Finanze.

**Valori campionati** su `schermi/oggi-adesso__tel-light.png` e `__tel-dark.png`:

| Elemento | Chiaro | Scuro |
|---|---|---|
| Fondo pagina | `#f6f5fa` | `#0d0d0e` |
| Carta Adesso (area Studio) | `#eaf2fb` | `#222933` |
| «Fatto» | `#0a7a42` | `#0f7a2e` |
| Pastiglia dei giorni di fila | `#fce8e1` | `#3b2721` |
| «+» | `#5b4ff5` | `#5f55e6` |
| Avatar | `#e5e3fd` | `#2e2d42` |
| Barra di avanzamento | `#16b364` | |
| Icona «Pianifica» | `#feedc8` | |

### 1.2 Cosa dice il codice (`src/stile/app.css`, valori che vincono a cascata)

| Ruolo | Chiaro | Scuro | Note |
|---|---|---|---|
| `--accento` | `#5b4ff5` (r. 4425) | `#8f87ff` (r. 4438) | sovrascrive `#17323f` (r. 57) e `#d7e6e9` (r. 207) |
| `--accento-pieno` | `#5b4ff5` | `#5f55e6` (r. 5383) | nello scuro il pieno è diverso dal testo |
| `--accento-testo` | `#4a3fe0` | `#a9a3ff` | |
| `--pagina` | `#f7f6fb` (lilla freddo) | `#0e0e0f` (r. 5453) | definito 2 volte nel chiaro e 4 nello scuro |
| `--ok` / `--ok-pieno` | `#16b364` / `#0a7a42` | `#0ca30c` / `#0f7a2e` | due verdi diversi per lo stesso pulsante nei due temi |
| `--critico` / `-pieno` / `-testo` | `#d03b3b` / `#a32222` / `#a32222` | `#e85c56` / `#b3342c` / `#ff9d97` | |
| `--avviso` | `#fab219` | | |
| fiamma dei giorni di fila | `#eb6834` scritto a mano (r. 1308, 1138, 2778, 4321…) | `#ff9a62`, `#f97316` | |
| aree (dati.ts r. 210-217) | 8 tinte piene | 8 tinte schiarite | |

### 1.3 Le aree (`src/dati/dati.ts`)

| Slot | Area | Chiaro | LCh (L, C, h) | Nota |
|---|---|---|---|---|
| 1 | Studio | `#2a78d6` | 50, 56, 280 | |
| 2 | Salute | `#008300` | 47, 73, 136 | |
| 3 | Relazioni | `#e87ba4` | 65, 47, 357 | parente del risvolto di Segno |
| 4 | Finanze | `#eda100` | 72, 78, 76 | parente dell'oro di Segno |
| 5 | Associazioni | `#1baf7a` | 64, 52, 161 | |
| 6 | Founder | `#eb6834` | 60, 71, 48 | **identico** alla fiamma dei giorni di fila (ΔE 0) |
| 7 | Lavoro | `#4a3aa7` | 32, 68, 303 | **stessa tinta** dell'accento indaco |
| 8 | Altro / Esplorazione | `#e34948` | 54, 69, 30 | **un rosso da errore** a ΔE 14 da Segno |

### 1.4 Quante tinte ci sono in giro

- `app.css`: **102 esadecimali unici**, 46 `rgb/rgba` e 151 `color-mix`.
- Rossi diversi: `#d03b3b #a32222 #e85c56 #ff9d97 #b3342c #d1242f #e5484d #c62f2f`, più `#b3261e #a52a1f` in `lab.css`.
- Arancio diversi: `#eb6834 #f0913f #c04d1f #c2410c #f97316 #b4470f #ff9a62 #f08a24`.
- Ambra diversi: `#fab219 #e8a317 #7a5200 #8a5c00`.
- Verdi: `#0ca30c #16b364 #0a7a42 #0f7a2e #006300`.
- Tinte distinte che l'utente incontra: 1 primaria, 3 semantiche (verde, rosso, ambra), 8 aree, la fiamma, il blu dei grafici (`--serie-1 #2a78d6`, uguale all'area Studio) e, in futuro, i 3 colori di Segno: **circa 14 famiglie**.

### 1.5 Dove codice e immagini divergono

| # | Divergenza | Dove |
|---|---|---|
| 1 | L'intestazione di `app.css` (r. 1-8) parla del gradiente «Momentum» viola→blu→ciano, abolito. Il commento r. 14-30 dichiara l'accento «inchiostro» `#17323f`. Le foto mostrano indaco ovunque. | Tre intenzioni di marca nello stesso file, l'ultima vince «perché sta in fondo». |
| 2 | I coriandoli usano ancora il vecchio gradiente (`#7c5df0 #4a7bf5 #2ab8e8`) più verde, ambra e rosa. | `src/app/moto.ts` r. 49; visibili in `azioni/az-adesso-fatto-0600ms__tel-light.png` e `ob-5-pronto-0500ms__tel-light.png`. |
| 3 | Un altro set di coriandoli (`#ff5a5f #ffb400 #00c781 #3b82f6 #a855f7 #ff7ac6`). | `moto.ts` r. 8 |
| 4 | La mascotte attuale degli stati vuoti è una sfera indaco con gradiente `--brand-a/b/c`. | `illustrazioni.ts`; `azioni/vuoto-oggi__tel-light.png`, `ob-5-pronto-2000ms__tel-light.png` |
| 5 | La pelle «arcade» (rosa `#f43f8e`, viola `#8b5cf6`, ciano `#22d3ee`) è ancora definita. | `app.css` r. 242 |
| 6 | Il laboratorio ha una sua palette blu (`#3f4fd0`, `#1c56c9`). | `lab.css` r. 98, 208 |
| 7 | Sul computer chiaro si vede ancora un alone lilla di «aurora» nell'angolo. | `fogli/schermi-pc-light-05.png` |
| 8 | Le sequenze «Non ce l'ho fatta» mostrano tutti i fotogrammi identici: il foglio non compare. Non ho potuto valutare il colore di quel momento. | `azioni/az-mancata-0400ms__tel-light.png`, `-0900ms` |

---

## 2. Armonia

**Schema.** Non c'è uno schema scelto, ma ne è venuto fuori uno per caso. Indaco (303°), verde (152°) e arancio (48°) stanno a circa 150° e 105° l'uno dall'altro: una specie di triade irregolare, o di complementare diviso. Ognuno dei tre ha un mestiere diverso (azione, fatto, giorni di fila), quindi i tre colori più usati sono tre identità e nessuno è «la» marca. Le 8 aree coprono tutta la ruota, perciò qualunque accento cade vicino a una di loro, e l'indaco ci è caduto sopra.

**Temperatura.** Il telaio è freddo: fondo lilla `#f7f6fb`, indaco, scuro grigio-neutro. Gli accenti di contenuto sono caldi: fiamma, Finanze, pesca. Il risultato è un'app «da ufficio» con adesivi caldi sopra. Il tono dichiarato («caldo, mai colpevolizzante») oggi vive solo nei testi, non nel colore.

**Saturazione e valori.**
- L'indaco ha croma 97: è il colore più acceso dell'app ed è usato per i comandi più banali («+ Oggi», «Aggiungi», interruttori). La saturazione massima finisce sulle cose minime.
- Il verde «Fatto» (L 45, C 48) è più sobrio dell'indaco, eppure è il pulsante più importante.
- I valori sono sani: AA rispettato quasi ovunque, la gerarchia del testo funziona.
- Nello scuro, `#8f87ff` sul nero fa 6,5:1. Bene.

**60-30-10.** La regola non c'è. La proporzione reale è circa **96 / 0 / 4**: tutto neutro, nessun colore secondario di superficie, e un 4% di colore spezzato in 3-5 tinte. Manca il «30»: una superficie o un tono che dica «questa è LifeMax» anche quando non c'è un pulsante in vista. Per questo l'app si riconosce solo dal logo, e il logo è generico.

**Colore riconoscibile?** No. Indaco su bianco con angoli tondi è il default di Tailwind, Linear, Stripe e di mille generatori di interfacce. Il commento in `app.css` lo sapeva («the most common AI design fingerprint») e ha tolto il gradiente, ma l'indaco pieno lascia la stessa impronta.

---

## 3. Psicologia del colore e ADHD

**Calma vs stimolo.**
- La base neutra al 96% è una scelta giusta per l'ADHD: meno rumore, la gerarchia si legge.
- Il problema è la **densità di tinte nei punti caldi**. `schermi/oggi-adesso__tel-light.png` ha 5 tinte in 400 pixel di altezza:
  - tab e «+» indaco;
  - barra verde;
  - pastiglia pesca-arancio;
  - icona gialla;
  - carta azzurra con pulsante verde.
- Quando la carta è di Finanze (`azioni/az-adesso-fatto-0600ms__tel-light.png`), la carta diventa crema e il pulsante «Falla adesso» indaco: il colore del pulsante principale cambia da un'attività all'altra (verde per un'abitudine, indaco per un'attività). Per una testa ADHD l'automatismo «il pulsante grande è sempre di quel colore» è una stampella preziosa, e oggi manca.

**Aree arcobaleno.**
- In «Andamento › Per area» (`fogli/schermi-tel-light-01.png`), in «Le tue aree» e nell'onboarding (`fogli/azioni-tel-light-04.png`) le 8 barre e icone fanno un arcobaleno pieno.
- Sono dati, quindi è accettabile. Ma insieme ai coriandoli multicolori, all'indaco e al verde, il «colore» smette di significare qualcosa.
- Regola consigliata: **le aree vivono solo come puntino o icona piccola**, mai come superficie grande. La carta Adesso tinta per area è il caso limite: bella come orientamento, ma ruba il ruolo al pulsante.

**Ricompensa.**
- Oggi la ricompensa è verde («Fatto»), poi coriandoli arcobaleno e un toast nero con «+8 XP» in indaco (`fogli/azioni-tel-light-01.png`): tre linguaggi diversi in un secondo.
- Duolingo usa *un* colore per «hai fatto bene», che è anche la marca e la mascotte. Qui il momento di gioia non ha un colore proprio: è un collage.
- La fiamma arancio funziona (è una convenzione appresa), ma ha lo stesso esadecimale dell'area Founder.

**Colpa (rosso).** Il rosso compare dove non serve, e per l'ADHD il rosso legato a sé stessi pesa più che altrove:
- «Altro / Esplorazione» è un'area **rossa** (`#e34948`): l'area della curiosità ha il colore dell'errore.
- In «Scoperte › Non funziona» le righe hanno un riquadro rosso col pollice giù (`fogli/schermi-tel-light-05.png`, ultimo pannello). Una cosa che non funziona è una *scoperta*, non un errore.
- «Termina l'abitudine» è rossa nel foglio (`fogli/schermi-tel-light-02.png`): smettere un'abitudine viene presentato come un gesto distruttivo.
- «Scarta» è rosso pieno su Da sistemare (`schermi/attivita-sistemare__tel-light.png`) ed è uno dei tre pulsanti grandi: buttare un'idea è normale manutenzione.
- Il testo di ritardo usa `#c62f2f` (r. 1075).
- Bene invece: «Non ce l'ho fatta…» è grigio, e i voti 1-5 della sera sono neutri.

**Scuro.** Il grigio neutro iOS è riposante e corretto. L'indaco schiarito `#8f87ff` è più gentile del pieno. Il verde «Fatto» nello scuro è molto acceso rispetto al resto (`fogli/schermi-tel-dark-04.png`).

---

## 4. I riferimenti: come marca e mascotte si sostengono

| Marca | Colore di marca | Mascotte | Cosa ne imparo |
|---|---|---|---|
| **Duolingo** | verde «Feather» | Duo è dello stesso verde | Marca, mascotte e «giusto/fatto» sono **un solo colore**. Gli altri colori hanno ruoli di gioco precisi: arancio per la fiamma, oro per le leghe, blu per i premi. Il rosso compare solo per la risposta sbagliata e mai sulla persona. |
| **Headspace** | arancio caldo | i personaggi sono blob arancio, gialli e rosa | Il calore della marca *è* la calma. I fondi sono crema caldi, mai grigio-lilla. I personaggi portano il colore e l'interfaccia resta morbida e quieta. |
| **Brilliant** | telaio quasi monocromo (nero/bianco) | nessuna mascotte fissa: illustrazioni a colori pieni | Il colore abita il *contenuto* e le illustrazioni, non i comandi. Rende molto vivo con pochissime tinte nel telaio. |
| **Phantom** | viola lavanda | il fantasma è dello stesso viola | Il viola regge solo perché lo *possiede* tutto, mascotte compresa, in un settore dove gli altri sono blu. LifeMax col viola sarebbe il millesimo. |
| **Airbnb** | Rausch, corallo-rosso (circa `#ff385c`) | nessuna (c'è il logo «Bélo») | La prova più utile qui: **un rosso-corallo come marca convive con l'errore** perché è usato pochissimo (logo, un pulsante primario, il cuore) su neutri caldi, e gli errori usano un rosso più scuro e spento con icona e testo. Attenzione: Segno è a ΔE 17,5 da Rausch, vicino ma distinguibile. |

**Il filo comune:** in nessuno di questi marchi la mascotte ha un colore diverso dal primario. Quando coincidono, ogni apparizione della mascotte rinforza la marca e ogni pulsante primario «ricorda» la mascotte. LifeMax oggi avrebbe un pulsante indaco, una mascotte corallo e una pallina indaco negli stati vuoti: tre identità.

---

## 5. Segno nell'app attuale

Guardando `anim-tutte/chiavi-fatta/foglio.png`, `chiavi-bentornato/foglio.png`, `chiavi-calma/foglio.png` e `anim-v3/foglio.png`: Segno è riuscito. È leggibile, ha carattere e la coccarda dei 7 giorni è un'idea forte. Messo nell'app di oggi, però:

1. **Litiga con il primario.** Corallo (20°) e indaco (303°) distano 77° di tinta, entrambi molto saturi: non sono complementari né analoghi, sono un accostamento «a caso» che vibra. Un Segno corallo accanto al «+» indaco sembra un adesivo di un'altra app.
2. **È nella famiglia del rosso di errore.** ΔE 14 da `--critico #d03b3b`. Un Segno triste (`chiavi-calma`) accanto a «Elimina» o «Scarta» rossi si legge come «hai sbagliato», l'opposto del tono voluto. Con «Non ce l'ho fatta» il rischio è massimo.
3. **Si confonde con le aree.** È praticamente l'area «Altro» (ΔE 13,8). Il risvolto `#f4a3ae` è parente di Relazioni `#e87ba4`, e l'oro `#f5b440` è parente di Finanze `#eda100` e di `--avviso #fab219` (ΔE 12-13). Un Segno che appare dentro una carta di Finanze o accanto al riquadro giallo «Notifiche bloccate» perde le scintille nel fondo.
4. **Fondo.** È disegnato su `#fff6f1` caldo. Sul `#f7f6fb` lilla dell'app il corallo diventa più acido e il risvolto rosa più «caramella». Sullo scuro `#0e0e0f` regge bene (4,4:1).
5. **Doppia mascotte.** La sfera indaco degli stati vuoti (`azioni/vuoto-oggi__tel-light.png`) va tolta o sostituita da Segno, altrimenti l'utente conosce prima la pallina e poi il nastro.
6. **Contrasto.** `#d9445a` col testo bianco fa 4,26:1: non basta per un'etichetta da 15-16 px. Per i pulsanti serve una versione più profonda (vedi Direzione A).

---

## 6. Tre direzioni

### Direzione A: «Corallo Segno» (la marca è la mascotte) **← consigliata**

| Ruolo | Chiaro | Scuro | Note |
|---|---|---|---|
| Marca / mascotte | `#d9445a` | `#d9445a` | corpo di Segno, logo, illustrazioni |
| Primario pieno (pulsanti) | `#c8344f` | `#c8344f` | bianco 5,17:1 ✓ |
| Primario testo / link | `#a8283f` | `#ff7a8c` | 6,9:1 su bianco; 7,5:1 su nero |
| Secondario tenue (selezioni, pastiglie) | `#fbe4e7` | `#3a1f25` | al posto dei lilla `#e5e3fd` |
| Risvolto | `#f4a3ae` | `#f4a3ae` | solo su Segno e sulle illustrazioni |
| Ricompensa / giorni di fila | oro `#f5b440`; testo `#8a5a00` | `#f5b440` | **la fiamma diventa oro**: libera l'arancio di Founder e lega il momento bello alle scintille di Segno |
| Inchiostro | `#2a1a1f` | `#f5eff1` | parente degli occhi `#2b0f1c` |
| Neutri | pagina `#fbf7f4`, superficie `#ffffff`, superficie-2 `#f4eeea`, muto `#6e6166` (5,5:1) | `#121011` / `#1c191a` / `#2a2627` | **caldi** |
| Successo | `#1f7a55` | `#3fbf86` | solo per spunte, anelli, barre; non per il pulsante grande |
| Errore / distruttivo | mattone `#b54708` (ΔE 37 dal primario) | `#ff8a4c` | sempre con icona e testo; usato solo nelle conferme di cancellazione definitiva |
| Avviso | `#e8a317` | | non confondere con l'oro: l'avviso sta su fondo, l'oro solo in particelle |

**Le regole che rendono possibile un rosso-corallo:**
1. **Un solo pieno corallo per schermata.** «Fatto» sulla scheda Adesso diventa il pulsante di marca: la marca coincide col momento della ricompensa, come in Duolingo.
2. **«Scarta», «Termina l'abitudine», «Non funziona» e «Elimina» diventano neutri** (testo inchiostro più icona). Il mattone resta solo nella conferma finale.
3. **Aree:** «Altro» passa da rosso a ciano `#1495b8`, la tinta che manca alla ruota; Relazioni si sposta verso l'orchidea per staccarsi dal risvolto. Le aree vanno ri-validate con la prova categoriale esistente.
4. **Coriandoli:** corallo, risvolto, oro e inchiostro, non l'arcobaleno.
5. **Carta Adesso neutra,** con l'area come puntino ed etichetta: il colore grande è uno solo.
6. **60-30-10:** 60 neutri caldi, 30 inchiostro e grigi caldi (testo, icone, secondari), 10 corallo (primario, tab attiva, Segno, logo). Aree e oro restano sotto il 3%.

**Pro**
- Marca e mascotte sono una cosa sola.
- Calda e coerente col tono dichiarato.
- Rara fra le app di produttività (che sono blu o viola).
- Airbnb dimostra che si può fare.

**Contro**
- Un rosso-corallo come marca richiede disciplina sul rosso semantico: va ripulito ovunque.
- Vicinanza ad Airbnb (ΔE 17,5).
- Refactor di circa 30 usi di `--critico`, degli arancio scritti a mano e di due aree.

### Direzione B: «Inchiostro caldo + Segno» (il colore è solo la mascotte)

| Ruolo | Valore |
|---|---|
| Primario UI (pulsanti, tab attiva) | prugna-nero `#33202a` (15:1); scuro `#f3e9ec` con testo `#2a1a1f` |
| Marca / mascotte | `#d9445a`, solo in Segno, nel logo, nelle feste e negli stati vuoti |
| Ricompensa | oro `#f5b440` |
| Neutri | gli stessi caldi della Direzione A |
| Successo | `#1f7a55` |
| Errore | `#c62f2f` (può restare, perché Segno non vive mai accanto ai comandi) |
| Aree | invariate, ma solo come puntini |

**Pro**
- È l'intento già scritto nel commento di `app.css`: l'inchiostro.
- Massima calma: il telaio è monocromo e il colore arriva solo quando succede qualcosa di bello. Segno «accende» lo schermo quando compare, alla Brilliant.
- Nessun conflitto con aree ed errori.

**Contro**
- I pulsanti neri sono meno affettuosi e più «strumento».
- La marca si riconosce solo quando Segno è presente.
- Rischio «Notion con una mascotte».

### Direzione C: «Indaco tenuto, Segno ricolorato» (alla Phantom)

| Ruolo | Valore |
|---|---|
| Primario | `#5b4ff5`, invariato |
| Mascotte | Segno viola `#6c4ff0`, risvolto `#c9c3ff`, oro `#f5b440` |
| Neutri | quelli attuali |
| Aree | Lavoro da ricolorare (oggi ha la tinta della marca) |

**Pro**
- Costo minimo.
- Coerente con le schermate di oggi e con la sfera indaco esistente.

**Contro**
- Resta il template (ΔE 18 da Tailwind indigo-500).
- È freddo, contro il tono dichiarato.
- Un nastro di raso viola perde il calore del «segnalibro».
- Phantom regge perché possiede il viola nel suo settore. Nella produttività il viola è di tutti: Linear, ClickUp, Notion AI, Motion.

### Il mio consiglio

**A**, con la sobrietà di **B**: corallo come marca e come unico pieno, telaio di neutri e inchiostro caldi, oro riservato alla ricompensa, rosso spostato sul mattone e tolto da tutto ciò che riguarda la persona.

**Primi passi concreti**, senza toccare ancora il codice:
1. una sola definizione dei token, eliminando le tre «pelli» sovrapposte in `app.css`;
2. via `--brand-a/b/c`, la pelle arcade e i due set di coriandoli in `moto.ts`;
3. Segno al posto della sfera indaco negli stati vuoti;
4. la fiamma da `#eb6834` all'oro;
5. l'area «Altro» via dal rosso;
6. un nuovo logo ricavato dalla forma a coda di rondine del nastro.
