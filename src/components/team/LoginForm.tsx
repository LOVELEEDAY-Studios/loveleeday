"use client";

import { useState } from "react";

export function LoginForm() {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await fetch("/api/team/code", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
    setBusy(false);
    if (!r.ok) return setErr((await r.json()).error ?? "Could not send a code.");
    setStep("code");
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await fetch("/api/team/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code }) });
    setBusy(false);
    if (!r.ok) return setErr((await r.json()).error ?? "That code did not work.");
    location.href = "/team";
  }

  const field = "mt-2 w-full rounded-xl border border-[#dcdfe6] bg-white px-4 py-3 text-[16px] outline-none focus:border-[#3778bc]";
  const button = "mt-4 w-full rounded-full bg-[#1d1d1f] px-5 py-3 text-[15px] font-medium text-white disabled:opacity-50";

  return step === "email" ? (
    <form onSubmit={send} className="mt-10">
      <label htmlFor="team-email" className="text-[13px] text-[#5b606a]">Work email</label>
      <input id="team-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} placeholder="you@loveleedaystudios.com" />
      <button disabled={busy} className={button}>{busy ? "Sending…" : "Email me a code"}</button>
      {err && <p className="mt-3 text-[13px] text-[#b3261e]" role="alert">{err}</p>}
    </form>
  ) : (
    <form onSubmit={verify} className="mt-10">
      <p className="text-[14px] leading-[1.6] text-[#5b606a]">
        If <b className="font-medium text-[#1d1d1f]">{email}</b> is on the team, a six-digit code is on its way. It expires in 10 minutes.
      </p>
      <label htmlFor="team-code" className="mt-5 block text-[13px] text-[#5b606a]">Code</label>
      <input id="team-code" inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className={`${field} tracking-[0.4em]`} placeholder="000000" />
      <button disabled={busy} className={button}>{busy ? "Checking…" : "Sign in"}</button>
      {err && <p className="mt-3 text-[13px] text-[#b3261e]" role="alert">{err}</p>}
      <button type="button" onClick={() => { setStep("email"); setCode(""); setErr(""); }} className="mt-4 text-[13px] text-[#3778bc]">
        Use a different address
      </button>
    </form>
  );
}
