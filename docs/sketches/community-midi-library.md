# Plan Sketch: Universal Song Ingestion → Community MIDI Library

> Status: **sketch / exploration** — not committed work and **not a decided
> direction**. Phases, orderings, and tech picks below are options to think
> with, not a chosen path. The "Research findings" section near the bottom
> records what we've learned about the space so far; treat those as neutral
> observations, not conclusions.

## The problem

We don't want to host and hand-process a song library ourselves. Instead:

1. **Users bring the songs.** Anyone can funnel music into the system through
   whatever form they have it in — a MIDI file, ABC text, MusicXML, a PDF of
   sheet music, an audio file, a recording of themselves playing.
2. **The system converts it once.** Every funnel converges on the same
   internal representation.
3. **The result gets databased.** Once *anyone* has run "song X" through the
   system, its MIDI/note data is available to everyone after them.
4. **The community curates.** Multiple arrangements per song, ratings,
   in-browser editing, revision history — a Wikipedia for MIDI tracks.

The synth app we already have becomes the *player and editor* sitting on top
of this library: any song in the library can be played on our synth, in any
key, with keys lighting up, harmonica positions suggested, etc.

## The core architectural bet: one canonical format

Everything hinges on defining a **canonical song document** early. Suggested
shape (JSON, MIDI-compatible, versionable):

```ts
interface SongDocument {
  meta: {
    title: string;
    artist?: string;
    key?: string;          // detected or user-set, e.g. "G major"
    tempo?: number;        // BPM
    timeSignature?: string;
    provenance: "midi" | "abc" | "musicxml" | "audio" | "omr" | "manual";
    confidence?: number;   // transcription funnels are fuzzy; parsing is exact
  };
  tracks: {
    name: string;
    instrumentHint?: string;
    notes: {
      midi: number;        // pitch as MIDI number
      start: number;       // seconds (or ticks + PPQ, decide once)
      duration: number;
      velocity: number;
      pitchBend?: number[];
    }[];
  }[];
}
```

Rules:

- **Every ingestion funnel is an adapter** that outputs `SongDocument`.
  New funnels never touch playback, editing, storage, or export code.
- **Keep the original upload** alongside the converted document (re-run
  better converters later without asking users to re-upload).
- **Tag provenance + confidence.** A parsed MIDI file is exact; an
  audio transcription is a guess. The UI and the rating system should know
  the difference.
- `.mid` **export is a derived view** of the document, not the source of
  truth (MIDI loses information we may want, e.g. named sections, lyrics).

---

## Phases (lowest-hanging fruit → hardest)

### Phase 0 — Canonical format + play it on our synth (client-only)

*No backend, no accounts, works on current Netlify static hosting.*

- Define `SongDocument` in `src/lib/song/` (types + helpers).
- **Funnel 1: MIDI file upload** via `@tonejs/midi` — the true lowest fruit:
  deterministic, tiny library, zero ML, instant gratification.
- **Playback engine**: schedule `SongDocument` notes through the existing
  synth (`src/instruments/synth`) — this is also the foundation for the
  chord-play and recording ToDo items.
- **Transpose to any key** using existing `src/lib/music` — this alone
  delivers the long-standing "play song in any key" ToDo for anyone who has
  a MIDI file.
- Persist recent songs in localStorage/IndexedDB.
- Export back to `.mid`.

Effort: small (days). Value: the whole vertical slice exists end-to-end.

> **Early experiment we want to try from the jump (parallel to the phases):**
> publish the existing personal catalog of MIDI tracks we already have as a
> first *public* set — a cheap way to stand up a real (if tiny) library,
> exercise the player/viewer, and learn what "public catalog" actually
> requires, without waiting for the full community backend. Open question:
> what's the lightest hosting for this (static JSON + files vs. a real DB),
> and which of those tracks are safe to make public (see legal findings).

### Phase 1 — More input funnels (still client-only)

Each funnel is an adapter → `SongDocument`. Ordered by ease:

1. **ABC text paste** (`abcjs`, MIT) — compact text format, huge folk/trad
   repertoire freely available, parses client-side. Great fit for Harmonica
   Lab audiences.
