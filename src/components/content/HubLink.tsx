import Link from "next/link";

import { PROSE_LINK } from "@/components/content/prose";

/**
 * Spoke → collection hub. Words only: the header already owns the back and
 * forward arrows, and a second arrow here gets clicked as if it were one of
 * them. The underline is the "this goes somewhere" signal.
 */
export function HubLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`text-base ${PROSE_LINK}`}>
      {children}
    </Link>
  );
}
