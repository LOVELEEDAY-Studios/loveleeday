import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import Link from "next/link";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-playfair",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

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
        <h4 className="text-[1.1rem] font-medium mb-1">{title}</h4>
        <p className="text-[0.9rem] leading-[1.4]" style={{ color: "#5A5A55" }}>
          {description}
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div
      className={`${playfair.variable} ${jetbrains.variable} min-h-screen flex flex-col items-center selection:bg-[#111] selection:text-[#F3F2EE]`}
      style={{
        backgroundColor: "#F3F2EE",
        color: "#111111",
        fontFamily: "'Inter', -apple-system, sans-serif",
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
              fontFamily: "'Playfair Display', var(--font-playfair), serif",
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
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 500,
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
            Transmission Received.
          </h1>
          <p
            style={{
              fontFamily: "'JetBrains Mono', var(--font-mono), monospace",
              fontSize: "0.85rem",
              color: "#5A5A55",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Estimated Response Time: &lt; 12 Hours
          </p>
        </section>

        {/* Receipt card */}
        <div className="border border-[#D4D2C9] p-[2vw] mt-[2vw]">
          {/* Receipt header */}
          <div className="border-b border-[#D4D2C9] pb-6 mb-6 flex justify-between items-start">
            <div>
              <span
                className="block mb-1"
                style={{
                  fontFamily: "'JetBrains Mono', var(--font-mono), monospace",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  color: "#5A5A55",
                  letterSpacing: "0.05em",
                }}
              >
                Submission Summary
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', var(--font-mono), monospace",
                  fontSize: "0.75rem",
                  color: "#5A5A55",
                }}
              >
                REQ-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 9000) + 1000)}
              </span>
            </div>
            <div className="text-right">
              <span
                style={{
                  fontFamily: "'JetBrains Mono', var(--font-mono), monospace",
                  fontSize: "0.75rem",
                  color: "#5A5A55",
                }}
              >
                DATE: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Receipt rows */}
          {[
            { label: "Project Type", value: "Pending Classification" },
            { label: "Priority", value: "Standard (3\u20137 Days)" },
            { label: "Contact", value: "Your submitted email" },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              className="flex justify-between py-3"
              style={i < arr.length - 1 ? { borderBottom: "1px dashed #D4D2C9" } : {}}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', var(--font-mono), monospace",
                  fontSize: "0.75rem",
                  color: "#5A5A55",
                  textTransform: "uppercase",
                }}
              >
                {row.label}
              </span>
              <span className="text-[0.95rem] font-medium text-right">{row.value}</span>
            </div>
          ))}
          <div className="flex justify-between py-3">
            <span
              style={{
                fontFamily: "'JetBrains Mono', var(--font-mono), monospace",
                fontSize: "0.75rem",
                color: "#5A5A55",
                textTransform: "uppercase",
              }}
            >
              Estimated Quote
            </span>
            <span className="text-[0.95rem] font-medium text-right">Pending Review</span>
          </div>
        </div>

        {/* Checklist */}
        <section className="mt-[4vw]">
          <span
            className="block mb-6"
            style={{
              fontFamily: "'JetBrains Mono', var(--font-mono), monospace",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              color: "#5A5A55",
              letterSpacing: "0.05em",
            }}
          >
            Next Steps Checklist
          </span>
          <ChecklistItem
            active={true}
            title="Intake confirmed"
            description="Your project brief has been added to our queue and assigned to a lead engineer."
          />
          <ChecklistItem
            active={false}
            title="Feasibility analysis"
            description="We will review your technical requirements to ensure we can meet the requested timeline."
          />
          <ChecklistItem
            active={false}
            title="Fixed quote delivery"
            description='You will receive a final price and a "Commence" link to initiate the project immediately.'
          />
        </section>

        {/* Footer nav */}
        <footer className="mt-[6vw] pt-[2vw] flex justify-center" style={{ borderTop: "1px solid #D4D2C9" }}>
          <Link
            href="/"
            className="no-underline text-[#111] text-[0.85rem] font-medium uppercase tracking-[0.05em] flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            &larr; Return to Studio Home
          </Link>
        </footer>
      </main>
    </div>
  );
}
