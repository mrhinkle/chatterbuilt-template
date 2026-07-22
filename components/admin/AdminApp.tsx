"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { IntegrationsConfig } from "@/lib/integrations";
import type { KbEntry, KbFile } from "@/lib/kb";

type SessionState = {
  configured: boolean;
  authenticated: boolean;
  githubTokenConfigured: boolean;
};

type ManualFile = { path: string; content: string };

type SaveResult =
  | { mode: "committed"; message: string }
  | { mode: "manual"; message: string; files: ManualFile[] }
  | null;

const EMPTY_INTEGRATIONS: IntegrationsConfig = {
  gtmContainerId: "",
  ga4MeasurementId: "",
  metaPixelId: "",
  umamiScriptUrl: "",
  umamiWebsiteId: "",
  calendlyUrl: "",
};

function newEntry(): KbEntry {
  return {
    id: `entry-${Date.now().toString(36)}`,
    question: "",
    answer: "",
  };
}

export function AdminApp() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [integrations, setIntegrations] =
    useState<IntegrationsConfig>(EMPTY_INTEGRATIONS);
  const [entries, setEntries] = useState<KbEntry[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveResult, setSaveResult] = useState<SaveResult>(null);

  const refreshSession = useCallback(async () => {
    const res = await fetch("/api/admin/session", { cache: "no-store" });
    const data = (await res.json()) as SessionState & { ok?: boolean };
    setSession({
      configured: Boolean(data.configured),
      authenticated: Boolean(data.authenticated),
      githubTokenConfigured: Boolean(data.githubTokenConfigured),
    });
    return data.authenticated;
  }, []);

  const loadContent = useCallback(async () => {
    setContentLoading(true);
    setSaveError("");
    try {
      const res = await fetch("/api/admin/content", { cache: "no-store" });
      if (res.status === 401) {
        setSession((s) =>
          s ? { ...s, authenticated: false } : { configured: true, authenticated: false, githubTokenConfigured: false }
        );
        return;
      }
      const data = (await res.json()) as {
        ok?: boolean;
        integrations?: IntegrationsConfig;
        kb?: KbFile;
        githubTokenConfigured?: boolean;
      };
      if (data.integrations) setIntegrations({ ...EMPTY_INTEGRATIONS, ...data.integrations });
      if (data.kb?.entries) setEntries(data.kb.entries);
      if (typeof data.githubTokenConfigured === "boolean") {
        setSession((s) =>
          s
            ? { ...s, githubTokenConfigured: data.githubTokenConfigured! }
            : null
        );
      }
    } catch {
      setSaveError("Could not load admin content.");
    } finally {
      setContentLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      const authed = await refreshSession();
      if (authed) await loadContent();
    })();
  }, [refreshSession, loadContent]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setLoginError(data.error ?? "Login failed.");
        return;
      }
      setPassword("");
      await refreshSession();
      await loadContent();
    } catch {
      setLoginError("Network error. Try again.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setSaveResult(null);
    setEntries([]);
    setIntegrations(EMPTY_INTEGRATIONS);
    await refreshSession();
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaveLoading(true);
    setSaveError("");
    setSaveResult(null);
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          integrations,
          kb: { entries },
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        mode?: string;
        message?: string;
        files?: ManualFile[];
      };
      if (!res.ok || !data.ok) {
        setSaveError(data.error ?? "Save failed.");
        if (data.files) {
          setSaveResult({
            mode: "manual",
            message: data.error ?? "Save failed — JSON still available below.",
            files: data.files,
          });
        }
        return;
      }
      if (data.mode === "manual" && data.files) {
        setSaveResult({
          mode: "manual",
          message: data.message ?? "Copy the JSON below.",
          files: data.files,
        });
      } else {
        setSaveResult({
          mode: "committed",
          message: data.message ?? "Saved.",
        });
      }
    } catch {
      setSaveError("Network error while saving.");
    } finally {
      setSaveLoading(false);
    }
  }

  function updateIntegration<K extends keyof IntegrationsConfig>(
    key: K,
    value: IntegrationsConfig[K]
  ) {
    setIntegrations((prev) => ({ ...prev, [key]: value }));
  }

  function updateEntry(index: number, patch: Partial<KbEntry>) {
    setEntries((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, ...patch } : entry))
    );
  }

  function removeEntry(index: number) {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center text-muted">
        Loading admin…
      </div>
    );
  }

  if (!session.configured) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-md border border-border bg-panel p-6 sm:p-8">
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-foreground">
            Password not configured
          </h1>
          <p className="mt-3 text-sm text-muted">
            Set <code className="text-foreground">ADMIN_PASSWORD</code> in
            Vercel project env (or <code className="text-foreground">.env.local</code>{" "}
            for local) and redeploy. This is a simple site-owner gate, not
            multi-user enterprise auth.
          </p>
        </div>
      </div>
    );
  }

  if (!session.authenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-md border border-border bg-panel p-6 sm:p-8">
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-foreground">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-muted">
            Enter the site admin password to edit integration IDs and chatbot
            answers.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-password" className="label">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {loginError ? (
              <p className="text-sm text-error" role="alert">
                {loginError}
              </p>
            ) : null}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loginLoading}
            >
              {loginLoading ? "Checking…" : "Enter admin"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground">
            Site settings
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Edit tag IDs and chatbot knowledge-base answers. Saves write{" "}
            <code className="text-foreground">content/integrations.json</code>{" "}
            and <code className="text-foreground">content/kb.json</code> — the
            same files chat-based AI edits use.
          </p>
        </div>
        <button type="button" className="btn btn-secondary shrink-0" onClick={() => void handleLogout()}>
          Sign out
        </button>
      </header>

      {contentLoading ? (
        <p className="text-muted">Loading content…</p>
      ) : (
        <form onSubmit={handleSave} className="space-y-10">
          <section className="rounded-md border border-border bg-panel p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Integrations
            </h2>
            <p className="mt-1 text-sm text-muted">
              Leave blank to disable a tag. Calendly URL powers the Schedule
              embed when set.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                id="gtm"
                label="GTM container ID"
                placeholder="GTM-XXXXXXX"
                value={integrations.gtmContainerId}
                onChange={(v) => updateIntegration("gtmContainerId", v)}
              />
              <Field
                id="ga4"
                label="GA4 measurement ID"
                placeholder="G-XXXXXXXXXX"
                value={integrations.ga4MeasurementId}
                onChange={(v) => updateIntegration("ga4MeasurementId", v)}
              />
              <Field
                id="meta"
                label="Meta Pixel ID"
                placeholder="1234567890"
                value={integrations.metaPixelId}
                onChange={(v) => updateIntegration("metaPixelId", v)}
              />
              <Field
                id="calendly"
                label="Calendly / scheduling URL"
                placeholder="https://calendly.com/…"
                value={integrations.calendlyUrl}
                onChange={(v) => updateIntegration("calendlyUrl", v)}
              />
              <Field
                id="umami-url"
                label="Umami script URL"
                placeholder="https://…/script.js"
                value={integrations.umamiScriptUrl}
                onChange={(v) => updateIntegration("umamiScriptUrl", v)}
              />
              <Field
                id="umami-id"
                label="Umami website ID"
                placeholder="UUID"
                value={integrations.umamiWebsiteId}
                onChange={(v) => updateIntegration("umamiWebsiteId", v)}
              />
            </div>
          </section>

          <section className="rounded-md border border-border bg-panel p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Chatbot knowledge base
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Question / answer pairs for the free Instant answers widget.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEntries((prev) => [...prev, newEntry()])}
              >
                Add entry
              </button>
            </div>

            <ul className="mt-5 space-y-4">
              {entries.length === 0 ? (
                <li className="text-sm text-muted">
                  No entries yet. Add at least one so the chatbot can answer.
                </li>
              ) : (
                entries.map((entry, index) => (
                  <li
                    key={entry.id || index}
                    className="rounded-md border border-border bg-panel-elevated p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted">
                        Entry {index + 1}
                      </span>
                      <button
                        type="button"
                        className="text-sm text-error hover:underline"
                        onClick={() => removeEntry(index)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="label" htmlFor={`kb-q-${index}`}>
                          Question
                        </label>
                        <input
                          id={`kb-q-${index}`}
                          className="input"
                          value={entry.question}
                          onChange={(e) =>
                            updateEntry(index, { question: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="label" htmlFor={`kb-a-${index}`}>
                          Answer
                        </label>
                        <textarea
                          id={`kb-a-${index}`}
                          className="textarea"
                          value={entry.answer}
                          onChange={(e) =>
                            updateEntry(index, { answer: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>

          <div className="rounded-md border border-border bg-panel-elevated p-4 text-sm text-muted">
            {session.githubTokenConfigured ? (
              <p>
                <span className="text-success">GITHUB_TOKEN is set</span> —
                Save will commit JSON files via the GitHub API (redeploy follows
                if Vercel is connected).
              </p>
            ) : (
              <p>
                <span className="text-foreground">No GITHUB_TOKEN</span> — Save
                still works: you will get the exact JSON to paste into the repo
                or hand to your AI (same graceful pattern as the contact form
                without Resend).
              </p>
            )}
          </div>

          {saveError ? (
            <p className="text-sm text-error" role="alert">
              {saveError}
            </p>
          ) : null}

          {saveResult?.mode === "committed" ? (
            <p className="text-sm text-success" role="status">
              {saveResult.message}
            </p>
          ) : null}

          {saveResult?.mode === "manual" ? (
            <div className="space-y-4" role="status">
              <p className="text-sm text-foreground">{saveResult.message}</p>
              {saveResult.files.map((file) => (
                <div key={file.path}>
                  <p className="mb-1 font-mono text-xs text-muted">{file.path}</p>
                  <textarea
                    className="textarea font-mono text-xs"
                    readOnly
                    rows={12}
                    value={file.content}
                    onFocus={(e) => e.currentTarget.select()}
                  />
                </div>
              ))}
            </div>
          ) : null}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saveLoading}
          >
            {saveLoading ? "Saving…" : "Save changes"}
          </button>
        </form>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
