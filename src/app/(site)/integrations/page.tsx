import type { Metadata } from "next";
import data from "@/content/integrations.json";
import Directory from "./Directory";

export const metadata: Metadata = {
  title: "Integrations: the systems LOVELEEDAY reads",
  description:
    "A plain directory of the accounting, CRM, commerce, property and other systems LOVELEEDAY can read, with an honest label on each: available, vendor approval, or coming soon.",
  alternates: { canonical: "https://loveleedaystudios.com/integrations" },
};

const LABELS: [string, string, string][] = [
  ["Available", "Available", "You can connect this today, by signing in, sharing a key, or sending a file."],
  ["Vendor approval", "Vendor approval", "The vendor has to approve our access first. We request it with you, and nothing is read until it is granted."],
  ["Coming soon", "Coming soon", "Built, but the vendor sign-in is not switched on yet. Ask and we will tell you where it stands."],
];

export default function IntegrationsPage() {
  const counts = (s: string) => data.items.filter((i) => i.status === s).length;
  return (
    <>
      <section className="border-b border-[var(--line)] bg-[var(--paper)] pt-[clamp(56px,7vw,104px)] pb-[clamp(44px,5vw,76px)]">
        <div className="shell grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow flex items-center gap-2.5 text-[var(--dim)]">
              <span className="inline-block h-[7px] w-[7px]" style={{ background: "var(--teal)" }} />
              Integrations
            </p>
            <h1 className="display display-lg mt-7">
              Reads the systems
              <br />
              <span style={{ color: "var(--dim)" }}>you already run.</span>
            </h1>
          </div>
          <div className="max-w-[var(--measure)] self-end">
            <p className="text-[1.05rem] leading-[1.6] text-[var(--mid)]">
              A directory of the {data.items.length} systems LOVELEEDAY can read, and where each one stands today.
              Every connection is read-only, and every one carries one of three plain labels.
            </p>
          </div>
        </div>
        <div className="shell mt-12">
          <div className="grid overflow-hidden rounded-[10px] border border-[var(--line)] bg-[var(--ground)] md:grid-cols-3">
            {LABELS.map(([k, title, body], n) => (
              <div key={k} className={`p-6 ${n > 0 ? "border-t border-[var(--line)] md:border-l md:border-t-0" : ""}`}>
                <p className="flex items-baseline gap-2.5 text-[15px] font-semibold text-[var(--ink)]">
                  {title}
                  <span className="tnum text-[12px] font-normal text-[var(--dim)]">{counts(k)}</span>
                </p>
                <p className="mt-2 text-[14px] leading-[1.6] text-[var(--mid)]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Directory groups={data.groups} items={data.items} />
    </>
  );
}
