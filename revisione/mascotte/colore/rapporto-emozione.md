# LifeMax: il colore nel movimento, nelle azioni e nelle emozioni

Questo rapporto guarda il colore dal punto di vista del motion design e del design emotivo.

Prima del rapporto ho guardato:
- tutti i fogli in `colori/fogli/`, soprattutto `azioni-tel-light-01…06`, `azioni-tel-dark-01…06` e `azioni-pc-light-01…08`, aprendo le foto singole quando serviva;
- i fogli delle animazioni di Segno: `anim-v3/foglio.png` e `anim-tutte/chiavi-{fatta,giornata,capisce,concentrazione,bentornato,calma,pronto}/foglio.png`, con le loro note;
- il CSS e il codice del movimento: `src/stile/app.css`, `src/app/moto.ts`, `src/app/app.ts` (la festa, i suoni, la mascotte), `src/dati/dati.ts` (i colori delle aree) e `src/fogli/Mancata.tsx`.

I percorsi delle foto sono relativi a `scratchpad/colori/`.

**Limiti delle catture, da sapere prima di leggere:**
- Le sequenze `az-foglio-*` e `az-mancata-*` non mostrano il foglio aperto: tutti i fotogrammi sono la schermata di sotto (vedi `azioni/az-mancata-0900ms__tel-light.png`). Per il foglio «Non del tutto» ho letto il codice (`Mancata.tsx`) e ho guardato i fogli aperti in `schermi/` (ad esempio `scheda-attivita__tel-light.png`).
- Nella sequenza `az-spunta-*` (Attività) la riga sparisce e compare il toast «Fatta. Annulla». Lo scoppio attorno al dito, `burst`, non si vede in nessun fotogramma: o non parte in quel ramo, o la cattura lo perde.
- `az-timer-corre` è preso a 25:00, quindi l'anello di avanzamento è a zero e non si vede di che colore è. Il colore l'ho preso dal CSS.

---

## 0. In breve

1. **Il prodotto oggi ha tre caratteri cromatici che non si parlano.**
   - L'onboarding è indaco e bianco: calmo, ordinato.
   - L'app è policroma: otto aree, un arancio per la serie, un verde per il fatto, schede tinte per area.
   - La concentrazione è nera, anche nel tema chiaro.

   Il passaggio dall'onboarding all'app avviene con una pioggia di coriandoli arcobaleno che non appartiene a nessuno dei tre.
2. **Non esiste un «colore della gioia».**
   - La ricompensa è arcobaleno (due palette diverse, `moto.ts:49` e `app.ts:6439`).
   - Gli XP sono indaco, cioè il colore dei pulsanti.
   - Il toast è quasi nero.
   - Il cerchio di «Tutto pronto» è verde.

   L'utente non può imparare che un certo colore vuol dire «bravo».
3. **Esiste un «colore della calma»?** Solo per sottrazione: il nero della concentrazione e il grigio del tema scuro. Nessuna tinta è dedicata alla calma.
4. **Il verde è usato bene come «fatto»** (spunte, barra «1 di 2 fatte», «Fatto» delle abitudini). È tradito in tre punti:
   - l'anello del timer **in pausa** diventa verde (`app.css`, `.conc-anello.in-pausa`);
   - «Fatto» è verde pieno per le abitudini ma bianco con bordo per le azioni;
   - la mappa «Costanza» è blu, `--serie-1` `#2a78d6`, cioè il colore dell'area Studio.
5. **La festa piena è inflazionata.** Parte a ogni «Fatto» su Adesso (`app.ts:4160`), non solo alla chiusura della giornata o di un rituale. In più i coriandoli cadono sulla **cosa successiva**: la ricompensa per la cosa finita si posa sull'obbligo che arriva dopo.
6. **«Non ce l'ho fatta» è quasi pulito,** ma lascia due tracce gialle d'avviso:
   - il pulsante diventa giallo in hover;
   - la cosa mancata resta segnata per sempre con il bordo `--avviso` nella giornata.

   È lo stesso giallo di «in ritardo», e quasi lo stesso dell'oro di Segno.
7. **Segno va tenuto come accento a parte.** Non deve diventare il primario e non deve esserne il complementare. Indaco è «fare» e freddo; il corallo è «sentire» e caldo.

   Il corallo però oggi collide con tre cose:
   - il rosso distruttivo (`--critico #d03b3b`);
   - l'area «Altro» (`#e34948`, contrasto 1,08:1 con `#d9445a`, cioè indistinguibile);
   - il rosa dell'area Relazioni (`#e87ba4`) contro il risvolto `#f4a3ae`.

   L'oro di Segno (`#f5b440`) è quasi identico a `--avviso #fab219`.
8. **La fiamma della serie (`#eb6834`) è identica al colore dell'area Progetti Founder (`#eb6834`).**
9. **Il tema scuro tradisce la sua regola.** Il commento dice «lo scuro è grigio» (`app.css:5212`), ma le schede «adesso» tinte per area diventano marrone e blu notte: vedi `azioni/az-adesso-fatto-0600ms__tel-dark.png`, la scheda Finanze color fango.
10. Propongo **cinque «stanze emotive»**, ognuna con le sue regole d'uso e la sua palette per chiaro e scuro: gioia grande, gioia piccola, calma, comprensione e bentornato. Le trovi alle sezioni 6 e 7.

---

## 1. Il percorso emotivo

