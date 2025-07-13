# ToDoKeyDetector file

- understand better how high accuracy mode works. then test and think of ways to make it more accurate
- make sure it stores the likeliest key of each clip and then as time progress keeps honing in on the likeliest key based on most common prediction in set of prediction per each clip (new clip starts every 2 seconds)
- understand better how quick (low accuracy mode works). test and make more accurate if possible
- create hybrid mode that uses both custom quick mode algorithm + high accuracy mode (spotify basic-pitch) to predict even more accurately
- display mic device name
- UI refinement: show Basic-Pitch progress (e.g., spinner or “Analyzing…” overlay), improve dark-theme contrast.
- Mobile optimisation: throttle redraws when tab is hidden, lower analyser FFT size on low-end devices.
- Error handling: surface low-mic-level warnings or permission denials with actionable tips.
- Synth integration: automatically switch the on-screen keyboard scale to the detected key.
