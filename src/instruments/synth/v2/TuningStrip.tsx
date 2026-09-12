"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DETUNE_LIMIT_CENTS,
  DETUNE_PRESETS,
  NO_DETUNE,
  QUARTER_TONE_CENTS,
  centsSuffix,
  isDetuned,
  matchingPreset,
  presetMap,
  retuneAll,
  sameDetune,
  toggleDetune,
  type DetuneMap,
} from "@/lib/music/detune";
import { simpleName } from "@/lib/music/scaleCatalog";

interface TuningStripProps {
  cents: DetuneMap;
  onChange: (next: DetuneMap) => void;
  className?: string;
}

const PITCH_CLASSES = Array.from({ length: 12 }, (_, i) => i);

/**
 * The quarter-tone strip of a Middle Eastern arranger keyboard (Korg
 * "Quarter Tone", Yamaha "Oriental" scale): twelve switches, C to B. Press
 * one and every key of that name bends — −50¢ by default — across the
 * whole keyboard, until it is pressed again.
 *
 * Collapsed and off by default: on an ordinary day the piano is a piano.
 * Green means "this switch is on" (affirmation, small); the bent keys
 * themselves are named on the keyboard ("E½♭"), so nothing sounds
 * different from how it reads.
 */
export function TuningStrip({ cents, onChange, className }: TuningStripProps) {
  const [open, setOpen] = useState(false);
  const rangeId = useId();
  const on = isDetuned(cents);
  const preset = matchingPreset(cents);
  // The one amount every lit switch shares; −50 until the user drags.
  const amount = cents.find((c) => c !== 0) ?? QUARTER_TONE_CENTS;

  const summary = on
    ? PITCH_CLASSES.filter((pc) => cents[pc] !== 0)
        .map((pc) => simpleName(pc) + centsSuffix(cents[pc]))
        .join(" · ")
    : "off";

  return (
    <div className={cn("border-t border-border text-xs", className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex items-center gap-2">
          <span
            aria-hidden
            className={cn("h-1.5 w-1.5 rounded-full", on ? "bg-emerald-600" : "bg-border")}
          />
          <span className="font-medium">Quarter tones</span>
          <span className="font-mono text-[11px]">
            {preset ? `${preset.name} · ${preset.key} — ` : ""}
            {summary}
          </span>
        </span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="space-y-3 px-3 pb-3">
          <p className="max-w-prose leading-relaxed text-muted-foreground">
            Bend any note by a quarter tone, the way keyboards built for maqam
            do: press a switch and every key of that name moves, in every
            octave. Rast on <span className="font-mono">C</span> is the white
            keys with <span className="font-mono">E</span> and{" "}
            <span className="font-mono">B</span> bent.
          </p>

          {/* Twelve switches, C to B. */}
          <div role="group" aria-label="Bend notes" className="grid grid-cols-12 gap-1">
            {PITCH_CLASSES.map((pc) => {
              const lit = cents[pc] !== 0;
              const name = simpleName(pc);
              return (
                <button
                  key={pc}
                  type="button"
                  aria-pressed={lit}
                  aria-label={`${lit ? "Unbend" : "Bend"} ${name}`}
                  onClick={() => onChange(toggleDetune(cents, pc, amount))}
                  className={cn(
                    "flex h-9 flex-col items-center justify-center rounded border font-mono leading-none transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    lit
                      ? "border-emerald-700 bg-emerald-600 text-white"
                      : "border-border text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                  )}
                >
                  <span className="text-[11px]">{name}</span>
                  {lit && <span className="mt-0.5 text-[9px] opacity-90">{centsSuffix(cents[pc])}</span>}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {/* Presets */}
            <div role="group" aria-label="Maqam presets" className="flex flex-wrap gap-1">
              {DETUNE_PRESETS.map((p) => {
                const active = sameDetune(cents, presetMap(p));
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onChange(presetMap(p))}
                    className={cn(
                      "rounded border px-2 py-1 text-[11px] transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "border-foreground/40 bg-secondary text-foreground"
                        : "border-border text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    )}
                  >
                    {p.name} <span className="font-mono">{p.key}</span>
                  </button>
                );
              })}
              <button
                type="button"
                disabled={!on}
                onClick={() => onChange(NO_DETUNE)}
                className={cn(
                  "rounded border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors",
                  "hover:bg-accent/50 hover:text-foreground disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                Off
              </button>
            </div>

            {/* Amount — one value for every lit switch, like the hardware. */}
            <label htmlFor={rangeId} className="flex items-center gap-2 text-muted-foreground">
              <span>Amount</span>
              <input
                id={rangeId}
                type="range"
                min={-DETUNE_LIMIT_CENTS}
                max={DETUNE_LIMIT_CENTS}
                step={1}
                value={amount}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  // 0 would silently switch everything off; step past it.
                  const safe = next === 0 ? (amount > 0 ? 1 : -1) : next;
                  if (on) onChange(retuneAll(cents, safe));
                }}
                disabled={!on}
                className="w-28 accent-emerald-600 disabled:opacity-40"
              />
              <span className="w-12 font-mono text-[11px] text-foreground">
                {amount > 0 ? "+" : "−"}
                {Math.abs(amount)}¢
              </span>
            </label>
          </div>

          <p className="text-[11px] leading-relaxed text-muted-foreground/80">
            −50¢ is the keyboard convention, not a measurement: players and
            regions place these notes by ear, often between −40 and −60.
          </p>
        </div>
      )}
    </div>
  );
}
