import { site } from "@/content/site";
import { JsonLd } from "@/components/JsonLd";
import { SectionCamoTexture } from "@/components/SectionCamoTexture";

export function FAQ() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: site.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="relative overflow-hidden border-t border-border bg-panel py-16 sm:py-20"
    >
      <JsonLd data={faqJsonLd} />
      {/* Texture at ~7% — FAQ cards use solid elevated panels for AA contrast */}
      <SectionCamoTexture opacity={0.07} />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Common questions
          </h2>
        </div>

        <div className="space-y-3">
          {site.faq.map((item) => (
            <details
              key={item.question}
              className="faq-details group rounded-md border border-border bg-panel-elevated"
            >
              <summary className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
                <span className="font-display text-base font-semibold tracking-wide text-foreground sm:text-lg">
                  {item.question}
                </span>
                <svg
                  className="faq-chevron h-5 w-5 shrink-0 text-muted transition-transform duration-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <div className="border-t border-border px-4 py-4 text-sm leading-relaxed text-muted sm:px-5 sm:text-base">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
