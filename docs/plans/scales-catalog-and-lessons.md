# Plan: Scales catalog + lesson roadmap

One shared theory catalog, one lesson template, and the ordered list of
scale/mode pages to write under `/scales/[slug]` — including where the
"Middle Eastern" sound lands.

This unifies three threads that already exist separately:

- [genres-and-scales-modules.md](genres-and-scales-modules.md) — the
  `/scales` hub + spoke structure and the live blues-scale lesson.
- [synth-scale-type-selector.md](synth-scale-type-selector.md) — the
  verified 14-scale theory table and `SCALE_CATALOG` / `spellScale` design.
- [lessons-module.md](lessons-module.md) Phases 3–4 — the original lesson
  order (major → blues → Phrygian → dorian, pentatonics, harmonic minor,
  Rast).

Those docs stay the source for their own detail; this one owns the
**catalog decisions, the lesson order, and the per-page checklist**.

## Status log (read this first)

Newest entry on top. Update in the same commit as the work.

- **2026-09-11 · started.** Owner asked for the klezmer pages first and
  stepped away. Agreed flow: build the **klezmer track** (Phase 0 → slice 2
  → Phase 3) on one branch / one PR, stop, and wait for owner feedback on
  the Freygish lesson's tone before Phases 4–7. Owner decision recorded:
  harmonica cross-links target **harmonica v2 only** (`/harmonica-lab/v2`,
  `src/components/harmonica/v2/`); the legacy `/harmonica-lab` page is not
  touched. Open items for the owner live in **Phase 6**.

## Where things stand (2026-09-11)

- **Live:** `/scales/blues-scale` only. Six-section beginner lesson,
  `ScaleLessonProvider` + widgets (`ScaleKeyboard`, `ScaleComparer`,
  `DegreeStrip`, `PlayPatternButton`, `LessonToolbar`, `RootName`/`NoteAt`).
- **Stubbed (`status: "soon"`, registry copy exists):** `major-scale`,
  `minor-pentatonic`, `dorian`, `freygish`.
- **In the engine, no page:** natural minor, harmonic minor, melodic minor,
  major pentatonic, Phrygian, Lydian, Mixolydian, Locrian
  (`src/lib/music/scales.ts` `SCALE_PATTERNS` / `MODE_PATTERNS`).
- **Named in plans, not in the engine:** Phrygian dominant (= Freygish),
  Ukrainian Dorian, double harmonic, major blues, maqam Rast.
- **Widgets are already generic.** Every lesson widget takes a
  `ScaleDegree[]`; only the *data* is blues-specific
  (`BLUES_DEGREES` / `MINOR_PENTATONIC_DEGREES` hand-typed in
  `src/components/scales/notes.ts`). Spelling is flat-only (`flatName`),
  which is wrong for sharp-side modes.
- Harmonica positions already map 1→Ionian, 2→Mixolydian, 3→Dorian,
  4→Aeolian, 5→Phrygian (`src/lib/harmonica/constants.ts`), so those modes
  have a ready-made cross-link and reader intuition.

## Decisions (locked unless vetoed)

1. **One catalog, everything derives.** `SCALE_CATALOG` in `src/lib/music`
   is the single truth for pattern, degree labels, aliases, group, and
   parent relationship. Registry rows, lesson widgets, the synth's future
   type selector, and harmonica position copy all read it. Kills the
   current 3-way pattern duplication and the `notes.ts` hand-typed arrays.
2. **Ionian = major, Aeolian = natural minor.** One slug each
   (`major-scale`, `natural-minor`); the mode name is an alias, not a
   second page.
3. **Freygish *is* the Middle Eastern page.** Phrygian dominant, Ahava
   Rabbah, Hijaz, and Spanish Phrygian are aliases on `/scales/freygish`.
   No `/scales/phrygian-dominant`, no `/scales/hijaz`. The augmented second
   (♭2 next to a major 3rd) is the sound people mean; on a 12-TET keyboard
   that is one scale with several homes. Deeper "Eastern" entries (double
   harmonic, Rast) come *after* Freygish, not instead of it.
