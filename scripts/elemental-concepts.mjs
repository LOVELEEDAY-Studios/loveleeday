// Elemental 2.0: five complete identity directions rendered as working homepages.
// Facts (films, clients, services, team, contact) come from weareelementalmedia.com and their
// Vimeo, read 2026-09-23. Identity, marks, palettes, type and copy are new proposals.
// node scripts/elemental-concepts.mjs  → public/portal/elemental/concepts/c1..c5-*.html
import fs from "fs";
const OUT = "public/portal/elemental/concepts";

const films = [
  { key: "bells", client: "Bell’s Brewery", title: "Inspired Brewing", yr: "2024", el: "light", sym: "Bl", n: 1, v: "903444253" },
  { key: "runner", client: "Landscape Forms", title: "People’s Dept.", yr: "2025", el: "motion", sym: "Lf", n: 2, v: "1084291973" },
  { key: "mother", client: "Kalamazoo Airport", title: "When a City Has an Airport", yr: "2024", el: "story", sym: "Ka", n: 3, v: "1036036347" },
  { key: "tension", client: "Burdick’s", title: "Sports :15", yr: "2026", el: "story", sym: "Bu", n: 4, v: "1169612500" },
  { key: "guitar", client: "Stedman USA", title: "Director’s cut", yr: "2022", el: "light", sym: "St", n: 5, v: "711788096" },
  { key: "pour", client: "Factory Coffee", title: "Coffee Shop in a Can", yr: "2020", el: "craft", sym: "Fc", n: 6, v: "422185776" },
];
const logos = ["ford", "stryker", "shinola", "bells", "vml", "pactiv", "kzoocollege", "bounty", "usahockey", "sweetwaters", "brine", "ooly"];
const logoAlt = { ford: "Ford", stryker: "Stryker", shinola: "Shinola", bells: "Bell’s Brewery", vml: "VML", pactiv: "Pactiv Evergreen", kzoocollege: "Kalamazoo College", bounty: "Bounty", usahockey: "USA Hockey", sweetwaters: "Sweetwaters Donut Mill", brine: "Brick+Brine", ooly: "OOLY" };
const ELN = { light: "Light", story: "Story", craft: "Craft", motion: "Motion" };

