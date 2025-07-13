import { useCallback, useState, useRef } from "react";
import { useAudioAnalyzer } from "./useAudioAnalyzer";
import { useDetectionMode } from "@/components/DetectionModeContext";
import { getBasicPitchModel } from "@/utils/basicPitchLoader";
// Suppress type warnings from dynamic Basic-Pitch helpers
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {
  outputToNotesPoly,
  addPitchBendsToNoteEvents,
  noteFramesToTime,
} from "@spotify/basic-pitch";

export interface BasicPitchNote {
  startTimeSeconds: number;
  durationSeconds: number;
  pitchMidi: number;
  amplitude: number;
  pitchBends?: number[];
}

export interface UsePitchProcessorReturn {
  audioLevel: number;
  isAnalyzing: boolean;
  start: (mediaStream: MediaStream) => Promise<void>;
  stop: () => void;
  getFrequencyData: () => Float32Array | null;
  latestNotes: BasicPitchNote[] | null;
  latestPitchMidi: number | null;
}

export function usePitchProcessor(
  audioContext: AudioContext | null
): UsePitchProcessorReturn {
  // Re-use existing analyzer hook for low-latency audio-level + quick pitch path
  const analyzer = useAudioAnalyzer(audioContext);
  const { mode } = useDetectionMode();

  // State for latest note events if using high accuracy
  const [latestNotes, setLatestNotes] = useState<BasicPitchNote[] | null>(null);
  const [latestPitchMidi, setLatestPitchMidi] = useState<number | null>(null);

  // Internal refs for high-accuracy capture
  const scriptNodeRef = useRef<ScriptProcessorNode | null>(null);
  const bufferRef = useRef<Float32Array | null>(null);
  const writeIndexRef = useRef<number>(0);
  const capturedSamplesRef = useRef<number>(0);
  const lastInferenceSampleCountRef = useRef<number>(0);
  const workletLoadedRef = useRef<boolean>(false);
  const timeDomainRef = useRef<Float32Array | null>(null);
  const pitchDetectionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inferenceBusyRef = useRef<boolean>(false);

  // --- Lightweight YIN implementation for monophonic pitch ---
  function yinPitch(buffer: Float32Array, sampleRate: number): number | null {
    const threshold = 0.1;
    const minFreq = 50;
    const maxFreq = 880;
    const minLag = Math.floor(sampleRate / maxFreq);
    const maxLag = Math.floor(sampleRate / minFreq);

    const diff = new Float32Array(maxLag + 1);
    // Step 1: difference function
    for (let lag = 1; lag <= maxLag; lag++) {
      let sum = 0;
      for (let i = 0; i < buffer.length - lag; i++) {
        const delta = buffer[i] - buffer[i + lag];
        sum += delta * delta;
      }
      diff[lag] = sum;
    }

    // Step 2: cumulative mean normalized difference
    const cmnd = new Float32Array(maxLag + 1);
    cmnd[0] = 1;
    let running = 0;
    for (let lag = 1; lag <= maxLag; lag++) {
      running += diff[lag];
      cmnd[lag] = (diff[lag] * lag) / running;
    }

    // Step 3: absolute threshold
    let tau = -1;
    for (let lag = minLag; lag <= maxLag; lag++) {
      if (cmnd[lag] < threshold) {
        // find local minimum
        while (lag + 1 <= maxLag && cmnd[lag + 1] < cmnd[lag]) lag++;
        tau = lag;
        break;
      }
    }
    if (tau === -1) return null;

    // Step 4: parabolic interpolation for better tau
    const x0 = tau > 1 ? tau - 1 : tau;
    const x2 = tau + 1 < maxLag ? tau + 1 : tau;
    const s0 = cmnd[x0];
    const s1 = cmnd[tau];
    const s2 = cmnd[x2];
    const betterTau = tau + (s2 - s0) / (2 * (2 * s1 - s2 - s0));

    const freq = sampleRate / betterTau;
    return freq;
  }

  // Helper to resample AudioBuffer to 22050 Hz using OfflineAudioContext
  async function resampleTo22050(buffer: AudioBuffer): Promise<AudioBuffer> {
    if (buffer.sampleRate === 22050) return buffer;
    const channels = Math.min(buffer.numberOfChannels, 1);
    const durationSeconds = buffer.duration;
    const targetLength = Math.ceil(22050 * durationSeconds);
    const offline = new OfflineAudioContext(channels, targetLength, 22050);
    const src = offline.createBufferSource();
    src.buffer = buffer;
    src.connect(offline.destination);
    src.start(0);
    const rendered = await offline.startRendering();
    return rendered;
  }

  // For now both modes share the same analyzer.  High-accuracy path will be
  // added later once Basic-Pitch is integrated.

  const runHighAccuracyInference = useCallback(
    async (audioCtx: AudioContext) => {
      if (!bufferRef.current) return;

      // Copy circular buffer into linear array in correct time order
      const maxSamples = audioCtx.sampleRate * 10;
      const ordered = new Float32Array(maxSamples);
      const writeIdx = writeIndexRef.current;
      // First part: from writeIdx to end
      ordered.set(bufferRef.current.subarray(writeIdx), 0);
      // Second part: from start to writeIdx
      ordered.set(
        bufferRef.current.subarray(0, writeIdx),
        maxSamples - writeIdx
      );

      // Create AudioBuffer
      const audioBuf = audioCtx.createBuffer(
        1,
        maxSamples,
        audioCtx.sampleRate
      );
      audioBuf.copyToChannel(ordered, 0);

      try {
        inferenceBusyRef.current = true;
        const model = await getBasicPitchModel();

        // Ensure buffer is at 22050 Hz for Basic-Pitch
        const compatibleBuf = await resampleTo22050(audioBuf);

        const frames: number[][] = [];
        const onsets: number[][] = [];
        const contours: number[][] = [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        await (model as any).evaluateModel(
          compatibleBuf,
          (f: number[][], o: number[][], c: number[][]) => {
            frames.push(...f);
            onsets.push(...o);
            contours.push(...c);
          },
          () => {}
        );

        const notes = noteFramesToTime(
          addPitchBendsToNoteEvents(
            contours,
            outputToNotesPoly(frames, onsets, 0.25, 0.25, 5)
          )
        );

        setLatestNotes(notes as BasicPitchNote[]);
      } catch (err) {
        console.error("Basic-Pitch inference error", err);
      } finally {
        inferenceBusyRef.current = false;
      }
    },
    []
  );

  const setupHighAccuracyCapture = useCallback(
    (mediaStream: MediaStream) => {
      if (!audioContext) return;

      const sampleRate = audioContext.sampleRate;
      const maxSamples = sampleRate * 10; // 10 second buffer
      bufferRef.current = new Float32Array(maxSamples);
      writeIndexRef.current = 0;
      capturedSamplesRef.current = 0;
      lastInferenceSampleCountRef.current = 0;

      const loadWorklet = async () => {
        if (!workletLoadedRef.current) {
          try {
            await audioContext.audioWorklet.addModule(
              "/pcm-capture-processor.js"
            );
            workletLoadedRef.current = true;
          } catch (e) {
            console.error("Failed to load audio worklet", e);
            return null;
          }
        }
        return new AudioWorkletNode(audioContext, "pcm-capture", {
          numberOfInputs: 1,
          numberOfOutputs: 0,
        });
      };

      loadWorklet().then((workletNode) => {
        if (!workletNode) return;

        const source = audioContext.createMediaStreamSource(mediaStream);
        workletNode.port.onmessage = (e) => {
          const input = new Float32Array(e.data);
          const buf = bufferRef.current!;
          let wIdx = writeIndexRef.current;
          for (let i = 0; i < input.length; i++) {
            buf[wIdx++] = input[i];
            if (wIdx >= buf.length) {
              wIdx = 0;
            }
          }
          writeIndexRef.current = wIdx;
          capturedSamplesRef.current += input.length;

          if (
            capturedSamplesRef.current - lastInferenceSampleCountRef.current >=
            buf.length
          ) {
            lastInferenceSampleCountRef.current = capturedSamplesRef.current;
            runHighAccuracyInference(audioContext);
          }
        };

        source.connect(workletNode);
        // workletNode has no outputs, no need to connect further
        scriptNodeRef.current = workletNode as unknown as ScriptProcessorNode;

        // Start rolling-window scheduler (every 2 seconds)
        if (!analysisIntervalRef.current) {
          analysisIntervalRef.current = setInterval(() => {
            if (!audioContext) return;
            if (inferenceBusyRef.current) return; // skip if previous run not finished
            const minSamples = audioContext.sampleRate * 4; // 4 seconds threshold
            if (capturedSamplesRef.current < minSamples) return;
            runHighAccuracyInference(audioContext);
          }, 2000);
        }
      });
    },
    [audioContext, runHighAccuracyInference]
  );

  // Wrapper functions so component code doesn’t need to know implementation details
  const start = useCallback(
    async (mediaStream: MediaStream) => {
      // Reset previously detected data when starting a fresh recording session
      setLatestNotes(null);
      setLatestPitchMidi(null);
      // Future: branch here based on mode to start Basic-Pitch buffer capture.
      await analyzer.startAnalysis(mediaStream);

      if (mode === "highAccuracy") {
        setupHighAccuracyCapture(mediaStream);
      } else {
        // Prepare time domain buffer for streaming pitch detection
        if (analyzer.analyzerNode) {
          timeDomainRef.current = new Float32Array(
            analyzer.analyzerNode.fftSize
          );
        }

        pitchDetectionTimerRef.current = setInterval(() => {
          if (!analyzer.analyzerNode || !timeDomainRef.current) return;
          analyzer.analyzerNode.getFloatTimeDomainData(timeDomainRef.current);
          const freq = yinPitch(
            timeDomainRef.current,
            audioContext!.sampleRate
          );
          if (freq) {
            const midi = 69 + 12 * Math.log2(freq / 440);
            setLatestPitchMidi(midi);
          }
        }, 100);
      }
    },
    [analyzer, mode, setupHighAccuracyCapture, audioContext]
  );

  const stop = useCallback(() => {
    analyzer.stopAnalysis();
    if (scriptNodeRef.current) {
      scriptNodeRef.current.disconnect();
      scriptNodeRef.current.onaudioprocess = null;
      scriptNodeRef.current = null;
    }
    if (pitchDetectionTimerRef.current) {
      clearInterval(pitchDetectionTimerRef.current);
      pitchDetectionTimerRef.current = null;
    }
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    // Future: also stop Basic-Pitch worker/buffer if active
  }, [analyzer]);

  return {
    audioLevel: analyzer.audioLevel,
    isAnalyzing: analyzer.isAnalyzing,
    start,
    stop,
    getFrequencyData: analyzer.getFrequencyData,
    latestNotes,
    latestPitchMidi,
  };
}
