import { SynthKey } from "../utils/synthUtils";
import { useRef, useCallback } from "react";

interface SynthKeysProps {
  keys: SynthKey[];
  activeKeys: Set<string>;
  isNoteInScale: (noteNumber: number) => boolean;
  allowOutOfScale: boolean;
  selectedScale: string;
  onNoteStart: (noteNumber: number, note: string) => void;
  onNoteStop: (note: string) => void;
  isFullScreen: boolean;
  /**
   * If true, allows scrolling over the piano keys by not preventing default touch behavior.
   * When false, prevents all default touch behavior for better touch accuracy on keys.
   * @default false
   */
  allowScroll?: boolean;
  showKbLabels?: boolean;
  noteToKeyCharMap?: Record<string, string>;
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
  allowScroll = false,
  showKbLabels = false,
  noteToKeyCharMap = {},
}: SynthKeysProps) {
  // Use a Set to track multiple touched keys instead of a single key
  const currentTouchedKeys = useRef<Set<string>>(new Set());

  const getKeyFromTouch = useCallback((touch: React.Touch): string | null => {
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element) {
      // Find the button element (could be the button itself or a child element)
      const button = element.closest("button");
      if (button) {
        // Extract the key note from the aria-label
        const ariaLabel = button.getAttribute("aria-label");
        if (ariaLabel) {
          const match = ariaLabel.match(/Synth key ([A-G][#b]?\d+)/);
          if (match) {
            return match[1];
          }
        }
      }
    }
    return null;
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!allowScroll) {
        e.preventDefault();
      }

      // Handle all active touch points for multi-touch support
      const activeTouchKeys = new Set<string>();

      // Get all currently touched keys
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const keyNote = getKeyFromTouch(touch);
        if (keyNote) {
          activeTouchKeys.add(keyNote);
        }
      }

      // Stop keys that are no longer being touched
      currentTouchedKeys.current.forEach((key) => {
        if (!activeTouchKeys.has(key)) {
          onNoteStop(key);
          currentTouchedKeys.current.delete(key);
        }
      });

      // Start new keys that are now being touched
      activeTouchKeys.forEach((keyNote) => {
        if (!currentTouchedKeys.current.has(keyNote)) {
          const key = keys.find((k) => k.note === keyNote);
          if (key) {
            const inScale = isNoteInScale(key.noteNumber);
            const isDisabled =
              !allowOutOfScale && selectedScale !== "none" && !inScale;

            if (!isDisabled) {
              onNoteStart(key.noteNumber, key.note);
              currentTouchedKeys.current.add(keyNote);
            }
          }
        }
      });
    },
    [
      keys,
      isNoteInScale,
      allowOutOfScale,
      selectedScale,
      onNoteStart,
      onNoteStop,
      getKeyFromTouch,
      allowScroll,
    ]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!allowScroll) {
        e.preventDefault();
      }

      // When all touches end, stop all currently tracked keys
      if (e.touches.length === 0) {
        currentTouchedKeys.current.forEach((key) => {
          onNoteStop(key);
        });
        currentTouchedKeys.current.clear();
      }
    },
    [onNoteStop, allowScroll]
  );

  const handleTouchCancel = useCallback(
    (e: React.TouchEvent) => {
      if (!allowScroll) {
        e.preventDefault();
      }

      // When touches are cancelled, stop all currently tracked keys
      currentTouchedKeys.current.forEach((key) => {
        onNoteStop(key);
      });
      currentTouchedKeys.current.clear();
    },
    [onNoteStop, allowScroll]
  );
  // Helper function to calculate black key position
  const getBlackKeyPosition = (key: SynthKey, keyIndex: number) => {
    if (!key.isBlack) return {};

    // Find the white key position this black key should be positioned relative to
    const whiteKeysBefore = keys
      .slice(0, keyIndex)
      .filter((k) => !k.isBlack).length;
    const whiteKeyWidth = 100 / keys.filter((k) => !k.isBlack).length; // Percentage width of each white key
    const blackKeyWidth = whiteKeyWidth * 0.66; // Black keys should be roughly 2/3 the width of white keys

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
      className={`relative h-48 flex w-full flex-shrink-0 ${
        isFullScreen ? "mb-0" : "mb-4"
      }`}
      style={{
        width: "100%",
        maxWidth: "100%",
        borderRadius: isFullScreen ? "0 0 0.5rem 0.5rem" : "0 0 0.5rem 0.5rem",
        padding: "0",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
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
        const activeColor = key.isBlack ? "#fb923c" : "#fb923c"; // Orange-400 for both black and white keys
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
              // Only prevent default if we don't want to allow scrolling
              if (!allowScroll) {
                e.preventDefault();
              }
              if (!isDisabled) {
                onNoteStart(key.noteNumber, key.note);
                currentTouchedKeys.current.add(key.note);
              }
            }}
            onTouchEnd={(e) => {
              // Only prevent default if we don't want to allow scrolling
              if (!allowScroll) {
                e.preventDefault();
              }
              // Stop this specific key and remove it from touched keys
              onNoteStop(key.note);
              currentTouchedKeys.current.delete(key.note);
            }}
            onTouchCancel={(e) => {
              // Only prevent default if we don't want to allow scrolling
              if (!allowScroll) {
                e.preventDefault();
              }
              // Stop this specific key and remove it from touched keys
              onNoteStop(key.note);
              currentTouchedKeys.current.delete(key.note);
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
                    : "!bg-orange-400"
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
            {showKbLabels && noteToKeyCharMap[key.note] && (
              <kbd
                className={`absolute text-[10px] font-semibold rounded-md shadow-inner select-none flex items-center justify-center w-5 h-5 ${
                  key.isBlack
                    ? "bg-white text-black top-1 right-1"
                    : "bg-black text-white bottom-1 right-1 z-20"
                }
                `}
              >
                {noteToKeyCharMap[key.note]}
              </kbd>
            )}
          </button>
        );
      })}
    </div>
  );
}
