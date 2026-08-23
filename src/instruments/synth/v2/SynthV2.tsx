"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { NOTES_SHARP } from "@/lib/music";
import { useSharedAudioContext } from "@/hooks/useSharedAudioContext";
import useIsMobile from "@/hooks/useIsMobile";

import {
  useAudioSynthesis,
  type OscillatorType,
} from "../templates/basic-synth/hooks/useAudioSynthesis";
import {
  useScaleLogic,
  type ScaleRoot,
  type ScaleType,
} from "../templates/basic-synth/hooks/useScaleLogic";
import {
  useComputerKeyboard,
  buildNoteToCharMap,
} from "../templates/basic-synth/hooks/useComputerKeyboard";
import { createSynthKeys } from "../templates/basic-synth/utils/synthUtils";
import { KeyboardV2 } from "./KeyboardV2";
import { SYNTH_CONCEPTS, type SynthConceptId } from "./synthConcepts";
import { LearnPanel } from "@/components/learn/LearnPanel";

const WAVE_TYPES: OscillatorType[] = ["sine", "square", "sawtooth", "triangle"];

const SCALE_PATTERNS: Record<Exclude<ScaleType, "none">, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
};

/**
 * v2 synth: the same pure Web Audio engine (oscillator → gain → speakers,
 * no external audio libraries) under a redesigned, theme-token UI.
 */
