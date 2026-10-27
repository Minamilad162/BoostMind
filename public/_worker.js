const PUBLIC_CONTACT_EMAIL = "info@boostmind-tech.com";
const NOTIFICATION_EMAIL = "bishosamuel@gmail.com";
const MAX_TEXT_LENGTH = 5000;

const jsonHeaders = {
  "Content-Type": "application/json; charset=UTF-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...jsonHeaders, ...extraHeaders },
  });
}

function normalizeText(value, maxLength = 300) {
  return String(value ?? "")
    .replace(/\u0000/g, "")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function isHttpUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function parseInquiry(payload) {
  return {
    id: crypto.randomUUID(),
    fullName: normalizeText(payload.fullName ?? payload["full-name"], 120),
    email: normalizeText(payload.email, 254).toLowerCase(),
    phone: normalizeText(payload.phone, 80),
    projectBrief: normalizeText(payload.projectBrief ?? payload["project-brief"], MAX_TEXT_LENGTH),
    referenceLink: normalizeText(payload.referenceLink ?? payload["reference-link"], 500),
    botField: normalizeText(payload.botField ?? payload["bot-field"], 200),
    formOpenedAt: Number(payload.formOpenedAt ?? 0),
    sourcePage: normalizeText(payload.sourcePage, 500),
    submittedAt: new Date().toISOString(),
  };
}

function validateInquiry(inquiry) {
  if (inquiry.botField) return "Unable to process this request";
  if (!inquiry.fullName) return "Please enter your full name";
  if (!isEmail(inquiry.email)) return "Please enter a valid email address";
  if (!inquiry.phone) return "Please enter a phone or WhatsApp number";
  if (!inquiry.projectBrief || inquiry.projectBrief.length < 10) {
    return "Tell us a little more about what you want to build";
  }
  if (!isHttpUrl(inquiry.referenceLink)) return "Please enter a valid reference link";

  if (Number.isFinite(inquiry.formOpenedAt) && inquiry.formOpenedAt > 0) {
    const elapsed = Date.now() - inquiry.formOpenedAt;
    if (elapsed < 1800) return "Please review your details and try again";
    if (elapsed > 24 * 60 * 60 * 1000) return "This form session expired, please reopen the form";
  }

  return "";
}

function detailRow(label, value) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 14px;color:#71809b;font-size:13px;vertical-align:top;border-bottom:1px solid #e7edf6;width:180px;">${escapeHtml(label)}</td>
      <td style="padding:10px 14px;color:#101828;font-size:14px;vertical-align:top;border-bottom:1px solid #e7edf6;word-break:break-word;">${escapeHtml(value).replaceAll("\n", "<br>")}</td>
    </tr>`;
}

function buildEmail(inquiry) {
  const subject = `New Boost Mind project inquiry — ${inquiry.fullName}`;
  const safeReference = inquiry.referenceLink
    ? `<a href="${escapeHtml(inquiry.referenceLink)}" style="color:#0466c8;">${escapeHtml(inquiry.referenceLink)}</a>`
    : "";

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#101828;">
    <div style="max-width:760px;margin:0 auto;padding:28px 16px;">
      <div style="background:linear-gradient(135deg,#061b3a,#073f73);border-radius:22px 22px 0 0;padding:28px;color:#fff;">
        <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#72d4ff;margin-bottom:10px;">Boost Mind</div>
        <h1 style="margin:0;font-size:26px;line-height:1.25;">New project inquiry</h1>
        <p style="margin:10px 0 0;color:#dcecff;font-size:14px;">Someone just sent a new project request</p>
      </div>
      <div style="background:#fff;border:1px solid #dfe7f2;border-top:0;border-radius:0 0 22px 22px;overflow:hidden;box-shadow:0 18px 50px rgba(15,35,65,.10);">
        <table role="presentation" style="width:100%;border-collapse:collapse;">
          ${detailRow("Inquiry ID", inquiry.id)}
          ${detailRow("Full name", inquiry.fullName)}
          ${detailRow("Email", inquiry.email)}
          ${detailRow("Phone / WhatsApp", inquiry.phone)}
          ${detailRow("Project brief", inquiry.projectBrief)}
          ${inquiry.referenceLink ? `<tr><td style="padding:10px 14px;color:#71809b;font-size:13px;vertical-align:top;border-bottom:1px solid #e7edf6;width:180px;">Reference link</td><td style="padding:10px 14px;font-size:14px;vertical-align:top;border-bottom:1px solid #e7edf6;word-break:break-word;">${safeReference}</td></tr>` : ""}
          ${detailRow("Source page", inquiry.sourcePage)}
          ${detailRow("Submitted at", inquiry.submittedAt)}
        </table>
        <div style="padding:20px 24px;background:#f8fbff;color:#526178;font-size:13px;line-height:1.6;">
          Reply directly to this email to contact <strong>${escapeHtml(inquiry.fullName)}</strong> at
          <a href="mailto:${escapeHtml(inquiry.email)}" style="color:#0466c8;">${escapeHtml(inquiry.email)}</a>
        </div>
      </div>
    </div>
  </body>
</html>`;

  const text = [
    "Boost Mind — New project inquiry",
    "",
    `Inquiry ID: ${inquiry.id}`,
    `Full name: ${inquiry.fullName}`,
    `Email: ${inquiry.email}`,
    `Phone / WhatsApp: ${inquiry.phone}`,
    "",
    "Project brief:",
    inquiry.projectBrief,
    "",
    `Reference link: ${inquiry.referenceLink || "—"}`,
    `Source page: ${inquiry.sourcePage || "—"}`,
    `Submitted at: ${inquiry.submittedAt}`,
  ].join("\n");

  return { subject, html, text };
}

