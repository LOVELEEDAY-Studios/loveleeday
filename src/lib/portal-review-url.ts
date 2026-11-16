const namedReviewPaths = [
  "bogan", "portfolio", "doorlight", "nowkalamazoo", "wightman",
  "studio", "hub", "civic", "compliance",
] as const;

type NamedReview = (typeof namedReviewPaths)[number];

type ResolvedReview = Partial<Record<NamedReview | "standard", boolean>>;

export function portalReviewUrl(token: string, review: ResolvedReview, deliverable?: string) {
  const named = review.standard ? undefined : namedReviewPaths.find(path => review[path]);
  if (!review.standard && !named) throw new Error("Unknown review format");
  const pieces = ["p", ...(named ? [named] : []), token];
  if (review.standard && deliverable) pieces.push(deliverable);
  return `https://loveleedaystudios.com/${pieces.map(encodeURIComponent).join("/")}`;
}
