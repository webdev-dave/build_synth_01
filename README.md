# Synth-v01

A simple web-based synthesizer application built with Next.js & the Web Audio API.

## Live Demo

Check out the live version here: [Synth-v01](https://synth-v01.netlify.app)

## Features

- Basic sound generation using an oscillator
- Piano keyboard with octave controls
- Added Selectable musical scales with visual feedback to help PianoSynth users visualize the keys that belong in the selected scaled scale of the notes being played

## Development Todo

- By implementing the selectScale feature, the overall app performance is noticeably slower. Find out why and fix it
- review the new code logic for the selectScale feature and make sure it's working as expected
- start to compartmentalize the PianoKeyboard.tsx code into more manageable files and folders (e.g. separate the piano key logic from the scale selection logic etc.)
- Make sure to understand the concept of different sound wave shapes/types
- Make sure to understand the underlying theory of Major/Minor scales and how to use logic to predict which notes are in a given scale
- Fix: fix issue with piano keyButtons remaining "visually" pressed (darker grey than the other keys) after being functionally released
- Fix: issues with piano key sizing and alignment:
  - some white piano keys being slightly wider than others
  - black piano keys aren't truly centered on the white keys
- Add multi-touch support for playing chords on mobile/touch devices
- Get app to work on mobile safari browsers (may already be working now that we added the "Tap to Enable Sound" modal)
- Figure out workaround to get app to work on touch devices without using the "Tap to Enable Sound" modal (currently, without it, first mobile touch doesn't do anything, the second press triggers the initially pressed note and remains pressed even after the finger is lifted and other notes are pressed)
- create a mapping of computer keyboard => virtual piano
- Optimize audio latency
  - Reduce delay between key press and sound playback

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
