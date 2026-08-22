import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/TooltipContext";
import TooltipToggleButton from "@/components/TooltipToggleButton";
import { DetectionModeProvider } from "@/components/DetectionModeContext";
import { AudioContextProvider } from "@/contexts";
import { NavMenu } from "@/components/navigation";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        role="application"
        aria-label="Web-based synthesizer application"
      >
        <AudioContextProvider>
          <DetectionModeProvider>
            <TooltipProvider>
              <NavMenu />
              {children}
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
