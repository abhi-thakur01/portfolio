import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { loadModule } from "./helpers/load-module.mjs";

const root = new URL("../", import.meta.url);
function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("Vercel defines canonical /admin/ redirects without conflicting rewrites", () => {
  const config = JSON.parse(read("vercel.json"));
  assert.ok(Array.isArray(config.redirects));
  assert.ok(config.redirects.some((item) => item.source === "/admin" && item.destination === "/admin/"));
  assert.ok(config.redirects.some((item) => item.source === "/admin.html" && item.destination === "/admin/"));
  assert.ok(config.redirects.some((item) => item.source === "/admin-v2.html" && item.destination === "/admin/"));
  assert.ok(config.redirects.some((item) => item.source === "/cms2.js" && item.destination === "/admin/"));
  assert.ok(config.redirects.some((item) => item.source === "/admin-a.js" && item.destination === "/admin/"));
  assert.ok(config.redirects.some((item) => item.source === "/admin-skills-image.js" && item.destination === "/admin/"));
  assert.ok(config.redirects.some((item) => item.source === "/api/admin/files" && item.destination === "/admin/"));
  assert.ok(!config.rewrites?.some((item) => ["/admin", "/admin/", "/admin.html"].includes(item.source)));
});

test("canonical CMS shell owns the active script chain and excludes indexing", () => {
  const shell = read("public/admin/index.html");
  assert.match(shell, /<meta name="robots" content="noindex,nofollow">/);
  const scripts = [...shell.matchAll(/<script src="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(scripts, [
    "/admin-app.js",
    "/admin-process-extend.js",
    "/admin-sections-extend.js",
    "/admin-projects-extend.js",
    "/admin-cms-extra.js",
    "/admin-services-testimonials.js",
    "/admin-remaining-editors.js",
    "/admin-visibility.js?v=1",
  ]);
  assert.ok(!read("public/admin.html").includes('id="root"'), "admin.html should be compatibility redirect only");
});

test("Vite dev and preview middleware and compatibility page preserve canonical redirects", () => {
  const vite = read("vite.config.js");
  assert.match(vite, /canonical-admin-routes/);
  assert.match(vite, /configureServer/);
  assert.match(vite, /configurePreviewServer/);
  assert.match(vite, /res\.setHeader\("Location", "\/admin\/"\)/);

  const compatibility = read("public/admin.html");
  assert.match(compatibility, /window\.location\.replace\('\/admin\/'\)/);
  assert.match(compatibility, /<meta http-equiv="refresh" content="0;url=\/admin\/">/);
});

test("OAuth callback and logout destinations remain canonical", () => {
  const callback = read("api/admin/callback.ts");
  assert.match(callback, /window\.location\.replace\('\/admin\/'\)/);

  const logout = read("api/admin/logout.ts");
  assert.match(logout, /res\.setHeader\("Location", "\/admin\/"\)/);
});

test("retired legacy CMS files and API are absent", () => {
  for (const path of [
    "public/admin-v2.html",
    "public/cms2.js",
    "public/admin-a.js",
    "public/admin-skills-image.js",
    "api/admin/files.ts",
  ]) {
    assert.equal(existsSync(new URL(path, root)), false, `${path} should be retired`);
  }
});

test("logout GET returns the canonical admin route in a mocked handler", async () => {
  const secretCalls = [];
  const handler = loadModule("../api/admin/logout.ts", {
    process: { env: {} },
  }).default;
  const res = {
    statusCode: 200,
    headers: {},
    setHeader(key, value) { this.headers[key] = value; return this; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
    end() { this.ended = true; },
  };
  await handler({ method: "GET", headers: {} }, res);
  assert.equal(res.statusCode, 302);
  assert.equal(res.headers.Location, "/admin/");
  assert.equal(res.ended, true);
});
