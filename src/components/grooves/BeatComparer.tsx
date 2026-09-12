"use client";

/**
 * Two grooves, one clock. A / B / both at the same tempo and bar length
 * with a shared playhead, so the difference is audible as a clash and
 * visible as which dots don't line up. Each side plays at its *own* swing
 * (a per-track override on the clock), which is how the shuffle and the
 * backbeat — identical hits — can be heard against each other.
 *
 * Morph mode steps from A's hits to B's one edit at a time with a diff
 * caption ("Remove the kick from beat 1"), for pairs that differ in hits
 * rather than feel. It only appears when there is something to morph.
 */
import { Play, Square } from "lucide-react";
import { useMemo, useState } from "react";

import {
  LessonClockProvider,
  useClockTrack,
  useLessonClock,
} from "@/components/lessons/LessonClock";
import { Segmented } from "@/components/lessons/Segmented";
import { TempoControl } from "@/components/lessons/TempoControl";
import { Button } from "@/components/ui/button";
import { useDrumKit, type DrumKit } from "@/instruments/drums/templates/basic-drums/hooks/useDrumKit";
import type { Groove } from "@/lib/grooves/registry";
import type { ClockEvent } from "@/lib/music/clock";
import {
  beatsPerBar,
  diffHits,
  speakBeat,
  VOICE_LABEL,
  type DrumHit,
  type GroovePattern,
} from "@/lib/music/grooves";
import { cn } from "@/lib/utils";
import { ClockStepGrid } from "./ClockStepGrid";

type Side = "a" | "b" | "both";

interface BeatComparerProps {
  a: Groove;
  b: Groove;
  /** Offer the one-edit-at-a-time morph when the hits differ. */
  morph?: boolean;
  className?: string;
}

interface Edit {
  kind: "remove" | "add";
  hit: DrumHit;
}

function applyEdits(base: GroovePattern, edits: readonly Edit[]): GroovePattern {
  let hits = [...base.hits];
  for (const e of edits) {
    if (e.kind === "remove") {
      hits = hits.filter((h) => !(h.voice === e.hit.voice && Math.abs(h.at - e.hit.at) < 1e-6));
    } else hits.push(e.hit);
  }
  return { ...base, hits };
}

/** One pattern as a clock track at its own swing; silent when `on` is false. */
function useDrumTrack(
  id: string,
  pattern: GroovePattern,
  on: boolean,
  kit: DrumKit,
  audioContext: AudioContext | null,
): void {
  useClockTrack(
    {
      id,
      stepsPerBeat: pattern.stepsPerBeat,
      swing: pattern.swing,
      events: (): ClockEvent[] =>
        !on || !audioContext
          ? []
          : pattern.hits.map((h) => ({
              at: h.at,
              duration: 0,
              fire: (when: number) => kit.hitAt(h.voice, when, h.velocity),
            })),
    },
    [on, audioContext, kit, pattern],
  );
}

function describeEdit(e: Edit, stepsPerBeat: number): string {
  const where = speakBeat(e.hit.at, stepsPerBeat);
  const voice = VOICE_LABEL[e.hit.voice].toLowerCase();
  return e.kind === "remove" ? `Remove the ${voice} from ${where}.` : `Add the ${voice} on ${where}.`;
}

export function BeatComparer({ a, b, morph = false, className }: BeatComparerProps) {
  if (beatsPerBar(a.pattern.meter) !== beatsPerBar(b.pattern.meter)) {
    throw new Error(`BeatComparer needs equal bar lengths: ${a.slug} vs ${b.slug}`);
  }
  return (
    <LessonClockProvider
      bpm={Math.round((a.pattern.bpm + b.pattern.bpm) / 2)}
      loop
      lengthBeats={beatsPerBar(a.pattern.meter)}
    >
      <ComparerBody a={a} b={b} morph={morph} className={className} />
    </LessonClockProvider>
  );
}

