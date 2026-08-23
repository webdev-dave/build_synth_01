# Plan: Interactive Dance Tutorial Module

## Overview

A new **Dance** section at `/dance` that teaches partner/social dance styles the
Instrumaps way — **over a beat, with a visual you can follow**, not a wall of
prose. Each dance style gets its own hub with a progressive lesson track
(`lesson-0`/intro → `level-1` → `level-2` → …). Every lesson is a beat-synced,
interactive page: a groove plays (or a metronome), and a **footwork visual**
highlights each step *on the count* so the learner can see and hear the timing
of a pattern before (and while) they try it.

First style: **West Coast Swing (WCS)** — built out lesson-by-lesson as the
author learns it (currently a confident beginner), so the curriculum grows at
the same pace as real practice. The module is designed style-agnostic from day
one so Salsa, Bachata, Lindy, etc. can slot in later with the same shape.

> **Sketch first — this doc is the spec, not a build order to start blindly.**
> WCS terminology and counts below should be sanity-checked against a trusted
> source (or an instructor) before they ship as "teaching truth."

---

## Why this fits Instrumaps

The tagline — **"Don't study theory. Play with it."** — already generalizes
from music theory to *dance* theory. The core primitives we'd need mostly exist:

- **Beat/tempo engine.** `src/components/home/heroTune.ts` already models a
  timeline as typed events with `beats`, derives everything from `BPM`/`BEAT`,
  and computes absolute start times (`MELODY_TIMED`). A dance **step pattern**
  is the same idea: a sequence of count-events (which foot, weight change,
  direction) with a `beats` duration. **Derive, don't duplicate** (`AGENTS.md`).
- **Shared audio, on consent.** `AudioContextProvider` is mounted in the root
  layout; lessons resume/create the context inside a user gesture (pressing
  "play the groove" *is* consent). A lightweight click/metronome or a soft
  looped groove synthesized with oscillators keeps us honest and file-free
  ("lightweight synthesis over samples").
- **Motion follows music.** The footwork highlight timing derives from the same
  `BEAT`, so the visual pulses *because* of the count — exactly the "motion is
  intentional because it's musical" principle. Respect `prefers-reduced-motion`
  with a discrete step-by-step fallback (highlight the current count as static
  text, advance on a Next button / spacebar tap).
- **Everything teaches & is bidirectional (aspirational).** Long-term, clicking
  a count on the visual could scrub the groove to that beat, and tapping along
  could check your timing — the same two-way "controller, not poster" idea as
  the piano ↔ map.

### The honesty rule applies to dance too

Per `AGENTS.md`: if the visual implies something is happening on a beat, it must
actually be on that beat. A footfall lighting up on count "3&4" has to line up
with the audio's count 3-and-4. A mistimed highlight would be the dance
equivalent of "a lit tonic while a C-less chord plays" — a lie the whole app
philosophy forbids.

---

## Constraints to respect

- **Static export** (`output: "export"` → Vercel). Dynamic lesson routes need
  `generateStaticParams()`. No SSR, no API routes, no runtime redirects — path
  moves need a `vercel.json` 308 (see `.cursor/rules/deployment.mdc` +
  `harmonica-lab-seo.md`).
- **Metadata in a server component.** Each `/dance/*` route file stays a server
  component that exports `metadata`, rendering a `"use client"` child for the
  interactive beat/visual parts (mirror `harmonica-lab/layout.tsx`).
