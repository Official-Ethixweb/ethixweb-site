import { Resend } from "resend";
import { getJob } from "@/lib/careers-data";
import { escapeHtml, emailRow, emailShell, emailButton, FROM_EMAIL } from "@/lib/email";
import { wordCount } from "@/lib/assessment/scoring";
import {
  MAJOR_VIOLATIONS,
  VIOLATION_LABELS,
  type AssessmentRow,
  type AssessmentScores,
  type PerQuestionResult,
  type SubmitReason,
} from "@/lib/assessment/types";

// The candidate-facing UI only ever says "submitted" - this report, emailed
// to HR, is the single place scores, answers, violations, and recordings come
// together. Communication scores are labeled indicative: a human reads the
// paragraph answers (included in full below) before any decision.

const FALLBACK_HR_EMAIL = "info@ethixweb.com";

const REASON_LABELS: Record<SubmitReason, string> = {
  manual: "Submitted by candidate",
  timer: "Auto-submitted when the 30-minute timer expired",
  violations: "Auto-submitted after repeated proctoring violations",
  auto_expired: "Expired without an explicit submit - scored from auto-saved answers",
};

const OUTCOME_LABELS: Record<PerQuestionResult["outcome"], string> = {
  correct: "Correct",
  partial: "Partial",
  incorrect: "Incorrect",
  unanswered: "Unanswered",
  review: "Needs review",
  info: "Not scored",
};

const OUTCOME_COLORS: Record<PerQuestionResult["outcome"], string> = {
  correct: "#15803d",
  partial: "#b45309",
  incorrect: "#b91c1c",
  unanswered: "#6b7280",
  review: "#1d4ed8",
  info: "#6b7280",
};

