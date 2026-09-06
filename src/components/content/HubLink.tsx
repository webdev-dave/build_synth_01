import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Spoke → collection hub. A destination, not history back — trailing arrow
 * so it doesn't impersonate the header's Back control.
 */
export function HubLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
