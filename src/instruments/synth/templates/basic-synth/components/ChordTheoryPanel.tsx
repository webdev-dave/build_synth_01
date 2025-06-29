import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ChordTheoryPanelProps {
  activeKeys: Set<string>;
  identifyChord: (activeNotes: Set<string>) => string;
  isExpanded: boolean;
  onToggle: () => void;
}

interface ChordInfo {
  name: string;
  root: string;
  quality: string;
  notes: string[];
  intervals: string;
  description: string;
  construction: string;
  examples: string[];
}

const ChordTheoryPanel: React.FC<ChordTheoryPanelProps> = ({
  activeKeys,
  identifyChord,
  isExpanded,
  onToggle,
}) => {
  const [lastChord, setLastChord] = useState<{
    chordInfo: ChordInfo;
    activeKeys: Set<string>;
  } | null>(null);
  const [isDeepDiveExpanded, setIsDeepDiveExpanded] = useState(false);

  const currentChordInfo = useMemo(() => {
    if (activeKeys.size < 2) return null;

    const chordName = identifyChord(activeKeys);
    if (!chordName || chordName === "Unknown") return null;

    // Parse chord name (e.g., "C Major", "A Minor", "F# Diminished")
    const parts = chordName.split(" ");
    const root = parts[0];
    const quality = parts.slice(1).join(" ");

    // Get the notes being played (remove octave numbers)
    const playedNotes = Array.from(activeKeys).map((note) =>
      note.replace(/\d+$/, "")
    );
    const uniqueNotesSet = new Set(playedNotes);

    // Order notes by chord function: root first, then others in chord order
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

    // Start with the root note, then add other notes in order relative to root
    const uniqueNotes = [];
    const rootIndex = noteOrder.indexOf(root);

    // Add root first
    if (uniqueNotesSet.has(root)) {
      uniqueNotes.push(root);
    }

    // Add remaining notes in chromatic order starting from root
    for (let i = 1; i < 12; i++) {
      const noteIndex = (rootIndex + i) % 12;
      const note = noteOrder[noteIndex];
      if (uniqueNotesSet.has(note) && note !== root) {
        uniqueNotes.push(note);
      }
    }

    // Define chord information based on quality
    const getQualityInfo = (quality: string) => {
      switch (quality.toLowerCase()) {
        case "major":
          return {
            intervals: "1 - 3 - 5 (Root, Major Third, Perfect Fifth)",
            description:
              "Major chords sound happy, bright, and stable. They are built using the 1st, 3rd, and 5th notes of the major scale.",
            construction:
              'The major third (4 semitones) creates the "happy" sound, while the perfect fifth (7 semitones) provides stability.',
            examples: [
              "Let It Be - Beatles",
              "Imagine - John Lennon",
              "Hey Jude - Beatles",
            ],
          };
        case "minor":
          return {
            intervals: "1 - ♭3 - 5 (Root, Minor Third, Perfect Fifth)",
            description:
              "Minor chords sound sad, melancholic, or mysterious. They use a flattened third note compared to major chords.",
            construction:
              'The minor third (3 semitones) creates the "sad" sound, while keeping the same perfect fifth for stability.',
            examples: [
              "Mad World - Gary Jules",
              "Hurt - Johnny Cash",
              "Stairway to Heaven - Led Zeppelin",
            ],
          };
        case "diminished":
          return {
            intervals: "1 - ♭3 - ♭5 (Root, Minor Third, Diminished Fifth)",
            description:
              "Diminished chords sound tense and unstable. They want to resolve to another chord.",
            construction:
              "Both the third and fifth are flattened, creating maximum tension that seeks resolution.",
            examples: [
              "Used in classical music",
              "Jazz progressions",
              "Horror movie soundtracks",
            ],
          };
        case "augmented":
          return {
            intervals: "1 - 3 - #5 (Root, Major Third, Augmented Fifth)",
            description:
              "Augmented chords sound mysterious and dreamlike. They create a sense of uncertainty.",
            construction:
              "The raised fifth creates an unusual, floating quality that neither resolves up nor down easily.",
            examples: [
              "Oh! Darling - Beatles",
              "Jazz standards",
              "Impressionist classical music",
            ],
          };
        case "suspended 4th":
          return {
            intervals: "1 - 4 - 5 (Root, Perfect Fourth, Perfect Fifth)",
            description:
              "Suspended chords create tension by replacing the third with a fourth, which wants to resolve.",
            construction:
              "Without a third, the chord is neither major nor minor, creating a sense of anticipation.",
            examples: [
              "Pinball Wizard - The Who",
              "Tom Petty songs",
              "Folk music",
            ],
          };
        default:
          return {
            intervals: "Complex interval structure",
            description:
              "This is a more complex chord with unique harmonic properties.",
            construction:
              "Advanced chord structures create sophisticated harmonic colors.",
            examples: [
              "Jazz music",
              "Advanced pop progressions",
              "Classical harmony",
            ],
          };
      }
    };

    const qualityInfo = getQualityInfo(quality);

    return {
      name: chordName,
      root,
      quality: quality,
      notes: uniqueNotes,
      intervals: qualityInfo.intervals,
      description: qualityInfo.description,
      construction: qualityInfo.construction,
      examples: qualityInfo.examples,
    };
  }, [activeKeys, identifyChord]);

  // Update lastChord when a valid chord is currently being played
  useEffect(() => {
    if (currentChordInfo && activeKeys.size >= 2) {
      setLastChord({
        chordInfo: currentChordInfo,
        activeKeys: new Set(activeKeys),
      });
    }
  }, [currentChordInfo, activeKeys]);

  // Use current chord if available, otherwise fall back to last chord
  const chordInfo = currentChordInfo || lastChord?.chordInfo;
  const isShowingLastChord = !currentChordInfo && lastChord?.chordInfo;

  // Render different content based on the current state
  const renderContent = () => {
    if (activeKeys.size === 0 && !lastChord) {
      return (
        <div className="px-4 pb-4">
          <p className="text-gray-300">
            Play multiple notes together to create chords and learn how they
            work! Chords are built by stacking notes at specific intervals.
          </p>
        </div>
      );
    }

    if (activeKeys.size === 1) {
      const singleNote = Array.from(activeKeys)[0].replace(/\d+$/, "");
      return (
        <div className="px-4 pb-4">
          <div className="bg-blue-700 p-3 rounded">
            <p className="text-sm">
              You&apos;re playing a single note:{" "}
              <span className="font-bold text-blue-200">{singleNote}</span>
            </p>
            <p className="text-xs mt-2 text-blue-100">
              Add more notes to create a chord! Try adding the notes that are 3
              and 5 steps away in the scale.
            </p>
          </div>
          {lastChord && (
            <div className="mt-3 p-3 bg-gray-700 rounded border border-gray-600">
              <p className="text-xs text-gray-400 mb-2">Last chord played:</p>
              <p className="text-sm font-semibold text-white">
                {lastChord.chordInfo.name}
              </p>
            </div>
          )}
        </div>
      );
    }

    if (!chordInfo) {
      return (
        <div className="px-4 pb-4">
          <div className="bg-orange-700 p-3 rounded">
            <p className="text-sm">
              <span className="font-bold">Hmm...</span> These notes don&apos;t
              form a recognized chord pattern.
            </p>
            <p className="text-xs mt-2 text-orange-100">
              Try different combinations! Most chords use notes that are 3 or 4
              semitones apart.
            </p>
          </div>
          {lastChord && (
            <div className="mt-3 p-3 bg-gray-700 rounded border border-gray-600">
              <p className="text-xs text-gray-400 mb-2">Last chord played:</p>
              <p className="text-sm font-semibold text-white">
                {lastChord.chordInfo.name}
              </p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="px-4 pb-4 space-y-4">
        {isShowingLastChord && (
          <div className="bg-blue-700 bg-opacity-30 p-2 rounded text-sm">
            <span className="text-blue-300">
              💡 Showing your last chord so you can study it! Play a new chord
              to update.
            </span>
          </div>
        )}

        {/* Chord Overview */}
        <div className="bg-gray-700 p-3 rounded">
          <p className="text-sm text-gray-300 mb-2">{chordInfo.description}</p>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold text-orange-400">Root Note:</span>{" "}
              {chordInfo.root}
            </p>
          </div>
        </div>

        {/* Notes in Chord */}
        <div>
          <h4 className="font-semibold text-green-400 mb-2">
            🎵 Notes you&apos;re playing:
          </h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {chordInfo.notes.map((note, index) => {
              // Get the function of each note in the chord
              const getChordFunction = (note: string, index: number) => {
                if (index === 0) return "(Root)";
                if (chordInfo.quality.toLowerCase() === "major") {
                  if (index === 1) return "(3rd)";
                  if (index === 2) return "(5th)";
                } else if (chordInfo.quality.toLowerCase() === "minor") {
                  if (index === 1) return "(♭3rd)";
                  if (index === 2) return "(5th)";
                } else if (chordInfo.quality.toLowerCase() === "diminished") {
                  if (index === 1) return "(♭3rd)";
                  if (index === 2) return "(♭5th)";
                } else if (chordInfo.quality.toLowerCase() === "augmented") {
                  if (index === 1) return "(3rd)";
                  if (index === 2) return "(#5th)";
                } else if (
                  chordInfo.quality.toLowerCase() === "suspended 4th"
                ) {
                  if (index === 1) return "(4th)";
                  if (index === 2) return "(5th)";
                }
                return `(${index + 1})`; // fallback for complex chords
              };

              return (
                <span
                  key={note}
                  className={`px-3 py-1 text-white rounded-full text-sm font-medium ${
                    index === 0 ? "bg-orange-600" : "bg-green-600"
                  }`}
                >
                  {note} {getChordFunction(note, index)}
                </span>
              );
            })}
          </div>
          <p className="text-xs text-gray-400">
            Intervals: {chordInfo.intervals}
          </p>
        </div>

        {/* How We Know This Chord */}
        <div className="bg-gray-700 p-3 rounded">
          <h4 className="font-semibold text-yellow-400 mb-2">
            🤔 How do we know this is a {chordInfo.name}?
          </h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p>
              <span className="font-semibold text-orange-400">
                1. Root identification:
              </span>
              The root note ({chordInfo.root}) is the foundational note that
              gives the chord its letter name and serves as the 1st degree of
              the scale from which this chord is built. It&apos;s not
              necessarily the lowest note played, but rather the note that
              defines the chord&apos;s identity.
            </p>
            <p>
              <span className="font-semibold text-orange-400">
                2. Quality identification:
              </span>
              {chordInfo.construction}
            </p>
          </div>
        </div>

        {/* Why This Quality */}
        <div className="bg-gray-700 p-3 rounded">
          <h4 className="font-semibold text-blue-400 mb-2">
            🎶 Why is it {chordInfo.quality}?
          </h4>
          <div className="space-y-3 text-sm text-gray-300">
            <p>
              The &quot;{chordInfo.quality.toLowerCase()}&quot; quality comes
              from the specific mathematical relationships between note
              frequencies and how our ears perceive them.
            </p>

            <button
              onClick={() => setIsDeepDiveExpanded(!isDeepDiveExpanded)}
              className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors text-sm font-medium"
            >
              {isDeepDiveExpanded ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
              Deep Dive: The Science Behind {chordInfo.quality} Chords
            </button>

            {isDeepDiveExpanded && (
              <div className="space-y-3 mt-3 pt-3 border-t border-blue-400 border-opacity-30">
                {chordInfo.quality.toLowerCase() === "major" && (
                  <div className="space-y-2">
                    <div className="bg-blue-800 bg-opacity-30 p-2 rounded border border-blue-600">
                      <p className="text-blue-200 font-medium mb-1">
                        📏 The Major Third (4 semitones):
                      </p>
                      <p className="text-xs">
                        The frequency ratio is approximately{" "}
                        <span className="font-mono bg-blue-900 px-1 rounded">
                          5:4
                        </span>{" "}
                        (1.25x higher). This creates a harmonious,
                        &quot;bright&quot; sound that our brains interpret as
                        happy or stable.
                      </p>
                    </div>
                    <div className="bg-green-800 bg-opacity-30 p-2 rounded border border-green-600">
                      <p className="text-green-200 font-medium mb-1">
                        📏 The Perfect Fifth (7 semitones):
                      </p>
                      <p className="text-xs">
                        The frequency ratio is exactly{" "}
                        <span className="font-mono bg-green-900 px-1 rounded">
                          3:2
                        </span>{" "}
                        (1.5x higher). This is one of the most consonant
                        intervals in music, providing strong stability and
                        foundation.
                      </p>
                    </div>
                    <div className="bg-yellow-800 bg-opacity-30 p-2 rounded border border-yellow-600">
                      <p className="text-yellow-200 font-medium mb-1">
                        🧮 Why these ratios matter:
                      </p>
                      <p className="text-xs">
                        Simple ratios like 3:2 and 5:4 create less
                        &quot;beating&quot; between sound waves. When waves
                        align frequently, they sound pleasing. Complex ratios
                        create dissonance. Your ear naturally recognizes these
                        mathematical relationships as &quot;consonant&quot; or
                        &quot;pleasant.&quot;
                      </p>
                    </div>
                  </div>
                )}

                {chordInfo.quality.toLowerCase() === "minor" && (
                  <div className="space-y-2">
                    <div className="bg-purple-800 bg-opacity-30 p-2 rounded border border-purple-600">
                      <p className="text-purple-200 font-medium mb-1">
                        📏 The Minor Third (3 semitones):
                      </p>
                      <p className="text-xs">
                        The frequency ratio is approximately{" "}
                        <span className="font-mono bg-purple-900 px-1 rounded">
                          6:5
                        </span>{" "}
                        (1.2x higher). This slightly smaller ratio creates a
                        &quot;darker&quot; sound compared to the major
                        third&apos;s 5:4 ratio.
                      </p>
                    </div>
                    <div className="bg-green-800 bg-opacity-30 p-2 rounded border border-green-600">
                      <p className="text-green-200 font-medium mb-1">
                        📏 The Perfect Fifth (7 semitones):
                      </p>
                      <p className="text-xs">
                        Same as major chords:{" "}
                        <span className="font-mono bg-green-900 px-1 rounded">
                          3:2
                        </span>{" "}
                        ratio. This provides the same stability, but the minor
                        third changes the overall emotional character.
                      </p>
                    </div>
                    <div className="bg-yellow-800 bg-opacity-30 p-2 rounded border border-yellow-600">
                      <p className="text-yellow-200 font-medium mb-1">
                        🧮 The psychological effect:
                      </p>
                      <p className="text-xs">
                        The 6:5 ratio is slightly more complex than 5:4,
                        creating subtle tension. This mathematical difference is
                        why minor chords sound &quot;sadder&quot; - they&apos;re
                        less perfectly resolved than major chords.
                      </p>
                    </div>
                  </div>
                )}

                {chordInfo.quality.toLowerCase() === "diminished" && (
                  <div className="space-y-2">
                    <div className="bg-red-800 bg-opacity-30 p-2 rounded border border-red-600">
                      <p className="text-red-200 font-medium mb-1">
                        📏 The Tritone (6 semitones):
                      </p>
                      <p className="text-xs">
                        The frequency ratio is approximately{" "}
                        <span className="font-mono bg-red-900 px-1 rounded">
                          √2:1
                        </span>{" "}
                        (1.414x higher). This irrational number creates maximum
                        dissonance - it&apos;s the most unstable interval in
                        Western music.
                      </p>
                    </div>
                    <div className="bg-yellow-800 bg-opacity-30 p-2 rounded border border-yellow-600">
                      <p className="text-yellow-200 font-medium mb-1">
                        🧮 Why it sounds tense:
                      </p>
                      <p className="text-xs">
                        The √2 ratio means the sound waves never align
                        perfectly, creating constant &quot;beating.&quot;
                        Medieval musicians called it &quot;diabolus in
                        musica&quot; (devil in music) because of its unsettling
                        sound.
                      </p>
                    </div>
                  </div>
                )}

                {!["major", "minor", "diminished"].includes(
                  chordInfo.quality.toLowerCase()
                ) && (
                  <div className="bg-gray-600 bg-opacity-50 p-2 rounded">
                    <p className="text-xs">
                      This chord uses more complex interval relationships that
                      create its unique harmonic character. Each interval has
                      its own frequency ratio that contributes to the overall
                      sound.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Famous Examples */}
        <div className="bg-gray-700 p-3 rounded">
          <h4 className="font-semibold text-purple-400 mb-2">
            🎸 Famous songs using {chordInfo.quality} chords:
          </h4>
          <div className="flex flex-wrap gap-2">
            {chordInfo.examples.map((song) => (
              <span
                key={song}
                className="px-2 py-1 bg-purple-600 text-white rounded text-xs"
              >
                {song}
              </span>
            ))}
          </div>
        </div>

        {/* Pro Tip */}
        <div className="border-l-4 border-orange-400 pl-3 py-2 bg-gray-700 bg-opacity-50">
          <p className="text-sm">
            <span className="font-semibold text-orange-400">💡 Pro tip:</span>{" "}
            Try playing this same chord pattern starting from different root
            notes. A {chordInfo.quality} chord built on any note will have the
            same emotional quality!
          </p>
        </div>
      </div>
    );
  };

  // Determine the header text based on current state
  const getHeaderText = () => {
    if (activeKeys.size === 0 && !lastChord) {
      return "🎹 Chord Theory";
    }
    if (activeKeys.size === 1) {
      return "🎹 Chord Theory";
    }
    if (!chordInfo) {
      return "🎹 Chord Theory";
    }
    return `🎹 ${
      isShowingLastChord ? "Last Chord Played" : "You're Playing"
    }: ${chordInfo.name}`;
  };

  return (
    <div className="w-full bg-gray-800 rounded-lg border border-gray-700 text-white">
      <button
        onClick={onToggle}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors rounded-lg"
      >
        <h3 className="text-lg font-semibold text-orange-300">
          {getHeaderText()}
        </h3>
        {isExpanded ? (
          <ChevronUp
            className="text-orange-300"
            size={20}
          />
        ) : (
          <ChevronDown
            className="text-orange-300"
            size={20}
          />
        )}
      </button>
      {isExpanded && (
        <div className="h-[200px] overflow-y-auto">{renderContent()}</div>
      )}
    </div>
  );
};

export default ChordTheoryPanel;
