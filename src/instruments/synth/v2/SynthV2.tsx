"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { NOTES_SHARP, niceNote } from "@/lib/music";
import {
  SCALE_CATALOG,
  degreeLabelMap,
  detuneMapFor,
  hasQuarterTones,
  pitchClassInScale,
  relatedScale,
  rootNameFor,
  scaleTypesByGroup,
  namedWithArticle,
  sentenceName,
  simpleName,
  spellScale,
  type ScaleTypeId,
} from "@/lib/music/scaleCatalog";
import { NO_DETUNE } from "@/lib/music/detune";
import { formatScaleParam, parseScaleParam } from "@/lib/music/scaleParam";
import { getScaleByPatternKey } from "@/lib/scales/registry";
import { useSharedAudioContext } from "@/hooks/useSharedAudioContext";
import useIsMobile from "@/hooks/useIsMobile";
import { useElementWidth } from "@/hooks/useElementWidth";

import {
  useAudioSynthesis,
  type OscillatorType,
} from "../templates/basic-synth/hooks/useAudioSynthesis";
import { useScaleLogic } from "../templates/basic-synth/hooks/useScaleLogic";
import {
  useComputerKeyboard,
  buildNoteToCharMap,
} from "../templates/basic-synth/hooks/useComputerKeyboard";
import {
  createSynthKeysFromRange,
  noteNameToNumber,
} from "../templates/basic-synth/utils/synthUtils";
import { KeyboardV2 } from "./KeyboardV2";
import { SYNTH_CONCEPTS, type SynthConceptId } from "./synthConcepts";
import { LearnPanel } from "@/components/learn/LearnPanel";

const WAVE_TYPES: OscillatorType[] = ["sine", "square", "sawtooth", "triangle"];

const SCALE_GROUPS = scaleTypesByGroup();

const mod12 = (n: number) => ((n % 12) + 12) % 12;

/**
 * Root options read both names on the black keys ("C♯ / D♭") so a user
 * hunting for B♭ finds it without the list renaming itself as the scale
 * type changes. Everywhere else the root is spelled the way the chosen
 * scale spells it.
 */
const ROOT_OPTIONS = NOTES_SHARP.map((sharp, pc) => ({
  pc,
  label: sharp.includes("#") ? `${niceNote(sharp)} / ${simpleName(pc)}` : sharp,
}));

const MAX_OCTAVES = 4;

/** Root and type selects match: one "Scale" phrase, `[D] [Dorian]`. */
const selectClass =
  "h-[30px] rounded-md border border-input bg-background px-2 font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40";

/*
 * The thinnest a white key gets before we drop an octave instead — roughly
 * the two-octave density the keyboard used to enforce with a fixed 560px
 * min-width. The keyboard never overflow-scrolls: its keys are touch-none
 * (a swipe is a glide, not a scroll), so on mobile an overflowing keyboard
 * is simply unreachable. Fewer, same-sized keys beat hidden ones.
 */
const MIN_WHITE_KEY_PX = 36;

interface SynthV2Props {
  /**
   * Honour `?scale=D-dorian` in the page URL — a lesson's "Try it on the
   * synth" lands with the scale preselected. Read once after mount (the
   * page is a static export, so there is no server to read it); the synth
   * is user-driven after that and never writes the URL back.
   */
  readScaleFromUrl?: boolean;
}

/**
 * v2 synth: the same pure Web Audio engine (oscillator → gain → speakers,
 * no external audio libraries) under a redesigned, theme-token UI.
 */
