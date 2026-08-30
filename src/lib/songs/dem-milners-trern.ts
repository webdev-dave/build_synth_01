import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/dem-milners-trern.json";

const doc = document as SongDocument;

export const demMilnersTrern: SongEntry = {
  id: "dem-milners-trern",
  title: "Dem Milners Trern",
  subtitle: "Klezmer folktune · 3/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "dem milners trern.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/dem%20milners%20trern.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
