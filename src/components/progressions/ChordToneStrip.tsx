"use client";

import type { ChordSpec } from "@/lib/music/chords";
import { cn } from "@/lib/utils";
import { useProgression } from "./ProgressionProvider";

interface ChordToneStripProps {
  chord?: ChordSpec;
  className?: string;
}

/**
 * The chord's tones as chips: role on top (root · 3rd · 5th · 7th), the
 * note name in the current key below, and the key-relative degree small —
 * the `DegreeStrip` idea, chord-relative. Click a chip to hear that one
 * note and see its key light.
 */
export function ChordToneStrip({ chord, className }: ChordToneStripProps) {
  const { currentChord, tonesOf, nameOf, soundNote, clickSounding, lastPressed } =
    useProgression();
  const spec = chord ?? currentChord;
  const tones = tonesOf(spec);

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)} role="group" aria-label={`Notes of ${nameOf(spec)}`}>
      {tones.map((t) => {
        const sounding = clickSounding && lastPressed === t.midi;
        return (
          <button
            key={t.midi}
            type="button"
            onClick={() => soundNote(t.midi)}
            aria-label={`${t.role} of ${nameOf(spec)}: ${t.name}`}
            className={cn(
              "flex min-w-14 flex-col items-center rounded-md border px-2.5 py-1.5 transition-colors",
              sounding
                ? "border-orange-600 bg-orange-700/10 text-orange-600"
                : "text-foreground hover:border-foreground/25 hover:bg-accent/40",
            )}
          >
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {t.role}
            </span>
            <span className="mt-0.5 font-mono text-sm leading-none">{t.name}</span>
            <span className="mt-1 font-mono text-[10px] leading-none text-muted-foreground">
              {t.degree}
            </span>
          </button>
        );
      })}
    </div>
  );
}
