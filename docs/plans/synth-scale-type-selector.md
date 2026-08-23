# Plan: Scale-type selector for Synth v2

## Overview

Add a **scale type** dropdown next to the existing scale-root selector in
Synth v2 (`/synth/v2`), expanding beyond major/minor to modes (Phrygian,
Dorian, …), pentatonics, blues, and "exotic" harmonic-minor-family scales
(Phrygian dominant a.k.a. the Middle-Eastern/Hijaz sound, Ukrainian Dorian).
The keyboard's in-scale highlighting, lock-to-scale, degree numbers, and the
learn panel all follow the chosen type.

Second goal: make the synth **embeddable in lesson pages** with the scale
type pre-locked to the lesson's topic (selector greyed out), so a Phrygian
lesson can drop in the real instrument frozen on Phrygian.

## Where things stand today

- `SynthV2.tsx` already splits **root** (native `<select>`, all 12 chromatic
  roots) from **type** (a 2-option `Segmented`: major / minor). State is local
  React (`scaleRoot`, `scaleType`), synced into `useScaleLogic` as a
  `"C major"`-style string for `isNoteInScale`.
- The major/minor interval patterns are currently defined in **three places**:
  `src/lib/music/scales.ts`, `useScaleLogic.ts`, and a local `SCALE_PATTERNS`
  in `SynthV2.tsx`. The lessons-module plan already flags this duplication.
- `src/lib/music/scales.ts` already has most of the raw material:
  `SCALE_PATTERNS` (major, minor, harmonic/melodic minor, pentatonics, blues)
  and `MODE_PATTERNS` (all seven diatonic modes) + `MODE_INFO` display copy.
  Missing: Phrygian dominant and Ukrainian Dorian.
- `KeyboardV2` visualizes membership via an injected `isNoteInScale` and an
  optional 12-slot `scaleDegrees` map — it is already pattern-agnostic, so it
  needs almost no changes.

> Note: the screenshot referenced when this was requested didn't come through;
> the scale list below is a proposal built from the scales named in
> conversation (Phrygian, blues, Middle Eastern, Ukrainian Dorian) plus what
> `lib/music` already defines. Easy to add/remove entries before build.

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

## Implementation phases

### Phase 1 — Consolidate the theory layer (`src/lib/music`)

- [ ] Extend `scales.ts` with `phrygianDominant` and `ukrainianDorian`
      patterns; add a unified **scale catalog**:
      `SCALE_CATALOG: Record<ScaleTypeId, ScaleTypeInfo>` where
      `ScaleTypeInfo = { name, aliases?, pattern, degrees, group, feel, parent? }`
      (groups: Common / Modes / Pentatonic & Blues / Harmonic-minor family —
      these become `<optgroup>`s).
- [ ] Add `spellScale(root, scaleId)` (letter-once heptatonic spelling;
      degree-derived for 5/6-note scales) next to the existing `niceNote` /
      `enharmonic` helpers in `notes.ts`.
- [ ] Sanity-verify every pattern/degree/spelling against the table above
      (this doc is the source of truth; a small `scripts/`-style assertion or
      test file is fine if cheap, otherwise careful review).

### Phase 2 — Un-duplicate the synth's scale logic

- [ ] Refactor `useScaleLogic` so membership comes from a pattern passed in
      (or from `lib/music` via a `ScaleTypeId`) instead of its hardcoded
      major/minor record; widen `ScaleType` accordingly. The
      `"${root} ${type}"` string plumbing can be replaced by explicit
      `{ root, typeId }` — simpler than widening the template-literal union.
- [ ] Delete the local `SCALE_PATTERNS` copy in `SynthV2.tsx`; derive
      `scaleNoteNames`, `degreeMap`, and relative-key info from the catalog +
      `spellScale`.
- [ ] Leave Synth v1 (`/synth`, `SynthControls.tsx`) untouched on
      major/minor — it's the legacy version; don't grow its select.

### Phase 3 — The dropdown + keyboard behavior (Synth v2 UI)

- [ ] Replace the major/minor `Segmented` with a second native `<select>`
      styled identically to the root select (same `h-[30px]` mono styling),
      using `<optgroup>` per catalog group. A 14-option list has outgrown a
      segmented control; two matching selects side by side reads as one
      "Scale" phrase: `[D] [Ukrainian Dorian]`.
- [ ] Keep current behaviors: picking a root with no type auto-selects
      major + turns numbers on; clearing the root resets type/lock/numbers;
      `touchConcept("scale")` on change.
- [ ] Degree labels: switch `degreeMap` to quality-aware labels (Phase 1
      data); confirm `♭3`/`♯4` render legibly in `KeyboardV2`'s degree balls
      and in the single-note readout.
