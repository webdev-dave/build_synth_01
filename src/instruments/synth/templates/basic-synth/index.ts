// Basic Synth Template
// This template provides the foundation for all keyboard-based synthesizers

// Main Synth Component
export { default as SynthKeyboard } from "./components/SynthKeyboard";

// Synth Sub-components
export { default as SynthKeys } from "./components/SynthKeys";
export {
  TopToolbar as SynthTopToolbar,
  BottomToolbar as SynthBottomToolbar,
} from "./components/SynthControls";
export { default as AudioPermissionOverlay } from "./components/AudioPermissionOverlay";
export { default as MusicTheoryPanel } from "./components/MusicTheoryPanel";
export { default as ScaleTheoryPanel } from "./components/ScaleTheoryPanel";
export { default as ChordTheoryPanel } from "./components/ChordTheoryPanel";
export { default as SoundEngineeringPanel } from "./components/SoundEngineeringPanel";
export { default as WaveExplanationPanel } from "./components/WaveExplanationPanel";

// Synth Hooks
export { useAudioSynthesis } from "./hooks/useAudioSynthesis";
export { useScaleLogic } from "./hooks/useScaleLogic";

// Synth Utilities
export * from "./utils/synthUtils";

// Synth Types (re-export from hooks for convenience)
export type { OscillatorType } from "./hooks/useAudioSynthesis";
export type { ScaleCombination } from "./hooks/useScaleLogic";
