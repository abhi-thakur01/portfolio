import { expect, test } from "@playwright/test";
import { allowedFiles, fixturePublicProjects, imageBytes, imageFile, mediaFixture, mockCms, openCms, openProject, openSection, projectFixture } from "./fixtures.mjs";

async function publish(page) {
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#pub").click();
}

async function chooseFile(page, button, file) {
  const chooser = page.waitForEvent("filechooser");
  await button.click();
  await (await chooser).setFiles(file);
}

async function expectNoHorizontalOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
}

test("empty media retains Upload Media, drop area and refresh controls", async ({ page }, testInfo) => {
  await mockCms(page);
  await openCms(page);
  await openSection(page, "Media");
  await expect(page.locator("#mediaUploadLabel")).toBeVisible();
  await expect(page.locator("#mediaUploadLabel")).toContainText("Upload Media");
  await expect(page.locator("#mediaDropZone")).toBeVisible();
  await expect(page.locator("#refreshMedia")).toBeVisible();
  await expect(page.locator(".media-card")).toHaveCount(0);
  await expect(page.locator("#editor")).toContainText(/No (files|media)/i);
  await expect(page.locator("#mediaFile")).toHaveAttribute("multiple", "");
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath("media-empty.png"), fullPage: true });
});

test("populated media lists repository metadata, searches, filters, previews and copies URLs", async ({ page, context }, testInfo) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const image = mediaFixture();
  const pdf = mediaFixture("fixture-guide.pdf", 1024);
  await mockCms(page, { media: [image, pdf] });
  await openCms(page);
  await openSection(page, "Media");
  await expect(page.locator(".media-card")).toHaveCount(2);
  await expect(page.locator("#editor")).toContainText(image.name);
  await expect(page.locator("#editor")).toContainText(pdf.name);
  await expect(page.locator("#editor")).toContainText(/PNG|image\/png/i);
  await expect(page.locator("#editor")).toContainText(/KB|KiB|bytes| B\b/i);
  const thumbnail = page.locator(".media-card img").first();
  await expect(thumbnail).toBeVisible();
  await expect.poll(() => thumbnail.evaluate((element) => element.naturalWidth)).toBeGreaterThan(0);
  await page.locator("#mediaSearch").fill("guide");
  await expect(page.locator(".media-card")).toHaveCount(1);
  await expect(page.locator(".media-card")).toContainText(pdf.name);
  await page.locator("#mediaSearch").fill("");
  await page.locator("#mediaTypeFilter").selectOption("images");
  await expect(page.locator(".media-card")).toHaveCount(1);
  await expect(page.locator(".media-card")).toContainText(image.name);
  await page.locator(`[data-previewmedia="${image.path}"]`).click();
  await expect(page.locator("#mediaDialog")).toBeVisible();
  await expect(page.locator("#mediaDialog img")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mediaDialog")).not.toBeVisible();
  await page.locator(`[data-copy="${image.url}"]`).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(image.url);
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath("media-populated.png"), fullPage: true });
});

test("single, multiple and dropped uploads make individual API calls with accurate status", async ({ page }) => {
  const state = await mockCms(page);
  await openCms(page);
  await openSection(page, "Media");
  await page.locator("#mediaFile").setInputFiles(imageFile("single.png"));
  await expect.poll(() => state.uploads.length).toBe(1);
  await expect(page.locator(".media-card")).toHaveCount(1);
  await page.locator("#mediaFile").setInputFiles([imageFile("multiple-one.png"), imageFile("multiple-two.png")]);
  await expect.poll(() => state.uploads.length).toBe(3);
  await expect(page.locator(".media-card")).toHaveCount(3);
  await expect(page.locator("#mediaStatus")).toContainText(/2 of 2 files saved to GitHub/i);
  const dragData = await page.evaluateHandle((base64) => {
    const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
    const transfer = new DataTransfer();
    transfer.items.add(new File([bytes], "dropped.png", { type: "image/png" }));
    return transfer;
  }, imageBytes.toString("base64"));
  await page.locator("#mediaDropZone").dispatchEvent("drop", { dataTransfer: dragData });
  await expect.poll(() => state.uploads.length).toBe(4);
  await expect(page.locator(".media-card")).toHaveCount(4);
  for (const upload of state.uploads) {
    expect(Array.isArray(upload)).toBe(false);
    expect(upload.dataUrl).toMatch(/^data:image\/png;base64,/);
    expect(Buffer.from(upload.dataUrl.split(",")[1], "base64").length).toBeLessThanOrEqual(3 * 1024 * 1024);
  }
  await expect(page.locator("#mediaStatus")).toContainText(/1 of 1 files saved to GitHub/i);
});

