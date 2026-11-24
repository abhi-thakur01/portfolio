import sharp from "sharp";

// Every mutation below exists only in this browser test's memory. No GitHub
// request or write to the repository's actual JSON/media files is permitted.
export const imageBytes = await sharp({
  create: { width: 640, height: 360, channels: 3, background: "#2563eb" },
}).png().toBuffer();

export const imageFile = (name = "fixture-screen.png") => ({ name, mimeType: "image/png", buffer: imageBytes });

export const allowedFiles = [
  imageFile("allowed.png"),
  { name: "allowed.jpg", mimeType: "image/jpeg", buffer: await sharp(imageBytes).jpeg().toBuffer() },
  { name: "allowed.webp", mimeType: "image/webp", buffer: await sharp(imageBytes).webp().toBuffer() },
  { name: "allowed.gif", mimeType: "image/gif", buffer: await sharp(imageBytes).gif().toBuffer() },
  { name: "allowed.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n") },
];

export function projectFixture() {
  return {
    categories: [{ id: "React", label: "React", order: 1 }, { id: "CMS", label: "CMS", order: 2 }],
    items: [
      { id: "integr8-human-ai", title: "Fixture first project", category: "React", description: "An isolated first project.", platform: "React", image: "", imageAlt: "", tags: ["keep-first-tag"], link: "https://example.test/first", active: true, order: 1, detailDescription: "Preserve extended detail", highlights: ["Keep highlight"], features: ["Keep feature"], metrics: { label: "Keep metric", value: "100" }, detailTags: ["Keep detail tag"], detailCategory: "Keep category", url: "/projects/fixture", previewColor: "from-blue-600/30 to-transparent", customSentinel: "keep unknown fields" },
      { id: "ascension-aminos", title: "Fixture second project", category: "CMS", description: "An independent second project.", platform: "CMS", image: "/media/second-original.png", imageAlt: "Second original", tags: ["keep-second-tag"], link: "https://example.test/second", active: true, order: 2 },
    ],
  };
}

export function mediaFixture(name = "existing-screen.png", size = imageBytes.length) {
  const path = `public/media/${name}`;
  const isPdf = /\.pdf$/i.test(name);
  const mime = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", pdf: "application/pdf" }[name.split(".").pop()];
  return { name, path, url: `/media/${name}`, sha: `sha-${name}`, size, isPdf, mime, previewUrl: `/api/admin/media?path=${encodeURIComponent(path)}&sha=${encodeURIComponent(`sha-${name}`)}` };
}

