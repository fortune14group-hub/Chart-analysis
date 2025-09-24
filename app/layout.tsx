import type { Metadata } from "next";
import "./globals.css";
import CTASticky from "@/components/CTASticky";

const title = "Chart2Signals by BetSpread – Ladda upp en graf, få köp/sälj-signaler";
const description =
  "Ladda upp en bild på en aktie/krypto/forex-graf och få teknisk analys med tydliga köp/sälj-signaler. SMA/EMA/RSI/MACD/Bollinger + SL/TP. Fungerar lokalt med CSV-fallback.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title,
  description,
  applicationName: "Chart2Signals",
  keywords: [
    "teknisk analys",
    "köp sälj signaler",
    "aktier",
    "krypto",
    "forex",
    "SMA",
    "EMA",
    "RSI",
    "MACD",
    "Bollinger",
    "ATR"
  ],
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Chart2Signals by BetSpread",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "Chart2Signals – exempelanalys" }],
    locale: "sv_SE",
    type: "website"
  },
  twitter: { card: "summary_large_image", title, description, images: ["/api/og"] },
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.ico" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Chart2Signals",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "SEK" },
    publisher: { "@type": "Organization", name: "BetSpread" }
  };

  return (
    <html lang="sv">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-dvh bg-background text-foreground">
        {children}
        <CTASticky />
      </body>
    </html>
  );
}
