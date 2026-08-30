import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/shpraiz-ich-mir.json";

const doc = document as SongDocument;

export const shpraizIchMir: SongEntry = {
  id: "shpraiz-ich-mir",
  title: "Shpraiz Ich Mir",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "shpraiz ich mir.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/shpraiz%20ich%20mir.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
