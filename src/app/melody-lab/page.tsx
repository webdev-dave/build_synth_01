"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/** Brief Melody Lab URL — the public tool is Piano Roll. */
export default function MelodyLabRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/piano-roll");
  }, [router]);
  return (
    <p className="p-6 text-sm text-muted-foreground">
      Moved to{" "}
      <Link href="/piano-roll" className="underline hover:text-foreground">
        Piano Roll
      </Link>
      .
    </p>
  );
}
