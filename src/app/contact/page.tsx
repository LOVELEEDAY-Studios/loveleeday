'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const labelStyle = {
  fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
  fontSize: "0.75rem",
  textTransform: "uppercase" as const,
  color: "#5A5A55",
  letterSpacing: "0.05em",
};

const fieldStyle = {
  borderBottom: "1px solid #D4D2C9",
  borderTop: "none",
  borderLeft: "none",
  borderRight: "none",
  color: "#111",
};

function LogoMark() {
  return (
    <svg
      className="w-12 h-12 mb-3"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="20" y="20" width="25" height="25" stroke="#111" strokeWidth="2" />
      <rect x="55" y="20" width="25" height="25" fill="#111" />
      <rect x="20" y="55" width="25" height="25" fill="#111" />
      <path d="M55 55H80V80H55V55Z" stroke="#111" strokeWidth="2" />
      <circle cx="67.5" cy="67.5" r="4" fill="#111" />
    </svg>
  );
}

type Status = 'idle' | 'submitting' | 'error';

export default function ContactPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      project_type: (form.elements.namedItem('project_type') as HTMLSelectElement).value,
      budget: (form.elements.namedItem('budget') as HTMLSelectElement).value,
      details: (form.elements.namedItem('details') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/contact/success');
      } else {
        setStatus('error');
        setErrorMessage("Couldn't send right now. Email hello@loveleedaystudios.com directly.");
      }
    } catch {
      setStatus('error');
      setErrorMessage("Couldn't send right now. Email hello@loveleedaystudios.com directly.");
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center selection:bg-[#111] selection:text-[#F3F2EE]"
      style={{
        backgroundColor: "#F3F2EE",
        color: "#111111",
        padding: "4vw",
      }}
    >
      {/* Header */}
      <header className="w-full max-w-[1400px] flex flex-col items-center mb-[6vw]">
        <Link href="/" className="flex flex-col items-center no-underline text-[#111]">
          <LogoMark />
          <div
            className="text-center leading-none"
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "2rem",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            LOVELEEDAY
            <br />
            <span
              className="block mt-1.5"
              style={{
                fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 400,
              }}
            >
              Studios&trade;
            </span>
          </div>
        </Link>
        <nav className="flex gap-8 mt-6 text-[0.8rem] font-medium uppercase tracking-[0.05em]">
          <Link href="/#services" className="text-[#111] no-underline hover:opacity-60 transition-opacity">
            Services
          </Link>
          <Link href="/#approach" className="text-[#111] no-underline hover:opacity-60 transition-opacity">
            Approach
          </Link>
          <Link href="/work" className="text-[#111] no-underline hover:opacity-60 transition-opacity">
            Work
          </Link>
          <Link href="/contact" className="text-[#111] no-underline border-b border-[#111] pb-0.5">
            Contact
          </Link>
        </nav>
      </header>

      {/* Main */}
      <main className="w-full max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-[4vw]">
          {/* Left — Info */}
          <div>
            <h1
              className="mb-[2vw]"
              style={{
                fontSize: "clamp(2rem, 4vw, 4rem)",
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: "-0.035em",
              }}
            >
              Let&apos;s talk about
              <br />
              your project.
            </h1>

            <p className="text-[1.1rem] leading-[1.5] max-w-[50ch] mb-[3vw]" style={{ color: "#5A5A55" }}>
              Tell us what you need. We&apos;ll reply within 24 hours with a scope,
              price, and timeline. No commitment, no cost, no meetings unless you
              want one.
            </p>

            <hr className="border-none mb-[2vw]" style={{ borderTop: "1px solid #D4D2C9" }} />

            <div className="space-y-6">
              <div>
                <span className="block mb-2" style={labelStyle}>Email</span>
                <a
                  href="mailto:hello@loveleedaystudios.com"
                  className="text-[1.1rem] text-[#111] no-underline border-b border-[#D4D2C9] pb-0.5 hover:border-[#111] transition-colors"
                >
                  hello@loveleedaystudios.com
                </a>
              </div>

              <div>
                <span className="block mb-2" style={labelStyle}>Response Time</span>
                <p className="text-[1.1rem]">Within 24 hours, usually faster.</p>
              </div>

              <div>
                <span className="block mb-2" style={labelStyle}>Location</span>
                <p className="text-[1.1rem]">Remote — based in Michigan, USA.</p>
              </div>

              <div>
                <span className="block mb-2" style={labelStyle}>Entity</span>
                <p className="text-[1.1rem]">LOVELEEDAY Studios LLC, Delaware.</p>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
              <div>
                <label htmlFor="name" className="block mb-2" style={labelStyle}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full bg-transparent text-[1rem] py-3 outline-none focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-2"
                  style={fieldStyle}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2" style={labelStyle}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full bg-transparent text-[1rem] py-3 outline-none focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-2"
                  style={fieldStyle}
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label htmlFor="project-type" className="block mb-2" style={labelStyle}>
                  Project Type <span style={{ color: "#C0392B" }} aria-hidden="true">*</span>
                </label>
                <select
                  id="project-type"
                  name="project_type"
                  required
                  aria-required="true"
                  className="w-full bg-transparent text-[1rem] py-3 outline-none appearance-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-2"
                  style={{ ...fieldStyle, borderRadius: 0 }}
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
                <label htmlFor="budget" className="block mb-2" style={labelStyle}>
                  Budget Range <span style={{ color: "#C0392B" }} aria-hidden="true">*</span>
                </label>
                <select
                  id="budget"
                  name="budget"
                  required
                  aria-required="true"
                  className="w-full bg-transparent text-[1rem] py-3 outline-none appearance-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-2"
                  style={{ ...fieldStyle, borderRadius: 0 }}
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
                <label htmlFor="details" className="block mb-2" style={labelStyle}>
                  Project Details
                </label>
                <textarea
                  id="details"
                  name="details"
                  rows={5}
                  required
                  className="w-full bg-transparent text-[1rem] py-3 outline-none resize-none focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-2"
                  style={fieldStyle}
                  placeholder="Describe what you need built. The more detail, the more accurate our quote."
                />
              </div>

              {status === 'error' && (
                <div
                  role="alert"
                  className="text-[0.9rem] py-3 px-4"
                  style={{
                    backgroundColor: "#FFF0EE",
                    border: "1px solid #C0392B",
                    color: "#C0392B",
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <div className="mt-4">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-block text-[0.9rem] font-medium uppercase tracking-[0.05em] transition-colors hover:bg-[#333] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-2 outline-none"
                  style={{
                    backgroundColor: "#111111",
                    color: "#F3F2EE",
                    padding: "1rem 2rem",
                    border: "none",
                  }}
                >
                  {status === 'submitting' ? 'Sending…' : 'Send Project Brief'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="w-full max-w-[1400px] mt-[6vw] pt-[2vw] flex flex-col sm:flex-row justify-between items-center gap-4"
        style={{ borderTop: "1px solid #D4D2C9" }}
      >
        <span className="text-xs" style={{ color: "#5A5A55" }}>
          &copy; 2026 LOVELEEDAY Studios LLC. A Delaware company.
        </span>
        <span className="text-xs" style={{ color: "#5A5A55" }}>
          hello@loveleedaystudios.com
        </span>
      </footer>
    </div>
  );
}
