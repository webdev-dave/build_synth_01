# Instruments Architecture - Template-Based DAW

This directory contains all instrument modules for the DAW application. Each instrument type is organized with **primitive templates** that can be extended into multiple **instrument variants**.

## 🏗️ Architecture Overview

```
src/instruments/
├── synth/                    # Synthesizer instrument family
│   ├── templates/           # Primitive synth templates
│   │   ├── basic-synth/     # Basic keyboard synth (current)
│   │   ├── bass-synth/      # Bass-focused template (planned)
│   │   └── lead-synth/      # Lead-focused template (planned)
│   └── variants/            # Specific synth instruments
│       ├── piano/           # Piano variant (planned)
│       ├── organ/           # Organ variant (planned)
│       ├── strings/         # String section variant (planned)
│       └── pad/             # Pad synth variant (planned)
├── drums/                   # Drum machine family
│   ├── templates/           # Primitive drum templates
│   │   ├── basic-drums/     # Basic drum machine (planned)
│   │   └── sampler/         # Sample-based drums (planned)
│   └── variants/            # Specific drum machines
│       ├── acoustic-kit/    # Acoustic drum kit (planned)
│       ├── electronic-kit/  # Electronic drum kit (planned)
│       └── percussion/      # Percussion instruments (planned)
└── README.md               # This file
```

## 🎯 Template vs Variant Concept

### 🧬 **Templates** (Primitive Building Blocks)

- **Purpose**: Core functionality and architecture
- **Reusability**: Base for multiple instrument variants
- **Scope**: Broad, foundational features
- **Examples**: Basic synth engine, drum sampler engine

### 🎨 **Variants** (Specific Instruments)

- **Purpose**: Specialized instruments for specific sounds
- **Customization**: Tailored presets, UI, and behavior
- **Scope**: Focused on specific musical roles
- **Examples**: Piano, organ, acoustic drums, electronic drums

## 📁 Template Structure

Each template follows this structure:

```
template-name/
├── components/          # React components for the template
├── hooks/              # Custom hooks for template logic
├── utils/              # Utility functions and calculations
├── types/              # TypeScript type definitions
├── constants/          # Template-specific constants
├── presets/            # Default presets and configurations
└── index.ts            # Template export file
```

## 📁 Variant Structure

Each variant extends a template:

```
variant-name/
├── config/             # Variant-specific configuration
├── presets/            # Variant presets and sounds
├── components/         # Variant-specific UI components (optional)
├── assets/             # Samples, images, etc. (optional)
└── index.ts            # Variant export file
```

## 🎹 Basic Synth Template (Implemented)

The basic synth template provides the foundation for all keyboard-based synthesizers:

### Core Features

- **Keyboard Interface**: Piano-style key layout
- **Audio Synthesis**: Oscillator-based sound generation
- **Scale Logic**: Musical scale and chord detection
- **Real-time Controls**: Wave type, scale selection, octave navigation
- **Audio Permission**: Web Audio API permission handling

### Components

- `SynthKeyboard.tsx` - Main synthesizer component
- `SynthKeys.tsx` - Key rendering and interaction
- `SynthControls.tsx` - Top and bottom toolbars
- `AudioPermissionOverlay.tsx` - Audio permission handling

### Hooks

- `useAudioSynthesis.ts` - Audio synthesis and playback logic
- `useScaleLogic.ts` - Musical scale and chord logic

### Utils

- `synthUtils.ts` - Synthesizer calculations and utilities

## 🚀 Future Templates (Planned)

### Bass Synth Template

- **Focus**: Low-frequency optimization
- **Features**: Sub-bass generation, bass-specific scales
- **UI**: Bass-focused interface with fewer octaves

### Lead Synth Template

- **Focus**: Lead lines and solos
- **Features**: Advanced modulation, filter sweeps
- **UI**: Performance-oriented controls

### Basic Drums Template

- **Focus**: Rhythm and percussion
- **Features**: Sample playback, pattern sequencing
- **UI**: Drum pad interface

### Sampler Template

- **Focus**: Custom sample playback
- **Features**: Multi-sampling, loop points
- **UI**: Sample management interface

## 🎨 Planned Variants

### Synth Variants (Based on Basic Synth Template)

- **Piano**: Acoustic piano simulation with velocity layers
- **Organ**: Hammond-style organ with drawbars
- **Strings**: String section with ensemble effects
- **Pad**: Atmospheric pad sounds with long releases

### Drum Variants (Based on Basic Drums Template)

- **Acoustic Kit**: Realistic drum samples
- **Electronic Kit**: 808/909-style electronic drums
- **Percussion**: World percussion instruments

## 🔧 Creating New Templates

1. **Create the template structure:**

   ```bash
   mkdir src/instruments/[type]/templates/[template-name]
   mkdir src/instruments/[type]/templates/[template-name]/components
   mkdir src/instruments/[type]/templates/[template-name]/hooks
   mkdir src/instruments/[type]/templates/[template-name]/utils
   ```

2. **Implement core functionality:**

   ```typescript
   // src/instruments/[type]/templates/[template-name]/components/MainComponent.tsx
   export default function MainComponent() {
     // Template implementation
   }
   ```

3. **Create template index:**
   ```typescript
   // src/instruments/[type]/templates/[template-name]/index.ts
   export { default as MainComponent } from "./components/MainComponent";
   // Export hooks, utils, types
   ```

## 🎭 Creating New Variants

1. **Create variant structure:**

   ```bash
   mkdir src/instruments/[type]/variants/[variant-name]
   ```

2. **Create variant configuration:**

   ```typescript
   // src/instruments/[type]/variants/[variant-name]/config.ts
   export const VARIANT_CONFIG = {
     name: 'Variant Name',
     template: 'basic-synth',
     presets: [...],
     defaultSettings: {...}
   };
   ```

3. **Create variant index:**

   ```typescript
   // src/instruments/[type]/variants/[variant-name]/index.ts
   import { BasicSynth } from "../../templates/basic-synth";
   import { VARIANT_CONFIG } from "./config";

   export const VariantName = (props) => (
     <BasicSynth
       {...props}
       config={VARIANT_CONFIG}
     />
   );
   ```

## 🎯 Benefits of Template-Based Architecture

### 🔄 **Code Reuse**

- Templates provide common functionality
- Variants focus only on customization
- Reduced duplication across similar instruments

### 🎨 **Specialization**

- Each variant optimized for specific use cases
- Tailored presets and UI for different sounds
- Clear separation between engine and instrument

### 📈 **Scalability**

- Easy to add new variants from existing templates
- Templates can evolve independently
- Clear upgrade path for instruments

### 🧪 **Experimentation**

- Quick prototyping of new instrument ideas
- A/B testing different configurations
- Easy to create experimental variants

## 🚀 DAW Integration Strategy

### Channel System

```typescript
interface Channel {
  id: string;
  instrumentType: "synth" | "drums";
  template: string;
  variant: string;
  settings: InstrumentSettings;
}
```

### Dynamic Loading

```typescript
const loadInstrument = async (channel: Channel) => {
  const template = await import(
    `./instruments/${channel.instrumentType}/templates/${channel.template}`
  );
  const variant = await import(
    `./instruments/${channel.instrumentType}/variants/${channel.variant}`
  );
  return variant.createInstrument(template, channel.settings);
};
```

This architecture provides maximum flexibility for building a comprehensive DAW with specialized instruments while maintaining clean, reusable code!