### 1.1 L'onboarding, passo per passo

| Passo | Foto | Cosa colora | Cosa vede prima l'occhio | Emozione | Nota |
|---|---|---|---|---|---|
| Porta (landing) | `azioni/ob-0-porta__tel-light.png`, `__tel-dark` | indaco: «MISURA. INGEGNERIZZA. MASSIMIZZA.», «una cosa alla volta», «Inizia»; nell'anteprima un verde (Fatto) e un arancio (7 giorni di fila) | il pulsante «Inizia» (grande, indaco, con ombra) | curiosità ordinata, tecnica | Il motto in maiuscolo indaco suona come un'ingegneria della produttività, non come un posto caldo. L'anteprima mostra già il vocabolario giusto: il verde è «fatto», l'arancio è «serie». È l'unico punto in cui l'app spiega i suoi colori. |
| Entrata | `ob-1-entra-0080/0200/0400ms` | niente: i fotogrammi mostrano già il passo 1 | — | — | La transizione non ha un colore: niente velo, niente colore che «si porta» nel passo dopo. È un'occasione persa per far entrare Segno. |
| Nome | `ob-1-nome-vuoto`, `ob-1-nome-scritto` | barra di progresso indaco, «Continua» indaco, anello indaco sul campo | «Continua» | neutro | Qui «Continua» è attivo anche a campo vuoto (vedi `fogli/azioni-tel-light-04.png`, primi quattro riquadri). Nelle aree e nella difficoltà, invece, è disattivato in indaco pallido. Incoerente, ma è un problema di logica, non di colore. |
| Aree | `ob-2-aree`, `ob-2-aree-scelte` | otto tessere bianche con un'icona su un tondo pastello di otto colori; la scelta ha bordo e spunta indaco e fondo lavanda | prima il gruppo caldo rosa, arancio e rosso (Relazioni, Founder, Altro), poi le scelte indaco | prima esplosione di colore | È la prima volta che compare la policromia delle aree. La selezione indaco regge bene sopra gli otto colori. Il trio caldo rosa, arancio e rosso è esattamente il territorio cromatico di Segno. |
| Difficoltà | `ob-3-difficolta`, `-scelta` | icone indaco su lavanda, cerchi di spunta grigi | il titolo, poi «Continua» spento | serio, quasi clinico | Va bene così: un passo in cui ammetti una fatica non deve essere colorato. È il posto perfetto per la posa «capisce» di Segno, piccola e senza particelle. |
| Obiettivo | `ob-4-obiettivo`, `-scelto` | pastiglie grigie, «Continua» indaco | «Continua» | neutro | — |
| Pronto | `ob-5-pronto-0150…2000ms`, sia chiaro sia scuro | **cerchio verde pieno con alone verde**, coriandoli arcobaleno dall'alto, «Inizia» indaco | il cerchio verde, poi i coriandoli | festa | **Qui il colore cambia carattere di colpo.** Per tutto l'onboarding la gioia non c'era, poi arriva verde (il colore del «fatto», ma qui non hai fatto niente) e arcobaleno (un colore di nessuno). Segno «pronto», che rientra nel libro e fa l'occhiolino (`anim-tutte/chiavi-pronto/foglio.png`), è il momento giusto. Il suo corallo e oro deve sostituire sia il cerchio verde sia l'arcobaleno. |
| Prima casa | `ob-5-pronto-2000ms`, `fogli/azioni-tel-light-05.png` riquadri 4–7 | toast nero «Benvenuto, Giulia.», goccia indaco con occhi, «Scegli le azioni di oggi» indaco, coriandoli che finiscono di cadere | il toast nero in alto e la goccia indaco | accoglienza, ma fredda | **Tre masse indaco una sotto l'altra:** la goccia, il pulsante e il «+» in basso. La mascotte attuale (`illustrazioni.ts:70`) è dipinta con `--accento-pieno`, quindi si legge come un altro pulsante. Il benvenuto è un rettangolo nero: nel tema chiaro è l'elemento più pesante dello schermo. |

**Sintesi del percorso.** Il colore racconta lo stesso prodotto solo per l'indaco delle azioni, e quello regge.

Il carattere emotivo invece cambia tre volte senza preavviso:
1. indaco e bianco calmo nell'onboarding;
2. verde e arcobaleno alla fine;
3. policromia di aree, arancio e verde nell'app.

