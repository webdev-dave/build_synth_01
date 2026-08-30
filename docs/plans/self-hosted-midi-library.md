# Plan: Self-Hosted MIDI Library + Agentic Song Finder

**Status:** planning (first concrete slice of the community-MIDI sketch)
**Date:** 2026-08-30
**Surface:** Piano Roll (`/midi-lab`, currently beta)

> ⚠️ **Not legal advice.** Hosting or redistributing MIDI of copyrighted pop
> songs is the same legal bucket as tab sites and unauthorized sheet music
> (see Legal posture). Phases 0–2 ship on public-domain / Creative Commons /
> user-private files. The agent that *finds* pop MIDI, and the step that
> *stores a chosen file for other users*, stay behind an explicit legal gate.

---

## Overview

Stand up **our own MIDI library** so a user can load a popular song into the
Piano Roll, hear it, edit it, and play with it — the Instrumaps version of
"don't study the chart, mess with the notes."

Two layers, one destination:

1. **Library (ours).** Songs we've already resolved — title + artist + one or
   more arrangements — load instantly into the roll. This is the self-hosted
   catalog.
2. **Finder (agentic, experimental).** If we don't have it yet, the user asks
   by **song name + artist**. An agent searches a **allowlisted set of MIDI
   resources first (~75% of effort)**, then may try the open web (~25%). It
   returns a shortlist the user can cycle, listen to, and try on the roll.
   When they pick a preferred version, **we store that choice** so the next
   person doesn't repeat the hunt.

This is the productized use case that the
[`community-midi-library` sketch](../sketches/community-midi-library.md) was
missing: not "every possible ingestion funnel," but **request a song → play it
on the roll → keep the good one.**

Klezmer / Yiddish ([`klezmer-yiddish-dataset.md`](klezmer-yiddish-dataset.md))
stays a *corpus* plan (PD folk melodies we curate). This plan is the *library
+ finder* for whatever the user asks for. Both should share `SongDocument` so
we don't grow two song formats.

---

## Why the Piano Roll is the right home

The roll is already a bidirectional instrument: paint notes, hear them, edit
duration, lock to a scale. Loading a real song into that same surface is the
honest version of a "MIDI library" — not a download dump, a playground.

The current roll is a **melody sketchpad** (hero-tune range C4–C5, 8 bars,
`timebase` in eighths). Full songs will force it to grow (pitch range, length,
track picker). That's a feature: the library makes the roll a real editor.

---

## Current state (verified 2026-08-30)

| Piece | State |
|-------|--------|
| Piano Roll UI | Lives at `/midi-lab`; home widget + hamburger; **Beta**. |
| Playback | Web Audio via `useHeroAudio` / `noteAt`. Consent-on-gesture already followed. |
| MIDI parse | `@tonejs/midi` is a dependency; only used in `analyze_midi.ts`, not in the app. |
| Canonical song type | `src/lib/song/` **does not exist**. Sketch proposes `SongDocument`. |
| Backend / DB / auth | None. App is `output: "export"` (static). Adding a shared library means dropping that — see hosting sketch. |
| Shared catalog | None. No `public/midi/` seed set. |
| Agent / search | None. |

Piano-roll limits that this plan has to break (or the library will feel
broken):

- `melodyConvert.ts` only maps **C4–C5**. Pop MIDI is 21–108.
- Default view is **13 notes × 8 bars**. Songs need a track picker, dynamic
  length, and a usable piano range (or a "melody track only" extract).
- Multi-track files (melody / chords / bass / drums on ch. 10) will dump as
  noise unless we pick a track before loading.

---

## Product principles (Instrumaps-shaped)

- **Play it, then keep it.** The unit of work is "I heard this version on the
  roll and I want it," not "the agent decided this is canonical."
- **Provenance is visible.** Every candidate shows source, license tag, and
  whether it's from our allowlist or the open web. A found file is not a
  blessed file.
- **Allowlist first.** 75% of search budget on sources we named and can
  reason about; 25% is a bonus pass, clearly labeled, never auto-promoted.
- **Cache the human choice, not the scrape.** We persist an arrangement
  *after* a user picks it — and only when the legal gate for that class of
  work is open.

---

