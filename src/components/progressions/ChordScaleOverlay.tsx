"use client";

import { useMemo } from "react";

import { heldChordSentence, roleSentence, rubSentence } from "@/lib/progressions/captions";
import { cn } from "@/lib/utils";
import { ChordLock } from "./ChordLock";
import { ProgressionChart } from "./ProgressionChart";
import { ProgressionKeyboard } from "./ProgressionKeyboard";
import { ProgressionPlayer } from "./ProgressionPlayer";
import { ProgressionToolbar } from "./ProgressionToolbar";
import { useProgression } from "./ProgressionProvider";

interface ChordScaleOverlayProps {
  /** Short name of the overlay scale for captions and the lock ("Blues scale"). */
  scaleLabel: string;
  /** Show the chart above the keyboard so the reader sees which bar is lit. */
  chart?: boolean;
  /** Show the lock control (the play-along). */
  lock?: boolean;
  className?: string;
}

const mod12 = (n: number) => ((n % 12) + 12) % 12;

/**
 * The payoff: the lesson scale as green degree numbers *and* the current
 * chord's tones ringed on top, changing under the fixed scale as the chart
 * plays. Three states per key — chord tone, scale note outside the chord,
 * neither. Press any key and one line says what that note is doing against
 * the chord that is sounding, from the same `noteRole()` that decides the
 * lock, so the sentence is always true of the picture.
 */
export function ChordScaleOverlay({
  scaleLabel,
  chart = true,
  lock = true,
  className,
}: ChordScaleOverlayProps) {
  const { keyRootPc, keyName, degrees, nameOfPc, nameOf, currentChord, lastPressed, heldPcs } =
    useProgression();

  const ctx = useMemo(
    () => ({
      keyRootPc,
      keyName,
      degrees: degrees.map((d) => ({ offset: d.offset, label: d.label })),
      scaleLabel: scaleLabel.toLowerCase(),
      nameOfPc,
      nameOf,
    }),
    [keyRootPc, keyName, degrees, scaleLabel, nameOfPc, nameOf],
  );

  const role = lastPressed == null ? null : roleSentence(mod12(lastPressed), currentChord, ctx);
  const held = heldChordSentence(heldPcs, ctx);
  const rub = rubSentence(currentChord, ctx);

  return (
    <div className={cn("space-y-3", className)}>
      <ProgressionToolbar octave>
        <ProgressionPlayer tempo={false} />
      </ProgressionToolbar>
      {chart && <ProgressionChart readout={false} />}
      <ProgressionKeyboard mode="overlay" />
      <div className="min-h-[2.5rem] space-y-1 text-xs leading-relaxed text-muted-foreground">
        {held ? (
          <p className="text-foreground">{held}</p>
        ) : role ? (
          <p className="text-foreground">{role}</p>
        ) : (
          <p>
            Green numbers are the {keyName} {scaleLabel.toLowerCase()}; ringed keys are{" "}
            <span className="font-mono">{nameOf(currentChord)}</span>. Press a key to read
            its role.
          </p>
        )}
        {rub && <p>{rub}</p>}
      </div>
      {lock && <ChordLock scaleLabel={scaleLabel} />}
    </div>
  );
}
