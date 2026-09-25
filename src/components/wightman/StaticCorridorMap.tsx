/* A real map thumbnail, pre-rendered by scripts/corridor-thumbs.mjs from the OpenStreetMap vector basemap with the
   corridor drawn on its actual street. Static images, so the page depends on no live tile service. */
export function StaticCorridorMap({ id, label }: { id: number; label: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[#f2f2f0]" style={{ aspectRatio: "880 / 520" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/p/wightman/corridors/${id}.png`} alt={`Map of ${label}`} loading="lazy" width={880} height={520} className="h-full w-full object-cover" />
      <span className="absolute bottom-1 right-1.5 text-[8.5px] text-[#8c8e95]">© OpenStreetMap © CARTO</span>
    </div>
  );
}
