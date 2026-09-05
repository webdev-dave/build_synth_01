"use client";

/**
 * Native-script spelling + listen button, phrasing-level so it can sit
 * inside a <p> next to a term.
 */
import {
  hasAudio,
  spellingDiffers,
  type SpokenWord,
} from "@/lib/words/registry";
import { PronounceButton } from "./PronounceButton";
import { NativeScript } from "./NativeScript";

interface WordMarkProps {
  word: SpokenWord;
  /** The Latin as written in the sentence; hides a redundant parenthetical. */
  mention?: string;
}

export function WordMark({ word, mention }: WordMarkProps) {
  const shown = mention ?? word.latin;
  const showSpelling = spellingDiffers(shown, word.native.spelling);

  return (
    <>
      {showSpelling && (
        <>
          {" "}
          <span className="text-muted-foreground">
            (
            <NativeScript
              spelling={word.native.spelling}
              lang={word.native.lang}
            />
            )
          </span>
        </>
      )}
      {hasAudio(word) && (
        <>
          {" "}
          <PronounceButton word={word} />
        </>
      )}
    </>
  );
}
