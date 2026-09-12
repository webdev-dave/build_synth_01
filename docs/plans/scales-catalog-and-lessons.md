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

- **2026-09-12 · Phase 5 + 6 · catalog complete.** `/scales/double-harmonic`,
  `/scales/major-blues`, `/scales/rast` live — **all 17 catalog pages now
  have lessons**; nothing is stubbed "soon". Rast is the first page on the
  quarter-tone strip and `ScaleComparer` has a "same keys, bent pitch"
  mode for it. The two stale `/lessons` scale slugs redirect into the
  Scales module. Only open item: the **synth deep link**, blocked on the
  Synth v2 type selector (separate plan). Verified: `tsc`, lint,
  catalog + alias scripts, curl of all three pages and both redirects
  (308), production `next build`. Pushed to `main` and promoted at the
  owner's request ("deploy to live app").
- **2026-09-12 · Phase 4 live.** `/scales/natural-minor`,
  `/scales/major-pentatonic`, `/scales/dorian`, `/scales/lydian`,
  `/scales/locrian`, `/scales/melodic-minor` — 14 of 17 catalog pages now
  have lessons; only Phase 5 (`double-harmonic`, `major-blues`, `rast`)
  remains stubbed. Details in the Phase 4 checklist. Verified: `tsc`,
  lint, 1547-check catalog script, alias-search script, curl of all six
  pages with note-spelling spot checks. Not pushed, not promoted.
- **2026-09-12 · alternate names + hub tiles.** Every registry row carries
  `aliases: ScaleAlias[]` (`{ name, tradition?, approx? }` — Hindustani
  thaat, Carnatic melakarta, Arabic maqam, Turkish makam, Jewish shteyger,
  Chinese / Japanese pentatonic names, and the Western nicknames). One
  list feeds four surfaces: global search (`titleAliases`, so "kurd" ranks
  `/scales/phrygian` like its title; native scripts from the words
  registry match too — "भैरवी", "حجاز"), the `/scales` hub search
  (`scaleHaystack`), page metadata (description "Also called …",
  keywords, JSON-LD `about.alternateName` + a second FAQ question), and
  the visible copy: full pills with native script + tradition under each
  page title (`ScaleAliases variant="header"`), one quiet "Also A · B · C"
  line on the hub tiles (`variant="line"`, three names). `≈` marks
  same-shape-different-intonation names (Hijaz, Nahawand, Yaman…).
  ~30 loanwords registered with native spellings; **Carnatic names stay
  Latin-only** until an attested Telugu/Tamil/Kannada spelling is
  verified; no audio added (human recordings only). Hub tiles redesigned
  after owner iteration: title row (+ arrow on hover), summary clamped to
  one line, formula, alias line; **no Explore/Preview row** — the card is
  the link. Commits `b9b8211` + the tile commit that follows it.
- **2026-09-11 (evening) · PR #4 merged and promoted; owner sign-off;
  Phase 1 started.** Owner reviewed the live klezmer pages and signed off
  on tone and structure ("all sound and feel good") — the Phase 6 gate is
  struck through, Phases 1/2/4/5 proceed in the same voice. Two more owner
  decisions landed the same evening: (a) **Rast ships as a playable page**,
  built the way Middle Eastern keyboardists actually play it — a
  per-pitch-class *detune* (Korg/Yamaha "Oriental scale" panel: press E and
  B, every E and B on the keyboard drops a quarter tone), not prose-first;
  (b) that scale panel lives on **`KeyboardV2` everywhere**, collapsed and
  off by default, so `/synth` gains it too. Owner asked for the remaining work
  **directly on `main`** (no feature branches / PRs), one commit per phase.
  Sequence: Phase 1 → Phase 2 → detune layer → Phase 4 → Phase 5 (Rast on
  the detune layer). Pushing stages a Vercel build; promotion stays the
  owner's call.
- **2026-09-11 · klezmer track built; paused for owner review.** Branch
  `cursor/scales-catalog-plan-0d4e`, PR #4 to `main`. Shipped: Phase 0
  (catalog + `spellDegrees`, `notes.ts` derives from it, `patternKey`
  typed), the Phase 1 template half (`lessonPrimitives.tsx`, comparer
  swap + re-home modes; the major / minor-pentatonic pages themselves are
  **not** written), and all of Phase 3 (`/scales/harmonic-minor`,
  `/scales/freygish`, `/scales/ukrainian-dorian` live, `misheberakh`
  loanword with a verified JEL clip, reverse links from klezmer genre +
  history + `augmented-second` / `mode` concepts). Verified: `tsc`, lint,
  471-check catalog assertion script, browser pass on all four scale pages
  (root transposed, comparers, reduced motion). **Next agent: do not start
  Phase 4+ until the Phase 6 Freygish sign-off is struck through.** Then
  the natural next slice is Phase 1's two pages (major, minor pentatonic)
  followed by Phase 2. Not merged, not promoted.
