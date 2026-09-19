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

export const TOKENS = {
  micruity: tok("PORTAL_TOKEN_MICRUITY"),
  janta: tok("PORTAL_TOKEN_JANTA"),
  fyxit: tok("PORTAL_TOKEN_FYXIT"),
  novarna: tok("PORTAL_TOKEN_NOVARNA"),
  soarce: tok("PORTAL_TOKEN_SOARCE"),
  loanwell: tok("PORTAL_TOKEN_LOANWELL"),
  collab: tok("PORTFOLIO_TOKEN_COLLAB"),
} as const;
