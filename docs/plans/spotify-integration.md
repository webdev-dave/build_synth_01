# Plan: Spotify integration — the widget, then the music-nerd layer

> **Status: planning (2026-09-05). Nothing shipped yet.**

## Overview

Two related ambitions, in increasing order of depth:

1. **Near term** — a reusable `<SpotifyEmbed>` widget, sibling to
   `YouTubeEmbed`: play a song via Spotify while staying in our app
   (articles, song pages, genre pages).
2. **Long term** — the user listens to *their* Spotify through our app: they
   navigate and play songs, and around the playing track we wrap everything
   Instrumaps knows — Piano Roll arrangement, genre, key, BPM, the song's
   history article, its artists, and the theory concepts inside it, each
   linking to its page.

The framing that makes this buildable: **Spotify supplies playback and the
identity of the track; Instrumaps supplies the knowledge layer.** Our catalog
(`src/lib/catalog/`), concepts glossary, history articles, and MIDI library
(which already stores `key` and `bpm` per arrangement) are the moat — we do
NOT depend on Spotify for any musical intelligence. That's lucky, because
Spotify no longer offers any (see constraints).

## Hard constraints — the 2026 Spotify reality

Verified 2026-09-05. These shape every phase; re-verify before building each
one.

| Capability | Status | Consequence for us |
| --- | --- | --- |
| **iFrame Embed API** (no app registration, no OAuth) | Alive, GA-safe | Phase 0 widget. Free/logged-out listeners get **30-second previews**. Full tracks only for **Premium users logged into Spotify in that browser**, and only when they click **Spotify's own ▶** — programmatic `controller.play()` hits a documented preview-only bug. We cannot puppet full playback. |
| Web API: search, track/artist metadata, now-playing, recently-played, library, Connect control | Alive | Enough for Phases 2–3 personalization. |
| Web API: `/audio-features` (key, BPM), `/audio-analysis`, `/recommendations`, related artists | **Dead for new apps** (403 since 2024-11-27; no replacement, no waitlist) | Key/BPM/theory data must come from **our own catalog + MIDI library** (or local analysis, e.g. Essentia, at ingest). This was always the more honest path anyway. |
| **Development Mode** user cap | ~**5 allowlisted users** (cut from 25 in Feb 2026) | Phases 2–3 ship as a **lab/beta for the owner + a few testers**, not GA. |
| **Extended quota** (GA for OAuth features) | Requires ~**250k MAU to even apply** (May 2025 policy) | GA personalization is blocked until Spotify policy changes or we're huge. Plan accordingly; don't architect as if GA is imminent. |
| Web Playback SDK (full streaming in our page as a Spotify Connect device) | Alive; requires OAuth `streaming` scope + **Premium** | Phase 3. Same 5-user dev-mode cap applies. |

**Static export stays.** Phases 0–1 need no auth at all. Phases 2–3 use
**Authorization Code + PKCE**, which is entirely client-side (no secret, no
server, token in the browser) — compatible with `output: "export"`. The
deployment rule's "auth means dropping static export" applies to *our own*
accounts/DB, not to client-side OAuth against Spotify.

## Two independent tracks

Don't treat this as one ladder. The **embed widget** (Phase 0) is unrestricted
and ships to everyone; the **API layer** (Phases 2–3) is capped at ~5 users
until Spotify's quota policy changes. YouTube remains the universal "hear it
now" fallback for everyone else — the two widgets coexist in the same
`SongLink` menu.

## Phase 0 — Reusable `<SpotifyEmbed>` widget

Sibling of `YouTubeEmbed`, same contract, same one-at-a-time rule.

- `src/components/media/SpotifyEmbed.tsx` — client component wrapping the
  **iFrame Embed API** (`https://open.spotify.com/embed/iframe-api/v1`,
  `window.onSpotifyIframeApiReady`, `IFrameAPI.createController(el, {uri})`).
  Loader is a module-level singleton like `loadYouTubeApi()`.
- **Generalize the conductor.** Rename `youtubeConductor.ts` →
  `mediaConductor.ts` (same `ManagedPlayer` shape — `playing` + `pause()`).
  The Spotify controller registers too: its `playback_update` events set
  `playing`; `controller.pause()` implements `pause()`. One song at a time
  **across providers** — starting a Spotify track pauses a YouTube video and
  vice versa.
- **Honest preview UX.** Watch `playback_update` durations: a ~30s duration
  means preview mode. Show a quiet one-liner under the player: "30-second
  preview · Premium + logged into Spotify? Click ▶ in the player for the full
  track." Never imply full playback we can't deliver.
- **Catalog field:** `CatalogSong.spotifyTrackId?` (verified id, never from
  memory — same rule as `youtubeId`).
