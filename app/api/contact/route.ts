import { NextResponse } from "next/server";
import { site } from "@/content/site";

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  itemType?: string;
  message?: string;
  website?: string; // honeypot
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidItemType(value: string): boolean {
  const allowed =
    "itemTypes" in site && Array.isArray(site.itemTypes) && site.itemTypes.length > 0
      ? (site.itemTypes as readonly string[])
      : (["General inquiry", "Quote request", "Other"] as const);
  return (allowed as readonly string[]).includes(value);
}

export async function POST(request: Request) {
  let body: ContactBody;

  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  // Honeypot — bots fill this; real users never see it
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const itemType = (body.itemType ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || name.length > 200) {
    return NextResponse.json(
      { ok: false, error: "Please enter your name." },
      { status: 400 }
    );
  }

  if (!email || !EMAIL_RE.test(email) || email.length > 320) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (!itemType || !isValidItemType(itemType)) {
    return NextResponse.json(
      { ok: false, error: "Please select an item type." },
      { status: 400 }
    );
  }

  if (!message || message.length < 5 || message.length > 5000) {
    return NextResponse.json(
      { ok: false, error: "Please enter a message (at least a few words)." },
      { status: 400 }
    );
  }

  if (phone.length > 40) {
    return NextResponse.json(
      { ok: false, error: "Phone number looks too long." },
      { status: 400 }
    );
  }

  const submission = {
    name,
    email,
    phone: phone || "(not provided)",
    itemType,
    message,
    receivedAt: new Date().toISOString(),
  };

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.info("[contact] email-not-configured — submission logged:", submission);
    return NextResponse.json({ ok: true, note: "email-not-configured" });
  }

  const to = process.env.CONTACT_TO_EMAIL || site.contact.email;
  const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  const text = [
    `New contact from ${site.name} website`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "(not provided)"}`,
    `Item type: ${itemType}`,
    ``,
    `Message:`,
    message,
    ``,
    `Received: ${submission.receivedAt}`,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[${site.name}] ${itemType} quote request from ${name}`,
        text,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[contact] Resend error:", res.status, errText);
      return NextResponse.json(
        { ok: false, error: "Could not send email. Please call us instead." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] fetch failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not send email. Please call us instead." },
      { status: 502 }
    );
  }
}
