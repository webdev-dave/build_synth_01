import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/itsik-hot-khasene-gehat.json";

const doc = document as SongDocument;

export const itsikHotKhaseneGehat: SongEntry = {
  id: "itsik-hot-khasene-gehat",
  title: "Itsik Hot Khasene Gehat",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "itsik hot khasene gehat.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/itsik%20hot%20khasene%20gehat.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
