# Plan: Genre Lab — what makes a genre sound like itself

A new **Genre Lab** at `/genres` that teaches music genres the Instrumaps way:
**hear and see the signature**, don't read a Wikipedia paragraph about it.

The core question per genre is *"what actually makes this sound like this?"*
The answer is almost never one thing. A genre is a **stack of layers** — rhythm,
meter, harmony, scale, form, texture — and different genres light up different
layers as their identity. Reggae is a beat (one-drop + offbeat skank) long
before it is a chord chart. Blues is a form + a scale + a shuffle. Rock is a
backbeat + power-chord vocabulary. The module is built so every genre can
expose every layer, but **each genre page leads with the layer that actually
defines it**.

First angle to build: **rhythm and beats.** The proof of the format is a page
where a reggae groove and a rock groove play at the same tempo, on the same
grid, and you can *see* why they feel different — kick and snare in different
places, different accents, different feel — not just read that they do.

> **Spec first — this doc is not a build order to start blindly.** Groove
> facts below (one-drop, backbeat, shuffle) should be sanity-checked against a
> trusted source before they ship as "teaching truth." Same honesty rule as
> the dance plan: if the visual lights a snare on 2 and 4, the audio snare
> must hit on 2 and 4.

---

## Why this fits Instrumaps

The tagline — **"Don't study theory. Play with it."** — already wants this.
Scales and chords are places on a map; genres are *neighborhoods* made of those
places plus a pulse. We have the pitch half of the map (synth, harmonica, piano
roll, lessons). We do not yet have a place that teaches **feel**: which beats
get weight, which ones are silent on purpose, how a one-drop is not a
backbeat.

### What already exists to lean on

- **Beat/timeline data pattern.** `src/components/home/heroTune.ts` already
  models a loop as typed events with `beats`, derives `BEAT` from `BPM`, and
  computes absolute `at` times (`MELODY_TIMED`). A drum groove is the same
  idea: hits with a voice (kick / snare / hihat) and a `beats` position.
  **Derive, don't duplicate** (`AGENTS.md`).
- **Meter vocabulary.** `src/lib/music/timeSignatures.ts` already teaches
  2/4, 3/4, 4/4, 5/4, 6/8, 7/8, 9/8, 12/8 as feel + "what the bar fence
  does" — including that 12/8 is "four big beats with a triplet inside,"
  which is the blues/shuffle door. Genre Lab should *use* this, not rewrite
  it.
- **Scale / mode vocabulary.** `src/lib/music/scales.ts` already has blues,
  pentatonics, and the seven modes. The [lessons module](lessons-module.md)
  is the place that teaches "what the blues scale *is*." Genre Lab is the
  place that teaches "the blues scale is one *layer* of the blues."
- **Shared audio, on consent.** `AudioContextProvider` is in the root layout.
  Playing a groove *is* consent. Default muted, invite the click. Lightweight
  synthesis over samples — synthesized kick/snare/hihat (noise bursts +
  oscillators), no audio files, honest about what's sounding.
- **Routing precedent.** Hub-and-spoke like `/harmonica` and the planned
  `/dance` and `/lessons`: index + `[slug]` with `generateStaticParams()`.
- **Song corpus (later layer).** `src/lib/song/` + the piano-roll library
  can eventually deep-link a genre page to a public-domain example. Not
  required for v1 — v1 grooves are typed patterns, not transcribed songs.

### Sibling modules (don't duplicate, cross-link)

| Module | Teaches | Genre Lab's relationship |
|--------|---------|--------------------------|
| [Lessons](lessons-module.md) | Primitives: what a scale / chord / meter *is* | Genre Lab *composes* those primitives into "this is reggae." Link out ("what is 4/4?", "what is Mixolydian?"). |
| [Dance tutorial](dance-tutorial-module.md) | Footwork *on* a beat | Shares the beat-clock idea. Dance is bodies; Genre Lab is drums + harmony. Same `BEAT` math, different widgets. Don't block on dance existing. |
| [Klezmer / Yiddish](klezmer-yiddish-dataset.md) | A repertoire + (later) lyrics | A future **Klezmer** genre page can hang on that corpus. Don't special-case it in v1. |
| [Self-hosted MIDI library](self-hosted-midi-library.md) | Play real songs on the roll | Later: "hear this in a song" deep-links. v1 does not wait on MIDI. |
| [Songwriting Studio](songwriting-studio.md) | Coach a user's poem into a demo | *Consumes* a feel palette (groove + scale + stock progressions). Genre Lab *teaches* those layers. Share `GroovePattern`; don't fork. |
| Synth / piano roll | Play pitches | "Try this groove's scale on the synth" / "see a 12-bar on the roll" are Phase-4 deep-links. |

