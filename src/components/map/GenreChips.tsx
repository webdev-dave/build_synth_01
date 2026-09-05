"use client";

/**
 * GenreChips — the horizontal roster of genres under the full map when a
 * place is selected. The mirror of `PlaceChips`: pick a location, then pivot
 * into any genre that lives there. The genre matching the active lens (if any)
 * lights orange.
 */
import { cn } from "@/lib/utils";

export interface GenreChip {
  slug: string;
  name: string;
}

interface GenreChipsProps {
  genres: GenreChip[];
  activeSlug: string | null;
  onPick: (slug: string) => void;
}

export function GenreChips({ genres, activeSlug, onPick }: GenreChipsProps) {
  if (genres.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
      <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground/70">
        genres
      </span>
      {genres.map((g) => {
        const active = g.slug === activeSlug;
        return (
          <button
            key={g.slug}
            type="button"
            aria-pressed={active}
            onClick={() => onPick(g.slug)}
            className={cn(
              "rounded px-1.5 py-0.5 transition-colors",
              active ? "text-orange-500" : "text-foreground hover:bg-muted",
            )}
          >
            {g.name}
          </button>
        );
      })}
    </div>
  );
}
