"use client";

/**
 * Shared chrome for catalog hub lists: count heading, search field,
 * optional filter chips, and a dashed empty state.
 */
import type { ReactNode } from "react";
import { Search, X } from "lucide-react";

import type { GenreOption } from "@/lib/search/options";
import { cn } from "@/lib/utils";

export interface HubChip {
  id: string;
  label: string;
  pressed: boolean;
  onToggle: () => void;
}

export interface HubChipGroup {
  label: string;
  chips: HubChip[];
}

export function genreChipGroup(
  options: GenreOption[],
  selected: string | undefined,
  onChange: (slug: string | undefined) => void,
): HubChipGroup {
  return {
    label: "Genre",
    chips: options.map((genre) => ({
      id: genre.slug,
      label: genre.name,
      pressed: selected === genre.slug,
      onToggle: () =>
        onChange(selected === genre.slug ? undefined : genre.slug),
    })),
  };
}

export function toggleChipGroup(
  label: string,
  chips: Array<{ id: string; label: string }>,
  selected: string | undefined,
  onChange: (id: string | undefined) => void,
): HubChipGroup {
  return {
    label,
    chips: chips.map((chip) => ({
      id: chip.id,
      label: chip.label,
      pressed: selected === chip.id,
      onToggle: () => onChange(selected === chip.id ? undefined : chip.id),
    })),
  };
}

export function HubSearch({
  headingId,
  heading,
  query,
  onQueryChange,
  placeholder,
  searchLabel,
  controlsId,
  groups,
  empty,
  onClearFilters,
  children,
}: {
  headingId: string;
  heading: string;
  query: string;
  onQueryChange: (value: string) => void;
  placeholder: string;
  searchLabel: string;
  controlsId: string;
  groups?: HubChipGroup[];
  empty?: string;
  onClearFilters?: () => void;
  children: ReactNode;
}) {
  const filtering = query.trim().length > 0;
  const visibleGroups = (groups ?? []).filter((group) => group.chips.length > 0);

  return (
    <section aria-labelledby={headingId}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id={headingId}
          className="text-sm font-medium text-muted-foreground"
        >
          {heading}
        </h2>
        <div className="flex w-full items-center gap-2 rounded-md border bg-background px-3 py-2 sm:max-w-md">
          <Search
            className="h-4 w-4 shrink-0 text-muted-foreground"
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={placeholder}
            aria-label={searchLabel}
            aria-controls={controlsId}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
          />
          {filtering && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="rounded-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>

      {visibleGroups.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          {visibleGroups.map((group) => (
            <div
              key={group.label}
              role="group"
              aria-label={group.label}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="text-xs text-muted-foreground">{group.label}</span>
              {group.chips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  aria-pressed={chip.pressed}
                  onClick={chip.onToggle}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                    chip.pressed
                      ? "border-foreground/40 bg-accent text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-foreground/25 hover:text-foreground",
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {empty ? (
        <div
          id={controlsId}
          role="status"
          className="rounded-lg border border-dashed px-4 py-8 text-center"
        >
          <p className="text-sm text-muted-foreground">{empty}</p>
          {onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="mt-3 text-sm font-medium text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
