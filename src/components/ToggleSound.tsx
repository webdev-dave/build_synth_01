import { Play, Square } from "lucide-react";
interface ToggleSoundProps {
    actx: AudioContext | null;
    oscillator: OscillatorNode | null;
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
    oscHasStarted: boolean;
    setOscHasStarted: (started: boolean) => void;
}

export default function ToggleSound({
    actx,
    oscillator,
    isPlaying,
    setIsPlaying,
    oscHasStarted,
    setOscHasStarted,
}: ToggleSoundProps) {
    const toggleSound = async () => {
        if (!actx || !oscillator) {
            setIsPlaying(false);
            return;
        }

        try {
            if (isPlaying) {
                await actx.suspend();
                setIsPlaying(false);
            } else {
                if (actx.state === 'suspended') {
                    await actx.resume();
                }
                if (!oscHasStarted) {
                    oscillator.start();
                    setOscHasStarted(true);
                }
                setIsPlaying(true);
            }
        } catch (error) {
            console.error('Error toggling sound:', error);
            setIsPlaying(false);
        }
    };

    return (
        <button
            onClick={toggleSound}
            className="px-4 py-2 bg-orange-600 text-white rounded w-full flex items-center justify-center"
            aria-label={isPlaying ? 'Stop sound' : 'Play sound'}
        >
            {isPlaying ? (
                <Square className="h-4 w-4" fill="currentColor" aria-hidden="true" />
            ) : (
                <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" />
            )}
            <span className="sr-only">
                {isPlaying ? 'Stop sound' : 'Play sound'}
            </span>
        </button>
    );
} 