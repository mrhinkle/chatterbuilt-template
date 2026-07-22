import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/content/site";
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

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: site.contact.phoneHref?.replace("tel:", "") ?? site.contact.phone,
  image: `${site.url}/opengraph-image`,
  ...(site.contact.address
    ? {
        address: {
          "@type": "PostalAddress",
          streetAddress: site.contact.address.street,
          addressLocality: site.contact.address.city,
          addressRegion: site.contact.address.state,
          postalCode: site.contact.address.zip,
          addressCountry: "US",
        },
      }
    : {}),
  ...("geo" in site.contact &&
  site.contact.geo &&
  typeof site.contact.geo === "object" &&
  "latitude" in site.contact.geo &&
  "longitude" in site.contact.geo
    ? {
        geo: {
          "@type": "GeoCoordinates",
          latitude: (site.contact.geo as { latitude: number; longitude: number })
            .latitude,
          longitude: (site.contact.geo as { latitude: number; longitude: number })
            .longitude,
        },
      }
    : {}),
  sameAs: [
    "instagram" in site.contact && site.contact.instagram
      ? (site.contact.instagram as { url: string }).url
      : "",
    "links" in site &&
    site.links &&
    typeof site.links === "object" &&
    "googleListing" in site.links
      ? String((site.links as { googleListing: string }).googleListing)
      : "",
  ].filter((v) => v.length > 0),
  areaServed: site.contact.areaServed
    ? {
        "@type": "Place",
        name: site.contact.areaServed,
      }
    : undefined,
  priceRange: "$$",
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
        <JsonLd data={localBusinessJsonLd} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
