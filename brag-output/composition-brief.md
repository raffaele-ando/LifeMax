# Hyperframes Composition Brief: LifeMax

## Objective

Create a short launch-style brag video for **LifeMax**, an Italian personal operating system for
continuous improvement. The video's argument is that the app measures your life — and that the
codebase then took the same treatment and published the results.

## Output

- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: **landscape — 1920x1080**
- Duration: **22.93s** (rendered: 22.934s, 688 frames @ 30fps)

## Source Material

- Project root: `/home/user/LifeMax`
- Primary files read: `README.md`, `DESIGN.md`, `src/index.html`, `src/stile/app.css`,
  `src/dati/dati.ts`, `src/schermi/*.tsx`, `package.json`
- Product name: **LifeMax**
- Tagline: **Misura. Ingegnerizza. Massimizza.**
- Strongest claim: the design system is derived from measurement, not taste — documented with
  numbers in the project's own `DESIGN.md`.
- Key UI moments to show (real captures, already in `assets/img/`):
  - `assets/img/nav-oggi.png` — the *Adesso* screen: one card, one next action
  - `assets/img/timer-anello.png` — the fullscreen dark timer, `4:57 restano`
  - `assets/img/nav-andamento.png` — the payoff: `66% ti riesce`, 38 giorni di fila
- The retired gradient mark is reproducible as inline SVG from `src/index.html`'s favicon data URI:
  `linear-gradient(118deg, #7c5df0, #4a7bf5, #2ab8e8)`, 18px radius, white trending-arrow glyph.

### Copy that must appear verbatim

- `the most common AI design fingerprint`
- `«La UI di questo sito è troppo AI slop»`
- `— chi la usa`
- `L'accento è inchiostro.`
- `Niente gradiente.`
- `Misurato, non sentito.`
- `13 → 2` · `pesi tipografici dichiarati, e quelli disegnati`
- `18,7 fps` · `l'aurora sfocata che non si vedeva. Tolta.`
- `825 → 450 ms` · `l'ultima scheda che si posa`
- `Una cosa sola.`
- `«Solo per partire.»`
- `Cinque minuti, poi va avanti da solo di 25.`
- `LifeMax`
- `Misura. Ingegnerizza. Massimizza.`
- `Anche su se stesso.`

All on-screen copy is **Italian** (except the one English design-skill quote in scene 1, which is
quoted as English in the source). Do not translate anything.

## Creative Direction

- **Tone preset:** `deadpan`
- **Creative direction:** *a measuring instrument filing a report on itself*
- **Interpretation:** Long holds, flat statements, generous empty space, no exclamation marks
  anywhere. Numbers carry the video and are never dressed up. Exactly one rise in energy is
  permitted: the hard cut to the black timer frame.
- **Angle:** The app measures your life; then it measured itself, and the audit is unflattering.
  LifeMax's own `DESIGN.md` is a confession log in numbers — thirteen declared font weights while
  the browser drew two, a blurred aurora that cost 18.7 fps and was invisible, and a
  purple→blue→cyan gradient shipped on the "+" button until the person using it said
  *«la UI di questo sito è troppo AI slop»*. The video is the receipt.
- **Hook:** the retired gradient mark alone on the pale page, the English design-skill verdict
  beneath it, then the user's own quote slamming in and holding.
- **Outro / punchline:** the tagline, one beat of nothing, then `Anche su se stesso.` in near-silence.

### The video obeys the product's design system

This is the specificity requirement, not decoration. `DESIGN.md` states *«l'accento è inchiostro»*
and *«Si muove solo quello che dice qualcosa»*. Therefore:

- **No gradients anywhere** except the scene-1 villain mark, which exists to be killed.
- **No color washes, no glows, no particles, no decorative motion.**
- **Four type weights only:** 400 / 600 / 750 / 850.
- **Radii from the app's scale only:** 8 / 12 / 18 / 99px.
- **Motion durations from the app's own scale:** 150ms (svelte), 250ms (cambio), 350ms (esce),
  400ms (entra), 500ms (momento). Ease `cubic-bezier(.22, 1, .36, 1)` — the app's real `--ease-out`.