function hasRestEmailConfig(env) {
  return Boolean(
    normalizeText(env.CLOUDFLARE_ACCOUNT_ID, 100) &&
    normalizeText(env.CLOUDFLARE_EMAIL_API_TOKEN, 500),
  );
}

// Cloudflare Pages Functions do not expose Email Sending as a supported Pages binding.
// Use Email Service REST API from the Pages worker instead. This keeps the form on the
// same origin while using server-side secrets that are never exposed to the browser.
async function sendEmailNotification(env, message) {
  if (!hasRestEmailConfig(env)) {
    const error = new Error('Cloudflare Email Service REST credentials are missing');
    error.code = 'EMAIL_NOT_CONFIGURED';
    throw error;
  }

  const result = await sendWithRestApi(env, message);
  return { provider: 'cloudflare-email-rest', result };
}

async function sendWithRestApi(env, message) {
  const accountId = normalizeText(env.CLOUDFLARE_ACCOUNT_ID, 100);
  const apiToken = normalizeText(env.CLOUDFLARE_EMAIL_API_TOKEN, 500);

  if (!accountId || !apiToken) {
    throw new Error("Cloudflare Email Service is not configured. Missing account ID or API token.");
  }

  const restMessage = {
    to: message.to,
    from: typeof message.from === "string" ? message.from : message.from.email,
    reply_to: typeof message.replyTo === "string" ? message.replyTo : message.replyTo.email,
    subject: message.subject,
    html: message.html,
    text: message.text,
  };

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/email/sending/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restMessage),
    },
  );

  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success) {
    const details = result?.errors?.map((error) => error.message).filter(Boolean).join("; ");
    const error = new Error(details || `Cloudflare Email Service returned ${response.status}`);
    error.code = result?.errors?.[0]?.code || `HTTP_${response.status}`;
    throw error;
  }

  return result.result;
}

async function storeInquiryIfConfigured(env, inquiry) {
  if (!env.INQUIRIES || typeof env.INQUIRIES.put !== "function") return;
  const key = `inquiry:${inquiry.submittedAt}:${inquiry.id}`;
  await env.INQUIRIES.put(key, JSON.stringify(inquiry), {
    expirationTtl: 60 * 60 * 24 * 365,
  });
}