4. **Phrygian is Freygish's foil, not its stand-in.** ♭2 with a *minor*
   3rd — no augmented second. Its lesson ends by raising the 3rd and
   handing off to Freygish.
5. **Teach the harmonic-minor family as one block.** Harmonic minor →
   Freygish (5th mode) → Ukrainian Dorian (4th mode). Same parent notes,
   different home — the relative-key idea the synth already teaches for
   major/minor, extended.
6. **Quality-aware degree labels everywhere** (`♭3`, `♯4`), never ordinal
   1–7 for non-major scales. Already true on the blues page; the catalog
   makes it true by construction.
7. **Letter-once spelling for 7-note scales** via `spellScale`. Freygish in
   E must read `E F G♯ A B C D`; printing `A♭` hides the augmented second
   the page exists to teach. 5/6-note scales spell from the degree table.
8. **Melodic minor = ascending (jazz) form.** A static membership map
   cannot be direction-dependent; the copy says so.
9. **Rast is prose-first.** Quarter-tones are out of scope for a piano
   keyboard; the lesson must say the keyboard is an approximation. Ships
   last.

## Scale inventory

Semitones from root · degree labels · what its lesson compares against.

### Already stubbed — write these first

| Slug | Semitones | Degrees | Comparer | Default root |
|---|---|---|---|---|
| `major-scale` | 0 2 4 5 7 9 11 | 1 2 3 4 5 6 7 | major vs natural minor | C |
| `minor-pentatonic` | 0 3 5 7 10 | 1 ♭3 4 5 ♭7 | minor pent vs major pent (relative pair, A ↔ C) | A |
| `dorian` | 0 2 3 5 7 9 10 | 1 2 ♭3 4 5 6 ♭7 | natural minor vs Dorian (raised 6th) | D |
| `freygish` | 0 1 4 5 7 8 10 | 1 ♭2 3 4 5 ♭6 ♭7 | Phrygian → Freygish (raised 3rd); harmonic minor re-homed on the 5th | E |

### In the engine — need registry rows

| Slug | Kind | Semitones | Degrees | Comparer | Root |
|---|---|---|---|---|---|
| `natural-minor` | scale | 0 2 3 5 7 8 10 | 1 2 ♭3 4 5 ♭6 ♭7 | major vs minor (relative pair) | A |
| `harmonic-minor` | scale | 0 2 3 5 7 8 11 | 1 2 ♭3 4 5 ♭6 7 | natural minor → harmonic minor (raised 7th) | A |
| `melodic-minor` | scale | 0 2 3 5 7 9 11 | 1 2 ♭3 4 5 6 7 | harmonic minor → melodic minor (raised 6th) | A |
| `major-pentatonic` | scale | 0 2 4 7 9 | 1 2 3 5 6 | major → major pent (drop 4 and 7) | C |
| `mixolydian` | mode | 0 2 4 5 7 9 10 | 1 2 3 4 5 6 ♭7 | major → Mixolydian (♭7); Mixolydian vs blues (harmonica 2nd position) | G |
| `phrygian` | mode | 0 1 3 5 7 8 10 | 1 ♭2 ♭3 4 5 ♭6 ♭7 | natural minor → Phrygian (♭2) | E |
| `lydian` | mode | 0 2 4 6 7 9 11 | 1 2 3 ♯4 5 6 7 | major → Lydian (♯4) | F |
| `locrian` | mode | 0 1 3 5 6 8 10 | 1 ♭2 ♭3 4 ♭5 ♭6 ♭7 | Phrygian → Locrian (♭5) | B |

### Not yet in the engine

| Slug | Kind | Semitones | Degrees | Comparer | Root |
|---|---|---|---|---|---|
| `ukrainian-dorian` | mode | 0 2 3 6 7 9 10 | 1 2 ♭3 ♯4 5 6 ♭7 | Dorian → Ukrainian Dorian (♯4); harmonic minor re-homed on the 4th | D |
| `double-harmonic` | scale | 0 1 4 5 7 8 11 | 1 ♭2 3 4 5 ♭6 7 | Freygish → double harmonic (raised 7th; two augmented seconds) | C |
| `major-blues` | scale | 0 2 3 4 7 9 | 1 2 ♭3 3 5 6 | major pent → major blues (♭3), twin of the live blues page | C |
| `rast` | scale | approx. 0 2 4 5 7 9 10 | 1 2 3 4 5 6 ♭7 (3 and 7 are quarter-flat) | Mixolydian as nearest piano shape | C |

