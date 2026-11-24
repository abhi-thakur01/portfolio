import { createHmac } from "node:crypto";
import { isIP } from "node:net";

const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 10 * 60;
const MAX_BODY_BYTES = 32 * 1024;
const EMAIL_PATTERN = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

// One atomic operation shared by every serverless instance. Blocked requests
// neither extend the window nor consume additional email quota.
const RATE_LIMIT_SCRIPT = `
  local count = tonumber(redis.call('GET', KEYS[1]) or '0')
  if count >= tonumber(ARGV[1]) then
    return {0, redis.call('TTL', KEYS[1])}
  end
  count = redis.call('INCR', KEYS[1])
  if count == 1 then
    redis.call('EXPIRE', KEYS[1], ARGV[2])
  end
  return {1, redis.call('TTL', KEYS[1])}
`;

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
  service?: string;
  budget?: string;
};

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Vary", "Origin");

  if (req.method !== "POST" && req.method !== "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  const allowedOrigin = process.env.CONTACT_ALLOWED_ORIGIN?.trim();
  try {
    const url = new URL(allowedOrigin || "");
    if (!/^https?:$/.test(url.protocol) || url.origin !== allowedOrigin) throw new Error();
  } catch {
    res.status(503).json({ success: false, error: "Contact form is temporarily unavailable. Please email me directly." });
    return;
  }

  // Do not derive trust from Host or reflect arbitrary request origins.
  if (req.headers?.origin !== allowedOrigin) {
    res.status(403).json({ success: false, error: "Origin not allowed" });
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");

  if (req.method === "OPTIONS") {
    const requestedMethod = req.headers?.["access-control-request-method"];
    const requestedHeaders = String(req.headers?.["access-control-request-headers"] || "")
      .split(",").map((header) => header.trim().toLowerCase()).filter(Boolean);
    if ((requestedMethod && requestedMethod !== "POST") || requestedHeaders.some((header) => !["content-type", "accept"].includes(header))) {
      res.status(403).json({ success: false, error: "Preflight not allowed" });
      return;
    }
    res.status(204).end();
    return;
  }

  if (!/^application\/json(?:\s*;|$)/i.test(String(req.headers?.["content-type"] || ""))) {
    res.status(415).json({ success: false, error: "Content-Type must be application/json" });
    return;
  }

  let body: ContactBody;
  try {
    const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    if (Number(req.headers?.["content-length"]) > MAX_BODY_BYTES || (raw && Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES)) {
      res.status(413).json({ success: false, error: "Message request is too large" });
      return;
    }
    const parsed = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    for (const field of ["name", "email", "message", "website", "service", "budget"]) {
      if (parsed[field] !== undefined && typeof parsed[field] !== "string") throw new Error();
    }
    body = parsed;
  } catch {
    res.status(400).json({ success: false, error: "Invalid contact form data" });
    return;
  }

  if (body.website?.trim()) {
    res.status(200).json({ success: true, message: "Message received" });
    return;
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();
  const service = (body.service || "").trim();
  const budget = (body.budget || "").trim();

  if (name.length < 2 || name.length > 100 || /[\r\n\u0000]/.test(name)) {
    res.status(400).json({ success: false, error: "Name must be between 2 and 100 characters" });
    return;
  }
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    res.status(400).json({ success: false, error: "Valid email required" });
    return;
  }
  if (message.length < 10 || message.length > 5000) {
    res.status(400).json({ success: false, error: "Message must be between 10 and 5,000 characters" });
    return;
  }
  if (service.length > 200 || budget.length > 200) {
    res.status(400).json({ success: false, error: "Service and budget must be at most 200 characters" });
    return;
  }

  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim();
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!toEmail || !fromEmail || !resendKey || !redisUrl || !redisToken) {
    res.status(503).json({ success: false, error: "Contact form is temporarily unavailable. Please email me directly." });
    return;
  }

  try {
    const limit = await rateLimit(req, allowedOrigin!, redisUrl, redisToken);
    if (!limit.allowed) {
      res.setHeader("Retry-After", String(limit.retryAfter));
      res.status(429).json({ success: false, error: "Too many messages. Please try again in a few minutes." });
      return;
    }
  } catch {
    console.error("Contact rate limiter unavailable");
    res.status(503).json({ success: false, error: "Contact form is temporarily unavailable. Please try again later." });
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
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
      signal: AbortSignal.timeout(10000),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || typeof data?.id !== "string" || !data.id) {
      console.error("Contact email provider rejected the request", response.status);
      res.status(502).json({ success: false, error: "Could not send your message. Please try again or email me directly." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Thank you! Your message has been sent.",
    });
  } catch {
    console.error("Contact email provider unavailable");
    res.status(502).json({
      success: false,
      error: "Could not send your message. Please try again or email me directly.",
    });
  }
}

async function rateLimit(req: any, origin: string, redisUrl: string, token: string) {
  const url = new URL(redisUrl);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) throw new Error("Invalid rate limiter URL");

  // Only trust forwarded IPs on Vercel, which overwrites this header. Local
  // requests use the socket address rather than user-controlled proxy headers.
  const rawIp = process.env.VERCEL === "1"
    ? String(req.headers?.["x-forwarded-for"] || "").split(",")[0].trim()
    : req.socket?.remoteAddress || "";
  if (!isIP(rawIp)) throw new Error("Client IP unavailable");
  const ip = isIP(rawIp) === 6 ? new URL(`http://[${rawIp}]/`).hostname : rawIp;
  const key = "contact:rate-limit:" + createHmac("sha256", token).update(`${origin}:${ip}`).digest("hex");
  const response = await fetch(url.href, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(["EVAL", RATE_LIMIT_SCRIPT, "1", key, String(RATE_LIMIT), String(RATE_WINDOW_SECONDS)]),
    signal: AbortSignal.timeout(5000),
  });
  const data = await response.json();
  const result = data?.result;
  if (!response.ok || data.error || !Array.isArray(result) || result.length !== 2 || ![0, 1].includes(result[0]) || !Number.isInteger(result[1]) || result[1] < 0 || result[1] > RATE_WINDOW_SECONDS) {
    throw new Error("Rate limiter failed");
  }
  return { allowed: result[0] === 1, retryAfter: Math.max(1, result[1]) };
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
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
