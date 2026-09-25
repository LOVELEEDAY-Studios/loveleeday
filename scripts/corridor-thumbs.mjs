// Render one static map image per Wightman corridor, so the proposal shows real maps with no live tile service
// (and no key) behind them. Vector basemap (CARTO Positron, OpenStreetMap data) drawn by MapLibre in headless Chromium.
// node scripts/corridor-thumbs.mjs            -> public/p/wightman/corridors/<id>.png
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const intel = JSON.parse(fs.readFileSync(path.join(root, "src/content/hub/wightman-intel.json"), "utf8"));
const out = path.join(root, "public/p/wightman/corridors");
fs.mkdirSync(out, { recursive: true });
const js = fs.readFileSync(path.join(root, "node_modules/maplibre-gl/dist/maplibre-gl.js"), "utf8");
const css = fs.readFileSync(path.join(root, "node_modules/maplibre-gl/dist/maplibre-gl.css"), "utf8");
const W = 880, H = 520;

const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await p.setContent(`<html><head><style>${css} html,body,#m{margin:0;width:${W}px;height:${H}px}</style></head><body><div id="m"></div><script>${js}</script></body></html>`);

const list = (intel.corridors ?? []).filter((c) => c.coords?.length > 1);
let made = 0;
for (const c of list) {
  const ok = await p.evaluate(async ({ coords, W, H }) => {
    document.getElementById("m").innerHTML = "";
    const xs = coords.map((q) => q[0]), ys = coords.map((q) => q[1]);
    const map = new maplibregl.Map({
      container: "m", style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json", interactive: false, attributionControl: false,
      bounds: [[Math.min(...xs), Math.min(...ys)], [Math.max(...xs), Math.max(...ys)]], fitBoundsOptions: { padding: { top: 70, bottom: 70, left: 90, right: 90 }, maxZoom: 16.5 },
      preserveDrawingBuffer: true, fadeDuration: 0,
    });
    await new Promise((r) => map.on("load", r));
    map.addSource("c", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coords } } });
    map.addLayer({ id: "casing", type: "line", source: "c", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#fff", "line-width": 14 } });
    map.addLayer({ id: "line", type: "line", source: "c", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#3778bc", "line-width": 8 } });
    await new Promise((r) => map.once("idle", r));
    window.__map = map;
    return true;
  }, { coords: c.coords, W, H });
  if (!ok) continue;
  await p.locator("#m canvas").screenshot({ path: path.join(out, `${c.id}.png`) });
  await p.evaluate(() => window.__map.remove());
  made++;
  console.log(c.id, c.street);
}
console.log(`rendered ${made} of ${list.length} corridors -> ${out}`);
await b.close();