- **2026-09-11 · started.** Owner asked for the klezmer pages first and
  stepped away. Agreed flow: build the **klezmer track** (Phase 0 → slice 2
  → Phase 3) on one branch / one PR, stop, and wait for owner feedback on
  the Freygish lesson's tone before Phases 4–7. Owner decision recorded:
  harmonica cross-links target **harmonica v2 only** (`/harmonica-lab/v2`,
  `src/components/harmonica/v2/`); the legacy `/harmonica-lab` page is not
  touched. Open items for the owner live in **Phase 6**.

## Where things stand (2026-09-11, end of klezmer track)

- **Live:** `/scales/blues-scale`, `/scales/harmonic-minor`,
  `/scales/freygish`, `/scales/ukrainian-dorian` (the last three on the
  PR #4 branch, awaiting review). Lessons are server components composing
  `src/components/scales/lessonPrimitives.tsx` (`LessonIntro`, `H2`, `P`,
  `Mono`, `DegreeTable`, `LessonLink`, `Sources`) around the client widgets
  (`ScaleKeyboard`, `ScaleComparer`, `DegreeStrip`, `PlayPatternButton`,
  `LessonToolbar`, `RootName`/`NoteAt`). `ScaleLessonProvider` takes the
  page's `degrees` and spells its root names from the catalog.
- **Stubbed (`status: "soon"`, registry copy exists):** `major-scale`,
  `minor-pentatonic`, `dorian`.
- **Catalog:** `src/lib/music/scaleCatalog.ts` holds 16 `ScaleTypeId`s
  (major, minor, five other church modes, harmonic + melodic minor, both
  pentatonics, blues, majorBlues, phrygianDominant, ukrainianDorian,
  doubleHarmonic) with degree labels, aliases, group, and `parent`.
  `SCALE_PATTERNS` / `MODE_PATTERNS` in `scales.ts` derive from it;
  `src/components/scales/notes.ts` no longer hand-types degrees. Rast is
  still only named in plans.
- **Spelling:** `spellDegrees` — letter-once for 7-note scales with the
  enharmonic root chosen per scale type (B♭ major, G♯ freygish, A♭
  Ukrainian Dorian); simple flat names for 5/6-note scales, so the blues
  page is pixel-identical. Known legitimate exception: double harmonic on
  pitch class 8 needs a double accidental either way.
- **Comparer** speaks three captions: superset/subset, swap (same degree
  number, different key), re-home (same keys, `rootOffset` moves home).
- **Assertion script** lives outside the repo (`/tmp/scale-catalog-check.ts`
  during the 2026-09-11 session). Re-create it if needed: pattern length =
  degree count, every label maps to its semitone, parent offsets re-home
  onto the parent's key set, letter-once spelling has no double
  accidentals (except the exemption above).
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

- [x] Add `phrygianDominant`, `ukrainianDorian`, `doubleHarmonic`,
      `majorBlues` patterns to `scales.ts`.
- [x] Build `SCALE_CATALOG: Record<ScaleTypeId, ScaleTypeInfo>` with
      `{ name, aliases?, pattern, degrees, group, feel, parent? }` per the
      synth plan. Groups: Common / Modes / Pentatonic & Blues /
      Harmonic-minor family.
- [x] Add `spellScale(root, id)` next to the `notes.ts` helpers: letter-once
      for heptatonic scales, degree-derived for 5/6-note scales, pick the
      enharmonic root without double accidentals (evaluated per scale type —
      B♭ major but G♯ Freygish and A♭ Ukrainian Dorian).
- [x] `degreesFor(id): ScaleDegree[]` so `src/components/scales/notes.ts`
      stops hand-typing `BLUES_DEGREES` / `MINOR_PENTATONIC_DEGREES`.
- [x] Type `ScaleLesson.patternKey` as `ScaleTypeId`. Fix the existing
      `minorPentatonic` vs `pentatonicMinor` mismatch.
- [x] Assertion pass (script or test): every pattern's length equals its
      degree table, every degree label maps to its semitone, every
      `parent` offset re-homes onto the parent's note set.
- [x] Regression-check `/scales/blues-scale`: `NoteAt`, `RootName`, and the
      comparer caption switch from `flatName` to catalog spelling.

### Phase 1 — lesson template + first two pages

- [x] Extract `H2`, `P`, `Mono`, the degree table, and the section rhythm
      from `BluesScaleLesson.tsx` into `src/components/scales/lessonPrimitives.tsx`.
      Lessons stay server components that compose them.
- [x] `ScaleComparer`: add a **swap** caption ("Freygish raises the 3rd:
      G → G♯") — today it assumes one side is a superset.
- [x] `ScaleComparer`: add a **re-home** mode (`parentOffset`) that keeps the
      key set and shifts the root, for "same notes, home on the 5th."
- [x] `MajorScaleLesson.tsx`: white keys in C, W–W–H–W–W–W–H, degrees 1–7,
      why plain numbers belong to major, comparer vs natural minor — both
      ways (relative: re-home on 6; parallel: ♭3 ♭6 ♭7 swap).
- [x] `MinorPentatonicLesson.tsx`: why nothing clashes (no half steps),
      natural minor → pentatonic (subset), relative pair comparer (A minor
      pent ↔ C major pent), blue-note hand-off, Kubik / Folkways sources.
- [x] Flip both to `"live"`; map in `src/content/scales/index.ts`.
- [x] Stub every remaining slug as `"soon"` (natural-minor,
      major-pentatonic, mixolydian, phrygian, lydian, locrian,
      melodic-minor, double-harmonic, major-blues, rast) so links resolve
      before their lessons land. `exampleNotes` / `formula` verified against
      `spellScale` by the assertion script (1331 checks). Built 2026-09-11.

### Phase 2 — harmonica-position modes

- [x] Registry rows for `mixolydian`, `phrygian` (`kind: "mode"`), live.
      Mixolydian ↔ `blues` / `rock` genres both ways.
- [x] `ScaleLesson.positions?: number[]` (major-scale 1, mixolydian 2,
      dorian 3, natural-minor 4, phrygian 5) and `Position.scaleSlug` in
      `src/lib/harmonica` — data on both sides, asserted equal by the check
      script. Scale page renders a "Harmonica: 2nd position (Cross Harp)"
      card into `/harmonica-lab/v2?position=N`; `HarmonicaLabV2` reads
      `?position=` on mount (window, not `useSearchParams`, so the static
      export needs no Suspense) and its theory panel links "Hear Mixolydian
      on a piano" → `/scales/<slug>`. Legacy `/harmonica-lab` untouched.
- [x] `MixolydianLesson.tsx` (G): major → ♭7 swap, 7→1 vs ♭7→1, dominant
      seventh on home, re-home as C major (+5), Mixolydian vs blues.
- [x] `PhrygianLesson.tsx` (E): ♭2 falls to 1, natural minor → ♭2 swap,
      re-home as C major (+8), 5th position, raise the 3rd → `/scales/freygish`.
- [x] `ScaleComparer` grew a fourth caption shape — "adds X and drops Y" —
      for pairs that are neither subset nor swap (Mixolydian vs blues).
      Built 2026-09-11.

### Phase 3 — harmonic-minor family (the Middle Eastern block)

- [x] Registry rows for `harmonic-minor`, `ukrainian-dorian`; `freygish`
      already exists — add `patternKey: "phrygianDominant"` and aliases.
- [x] `HarmonicMinorLesson.tsx`: natural minor → raised 7th, the
      `augmented-second` concept lit, spelled `A B C D E F G♯`.
- [x] `FreygishLesson.tsx` (E): comparer Phrygian → Freygish (swap), comparer
      harmonic minor → Freygish (re-home, −7). Alias line for Ahava Rabbah /
      Hijaz / Spanish Phrygian. One sentence that maqam Hijaz on a piano is
      an approximation. Cross-link `/genres/klezmer`, klezmer history.
- [x] `UkrainianDorianLesson.tsx` (D): comparer Dorian → ♯4 (swap), comparer
      harmonic minor → re-home (−5). Sibling paragraph: same parent as
      Freygish, different home.
- [x] Loanwords: register `misheberakh` (verified Hebrew spelling, source
      cited in a comment) in `src/lib/words/registry.ts`; hunt a human clip
      per `.cursor/rules/pronunciation-audio.mdc`, otherwise no speaker;
      log the result there in the same change.
- [x] Cross-links: `usedIn: ["klezmer"]` on all three; klezmer `scales` in
      the genre registry; klezmer history article `scales`;
      `augmented-second` concept `scales` widened to include
      `harmonic-minor` and `ukrainian-dorian`.

Built 2026-09-11. As shipped, each page also re-homes onto its *sibling*
(freygish ↔ Ukrainian Dorian), the freygish page ends with a "what twelve
keys cannot show" section (♭7 / natural 6 below the root, Hijaz
intonation), and the Ukrainian Dorian page has a "tendency, not a law"
section on the interchangeable ♯4 / ♮4. `rootOffset` on `ComparerSide` is
how far the *other* scale's root sits above the page root (harmonic minor
on the freygish page = +5, on the Ukrainian Dorian page = +7).