export async function mockCms(page, { media = [], projects = projectFixture() } = {}) {
  const state = {
    media: structuredClone(media),
    projects: structuredClone(projects),
    contentSha: "fixture-projects-sha-1",
    uploads: [], deletes: [], publishes: [], reads: [],
    failList: false, conflictNextPublish: false, conflictNextReplace: false,
    denyReferencedDelete: false,
    rejectNextUploadContent: false,
    beforeList: null, beforeUpload: null, beforePublish: null,
  };
  await page.route("**/media/**", (route) => route.fulfill({ contentType: "image/png", body: imageBytes }));
  await page.route("https://fixture-images.example.test/**", (route) => route.fulfill({ contentType: "image/png", body: imageBytes }));
  await page.route("**/api/admin/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const method = request.method();
    const json = (body, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (url.pathname === "/api/admin/content") {
      const path = url.searchParams.get("path");
      if (method === "GET") {
        state.reads.push(path);
        const content = path === "content/projects.json" ? state.projects : path === "content/site.json" ? { sectionVisibility: { projects: true, blog: false } } : { displayName: "Isolated CMS fixture", name: "Isolated CMS fixture" };
        return json({ content: JSON.stringify(content), sha: path === "content/projects.json" ? state.contentSha : "fixture-other-sha" });
      }
      if (method === "PUT" && path === "content/projects.json") {
        const body = request.postDataJSON();
        state.publishes.push(body);
        if (state.beforePublish) await state.beforePublish();
        if (state.conflictNextPublish || body.sha !== state.contentSha) {
          state.conflictNextPublish = false;
          return json({ error: "Content changed in GitHub. Reload before publishing (SHA conflict)." }, 409);
        }
        state.projects = JSON.parse(body.content);
        state.contentSha = `fixture-projects-sha-${state.publishes.length + 1}`;
        return json({ success: true, sha: state.contentSha });
      }
      return json({ error: "Test prohibits writes outside its isolated projects fixture." }, 403);
    }
    if (url.pathname === "/api/admin/media") {
      if (method === "GET" && url.searchParams.has("path")) return route.fulfill({ contentType: "image/png", body: imageBytes });
      if (method === "GET") {
        if (state.beforeList) await state.beforeList();
        return state.failList ? json({ error: "Fixture media listing unavailable." }, 503) : json({ files: state.media });
      }
      if (method === "POST") {
        const body = request.postDataJSON();
        state.uploads.push(body);
        if (state.beforeUpload) await state.beforeUpload();
        if (state.rejectNextUploadContent) {
          state.rejectNextUploadContent = false;
          return json({ error: "File contents do not match the supported image type." }, 400);
        }
        if (state.conflictNextReplace) {
          state.conflictNextReplace = false;
          return json({ error: "Media changed in GitHub. Refresh before replacing (SHA conflict)." }, 409);
        }
        const existing = state.media.find((file) => file.name === body.name || file.path === body.replacePath);
        if (existing && !body.confirmReplace) return json({ error: "A file with this name already exists. Confirm replacement." }, 409);
        if (existing && body.sha !== existing.sha) return json({ error: "Media SHA conflict. Refresh before replacing." }, 409);
        const file = mediaFixture(existing?.name || body.name, Buffer.from(String(body.dataUrl || "").split(",")[1] || "", "base64").length);
        file.sha = `upload-sha-${state.uploads.length}`;
        file.previewUrl = `/api/admin/media?path=${encodeURIComponent(file.path)}&sha=${file.sha}`;
        state.media = [...state.media.filter((item) => item.path !== file.path), file];
        return json({ success: true, ...file });
      }
      if (method === "DELETE") {
        const body = request.postDataJSON();
        state.deletes.push(body);
        if (state.denyReferencedDelete) return json({ error: "This media is referenced by content and cannot be deleted." }, 409);
        const file = state.media.find((item) => item.path === body.path);
        if (!file || body.sha !== file.sha) return json({ error: "Media SHA conflict. Refresh before deleting." }, 409);
        state.media = state.media.filter((item) => item.path !== body.path);
        return json({ success: true });
      }
    }
    return json({ error: "Unexpected API request blocked by isolated browser fixture." }, 400);
  });
  return state;
}

export async function openSection(page, section) {
  const button = section === "Media" ? page.locator("#navMedia") : page.locator(`[data-f="content/${section.toLowerCase()}.json"]`);
  const menu = page.locator("#menu");
  if (await menu.isVisible() && !(await page.locator("#side").evaluate((element) => element.classList.contains("open")))) await menu.click();
  await button.click();
  // The CMS sidebar remains open on small screens; close it before editor work.
  if (await menu.isVisible() && await page.locator("#side").evaluate((element) => element.classList.contains("open"))) await page.keyboard.press("Escape");
}

export async function openCms(page) {
  // Vite's dev static middleware serves nested public HTML by explicit filename.
  // Vercel's canonical /admin/ route points to this same existing document.
  await page.goto("/admin/index.html");
  await page.locator("#navMedia").waitFor({ state: "attached" });
}

export async function openProject(page, index) {
  const card = page.locator(`[data-tg="${index}"]`);
  if (!(await page.locator(`[data-project-image="${index}"]`).isVisible())) await card.click();
}

export async function fixturePublicProjects(page, fixture) {
  await page.route("**/content/projects.json*", (route) => route.fulfill({
    contentType: "application/javascript",
    body: `export const items = ${JSON.stringify(fixture.items)}; export const categories = ${JSON.stringify(fixture.categories)}; export default { items, categories };`,
  }));
  await page.route("**/media/**", (route) => route.request().url().includes("missing")
    ? route.fulfill({ status: 404, body: "Fixture image unavailable" })
    : route.fulfill({ contentType: "image/png", body: imageBytes }));
  await page.route("https://fixture-images.example.test/**", (route) => route.fulfill({ contentType: "image/png", body: imageBytes }));
}
