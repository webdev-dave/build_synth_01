"use client";

interface BendCellProps {
  note: string;
  depth: number;
  arrow: string;
  posColor: string;
  isInScale: boolean;
  deemphasize: boolean;
  height?: number;
  scaleDegree?: string | null;
  showDegrees?: boolean;
}

export default function BendCell({
  note,
  depth,
  arrow,
  posColor,
  isInScale,
  deemphasize,
  height,
  scaleDegree,
  showDegrees = true,
}: BendCellProps) {
  const notInScale = !isInScale;

  // Position-themed colors (same logic as NoteCell but for bends)
  const textColor = notInScale ? "#4a4a50" : `${posColor}cc`;
  const borderColor = notInScale ? "#1a1a20" : `${posColor}40`;
  const bgColor = notInScale ? "#0a0a10" : `${posColor}10`;

  const borderStyle = deemphasize ? "dashed" : "solid";

  return (
    <div
      className="text-center rounded-sm text-[11px] lg:text-[13px] font-mono relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        height: height ? `${height}px` : undefined,
        background: bgColor,
        border: `1px ${borderStyle} ${borderColor}`,
        color: textColor,
      }}
    >
      <div className="flex items-center">
        {note}
        <span className="text-[9px] lg:text-[10px] opacity-70">
          {"'".repeat(depth)}
          {arrow}
        </span>
      </div>
      {/* Scale degree ordinal - always reserve space for consistent height */}
      {showDegrees && (
        <div
          className="text-[8px] lg:text-[9px] font-semibold h-[10px] flex items-center justify-center -mt-0.5"
          style={{ color: posColor }}
        >
          {scaleDegree || ""}
        </div>
      )}
      {notInScale && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="w-[140%] h-[2px] bg-red-500/60 rounded-full"
            style={{ transform: "rotate(-45deg)" }}
          />
        </div>
      )}
    </div>
  );
}
