# Brief di composizione — LifeMax

Due composizioni Hyperframes, stessa storia e stesso copy, due impaginazioni.

## Uscite

| Progetto | Tela | Video |
|---|---|---|
| `composition-9x16/` | 1080×1920 | `lifemax-9x16.mp4` |
| `composition-16x9/` | 1920×1080 | `lifemax-16x9.mp4` |

Durata 20,74s, 30 fps, H.264 + AAC. Il piano creativo sta in `brag-plan.md` ed è il contratto:
se qui e lì dicono cose diverse, vale il piano.

## Materiale

Schermate mobile vere, catturate con Playwright a **390×844 DPR 3** (quindi 1170×2532) sul build
in radice servito in locale, entrando dalla demo. Stanno in `assets/img/` di tutti e due i progetti
e in `capture/mobile/`:

| File | Schermata |
|---|---|
| `02-attivita.png` | Attività — «Da sistemare 6 · Da fare 9 · Abitudini 3» e la coda |
| `01-adesso.png` | Oggi / Adesso — la scheda sola, «Ripasso flashcard», Fatto |
| `04-timer-anello.png` | il timer a tutto schermo, 4:57 |
| `05-andamento.png` | Andamento — 66% «ti riesce», 38 giorni di fila |

Non vanno ritoccate né ridisegnate: si mostrano come sono.

## Come sono inquadrate

Ogni riquadro è una finestra su una fetta della schermata: un `div` che ritaglia, con dentro
l'immagine a larghezza fissa spostata con `top` negativo. Non è una cornice di telefono — a quelle
misure il testo dell'interfaccia non si leggerebbe in un feed.

La geometria si ricava dalle misure **logiche** della cattura (390×844). Detto `f` il fattore
`larghezza_immagine / 390`, una fetta da `L1` a `L2` ha altezza `(L2 − L1) × f` e l'immagine va
messa a `top: −L1 × f`.

| | 9:16 | 16:9 |
|---|---|---|
| larghezza immagine | 1000px (`f` = 2,564) | 780px (`f` = 2,0) |
| altezza immagine | 2164px | 1688px |
| Attività | L 20→520 | L 25→495 |
| Adesso | L 150→600 | L 150→590 |
| Timer | L 175→655 | L 175→650 |
| Andamento | L 92→430 | L 92→430 |

I riquadri portano `data-layout-allow-overflow`: l'immagine che sborda dal contenitore è il ritaglio,
non un difetto di impaginazione.

Nel 9:16 la fetta di Adesso arriva fino a «Le altre di oggi 1» apposta: si vede che le altre cose
esistono ma stanno chiuse, che è esattamente quello che dice la riga sopra.

## Copy

Solo italiano, e non si traduce. Testo esatto in `brag-plan.md` → *Copy definitivo*.

Da non fare: metafore, frasi a effetto, punti esclamativi, parole tipo «rivoluziona» o «sblocca»,
e in generale qualsiasi riga che una persona non direbbe parlando.

## Colore e carattere

- Fondo: `#17323f` (l'accento vero dell'app), piatto, **nessun gradiente**
- Riquadri: bordo `rgba(255,255,255,0.16)` e un'ombra sotto; quello del timer ha il fondo `#0a0a0d`
  e il bordo un po' più chiaro, se no sul fondo scuro non si stacca
- Testo grande: `--font-cifre` dell'app (graziato di sistema), bianco
- Testo piccolo: `--font` dell'app, bianco al 74%
- Chiusura: `#f6f6f8`, marchio inchiostro, nome `#101116`, promessa `#565863`
- Quattro pesi: 400 / 600 / 750 / 850

Le famiglie sono quelle vere dell'app e finiscono su `serif` / `sans-serif` senza `@font-face`,
perché il progetto non scarica byte di font. In rendering il compilatore mappa il graziato su
EB Garamond e il sans su Inter; sulle macchine vere l'app prende New York o Georgia.

## Movimento

Durate dalla scala dell'app — 150 / 250 / 350 / 400 / 500ms — sulla sua curva
`cubic-bezier(.22, 1, .36, 1)`.

Ogni scena entra e se ne va sul fondo inchiostro, così i tagli si leggono come dissolvenze. Nel
9:16 il riquadro sale dal basso, nel 16:9 entra da destra (il verso in cui si legge: prima la
frase, poi la prova). Niente zoom, niente particelle, niente aloni.

## Audio

- Musica: `happy-beats-business-moves-vol-10` (109,96 BPM), `data-volume="1"` con il livello
  portato dalle curve (0 → 0,20 in 0,4s, e 0,20 → 0 da 19,5s). Il livello sta nelle curve e non in
  `data-volume`, se no il lint segnala `audio_volume_tween_overrides_gain`.
- Tre effetti, uno per scena di prodotto, ognuno su una traccia sua: `bong_001` a 4,45s,
  `click2` a 8,57s, `impactSoft_medium_001` a 12,91s. Tutti a basso volume.
- `// beat-locked: 18.55s` — la riga «Una cosa alla volta.» sul colpo forte (0,98).
- Niente risalite, niente whoosh, niente colpo sul logo.

## Note tecniche dell'ambiente

- GSAP sta in `assets/js/`: il browser di rendering non si fida del certificato della CDN.
- ffmpeg e ffprobe non sono nell'immagine: vanno installati (binari statici in `/usr/local/bin`)
  o `render` si ferma subito.
- Le catture vogliono `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` e il build servito su
  `localhost:4173`.

## Gate

`npx hyperframes check` a zero rilievi in tutti e due i progetti prima di rendere.