### Phase 4 — fill the catalog

- [x] `natural-minor`, `major-pentatonic`, `dorian`, `lydian`, `locrian`,
      `melodic-minor` live (2026-09-12). Six lessons in the Phase 1–2 voice,
      six or seven sections each, classroom keys A / C / D / F / B / A so
      every white-key mode is white keys and the three minors line up on A.
      Comparers per the inventory plus one extra where the pair teaches
      more: natural minor gets both the parallel (A major → A minor, three
      swaps) and the relative (re-home to C); major pentatonic gets the
      subset (major − 4 − 7) and the re-home to A minor pentatonic; melodic
      minor gets harmonic → melodic (6th), major → melodic (only the ♭3),
      and the classical up/down pair as two runs — the copy states that
      every keyboard on the site uses the ascending (jazz) form. Locrian is
      candid that it is a colour and a chord scale, not a key. `dorian` →
      `?position=3`, `natural-minor` → `?position=4`. Reverse links:
      `folk-revival` genre ↔ natural-minor / dorian / major-pentatonic;
      `mode` concept lists all seven modes + natural minor; `tritone` →
      lydian, locrian; `pentatonic` → major-pentatonic; `augmented-second`
      → melodic-minor.
- [x] `NoteAt` grew an optional `degrees` prop: a note that belongs to the
      *other* scale in a comparison is spelled by that scale (Locrian's
      "lower the 5 (F♯)" — not G♭). Fixed the same latent misspelling on
      the Mixolydian, Phrygian, and Freygish pages. `ScaleComparer`'s swap
      caption pluralises ("3 keys go dark").