function ComparerBody({ a, b, morph, className }: Required<Omit<BeatComparerProps, "className">> & { className?: string }) {
  const { playing, play, stop, audioContext } = useLessonClock();
  const kit = useDrumKit();
  const [side, setSide] = useState<Side>("a");
  const [morphOn, setMorphOn] = useState(false);
  const [morphStep, setMorphStep] = useState(0);

  const edits = useMemo<Edit[]>(() => {
    const d = diffHits(a.pattern, b.pattern);
    return [
      ...d.removed.map((hit): Edit => ({ kind: "remove", hit })),
      ...d.added.map((hit): Edit => ({ kind: "add", hit })),
    ];
  }, [a.pattern, b.pattern]);
  const canMorph = morph && edits.length > 0;
  const morphed = useMemo(
    () => applyEdits(a.pattern, edits.slice(0, morphStep)),
    [a.pattern, edits, morphStep],
  );

  const soundsA = morphOn || side !== "b";
  const soundsB = !morphOn && side !== "a";

  useDrumTrack("compare-a", morphOn ? morphed : a.pattern, soundsA, kit, audioContext);
  useDrumTrack("compare-b", b.pattern, soundsB, kit, audioContext);

  const lastEdit = morphStep > 0 ? edits[morphStep - 1] : null;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => (playing ? stop() : void play())}
          aria-label={playing ? "Stop" : "Play the comparison"}
        >
          {playing ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {playing ? "Stop" : "Play"}
        </Button>
        {!morphOn && (
          <Segmented
            label="Which groove sounds"
            options={[
              { id: "a", label: a.name },
              { id: "b", label: b.name },
              { id: "both", label: "Both" },
            ]}
            value={side}
            onChange={setSide}
          />
        )}
        <TempoControl />
        {canMorph && (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={morphOn}
              onChange={(e) => {
                setMorphOn(e.target.checked);
                setMorphStep(0);
              }}
              className="h-3.5 w-3.5 accent-emerald-600"
            />
            One edit at a time
          </label>
        )}
      </div>

      {morphOn ? (
        <div className="space-y-3">
          <ClockStepGrid
            pattern={morphed}
            swing={a.pattern.swing}
            spotlight={lastEdit?.kind === "add" ? [lastEdit.hit] : []}
            ariaLabel={`${a.name} morphing into ${b.name}, edit ${morphStep} of ${edits.length}`}
          />
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <Button
              variant="outline"
              size="sm"
              disabled={morphStep === 0}
              onClick={() => setMorphStep((s) => Math.max(0, s - 1))}
            >
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={morphStep >= edits.length}
              onClick={() => setMorphStep((s) => Math.min(edits.length, s + 1))}
            >
              Next edit
            </Button>
            <span className="font-mono">
              {morphStep} / {edits.length}
            </span>
            <span>
              {lastEdit
                ? describeEdit(lastEdit, a.pattern.stepsPerBeat)
                : `This is the ${a.name.toLowerCase()}. ${edits.length} edit${edits.length === 1 ? "" : "s"} turn it into the ${b.name.toLowerCase()}.`}
              {morphStep === edits.length && edits.length > 0 && ` That is the ${b.name.toLowerCase()}.`}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <SideGrid groove={a} on={soundsA} />
          <SideGrid groove={b} on={soundsB} />
        </div>
      )}
    </div>
  );
}

function SideGrid({ groove, on }: { groove: Groove; on: boolean }) {
  return (
    <div className={cn("space-y-1 transition-opacity", !on && "opacity-40")}>
      <div className="flex items-baseline gap-2 text-xs">
        <span className="font-medium text-foreground">{groove.name}</span>
        <span className="font-mono text-muted-foreground">{groove.formula}</span>
      </div>
      <ClockStepGrid
        pattern={groove.pattern}
        swing={groove.pattern.swing}
        spotlight={groove.signature}
        silent={!on}
        ariaLabel={`${groove.name} drum grid`}
      />
    </div>
  );
}
