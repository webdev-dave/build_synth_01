"use client";

/**
 * Native-script spelling + listen button, phrasing-level so it can sit
 * inside a <p> next to a term.
 */
import {
  hasAudio,
  nativesOf,
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
  const forms = nativesOf(word).filter((form) =>
    spellingDiffers(shown, form.spelling),
  );
  const hear = hasAudio(word);

  return (
    <>
      {forms.map((form) => (
        <span key={`${form.lang}:${form.spelling}`}>
          {" "}
          <span className="text-muted-foreground">
            (
            <NativeScript spelling={form.spelling} lang={form.lang} />
            )
          </span>
          {hear && form === word.native && (
            <>
              {" "}
              <PronounceButton word={word} />
            </>
          )}
        </span>
      ))}
      {hear && !forms.includes(word.native) && (
        <>
          {" "}
          <PronounceButton word={word} />
        </>
      )}
    </>
  );
}
