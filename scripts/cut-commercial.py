#!/usr/bin/env python3
"""
cut-commercial — cut a branded commercial from a client's own footage, from a JSON shot list.

  python3 scripts/cut-commercial.py edl.json OUT.mp4

EDL shape:
{
  "size": [1920, 1080], "fps": 30,
  "src_dir": "~/Projects/loveleeday-media/src",
  "font": "~/Projects/loveleeday-media/fonts/Archivo.ttf",
  "mono": "~/Projects/loveleeday-media/fonts/MartianMono.ttf",
  "colors": {"ink": "#231F20", "paper": "#F2F0EE", "accent": "#FFD100"},
  "audio": {"src": "TjUTTWGrpgM.mp4", "start": 3.0},        # one continuous music bed
  "shots": [
    {"src": "UszUszn3rfw.mp4", "t": 6.5, "d": 3.0, "focus": 0.5,
     "text": {"kicker": "Black Tech Week", "big": "12,000+ in the room", "sub": "..."}},
    {"card": true, "d": 2.5, "text": {"kicker": "...", "big": "Columbus.\\nJuly 2027.", "sub": "..."}}
  ]
}
"focus" is the horizontal crop centre (0..1) used when the output aspect is narrower than the
source (vertical cuts). Text is drawn with Pillow (this ffmpeg has no drawtext) on a bottom scrim,
kept inside the title-safe area. Each shot is rendered to its own clip, clips are concatenated,
then the music bed is laid under with fades and loudness-normalised to -14 LUFS.
"""
import json, os, subprocess, sys, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

edl = json.load(open(sys.argv[1]))
out = Path(sys.argv[2]).expanduser()
W, H = edl["size"]; FPS = edl.get("fps", 30)
SRC = Path(os.path.expanduser(edl["src_dir"]))
C = edl["colors"]
vertical = H > W


def font(path, size, wght, wdth=125):
    f = ImageFont.truetype(os.path.expanduser(path), size)
    try:
        f.set_variation_by_axes([wght, wdth])
    except Exception:
        pass
    return f


def hexrgb(h, a=255):
    h = h.lstrip("#"); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) + (a,)


