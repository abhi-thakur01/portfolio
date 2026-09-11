import { createCipheriv, createHash, randomBytes } from "node:crypto";

function cookieValue(header: string | undefined, name: string) {
  const match = header?.split(";").map((v: string) => v.trim()).find((v: string) => v.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

function encrypt(value: string) {
  const secret = process.env.CMS_SESSION_SECRET;
  if (!secret) throw new Error("CMS_SESSION_SECRET is not configured");
  const key = createHash("sha256").update(secret).digest();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const code = String(req.query?.code || "");
  const state = String(req.query?.state || "");
  const savedState = cookieValue(req.headers.cookie, "cms_oauth_state");
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

  if (!code || !state || !savedState || state !== savedState || !clientId || !clientSecret) {
    res.status(400).send("Invalid CMS OAuth request.");
    return;
  }

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, state }),
    });
    const tokenData: any = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) throw new Error("GitHub authorization failed");

    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenData.access_token}`, Accept: "application/vnd.github+json", "User-Agent": "portfolio-cms" },
    });
    const user: any = await userResponse.json();
    const allowed = (process.env.CMS_GITHUB_USERNAME || "").trim().toLowerCase();

    if (!userResponse.ok || !user.login || !allowed || String(user.login).toLowerCase() !== allowed) {
      res.status(403).send("This GitHub account is not authorized to access the portfolio CMS.");
      return;
    }

    const session = encrypt(JSON.stringify({ token: tokenData.access_token, login: user.login, exp: Date.now() + 1000 * 60 * 60 * 8 }));
    res.setHeader("Set-Cookie", [
      `cms_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
      `cms_session=${session}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=28800`,
    ]);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).end(`<!doctype html><html><body><script>window.location.replace('/admin/');</script><p>Login successful. Redirecting…</p></body></html>`);
  } catch (error: any) {
    res.status(500).send(error?.message || "CMS authorization failed.");
  }
}
