import { Lock, Unlock, Expand, Shrink, Keyboard, Type } from "lucide-react";
import { OscillatorType } from "../hooks/useAudioSynthesis";
import { ScaleCombination } from "../hooks/useScaleLogic";
import Tooltip from "@/components/Tooltip";

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
  kbEnabled?: boolean;
  toggleKbEnabled?: () => void;
  showKbLabels?: boolean;
  toggleShowKbLabels?: () => void;
  /** If true, the UI is running on a mobile / touch-only device. */
  isMobile?: boolean;
  /** Currently selected number of visible octaves */
  visibleOctaves?: number;
  /** Setter for visible octaves */
  setVisibleOctaves?: (num: number) => void;
  /** Maximum allowed visible octaves based on screen width */
  maxVisibleOctaves?: number;
  /** Minimum allowed visible octaves (defaults to 1) */
  minVisibleOctaves?: number;
  /** Which visible octave (0-based) the computer keyboard is mapped to */
  kbOctaveOffset?: number;
  /** Setter for kbOctaveOffset */
  setKbOctaveOffset?: (offset: number) => void;
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
        <Tooltip
          message="Choose musical scale"
          alignX="right"
        >
          <select
            value={selectedScale}
            onChange={(e) =>
              setSelectedScale(e.target.value as ScaleCombination)
            }
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
        </Tooltip>

        {selectedScale !== "none" && (
          <Tooltip
            message={
              allowOutOfScale
                ? "Lock to scale notes only"
                : "Unlock scale restriction"
            }
            alignX="right"
          >
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
          </Tooltip>
        )}

        {/* Wave Type Control */}
        <Tooltip
          message="Select oscillator wave shape"
          alignX="right"
        >
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
        </Tooltip>
      </div>
    </div>
  );
}