- [x] Alternate names on every row (`aliases`), searchable everywhere and
      indexable (2026-09-12; see status log). New rows must fill `aliases`
      — the assertion script checks each alias resolves to a name that is
      not the row's own and that any alias with a registered word has a
      native spelling.

### Phase 5 — follow-ons

- [x] `double-harmonic` (E, key-for-key from freygish): comparer freygish →
      double harmonic (swap, the 7th); the two augmented seconds played as
      a pair; the palindrome (1–3–1–2–1–3–1); an "About the name" section
      that files the Western nicknames against Hijaz Kar / Hicazkâr /
      Bhairav, with the Maqam World note that the Hijaz leap is "usually
      played smaller than notated". Sources: Marcus 1993, Maqam World jins
      Hijaz. Reverse link: `augmented-second` concept (2026-09-12).
- [x] `major-blues` (C): comparer major pentatonic → major blues (added
      ♭3), slide / lick buttons, comparer re-homed to A minor blues — the
      blues page's own keys. `usedIn: ["blues"]` ↔ blues genre `scales`;
      `blue-notes` concept lists it (2026-09-12).
- [x] **Detune layer** (built 2026-09-11, own commit before `rast`):
      `src/lib/music/detune.ts` — `DetuneMap` (12 cents, C = 0), presets
      (Rast C/G, Bayati D/G; Sikah/Saba share switches so aren't repeated),
      `applyDetune`, `centsSuffix` ("½♭" / "½♯" / "−40¢").
      `useAudioSynthesis` returns `detuneCents` / `setDetuneCents`; new
      voices get `osc.detune`, held voices retune live, `scheduleNote`
      looks up the switch from the nearest MIDI note so every run and
      comparer bends too; the Hz readout shows the bent pitch.
      `KeyboardV2` takes optional `detune` and renders `TuningStrip`
      (`src/instruments/synth/v2/TuningStrip.tsx`) under the keys —
      collapsed, off, green switch = on, bent keys read "E½♭". Live on
      `/synth/v2` and every lesson's main keyboard (comparers share the
      state but hide the strip). Catalog: `ScaleDegree.cents`,
      `hasQuarterTones`, `detuneMapFor(root, degrees)`; `spellDegrees`
      appends the suffix; group `maqam`; entry `rast` = `1 2 ½♭3 4 5 6 ½♭7`
      with −50 on 3 and 7. `ScaleLessonProvider` presses the switches for a
      quarter-tone scale and follows the root. Piano roll / concept demos
      pass no `detune` and are unchanged.
