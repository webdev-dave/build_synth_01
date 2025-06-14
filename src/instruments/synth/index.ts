// Synth Instrument Family
// This module contains all synthesizer templates and variants

// Templates
export * from "./templates/basic-synth";

// Future templates will be exported here:
// export * from './templates/bass-synth';
// export * from './templates/lead-synth';

// Variants (when implemented)
// export * from './variants/piano';
// export * from './variants/organ';
// export * from './variants/strings';
// export * from './variants/pad';

// Template Registry
export const SYNTH_TEMPLATES = {
  "basic-synth": "Basic Synthesizer",
  // 'bass-synth': 'Bass Synthesizer',
  // 'lead-synth': 'Lead Synthesizer',
} as const;

// Variant Registry
export const SYNTH_VARIANTS = {
  // 'piano': 'Piano',
  // 'organ': 'Organ',
  // 'strings': 'Strings',
  // 'pad': 'Pad',
} as const;

export type SynthTemplate = keyof typeof SYNTH_TEMPLATES;
export type SynthVariant = keyof typeof SYNTH_VARIANTS;
