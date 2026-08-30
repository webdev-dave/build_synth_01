"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Old MIDI Lab URL — the public tool is now Piano Roll. */
export default function MidiLabRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/piano-roll");
  }, [router]);
  return (
    <p className="p-6 text-sm text-muted-foreground">
      Moved to{" "}
      <a href="/piano-roll" className="underline hover:text-foreground">
        Piano Roll
      </a>
      .
    </p>
  );
}
