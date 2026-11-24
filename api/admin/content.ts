import { createDecipheriv, createHash } from "node:crypto";

const CONTENT_PATH = /^content\/[A-Za-z0-9_./-]+\.json$/;

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

function branch() {
  return (process.env.GITHUB_BRANCH || "main").trim() || "main";
}

function validateProjectContent(value: any, currentValue: any) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("projects.json must contain a JSON object");
  if (!Array.isArray(value.categories)) throw new Error("projects.json categories must be an array");
  if (!Array.isArray(value.items)) throw new Error("projects.json items must be an array");

  const ids = new Set<string>();
  for (const category of value.categories) {
    if (!category || typeof category !== "object") throw new Error("Each project category must be an object");
    if (typeof category.id !== "string" || !category.id.trim()) throw new Error("Each project category requires an id");
    if (typeof category.label !== "string") throw new Error("Each project category requires a label");
  }

  for (const item of value.items) {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error("Each project must be an object");
    if (typeof item.id !== "string" || !item.id.trim()) throw new Error("Each project requires a non-empty id");
    if (ids.has(item.id)) throw new Error(`Duplicate project id: ${item.id}`);
    ids.add(item.id);
    for (const key of ["title", "description", "category", "platform", "image", "link"]) {
      if (typeof item[key] !== "string") throw new Error(`Project ${item.id} requires a string ${key}`);
    }
    if (!Array.isArray(item.tags) || item.tags.some((tag: any) => typeof tag !== "string")) {
      throw new Error(`Project ${item.id} tags must be an array of strings`);
    }
    if (item.order !== undefined && (typeof item.order !== "number" || !Number.isFinite(item.order))) {
      throw new Error(`Project ${item.id} order must be a number`);
    }
    if (item.active !== undefined && typeof item.active !== "boolean") {
      throw new Error(`Project ${item.id} active must be true or false`);
    }
    for (const key of ["detailDescription", "url", "detailCategory", "previewColor"]) {
      if (item[key] !== undefined && typeof item[key] !== "string") {
        throw new Error(`Project ${item.id} ${key} must be a string`);
      }
    }
    for (const key of ["detailTags", "highlights", "features"]) {
      if (item[key] !== undefined && (!Array.isArray(item[key]) || item[key].some((entry: any) => typeof entry !== "string"))) {
        throw new Error(`Project ${item.id} ${key} must be an array of strings`);
      }
    }
    if (item.metrics !== undefined) {
      if (!item.metrics || typeof item.metrics !== "object" || Array.isArray(item.metrics)
        || typeof item.metrics.label !== "string" || typeof item.metrics.value !== "string") {
        throw new Error(`Project ${item.id} metrics must contain string label and value fields`);
      }
    }
  }

  if (currentValue?.items && Array.isArray(currentValue.items)) {
    const existingIds = new Set<string>(
      currentValue.items
        .map((item: any) => item?.id)
        .filter((id: any): id is string => typeof id === "string" && id.length > 0)
    );
    for (const existingId of existingIds) {
      if (!ids.has(existingId)) throw new Error(`Existing project id cannot be removed: ${existingId}`);
    }
  }
}

