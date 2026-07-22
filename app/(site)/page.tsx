import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { WhyUs } from "@/components/WhyUs";
import { Gallery } from "@/components/Gallery";
import { Reviews } from "@/components/Reviews";
import { FAQ } from "@/components/FAQ";
import { FindUs } from "@/components/FindUs";
import { ContactSection } from "@/components/ContactSection";
import { Schedule } from "@/components/Schedule";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: {
    absolute: site.seo.homeTitle,
  },
  description: site.seo.homeDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: site.seo.homeTitle,
    description: site.seo.homeDescription,
    url: site.url,
  },
};

function hasItems(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    "items" in value &&
    Array.isArray((value as { items: unknown }).items) &&
    (value as { items: unknown[] }).items.length > 0
  );
}

function hasCards(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    "cards" in value &&
    Array.isArray((value as { cards: unknown }).cards) &&
    (value as { cards: unknown[] }).cards.length > 0
  );
}

function hasWhySection(record: Record<string, unknown>): boolean {
  if (hasItems(record.whyUs)) return true;
  for (const [key, value] of Object.entries(record)) {
    if (!key.startsWith("why") || key === "whyUs") continue;
    if (hasItems(value)) return true;
  }
  return false;
}

export default function HomePage() {
  const record = site as unknown as Record<string, unknown>;
  const hasGallery = hasItems(record.gallery);
  const hasReviews = hasItems(record.reviews);
  const hasFindUs = hasCards(record.findUs);
  const hasWhy = hasWhySection(record);

  return (
    <>
      <Hero />
      <TrustBar />
      <Services />
      <Process />
      {hasWhy ? <WhyUs /> : null}
      {hasGallery ? <Gallery /> : null}
      {hasReviews ? <Reviews /> : null}
      <FAQ />
      {hasFindUs ? <FindUs /> : null}
      <ContactSection />
      <Schedule />
    </>
  );
}
