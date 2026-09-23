import { TOKENS } from "@/content/tokens";

/* Elemental Media (Kalamazoo production company). A pitch to a room that cuts film for a
   living, so it leads with the work, not with a diagnosis. Every measurement below was taken
   on 2026-09-23 and says how. */

export const studio = {
  token: TOKENS.elementalPitch,
  short: "Elemental Media",
  preparedFor: "Elemental Media",
  studyToken: TOKENS.elemental,
};

export const getStudio = (token: string) => (studio.token && studio.token === token ? studio : undefined);

/* What we measured on weareelementalmedia.com. Framed as opportunities: they are craft
   people and the fixes are cheap. */
export const measured = [
  {
    k: "104.6 MB",
    t: "The homepage downloads 104.6 MB on a desktop and takes 10.2 seconds to load.",
    d: "The 2022 demo reel is the background video, a 49 MB file, and it is fetched twice. Your 2024 reel lives on Vimeo, further down the page. The rebuild plays a 14-second, 2 MB loop cut from six of your films and puts the current reel one click away.",
    how: "Chromium at 1440×900, every response counted, September 23, 2026",
  },
  {
    k: "Nov 2024",
    t: "The newest blog post is from November 6, 2024.",
    d: "Ten months of silence reads as a quiet studio, and you are not one: Burdick's shipped in March and Landscape Forms in May.",
    how: "weareelementalmedia.com/blog, post dates on the page",
  },
  {
    k: "Not in the top 9",
    t: "A search for “video production company Kalamazoo MI” does not return Elemental in the first nine results.",
    d: "Five competitors' own pages do: BLARE, Visionaery, KZoom, Innovative Media Group and MotionPossible. The rest are directories. Your client list is stronger than any of theirs.",
    how: "One web search, September 23, 2026. Rankings move; this is a snapshot",
  },
  {
    k: "2 of 6",
    t: "The site shows two case studies. Your Vimeo has six films from the last two years alone.",
    d: "Bell's, Landscape Forms, Kalamazoo Airport, Burdick's, Stedman and Factory Coffee are all public. The rebuild plays every one of them in place, at the same 2.39 frame.",
    how: "vimeo.com/user49532874 and the site's case study page",
  },
  {
    k: "5",
    t: "The homepage has five top-level headings, and the first one reads “Home”.",
    d: "Search engines and screen readers take the first heading as the page's subject. Three of the six images also have no description.",
    how: "Page structure read in Chromium",
  },
];

/* Arthur as the intelligence layer of a production company. Each is written in their terms. */
export const layers = [
  {
    name: "Every frame, searchable",
    does: "Years of rushes indexed by what is in the shot: faces, products, places, light, motion. Ask for every slow-motion pour you have shot since 2020 and get the clips, with timecode.",
    so: "Pitches, reels and stock licensing built from footage you already own.",
  },
  {
    name: "Bids from what jobs really cost",
    does: "Estimates drafted from the actual crew days, gear and post hours of similar past jobs, not from memory. Every line shows the job it came from.",
    so: "Fewer jobs that quietly lose money.",
  },
  {
    name: "Rights, releases and renewals",
    does: "Talent releases, location permits, music licences and usage terms tracked per deliverable, with a reminder before a spot outlives its licence.",
    so: "No client airs a spot you no longer have the rights to.",
  },
  {
    name: "Client memory",
    does: "Every brief, feedback round, brand guideline and approval, per client. Arthur knows Bell's seasonal launches come around and says so a month early.",
    so: "Repeat work arrives because you asked first.",
  },
  {
    name: "Deliverables from one master",
    does: "The :30 becomes the :15, the 9:16, the 1:1 and the captioned cut, to each platform's spec, with the versions and approvals logged.",
    so: "Post hours go to the edit, not the exports.",
  },
  {
    name: "Gear and calendar",
    does: "Shoots, crew and the rental inventory on one calendar: conflicts flagged, maintenance due, and which kit actually pays for itself.",
    so: "The rental line becomes a business you can see.",
  },
];

export const questions = [
  "Which clients have not commissioned anything in twelve months, and what did they last buy?",
  "Which kinds of job make the most per crew day, and which lose money?",
  "Which footage could we license, and to whom?",
  "Which rental items earned back their cost, and which sit on the shelf?",
  "Which West Michigan brands' video is older than three years? (This is how we found you.)",
];