def text_png(text, path, card=False):
    im = Image.new("RGBA", (W, H), hexrgb(C["ink"]) if card else (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    safe_x = int(W * (0.08 if vertical else 0.06))
    big_px = int((W * 0.105) if vertical else (H * 0.105))
    if card:
        big_px = int(big_px * 1.35)
    lines = text.get("big", "").split("\n")
    # Shrink the headline until its longest line fits the title-safe width. The first cut ran
    # "BUILD WITH THE COMMUNITY" off the right edge of the frame.
    max_w = W - 2 * safe_x
    while True:
        fb = font(edl["font"], big_px, 900, 125)
        widest = max(d.textbbox((0, 0), ln.upper(), font=fb)[2] for ln in lines)
        if widest <= max_w or big_px < 24:
            break
        big_px = int(big_px * 0.94)
    fk = font(edl["mono"], int(big_px * 0.26), 500, 100)
    fs = font(edl["font"], int(big_px * 0.3), 500, 100)
    lh = int(big_px * 0.98)
    block = (int(big_px * 0.45) if text.get("kicker") else 0) + lh * len(lines) + (int(big_px * 0.55) if text.get("sub") else 0)
    if card:
        y0 = (H - block) // 2
    else:
        bottom_safe = int(H * (0.16 if vertical else 0.10))
        y0 = H - bottom_safe - block
        # scrim: soft dark gradient behind the text only
        scrim = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        sd = ImageDraw.Draw(scrim)
        top = max(0, y0 - int(big_px * 0.9))
        for yy in range(top, H):
            a = int(200 * min(1, (yy - top) / max(1, (H - top) * 0.55)))
            sd.line([(0, yy), (W, yy)], fill=(20, 18, 19, a))
        im = Image.alpha_composite(im, scrim); d = ImageDraw.Draw(im)
    y = y0
    if text.get("kicker"):
        kb = d.textbbox((0, 0), text["kicker"].upper(), font=fk)
        pad = int(big_px * 0.08)
        d.rectangle((safe_x, y, safe_x + kb[2] + pad * 2, y + kb[3] + pad * 2), fill=hexrgb(C["accent"]))
        d.text((safe_x + pad, y + pad), text["kicker"].upper(), font=fk, fill=hexrgb(C["ink"]))
        y += int(big_px * 0.45)
    for i, ln in enumerate(lines):
        col = hexrgb(C["accent"]) if (card and i == len(lines) - 1 and len(lines) > 1) else hexrgb(C["paper"])
        d.text((safe_x, y), ln.upper(), font=fb, fill=col)
        y += lh
    if text.get("sub"):
        d.text((safe_x, y + int(big_px * 0.12)), text["sub"], font=fs, fill=hexrgb(C["paper"], 235))
    im.save(path)


with tempfile.TemporaryDirectory() as td:
    td = Path(td); clips = []
    for i, s in enumerate(edl["shots"]):
        clip = td / f"c{i:03d}.mp4"
        png = td / f"t{i:03d}.png"
        d = s["d"]
        if s.get("card"):
            text_png(s["text"], png, card=True)
            cmd = ["ffmpeg", "-v", "error", "-y", "-loop", "1", "-framerate", str(FPS), "-t", str(d), "-i", str(png),
                   "-vf", f"format=yuv420p,fade=t=in:st=0:d=0.25", "-c:v", "libx264", "-preset", "veryfast",
                   "-crf", "18", "-r", str(FPS), "-an", str(clip)]
        else:
            fx = s.get("focus", 0.5)
            if vertical:
                vf = (f"scale=-2:{H},crop={W}:{H}:'max(0,min(iw-{W},iw*{fx}-{W}/2))':0")
            else:
                vf = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}"
            z = s.get("zoom", 1.0)  # crop in past a border baked into the source footage
            if z != 1.0:
                vf += f",scale=iw*{z}:ih*{z},crop={W}:{H}"
            vf += f",setsar=1,fps={FPS}"
            inputs = ["-ss", str(s["t"]), "-t", str(d), "-i", str(SRC / s["src"])]
            if s.get("text"):
                text_png(s["text"], png)
                inputs += ["-loop", "1", "-framerate", str(FPS), "-t", str(d), "-i", str(png)]
                fc = f"[0:v]{vf}[v];[1:v]format=rgba,fade=t=in:st=0.15:d=0.35:alpha=1[t];[v][t]overlay=0:0,format=yuv420p[o]"
                cmd = ["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", fc, "-map", "[o]"]
            else:
                cmd = ["ffmpeg", "-v", "error", "-y", *inputs, "-vf", vf + ",format=yuv420p"]
            cmd += ["-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-r", str(FPS), "-an", str(clip)]
        subprocess.run(cmd, check=True)
        clips.append(clip)
    lst = td / "list.txt"
    lst.write_text("".join(f"file '{c}'\n" for c in clips))
    silent = td / "silent.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(silent)], check=True)
    total = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(silent)]))
    a = edl["audio"]
    # -shortest silently truncated the first cut to the music's length (43.6s cut, 30.4s file).
    # A bed shorter than the picture is an error, not something to paper over.
    bed = float(subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries",
                                         "stream=duration", "-of", "csv=p=0", str(SRC / a["src"])])) - a["start"]
    if bed + 0.05 < total:
        raise SystemExit(f"music bed is {bed:.1f}s but the picture is {total:.1f}s — shorten the cut or pick a longer bed")
    af =f"atrim=0:{total},asetpts=N/SR/TB,afade=t=in:st=0:d=0.6,afade=t=out:st={max(0, total - 1.8)}:d=1.8,loudnorm=I=-14:TP=-1.5:LRA=11"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(silent), "-ss", str(a["start"]), "-i", str(SRC / a["src"]),
                    "-filter_complex", f"[1:a]{af}[a]", "-map", "0:v", "-map", "[a]", "-c:v", "libx264", "-preset", "medium",
                    "-crf", "20", "-profile:v", "high", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", "-shortest", str(out)], check=True)
print(out, f"{total:.1f}s", f"{out.stat().st_size / 1e6:.1f} MB")
