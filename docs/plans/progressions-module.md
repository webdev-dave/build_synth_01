# Plan: Progressions module — the harmony layer, as its own lesson tree

> **Status: planning (2026-09-12).** Nothing built. Decisions marked *open*
> are still the user's to make; everything else is the proposed default.

The harmony layer of a genre — which chords, in what order, and why they
sound the way they do — gets its own hub-and-spoke module, parallel to
`/scales`. Blues is the first case: the **12-bar blues** is the first live
spoke, and the blues genre page's Harmony panel is its first consumer.

```
/lessons                          ← curriculum index (see lessons-module.md)
/progressions                     ← hub. "Chords & progressions" + cards.
/progressions/twelve-bar-blues    ← first live spoke. "What are the 12-bar blues chords?"
/progressions/i-iv-v              ← the three-chord family (soon)
/progressions/ii-v-i              ← jazz (soon)
/progressions/i-v-vi-iv           ← the four-chord loop: pop, folk revival, reggae (soon)
/progressions/andalusian-cadence  ← i–♭VII–♭VI–V: flamenco, freygish neighbours (soon)
/progressions/dominant-seventh    ← kind: "chord" (soon)
/progressions/power-chord         ← kind: "chord" — rock (soon)
/progressions/[slug]              ← generateStaticParams from src/lib/progressions/registry.ts
```

## Why its own module (decided 2026-09-12)

- **Long term, every genre has a harmony layer** (reggae's four-chord loop,
  klezmer's freygish I–♭II swing, jazz's ii–V–I). One registry, one widget,
  one page shape — the same reason scales left `/lessons`.
- **Not on `/scales/blues-scale`.** The scale page teaches the scale from
  zero and already hands off to the genre page. The same scale sits over
  different harmony in rock, jazz, and R&B, so the scale page is the wrong
  owner. It gets *one* short section — why ♭3 and ♭7 work over I7 — and a
  link.
- **Not "harmony & form" combined.** Harmony is a chord per bar; form is
  sections spanning many bars, mostly defined by melody and lyric, not
  chords (verse–chorus, strophic, AABA). Different data shape, different
  widget. They share one **bar-timeline component**, not a registry. See
  "Form" below.
- **Not under a `/lessons/` URL prefix.** "Lessons" is the parent *hub* and
  nav section; spoke URLs stay flat (`/progressions/twelve-bar-blues`) like
  every other tree. Nesting would move 17 indexed scale pages through
  meta-refresh redirects for no gain.

## Two kinds on one hub — progressions and chords

Mirrors `/scales` holding scales *and* modes under `kind`. A chord-kind
spoke ("What is a dominant seventh chord?") is one chord with the same
widget (key picker, keyboard lit with the chord tones, play). Chord spokes
are stubs in v1; concepts keep owning them until a spoke is live.

## Data model

### Shared chord vocabulary — `src/lib/music/chords.ts`

Import-free, like `scaleCatalog.ts`, so a Node script can audit it. Nothing
in `src/lib/music` models a chord today (`heroTune.ts` and the v1
`ChordTheoryPanel` each hand-roll their own); this becomes the one source.

```ts
export type ChordQuality =
  | "major" | "minor" | "dim" | "aug"
  | "dom7" | "maj7" | "min7" | "halfDim7"
  | "power";

export const CHORD_QUALITIES: Record<ChordQuality, {
  name: string;          // "dominant seventh"
  symbol: string;        // "7", "m", "m7", "°", "5"
  intervals: number[];   // semitones above the chord root: dom7 = [0, 4, 7, 10]
}>;

/** A chord relative to a key: "the dominant seventh on the fourth degree". */
export interface ChordSpec {
  /** Chord root as semitones above the key root (IV = 5, V = 7, ♭VII = 10). */
  root: number;
  quality: ChordQuality;
  /** Roman numeral as it prints ("I7", "IV7", "ii", "♭VII"). */
  numeral: string;
}

export function chordPitchClasses(keyRootPc: number, spec: ChordSpec): number[];
/** "A7", "D7", "E7" — spelled with the key's scale so A blues says E♭, not D♯. */
export function chordName(keyRootPc: number, spec: ChordSpec, degrees?: readonly ScaleDegree[]): string;
/** Close voicing inside one octave above `lowMidi`, so the widget never jumps registers. */
export function voiceChord(keyRootPc: number, spec: ChordSpec, lowMidi: number): number[];
```

