import arcjet, { tokenBucket } from "@arcjet/next";

export const aj = arcjet({
  key: process.env.NEXT_PUBLIC_ARCJET_KEY,
  rules: []
});

// Free tier pantry scan limits (10 scans per month)
export const freePantryScans = aj.withRule(
  tokenBucket({
    mode: "LIVE",
    characteristics: ["userId"],
    refillRate: 10,
    interval: "30d",
    capacity: 10,
  }),
);

// Free tier meal recommendations (5 per month)
export const freeMealRecommendation = aj.withRule(
  tokenBucket({
    mode: "LIVE",
    characteristics: ["userId"],
    refillRate: 5,
    interval: "30d",
    capacity: 10,
  }),
);

// Pro tier - effectively unlimited (very high limits)
export const proRateLimit = aj.withRule(
  tokenBucket({
    mode: "LIVE",
    characteristics: ["userId"],
    refillRate: 1000,
    interval: "1d",
    capacity: 10,
  }),
);
//
