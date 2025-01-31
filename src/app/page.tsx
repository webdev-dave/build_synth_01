'use client';
// import Oscillator from '@/components/Oscillator';
import { useEffect, useState } from 'react';
import PianoKeyboard from '../components/PianoKeyboard';

// Add this type declaration for Safari's webkitAudioContext
interface WindowWithWebkit extends Window {
  webkitAudioContext: typeof AudioContext;
}

export default function Home() {
  const [actx, setActx] = useState<AudioContext | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  useEffect(() => {
    // Check initial orientation
    setIsPortrait(window.innerHeight > window.innerWidth);

    // Listen for orientation changes
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    };
  }, []);

  if (isPortrait) {
    return (
      <div className="h-screen flex items-center justify-center p-4 bg-synth-bg text-center">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Please Rotate Your Device</h2>
          <p>This synth works best in landscape mode 🎹</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="bg-synth-bg p-6 rounded-md border-2">
        <h1 className='text-3xl pb-4 font-bold'>Synth-v01</h1>
        <div className='flex flex-col gap-4 mt-16 text-lg'>
          {/* <p className='className="block mb-0'>Wave: Sine</p> */}
          {actx ? (
            <>
              {/* <Oscillator actx={actx} /> */}
              <PianoKeyboard
                actx={actx}
                isAudioInitialized={isAudioInitialized}
                onAudioInitialized={() => setIsAudioInitialized(true)}
              />
            </>
          ) : (
            <div>Initializing Audio Context...</div>
          )}
        </div>
      </div>
    </main>
  );
}