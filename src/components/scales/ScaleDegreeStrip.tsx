"use client";

import { useMemo } from "react";

import { spellDegrees, type ScaleDegree } from "@/lib/music/scaleCatalog";
import { cn } from "@/lib/utils";

interface ScaleDegreeStripProps {
  degrees: ScaleDegree[];
  /** Root pitch class 0–11 — turns degree offsets into real note names. */
  rootPitchClass: number;
  /**
   * Offset to spotlight (burnt orange) — the one note the lesson is about.
   * One accent per view: only the blue note gets it.
   */
  spotlightOffset?: number;
  /** Currently sounding offset, if any (lights the chip while it plays). */
  activeOffset?: number | null;
  /** Play this degree (semitones above root). Chips are buttons, not a poster. */
  onPlay: (offset: number) => void;
  className?: string;
}

/**
 * A scale as a row of clickable degree chips: degree number on top, the real
 * note name (for the current root) underneath in mono. Click to hear it.
 */
export function ScaleDegreeStrip({
  degrees,
  rootPitchClass,
  spotlightOffset,
  activeOffset,
  onPlay,
  className,
}: ScaleDegreeStripProps) {
  // Spelled as a set, not note by note: a 7-note scale gets one letter per
  // degree, so the strip reads E F G♯ A B C D rather than E F A♭ A B C D.
  const names = useMemo(
    () => spellDegrees(rootPitchClass, degrees),
    [rootPitchClass, degrees],
  );

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {degrees.map(({ offset, label }, i) => {
        const isSpotlight = offset === spotlightOffset;
        const isActive = offset === activeOffset;
        const note = names[i];
        return (
          <button
            key={offset}
            onClick={() => onPlay(offset)}
            aria-label={`Play ${note}, scale degree ${label}`}
            className={cn(
              "flex min-w-12 flex-col items-center rounded-md border px-2.5 py-1.5 transition-colors",
              isSpotlight
                ? "border-orange-700/70 bg-orange-700/10"
                : "hover:border-foreground/25 hover:bg-accent/40",
              isActive && "bg-orange-700/25",
            )}
          >
            <span
              className={cn(
                "text-xs font-medium",
                isSpotlight ? "text-orange-600" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            <span className="font-mono text-sm text-foreground">{note}</span>
          </button>
        );
      })}
    </div>
  );
}
