import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWightman, wightmanClients } from "@/content/hub/wightman";
import intel from "@/content/hub/wightman-intel.json";
import rows from "@/content/hub/wightman-intel-rows.json";
import { WightmanDashboard } from "@/components/wightman/Dashboard";

export const dynamicParams = false;
export function generateStaticParams() {
  return wightmanClients.map((c) => ({ token: c.token }));
}
export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  return { title: getWightman(token) ? "Wightman territory dashboard" : "Dashboard" };
}

/* The working view of the territory brief: filter, sort and drill in. Same data as the proposal page. */
export default async function DashboardPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const c = getWightman(token);
  if (!c) notFound();
  const I = intel as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    <WightmanDashboard
      token={c.token}
      preparedFor={c.preparedFor}
      rows={rows as any} // eslint-disable-line @typescript-eslint/no-explicit-any
      corridors={I.corridors}
      survival={I.survival}
      businessesNow={I.businessesNow}
      builtAt={I.builtAt}
    />
  );
}
