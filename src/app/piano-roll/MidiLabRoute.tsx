"use client";

import { usePathname } from "next/navigation";

import { getSong } from "@/lib/songs";
import { MidiLab } from "@/components/midi/MidiLab";

function songIdFromPath(pathname: string): string | undefined {
  const prefix = "/piano-roll/";
  if (!pathname.startsWith(prefix)) return undefined;
  const rest = pathname.slice(prefix.length);
  if (!rest || rest.includes("/")) return undefined;
  return decodeURIComponent(rest);
}

/** Shared lab instance for `/piano-roll` and `/piano-roll/[slug]`. */
export function MidiLabRoute() {
  const pathname = usePathname();
  const songId = songIdFromPath(pathname);
  if (songId && !getSong(songId)) return null;
  return <MidiLab songId={songId} />;
}
