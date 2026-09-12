import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LESSON_BUCKETS } from "@/lib/lessons/registry";
import { bucketCount, layerRows, startHereLabel } from "@/lib/lessons/curriculum";
import { getAppIcon } from "@/lib/appIcons";

/**
 * The curriculum index: seven buckets in reading order, each a door to its
 * hub plus one "start here" page, with counts derived from the module
 * registries. Below it, the genre-page stack — which bucket teaches which
 * layer — so the hierarchy the URLs don't show is visible here.
 *
 * Server component; nothing here sounds or moves.
 */
export function LessonsIndex() {
  return (
    <div className="space-y-12">
      <ol className="space-y-3" aria-label="Lesson modules in reading order">
        {LESSON_BUCKETS.map((bucket, i) => {
          const Icon = getAppIcon(bucket.id);
          const count = bucketCount(bucket);
          const soon = count.total - count.live;
          return (
            <li
              key={bucket.id}
              className="rounded-lg border p-4 transition-colors hover:border-foreground/25 sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5">
                <div className="flex items-center gap-3 sm:w-56 sm:shrink-0">
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                  <Link
                    href={bucket.href}
                    className="text-base font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    {bucket.name}
                  </Link>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs text-muted-foreground">
                    {bucket.teaches}
                    <span aria-hidden="true"> · </span>
                    <span className="tabular-nums">
                      {count.live} {count.live === 1 ? "page" : "pages"}
                      {soon > 0 && ` · ${soon} coming`}
                    </span>
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {bucket.blurb}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                    <Link
                      href={bucket.startHere}
                      className="group inline-flex items-center gap-1.5 font-medium text-foreground"
                    >
                      <span className="text-muted-foreground">Start here:</span>
                      <span className="underline-offset-4 group-hover:underline">
                        {startHereLabel(bucket)}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      href={bucket.href}
                      className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      Browse all
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <section aria-labelledby="layer-stack-heading">
        <h2 id="layer-stack-heading" className="text-sm font-medium text-foreground">
          How a genre page stacks them
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Every genre is a stack of layers, read top to bottom. Each layer on a
          genre page opens into the module that teaches it.
        </p>
        <dl className="mt-4 divide-y rounded-lg border">
          {layerRows().map((row) => (
            <div
              key={row.layer}
              className="grid grid-cols-[6rem_1fr] gap-x-4 gap-y-1 px-4 py-2.5 sm:grid-cols-[7rem_1fr_14rem]"
            >
              <dt className="font-mono text-xs text-foreground">{row.label}</dt>
              <dd className="text-sm text-muted-foreground">{row.blurb}</dd>
              <dd className="col-start-2 text-sm sm:col-start-3 sm:text-right">
                {row.bucket ? (
                  <Link
                    href={row.bucket.href}
                    className="inline-flex items-center gap-1 text-foreground underline-offset-4 hover:underline"
                  >
                    {row.bucket.name}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                ) : (
                  <span className="text-muted-foreground">no module yet</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
