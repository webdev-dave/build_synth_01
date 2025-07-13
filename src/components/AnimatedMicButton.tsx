import { useEffect, useState } from "react";

interface AnimatedMicButtonProps {
  isListening: boolean;
  audioLevel: number;
  onToggleListening: () => void;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
}

export default function AnimatedMicButton({
  isListening,
  audioLevel,
  onToggleListening,
  disabled = false,
  size = "large",
}: AnimatedMicButtonProps) {
  const [animationScale, setAnimationScale] = useState(1);

  // Smooth animation of the circle based on audio level
  useEffect(() => {
    if (isListening) {
      // Base scale + audio level scaling
      const targetScale = 1 + audioLevel * 0.4; // Scale from 1x to 1.4x max
      setAnimationScale(targetScale);
    } else {
      setAnimationScale(1);
    }
  }, [isListening, audioLevel]);

  // Size configurations
  const sizeConfig = {
    small: {
      button: "w-12 h-12 text-2xl",
      circle: "w-16 h-16",
      pulseSize: "w-20 h-20",
    },
    medium: {
      button: "w-16 h-16 text-3xl",
      circle: "w-20 h-20",
      pulseSize: "w-24 h-24",
    },
    large: {
      button: "w-20 h-20 text-4xl",
      circle: "w-24 h-24",
      pulseSize: "w-28 h-28",
    },
  };

  const config = sizeConfig[size];

  return (
    <div className="relative flex items-center justify-center">
      {/* Animated Audio Level Circle */}
      {isListening && (
        <div
          className={`
            absolute rounded-full border-2 border-blue-400 pointer-events-none
            transition-all duration-150 ease-out
            ${config.circle}
          `}
          style={{
            transform: `scale(${animationScale})`,
            opacity: 0.6 + audioLevel * 0.3, // Opacity from 0.6 to 0.9
          }}
        />
      )}

      {/* Background Pulse Animation (when listening but no audio) */}
      {isListening && audioLevel < 0.05 && (
        <div
          className={`
            absolute rounded-full border-2 border-blue-400/40 pointer-events-none
            animate-pulse
            ${config.pulseSize}
          `}
        />
      )}

      {/* Main Microphone Button */}
      <button
        onClick={onToggleListening}
        disabled={disabled}
        className={`
          relative z-10 rounded-full font-bold
          transition-all duration-200 ease-in-out
          ${config.button}
          ${
            disabled
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : isListening
              ? "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-lg transform hover:scale-105"
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg transform hover:scale-105"
          }
          ${!disabled && "active:scale-95"}
        `}
        aria-label={isListening ? "Stop listening" : "Start listening"}
        title={isListening ? "Stop listening" : "Start listening"}
      >
        {isListening ? "🔴" : "🎤"}
      </button>

      {/* Audio Level Indicator (small dots around button for high audio levels) */}
      {isListening && audioLevel > 0.7 && (
        <>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
            <div
              key={angle}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
              style={{
                transform: `rotate(${angle}deg) translateY(-${
                  size === "large" ? "20" : size === "medium" ? "16" : "12"
                }px)`,
                animationDelay: `${index * 100}ms`,
                animationDuration: "1s",
              }}
            />
          ))}
        </>
      )}

      {/* Status Text */}
      <div
        className={`absolute top-full mt-2 text-center text-sm ${
          size === "small" ? "text-xs" : ""
        }`}
      >
        <div
          className={`${
            isListening ? "text-red-400" : "text-gray-400"
          } font-medium`}
        >
          {isListening ? "Listening..." : "Tap to start"}
        </div>

        {/* Removed audio level debug text */}
      </div>
    </div>
  );
}
