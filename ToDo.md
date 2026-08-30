# ToDo — plan & sketch tracking

Source of truth for inventory, build status, and what to implement next.
The specs themselves live in `docs/plans/` and `docs/sketches/`; this file
tracks them. Ranked items are ordered **most urgent / important → least**.
Unranked items stay **not specified** — do not treat their list order as
priority.

Update this file when a plan or sketch is added, shipped, blocked, or
re-ranked. Promote a tightened sketch into `docs/plans/` when decisions
harden.

---

## Plans — inventory

| Plan | File | What it is | Build status | Ranking |
|------|------|------------|--------------|---------|
| IP, copyright, trademark & licensing (security tightening) | [docs/plans/ip-copyright-trademark-licensing.md](docs/plans/ip-copyright-trademark-licensing.md) | Repo/legal layer: LICENSE, secret scan, trademark ™, repo rename | **Not started.** Status: planning (2026-08-22). No `LICENSE` yet. | **2** |
| Interactive Scale Lessons | [docs/plans/lessons-module.md](docs/plans/lessons-module.md) | `/lessons` blog of interactive scale/mode pages + reusable widgets | **Partial.** Index + `[slug]` routes and registry exist; all lessons still "Soon". Widgets (keyboard, comparer, etc.) and real content are unbuilt. | not specified |
| Harmonica Key Finder — SEO & LLM | [docs/plans/harmonica-lab-seo.md](docs/plans/harmonica-lab-seo.md) | Instrument-first hub `/harmonica` + Key Finder + Cross Harp Chart; migrate lab | **Not started.** Spec says sketch first — don't build yet. Site-wide `metadataBase` already exists; sitemap/robots/JSON-LD and new routes do not. | not specified (doc: hold on build) |
| Contact & Licensing pages | [docs/plans/contact-and-licensing.md](docs/plans/contact-and-licensing.md) | `/contact` form, `/usage`, `/pricing` stub, footer wiring | **Partial.** `/contact` is a `mailto:` stub. `/usage` and `/pricing` do not exist. Decisions locked. | not specified |
| Buy Me a Coffee (tips) | [docs/plans/buy-me-a-coffee.md](docs/plans/buy-me-a-coffee.md) | Footer + `/about` link to a BMC creator page | **Not started.** Blocked on off-site BMC account + live URL. | not specified (doc: **do not build yet**) |
| Yiddish / Jewish music (dataset + learn-through-song) | [docs/plans/klezmer-yiddish-dataset.md](docs/plans/klezmer-yiddish-dataset.md) | Track A: klezmer melody corpus. Track B: lyric+audio language module | **Not started.** Blocked on `SongDocument` (`src/lib/song/` does not exist). Track B is exploration. | not specified |
| Interactive Dance Tutorial | [docs/plans/dance-tutorial-module.md](docs/plans/dance-tutorial-module.md) | `/dance` beat-synced footwork lessons; first style West Coast Swing | **Not started.** Spec says sketch first — not a build order to start blindly. | not specified (doc: hold on build) |
| Self-hosted MIDI library + agentic finder | [docs/plans/self-hosted-midi-library.md](docs/plans/self-hosted-midi-library.md) | Load songs into the Piano Roll; later an allowlist-first agent finds MIDI by title+artist and caches the user's pick | **Not started.** Blocked on `SongDocument`; agent/DB blocked on dropping `output: "export"`. First milestone is client-only (open `.mid` + PD seed). | not specified |

---

## Admin / off-site — inventory

Tasks that live outside the codebase (accounts, tooling, services).

| Item | What it is | Status | Ranking |
|------|------------|--------|---------|
| Reroute WebDev Dave portfolio → Instrumaps | Point the WebDev Dave portfolio site/domain at this site. Instrumaps beats every old portfolio project by a mile; the old ones are from beginner-dev days and should be retired/redirected. | **Not started.** | **4** |

---

## Fixes — inventory

Live-site / product defects that are not a plan or sketch.

| Item | File | What it is | Build status | Ranking |
|------|------|------------|--------------|---------|
| Hero demo: "Yesterday" musical errors | [src/components/home/heroTune.ts](src/components/home/heroTune.ts) | Homepage attract-mode plays the opening of the Beatles' *Yesterday* (transposed F→C). The line still has serious musical errors — embarrassing on a music-theory site. | **Open.** Tune data and playback exist; the notes/harmony are wrong. | **3** |

---

## Sketches — inventory

