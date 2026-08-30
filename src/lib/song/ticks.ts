/** Eighth-note ticks: 1 quarter-note beat = 2 ticks. */
export const TICKS_PER_BEAT = 2;

/**
 * webaudio-pianoroll clocks notes as `tick2time = 4 * 60 / tempo / timebase`.
 * The hardcoded `4` means `timebase` is “ticks in four quarter notes”, not
 * ticks in the current bar. We set `timebase` to ticks-per-bar so the ruler
 * matches the meter, then scale tempo so a quarter still lasts 60/bpm s.
 */
export const ROLL_TEMPO_TIMEBASE = 4 * TICKS_PER_BEAT;

export function rollPlaybackTempo(
  quarterNoteBpm: number,
  barTicks: number,
): number {
  return quarterNoteBpm * (ROLL_TEMPO_TIMEBASE / Math.max(1, barTicks));
}