- [x] `rast` (C) on the detune layer (2026-09-12). Opens with the E and B
      switches pressed (provider does that for any scale with `cents`).
      `ScaleComparer` grew the **"same keys, bent pitch"** mode: when a side
      has quarter tones, selecting it presses `detuneMapFor(root, degrees)`
      on the page-wide strip and selecting the other side releases to
      `NO_DETUNE` — so flipping Major ↔ Rast visibly toggles the switches
      on the main keyboard; caption names the bent degrees ("½♭3 (E½♭), a
      quarter tone below the piano's E"). Pages with no quarter-tone side
      never touch the strip. Only one comparer per page may carry a
      quarter-tone side (they would fight over the strip) — the Mixolydian
      stand-in is prose + two run buttons instead. One-sentence caveat in
      section 5 (−50 ¢ is a setting; ~345–355 ¢ by region; Turkish Rast
      nearer a major third). Section 6: jins Rast + Nahawand on the 5th
      (the ♭7 descent), locked to the ascending form. Sources: Maqam World
      Rast, Abu Shumays "Maqam Analysis: A Primer", Marcus 1993.
- [ ] Synth deep link: once Synth v2 has the type selector
      ([synth-scale-type-selector.md](synth-scale-type-selector.md)
      Phase 4), every lesson gets a "Try it on the synth" link with
      `?scale=<root>-<typeId>` from the shared catalog.

### Phase 6 — Needs owner input

Decisions an agent must not make alone. Add to this list rather than
guessing; strike through with the date when answered.

- [x] ~~**Freygish lesson tone + structure sign-off**~~ — **approved as
      shipped** (2026-09-11). Later pages keep this voice: standalone
      framing, degree vocabulary introduced inline, one idea per section
      with the widget that plays it directly beneath.
- [x] ~~Harmonica cross-link surface~~ — **v2 only** (2026-09-11).
- [x] ~~**Rast**: ship a piano-approximation page at all?~~ — **Yes, and
      not as an approximation** (2026-09-11). Build it the way Arabic-market
      keyboards do: a 12-cell scale panel (C–B) above the keys; a lit cell
      detunes every key of that name (default −50 ¢, adjustable per cell,
      Korg Pa: ±99, Yamaha PSR-A: −64…+63); presets (Rast = E½♭ + B½♭,
      Bayati, Sikah, Saba) recall in one click. Lesson caveat is one
      sentence: the cents are a starting point; the pitch is learned by ear
      and varies by region (Syrian E½♭ ≈ 356 ¢, Egyptian ≈ 342 ¢ — Abu
      Shumays). Panel lives on **`KeyboardV2` everywhere**, collapsed, off
      by default. Catalog grows an optional per-degree `cents` field.
- [x] ~~**`dorian` timing**~~ — moot; shipped in Phase 4 (2026-09-12).
- [x] ~~**Stale `/lessons` scale slugs**~~ — **redirected** (2026-09-12).
      `Lesson.movedTo`: `scales` → `/scales/major-scale`, `scale-degrees`
      → `/scales/major-scale#degrees`. `/lessons/[slug]` renders
      `MovedLesson` — `permanentRedirect` in a static export only reaches
      the client router (empty HTML, no fallback), so the page carries its
      own `<meta http-equiv="refresh">`, a `router.replace` on hydrate, a
      visible link, and `noindex`. The `/lessons` hub card and global
      search link straight to the target with an "In Scales" badge
      instead of "Soon". Synth v2 learning
      panel links (`lessonSlug`) keep working through the redirect.
- [x] ~~**Promotion to production**~~ — owner asked for the Phase 4–6 work
      to go live (2026-09-12, "deploy to live app"). Still: a push only
      stages; promotion is a separate, deliberate `vercel promote`
      (see `.cursor/rules/deployment.mdc`). Future changes need a fresh
      go-ahead.

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