### The honesty rule applies to grooves too

If the grid implies a kick on beat 3, the kick must sound on beat 3. A reggae
page that lights the one-drop while a four-on-the-floor kick plays is the
genre equivalent of "a lit tonic while a C-less chord plays" — a lie the
philosophy forbids. Reduced-motion gets a discrete step-through of the same
hits, not a silent poster.

---

## The idea: a genre is a stack of layers

Not every genre is "a rhythm." Some are a scale, some are a form, some are a
texture. The module describes **every genre through the same layer model**,
and lets each genre rank those layers by how much they actually define it.

```
┌─────────────────────────────────────────────────────────────┐
  GENRE: Reggae                         signature → rhythm
├─────────────────────────────────────────────────────────────┤
  1. Rhythm / groove   ●●●  one-drop; snare/rim on 3; skank 2 & 4
  2. Texture           ●●○  offbeat guitar/organ chops; bass as melody
  3. Harmony           ●○○  I–V–vi–IV and minor i–♭VII–IV are common, not required
  4. Meter             ●○○  usually 4/4, mid tempo (~70–90)
  5. Scale             ○○○  often minor / dorian; not the identity
  6. Form              ○○○  verse/chorus, dub as a related form
└─────────────────────────────────────────────────────────────┘
```

Same stack, different lighting, for rock vs blues:

| Layer | Reggae (lead with this) | Rock | Blues (lead with this) |
|-------|-------------------------|------|------------------------|
| **Rhythm** | One-drop / stepper; emphasis on 3; guitar *upstrokes* on 2 & 4 | Backbeat: snare on **2 and 4**; kick on 1 (and often 3) | Shuffle / 12/8 swing eighths; not a straight grid |
| **Meter** | 4/4, unhurried | 4/4, often faster | 12/8 (or 4/4 swung); 12-bar *form* is the larger clock |
| **Harmony** | Supporting | Power chords, I–IV–V, I–V–vi–IV | **I–IV–V in a 12-bar** is the signature |
| **Scale** | Supporting | Minor pentatonic / Mixolydian common | **Blues scale** (minor pentatonic + ♭5) is the signature |
| **Form** | Supporting | Verse–chorus | **12-bar form** is the signature |
| **Texture** | Skank + walking/melodic bass | Distorted stacked fifths, kit as engine | Call-and-response guitar / vocal; shuffle kit |

The teaching move is always **comparison**. "Reggae vs rock" at the same BPM
on the same 16th grid is the ScaleComparer's cousin: two patterns, shared
clock, highlights that differ. That is what makes the idea click.

Layers we do **not** pretend to own in v1: lyrics, fashion, history essays,
production (delay throws, tape hiss), or "name five famous bands." A short
cultural note is fine; a biography is a different product.

---

## Information architecture

```
/genres                         ← hub. What the module is; layer legend; genre cards.
   • One-liner: "Hear what makes a genre itself, starting with the beat."
   • Layer legend (rhythm, meter, harmony, scale, form, texture)
   • Cards → each genre. Coming-soon states are ok.

/genres/reggae                  ← one genre page. The reggae "map."
   • Lead with the signature layer (rhythm, for reggae)
   • GrooveGrid + GroovePlayer (muted default)
   • BeatComparer vs a foil genre (rock, for reggae)
   • Stacked sections for the other layers — later sections can be
     "coming soon" so a genre can ship rhythm-only
   • Cross-links to Lessons primitives and (later) example songs

/genres/rock
/genres/blues
/genres/[slug]                  ← generateStaticParams from the registry
```

No nested `/genres/reggae/rhythm` in v1. Layers are **sections on one page**,
not a second route tree. If a layer grows into its own lesson (e.g. a full
"what is a one-drop" article), that belongs in `/lessons`, linked from here.

Comparer lives *on* the genre page (and can be reused on the hub as a demo),
not as a separate `/genres/compare` route, until we have enough genres that
a standalone comparer earns its own URL.

---

## Data model (keep data out of components)

Genre content lives under `src/lib/genres/`, same "typed data modules"
pattern as `heroTune.ts` and the planned `src/lib/dance/`.

