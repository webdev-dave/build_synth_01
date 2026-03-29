"use client";

import { SynthKeyboard } from "../instruments";
import { useSharedAudioContext } from "../hooks/useSharedAudioContext";
import SelectiveOrientationGuard from "@/components/wrappers/SelectiveOrientationGuard";

// TODO: Key Detector feature is temporarily hidden due to accuracy issues.
// The feature can be re-enabled by:
// 1. Uncommenting the Key Detector entry in src/lib/navigation.ts
// 2. Restoring the tab navigation logic below
// 3. Re-adding the PitchDetector component rendering
//
// Original implementation preserved in git history and can be restored
// when the key detection accuracy is improved.

export default function Home() {
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

/*
 * ============================================================================
 * ARCHIVED: Key Detector Tab Navigation Logic
 * ============================================================================
 * The following code has been commented out but preserved for future use.
 * Re-enable when key detection accuracy is improved.
 * ============================================================================
 *
 * import { useState, useCallback, useEffect } from "react";
 * import TabNavigation, { TabType } from "../components/TabNavigation";
 * import PitchDetector from "../components/PitchDetector";
 *
 * // Hash Routing Configuration
 * // Supported URLs:
 * // - #synth, #play, #piano -> Play Synth tab
 * // - #key-detector, #pitch-detector -> Key Detector tab
 * // - No hash or unknown hash -> Defaults to Play Synth tab
 *
 * function getTabFromHash(): TabType {
 *   const hash = window.location.hash.replace("#", "");
 *   switch (hash) {
 *     case "key-detector":
 *     case "pitch-detector":
 *       return "pitch-detector";
 *     case "synth":
 *     case "play":
 *     case "piano":
 *       return "synth";
 *     default:
 *       return "synth";
 *   }
 * }
 *
 * function updateHashFromTab(tab: TabType) {
 *   const hashMap: Record<TabType, string> = {
 *     synth: "synth",
 *     "pitch-detector": "key-detector",
 *   };
 *   window.location.hash = hashMap[tab];
 * }
 *
 * // In Home component:
 * const [activeTab, setActiveTab] = useState<TabType>("synth");
 *
 * useEffect(() => {
 *   const initialTab = getTabFromHash();
 *   setActiveTab(initialTab);
 * }, []);
 *
 * useEffect(() => {
 *   const handleHashChange = () => {
 *     const newTab = getTabFromHash();
 *     setActiveTab(newTab);
 *   };
 *   window.addEventListener("hashchange", handleHashChange);
 *   return () => window.removeEventListener("hashchange", handleHashChange);
 * }, []);
 *
 * useEffect(() => {
 *   const currentHashTab = getTabFromHash();
 *   if (currentHashTab !== activeTab) {
 *     updateHashFromTab(activeTab);
 *   }
 * }, [activeTab]);
 *
 * const handleTabCleanup = useCallback((previousTab: TabType) => {
 *   if (previousTab === "synth") {
 *     console.log("Cleaning up synth tab");
 *   } else if (previousTab === "pitch-detector") {
 *     console.log("Cleaning up pitch detector tab");
 *   }
 * }, []);
 *
 * const handleTabChange = useCallback((newTab: TabType) => {
 *   setActiveTab(newTab);
 * }, []);
 *
 * // In JSX:
 * <TabNavigation
 *   activeTab={activeTab}
 *   onTabChange={handleTabChange}
 *   onTabCleanup={handleTabCleanup}
 * />
 *
 * // Render based on activeTab:
 * {activeTab === "pitch-detector" ? <PitchDetector /> : <SynthKeyboard ... />}
 *
 * ============================================================================
 */
