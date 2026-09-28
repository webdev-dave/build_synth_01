// Main Instruments Export
// This file provides easy access to all available instrument families

// Synth Instrument Family
export * from "./synth";

// Drum machine family (kit voices live in src/lib/audio/voices/drums.ts)
export { DrumMachine } from "./drums/templates/basic-drums/DrumMachine";
export { useDrumKit } from "./drums/templates/basic-drums/hooks/useDrumKit";
export { StepGrid } from "./drums/templates/basic-drums/components/StepGrid";

// Instrument Family Registry (for dynamic loading in the future)
export const INSTRUMENT_FAMILIES = {
  synth: "Synthesizers",
  drums: "Drum Machines",
} as const;

export type InstrumentFamily = keyof typeof INSTRUMENT_FAMILIES;

// Quick access to most commonly used components
export { SynthKeyboard } from "./synth/templates/basic-synth";
