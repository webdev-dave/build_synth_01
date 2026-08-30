import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/patsh-tantz.json";

const doc = document as SongDocument;

export const patshTantz: SongEntry = {
  id: "patsh-tantz",
  title: "Patsh Tantz",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "patsh tantz.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/patsh%20tantz.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
