import { site } from "@/content/site";
import { SectionCamoTexture } from "@/components/SectionCamoTexture";

export function Process() {
  return (
    <section
      id="process"
      aria-label="Process"
      className="relative overflow-hidden border-t border-border bg-panel py-16 sm:py-20"
    >
      {/* Texture at ~7% — decorative; cards use solid elevated panels for AA contrast */}
      <SectionCamoTexture opacity={0.07} />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">{site.process.eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {site.process.title}
          </h2>
        </div>

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {site.process.steps.map((step) => (
            <li
              key={step.step}
              className="relative rounded-md border border-border bg-panel-elevated p-5"
            >
              <span className="font-display text-3xl font-bold text-accent/40">
                {String(step.step).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-lg font-bold tracking-wide text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
