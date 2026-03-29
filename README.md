# Build Synth 01

A modern web-based Digital Audio Workstation (DAW) built with Next.js and TypeScript, featuring a template-based instrument architecture.

## 🎹 Architecture Overview

This DAW uses a **template-based architecture** where each instrument family has primitive templates that can spawn multiple variations:

```
src/instruments/
├── synth/                    # Synthesizer family
│   ├── templates/           # Primitive templates
│   │   └── basic-synth/     # Basic synthesizer template
│   ├── variants/            # Template variations (future)
│   │   ├── piano/          # Piano variant of basic-synth
│   │   └── organ/          # Organ variant of basic-synth
│   └── index.ts            # Synth family exports
└── drums/                   # Drum machine family (future)
    ├── templates/
    └── variants/
```

## 🚀 Current Features

- **Basic Synthesizer Template**: A foundational synth with customizable waveforms
- **Scale-aware Key Highlighting**: Visual feedback for musical scales
- **Real-time Audio Synthesis**: Web Audio API-based sound generation
- **Harmonica Lab**: Interactive position guide for diatonic blues harp with theory diagrams
- **Responsive Design**: Optimized for landscape orientation
- **Modular Architecture**: Easy to extend with new instruments
- **Unified Navigation**: Hamburger menu for easy access to all tools

## 🚧 Hidden Features (Beta)

The following features are temporarily hidden due to ongoing development:

### Key Detector (Hidden)

Real-time musical key detection using microphone input. Currently hidden due to accuracy issues.

**Status**: Needs improvement in detection algorithms before re-enabling.

**To re-enable**:
1. Uncomment the Key Detector entry in `src/lib/navigation.ts`
2. Restore tab navigation logic in `src/app/page.tsx` (see archived code at bottom of file)
3. The PitchDetector component and related hooks are still available in the codebase

## 🛠 Development Status

### ✅ Completed

- Template-based architecture implementation
- Basic synthesizer template with modular components
- Audio synthesis with multiple waveforms
- Scale logic and key highlighting
- Responsive UI components

### 🔄 In Progress

- Component refactoring and optimization
- Enhanced audio features

### 📋 Planned

- Piano and organ variants of the basic synthesizer
- Drum machine templates and variants
- Advanced synthesis features
- Preset management system
- Recording and playback capabilities

## Live Demo

Check out the live version here: [Synth-v01](https://synth-v01.netlify.app)

## Features

- Basic sound generation using an oscillator
- Piano keyboard with octave controls
- Added Selectable musical scales with visual feedback to help PianoSynth users visualize the keys that belong in the selected scaled scale of the notes being played
- Created a note/notes data window that displays data related to current note/notes being played. For example, if a single note is being played, the window displays the Hz Frequency of that note. If multiple notes are being played, the window will attempt to detect what chord is being played

## AI Feature Ideas

### AI Song Interpretation

- Allow users to request AI to play their favorite songs through the synth's sound presets
- Examples:
  - Play "Blackbird" by The Beatles using the synth's flute preset
  - Interpret classical piano pieces with different synth voices
- Support batch processing of playlists

### AI Scale Recognition

- Real-time scale detection from audio input (microphone)
  - Automatically detect musical scale from live or streaming audio
  - Visually highlight detected scale on piano keyboard
  - Default to "unlocked" scale mode to allow experimentation
  - Option to "lock" to detected scale once confirmed
- Features:
  - Works with live performances
  - Compatible with streaming platforms
  - Real-time scale updates as song progresses
  - Handles key changes within songs
  - Confidence indicator for scale detection accuracy

### AI Sound Design

- AI-powered preset generation and modification
- Features:
  - Generate random unique presets
  - Create presets based on user descriptions
  - Modify existing presets based on user feedback
  - Accept natural language input for sound design (e.g., "make it more ethereal")

### Implementation Notes

- Integration with music streaming platforms for source material
- Natural language processing for sound design instructions
- Machine learning models for sound synthesis and modification
- Added "Tap to Enable Sound" modal