export function SynthV2() {
  const { audioContext, hasAudioPermission, initializeAudio } =
    useSharedAudioContext();
  const isMobile = useIsMobile();

  const [startOctave, setStartOctave] = useState(4);
  const [visibleOctaves, setVisibleOctaves] = useState(2);
  const keys = useMemo(
    () => createSynthKeys(startOctave, visibleOctaves),
    [startOctave, visibleOctaves]
  );

  // Keep the top key at or below C8 — the highest note on a grand piano.
  const maxStartOctave = Math.max(0, 8 - visibleOctaves);
  useEffect(() => {
    setStartOctave((o) => Math.min(o, maxStartOctave));
  }, [maxStartOctave]);

  const {
    activeKeys,
    activeNoteFreq,
    waveType,
    setWaveType,
    handleNoteStart,
    stopNote,
  } = useAudioSynthesis(audioContext, () => {}, keys);

  // Scale selection — root and type both start unset so the dropdown
  // doesn't look like C is already the key.
  const { setSelectedScale, isNoteInScale, identifyChord } = useScaleLogic();
  const [scaleRoot, setScaleRoot] = useState<ScaleRoot | null>(null);
  const [scaleType, setScaleType] = useState<ScaleType>("none");
  const [lockToScale, setLockToScale] = useState(false);
  const [showDegrees, setShowDegrees] = useState(false);
  const hasScale = scaleRoot !== null && scaleType !== "none";

  /*
   * Playing a key IS the audio consent gesture: unlock on first note instead
   * of gating the instrument behind an overlay. The resume is deliberately
   * not awaited — the voice must be registered synchronously, or a fast tap
   * can release before the note exists and the oscillator never stops.
   */
  const startNote = useCallback(
    (noteNumber: number, note: string) => {
      // The lock applies to every input path, computer keyboard included.
      if (lockToScale && hasScale && !isNoteInScale(noteNumber)) return;
      if (!hasAudioPermission) void initializeAudio();
      void handleNoteStart(noteNumber, note);
    },
    [
      lockToScale,
      hasScale,
      isNoteInScale,
      hasAudioPermission,
      initializeAudio,
      handleNoteStart,
    ]
  );

  useEffect(() => {
    setSelectedScale(
      hasScale && scaleRoot ? `${scaleRoot} ${scaleType}` : "none"
    );
  }, [scaleRoot, scaleType, hasScale, setSelectedScale]);

  const scaleNotes = useMemo(() => {
    if (!scaleRoot || scaleType === "none") return [];
    const rootIdx = NOTES_SHARP.indexOf(scaleRoot);
    return SCALE_PATTERNS[scaleType].map(
      (iv) => NOTES_SHARP[(rootIdx + iv) % 12]
    );
  }, [scaleRoot, scaleType]);

  // Pitch class (0–11) → 1-based scale degree, or null for chromatic notes.
  const degreeMap = useMemo<(number | null)[] | null>(() => {
    if (!scaleRoot || scaleType === "none") return null;
    const rootIdx = NOTES_SHARP.indexOf(scaleRoot);
    const pattern = SCALE_PATTERNS[scaleType];
    return Array.from({ length: 12 }, (_, pitchClass) => {
      const interval = (pitchClass - rootIdx + 12) % 12;
      const idx = pattern.indexOf(interval);
      return idx === -1 ? null : idx + 1;
    });
  }, [scaleRoot, scaleType]);

  // On the keys themselves the degrees are opt-in; the readout always has them.
  const scaleDegrees = showDegrees ? degreeMap : null;

  // Computer keyboard (desktop only). Letters stay off by default — they
  // compete with the note names for the same space and most players don't
  // need them once they've found the home row.
  const [kbEnabled, setKbEnabled] = useState(true);
  const [showKeyLabels, setShowKeyLabels] = useState(false);
  const kbActive = kbEnabled && !isMobile;
  const adjustOctave = useCallback(
    (delta: number) =>
      setStartOctave((o) => Math.max(0, Math.min(maxStartOctave, o + delta))),
    [maxStartOctave]
  );
  useComputerKeyboard(kbActive, keys, startNote, stopNote, adjustOctave);
  const keyLabels = useMemo(
    () => (kbActive && showKeyLabels ? buildNoteToCharMap(keys) : null),
    [kbActive, showKeyLabels, keys]
  );

  // Readout
  const singleNote = activeKeys.size === 1 ? [...activeKeys][0] : null;
  const chord = activeKeys.size > 1 ? identifyChord(activeKeys) : "";
  const singleNoteDegree = useMemo(() => {
    if (!singleNote || !degreeMap) return null;
    const pitchClass = NOTES_SHARP.indexOf(
      singleNote.replace(/\d+$/, "") as ScaleRoot
    );
    return pitchClass === -1 ? null : degreeMap[pitchClass];
  }, [singleNote, degreeMap]);

  /*
   * Learning panel: one shared area below the synth showing the mini-lesson
   * for the last concept clicked. Labels open/toggle it; functional controls
   * (steppers, toggles, selects) only refresh an already-open panel, so
   * simply playing with the synth never forces the panel open.
   */
  const [conceptId, setConceptId] = useState<SynthConceptId | null>(null);
  const toggleConcept = useCallback(
    (id: SynthConceptId) => setConceptId((c) => (c === id ? null : id)),
    []
  );
  const touchConcept = useCallback(
    (id: SynthConceptId) => setConceptId((c) => (c === null ? null : id)),
    []
  );
  const selectedConcept = useMemo(() => {
    if (!conceptId) return null;
    const c = SYNTH_CONCEPTS[conceptId];
    return {
      id: c.id,
      title: c.title,
      body: c.body,
      lessonHref: c.lessonSlug ? `/lessons/${c.lessonSlug}` : undefined,
    };
  }, [conceptId]);

  return (
    <div className="space-y-4">
      {/* Readout strip — on mobile the status always sits on its own row.
          Content-dependent wrapping would change the card's height as notes
          play, bouncing the keyboard below it. */}
      <Card className="flex flex-col items-start gap-y-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-x-6">
        <button
          type="button"
          aria-label="Explain this readout"
          onClick={() =>
            toggleConcept(activeKeys.size > 1 ? "chord" : "frequency")
          }
          className="-mx-1.5 flex h-6 items-center rounded-md px-1.5 font-mono text-sm transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-base"
        >
          {singleNote && (
            <>
              <span>{singleNote}</span>
              <span className="ml-3 text-muted-foreground">
                {activeNoteFreq?.toFixed(2)} Hz
              </span>
              {hasScale && (
                <span className="ml-3">
                  {singleNoteDegree !== null ? (
                    <span className="text-emerald-600">
                      {ordinal(singleNoteDegree)} of {scaleRoot} {scaleType}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      outside {scaleRoot} {scaleType}
                    </span>
                  )}
                </span>
              )}
            </>
          )}
          {activeKeys.size > 1 &&
            (chord && chord !== "Unknown" ? (
              <span>{chord}</span>
            ) : (
              <span className="text-muted-foreground">
                {activeKeys.size} notes
              </span>
            ))}
          {activeKeys.size === 0 && (
            <span className="text-muted-foreground/50">—</span>
          )}
        </button>
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              hasAudioPermission
                ? "bg-emerald-600"
                : "bg-orange-600 motion-safe:animate-pulse"
            )}
          />
          {hasAudioPermission ? "sound on" : "sound off — play a key to enable"}
        </div>
      </Card>

      {/* Keyboard */}
      <Card className="overflow-x-auto p-3">
        <KeyboardV2
          keys={keys}
          activeKeys={activeKeys}
          hasScale={hasScale}
          lockToScale={lockToScale}
          isNoteInScale={isNoteInScale}
          scaleDegrees={scaleDegrees}
          keyLabels={keyLabels}
          onNoteStart={startNote}
          onNoteStop={stopNote}
        />
      </Card>

      {/* Controls */}
      <Card className="flex flex-wrap gap-x-10 gap-y-5 px-4 py-4 sm:px-5">
        <Field
          label="Waveform"
          onLabelClick={() => toggleConcept("waveform")}
          labelSelected={conceptId === "waveform"}
        >
          <Segmented
            ariaLabel="Waveform"
            value={waveType}
            onChange={(w) => {
              setWaveType(w);
              touchConcept("waveform");
            }}
            options={WAVE_TYPES.map((w) => ({
              value: w,
              label: (
                <span className="flex items-center gap-1.5">
                  <WaveGlyph type={w} />
                  <span className="hidden sm:inline">{w}</span>
                </span>
              ),
            }))}
          />
        </Field>

        <Field
          label="Octave"
          onLabelClick={() => toggleConcept("octave")}
          labelSelected={conceptId === "octave"}
        >
          <Stepper
            value={`C${startOctave}`}
            onDecrement={() => {
              adjustOctave(-1);
              touchConcept("octave");
            }}
            onIncrement={() => {
              adjustOctave(1);
              touchConcept("octave");
            }}
            decrementDisabled={startOctave <= 0}
            incrementDisabled={startOctave >= maxStartOctave}
            decrementLabel="Octave down"
            incrementLabel="Octave up"
          />
        </Field>

        <Field
          label="Range"
          onLabelClick={() => toggleConcept("range")}
          labelSelected={conceptId === "range"}
        >
          <Stepper
            value={`${visibleOctaves} oct`}
            onDecrement={() => {
              setVisibleOctaves((v) => Math.max(1, v - 1));
              touchConcept("range");
            }}
            onIncrement={() => {
              setVisibleOctaves((v) => Math.min(4, v + 1));
              touchConcept("range");
            }}
            decrementDisabled={visibleOctaves <= 1}
            incrementDisabled={visibleOctaves >= 4}
            decrementLabel="Fewer octaves"
            incrementLabel="More octaves"
          />
        </Field>

        <Field
          label="Scale"
          onLabelClick={() => toggleConcept("scale")}
          labelSelected={conceptId === "scale"}
        >
          <select
            aria-label="Scale root"
            value={scaleRoot ?? ""}
            onChange={(e) => {
              const next = e.target.value;
              touchConcept("scale");
              if (next === "") {
                setScaleRoot(null);
                setScaleType("none");
                setLockToScale(false);
                setShowDegrees(false);
                return;
              }
              setScaleRoot(next as ScaleRoot);
              // Picking a root is the on-switch; default to major.
              if (scaleType === "none") setScaleType("major");
            }}
            className="h-[30px] rounded-md border border-input bg-background px-2 font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">—</option>
            {NOTES_SHARP.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <Segmented
            ariaLabel="Scale type"
            value={scaleType}
            onChange={(t) => {
              setScaleType(t);
              touchConcept("scale");
            }}
            options={[
              {
                value: "major" as ScaleType,
                label: "major",
                disabled: scaleRoot === null,
              },
              {
                value: "minor" as ScaleType,
                label: "minor",
                disabled: scaleRoot === null,
              },
            ]}
          />
          <Toggle
            pressed={lockToScale}
            onClick={() => {
              setLockToScale((v) => !v);
              touchConcept("scale-lock");
            }}
            disabled={!hasScale}
          >
            lock
          </Toggle>
          <Toggle
            pressed={showDegrees}
            onClick={() => {
              setShowDegrees((v) => !v);
              touchConcept("scale-degrees");
            }}
            disabled={!hasScale}
          >
            degrees
          </Toggle>
        </Field>

        {!isMobile && (
          <Field
            label="Computer keys"
            onLabelClick={() => toggleConcept("computer-keys")}
            labelSelected={conceptId === "computer-keys"}
          >
            <Toggle
              pressed={kbEnabled}
              onClick={() => {
                setKbEnabled((v) => !v);
                touchConcept("computer-keys");
              }}
            >
              {kbEnabled ? "on" : "off"}
            </Toggle>
            <Toggle
              pressed={showKeyLabels}
              onClick={() => {
                setShowKeyLabels((v) => !v);
                touchConcept("computer-keys");
              }}
              disabled={!kbActive}
            >
              show letters
            </Toggle>
            {kbActive && (
              <span className="font-mono text-[11px] text-muted-foreground">
                A–&apos; white · W–P black · Z/X octave
              </span>
            )}
          </Field>
        )}
      </Card>

      {/* Scale readout: marked keys carry a dot on the keyboard */}
      {hasScale && (
        <p className="px-1 font-mono text-xs text-muted-foreground">
          <span className="text-foreground">
            {scaleRoot} {scaleType}
          </span>
          {" · "}
          {scaleNotes.join("  ")}
          {" · "}
          {showDegrees ? (
            <>
              <span className="text-emerald-600">1–7</span> mark the scale
              degrees
            </>
          ) : (
            <>
              <span className="inline-block h-2 w-2 translate-y-px rounded-full bg-emerald-600" />{" "}
              in the scale
            </>
          )}{" "}
          · grayed keys are outside
          {lockToScale && (
            <>
              {" · "}
              <span className="inline-block h-2 w-2 translate-y-px rounded-full bg-red-500" />{" "}
              locked
            </>
          )}
        </p>
      )}

      {/* Learning area — shared, shows the last concept clicked */}
      <LearnPanel
        concept={selectedConcept}
        onClose={() => setConceptId(null)}
      />
    </div>
  );
}

