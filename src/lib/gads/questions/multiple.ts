import type { AuthoredGadsQuestion } from "@/lib/gads/questions/shared";

// 8 multiple-correct MCQs (30s each), 2-4 correct answers out of 5-6
// options. 2 Easy / 4 Medium / 2 Hard. Never hints at how many options are
// correct in the question text.

export const MULTIPLE_QUESTIONS: AuthoredGadsQuestion[] = [
  {
    mechanic: "multiple",
    topic: "Extensions / Assets",
    difficulty: "Easy",
    question:
      "Which of the following are legitimate reasons to add Sitelink, Callout, and Structured Snippet assets to a Search campaign?",
    options: [
      "They can improve CTR by giving searchers more reasons to click",
      "They take up more ad real estate, which can push competitor ads further down the page",
      "They guarantee a Quality Score of 10 regardless of other factors",
      "They contribute positively to Ad Rank when eligible to show",
      "They are required for an ad to enter the auction at all",
      "They replace the need for compelling headline and description copy",
    ],
    correctAnswers: [0, 1, 3],
    explanation:
      "Assets genuinely help CTR, ad strength, and Ad Rank, and can crowd out competitors visually - but they're not mandatory for auction eligibility, don't guarantee Quality Score, and don't substitute for strong core ad copy.",
    evaluationCriteria: [],
  },
  {
    mechanic: "multiple",
    topic: "Shopping",
    difficulty: "Easy",
    question:
      "Which of these directly affect whether a Shopping ad shows for a given search query?",
    options: [
      "The product title and description in the Merchant Center feed",
      "The product's GTIN, brand, and attribute data matching the search intent",
      "The headline character limit used in Search ads",
      "Negative keywords applied at the Shopping campaign level",
      "The account manager's total years of experience running Shopping campaigns",
    ],
    correctAnswers: [0, 1, 3],
    explanation:
      "Shopping ad matching is driven by feed data quality and campaign-level negatives (there's no manual keyword targeting in standard Shopping). Headline limits are a Search-ad concept, and an account manager's experience isn't a matching signal at all.",
    evaluationCriteria: [],
  },
  {
    mechanic: "multiple",
    topic: "Keyword Match Types",
    difficulty: "Medium",
    question: "Which statements about Google Ads keyword match types are currently accurate?",
    options: [
      "Broad match can trigger ads for queries with no shared words with the keyword, based on signals like landing page content and other keywords in the account",
      "Phrase match requires the query to contain the meaning of the keyword in the same word order, but can allow extra words before or after",
      "Exact match only ever matches the identical keyword string, word for word",
      "Broad match is generally the best choice when Smart Bidding is not in use and budgets are tight",
      "Match types can be mixed within the same ad group",
      "Negative keywords use the same match-type behavior as positive keywords of that type",
    ],
    correctAnswers: [0, 1, 4, 5],
    explanation:
      "Exact match now allows close variants, so it's not purely literal (making that option false), and broad match without Smart Bidding on a tight budget is generally risky rather than best practice. The other four statements correctly describe current behavior.",
    evaluationCriteria: [],
  },
  {
    mechanic: "multiple",
    topic: "Search Terms",
    difficulty: "Medium",
    question:
      "Reviewing a Search Terms report, which findings genuinely justify action (adding a negative keyword, or promoting a term to its own keyword)?",
    options: [
      "A search term with high spend and zero conversions after a statistically reasonable number of clicks",
      "A search term that is clearly irrelevant to the product or service being sold",
      "A single click on a well-performing, on-topic search term",
      "A search term with strong conversion volume and good CPA that isn't yet its own keyword",
      "A search term that matched under broad match and happens to be longer than the original keyword",
      "A search term with borderline relevance but only one impression to date",
    ],
    correctAnswers: [0, 1, 3],
    explanation:
      "Real signal requires either clear irrelevance or enough volume to trust the numbers. Single-impression or single-click terms, and term length alone, aren't reliable triggers for action yet.",
    evaluationCriteria: [],
  },
  {
    mechanic: "multiple",
    topic: "Conversion Tracking",
    difficulty: "Medium",
    question:
      "A client's Google Ads conversion count looks noticeably inflated compared to what their CRM shows as real leads. Which of these are plausible, worth-investigating causes?",
    options: [
      'The conversion action is set to count "every" conversion instead of "one" per click/interaction where that doesn\'t match the business goal',
      'The conversion tag fires on a "thank you" page that\'s also reachable by refreshing or navigating back to it',
      "Enhanced conversions are enabled, which by itself always doubles reported conversions",
      "A test or staging environment is sharing the same conversion tag as production",
      "The account currency is set to USD",
      "Import settings are double-counting conversions already tracked by a separate GA4 import",
    ],
    correctAnswers: [0, 1, 3, 5],
    explanation:
      "All four are real, common inflation causes. Enhanced conversions improve match rates but don't inherently double-count, and account currency has nothing to do with conversion counting.",
    evaluationCriteria: [],
  },
  {
    mechanic: "multiple",
    topic: "Budget Optimization",
    difficulty: "Medium",
    question:
      'A campaign is "Limited by budget" with strong ROAS and healthy impression share lost specifically to budget. Which responses are reasonable?',
    options: [
      "Increase the budget if the account has room to scale profitably at the current ROAS",
      "Leave it as-is permanently, since being budget-limited is never worth addressing",
      "Check whether reallocating budget from a weaker-performing campaign could fund this one without increasing total spend",
      "Confirm the strong ROAS is trustworthy (enough conversion volume, accurate tracking) before scaling spend based on it",
      'Immediately cut the budget in half to "protect" current performance',
    ],
    correctAnswers: [0, 2, 3],
    explanation:
      "A budget-limited, strong-ROAS campaign is a legitimate scaling opportunity, but only after sanity-checking the data - ignoring it entirely or cutting budget both waste a real, actionable signal.",
    evaluationCriteria: [],
  },
  {
    mechanic: "multiple",
    topic: "Performance Max",
    difficulty: "Hard",
    question: "Which statements about Performance Max campaigns are accurate?",
    options: [
      "Asset Groups are the closest equivalent to ad groups, organizing creative around a theme or audience",
      "Performance Max can serve across Search, Display, YouTube, Discover, Gmail, and Maps from a single campaign",
      "Search terms insights are fully unavailable for Performance Max under any circumstances",
      "Audience signals guide the algorithm's early targeting but don't strictly restrict who can be shown ads",
      "Negative keywords can be applied at the account level, or with support-assisted access, to help exclude clearly irrelevant traffic",
      "Performance Max always outperforms a well-structured set of standalone Search, Display, and Shopping campaigns",
    ],
    correctAnswers: [0, 1, 3, 4],
    explanation:
      "Performance Max does expose a search terms insights report (limited but real), so that statement is false, and performance is always context-dependent, never guaranteed to beat a well-built standalone setup.",
    evaluationCriteria: [],
  },
  {
    mechanic: "multiple",
    topic: "Quality Score",
    difficulty: "Hard",
    question: "Which of the following statements about Quality Score are accurate?",
    options: [
      "It is a diagnostic estimate (1-10) reported at the keyword level for Search, made up of expected CTR, ad relevance, and landing page experience",
      "A higher Quality Score can lower the actual CPC needed to achieve the same ad position",
      "Quality Score is a single number that directly and solely determines final Ad Rank",
      "Quality Score history resets to neutral the moment a keyword's match type is changed",
      "Quality Score components are graded relative to other advertisers competing for the same keyword",
      "Improving landing page load speed and relevance can improve the landing page experience component",
    ],
    correctAnswers: [0, 1, 4, 5],
    explanation:
      "Quality Score is diagnostic, not the sole determinant of Ad Rank (which also factors in bid and other elements), and changing match type doesn't reset its history - the other four statements correctly describe how it works and what moves it.",
    evaluationCriteria: [],
  },
];
