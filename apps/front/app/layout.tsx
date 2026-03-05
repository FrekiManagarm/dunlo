import type { Metadata } from "next";
import { Instrument_Serif, Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import {
  SEO_DEFAULTS,
  SITE_URL,
  getSoftwareApplicationSchema,
} from "@/lib/seo";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SEO_DEFAULTS.title,
  description: SEO_DEFAULTS.description,
  keywords: SEO_DEFAULTS.keywords,
  openGraph: {
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schema = getSoftwareApplicationSchema();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body
        className={`${outfit.variable} ${instrumentSerif.variable} antialiased`}
      >
        <div className="min-h-svh">{children}</div>
        <Toaster richColors />
      </body>
    </html>
  );
}
