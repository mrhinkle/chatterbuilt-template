/**
 * Integration IDs loaded from content/integrations.json at build time.
 * Edit via chat/AI, hand-edit the JSON, or the /admin panel — same file.
 */

import raw from "@/content/integrations.json";

export type IntegrationsConfig = {
  gtmContainerId: string;
  ga4MeasurementId: string;
  metaPixelId: string;
  umamiScriptUrl: string;
  umamiWebsiteId: string;
  calendlyUrl: string;
};

export const integrations: IntegrationsConfig = {
  gtmContainerId: (raw.gtmContainerId ?? "").trim(),
  ga4MeasurementId: (raw.ga4MeasurementId ?? "").trim(),
  metaPixelId: (raw.metaPixelId ?? "").trim(),
  umamiScriptUrl: (raw.umamiScriptUrl ?? "").trim(),
  umamiWebsiteId: (raw.umamiWebsiteId ?? "").trim(),
  calendlyUrl: (raw.calendlyUrl ?? "").trim(),
};

/** Empty default shape for admin forms / GitHub writes. */
export function emptyIntegrations(): IntegrationsConfig {
  return {
    gtmContainerId: "",
    ga4MeasurementId: "",
    metaPixelId: "",
    umamiScriptUrl: "",
    umamiWebsiteId: "",
    calendlyUrl: "",
  };
}

export function normalizeIntegrations(
  input: Partial<IntegrationsConfig> | null | undefined
): IntegrationsConfig {
  const base = emptyIntegrations();
  if (!input || typeof input !== "object") return base;
  return {
    gtmContainerId: String(input.gtmContainerId ?? "").trim(),
    ga4MeasurementId: String(input.ga4MeasurementId ?? "").trim(),
    metaPixelId: String(input.metaPixelId ?? "").trim(),
    umamiScriptUrl: String(input.umamiScriptUrl ?? "").trim(),
    umamiWebsiteId: String(input.umamiWebsiteId ?? "").trim(),
    calendlyUrl: String(input.calendlyUrl ?? "").trim(),
  };
}
