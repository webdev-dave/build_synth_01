"use client";

/**
 * MapExplorer — client orchestration for /map: the genre filter, place search,
 * the SVG map, and the reading panel share one selection. Bidirectional per
 * the house rules: search/filter drive the map, map clicks drive the panel.
 *
 * The genre filter is a persistent lens: it's only changed from the genre
 * dropdown ("Show all regions" or picking another genre). Clicking around the
 * map picks a place to read but never silently drops the filter — a map click
 * clearing the user's chosen lens is disorienting.
 * Default: nothing selected.
 */
import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { getPlace, placesByGenre } from "@/lib/places/registry";
import { getGenre } from "@/lib/genres/registry";
import { MusicMap, type MapSelection } from "./MusicMap";
import { MapPanel } from "./MapPanel";
import { MapSearch } from "./MapSearch";
import { GenreFilter } from "./GenreFilter";
import { PlaceChips } from "./PlaceChips";
import { GenreChips } from "./GenreChips";

interface MapExplorerProps {
  /** Piano Roll tune counts per manifest label, computed server-side. */
  songCounts: Record<string, number>;
}

export function MapExplorer({ songCounts }: MapExplorerProps) {
  // Embedded region-maps deep-link in with a pre-set lens or place:
  //   /map?genre=blues   → open with the blues lens
  //   /map?place=chicago → open zoomed to Chicago's story
  // Read once for the initial state; the map is user-driven after that.
  const params = useSearchParams();
  const initialGenre = params.get("genre");
  const initialPlaceId = params.get("place");

  // Genre lens and location selection are mutually exclusive — only one filter
  // is ever active. A place deep-link therefore wins over a genre one.
  const hasInitialPlace = Boolean(initialPlaceId && getPlace(initialPlaceId));
  const [selection, setSelection] = useState<MapSelection | null>(() =>
    hasInitialPlace ? { kind: "place", id: initialPlaceId! } : null,
  );
  const [genre, setGenre] = useState<string | null>(() =>
    !hasInitialPlace && initialGenre && getGenre(initialGenre)
      ? initialGenre
      : null,
  );

  const selectedId = selection?.kind === "place" ? selection.id : null;

  // When a location is selected, offer its genres as a pivot: tap one to swing
  // the whole map to that genre's lens.
  const selectedPlace = selectedId ? getPlace(selectedId) : undefined;
  const selectedGenres = (selectedPlace?.music.genres ?? [])
    .map((slug) => getGenre(slug))
    .filter((g) => g !== undefined)
    .map((g) => ({ slug: g.slug, name: g.name }));

  /**
   * A place was chosen (map click, search hit, place roster). Selecting a
   * location clears the genre lens — the two are mutually exclusive.
   */
  function selectPlace(id: string) {
    setSelection({ kind: "place", id });
    setGenre(null);
  }

  /**
   * The map reported a raw selection (place, unknown feature, or reset).
   * Any actual selection is a location filter, so it clears the genre lens;
   * a reset (null) just clears the selection.
   */
  function handleMapSelect(sel: MapSelection | null) {
    setSelection(sel);
    if (sel) setGenre(null);
  }

  function pickGenre(next: string | null) {
    setGenre(next);
    setSelection(null);
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <GenreFilter value={genre} onChange={pickGenre} />
        <MapSearch
          onPick={selectPlace}
          onPickGenre={pickGenre}
          onMiss={(query) => {
            setSelection({ kind: "unknown", label: query });
            setGenre(null);
          }}
        />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-3">
          <div className="rounded-lg border bg-card/30 p-2">
            <MusicMap
              selectedId={selectedId}
              genreFilter={genre}
              onSelect={handleMapSelect}
            />
          </div>
          {/* Submenu under the map, mirroring both directions of the map's
              relationships:
              - a place is selected → its genres, as a pivot into each lens;
              - only a genre lens is on → that genre's places (same roster the
                embedded region-maps use). */}
          {selectedId ? (
            <GenreChips
              genres={selectedGenres}
              activeSlug={genre}
              onPick={pickGenre}
            />
          ) : genre ? (
            <PlaceChips
              places={placesByGenre(genre)}
              selectedId={selectedId}
              onToggle={(id) => (id ? selectPlace(id) : setSelection(null))}
            />
          ) : null}
        </div>
        <MapPanel
          selection={selection}
          genre={genre}
          songCounts={songCounts}
          onPickPlace={selectPlace}
        />
      </div>
    </div>
  );
}
