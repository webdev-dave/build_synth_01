# Plan: Interactive Scale Lessons Module

## Overview

A new **Lessons** section at `/lessons` — a blog/lessons module where each page
interactively teaches how a particular scale or mode works (e.g. major vs. blues
vs. phrygian). One topic per page (`/lessons/blues-scale`, `/lessons/phrygian-mode`,
…), presented as a scrollable article that mixes prose with **live interactive
widgets** (playable mini-keyboards, scale visualizers, A/B comparisons) so readers
can hear and see each concept.

## Why this is mostly content, not engine work

Most of the raw material already exists in the codebase:

- `src/lib/music/scales.ts` already defines `major`, `minor`, pentatonics, `blues`,
  and all seven modes including `phrygian` (`SCALE_PATTERNS`, `MODE_PATTERNS`,
  `MODE_INFO`, `isInScale`, `getScaleNotes`).
- The synth audio primitives are reusable: `useAudioSynthesis`, `SynthKeys`,
  `noteNumberToFrequency`, and the shared `AudioContextProvider` (already mounted
  in the root layout).
- Routing pattern is established — mirror `src/app/harmonica-lab/` and register in
  `src/lib/navigation.ts`.

### Constraints to respect

- App uses `output: "export"` (static export → Vercel). Dynamic lesson routes need
  `generateStaticParams()`. No SSR/server-only features.
- Styling is Tailwind + `globals.css` (no CSS Modules).

---

## Phase 1 — Skeleton & routing

- [ ] `src/app/lessons/page.tsx` — lessons index (card grid, blog-home style)
- [ ] `src/app/lessons/[slug]/page.tsx` with `generateStaticParams()` — one page
      per topic (required for static export)
- [ ] `src/app/lessons/layout.tsx` — shared shell: lesson header, "back to lessons",
      next/previous footer
- [ ] Add a **Lessons** entry to `NAV_ITEMS` in `src/lib/navigation.ts`
- [ ] `src/lib/lessons/registry.ts` — typed lesson metadata: `slug`, `title`,
      `subtitle`, `icon`, `difficulty`, `order`, referenced scale pattern key(s)

## Phase 2 — Reusable lesson widgets (core engineering)

Location: `src/components/lessons/`. Reused by every lesson.

- [ ] **`LessonKeyboard`** — lightweight 1–2 octave playable keyboard composed from
      `SynthKeys` + `useAudioSynthesis` + shared `AudioContextProvider`. Props: root
      note, highlighted scale, labels on/off. Deliberately NOT the full
      `SynthKeyboard` (which carries octave controls, fullscreen, toolbars, theory
      panels not wanted inside an article).
- [ ] **`ScaleDegreeStrip`** — visualizes interval pattern (W-W-H steps, scale
      degrees, "flat 3" / "blue note" callouts); clickable to play each degree.
- [ ] **`PlayScaleButton`** — plays the scale ascending/descending with a moving
      highlight, so non-players can hear its character.
- [ ] **`ScaleComparer`** — signature widget: two scales side by side on the same
      root (e.g. major vs. blues), shared root picker, highlights which notes differ,
      toggle-play each. This is what makes "regular vs blues vs phrygian" click.
- [ ] **`RootNotePicker`** — transpose every example; widgets stay in sync per lesson
      via local state.

## Phase 3 — First three lessons (content)

Each lesson is a TSX file in `src/content/lessons/` (prose + widgets interleaved),
in this order so vocabulary builds:

- [ ] **The Major Scale** — the baseline everything compares against. Steps, degrees,
      why it sounds "resolved."
- [ ] **The Blues Scale** — built as "minor pentatonic + the blue note," compared to
      major/minor. (Pairs with the blues-scale item already in `ToDo.md`.)
- [ ] **The Phrygian Mode** — modes as "the major scale started from a different
      degree," flat-2 as its signature sound, compared to natural minor.

## Phase 4 — Polish & follow-ons (later)

- [ ] More lessons: dorian, pentatonics, harmonic minor, eventually Maqam-Rast
      (from `ToDo.md`)
- [ ] "Try it on the synth" deep-link from a lesson into the main synth with the
      scale pre-locked in scale mode
- [ ] Consider MDX if writing volume grows (not worth the pipeline for 3 lessons)

---

## Key decisions (open to veto)

1. **Content as TSX, not MDX/CMS.** With static export and few lessons, typed TSX
   content files are simpler and let widgets be first-class. MDX can come later
   without rework.
2. **Widgets read scale data from `src/lib/music` directly.** The synth's
   `useScaleLogic` currently duplicates scale patterns; lessons won't repeat that.
   Unifying the synth onto `lib/music` can be a separate cleanup task.

## Suggested first milestone

Build **Phase 1 + Phase 2 + the Blues lesson** as a proof of the format before
writing the rest.

## Relevant existing files

| Purpose | Path |
|---------|------|
| Scale/mode theory | `src/lib/music/scales.ts` |
| Nav config | `src/lib/navigation.ts` |
| Route precedent | `src/app/harmonica-lab/page.tsx` |
| Audio synthesis hook | `src/instruments/synth/templates/basic-synth/hooks/useAudioSynthesis.ts` |
| Piano key rendering | `src/instruments/synth/templates/basic-synth/components/SynthKeys.tsx` |
| Freq/MIDI utils | `src/instruments/synth/templates/basic-synth/utils/synthUtils.ts` |
| Shared audio context | `src/contexts/AudioContext.tsx` |
