"use client";

/**
 * One-shot "hear this word" control. Click is the audio consent.
 *
 * Plays a **real human recording** (`word.audio`, self-hosted under
 * `/public/audio/words`). No synthetic text-to-speech — a word without a
 * verified recording shows no speaker at all (callers gate on `hasAudio`).
 */
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Volume2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SpokenWord, WordAudio } from "@/lib/words/registry";

interface PronounceButtonProps {
  word: SpokenWord & { audio: WordAudio };
  className?: string;
}

export function PronounceButton({ word, className }: PronounceButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  function play(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    let el = audioRef.current;
    if (!el) {
      el = new Audio(word.audio.src);
      el.preload = "none";
      el.onended = () => setPlaying(false);
      el.onerror = () => setPlaying(false);
      audioRef.current = el;
    }
    el.currentTime = 0;
    setPlaying(true);
    void el.play().catch(() => setPlaying(false));
  }

  const credit = word.audio.source
    ? ` — recording: ${word.audio.source}`
    : "";

  return (
    <button
      type="button"
      onClick={play}
      aria-label={`Hear ${word.latin} pronounced${credit}`}
      title={`Hear ${word.latin}${credit}`}
      className={cn(
        "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm align-text-bottom text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        playing && "text-emerald-600 hover:text-emerald-600",
        className,
      )}
    >
      <Volume2 className="h-3.5 w-3.5" aria-hidden />
    </button>
  );
}
