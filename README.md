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
- **Responsive Design**: Optimized for landscape orientation
- **Modular Architecture**: Easy to extend with new instruments

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

## Research Music Theory and Logic

- Research Synth full-screen mode funct
- Research the concept of different sound wave shapes/types
- Research the underlying theory of Major/Minor scales and how to use logic to predict which notes are in a given scale
- Research the logic used by the "note playing" data window on the bottom piano menu to detect what chord is playing
- Research how multi-touch input support logic works

## Development Todo

- Do a deep dive and fix all UX/UI issues with FullScreen mode for desktop and mobile
- Add Feature: When user is in "Scale Mode", color the root key and relative minor/major to point out to the user what is the root and relative min/maj
- Fix: when in full screen and the cell phone rotates from landscape to portrait, all synth presets get lost
- Re-arrange key/scale dropdown so that next to each scale the matching minor/major is also shown in the list (for example: Cmaj (Amin) )
- start to compartmentalize the PianoKeyboard.tsx code into more manageable files and folders (e.g. separate the piano key logic from the scale selection logic etc.)
- Add a selectChord feature. This will be an add on to the selectScale feature. If a user is in a "selected scale" then there should be another dropdown that will allow them to select a chord from that scale. The effect of selecting a chord should be as follows. The keys in the selected chord should be colored orange. Additionally, next to the chord dropdown, there will be a play/pause button that will play the chord sound if a user selects "play". The chord should automatically stop playing if any new key input is pressed by an app user
- Fix: fix issue with piano keyButtons remaining "visually" pressed (darker grey than the other keys) after being functionally released
- Fix: issues with piano key sizing and alignment:
  - some white piano keys being slightly wider than others
  - black piano keys aren't truly centered on the white keys
- Fix: Windows tablet triple-finger touch gesture interferes with chord playing by triggering the task switcher overlay
- Get app to work on mobile safari browsers (may already be working now that we added the "Tap to Enable Sound" modal)
- Figure out workaround to get app to work on touch devices without using the "Tap to Enable Sound" modal (currently, without it, first mobile touch doesn't do anything, the second press triggers the initially pressed note and remains pressed even after the finger is lifted and other notes are pressed)
- create a mapping of computer keyboard => virtual piano
- Optimize audio latency
  - Reduce delay between key press and sound playback
- Reduce click/pop sounds on note abrupt end
- Sound Bank/Library
  - 70s Organ

## Additional Features

- Add a white noise oscillator that can be used offline (and play in the background)
- Add ability to toggle between Western piano scale and Maqam-Rast (Arabian) scales
  - Western: Standard 12-tone equal temperament
  - Maqam-Rast: Traditional Middle Eastern scale with quarter tones
- Key Conversion: Process songs (via YouTube/Spotify links) and play them back in any requested key
  - Input: Song URL or audio file
  - Output: Same song transposed to user's chosen key
  - Support for both major and minor key conversions
- Allow user to use a midi keyboard to play the piano

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
