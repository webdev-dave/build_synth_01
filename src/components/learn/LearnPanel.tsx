"use client";

import Link from "next/link";
import { motion, MotionConfig } from "motion/react";
import { ArrowRight, BookOpen, X } from "lucide-react";

import { Card } from "@/components/ui/card";

export interface LearnPanelConcept {
  id: string;
  title: string;
  body: string[];
  /** Route of the full lesson; omit when there's none. */
  lessonHref?: string;
}

interface LearnPanelProps {
  /** The most recently clicked concept, or null for the idle hint. */
  concept: LearnPanelConcept | null;
  onClose: () => void;
}

/**
 * The single shared learning area: one fixed spot below an instrument that
 * always shows the mini-lesson for the last concept the user clicked.
 * Content replaces in place — nothing stacks, so the page never grows noisy.
 */
export function LearnPanel({ concept, onClose }: LearnPanelProps) {
  if (!concept) {
    return (
      <p className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
        <BookOpen className="h-3.5 w-3.5" strokeWidth={1.75} />
        Click any label — scale, waveform, octave, the Hz readout — to learn
        what it means.
      </p>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <Card className="p-4 sm:p-5" aria-live="polite">
        <motion.div
          key={concept.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm font-medium">
              <BookOpen
                className="h-4 w-4 text-muted-foreground"
                strokeWidth={1.75}
              />
              {concept.title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close explanation"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 space-y-2">
            {concept.body.map((paragraph, i) => (
              <p
                key={i}
                className="text-sm leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {concept.lessonHref && (
            <Link
              href={concept.lessonHref}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Open the full lesson
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </motion.div>
      </Card>
    </MotionConfig>
  );
}
