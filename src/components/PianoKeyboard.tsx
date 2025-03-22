import { useState } from "react";
import { Lock, Unlock, Expand, Shrink } from "lucide-react";

interface PianoKeyboardProps {
  actx: AudioContext;
  hasAudioPermission: boolean;
  onAudioPermissionGranted: () => void;
}

type PianoKey = {
  note: string;
  noteNumber: number;
  isBlack: boolean;
};

type OscillatorType = "sine" | "square" | "sawtooth" | "triangle";

type ScaleType = "none" | "major" | "minor";
type ScaleRoot =
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
type ScaleCombination = "none" | `${ScaleRoot} ${ScaleType}`;

export default function PianoKeyboard({
  actx,
  hasAudioPermission,
  onAudioPermissionGranted,
}: PianoKeyboardProps) {
  const [startOctave, setStartOctave] = useState(4);
  const [waveType, setWaveType] = useState<OscillatorType>("sine");

  // Add state to store current frequency for single-note display
  const [activeNoteFreq, setActiveNoteFreq] = useState<number | null>(null);

  // Replace single oscillator with a map of active oscillators
  const [activeOscillators, setActiveOscillators] = useState<
    Map<string, { oscillator: OscillatorNode; gain: GainNode }>
  >(new Map());

  // Change to track multiple active keys
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  const [selectedScale, setSelectedScale] = useState<ScaleCombination>("none");
  const [allowOutOfScale, setAllowOutOfScale] = useState(false);

  // Get root note and scale type from combined selection
  const scaleRoot =
    selectedScale === "none"
      ? "none"
      : (selectedScale.split(" ")[0] as ScaleRoot);
  const scaleType =
    selectedScale === "none"
      ? "none"
      : (selectedScale.split(" ")[1] as ScaleType);

  // Define scale patterns relative to root note
  const scalePatterns = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
  };

  // Get note number for root note (e.g., 'C' = 0, 'C#' = 1, etc.)
  const getRootNoteNumber = (note: ScaleRoot): number => {
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
  };

  // Function to check if a note is in the selected scale
  const isNoteInScale = (noteNumber: number) => {
    if (scaleRoot === "none" || scaleType === "none") return true;

    const rootNumber = getRootNoteNumber(scaleRoot);
    const pattern = scalePatterns[scaleType];
    const noteInOctave = noteNumber % 12;
    const normalizedNote = (noteInOctave - rootNumber + 12) % 12;
    return pattern.includes(normalizedNote);
  };

  // Create piano keys
  const createOctave = (octaveNumber: number): PianoKey[] => {
    const notes = [
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
    const baseNoteNumber = (octaveNumber + 1) * 12;
    return notes.map((note, index) => ({
      note: `${note}${octaveNumber}`,
      noteNumber: baseNoteNumber + index,
      isBlack: note.includes("#"),
    }));
  };

  const keys = [...createOctave(startOctave), ...createOctave(startOctave + 1)];
  console.log(keys);

  const initializeAudio = async () => {
    // Resume the suspended context
    await actx.resume();

    // We no longer need to create a single oscillator here
    // since we'll create them on demand for each note

    onAudioPermissionGranted();
  };

  const handleNoteStart = async (noteNumber: number, note: string) => {
    // If this note is already playing, don't start it again
    if (activeOscillators.has(note)) return;

    // Calculate frequency using the note number
    const getFrequency = (noteNumber: number) => {
      return 440 * Math.pow(2, (noteNumber - 69) / 12);
    };
    const frequency = getFrequency(noteNumber);

    // Create new oscillator and gain node for this note
    const osc = actx.createOscillator();
    const gain = actx.createGain();

    // Configure the oscillator
    osc.type = waveType;
    osc.frequency.setValueAtTime(frequency, actx.currentTime);

    // Connect and start
    gain.gain.setValueAtTime(0.1, actx.currentTime);
    osc.connect(gain);
    gain.connect(actx.destination);
    osc.start();

    // Store in our map of active oscillators
    setActiveOscillators((prev) => {
      const newMap = new Map(prev);
      newMap.set(note, { oscillator: osc, gain });
      return newMap;
    });

    // Add to active keys
    setActiveKeys((prev) => {
      const newSet = new Set(prev);
      newSet.add(note);

      // If this will be the only active key, set its frequency for display
      if (newSet.size === 1) {
        setActiveNoteFreq(frequency);
      } else {
        setActiveNoteFreq(null); // More than one note playing
      }

      return newSet;
    });
  };

  const stopNote = (note: string) => {
    const noteData = activeOscillators.get(note);
    if (noteData) {
      const { oscillator, gain } = noteData;

      // Fade out to avoid clicks
      gain.gain.linearRampToValueAtTime(0, actx.currentTime + 0.1);

      // Schedule oscillator stop after fade out
      setTimeout(() => {
        oscillator.stop();

        // Remove from active oscillators
        setActiveOscillators((prev) => {
          const newMap = new Map(prev);
          newMap.delete(note);
          return newMap;
        });
      }, 100);

      // Remove from active keys
      setActiveKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(note);

        // If we're down to one note, find its frequency
        if (newSet.size === 1) {
          const remainingNote = Array.from(newSet)[0];
          const remainingNoteData = keys.find((k) => k.note === remainingNote);
          if (remainingNoteData) {
            const getFrequency = (noteNumber: number) => {
              return 440 * Math.pow(2, (noteNumber - 69) / 12);
            };
            setActiveNoteFreq(getFrequency(remainingNoteData.noteNumber));
          }
        } else if (newSet.size === 0) {
          setActiveNoteFreq(null); // No notes playing
        }

        return newSet;
      });
    }
  };

  // Add function to identify chords based on active notes
  const identifyChord = (activeNotes: Set<string>): string => {
    if (activeNotes.size < 2) return "";

    // Extract just the note names without octave numbers
    const noteNames = Array.from(activeNotes).map((note) => {
      // Remove octave number and standardize to root note (C, C#, etc.)
      return note.replace(/\d+$/, "");
    });

    // Sort notes to simplify detection
    const sortedNotes = [...new Set(noteNames)].sort((a, b) => {
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
      return noteOrder.indexOf(a) - noteOrder.indexOf(b);
    });

    // Skip if we have fewer than 3 distinct notes (not enough for a chord)
    if (sortedNotes.length < 3) return "Unknown";

    // Basic chord detection patterns
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

    // Compare our notes with known patterns
    for (const [chordType, chordPatterns] of Object.entries(patterns)) {
      for (const pattern of chordPatterns) {
        // Check if all notes in the pattern are present in our sorted notes
        if (pattern.every((note) => sortedNotes.includes(note))) {
          // Find the root note (first note in the pattern)
          return `${pattern[0]} ${chordType}`;
        }
      }
    }

    return "Unknown";
  };

  // Ensure the state change is actually affecting the layout
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen((prevState) => !prevState);
    // Force layout update if needed
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 10);
  };

  return (
    <div
      className={`piano-wrapper ${isFullScreen ? "fullscreen-piano" : ""}`}
      style={{
        width: isFullScreen ? "100vw" : "100%",
        maxWidth: isFullScreen ? "100%" : "1200px",
        position: isFullScreen ? "fixed" : "relative",
        left: isFullScreen ? "0" : "auto",
        top: isFullScreen ? "0" : "auto",
        right: isFullScreen ? "0" : "auto",
        bottom: isFullScreen ? "0" : "auto",
        zIndex: isFullScreen ? 50 : "auto",
        padding: isFullScreen ? "0" : "1rem",
        margin: isFullScreen ? "0" : "auto",
        backgroundColor: isFullScreen
          ? "var(--bg-color, #1e3a5f)"
          : "rgb(10, 58, 79)",
        transition: "background-color 0.3s ease, height 0.3s ease",
        overflow: "hidden",
        display: isFullScreen ? "flex" : "block",
        flexDirection: isFullScreen ? "column" : "initial",
        justifyContent: isFullScreen ? "center" : "initial",
        alignItems: isFullScreen ? "center" : "initial",
        height: isFullScreen ? "100vh" : "auto",
        borderRadius: "0.5rem",
      }}
    >
      {!hasAudioPermission && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 z-50">
          <button
            onClick={initializeAudio}
            className="p-8 sm:p-12"
            aria-label="Enable sound for the synthesizer"
          >
            <span className="px-6 py-4 bg-gray-50 text-gray-900 rounded-lg text-lg font-medium shadow-lg hover:bg-gray-100 transition-colors">
              Tap to Enable Sound
            </span>
          </button>
        </div>
      )}

      {/* Top toolbar */}
      <div className={`w-full ${isFullScreen ? "mb-0" : "mb-0"}`}>
        <div
          className={`flex items-center justify-between gap-2 p-2 bg-gray-800 rounded-lg w-full ${
            isFullScreen ? "rounded-none" : "rounded-b-none"
          }`}
          style={{ boxSizing: "border-box" }}
        >
          <div className="flex items-center gap-2">
            {/* Note data display moved to the top left */}
            <div
              className="px-3 py-1 bg-gray-700 rounded h-[37px] flex items-center"
              role="status"
              aria-live="polite"
              aria-label={
                activeKeys.size === 0
                  ? "No notes playing"
                  : activeKeys.size === 1
                  ? `Playing at ${activeNoteFreq?.toFixed(1)} Hz`
                  : activeKeys.size > 1
                  ? `Chord: ${identifyChord(activeKeys)}`
                  : `Playing ${activeKeys.size} notes`
              }
            >
              {activeKeys.size === 0
                ? "No note playing"
                : activeKeys.size === 1
                ? `${activeNoteFreq?.toFixed(1)} Hz`
                : activeKeys.size > 1
                ? `Chord: ${identifyChord(activeKeys)}`
                : `Playing ${activeKeys.size} notes`}
            </div>

            <div className="w-px h-8 bg-gray-600 mx-2" />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-px h-8 bg-gray-600 mx-2" />

            {/* Combined scale selector */}
            <select
              value={selectedScale}
              onChange={(e) =>
                setSelectedScale(e.target.value as ScaleCombination)
              }
              className="px-3 py-1 bg-gray-700 rounded h-[37px]"
              aria-label="Select musical scale"
            >
              <option value="none">No Scale</option>
              <option value="A major">A Maj</option>
              <option value="A minor">A Min</option>
              <option value="A# major">A# Maj</option>
              <option value="A# minor">A# Min</option>
              <option value="B major">B Maj</option>
              <option value="B minor">B Min</option>
              <option value="C major">C Maj</option>
              <option value="C minor">C Min</option>
              <option value="C# major">C# Maj</option>
              <option value="C# minor">C# Min</option>
              <option value="D major">D Maj</option>
              <option value="D minor">D Min</option>
              <option value="D# major">D# Maj</option>
              <option value="D# minor">D# Min</option>
              <option value="E major">E Maj</option>
              <option value="E minor">E Min</option>
              <option value="F major">F Maj</option>
              <option value="F minor">F Min</option>
              <option value="F# major">F# Maj</option>
              <option value="F# minor">F# Min</option>
              <option value="G major">G Maj</option>
              <option value="G minor">G Min</option>
              <option value="G# major">G# Maj</option>
              <option value="G# minor">G# Min</option>
            </select>

            {selectedScale !== "none" && (
              <button
                onClick={() => setAllowOutOfScale((prev) => !prev)}
                className={`
                        px-3 py-1 rounded h-[37px] transition-colors flex items-center gap-2
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
                  <Unlock
                    size={16}
                    aria-hidden="true"
                  />
                ) : (
                  <Lock
                    size={16}
                    aria-hidden="true"
                  />
                )}
                <span>Scale</span>
              </button>
            )}

            <div className="w-px h-8 bg-gray-600 mx-2" />
            <select
              value={waveType}
              onChange={(e) => {
                const newWaveType = e.target.value as OscillatorType;
                setWaveType(newWaveType);
                activeOscillators.forEach(({ oscillator }) => {
                  oscillator.type = newWaveType;
                });
              }}
              className="px-3 py-1 bg-gray-700 rounded h-[37px]"
              aria-label="Select wave type for synthesizer sound"
            >
              <option value="sine">Sine</option>
              <option value="square">Square</option>
              <option value="sawtooth">Sawtooth</option>
              <option value="triangle">Triangle</option>
            </select>
          </div>
        </div>
      </div>

      {/* Piano keys */}
      <div
        className={`relative h-48 flex w-full ${
          isFullScreen ? "mb-0" : "mb-4"
        }`}
        style={{
          width: "100%",
          maxWidth: "100%",
          borderRadius: isFullScreen
            ? "0 0 0.5rem 0.5rem"
            : "0 0 0.5rem 0.5rem",
          padding: "0",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {keys.map((key) => {
          const inScale = isNoteInScale(key.noteNumber);
          const isDisabled =
            !allowOutOfScale &&
            scaleRoot !== "none" &&
            scaleType !== "none" &&
            !inScale;
          return (
            <button
              key={key.note}
              onMouseDown={() => handleNoteStart(key.noteNumber, key.note)}
              onMouseUp={() => stopNote(key.note)}
              onMouseLeave={() => stopNote(key.note)}
              onTouchStart={(e) => {
                e.preventDefault();
                if (!isDisabled) {
                  handleNoteStart(key.noteNumber, key.note);
                }
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                stopNote(key.note);
              }}
              onTouchCancel={(e) => {
                e.preventDefault();
                stopNote(key.note);
              }}
              style={{
                backgroundImage:
                  !inScale && scaleRoot !== "none"
                    ? `repeating-linear-gradient(45deg, 
                                        ${
                                          allowOutOfScale
                                            ? "#4a6e55"
                                            : "#fee2e2"
                                        }, 
                                        ${
                                          allowOutOfScale
                                            ? "#4a6e55"
                                            : "#fee2e2"
                                        } 10px, 
                                        #ffffff 10px, 
                                        #ffffff 20px)`
                    : "none",
                // Fixed sizes for consistent spacing
                width: key.isBlack ? "4%" : "12.5%",
                marginLeft: key.isBlack ? "-2%" : "0",
                marginRight: key.isBlack ? "-2%" : "0",
                // Apply different orange shades based on key type when active
                backgroundColor: activeKeys.has(key.note)
                  ? key.isBlack
                    ? "#D84315"
                    : "#FFE0B2"
                  : "",
              }}
              className={`
                                ${
                                  key.isBlack
                                    ? "bg-black h-3/5 z-10 absolute"
                                    : "bg-white h-full border border-gray-300 relative"
                                }
                                ${
                                  selectedScale !== "none"
                                    ? "border border-gray-400"
                                    : ""
                                }
                                ${
                                  selectedScale !== "none" && inScale
                                    ? "ring-1 ring-blue-400 ring-opacity-50"
                                    : ""
                                }
                                ${key.isBlack ? "shadow-lg" : "shadow-sm"}
                                ${
                                  activeKeys.has(key.note)
                                    ? key.isBlack
                                      ? "!bg-orange-400" // Dark orange for black keys
                                      : "!bg-orange-100" // Light orange for white keys
                                    : key.isBlack
                                    ? "hover:bg-gray-900"
                                    : "hover:bg-gray-100"
                                }
                                ${
                                  !allowOutOfScale &&
                                  !inScale &&
                                  scaleRoot !== "none"
                                    ? "disabled:cursor-not-allowed"
                                    : ""
                                }
                                relative touch-none select-none
                                transition-colors duration-150
                            `}
              aria-label={`Piano key ${key.note}${
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

      <div
        className="flex justify-between items-center mt-4"
        style={{
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
        }}
      >
        {/* Octave controls moved to the bottom left */}
        <div className="flex items-center gap-2 bg-gray-700 rounded">
          <button
            onClick={() => setStartOctave((prev) => Math.max(0, prev - 1))}
            className="px-5 py-2 bg-gray-600 rounded disabled:opacity-50"
            disabled={startOctave === 0}
            aria-label="Lower octave range"
          >
            ←
          </button>
          <span className="px-3">
            Octave {startOctave}-{startOctave + 1}
          </span>
          <button
            onClick={() => setStartOctave((prev) => Math.min(7, prev + 1))}
            className="px-5 py-2 bg-gray-600 rounded disabled:opacity-50"
            disabled={startOctave === 7}
            aria-label="Higher octave range"
          >
            →
          </button>
        </div>

        <button
          onClick={toggleFullScreen}
          className="fullscreen-toggle p-2 ml-auto mr-0 rounded hover:bg-gray-700 focus:outline-none"
          aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
        >
          {isFullScreen ? <Shrink size={20} /> : <Expand size={20} />}
        </button>
      </div>
    </div>
  );
}