/** 1 → "1st", 2 → "2nd", 3 → "3rd", 4+ → "4th"… (scales only reach 7) */
function ordinal(degree: number): string {
  const suffix =
    degree === 1 ? "st" : degree === 2 ? "nd" : degree === 3 ? "rd" : "th";
  return `${degree}${suffix}`;
}

/* ---------- small local controls ---------- */

function Field({
  label,
  children,
  onLabelClick,
  labelSelected,
}: {
  label: string;
  children: ReactNode;
  /** When set, the label becomes a button that opens the learning panel. */
  onLabelClick?: () => void;
  labelSelected?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      {onLabelClick ? (
        <button
          type="button"
          onClick={onLabelClick}
          aria-expanded={labelSelected}
          aria-label={`What is "${label}"?`}
          className={cn(
            "rounded-sm text-[11px] font-medium uppercase tracking-wider underline decoration-dotted underline-offset-4 transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            labelSelected
              ? "text-foreground decoration-solid"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {label}
        </button>
      ) : (
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode; disabled?: boolean }[];
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex overflow-hidden rounded-md border border-input"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          disabled={o.disabled}
          onClick={() => onChange(o.value)}
          className={cn(
            "border-l border-input px-2.5 py-1.5 text-xs font-medium transition-colors first:border-l-0",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:pointer-events-none disabled:opacity-40",
            value === o.value
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Stepper({
  value,
  onDecrement,
  onIncrement,
  decrementDisabled,
  incrementDisabled,
  decrementLabel,
  incrementLabel,
}: {
  value: string;
  onDecrement: () => void;
  onIncrement: () => void;
  decrementDisabled?: boolean;
  incrementDisabled?: boolean;
  decrementLabel: string;
  incrementLabel: string;
}) {
  const btn =
    "px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <div className="inline-flex items-center overflow-hidden rounded-md border border-input">
      <button
        type="button"
        aria-label={decrementLabel}
        onClick={onDecrement}
        disabled={decrementDisabled}
        className={btn}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-12 border-x border-input px-2 text-center font-mono text-xs">
        {value}
      </span>
      <button
        type="button"
        aria-label={incrementLabel}
        onClick={onIncrement}
        disabled={incrementDisabled}
        className={btn}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function Toggle({
  pressed,
  onClick,
  disabled,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-md border border-input px-2.5 py-1.5 text-xs font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-40",
        pressed
          ? "bg-secondary text-secondary-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

/** Tiny oscilloscope-style glyphs for the four primitive waveforms. */
function WaveGlyph({ type }: { type: OscillatorType }) {
  const paths: Record<OscillatorType, string> = {
    sine: "M1 8 Q4.5 0 8 8 T15 8",
    square: "M1 12 V4 H8 V12 H15 V4",
    sawtooth: "M1 12 L8 4 V12 L15 4",
    triangle: "M1 12 L4.5 4 L11.5 12 L15 4",
  };
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[type]} />
    </svg>
  );
}
