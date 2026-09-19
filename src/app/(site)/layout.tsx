import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

/* The marketing chrome lives here rather than in the root layout so that the
   client portal under /p can render its own. A route group changes no URLs.

   The home page deliberately sits OUTSIDE this group, at src/app/page.tsx,
   because the delivered build ships its own header and footer. Detecting the
   route at runtime to skip the chrome was tried and did not work — it rendered
   two of each — so the exclusion is structural instead. */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}