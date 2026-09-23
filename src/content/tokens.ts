/**
 * Share-link tokens.
 *
 * A portal token IS the credential — it is the only thing standing between a
 * link and the work behind it. Committing them to the repository means every
 * reader of the repo holds every client's link forever, and rotating one means
 * a commit. So they live in the environment and the repository holds only the
 * names.
 *
 * Read at build time by generateStaticParams, so a missing value fails the
 * build loudly rather than silently publishing a page at an empty path.
 *
 * Set in .env.local for development and in the host's environment for deploys:
 *   PORTAL_TOKEN_MICRUITY, PORTAL_TOKEN_JANTA, PORTAL_TOKEN_FYXIT,
 *   PORTFOLIO_TOKEN_COLLAB
 */
function tok(name: string): string {
  const v = process.env[name];
  if (!v || v.length < 12) {
    throw new Error(
      `Missing or too-short share token ${name}. Set it in .env.local — see src/content/tokens.ts.`,
    );
  }
  return v;
}

/** A fund study may exist before it is shareable: no token, not published. */
function tokOptional(name: string): string | undefined {
  const v = process.env[name];
  if (!v) return undefined;
  if (v.length < 12) {
    throw new Error(`Share token ${name} is set but too short to be a credential.`);
  }
  return v;
}

export const TOKENS = {
  micruity: tok("PORTAL_TOKEN_MICRUITY"),
  janta: tok("PORTAL_TOKEN_JANTA"),
  fyxit: tok("PORTAL_TOKEN_FYXIT"),
  novarna: tok("PORTAL_TOKEN_NOVARNA"),
  soarce: tok("PORTAL_TOKEN_SOARCE"),
  loanwell: tok("PORTAL_TOKEN_LOANWELL"),
  collab: tok("PORTFOLIO_TOKEN_COLLAB"),
  elemental: tokOptional("PORTAL_TOKEN_ELEMENTAL"),
  // Funds on the PitchMI AI & Software panel. Each publishes the moment its
  // token is set; until then the study is written but unreachable.
  corewell: tokOptional("PORTFOLIO_TOKEN_COREWELL"),
  assembly: tokOptional("PORTFOLIO_TOKEN_ASSEMBLY"),
  elab: tokOptional("PORTFOLIO_TOKEN_ELAB"),
  // The Funder's Panel itself, 2026-09-22: Brian Brackeen (Lightship Capital),
  // Shalanda Armstrong (100KM VC), Brittni Abiolu (VentureHue). Tokens are set,
  // so these three publish.
  enable: tokOptional("PORTAL_TOKEN_ENABLE"),
  /* The STUDY token, distinct from `venturehue` below which is the FUND token.
     VentureHue is both a fund on the panel and the subject of a rebuild, so it
     needs two: one for /p/<token>/marketing-site and one for the fund page. */
  venturehueStudy: tokOptional("PORTAL_TOKEN_VENTUREHUE"),
  lightship: tokOptional("PORTFOLIO_TOKEN_LIGHTSHIP"),
  hundredkm: tokOptional("PORTFOLIO_TOKEN_HUNDREDKM"),
  venturehue: tokOptional("PORTFOLIO_TOKEN_VENTUREHUE"),
  // Kalamazoo Forward Ventures portfolio company, pitched direct 2026-09-22.
  meknology: tokOptional("PORTAL_TOKEN_MEKNOLOGY"),
  meknologyPortfolio: tokOptional("PORTFOLIO_TOKEN_MEKNOLOGY"),
  // Brian Brackeen (Lightship Capital), met 2026-09-22. His three sites, each its own study.
  blacktechweek: tokOptional("PORTAL_TOKEN_BLACKTECHWEEK"),
  lightshipCapital: tokOptional("PORTAL_TOKEN_LIGHTSHIPCAPITAL"),
  lightshipFoundation: tokOptional("PORTAL_TOKEN_LIGHTSHIPFOUNDATION"),
  // Lanette Dailey-Reese, Global Citizens PCS (DC), 2026-09-23: the compliance calendar pitch.
  globalCitizens: tokOptional("PORTFOLIO_TOKEN_GLOBALCITIZENS"),
} as const;
