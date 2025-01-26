'use client';
import Oscillator from '@/components/Oscillator';
import { useEffect, useState } from 'react';

export default function Home() {
  const [actx, setActx] = useState<AudioContext | null>(null);

  useEffect(() => {
    let mounted = true;
    let audioContext: AudioContext | null = null;

    try {
      const AudioContextClass = window.AudioContext ||
        ((window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);

      if (AudioContextClass && mounted) {
        audioContext = new AudioContextClass();

        if (audioContext.state === 'suspended') {
          const resumeOnClick = () => {
            audioContext?.resume();
            document.removeEventListener('click', resumeOnClick);
          };
          document.addEventListener('click', resumeOnClick);
        }

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
        {actx ? (
          <div className='flex flex-col gap-4 mt-16 text-lg'>
            <p className='className="block mb-0'>Wave: Sine</p>
            <Oscillator actx={actx} />
          </div>
        ) : (
          <div>Initializing Audio Context...</div>
        )}
      </div>
    </main>
  );
}