"use client";

/**
 * The short, playable version of a groove for pages that are *about
 * something else* — the genre page's Rhythm and Meter panels. The grid,
 * play, tempo, and (on 8th grids) the straight / shuffle toggle. No prose:
 * the spoke at /rhythm/<slug> owns "what a shuffle is"; this only lets the
 * reader hear it go round. A meter teaser leads with the count instead of
 * a drum grid. Wraps its own provider (and clock) so it can sit anywhere.
 */
import type { Groove } from "@/lib/grooves/registry";
import { cn } from "@/lib/utils";
import { CountAlong } from "./CountAlong";
import { GrooveGrid } from "./GrooveGrid";
import { GroovePlayer } from "./GroovePlayer";
import { GrooveProvider } from "./GrooveProvider";

interface GrooveTeaserProps {
  groove: Groove;
  playLabel?: string;
  className?: string;
}

export function GrooveTeaser({ groove, playLabel = "Play", className }: GrooveTeaserProps) {
  const isMeter = groove.kind === "meter";
  return (
    <GrooveProvider groove={groove}>
      <div className={cn("space-y-3", className)}>
        <GroovePlayer label={playLabel} feel={!isMeter} />
        {isMeter ? (
          /* the meter's pattern already *is* the click — no second one */
          <CountAlong click={false} />
        ) : (
          <GrooveGrid editable={false} mute={false} />
        )}
      </div>
    </GrooveProvider>
  );
}
