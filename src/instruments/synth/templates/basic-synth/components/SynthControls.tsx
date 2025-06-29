import { Lock, Unlock, Expand, Shrink } from "lucide-react";
import { OscillatorType } from "../hooks/useAudioSynthesis";
import { ScaleCombination } from "../hooks/useScaleLogic";

interface TopToolbarProps {
  // Status display
  activeKeys: Set<string>;
  activeNoteFreq: number | null;
  identifyChord: (activeNotes: Set<string>) => string;

  // Piano settings
  selectedScale: ScaleCombination;
  setSelectedScale: (scale: ScaleCombination) => void;
  allowOutOfScale: boolean;
  setAllowOutOfScale: (allow: boolean) => void;
  waveType: OscillatorType;
  setWaveType: (type: OscillatorType) => void;
}

interface BottomToolbarProps {
  startOctave: number;
  setStartOctave: (octave: number) => void;
  isFullScreen: boolean;
  toggleFullScreen: () => void;
}

export function TopToolbar({
  activeKeys,
  activeNoteFreq,
  identifyChord,
  selectedScale,
  setSelectedScale,
  allowOutOfScale,
  setAllowOutOfScale,
  waveType,
  setWaveType,
}: TopToolbarProps) {
  return (
    <div className="w-full flex items-center justify-between gap-2 p-3 bg-gray-800 rounded-t-lg border-b border-gray-700">
      {/* Left Side - Status Display */}
      <div className="flex items-center gap-2">
        <div
          className="px-3 py-2 bg-gray-700 rounded text-white text-base min-w-[140px]"
          role="status"
          aria-live="polite"
          aria-label={
            activeKeys.size === 0
              ? "No notes playing"
              : activeKeys.size === 1
              ? `Playing ${
                  Array.from(activeKeys)[0]
                } note in the frequency of ${activeNoteFreq?.toFixed(1)} Hz`
              : activeKeys.size > 1
              ? `Chord: ${identifyChord(activeKeys)}`
              : `Playing ${activeKeys.size} notes`
          }
        >
          {activeKeys.size === 0
            ? "No note playing"
            : activeKeys.size === 1
            ? `${Array.from(activeKeys)[0]} | ${activeNoteFreq?.toFixed(1)} Hz`
            : activeKeys.size > 1
            ? `Chord: ${identifyChord(activeKeys)}`
            : `Playing ${activeKeys.size} notes`}
        </div>
      </div>

      {/* Right Side - Piano Settings */}
      <div className="flex items-center gap-2">
        {/* Scale Controls */}
        <select
          value={selectedScale}
          onChange={(e) => setSelectedScale(e.target.value as ScaleCombination)}
          className="px-3 py-2 bg-gray-700 text-white rounded border-none outline-none cursor-pointer hover:bg-gray-600 transition-colors"
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
            onClick={() => setAllowOutOfScale(!allowOutOfScale)}
            className={`
              px-3 py-2 rounded transition-colors flex items-center gap-2 text-white text-sm
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

        {/* Wave Type Control */}
        <select
          value={waveType}
          onChange={(e) => setWaveType(e.target.value as OscillatorType)}
          className="px-3 py-2 bg-gray-700 text-white rounded border-none outline-none cursor-pointer hover:bg-gray-600 transition-colors"
          aria-label="Select wave type for synthesizer sound"
        >
          <option value="sine">Sine</option>
          <option value="square">Square</option>
          <option value="sawtooth">Sawtooth</option>
          <option value="triangle">Triangle</option>
        </select>
      </div>
    </div>
  );
}

export function BottomToolbar({
  startOctave,
  setStartOctave,
  isFullScreen,
  toggleFullScreen,
}: BottomToolbarProps) {
  return (
    <div className="w-full flex justify-between items-center py-1">
      {/* Left Side - Octave Controls */}
      <div className="flex items-center bg-gray-700 rounded overflow-hidden">
        <button
          onClick={() => setStartOctave(Math.max(0, startOctave - 1))}
          className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={startOctave === 0}
          aria-label="Lower octave range"
        >
          ←
        </button>
        <span className="px-4 py-2 text-white bg-gray-700 font-medium">
          Octave {startOctave}-{startOctave + 1}
        </span>
        <button
          onClick={() => setStartOctave(Math.min(7, startOctave + 1))}
          className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={startOctave === 7}
          aria-label="Higher octave range"
        >
          →
        </button>
      </div>

      {/* Right Side - Layout Controls */}
      <button
        onClick={toggleFullScreen}
        className={`${
          isFullScreen ? "p-3" : "p-2"
        } bg-gray-700 text-white rounded hover:bg-gray-600 focus:outline-none transition-colors`}
        aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
      >
        {isFullScreen ? <Shrink size={24} /> : <Expand size={20} />}
      </button>
    </div>
  );
}

// Keep the original component for backward compatibility if needed
interface PianoControlsProps extends TopToolbarProps, BottomToolbarProps {}

export default function PianoControls(props: PianoControlsProps) {
  return (
    <>
      <TopToolbar {...props} />
      <BottomToolbar {...props} />
    </>
  );
}
