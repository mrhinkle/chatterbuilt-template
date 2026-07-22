import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: site.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site.url}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  const servicePages: MetadataRoute.Sitemap = site.services.map((s) => ({
    url: `${site.url}/services/${s.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...servicePages];
}
