import { getSupabase } from "./supabase";
import { scoreAssessment } from "./assessment-scoring";
import { sendAssessmentReport } from "./assessment-report";
import {
  EXAM_GRACE_SECONDS,
  type AnswerMap,
  type AssessmentRow,
  type SubmitReason,
  type Violation,
} from "./assessment-types";

// Shared finalization used by explicit submits AND by lazy expiry (an
// abandoned in_progress exam gets scored from its auto-saved answers the next
// time anything touches it - no cron needed). The status='in_progress' guard
// on the claim makes finalization exactly-once under concurrent calls.

export function isPastGrace(row: Pick<AssessmentRow, "expires_at">): boolean {
  return Date.now() > new Date(row.expires_at).getTime() + EXAM_GRACE_SECONDS * 1000;
}

export interface FinalizeInput {
  row: AssessmentRow;
  reason: SubmitReason;
  /** Final client payload; ignored (stored answers win) when past grace. */
  answers?: AnswerMap;
  violations?: Violation[];
}

export type FinalizeResult = { ok: true } | { ok: false; alreadyDone: true };

export async function finalizeAssessment({
  row,
  reason,
  answers,
  violations,
}: FinalizeInput): Promise<FinalizeResult> {
  const supabase = getSupabase();
  const submittedAt = new Date();

  // Past the grace window the client payload is untrusted extra time - score
  // only what was auto-saved before expiry.
  const pastGrace = isPastGrace(row);
  const finalAnswers = !pastGrace && answers ? answers : row.answers;
  const finalViolations = !pastGrace && violations ? violations : row.violations;
  const effectiveReason: SubmitReason = pastGrace ? "auto_expired" : reason;

  // Atomic claim: exactly one caller moves in_progress -> submitted; everyone
  // else sees zero rows and bails before scoring or emailing.
  const { data: claimed, error: claimError } = await supabase
    .from("assessments")
    .update({
      status: "submitted",
      answers: finalAnswers,
      violations: finalViolations,
      submit_reason: effectiveReason,
      submitted_at: submittedAt.toISOString(),
    })
    .eq("id", row.id)
    .eq("status", "in_progress")
    .select("id")
    .maybeSingle();

  if (claimError) {
    console.error("[assessment] finalize claim error:", claimError);
    throw new Error("Could not save the submission");
  }
  if (!claimed) return { ok: false, alreadyDone: true };

  const { scores, perQuestion } = scoreAssessment(row.questions, finalAnswers);

  const startedMs = new Date(row.started_at).getTime();
  const cappedEnd = Math.min(submittedAt.getTime(), new Date(row.expires_at).getTime());
  const timeTakenSeconds = Math.max(0, Math.round((cappedEnd - startedMs) / 1000));

  const { error: scoreError } = await supabase
    .from("assessments")
    .update({
      status: "scored",
      scores,
      per_question: perQuestion,
      overall_percent: scores.overallPercent,
      time_taken_seconds: timeTakenSeconds,
    })
    .eq("id", row.id);

  if (scoreError) {
    // Answers are safely stored (status 'submitted'); scoring can be re-run
    // from the row by hand. Don't fail the candidate's submit over it.
    console.error("[assessment] score persist error (answers are saved):", scoreError);
  }

  await sendAssessmentReport(
    { ...row, answers: finalAnswers, violations: finalViolations },
    scores,
    perQuestion,
    effectiveReason,
    timeTakenSeconds,
  );

  return { ok: true };
}

/** Loads a row and, when its exam window has lapsed while still in_progress,
 * finalizes it on the spot. Returns the fresh row afterwards. */
export async function loadAssessment(id: string): Promise<AssessmentRow | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("id", id)
    .maybeSingle<AssessmentRow>();
  if (error) {
    console.error("[assessment] load error:", error);
    return null;
  }
  if (!data) return null;

  if (data.status === "in_progress" && isPastGrace(data)) {
    try {
      await finalizeAssessment({ row: data, reason: "auto_expired" });
    } catch (err) {
      console.error("[assessment] lazy expiry finalize failed:", err);
    }
    const { data: fresh } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", id)
      .maybeSingle<AssessmentRow>();
    return fresh ?? data;
  }
  return data;
}
