import type { SongDocument } from "@/lib/song";
import type { SongEntry } from "./types";
import document from "./catalog/tumbalalaika-panamarjov.json";

const doc = document as SongDocument;

export const tumbalalaikaPanamarjov: SongEntry = {
  id: "tumbalalaika-panamarjov",
  title: "Tumbalalaika — Panamarjov",
  subtitle: "Version B · Oleg Panamarjov arrangement · 6/8",
  bpm: doc.meta.tempo,
  document: doc,
  melody: [],
};
