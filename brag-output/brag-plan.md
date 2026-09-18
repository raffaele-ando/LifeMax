# Brag Plan: LifeMax

## What is this app?

LifeMax is an Italian-language personal operating system for continuous improvement across
eight life areas (studio, salute, relazioni, finanze, associazioni, progetti founder, lavoro,
esplorazione), designed explicitly for a brain with **bassa coscienziosità, alta apertura, ADHD** —
and its entire design system was rebuilt by *measuring* instead of by taste, including measuring
away its own AI-generated look.

## The angle

**The app measures your life. Then it measured itself — and the audit is brutal.**

This is not a SaaS promo. LifeMax's own `DESIGN.md` is a confession log written in numbers:
a stylesheet that declared thirteen font weights while the browser drew two; a blurred aurora
that cost 18.7 fps and was invisible; a purple→blue→cyan gradient that a design skill calls
*"the most common AI design fingerprint"*, shipped on the "+" button until the person using it
said **«la UI di questo sito è troppo AI slop»**.

The video is the receipt. It opens on the accusation, pays it off with the fix, states three
measurements flat, then shows the actual instrument working.

**The video obeys the app's own design laws.** This is the specificity: LifeMax's `DESIGN.md`
says *«Si muove solo quello che dice qualcosa»* and *«l'accento è inchiostro»*. So the video
gets no gradients, no color washes, four type weights, flat ink `#17323f`, digits in the app's
own system serif, and motion durations lifted from the app's own scale (150 / 250 / 350 / 400 /
500ms). A chaotic or cinematic treatment would contradict the product on screen. Restraint here
is not a style choice — it is the argument.

## Hook (first 2-3 seconds)

The old app icon, alone on the pale page, wearing the purple→blue→cyan gradient it used to ship.
A small grey line underneath, in English, quoting the design skill: *the most common AI design
fingerprint*. Then the verdict slams in and holds:

> **«La UI di questo sito è troppo AI slop»**
> — chi la usa

Real quote, from the project's own `DESIGN.md`. Nobody scrolls past a product accusing itself.

## Key moments (the middle)

- **The gradient drains out of the mark** and sets to flat ink `#17323f`. One line: *L'accento è inchiostro.*
- **Three measurements, stated flat, one at a time**, in the app's own serif digits:
  `13` pesi dichiarati, `2` disegnati · `18,7 fps` costati da un'aurora invisibile · `825ms → 450ms`
  per l'ultima scheda che si posa.
- **The real "Adesso" screen**: one card, one next action — *Ripasso flashcard*, area Studio /
  Università, one green *Fatto*. The whole ADHD thesis in one frame.
- **Hard cut to the fullscreen timer**, black, giant serif `4:57`, *restano*. The product's own
  copy as the caption: *«Solo per partire.»* — five minutes, then it keeps going by itself for 25.
- **The payoff screen**: `66%` *ti riesce*, 82 fatte su 124, 38 giorni di fila.

## Outro / punchline

The lockup — **LifeMax · Misura. Ingegnerizza. Massimizza.** — then one line under it:

> **Anche su se stesso.**

The tagline is the app's promise to its user. The punchline is that the codebase took the same
treatment. It lands because the previous 20 seconds were the evidence.

## User flow worth showing

Pulled from Step 1 Q9 — the real demo build, captured from the running app:

1. **Entry** — *Oggi / Adesso*: the app has already chosen. One card, one action, one filled button.
2. **Key action** — tap *Timer* → *«Solo per partire»* → the fullscreen ring starts, `4:57 restano`.
3. **Result** — *Andamento*: `66% ti riesce`, `+10`, 38 giorni di fila, per-area bars in the
   eight validated colors.

Centerpiece scenes 4 and 5 are this flow, using real captured frames from
`brag-output/capture/app/` — not landing-page recreations.

## Tone

- **Preset:** `deadpan`
- **Creative direction:** *a measuring instrument filing a report on itself*
- **Interpretation:** Long holds, flat statements, big empty space, no exclamation anywhere.
  Numbers do the talking and are never dressed up. The one permitted rise in energy is the cut
  to the black timer. Adapted to 5 scenes rather than deadpan's usual 3-4, because the product
  flow earns two of them; holds stay long, so the pace is still unhurried.