const concepts = [
  {
    file: "c1-periodic", n: 1, name: "Periodic",
    idea: "Elemental as the element every brand needs. A periodic-table system: the mark is a tile, every film is an element with its own symbol, and the grid does the storytelling.",
    fonts: "Inter+Tight:wght@500;600;700;800&family=IBM+Plex+Mono:wght@400;500",
    display: "'Inter Tight',sans-serif", text: "'Inter Tight',sans-serif", mono: "'IBM Plex Mono',monospace",
    c: { bg: "#F3F1EC", ink: "#0F0F11", mid: "#6B6B72", line: "#D9D6CF", accent: "#FF4F2E", panel: "#FFFFFF", dark: "#0F0F11", onDark: "#F3F1EC" },
    mark: (c) => `<span class="mk"><svg viewBox="0 0 44 44" width="40" height="40" aria-hidden="true"><rect x="1" y="1" width="42" height="42" fill="${c.accent}"/><text x="5" y="11" font-family="IBM Plex Mono" font-size="7" fill="#fff">00</text><text x="6" y="35" font-family="Inter Tight" font-weight="800" font-size="22" fill="#fff">El</text></svg><b>Elemental</b></span>`,
    tagline: "The essential element.",
    h1: "Film and photography,<br>reduced to what <em>matters.</em>",
    lede: "Elemental is a production studio for brands that want to be remembered. We write, direct, shoot and finish films and photography, with a team that scales from one to twenty around the work.",
    layout: "split", work: "tiles",
    close: "Every brand has an essential element.<br><em>We film it.</em>",
  },
  {
    file: "c2-four-elements", n: 2, name: "Four Elements",
    idea: "Every film is made of four things. Fire is light, water is story, earth is craft, air is motion. An alchemical mark of four triangles, four colours, and work you browse by element.",
    fonts: "Fraunces:opsz,wght@9..144,400;9..144,600;9..144,800&family=Inter:wght@400;500;600",
    display: "'Fraunces',serif", text: "'Inter',sans-serif", mono: "'Inter',sans-serif",
    c: { bg: "#141312", ink: "#F1ECE4", mid: "#A8A095", line: "#2E2B28", accent: "#E0703A", panel: "#1C1A18", dark: "#F1ECE4", onDark: "#141312", light: "#E0703A", story: "#3F86A8", craft: "#A3804F", motion: "#9DBCCB" },
    mark: (c) => `<span class="mk"><svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true"><path d="M10 2 18 17H2Z" fill="${c.light}"/><path d="M30 17 22 2h16Z" fill="${c.story}"/><path d="M10 38 2 23h16Z" fill="${c.craft}"/><path d="M4 30h12" stroke="${c.bg}" stroke-width="2"/><path d="M30 23l8 15H22Z" fill="${c.motion}"/><path d="M24 32h12" stroke="${c.bg}" stroke-width="2"/></svg><b>Elemental</b></span>`,
    tagline: "Light. Story. Craft. Motion.",
    h1: "Every story is made<br>of four <em>elements.</em>",
    lede: "Light is the first thing an audience feels. Story is what they remember. Craft is why they trust it. Motion is what carries them. Elemental brings all four to every film and photograph we make.",
    layout: "overlay", work: "elements",
    close: "The fifth element<br>is <em>your story.</em>",
  },
  {
    file: "c3-pictures", n: 3, name: "Elemental Pictures",
    idea: "The national production-house move. A monochrome studio identity, a condensed wordmark with a single ember bar, a credits-roll index of films, and almost no copy. The work carries it.",
    fonts: "Big+Shoulders+Display:wght@700;800;900&family=Inter:wght@400;500",
    display: "'Big Shoulders Display',sans-serif", text: "'Inter',sans-serif", mono: "'Inter',sans-serif",
    c: { bg: "#0A0A0A", ink: "#F5F5F2", mid: "#8B8B88", line: "#262626", accent: "#E8542B", panel: "#121212", dark: "#F5F5F2", onDark: "#0A0A0A" },
    mark: (c) => `<span class="mk wide"><b>ELEMENTAL</b><i style="background:${c.accent}"></i><small>PICTURES</small></span>`,
    tagline: "Film and photography for brands.",
    h1: "Films for brands<br>that <em>mean it.</em>",
    lede: "Brand films, commercials and photography for Bell’s, Stryker, Shinola, Kalamazoo College and more.",
    layout: "full", work: "index",
    close: "Roll <em>camera.</em>",
  },
  {
    file: "c4-fundamental", n: 4, name: "Fundamental",
    idea: "Elemental means primary. So the identity is built from primaries: a circle, a square and a triangle in red, blue and yellow. Swiss grid, heavy grotesk, confident and corporate.",
    fonts: "Archivo:wght@500;600;800;900",
    display: "'Archivo',sans-serif", text: "'Archivo',sans-serif", mono: "'Archivo',sans-serif",
    c: { bg: "#FFFFFF", ink: "#111111", mid: "#5E5E5E", line: "#E3E3E3", accent: "#E4322B", panel: "#F4F4F2", dark: "#111111", onDark: "#FFFFFF", blue: "#1E48C8", yellow: "#F4BF2A" },
    mark: (c) => `<span class="mk"><svg viewBox="0 0 66 22" width="66" height="22" aria-hidden="true"><circle cx="11" cy="11" r="10" fill="${c.accent}"/><rect x="24" y="1" width="20" height="20" fill="${c.blue}"/><path d="M56 1 66 21H46Z" fill="${c.yellow}"/></svg><b>Elemental</b></span>`,
    tagline: "Fundamental films.",
    h1: "Primary. Essential.<br><em>Fundamental.</em>",
    lede: "That is what elemental means, and it is how we make films and photography: start with what is primary to your brand, build the whole production around it, and cut everything else.",
    layout: "split", work: "grid",
    close: "Start with <em>what matters.</em>",
  },
  {
    file: "c5-studio", n: 5, name: "Studio",
    idea: "The premium agency direction. Deep evergreen and brass, an editorial serif, a refined flame redrawn as a single line. Built for a CMO: calm, credible, and specific about how the work gets made.",
    fonts: "Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600",
    display: "'Instrument Serif',serif", text: "'Inter',sans-serif", mono: "'Inter',sans-serif",
    c: { bg: "#F6F3EC", ink: "#17231F", mid: "#5C6A64", line: "#DCD6CA", accent: "#B08A4A", panel: "#FFFFFF", dark: "#17362E", onDark: "#F6F3EC" },
    mark: (c) => `<span class="mk"><svg viewBox="0 0 24 34" width="20" height="28" aria-hidden="true"><path d="M12 2C15 9 21 12 21 21a9 9 0 0 1-18 0c0-5 3-7 5-10 0 4 2 6 4 6 0-6-1-10 0-15Z" fill="none" stroke="${c.accent}" stroke-width="1.8"/></svg><b class="serif">Elemental</b></span>`,
    tagline: "Brand films, made with care.",
    h1: "Brand films and photography,<br><em>made with care.</em>",
    lede: "Elemental is a production studio in Kalamazoo, Michigan, working with brands across the country. We scale the team to the project, from a single photographer to a crew of twenty, and stay with you from the first idea to the final delivery.",
    layout: "split", work: "grid",
    close: "Tell us what you are <em>making.</em>",
  },
];

