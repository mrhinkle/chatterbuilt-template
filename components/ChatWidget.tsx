"use client";

import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { KbEntry } from "@/lib/kb";
import { searchKb } from "@/lib/kb-search";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
};

type ChatWidgetProps = {
  entries: KbEntry[];
  businessName: string;
  contactHref?: string;
};

export function ChatWidget({
  entries,
  businessName,
  contactHref = "/contact",
}: ChatWidgetProps) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "system",
      text: `Instant answers from ${businessName} — keyword search over our saved FAQ, not a live person or full AI chat.`,
    },
  ]);
  const [aiAvailable, setAiAvailable] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/chat", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { aiEnabled?: boolean };
        if (!cancelled) setAiAvailable(Boolean(data.aiEnabled));
      } catch {
        // ignore — keyword mode always works offline of this call
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open, loading]);

  const replyKeyword = useCallback(
    (question: string): string => {
      if (entries.length === 0) {
        return `No knowledge-base entries are loaded yet. Please use the contact form or call ${businessName}.`;
      }
      return searchKb(question, entries).answer;
    },
    [entries, businessName]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: question,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      if (aiMode && aiAvailable) {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: question }),
        });
        const data = (await res.json()) as {
          ok?: boolean;
          answer?: string;
          error?: string;
        };
        const text =
          res.ok && data.ok && data.answer
            ? data.answer
            : replyKeyword(question);
        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: "assistant", text },
        ]);
      } else {
        const text = replyKeyword(question);
        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: "assistant", text },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: replyKeyword(question),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Instant answers"
          className="pointer-events-auto flex w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-md border border-border bg-panel shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
        >
          <header className="flex items-start justify-between gap-2 border-b border-border bg-panel-elevated px-4 py-3">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">
                Instant answers
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Free FAQ search · not a live agent
              </p>
            </div>
            <button
              type="button"
              className="rounded p-1 text-muted transition-colors hover:bg-white/5 hover:text-foreground"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </button>
          </header>

          {aiAvailable ? (
            <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2 text-xs">
              <label className="flex cursor-pointer items-center gap-2 text-muted">
                <input
                  type="checkbox"
                  className="rounded border-border"
                  checked={aiMode}
                  onChange={(e) => setAiMode(e.target.checked)}
                />
                <span>AI-enhanced (uses owner API key — may cost money)</span>
              </label>
            </div>
          ) : null}

          <div
            ref={listRef}
            className="flex max-h-72 flex-col gap-2 overflow-y-auto px-3 py-3"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.role === "user"
                    ? "ml-6 rounded-md bg-accent-dim px-3 py-2 text-sm text-foreground"
                    : msg.role === "system"
                      ? "rounded-md border border-border bg-panel-elevated px-3 py-2 text-xs text-muted"
                      : "mr-4 rounded-md border border-border bg-panel-elevated px-3 py-2 text-sm text-foreground"
                }
              >
                {msg.text}
              </div>
            ))}
            {loading ? (
              <p className="text-xs text-muted" aria-live="polite">
                Looking up…
              </p>
            ) : null}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-border p-3"
          >
            <label htmlFor="chat-widget-input" className="sr-only">
              Your question
            </label>
            <div className="flex gap-2">
              <input
                id="chat-widget-input"
                className="input flex-1 !py-2 text-sm"
                placeholder="Ask about services, quotes…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
              />
              <button
                type="submit"
                className="btn btn-primary !px-3 !py-2 text-sm"
                disabled={loading || !input.trim()}
              >
                Ask
              </button>
            </div>
            <p className="mt-2 text-[11px] text-muted-dim">
              Need a person?{" "}
              <a href={contactHref} className="text-accent hover:text-accent-hover">
                Contact us
              </a>
            </p>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        className="pointer-events-auto btn btn-primary h-14 w-14 !rounded-full !p-0 shadow-[0_8px_28px_rgba(242,98,46,0.4)]"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Close instant answers" : "Open instant answers"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H11l-3.5 3.5V16H7.5A2.5 2.5 0 0 1 5 13.5v-7Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
