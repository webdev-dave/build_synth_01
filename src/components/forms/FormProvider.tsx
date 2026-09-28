"use client";

/**
 * One shared state for the widgets on a form lesson page.
 *
 * A form is a shape laid over a progression: when the form names one, this
 * wraps `ProgressionProvider` with as many passes through the chart as the
 * song has choruses, so the song strip, the chorus strip, the chord cells,
 * the keyboard and the lick all read one clock. The lick is a second track
 * on that clock (the lead answers in the response bars); which span is
 * "sounding" is derived from the same plan that schedules it, so a lit
 * response cell is a heard one by construction.
 *
 * A form without a progression gets no audio at all — the map renders
 * static and says so — rather than a click track pretending to be a song.
 */
import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react";

import { useClockDerived, useClockTrack, useLessonClock } from "@/components/lessons/LessonClock";
import {
  ProgressionProvider,
  useOptionalProgression,
} from "@/components/progressions/ProgressionProvider";
import { getLessonBus } from "@/lib/audio/bus";
import { leadNoteAt } from "@/lib/audio/voices/lead";
import { planLick, soundingNote, type FormLick, type PlannedNote } from "@/lib/forms/lick";
import { chorusLines, type ChorusLines } from "@/lib/forms/lyric";
import {
  formBars,
  formChoruses,
  spansOf,
  type Form,
  type FormChorus,
  type FormSpan,
} from "@/lib/forms/registry";
import type { ClockEvent } from "@/lib/music/clock";
import { degreesOf, type ScaleDegree } from "@/lib/music/scaleCatalog";
import {
  getProgression,
  type Progression,
  type ProgressionBar,
} from "@/lib/progressions/registry";
import { noteNumberToFrequency } from "@/instruments/synth/templates/basic-synth/utils/synthUtils";

/** The lead answers an octave above the organ's window so the two never blur. */
const LEAD_OCTAVE_UP = 12;

/** The form as data — everything that does not move while playing. */
interface FormShape {
  form: Form;
  /** The progression sounding under the map, if the form has one. */
  progression: Progression | null;
  /** Trips through the chart per cycle of the form (1 for the 12-bar; 0 when silent). */
  repeats: number;
  bars: number;
  spans: FormSpan[];
  choruses: FormChorus[];
  /** Each chorus with its sung lines against the sections. */
  lyric: ChorusLines[];
  lick: FormLick | null;
}

export interface FormState extends FormShape {
  beatsPerBar: number;
  /** Bar of the cycle sounding now (0-based), else null. */
  currentBar: number | null;
  /** Chorus sounding now (0-based), else null. */
  currentChorus: number | null;
  /** Beat within the current bar (0-based), else null. */
  currentBeat: number | null;
  /** `spanKey(chorus, from)` of the span the lead is answering in right now, else null. */
  soundingSpan: string | null;
  /** Jump the playhead to a bar of a chorus (starts playing if stopped). */
  jumpTo: (chorus: number, bar?: number) => void;
  /** The chart entry under a bar of the form, or null when nothing sounds. */
  chartBar: (bar: number) => ProgressionBar | null;
}

/** Identity of one span in one chorus — what `soundingSpan` names. */
export const spanKey = (chorus: number, from: number) => `${chorus}:${from}`;

const FormContext = createContext<FormState | null>(null);

export function useForm(): FormState {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("Form widgets must render inside <FormProvider>.");
  return ctx;
}

interface FormProviderProps {
  form: Form;
  /** Scale that spells the chords under the map; defaults to the blues scale. */
  degrees?: readonly ScaleDegree[];
  defaultKeyRootPc?: number;
  bpm?: number;
  /** Play the whole song (every chorus) or just one cycle. */
  wholeSong?: boolean;
  lick?: FormLick;
  children: ReactNode;
}

