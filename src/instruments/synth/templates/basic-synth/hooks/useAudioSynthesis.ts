import { useState, useCallback } from "react";
import { noteNumberToFrequency } from "../utils/synthUtils";
import type { SynthKey } from "../utils/synthUtils";

export type OscillatorType = "sine" | "square" | "sawtooth" | "triangle";

interface UseAudioSynthesisReturn {
  activeOscillators: Map<
    string,
    { oscillator: OscillatorNode; gain: GainNode }
  >;
  activeKeys: Set<string>;
  activeNoteFreq: number | null;
  waveType: OscillatorType;
  setWaveType: (type: OscillatorType) => void;
  handleNoteStart: (noteNumber: number, note: string) => Promise<void>;
  stopNote: (note: string) => void;
  initializeAudio: () => Promise<void>;
}

export function useAudioSynthesis(
  actx: AudioContext | null,
  onAudioPermissionGranted: () => void,
  keys: SynthKey[]
): UseAudioSynthesisReturn {
  const [waveType, setWaveType] = useState<OscillatorType>("sine");
  const [activeNoteFreq, setActiveNoteFreq] = useState<number | null>(null);
  const [activeOscillators, setActiveOscillators] = useState<
    Map<string, { oscillator: OscillatorNode; gain: GainNode }>
  >(new Map());
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  const initializeAudio = useCallback(async () => {
    if (!actx) return;
    await actx.resume();
    onAudioPermissionGranted();
  }, [actx, onAudioPermissionGranted]);

  const handleNoteStart = useCallback(
    async (noteNumber: number, note: string) => {
      if (!actx || activeOscillators.has(note)) return;

      const frequency = noteNumberToFrequency(noteNumber);
      const osc = actx.createOscillator();
      const gain = actx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(frequency, actx.currentTime);
      gain.gain.setValueAtTime(0.1, actx.currentTime);

      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();

      setActiveOscillators((prev) => {
        const newMap = new Map(prev);
        newMap.set(note, { oscillator: osc, gain });
        return newMap;
      });

      setActiveKeys((prev) => {
        const newSet = new Set(prev);
        newSet.add(note);

        if (newSet.size === 1) {
          setActiveNoteFreq(frequency);
        } else {
          setActiveNoteFreq(null);
        }

        return newSet;
      });
    },
    [actx, waveType, activeOscillators]
  );

  const stopNote = useCallback(
    (note: string) => {
      if (!actx) return;
      const noteData = activeOscillators.get(note);
      if (noteData) {
        const { oscillator, gain } = noteData;

        gain.gain.linearRampToValueAtTime(0, actx.currentTime + 0.1);

        setTimeout(() => {
          oscillator.stop();
          setActiveOscillators((prev) => {
            const newMap = new Map(prev);
            newMap.delete(note);
            return newMap;
          });
        }, 100);

        setActiveKeys((prev) => {
          const newSet = new Set(prev);
          newSet.delete(note);

          if (newSet.size === 1) {
            const remainingNote = Array.from(newSet)[0];
            const remainingNoteData = keys.find(
              (k) => k.note === remainingNote
            );
            if (remainingNoteData) {
              setActiveNoteFreq(
                noteNumberToFrequency(remainingNoteData.noteNumber)
              );
            }
          } else if (newSet.size === 0) {
            setActiveNoteFreq(null);
          }

          return newSet;
        });
      }
    },
    [activeOscillators, actx, keys]
  );

  const updateWaveType = useCallback(
    (newWaveType: OscillatorType) => {
      setWaveType(newWaveType);
      activeOscillators.forEach(({ oscillator }) => {
        oscillator.type = newWaveType;
      });
    },
    [activeOscillators]
  );

  return {
    activeOscillators,
    activeKeys,
    activeNoteFreq,
    waveType,
    setWaveType: updateWaveType,
    handleNoteStart,
    stopNote,
    initializeAudio,
  };
}