```ts
type GenreLayer =
  | "rhythm"
  | "meter"
  | "harmony"
  | "scale"
  | "form"
  | "texture";

type DrumVoice = "kick" | "snare" | "hihat" | "openHat" | "rim" | "ghost";

/** One drum hit on the loop. Times are in beats, not seconds. */
type DrumHit = {
  voice: DrumVoice;
  at: number;          // beats from loop start
  duration?: number;   // default: short tick
  velocity?: number;   // 0–1, for ghost notes vs. backbeat snare
};

type GrooveFeel = "straight" | "swing" | "shuffle";

type GroovePattern = {
  id: string;          // "reggae-one-drop", "rock-backbeat", "blues-shuffle"
  name: string;
  bpm: number;
  timeSignature: TimeSignature; // reuse src/lib/music/timeSignatures.ts
  loopBeats: number;   // usually 4
  feel: GrooveFeel;
  hits: DrumHit[];
  /** Spoken count of the signature, e.g. "kick on 3" / "snare on 2 and 4" */
  cue: string;
};

type Genre = {
  slug: string;        // "reggae"
  name: string;
  summary: string;     // one line for the hub card
  /** Layers that actually define this genre, most-defining first */
  signatureLayers: GenreLayer[];
  grooves: GroovePattern[];
  /** Foil genre for the comparer, if any */
  compareWith?: string;
  // later:
  // progressions?: ChordProgression[];
  // scaleKeys?: (keyof typeof SCALE_PATTERNS | keyof typeof MODE_PATTERNS)[];
  // forms?: FormPattern[];
};
```

Reuse the `heroTune.ts` pattern: derive `BEAT = 60 / bpm`, absolute `at`
times, `TOTAL_BEATS` from `loopBeats`. Swing/shuffle is a *feel transform*
on those times (delay the off-beats toward the next downbeat), not a second
clock — so a blues shuffle and a straight rock beat can share a grid and
still feel different.

Prose for each genre page is TSX (same decision as lessons/dance): widgets
are first-class, static export stays simple. MDX can come later if the
catalog gets large.

---

## Reusable widgets

Location: `src/components/genres/`. Every genre page composes these.

### v1 (rhythm) — the format proof

- **`GroovePlayer`** — play/pause a synthesized kit at the groove BPM, from
  the shared `AudioContext`, on user gesture. Muted by default with a clear
  affordance. Emits the current beat for the visual. Tempo control so you can
  slow a reggae one-drop until the missing kick on 1 is obvious.
- **`GrooveGrid`** — the signature widget: a 16th-note (or 8th-note) drum
  grid, voices as rows (kick / snare / hihat), beats as columns, **monospace
  count headers**. The playhead lights the current column *on the beat*.
  Hits are dots on the grid; the signature hits (reggae's beat-3 kick, rock's
  2-and-4 snare) get the burnt-orange spotlight, not a rainbow of drum
  colors. Neutral palette otherwise; green only for "this is playing."
- **`BeatComparer`** — two `GrooveGrid`s stacked (or tabbed) on a **shared
  clock**. Same BPM, same bar length. Toggle A / B / both. This is the
  reggae-vs-rock payoff, and the cousin of the lessons plan's `ScaleComparer`.
- **`AccentStrip`** — a one-row "which counts are heavy" map (ONE-two-THREE-four
  vs ONE-two-three-FOUR). Useful when the kit pattern is busy but the *feel*
  is just where the weight sits.

All motion from `BEAT`. `prefers-reduced-motion`: no looping playhead; a
Next-hit control steps through the same `DrumHit[]`.

### Later layers (do not build until rhythm proves the format)

- **`ProgressionStrip`** — I–IV–V (etc.) as clickable bars, synced to the
  groove. Reuse synth chord voicing; don't invent a second instrument.
- **`ScaleChip`** — the genre's typical scale, linking to `/lessons/…` and
  optionally deep-linking the synth with that type locked (see
  [synth-scale-type-selector.md](synth-scale-type-selector.md)).
- **`FormMap`** — 12-bar blues as a 12-cell map that lights the current bar.
  The "map" metaphor applied to form.
- **`LayerStack`** — the hub/genre header that shows which layers are
  signature vs supporting vs unset.

---

## Phased build

### Phase 0 — Content research (no code)

