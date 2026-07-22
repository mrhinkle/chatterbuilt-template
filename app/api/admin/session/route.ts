import { NextResponse } from "next/server";
import {
  isAdminAuthenticated,
  isAdminPasswordConfigured,
} from "@/lib/admin-auth";

export async function GET() {
  const configured = isAdminPasswordConfigured();
  const authenticated = configured ? await isAdminAuthenticated() : false;
  return NextResponse.json({
    ok: true,
    configured,
    authenticated,
    githubTokenConfigured: Boolean(process.env.GITHUB_TOKEN?.trim()),
  });
}
