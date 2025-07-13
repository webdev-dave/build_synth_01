"use client";
import { useState, useCallback, useEffect } from "react";
import { SynthKeyboard } from "../instruments";
import TabNavigation, { TabType } from "../components/TabNavigation";
import PitchDetector from "../components/PitchDetector";
import { useSharedAudioContext } from "../hooks/useSharedAudioContext";
import SelectiveOrientationGuard from "@/components/wrappers/SelectiveOrientationGuard";

/**
 * Hash Routing Configuration
 *
 * Supported URLs:
 * - #synth, #play, #piano -> Play Synth tab
 * - #key-detector, #pitch-detector -> Key Detector tab
 * - No hash or unknown hash -> Defaults to Play Synth tab
 *
 * Users can share direct links like:
 * - https://yoursite.com/#key-detector (opens directly to pitch detection)
 * - https://yoursite.com/#synth (opens directly to synth)
 */

// Helper function to get tab from hash
function getTabFromHash(): TabType {
  const hash = window.location.hash.replace("#", "");
  switch (hash) {
    case "key-detector":
    case "pitch-detector":
      return "pitch-detector";
    case "synth":
    case "play":
    case "piano":
      return "synth";
    default:
      return "synth";
  }
}

// Helper function to update hash from tab
function updateHashFromTab(tab: TabType) {
  const hashMap: Record<TabType, string> = {
    synth: "synth",
    "pitch-detector": "key-detector",
  };
  window.location.hash = hashMap[tab];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("synth");
  const sharedAudio = useSharedAudioContext();

  // Initialize tab from hash on mount
  useEffect(() => {
    const initialTab = getTabFromHash();
    setActiveTab(initialTab);
  }, []);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const newTab = getTabFromHash();
      setActiveTab(newTab);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Update hash when tab changes (but only if it's different from current hash)
  useEffect(() => {
    const currentHashTab = getTabFromHash();
    if (currentHashTab !== activeTab) {
      updateHashFromTab(activeTab);
    }
  }, [activeTab]);

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

  // Handle tab change and update hash
  const handleTabChange = useCallback((newTab: TabType) => {
    setActiveTab(newTab);
    // Hash will be updated automatically by useEffect
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "synth":
        return (
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
          onTabChange={handleTabChange}
          onTabCleanup={handleTabCleanup}
        />

        <div className="bg-synth-bg p-6 rounded-md border-2 mb-4">
          <div className="min-h-[90vh]">{renderActiveTab()}</div>
        </div>
      </div>
    </main>
  );
}
