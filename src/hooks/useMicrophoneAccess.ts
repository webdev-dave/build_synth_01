import { useState, useCallback, useEffect } from "react";

export interface MicrophoneError {
  code: string;
  message: string;
  details?: string;
}

export interface UseMicrophoneAccessReturn {
  hasPermission: boolean;
  isListening: boolean;
  mediaStream: MediaStream | null;
  error: MicrophoneError | null;
  isSupported: boolean;
  requestPermission: () => Promise<void>;
  startListening: () => Promise<MediaStream | null>;
  stopListening: () => void;
  cleanup: () => void;
}

export function useMicrophoneAccess(): UseMicrophoneAccessReturn {
  const [hasPermission, setHasPermission] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<MicrophoneError | null>(null);

  // Check if getUserMedia is supported
  const isSupported = !!(
    navigator.mediaDevices && navigator.mediaDevices.getUserMedia
  );

  // Helper function to create error objects
  const createError = useCallback(
    (code: string, message: string, details?: string): MicrophoneError => {
      return { code, message, details };
    },
    []
  );

  // Permission status will be determined when user tries to start listening

  // Request microphone permission
  const requestPermission = useCallback(async () => {
    setError(null);

    if (!isSupported) {
      setError(
        createError(
          "UNSUPPORTED_BROWSER",
          "Microphone access is not supported in this browser",
          "Please use a modern browser like Chrome, Firefox, or Safari"
        )
      );
      return;
    }

    try {
      // Request permission by attempting to get user media
      // Browser will show native permission dialog automatically
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          // Optimize for pitch detection
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 44100,
          channelCount: 1,
        },
      });

      // Permission granted - clean up test stream
      stream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
    } catch (err) {
      console.error("Microphone permission error:", err);

      if (err instanceof DOMException) {
        switch (err.name) {
          case "NotAllowedError":
            setError(
              createError(
                "PERMISSION_DENIED",
                "Microphone access was denied",
                "Please allow microphone access in your browser and try again"
              )
            );
            break;
          case "NotFoundError":
            setError(
              createError(
                "NO_MICROPHONE",
                "No microphone found",
                "Please connect a microphone and try again"
              )
            );
            break;
          case "NotReadableError":
            setError(
              createError(
                "MICROPHONE_BUSY",
                "Microphone is being used by another application",
                "Please close other applications using the microphone and try again"
              )
            );
            break;
          default:
            setError(
              createError(
                "UNKNOWN_ERROR",
                "Failed to access microphone",
                `Error: ${err.message}`
              )
            );
        }
      } else {
        setError(
          createError(
            "UNKNOWN_ERROR",
            "Failed to access microphone",
            "An unexpected error occurred"
          )
        );
      }
    }
  }, [isSupported, createError]);

  // Start listening (get actual media stream)
  const startListening = useCallback(async (): Promise<MediaStream | null> => {
    if (isListening && mediaStream) {
      return mediaStream; // Already listening, return existing stream
    }

    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          // Optimize for pitch detection
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 44100,
          channelCount: 1,
        },
      });

      setMediaStream(stream);
      setIsListening(true);
      setHasPermission(true);
      return stream;
    } catch (err) {
      console.error("Error starting microphone:", err);

      if (err instanceof DOMException) {
        switch (err.name) {
          case "NotAllowedError":
            setError(
              createError(
                "PERMISSION_DENIED",
                "Microphone access was denied",
                "Please allow microphone access in your browser and try again"
              )
            );
            break;
          case "NotFoundError":
            setError(
              createError(
                "NO_MICROPHONE",
                "No microphone found",
                "Please connect a microphone and try again"
              )
            );
            break;
          case "NotReadableError":
            setError(
              createError(
                "MICROPHONE_BUSY",
                "Microphone is being used by another application",
                "Please close other applications using the microphone and try again"
              )
            );
            break;
          default:
            setError(
              createError(
                "UNKNOWN_ERROR",
                "Failed to access microphone",
                `Error: ${err.message}`
              )
            );
        }
      } else {
        setError(
          createError(
            "UNKNOWN_ERROR",
            "Failed to access microphone",
            "An unexpected error occurred"
          )
        );
      }

      return null;
    }
  }, [isListening, mediaStream, createError]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      setMediaStream(null);
    }
    setIsListening(false);
  }, [mediaStream]);

  // Cleanup function
  const cleanup = useCallback(() => {
    stopListening();
    setHasPermission(false);
    setError(null);
  }, [stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    hasPermission,
    isListening,
    mediaStream,
    error,
    isSupported,
    requestPermission,
    startListening,
    stopListening,
    cleanup,
  };
}
