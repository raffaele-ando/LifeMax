# LifeMax — Misura. Ingegnerizza. Massimizza.

Prototipo interattivo ad alta fedeltà di un **sistema operativo personale per il
miglioramento continuo**: studio/università, salute, progetti da founder, finanze,
relazioni, associazioni, lavoro — tutto misurabile, tutto ingegnerizzabile.

Progettato esplicitamente per un profilo con **bassa coscienziosità, alta apertura
mentale e ADHD**: ogni scelta di design discende da letteratura scientifica (vedi la
vista **Scienza** dentro l'app e la tabella sotto).

## Avvio

Nessuna build, nessuna dipendenza. Due modi:

```bash
# 1) doppio click su index.html, oppure
# 2) un server statico qualsiasi:
python3 -m http.server 8080   # → http://localhost:8080
```

Tutto persiste in `localStorage` del browser. Al primo avvio parte l'onboarding
(3 passi, <2 minuti) con l'opzione **"Parti con 8 settimane di dati demo"** per
esplorare il prototipo pieno di dati realistici.

## Il flusso completo (alta fedeltà, funzionante end-to-end)

Il "loop quotidiano" è implementato per intero e persistente:

**☀️ Mattina (60″)** max 3 azioni + intenzione «Se… allora…» → **🎯 Focus** una sola
azione a schermo, timer 10/25/50′ che registra i minuti da solo → **⚡ Check-in (10″)**
energia/focus/umore in 3 tap → **🌙 Sera (2′)** voto alle aree + vittoria + blocco →
**🗓️ Settimana** review strutturata → **🧪 Esperimenti** i dati raccolti alimentano
confronti baseline→intervento (N-of-1) su di te.

In ogni momento: **cattura istantanea** con `C`, `⌘K` o il bottone `＋` — un campo,
zero categorie, le decisioni si prendono dopo.

Il vocabolario è volutamente ridotto a tre parole — **butta giù → decidi → fai** —
ripetute uguali ovunque, così non ci sono nomi diversi per la stessa cosa (scelta di
progettazione per ridurre il carico su chi ha ADHD/bassa coscienziosità). «Le azioni di
oggi» hanno lo stesso nome in tutti e tre i punti in cui compaiono, con ruoli chiari: le
**scegli** in *Rituali → Mattina*, le **fai** una alla volta in *Oggi*, le **rivedi** in
*Panoramica*.

**📋 Attività** è organizzata in **quattro schede** (una alla volta, così la pagina
resta corta anche con decine di voci): **Da sistemare** (le catture da smistare in
*Oggi* / *Da fare* / *Scarta*), **Da fare** (il backlog, con **chip per area**,
**ricerca** e aree richiuse di default: niente scroll infinito), **In arrivo** (le cose
con una scadenza, dalla più vicina) e **Progetti**. Una cosa da fare può diventare un
**progetto**: la spezzi in **passi** ordinati, vedi una barra di avanzamento e il
pulsante **Passo** porta in *Oggi* solo il prossimo passo non ancora fatto — un po' per
volta invece di tutto insieme. Le **abitudini
ricorrenti** (Rituali → Abitudini) sono separate dalle azioni del giorno, con scelta
dei giorni e serie di costanza. Le **aree** sono personalizzabili (rinomina, crea,
rimuovi) da *Impostazioni → Gestisci le aree*. Il **check-in** usa una scala ancorata
con descrittori e il riferimento «il tuo solito» (media recente), così il punteggio
è meno ambiguo. Una **guida in-app** (*Impostazioni → Come si usa*) riassume il tutto.

**🕒 La giornata** è una **griglia oraria a blocchi**: sonno, pasti, abitudini e cose di
oggi occupano il tempo che scegli (durata regolabile), con gli spazi liberi visibili e
la riga «adesso». Rende concreto il tempo per chi fatica a percepirlo (time blindness).
È **sempre presente in due posti fissi**, con ruoli diversi: una **barra compatta in
cima a *Oggi*** per uno sguardo veloce, e la **pagina *Giornata*** a sé per la gestione
completa. La **barra** distingue i tipi a colpo d'occhio — le cose con una **durata**
precisa come segmenti che occupano il tempo, quelle a un **solo orario** come punti, i
**pasti** come tacche, le abitudini col contorno — con una piccola legenda dei conteggi;
toccandola si apre un **pop-up leggero** (solo la griglia della giornata, che si adatta
all'altezza dello schermo così non si scorre, con le spunte e un tasto «Gestisci la
giornata»). La **pagina *Giornata*** ha invece la **gestione completa**: in cima, un
unico pannello **Sonno e pasti** (riassunto sempre visibile, si apre per modificare) —
a letto/sveglia con le **ore di sonno** calcolate e ogni **pasto** uno per uno (nome,
ora, durata); vale per quel giorno e resta come registro, mentre il ritmo di base per
gli altri giorni si cambia da lì con «Cambia il ritmo di base» (o da *Impostazioni*).
Sotto: la griglia, l'editor sempre aperto di **orari e durate** e l'**aggiunta rapida**
di cose a oggi. La pagina ha poi quattro **orizzonti** — **Giorno**,
**Settimana** (7 colonne a blocchi, testo a più righe invece che troncato), **Mese** e
**Anno**. Il **Mese** è un calendario «a calore»: lo sfondo di ogni giorno si accende con
quanto è stato pieno e dei mattoncini colorati mostrano le cose fatte per area (i giorni
futuri sono tratteggiati). Da settimana e mese si apre il singolo giorno con un tocco.
Sonno, sveglia e pasti si impostano da *Sonno e pasti*.

## Più approcci UX, stessi dati (di proposito)

Tre modalità intercambiabili — la varietà è incanalata nel sistema invece che subita:

| Modalità | Per quando | Principio |
|---|---|---|
| 🎯 **Focus** | la testa è piena | una sola scelta possibile, ricompensa immediata |
| 📊 **Panoramica** | dashboard aperta tutto il giorno (desktop) | auto-monitoraggio reattivo, progresso visibile |
| 🌗 **Rituali** | mattina/sera/settimana | struttura esterna al posto della disciplina |

Due **skin** (🌿 Quiete a bassa stimolazione, 🕹️ Arcade ad alta salienza) e modalità
chiaro/scuro/auto. Desktop-first con sidebar; sotto 860px layout mobile con tab bar.

## Perché è fatto così (sintesi — la vista Scienza cita tutto)

| Scelta di design | Base scientifica |
|---|---|
| Cattura istantanea, zero categorie | CBT per ADHD adulto (Knouse & Safren 2010); cognitive offloading (Risko & Gilbert 2016) |
| Una sola prossima azione | deficit di funzioni esecutive (Barkley 1997); choice overload (Iyengar & Lepper 2000) |
| Intenzioni «Se… allora…» | Gollwitzer & Sheeran 2006, meta-analisi d≈0.65; Gawrilow & Gollwitzer 2008 su ADHD |
| Auto-monitoraggio visivo (heatmap, sparkline) | Harkin et al. 2016, meta-analisi di 138 RCT |
| XP immediati a ogni micro-azione | delay discounting in ADHD (Jackson & MacKillop 2016); gamification (Sailer & Homner 2020) |
| Streak **gentile** (un buco isolato non azzera) | auto-perdono e ripresa (Wohl et al. 2010; Breines & Chen 2012) |
| Rituali brevi a orario fisso | RCT CBT/meta-cognitiva per ADHD adulto (Safren et al. 2005, 2010; Solanto et al. 2010) |
| Max 3 azioni al giorno | goal-setting (Locke & Latham 2002); effetto Zeigarnik e pianificazione (Masicampo & Baumeister 2011) |
| Esperimenti N-of-1 | Lillie et al. 2011; standard CENT (Vohra et al. 2015, BMJ) |
| Progetti spezzati in passi, uno per volta in Oggi | sotto-obiettivi prossimali (Bandura & Schunk 1981); goal-setting (Locke & Latham 2002) |
| Timeline «La giornata» (sonno, pasti, abitudini, azioni) | difficoltà a percepire il tempo nell'ADHD (Barkley 1997); cognitive offloading del «quando» (Risko & Gilbert 2016) |
| Un solo vocabolario ripetuto ovunque (butta giù → decidi → fai) | struttura esterna coerente (Safren 2005; Solanto 2010); riduzione del carico da scelta (Iyengar & Lepper 2000) |
| Azioni non fatte muoiono col giorno | fresh start effect (Dai, Milkman & Riis 2014) |
| Frizione minima ovunque | formazione abitudini (Lally et al. 2010; Wood & Neal 2016) |

Le etichette di evidenza nell'app sono oneste: **alta** = meta-analisi/RCT,
**media** = studi solidi non conclusivi, **euristica** = pratica clinica ragionevole.
Il giudice finale è la vista Esperimenti: verifica sul singolo caso, non sulla media.

## Account e sincronizzazione cloud (Firebase)

L'app può funzionare in due modi:

- **Ospite (solo questo dispositivo):** i dati restano in `localStorage`. È il
  comportamento predefinito e l'unico fallback se Firebase non è raggiungibile.
- **Con account Google:** accedendo, tutti i dati vengono salvati su Firestore
  nel documento `users/{uid}` e sincronizzati in tempo reale su ogni dispositivo
  in cui usi lo stesso account Google.

L'integrazione è **progressive enhancement**: se lo script Firebase non si carica
(offline, rete bloccata), l'app continua a funzionare in locale senza errori.

### Come funziona la sincronizzazione (sicura contro la perdita di dati)

- Un solo documento per utente contiene l'intero stato serializzato in JSON.
- **Tutto viene salvato**: ogni azione, scritta, impostazione, selezione o
  eliminazione passa da un'unica funzione `save()` che persiste in `localStorage`
  ed emette l'evento `lm:change`; lo stesso evento fa partire il push sul cloud.
  Non esiste una modifica che aggiorni lo stato senza salvarlo.
- Le modifiche locali vengono salvate sul cloud con un piccolo ritardo (debounce).
- Un listener in tempo reale (`onSnapshot`) applica le modifiche fatte su altri
  dispositivi; se stai scrivendo in un campo, l'aggiornamento viene rimandato per
  non interrompere la digitazione.
- **Uno stato vuoto non sovrascrive mai dati reali.** Al primo accesso su un
  dispositivo si confronta la "ricchezza" (quantità di dati), non solo il
  timestamp: se il cloud ha dati e il dispositivo è vuoto, si adottano i dati del
  cloud (e viceversa). In tempo reale, un aggiornamento vuoto proveniente da un
  altro dispositivo viene ignorato se qui ci sono dati.
- **Backup automatici prima di ogni sostituzione**: in locale (contenitore
  dedicato in `localStorage`, ripristinabili da *Impostazioni → Backup e
  ripristino*) e sul cloud (sotto-collezione `users/{uid}/backups`). Nulla viene
  perso in modo irreversibile.

### Esporta / importa i tuoi dati

In *Impostazioni → I tuoi dati* puoi **esportare** l'intero stato in un file
`.json` (per conservarlo o spostarlo su un altro dispositivo) e **importarlo**.
L'import crea prima un backup dello stato attuale.

### Configurazione lato Firebase (una tantum)

Nella console del progetto `lifemax-9dc63`:

1. **Authentication → Sign-in method:** abilita il provider **Google**.
2. **Firestore Database:** crea il database (modalità produzione va bene).
3. **Firestore → Rules:** incolla il contenuto di [`firestore.rules`](firestore.rules)
   e pubblica. Garantisce che ogni utente acceda solo ai propri dati.
4. **Authentication → Settings → Authorized domains:** aggiungi il dominio su cui
   pubblichi l'app (per lo sviluppo locale `localhost` è già autorizzato).

Il login con Google richiede che la pagina sia servita via **http/https** (non
funziona aprendo il file con `file://`): usa un server statico, anche locale.

### Se il salvataggio cloud non funziona

L'app mostra lo stato di sincronizzazione accanto al tuo nome (footer della
sidebar su desktop, menu «Altro» su mobile): *Sincronizzazione… → Salvato nel
cloud*, oppure un messaggio di errore. Se vedi un errore, quasi sempre manca uno
dei passaggi di configurazione qui sopra:

- **«Database Firestore non raggiungibile»** → il database non è stato creato
  (punto 2): crealo nella console.
- **«Permessi Firestore negati»** → le regole non sono pubblicate (punto 3):
  incolla `firestore.rules` e pubblica.
- L'accesso funziona ma non salva → verifica che il dominio sia tra quelli
  autorizzati (punto 4).

Lo storico di **tutto ciò che fai** è nella scheda **Diario** dentro Panoramica,
giorno per giorno: azioni completate, check-in, review e note catturate, ma anche
un **registro** di ogni scelta e modifica (cose portate in Oggi, smistate, eliminate,
rinominate, cambi di area, orari e durate, sonno e pasti, impostazioni…). Di default
mostra le **cose importanti**; con il flag **«Tutto»** vedi anche le modifiche minori.
Il registro fa parte dello stato, quindi si salva e si sincronizza come il resto.

Nota sugli XP: completare una cosa dà XP; se **togli la spunta** (l'avevi messa per
errore) gli XP vengono **restituiti**, così il conteggio resta corretto.

## Struttura

```
index.html          shell (nav, overlay cattura, toast)
assets/app.css      design system: token, 2 skin, chiaro/scuro, mobile
assets/icons.js     iconografia SVG proprietaria + logo Google
assets/data.js      stato, XP/streak/esperimenti, hydrate/snapshot, seed demo
assets/charts.js    micro-libreria SVG: sparkline, trend, heatmap, barre, anello, A/B
assets/app.js       router, viste, timeline "La giornata", onboarding, cattura, UI account
assets/cloud.js     Firebase: accesso Google + sync Firestore (modulo ES)
firestore.rules     regole di sicurezza (accesso limitato ai propri dati)
```

### Grafici

La palette categorica (8 slot fissi, un colore per area di vita) è la palette di
riferimento validata per visione normale e CVD in entrambe le modalità
(ΔE adiacente ≥8 CVD, ≥15 visione normale); i tre colori sotto 3:1 su superficie
chiara sono sempre accompagnati da etichetta+icona, mai colore da solo. Sequenziale =
un solo blu chiaro→scuro (heatmap). Una sola scala Y per grafico. Tooltip su hover
ovunque; legenda sempre presente da 2 serie in su.

## Limiti del prototipo

- Senza account i dati restano solo in `localStorage` su quel dispositivo; con
  l'accesso Google vengono sincronizzati via Firestore (vedi sopra).
- Gli "input automatici" (calendario, wearable, screen time) sono fuori scope qui:
  il modello dati (`minuti[data][area]`, check-in timestampati) è già pronto a riceverli.
- L'analisi N-of-1 riporta medie ed effect size con avvertenze esplicite; non è
  un'inferenza statistica completa (niente autocorrelazione, niente randomizzazione).
