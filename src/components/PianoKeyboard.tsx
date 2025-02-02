import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';

interface PianoKeyboardProps {
    actx: AudioContext;
    hasAudioPermission: boolean;
    onAudioPermissionGranted: () => void;
}

type PianoKey = {
    note: string;
    noteNumber: number;
    isBlack: boolean;
}

type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

type ScaleType = 'none' | 'major' | 'minor';
type ScaleRoot = 'A' | 'A#' | 'B' | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#';
type ScaleCombination = 'none' | `${ScaleRoot} ${ScaleType}`;

export default function PianoKeyboard({ actx, hasAudioPermission, onAudioPermissionGranted }: PianoKeyboardProps) {
    const [startOctave, setStartOctave] = useState(4);
    const [waveType, setWaveType] = useState<OscillatorType>('sine');
    const [currentFreq, setCurrentFreq] = useState<number | null>(null);
    const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
    const [gainNode, setGainNode] = useState<GainNode | null>(null);
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [selectedScale, setSelectedScale] = useState<ScaleCombination>('none');
    const [allowOutOfScale, setAllowOutOfScale] = useState(false);

    // Get root note and scale type from combined selection
    const scaleRoot = selectedScale === 'none' ? 'none' : selectedScale.split(' ')[0] as ScaleRoot;
    const scaleType = selectedScale === 'none' ? 'none' : selectedScale.split(' ')[1] as ScaleType;

    // Define scale patterns relative to root note
    const scalePatterns = {
        major: [0, 2, 4, 5, 7, 9, 11],
        minor: [0, 2, 3, 5, 7, 8, 10],
    };

    // Get note number for root note (e.g., 'C' = 0, 'C#' = 1, etc.)
    const getRootNoteNumber = (note: ScaleRoot): number => {
        const noteMap: Record<ScaleRoot, number> = {
            'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
            'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
        };
        return noteMap[note];
    };

    // Function to check if a note is in the selected scale
    const isNoteInScale = (noteNumber: number) => {
        if (scaleRoot === 'none' || scaleType === 'none') return true;

        const rootNumber = getRootNoteNumber(scaleRoot);
        const pattern = scalePatterns[scaleType];
        const noteInOctave = noteNumber % 12;
        const normalizedNote = (noteInOctave - rootNumber + 12) % 12;
        return pattern.includes(normalizedNote);
    };

    // Create piano keys
    const createOctave = (octaveNumber: number): PianoKey[] => {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const baseNoteNumber = (octaveNumber + 1) * 12;
        return notes.map((note, index) => ({
            note: `${note}${octaveNumber}`,
            noteNumber: baseNoteNumber + index,
            isBlack: note.includes('#')
        }));
    };

    const keys = [...createOctave(startOctave), ...createOctave(startOctave + 1)];
    console.log(keys);

    const initializeAudio = async () => {
        // Resume the suspended context
        await actx.resume();

        // Create and initialize oscillator
        const osc = actx.createOscillator();
        const gain = actx.createGain();

        // Set initial gain to 0 to prevent immediate sound
        gain.gain.setValueAtTime(0, actx.currentTime);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start();

        setOscillator(osc);
        setGainNode(gain);

        onAudioPermissionGranted();
    };

    const handleNoteStart = async (noteNumber: number, note: string) => {
        if (!oscillator || !gainNode) {
            throw new Error('Oscillator not initialized');
        }

        // Calculate frequency using the note number
        const getFrequency = (noteNumber: number) => {
            return 440 * Math.pow(2, (noteNumber - 69) / 12);
        }
        const frequency = getFrequency(noteNumber);
        console.log("getFrequency: ", getFrequency(69));
        oscillator.frequency.setValueAtTime(frequency, actx.currentTime);
        gainNode.gain.setValueAtTime(0.1, actx.currentTime);

        setCurrentFreq(frequency);
        setActiveKey(note);
    };

    const stopNote = () => {
        if (gainNode) {
            gainNode.gain.setValueAtTime(0, actx.currentTime);
        }
        setCurrentFreq(null);
        setActiveKey(null);
    };

    return (
        <div className="relative w-full" aria-label="Piano Keyboard Interface">
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
            <div className="w-full mb-4">
                <div className="flex items-center justify-between gap-2 p-2 bg-gray-800 rounded-lg w-full">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setStartOctave(prev => Math.max(0, prev - 1))}
                            className="px-6 py-1 bg-gray-700 rounded disabled:opacity-50"
                            disabled={startOctave === 0}
                            aria-label="Lower octave range"
                        >
                            ←
                        </button>
                        <span className="px-3 py-1">Octave {startOctave}-{startOctave + 1}</span>
                        <button
                            onClick={() => setStartOctave(prev => Math.min(7, prev + 1))}
                            className="px-6 py-1 bg-gray-700 rounded disabled:opacity-50"
                            disabled={startOctave === 7}
                        >
                            →
                        </button>
                        <div className="w-px h-8 bg-gray-600 mx-2" />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-px h-8 bg-gray-600 mx-2" />

                        {/* Combined scale selector */}
                        <select
                            value={selectedScale}
                            onChange={(e) => setSelectedScale(e.target.value as ScaleCombination)}
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

                        {selectedScale !== 'none' && (
                            <button
                                onClick={() => setAllowOutOfScale(prev => !prev)}
                                className={`
                                    px-3 py-1 rounded h-[37px] transition-colors flex items-center gap-2
                                    ${allowOutOfScale ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                                `}
                                aria-label={allowOutOfScale
                                    ? `Scale is unlocked. All notes can be played. Click to lock to ${selectedScale} scale only`
                                    : `Scale is locked to ${selectedScale}. Only scale notes can be played. Click to unlock`
                                }
                                aria-pressed={!allowOutOfScale}
                            >
                                {allowOutOfScale ? <Unlock size={16} aria-hidden="true" /> : <Lock size={16} aria-hidden="true" />}
                                <span>Scale</span>
                            </button>
                        )}

                        <div className="w-px h-8 bg-gray-600 mx-2" />
                        <select
                            value={waveType}
                            onChange={(e) => {
                                const newWaveType = e.target.value as OscillatorType;
                                setWaveType(newWaveType);
                                if (oscillator) {
                                    oscillator.type = newWaveType;
                                }
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
            <div className="relative h-48 flex w-full mb-4">
                {keys.map((key) => {
                    const inScale = isNoteInScale(key.noteNumber);
                    const isDisabled = !allowOutOfScale && scaleRoot !== 'none' && scaleType !== 'none' && !inScale;
                    return (
                        <button
                            key={key.note}
                            onMouseDown={() => handleNoteStart(key.noteNumber, key.note)}
                            onMouseUp={stopNote}
                            onMouseLeave={stopNote}
                            onTouchStart={(e) => {
                                e.preventDefault();
                                if (!isDisabled) {
                                    handleNoteStart(key.noteNumber, key.note);
                                }
                            }}
                            onTouchEnd={(e) => {
                                e.preventDefault();
                                stopNote();
                            }}
                            style={{
                                backgroundImage: !inScale && scaleRoot !== 'none' ?
                                    `repeating-linear-gradient(45deg, 
                                        ${allowOutOfScale ? '#4a6e55' : '#fee2e2'}, 
                                        ${allowOutOfScale ? '#4a6e55' : '#fee2e2'} 10px, 
                                        #ffffff 10px, 
                                        #ffffff 20px)` :
                                    'none'
                            }}
                            className={`
                                ${key.isBlack
                                    ? 'bg-black h-3/5 w-[4%] -mx-[2%] z-10 absolute'
                                    : 'bg-white h-full w-[12.5%] border border-gray-300 relative'
                                }
                                ${selectedScale !== 'none' ?
                                    'border border-gray-400' :
                                    ''
                                }
                                ${selectedScale !== 'none' && inScale ?
                                    'ring-1 ring-blue-400 ring-opacity-50' :
                                    ''
                                }
                                ${key.isBlack ? 'shadow-lg' : 'shadow-sm'}
                                ${activeKey === key.note ?
                                    (key.isBlack ? 'bg-gray-800' : 'bg-gray-200') :
                                    (key.isBlack ? 'hover:bg-gray-900' : 'hover:bg-gray-100')
                                }
                                ${!allowOutOfScale && !inScale && scaleRoot !== 'none' ?
                                    'disabled:cursor-not-allowed' :
                                    ''
                                }
                                relative touch-none select-none
                                transition-colors duration-150
                            `}
                            aria-label={`Piano key ${key.note}${isDisabled ? ' (not in current scale)' : ''}`}
                            aria-disabled={isDisabled}
                            aria-pressed={activeKey === key.note}
                        >
                            <span className={`
                                absolute bottom-1 left-1 text-xs 
                                whitespace-pre-line leading-tight
                                text-left
                                ${key.isBlack ? 'text-white' : 'text-black'}
                                ${isDisabled ? 'text-gray-900' : ''}
                            `}>
                                {key.note.replace('#', '\n#')}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="flex justify-end mt-4">
                <div
                    className="px-3 py-2 bg-gray-700 rounded h-[37px] flex items-center"
                    role="status"
                    aria-live="polite"
                    aria-label={currentFreq ? `Current frequency: ${currentFreq.toFixed(1)} Hertz` : 'No note playing'}
                >
                    {currentFreq ? `${currentFreq.toFixed(1)} Hz` : 'No note playing'}
                </div>
            </div>
        </div>
    );
}