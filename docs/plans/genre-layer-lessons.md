# Plan: Genre layers → lesson modules

**Finish the blues genre page (harmony, rhythm, form) by building the lesson
modules those panels open into — and make "add a genre" or "add a layer" a
registry append, not new architecture.**

> **Status: planning, decisions locked (2026-09-12).** Nothing built. All
> six user decisions are taken — see §2 item 5 and §5.1 "Decisions log".
> This is the umbrella;
> per-module detail lives in child plans as they harden:
> [progressions-module.md](progressions-module.md) (harmony — written),
> [lesson-widgets-design.md](lesson-widgets-design.md) (how each layer's
> widgets teach — written), grooves and forms (sections below; split out
> when decisions lock).
> Supersedes the "layers → `/lessons`" line in
> [genre-lab-module.md](genre-lab-module.md) and the layer-widget notes in
> [genres-and-scales-modules.md](genres-and-scales-modules.md).

## 1. What we are building

Today `/genres/blues` has four layer panels. One works:

| Panel | State today | Opens into | Teaser widget |
|---|---|---|---|
| Scale | **live** — door + short answer + `ScaleTeaser` | `/scales/blues-scale` | locked keyboard, play |
| Harmony | "Coming soon" pill | `/progressions/twelve-bar-blues` | `ProgressionTeaser` |
| Rhythm | "Coming soon" pill | `/rhythm/shuffle` | `GrooveTeaser` |
| Meter *(new row)* | not listed yet | `/rhythm/twelve-eight` (derived from the grooves) | `BarFence` count |
| Form | "Coming soon" pill | `/forms/twelve-bar-blues` | `FormTeaser` |

Each remaining panel follows the Scale panel's contract exactly: **door
first** ("View the full lesson"), a short quotable answer, a mono formula
line, one playable teaser, "Also heard here" links. The genre page is about
how the music *uses* the layer; the module spoke teaches the layer from
zero. That split is the whole design — the genre page never becomes a
second home for a lesson.

## 2. The mental model: Lessons is the parent, layers are the children

```
Lessons (/lessons — curriculum index; nav section "Theory" → "Lessons")
├── Concepts & terms   /concepts        the vocabulary
├── Scales & modes     /scales          the notes            ← layer: scale
├── Chords & progr.    /progressions    the harmony          ← layer: harmony
├── Rhythm & meter     /rhythm          the groove + count   ← layers: rhythm, meter
├── Form               /forms           the shape            ← layer: form
├── Genres             /genres          where the layers stack (capstone)
└── History            /history         where the sound came from
```

Decisions already taken (see chat 2026-09-12, recorded here so they stick):

1. **Flat URLs, hub hierarchy.** Spokes stay `/scales/x`, `/progressions/x`
   — no `/lessons/` prefix. Static export has only meta-refresh redirects;
   moving 17 indexed scale pages buys nothing. The hierarchy lives in the
   `/lessons` hub, the nav section, breadcrumbs, and the registry.
2. **One module per layer that will recur across genres.** Harmony,
   rhythm, form each get a hub-and-spoke tree now, not later.
3. **Two kinds per hub where the data shape is shared**, mirroring
   scales/modes: progressions + chords; grooves + meters. Harmony and form
   are **separate** modules (chord-per-bar vs sections-over-bars — different
   data, different widget; they share a `BarTimeline` component).
4. **Cross-links are data, both directions**, rendered by `<RelatedPages>`.
5. **Hub names (decided 2026-09-12): `/progressions` · `/rhythm` · `/forms`.**
   Noun where the noun is common, layer name where "grooves" felt too
   slangy. **URL ≠ module name:** code keeps the `grooves` vocabulary
   (`src/lib/grooves/registry.ts`, `Groove`, `GroovePattern`,
   `src/components/grooves/`, `Genre.grooves`); only the route folder is
   `src/app/rhythm/` and `LAYER_MODULES.rhythm.hub = "/rhythm"`. Permanent
   once indexed.

## 3. Architecture — the "layer module" contract

Everything below exists once, in shared code. A module implements the
contract; a genre lists slugs. Adding rock later should touch **only
registries and content files**.

### 3.1 Shared lesson entry type — `src/lib/lessons/types.ts`

Every module's registry row extends one base, so hubs, search, sitemap,
JSON-LD, and the genre panel can treat them alike:

```ts
export interface LessonEntry {
  slug: string;
  name: string;
  /** Search-shaped <h1>/<title>: "What is the shuffle?" */
  question: string;
  summary: string;              // hub card
  answer: string;               // lead + meta description + FAQ — true standalone
  history?: string;
  aliases: string[];            // rank like the title in search; JSON-LD alternateName
  /** Genre slugs where it is heard. Genre registry points back. */
  usedIn: string[];
  status: "live" | "soon";
  keywords: string[];
}
```

`ScaleLesson` already matches this shape (its `aliases` are objects — keep
them; expose `aliasNames()` as the base accessor). `Progression`, `Groove`,
`Form` extend it. Shared helpers move next to it: `liveOf(list)`,
`baseHaystack(entry)`, `faqJsonLd(entry, alts)`.

