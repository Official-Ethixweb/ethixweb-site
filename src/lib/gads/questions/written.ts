import type { AuthoredGadsQuestion } from "@/lib/gads/questions/shared";

// 4 short written questions (4 min each), 50-150 word target. Heuristically
// scored (length + evaluationCriteria coverage) and always human-reviewed -
// see gads-scoring.ts. 2 Medium / 2 Hard.

export const WRITTEN_QUESTIONS: AuthoredGadsQuestion[] = [
  {
    mechanic: "written",
    topic: "Budget Optimization",
    difficulty: "Medium",
    question:
      "You manage three campaigns for one client sharing a single monthly budget. Campaign A has strong ROAS but is frequently limited by budget. Campaign B has mediocre ROAS and rarely spends its full budget. Campaign C is a new launch with too little data to judge yet. In 50-150 words, explain how you would decide whether and how to reallocate budget between them this month.",
    options: [],
    correctAnswers: [],
    explanation: "",
    evaluationCriteria: [
      "Recognizes shifting budget from Campaign B toward Campaign A as the primary lever, since A is both efficient and demand-constrained",
      "Notes Campaign C should be given a fair chance to gather data before being deprioritized or cut, rather than judged prematurely",
      "Mentions monitoring after the change - checking whether A's ROAS holds up at higher spend, since efficiency can decline with scale",
      "Shows awareness that reallocation should be gradual or tested rather than an abrupt full shift",
    ],
  },
  {
    mechanic: "written",
    topic: "Performance Max",
    difficulty: "Hard",
    question:
      "A client with an existing, well-performing set of standalone Search and Shopping campaigns wants to add a Performance Max campaign to \"get more volume.\" In 50-150 words, explain the key risks of doing this carelessly, and how you'd structure the rollout to protect what's already working.",
    options: [],
    correctAnswers: [],
    explanation: "",
    evaluationCriteria: [
      "Identifies the risk of Performance Max cannibalizing or competing with existing Search/Shopping campaigns for the same auctions and budget",
      "Mentions using account-level negative keywords or exclusions where relevant to reduce overlap",
      "Recommends a controlled test - modest starting budget, clear success criteria, defined comparison period - rather than an immediate full-budget shift",
      "Shows awareness that Performance Max's reduced visibility and control versus standalone campaigns is a real trade-off to monitor, not just a feature to adopt blindly",
    ],
  },
  {
    mechanic: "written",
    topic: "CPA",
    difficulty: "Medium",
    question:
      "A client is unhappy that their target CPA has crept up 25% over the last quarter, even though conversion volume has grown. In 50-150 words, explain how you would investigate this and what you'd tell the client.",
    options: [],
    correctAnswers: [],
    explanation: "",
    evaluationCriteria: [
      "Suggests checking whether rising CPA correlates with rising volume or expanded reach, since scaling often costs more per unit as auctions reach less efficient territory",
      "Mentions checking external factors: increased competition or auction pressure, seasonality, or account-level changes such as new campaigns or broader targeting",
      "Recommends checking whether conversion value or quality has also improved, not just volume, before treating the CPA increase as purely bad news",
      "Frames the client conversation around trade-offs (volume vs. efficiency) rather than promising an immediate fix without diagnosis",
    ],
  },
  {
    mechanic: "written",
    topic: "Conversion Value",
    difficulty: "Hard",
    question:
      "A client sells products with a wide price range, from $20 to $2,000, through the same Shopping campaign, currently optimizing toward Maximize Conversions (conversion count only, no value). In 50-150 words, explain why this is likely a mismatch for this business and what you'd change.",
    options: [],
    correctAnswers: [],
    explanation: "",
    evaluationCriteria: [
      "Identifies that optimizing for conversion count treats a $20 sale and a $2,000 sale as equally valuable, which misaligns spend toward cheaper, easier conversions",
      "Recommends passing dynamic conversion value per transaction into tracking rather than a flat value",
      "Recommends switching to a value-based bidding strategy - Maximize Conversion Value, or Target ROAS once enough data exists",
      "Shows awareness that this change needs sufficient conversion volume and data before Smart Bidding can optimize well on the new goal",
    ],
  },
];
