// AudioWorkletProcessor that forwards input PCM data to main thread
class PcmCaptureProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const inputChannelData = inputs[0][0];
    if (inputChannelData) {
      // Copy the Float32Array to transfer list for efficiency
      this.port.postMessage(inputChannelData, [inputChannelData.buffer]);
    }
    // Keep processor alive
    return true;
  }
}

registerProcessor("pcm-capture", PcmCaptureProcessor);
