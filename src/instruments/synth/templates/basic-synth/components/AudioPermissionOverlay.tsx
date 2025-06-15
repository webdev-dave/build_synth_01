interface AudioPermissionOverlayProps {
  onInitializeAudio: () => Promise<void>;
}

export default function AudioPermissionOverlay({
  onInitializeAudio,
}: AudioPermissionOverlayProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/70 z-[60]">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full mx-4 text-center">
        <div className="text-4xl mb-4">🔊</div>
        <h2 className="text-xl font-bold mb-4 text-white">
          Audio Permission Required
        </h2>
        <p className="text-gray-300 mb-6">
          Tap the button below to enable audio for the synthesizer
        </p>
        <button
          onClick={onInitializeAudio}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-medium shadow-lg hover:bg-blue-700 transition-colors w-full"
          aria-label="Enable sound for the synthesizer"
        >
          Enable Sound 🎵
        </button>
      </div>
    </div>
  );
}
