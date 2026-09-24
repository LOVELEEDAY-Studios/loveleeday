import { bids, type Bid } from "@/content/team/bids";

/* Reads the tracking tables through team_portal_data() in the Dabney Supabase project. The key is
   server-only; the function refuses anything else. Turns raw sends, opens, views and questions
   into one record per bid. */

type Send = { token: string; sent_at: string; from: string; to: string; subject: string };
type Open = { token: string; at: string; proxy: boolean; ua: string };
type View = { path: string; at: string; ip: string | null; team: boolean; bot: boolean; ua: string };
type Ask = { at: string; surface: string; token: string; client: string; q: string; head: string; ip: string | null };
type Raw = { sends: Send[]; opens: Open[]; views: View[]; team_ips: string[]; asks: Ask[] };

export type Stage = "draft" | "sent" | "opened" | "visited" | "asked" | "meeting" | "won" | "lost";
export type Event = { at: string; kind: "sent" | "open" | "visit" | "ask"; text: string; detail?: string; human: boolean };

export type BidStats = {
  bid: Bid;
  stage: Stage;
  sent: Send[];
  firstSent?: string;
  isSent: boolean;
  opens: number;
  humanOpens: number;
  visits: number;
  visitors: number;
  asks: Ask[];
  last?: Event;
  events: Event[];
};

// A scanner opens or fetches within seconds of delivery. Anything inside two minutes of a send is a machine.
const SCANNER_MS = 120_000;

async function load(): Promise<Raw> {
  const url = process.env.OPENS_SUPABASE_URL, key = process.env.OPENS_SUPABASE_ANON_KEY, team = process.env.TEAM_PORTAL_KEY;
  if (!url || !key || !team) throw new Error("Team portal data is not configured");
  const r = await fetch(`${url}/rest/v1/rpc/team_portal_data`, {
    method: "POST",
    headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ p_key: team, p_days: 365 }),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`team_portal_data ${r.status}: ${(await r.text()).slice(0, 160)}`);
  return r.json();
}

const device = (ua: string) =>
  /iPhone/.test(ua) ? "iPhone" : /iPad/.test(ua) ? "iPad" : /Android/.test(ua) ? "Android" : /Macintosh/.test(ua) ? "Mac" : /Windows/.test(ua) ? "Windows" : "Browser";

const pageLabel = (b: Bid, path: string) => b.pages.find((p) => path.startsWith(p.path.split("?")[0]))?.label ?? path;

