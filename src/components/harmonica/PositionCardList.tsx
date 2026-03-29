"use client";

import type { PositionResult } from "@/lib/harmonica";
import type { ScaleMode } from "@/lib/harmonica";
import PositionCard from "./PositionCard";

interface PositionCardListProps {
  results: PositionResult[];
  activePos: number;
  mode: "songKey" | "harpKey";
  onPositionSelect: (pos: number) => void;
  scaleMode: ScaleMode;
  onScaleModeChange: (mode: ScaleMode) => void;
}

export default function PositionCardList({
  results,
  activePos,
  mode,
  onPositionSelect,
  scaleMode,
  onScaleModeChange,
}: PositionCardListProps) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      {results.map((r) => (
        <PositionCard
          key={r.pos}
          result={r}
          isActive={activePos === r.pos}
          mode={mode}
          onClick={() => onPositionSelect(r.pos)}
          scaleMode={scaleMode}
          onScaleModeChange={onScaleModeChange}
        />
      ))}
    </div>
  );
}
