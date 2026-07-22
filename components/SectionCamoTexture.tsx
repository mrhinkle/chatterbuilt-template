import Image from "next/image";

type SectionCamoTextureProps = {
  /** Opacity 0–1. Spec: 6–9%; keep low enough for WCAG AA text contrast. */
  opacity?: number;
};

/**
 * Full-bleed splinter-camo photo texture for Process / FAQ sections.
 * Decorative only: pointer-events-none, aria-hidden, low opacity so
 * section backgrounds and elevated cards keep WCAG AA contrast.
 */
export function SectionCamoTexture({ opacity = 0.07 }: SectionCamoTextureProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <Image
        src="/visuals/section-camo.png"
        alt=""
        fill
        sizes="100vw"
        quality={60}
        className="object-cover object-center"
        style={{ opacity }}
      />
    </div>
  );
}
