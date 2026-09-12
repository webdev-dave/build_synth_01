# Design: interactive lesson widgets — harmony, rhythm & meter, form

> **Status: design (2026-09-12).** Child of
> [genre-layer-lessons.md](genre-layer-lessons.md) §4.4–4.5. This is the
> *how it teaches* document: what the reader sees, presses, and hears on
> each layer's lesson, and why. Build phases and wiring stay in the umbrella
> and [progressions-module.md](progressions-module.md).

---

## 0. What the scale lessons already proved (keep all of it)

The `/scales` lessons are the format proof. Everything below extends the
same moves rather than inventing new ones:

| Move | Where it lives today | Why it works |
|---|---|---|
| **One page-wide state** (root, octave, lock) | `ScaleLessonProvider` | Change one thing, everything follows — including the prose (`<RootName>`, `<NoteAt>` re-render, so a sentence never lies). |
| **Widget under the claim** | every `H2` → `P` → widget | The reader presses the thing the paragraph just said. |
| **Comparison with a diff caption** | `ScaleComparer` ("adds ♭5 (E♭) — watch that key switch from a red dot to a green number") | The toggle isolates *one variable*; the caption names exactly what changed. |
| **Lock = no wrong notes** | `lockToScale` | A playground you can't fail in; the "do it yourself" step. |
| **Bounded run, keys light as they sound** | `PlayScaleButton` | Hear it once, see it once, then it rests. |
| **Spotlight one thing** in burnt orange | `DegreeTable`, `DegreeStrip` | The note the lesson is *about* is the only accent on the page. |

**The learning loop every widget must support:**

```
hear it  →  see it  →  change ONE thing  →  hear/see the difference  →  do it yourself
```

Each layer needs a different surface for "see it" and "do it yourself":

| Layer | What's actually being learned | Surface for *seeing* | Surface for *doing* |
|---|---|---|---|
| Scale | a **set** of notes | keyboard | play the locked keys |
| Harmony | notes **grouped**, and the groups **moving in time** | keyboard **+** a bar chart | comp along under a chord lock |
| Rhythm / meter | **time, weight, and feel** — no pitch at all | a time-true grid + the spoken count | tap / edit the grid / solo voices |
| Form | **long spans and repetition** — where you are | a zoomable timeline (song → chorus → bar) | arrange blocks; "where am I?" |

---

## 1. Harmony — chords are groups, progressions are motion

### 1.1 What must click, in order

1. **A chord is a stack** — three notes from the scale, sounded together.
2. **A key has three home chords** (I, IV, V) and between them they cover
   every note of the major scale — that's *why* three chords are enough.
3. **The seventh adds pull.** Triad → dominant seventh: the same chord gets
   restless.
4. **A progression is a path through time** — twelve bars, the chart is
   the map.
5. **The scale and the chords are one system.** Over each chord some scale
   notes are *inside* it, some rub against it; the rub is the blue note.
6. **Variants are small edits** to the same path (quick change, turnaround).
7. **Do it yourself:** comp along with no wrong notes.

### 1.2 Widgets (in lesson order)

**`ChordSounder`** — one chord on the keyboard.
- Toolbar: key picker (page-wide, opens in A to match the scale lesson),
  octave, and chord buttons `I · IV · V`. A **"+7"** toggle adds the seventh
  to whichever chord is held.
- Keyboard: chord tones lit; key labels stay **key-relative scale degrees**
  (`1 3 5 ♭7` for I7, `4 6 1 ♭3` for IV7) so scale-degree literacy from
  `/scales` carries over. A **`ChordToneStrip`** under the keys reads the
  chord-relative roles (`root · 3rd · 5th · 7th` with the note names) —
  the `DegreeStrip` idea, chord-relative.
- Press the three buttons in turn and the keyboard shows the union lighting
  up the whole scale: the "three chords cover the key" fact, seen.

**`ProgressionChart` + `ProgressionPlayer`** — the map.
- 12 cells in three rows of four (phones fit this; never horizontal
  scroll). Each cell: Roman numeral in mono on top, the concrete chord in
  the current key below (`IV7` / `D7`). The current cell is the page's one
  burnt-orange accent; the *upcoming* cell gets a thin outline one beat
  before it arrives — a calm cue, not a pulse.
- Transport: play one chorus then rest (bounded run); loop is an explicit
  toggle; tempo slider (60–120, default 90); count-in option.
