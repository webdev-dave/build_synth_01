# ToDo — plan & sketch tracking

Source of truth for inventory, build status, and what to implement next.
The specs themselves live in `docs/plans/` (active) and
`docs/plans/archive/` (shipped), plus `docs/sketches/`. This file tracks
them. Ranked items are ordered **most urgent / important → least**.
Unranked items stay **not specified** — do not treat their list order as
priority.

Update this file when a plan or sketch is added, shipped, archived,
blocked, or re-ranked. Promote a tightened sketch into `docs/plans/`
when decisions harden. Move a finished plan to `docs/plans/archive/`
and list it under Archived below.

---

## Plans — inventory

| Plan | File | What it is | Build status | Ranking |
|------|------|------------|--------------|---------|
| IP, copyright, trademark & licensing (security tightening) | [docs/plans/ip-copyright-trademark-licensing.md](docs/plans/ip-copyright-trademark-licensing.md) | Repo/legal layer: LICENSE, secret scan, trademark ™, repo rename | **Not started.** Status: planning (2026-08-22). No `LICENSE` yet. | **2** |
| Interactive Scale Lessons | [docs/plans/lessons-module.md](docs/plans/lessons-module.md) | `/lessons` non-scale primitives + reusable widgets (scale deep-dives moved to `/scales`) | **Superseded (2026-09-12).** `/lessons` is now the curriculum index over seven modules (umbrella Phase 4); every old `/lessons/<slug>` redirects via `MovedLesson` (chords → 12-bar, waveforms / octaves / frequency → `/concepts/*` with Play-it demos, time-signatures / shuffle → `/rhythm/*`). Nothing left to build here — archive after the umbrella merges. | not specified |
| Harmonica Key Finder — SEO & LLM | [docs/plans/harmonica-lab-seo.md](docs/plans/harmonica-lab-seo.md) | Instrument-first hub `/harmonica` + Key Finder + Cross Harp Chart; migrate lab | **Not started.** Spec says sketch first — don't build yet. Site-wide `metadataBase` already exists; sitemap/robots/JSON-LD and new routes do not. | not specified (doc: hold on build) |
| Contact & Licensing pages | [docs/plans/contact-and-licensing.md](docs/plans/contact-and-licensing.md) | `/contact` form, `/usage`, `/pricing` stub, footer wiring | **Partial.** `/contact` is a `mailto:` stub. `/usage` and `/pricing` do not exist. Decisions locked. | not specified |
| Buy Me a Coffee (tips) | [docs/plans/buy-me-a-coffee.md](docs/plans/buy-me-a-coffee.md) | Footer + `/about` link to a BMC creator page | **Not started.** Blocked on off-site BMC account + live URL. | not specified (doc: **do not build yet**) |
| Yiddish / Jewish music (dataset + learn-through-song) | [docs/plans/klezmer-yiddish-dataset.md](docs/plans/klezmer-yiddish-dataset.md) | Track A: klezmer melody corpus. Track B: lyric+audio language module | **Not started.** Blocked on `SongDocument` (`src/lib/song/` does not exist). Track B is exploration. | not specified |
| Interactive Dance Tutorial | [docs/plans/dance-tutorial-module.md](docs/plans/dance-tutorial-module.md) | `/dance` beat-synced footwork lessons; first style West Coast Swing | **Not started.** Spec says sketch first — not a build order to start blindly. | not specified (doc: hold on build) |
| Self-hosted MIDI library + agentic finder | [docs/plans/self-hosted-midi-library.md](docs/plans/self-hosted-midi-library.md) | Load songs into the Piano Roll; later an allowlist-first agent finds MIDI by title+artist and caches the user's pick | **Not started.** Blocked on `SongDocument`; agent/DB blocked on dropping `output: "export"`. First milestone is client-only (open `.mid` + PD seed). | not specified |
| Genres + Scales modules (structure + SEO) | [docs/plans/genres-and-scales-modules.md](docs/plans/genres-and-scales-modules.md) | `/genres` + `/scales` hubs & `[slug]` spokes, typed registries, cross-links, per-page metadata + FAQ JSON-LD, first `sitemap.ts`/`robots.ts`, nav | **Partial (2026-09-05).** Structure + SEO shipped; `/scales/blues-scale` now has its interactive lesson (keyboard, pentatonic-vs-blues comparer, degree strip). 2026-09-12: genre Scale layer leads with a "View the full lesson" door + short `ScaleTeaser` piano (generic across genres). Next: song embed on the blues pages (blocked on sourcing a PD blues `.mid`), then genre groove widgets. | not specified |
| Genre Lab (what makes a genre itself) | [docs/plans/genre-lab-module.md](docs/plans/genre-lab-module.md) | `/genres` hub + per-genre pages; layer stack (rhythm first, then harmony/scale/form); reggae vs rock as the format proof | **Layer widgets shipped on the umbrella branch (2026-09-12).** Blues and rock pages open Scale / Harmony / Rhythm / Meter / Form panels via the generic `LayerPanel`; rock is the format proof (data-only). Reggae waits on the `one-drop` groove lesson (registry row is sourced, `soon`). | not specified (doc: reggae next) |
| Genre layers → lesson modules (umbrella) | [docs/plans/genre-layer-lessons.md](docs/plans/genre-layer-lessons.md) | Finish the blues page's Harmony / Rhythm / Form panels by building `/progressions`, `/rhythm`, `/forms` as sibling lesson modules of `/scales`; shared `LessonEntry` type, layer→module map, generic `LayerPanel`, `LessonSpoke` chrome, `BarTimeline`, one clock; `/lessons` becomes the curriculum index | **Built through Phase 5 on branch `cursor/genre-layer-lessons-222e` (2026-09-12), not merged, not promoted.** Blues page: Scale / Harmony / Rhythm / Meter / Form panels all open (Texture only pill). `/progressions`, `/rhythm`, `/forms`, `/drums`, `/lessons` index, rock live as the data-only proof. Awaiting the three human checkpoints (eyes on the refactor, ears on organ + kit) — review list in the doc's **§9.3**. | **1** |
| Progressions module (harmony layer) | [docs/plans/progressions-module.md](docs/plans/progressions-module.md) | Child of the umbrella: `src/lib/music/chords.ts`, `Progression` registry, `ProgressionPlayer` / `ProgressionTeaser`, `/progressions/twelve-bar-blues` lesson, blues Harmony panel | **Built (2026-09-12, same branch).** 12-bar, I–IV–V, power chord live; four spokes `soon`. Organ preset needs ears (umbrella §9.3 item 2). | **1** (Phase 1 of umbrella) |
| Lesson widgets design (harmony / rhythm / form interactivity) | [docs/plans/lesson-widgets-design.md](docs/plans/lesson-widgets-design.md) | Child of the umbrella: what each layer's widgets show, press, and sound; the hear→see→change-one-thing→do-it loop; time-true drum grid, swing slider, three-strip form map, chord×scale overlay, chord lock; shared `useLessonClock`; drum machine as primitive-first; v1 / v1.5 / later per layer | **Built through v1 (2026-09-12, same branch).** TapPad and `SongBuilder` remain v1.5 / later. Feel slider, lick, comparer click design are feedback items in the umbrella §9.3. | **1** (informs Phases 1–3) |

