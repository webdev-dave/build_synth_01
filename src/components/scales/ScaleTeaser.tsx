"use client";

/**
 * The short, playable version of a scale for pages that are *about
 * something else* — a genre page showing "the scale this music draws on".
 *
 * One toolbar (root, octave, lock, play), one locked keyboard, one row of
 * degree chips. No prose sections: the full lesson at /scales/<slug> owns
 * "what a degree is"; this widget only lets the reader hear the notes.
 * Wraps its own ScaleLessonProvider so it can sit on any page.
 */
import { ScaleLessonProvider } from "./ScaleLessonProvider";
import { LessonToolbar } from "./LessonToolbar";
import { ScaleKeyboard } from "./ScaleKeyboard";
import { DegreeStrip } from "./DegreeStrip";
import { PlayPatternButton } from "./PlayPatternButton";
import type { ScaleDegree } from "./notes";
import { hasQuarterTones } from "@/lib/music/scaleCatalog";
import { cn } from "@/lib/utils";

interface ScaleTeaserProps {
  degrees: ScaleDegree[];
  /** Root pitch class to open on (the scale's classroom key). */
  defaultRootPc: number;
  /** Play-button label, e.g. "Play the blues scale". */
  playLabel: string;
  className?: string;
}

export function ScaleTeaser({
  degrees,
  defaultRootPc,
  playLabel,
  className,
}: ScaleTeaserProps) {
  const offsets = degrees.map((d) => d.offset);
  return (
    <ScaleLessonProvider defaultRootPc={defaultRootPc} degrees={degrees}>
      <div className={cn("space-y-3", className)}>
        <LessonToolbar root octave lock>
          <PlayPatternButton label={playLabel} offsets={offsets} />
        </LessonToolbar>
        <DegreeStrip degrees={degrees} />
        {/* The quarter-tone strip only earns its space when the scale bends
            (Rast); an ordinary scale keeps the teaser to one piano row. */}
        <ScaleKeyboard degrees={degrees} tuningStrip={hasQuarterTones(degrees)} />
      </div>
    </ScaleLessonProvider>
  );
}
