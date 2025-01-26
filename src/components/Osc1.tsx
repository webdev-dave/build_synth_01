import FrequencySlider from './FrequencySlider';
import DetuneSlider from './DetuneSlider';
import { useState } from 'react';

interface Osc1Props {
    frequency: number;
    onChange: (frequency: number) => void;
    oscillator: OscillatorNode | null;
}

export default function Osc1({ frequency, onChange, oscillator }: Osc1Props) {
    const [detune, setDetune] = useState(0);

    return (
        <div className="p-4 border-2 rounded-lg bg-osc-bg">
            <h2 className="text-xl font-bold mb-4">Oscillator 1</h2>
            <div className="flex flex-col gap-4">
                <FrequencySlider
                    frequency={frequency}
                    onChange={onChange}
                    oscillator={oscillator}
                />
                <DetuneSlider
                    detune={detune}
                    onChange={setDetune}
                    oscillator={oscillator}
                />
            </div>
        </div>
    );
}