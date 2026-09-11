import { createDecipheriv, createHash } from "node:crypto";

const ALLOWED_FILES = new Set([
  "content/personal.json",
  "content/roles.json",
  "content/addresses.json",
  "content/faqs.json",
  "content/nav.json",
  "content/hero.json",
  "content/skills.json",
  "content/about.json",
  "content/process.json",
  "content/seo.json",
]);

function getSession(req: any) {
  const raw = req.headers.cookie?.split(";").map((v: string) => v.trim()).find((v: string) => v.startsWith("cms_session="));
  if (!raw) return null;
  try {
    const encoded = decodeURIComponent(raw.slice("cms_session=".length));
    const data = Buffer.from(encoded, "base64url");
    const secret = process.env.CMS_SESSION_SECRET;
    if (!secret || data.length < 28) return null;
    const key = createHash("sha256").update(secret).digest();
    const iv = data.subarray(0, 12);
    const tag = data.subarray(12, 28);
    const encrypted = data.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const session = JSON.parse(Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8"));
    return session.exp > Date.now() ? session : null;
  } catch {
    return null;
  }
}

function apiHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "portfolio-cms" };
}

function repo() {
  return process.env.GITHUB_REPO || "abhi-thakur01/portfolio";
}

export default async function handler(req: any, res: any) {
  const session = getSession(req);
  if (!session?.token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const path = String(req.query?.path || "");
  if (!ALLOWED_FILES.has(path)) {
    res.status(400).json({ error: "File is not editable from the CMS" });
    return;
  }

  const url = `https://api.github.com/repos/${repo()}/contents/${path}`;
  try {
    if (req.method === "GET") {
      const response = await fetch(url, { headers: apiHeaders(session.token) });
      const data: any = await response.json();
      if (!response.ok) { res.status(response.status).json({ error: data.message || "GitHub request failed" }); return; }
      const content = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8");
      res.status(200).json({ path, content, sha: data.sha });
      return;
    }

    if (req.method === "PUT") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const content = String(body.content || "");
      JSON.parse(content);
      const current = await fetch(url, { headers: apiHeaders(session.token) });
      const currentData: any = await current.json();
      if (!current.ok) { res.status(current.status).json({ error: currentData.message || "Unable to read current file" }); return; }
      const response = await fetch(url, {
        method: "PUT",
        headers: { ...apiHeaders(session.token), "Content-Type": "application/json" },
        body: JSON.stringify({ message: `cms: update ${path.replace("content/", "")}`, content: Buffer.from(content, "utf8").toString("base64"), sha: currentData.sha, branch: process.env.GITHUB_BRANCH || "main" }),
      });
      const data: any = await response.json();
      if (!response.ok) { res.status(response.status).json({ error: data.message || "GitHub update failed" }); return; }
      res.status(200).json({ success: true, commit: data.commit?.sha || null });
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    res.status(400).json({ error: error?.message || "Invalid request" });
  }
}
