# Plan: Yiddish / Jewish Music — Two Connected Tracks

## Overview

Two initiatives that share a corpus, a transliteration standard, and a legal
posture, so they're planned together:

- **Track A — Melody & notation dataset.** Ingest traditional Yiddish / Klezmer
  / Jewish *melodies* into our canonical song format so they can be played,
  transposed, and mapped in the app. This is note data.
- **Track B — "Learn Language Through Song" module.** A sibling explorable
  surface (a new route like `/songs` or `/learn`) where you pick a language,
  play a famous song with time-synced lyrics, toggle subtitle views
  (script / transliteration / translation), loop lines, tap words to drill into
  meaning, and read the song's history / cultural notes. This is *lyric + audio +
  meaning* data.

They're the same repertoire seen from two angles — Track A is the tune, Track B
is the song. Yiddish is the wedge for both: the composition/lyric corpus is
largely public-domain-as-composition and already lives in public databases, and
the interactive-lyrics space is essentially greenfield for Yiddish (LyricsTraining
/ Lingopie / Lyric Lingo serve major languages only). Rollout for Track B:
**Yiddish → Hebrew → open up** (both share the RTL + transliteration problem, so
solving one gets most of the other).

Both fit the Instrumaps thesis — *"Don't study theory. Play with it."* Here the
"map" is the song itself.

## Shared foundations (build once, both tracks use)

- **One corpus, two views.** The `SongEntry` identity from Track A (canonical
  title, aliases, genre/era, source refs, license) is also the anchor a Track B
  lesson hangs on. A song can have a melody `Setting` (Track A) *and* a
  `LyricLine[]` track (Track B) without duplicating identity.
- **YIVO transliteration everywhere.** Adopt YIVO romanization once (matches the
  DRJM / Freedman indexes) so titles, lyrics, and word glosses are consistent and
  cross-referenceable across both tracks.
- **Overlapping content sources.** Zemirot DB, Freedman (UPenn), and DRJM
  (UCLA/Milken) serve Track A as metadata and Track B as lyric/translation/notes
  reference. Yiddish-lyric-specific sources (YiddishSongsOnline / HebrewSongs.com,
  Yiddish Book Center, In Geveb) are primarily Track B (see Appendix B).
- **One licensing posture.** Recording and composition/lyric are *separate*
  copyrights. Track A leans on PD-as-composition melodies + embeds sidestep
  recordings for Track B; translations/transliterations from a DB have their own
  terms. Flag every item before ingest. (Details per track below.)
- **Same routing/content precedent.** New routes mirror `src/app/harmonica-lab/`
  and register in `src/lib/navigation.ts`; typed content-as-data mirrors the
  `docs/plans/lessons-module.md` approach (registry + per-item TSX/JSON). Not a
  monorepo — this is one Next.js app (`output: "export"`).

---

# Track A — Melody & notation dataset

Build the **first real corpus** for the song library by ingesting traditional
Yiddish / Klezmer / Jewish melodies into our canonical song format: a
batch-buildable dataset of clean, single-line melodies plus rich metadata
(canonical titles, transliterations, tune-variant mappings).

This is the concrete counterpart to the exploratory
[`docs/sketches/community-midi-library.md`](../sketches/community-midi-library.md)
pipeline: that sketch defines *how* we ingest (funnels → one `SongDocument`),
this defines *what* we ingest first and *why this repertoire*.

**Why this repertoire first**

- Mostly **traditional / public-domain** compositions — the cleanest legal path
  for a redistributable dataset (see Licensing below).
- The core source (`abcnotation.com`) is **text-based ABC**, batch-scrapable, and
  ships per-tune ABC + MIDI + MusicXML — structured, parseable note data at scale.
- It exercises the two funnels we most want anyway: **ABC parse** (exact) and
  **MIDI parse** (exact) — no ML, no fuzziness, deterministic output.
