import type { AuthoredGadsQuestion } from "@/lib/gads/questions/shared";

// 16 scenario-based questions (60s each), single-correct with a richer
// stem. Carries the spec's "scenario / strategy / budget & bidding /
// keyword intent / search term analysis / campaign optimization /
// performance analysis" content flavors - all tagged via `topic` rather
// than a separate taxonomy, since they're scored as one section either way.
// 3 Easy / 8 Medium / 5 Hard.

export const SCENARIO_QUESTIONS: AuthoredGadsQuestion[] = [
  {
    mechanic: "scenario",
    topic: "Display",
    difficulty: "Easy",
    question:
      "You're briefed to run a Display campaign whose only goal is building top-of-funnel brand awareness for a new product launch, with no immediate conversion goal defined yet. Which bidding approach best fits that brief?",
    options: [
      "Target CPA, since Display should always chase conversions",
      "Maximize Conversions",
      "A reach/impression-focused approach such as Viewable CPM, since the stated goal is visibility, not direct response",
      "Target ROAS",
    ],
    correctAnswers: [2],
    explanation:
      "When the brief is awareness/reach rather than direct response, a CPM or reach-oriented approach matches the objective; conversion-based Smart Bidding optimizes for a goal that doesn't exist yet here.",
    evaluationCriteria: [],
  },
  {
    mechanic: "scenario",
    topic: "Remarketing",
    difficulty: "Easy",
    question:
      "An ecommerce client has cart-abandoners who added items but never purchased. Which remarketing approach is the most directly relevant next step to recover that specific segment?",
    options: [
      'A generic Display remarketing list of "all website visitors" with no segmentation',
      "A dedicated remarketing list built specifically from cart-abandonment behavior, with messaging tailored to completing the purchase",
      "A Search campaign targeting brand-new, cold keywords unrelated to the brand",
      "Suppressing all past visitors from ever seeing ads again",
    ],
    correctAnswers: [1],
    explanation:
      "Segment-specific remarketing built around the actual abandonment behavior outperforms a broad, undifferentiated list because the messaging can speak directly to what's stopping the purchase.",
    evaluationCriteria: [],
  },
  {
    mechanic: "scenario",
    topic: "GA4 Integration",
    difficulty: "Easy",
    question:
      "A client wants Google Ads to optimize toward the conversions they already track accurately in GA4, without rebuilding tracking from scratch inside Google Ads. What's the appropriate approach?",
    options: [
      "Manually re-enter GA4 numbers into a spreadsheet on a weekly basis",
      "Link the GA4 property to the Google Ads account and import the relevant GA4 conversion events as Google Ads conversion actions",
      "This isn't possible - GA4 and Google Ads conversions are always fully separate",
      "Delete GA4 tracking and rebuild everything using only a Google Ads tag",
    ],
    correctAnswers: [1],
    explanation:
      "The GA4-to-Google-Ads link plus conversion import is the standard, supported path for exactly this situation - there's no need to rebuild tracking that already works.",
    evaluationCriteria: [],
  },
  {
    mechanic: "scenario",
    topic: "Campaign Diagnosis",
    difficulty: "Medium",
    question:
      'A client calls in a panic: "Our cost per lead doubled this week." Before proposing any fix, which of these is the most useful first diagnostic step?',
    options: [
      'Immediately pause the campaign to "stop the bleeding"',
      "Segment the change by device, location, ad group, and time of day to isolate where the increase is actually coming from, rather than reacting to the account-level average",
      "Tell the client CPA fluctuations are normal and nothing can be done",
      "Increase the budget to try to average out the cost",
    ],
    correctAnswers: [1],
    explanation:
      "An account-level average can hide a localized problem. Segmenting first turns a vague complaint into an actionable root cause instead of guessing.",
    evaluationCriteria: [],
  },
  {
    mechanic: "scenario",
    topic: "Search Terms",
    difficulty: "Medium",
    question:
      "You inherit an account where the Search Terms report shows heavy spend on branded competitor names with poor conversion rates, and the client has never discussed competitor conquesting as a strategy. What's the most appropriate move?",
    options: [
      "Leave it running, since any traffic is good traffic",
      "Raise this explicitly with the client as a strategic decision - continue deliberately, or exclude it - rather than silently changing it, since conquesting is a real strategic choice with trade-offs the client should weigh in on",
      "Silently add every competitor name as a negative without telling the client",
      "Increase bids on those terms to try to improve the poor conversion rate",
    ],
    correctAnswers: [1],
    explanation:
      "This is a strategy question, not just an optimization one. A good account manager surfaces the finding and the trade-off rather than unilaterally deciding a real budget allocation choice.",
    evaluationCriteria: [],
  },
  {
    mechanic: "scenario",
    topic: "ROAS",
    difficulty: "Medium",
    question:
      "A campaign shows a 6x ROAS, but checking Attribution settings reveals it's using first-click attribution while every other campaign in the account uses data-driven attribution. What should you do before reporting this 6x figure as a win to the client?",
    options: [
      "Report it as-is - ROAS is ROAS regardless of attribution model",
      "Reconcile the attribution model so this campaign is compared on the same basis as the rest of the account, since first-click can meaningfully overstate or understate a campaign's true contribution relative to data-driven",
      "Switch every other campaign to first-click to match this one, since first-click produced the better number",
      "Ignore attribution entirely and only look at raw conversion counts",
    ],
    correctAnswers: [1],
    explanation:
      "Comparing ROAS across campaigns on different attribution models isn't apples-to-apples. The honest move is aligning the model before drawing a conclusion, not cherry-picking whichever model looks best.",
    evaluationCriteria: [],
  },
  {
    mechanic: "scenario",
    topic: "CPA",
    difficulty: "Medium",
    question:
      "Two lead-gen campaigns have the same CPA, but one sends leads the sales team closes at 3x the rate of the other. How should this change how you evaluate and optimize the two campaigns?",
    options: [
      "It shouldn't - CPA is the only metric that matters for lead-gen",
      "Treat them as equally successful and apply an identical bidding strategy to both",
      "Weight optimization toward lead quality or close rate - for example importing offline conversion data or a value-based signal - rather than raw CPA alone, since equal cost-per-lead is hiding a large difference in actual business value",
      "Pause the lower-close-rate campaign immediately with no further investigation",
    ],
    correctAnswers: [2],
    explanation:
      "Equal CPA with unequal downstream value is a classic sign that optimizing on lead volume alone is the wrong objective - feeding close-rate or value data back into bidding lets it optimize toward business outcomes.",
    evaluationCriteria: [],
  },
  {
    mechanic: "scenario",
    topic: "Impression Share",
    difficulty: "Medium",
    question:
      'A high-priority campaign shows 40% Search Impression Share, with most of the loss attributed to "Lost IS (budget)" rather than "Lost IS (rank)." The client says increasing budget isn\'t an option this quarter. What\'s the most realistic lever left to pull?',
    options: [
      "Nothing can be done without more budget",
      "Improve efficiency to make the existing budget stretch further, and/or narrow targeting to the highest-value segments, since rank isn't the bottleneck here and budget is fixed",
      "Switch to Maximize Clicks to capture more impression share",
      "Add more keywords to increase impression share",
    ],
    correctAnswers: [1],
    explanation:
      "When the loss is specifically budget-driven rather than rank-driven, the lever is stretching the fixed budget further, not adding keywords or chasing Ad Rank improvements that target the wrong bottleneck.",
    evaluationCriteria: [],
  },
  {
    mechanic: "scenario",
    topic: "Bidding Strategies",
    difficulty: "Medium",
    question:
      "A newly launched campaign has only 8 conversions in its first two weeks and was set to Target CPA from day one. Performance is erratic and CPA swings wildly week to week. What's the most likely explanation?",
    options: [
      "Target CPA never works for new campaigns under any circumstances",
      "The campaign simply has bad keywords",
      "The Smart Bidding algorithm likely doesn't have enough conversion volume yet to have exited the learning phase, making its bidding decisions unstable",
      "The target CPA value was definitely set too high",
    ],
    correctAnswers: [2],
    explanation:
      "Smart Bidding needs a meaningful volume of recent conversions to learn reliably. Erratic early performance on thin data is the signature of an under-fed algorithm, not necessarily a targeting or bid-value mistake.",
    evaluationCriteria: [],
  },
  {
    mechanic: "scenario",
    topic: "Negative Keywords",
    difficulty: "Medium",
    question:
      "You manage Search and Shopping campaigns for the same client selling the same products, both active simultaneously. Both campaign types keep bidding on and winning the same high-value search queries, driving up cost without added benefit. What's the most appropriate structural fix?",
    options: [
      "Pause one of the two campaign types entirely",
      "Use negative keywords - for example on the Shopping campaign - to prevent overlap on queries where you've decided one campaign type should own the auction, based on which performs better for that query type",
      "Nothing needs to change - competing with yourself has no real cost",
      "Lower bids on both campaigns equally",
    ],
    correctAnswers: [1],
    explanation:
      "This is the standard Search/Shopping overlap problem. Negatives let you deliberately assign ownership of a query to whichever campaign type performs best there, instead of the two silently cannibalizing each other.",
    evaluationCriteria: [],
  },
  {
    mechanic: "scenario",
    topic: "Audience Signals",
    difficulty: "Medium",
    question:
      "For a new Performance Max campaign with no historical conversion data of its own, what is the best use of Audience Signals?",
    options: [
      "Skip them entirely, since Performance Max ignores audience signals",
      "Provide your best available first-party and market/interest signals as a starting point to help the algorithm ramp up faster - understanding they're a hint, not a hard restriction",
      "Add every available audience segment to maximize reach regardless of relevance",
      "Audience signals should only ever be added after 6 months of live data",
    ],
    correctAnswers: [1],
    explanation:
      "Audience signals exist precisely to give the algorithm a head start when historical data is thin. Treating them as a considered hint rather than skipping them or dumping in everything is the practical, correct use.",
    evaluationCriteria: [],
  },
  {
    mechanic: "scenario",
    topic: "Auction Insights",
    difficulty: "Hard",
    question:
      "A specific competitor's overlap rate with your campaign jumps from 10% to 70% in the last month, and your average position drops despite no bid changes on your side. What's the most likely story here, and the most appropriate response?",
    options: [
      "Google Ads made a mistake; file a support ticket and wait",
      "The competitor has meaningfully increased their presence in this auction - investigate whether your bid and Quality Score are still competitive against the new landscape, rather than assuming your own setup broke",
      "Immediately copy their exact ad copy",
      "This kind of shift is unrelated to Auction Insights and should be ignored",
    ],
    correctAnswers: [1],
    explanation:
      "A sharp overlap-rate jump with no change on your end is a strong signal the competitive landscape itself shifted. The right response is re-evaluating your own competitiveness against that new landscape.",
    evaluationCriteria: [],
  },
  {
    mechanic: "scenario",
    topic: "Conversion Tracking",
    difficulty: "Hard",
    question:
      "A client's ecommerce site migrated to a new checkout platform two weeks ago. Conversions in Google Ads dropped to near zero immediately after, while the client insists actual sales - checked via their order system - haven't dropped. What should you check first?",
    options: [
      "Assume the ads simply stopped working and pause everything",
      "Verify the conversion tag still fires correctly on the new checkout/thank-you page - a platform migration is one of the most common causes of tags silently breaking",
      "Increase bids to try to force more reported conversions",
      "Switch the entire account to a different bidding strategy",
    ],
    correctAnswers: [1],
    explanation:
      "Real sales continuing while tracked conversions collapse right after a site migration is the textbook signature of a broken tag, not an actual performance problem - checking the tag is the correct first move.",
    evaluationCriteria: [],
  },
  {
    mechanic: "scenario",
    topic: "Ad Rank",
    difficulty: "Hard",
    question:
      'A campaign has excellent Quality Scores (mostly 9-10) across its keywords, yet impression share and position remain poor even after a meaningful bid increase, and budget is confirmed sufficient (no "Limited by budget" status). What\'s the most likely remaining explanation worth investigating?',
    options: [
      "Quality Score doesn't actually matter, so this outcome is expected",
      "Ad Rank thresholds, ad relevance or format eligibility (for example few assets showing, weak ad strength), or a genuinely much stronger competitor set could still be holding position down even with good Quality Score and adequate bid/budget",
      "This situation is impossible and indicates a reporting bug",
      "The only fix is to keep raising bids indefinitely",
    ],
    correctAnswers: [1],
    explanation:
      "Good Quality Score and sufficient budget rule out the two most common culprits, but Ad Rank has more inputs - a senior diagnosis keeps investigating rather than concluding it's unsolvable or throwing more bid at it blindly.",
    evaluationCriteria: [],
  },
  {
    mechanic: "scenario",
    topic: "ROAS",
    difficulty: "Hard",
    question:
      "A Target ROAS campaign is hitting its target beautifully, but overall revenue has been flat or declining for two months. The client is confused why \"good ROAS\" isn't translating to growth. What's the most likely explanation?",
    options: [
      "ROAS and revenue always move together, so this shouldn't be possible",
      "The ROAS target may be set too conservatively (too high), causing the algorithm to bid down and sacrifice volume/impression share to protect the ratio - a lower target could unlock more revenue at a still-acceptable ROAS",
      "The client's product must be declining in quality",
      "This is purely seasonal and requires no action",
    ],
    correctAnswers: [1],
    explanation:
      'A target ROAS set too aggressively optimizes for the ratio at the expense of scale. "Great ROAS, flat revenue" is a classic sign the target is choking volume, and testing a slightly lower target is the standard response.',
    evaluationCriteria: [],
  },
  {
    mechanic: "scenario",
    topic: "Impression Share",
    difficulty: "Hard",
    question:
      "A Search campaign has 95% Impression Share and Quality Scores of 9-10 on its core keywords, but the client wants meaningfully more conversion volume from Search specifically this quarter. Given the campaign is already near its ceiling on both IS and Quality Score, what's the most defensible strategic recommendation?",
    options: [
      "Keep raising bids indefinitely, since there's always more room at 95% impression share",
      "Since this campaign is close to saturated on both impression share and quality, look at expanding reach within Search itself - closely related keyword themes, under-tapped match type coverage, or new ad groups for adjacent search intent - rather than squeezing an already near-maxed campaign further",
      "Tell the client 95% impression share means nothing more can be done this quarter",
      'Move the entire budget to Display, since Search is "done"',
    ],
    correctAnswers: [1],
    explanation:
      "A near-saturated campaign has little headroom left in itself. Real incremental Search volume at this point usually comes from expanding coverage rather than bidding harder on an already-winning setup or abandoning Search altogether.",
    evaluationCriteria: [],
  },
];
