import { useState, useCallback, useRef, useEffect } from "react";
import { noteNumberToFrequency } from "../utils/synthUtils";
import type { SynthKey } from "../utils/synthUtils";
import {
  NO_DETUNE,
  applyDetune,
  midiFromFrequency,
  type DetuneMap,
} from "@/lib/music/detune";

export type OscillatorType = "sine" | "square" | "sawtooth" | "triangle";

interface ActiveVoice {
  oscillator: OscillatorNode;
  gain: GainNode;
  noteNumber: number;
}

interface UseAudioSynthesisReturn {
  activeOscillators: Map<string, ActiveVoice>;
  activeKeys: Set<string>;
  activeNoteFreq: number | null;
  waveType: OscillatorType;
  setWaveType: (type: OscillatorType) => void;
  /**
   * Cents per pitch class (C = 0) applied to every voice, held or
   * scheduled — the quarter-tone strip of a Middle Eastern keyboard.
   * Changing it retunes notes that are already sounding.
   */
  detuneCents: DetuneMap;
  setDetuneCents: (map: DetuneMap) => void;
  handleNoteStart: (noteNumber: number, note: string) => Promise<void>;
  stopNote: (note: string) => void;
  scheduleNote: (frequency: number, startTime: number, duration: number) => void;
  initializeAudio: () => Promise<void>;
}

/** Seconds of release ramp before the oscillator is torn down. */
const RELEASE = 0.1;

const pitchClass = (noteNumber: number) => ((noteNumber % 12) + 12) % 12;

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

  const [detuneCents, setDetuneState] = useState<DetuneMap>(NO_DETUNE);
  const detuneRef = useRef<DetuneMap>(NO_DETUNE);
  const centsFor = useCallback(
    (noteNumber: number) => detuneRef.current[pitchClass(noteNumber)] ?? 0,
    [],
  );
  /** The pitch a key actually sounds at, detune included — what the Hz readout must show. */
  const soundingFrequency = useCallback(
    (noteNumber: number) => applyDetune(noteNumberToFrequency(noteNumber), centsFor(noteNumber)),
    [centsFor],
  );

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
      osc.detune.setValueAtTime(centsFor(noteNumber), actx.currentTime);
      gain.gain.setValueAtTime(0.1, actx.currentTime);

      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();

      voicesRef.current.set(note, { oscillator: osc, gain, noteNumber });
      publishVoices();

      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.add(note);
        setActiveNoteFreq(next.size === 1 ? soundingFrequency(noteNumber) : null);
        return next;
      });
    },
    [actx, publishVoices, centsFor, soundingFrequency]
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
            remaining ? soundingFrequency(remaining.noteNumber) : null
          );
        } else if (next.size === 0) {
          setActiveNoteFreq(null);
        }

        return next;
      });
    },
    [actx, publishVoices, soundingFrequency]
  );

  const scheduleNote = useCallback(
    (frequency: number, startTime: number, duration: number) => {
      if (!actx) return;

      const osc = actx.createOscillator();
      const gain = actx.createGain();

      const t = Math.max(startTime, actx.currentTime);

      osc.type = waveTypeRef.current;
      osc.frequency.setValueAtTime(frequency, t);
      // Scheduled runs hand us a frequency, not a key; the nearest 12-TET
      // note tells us which switch on the tuning strip applies.
      osc.detune.setValueAtTime(centsFor(midiFromFrequency(frequency)), t);

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
    [actx, centsFor]
  );

  const updateWaveType = useCallback((newWaveType: OscillatorType) => {
    waveTypeRef.current = newWaveType;
    setWaveType(newWaveType);
    voicesRef.current.forEach(({ oscillator }) => {
      oscillator.type = newWaveType;
    });
  }, []);

  /*
   * Flipping a switch on the strip retunes held notes too — a player holding
   * an E while pressing the E switch hears it bend, as on the hardware.
   */
  const setDetuneCents = useCallback(
    (map: DetuneMap) => {
      detuneRef.current = map;
      setDetuneState(map);
      if (!actx) return;
      const now = actx.currentTime;
      voicesRef.current.forEach(({ oscillator, noteNumber }) => {
        oscillator.detune.setTargetAtTime(map[pitchClass(noteNumber)] ?? 0, now, 0.02);
      });
      if (voicesRef.current.size === 1) {
        const [only] = voicesRef.current.values();
        setActiveNoteFreq(soundingFrequency(only.noteNumber));
      }
    },
    [actx, soundingFrequency],
  );

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
    detuneCents,
    setDetuneCents,
    handleNoteStart,
    stopNote,
    scheduleNote,
    initializeAudio,
  };
}
