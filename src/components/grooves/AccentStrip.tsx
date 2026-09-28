"use client";

/**
 * Two rows, not one. "The bar says": metric weight per beat (ONE two THREE
 * four). "The drums say": where this groove actually lands its weight. The
 * backbeat is the picture where the rows disagree; a waltz is where they
 * agree. Meter pages lead with the first row, groove pages with the second.
 */
import { drumWeights, metricWeights } from "@/lib/music/grooves";
import { cn } from "@/lib/utils";
import { useGroove } from "./GrooveProvider";

type RowKind = "bar" | "drums";

interface AccentStripProps {
  rows?: readonly RowKind[];
  className?: string;
}

const ROW_LABEL: Record<RowKind, string> = {
  bar: "The bar says",
  drums: "The drums say",
};

export function AccentStrip({ rows = ["bar", "drums"], className }: AccentStripProps) {
  const { pattern, currentBeat, beatsPerBar } = useGroove();
  const weights: Record<RowKind, number[]> = {
    bar: metricWeights(pattern.meter),
    drums: drumWeights(pattern),
  };

  return (
    <div className={cn("space-y-2", className)} role="group" aria-label="Accents per beat">
      {rows.map((kind) => (
        <div key={kind} className="flex items-end gap-3">
          <span className="w-[6.5rem] shrink-0 pb-1 text-[11px] leading-none text-muted-foreground">
            {ROW_LABEL[kind]}
          </span>
          <ol
            className="grid flex-1 items-end gap-2"
            style={{ gridTemplateColumns: `repeat(${beatsPerBar}, minmax(0, 1fr))` }}
          >
            {weights[kind].map((w, b) => (
              <li key={b} className="flex flex-col items-center gap-1">
                <span
                  aria-hidden
                  className={cn(
                    "block w-full rounded-sm transition-colors",
                    currentBeat === b ? "bg-orange-600" : w > 0 ? "bg-foreground/70" : "bg-border",
                  )}
                  style={{ height: `${Math.max(3, Math.round(w * 28))}px` }}
                />
                <span
                  className={cn(
                    "font-mono text-[11px] leading-none",
                    w >= 1 ? "text-foreground" : "text-muted-foreground",
                  )}
                  aria-label={`Beat ${b + 1}, weight ${Math.round(w * 100)}%`}
                >
                  {b + 1}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
