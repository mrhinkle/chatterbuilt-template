type CamoPatternProps = {
  className?: string;
  /** Opacity of the pattern (0–1). Spec suggests ~4–6%. */
  opacity?: number;
  id?: string;
};

/**
 * Angular geometric camo motif — irregular polygons in dark grays.
 * Used as a low-opacity background texture in hero and alternating sections.
 */
export function CamoPattern({
  className = "",
  opacity = 0.05,
  id = "camo-pattern",
}: CamoPatternProps) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={id}
          x="0"
          y="0"
          width="200"
          height="200"
          patternUnits="userSpaceOnUse"
        >
          {/* Shard set A — darkest */}
          <polygon points="0,0 48,8 32,52 0,40" fill="#1a1e24" />
          <polygon points="48,8 95,0 110,45 70,60 32,52" fill="#242830" />
          <polygon points="95,0 150,12 160,55 110,45" fill="#1c2028" />
          <polygon points="150,12 200,0 200,40 160,55" fill="#2a2f38" />
          {/* Mid band */}
          <polygon points="0,40 32,52 45,95 0,100" fill="#22262e" />
          <polygon points="32,52 70,60 85,110 45,95" fill="#181c22" />
          <polygon points="70,60 110,45 130,100 85,110" fill="#2c313a" />
          <polygon points="110,45 160,55 175,105 130,100" fill="#1e222a" />
          <polygon points="160,55 200,40 200,100 175,105" fill="#252a32" />
          {/* Lower band */}
          <polygon points="0,100 45,95 55,150 0,145" fill="#1a1e26" />
          <polygon points="45,95 85,110 100,160 55,150" fill="#282d36" />
          <polygon points="85,110 130,100 145,155 100,160" fill="#1c2028" />
          <polygon points="130,100 175,105 190,155 145,155" fill="#242830" />
          <polygon points="175,105 200,100 200,160 190,155" fill="#1e232c" />
          {/* Bottom edge */}
          <polygon points="0,145 55,150 40,200 0,200" fill="#2a2f38" />
          <polygon points="55,150 100,160 90,200 40,200" fill="#1a1e24" />
          <polygon points="100,160 145,155 155,200 90,200" fill="#22262e" />
          <polygon points="145,155 190,155 200,200 155,200" fill="#181c22" />
          <polygon points="190,155 200,160 200,200" fill="#252a32" />
          {/* Accent angular chips for depth */}
          <polygon points="20,70 38,78 28,95" fill="#2e3440" />
          <polygon points="120,25 140,30 128,48" fill="#2e3440" />
          <polygon points="165,130 185,138 172,155" fill="#2e3440" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} opacity={opacity} />
    </svg>
  );
}
