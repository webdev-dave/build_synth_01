'use client';
import Osc1 from '@/components/Osc1';
import ToggleSound from '@/components/ToggleSound';
import { useEffect, useState } from 'react';

export default function Home() {
  const [actx, setActx] = useState<AudioContext | null>(null);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  // const [gainNode, setGainNode] = useState<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [oscHasStarted, setOscHasStarted] = useState(false);
  const [frequency, setFrequency] = useState(440);



  useEffect(() => {
    let mounted = true;

    try {
      // Fix Safari audio context
      const AudioContextClass = window.AudioContext ||
        ((window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);

      if (AudioContextClass && mounted) {
        const newContext = new AudioContextClass();

        // Safari requires user interaction before starting audio context
        if (newContext.state === 'suspended') {
          const resumeOnClick = () => {
            newContext.resume();
            document.removeEventListener('click', resumeOnClick);
          };
          document.addEventListener('click', resumeOnClick);
        }

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



  return (
    <main>
      <div className="bg-synth-bg p-6 rounded-md border-2">

        <h1 className='text-3xl pb-4 font-bold'>Synth-v01</h1>
        {actx ? (
          <div className='flex flex-col gap-4 mt-16 text-lg'>
            <p className='className="block mb-0'>Wave: Sine</p>
            <Osc1
              frequency={frequency}
              onChange={setFrequency}
              oscillator={oscillator}
            />
            <ToggleSound
              actx={actx}
              oscillator={oscillator}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              oscHasStarted={oscHasStarted}
              setOscHasStarted={setOscHasStarted}
            />
          </div>
        ) : (
          <div>Initializing Audio Context...</div>
        )}

      </div>
    </main>
  );
}