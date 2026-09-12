/**
 * Lays a form's answering lick onto the clock: which notes sound at which
 * beat of the whole song, and which span each note belongs to — so the
 * player and the map read one plan. Pure, so the Node check can prove
 * the notes land inside the response bars and inside the scale.
 */

import { formBars, formChoruses, spansOf, type Form, type FormSpan } from "./registry";

export interface LickNote {
  /** Semitones above the key root; 12 = the octave. */
  offset: number;
  /** Beats after the span starts. */
  at: number;
  /** Length in beats. */
  duration: number;
}

/** A form's answering figures — data in src/content/forms/licks.ts. */
export interface FormLick {
  /** Scale the offsets are drawn from — the check reads this. */
  scale: "blues";
  /** One answer per response span of the chorus. */
  phrases: LickNote[][];
  /** What the lead plays in the call halves of an instrumental chorus. */
  callPhrases?: LickNote[][];
}

export interface PlannedNote extends LickNote {
  /** Beat from the start of the clock cycle (the whole song). */
  at: number;
  /** Which chorus (trip through the cycle) the note is in. */
  pass: number;
  /** The span the note answers in — `from` is the bar the span starts on. */
  span: FormSpan;
}

/**
 * Every lick note in the song. Response spans take `phrases` in order
 * (the last phrase repeats if a chorus has more responses); an
 * instrumental chorus also fills its call spans from `callPhrases`.
 */
export function planLick(form: Form, lick: FormLick, beatsPerBar: number): PlannedNote[] {
  const spans = spansOf(form);
  const cycleBeats = formBars(form) * beatsPerBar;
  const out: PlannedNote[] = [];
  formChoruses(form).forEach((chorus, pass) => {
    let responses = 0;
    let calls = 0;
    for (const span of spans) {
      let phrase: LickNote[] | undefined;
      if (span.role === "response") {
        phrase = lick.phrases[Math.min(responses, lick.phrases.length - 1)];
        responses++;
      } else if (span.role === "call" && chorus.instrumental && lick.callPhrases?.length) {
        phrase = lick.callPhrases[Math.min(calls, lick.callPhrases.length - 1)];
        calls++;
      }
      if (!phrase) continue;
      const spanStart = pass * cycleBeats + span.from * beatsPerBar;
      const spanBeats = span.length * beatsPerBar;
      for (const note of phrase) {
        // A note never runs past its span: the rest before the next line is part of the shape.
        const duration = Math.min(note.duration, spanBeats - note.at);
        if (duration <= 0) continue;
        out.push({ ...note, duration, at: spanStart + note.at, pass, span });
      }
    }
  });
  return out.sort((a, b) => a.at - b.at);
}

/** The note sounding at `beat`, if any — what lights the span it belongs to. */
export function soundingNote(plan: readonly PlannedNote[], beat: number): PlannedNote | undefined {
  return plan.find((n) => beat >= n.at && beat < n.at + n.duration);
}
