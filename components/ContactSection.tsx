import { formatPhoneDisplay, site } from "@/content/site";
import { ContactForm } from "@/components/ContactForm";

type SecondaryPhone = { label: string; phone: string; href: string };
type Instagram = { handle: string; url: string };

function readSecondaryPhone(contact: object): SecondaryPhone | undefined {
  if (!("secondaryPhone" in contact)) return undefined;
  const value = (contact as { secondaryPhone?: unknown }).secondaryPhone;
  if (typeof value !== "object" || value === null) return undefined;
  const o = value as Record<string, unknown>;
  if (
    typeof o.label === "string" &&
    typeof o.phone === "string" &&
    typeof o.href === "string"
  ) {
    return { label: o.label, phone: o.phone, href: o.href };
  }
  return undefined;
}

function readInstagram(contact: object): Instagram | undefined {
  if (!("instagram" in contact)) return undefined;
  const value = (contact as { instagram?: unknown }).instagram;
  if (typeof value !== "object" || value === null) return undefined;
  const o = value as Record<string, unknown>;
  if (typeof o.handle === "string" && typeof o.url === "string") {
    return { handle: o.handle, url: o.url };
  }
  return undefined;
}

export function ContactSection() {
  const contact = site.contact;
  const { address, phone, phoneHref, phoneLabel, hours } = contact;
  const secondaryPhone = readSecondaryPhone(contact);
  const instagram = readInstagram(contact);

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative overflow-hidden border-t border-border py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">{site.contactSection.eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {site.contactSection.title}
          </h2>
          <p className="mt-3 text-muted">{site.contactSection.description}</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-md border border-border bg-panel p-5 sm:p-6">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-2">
            {address ? (
              <div className="rounded-md border border-border bg-panel p-5">
                <p className="eyebrow mb-3">Location</p>
                <address className="not-italic text-sm leading-relaxed text-muted">
                  {address.note ? (
                    <p className="font-medium text-foreground">{address.note}</p>
                  ) : null}
                  {address.street ? <p className="mt-2">{address.street}</p> : null}
                  <p>
                    {address.city}, {address.state} {address.zip}
                  </p>
                </address>
                {address.mapUrl ? (
                  <a
                    href={address.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex text-sm font-medium text-accent hover:text-accent-hover"
                  >
                    Open in Maps →
                  </a>
                ) : null}
              </div>
            ) : null}

            {phone ? (
              <div className="rounded-md border border-border bg-panel p-5">
                <p className="eyebrow mb-3">Phone</p>
                <a
                  href={phoneHref}
                  className="font-display text-xl font-semibold text-foreground hover:text-accent"
                >
                  {formatPhoneDisplay(phone)}
                </a>
                {phoneLabel ? (
                  <p className="mt-2 text-sm text-muted">{phoneLabel}</p>
                ) : null}
                {secondaryPhone ? (
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="text-xs font-medium tracking-wide text-muted-dim uppercase">
                      {secondaryPhone.label}
                    </p>
                    <a
                      href={secondaryPhone.href}
                      className="mt-1 inline-block text-sm font-medium text-muted hover:text-foreground"
                    >
                      {secondaryPhone.phone}
                    </a>
                  </div>
                ) : null}
              </div>
            ) : null}

            {hours ? (
              <div className="rounded-md border border-border bg-panel p-5">
                <p className="eyebrow mb-3">Hours</p>
                <p className="text-sm font-medium text-foreground">{hours.note}</p>
                {hours.detail ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted">{hours.detail}</p>
                ) : null}
              </div>
            ) : null}

            {instagram ? (
              <div className="rounded-md border border-border bg-panel p-5">
                <p className="eyebrow mb-3">Social</p>
                <a
                  href={instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-muted hover:text-foreground"
                >
                  Instagram {instagram.handle}
                </a>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}
