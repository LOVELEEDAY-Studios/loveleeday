"use client";

import { useState } from "react";

interface Props {
  token: string;
  client: string;
  deliverables: { slug: string; title: string }[];
  /** Preselect when the form sits inside one deliverable's page. */
  defaultSlug?: string;
  compact?: boolean;
}

/* Feedback has to land in Daniel's inbox the moment it is written. A client who
   has to open their mail client to reply is a client who replies tomorrow, or
   not at all. */
export function NoteForm({ token, client, deliverables, defaultSlug, compact }: Props) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/portal/note", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, token, client }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Failed to send");
      setState("sent");
      form.reset();
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Failed to send");
    }
  }

  if (state === "sent") {
    return (
      <div className="border border-[var(--line-bright)] p-8">
        <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--good)]">
          Note sent
        </p>
        <p className="mt-4 max-w-[var(--measure)] text-[15px] leading-[1.7] text-[var(--muted)]">
          It is in our inbox now. You will hear back within one business day, and
          you can leave another below.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-6 min-h-[44px] border border-[var(--line-bright)] px-5 text-[14px] text-[var(--muted)] transition-colors hover:border-[var(--text)] hover:text-[var(--text)]"
        >
          Leave another note
        </button>
      </div>
    );
  }

  const field =
    "mt-2 block w-full border border-[var(--line-bright)] bg-[var(--ground)] px-3.5 py-3 text-[15px] text-[var(--text)] placeholder:text-[var(--dim)] focus:border-[var(--accent)] focus:outline-none";
  const label =
    "font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--dim)]";

  return (
    <form onSubmit={onSubmit} className="border border-[var(--line-bright)] p-8">
      <h2
        className={
          compact
            ? "text-[18px] font-medium tracking-[-0.01em]"
            : "text-[26px] font-medium leading-[1.2] tracking-[-0.02em]"
        }
      >
        Leave a note
      </h2>
      <p className="mt-3 max-w-[var(--measure)] text-[14px] leading-[1.6] text-[var(--muted)]">
        Anything at all — a section that does not work, a number that is wrong, a
        direction you want pushed harder. It reaches us immediately.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={label}>Your name</span>
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="block">
          <span className={label}>Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
          />
        </label>
      </div>

      {deliverables.length > 1 && (
        <label className="mt-5 block">
          <span className={label}>About</span>
          <select name="slug" defaultValue={defaultSlug ?? ""} className={field}>
            <option value="">The package overall</option>
            {deliverables.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.title}
              </option>
            ))}
          </select>
        </label>
      )}
      {deliverables.length <= 1 && (
        <input type="hidden" name="slug" value={defaultSlug ?? deliverables[0]?.slug ?? ""} />
      )}

      <label className="mt-5 block">
        <span className={label}>Note</span>
        <textarea name="note" required rows={compact ? 5 : 6} className={field} />
      </label>

      {state === "error" && (
        <p className="mt-4 text-[13px] text-[var(--accent)]">
          {error}. You can also email{" "}
          <a className="underline" href="mailto:daniel@loveleedaystudios.com">
            daniel@loveleedaystudios.com
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-7 inline-flex min-h-[44px] items-center bg-[var(--accent)] px-6 text-[14px] font-medium text-white transition-colors hover:bg-[var(--accent-dim)] disabled:opacity-50"
      >
        {state === "sending" ? "Sending…" : "Send note"}
      </button>
    </form>
  );
}
