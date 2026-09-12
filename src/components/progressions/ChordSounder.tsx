"use client";

import { useMemo, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  unionPitchClasses,
  withSeventh,
  type ChordSpec,
} from "@/lib/music/chords";
import { cn } from "@/lib/utils";
import { useProgression } from "./ProgressionProvider";
import { ProgressionKeyboard } from "./ProgressionKeyboard";
import { ProgressionToolbar } from "./ProgressionToolbar";
import { ChordToneStrip } from "./ChordToneStrip";

interface ChordSounderProps {
  /** Chords to offer, in button order (triads or sevenths as written). */
  chords: readonly ChordSpec[];
  /** Offer a "+7" toggle that adds the seventh to every button. */
  seventhToggle?: boolean;
  /** Start with the seventh on. */
  defaultSeventh?: boolean;
  /**
   * Ring every note any pressed chord has used so far and count them — the
   * "three chords cover the whole key" fact, seen as the reader presses.
   */
  union?: boolean;
  keyboard?: boolean;
  strip?: boolean;
  /** Extra caption under the strip (the lesson's own sentence about this chord). */
  caption?: (spec: ChordSpec) => ReactNode;
  className?: string;
}

const mod12 = (n: number) => ((n % 12) + 12) % 12;

/**
 * One chord at a time on the keyboard. Press a numeral to hear it and see
 * its tones lit; the strip below reads the chord-relative roles (root,
 * 3rd, 5th, 7th) with the note names in the current key, so scale-degree
 * literacy from /scales carries straight over to chords.
 */
export function ChordSounder({
  chords,
  seventhToggle = false,
  defaultSeventh = false,
  union = false,
  keyboard = true,
  strip = true,
  caption,
  className,
}: ChordSounderProps) {
  const { nameOf, soundChord, keyRootPc, keyName, nameOfPc } = useProgression();
  const [index, setIndex] = useState(0);
  const [seventh, setSeventh] = useState(defaultSeventh);
  const [visited, setVisited] = useState<number[]>([]);

  const shown = useMemo(
    () => chords.map((c) => (seventh ? withSeventh(c) : c)),
    [chords, seventh],
  );
  const selected = shown[Math.min(index, shown.length - 1)];

  const press = (i: number) => {
    setIndex(i);
    soundChord(shown[i]);
    if (union) setVisited((v) => (v.includes(i) ? v : [...v, i]));
  };

  const unionPcs = useMemo(
    () => (union ? unionPitchClasses(keyRootPc, visited.map((i) => shown[i])) : []),
    [union, keyRootPc, visited, shown],
  );

  return (
    <div className={cn("space-y-3", className)}>
      <ProgressionToolbar octave={keyboard}>
        <div role="group" aria-label="Chords" className="inline-flex overflow-hidden rounded-md border border-input">
          {shown.map((spec, i) => {
            const on = i === index;
            return (
              <button
                key={spec.numeral}
                type="button"
                aria-pressed={on}
                onClick={() => press(i)}
                className={cn(
                  "flex min-w-14 flex-col items-center border-l border-input px-3 py-1.5 transition-colors first:border-l-0",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  on
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
              >
                <span className="font-mono text-sm leading-none">{spec.numeral}</span>
                <span className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
                  {nameOf(spec)}
                </span>
              </button>
            );
          })}
        </div>
        {seventhToggle && (
          <Button
            type="button"
            variant={seventh ? "secondary" : "outline"}
            size="sm"
            aria-pressed={seventh}
            onClick={() => {
              setSeventh((s) => !s);
              // Re-sound the held chord so the toggle is heard, not just read.
              soundChord(seventh ? chords[index] : withSeventh(chords[index]));
            }}
            className="font-mono"
          >
            +7
          </Button>
        )}
      </ProgressionToolbar>

      {strip && <ChordToneStrip chord={selected} />}
      {caption && (
        <p className="text-xs leading-relaxed text-muted-foreground" aria-live="polite">
          {caption(selected)}
        </p>
      )}

      {keyboard && <ProgressionKeyboard chord={selected} mode="chord" />}

      {union && (
        <p className="text-xs leading-relaxed text-muted-foreground" aria-live="polite">
          {visited.length === 0 ? (
            <>Press each chord once and watch how many different keys the three of them touch.</>
          ) : (
            <>
              So far {visited.map((i) => shown[i].numeral).join(", ")} have used{" "}
              <span className="font-mono text-foreground">{unionPcs.length}</span> different
              notes in {keyName}:{" "}
              <span className="font-mono text-foreground">
                {unionPcs
                  .slice()
                  .sort((a, b) => mod12(a - keyRootPc) - mod12(b - keyRootPc))
                  .map(nameOfPc)
                  .join(" ")}
              </span>
              {unionPcs.length === 7 && " — every note of the major scale."}
            </>
          )}
        </p>
      )}
    </div>
  );
}
