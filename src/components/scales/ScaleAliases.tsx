import { cn } from "@/lib/utils";
import type { ScaleAlias } from "@/lib/scales/registry";
import { NativeSpelling } from "@/components/words/NativeSpelling";

interface ScaleAliasesProps {
  aliases: ScaleAlias[];
  /**
   * "line": one quiet sentence for hub cards — "Also Bhairavi · Kurd ·
   * Kürdî", names only, at most `max`. It reads as metadata next to the
   * formula, so the card's link stays the only control-shaped thing.
   * "header": every alias as a pill with its native script and tradition,
   * under a page title.
   */
  variant?: "line" | "header";
  max?: number;
  className?: string;
}

const LINE_MAX = 3;

/**
 * The other names a scale goes by. The same list feeds search and SEO;
 * this is the visible copy of it, so a reader who knows the notes as
 * Bhairavi sees that word on the Phrygian card and trusts they are in the
 * right place.
 */
export function ScaleAliases({
  aliases,
  variant = "line",
  max = LINE_MAX,
  className,
}: ScaleAliasesProps) {
  if (aliases.length === 0) return null;

  if (variant === "line") {
    const shown = aliases.slice(0, max);
    return (
      <p
        className={cn("text-xs text-muted-foreground", className)}
        aria-label="Other names for this scale"
      >
        <span className="text-muted-foreground/70">Also </span>
        {shown.map((a, i) => (
          <span key={a.name}>
            {i > 0 && <span className="text-muted-foreground/50"> · </span>}
            {a.name}
          </span>
        ))}
      </p>
    );
  }

  return (
    <div className={cn("mt-3", className)}>
      <span className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Also called
      </span>
      <ul className="flex flex-wrap items-center gap-1.5" aria-label="Other names for this scale">
        {aliases.map((a) => (
          <li key={a.name}>
            <Pill alias={a} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pill({ alias }: { alias: ScaleAlias }) {
  return (
    <span
      className="inline-flex items-baseline gap-1.5 rounded-full border border-border bg-muted/30 px-2.5 py-1 text-xs leading-none"
      title={alias.approx ? "Same shape; tuned or ornamented differently" : undefined}
    >
      {alias.approx && (
        <span aria-label="approximately" className="text-muted-foreground">
          ≈
        </span>
      )}
      <span className="text-foreground">{alias.name}</span>
      <NativeSpelling id={alias.name} className="text-xs" />
      {alias.tradition && (
        <span className="text-[10px] text-muted-foreground">{alias.tradition}</span>
      )}
    </span>
  );
}