## Format: landscape — 1920x1080
## Duration: 22.93s

## Visual identity (from the project)

- **Background:** `#f6f6f8` (`--pagina`, light) · `#0a0a0d` for the timer scene (app dark theme)
- **Surface:** `#ffffff` (`--superficie-1`), border `rgba(16,17,22,0.08)`
- **Accent:** `#17323f` (`--accento`, "inchiostro di petrolio") — **flat, never a gradient**
- **Text:** `#101116` (`--inchiostro-1`), `#565863` (`--inchiostro-2`), `#666873` (`--inchiostro-muto`)
- **Display font (digits, big numbers, screen titles):** `"New York", "Iowan Old Style", Cambria, Georgia, "Noto Serif", serif` (`--font-cifre`), `tabular-nums`
- **Body font:** `ui-sans-serif, -apple-system, "SF Pro Display", "Segoe UI", Inter, Roboto, sans-serif` (`--font`)
- **Weights — four only:** 400 testo · 600 forte · 750 titolo · 850 display
- **Radii:** 8 / 12 / 18 / 99px only
- **The dead gradient (scene 1 only, as the villain):** `linear-gradient(118deg, #7c5df0, #4a7bf5, #2ab8e8)`
- **Eight area colors (scene 5 bars only):** `#2a78d6` `#008300` `#e87ba4` `#eda100` `#1baf7a` `#eb6834` `#4a3aa7` `#e34948`
- **Strongest visual element:** the gradient mark collapsing to flat ink; then the giant serif `66%`.

## Source material (captured, ready to use)

- `capture/app/nav-oggi.png` — the Adesso screen, focus card, day strip
- `capture/app/timer-anello.png` — fullscreen dark timer, `4:57 restano`
- `capture/app/nav-andamento.png` — `66% ti riesce`, streak row, per-area bars
- `capture/screenshots/full-page.png` — hero *Misura. Ingegnerizza. Massimizza.*
- The old gradient icon is reproducible as inline SVG from `src/index.html` (favicon data URI).

## Share copy (draft)

Ho scritto un'app per misurare la mia vita. Poi ho misurato l'app: 13 pesi tipografici dichiarati
e 2 disegnati, un'aurora sfocata che costava 18,7 fps e non si vedeva, e un gradiente viola→blu
che era solo l'impronta digitale di una macchina. LifeMax — misura, ingegnerizza, massimizza.
Anche se stesso.

## Audio direction

- **Role:** sparse professional accents over a low bed. The music supports; it never celebrates.
- **Music:** `assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` — the slowest
  bundled track (109.96 BPM), the only one that does not feel like it is congratulating anybody.
- **Music treatment:** start at 0.0s, sit low (roughly -20 to -22 LUFS under the frames), no
  build, no drop. Short fade-in over the first 0.4s. Fade out across the last 1.2s so the
  punchline lands in near-silence.
- **Music cue guidance:** preset read from
  `assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.md`.
  Tempo 109.96 BPM. Two strong-cue locks: **13.11s** (strength 0.98 — the cut into the product)
  and **18.56s** (strength 0.99 — the cut to the result). Beat-grid window for the three
  sequential measurement rows: **7.64 / 9.29 / 10.93** (every third beat, ~1.65s apart —
  comfortably above the readable floor; do not tighten to consecutive beats, which would land
  0.55s apart and outrun reading). Every scene boundary sits on a grid point.
- **Audio-reactive treatment:** none. The product's own design file bans decorative motion
  (*«Si muove solo quello che dice qualcosa»*); an audio-reactive glow would be exactly the
  decoration this video is about removing.
- **SFX posture:** sparse, motion-matched, five cues at most in the whole video.
- **Audio-coupled moments:** the gradient draining to ink (one soft low settle); each of the three
  measurement rows arriving (one dry tick each, quiet, identical — they are a list, not a
  crescendo); the hard cut to the black timer (one clean transient, the loudest moment in the
  piece, still restrained).
