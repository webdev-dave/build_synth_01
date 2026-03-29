"use client";

interface NoteCellProps {
  note: string;
  isHome: boolean;
  isInScale: boolean;
  posColor: string;
  type: "blow" | "draw";
  deemphasize: boolean;
  scaleDegree?: string | null;
  showDegrees?: boolean;
}

export default function NoteCell({
  note,
  isHome,
  isInScale,
  posColor,
  type,
  deemphasize,
  scaleDegree,
  showDegrees = true,
}: NoteCellProps) {
  const isBlow = type === "blow";
  const notInScale = !isInScale;

  // Colors based on position theme
  // Not in scale: grey + strikethrough
  // Home: dark position color (strong bg, bright text)
  // In scale: light position color (subtle bg, medium text)
  
  const bgColor = notInScale
    ? "#0c0c12"
    : isHome
      ? `${posColor}35`
      : `${posColor}15`;

  const borderColor = notInScale
    ? "#2a2a30"
    : isHome
      ? posColor
      : `${posColor}50`;

  const textColor = notInScale
    ? "#4a4a50"
    : posColor;

  const arrowColor = notInScale
    ? "#3a3a40"
    : `${posColor}aa`;

  const borderStyle = deemphasize ? "dashed" : "solid";

  return (
    <div
      className="py-2 lg:py-3 text-center relative rounded overflow-hidden"
      style={{
        background: bgColor,
        border: `1px ${borderStyle} ${borderColor}`,
        boxShadow: isHome && isInScale ? `inset 0 0 0 1px ${posColor}` : undefined,
      }}
    >
      <div
        className="text-base lg:text-lg font-bold font-mono relative inline-block"
        style={{ color: textColor }}
      >
        {note}
      </div>
      <div
        className="text-[11px] mt-0.5 font-bold"
        style={{ color: arrowColor }}
      >
        {isBlow ? "↑" : "↓"}
      </div>
      {/* Scale degree ordinal - always reserve space for consistent height */}
      {showDegrees && (
        <div
          className="text-[9px] lg:text-[10px] font-semibold h-[14px] flex items-center justify-center"
          style={{ color: posColor }}
        >
          {scaleDegree || ""}
        </div>
      )}
      {isHome && isInScale && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-1.5 h-[3px] ${
            isBlow ? "-top-px rounded-b" : "-bottom-px rounded-t"
          }`}
          style={{ background: posColor }}
        />
      )}
      {notInScale && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="w-[140%] h-[3px] bg-red-500/70 rounded-full"
            style={{ transform: "rotate(-45deg)" }}
          />
        </div>
      )}
    </div>
  );
}
