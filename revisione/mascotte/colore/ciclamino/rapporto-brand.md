# LifeMax: il sistema colore di marca, da zero

*Punto di vista: brand identity design, con il metodo di Alina Wheeler (*Designing Brand Identity*): prima ricerca e strategia, poi il colore, poi la verifica. Ogni scelta qui sotto ha una fonte o un principio e una misura. Le misure vengono da script che si possono rieseguire, tutti in questa cartella (`brand/`). Non ho toccato i file del progetto.*

**Consegna in questa cartella**
- `rapporto-brand.md`: questo documento.
- `token.json` e `token.css`: i valori finali, chiaro e scuro, generati da `sistema.py`, che è l'unica fonte.
- `verifica.py` → `verifica.txt`: tutti i contrasti WCAG e le matrici ΔE (normale, deuteranopia, protanopia, tritanopia).
- `tavola.html` → `tavola-ciclamino.png` (e `@2x`): palette, aree, Segno ricolorato, stanze emotive, scheda d'esempio, mappa dei concorrenti, i tre candidati.
- `icone/`: le icone dei 23 concorrenti scaricate dall'App Store italiano, con i colori dominanti misurati (`dominanti.json`, `montaggio.png`).
- `esplorazione/`: le ricerche numeriche che hanno portato ai valori.

---

## 0. In breve

**Il colore di marca è un ciclamino**: un magenta-orchidea caldo, `oklch(58% 0.19 332)` = **`#b744ab`** per Segno e il logo, e `oklch(53% 0.19 332)` = **`#a6339b`** per il pulsante principale (con il bianco sopra: 5,9:1).

Segno è lo stesso ciclamino. Il rovescio del raso è un rosa-lilla opaco, `#e7b5db`, e gli occhi sono l'inchiostro di marca, `#2d162a`.

I neutri sono di **carta calda**: pagina `#f9f6f2`, inchiostro `#281e26`. Nello scuro diventano **seppia**: pagina `#110f0d`.

Semantici:
- **verde = fatto**: `#53933a`, pieno `#397421`;
- **ruggine = errore**: `#872802`, un mattone scuro e non un rosso d'allarme;
- **oro = ricompensa e giorni di fila**: `#eab532`.

Il giallo d'«attenzione» non esiste. Il ritardo non ha colore d'allarme.

Le ragioni principali:
1. **Differenziazione misurata.** Ho messo i colori dominanti di 23 app concorrenti sulla ruota OKLCH. Il settore fra 296° (viola) e 17° (rosso Airbnb) è **vuoto**, e il ciclamino a 332° ci sta in mezzo. Il blu e il viola sono saturi (Todoist, Things, TickTick, Calm, Any.do, Tiimo, Habitica, Phantom), il rosso-arancio anche (Todoist, Airbnb, Headspace, Sunsama, Fabulous, Finch).
2. **Niente rosso in un contesto di prestazione.** Secondo la color-in-context theory (Elliot & Maier), il rosso in un contesto di valutazione richiama il fallimento e spinge all'evitamento. Per adulti con ADHD, che vivono la critica in modo acuto, una marca rossa o corallo dentro una app di compiti è il segnale sbagliato. Per la stessa ragione il corallo attuale va abbandonato, e l'errore diventa un mattone spento.
3. **Personalità di marca.** Gli attributi sono sincerità e calore (Aaker), con un'eccitazione gentile. Le associazioni studiate del rosa-magenta sono cura, calore e morbidezza (Labrecque & Milne 2012, rassegne). In Italia il rosa è anche la **maglia rosa**: il colore di chi è in testa, non di chi ha sbagliato.
4. **Accessibilità che regge davvero.** Tutte le coppie fra semantici e marca stanno a **ΔE ≥ 15** in visione normale, in deuteranopia e in protanopia, nei due temi. Non c'è nessun FAIL WCAG sulle 168 coppie con soglia.

Il compromesso dichiarato riguarda le **8 aree**: fra loro arrivano a ΔE minimo 9,1 (normale), non a 15. Con 13 categorie nello spazio sRGB, a luminosità da icona, di più non si ottiene. Per questo le aree vivono solo come icona più etichetta.

---

## 1. Strategia prima del colore

### 1.1 Posizionamento

**LifeMax è il segnalibro della giornata per chi ha una testa ADHD.** Non ti misura e non ti ingegnerizza: ti tiene il segno e ti fa ripartire da lì.
- **Categoria:** organizzazione personale, cioè attività, abitudini, focus e giorni di fila.
- **Differenza:** «una cosa alla volta» e il tono mai colpevolizzante.
- **Prova:** Segno, la scheda Adesso, il foglio «Non ce l'ho fatta», che non giudica.

Il motto attuale della porta d'ingresso, «MISURA. INGEGNERIZZA. MASSIMIZZA.» (rapporto-emozione §1.1), contraddice il posizionamento. Il colore non deve seguirlo.

### 1.2 Il pubblico: cosa dice la ricerca, e quanto è solida

| Tema | Cosa sappiamo | Solidità | Conseguenza per il colore |
|---|---|---|---|
| **Disregolazione emotiva** | Parte centrale dell'ADHD adulto: una quota ampia, dal 30 al 70% secondo le stime, fatica a regolare le emozioni (Shaw et al. 2014, *Am J Psychiatry*) | solida (rassegna) | Niente colori d'allarme sugli stati che riguardano la persona: mancato, ritardo, serie interrotta |
| **Sensibilità alla critica / «RSD»** | Studi qualitativi: gli adulti con ADHD vivono anche la critica lieve come fallimento e perdita di valore (Beaton, Sirois & Milne 2022, *PLoS ONE*). La sensibilità al rifiuto descritta con ritiro e mascheramento (Rowney-Smith et al., *PLOS One* 2026). L'«RSD» **non** è una diagnosi e le prove sono poche | moderata, qualitativa | Evitare il codice «penna rossa». Il rosso è riservato alla distruzione irreversibile, ed è spento |
| **Ricompensa** | Differenze nella via dopaminergica della ricompensa (Volkow et al. 2009, *JAMA*). Avversione all'attesa: meglio una ricompensa subito (Sonuga-Barke 2003, modello a due vie) | solida | Un colore della ricompensa **dedicato e immediato** (l'oro), che compare sul posto entro 100 ms |
| **Sensibilità sensoriale** | Ipo- e ipersensibilità come tratti centrali dell'ADHD adulto, più marcate nelle donne (43% contro 22%) (Bijlenga et al. 2017, *Eur Psychiatry*) | moderata (un solo studio clinico) | Base neutra, **una sola massa satura per schermata**, niente movimento perpetuo saturo. Va previsto un modo «colore ridotto» |
| **Percezione del colore nell'ADHD** | Errori nell'asse blu-giallo e nella saturazione di blu e rosso (Banaschewski et al. 2006; Tannock, Banaschewski & Gold 2006; Kim et al. 2014, *Behav Brain Funct* 10:38-39). Ma niente differenze nei test clinici, e i campioni sono piccoli | debole o preliminare | Non affidare stati diversi a **differenze di sola saturazione**. Ogni coppia tenue/pieno differisce per luminosità (ΔL ≥ 0,4) |

