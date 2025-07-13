import React from "react";

interface AudioLevelMeterProps {
  /** Audio level from 0 to 1 */
  level: number;
  /** Whether the meter should be active/visible */
  isActive: boolean;
  /** Optional className for styling */
  className?: string;
}

export default function AudioLevelMeter({
  level,
  isActive,
  className = "",
}: AudioLevelMeterProps) {
  if (!isActive) return null;

  // Clamp level between 0 and 1
  const clampedLevel = Math.max(0, Math.min(1, level));

  // Convert to percentage
  const percentage = Math.round(clampedLevel * 100);

  // Determine color based on level
  const getBarColor = (level: number) => {
    if (level < 0.3) return "bg-green-500";
    if (level < 0.7) return "bg-yellow-500";
    return "bg-red-500";
  };

  const barColor = getBarColor(clampedLevel);

  return (
    <div className={`audio-level-meter ${className}`}>
      <div className="flex items-center gap-2 text-sm text-gray-300">
        <span className="text-xs font-medium min-w-[60px]">INPUT LEVEL</span>
        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} rounded-full transition-all duration-100 ease-out`}
            style={{
              width: `${percentage}%`,
              minWidth: clampedLevel > 0 ? "2px" : "0px",
            }}
          />
        </div>
        <span className="text-xs font-mono min-w-[35px] text-right">
          {percentage}%
        </span>
      </div>
    </div>
  );
}
