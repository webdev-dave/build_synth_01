/**
 * Native-script spelling as quiet text — safe inside a <Link> (no button).
 * Hub cards use this; spoke pages use <WordBanner> which adds listen.
 */
import { cn } from "@/lib/utils";
import { getWord, spellingDiffers } from "@/lib/words/registry";
import { NativeScript } from "./NativeScript";

interface NativeSpellingProps {
  id: string;
  className?: string;
}

export function NativeSpelling({ id, className }: NativeSpellingProps) {
  const word = getWord(id);
  if (!word) return null;
  // Turkish "Hicaz" is already its own native spelling — nothing to add.
  if (!spellingDiffers(id, word.native.spelling)) return null;

  // Margin/padding stay on this LTR wrapper. See NativeScript.
  return (
    <span className={cn("font-normal text-muted-foreground", className)}>
      <NativeScript
        spelling={word.native.spelling}
        lang={word.native.lang}
      />
    </span>
  );
}
