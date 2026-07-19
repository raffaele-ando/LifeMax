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
zero categorie, le decisioni si prendono dopo, al triage dell'Inbox.

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
| Azioni non fatte muoiono col giorno | fresh start effect (Dai, Milkman & Riis 2014) |
| Frizione minima ovunque | formazione abitudini (Lally et al. 2010; Wood & Neal 2016) |

Le etichette di evidenza nell'app sono oneste: **alta** = meta-analisi/RCT,
**media** = studi solidi non conclusivi, **euristica** = pratica clinica ragionevole.
Il giudice finale è la vista Esperimenti: verifica sul singolo caso, non sulla media.

## Struttura

```
index.html          shell (nav, overlay cattura, toast)
assets/app.css      design system: token, 2 skin, chiaro/scuro, mobile
assets/data.js      stato, XP/streak/esperimenti, seed demo deterministico
assets/charts.js    micro-libreria SVG: sparkline, trend, heatmap, barre, anello, A/B
assets/app.js       router, 6 viste, onboarding, cattura globale
```

### Grafici

La palette categorica (8 slot fissi, un colore per area di vita) è la palette di
riferimento validata per visione normale e CVD in entrambe le modalità
(ΔE adiacente ≥8 CVD, ≥15 visione normale); i tre colori sotto 3:1 su superficie
chiara sono sempre accompagnati da etichetta+icona, mai colore da solo. Sequenziale =
un solo blu chiaro→scuro (heatmap). Una sola scala Y per grafico. Tooltip su hover
ovunque; legenda sempre presente da 2 serie in su.

## Limiti del prototipo

- Persistenza solo locale (`localStorage`): niente sync né backend.
- Gli "input automatici" (calendario, wearable, screen time) sono fuori scope qui:
  il modello dati (`minuti[data][area]`, check-in timestampati) è già pronto a riceverli.
- L'analisi N-of-1 riporta medie ed effect size con avvertenze esplicite; non è
  un'inferenza statistica completa (niente autocorrelazione, niente randomizzazione).
