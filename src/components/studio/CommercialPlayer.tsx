"use client";

import { useRef, useState } from "react";

/* The spec spot in one 2.39 frame. Starts muted on the poster; the first click plays with sound. */
export function CommercialPlayer({
  src = "/portal/elemental/video/elemental-30.mp4",
  poster = "/portal/elemental/video/elemental-30-poster.jpg",
  label = "Elemental Media spec commercial, thirty seconds",
}: { src?: string; poster?: string; label?: string } = {}) {
  const v = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  function start() {
    const el = v.current;
    if (!el) return;
    el.muted = false;
    el.currentTime = 0;
    el.controls = true;
    el.play();
    setStarted(true);
  }

  return (
    <div className="relative overflow-hidden bg-black" style={{ aspectRatio: "2.39 / 1" }}>
      <video
        ref={v}
        className="block h-full w-full object-cover"
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        aria-label={label}
      />
      {!started && (
        <button
          type="button"
          onClick={start}
          className="absolute inset-0 flex items-center justify-center bg-black/20 text-white"
          aria-label="Play the commercial with sound"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white transition-transform hover:scale-105">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M7 4v16l13-8z" /></svg>
          </span>
        </button>
      )}
    </div>
  );
}
