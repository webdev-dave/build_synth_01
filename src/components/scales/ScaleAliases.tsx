import { cn } from "@/lib/utils";
import type { ScaleAlias } from "@/lib/scales/registry";
import { NativeSpelling } from "@/components/words/NativeSpelling";

interface ScaleAliasesProps {
  aliases: ScaleAlias[];
  /**
   * "tile": names only, at most `max` pills plus a "+N more" pill — a hub
   * card has to stay scannable. "header": every alias as a pill with its
   * native script and tradition.
   */
  variant?: "tile" | "header";
  max?: number;
  className?: string;
}

const TILE_MAX = 3;

/**
 * "Also called …" — the other names a scale goes by, as pills. The same
 * list feeds search and SEO; this is the visible copy of it, so a reader
 * who knows the notes as Bhairavi sees that word on the Phrygian card and
 * trusts they are in the right place.
 */
export function ScaleAliases({
  aliases,
  variant = "tile",
  max = TILE_MAX,
  className,
}: ScaleAliasesProps) {
  if (aliases.length === 0) return null;
  const header = variant === "header";
  const shown = header ? aliases : aliases.slice(0, max);
  const hidden = aliases.length - shown.length;

  return (
    <div className={cn(header ? "mt-3" : "mt-2", className)}>
      <span
        className={cn(
          "block text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
          header ? "mb-2" : "mb-1.5",
        )}
      >
        Also called
      </span>
      <ul className="flex flex-wrap gap-1.5" aria-label="Other names for this scale">
        {shown.map((a) => (
          <li key={a.name}>
            <Pill header={header} alias={a} />
          </li>
        ))}
        {hidden > 0 && (
          <li>
            <span className="inline-flex items-center rounded-full border border-dashed border-border px-2 py-0.5 text-[11px] text-muted-foreground">
              +{hidden} more
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}

function Pill({ alias, header }: { alias: ScaleAlias; header: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-1.5 rounded-full border border-border bg-muted/30 leading-none",
        header ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[11px]",
      )}
      title={header && alias.approx ? "Same shape; tuned or ornamented differently" : undefined}
    >
      {header && alias.approx && (
        <span aria-label="approximately" className="text-muted-foreground">
          ≈
        </span>
      )}
      <span className="text-foreground">{alias.name}</span>
      {header && <NativeSpelling id={alias.name} className="text-xs" />}
      {header && alias.tradition && (
        <span className="text-[10px] text-muted-foreground">{alias.tradition}</span>
      )}
    </span>
  );
}
