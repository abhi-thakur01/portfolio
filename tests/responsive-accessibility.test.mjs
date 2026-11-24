import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("skip link and fixed-navbar offset safeguards are present", () => {
  const app = read("src/App.jsx");
  const css = read("src/index.css");
  assert.match(app, /Skip to main content/);
  assert.match(app, /id="main-content"/);
  assert.match(css, /scroll-padding-top:\s*5rem/);
  assert.match(css, /scroll-margin-top:\s*5rem/);
});

test("mobile navigation has Escape, expanded, controlled and active-state semantics", () => {
  const navbar = read("src/components/Navbar.jsx");
  assert.match(navbar, /menuButtonRef/);
  assert.match(navbar, /event\.key === "Escape"/);
  assert.match(navbar, /aria-expanded=\{open\}/);
  assert.match(navbar, /aria-controls="mobile-navigation"/);
  assert.match(navbar, /aria-label="Mobile navigation"/);
  assert.match(navbar, /aria-current=/);
});

test("Blog and Case Studies dialogs trap focus and restore focus", () => {
  for (const path of ["src/components/Blog.jsx", "src/components/CaseStudies.jsx"]) {
    const source = read(path);
    assert.match(source, /role="dialog"/);
    assert.match(source, /aria-modal="true"/);
    assert.match(source, /previousFocusRef/);
    assert.match(source, /event\.key !== "Tab"/);
  }
});

test("reduced-motion and visible animation fallbacks remain", () => {
  const reveal = read("src/components/Reveal.jsx");
  const loader = read("src/components/PageLoader.jsx");
  const cursor = read("src/components/CustomCursor.jsx");
  const css = read("src/index.css");
  assert.match(reveal, /typeof IntersectionObserver === "undefined"/);
  assert.match(reveal, /revealFallback/);
  assert.match(loader, /prefers-reduced-motion/);
  assert.match(cursor, /pointer: fine/);
  assert.match(cursor, /prefers-reduced-motion/);
  assert.match(css, /pointer: coarse/);
  assert.match(css, /min-height:\s*44px/);
});

test("contact form retains labels, live feedback and secure integration", () => {
  const contact = read("src/components/Contact.jsx");
  assert.match(contact, /htmlFor="contact-name"/);
  assert.match(contact, /htmlFor="contact-email"/);
  assert.match(contact, /htmlFor="contact-message"/);
  assert.match(contact, /role="alert"/);
  assert.match(contact, /aria-live="polite"/);
  assert.match(contact, /\/api\/contact/);
});
