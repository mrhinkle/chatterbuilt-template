import { NextResponse } from "next/server";
import { kb } from "@/lib/kb";
import { searchKb } from "@/lib/kb-search";

/**
 * Optional AI-enhanced chat. Free keyword mode runs entirely in the browser
 * and never hits this route. This endpoint only runs when the site owner set
 * OPENAI_API_KEY or ANTHROPIC_API_KEY and the visitor enables AI mode.
 * That costs the site owner money (BYO key) — default is off.
 */

function aiConfigured(): { provider: "openai" | "anthropic" } | null {
  if (process.env.OPENAI_API_KEY?.trim()) return { provider: "openai" };
  if (process.env.ANTHROPIC_API_KEY?.trim()) return { provider: "anthropic" };
  return null;
}

export async function GET() {
  const cfg = aiConfigured();
  return NextResponse.json({
    ok: true,
    aiEnabled: Boolean(cfg),
    provider: cfg?.provider ?? null,
  });
}

export async function POST(request: Request) {
  const cfg = aiConfigured();
  if (!cfg) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "AI mode is not configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY (costs money — keyword mode is free).",
      },
      { status: 503 }
    );
  }

  let body: { message?: string };
  try {
    body = (await request.json()) as { message?: string };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const message = String(body.message ?? "").trim();
  if (!message || message.length > 2000) {
    return NextResponse.json(
      { ok: false, error: "Please enter a short question." },
      { status: 400 }
    );
  }

  // Always ground on keyword hits first
  const keyword = searchKb(message, kb.entries, { topN: 3 });
  const context = keyword.hits
    .map((h) => `Q: ${h.entry.question}\nA: ${h.entry.answer}`)
    .join("\n\n");

  const system = [
    "You answer visitor questions for a small local business website.",
    "Use ONLY the knowledge-base excerpts provided. If they are insufficient, say you do not know and suggest contacting the business.",
    "Keep answers short (2–4 sentences), plain language, no invented prices or guarantees.",
    "Do not claim to be a human or live agent.",
  ].join(" ");

  const userPrompt = context
    ? `Knowledge base:\n\n${context}\n\nVisitor question: ${message}`
    : `No matching knowledge-base entries.\n\nVisitor question: ${message}`;

  try {
    if (cfg.provider === "openai") {
      const answer = await callOpenAI(system, userPrompt);
      return NextResponse.json({
        ok: true,
        mode: "ai",
        answer,
        keywordMatched: keyword.matched,
      });
    }
    const answer = await callAnthropic(system, userPrompt);
    return NextResponse.json({
      ok: true,
      mode: "ai",
      answer,
      keywordMatched: keyword.matched,
    });
  } catch (err) {
    console.error("[chat] AI call failed:", err);
    // Fall back to keyword answer so the visitor still gets something useful
    return NextResponse.json({
      ok: true,
      mode: "keyword-fallback",
      answer: keyword.answer,
      note: "AI request failed; returned free keyword answer instead.",
    });
  }
}

async function callOpenAI(system: string, user: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY!.trim();
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 400,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("Empty OpenAI response");
  return content;
}

async function callAnthropic(system: string, user: string): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY!.trim();
  const model =
    process.env.ANTHROPIC_MODEL?.trim() || "claude-3-5-haiku-latest";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 400,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  const text = data.content?.find((c) => c.type === "text")?.text?.trim();
  if (!text) throw new Error("Empty Anthropic response");
  return text;
}
