import { useState } from "react";
import { useAudioSynthesis } from "../hooks/useAudioSynthesis";
import { useScaleLogic } from "../hooks/useScaleLogic";
import { createSynthKeys } from "../utils/synthUtils";
import AudioPermissionOverlay from "./AudioPermissionOverlay";
import SynthKeys from "./SynthKeys";
import { TopToolbar, BottomToolbar } from "./SynthControls";

interface SynthKeyboardProps {
  actx: AudioContext;
  hasAudioPermission: boolean;
  onAudioPermissionGranted: () => void;
}

export default function SynthKeyboard({
  actx,
  hasAudioPermission,
  onAudioPermissionGranted,
}: SynthKeyboardProps) {
  const [startOctave, setStartOctave] = useState<number>(4);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const keys = createSynthKeys(startOctave);

  const scaleLogic = useScaleLogic();
  const audioSynthesis = useAudioSynthesis(
    actx,
    onAudioPermissionGranted,
    keys
  );

  const toggleFullScreen = () => {
    setIsFullScreen((prevState) => !prevState);
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 10);
  };

  return (
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
        overflow: "hidden",
        display: isFullScreen ? "flex" : "block",
        flexDirection: isFullScreen ? "column" : "initial",
        justifyContent: isFullScreen ? "center" : "initial",
        alignItems: isFullScreen ? "center" : "initial",
        height: isFullScreen ? "100vh" : "auto",
        borderRadius: "0.5rem",
      }}
    >
      {!hasAudioPermission && (
        <AudioPermissionOverlay
          onInitializeAudio={audioSynthesis.initializeAudio}
        />
      )}

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
      />

      <BottomToolbar
        startOctave={startOctave}
        setStartOctave={setStartOctave}
        isFullScreen={isFullScreen}
        toggleFullScreen={toggleFullScreen}
      />
    </div>
  );
}
