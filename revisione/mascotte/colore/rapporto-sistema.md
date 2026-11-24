# LifeMax: il colore come sistema e l'accessibilità

Punto di vista: design-system engineer (colore funzionale e WCAG 2.2).
Fonti: `src/stile/app.css` (5808 righe), `src/dati/dati.ts`, `src/app/app.ts`, `src/app/moto.ts`, `src/app/illustrazioni.ts`, `src/grafici/grafici.ts`, `prove/colori.js`, i 54 fogli in `colori/fogli/` e le foto singole.
Misure fatte da me, con script e immagini in `colori/sistema/`:
- `misura.js`: legge i token risolti dal browser, chiaro e scuro, in `token.json`.
- `contrasti.py`: calcola la tabella dei contrasti in `contrasti.json`.
- `cvd.py`: simula il daltonismo (Machado 2009, gravità 1.0) e calcola le distanze ΔE in OKLab.
- `tavola.js`: produce la tavola dei colori simulati, `tavola-cvd.png`.
- `foglio-cvd-*.png`: l'app vera vista con un filtro feColorMatrix.

---

## 0. In breve

1. **I token non hanno una sola fonte.** Il tema scuro è ridefinito in **7 blocchi**, uno dopo l'altro, alle righe 202, 4436, 5214, 5377, 5383, 5453 e 5463. Il chiaro è ridefinito in 2 blocchi (12 e 4423). Il valore finale lo decide l'ordine del file più la specificità.
   - Esempio: `--ok-pieno` vale `#0a7a42` in chiaro (r.4427) ma `#0f7a2e` in scuro, perché il blocco di r.202 è più specifico e la «seconda pelle» non lo sovrascrive.
   - Fuori dai token ci sono **104 esadecimali distinti** (185 occorrenze) e 46 `rgba()` distinti.
2. **Il colore d'azione è indaco** (`#5b4ff5`, scuro `#8f87ff`), cioè proprio quello che il commento di r.21-26 diceva di evitare perché «sembrerebbe una nona area».
   - In scuro **Lavoro `#9085e9` e l'accento `#8f87ff` sono quasi identici**: ΔE 3,2.
3. **Le collisioni semantiche sono vere e misurate**:
   - fiamma/serie = area Progetti Founder (`#eb6834`, ΔE 0);
   - «fatto» `#16b364` ≈ Associazioni `#1baf7a` (ΔE 3,5);
   - `--avviso` ≈ Finanze (4,8);
   - area Altro ≈ `--critico` (4,8);
   - serie dei grafici `--serie-1` = area Studio (0).
4. **Il testo passa quasi ovunque.** I problemi sono altrove:
   - **controlli e bordi** non arrivano mai a 3:1: bordo dei campi 1,36:1, cerchio della spunta 1,46:1, interruttore spento 1,05:1;
   - il **segnaposto** è lasciato al browser (`#757575`): FAIL su sup-2 in chiaro e ovunque in scuro;
   - il **verde `--ok` usato come testo/icona** fa 2,74:1 in chiaro;
   - **5 aree su 8** non reggono 3:1 come icona in chiaro.
5. **Lo scuro è progettato, ma a strati.** Le superfici grigie neutre in stile iOS sono buone, gli accenti sono rifatti per lo scuro. Ci sono però residui da inversione o da dimenticanza:
   - il passo 2 dell'onboarding usa la palette **chiara** delle aree anche in scuro (`app.ts:7923`);
   - la fiamma resta `#eb6834` in entrambi i temi;
   - la card «Adesso» tinta d'area diventa un fango scuro (`#222933`, e marrone su Finanze).
6. **Daltonismo (deuteranopia, scuro):** `--ok` contro `--critico` vale ΔE **2,6**. Il pieno «Fatto» contro il pieno rosso distruttivo vale 2,8. Salute, Founder, Associazioni, Altro e Finanze diventano tutte color oliva.
7. **La mascotte Segno, così com'è, sta sopra due semantici**:
   - il corallo `#d9445a` contro l'area Altro ΔE 3,4 e contro `--critico` scuro ΔE 5,9;
   - l'oro `#f5b440` contro `--avviso` ΔE 1,7 e contro Finanze scuro ΔE 0,7.
   Così com'è non entra nel sistema senza toccare qualcos'altro.

---

## 1. Inventario dei token

### 1.1 Token effettivi (risolti dal browser, `colori/sistema/token.json`)

