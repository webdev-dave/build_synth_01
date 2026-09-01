# ToDo — Piano Roll

Local list for `/piano-roll`. Site-wide ranking stays in [ToDo.md](ToDo.md).
Update this file when a roll item ships, blocks, or gets a new next slice.

**Default song:** `yesterday-beatles` (full MIDI arrangement).

---

## Next (immediate)

| # | Item | Status | Next slice |
|---|------|--------|------------|
| 1 | **Transpose updates the scale** | **Doing / just shipped.** | −1 / +1 moves notes *and* the Scale dropdown root (C major → C# major). Mode stays. If scale is `none`, leave it — do not invent a key. |
| 2 | **Pan when the song is bigger than the view** | **Partial.** | Wheel already pans Y. Trackpad swipe pans X. **Shift+wheel** now pans X for mouse users. No classic scrollbars (see below). Follow-up: Space+drag or a “hand” tool if people still get lost. |
| 3 | **Track picker** | Open | Full arrangements dump every pitched track on one roll. Let the user solo melody / hide accompaniment. |
| 4 | **Open a local `.mid`** | Open | In-app file picker → same ingest path (`SongDocument` → roll). Phase 0 of the library plan. |
| 5 | **Meter vs playback honesty** | Open | 3/8 (Bei Mir) and other odd meters: confirm bar lines + clock after the tempo-compensation fix. First tempo only — tempo maps still flatten. |
| 6 | **How-to / learn copy** | Open | Keep the Learn panel honest as gestures change (pan vs zoom vs transpose). |
| 7 | **Song on the URL + MIDI SEO / GEO** | Open | Selecting a catalog song must land on a crawlable path (`/piano-roll/hava-nagila`), not a query string. See **Song URLs** below. First slice: `[slug]` routes from `SongEntry.id` + picker `router.replace`. Then per-song metadata, JSON-LD, sitemap. |

---

## Overflow: scrollbars or not?

The roll is a **camera** (`xoffset` / `yoffset`) over a virtual grid, not a
tall/wide DOM page. Native overflow bars would not move that camera unless we
faked them.

**What works today**

- **Wheel** — pan up/down through the keyboard
- **Shift+wheel** — pan left/right through time (mouse)
- **Trackpad** — two-finger swipe pans both axes (`deltaX` + `deltaY`)
- **Ctrl/Cmd+wheel** — zoom time
- **+/− zoom buttons** — time and pitch

**Recommendation:** skip visible scrollbar chrome for now. Extra bars fight
the canvas and the playhead. Gestures + the existing zoom buttons are enough
if we tell people Shift+wheel exists. Revisit overlay scrollbars only if
users still cannot reach the end of a long song or the top of the range.

---

## Song URLs (SEO + LLM ranking)

**Intent:** someone searches *"Hava Nagila MIDI"* / *"tumbalalaika midi"* /
*"[song] midi piano roll"* and lands on **that song already loaded** on our
roll — shareable, bookmarkable, and citable. Same honesty rule as the SEO
plan: the page ranks for a song because the roll actually plays it, not
because we stuffed the title.

Picker state today is client-only (`MidiLab` `useState` + `getDefaultSong()`).
`/piano-roll` is one thin metadata page. That cannot rank per song.

### URL shape — path slugs, not `?song=`

Query params (`/piano-roll?song=hava-nagila`) are enough for sharing among
users who already know us. They are **not** enough for search: crawlers
collapse or skip query variants, canonicals get messy, and answer engines
prefer a stable path that *is* the document.

Use the catalog id (already kebab-case: `hava-nagila`, `yesterday-beatles`):

```
/piano-roll                  ← lab / default song. Self-canonical for the tool.
/piano-roll/hava-nagila      ← that MIDI loaded on the roll. Self-canonical
                               for the song query.
```

Mirror `src/app/lessons/[slug]/page.tsx`: `generateStaticParams()` from
`SONGS`, `generateMetadata`, `notFound()` on unknown ids
(`dynamicParams = false`). Static export can emit these at build.

**Picker ↔ URL:** choosing a song `router.replace`s to `/piano-roll/[id]`
(no junk history stack). Opening a slug loads that `SongEntry`. Bare
`/piano-roll` keeps today's default. Opening a local `.mid` stays on
`/piano-roll` (private file ≠ a public page). `/midi-lab` already redirects
to `/piano-roll`; if we add slugs, 308 `/midi-lab/[slug]` →
`/piano-roll/[slug]` later so old paths don't fork.

Do **not** invent a parallel `/midi/[slug]` cluster in this slice. We just
moved MIDI Lab → Piano Roll; a third MIDI URL repeats the v1/v2
cannibalization the SEO plan warns about. Put **"MIDI"** in the title,
description, JSON-LD, and body — that's what ranks the query.

### What makes a song page rank (and get cited)

Follow [harmonica-lab-seo.md](docs/plans/harmonica-lab-seo.md) and
[seo-and-discoverability.md](docs/plans/seo-and-discoverability.md):
narrow, answer-shaped page; keyword-honest title; crawlable text; structured
data. The roll is the tool; each song is a spoke.

| Layer | What to ship |
|-------|----------------|
| Title | `Hava Nagila MIDI — play on a piano roll` (search phrase first; `· Instrumaps` comes from the template) |
| Description | Artist / collection + "interactive MIDI piano roll you can play and edit" |
| Canonical | Self-canonical per slug. Lab page does **not** claim every song. |
| `<h1>` + lead | Real HTML: title, subtitle/artist, that this *is* the MIDI on a playable roll. Not only canvas/client state — crawlers and LLMs don't run our picker. |
| JSON-LD | `MusicComposition` (name, alternateName, composer/artist if we have it, `encodingFormat: audio/midi`) + the tool as `WebApplication`. FAQ on the lab hub, not cloned onto every song. |
| Sitemap | Every **indexable** slug. |
| `llms.txt` | Point at the piano-roll catalog / a few example song URLs so agents can cite a specific MIDI page. |

### Indexing policy (legal, not just SEO)

We host PD / traditional / CC catalog files (klezmer seed, etc.). Those
**should** be indexed — that's the long tail.

In-copyright pop MIDI is a different bucket (library plan legal gate). Do
**not** rank `"Yesterday" Beatles MIDI` as a public landing even if
`yesterday-beatles` is the in-app default. Noindex that slug and keep it
out of the sitemap until counsel / licensing says otherwise. User-opened
local files: never a public URL.

### Next slices (when we build)

1. `/piano-roll/[slug]` + picker URL sync + unknown slug 404.
2. Per-song `generateMetadata` + canonical + crawlable header.
3. JSON-LD + sitemap + `llms.txt` entries.
4. Index vs noindex from license / origin (PD/CC in; gated pop out).

---

## Later

- Undo/redo already exists; confirm it covers transpose + scale changes as one
  gesture or two (notes vs dropdown).
- Loop flags vs full-song length on 80-bar MIDI.
- Export `.mid` back out.
- Next FreeSheetMusic.net pages (Irish, Celtic, …) — see
  `.cursor/rules/midi-ingest.mdc`. Do not re-ingest the klezmer listing.
- Homepage hero still plays Yesterday **v1**; that is [ToDo.md](ToDo.md)
  rank 3, not this file.

---

## Pointers

| What | Where |
|------|--------|
| Editor + wheel/zoom | `src/components/midi/PianoRollEditor.tsx` |
| Lab chrome, scale, transpose | `src/components/midi/MidiLab.tsx` |
| Catalog / default song | `src/lib/songs/library.ts` (`SongEntry.id` = URL slug) |
| Ingest | `.cursor/rules/midi-ingest.mdc` |
| Library product plan | `docs/plans/self-hosted-midi-library.md` |
| SEO / GEO pattern | `docs/plans/seo-and-discoverability.md`, `docs/plans/harmonica-lab-seo.md` |
| Static `[slug]` precedent | `src/app/lessons/[slug]/page.tsx` |
