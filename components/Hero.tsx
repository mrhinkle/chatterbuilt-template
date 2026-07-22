import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden border-b border-border"
    >
      {/* Full-bleed hero visual — subject weighted right; copy stays left */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/visuals/hero-bench.png"
          alt=""
          fill
          priority
          quality={70}
          sizes="100vw"
          className="object-cover object-[center_40%]"
        />
        {/* Mobile: strong ~85% uniform overlay so headline stays legible */}
        <div className="absolute inset-0 bg-black/85 md:hidden" />
        {/* Desktop: left-heavy gradient (near-black left → lighter right) */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 28%, rgba(0,0,0,0.48) 55%, rgba(0,0,0,0.35) 100%)",
          }}
        />
        {/* Bottom fade into page background so section blends into trust bar */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background:
              "linear-gradient(to top, var(--background) 0%, transparent 100%)",
          }}
        />
        {/* Keep existing orange accent glow if it layers well */}
        <div className="bg-hero-glow absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
        <p className="eyebrow">{site.hero.eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {site.hero.headline}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
          {site.hero.subheadline}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href={site.hero.primaryCta.href} className="btn btn-primary">
            {site.hero.primaryCta.label}
          </Link>
          <Link href={site.hero.secondaryCta.href} className="btn btn-secondary">
            {site.hero.secondaryCta.label}
          </Link>
        </div>
        <p className="mt-10 font-display text-sm font-semibold tracking-[0.12em] text-steel uppercase">
          {site.tagline}
        </p>
      </div>
    </section>
  );
}
