# Synth-v01

A simple web-based synthesizer application built with Next.js & the Web Audio API.

## Live Demo

Check out the live version here: [Synth-v01](https://synth-v01.netlify.app)

## Features

- Play and stop sound using a button
- Adjust frequency using a slider
- Basic sound generation using an oscillator
- Piano keyboard with octave controls

## Development Todo

- make sure to review all logic related to the piano keyboard and make sure it's working as expected (and that i understand it before moving on to the next phase). Also, make sure to understand the concept of different sound wave shapes/types
- Add multi-touch support for playing chords on mobile/touch devices
- Get app to work on mobile safari browsers
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
