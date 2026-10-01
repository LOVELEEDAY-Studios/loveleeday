import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNow, nowClients } from "@/content/hub/nowkalamazoo";
import data from "@/content/hub/nowkalamazoo-data.json";
import { NowDashboard } from "@/components/nowkalamazoo/Dashboard";

export const dynamicParams = false;
export function generateStaticParams() {
  return nowClients.map((c) => ({ token: c.token }));
}
export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  return { title: getNow(token) ? "NowKalamazoo with Arthur: the working view" : "Dashboard", robots: { index: false } };
}

/* The working view behind the proposal: what Arthur would put in front of the newsroom this morning, built
   from public data only (~/arthur/scripts/nowkalamazoo-data.mjs, plus the story and records desk file when
   it exists). A panel with no data renders nothing. */
export default async function DashboardPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const c = getNow(token);
  if (!c) notFound();
  const deskFile = path.join(process.cwd(), "src/content/hub/nowkalamazoo-desk.json");
  const desk = fs.existsSync(deskFile) ? JSON.parse(fs.readFileSync(deskFile, "utf8")) : null;
  return <NowDashboard token={c.token} preparedFor={c.preparedFor} data={data as never} desk={desk} />;
}
