import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  normalizeIntegrations,
  type IntegrationsConfig,
} from "@/lib/integrations";
import { normalizeKb, type KbFile } from "@/lib/kb";
import { commitFilesViaGitHub } from "@/lib/github-commit";

type SaveBody = {
  integrations?: Partial<IntegrationsConfig>;
  kb?: KbFile;
};

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  let body: SaveBody;
  try {
    body = (await request.json()) as SaveBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const integrationsData = normalizeIntegrations(body.integrations);
  const kbData = normalizeKb(body.kb);

  // Validate KB entries have content
  for (const entry of kbData.entries) {
    if (!entry.question.trim() || !entry.answer.trim()) {
      return NextResponse.json(
        { ok: false, error: "Each knowledge-base entry needs a question and answer." },
        { status: 400 }
      );
    }
  }

  const integrationsJson = `${JSON.stringify(integrationsData, null, 2)}\n`;
  const kbJson = `${JSON.stringify(kbData, null, 2)}\n`;

  const files = [
    { path: "content/integrations.json", content: integrationsJson },
    { path: "content/kb.json", content: kbJson },
  ];

  const result = await commitFilesViaGitHub(
    files,
    "chore(admin): update integrations and knowledge base"
  );

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error, files },
      { status: 502 }
    );
  }

  if (result.mode === "no-token") {
    // Graceful fallback — same idea as contact form without RESEND_API_KEY
    console.info(
      "[admin] github-token-not-configured — returning JSON for manual commit"
    );
    return NextResponse.json({
      ok: true,
      mode: "manual",
      note: "github-token-not-configured",
      message:
        "No GITHUB_TOKEN set. Copy the JSON below into content/integrations.json and content/kb.json (or ask your AI to commit them). After commit, Vercel will redeploy.",
      files: result.files,
    });
  }

  return NextResponse.json({
    ok: true,
    mode: "committed",
    commitSha: result.commitSha,
    urls: result.urls,
    message:
      "Saved via GitHub. A redeploy should start automatically if this repo is connected to Vercel.",
  });
}