Poi c'è un quarto mondo, il nero della concentrazione. Nell'onboarding nessuno ti presenta il calore (Segno, il corallo, l'oro), quindi quando arriverà nell'app sembrerà un ospite. Deve entrare **dalla porta**, con l'animazione «benvenuto», e uscire con «pronto».

### 1.2 Nell'app

Sono la casa «Adesso» (`schermi/oggi-adesso__tel-light.png`), Attività, Andamento e Rituali. Il colore qui serve a tre scopi in competizione:
- **orientare**, con l'indaco: tab attivo, pulsante principale, «+»;
- **classificare**, con i colori delle aree: icone, puntini e il fondo della scheda «adesso»;
- **premiare**, con verde, arancio e coriandoli.

Il problema è che la scheda «adesso», il cuore dell'app, usa il colore di **classificazione** come fondo (`.casa-cuore`, `color-mix(… var(--c-area) 10% …)`, `app.css:4350`). La cosa più importante dello schermo cambia quindi tinta a seconda dell'area: crema per Finanze, azzurro per Studio, rosa per Relazioni, rossiccio per Altro. Nel tema scuro diventa marrone o blu notte: `azioni/az-adesso-fatto-0600ms__tel-dark.png` contro `oggi-prima__tel-dark.png`.

Per una persona con ADHD questo significa che il «posto dove guardare» cambia aspetto ogni volta. Il riconoscimento si appoggia alla posizione e alla forma, non al colore. Meglio una scheda sempre uguale (superficie neutra), con l'area detta da un'etichetta e da una barretta di colore.

---

## 2. Ogni azione e il suo colore

| Azione | Foto | Cosa succede al colore, e quando | Problema | Proposta |
|---|---|---|---|---|
| **«Fatto» su Adesso** | `azioni/az-adesso-fatto-0060…2500ms` (chiaro e scuro); `fogli/azioni-tel-light-01.png` | A 60 ms la scheda è **già** la cosa successiva («Confrontare piani telefonici», crema). Coriandoli arcobaleno dall'alto (pioggia: 40 pezzi, sei colori), toast nero «Abitudine spuntata. +8 XP» con XP indaco, la barra verde avanza. A 1200 ms i coriandoli cadono ancora sulla nuova scheda e sul suo «Falla adesso». A 2500 ms il toast si dissolve. | 1) La cosa fatta non diventa **mai verde sotto i tuoi occhi**: sparisce prima, quindi la conferma sul posto manca. 2) La festa si posa sul compito successivo. 3) Gli XP sono indaco su quasi nero: 2,7:1 (`.toast .xp { color: var(--accento-testo) }`), cioè la cifra della ricompensa è la cosa meno leggibile del toast. 4) Una pioggia piena per qualunque cosa svaluta la giornata chiusa. | **0–250 ms:** il pulsante «Fatto» si riempie di verde e la spunta si disegna sul posto. **250–700 ms:** Segno «fatta» (1,2 s, `chiavi-fatta`) nella scheda, oppure lo scoppio piccolo oro e corallo attorno al pulsante. **700–1000 ms:** la scheda scorre via e arriva la successiva, **senza** particelle sopra. XP in oro. Pioggia piena solo per la giornata chiusa o un rituale finito. |
| **Spuntare in un elenco** | `az-spunta-*` (Attività) | La riga sparisce subito, compare il toast nero «✓ Fatta. Annulla»; la spunta del toast è indaco (`.toast .ico { color: var(--brand-c) }`). Non si vede nessuno scoppio. | Il gesto più frequente della giornata ha una ricompensa **nera e indaco**, cioè neutra e di marca: non dice «bene». La spunta che conferma il fatto non è verde. | Il cerchio della riga si riempie di `--ok` (180 ms, a molla) e resta pieno per 300 ms prima che la riga si chiuda. Toast con l'icona verde. Al massimo 8–10 particelle oro e corallo, entro 60 px dal dito, sparite in 600 ms. |
| **Festa piena** | `az-festa-piena-0010ms` (a 10 ms non è ancora partita); pioggia visibile in `ob-5-pronto-*` | Due feste con due palette: **`moto.ts:49`** `#7c5df0 #4a7bf5 #2ab8e8 #0ca30c #eda100 #e87ba4` (pioggia e scoppio) e **`app.ts:6439`** `#ff5a5f #ffb400 #00c781 #3b82f6 #a855f7 #ff7ac6` (la `festa()` radiale, quando hai finito tutto oggi). | **I colori dei coriandoli sono casuali, non di marca.** Nessuno dei dodici è l'indaco dell'app (`#5b4ff5`) o un colore di Segno. Il viola `#7c5df0` è un indaco «quasi giusto», ed è peggio di uno sbagliato. Se chiudi l'ultima cosa con «Fatto» partono **entrambe**, cioè dodici colori diversi. | Una sola palette per i coriandoli, quella di Segno più un tocco di app (sezione 6). Nessun verde fra i coriandoli: il verde è «fatto», non «festa». |
| **Toast** | `az-toast-0300/1200ms`; `fogli/azioni-tel-light-03.png` | Nel tema chiaro è una pillola quasi nera (`inchiostro-1` al 94% con l'indaco), con l'«Annulla» grigio; nel tema scuro è `superficie-3`, grigio con bordo. Molla d'ingresso di 0,38 s, uscita a 2,5 s (6,5 s con Annulla). | Nel chiaro il toast è la massa più scura dello schermo e copre le linguette in alto. Per un «Fatta.» è troppo pesante, per un «Spunta tolta» va bene. Lo stesso tono serve per buone notizie, annullamenti e benvenuti. | Il toast resta inverso per la leggibilità, ma **l'icona porta lo stato**: verde per fatto, oro per XP, `inchiostro-muto` per annullato o spostato, corallo solo per «Benvenuto/Bentornato» (è Segno che parla). XP in oro. |
| **Foglio che si apre** | `az-foglio-*` (il foglio non si vede); `schermi/scheda-attivita__tel-light.png`, `giornata-sonno-aperto__tel-light.png` | Un velo grigio scuro sullo schermo, il foglio bianco sale. Il velo nel chiaro è un grigio pesante (vedi `schermi-tel-light-05.png`). | Nessun problema di significato. Il velo è un po' cupo: un grigio-viola o un nero più leggero renderebbe l'apertura meno «modale da sistema». | Velo `rgba(16,17,22,.32)` nel chiaro e `rgba(0,0,0,.55)` nello scuro, in 200 ms. Niente colore sul foglio. |
| **«Non ce l'ho fatta…»** | `az-mancata-*`; codice `Mancata.tsx`; stile `app.css:1545-1556` | Il pulsante è grigio (`--inchiostro-2`), ma **in hover diventa `--avviso`, giallo**. Il foglio è neutro: pastiglie grigie, la scelta in indaco, «Segna e vai avanti» indaco. Dopo, se c'è un pezzo fatto, partono festa leggera e «Salvato. +XP», altrimenti il toast «Segnata.». Nella giornata la cosa mancata ha **bordo sinistro e bordo `--avviso`** (`.tl-blk-att.mancata`). | Il foglio in sé non giudica, ed è la parte migliore. Ma il giallo d'avviso in hover dice «attenzione» proprio sul pulsante che deve sembrare sicuro da premere. E nella giornata il giallo resta per sempre sulla cosa mancata, cioè è un timbro. È anche il colore di «in ritardo», quindi mancata e ritardo si confondono. | Hover in `inchiostro-1`, mai giallo. Il foglio si apre con Segno «capisce» (3 s, nessuna particella, `chiavi-capisce`) su un fondo «comprensione» neutro e caldo. Nella giornata la cosa mancata diventa **grigia, a bordo tratteggiato**, con l'icona «annulla» in `inchiostro-muto`: un segno di cosa successa, non di colpa. Se c'è un pezzo fatto, mai coriandoli: un solo bagliore oro sugli XP. |
| **Timer in corso** | `az-timer-corre__tel-light.png`, `__tel-dark`; `schermi/timer-concentrazione__*` | **Nero `#0a0a0a` anche nel tema chiaro**, con un anello indaco `#6f5bf0`. È un terzo indaco, diverso sia da `#5b4ff5` sia da `#8f87ff`. Sotto, «Pausa» grigio scuro e **«Fatto» verde pieno**, il più saturo dello schermo. | Gerarchia invertita: il primo colore che l'occhio trova è il verde di «Fatto», cioè l'uscita dalla concentrazione, non il tempo. Il passaggio dal chiaro al nero è un salto di luminosità del 95% in 220 ms (`animation: sfuma .22s`): abbagliante al contrario. | Lo schermo di concentrazione usa i token dello scuro (`#0f0f0f`, non un quinto nero) e ci entra con una dissolvenza di 400 ms. L'anello è `--accento` dello scuro (`#8f87ff`) ed è l'unico colore pieno. «Fatto» diventa un pulsante con il bordo verde o un testo verde. «Pausa» resta neutro. |
| **Timer in pausa** | `az-timer-pausa__*` | L'anello diventa **verde `#0ca30c`** (`.conc-anello.in-pausa`); il testo dice «In pausa». | **Violazione semantica:** verde vuol dire «fatto», e la pausa non è fatta. | In pausa l'anello si **desatura** (grigio `inchiostro-muto` al 60%) e respira (opacità tra 0,6 e 1, ogni 2 s). La pausa è calma, non successo. |
| **Fine della concentrazione** | animazione `chiavi-concentrazione` | Oggi: il suono «fine». | — | Per 500 ms l'anello si chiude e diventa **oro**, poi entra Segno «concentrazione» con l'anello d'oro del «ding» (lo stesso cerchio!). La continuità anello del timer → anello di Segno è un regalo di motion design. |
| **Serie / fiamma** | `schermi/oggi-adesso__*` («🔥 38 giorni»), `andamento__*` | La pastiglia è salmone con la cifra arancio scuro `#b4470f` e una fiamma `#eb6834` che guizza (1,8 s, all'infinito). Nell'Andamento la fiamma è grande e i giorni sono quadrati verdi. | 1) `#eb6834` è **identico** all'area Progetti Founder. 2) La fiamma si muove **sempre**, su ogni schermata Adesso: un movimento perpetuo nel campo visivo, che per l'ADHD è un richiamo continuo. 3) È il secondo elemento più saturo della casa e compete con la scheda «adesso». | La fiamma è ferma; si muove solo quando la serie **cresce**, il primo «fatto» del giorno: un guizzo di 600 ms e un bagliore oro. Il colore della serie diventa un token proprio, `--serie-fuoco`. L'area Founder cambia, oppure le aree restano solo come piccoli segni (sezione 4). |
| **XP** | toast; `.vola-xp`; «Salva +5 XP» in `rituale-piano` | Gli XP volano in **indaco** (`.vola-xp { color: var(--accento) }`), nel toast sono indaco scuro, nei pulsanti sono bianchi. | L'XP ha il colore dei comandi: una ricompensa che sembra un tasto. | **Oro** (`--gioia`) dappertutto. Su chiaro serve `--gioia-testo` `#8a5a00` (5,5:1) per la cifra, oppure una pastiglia oro con testo scuro. |
| **Stati vuoti** | `azioni/vuoto-oggi`, `vuoto-attivita`, `vuoto-scoperte` | La goccia indaco con gli occhi fluttua in 5 s; il pulsante sotto è indaco. Con `mascotte('festa')` compaiono due stelline `#ffb400` e `#ff5a5f`. | La mascotte si confonde con il pulsante, e le stelline sono altri due colori senza famiglia. | Segno «calma» (il loop di 4 s) su Oggi vuoto, Segno «giornata» quando hai chiuso tutto. Il pulsante sotto resta l'unico indaco. |
| **Premuto / focus** | `st-premuto`, `st-focus`, `st-hover` | Premuto: scala a 0,98. Focus: anello indaco sull'avatar. | Corretto. | Tenere l'anello di focus sempre `--accento`; non usare mai l'oro o il corallo per il focus (sono emozioni, non stato d'interfaccia). |

