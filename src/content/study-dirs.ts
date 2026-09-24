import { TOKENS } from "@/content/tokens";

/* Static studies under /public/portal/<dir>, each opened only with its own token (see src/proxy.ts).
   Shared with the team portal, which lists every study. */
export const STUDY_DIRS: Record<string, string> = {
  micruity: TOKENS.micruity,
  janta: TOKENS.janta,
  fyxit: TOKENS.fyxit,
  novarna: TOKENS.novarna,
  soarce: TOKENS.soarce,
  loanwell: TOKENS.loanwell,
  /* A study added to portals.ts but not to this map 404s for everyone, with the
     deliberate silence this gate was built for — no log line, no error, and a
     404 that reads as "the file is missing" rather than "you are not allowed".
     Enable shipped that way on 2026-09-22 and cost an afternoon to find. If you
     add a study, add it here in the same commit. */
  ...(TOKENS.enable ? { enable: TOKENS.enable } : {}),
  ...(TOKENS.venturehueStudy ? { venturehue: TOKENS.venturehueStudy } : {}),
  ...(TOKENS.meknology ? { meknology: TOKENS.meknology } : {}),
  ...(TOKENS.blacktechweek ? { blacktechweek: TOKENS.blacktechweek } : {}),
  ...(TOKENS.lightshipCapital ? { lightshipcapital: TOKENS.lightshipCapital } : {}),
  ...(TOKENS.lightshipFoundation ? { lightshipfoundation: TOKENS.lightshipFoundation } : {}),
  ...(TOKENS.elemental ? { elemental: TOKENS.elemental } : {}),
  ...(TOKENS.startupzooStudy ? { startupzoo: TOKENS.startupzooStudy } : {}),
};