export function SynthV2({ readScaleFromUrl = false }: SynthV2Props = {}) {
  const { audioContext, hasAudioPermission, initializeAudio } =
    useSharedAudioContext();
  const isMobile = useIsMobile();

  const [startOctave, setStartOctave] = useState(4);
  const [visibleOctaves, setVisibleOctaves] = useState(2);

  // Scale selection — root and type both start unset so the dropdown
  // doesn't look like C is already the key. (Declared before the keyboard
  // window because the scale root anchors it.)
  const { identifyChord } = useScaleLogic();
  const [rootPc, setRootPc] = useState<number | null>(null);
  const [typeId, setTypeId] = useState<ScaleTypeId | null>(null);
  const [lockToScale, setLockToScale] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const hasScale = rootPc !== null && typeId !== null;
  const scale = typeId !== null ? SCALE_CATALOG[typeId] : null;

  // Membership straight from the catalog: the same table the lesson pages
  // read, so the green and red dots here can't disagree with them.
  const isNoteInScale = useCallback(
    (noteNumber: number) =>
      rootPc === null ||
      typeId === null ||
      pitchClassInScale(rootPc, typeId, noteNumber % 12),
    [rootPc, typeId],
  );

  /*
   * Picking a scale re-frames the keyboard around its root: the window runs
   * root-to-root so the degrees read 1–7 left to right and both ends land on
   * home base. A C-anchored octave can't even hold some scales in full
   * (D major's 7th, C#, sits above the top C). With no scale the window is
   * C-anchored as on a real piano.
   */
  const anchorPc = rootPc ?? 0;
  const anchorName = NOTES_SHARP[anchorPc];
  // A piano row can't start or end on a black key, so a black-key root
  // borrows the white key below as a lead-in (and the one above as lead-out).
  const anchorIsBlack = anchorName.includes("#");
  // The root as this scale spells it — the same key is B♭ for major, G♯ for
  // Phrygian dominant, A♭ for Ukrainian Dorian.
  const rootName =
    rootPc === null
      ? null
      : scale
        ? rootNameFor(rootPc, scale.degrees)
        : niceNote(anchorName);
  const scaleLabel =
    rootName && scale && typeId ? `${rootName} ${sentenceName(typeId)}` : null;

  // How many octaves the keyboard area can hold at a playable key width.
  // n octaves render 7n + 1 white keys (the trailing root), plus one more
  // when a black-key root adds its lead-in/lead-out whites.
  const { ref: keyboardAreaRef, width: keyboardWidth } =
    useElementWidth<HTMLDivElement>();
  const maxFitOctaves = useMemo(() => {
    if (keyboardWidth === null) return MAX_OCTAVES; // not measured yet
    const edgeWhites = anchorIsBlack ? 2 : 1;
    const whitesThatFit = Math.floor(keyboardWidth / MIN_WHITE_KEY_PX);
    return Math.max(
      1,
      Math.min(MAX_OCTAVES, Math.floor((whitesThatFit - edgeWhites) / 7)),
    );
  }, [keyboardWidth, anchorIsBlack]);

  // Auto-shrink the range when the screen can't fit it (and keep the
  // stepper from pushing past capacity — see incrementDisabled below).
  // Below one octave we stop dropping range and let the keys themselves
  // shrink: a scrollable keyboard is useless when keys eat the swipe.
  useEffect(() => {
    setVisibleOctaves((v) => Math.min(v, maxFitOctaves));
  }, [maxFitOctaves]);

  // Screen-cap hint: only after a click on the greyed plus, not merely
  // because the range is already at capacity.
  const atScreenCap =
    maxFitOctaves < MAX_OCTAVES && visibleOctaves >= maxFitOctaves;
  const [showMaxFitHint, setShowMaxFitHint] = useState(false);
  const maxFitHintTimer = useRef<number | null>(null);
  const flashMaxFitHint = useCallback(() => {
    setShowMaxFitHint(true);
    if (maxFitHintTimer.current !== null) {
      window.clearTimeout(maxFitHintTimer.current);
    }
    maxFitHintTimer.current = window.setTimeout(() => {
      setShowMaxFitHint(false);
      maxFitHintTimer.current = null;
    }, 2500);
  }, []);
  useEffect(() => {
    if (!atScreenCap) setShowMaxFitHint(false);
  }, [atScreenCap]);
  useEffect(
    () => () => {
      if (maxFitHintTimer.current !== null) {
        window.clearTimeout(maxFitHintTimer.current);
      }
    },
    [],
  );

  const anchorMidi = noteNameToNumber(`${anchorName}${startOctave}`);
  const windowStart = anchorIsBlack ? anchorMidi - 1 : anchorMidi;
  const windowTop = anchorMidi + 12 * visibleOctaves;
  const windowEnd = anchorIsBlack ? windowTop + 1 : windowTop;
  const keys = useMemo(
    () => createSynthKeysFromRange(windowStart, windowEnd),
    [windowStart, windowEnd],
  );

  // Keep the top key at or below C8 (MIDI 108) — the highest note on a
  // grand piano. Solves windowEnd ≤ 108 for the anchor's octave number.
  const maxStartOctave = Math.max(
    0,
    Math.floor((108 - anchorPc - (anchorIsBlack ? 1 : 0)) / 12) -
      1 -
      visibleOctaves,
  );
  useEffect(() => {
    setStartOctave((o) => Math.min(o, maxStartOctave));
  }, [maxStartOctave]);

  const {
    activeKeys,
    activeNoteFreq,
    waveType,
    setWaveType,
    detuneCents,
    setDetuneCents,
    handleNoteStart,
    stopNote,
  } = useAudioSynthesis(audioContext, () => {}, keys);

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
    ],
  );

  /*
   * A quarter-tone scale (Rast) presses its switches on the tuning strip the
   * way a lesson page does, and leaving it for an ordinary scale releases
   * them. Only switches the scale itself pressed are released — a strip the
   * user set by hand while no scale was chosen is theirs to keep.
   */
  const pressedByScale = useRef(false);
  useEffect(() => {
    if (rootPc !== null && scale && hasQuarterTones(scale.degrees)) {
      setDetuneCents(detuneMapFor(rootPc, scale.degrees));
      pressedByScale.current = true;
    } else if (pressedByScale.current) {
      setDetuneCents(NO_DETUNE);
      pressedByScale.current = false;
    }
  }, [rootPc, scale, setDetuneCents]);

  // Root-first note names of the current scale ("D E F♯ G A B C♯"),
  // spelled one letter per degree.
  const scaleNoteNames = useMemo(
    () =>
      rootPc !== null && typeId !== null
        ? spellScale(rootPc, typeId).join(" ")
        : null,
    [rootPc, typeId],
  );

  // The one scale that shares this one's exact note set: a mode's parent
  // major, Phrygian dominant's harmonic minor, a major key's relative minor.
  // Data on the catalog, so no scale gets a relationship invented for it.
  const related = useMemo(() => {
    if (rootPc === null || typeId === null) return null;
    const rel = relatedScale(typeId);
    if (!rel) return null;
    const targetPc = mod12(rootPc + rel.offsetSemitones);
    const target = SCALE_CATALOG[rel.scaleId];
    return {
      rootPc: targetPc,
      typeId: rel.scaleId,
      name: `${rootNameFor(targetPc, target.degrees)} ${sentenceName(rel.scaleId)}`,
      label: rel.label,
    };
  }, [rootPc, typeId]);

  // Pitch class (0–11) → degree label ("♭3"), or null for chromatic notes.
  const degreeMap = useMemo<(string | null)[] | null>(
    () =>
      rootPc !== null && typeId !== null
        ? degreeLabelMap(rootPc, typeId)
        : null,
    [rootPc, typeId],
  );

  // On the keys themselves the numbers are opt-in; the readout always has them.
  const scaleDegrees = showNumbers ? degreeMap : null;

  // Computer keyboard (desktop only). Playing starts off so typing and
  // page shortcuts don't accidentally trigger notes. Letters stay off
  // too — they compete with the note names for the same space.
  const [kbEnabled, setKbEnabled] = useState(false);
  const [showKeyLabels, setShowKeyLabels] = useState(false);
  const kbActive = kbEnabled && !isMobile;
  const adjustOctave = useCallback(
    (delta: number) =>
      setStartOctave((o) => Math.max(0, Math.min(maxStartOctave, o + delta))),
    [maxStartOctave],
  );
  useComputerKeyboard(kbActive, keys, startNote, stopNote, adjustOctave);
  const keyLabels = useMemo(
    () => (kbActive && showKeyLabels ? buildNoteToCharMap(keys) : null),
    [kbActive, showKeyLabels, keys],
  );

  // Readout
  const singleNote = activeKeys.size === 1 ? [...activeKeys][0] : null;
  const chord = activeKeys.size > 1 ? identifyChord(activeKeys) : "";
  const singleNoteDegree = useMemo(() => {
    if (!singleNote || !degreeMap) return null;
    const pitchClass = (NOTES_SHARP as readonly string[]).indexOf(
      singleNote.replace(/\d+$/, ""),
    );
    return pitchClass === -1 ? null : degreeMap[pitchClass];
  }, [singleNote, degreeMap]);

  // The page that teaches the selected scale — the panel's "read more".
  const scalePage = typeId !== null ? getScaleByPatternKey(typeId) : undefined;

  /*
   * Learning panel: one shared area below the synth showing the mini-lesson
   * for the last concept clicked. Labels open/toggle it — as does the numbers
   * overlay, since showing the numbers is itself the lesson. The remaining
   * functional controls (steppers, sound toggles, selects) only refresh an
   * already-open panel, so simply playing with the synth never forces it open.
   */
  const [conceptId, setConceptId] = useState<SynthConceptId | null>(null);

  /*
   * Every scale change goes through here so the URL can't drift from the
   * keyboard: `?scale=D-dorian` is rewritten in place (replaceState — no
   * navigation, no history entry, no scroll jump) and removed when the
   * scale is cleared. Copying the address bar always shares what's on
   * screen. Only when the page owns the URL; an embedded synth leaves it.
   */
  const commitScale = useCallback(
    (nextRoot: number | null, nextType: ScaleTypeId | null) => {
      setRootPc(nextRoot);
      setTypeId(nextType);
      if (!readScaleFromUrl || typeof window === "undefined") return;
      const url = new URL(window.location.href);
      if (nextRoot !== null && nextType !== null) {
        url.searchParams.set("scale", formatScaleParam(nextRoot, nextType));
      } else {
        url.searchParams.delete("scale");
      }
      window.history.replaceState(window.history.state, "", url);
    },
    [readScaleFromUrl],
  );

  // A deep link arrives like a user who picked root and type: numbers on,
  // the selected-scale card open. A bad or missing param changes nothing.
  useEffect(() => {
    if (!readScaleFromUrl) return;
    const linked = parseScaleParam(
      new URLSearchParams(window.location.search).get("scale"),
    );
    if (!linked) return;
    setRootPc(linked.rootPc);
    setTypeId(linked.typeId);
    setShowNumbers(true);
    setConceptId("scale-type");
  }, [readScaleFromUrl]);
  const toggleConcept = useCallback(
    (id: SynthConceptId) => setConceptId((c) => (c === id ? null : id)),
    [],
  );
  const touchConcept = useCallback(
    (id: SynthConceptId) => setConceptId((c) => (c === null ? null : id)),
    [],
  );
  const selectedConcept = useMemo(() => {
    if (!conceptId) return null;
    const c = SYNTH_CONCEPTS[conceptId];

    // The selected-scale card is data, not prose: everything below comes
    // from the catalog + scale registry, so a new catalog entry shows up
    // here with nothing to write.
    if (c.id === "scale-type") {
      // Nothing chosen yet: the label explains what the dropdown is for.
      if (!scale || !scaleLabel || !scaleNoteNames || rootPc === null) {
        return {
          id: c.id,
          title: c.title,
          body: c.body,
          lessonHref: c.lessonHref,
          lessonLabel: "Browse all scales",
        };
      }
      const body: string[] = [];
      body.push(
        scale.aliases?.length
          ? `${scale.feel}. Also called ${scale.aliases.join(", ")}.`
          : `${scale.feel}.`,
      );
      if (related) {
        body.push(
          `Same notes as ${related.name} — ${lowerFirst(related.label)}. Click the link next to the Type label to switch: the marked keys stay put and the numbers re-count from the new home.`,
        );
      }
      if (hasQuarterTones(scale.degrees)) {
        body.push(
          "This scale has quarter tones, so the tuning strip under the keys has pressed the switches that bend them — a quarter tone (−50¢) is the keyboard convention; players tune the real thing by ear.",
        );
      }
      return {
        id: c.id,
        title: scaleLabel,
        body,
        facts: [
          { label: "Notes", value: scaleNoteNames },
          {
            label: "Degrees",
            value: scale.degrees.map((deg) => deg.label).join(" "),
          },
        ],
        lessonHref: scalePage ? `/scales/${scalePage.slug}` : undefined,
        lessonLabel: scalePage
          ? `Read about ${namedWithArticle(scale.id, scalePage.name)}`
          : undefined,
      };
    }

    // The generic scale lesson opens anchored to what's on screen.
    const body =
      c.id === "scale" && scaleLabel && scaleNoteNames
        ? [
            `Your current scale is ${scaleLabel}, made of ${scaleNoteNames}. Pick a different type in the second dropdown to see how the pattern changes on the same root.`,
            ...c.body,
          ]
        : c.body;
    return { id: c.id, title: c.title, body, lessonHref: c.lessonHref };
  }, [
    conceptId,
    scale,
    scaleLabel,
    scaleNoteNames,
    rootPc,
    related,
    scalePage,
  ]);

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
              {scaleLabel && (
                <span className="ml-3">
                  {singleNoteDegree !== null ? (
                    <span className="text-emerald-600">
                      {singleNoteDegree} of {scaleLabel}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      outside {scaleLabel}
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
                : "bg-orange-600 motion-safe:animate-pulse",
            )}
          />
          {hasAudioPermission ? "sound on" : "sound off — play a key to enable"}
        </div>
      </Card>

      {/* Keyboard — never overflow-scrolls; range and key width adapt instead */}
      <Card ref={keyboardAreaRef} className="p-3">
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
          detune={{ cents: detuneCents, onChange: setDetuneCents }}
        />
      </Card>

      {/*
       * Waveform/Scale × Octave/Range. Flex-wrap lets the right-hand
       * pair start at different x positions (Scale is wider than
       * Waveform); a 2-col grid keeps Octave and Range on one line.
       * Queried on the card so this follows the synth's width, not
       * the viewport. Computer keys span both columns so its hint
       * string doesn't shove the steppers further right.
       */}
      <Card className="[container-type:inline-size] px-4 py-4 sm:px-5">
        <div
          className={cn(
            "flex flex-wrap gap-x-10 gap-y-5",
            "[@container(min-width:32rem)]:grid [@container(min-width:32rem)]:grid-cols-[auto_auto] [@container(min-width:32rem)]:items-start [@container(min-width:32rem)]:justify-start",
          )}
        >
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
              value={`${rootName ?? "C"}${startOctave}`}
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

          {/* Root and type are two labelled columns in one cell, so they read
              as one phrase — "[D] [Dorian]" — while each label opens its own
              lesson: Scale → what a scale is; Type → the selected scale's
              card (or, with nothing chosen, what the dropdown is for). */}
          <div className="flex flex-wrap items-start gap-x-3 gap-y-5">
            <Field
              label="Scale"
              onLabelClick={() => toggleConcept("scale")}
              labelSelected={conceptId === "scale"}
            >
              <select
                aria-label="Scale root"
                value={rootPc ?? ""}
                onChange={(e) => {
                  const next = e.target.value;
                  if (next === "") {
                    commitScale(null, null);
                    setLockToScale(false);
                    setShowNumbers(false);
                    // The selected-scale card falls back to the dropdown's
                    // explanation on its own; nothing to close.
                    return;
                  }
                  // Picking a root is the on-switch: default to major and turn the
                  // numbers on, so the scale arrives already labeled 1–7. Only on
                  // first activation, so re-picking a root won't override a manual
                  // toggle-off. Clearing the scale (above) removes them again.
                  commitScale(Number(next), typeId ?? "major");
                  if (typeId === null) setShowNumbers(true);
                  touchConcept(typeId === null ? "scale" : "scale-type");
                }}
                className={selectClass}
              >
                <option value="">—</option>
                {ROOT_OPTIONS.map((o) => (
                  <option key={o.pc} value={o.pc}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Type"
              onLabelClick={() => toggleConcept("scale-type")}
              labelSelected={conceptId === "scale-type"}
              labelExtra={
                hasScale && related ? (
                  // Names the relationship precisely: the related scale shares
                  // every note. Clicking swaps — the marked keys stay put while
                  // the keyboard re-frames around the new home base. ml-auto
                  // pins it to the right edge of the section.
                  <span className="ml-auto flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                    <span aria-hidden>·</span>
                    <button
                      type="button"
                      title={`${related.name} — ${related.label}. Click to switch.`}
                      aria-label={`Switch to ${related.name}, which has the same notes`}
                      onClick={() => {
                        commitScale(related.rootPc, related.typeId);
                        touchConcept("relative-keys");
                      }}
                      className={cn(
                        "cursor-pointer rounded-sm underline underline-offset-4 transition-colors",
                        "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      )}
                    >
                      same notes as{" "}
                      <span className="font-semibold text-foreground">
                        {related.name}
                      </span>
                    </button>
                  </span>
                ) : null
              }
            >
              <select
                aria-label="Scale type"
                value={typeId ?? ""}
                disabled={rootPc === null}
                onChange={(e) => {
                  commitScale(rootPc, e.target.value as ScaleTypeId);
                  // Choosing a type IS the lesson: open the card for it.
                  setConceptId("scale-type");
                }}
                className={cn(selectClass, "max-w-[12rem]")}
              >
                {typeId === null && <option value="">—</option>}
                {SCALE_GROUPS.map((group) => (
                  <optgroup key={group.group} label={group.label}>
                    {group.types.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
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
                pressed={showNumbers}
                onClick={() => {
                  setShowNumbers((v) => !v);
                  // Showing the numbers IS the lesson, so open the panel (unlike
                  // the sound toggles, which only refresh an already-open one).
                  toggleConcept("scale-numbers");
                }}
                disabled={!hasScale}
              >
                numbers
              </Toggle>
            </Field>
          </div>

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
                setVisibleOctaves((v) =>
                  Math.min(MAX_OCTAVES, maxFitOctaves, v + 1),
                );
                touchConcept("range");
              }}
              decrementDisabled={visibleOctaves <= 1}
              incrementDisabled={
                visibleOctaves >= Math.min(MAX_OCTAVES, maxFitOctaves)
              }
              onIncrementLocked={atScreenCap ? flashMaxFitHint : undefined}
              decrementLabel="Fewer octaves"
              incrementLabel="More octaves"
            />
            {showMaxFitHint && (
              <span
                role="status"
                className="font-mono text-[11px] text-muted-foreground"
              >
                max for this screen
              </span>
            )}
          </Field>

          {!isMobile && (
            <Field
              className="[@container(min-width:32rem)]:col-span-2"
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
        </div>
      </Card>

      {/* Learning area — shared, shows the last concept clicked */}
      <LearnPanel
        concept={selectedConcept}
        onClose={() => setConceptId(null)}
      />
    </div>
  );
}

function lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/* ---------- small local controls ---------- */

function Field({
  label,
  children,
  onLabelClick,
  labelSelected,
  labelExtra,
  className,
}: {
  label: string;
  children: ReactNode;
  /** When set, the label becomes a button that opens the learning panel. */
  onLabelClick?: () => void;
  labelSelected?: boolean;
  /** Small status content rendered inline next to the label. */
  labelExtra?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
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
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ) : (
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
        )}
        {labelExtra}
      </div>
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
              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
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
  onIncrementLocked,
  decrementLabel,
  incrementLabel,
}: {
  value: string;
  onDecrement: () => void;
  onIncrement: () => void;
  decrementDisabled?: boolean;
  incrementDisabled?: boolean;
  /** Soft-lock the plus: greyed out, but a click still fires (for a hint). */
  onIncrementLocked?: () => void;
  decrementLabel: string;
  incrementLabel: string;
}) {
  const incrementSoftLocked = Boolean(incrementDisabled && onIncrementLocked);
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
        aria-disabled={incrementSoftLocked || undefined}
        onClick={incrementSoftLocked ? onIncrementLocked : onIncrement}
        disabled={incrementDisabled && !incrementSoftLocked}
        className={cn(
          btn,
          incrementSoftLocked &&
            "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-muted-foreground",
        )}
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
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

/** Tiny oscilloscope-style glyphs for the four primitive waveforms. */
export function WaveGlyph({ type }: { type: OscillatorType }) {
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
