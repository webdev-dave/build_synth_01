import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/shabes-in-vilna.json";

const doc = document as SongDocument;

export const shabesInVilna: SongEntry = {
  id: "shabes-in-vilna",
  title: "Shabes in Vilna",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "shabes in vilna.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/shabes%20in%20vilna.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
