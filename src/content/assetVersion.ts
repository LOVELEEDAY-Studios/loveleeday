import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

/* Content-hashed asset URLs.

   Why: the slider frames, cards and previews are served with
   cache-control: public, max-age=14400. That is correct for a static image and
   wrong for one we regenerate — on 2026-09-20 every frame on the portfolio was
   rebuilt and Daniel still saw the old Novarna, because his browser held a
   four-hour copy and a ?r= on the PAGE does not touch the IMAGE urls. I had
   verified the bytes on the server and told him it was updated, which was true
   and useless.

   Appending a hash of the file's own contents means a regenerated image is a
   new URL, so no cache anywhere can serve a stale one, and an unchanged image
   keeps its URL and stays cached. Read once at build time; these are static
   pages so this never runs per-request. */
const cache = new Map<string, string>();

export function v(publicPath: string): string {
  const hit = cache.get(publicPath);
  if (hit) return hit;
  let out = publicPath;
  try {
    const abs = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
    const hash = crypto.createHash("sha1").update(fs.readFileSync(abs)).digest("hex").slice(0, 8);
    out = `${publicPath}?v=${hash}`;
  } catch {
    /* A missing file is a broken image either way; don't mask it with a throw
       during the build, just serve the bare path and let the 404 be visible. */
  }
  cache.set(publicPath, out);
  return out;
}
