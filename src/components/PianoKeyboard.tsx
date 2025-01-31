import { useState, useEffect } from 'react';

interface PianoKeyboardProps {
    actx: AudioContext;
}

type PianoKey = {
    note: string;
    noteNumber: number;
    isBlack: boolean;
}

type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

function getNoteFrequency(noteNumber: number): number {
    // Standard Western tuning: A4 (note 69) = 440 Hz
    return 440 * Math.pow(2, (noteNumber - 69) / 12);
}

export default function PianoKeyboard({ actx }: PianoKeyboardProps) {
    const [startOctave, setStartOctave] = useState(4);
    const [waveType, setWaveType] = useState<OscillatorType>('sine');
    const [currentFreq, setCurrentFreq] = useState<number | null>(null);
    const [activeOscillator, setActiveOscillator] = useState<OscillatorNode | null>(null);
    const [activeGain, setActiveGain] = useState<GainNode | null>(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [activeKey, setActiveKey] = useState<string | null>(null);

    const createOctave = (octaveNumber: number): PianoKey[] => {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const baseNoteNumber = (octaveNumber + 1) * 12;

        return notes.map((note, index) => ({
            note: `${note}${octaveNumber}`,
            noteNumber: baseNoteNumber + index,
            isBlack: note.includes('#')
        }));
    };

    const handleOctaveChange = (direction: 'up' | 'down') => {
        setStartOctave(prev => {
            if (direction === 'up' && prev < 7) return prev + 1;
            if (direction === 'down' && prev > 0) return prev - 1;
            return prev;
        });
    };

    // Generate keys for two octaves
    const keys = [...createOctave(startOctave), ...createOctave(startOctave + 1)];
    console.log(keys);

    const stopNote = () => {
        if (activeOscillator && activeGain) {
            activeOscillator.stop();
            activeOscillator.disconnect();
            activeGain.disconnect();
            setActiveOscillator(null);
            setActiveGain(null);
            setCurrentFreq(null);
        }
    };

    const playNote = async (frequency: number) => {
        stopNote(); // Stop any playing note
        if (actx.state === 'suspended') {
            await actx.resume();
        }

        const osc = actx.createOscillator();
        const gain = actx.createGain();

        gain.gain.value = 0.1;
        osc.frequency.value = frequency;
        osc.type = waveType;

        osc.connect(gain);
        gain.connect(actx.destination);

        setActiveOscillator(osc);
        setActiveGain(gain);
        setCurrentFreq(frequency);

        osc.start();
    };

    const handleTouchStart = async (event: React.TouchEvent, key: PianoKey) => {
        event.preventDefault();
        event.stopPropagation();

        // Resume audio context if suspended
        if (actx.state === 'suspended') {
            await actx.resume();
        }

        setActiveKey(key.note);
        const frequency = getNoteFrequency(key.noteNumber);
        await playNote(frequency);
    };

    const handleTouchEnd = (event: React.TouchEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setActiveKey(null);
        stopNote();
    };

    // Add this to component cleanup
    useEffect(() => {
        return () => {
            stopNote();
            setActiveKey(null);
        };
    }, []);

    return (
        <div className="relative w-full"
            onMouseUp={() => setIsMouseDown(false)}
            onMouseLeave={() => setIsMouseDown(false)}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
        >
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
                        key={`${key.note}-${key.noteNumber}`}
                        className={`
                            ${key.isBlack
                                ? 'bg-black h-3/5 w-[4%] -mx-[2%] z-10 relative'
                                : 'bg-white h-full w-[12.5%] border border-gray-300'
                            }
                            hover:bg-gray-100 active:bg-gray-200
                            ${key.isBlack ? 'hover:bg-gray-900 active:bg-gray-800' : ''}
                            ${activeKey === key.note ? 'opacity-75' : ''}
                            relative
                        `}
                        onMouseDown={async () => {
                            setIsMouseDown(true);
                            const frequency = getNoteFrequency(key.noteNumber);
                            await playNote(frequency);
                        }}
                        onMouseEnter={async () => {
                            if (isMouseDown) {
                                const frequency = getNoteFrequency(key.noteNumber);
                                await playNote(frequency);
                            }
                        }}
                        onMouseUp={() => {
                            setIsMouseDown(false);
                            stopNote();
                        }}
                        onMouseLeave={stopNote}
                        onTouchStart={(e) => handleTouchStart(e, key)}
                        onTouchEnd={handleTouchEnd}
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