"use client";

/**
 * Play-it demo for /concepts/frequency: a frequency slider with a live
 * readout (Hz, nearest note, cents off it) and a Play button that sounds a
 * sine at exactly that number. The slider is logarithmic on purpose — every
 * octave is the same width because it is the same ratio — and the ratio
 * buttons (× 1.0595, × 2) move the number the way the ear moves.
 *
 * Nothing sounds until Play or a ratio button is pressed.
 */
import { useState } from "react";
import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  A4_HZ,
  HALF_STEP_RATIO,
  formatHz,
  pitchFromFrequency,
  pitchLabel,
} from "@/lib/music/pitch";
import { cn } from "@/lib/utils";
import { useDemoTone } from "./useDemoTone";

const MIN_HZ = 55; // A1
const OCTAVES = 5; // … to A6, 1760 Hz
const MAX_HZ = MIN_HZ * 2 ** OCTAVES;
const STEPS = 1000;
const NOTE_SEC = 0.9;

const toSlider = (hz: number) => Math.round((Math.log2(hz / MIN_HZ) / OCTAVES) * STEPS);
const fromSlider = (v: number) => MIN_HZ * 2 ** ((v / STEPS) * OCTAVES);

/** The A ticks — one per octave, equally spaced on a log axis. */
const TICKS = Array.from({ length: OCTAVES + 1 }, (_, i) => MIN_HZ * 2 ** i);

interface Ratio {
  id: string;
  label: string;
  factor: number;
  what: string;
}

const RATIOS: Ratio[] = [
  { id: "half-up", label: "× 1.0595", factor: HALF_STEP_RATIO, what: "half step up" },
  { id: "octave-up", label: "× 2", factor: 2, what: "octave up" },
  { id: "octave-down", label: "÷ 2", factor: 0.5, what: "octave down" },
];

function centsLabel(cents: number): string {
  if (cents === 0) return "±0¢";
  return `${cents > 0 ? "+" : "−"}${Math.abs(cents)}¢`;
}

export function FrequencyDemo() {
  const { play, after, clearTimers } = useDemoTone();
  const [hz, setHz] = useState<number>(A4_HZ);
  const [sounding, setSounding] = useState(false);

  const sound = async (atHz: number) => {
    clearTimers();
    const ok = await play([{ hz: atHz, at: 0, duration: NOTE_SEC, shape: "sine" }]);
    if (!ok) return;
    setSounding(true);
    after(NOTE_SEC + 0.2, () => setSounding(false));
  };

  const applyRatio = (factor: number) => {
    const next = Math.min(MAX_HZ, Math.max(MIN_HZ, hz * factor));
    setHz(next);
    void sound(next);
  };

  const pitch = pitchFromFrequency(hz);

  return (
    <div className="mt-4 space-y-4">
      <div
        className={cn(
          "flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-md border px-3 py-2 font-mono transition-colors",
          sounding && "border-orange-700",
        )}
        aria-live="polite"
      >
        <span className={cn("text-lg tabular-nums", sounding ? "text-orange-600" : "text-foreground")}>
          {formatHz(hz)}
        </span>
        <span className="text-xs text-muted-foreground">
          nearest note <span className="text-foreground">{pitchLabel(pitch.midi)}</span>{" "}
          <span className="tabular-nums">{centsLabel(pitch.cents)}</span>
        </span>
      </div>

      <div>
        <input
          type="range"
          min={0}
          max={STEPS}
          step={1}
          value={toSlider(hz)}
          onChange={(e) => setHz(fromSlider(Number(e.target.value)))}
          aria-label="Frequency in hertz"
          aria-valuetext={`${formatHz(hz)}, nearest note ${pitchLabel(pitch.midi)}`}
          className="h-1.5 w-full cursor-pointer accent-foreground"
        />
        <div className="relative mt-1 h-4 font-mono text-[11px] text-muted-foreground" aria-hidden="true">
          {TICKS.map((tick, i) => (
            <span
              key={tick}
              className="absolute -translate-x-1/2 whitespace-nowrap"
              style={{ left: `${(i / OCTAVES) * 100}%` }}
            >
              {tick}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => sound(hz)}
          className={cn(sounding && "border-orange-700 text-orange-600")}
        >
          <Play className="h-3.5 w-3.5" />
          Play {formatHz(hz, 0)}
        </Button>
        {RATIOS.map((r) => (
          <Button
            key={r.id}
            variant="outline"
            size="sm"
            onClick={() => applyRatio(r.factor)}
            aria-label={`${r.what}: multiply the frequency by ${r.factor}`}
          >
            <span className="font-mono">{r.label}</span>
            <span className="text-muted-foreground">{r.what}</span>
          </Button>
        ))}
        <Button variant="ghost" size="sm" onClick={() => setHz(A4_HZ)}>
          Reset to A4
        </Button>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        The number is the pitch: slide it and the nearest note name follows.
        Notice the ticks — <span className="font-mono">55 · 110 · 220 · 440</span>{" "}
        — sit an equal distance apart even though the gaps in hertz double
        each time. Octaves are equal <em>ratios</em>, not equal amounts, and
        so is every half step: <span className="font-mono">× 1.0595</span>{" "}
        from anywhere is one key to the right.
      </p>
    </div>
  );
}