### 3.2 Layer → module map — `src/lib/lessons/layers.ts`

The one place that says which module teaches which genre layer. `GenreLayers`
reads it instead of hard-coding `layer === "scale"`.

```ts
export const LAYER_MODULES: Record<GenreLayer, LayerModule | null> = {
  scale:   { hub: "/scales",       genreField: "scales",       get: getScale,       content: getScaleContent },
  harmony: { hub: "/progressions", genreField: "progressions", get: getProgression, content: getProgressionContent },
  rhythm:  { hub: "/rhythm",       genreField: "grooves",      get: getGroove,      content: getGrooveContent },
  meter:   { hub: "/rhythm",       genreField: "grooves",      get: getGroove,      content: getGrooveContent, derive: metersOfGrooves },
  form:    { hub: "/forms",        genreField: "forms",        get: getForm,        content: getFormContent },
  texture: null,   // no module yet — panel stays a "Coming soon" pill
};
```

- **Meter derives from rhythm.** A genre lists grooves; each groove declares
  its `meter`; the Meter panel shows the meter spokes those grooves live in.
  Derive, don't duplicate — no `Genre.meters` field.
- `layerReady(layer, genre)` = module exists **and** the genre's first slug
  resolves **and** that entry is live. Ready panels open; the rest keep the
  pill. Honest by construction.

### 3.3 Genre registry — one array per module

Explicit, greppable, matches the rule table in `history-articles.mdc`:

```ts
interface Genre {
  …
  scales: string[];        // exists
  progressions: string[];  // new — first is the signature
  grooves: string[];       // new
  forms: string[];         // new
}
```

Blues: `progressions: ["twelve-bar-blues", "i-iv-v"]`,
`grooves: ["shuffle"]`, `forms: ["twelve-bar-blues"]`. Reverse side on each
module row's `usedIn` in the same change.

### 3.4 Generic genre panel — `src/components/genres/LayerPanel.tsx`

`ScaleLayerPanel` generalised. Props: the resolved entry, `hub`,
`hasLesson`, `formula`, `example`, a `Teaser` element, `related[]`. Renders
door → answer → mono line → teaser → "Also heard here". Each module ships
its own `*Teaser` (client) — the panel is server-safe and knows nothing
about audio.

### 3.5 Shared spoke chrome — `src/components/lessons/LessonSpoke.tsx`

The scale spoke is ~220 lines of header / JSON-LD / quick reference /
related / placeholder. Three more copies is drift waiting to happen. Lift
the common frame (server component) with slots:

```
<LessonSpoke entry hubHref hubLabel badges aliases word
             lead history quickReference related placeholderCopy>
  {Lesson && <Lesson />}
</LessonSpoke>
```

Scale-specific bits (harmonica positions, quarter-tone note) stay in the
scale page via the slots. Refactor `/scales/[slug]` onto it in Phase 0 so
the new modules never fork it.

### 3.6 Shared timeline — `src/components/content/BarTimeline.tsx`

N cells in rows of a bar-group (4), mono labels, current cell in burnt
orange, click = select, keyboard-accessible. Progressions fill cells with
chords; forms fill spans with sections; grooves use a finer grid
(`GrooveGrid`, 8th/16th columns) that shares the same playhead math.

### 3.7 Shared clock — `src/lib/music/clock.ts`

One `BEAT = 60 / bpm` scheduler (the `heroTune.ts` / `PlayScaleButton`
pattern: audio scheduled on the `AudioContext` clock, visuals on timers
that follow it). Progressions comp on it, grooves hit on it, the form map
lights on it. The **shuffle feel is a transform on this clock**
(delay off-beats toward the next downbeat), so a 12-bar can be played
straight in Phase 1 and swung once grooves land — with no second scheduler.

### 3.8 Content maps, hubs, wiring — per module, same shape

| Piece | Per module |
|---|---|
| Registry | `src/lib/<module>/registry.ts` (`get*`, `LIVE_*`, `search*`, reverse lookups) |
| Content | `src/content/<module>/index.ts` → lesson components (server, `"use client"` only in widgets) |
| Routes | `src/app/<module>/page.tsx` (hub, `HubSearch`) + `[slug]/page.tsx` (`LessonSpoke`, `dynamicParams = false`) |
| Teaser | `src/components/<module>/<Module>Teaser.tsx` |
| Wiring | `sitemap.ts` (`LIVE_*` + hub), `search/index.ts` (group), `navigation.ts` + `appIcons.ts`, `/lessons` hub row |
| Concepts | delegate `href` once the spoke is live; render a moved page for the old `/concepts/<slug>` |
| Docs | rule table in `.cursor/rules/history-articles.mdc`; child plan; `ToDo.md` |

### 3.9 Sound generation — `src/lib/audio/` (new, UI-free)

