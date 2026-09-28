"use client";
/* Per-item approve checkbox + instruction field for an INTERNAL review page (local only).
   Saves to a local-only API route (default /api/dabney-review, which writes ~/.arthur/data/dabney-audit/review.json).
   With `submitOnEnter`, Enter in the field (Shift+Enter for a new line) saves and sends every approval to
   Arthur via POST {submit:true}; ReviewSubmit is the same action as a button. */
import { useEffect, useRef, useState } from "react";

type Entry = { approved: boolean; comment: string; label: string; at?: string; status?: string; note?: string; statusAt?: string };
const STATUS: Record<string, { label: string; cls: string }> = {
  working: { label: "Arthur is working on it", cls: "bg-[#eaf2fb] text-[#2d6aa8]" },
  done: { label: "Done", cls: "bg-[#e6f4ea] text-[#1e6b3a]" },
  blocked: { label: "Needs you", cls: "bg-[#fff4e0] text-[#8a5a00]" },
  replied: { label: "Arthur replied", cls: "bg-[#f1eefb] text-[#5b3fa8]" },
};

const caches: Record<string, Record<string, Entry>> = {};
const loading: Record<string, Promise<Record<string, Entry>>> = {};
function loadAll(endpoint: string) {
  if (caches[endpoint]) return Promise.resolve(caches[endpoint]);
  loading[endpoint] ??= fetch(endpoint).then((r) => r.json()).then((j) => (caches[endpoint] = j || {})).catch(() => (caches[endpoint] = {}));
  return loading[endpoint];
}

async function submitAll(endpoint: string) {
  const r = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ submit: true }) });
  if (!r.ok) throw new Error("submit failed");
  window.dispatchEvent(new CustomEvent("review-submitted"));
}

export function ReviewControl({ id, label, dark, endpoint = "/api/dabney-review", submitOnEnter }: { id: string; label: string; dark?: boolean; endpoint?: string; submitOnEnter?: boolean }) {
  const [approved, setApproved] = useState(false);
  const [comment, setComment] = useState("");
  const [state, setState] = useState<"" | "saving" | "saved" | "error" | "sent">("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [live, setLive] = useState<{ status?: string; note?: string; statusAt?: string }>({});
  const box = useRef<HTMLDivElement | null>(null);
  // Finished items sink to the bottom of their list (Daniel, 9/26: nothing left to do with them).
  // The card/list-item is a child of a grid, so CSS `order` moves it without re-rendering the server page.
  useEffect(() => {
    const item = box.current?.closest("article, li") as HTMLElement | null;
    if (item) item.style.order = live.status === "done" ? "999" : "";
  }, [live.status]);
  useEffect(() => {
    loadAll(endpoint).then((all) => {
      const e = all[id];
      if (e) { setApproved(!!e.approved); setComment(e.comment || ""); setLive({ status: e.status, note: e.note, statusAt: e.statusAt }); }
    });
    // Arthur writes status/note into the same file as he works; poll so the board updates live.
    const t = setInterval(async () => {
      try {
        const all = await (await fetch(endpoint, { cache: "no-store" })).json();
        const e = all?.[id];
        if (e) setLive({ status: e.status, note: e.note, statusAt: e.statusAt });
      } catch {}
    }, 5000);
    return () => clearInterval(t);
  }, [id, endpoint]);

  async function post(next: { approved: boolean; comment: string }) {
    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, label, ...next }),
    });
    if (caches[endpoint]) caches[endpoint][id] = { ...next, label };
    return r.ok;
  }

  function save(next: { approved: boolean; comment: string }) {
    if (timer.current) clearTimeout(timer.current);
    setState("saving");
    timer.current = setTimeout(async () => {
      try { setState((await post(next)) ? "saved" : "error"); } catch { setState("error"); }
    }, 500);
  }

  async function sendNow() {
    if (timer.current) clearTimeout(timer.current);
    setState("saving");
    try {
      if (!(await post({ approved, comment }))) throw new Error();
      await submitAll(endpoint);
      setState("sent");
    } catch { setState("error"); }
  }

  const tone = dark ? "border-[#3a3d46] bg-[#1c1e24] text-[#e6e7ea]" : "border-[#e4e5e9] bg-[#fafafa] text-[#1d1d1f]";
  return (
    <div ref={box} className={`mt-4 rounded-xl border p-3 ${tone}`}>
      <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium">
        <input
          type="checkbox"
          className="h-4 w-4 accent-[#0E7877]"
          checked={approved}
          onChange={(e) => { setApproved(e.target.checked); save({ approved: e.target.checked, comment }); }}
        />
        Approve
        <span className={`ml-auto text-[11px] font-normal ${state === "error" ? "text-[#b3261e]" : "text-[#8c8e95]"}`}>
          {state === "saving" ? "Saving…" : state === "saved" ? "Saved" : state === "sent" ? "Sent to Arthur" : state === "error" ? "Not saved" : ""}
        </span>
      </label>
      <textarea
        rows={2}
        value={comment}
        placeholder={submitOnEnter ? "Instructions for Arthur. Enter sends, Shift+Enter for a new line" : "Instructions for Arthur on this point"}
        aria-label={`Instructions for Arthur: ${label}`}
        onChange={(e) => { setComment(e.target.value); save({ approved, comment: e.target.value }); }}
        onKeyDown={(e) => {
          if (submitOnEnter && e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); sendNow(); }
        }}
        className={`mt-2 w-full resize-y rounded-lg border px-3 py-2 text-[13px] leading-[1.5] outline-none focus:border-[#0E7877] ${dark ? "border-[#3a3d46] bg-[#14161b] text-white placeholder:text-[#7c808a]" : "border-[#e4e5e9] bg-white placeholder:text-[#9a9ca3]"}`}
      />
      {live.status && STATUS[live.status] && (
        <div className="mt-2 rounded-lg bg-white/60 px-1 py-1 text-[12.5px] leading-[1.55]">
          <span className={`mr-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS[live.status].cls}`}>{STATUS[live.status].label}</span>
          {live.statusAt && <span className="text-[11px] text-[#8c8e95]">{new Date(live.statusAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span>}
          {live.note && <p className={`mt-1 ${dark ? "text-[#c9ccd3]" : "text-[#4a4d55]"}`}>{live.note}</p>}
        </div>
      )}
    </div>
  );
}

export function ReviewSubmit({ endpoint = "/api/dabney-review" }: { endpoint?: string }) {
  const [state, setState] = useState<"" | "sending" | "sent" | "error">("");
  useEffect(() => {
    const on = () => setState("sent");
    window.addEventListener("review-submitted", on);
    return () => window.removeEventListener("review-submitted", on);
  }, []);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={async () => { setState("sending"); try { await submitAll(endpoint); setState("sent"); } catch { setState("error"); } }}
        className="rounded-full bg-[#1d1d1f] px-5 py-2.5 text-[14px] font-medium text-white hover:bg-[#0E7877]"
      >
        Send approvals to Arthur
      </button>
      <span className={`text-[13px] ${state === "error" ? "text-[#b3261e]" : "text-[#6c7481]"}`}>
        {state === "sending" ? "Sending…" : state === "sent" ? "Sent. Arthur is starting on the approved items." : state === "error" ? "Didn't send; is the local server running?" : "Or press Enter in any instruction box."}
      </span>
    </div>
  );
}