- Nothing moves that is not saying something.

### Avoid

- Generic SaaS language
- Abstract filler visuals, gradient washes, particle fields, waveform bars
- Any visual redesign of the captured product screenshots
- Exclamation marks, hype cues, risers, whooshes
- Translating the Italian copy

## Visual Identity

- **Background:** `#f6f6f8` (`--pagina`); `#0a0a0d` for the timer scene only
- **Surface:** `#ffffff`, border `rgba(16,17,22,0.08)`
- **Accent:** `#17323f` — flat ink, never a gradient
- **Text:** `#101116` primary · `#565863` secondary · `#666873` muted
- **Display font:** `"New York", "Iowan Old Style", Cambria, Georgia, "Noto Serif", serif` with
  `font-variant-numeric: tabular-nums`. This is the app's real `--font-cifre` — a system serif
  stack, zero bytes downloaded. **Use the generic stack, no `@font-face`, no webfont**; the
  project deliberately ships no font files, and a named family without an in-file `@font-face`
  trips lint (`font_family_without_font_face`). Keep the declaration ending in `serif`.
- **Body font:** `ui-sans-serif, -apple-system, "SF Pro Display", "Segoe UI", Inter, Roboto, sans-serif`
  (the app's `--font`), ending in `sans-serif` for the same reason.
- **Eight area colors** (visible only inside the captured screenshots):
  `#2a78d6` `#008300` `#e87ba4` `#eda100` `#1baf7a` `#eb6834` `#4a3aa7` `#e34948`

## Storyboard

Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:

1. **«AI slop»** — 0.00 → 3.82s — the gradient mark on a shared layer; `the most common AI design
   fingerprint`; then the quote `«La UI di questo sito è troppo AI slop»` + `— chi la usa`,
   settled 1.49 → 3.47s.
2. **L'inchiostro** — 3.82 → 7.09s — the gradient drains off the mark over 500ms from 3.92s;
   `L'accento è inchiostro.` at 4.32s, `Niente gradiente.` at 4.78s.
3. **Misurato, non sentito** — 7.09 → 13.11s — label at 7.24s, then three measurement rows at
   7.64 / 9.29 / 10.93s; all three settled together 11.33 → 12.96s.
4a. **Una cosa sola** — 13.11 → 15.84s — `nav-oggi.png` framed on the focus card
   (origin 58.5% × 47.9%, punch-in 1.25 → 1.33), caption `Una cosa sola.` at 13.41s.
4b. **«Solo per partire»** — 15.84 → 18.56s — hard cut to black onto `timer-anello.png`, no
   punch-in; caption + `Cinque minuti, poi va avanti da solo di 25.` at 16.09s.
5a. **Il conto** — 18.56 → 20.75s — `nav-andamento.png` framed on the `66%` stat
   (origin 58.5% × 28.4%, scale 1.25 → 1.31), held the full scene.
5b. **La firma** — 20.75 → 22.93s — the lockup from 20.85s; `Anche su se stesso.` lands at 22.00s.

**Duration check:** 3.82 + 3.27 + 6.02 + 2.73 + 2.72 + 2.19 + 2.18 = 22.93s ✓

## Audio

- **Audio role:** sparse professional accents over a low bed. The music supports; it never celebrates.
- **Audio arc:** flat throughout by design. One low settle on the ink, three identical dry ticks on
  the measurement rows, one clean transient on the cut to black, then a fade to silence for the
  punchline. No build, no drop, no swell.
- **Music:** `assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`
  (109.96 BPM, the slowest bundled track — the only one that does not sound like congratulation).
- **Music treatment:** starts at 0.0s, fades in over ~0.4s, sits low for the whole piece
  (baseline gain ≈ 0.16 — it must never compete with the frames), then fades out across the last
  1.2s so `Anche su se stesso.` lands in near-silence. Implement the fades as `volume` tweens on
  the timeline rather than by swapping `data-volume`, and let those tweens carry the level on
  their own (`data-volume="1"`, fade-in `0 → 0.16`, fade-out `0.16 → 0`); mixing a non-unity
  `data-volume` baseline with volume tweens trips `audio_volume_tween_overrides_gain` in lint,
  because tween values replace the baseline instead of scaling it.
- **Music cue guidance:** preset read from
  `assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json`.
  - **Strong-cue locks (2, marked `// beat-locked`):** **13.11s** (the cut into the product,
    strength 0.98) and **18.56s** (the cut to the result, strength 0.99).
  - **Beat grid for the three sequential rows (`// beat-grid`):** **7.64 / 9.29 / 10.93s** —
    every third beat, ~1.65s apart. **Do not tighten to consecutive beats**: these are readable
    text rows and consecutive beats at this tempo (~0.55s) would outrun reading.
  - Every other scene boundary also sits on a grid point (3.82 / 7.09 / 15.84 / 20.75 / 22.93)
    but needs no lock; readability wins wherever the two disagree.
- **Audio-reactive treatment:** **none, deliberately.** The product's design file bans decorative
  motion; an audio-reactive glow is precisely the decoration this video is about removing. This is
  a creative decision, not an extraction failure — do not add one.
- **Audio-coupled moments:**
  - Scene 2, the gradient setting to ink (4.32s) — one soft low settle
  - Scene 3, each measurement row arriving (7.64 / 9.29 / 10.93s) — one dry tick each, **identical
    level**, no escalation
  - Scene 4b, the hard cut to black (15.84s) — one clean transient, loudest moment in the piece
- **SFX selection guidance:** already selected and copied into `assets/sfx/` from the analysis's
  "Safest General Picks" (all warm, low HF risk):
  - `impactSoft_heavy_002.ogg` (0.57s, transient) — the ink settle
  - `click2.ogg` (0.06s, low HF risk) — the three row ticks, same gain each
  - `impactSoft_medium_001.ogg` (0.18s, transient) — the cut to black
  Adjust files, gains, or exact timestamps if the implemented animation wants something different;
  keep the total at five cues or fewer and keep the three row ticks identical to each other.
- **SFX analysis guidance:** `.claude/skills/brag/assets/sfx/sfx-analysis.md` — prefer low
  high-frequency-risk files, which the picks above already satisfy.
- **Restraint rule:** no whooshes, no risers, no impacts on text, no swell into the outro, nothing
  on the logo, nothing on the punchline. Silence is an acceptable answer for any beat.

## Hyperframes Instructions

Load the composition-building Hyperframes domain skills — `hyperframes-core` (composition contract
and `data-*` timing), `hyperframes-animation` (motion), `hyperframes-creative` (design spec, beats),
`hyperframes-keyframes` (seek-safe punch-ins), and `hyperframes-cli` (lint / check / render).
`/brag` is its own workflow: do not enter the `hyperframes` entry-point intent interview and do not
route into its generic promo / launch-video workflow. Prefer native Hyperframes conventions over
anything in `/brag`.

Requirements:

- Show at least one real UI element from the source project — three captured screens are supplied.
- Keep all text readable: short labels ≥0.8s settled, sentences ≥0.3s/word (hook line longest).
- Keep the video within 15–25 seconds (target 22.93s).
- Include the music and SFX layer described above.
- Treat the audio notes as guidance; choose final SFX after the visual animation exists.
- Treat cue metadata as optional timing hints. Use the two strong-cue locks; ignore any cue that
  hurts readability.
- Use local assets only — music, SFX, and images are all in `assets/`. GSAP from the CDN pin used
  by the scaffold is fine.
- Punch-ins must be seek-safe (`hyperframes-keyframes`); no render-time clocks, no unseeded
  randomness, no infinite repeats.
- Do not tween `display` / `visibility` / `autoAlpha` on a `.clip`; animate children.
- Every `<audio>` element needs an `id`, or the render is silent.
- Run `npx hyperframes check` before render — it is brag's single gate.