---

## 3. I colori che oggi hanno un significato emotivo, e dove si scontrano

| Colore | Hex | Oggi significa | Dove compare | Conflitto |
|---|---|---|---|---|
| Indaco | `#5b4ff5` / scuro `#8f87ff` (+ `#6f5bf0` del timer, `#7c5df0` dei coriandoli) | agire, essere qui | pulsanti principali, «+», tab attivo, badge, puntino dei Rituali, XP, mascotte attuale | Troppi indachi diversi (quattro), e troppi usi: anche XP e mascotte. |
| Verde | `--ok #16b364`, `--ok-pieno #0a7a42`, timer `#0ca30c` | fatto | spunte, «Fatto» delle abitudini, barra del giorno, giorni della serie, «Tutto pronto» | Usato anche per la **pausa** e per un benvenuto (Tutto pronto). L'area Salute `#008300` è quasi lo stesso verde: un cerchio d'abitudine di Salute ancora da fare sembra «fatto» (`schermi/attivita-abitudini__tel-light.png`: i cerchi verdi vuoti). |
| Arancio | `#eb6834` | serie viva | fiamma, barra della scala | Identico all'area Founder. |
| Giallo d'avviso | `--avviso #fab219` | in ritardo / mancata | stato «in ritardo», mancata nella giornata, hover di «Non ce l'ho fatta» | Quasi identico all'oro di Segno `#f5b440`, cioè alla gioia, e all'area Finanze `#eda100`. Il sole di «Pianifica la giornata» è un quarto giallo. |
| Rosso | `--critico #d03b3b` | distruggere | «Scarta», «Elimina» | Area «Altro» `#e34948`, corallo di Segno `#d9445a`. |
| Blu | `--serie-1 #2a78d6` | grafici, costanza | mappa «Costanza» | Identico all'area Studio. |
| Arcobaleno | 12 colori in due palette | festa | coriandoli | Nessuno è di marca. |

