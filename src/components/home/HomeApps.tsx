"use client";

import Link from "next/link";
import { motion, MotionConfig, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";

import { APP_SECTION_GROUPS, type NavItem } from "@/lib/navigation";
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

function AppTile({ app }: { app: NavItem }) {
  const Icon = getAppIcon(app.id);
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="h-full"
    >
      <Link
        href={app.href}
        className="group block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Card className="flex h-full flex-col transition-colors group-hover:border-foreground/25 group-hover:bg-accent/40">
          <CardHeader className="flex-1">
            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-md border bg-muted/40 text-foreground">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{app.label}</CardTitle>
              {app.beta && <Badge variant="secondary">Beta</Badge>}
            </div>
            {app.description && (
              <CardDescription className="min-h-10">
                {app.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="mt-auto">
            <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
              Open
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function ComingSoonTile() {
  const DrumMachineIcon = getAppIcon("drum-machine");
  return (
    <motion.div variants={item} className="h-full">
      <Card className="flex h-full flex-col border-dashed bg-transparent shadow-none">
        <CardHeader className="flex-1">
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-md border border-dashed text-muted-foreground">
            <DrumMachineIcon className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base text-muted-foreground">
              Drum machine
            </CardTitle>
            <Badge variant="secondary">Soon</Badge>
          </div>
          <CardDescription className="min-h-10">
            Beats, rhythm, and groove tools are on the way.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-auto" aria-hidden="true">
          <span className="invisible inline-flex items-center gap-1 text-sm font-medium">
            Open
            <ArrowRight className="h-4 w-4" />
          </span>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function HomeApps() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="mt-20 space-y-14">
        {APP_SECTION_GROUPS.map((group) => (
          <section
            key={group.section.id}
            aria-labelledby={`home-section-${group.section.id}`}
          >
            <div className="mb-5">
              <h2
                id={`home-section-${group.section.id}`}
                className="text-sm font-medium text-foreground"
              >
                {group.section.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {group.section.description}
              </p>
            </div>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {group.apps.map((app) => (
                <AppTile key={app.id} app={app} />
              ))}
              {group.section.id === "tools" && <ComingSoonTile />}
            </motion.div>
          </section>
        ))}
      </div>
    </MotionConfig>
  );
}