| Ruolo | Token | Chiaro | Scuro | Dove si decide |
|---|---|---|---|---|
| Pagina | `--pagina` | `#f7f6fb` | `#0e0e0f` | r.66 → 4426 / r.216 → 4439 → 5215 → **5453** |
| Superficie 1 | `--superficie-1` | `#ffffff` | `#1c1c1e` | r.67 / 217 → 5216 → **5453** |
| Superficie 2 | `--superficie-2` | `#f2f2f6` | `#2c2c2e` | r.68 / **5453** |
| Superficie 3 | `--superficie-3` | `#ececf1` | `#3a3a3c` | r.69 / **5453** |
| Testo 1 | `--inchiostro-1` | `#101116` | `#f5f5f5` | r.70 / 5221 |
| Testo 2 | `--inchiostro-2` | `#565863` | `#b5b5b5` | r.71 / 5222 |
| Testo 3 | `--inchiostro-muto` | `#666873` | `#adadb0` | r.72 / 5223 → **5463** |
| Bordo | `--bordo` | `rgba(16,17,22,.08)` | `rgba(255,255,255,.12)` | r.73 / **5377** |
| Bordo forte | `--bordo-forte` | `rgba(16,17,22,.14)` | `rgba(255,255,255,.20)` | r.74 / **5377** |
| Griglia | `--griglia` | `#e8e8ee` | `#303030` | r.75 / **5377** |
| Linea base | `--baseline` | `#d5d5de` | `#424242` | r.76 / **5377** |
| Accento (linee, anello di focus) | `--accento` | `#5b4ff5` | `#8f87ff` | **4425 / 4438** |
| Accento pieno | `--accento-pieno` | `#5b4ff5` | `#5f55e6` | 4425 / **5383** |
| Testo sul pieno | `--accento-ink` | `#ffffff` | `#ffffff` | 4425 / **5383**, che annulla `#0d0b1f` di r.4438 |
| Accento come testo | `--accento-testo` | `#4a3fe0` | `#a9a3ff` | 4425 / 4438 |
| Successo (linee) | `--ok` | `#16b364` | `#16b364` | 4427. **Nessun valore per lo scuro** |
| Successo pieno | `--ok-pieno` | `#0a7a42` | `#0f7a2e` | 4427 / 234. **Due verdi diversi** |
| Successo testo | `--ok-testo` | `#006300` | `#0ca30c` | 92 / 233 |
| Attenzione | `--avviso` | `#fab219` | `#fab219` | 93. **Uno solo per i due temi**; manca `--avviso-testo` |
| Errore | `--critico` | `#d03b3b` | `#e85c56` | 94 / 213 |
| Errore testo | `--critico-testo` | `#a32222` | `#ff9d97` | 95 / 214 |
| Errore pieno | `--critico-pieno` | `#a32222` | `#b3342c` | 96 / 215 |
| Serie dei grafici | `--serie-1` | `#2a78d6` | `#3987e5` | 86 / 231 |
| Vetro | `--vetro` | `rgba(255,255,255,.78)` | `rgba(22,22,22,.78)` | 77 / 5226 |

**Token morti o fantasma:**
- `--brand-a/b/c` e `--grad-brand` sono quattro nomi con lo stesso valore dell'accento (r.54-63, 4424, 4437).
- `--wash-b` è definito e mai usato. `--accento-tenue` (r.5208) e `--avviso-testo` (r.2725) sono usati e **mai definiti**: valgono sempre il fallback.
- `--accento-ink` scuro viene scritto due volte con valori opposti: `#10222b` (r.208), poi `#0d0b1f` (r.4438), poi `#ffffff` (r.5383).

**Colori delle aree** (`dati.ts:210-217`, iniettati come `--c-area` in linea da `app.ts`):

| Slot | Area | Chiaro | Scuro |
|---|---|---|---|
| 1 | Studio | `#2a78d6` (= `--serie-1`) | `#5aa2f0` |
| 2 | Salute | `#008300` | `#3fb950` |
| 3 | Relazioni | `#e87ba4` | `#ee8db2` |
| 4 | Finanze | `#eda100` | `#f2b53b` |
| 5 | Associazioni | `#1baf7a` | `#33c792` |
| 6 | Founder | `#eb6834` (= fiamma) | `#f2804f` |
| 7 | Lavoro | `#4a3aa7` | `#9085e9` (≈ accento) |
| 8 | Altro | `#e34948` (≈ critico) | `#ee7a79` |

### 1.2 Valori scritti a mano che fanno il lavoro di un token

**Successo / fatto (verdi):**
- token: `#16b364`, `#0a7a42`, `#0f7a2e`, `#006300`, `#0ca30c`;
- a mano: `#0ca30c` per l'anello del timer in pausa (r.1740) e per la festa (`moto.ts:49`); `#0a7f28` per la fascia «ora» (r.4278); `#00c781` per i coriandoli (`app.ts:6439`); `#0a7a42` come fallback (r.5776, 5792);
- in più le aree Salute `#008300` e Associazioni `#1baf7a`.
- In tutto: **9 verdi**.

**Serie / fiamma / energia (arancioni):**
- `#eb6834` (r.1138, 1147, 1148, 1308, 2778, 2787, 4321) e lo stesso valore come area Founder;
- `#c04d1f` r.1138, `#f0913f` r.1139 e 2787, `#c2410c` r.2732, `#f97316` r.2733, `#b4470f` r.4321, `#ff9a62` r.4323, `#f08a24` r.5613.
- In tutto: **9 arancioni**, nessuno è un token.

**Attenzione / ritardo (ambra):**
- `#fab219` (token);
- testo: `#7a5200` (r.1153, 3425, 3803), `#8a5c00` (r.4160, 4337), `#3a2600` (r.1884), `#3d2a00` (r.3625);
- fondi: `#a4671f` (fascia di ritardo, r.4280), `#e8a317` (fallback, r.5387);
- grafici: `#eda100` / `#c98500` per l'energia (`app.ts:5683`).
- Il testo «in ritardo» ha **4 marroni diversi**.

**Errore (rossi):**
- token: `#d03b3b`, `#a32222`, `#e85c56`, `#ff9d97`, `#b3342c`;
- a mano: `#c62f2f` (r.1075), fallback `#d1242f` (r.4947, 5108, 5314) e `#e5484d` (r.4852);
- in più l'area Altro `#e34948`.

**Blu (informazione / ora / grafici):**
- `--serie-1`, `#3a63d6` per la linea dell'ora sulla timeline (r.3403), `#3b82f6` (r.5772), la rampa dei grafici (`grafici.ts:384-385`), `#2a78d6` scritto a mano (`grafici.ts:168`), Focus `#2a78d6` / `#3987e5` (`app.ts:5684`).

**Viola fuori dall'accento:**
- `#6f5bf0` per l'anello del timer (r.1721), `#7c5df0` / `#4a7bf5` / `#2ab8e8` per i colori della festa (`moto.ts:49`, il gradiente vecchio sopravvissuto), `#c9c3ff` (r.5536), `#a855f7` (`app.ts:6439`), `#1b1640` per gli occhi della mascotte attuale (`illustrazioni.ts:79`).