---

## 4. La gerarchia dell'attenzione (ADHD)

**Regola di lettura.** In ogni schermata ci dev'essere **una sola massa satura** e deve essere l'azione che l'app consiglia. Il resto è neutro oppure piccolo.

| Schermata | Foto | Ordine reale dell'occhio | Ordine giusto | Cosa cambiare |
|---|---|---|---|---|
| Adesso con un'azione | `az-adesso-fatto-2500ms__tel-light` | 1) «Falla adesso» indaco; 2) il fondo crema della scheda; 3) la pastiglia arancio «38»; 4) il «+» indaco; 5) il badge «6» indaco | 1) titolo e «Falla adesso»; 2) «Fatto»; 3) il resto | Scheda neutra, serie desaturata quando non sta cambiando, badge «6» grigio. Un contatore di cose in sospeso nel colore di marca è una pressione. |
| Adesso con un'abitudine | `oggi-prima__tel-light` | 1) «Fatto» verde; 2) il fondo azzurro; 3) la serie; 4) il «+» | va bene che «Fatto» sia primo | Ma qui il pulsante principale è **verde**, mentre con un'azione è **indaco**. Il primario cambia colore a seconda del tipo, quindi la mano non impara dove andare. Proposta: il primario è sempre indaco («Fatto» per le abitudini, «Comincia» o «Falla adesso» per le azioni). Il verde arriva **dopo**, come conferma. |
| Adesso vuoto | `vuoto-oggi__tel-light` | 1) la goccia indaco; 2) «Scegli le azioni di oggi»; 3) «Aggiungi»; 4) il «+» | Segno, poi il pulsante | Segno in corallo separa il personaggio dal comando. |
| Attività | `schermi/attivita-dafare__tel-light.png` | una pioggia di «+ Oggi» lavanda (dieci pastiglie uguali) e le icone delle aree | i titoli | Le dieci «+ Oggi» lavanda fanno un motivo ripetuto che chiede attenzione dieci volte. Meglio un'icona grigia che si colora al passaggio o al tocco. |
| Da sistemare | `attivita-sistemare__tel-light` | «Oggi» indaco pieno, poi «Scarta» rosso | la nota | Va bene; il rosso è solo testo e icona. |
| Timer | `az-timer-corre__*` | «Fatto» verde, poi le cifre | le cifre e l'anello | Vedi la sezione 2. |
| Andamento | `schermi/andamento__tel-light.png` | i sette quadrati verdi, la mappa blu, le barre delle otto aree | la cifra 38, poi la settimana | Mappa «Costanza» in scala di verde (è «fatto»), non nel blu di Studio. |
| Onboarding, aree | `ob-2-aree-scelte` | il gruppo caldo, poi la selezione indaco | la selezione | Accettabile: è l'unico posto dove le aree si presentano tutte insieme. |

---

## 5. Segno nelle schermate e nel tema scuro

### 5.1 Primario, complementare o accento a parte?