- Sound: soft pad chord held for the bar plus a quiet root pulse on each
  beat so time is felt — straight quarters in v1, shuffled once the shared
  clock has the transform. **Smooth voicings by default**: a nearest-voicing
  pass (`voiceLead(prev, next)`) keeps common tones and moves the rest by
  step, so the keyboard shows chords *sliding*, not jumping. A
  "root position / smooth" toggle is the seed of a later voice-leading
  lesson.
- Bidirectional: click a cell → it sounds and the keyboard lights it. Press
  keys → every cell whose chord contains that note marks itself ("C lives
  in D7 — and nowhere else in A"). Press three or more keys → a small
  read-out names the chord (`identifyChord(pcs)` in `chords.ts`; port the
  detection from the v1 `ChordTheoryPanel`, don't import v1).
- Live text under the chart: `Bar 5 of 12 · IV7 · D7` — visible, not an
  `aria-live` firehose during playback; cells are buttons with
  `aria-label="Bar 5, IV7, D7"`.

**`ChordScaleOverlay`** — the payoff.
- The lesson keyboard with the blues scale as green degree numbers *and*
  the current chord's tones lit, changing under the fixed scale as the
  progression plays. Three visual states per key: chord tone (lit), scale
  note outside the chord (green number only), neither (plain/locked).
- The rub pair gets a marker: over I7 in A, `C` (♭3, scale) and `C♯` (3,
  chord) sit side by side — the blue note, on a piano, is that pair.
- Press any key while a chord sounds and a one-line caption explains its
  role: *"C is the ♭3 of A and the 7th of D7 — a chord tone here."* /
  *"C♯ is the 3rd of A7, the note the blues scale bends toward."* Driven by
  a pure `noteRole(pc, chord, scale)` so the sentence is always true.
- This is the section that answers "why does the blues scale work over
  these chords" — it belongs here, and only a short paragraph + link
  belongs on `/scales/blues-scale`.

**Variant toggles** — quick change, turnaround (later: jazz turnaround).
- Each toggle changes the cells *and* what sounds; changed cells get a
  quiet diff marker and the caption reads like `ScaleComparer`'s: *"Quick
  change swaps bar 2 from I7 (A7) to IV7 (D7) — the IV arrives early and
  comes straight back."*

**`ChordLock` play-along** — the "do it yourself".
- Toggle: while the chart plays, only the current chord's tones are
  playable on the keyboard (scale lock, but per bar). The reader comps
  along and can't be wrong. Second setting: lock to the blues scale
  instead (solo along). Same mechanism as `lockToScale` with a time-varying
  set.

**`ChordMap` (v1.5)** — the Instrumaps signature applied to harmony.
- I, IV, V as nodes laid out by fifths (IV — I — V). The playhead hops
  node to node; the traversed edge lights; the pull back to I is visible
  as geometry. Grows ii and vi when `ii-v-i` / `i-v-vi-iv` land. Extract
  the node primitive from `HeroMap` rather than drawing a second one.

### 1.3 Genre-page teaser (`ProgressionTeaser`)

Key picker + chart + play. No keyboard, no toggles, no prose. The door to
the full lesson sits above it.

### 1.4 Data the widgets need (beyond `progressions-module.md`)

- `chords.ts`: `voiceLead(prevMidi[], nextSpec, keyRoot)`,
  `identifyChord(pcs[])`, `noteRole(pc, spec, degrees)`.
- `Progression.bars[].beats` for split bars later; v1 is one chord per bar.
- Prose leaves: `<ChordName numeral="IV7" />` (renders `D7` in the current
  key) alongside `<RootName>` / `<NoteAt>`.

---

## 2. Rhythm & meter — time is the axis, feel is the lesson

### 2.1 The core problem

Feel is sub-visual. A quantised grid shows a shuffle and a straight beat as
the *same* picture. Every rhythm widget is designed around making time
itself visible.

### 2.2 What must click, in order

1. **The pulse, and the count** — beats have numbers; the bar comes around.
2. **Weight** — some counts are heavy. The bar says ONE-two-THREE-four; the
   drums may disagree (the backbeat's whole point).
3. **Subdivision** — a beat splits in two (8ths), three (triplets), four.
4. **Feel** — the shuffle is the triplet split with the middle left out;
   swing is a slider, not a switch.
5. **A groove is a pattern of voices** — kick, snare, hats each have a job.
6. **Genres differ by where the weight goes** — same tempo, same grid,
   different feel (comparer).
7. **Do it yourself:** tap, edit, solo.

### 2.3 Widgets

**`GrooveGrid`** (lesson wrapper around the drum-machine `StepGrid`).
- Rows = voices, top to bottom like a drum score: hats, snare/rim, kick.
  Columns = subdivisions. Mono count header: `1 & 2 & 3 & 4 &`, or
  `1 trip let 2 trip let…` on a triplet grid.
- **Columns sit at their real time**, not equal spacing. Straight: the
  "&" column at 50% of the beat. Shuffle: at ~67%. The playhead moves at
  constant pixels-per-second, so swung hits *look* late — because they are.
- Hits are dots; velocity is dot weight (ghost notes are faint, the
  backbeat crack is heavy). Signature hits (snare on 2 & 4; the one-drop's
  kick on 3) wear the burnt-orange spotlight; the rest are neutral.
- Row labels are buttons: **solo / mute a voice**. Hats alone reveal the
  shuffle; kick + snare alone reveal the backbeat.
- Tap a cell to toggle a hit (`editable`); the lesson starts with the preset
  and a "reset" link. The lesson grid *is* a step sequencer.
- Optional **subdivision underlay**: faint grid lines for 8ths / triplets /
  16ths behind the dots, so a shuffle over the triplet underlay visibly
  lands on triplets 1 and 3.

**`FeelControl`** — the shuffle made continuous.
- A **swing slider** from straight (50%) through triplet shuffle (67%) to
  hard shuffle (75%), with named detents. Dragging it slides the off-beat
  dots along the time axis *and* changes the audio the same instant —
  motion follows music, and swing is honestly shown as a continuum.
- A two-position toggle (straight / shuffle) is the same control for the
  teaser and the comparer.

**`CountAlong`** — karaoke for counting.
- The spoken count (`1 & 2 &`, `1 trip-let`) rendered as syllables, each
  lit as it passes. Optional soft click voice on the metric accents. Cheap,
  and the single most effective aid for someone who has never counted a bar.

**`AccentStrip`** — two rows, not one.
- *"The bar says"*: metric weight (ONE two THREE four) as bar heights.
- *"The drums say"*: where this groove puts its weight. The backbeat is
  the picture where the two rows disagree; a waltz is the picture where
  they agree. Meter pages lead with the first row; groove pages with the
  second.

**`BeatComparer`** — two grids, one clock.
- A / B / both. Same tempo, same bar length, shared playhead. "Both"
  layers them (A in neutral, B dimmed or vice-versa) so the difference is
  audible as a clash and visible as which dots don't overlap.
- **Morph mode** (the rhythm `ScaleComparer`): step from one groove to the
  other one edit at a time, each with a diff caption — *"One-drop removes
  the kick from 1 and puts it on 3; the rim joins it there."* Three edits
  turn rock into reggae, and the reader sees exactly which three.

**`TempoControl`** — 40–160 BPM slider on every player, with a count-in.
Slow is confident: half-speed is where the empty beat 1 of a one-drop
stops being a blur.

**Meter pages — `BarFence`**.
- A fixed hit pattern with **movable bar lines**: re-fence the same hits
  as 3/4, 4/4, 6/8 and the metric accent (and the click on 1) moves while
  the notes don't. This is `timeSignatures.ts`'s "moving the bar lines
  changes the feel" claim, playable. 12/8 is taught as "four big beats
  with a triplet inside" — the same grid, header regrouped.

**`TapPad` (v1.5)** — the body learns the feel.
- A big pad (or the space bar) plays a rim and drops a mark on a lane
  under the grid at the *exact* time tapped. Against the time-true axis the
  reader sees their taps land early/late relative to the shuffle — no
  score, no red/green, just the marks. Scoring/drills are later and may
  never be needed.

### 2.4 Kit voices (synthesized, quiet, real releases)

| Voice | Recipe |
|---|---|
| kick | sine, pitch drop ~150 → 50 Hz over ~120 ms, short decay |
| snare | band-passed noise burst + brief ~180 Hz tone; velocity → brightness + gain |
| rim / cross-stick | very short band-passed click, 1–2 kHz |
| closed hat | high-passed noise, ~30 ms |
| open hat | same, ~250 ms decay |
| click (count) | short woodblock-ish tone for `CountAlong` / `BarFence` accents |

Velocity maps to gain *and* timbre so ghost notes read as ghosts. Master
sits well under 0 dBFS; nothing on these pages should startle.

### 2.5 Pattern model decisions

- Hits are stored on a **straight grid** (`at` in beats); **feel is a
  playback transform** on the clock, never baked into hit times. So a
  backbeat can be played straight or swung — which is itself a lesson
  (rock shuffle vs straight rock) — and the comparer can put two feels on
  one clock.
- `stepsPerBeat ∈ {2, 3, 4}` per pattern; the grid renders whichever it is.
  12/8 is `stepsPerBeat: 3` over four beats, not a special case.
- Velocity 0–1 per hit from day one.

### 2.6 Genre-page teaser (`GrooveTeaser`)

Grid + play + the straight/shuffle toggle — the one control that teaches
the most in one press. No slider, no solo, no comparer.

### 2.7 Reduced motion

No sweeping playhead. The current column highlights discretely and a
**Next** control steps through hits one at a time, sounding each. Sliders
still work; dots reposition without animation.

---

## 3. Form — long spans, repetition, and knowing where you are

### 3.1 What must click, in order

1. **Music comes around.** A form is the length of the loop before it
   repeats.
2. **Bars group into phrases, phrases into a chorus, choruses into a
   song.** Three zoom levels, one timeline.
3. **AAB** — the blues line: say it, say it again, answer it. Call in the
   first half of each phrase, response in the second.
4. **Form is what stays the same** across choruses (length, chords) while
   the words change.
5. **Other lengths exist** (8, 16) and other shapes (verse–chorus) — same
   widget, different blocks.
6. **Do it yourself:** arrange a song from blocks; find your place by ear.

### 3.2 Widgets

**`FormMap`** — three strips stacked, one playhead in all of them.
- **Song strip:** sections as blocks whose *width is bars* — intro ·
  chorus × n · solo chorus · out. Click a block → jump there.
- **Chorus strip:** the 12 bars as three rows (`A / A / B`), each phrase
  split into a **call** half and a **response** half. Sung text sits in the
  call bars; the response bars carry a small answer glyph (or the lick, see
  below). Call-and-response becomes visible as negative space.
- **Bar strip:** the current bar's beats, so the fine clock is never lost.
- The current bar lights in all three at once; a visible read-out says
  `Chorus 2 · phrase B · bar 10 of 12`.
- Audio: when `Form.progression` is set, the progression plays under the
  map on the shared clock (chart and map agree by construction). Optional
  **response lick**: a two- or three-note blues-scale figure in each
  response half, so the "answer" is heard, not just drawn. Forms with no
  canonical progression render silent and say so.

**Repetition view** — choruses stacked vertically.
- Chorus 1, 2, 3 as identical 12-cell rows; the lyric cells differ, the
  chord cells don't. Hover/tap a column to see the same bar across
  choruses. The caption: *"Form is what repeats."*

**`FormComparer`** — same widget, different block sets.
- 12-bar vs 8-bar vs 16-bar blues; 12-bar vs verse–chorus. A/B on one
  clock (same tempo), so "how long until home" is felt as a wait.

**`SongBuilder` (v1.5)** — the "do it yourself".
- Drag blocks (intro, chorus, solo chorus, out) into the song strip and
  play the arrangement: choruses loop the progression; a "solo" chorus
  auto-plays a blues-scale run over the chords; the map lights as it goes.

**"Where am I?" (later)** — the form drill.
- Audio starts from a random bar with the chorus strip hidden; the reader
  taps the bar they think it is; the map reveals. The only game-like
  element in the whole design, and the one that directly trains the skill
  form exists to give you.

### 3.3 Lyric source

The call cells should carry a **public-domain** blues lyric from the
catalog (`CatalogSong.lyrics` with a PD source), so the form page is also
a door into `/songs/<slug>`. Never invent a lyric for the cells.

### 3.4 Genre-page teaser (`FormTeaser`)

Chorus strip only, playing one chorus with bars lighting. Door above.

### 3.5 Data

- `FormSection { id, label, bars, role?: "call" | "response", lyric? }`
  for one cycle; `Form.arrangement?: { section: id, times }[]` for the song
  strip; `Form.progression?` for audio; `Form.lick?: number[]` (scale
  offsets) for the optional response figure.

---

## 4. Shared machinery the three depend on

### 4.1 One clock per page — `useLessonClock`

A page-level transport (provider), not per-widget timers:

- State: `bpm`, `swing` (0.5–0.75), `playing`, `position` (bar, beat,
  step), `loop`, `lengthBeats`.
- Scheduling: look-ahead scheduler (~25 ms tick, ~100 ms look-ahead) on
  the `AudioContext` clock — the "two clocks" pattern — with visuals read
  from `currentTime` on `requestAnimationFrame`. More robust than
  per-note `setTimeout` (`PlayScaleButton`) and correct for loops.
- Tracks register callbacks: chord track, drum track, form cursor, lick
  track. A page with one track still uses it, so a page that later stacks
  a chart over a groove needs no refactor.
- Swing applied as a time transform on off-beat steps — the one place feel
  is computed.

### 4.2 One visual grammar

`BarTimeline` cells, `StepGrid` columns, and the keyboard share: mono
labels, one burnt-orange "now", green for in-scale, neutral otherwise,
thin borders, `bg-muted/20` panels. A reader who learned the scale
keyboard reads the chord chart and the drum grid without relearning.

### 4.3 Live prose leaves

`<RootName>`, `<NoteAt>`, `<ChordName>`, `<CountAt>` (the current count
label on a meter page) keep server-rendered sentences true when the reader
transposes, re-fences, or changes feel.

### 4.4 Touch and small screens

Minimum 40 px cells. 12-bar chart in rows of four. Drum grid defaults to
8ths (8 columns per bar); 16ths are an opt-in that switches to two rows
per bar rather than scrolling. The two-octave keyboard window from the
scale lessons is already phone-safe.

### 4.5 Accessibility

Every cell, dot, and block is a button with a spoken label. Toggles are
`aria-pressed`. Captions that describe a change use `aria-live="polite"`;
playback position is *visible text*, not a live region. Reduced motion:
discrete highlights + a Next control everywhere a playhead would sweep.

---

## 5. Priority per layer

| | v1 (ships with the lesson) | v1.5 (soon after) | later |
|---|---|---|---|
| **Harmony** | ChordSounder, ProgressionChart + Player (smooth voicings), ChordScaleOverlay, variant toggles, ChordLock | ChordMap (node graph), split bars | voice-leading lesson, jazz turnaround |
| **Rhythm / meter** | GrooveGrid (time-true, solo/mute, editable), FeelControl, CountAlong, AccentStrip (two rows), BeatComparer A/B/both, TempoControl, BarFence | Morph mode, TapPad, subdivision underlay | drills / scoring, sampler kit variant |
| **Form** | FormMap (three strips, progression under it), Repetition view, FormComparer | SongBuilder, response lick | "Where am I?" drill |
| **Shared** | `useLessonClock`, `BarTimeline`, kit voices, `chords.ts` helpers | `ChordName` / `CountAt` leaves | — |

---

## 6. Design questions — decided 2026-09-12

1. **Comping sound for harmony → 70s electric organ, held per bar.**
   The user asked for the electric-organ sound rather than a neutral pad.
   Recipe (all synthesized, no samples): drawbar-style additive voice —
   sines at 1×, 2×, 3×, 4× the fundamental with descending gains
   (roughly 1 / 0.5 / 0.3 / 0.15), a shared ~6 Hz vibrato of a few cents
   (the Leslie-ish wobble — sound, not motion, so `prefers-reduced-motion`
   leaves it alone), attack ≤ 10 ms, release ~150 ms so bar changes don't
   click. Recipe lives in `src/lib/audio/voices/organ.ts` (umbrella §3.9);
   `music/chords.ts` stays theory and only names the voice
   (`ChordVoice = "organ" | "pad"`). Held for the whole bar in v1; the
   re-struck "comp" articulation arrives with the shuffle transform in
   Phase 2 as a toggle, so the harmony lesson never fakes rhythm before the
   rhythm module exists. Parameters tuned by ear at Checkpoint 2.
2. **Response lick in the form v1 → sound it.** A 3–5 note lick from the
   key's blues scale, on the lead voice, in the response bars (3–4, 7–8,
   11–12), scheduled on the same `useLessonClock` as the chords. The lick
   is data (`src/content/forms/…`, per key via degrees, not fixed pitches)
   so `RootNotePicker` transposes it. Response cells light only while the
   lick sounds — honesty rule.
3. **TapPad → v1.5** (new Slice 2f after Checkpoint 3). Marks only
   (early / on / late), no score, no streaks. Measure touch latency and
   subtract it before showing marks; if latency can't be estimated on a
   device, show marks without the early/late label.
4. **`ChordLock` default → chord tones of the current chord.** Four lit
   keys per bar (A7 = A–C♯–E–G), re-computed at every bar boundary while
   the player runs; a toggle switches to the key's blues scale with chord
   tones in a second tint. `noteRole()` drives both the lit set and the
   caption so they can't disagree.

Still undecided and non-blocking: `SongBuilder` shape (v1.5, Phase 3).
