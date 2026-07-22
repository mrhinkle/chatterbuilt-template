import { getFindUsHref } from "@/lib/site-helpers";
import { site } from "@/content/site";

type FindUsCard = {
  id: string;
  title: string;
  sublabel: string;
};

type FindUsSection = {
  eyebrow: string;
  title: string;
  openLabel: string;
  cards: readonly FindUsCard[];
};

function resolveFindUs(): FindUsSection | null {
  const record = site as unknown as Record<string, unknown>;
  const value = record.findUs;
  if (
    typeof value !== "object" ||
    value === null ||
    !("cards" in value) ||
    !Array.isArray((value as FindUsSection).cards)
  ) {
    return null;
  }
  return value as FindUsSection;
}

export function FindUs() {
  const findUs = resolveFindUs();
  if (!findUs) return null;

  return (
    <section
      id="find-us"
      aria-label="Find us online"
      className="relative border-t border-border py-12 sm:py-14"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow">{findUs.eyebrow}</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {findUs.title}
          </h2>
        </div>

        <ul className="grid gap-4 sm:grid-cols-3">
          {findUs.cards.map((card) => (
            <li key={card.id}>
              <a
                href={getFindUsHref(card.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover group flex h-full flex-col rounded-md border border-border bg-panel p-5"
              >
                <p className="font-display text-lg font-bold tracking-wide text-foreground group-hover:text-accent">
                  {card.title}
                </p>
                <p className="mt-2 text-sm text-muted">{card.sublabel}</p>
                <span
                  className="mt-4 text-sm font-semibold text-accent"
                  aria-hidden="true"
                >
                  {findUs.openLabel}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
