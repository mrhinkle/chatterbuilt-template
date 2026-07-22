import Link from "next/link";
import { formatPhoneDisplay, site } from "@/content/site";

type ScheduleProps = {
  /** Unique id for section landmarks when used on multiple pages */
  id?: string;
};

export function Schedule({ id = "schedule" }: ScheduleProps) {
  const hasEmbed = Boolean(site.schedulingUrl?.trim());

  return (
    <section
      id={id}
      aria-label="Schedule"
      className="relative overflow-hidden border-t border-border py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow">{site.scheduleSection.eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {site.scheduleSection.title}
          </h2>
          <p className="mt-3 text-muted">{site.scheduleSection.description}</p>
        </div>

        {hasEmbed ? (
          <div className="overflow-hidden rounded-md border border-border bg-panel">
            <iframe
              src={site.schedulingUrl}
              title="Schedule an appointment"
              className="w-full border-0 bg-panel"
              style={{ minHeight: 700 }}
              loading="lazy"
            />
          </div>
        ) : (
          <div className="rounded-md border border-border bg-panel p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-xl font-semibold text-foreground">
                  Book by phone
                </p>
                <p className="mt-2 max-w-md text-sm text-muted">
                  Online scheduling is not set up yet. Call us to book a visit or
                  consult, or send a message through the contact form.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href={site.contact.phoneHref} className="btn btn-primary">
                  {site.scheduleSection.phoneCtaLabel ||
                    `Call ${formatPhoneDisplay(site.contact.phone)}`}
                </a>
                <Link href={site.scheduleSection.formCtaHref} className="btn btn-secondary">
                  {site.scheduleSection.formCtaLabel}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
