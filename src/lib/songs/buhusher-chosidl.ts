import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/buhusher-chosidl.json";

const doc = document as SongDocument;

export const buhusherChosidl: SongEntry = {
  id: "buhusher-chosidl",
  title: "Buhusher Chosidl",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "buhusher chosidl.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/buhusher%20chosidl.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
