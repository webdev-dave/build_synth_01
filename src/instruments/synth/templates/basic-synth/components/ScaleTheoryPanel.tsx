import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ScaleCombination } from "../hooks/useScaleLogic";

interface ScaleTheoryPanelProps {
  selectedScale: ScaleCombination;
  isExpanded: boolean;
  onToggle: () => void;
}

interface ScaleInfo {
  name: string;
  notes: string[];
  pattern: string;
  description: string;
  feeling: string;
  examples: string[];
}

const ScaleTheoryPanel: React.FC<ScaleTheoryPanelProps> = ({
  selectedScale,
  isExpanded,
  onToggle,
}) => {
  const [isDeepDiveExpanded, setIsDeepDiveExpanded] = React.useState(false);
  const [isChordsExpanded, setIsChordsExpanded] = React.useState(false);

  // Note names for display
  const noteNames = [
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

  // Scale patterns (semitone intervals from root)
  const scalePatterns = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
  };

  const getRootNoteNumber = (note: string): number => {
    const noteMap: Record<string, number> = {
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
    return noteMap[note] || 0;
  };

  const getScaleChordsInfo = (scaleNotes: string[], type: string) => {
    // Chord qualities for each scale degree
    const chordQualities = {
      major: [
        "Major",
        "minor",
        "minor",
        "Major",
        "Major",
        "minor",
        "diminished",
      ],
      minor: [
        "minor",
        "diminished",
        "Major",
        "minor",
        "minor",
        "Major",
        "Major",
      ],
    };

    const romanNumerals = {
      major: ["I", "ii", "iii", "IV", "V", "vi", "vii°"],
      minor: ["i", "ii°", "III", "iv", "v", "VI", "VII"],
    };

    const qualities = chordQualities[type as keyof typeof chordQualities] || [];
    const numerals = romanNumerals[type as keyof typeof romanNumerals] || [];

    return scaleNotes.map((note, index) => {
      // Build triad: root, third, fifth (scale degrees 1, 3, 5)
      const root = scaleNotes[index];
      const third = scaleNotes[(index + 2) % 7];
      const fifth = scaleNotes[(index + 4) % 7];

      return {
        root: note,
        quality: qualities[index] || "Major",
        numeral: numerals[index] || "I",
        notes: [root, third, fifth],
        name: `${note} ${qualities[index] || "Major"}`,
      };
    });
  };

  const getScaleInfo = (): ScaleInfo | null => {
    if (selectedScale === "none") return null;

    const [root, type] = selectedScale.split(" ");
    const rootNumber = getRootNoteNumber(root);
    const pattern = scalePatterns[type as keyof typeof scalePatterns];

    if (!pattern) return null;

    const scaleNotes = pattern.map(
      (interval) => noteNames[(rootNumber + interval) % 12]
    );

    const scaleInfo: ScaleInfo = {
      name: `${root} ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      notes: scaleNotes,
      pattern: type === "major" ? "W-W-H-W-W-W-H" : "W-H-W-W-H-W-W",
      description:
        type === "major"
          ? "Major scales sound bright, happy, and uplifting. They follow a specific pattern of whole steps (W) and half steps (H)."
          : "Minor scales sound more melancholic, sad, or mysterious. They have a different pattern that creates this emotional quality.",
      feeling:
        type === "major"
          ? "Happy, bright, uplifting"
          : "Sad, mysterious, emotional",
      examples:
        type === "major"
          ? [
              "Twinkle Twinkle Little Star",
              "Happy Birthday",
              "Mary Had a Little Lamb",
            ]
          : ["Greensleeves", "Scarborough Fair", "House of the Rising Sun"],
    };

    return scaleInfo;
  };

  const scaleInfo = getScaleInfo();
  const scaleChords = scaleInfo
    ? getScaleChordsInfo(scaleInfo.notes, selectedScale.split(" ")[1])
    : [];

  if (!scaleInfo) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 text-white">
        <button
          onClick={onToggle}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors rounded-lg"
        >
          <h3 className="text-lg font-semibold text-blue-300">
            🎼 Scale Theory
          </h3>
          {isExpanded ? (
            <ChevronUp
              className="text-blue-300"
              size={20}
            />
          ) : (
            <ChevronDown
              className="text-blue-300"
              size={20}
            />
          )}
        </button>
        {isExpanded && (
          <div className="h-[200px] overflow-y-auto">
            <div className="px-4 pb-4">
              <p className="text-gray-300">
                Select a scale from the toolbar above to learn about musical
                scales! Scales are the foundation of all music - they determine
                which notes sound good together.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  const allNotes = noteNames;
  const notesInScale = scaleInfo.notes;
  const notesOutOfScale = allNotes.filter(
    (note) => !notesInScale.includes(note)
  );

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 text-white">
      <button
        onClick={onToggle}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors rounded-lg"
      >
        <h3 className="text-lg font-semibold text-blue-300">
          🎼 Understanding the {scaleInfo.name} Scale
        </h3>
        {isExpanded ? (
          <ChevronUp
            className="text-blue-300"
            size={20}
          />
        ) : (
          <ChevronDown
            className="text-blue-300"
            size={20}
          />
        )}
      </button>
      {isExpanded && (
        <div className="h-[200px] overflow-y-auto">
          <div className="px-4 pb-4 space-y-4">
            {/* Scale Overview */}
            <div className="bg-gray-700 p-3 rounded">
              <p className="text-sm text-gray-300 mb-2">
                {scaleInfo.description}
              </p>
              <p className="text-sm">
                <span className="font-semibold text-green-400">Feeling:</span>{" "}
                {scaleInfo.feeling}
              </p>
            </div>

            {/* Notes in Scale */}
            <div>
              <h4 className="font-semibold text-green-400 mb-2">
                ✅ Notes in this scale:
              </h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {notesInScale.map((note, index) => (
                  <span
                    key={note}
                    className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium"
                  >
                    {note} {index === 0 && "(Root)"}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400">
                Pattern: {scaleInfo.pattern} (W = Whole step, H = Half step)
              </p>
            </div>

            {/* Notes out of Scale */}
            <div>
              <h4 className="font-semibold text-red-400 mb-2">
                ❌ Notes outside this scale:
              </h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {notesOutOfScale.map((note) => (
                  <span
                    key={note}
                    className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-medium opacity-70"
                  >
                    {note}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400">
                These notes can create tension or dissonance when used with this
                scale
              </p>
            </div>
            {/* Scale Chords */}
            <div className="bg-gray-700 p-3 rounded">
              <button
                onClick={() => setIsChordsExpanded(!isChordsExpanded)}
                className="w-full flex items-center justify-between hover:bg-gray-600 transition-colors rounded p-2 -m-2 mb-2"
              >
                <h4 className="font-semibold text-orange-400">
                  🎵 Chords that belong in this scale:
                </h4>
                <div className="flex items-center gap-1 text-orange-300">
                  <span className="text-sm">
                    {isChordsExpanded ? "Hide" : "Show"} Chords
                  </span>
                  {isChordsExpanded ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
              </button>

              {isChordsExpanded && (
                <div className="space-y-2">
                  <div className="space-y-2 mb-2">
                    {scaleChords.map((chord, index) => (
                      <div
                        key={chord.root}
                        className="flex items-center justify-between bg-gray-600 p-2 rounded"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 min-w-[3rem]">
                            <span className="text-orange-300 font-mono text-sm">
                              {chord.numeral}
                            </span>
                            <span className="text-gray-400 text-xs font-normal">
                              ({index + 1})
                            </span>
                          </div>
                          <span className="font-semibold text-white">
                            {chord.name}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {chord.notes.map((note, noteIndex) => (
                            <span
                              key={noteIndex}
                              className="px-2 py-1 bg-orange-600 text-white rounded-full text-xs"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    These triads (3-note chords) are built from the scale notes.
                    Roman numerals show the chord&apos;s position in the scale.
                  </p>
                </div>
              )}
            </div>

            {/* Why This Works */}
            <div className="bg-gray-700 p-3 rounded">
              <h4 className="font-semibold text-yellow-400 mb-2">
                🤔 Why do these notes work together?
              </h4>
              <div className="text-sm text-gray-300 space-y-3">
                <p>
                  The {scaleInfo.pattern.toLowerCase()} pattern creates specific
                  intervals between notes that our ears find pleasing. The
                  distances between the notes create the characteristic sound of
                  a {scaleInfo.name.toLowerCase()} scale.
                </p>

                <button
                  onClick={() => setIsDeepDiveExpanded(!isDeepDiveExpanded)}
                  className="flex items-center gap-2 text-yellow-300 hover:text-yellow-200 transition-colors text-sm font-medium"
                >
                  {isDeepDiveExpanded ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                  Deep Dive: The Science Behind Harmony
                </button>

                {isDeepDiveExpanded && (
                  <div className="space-y-3 mt-3 pt-3 border-t border-yellow-400 border-opacity-30">
                    <div className="pl-3 border-l-2 border-yellow-400">
                      <p className="font-semibold text-yellow-300 mb-1">
                        🎵 Frequency Ratios
                      </p>
                      <p>
                        Musical notes have mathematical relationships. When two
                        notes have simple frequency ratios (like 2:1 for
                        octaves, 3:2 for fifths), their sound waves align in
                        pleasing patterns that our brains interpret as
                        &quot;consonant&quot; or harmonious.
                      </p>
                    </div>

                    <div className="pl-3 border-l-2 border-yellow-400">
                      <p className="font-semibold text-yellow-300 mb-1">
                        🌊 Harmonic Series
                      </p>
                      <p>
                        Every musical note contains &quot;overtones&quot; -
                        higher frequencies that ring naturally above the main
                        pitch. Scale notes are chosen because their overtones
                        overlap and reinforce each other, creating a rich,
                        unified sound.
                      </p>
                    </div>

                    <div className="pl-3 border-l-2 border-yellow-400">
                      <p className="font-semibold text-yellow-300 mb-1">
                        🧠 Brain Processing
                      </p>
                      <p>
                        Our brains evolved to find patterns in sound. The
                        regular intervals in scales create predictable patterns
                        that feel &quot;resolved&quot; and stable, while notes
                        outside the scale create tension our ears want to
                        resolve back to the scale.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Famous Examples */}
            <div className="bg-gray-700 p-3 rounded">
              <h4 className="font-semibold text-purple-400 mb-2">
                🎶 Famous songs in this scale:
              </h4>
              <div className="flex flex-wrap gap-2">
                {scaleInfo.examples.map((song) => (
                  <span
                    key={song}
                    className="px-2 py-1 bg-purple-600 text-white rounded text-xs"
                  >
                    {song}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScaleTheoryPanel;
