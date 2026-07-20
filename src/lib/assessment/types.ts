// Shared types for the AI assessment platform. Everything the browser is
// allowed to see lives in the Candidate* types - the full AssessmentQuestion
// (with correctAnswers/explanation/evaluationCriteria) exists only server-side
// and in the database. sanitizeQuestion() is the single choke point between
// the two shapes, so the answer key can never leak through a new endpoint by
// accident.

export const EXAM_DURATION_MINUTES = 30;
export const TOTAL_QUESTIONS = 40;
/** Server-side slack past expires_at before answer saves/submits are refused -
 * covers network latency on the final auto-submit, not extra thinking time. */
export const EXAM_GRACE_SECONDS = 120;
/** Major (fullscreen/tab/blur/devtools) violations allowed before auto-submit:
 * warning 1, warning 2, final warning, then the next one submits. */
export const MAX_MAJOR_VIOLATIONS = 3;

export type AssessmentQuestionType =
  | "single"
  | "multiple"
  | "paragraph"
  | "logical"
  | "aptitude"
  | "personality"
  | "situational"
  | "fun";

export type AssessmentDifficulty = "Easy" | "Medium" | "Hard";

/** Full question as generated + stored. NEVER send this shape to the client. */
export interface AssessmentQuestion {
  id: number;
  type: AssessmentQuestionType;
  question: string;
  /** Verbatim code the question refers to; rendered in a monospace block. */
  codeSnippet: string | null;
  options: string[];
  /** Zero-based indices into options. Empty for paragraph/fun. */
  correctAnswers: number[];
  difficulty: AssessmentDifficulty;
  topic: string;
  explanation: string;
  /** Paragraph questions only: key points a strong answer covers. */
  evaluationCriteria: string[];
}

/** What the browser receives - no answer key, no explanations, no difficulty. */
export interface CandidateQuestion {
  id: number;
  type: AssessmentQuestionType;
  question: string;
  codeSnippet: string | null;
  options: string[];
  topic: string;
}

export function sanitizeQuestion(q: AssessmentQuestion): CandidateQuestion {
  return {
    id: q.id,
    type: q.type,
    question: q.question,
    codeSnippet: q.codeSnippet,
    options: q.options,
    topic: q.topic,
  };
}

/** single/logical/aptitude/personality/situational/fun -> option index;
 * multiple -> option indices; paragraph -> free text. */
export type AnswerValue = number | number[] | string;
/** Keyed by String(question.id). */
export type AnswerMap = Record<string, AnswerValue>;

export type ViolationType =
  | "fullscreen_exit"
  | "tab_hidden"
  | "window_blur"
  | "devtools_suspected"
  | "copy_attempt"
  | "paste_attempt"
  | "cut_attempt"
  | "context_menu"
  | "shortcut_blocked";

/** Violations that count toward the warning ladder / auto-submit. The rest
 * are logged and shown to HR but never end the exam on their own. */
export const MAJOR_VIOLATIONS: ReadonlySet<ViolationType> = new Set([
  "fullscreen_exit",
  "tab_hidden",
  "window_blur",
  "devtools_suspected",
]);

export interface Violation {
  type: ViolationType;
  /** ISO timestamp, client clock - indicative, not forensic. */
  at: string;
  detail?: string;
}

export const VIOLATION_LABELS: Record<ViolationType, string> = {
  fullscreen_exit: "Exited fullscreen",
  tab_hidden: "Switched tab / minimized window",
  window_blur: "Window lost focus",
  devtools_suspected: "Developer tools suspected",
  copy_attempt: "Copy attempt",
  paste_attempt: "Paste attempt",
  cut_attempt: "Cut attempt",
  context_menu: "Right-click attempt",
  shortcut_blocked: "Blocked keyboard shortcut",
};

export type QuestionOutcome =
  | "correct"
  | "partial"
  | "incorrect"
  | "unanswered"
  | "review" // paragraph - heuristic score, human review expected
  | "info"; // fun - never scored

export interface PerQuestionResult {
  questionId: number;
  type: AssessmentQuestionType;
  topic: string;
  difficulty: AssessmentDifficulty;
  earned: number;
  max: number;
  outcome: QuestionOutcome;
}

export interface SectionScore {
  earned: number;
  max: number;
  /** 0-100, or null when the section had no scoreable questions. */
  percent: number | null;
}

export interface AssessmentScores {
  technical: SectionScore;
  logic: SectionScore;
  /** Heuristic (length + criteria coverage) - flagged for human review. */
  communication: SectionScore;
  personality: SectionScore;
  /** Weighted 0-100 across the four sections. */
  overallPercent: number;
}

export type AssessmentStatus = "in_progress" | "submitted" | "scored" | "expired";

export type SubmitReason = "manual" | "timer" | "violations" | "auto_expired";

export interface AssessmentRow {
  id: string;
  role_id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string | null;
  resume_url: string | null;
  experience_years: string | null;
  session_token_hash: string;
  questions: AssessmentQuestion[];
  answers: AnswerMap;
  violations: Violation[];
  status: AssessmentStatus;
  scores: AssessmentScores | null;
  per_question: PerQuestionResult[] | null;
  overall_percent: number | null;
  time_taken_seconds: number | null;
  recording_urls: string[];
  submit_reason: SubmitReason | null;
  created_at: string;
  started_at: string;
  expires_at: string;
  submitted_at: string | null;
}
