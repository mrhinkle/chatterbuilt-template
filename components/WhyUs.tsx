import { site } from "@/content/site";
import { CamoPattern } from "@/components/CamoPattern";

type WhySection = {
  eyebrow: string;
  title: string;
  items: readonly { title: string; description: string }[];
};

/**
 * "Why us" feature grid. Reads site.whyUs when present.
 * Also accepts any other top-level key starting with "why" that has an items
 * array, so MCP-rendered industry presets drop in without a rename step.
 */
function resolveWhySection(
  record: Record<string, unknown>,
): WhySection | null {
  const preferred = record.whyUs;
  if (isWhySection(preferred)) return preferred;

  for (const [key, value] of Object.entries(record)) {
    if (key === "whyUs") continue;
    if (!key.startsWith("why")) continue;
    if (isWhySection(value)) return value;
  }
  return null;
}

function isWhySection(value: unknown): value is WhySection {
  return (
    typeof value === "object" &&
    value !== null &&
    "items" in value &&
    Array.isArray((value as WhySection).items) &&
    "eyebrow" in value &&
    "title" in value
  );
}

export function WhyUs() {
  const section = resolveWhySection(
    site as unknown as Record<string, unknown>,
  );
  if (!section) return null;

  return (
    <section
      id="why-us"
      aria-label={section.eyebrow}
      className="relative overflow-hidden border-t border-border py-16 sm:py-20"
    >
      <CamoPattern id="camo-why" opacity={0.04} />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">{section.eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {section.title}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {section.items.map((item) => (
            <div
              key={item.title}
              className="rounded-md border border-border bg-panel p-6"
            >
              <h3 className="font-display text-lg font-bold tracking-wide text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