Aliases to carry on entries (not slugs): Ionian → `major-scale`; Aeolian →
`natural-minor`; Phrygian dominant / Ahava Rabbah / Hijaz / Spanish Phrygian
→ `freygish`; Misheberakh / Romanian minor / Dorian ♯4 → `ukrainian-dorian`;
Hijaz Kar / Byzantine → `double-harmonic`. Freygish and Ukrainian Dorian
parent = harmonic minor at −7 / −5 semitones.

Theory verification: the 14-type table in
[synth-scale-type-selector.md](synth-scale-type-selector.md) was
independently audited. Entries added here beyond that table
(`double-harmonic`, `major-blues`, `rast`) need the same hand check before
they enter the catalog.

## Lesson order

Grouped so vocabulary builds and cross-links land together. Within a phase,
ship the pair/block in one change so both sides of every link exist.

1. **Phase 0 — catalog** (no pages). Unblocks everything.
2. **Phase 1 — `major-scale`, `minor-pentatonic`.** Degree language, then
   finish the loop the blues page opened.
3. **Phase 2 — `mixolydian`, `phrygian`.** Harmonica 2nd and 5th positions.
   Phrygian teaser hands off to Freygish.
4. **Phase 3 — `harmonic-minor`, `freygish`, `ukrainian-dorian`.** The
   Middle Eastern / klezmer / flamenco block. First time that sound ships.
5. **Phase 4 — `natural-minor`, `major-pentatonic`, `dorian`, `lydian`,
   `locrian`, `melodic-minor`.** Fill the catalog; short lessons.
6. **Phase 5 — `double-harmonic`, `major-blues`, `rast`.** Follow-ons.

`dorian` is stubbed already; it can move up into Phase 2 alongside
Mixolydian if harmonica 3rd position wants a landing page sooner.

## Implementation phases

### Phase 0 — one theory catalog (`src/lib/music`)

- [ ] Add `phrygianDominant`, `ukrainianDorian`, `doubleHarmonic`,
      `majorBlues` patterns to `scales.ts`.
- [ ] Build `SCALE_CATALOG: Record<ScaleTypeId, ScaleTypeInfo>` with
      `{ name, aliases?, pattern, degrees, group, feel, parent? }` per the
      synth plan. Groups: Common / Modes / Pentatonic & Blues /
      Harmonic-minor family.
- [ ] Add `spellScale(root, id)` next to the `notes.ts` helpers: letter-once
      for heptatonic scales, degree-derived for 5/6-note scales, pick the
      enharmonic root without double accidentals (evaluated per scale type —
      B♭ major but G♯ Freygish and A♭ Ukrainian Dorian).
- [ ] `degreesFor(id): ScaleDegree[]` so `src/components/scales/notes.ts`
      stops hand-typing `BLUES_DEGREES` / `MINOR_PENTATONIC_DEGREES`.
- [ ] Type `ScaleLesson.patternKey` as `ScaleTypeId`. Fix the existing
      `minorPentatonic` vs `pentatonicMinor` mismatch.
- [ ] Assertion pass (script or test): every pattern's length equals its
      degree table, every degree label maps to its semitone, every
      `parent` offset re-homes onto the parent's note set.
- [ ] Regression-check `/scales/blues-scale`: `NoteAt`, `RootName`, and the
      comparer caption switch from `flatName` to catalog spelling.

### Phase 1 — lesson template + first two pages

- [ ] Extract `H2`, `P`, `Mono`, the degree table, and the section rhythm
      from `BluesScaleLesson.tsx` into `src/components/scales/lessonPrimitives.tsx`.
      Lessons stay server components that compose them.
