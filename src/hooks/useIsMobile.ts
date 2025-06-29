import { useEffect, useState } from "react";

/**
 * Detects if the current device should be treated as a mobile / touch-only device.
 * Uses the `(pointer: coarse)` media query which is true for the vast majority
 * of phones and tablets.
 */
export default function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Touch-only pointer devices (phones, tablets, many hybrid laptops)
    const coarseMql = window.matchMedia("(pointer: coarse)");

    const update = () => {
      // Consider any coarse pointer device as mobile/touch-first
      setIsMobile(coarseMql.matches);
    };

    // Initial evaluation
    update();

    // Listen for changes to the media query
    coarseMql.addEventListener("change", update);

    return () => {
      coarseMql.removeEventListener("change", update);
    };
  }, []);

  return isMobile;
}
