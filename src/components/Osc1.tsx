import FrequencySlider from './FrequencySlider';

interface Osc1Props {
  frequency: number;
  onChange: (frequency: number) => void;
  oscillator: OscillatorNode | null;
}

export default function Osc1({ frequency, onChange, oscillator }: Osc1Props) {
  return (
    <div className="p-4 border border-2 rounded-lg bg-osc-bg">
      <h2 className="text-xl font-bold mb-4">Oscillator 1</h2>
      <FrequencySlider
        frequency={frequency}
        onChange={onChange}
        oscillator={oscillator}
      />
    </div>
  );
}