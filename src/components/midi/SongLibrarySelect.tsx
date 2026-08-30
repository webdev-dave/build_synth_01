"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronsUpDown } from "lucide-react";

import { searchSongs, type SongEntry } from "@/lib/songs";
import { cn } from "@/lib/utils";

type Props = {
  songs: SongEntry[];
  selectedId: string;
  onSelect: (song: SongEntry) => void;
};

/**
 * Searchable song picker. Focus the field and type or paste to filter;
 * click a row to load that catalog entry onto the roll.
 */
export function SongLibrarySelect({ songs, selectedId, onSelect }: Props) {
  const selected = songs.find((song) => song.id === selectedId);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => searchSongs(query, songs), [query, songs]);

  useEffect(() => {
    setHighlight(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setHighlight(0);
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [open]);

  const pick = (song: SongEntry) => {
    onSelect(song);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative" data-song-library="">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls="song-library-list"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 max-w-[18rem] items-center gap-2 rounded-md border border-border bg-card px-3 text-sm hover:bg-accent"
      >
        <span className="text-muted-foreground">Song</span>
        <span className="min-w-0 truncate font-medium">
          {selected?.title ?? "Library"}
        </span>
        <ChevronsUpDown className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-72 rounded-md border border-border bg-background shadow-md">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlight((i) => Math.min(i + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlight((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                const song = filtered[highlight];
                if (song) pick(song);
              }
            }}
            placeholder="Search title or label…"
            className="w-full border-b border-border bg-transparent px-3 py-2 font-mono text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Search song library"
            aria-autocomplete="list"
            aria-controls="song-library-list"
          />
          <ul
            id="song-library-list"
            role="listbox"
            className="max-h-80 overflow-auto py-1"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                No matches
              </li>
            ) : (
              filtered.map((song, i) => (
                <li key={song.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={song.id === selectedId}
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => pick(song)}
                    className={cn(
                      "flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-accent",
                      i === highlight && "bg-accent",
                    )}
                  >
                    <span className="font-medium">{song.title}</span>
                    {song.subtitle ? (
                      <span className="text-xs text-muted-foreground">
                        {song.subtitle}
                      </span>
                    ) : null}
                    {song.labels.length > 0 ? (
                      <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {song.labels.join(" · ")}
                      </span>
                    ) : null}
                    {song.source?.filename ? (
                      <span className="font-mono text-[10px] text-muted-foreground/80">
                        {song.source.filename}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