### Teaching registry — `src/lib/progressions/registry.ts`

Same shape as `ScaleLesson`: search-shaped `question`, quotable `answer`,
crawlable `formula` + worked example, `status`, cross-links as data.

```ts
export type ProgressionKind = "progression" | "chord";

export interface ProgressionBar {
  chord: ChordSpec;
  /** Beats this chord holds; default = the whole bar. Split bars later (jazz turnarounds). */
  beats?: number;
}

/** A named alternative reading of the same progression, toggled on the widget. */
export interface ProgressionVariant {
  id: string;            // "quick-change", "turnaround"
  label: string;
  blurb: string;         // one line: what changes and why players do it
  bars: ProgressionBar[];
}

export interface Progression {
  slug: string;
  name: string;          // "12-bar blues"
  kind: ProgressionKind;
  aliases: string[];     // "blues changes", "three-chord blues", "I–IV–V blues"
  question: string;      // "What are the 12-bar blues chords?"
  summary: string;       // hub card
  answer: string;        // lead + meta description + FAQ JSON-LD — true standalone
  history?: string;
  meter: "4/4" | "3/4" | "12/8" | "6/8";   // reuse src/lib/music/timeSignatures ids
  bars: ProgressionBar[];                  // kind "chord": one bar, one chord
  variants?: ProgressionVariant[];
  /** Crawlable chart: "I7 · I7 · I7 · I7 | IV7 · IV7 · I7 · I7 | V7 · IV7 · I7 · I7" */
  formula: string;
  exampleKey: string;                      // "A"
  exampleChords: string;                   // "A7 – D7 – E7"
  /** Genre slugs where this harmony is heard. Genre registry points back. */
  usedIn: string[];
  /** Scale slugs a soloist plays over it. Scale registry does NOT point back in v1 (see below). */
  scales: string[];
  /** Foil for a comparison ("12-bar blues vs I–V–vi–IV: same three chords, different loop"). */
  compareWith?: string;
  /** Form slugs that share this slug's territory (twelve-bar-blues ↔ /forms/twelve-bar-blues). */
  forms?: string[];
  status: "live" | "soon";
  keywords: string[];
}
```

Helpers: `getProgression`, `LIVE_PROGRESSIONS`, `searchProgressions` (genre /
kind / status filters via `filterByHaystack`), `getProgressionsByGenre`,
`getProgressionsByScale` (reverse lookup so `/scales/blues-scale` can list
"Play it over" without a new scale field).

### The 12-bar blues entry (teaching truth, to sanity-check before shipping)

```
plain     | I7  I7  I7  I7 | IV7 IV7 I7  I7 | V7  IV7 I7  I7 |
quick     | I7  IV7 I7  I7 | …                                 (bar 2 → IV7)
turnaround| …                              | V7  IV7 I7  V7 | (bar 12 → V7)
```

- Every chord is a **dominant seventh**. The blues scale's ♭7 is the seventh
  of I7; its ♭3 rubs against I7's major third — that rub *is* the blue
  note on a keyboard. IV7's seventh is the key's ♭3 (in A: D7 holds C), so
  the blue third literally lives inside the IV chord. V7 carries the
  leading tone the blues scale lacks; players bend up to it or lean on ♭7.
- Jazz blues (ii–V in bars 9–10, VI7 in bar 8) is a **later variant**, not
  v1. Name it, link `/progressions/ii-v-i` when live.
- Classroom key **A** (guitar blues; matches `/scales/blues-scale`), so the
  genre page's scale teaser and harmony teaser open in the same key.

## Widgets — `src/components/progressions/`

Reuse the scale-lesson kit; add only what harmony needs.

| Piece | What it is | Reuses |
|---|---|---|
| `ProgressionProvider` | Page-wide state: key root, octave, active variant ids, current bar, one audio engine | `useSharedAudioContext`, `useAudioSynthesis`, the `ScaleLessonProvider` window/keys math |
| `BarTimeline` (**shared**, `src/components/content/`) | N cells in rows of 4, mono numeral + concrete chord name in the current key, current cell in burnt orange, keyboard-accessible; click a cell → sound it + light the keys | — (the form module reuses it with sections instead of chords) |
| `ProgressionPlayer` | Play/stop one chorus: chords scheduled on the AudioContext clock, quarter-note stabs at ~92 BPM, bounded run then rest; variant toggles relabel cells *and* change what sounds | `PlayScaleButton`'s one-scheduler pattern |
| `ProgressionKeyboard` | `LessonKeyboard` lit with the current chord's tones; optional "show the scale" overlay (scale degrees green, chord tones highlighted) — the *why sevenths* payoff | `LessonKeyboard` → `KeyboardV2` (**v2 only**) |
| `ProgressionTeaser` | Genre-page short version: key picker + timeline + play, no keyboard, no prose | mirrors `ScaleTeaser` |

