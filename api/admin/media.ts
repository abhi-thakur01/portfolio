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
const branch = () => (process.env.GITHUB_BRANCH || "main").trim() || "main";
const headers = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "portfolio-cms",
});

const MAX_MEDIA_BYTES = 3 * 1024 * 1024;
const DATA_URL =
  /^data:(image\/(?:png|jpeg|jpg|webp|gif)|application\/pdf);base64,([A-Za-z0-9+/]*={0,2})$/i;

function safeName(name: string) {
  return name
    .normalize("NFKC")
    .replace(/[^A-Za-z0-9._-]/g, "-")
    .replace(/\.{2,}/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 120);
}

function validMediaType(name: string, mime: string, bytes: Buffer) {
  const lower = name.toLowerCase();
  if (mime === "image/png" && lower.endsWith(".png") &&
    bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return "png";
  if ((mime === "image/jpeg" || mime === "image/jpg") && /\.jpe?g$/i.test(lower) &&
    bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "jpg";
  if (mime === "image/gif" && /\.gif$/i.test(lower) &&
    (bytes.subarray(0, 6).toString("ascii") === "GIF87a" || bytes.subarray(0, 6).toString("ascii") === "GIF89a")) return "gif";
  if (mime === "image/webp" && /\.webp$/i.test(lower) &&
    bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
    bytes.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  if (mime === "application/pdf" && /\.pdf$/i.test(lower) &&
    bytes.subarray(0, 5).toString("ascii") === "%PDF-") return "pdf";
  return null;
}

function safeMediaPath(path: string) {
  return /^public\/media\/[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(path) &&
    !path.includes("..") &&
    path.startsWith("public/media/");
}

async function listContentReferences(token: string): Promise<string[]> {
  const refs: string[] = [];
  async function walk(folder: string) {
    const r = await fetch(
      `https://api.github.com/repos/${repo()}/contents/${folder}?ref=${encodeURIComponent(branch())}`,
      { headers: headers(token) }
    );
    const data: any = await r.json();
    if (!r.ok) return;
    for (const item of Array.isArray(data) ? data : []) {
      if (item.type === "dir") await walk(item.path);
      if (item.type === "file" && /\.json$/i.test(item.name)) {
        const file = await fetch(
          `https://api.github.com/repos/${repo()}/contents/${item.path}?ref=${encodeURIComponent(branch())}`,
          { headers: headers(token) }
        );
        const meta: any = await file.json();
        if (file.ok && typeof meta.content === "string") {
          const text = Buffer.from(meta.content.replace(/\n/g, ""), "base64").toString("utf8");
          refs.push(text);
          try {
            const parsed = JSON.parse(text);
            refs.push(JSON.stringify(parsed));
          } catch {}
        }
      }
    }
  }
  await walk("content");
  return refs;
}

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  const session = getSession(req);
  if (!session?.token) return res.status(401).json({ error: "Unauthorized" });
  const base = `https://api.github.com/repos/${repo()}/contents/public/media?ref=${encodeURIComponent(branch())}`;

  try {
    if (req.method === "GET") {
      const r = await fetch(base, { headers: headers(session.token) });
      if (r.status === 404) return res.status(200).json({ files: [] });
      const data: any = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: data.message || "Unable to load media" });
      const files = (Array.isArray(data) ? data : [])
        .filter((f: any) => f.type === "file")
        .map((f: any) => ({
          name: f.name,
          path: f.path,
          url: `/${f.path.replace(/^public\//, "")}`,
          sha: f.sha,
          isPdf: /\.pdf$/i.test(f.name),
        }));
      return res.status(200).json({ files });
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const name = safeName(String(body.name || ""));
      const dataUrl = String(body.dataUrl || "");
      const match = dataUrl.match(DATA_URL);
      if (!name || !match) {
        return res.status(400).json({ error: "Use PNG, JPG, WEBP, GIF, or PDF. SVG uploads are not supported." });
      }
      const encoded = dataUrl.split(",")[1];
      const bytes = Buffer.from(encoded || "", "base64");
      if (!encoded || bytes.length === 0) {
        return res.status(400).json({ error: "Malformed file content." });
      }
      if (bytes.length > MAX_MEDIA_BYTES) {
        return res.status(413).json({ error: "File is too large. The effective upload limit is 3 MB." });
      }
      const mime = match[1].toLowerCase();
      if (!validMediaType(name, mime, bytes)) {
        return res.status(400).json({ error: "File content does not match its MIME type or extension." });
      }

      const replacePath = typeof body.replacePath === "string" ? body.replacePath : "";
      let sha: string | undefined;
      if (replacePath) {
        if (!safeMediaPath(replacePath)) return res.status(400).json({ error: "Invalid replacement media path." });
        if (body.confirmReplace !== true) return res.status(409).json({ error: "Confirm replacement before overwriting an existing file.", code: "CONFIRM_REPLACE" });
        if (typeof body.sha !== "string" || !body.sha) return res.status(409).json({ error: "A media SHA is required to replace a file.", code: "STALE_MEDIA" });
        const current = await fetch(
          `https://api.github.com/repos/${repo()}/contents/${replacePath}?ref=${encodeURIComponent(branch())}`,
          { headers: headers(session.token) }
        );
        const currentData: any = await current.json();
        if (!current.ok) return res.status(current.status).json({ error: currentData.message || "Media file not found." });
        if (body.sha !== currentData.sha) {
          return res.status(409).json({ error: "Media changed on GitHub. Reload the media library before replacing it.", code: "STALE_MEDIA" });
        }
        sha = currentData.sha;
      }

      const path = replacePath || `public/media/${Date.now()}-${name}`;
      if (!replacePath) {
        const existing = await fetch(
          `https://api.github.com/repos/${repo()}/contents/${path}?ref=${encodeURIComponent(branch())}`,
          { headers: headers(session.token) }
        );
        if (existing.status !== 404) {
          return res.status(409).json({ error: "A file with this generated path already exists.", code: "MEDIA_CONFLICT" });
        }
      }
      const r = await fetch(`https://api.github.com/repos/${repo()}/contents/${replacePath || path}`, {
        method: "PUT",
        headers: { ...headers(session.token), "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `cms: upload media ${name}`,
          content: bytes.toString("base64"),
          branch: branch(),
          ...(sha ? { sha } : {}),
        }),
      });
      const result: any = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: result.message || "Media upload failed" });
      return res.status(200).json({
        success: true,
        path,
        url: `/${path.replace(/^public\//, "")}`,
        commit: result.commit?.sha || null,
      });
    }

    if (req.method === "DELETE") {
      const path = String(req.query?.path || (typeof req.body === "object" && req.body?.path) || "");
      if (!safeMediaPath(path)) {
        return res.status(400).json({ error: "Invalid media path" });
      }
      const r = await fetch(
        `https://api.github.com/repos/${repo()}/contents/${path}?ref=${encodeURIComponent(branch())}`,
        { headers: headers(session.token) }
      );
      const current: any = await r.json();
      if (!r.ok) return res.status(r.status).json({ error: current.message || "Media not found" });
      const submittedSha =
        typeof req.body === "object" && req.body && typeof req.body.sha === "string"
          ? req.body.sha
          : "";
      if (!submittedSha) return res.status(409).json({ error: "A media SHA is required to delete a file.", code: "STALE_MEDIA" });
      if (submittedSha !== current.sha) {
        return res.status(409).json({ error: "Media changed on GitHub. Reload the media library before deleting it.", code: "STALE_MEDIA" });
      }
      const refs = await listContentReferences(session.token);
      const mediaUrl = `/${path.replace(/^public\//, "")}`;
      if (refs.some((text) => text.includes(path) || text.includes(mediaUrl))) {
        return res.status(409).json({ error: "This media file is referenced by portfolio content and cannot be deleted.", code: "MEDIA_REFERENCED" });
      }
      const del = await fetch(`https://api.github.com/repos/${repo()}/contents/${path}`, {
        method: "DELETE",
        headers: { ...headers(session.token), "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `cms: delete media ${path.split("/").pop()}`,
          sha: submittedSha,
          branch: branch(),
        }),
      });
      const result: any = await del.json();
      if (!del.ok) return res.status(del.status).json({ error: result.message || "Media delete failed" });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(400).json({ error: error?.message || "Media request failed" });
  }
}