**Accento a parte**, cioè il colore del personaggio, e per tre ragioni:
1. **Se fosse il primario,** il corallo dovrebbe reggere testo bianco nei pulsanti (4,26:1 su `#d9445a`, appena sotto la soglia AA per il testo normale). Soprattutto, ogni pulsante diventerebbe «Segno», e la mascotte non avrebbe più un colore suo. È esattamente il problema della goccia indaco di oggi.
2. **Il complementare dell'indaco** (tono ~245°) è un giallo-lime (~65°): non c'entra con Segno, e Segno è già fatto.
3. **Indaco e corallo stanno a ~107° di tono e a temperature opposte.** È un contrasto caldo/freddo leggibile anche da chi distingue male i colori, e porta un significato: freddo vuol dire **fare** (l'app ti chiede), caldo vuol dire **sentire** (l'app ti risponde).

Questo dà una regola semplice: **il corallo non è mai un comando**. Non compare su pulsanti, linguette, badge o anelli di focus. Compare solo quando Segno parla: animazioni, benvenuto, festa, comprensione.

### 5.2 Le collisioni da togliere prima che Segno entri

| Conflitto | Misura | Proposta |
|---|---|---|
| Area «Altro / Esplorazione» `#e34948` vs corpo `#d9445a` | 1,08:1, indistinguibili | Spostare lo slot 8 fuori dai rossi. Un ardesia-azzurro per l'esplorazione, ad esempio `#3f7f9a` (chiaro) e `#6fb3cf` (scuro), oppure un viola-prugna. Nessuna area deve stare fra 340° e 15° di tono. |
| `--critico #d03b3b` vs corallo | stesso tono (~355°) | Il distruttivo resta rosso, ma più scuro e mattone: `--critico` `#b42318` e testo `#a32222` (già così). Soprattutto, Segno non va **mai** messo vicino a «Elimina» o «Scarta». |
| Area Relazioni `#e87ba4` vs risvolto `#f4a3ae` | vicini | Il rosa di Relazioni va spinto verso il magenta-orchidea, ad esempio `#c94f9a` / `#e07bbd`, così il rosa cipria resta solo del risvolto. |
| Oro `#f5b440` vs `--avviso #fab219` e area Finanze `#eda100` | quasi uguali | L'oro è gioia: si muove ed è breve. Il giallo d'avviso è un orario ed è fermo. In più, la cosa mancata **perde** il giallo (vedi la sezione 2). Il sole di «Pianifica la giornata» va reso più neutro (icona `inchiostro-2` su crema) o sarà letto come un altro richiamo. |
| Libro beige `#e8c4a0` (benvenuto, pronto) vs scheda Finanze crema | vicini | Se la scheda «adesso» diventa neutra (sezione 1.2), il problema sparisce. |

### 5.3 Dentro le schermate

- **Dimensione.** Nel telefono Segno occupa al massimo 96–120 px nella casa vuota, 56–72 px nei toast o nei fogli («capisce», «fatta» in miniatura) e fino a 200 px nei momenti a schermo pieno (giornata chiusa, traguardo dei 7 giorni, benvenuto).
- **Fondo.** Le animazioni sono disegnate su `#fff6f1`. **Nell'app non va importato il quadrato crema:** Segno deve stare su fondo trasparente, con la sua ombra a terra. Su `--pagina` chiaro `#f7f6fb` il crema farebbe una toppa calda in una pagina fredda. Il crema si usa solo come «stanza» della celebrazione (sezione 6), su tutto lo schermo o su tutta la scheda, mai come riquadro attorno al personaggio.
- **Ombra a terra.** Oggi è `#f3dcd6`. Su chiaro va `rgba(217,68,90,.12)`, su scuro `rgba(255,255,255,.06)`. Il colore fisso sparirebbe sul chiaro freddo e farebbe una macchia rosa sullo scuro.

### 5.4 Sopra il tema scuro

- **Contrasto.** Il corpo `#d9445a` su `#0f0f0f` fa 4,5:1 e regge da solo; il risvolto `#f4a3ae` fa 9,8:1 e diventa la parte più luminosa della figura (bene, perché è lì che vivono le emozioni). Gli occhi `#2b0f1c` sul corallo vanno bene in entrambi i temi.
- **Niente versione «scura» di Segno:** il nastro resta dello stesso colore, come un oggetto vero sotto una luce diversa.
- **Al massimo un alone caldo dietro**, `radial-gradient` del corallo al 10% dentro 1,2× la sua altezza, solo nelle stanze di gioia. Mai nella calma.
- **L'oro** `#f5b440` su scuro fa 10,5:1: le particelle brillano molto di più che sul chiaro. Nello scuro vanno ridotte del 30% in numero e del 20% in opacità.

---

## 6. Palette emotiva per le animazioni

Per tutte le stanze valgono quattro principi:
- Il personaggio resta sempre uguale: corpo `#d9445a`, risvolto `#f4a3ae`, occhi `#2b0f1c`.
- Cambiano tre cose: la **stanza** (il fondo), le **particelle** e il **testo del traguardo**.
- L'indaco dell'app entra nelle particelle **solo** nella gioia grande, al 15% dei pezzi, per legare Segno al prodotto.
- Il verde non entra mai in una celebrazione.

### 6.1 La tabella

