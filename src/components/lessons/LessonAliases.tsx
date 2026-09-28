import { cn } from "@/lib/utils";

interface LessonAliasesProps {
  /** Plain other names ("Blues changes", "Three-chord blues"). */
  aliases: readonly string[];
  /**
   * "line": one quiet sentence for hub cards — "Also Blues changes ·
   * Three-chord blues", at most `max`. "header": every alias as a pill
   * under a page title.
   */
  variant?: "line" | "header";
  max?: number;
  /** Spoken label for the list ("Other names for this progression"). */
  noun?: string;
  className?: string;
}

const LINE_MAX = 3;

/**
 * The other names a lesson entry goes by, for modules whose aliases are
 * plain strings (progressions, grooves, forms). The scale module keeps its
 * own `ScaleAliases` because its aliases carry a tradition and a native
 * script; this is the same visual language without those slots.
 */
export function LessonAliases({
  aliases,
  variant = "line",
  max = LINE_MAX,
  noun = "this page",
  className,
}: LessonAliasesProps) {
  if (aliases.length === 0) return null;
  const label = `Other names for ${noun}`;

  if (variant === "line") {
    const shown = aliases.slice(0, max);
    return (
      <p className={cn("text-xs text-muted-foreground", className)} aria-label={label}>
        <span className="text-muted-foreground/70">Also </span>
        {shown.map((name, i) => (
          <span key={name}>
            {i > 0 && <span className="text-muted-foreground/50"> · </span>}
            {name}
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
      <ul className="flex flex-wrap items-center gap-1.5" aria-label={label}>
        {aliases.map((name) => (
          <li key={name}>
            <span className="inline-flex items-center rounded-full border border-border bg-muted/30 px-2.5 py-1 text-xs leading-none text-foreground">
              {name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