- It doubles as a schema stress-test: Jewish song repertoire is inherently
  "one text → many melodies" (z'mirot, niggunim), which forces the right data
  model early.

## Dependencies / prerequisites

- `SongDocument` canonical type in `src/lib/song/` — **does not exist yet.**
  Also needed by
  [self-hosted MIDI library](self-hosted-midi-library.md)
  (Piano Roll catalog + finder). Build the type once.
- ABC parsing (`abcjs`, MIT) and MIDI parsing (`@tonejs/midi`) — **not installed
  yet**. `@spotify/basic-pitch` is not in the app (removed with the Key
  Detector); re-add it only if we build the audio funnel. Not needed here.
- App is a **static export** (`output: "export"`, Vercel). The scraper/build step
  runs **offline as a Node script** (mirroring the existing `midi-extract.mts` /
  `midi-inspect.mts` tooling), emitting static JSON artifacts checked into the
  repo — not a runtime server feature.

If we don't want to block on the full sketch, Phase A1 can run as a **standalone
batch pipeline** that emits `SongDocument` JSON directly; the app consumes those
artifacts. No backend required to get a playable corpus.

## Phase A0 — Format & schema decisions (do first, it's cheap)

- [ ] Define/borrow `SongDocument` (from the sketch) in `src/lib/song/types.ts`.
- [ ] Add a **library-level** schema on top of a single document, informed by the
      Zemirot Database model (**one canonical text → many tune-settings**):
  - `SongEntry` — canonical identity: title (romanized + Hebrew/Yiddish script),
    aliases, genre/form tag (khosidl, sher, freylekh, hora, bulgar, sirba,
    niggun, z'miroth…), source refs, license status. **(Shared with Track B.)**
  - `Setting` — a specific melody/arrangement for that entry: a `SongDocument` +
    provenance (`abc` | `midi` | `musicxml`) + confidence (`1.0` for parses) +
    attribution + license.
  - Mirrors `songs → arrangements` from the sketch; seeded with a curated corpus
    instead of user uploads.
- [ ] Adopt **YIVO** transliteration up front (shared foundation).
- [ ] Store artifacts as committed JSON under `data/klezmer/` (static-export
      friendly — small, versionable, zero infra).

## Phase A1 — Core dataset: `abcnotation.com` Klezmer collection ← the main event

Source: John Chambers Klezmer collection (`trillian.mit.edu/~jc/music/abc/Klezmer/`),
ABC + MIDI + MusicXML + PNG per tune. `[FREE][OPEN-DATA]`, mostly traditional/PD.

- [ ] Add `abcjs` (+ `@tonejs/midi` for cross-checking) as dev deps.
- [ ] Write `scripts/scrape-klezmer-abc.mts` (sibling to `midi-extract.mts`):
  - [ ] Crawl the collection index, enumerate tune files (polite crawler:
        throttle, cache locally, respect `robots.txt`, one pass).
  - [ ] Keep the **raw ABC** verbatim alongside derived output (re-parseable later).
  - [ ] Parse each ABC tune → `SongDocument` (pitches, durations, key, meter, title).
  - [ ] Capture ABC header fields as metadata: `T:` title, `R:` rhythm/form,
        `K:` key, `M:` meter, `C:`/`Z:`/`S:` composer/source when present.
- [ ] Normalize titles → `SongEntry` (romanize, tag form from `R:`, dedup variants).
- [ ] Emit `data/klezmer/*.json` (one `SongEntry` per tune, or grouped) + a manifest.
- [ ] Smoke-test: load a handful into the synth playback path, transpose, verify
      they sound right (`npx tsc --noEmit` + a manual listen).

Target: hundreds of tunes as the **core parseable corpus**.

## Phase A2 — Metadata normalization & cross-referencing

- [ ] Use the **Zemirot Database** structure as the reference model for
      "one text → many melodies" (schema validation, not scraping).
- [ ] Use the **Freedman (UPenn)** and **DRJM (UCLA/Milken)** indexes as a
      **metadata reference** to normalize canonical titles, transliteration
      variants, and literary/Biblical references. **METADATA only** — their
      recordings are copyright; consume the *index*, not audio.
- [ ] Build an alias/variant map so `Freylekhs` / `Freylekh` / `Freilach` collapse
      to one `SongEntry`.

## Phase A3 — Clean single-line melodies from MIDI sources

- [ ] **Gan HaLev z'mirot** (`ganhalev.org`) — 4-voice MIDIs with **separate files
      per voice part**. Ideal for extracting a clean single melody line. `[FREE]`
- [ ] Parse via `@tonejs/midi` → `SongDocument` (provenance `midi`, confidence 1.0).
- [ ] Secondary hubs as gap-fill, per-item: Jewish Music WebCenter (index), Great
      Jewish Music, FreeSheetMusic.net folk/world page.

## Phase A4 — Gap-fill from notation exports (license-gated)

- [ ] **Free-scores.com** Jewish/Klezmer category and **MuseScore** MusicXML/MIDI
      exports — only where a per-item license check passes. User arrangements can
      carry their own copyright even on a PD tune.
- [ ] Each item: is the *composition* PD? is *this arrangement* separately
      copyrighted? Record the answer in the entry's `license` field; skip if unclear.

## Track A — ingestion priority (build order)

1. **Scrape `abcnotation.com` Klezmer collection** → `SongDocument`. ← core (A1).
2. **Adopt Zemirot DB structure** as the schema reference (text ↔ many melodies).
3. **Use Freedman / DRJM indexes** to normalize titles, transliteration, variants.
4. **Layer in Gan HaLev voice-part MIDIs** for clean single-line melodies.
5. **Fill gaps** from free-scores / MuseScore exports (per-arrangement license check).

---

# Track B — "Learn Language Through Song" module

> **Status:** exploration. Open decisions are marked **[DECIDE]** — direction,
> not a spec.

## Concept

Pick a language → play a famous song (audio + synced lyrics) → toggle subtitle
views → pause/scrub/loop freely → tap any line or word to drill into meaning,
transliteration, grammar, and song history / cultural fun-facts. Same spirit as
the instrument maps: take something people already love (music) and make it an
interactive, explorable surface — here the "map" is the song.

## Why it fits Instrumaps (adapted to this codebase)

- Ships as **its own route** (`/songs` or `/learn`) alongside the instrument
  routes, registered in `src/lib/navigation.ts`, mirroring `harmonica-lab`. *(The
  original sketch assumed a monorepo/packages — we're a single Next.js app, so
  "package" = a route + a `src/components/songs/` folder + typed content data.)*
- Reuses **shared UI, theming, and the general play/seek mental model**. Honest
  caveat: an MVP built on a **YouTube embed** drives playback through the
  **YouTube IFrame Player API** (`getCurrentTime` / `seekTo`), *not* our Web-Audio
  synth transport. The synth transport primitives only become directly reusable
  if/when we move to **self-hosted audio**. Don't assume the synth engine is the
  player on day one.
- Reinforces the brand as *the* place where music is interactive and educational.

## Positioning / differentiation

1. **Yiddish-first** — essentially greenfield; corpus/translations/transliterations
   already public. This is the wedge.
2. **The history / fun-facts layer** — existing apps nail listen + translate but
   treat songs as vocab drills, not cultural lessons. Differentiator regardless of
   language.

## Core UX loop (MVP)

- Song player: audio + **time-synced lyric lines** (karaoke-style active-line
  highlight).
- Subtitle toggle: **original script**, **transliteration**, **native-language
  translation**, and a **dual view**. Toggling must **not** interrupt playback.
- Frictionless **pause / replay-line / loop-section** — the single most important
  interaction for language learning.
- **Tap a word** → popover: meaning, root/transliteration, "save word" action.
- **Song info panel** → who wrote it, era, genre (klezmer / theatre / pop), what
  the references mean, why it matters.
- **Theory breakdown** → key, scale/mode, tempo, form — each concept a clickable
  chip that deep-links to the lesson explaining it (see below).

## The hard part: lyric ↔ audio sync

This is where the real engineering effort sits; everything else is UI over data.

- Lyrics need per-line (ideally per-word) timestamps to drive highlighting and
  line-looping.
- **[DECIDE]** timestamp production:
  - *Hand-authored timing* — accurate, slow, fine for a curated launch set.
  - *Forced-alignment / ASR-assisted* — scales better, messier for Yiddish/Hebrew.
- **[DECIDE]** audio source: **YouTube embed** (zero hosting/licensing burden, but
  the player constrains scrubbing/looping precision and styling) vs.
  **self-hosted audio** (full control, licensing + hosting burden). Recommend
  starting with embed to prove the loop; revisit if looping UX feels too limited.

## Data model (rough — extends the shared `SongEntry`)

- **Song** = the shared `SongEntry` + Track-B fields: `language`, `era`, `genre`,
  `source/embedRef`, `difficulty`, `history/notes` (rich text), `tags`.
- **LyricLine**: song ref, order, `start`/`end` timestamps, `originalText`,
  `transliteration`, `translation`. Optional word-level children for tap-to-define.
- **WordEntry / glossary** (optional at MVP): `lemma`, `gloss`, `notes` — can start
  as inline data before it becomes its own store.
- **SavedWord** (user): only if/when accounts exist — MVP is local/anon
  (localStorage).
- **TheoryFacts** (per song, and optionally per section): `key`, `scale`/`mode`,
  `bpm`, `timeSignature`, `form`, plus a list of `concepts` — each a
  `{ label, lessonSlug }` pair so a chip can link straight to its lesson. Derived
  from a Track-A melody `Setting` when one exists; hand-authored otherwise. Klezmer
  is a natural showcase here (freygish / Ahava Rabbah mode, augmented seconds).

## Theory breakdown layer (bridges Songs ↔ Lessons ↔ the parsed corpus)

The differentiator isn't just "translate the words" — it's **"understand the
music."** Each song exposes its theory as an explorable surface, and every concept
is a doorway into a deeper study page.

- **Surface the facts.** Show `key`, `scale/mode`, `bpm`, `time signature`, and
  `form` on the song page (mono font for the machine-precise readouts, per house
  style).
- **Every concept is clickable.** Tapping *"Phrygian"* (or *"freygish"*, *"hora"*,
  *"6/8"*) opens a drilldown that links to the matching lesson — e.g. the Phrygian
  chip deep-links to `/lessons/phrygian-mode` from
  [`docs/plans/lessons-module.md`](./lessons-module.md). This makes the two plans
  reinforce each other: songs are *where you meet* a concept, lessons are *where you
  study it*, and a "try it on the synth" link (already a lessons follow-on) closes
  the loop back to playing it.
- **Derive, don't retype.** When a song has a Track-A melody `Setting`, compute
  key / scale-candidates / tempo from the `SongDocument` (using `src/lib/music/`)
  rather than hand-entering — the parsed corpus *is* the theory source. Hand-author
  only what can't be derived (e.g. cultural form labels).
- **Honest links only.** A concept chip links out **only if** a lesson (or a
  stub) actually exists; otherwise it's plain text. No dead-end "coming soon" links.
  This gives a natural backlog: songs surface which lessons to write next.
- **Mode gap to flag:** `src/lib/music/scales.ts` covers major/minor/pentatonics/
  blues/the seven modes, but **freygish / Ahava Rabbah** (the signature Jewish/
  klezmer sound) may need adding there before it can be a lesson + chip. Track that
  as a shared dependency.

## Content sources to investigate (Track B)

- **YiddishSongsOnline / HebrewSongs.com** — volunteer-built searchable DB of
  Yiddish/Hebrew/Ladino songs with transliterations + translations. **Check terms
  of use before ingesting anything.**
- **Yiddish Book Center / In Geveb** pedagogy materials — curation of
  beginner-friendly songs.
- Plus the shared Tier-3 databases (Zemirot / Freedman / DRJM) for lyrics,
  metadata, and notes.
- **[DECIDE]** seed set: hand-pick **~10–15** well-known, clearly-enunciated songs
  for launch rather than bulk-importing. **Sync quality + notes > catalog size** at
  MVP.

## Track B — phasing

- **Phase B0 — spike.** One hardcoded Yiddish song, YouTube embed, hand-timed lyric
  lines, active-line highlight, tap-to-see-translation, pause + replay-line. Prove
  the sync + toggle loop *feels good*. No backend.
- **Phase B1 — MVP.** ~10 curated Yiddish songs, all subtitle toggle modes,
  line-loop, song-info panel, difficulty labels, mobile layout. Data as static JSON.
- **Phase B2 — depth.** Word-level tap + save, glossary, **theory breakdown layer**
  (concept chips → lesson deep-links; derive facts from Track-A `SongDocument`
  where present), **Hebrew added** (reuse RTL/translit work), optional light
  gamification (fill-in-the-blank). *Depends on lessons existing — see
  `lessons-module.md`; the two ship best in tandem.*
- **Phase B3 — scale.** Move data to a real store, add languages, consider auth for
  saved-word/progress, explore assisted alignment for faster onboarding.

  ⚠️ **B3 crosses the static-export inflection point.** Per
  [`docs/sketches/hosting-and-auth-direction.md`](../sketches/hosting-and-auth-direction.md),
  auth or a real DB means **dropping `output: "export"`** (Auth.js + Google, Neon +
  Drizzle). Keep B0–B2 fully static so nothing forces that move early.

## Track B — open decisions to resolve early

- **[DECIDE]** Route placement (`/songs` vs `/learn`) and folder layout under
  `src/app/` + `src/components/songs/`.
- **[DECIDE]** YouTube embed vs. self-hosted audio for MVP (drives whether the
  synth transport is reused).
- **[DECIDE]** Timestamp authoring approach (hand vs. assisted alignment).
- **[DECIDE]** RTL + transliteration rendering strategy — affects component design
  from day one; solve for Yiddish so Hebrew comes cheap.
- **[DECIDE]** Static JSON vs. backend at MVP (recommend static through B2).

## Track B — first task for the coding agent

Stand up **Phase B0**: a single route rendering one Yiddish song with a YouTube
embed, a hardcoded array of timestamped lyric lines, active-line highlight synced
to playback (via the YT IFrame API's current-time polling), a subtitle-mode toggle
(original / transliteration / translation), and a pause + replay-current-line
control. No backend. Goal: feel the core loop end-to-end.

---

## Licensing guardrails (first-class, both tracks)

Encode as rules the pipeline enforces; stamp every `Setting` / `Song` with a
`license` verdict. **Two separate copyrights exist: the recording and the
composition/lyric.**

- **Traditional melodies** (folk tunes, z'mirot, most klezmer standards,
  Proverbs-based texts like Eishet Chayil) = **PUBLIC DOMAIN as compositions** →
  safe to ingest melody/notation (Track A).
- **Specific arrangements & modern composed settings** (Shwekey, Carlebach-era,
  named composers, art songs) can be **copyright even when the base tune/text is
  PD** → per-item check; default to *skip* when unsure.
- **Audio recordings are almost always copyright** regardless of tune age. Track A:
  use archives (Freedman, Mayrent, Milken, DRJM) for **METADATA/reference only**.
  Track B: a **YouTube embed sidesteps recording *hosting*** but the song is still
  someone's recording — embedding ≠ ownership; prefer official uploads.
- **Lyrics, translations, and transliterations are separately owned.** DB-sourced
  translations/transliterations (YiddishSongsOnline, etc.) have their own terms —
  flag before ingest; author our own when terms are unclear.
- **ABC + traditional MIDI collections are the cleanest legal + technical path** —
  which is why Track A phase A1 leads.
- Paid sources (Tier 5) are **out of scope** for the ingestable corpus; note only
  as licensed-arrangement references.

## Relevant existing files / tooling

| Purpose | Path |
|---------|------|
| Ingestion pipeline sketch (Track A parent) | `docs/sketches/community-midi-library.md` |
| Hosting/auth inflection (Track B3) | `docs/sketches/hosting-and-auth-direction.md` |
| Content-as-data + route precedent | `docs/plans/lessons-module.md`, `src/app/harmonica-lab/` |
| Theory drilldown targets (concept chips link here) | `docs/plans/lessons-module.md` (`/lessons/[slug]`) |
| Scale/mode theory + detection (derive facts) | `src/lib/music/scales.ts` (add freygish / Ahava Rabbah) |
| Nav registration | `src/lib/navigation.ts` |
| Existing MIDI tooling to mirror (Track A) | `midi-extract.mts`, `midi-inspect.mts` |
| Music theory / transpose (playback) | `src/lib/music/` |
| Audio funnel (not installed; re-add if needed) | `@spotify/basic-pitch` |
| To create (Track A) | `src/lib/song/types.ts`, `scripts/scrape-klezmer-abc.mts`, `data/klezmer/` |
| To create (Track B) | `src/app/(songs\|learn)/`, `src/components/songs/`, `data/songs/*.json` |

## Suggested first milestones

- **Track A:** Phase A0 + a thin slice of A1 — scrape ~20 abcnotation Klezmer tunes
  into `SongDocument` JSON and play one in the synth. Proves ABC → document →
  playback end-to-end.
- **Track B:** Phase B0 — one Yiddish song, YouTube embed, hand-timed lines,
  highlight + subtitle toggle + replay-line. Proves the sync/toggle loop *feels*
  right before scaling content.

The two are independent — either can go first. They **converge** at the shared
`SongEntry` schema (decide it once, in A0, with Track B fields in mind).

---

## Appendix A — Melody / notation source list (Track A)

Tags: `[FREE]` `[PAID]` `[OPEN-DATA]` | Formats: MIDI, MusicXML, ABC, PDF, AUDIO, METADATA

### Tier 1 — Machine-readable notation (best for building a DB)

- **abcnotation.com** — John Chambers Klezmer collection `[FREE][OPEN-DATA]`
  - <https://abcnotation.com> (search "Klezmer")
  - Base collection: <http://trillian.mit.edu/~jc/music/abc/Klezmer/>
  - Formats: ABC + MIDI + MusicXML + PNG downloadable **per tune**.
  - Hundreds of klezmer tunes (khosidl, sher, freylekh, hora, bulgar, sirba…).
  - **Single most valuable source — text-based, batch-scrapable, mostly
    traditional/PD. Start here.**
- **MuseScore** `[FREE tier + PAID]` — <https://musescore.com> (search "klezmer",
  "eishes chayil", "yiddish", "niggun"). MusicXML + MIDI + PDF. User-arranged;
  quality varies; individual arrangements can carry their own copyright.
- **Free-scores.com** — Jewish/Klezmer category `[FREE]`
  - <https://www.free-scores.com/free-sheet-music.php?CATEGORIE=130&genre=Jewish+-+Klezmer>
  - PDF + MP3 + MIDI where available. ~27+ pieces.

### Tier 2 — MIDI libraries (ready-made MIDI, less structured)

- **Jewish Music WebCenter** — MIDI Libraries directory `[FREE]`
  <http://jmwc.org/online-music-midi-libraries/> — curated hub / best index.
- **Great Jewish Music** — MIDI Files `[FREE]` <https://greatjewishmusic.com/Midifiles/>
  MIDIs + lyrics + translations + karaoke, organized by holiday.
- **Gan HaLev** — Zmirot MIDI collection `[FREE]`
  <http://www.ganhalev.org/zmirot/zmirot.html> — 4-voice polyphonic MIDIs with
  **separate files per voice part**. **Good for isolating clean single melody lines.**
- **MIDI DB** — Jewish & Hebrew `[FREE demos / PAID pro]`
  <https://www.mididb.com/genres/jewish-midi/> — Hava Nagila, Bashana Haba'ah, etc.
- **FreeSheetMusic.net** — folk/world page `[FREE]`
  <https://www.freesheetmusic.net/Folk2.html> — large Israeli/Yiddish/Hebrew MIDI
  library + Yiddish song archive (100+ lead-sheet PDFs w/ lyrics).
- **BitMidi** `[FREE]` <https://bitmidi.com> (search titles; in-browser preview)
- **FreeMidi.org** `[FREE]` <https://freemidi.org>

### Tier 3 — Song databases (lyrics, metadata, multiple tune settings) — shared w/ Track B

- **Zemirot Database** `[FREE]` <https://www.zemirotdatabase.org> — structured by
  song; multiple recorded tune-settings side by side, Hebrew + transliteration +
  translation. **Good model for "one text → many melodies."**
- **Robert & Molly Freedman Jewish Sound Archive (UPenn)** `[FREE][METADATA]`
  <https://www.library.upenn.edu/collections/notable/freedman> — 35,000+ trilingual
  indexed entries. Recordings mostly copyright; the **index** is a world-class
  metadata reference for titles/variants/refs.
- **DRJM / Database of Recorded Jewish Music (UCLA Milken)** `[FREE][METADATA]`
  <https://milkenjewishmusiccenter.schoolofmusic.ucla.edu/drjm-archival-collections/>
  — aggregated recording metadata; YIVO transliteration scheme.
- **Milken Archive of Jewish Music** `[FREE audio + articles]`
  <https://www.milkenarchive.org> | <https://www.milkenarchive.org/resources/useful-links/>
- **Chabad.org** — Eshet Chayil (reference recording) `[FREE][AUDIO]`
  <https://www.chabad.org/multimedia/media_cdo/aid/265772/jewish/Eshet-Chayil.htm>

### Tier 4 — Academic / archival (audio + scholarship; reference, not scores)

- YIVO Institute for Jewish Research — <https://yivo.org> (transliteration standard)
- Mayrent Collection of Yiddish Recordings (UW-Madison) — 9,000 digitized 78rpm discs
- Dartmouth Jewish Sound Archive — restored Yiddish theater/vaudeville/cantorial
- The KlezmerShack — <https://klezmershack.com/klezlinks.html> (klezmer link hub)
- Library of Congress National Jukebox — early-20thC US commercial recordings

### Tier 5 — Paid (modern arrangements w/ MIDI included) — out of ingest scope

- **JewiSheetMusic.com** `[PAID]` <https://jewisheetmusic.com> — PDF + MP3 + MIDI
  (chord version) per song. Modern arrangements (e.g. Shwekey).
- **Hit Trax MIDI Files** `[PAID]` <https://www.midi.com.au> — licensed, DAW-ready.
- **Jacob Spike Kraus / Steve Cohen Music / individual artists** `[PAID]` —
  contemporary settings, lead sheets.

---

## Appendix B — Learn-Through-Song lyric/pedagogy sources (Track B)

- **YiddishSongsOnline / HebrewSongs.com** — volunteer-built searchable DB of
  Yiddish/Hebrew/Ladino songs with transliterations + translations. **Check terms
  of use before ingesting.**
- **Yiddish Book Center** — pedagogy + digitized materials for song curation.
- **In Geveb** — journal of Yiddish studies; pedagogy materials for choosing
  beginner-friendly songs.
- Shared Tier-3 databases above (Zemirot / Freedman / DRJM) for lyrics, metadata,
  literary/Biblical references, and song notes.
- Audio for the player at MVP = **YouTube embeds** (prefer official/rights-holder
  uploads); revisit self-hosted audio only if the looping UX demands it.
