import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { getSupabase } from "@/lib/supabase";
import { generateScreeningTest } from "@/lib/anthropic";
import { getScreeningConfig } from "@/lib/screening-rubrics";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Route = createFileRoute("/api/screening/start")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!checkRateLimit(`screening-start:${clientIp(request)}`, 5, 10 * 60 * 1000)) {
          return Response.json(
            { ok: false, error: "Too many requests. Please try again later." },
            { status: 429 },
          );
        }

        const body = await request.json().catch(() => null);
        if (!body || typeof body !== "object") {
          return Response.json({ ok: false, error: "Invalid request body" }, { status: 400 });
        }

        const { roleId, candidateName, candidateEmail, candidatePhone, resumeUrl } = body as Record<
          string,
          unknown
        >;

        const name = typeof candidateName === "string" ? candidateName.trim() : "";
        const email = typeof candidateEmail === "string" ? candidateEmail.trim() : "";
        const role = typeof roleId === "string" ? roleId.trim() : "";

        if (!name || !email || !EMAIL_RE.test(email)) {
          return Response.json(
            { ok: false, error: "A valid name and email are required" },
            { status: 400 },
          );
        }

        const config = getScreeningConfig(role);
        if (!config) {
          return Response.json(
            { ok: false, error: "Screening is not enabled for this role yet" },
            { status: 400 },
          );
        }

        let questions;
        try {
          questions = await generateScreeningTest(config);
        } catch (err) {
          console.error("[api/screening/start] generateScreeningTest threw:", err);
          return Response.json(
            {
              ok: false,
              error: "Could not generate the screening test. Please try again shortly.",
            },
            { status: 502 },
          );
        }

        const supabase = getSupabase();
        const { data, error } = await supabase
          .from("screening_tests")
          .insert({
            role_id: role,
            candidate_name: name,
            candidate_email: email,
            candidate_phone: typeof candidatePhone === "string" ? candidatePhone.trim() : null,
            resume_url: typeof resumeUrl === "string" ? resumeUrl : null,
            questions,
            status: "in_progress",
            started_at: new Date().toISOString(),
          })
          .select("id, expires_at")
          .single();

        if (error || !data) {
          console.error("[api/screening/start] Supabase insert error:", error);
          return Response.json(
            { ok: false, error: "Could not start the screening test. Please try again shortly." },
            { status: 502 },
          );
        }

        return Response.json({
          ok: true,
          testId: data.id,
          expiresAt: data.expires_at,
          questions,
        });
      },
    },
  },
});
