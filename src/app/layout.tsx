import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import "./admin/admin.css";
import { Cormorant_Garamond, Outfit, Space_Mono, Syne } from "next/font/google";
import { AppToastProvider } from "@/components/app-toast-provider";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { JsonLd } from "@/components/seo/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: "Jungle Wildlife Tours · Manuel Antonio, Costa Rica",
    template: "%s · Jungle Wildlife Tours",
  },
  description: "Nature and wildlife tours in Manuel Antonio, Costa Rica. Ground safari, mangrove walk, and night walk with ICT-certified local guides.",
  keywords: [
    "Manuel Antonio", "Costa Rica", "Quepos", "nature tours", "wildlife",
    "safari", "mangrove", "night walk", "jungle tours", "ICT certified",
    "ecotourism", "Manuel Antonio tours", "Costa Rica wildlife",
    "birdwatching", "Damas Island", "kayak manglar",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Jungle Wildlife Tours",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jungle Wildlife Tours",
    description: "Nature and wildlife tours in Manuel Antonio, Costa Rica.",
  },
  robots: { index: true, follow: true },
};

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "700"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`h-full antialiased ${cormorantGaramond.variable} ${outfit.variable} ${spaceMono.variable} ${syne.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg text-text grain-overlay">
        <MotionProvider>
          <AppToastProvider>
            {children}
          </AppToastProvider>
        </MotionProvider>
        <JsonLd />
      </body>
    </html>
  );
}
