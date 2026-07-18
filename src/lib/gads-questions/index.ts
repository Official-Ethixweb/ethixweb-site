import { randomInt } from "node:crypto";
import { GADS_QUESTION_COUNTS, GADS_TOTAL_QUESTIONS, type GadsQuestion } from "@/lib/gads-types";
import type { AuthoredGadsQuestion } from "./shared";
import { SINGLE_QUESTIONS } from "./single";
import { MULTIPLE_QUESTIONS } from "./multiple";
import { SCENARIO_QUESTIONS } from "./scenario";
import { WRITTEN_QUESTIONS } from "./written";

// The one fixed 40-question exam. Not a reusable pool - every one of these
// is used on every attempt (there is only ever one attempt). Question order
// and option order are shuffled fresh each time buildGadsExam() runs (once,
// when the single candidate clicks "Begin") so the correct answer position
// is never predictable, even though the underlying content is fixed.

const ALL_QUESTIONS: AuthoredGadsQuestion[] = [
  ...SINGLE_QUESTIONS,
  ...MULTIPLE_QUESTIONS,
  ...SCENARIO_QUESTIONS,
  ...WRITTEN_QUESTIONS,
];

// Self-check at module load, not request time - the data is static, so a
// structural mistake should fail the build/boot, not a candidate's exam.
function validate() {
  if (ALL_QUESTIONS.length !== GADS_TOTAL_QUESTIONS) {
    throw new Error(
      `gads-questions: expected ${GADS_TOTAL_QUESTIONS} questions total, found ${ALL_QUESTIONS.length}`,
    );
  }

  const counts: Record<string, number> = {};
  for (const q of ALL_QUESTIONS) counts[q.mechanic] = (counts[q.mechanic] ?? 0) + 1;
  for (const [mechanic, expected] of Object.entries(GADS_QUESTION_COUNTS)) {
    const got = counts[mechanic] ?? 0;
    if (got !== expected) {
      throw new Error(
        `gads-questions: expected exactly ${expected} "${mechanic}" questions, found ${got}`,
      );
    }
  }

  for (const q of ALL_QUESTIONS) {
    const label = `"${q.question.slice(0, 50)}..." (${q.mechanic}/${q.topic})`;
    if (q.mechanic === "written") {
      if (q.options.length !== 0 || q.correctAnswers.length !== 0) {
        throw new Error(`gads-questions: ${label} is written but has options/correctAnswers`);
      }
      if (q.evaluationCriteria.length < 3) {
        throw new Error(`gads-questions: ${label} needs at least 3 evaluationCriteria`);
      }
      continue;
    }
    const minOptions = q.mechanic === "multiple" ? 4 : 3;
    if (q.options.length < minOptions) {
      throw new Error(`gads-questions: ${label} needs at least ${minOptions} options`);
    }
    const inRange = q.correctAnswers.every((i) => i >= 0 && i < q.options.length);
    if (!inRange)
      throw new Error(`gads-questions: ${label} has an out-of-range correctAnswers index`);
    if (new Set(q.correctAnswers).size !== q.correctAnswers.length) {
      throw new Error(`gads-questions: ${label} has duplicate correctAnswers indices`);
    }
    if (q.mechanic === "multiple") {
      if (q.correctAnswers.length < 2 || q.correctAnswers.length > 4) {
        throw new Error(`gads-questions: ${label} (multiple) needs 2-4 correct answers`);
      }
      if (q.correctAnswers.length >= q.options.length) {
        throw new Error(`gads-questions: ${label} (multiple) marks every option correct`);
      }
    } else if (q.correctAnswers.length !== 1) {
      throw new Error(`gads-questions: ${label} (${q.mechanic}) needs exactly 1 correct answer`);
    }
  }
}
validate();

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Shuffles a question's option order and remaps correctAnswers to follow. */
function shuffleOptions(
  q: AuthoredGadsQuestion,
): Pick<AuthoredGadsQuestion, "options" | "correctAnswers"> {
  if (q.options.length === 0) return { options: [], correctAnswers: [] };
  const order = shuffle(q.options.map((_, i) => i));
  const options = order.map((oldIndex) => q.options[oldIndex]);
  const correctAnswers = q.correctAnswers
    .map((oldIndex) => order.indexOf(oldIndex))
    .sort((a, b) => a - b);
  return { options, correctAnswers };
}

/**
 * Assembles the one candidate's exam: question order AND each question's
 * option order shuffled fresh, then sequential ids assigned. Returns the
 * FULL questions including the answer key - the caller stores these
 * server-side and must send only sanitizeGadsQuestion() output to the
 * browser.
 */
export function buildGadsExam(): GadsQuestion[] {
  const shuffled = shuffle(ALL_QUESTIONS);
  return shuffled.map((q, index): GadsQuestion => {
    const { options, correctAnswers } = shuffleOptions(q);
    return { ...q, id: index + 1, options, correctAnswers };
  });
}
