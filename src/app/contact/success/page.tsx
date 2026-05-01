'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const monoStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
  fontSize: "0.7rem",
  textTransform: "uppercase",
  color: "var(--pewter)",
  letterSpacing: "0.08em",
};

function CheckmarkIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.5 5L4 7.5L8.5 2.5"
        stroke="var(--paper)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChecklistItem({
  active,
  title,
  description,
}: {
  active: boolean;
  title: string;
  description: string;
}) {
  return (
    <div className="grid grid-cols-[24px_1fr] gap-4 mb-6 items-start">
      <div
        className="w-[18px] h-[18px] flex items-center justify-center mt-1 shrink-0"
        style={{
          border: "1px solid var(--ink)",
          backgroundColor: active ? "var(--ink)" : "transparent",
        }}
      >
        {active && <CheckmarkIcon />}
      </div>
      <div>
        <p
          className="text-[1rem] font-semibold mb-1"
          style={{ fontFamily: "var(--font-sans-var), 'Instrument Sans', sans-serif" }}
        >
          {title}
        </p>
        <p className="text-[0.9rem] leading-[1.5]" style={{ color: "var(--pewter)" }}>
          {description}
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  const [submittedDate, setSubmittedDate] = useState("");

  useEffect(() => {
    setSubmittedDate(
      new Date()
        .toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        .toUpperCase()
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 md:px-10">
        <section className="pt-16 pb-10 max-w-[640px]">
          <h1
            style={{
              fontFamily: "var(--font-display-var), 'DM Serif Display', serif",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
            }}
          >
            Brief received.
          </h1>
          <p className="mt-4 text-[1rem]" style={monoStyle}>
            Replying within 4 hours during business hours.
          </p>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid var(--bone)" }} />

        {/* Receipt */}
        <div
          className="mt-10 p-6"
          style={{ border: "1px solid var(--bone)", maxWidth: "480px" }}
        >
          <div
            className="flex justify-between items-start pb-5 mb-5"
            style={{ borderBottom: "1px solid var(--bone)" }}
          >
            <span style={monoStyle}>Submission summary</span>
            {submittedDate && <span style={monoStyle}>{submittedDate}</span>}
          </div>
          {[
            { label: "Status", value: "Received" },
            { label: "Response", value: "Within 4 hours" },
            { label: "Quote", value: "Pending review" },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              className="flex justify-between py-3"
              style={i < arr.length - 1 ? { borderBottom: "1px dashed var(--bone)" } : {}}
            >
              <span style={monoStyle}>{row.label}</span>
              <span
                className="text-[0.95rem] font-semibold"
                style={{ fontFamily: "var(--font-sans-var), 'Instrument Sans', sans-serif" }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* What happens next */}
        <section className="mt-12 mb-16 max-w-[480px]">
          <span className="block mb-6" style={monoStyle}>
            What happens next
          </span>
          <ChecklistItem
            active={true}
            title="Brief received"
            description="Your project brief is in our inbox and assigned for review."
          />
          <ChecklistItem
            active={false}
            title="Reviewing your brief"
            description="We'll confirm we can hit the timeline and scope the work precisely."
          />
          <ChecklistItem
            active={false}
            title="Fixed quote delivered"
            description="You'll get a final price and timeline. No commitment until you say go."
          />
        </section>

        <hr style={{ border: "none", borderTop: "1px solid var(--bone)" }} />

        <div className="py-10">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.06em] no-underline transition-opacity hover:opacity-60 min-h-[44px]"
            style={{
              fontFamily: "var(--font-sans-var), 'Instrument Sans', sans-serif",
              color: "var(--ink)",
            }}
          >
            &larr; Back to home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