Rules that carry over: sound only on gesture (pressing play or a cell is
consent); visual bar = sounding bar (one scheduler owns truth); motion from
the BPM, not arbitrary durations; `prefers-reduced-motion` gets discrete
cell changes, no sweep; burnt orange is the *current* bar only, green only
for in-scale keys. **Feel is straight quarters in v1** and the prose says so;
the shuffle arrives when `/rhythm` (grooves module) ships a shared clock — don't fake swing
with an animation.

## Pages

### `/progressions/[slug]` — mirrors `/scales/[slug]`

Header (question, kind badge, aliases line, lead answer, history) → lesson
body from `src/content/progressions/index.ts` → Quick reference (formula
chart, example key) → `<RelatedPages>` (genres via `usedIn`, scales, foil,
forms) → "being built" block when no lesson. FAQ JSON-LD with `about`
alternate names. `robots: noindex` while `soon`.

### `/progressions` hub — `ProgressionsExplorer`

`HubSearch` with genre chips (from `usedIn`), kind toggle, Ready / Coming
soon. Card: name, kind badge, summary, mono formula.

### `src/content/progressions/TwelveBarBluesLesson.tsx` (server component)

1. **A chord, here** — triad → seventh in two sentences; play I7 alone.
   `<Term id="triad">`, `<Term id="dominant">`.
2. **Three chords, three homes** — I, IV, V in the key; play each.
   `<Term id="i-iv-v">`.
3. **The twelve bars** — the timeline plays one chorus. This is the map.
4. **Why every chord is a seventh** — keyboard overlay with the blues scale;
   the ♭3/3 rub, the ♭7 match, C inside D7. Link `/scales/blues-scale`.
5. **Quick change and turnaround** — the two toggles, what each does.
6. **Where it goes next** — form (`/forms/twelve-bar-blues` when live, until
   then `/genres/blues`), jazz blues, the shuffle (`/rhythm/shuffle` later).
   `<Sources>` — verified references, added at write time, never from memory.

## Blues genre page — the Harmony panel

- `Genre.progressions: string[]` (blues: `["twelve-bar-blues", "i-iv-v"]`),
  reverse of `Progression.usedIn`. Add both sides in one change.
- `GenreLayers.layerReady()` gains `harmony` when `progressions[0]` exists;
  `HarmonyLayerPanel` mirrors `ScaleLayerPanel`: **door first** ("View the
  full lesson" → `/progressions/twelve-bar-blues`), short `answer`, mono
  formula line + example chords, `ProgressionTeaser`, "Also heard here"
  links for the rest.
- Harmony and Form panels stay distinct: harmony = which chords and why
  sevenths; form (later) = twelve bars as a chorus, AAB lyric, how choruses
  stack. Both point at their own home.

## Cross-links, delegations, redirects

| From | Declare on | Reverse |
|---|---|---|
| Genre → progressions | `Genre.progressions` | `Progression.usedIn` |
| Progression → scales | `Progression.scales` | `getProgressionsByScale` (scale page "Play it over") |
| Progression → form | `Progression.forms` | `Form.progressions` (when `/forms` exists) |
| Concept → progression | `Concept.href` delegation | `Progression` page renders the term inline |

- Concepts **delegate once the target is live**, the `pentatonic →
  /scales/minor-pentatonic` pattern: `twelve-bar-blues` and `i-iv-v` →
  their spokes. `dominant` and `triad` stay glossary-owned until the chord
  spokes are live. `cadence` stays glossary-owned (a property, not a chart).
- **Delegating a live concept removes `/concepts/<slug>` from static params**
  (`GLOSSARY_CONCEPTS` drives them) and it is in today's sitemap. Keep it
  from 404ing: generate params for every concept and render a
  `MovedLesson`-style meta-refresh + link for delegated ones (static export
  has no server redirects).
- `LESSONS.chords` → `movedTo: "/progressions/dominant-seventh"` only when
  that spoke is live; until then it stays a placeholder.
- Add the new rows to `.cursor/rules/history-articles.mdc` ("three trees"
  table) in the same change as the registry.

## Wiring checklist (build phase)

- [ ] `src/lib/music/chords.ts` + a tiny Node check that every
      `CHORD_QUALITIES` interval set is sorted and unique.
- [ ] `src/lib/progressions/registry.ts` — twelve-bar-blues live; the six
      stubs with true-standalone answers.
- [ ] `src/app/progressions/page.tsx` + `[slug]/page.tsx`; `dynamicParams = false`.
- [ ] `src/content/progressions/{index.ts,TwelveBarBluesLesson.tsx}`.
- [ ] Widgets above; `BarTimeline` under `src/components/content/`.
- [ ] `Genre.progressions` + `HarmonyLayerPanel`; blues opens Scale by
      default still — harmony is one click away, not a second open panel.
- [ ] `sitemap.ts` (`LIVE_PROGRESSIONS` + `/progressions`), `search/index.ts`
      (group `progressions`, aliases rank like titles), `navigation.ts`
      (Theory/Lessons section) + `appIcons.ts` (Lucide; custom chord-chart
      glyph via `createLucideIcon` if nothing fits).
- [ ] `/lessons` hub row + `lessons/registry.ts` module-index entry.
- [ ] Concept delegations + moved-concept rendering.
- [ ] Scale page: one short "over the chords" section on
      `BluesScaleLesson` + "Play it over" `RelatedPages` rows.
- [ ] Docs: this file's status, `genre-lab-module.md` (harmony layer home
      is `/progressions`; drop the `src/lib/genres/schedule.ts` line — the
      engine lives in `src/lib/music/`), `ToDo.md`.
