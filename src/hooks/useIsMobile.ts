import { useEffect, useState } from "react";

/**
 * Detects if the current device should be treated as a mobile / touch-only device.
 * Uses the `(pointer: coarse)` media query which is true for the vast majority
 * of phones and tablets.
 */
export default function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Touch-only pointer indicates possible phone/tablet
    const coarseMql = window.matchMedia("(pointer: coarse)");
    // Use a reasonably generous width cutoff (phones in landscape are typically < 900px)
    const narrowMql = window.matchMedia("(max-width: 899px)");

    const update = () => {
      // Treat as "mobile phone" only when device is touch-centric AND viewport is narrow
      setIsMobile(coarseMql.matches && narrowMql.matches);
    };

    // Initial evaluation
    update();

    // Listen for changes to either media query
    coarseMql.addEventListener("change", update);
    narrowMql.addEventListener("change", update);

    return () => {
      coarseMql.removeEventListener("change", update);
      narrowMql.removeEventListener("change", update);
    };
  }, []);

  return isMobile;
}