Sketches are **not committed work** and **not a decided direction** unless
a doc says otherwise.

| Sketch | File | What it is | Status | Ranking |
|--------|------|------------|--------|---------|
| Universal song ingestion → community MIDI library | [docs/sketches/community-midi-library.md](docs/sketches/community-midi-library.md) | Users funnel MIDI/ABC/MusicXML/audio into one `SongDocument`; later a shared, curated library | **Exploration.** Not a decided direction. Parent of klezmer + the [self-hosted MIDI library](docs/plans/self-hosted-midi-library.md) plan. No `src/lib/song/` yet. | not specified |
| Hosting, domain, and auth | [docs/sketches/hosting-and-auth-direction.md](docs/sketches/hosting-and-auth-direction.md) | Vercel + `instrumaps.com` + deploy lock; later Auth.js / DB | **Split.** Hosting/domain = done (live). Auth = still a sketch. Promote a tightened auth version to `docs/plans/` when it hardens. | not specified |

---

Piano Roll day-to-day list: [ToDo-piano-roll.md](ToDo-piano-roll.md)
(default song, pan/zoom, transpose↔scale, track picker).

## Next to implement

Ranked items first (**most urgent → next**). Everything below that is
**not specified**.

| Item | Kind | Next slice | Local order | Ranking |
|------|------|------------|-------------|---------|
| IP / security tightening | plan | Phase 1 secret scan + dep license audit; then proprietary `LICENSE` + README; then repo rename; ™ on the wordmark | in-doc weekend fast-path | **2** |
| Hero demo: "Yesterday" | fix | Correct the notes/harmony in `heroTune.ts` so the homepage demo of *Yesterday* is musically honest. Listen through the attract-mode phrase and fix wrong pitches, durations, and chords. | not specified | **3** |
| Reroute WebDev Dave portfolio → Instrumaps | admin | Point the WebDev Dave portfolio domain/link at instrumaps.com and retire/redirect the old beginner-era portfolio projects, since this site outclasses them by a mile. | not specified | **4** |
| Dance tutorial | plan | Phase 0 content research (lock WCS counts), then Phase 1 + `GroovePlayer` + `CountTimeline` + Lesson 0 | suggested first milestone in-doc | not specified |
| Buy me a coffee | plan | Off-site: create BMC page, test a $1 tip, then Phase 1 (`AUTHOR.coffee` + shared link) | in-doc: do not code until the URL exists | not specified |
| Harmonica SEO | plan | Phase 0 keyword/Q&A research; then hub + Key Finder + Cross Harp Chart + crawlable FAQ | in-doc "if only three things": pages+FAQ, then JSON-LD, then sitemap/canonical | not specified |
| Klezmer / Yiddish | plan | Track A: Phase A0 (`SongDocument` + `SongEntry`) + scrape ~20 abcnotation tunes and play one. Track B: Phase B0 one-song YouTube + lyric sync spike. Either track can go first. | in-doc ingestion priority for Track A; B0 for Track B | not specified |
| Lessons module | plan | Finish Phase 1 leftovers (nav entry, layout) + Phase 2 widgets + Blues lesson as the format proof | suggested first milestone in-doc | not specified |
| Contact & licensing | plan | Rebuild `/contact` (gut the stub), then `/usage`, `/pricing` stub, footer + About "Work with me" split | Phases 1 → 4 in-doc | not specified |
| Community MIDI library | sketch | Only if/when we choose to start: `src/lib/song/` types → `@tonejs/midi` upload adapter → play a `SongDocument` on the existing synth → transpose. Parallel experiment: publish a small personal MIDI catalog. Concrete product slice is the MIDI library plan below. | Phases 0 → 5 are lowest-hanging fruit → hardest (options, not a chosen path) | not specified |
| Self-hosted MIDI library | plan | Phase 0: `SongDocument` + `@tonejs/midi` → Piano Roll (open `.mid`, track picker) + 3–5 PD/CC seed files. Agent finder and shared DB wait until the roll can load a song and static export is dropped. | Phases 0 → 1 first; 4 (agent) after 3 (DB) | not specified |
| Hosting / auth | sketch | Hosting Phase 0 is done. Remaining (in-doc "rough order"): rename leftover "Synth-v01" copy / README demo link → Auth.js + Google spike on a feature branch → decide Drizzle vs Prisma, Neon vs Supabase → months out, delete the Netlify redirect site. | in-doc: remaining actions in rough order | not specified |
