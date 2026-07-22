import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";
import { Schedule } from "@/components/Schedule";
import { CamoPattern } from "@/components/CamoPattern";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: site.seo.contactTitle,
  description: site.seo.contactDescription,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: `${site.seo.contactTitle} | ${site.name}`,
    description: site.seo.contactDescription,
    url: `${site.url}/contact`,
  },
};

export default function ContactPage() {
  return (
    <>
      <section
        aria-label="Contact hero"
        className="relative overflow-hidden border-b border-border py-14 sm:py-16"
      >
        <CamoPattern id="camo-contact" opacity={0.05} />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow">Get in touch</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Contact {site.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Quotes, scheduling, and project questions.{" "}
            <a
              href={site.contact.phoneHref}
              className="text-accent hover:text-accent-hover"
            >
              {site.contact.phoneLabel}
            </a>{" "}
            or send a message below.
          </p>
          <p className="mt-3 max-w-xl text-sm text-muted">
            {site.contact.hours.note}
          </p>
        </div>
      </section>
      <ContactSection />
      <Schedule id="schedule-contact" />
    </>
  );
}
