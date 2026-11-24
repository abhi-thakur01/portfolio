import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("public collections consume CMS-authoritative social, navigation, skill, and project fields", () => {
  const content = read("src/data/content.js");
  const admin = read("public/admin-app.js");
  assert.match(content, /from "\.\.\/\.\.\/content\/socials\.json"/);
  assert.match(content, /socialsJson\?\.items/);
  assert.match(content, /item\.id === "email" \? \(personal\.email/);
  assert.match(content, /Array\.isArray\(navJson\?\.links\) \? navJson\.links : fallbackLinks/);
  assert.match(content, /skill\.order/);
  assert.match(content, /hasOwnProperty\.call\(s, "image"\)/);
  assert.match(content, /otherTools = Array\.isArray\(skillsJson\?\.otherTools\)/);
  assert.match(admin, /id="addItem">\+ Add Social Link/);
  assert.match(admin, /A\.indexOf\("socials"\)>=0/);
  for (const field of ["detailDescription", "detailTags", "highlights", "metrics", "previewColor", "features"]) {
    assert.match(content, new RegExp(`${field}:`));
  }
});

test("public components render the CMS-backed section and item fields", () => {
  const hero = read("src/components/Hero.jsx");
  const navbar = read("src/components/Navbar.jsx");
  const footer = read("src/components/Footer.jsx");
  const skills = read("src/components/Skills.jsx");
  const projects = read("src/components/Projects.jsx");
  const blog = read("src/components/Blog.jsx");
  const testimonials = read("src/components/Testimonials.jsx");

  assert.match(hero, /hero\.statusPill/);
  assert.match(hero, /socialLinks\.map/);
  assert.match(navbar, /site\.header\?\.ctaText/);
  assert.match(footer, /site\.footer\?\.tagline/);
  assert.match(footer, /socialLinks\.map/);
  assert.match(skills, /meta\.toolsLabel/);
  assert.match(skills, /tools\.map/);
  for (const field of ["detailDescription", "highlights", "features", "detailTags", "metrics", "url", "previewColor"]) {
    assert.ok(projects.includes(`project.${field}`) || projects.includes(`project?.${field}`), `${field} is rendered`);
  }
  assert.match(blog, /post\.coverImage/);
  assert.match(testimonials, /item\.image/);
});

test("styled JSX headings stay intact in the public reveal helper", () => {
  const reveal = read("src/components/motion.jsx");
  assert.match(reveal, /const isPlainText = typeof children === "string" \|\| typeof children === "number"/);
  assert.match(reveal, /: children\}/);
  assert.doesNotMatch(reveal, /typeof children === "string" \? children : String\(children/);
});

test("section visibility quick toggles submit and retain the current content SHA", () => {
  const visibility = read("public/admin-visibility.js");
  assert.match(visibility, /var sha = editingSite \? BASE_SHA : SITE_SHA/);
  assert.match(visibility, /sha: sha/);
  assert.match(visibility, /SITE_SHA = result\.sha \|\| sha/);
});

test("CMS-only collections are clearly identified rather than implying public output", () => {
  const remaining = read("public/admin-remaining-editors.js");
  const sections = read("public/admin-sections-extend.js");
  assert.match(remaining, /CMS-only records: no public Education section/);
  assert.match(remaining, /CMS-only records: no public Certifications section/);
  assert.match(remaining, /CMS-only records: no public component currently renders this list/);
  assert.match(sections, /CMS-only/);
});
