// Main Instruments Export
// This file provides easy access to all available instrument families

// Synth Instrument Family
export * from "./synth";

// Future instrument families will be exported here:
// export * from './drums';

// Instrument Family Registry (for dynamic loading in the future)
export const INSTRUMENT_FAMILIES = {
  synth: "Synthesizers",
  // drums: 'Drum Machines',
} as const;

export type InstrumentFamily = keyof typeof INSTRUMENT_FAMILIES;

// Quick access to most commonly used components
export { SynthKeyboard } from "./synth/templates/basic-synth";
