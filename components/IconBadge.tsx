import type { ReactNode } from "react";

type IconName = "crosshair" | "shield" | "wrench" | "home";

type IconBadgeProps = {
  icon: IconName | string;
  className?: string;
};

function CrosshairIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path
        d="M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path
        d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-2.5 2.5-2.5z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path
        d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const icons: Record<IconName, () => ReactNode> = {
  crosshair: CrosshairIcon,
  shield: ShieldIcon,
  wrench: WrenchIcon,
  home: HomeIcon,
};

export function IconBadge({ icon, className = "" }: IconBadgeProps) {
  const Icon = icons[icon as IconName] ?? WrenchIcon;
  return (
    <span
      className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border bg-accent-dim text-accent ${className}`}
      aria-hidden="true"
    >
      <span className="h-6 w-6">
        <Icon />
      </span>
    </span>
  );
}
