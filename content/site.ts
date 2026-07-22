/**
 * Single source of truth for all site copy and config.
 * Edit this file to change text, services, FAQs, SEO, or scheduling.
 * Components render exclusively from this object.
 *
 * Shape matches what apps/mcp/lib/render-site-ts.ts emits from a filled
 * preset (meta fields flattened to top level) plus template extras
 * (gallery, reviews, findUs, itemTypes, notFound, links) that the
 * shipped components consume. See AGENTS.md.
 */

export type Service = {
  slug: string;
  name: string;
  shortDescription?: string;
  description?: string;
  included?: string[];
  idealFor?: string[];
  icon?: string;
  image?: string;
  seo?: {
    title?: string;
    description?: string;
  };
};

export const site = {
  name: "Northgate Services",
  tagline: "Reliable help. Clear communication.",
  description:
    "Home repairs, remodeling touch-ups, and outdoor maintenance in Columbus, OH. Licensed handyman crew for one-off fixes and small projects — honest quotes, clean work, and on-time follow-through.",
  url: "https://www.northgateservices.example",
  /** Calendly/Cal.com embed URL. Empty string = show call-to-book fallback. */
  schedulingUrl: "",

  contact: {
    phone: "614-555-0142",
    phoneHref: "tel:+16145550142",
    phoneLabel: "Call or text 614-555-0142",
    secondaryPhone: {
      label: "Office line (weekday mornings)",
      phone: "(614) 555-0198",
      href: "tel:+16145550198",
    },
    email: "hello@northgateservices.example",
    address: {
      street: "1840 Northgate Dr",
      city: "Columbus",
      state: "OH",
      zip: "43219",
      full: "1840 Northgate Dr, Columbus, OH 43219",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=1840+Northgate+Dr+Columbus+OH+43219",
      note: "Shop & office — service calls across metro Columbus",
    },
    hours: {
      note: "By appointment — call or text to schedule a visit.",
      detail:
        "Crew is on jobs Mon–Fri 8 AM–5 PM. Saturday morning slots available for urgent repairs when booked ahead.",
    },
    instagram: {
      handle: "@northgateservices",
      url: "https://www.instagram.com/northgateservices",
    },
    geo: {
      latitude: 39.9972,
      longitude: -82.9071,
    },
    areaServed: "Columbus metro, OH — including Westerville, Dublin, and Grove City",
  },

  links: {
    googleListing:
      "https://www.google.com/maps/search/?api=1&query=Northgate+Services+1840+Northgate+Dr+Columbus+OH+43219",
    reviewsProfile:
      "https://www.google.com/maps/search/?api=1&query=Northgate+Services+Columbus+OH",
    reviewsPage:
      "https://www.google.com/maps/search/?api=1&query=Northgate+Services+Columbus+OH",
  },

  nav: [
    { label: "Services", href: "/#services" },
    { label: "Gallery", href: "/#gallery" },
    { label: "Process", href: "/#process" },
    { label: "Reviews", href: "/#reviews" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/contact" },
  ],

  hero: {
    eyebrow: "Home services · Columbus, OH",
    headline: "Repairs done right the first time.",
    subheadline:
      "Licensed handyman and small-project crew for home repairs, remodel touch-ups, and outdoor maintenance across the Columbus metro.",
    primaryCta: { label: "Get a Quote", href: "/contact" },
    secondaryCta: { label: "See Services", href: "/#services" },
  },

  trustBar: [
    "Licensed & insured",
    "Columbus metro, OH",
    "By appointment",
  ],

  servicesSection: {
    eyebrow: "Services",
    title: "What we handle",
    description:
      "From quick fixes to multi-day projects — clear scope, fair quotes, and tidy job sites.",
  },

  services: [
    {
      slug: "home-repairs",
      name: "Home Repairs",
      shortDescription:
        "Doors, drywall, fixtures, hardware, and the everyday fixes that keep a house working.",
      description:
        "We take care of the repair list that never quite gets shorter — sticking doors, cracked drywall, loose railings, tired fixtures, and general punch-list work. Every job starts with a clear scope and ends with a walkthrough so nothing is left half-done.",
      included: [
        "On-site assessment and written scope",
        "Materials sourcing or use of your supplies",
        "Clean, careful work in occupied homes",
        "Basic cleanup of the work area",
        "Walkthrough and punch-list closeout",
      ],
      idealFor: [
        "Homeowners with a growing repair list",
        "Pre-sale punch lists and buyer walkthrough items",
        "Rental turnovers and light unit prep",
        "One-off fixes you do not want to DIY",
      ],
      icon: "wrench",
      image: "/visuals/service-repairs.png",
      seo: {
        title: "Home Repairs in Columbus, OH",
        description:
          "Licensed home repair and handyman service in Columbus, OH. Drywall, doors, fixtures, hardware, and punch-list work. Call for a clear quote.",
      },
    },
    {
      slug: "remodel-touchups",
      name: "Remodel Touch-Ups",
      shortDescription:
        "Finish work after a remodel — trim, paint touch-ups, hardware, and detail cleanup.",
      description:
        "Remodels leave edges. We handle trim installs, paint touch-ups, hardware upgrades, caulking, and the finish details that make a room feel complete. Ideal when the big contractor has moved on and you need a careful closer.",
      included: [
        "Scope review of remaining finish items",
        "Trim, caulk, and paint touch-up work",
        "Hardware and fixture installs",
        "Coordination with your existing finishes",
        "Final clean of the work zone",
      ],
      idealFor: [
        "Post-remodel punch lists",
        "Kitchen and bath finish details",
        "Hardware and lighting upgrades",
        "Homes between contractor handoff and move-in",
      ],
      icon: "shield",
      image: "/visuals/service-remodel.png",
      seo: {
        title: "Remodel Touch-Ups in Columbus, OH",
        description:
          "Remodel finish work in Columbus, OH — trim, paint touch-ups, hardware, and detail cleanup after the main contractor leaves.",
      },
    },
    {
      slug: "outdoor-maintenance",
      name: "Outdoor & Maintenance",
      shortDescription:
        "Fences, gates, exterior hardware, seasonal prep, and outdoor punch-list items.",
      description:
        "Outside the house needs attention too. We repair fences and gates, tighten exterior hardware, handle light outdoor carpentry, and tackle seasonal maintenance so the property stays safe and presentable year-round.",
      included: [
        "Fence and gate repairs (non-structural)",
        "Exterior hardware and fixture fixes",
        "Light outdoor carpentry",
        "Seasonal prep checklists",
        "Safety-focused recommendations when something is beyond scope",
      ],
      idealFor: [
        "Homeowners preparing for sale or inspection",
        "Seasonal exterior punch lists",
        "Fence, gate, and railing repairs",
        "Properties that need a steady maintenance partner",
      ],
      icon: "home",
      image: "/visuals/service-outdoor.png",
      seo: {
        title: "Outdoor Maintenance in Columbus, OH",
        description:
          "Outdoor repairs and property maintenance in Columbus, OH. Fences, gates, exterior hardware, and seasonal prep. Licensed crew.",
      },
    },
  ],

  process: {
    eyebrow: "How it works",
    title: "A clear path from first call to finished job.",
    steps: [
      {
        step: 1,
        title: "Call or message",
        description:
          "Tell us what needs fixing, where you are, and your preferred timing. We will confirm whether it is a fit and next steps.",
      },
      {
        step: 2,
        title: "On-site assessment",
        description:
          "We visit, walk the work, and give a clear scope and quote before anything starts — no surprise add-ons mid-job.",
      },
      {
        step: 3,
        title: "Do the work",
        description:
          "Scheduled visit, careful work in your home, and communication if we find anything that changes the plan.",
      },
      {
        step: 4,
        title: "Walkthrough & follow-up",
        description:
          "We review the finished work with you, close the punch list, and leave the area tidy.",
      },
    ],
  },

  /**
   * Industry-neutral "why us" section. MCP industry presets may emit a
   * different why* key; WhyUs resolves any top-level why* object with items.
   */
  whyUs: {
    eyebrow: "Why Northgate",
    title: "A crew built for real homes.",
    items: [
      {
        title: "Clear scope up front",
        description:
          "You get a written understanding of the work before we start. If we find something extra, we stop and talk — we do not bill surprises.",
      },
      {
        title: "Respect for occupied homes",
        description:
          "Shoes off when needed, dust control where it matters, and a clean work area at the end of each visit.",
      },
      {
        title: "Licensed and insured",
        description:
          "We carry the coverage homeowners expect and stay inside our skill set. If a job needs a specialist trade, we say so early.",
      },
      {
        title: "One point of contact",
        description:
          "From quote to walkthrough you deal with the same crew — not a rotating cast of subcontractors.",
      },
    ],
  },

  gallery: {
    eyebrow: "Project Gallery",
    title: "Recent work around Columbus.",
    description:
      "A sample of repair and finish projects. Replace these placeholders with your own photos — paths live under public/gallery/ and entries in gallery.items.",
    initialCount: 4,
    expandLabel: "See all projects",
    collapseLabel: "Show less",
    viewProjectLabel: "View project →",
    followCtaLabel: "Follow @northgateservices →",
    profileCtaLabel: "See us on Google Maps",
    items: [
      {
        src: "/gallery/project-01.png",
        title: "Kitchen punch list",
        colors: "Trim · hardware · paint touch-up",
        date: "2026-05-12",
        projectUrl: "#",
        alt: "Kitchen punch-list work by Northgate Services in Columbus OH",
      },
      {
        src: "/gallery/project-02.png",
        title: "Stair rail repair",
        colors: "Stain match · hardware",
        date: "2026-04-28",
        projectUrl: "#",
        alt: "Stair rail repair by Northgate Services in Columbus OH",
      },
      {
        src: "/gallery/project-03.png",
        title: "Fence gate rebuild",
        colors: "Cedar · black hardware",
        date: "2026-04-10",
        projectUrl: "#",
        alt: "Fence gate rebuild by Northgate Services in Columbus OH",
      },
      {
        src: "/gallery/project-04.png",
        title: "Bath hardware upgrade",
        colors: "Brushed nickel · caulk",
        date: "2026-03-22",
        projectUrl: "#",
        alt: "Bath hardware upgrade by Northgate Services in Columbus OH",
      },
      {
        src: "/gallery/project-05.png",
        title: "Drywall patch & texture",
        colors: "Match existing texture",
        date: "2026-03-08",
        projectUrl: "#",
        alt: "Drywall patch and texture by Northgate Services in Columbus OH",
      },
      {
        src: "/gallery/project-06.png",
        title: "Exterior fixture install",
        colors: "Black outdoor fixtures",
        date: "2026-02-19",
        projectUrl: "#",
        alt: "Exterior fixture install by Northgate Services in Columbus OH",
      },
      {
        src: "/gallery/project-07.png",
        title: "Door and trim reset",
        colors: "Paint-grade white",
        date: "2026-02-04",
        projectUrl: "#",
        alt: "Door and trim reset by Northgate Services in Columbus OH",
      },
      {
        src: "/gallery/project-08.png",
        title: "Deck board replacements",
        colors: "Pressure-treated · sealed",
        date: "2026-01-18",
        projectUrl: "#",
        alt: "Deck board replacements by Northgate Services in Columbus OH",
      },
    ],
  },

  reviews: {
    eyebrow: "Reviews",
    title: "Neighbors who called us back.",
    description:
      "Sample reviews for the template demo. Replace with your real Google or review-site quotes.",
    initialCount: 3,
    expandLabel: "Show all reviews",
    collapseLabel: "Show less",
    link: {
      label: "Read reviews on Google",
      href: "https://www.google.com/maps/search/?api=1&query=Northgate+Services+Columbus+OH",
    },
    items: [
      {
        title: "Showed up when they said they would",
        quote:
          "Had a list of small repairs after buying our house. Northgate knocked them out in two visits and left everything clean. Fair quote, no pressure.",
        author: "Jordan M",
        date: "May 18, 2026",
      },
      {
        title: "Finish work after our remodel",
        quote:
          "Our contractor finished the big stuff and left a long punch list. These folks handled trim, caulk, and hardware without drama. Kitchen finally feels done.",
        author: "Priya S",
        date: "April 9, 2026",
      },
      {
        title: "Fence gate that actually closes",
        quote:
          "Gate had sagged for a year. They rebuilt the frame, hung it square, and it latches every time. Wish we had called sooner.",
        author: "Chris L",
        date: "March 22, 2026",
      },
      {
        title: "Clear communication",
        quote:
          "Texted photos of a few issues, got a same-week visit, and a written scope before they started. That alone is why we will use them again.",
        author: "Alex R",
        date: "February 14, 2026",
      },
      {
        title: "Rental turnover help",
        quote:
          "Needed a unit turned quickly between tenants. Drywall, fixtures, and a few outdoor fixes — all done on schedule.",
        author: "Morgan T",
        date: "January 30, 2026",
      },
      {
        title: "Professional and careful",
        quote:
          "Worked around our kids and dog without making a mess. Small things done well is harder than it looks.",
        author: "Sam K",
        date: "January 12, 2026",
      },
    ],
  },

  findUs: {
    eyebrow: "Find us",
    title: "Verified listings",
    openLabel: "Open →",
    cards: [
      {
        id: "google",
        title: "Google Maps",
        sublabel: "Directions and listing",
      },
      {
        id: "reviews",
        title: "Customer reviews",
        sublabel: "See what neighbors say",
      },
      {
        id: "instagram",
        title: "@northgateservices",
        sublabel: "Recent project photos",
      },
    ],
  },

  faq: [
    {
      question: "What kinds of jobs do you take?",
      answer:
        "Home repairs, remodel punch lists and finish work, and outdoor maintenance that a licensed handyman crew can handle safely. If a job needs a specialist trade (major electrical, HVAC, structural), we will tell you up front rather than stretch past our scope.",
    },
    {
      question: "How do you price work?",
      answer:
        "Most jobs are quoted after a short on-site look so the scope is real. Small fixed-scope repairs may be quoted from photos when we have enough detail. You approve the quote before work starts.",
    },
    {
      question: "How soon can you schedule?",
      answer:
        "Typical lead time is about one to two weeks depending on the queue and job size. Urgent safety issues get prioritized when we can. We will give a clearer window when we confirm your visit.",
    },
    {
      question: "Are you licensed and insured?",
      answer:
        "Yes. We carry the insurance homeowners expect and work within our licensed scope. Ask for a certificate of insurance if your HOA or property manager needs one on file.",
    },
    {
      question: "Do you work in occupied homes?",
      answer:
        "Every day. We plan for dust, noise, and pets, protect floors when needed, and clean the work area before we leave. Let us know about access, alarms, or quiet hours when you book.",
    },
    {
      question: "What areas do you serve?",
      answer:
        "Columbus metro — including Westerville, Dublin, Grove City, and nearby neighborhoods. If you are just outside our usual radius, ask; some jobs still make sense.",
    },
    {
      question: "Can you use materials I already bought?",
      answer:
        "Often yes. Bring what you have or send product links when you inquire. We will confirm fit and any extras needed before the visit.",
    },
    {
      question: "How do I get started?",
      answer:
        "Call or text 614-555-0142, use the contact form, or email hello@northgateservices.example. Share a short description and a few photos if you can — we will reply with next steps.",
    },
  ],

  contactSection: {
    eyebrow: "Contact",
    title: "Ready for a quote?",
    description:
      "Tell us what needs fixing, your neighborhood, and timing. We will follow up with next steps — or call to book a visit.",
  },

  scheduleSection: {
    eyebrow: "Schedule",
    title: "Book a visit or consult",
    description:
      "Prefer to talk it through? Call or text us or use the form — we will get you on the calendar.",
    phoneCtaLabel: "Call or text 614-555-0142",
    formCtaLabel: "Send a message",
    formCtaHref: "#contact-form",
  },

  itemTypes: ["Home repair", "Remodel touch-up", "Outdoor", "Other"] as const,

  seo: {
    homeTitle:
      "Home Repairs & Handyman Services in Columbus, OH | Northgate Services",
    homeDescription:
      "Licensed home repairs, remodel touch-ups, and outdoor maintenance in Columbus, OH. Clear quotes, careful work. Call 614-555-0142.",
    contactTitle: "Contact",
    contactDescription:
      "Get a home repair quote in Columbus, OH. Call 614-555-0142 or message Northgate Services.",
  },

  notFound: {
    title: "Page not found",
    description:
      "That page does not exist. Head home or reach out if you need a repair quote.",
    ctaLabel: "Back to home",
    ctaHref: "/",
  },

  footer: {
    blurb:
      "Licensed handyman and home-services crew in Columbus, OH. Reliable repairs, remodel finish work, and outdoor maintenance.",
  },
} as const;

export type Site = typeof site;

export function getServiceBySlug(slug: string): Service | undefined {
  return (site.services as unknown as Service[]).find((s) => s.slug === slug);
}

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}
