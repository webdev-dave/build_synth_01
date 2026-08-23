import type { Metadata } from "next";
import { Mail } from "lucide-react";

import { AUTHOR } from "@/lib/author";
import { APP_NAME } from "@/lib/navigation";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  // The Instrumaps suffix is appended by the root title.template.
  title: "Contact",
  description: `Write ${AUTHOR.name} about ${APP_NAME} — an idea, a collaboration, or a used accordion.`,
};

export default function ContactPage() {
  const mailto = `mailto:${AUTHOR.email}?subject=${encodeURIComponent("Instrumaps")}`;

  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <header>
          <p className="text-sm font-medium text-muted-foreground">Contact</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Write me
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            An idea, a question, a collaboration, or a good-quality used
            accordion you&apos;d like to gift or sell — I read everything.
          </p>
        </header>

        <div className="mt-8">
          <Button asChild variant="outline">
            <a href={mailto}>
              <Mail />
              Email {AUTHOR.name}
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
