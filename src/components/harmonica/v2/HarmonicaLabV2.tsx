"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NOTES, niceNote, relativeMinor } from "@/lib/music";
import {
  calculateAllPositions,
  posLabel,
  getModeExplanation,
  type PositionCalculation,
  type ScaleMode,
} from "@/lib/harmonica";

import { HarmonicaDiagramV2 } from "./HarmonicaDiagramV2";
import { PositionMatrixV2 } from "./PositionMatrixV2";

type LookupMode = "songKey" | "harpKey";

/**
 * v2 Harmonica Lab. Same theory engine (src/lib/harmonica), redesigned UI:
 * theme tokens, mono for note data, position colors kept as data accents.
 */
export function HarmonicaLabV2() {
  const [mode, setMode] = useState<LookupMode>("songKey");
  const [selectedNote, setSelectedNote] = useState("C");
  const [activePos, setActivePos] = useState(2);
  const [scaleMode, setScaleMode] = useState<ScaleMode>("blues");

  const results = useMemo(
    () => calculateAllPositions(selectedNote, mode),
    [mode, selectedNote]
  );

  const activeResult = results.find((r) => r.pos === activePos);
  const harpKeyForDiagram = activeResult ? activeResult.harpKey : selectedNote;

  return (
    <div className="space-y-5">
      {/* Lookup controls */}
      <Card className="space-y-4 p-4 sm:p-5">
        <div
          role="group"
          aria-label="Lookup mode"
          className="inline-flex overflow-hidden rounded-md border border-input"
        >
          {(
            [
              { value: "songKey", label: "I know the song key" },
              { value: "harpKey", label: "I have a harp" },
            ] as { value: LookupMode; label: string }[]
          ).map((o) => (
            <button
              key={o.value}
              type="button"
              aria-pressed={mode === o.value}
              onClick={() => setMode(o.value)}
              className={cn(
                "border-l border-input px-3 py-1.5 text-xs font-medium transition-colors first:border-l-0",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                mode === o.value
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div>
          <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {mode === "songKey" ? "Song key" : "Harp key"}
          </div>
          <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12">
            {NOTES.map((n) => {
              const selected = n === selectedNote;
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedNote(n)}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-md border py-1.5 transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected
                      ? "border-foreground/40 bg-secondary text-foreground"
                      : "border-border text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <span className="font-mono text-sm">{niceNote(n)}</span>
                  <span className="font-mono text-[9px] opacity-60">
                    {niceNote(relativeMinor(n))}m
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {mode === "songKey" ? (
            <>
              Song in{" "}
              <span className="font-mono text-foreground">
                {niceNote(selectedNote)}
              </span>{" "}
              (relative minor{" "}
              <span className="font-mono">
                {niceNote(relativeMinor(selectedNote))}m
              </span>
              ) — each position below names the harp to grab.
            </>
          ) : (
            <>
              <span className="font-mono text-foreground">
                {niceNote(selectedNote)}
              </span>{" "}
              harp — each position below names the key you&apos;d be playing
              in.
            </>
          )}
        </p>
      </Card>

      {/* Position cards */}
      <section>
        <h2 className="mb-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Positions
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {results.map((r) => (
            <PositionCardV2
              key={r.pos}
              result={r}
              mode={mode}
              active={r.pos === activePos}
              onSelect={() => setActivePos(r.pos)}
            />
          ))}
        </div>
      </section>

      {/* Note map for the active harp/position */}
      <HarmonicaDiagramV2
        harpKey={harpKeyForDiagram}
        activePosition={activePos}
        scaleMode={scaleMode}
        onScaleModeChange={setScaleMode}
      />

      {/* Theory, collapsed by default */}
      {activeResult && <TheoryDetails result={activeResult} mode={mode} />}

      <PositionMatrixV2 />

      <p className="pb-2 text-center text-[11px] text-muted-foreground/60">
        Select any position card to update the note map above.
      </p>
    </div>
  );
}

function PositionCardV2({
  result,
  mode,
  active,
  onSelect,
}: {
  result: PositionCalculation;
  mode: LookupMode;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      style={{ borderTopColor: result.color } as CSSProperties}
      className={cn(
        "rounded-lg border border-t-2 bg-card p-3.5 text-left shadow-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-x-foreground/30 border-b-foreground/30 bg-accent/40"
          : "hover:border-x-foreground/20 hover:border-b-foreground/20 hover:bg-accent/20"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {posLabel(result.pos)} position
        </span>
        {result.pos === 2 && (
          <Badge variant="secondary" className="px-1.5 text-[9px]">
            Most common
          </Badge>
        )}
      </div>
      <div className="mt-1 text-sm font-medium">{result.name}</div>
      <div className="mt-2 font-mono text-2xl leading-none">
        {niceNote(result.displayResult)}
        <span className="ml-1.5 text-xs font-normal text-muted-foreground">
          {mode === "songKey" ? "harp" : "key"}
        </span>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {result.modeFull}
      </div>
      <div className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground/70">
        {result.useCase}
      </div>
    </button>
  );
}

function TheoryDetails({
  result,
  mode,
}: {
  result: PositionCalculation;
  mode: LookupMode;
}) {
  return (
    <details className="group rounded-lg border bg-card text-card-foreground shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
        Why {posLabel(result.pos)} position sounds this way
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-3 px-4 pb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {result.pattern.map((step, i) => (
            <span
              key={i}
              className="rounded border border-border bg-secondary/40 px-1.5 py-0.5 font-mono text-[11px]"
            >
              {step}
            </span>
          ))}
          <span className="ml-1 text-[11px] text-muted-foreground">
            step pattern ({result.mode})
          </span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {getModeExplanation(result)}
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="text-foreground">Feel:</span> {result.feel} ·{" "}
          <span className="text-foreground">Used for:</span> {result.useCase}
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">
            {mode === "songKey" ? "Finding the harp:" : "Finding the key:"}
          </span>
          {result.algorithmSteps.map((step, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <span className="text-muted-foreground/50">→</span>
              )}
              <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[11px]">
                {step}
              </span>
            </span>
          ))}
        </div>
      </div>
    </details>
  );
}