function css(k) {
  const c = k.c;
  return `
:root{--bg:${c.bg};--ink:${c.ink};--mid:${c.mid};--line:${c.line};--ac:${c.accent};--panel:${c.panel};--dark:${c.dark};--on:${c.onDark};--d:${k.display};--t:${k.text};--m:${k.mono};--g:clamp(20px,4vw,60px)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font:400 16px/1.65 var(--t);-webkit-font-smoothing:antialiased}
img,video{display:block;max-width:100%}a{color:inherit;text-decoration:none}.w{max-width:1360px;margin:0 auto;padding:0 var(--g)}
.s{aspect-ratio:2.39/1;width:100%;object-fit:cover;background:#000}
.lab{font:500 11px/1 var(--m);letter-spacing:.18em;text-transform:uppercase;color:var(--mid)}
h1,h2,h3{font-family:var(--d);margin:0}h1 em,h2 em{font-style:${k.display.includes("serif") && !k.display.includes("sans") ? "italic" : "normal"};color:var(--ac)}
.mk{display:inline-flex;align-items:center;gap:10px}.mk b{font:700 20px/1 var(--d);letter-spacing:-.01em}.mk b.serif{font:400 28px/1 var(--d);letter-spacing:0}
.mk.wide{gap:10px}.mk.wide b{font:900 22px/1 var(--d);letter-spacing:.32em}.mk.wide i{width:22px;height:4px;display:block}.mk.wide small{font:500 10px/1 var(--t);letter-spacing:.34em;color:var(--mid)}
nav.top{position:sticky;top:0;z-index:40;background:var(--bg);border-bottom:1px solid var(--line)}
nav.top .w{display:flex;align-items:center;justify-content:space-between;height:78px}
nav.top ul{display:flex;gap:32px;list-style:none;margin:0;padding:0;font:500 14px/1 var(--t)}
nav.top ul a{opacity:.78}nav.top ul a:hover{opacity:1}
.cta{border:1.5px solid var(--ink);padding:11px 18px;font:600 13px/1 var(--t);letter-spacing:.02em}
.cta:hover{background:var(--ink);color:var(--bg)}
.bb{display:none;background:none;border:0;min-width:44px;min-height:44px;cursor:pointer;align-items:center;justify-content:center;margin-right:-10px;color:var(--ink)}
.bg{position:relative;width:24px;height:14px;display:block}.bg i{position:absolute;left:0;width:100%;height:2px;background:currentColor;transition:.25s}
.bg i:nth-child(1){top:0}.bg i:nth-child(2){top:6px}.bg i:nth-child(3){top:12px}
nav.open .bg i:nth-child(1){top:6px;transform:rotate(45deg)}nav.open .bg i:nth-child(2){opacity:0}nav.open .bg i:nth-child(3){top:6px;transform:rotate(-45deg)}
.hero{padding:clamp(48px,7vw,96px) 0 clamp(40px,5vw,72px)}
.hero h1{font-size:clamp(2.6rem,6.2vw,6rem);line-height:.98;letter-spacing:${k.display.includes("Shoulders") ? "-.01em" : "-.035em"};font-weight:${k.display.includes("serif") && !k.display.includes("sans") ? "400" : "800"}}
.hero .row{display:grid;grid-template-columns:1.25fr 1fr;gap:clamp(28px,5vw,80px);align-items:end}
.hero p.lede{font-size:clamp(17px,1.4vw,19px);color:var(--mid);margin:0;max-width:46ch}
.hero .film{margin-top:clamp(36px,5vw,64px)}
.hero.overlay{padding:0;position:relative;background:#000}.hero.overlay .ov{position:absolute;inset:0;display:flex;align-items:flex-end;background:linear-gradient(0deg,rgba(0,0,0,.72),rgba(0,0,0,0) 65%)}
.hero.overlay .ov .w{width:100%;padding-bottom:clamp(24px,4vw,56px)}.hero.overlay h1{color:#fff}.hero.overlay .film{margin:0}
.hero.full{padding:0}.hero.full .film{margin:0}.hero.full .cap{padding-top:clamp(28px,4vw,56px);padding-bottom:clamp(36px,5vw,70px)}
.tag{display:inline-block;font:500 11px/1 var(--m);letter-spacing:.14em;text-transform:uppercase;color:var(--ac);margin-bottom:18px}
section.blk{padding:clamp(64px,8vw,120px) 0;border-top:1px solid var(--line)}
.hd{display:flex;justify-content:space-between;align-items:end;gap:20px;flex-wrap:wrap;margin-bottom:clamp(28px,4vw,48px)}
.hd h2{font-size:clamp(2rem,4.4vw,3.8rem);line-height:1;letter-spacing:-.03em;font-weight:${k.display.includes("serif") && !k.display.includes("sans") ? "400" : "800"}}
.grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:48px 28px}
.card .meta{display:flex;justify-content:space-between;gap:12px;margin-top:14px;align-items:baseline}
.card h3{font:600 19px/1.25 var(--t)}.card p{margin:3px 0 0;color:var(--mid);font-size:14px}.card .yr{font:500 12px/1 var(--m);color:var(--mid);letter-spacing:.1em}
.chip{font:600 10px/1 var(--m);letter-spacing:.14em;text-transform:uppercase;padding:5px 8px;border:1px solid currentColor;color:var(--ac)}
.tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2px;background:var(--line);border:2px solid var(--line)}
.tile{background:var(--panel);padding:18px;position:relative}.tile .top{display:flex;justify-content:space-between;font:500 11px/1 var(--m);color:var(--mid)}
.tile .sym{font:800 clamp(40px,5vw,64px)/1 var(--d);letter-spacing:-.03em;margin:22px 0 4px}.tile .nm{font:600 15px/1.3 var(--t)}.tile .ds{font:400 12px/1.4 var(--m);color:var(--mid)}
.tile img{margin-top:16px}
.idx .r{display:grid;grid-template-columns:60px 1.2fr 1fr 80px;gap:18px;align-items:center;padding:22px 0;border-bottom:1px solid var(--line);position:relative}
.idx .r h3{font:800 clamp(28px,4vw,54px)/1 var(--d);letter-spacing:.01em;text-transform:uppercase}.idx .r:hover h3{color:var(--ac)}
.idx .r .pv{position:absolute;right:100px;top:50%;width:min(360px,30vw);transform:translateY(-50%);opacity:0;transition:opacity .3s;pointer-events:none}.idx .r:hover .pv{opacity:1}
.els{display:grid;gap:18px}.el{display:grid;grid-template-columns:1fr 1.5fr;gap:40px;align-items:center;padding:36px;border-radius:4px;background:var(--panel)}
.el .nm{font:600 13px/1 var(--t);letter-spacing:.18em;text-transform:uppercase}.el h3{font-size:clamp(2.4rem,5vw,4.6rem);line-height:1;margin:10px 0 12px;font-weight:600}.el p{color:var(--mid);margin:0;max-width:40ch}
.soc{display:grid;grid-template-columns:2.2fr .72fr .9fr 1fr 1fr;gap:18px;align-items:end}
.soc figure{margin:0}.soc video,.soc img{width:100%;object-fit:cover;background:#000;border-radius:10px}
.soc .m239 video{aspect-ratio:2.39/1;border-radius:4px}.soc .m916 video{aspect-ratio:9/16}.soc .m45 video{aspect-ratio:4/5}.soc .m11 video,.soc .m11 img{aspect-ratio:1/1}
.soc figcaption{margin-top:10px;font-size:13px;line-height:1.35}.soc figcaption b{display:block;font-weight:600}.soc figcaption span{color:var(--mid)}
@media(max-width:980px){.soc{grid-template-columns:repeat(2,minmax(0,1fr))}.soc .m239{grid-column:1/-1}}
.cap3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:36px}
.cap3 h3{font-size:clamp(24px,2.4vw,32px);line-height:1.1;margin:12px 0 12px;font-weight:${k.display.includes("serif") && !k.display.includes("sans") ? "400" : "700"}}
.cap3 p{color:var(--mid);margin:0 0 14px}.cap3 ul{list-style:none;margin:0;padding:0;font-size:14px}.cap3 li{padding:9px 0;border-top:1px solid var(--line)}
.logos{background:#FFFFFF;color:#111;padding:clamp(56px,7vw,96px) 0;border-top:1px solid var(--line)}
.lg{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:40px 30px;align-items:center;margin-top:36px}.lg img{height:52px;width:100%;object-fit:contain;filter:grayscale(1);opacity:.55;transition:filter .35s,opacity .35s}.lg img:hover{filter:none;opacity:1}
.team{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:28px;align-items:end}.team .p b{display:block;font:600 22px/1.2 var(--d)}.team .p span{color:var(--mid);font-size:14px}
.team p.body{font-size:clamp(18px,1.6vw,22px);line-height:1.5;margin:0;max-width:36ch}
.close{background:var(--dark);color:var(--on);padding:clamp(80px,10vw,150px) 0}
.close h2{font-size:clamp(2.6rem,7vw,6.6rem);line-height:.98;letter-spacing:-.035em;font-weight:${k.display.includes("serif") && !k.display.includes("sans") ? "400" : "800"}}
.close .ct{display:flex;flex-wrap:wrap;gap:16px 48px;margin-top:40px;font:500 clamp(17px,1.6vw,22px)/1.3 var(--t)}.close .ct a{border-bottom:1px solid currentColor;padding-bottom:3px}
footer{padding:48px 0 36px;font-size:13px;color:var(--mid)}footer .g{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:28px}
footer h4{font:500 11px/1 var(--m);letter-spacing:.18em;text-transform:uppercase;margin:0 0 12px}footer ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}
footer .fn{margin-top:36px;padding-top:18px;border-top:1px solid var(--line);display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:12px}
@media(max-width:980px){nav.top ul,nav.top .cta{display:none}.bb{display:inline-flex}
 nav.top.open ul{display:flex;flex-direction:column;gap:0;position:absolute;top:78px;left:0;right:0;background:var(--bg);padding:6px var(--g) 18px;border-bottom:1px solid var(--line)}
 nav.top.open ul a{display:block;padding:15px 0;font-size:18px;border-bottom:1px solid var(--line);opacity:1}
 .hero .row,.grid2,.cap3,.team,.el{grid-template-columns:1fr}.tiles{grid-template-columns:repeat(2,minmax(0,1fr))}
 .idx .r{grid-template-columns:40px 1fr}.idx .r .x,.idx .r .pv{display:none}.lg{grid-template-columns:repeat(3,minmax(0,1fr))}footer .g{grid-template-columns:1fr 1fr}}
@media(max-width:760px){.hero.overlay .ov{position:static;background:none}.hero.overlay .ov h1{color:var(--ink)}.hero.overlay{background:var(--bg)}.hero.overlay .ov .w{padding-top:28px}}
`;
}

