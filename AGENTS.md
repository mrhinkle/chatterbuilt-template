<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Chatterbuilt template — agent contract

This repo is the industry-neutral base template for Chatterbuilt business sites. An AI (or human) editing it must follow these rules.

## Single source of truth for copy

- **All marketing copy and business config live in `content/site.ts`.**
- Components must **never** contain business-specific prose. They read from `site` only.
- To change name, phone, services, FAQs, SEO titles, gallery, reviews, or scheduling: edit `content/site.ts` only.
- MCP tools (`render_site_ts`, presets, validate) target this file’s shape. Keep top-level keys and helper exports compatible:
  - Flattened meta: `name`, `tagline`, `description`, `url`, `schedulingUrl`
  - Core: `contact`, `nav`, `hero`, `trustBar`, `services[]`, `process`, `whyUs` (MCP industry presets may emit another `why*` key — `WhyUs` accepts either), `faq[]`, `contactSection`, `scheduleSection`, `seo`, `footer`
  - Template extras used by shipped UI: `gallery`, `reviews`, `findUs`, `itemTypes`, `notFound`, `links`, `servicesSection`
  - Helpers at the tail (must match MCP `render_site_ts`): `export type Site`, `getServiceBySlug` (via `as unknown as Service[]`), `formatPhoneDisplay`
  - Template-only helpers live in `lib/site-helpers.ts` (`serviceImageAlt`, `getFindUsHref`) so MCP-rendered `content/site.ts` still builds

## Integrations + chatbot knowledge base (JSON)

- **`content/integrations.json`** — GTM container ID, GA4 measurement ID, Meta Pixel ID, Umami script URL + website ID, Calendly/scheduling URL. Read at build time via `lib/integrations.ts`.
- **`content/kb.json`** — chatbot Q/A pairs for the free Instant answers widget. Read at build time via `lib/kb.ts`; keyword search in `lib/kb-search.ts`.
- **Two equivalent edit paths (not competing systems):**
  1. **Chat-based / AI agent** — edit the same JSON files in the repo (or ask an agent to).
  2. **Admin panel** (`/admin`) — site owner UI that writes the same `content/integrations.json` and `content/kb.json` files.
- Prefer those content files over hardcoding IDs or FAQ answers in components.

## Admin panel (`/admin`)

- Simple password gate: `ADMIN_PASSWORD` env + httpOnly session cookie (functional, not enterprise multi-user auth).
- Optional `GITHUB_TOKEN` (fine-grained, repo Contents read/write) + `GITHUB_REPO=owner/name` commits saves via the GitHub API so Vercel can redeploy.
- Without `GITHUB_TOKEN`: Save still succeeds and shows the exact JSON to paste or hand to an AI — same graceful no-key pattern as the contact form when `RESEND_API_KEY` is absent.
- Env vars: see `.env.example` (`ADMIN_PASSWORD`, `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH`).

## Instant-answers chatbot

- Floating widget labeled **Instant answers** — client-side keyword retrieval over `content/kb.json` (zero API cost by default).
- Optional AI-enhanced mode is **off by default** and only available when `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` is set (BYO; costs the site owner money). Document spend before enabling — see `docs/SPEND-GUARDRAILS.md`.

## Images

- Hero / service / section textures: `public/visuals/`
- Gallery items: `public/gallery/` + matching `gallery.items` entries in `content/site.ts`
- Placeholders ship with the template; replace with real photos for production. Do not leave broken paths.

## Contact form

- `POST /api/contact` uses Resend when `RESEND_API_KEY` is set.
- Without a key: logs submission server-side and still returns success (local/dev friendly).
- Env vars: see `.env.example` (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`).
- Admin save without `GITHUB_TOKEN` follows the same graceful pattern (return data; do not hard-fail).

## Before you push

1. Edit only what you need; prefer content changes over component rewrites.
2. Run **`npm run build`** and fix all errors before pushing.
3. Do not commit secrets (`.env.local`).

## Deploy

- **`main` auto-deploys** on Vercel when the repo is connected.
- Open a **PR** for a preview deployment; merge when ready for production.
- One-click clone: use the Deploy button in `README.md`.

## Spend guardrails

- Owner-facing guide: **[docs/SPEND-GUARDRAILS.md](./docs/SPEND-GUARDRAILS.md)** (what’s free, what can cost money, how to cap spend).
- agents must not enable paid services without stating the monthly cost and getting an explicit yes.
