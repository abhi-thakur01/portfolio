import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const publicDir = new URL("../public/", import.meta.url);

function publicFile(name) {
  return new URL(name, publicDir);
}

test("active admin scripts load and pass JavaScript syntax checks", () => {
  const adminHtml = readFileSync(publicFile("admin.html"), "utf8");
  const scripts = [...adminHtml.matchAll(/<script\s+src="([^"]+)"/g)]
    .map((match) => match[1].split("?")[0]);

  assert.ok(scripts.length >= 5, "admin.html should load its CMS scripts");
  for (const script of scripts) {
    assert.ok(script.startsWith("/"), `script URL should be absolute: ${script}`);
    const file = publicFile(script.slice(1));
    assert.ok(existsSync(file), `active script should exist: ${script}`);
    const check = spawnSync(process.execPath, ["--check", file.pathname.replace(/^\/([A-Z]:)/, "$1")], {
      encoding: "utf8",
    });
    assert.equal(check.status, 0, `${script} failed syntax check:\n${check.stderr}`);
  }
});

test("Section Headings and SEO Features registrations remain in the active extension", () => {
  const adminHtml = readFileSync(publicFile("admin.html"), "utf8");
  assert.match(adminHtml, /src="\/admin-sections-extend\.js"/);

  const sections = readFileSync(publicFile("admin-sections-extend.js"), "utf8");
  assert.match(sections, /ensure\("Section Headings",\s*"content\/sections\.json"\)/);
  assert.match(sections, /ensure\("SEO Features",\s*"content\/seo\.json"\)/);
  assert.match(sections, /if\s*\(k\s*===\s*"sec"\)/);
  assert.match(sections, /if\s*\(k\s*===\s*"seo"\)/);
});

test("CMS HTML escaping covers attribute-sensitive characters", () => {
  const app = readFileSync(publicFile("admin-app.js"), "utf8");
  assert.match(app, /replace\(\/&\/g,\s*"&amp;"/);
  assert.match(app, /replace\(\/"\/g,\s*"&quot;"/);
  assert.match(app, /replace\(\/'\//);
  assert.match(app, /replace\(\/<\/g,\s*"&lt;"/);
  assert.match(app, /replace\(\/>\//);
});

test("projects.json preserves existing IDs and does not add GoHighLevel automatically", () => {
  const projectsUrl = new URL("../content/projects.json", import.meta.url);
  const projects = JSON.parse(readFileSync(projectsUrl, "utf8"));
  const ids = projects.items.map((item) => item.id);

  assert.deepEqual(ids, [
    "integr8-human-ai",
    "ascension-aminos",
    "service-resource-sr-gc",
    "matt-says",
    "ime-transcriptions",
    "revived-kansas",
    "melanie-hoggan",
    "project-1793702974768",
  ]);
  assert.ok(!ids.includes("gohighlevel-funnels"));
  for (const item of projects.items) {
    assert.equal(typeof item.id, "string");
    assert.equal(typeof item.title, "string");
    assert.equal(typeof item.description, "string");
    assert.equal(typeof item.category, "string");
    assert.equal(typeof item.platform, "string");
    assert.equal(typeof item.image, "string");
    assert.equal(typeof item.link, "string");
    assert.ok(Array.isArray(item.tags));
    assert.equal(typeof item.order, "number");
    assert.equal(item.active, true);
  }
});

test("detail project fields are preserved in the authoritative project source", () => {
  const projects = JSON.parse(readFileSync(new URL("../content/projects.json", import.meta.url), "utf8"));
  const byId = new Map(projects.items.map((item) => [item.id, item]));

  for (const name of ["revived-kansas", "melanie-hoggan"]) {
    const detail = JSON.parse(readFileSync(new URL(`../content/projects/${name}.json`, import.meta.url), "utf8"));
    const item = byId.get(name);
    assert.ok(item, `missing authoritative project ${name}`);
    assert.equal(item.detailDescription, detail.desc);
    assert.equal(item.url, detail.url);
    assert.equal(item.detailCategory, detail.category);
    assert.deepEqual(item.detailTags, detail.tags);
    assert.deepEqual(item.highlights, detail.highlights);
    assert.deepEqual(item.metrics, detail.metrics);
    assert.equal(item.previewColor, detail.previewColor);
    assert.deepEqual(item.features, detail.features);
  }
});

test("active Projects CMS supports complete project fields and server preservation guards", () => {
  const extension = readFileSync(publicFile("admin-projects-extend.js"), "utf8");
  for (const field of [
    "data-active",
    "data-num",
    "data-detail-tags",
    "Detail description",
    "Highlights (one per line)",
    "Metric label",
    "Preview color",
    "Features (one per line)",
  ]) {
    assert.match(extension, new RegExp(field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  const loader = readFileSync(new URL("../src/data/content.js", import.meta.url), "utf8");
  assert.match(loader, /detailDescription:\s*p\.detailDescription/);
  assert.match(loader, /highlights:\s*Array\.isArray\(p\.highlights\)/);
  assert.match(loader, /features:\s*Array\.isArray\(p\.features\)/);

  const api = readFileSync(new URL("../api/admin/content.ts", import.meta.url), "utf8");
  assert.match(api, /Duplicate project id/);
  assert.match(api, /Existing project id cannot be removed/);
  assert.match(api, /validateProjectContent/);
});
