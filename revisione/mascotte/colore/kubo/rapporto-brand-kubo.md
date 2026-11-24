# LifeMax: il sistema colore di marca a partire da Kubo

*Questo lavoro segue lo stesso metodo del sistema «Ciclamino» (`../brand/rapporto-brand.md`): prima strategia e ricerca, poi i colori, poi la verifica numerica. Il Ciclamino resta come lavoro fatto; da qui in avanti **la marca segue Kubo**. La tinta di Kubo è un dato fisso. Propongo solo ritocchi di valore e saturazione, ciascuno motivato. Non ho toccato i file del progetto.*

**Cosa c'è in questa cartella (`brand-kubo/`)**
- `rapporto-brand-kubo.md`: questo documento.
- `token.json` e `token.css`: i valori, generati da `sistema.py`, che è l'unica fonte.
- `verifica.py` → `verifica.txt`: tutti i contrasti WCAG, le matrici ΔE in visione normale, deuteranopia, protanopia e tritanopia, il blu di Kubo contro le aree e contro i concorrenti.
- `tavola.html` → `tavola-kubo.png` (e `@2x`): la tavola visiva.
- `misura_kubo.py` → `misure-kubo.json`: i colori di Kubo misurati sulle immagini.
- `codici.py` → `codici.json`: i «codici» a 4 colori dei concorrenti.
- `tessere.py`, `tessere-analisi.md`: i colori delle tessere-emozione.
- `ritaglia.py` → `ritagli/`: Kubo scontornato per la tavola.
- `esplorazione/`: le ricerche numeriche che hanno portato ai valori.

---

## 0. In breve

**La marca è il blu di Kubo.** Il blu canonico proposto è **`#0151e3`**, oklch(50% 0.23 262). Ha la stessa tinta del blu misurato su Kubo (`#185fea`, 53,5% 0,221 262), luminosità 0,035 più bassa e croma al massimo che lo sRGB permette a quella tinta. Lo scarto dall'originale è ΔE 3,7: sulle immagini esistenti quasi non si vede. Lo stesso blu è il **pulsante principale**, con il bianco sopra a 6,4:1, identico nei due temi.

**Il visore diventa l'inchiostro**, con il croma ridotto:
- tema chiaro: testo `#1a2135`, «blu notte» su **carta calda** `#f9f6f2`;
- tema scuro: è **il visore stesso**. La pagina è `#0c0f18` e il testo `#f1eee9`, bianco caldo come gli occhi-luce di Kubo.

I semantici:
- **oro = ricompensa e giorni di fila**: sono le scintille di Kubo, `#fec72d`, invariate;
- **verde smeraldo = fatto**: `#029678`, pieno `#04755d`;
- **ruggine = errore**: `#7e2401`, solo per la distruzione irreversibile;
- **nessun giallo d'«attenzione»**.

**Le aree.** Studio non è più blu: diventa viola-ardesia `#7167a7`, a ΔE 15,9 dal blu di Kubo. Le tessere-emozione multicolori vanno disciplinate in **5 stanze**.

**Il problema del blu affollato è vero**:
- il blu di Kubo dista ΔE 9 da Things, 9,3 da Calm e 12,3 da TickTick;
- il «codice» bianco + blu + blu notte di Things e quello bianco + blu + giallo di TickTick distano appena 9,4-9,5 dal codice di Kubo.

La differenziazione non può venire dalla tinta. Secondo Sharp e Romaniuk viene da un **insieme di asset distintivi usati sempre uguali**:
1. **Kubo** come asset principale;
2. la **coppia complementare blu elettrico + oro** (175° di tinta) dentro il codice a quattro: corpo bianco, visore notte, blu, oro;
3. la **sfumatura specifica**: più profonda e satura dei blu della categoria;
4. la **carta calda** al posto del bianco ottico dei concorrenti;
5. la **proporzione**: il blu al 10%, mai come fondo.

**Verifica**:
- 0 FAIL su 161 coppie WCAG con soglia;
- fra marca e semantici **ΔE ≥ 15 in visione normale, deuteranopia e protanopia, in tutti e due i temi** (minimo 15,0);
- in tritanopia il chiaro scende a 9,6 (blu ↔ verde smeraldo): è il compromesso dichiarato.

---

## 1. Strategia: cosa cambia con Kubo

**Il posizionamento non cambia.** LifeMax tiene il segno della giornata a chi ha una testa ADHD: una cosa alla volta, mai colpa.

**Cambia la personalità che porta la mascotte.**
- Segno era un oggetto affettivo, un nastro di raso. Kubo è un **aiutante**: un robottino morbido, rotondo, con un visore-schermo e due occhi-luce.
- Per Aaker (1997) Kubo porta subito la **competenza**: un robot, uno schermo, il blu. Labrecque & Milne (2012) legano proprio il blu alla competenza.
- La **sincerità e il calore**, che sono la dimensione principale del tono dichiarato, devono venire dal resto: la forma morbida, gli occhi ad arco, l'oro, la carta.
- Archetipo: si passa da Caregiver puro a **Caregiver + Saggio-aiutante** (Mark & Pearson 2001). È «il compagno che sa fare», non l'Eroe.

**Il requisito che ne viene: il colore deve tenere insieme fiducia e calore senza diventare freddo.** È il tema delle sezioni 3 e 4.

**Il pubblico.** Restano valide le evidenze del rapporto Ciclamino (§1.2), che riassumo con le conseguenze per questo sistema:
- disregolazione emotiva (Shaw et al. 2014) e sensibilità alla critica (Beaton et al. 2022; Rowney-Smith et al. 2026): niente colori d'allarme sugli stati della persona;
- ricompensa immediata (Volkow et al. 2009; Sonuga-Barke 2003): un colore della ricompensa dedicato, l'oro;
- sensibilità sensoriale (Bijlenga et al. 2017): una sola massa satura per schermata;
- percezione dell'asse blu-giallo (Tannock, Banaschewski & Gold 2006; Kim et al. 2014): **qui è più rilevante di prima, perché blu e oro sono proprio quell'asse** (§4.3);
- ritmo circadiano (Bijlenga et al. 2019): la fase del sonno ritardata riguarda il 73-78% di chi ha l'ADHD (§4.3).

