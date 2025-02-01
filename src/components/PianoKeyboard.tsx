import { useState } from 'react';

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

export default function PianoKeyboard({ actx, hasAudioPermission, onAudioPermissionGranted }: PianoKeyboardProps) {
    const [startOctave, setStartOctave] = useState(4);
    const [waveType, setWaveType] = useState<OscillatorType>('sine');
    const [currentFreq, setCurrentFreq] = useState<number | null>(null);
    const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
    const [gainNode, setGainNode] = useState<GainNode | null>(null);
    const [activeKey, setActiveKey] = useState<string | null>(null);


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
        const frequency = 440 * Math.pow(2, (noteNumber - 69) / 12);

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
        <div className="relative w-full">
            {!hasAudioPermission && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 z-50">
                    <button onClick={initializeAudio} className="p-8 sm:p-12">
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
                {keys.map((key) => (
                    <button
                        key={key.note}
                        onMouseDown={() => handleNoteStart(key.noteNumber, key.note)}
                        onMouseUp={stopNote}
                        onMouseLeave={stopNote}
                        onTouchStart={(e) => {
                            e.preventDefault();
                            handleNoteStart(key.noteNumber, key.note);
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
                            ${activeKey === key.note ?
                                (key.isBlack ? 'bg-gray-800' : 'bg-gray-200') :
                                'hover:bg-gray-100'
                            }
                            ${key.isBlack ? 'hover:bg-gray-900' : ''}
                            relative touch-none select-none
                        `}
                    >
                        <span className={`absolute bottom-1 left-1 text-xs ${key.isBlack ? 'text-white' : 'text-black'}`}>
                            {key.note}
                        </span>
                    </button>
                ))}
            </div>

            <div className="flex justify-end mt-4">
                <div className="px-3 py-2 bg-gray-700 rounded h-[37px] flex items-center">
                    {currentFreq ? `${currentFreq.toFixed(1)} Hz` : 'No note playing'}
                </div>
            </div>
        </div>
    );
}