Everything is Web Audio built-ins on the **shared** `AudioContext` from
`AudioContextProvider` — no samples, no audio library (AGENTS.md §5;
decision record and adoption rule in [docs/audio-stack.md](../audio-stack.md),
enforced by `.cursor/rules/audio-stack.mdc`).
Today the app has two raw engines (`useAudioSynthesis`: one oscillator →
gain; `useHeroAudio`: triangle lead + sine pad through a lowpass and a
*synthesized* convolver reverb) and no percussion at all. The organ and the
kit are the project's first real voice recipes, so they get a home that is
neither theory (`src/lib/music/`) nor UI:

```
src/lib/audio/
  bus.ts          createLessonBus(ctx): gain → lowpass ~3.5 kHz → dry + makeImpulse reverb; one per context
  noise.ts        one white-noise AudioBuffer per context, played per hit via AudioBufferSourceNode
  voices/
    organ.ts      organChordAt(ctx, bus, hzList, when, durSec, opts)
    lead.ts       the hero's triangle voice, extracted — response lick, melodies
    drums.ts      kickAt / snareAt / hatAt / openHatAt / rimAt; DrumVoice → recipe map
```

- **Organ** — additive drawbars: 4–5 `sine` oscillators per note at 1×,
  2×, 3×, 4× (optional 0.5× sub) with descending gains (~1 / .5 / .3 / .15)
  into one envelope gain (attack ≤ 10 ms, release ~150 ms). One shared
  6 Hz LFO → gain (6–10 cents) → every partial's `detune` for the Leslie
  wobble. Optional Hammond-style percussion partial (2× or 3×, ~200 ms
  decay) decided by ear at Checkpoint 2. ~20 oscillators per four-note
  chord — negligible.
- **Drums** — 808/909-style recipes. Kick: sine sweep 150 → 50 Hz over
  50 ms, ~350 ms decay, 5 ms click. Snare: triangle body ~190 Hz (~100 ms)
  + noise through bandpass 1–3 kHz (~180 ms). Closed hat: noise → highpass
  ~7 kHz, ~50 ms; open hat ~250 ms. Rim: sine ~800 Hz + highpassed noise,
  ~30 ms. Velocity is a gain multiplier; ghost notes are the same voice
  quiet. Each hit builds its own node graph at the scheduled time and
  auto-stops — stateless, like `scheduleNote` today.
- **Timing** — every function takes an absolute `when` from
  `useLessonClock`. Swing is applied to hit times *before* scheduling;
  voices know nothing about feel.
- **React bindings** stay where the plan puts them: `ProgressionProvider`
  calls the organ; `useDrumKit` (`src/instruments/drums/templates/basic-drums/`)
  wraps `drums.ts` with the shared context, the bus, and the kit picker.
  Pure recipes underneath can be unit-checked from `/tmp` (ratios,
  envelope lengths, summed gain ceiling) without a browser, and the later
  `/drums` page and a `/synth` preset picker reuse the same files.
- **Nice-to-have (Checkpoint 2):** `KeyboardV2` takes a `voice` prop so what
  the user plays on the harmony lesson is the same organ that is comping.

## 4. The three blues panels — what each teaches and links

### 4.1 Harmony → `/progressions/twelve-bar-blues`

Detail: [progressions-module.md](progressions-module.md). Summary:
`src/lib/music/chords.ts` (shared chord vocabulary — none exists), the
`Progression` registry, `ProgressionPlayer` + `ProgressionTeaser`, a lesson
that plays I7–IV7–V7, shows *why every chord is a seventh* on a keyboard
against the blues scale, and toggles quick-change / turnaround. Classroom
key A so scale and harmony teasers open in the same key.

### 4.2 Rhythm (+ Meter) → `/rhythm/shuffle`, `/rhythm/twelve-eight`

- **Registry** `src/lib/grooves/registry.ts`, `kind: "groove" | "meter"`
  (route folder is `src/app/rhythm/`; see §2 item 5 on URL ≠ module name).
  `Groove` adds `pattern: GroovePattern` (`src/lib/music/grooves.ts`:
  `DrumHit[]` with voice / `at` in beats / velocity, `bpm`, `meter`,
  `feel: "straight" | "swing" | "shuffle"`, one-line spoken `cue`),
  `compareWith` (foil groove), `meter` (slug of the meter spoke).
  Meter rows carry the `TimeSignature` and reuse
  `src/lib/music/timeSignatures.ts` copy — don't rewrite it.
- **Engine**: synthesized kit (kick / snare / hihat / rim — oscillators +
  noise bursts, no samples), on the shared clock; quiet, soft, real
  releases. Muted by default; play is consent.
- **Widgets** `src/components/grooves/`: `GrooveGrid` (voices × 8ths/16ths,
  mono count header, signature hits in burnt orange, playhead lights the
  sounding column), `GroovePlayer` (play, tempo slider — slow it until the
  feel is obvious), `BeatComparer` (two grids, one clock, A / B / both),
  `AccentStrip`, `GrooveTeaser` (grid + play, for the genre panel).
  Reduced motion: no sweeping playhead; a "next hit" step-through of the
  same `DrumHit[]`.