export function BottomToolbar({
  startOctave,
  setStartOctave,
  isFullScreen,
  toggleFullScreen,
  kbEnabled = false,
  toggleKbEnabled = () => {},
  showKbLabels = false,
  toggleShowKbLabels = () => {},
  isMobile = false,
  visibleOctaves = 2,
  setVisibleOctaves = () => {},
  maxVisibleOctaves = 5,
  minVisibleOctaves = 1,
  kbOctaveOffset = 0,
  setKbOctaveOffset = () => {},
}: BottomToolbarProps) {
  return (
    <div className="w-full flex justify-between items-center py-1">
      {/* Left Side - Octave & Visible Range Controls */}
      <Tooltip
        message="Change keyboard octave up/down"
        alignX="left"
        placement="bottom"
      >
        <div className="flex items-center bg-gray-700 rounded overflow-visible">
          <button
            onClick={() => setStartOctave(Math.max(0, startOctave - 1))}
            className="relative px-4 py-2 bg-gray-600 text-white hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={startOctave === 0}
            aria-label="Lower octave range"
          >
            ←
            {showKbLabels && (
              <>
                <kbd className="absolute -top-1 -left-1 text-[10px] font-semibold bg-black text-white px-1 py-[1px] rounded shadow-inner select-none">
                  Z
                </kbd>
                <kbd className="absolute -bottom-1 -left-1 text-[10px] font-semibold bg-black text-white px-1 py-[1px] rounded shadow-inner select-none">
                  ←
                </kbd>
              </>
            )}
          </button>
          <span className="px-4 py-2 text-white bg-gray-700 font-medium">
            Octave {startOctave}-{startOctave + 1}
          </span>
          <button
            onClick={() => setStartOctave(Math.min(7, startOctave + 1))}
            className="relative px-4 py-2 bg-gray-600 text-white hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={startOctave === 7}
            aria-label="Higher octave range"
          >
            →
            {showKbLabels && (
              <>
                <kbd className="absolute -top-1 -right-1 text-[10px] font-semibold bg-black text-white px-1 py-[1px] rounded shadow-inner select-none">
                  X
                </kbd>
                <kbd className="absolute -bottom-1 -right-1 text-[10px] font-semibold bg-black text-white px-1 py-[1px] rounded shadow-inner select-none">
                  →
                </kbd>
              </>
            )}
          </button>
        </div>
      </Tooltip>

      <Tooltip
        message="Change the number of octaves displayed"
        alignX="center"
        placement="bottom"
      >
        <div className="flex items-center bg-gray-700 rounded ml-2 overflow-visible">
          <button
            onClick={() =>
              setVisibleOctaves(Math.max(minVisibleOctaves, visibleOctaves - 1))
            }
            className="relative px-3 py-2 bg-gray-600 text-white hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={visibleOctaves <= minVisibleOctaves}
            aria-label="Show fewer octaves"
          >
            –
          </button>
          <span className="px-3 py-2 text-white bg-gray-700 font-medium">
            {visibleOctaves} octave{visibleOctaves > 1 ? "s" : ""}
          </span>
          <button
            onClick={() =>
              setVisibleOctaves(Math.min(maxVisibleOctaves, visibleOctaves + 1))
            }
            className="relative px-3 py-2 bg-gray-600 text-white hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={visibleOctaves >= maxVisibleOctaves}
            aria-label="Show more octaves"
          >
            +
          </button>
        </div>
      </Tooltip>

      {/* Right Side - Additional Controls */}
      <div className="flex items-center gap-2">
        {/* Computer-keyboard octave mapping dropdown (only when keyboard enabled and not mobile) */}
        {!isMobile && kbEnabled && visibleOctaves > 1 && (
          <Tooltip
            message="Select which visible octave the computer keyboard controls"
            alignX="right"
            placement="bottom"
          >
            <select
              value={kbOctaveOffset}
              onChange={(e) => setKbOctaveOffset(Number(e.target.value))}
              className="p-2 bg-gray-700 text-white rounded border-none outline-none cursor-pointer hover:bg-gray-600 transition-colors"
              aria-label="Select octave mapped to computer keyboard"
            >
              {Array.from({ length: visibleOctaves }).map((_, idx) => (
                <option
                  key={idx}
                  value={idx}
                >
                  KB Octave {startOctave + idx}
                </option>
              ))}
            </select>
          </Tooltip>
        )}

        {/* Enable computer keyboard (hidden on mobile) */}
        {!isMobile && (
          <Tooltip
            message="Enable/disable computer keyboard input"
            alignX="right"
            placement="bottom"
          >
            <button
              onClick={toggleKbEnabled}
              className={`p-2 rounded transition-colors text-white ${
                kbEnabled
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              aria-label={
                kbEnabled
                  ? "Disable computer keyboard input"
                  : "Enable computer keyboard input"
              }
              aria-pressed={kbEnabled}
            >
              <Keyboard
                size={20}
                aria-hidden="true"
              />
            </button>
          </Tooltip>
        )}

        {/* Show keyboard labels (hidden on mobile) */}
        {!isMobile && (
          <Tooltip
            message="Show/hide keyboard letter overlays"
            alignX="right"
            placement="bottom"
          >
            <button
              onClick={toggleShowKbLabels}
              className={`p-2 rounded transition-colors text-white ${
                showKbLabels
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              aria-label={
                showKbLabels
                  ? "Hide computer key labels on piano"
                  : "Show computer key labels on piano"
              }
              aria-pressed={showKbLabels}
            >
              <Type
                size={20}
                aria-hidden="true"
              />
            </button>
          </Tooltip>
        )}

        {/* Full-screen toggle */}
        <Tooltip
          message={isFullScreen ? "Exit full screen" : "Enter full screen"}
          alignX="right"
          placement="bottom"
        >
          <button
            onClick={toggleFullScreen}
            className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 focus:outline-none transition-colors"
            aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
          >
            {isFullScreen ? <Shrink size={20} /> : <Expand size={20} />}
          </button>
        </Tooltip>
      </div>
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
