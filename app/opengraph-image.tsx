import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(145deg, #0B0D10 0%, #12151A 45%, #0E1116 100%)",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Angular camo hint — geometric shards */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: 0.35,
          }}
        >
          <svg width="1200" height="630" viewBox="0 0 1200 630">
            <polygon points="0,0 280,40 200,220 0,180" fill="#1a1e24" />
            <polygon points="280,40 520,0 600,200 380,240" fill="#242830" />
            <polygon points="900,0 1200,0 1200,160 980,220" fill="#1c2028" />
            <polygon points="0,400 180,360 220,630 0,630" fill="#22262e" />
            <polygon points="1000,400 1200,360 1200,630 1050,630" fill="#2a2f38" />
            <polygon points="550,480 720,520 680,630 500,630" fill="#1e222a" />
          </svg>
        </div>

        {/* Accent bar */}
        <div
          style={{
            width: 72,
            height: 6,
            background: "#F2622E",
            marginBottom: 28,
            borderRadius: 2,
          }}
        />

        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#E8EAED",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          {site.name}
        </div>

        <div
          style={{
            marginTop: 16,
            fontSize: 32,
            fontWeight: 600,
            color: "#F2622E",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {site.tagline}
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 22,
            color: "#8FA3B8",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          {site.hero.eyebrow}
        </div>
      </div>
    ),
    { ...size }
  );
}
