import { site } from "@/content/site";

/** Alt text for service imagery — kept out of content/site.ts so MCP renders still build. */
export function serviceImageAlt(name: string): string {
  const address =
    site.contact && typeof site.contact === "object" && "address" in site.contact
      ? (site.contact.address as { city?: string; state?: string } | undefined)
      : undefined;
  const place = [address?.city, address?.state].filter(Boolean).join(" ");
  return place
    ? `${name} — work by ${site.name}, ${place}`
    : `${name} — work by ${site.name}`;
}

type FindUsId = "google" | "reviews" | "instagram" | string;

/**
 * Resolve outbound URL for a Find Us card.
 * Uses optional template extras (links, instagram) with safe fallbacks for MCP configs.
 */
export function getFindUsHref(id: FindUsId): string {
  const record = site as unknown as {
    links?: {
      googleListing?: string;
      reviewsProfile?: string;
      reviewsPage?: string;
    };
    contact?: {
      address?: { mapUrl?: string };
      instagram?: { url?: string };
    };
  };

  switch (id) {
    case "google":
      return (
        record.links?.googleListing ??
        record.contact?.address?.mapUrl ??
        "#"
      );
    case "reviews":
      return (
        record.links?.reviewsProfile ??
        record.links?.reviewsPage ??
        record.links?.googleListing ??
        "#"
      );
    case "instagram":
      return record.contact?.instagram?.url ?? "#";
    default:
      return "#";
  }
}