- **Blues lesson** (`ShuffleLesson.tsx`): straight vs swung eighths on one
  grid (the ScaleComparer of rhythm), the triplet grid that explains 12/8,
  snare on 2 and 4 *swung*, the walking bass as the same feel in pitch,
  comparer vs `backbeat` (rock) — the layer-model payoff. Links
  `/rhythm/twelve-eight`, `/genres/rock`, and back to the 12-bar.
- **Teaching truth to lock before code** (genre-lab plan Phase 0):
  shuffle, backbeat, one-drop as `DrumHit[]` on paper, checked against a
  trusted source. If the grid lights a hit, the kit must sound it.
- Concepts `shuffle` and `backbeat` delegate to their spokes once live;
  `syncopation` stays glossary-owned. `LESSONS.time-signatures` →
  `movedTo` the 4/4 meter spoke.
- **Decided (2026-09-12): blues adds `meter` to `signatureLayers`.** The
  Meter panel is derived from the grooves (shuffle → 4/4, slow blues →
  12/8), so it costs no new lesson — one more accordion row, and it proves
  the `derive: metersOfGrooves` path on the first genre. Lands in Slice 2d
  with the Rhythm panel.

### 4.3 Form → `/forms/twelve-bar-blues`

- **Registry** `src/lib/forms/registry.ts`: `Form` adds
  `sections: FormSection[]` (`{ label, bars, repeat?, lyric? }` — AAB is
  three 4-bar sections with lyric roles), `progression?: string` (the
  canonical progression slug when the form has one; the 12-bar does,
  verse–chorus does not), `compareWith`.
- **Widget** `FormMap` = `BarTimeline` filled with sections; when
  `progression` is set it plays that progression under the map on the
  shared clock, so bars light as chords sound — one truth, no silent
  poster. Forms without a progression render the map statically and say
  nothing is sounding. `FormTeaser` for the genre panel.
- **Blues lesson** (`TwelveBarFormLesson.tsx`): twelve bars as one
  *chorus*, the AAB lyric line (call, repeat, answer — `<Term
  id="call-and-response">`), how choruses stack into a song, where the
  instrumental break falls, 8- and 16-bar variants. Owns none of the chord
  explanation — a door to `/progressions/twelve-bar-blues` at the top, and
  the reverse door on that page.
- Same slug in both trees is deliberate: two questions, two owners, linked
  both ways (`Progression.forms` ↔ `Form.progressions`).

### 4.4 How each layer is visualised (design intent)

> Full treatment — widget by widget, the learning loop each supports,
> kit recipes, clock design, priorities and open questions — is in
> **[lesson-widgets-design.md](lesson-widgets-design.md)**. This section
> is the summary.

Common rule: **the x-axis is real time, and the lit thing is the sounding
thing.** Every layer widget is a controller, not a poster — click it, hear
it; play something, see it land on it. Timeline widgets share one visual
grammar (`BarTimeline` cells / `StepGrid` columns, mono headers, one
burnt-orange "now", green for in-scale) so a reader who learned the scale
page's keyboard reads the chord chart and the drum grid without relearning.

| Layer | Picture | The teaching move it makes |
|---|---|---|
| Harmony | `BarTimeline` chord chart (numeral + concrete chord per cell, current cell burnt orange) over a `KeyboardV2` lit with the chord tones and an optional green scale overlay | ♭3 (green) beside 3 (lit) *is* the blue-note rub; pressing a key marks which chords contain it. Later: a I–IV–V node map the playhead hops across. |
| Rhythm | `GrooveGrid` — voices as rows, subdivisions as columns positioned by **real time** (not equal spacing), mono count header, velocity as dot weight, signature hits burnt orange | A straight ↔ shuffle toggle physically slides the off-beat dots toward the next beat while the playhead keeps constant speed. Triplet-grid underlay shows shuffle = 12/8 with the middle triplet empty. `BeatComparer`: two grids, one playhead. Tempo slider to slow it down. |
| Meter | The same grid with the count header regrouped (`1 & 2 &` vs `1 trip let`) and an `AccentStrip` of weights | The bar fence moves; the hits don't. |
| Form | `FormMap` — `BarTimeline` with sections as spans, lyric roles (call · again · answer) in the cells, the progression sounding underneath; a zoomed-out row of choruses / sections as blocks | Width is time. The empty half of each four-bar phrase is visibly where the response lives. Click a section to jump the playhead. |

**Interaction rules (all three):**

- *Bidirectional.* Harmony: click a cell → chord sounds + keys light; press
  a key → cells containing that note mark themselves. Rhythm: tap a grid
  cell → toggles the hit (the lesson grid is a step sequencer with the
  preset loaded); the playhead is the only thing that moves on its own.
  Form: click a section → playhead jumps; the chart and keyboard follow.