### Archived

Requested work shipped. Specs stay in `docs/plans/archive/` for history.

| Plan | File | Shipped |
|------|------|---------|
| Scales catalog + lesson roadmap | [docs/plans/archive/scales-catalog-and-lessons.md](docs/plans/archive/scales-catalog-and-lessons.md) | 2026-09-12 — all 17 `/scales` lessons live |
| Synth v2 scale-type selector | [docs/plans/archive/synth-scale-type-selector.md](docs/plans/archive/synth-scale-type-selector.md) | 2026-09-12 — Type dropdown + live `?scale=` (Phase F parked) |

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
| Lesson piano stays reachable while scrolling | [src/components/scales/ScaleLessonProvider.tsx](src/components/scales/ScaleLessonProvider.tsx) | On lesson pages the in-flow piano scrolls away; the reader should still be able to play the current scale-locked keyboard from anywhere on the page (sticky header/footer, summon button, or similar — undecided). Keep presenting it inline where the lesson needs it. | **Parked (2026-09-14).** Capture only; plan later. | not specified |
| Lesson / synth controls below the piano | [src/components/scales/LessonToolbar.tsx](src/components/scales/LessonToolbar.tsx) | Buttons that adjust the keyboard / synth (root, octave, lock, play, etc.) should sit below the piano, left corner — not above it. | **Parked (2026-09-14).** Capture only; plan later. | not specified |

---

## Sketches — inventory

Sketches are **not committed work** and **not a decided direction** unless
a doc says otherwise.

| Sketch | File | What it is | Status | Ranking |
|--------|------|------------|--------|---------|
| Universal song ingestion → community MIDI library | [docs/sketches/community-midi-library.md](docs/sketches/community-midi-library.md) | Users funnel MIDI/ABC/MusicXML/audio into one `SongDocument`; later a shared, curated library | **Exploration.** Not a decided direction. Parent of klezmer + the [self-hosted MIDI library](docs/plans/self-hosted-midi-library.md) plan. No `src/lib/song/` yet. | not specified |
| Hosting, domain, and auth | [docs/sketches/hosting-and-auth-direction.md](docs/sketches/hosting-and-auth-direction.md) | Vercel + `instrumaps.com` + staged `main` / promote; later Auth.js / DB | **Split.** Hosting/domain = done (live). Auth = still a sketch. Promote a tightened auth version to `docs/plans/` when it hardens. | not specified |

---

Piano Roll day-to-day list: [ToDo-piano-roll.md](ToDo-piano-roll.md)
(default song, touch scroll X/Y, transpose↔scale, track picker, song URLs / MIDI SEO).

## Next to implement

Ranked items first (**most urgent → next**). Everything below that is
**not specified**.

| Item | Kind | Next slice | Local order | Ranking |
|------|------|------------|-------------|---------|
| Genre layers → lesson modules | plan | **Review the branch** (`cursor/genre-layer-lessons-222e`, PR #5): Checkpoints 1–3 + the feedback list in the doc's §9.3; apply verdicts (one-number edits mostly); merge; promote deliberately. Then v1.5: TapPad (2f), one-drop + reggae as the next data-only genre, `dominant-seventh` / `i-v-vi-iv` lessons, 8-bar blues | §9 in-doc | **1** |
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
| Genre Lab | plan | Reggae as the next data-only genre: `one-drop` lesson content (registry row already sourced) + flip `reggae` live; the `i-v-vi-iv` lesson it shares with rock | umbrella §9 | not specified |
| Hosting / auth | sketch | Hosting Phase 0 is done. Remaining (in-doc "rough order"): rename leftover "Synth-v01" copy / README demo link → Auth.js + Google spike on a feature branch → decide Drizzle vs Prisma, Neon vs Supabase → months out, delete the Netlify redirect site. | in-doc: remaining actions in rough order | not specified |
| Lesson piano stays reachable while scrolling | fix | On lesson pages, keep a way to play the current scale-locked piano after it has scrolled off-screen. Sticky header/footer vs summon button vs other — undecided. | plan later | not specified |
| Lesson / synth controls below the piano | fix | Move the keyboard/synth adjuster buttons below the piano, left corner, instead of above it. | plan later | not specified |
