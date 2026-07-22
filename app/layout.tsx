import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { site } from "@/content/site";
import {
  GoogleTagManagerNoscript,
  Integrations,
} from "@/components/Integrations";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seo.homeTitle,
    template: `%s | ${site.name}`,
  },
  description: site.seo.homeDescription,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: site.seo.homeTitle,
    description: site.seo.homeDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.homeTitle,
    description: site.seo.homeDescription,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${barlow.variable} h-full antialiased`}
    >
      <body className="bg-site flex min-h-full flex-col font-sans">
        <Integrations />
        <GoogleTagManagerNoscript />
        {children}
      </body>
    </html>
  );
}
