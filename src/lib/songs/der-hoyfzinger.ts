import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/der-hoyfzinger.json";

const doc = document as SongDocument;

export const derHoyfzinger: SongEntry = {
  id: "der-hoyfzinger",
  title: "Der Hoyfzinger",
  subtitle: "Klezmer folktune · 3/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "der hoyfzinger.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/der%20hoyfzinger.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
