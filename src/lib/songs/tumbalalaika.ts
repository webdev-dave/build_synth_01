import type { SongDocument } from "@/lib/song";
import type { SongEntry } from "./types";
import document from "./catalog/tumbalalaika.json";

const doc = document as SongDocument;

export const tumbalalaika: SongEntry = {
  id: "tumbalalaika",
  title: "Tumbalalaika — voice + piano",
  subtitle: "Version A · split MIDI · Ab minor · 3/4",
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
