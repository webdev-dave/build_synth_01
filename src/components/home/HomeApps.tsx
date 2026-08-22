"use client";

import Link from "next/link";
import { motion, MotionConfig, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";

import { APPS } from "@/lib/navigation";
import { getAppIcon } from "@/lib/appIcons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export function HomeApps() {
  const DrumMachineIcon = getAppIcon("drum-machine");

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {APPS.map((app) => {
          const Icon = getAppIcon(app.id);
          return (
            <motion.div
              key={app.id}
              variants={item}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <Link
                href={app.href}
                className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Card className="h-full transition-colors group-hover:border-foreground/25 group-hover:bg-accent/40">
                  <CardHeader>
                    <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-md border bg-muted/40 text-foreground">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <CardTitle className="text-base">{app.label}</CardTitle>
                    {app.description && (
                      <CardDescription>{app.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                      Open
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}

        {/* Coming soon */}
        <motion.div variants={item}>
          <Card className="flex h-full flex-col items-start justify-center border-dashed bg-transparent shadow-none">
            <CardHeader>
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-md border border-dashed text-muted-foreground">
                <DrumMachineIcon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base text-muted-foreground">
                  Drum machine
                </CardTitle>
                <Badge variant="secondary">Soon</Badge>
              </div>
              <CardDescription>
                Beats, rhythm, and groove tools are on the way.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </motion.section>
    </MotionConfig>
  );
}
