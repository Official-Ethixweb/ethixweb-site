import {
  type AnswerMap,
  type AnswerValue,
  type AssessmentQuestion,
  type AssessmentScores,
  type PerQuestionResult,
  type QuestionOutcome,
  type SectionScore,
} from "./assessment-types";

// Fully deterministic scoring against the server-held answer key - no AI in
// the loop, so a score can always be explained and re-derived. Paragraph
// answers get an indicative heuristic score (length compliance + coverage of
// the generation-time evaluation criteria) and are ALWAYS flagged for human
// review in the HR report; the heuristic exists to rank, not to decide.

const DIFFICULTY_POINTS = { Easy: 1, Medium: 2, Hard: 3 } as const;

// Overall = weighted blend of section percentages. Sections with no scoreable
// questions are dropped and the remaining weights renormalized.
const SECTION_WEIGHTS = {
  technical: 0.5,
  logic: 0.2,
  communication: 0.15,
  personality: 0.15,
} as const;

type SectionKey = keyof typeof SECTION_WEIGHTS;

function sectionOf(q: AssessmentQuestion): SectionKey | null {
  switch (q.type) {
    case "single":
    case "multiple":
      return "technical";
    case "logical":
    case "aptitude":
      return "logic";
    case "paragraph":
      return "communication";
    case "personality":
    case "situational":
      return "personality";
    case "fun":
      return null;
  }
}

function asIndex(value: AnswerValue | undefined): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : null;
}

function asIndices(value: AnswerValue | undefined): number[] | null {
  if (!Array.isArray(value)) return null;
  const cleaned = value.filter((v) => typeof v === "number" && Number.isInteger(v) && v >= 0);
  return cleaned.length === value.length ? [...new Set(cleaned)] : null;
}

function asText(value: AnswerValue | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

export function wordCount(text: string): number {
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

/** How fully the answer's length lands in the required 100-300 word band. */
function lengthFactor(words: number): number {
  if (words === 0) return 0;
  if (words < 30) return 0.1;
  if (words < 60) return 0.3;
  if (words < 100) return 0.6;
  if (words <= 300) return 1;
  if (words <= 450) return 0.9; // over-long but substantive
  return 0.7; // rambling
}

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "have",
  "will",
  "would",
  "should",
  "could",
  "then",
  "them",
  "they",
  "when",
  "what",
  "which",
  "your",
  "into",
  "over",
  "each",
  "also",
  "been",
  "were",
  "does",
  "how",
  "why",
  "are",
  "was",
  "not",
  "you",
  "can",
  "use",
  "using",
  "any",
  "all",
  "its",
  "our",
  "such",
  "than",
  "these",
  "those",
  "there",
  "their",
  "about",
  "after",
  "before",
  "between",
  "while",
  "where",
  "who",
  "whom",
]);

function significantTerms(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter((t) => t.length > 3 && !STOP_WORDS.has(t));
}

/** A criterion counts as covered when enough of its significant terms show up
 * in the answer. Crude on purpose - it's an ordering signal for HR, and the
 * full answer text ships alongside it in the report. */
function criteriaCoverage(answer: string, criteria: string[]): number {
  if (criteria.length === 0) return 0;
  const answerTerms = new Set(significantTerms(answer));
  let covered = 0;
  for (const criterion of criteria) {
    const terms = significantTerms(criterion);
    if (terms.length === 0) continue;
    const hits = terms.filter((t) => answerTerms.has(t)).length;
    if (hits / terms.length >= 0.34) covered += 1;
  }
  return covered / criteria.length;
}

function scoreQuestion(
  q: AssessmentQuestion,
  value: AnswerValue | undefined,
): { earned: number; max: number; outcome: QuestionOutcome } {
  const max = DIFFICULTY_POINTS[q.difficulty];

  if (q.type === "fun") {
    return { earned: 0, max: 0, outcome: "info" };
  }

  if (q.type === "paragraph") {
    const text = asText(value);
    if (!text) return { earned: 0, max, outcome: "unanswered" };
    const factor =
      0.4 * lengthFactor(wordCount(text)) + 0.6 * criteriaCoverage(text, q.evaluationCriteria);
    return { earned: round2(max * factor), max, outcome: "review" };
  }

  if (q.type === "multiple") {
    const picked = asIndices(value);
    if (!picked || picked.length === 0) return { earned: 0, max, outcome: "unanswered" };
    const correct = new Set(q.correctAnswers);
    const hits = picked.filter((i) => correct.has(i)).length;
    const misses = picked.length - hits;
    // Standard partial credit: right selections minus wrong ones, floored at
    // zero, over the number of right answers - guess-everything scores 0.
    const ratio = Math.max(0, hits - misses) / correct.size;
    const earned = round2(max * ratio);
    const outcome: QuestionOutcome = ratio >= 1 ? "correct" : ratio > 0 ? "partial" : "incorrect";
    return { earned, max, outcome };
  }

  // single / logical / aptitude / personality / situational
  const picked = asIndex(value);
  if (picked === null) return { earned: 0, max, outcome: "unanswered" };
  const correct = picked === q.correctAnswers[0];
  return { earned: correct ? max : 0, max, outcome: correct ? "correct" : "incorrect" };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export interface ScoringResult {
  scores: AssessmentScores;
  perQuestion: PerQuestionResult[];
}

export function scoreAssessment(
  questions: AssessmentQuestion[],
  answers: AnswerMap,
): ScoringResult {
  const sections: Record<SectionKey, { earned: number; max: number }> = {
    technical: { earned: 0, max: 0 },
    logic: { earned: 0, max: 0 },
    communication: { earned: 0, max: 0 },
    personality: { earned: 0, max: 0 },
  };

  const perQuestion: PerQuestionResult[] = questions.map((q) => {
    const { earned, max, outcome } = scoreQuestion(q, answers[String(q.id)]);
    const section = sectionOf(q);
    if (section) {
      sections[section].earned += earned;
      sections[section].max += max;
    }
    return {
      questionId: q.id,
      type: q.type,
      topic: q.topic,
      difficulty: q.difficulty,
      earned,
      max,
      outcome,
    };
  });

  const toSection = (key: SectionKey): SectionScore => {
    const { earned, max } = sections[key];
    return {
      earned: round2(earned),
      max,
      percent: max > 0 ? Math.round((earned / max) * 100) : null,
    };
  };

  const scored = {
    technical: toSection("technical"),
    logic: toSection("logic"),
    communication: toSection("communication"),
    personality: toSection("personality"),
  };

  let weightSum = 0;
  let weighted = 0;
  for (const key of Object.keys(SECTION_WEIGHTS) as SectionKey[]) {
    const pct = scored[key].percent;
    if (pct !== null) {
      weighted += pct * SECTION_WEIGHTS[key];
      weightSum += SECTION_WEIGHTS[key];
    }
  }

  return {
    scores: { ...scored, overallPercent: weightSum > 0 ? Math.round(weighted / weightSum) : 0 },
    perQuestion,
  };
}
