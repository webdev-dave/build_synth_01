"use client";

import type { PositionResult } from "@/lib/harmonica";
import type { ScaleMode } from "@/lib/harmonica";
import { posLabel } from "@/lib/harmonica";
import { enharmonic } from "@/lib/music";

interface PositionCardProps {
  result: PositionResult;
  isActive: boolean;
  mode: "songKey" | "harpKey";
  onClick: () => void;
  scaleMode: ScaleMode;
  onScaleModeChange: (mode: ScaleMode) => void;
}

export default function PositionCard({
  result,
  isActive,
  mode,
  onClick,
  scaleMode,
  onScaleModeChange,
}: PositionCardProps) {
  const isSecondPos = result.pos === 2;
  const hasBluesOption = result.bluesScale !== null;

  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-3 cursor-pointer transition-all duration-150 relative ${
        isActive ? "border-2" : "border"
      } ${isSecondPos && !isActive ? "border-[#1a2a40]" : "border-[#2a2a35]"}`}
      style={{
        background: isActive
          ? `linear-gradient(135deg,${result.color}10,${result.color}08)`
          : isSecondPos
            ? "linear-gradient(135deg,#101828,#121a28)"
            : "#12121a",
        borderColor: isActive ? result.color : undefined,
        borderLeftWidth: isActive ? 4 : 3,
        borderLeftColor: result.color,
      }}
    >
      {isSecondPos && (
        <div className="absolute top-2 right-2.5 text-[9px] font-bold uppercase tracking-wider text-blue-500 bg-blue-500/[0.12] py-0.5 px-2 rounded">
          Most Common
        </div>
      )}

      <div className="flex justify-between items-baseline mb-0.5">
        <div>
          <span
            className="text-[11px] font-bold uppercase tracking-wide"
            style={{ color: result.color }}
          >
            {posLabel(result.pos)} Position
          </span>
          <span className="text-[11px] text-[#5a5650] ml-2">{result.name}</span>
        </div>
        {isActive && (
          <span
            className="text-[9px] font-semibold"
            style={{ color: result.color }}
          >
            ▼ VIEWING
          </span>
        )}
      </div>

      <div className="text-lg font-bold font-mono text-[#f5f0e8] my-1">
        {mode === "songKey" ? (
          <>
            Grab{" "}
            <span style={{ color: result.color }}>
              {enharmonic(result.displayResult)}
            </span>{" "}
            harp
          </>
        ) : (
          <>
            Play in{" "}
            <span style={{ color: result.color }}>
              {enharmonic(result.displayResult)}
            </span>
          </>
        )}
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <span className="bg-[#1e1e28] py-0.5 px-2 rounded text-[11px] text-[#a09a94] border border-[#2a2a35]">
          {result.modeFull}
        </span>
        <span className="text-[11px] text-[#6a6560]">{result.quality}</span>
        {/* Scale mode toggle for 2nd position */}
        {hasBluesOption && isActive && (
          <div
            className="flex gap-0.5 ml-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onScaleModeChange("blues")}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-l transition-colors ${
                scaleMode === "blues"
                  ? "bg-blue-600 text-white"
                  : "bg-[#1e1e28] text-[#6a6560] hover:text-[#a0a090] border border-[#2a2a35]"
              }`}
            >
              Blues
            </button>
            <button
              onClick={() => onScaleModeChange("full")}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-r transition-colors ${
                scaleMode === "full"
                  ? "bg-blue-600 text-white"
                  : "bg-[#1e1e28] text-[#6a6560] hover:text-[#a0a090] border border-[#2a2a35]"
              }`}
            >
              Mixolydian
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
