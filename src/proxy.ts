import { NextResponse, type NextRequest } from "next/server";
import { TOKENS } from "@/content/tokens";

/* The files under /public/portal are the deliverables themselves: six full
   rebuilds of real companies' sites, each carrying measured criticism of the
   site it replaces, none of it commissioned. The X-Robots-Tag in next.config
   keeps them out of search results, but a header is not access control —
   anyone who guessed or was forwarded /portal/micruity/index.html could read
   Micruity's study without ever holding the link we sent them.

   So the HTML now requires the same token as the portal page that frames it.
   Assets are deliberately left open: the page's own images and stylesheets are
   fetched by the browser without our query string, and a cropped screenshot
   carries none of the argument. The document is what needed closing. */
/* Keyed by directory, not a flat allowlist: LoanWell's link should open
   LoanWell's study and nothing else. A shared set would have let any client we
   sent a link to read every other client's critique, which is the same leak in
   a politer form. */
const FOR_DIR: Record<string, string> = {
  micruity: TOKENS.micruity,
  janta: TOKENS.janta,
  fyxit: TOKENS.fyxit,
  novarna: TOKENS.novarna,
  soarce: TOKENS.soarce,
  loanwell: TOKENS.loanwell,
  /* A study added to portals.ts but not to this map 404s for everyone, with the
     deliberate silence this gate was built for — no log line, no error, and a
     404 that reads as "the file is missing" rather than "you are not allowed".
     Enable shipped that way on 2026-09-22 and cost an afternoon to find. If you
     add a study, add it here in the same commit. */
  ...(TOKENS.enable ? { enable: TOKENS.enable } : {}),
  ...(TOKENS.venturehueStudy ? { venturehue: TOKENS.venturehueStudy } : {}),
  ...(TOKENS.meknology ? { meknology: TOKENS.meknology } : {}),
  ...(TOKENS.blacktechweek ? { blacktechweek: TOKENS.blacktechweek } : {}),
  ...(TOKENS.lightshipCapital ? { lightshipcapital: TOKENS.lightshipCapital } : {}),
  ...(TOKENS.lightshipFoundation ? { lightshipfoundation: TOKENS.lightshipFoundation } : {}),
};

export function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Only documents are gated. Anything with a non-HTML extension is an asset.
  const last = pathname.split("/").pop() ?? "";
  const isDocument = !last.includes(".") || last.endsWith(".html");
  if (!isDocument) return NextResponse.next();

  const dir = pathname.split("/")[2] ?? "";
  const expected = FOR_DIR[dir];
  if (expected && searchParams.get("k") === expected) return NextResponse.next();

  /* 404 rather than 403: a 403 confirms the path exists, which is exactly the
     thing a guessed URL should not learn. */
  return new NextResponse(null, { status: 404 });
}

export const config = { matcher: "/portal/:path*" };