---

## 2. Kubo misurato, e i ritocchi proposti

**Metodo.** Ho preso le 6 figure singole (immagini 0, 1, 4, 15, 16, 19 dello zip). Ho classificato i pixel in OKLCH e preso la mediana per classe (`misura_kubo.py`).

| Parte | Misurato (mediana, 6 figure) | Variazione fra figure | Valore dato dal fondatore |
|---|---|---|---|
| Blu: antenna, orecchie, piedi | `#185fea`, oklch(53.5% 0.221 262) | L 0,50-0,55; C 0,21-0,24; h 260-263° | `#0f5ee8` |
| Visore | `#1f2d65`, oklch(32% 0.100 269) | L 0,29-0,34; h 267-276° | `#1b2a62` |
| Corpo, mezzitoni | `#e2e4fb`, oklch(92.4% 0.031 282) | L 0,91-0,94; C 0,024-0,035 | `#dcdff3` |
| Scintille | `#fec72c`, oklch(85.6% 0.166 87) | L 0,80-0,87; h 74-90° (la figura 1 ha scintille più arancio, `#feab03`) | `#fec72c` |
| Occhi | bianco puro | | |
| Guance (figure 15, 16) | trattini rosa-lilla sul visore | | |

**Ritocchi proposti.** La tinta resta fissa ovunque.

