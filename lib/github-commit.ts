/**
 * Optional GitHub Contents API commits for /admin saves.
 * Requires GITHUB_TOKEN (fine-grained, repo Contents: Read/Write).
 * Repo target: GITHUB_REPO=owner/name, or defaults derived from VERCEL_GIT_REPO_*.
 */

export type CommitFile = {
  path: string;
  content: string;
};

export type GitHubCommitResult =
  | { ok: true; mode: "committed"; commitSha?: string; urls: string[] }
  | { ok: true; mode: "no-token"; files: CommitFile[] }
  | { ok: false; error: string };

function resolveRepo(): { owner: string; repo: string } | null {
  const explicit = process.env.GITHUB_REPO?.trim();
  if (explicit && explicit.includes("/")) {
    const [owner, repo] = explicit.split("/");
    if (owner && repo) return { owner, repo };
  }
  const owner = process.env.VERCEL_GIT_REPO_OWNER?.trim();
  const repo = process.env.VERCEL_GIT_REPO_SLUG?.trim();
  if (owner && repo) return { owner, repo };
  return null;
}

function resolveBranch(): string {
  return (
    process.env.GITHUB_BRANCH?.trim() ||
    process.env.VERCEL_GIT_COMMIT_REF?.trim() ||
    "main"
  );
}

async function getFileSha(
  owner: string,
  repo: string,
  path: string,
  branch: string,
  token: string
): Promise<string | undefined> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });
  if (res.status === 404) return undefined;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub read ${path} failed (${res.status}): ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as { sha?: string };
  return data.sha;
}

async function putFile(
  owner: string,
  repo: string,
  path: string,
  content: string,
  branch: string,
  token: string,
  message: string,
  sha?: string
): Promise<{ commitSha?: string; htmlUrl?: string }> {
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content, "utf8").toString("base64"),
    branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub write ${path} failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    commit?: { sha?: string };
    content?: { html_url?: string };
  };
  return {
    commitSha: data.commit?.sha,
    htmlUrl: data.content?.html_url,
  };
}

/**
 * Commit one or more files. If GITHUB_TOKEN is missing, returns mode "no-token"
 * with the exact file contents for the owner to paste or hand to an AI.
 */
export async function commitFilesViaGitHub(
  files: CommitFile[],
  message: string
): Promise<GitHubCommitResult> {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token) {
    return { ok: true, mode: "no-token", files };
  }

  const target = resolveRepo();
  if (!target) {
    return {
      ok: false,
      error:
        "GITHUB_TOKEN is set but GITHUB_REPO (owner/name) is missing. Set GITHUB_REPO or deploy on Vercel with git metadata.",
    };
  }

  const branch = resolveBranch();
  const urls: string[] = [];
  let lastSha: string | undefined;

  try {
    for (const file of files) {
      const sha = await getFileSha(target.owner, target.repo, file.path, branch, token);
      const result = await putFile(
        target.owner,
        target.repo,
        file.path,
        file.content,
        branch,
        token,
        message,
        sha
      );
      if (result.htmlUrl) urls.push(result.htmlUrl);
      lastSha = result.commitSha ?? lastSha;
    }
    return { ok: true, mode: "committed", commitSha: lastSha, urls };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "GitHub commit failed.";
    console.error("[github-commit]", msg);
    return { ok: false, error: msg };
  }
}
