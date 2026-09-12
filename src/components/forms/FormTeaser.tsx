"use client";

/**
 * The short, playable version of a form for pages that are *about
 * something else* — the genre page's Form panel. One chorus: the chorus
 * strip with its sung lines and answers, a play button, the key picker.
 * No song strip and no prose: the spoke at /forms/<slug> owns "what a
 * chorus is"; this only lets the reader hear one go round. Wraps its own
 * provider (and clock) so it can sit on any page.
 */
import { getFormLick } from "@/content/forms/licks";
import type { Form } from "@/lib/forms/registry";
import { cn } from "@/lib/utils";
import { FormMap } from "./FormMap";
import { FormPlayer } from "./FormPlayer";
import { FormProvider } from "./FormProvider";

interface FormTeaserProps {
  form: Form;
  defaultKeyRootPc?: number;
  playLabel?: string;
  className?: string;
}

export function FormTeaser({
  form,
  defaultKeyRootPc,
  playLabel = "Play one chorus",
  className,
}: FormTeaserProps) {
  return (
    <FormProvider
      form={form}
      defaultKeyRootPc={defaultKeyRootPc}
      wholeSong={false}
      lick={getFormLick(form.slug)}
    >
      <div className={cn("space-y-3", className)}>
        <FormPlayer keyPicker tempo={false} label={playLabel} />
        <FormMap song={false} beats={false} />
      </div>
    </FormProvider>
  );
}
