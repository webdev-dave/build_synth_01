import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/der-shtiller-bulgar-and-the-angels-sing.json";

const doc = document as SongDocument;

export const derShtillerBulgarAndTheAngelsSing: SongEntry = {
  id: "der-shtiller-bulgar-and-the-angels-sing",
  title: "Der Shtiller Bulgar And The Angels Sing",
  subtitle: "Klezmer folktune · 2/4 · FreeSheetMusic.net · Klezmer Folktunes",
  labels: KLEZMER_LABELS,
  source: {
    "url": "https://www.freesheetmusic.net/music/worldfolk/klezmer.html",
    "filename": "der shtiller bulgar and the angels sing.mid",
    "fileUrl": "https://www.freesheetmusic.net/music/worldfolk/klezmer/der%20shtiller%20bulgar%20and%20the%20angels%20sing.mid",
    "collection": "FreeSheetMusic.net · Klezmer Folktunes",
    "ingestedAt": "2026-08-30"
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
