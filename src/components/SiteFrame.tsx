export function SiteFrame({ children }: { children: React.ReactNode }) {
  /* The header used to be `fixed`, so every page except the homepage needed its
     height back as padding. It is `sticky` now -- it occupies real space in the
     flow and scrolls with the page until it pins -- so the padding is gone and
     this component no longer needs to know which route it is on. That also
     makes it a server component again. */
  return <div className="flex-1">{children}</div>;
}
