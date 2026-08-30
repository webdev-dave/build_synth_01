import type { SongDocument } from "@/lib/song";
import type { SongEntry } from "./types";
import document from "./catalog/yesterday-beatles.json";

const doc = document as SongDocument;

export const yesterdayBeatles: SongEntry = {
  id: "yesterday-beatles",
  title: "Yesterday — Beatles MIDI",
  subtitle: "Version C · MIDI arrangement · 4/4",
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
