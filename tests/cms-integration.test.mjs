import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { test } from "node:test";
import { getVisibleSectionOrder } from "../src/utils/sectionOrder.js";

const root = new URL("../", import.meta.url);

function read(relativePath) {
  return readFileSync(new URL(relativePath, root), "utf8");
}

test("active admin loads all integrated collection editors", () => {
  const html = read("public/admin/index.html");
  for (const script of [
    "admin-app.js",
    "admin-process-extend.js",
    "admin-sections-extend.js",
    "admin-projects-extend.js",
    "admin-cms-extra.js",
    "admin-services-testimonials.js",
    "admin-visibility.js",
  ]) {
    assert.match(html, new RegExp(`src="/${script}(?:\\?[^"]*)?"`));
  }

  const app = read("public/admin-app.js");
  for (const path of [
    "content/case-studies.json",
    "content/blog.json",
    "content/testimonials.json",
    "content/services/wordpress.json",
    "content/services/cms.json",
    "content/services/responsive.json",
    "content/services/maintenance.json",
  ]) assert.match(app, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(app, /data-vis/);
  assert.match(app, /sectionOrder/);
  assert.match(app, /canonicalUrl/);
  assert.match(app, /ogImage/);
});

test("public content loader exports all integrated collections", () => {
  const source = read("src/data/content.js");
  for (const exportName of ["export const services", "export const testimonials", "export const caseStudies", "export const blog", "export const seo"]) {
    assert.match(source, new RegExp(exportName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("App renders only known visible sections and preserves hidden actual configuration", () => {
  const app = read("src/App.jsx");
  assert.match(app, /getVisibleSectionOrder/);
  assert.match(app, /"case-studies": CaseStudies/);
  assert.match(app, /blog: Blog/);
  assert.match(app, /testimonials: Testimonials/);
  assert.match(app, /services: Services/);

  const site = JSON.parse(read("content/site.json"));
  assert.equal(site.sectionVisibility.services, false);
  assert.equal(site.sectionVisibility.blog, false);
  assert.equal(site.sectionVisibility["case-studies"], false);
  assert.equal(site.sectionVisibility.testimonials, false);
  assert.equal(site.sectionVisibility.education, false);
  assert.equal(site.sectionVisibility.certifications, false);
});

test("Services, Blog, Case Studies and Testimonials components exist", () => {
  for (const file of [
    "src/components/Services.jsx",
    "src/components/Blog.jsx",
    "src/components/CaseStudies.jsx",
    "src/components/Testimonials.jsx",
  ]) assert.ok(existsSync(new URL(file, root)), `${file} should exist`);
});

test("SEO metadata is generated from existing site and personal JSON", () => {
  const vite = read("vite.config.js");
  assert.match(vite, /twitter:card/);
  assert.match(vite, /application\/ld\+json/);
  assert.match(vite, /canonical/);
  assert.match(vite, /og:title/);
  assert.match(vite, /og:image/);

  const manager = read("src/components/SeoManager.jsx");
  assert.match(manager, /canonical/);
  assert.match(manager, /twitter:card/);
  assert.match(manager, /og:title/);
});

test("section ordering ignores unknown and duplicate IDs and supports temporary visibility fixtures", () => {
  const fixture = getVisibleSectionOrder(
    ["unknown", "services", "hero", "services", "blog", "case-studies", "testimonials"],
    { hero: true, services: true, blog: true, "case-studies": true, testimonials: true }
  );
  assert.deepEqual(fixture, [
    "services",
    "hero",
    "blog",
    "case-studies",
    "testimonials",
    "about",
    "projects",
    "skills",
    "experience",
    "process",
    "faqs",
    "contact",
  ]);

  const actual = JSON.parse(read("content/site.json"));
  assert.deepEqual(
    getVisibleSectionOrder(actual.sectionOrder, actual.sectionVisibility).filter((key) =>
      ["services", "blog", "case-studies", "testimonials"].includes(key)
    ),
    []
  );
});

test("CMS save path preserves unknown JSON fields rather than stripping them", () => {
  const api = read("api/admin/content.ts");
  assert.match(api, /const content = String\(body\.content \|\| ""\)/);
  assert.match(api, /content: Buffer\.from\(content/);
  assert.doesNotMatch(api, /delete\s+[^;]*(?:unknown|custom)/);
});
