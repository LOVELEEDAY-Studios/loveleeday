import { after } from "next/server";
import { notify, record, validSig } from "@/lib/email-track";

export const dynamic = "force-dynamic";

export async function GET(request: Request, ctx: RouteContext<"/api/t/c/[id]">) {
  const { id } = await ctx.params;
  const q = new URL(request.url).searchParams;
  const url = q.get("u") ?? "";
  // Only URLs the sender signed are followed, so this can never be an open redirect.
  if (!/^https?:\/\//.test(url) || !validSig(id, url, q.get("s") ?? "")) {
    return Response.redirect("https://loveleedaystudios.com/", 302);
  }
  after(async () => notify(await record(id, "click", request, url), "click", url));
  return new Response(null, { status: 302, headers: { Location: url, "Cache-Control": "no-store" } });
}
