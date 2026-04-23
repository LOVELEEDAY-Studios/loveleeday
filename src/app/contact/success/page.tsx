'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

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

function CheckmarkIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#F3F2EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChecklistItem({ active, title, description }: { active: boolean; title: string; description: string }) {
  return (
    <div className="grid grid-cols-[24px_1fr] gap-4 mb-6 items-start">
      <div
        className="w-[18px] h-[18px] border border-[#111] flex items-center justify-center mt-0.5 shrink-0"
        style={active ? { backgroundColor: "#111111" } : {}}
      >
        {active && <CheckmarkIcon />}
      </div>
      <div>
        <h3 className="text-[1.1rem] font-medium mb-1">{title}</h3>
        <p className="text-[0.9rem] leading-[1.4]" style={{ color: "#5A5A55" }}>
          {description}
        </p>
      </div>
    </div>
  );
}

const monoStyle = {
  fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
  fontSize: "0.75rem",
  textTransform: "uppercase" as const,
  color: "#5A5A55",
  letterSpacing: "0.05em",
};

export default function SuccessPage() {
  const [submittedDate, setSubmittedDate] = useState('');

  useEffect(() => {
    setSubmittedDate(
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).toUpperCase()
    );
  }, []);

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
      </header>

      {/* Main */}
      <main className="w-full max-w-[800px]">
        {/* Hero */}
        <section className="text-center mb-[4vw]">
          <h1
            className="mb-4"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.035em",
            }}
          >
            Brief received.
          </h1>
          <p style={{ ...monoStyle }}>
            Replying within 24 hours, usually faster.
          </p>
        </section>

        {/* Receipt card */}
        <div className="border border-[#D4D2C9] p-[2vw] mt-[2vw]">
          {/* Receipt header */}
          <div className="border-b border-[#D4D2C9] pb-6 mb-6 flex justify-between items-start">
            <div>
              <span className="block mb-1" style={monoStyle}>
                Submission Summary
              </span>
            </div>
            <div className="text-right">
              {submittedDate && (
                <span style={{ ...monoStyle }}>
                  DATE: {submittedDate}
                </span>
              )}
            </div>
          </div>

          {/* Receipt rows */}
          {[
            { label: "Status", value: "Received" },
            { label: "Response", value: "Within 24 hours" },
            { label: "Quote", value: "Pending review" },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              className="flex justify-between py-3"
              style={i < arr.length - 1 ? { borderBottom: "1px dashed #D4D2C9" } : {}}
            >
              <span style={{ ...monoStyle }}>
                {row.label}
              </span>
              <span className="text-[0.95rem] font-medium text-right">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Checklist */}
        <section className="mt-[4vw]">
          <h2
            className="mb-6"
            style={{ ...monoStyle }}
          >
            What happens next
          </h2>
          <ChecklistItem
            active={true}
            title="Brief received"
            description="Your project brief is in our inbox and assigned for review."
          />
          <ChecklistItem
            active={false}
            title="Reviewing your brief"
            description="We'll look at your requirements and confirm we can hit the timeline."
          />
          <ChecklistItem
            active={false}
            title="Fixed quote delivered"
            description="You'll get a final price and timeline. No commitment until you say go."
          />
        </section>

        {/* Keep-warm — spam tip */}
        <div
          className="mt-[4vw] p-5"
          style={{ backgroundColor: "#EDEBE6", border: "1px solid #D4D2C9" }}
        >
          <span className="block mb-2" style={monoStyle}>Tip</span>
          <p className="text-[0.9rem] leading-[1.5]" style={{ color: "#5A5A55" }}>
            Check your spam folder if you don&apos;t hear from us — we reply from{" "}
            <strong style={{ color: "#111" }}>daniel@loveleedaystudios.com</strong>.
          </p>
        </div>

        {/* Keep-warm — recent work links */}
        <section className="mt-[4vw]">
          <h2
            className="mb-5"
            style={{ ...monoStyle }}
          >
            While you wait — recent work
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "olldae",
                desc: "Bar & restaurant OS. MVP in 11 days.",
                href: "/work#01",
              },
              {
                title: "Kronos",
                desc: "Financial dashboard. Auth in 5 days.",
                href: "/work#03",
              },
            ].map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="no-underline group"
              >
                <div
                  className="p-5 transition-colors group-hover:border-[#111]"
                  style={{ border: "1px solid #D4D2C9" }}
                >
                  <span
                    className="block font-medium mb-1"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {p.title}
                  </span>
                  <span className="text-[0.85rem]" style={{ color: "#5A5A55" }}>
                    {p.desc}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer nav */}
        <footer className="mt-[6vw] pt-[2vw] flex justify-center" style={{ borderTop: "1px solid #D4D2C9" }}>
          <Link
            href="/"
            className="no-underline text-[#111] text-[0.85rem] font-medium uppercase tracking-[0.05em] flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            &larr; Back to home
          </Link>
        </footer>
      </main>
    </div>
  );
}
