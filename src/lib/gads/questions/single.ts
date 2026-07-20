import type { AuthoredGadsQuestion } from "@/lib/gads/questions/shared";

// 12 single-correct MCQs (30s each). 3 Easy / 6 Medium / 3 Hard.
// Option order is authored for readability only - shuffleOptions() in
// ./index.ts re-randomizes it before the candidate ever sees it, so the
// position of the correct answer below carries no live signal.

export const SINGLE_QUESTIONS: AuthoredGadsQuestion[] = [
  {
    mechanic: "single",
    topic: "Search Campaigns",
    difficulty: "Easy",
    question:
      "You're setting up a new Search campaign for a B2B SaaS client with a modest budget. Which factor has the single biggest impact on whether your ad is even eligible to enter the auction for a given search?",
    options: [
      "The ad's headline character count",
      "Keyword match type and relevance to the search query",
      "The number of sitelink extensions attached",
      "The campaign's start date",
    ],
    correctAnswers: [1],
    explanation:
      "Auction eligibility hinges on keyword-to-query match and relevance before Ad Rank, extensions, or Quality Score ever come into play.",
    evaluationCriteria: [],
  },
  {
    mechanic: "single",
    topic: "CTR",
    difficulty: "Easy",
    question:
      "A Search ad has an impressive 8% CTR but the account has almost no conversions from it. What does that high CTR alone actually tell you?",
    options: [
      "The ad copy and offer are compelling enough to earn clicks - it says nothing on its own about whether those clicks are the right audience or convert",
      "The keyword is definitely too broad and should be paused immediately",
      "Quality Score is guaranteed to be 10 out of 10",
      "The landing page must be broken",
    ],
    correctAnswers: [0],
    explanation:
      "CTR measures click appeal only. Conflating a strong CTR with strong downstream performance is a common junior mistake - it's diagnostic of ad relevance, not conversion quality.",
    evaluationCriteria: [],
  },
  {
    mechanic: "single",
    topic: "Keyword Match Types",
    difficulty: "Easy",
    question:
      "The keyword [running shoes] is added on exact match. Under current exact match behavior, which search query is it eligible to trigger an ad for?",
    options: [
      '"buy shoes for running" only',
      'Only the literal query "running shoes", nothing else',
      'Close variants with the same meaning and intent, such as "running shoe" or "shoes for running"',
      'Any query containing the words "running" or "shoes" in any order',
    ],
    correctAnswers: [2],
    explanation:
      "Exact match today covers same-meaning close variants, not just the literal string (that was the old behavior), and it's not the loose, signal-based matching broad match uses.",
    evaluationCriteria: [],
  },
  {
    mechanic: "single",
    topic: "Quality Score",
    difficulty: "Medium",
    question:
      "Two advertisers bid the same CPC on the same keyword. Advertiser A has a Quality Score of 8; Advertiser B has a Quality Score of 4. What's the most accurate statement about their likely ad positions?",
    options: [
      "They will tie, since Quality Score only affects CPC, not position",
      "Advertiser A will generally rank higher, because Ad Rank is a function of bid AND Quality Score together",
      "Advertiser B will rank higher, because a lower Quality Score means a lower actual CPC",
      "Position is decided purely by budget size, not Quality Score",
    ],
    correctAnswers: [1],
    explanation:
      "Ad Rank is a function of bid and Quality Score (among other ad rank components) - at equal bids, the higher-QS advertiser wins position.",
    evaluationCriteria: [],
  },
  {
    mechanic: "single",
    topic: "Negative Keywords",
    difficulty: "Medium",
    question:
      'You manage a premium furniture brand that sells only new items. The search terms report shows repeated impressions and some spend on queries like "used sofa" and "secondhand dining table." What\'s the most correct fix?',
    options: [
      "Lower the campaign's overall budget so less is spent on these terms",
      'Add "used" and "secondhand" as negative keywords at the appropriate level',
      "Switch every keyword to exact match to stop them from matching",
      "Pause the ad group entirely",
    ],
    correctAnswers: [1],
    explanation:
      "Negatives are the precise instrument for excluding irrelevant intent. Switching everything to exact match is a blunt overcorrection that also kills legitimate close-variant traffic; a budget cut or full pause doesn't address the root cause.",
    evaluationCriteria: [],
  },
  {
    mechanic: "single",
    topic: "Ad Rank",
    difficulty: "Medium",
    question:
      "A client asks why their ad shows in position 2 even though they're bidding the highest CPC in the auction. What's the most likely explanation?",
    options: [
      "Google made an error - the highest bid should always win top position",
      "Ad Rank also factors in Quality Score and expected ad experience, so a lower bid with better quality can outrank a higher bid",
      "Position is randomized to give every advertiser a fair share of the top spot",
      "Only advertisers using Performance Max can ever reach position 1",
    ],
    correctAnswers: [1],
    explanation:
      "The highest bid does not guarantee the top slot - Ad Rank blends bid with Quality Score and other ad rank components.",
    evaluationCriteria: [],
  },
  {
    mechanic: "single",
    topic: "Location Targeting",
    difficulty: "Medium",
    question:
      "A campaign is targeting a specific city, but the client suspects impressions are coming from people outside that city who just happen to be searching about it. What's the most likely cause and fix?",
    options: [
      "Google Ads doesn't support city-level targeting, so this is expected",
      'The location option was likely set to "Presence or interest," which also shows ads to people searching about that location - switching to "Presence" targeting fixes it',
      "The client's budget is too low, which is unrelated to this issue",
      "This can only be fixed by adding the location name as a negative keyword",
    ],
    correctAnswers: [1],
    explanation:
      '"Presence or interest" serves ads to people merely searching about a location, not just people physically there. "Presence" targeting restricts delivery to people actually in or regularly in the location.',
    evaluationCriteria: [],
  },
  {
    mechanic: "single",
    topic: "Device Adjustments",
    difficulty: "Medium",
    question:
      "Conversion rate on mobile is 40% lower than desktop for a lead-gen campaign, but mobile drives most of the traffic. What's the most defensible first move?",
    options: [
      "Exclude mobile devices entirely from the campaign",
      "Investigate the mobile landing page experience before touching bids - a broken or slow mobile page is a common cause of a gap this size",
      "Immediately apply a -100% mobile bid adjustment",
      "Increase mobile bids to try to force more mobile conversions",
    ],
    correctAnswers: [1],
    explanation:
      "A large device gap is very often a landing-page or UX symptom rather than a targeting problem. Diagnosing first avoids throwing away volume that could convert once the real bottleneck is fixed.",
    evaluationCriteria: [],
  },
  {
    mechanic: "single",
    topic: "Landing Pages",
    difficulty: "Medium",
    question:
      'An ad promises "20% off all orders," but the landing page it points to shows no visible discount and requires several clicks to find pricing. What is this most likely to hurt first?',
    options: [
      "Impression share, because mismatched pages reduce impressions",
      "Landing page experience (a Quality Score component) and conversion rate, since the page fails to deliver on the ad's promise",
      "Nothing measurable - landing page content doesn't factor into Google Ads performance",
      "Only brand safety, not any performance metric",
    ],
    correctAnswers: [1],
    explanation:
      "Ad-to-landing-page message match is a direct landing page experience component of Quality Score and a direct conversion-rate driver - a broken promise costs both.",
    evaluationCriteria: [],
  },
  {
    mechanic: "single",
    topic: "Bidding Strategies",
    difficulty: "Hard",
    question:
      "A lead-gen account has run Manual CPC for years with flat but steady performance and healthy historical conversion volume (500+/month). The client wants to scale volume without significantly increasing CPA. Which is the most defensible next step to test?",
    options: [
      "Switch straight to Target Impression Share, since it's built for visibility",
      "Switch to Maximize Clicks, since more clicks means more chances to convert",
      "Test Target CPA or Maximize Conversions with a CPA target, since the account has enough conversion volume for Smart Bidding to learn from and both strategies are built around cost-controlled scale",
      "Keep Manual CPC indefinitely, since automated bidding is never appropriate for lead-gen",
    ],
    correctAnswers: [2],
    explanation:
      "Smart Bidding needs sufficient conversion volume to learn well, and this account clears that bar. Target CPA / Maximize Conversions directly match the stated goal, unlike Impression Share (a visibility metric, not a cost/volume one) or Maximize Clicks (optimizes for the wrong outcome).",
    evaluationCriteria: [],
  },
  {
    mechanic: "single",
    topic: "Campaign Diagnosis",
    difficulty: "Hard",
    question:
      "A Search campaign's impressions drop roughly 70% overnight with no recent bid, budget, or targeting changes made by the team. What should be investigated first?",
    options: [
      "Immediately double the budget to compensate",
      "Check for a payment failure or a policy disapproval affecting the account or campaign - sudden drop-offs with no configuration changes are very often account-health issues rather than performance issues",
      "Assume seasonality and wait a week before doing anything",
      "Rewrite all ad copy, since creative fatigue is the most common cause of sudden drops",
    ],
    correctAnswers: [1],
    explanation:
      "A sharp, sudden drop with no known changes points first at account-health causes (billing holds, policy disapprovals) - these are common and fast to rule out, and waiting a week would just waste time if that's the cause.",
    evaluationCriteria: [],
  },
  {
    mechanic: "single",
    topic: "Auction Insights",
    difficulty: "Hard",
    question:
      'In Auction Insights, a competitor shows a 95% overlap rate with your campaign but a much lower "top of page rate" than you. What does this combination most likely indicate?',
    options: [
      "The competitor is outbidding you in nearly every auction",
      "The competitor is entering almost every auction you do, but losing position - likely a weaker Quality Score, ad relevance, or bid relative to yours",
      "Auction Insights data is unreliable and should be ignored",
      "The competitor has a larger overall budget than you",
    ],
    correctAnswers: [1],
    explanation:
      'High overlap plus low top-of-page rate specifically describes "shows up often, ranks poorly" - a signature of Ad Rank weakness, not necessarily outspending. Auction Insights doesn\'t report competitor budget directly.',
    evaluationCriteria: [],
  },
];
