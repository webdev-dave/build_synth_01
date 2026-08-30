import type { SongDocument } from "@/lib/song";
import { KLEZMER_LABELS, type SongEntry } from "./types";
import document from "./catalog/tumbalalaika-panamarjov.json";

const doc = document as SongDocument;

export const tumbalalaikaPanamarjov: SongEntry = {
  id: "tumbalalaika-panamarjov",
  title: "Tumbalalaika — Panamarjov",
  subtitle: "Version B · Oleg Panamarjov arrangement · 6/8",
  labels: KLEZMER_LABELS,
  source: {
    filename: "tumbalalaika_[panamarjov_oleg].mid",
    localPath: "C:/Users/elido/Downloads/tumbalalaika_[panamarjov_oleg].mid",
    collection: "user drop",
    note: "Version B of Tumbalalaika. Version A is the split voice + piano pair.",
    ingestedAt: "2026-08-30",
  },
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
