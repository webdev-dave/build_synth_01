import type { SongDocument } from "@/lib/song";
import { YESTERDAY_LABELS, type SongEntry } from "./types";
import document from "./catalog/yesterday-beatles.json";

const doc = document as SongDocument;

export const yesterdayBeatles: SongEntry = {
  id: "yesterday-beatles",
  title: "Yesterday — Beatles MIDI",
  subtitle: "Version C · MIDI arrangement · 4/4",
  labels: YESTERDAY_LABELS,
  source: {
    filename: "beatles-yesterday.mid",
    localPath: "C:/Users/elido/Downloads/beatles-yesterday.mid",
    collection: "user drop",
    ingestedAt: "2026-08-30",
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
