/**
 * The answering figures the lead plays in a form's response bars — data,
 * not code, so a lick can change without touching the widget, and so a
 * check can prove every note sits in the key's blues scale.
 *
 * Notes are semitone offsets from the key root (so the lick transposes
 * with the page), placed in beats from the start of the response span.
 * One phrase per response in the chorus, in order; a chorus with more
 * responses than phrases reuses the last. `callPhrases` fill the sung
 * halves too on an instrumental (solo) chorus.
 */

import type { FormLick, LickNote } from "@/lib/forms/lick";

const n = (offset: number, at: number, duration: number): LickNote => ({ offset, at, duration });

/*
 * Blues scale offsets: 0 · 3 · 5 · 6 · 7 · 10 (· 12). Each answer starts
 * on the downbeat of the response and leaves the last bar mostly open —
 * the rest before the next line is part of the shape.
 */
export const BLUES_RESPONSE_LICK: FormLick = {
  scale: "blues",
  phrases: [
    // Falling from the octave to home: the plain "yes, that's so".
    [n(12, 0, 0.5), n(10, 0.5, 0.5), n(7, 1, 1), n(3, 2, 1), n(0, 3, 2)],
    // Rising through the blue ♭5 to the octave: the second line pushes.
    [n(3, 0, 0.5), n(5, 0.5, 0.5), n(6, 1, 0.5), n(7, 1.5, 0.5), n(12, 2, 2)],
    // Down through ♭5 to a long home note: the line that closes the chorus.
    [n(7, 0, 0.5), n(6, 0.5, 0.5), n(5, 1, 0.5), n(3, 1.5, 0.5), n(0, 2, 3)],
  ],
  callPhrases: [
    [n(0, 0, 0.5), n(3, 0.5, 0.5), n(5, 1, 0.5), n(7, 1.5, 1.5), n(10, 3, 1)],
    [n(7, 0, 1), n(10, 1, 0.5), n(12, 1.5, 0.5), n(10, 2, 0.5), n(7, 2.5, 1.5)],
    [n(12, 0, 0.5), n(10, 0.5, 0.5), n(12, 1, 0.5), n(7, 1.5, 0.5), n(5, 2, 0.5), n(3, 2.5, 1.5)],
  ],
};

const FORM_LICKS: Record<string, FormLick> = {
  "twelve-bar-blues": BLUES_RESPONSE_LICK,
};

export function getFormLick(slug: string): FormLick | undefined {
  return FORM_LICKS[slug];
}
