"use client";

import { useCallback, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { niceNote } from "@/lib/music";
import type { SynthKey } from "../templates/basic-synth/utils/synthUtils";

interface KeyboardV2Props {
  keys: SynthKey[];
  activeKeys: Set<string>;
  /** Whether a scale is currently selected (drives the in-scale dots) */
  hasScale: boolean;
  /** When true, out-of-scale keys are dimmed and unplayable */
  lockToScale: boolean;
  isNoteInScale: (noteNumber: number) => boolean;
  /** Pitch class (0–11) → 1-based scale degree; null entries are chromatic.
      When provided, in-scale keys show their degree instead of the dot. */
  scaleDegrees: (number | null)[] | null;
  /** note → computer-keyboard character, or null when labels are off */
  keyLabels: Record<string, string> | null;
  onNoteStart: (noteNumber: number, note: string) => void;
  onNoteStop: (note: string) => void;
}

/**
 * The v2 piano keyboard. Purely presentational: sound comes from the
 * useAudioSynthesis hook via the onNoteStart/onNoteStop callbacks.
 *
 * Keys keep literal white/black shades (a piano key's color is semantic,
 * not decorative); the active state is the burnt-orange accent.
 */
export function KeyboardV2({
  keys,
  activeKeys,
  hasScale,
  lockToScale,
  isNoteInScale,
  scaleDegrees,
  keyLabels,
  onNoteStart,
  onNoteStop,
}: KeyboardV2Props) {
  // One entry per touch/mouse pointer so multi-touch chords and glides work.
  const pointerNotes = useRef<Map<number, string>>(new Map());
  const stopRef = useRef(onNoteStop);
  useEffect(() => {
    stopRef.current = onNoteStop;
  }, [onNoteStop]);

  // Pointers can be released anywhere (even outside the keyboard),
  // so note-off listens on window.
  useEffect(() => {
    const release = (e: PointerEvent) => {
      const note = pointerNotes.current.get(e.pointerId);
      if (note !== undefined) {
        pointerNotes.current.delete(e.pointerId);
        stopRef.current(note);
      }
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, []);

  const isDisabled = useCallback(
    (k: SynthKey) => hasScale && lockToScale && !isNoteInScale(k.noteNumber),
    [hasScale, lockToScale, isNoteInScale],
  );

  const pressKey = (e: React.PointerEvent, k: SynthKey) => {
    if (isDisabled(k)) return;
    // Undo the browser's implicit capture so the pointer can glide to other keys.
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    pointerNotes.current.set(e.pointerId, k.note);
    onNoteStart(k.noteNumber, k.note);
  };

  const glideKey = (e: React.PointerEvent, k: SynthKey) => {
    const prev = pointerNotes.current.get(e.pointerId);
    if (prev === undefined || prev === k.note || isDisabled(k)) return;
    onNoteStop(prev);
    pointerNotes.current.set(e.pointerId, k.note);
    onNoteStart(k.noteNumber, k.note);
  };

  const keyA11yHandlers = (k: SynthKey) => ({
    onKeyDown: (e: React.KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && !e.repeat) {
        e.preventDefault();
        if (!isDisabled(k)) onNoteStart(k.noteNumber, k.note);
      }
    },
    onKeyUp: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onNoteStop(k.note);
      }
    },
  });

  // Geometry: white keys split the row evenly; each black key is centered on
  // the boundary between the two whites it sits between.
  const whiteKeys = keys.filter((k) => !k.isBlack);
  const whiteCount = whiteKeys.length;
  const blackKeys: { key: SynthKey; leftPct: number }[] = [];
  let whitesSeen = 0;
  for (const k of keys) {
    if (k.isBlack) {
      blackKeys.push({ key: k, leftPct: (whitesSeen / whiteCount) * 100 });
    } else {
      whitesSeen += 1;
    }
  }
  const blackWidthPct = (0.6 / whiteCount) * 100;

  return (
    <div
      role="group"
      aria-label="Synth keyboard"
      // Long-pressing a key must not open the browser context menu (Android)
      // or the copy/share callout (iOS) — holding a note is normal playing.
      onContextMenu={(e) => e.preventDefault()}
      // No min-width: the parent decides how many octaves fit, and below a
      // single octave the keys shrink rather than overflow — touch-none keys
      // swallow swipes, so a horizontally scrollable keyboard is unreachable
      // on mobile.
      className="relative h-44 touch-none select-none [-webkit-touch-callout:none] sm:h-52"
    >
      <div className="flex h-full">
        {whiteKeys.map((k) => {
          const active = activeKeys.has(k.note);
          const disabled = isDisabled(k);
          const inScale = hasScale && isNoteInScale(k.noteNumber);
          const outOfScale = hasScale && !inScale;
          const label = keyLabels?.[k.note];
          const degree = scaleDegrees?.[k.noteNumber % 12] ?? null;
          // Every key names itself; C keys keep the octave for orientation.
          const baseName = k.note.replace(/\d+$/, "");
          const noteName = baseName === "C" ? k.note : baseName;
          return (
            <button
              key={k.note}
              type="button"
              aria-label={`Play ${k.note}`}
              aria-disabled={disabled || undefined}
              tabIndex={disabled ? -1 : 0}
              onPointerDown={(e) => {
                e.preventDefault();
                pressKey(e, k);
              }}
              onPointerEnter={(e) => glideKey(e, k)}
              {...keyA11yHandlers(k)}
              className={cn(
                "relative flex-1 rounded-b border border-neutral-950/60 transition-colors duration-75",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                active
                  ? "border-orange-800 bg-orange-700"
                  : outOfScale
                    ? // Out-of-key whites fade toward gray so the scale shape
                      // reads at a glance, even while still playable.
                      "bg-neutral-400 hover:bg-neutral-300"
                    : "bg-neutral-100 hover:bg-white",
                disabled && "cursor-not-allowed hover:bg-neutral-400",
              )}
            >
              {/* Fixed-height text band, so the dot above it never shifts. */}
              <span className="pointer-events-none absolute inset-x-0 bottom-1.5 flex h-6 flex-col items-center justify-end gap-0.5">
                {label && (
                  <span
                    className={cn(
                      "font-mono text-[10px] leading-none",
                      active
                        ? "text-orange-100"
                        : outOfScale
                          ? "text-neutral-600"
                          : "text-neutral-500",
                    )}
                  >
                    {label}
                  </span>
                )}
                <span
                  className={cn(
                    "font-mono text-[11px] font-medium leading-none",
                    active ? "text-orange-100" : "text-neutral-700",
                  )}
                >
                  {noteName}
                </span>
              </span>
              {inScale &&
                !active &&
                (degree !== null ? (
                  <span
                    className={cn(
                      "pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] leading-none text-emerald-700",
                      degree === 1 && "font-bold",
                    )}
                  >
                    {degree}
                  </span>
                ) : (
                  <span className="pointer-events-none absolute bottom-9 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-600" />
                ))}
              {/* Locked out of the scale: red dot instead of darkening. */}
              {disabled && (
                <span className="pointer-events-none absolute bottom-9 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0">
        {blackKeys.map(({ key: k, leftPct }) => {
          const active = activeKeys.has(k.note);
          const disabled = isDisabled(k);
          const inScale = hasScale && isNoteInScale(k.noteNumber);
          const outOfScale = hasScale && !inScale;
          const label = keyLabels?.[k.note];
          const degree = scaleDegrees?.[k.noteNumber % 12] ?? null;
          // "C#4" → "C♯" (the synth speaks sharps; octave stays off the
          // narrow black keys).
          const noteName = niceNote(k.note.replace(/\d+$/, ""));
          return (
            <button
              key={k.note}
              type="button"
              aria-label={`Play ${k.note}`}
              aria-disabled={disabled || undefined}
              tabIndex={disabled ? -1 : 0}
              onPointerDown={(e) => {
                e.preventDefault();
                pressKey(e, k);
              }}
              onPointerEnter={(e) => glideKey(e, k)}
              {...keyA11yHandlers(k)}
              style={{ left: `${leftPct}%`, width: `${blackWidthPct}%` }}
              className={cn(
                "pointer-events-auto absolute top-0 h-[62%] -translate-x-1/2 rounded-b border transition-colors duration-75",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "border-orange-600 bg-orange-700"
                  : outOfScale
                    ? // Out-of-key blacks wash out toward mid-gray (mirrors the
                      // faded whites) so the whole key reads as chromatic.
                      "border-neutral-500 bg-neutral-600 hover:bg-neutral-500"
                    : "border-neutral-700 bg-neutral-900 hover:bg-neutral-800",
                disabled && "cursor-not-allowed hover:bg-neutral-600",
              )}
            >
              <span className="pointer-events-none absolute inset-x-0 bottom-1.5 flex h-6 flex-col items-center justify-end gap-0.5">
                {label && (
                  <span
                    className={cn(
                      "font-mono text-[9px] leading-none",
                      active
                        ? "text-orange-100"
                        : outOfScale
                          ? "text-neutral-800"
                          : "text-neutral-400",
                    )}
                  >
                    {label}
                  </span>
                )}
                <span
                  className={cn(
                    "font-mono text-[10px] font-medium leading-none",
                    active
                      ? "text-orange-100"
                      : outOfScale
                        ? "text-neutral-900"
                        : "text-neutral-300",
                  )}
                >
                  {noteName}
                </span>
              </span>
              {inScale &&
                !active &&
                (degree !== null ? (
                  <span
                    className={cn(
                      "pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] leading-none text-emerald-500",
                      degree === 1 && "font-bold",
                    )}
                  >
                    {degree}
                  </span>
                ) : (
                  <span className="pointer-events-none absolute bottom-8 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-emerald-500" />
                ))}
              {disabled && (
                <span className="pointer-events-none absolute bottom-8 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
