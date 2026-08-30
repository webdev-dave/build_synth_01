import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/ale-brider.json";

const doc = document as SongDocument;

export const aleBrider: SongEntry = {
  id: "ale-brider",
  title: "Ale Brider",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "ale brider.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/ale%20brider.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