const fig = (f) => `<img class="s" src="../img/${f.key}.jpg" alt="${f.client}, ${f.title}" loading="lazy">`;

function work(k) {
  if (k.work === "tiles") {
    return `<div class="tiles">${films.map((f) => `<a class="tile" href="https://vimeo.com/${f.v}"><div class="top"><span>${String(f.n).padStart(2, "0")}</span><span>${f.yr}</span></div><div class="sym">${f.sym}</div><div class="nm">${f.client}</div><div class="ds">${f.title} · ${ELN[f.el]}</div>${fig(f)}</a>`).join("")}</div>`;
  }
  if (k.work === "index") {
    return `<div class="idx">${films.map((f) => `<a class="r" href="https://vimeo.com/${f.v}"><span class="lab">${String(f.n).padStart(2, "0")}</span><h3>${f.client}</h3><span class="x lab">${f.title}</span><span class="lab">${f.yr}</span><span class="pv">${fig(f)}</span></a>`).join("")}</div>`;
  }
  if (k.work === "elements") {
    const pick = { light: films[0], story: films[2], craft: films[5], motion: films[1] };
    const copy = {
      light: "The glow on a Bell’s pour, the practicals behind a stage. Light is the first thing an audience feels.",
      story: "A mother and daughter at the gate. A city told through the people it sends off and brings home.",
      craft: "The pour, the tamp, the hands. The details that make a brand look like it has always been here.",
      motion: "A runner on a leaf-covered trail. Movement that carries a brand from one frame to the next.",
    };
    return `<div class="els">${Object.entries(pick).map(([e, f]) => `<div class="el"><div><span class="nm" style="color:${k.c[e]}">${{ light: "Fire", story: "Water", craft: "Earth", motion: "Air" }[e]} · ${ELN[e]}</span><h3>${ELN[e]}.</h3><p>${copy[e]}</p><p class="lab" style="margin-top:14px">${f.client} · ${f.title} · ${f.yr}</p></div>${fig(f)}</div>`).join("")}</div>`;
  }
  return `<div class="grid2">${films.map((f) => `<a class="card" href="https://vimeo.com/${f.v}">${fig(f)}<div class="meta"><div><h3>${f.client}</h3><p>${f.title}</p></div><span class="yr">${f.yr}</span></div></a>`).join("")}</div>`;
}

