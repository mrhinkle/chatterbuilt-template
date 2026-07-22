import Link from "next/link";
import { site } from "@/content/site";

function readInstagram(): { handle: string; url: string } | undefined {
  const contact = site.contact as {
    instagram?: { handle?: string; url?: string };
  };
  const ig = contact.instagram;
  if (ig && typeof ig.handle === "string" && typeof ig.url === "string") {
    return { handle: ig.handle, url: ig.url };
  }
  return undefined;
}

export function Footer() {
  const year = new Date().getFullYear();
  const instagram = readInstagram();

  return (
    <footer className="relative border-t border-border bg-panel" aria-label="Site footer">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold tracking-wide text-foreground">
            {site.name}
          </p>
          <p className="mt-1 text-sm text-accent">{site.tagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{site.footer.blurb}</p>
        </div>

        <div>
          <p className="eyebrow mb-3">Navigate</p>
          <ul className="space-y-2 text-sm">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
            {site.services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-muted transition-colors hover:text-foreground"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-3">Visit</p>
          <address className="not-italic text-sm leading-relaxed text-muted">
            {site.contact.address?.note ? (
              <p className="text-foreground">{site.contact.address.note}</p>
            ) : null}
            {site.contact.address?.street ? <p>{site.contact.address.street}</p> : null}
            {site.contact.address ? (
              <p>
                {site.contact.address.city}, {site.contact.address.state}{" "}
                {site.contact.address.zip}
              </p>
            ) : null}
            {site.contact.phoneHref ? (
              <p className="mt-3">
                <a
                  href={site.contact.phoneHref}
                  className="text-accent transition-colors hover:text-accent-hover"
                >
                  {site.contact.phoneLabel ?? site.contact.phone}
                </a>
              </p>
            ) : null}
            {site.contact.hours?.note ? (
              <p className="mt-3 text-sm text-muted">{site.contact.hours.note}</p>
            ) : null}
            {instagram ? (
              <p className="mt-2">
                <a
                  href={instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-foreground"
                >
                  {instagram.handle}
                </a>
              </p>
            ) : null}
          </address>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-dim sm:flex-row sm:px-6">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          {site.contact.address ? (
            <p>
              {site.contact.address.city}, {site.contact.address.state}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