- [ ] Relative/parent link: generalize per the data-driven `parent` scheme;
      verify swap behavior re-frames correctly (e.g. E Phrygian dominant →
      A harmonic minor keeps the same marked keys).
- [ ] Learn panel: scale concept copy becomes catalog-aware — current
      selection's name, aliases, spelled notes, signature degree ("the ♯4 is
      what separates Ukrainian Dorian from plain Dorian"), and parent-scale
      sentence. `MODE_INFO`-style `feel` strings extend to the new entries.
- [ ] Lock-to-scale needs no logic change (it consumes `isNoteInScale`), but
      verify locked-out red dots and no-op keys with a 5-note scale selected.

### Phase 4 — Lesson embedding: lockable scale type

- [ ] Add embed props to `SynthV2` (or a thin `SynthEmbed` wrapper if the
      page chrome needs trimming): `initialScale?: { root, typeId }` and
      `lockedScaleTypeId?: ScaleTypeId`.
- [ ] When locked: type `<select>` renders `disabled` (greyed, native
      semantics — also correct for a11y), lock/numbers toggles stay usable,
      root select stays **enabled** (transposing within the lesson's scale
      type is a feature, not a leak — a Phrygian lesson benefits from hearing
      E Phrygian and A Phrygian).
- [ ] A small "locked to this lesson" hint near the greyed select (tooltip or
      muted caption) so the disabled state reads as intentional, per the
      "everything interactive looks interactive" rule inverted: things that
      aren't interactive should say why.
- [ ] Optional (cheap, high value): read `?scale=E-phrygianDominant` from the
      URL on `/synth/v2` so lessons can also deep-link with preselection —
      this is the "try it on the synth" follow-on already in the
      lessons-module plan.

### Phase 5 — Follow-ons (later, not in v1)

- [ ] **Double harmonic major** (0 1 4 5 7 8 11 — Hijaz Kar / "Byzantine"),
      a natural next Middle-Eastern entry once Phrygian dominant lands.
- [ ] **Major blues** (0 2 3 4 7 9 — degrees 1 2 ♭3 3 5 6): major pentatonic
      + its ♭3 blue note, the symmetric twin of the minor blues scale.
      Suggested in theory review; promote into v1 if desired — the blues
      infrastructure (6-note degree labels, degree-derived spelling) already
      covers it.
- [ ] Flat-named roots in the root select (B♭ vs A♯) driven by the chosen
      scale type's conventional spelling.
- [ ] Maqam context (quarter-tones are out of scope for a 12-TET keyboard —
      be explicit in lesson copy that Hijaz on a piano is an approximation).
- [ ] Mode-to-mode "sibling" navigation (cycle through all rotations of the
      current parent scale).

---

## Key decisions (open to veto)

1. **Native `<select>` over a shadcn Select.** `src/components/ui/` has no
   `select.tsx`, the root selector is already a styled native select, and
   optgroups come free. Matching pair > introducing a new component for one
   spot.
2. **One catalog in `lib/music`, everything derives.** Kills the current
   3-way pattern duplication; lessons widgets (per the lessons-module plan)
   read the same catalog, so lesson content and synth can never disagree.
3. **Quality-aware degree labels** (`♭3`, `♯4`) replace ordinal 1–7
   everywhere. Slightly busier visually, but ordinals are wrong for
   blues/pentatonics and hide exactly the alterations these scales exist to
   teach.
4. **Ionian/Aeolian are not separate entries** from major/minor — one entry,
   both names shown.
5. **Root select stays enabled in locked lesson embeds**; only the type is
   frozen.

## Suggested first milestone

Phases 1–3 shipped together (catalog + refactor + dropdown) with the v1 set
of 14 scale types. Phase 4 lands with the first real lesson page, since
that's when the lock prop has a consumer.

## Relevant existing files

| Purpose | Path |
|---------|------|
| Scale/mode theory (extend) | `src/lib/music/scales.ts` |
| Note spelling helpers | `src/lib/music/notes.ts` |
| Scale UI + state (main target) | `src/instruments/synth/v2/SynthV2.tsx` |
| Membership/chord hook (refactor) | `src/instruments/synth/templates/basic-synth/hooks/useScaleLogic.ts` |
| Keyboard visualization | `src/instruments/synth/v2/KeyboardV2.tsx` |
| Learn panel copy | `src/instruments/synth/v2/synthConcepts.ts` |
| Lessons registry (future consumer) | `src/lib/lessons/registry.ts` |
| Sibling plan | `docs/plans/lessons-module.md` |
