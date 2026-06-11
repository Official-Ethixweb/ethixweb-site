import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { Resend } from "resend";

const TO_EMAIL = "akash@ethixweb.com"; // TODO: switch back to info@ethixweb.com before going live
const FROM_EMAIL = "Ethixweb Website <forms@ethixweb.com>";

const SERVICE_LABELS: Record<string, string> = {
  website: "Website",
  ai: "AI Automation",
  crm: "CRM & Integrations",
  seo: "SEO & Ads",
  webapp: "Web Application",
  other: "Something else",
};

const TIMELINE_LABELS: Record<string, string> = {
  asap: "ASAP (under 2 weeks)",
  month: "This month (2-4 weeks)",
  quarter: "This quarter (1-3 months)",
  planning: "Just planning (3+ months out)",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 16px;font-weight:600;color:#555;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:8px 16px;color:#111;">${value}</td>
    </tr>`;
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        if (!body || typeof body !== "object") {
          return Response.json({ ok: false, error: "Invalid request body" }, { status: 400 });
        }

        const { service, timeline, other, name, phone, email } = body as Record<string, unknown>;

        const cleanName = typeof name === "string" ? name.trim() : "";
        const cleanEmail = typeof email === "string" ? email.trim() : "";
        const cleanPhone = typeof phone === "string" ? phone.trim() : "";
        const cleanOther = typeof other === "string" ? other.trim() : "";

        if (!cleanName || !cleanEmail) {
          return Response.json({ ok: false, error: "Name and email are required" }, { status: 400 });
        }

        const serviceLabel = typeof service === "string" ? SERVICE_LABELS[service] ?? service : null;
        const timelineLabel = typeof timeline === "string" ? TIMELINE_LABELS[timeline] ?? timeline : null;

        const rows = [
          serviceLabel && row("Service", escapeHtml(serviceLabel)),
          cleanOther && row("Project details", escapeHtml(cleanOther)),
          timelineLabel && row("Timeline", escapeHtml(timelineLabel)),
          row("Name", escapeHtml(cleanName)),
          cleanPhone && row("Phone", `<a href="tel:${escapeHtml(cleanPhone)}">${escapeHtml(cleanPhone)}</a>`),
          row("Email", `<a href="mailto:${escapeHtml(cleanEmail)}">${escapeHtml(cleanEmail)}</a>`),
        ]
          .filter(Boolean)
          .join("");

        const html = `
          <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">
            <h2 style="margin:0 0 4px;color:#111;">New project inquiry</h2>
            <p style="margin:0 0 16px;color:#777;font-size:13px;">Submitted via the Ethixweb contact form</p>
            <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden;">
              ${rows}
            </table>
          </div>`;

        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
          console.error("RESEND_API_KEY is not configured");
          return Response.json({ ok: false, error: "Email service not configured" }, { status: 500 });
        }

        const resend = new Resend(apiKey);
        const { error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: TO_EMAIL,
          replyTo: cleanEmail,
          subject: `New project inquiry from ${cleanName}`,
          html,
        });

        if (error) {
          console.error("Resend error:", error);
          return Response.json({ ok: false, error: "Failed to send email" }, { status: 502 });
        }

        return Response.json({ ok: true });
      },
    },
  },
});
