import { after } from "next/server";
import { PIXEL, notify, record } from "@/lib/email-track";

export const dynamic = "force-dynamic";

export async function GET(request: Request, ctx: RouteContext<"/api/t/o/[id]">) {
  const id = (await ctx.params).id.replace(/\.gif$/, "");
  after(async () => notify(await record(id, "open", request), "open"));
  return new Response(PIXEL, {
    headers: { "Content-Type": "image/gif", "Cache-Control": "no-store, no-cache, must-revalidate, private", Pragma: "no-cache" },
  });
}
