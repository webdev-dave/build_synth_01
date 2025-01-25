import React from 'react';

interface FrequencySliderProps {
    frequency: number;
    onChange: (frequency: number) => void;
}

export default function FrequencySlider({ frequency, onChange }: FrequencySliderProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFrequency = parseFloat(event.target.value);
        onChange(newFrequency);
    };

    return (
        <div className="mt-4">
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
                onChange={handleChange}
                className="w-full"
            />
        </div>
    );
} 