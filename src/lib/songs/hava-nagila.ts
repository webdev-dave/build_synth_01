import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/hava-nagila.json";

const doc = document as SongDocument;

export const havaNagila: SongEntry = {
  id: "hava-nagila",
  title: "Hava Nagila",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net",
  labels: KLEZMER_LABELS,
  source: {
    url: "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    filename: "hava nagila.mid",
    fileUrl:
      "https://www.freesheetmusic.net/music/worldfolk/klezmer/hava%20nagila.mid",
    collection: "FreeSheetMusic.net · Klezmer Folktunes",
    ingestedAt: "2026-08-30",
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
