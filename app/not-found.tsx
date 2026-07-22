import Link from "next/link";
import { CamoPattern } from "@/components/CamoPattern";
import { site } from "@/content/site";

const DEFAULT_NOT_FOUND = {
  title: "Page not found",
  description:
    "That page does not exist. Head home or reach out if you need help.",
  ctaLabel: "Back to home",
  ctaHref: "/",
};

function resolveNotFound() {
  const record = site as unknown as Record<string, unknown>;
  const value = record.notFound;
  if (
    typeof value === "object" &&
    value !== null &&
    "title" in value &&
    "description" in value &&
    "ctaLabel" in value &&
    "ctaHref" in value
  ) {
    return value as typeof DEFAULT_NOT_FOUND;
  }
  return DEFAULT_NOT_FOUND;
}

export default function NotFound() {
  const copy = resolveNotFound();

  return (
    <section
      aria-label="Page not found"
      className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-24 text-center sm:px-6"
    >
      <CamoPattern id="camo-404" opacity={0.05} />
      <div className="relative">
        <p className="font-display text-7xl font-bold text-accent/30 sm:text-8xl">
          404
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {copy.title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted">{copy.description}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={copy.ctaHref} className="btn btn-primary">
            {copy.ctaLabel}
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
