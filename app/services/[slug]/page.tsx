import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconBadge } from "@/components/IconBadge";
import { JsonLd } from "@/components/JsonLd";
import { getServiceBySlug, site } from "@/content/site";
import { serviceImageAlt } from "@/lib/site-helpers";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return site.services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) {
    return { title: "Service not found" };
  }

  const title = service.seo?.title ?? service.name;
  const description = service.seo?.description ?? service.shortDescription ?? site.description;

  return {
    title,
    description,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: `${site.url}/services/${service.slug}`,
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "LocalBusiness",
      name: site.name,
      telephone: site.contact.phoneHref.replace("tel:", ""),
      address: {
        "@type": "PostalAddress",
        streetAddress: site.contact.address.street,
        addressLocality: site.contact.address.city,
        addressRegion: site.contact.address.state,
        postalCode: site.contact.address.zip,
        addressCountry: "US",
      },
    },
    areaServed: {
      "@type": "Place",
      name: site.contact.areaServed,
    },
    url: `${site.url}/services/${service.slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: site.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${site.url}/#services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.name,
        item: `${site.url}/services/${service.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <section
        aria-label={`${service.name} hero`}
        className="relative overflow-hidden border-b border-border"
      >
        <div className="bg-hero-glow absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/#services" className="hover:text-foreground">
                  Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground">{service.name}</li>
            </ol>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="flex items-start gap-4">
                <IconBadge icon={service.icon ?? "wrench"} className="mt-1" />
                <div>
                  <p className="eyebrow">Service</p>
                  <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    {service.name}
                  </h1>
                </div>
              </div>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
                {service.description}
              </p>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-border bg-panel-elevated shadow-lg shadow-black/30">
              <Image
                src={service.image ?? "/visuals/service-repairs.png"}
                alt={serviceImageAlt(service.name)}
                fill
                priority
                quality={75}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Subtle dark edge so bright edges don't fight the dark UI */}
              <div
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="What's included"
        className="border-b border-border py-14 sm:py-16"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-wide text-foreground">
              What&apos;s included
            </h2>
            <ul className="mt-5 space-y-3">
              {(service.included ?? []).map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted sm:text-base">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-wide text-foreground">
              Ideal for
            </h2>
            <ul className="mt-5 space-y-3">
              {(service.idealFor ?? []).map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted sm:text-base">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-steel" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        aria-label="Call to action"
        className="relative overflow-hidden bg-panel py-14 sm:py-16"
      >
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Ready to get this done?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted">
            Tell us about the work, your neighborhood, and timing — or call to book
            a visit.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn btn-primary">
              Get a quote
            </Link>
            <a href={site.contact.phoneHref} className="btn btn-secondary">
              Call {site.contact.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
