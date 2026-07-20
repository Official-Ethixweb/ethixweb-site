import type { JobId } from "@/lib/careers-data";
import type { RoleScreeningConfig } from "@/lib/screening/anthropic";

// Screening config per role - v1 covers seo-specialist only, per the proposed
// rollout (prove it catches real signal on one role before expanding).
//
// IMPORTANT: scenarioContext below is placeholder material, not real client
// data. Swap it for actual anonymized situations from real client accounts
// (strip client names/domains/PII) before running real candidates through
// this - the whole point is that a generic AI answer can't paraphrase
// something it's never seen.
export const SCREENING_CONFIG: Partial<Record<JobId, RoleScreeningConfig>> = {
  "seo-specialist": {
    roleTitle: "SEO Specialist",
    questionCount: 4,
    scenarioContext:
      "PLACEHOLDER - replace with real anonymized client data before live use. " +
      "Example shape: a home-service client (e.g. a plumbing or HVAC company) in a mid-size US " +
      "metro has an existing Google Business Profile with 40+ reviews but has dropped out of the " +
      "local 3-pack for their top 3 service keywords over the last 60 days. Organic sessions are " +
      "flat month over month. Their WordPress site has no schema markup on service pages, and " +
      "Search Console shows a spike in 404s from an old URL structure that was never redirected " +
      "after a redesign 4 months ago.",
    rubric:
      "Score each answer 0-10 against: (1) Technical accuracy - does the diagnosis match how " +
      "local SEO and Core Web Vitals actually work, not generic advice; (2) Practical prioritization " +
      "- does the candidate identify what to fix first and why, given limited time/budget, rather " +
      "than listing everything; (3) Specificity to the scenario given - does the answer engage with " +
      "the actual details provided (the 404 spike, the review count, the dropped ranking) rather than " +
      "reading as boilerplate that could apply to any client; (4) For the critique question - does " +
      "the candidate correctly identify what the AI-generated answer got wrong or oversimplified, " +
      "rather than just agreeing with it or restating it.",
  },
};

export function getScreeningConfig(roleId: string): RoleScreeningConfig | undefined {
  return SCREENING_CONFIG[roleId as JobId];
}