- *One scheduler.* Audio is scheduled on the `AudioContext` clock; visuals
  follow on timers derived from the same `BEAT`. Harmony, rhythm, and form
  on one page share the same clock instance, so the form map, the chord
  chart, and the kit can never disagree about "now".
- *Bounded runs.* Play one chorus / one bar-cycle, then rest behind a
  replay affordance. Loop is an explicit toggle, off by default.
- *Reduced motion.* No sweeping playhead; a "next" control steps through
  the same events and lights the same cell/keys. Never a blank.
- *Variant toggles are diffs.* Quick-change, turnaround, straight/shuffle,
  8- vs 12-bar: the cells that change get a quiet marker, and what sounds
  changes with them.
- *Later, not v1:* tap-along mode (space bar / tap, early–late feedback
  against the grid), the I–IV–V node map, a lyric layer on the form map
  from a public-domain catalog song.

### 4.5 Drum machine: primitive first, product page later (decided 2026-09-12)

**Question asked:** should the drum machine be designed and built now so it
evolves with the lesson needs? **Answer: yes for the engine and the grid,
not yet for the product page.** Building the rhythm widgets lesson-only
means building a drum machine twice; building the full `/drums` product
first delays the lessons behind kits, presets, saving, and pattern
chaining. The primitives are the overlap — build those once.

The rhythm lessons need a kit, a clock with swing, a pattern type, and a
tappable grid — that *is* a drum machine. Build it once, as primitives in
`src/instruments/drums/templates/basic-drums/`, consumed by the lessons
first and wrapped as the `/drums` page afterwards (the `KeyboardV2` →
synth + lessons factoring, in the right order this time).

- **Data, UI-free:** `GroovePattern` / `DrumHit` in `src/lib/music/grooves.ts`;
  the shared clock with a swing/shuffle transform in `src/lib/music/clock.ts`.
- **`useDrumKit`:** synthesized kick / snare / closed & open hat / rim
  (oscillators + noise bursts, real releases, quiet). Voices are a
  swappable map so a sampler variant can replace them later without
  touching the grid.
- **`StepGrid`:** voices × steps, tap to toggle, playhead prop, per-hit
  velocity, **triplet subdivisions from day one** (12/8 must not be a
  retrofit), `editable` on/off so a lesson can lock a preset.
- **Lessons consume `StepGrid`** with registry presets (`GrooveGrid` is
  `StepGrid` plus count header, spotlight hits, and comparer wiring).
- **`/drums` = chrome around the same pieces:** pattern bank, tempo, swing,
  kit picker, plus an "Open in the drum machine" deep link
  (`/drums?pattern=<slug>`) on every groove page — the "Try it on the
  synth" pattern. Replaces the homepage "Soon" tile; uncomment `drums` in
  `src/instruments/index.ts`.
- Same clock later serves the piano roll's drum lane, the dance plan's
  `GroovePlayer`, and the hero loop.

**Design constraints so it can evolve without a rewrite:**

| Constraint | Why |
|---|---|
| Pattern data has no UI in it (`GroovePattern`: `TimeSignature`, `stepsPerBeat` incl. 3, `feel`, `swing` 0–1, `hits: DrumHit[]` with `voice`, `at` in beats, `velocity`) | The same object is a lesson preset, a `/drums` pattern, a piano-roll drum lane, and a dance count. |
| The clock exposes `onStep(stepIndex, time)` and `onBar`, and applies swing as a *time transform* on off-beat steps | Shuffle vs straight is a slider, not a second engine; the comparer runs two patterns on one clock. |
| Kit = `Record<DrumVoice, (ctx, time, velocity) => void>` | Swap synthesized voices for a sampler variant (`src/instruments/drums/variants/`) without touching `StepGrid`. |
| `StepGrid` is presentational: `pattern`, `playheadStep`, `editable`, `spotlight` (voice+step pairs), `onToggle` | Lessons render it read-only with spotlights; `/drums` renders it editable. Same component, no fork. |
| Velocity from day one (ghost notes, backbeat crack) | The one-drop's rim shot and the shuffle's ghosted snare are velocity stories; retrofitting velocity into a boolean grid is a rewrite. |
| Triplet subdivisions from day one | 12/8 and the shuffle grid are the *first* lesson, not a later one. |

**Where it lives:** `src/instruments/drums/templates/basic-drums/`
(`components/StepGrid.tsx`, `hooks/useDrumKit.ts`, `utils/voices.ts`);
pattern + clock types stay in `src/lib/music/` (shared non-UI, like
`scaleCatalog.ts`). Lesson wrappers (`GrooveGrid`, `GroovePlayer`,
`BeatComparer`, `GrooveTeaser`) in `src/components/grooves/`. Uncomment
`drums` in `src/instruments/index.ts` when the page ships; the homepage
"Soon" tile in `HomeApps.tsx` becomes a real nav item (icon already exists
in `appIcons.ts` as `drum-machine`).

## 5. Phases

