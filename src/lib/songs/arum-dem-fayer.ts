import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/arum-dem-fayer.json";

const doc = document as SongDocument;

export const arumDemFayer: SongEntry = {
  id: "arum-dem-fayer",
  title: "Arum Dem Fayer",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "arum dem fayer.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/arum%20dem%20fayer.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
