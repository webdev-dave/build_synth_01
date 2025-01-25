'use client';
import FrequencySlider from '@/components/FrequencySlider';
import { useEffect, useState } from 'react';

export default function Home() {
  const [actx, setActx] = useState<AudioContext | null>(null);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  // const [gainNode, setGainNode] = useState<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [frequency, setFrequency] = useState(440);



  useEffect(() => {
    let mounted = true;

    try {
      const AudioContextClass: typeof AudioContext =
        window.AudioContext || ((window as any).webkitAudioContext as typeof AudioContext);


      if (AudioContextClass && mounted) {
        const newContext = new AudioContextClass();
        setActx(newContext);

        const out = newContext.destination;
        const osc = newContext.createOscillator();
        const gain = newContext.createGain();

        gain.gain.value = 0.1;
        osc.frequency.value = frequency;

        osc.connect(gain);
        gain.connect(out);

        if (mounted) {
          setOscillator(osc);
          // setGainNode(gain);
        }
      }
    } catch (error) {
      console.error('Error initializing AudioContext:', error);
    }

    return () => {
      mounted = false;
      oscillator?.stop();
      actx?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFrequencyChange = (newFrequency: number) => {
    setFrequency(newFrequency);
    if (oscillator) {
      oscillator.frequency.value = newFrequency;
    }
  };

  const toggleSound = async () => {
    if (!actx || !oscillator) return;

    if (isPlaying) {
      await actx.suspend();
      setIsPlaying(false);
    } else {
      if (actx.state === 'suspended') {
        await actx.resume();
      }
      if (!hasStarted) {
        oscillator.start(); // Start the oscillator (can only be called once)
        setHasStarted(true);
      }
      setIsPlaying(true);
    }
  };

  return (
    <div className="">
      <main>
        <h1 className='text-3xl pb-4 font-bold'>Synth-v01</h1>
        {actx ? (
          <div className='flex flex-col gap-4 my-10'>
            <FrequencySlider
              frequency={frequency}
              onChange={handleFrequencyChange}
            />
            <button
              onClick={toggleSound}
              className="px-4 py-2 bg-orange-600 text-white rounded"
            >
              {isPlaying ? 'Stop Sound' : 'Start Sound'}
            </button>
          </div>
        ) : (
          <div>Initializing Audio Context...</div>
        )}
      </main>
    </div>
  );
}