**Phase 0 — shared architecture (no new pages yet)**
`lessons/types.ts`, `lessons/layers.ts` + generic `LayerPanel`, `LessonSpoke`
(refactor `/scales/[slug]` onto it — zero visual change), `BarTimeline`,
`music/clock.ts`, `music/chords.ts` with a Node sanity check.
Exit: `/scales` and `/genres/blues` render identically; `npx tsc --noEmit`.

**Phase 1 — Harmony (progressions module)**
Per child plan. Exit: `/progressions/twelve-bar-blues` live, blues Harmony
panel opens, concept delegations + moved pages, sitemap/search/nav.

**Phase 2 — Drum-machine primitives + Rhythm/Meter (grooves module)**
Content research first (lock shuffle, backbeat, one-drop as `DrumHit[]` on
paper against a trusted source). Then the primitives from §4.5
(`music/grooves.ts`, `useDrumKit`, `StepGrid`), the lesson wrappers,
`shuffle` + `twelve-eight` live, `backbeat` live as the foil (rock stays
"soon" as a genre — its groove can be live), blues Rhythm and Meter panels
open. `ProgressionPlayer` gains the shuffle transform from the shared
clock. Exit: the same `GroovePattern` plays identically in the lesson grid
and in a bare `StepGrid` test page.

**Phase 2b — `/drums` page (thin)**
Chrome around the Phase-2 primitives: pattern bank seeded from the grooves
registry, tempo, swing, kit picker, editable grid, `?pattern=<slug>` deep
link from every groove page. Nav item + homepage tile replace the "Soon"
tile. No save/share, no multi-pattern chaining, no mixer — those are DAW
scope (§7). Can slip after Phase 3 without blocking anything.

**Phase 3 — Form (forms module)**
`FormMap` on `BarTimeline` + the progression engine; `twelve-bar-blues`
live; blues Form panel opens. Blues page has no "Coming soon" pills except
Texture.

**Phase 4 — `/lessons` hub + nav**
Rebuild `/lessons` as the curriculum index (§2); `LESSONS` registry becomes
the module index with `movedTo` rows; nav section title; crumbs on hubs;
search "Lessons" group lists buckets. Move waveforms / octaves / frequency
to `/concepts/*` with Play-it demos.

**Phase 5 — proof: second genre is data-only**
Rock: registry rows (`backbeat` already live, `power-chord` chord spoke,
`i-iv-v`, `verse-chorus` form) + lesson content files. If rock needs a
component change, the contract is wrong — fix the contract, not rock.

## 5.1 Execution plan — how the phases get tackled

