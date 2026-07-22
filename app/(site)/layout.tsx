import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ChatWidget } from "@/components/ChatWidget";
import { site } from "@/content/site";
import { kb } from "@/lib/kb";

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

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <JsonLd data={localBusinessJsonLd} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget
        entries={kb.entries}
        businessName={site.name}
        contactHref="/contact"
      />
    </>
  );
}
