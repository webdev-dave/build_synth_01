import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/kesh-jig-kincora-jig.json";

const doc = document as SongDocument;

export const keshJigKincoraJig: SongEntry = {
  id: "kesh-jig-kincora-jig",
  title: "Kesh Jig Kincora Jig",
  subtitle: "Klezmer folktune · 6/8 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "kesh jig kincora jig.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/kesh%20jig%20kincora%20jig.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
