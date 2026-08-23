import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { TooltipProvider } from "@/components/TooltipContext";
import TooltipToggleButton from "@/components/TooltipToggleButton";
import { DetectionModeProvider } from "@/components/DetectionModeContext";
import { AudioContextProvider } from "@/contexts";
import { NavMenu } from "@/components/navigation";
import { APP_NAME } from "@/lib/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  viewportFit: "cover",
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no"
        />

        {/* Instrumaps brand mark: the AudioLines waveform (matches the nav logo) */}
        <link
          rel="icon"
          type="image/svg+xml"
          href="/favicon.svg"
        />

        {/* Apple Touch Icon can still use your JPG */}
        <link
          rel="apple-touch-icon"
          href="/icons/piano-180.jpg"
        />
        <meta
          name="apple-mobile-web-app-capable"
          content="yes"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta
          name="apple-mobile-web-app-title"
          content="Instrumaps"
        />
        <meta
          name="theme-color"
          content="#222222"
        />
        <meta
          name="mobile-web-app-capable"
          content="yes"
        />
        <link
          rel="manifest"
          href="/manifest.json"
        />

        <title>Instrumaps</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-svh flex-col antialiased`}
        role="application"
        aria-label="Web-based synthesizer application"
      >
        <AudioContextProvider>
          <DetectionModeProvider>
            <TooltipProvider>
              <NavMenu />
              {children}
              {/* mt-auto pins the footer to the viewport bottom on short
                  pages; the inner pt-24 guarantees generous air between
                  the content and the footer rule either way. */}
              <footer className="mt-auto pt-24">
                <div className="border-t border-border/60 px-6 py-4">
                  <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-2 text-center font-mono text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:text-left">
                    <Link
                      href="/about"
                      className="transition-colors hover:text-foreground md:order-2 md:text-right"
                    >
                      About the developer
                    </Link>
                    <p className="md:order-1">© {new Date().getFullYear()} {APP_NAME}</p>
                  </div>
                </div>
              </footer>
              <TooltipToggleButton />
            </TooltipProvider>
          </DetectionModeProvider>
        </AudioContextProvider>
      </body>
    </html>
  );
}

export const metadata = {
  // You can add other metadata here, but not viewport
  // For example:
  title: "Instrumaps",
  description: "Interactive music-theory tools. Don't study theory. Play with it.",
};
