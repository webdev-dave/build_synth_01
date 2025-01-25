'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [actx, setActx] = useState<AudioContext | null>(null);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  const [gainNode, setGainNode] = useState<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);  // New state for tracking if oscillator has been started

  useEffect(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      
      if (AudioContextClass) {
        const newContext = new AudioContextClass();
        setActx(newContext);
        
        const out = newContext.destination;
        const osc = newContext.createOscillator();
        const gain = newContext.createGain();

        gain.gain.value = 0.1;
        osc.frequency.value = 440;

        osc.connect(gain);
        gain.connect(out);

        setOscillator(osc);
        setGainNode(gain);
      }
    } catch (error) {
      console.error('Error initializing AudioContext:', error);
    }

    return () => {
      oscillator?.stop();
      actx?.close();
    };
  }, []);

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
        oscillator.start();
        setHasStarted(true);  // Track the started state in React
      }
      setIsPlaying(true);
    }
  };

  return (
    <div className="">
      <main>
        <h1>Sliders</h1>
        {actx ? (
          <div>
            <div>Audio Context initialized!</div>
            <button
              onClick={toggleSound}
              className="px-4 py-2 bg-orange-500 text-white rounded"
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