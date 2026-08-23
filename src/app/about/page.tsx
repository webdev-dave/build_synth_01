import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Github,
  Instagram,
  Youtube,
  createLucideIcon,
  type LucideIcon,
} from "lucide-react";

import { AUTHOR } from "@/lib/author";
import { APP_NAME } from "@/lib/navigation";
import { Button } from "@/components/ui/button";

/**
 * Boxed LinkedIn "in" mark in Lucide's stroke style — reads more like the
 * brand than Lucide's boxless default, while staying on the 24px/2px grid so
 * it sits comfortably next to the GitHub and YouTube icons.
 */
const Linkedin: LucideIcon = createLucideIcon("LinkedinBoxed", [
  ["rect", { x: "2", y: "2", width: "20", height: "20", rx: "3", key: "box" }],
  ["path", { d: "M7 10h.01", key: "i-dot" }],
  ["path", { d: "M7 13v4", key: "i-stem" }],
  ["path", { d: "M11 17v-4a3 3 0 0 1 6 0v4", key: "n" }],
]);

export const metadata: Metadata = {
  title: `About the developer — ${APP_NAME}`,
  description: `${AUTHOR.name} started ${APP_NAME} to learn music theory by building — and kept going so other musicians and tinkerers could play with it too.`,
};

export default function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <header>
          <p className="text-sm font-medium text-muted-foreground">
            About the developer
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            {AUTHOR.name}
          </h1>
          <div className="mt-4 max-w-xl space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              This project started the way most of my projects do: I learn by
              building. It has always been how things actually click for me.
            </p>
            <p>
              It began as a small web synth — a way to get a feel for the math
              and logic behind music theory. As I built it out and started
              seeing real-world uses, I figured — why not share it with other
              musicians and tinkerers?
            </p>
            <p>
              Music has been a long road for me. Before all this, I spent years
              as a DJ in the{" "}
              <a
                href="https://en.wikipedia.org/wiki/Hasidic_Judaism"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline-offset-4 hover:underline"
              >
                Hasidic
              </a>{" "}
              community — a chapter that still lives on my{" "}
              <a
                href="https://www.youtube.com/@virtual_kretshmeh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline-offset-4 hover:underline"
              >
                YouTube channel
              </a>{" "}
              from that era. I&apos;ve been quietly toying with the idea of
              firing it back up — so consider that a soft &ldquo;stay
              tuned.&rdquo;
            </p>
            <p>
              These days I play blues harmonica, with piano and accordion next
              on the list. I&apos;m on the hunt for a good-quality used
              accordion, so if you&apos;d like to gift one or sell me one — or
              know a guy who knows a guy — please{" "}
              <Link
                href="/contact"
                className="text-foreground underline-offset-4 hover:underline"
              >
                reach out
              </Link>
              . As I keep studying theory and picking up new instruments, this
              will keep growing right alongside me.
            </p>
          </div>
        </header>

        <figure className="mt-8">
          <Image
            src="/about/dave-forest-rig.png"
            alt={`${AUTHOR.name} setting up a keyboard rig and mic stand at an outdoor set in the woods`}
            width={1024}
            height={678}
            className="w-full rounded-lg border border-border/60"
            priority
          />
          <figcaption className="mt-2 font-mono text-xs text-muted-foreground">
            Setting up for a set in the woods. Photo by{" "}
            <a
              href="https://www.instagram.com/marrker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-4 hover:underline"
            >
              Mark
            </a>
            .
          </figcaption>
        </figure>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild variant="outline">
            <a
              href={AUTHOR.github.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github />
              {AUTHOR.github.label}
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              href={AUTHOR.linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin />
              {AUTHOR.linkedin.label}
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              href={AUTHOR.youtube.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Youtube />
              {AUTHOR.youtube.label}
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              href={AUTHOR.instagram.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram />
              {AUTHOR.instagram.label}
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