export function FormProvider({
  form,
  degrees,
  defaultKeyRootPc,
  bpm = 88,
  wholeSong = true,
  lick,
  children,
}: FormProviderProps) {
  const progression = form.progression ? getProgression(form.progression) : undefined;
  const choruses = useMemo(
    () => (wholeSong ? formChoruses(form) : formChoruses(form).slice(0, 1)),
    [form, wholeSong],
  );
  // The chart must tile the map exactly: once (12-bar blues) or looped a
  // whole number of times (a four-chord loop under a 16-bar verse–chorus
  // cycle). Anything else falls back to silence rather than a misaligned map.
  const bars = formBars(form);
  const repeats = progression && bars % progression.bars.length === 0 ? bars / progression.bars.length : 0;
  const fits = repeats > 0;

  const shape = useMemo<FormShape>(
    () => ({
      form,
      progression: progression && fits ? progression : null,
      repeats,
      bars,
      spans: spansOf(form),
      choruses,
      lyric: chorusLines(form).filter((c) => choruses.some((x) => x.id === c.chorus.id)),
      lick: lick ?? null,
    }),
    [form, progression, fits, repeats, bars, choruses, lick],
  );

  if (!shape.progression) {
    return <SilentFormProvider shape={shape}>{children}</SilentFormProvider>;
  }

  return (
    <ProgressionProvider
      progression={shape.progression}
      degrees={degrees ?? degreesOf("blues")}
      defaultKeyRootPc={defaultKeyRootPc}
      bpm={bpm}
      passes={choruses.length * repeats}
    >
      <SoundingFormProvider shape={shape}>{children}</SoundingFormProvider>
    </ProgressionProvider>
  );
}

function SilentFormProvider({ shape, children }: { shape: FormShape; children: ReactNode }) {
  const value = useMemo<FormState>(
    () => ({
      ...shape,
      beatsPerBar: 4,
      currentBar: null,
      currentChorus: null,
      currentBeat: null,
      soundingSpan: null,
      jumpTo: () => {},
      chartBar: () => null,
    }),
    [shape],
  );
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

/** The live half: bound to the progression's clock, with the lick as a second track. */
function SoundingFormProvider({ shape, children }: { shape: FormShape; children: ReactNode }) {
  const clock = useLessonClock();
  const progression = useOptionalProgression();
  if (!progression) throw new Error("SoundingFormProvider needs a ProgressionProvider.");
  const { beatsPerBar, currentPass, rootMidi, passLengthBeats } = progression;
  const { repeats } = shape;
  const chartLength = progression.bars.length;
  // One form cycle is `repeats` trips through the chart; fold the chart's
  // pass and bar back into chorus + bar of the form.
  const currentChorus = currentPass == null ? null : Math.floor(currentPass / repeats);
  const currentBar =
    currentPass == null || progression.currentBar == null
      ? null
      : (currentPass % repeats) * chartLength + progression.currentBar;
  const chartBar = useCallback(
    (bar: number) => progression.bars[((bar % chartLength) + chartLength) % chartLength] ?? null,
    [progression.bars, chartLength],
  );

  const plan = useMemo<PlannedNote[]>(() => {
    if (!shape.lick) return [];
    return planLick({ ...shape.form, song: shape.choruses }, shape.lick, beatsPerBar);
  }, [shape, beatsPerBar]);
  const planRef = useRef(plan);
  planRef.current = plan;

  const { audioContext } = clock;
  useClockTrack(
    {
      id: "form-lick",
      events: () => {
        const ctx = audioContext;
        if (!ctx) return [];
        const bus = getLessonBus(ctx);
        return planRef.current.map<ClockEvent>((note) => ({
          at: note.at,
          duration: note.duration,
          fire: (when, dur) =>
            leadNoteAt(
              ctx,
              bus,
              noteNumberToFrequency(rootMidi + LEAD_OCTAVE_UP + note.offset),
              when,
              dur,
            ),
        }));
      },
    },
    [audioContext, rootMidi],
  );

  const currentBeat = useClockDerived((beat) =>
    beat == null || beat < 0 ? null : Math.floor(beat % beatsPerBar),
  );
  const soundingSpan = useClockDerived((beat) => {
    if (beat == null || beat < 0) return null;
    const note = soundingNote(planRef.current, beat);
    return note ? spanKey(note.pass, note.span.from) : null;
  });

  const jumpTo = useCallback(
    (chorus: number, bar = 0) => {
      void clock.play(chorus * repeats * passLengthBeats + bar * beatsPerBar);
    },
    [clock, repeats, passLengthBeats, beatsPerBar],
  );

  const value = useMemo<FormState>(
    () => ({
      ...shape,
      beatsPerBar,
      currentBar,
      currentChorus,
      currentBeat,
      soundingSpan,
      jumpTo,
      chartBar,
    }),
    [shape, beatsPerBar, currentBar, currentChorus, currentBeat, soundingSpan, jumpTo, chartBar],
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}