Guiding rule: **every slice leaves the site building and looking identical
or better, and every slice is verifiable without listening** (the agent
can't hear; the human checkpoints below are where ears are needed). One
slice at a time; the next does not start until the previous one
type-checks and its curl check passes.

### Decisions log (all taken with the user, 2026-09-12)

| # | Question | Decision | Where it bites |
|---|---|---|---|
| 1 | Hub URL names | **`/progressions` · `/rhythm` · `/forms`.** Code module for rhythm stays `grooves` (§2 item 5) | Slice 1a, 2d, 3; sitemap; nav |
| 2 | Meter panel on blues | **Yes** — add `meter` to `signatureLayers`; derived from grooves | Slice 2d (`GenreLayers` row appears when the first meter spoke is live) |
| 3 | Comping sound in the progression player | **70s electric-organ voice**, held for the whole bar in v1. Additive drawbar sines (fundamental + 2nd/3rd/4th harmonics, descending gains), ~6 Hz soft vibrato/chorus for the Leslie feel, near-instant attack, real release. Synthesized in `src/lib/audio/voices/organ.ts` (§3.9); `music/chords.ts` stays theory. A re-struck "comp" toggle arrives in Phase 2 once the shuffle transform exists. First named preset the `/synth` page could reuse later | Slice 1b; tuned by ear at Checkpoint 2 |
| 4 | Call-and-response lick in the Form lesson | **Sound it in v1** — a 3–5 note blues-scale lick on the lead voice in the response bars (3–4, 7–8, 11–12), scheduled on the same clock as the chords; the response cells light while it plays | Phase 3 (`FormMap` player). Lick is data in `src/content/forms/`, not hard-coded in the widget |
| 5 | TapPad (user taps along, sees early/on/late) | **v1.5** — after Checkpoint 3, once the grid, feel slider, count-along and comparer are live | Not in Slice 2c; new slice 2f after Phase 2 lands |
| 6 | `ChordLock` default | **Chord tones of the current chord** (4 lit keys per bar, e.g. A–C♯–E–G on A7); toggle to blues-scale mode available; follows the changes as the player runs | Slice 1c; `noteRole()` drives both the lit keys and the caption |

### Before any code

1. ~~Decide the two permanent items~~ — done (log rows 1–2). Nothing blocks
   Slice 0a or 1a.
2. Lock the 12-bar teaching truth against a source (variants, "every chord
   a seventh") and freeze it in the registry. Grooves get the same
   treatment at 2a.

### Slices and exit checks

| Slice | Work | Exit check |
|---|---|---|
| **0a** | `lessons/types.ts`; `LessonSpoke`; move `/scales/[slug]` onto it | `tsc` + lints; **curl diff** of `/scales/blues-scale` HTML before vs after — same bytes |
| **0b** | `lessons/layers.ts`; generic `LayerPanel`; `GenreLayers` reads the map | curl diff of `/genres/blues`; Scale still opens by default, other panels still show the pill |
| **0c** | `music/chords.ts` (`voiceLead`, `identifyChord`, `noteRole`) + Node check script | script passes from `/tmp` (intervals sorted/unique, voicings stay within one octave window, `identifyChord` round-trips every quality) |
| **0d** | `music/clock.ts` (`useLessonClock`, look-ahead scheduler, swing transform) + `BarTimeline` | swing math unit-checked in `/tmp`; component exercised by 1b, no dev-only route. **Do not** migrate `PlayScaleButton` yet |
| ☐ **Checkpoint 1 (human, eyes)** | — | `/scales/blues-scale` and `/genres/blues` look unchanged |
| **1a** | `progressions/registry.ts` (12-bar + six stubs, all `soon`); hub + spoke on `LessonSpoke` | curl: lead answer in HTML, `noindex` while `soon`, stubs resolve |
| **1b** | `ProgressionProvider`, `ChordSounder`, `ProgressionChart` + player on the shared clock, smooth voicings, **`organ` voice** (decision 3) | `tsc`; one browser pass for layout; chart cell labels match `chordName()` output for three keys; organ partial gains sum below the synth's default gain ceiling |
| **1c** | `ChordScaleOverlay`, variant toggles + diff captions, `ChordLock` **defaulting to chord tones** (decision 6) | `noteRole()` sentences checked for A and E against a hand-written table; lock set changes on every bar boundary of the player |
| **1d** | `TwelveBarBluesLesson.tsx` + verified `<Sources>`; flip `live`; `Genre.progressions` + Harmony panel + `ProgressionTeaser`; concept delegations **with** moved-page fallback; sitemap / search / nav / icon | URL in `sitemap.xml`; `/concepts/twelve-bar-blues` still returns a page; search finds "12 bar"; `history-articles.mdc` table updated |
| ☐ **Checkpoint 2 (human, ears)** | — | comping sound + voicing feel. A preset on the shared engine — notes are parameter changes, not redesign |
| **2a** | Groove content research: shuffle, backbeat, one-drop as `DrumHit[]` against sources; registry rows as `soon` | each pattern has a cited source and a spoken `cue` that matches the hits |
| **2b** | `useDrumKit` voices + `StepGrid` in `src/instruments/drums/templates/basic-drums/` | `tsc`; a bare `StepGrid` renders 8th and triplet grids |
| ☐ **Checkpoint 3 (human, ears)** | — | kit voices. Consider a `best-of-n-runner` with 2–3 voice recipes so the pick is by listening |
| **2c** | `GrooveGrid` (time-true columns), `FeelControl`, `CountAlong`, two-row `AccentStrip`, `BeatComparer`, `TempoControl`, `BarFence` | column x-positions match the swing transform for 50 / 67 / 75 % (unit check) |
| **2d** | `ShuffleLesson`, `twelve-eight`, `backbeat` live under `/rhythm/*`; blues gains `meter` in `signatureLayers` (decision 2) — Rhythm **and** Meter panels open; `ProgressionPlayer` picks up the shuffle transform and the "comp" re-strike toggle (decision 3) | curl + sitemap + search as in 1d; same `GroovePattern` plays identically in `GrooveGrid` and bare `StepGrid`; Meter panel lists exactly the meters the blues grooves declare |
| **2e** | Thin `/drums` page + `?pattern=` deep links; homepage tile replaces "Soon"; uncomment `drums` family | can slip behind Phase 3 |
| **2f** *(v1.5)* | `TapPad` — user taps along, grid shows early / on / late (decision 5) | after Checkpoint 3; input latency measured on touch before scoring is shown |
| **3** | `forms/registry.ts`; `FormMap` (three strips over the progression); repetition view; `FormComparer`; `TwelveBarFormLesson`; blues Form panel; PD lyric from the catalog; **scripted response lick** in bars 3–4 / 7–8 / 11–12 on the lead voice (decision 4) | blues page has no pills except Texture; curl + sitemap + search; lick notes are all in the key's blues scale (unit check) and the lit response cells match the sounding bars |
| **4** | `/lessons` curriculum index; `LESSONS` as module index with `movedTo`; nav section rename; crumbs on hubs; waveforms / octaves / frequency → `/concepts/*` demos | old `/lessons/<slug>` URLs all return a page |
| **5** | Rock as data-only: registry rows + content files | `git diff --stat` touches nothing under `src/components` or `src/app` |

Rough size: Phase 0 one session; Phase 1 two–three; Phase 2 three–four;
Phase 3 one–two; Phases 4 and 5 one each.

### Working rules

- **Verify without the shared browser** wherever possible: curl for HTML,
  sitemap, and JSON; `/tmp` scripts for music math; `tsc` + lints. One
  browser attempt per phase for widget layout, otherwise ask the human.
- **Commits per slice, but do not commit or push unless asked.** Never
  claim anything is live — pushes to `main` stage a build only
  (`.cursor/rules/deployment.mdc`).
- **Audio state lives in refs + `requestAnimationFrame`**, not React state
  per step. This is the one performance trap in a look-ahead scheduler
  driving React.
- **Parallel work is allowed where files don't overlap:** 2a (research)
  and 2b (kit voices) can run as background subagents during Phase 1.
  Anything that edits `GenreLayers`, `sitemap.ts`, `search/index.ts`, or
  `navigation.ts` stays serialized.
- **Design questions are decided (log above); checkpoints are for ears,
  not re-deciding.** Checkpoint 2 tunes the organ preset's parameters,
  Checkpoint 3 picks kit voices. Only `SongBuilder` (v1.5, Phase 3) has no
  decision yet, and it does not block anything.
- **Don't refactor working scale lessons on the way past.** They migrate
  to `useLessonClock` opportunistically, after the new modules prove it.

### Risks and how each slice contains them

| Risk | Containment |
|---|---|
| `LessonSpoke` / `LayerPanel` refactor changes live pages | 0a/0b exit is a byte-level HTML diff; nothing else lands in those slices |
| Delegating a live concept 404s `/concepts/twelve-bar-blues` under static export | 1d ships the moved-page fallback in the same commit as the delegation |
| Scheduler jank or drift once React is in the loop | refs + rAF rule; clock unit-tested before any UI consumes it |
| Sound design churn | voices are a swappable map; Checkpoint 3 picks by ear, code doesn't change shape |
| Module contract turns out to need per-genre exceptions | Phase 5 is the test; a rock-driven component change is fixed in the contract |
| Teaching truth wrong (grooves, 12-bar) | 2a and the pre-code step cite a source per pattern; the honesty rule forbids shipping unverified hits |

## 6. Honesty and style rules that bind every module

- Visual = sounding. Lit bar / lit hit / lit key must be what the scheduler
  is playing. Reduced motion gets a discrete step-through, never a blank.
- Sound on gesture only; teasers start silent; a bounded run then rest.
- Burnt orange = the current / signature thing (one per view); green = in
  scale / connected; everything else neutral. Mono for numerals, counts,
  note names.
- Prose is server-rendered TSX; widgets are client leaves; registry strings
  go through `makeTermLinker()`. `<Term>` / `<Word>` / `<ArtistLink>` on
  first mention. Sources verified at write time — never from memory.
- **v2 components only** (`KeyboardV2` via `LessonKeyboard`) — see
  `.cursor/rules/no-v1-legacy-ui.mdc`.
- Both sides of every cross-link in one change; render them with
  `<RelatedPages>`; update the rule table.

## 7. Out of scope

Texture layer widgets; the DAW around the drum machine (channels, mixer,
pattern chaining, saving/sharing patterns — `/drums` is a single-pattern
instrument); sampled kits or famous breaks; jazz-blues reharmonisation
beyond a mention; transcribed songs (the piano roll owns those); tap-along
scoring; leaving static export.

## 8. Relevant existing files

| Purpose | Path |
|---|---|
| Layer model + genre rows | `src/lib/genres/registry.ts` (`LAYER_INFO`, `LAYER_PAGE_ORDER`) |
| Accordion to generalise | `src/components/genres/GenreLayers.tsx` (`ScaleLayerPanel`, `layerReady`) |
| Spoke to lift into `LessonSpoke` | `src/app/scales/[slug]/page.tsx` |
| Lesson kit to reuse | `src/components/scales/{ScaleLessonProvider,LessonKeyboard,PlayScaleButton,ScaleTeaser,lessonPrimitives}.tsx` |
| Clock precedent | `src/components/home/heroTune.ts`, `src/components/scales/PlayScaleButton.tsx` |
| Meter copy to reuse | `src/lib/music/timeSignatures.ts` |
| Concept delegation + moved page | `src/lib/concepts/registry.ts`, `src/components/lessons/MovedLesson.tsx` |
| Wiring | `src/app/sitemap.ts`, `src/lib/search/index.ts`, `src/lib/navigation.ts`, `src/lib/appIcons.ts` |
| Drum machine slots that already exist | `src/instruments/README.md` (`basic-drums` template, planned), `src/instruments/index.ts` (commented `drums` family), `src/components/home/HomeApps.tsx` (`ComingSoonTile`), `src/lib/appIcons.ts` (`drum-machine` glyph) |
| Kit synthesis precedent (oscillators, gentle envelopes, no samples) | `src/instruments/synth/templates/basic-synth/hooks/useAudioSynthesis.ts`, `src/components/home/useHeroAudio.ts` |
| Child / sibling plans | `progressions-module.md`, `genre-lab-module.md`, `genres-and-scales-modules.md`, `lessons-module.md`, `dance-tutorial-module.md` (shares the clock) |
