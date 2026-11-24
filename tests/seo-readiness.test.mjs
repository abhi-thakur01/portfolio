import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("production sitemap contains only the canonical portfolio page", () => {
  const sitemap = read("public/sitemap.xml");
  assert.match(sitemap, /<loc>https:\/\/abhi-thakur-web\.vercel\.app\/<\/loc>/);
  assert.doesNotMatch(sitemap, /#/);
  assert.doesNotMatch(sitemap, /localhost|127\.0\.0\.1|\/admin|\/api\//);
});

test("robots excludes admin and API routes and references production sitemap", () => {
  const robots = read("public/robots.txt");
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Disallow: \/admin\//);
  assert.match(robots, /Disallow: \/admin\.html/);
  assert.match(robots, /Disallow: \/api\//);
  assert.match(robots, /Sitemap: https:\/\/abhi-thakur-web\.vercel\.app\/sitemap\.xml/);
});

test("build metadata includes canonical, social, and structured-data safeguards", () => {
  const vite = read("vite.config.js");
  assert.match(vite, /portfolio-cms-seo/);
  assert.match(vite, /localhost/);
  assert.match(vite, /og:locale/);
  assert.match(vite, /og:site_name/);
  assert.match(vite, /twitter:card/);
  assert.match(vite, /"@type": "Person"/);
  assert.match(vite, /"@type": "WebSite"/);
  assert.match(vite, /"@type": "ProfilePage"/);
  assert.match(vite, /"@type": "CreativeWork"/);
  assert.match(vite, /application\/ld\+json/);
});

test("document language and one primary H1 remain in public markup", () => {
  const html = read("index.html");
  assert.match(html, /<html lang="en"/);
  const hero = read("src/components/Hero.jsx");
  assert.match(hero, /<h1/);

  const sources = [
    "src/components/Hero.jsx",
    "src/components/About.jsx",
    "src/components/Projects.jsx",
    "src/components/Skills.jsx",
    "src/components/Experience.jsx",
    "src/components/Services.jsx",
    "src/components/Process.jsx",
    "src/components/FAQ.jsx",
    "src/components/CaseStudies.jsx",
    "src/components/Blog.jsx",
    "src/components/Testimonials.jsx",
  ];
  const h1Count = sources.reduce((count, path) =>
    count + ((read(path).match(/<h1\b/g) || []).length), 0);
  assert.equal(h1Count, 1);
});

test("existing images use descriptive factual alt text", () => {
  const hero = read("src/components/Hero.jsx");
  const projects = read("src/components/Projects.jsx");
  const skills = read("src/components/Skills.jsx");
  const caseStudies = read("src/components/CaseStudies.jsx");
  assert.match(hero, /photoAlt/);
  assert.match(projects, /Project preview for/);
  assert.match(skills, /alt=\{skill\.name\}/);
  assert.match(caseStudies, /case study cover/);
});

test("SEO CMS fields and public data remain controlled without hidden-section changes", () => {
  const app = read("public/admin-app.js");
  assert.match(app, /Canonical URL/);
  assert.match(app, /Open Graph image/);
  assert.match(app, /Meta Title/);
  assert.match(app, /Meta Description/);

  const site = JSON.parse(read("content/site.json"));
  assert.equal(site.sectionVisibility.services, false);
  assert.equal(site.sectionVisibility.blog, false);
  assert.equal(site.sectionVisibility["case-studies"], false);
  assert.equal(site.sectionVisibility.testimonials, false);
  assert.equal(site.sectionVisibility.education, false);
  assert.equal(site.sectionVisibility.certifications, false);
});