- **Surfaces:** a "Play on Spotify" row in the `SongLink` panel (Spotify green
  logo mark, same reasoning as YouTube red) and a player on `/songs/[slug]`.
  Same in-flow panel behavior — never an overlay.
- Update the history-articles rule (`SongLink` section + catalog section).

No app registration, no quota, no login. Ships to everyone.

## Phase 1 — Our own "song context" layer (no Spotify dependency)

The wrap-around-the-song experience, built entirely from our data — this is
the piece that later plugs into live Spotify playback, but it's valuable now:

- `src/components/catalog/SongContext.tsx` — given a catalog song slug,
  render the full knowledge card: artists (`<ArtistLink>` targets), genres,
  history articles, Piano Roll link, and **key/BPM/meter pulled from the MIDI
  library entry** (`src/lib/songs` manifest already stores `key`, `bpm`,
  `timeSignature`) when `pianoRollId` is set.
- Concept tagging: add `concepts?: string[]` to `CatalogSong` (slugs into the
  concepts registry) — "theory found in this song" with `<Term>`-style links
  (e.g. St. Louis Blues → twelve-bar-blues, blue-notes).
- Render `SongContext` on `/songs/[slug]`; it becomes the reusable core for
  Phase 2's now-playing panel.
- Optional ingest upgrade: derive key/BPM at MIDI-ingest time for catalog
  songs we have arrangements for; a local Essentia/librosa pass is the
  fallback for songs we only reference (compute at authoring time, store in
  the registry — never a runtime dependency).

## Phase 2 — "Connect Spotify" (beta, ≤5 users)

The first personalized slice: see what you're playing, get our context.

- Register a Spotify app (Development Mode); allowlist owner + testers.
- `src/lib/spotify/` — `auth.ts` (PKCE flow: login redirect, token exchange,
  refresh, localStorage persistence) and `api.ts` (thin fetch wrapper:
  now-playing, recently-played, search).
- `/spotify-lab` page (beta-badged, like Piano Roll): connect button →
  now-playing poller (respect rate limits; ~5s while tab is visible) →
  **match the track to our catalog** → render `SongContext`.
- **Matching strategy, in order:** curated `spotifyTrackId` on the catalog
  song (exact, preferred) → normalized title+artist match against catalog →
  no match: show track metadata + a quiet "we haven't written about this one
  yet" with search links into /genres, /scales, /concepts.
- Control of playback happens in the user's own Spotify app (Connect API can
  pause/skip with the right scopes — nice-to-have, not core).

## Phase 3 — Listen *inside* Instrumaps (Web Playback SDK)

The full vision, still capped to allowlisted Premium users:

- Web Playback SDK creates a Spotify Connect device in our page; the user
  transfers playback to "Instrumaps" and audio streams in-app.
- Browse/search UI via Web API; play queue; our `SongContext` wraps the
  playing track live — key/BPM readouts (mono font), genre/history/concept
  links, "Open in Piano Roll" when we have the arrangement.
- SDK players join the media conductor like everything else.
- Design bar: this is a listening room, not a dashboard — calm, one accent,
  the knowledge layer stays quiet until the user reaches for it.

## Risks & honest mitigations

- **Quota wall (biggest).** Phases 2–3 can't reach GA under current policy.
  Mitigation: Phase 0–1 carry the public value; API phases are explicitly a
  lab. Revisit Spotify policy each phase; consider the same pattern against
  other services later (Apple MusicKit has its own program) — the conductor,
  catalog, and `SongContext` are provider-agnostic on purpose.
- **Preview-only embeds** for most listeners. Mitigation: honest caption +
  YouTube remains the default full-length option in `SongLink`.
- **No Spotify musical data.** Mitigation: our MIDI-derived key/BPM +
  authored concept tags; optional local analysis at ingest. Never fabricate —
  a song with unknown key simply shows no key.
- **TOS care:** don't cache/store Spotify audio, don't misrepresent previews,
  show Spotify attribution per their embed/branding guidelines.
- **Token-in-browser tradeoff** (PKCE): fine for a lab; if we ever outgrow
  it, that's the moment the static-export question actually opens — not
  before.

## Order of work

1. Phase 0 widget + conductor rename + `spotifyTrackId` on the 4 blues songs.
2. Phase 1 `SongContext` + `concepts` tags on catalog songs.
3. Pause: re-verify Spotify dev-mode caps, then Phase 2 lab.
4. Phase 3 only if the Phase 2 lab feels magical to real testers.

## Open questions

- Does the preview-vs-full detection (duration sniffing) hold up across
  browsers? Prototype before promising the caption behavior.
- `spotify-lab` vs. integrating into `/songs` pages — decide when Phase 2 is
  real; the lab page keeps beta chrome away from evergreen pages.
- Apple Music / MusicKit as a second provider — only worth evaluating after
  `SongContext` exists and proves the provider-agnostic shape.
