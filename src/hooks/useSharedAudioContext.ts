import { useState, useEffect, useCallback } from "react";

// Add this type declaration for Safari's webkitAudioContext
interface WindowWithWebkit extends Window {
  webkitAudioContext: typeof AudioContext;
}

interface UseSharedAudioContextReturn {
  audioContext: AudioContext | null;
  hasAudioPermission: boolean;
  initializeAudio: () => Promise<void>;
  cleanupAudio: () => void;
}

export function useSharedAudioContext(): UseSharedAudioContextReturn {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(false);

  // Initialize AudioContext when component mounts
  useEffect(() => {
    let mounted = true;
    let actx: AudioContext | null = null;

    try {
      // Properly typed AudioContext for both standard and webkit
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as WindowWithWebkit).webkitAudioContext;

      if (AudioContextClass && mounted) {
        actx = new AudioContextClass();
        actx.suspend(); // Start in suspended state
        setAudioContext(actx);
      }
    } catch (error) {
      console.error("Error initializing AudioContext:", error);
    }

    return () => {
      mounted = false;
      if (actx) {
        actx.close();
      }
    };
  }, []);

  const initializeAudio = useCallback(async () => {
    if (!audioContext) return;

    try {
      await audioContext.resume();
      setHasAudioPermission(true);
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  }, [audioContext]);

  const cleanupAudio = useCallback(() => {
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
      setHasAudioPermission(false);
    }
  }, [audioContext]);

  return {
    audioContext,
    hasAudioPermission,
    initializeAudio,
    cleanupAudio,
  };
}
