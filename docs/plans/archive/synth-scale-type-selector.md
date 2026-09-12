# Plan: Scale-type selector for Synth v2

## Overview

Add a **scale type** dropdown next to the existing scale-root selector in
Synth v2 (`/synth/v2`), expanding beyond major/minor to modes (Phrygian,
Dorian, …), pentatonics, blues, and "exotic" harmonic-minor-family scales
(Phrygian dominant a.k.a. the Middle-Eastern/Hijaz sound, Ukrainian Dorian).
The keyboard's in-scale highlighting, lock-to-scale, degree numbers, and the
learn panel all follow the chosen type.

Second goal: a **two-way link** with the Scales module — the learn panel
links to the scale's page, and every scale lesson links back into the synth
with that scale preselected (`?scale=D-dorian`).

## Status (2026-09-12) — complete

**Requested work shipped and live** (Phases A–E, commit `b9abf30`,
promoted as `instrumaps-d9fks7tcq`). The Type dropdown, catalog-driven
dots/lock/degrees, learn-panel card, and live `?scale=` deep links are
on `/synth/v2`. Phase F (locked embed, sibling cycling) was never in
this pass — parked follow-ons, not leftover work.

This plan is **done**. Archived to `docs/plans/archive/`.

### Already in place (do not rebuild)

| Was planned as | Exists today |
|---|---|
| Phase 1 catalog `SCALE_CATALOG` | `src/lib/music/scaleCatalog.ts` — 17 types (the audited 14 + `majorBlues`, `doubleHarmonic`, `rast`), quality-aware degrees, `group`, `feel`, `aliases`, `parent`/`relative`, per-degree `cents` for Rast |
| `spellScale` letter-once spelling | `spellScale`, `spellDegrees`, `rootNameFor`, `noteNameAt`, `simpleName` in the same file |
| Quality-aware degree labels on keys | `KeyboardV2.scaleDegrees` accepts `string` labels ("♭3", "♯4", "½♭3") |
| Maqam context | Quarter-tone tuning strip on `KeyboardV2`; Rast presses it from the Type dropdown |
| Lesson pages to link to | 17 live `/scales/<slug>` pages; `getScaleByPatternKey` + `LessonToolbar` "Try it on the synth" |
| Synth membership / labels | `pitchClassInScale`, `degreeLabelMap` — v2 no longer uses `useScaleLogic` for scale lock (kept for `identifyChord` / v1 / MidiLab) |

The theory section below is still the audited source of truth for the
patterns.

---

## Music theory foundation (get this right first)

This is the load-bearing section — the selector is only worth building if
every pattern, spelling, and relationship it displays is true.

### Scale catalog (proposed v1 set)

Semitone offsets from root; degree spellings relative to the major scale.

| id | Display name | Semitones | Degrees | Family |
|----|--------------|-----------|---------|--------|
| `major` | Major (Ionian) | 0 2 4 5 7 9 11 | 1 2 3 4 5 6 7 | Diatonic |
| `minor` | Natural minor (Aeolian) | 0 2 3 5 7 8 10 | 1 2 ♭3 4 5 ♭6 ♭7 | Diatonic |
| `dorian` | Dorian | 0 2 3 5 7 9 10 | 1 2 ♭3 4 5 6 ♭7 | Mode of major |
| `phrygian` | Phrygian | 0 1 3 5 7 8 10 | 1 ♭2 ♭3 4 5 ♭6 ♭7 | Mode of major |
| `lydian` | Lydian | 0 2 4 6 7 9 11 | 1 2 3 ♯4 5 6 7 | Mode of major |
| `mixolydian` | Mixolydian | 0 2 4 5 7 9 10 | 1 2 3 4 5 6 ♭7 | Mode of major |
| `locrian` | Locrian | 0 1 3 5 6 8 10 | 1 ♭2 ♭3 4 ♭5 ♭6 ♭7 | Mode of major |
| `harmonicMinor` | Harmonic minor | 0 2 3 5 7 8 11 | 1 2 ♭3 4 5 ♭6 7 | Minor variants |
| `melodicMinor` | Melodic minor | 0 2 3 5 7 9 11 | 1 2 ♭3 4 5 6 7 | Minor variants |
| `pentatonicMajor` | Major pentatonic | 0 2 4 7 9 | 1 2 3 5 6 | Pentatonic |
| `pentatonicMinor` | Minor pentatonic | 0 3 5 7 10 | 1 ♭3 4 5 ♭7 | Pentatonic |
| `blues` | Blues (minor) | 0 3 5 6 7 10 | 1 ♭3 4 ♭5 5 ♭7 | Pentatonic + blue note |
| `phrygianDominant` | Phrygian dominant | 0 1 4 5 7 8 10 | 1 ♭2 3 4 5 ♭6 ♭7 | Harmonic-minor mode |
| `ukrainianDorian` | Ukrainian Dorian | 0 2 3 6 7 9 10 | 1 2 ♭3 ♯4 5 6 ♭7 | Harmonic-minor mode |

