"use client";

/**
 * GenreFilter — a searchable dropdown that focuses the map on one genre.
 *
 * Picking a genre keeps only that genre's markers (see MusicMap's genreFilter);
 * the options are only genres that actually have mapped places, read from the
 * place registry so the control can never offer an empty filter. A "Show all
 * regions" item clears back to the default (nothing selected).
 */
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";

import { getGenre } from "@/lib/genres/registry";
import { mappedGenreSlugs, placesByGenre } from "@/lib/places/registry";
import { cn } from "@/lib/utils";

interface GenreOption {
  slug: string;
  name: string;
  count: number;
}

type ListItem = { slug: string | null; name: string; count?: number };

interface GenreFilterProps {
  value: string | null;
  onChange: (genre: string | null) => void;
}

export function GenreFilter({ value, onChange }: GenreFilterProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const options = useMemo<GenreOption[]>(
    () =>
      mappedGenreSlugs().map((slug) => ({
        slug,
        name: getGenre(slug)?.name ?? slug,
        count: placesByGenre(slug).length,
      })),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.name.toLowerCase().includes(q));
  }, [options, query]);

  // "Show all regions" stays in the list so ↑↓ can reach the clear action.
  const items = useMemo<ListItem[]>(
    () => [{ slug: null, name: "Show all regions" }, ...filtered],
    [filtered],
  );

  const selected = value ? options.find((o) => o.slug === value) : undefined;
  const selectedIndex = items.findIndex((item) => item.slug === value);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else setQuery("");
  }, [open]);

  useEffect(() => {
    setHighlight(selectedIndex >= 0 ? selectedIndex : 0);
  }, [query, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `#genre-opt-${highlight}`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  function choose(slug: string | null) {
    onChange(slug);
    setOpen(false);
  }

  function moveHighlight(delta: number) {
    const max = items.length - 1;
    if (max < 0) return;
    setHighlight((h) => Math.max(0, Math.min(max, h + delta)));
  }

  function onListKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveHighlight(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveHighlight(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = items[highlight];
      if (item) choose(item.slug);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="genre-filter-list"
        className={cn(
          "flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted",
          selected ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <SlidersHorizontal className="h-4 w-4 shrink-0" strokeWidth={1.75} />
        <span>{selected ? `Genre: ${selected.name}` : "Filter by genre"}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            open && "rotate-180",
          )}
          strokeWidth={1.75}
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-64 overflow-hidden rounded-md border bg-background shadow-md">
          <div className="border-b p-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onListKeyDown}
              placeholder="Search genres…"
              aria-label="Search genres"
              aria-autocomplete="list"
              aria-controls="genre-filter-list"
              aria-activedescendant={
                items.length ? `genre-opt-${highlight}` : undefined
              }
              className="w-full bg-transparent px-1 text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
            />
          </div>
          <ul
            ref={listRef}
            id="genre-filter-list"
            role="listbox"
            className="max-h-64 overflow-auto py-1"
          >
            {items.map((item, i) => {
              const active = i === highlight;
              const isSelected = item.slug === value;
              return (
                <li key={item.slug ?? "all"} role="option" aria-selected={active}>
                  <button
                    type="button"
                    id={`genre-opt-${i}`}
                    onClick={() => choose(item.slug)}
                    onMouseEnter={() => setHighlight(i)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm",
                      active ? "bg-muted" : "hover:bg-muted",
                    )}
                  >
                    <span
                      className={
                        item.slug === null && !isSelected
                          ? "text-muted-foreground"
                          : "text-foreground"
                      }
                    >
                      {item.name}
                    </span>
                    <span className="flex items-center gap-2">
                      {item.count != null && (
                        <span className="font-mono text-xs text-muted-foreground/70">
                          {item.count}
                        </span>
                      )}
                      {isSelected && (
                        <Check className="h-4 w-4 text-foreground" />
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                No genres match &ldquo;{query.trim()}&rdquo;.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
