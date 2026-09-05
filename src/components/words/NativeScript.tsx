import { cn } from "@/lib/utils";
import { isRtlLang } from "@/lib/words/registry";

interface NativeScriptProps {
  spelling: string;
  lang: string;
  className?: string;
}

/**
 * Native letters only — Hebrew, Yiddish, or any other script.
 *
 * Keep `dir` on this node and nowhere around it. A parent `dir="rtl"`
 * that also holds English ("Yiddish", parentheses, "also spelled")
 * reverses `ms-*` / flex order and glues the two scripts together.
 * Space those with an LTR flex `gap`, `ms-*` on an LTR wrapper, or a
 * literal `" "`.
 */
export function NativeScript({ spelling, lang, className }: NativeScriptProps) {
  const rtl = isRtlLang(lang);
  return (
    <span
      lang={lang}
      dir={rtl ? "rtl" : "ltr"}
      className={cn(rtl && "[unicode-bidi:isolate]", className)}
    >
      {spelling}
    </span>
  );
}