- [ ] `ScaleComparer`: add a **swap** caption ("Freygish raises the 3rd:
      G → G♯") — today it assumes one side is a superset.
- [ ] `ScaleComparer`: add a **re-home** mode (`parentOffset`) that keeps the
      key set and shifts the root, for "same notes, home on the 5th."
- [ ] `MajorScaleLesson.tsx`: white keys in C, W–W–H–W–W–W–H, degrees 1–7,
      why plain numbers belong to major, comparer vs natural minor.
- [ ] `MinorPentatonicLesson.tsx`: reuse blues section 3, add the relative
      pair comparer (A minor pent ↔ C major pent), point forward to blues.
- [ ] Flip both to `"live"`; map in `src/content/scales/index.ts`.

### Phase 2 — harmonica-position modes

- [ ] Registry rows for `mixolydian`, `phrygian` (`kind: "mode"`).
- [ ] Add a `positions?: number[]` field on `ScaleLesson` and the reverse
      link from `src/lib/harmonica/constants.ts` so the **v2** harmonica lab
      (`HarmonicaLabV2` / `PositionMatrixV2`) can deep-link to
      `/scales/<slug>` and the scale page can list the position. Both sides
      in one change. Legacy `/harmonica-lab` is out of scope (owner
      decision, 2026-09-11).
- [ ] `MixolydianLesson.tsx`: major → ♭7; Mixolydian vs blues (the
      2nd-position "full vs blues" toggle, on a piano).
- [ ] `PhrygianLesson.tsx`: natural minor → ♭2; closing section raises the
      3rd and links to `/scales/freygish` ("this is where the Middle Eastern
      sound actually lives").

### Phase 3 — harmonic-minor family (the Middle Eastern block)

- [ ] Registry rows for `harmonic-minor`, `ukrainian-dorian`; `freygish`
      already exists — add `patternKey: "phrygianDominant"` and aliases.
- [ ] `HarmonicMinorLesson.tsx`: natural minor → raised 7th, the
      `augmented-second` concept lit, spelled `A B C D E F G♯`.
- [ ] `FreygishLesson.tsx` (E): comparer Phrygian → Freygish (swap), comparer
      harmonic minor → Freygish (re-home, −7). Alias line for Ahava Rabbah /
      Hijaz / Spanish Phrygian. One sentence that maqam Hijaz on a piano is
      an approximation. Cross-link `/genres/klezmer`, klezmer history.
- [ ] `UkrainianDorianLesson.tsx` (D): comparer Dorian → ♯4 (swap), comparer
      harmonic minor → re-home (−5). Sibling paragraph: same parent as
      Freygish, different home.
- [ ] Loanwords: register `misheberakh` (verified Hebrew spelling, source
      cited in a comment) in `src/lib/words/registry.ts`; hunt a human clip
      per `.cursor/rules/pronunciation-audio.mdc`, otherwise no speaker;
      log the result there in the same change.
- [ ] Cross-links: `usedIn: ["klezmer"]` on all three; klezmer `scales` in
      the genre registry; klezmer history article `scales`;
      `augmented-second` concept `scales` widened to include
      `harmonic-minor` and `ukrainian-dorian`.

### Phase 4 — fill the catalog

- [ ] `natural-minor`, `major-pentatonic`, `dorian` (stubbed), `lydian`,
      `locrian`, `melodic-minor`: registry row + three-to-four-section
      lesson, one comparer each (see inventory). Melodic minor copy states
      the ascending-only decision.

### Phase 5 — follow-ons

- [ ] `double-harmonic`: Freygish → raised 7th; two augmented seconds.
- [ ] `major-blues`: major pent → ♭3; comparer against the live blues page's
      minor blues as the symmetric twin.
- [ ] `rast`: prose-heavy; approximate keyboard; explicit quarter-tone
      caveat.
- [ ] Synth deep link: once Synth v2 has the type selector
      ([synth-scale-type-selector.md](synth-scale-type-selector.md)
      Phase 4), every lesson gets a "Try it on the synth" link with
      `?scale=<root>-<typeId>` from the shared catalog.

### Phase 6 — Needs owner input

Decisions an agent must not make alone. Add to this list rather than
guessing; strike through with the date when answered.

- [ ] **Freygish lesson tone + structure sign-off** before Phases 4–7 are
      written in the same voice: how much synagogue / Yiddish context, how
      hard to lean on the augmented second, whether the standalone framing
      (no Phrygian or major-scale page as prerequisite) reads well.
- [x] ~~Harmonica cross-link surface~~ — **v2 only** (2026-09-11).
- [ ] **Rast**: ship a piano-approximation page at all? If yes, how should
      the quarter-tone caveat read?
- [ ] **`dorian` timing**: move up to Phase 2 to serve harmonica 3rd
      position, or leave in Phase 4?
- [ ] **Stale `/lessons` scale slugs** (`scales`, `scale-degrees` in
      `src/lib/lessons/registry.ts`): redirect to `/scales` now or later?
- [ ] **Promotion to production** — always the owner's. A merged push
      stages a Vercel build; nothing goes live without `vercel promote`
      (see `.cursor/rules/deployment.mdc`).

## Per-page checklist (repeatable)

1. Catalog entry exists and passed the assertion pass.
2. Registry row: `question`, `answer` (true standalone — it is the meta
   description and FAQ JSON-LD), `summary`, `formula`, `exampleKey` /
   `exampleNotes` via `spellScale`, `usedIn`, `patternKey`, `keywords`.
3. Reverse links in the same change: genre `scales`, history `scales`,
   concept `scales`, harmonica `positions` where relevant.
4. Lesson in `src/content/scales/<Name>Lesson.tsx` (server component),
   mapped in `src/content/scales/index.ts`. Widgets only via v2 components
   and the shared `ScaleLessonProvider` (see `.cursor/rules/no-v1-legacy-ui.mdc`).
5. Loanwords registered with verified native spelling; `makeTermLinker`
   aliases added; no TTS.
6. `status: "live"`. `npx tsc --noEmit`, lint touched files, view the page
   with the root transposed and `prefers-reduced-motion` on.
7. Update the "Where things stand" section of this doc and the row in
   `ToDo.md`.

## Risks

- **Spelling before content.** Writing any mode page before `spellScale`
  produces wrong enharmonics on sharp-side roots. Phase 0 is not optional.
- **Duplicate slugs.** Ionian/Aeolian, Phrygian dominant, Hijaz must stay
  aliases. A second URL for the same note set splits search and breaks the
  synth's one-target deep link.
- **Comparer semantics.** Superset captions read wrong for swaps and
  re-homes; ship the two comparer modes before Freygish.
- **Blues regression.** `notes.ts` is imported by the live page; changing
  its source of truth touches it. Re-test the blues page after Phase 0.
- **Theory claims.** Every new pattern, alias, and parent offset outside the
  audited 14-type table must be hand-verified before it enters the catalog.
  No claims from memory in `answer` / `history`.

## Relevant files

| Purpose | Path |
|---|---|
| Scale/mode theory (extend into catalog) | `src/lib/music/scales.ts` |
| Note spelling helpers (`spellScale` goes here) | `src/lib/music/notes.ts` |
| Scale page registry | `src/lib/scales/registry.ts` |
| Lesson slug → component map | `src/content/scales/index.ts` |
| Live reference lesson | `src/content/scales/BluesScaleLesson.tsx` |
| Shared lesson state + widgets | `src/components/scales/` |
| Hand-typed degree data to retire | `src/components/scales/notes.ts` |
| Harmonica positions (cross-link) | `src/lib/harmonica/constants.ts` |
| Genre / history / concept reverse links | `src/lib/genres/registry.ts`, `src/lib/history/registry.ts`, `src/lib/concepts/registry.ts` |
| Loanwords | `src/lib/words/registry.ts`, `.cursor/rules/pronunciation-audio.mdc` |
| Synth type selector (sibling plan) | `docs/plans/synth-scale-type-selector.md` |
| Module structure (sibling plan) | `docs/plans/genres-and-scales-modules.md` |
