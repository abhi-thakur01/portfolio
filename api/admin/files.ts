import { createDecipheriv, createHash } from "node:crypto";

const MANAGED_PATH = /^content\/(projects|services)\/[A-Za-z0-9_-]+\.json$/;

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
    return JSON.parse(Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8"));
  } catch {
    return null;
  }
}

function headers(token: string) {
  return { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "portfolio-cms" };
}
function repo() { return process.env.GITHUB_REPO || "abhi-thakur01/portfolio"; }
function validPath(path: string) { return MANAGED_PATH.test(path) && !path.includes(".."); }

export default async function handler(req: any, res: any) {
  const session = getSession(req);
  if (!session?.token || session.exp <= Date.now()) return res.status(401).json({ error: "Unauthorized" });
  try {
    if (req.method === "GET") {
      const result: any = {};
      for (const folder of ["projects", "services"]) {
        const url = `https://api.github.com/repos/${repo()}/contents/content/${folder}`;
        const r = await fetch(url, { headers: headers(session.token) });
        const d: any = await r.json();
        if (!r.ok) return res.status(r.status).json({ error: d.message || "Unable to list files" });
        result[folder] = (Array.isArray(d) ? d : []).filter((x: any) => x.type === "file" && x.name.endsWith(".json")).map((x: any) => ({ name: x.name, path: x.path, sha: x.sha }));
      }
      return res.status(200).json(result);
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const path = String(body.path || "");
    if (!validPath(path)) return res.status(400).json({ error: "Only project/service JSON files can be managed here" });
    const url = `https://api.github.com/repos/${repo()}/contents/${path}`;

    if (req.method === "POST") {
      if (!body.content || typeof body.content !== "object") return res.status(400).json({ error: "Valid JSON content is required" });
      const check = await fetch(url, { headers: headers(session.token) });
      if (check.status !== 404) return res.status(409).json({ error: "A file with that name already exists" });
      const r = await fetch(url, { method: "PUT", headers: { ...headers(session.token), "Content-Type": "application/json" }, body: JSON.stringify({ message: `cms: add ${path.replace("content/", "")}`, content: Buffer.from(JSON.stringify(body.content, null, 2), "utf8").toString("base64"), branch: process.env.GITHUB_BRANCH || "main" }) });
      const d: any = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: d.message || "GitHub create failed" });
      return res.status(201).json({ success: true, path, commit: d.commit?.sha || null });
    }

    if (req.method === "DELETE") {
      const current = await fetch(url, { headers: headers(session.token) });
      const currentData: any = await current.json();
      if (!current.ok) return res.status(current.status).json({ error: currentData.message || "File not found" });
      const r = await fetch(url, { method: "DELETE", headers: { ...headers(session.token), "Content-Type": "application/json" }, body: JSON.stringify({ message: `cms: delete ${path.replace("content/", "")}`, sha: currentData.sha, branch: process.env.GITHUB_BRANCH || "main" }) });
      const d: any = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: d.message || "GitHub delete failed" });
      return res.status(200).json({ success: true, commit: d.commit?.sha || null });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || "Request failed" });
  }
}
