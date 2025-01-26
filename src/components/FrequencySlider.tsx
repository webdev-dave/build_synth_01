import React, { useState } from 'react';

interface FrequencySliderProps {
    oscillator: OscillatorNode | null;
}

export default function FrequencySlider({ oscillator }: FrequencySliderProps) {
    const [frequency, setFrequency] = useState(440);
    const handleFrequencyChange = (newFrequency: number) => {
        setFrequency(newFrequency);
        if (oscillator) {
            oscillator.frequency.value = newFrequency;
        }
    };

    return (
        <div className="mt-0">
            <label htmlFor="frequency" className="block mb-2">
                Frequency: {frequency}Hz
            </label>
            <input
                type="range"
                id="frequency"
                min="20"
                max="2000"
                step="1"
                value={frequency}
                onChange={(e) => handleFrequencyChange(Number(e.target.value))}
                className="w-full"
            />
        </div>
    );
} 