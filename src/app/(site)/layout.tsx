import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

/* The marketing chrome lives here rather than in the root layout so that the
   client portal under /p can render its own chrome. A route group changes no
   URLs — /about is still /about. */
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