2. **MusicXML upload** — every notation app (MuseScore, Finale, Sibelius)
   exports it. Parse client-side (JS parser) or via a small serverless
   function running `music21`.
3. **Audio file / mic → notes** via `@spotify/basic-pitch` — not in the
   app today (removed with the Key Detector). Re-add the package if/when
   this funnel ships. Works best on solo instrument / clear melody; tag
   `confidence` accordingly and say so in the UI.

Also in this phase: a simple **song viewer** (piano-roll or VexFlow staff)
so users can see what came out of a funnel before playing it.

Effort: medium (weeks, incremental — each funnel ships separately).

### Phase 2 — "We database that song" (first backend)

The moment the library becomes shared, we need infrastructure the current
static Netlify setup doesn't have:

- **Decisions to make:** hosting (stay Netlify + functions, or move to
  Vercel), database (Postgres via Neon/Supabase — Supabase bundles auth +
  storage which covers most needs in one service), auth (email/OAuth).
- **Data model:** `songs` (identity: title/artist, dedup key) →
  `arrangements` (a `SongDocument` + provenance + author) → `revisions`
  (edit history per arrangement).
- Users save **private** arrangements first (lower moderation/legal stakes),
  with a "make public" flag coming in Phase 3.
- Store the original uploaded file (object storage) + the canonical JSON (DB).
- Dedup/lookup: "song already in library" check before reprocessing.

Effort: medium-large (the work is product plumbing, not audio code).

### Phase 3 — The Wikipedia part (community layer)

