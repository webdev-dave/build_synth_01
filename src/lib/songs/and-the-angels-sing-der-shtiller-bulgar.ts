import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/and-the-angels-sing-der-shtiller-bulgar.json";

const doc = document as SongDocument;

export const andTheAngelsSingDerShtillerBulgar: SongEntry = {
  id: "and-the-angels-sing-der-shtiller-bulgar",
  title: "And The Angels Sing Der Shtiller Bulgar",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "and the angels sing der shtiller bulgar.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/and%20the%20angels%20sing%20der%20shtiller%20bulgar.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
