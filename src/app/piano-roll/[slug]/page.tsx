import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SONGS, getSong, type SongEntry } from "@/lib/songs";

interface PianoRollSongPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return SONGS.map((song) => ({ slug: song.id }));
}

const HUB_TITLE = "Piano Roll (beta)";
const HUB_DESCRIPTION =
  "Draw, play, and edit melodies on an interactive piano roll.";

/** In-copyright pop/blues must not rank. Klezmer stays default-indexable. */
function shouldNoindex(song: SongEntry): boolean {
  if (
    song.id === "yesterday-beatles" ||
    song.id === "yesterday-v1" ||
    song.id === "yesterday-v2"
  ) {
    return true;
  }
  return song.labels.includes("blues") || song.labels.includes("pop");
}

export async function generateMetadata({
  params,
}: PianoRollSongPageProps): Promise<Metadata> {
  const { slug } = await params;
  const song = getSong(slug);
  if (!song) return { title: HUB_TITLE };
  return {
    title: HUB_TITLE,
    description: HUB_DESCRIPTION,
    robots: shouldNoindex(song) ? { index: false } : undefined,
  };
}

export default async function PianoRollSongPage({
  params,
}: PianoRollSongPageProps) {
  const { slug } = await params;
  if (!getSong(slug)) notFound();
  return null;
}