export async function teamData() {
  const raw = await load();
  const teamIps = new Set(raw.team_ips);
  const stats: BidStats[] = bids.map((bid) => {
    const emails = bid.emails.map((e) => e.toLowerCase());
    const sent = raw.sends.filter((s) => emails.some((e) => s.to.toLowerCase().includes(e))).sort((a, b) => a.sent_at.localeCompare(b.sent_at));
    const sendAt = new Map(sent.map((s) => [s.token, Date.parse(s.sent_at)]));
    const sendTimes = sent.map((s) => Date.parse(s.sent_at));
    // Before the first send, every view is us preparing it. An untracked send supplies its own date.
    const firstAt = Math.min(...sendTimes, bid.sentOn ? Date.parse(bid.sentOn) : Infinity);
    const beforeSend = (t: number) => !(t >= firstAt);
    const nearSend = (t: number) => sendTimes.some((s) => t >= s && t - s < SCANNER_MS);

    const opens = raw.opens.filter((o) => sendAt.has(o.token));
    const human = opens.filter((o) => Date.parse(o.at) - (sendAt.get(o.token) ?? 0) >= SCANNER_MS);

    const prefixes = bid.pages.map((p) => p.path.split("?")[0]);
    const views = raw.views.filter((v) => prefixes.some((pre) => v.path.startsWith(pre)));
    const outside = views.filter((v) => !v.team && !v.bot && !(v.ip && teamIps.has(v.ip)) && !nearSend(Date.parse(v.at)) && !beforeSend(Date.parse(v.at)));

    const tokens = new Set(bid.pages.map((p) => p.path.split("/").pop()!.split("?")[0]).concat(bid.pages.map((p) => new URL(p.path, "https://x").searchParams.get("k") ?? "")));
    const asks = raw.asks.filter((a) => tokens.has(a.token));

    const events: Event[] = [
      ...sent.map((s) => ({ at: s.sent_at, kind: "sent" as const, text: `Sent to ${s.to}`, detail: s.subject, human: true })),
      ...opens.map((o) => {
        const h = Date.parse(o.at) - (sendAt.get(o.token) ?? 0) >= SCANNER_MS;
        return { at: o.at, kind: "open" as const, text: h ? "Email opened" : "Email scanned on arrival", detail: o.proxy ? "through a mail proxy" : device(o.ua), human: h };
      }),
      ...views.map((v) => {
        const ours = v.team || (v.ip ? teamIps.has(v.ip) : false);
        const t = Date.parse(v.at);
        const h = !ours && !v.bot && !nearSend(t) && !beforeSend(t);
        const how = h ? "viewed" : ours ? "viewed by us" : v.bot || nearSend(t) ? "fetched by a machine" : "viewed before it was sent";
        return { at: v.at, kind: "visit" as const, text: `${pageLabel(bid, v.path)} ${how}`, detail: device(v.ua), human: h };
      }),
      ...asks.map((a) => ({ at: a.at, kind: "ask" as const, text: `Asked Arthur: “${a.q}”`, detail: a.head, human: true })),
    ].sort((a, b) => b.at.localeCompare(a.at));

    const isSent = sent.length > 0 || Boolean(bid.sentOn);
    const stage: Stage =
      bid.outcome ?? (asks.length ? "asked" : outside.length ? "visited" : human.length ? "opened" : isSent ? "sent" : "draft");
    return {
      bid,
      stage,
      sent,
      firstSent: sent[0]?.sent_at ?? bid.sentOn,
      isSent,
      opens: opens.length,
      humanOpens: human.length,
      visits: outside.length,
      visitors: new Set(outside.map((v) => v.ip ?? v.ua)).size,
      asks,
      last: events.find((e) => e.human && e.kind !== "sent") ?? events.find((e) => e.kind === "sent"),
      events,
    };
  });

  const out = stats.filter((s) => s.isSent);
  return {
    stats,
    totals: {
      bids: stats.length,
      sent: out.length,
      drafts: stats.length - out.length,
      opened: out.filter((s) => s.humanOpens > 0).length,
      visited: out.filter((s) => s.visits > 0).length,
      asked: stats.filter((s) => s.asks.length > 0).length,
    },
    feed: stats.flatMap((s) => s.events.filter((e) => e.human && e.kind !== "sent").map((e) => ({ ...e, bid: s.bid }))).sort((a, b) => b.at.localeCompare(a.at)).slice(0, 14),
  };
}

export const STAGES: { key: Stage; label: string }[] = [
  { key: "draft", label: "Built" },
  { key: "sent", label: "Sent" },
  { key: "opened", label: "Opened" },
  { key: "visited", label: "Visited" },
  { key: "asked", label: "Asked Arthur" },
  { key: "meeting", label: "Meeting" },
  { key: "won", label: "Won" },
];

const TZ = "America/Detroit";
// A hand-entered send with no time (T00:00:00) shows as a date, never as an invented time.
export const when = (iso?: string) =>
  !iso
    ? "—"
    : iso.includes("T00:00:00")
      ? new Date(iso).toLocaleDateString("en-US", { timeZone: TZ, month: "short", day: "numeric" })
      : new Date(iso).toLocaleString("en-US", { timeZone: TZ, month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export function ago(iso?: string) {
  if (!iso) return "—";
  const m = Math.round((Date.now() - Date.parse(iso)) / 60_000);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}
