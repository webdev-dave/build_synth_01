"use client";

import type { ReactNode } from "react";

import { RootNotePicker } from "./RootNotePicker";
import { OctaveStepper } from "./OctaveStepper";
import { useScaleLesson } from "./ScaleLessonProvider";
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
  const { rootPc, setRootPc, rootNames, lockToScale, setLockToScale } =
    useScaleLesson();

  return (
    <div className={cn("space-y-3", className)}>
      {root && (
        <RootNotePicker
          value={rootPc}
          onChange={setRootPc}
          names={rootNames}
        />
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
