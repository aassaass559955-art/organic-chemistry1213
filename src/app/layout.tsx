import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "الكيمياء العضوية | الباحث مرتضى عوض — Organic Chemistry Platform",
    template: "%s | الكيمياء العضوية",
  },
  description:
    "منصة علمية متخصصة لنشر البحوث والدراسات والأطاريح والمقالات التعليمية في الكيمياء العضوية باللغتين العربية والإنجليزية — بإشراف الباحث مرتضى عوض. A bilingual academic platform for organic chemistry research curated by researcher Murtada Awad.",
  keywords: [
    "الكيمياء العضوية",
    "Organic Chemistry",
    "مرتضى عوض",
    "Murtada Awad",
    "أبحاث كيمياء",
    "تفاعلات عضوية",
    "آليات التفاعلات",
    "التحليل الطيفي",
  ],
  authors: [{ name: "Murtada Awad" }],
  openGraph: {
    type: "website",
    locale: "ar_IQ",
    alternateLocale: "en_US",
    siteName: "Organic Chemistry — الكيمياء العضوية",
    title: "الكيمياء العضوية | الباحث مرتضى عوض",
    description:
      "منصة علمية متخصصة لنشر البحوث والدراسات والأطاريح في الكيمياء العضوية بالعربية والإنجليزية.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "الكيمياء العضوية — Organic Chemistry",
  alternateName: "Organic Chemistry Platform",
  url: siteUrl,
  inLanguage: ["ar", "en"],
  author: { "@type": "Person", name: "Murtada Awad", jobTitle: "Organic Chemistry Researcher" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased bg-background text-foreground">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
