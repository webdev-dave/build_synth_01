import { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
import useIsMobile from "@/hooks/useIsMobile";

// Add this type declaration for Safari's webkitAudioContext
interface WindowWithWebkit extends Window {
  webkitAudioContext: typeof AudioContext;
}

export default function SynthKeyboard() {
  const [startOctave, setStartOctave] = useState<number>(4);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [actx, setActx] = useState<AudioContext | null>(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(false);
  const isMobile = useIsMobile();
  const [kbEnabled, setKbEnabled] = useState<boolean>(() => !isMobile);
  const [showKbLabels, setShowKbLabels] = useState(false);

  // Which of the visible octaves the computer keyboard controls (0-indexed)
  const [kbOctaveOffset, setKbOctaveOffset] = useState<number>(0);

  // Default number of visible octaves is 2 for all devices
  const defaultVisibleOctaves = 2;

  const [visibleOctaves, setVisibleOctaves] = useState<number>(
    defaultVisibleOctaves
  );

  // Reference to the synth wrapper so we can measure its width
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Minimum width per white key in pixels required for comfortable playing
  const MIN_WHITE_KEY_WIDTH = 50;

  // Compute the maximum number of octaves that can fit based on current wrapper width
  const computeMaxOctaves = useCallback((widthPx: number) => {
    if (!widthPx || widthPx <= 0) return 2; // fallback ensures min 2
    const maxByWidth = Math.floor(widthPx / (7 * MIN_WHITE_KEY_WIDTH));
    // Ensure at least 2 octaves are always possible (may overflow horizontally on very small screens)
    return Math.max(2, Math.min(5, maxByWidth));
  }, []);

  const [maxVisibleOctaves, setMaxVisibleOctaves] = useState<number>(() => {
    const initialWidth =
      typeof window !== "undefined" ? window.innerWidth : 1024;
    return Math.max(2, computeMaxOctaves(initialWidth));
  });

  // Measure wrapper width on mount and when the window resizes
  useEffect(() => {
    const measure = () => {
      const width = wrapperRef.current?.offsetWidth || 0;
      setMaxVisibleOctaves(computeMaxOctaves(width));
    };

    measure(); // initial
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [computeMaxOctaves]);

  // Ensure currently selected octave count never exceeds the allowed maximum
  useEffect(() => {
    if (visibleOctaves > maxVisibleOctaves) {
      setVisibleOctaves(maxVisibleOctaves);
    }
    // Clamp keyboard octave offset if needed
    setKbOctaveOffset((prev) => Math.min(prev, visibleOctaves - 1));
  }, [maxVisibleOctaves, visibleOctaves]);

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

  // Ensure keyboard input stays disabled on mobile devices
  useEffect(() => {
    if (isMobile) {
      setKbEnabled(false);
      setShowKbLabels(false);
    }
  }, [isMobile]);

  const keys = createSynthKeys(startOctave, visibleOctaves);

  // Slice keys array to the octave controlled by the computer keyboard
  const kbBaseIndex = kbOctaveOffset * 12;
  const keysForKb = keys.slice(kbBaseIndex);

  const scaleLogic = useScaleLogic();
  const audioSynthesis = useAudioSynthesis(
    actx,
    () => setHasAudioPermission(true), // Handle audio permission internally
    keys
  );

  // Enable physical keyboard interaction when toggled
  useComputerKeyboard(
    kbEnabled,
    keysForKb,
    audioSynthesis.handleNoteStart,
    audioSynthesis.stopNote,
    (delta: number) =>
      setStartOctave((prev) => Math.min(7, Math.max(0, prev + delta)))
  );

  // Keyboard shortcuts to change kbOctaveOffset using < and > keys (Comma/Period codes)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!kbEnabled) return;
      if (e.code === "Comma") {
        setKbOctaveOffset((prev) => Math.max(0, prev - 1));
      } else if (e.code === "Period") {
        setKbOctaveOffset((prev) => Math.min(visibleOctaves - 1, prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [kbEnabled, visibleOctaves]);

  const noteToKeyCharMap = useMemo(
    () => buildNoteToCharMap(keysForKb),
    [keysForKb]
  );

  // Helper to toggle label visibility and ensure keyboard input is enabled when turning on
  const handleToggleShowLabels = () => {
    setShowKbLabels((prev) => {
      const next = !prev;
      if (!isMobile && next && !kbEnabled) {
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
          ref={wrapperRef}
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
            isMobile={isMobile}
            toggleKbEnabled={() => setKbEnabled((prev) => !prev)}
            showKbLabels={showKbLabels}
            toggleShowKbLabels={handleToggleShowLabels}
            visibleOctaves={visibleOctaves}
            setVisibleOctaves={setVisibleOctaves}
            maxVisibleOctaves={maxVisibleOctaves}
            kbOctaveOffset={kbOctaveOffset}
            setKbOctaveOffset={setKbOctaveOffset}
          />

          <div className="mt-16">
            <SoundEngineeringPanel waveType={audioSynthesis.waveType} />
          </div>
        </div>
      </PreventDefaultTouchWrapper>
    </OrientationGuard>
  );
}
