"use client";

/**
 * PlaceChips — the horizontal roster of places under a filtered map.
 *
 * Shared by the embedded region-map (`EmbeddedMap`) and the full map
 * (`MapExplorer`, once a genre lens is on), so the two never drift. Every
 * place stays visible; the selected one lights orange (matching its tint on
 * the map) and a second tap toggles it off.
 */
import { cn } from "@/lib/utils";
import type { Place } from "@/lib/places/registry";

interface PlaceChipsProps {
  places: Place[];
  selectedId: string | null;
  /** Toggle a place: pick it, or clear it if it's already selected. */
  onToggle: (id: string | null) => void;
}

export function PlaceChips({ places, selectedId, onToggle }: PlaceChipsProps) {
  if (places.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
      <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground/70">
        places
      </span>
      {places.map((p) => {
        const active = p.id === selectedId;
        return (
          <button
            key={p.id}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(active ? null : p.id)}
            className={cn(
              "rounded px-1.5 py-0.5 transition-colors",
              active ? "text-orange-500" : "text-foreground hover:bg-muted",
            )}
          >
            {p.name}
          </button>
        );
      })}
    </div>
  );
}
