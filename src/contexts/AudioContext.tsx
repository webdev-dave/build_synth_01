"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";

interface WindowWithWebkit extends Window {
  webkitAudioContext: typeof AudioContext;
}

interface AudioContextValue {
  audioContext: AudioContext | null;
  hasAudioPermission: boolean;
  initializeAudio: () => Promise<void>;
}

const SharedAudioContext = createContext<AudioContextValue | null>(null);

/**
 * Global AudioContext provider that persists across page navigations.
 * The AudioContext is created once and reused throughout the app lifecycle.
 */
export function AudioContextProvider({ children }: { children: ReactNode }) {
  const [hasAudioPermission, setHasAudioPermission] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client before accessing window
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Create AudioContext lazily (on first access or initialization)
  const getOrCreateAudioContext = useCallback((): AudioContext | null => {
    if (!isClient) return null;

    if (audioContextRef.current) {
      return audioContextRef.current;
    }

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as WindowWithWebkit).webkitAudioContext;

      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
        return audioContextRef.current;
      }
    } catch (error) {
      console.error("Error creating AudioContext:", error);
    }

    return null;
  }, [isClient]);

  const initializeAudio = useCallback(async () => {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return;

    try {
      // Resume if suspended (required after user gesture)
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      setHasAudioPermission(true);
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  }, [getOrCreateAudioContext]);

  // Check if we already have permission (e.g., context is running)
  useEffect(() => {
    if (audioContextRef.current && audioContextRef.current.state === "running") {
      setHasAudioPermission(true);
    }
  }, [isClient]);

  const value: AudioContextValue = {
    audioContext: isClient ? getOrCreateAudioContext() : null,
    hasAudioPermission,
    initializeAudio,
  };

  return (
    <SharedAudioContext.Provider value={value}>
      {children}
    </SharedAudioContext.Provider>
  );
}

/**
 * Hook to access the shared AudioContext.
 * Must be used within AudioContextProvider.
 */
export function useSharedAudioContext(): AudioContextValue {
  const context = useContext(SharedAudioContext);

  if (!context) {
    throw new Error(
      "useSharedAudioContext must be used within AudioContextProvider"
    );
  }

  return context;
}