Theory facts to encode correctly (and surface in the learn panel):

- **Ionian = major and Aeolian = natural minor.** Don't list them twice.
  The dropdown shows "Major (Ionian)" / "Natural minor (Aeolian)" — one entry
  each, so learners connect the mode names to the scales they already know.
- **Phrygian dominant** (the "Middle Eastern" sound) is the **5th mode of
  harmonic minor**: E Phrygian dominant = A harmonic minor started on E.
  Signature: ♭2 next to a **major 3rd**, creating the augmented 2nd
  (♭2→3, three semitones). Aliases worth showing: *Hijaz* (Arabic maqam
  family), *Freygish* (klezmer), *Spanish Phrygian*. It is Phrygian with the
  3rd raised — a great A/B comparison for lessons.
- **Ukrainian Dorian** is the **4th mode of harmonic minor**: D Ukrainian
  Dorian = A harmonic minor started on D. It is Dorian with a raised 4th
  (♯4), giving the same augmented-2nd leap (♭3→♯4). Aliases: *Romanian
  minor*, *Misheberakh* (klezmer), *Dorian ♯4*. Together with Phrygian
  dominant it makes the "two children of harmonic minor" story: same parent
  notes, different home base — the same relative-key idea the synth already
  teaches for major/minor, extended.
- **Melodic minor**: we present the **ascending (jazz) form** as the scale.
  Classical practice descends as natural minor; that's a learn-panel note,
  not something the highlighting should model (a static membership map can't
  be direction-dependent, and pretending otherwise would be a lie).
- **Blues scale**: 6 notes = minor pentatonic + the **blue note (♭5)**.
  Degree display must show `♭5` and `5` as distinct degrees — do NOT number
  it 1–6 sequentially (calling the ♭7 "6" would be musically wrong).
- **Augmented 2nd spelling**: in harmonic minor and its modes, the 3-semitone
  scale step is an augmented 2nd (e.g. F→G♯ in A harmonic minor), not a minor
  3rd. Correct note spelling (below) is what makes this visible.

### Note spelling (`spellScale` helper)

Today `scaleNoteNames` spells everything with sharps from `NOTES_SHARP`,
which produces wrong spellings like "F major: F G A A♯ C D E" (should be
B♭). With exotic scales this gets worse. Correct rule for all **heptatonic**
scales: **each letter A–G appears exactly once**; pick the accidental that
makes that true (E Phrygian dominant = E F G♯ A B C D, not E F A♭ A B C D).

- Add `spellScale(root, scaleId): string[]` to `src/lib/music` implementing
  letter-once spelling for 7-note scales; for pentatonic/blues (where
  letter-once is impossible), derive spelling from the degree table (♭3 of C
  is E♭, ♭5 is G♭).
- Scope guardrail: keys are still *chosen* from the 12 sharp-named roots
  (the root `<select>` stays as is); spelling only affects the readout and
  labels. Full flat-key UX (choosing "B♭ major" instead of "A♯ major") is a
  follow-on, noted in phase 5.
- **Double accidentals**: pick the enharmonic spelling of the *root* that
  avoids them, and note that the "clean" root **depends on the scale type**,
  so this must be evaluated dynamically, not hardcoded flatward. Worked
  examples (hand-verified):
  - Major: B♭ is clean, A♯ is not (A♯ major needs 𝄪).
  - Phrygian dominant on that same key: **G♯** is clean
    (G♯ A B♯ C♯ D♯ E F♯) while A♭ forces B𝄫 for its ♭2.
  - Ukrainian Dorian flips again: **A♭** is clean
    (A♭ B♭ C♭ D E♭ F G♭) while G♯ forces C𝄪 for its ♯4.
  `spellScale` should spell the scale from both enharmonic roots and return
  the one without double accidentals (prefer fewer accidentals as
  tie-breaker).

