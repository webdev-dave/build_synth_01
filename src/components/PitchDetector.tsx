import PreventDefaultTouchWrapper from "@/components/wrappers/PreventDefaultTouchWrapper";

export default function PitchDetector() {
  return (
    <PreventDefaultTouchWrapper allowScroll={true}>
      <div className="bg-synth-bg p-6 rounded-md border-2 min-h-[70vh]">
        {/* Title and description */}
        <div className="mb-6 text-center">
          <div className="text-6xl mb-4">🎤</div>
          <h2 className="text-3xl font-bold text-white">
            Real-Time Key Detection
          </h2>
          <p className="text-gray-300 text-lg max-w-md mx-auto mt-2">
            This feature will help you identify what key and scale music is
            playing in real-time using your device&apos;s microphone.
          </p>
        </div>

        {/* Main pitch detection interface - works in both orientations */}
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <div className="bg-blue-800/30 p-4 rounded-lg border border-blue-600/50 max-w-lg">
            <h3 className="text-xl font-semibold text-white mb-2">
              Coming Soon:
            </h3>
            <ul className="text-left text-gray-300 space-y-1">
              <li>• Real-time pitch detection from microphone</li>
              <li>• Key and scale identification</li>
              <li>• Auto-sync with piano scale mode</li>
              <li>• Mobile-optimized for jam sessions</li>
            </ul>
          </div>
          <div className="text-sm text-gray-400 mt-4">
            Implementation will be done step by step in the next phases.
          </div>
        </div>
      </div>
    </PreventDefaultTouchWrapper>
  );
}
