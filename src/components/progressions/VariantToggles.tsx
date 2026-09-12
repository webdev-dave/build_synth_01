"use client";

import { cn } from "@/lib/utils";
import { useProgression } from "./ProgressionProvider";

interface VariantTogglesProps {
  className?: string;
}

/**
 * The chart's named alternatives (quick change, turnaround). Each toggle
 * changes the cells *and* what the player sounds — the same `bars` feed
 * both — and its caption reads the diff the way `ScaleComparer` does:
 * which bar, from what, to what, in this key, then the musical reason.
 */
export function VariantToggles({ className }: VariantTogglesProps) {
  const { progression, variantIds, toggleVariant, nameOf } = useProgression();
  const variants = progression.variants ?? [];
  if (variants.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {variants.map((v) => {
        const on = variantIds.includes(v.id);
        const diffs = v.edits.map((e) => {
          const from = progression.bars[e.bar].chord;
          return `bar ${e.bar + 1} from ${from.numeral} (${nameOf(from)}) to ${e.chord.numeral} (${nameOf(e.chord)})`;
        });
        return (
          <div key={v.id}>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={on}
                onChange={() => toggleVariant(v.id)}
                className="h-3.5 w-3.5 accent-emerald-600"
              />
              {v.label}
            </label>
            <p className="mt-1 pl-[1.375rem] text-xs leading-relaxed text-muted-foreground">
              <span className="font-mono">{v.label}</span> swaps {diffs.join(" and ")} — {v.blurb}
            </p>
          </div>
        );
      })}
    </div>
  );
}