- **Restraint rule:** no whooshes, no risers, no impacts on text, no swell into the outro, nothing
  on the logo. If a cue would read as "hype", cut it. Silence is an acceptable answer for any
  given beat.

## Storyboard

| # | Scene | Start | Dur | End |
|---|---|---|---|---|
| 1 | «AI slop» | 0.00 | 3.82 | 3.82 |
| 2 | L'inchiostro | 3.82 | 3.27 | 7.09 |
| 3 | Misurato, non sentito | 7.09 | 6.02 | 13.11 |
| 4a | Una cosa sola | 13.11 | 2.73 | 15.84 |
| 4b | «Solo per partire» | 15.84 | 2.72 | 18.56 |
| 5a | Il conto | 18.56 | 2.19 | 20.75 |
| 5b | La firma | 20.75 | 2.18 | 22.93 |

The mark itself is not inside scene 1 or 2 — it lives on its own layer spanning 0 → 7.09s, so its
position does not jump on the cut and the gradient can drain off a single continuous object.

### Scene 1 — «AI slop» — 0.00 → 3.82s

Pale `#f6f6f8` frame, deep margins. The retired LifeMax mark sits centered and still, wearing the
purple→blue→cyan gradient (`118deg, #7c5df0, #4a7bf5, #2ab8e8`) on a rounded square with the white
trending-arrow glyph — the favicon geometry from `src/index.html`, unchanged. Small grey line
beneath it in English, `--inchiostro-muto`: *the most common AI design fingerprint* (in at 0.62s).
At 1.09s the verdict arrives fast (400ms, the app's `--d-entra`) and then **holds**:
**«La UI di questo sito è troppo AI slop»**, with `— chi la usa` beneath it at 1.52s. The quote is
settled from 1.49s to 3.47s — **1.98s**, above the 8-word reading floor. Nothing else moves; no
camera move.
Sequential/interaction: none — one deliberate reveal, held.
Audio intent: the bed is already running, quiet and unbothered. No cue on the quote; the words
are the event.
Audio-coupled idea: none.
Music: low, neutral, no emphasis.
Transition mood: **hard cut** → Scene 2

### Scene 2 — L'inchiostro — 3.82 → 7.09s

Same frame, same mark position. At 3.92s the gradient **drains** off the mark over 500ms — the
app's own `--d-momento`, "il momento che vale" — leaving flat `#17323f` underneath. Ease
`cubic-bezier(.22, 1, .36, 1)`, the app's real `--ease-out`. **L'accento è inchiostro.** lands at
4.32s, then smaller and quieter, *Niente gradiente.* at 4.78s. Both hold until 6.74s.
Sequential/interaction: yes — one continuous state change on the mark, then two text lines 460ms apart.
Audio intent: relief without reward. One soft low settle as the colour sets, nothing on the text.
Audio-coupled idea: the colour-set moment takes the single low settle cue (4.32s).
Music: unchanged, still low.
Transition mood: **clean** → Scene 3

### Scene 3 — Misurato, non sentito — 7.09 → 13.11s

Label top-left, sans, `--peso-titolo`: **Misurato, non sentito.** (in at 7.24s). Three rows then
arrive one at a time, left-aligned on a fixed two-column grid, numbers in the app's serif
`--font-cifre` with `tabular-nums`, labels in sans `--inchiostro-2`:

1. **13 → 2** — pesi tipografici dichiarati, e quelli disegnati *(7.64s)*
2. **18,7 fps** — l'aurora sfocata che non si vedeva. Tolta. *(9.29s)*
3. **825 → 450 ms** — l'ultima scheda che si posa *(10.93s)*

Each row enters in 400ms and then holds. All three are on screen together from 11.33s to 12.96s —
**1.63s** with the full set settled. Rows never exit individually.
Sequential/interaction: yes — three rows, one by one, on every third beat (7.64 / 9.29 / 10.93),
never consecutive beats.
Audio intent: a ledger being read aloud by someone who is not impressed.
Audio-coupled idea: one dry, quiet, **identical** tick per row arrival. Same level each time — no
escalation.
Music: steady, no build.
Transition mood: **hard cut** → Scene 4a

### Scene 4a — Una cosa sola — 13.11 → 15.84s

Real captured UI. `nav-oggi.png` framed on the focus card via a transform-origin at the card's
true position in the capture (58.5% × 47.9%), on a slow punch-in 1.25 → 1.33 across the scene.
On screen: *Studio / Università* · **Ripasso flashcard** · the single green **Fatto** · *Timer* ·
*Salta oggi*. Caption lower-left on a solid ink plate: **Una cosa sola.** (in at 13.41s).
Sequential/interaction: yes — this is the flow's entry beat: the app has already chosen, and there
is exactly one filled button on the screen.
Audio intent: settled, matter-of-fact. No cue — the cut itself carries it.
Audio-coupled idea: none.
Music: unchanged.
Transition mood: **hard cut to black** → Scene 4b · `// beat-locked: 13.11s` (strong cue, 0.98)

### Scene 4b — «Solo per partire» — 15.84 → 18.56s

Hard cut to black. `timer-anello.png` full-bleed on `#0a0a0d`: giant serif **4:57**, *restano*,
the ring, the green **Fatto**, *Ferma e registra i minuti*. **No punch-in** — the still frame is
the point. Caption on the ink plate: **«Solo per partire.»** and beneath it, smaller,
*Cinque minuti, poi va avanti da solo di 25.* — the app's own words, verbatim (in at 16.09s).
Sequential/interaction: yes — the flow's key action. The light-to-black cut is the timer starting.
Audio intent: the one permitted lift in the whole piece, and it is still restrained.
Audio-coupled idea: one clean transient exactly on the cut (15.84s). Nothing on the caption.
Music: unchanged underneath — the transient does the work, not a swell.
Transition mood: **hard cut** → Scene 5a

### Scene 5a — Il conto — 18.56 → 20.75s

Cut back to light. `nav-andamento.png` framed on the headline stat (transform-origin 58.5% × 28.4%,
scale 1.25 → 1.31, nudged so the demo banner sits off the top edge): the giant serif **66%**, the
green **+10** pill, *ti riesce*, *82 fatte su 124 che ti eri messo · meglio dei 30 prima, che erano
il 56%*, and **38** giorni di fila. The XP consistency grid and *Le azioni di oggi* read below
without calling attention to themselves. Held for the full 2.19s.
Sequential/interaction: yes — the flow's result beat.
Audio intent: no cue. The number is the payoff; announcing it would undercut it.
Audio-coupled idea: none.
Music: still flat, no build.
Transition mood: **clean** → Scene 5b · `// beat-locked: 18.56s` (strong cue, 0.99)

### Scene 5b — La firma — 20.75 → 22.93s

Plain `#f6f6f8`. The now-flat ink mark (20.85s), **LifeMax** (20.95s), and beneath it
**Misura. Ingegnerizza. Massimizza.** in the serif display face (21.25s). One beat of nothing.
Then at 22.00s the last line lands in `--inchiostro-2`, small and dry:

> **Anche su se stesso.**

Holds 0.93s, then the frame simply ends. No zoom, no shine, no button.
Sequential/interaction: none — three quiet arrivals, then the punchline.
Audio intent: the bed fades out from 21.73s to 22.93s so **Anche su se stesso** lands in near
silence. That silence is the joke's timing.
Audio-coupled idea: none. Nothing on the logo, nothing on the punchline.
Music: fade to zero by 22.93s.
Transition mood: **end**

---

**Scene duration check:** 3.82 + 3.27 + 6.02 + 2.73 + 2.72 + 2.19 + 2.18 = **22.93s** ✓ (within 15–25s)

**Music mood for this video:** deadpan — a low, unhurried bed that never congratulates anybody.

**Audio summary:** A quiet 110 BPM bed runs the whole length at a low fixed level with no build;
five sparse cues total (one low settle on the ink at 4.32s, three identical dry ticks on the
measurement rows at 7.64 / 9.29 / 10.93s, one clean transient on the cut to black at 15.84s), and
a 1.2s fade-out from 21.73s so the final line lands in near-silence.
