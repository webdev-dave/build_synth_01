import FrequencySlider from './FrequencySlider';
import DetuneSlider from './DetuneSlider';
import { useEffect, useState } from 'react';
import ToggleSound from './ToggleSound';

interface Oscillator {
    actx: AudioContext | null;
}

export default function Oscillator({ actx }: Oscillator) {
    const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [oscHasStarted, setOscHasStarted] = useState(false);

    useEffect(() => {
        if (!actx) return;

        const osc = actx.createOscillator();
        const gain = actx.createGain();
        const out = actx.destination;

        gain.gain.value = 0.1;
        osc.connect(gain);
        gain.connect(out);

        setOscillator(osc);

        return () => {
            osc.disconnect();
            gain.disconnect();
        };
    }, [actx]);

    return (
        <div className="p-4 border-2 rounded-lg bg-osc-bg">
            <h2 className="text-xl font-bold mb-4">Oscillator 1</h2>
            <div className="flex flex-col gap-4">
                <FrequencySlider
                    oscillator={oscillator}
                />
                <DetuneSlider
                    oscillator={oscillator}
                />
                <div className="w-full mt-4">
                    <ToggleSound
                        actx={actx}
                        oscillator={oscillator}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        oscHasStarted={oscHasStarted}
                        setOscHasStarted={setOscHasStarted}
                    />
                </div>
            </div>
        </div>
    );
}