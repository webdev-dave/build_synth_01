import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/bei-mir-bist-du-schon.json";

const doc = document as SongDocument;

export const beiMirBistDuSchon: SongEntry = {
  id: "bei-mir-bist-du-schon",
  title: "Bei Mir Bist Du Schön",
  subtitle: "Lead sheet · verse + lyrics · 3/8",
  labels: KLEZMER_LABELS,
  source: {
    filename: "bei-mir-bist-du-schon-lead-sheet-with-verse-and-lyrics.mid",
    localPath:
      "C:/Users/elido/Downloads/bei-mir-bist-du-schon-lead-sheet-with-verse-and-lyrics.mid",
    collection: "user drop",
    ingestedAt: "2026-08-30",
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
