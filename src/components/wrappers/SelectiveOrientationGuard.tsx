import { useEffect, useState, ReactNode } from "react";

export type OrientationRequirement = "landscape" | "portrait" | "any";

interface SelectiveOrientationGuardProps {
  children: ReactNode;
  requiredOrientation: OrientationRequirement;
  title?: string;
  message?: string;
  icon?: string;
  className?: string;
}

/**
 * SelectiveOrientationGuard - A component that blocks only the wrapped area, not the entire screen
 *
 * Unlike OrientationGuard, this only overlays the specific component area,
 * allowing other parts of the page to remain accessible.
 */
export default function SelectiveOrientationGuard({
  children,
  requiredOrientation,
  title = "Please Rotate Your Device",
  message = "This section works best in a different orientation",
  icon = "📱",
  className = "",
}: SelectiveOrientationGuardProps) {
  const [currentOrientation, setCurrentOrientation] = useState<
    "landscape" | "portrait"
  >("landscape");

  useEffect(() => {
    // Check initial orientation
    const updateOrientation = () => {
      setCurrentOrientation(
        window.innerHeight > window.innerWidth ? "portrait" : "landscape"
      );
    };

    updateOrientation();

    // Listen for orientation changes
    window.addEventListener("resize", updateOrientation);
    return () => window.removeEventListener("resize", updateOrientation);
  }, []);

  const needsOverlay =
    requiredOrientation !== "any" && currentOrientation !== requiredOrientation;

  return (
    <div className={`relative ${className}`}>
      {/* Always render children so their React state persists */}
      {children}

      {/* Conditionally render overlay on top when orientation is incorrect */}
      {needsOverlay && (
        <div className="absolute inset-0 flex items-center justify-center p-4 z-50 bg-black/80 rounded-lg">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