function validateItemCollection(value: any, currentValue: any, path: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${path} must contain a JSON object`);
  }
  if (!Array.isArray(value.items)) {
    throw new Error(`${path} items must be an array`);
  }

  const ids = new Set<string>();
  for (const item of value.items) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error(`Each item in ${path} must be an object`);
    }
    if (typeof item.id !== "string" || !item.id.trim()) {
      throw new Error(`Each item in ${path} requires a non-empty id`);
    }
    if (ids.has(item.id)) throw new Error(`Duplicate id in ${path}: ${item.id}`);
    ids.add(item.id);
    if (item.active !== undefined && typeof item.active !== "boolean") {
      throw new Error(`Item ${item.id} active must be true or false`);
    }
    if (item.order !== undefined && (typeof item.order !== "number" || !Number.isFinite(item.order))) {
      throw new Error(`Item ${item.id} order must be a number`);
    }
  }

  if (currentValue?.items && Array.isArray(currentValue.items)) {
    const existingIds = new Set<string>(
      currentValue.items
        .map((item: any) => item?.id)
        .filter((id: any): id is string => typeof id === "string" && id.length > 0)
    );
    for (const existingId of existingIds) {
      if (!ids.has(existingId)) throw new Error(`Existing id cannot be removed from ${path}: ${existingId}`);
    }
  }
}

function validateSimpleArrayCollection(value: any, key: "roles" | "addresses", path: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${path} must contain a JSON object`);
  }
  if (!Array.isArray(value[key])) {
    throw new Error(`${path} ${key} must be an array`);
  }
  if (value[key].some((entry: any) => typeof entry !== "string")) {
    throw new Error(`${path} ${key} must contain only strings`);
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  const session = getSession(req);
  if (!session?.token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const path = String(req.query?.path || "");
  if (!CONTENT_PATH.test(path) || path.includes("..")) {
    res.status(400).json({ error: "File is not editable from the CMS" });
    return;
  }

  const url = `https://api.github.com/repos/${repo()}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`;
  try {
    if (req.method === "GET") {
      const response = await fetch(`${url}?ref=${encodeURIComponent(branch())}`, { headers: apiHeaders(session.token) });
      const data: any = await response.json();
      if (!response.ok) { res.status(response.status).json({ error: data.message || "GitHub request failed" }); return; }
      const content = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8");
      res.status(200).json({ path, content, sha: data.sha });
      return;
    }

    if (req.method === "PUT") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const content = String(body.content || "");
      const submittedSha = typeof body.sha === "string" ? body.sha : "";
      const parsedContent = JSON.parse(content);
      const current = await fetch(`${url}?ref=${encodeURIComponent(branch())}`, { headers: apiHeaders(session.token) });
      const currentData: any = await current.json();
      if (!current.ok) { res.status(current.status).json({ error: currentData.message || "Unable to read current file" }); return; }
      if (!submittedSha) {
        res.status(409).json({ error: "Save conflict: reload this content before publishing.", code: "STALE_SAVE" });
        return;
      }
      if (submittedSha !== currentData.sha) {
        res.status(409).json({
          error: "Save conflict: this file changed on GitHub. Reload the latest content before publishing.",
          code: "STALE_SAVE",
        });
        return;
      }
      let currentContent: any = null;
      if (path === "content/projects.json") {
        try {
          currentContent = JSON.parse(Buffer.from(currentData.content.replace(/\n/g, ""), "base64").toString("utf8"));
        } catch {
          throw new Error("Unable to validate the existing projects.json");
        }
        validateProjectContent(parsedContent, currentContent);
      }
      if (path === "content/education.json" || path === "content/certifications.json") {
        try {
          currentContent = JSON.parse(Buffer.from(currentData.content.replace(/\n/g, ""), "base64").toString("utf8"));
        } catch {
          throw new Error(`Unable to validate the existing ${path}`);
        }
        validateItemCollection(parsedContent, currentContent, path);
      }
      if (path === "content/roles.json") {
        try {
          currentContent = JSON.parse(Buffer.from(currentData.content.replace(/\n/g, ""), "base64").toString("utf8"));
        } catch {
          throw new Error("Unable to validate the existing content/roles.json");
        }
        validateSimpleArrayCollection(parsedContent, "roles", path);
      }
      if (path === "content/addresses.json") {
        try {
          currentContent = JSON.parse(Buffer.from(currentData.content.replace(/\n/g, ""), "base64").toString("utf8"));
        } catch {
          throw new Error("Unable to validate the existing content/addresses.json");
        }
        validateSimpleArrayCollection(parsedContent, "addresses", path);
      }
      const response = await fetch(url, {
        method: "PUT",
        headers: { ...apiHeaders(session.token), "Content-Type": "application/json" },
        body: JSON.stringify({ message: `cms: update ${path.replace("content/", "")}`, content: Buffer.from(content, "utf8").toString("base64"), sha: currentData.sha, branch: branch() }),
      });
      const data: any = await response.json();
      if (!response.ok) { res.status(response.status).json({ error: data.message || "GitHub update failed" }); return; }
      res.status(200).json({ success: true, commit: data.commit?.sha || null, sha: data.content?.sha || currentData.sha });
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    res.status(400).json({ error: error?.message || "Invalid request" });
  }
}
