"use client";

/**
 * The lesson's step grid: `StepGrid` bound to the groove provider and the
 * clock. Signature hits wear the spotlight, the sweep line runs at constant
 * pixels per second (so swung hits visibly land late), and tapping a cell
 * edits the pattern — the lesson grid *is* a step sequencer, with a reset
 * back to the preset once the reader has changed something.
 */
import { useLessonClock } from "@/components/lessons/LessonClock";
import type { DrumVoice } from "@/lib/music/grooves";
import { cn } from "@/lib/utils";
import { ClockStepGrid } from "./ClockStepGrid";
import { useGroove } from "./GrooveProvider";

interface GrooveGridProps {
  /** Let the reader toggle hits. */
  editable?: boolean;
  /** Row labels mute / unmute their voice. */
  mute?: boolean;
  /** Burnt-orange spotlight on the registry's signature hits. */
  spotlight?: boolean;
  /** Straight-grid underlay lines per beat — 3 shows a shuffle landing on triplets. */
  underlay?: 2 | 3 | 4;
  /** Force the rows (e.g. to show an empty kick row for the reader to fill). */
  voices?: readonly DrumVoice[];
  className?: string;
}

export function GrooveGrid({
  editable = true,
  mute = true,
  spotlight = true,
  underlay,
  voices,
  className,
}: GrooveGridProps) {
  const { groove, pattern, edited, toggle, reset, muted, toggleMute, tap } = useGroove();
  const { swing } = useLessonClock();

  return (
    <div className={cn("space-y-2", className)}>
      <ClockStepGrid
        pattern={pattern}
        swing={swing}
        voices={voices}
        editable={editable}
        onToggle={toggle}
        onTap={tap}
        spotlight={spotlight ? groove.signature : []}
        muted={muted}
        onMuteToggle={mute ? toggleMute : undefined}
        underlay={underlay}
        ariaLabel={`${groove.name} drum grid`}
      />
      {edited && (
        <div className="flex items-center justify-end gap-3 text-xs text-muted-foreground">
          <span>Your edit.</span>
          <button
            type="button"
            onClick={reset}
            className="underline decoration-border underline-offset-4 hover:text-foreground"
          >
            Reset to the {groove.name.toLowerCase()}
          </button>
        </div>
      )}
    </div>
  );
}
