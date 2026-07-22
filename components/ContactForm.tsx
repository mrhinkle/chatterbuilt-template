"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/content/site";

type Status = "idle" | "loading" | "success" | "error";

const DEFAULT_ITEM_TYPES = ["General inquiry", "Quote request", "Other"] as const;

export function ContactForm() {
  const itemTypes =
    "itemTypes" in site && Array.isArray(site.itemTypes) && site.itemTypes.length > 0
      ? (site.itemTypes as readonly string[])
      : DEFAULT_ITEM_TYPES;
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [itemType, setItemType] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      itemType: String(formData.get("itemType") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      website: String(formData.get("website") ?? "").trim(), // honeypot
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Something went wrong. Please try again or call us.");
        return;
      }

      setStatus("success");
      form.reset();
      setItemType("");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again or call us.");
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-md border border-border bg-panel-elevated p-6 text-center"
        role="status"
      >
        <p className="font-display text-xl font-semibold text-foreground">Message sent</p>
        <p className="mt-2 text-sm text-muted">
          Thanks — we’ll get back to you soon. For faster service, call{" "}
          <a href={site.contact.phoneHref} className="text-accent hover:text-accent-hover">
            {site.contact.phone}
          </a>
          .
        </p>
        <button
          type="button"
          className="btn btn-secondary mt-4"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit}
      className="space-y-4"
      noValidate
      aria-label="Contact form"
    >
      {/* Honeypot */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="name" className="label">
          Name <span className="text-accent">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="input"
          placeholder="Your name"
          disabled={status === "loading"}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="label">
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="input"
            placeholder="you@example.com"
            disabled={status === "loading"}
          />
        </div>
        <div>
          <label htmlFor="phone" className="label">
            Phone <span className="text-muted-dim">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="input"
            placeholder="(555) 555-0100"
            disabled={status === "loading"}
          />
        </div>
      </div>

      <div>
        <label htmlFor="itemType" className="label">
          Project type <span className="text-accent">*</span>
        </label>
        <select
          id="itemType"
          name="itemType"
          required
          className="select"
          value={itemType}
          onChange={(e) => setItemType(e.target.value)}
          disabled={status === "loading"}
        >
          <option value="" disabled>
            Select project type
          </option>
          {itemTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="label">
          Message <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          className="textarea"
          placeholder="What needs fixing? Neighborhood, timeline, questions…"
          disabled={status === "loading"}
        />
      </div>

      {status === "error" && (
        <p className="rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error" role="alert">
          {errorMessage}
        </p>
      )}

      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
