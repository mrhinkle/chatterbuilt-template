import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { integrations } from "@/lib/integrations";
import { kb } from "@/lib/kb";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    integrations,
    kb,
    githubTokenConfigured: Boolean(process.env.GITHUB_TOKEN?.trim()),
  });
}
