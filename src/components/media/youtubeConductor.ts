/**
 * Page-wide traffic cop for inline YouTube players.
 *
 * Two songs blasting at once is jarring, so every `YouTubeEmbed` registers
 * here and the conductor enforces one rule: **only one plays at a time.**
 *
 *   • A newly opened player asks `anyPlaying()` before it decides whether to
 *     autoplay — if something's already sounding, it loads paused.
 *   • When a player actually starts (a real PLAYING state change, whether from
 *     autoplay or the user hitting play), it calls `pauseOthers()`, so the
 *     user's deliberate choice to hear song B silences song A.
 *
 * Module-level singleton: shared by every embed on the page. No React state —
 * playback truth comes from each player's IFrame API events.
 */

export interface ManagedPlayer {
  /** Last known "is this one actually playing" truth, kept current by events. */
  playing: boolean;
  /** Pause this player (wraps the IFrame API `pauseVideo`). */
  pause: () => void;
}

const players = new Set<ManagedPlayer>();

/** Register a player; returns an unregister fn for effect cleanup. */
export function registerPlayer(player: ManagedPlayer): () => void {
  players.add(player);
  return () => {
    players.delete(player);
  };
}

/** Is any *other* player currently playing? (Pass self to exclude it.) */
export function anyPlaying(except?: ManagedPlayer): boolean {
  for (const p of players) {
    if (p !== except && p.playing) return true;
  }
  return false;
}

/** Pause every playing player except the one that just took the stage. */
export function pauseOthers(except: ManagedPlayer): void {
  for (const p of players) {
    if (p !== except && p.playing) p.pause();
  }
}