1. **Blu: luminosità da 0,535 a 0,50, croma da 0,221 a 0,23 (il massimo sRGB a 262°).** Il canonico è `#0151e3`. Le ragioni:
   - **Contrasto.** Il bianco sul pieno passa da 5,44 a **6,39:1**: c'è margine per l'hover e per le etichette piccole. L'icona sulla carta passa da 5,04 a 5,93:1.
   - **Specificità** (§3). Il canonico si allontana dal «blu di categoria», più chiaro e meno saturo:
     - da Things: da 9,0 a **12,7**;
     - da Calm: da 9,3 a **12,7**;
     - da TickTick: da 12,3 a **15,9**.
     Un blu al croma massimo a quella chiarezza si possiede meglio (l'esempio classico è il «blu Klein»): un concorrente non lo raggiunge per caso.
   - **Costo.** ΔE 3,7 dall'originale: le immagini esistenti restano dentro una tolleranza da stampa. **Non occorre ridisegnarle.** Il canonico vale per vettori, interfaccia e nuove illustrazioni.
   - La tavola, sezione 2, mostra il ricoloramento fatto con un canvas in Playwright: originale, canonico, anti-esempio «blu di categoria» (L 0,62, C 0,18) e canonico sulla pagina scura.
2. **Visore: invariato come parte di Kubo** (`#1d2a62`). **Diventa l'inchiostro di marca**, con il croma ridotto da 0,10 a 0,04 e L 0,25 (`#1a2135`). Le ragioni:
   - **Sì all'inchiostro.** Il visore è la parte più scura e più grande di Kubo dopo il corpo. Testo e visore della stessa famiglia (ΔE 8,4) legano tutta l'interfaccia alla mascotte. È il principio di Albers: i neutri prendono la tinta dominante. E l'inchiostro blu-nero sulla carta è il **quaderno** della scuola italiana: la penna blu è la scrittura, non la correzione.
   - **Ma non al croma pieno.** Un testo con C 0,10 si legge come **blu**, e un testo blu è la convenzione del **link**. Il corpo del testo deve sembrare quasi neutro, così il blu di Kubo resta il segnale «puoi toccare». Inoltre il testo saturo su grandi superfici alza l'attivazione (Valdez & Mehrabian 1994).
   - **Tema scuro = il visore.** La pagina scura è il visore schiarito verso il nero (L 0,17, C 0,02, h 270). Il testo è bianco-carta, come gli occhi-luce. È una metafora che si può spiegare: *di notte guardi dentro lo schermo di Kubo*.
3. **Corpo: invariato.** Il corpo bianco su qualsiasi pagina chiara fa 1,17-1,26:1, e nessun ritocco ragionevole lo porta a 3:1. La sagoma la portano le parti che servono a riconoscerlo: **il visore (12,5:1 sulla carta) e il blu (5,9:1)**, come prevede SC 1.4.11 per le «parti necessarie a capire la grafica». Sullo scuro il corpo fa 15:1.
4. **Scintille: invariate, diventano il token `--oro`.** Sono l'unica parte calda di Kubo, e sono già il gesto della festa. Le scintille arancio della figura 1 (`#feab03`) vanno riportate a `#fec72d` nelle prossime illustrazioni, per avere un solo oro.
5. **Ombra a terra.** Nell'interfaccia diventa notte al 35% (`rgba(20,26,60,.35)`), non lavanda fissa: sullo scuro una macchia lavanda sarebbe un errore. Nei ritagli l'ho già resa così.

---

## 3. Il blu è la tinta più affollata: come si diventa distinti lo stesso

### 3.1 Il problema, misurato

Dalla mappa delle icone dell'App Store italiano (23 app, 23/11/2026):
- 5 app su 23 sono blu fra 246° e 267°: Things, TickTick, Calm, Microsoft To Do, Any.do.
- Kubo misurato è a ΔE **9,0 da Things**, **9,3 da Calm** e **12,3 da TickTick**. Sotto 10, a colpo d'occhio, è «lo stesso blu».
- **Codici a 4 colori** (k-means in OKLab sull'icona, `codici.py`). Kubo è corpo 45%, visore 25%, blu 20%, oro 10%. I più vicini:
  - **Things**, a 9,4: bianco + blu + **blu notte `#0b2d62`**. È quasi il codice di Kubo senza l'oro.
  - **TickTick**, a 9,5: bianco/grigio + blu + **giallo `#febb13`**. È quasi il codice di Kubo senza il blu notte.
  - Microsoft To Do, a 9,5.
  - Inflow (app ADHD), a 9,3: menta pallido e blu notte.

Quindi né il blu da solo, né la coppia blu + giallo, sono unici nella categoria.

### 3.2 La teoria: distinzione, non differenziazione

- **Sharp (2010), *How Brands Grow*** (Ehrenberg-Bass). Le marche crescono con la **disponibilità mentale**: farsi riconoscere e ricordare nel momento dell'uso. La differenziazione percepita è modesta per quasi tutte le marche. Conta essere **distintivi**: avere elementi sensoriali che indicano la marca senza bisogno del nome.
- **Romaniuk (2018), *Building Distinctive Brand Assets*.** Un asset si valuta su due assi:
  - **notorietà** (fame): quanti acquirenti della categoria lo collegano alla marca;
  - **unicità** (uniqueness): quanto indica *solo* quella marca e non i concorrenti.
  La griglia distingue gli asset da proteggere (alti su tutti e due), i «segnali di categoria» (noti ma condivisi), gli asset emergenti su cui investire (unici ma poco noti) e i non-asset. **Il colore è l'asset più difficile da rendere unico, perché è il più condiviso fra concorrenti.** Lo segnalano anche gli studi sugli asset distintivi pubblicati sul *Journal of Brand Management*. Il colore funziona perché la marca lo **possiede con l'uso costante**, non per la tinta in sé (Romaniuk & Dunstone, materiale divulgativo dell'Ehrenberg-Bass). E una marca nuova parte dalla notorietà zero: deve **costruirla con la ripetizione** sugli asset più unici.
- **Personaggi di marca.** Gli spokescharacter funzionano come segnali sia nella comunicazione sia sul prodotto (Garretson & Burton 2005, *Journal of Marketing*). La fiducia nel personaggio media l'effetto sull'atteggiamento verso la marca (Garretson & Niedrich 2004, *Journal of Advertising*). Nessun concorrente misurato ha un robot: Finch ha un uccellino, Llama Life un lama, Goblin Tools un goblin, Tiimo e Headspace un viso astratto.
- **Itten, contrasto di complementari.** Blu 262° e oro 87° distano **175°**: è quasi la coppia complementare esatta. Per Itten è il contrasto più equilibrato e più «luminoso», e due complementari si rafforzano a vicenda. Una coppia fissa in proporzioni fisse è più unica di ciascuno dei due colori.

### 3.3 Le cinque leve, applicate

| Leva | Applicazione | Prova misurata |
|---|---|---|
| 1. **Kubo come asset principale** | compare nei momenti che contano (benvenuto, giornata chiusa, comprensione, timer), sempre uguale; la sua silhouette (antenna, visore con occhi ad arco) diventa logo e icona dell'app | 0 robot fra 23 concorrenti |
| 2. **Il codice a quattro**, non un colore | corpo bianco + visore notte + blu + oro, sempre insieme quando c'è Kubo; nell'interfaccia: carta + inchiostro notte + blu d'azione + oro di ricompensa | il codice di Kubo dista ≥ 9,3 da tutti; nessuno ha i quattro insieme (Things non ha l'oro, TickTick non ha il notte) |
| 3. **Sfumatura specifica** | blu canonico più profondo e saturo dei blu di categoria (L 0,50 contro 0,60-0,67) | ΔE 12,7 da Things e Calm, 15,9 da TickTick (prima del ritocco 9-12) |
| 4. **La carta** | pagina calda `#f9f6f2` dove i blu concorrenti usano bianco ottico | 3 dei 5 blu hanno l'icona su fondo bianco (Things 40%, TickTick 84%, Microsoft 80% di bianco); Calm e Any.do sono blu pieni |
| 5. **Proporzione e forma** | il blu non è mai un fondo grande: solo pulsante principale, linea attiva, Kubo (10%). L'oro sotto il 3%, solo come ricompensa. Le forme d'azione riprendono i «bottoni» rotondi di antenna, orecchie e piedi: pastiglie e pulsanti molto arrotondati | — (da verificare con il test di §10) |

**Cosa non si può ottenere:** il blu da solo non diventerà mai un asset unico di LifeMax. Kubo sì, se è costante. **Il primo asset da proteggere e misurare è Kubo, non il blu.**

---

## 4. Freddo contro tono caldo

### 4.1 Cosa dice la ricerca sul blu

| Fonte | Cosa dice | Solidità | Conseguenza |
|---|---|---|---|
| Valdez & Mehrabian 1994 | Blu e viola sono le tinte più piacevoli. La luminosità alza la piacevolezza, la saturazione l'attivazione | solida | Il blu è piacevole. Lo si tiene profondo e saturo solo in piccolo (pulsante, Kubo); le superfici restano chiare e poco sature |
| Palmer & Schloss 2010 (*PNAS*), teoria della valenza ecologica | Il blu piace perché si associa a cose amate: cielo limpido, acqua pulita | solida | Il blu non è «freddo» in senso affettivo: è *gradito*. Il freddo è percettivo (temperatura), non emotivo |
| Labrecque & Milne 2012 | Blu → competenza, fiducia | moderata | Coerente con Kubo-aiutante. Il rischio è sembrare «strumento»: lo compensano oro, carta e forma |
| Jonauskaite et al. 2020 | Le associazioni colore-emozione sono in gran parte universali; il giallo va con la gioia | solida | **Oro = gioia e ricompensa** ha una base, non è arbitrario |
| Elliot & Maier 2012/2014 | Il rosso in contesto di prestazione porta all'evitamento | moderata | Il blu evita il problema che aveva il corallo. L'errore resta ruggine spenta e raro |
| «Il blu calma / aumenta la produttività / è il colore dell'ADHD» | studi d'ambiente con esiti misti, divulgazione | **folklore** | Non usato come argomento |

### 4.2 Come si ottiene il calore con una marca blu

1. **Neutri caldi (carta, 75-85°) contro neutri freddi.** Il tono dichiarato è caldo. Il 60% dello schermo è la pagina: lì la temperatura si decide più che nel 10% blu.
   - Per Itten, il **contrasto caldo-freddo** fra la carta e il blu (e il corpo lavanda di Kubo) è la combinazione «vivace ma equilibrata».
   - Il costo, misurato: il corpo di Kubo si stacca un po' meno dalla carta che dal bianco puro (ΔE 6,2 contro 8,2), perché la carta è appena più scura. Il contrasto di tinta compensa solo in parte. Lo coprono il visore, il blu e l'ombra (§2.3).
2. **L'inchiostro è blu-notte su carta, il «quaderno»**: caldo e familiare, non il nero-su-bianco dell'ufficio.
3. **L'oro è il colore delle emozioni positive**: ricompensa, giorni di fila, stanza della gioia. Il blu è «agire», l'oro è «sentirsi bene»: la stessa divisione che il rapporto-emozione faceva fra indaco e corallo, qui con colori presi da Kubo.
4. **La forma e il viso**: arrotondamenti ampi, gli occhi ad arco di Kubo, le guance. Il calore lo porta il personaggio più di qualunque tinta.
5. **Il tema scuro è notte, ma il testo è bianco-carta caldo** (h 80), non bianco-blu.

### 4.3 ADHD: due rischi specifici del blu

- **Asse blu-giallo.** Gli studi su ADHD e colore indicano una discriminazione meno precisa proprio lungo l'asse blu-giallo e della saturazione di blu e rosso (Banaschewski et al. 2006; Tannock et al. 2006; Kim et al. 2014). Le prove sono preliminari. Blu e oro sono esattamente quell'asse, ma fra loro c'è una **differenza di luminosità di 0,36** (blu L 0,50, oro L 0,86): non si distinguono per tinta ma per chiaro-scuro. In più, nessuno stato si distingue per sola saturazione: tenue e pieno differiscono sempre di ΔL ≥ 0,4.
- **Luce blu e sonno.** Il 73-78% delle persone con ADHD ha una fase del sonno ritardata (Bijlenga et al. 2019). Ma un accento blu al 10% dello schermo pesa poco sulla luce che arriva all'occhio: conta la luminanza totale. La conseguenza utile è un'altra: **suggerire il tema scuro la sera** e non usare superfici blu grandi e luminose. Il tema scuro è notte a L 0,17, non un blu acceso.

---

## 5. Tre strutture, una griglia

Con la tinta fissata, le alternative non sono di tinta ma di **ruolo**: chi fa il pulsante principale?

| | **K1 · Blu d'azione** | K2 · Notte d'azione | K3 · Oro d'azione |
|---|---|---|---|
| Pulsante | blu di Kubo `#0151e3`, bianco 6,4:1 | visore `#1d2a62`, bianco 13,5:1 | oro `#fec72d`, inchiostro 10,2:1 |
| Il blu dove | pulsante, linea attiva, link, Kubo | solo Kubo e le illustrazioni | Kubo e i link |
| Problema | blu «di categoria» → lo compensano le leve di §3 | il pulsante è a ΔE 8,4 dall'inchiostro: azione e testo si confondono, è la stessa massa scura | **l'oro smette di essere ricompensa**: ogni tocco «premia», e si perde il colore della gioia (R1 del rapporto-emozione) |
| Coerenza con Kubo (Duo, Phantom) | alta: il pulsante è l'antenna e i piedi di Kubo | media | bassa |

| Criterio | Peso | K1 | K2 | K3 |
|---|---|---|---|---|
| Strategia (fiducia + calore, coerenza con Kubo) | 30% | 4 | 3 | 3 |
| Ricerca (ricompensa dedicata, niente allarmi, ADHD) | 20% | 5 | 4 | 2 |
| Distinzione (asset, codice) | 20% | 4 | 3 | 4 |
| Accessibilità | 15% | 5 | 5 | 4 |
| Sistema (semantici, temi, selezionato e link distinti) | 15% | 5 | 3 | 2 |
| **Totale** | | **4,50** | **3,55** | **3,05** |

**Scelgo K1.**

---

## 6. Il sistema finale «Kubo»: token

Tutti i valori sono in `token.json` e `token.css`.

| token | chiaro | OKLCH | scuro | OKLCH |
|---|---|---|---|---|
| --pagina | `#f9f6f2` | 97.4% 0.006 75 | `#0c0f18` | 17.0% 0.020 270 |
| --superficie-1 | `#ffffff` | | `#151924` | 21.5% 0.023 269 |
| --superficie-2 | `#f3f0eb` | 95.6% 0.007 81 | `#1f2430` | 26.1% 0.024 267 |
| --superficie-3 | `#e9e6e0` | 92.6% 0.009 85 | `#2b303f` | 31.1% 0.028 270 |
| --linea-decor | `#e0dcd5` | 89.6% 0.010 82 | `#303543` | 33.0% 0.026 270 |
| --linea-controllo | `#7d8089` | 60.0% 0.014 271 | `#7b808d` | 60.0% 0.021 269 |
| --testo-1 (inchiostro notte / carta) | `#1a2135` | 25.1% 0.039 269 | `#f1eee9` | 95.0% 0.007 81 |
| --testo-2 | `#494f61` | 42.9% 0.031 271 | `#c7c3bd` | 81.9% 0.009 78 |
| --testo-3 / segnaposto | `#5e6370` | 50.0% 0.022 269 | `#afaaa3` | 74.0% 0.011 77 |
| **--azione** (= blu di Kubo) | `#0151e3` | 50.0% 0.231 262 | `#0151e3` | uguale |
| --azione-hover | `#0045c6` | 45.0% 0.209 262 | `#1e64ef` | 55.0% 0.220 262 |
| --azione-premuta | `#003caf` | 41.0% 0.191 262 | `#0248ca` | 45.9% 0.210 262 |
| --azione-testo (link) | `#064cce` | 47.1% 0.210 262 | `#7daafd` | 74.0% 0.130 262 |
| --azione-linea (icone attive, ora, timer) | `#0151e3` | 50.0% 0.231 262 | `#719def` | 69.9% 0.130 262 |
| --azione-tenue (selezionato) | `#e7effe` | 95.1% 0.022 263 | `#1a2d51` | 30.1% 0.070 262 |
| --focus | `#064cce` | | `#7daafd` | |
| **--successo** | `#029678` | 60.0% 0.116 172 | `#6ce4c2` | 84.0% 0.120 172 |
| --successo-testo | `#046b55` | 47.1% 0.090 172 | `#6ce4c2` | |
| --successo-pieno | `#04755d` | 50.1% 0.096 172 | `#04755d` | |
| --successo-tenue | `#d8f7ec` | 95.1% 0.035 172 | `#0f3329` | 29.2% 0.045 172 |
| **--errore** (icona) | `#7e2401` | 39.9% 0.130 38 | `#b44e2e` | 55.0% 0.141 38 |
| --errore-testo | `#7e2401` | | `#e4896c` | 72.0% 0.119 38 |
| --errore-pieno | `#7e2401` | | `#7e2401` | |
| --errore-tenue | `#ffe9e3` | 95.0% 0.025 36 | `#3a221a` | 28.1% 0.040 39 |
| **--oro** (= scintille di Kubo) | `#fec72d` | 85.6% 0.165 87 | `#fec72d` | uguale |
| --oro-tenue | `#fbeec9` | 95.0% 0.050 91 | `#392c0c` | 30.1% 0.050 87 |
| --testo-su-oro | `#1a2135` | | `#1a2135` | |
| --kubo-blu / -visore / -corpo / -ombra / -occhi / -scintilla | `#0151e3` / `#1d2a62` / `#e2e4fa` / `#cbceef` / `#ffffff` / `#fec72d` | | uguali | |
| --stanza-gioia / -raggio | `#fcf0cf` / `#f8e5b1` | luce d'oro | `#2b2005` / `#382901` | |
| --stanza-calma | `#f9f6f2` (= pagina) | | `#0c0f18` | |
| --stanza-capisce | `#f3ede7` | carta in ombra | `#1c1712` | |
| --stanza-bentornato | `#edeffe` | il corpo di Kubo | `#191d34` | |
| --stanza-concentrazione | `#0c0f18` | il visore (anche nel chiaro) | `#0c0f18` | |

**Perché questi semantici.**
- **Oro = ricompensa.** Viene da Kubo stesso (le scintille), dalle associazioni universali giallo-gioia (Jonauskaite 2020) e dal complementare del blu (Itten). Nel chiaro non sta mai da solo: o porta testo inchiostro (10,2:1) o un contorno inchiostro (la fiamma).
- **Verde = fatto, ma smeraldo (172°).** Un verde prato (138-150°) sarebbe la convenzione più forte, ma nello scuro collide con l'errore in deuteranopia (ΔE 12,6). Lo smeraldo porta la coppia a ≥ 15 anche nello scuro (`esplorazione/congiunta.py`). Resta percepito come «verde».
- **Errore = ruggine spenta (38°, L 0,40).** Il principio dei rapporti precedenti resta: mai rosso d'allarme sugli stati della persona. Con una marca blu il rosso non collide più con la marca, ma con l'ADHD e la sensibilità alla critica resta raro e spento.
- **«Attenzione»: non esiste.** Il ritardo è neutro con l'icona dell'orologio. Un giallo d'avviso collimerebbe con l'oro, cioè con la ricompensa e con Kubo stesso.

**Le aree.** Ottimizzate in `esplorazione/aree.py`, con finestre di tinta con un senso, contro marca e semantici; nello scuro Studio e Associazioni sono state ritoccate per stare lontane dal blu schiarito.

| Area | Chiaro | OKLCH | Tenue / testo | Scuro | Tenue / testo scuro | ΔE dal blu di Kubo (chiaro / scuro) |
|---|---|---|---|---|---|---|
| Studio / Università | `#7167a7` | 55.0% 0.098 290 | `#eeecfe` / `#584d8b` | `#876cca` | `#28253b` / `#b3abe9` | **15,9 / 12,7** |
| Salute & Sport | `#bd754c` | 63.1% 0.107 50 | `#feeadf` / `#864317` | `#ffbe9a` | `#392316` / `#febe9b` | 35,1 / 26,1 |
| Relazioni & Sociale | `#934f71` | 51.9% 0.100 350 | `#fee7f1` / `#803e60` | `#d992b3` | `#38212c` / `#dd9ab9` | 24,9 / 16,4 |
| Finanze | `#8b7517` | 56.7% 0.109 95 | `#f5efd8` / `#685704` | `#cfb969` | `#2f2910` / `#cdba6e` | 34,4 / 24,9 |
| Associazioni | `#026678` | 47.0% 0.083 215 | `#d9f4fb` / `#026375` | `#568999` | `#0d2e35` / `#3dc4e1` | 18,6 / 13,7 |
| Progetti Founder | `#bc6ab3` | 64.1% 0.140 331 | `#fbe8f8` / `#82347b` | `#feb4f5` | `#342132` / `#ffb4f5` | 26,4 / 21,3 |
| Lavoro | `#467103` | 49.8% 0.135 131 | `#e7f3de` / `#3e6501` | `#88b55b` | `#222d18` / `#96c16d` | 33,5 / 23,7 |
| Altro / Esplorazione | `#635948` | 46.9% 0.029 81 | `#f9edd8` / `#605745` | `#a49a88` | `#302817` / `#bab09e` | 26,2 / 15,9 |

Note sulle aree:
- **Studio non è più blu**: oggi l'area Studio `#2a78d6` è a ΔE ≈ 10 dal blu di Kubo. Diventa un viola-ardesia, la tinta del «sapere» accanto al blu senza esserlo.
- **Salute diventa pesca-energia (50°)**, perché il verde ora è il «fatto» e lo smeraldo non può essere anche un'area.
- **Founder eredita il ciclamino** del sistema precedente (331°), oggi libero.

**Proporzioni:**
- 60% carta e superfici;
- 30% inchiostro notte;
- 10% blu di Kubo: un solo pieno per schermata, linea attiva, Kubo;
- oro, verde, ruggine e aree insieme sotto il 3%.

---

## 7. Kubo nel sistema, e le tessere-emozione

**Ruolo.** Kubo **coincide con la marca** (modello Duolingo/Phantom): il pulsante principale ha il blu dei suoi piedi e della sua antenna.
- Il rischio «la mascotte sembra un pulsante» qui è basso: Kubo è una figura bianca con un visore. Il blu sono solo le sue estremità.
- Regola: Kubo non è mai un controllo cliccabile.
- Dimensioni:
  - 96-120 px negli stati vuoti;
  - 56-72 px nei toast e nei fogli;
  - fino a 200 px nei momenti a schermo pieno.
- Sempre su fondo trasparente (scontornato), mai nel quadrato bianco dell'immagine originale.

**Le tessere colorate per emozione vanno disciplinate.** Ho campionato le 25 tessere con nome del foglio 6 (`tessere-analisi.md`):
- **8 famiglie di tinta per 25 voci, senza una regola**: blu 7, viola 5, verde 4, rosso-corallo 4, giallo 2, rosa 1, arancio 1, acqua 1.
- **La stessa tinta per emozioni opposte.** Il viola è Stanco, Confuso, Obiettivi, Focus e Benessere. Il blu è Felice e Riposo.
- **Emozioni e funzioni mescolate.** To-do, Obiettivi, Progressi, Abitudini, Studio e Alimentazione non sono emozioni.
- **Collisioni con i semantici:**
  - Motivato e Abitudini **sono l'oro** (ΔE 3,0 e 2,9): la ricompensa diventa una categoria;
  - Riposo è il blu di Kubo (ΔE 6,7);
  - Calmo, To-do ed Energico sono verdi come il «fatto»;
  - **Frustrato e Sovraccarico sono rossi** (corallo): è proprio il codice «penna rossa» sullo stato emotivo della persona, quello che la strategia esclude.
- **Fondi a gradiente saturi**: 25 masse sature in una griglia. È il contrario di «una sola massa satura per schermata» (Bijlenga 2017; rapporto-emozione).

**La disciplina** (tavola, sezione 5): **l'emozione la porta il viso di Kubo, il colore lo porta la stanza.**

| Stanza | Emozioni | Fondo chiaro / scuro | Di quale parte di Kubo è fatta |
|---|---|---|---|
| Gioia | felice, energico, motivato, soddisfatto, sorpreso, crescita, traguardo | `#fcf0cf` / `#2b2005`; particelle: oro 60%, blu 25%, bianco 15% | le scintille |
| Calma e focus | concentrato, calmo, focus, pausa, riposo, riflessione | la pagina, nessuna particella | la carta |
| Comprensione | stanco, frustrato, confuso, sovraccarico, stressato | `#f3ede7` / `#1c1712`; **mai rosso, mai oro come stato** | la carta in ombra |
| Bentornato / affetto | benessere, rientro, primo accesso | `#edeffe` / `#191d34` | il corpo lavanda |
| Concentrazione (timer) | timer in corso, fine sessione | `#0c0f18` anche nel chiaro; l'anello è `--azione-linea`, alla fine diventa oro | il visore |

Le **funzioni** (to-do, obiettivi, progressi, abitudini) usano superficie neutra più icona. Le **categorie che sono aree** (Studio, Allenamento → Salute, Alimentazione → Salute) usano il colore dell'area, solo come chip.

---

## 8. Regole d'uso

1. **Un colore, un significato:**
   - blu di Kubo = agisci / LifeMax;
   - smeraldo = fatto;
   - oro = ricompensa e giorni di fila;
   - ruggine = distruzione irreversibile;
   - aree = categoria.
2. **Un solo pieno blu per schermata.** È sempre il pulsante principale, compreso «Fatto» sulla scheda Adesso. Lo smeraldo arriva dopo, come conferma sul posto.
3. **Il selezionato è tonale**: `--azione-tenue` + `--azione-testo` + bordo da 1,5 px. Il link è `--azione-testo`. Il **testo normale non è mai blu saturo**.
4. **Il fuoco è un anello doppio**: 2 px pagina + 2 px focus. Il focus sul pieno fa 1,12:1 nel chiaro: senza l'anello di pagina in mezzo non si vede.
5. **L'oro non sta mai da solo sul chiaro** (1,45:1): o con testo inchiostro, o con contorno inchiostro, o come particella decorativa. Sullo scuro sta da solo (12,2:1).
6. **Kubo non sta mai accanto a un errore** e non ha versioni rosse o «tristi colorate»: la tristezza la porta il viso, nella stanza Comprensione.
7. **Le aree sono icona, puntino o chip con etichetta**, mai una superficie grande, mai l'unico canale (SC 1.4.1).
8. **Il blu non è mai un fondo grande.** Niente intestazioni blu, niente schede blu: il blu al 10% è ciò che lo rende distintivo invece che generico (§3.3).
9. **Il tema scuro è il visore.** Da suggerire la sera (§4.3). Il pieno d'azione e Kubo sono identici nei due temi.
10. **Una sola palette di festa**, letta dai token: oro, blu, bianco. Niente arcobaleno, niente verde.
11. **Modo «colore ridotto»** per la sensibilità sensoriale: azione a C 0,10, nessuna particella, stanze = pagina.
12. **L'icona dell'app**: la testa di Kubo (visore con gli occhi ad arco e antenna blu) su carta `#f9f6f2`. Si distingue dalle icone blu piene dei concorrenti per forma e per fondo. *Da testare (§10).*

---

## 9. Verifica numerica (`verifica.txt`)

### 9.1 WCAG 2.2: **0 FAIL su 161 coppie con soglia**

| Coppia | Chiaro | Scuro | Soglia |
|---|---|---|---|
| testo-1 su pagina / sup-1 / sup-2 / sup-3 | 14,85 / 16,00 / 14,07 / 12,84 | 16,54 / 15,17 / 13,41 / 11,36 | 4,5 |
| testo-2 su pagina … sup-3 | 7,57 … 6,55 | 10,91 … 7,49 | 4,5 |
| testo-3 / segnaposto su pagina … sup-3 | 5,58 … 4,82 | 8,30 … 5,70 | 4,5 |
| azione-testo (link) su pagina / sup-1 / tenue | 6,65 / 7,16 / 6,20 | 8,24 / 7,56 / 5,88 | 4,5 |
| bianco su azione / hover / premuta | **6,39** / 7,87 / 9,27 | 6,39 / 5,09 / 7,55 | 4,5 |
| bianco su successo-pieno / errore-pieno | 5,66 / 9,81 | 5,66 / 9,81 | 4,5 |
| successo-testo su sup-1 / tenue | 6,48 / 5,69 | 11,30 / 8,86 | 4,5 |
| errore-testo su sup-1 / tenue | 9,81 / 8,42 | 6,76 / 5,69 | 4,5 |
| testo-su-oro su oro (XP, giorni di fila) | 10,22 | 10,22 | 4,5 |
| testo-1 su stanze gioia / capisce / bentornato | 14,1 / 13,8 / 14,0 | 13,8 / 15,4 / 14,3 | 4,5 |
| linea-controllo su pagina / sup-1 / sup-2 | 3,66 / 3,95 / 3,47 | 4,84 / 4,44 / 3,93 | 3 |
| azione-linea su pagina / sup-1 | 5,93 / 6,39 | 7,08 / 6,50 | 3 |
| successo come icona su pagina / sup-1 | 3,46 / 3,73 | 12,32 / 11,30 | 3 |
| errore come icona su pagina / sup-1 | 9,11 / 9,81 | 3,71 / 3,40 | 3 |
| focus su pagina / sup-1 | 6,65 / 7,16 | 8,24 / 7,56 | 3 |
| **Kubo**: blu su pagina / sup-1 / sup-2 | 5,93 / 6,39 / 5,62 | 3,00 / 2,75 / 2,43 (informativo: sullo scuro la sagoma la porta il corpo) | 3 |
| **Kubo**: visore su pagina | 12,50 | 1,42 (dentro il corpo) | 3 |
| **Kubo**: corpo su pagina | 1,17 (informativo) | **15,23** | 3 |
| occhi su visore / blu su corpo | 13,46 / 5,08 | uguali | 3 |
| icone delle 8 aree su sup-1 (min) | 3,59 (Founder) | 4,20 (Studio) | 3 |

### 9.2 ΔE OKLab ×100

Semantici = azione, azione-linea, successo, errore, oro.

| Tema | Visione | **Min semantici** | Coppia limite | Min aree↔aree | Min aree↔semantici |
|---|---|---|---|---|---|
| chiaro | normale | **27,7 ✓** | azione↔successo | 10,4 | 13,1 |
| chiaro | deuteranopia | **20,4 ✓** | successo↔errore | 6,4 | 8,0 |
| chiaro | protanopia | **23,4 ✓** | successo↔oro | 1,6 (Relazioni↔Associazioni) | 6,5 |
| chiaro | tritanopia | 9,6 ✗ | azione↔successo | 4,0 | 6,6 |
| scuro | normale | **19,6 ✓** | successo↔oro | 9,8 | 9,3 |
| scuro | deuteranopia | **16,0 ✓** | successo↔oro | 6,3 | 6,3 |
| scuro | protanopia | **15,0 ✓** | successo↔oro | 3,8 | 6,7 |
| scuro | tritanopia | **15,2 ✓** | azione-linea↔successo | 3,0 | 1,3 (Salute↔oro) |

**Kubo contro Studio:** ΔE 15,9 nel chiaro, 12,7 nello scuro. La richiesta «Kubo e Studio non devono collidere» è soddisfatta.

**Come ci sono arrivato** (`esplorazione/`):
- Il primo set aveva il verde prato a 158°. Nello scuro dava successo↔errore 12,6 in deuteranopia.
- Spostando il verde a 172° e alzandolo a L 0,84 nello scuro, la coppia sale a 15,0.
- Nello scuro Studio e Associazioni erano a 9,7 e 10,0 dal blu schiarito: le ho ritoccate a 12,7 e 13,7.

**I compromessi dichiarati:**
1. **Tritanopia nel chiaro**: blu ↔ smeraldo vale 9,6. Riguarda circa 1 persona su 10.000. Spostare lo smeraldo verso il verde prato rompe la deuteranopia, che riguarda circa 1 uomo su 100. «Fatto» ha sempre la spunta, il pulsante ha sempre l'etichetta.
2. **Aree**: 10,4 al minimo fra loro in visione normale. Nelle simulazioni alcune coppie crollano: Relazioni↔Associazioni 1,6 in protanopia, Salute↔oro 1,3 in tritanopia scuro. Con 13 categorie a luminosità da icona non c'è soluzione migliore (stesso risultato del Ciclamino). Le aree hanno sempre icona ed etichetta.
3. **Sagoma di Kubo sulla carta**: il corpo bianco fa 1,17:1 su qualsiasi pagina chiara. La riconoscibilità la portano visore (12,5:1) e blu (5,9:1).
4. **Blu sullo scuro**: il pieno d'azione contro la pagina scura fa 3,00:1. Il pulsante si legge per l'etichetta bianca (6,4:1), e linee e icone blu nello scuro usano `--azione-linea` (7,1:1).

### 9.3 Distanze dai concorrenti

| App | Dominante | ΔE da Kubo misurato | ΔE dal blu canonico |
|---|---|---|---|
| Things 3 | `#3681f4` | 9,0 | 12,7 |
| Calm | `#3c80e0` | 9,3 | 12,7 |
| TickTick | `#5d86fe` | 12,3 | 15,9 |
| Habitica | `#8e4bf8` | 14,6 | 16,3 |
| Any.do | `#3798ff` | 15,0 | 18,6 |
| Microsoft To Do | `#389cea` | 16,3 | 19,8 |
| tutti gli altri | | ≥ 24 | ≥ 28 |

---

## 10. Limiti e cosa resta da testare con utenti reali

1. **Asset distintivi (Romaniuk).** Test di notorietà e unicità prima e dopo il lancio: «a quale app appartiene?», con 50-100 utenti della categoria, mostrando:
   - Kubo senza nome;
   - il blu da solo;
   - la coppia blu + oro;
   - il codice a quattro;
   - l'icona.
   Attesa: Kubo e il codice unici, il blu da solo no. Se il codice non supera il 50% di unicità dopo 6 mesi, si spinge sulla forma (pastiglie, antenna nel logo).
2. **Il ritocco del blu.** Confronto appaiato originale contro canonico: se gli utenti lo notano e lo giudicano «meno amichevole» (più scuro), si torna a L 0,52 (5,9:1, a ΔE 11 da Things).
3. **Calore percepito.** Differenziale semantico (Aaker e «caldo/freddo») fra carta e bianco ottico, fra testo notte e nero neutro, con adulti con ADHD.
4. **Le tessere-emozione disciplinate**: comprensione e gradimento delle 5 stanze contro le 25 tessere colorate, in un test A/B dentro l'app.
5. **Daltonismo reale**: le simulazioni di Machado sono un modello. Serve una prova con persone deuteranopi e protanopi su fatto/errore e sui puntini delle aree.
6. **Le immagini di Kubo sono raster con fondo bianco.** Lo scontorno di `ritaglia.py` è buono alla dimensione d'uso, ma sul bordo resta un alone chiaro di 1 px sullo scuro (visibile a 2×). Per la produzione servono i file sorgente con trasparenza, o vettori.
7. **Le scintille arancio della figura 1** e i trattini rosa delle guance non sono nel sistema. Vanno riportati all'oro, oppure dichiarati «solo illustrazione».
8. **Romaniuk 2018**: ho verificato la struttura (notorietà, unicità, griglia) e la tesi «il colore è difficile da possedere perché condiviso» su fonti secondarie e sul *Journal of Brand Management*. Il testo del libro non l'ho letto direttamente in questa sessione.

---

## 11. Fonti (in aggiunta a quelle di `../brand/rapporto-brand.md` §11, che restano valide)

**Asset distintivi e personaggi**
- Sharp, B. (2010). *How Brands Grow*. Oxford University Press.
- Romaniuk, J. (2018). *Building Distinctive Brand Assets*. Oxford University Press. https://www.oup.com.au/books/higher-education/management-and-marketing/9780190311506-building-distinctive-brand-assets
- Sintesi della griglia notorietà/unicità: https://umbrex.com/resources/frameworks/marketing-frameworks/distinctive-brand-assets-framework-ehrenberg-bass/ e https://www.marketingweek.com/jenni-romaniuk-meaning-distinctive-assets/
- Sul colore come asset poco unico per la condivisione competitiva: *Journal of Brand Management*, https://link.springer.com/10.1057/s41262-020-00187-6
- Garretson, J. A., & Burton, S. (2005). The role of spokescharacters as advertisement and package cues in integrated marketing communications. *Journal of Marketing*, 69(4), 118-132. https://doi.org/10.1509/jmkg.2005.69.4.118
- Garretson, J. A., & Niedrich, R. W. (2004). Spokes-characters: creating character trust and positive brand attitudes. *Journal of Advertising*, 33(2), 25-36.

**Colore**
- Palmer, S. E., & Schloss, K. B. (2010). An ecological valence theory of human color preference. *PNAS*, 107(19), 8877-8882. https://pubmed.ncbi.nlm.nih.gov/20421475/
- Valdez & Mehrabian 1994; Wilms & Oberfeld 2018; Labrecque & Milne 2012; Jonauskaite et al. 2020; Elliot & Maier 2012 e 2014; Itten 1961; Albers 1963; Ottosson 2020; Machado et al. 2009; WCAG 2.2: riferimenti completi in `../brand/rapporto-brand.md`.

**ADHD**
- Bijlenga, D., Vollebregt, M. A., Kooij, J. J. S., & Arns, M. (2019). The role of the circadian system in the etiology and pathophysiology of ADHD: time to redefine ADHD? *ADHD Attention Deficit and Hyperactivity Disorders*, 11(1), 5-19. https://link.springer.com/doi/10.1007/s12402-018-0271-z
- Tannock et al. 2006; Kim et al. 2014; Bijlenga et al. 2017; Shaw et al. 2014; Beaton et al. 2022; Volkow et al. 2009: in `../brand/rapporto-brand.md`.

**Dati propri**
- Icone dei concorrenti: iTunes Search API, App Store Italia, 23/11/2026 (`icone/`).
- Kubo: 21 PNG forniti dal fondatore (`kubo-zip/kubo/`); misure in `misure-kubo.json`, tessere in `tessere.json`.
