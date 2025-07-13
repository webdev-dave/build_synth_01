import { useCallback, useRef, useState, useEffect } from "react";
import PreventDefaultTouchWrapper from "@/components/wrappers/PreventDefaultTouchWrapper";
import { useMicrophoneAccess } from "@/hooks/useMicrophoneAccess";
import { usePitchProcessor } from "@/hooks/usePitchProcessor";
import { useSharedAudioContext } from "@/hooks/useSharedAudioContext";
import AnimatedMicButton from "./AnimatedMicButton";
import AudioLevelMeter from "./AudioLevelMeter";
import { useDetectionMode } from "@/components/DetectionModeContext";
import { useKeyDetector } from "@/hooks/useKeyDetector";
import Tooltip from "./Tooltip";

export default function PitchDetector() {
  // Get shared audio context
  const { audioContext } = useSharedAudioContext();

  // Microphone access management
  const micAccess = useMicrophoneAccess();

  // Audio analysis for pitch detection
  const pitchProcessor = usePitchProcessor(audioContext);

  // use detection mode context
  const { mode: detectionMode, setMode: setDetectionMode } = useDetectionMode();

  const keyState = useKeyDetector(
    pitchProcessor.latestNotes,
    pitchProcessor.latestPitchMidi,
    pitchProcessor.isAnalyzing,
    detectionMode
  );

  const [elapsedSec, setElapsedSec] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // compute confidence color
  const confidenceColor =
    keyState.confidence > 0.7
      ? "bg-green-500"
      : keyState.confidence > 0.5
      ? "bg-yellow-400"
      : "bg-gray-600";

  // Handle start/stop listening - browser will handle permission dialog automatically
  const handleToggleListening = useCallback(async () => {
    if (pitchProcessor.isAnalyzing) {
      // Stop listening
      pitchProcessor.stop();
      micAccess.stopListening();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsedSec(0);
    } else {
      // Start listening - this will trigger browser permission dialog if needed
      try {
        const mediaStream = await micAccess.startListening();
        if (mediaStream) {
          await pitchProcessor.start(mediaStream);
          // reset timer
          setElapsedSec(0);
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = setInterval(() => {
            setElapsedSec((prev) => prev + 1);
          }, 1000);
        }
      } catch (error) {
        console.error("Failed to start listening:", error);
      }
    }
  }, [pitchProcessor, micAccess]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <PreventDefaultTouchWrapper allowScroll={true}>
      <div className="bg-synth-bg p-6 rounded-md border-2 min-h-[70vh]">
        {/* Title and description */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Real-Time Key Detection
          </h2>
          <p className="text-gray-300 text-lg max-w-md mx-auto">
            Identify what musical key is being played so you can join in with
            the right notes.
          </p>
        </div>

        {/* Beta banner */}
        <div className="bg-yellow-700/30 border border-yellow-500/40 text-yellow-200 p-3 rounded mb-6 text-center text-sm font-medium">
          🚧 Key Detector Beta: This feature is under active testing and may not
          always be accurate.
        </div>

        {/* Main Microphone Interface */}
        <div className="flex flex-col items-center justify-center space-y-8 min-h-[40vh]">
          {/* Detection Mode Toggle */}
          <div className="flex items-center space-x-1">
            <label
              className="text-gray-300 font-medium"
              htmlFor="detection-mode"
            >
              Mode:
            </label>
            <Tooltip
              message="Standard: quick, monophonic detection. High Accuracy: slower but polyphonic using AI model."
              placement="top"
              alignX="left"
            >
              <span className="text-blue-400 cursor-help">❓</span>
            </Tooltip>
            <select
              id="detection-mode"
              disabled={pitchProcessor.isAnalyzing}
              className={`bg-gray-800 text-white border border-gray-600 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                pitchProcessor.isAnalyzing
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              value={detectionMode}
              onChange={(e) =>
                setDetectionMode(e.target.value as "standard" | "highAccuracy")
              }
            >
              <option value="standard">Standard (Fast)</option>
              <option value="highAccuracy">High Accuracy (Slower)</option>
            </select>
          </div>
          {/* Animated Mic Button */}
          <AnimatedMicButton
            isListening={pitchProcessor.isAnalyzing}
            audioLevel={pitchProcessor.audioLevel}
            onToggleListening={handleToggleListening}
            disabled={!micAccess.isSupported}
            size="large"
          />

          {/* Status Information */}
          <div className="text-center space-y-2">
            <div
              className="font-medium transition-colors duration-300"
              style={{
                color:
                  keyState.confidence > 0
                    ? keyState.confidence > 0.7
                      ? "#22c55e"
                      : keyState.confidence > 0.5
                      ? "#fbbf24"
                      : "#fff"
                    : "#fff",
              }}
            >
              {keyState.confidence > 0
                ? `Key: ${keyState.name} (${Math.round(
                    Math.min(keyState.confidence, 1) * 100
                  )}%)`
                : pitchProcessor.isAnalyzing
                ? "Listening..."
                : "Ready to detect musical key"}
            </div>

            <div className="text-xs font-mono text-lime-400 bg-gray-900 px-2 py-1 rounded inline-block">
              {Math.floor(elapsedSec / 60)
                .toString()
                .padStart(2, "0")}
              :{(elapsedSec % 60).toString().padStart(2, "0")}
            </div>
            {keyState.confidence > 0 && (
              <>
                <div className="w-40 h-1 rounded-full overflow-hidden bg-gray-700 mx-auto transition-all duration-300">
                  <div
                    className={`h-full ${confidenceColor} transition-all duration-300`}
                    style={{
                      width: `${Math.min(keyState.confidence, 1) * 100}%`,
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Audio Level Meter */}
          <AudioLevelMeter
            level={pitchProcessor.audioLevel}
            isActive={pitchProcessor.isAnalyzing}
            className="w-full max-w-md"
          />

          {/* Error Message (Simple) */}
          {micAccess.error && (
            <div className="bg-red-800/20 p-4 rounded-lg border border-red-600/30 max-w-lg">
              <div className="text-center text-red-300">
                <div className="font-semibold mb-1">Microphone Error</div>
                <div className="text-sm">{micAccess.error.message}</div>
                {micAccess.error.details && (
                  <div className="text-xs text-red-400 mt-2">
                    {micAccess.error.details}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pitch Detection Status */}
          {pitchProcessor.isAnalyzing && (
            <div className="bg-blue-800/20 p-4 rounded-lg border border-blue-600/30 max-w-lg w-full">
              <div className="text-center text-gray-300">
                <div className="text-lg font-semibold text-white mb-2">
                  🎵 Pitch Detection Active
                </div>
                <div className="text-sm">
                  Pitch processor core will be implemented in upcoming steps.
                  Currently processing audio at 10fps for maximum accuracy.
                </div>
              </div>
            </div>
          )}

          {/* Browser Support Info */}
          {!micAccess.isSupported && (
            <div className="bg-yellow-800/20 p-4 rounded-lg border border-yellow-600/30 max-w-lg">
              <div className="text-center text-yellow-300">
                <div className="font-semibold mb-1">Browser Not Supported</div>
                <div className="text-sm">
                  Please use Chrome, Firefox, Safari, or Edge for microphone
                  access.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PreventDefaultTouchWrapper>
  );
}
