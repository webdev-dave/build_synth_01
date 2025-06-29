import { useState, useEffect, useMemo } from "react";
import { useAudioSynthesis } from "../hooks/useAudioSynthesis";
import { useScaleLogic } from "../hooks/useScaleLogic";
import { createSynthKeys } from "../utils/synthUtils";
import AudioPermissionOverlay from "./AudioPermissionOverlay";
import SynthKeys from "./SynthKeys";
import { TopToolbar, BottomToolbar } from "./SynthControls";
import MusicTheoryPanel from "./MusicTheoryPanel";
import SoundEngineeringPanel from "./SoundEngineeringPanel";
import OrientationGuard from "@/components/wrappers/OrientationGuard";
import PreventDefaultTouchWrapper from "@/components/wrappers/PreventDefaultTouchWrapper";
import {
  useComputerKeyboard,
  buildNoteToCharMap,
} from "../hooks/useComputerKeyboard";

// Add this type declaration for Safari's webkitAudioContext
interface WindowWithWebkit extends Window {
  webkitAudioContext: typeof AudioContext;
}

export default function SynthKeyboard() {
  const [startOctave, setStartOctave] = useState<number>(4);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [actx, setActx] = useState<AudioContext | null>(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(false);
  const [kbEnabled, setKbEnabled] = useState(true);
  const [showKbLabels, setShowKbLabels] = useState(false);

  // Disable body scroll & padding while in full-screen mode
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPadding = document.body.style.padding;

    if (isFullScreen) {
      document.body.style.overflow = "hidden";
      document.body.style.padding = "0";
    } else {
      document.body.style.overflow = originalOverflow;
      document.body.style.padding = originalPadding;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.padding = originalPadding;
    };
  }, [isFullScreen]);

  // Initialize AudioContext when component mounts
  useEffect(() => {
    let mounted = true;
    let audioContext: AudioContext | null = null;

    try {
      // Properly typed AudioContext for both standard and webkit
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as WindowWithWebkit).webkitAudioContext;

      if (AudioContextClass && mounted) {
        audioContext = new AudioContextClass();
        audioContext.suspend(); // Start in suspended state
        setActx(audioContext);
      }
    } catch (error) {
      console.error("Error initializing AudioContext:", error);
    }

    return () => {
      mounted = false;
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  const keys = createSynthKeys(startOctave);

  const scaleLogic = useScaleLogic();
  const audioSynthesis = useAudioSynthesis(
    actx,
    () => setHasAudioPermission(true), // Handle audio permission internally
    keys
  );

  // Enable physical keyboard interaction when toggled
  useComputerKeyboard(
    kbEnabled,
    keys,
    audioSynthesis.handleNoteStart,
    audioSynthesis.stopNote,
    (delta: number) =>
      setStartOctave((prev) => Math.min(7, Math.max(0, prev + delta)))
  );

  const noteToKeyCharMap = useMemo(() => buildNoteToCharMap(keys), [keys]);

  // Helper to toggle label visibility and ensure keyboard input is enabled when turning on
  const handleToggleShowLabels = () => {
    setShowKbLabels((prev) => {
      const next = !prev;
      if (next && !kbEnabled) {
        setKbEnabled(true);
      }
      return next;
    });
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prevState) => !prevState);
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 10);
  };

  // Show loading state while AudioContext is initializing
  if (!actx) {
    return (
      <OrientationGuard
        requiredOrientation="landscape"
        title="Please Rotate Your Device"
        message="This synth works best in landscape mode"
        icon="🎹"
      >
        <div className="bg-synth-bg p-6 rounded-md border-2 text-center">
          <div>Initializing Audio Context...</div>
        </div>
      </OrientationGuard>
    );
  }

  return (
    <OrientationGuard
      requiredOrientation="landscape"
      title="Please Rotate Your Device"
      message="This synth works best in landscape mode"
      icon="🎹"
    >
      <PreventDefaultTouchWrapper allowScroll={true}>
        <div
          className={`synth-wrapper ${isFullScreen ? "fullscreen-synth" : ""}`}
          style={{
            width: isFullScreen ? "100vw" : "100%",
            maxWidth: isFullScreen ? "100%" : "100%",
            position: isFullScreen ? "fixed" : "relative",
            left: isFullScreen ? "0" : "auto",
            top: isFullScreen ? "0" : "auto",
            right: isFullScreen ? "0" : "auto",
            bottom: isFullScreen ? "0" : "auto",
            zIndex: isFullScreen ? 50 : "auto",
            padding: isFullScreen ? "0" : "1rem",
            margin: isFullScreen ? "0" : "auto",
            backgroundColor: isFullScreen
              ? "var(--bg-color, #1e3a5f)"
              : "rgb(10, 58, 79)",
            transition: "background-color 0.3s ease, height 0.3s ease",
            overflowX: "hidden",
            overflowY: isFullScreen ? "auto" : "hidden",
            display: isFullScreen ? "flex" : "block",
            flexDirection: isFullScreen ? "column" : "initial",
            justifyContent: isFullScreen ? "flex-start" : "initial",
            alignItems: isFullScreen ? "stretch" : "initial",
            height: isFullScreen ? "100vh" : "auto",
            borderRadius: "0.5rem",
          }}
        >
          {!hasAudioPermission && (
            <AudioPermissionOverlay
              onInitializeAudio={audioSynthesis.initializeAudio}
            />
          )}
          <div className="mb-4">
            <MusicTheoryPanel
              selectedScale={scaleLogic.selectedScale}
              activeKeys={audioSynthesis.activeKeys}
              identifyChord={scaleLogic.identifyChord}
            />
          </div>

          <TopToolbar
            activeKeys={audioSynthesis.activeKeys}
            activeNoteFreq={audioSynthesis.activeNoteFreq}
            identifyChord={scaleLogic.identifyChord}
            selectedScale={scaleLogic.selectedScale}
            setSelectedScale={scaleLogic.setSelectedScale}
            allowOutOfScale={scaleLogic.allowOutOfScale}
            setAllowOutOfScale={scaleLogic.setAllowOutOfScale}
            waveType={audioSynthesis.waveType}
            setWaveType={audioSynthesis.setWaveType}
          />

          <SynthKeys
            keys={keys}
            activeKeys={audioSynthesis.activeKeys}
            isNoteInScale={scaleLogic.isNoteInScale}
            allowOutOfScale={scaleLogic.allowOutOfScale}
            selectedScale={scaleLogic.selectedScale}
            onNoteStart={audioSynthesis.handleNoteStart}
            onNoteStop={audioSynthesis.stopNote}
            isFullScreen={isFullScreen}
            showKbLabels={showKbLabels}
            noteToKeyCharMap={noteToKeyCharMap}
          />

          <BottomToolbar
            startOctave={startOctave}
            setStartOctave={setStartOctave}
            isFullScreen={isFullScreen}
            toggleFullScreen={toggleFullScreen}
            kbEnabled={kbEnabled}
            toggleKbEnabled={() => setKbEnabled((prev) => !prev)}
            showKbLabels={showKbLabels}
            toggleShowKbLabels={handleToggleShowLabels}
          />

          <div className="mt-16">
            <SoundEngineeringPanel waveType={audioSynthesis.waveType} />
          </div>
        </div>
      </PreventDefaultTouchWrapper>
    </OrientationGuard>
  );
}
