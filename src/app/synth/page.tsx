"use client";

import { SynthKeyboard } from "../../instruments";
import { useSharedAudioContext } from "../../hooks/useSharedAudioContext";
import SelectiveOrientationGuard from "@/components/wrappers/SelectiveOrientationGuard";

// TODO: Key Detector feature is temporarily hidden due to accuracy issues.
// The feature can be re-enabled by:
// 1. Uncommenting the Key Detector entry in src/lib/navigation.ts
// 2. Restoring the tab navigation logic (preserved in git history)
// 3. Re-adding the PitchDetector component rendering

export default function SynthPage() {
  const sharedAudio = useSharedAudioContext();

  return (
    <main className="min-h-[calc(100vh-60px)] bg-[rgb(10,58,79)]">
      <SelectiveOrientationGuard
        requiredOrientation="landscape"
        title="Please Rotate Your Device"
        message="This synth works best in landscape mode"
        icon="🎹"
      >
        <SynthKeyboard
          audioContext={sharedAudio.audioContext}
          hasAudioPermission={sharedAudio.hasAudioPermission}
          initializeAudio={sharedAudio.initializeAudio}
        />
      </SelectiveOrientationGuard>
    </main>
  );
}
