import { useState } from "react";

interface DetuneSliderProps {
    oscillator: OscillatorNode | null;
}

export default function DetuneSlider({ oscillator }: DetuneSliderProps) {
    const [detune, setDetune] = useState(0);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newDetune = parseInt(event.target.value);
        setDetune(newDetune);
        if (oscillator) {
            oscillator.detune.value = newDetune;
        }
    };

    const handleDoubleClick = () => {
        setDetune(0);
        if (oscillator) {
            oscillator.detune.value = 0;
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="detune" className="block">
                Detune: {detune} cents
            </label>
            <input
                type="range"
                id="detune"
                min="-100"
                max="100"
                step="1"
                value={detune}
                onChange={handleChange}
                onDoubleClick={handleDoubleClick}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>
    );
}