"use client";

import type { ReactNode } from "react";

import { RootNotePicker } from "@/components/scales/RootNotePicker";
import { OctaveControl } from "@/components/lessons/OctaveControl";
import { useProgression } from "./ProgressionProvider";
import { cn } from "@/lib/utils";

interface ProgressionToolbarProps {
  /** Show the 12-key picker (page-wide state — usually once per page). */
  keyPicker?: boolean;
  /** Show the octave stepper next to a keyboard. */
  octave?: boolean;
  /** Play buttons and other per-widget actions. */
  children?: ReactNode;
  className?: string;
}

/**
 * The control row above a progression widget. The key is page-wide state
 * so the picker usually appears once; the octave stepper belongs beside
 * every keyboard, because the moment the low keys are hard to hear the fix
 * should be where the reader is looking.
 */
export function ProgressionToolbar({
  keyPicker = false,
  octave = false,
  children,
  className,
}: ProgressionToolbarProps) {
  const { keyRootPc, setKeyRootPc, keyNames, keyName, octave: oct, minOctave, maxOctave, shiftOctave } =
    useProgression();

  return (
    <div className={cn("space-y-3", className)}>
      {keyPicker && (
        <RootNotePicker value={keyRootPc} onChange={setKeyRootPc} names={keyNames} />
      )}
      {(children || octave) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {children}
          {octave && (
            <OctaveControl
              rootName={keyName}
              octave={oct}
              minOctave={minOctave}
              maxOctave={maxOctave}
              onShift={shiftOctave}
            />
          )}
        </div>
      )}
    </div>
  );
}
