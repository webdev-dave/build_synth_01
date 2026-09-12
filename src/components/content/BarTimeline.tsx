"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface BarCell {
  /** Mono top line — a Roman numeral, a bar number. */
  top: ReactNode;
  /** Second line — the concrete chord in the current key, a lyric role. */
  bottom?: ReactNode;
  /** Spoken label for the button ("Bar 5, IV7, D7"). */
  label: string;
  /** This cell differs from the plain version — a variant toggle's diff. */
  changed?: boolean;
}

export interface BarSpan {
  /** First cell index (0-based) and how many cells it covers. */
  from: number;
  length: number;
  label: ReactNode;
  /** Call / response halves of a phrase read differently. */
  tone?: "call" | "response" | "neutral";
}

interface BarTimelineProps {
  cells: BarCell[];
  /** Cells per row — four bars to a line, as a chart is written. */
  perRow?: number;
  /** The sounding cell — the page's one burnt-orange accent. */
  current: number | null;
  /** The cell arriving next — a thin outline, a calm cue rather than a pulse. */
  upcoming?: number | null;
  /** Section spans drawn above the cells they cover (forms). */
  spans?: BarSpan[];
  onSelect?: (index: number) => void;
  /** Visible label for the list, e.g. "12-bar blues chart". */
  ariaLabel: string;
  className?: string;
}

/**
 * N cells in rows of a bar-group. Progressions fill cells with chords;
 * forms fill spans with sections. Width is time: every cell is the same
 * width, so a four-bar phrase is visibly a row. Click a cell to select it
 * (sound it, jump to it); the current cell is lit in burnt orange.
 */
export function BarTimeline({
  cells,
  perRow = 4,
  current,
  upcoming = null,
  spans,
  onSelect,
  ariaLabel,
  className,
}: BarTimelineProps) {
  const rows: number[][] = [];
  for (let i = 0; i < cells.length; i += perRow) {
    rows.push(cells.slice(i, i + perRow).map((_, j) => i + j));
  }

  return (
    <div className={cn("space-y-1.5", className)} role="group" aria-label={ariaLabel}>
      {rows.map((row, r) => {
        const rowSpans = (spans ?? []).filter(
          (s) => s.from >= row[0] && s.from <= row[row.length - 1],
        );
        return (
          <div key={r} className="space-y-1">
            {rowSpans.length > 0 && (
              <div
                className="grid gap-1.5"
                style={{ gridTemplateColumns: `repeat(${perRow}, minmax(0, 1fr))` }}
              >
                {rowSpans.map((s) => (
                  <div
                    key={`${s.from}-${s.length}`}
                    style={{
                      gridColumn: `${s.from - row[0] + 1} / span ${Math.min(
                        s.length,
                        perRow - (s.from - row[0]),
                      )}`,
                    }}
                    className={cn(
                      "truncate rounded-sm border-b px-1 pb-0.5 text-[11px] leading-tight",
                      s.tone === "call" && "border-foreground/40 text-foreground",
                      s.tone === "response" && "border-dashed border-muted-foreground/50 text-muted-foreground",
                      (!s.tone || s.tone === "neutral") && "border-border text-muted-foreground",
                    )}
                  >
                    {s.label}
                  </div>
                ))}
              </div>
            )}
            <ol
              className="grid gap-1.5"
              style={{ gridTemplateColumns: `repeat(${perRow}, minmax(0, 1fr))` }}
            >
              {row.map((i) => {
                const cell = cells[i];
                const isCurrent = current === i;
                const isUpcoming = !isCurrent && upcoming === i;
                const content = (
                  <>
                    <span className="block font-mono text-sm leading-none">{cell.top}</span>
                    {cell.bottom !== undefined && (
                      <span
                        className={cn(
                          "mt-1 block truncate text-[11px] leading-none",
                          isCurrent ? "text-orange-600/90" : "text-muted-foreground",
                        )}
                      >
                        {cell.bottom}
                      </span>
                    )}
                    {cell.changed && (
                      <span
                        aria-hidden
                        className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-muted-foreground/60"
                      />
                    )}
                  </>
                );
                const classes = cn(
                  "relative flex min-h-10 w-full flex-col items-start justify-center rounded-md border px-2 py-1.5 text-left transition-colors",
                  isCurrent
                    ? "border-orange-600 bg-orange-700/10 text-orange-600"
                    : "bg-background text-foreground",
                  isUpcoming && "border-foreground/40",
                  onSelect && !isCurrent && "hover:border-foreground/25 hover:bg-accent/40",
                );
                return (
                  <li key={i} className="min-w-0">
                    {onSelect ? (
                      <button
                        type="button"
                        aria-label={cell.label}
                        aria-current={isCurrent ? "true" : undefined}
                        onClick={() => onSelect(i)}
                        className={classes}
                      >
                        {content}
                      </button>
                    ) : (
                      <div aria-label={cell.label} aria-current={isCurrent ? "true" : undefined} className={classes}>
                        {content}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        );
      })}
    </div>
  );
}
