import type { SongDocument } from "@/lib/song";
import type { SongEntry } from "./types";
import document from "./catalog/bei-mir-bist-du-schon.json";

const doc = document as SongDocument;

export const beiMirBistDuSchon: SongEntry = {
  id: "bei-mir-bist-du-schon",
  title: "Bei Mir Bist Du Schön",
  subtitle: "Lead sheet · verse + lyrics · 3/8",
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
