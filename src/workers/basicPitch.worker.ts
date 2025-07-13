/// <reference lib="webworker" />

import { getBasicPitchModel } from "@/utils/basicPitchLoader";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore  Basic-Pitch helpers are JS-only
import {
  outputToNotesPoly,
  addPitchBendsToNoteEvents,
  noteFramesToTime,
} from "@spotify/basic-pitch";

// Lazily-loaded Basic-Pitch instance reused across requests
let model: any = null;

interface InferenceRequest {
  type: "inference";
  id: number;
  samples: ArrayBuffer;
  sampleRate: number;
}

interface InferenceSuccess {
  type: "result";
  id: number;
  notes: unknown; // BasicPitchNote[] – kept untyped to avoid main-bundle import
}

interface InferenceError {
  type: "error";
  id: number;
  message: string;
}

self.onmessage = async (event: MessageEvent<InferenceRequest>) => {
  const { type } = event.data;
  if (type !== "inference") return;

  const { id, samples, sampleRate } = event.data;
  try {
    if (!model) {
      model = await getBasicPitchModel();
    }

    // Recreate Float32 view from transferred buffer
    const pcm = new Float32Array(samples);

    // Create an AudioBuffer inside an OfflineAudioContext (allowed in workers)
    const offlineCtx = new OfflineAudioContext(1, pcm.length, sampleRate);
    const audioBuffer = offlineCtx.createBuffer(1, pcm.length, sampleRate);
    audioBuffer.copyToChannel(pcm, 0);

    const frames: number[][] = [];
    const onsets: number[][] = [];
    const contours: number[][] = [];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await model.evaluateModel(
      audioBuffer,
      (f: number[][], o: number[][], c: number[][]) => {
        frames.push(...f);
        onsets.push(...o);
        contours.push(...c);
      },
      () => {}
    );

    // Convert low-level model outputs to note events
    const notes = noteFramesToTime(
      addPitchBendsToNoteEvents(
        contours,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        outputToNotesPoly(frames, onsets, 0.25, 0.25, 5)
      )
    );

    (self as DedicatedWorkerGlobalScope).postMessage({
      type: "result",
      id,
      notes,
    } as InferenceSuccess);
  } catch (err) {
    (self as DedicatedWorkerGlobalScope).postMessage({
      type: "error",
      id,
      message: err instanceof Error ? err.message : String(err),
    } as InferenceError);
  }
};

export {}; // ensures this file is treated as a module