### 1.3 Personalità di marca

**Le dimensioni di Aaker (1997) in ordine di peso:**
1. **Sincerità**: onesta, sana, allegra, con i piedi per terra. È la dimensione principale: «mai colpevolizzante» vuol dire sincera e gentile.
2. **Eccitazione, ma moderata**: vivace, giovane, ma non «audace». Duolingo e Headspace stanno qui.
3. **Competenza**: affidabile. Basta che il segno sia tenuto: non serve sembrare un software aziendale.
4. **Raffinatezza** e **rudezza**: escluse.

**Archetipi (Mark & Pearson 2001):** **l'Angelo custode / Caregiver** (cura, protezione senza giudizio) con un tratto di **Amico / Everyman** (alla pari, «riprendiamo da qui»). È esplicitamente *non* l'Eroe, che è prestazione e sfida, ed è il territorio dei «MASSIMIZZA», del rosso e del nero sportivo.

**Attributi che il colore deve comunicare**, trasformati in requisiti misurabili:

| Attributo | Requisito cromatico | Come lo misuro |
|---|---|---|
| caldo | neutri con tinta calda; marca nel semicerchio caldo o vicino | tinta OKLCH dei neutri tra 60° e 85°; marca fuori da 180°-300° |
| mai colpevolizzante | marca **non** rossa; errore spento e raro; nessun giallo d'allarme sugli stati personali | marca ≥ 40° di tinta dal rosso «penna» (~25-30°); ΔE marca↔errore ≥ 15 |
| giocoso ma calmo | marca satura ma usata al 10%; superfici grandi quasi neutre | C ≤ 0,05 sulle superfici sopra 40×40 px; un solo pieno per vista |
| riconoscibile | tinta libera nel settore | ΔE ≥ 14 da ogni concorrente, e nessuno nella stessa categoria di nome |
| accessibile | WCAG 2.2 AA; semantici separati anche per i daltonici | 1.4.3, 1.4.11; ΔE ≥ 15 normale e deuteranopia |

---

## 2. Teoria e ricerca applicate: cosa è solido, cosa è folklore

