"use client";

import { Segmented } from "@/components/lessons/Segmented";
import { cn } from "@/lib/utils";
import { useProgression, type LockMode } from "./ProgressionProvider";

interface ChordLockProps {
  /** Short name of the overlay scale for the middle segment ("Blues scale"). */
  scaleLabel?: string;
  /** Show the one-line caption that says what is playable right now. */
  caption?: boolean;
  className?: string;
}

/**
 * Which keys are playable while the chart runs. "Chord tones" is the
 * default: only the current bar's four notes play, and the set moves on
 * every bar boundary, so the reader comps along and can't be wrong. "Scale"
 * is the solo-along setting — the same mechanism the scale lessons use.
 * The caption names the set in plain words so the lock never feels like a
 * mystery: the piano refuses a key *because* it isn't in A7 right now.
 */
export function ChordLock({ scaleLabel = "Scale", caption = true, className }: ChordLockProps) {
  const { lockMode, setLockMode, currentChord, nameOf, tonesOf, keyName } = useProgression();
  const chord = nameOf(currentChord);
  const tones = tonesOf(currentChord)
    .map((t) => t.name)
    .join(" ");

  const text: Record<LockMode, string> = {
    chord: `Only ${chord}'s tones play: ${tones}. The set follows the chart.`,
    scale: `Only the ${keyName} ${scaleLabel.toLowerCase()} plays — solo over every chord.`,
    off: "Every key plays.",
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Segmented<LockMode>
        label="Lock the keyboard to"
        options={[
          { id: "chord", label: "Chord tones" },
          { id: "scale", label: scaleLabel },
          { id: "off", label: "Off" },
        ]}
        value={lockMode}
        onChange={setLockMode}
      />
      {caption && <p className="text-xs text-muted-foreground">{text[lockMode]}</p>}
    </div>
  );
}
