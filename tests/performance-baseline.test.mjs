import assert from "node:assert/strict";
import { statSync, readFileSync } from "node:fs";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("hidden public sections use lazy-loaded chunks", () => {
  const app = read("src/App.jsx");
  for (const name of ["Services", "CaseStudies", "Blog", "Testimonials"]) {
    assert.match(app, new RegExp(`const ${name} = lazy`));
  }
  assert.match(app, /Suspense/);
});

test("scroll and animation work is throttled or idle on touch", () => {
  const navbar = read("src/components/Navbar.jsx");
  const progress = read("src/components/PageLoader.jsx");
  const cursor = read("src/components/CustomCursor.jsx");
  const motion = read("src/components/motion.jsx");
  assert.match(navbar, /requestAnimationFrame/);
  assert.match(progress, /requestAnimationFrame/);
  assert.match(cursor, /pointer: fine/);
  assert.match(cursor, /requestAnimationFrame/);
  assert.match(motion, /pointer: coarse/);
  assert.match(motion, /cancelAnimationFrame/);
});

test("data-driven image elements include intrinsic dimensions", () => {
  for (const path of [
    "src/components/Hero.jsx",
    "src/components/Projects.jsx",
    "src/components/Skills.jsx",
    "src/components/CaseStudies.jsx",
  ]) {
    const source = read(path);
    assert.match(source, /width=/);
    assert.match(source, /height=/);
  }
});

test("optimized WebP social asset exists and original PNG remains", () => {
  const webp = statSync(new URL("public/og-image.webp", root));
  const png = statSync(new URL("public/og-image.png", root));
  const site = JSON.parse(read("content/site.json"));
  assert.equal(site.ogImage, "https://abhi-thakur-web.vercel.app/og-image.png");
  assert.ok(webp.size > 0);
  assert.ok(png.size > webp.size);
  assert.ok(webp.size < 100 * 1024);
});
