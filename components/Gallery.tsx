"use client";

import Image from "next/image";
import { useState } from "react";
import { site } from "@/content/site";

type GalleryItem = {
  src: string;
  title: string;
  colors: string;
  date: string;
  projectUrl: string;
  alt: string;
};

type GallerySection = {
  eyebrow: string;
  title: string;
  description: string;
  initialCount: number;
  expandLabel: string;
  collapseLabel: string;
  viewProjectLabel: string;
  followCtaLabel: string;
  profileCtaLabel: string;
  items: readonly GalleryItem[];
};

function resolveGallery(): GallerySection | null {
  const record = site as unknown as Record<string, unknown>;
  const value = record.gallery;
  if (
    typeof value !== "object" ||
    value === null ||
    !("items" in value) ||
    !Array.isArray((value as GallerySection).items)
  ) {
    return null;
  }
  return value as GallerySection;
}

function resolveInstagramUrl(): string | null {
  const contact = site.contact as {
    instagram?: { url?: string };
  };
  return contact.instagram?.url ?? null;
}

function resolveReviewsPageUrl(): string | null {
  const record = site as unknown as {
    links?: { reviewsPage?: string; reviewsProfile?: string; googleListing?: string };
    contact?: { address?: { mapUrl?: string } };
  };
  return (
    record.links?.reviewsPage ??
    record.links?.reviewsProfile ??
    record.links?.googleListing ??
    record.contact?.address?.mapUrl ??
    null
  );
}

export function Gallery() {
  const gallery = resolveGallery();
  const [expanded, setExpanded] = useState(false);

  if (!gallery) return null;

  const visible = expanded
    ? gallery.items
    : gallery.items.slice(0, gallery.initialCount);
  const hasMore = gallery.items.length > gallery.initialCount;
  const instagramUrl = resolveInstagramUrl();
  const reviewsUrl = resolveReviewsPageUrl();

  return (
    <section
      id="gallery"
      aria-label="Project gallery"
      className="relative overflow-hidden border-t border-border py-16 sm:py-20"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">{gallery.eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {gallery.title}
          </h2>
          <p className="mt-3 text-muted">{gallery.description}</p>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {visible.map((item) => (
            <li key={item.src}>
              <a
                href={item.projectUrl}
                target={item.projectUrl.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.projectUrl.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="gallery-card group relative block aspect-square overflow-hidden rounded-md border border-border bg-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3 pb-3 pt-12">
                  <p className="line-clamp-2 text-xs font-semibold leading-snug text-foreground/95 sm:text-sm">
                    {item.title}
                  </p>
                  <p className="mt-1 line-clamp-2 font-mono text-[0.65rem] leading-snug text-muted sm:text-xs">
                    {item.colors}
                  </p>
                  <p className="mt-1.5 text-[0.65rem] font-medium text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:text-xs">
                    {gallery.viewProjectLabel}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
          {hasMore ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              {expanded ? gallery.collapseLabel : gallery.expandLabel}
            </button>
          ) : null}
          {instagramUrl ? (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              {gallery.followCtaLabel}
            </a>
          ) : null}
          {reviewsUrl ? (
            <a
              href={reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              {gallery.profileCtaLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
