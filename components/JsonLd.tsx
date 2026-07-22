type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Safe JSON-LD script tag — escapes `<` to prevent XSS via stringify. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