function formatDuration(seconds: number | null): string {
  if (seconds === null || !Number.isFinite(seconds)) return "Unknown";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function scoreBar(label: string, percent: number | null, note?: string): string {
  const pct = percent ?? 0;
  const color = pct >= 70 ? "#15803d" : pct >= 45 ? "#b45309" : "#b91c1c";
  return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
        <div style="font-size:12px;font-weight:700;color:#1a1a1a;margin-bottom:4px;">
          ${escapeHtml(label)} - ${percent === null ? "n/a" : `${pct}%`}${note ? ` <span style="font-weight:400;color:#9aa0a6;">(${escapeHtml(note)})</span>` : ""}
        </div>
        <div style="background:#f0f0f0;border-radius:99px;height:8px;overflow:hidden;">
          <div style="background:${color};height:8px;width:${Math.max(2, Math.min(100, pct))}%;border-radius:99px;"></div>
        </div>
      </td>
    </tr>`;
}

export async function sendAssessmentReport(
  row: AssessmentRow,
  scores: AssessmentScores,
  perQuestion: PerQuestionResult[],
  reason: SubmitReason,
  timeTakenSeconds: number | null,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "[assessment-report] RESEND_API_KEY not configured - assessment was scored and saved " +
        `(id ${row.id}) but no HR report email was sent.`,
    );
    return;
  }
  const to = process.env.ASSESSMENT_HR_EMAIL || FALLBACK_HR_EMAIL;
  const job = getJob(row.role_id);
  const roleTitle = job?.title ?? row.role_id;

  const answered = perQuestion.filter((q) => q.outcome !== "unanswered").length;
  const majorViolations = row.violations.filter((v) => MAJOR_VIOLATIONS.has(v.type));
  const minorViolations = row.violations.filter((v) => !MAJOR_VIOLATIONS.has(v.type));

  const detailRows = [
    emailRow("Role", escapeHtml(roleTitle)),
    emailRow("Candidate", escapeHtml(row.candidate_name)),
    emailRow(
      "Email",
      `<a href="mailto:${escapeHtml(row.candidate_email)}">${escapeHtml(row.candidate_email)}</a>`,
    ),
    row.candidate_phone ? emailRow("Phone", escapeHtml(row.candidate_phone)) : "",
    row.experience_years ? emailRow("Experience", escapeHtml(row.experience_years)) : "",
    emailRow("Completion", escapeHtml(REASON_LABELS[reason])),
    emailRow("Time taken", `${escapeHtml(formatDuration(timeTakenSeconds))} of 30m 00s`),
    emailRow("Questions answered", `${answered} / ${perQuestion.length}`),
  ].join("");

  const scoresHtml = `
    <table role="presentation" width="100%" style="border-collapse:collapse;margin:8px 0 4px;">
      ${scoreBar("Overall", scores.overallPercent)}
      ${scoreBar("Technical", scores.technical.percent)}
      ${scoreBar("Logic & aptitude", scores.logic.percent)}
      ${scoreBar("Communication", scores.communication.percent, "indicative - read the written answers below")}
      ${scoreBar("Personality & judgement", scores.personality.percent)}
    </table>`;

  const questionRows = perQuestion
    .map(
      (q) =>
        `<tr>
          <td style="padding:5px 8px 5px 0;font-size:12px;color:#6b7280;white-space:nowrap;">Q${q.questionId}</td>
          <td style="padding:5px 8px 5px 0;font-size:12px;color:#1a1a1a;">${escapeHtml(q.topic)}</td>
          <td style="padding:5px 8px 5px 0;font-size:12px;color:#6b7280;white-space:nowrap;">${escapeHtml(q.type)} · ${escapeHtml(q.difficulty)}</td>
          <td style="padding:5px 8px 5px 0;font-size:12px;color:#1a1a1a;white-space:nowrap;">${q.max > 0 ? `${q.earned}/${q.max}` : "-"}</td>
          <td style="padding:5px 0;font-size:12px;font-weight:700;color:${OUTCOME_COLORS[q.outcome]};white-space:nowrap;">${OUTCOME_LABELS[q.outcome]}</td>
        </tr>`,
    )
    .join("");

  const writtenAnswers = row.questions
    .filter(
      (q) =>
        q.type === "paragraph" ||
        q.type === "personality" ||
        q.type === "situational" ||
        q.type === "fun",
    )
    .map((q) => {
      const value = row.answers[String(q.id)];
      let answerHtml: string;
      if (q.type === "paragraph") {
        const text = typeof value === "string" ? value.trim() : "";
        answerHtml = text
          ? `<div style="font-size:13px;color:#333;white-space:pre-wrap;">${escapeHtml(text)}</div>
             <div style="margin-top:6px;font-size:11px;color:#9aa0a6;">${wordCount(text)} words (100-300 required)</div>`
          : `<div style="font-size:13px;color:#b91c1c;">No answer submitted</div>`;
      } else {
        // Option-based answers arrive as an index; the open-ended fun
        // question arrives as free text.
        const picked = typeof value === "number" ? q.options[value] : undefined;
        const freeText = typeof value === "string" ? value.trim() : "";
        answerHtml = picked
          ? `<div style="font-size:13px;color:#333;">Chose: ${escapeHtml(picked)}</div>`
          : freeText
            ? `<div style="font-size:13px;color:#333;white-space:pre-wrap;">${escapeHtml(freeText)}</div>`
            : `<div style="font-size:13px;color:#b91c1c;">No answer submitted</div>`;
      }
      return `
        <div style="margin:0 0 14px;padding:12px 14px;background:#fafafa;border-radius:10px;">
          <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#c0272d;margin-bottom:4px;">
            Q${q.id} · ${escapeHtml(q.type)} · ${escapeHtml(q.topic)}
          </div>
          <div style="font-size:13px;font-weight:600;color:#1a1a1a;margin-bottom:8px;">${escapeHtml(q.question)}</div>
          ${answerHtml}
        </div>`;
    })
    .join("");

  const violationsHtml =
    row.violations.length === 0
      ? `<p style="margin:0;font-size:13px;color:#15803d;font-weight:600;">No violations recorded.</p>`
      : `<p style="margin:0 0 8px;font-size:13px;color:#333;">
           <strong>${majorViolations.length}</strong> major (fullscreen / tab / focus / devtools),
           <strong>${minorViolations.length}</strong> minor (copy / paste / right-click / shortcuts).
         </p>` +
        row.violations
          .slice(0, 40)
          .map(
            (v) =>
              `<div style="font-size:12px;color:#6b7280;padding:2px 0;">
                ${escapeHtml(new Date(v.at).toLocaleTimeString("en-US"))} - ${escapeHtml(VIOLATION_LABELS[v.type] ?? v.type)}${v.detail ? ` (${escapeHtml(v.detail)})` : ""}
              </div>`,
          )
          .join("") +
        (row.violations.length > 40
          ? `<div style="font-size:12px;color:#9aa0a6;">…and ${row.violations.length - 40} more (stored in the database).</div>`
          : "");

  const recordingsHtml = row.recording_urls.length
    ? row.recording_urls
        .map(
          (url, i) =>
            `<div style="margin:6px 0;">${emailButton(escapeHtml(url), row.recording_urls.length > 1 ? `View recording (part ${i + 1})` : "View recording")}</div>`,
        )
        .join("")
    : `<p style="margin:0;font-size:13px;color:#9aa0a6;">No recording was uploaded (upload may have failed or the browser closed before it finished).</p>`;

  const sectionTitle = (label: string) =>
    `<p style="margin:22px 0 8px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#1a1a1a;">${label}</p>`;

  const bodyHtml = `
    <p style="margin:0 0 8px;font-size:15px;line-height:1.5;color:#1a1a1a;">
      <strong>${escapeHtml(row.candidate_name)}</strong> completed the assessment for
      <strong>${escapeHtml(roleTitle)}</strong> - overall <strong>${scores.overallPercent}%</strong>.
    </p>
    <table role="presentation" width="100%" style="border-collapse:collapse;margin:12px 0;">${detailRows}</table>
    ${row.resume_url ? `<div style="margin:4px 0 8px;">${emailButton(escapeHtml(row.resume_url), "Download resume")}</div>` : ""}
    ${sectionTitle("Scores")}
    ${scoresHtml}
    ${sectionTitle("Written & behavioural answers")}
    ${writtenAnswers || `<p style="margin:0;font-size:13px;color:#9aa0a6;">None.</p>`}
    ${sectionTitle("Proctoring")}
    ${violationsHtml}
    ${sectionTitle("Recording")}
    ${recordingsHtml}
    ${sectionTitle("Per-question breakdown")}
    <table role="presentation" width="100%" style="border-collapse:collapse;">${questionRows}</table>`;

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: row.candidate_email,
      subject: `Assessment: ${row.candidate_name} - ${scores.overallPercent}% · ${roleTitle}`,
      html: emailShell({
        eyebrow: "Candidate assessment report",
        footerText:
          "Communication scores are indicative only - read the written answers before deciding. Full data is stored in Supabase (assessments table).",
        bodyHtml,
      }),
    });
    if (error) console.error("[assessment-report] Resend error:", error);
  } catch (err) {
    console.error("[assessment-report] Resend threw:", err);
  }
}
