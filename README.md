# Build Synth 01

A modern web-based Digital Audio Workstation (DAW) built with Next.js and TypeScript, featuring a synthesizer and interactive music theory tools.

**Live Demo:** [synth-v01.netlify.app](https://synth-v01.netlify.app)

## Features

### Synthesizer
- Piano keyboard with octave controls
- Multiple waveform types (sine, square, sawtooth, triangle)
- Scale-aware key highlighting with visual feedback
- Real-time chord detection
- Note/frequency data display
- Responsive design optimized for landscape orientation

### Harmonica Lab
- Interactive position guide for diatonic blues harp (5 positions)
- Visual harmonica diagram with blow/draw notes and bends
- Scale degree indicators with Blues/Mixolydian toggle for 2nd position
- Piano theory visualization with scale highlighting
- Position calculation algorithm with full 12×5 reference matrix
- "I know the song key" vs "I have a harp" lookup modes

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Synth page
│   └── harmonica-lab/           # Harmonica Lab page
├── components/
│   ├── harmonica/               # Harmonica Lab components
│   │   ├── HarmonicaDiagram.tsx # Main diagram with notes/bends
│   │   ├── PianoTheory.tsx      # Piano visualization
│   │   ├── PositionCard.tsx     # Position selection cards
│   │   ├── PositionMatrix.tsx   # 12×5 reference table
│   │   └── ...                  # Other harmonica components
│   └── navigation/              # Global navigation menu
├── instruments/
│   └── synth/
│       └── templates/
│           └── basic-synth/     # Synthesizer template
│               ├── components/  # SynthKeyboard, SynthKeys, etc.
│               ├── hooks/       # useAudioSynthesis, useScaleLogic
│               └── utils/       # Synth utilities
├── lib/
│   ├── music/                   # Shared music theory library
│   │   ├── constants.ts         # NOTES, DEGREE_NAMES
│   │   ├── notes.ts             # Note utilities (transpose, enharmonic)
│   │   ├── intervals.ts         # Interval calculations
│   │   └── scales.ts            # Scale definitions
│   ├── harmonica/               # Harmonica-specific logic
│   │   ├── constants.ts         # POSITIONS, BENDS, note offsets
│   │   ├── utils.ts             # Position calculations, scale checks
│   │   └── types.ts             # TypeScript types
│   └── navigation.ts            # Navigation config
├── contexts/
│   └── AudioContext.tsx         # Global audio context provider
└── hooks/
    └── useSharedAudioContext.ts # Audio context hook
```

## Architecture

### Template-Based Instruments
The synth uses a template architecture where primitive templates can spawn multiple variants:
- **Templates**: Core functionality (basic-synth, bass-synth, etc.)
- **Variants**: Specialized instruments (piano, organ, strings)

See `src/instruments/README.md` for detailed architecture documentation.

### Shared Music Theory Library
The `src/lib/music/` module provides reusable music theory utilities:
- Note manipulation (transpose, enharmonic equivalents)
- Scale definitions and intervals
- Chord detection helpers

### Harmonica Position System
The `src/lib/harmonica/` module handles harmonica-specific logic:
- 5 positions with scale intervals and colors
- Blues scale vs modal scale calculations
- Bend note positions and validation
- Position calculation algorithm

## Hidden Features (Beta)

### Key Detector
Real-time musical key detection using microphone input. Currently hidden due to accuracy issues.

**To re-enable:**
1. Uncomment the Key Detector entry in `src/lib/navigation.ts`
2. Restore tab navigation logic in `src/app/page.tsx`

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Roadmap

### In Progress
- Component refactoring for better maintainability
- Harmonica Lab code optimization

### Planned
- Piano and organ synth variants
- Drum machine templates
- Advanced synthesis features (filters, envelopes)
- Preset management system
- Recording and playback
- MIDI input support

### AI Feature Ideas
- **Song Interpretation**: Play songs through synth presets via AI
- **Scale Recognition**: Real-time scale detection from audio input
- **Sound Design**: AI-powered preset generation from natural language

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Audio**: Web Audio API
- **Deployment**: Netlify
