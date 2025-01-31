import { useState } from 'react';

interface PianoKeyboardProps {
    actx: AudioContext;
    isAudioInitialized: boolean;
    onAudioInitialized: () => void;
}

type PianoKey = {
    note: string;
    noteNumber: number;
    isBlack: boolean;
}

type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

export default function PianoKeyboard({ actx, isAudioInitialized, onAudioInitialized }: PianoKeyboardProps) {
    const [startOctave, setStartOctave] = useState(4);
    const [waveType, setWaveType] = useState<OscillatorType>('sine');
    const [currentFreq, setCurrentFreq] = useState<number | null>(null);
    const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);

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

    // Audio functions
    const playNote = async (frequency: number) => {
        // Stop any playing note
        if (oscillator) {
            oscillator.stop();
            oscillator.disconnect();
        }

        // Create and configure new oscillator
        const osc = actx.createOscillator();
        const gain = actx.createGain();

        gain.gain.value = 0.1;
        osc.frequency.value = frequency;
        osc.type = waveType;

        osc.connect(gain);
        gain.connect(actx.destination);

        // Start the note
        if (actx.state === 'suspended') {
            await actx.resume();
        }
        osc.start();

        setOscillator(osc);
        setCurrentFreq(frequency);
    };

    const stopNote = () => {
        if (oscillator) {
            oscillator.stop();
            oscillator.disconnect();
            setOscillator(null);
            setCurrentFreq(null);
        }
    };

    // Initialize audio context with explicit user interaction
    const initializeAudio = async () => {
        if (actx.state === 'suspended') {
            await actx.resume();
            onAudioInitialized();
        }
    };

    // Event handlers
    const handleNoteStart = async (noteNumber: number) => {
        if (!isAudioInitialized) {
            await initializeAudio();
        }
        const frequency = 440 * Math.pow(2, (noteNumber - 69) / 12);
        await playNote(frequency);
    };

    const handleOctaveChange = (direction: 'up' | 'down') => {
        setStartOctave(prev => {
            if (direction === 'up' && prev < 7) return prev + 1;
            if (direction === 'down' && prev > 0) return prev - 1;
            return prev;
        });
    };

    return (
        <div className="relative w-full">
            {!isAudioInitialized && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <button
                        onClick={initializeAudio}
                        className="px-4 py-2 bg-gray-700 rounded text-white"
                    >
                        Tap to Enable Sound
                    </button>
                </div>
            )}
            <div className="flex gap-2 mb-4 items-center">
                <button
                    onClick={() => handleOctaveChange('down')}
                    className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                    disabled={startOctave === 0}
                >
                    ← Octave Down
                </button>
                <span className="px-3 py-1">Octave {startOctave}-{startOctave + 1}</span>
                <button
                    onClick={() => handleOctaveChange('up')}
                    className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                    disabled={startOctave === 7}
                >
                    Octave Up →
                </button>

                <select
                    value={waveType}
                    onChange={(e) => setWaveType(e.target.value as OscillatorType)}
                    className="ml-4 px-3 py-1 bg-gray-700 rounded h-[37px]"
                >
                    <option value="sine">Sine</option>
                    <option value="square">Square</option>
                    <option value="sawtooth">Sawtooth</option>
                    <option value="triangle">Triangle</option>
                </select>
            </div>

            <div className="relative h-48 flex w-full">
                {keys.map((key) => (
                    <button
                        key={key.note}
                        onMouseDown={() => handleNoteStart(key.noteNumber)}
                        onMouseUp={stopNote}
                        onTouchStart={(e) => {
                            e.preventDefault();
                            handleNoteStart(key.noteNumber);
                        }}
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            stopNote();
                        }}
                        className={`
                            ${key.isBlack
                                ? 'bg-black h-3/5 w-[4%] -mx-[2%] z-10 relative'
                                : 'bg-white h-full w-[12.5%] border border-gray-300'
                            }
                            hover:bg-gray-100 active:bg-gray-200
                            ${key.isBlack ? 'hover:bg-gray-900 active:bg-gray-800' : ''}
                            relative
                        `}
                    >
                        <span className={`
                            absolute bottom-1 left-1 text-xs
                            ${key.isBlack ? 'text-white' : 'text-black'}
                        `}>
                            {key.note}
                        </span>
                    </button>
                ))}
            </div>

            <div className="flex justify-end mt-4">
                <div className="px-3 py-1 bg-gray-700 rounded h-[37px] flex items-center">
                    {currentFreq ? `${currentFreq.toFixed(1)} Hz` : 'No note playing'}
                </div>
            </div>
        </div>
    );
} 