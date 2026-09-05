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

import { MusicMap, type MapSelection } from "./MusicMap";
import { MapPanel } from "./MapPanel";
import { MapSearch } from "./MapSearch";
import { GenreFilter } from "./GenreFilter";

interface MapExplorerProps {
  /** Piano Roll tune counts per manifest label, computed server-side. */
  songCounts: Record<string, number>;
}

export function MapExplorer({ songCounts }: MapExplorerProps) {
  const [selection, setSelection] = useState<MapSelection | null>(null);
  const [genre, setGenre] = useState<string | null>(null);

  const selectedId = selection?.kind === "place" ? selection.id : null;

  /** A place was chosen (map click, search hit, or genre-overview list). */
  function selectPlace(id: string) {
    setSelection({ kind: "place", id });
  }

  /**
   * The map reported a raw selection (place, unknown feature, or reset).
   * The genre lens is left untouched here — only the dropdown changes it —
   * so panning/clicking the map never yanks the filter out from under the user.
   */
  function handleMapSelect(sel: MapSelection | null) {
    setSelection(sel);
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
        <div className="rounded-lg border bg-card/30 p-2">
          <MusicMap
            selectedId={selectedId}
            genreFilter={genre}
            onSelect={handleMapSelect}
          />
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
