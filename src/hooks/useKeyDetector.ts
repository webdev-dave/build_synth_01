import { useEffect, useRef, useState } from "react";
import { KeyDetector } from "@/lib/keyDetection";
import type { BasicPitchNote } from "./usePitchProcessor";

interface KeyState {
  name: string;
  confidence: number;
}

export function useKeyDetector(
  latestNotes: BasicPitchNote[] | null,
  latestPitchMidi: number | null,
  isActive: boolean,
  detectionMode: "standard" | "highAccuracy"
): KeyState {
  const detectorRef = useRef<KeyDetector | null>(null);
  const [keyState, setKeyState] = useState<KeyState>({
    name: "–",
    confidence: 0,
  });

  // Lazily create KeyDetector
  if (!detectorRef.current) {
    detectorRef.current = new KeyDetector();
  }

  // Reset histogram when analysis stops but keep the last detected key on screen
  useEffect(() => {
    if (!isActive) {
      // Clear internal histogram so the next session starts fresh
      detectorRef.current?.reset();
      // Do NOT reset keyState here – we want to keep showing the last result
    }
  }, [isActive]);

  // Clear key display when analysis starts to avoid showing stale results
  useEffect(() => {
    if (isActive) {
      setKeyState({ name: "–", confidence: 0 });
    }
  }, [isActive]);

  // Update decay factor when mode changes
  useEffect(() => {
    if (detectorRef.current) {
      detectorRef.current.setDecayFactor(
        detectionMode === "highAccuracy" ? 1 : 0.97
      );
    }
  }, [detectionMode]);

  // Feed latestNotes when they update
  useEffect(() => {
    if (isActive && latestPitchMidi !== null) {
      detectorRef.current?.addPitchMidi(latestPitchMidi);
      const est = detectorRef.current?.getCurrentKey();
      if (est) setKeyState({ name: est.name, confidence: est.confidence });
    }
  }, [latestPitchMidi, isActive]);

  useEffect(() => {
    if (!isActive || !latestNotes || latestNotes.length === 0) return;
    detectorRef.current?.addNotes(latestNotes);
    const est = detectorRef.current?.getCurrentKey();
    if (est) {
      setKeyState({ name: est.name, confidence: est.confidence });
    }
  }, [latestNotes, isActive]);

  return keyState;
}
