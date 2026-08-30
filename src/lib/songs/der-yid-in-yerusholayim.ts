import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/der-yid-in-yerusholayim.json";

const doc = document as SongDocument;

export const derYidInYerusholayim: SongEntry = {
  id: "der-yid-in-yerusholayim",
  title: "Der Yid in Yerusholayim",
  subtitle: "Klezmer folktune · 4/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "der yid in yerusholayim.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/der%20yid%20in%20yerusholayim.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
