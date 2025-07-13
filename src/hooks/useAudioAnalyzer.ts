import { useState, useCallback, useEffect, useRef } from "react";

export interface UseAudioAnalyzerReturn {
  analyzerNode: AnalyserNode | null;
  audioLevel: number;
  isAnalyzing: boolean;
  startAnalysis: (mediaStream: MediaStream) => Promise<void>;
  stopAnalysis: () => void;
  getFrequencyData: () => Float32Array | null;
  cleanup: () => void;
}

export function useAudioAnalyzer(
  audioContext: AudioContext | null
): UseAudioAnalyzerReturn {
  const [analyzerNode, setAnalyzerNode] = useState<AnalyserNode | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Refs for audio processing
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const frequencyDataRef = useRef<Float32Array | null>(null); // For pitch detection
  const audioLevelDataRef = useRef<Uint8Array | null>(null); // For audio level calculation
  const audioLevelTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pitchDetectionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update frequencies for different purposes
  const AUDIO_LEVEL_UPDATE_RATE = 15; // 67ms - Smooth circle animation
  // const PITCH_DETECTION_RATE = 10; // Previously used for on-the-fly YIN pitch detection

  // Calculate simple audio level for visual feedback
  const calculateAudioLevel = useCallback(
    (frequencyData: Uint8Array): number => {
      // Calculate RMS from byte frequency data (0-255 range)
      let sum = 0;
      for (let i = 0; i < frequencyData.length; i++) {
        const normalizedValue = frequencyData[i] / 255; // Convert to 0-1 range
        sum += normalizedValue * normalizedValue;
      }
      const rms = Math.sqrt(sum / frequencyData.length);

      // Apply some scaling for better visual response
      const scaled = Math.min(rms * 2, 1); // Boost sensitivity slightly
      return scaled;
    },
    []
  );

  // Start audio analysis
  const startAnalysis = useCallback(
    async (mediaStream: MediaStream) => {
      if (!audioContext || isAnalyzing) {
        return;
      }

      try {
        // Ensure AudioContext is running
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        // Create analyzer node
        const analyzer = audioContext.createAnalyser();

        // Configure analyzer for pitch detection
        analyzer.fftSize = 4096; // Large FFT for good frequency resolution
        analyzer.smoothingTimeConstant = 0.3; // Some smoothing to reduce noise
        analyzer.minDecibels = -90; // Wide dynamic range
        analyzer.maxDecibels = -10;

        // Create source node from media stream
        const sourceNode = audioContext.createMediaStreamSource(mediaStream);

        // Connect source to analyzer (no output to speakers)
        sourceNode.connect(analyzer);

        // Create frequency data buffers
        const bufferLength = analyzer.frequencyBinCount;
        const frequencyData = new Float32Array(bufferLength); // For pitch detection
        const audioLevelData = new Uint8Array(bufferLength); // For audio level calculation

        // Store references
        setAnalyzerNode(analyzer);
        sourceNodeRef.current = sourceNode;
        frequencyDataRef.current = frequencyData;
        audioLevelDataRef.current = audioLevelData;
        setIsAnalyzing(true);

        // Start audio level updates for visual feedback (15fps)
        audioLevelTimerRef.current = setInterval(() => {
          if (analyzer && audioLevelData) {
            analyzer.getByteFrequencyData(audioLevelData);
            const level = calculateAudioLevel(audioLevelData);
            setAudioLevel(level);
          }
        }, 1000 / AUDIO_LEVEL_UPDATE_RATE);

        console.log("Audio analysis started successfully");
      } catch (error) {
        console.error("Error starting audio analysis:", error);
        stopAnalysis();
      }
    },
    [audioContext, isAnalyzing, calculateAudioLevel]
  );

  // Stop audio analysis
  const stopAnalysis = useCallback(() => {
    // Clear timers
    if (audioLevelTimerRef.current) {
      clearInterval(audioLevelTimerRef.current);
      audioLevelTimerRef.current = null;
    }

    if (pitchDetectionTimerRef.current) {
      clearInterval(pitchDetectionTimerRef.current);
      pitchDetectionTimerRef.current = null;
    }

    // Disconnect and cleanup audio nodes
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }

    // Reset state
    setAnalyzerNode(null);
    setAudioLevel(0);
    setIsAnalyzing(false);
    frequencyDataRef.current = null;
    audioLevelDataRef.current = null;

    console.log("Audio analysis stopped");
  }, []);

  // Get current frequency data for pitch detection
  const getFrequencyData = useCallback((): Float32Array | null => {
    if (!analyzerNode || !frequencyDataRef.current) {
      return null;
    }

    // Get fresh frequency data
    analyzerNode.getFloatFrequencyData(frequencyDataRef.current);
    return frequencyDataRef.current;
  }, [analyzerNode]);

  // Cleanup function
  const cleanup = useCallback(() => {
    stopAnalysis();
  }, [stopAnalysis]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Handle audio context state changes
  useEffect(() => {
    if (!audioContext && isAnalyzing) {
      // Audio context was removed, stop analysis
      stopAnalysis();
    }
  }, [audioContext, isAnalyzing, stopAnalysis]);

  return {
    analyzerNode,
    audioLevel,
    isAnalyzing,
    startAnalysis,
    stopAnalysis,
    getFrequencyData,
    cleanup,
  };
}
