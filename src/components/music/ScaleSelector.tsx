import React from "react";
import { Lock, Unlock } from "lucide-react";
import { type ScaleCombination } from "@/instruments/synth/templates/basic-synth/hooks/useScaleLogic";
import { NOTES_SHARP } from "@/lib/music";
import Tooltip from "@/components/Tooltip";

interface ScaleSelectorProps {
  selectedScale: ScaleCombination;
  onScaleChange: (scale: ScaleCombination) => void;
  /** Whether the user is allowed to play notes outside the current scale. (True = Unlocked, False = Locked) */
  allowOutOfScale: boolean;
  onAllowOutOfScaleChange: (allow: boolean) => void;
}

export function ScaleSelector({
  selectedScale,
  onScaleChange,
  allowOutOfScale,
  onAllowOutOfScaleChange,
  variant = "synth",
}: ScaleSelectorProps & { variant?: "synth" | "shadcn" }) {
  // Generate all major and minor scales from the sharp notes
  const scaleOptions: ScaleCombination[] = [];
  NOTES_SHARP.forEach((root) => {
    scaleOptions.push(`${root} major` as ScaleCombination);
    scaleOptions.push(`${root} minor` as ScaleCombination);
  });

  const isSynth = variant === "synth";

  return (
    <div className={`flex items-center overflow-hidden ${isSynth ? "rounded bg-gray-700" : "rounded-md border border-input bg-card"}`}>
      <Tooltip message="Choose musical scale" alignX="right">
        <select
          aria-label="Select musical scale"
          value={selectedScale}
          onChange={(e) => onScaleChange(e.target.value as ScaleCombination)}
          className={`
            ${isSynth ? "h-[36px] bg-transparent text-white px-3 hover:bg-gray-600" : "h-[30px] border-r border-input bg-background px-2 text-xs"}
            border-none outline-none cursor-pointer transition-colors
          `}
        >
          <option value="none">No Scale</option>
          {scaleOptions.map((scale) => (
            <option key={scale} value={scale}>
              {scale.replace("major", "Maj").replace("minor", "Min")}
            </option>
          ))}
        </select>
      </Tooltip>

      {selectedScale !== "none" && (
        <Tooltip
          message={
            allowOutOfScale
              ? "Lock to scale notes only"
              : "Unlock scale restriction"
          }
          alignX="right"
        >
          <button
            onClick={() => onAllowOutOfScaleChange(!allowOutOfScale)}
            className={`
              flex items-center gap-1.5 font-medium transition-colors text-white
              ${isSynth ? "h-[36px] px-3 text-sm" : "h-[30px] px-2.5 text-xs"}
              ${
                allowOutOfScale
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            `}
            aria-label={
              allowOutOfScale
                ? `Scale is unlocked. All notes can be played. Click to lock to ${selectedScale} scale only`
                : `Scale is locked to ${selectedScale}. Only scale notes can be played. Click to unlock`
            }
            aria-pressed={!allowOutOfScale}
          >
            {allowOutOfScale ? (
              <Unlock size={16} aria-hidden="true" />
            ) : (
              <Lock size={16} aria-hidden="true" />
            )}
            <span>Scale</span>
          </button>
        </Tooltip>
      )}
    </div>
  );
}
