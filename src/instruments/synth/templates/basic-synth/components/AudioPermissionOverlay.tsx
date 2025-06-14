interface AudioPermissionOverlayProps {
  onInitializeAudio: () => Promise<void>;
}

export default function AudioPermissionOverlay({
  onInitializeAudio,
}: AudioPermissionOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 z-50">
      <button
        onClick={onInitializeAudio}
        className="p-8 sm:p-12"
        aria-label="Enable sound for the synthesizer"
      >
        <span className="px-6 py-4 bg-gray-50 text-gray-900 rounded-lg text-lg font-medium shadow-lg hover:bg-gray-100 transition-colors">
          Tap to Enable Sound
        </span>
      </button>
    </div>
  );
}
