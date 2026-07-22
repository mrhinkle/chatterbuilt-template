import { site } from "@/content/site";

export function TrustBar() {
  return (
    <section
      aria-label="Trust highlights"
      className="border-b border-border bg-panel"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 px-4 py-4 sm:flex-row sm:gap-0 sm:px-6 sm:divide-x sm:divide-border">
        {site.trustBar.map((item) => (
          <p
            key={item}
            className="px-0 text-center font-display text-xs font-semibold tracking-[0.12em] text-muted uppercase sm:px-6 sm:text-sm"
          >
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}