### Degree display

`degreeMap` currently emits ordinal 1–7 and `KeyboardV2` renders plain
numbers. Change the map to emit **quality-aware degree labels** (`1`, `♭2`,
`♯4`, …) from the catalog's degree table:

- On the keys (the "numbers" toggle): show the full label — `♭3` fits in the
  existing emerald ball at the current font size; verify visually.
- In the note readout: single held note shows its degree with quality
  (`♭3 of D Ukrainian Dorian`), which is more honest than today's bare digit.
- This also fixes pentatonic/blues for free, since labels come from the
  degree table instead of array position.

### Relative-key link, generalized

The current "relative minor/major" affordance is the app's best theory
moment; extend it instead of hiding it for new types:

- **Modes of major** → "same notes as **C major**" (the parent major), with
  the existing click-to-swap behavior re-framing the keyboard around the
  parent (or any sibling mode later — v1 just links to the parent major).
- **Phrygian dominant / Ukrainian Dorian** → "same notes as **A harmonic
  minor**" (parent = root − 7 semitones for the 5th mode, root − 5 for the
  4th mode).
- **Major ↔ natural minor** keeps today's exact behavior.
- **Pentatonics** → relative pair exists (A minor pent = C major pent, offset
  +3/−3) — include; **blues, harmonic/melodic minor** don't share their exact
  note set with any major scale, which is what the swap link claims — hide it,
  don't invent one. (Harmonic/melodic minor still *belong* to a relative major
  key in the key-signature sense — A harmonic minor pairs with C major, just
  with the raised 7th — that nuance goes in the learn-panel copy, not the
  link.)

Implementation: each catalog entry gets an optional
`parent: { scaleId, offsetSemitones, label }`, so this is data, not
special-casing in the component.

### Theory review status

This section was independently audited by a second model (Gemini 3.1 Pro)
and every finding was then re-derived by hand before incorporation. Outcome:
all 14 catalog patterns/degree spellings, the mode-of-harmonic-minor
relationships and their −7/−5 parent offsets, the augmented-2nd claims, the
pentatonic relative pair, the alias lists, and the melodic-minor framing
were verified correct by both passes. Three review findings were
incorporated: the dynamic (per-scale-type) enharmonic-root rule in the
spelling section, the tightened "doesn't share its exact note set" wording
for the relative-key link, and the major-blues follow-on in Phase 5.
No claims in this document remain flagged as uncertain.

---

## What the user sees (target)

```
SCALE · same notes as C major →           ← parent / relative link (data-driven)
[ D ▾ ] [ Dorian ▾ ] [lock] [numbers]     ← root select + type select w/ optgroups
```