- **Public arrangements**, multiple per song, listed on a song page.
- **Ratings/votes** per arrangement (quality signal; surfaces the best
  version of "song X" — this is the user's "upload the quality" idea).
- **In-browser editor**: piano-roll editing of `SongDocument` (fix wrong
  notes from audio transcription, adjust timing). Every save = a revision.
- **Revision history + diffs** (note-level diffing is feasible since the
  document is structured JSON).
- **Moderation basics**: report button, takedown flow, contributor
  reputation later.

Effort: large. This is a product in itself — only worth it if Phases 0–2
show real usage.

### Phase 4 — Hard funnels (the expensive entrances)

- **PDF / scanned sheet music (OMR)**: wrap **Audiveris** server-side
  (scan → MusicXML → existing Phase 1 funnel). Accuracy will require the
  Phase 3 editor for human cleanup — which is exactly the wiki model:
  machine does a rough pass, community fixes it.
- **Full-mix audio**: **Demucs stem separation** (in-browser ONNX or
  server-side) → per-stem basic-pitch → merged multi-track document.
- **URL ingestion (YouTube/etc.)**: a funnel we *do* want to keep on the
  table — the open problem is finding a **creative, legally-safe way** to
  offer it. Finding so far: naive bulk-downloading of platform audio runs
  against platform ToS (and the composition-copyright issues in the legal
  findings). Unexplored angles to research, not conclusions: user-initiated /
  client-side capture, "bring your own audio you have rights to," official
  platform APIs, or user-provided links that never get server-side
  downloaded. Needs its own research pass.

Effort: large, per-funnel. Each one reuses the entire existing pipeline.

### Phase 5 — Ecosystem (someday)

- Public read API / embeds ("play this arrangement on synth-v01").
- Deep Harmonica Lab integration (song → best harp key/position).
- MIDI-out to hardware (pairs with the Web MIDI ToDo item).
- LLM layer: "find me an easy arrangement of X in a key I can sing."

---

---

## Research findings (living notes — observations, not conclusions)

> Recording what we've learned about the space so far. These are inputs to
> future decisions, not decisions. Everything here should be re-verified and
> expanded as research continues.

### Legal landscape (context, not legal advice)

- **Two separate copyrights** exist in recorded music: the **sound recording**
  (the master) and the **musical composition** (the notes/melody/publishing).
  A MIDI transcription reproduces the *composition*, not the master — so the
  composition/publishing right is the relevant one.
- A MIDI transcription/arrangement is generally a **reproduction and/or
  derivative work of the composition**, implicating §106 rights (reproduce,
  make derivatives, distribute). Same legal bucket as sheet music and tabs.
- The **§115 compulsory mechanical license does not cleanly cover this**: it
  covers distributing *audio phonorecords*, explicitly does **not** authorize
  changing the melody/character (derivatives), and does **not** grant print
  rights. The Harry Fox Agency states it "cannot authorize the creation of
  derivative works." So there's no easy blanket license for MIDI-as-score.
- **Precedent:** in 2006 the NMPA/MPA sent cease-and-desist waves at tab sites
  on the §106 derivative-works theory; several (MXtabs, Taborama) shut down.
  Fair-use arguments were raised but **never won a clear court ruling** — the
  question remains untested.
- **The path survivors took** (MuseScore.com, Ultimate Guitar / Muse Group):
  negotiate blanket publisher licenses (Hal Leonard, Sony/ATV, Harry Fox
  umbrella), pay royalties, block/geofence what they can't license, and run
  DMCA notice-and-takedown for user uploads. It's a licensing-business path as
  much as a software one.
- **Relative risk observed:** private/per-user processing appears lower-risk
  than public redistribution; public-domain / traditional-folk / CC /
  user-original content is the lowest-risk material to build on. Real counsel
  needed before anything copyrighted goes public.

### Existing services & market

- **Community-versioned notation libraries** already exist: **MuseScore.com**
  (millions of user scores, MusicXML/MIDI I/O, licensed catalog) is the
  closest existing thing to the "Wikipedia for MIDI" idea; **Ultimate Guitar**
  is the tab/chord equivalent. Both are licensed, walled catalogs.
- **Multi-funnel AI transcription is productized**: **Klangio (klang.io)**
  does audio + YouTube + scanned-sheet (OMR) → MIDI/MusicXML/PDF/GuitarPro,
  with an edit mode, multi-instrument support, and a **developer REST API**.
  **La Touche Musicale** offers audio/YouTube → MIDI/XML/PDF with a
  learn-to-play angle and a large user community. **Samplab** (audio→MIDI +
  stems) is **shutting down (Sept 2026)** — a signal this market is hard.
- **Cost signal (needs verification):** turnkey transcription APIs like
  Klangio have been observed to be expensive at the pricing tiers looked at
  so far. Not yet validated in detail; pricing/limits should be re-checked
  before ruling anything in or out.

## Open questions / directions to explore (not decisions)

- **Build-vs-buy "sweet spot":** the interesting unexplored middle is going a
  layer *below* the expensive turnkey services — e.g. wiring up lower-level
  or open models/APIs ourselves and assembling something similar to what they
  offer, to control cost. Tension to hold: doing this well historically
  assumes deep ML/DSP specialization, which we don't want to require. The
  research goal is to find where that sweet spot actually sits (which parts
  are commodity/open vs. which parts are genuinely hard), **not** to conclude
  build-your-own now.
- **YouTube/URL ingestion, safely:** keep it as a wanted funnel; research a
  creative + legally-defensible mechanism (see Phase 4 note).
- **Anchor research to a real in-app use case.** Findings above stay
  theoretical until tied to a concrete feature in *this* app. The next
  research passes should each be driven by a specific use case (e.g. "play my
  own MIDI catalog on the synth in any key"), so exploration leans toward a
  direction with a real application rather than surveying in the abstract.

## Tentative design instincts (not decisions — revisit freely)

1. **Funnel-agnostic core.** Adapters in, one format, everything else built once.
2. **Ship a vertical slice per phase.** Phase 0 alone (MIDI upload → play in
   any key on our synth) is a complete, useful feature.
3. **Fuzzy funnels need the editor.** Audio/OMR output is a draft; the
   community-edit loop is what turns drafts into a quality library.
4. **Client-side first.** Free hosting, zero marginal cost, privacy-friendly.
   Add servers only when sharing requires them.
5. **Provenance always visible.** Users should know if they're playing an
   exact MIDI parse or a machine's guess at an audio file.

## Possible next steps (only if/when we choose to start)

1. Create `src/lib/song/` with the `SongDocument` types.
2. Add `@tonejs/midi`, build the MIDI-upload adapter.
3. Build the scheduler that plays a `SongDocument` through the existing synth.
4. Wire transpose (already exists in `src/lib/music`) into playback.
