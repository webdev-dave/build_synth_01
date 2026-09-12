"use client";

import { useMemo, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { RootNotePicker } from "./RootNotePicker";
import { OctaveStepper } from "./OctaveStepper";
import { useScaleLesson } from "./ScaleLessonProvider";
import { typeIdForDegrees } from "@/lib/music/scaleCatalog";
import { synthHrefFor } from "@/lib/music/scaleParam";
import { APP_ICONS } from "@/lib/appIcons";
import { cn } from "@/lib/utils";

interface LessonToolbarProps {
  /** Show the 12-root picker (page-wide state — usually only once per page). */
  root?: boolean;
  /** Show the octave stepper. Every embedded keyboard should offer one. */
  octave?: boolean;
  /** Show the lock toggle (page-wide state). */
  lock?: boolean;
  /** Play buttons and other per-widget actions. */
  children?: ReactNode;
  className?: string;
}

/**
 * The control row above a lesson keyboard. Root and lock are page-wide state
 * so they usually appear once; the octave stepper belongs next to *every*
 * embedded keyboard, because the moment a user can't hear the low keys they
 * need the fix where they are, not three sections up.
 */
export function LessonToolbar({
  root = false,
  octave = true,
  lock = false,
  children,
  className,
}: LessonToolbarProps) {
  const { rootPc, setRootPc, rootNames, degrees, lockToScale, setLockToScale } =
    useScaleLesson();

  // "Try it on the synth" carries the reader's *current* root, so someone
  // who moved the lesson to E Dorian lands on E Dorian. Only next to the
  // root picker — once per page, where the root lives.
  const typeId = useMemo(() => typeIdForDegrees(degrees), [degrees]);
  const synthHref = root && typeId ? synthHrefFor(rootPc, typeId) : null;
  const SynthIcon = APP_ICONS.synth;

  return (
    <div className={cn("space-y-3", className)}>
      {root && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <RootNotePicker
            value={rootPc}
            onChange={setRootPc}
            names={rootNames}
          />
          {synthHref && (
            <Link
              href={synthHref}
              className="ms-auto inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <SynthIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
              Try it on the synth
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {children}
        {octave && <OctaveStepper />}
        {lock && (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={!lockToScale}
              onChange={(e) => setLockToScale(!e.target.checked)}
              className="h-3.5 w-3.5 accent-emerald-600"
            />
            Unlock other notes
          </label>
        )}
      </div>
    </div>
  );
}
