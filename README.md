# Chatterbuilt base template

Industry-neutral **Next.js** business site template. Clone it, replace the example business in `content/site.ts`, swap images, and deploy.

Stack: **Next.js** (App Router) · **TypeScript** · **Tailwind CSS v4** · **Vercel**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mrhinkle/chatterbuilt-template)

## Example business

The repo ships with a fully filled demo business: **your business** (home repairs / handyman, Columbus, OH). It builds and renders out of the box. Replace every field in `content/site.ts` with your customer’s details — or drop in output from the Chatterbuilt MCP `render_site_ts` tool.

## Edit site content

**All copy and config live in one file:**

```
content/site.ts
```

Change business info, hero text, services, process steps, FAQ, SEO titles/descriptions, nav labels, gallery, reviews, or set `schedulingUrl` there. Components render exclusively from that object — no hunting through JSX for marketing text.

### Scheduling embed

In `content/site.ts`:

```ts
schedulingUrl: "", // empty = “Book by phone” fallback
// e.g. schedulingUrl: "https://calendly.com/your-link",
```

When set to a Calendly/Cal.com (or similar) embed URL, the Schedule section shows a lazy-loaded iframe. When empty, it shows a call-to-book card with phone + form link.

### Add a service or FAQ

1. Append an object to `site.services` or `site.faq` in `content/site.ts`.
2. For services, include `slug`, `name`, descriptions, `included`, `idealFor`, `icon`, `image` (path under `public/visuals/`), and `seo`.
3. Service pages are generated automatically from the array (`/services/[slug]`).

### Images

Placeholder dark brand panels ship under:

| Path | Use |
| --- | --- |
| `public/visuals/hero-bench.png` | Home hero background |
| `public/visuals/service-*.png` | Service cards + detail heroes |
| `public/visuals/section-camo.png` | Low-opacity texture (Process + FAQ) |
| `public/gallery/project-*.png` | Gallery grid |

Replace files in place (keep the same filenames) or update paths in `content/site.ts`. Gallery entries need both an image file and a matching object in `gallery.items`.

## Contact form (Resend)

The form posts to `POST /api/contact`, which sends email via the [Resend](https://resend.com) REST API (no SDK).

| Env var | Purpose | Default |
| --- | --- | --- |
| `RESEND_API_KEY` | Resend API key | *(required to actually send)* |
| `CONTACT_TO_EMAIL` | Inbox for submissions | `site.contact.email` |
| `CONTACT_FROM_EMAIL` | From address (must be allowed in Resend) | `onboarding@resend.dev` |

If `RESEND_API_KEY` is missing, the API logs the submission server-side and still returns success so local/dev UX never breaks.

Copy `.env.example` to `.env.local` for local testing:

```bash
cp .env.example .env.local
# then fill RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL
```

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build — run before pushing
npm run start   # serve production build
npm run lint    # ESLint
```

## Deploy

- **Deploy button** (above) clones this template into a new Vercel project.
- Pushes to **`main`** auto-deploy when the repo is connected to Vercel.
- Open a **PR** for a preview URL before merging.
- Set Resend env vars in the Vercel project settings for production email.

## Spend guardrails

What hosting costs, what’s free, and how to hard-cap spend: **[docs/SPEND-GUARDRAILS.md](./docs/SPEND-GUARDRAILS.md)**.

## Project structure

```
app/                  # routes, layout, SEO (sitemap, robots, OG image)
  api/contact/        # contact form handler
  contact/            # /contact
  services/[slug]/    # service detail pages
components/           # UI sections (read from content/site.ts)
content/site.ts       # ← edit me for copy/config
public/gallery/       # project gallery images
public/visuals/       # hero, service cards, section textures
public/llms.txt       # AEO summary for answer engines
```

## SEO / AEO

- Metadata + Open Graph / Twitter cards
- `app/sitemap.ts`, `app/robots.ts` (allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- JSON-LD: LocalBusiness, Service, FAQPage, BreadcrumbList
- `public/llms.txt` business summary for AI crawlers

## Customize by talking to your AI

This template is built so an AI coding agent (or you) can rebrand the whole site by editing one file.

1. **Clone or “Use this template”** on GitHub, then open the project in your AI tool of choice.
2. **Tell the AI who the business is**, for example:
   - *“Replace your business with [Business Name], a [trade] in [City, State]. Update phone, address, three services, FAQ, reviews, and SEO titles. Keep the layout.”*
3. The agent should **only change `content/site.ts`** (and images under `public/` if you supply photos). Components already read from `site` — no prose rewrites in JSX.
4. If you use the **Chatterbuilt MCP**, run the interview → `validate` → `render_site_ts` flow and drop the generated source into `content/site.ts`.
5. **Run `npm run build`**, push a branch, open a PR for a Vercel preview, then merge to `main` for production.

Rules for any agent editing this repo are in **[AGENTS.md](./AGENTS.md)**.

## AI / agent rules

See **[AGENTS.md](./AGENTS.md)**: all copy in `content/site.ts`; components never hold business prose; run `npm run build` before pushing; `main` auto-deploys; preview via PR. Spend caps: **[docs/SPEND-GUARDRAILS.md](./docs/SPEND-GUARDRAILS.md)**.