- **Design/voice** per `AGENTS.md`: calm, precise, dark-first, theme tokens,
  **monospace for data** (counts, BPM, beat readouts render mono — that's the
  "computer-sciency" undertone and it's *literally* count data). Accent orange
  only as a spotlight; green only for "on/confirmed." No new hues.
- **Deploy is deliberate**; `main` is locked. Nothing here changes that.

---

## Information architecture (hub-and-spoke, mirrors `/harmonica`)

```
/dance                              ← NEW hub. What the module is; cards → each style.
   • Short intro ("learn the timing by feel, on the beat")
   • Cards → west-coast-swing (more styles later)

/dance/west-coast-swing             ← NEW style hub. The WCS "map."
   • What WCS is (slotted, elastic, count-driven), how the track works
   • Lesson track list: Intro → Level 1 → Level 2 → … (locked/coming-soon states ok)
   • Default groove/BPM range for the style

/dance/west-coast-swing/[lesson]    ← NEW. One interactive lesson per slug.
   • lesson-0-intro, level-1, level-2, …  (generateStaticParams from the registry)
   • Beat-synced footwork visual + groove/metronome
   • Count breakdown as crawlable text (also good for SEO/LLM later)
   • Prev/Next within the track
```

Style-agnostic from the start: `west-coast-swing` is just the first `styleSlug`.
Adding Salsa later = a new registry entry + its lessons, **no new engine**.

---

## Data model (the heart of it — keep data out of components)

Music content already lives in typed data modules (`heroTune.ts`); dance content
should too, under `src/lib/dance/`.

```ts
// A single footfall / weight change on the count grid.
type StepEvent = {
  count: string;          // "1", "2", "3&4", "&", "a" — the spoken count (mono display)
  beats: number;          // duration in beats (triples split a beat into &-a)
  foot: "L" | "R" | null; // which foot takes weight (null = hold/anchor tap)
  weight?: boolean;       // does weight actually transfer this count?
  direction?: "back" | "forward" | "side" | "in-place" | "left" | "right";
  cue?: string;           // short teaching cue, e.g. "post / anchor", "coaster"
};

type StepPattern = {
  id: string;             // "sugar-push", "left-side-pass", "anchor-step"
  name: string;
  counts: 6 | 8;          // WCS patterns are 6- or 8-count
  events: StepEvent[];    // sum(beats) === counts
  followEvents?: StepEvent[]; // optional partner (follow) track for two-role view
};

type Lesson = {
  slug: string;           // "lesson-0-intro" | "level-1" | ...
  styleSlug: string;      // "west-coast-swing"
  title: string;
  order: number;          // track ordering / prev-next
  difficulty: "intro" | "1" | "2" | "3";
  patternIds: string[];   // which StepPatterns this lesson teaches
  bpm: number;            // default groove tempo for the lesson
  // prose/cues authored as TSX (like the lessons module), not a CMS
};
```

Reuse the `heroTune.ts` pattern exactly: derive `TOTAL_BEATS`, absolute
`at`-times per event, and `BEAT = 60 / bpm` so the visual scheduler is a
straight adaptation of the melody scheduler, not a new invention.

> **WCS-specific note:** WCS "rolling count" splits beats into `& a`
> (triple steps), and patterns *anchor* at the end (the 5&6 / "anchor step").
> The `StepEvent.count` strings and `beats` fractions must capture that, and the
> **anchor** should read clearly in both the visual and the cue text — it's the
> signature of the dance.

---

## Reusable lesson widgets

Location: `src/components/dance/`. Every lesson composes these.

- [ ] **`GroovePlayer`** — play/pause a metronome or soft synthesized groove at
      the lesson BPM, from the shared `AudioContext`, on user gesture. Muted by
      default with a clear affordance (per the "default to muted, invite the
      click" rule). Emits the current beat/count for the visual.
- [ ] **`CountTimeline`** — the signature widget: the pattern's counts laid out
      left→right (mono), highlighting the active count *on the beat*. Loops the
      pattern. This is the "hear and see the timing" payoff.
- [ ] **`FootworkMap`** — a simple top-down footprint diagram (L/R) that lights
      the foot taking weight on the current count and shows direction; the
      spatial "map" metaphor for where the feet go. (Start minimal — two
      footprints that highlight — before any fancy path animation.)
- [ ] **`TempoControl`** — slow the groove down to learn, speed up to test.
      Timing stays honest because everything derives from one BPM.
- [ ] **`PatternPicker`** — switch between the patterns a lesson teaches
      (e.g. sugar push vs. left side pass) with all widgets staying in sync.

All motion respects `prefers-reduced-motion` (discrete "current count" fallback,
advanced by a control rather than a timer).

---

## Phased build

### Phase 0 — Content research (no code)

- [ ] Lock WCS facts for the first lessons: the basic anchor step, sugar push
      (6-count), left side pass, and the count/timing for each (incl. triples &
      the anchor). Verify against a trusted source before teaching it.
- [ ] Decide leader-first vs. showing both roles in v1 (default: **leader track
      first**, follow track as a later toggle).
- [ ] Lock lesson track for WCS: `lesson-0-intro`, `level-1` (basic + sugar
      push), `level-2` (side passes), then grow as the author learns.

### Phase 1 — Skeleton & routing

- [ ] `src/app/dance/page.tsx` — module hub (server component + `metadata`).
- [ ] `src/app/dance/west-coast-swing/page.tsx` — style hub + lesson track list.
- [ ] `src/app/dance/west-coast-swing/[lesson]/page.tsx` with
      `generateStaticParams()` (required for static export), rendering a client
      child for the interactive parts.
- [ ] `src/app/dance/[style]/layout.tsx` (or per-lesson layout) — shared shell:
      lesson header, "back to track," prev/next footer.
- [ ] `src/lib/dance/registry.ts` — typed `Lesson[]` + `StepPattern` data.
- [ ] Add a **Dance** entry to `NAV_ITEMS` in `src/lib/navigation.ts` (note the
      current `NavItem` icons are emoji strings; pick one or extend to Lucide
      per `appIcons.ts` if going icon-component route).

### Phase 2 — Beat engine + core widgets

- [ ] `src/lib/dance/schedule.ts` — adapt the `heroTune.ts` timing helpers
      (absolute `at`-times, `TOTAL_BEATS`, `BEAT`) for `StepPattern`s.
- [ ] Build `GroovePlayer` + `CountTimeline` first — the minimum that proves
      "watch the count light up on the beat." Then `FootworkMap`, `TempoControl`,
      `PatternPicker`.
- [ ] Reduced-motion fallbacks for all of the above.

### Phase 3 — First WCS lessons (content)

- [ ] **Lesson 0 / Intro** — what WCS is, the slot, the rolling count, the
      anchor; a single looping metronome + count timeline, no footwork pressure.
- [ ] **Level 1** — the basic + sugar push with `FootworkMap`; slow-it-down
      tempo control.
- [ ] **Level 2** — left & right side pass.

### Phase 4 — Polish & follow-ons (later)

- [ ] Follow (partner) role toggle using `followEvents`.
- [ ] Tap-along timing check (bidirectional: tap the beat, see if you're early/
      late) — the "instrument, not poster" upgrade.
- [ ] SEO pass (mirror `harmonica-lab-seo.md`): crawlable count breakdowns,
      per-lesson `metadata`, sitemap entries, FAQ/JSON-LD — dance-timing queries
      are long-tail gold. Out of scope until the format proves out.
- [ ] Second style (Salsa/Bachata) to validate the style-agnostic model.
- [ ] "Bring your own song" — pick a BPM / tap tempo and dance the pattern to it.

---

## Key decisions (open to veto)

1. **Hub-and-spoke, style-agnostic from day one.** `/dance` → `/dance/<style>` →
   `/dance/<style>/<lesson>`, mirroring the confirmed `/harmonica` shape. WCS is
   just the first style.
2. **Lesson track = `lesson-0-intro` → `level-1` → `level-2` …**, ordered by a
   `Lesson.order` field, with prev/next. Levels can ship incrementally / show a
   "coming soon" state, so the module goes live before the curriculum is done.
3. **Content as typed data + TSX prose**, not MDX/CMS (same reasoning as
   `lessons-module.md`): step patterns in `src/lib/dance/`, prose/cues in the
   lesson TSX. MDX can come later without rework.
4. **Synthesized metronome/groove, muted by default**, resumed on gesture — no
   audio files, honest about what's sounding, consistent with the audio rules.
5. **Leader track first**, follow track a later toggle (keeps v1 tractable).
6. **Timing honesty is non-negotiable** — the visual highlight is scheduled off
   the same BPM as the audio; no decorative, off-beat animation.

## Suggested first milestone

**Phase 1 + `GroovePlayer` + `CountTimeline` + Lesson 0 (Intro)** — a single
page where a metronome plays and the WCS count lights up in time. That proves
the whole format (beat-synced, honest, on-brand) before building footwork
diagrams or more levels.

## Out of scope (for now)

- Video, motion capture, or pose detection.
- Uploaded/streamed real songs (licensing) — synthesized groove or tap-tempo only.
- Rebuilding audio infra or leaving static export.
- The follow-role tap-timing game (Phase 4 aspiration).

## Relevant existing files

| Purpose | Path |
|---------|------|
| Beat/timeline data pattern to mirror | `src/components/home/heroTune.ts` (`BEAT`, `BPM`, `TOTAL_BEATS`, `MELODY_TIMED`) |
| Shared audio context (mounted in root) | `src/contexts/AudioContext.tsx` |
| Route + metadata precedent (server shell + client tool) | `src/app/harmonica-lab/layout.tsx`, `src/app/harmonica-lab/page.tsx` |
| Dynamic static routes precedent | `docs/plans/lessons-module.md` (`generateStaticParams`) |
| Nav config | `src/lib/navigation.ts` (`NAV_ITEMS`) |
| Icon mapping | `src/lib/appIcons.ts` |
| Motion + reduced-motion pattern | `src/components/home/HeroMap.tsx` (`motion/react`, `useReducedMotion`) |
| Static-export / deploy constraints | `.cursor/rules/deployment.mdc`, `docs/plans/harmonica-lab-seo.md` |
| SEO pattern to follow later | `docs/plans/harmonica-lab-seo.md` |

## New files (to create)

| Purpose | Path |
|---------|------|
| Module hub | `src/app/dance/page.tsx` |
| Style hub | `src/app/dance/west-coast-swing/page.tsx` |
| Lesson route (dynamic) | `src/app/dance/west-coast-swing/[lesson]/page.tsx` |
| Shared lesson shell | `src/app/dance/[style]/layout.tsx` |
| Lesson + pattern data | `src/lib/dance/registry.ts` |
| Beat scheduler | `src/lib/dance/schedule.ts` |
| Reusable widgets | `src/components/dance/{GroovePlayer,CountTimeline,FootworkMap,TempoControl,PatternPicker}.tsx` |
