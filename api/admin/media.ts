import { createDecipheriv, createHash } from "node:crypto";

function getSession(req: any) {
  const raw = req.headers.cookie?.split(";").map((v: string) => v.trim()).find((v: string) => v.startsWith("cms_session="));
  if (!raw) return null;
  try {
    const encoded = decodeURIComponent(raw.slice("cms_session=".length));
    const data = Buffer.from(encoded, "base64url");
    const secret = process.env.CMS_SESSION_SECRET;
    if (!secret || data.length < 28) return null;
    const key = createHash("sha256").update(secret).digest();
    const decipher = createDecipheriv("aes-256-gcm", key, data.subarray(0, 12));
    decipher.setAuthTag(data.subarray(12, 28));
    const session = JSON.parse(Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]).toString("utf8"));
    return session.exp > Date.now() ? session : null;
  } catch { return null; }
}

const repo = () => process.env.GITHUB_REPO || "abhi-thakur01/portfolio";
const headers = (token: string) => ({ Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "portfolio-cms" });

export default async function handler(req: any, res: any) {
  const session = getSession(req);
  if (!session?.token) return res.status(401).json({ error: "Unauthorized" });
  const base = `https://api.github.com/repos/${repo()}/contents/public/media`;

  try {
    if (req.method === "GET") {
      const r = await fetch(base, { headers: headers(session.token) });
      if (r.status === 404) return res.status(200).json({ files: [] });
      const data: any = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: data.message || "Unable to load media" });
      const files = (Array.isArray(data) ? data : []).filter((f: any) => f.type === "file").map((f: any) => ({ name: f.name, path: f.path, url: `/${f.path.replace(/^public\//, "")}`, sha: f.sha }));
      return res.status(200).json({ files });
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const name = String(body.name || "").replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 120);
      const dataUrl = String(body.dataUrl || "");
      if (!name || !/^data:image\/(png|jpeg|jpg|webp|gif);base64,/.test(dataUrl)) return res.status(400).json({ error: "Use a PNG, JPG, WEBP or GIF image." });
      const encoded = dataUrl.split(",")[1];
      if (!encoded || Buffer.byteLength(encoded, "base64") > 4 * 1024 * 1024) return res.status(413).json({ error: "Image is too large. Keep it under 4 MB." });
      const path = `public/media/${Date.now()}-${name}`;
      const r = await fetch(`https://api.github.com/repos/${repo()}/contents/${path}`, { method: "PUT", headers: { ...headers(session.token), "Content-Type": "application/json" }, body: JSON.stringify({ message: `cms: upload media ${name}`, content: encoded, branch: process.env.GITHUB_BRANCH || "main" }) });
      const result: any = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: result.message || "Media upload failed" });
      return res.status(200).json({ success: true, path, url: `/${path.replace(/^public\//, "")}`, commit: result.commit?.sha || null });
    }

    if (req.method === "DELETE") {
      const path = String(req.query?.path || "");
      if (!/^public\/media\/[A-Za-z0-9._/-]+$/.test(path) || path.includes("..")) return res.status(400).json({ error: "Invalid media path" });
      const r = await fetch(`https://api.github.com/repos/${repo()}/contents/${path}`, { headers: headers(session.token) });
      const current: any = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: current.message || "Media not found" });
      const del = await fetch(`https://api.github.com/repos/${repo()}/contents/${path}`, { method: "DELETE", headers: { ...headers(session.token), "Content-Type": "application/json" }, body: JSON.stringify({ message: `cms: delete media ${path.split("/").pop()}`, sha: current.sha, branch: process.env.GITHUB_BRANCH || "main" }) });
      const result: any = await del.json();
      if (!del.ok) return res.status(del.status).json({ error: result.message || "Media delete failed" });
      return res.status(200).json({ success: true });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(400).json({ error: error?.message || "Media request failed" });
  }
}
