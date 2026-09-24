import type { Stage } from "@/lib/team-data";

const STAGE_STYLE: Record<Stage, string> = {
  draft: "bg-[#f0f1f4] text-[#5b606a]",
  sent: "bg-[#eef3fb] text-[#2d6aa8]",
  opened: "bg-[#e8f3ff] text-[#1f5fa0]",
  visited: "bg-[#e7f6ee] text-[#1f7a4d]",
  asked: "bg-[#fff2dc] text-[#8a5a00]",
  meeting: "bg-[#f3e9ff] text-[#6b3fa0]",
  won: "bg-[#1d1d1f] text-white",
  lost: "bg-[#f7e8e8] text-[#9b2c2c]",
};
const STAGE_LABEL: Record<Stage, string> = {
  draft: "Built, not sent",
  sent: "Sent",
  opened: "Opened",
  visited: "Visited",
  asked: "Asked Arthur",
  meeting: "Meeting",
  won: "Won",
  lost: "Lost",
};

export function StageChip({ stage }: { stage: Stage }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-medium ${STAGE_STYLE[stage]}`}>{STAGE_LABEL[stage]}</span>;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777980]">{children}</span>;
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-[#e4e5e9] bg-white ${className}`}>{children}</div>;
}

export const DOT: Record<string, string> = { sent: "#2d6aa8", open: "#1f5fa0", visit: "#1f7a4d", ask: "#b77900" };
