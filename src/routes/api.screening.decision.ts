import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getSupabase } from "@/lib/supabase";
import { verifyDecisionToken } from "@/lib/screening-tokens";
import { escapeHtml, DARK, BRAND_RED } from "@/lib/email";

// Opened directly from the reviewer's email - a plain HTML confirmation page,
// not JSON, since a human clicks this link in their browser.
function page(title: string, message: string) {
  return `<!doctype html>
<html><head><meta charset="utf-8" /><title>${escapeHtml(title)}</title>
<meta name="robots" content="noindex" />
<style>
  body { margin:0; background:${DARK}; color:#f5efee; font-family:Arial,Helvetica,sans-serif;
    display:flex; align-items:center; justify-content:center; min-height:100vh; }
  .card { max-width:420px; padding:36px; text-align:center; }
  h1 { font-size:20px; margin:0 0 10px; }
  p { font-size:14px; color:#b0a39f; margin:0; }
  .accent { color:${BRAND_RED}; }
</style></head>
<body><div class="card"><h1 class="accent">${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p></div></body></html>`;
}

export const Route = createFileRoute("/api/screening/decision")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        const decision = url.searchParams.get("decision");
        const token = url.searchParams.get("token");

        if (
          !id ||
          !token ||
          (decision !== "approved" && decision !== "rejected") ||
          !verifyDecisionToken(id, decision, token)
        ) {
          return new Response(page("Invalid link", "This review link is invalid or has expired."), {
            status: 400,
            headers: { "Content-Type": "text/html" },
          });
        }

        const supabase = getSupabase();
        const { data: test, error: fetchError } = await supabase
          .from("screening_tests")
          .select("id, status, reviewer_decision, candidate_name")
          .eq("id", id)
          .single();

        if (fetchError || !test) {
          return new Response(page("Not found", "This candidate's test could not be found."), {
            status: 404,
            headers: { "Content-Type": "text/html" },
          });
        }

        if (test.reviewer_decision) {
          return new Response(
            page(
              "Already reviewed",
              `${test.candidate_name} was already marked "${test.reviewer_decision}".`,
            ),
            { headers: { "Content-Type": "text/html" } },
          );
        }

        const { error: updateError } = await supabase
          .from("screening_tests")
          .update({
            status: decision,
            reviewer_decision: decision,
            reviewer_decided_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (updateError) {
          console.error("[api/screening/decision] Supabase update error:", updateError);
          return new Response(page("Error", "Could not save your decision. Please try again."), {
            status: 502,
            headers: { "Content-Type": "text/html" },
          });
        }

        const verb = decision === "approved" ? "approved for interview" : "rejected";
        return new Response(page("Saved", `${test.candidate_name} has been ${verb}.`), {
          headers: { "Content-Type": "text/html" },
        });
      },
    },
  },
});