| Stanza | Usi | Fondo chiaro | Fondo scuro | Particelle | Testo traguardo | Intensità e durata |
|---|---|---|---|---|---|---|
| **Gioia grande** | giornata chiusa, rituale chiuso, 7/30/100 giorni di fila, fine onboarding («pronto») | velo a schermo pieno da `--pagina` a `#ffe4e4`; raggi `#ffd6da` solo per i traguardi di serie (`anim-v3`) | da `--pagina` a `#2b161a` (corallo al 14% su `#0f0f0f`); raggi `#3b1b20` | coriandoli: **35% oro `#f5b440`, 30% corallo `#d9445a`, 20% rosa `#f4a3ae`, 15% indaco** (`#5b4ff5` chiaro / `#8f87ff` scuro); scintille oro. 30–40 pezzi nel chiaro, 24–28 nello scuro | chiaro `#b8324a` (5,4:1 su `--pagina`; `#d9445a` solo se ≥24 px grassetto); scuro `#ff8a9a` (8,5:1). Cifre del traguardo in oro su scuro, `#8a5a00` su chiaro | il velo sale in 300 ms e resta al massimo 2,5 s; le particelle durano 1,4–2 s; esce in 400 ms. **Al massimo una volta al giorno**, più i traguardi. |
| **Gioia piccola** | cosa fatta, spunta, check-in, pezzo di una cosa mancata | nessun velo; un lampo dove hai toccato: cerchio `--ok` al 16% che si allarga da 0 a 48 px in 250 ms | lo stesso, `--ok` al 22% | 6–10 scintille o rettangoli: **oro 60%, corallo 40%**, raggio ≤ 60 px, nessuna caduta oltre i 120 px | XP in oro (`--gioia-testo` su chiaro) che sale di 24 px | 500–700 ms in tutto; Segno «fatta» (1,2 s) solo nella casa |
| **Calma** | attesa (loop), timer in corso, Oggi vuoto prima di scegliere | `--pagina`, eventualmente `#f4f2fa` (indaco al 3%) | `#0f0f0f` / `#15141b` | **nessuna** | nessuno; testo `inchiostro-2` | movimenti ≥ 2 s, solo sinusoidi (respiro); nessun colore che cambi |
| **Comprensione** | «Non ce l'ho fatta», un giorno vuoto nella serie, salti | `#fbf7f5` (crema desaturato, più grigio di `#fff6f1`) | `#171415` | **nessuna**; al massimo un solo bagliore oro sugli XP se c'è un pezzo fatto | `inchiostro-1`; mai rosso, mai giallo d'avviso | 3 s («capisce»); nessun suono discendente in minore (oggi «guaio» è `311/293 Hz`: va evitato qui) |
| **Bentornato** | rientro dopo giorni d'assenza, prima apertura del mattino | `#fff6f1` per tutta la scheda d'accoglienza | `#1c1513` (crema bruciato), con alone corallo al 8% | 3–4 scintille oro al risveglio, nient'altro | «Bentornato/a, Nome» in `inchiostro-1`; nome in `#b8324a` / `#ff8a9a` | 3,5 s; il velo si scioglie nella pagina in 400 ms. **Mai la serie in vista** (lo dicono già le note di `bentornato`) |

### 6.2 Token proposti

```css
:root {
  --segno: #d9445a;   --segno-risvolto: #f4a3ae;   --segno-occhi: #2b0f1c;
  --gioia: #f5b440;   --gioia-testo: #8a5a00;
  --stanza-gioia: #ffe4e4;   --stanza-raggio: #ffd6da;
  --stanza-calma: #f4f2fa;   --stanza-capisce: #fbf7f5;   --stanza-bentornato: #fff6f1;
  --traguardo-testo: #b8324a;
  --serie-fuoco: #eb6834;    /* esclusivo: nessuna area lo usa */
}
:root[data-mode="dark"] {
  --gioia-testo: #f5b440;
  --stanza-gioia: #2b161a;   --stanza-raggio: #3b1b20;
  --stanza-calma: #15141b;   --stanza-capisce: #171415;   --stanza-bentornato: #1c1513;
  --traguardo-testo: #ff8a9a;
  --serie-fuoco: #ff9a62;
}
```

Con questi token:
- `COLORI_FESTA` (`moto.ts:49`) e `COL` (`app.ts:6439`) diventano **una** costante che legge i token.
- La mascotte attuale (`illustrazioni.ts:70`) va sostituita da Segno.

---

## 7. Regole d'uso del colore per movimento e feedback

Per ogni regola, sotto ci sono le violazioni di oggi.

**R1. Un colore, un significato, in tutta l'app.**
- Indaco = agisci.
- Verde = fatto.
- Oro = ricompensa.
- Corallo = Segno ti parla.
- Arancio = serie.
- Giallo d'avviso = orario.
- Rosso = distruggi.

Violazioni:
- Il verde viene usato per la pausa (`.conc-anello.in-pausa`) e per «Tutto pronto» (`.bv-festa-cerchio`).
- L'indaco viene usato per gli XP (`.vola-xp`, `.toast .xp`) e per la mascotte (`mascotte()`).
- L'arancio della serie è lo stesso dell'area Founder.
- Il blu della costanza è lo stesso dell'area Studio.

**R2. Il colore della conferma arriva sul posto, prima di tutto il resto (≤ 100 ms dal tocco), e resta visibile almeno 300 ms prima che l'oggetto se ne vada.**

Violazioni:
- «Fatto» su Adesso: a 60 ms la scheda è già un'altra.
- Spunta in Attività: la riga sparisce senza mai diventare verde.

**R3. La festa si posa su quello che hai fatto, mai su quello che devi fare.**

