## Research Music Theory and Logic

- Research Synth full-screen mode funct
- Research the concept of different sound wave shapes/types
- Research the underlying theory of Major/Minor scales and how to use logic to predict which notes are in a given scale
- Research the logic used by the "note playing" data window on the bottom piano menu to detect what chord is playing
- Research how multi-touch input support logic works

## Development Todo

- add Feature: when is user "right clicks" on a piano/synth key, the key should sustain infintely until the user presses it again via any touch or click input
- Add Feature: accept midi input for midi devices
- Add Feature: When user is in "Scale Mode", color the root key and relative minor/major to point out to the user what is the root and relative min/maj
- Add Feature: add a "blues scale" dropdown that handles blues scales for "scale mode"
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