| Principio / fonte | Cosa dice | Solidità | Applicazione in LifeMax |
|---|---|---|---|
| **Itten** (*Kunst der Farbe*, 1961), sette contrasti | Contrasto di chiaro-scuro, di caldo-freddo, di quantità | teoria didattica, utile come lessico | Figura/sfondo di Segno affidata al **chiaro-scuro** (4,4:1 sulla carta), non alla sola tinta. Contrasto di **quantità**: il ciclamino resta al 10% |
| **Albers** (*Interaction of Color*, 1963) | Un colore cambia con quello che ha intorno; i neutri prendono la tinta dominante | solida, percettiva | I neutri d'inchiostro sono leggermente tinti di marca (C 0,01-0,02 a 332°), così testo e marca «appartengono»; la carta è calda per non far diventare acido il magenta |
| **Munsell / CIELAB / OKLab-OKLCH** (Ottosson 2020; CSS Color 4) | Spazi percettivamente uniformi: stessa L, stessa chiarezza percepita | solida | Tutto è definito in OKLCH: le scale tenue/pieno/testo hanno passi di L controllati e i gradini delle aree sono confrontabili |
| **Valdez & Mehrabian 1994** (*JEP: General* 123(4)) | La luminosità alza la piacevolezza; la saturazione alza l'attivazione; la tinta pesa meno. Blu e viola sono le tinte più piacevoli, il giallo la meno piacevole | solida, confermata da Wilms & Oberfeld 2018 | Superfici chiare e poco sature, quindi piacevoli e poco attivanti. La saturazione alta (C 0,19) è solo sul pieno d'azione e su Segno. Tinta di marca nella zona viola-magenta |
| **Elliot & Maier**, color-in-context theory (2012; rassegna in *Annu Rev Psychol* 2014). Elliot et al. 2007 (*JEP: General*) e 2009 (*PSPB*) | In un contesto di prestazione il rosso abbassa i risultati e aumenta l'evitamento. In un contesto affettivo invece avvicina | moderata: effetti replicati in parte, la dimensione è discussa | **Decisivo.** Niente marca rossa o corallo; errore spostato sul mattone spento (L 42%) e usato solo per il distruttivo irreversibile |
| **Labrecque & Milne 2012** (*JAMS* 40(5), 711-727) | Blu → competenza; rosso → eccitazione (confermato). Nel lavoro anche associazioni fra rosa e raffinatezza/sincerità, e fra luminosità alta e sincerità *(riferite a memoria: da verificare sulle tabelle dell'articolo)* | moderata | La competenza blu è il territorio affollato dei concorrenti. La sincerità chiede valori alti e saturazioni misurate: un ciclamino profondo, non uno shocking pink |
| **Hemphill 1996** (*J Genet Psychol* 157(3)) | I colori chiari suscitano associazioni positive, quelli scuri negative | moderata | Le stanze emotive positive sono chiare (`stanza-gioia` L 0,956) |
| **Jonauskaite et al. 2020** (*Psychological Science* 31(10), 30 nazioni) | Le associazioni colore-emozione sono in gran parte universali (r = 0,88), con variazioni locali. Il giallo va con la gioia, il rosso con amore e rabbia, il rosa con l'amore | solida | Oro = gioia e ricompensa; il rosa-magenta legge come affetto, non come rabbia |
| **Singh 2006** (*Management Decision* 44(6)) | La famosa cifra del «62-90% del giudizio dato dal solo colore» | **debole**: rassegna, la cifra non viene da un esperimento | Non usata come argomento |
| **Healey 1996**, codici categoriali | Circa 7 colori si cercano a colpo d'occhio; oltre servono altri canali | moderata | Semantici ridotti a 4 (marca, fatto, errore, oro). Le 8 aree hanno sempre un'icona |
| **WCAG 2.2**: 1.4.1, 1.4.3, 1.4.11, 2.4.7 / 2.4.11 | 4,5:1 per il testo, 3:1 per i componenti e la grafica, il colore mai unico canale | norma | §8 |
| **Machado, Oliveira & Fernandes 2009** (*IEEE TVCG*) | Simulazione della visione difettosa del colore | solida | Deuteranopia, protanopia e tritanopia calcolate su ogni coppia |
| **Berlin & Kay 1969**, termini di colore di base | Le categorie con un nome proprio («viola», «rosa», «rosso») sono percepite come più distanti | solida | Marca nella categoria «rosa/fucsia/ciclamino», non «viola» come Habitica e Tiimo e non «rosso» come Todoist. *Da verificare con un test di denominazione* |
| **Regola 60-30-10** | Proporzione d'arredamento: dominante, secondario, accento | **euristica di mestiere**, non ricerca | Usata come obiettivo misurabile: 60 carta, 30 inchiostro, 10 ciclamino; aree, oro e semantici sotto il 3% |
| Associazioni culturali in Italia | **maglia rosa** (Giro d'Italia dal 1931, dal colore della *Gazzetta dello Sport*) = in testa, premiato. **Matita rossa e blu** della scuola = correzione: il rosso segna gli errori, il blu quelli gravi. «**Essere al verde**» = senza soldi. Il viola porta sfortuna in teatro ed è il colore liturgico della penitenza | culturali reali; il viola è superstizione | Rosa/ciclamino è positivo. Rosso e **blu** hanno entrambi un'eco «di correzione»: un argomento in più contro il blu come marca. Finanze **non** è verde. Il ciclamino va tenuto lontano dal «viola»: c'è un margine (332° contro 290-300°) |
| **Folklore da scartare** | «Il blu aumenta la produttività», «il rosa Baker-Miller calma», «il verde riposa la vista», «l'arancio fa venire fame» | effetti non replicati o nati dal marketing | Non usati |

---

## 3. La mappa dei concorrenti (misurata, non ricordata)

**Metodo.**
- Ho scaricato le icone dall'App Store italiano tramite l'iTunes Search API (23/11/2026, `scarica_icone.py`).
- Su 96×96 px ho classificato i pixel con C ≥ 0,04 per tinta OKLCH in fasce di 15°. Il colore dominante è la mediana della fascia più popolata più le due vicine (`analizza_icone.py`).
- Le icone sono il punto di contatto più frequente di una marca, ma possono essere stagionali: quella di Duolingo oggi è una variante arancio, quindi ho aggiunto il Feather Green ufficiale `#58cc02` (design.duolingo.com).

| App | Dominante | OKLCH | Famiglia |
|---|---|---|---|
| Todoist | `#fe463e` | 66% 0,22 28° | rosso |
| Airbnb | `#ff385c` | 66% 0,23 17° | rosso-rosa |
| Fabulous | `#d00016` | 54% 0,22 27° | rosso |
| Structured | `#ffaaa6` | 82% 0,10 22° | salmone |
| Amazing Marvin | `#895049` | 50% 0,08 28° | bruno (icona quasi neutra) |
| Sunsama | `#ee693c` | 68% 0,18 39° | arancio |
| Headspace | `#ff7300` | 71% 0,20 48° | arancio |
| Finch | `#df8040` | 69% 0,14 52° | arancio su grigio |
| Llama Life (ADHD) | `#fee16b` | 91% 0,14 96° | giallo |
| Routinery | `#f9e000` | 90% 0,19 101° | giallo |
| Forest / Goblin Tools (ADHD) | `#e3ff99` / `#cce969` | 96% / 89%, 120° | lime |
| Duolingo (Feather) | `#58cc02` | 75% 0,23 138° | verde |
| Brilliant | `#53be8b` | 73% 0,13 160° | verde-acqua |
| Inflow (ADHD) | `#bee3db` | 89% 0,04 181° | menta pallido |
| Microsoft To Do / Any.do / Things / Calm / TickTick | `#389cea` … `#5d86fe` | 246°-267° | **blu (5 app)** |
| Phantom / Tiimo (ADHD) / Habitica | `#ab9ff1` / `#b9a5ef` / `#8e4bf8` | 290°-296° | **viola/lavanda (3 app)** |
| Notion, Linear | nero/bianco | — | neutri |

**Lettura.**
- Il blu (5 app) e il viola (3) sono i colori della produttività. Il viola è anche quello delle app ADHD più vicine (Tiimo).
- Rosso, arancio e giallo sono le app «calde» e di abitudini (Todoist, Headspace, Sunsama, Llama Life).
- **Il settore 296°→17° (81° di ruota) è vuoto**, ed è il buco più grande. Il secondo è 181°→246° (ottanio-ciano, 65°), dove però Calm, Microsoft e Things sono a ΔE 12-15.

Il ciclamino LifeMax (332°) è a:
- **ΔE 14,3 da Habitica**, il più vicino; ma è un viola-blu, quindi un'altra categoria di nome;
- 18 da Airbnb;
- 21 da Todoist;
- 22 da Tiimo;
- tutti gli altri sono oltre 20.

La mappa polare è nella tavola, sezione 4.

---

## 4. Tre candidati e la griglia di valutazione

Ogni candidato è un sistema completo (marca, mascotte, semantici, neutri, aree). Per B e C ho cercato i semantici **migliori possibili** con lo stesso algoritmo usato per A (`esplorazione/cerca_bc.py`), così il confronto è leale.

| | **A · Ciclamino** | **B · Ottanio** | **C · Terracotta** |
|---|---|---|---|
| Segno / pulsante | `#b744ab` / `#a6339b` (332°) | `#058298` / `#016f82` (215°) | `#ce6234` / `#b64c1b` (42°) |
| Bianco sul pulsante | 5,89 | 5,84 | 5,20 |
| Segno su pagina chiara / scura | 4,40 / 4,03 | 4,19 / 4,24 | 3,60 / 4,94 |
| Min ΔE semantici (normale / deuteranopia) | **21,3 / 16,5** | 16,2 / 15,2 | **11,9 / 8,2 ✗** |
| Concorrente più vicino | Habitica 14,3 | Calm 12,0, Microsoft 13,9, Things 14,8 | Duolingo (icona) 4,1, Sunsama 6,4, Finch 7,7 |
| Teoria | caldo-affettuoso, fuori dal rosso; cura e sincerità | calmo e competente, ma **freddo** contro il tono; il blu-verde è anche l'asse debole dell'ADHD (blu-giallo) | il più caldo (Headspace), ma **rosso-arancio in contesto di prestazione** e collisione con errore e giorni di fila |
| Sistema | l'errore va spento sul mattone; Relazioni va tenuta in rosa antico | collide con Salute e Associazioni (acque e azzurri) e col verde del fatto in deuteranopia | marca, errore, fiamma e Founder sono tutti nello stesso arco di 30° |

**Griglia pesata** (punteggio 1-5):

| Criterio | Peso | A | B | C |
|---|---|---|---|---|
| Strategia (sincerità, calore, cura; non colpevolizzante) | 30% | 4 | 3 | 4 |
| Ricerca (Elliot & Maier, Valdez & Mehrabian, ADHD) | 20% | 4 | 4 | 2 |
| Differenziazione (mappa misurata) | 20% | 5 | 3 | 1 |
| Accessibilità (WCAG, ΔE dei semantici anche per i daltonici) | 15% | 5 | 4 | 2 |
| Sistema (semantici, aree, due temi, mascotte) | 15% | 4 | 3 | 2 |
| **Totale** | | **4,35** | **3,35** | **2,40** |

**Scelgo A.** Perché A non prende 5 in strategia: il magenta-rosa ha un rischio di **lettura di genere** e un **margine stretto col «viola»**. Entrambe le cose vanno testate (§10).

---

## 5. Il sistema finale «Ciclamino»: token

Tutti i valori sono in `token.json` e `token.css`, generati da `sistema.py`. Sono definiti in OKLCH e convertiti in sRGB. Se una tinta esce dal gamut, si riduce il croma come in CSS Color 4: per questo l'errore ha C 0,136 invece di 0,16.

| token | chiaro | OKLCH chiaro | scuro | OKLCH scuro |
|---|---|---|---|---|
| --pagina | `#f9f6f2` | oklch(97.4% 0.006 75) | `#110f0d` | oklch(17.0% 0.005 67) |
| --superficie-1 | `#ffffff` | oklch(100% 0 0) | `#1c1916` | oklch(21.6% 0.007 67) |
| --superficie-2 | `#f3f0eb` | oklch(95.6% 0.007 81) | `#272320` | oklch(25.9% 0.008 59) |
| --superficie-3 | `#e9e6e0` | oklch(92.6% 0.009 85) | `#342f2c` | oklch(30.9% 0.009 53) |
| --linea-decor | `#e0dcd5` | oklch(89.6% 0.010 82) | `#393431` | oklch(32.9% 0.009 53) |
| --linea-controllo | `#848078` | oklch(60.1% 0.013 85) | `#7f7974` | oklch(58.0% 0.011 62) |
| --testo-1 | `#281e26` | oklch(25.0% 0.021 333) | `#f2edf1` | oklch(95.1% 0.008 332) |
| --testo-2 | `#554d54` | oklch(43.1% 0.015 330) | `#c8c2c7` | oklch(82.0% 0.010 331) |
| --testo-3 (anche segnaposto) | `#686166` | oklch(50.1% 0.012 336) | `#afa9ae` | oklch(74.1% 0.010 331) |
| --testo-su-pieno | `#ffffff` | | `#ffffff` | |
| **--azione** (pieno) | `#a6339b` | oklch(52.9% 0.190 332) | `#a6339b` | oklch(52.9% 0.190 332) |
| --azione-hover | `#932789` | oklch(47.9% 0.180 332) | `#b341a8` | oklch(57.0% 0.189 332) |
| --azione-premuta | `#841f7b` | oklch(44.1% 0.170 332) | `#962b8c` | oklch(48.9% 0.179 332) |
| --azione-testo | `#8d2984` | oklch(46.9% 0.170 332) | `#e4a0da` | oklch(78.9% 0.110 332) |
| --azione-linea (icone attive, linea dell'ora, anello del timer) | `#a6339b` | oklch(52.9% 0.190 332) | `#e4a0da` | oklch(78.9% 0.110 332) |
| --azione-tenue (selezionato) | `#fbe8f8` | oklch(95.1% 0.029 331) | `#3f223b` | oklch(30.0% 0.059 332) |
| --azione-tenue-hover | `#f7daf2` | oklch(91.9% 0.045 332) | `#4d2948` | oklch(34.0% 0.071 332) |
| --focus | `#8d2984` | oklch(46.9% 0.170 332) | `#e4a0da` | oklch(78.9% 0.110 332) |
| **--successo** (icona, linea) | `#53933a` | oklch(60.0% 0.140 138) | `#73ba59` | oklch(72.0% 0.150 138) |
| --successo-testo | `#356a20` | oklch(47.1% 0.120 138) | `#73ba59` | oklch(72.0% 0.150 138) |
| --successo-pieno | `#397421` | oklch(50.1% 0.131 138) | `#397421` | oklch(50.1% 0.131 138) |
| --successo-tenue | `#e2f5dc` | oklch(94.9% 0.039 138) | `#1f3118` | oklch(29.0% 0.049 137) |
| **--errore** (icona) | `#872802` | oklch(42.0% 0.136 38) | `#af5234` | oklch(54.9% 0.129 38) |
| --errore-testo | `#872802` | oklch(42.0% 0.136 38) | `#e4896c` | oklch(72.0% 0.119 38) |
| --errore-pieno | `#872802` | oklch(42.0% 0.136 38) | `#872802` | oklch(42.0% 0.136 38) |
| --errore-tenue | `#ffe9e3` | oklch(95.0% 0.025 36) | `#3a221a` | oklch(28.1% 0.040 39) |
| **--oro** (ricompensa, giorni di fila, particelle) | `#eab532` | oklch(80.1% 0.150 85) | `#ffe38d` | oklch(92.1% 0.110 92) |
| --oro-tenue | `#fbeec9` | oklch(95.0% 0.050 91) | `#392c0c` | oklch(30.1% 0.050 87) |
| --testo-su-oro (e contorno della fiamma) | `#281e26` | | `#281e26` | |
| **--segno** | `#b744ab` | oklch(58.0% 0.190 332) | `#b744ab` | uguale |
| --segno-rovescio | `#e7b5db` | oklch(82.9% 0.076 335) | `#e7b5db` | uguale |
| --segno-occhi | `#2d162a` | oklch(24.1% 0.050 332) | `#2d162a` | uguale |
| --stanza-gioia | `#fee9fa` | oklch(95.6% 0.032 332) | `#281625` | oklch(23.1% 0.039 333) |
| --stanza-raggio | `#fbdbf5` | oklch(92.5% 0.049 332) | `#361c32` | oklch(27.1% 0.054 333) |
| --stanza-calma | `#f9f6f2` | = pagina | `#110f0d` | = pagina |
| --stanza-capisce | `#f3ede7` | oklch(94.9% 0.010 68) | `#191512` | oklch(19.9% 0.009 59) |
| --stanza-bentornato | `#fdf2dd` | oklch(96.4% 0.030 84) | `#21190d` | oklch(22.0% 0.025 77) |

**Le otto aree.** Le ho ottimizzate con una ricerca numerica (`esplorazione/aree_v4.py`): ognuna in una finestra di tinta con un senso, luminosità fra 0,47 e 0,64, icona ≥ 3:1 nei due temi. L'obiettivo era massimizzare la distanza minima da tutto il resto, anche in deuteranopia.

| Area | Icona chiaro | OKLCH | Tenue / testo chiaro | Icona scuro | Tenue / testo scuro | Perché questa tinta |
|---|---|---|---|---|---|---|
| Studio / Università | `#4172c3` | 55.8% 0.137 260 | `#e6effe` / `#2555a3` | `#8cb8fe` | `#1d293d` / `#8db8fe` | blu = competenza (Labrecque & Milne): giusto per lo studio, sbagliato per la marca |
| Salute & Sport | `#038876` | 56.1% 0.102 179 | `#daf6ef` / `#006759` | `#42d2b9` | `#0e2f29` / `#4ed0b9` | acqua, respiro. **Non verde**, per non confondersi con «fatto» (oggi un cerchio vuoto di Salute sembra già fatto) |
| Relazioni & Sociale | `#89425a` | 47.6% 0.100 0 | `#fee8ee` / `#843d56` | `#ce849b` | `#392028` / `#e199af` | rosa antico: affetto, ma spento e scuro, a ΔE 15 da Segno |
| Finanze | `#737004` | 53.1% 0.113 108 | `#f0f0da` / `#5e5b00` | `#cfd271` | `#2b2a12` / `#b8b75a` | oliva. Non verde («essere al verde») e non oro (l'oro è la ricompensa) |
| Associazioni | `#03628b` | 46.9% 0.100 236 | `#dff2fe` / `#035f87` | `#41a6dc` | `#142c3a` / `#60bcf0` | azzurro-petrolio: civico, collettivo |
| Progetti Founder | `#8c7bda` | 64.0% 0.140 290 | `#eeecfe` / `#59459f` | `#d0cafe` | `#28253b` / `#d0c9ff` | pervinca: visione. Non più arancio (oggi è identico alla fiamma) |
| Lavoro | `#7e5736` | 49.1% 0.070 60 | `#feeadb` / `#744f2d` | `#c19977` | `#372414` / `#cfa889` | cuoio: concreto, «rugged». Non più indaco (oggi è identico all'azione) |
| Altro / Esplorazione | `#8d8784` | 62.8% 0.009 49 | `#f4ede9` / `#5c5753` | `#d2ccc8` | `#2d2825` / `#d2ccc8` | pietra neutra: categoria residua. Non più rossa (oggi è il colore dell'errore) |

**Proporzioni (60-30-10 come obiettivo misurabile):**
- 60% carta e superfici;
- 30% inchiostro: testo, icone neutre, linee;
- 10% ciclamino: un solo pieno d'azione per schermata, la tab attiva, il selezionato tenue, Segno quando c'è;
- aree, oro, verde e ruggine insieme sotto il 3%.

Oggi la proporzione misurata è circa 96 / 0 / 4, spezzata in 5 tinte (rapporto-identità §2). Il 30 è l'inchiostro tinto di marca: così si riconosce LifeMax anche senza pulsanti in vista.

**I due temi sono la stessa luce.**
- Cambiano luminosità, non tinta. Il pieno d'azione e Segno sono **identici** nei due temi, come un oggetto vero sotto un'altra luce.
- Nello scuro le linee e il testo di marca salgono a L 0,79 (`#e4a0da`): il ciclamino pieno sul seppia fa 3,25:1, troppo poco per un'icona sottile.
- La saturazione delle superfici grandi resta ≤ 0,06.

---

## 6. Segno: il colore dedotto

**1. Il significato.**
- Un nastro segnalibro di raso esiste per **farsi trovare sulla pagina**. Il suo requisito funzionale è il rapporto figura/sfondo con la carta.
- La carta di LifeMax è calda (75-85°, L 0,97). Itten direbbe che il nastro deve vincere col **contrasto di chiaro-scuro** più un contrasto di tinta. Un colore a 4,4:1 sulla carta, nel lato opposto della ruota rispetto al giallo della carta, si stacca senza bisogno di contorno.
- Il ciclamino (332°) sta a circa 105° dalla tinta della carta. Un verde o un blu staccherebbero altrettanto, ma sono freddi e già presi.

**2. La funzione emotiva.**
- Segno è la voce della cura: «ti ho tenuto il segno». Il colore deve dire affetto senza giudizio, quindi:
  - **non rosso** (Elliot & Maier; la matita rossa);
  - caldo;
  - abbastanza saturo da essere vivo nelle feste (Valdez & Mehrabian: saturazione = attivazione);
  - abbastanza luminoso da essere piacevole (L 0,58).
- Rosa e magenta sono associati a calore, cura e affetto (Jonauskaite et al. 2020; Labrecque & Milne). In Italia il rosa è anche premio (maglia rosa).

**3. Il ruolo nel sistema: coincide con la marca, come Duo.**
- Nei cinque riferimenti del fondatore (Duolingo, Headspace, Brilliant, Phantom, Airbnb), la mascotte o il simbolo ha il colore della marca. Wheeler chiama questa ripetizione *coerenza*: ogni apparizione rinforza l'altra.
- Il rischio dell'oggi (la goccia indaco che «sembra un pulsante») si evita in tre modi:
  1. **due luminosità**: Segno L 0,58 e azione L 0,53, ΔE 5. Stessa famiglia, ma il pulsante è più profondo;
  2. **la forma e il viso**: Segno ha occhi e silhouette, il pulsante è un rettangolo con un'etichetta;
  3. **una regola**: Segno non è mai un controllo cliccabile.
- Il corallo attuale è a ΔE 14 dal nuovo Segno: non è un ritocco, è un cambio.

**4. Il rovescio del raso (risvolto).**
- Il raso ha il dritto lucido e saturo e il rovescio opaco. Il rovescio riflette meno in modo speculare, quindi è più chiaro-diffuso e meno saturo.
- La regola: **stessa tinta, croma ridotto del 60%, luminosità +0,25**. Ne viene `#e7b5db`, oklch(83% 0.076 335). La tinta è spostata di 3° per un leggerissimo freddo del rovescio.
- Contro il corpo fa 2,72:1: la piega si legge. Sulla carta chiara fa 1,62:1, e va bene perché è un dettaglio interno: la sagoma la porta il corpo.
- Dista ≥ 21 da tutte le aree. Il rischio di «Segno = Relazioni» dell'oggi sparisce.

**5. Gli occhi.**
- `#2d162a`, l'inchiostro di marca (la stessa famiglia di `--testo-1`).
- Fanno 3,52:1 sul corpo: SC 1.4.11 per i dettagli grafici.

**6. Ombra a terra.**
- Chiaro: `--segno` al 14% di opacità.
- Scuro: nero al 35%.
- Mai un colore fisso: oggi è `#f3dcd6`, che sparirebbe o farebbe macchia.

**7. Particelle delle feste.**
- Proporzioni: **oro 45%, ciclamino Segno 30%, rovescio 25%**.
- Nessun verde: il verde è «fatto», non «festa». Nessun arcobaleno.
- Nello scuro: −30% di pezzi.

**Stanze emotive delle animazioni.** Il personaggio non cambia mai colore. Cambiano la stanza (il fondo), le particelle e il testo.

| Stanza | Usi | Fondo chiaro / scuro | Particelle | Testo | Intensità |
|---|---|---|---|---|---|
| **Gioia grande** | giornata chiusa, rituale chiuso, traguardi dei giorni di fila, «pronto» | `#fee9fa` / `#281625`; raggi `#fbdbf5` / `#361c32` | 26-36 pezzi (oro, Segno, rovescio); −30% nello scuro | «Giornata chiusa» in `--azione-testo` (6,56:1 chiaro, 8,39:1 scuro) | velo ≤ 2,5 s, al massimo una volta al giorno più i traguardi |
| **Gioia piccola** | cosa fatta, spunta | nessun velo. Il cerchio diventa `--successo-pieno` in ≤ 100 ms e resta 300 ms | 6-10 scintille oro e Segno entro 60 px | XP su pastiglia `--oro` con `--testo-su-oro` (8,55:1 / 13,48:1) | ≤ 700 ms |
| **Calma** | attesa, timer in corso, Oggi vuoto | `--pagina` | nessuna | `--testo-2` | cicli ≥ 2 s, nessun cambio di colore |
| **Comprensione** | «Non ce l'ho fatta», giorno vuoto, serie interrotta | `#f3ede7` / `#191512` (carta in ombra) | nessuna, o un solo bagliore oro se c'è un pezzo fatto | `--testo-1`; **mai** ruggine o oro come stato | 3 s («capisce») |
| **Bentornato** | rientro dopo giorni d'assenza | `#fdf2dd` / `#21190d` (luce d'alba, oro tenue) | 3-4 scintille oro | nome in `--azione-testo` | 3,5 s; mai i giorni di fila in vista |
| **Concentrazione** | timer | i token dello scuro (non un quinto nero) | nessuna | anello `--azione-linea` scuro; in pausa `--testo-3`; alla fine l'anello diventa `--oro` e passa a Segno «concentrazione» | ingresso 400 ms |

---

## 7. Regole d'uso

1. **Un colore, un significato.** Ciclamino = agisci / LifeMax. Verde = fatto. Oro = ricompensa e giorni di fila. Ruggine = distruzione irreversibile. Le aree = categoria. Nient'altro ha una tinta.
2. **Un solo pieno ciclamino per schermata.** È sempre il pulsante principale, anche «Fatto» sulla scheda Adesso, per abitudini e azioni: la mano impara dove andare. Il verde arriva **dopo**, come conferma sul posto (≤ 100 ms, visibile ≥ 300 ms).
3. **Il selezionato è tonale, il primario è pieno.** Chip, voti, giorni: `--azione-tenue` + `--azione-testo` + un bordo di 1,5 px. Mai pieno: oggi «selezionato» e «primario» hanno lo stesso peso.
4. **Il fuoco è un anello doppio**: 2 px `--pagina` + 2 px `--focus`. Sul pieno il focus da solo fa 1,28:1 (chiaro), quindi l'anello di pagina in mezzo è obbligatorio.
5. **Le aree sono solo icona, puntino o chip con etichetta.** Mai il fondo di una scheda grande: la scheda Adesso è neutra (`--superficie-1`) con il chip d'area. Il colore d'area non è mai l'unico canale (1.4.1): i puntini del Mese mostrano l'icona al tocco.
6. **Niente colore d'allarme sugli stati della persona.**
   - «In ritardo» è `--testo-2` con l'icona dell'orologio.
   - «Mancata» è grigia con bordo tratteggiato.
   - «Scarta», «Termina l'abitudine» e «Non funziona» sono neutri.
   - La ruggine compare solo nella conferma di una cancellazione definitiva, sempre con icona e parola.
   - **Non esiste un token «attenzione»**: gli avvisi di sistema (notifiche bloccate, sincronizzazione) sono neutri, `--superficie-2` più icona.
7. **L'oro non sta mai da solo sul chiaro.**
   - Come fiamma ha il contorno `--testo-su-oro` (8,55:1).
   - Come ricompensa è una pastiglia con testo scuro.
   - Sulla carta da solo fa 1,75:1: va bene solo per le particelle decorative.
   - L'oro non si muove se non quando la serie cresce: niente fiamma che guizza all'infinito.
8. **Segno non è mai vicino a un errore**, né in un foglio con un'azione distruttiva. Questa regola copre anche il limite in tritanopia dello scuro (§8.2).
9. **Grafici.** I dati di «fatto» (Costanza, anelli del mese) usano la rampa del successo. I grafici «per area» usano le aree. Mai il blu di Studio per dati generici.
10. **Coriandoli e feste** leggono solo i token: una sola palette in tutto il codice, al posto delle due di oggi (`moto.ts:49`, `app.ts:6439`).
11. **Modo «colore ridotto»** (da offrire nelle impostazioni, per la sensibilità sensoriale): azione a C 0,09, nessuna particella, stanze = pagina. La conferma verde e l'XP restano.
12. **Il logo e l'icona dell'app.** La sagoma di Segno in ciclamino sulla carta `#f9f6f2`. Su una griglia di icone sature e piene, un'icona chiara con un nastro si distingue. *Da verificare con un test di riconoscimento in griglia.*

---

## 8. Verifica numerica (output completo in `verifica.txt`)

Le funzioni sono quelle di `palette.py`, verificate: il rosso sRGB dà OKLab L 0,628, C 0,258, h 29,2°, come nel riferimento di Ottosson, e bianco su nero fa 21:1. In `lib.py` ho aggiunto il controllo di gamut e le matrici di Machado per protanopia e tritanopia, applicate in RGB lineare come per la deuteranopia.

### 8.1 Contrasti WCAG 2.2: **0 FAIL su 168 coppie con soglia** (più 8 informative)

| Coppia | Chiaro | Scuro | Soglia |
|---|---|---|---|
| testo-1 su pagina / sup-1 / sup-2 / sup-3 | 14,95 / 16,11 / 14,17 / 12,93 | 16,54 / 15,13 / 13,48 / 11,43 | 4,5 |
| testo-2 su pagina … sup-3 | 7,57 … 6,55 | 10,93 … 7,55 | 4,5 |
| testo-3 / segnaposto su pagina … sup-3 | 5,58 … **4,83** | 8,30 … 5,73 | 4,5 |
| azione-testo su pagina / sup-1 / azione-tenue | 7,00 / 7,55 / 6,47 | 9,42 / 8,62 / 6,88 | 4,5 |
| bianco su azione / hover / premuta | 5,89 / 7,26 / 8,53 | 5,89 / 4,95 / 6,95 | 4,5 |
| bianco su successo-pieno / errore-pieno | 5,68 / 9,00 | 5,68 / 9,00 | 4,5 |
| successo-testo su sup-1 / su tenue | 6,49 / 5,67 | 7,41 / 5,89 | 4,5 |
| errore-testo su sup-1 / su tenue | 9,00 / 7,72 | 6,74 / 5,69 | 4,5 |
| testo-su-oro su oro (XP) | 8,55 | 13,48 | 4,5 |
| testo-1 su stanze gioia / capisce / bentornato | 14,0 / 13,9 / 14,5 | 14,7 / 15,7 / 15,0 | 4,5 |
| **linea-controllo** (bordi dei campi, spunta vuota, interruttore spento) su pagina / sup-1 / sup-2 | 3,65 / 3,93 / 3,46 | 4,45 / 4,07 / 3,63 | 3 |
| azione-linea come icona su pagina / sup-1 | 5,46 / 5,89 | 9,42 / 8,62 | 3 |
| successo come icona su pagina / sup-1 | 3,48 / 3,75 | 8,10 / 7,41 | 3 |
| errore come icona su pagina / sup-1 | 8,35 / 9,00 | 3,72 / 3,40 | 3 |
| focus su pagina / sup-1 | 7,00 / 7,55 | 9,42 / 8,62 | 3 |
| focus contro il pieno d'azione | 1,28 | 2,90 | → anello doppio obbligatorio |
| **sagoma di Segno** su pagina / sup-1 / sup-2 | 4,40 / 4,74 / 4,17 | 4,03 / 3,69 / 3,29 | 3 |
| occhi su corpo / rovescio su corpo | 3,52 / 2,72 | uguali | 3 / informativo |
| oro con contorno inchiostro | 8,55 | 13,48 | 3 |
| icone delle 8 aree su sup-1 (min–max) | 3,52 (Altro) – 7,02 (Relazioni) | 6,17 – 11,30 | 3 |
| testo d'area su chip tenue (min) | 5,97 | 6,64 | 4,5 |

Rispetto all'oggi questo chiude tutti i FAIL del rapporto-sistema: bordo dei campi da 1,36 a 3,93; spunta vuota da 1,46 a 3,65; interruttore spento da 1,05 a 3,46; segnaposto da 4,13 a 5,29 su sup-2; `--ok` come icona da 2,74 a 3,75; 5 aree su 8 sotto 3:1 diventano 0.

### 8.2 Distanze ΔE OKLab ×100

Semantici = azione, azione-linea, Segno, successo, errore, oro. Le coppie interne alla marca (azione/azione-linea/Segno) sono la stessa tinta per scelta.

| Tema | Visione | **Min semantici** | Coppia | Min aree↔aree | Min aree↔semantici |
|---|---|---|---|---|---|
| chiaro | normale | **21,3 ✓** | azione↔errore | 9,1 (Relazioni↔Lavoro) | 9,9 (Finanze↔successo) |
| chiaro | deuteranopia | **16,5 ✓** | Segno↔successo | 5,6 | 6,8 |
| chiaro | protanopia | **15,6 ✓** | successo↔oro | 3,0 | 5,3 |
| chiaro | tritanopia | 11,8 ✗ | azione↔errore | 3,1 | 4,5 |
| scuro | normale | **18,3 ✓** | azione↔errore | 7,8 | 8,8 |
| scuro | deuteranopia | **15,2 ✓** | azione-linea↔successo | 5,8 | 3,0 |
| scuro | protanopia | **16,0 ✓** | successo↔oro | 2,6 | 4,2 |
| scuro | tritanopia | 5,2 ✗ | Segno↔errore | 2,1 | 5,9 |

Le matrici complete 14×14, normale e deuteranopia per tema, sono in `verifica.txt`.

Estratto dal chiaro, visione normale:

| | azione | Segno | successo | errore | oro |
|---|---|---|---|---|---|
| azione | | 5,1 | 33,5 | 21,3 | 39,3 |
| Segno | 5,1 | | 32,8 | 24,3 | 36,0 |
| successo | 33,5 | 32,8 | | 27,7 | 23,9 |
| errore | 21,3 | 24,3 | 27,7 | | 39,7 |
| oro | 39,3 | 36,0 | 23,9 | 39,7 | |

**Come ci sono arrivato** (le correzioni, in `esplorazione/`):
- Il primo tentativo (successo h 158, errore L 0,50) falliva in deuteranopia: successo↔errore 5,3, errore↔oro-testo 1,2.
- Le correzioni:
  - la marca è passata da 340° a **332°**: più blu in deuteranopia;
  - l'errore è sceso a **L 0,42**;
  - il successo è salito a **L 0,60, h 138**;
  - ho tolto il «testo oro» marrone, che collideva con l'errore: l'oro è solo pieno chiaro con testo scuro.
- Nello scuro l'oro a L 0,84 era a 13,5 dal successo. È salito a **L 0,92**, e l'errore-icona è sceso a L 0,55, per avere ΔL fra i tre.

**I compromessi dichiarati:**
1. **Tritanopia** (circa 1 persona su 10.000): Segno↔errore nello scuro vale 5,2, perché sono quasi alla stessa luminosità. Lo coprono la regola 8 (Segno mai vicino a un errore) e l'icona e la parola sempre presenti sull'errore. Alzare l'errore scuro avrebbe fatto crollare successo↔errore in deuteranopia (circa 1 uomo su 100): ho scelto di proteggere il caso molto più frequente.
2. **Aree.** Con 13 colori distinti a luminosità da icona, il massimo trovato dall'ottimizzazione è circa 9-10 in visione normale: ho fatto 14 ripartenze, e con le tinte libere arriva a 10,6. In deuteranopia alcune aree finiscono a 3-6. Lo coprono SC 1.4.1 (icona ed etichetta sempre), la regola 5 e il fatto che aree e semantici non condividono mai un ruolo, perché un'area non è mai uno stato.
3. **Differenziazione da Habitica:** ΔE 14,3, appena sotto 15. Spostando la marca a 338° si arriverebbe a 16,4, ma i semantici in deuteranopia scenderebbero a 14,4. Ho scelto l'accessibilità. La differenza resta di **categoria di nome** (viola-blu contro ciclamino) ed è da verificare (§10).

### 8.3 Distanza dall'esistente

Il nuovo Segno dista:
- 14,3 dal corallo attuale;
- 20,1 dall'indaco attuale;
- 20,9 da Lavoro attuale.

Nessuna delle collisioni misurate nel rapporto-sistema sopravvive:
- fiamma = Founder;
- `--serie-1` = Studio;
- Lavoro ≈ azione;
- «fatto» ≈ Associazioni;
- avviso ≈ Finanze;
- Altro ≈ critico.

---

## 9. Cosa cambia rispetto alle tre analisi di partenza

| Proposta dei revisori | Giudizio |
|---|---|
| Identità: «Corallo Segno» come marca | **Respinta.** La diagnosi era giusta (marca = mascotte), il colore no: il corallo sta nel rosso di Todoist e Airbnb e nel contesto di prestazione di Elliot & Maier, e costringe a un mattone dell'errore a soli ΔE 14. Ne tengo: marca = mascotte, neutri caldi, la fiamma diventa oro, Altro non è più rosso |
| Emozione: Segno accento a parte, azione indaco | **Respinta in parte.** L'indaco è il default di Tailwind e della categoria. Tengo le stanze emotive, le regole del movimento (R1-R13) e «il verde non entra nelle feste» |
| Sistema: token a tre livelli, vincoli numerici | **Adottata.** Ogni vincolo di §7.2 del rapporto-sistema è rispettato o dichiarato. Ho aggiunto l'abolizione dell'«attenzione» |

---

## 10. Limiti e cosa resta da testare con utenti reali

1. **Denominazione e categoria.** Un test online con 50-100 italiani: «come chiami questo colore?» su `#b744ab` e `#a6339b`, accanto a Habitica e Tiimo. Se più del 40% dice «viola», la marca va spinta verso 338-340° e i semantici vanno rifatti (lo script lo permette).
2. **Lettura di genere.** Differenziale semantico sulle cinque dimensioni di Aaker, con adulti con ADHD di genere diverso: A contro B contro il corallo attuale. Attesa: sincerità ed eccitazione alte, nessuna penalità di genere sopra una soglia decisa prima.
3. **Color-in-context.** L'effetto rosso→evitamento è stato misurato col rosso, non col magenta. Un test di comportamento: tempo per toccare «Inizia» dopo un «Non ce l'ho fatta», con il ciclamino contro un neutro, misurato dentro l'app.
4. **Daltonismo reale.** Le simulazioni di Machado sono un modello. Serve una prova con 5-8 persone con discromatopsia vera, sui puntini del Mese e su fatto/errore.
5. **Sensibilità sensoriale.** Il ciclamino a C 0,19 su OLED nero può «vibrare». Prova su schermi OLED reali e decisione sul default del modo «colore ridotto».
6. **Icona in griglia.** Riconoscimento dell'icona dell'app in una griglia di 24 icone, a 60 px, contro le varianti piena e chiara.
7. **Display P3 e stampa.** I valori sono sRGB. Su P3 il ciclamino potrebbe avere più croma: per ora è meglio non usarlo, per tenere la marca uguale ovunque. Per la stampa serve una conversione CMYK con prova colore: il magenta stampa bene, ma il ciclamino a L 0,58 va controllato.
8. **Labrecque & Milne:** ho verificato direttamente solo i legami blu→competenza e rosso→eccitazione. Le associazioni di rosa e luminosità sono riferite a memoria e vanno controllate sulle tabelle dell'articolo prima di citarle all'esterno.
9. **Icone dei concorrenti:** sono un'istantanea (23/11/2026) e possono essere stagionali (Duolingo). Le palette interne delle app possono differire dall'icona.
10. **Aree:** l'ottimizzazione è un ottimo locale. Se in futuro le aree diventassero personalizzabili dall'utente, i vincoli vanno controllati all'inserimento con `verifica.py`.

---

## 11. Fonti

**Metodo e marca**
- Wheeler, A. (2017). *Designing Brand Identity* (5ª ed.). Wiley.
- Aaker, J. L. (1997). Dimensions of brand personality. *Journal of Marketing Research*, 34(3), 347-356.
- Mark, M., & Pearson, C. S. (2001). *The Hero and the Outlaw*. McGraw-Hill.
- Labrecque, L. I., & Milne, G. R. (2012). Exciting red and competent blue: the importance of color in marketing. *Journal of the Academy of Marketing Science*, 40(5), 711-727. https://doi.org/10.1007/s11747-010-0245-y

**Colore ed emozione**
- Valdez, P., & Mehrabian, A. (1994). Effects of color on emotions. *Journal of Experimental Psychology: General*, 123(4), 394-409. https://pubmed.ncbi.nlm.nih.gov/7996122/
- Wilms, L., & Oberfeld, D. (2018). Color and emotion: effects of hue, saturation, and brightness. *Psychological Research*, 82, 896-914. https://doi.org/10.1007/s00426-017-0880-8
- Elliot, A. J., Maier, M. A., Moller, A. C., Friedman, R., & Meinhardt, J. (2007). Color and psychological functioning: the effect of red on performance attainment. *JEP: General*, 136(1), 154-168.
- Elliot, A. J., Maier, M. A., Binser, M. J., Friedman, R., & Pekrun, R. (2009). The effect of red on avoidance behavior in achievement contexts. *Personality and Social Psychology Bulletin*, 35(3), 365-375. https://pubmed.ncbi.nlm.nih.gov/19223458/
- Elliot, A. J., & Maier, M. A. (2012). Color-in-context theory. *Advances in Experimental Social Psychology*, 45, 61-125.
- Elliot, A. J., & Maier, M. A. (2014). Color psychology: effects of perceiving color on psychological functioning in humans. *Annual Review of Psychology*, 65, 95-120.
- Meier, B. P., et al. (2012). Color in context: psychological context moderates the influence of red on approach- and avoidance-motivated behavior. *PLoS ONE*, 7(7), e40333. https://pmc.ncbi.nlm.nih.gov/articles/PMC3394796
- Jonauskaite, D., et al. (2020). Universal patterns in color-emotion associations are further shaped by linguistic and geographic proximity. *Psychological Science*, 31(10), 1245-1260. https://biopen.bi.no/bi-xmlui/bitstream/11250/2761614/1/Jonauskaite_etal_2020_PsychScience.pdf
- Hemphill, M. (1996). A note on adults' color-emotion associations. *Journal of Genetic Psychology*, 157(3), 275-280.
- Singh, S. (2006). Impact of color on marketing. *Management Decision*, 44(6), 783-789 (citata solo per segnalarne la debolezza).
- Itten, J. (1961). *Kunst der Farbe*. Ravensburg: Otto Maier. Albers, J. (1963). *Interaction of Color*. Yale University Press.
- Berlin, B., & Kay, P. (1969). *Basic Color Terms*. University of California Press.
- Healey, C. G. (1996). Choosing effective colours for data visualization. *Proc. IEEE Visualization '96*, 263-270.

**ADHD**
- Shaw, P., Stringaris, A., Nigg, J., & Leibenluft, E. (2014). Emotion dysregulation in attention deficit hyperactivity disorder. *American Journal of Psychiatry*, 171(3), 276-293.
- Beaton, D. M., Sirois, F., & Milne, E. (2022). Experiences of criticism in adults with ADHD: a qualitative study. *PLoS ONE*, 17(2), e0263366.
- Rowney-Smith, A., Sutton, B., Quadt, L., & Eccles, J. (2026). The lived experience of rejection sensitivity in ADHD: a qualitative exploration. *PLOS One*, 21(1), e0314669 (preprint medRxiv 2024: https://medrxiv.org/content/10.1101/2024.11.16.24317418).
- Volkow, N. D., et al. (2009). Evaluating dopamine reward pathway in ADHD. *JAMA*, 302(10), 1084-1091.
- Sonuga-Barke, E. J. S. (2003). The dual pathway model of AD/HD. *Neuroscience & Biobehavioral Reviews*, 27(7), 593-604.
- Bijlenga, D., Tjon-Ka-Jie, J. Y. M., Schuijers, F., & Kooij, J. J. S. (2017). Atypical sensory profiles as core features of adult ADHD, irrespective of autistic symptoms. *European Psychiatry*, 43, 51-57. https://pubmed.ncbi.nlm.nih.gov/28371743/
- Tannock, R., Banaschewski, T., & Gold, D. (2006). Color naming deficits and ADHD: a retinal dopaminergic hypothesis. *Behavioral and Brain Functions*, 2, 4. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1403787/
- Kim, S., et al. (2014). Colour vision in ADHD: Part 1 e Part 2. *Behavioral and Brain Functions*, 10, 38-39. https://behavioralandbrainfunctions.biomedcentral.com/articles/10.1186/1744-9081-10-38

**Accessibilità e spazi colore**
- W3C (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*, SC 1.4.1, 1.4.3, 1.4.11, 2.4.7, 2.4.11. https://www.w3.org/TR/WCAG22/
- Machado, G. M., Oliveira, M. M., & Fernandes, L. A. F. (2009). A physiologically-based model for simulation of color vision deficiency. *IEEE TVCG*, 15(6), 1291-1298.
- Ottosson, B. (2020). *A perceptual color space for image processing* (OKLab). https://bottosson.github.io/posts/oklab/ · W3C *CSS Color Module Level 4* (oklch, gamut mapping).

**Concorrenti**
- Icone: iTunes Search API, App Store Italia, 23/11/2026 (`icone/icone.json` con i link alle schede).
- Duolingo Feather Green: https://design.duolingo.com.
- Valori di confronto da aggregatori, coerenti con le misure: Todoist `#E44332`, TickTick `#4772FA`, Phantom `#AB9FF2`.

**Cultura italiana**
- Maglia rosa del Giro d'Italia, dal 1931, dal colore della carta della *Gazzetta dello Sport*.
- La «matita rossa e blu» della correzione scolastica.
- L'espressione «essere al verde».