async function handleInquiry(request, env) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (origin && origin !== requestUrl.origin) {
    return json({ ok: false, message: "Request origin is not allowed" }, 403);
  }

  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.includes("application/json")) {
    return json({ ok: false, message: "Unsupported form format" }, 415);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, message: "The form data could not be read" }, 400);
  }

  const inquiry = parseInquiry(payload);
  const validationError = validateInquiry(inquiry);
  if (validationError) return json({ ok: false, message: validationError }, 400);

  const fromEmail = normalizeText(env.BOOSTMIND_FROM_EMAIL || env.BROADMIND_FROM_EMAIL || PUBLIC_CONTACT_EMAIL, 254);
  const fromName = normalizeText(env.BOOSTMIND_FROM_NAME || env.BROADMIND_FROM_NAME || "Boost Mind Website", 100);
  const notificationEmail = normalizeText(env.BOOSTMIND_NOTIFICATION_EMAIL || env.BROADMIND_NOTIFICATION_EMAIL || NOTIFICATION_EMAIL, 254);

  if (!isEmail(fromEmail)) {
    console.error("BOOSTMIND_FROM_EMAIL is invalid. The default sender is info@boostmind-tech.com.");
    return json(
      {
        ok: false,
        message: "The project form is temporarily unavailable, please contact Boost Mind directly",
        code: "EMAIL_NOT_CONFIGURED",
      },
      503,
    );
  }

  if (!isEmail(notificationEmail)) {
    console.error("BOOSTMIND_NOTIFICATION_EMAIL is invalid.");
    return json(
      {
        ok: false,
        message: "The project form is temporarily unavailable, please contact Boost Mind directly",
        code: "NOTIFICATION_EMAIL_INVALID",
      },
      503,
    );
  }

  const emailContent = buildEmail(inquiry);
  const message = {
    to: notificationEmail,
    from: { email: fromEmail, name: fromName },
    replyTo: { email: inquiry.email, name: inquiry.fullName },
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
  };

  try {
    const emailSend = await sendEmailNotification(env, message);

    try {
      await storeInquiryIfConfigured(env, inquiry);
    } catch (storageError) {
      console.error("Inquiry email sent, but optional KV storage failed:", storageError);
    }

    return json({
      ok: true,
      inquiryId: inquiry.id,
      emailProvider: emailSend.provider,
      message: "Thanks, your project request is on its way",
    });
  } catch (error) {
    const errorCode = String(error?.code || "EMAIL_SEND_FAILED");
    console.error("Project inquiry notification failed:", errorCode, error?.message || error);

    if (errorCode === "EMAIL_NOT_CONFIGURED") {
      return json(
        {
          ok: false,
          message: "Project email is not configured yet",
          code: "EMAIL_NOT_CONFIGURED",
        },
        503,
      );
    }

    return json(
      {
        ok: false,
        message: "We could not send your request right now, please try again in a moment",
        code: "EMAIL_SEND_FAILED",
      },
      502,
    );
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/project-inquiry") {
      if (request.method === "POST") return handleInquiry(request, env);
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400",
          },
        });
      }
      return json({ ok: false, message: "Method not allowed." }, 405, { Allow: "POST, OPTIONS" });
    }

    if (url.pathname === "/api/health") {
      const senderEmail = normalizeText(env.BOOSTMIND_FROM_EMAIL || env.BROADMIND_FROM_EMAIL || PUBLIC_CONTACT_EMAIL, 254);
      const notificationEmail = normalizeText(env.BOOSTMIND_NOTIFICATION_EMAIL || env.BROADMIND_NOTIFICATION_EMAIL || NOTIFICATION_EMAIL, 254);
      const provider = hasRestEmailConfig(env) ? "cloudflare-email-rest" : "none";
      return json({
        ok: true,
        service: "Boost Mind project inquiry",
        runtime: "cloudflare-pages-worker",
        contactEmail: PUBLIC_CONTACT_EMAIL,
        senderEmail,
        notificationEmail,
        emailProvider: provider,
        emailConfigured: isEmail(senderEmail) && isEmail(notificationEmail) && provider !== "none",
        requiredSecrets: {
          CLOUDFLARE_ACCOUNT_ID: Boolean(normalizeText(env.CLOUDFLARE_ACCOUNT_ID, 100)),
          CLOUDFLARE_EMAIL_API_TOKEN: Boolean(normalizeText(env.CLOUDFLARE_EMAIL_API_TOKEN, 500)),
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