- Picking a **root** turns the scale on (defaults to Major, numbers on —
  today's behaviour). Picking a **type** re-marks the keyboard immediately:
  in-scale keys get the green dot (or their degree label when numbers are
  on), out-of-scale keys get the red dot, and with **lock** on the red ones
  don't sound. Nothing new to learn — the same three affordances, now true
  for 17 scales instead of 2.
- **Numbers are the catalog's labels**, not 1–7: D Dorian shows
  `1 2 ♭3 4 5 6 ♭7`; A blues shows `1 ♭3 4 ♭5 5 ♭7`; C Rast shows `½♭3`
  and `½♭7` on the keys the strip has bent. The readout says
  "♭3 of D Dorian", not "3rd".
- Picking **Rast** presses the E and B switches on the tuning strip (as
  the Rast lesson does); picking any other type releases them. The strip
  stays hand-editable.
- The **learn panel** opens on the selected scale: title "D Dorian",
  the catalog's `feel` line, its notes spelled for this root, its degree
  formula, the parent/relative sentence, other names — and a **"Read
  about the Dorian mode →"** link to `/scales/dorian`. Change root or type
  and the panel updates in place.
- **Deep link**: `/synth/v2?scale=D-dorian` opens preselected. Every scale
  lesson gets a "Try it on the synth" link built from its root and
  `patternKey`. This closes the last open item in
  [scales-catalog-and-lessons.md](scales-catalog-and-lessons.md).

## Implementation phases

Each phase is one commit on `main`. Verify with `npx tsc --noEmit`, lint
on touched files, and the checks listed. The push stages a Vercel build;
promotion is a separate, owner-approved step
(`.cursor/rules/deployment.mdc`).

### Phase A — Data (small, no UI)

- [x] `scaleCatalog.ts`: add `relative?: { scaleId, offsetSemitones }` on
      `major` (→ `minor`, +9) and `pentatonicMajor` (→ `pentatonicMinor`,
      +9). Everything else already has `parent`. One helper
      `relatedScale(id): { scaleId, offsetSemitones, label } | null` returns
      `parent` if present, else the inverse of `relative`, else null (blues,
      harmonic/melodic minor, double harmonic, major blues, Rast show no
      link — they share their exact note set with nothing in the catalog).
- [x] `src/lib/scales/registry.ts`: `getScaleByPatternKey(id)` — the
      "read more" target. All 17 pages have `patternKey`; a type with no
      page simply gets no link (guard, don't crash).
- [x] `src/lib/music/scaleParam.ts`: `parseScaleParam("D-dorian")` →
      `{ rootPc: 2, typeId: "dorian" } | null` and `formatScaleParam`.
      Root accepts `C`, `C#`, `Db`, `C♯`, `D♭` (case-insensitive); type
      must be a `ScaleTypeId`. Rejects anything else → no preselection.
- [x] Check: extend `C:/tmp/scale-catalog-check.ts`-style script (kept
      outside the repo) to assert `relatedScale` round-trips (D Dorian →
      C major; C major → A minor; A minor → C major) and `parseScaleParam`
      accepts/rejects the cases above.

### Phase B — Synth state on the catalog

- [x] `SynthV2.tsx`: state becomes `rootPc: number | null` and
      `typeId: ScaleTypeId | null` (`hasScale = both set`). Delete the local
      `SCALE_PATTERNS`; derive from `SCALE_CATALOG[typeId].degrees`:
  - `isNoteInScale(noteNumber)` = pattern includes
    `mod12(noteNumber − rootPc)`. Computed locally with `useCallback`;
    `useScaleLogic` is no longer fed a string (keep calling it for
    `identifyChord` only, or import a pure `identifyChord` if one exists —
    do not refactor the hook, v1 and MidiLab use it).
  - `degreeMap: (string | null)[]` from the degree labels — this is what
    `KeyboardV2.scaleDegrees` already accepts, so the green dot / label /
    red dot logic needs **no change** in the keyboard.
  - `scaleNoteNames` = `spellScale(rootPc, typeId).join(" ")` (letter-once,
    so D Dorian reads "D E F G A B C" and E Phrygian dominant "E F G♯ A B C
    D", never "A♭").
  - Root display name = `rootNameFor(rootPc, degrees)` (A♭ vs G♯ follows
    the scale, as the lessons do).
  - `windowStart` / anchor logic keeps reading a pitch class; the root
    `<select>` value becomes the pc as a string.
- [x] Rast on the synth: `useEffect` — when `typeId` has quarter tones,
      `setDetuneCents(detuneMapFor(rootPc, degrees))`; when it changes to a
      type without them, `setDetuneCents(NO_DETUNE)`. Mirror
      `ScaleLessonProvider`; do not touch the strip when no scale is set,
      so hand-set switches survive plain playing.
- [x] Readout: "♭3 of D Dorian" / "outside D Dorian"; chord readout
      unchanged.
- [x] Verify: with no scale, behaviour is byte-identical to today; with C
      major and A minor, dots/lock/numbers match today's output (the two
      cases users already know); D Dorian lock silences C♯ and F♯ etc.

### Phase C — The type dropdown + relative link

- [x] Replace the major/minor `Segmented` with a native `<select
      aria-label="Scale type">` styled like the root select (`h-[30px]`,
      mono), `<optgroup label>` per `SCALE_GROUP_LABELS` in catalog order
      (Common → Modes → Pentatonic & blues → Harmonic-minor family →
      Maqam). Option text is `name` ("Phrygian dominant"); the learn panel
      carries the aliases, the dropdown stays short. Disabled until a root
      is chosen (as the segmented is now).
- [x] Root `<select>`: options are the 12 pitch classes; **black keys read
      both names** ("C♯ / D♭") so a user looking for B♭ finds it without
      us renaming options as the type changes. The readout and note list
      use the catalog spelling.
- [x] `labelExtra` becomes the generalized link from `relatedScale`: for a
      mode "same notes as **C major** →", for minor "relative major:
      **C**", for Phrygian dominant "5th mode of **A harmonic minor**".
      Click swaps root + type; the marked keys stay put and the window
      re-frames — the existing behaviour, now for every pair. Hidden when
      `relatedScale` is null.
- [x] `touchConcept("scale-type")` on type change (see Phase D for what
      opens).
- [x] Check on a 5-note scale (A minor pentatonic) and a 6-note scale (A
      blues): red dots on the right keys, lock no-ops them, labels `♭5`
      and `5` both present. Check E Phrygian dominant → A harmonic minor
      swap keeps the same lit keys.

### Phase D — Learn panel: the selected scale, with "read more"

- [x] New concept id `"scale-type"` in `synthConcepts.ts` whose body is
      assembled in `SynthV2` from the catalog (copy stays out of the
      component where it is static; the dynamic parts are data, not prose):
  1. **Title**: "D Dorian" (root spelled per scale + name); aliases in the
     first line when present ("Also called Freygish, Ahava Rabbah, Hijaz").
  2. `feel` sentence from the catalog.
  3. "Notes from D: D E F G A B C" and "Degrees: 1 2 ♭3 4 5 6 ♭7" — mono.
  4. Relationship sentence from `relatedScale` (same wording as the link).
  5. For Rast: one sentence that the strip has bent E and B a quarter tone
     (the same caveat the lesson carries — the cents are a setting).
- [x] `LearnPanel` gets an optional `lessonLabel` so the link can read
      **"Read about the Dorian mode"** / **"Read about the blues scale"**
      (from `ScaleLesson.name`) instead of the generic "Open the full
      lesson"; `lessonHref` = `/scales/${slug}` via
      `getScaleByPatternKey`. Existing concepts keep the default label.
- [x] Opening rule: **choosing a type opens the panel** on `scale-type`
      (like the numbers toggle — the selection *is* the lesson). Changing
      the root afterwards refreshes it in place (`touchConcept`). Clearing
      the root closes it if it is showing `scale-type`. The generic
      **Scale** label still opens the "What is a scale?" concept, whose
      first paragraph names the current selection and points at the
      scale-type card ("Your current scale is D Dorian — see below") —
      keep that one link, drop the hard-coded relative-minor sentence.
- [x] Update the existing concepts that point at `/lessons/scales` and
      `/lessons/scale-degrees` to `/scales/major-scale` and
      `/scales/major-scale#degrees` (they only work via redirect today).
- [x] Check with curl that `/synth/v2` still renders the idle hint, and in
      the browser that the panel replaces in place with the fade
      (`prefers-reduced-motion` → no motion).

### Phase E — Deep link both ways

- [x] `/synth/v2` reads `?scale=` once on mount via `useSearchParams`
      inside a `Suspense` boundary (same pattern as `src/app/map/page.tsx`)
      and applies `parseScaleParam` → root, type, numbers on, panel open
      on `scale-type`. Ignore the param on the static export's first paint
      (it's a client effect anyway). Don't write the URL back on every
      change — the synth is an instrument, not a form; the link is for
      arriving, not for sharing state (owner may veto).
- [x] Scale lessons: `LessonToolbar` (or the page footer next to Sources)
      gets **"Try it on the synth →"** linking to
      `/synth/v2?scale=${formatScaleParam(rootPc, patternKey)}` using the
      lesson's *current* root, so a reader who moved to E Dorian lands on
      E Dorian. Registry rows without `patternKey` show no link.
- [x] Strike the "Synth deep link" item in
      `scales-catalog-and-lessons.md` Phase 5 and the `lessons-module.md`
      item; update `ToDo.md`.

### Phase F — Not in this pass (unchanged from the original plan)

- Embedding the synth in lessons with a locked type (`lockedScaleTypeId`)
  — the lessons got their own `ScaleKeyboard` instead; revisit only if a
  page needs the full synth chrome.
- Mode-to-mode sibling cycling; flat-named root *selection*.

## Key decisions (open to veto)

1. **Native `<select>` with optgroups**, matching the root select. 17
   options have long outgrown a segmented control; two selects read as one
   phrase `[D] [Dorian]`. No new shadcn component for one spot.
2. **Rast is in the dropdown** and drives the tuning strip. It is the only
   entry that changes *sound* rather than *marking*; that is exactly the
   "hear the concept" moment the strip was built for. If the owner prefers
   the dropdown to be 12-TET only, drop the `maqam` group — one filter.
3. **Selecting a type opens the learn panel.** The owner asked for the
   info to show "while selected"; this is the least surprising way to do
   it without adding a second panel. Selecting a *root* alone does not
   open it (playing shouldn't force reading).
4. **One new concept (`scale-type`) instead of mutating `scale`.** The
   generic "what is a scale" copy stays reusable; the selected-scale card
   is fully data-driven from the catalog + registry, so adding a scale to
   the catalog adds it to the synth with no prose to write.
5. **Black-key roots show both names**; spelling elsewhere follows the
   scale. Cheaper than renaming options live and honest about the
   enharmonic choice.
6. **`useScaleLogic` is not refactored.** v2 computes membership from the
   catalog directly; the hook stays for v1 / MidiLab and for
   `identifyChord`.
7. **URL stays in sync, silently.** Every scale change (root, type, the
   same-notes swap, clear) goes through `commitScale()`, which rewrites
   `?scale=` with `history.replaceState` — no navigation, no history
   entry, no scroll — and drops the param when the scale is cleared. The
   address bar always describes what's on the keys, so copying it shares
   the current state. (Originally "read, not written"; changed 2026-09-12
   because a stale param drifts from the instrument.) Only the `/synth/v2`
   page does this (`readScaleFromUrl`); an embedded synth leaves the URL
   alone.

## Relevant files

| Purpose | Path |
|---|---|
| Catalog (add `relative`, `relatedScale`) | `src/lib/music/scaleCatalog.ts` |
| Scale pages (add `getScaleByPatternKey`) | `src/lib/scales/registry.ts` |
| `?scale=` parse/format (new) | `src/lib/music/scaleParam.ts` |
| Synth state + controls (main target) | `src/instruments/synth/v2/SynthV2.tsx` |
| Learn copy (add `scale-type`, fix hrefs) | `src/instruments/synth/v2/synthConcepts.ts` |
| Panel link label | `src/components/learn/LearnPanel.tsx` |
| Keyboard (no change expected) | `src/instruments/synth/v2/KeyboardV2.tsx` |
| Detune presets / `NO_DETUNE` | `src/lib/music/detune.ts` |
| Lesson "Try it on the synth" | `src/components/scales/LessonToolbar.tsx` |
| Search-param pattern to copy | `src/app/map/page.tsx` |
| Untouched (v1 / MidiLab) | `src/instruments/synth/templates/basic-synth/hooks/useScaleLogic.ts` |

## Log

- **2026-09-12 · Archived.** Requested work complete; Phase F stays
  parked. Moved to `docs/plans/archive/`.
- **2026-09-12 · Phases A–E shipped.** `/synth/v2` has a **Type** dropdown
  (native `<select>`, optgroups from `SCALE_GROUP_LABELS`, all 17 catalog
  types incl. Rast) in its own labelled column right after the root, so
  the two read as one phrase. Membership, degree labels, spelling, and
  the swap link all derive from `scaleCatalog.ts` (`pitchClassInScale`,
  `degreeLabelMap`, `spellScale`, `rootNameFor`, `relatedScale`); v2 no
  longer feeds `useScaleLogic` a string (kept for `identifyChord`). Rast
  presses the tuning strip and leaving it releases only what it pressed.
  Learn panel: new `scale-type` concept — choosing a type opens it; the
  **Type** label re-opens it, or, with nothing chosen, explains the
  dropdown. Card = feel + aliases, mono Notes/Degrees facts, related-scale
  sentence, quarter-tone note, "Read about the …" link to the `/scales`
  page (`getScaleByPatternKey`). Older concepts now link into `/scales`.
  `LearnPanel` grew `facts` and `lessonLabel`. Deep link: the synth reads
  `?scale=` from `window.location` once after mount (no Suspense boundary
  needed on the static export); every lesson's `LessonToolbar` shows
  "Try it on the synth" with the current root. Owner changes during
  review: the type dropdown stays beside the root (not a separate row) and
  gets a label above it like every other control. Black-key roots read
  "C♯ / D♭". Verified: tsc, lint, `C:/tmp/scale-selector-check.ts` (308
  checks), catalog script (1547), curl of `/synth/v2` and four lessons,
  browser pass.
