import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SiteFrame } from "@/components/SiteFrame";

/* The marketing chrome, rendered ONCE.

   It previously lived here and was ALSO imported by /work, /about, /contact,
   /work/[slug], /contact/success and not-found, so five of the six pages
   shipped two headers and two footers stacked on top of each other. The
   homepage sat outside this group entirely and ran a third navigation of its
   own inside injected HTML.

   The home page is now inside the group like every other page, so there is one
   nav, one footer, and one set of tokens for all of them. The client portal
   under /p keeps its own chrome; a route group changes no URLs. */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav />
      <SiteFrame>{children}</SiteFrame>
      <Footer />
      <Reveal />
    </>
  );
}
