"use client";

/**
 * An inline loanword: native spelling + a listen button.
 *
 *   <Word id="klezmer">klezmer</Word>
 *
 * For theory terms that already have a glossary entry, use <Term> instead —
 * it looks up the same registry and adds the definition popover.
 */
import { getWord } from "@/lib/words/registry";
import { WordMark } from "./WordMark";

interface WordProps {
  id: string;
  children?: React.ReactNode;
}

export function Word({ id, children }: WordProps) {
  const word = getWord(id);
  if (!word) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`<Word> unknown id: "${id}"`);
    }
    return <>{children ?? id}</>;
  }

  const mention = typeof children === "string" ? children : undefined;

  return (
    <span className="inline">
      {children ?? word.latin}
      <span className="whitespace-nowrap">
        <WordMark word={word} mention={mention} />
      </span>
    </span>
  );
}
