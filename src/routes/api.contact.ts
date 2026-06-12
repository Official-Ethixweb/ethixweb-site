import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { Resend } from "resend";

const TO_EMAIL = "akash@ethixweb.com"; // TODO: switch back to info@ethixweb.com before going live
const FROM_EMAIL = "Ethixweb Website <forms@ethixweb.com>";
const SITE_URL = "https://ethixweb.com";
const MASCOT_URL = `${SITE_URL}/Ethan%20view%203.png`;
const LOGO_DATA_URI = "data:image/png;base64,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oYjdwYWdwwbbDcg/qhcr3xVU1RhwLLp0wj36GIumXspOByimcZGZkJCQMC2BB/hPGEMxllbCSqWqaH6IjK0LWZcQbiKkE8MdiArkqMaJ/+kqgmqfYO9wsOJOZWHZIyq2QkdihStK2/3WGr+xMjbiQVjwLuJYxzD7DilxqJyL36LcEdJWUZ9ux1Cn9bhPmW/UCRJ/yEzbiseUuG5OoDsExvCWLnXrIDevx2QPxLZWVuMfQpXMqQg5UnEnIWE6At06Z/p1nWamzWZTUcsLrJl9zazVarVAtR1qf7DiWDsuwsKHvuHWtaUiOIYUTGRBwHKaQbcSjqlkraGq+aOzqlbjGCbHQuPbmHGoyWlbpVQHFB0aMaIeFV6T2bC8FrLOY26iVwteGtgUUWMqOEXMt8U8nyKsybKMZc0aaCmf0FlYI4kAVHCv5Hyt1cAyQpyBaUnYRiGGq8gqRBnXmnYbnv+CHc1FQkLCdALSlztrK2EXXKVUYy2H8XTzhbVQ59zwz1HHEHGEqo01vXVi+1+xrxIqWE+wuOdoxdcKW2lEh/QSEhLWMrCu0lWklbCp1V/ZA9XPpfL+t9j3Q3vKVcWqQiqkjK4iuwIWy/cmJyc/UNcwAdYUXKkfwhgQq3soB1eyy3UEswRrhd1QdF+Zr66JV9hQfXgVgKxKt8tLNcm0qFjJk2sQTRSdJ0xMTKzD2OEi/E0wKAB1AnPxhCK+TUJCQsK0gqp+vU61ABU9SHfm+xCfcCWeIuPNiv5ekjuFXm5/qZouXxF0NUYL/yC4VSf+IhI+iolyklSF26+wYjOLDLeoFFNCQkLCWOOPaIWvqkU16ECfRiwHcSI077wuctgRZJEhsRMVkqOk6/AQ7gV9aaT4VYIVCa7VbqgkP6KqV5DivVkR60FFkKvZc8c1F0VjQ8znQt7Tjn1Q5lL2Eu0fkOuFKuxFc2Bsmu0lJCQkRPB7ZpoXBmIDkS3Cv4d0Hi8wOMaCJZ1Ec4VAJl3hOAU+i7w3xK0OUFXVzCpYE+Tr8ZqQQouMD2qSWaSWQ2pwLbVgX2pmS5gIvSF3+1jH/sjMQuKLOC8oixfjFCsx6Pp/c/F/g+W2GFvSlpvZ4ZQ7iJX2sUMxJSQkJBQAaa0bsVj/k08yIvHnIHEi5BB1jK6m+8MUlPiQQpdfYXHfXMU0jLfDhsigA/i7uAB+m9TGmIp+0BJxxLcK7Lo7g7sNTLs0YJ0Yp9XXrqMU2bnxBhSI+EeOpdwd9OixAQrhWuc8a/h6PoCk1tjHAcwBgrlyKp6CN5fE6Sla+e6P1f5LSEhIWGcMTU1tZSdMUYJj4UVk5n9KU+TYUJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCwhqA/0+AAR/UbZAQAAAAAElFTkSuQmCC";
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
                        <img src="${LOGO_DATA_URI}" width="160" height="24" alt="Ethixweb" style="display:block;border:0;width:160px;height:24px;" />
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
