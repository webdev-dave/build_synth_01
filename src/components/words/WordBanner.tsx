"use client";

/**
 * Page-header treatment of a loanword: the native spelling at reading size,
 * the language name, and — when we have a real human recording — a listen
 * button with a small source credit. No recording ⇒ no button.
 */
import { cn } from "@/lib/utils";
import { hasAudio, type SpokenWord } from "@/lib/words/registry";
import { PronounceButton } from "./PronounceButton";
import { EnglishAlts } from "./EnglishAlts";
import { NativeScript } from "./NativeScript";

interface WordBannerProps {
  word: SpokenWord;
  className?: string;
}

export function WordBanner({ word, className }: WordBannerProps) {
  const audio = hasAudio(word) ? word.audio : undefined;

  return (
    <p
      className={cn(
        "mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1",
        className,
      )}
    >
      <NativeScript
        spelling={word.native.spelling}
        lang={word.native.lang}
        className="text-xl font-medium tracking-tight text-foreground"
      />
      {hasAudio(word) && (
        <PronounceButton word={word} className="h-7 w-7 hover:bg-accent" />
      )}
      <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
        {word.native.language}
      </span>
      <EnglishAlts word={word} className="basis-full" />
      {audio?.source && (
        <span className="basis-full text-xs text-muted-foreground">
          Pronunciation:{" "}
          {audio.sourceUrl ? (
            <a
              href={audio.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              {audio.source}
            </a>
          ) : (
            audio.source
          )}
          {audio.license ? ` (${audio.license})` : ""}
        </span>
      )}
    </p>
  );
}
