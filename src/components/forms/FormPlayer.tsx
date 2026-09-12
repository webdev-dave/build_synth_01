"use client";

/**
 * Transport for a form page: the progression module's key picker and
 * player, labelled for a song. Renders nothing for a form that has no
 * progression — a play button with nothing behind it would be a lie.
 */
import { ProgressionPlayer } from "@/components/progressions/ProgressionPlayer";
import { ProgressionToolbar } from "@/components/progressions/ProgressionToolbar";
import { useForm } from "./FormProvider";

interface FormPlayerProps {
  keyPicker?: boolean;
  tempo?: boolean;
  loop?: boolean;
  label?: string;
  className?: string;
}

export function FormPlayer({
  keyPicker = false,
  tempo = true,
  loop = true,
  label,
  className,
}: FormPlayerProps) {
  const { progression, choruses } = useForm();
  if (!progression) return null;
  return (
    <ProgressionToolbar keyPicker={keyPicker} className={className}>
      <ProgressionPlayer
        label={label ?? (choruses.length > 1 ? "Play the song" : "Play one chorus")}
        tempo={tempo}
        loop={loop}
      />
    </ProgressionToolbar>
  );
}