## Legal posture (gate, not a vibe)

Two copyrights in recorded music: the **master** and the **composition**. A
MIDI file is a transcription of the *composition*. Redistributing MIDI of
still-in-copyright pop is the same theory that shut down tab sites in the
2000s. MuseScore / Ultimate Guitar survived by **licensing publishers**, not
by being a better scraper. Full notes:
[`community-midi-library.md` → Research findings](../sketches/community-midi-library.md).

**What we will do without waiting on counsel**

- Public-domain and CC-licensed MIDI we can actually point at a license.
- User-uploaded files that stay **private to that browser / account**.
- In-session *preview* of a candidate the user asked the finder to fetch
  (search-engine-shaped: we didn't put it in the catalog).

**What stays gated (Phase 4+ / lawyer)**

- Saving a copyrighted pop arrangement into **our shared DB for other
  users**. That is redistribution.
- Crawling sites whose ToS forbid bulk download (typical of "free MIDI of
  hits" directories).
- Treating "the agent found a `.mid`" as permission to host it.

**Safer persistence options if we want "remember this song" before licenses
exist** (pick one when Phase 3 lands; don't invent a fourth):

| Option | What we store | Risk |
|--------|----------------|------|
| **A. License-clean only** | Bytes + metadata iff PD / CC / user-original | Lowest. Pop songs wait. |
| **B. Pointer, not bytes** | Canonical title/artist + source URL + content hash; re-fetch at play time | Still a copy when we fetch; ToS of the source still applies. |
| **C. Licensed catalog** | Bytes we have a publisher/blanket right to host | MuseScore-shaped business; out of scope until we mean it. |

Default until a decision: **A** for the shared library, **preview-only** for
everything else.

---

## Architecture

```
User: "Yesterday — The Beatles"
        │
        ▼
┌───────────────────┐     hit?      ┌──────────────────────────┐
│  Library lookup   │────────yes───▶│  Load arrangement        │
│  (our DB / seed)  │               │  into Piano Roll         │
└─────────┬─────────┘               └──────────────────────────┘
          │ miss
          ▼
┌─────────────────────────────────────────────────────────────┐
│  Finder agent  (budget: 75% allowlist / 25% open web)       │
│    tools: search_allowlist, fetch_midi, parse_midi,         │
│           search_open_web, rank_candidates                  │
└─────────┬───────────────────────────────────────────────────┘
          ▼
┌───────────────────┐     user picks     ┌────────────────────┐
│  Candidate tray   │───────────────────▶│  Persist (if gate  │
│  cycle / listen   │                    │  allows) + reload  │
└───────────────────┘                    └────────────────────┘
```

**Canonical format.** One `SongDocument` (from the sketch) is the in-app
truth. `.mid` is an interchange format: parse on the way in, export on the
way out. Adapters never talk to the roll directly.

**Where files live**

- Phase 0: a handful of PD files under something like `public/midi/` plus
  JSON metadata. Fine for a seed; not a library.
- Phase 3+: **object storage** (R2 / S3 / Supabase Storage) for bytes,
  **Postgres** for identity, arrangements, votes, provenance. Do not commit
  a growing MIDI dump to git.

**Static export.** The finder, the shared DB, and any agent run **cannot**
ship under `output: "export"`. Phase 0–1 stay client-only so we can build
the roll/library UX first. Phase 3 is the inflection the hosting sketch
already named: drop the export, add a server.

---

## Allowlisted resources (~75%) vs open web (~25%)

The allowlist is a **named, versioned config** (`src/lib/midi-library/sources.ts`
or equivalent), not a prompt the model gets to improvise. Each entry has:
id, base URL, adapter type (`api` | `known-paths` | `search-on-site`),
license expectation, robots/ToS notes, and a `enabled` flag.

Re-verify ToS/robots before turning any adapter on. This table is a
**candidate set**, not permission to scrape.

### Allowlist candidates (spend most of the budget here)

Prefer official APIs and collections that already tag licenses:

| Source | Why it's on the list | Typical repertoire | Adapter sketch |
|--------|----------------------|--------------------|----------------|
| [Mutopia Project](https://www.mutopiaproject.org/) | Explicit PD/CC classical | Bach, Chopin, etc. | Known catalog / search |
| [Wikimedia Commons](https://commons.wikimedia.org/) (MIDI) | Machine-readable licenses | Mixed, license per file | Commons API |
| [Internet Archive](https://archive.org/) MIDI items | Item-level rights metadata | Mixed collections | IA search API |
| [The Session](https://thesession.org/) | JSON API, folk/trad, CC-BY-NC | Jigs, reels, airs | Official JSON |
| [abcnotation.com](https://abcnotation.com/) | Already the klezmer source | Folk / trad | ABC → MIDI / `SongDocument` |
| [KernScores](https://kern.humdrum.org/) | Scholarly, mostly PD | Classical / folk | Humdrum / MIDI export |
| BitMidi (if ToS allows) | Large public `.mid` index | Mixed; **license per file is messy** | Site search only if permitted |
| MuseScore **official API** (if we get access) | Licensed scores, MIDI export | User + licensed catalog | API; **no HTML scrape** |

**Not allowlist** (do not write adapters): random "download MIDI of [hit
song]" directories, leaked DAW stems, sites that wrap files in ad-gates or
forbid automated access.

### Open-web pass (~25%)

A bounded bonus: web search for `"{title}" "{artist}" midi`, then fetch only
if the URL looks like a direct `.mid` / known notation export. Results are:

- Capped (see budget below).
- Badge: **"found on the open web — preview only."**
- Never written into the shared library by the agent. Only a later human
  pick + legal gate can promote them.

If the allowlist already returned ≥ N decent candidates, **skip** the open
web pass. The 25% is "we didn't find it," not "always also rummage."

### Search budget (make the 75/25 real)

Per request, hard caps (tweak in config, not in the prompt):

| Budget | Allowlist | Open web | Notes |
|--------|-----------|----------|--------|
| Source queries | 6 | 2 | Adapter calls / search hits |
| Files fetched + parsed | 8 | 2 | Parse failures don't count as "found" |
| Candidates shown to user | up to 5 total | at most 2, and only if allowlist < 3 | Ranked, not dumped |

Agent loop: spend allowlist budget to completion (or until 3+ parseable
hits), then optionally spend the open-web remainder. Do not interleave in a
way that burns 50/50.

---

## Agent design (experimental)

This is **agentic product software**, not a Cursor coding agent. Lean:

- **Vercel AI SDK** (provider-agnostic; hosting sketch already wants this)
  with tool calling.
- Run in a **server function or background job** (Inngest / Trigger.dev /
  similar). A "find Yesterday" search can take tens of seconds; don't block
  a serverless timeout on a naive `await`.
- Tools are boring and typed: `searchSource(sourceId, query)`,
  `fetchMidi(url)`, `parseMidi(bytes)` → summary stats, `rankCandidates(...)`.
  No "write a scraper" tool. No unrestricted browse.

**Ranking heuristics** (explain in the UI, don't hide them):

- Title/artist string match
- Allowlist prior (boost) vs open-web (penalty)
- Parse quality: has a pitched track, not drums-only; duration in a sane
  range; note count not empty / not a 200k-event dump
- Track structure: a plausible melody track we can solo
- License tag if present

**What the user sees:** a tray of 2–5 cards. Each: source badge, duration,
track count, license, Play preview (10–20s or first phrase), **Load on
roll**, **Skip**. Spacebar still toggles playback on the roll.

**Failure mode:** "We don't have this and the finder came up empty" + a
local **Upload a .mid** affordance. Never invent notes to fake a hit.

Cost control: one finder request per user per N minutes while experimental;
cache lookups by normalized `(title, artist)` so the second user of the
same query hits the library or a "pending / empty" result, not a fresh
crawl.

---

## Data model (when a DB exists)

Identity vs arrangement — same split as the sketch and the klezmer
`SongEntry` / `Setting`:

```ts
// identity — "the song"
Song { id, title, artist, aliases[], createdAt }

// one MIDI / one editorial choice
Arrangement {
  id, songId
  source: "seed" | "allowlist" | "open-web" | "user-upload"
  sourceUrl?: string
  sourceId?: string          // allowlist id
  license: "pd" | "cc" | "unknown" | "user-private"
  storageKey?: string        // object-storage path; omit if pointer-only
  contentHash: string        // sha of .mid bytes
  trackHint?: { melody?: number; ignoreChannel10: true }
  songDocument: SongDocument
  chosenCount: number        // how many users picked this
  createdBy?: userId
}
```

Dedup: lookup by normalized title+artist, then by `contentHash` so two
finds of the same file don't become two rows.

The Piano Roll does not store arrangements. It receives a `SongDocument`
(or a single track's notes) and a tempo. Library UI owns identity.

---

## Phases

### Phase 0 — Load a MIDI file onto the roll (client-only)

The vertical slice. No agent, no DB, no pop catalog.

- [ ] `src/lib/song/` — `SongDocument` types + helpers (shared with klezmer;
      do this **once**).
- [ ] MIDI adapter: `@tonejs/midi` bytes → `SongDocument` (provenance
      `midi`, confidence 1.0).
- [ ] `SongDocument` → piano-roll `sequence` (full MIDI pitch range, not
      C4–C5). Convert PPQ/seconds → the roll's tick grid.
- [ ] Piano Roll: **Open .mid** (file picker). Track picker when `tracks.length > 1`
      (default: densest non-drum pitched track, user can switch).
- [ ] Auto-set bars / tempo / loop end from the file. Zoom/scroll so the
      song is actually visible.
- [ ] Drum channel (10) off by default or on its own toggle — loading a GM
      file should not carpet the roll with hats.
- [ ] Keep current "hero melody" seed as the empty-state demo; opening a
      file replaces it.

**Done when:** you can drop a PD `.mid` on the roll, hear it, edit a note,
and play again.

### Phase 1 — Seed library in the Piano Roll UI

- [ ] A **Library** drawer/panel on `/midi-lab`: search box (local), list of
      seed songs, one-click load.
- [ ] Seed set: **small, license-clean** (Mutopia / Commons / a few trad
      tunes). Metadata JSON: title, artist/composer, license, path.
- [ ] Multiple arrangements per song if we have them ("piano reduction" vs
      "melody only") — even 2 rows teaches the later picker.
- [ ] Optional: recent files in IndexedDB (private, this browser).

**Done when:** a user who never heard of `.mid` can pick a named song and
it's on the roll.

### Phase 2 — Cycle / listen (still no agent)

The interaction the agent will fill later.

- [ ] Candidate tray UX: several versions of the *same* song, skip/preview/
      load without leaving the roll.
- [ ] "Use this version" is a local preference (IndexedDB) keyed by song id.
- [ ] Light quality chips: duration, track count, source name.

Can be exercised with 2–3 hand-picked arrangements of one PD piece. Do not
wait for the agent to invent this UI.

### Phase 3 — Backend: our library is real

Depends on dropping `output: "export"` and picking auth + DB (hosting
sketch: Auth.js + Neon + Drizzle is the current lean, not a lock).

- [ ] Postgres tables for `songs` / `arrangements` (model above).
- [ ] Object storage for `.mid` (or JSON `SongDocument`) for license-clean
      rows.
- [ ] Server lookup: title + artist → arrangements. Piano Roll calls this
      before offering the finder.
- [ ] Promote a Phase 1 seed into the DB (migration or build script).
- [ ] Auth only where we need it: saving a *private* upload to an account;
      shared-library reads can stay public.

**Done when:** two browsers see the same seed song from the DB, not from
`public/`.

### Phase 4 — Finder agent (experimental)

Do not start this phase until Phase 0–2 feel good and Phase 3 can store a
**license-clean** pick. Pop-song persistence stays gated.

- [ ] Allowlist config + one adapter (start with **one** source that has an
      API or a clear license — Mutopia or The Session, not "hits MIDI").
- [ ] Agent tools + 75/25 budget enforced in code.
- [ ] Request UI: title, artist, "Find MIDI" (muted copy that this is beta
      and may return nothing).
- [ ] Candidate tray wired to agent results; open-web hits labeled.
- [ ] On pick: if `license` is PD/CC (or user-private), write arrangement
      to DB; otherwise preview-only + "we didn't add this to the library."
- [ ] Rate limit + `(title, artist)` cache.
- [ ] Add adapters one at a time. Never enable a source whose ToS we
      haven't read that week.

### Phase 5 — Library as a product (later)

- [ ] Votes / `chosenCount` surface the default arrangement.
- [ ] Transpose into another key on load (existing `src/lib/music`).
- [ ] "Open in Harmonica Lab" / synth with detected key — bidirectional
      map, not a second player.
- [ ] User-original uploads to the **public** library (moderation + DMCA
      takedown flow — don't fake this).
- [ ] Export `.mid` of the edited roll back out.

---

## Key decisions (open to veto)

1. **Piano Roll is the player/editor.** The library is not a separate app
   in v1. A `/library` hub can come later if the catalog earns it.
2. **One `SongDocument`.** Shared with klezmer. MIDI is an adapter, not a
   parallel JSON shape for the roll.
3. **75/25 is a coded budget**, not a system prompt. Allowlist adapters get
   the queries; open web is a remainder pass with a louder warning.
4. **Humans promote, agents propose.** Nothing open-web lands in the shared
   DB without a user pick **and** a license that option A (or later B/C)
   allows.
5. **Client-only until the roll can load a file.** Don't drop static export
   or stand up Neon "for the agent." The inflection is Phase 3, when sharing
   requires it.
6. **Pop hits are a research/legal track**, not the seed catalog. The seed
   is music we can actually host. The finder may still *try* a pop query;
   empty or preview-only is a valid outcome.

---

## Suggested first milestone

**Phase 0 + a tiny Phase 1 seed (3–5 PD/CC files) + Open .mid.**

That proves: file → `SongDocument` → visible, playable, editable roll →
named songs in a drawer. No agent, no DB, no export drop. If that slice
isn't fun, the finder won't save it.

---

## Out of scope (for now)

- Audio / YouTube → MIDI (sketch Phase 4; different legal and ML problem).
- OMR / PDF sheet music.
- Building a MuseScore competitor or a licensed pop catalog.
- MIDI-out to hardware (separate ToDo).
- Letting the agent execute arbitrary browsing or write new scrapers at
  runtime.
- Auto-generating a MIDI "cover" with an LLM when search fails (that's
  composition, not a library).

---

## Open questions

- **Melody extract:** for busy GM files, do we auto-pick the track with the
  most unique pitches in the treble, or always make the user choose?
- **How much of a file hits the roll?** Whole arrangement (cluttered) vs
  melody+bass (readable) vs user-toggled stems.
- **Finder UX copy** for pop queries while the legal gate is closed — be
  honest ("we can look; we may not be able to keep it") rather than silent
  failure.
- **Auth timing:** can Phase 3 ship a read-only public DB without Auth.js,
  and add accounts only for private uploads?
- **Object storage vendor:** R2 vs Vercel Blob vs Supabase — wrap behind
  an interface (hosting sketch guardrail).
- **Personal MIDI catalog** mentioned in the sketch: which of those files
  are actually PD/CC-clean enough for Phase 1?

---

## Relevant existing files

| Purpose | Path |
|---------|------|
| Parent sketch (funnels, `SongDocument`, legal notes) | `docs/sketches/community-midi-library.md` |
| Sibling corpus (needs the same `SongDocument`) | `docs/plans/klezmer-yiddish-dataset.md` |
| Auth / DB inflection | `docs/sketches/hosting-and-auth-direction.md` |
| Piano Roll page | `src/app/midi-lab/page.tsx`, `src/components/midi/MidiLab.tsx` |
| Roll wrapper + sequence API | `src/components/midi/PianoRollEditor.tsx` |
| Tick / note conversion (C4–C5 today) | `src/components/midi/melodyConvert.ts` |
| MIDI parser (dep, unused in-app) | `@tonejs/midi`, `analyze_midi.ts` |
| Nav / home widget | `src/lib/navigation.ts` |
| Music theory / transpose | `src/lib/music/` |
| Audio consent + playback | `src/components/home/useHeroAudio.ts` |
| Static export | `next.config.ts` (`output: "export"`) |
| MIDI tooling scratchpad | `TOOLING.md` §1 |
| To create | `src/lib/song/`, `src/lib/midi-library/`, library UI on the roll |