- [ ] Lock **three grooves** as teaching truth, each as a `DrumHit[]` on
      paper before it becomes code:
      1. **Reggae one-drop** — kick (and often snare/rim) on beat 3; hihat
         ticking; guitar/organ *not* required in v1 audio, but the cue must
         say the skank lives on 2 & 4. Mention stepper / rockers as siblings,
         not as v1 patterns.
      2. **Rock backbeat** — kick on 1 (and often 3), snare on **2 and 4**,
         hihat 8ths. The foil for reggae.
      3. **Blues shuffle** — 12/8 (or 4/4 + shuffle feel); snare on 2 and 4
         but swung; this proves a genre whose *rhythm* is a feel, while its
         *identity* is also scale + 12-bar form (those layers stay "soon").
- [ ] Decide the first three genre pages: **reggae, rock, blues** — one
      rhythm-defined, one rhythm-defined-but-familiar, one "also a scale and
      a form." That trio is enough to prove the layer model.
- [ ] Write the one-line cue for each groove in spoken count ("snare on 2
      and 4", "kick on 3") so the visual and the sentence match.

### Phase 1 — Skeleton & routing

- [ ] `src/app/genres/page.tsx` — hub (server component + `metadata`).
- [ ] `src/app/genres/[slug]/page.tsx` with `generateStaticParams()`.
- [ ] `src/lib/genres/registry.ts` — typed `Genre[]` + `GroovePattern` data
      for the first three, even if only reggae is "live" and the others are
      coming-soon cards.
- [ ] Add a **Genre Lab** entry to `NAV_ITEMS` in `src/lib/navigation.ts`
      (likely `inNav: false` like the other labs, so it shows as a home
      widget + hamburger item). Icon: Lucide via `src/lib/appIcons.ts` —
      extend there if nothing fits; don't import a second icon set.

### Phase 2 — Groove engine + core widgets

- [ ] `src/lib/genres/schedule.ts` — `heroTune.ts`-style helpers for
      `GroovePattern` (absolute times, swing/shuffle transform, `BEAT`).
- [ ] Synthesized kit: kick, snare, hihat, rim. Quiet, soft, with real
      releases. No samples.
- [ ] Build `GroovePlayer` + `GrooveGrid` first — the minimum that proves
      "watch the one-drop light up on 3." Then `BeatComparer`, then
      `AccentStrip`.
- [ ] Reduced-motion fallbacks.

### Phase 3 — First three genre pages (content)

- [ ] **Reggae** — full rhythm layer: one-drop on the grid, comparer vs
      rock, short note on the skank (even if we don't synthesize guitar yet),
      other layers marked soon.
- [ ] **Rock** — backbeat as the lead layer; comparer vs reggae (same
      widget, swapped default).
- [ ] **Blues** — shuffle groove as the *entry*, with honest "soon" sections
      for 12-bar form and blues scale that link to `/lessons` once those
      exist. Don't fake the harmony/scale widgets.

### Phase 4 — Other layers & more genres (later)

- [ ] Harmony layer: `ProgressionStrip` + a few honest stock progressions
      (12-bar I–IV–V, a reggae I–V–vi–IV, a rock I–IV–V). Transposable root.
- [ ] Scale layer: chips into `SCALE_PATTERNS` / `MODE_PATTERNS` + lessons /
      synth deep-links.
- [ ] Form layer: 12-bar map first (it's the cleanest). Then maybe 32-bar /
      verse–chorus as a lighter diagram.
- [ ] Texture: only if we can *show* it (e.g. a skank as offbeat chops on a
      tiny guitar-ish stab — still synthesized). Don't describe texture in
      prose without a widget.
- [ ] More genres, same engine, no new architecture. Candidates that earn
      their place because they light *different* layers:
      - **Funk** — 16th-note syncopation (rhythm)
      - **Waltz** — 3/4 (meter)
      - **Jazz (swing)** — swung 8ths + ii–V–I (rhythm + harmony)
      - **Hip-hop / boom-bap** — backbeat cousins with a different kick
        vocabulary (rhythm; stay generic, no sampled breaks)
      - **Salsa / son** — clave (rhythm + meter); overlaps the dance plan
      - **Klezmer** — modes + ornaments + odd meters (scale + meter); hang
        on the existing corpus
      - **Country** — train beat / two-step (rhythm)
- [ ] SEO pass later (mirror `harmonica-lab-seo.md`): crawlable "what is a
      reggae beat" copy that matches the live grid. Rank because the page
      *plays* the one-drop. Out of scope until the format proves out.
- [ ] Optional: deep-link a PD/CC example song into the piano roll.

---

## Key decisions (open to veto)

1. **Hub-and-spoke, genre-agnostic from day one.** `/genres` →
   `/genres/<slug>`. Reggae is just the first card. Adding funk later is a
   registry entry + a groove + a TSX page, **no new engine**.
2. **Same layer model for every genre**, ranked per genre. Do not make a
   "rhythm genres" section and a separate "scale genres" section — that
   hides the point. Blues has a rhythm *and* a scale; reggae has a rhythm
   and barely a scale. The stack is the product.
3. **Lead with rhythm in v1**, even for blues. Ship one honest layer rather
   than five thin ones. Harmony / scale / form are designed into the data
   model so they can fill in without a rewrite.
4. **Content as typed data + TSX prose**, not MDX/CMS (same reasoning as
   lessons/dance). Grooves in `src/lib/genres/`, copy in the page TSX.
5. **Synthesized kit, muted by default**, resumed on gesture — no samples,
   no copyrighted breaks, no "Amen" or famous fills. Teach *generic*
   patterns (one-drop, backbeat, shuffle), not transcribed recordings.
6. **Comparison is the pedagogy.** Every signature groove has a foil. Reggae
   without rock (or ska, later) is a poster; reggae *next to* rock on one
   clock is a lesson.
7. **Timing honesty is non-negotiable.** Visual playhead and audio hits
   share one scheduler.
8. **Don't wait on the planned drum-machine instrument.**
   `src/instruments/README.md` still lists `basic-drums` as planned. Genre
   Lab's kit is a tiny synthesized voice set for teaching, not the DAW drum
   machine. When that instrument exists, it can *consume* `GroovePattern`;
   it should not block this module.
9. **Don't block on the dance module's `GroovePlayer`.** Same name, same
   beat math, different UI. If dance ships first, extract a shared
   `src/lib/groove/` clock; if Genre Lab ships first, dance can reuse it.
   Either order is fine.

## Suggested first milestone

**Phase 1 + `GroovePlayer` + `GrooveGrid` + `BeatComparer` + the Reggae
page** — one URL where a muted-by-default one-drop plays, the grid lights
beat 3, and a toggle puts a rock backbeat on the same clock. That proves
the whole format (layer-led, honest, comparable, on-brand) before writing
rock/blues pages or any harmony widgets.

## Out of scope (for now)

- A drum-machine product / DAW pad grid for composing original beats.
- Sampled kits, copyrighted breaks, or "play this famous intro."
- History / discography / streaming-service playlists.
- User-uploaded grooves or community genre definitions.
- Rebuilding audio infra, leaving static export, or depending on
  `SongDocument` / dropping `output: "export"`.
- Dance footwork, even when the genre is also a dance (salsa, waltz).
- Trying to catalog "every genre" in v1. The *model* is every-genre-shaped;
  the *catalog* grows one honest page at a time.

## Relevant existing files

| Purpose | Path |
|---------|------|
| Beat/timeline data pattern to mirror | `src/components/home/heroTune.ts` (`BEAT`, `BPM`, `TOTAL_BEATS`, `MELODY_TIMED`) |
| Meter vocabulary to reuse, not rewrite | `src/lib/music/timeSignatures.ts` |
| Scale / mode vocabulary for later layers | `src/lib/music/scales.ts` |
| Shared audio context (mounted in root) | `src/contexts/AudioContext.tsx` |
| Lessons primitives (link out, don't duplicate) | `src/lib/lessons/registry.ts`, `docs/plans/lessons-module.md` |
| Dance plan (shared beat-clock idea) | `docs/plans/dance-tutorial-module.md` |
| Route + metadata precedent | `src/app/harmonica-lab/layout.tsx`, `src/app/lessons/page.tsx` |
| Nav config | `src/lib/navigation.ts` (`NAV_ITEMS`) |
| Icon mapping | `src/lib/appIcons.ts` |
| Planned drums instrument (do not block on) | `src/instruments/README.md`, `src/instruments/index.ts` |
| Song document (later deep-link only) | `src/lib/song/types.ts` |
| Static-export / deploy constraints | `.cursor/rules/deployment.mdc` |
| SEO pattern to follow later | `docs/plans/harmonica-lab-seo.md`, `docs/plans/seo-and-discoverability.md` |

## New files (to create, when we build)

| Purpose | Path |
|---------|------|
| Module hub | `src/app/genres/page.tsx` |
| Genre page (dynamic) | `src/app/genres/[slug]/page.tsx` |
| Genre + groove data | `src/lib/genres/registry.ts` |
| Beat scheduler + swing/shuffle | `src/lib/genres/schedule.ts` |
| Reusable widgets | `src/components/genres/{GroovePlayer,GrooveGrid,BeatComparer,AccentStrip}.tsx` |
