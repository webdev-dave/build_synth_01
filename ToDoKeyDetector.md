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

- [ ] Web-Worker offload (detailed proposal – pending revisit)

  _Goal_: move Basic-Pitch inference off the main thread to keep UI & audio smooth on mid-range mobiles.

  1. Create `src/workers/basicPitch.worker.ts` that lazily loads the model, receives Float32Array PCM, runs `evaluateModel`, returns note events.  
     – Use `OfflineAudioContext` inside worker.  
     – Re-use a single Basic-Pitch instance; avoid re-loading.
  2. In `usePitchProcessor`  
     – Keep circular 10-s buffer / resample to 22 050 Hz on the main thread.  
     – Instantiate the worker with `new Worker(new URL("../workers/basicPitch.worker.ts", import.meta.url), {type:"module"})`.  
     – Transfer the PCM buffer (`postMessage({…, samples: pcm.buffer}, [pcm.buffer])`).  
     – Handle `result` / `error` messages, update React state.  
     – Terminate worker on `stop()` / unmount.
  3. Make sure ESLint passes: import `type { BasicPitch }` & no `any`.
  4. Protect bundle size: Basic-Pitch only lives in worker; main bundle keeps tree-shakable import out.
  5. Progressive enhancement: fall back to in-thread processing if `Worker` or `AudioWorklet` not available.

  Status: **Deferred** – initial attempt caused missing key detection; revisit after stabilising current features.
