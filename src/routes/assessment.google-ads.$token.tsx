import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { NameEmailGate } from "@/components/gads/NameEmailGate";
import { PermissionGate } from "@/components/gads/PermissionGate";
import { ExamRunner } from "@/components/gads/ExamRunner";
import { useMediaRecording } from "@/hooks/useMediaRecording";
import type { GadsAnswerMap, GadsAnswerValue, GadsCandidateQuestion } from "@/lib/gads/types";

// Standalone, single-candidate, single-use Google Ads assessment. No
// careers-page integration, no admin dashboard, no login - the URL's token
// is the only credential, and every state transition (pending -> in_progress
// -> submitted -> scored, or -> expired) is enforced server-side. This
// component is purely a phase-driven shell around that server state
// machine; see /api/gads/state and gads-service.ts for the source of truth.

export const Route = createFileRoute("/assessment/google-ads/$token")({
  head: () => ({
    meta: [{ title: "Google Ads Assessment - EthixWeb" }, { name: "robots", content: "noindex" }],
  }),
  component: GadsAssessmentPage,
});

type Phase = "loading" | "gate" | "permission" | "exam" | "done" | "expired" | "error";

interface ExamStartData {
  questions: GadsCandidateQuestion[];
  answers: GadsAnswerMap;
  draftAnswer: GadsAnswerValue | null;
  currentIndex: number;
  remainingQuestionSeconds?: number;
  expiresAt: string;
  serverNow: string;
}

function GadsAssessmentPage() {
  const { token } = Route.useParams();
  const [phase, setPhase] = useState<Phase>("loading");
  const [examData, setExamData] = useState<ExamStartData | null>(null);
  const [gateError, setGateError] = useState<string | null>(null);
  const media = useMediaRecording();

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch("/api/gads/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!data.ok) {
        setPhase("error");
        return;
      }
      if (data.status === "expired") {
        setPhase("expired");
        return;
      }
      if (data.status === "pending") {
        setPhase("gate");
        return;
      }
      if (data.status === "in_progress") {
        setExamData({
          questions: data.questions,
          answers: data.answers,
          draftAnswer: data.draftAnswer,
          currentIndex: data.currentIndex,
          remainingQuestionSeconds: data.remainingQuestionSeconds,
          expiresAt: data.expiresAt,
          serverNow: data.serverNow,
        });
        setPhase("permission");
        return;
      }
      // submitted / scored - both look identical to the candidate.
      setPhase("done");
    } catch {
      setPhase("error");
    }
  }, [token]);

  useEffect(() => {
    void fetchState();
    // Runs once on mount - `token` is a route param and doesn't change
    // within this page's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleGateSubmit(name: string, email: string) {
    setGateError(null);
    try {
      const res = await fetch("/api/gads/begin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, candidateName: name, candidateEmail: email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!data.ok) {
        if (data.status === "expired") {
          setPhase("expired");
          return;
        }
        setGateError(data.error || "Could not start the assessment.");
        return;
      }
      if (data.alreadyStarted) {
        await fetchState();
        return;
      }
      setExamData({
        questions: data.questions,
        answers: {},
        draftAnswer: null,
        currentIndex: 0,
        expiresAt: data.expiresAt,
        serverNow: data.serverNow,
      });
      setPhase("permission");
    } catch {
      setGateError("Could not start the assessment. Please check your connection and try again.");
    }
  }

  if (phase === "loading") {
    return (
      <CenteredMessage>
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">Loading your assessment...</p>
      </CenteredMessage>
    );
  }

  if (phase === "expired") {
    return (
      <CenteredMessage>
        <ShieldAlert className="h-8 w-8 text-muted-foreground" />
        <h1 className="mt-4 font-display text-xl font-bold">Link expired</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          This assessment link has expired. Please contact EthixWeb if you believe this is an error.
        </p>
      </CenteredMessage>
    );
  }

  if (phase === "error") {
    return (
      <CenteredMessage>
        <ShieldAlert className="h-8 w-8 text-error-text" />
        <h1 className="mt-4 font-display text-xl font-bold">Something went wrong</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Please refresh this page. If the problem continues, contact EthixWeb.
        </p>
      </CenteredMessage>
    );
  }

  if (phase === "done") {
    return (
      <CenteredMessage>
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h1 className="mt-4 font-display text-xl font-bold">Assessment Submitted Successfully</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Thank you for completing the assessment. You may now close this window.
        </p>
      </CenteredMessage>
    );
  }

  if (phase === "gate") {
    return <NameEmailGate onSubmit={handleGateSubmit} error={gateError} />;
  }

  if (phase === "permission") {
    return <PermissionGate media={media} onReady={() => setPhase("exam")} />;
  }

  if (phase === "exam" && examData) {
    return (
      <ExamRunner
        token={token}
        questions={examData.questions}
        initialIndex={examData.currentIndex}
        initialDraftAnswer={examData.draftAnswer}
        initialRemainingQuestionSeconds={examData.remainingQuestionSeconds}
        expiresAt={examData.expiresAt}
        serverNow={examData.serverNow}
        stream={media.getStream()}
        media={media}
        onSubmitted={() => setPhase("done")}
      />
    );
  }

  return null;
}

function CenteredMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-center">
      {children}
    </div>
  );
}
