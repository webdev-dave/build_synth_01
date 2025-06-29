import { useEffect, useRef } from "react";
import { SynthKey } from "../utils/synthUtils";

// Physical keyboard layout that the user requested
// Middle row (white keys) – order left→right
const WHITE_KEY_CODES = [
  "KeyA",
  "KeyS",
  "KeyD",
  "KeyF",
  "KeyG",
  "KeyH",
  "KeyJ",
  "KeyK",
  "KeyL",
  "Semicolon",
  "Quote",
];

const WHITE_KEY_CHARS = ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'"];

// Top row (black keys) – order left→right
const BLACK_KEY_CODES = [
  "KeyW",
  "KeyE",
  "KeyT",
  "KeyY",
  "KeyU",
  "KeyO",
  "KeyP",
];

const BLACK_KEY_CHARS = ["W", "E", "T", "Y", "U", "O", "P"];

function buildCodeToNoteMap(keys: SynthKey[]): Record<string, string> {
  const map: Record<string, string> = {};
  let whiteIdx = 0;
  let blackIdx = 0;

  keys.forEach((key) => {
    if (key.isBlack) {
      if (blackIdx < BLACK_KEY_CODES.length) {
        map[BLACK_KEY_CODES[blackIdx]] = key.note;
        blackIdx += 1;
      }
    } else {
      if (whiteIdx < WHITE_KEY_CODES.length) {
        map[WHITE_KEY_CODES[whiteIdx]] = key.note;
        whiteIdx += 1;
      }
    }
  });

  return map;
}

export function buildNoteToCharMap(keys: SynthKey[]): Record<string, string> {
  const map: Record<string, string> = {};
  let whiteIdx = 0;
  let blackIdx = 0;

  keys.forEach((key) => {
    if (key.isBlack) {
      if (blackIdx < BLACK_KEY_CHARS.length) {
        map[key.note] = BLACK_KEY_CHARS[blackIdx];
        blackIdx += 1;
      }
    } else {
      if (whiteIdx < WHITE_KEY_CHARS.length) {
        map[key.note] = WHITE_KEY_CHARS[whiteIdx];
        whiteIdx += 1;
      }
    }
  });

  return map;
}

/**
 * Enables playing the synth with the physical computer keyboard when `enabled` is true.
 */
export function useComputerKeyboard(
  enabled: boolean,
  keys: SynthKey[],
  onNoteStart: (noteNumber: number, note: string) => void,
  onNoteStop: (note: string) => void,
  adjustOctave: (delta: number) => void
) {
  const pressedCodesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) return;

    const codeToNote = buildCodeToNoteMap(keys);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Octave shift keys first
      if (e.code === "KeyZ" || e.code === "ArrowLeft") {
        if (!e.repeat) adjustOctave(-1);
        return;
      }
      if (e.code === "KeyX" || e.code === "ArrowRight") {
        if (!e.repeat) adjustOctave(1);
        return;
      }
      const note = codeToNote[e.code];
      if (!note) return; // Not a mapped key
      if (e.repeat) return; // Ignore auto-repeat
      e.preventDefault();

      if (!pressedCodesRef.current.has(e.code)) {
        const keyMeta = keys.find((k) => k.note === note);
        if (keyMeta) {
          onNoteStart(keyMeta.noteNumber, keyMeta.note);
          pressedCodesRef.current.add(e.code);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.code === "KeyZ" ||
        e.code === "KeyX" ||
        e.code === "ArrowLeft" ||
        e.code === "ArrowRight"
      ) {
        return; // nothing to do on key up for octave shift
      }
      const note = codeToNote[e.code];
      if (!note) return;
      e.preventDefault();

      onNoteStop(note);
      pressedCodesRef.current.delete(e.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      pressedCodesRef.current.clear();
    };
  }, [enabled, keys, onNoteStart, onNoteStop, adjustOctave]);
}
