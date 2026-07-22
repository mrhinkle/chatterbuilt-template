import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full bg-site">
      <Link
        href="/"
        className="fixed left-4 top-4 z-50 text-sm text-muted transition-colors hover:text-accent"
      >
        ← Back to site
      </Link>
      {children}
    </div>
  );
}
