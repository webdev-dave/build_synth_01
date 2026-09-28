"use client";

/**
 * Quiet "also spelled …" line for the 1–2 common English variants.
 * Used on spoke banners and the Term popover — not inline in a sentence.
 * When a recording says one of those spellings, the speaker sits on that word.
 */
import { cn } from "@/lib/utils";
import { englishAlts, hasAudio, type SpokenWord } from "@/lib/words/registry";
import { PronounceButton } from "./PronounceButton";

interface EnglishAltsProps {
  word: SpokenWord;
  /** The Latin already on screen, so we don't repeat it. */
  mention?: string;
  className?: string;
}

export function EnglishAlts({ word, mention, className }: EnglishAltsProps) {
  const alts = englishAlts(word, mention);
  if (alts.length === 0) return null;
  const said = word.audioSays?.toLowerCase();

  return (
    <span
      className={cn(
        "block font-mono text-base text-muted-foreground",
        className,
      )}
    >
      also spelled{" "}
      {alts.map((alt, i) => (
        <span key={alt}>
          {i > 0 ? ", " : null}
          {alt}
          {hasAudio(word) && said === alt.toLowerCase() && (
            <>
              {" "}
              <PronounceButton word={word} />
            </>
          )}
        </span>
      ))}
    </span>
  );
}
