import { useEffect, useState, ReactNode } from "react";

export type OrientationRequirement = "landscape" | "portrait" | "any";

interface OrientationGuardProps {
  children: ReactNode;
  requiredOrientation: OrientationRequirement;
  title?: string;
  message?: string;
  icon?: string;
}

/**
 * OrientationGuard - A reusable component for enforcing orientation requirements
 *
 * RECOMMENDED USAGE: Wrap instrument components internally for better encapsulation
 *
 * Supports three orientation modes:
 * - "landscape": Requires horizontal orientation
 * - "portrait": Requires vertical orientation
 * - "any": Works in any orientation
 *
 * Each instrument should wrap itself with this component and define:
 * - requiredOrientation: The orientation requirement
 * - title: Custom title for the rotation prompt
 * - message: Custom message explaining why rotation is needed
 * - icon: Custom emoji or icon for the prompt
 */
export default function OrientationGuard({
  children,
  requiredOrientation,
  title = "Please Rotate Your Device",
  message = "This experience works best in a different orientation",
  icon = "📱",
}: OrientationGuardProps) {
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

  // If no specific orientation is required, always show content
  if (requiredOrientation === "any") {
    return <>{children}</>;
  }

  // If current orientation doesn't match required orientation, show guard
  if (currentOrientation !== requiredOrientation) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 bg-synth-bg text-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-4xl mb-4">{icon}</div>
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <p className="text-gray-300">{message}</p>
        </div>
      </div>
    );
  }

  // If orientation matches requirement, show the content
  return <>{children}</>;
}
