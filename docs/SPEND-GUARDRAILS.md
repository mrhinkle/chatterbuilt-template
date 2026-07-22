# Spend guardrails

Plain-English guide to what this site costs to run — and how to keep it free-tier by default.

## What’s free

These are free for typical small-business traffic:

| Service | Free tier notes |
| --- | --- |
| **Vercel (Hobby plan)** | Hosting, HTTPS, and deploys. Covers most small-business sites. |
| **GitHub** | Repo storage, PRs, and version history. Free for private and public repos at this scale. |
| **Umami analytics** | Private site stats on a free Postgres tier (when you self-host or use a free managed Postgres). |
| **Instant-answers chatbot** | Built-in keyword search over `content/kb.json` — client-side, **$0**, no API key. |
| **Admin panel (`/admin`)** | Edit integration IDs and KB entries; free. Optional GitHub commit needs a free fine-grained token. |

No credit card is required to host and preview this template on the free tiers above.

## What can cost money (and when)

| Item | When it costs | Rough cost |
| --- | --- | --- |
| **Custom domain** | When you buy a domain (e.g. `yourbusiness.com`) instead of the free `*.vercel.app` URL | About **$11/year** (varies by registrar and TLD) |
| **Resend (contact form email)** | After you leave the free allowance | Free up to **3,000 emails/month**; paid plans only if you send more |
| **Vercel** | Only if traffic or features outgrow the Hobby plan | Paid plans start when you upgrade; not required to go live |
| **Image tooling** | Optional AI or stock-image tools you (or an agent) enable for photos/graphics | Only if you turn them on; not part of default hosting |
| **AI-enhanced chatbot** | Only if you set `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` **and** a visitor turns on AI mode in the widget | **Your** provider bill (BYO key). Default keyword mode stays free. Leave keys unset to keep cost at $0. |

Everything else in this template starts on free tiers. A custom domain is the usual first real expense.

Some of the links above may be affiliate links — if you sign up through them we may earn a small commission at no extra cost to you; we still recommend whichever option is cheapest and best for you.

## How to cap spend

Do these once, then check in monthly:

1. **Enable Vercel Spend Management with a hard pause amount**  
   In your Vercel project/team: **Settings → Billing**. Turn on spend management and set a **hard pause** amount so usage stops instead of running up a bill.

2. **Set usage notifications**  
   In the same billing area, turn on alerts so you get emailed before you approach any limit you care about.

3. **Keep auto-renew visibility on for domains**  
   Wherever you registered the domain (Vercel Domains, Namecheap, Google Domains successor, etc.), leave renewal notices and auto-renew controls visible so a domain doesn’t silently renew or expire without you noticing.

4. **Monthly habit**  
   Ask your AI monthly: **"check my hosting usage"**

That habit is enough for most owners: free tier for hosting, ~$11/year for a domain, and hard caps so nothing scales without your say-so.

## For AI agents editing this repo

Agents must not enable paid services without stating the monthly cost and getting an explicit yes. See **[AGENTS.md](../AGENTS.md)**.