- [ ] `npx tsc --noEmit`, lints, curl the static HTML for the lead answer.

## Form — planned here so harmony doesn't absorb it

`/forms` is a separate module (same rule: it will be needed for many
genres). Registry shape is `sections: [{ label, bars, repeat?, lyric? }]`,
widget is `BarTimeline` filled with spans. `twelve-bar-blues` exists in
**both** trees under the same slug, each owning its question and linking
the other at the top. Build order: `/progressions` → `/forms` (the form
widget depends on the timeline this module establishes). `/rhythm` is
independent and can run in parallel.

## Decisions

1. **Decided (2026-09-12) — Hub URL `/progressions`.** Rhythm module is
   `/rhythm` (code keeps the `grooves` name), form is `/forms`. Permanent
   once indexed.
2. Default — chord-kind spokes are stubs (`soon`) in v1; `dominant-seventh`
   gets written when a second genre needs it.
3. **Decided (2026-09-12) — comping voice is a 70s electric organ**, held
   for the whole bar in v1 (additive drawbar sines + soft ~6 Hz vibrato;
   recipe in [lesson-widgets-design.md](lesson-widgets-design.md) §6).
   Re-struck "comp" articulation arrives as a toggle with the shuffle
   transform in Phase 2.
4. **Decided (2026-09-12) — `ChordLock` defaults to the current chord's
   tones**, re-computed every bar while the player runs; toggle to the
   blues scale.
5. Default — `Progression.scales` is one-directional (reverse lookup), so
   the scale registry doesn't grow a field that only the blues page uses yet.

## Relevant existing files

| Purpose | Path |
|---|---|
| Registry + page shape to mirror | `src/lib/scales/registry.ts`, `src/app/scales/[slug]/page.tsx`, `src/components/scales/ScalesExplorer.tsx` |
| Lesson state / keyboard / play pattern | `src/components/scales/{ScaleLessonProvider,LessonKeyboard,PlayScaleButton,RootNotePicker,lessonPrimitives}.tsx` |
| Genre layer accordion + teaser precedent | `src/components/genres/GenreLayers.tsx`, `src/components/scales/ScaleTeaser.tsx` |
| Spelling helpers for chord names | `src/lib/music/scaleCatalog.ts` (`noteNameAt`, `simpleName`) |
| Meter ids | `src/lib/music/timeSignatures.ts` |
| Concept delegation precedent | `src/lib/concepts/registry.ts` (`pentatonic`, `freygish`) |
| Moved-page pattern (static export) | `src/app/lessons/[slug]/page.tsx`, `src/components/lessons/MovedLesson.tsx` |
| Umbrella | `docs/plans/lessons-module.md`, `docs/plans/genre-lab-module.md` |
