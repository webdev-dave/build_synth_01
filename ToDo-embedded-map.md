# ToDo — Embedded Map (per-page map instances)

Plan for dropping a small, region-filtered instance of the music-history map at
the bottom of content pages (genres, artists, history, languages, concepts,
songs). Each embed shows **only the places relevant to that page**, auto-frames
them, and links out to the full `/map`. Site-wide ranking stays in
[ToDo.md](ToDo.md).

**Decisions locked (2026-09-05):**

- **Resolution:** derive relevant places from an entity's `genres` / `history`
  (+ `songLabels` for songs), with an optional `places?: string[]` on registries
  to *pin* specific cities. Derivation is the default; `places` augments/overrides.
- **Interactivity:** *light teaser* — pan/zoom + auto-fit; clicking a place shows
  its name and an "Open on full map" link. **No** embedded reading panel; deep
  reading stays on `/map`.
- **Rollout:** ship **genres** end-to-end first, then reuse the pieces for the
  other page types.

---

## Why this is small

The map is already decoupled: `MusicMap` (`src/components/map/MusicMap.tsx`) is a
self-contained d3-geo SVG that fetches geometry on mount and already accepts
`selectedId` + `genreFilter`. Its `isFocused()` is the single chokepoint for
"which places are tinted." `PLACES` (`src/lib/places/registry.ts`) binds geometry
to content via `music.genres` / `music.history` / `music.songLabels`.

The only real gaps: **(a)** resolve "relevant places" for an arbitrary entity,
and **(b)** filter `MusicMap` by a place *set* (not just a genre) + auto-fit the
camera + shed the full-page chrome.

---

## Phase 0 — Place resolver (data layer)

`src/lib/places/registry.ts`

- [ ] Add `placesByHistory(slug)` — mirror of the existing `placesByGenre`.
- [ ] Add `placesForEntity({ genres?, history?, songLabels?, places? }): Place[]`
      — unions all derivations + explicit `places`, de-dupes, stable order.
- [ ] Add optional `places?: string[]` to entity registries as needed (Artist
      first) to pin a specific city that genre-derivation is too broad for.

Per-entity resolution:

| Entity | Resolves via |
|---|---|
| Genre | `placesByGenre(slug)` |
| History | `placesByHistory(slug)` |
| Artist | `genres` + `history` (+ optional `places`) |
| Language | `languageGenres()` → genres |
| Concept | `genres` + `history` |
| Song (catalog / piano-roll) | `genres` + `history` + `songLabels` |

## Phase 1 — Generalize `MusicMap`

`src/components/map/MusicMap.tsx` (backward-compatible; `/map` unchanged)

- [ ] `placeFilter?: string[] | null` — fold `genreFilter` **or** `placeFilter`
      into one internal `focusSet` consulted by `isFocused()`.
- [ ] `fitToFocus?: boolean` — after geometry loads, union bounds of focused
      places (countries/states/overlays via `path.bounds`, padded box for city
      `point`s) → existing `zoomToBounds`.
- [ ] `compact?: boolean` — trim controls / height for embed context.
- [ ] Make `onSelect` optional (read-mostly embed).

## Phase 2 — `EmbeddedMap` component

`src/components/map/EmbeddedMap.tsx` (new, client)

- [ ] Props `{ placeIds: string[]; heading?: string; fullMapHref: string }`.
- [ ] Render `MusicMap` with `placeFilter` + `fitToFocus` + `compact`.
- [ ] Mono region caption; chips select/zoom a place within the embed.
- [ ] "Open in full map →" link (Phase 3 deep link).
- [ ] Perf: module-level geo-fetch cache (world / states / overlays reused across
      mounts) + lazy mount via `IntersectionObserver`.

## Phase 3 — Deep-linkable `/map`

`src/components/map/MapExplorer.tsx` + `src/app/map/page.tsx`

- [ ] Init lens/selection from `useSearchParams`:
      `?genre=blues`, `?places=natchez,mississippi-delta`, `?place=new-orleans`.
- [ ] Client-side only (safe under the `output: "export"` static export).

## Phase 4 — Page wiring (genres first)

- [ ] Server `PageMapSection` wrapper: calls `placesForEntity(entity)` and renders
      `EmbeddedMap` **only when ≥1 place resolves** (nothing otherwise — no empty
      globe; honesty rule).
- [ ] Drop into `src/app/genres/[slug]/page.tsx`.
- [ ] Then reuse in: `artists/[slug]`, `history/[slug]`, `languages/[slug]`,
      `concepts/[slug]`, `piano-roll/[slug]`.

## Phase 5 — Backfill & polish

- [ ] Ensure each shipped genre/history has ≥1 mapped place; add `places?` pins
      where prose names a specific city.
- [ ] Reduced-motion fit (jump vs animate), mono labels, single orange accent.
- [ ] `npx tsc --noEmit`; lint touched files; eyeball a genre page + compact /
      reduced-motion states.

---

## Notes / risks

- **Perf is the main risk:** every embed otherwise re-fetches three geo JSON
  files per mount. The shared fetch cache + lazy mount in Phase 2 are not
  optional if these embeds land on high-traffic pages.
- **Honesty:** auto-fit + "render nothing when empty" keep an embed from showing
  a random globe or implying coverage we don't have.
- **Full-page map untouched** for anyone passing only `genreFilter`; the new
  props are additive.
