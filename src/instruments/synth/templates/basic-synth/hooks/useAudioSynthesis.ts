import { useState, useCallback, useRef, useEffect } from "react";
import { noteNumberToFrequency } from "../utils/synthUtils";
import type { SynthKey } from "../utils/synthUtils";

export type OscillatorType = "sine" | "square" | "sawtooth" | "triangle";

interface ActiveVoice {
  oscillator: OscillatorNode;
  gain: GainNode;
}

interface UseAudioSynthesisReturn {
  activeOscillators: Map<string, ActiveVoice>;
  activeKeys: Set<string>;
  activeNoteFreq: number | null;
  waveType: OscillatorType;
  setWaveType: (type: OscillatorType) => void;
  handleNoteStart: (noteNumber: number, note: string) => Promise<void>;
  stopNote: (note: string) => void;
  scheduleNote: (frequency: number, startTime: number, duration: number) => void;
  initializeAudio: () => Promise<void>;
}

/** Seconds of release ramp before the oscillator is torn down. */
const RELEASE = 0.1;

export function useAudioSynthesis(
  actx: AudioContext | null,
  onAudioPermissionGranted: () => void,
  keys: SynthKey[]
): UseAudioSynthesisReturn {
  const [waveType, setWaveType] = useState<OscillatorType>("sine");
  const [activeNoteFreq, setActiveNoteFreq] = useState<number | null>(null);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [activeOscillators, setActiveOscillators] = useState<
    Map<string, ActiveVoice>
  >(new Map());

  /*
   * The sounding voices live in a ref, not in state: note-off frequently
   * arrives before React has committed the note-on render (a quick tap, or
   * the gesture that unlocks the AudioContext). Reading state there would
   * miss the voice and leave the oscillator running forever. State is kept
   * only as a mirror for consumers that want to render voice count.
   */
  const voicesRef = useRef<Map<string, ActiveVoice>>(new Map());
  const waveTypeRef = useRef(waveType);
  const keysRef = useRef(keys);
  keysRef.current = keys;

  const publishVoices = useCallback(() => {
    setActiveOscillators(new Map(voicesRef.current));
  }, []);

  const initializeAudio = useCallback(async () => {
    if (!actx) return;
    await actx.resume();
    onAudioPermissionGranted();
  }, [actx, onAudioPermissionGranted]);

  const handleNoteStart = useCallback(
    /*
     * Async only to preserve the original signature — the body must stay
     * synchronous so the voice is registered before any note-off can run.
     */
    async (noteNumber: number, note: string) => {
      if (!actx || voicesRef.current.has(note)) return;

      const frequency = noteNumberToFrequency(noteNumber);
      const osc = actx.createOscillator();
      const gain = actx.createGain();

      osc.type = waveTypeRef.current;
      osc.frequency.setValueAtTime(frequency, actx.currentTime);
      gain.gain.setValueAtTime(0.1, actx.currentTime);

      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();

      voicesRef.current.set(note, { oscillator: osc, gain });
      publishVoices();

      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.add(note);
        setActiveNoteFreq(next.size === 1 ? frequency : null);
        return next;
      });
    },
    [actx, publishVoices]
  );

  const stopNote = useCallback(
    (note: string) => {
      const voice = voicesRef.current.get(note);
      if (!actx || !voice) return;

      const { oscillator, gain } = voice;

      // Free the slot immediately so a re-press during the release tail
      // starts a fresh voice instead of being swallowed as "already sounding".
      voicesRef.current.delete(note);
      publishVoices();

      const now = actx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + RELEASE);
      oscillator.stop(now + RELEASE);

      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(note);

        if (next.size === 1) {
          const remaining = keysRef.current.find((k) => k.note === [...next][0]);
          setActiveNoteFreq(
            remaining ? noteNumberToFrequency(remaining.noteNumber) : null
          );
        } else if (next.size === 0) {
          setActiveNoteFreq(null);
        }

        return next;
      });
    },
    [actx, publishVoices]
  );

  const scheduleNote = useCallback(
    (frequency: number, startTime: number, duration: number) => {
      if (!actx) return;

      const osc = actx.createOscillator();
      const gain = actx.createGain();

      const t = Math.max(startTime, actx.currentTime);

      osc.type = waveTypeRef.current;
      osc.frequency.setValueAtTime(frequency, t);
      
      const attackTime = 0.01;
      const actualDuration = Math.max(duration, attackTime + 0.01);
      
      // Attack and Release envelope
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.1, t + attackTime); // Quick attack
      
      const releaseTime = Math.max(t + attackTime, t + actualDuration - RELEASE);
      gain.gain.setValueAtTime(0.1, releaseTime);
      gain.gain.linearRampToValueAtTime(0, t + actualDuration); // Release

      osc.connect(gain);
      gain.connect(actx.destination);
      
      osc.start(t);
      osc.stop(t + actualDuration);
    },
    [actx]
  );

  const updateWaveType = useCallback((newWaveType: OscillatorType) => {
    waveTypeRef.current = newWaveType;
    setWaveType(newWaveType);
    voicesRef.current.forEach(({ oscillator }) => {
      oscillator.type = newWaveType;
    });
  }, []);

  // Never leave a note sounding after the instrument unmounts.
  useEffect(() => {
    const voices = voicesRef.current;
    return () => {
      voices.forEach(({ oscillator }) => {
        try {
          oscillator.stop();
        } catch {
          // Already stopped — nothing to clean up.
        }
      });
      voices.clear();
    };
  }, []);

  return {
    activeOscillators,
    activeKeys,
    activeNoteFreq,
    waveType,
    setWaveType: updateWaveType,
    handleNoteStart,
    stopNote,
    scheduleNote,
    initializeAudio,
  };
}