**Due tavolozze di coriandoli diverse:**
- `moto.ts:49`: viola, blu, ciano, verde, ambra, rosa;
- `app.ts:6439`: `#ff5a5f`, `#ffb400`, `#00c781`, `#3b82f6`, `#a855f7`, `#ff7ac6`.
- Nessuna delle due deriva dai token.

**Neri e grigi scritti a mano per lo schermo del timer** (r.1685-1745): `#0a0a0a`, `#f2f2f6`, `#9c9cab`, `#7f7f92`, `#e9e9f0`, `#8a8a9a`. È un tema a sé, senza token. Il timer è nero anche in tema chiaro (foto `schermi/timer-concentrazione__tel-light.png`).

**Grigi di stato scritti a mano in scuro:**
- `#9a9a9a`, pomello dell'interruttore (r.5446);
- `#636366`, segmento attivo (r.5486). Smentisce r.5380, che mette `--superficie-3`: vince la regola che viene dopo.

### 1.3 La prova automatica

`prove/colori.js` è buona per quello che fa. Misura il testo vero, sul fondo davvero dipinto, in 11 scene × 2 temi. Ma non vede:
- **elementi non testuali** (SC 1.4.11): bordi dei campi, cerchi delle spunte, interruttori, icone delle aree;
- **segnaposto**: lo pseudo-elemento non è un nodo di testo;
- **anello di focus** (SC 2.4.11 / 2.4.13);
- **onboarding**, **schermo del timer**, **fogli** (la scheda di un'attività), **toast**;
- **stati**: hover, premuto, disattivato, selezionato.

Per questo è verde mentre i FAIL qui sotto ci sono.

---

## 2. Semantica: lo stesso significato ha sempre lo stesso colore?

| Significato | Colori usati oggi | Verdetto |
|---|---|---|
| Azione primaria | `--accento-pieno` indaco (`#5b4ff5` / `#5f55e6`) | Coerente sui pulsanti. Lo stesso indaco però fa anche «selezionato», il fuoco, l'interruttore acceso (r.5474), il numeretto della barra, l'avatar e il segnaposto «XP». Il «+» della barra e «Scegli le azioni di oggi» hanno lo stesso peso di un chip selezionato |
| Fatto / successo | `--ok-pieno` per il pulsante «Fatto» e le spunte. `--ok` per le barre di avanzamento (`schermi/oggi-adesso__tel-light.png`, la barra «1 di 2 fatte»), gli anelli del mese (`giornata-mese__*.png`) e i giorni di fila. `--ok-testo` per «✓ fatto» nei Rituali | Ragionevole, ma **4 valori** e due pieni diversi fra i temi |
| Fatto per un'abitudine | **il colore dell'area**: `.ab-carta.fatta .ab-spunta { background: var(--c-area) }` (r.5022) | **Incoerente.** La stessa azione «segna fatto» è verde in Da fare e del colore dell'area in Abitudini. In `attivita-abitudini__tel-light.png` il cerchio vuoto di «Camminata» (Salute `#008300`) è già verde come un «fatto» |
| Attenzione / in ritardo | `--avviso` più 4 marroni scritti a mano | Valore giusto, testo non tokenizzato |
| Errore / distruttivo | `--critico*` («Scarta», «Elimina», «Termina l'abitudine») | Coerente, ma vicino all'area Altro (ΔE 4,8) e alla mascotte |
| Serie / fiamma | `#eb6834` più altri 8 arancioni | **Identico all'area Founder.** In `andamento__tel-light.png` la fiamma «38» e la barra «Progetti Founder» sono lo stesso colore |
| XP | indaco (testo «+5 XP» nei pulsanti, «+8 XP» nel toast, `az-spunta-*__tel-dark.png`) | Non ha un suo colore: è «accento». Va bene se resta testo, ma non distingue la ricompensa dall'azione |
| Informazione / ora attuale | `#3a63d6` (r.3403) | Blu a mano, a ΔE 5,3 da Studio e 7,2 dall'accento: tre blu-viola che a colpo d'occhio sono lo stesso colore |
| Dati (grafici) | `--serie-1` = Studio | Il heatmap «Costanza» e l'anno (`giornata-anno__*.png`) sembrano «tutto Studio» |
| Aree | 8 slot | Le aree si comportano bene come **icona più etichetta**: la mia verifica (`usi-area.js`) trova i colori d'area **solo su icone**, mai su testo. Bene. Ma occupano tutta la ruota e ogni semantico ci finisce sopra |

**Colori con due significati** (ΔE OKLab × 100, visione normale; sotto 10 a colpo d'occhio sembrano lo stesso colore):

| Coppia | Chiaro | Scuro |
|---|---|---|
| Fiamma ↔ Founder | **0,0** | 5,3 |
| `--serie-1` ↔ Studio | **0,0** | 8,2 |
| Lavoro ↔ accento | 13,4 | **3,2** |
| «Fatto» `--ok` ↔ Associazioni | **3,5** | 7,5 |
| «Fatto» `--ok` ↔ Salute | 6,4 (con ok-pieno) | **3,5** |
| `--avviso` ↔ Finanze | **4,8** | **1,7** |
| `--critico` ↔ Altro | **4,8** | 6,6 |
| Accento ↔ blu dell'«ora» | 7,2 | n/d |

Il pulsante «Scarta» rosso (`attivita-sistemare__*.png`) e l'icona della lampadina rossa di «Altro» (`attivita-dafare__*.png`) dicono «pericolo» e «categoria» con lo stesso colore.

---

## 3. Contrasto WCAG 2.2 (`colori/sistema/contrasti.json`)

Testo normale 4,5:1, testo grande e non-testo 3:1. I valori composti tengono conto dell'alfa.

### 3.1 Testo

| Coppia | Chiaro | | Scuro | |
|---|---|---|---|---|
| inchiostro-1 su pagina / sup-1 / sup-2 / sup-3 | 17,5 / 18,9 / 16,9 / 16,0 | PASS | 17,7 / 15,6 / 12,8 / 10,4 | PASS |
| inchiostro-2 su pagina / sup-1 / sup-2 / sup-3 | 6,6 / 7,1 / 6,3 / 6,0 | PASS | 9,4 / 8,3 / 6,8 / 5,5 | PASS |
| inchiostro-muto su pagina / sup-1 / sup-2 / sup-3 | 5,2 / 5,5 / 5,0 / **4,70** | PASS (a filo su sup-3) | 8,6 / 7,6 / 6,2 / 5,1 | PASS |
| **Segnaposto** (`#757575` del browser, nessuna regola `::placeholder`) su sup-1 | 4,61 | PASS a filo | **3,69** | **FAIL** |
| Segnaposto su sup-2 (campi nei fogli, `rituale-*`) | **4,13** | **FAIL** | **3,02** | **FAIL** |
| Segnaposto su pagina | **4,29** | **FAIL** | **4,19** | **FAIL** |
| accento-testo su sup-1 / pagina | 6,8 / 6,3 | PASS | 7,6 / 8,6 | PASS |
| `--accento` usato come testo su sup-1 | 5,4 | PASS | 5,7 | PASS |
| `--ok-testo` su sup-1 | 7,5 | PASS | 5,1 | PASS |
| **`--ok` come testo** (`.abd-fatta` r.5562; «✓ Fatta» in `giornata-scheda-blocco__tel-light.png`) | **2,74** | **FAIL** | 6,2 | PASS |
| `--critico-testo` su sup-1 | 7,5 | PASS | 8,5 | PASS |
| `#7a5200` su avviso 20% (`scad-badge`) | 6,1 | PASS | `--avviso` 6,0 | PASS |
| `#c2410c` serie / `#f97316` scuro | 5,2 | PASS | 6,1 | PASS |
| `#b4470f` su tinta della serie (`casa-serie`, la pastiglia «38 giorni») | 4,63 | PASS a filo | 6,7 | PASS |

### 3.2 Pulsanti e pieni

| Coppia | Chiaro | | Scuro | |
|---|---|---|---|---|
| `--accento-ink` su `--accento-pieno` (primario) | 5,41 | PASS | 5,35 | PASS |
| `#fff` su `--ok-pieno` («Fatto») | 5,42 | PASS | 5,46 | PASS |
| `#fff` su `--critico-pieno` | 7,48 | PASS | 6,10 | PASS |
| accento-testo su `btn-tinta` (accento 13%) | 5,68 | PASS | 6,26 | PASS |
| `#fff` su `#3a63d6` (badge dell'ora, r.3403) | 5,34 | PASS | — | |
| `#fff` su `#a4671f` (fascia di ritardo) | 4,63 | PASS a filo | — | |
| `#fff` su `#636366` (segmento attivo scuro) | — | | 5,99 | PASS |
| `#fff` su accento 26% (nav attiva scuro) | — | | 11,2 | PASS |
| Disattivato: `opacity .45` sul pieno (r.5508, 5629) | **1,42** | esente (1.4.3), ma illeggibile: «Continua» in `ob-2-aree__tel-light.png`, «Salva» in `cattura__tel-light.png` | 3,71 | esente |

### 3.3 Componenti non testuali (SC 1.4.11, 3:1)

| Coppia | Chiaro | | Scuro | |
|---|---|---|---|---|
| **Bordo dei campi** `--bordo-forte` su sup-1 / pagina | **1,36 / 1,35** | **FAIL** | **1,91 / 1,81** | **FAIL** |
| `--bordo` (card, liste) | 1,18 | decorativo, ammesso | 1,45 | ammesso |
| **Cerchio della spunta vuota** `--baseline` (r.5549) | **1,46** | **FAIL** | **1,69** | **FAIL** |
| Cerchio della spunta di un'abitudine (area 70% + bordo-forte, r.5020) | segue l'area: Finanze ~1,9 | **FAIL** | in genere PASS | |
| **Interruttore spento**: traccia `--superficie-3` su sup-2 / sup-1 | **1,05 / 1,18** | **FAIL** | **1,23 / 1,50** | **FAIL** |
| Pomello spento | `#fff` su traccia 1,18 (lo salva solo l'ombra) | **FAIL** | `#9a9a9a` 4,03 | PASS |
| Interruttore acceso (`--accento-pieno`) | 5,41 | PASS | 3,18 | PASS a filo |
| `--ok` come linea o icona (barre, anelli, «✓ fatto») | **2,74** | **FAIL** | 6,21 | PASS |
| `--avviso` come icona (sole di «Pianifica», campana) | **1,83** | **FAIL** | 9,27 | PASS |
| `--critico` come icona | 4,80 | PASS | 4,94 | PASS |

Le aree come icona su sup-1 (`segno-area`, `tit-area`; le icone sono gli unici usi reali, vedi §2):

| Area | Chiaro icona (3:1) | Scuro icona | `#fff` sul pieno (spunta fatta, r.5022) chiaro / scuro |
|---|---|---|---|
| Studio | 4,42 PASS | 6,37 PASS | 4,42 PASS / **2,67 FAIL** |
| Salute | 4,95 PASS | 6,70 PASS | 4,95 PASS / **2,54 FAIL** |
| Relazioni | **2,69 FAIL** | 7,36 PASS | **2,69 / 2,31 FAIL** |
| Finanze | **2,17 FAIL** | 9,28 PASS | **2,17 / 1,83 FAIL** |
| Associazioni | **2,82 FAIL** | 7,88 PASS | **2,82 / 2,16 FAIL** |
| Founder | 3,20 PASS | 6,46 PASS | 3,20 PASS / **2,63 FAIL** |
| Lavoro | 8,56 PASS | 5,44 PASS | 8,56 / 3,13 PASS |
| Altro | 3,95 PASS | 6,23 PASS | 3,95 PASS / **2,73 FAIL** |
| **Onboarding scuro** (`app.ts:7923` usa `SLOT_COLORI[...][0]`, la palette chiara, anche in scuro) | | Lavoro `#4a3aa7` su sup-1 scuro ≈ **2,0 FAIL**; Studio e Salute spenti. Vedi `ob-2-aree__tel-dark.png` | |

Come **testo** sul chip tinto dell'area (`.att-chip.on`, r.3193, colore del testo `var(--c-area)`):
- in chiaro **FAIL per 7 aree su 8**: solo Lavoro passa, con 6,56; Finanze fa 1,92;
- in scuro FAIL per Lavoro (4,30).

### 3.4 Focus (SC 2.4.7 / 2.4.11; 2.4.13 è AAA)

| Coppia | Chiaro | | Scuro | |
|---|---|---|---|---|
| `:focus-visible` `--accento` su pagina / sup-1 (r.332) | 5,0 / 5,4 | PASS | 6,5 / 5,7 | PASS |
| Anello accanto a un pulsante pieno indaco (anello e pieno dello stesso colore) | **1,00** | FAIL per la differenza fra stato e non stato | **1,80** | FAIL |
| Bordo del campo a fuoco | 5,4 | PASS | 5,7 | PASS |

Osservazioni:
- Lo spessore è `calc(2px * var(--sq))`: se `--sq` scende sotto 1, l'anello è più sottile di 2px.
- Sulle foto `st-focus__tel-light.png` (anello sull'avatar «R») e `st-focus__pc-light.png` (anello su «Andamento») il fuoco si vede bene sulle superfici neutre.
- Su un pulsante primario, o su un chip selezionato pieno, l'anello indaco si fonde col pieno: si vede solo grazie all'`outline-offset: 2px`.
- Le regole che fanno `outline: none` e affidano il fuoco a un solo cambio di bordo sono fragili: r.1606 `.pannello-cattura` (`border: none`, **nessun indicatore**), 3046, 3145 e 3188 (`box-shadow: none`), 4704 (`.rit-riga`: solo il fondo passa a sup-2, cioè 1,07:1 contro sup-1).

---

## 4. Il tema scuro: progettato o invertito?

**Progettato, a strati, con residui.**

Cose buone:
- Superfici neutre in stile iOS: `#0e0e0f` / `#1c1c1e` / `#2c2c2e` / `#3a3a3c`. È una scala di elevazione per luminosità (la superficie più alta è più chiara), giusta per lo scuro dove le ombre non si vedono. I salti fra un gradino e l'altro sono 1,13 / 1,22 / 1,23: sufficienti.
- Le aree e l'accento sono **ri-scelti** per lo scuro, più chiari e meno saturi (`dati.ts:208`), non ribaltati.
- `--accento-pieno` scuro `#5f55e6` con il bianco sopra evita le «lastre lilla» (r.5382).

Residui e problemi:
- **Sette blocchi successivi** per lo scuro (§0). Il commento di r.5211 («LO SCURO È GRIGIO») e quello di r.5452 (iOS) si contraddicono nei valori.
- **Verdi saturi che vibrano sul nero**: `--ok` `#16b364` e `--ok-testo` `#0ca30c` (verde puro, saturazione molto alta) per «✓ fatto» nei Rituali (`rituali__tel-dark.png`) e per gli anelli del mese. Il pulsante «Fatto» `#0f7a2e` su `#222933` è una lastra satura molto grande (`oggi-adesso__tel-dark.png`, `az-timer-*__tel-dark.png`).
- **Card tinte d'area**: `color-mix(area 10%, sup-1)` dà fondi fangosi. Il blu-ardesia `#222933` per Studio va bene. Sulla card di Finanze esce un marrone-oliva (`az-spunta-0900ms__tel-dark.png`, «Confrontare piani telefonici»), che nello scuro sembra sporco più che caldo.
- **Elementi senza tema**:
  - l'onboarding usa le aree chiare (vedi sopra);
  - la fiamma `#eb6834 !important` (r.1308) non cambia;
  - l'avviso `#fab219` è identico nei due temi: in scuro fa 9,3:1 ed è più acceso di tutto il resto;
  - il blocco del timer è nero in entrambi i temi.
- **Doppioni del pieno verde** fra i temi (`#0a7a42` contro `#0f7a2e`), nati per caso dalla specificità.
- **Il velo dei fogli in scuro** è `rgba(0,0,0,.6/.66)` su pagina `#0e0e0f`: il foglio `#1c1c1e` si stacca poco (`giornata-scheda-blocco__tel-dark.png`). Serve un bordo superiore `--bordo-forte` o un gradino di superficie in più.

---

## 5. Stati interattivi

| Stato | Implementazione | Visibilità (foto) |
|---|---|---|
| Hover | `.btn`: `translateY(-1px)`, `--e2` e bordo con accento al 35% (r.851). Primario e ok: `filter: brightness(1.06)` (r.880, 899). Tinta: dal 13% al 20%. Ghost: inchiostro al 6% | **Impercettibile**: `st-hover__pc-light.png` è quasi identica a `oggi-prima__pc-light.png`. Un +6% di luminosità su un pieno non arriva a ΔE 3 |
| Premuto | `scale(.97)` (r.852). `.casa-rito:active` con opacity .85. `bv-cta`: cambia l'ombra 3D. `--premuto` (r.4004) è definito ma usato poco | Solo movimento, **nessun cambio di colore** (`st-premuto__tel-light.png`) |
| Focus | anello indaco 2px, offset 2 | Buono sulle superfici neutre, debole sui pieni indaco (§3.4) |
| Disattivato | `opacity .45` / `.4` | Il lilla slavato col bianco sopra (1,42:1) **sembra un secondo stile di pulsante**, non uno stato. Nessun cursore o pattern che dica «manca qualcosa» |
| Selezionato | 6 linguaggi diversi | Vedi elenco sotto |

I 6 modi di dire «selezionato»:
- segmento: bianco su sup-2 in chiaro, `#636366` in scuro;
- voce di navigazione: accento al 12-26%;
- chip: pieno indaco (r.5475);
- scala di voto: pieno indaco;
- tessera dell'onboarding: bordo indaco più spunta;
- giorni dell'abitudine: tutti pieni indaco (`attivita-abitudini-nuova__tel-light.png`).

Pieno indaco = selezionato = primario = interruttore acceso: in «Rituali» (`rituale-checkin__tel-light.png`) tre «5» selezionati hanno lo stesso peso visivo del pulsante «Registra».

---

## 6. Il colore da solo come informazione (daltonismo)

Simulazioni: `colori/sistema/tavola-cvd.png` (campioni), `foglio-cvd-per-area.png`, `foglio-cvd-mese.png`, `foglio-cvd-abitudini.png` (l'app con un filtro feColorMatrix su `<html>`, in normale, deuteranopia e protanopia, chiaro e scuro).

- **Aree in «Per area»** (`foglio-cvd-per-area.png`): in deuteranopia e protanopia le barre di Salute, Finanze, Altro, Founder e Associazioni diventano tutte **oliva/kaki**; si distinguono solo blu e viola.
  - Si salvano perché ogni barra ha nome e icona: SC 1.4.1 rispettato. Il commento di `dati.ts:206` lo dichiara ed è vero.
  - Ma il commento di r.22-23 («scelte per restare distinguibili anche a chi ha una carenza cromatica») **non è vero**: ΔE in deuteranopia per Salute ↔ Altro 3,7, Salute ↔ Founder 4,0, Relazioni ↔ Associazioni 3,5.
- **Dove il colore è l'unico canale:**
  - i **puntini sotto i giorni** nel Mese (`giornata-mese__*.png`): un puntino per area, senza etichetta;
  - il **filo laterale** dei blocchi sulla timeline e i blocchi della settimana (`giornata-settimana__*.png`): hanno il testo dell'attività ma non l'area;
  - i **puntini** di `me-pallino` e `se-segno`;
  - i coriandoli, decorativi, quindi va bene.
  - Per i puntini serve almeno l'icona dell'area al passaggio o al tocco, o una forma (pieno contro anello c'è già per azione contro abitudine: buon precedente).
- **Fatto contro mancato / errore**:
  - in chiaro `--ok` ↔ `--critico` in deuteranopia vale 9,1 (si regge);
  - in **scuro 2,6** (`#16b364` ↔ `#e85c56`) e pieni 2,8: «Fatto» e «Elimina», un anello di giorno completato e un rombo rosso `me-punti` (r.4852) sono lo stesso giallo-oliva per un deuteranope.
  - Oggi i due stati sono sempre accompagnati da icona e parola (spunta, «Fatto», cestino), quindi niente FAIL formale. Ma gli **anelli del mese** distinguono «pieno», «parziale» e «vuoto» solo per riempimento, verde contro grigio: in `foglio-cvd-mese.png` l'anello verde diventa oliva sul grigio e regge per luminosità. Va bene finché nessuno introduce un anello rosso per «mancato».
- **Tritanopia**: «fatto» ↔ Associazioni ΔE 0,7 in chiaro. Accento ↔ blu dell'«ora» 2,1.

---

## 7. Proposta: una struttura di token pulita

### 7.1 Tre livelli, una fonte sola

```
primitive/            scale tonali in OKLCH, 12 gradini (50…950), mai usate dai componenti
  neutro-*            grigi con tinta zero (lo scuro è già così: confermarlo)
  indaco-*            marca
  verde-* ambra-* rosso-* blu-*    semantici
  area1-* … area8-*   scale per ogni slot (stessa L per gradino in tutte le aree)
  segno-*             mascotte (corallo, rosa, prugna, oro) — fuori dalla UI
semantici/            (cambiano fra chiaro e scuro, i componenti usano SOLO questi)
  --bg-pagina --bg-1 --bg-2 --bg-3 --bg-vetro --bg-velo
  --testo-1 --testo-2 --testo-3 --testo-segnaposto --testo-disattivo --testo-su-pieno
  --linea-decor (≈ 1.2:1)   --linea-controllo (≥ 3:1)   --linea-focus
  --azione  --azione-hover  --azione-premuta  --azione-testo  --azione-tenue  --azione-tenue-hover
  --selezione  --selezione-testo                          (distinto da --azione: tonale, non pieno)
  --successo  --successo-pieno  --successo-testo  --successo-tenue
  --attenzione  --attenzione-pieno  --attenzione-testo  --attenzione-tenue
  --pericolo  --pericolo-pieno  --pericolo-testo  --pericolo-tenue
  --info  --info-testo                                    (la linea dell'ora)
  --serie --serie-testo --serie-tenue                     (fiamma, giorni di fila)
  --xp                                                    (se si vuole: oro, NON indaco)
  --dato-1…n  --rampa-1…4                                 (grafici: separati dalle aree)
  --area-N  --area-N-testo  --area-N-tenue  --area-N-su   (4 ruoli per slot, per tema)
componenti/           (alias, opzionali)
  --btn-primario-bg: var(--azione) …  --spunta-bordo: var(--linea-controllo) …
  --interr-off: var(--linea-controllo) …  --timer-bg: var(--neutro-950) …
```

Regole operative:
- **Un solo blocco `:root` e un solo `:root[data-mode="dark"]`**, in un file `token.css`. Le 7 ridefinizioni vanno fuse in una.
- Nessun esadecimale fuori da `token.css` e `dati.ts`. Da far rispettare con una prova: `grep` di `#[0-9a-f]{3,8}` e `rgb(` fuori dal file dei token.
- Le aree diventano **variabili CSS per slot** (`--area-1`…`--area-8` con le loro varianti in chiaro e scuro) invece di valori iniettati in linea da JS. `coloreArea()` restituisce `var(--area-N)`: il tema cambia senza rigenerare l'HTML, e il bug dell'onboarding (`app.ts:7923`) sparisce da solo.
- Coriandoli, festa, tavolozza dei grafici e timer leggono i token.

### 7.2 Vincoli numerici (da mettere in `prove/colori.js`)

| Token | Vincolo |
|---|---|
| `--testo-1/2/3` | ≥ 4,5:1 su **tutte** le `--bg-*` del proprio tema (oggi `--testo-3` su sup-3 è a 4,7: lasciare margine, ≥ 4,8) |
| `--testo-segnaposto` | ≥ 4,5:1 su `--bg-1` e `--bg-2`. Proposta: chiaro `#6b6d78` (≈ 4,9 su sup-2), scuro `#8e8e93` (≈ 4,6 su sup-2) |
| `--linea-controllo` | ≥ 3:1 sulla superficie su cui sta: bordi dei campi, cerchio della spunta, traccia dell'interruttore spento. Proposta: chiaro `#8a8c96`, scuro `#76767c` |
| `--testo-su-pieno` su `--azione`, `--successo-pieno`, `--pericolo-pieno` | ≥ 4,5:1 (oggi 5,4 / 5,4 / 7,5: ok) |
| `--azione` come linea o icona | ≥ 3:1 su ogni `--bg-*` |
| `--linea-focus` | ≥ 3:1 sia sulla superficie **sia sul pieno di `--azione`**. Oppure anello doppio: 2px `--linea-focus` più 2px `--bg-pagina` |
| `--successo`, `--attenzione`, `--pericolo` come icona o linea | ≥ 3:1 su `--bg-1`. In chiaro `--ok` deve scendere a ≈ `#0e9150` (3,9:1) e `--attenzione` icona a ≈ `#b07800` |
| `--area-N` (icona) | ≥ 3:1 su `--bg-1` **in entrambi i temi**. In chiaro vanno scuriti Relazioni (`#d05a8a`), Finanze (`#b07a00`), Associazioni (`#138a60`) |
| `--area-N-testo` | ≥ 4,5:1 su `--bg-1` e su `--area-N-tenue` |
| `--area-N-su` (spunta su pieno d'area) | il glifo deve avere ≥ 3:1. In scuro usare `--testo-su-scuro` (`#101116`), non `#fff` |
| Separazione semantica | ΔE OKLab (×100) ≥ **15** fra `--azione`, `--successo`, `--attenzione`, `--pericolo`, `--info`, `--serie` e ogni `--area-N` nello stesso tema; ≥ **8** anche simulando la deuteranopia, per le coppie che compaiono insieme (successo ↔ pericolo, successo ↔ serie) |
| Lo scuro | saturazione OKLCH dei pieni grandi (C ≤ 0,14 per superfici > 40×40px), niente esadecimali con C > 0,2 usati come testo |

Conseguenze pratiche:
- **Fiamma/serie**: tenere l'arancio per la serie (è iconico), e spostare **Founder** su un'altra tinta (per esempio magenta-prugna `#b0428f` o teal), oppure dare alla serie un ambra-oro e lasciare l'arancio a Founder. Le due cose non possono restare uguali.
- **Lavoro**: in scuro va spostato via dall'indaco (per esempio verso il viola-ardesia `#7d6bb3` o, meglio, verso un grigio-blu), oppure l'azione si sposta. L'accento indaco più otto aree sature non sta nella ruota: o l'accento diventa davvero inchiostro, come diceva r.21-30 prima della «seconda pelle», o un'area rinuncia alla sua tinta.
- **Altro**: con tinta rossa a ΔE 4,8 da `--pericolo`, si sposta su un grigio caldo o un ciano.
- **Associazioni** vs «fatto»: cambiare una delle due (Associazioni verso il teal-azzurro `#0f8fa0`).
- **Le serie dei grafici** non usano gli slot delle aree (`--serie-1` ≠ Studio), oppure i grafici sono dichiaratamente «per area».

### 7.3 Vincoli per il colore di marca e per la mascotte (Segno)

**Il colore di marca (azione):**
1. Pieno con `--testo-su-pieno` ≥ 4,5:1 nei due temi. L'indaco attuale passa (5,4).
2. Come linea o icona, ≥ 3:1 su tutte le superfici. Come testo (`-testo`), ≥ 4,5:1.
3. ΔE ≥ 15 da ogni area e da `--info`: **oggi fallisce con Lavoro in scuro (3,2)**.
4. Una sola variante «pieno» per tema, e una «tenue» per selezionato e tonale.
5. **Non deve fare anche «selezionato»**, e l'anello di focus deve contrastare col proprio pieno.

**La mascotte** (corallo `#d9445a`, rosa `#f4a3ae`, prugna `#2b0f1c`, oro `#f5b440`). Misure:
- **Leggibilità della sagoma**:
  - corallo su bianco 4,26:1, su pagina chiara 3,97, su sup-1 scuro 3,99, su pagina scura 4,52: tutto ≥ 3:1, bene. Vincolo: il corpo ≥ 3:1 sulla superficie su cui appare, nei due temi;
  - il rosa `#f4a3ae` (1,96 su bianco) e l'oro (1,83) **non possono stare sul bordo** della sagoma in chiaro: solo all'interno o come particelle decorative;
  - occhi `#2b0f1c` su corallo 4,15:1: ok per un dettaglio grafico (≥ 3:1).
- **Distanza dai semantici** (ΔE ×100, normale / deuteranopia):

  | Coppia | Normale / deut | Verdetto |
  |---|---|---|
  | Corallo ↔ area Altro chiaro | 3,4 / 3,5 | **in conflitto** |
  | Corallo ↔ `--critico` chiaro | 4,1 / 3,9 | **in conflitto** |
  | Corallo ↔ `--critico` scuro | 5,9 / 5,5 | **in conflitto** |
  | Corallo ↔ `--critico-pieno` scuro | 9,7 | al limite |
  | Corallo ↔ `--critico-pieno` chiaro | 14,0 | quasi ok |
  | Corallo ↔ fiamma / Founder | 10,1 / 8,9 | troppo vicino |
  | Corallo ↔ Relazioni | 13,1 | al limite |
  | Corallo ↔ indaco della marca | 32,5 | ottimo: complementari |
  | Oro ↔ `--avviso` | **1,7** | lo stesso colore |
  | Oro ↔ Finanze scuro | **0,7** | lo stesso colore |

- **Vincoli da rispettare:**
  1. La mascotte **non è un token d'interfaccia**. I suoi colori vivono in `primitive/segno-*` e non vengono mai usati per pulsanti, stati o aree.
  2. ΔE ≥ 15 (normale) e ≥ 10 (deuteranopia) da `--pericolo*`, `--serie`, `--attenzione` e da ogni area, in entrambi i temi. Oppure, se si tiene il corallo, **la mascotte non compare mai nella stessa vista di un'azione distruttiva o di un errore**: i fotogrammi di «Non ce l'ho fatta» (`anim-tutte/chiavi-*`) sono proprio il caso a rischio, perché un nastro rosso accanto a un «mancato» legge «errore», l'opposto del tono «mai colpevolizzante».
  3. **Strade per far entrare il corallo:**
     - spostare `--pericolo` verso un cremisi più scuro e freddo (per esempio `#b4233c`, ΔE ≈ 12 dal corallo; con il pieno a `#a32222` è già a 14);
     - togliere il rosso all'area Altro;
     - oppure ruotare il corallo verso il salmone-pesca (H OKLCH 35-45°, per esempio `#e8735a`), che però va a sbattere su Founder e la fiamma. Quindi **la scelta dipende da chi lascia la tinta arancio-rossa**: o la serie, o Founder, o la mascotte. Tutte e tre non ci stanno.
  4. **L'oro delle particelle** non deve essere il colore dell'XP o di `--attenzione` se l'XP diventa oro. Scegliere: oro = ricompensa (XP, particelle della mascotte, coccarda dei 7 giorni) e `--attenzione` più arancio-ambra e più scuro (`#c27a00`). Così «ritardo» e «festa» non hanno lo stesso colore.
  5. **In scuro** il corallo resta a 4,0:1 su sup-1: non schiarirlo, per non andare sul rosa di Relazioni scuro `#ee8db2` (ΔE ≈ 9). Semmai si aggiunge un contorno prugna.
  6. La mascotte attuale nell'app (`illustrazioni.ts`: corpo indaco, occhi `#1b1640`, `oggi-vuoto__*.png`) **è dell'indaco della marca**: vuol dire che oggi la mascotte «è» il pulsante. Segno in corallo risolve questa ambiguità, a patto dei punti 2-3.

---

## 8. Interventi in ordine di priorità

1. **Accessibilità minima** (bloccanti per SC 1.4.11 / 1.4.3):
   - un token `--linea-controllo` ≥ 3:1 per i bordi dei campi (r.948), il cerchio della spunta (r.5549), la traccia dell'interruttore spento (r.4504) e lo scuro (r.5446);
   - una regola `::placeholder { color: var(--testo-segnaposto) }`;
   - `--ok` usato come testo o icona sostituito da `--ok-testo` (r.5562, 5550, gli anelli del mese) o scurito;
   - le icone delle aree in chiaro scurite per Relazioni, Finanze e Associazioni;
   - `app.ts:7923` deve passare da `coloreArea()`;
   - le spunte d'abitudine fatte in scuro con il glifo scuro.
2. **Prova**: estendere `prove/colori.js` ai componenti non testuali (bordi calcolati dei controlli), al segnaposto, all'anello di focus contro il pieno, all'onboarding, ai fogli e al timer; più un controllo «niente esadecimali fuori dai token».
3. **Semantica**:
   - separare fiamma e Founder, accento e Lavoro, `--ok` e Associazioni, critico e Altro, `--serie-1` e Studio;
   - **«fatto» sempre del colore del successo**, anche nelle abitudini (r.5022);
   - «selezionato» tonale, diverso dal pieno d'azione.
4. **Fusione dei token**: un solo blocco per tema, alias rimossi (`--brand-*`, `--grad-brand`, `--wash-b`), fantasmi definiti (`--accento-tenue`, `--avviso-testo`), 4 marroni dell'attenzione ridotti a `--attenzione-testo`, 9 arancioni a `--serie*`, tavolozze dei coriandoli unificate.
5. **Stati**:
   - hover visibile: ΔL ≥ 4-6% in OKLCH, `--azione-hover` esplicito, niente `filter`;
   - premuto con colore (`--azione-premuta`) oltre allo scale;
   - disattivato come `--bg-3` più `--testo-disattivo`, non un lilla al 45%.
6. **Scuro**: abbassare la saturazione del verde pieno e dei verdi di stato; tinte delle card d'area al 6-8% su un neutro invece che al 10% (niente marrone su Finanze); bordo superiore sui fogli.
