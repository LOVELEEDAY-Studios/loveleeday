'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
  fontSize: "0.68rem",
  textTransform: "uppercase",
  color: "var(--pewter)",
  letterSpacing: "0.08em",
  display: "block",
  marginBottom: "0.5rem",
};

const fieldStyle: React.CSSProperties = {
  borderBottom: "1px solid var(--bone)",
  borderTop: "none",
  borderLeft: "none",
  borderRight: "none",
  borderRadius: 0,
  color: "var(--ink)",
  backgroundColor: "transparent",
};

type Status = "idle" | "submitting" | "error";

export default function ContactPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      project_type: (form.elements.namedItem("project_type") as HTMLSelectElement).value,
      budget: (form.elements.namedItem("budget") as HTMLSelectElement).value,
      details: (form.elements.namedItem("details") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/contact/success");
      } else {
        setStatus("error");
        setErrorMessage("Couldn't send right now. Email hello@loveleedaystudios.com directly.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Couldn't send right now. Email hello@loveleedaystudios.com directly.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav activeHref="/contact" />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Hero */}
        <section className="pt-12 pb-16 md:pt-16 md:pb-20">
          <h1
            style={{
              fontFamily: "var(--font-display-var), 'DM Serif Display', serif",
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
            }}
          >
            Let&rsquo;s talk about
            <br />
            your project.
          </h1>
          <p
            className="mt-6 text-[1rem] leading-[1.6] max-w-[48ch]"
            style={{ color: "var(--pewter)" }}
          >
            Tell us what you need. We reply within 4 hours during business hours with a scope,
            price, and timeline. No commitment, no cost.
          </p>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid var(--bone)" }} />

        {/* Two-col grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-12 md:gap-16 items-start">
          {/* Left — info */}
          <div>
            <div className="flex flex-col gap-7">
              <div>
                <span style={labelStyle}>Email</span>
                <a
                  href="mailto:hello@loveleedaystudios.com"
                  className="text-[1rem] no-underline hover:opacity-60 transition-opacity inline-block min-h-[44px] flex items-center"
                  style={{
                    color: "var(--ink)",
                    borderBottom: "1px solid var(--bone)",
                    paddingBottom: "8px",
                  }}
                >
                  hello@loveleedaystudios.com
                </a>
              </div>
              <div>
                <span style={labelStyle}>Response time</span>
                <p className="text-[1rem]">Within 4 hours during business hours.</p>
              </div>
              <div>
                <span style={labelStyle}>Location</span>
                <p className="text-[1rem]">Kalamazoo, MI &mdash; serving clients globally.</p>
              </div>
              <div>
                <span style={labelStyle}>Entity</span>
                <p className="text-[1rem]">LOVELEEDAY Studios LLC, Delaware.</p>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-7" noValidate>
              <div>
                <label htmlFor="name" style={labelStyle}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full text-[1rem] py-3 outline-none"
                  style={fieldStyle}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" style={labelStyle}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full text-[1rem] py-3 outline-none"
                  style={fieldStyle}
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label htmlFor="project-type" style={labelStyle}>
                  Project type <span style={{ color: "var(--ember)" }} aria-hidden="true">*</span>
                </label>
                <select
                  id="project-type"
                  name="project_type"
                  required
                  aria-required="true"
                  className="w-full text-[1rem] py-3 outline-none appearance-none cursor-pointer"
                  style={fieldStyle}
                >
                  <option value="">Select a service</option>
                  <option value="landing-page">Landing Page ($500+)</option>
                  <option value="full-stack-app">Full-Stack App ($1,500+)</option>
                  <option value="data-dashboard">Data Dashboard ($800+)</option>
                  <option value="stripe-integration">Stripe Integration ($400+)</option>
                  <option value="seo-audit">SEO Audit ($300+)</option>
                  <option value="bug-fix">Bug Fix & Rescue ($200+)</option>
                  <option value="other">Something else</option>
                </select>
              </div>

              <div>
                <label htmlFor="budget" style={labelStyle}>
                  Budget range <span style={{ color: "var(--ember)" }} aria-hidden="true">*</span>
                </label>
                <select
                  id="budget"
                  name="budget"
                  required
                  aria-required="true"
                  className="w-full text-[1rem] py-3 outline-none appearance-none cursor-pointer"
                  style={fieldStyle}
                >
                  <option value="">Select a range</option>
                  <option value="200-500">$200 – $500</option>
                  <option value="500-1000">$500 – $1,000</option>
                  <option value="1000-2500">$1,000 – $2,500</option>
                  <option value="2500-5000">$2,500 – $5,000</option>
                  <option value="5000+">$5,000+</option>
                </select>
              </div>

              <div>
                <label htmlFor="details" style={labelStyle}>
                  Project details
                </label>
                <textarea
                  id="details"
                  name="details"
                  rows={5}
                  required
                  className="w-full text-[1rem] py-3 outline-none resize-none"
                  style={fieldStyle}
                  placeholder="Describe what you need built. The more detail, the more accurate our quote."
                />
              </div>

              {status === "error" && (
                <div
                  role="alert"
                  className="text-[0.9rem] py-3 px-4"
                  style={{
                    backgroundColor: "#FFF0EE",
                    border: "1px solid var(--ember)",
                    color: "var(--ember)",
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex items-center justify-center text-sm font-semibold uppercase tracking-[0.06em] transition-opacity hover:opacity-80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  style={{
                    fontFamily: "var(--font-sans-var), 'Instrument Sans', sans-serif",
                    backgroundColor: "var(--vermilion)",
                    color: "var(--paper)",
                    padding: "0.85rem 1.75rem",
                    border: "none",
                    borderRadius: 0,
                  }}
                  aria-label="Send project brief"
                >
                  {status === "submitting" ? "Sending…" : "Send Project Brief"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
