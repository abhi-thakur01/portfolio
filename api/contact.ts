type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
  service?: string;
  budget?: string;
};

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  try {
    const body: ContactBody = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

    if (body.website && body.website.trim() !== "") {
      res.status(200).json({ success: true, message: "Message received" });
      return;
    }

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const message = (body.message || "").trim();
    const service = (body.service || "").trim();
    const budget = (body.budget || "").trim();

    if (!name || name.length < 2) {
      res.status(400).json({ success: false, error: "Name must be at least 2 characters" });
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ success: false, error: "Valid email required" });
      return;
    }
    if (!message || message.length < 10) {
      res.status(400).json({ success: false, error: "Message must be at least 10 characters" });
      return;
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || "thakurabhi8925@gmail.com";
    const resendKey = process.env.RESEND_API_KEY;
    let sent = false;
    let lastError = "";

    if (resendKey) {
      const fromEmail = process.env.CONTACT_FROM_EMAIL || "Portfolio <beth.t@example.com>";
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject: `New portfolio message from ${name}`,
          html: emailHtml({ name, email, message, service, budget }),
        }),
      });
      if (r.ok) sent = true;
      else lastError = await r.text();
    }

    if (!sent) {
      const r = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(toEmail)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          service: service || "-",
          budget: budget || "-",
          _subject: `New portfolio message from ${name}`,
          _replyto: email,
          _template: "table",
          _captcha: "false",
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && (data.success === true || data.success === "true" || data.message)) {
        sent = true;
      } else {
        lastError = data.message || data.error || lastError || "Email provider rejected the message";
      }
    }

    if (!sent) {
      console.error("Contact send failed:", lastError);
      res.status(500).json({
        success: false,
        error: "Could not send email. Please write directly to thakurabhi8925@gmail.com",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Thank you! Your message has been sent.",
    });
  } catch (error: any) {
    console.error("Contact API error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Please email directly at thakurabhi8925@gmail.com",
    });
  }
}

function emailHtml(fields: {
  name: string;
  email: string;
  message: string;
  service: string;
  budget: string;
}) {
  return `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;background:#0a0e1a;color:#e5e7eb;padding:24px;border-radius:12px">
      <h2 style="color:#60a5fa;margin:0 0 16px">New portfolio message</h2>
      <p><strong>Name:</strong> ${escapeHtml(fields.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(fields.email)}</p>
      ${fields.service ? `<p><strong>Service:</strong> ${escapeHtml(fields.service)}</p>` : ""}
      ${fields.budget ? `<p><strong>Budget:</strong> ${escapeHtml(fields.budget)}</p>` : ""}
      <hr style="border:none;border-top:1px solid #1e293b;margin:16px 0" />
      <p style="white-space:pre-wrap;background:#111827;padding:12px;border-radius:8px">${escapeHtml(fields.message)}</p>
    </div>
  `;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """)
    .replace(/'/g, "&#039;");
}
