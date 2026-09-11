import { randomBytes } from "node:crypto";

export default function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    res.status(500).json({ error: "GITHUB_OAUTH_CLIENT_ID is not configured" });
    return;
  }

  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const redirectUri = `${proto}://${host}/api/admin/callback`;
  const state = randomBytes(24).toString("hex");

  res.setHeader(
    "Set-Cookie",
    `cms_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "public_repo",
    state,
  });

  res.status(302).setHeader(
    "Location",
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
  res.end();
}
