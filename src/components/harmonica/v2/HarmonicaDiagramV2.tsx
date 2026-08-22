"use client";

import { useState, type CSSProperties } from "react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { niceNote, getPlayingKey, transpose } from "@/lib/music";
import {
  BLOW_OFFSETS,
  DRAW_OFFSETS,
  BENDS,
  HARMONICA_HOLES,
  getPosition,
  posLabel,
  noteInterval,
  isNoteInActiveScale,
  getScaleDegreeOrdinal,
  getPlayingTip,
  type ScaleMode,
} from "@/lib/harmonica";

interface HarmonicaDiagramV2Props {
  harpKey: string;
  activePosition: number;
  scaleMode: ScaleMode;
  onScaleModeChange: (mode: ScaleMode) => void;
}

/**
 * v2 note map for a 10-hole Richter harp. All theory comes from
 * src/lib/harmonica; this component only renders it.
 *
 * Position colors come from the data layer (they encode meaning and match
 * the printed cheat sheet); everything else uses theme tokens.
 */
export function HarmonicaDiagramV2({
  harpKey,
  activePosition,
  scaleMode,
  onScaleModeChange,
}: HarmonicaDiagramV2Props) {
  const [showDegrees, setShowDegrees] = useState(false);

  const position = getPosition(activePosition);
  if (!position) return null;

  const playingKey = getPlayingKey(harpKey, position.semitones);
  const scaleLabel =
    position.pos === 2
      ? scaleMode === "blues"
        ? "blues scale"
        : "Mixolydian"
      : position.mode;

  const holes = Array.from({ length: HARMONICA_HOLES }, (_, i) => i);

  const cellFor = (offset: number, options?: { bendDepth?: number }) => {
    const interval = noteInterval(offset, position);
    const inScale = isNoteInActiveScale(offset, position, scaleMode);
    return (
      <NoteCellV2
        note={niceNote(transpose(harpKey, offset))}
        isRoot={interval === 0}
        inScale={inScale}
        posColor={position.color}
        degree={
          showDegrees
            ? getScaleDegreeOrdinal(offset, position, scaleMode)
            : null
        }
        bendDepth={options?.bendDepth}
        drawFocusDashed={
          position.drawFocus && scaleMode === "blues" && inScale
        }
      />
    );
  };

  const bendCell = (hole: number, type: "blow" | "draw", depth: number) => {
    const bend = BENDS[hole].find((b) => b.type === type && b.depth === depth);
    if (!bend) return <div key={`${type}${depth}-${hole}`} />;
    return (
      <div key={`${type}${depth}-${hole}`}>
        {cellFor(bend.offset, { bendDepth: depth })}
      </div>
    );
  };

  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-mono text-sm">
            {niceNote(harpKey)} harp · {posLabel(position.pos)} position
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Playing in{" "}
            <span className="font-mono text-foreground">
              {niceNote(playingKey)}
            </span>{" "}
            — {scaleLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {position.pos === 2 && (
            <div
              role="group"
              aria-label="Scale mode"
              className="inline-flex overflow-hidden rounded-md border border-input"
            >
              {(["blues", "full"] as ScaleMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={scaleMode === m}
                  onClick={() => onScaleModeChange(m)}
                  className={cn(
                    "border-l border-input px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors first:border-l-0",
                    scaleMode === m
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {m === "blues" ? "blues" : "mixolydian"}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            aria-pressed={showDegrees}
            onClick={() => setShowDegrees((v) => !v)}
            className={cn(
              "rounded-md border border-input px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors",
              showDegrees
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            degrees {showDegrees ? "on" : "off"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="grid min-w-[640px] grid-cols-[72px_repeat(10,minmax(48px,1fr))] gap-1">
          {/* Blow bends (holes 8–10), deepest furthest from the reed row */}
          <RowLabel />
          {holes.map((h) => bendCell(h, "blow", 2))}
          <RowLabel text="blow bends" />
          {holes.map((h) => bendCell(h, "blow", 1))}

          {/* Blow row */}
          <RowLabel text="blow ↑" strong />
          {holes.map((h) => (
            <div key={`blow-${h}`}>{cellFor(BLOW_OFFSETS[h])}</div>
          ))}

          {/* Hole numbers */}
          <RowLabel text="hole" />
          {holes.map((h) => (
            <div
              key={`hole-${h}`}
              className="py-1 text-center font-mono text-xs text-muted-foreground"
            >
              {h + 1}
            </div>
          ))}

          {/* Draw row */}
          <RowLabel text="draw ↓" strong />
          {holes.map((h) => (
            <div key={`draw-${h}`}>{cellFor(DRAW_OFFSETS[h])}</div>
          ))}

          {/* Draw bends (holes 1–6), deeper bends further down */}
          <RowLabel text="draw bends" />
          {holes.map((h) => bendCell(h, "draw", 1))}
          <RowLabel />
          {holes.map((h) => bendCell(h, "draw", 2))}
          <RowLabel />
          {holes.map((h) => bendCell(h, "draw", 3))}
        </div>
      </div>

      {/* Playing tip, accented with the position's color */}
      <p
        className="mt-4 border-l-2 pl-3 text-xs leading-relaxed text-muted-foreground"
        style={{ borderColor: position.color } as CSSProperties}
      >
        <span
          className="font-medium"
          style={{ color: position.color } as CSSProperties}
        >
          Tip:
        </span>{" "}
        {getPlayingTip(position)}
      </p>

      <p className="mt-3 font-mono text-[10px] text-muted-foreground/70">
        &apos; = half-step bend · &apos;&apos; = whole step · &apos;&apos;&apos;
        = 1½ steps · struck-out notes are outside the {scaleLabel} · the filled
        cell is home (root)
      </p>
    </Card>
  );
}

function RowLabel({ text, strong }: { text?: string; strong?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center font-mono text-[10px] uppercase tracking-wide",
        strong ? "text-foreground" : "text-muted-foreground/70"
      )}
    >
      {text ?? ""}
    </div>
  );
}

interface NoteCellV2Props {
  note: string;
  isRoot: boolean;
  inScale: boolean;
  posColor: string;
  degree: string | null;
  bendDepth?: number;
  drawFocusDashed?: boolean;
}

function NoteCellV2({
  note,
  isRoot,
  inScale,
  posColor,
  degree,
  bendDepth,
  drawFocusDashed,
}: NoteCellV2Props) {
  const isBend = bendDepth !== undefined;
  const rootStyle: CSSProperties | undefined = isRoot
    ? { backgroundColor: `${posColor}2e`, borderColor: posColor }
    : undefined;

  return (
    <div
      style={rootStyle}
      className={cn(
        "rounded border py-1 text-center font-mono",
        isBend ? "text-[11px]" : "text-sm",
        isRoot
          ? "font-semibold text-foreground"
          : inScale
            ? cn(
                "border-border bg-secondary/40 text-foreground",
                drawFocusDashed && "border-dashed"
              )
            : "border-transparent text-muted-foreground/40 line-through"
      )}
    >
      {note}
      {isBend && <span className="text-muted-foreground">{"'".repeat(bendDepth)}</span>}
      {degree && (
        <span
          className={cn(
            "block text-[9px] no-underline",
            isRoot ? "" : "text-muted-foreground"
          )}
          style={isRoot ? ({ color: posColor } as CSSProperties) : undefined}
        >
          {degree}
        </span>
      )}
    </div>
  );
}
