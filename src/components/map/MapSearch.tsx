"use client";

/**
 * MapSearch — unified search for the music-history map.
 *
 * Matches genres (klezmer, blues) AND places — including historical aliases
 * (Kishinev → Chișinău, Vilna → Vilnius, "the Pale"), because historical
 * names are how music history actually talks. A genre hit filters the map;
 * a place hit zooms to it. A miss is an answer too: submitting a query with
 * no matches tells the parent, which shows the honest "not mapped yet" panel.
 *
 * Keyboard matches the global search palette: ↑↓ wrap through hits, Enter
 * opens the highlighted one, Escape dismisses. Focus stays in the field —
 * results are not in the tab order.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

import { searchMap, type MapSearchResult } from "@/lib/places/registry";
import { cn } from "@/lib/utils";

interface MapSearchProps {
  onPick: (placeId: string) => void;
  onPickGenre: (genre: string) => void;
  onMiss: (query: string) => void;
}

export function MapSearch({ onPick, onPickGenre, onMiss }: MapSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchMap(query), [query]);
  const listOpen = open && query.trim().length >= 2;

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!listOpen) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `#map-search-opt-${active}`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [active, listOpen]);

  // Close on outside click.
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function pick(r: MapSearchResult) {
    setQuery("");
    setOpen(false);
    if (r.kind === "genre") onPickGenre(r.slug);
    else onPick(r.place.id);
  }

  function submit() {
    if (results.length > 0) {
      pick(results[active] ?? results[0]);
    } else if (query.trim().length >= 2) {
      setOpen(false);
      onMiss(query.trim());
    }
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!listOpen) {
        setOpen(true);
        return;
      }
      if (results.length === 0) return;
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!listOpen) {
        setOpen(true);
        return;
      }
      if (results.length === 0) return;
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Home" && listOpen && results.length > 0) {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End" && listOpen && results.length > 0) {
      e.preventDefault();
      setActive(results.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (open) setOpen(false);
      else setQuery("");
    }
  }

  return (
    <div ref={rootRef} className="relative max-w-md">
      <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onInputKeyDown}
          placeholder="Search a genre, city, region, or country — historical names too"
          aria-label="Search genres and places, including historical names"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={listOpen}
          aria-controls="map-search-list"
          aria-activedescendant={
            listOpen && results.length > 0 ? `map-search-opt-${active}` : undefined
          }
          autoComplete="off"
          spellCheck={false}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
        />
      </div>

      {listOpen && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border bg-background shadow-md">
          <div
            ref={listRef}
            id="map-search-list"
            role="listbox"
            aria-label="Map search results"
            className="max-h-80 overflow-y-auto overscroll-contain p-1.5"
          >
            {results.map((r, i) => {
              const key =
                r.kind === "genre" ? `genre:${r.slug}` : `place:${r.place.id}`;
              const selected = i === active;
              return (
                <div
                  key={key}
                  id={`map-search-opt-${i}`}
                  role="option"
                  aria-selected={selected}
                  tabIndex={-1}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(r)}
                  className={cn(
                    "flex cursor-pointer items-baseline justify-between gap-3 rounded-md px-3 py-2 text-sm",
                    selected
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {r.kind === "genre" ? (
                    <>
                      <span className="text-foreground">
                        {r.name}
                        <span className="text-muted-foreground">
                          {" "}
                          · focus the map on this music
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground/70">
                        genre
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-foreground">
                        {r.place.name}
                        {r.matched !== r.place.name && (
                          <span className="text-muted-foreground">
                            {" "}
                            · {r.matched}
                            {r.era ? ` (${r.era})` : ""}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground/70">
                        {r.place.kind.replace("-", " ")}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
            {results.length === 0 && (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                Nothing mapped for &ldquo;{query.trim()}&rdquo; yet — press
                Enter to see why (and how to help).
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 border-t border-border px-3 py-1.5 text-[11px] text-muted-foreground">
            <span>
              <kbd className="font-mono">↑↓</kbd> navigate
            </span>
            <span>
              <kbd className="font-mono">↵</kbd> open
            </span>
            <span>
              <kbd className="font-mono">esc</kbd> close
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
