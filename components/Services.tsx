import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { serviceImageAlt } from "@/lib/site-helpers";
import { IconBadge } from "@/components/IconBadge";
import { CamoPattern } from "@/components/CamoPattern";

type ServicesSection = {
  eyebrow: string;
  title: string;
  description: string;
};

const DEFAULT_SERVICES_SECTION: ServicesSection = {
  eyebrow: "Services",
  title: "What we handle",
  description: "Clear scope, fair quotes, and careful work.",
};

function resolveServicesSection(): ServicesSection {
  const record = site as unknown as Record<string, unknown>;
  const value = record.servicesSection;
  if (
    typeof value === "object" &&
    value !== null &&
    "eyebrow" in value &&
    "title" in value &&
    "description" in value
  ) {
    return value as ServicesSection;
  }
  return DEFAULT_SERVICES_SECTION;
}

export function Services() {
  const section = resolveServicesSection();

  return (
    <section
      id="services"
      aria-label="Services"
      className="relative overflow-hidden py-16 sm:py-20"
    >
      <CamoPattern id="camo-services" opacity={0.04} />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">{section.eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {section.title}
          </h2>
          <p className="mt-3 text-muted">{section.description}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {site.services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="card-hover group flex flex-col overflow-hidden rounded-md border border-border bg-panel"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-panel-elevated">
                <Image
                  src={service.image ?? "/visuals/service-repairs.png"}
                  alt={serviceImageAlt(service.name)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={75}
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div className="absolute left-3 top-3">
                  <IconBadge
                    icon={service.icon ?? "wrench"}
                    className="shadow-lg shadow-black/40 ring-1 ring-border"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-bold tracking-wide text-foreground group-hover:text-accent">
                  {service.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {service.shortDescription}
                </p>
                <span className="mt-4 text-sm font-semibold text-accent">
                  Learn more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
