import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/TooltipContext";
import TooltipToggleButton from "@/components/TooltipToggleButton";
import { DetectionModeProvider } from "@/components/DetectionModeContext";

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
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no"
        />

        {/* Larger piano emoji with better vertical alignment */}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%22 y=%2250%22 font-size=%2280%22 text-anchor=%22middle%22 alignment-baseline=%22middle%22 style=%22dominant-baseline:middle%22>🎹</text></svg>"
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
          content="Synth-v01"
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

        {/* Remove the emoji from the title */}
        <title>Synth-v01</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        role="application"
        aria-label="Web-based synthesizer application"
      >
        <DetectionModeProvider>
          <TooltipProvider>
            {children}
            <TooltipToggleButton />
          </TooltipProvider>
        </DetectionModeProvider>
      </body>
    </html>
  );
}

export const metadata = {
  // You can add other metadata here, but not viewport
  // For example:
  description: "A simple web-based synthesizer application",
};
