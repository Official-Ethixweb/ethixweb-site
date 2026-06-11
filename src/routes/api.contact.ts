import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { Resend } from "resend";

const TO_EMAIL = "akash@ethixweb.com"; // TODO: switch back to info@ethixweb.com before going live
const FROM_EMAIL = "Ethixweb Website <forms@ethixweb.com>";
const SITE_URL = "https://ethixweb.com";
const MASCOT_URL = `${SITE_URL}/Ethan%20view%203.png`;
const LOGO_URL = `${SITE_URL}/ethixweb.png`;
const BRAND_RED = "#c0272d";
const DARK = "#0e0c14";

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
      <td style="padding:14px 0;border-bottom:1px solid #f0f0f0;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9aa0a6;margin-bottom:4px;">${label}</div>
        <div style="font-size:15px;font-weight:600;color:#1a1a1a;">${value}</div>
      </td>
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

        const firstName = cleanName.split(" ")[0] || cleanName;

        const html = `
          <div style="background:#f4f4f7;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
            <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #ececec;">
              <tr>
                <td style="background:${DARK};padding:32px;">
                  <table role="presentation" width="100%">
                    <tr>
                      <td style="vertical-align:middle;">
                        <img src="${LOGO_URL}" width="140" alt="Ethixweb" style="display:block;border:0;" />
                        <div style="margin-top:10px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${BRAND_RED};">New project inquiry</div>
                      </td>
                      <td style="width:72px;text-align:right;vertical-align:bottom;">
                        <img src="${MASCOT_URL}" width="72" alt="" style="display:block;border:0;" />
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 32px 8px;">
                  <p style="margin:0 0 8px;font-size:15px;line-height:1.5;color:#1a1a1a;">
                    <strong>${escapeHtml(cleanName)}</strong> just submitted the contact form on the website. Here's what they shared:
                  </p>
                  <table role="presentation" width="100%" style="border-collapse:collapse;">
                    ${rows}
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 32px 32px;">
                  <a href="mailto:${escapeHtml(cleanEmail)}" style="display:inline-block;background:${BRAND_RED};color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 28px;border-radius:999px;">Reply to ${escapeHtml(firstName)}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 32px;background:#fafafa;border-top:1px solid #f0f0f0;text-align:center;">
                  <p style="margin:0;font-size:12px;color:#9aa0a6;">Sent automatically from the Ethixweb contact form &middot; ethixweb.com</p>
                </td>
              </tr>
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