test("invalid MIME, unsafe SVG and oversized files are rejected without uploads", async ({ page }) => {
  const state = await mockCms(page);
  await openCms(page);
  await openSection(page, "Media");
  for (const file of [
    { name: "unsafe.svg", mimeType: "image/svg+xml", buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>') },
    { name: "invalid.txt", mimeType: "text/plain", buffer: Buffer.from("invalid") },
    { name: "oversized.png", mimeType: "image/png", buffer: Buffer.alloc(3 * 1024 * 1024 + 1) },
  ]) {
    await page.locator("#mediaFile").setInputFiles(file);
    await expect(page.locator(".media-reports")).toContainText(/disabled|supported|allowed|3 (MB|MiB)|large|maximum/i);
    expect(state.uploads).toHaveLength(0);
  }
});

test("all five allowed formats upload and backend content rejection is reported accurately", async ({ page }) => {
  const state = await mockCms(page);
  await openCms(page);
  await openSection(page, "Media");
  state.rejectNextUploadContent = true;
  await page.locator("#mediaFile").setInputFiles({ name: "spoofed.png", mimeType: "image/png", buffer: Buffer.from("not a PNG file") });
  await expect(page.locator(".media-reports")).toContainText("File contents do not match");
  await expect(page.locator(".media-card")).toHaveCount(0);
  await expect(page.locator("#mediaStatus")).toHaveClass(/error/);
  await page.locator("#mediaFile").setInputFiles(allowedFiles);
  await expect(page.locator(".media-card")).toHaveCount(5);
  await expect(page.locator("#mediaStatus")).toContainText("5 of 5 files saved to GitHub");
  expect(state.uploads).toHaveLength(6);
  expect(state.uploads.slice(1).map((upload) => upload.dataUrl.split(";")[0])).toEqual(["data:image/png", "data:image/jpeg", "data:image/webp", "data:image/gif", "data:application/pdf"]);
});

test("duplicate filenames require replacement confirmation before a SHA-protected write", async ({ page }) => {
  const existing = mediaFixture("existing-screen.png");
  const state = await mockCms(page, { media: [existing] });
  await openCms(page);
  await openSection(page, "Media");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.locator("#mediaFile").setInputFiles(imageFile(existing.name));
  await expect(page.locator(".media-reports")).toContainText("Cancelled");
  expect(state.uploads).toHaveLength(0);
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#mediaFile").setInputFiles(imageFile(existing.name));
  await expect.poll(() => state.uploads.length).toBe(1);
  expect(state.uploads[0]).toMatchObject({ replacePath: existing.path, sha: existing.sha, confirmReplace: true });
  await expect(page.locator(".media-card")).toHaveCount(1);
});

test("media replacement and deletion keep SHA safeguards and deletion confirmation", async ({ page }) => {
  const image = mediaFixture();
  const state = await mockCms(page, { media: [image] });
  await openCms(page);
  await openSection(page, "Media");
  page.on("dialog", (dialog) => dialog.accept());
  await chooseFile(page, page.locator(`[data-replacemedia="${image.path}"]`), imageFile("replacement.png"));
  await expect.poll(() => state.uploads.length).toBe(1);
  expect(state.uploads[0]).toMatchObject({ sha: image.sha, confirmReplace: true });
  await expect(page.locator(".media-card")).toHaveCount(1);
  state.denyReferencedDelete = true;
  await page.locator(`[data-delmedia="${image.path}"]`).click();
  await expect.poll(() => state.deletes.length).toBe(1);
  expect(state.deletes[0]).toEqual({ path: image.path, sha: state.media[0].sha });
  await expect(page.locator("#mediaStatus")).toContainText(/referenced/i);
  await expect(page.locator(".media-card")).toHaveCount(1);
  state.denyReferencedDelete = false;
  await page.locator(`[data-delmedia="${image.path}"]`).click();
  await expect(page.locator(".media-card")).toHaveCount(0);
  await expect(page.locator("#mediaUploadLabel")).toBeVisible();
});

test("media replacement reports a SHA conflict without removing media", async ({ page }) => {
  const image = mediaFixture();
  const state = await mockCms(page, { media: [image] });
  await openCms(page);
  await openSection(page, "Media");
  state.conflictNextReplace = true;
  page.on("dialog", (dialog) => dialog.accept());
  await chooseFile(page, page.locator(`[data-replacemedia="${image.path}"]`), imageFile());
  await expect(page.locator(".media-reports")).toContainText(/SHA conflict/i);
  await expect(page.locator(".media-card")).toHaveCount(1);
  expect(state.media[0].sha).toBe(image.sha);
});

test("media errors retain controls and refresh recovers the listing", async ({ page }) => {
  const state = await mockCms(page, { media: [mediaFixture()] });
  state.failList = true;
  await openCms(page);
  await openSection(page, "Media");
  await expect(page.locator("#editor")).toContainText(/unavailable/i);
  await expect(page.locator("#mediaUploadLabel")).toBeVisible();
  state.failList = false;
  await page.locator("#refreshMedia").click();
  await expect(page.locator(".media-card")).toHaveCount(1);
  state.media = [];
  await page.locator("#refreshMedia").click();
  await expect(page.locator("#editor")).toContainText("No files yet.");
  await expect(page.locator("#editor")).not.toContainText(/Unable to load media|unavailable/i);
});

test("media loading is visible and cancellation prevents any deletion request", async ({ page }) => {
  const image = mediaFixture();
  const state = await mockCms(page, { media: [image] });
  let releaseList;
  state.beforeList = () => new Promise((resolve) => { releaseList = resolve; });
  await openCms(page);
  await openSection(page, "Media");
  await expect(page.locator("#editor")).toContainText("Loading media");
  await expect(page.locator("#mediaUploadLabel")).toBeVisible();
  state.beforeList = null;
  releaseList();
  await expect(page.locator(".media-card")).toHaveCount(1);
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.locator(`[data-delmedia="${image.path}"]`).click();
  expect(state.deletes).toHaveLength(0);
  await expect(page.locator(".media-card")).toHaveCount(1);
});

test("uploads and publishing block section changes until their request finishes", async ({ page }) => {
  const state = await mockCms(page);
  let releaseUpload;
  state.beforeUpload = () => new Promise((resolve) => { releaseUpload = resolve; });
  await openCms(page);
  await openSection(page, "Projects");
  await openProject(page, 0);
  await chooseFile(page, page.locator('[data-project-upload="0"]'), imageFile("in-flight.png"));
  await expect.poll(() => state.uploads.length).toBe(1);
  await expect(page.locator('[data-project-status="0"]')).toContainText(/Uploading/i);
  await openSection(page, "Media");
  await expect(page.locator(".top h1")).toHaveText("Projects");
  state.beforeUpload = null;
  releaseUpload();
  await expect(page.locator('[data-project-url="0"]')).toHaveValue("/media/in-flight.png");
  let releasePublish;
  state.beforePublish = () => new Promise((resolve) => { releasePublish = resolve; });
  await publish(page);
  await expect.poll(() => state.publishes.length).toBe(1);
  await expect(page.locator("#pub")).toBeDisabled();
  await openSection(page, "Media");
  await expect(page.locator(".top h1")).toHaveText("Projects");
  state.beforePublish = null;
  releasePublish();
  await expect(page.locator("#status")).toContainText(/Published successfully/i);
});

test("project direct upload, replacement, removal and publish preserve all other project data", async ({ page }, testInfo) => {
  const original = projectFixture();
  const state = await mockCms(page, { projects: original });
  await openCms(page);
  await openSection(page, "Projects");
  await openProject(page, 0);
  await expect(page.locator(`input[readonly][value="${original.items[0].id}"]`)).toBeVisible();
  await chooseFile(page, page.locator('[data-project-upload="0"]'), imageFile("project-first.png"));
  await expect(page.locator('[data-project-url="0"]')).toHaveValue("/media/project-first.png");
  await expect(page.locator('[data-project-image="0"] img')).toBeVisible();
  await expect(page.locator("#status")).toContainText(/Unsaved/i);
  expect(state.publishes).toHaveLength(0);
  await page.locator('[data-project-alt="0"]').fill("Fixture first project screenshot");
  await chooseFile(page, page.locator('[data-project-replace="0"]'), imageFile("project-replaced.png"));
  await expect(page.locator('[data-project-url="0"]')).toHaveValue("/media/project-replaced.png");
  await publish(page);
  await expect(page.locator("#status")).toContainText(/Published successfully/i);
  expect(state.publishes[0].sha).toBe("fixture-projects-sha-1");
  expect(state.projects.items[0]).toEqual({ ...original.items[0], image: "/media/project-replaced.png", imageAlt: "Fixture first project screenshot" });
  expect(state.projects.items[1]).toEqual(original.items[1]);
  expect(state.projects.items.map((project) => project.id)).toEqual(original.items.map((project) => project.id));
  await page.reload();
  await openSection(page, "Projects");
  await openProject(page, 0);
  await expect(page.locator('[data-project-url="0"]')).toHaveValue("/media/project-replaced.png");
  await expect(page.locator('[data-project-alt="0"]')).toHaveValue("Fixture first project screenshot");
  await expectNoHorizontalOverflow(page);
  await page.locator('[data-project-image="0"]').screenshot({ path: testInfo.outputPath("project-image-editor.png") });
  await page.locator('[data-project-remove="0"]').click();
  await expect(page.locator('[data-project-url="0"]')).toHaveValue("");
  await expect(page.locator('[data-project-image="0"] img')).toHaveCount(0);
  await publish(page);
  await expect(page.locator("#status")).toContainText(/Published successfully/i);
  expect(state.projects.items[0].image).toBe("");
  expect(state.projects.items[1]).toEqual(original.items[1]);
});

test("image selection searches image-only media and assigns the correct project including new projects", async ({ page }) => {
  const image = mediaFixture();
  const state = await mockCms(page, { media: [image, mediaFixture("second-choice.png"), mediaFixture("guide.pdf")] });
  await openCms(page);
  await openSection(page, "Projects");
  await openProject(page, 1);
  await page.locator('[data-project-select="1"]').click();
  await expect(page.locator("#mediaDialog")).toBeVisible();
  await expect(page.locator("#mediaDialog .media-card")).toHaveCount(2);
  await expect(page.locator("#mediaDialog")).not.toContainText("guide.pdf");
  await page.locator("#mediaDialogSearch").fill("existing");
  await expect(page.locator("#mediaDialog .media-card")).toHaveCount(1);
  await page.locator(`[data-selectmedia="${image.path}"]`).first().click();
  await expect(page.locator("#mediaDialog")).not.toBeVisible();
  await expect(page.locator('[data-project-url="1"]')).toHaveValue(image.url);
  await expect(page.locator('[data-project-image="1"] img')).toBeVisible();
  await publish(page);
  await expect(page.locator("#status")).toContainText(/Published successfully/i);
  expect(state.projects.items[0].image).toBe("");
  expect(state.projects.items[1].image).toBe(image.url);
  await page.locator("#addItem").click();
  await expect(page.locator('[data-project-image="2"]')).toBeVisible();
  await chooseFile(page, page.locator('[data-project-upload="2"]'), imageFile("new-project.png"));
  await expect(page.locator('[data-project-url="2"]')).toHaveValue("/media/new-project.png");
  await publish(page);
  await expect(page.locator("#status")).toContainText(/Published successfully/i);
  expect(state.projects.items[2].image).toBe("/media/new-project.png");
  expect(state.projects.items[0].id).toBe("integr8-human-ai");
  expect(state.projects.items[1].id).toBe("ascension-aminos");
});

test("external URL validation and content SHA conflict keep the project unsaved", async ({ page }) => {
  const state = await mockCms(page);
  await openCms(page);
  await openSection(page, "Projects");
  await openProject(page, 0);
  const url = page.locator('[data-project-url="0"]');
  await url.fill("javascript:alert(1)");
  await url.blur();
  await expect(page.locator('[data-project-image="0"]')).toContainText(/valid|http|https|image URL/i);
  await expect(page.locator('[data-project-image="0"] img')).toHaveCount(0);
  await url.fill("https://fixture-images.example.test/external.png");
  await url.blur();
  await expect(page.locator('[data-project-image="0"] img')).toBeVisible();
  state.conflictNextPublish = true;
  await publish(page);
  await expect(page.locator("#status")).toContainText(/SHA conflict/i);
  expect(state.projects.items[0].image).toBe("");
  await expect(url).toHaveValue("https://fixture-images.example.test/external.png");
  await expect(page.locator("#pub")).toBeEnabled();
});

test("public cards render local/external images, preserve layout and fall back for unavailable images", async ({ page }, testInfo) => {
  const fixture = projectFixture();
  fixture.items[0].image = "/media/public-local.png";
  fixture.items[0].imageAlt = "Local fixture screenshot";
  fixture.items[1].image = "https://fixture-images.example.test/public-external.png";
  fixture.items[1].imageAlt = "External fixture screenshot";
  fixture.items.push({ ...fixture.items[0], id: "fixture-broken", title: "Broken fixture project", image: "/media/missing.png", imageAlt: "Unavailable screenshot" });
  fixture.items.push({ ...fixture.items[0], id: "fixture-empty", title: "Empty fixture project", image: "", imageAlt: "" });
  fixture.items.push({ ...fixture.items[0], id: "fixture-invalid", title: "Invalid fixture project", image: "javascript:alert(1)", imageAlt: "" });
  await fixturePublicProjects(page, fixture);
  await page.goto("/");
  await page.locator("#projects").scrollIntoViewIfNeeded();
  const cards = page.locator("#projects article");
  await expect(cards).toHaveCount(5);
  for (const [title, alt] of [["Fixture first project", "Local fixture screenshot"], ["Fixture second project", "External fixture screenshot"]]) {
    const image = cards.filter({ has: page.getByRole("heading", { name: title, exact: true }) }).getByRole("img", { name: alt });
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute("loading", "lazy");
    await expect.poll(() => image.evaluate((element) => element.naturalWidth)).toBeGreaterThan(0);
    const style = await image.evaluate((element) => ({ fit: getComputedStyle(element).objectFit, position: getComputedStyle(element).objectPosition }));
    expect(style.fit).toBe("cover");
    expect(style.position).toBe("50% 50%");
  }
  const broken = cards.filter({ has: page.getByRole("heading", { name: "Broken fixture project", exact: true }) });
  await broken.scrollIntoViewIfNeeded();
  await expect(broken.locator("img")).toHaveCount(0);
  await expect(broken.locator("svg").first()).toBeVisible();
  await expect(cards.filter({ hasText: "Empty fixture project" }).locator("img")).toHaveCount(0);
  await expect(cards.filter({ hasText: "Invalid fixture project" }).locator("img")).toHaveCount(0);
  const widths = await cards.evaluateAll((elements) => elements.map((element) => Math.round(element.getBoundingClientRect().width)));
  expect(new Set(widths).size).toBeLessThanOrEqual(2);
  await expectNoHorizontalOverflow(page);
  await page.locator("#projects").evaluate((element) => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    element.scrollIntoView({ block: "start" });
  });
  await page.locator("#projects").screenshot({ path: testInfo.outputPath("public-project-images.png") });
  await cards.first().getByRole("button", { name: "View project details" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("img", { name: "Local fixture screenshot" })).toBeVisible();
});
