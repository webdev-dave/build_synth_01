import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { TooltipProvider } from "@/components/TooltipContext";
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
        {/* Instrumaps brand mark: the AudioLines waveform (matches the nav logo) */}
        <link
          rel="icon"
          type="image/svg+xml"
          href="/favicon.svg"
        />

        {/* Apple touch icon: brand mark, generated at build time
            (src/app/icons/apple-touch.png). */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch.png"
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
        {/* Document <title> is driven by the Metadata API (title.template),
            so each route contributes its own title + the Instrumaps suffix. */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-svh flex-col antialiased`}
        role="application"
        aria-label="Instrumaps — interactive music-theory tools"
      >
        <AudioContextProvider>
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
          </TooltipProvider>
        </AudioContextProvider>
      </body>
    </html>
  );
}

const SITE_URL = "https://instrumaps.com";
const SITE_NAME = "Instrumaps";
const SITE_DESCRIPTION =
  "Interactive music-theory tools. Don't study theory. Play with it.";
const OG_IMAGE_ALT = "Instrumaps — interactive music-theory tools";

// Branding for tab titles, share previews, and PWA install — none of which is
// visible on the page itself.
//   - title.template appends "· Instrumaps" to every child route's title, and
//     title.default covers the home page.
//   - openGraph/twitter deliberately omit title & description so they inherit
//     each page's resolved title/description (a share of /synth shows the synth
//     title, not the generic brand line).
//   - metadataBase makes /og.png resolve to an absolute URL, which link
//     scrapers (WhatsApp, iMessage, X) require.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — interactive music-theory tools`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
};