function page(k) {
  const heroFilm = `<video class="s film" src="../video/hero-loop.mp4" poster="../video/hero-poster.jpg" autoplay muted loop playsinline aria-label="Moments from Elemental films"></video>`;
  let hero;
  if (k.layout === "overlay") hero = `<header class="hero overlay">${heroFilm}<div class="ov"><div class="w"><span class="tag" style="color:#fff">${k.tagline}</span><h1>${k.h1}</h1></div></div></header><div class="w" style="padding:clamp(28px,4vw,56px) var(--g) 0"><p class="lede" style="font-size:clamp(17px,1.4vw,20px);color:var(--mid);max-width:60ch;margin:0">${k.lede}</p></div>`;
  else if (k.layout === "full") hero = `<header class="hero full">${heroFilm}<div class="w cap"><div class="hero row" style="padding:0"><h1>${k.h1}</h1><p class="lede">${k.lede}</p></div></div></header>`;
  else hero = `<header class="hero"><div class="w"><span class="tag">${k.tagline}</span><div class="row"><h1>${k.h1}</h1><p class="lede">${k.lede}</p></div>${heroFilm}</div></header>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Elemental 2.0 · Concept ${k.n}: ${k.name}</title><meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${k.fonts}&display=swap" rel="stylesheet">
<style>${css(k)}</style></head><body>
<nav class="top"><div class="w"><a href="#" aria-label="Elemental, home">${k.mark(k.c)}</a>
<ul id="m"><li><a href="#work">Work</a></li><li><a href="#capabilities">Capabilities</a></li><li><a href="#studio">Studio</a></li><li><a href="#contact">Contact</a></li></ul>
<a class="cta" href="#contact">Start a project</a>
<button class="bb" type="button" aria-expanded="false" aria-controls="m" aria-label="Open menu"><span class="bg" aria-hidden="true"><i></i><i></i><i></i></span></button></div></nav>
${hero}
<section class="blk" id="work"><div class="w"><div class="hd"><h2>Selected work</h2><span class="lab">2020 – 2026</span></div>${work(k)}</div></section>
<section class="blk" id="social"><div class="w"><div class="hd"><h2>One shoot.<br>Every <em>channel.</em></h2><p style="margin:0;max-width:44ch;color:var(--mid)">A client pays for one production. From the same footage, Elemental delivers the brand film and every cut their social team needs. Shown here with Factory Coffee&rsquo;s footage.</p></div>
<div class="soc">
<figure class="m239"><video src="../social/master-239.mp4" poster="../social/master-239.jpg" autoplay muted loop playsinline></video><figcaption><b>Brand film</b><span>2.39 · website, broadcast, :30</span></figcaption></figure>
<figure class="m916"><video src="../social/reel-916.mp4" poster="../social/reel-916.jpg" autoplay muted loop playsinline></video><figcaption><b>Reel</b><span>9:16 · Reels, TikTok, Shorts</span></figcaption></figure>
<figure class="m45"><video src="../social/feed-45.mp4" poster="../social/feed-45.jpg" autoplay muted loop playsinline></video><figcaption><b>Feed</b><span>4:5 · Instagram, LinkedIn</span></figcaption></figure>
<figure class="m11"><video src="../social/square-11.mp4" poster="../social/square-11.jpg" autoplay muted loop playsinline></video><figcaption><b>Bumper</b><span>1:1 · six-second paid</span></figcaption></figure>
<figure class="m11"><img src="../social/still-11.jpg" alt="Still frame of a latte pour"><figcaption><b>Stills</b><span>Grid posts, press, web</span></figcaption></figure>
</div></div></section>
<section class="blk" id="capabilities"><div class="w"><div class="hd"><h2>Capabilities</h2></div><div class="cap3">
<div><span class="lab">01 · Film</span><h3>Commercials and brand films</h3><p>From the first conversation to the final grade: strategy, script, direction, production and post.</p><ul><li>Concept and scripting</li><li>Directing and cinematography</li><li>Editing, sound design and 2D animation</li><li>Cutdowns for every platform</li></ul></div>
<div><span class="lab">02 · Photography</span><h3>Campaign and brand photography</h3><p>Portraits, lifestyle, product and editorial, shot to live alongside the film.</p><ul><li>Portraits and headshots</li><li>Lifestyle and editorial</li><li>Product</li><li>Events and retouching</li></ul></div>
<div><span class="lab">03 · Studio &amp; rental</span><h3>Crew and equipment</h3><p>A team that scales from one to twenty, and the kit we shoot on, available to other productions.</p><ul><li>Cameras, lenses and support</li><li>Lighting and grip</li><li>Audio</li><li>Rates on request</li></ul></div>
</div></div></section>
<section class="logos" aria-label="Clients"><div class="w"><span class="lab" style="color:#6b6b6b">Selected clients</span><div class="lg">${logos.map((l) => `<img src="../brands/${l}-colour.png" alt="${logoAlt[l]}" loading="lazy">`).join("")}</div></div></section>
<section class="blk" id="studio"><div class="w team"><p class="body">A core team in Kalamazoo, Michigan, built to scale for productions anywhere.</p><div class="p"><b>Esther Tuttle</b><span>Creative Director</span></div><div class="p"><b>Nick Turske</b><span>Managing Director</span></div></div></section>
<section class="close" id="contact"><div class="w"><h2>${k.close}</h2><div class="ct"><a href="mailto:contact@inyourelement.media">contact@inyourelement.media</a><a href="tel:+12695681093">269.568.1093</a></div></div></section>
<footer><div class="w"><div class="g"><div>${k.mark(k.c)}<p style="margin:14px 0 0;max-width:30ch">${k.tagline}</p></div>
<div><h4>Studio</h4><ul><li><a href="#work">Work</a></li><li><a href="#capabilities">Capabilities</a></li><li><a href="#studio">About</a></li></ul></div>
<div><h4>Contact</h4><ul><li><a href="mailto:contact@inyourelement.media">Email</a></li><li><a href="tel:+12695681093">269.568.1093</a></li><li>Kalamazoo, Michigan</li></ul></div>
<div><h4>Follow</h4><ul><li><a href="https://vimeo.com/user49532874">Vimeo</a></li><li><a href="https://www.instagram.com/elementalmediakzoo/">Instagram</a></li></ul></div></div>
<div class="fn"><span>© 2026 Elemental Media</span><span>Elemental 2.0 · Concept ${k.n} of 5 · a proposed identity by LOVELEEDAY Studios</span></div></div></footer>
<script>(()=>{const n=document.querySelector('nav.top'),b=n.querySelector('.bb');b.addEventListener('click',()=>{const o=n.classList.toggle('open');b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Close menu':'Open menu')});n.querySelectorAll('ul a').forEach(a=>a.addEventListener('click',()=>n.classList.remove('open')))})()</script>
</body></html>`;
}

