"use client";

import { useEffect, useRef } from "react";
import type { Map as MLMap, GeoJSONSource, LngLatBoundsLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

const BLUE = "#3778bc", INK = "#1d1d1f";
const STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

/* A real street map: CARTO Positron basemap over OpenStreetMap, with each Wightman corridor drawn on its actual
   street geometry. Click a corridor to pick it; the map refits whenever the set in view changes. */
export function CorridorMap({ corridors, picked, onPick }: { corridors: Any[]; picked: number | null; onPick: (id: number | null) => void }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;

  const lines = corridors.filter((c) => c.coords?.length > 1);
  const data = {
    type: "FeatureCollection" as const,
    features: lines.map((c) => ({
      type: "Feature" as const,
      id: c.id,
      properties: { id: c.id, name: String(c.street).split(/[\/(]/)[0].trim(), city: c.city, picked: c.id === picked },
      geometry: { type: "LineString" as const, coordinates: c.coords },
    })),
  };
  const mids = {
    type: "FeatureCollection" as const,
    features: lines.map((c) => ({
      type: "Feature" as const,
      properties: { id: c.id, picked: c.id === picked },
      geometry: { type: "Point" as const, coordinates: c.coords[Math.floor(c.coords.length / 2)] },
    })),
  };
  const key = lines.map((c) => c.id).join(",");

  const bounds = (): LngLatBoundsLike | null => {
    const all = lines.flatMap((c) => c.coords);
    if (!all.length) return null;
    const xs = all.map((p: number[]) => p[0]), ys = all.map((p: number[]) => p[1]);
    return [[Math.min(...xs), Math.min(...ys)], [Math.max(...xs), Math.max(...ys)]];
  };

  useEffect(() => {
    let off = false;
    (async () => {
      const ml = (await import("maplibre-gl")).default;
      if (off || !el.current) return;
      const m = new ml.Map({ container: el.current, style: STYLE, bounds: bounds() ?? undefined, fitBoundsOptions: { padding: 48 }, attributionControl: { compact: true }, cooperativeGestures: true });
      m.addControl(new ml.NavigationControl({ showCompass: false }), "top-right");
      map.current = m;
      m.on("load", () => {
        m.addSource("corridors", { type: "geojson", data });
        m.addSource("mids", { type: "geojson", data: mids });
        m.addLayer({ id: "corridor-hit", type: "line", source: "corridors", paint: { "line-color": "#000", "line-opacity": 0, "line-width": 18 } });
        m.addLayer({ id: "corridor-casing", type: "line", source: "corridors", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#ffffff", "line-width": ["interpolate", ["linear"], ["zoom"], 8, 4, 15, 12] } });
        m.addLayer({ id: "corridor-line", type: "line", source: "corridors", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": ["case", ["get", "picked"], INK, BLUE], "line-width": ["interpolate", ["linear"], ["zoom"], 8, 2.5, 15, 8] } });
        m.addLayer({ id: "corridor-dot", type: "circle", source: "mids", maxzoom: 11, paint: { "circle-radius": ["case", ["get", "picked"], 7, 5], "circle-color": ["case", ["get", "picked"], INK, BLUE], "circle-stroke-color": "#fff", "circle-stroke-width": 2 } });
        m.addLayer({ id: "corridor-label", type: "symbol", source: "corridors", minzoom: 11, layout: { "symbol-placement": "line", "text-field": ["get", "name"], "text-size": 12, "text-font": ["Montserrat Medium", "Open Sans Bold", "Noto Sans Regular", "HanWangHeiLight Regular", "NanumBarunGothic Regular"] }, paint: { "text-color": INK, "text-halo-color": "#fff", "text-halo-width": 2 } });
        const pick = (e: Any) => { const f = e.features?.[0]; if (f) pickRef.current(Number(f.properties.id)); };
        for (const id of ["corridor-hit", "corridor-dot"]) {
          m.on("click", id, pick);
          m.on("mouseenter", id, () => (m.getCanvas().style.cursor = "pointer"));
          m.on("mouseleave", id, () => (m.getCanvas().style.cursor = ""));
        }
      });
    })();
    return () => { off = true; map.current?.remove(); map.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const m = map.current;
    if (!m || !m.isStyleLoaded()) return;
    (m.getSource("corridors") as GeoJSONSource | undefined)?.setData(data);
    (m.getSource("mids") as GeoJSONSource | undefined)?.setData(mids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked, key]);

  useEffect(() => {
    const m = map.current, b = bounds();
    if (m && b) m.fitBounds(b, { padding: 48, duration: 600 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    const m = map.current;
    const c = lines.find((x) => x.id === picked);
    if (!m || !c) return;
    const xs = c.coords.map((p: number[]) => p[0]), ys = c.coords.map((p: number[]) => p[1]);
    m.fitBounds([[Math.min(...xs), Math.min(...ys)], [Math.max(...xs), Math.max(...ys)]], { padding: 80, maxZoom: 16, duration: 700 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked]);

  return <div ref={el} className="h-[440px] w-full overflow-hidden rounded-[12px] border border-[#edf0f4] sm:h-[520px]" role="region" aria-label="Map of Wightman corridors" />;
}
