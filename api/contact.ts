/**
 * Vercel Serverless Function - Contact Form Handler
 * POST /api/contact
 * 
 * Env vars (optional):
 * - RESEND_API_KEY: if set, will send email via Resend
 * - CONTACT_TO_EMAIL: destination email (default: thakurabhi8925@gmail.com)
 * - CONTACT_FROM_EMAIL: from email for Resend
 */

type ContactBody = {
  name?: string;
  email?: string;
  service?: string;
  budget?: string;
  message?: string;
  // honeypot
  website?: string;
  // spec from calculator
  platform?: string;
  pages?: number;
};

export default async function handler(req: any, res: any) {
  // CORS
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

    // Honeypot check - if filled, it's spam
    if (body.website && body.website.trim() !== "") {
      // Pretend success for bots
      res.status(200).json({ success: true, message: "Message received" });
      return;
    }

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const message = (body.message || "").trim();
    const service = (body.service || "").trim();
    const budget = (body.budget || "").trim();

    // Validation
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

    // Rate limiting simple check via header (Vercel doesn't have persistent storage)
    // For production, use Upstash Redis or similar

    const toEmail = process.env.CONTACT_TO_EMAIL || "thakurabhi8925@gmail.com";
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "portfolio@abhishekthakur.in";

    // Try to send via Resend if API key exists
    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: `Portfolio Contact <${fromEmail}>`,
            to: [toEmail],
            reply_to: email,
            subject: `New inquiry from ${name} - ${service || "Portfolio"}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; background: #0d0d17; color: #f1f0ea; padding: 24px; border-radius: 12px;">
                <h2 style="color: #f0d060; margin: 0 0 16px;">New Portfolio Inquiry</h2>
                <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                <p><strong>Service:</strong> ${escapeHtml(service) || "Not specified"}</p>
                <p><strong>Budget:</strong> ${escapeHtml(budget) || "Not specified"}</p>
                <p><strong>Platform:</strong> ${escapeHtml(body.platform || "")}</p>
                <p><strong>Pages:</strong> ${body.pages || ""}</p>
                <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 16px 0;" />
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap; background: #121222; padding: 12px; border-radius: 8px;">${escapeHtml(message)}</p>
                <p style="font-size: 12px; color: #9ca3af; margin-top: 24px;">Sent from abhishekthakur.in contact form</p>
              </div>
            `,
          }),
        });

        if (!resendResponse.ok) {
          const err = await resendResponse.text();
          console.error("Resend error:", err);
          // Don't fail - still return success to user, log error
        }
      } catch (e) {
        console.error("Email send failed:", e);
      }
    } else {
      // No email service - log to console (Vercel logs)
      console.log("New contact inquiry:", {
        name,
        email,
        service,
        budget,
        message: message.substring(0, 200),
        timestamp: new Date().toISOString(),
      });
    }

    res.status(200).json({
      success: true,
      message: "Thank you! Your message has been received. I will reply within 24 hours.",
    });
  } catch (error: any) {
    console.error("Contact API error:", error);
    res.status(500).json({ success: false, error: "Internal server error. Please email directly at thakurabhi8925@gmail.com" });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
