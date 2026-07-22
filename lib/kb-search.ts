/**
 * Keyword-retrieval for the free "Instant answers" chatbot.
 * Same approach as Chatterbuilt MCP ask_the_manual (apps/mcp/lib/search.ts):
 * tokenize → stop-word filter → weighted keyword overlap scoring.
 * Client-safe (no Node fs) — runs in the browser with zero API cost.
 */

import type { KbEntry } from "@/lib/kb";

const STOP = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "do",
  "does",
  "did",
  "how",
  "what",
  "when",
  "where",
  "who",
  "why",
  "i",
  "my",
  "me",
  "you",
  "your",
  "it",
  "its",
  "this",
  "that",
  "from",
  "by",
  "as",
  "if",
  "can",
  "will",
  "just",
  "about",
]);

/** Tokenize into lowercase words (alphanumeric + hyphen), drop stop words. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9'-]+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

/**
 * Score keyword overlap: question 3x + answer 1x (case-insensitive word match).
 * Mirrors MCP scoreDoc (title 3x / body 1x) for Q/A pairs.
 */
export function scoreEntry(question: string, entry: KbEntry): number {
  const qWords = new Set(tokenize(question));
  if (qWords.size === 0) return 0;

  const titleWords = tokenize(entry.question);
  const bodyWords = tokenize(entry.answer);

  let score = 0;
  for (const w of qWords) {
    score += titleWords.filter((t) => t === w).length * 3;
    score += bodyWords.filter((t) => t === w).length * 1;
  }
  return score;
}

export type KbSearchHit = {
  entry: KbEntry;
  score: number;
};

export type KbSearchResult = {
  hits: KbSearchHit[];
  answer: string;
  matched: boolean;
};

const NO_MATCH =
  "I don't have a saved answer for that. Try asking about services, quotes, scheduling, service area, or licensing — or use the contact form for a personal reply.";

/**
 * Search KB entries by keyword overlap; return top N with a best-answer string.
 */
export function searchKb(
  question: string,
  entries: KbEntry[],
  options?: { topN?: number }
): KbSearchResult {
  const topN = options?.topN ?? 2;
  const ranked = entries
    .map((entry) => ({ entry, score: scoreEntry(question, entry) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  if (ranked.length === 0) {
    return { hits: [], answer: NO_MATCH, matched: false };
  }

  const best = ranked[0];
  return {
    hits: ranked,
    answer: best.entry.answer,
    matched: true,
  };
}
