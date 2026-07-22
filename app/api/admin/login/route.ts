import { NextResponse } from "next/server";
import {
  createSessionToken,
  isAdminPasswordConfigured,
  sessionCookieOptions,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "ADMIN_PASSWORD is not set. Add it in Vercel env (or .env.local) to enable the admin panel.",
      },
      { status: 503 }
    );
  }

  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const password = String(body.password ?? "");
  if (!verifyAdminPassword(password)) {
    return NextResponse.json(
      { ok: false, error: "Incorrect password." },
      { status: 401 }
    );
  }

  const token = createSessionToken();
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Could not create session." },
      { status: 500 }
    );
  }

  const res = NextResponse.json({ ok: true });
  const opts = sessionCookieOptions(token);
  res.cookies.set(opts.name, opts.value, {
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
    path: opts.path,
    maxAge: opts.maxAge,
  });
  return res;
}
