import { SynthKey } from "../utils/synthUtils";

interface SynthKeysProps {
  keys: SynthKey[];
  activeKeys: Set<string>;
  isNoteInScale: (noteNumber: number) => boolean;
  allowOutOfScale: boolean;
  selectedScale: string;
  onNoteStart: (noteNumber: number, note: string) => void;
  onNoteStop: (note: string) => void;
  isFullScreen: boolean;
}

export default function SynthKeys({
  keys,
  activeKeys,
  isNoteInScale,
  allowOutOfScale,
  selectedScale,
  onNoteStart,
  onNoteStop,
  isFullScreen,
}: SynthKeysProps) {
  // Helper function to calculate black key position
  const getBlackKeyPosition = (key: SynthKey, keyIndex: number) => {
    if (!key.isBlack) return {};

    // Find the white key position this black key should be positioned relative to
    const whiteKeysBefore = keys
      .slice(0, keyIndex)
      .filter((k) => !k.isBlack).length;
    const whiteKeyWidth = 100 / keys.filter((k) => !k.isBlack).length; // Percentage width of each white key
    const blackKeyWidth = 4; // 4% width for black keys

    // Position black key at the boundary between white keys
    // Each black key sits between specific white keys based on piano layout
    let leftPosition: number;

    // Get the note name without octave
    const noteName = key.note.replace(/\d+$/, "");

    switch (noteName) {
      case "C#":
        leftPosition = whiteKeyWidth * whiteKeysBefore - blackKeyWidth / 2;
        break;
      case "D#":
        leftPosition = whiteKeyWidth * whiteKeysBefore - blackKeyWidth / 2;
        break;
      case "F#":
        leftPosition = whiteKeyWidth * whiteKeysBefore - blackKeyWidth / 2;
        break;
      case "G#":
        leftPosition = whiteKeyWidth * whiteKeysBefore - blackKeyWidth / 2;
        break;
      case "A#":
        leftPosition = whiteKeyWidth * whiteKeysBefore - blackKeyWidth / 2;
        break;
      default:
        leftPosition = whiteKeyWidth * whiteKeysBefore - blackKeyWidth / 2;
    }

    return {
      position: "absolute" as const,
      left: `${leftPosition}%`,
      width: `${blackKeyWidth}%`,
    };
  };

  return (
    <div
      className={`relative h-48 flex w-full ${isFullScreen ? "mb-0" : "mb-4"}`}
      style={{
        width: "100%",
        maxWidth: "100%",
        borderRadius: isFullScreen ? "0 0 0.5rem 0.5rem" : "0 0 0.5rem 0.5rem",
        padding: "0",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {keys.map((key, index) => {
        const inScale = isNoteInScale(key.noteNumber);
        const isDisabled =
          !allowOutOfScale && selectedScale !== "none" && !inScale;

        const blackKeyPositioning = getBlackKeyPosition(key, index);

        const isStriped = !inScale && selectedScale !== "none";
        const isActive = activeKeys.has(key.note);

        // Define stripe colors
        const firstStripeColor = allowOutOfScale ? "#4a6e55" : "#fee2e2";
        const activeColor = key.isBlack ? "#fb923c" : "#ffedd5"; // Corresponds to Tailwind's orange-400 and orange-100
        const secondStripeColor = isActive ? activeColor : "#ffffff";

        return (
          <button
            key={key.note}
            onMouseDown={() => {
              if (!isDisabled) {
                onNoteStart(key.noteNumber, key.note);
              }
            }}
            onMouseUp={() => onNoteStop(key.note)}
            onMouseLeave={() => onNoteStop(key.note)}
            onTouchStart={(e) => {
              e.preventDefault();
              if (!isDisabled) {
                onNoteStart(key.noteNumber, key.note);
              }
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              onNoteStop(key.note);
            }}
            onTouchCancel={(e) => {
              e.preventDefault();
              onNoteStop(key.note);
            }}
            style={{
              backgroundImage: isStriped
                ? `repeating-linear-gradient(45deg, 
                      ${firstStripeColor}, 
                      ${firstStripeColor} 10px, 
                      ${secondStripeColor} 10px, 
                      ${secondStripeColor} 20px)`
                : "none",
              // Use new positioning for black keys, fallback to original for white keys
              ...(key.isBlack
                ? blackKeyPositioning
                : { width: `${100 / keys.filter((k) => !k.isBlack).length}%` }),
            }}
            className={`
              ${
                key.isBlack
                  ? "bg-black h-3/5 z-10 absolute"
                  : "bg-white h-full border border-gray-300 relative"
              }
              ${selectedScale !== "none" ? "border border-gray-400" : ""}
              ${
                selectedScale !== "none" && inScale
                  ? "ring-1 ring-blue-400 ring-opacity-50"
                  : ""
              }
              ${key.isBlack ? "shadow-lg" : "shadow-sm"}
              ${
                activeKeys.has(key.note)
                  ? key.isBlack
                    ? "!bg-orange-400"
                    : "!bg-orange-100"
                  : key.isBlack
                  ? "hover:bg-gray-900"
                  : "hover:bg-gray-100"
              }
              ${
                !allowOutOfScale && !inScale && selectedScale !== "none"
                  ? "disabled:cursor-not-allowed"
                  : ""
              }
              touch-none select-none
              transition-colors duration-150
            `}
            aria-label={`Synth key ${key.note}${
              isDisabled ? " (not in current scale)" : ""
            }`}
            aria-disabled={isDisabled}
            aria-pressed={activeKeys.has(key.note)}
          >
            <span
              className={`
                absolute bottom-1 left-1 text-xs 
                whitespace-pre-line leading-tight
                text-left
                ${
                  activeKeys.has(key.note) && key.isBlack
                    ? "text-white"
                    : key.isBlack
                    ? "text-white"
                    : "text-black"
                }
                ${isDisabled ? "text-gray-900" : ""}
              `}
            >
              {key.note.replace("#", "\n#")}
            </span>
          </button>
        );
      })}
    </div>
  );
}
