import type { Video } from "@/content/portals";

/* Commercials cut from the client's own footage. Native <video> with a poster and no
   autoplay: a pitch page that starts making noise on its own loses the reader. */
export function Videos({ videos, heading = "Cut from your own footage" }: { videos: Video[]; heading?: string }) {
  return (
    <div>
      <p className="mb-4 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--dim)]">
        {heading}
      </p>
      <div className="grid gap-6 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {videos.map((v) => (
          <figure
            key={v.src}
            className={v.aspect === "9/16" ? "m-0 sm:max-w-[300px]" : "m-0 sm:col-span-2"}
          >
            <video
              controls
              playsInline
              preload="none"
              poster={v.poster}
              className="block w-full border border-[var(--line-bright)] bg-black"
              style={{ aspectRatio: v.aspect }}
            >
              <source src={v.src} type="video/mp4" />
            </video>
            <figcaption className="mt-3">
              <span className="block text-[14px] font-medium text-[var(--ink)]">{v.title}</span>
              <span className="mt-1 block text-[13px] leading-[1.55] text-[var(--mid)]">{v.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
