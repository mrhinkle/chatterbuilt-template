/**
 * Chatbot knowledge base loaded from content/kb.json at build time.
 * Edit via chat/AI, hand-edit the JSON, or the /admin panel — same file.
 */

import raw from "@/content/kb.json";

export type KbEntry = {
  id: string;
  question: string;
  answer: string;
};

export type KbFile = {
  entries: KbEntry[];
};

function isEntry(value: unknown): value is KbEntry {
  if (!value || typeof value !== "object") return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.question === "string" &&
    typeof e.answer === "string"
  );
}

const entries: KbEntry[] = Array.isArray(raw.entries)
  ? raw.entries.filter(isEntry).map((e) => ({
      id: e.id.trim(),
      question: e.question.trim(),
      answer: e.answer.trim(),
    }))
  : [];

export const kb: KbFile = { entries };

export function normalizeKb(input: unknown): KbFile {
  if (!input || typeof input !== "object") return { entries: [] };
  const list = (input as { entries?: unknown }).entries;
  if (!Array.isArray(list)) return { entries: [] };
  return {
    entries: list.filter(isEntry).map((e) => ({
      id: e.id.trim() || slugFromQuestion(e.question),
      question: e.question.trim(),
      answer: e.answer.trim(),
    })),
  };
}

export function slugFromQuestion(question: string): string {
  const base = question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return base || `entry-${Date.now().toString(36)}`;
}
