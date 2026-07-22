"use client";

import { useState } from "react";
import { site } from "@/content/site";

type ReviewItem = {
  title: string;
  quote: string;
  author: string;
  date: string;
};

type ReviewsSection = {
  eyebrow: string;
  title: string;
  description: string;
  initialCount: number;
  expandLabel: string;
  collapseLabel: string;
  link?: { label: string; href: string };
  items: readonly ReviewItem[];
};

function resolveReviews(): ReviewsSection | null {
  const record = site as unknown as Record<string, unknown>;
  const value = record.reviews;
  if (
    typeof value !== "object" ||
    value === null ||
    !("items" in value) ||
    !Array.isArray((value as ReviewsSection).items)
  ) {
    return null;
  }
  return value as ReviewsSection;
}

export function Reviews() {
  const reviews = resolveReviews();
  const [expanded, setExpanded] = useState(false);

  if (!reviews) return null;

  const visible = expanded
    ? reviews.items
    : reviews.items.slice(0, reviews.initialCount);
  const hasMore = reviews.items.length > reviews.initialCount;

  return (
    <section
      id="reviews"
      aria-label="Customer reviews"
      className="relative overflow-hidden border-t border-border bg-panel py-16 sm:py-20"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">{reviews.eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {reviews.title}
          </h2>
          <p className="mt-3 text-muted">{reviews.description}</p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <li key={`${item.author}-${item.date}-${item.title}`}>
              <article className="flex h-full flex-col rounded-md border border-border bg-panel-elevated p-5">
                <p
                  className="text-sm tracking-wide text-accent"
                  aria-label="5 out of 5 stars"
                >
                  ★★★★★
                </p>
                <h3 className="mt-3 font-display text-base font-semibold tracking-wide text-foreground">
                  {item.title}
                </h3>
                <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  “{item.quote}”
                </blockquote>
                <footer className="mt-4 text-xs text-muted-dim">
                  <span className="font-medium text-foreground">{item.author}</span>
                  <span className="mx-1.5" aria-hidden="true">
                    ·
                  </span>
                  <time dateTime={item.date}>{item.date}</time>
                </footer>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {hasMore ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              {expanded ? reviews.collapseLabel : reviews.expandLabel}
            </button>
          ) : null}
          {reviews.link?.href ? (
            <a
              href={reviews.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              {reviews.link.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
