"use client";

/**
 * The short, playable version of a progression for pages that are *about
 * something else* — the genre page's Harmony panel. One key picker, the
 * chart, a play button. No keyboard and no prose: the spoke at
 * /progressions/<slug> owns "what a IV chord is"; this widget only lets the
 * reader hear the chart go round once. Wraps its own provider (and clock)
 * so it can sit on any page.
 */
import { degreesOf, type ScaleTypeId } from "@/lib/music/scaleCatalog";
import type { Progression } from "@/lib/progressions/registry";
import { cn } from "@/lib/utils";
import { ProgressionChart } from "./ProgressionChart";
import { ProgressionPlayer } from "./ProgressionPlayer";
import { ProgressionProvider } from "./ProgressionProvider";
import { ProgressionToolbar } from "./ProgressionToolbar";

interface ProgressionTeaserProps {
  progression: Progression;
  /** Scale pattern key that spells the chart ("blues-scale"). */
  patternKey: ScaleTypeId;
  defaultKeyRootPc?: number;
  playLabel?: string;
  className?: string;
}

export function ProgressionTeaser({
  progression,
  patternKey,
  defaultKeyRootPc,
  playLabel = "Play the chart",
  className,
}: ProgressionTeaserProps) {
  return (
    <ProgressionProvider
      progression={progression}
      degrees={degreesOf(patternKey)}
      defaultKeyRootPc={defaultKeyRootPc}
    >
      <div className={cn("space-y-3", className)}>
        <ProgressionToolbar keyPicker>
          <ProgressionPlayer label={playLabel} tempo={false} />
        </ProgressionToolbar>
        <ProgressionChart />
      </div>
    </ProgressionProvider>
  );
}
