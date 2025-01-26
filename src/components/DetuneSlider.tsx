interface DetuneSliderProps {
    detune: number;
    onChange: (detune: number) => void;
    oscillator: OscillatorNode | null;
}

export default function DetuneSlider({ detune, onChange, oscillator }: DetuneSliderProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newDetune = parseInt(event.target.value);
        onChange(newDetune);
        if (oscillator) {
            oscillator.detune.value = newDetune;
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
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>
    );
}