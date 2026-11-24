import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { resolveProjectImage } from "../src/utils/projectImage.js";

test("project media paths resolve from GitHub storage to Vite public URLs", () => {
  for (const value of ["/media/project.png", "media/project.png", "public/media/project.png", "/public/media/project.png"]) {
    assert.equal(resolveProjectImage(value), "/media/project.png");
  }
  assert.equal(resolveProjectImage("  /media/project.webp?v=2  "), "/media/project.webp?v=2");
  assert.equal(resolveProjectImage("./images/project.JPG"), "/images/project.JPG");
  assert.equal(resolveProjectImage("/media/animated.gif"), "/media/animated.gif");
});

test("project images accept external HTTP(S) and extensionless CDN image URLs", () => {
  assert.equal(resolveProjectImage("https://cdn.example.com/project.png?width=800"), "https://cdn.example.com/project.png?width=800");
  assert.equal(resolveProjectImage("http://images.example.com/screenshot"), "http://images.example.com/screenshot");
});

test("invalid, unsafe, and non-image project locations use the placeholder", () => {
  for (const value of [
    "", "   ", null, {}, 42,
    "javascript:alert(1)", "data:image/png;base64,AA==", "blob:https://example.com/id", "file:///tmp/image.png",
    "//other.example.com/project.png", "/media/../private.png", "/media/%2e%2e/private.png",
    "/media/project\\.png", "/media/%5cproject.png", "/media/%00project.png", "/media/%invalid.png",
    "/media/document.pdf", "/media/unsafe.svg", "https://example.com/document.pdf", "https://example.com/unsafe.svg",
    "https://user:password@example.com/image.png", "https://",
  ]) assert.equal(resolveProjectImage(value), "", String(value));
});

test("public project loading preserves each project's image, alt, ID, and extended fields", () => {
  const fixture = {
    items: [
      {
        id: "original-project-id", title: "Fixture A", category: "React", description: "Description", order: 2,
        image: "public/media/fixture-a.png", imageAlt: "CMS-authored screenshot description",
        tags: ["React"], detailTags: ["Feature"], highlights: ["Highlight"], features: ["Feature"],
        detailDescription: "Extended details", link: "https://example.com", metrics: { label: "Score", value: "100" },
      },
      { id: "independent-project-id", title: "Fixture B", order: 1, image: "/media/fixture-b.webp" },
    ],
  };
  const source = readFileSync(new URL("../src/data/content.js", import.meta.url), "utf8");
  const mapping = source.slice(source.indexOf("export const projects ="), source.indexOf("export const skillCategories ="));
  const context = { projectsJson: fixture };
  runInNewContext(mapping.replace("export const projects =", "globalThis.result ="), context);
  const projects = JSON.parse(JSON.stringify(context.result));
  assert.deepEqual(projects.map(({ id }) => id), ["independent-project-id", "original-project-id"]);
  assert.equal(projects[0].image, "/media/fixture-b.webp");
  assert.equal(projects[0].imageAlt, "");
  const loaded = projects[1];
  for (const field of ["id", "title", "category", "description", "image", "imageAlt", "tags", "detailTags", "highlights", "features", "detailDescription", "link", "metrics"]) {
    assert.deepEqual(loaded[field], fixture.items[0][field], field);
  }
  assert.equal(fixture.items[0].image, "public/media/fixture-a.png", "loading does not alter source content");
});