for (const f of fs.readdirSync(OUT)) if (/^c\d-.*\.html$/.test(f)) fs.unlinkSync(`${OUT}/${f}`);
for (const k of concepts) fs.writeFileSync(`${OUT}/${k.file}.html`, page(k));
const board = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Elemental 2.0 · five identities</title><meta name="robots" content="noindex">
<style>:root{--ink:#1d1d1f;--mid:#6e6e76;--line:#e4e5e9}*{box-sizing:border-box}body{margin:0;background:#f5f5f7;color:var(--ink);font:400 15px/1.6 -apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif}
a{color:inherit;text-decoration:none}.w{max-width:1320px;margin:0 auto;padding:0 clamp(16px,4vw,48px)}header{padding:56px 0 30px}h1{font-weight:600;font-size:clamp(2rem,4vw,3rem);letter-spacing:-.04em;margin:0}h1 span{color:#8c8e95}header p{color:var(--mid);max-width:66ch}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,380px),1fr));gap:26px;padding-bottom:60px}.card{background:#fff;border:1px solid var(--line);border-radius:16px;overflow:hidden;display:flex;flex-direction:column}
.shot{height:440px;overflow:hidden;border-bottom:1px solid var(--line);background:#eee}.shot img{width:100%;display:block}.b{padding:20px 22px 24px;display:flex;flex-direction:column;gap:8px;flex:1}
.n{font-size:12px;color:#3778bc;font-weight:600;letter-spacing:.06em}.card h2{margin:0;font-size:22px;letter-spacing:-.02em}.card p{margin:0;color:var(--mid);font-size:14px}.q{color:var(--ink)!important}
.go{margin-top:auto;padding-top:12px}.btn{display:inline-block;border-radius:999px;padding:9px 16px;font-size:13px;font-weight:500;background:#1d1d1f;color:#fff}</style></head><body>
<div class="w"><header><h1>Elemental 2.0. <span>Five identities.</span></h1><p>Five complete brand directions for Elemental, each with a proposed mark, type system, palette and new copy, and each playing on the idea of elements. Every film, client, service and contact is Elemental&rsquo;s own. Client logos stay grey until you hover over them, and every concept shows how one shoot becomes the brand film plus every social cut.</p></header>
<div class="grid">${concepts.map((k) => `<a class="card" href="${k.file}.html"><div class="shot"><img src="shots/${k.file}-thumb.jpg" alt="Concept ${k.n} preview"></div><div class="b"><span class="n">CONCEPT 0${k.n}</span><h2>${k.name}</h2><p>${k.idea}</p><p class="q">&ldquo;${k.tagline}&rdquo;</p><div class="go"><span class="btn">Open</span></div></div></a>`).join("\n")}</div></div>
<script>const k=new URLSearchParams(location.search).get('k');if(k)document.querySelectorAll('a.card').forEach(a=>{a.href=a.getAttribute('href')+'?k='+encodeURIComponent(k)});</script>
</body></html>`;
fs.writeFileSync(`${OUT}/index.html`, board);
fs.writeFileSync(`${OUT}/concepts.json`, JSON.stringify(concepts.map(({ file, n, name, idea, tagline }) => ({ file, n, name, idea, tagline })), null, 1));
console.log(concepts.map((k) => k.file).join(" "));
