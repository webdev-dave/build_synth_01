import { useState, useMemo, useCallback } from "react";

export type ScaleType = "none" | "major" | "minor";
export type ScaleRoot =
  | "A"
  | "A#"
  | "B"
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#";
export type ScaleCombination = "none" | `${ScaleRoot} ${ScaleType}`;

interface UseScaleLogicReturn {
  selectedScale: ScaleCombination;
  setSelectedScale: (scale: ScaleCombination) => void;
  allowOutOfScale: boolean;
  setAllowOutOfScale: (allow: boolean) => void;
  isNoteInScale: (noteNumber: number) => boolean;
  identifyChord: (activeNotes: Set<string>) => string;
}

export function useScaleLogic(): UseScaleLogicReturn {
  const [selectedScale, setSelectedScale] = useState<ScaleCombination>("none");
  const [allowOutOfScale, setAllowOutOfScale] = useState(false);

  const scalePatterns = useMemo(
    () => ({
      major: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10],
    }),
    []
  );

  const getRootNoteNumber = useCallback((note: ScaleRoot): number => {
    const noteMap: Record<ScaleRoot, number> = {
      C: 0,
      "C#": 1,
      D: 2,
      "D#": 3,
      E: 4,
      F: 5,
      "F#": 6,
      G: 7,
      "G#": 8,
      A: 9,
      "A#": 10,
      B: 11,
    };
    return noteMap[note];
  }, []);

  const { scaleRoot, scaleType } = useMemo(() => {
    if (selectedScale === "none") {
      return { scaleRoot: "none" as const, scaleType: "none" as const };
    }
    const [root, type] = selectedScale.split(" ");
    return { scaleRoot: root as ScaleRoot, scaleType: type as ScaleType };
  }, [selectedScale]);

  const isNoteInScale = useCallback(
    (noteNumber: number) => {
      if (scaleRoot === "none" || scaleType === "none") return true;

      const rootNumber = getRootNoteNumber(scaleRoot);
      const pattern = scalePatterns[scaleType];
      const octaveIndependentNotePosition = noteNumber % 12;
      const semitoneOffsetFromRoot =
        (octaveIndependentNotePosition - rootNumber + 12) % 12;
      return pattern.includes(semitoneOffsetFromRoot);
    },
    [scaleRoot, scaleType, getRootNoteNumber, scalePatterns]
  );

  const identifyChord = useCallback((activeNotes: Set<string>): string => {
    if (activeNotes.size < 2) return "";

    const noteNames = Array.from(activeNotes).map((note) =>
      note.replace(/\d+$/, "")
    );

    // Deduplicate (across octaves) and place notes in chromatic order
    const noteOrder = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];

    const uniqueNotes = [...new Set(noteNames)];

    const sortedNotes = uniqueNotes.sort(
      (a, b) => noteOrder.indexOf(a) - noteOrder.indexOf(b)
    );

    const patterns: Record<string, string[][]> = {
      Major: [
        ["C", "E", "G"],
        ["C#", "F", "G#"],
        ["D", "F#", "A"],
        ["D#", "G", "A#"],
        ["E", "G#", "B"],
        ["F", "A", "C"],
        ["F#", "A#", "C#"],
        ["G", "B", "D"],
        ["G#", "C", "D#"],
        ["A", "C#", "E"],
        ["A#", "D", "F"],
        ["B", "D#", "F#"],
      ],
      Minor: [
        ["C", "D#", "G"],
        ["C#", "E", "G#"],
        ["D", "F", "A"],
        ["D#", "F#", "A#"],
        ["E", "G", "B"],
        ["F", "G#", "C"],
        ["F#", "A", "C#"],
        ["G", "A#", "D"],
        ["G#", "B", "D#"],
        ["A", "C", "E"],
        ["A#", "C#", "F"],
        ["B", "D", "F#"],
      ],
      Diminished: [
        ["C", "D#", "F#"],
        ["C#", "E", "G"],
        ["D", "F", "G#"],
        ["D#", "F#", "A"],
        ["E", "G", "A#"],
        ["F", "G#", "B"],
        ["F#", "A", "C"],
        ["G", "A#", "C#"],
        ["G#", "B", "D"],
        ["A", "C", "D#"],
        ["A#", "C#", "E"],
        ["B", "D", "F"],
      ],
      Augmented: [
        ["C", "E", "G#"],
        ["C#", "F", "A"],
        ["D", "F#", "A#"],
        ["D#", "G", "B"],
        ["E", "G#", "C"],
        ["F", "A", "C#"],
        ["F#", "A#", "D"],
        ["G", "B", "D#"],
        ["G#", "C", "E"],
        ["A", "C#", "F"],
        ["A#", "D", "F#"],
        ["B", "D#", "G"],
      ],
      "Suspended 4th": [
        ["C", "F", "G"],
        ["C#", "F#", "G#"],
        ["D", "G", "A"],
        ["D#", "G#", "A#"],
        ["E", "A", "B"],
        ["F", "A#", "C"],
        ["F#", "B", "C#"],
        ["G", "C", "D"],
        ["G#", "C#", "D#"],
        ["A", "D", "E"],
        ["A#", "D#", "F"],
        ["B", "E", "F#"],
      ],
    };

    for (const [chordType, chordPatterns] of Object.entries(patterns)) {
      for (const pattern of chordPatterns) {
        /*
         * A match is valid only when the set of unique note names the user is
         * holding matches the chord pattern *exactly* (ignoring octaves).
         * This prevents situations where a correct triad is recognised even
         * after extra, non-chord tones are added.
         */
        const patternMatchesExactly =
          pattern.length === sortedNotes.length &&
          pattern.every((note) => sortedNotes.includes(note));

        if (patternMatchesExactly) {
          return `${pattern[0]} ${chordType}`;
        }
      }
    }

    return "Unknown";
  }, []);

  return {
    selectedScale,
    setSelectedScale,
    allowOutOfScale,
    setAllowOutOfScale,
    isNoteInScale,
    identifyChord,
  };
}
