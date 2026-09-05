/**
 * Quiet "also spelled …" line for the 1–2 common English variants.
 * Used on spoke banners and the Term popover — not inline in a sentence.
 */
import { cn } from "@/lib/utils";
import { englishAlts, type SpokenWord } from "@/lib/words/registry";

interface EnglishAltsProps {
  word: SpokenWord;
  /** The Latin already on screen, so we don't repeat it. */
  mention?: string;
  className?: string;
}

export function EnglishAlts({ word, mention, className }: EnglishAltsProps) {
  const alts = englishAlts(word, mention);
  if (alts.length === 0) return null;

  return (
    <span
      className={cn(
        "block font-mono text-xs text-muted-foreground",
        className,
      )}
    >
      also spelled {alts.join(", ")}
    </span>
  );
}
