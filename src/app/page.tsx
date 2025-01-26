'use client';
import Oscillator from '@/components/Oscillator';
import { useEffect, useState } from 'react';

// Add this type declaration for Safari's webkitAudioContext
interface WindowWithWebkit extends Window {
  webkitAudioContext: typeof AudioContext;
}

export default function Home() {
  const [actx, setActx] = useState<AudioContext | null>(null);

  useEffect(() => {
    let mounted = true;
    let audioContext: AudioContext | null = null;

    try {
      // Properly typed AudioContext for both standard and webkit
      const AudioContextClass = window.AudioContext ||
        (window as unknown as WindowWithWebkit).webkitAudioContext;

      if (AudioContextClass && mounted) {
        audioContext = new AudioContextClass();
        audioContext.suspend(); // Start in suspended state
        setActx(audioContext);
      }
    } catch (error) {
      console.error('Error initializing AudioContext:', error);
    }

    return () => {
      mounted = false;
      audioContext?.close();
    };
  }, []);

  return (
    <main>
      <div className="bg-synth-bg p-6 rounded-md border-2">
        <h1 className='text-3xl pb-4 font-bold'>Synth-v01</h1>
        <div className='flex flex-col gap-4 mt-16 text-lg'>
          <p className='className="block mb-0'>Wave: Sine</p>
          {actx ? (
            <Oscillator actx={actx} />
          ) : (
            <div>Initializing Audio Context...</div>
          )}
        </div>
      </div>
    </main>
  );
}