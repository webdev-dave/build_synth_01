import React from 'react';

interface FrequencySliderProps {
    frequency: number;
    onChange: (frequency: number) => void;
    oscillator: OscillatorNode | null;
}

export default function FrequencySlider({ frequency, onChange, oscillator }: FrequencySliderProps) {
    
    const handleFrequencyChange = (newFrequency: number) => {
        onChange(newFrequency);
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