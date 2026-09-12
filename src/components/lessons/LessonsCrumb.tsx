import { HubLink } from "@/components/content/HubLink";

/**
 * Hub → curriculum. Every lesson-module hub (scales, progressions, rhythm,
 * forms, genres, concepts, history) carries this above its header, the way
 * a spoke carries "All scales": the URLs are flat, so this is where the
 * Lessons hierarchy shows.
 */
export function LessonsCrumb() {
  return (
    <div className="mb-6">
      <HubLink href="/lessons">All lessons</HubLink>
    </div>
  );
}
