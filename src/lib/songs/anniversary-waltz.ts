import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/anniversary-waltz.json";

const doc = document as SongDocument;

export const anniversaryWaltz: SongEntry = {
  id: "anniversary-waltz",
  title: "Anniversary Waltz",
  subtitle: "Klezmer folktune · 3/4 · FreeSheetMusic.net",
  labels: KLEZMER_LABELS,
  source: {
    url: "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    filename: "anniversary waltz.mid",
    fileUrl:
      "https://www.freesheetmusic.net/music/worldfolk/klezmer/anniversary%20waltz.mid",
    collection: "FreeSheetMusic.net · Klezmer Folktunes",
    note: "Listing title only. A later page item uses a different file (anniversary waltz chanesse valts.mid).",
    ingestedAt: "2026-08-30",
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
