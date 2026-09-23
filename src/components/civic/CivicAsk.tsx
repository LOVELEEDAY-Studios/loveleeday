"use client";

import { useState } from "react";

type Answer = { head: string; answer: string; evidence: string[] };

const PRESETS = [
  "What is most urgent before the end of my interim term?",
  "Which deadlines does the County have in the next six months?",
  "Where is the County strongest?",
  "What would the first 30 days with Arthur fix?",
  "How could the County contract for this?",
];

export function CivicAsk({ token }: { token: string }) {
  const [q, setQ] = useState("");
  const [asked, setAsked] = useState("");
  const [busy, setBusy] = useState(false);
  const [a, setA] = useState<Answer | null>(null);
  const [err, setErr] = useState("");

  async function ask(question: string) {
    const text = question.trim();
    if (text.length < 4 || busy) return;
    setBusy(true);
    setErr("");
    setA(null);
    setAsked(text);
    try {
      const r = await fetch("/api/civic/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, question: text }),
      });
      const j = await r.json();
      if (!r.ok) setErr(j.error ?? "Arthur could not answer just now.");
      else setA(j);
    } catch {
      setErr("Arthur could not answer just now. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e4e5e9] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2 border-b border-[#eef0f3] px-5 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#e4e5e9]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e4e5e9]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e4e5e9]" />
        <span className="ml-3 text-[12px] text-[#7d8088]">Ask Arthur · Kalamazoo County public record</span>
      </div>
      <div className="p-5 sm:p-7">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => { setQ(p); ask(p); }}
              className="rounded-full border border-[#dcdfe6] px-3.5 py-1.5 text-left text-[13px] text-[#1d1d1f] transition hover:border-[#3778bc] hover:text-[#3778bc]"
            >
              {p}
            </button>
          ))}
        </div>
        <form
          className="mt-5 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => { e.preventDefault(); ask(q); }}
        >
          <label htmlFor="civic-ask" className="sr-only">Ask a question about Kalamazoo County</label>
          <input
            id="civic-ask"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            maxLength={400}
            placeholder="Ask anything about the County's public record"
            className="min-w-0 flex-1 rounded-full border border-[#dcdfe6] bg-white px-4 py-2.5 text-[15px] text-[#1d1d1f] outline-none focus:border-[#3778bc]"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-[#1d1d1f] px-5 py-2.5 text-[14px] font-medium text-white disabled:opacity-50"
          >
            {busy ? "Reading…" : "Ask"}
          </button>
        </form>

        <div aria-live="polite" className="mt-6 min-h-[4rem]">
          {busy && <p className="text-[14px] text-[#7d8088]">Arthur is reading the record for “{asked}”…</p>}
          {err && <p className="text-[14px] text-[#b3261e]">{err}</p>}
          {a && (
            <div>
              <p className="text-[13px] text-[#7d8088]">{asked}</p>
              <p className="mt-2 text-[18px] font-medium leading-[1.4] tracking-[-0.015em] text-[#1d1d1f]">
                <span className="mr-1.5 text-[#3778bc]">✧</span>{a.head}
              </p>
              <p className="mt-2 text-[15px] leading-[1.7] text-[#4a4d55]">{a.answer}</p>
              {a.evidence.length > 0 && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-[13px] text-[#3778bc]">View the evidence</summary>
                  <ul className="mt-2 grid gap-1.5 text-[13px] leading-[1.6] text-[#6c7481]">
                    {a.evidence.map((e) => <li key={e}>{e}</li>)}
                  </ul>
                </details>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
