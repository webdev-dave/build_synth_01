"use client";
import { useState, useCallback } from "react";
import { SynthKeyboard } from "../instruments";
import TabNavigation, { TabType } from "../components/TabNavigation";
import PitchDetector from "../components/PitchDetector";
import { useSharedAudioContext } from "../hooks/useSharedAudioContext";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("synth");
  const sharedAudio = useSharedAudioContext();

  // Handle cleanup when switching tabs
  const handleTabCleanup = useCallback((previousTab: TabType) => {
    if (previousTab === "synth") {
      // Stop all audio and clear state when leaving synth
      // The SynthKeyboard component will handle its own cleanup
      console.log("Cleaning up synth tab");
    } else if (previousTab === "pitch-detector") {
      // Stop microphone and clear pitch detection state
      console.log("Cleaning up pitch detector tab");
    }
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "synth":
        return (
          <SynthKeyboard
            audioContext={sharedAudio.audioContext}
            hasAudioPermission={sharedAudio.hasAudioPermission}
            initializeAudio={sharedAudio.initializeAudio}
          />
        );
      case "pitch-detector":
        return <PitchDetector />;
      default:
        return (
          <SynthKeyboard
            audioContext={sharedAudio.audioContext}
            hasAudioPermission={sharedAudio.hasAudioPermission}
            initializeAudio={sharedAudio.initializeAudio}
          />
        );
    }
  };

  return (
    <main>
      <div className="max-w-[1200px] mx-auto">
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onTabCleanup={handleTabCleanup}
        />

        <div className="bg-synth-bg p-6 rounded-md border-2 mb-4">
          <div className="min-h-[90vh]">{renderActiveTab()}</div>
        </div>
      </div>
    </main>
  );
}
