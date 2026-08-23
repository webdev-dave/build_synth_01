"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/* Occasional shooting stars over the hero sky. Scheduled with real
   randomness (interval, position, angle, length, speed) so they never
   feel like a loop — rare enough to be a small delight, never a show.
   Skipped entirely under prefers-reduced-motion. */

type Streak = {
  id: number;
  left: number; // spawn position, % of container
  top: number;
  angle: number; // travel direction, degrees
  len: number; // streak length, px
  travel: number; // distance covered, px
  dur: number; // seconds
};

/* Quicker cadence: one streak roughly every 4–12s, first exactly at 2s. */
const nextDelay = () => 4000 + Math.random() * 8000;
const firstDelay = () => 2000;

const makeStreak = (id: number): Streak => ({
  id,
  left: 5 + Math.random() * 65,
  top: 5 + Math.random() * 45,
  /* Mostly down-right, sometimes down-left, always clearly diagonal. */
  angle:
    Math.random() < 0.7
      ? 22 + Math.random() * 23 // 22–45°
      : 135 + Math.random() * 23, // 135–158°
  len: 70 + Math.random() * 90,
  travel: 140 + Math.random() * 140,
  dur: 0.9 + Math.random() * 0.5,
});

export function ShootingStars() {
  const reduce = useReducedMotion();
  const [streaks, setStreaks] = useState<Streak[]>([]);

  useEffect(() => {
    if (reduce) return;
    let alive = true;
    let seq = 0;
    const timers: number[] = [];

    const schedule = (ms: number) => {
      timers.push(
        window.setTimeout(() => {
          if (!alive) return;
          const streak = makeStreak(++seq);
          setStreaks((s) => [...s, streak]);
          timers.push(
            window.setTimeout(
              () => setStreaks((s) => s.filter((x) => x.id !== streak.id)),
              streak.dur * 1000 + 300,
            ),
          );
          schedule(nextDelay());
        }, ms),
      );
    };

    schedule(firstDelay());
    return () => {
      alive = false;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [reduce]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <AnimatePresence>
        {streaks.map((st) => (
          <div
            key={st.id}
            className="absolute"
            style={{
              left: `${st.left}%`,
              top: `${st.top}%`,
              transform: `rotate(${st.angle}deg)`,
            }}
          >
            {/* The gradient's bright end is the head; translating along
              the rotated axis makes the streak travel its own line. */}
            <motion.div
              className="h-px rounded-full bg-gradient-to-r from-transparent via-muted-foreground/30 to-foreground/70"
              style={{ width: st.len }}
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: st.travel, opacity: [0, 0.65, 0] }}
              exit={{ opacity: 0 }}
              transition={{
                duration: st.dur,
                ease: "easeOut",
                times: [0, 0.2, 1],
              }}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
