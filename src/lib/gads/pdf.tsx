import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import {
  GADS_RECOMMENDATION_LABELS,
  GADS_VIOLATION_LABELS,
  type GadsAssessmentRow,
  type GadsPerQuestionResult,
  type GadsRecommendation,
  type GadsScores,
} from "@/lib/gads/types";

// @react-pdf/renderer has its own styling system (StyleSheet.create), fully
// separate from Tailwind - styles.css tokens don't reach here, so the brand
// palette is re-declared as literal values so the PDF still reads as
// on-brand. Used both as the recruiter-email attachment and as a downloaded
// artifact if it's ever needed standalone.

const BRAND_RED = "#c0272d";
const INK = "#1a1a1a";
const MUTED = "#6b7280";
const BORDER = "#e5e5e5";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, color: INK, fontFamily: "Helvetica" },
  eyebrow: { fontSize: 9, color: BRAND_RED, fontWeight: 700, letterSpacing: 1.5, marginBottom: 4 },
  title: { fontSize: 18, fontWeight: 700, marginBottom: 2 },
  subtitle: { fontSize: 10, color: MUTED, marginBottom: 16 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginTop: 16,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingVertical: 5,
  },
  cell: { flex: 1 },
  label: {
    fontSize: 8,
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: { fontSize: 11, fontWeight: 700 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: BRAND_RED,
    color: "#ffffff",
    fontSize: 11,
    fontWeight: 700,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    paddingVertical: 4,
    paddingHorizontal: 4,
    fontSize: 8,
    fontWeight: 700,
    textTransform: "uppercase",
    color: MUTED,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 4,
    fontSize: 9,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  writtenBlock: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fafafa",
    borderRadius: 4,
  },
});

function formatDuration(seconds: number | null): string {
  if (seconds === null || !Number.isFinite(seconds)) return "Unknown";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

export async function buildGadsReportPdf(
  row: GadsAssessmentRow,
  scores: GadsScores,
  perQuestion: GadsPerQuestionResult[],
  recommendation: GadsRecommendation,
  suspiciousActivityScore: number,
  timeTakenSeconds: number | null,
): Promise<Buffer> {
  const violationCounts = new Map<string, number>();
  for (const v of row.violations)
    violationCounts.set(v.type, (violationCounts.get(v.type) ?? 0) + 1);

  const writtenQuestions = (row.questions ?? []).filter((q) => q.mechanic === "written");

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>GOOGLE ADS ASSESSMENT REPORT - ETHIXWEB</Text>
        <Text style={styles.title}>{row.candidate_name}</Text>
        <Text style={styles.subtitle}>{row.candidate_email}</Text>

        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.label}>Overall score</Text>
            <Text style={styles.value}>{scores.overallPercent}%</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Recommendation</Text>
            <Text style={styles.badge}>{GADS_RECOMMENDATION_LABELS[recommendation]}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Time taken</Text>
            <Text style={styles.value}>{formatDuration(timeTakenSeconds)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.label}>Submitted</Text>
            <Text style={styles.value}>
              {row.submitted_at ? new Date(row.submitted_at).toLocaleString("en-US") : "-"}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Submit reason</Text>
            <Text style={styles.value}>{row.submit_reason ?? "-"}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Suspicious activity score</Text>
            <Text style={styles.value}>{suspiciousActivityScore}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Section scores</Text>
        <View style={styles.tableHeader}>
          <Text style={{ flex: 2 }}>Section</Text>
          <Text style={{ flex: 1 }}>Points</Text>
          <Text style={{ flex: 1 }}>Percent</Text>
        </View>
        {(Object.keys(scores.bySection) as Array<keyof typeof scores.bySection>).map((mechanic) => {
          const s = scores.bySection[mechanic];
          return (
            <View style={styles.tableRow} key={mechanic}>
              <Text style={{ flex: 2, textTransform: "capitalize" }}>{mechanic}</Text>
              <Text style={{ flex: 1 }}>
                {s.earned}/{s.max}
              </Text>
              <Text style={{ flex: 1 }}>{s.percent === null ? "n/a" : `${s.percent}%`}</Text>
            </View>
          );
        })}

        <Text style={styles.sectionTitle}>Proctoring summary</Text>
        {row.violations.length === 0 ? (
          <Text>No violations recorded.</Text>
        ) : (
          Array.from(violationCounts.entries()).map(([type, count]) => (
            <View style={styles.tableRow} key={type}>
              <Text style={{ flex: 3 }}>
                {GADS_VIOLATION_LABELS[type as keyof typeof GADS_VIOLATION_LABELS] ?? type}
              </Text>
              <Text style={{ flex: 1 }}>{count}</Text>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Per-question breakdown</Text>
        <View style={styles.tableHeader}>
          <Text style={{ flex: 1 }}>#</Text>
          <Text style={{ flex: 2 }}>Topic</Text>
          <Text style={{ flex: 1 }}>Type</Text>
          <Text style={{ flex: 1 }}>Time</Text>
          <Text style={{ flex: 1 }}>Points</Text>
          <Text style={{ flex: 1 }}>Outcome</Text>
        </View>
        {perQuestion.map((q) => (
          <View style={styles.tableRow} key={q.questionId} wrap={false}>
            <Text style={{ flex: 1 }}>{q.questionId}</Text>
            <Text style={{ flex: 2 }}>{q.topic}</Text>
            <Text style={{ flex: 1, textTransform: "capitalize" }}>{q.mechanic}</Text>
            <Text style={{ flex: 1 }}>{q.elapsedSeconds}s</Text>
            <Text style={{ flex: 1 }}>{q.max > 0 ? `${q.earned}/${q.max}` : "-"}</Text>
            <Text style={{ flex: 1, textTransform: "capitalize" }}>
              {q.skipped ? "Skipped" : q.outcome}
            </Text>
          </View>
        ))}
      </Page>

      {writtenQuestions.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Written answers (full text)</Text>
          {writtenQuestions.map((q) => {
            const entry = row.answers[String(q.id)];
            const text = typeof entry?.value === "string" ? entry.value.trim() : "";
            return (
              <View style={styles.writtenBlock} key={q.id} wrap={false}>
                <Text style={{ fontSize: 8, color: BRAND_RED, fontWeight: 700, marginBottom: 4 }}>
                  Q{q.id} · {q.topic}
                </Text>
                <Text style={{ fontSize: 10, fontWeight: 700, marginBottom: 6 }}>{q.question}</Text>
                <Text style={{ fontSize: 10 }}>{text || "No answer submitted."}</Text>
              </View>
            );
          })}
        </Page>
      )}
    </Document>
  );

  return renderToBuffer(doc);
}
