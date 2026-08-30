import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/hopak-katsatske.json";

const doc = document as SongDocument;

export const hopakKatsatske: SongEntry = {
  id: "hopak-katsatske",
  title: "Hopak Katsatske",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net",
  labels: KLEZMER_LABELS,
  source: {
    url: "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    filename: "hopak katsatske.mid",
    fileUrl:
      "https://www.freesheetmusic.net/music/worldfolk/klezmer/hopak%20katsatske.mid",
    collection: "FreeSheetMusic.net · Klezmer Folktunes",
    ingestedAt: "2026-08-30",
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
