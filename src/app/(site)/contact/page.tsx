"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

/* /contact.
   ==========================================================================

   The submit path was already correct and is unchanged: POST JSON to
   /api/contact, redirect to /contact/success on 200, and on any failure show
   the direct email address rather than swallowing the error. A contact form
   that fails silently is worse than no contact form.

   What changed is everything around it. The fields were styled with
   var(--bone) and var(--pewter) -- tokens that do not exist -- so every input
   underline and every label was rendering in an inherited colour rather than a
   chosen one. And the page asked for a budget band before it asked what the
   problem was, which is the order that makes a serious enquiry feel screened.
   ========================================================================== */

type Status = "idle" | "submitting" | "error";

const PROJECT_TYPES = [
  "Internal tool or workflow system",
  "Customer-facing application",
  "Data / financial integration",
  "Website or brand rebuild",
  "Arthur engagement",
  "Something else",
];

const BUDGETS = ["Under $10k", "$10k – $25k", "$25k – $50k", "$50k+", "Not sure yet"];

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

  const field =
    "mt-2 block w-full rounded-[3px] border border-[var(--line-2)] bg-[var(--paper)] px-3.5 py-3 text-[15px] text-[var(--ink)] outline-none transition-colors focus:border-[var(--ink)]";

  return (
    <>
      <section className="border-b border-[var(--line)] bg-[var(--paper)] pt-[clamp(56px,7vw,104px)] pb-[clamp(36px,4vw,60px)]">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p className="eyebrow flex items-center gap-2.5 text-[var(--dim)]">
              <span className="inline-block h-[7px] w-[7px]" style={{ background: "var(--teal)" }} />
              Start a project
            </p>
            <h1 className="display display-lg mt-7">
              Bring us the
              <br />
              <span style={{ color: "var(--dim)" }}>question.</span>
            </h1>
          </div>
          <div className="max-w-[var(--measure)] self-end">
            <p className="text-[1.05rem] leading-[1.6] text-[var(--mid)]">
              Describe the problem in your own words. You will get a reply from Daniel, not a
              sequence, and a fixed quote with a scope attached rather than a discovery call.
            </p>
            <p className="mt-4 text-[14px] text-[var(--dim)]">
              Prefer email?{" "}
              <a
                href="mailto:hello@loveleedaystudios.com"
                className="font-medium text-[var(--ink)] underline decoration-[var(--line-2)] underline-offset-4 hover:decoration-[var(--teal)]"
              >
                hello@loveleedaystudios.com
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--paper)] py-[clamp(48px,6vw,88px)]">
        <div className="shell grid gap-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          <form onSubmit={handleSubmit} className="max-w-[40rem]" noValidate={false}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="eyebrow text-[var(--dim)]">
                  Your name
                </label>
                <input id="name" name="name" type="text" required autoComplete="name" className={field} />
              </div>
              <div>
                <label htmlFor="email" className="eyebrow text-[var(--dim)]">
                  Email
                </label>
                <input id="email" name="email" type="email" required autoComplete="email" className={field} />
              </div>
            </div>

            {/* The problem comes before the budget. Asking for a band first is
                the order that makes a serious enquiry feel screened. */}
            <div className="mt-6">
              <label htmlFor="details" className="eyebrow text-[var(--dim)]">
                What is the problem?
              </label>
              <textarea
                id="details"
                name="details"
                required
                rows={7}
                placeholder="What is slowing the business down, what you have tried, and what a good outcome looks like."
                className={field + " resize-y leading-[1.6] placeholder:text-[var(--dim)]"}
              />
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="project_type" className="eyebrow text-[var(--dim)]">
                  Kind of work
                </label>
                <select id="project_type" name="project_type" className={field}>
                  {PROJECT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="budget" className="eyebrow text-[var(--dim)]">
                  Budget range
                </label>
                <select id="budget" name="budget" className={field}>
                  {BUDGETS.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex h-12 items-center rounded-[3px] px-6 text-[14.5px] font-semibold text-white transition-colors hover:bg-[var(--teal-d)] disabled:opacity-60"
                style={{ background: "var(--teal-d)" }}
              >
                {status === "submitting" ? "Sending…" : "Send the brief"}
              </button>
              <span className="text-[13px] text-[var(--dim)]">Usually answered the same day.</span>
            </div>

            {status === "error" && (
              <p
                role="alert"
                className="mt-5 border-l-2 border-[var(--teal)] pl-4 text-[14px] text-[var(--ink)]"
              >
                {errorMessage}
              </p>
            )}
          </form>

          <aside className="lg:border-l lg:border-[var(--line)] lg:pl-12">
            <h2 className="eyebrow text-[var(--dim)]">What happens next</h2>
            <ol className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {[
                ["A reply, from a person", "Usually the same day, with the questions we need answered to quote it."],
                ["A fixed quote with a scope", "One number and a written scope. No retainer, no discovery phase you pay for."],
                ["A build you can watch", "You see it deployed as it is built, not at the end."],
              ].map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[38px_1fr] gap-x-4 py-5">
                  <span className="eyebrow tnum pt-1 text-[var(--dim)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold">{t}</p>
                    <p className="mt-1.5 text-[13.5px] leading-[1.55] text-[var(--mid)]">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-7 text-[13px] leading-[1.6] text-[var(--dim)]">
              Already have a portal link from us? Open it directly — it does not need an account.
            </p>
            <Link
              href="/work"
              className="mt-4 inline-block text-[13.5px] font-semibold underline decoration-[var(--line-2)] underline-offset-4 hover:decoration-[var(--teal)]"
            >
              See what we&rsquo;ve shipped &rarr;
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