Violazione: la pioggia cade sulla scheda successiva e sul suo «Falla adesso» (`az-adesso-fatto-1200ms`).

**R4. Due feste, non di più, e quella grande è rara.**
- Gioia piccola: per ogni cosa fatta.
- Gioia grande: per la giornata chiusa, un rituale chiuso, un traguardo di serie. Al massimo una volta al giorno, più i traguardi.

Violazioni:
- `festeggia('pieno')` per ogni «Fatto» su Adesso (`app.ts:4160`).
- `festa()` e la pioggia partono insieme quando chiudi l'ultima cosa (`app.ts:6428` e `4160`).

**R5. Le particelle sono solo di marca:** oro, corallo, rosa e, nella gioia grande, indaco. Il verde, il blu e i colori casuali non ci vanno.

Violazione: dodici colori in due palette (`moto.ts:49`, `app.ts:6439`).

**R6. Sullo schermo si muove un solo colore alla volta.** Nessun movimento perpetuo e saturo fuori dalla stanza della calma.

Violazioni:
- La fiamma guizza all'infinito (`.fiamma`, 1,8 s infinite).
- La goccia dello stato vuoto fluttua all'infinito (`.vuoto .illo`, 5 s infinite). È accettabile solo perché è lenta e sarà sostituita dal respiro di Segno.

**R7. Durate del colore:**

| Cosa | Durata |
|---|---|
| tocco e premuto | ≤ 120 ms |
| conferma | 250–400 ms |
| gioia piccola | ≤ 700 ms |
| toast | 2,5 s (6,5 s con Annulla) |
| gioia grande | ≤ 2,5 s di velo |
| calma | cicli ≥ 2 s |

Un colore saturo che compare deve anche andarsene, tranne gli stati («fatto» resta verde).

**R8. L'intensità del colore segue la grandezza del gesto.**

| Gesto | Intensità |
|---|---|
| spunta | 16% di tinta locale |
| cosa fatta | pieno sul pulsante più qualche particella |
| giornata | velo a schermo intero al 100% di `--stanza-gioia` |

Oggi spunta, «Fatto» e onboarding usano la stessa pioggia.

**R9. Nessun colore d'allarme nei momenti di fallimento.** «Non ce l'ho fatta», un giorno vuoto, una serie interrotta: solo neutri, la stanza «comprensione» e Segno.

Violazioni:
- `.btn-mancata:hover { color: var(--avviso) }`.
- `.tl-blk-att.mancata` con bordo `--avviso`.
- `.mancata-segno { color: var(--avviso) }`.

**R10. Lo stato vuoto e il timer non usano il colore d'azione per decorare.** L'unico indaco è il pulsante da premere.

Violazioni:
- La mascotte indaco sopra il pulsante indaco.
- L'anello del timer in un terzo indaco (`#6f5bf0`).

**R11. I temi sono la stessa luce.**
- Il chiaro e lo scuro cambiano luminosità, non temperatura e non significato.
- Lo schermo di concentrazione usa i token dello scuro.
- Le schede non prendono la tinta delle aree.

Violazioni:
- `.concentra { background: #0a0a0a }` diverso da `--pagina` scuro `#0f0f0f`.
- `.casa-cuore` tinta per area, che nello scuro diventa marrone o blu (`app.css:4350`).

**R12. Il corallo non è mai un comando.**

Violazione: oggi il problema nasce al contrario, perché la mascotte ha il colore dei comandi.

**R13. Accessibilità.**
- Le cifre di ricompensa devono stare ≥ 4,5:1 sul loro fondo.
- Con `prefers-reduced-motion` o «effetti minimi», il colore della conferma resta (la spunta verde, gli XP in oro) e spariscono solo particelle e veli.

Violazioni:
- XP indaco su toast scuro a 2,7:1.
- Oggi `RIDOTTO` spegne tutta la festa (`moto.ts`, `if (RIDOTTO) return`), senza un colore che la sostituisca.

---

## 8. Priorità

1. **Subito, a basso costo:**
   - una sola palette di particelle (oro, corallo, rosa, indaco);
   - XP in oro;
   - l'icona del toast colorata per stato;
   - la pausa del timer grigia invece che verde;
   - `.btn-mancata:hover` neutro;
   - la cosa mancata grigia e tratteggiata nella giornata.
2. **Sequenza di «Fatto» (R2–R4):**
   1. conferma verde sul posto, 300 ms;
   2. gioia piccola;
   3. poi lo scorrimento alla cosa successiva;
   4. pioggia solo per la giornata o il rituale chiusi.
3. **Collisioni di palette prima di Segno:**
   - area «Altro» fuori dai rossi;
   - Relazioni verso l'orchidea;
   - Founder diverso da `--serie-fuoco`;
   - Costanza in scala di verde.
4. **La scheda «adesso» neutra**, con l'area in etichetta e barretta, nei due temi.
5. **Segno al posto della goccia:**
   - benvenuto e pronto nell'onboarding (al posto del cerchio verde);
   - calma su Oggi vuoto;
   - fatta (in miniatura) su Adesso;
   - capisce nel foglio «Non del tutto»;
   - concentrazione alla fine del timer (anello che diventa oro);
   - giornata e traguardo per la gioia grande;
   - bentornato al rientro.

   Ognuno nella sua stanza della sezione 6.
6. **La concentrazione** con i token dello scuro, la dissolvenza a 400 ms e «Fatto» secondario.
