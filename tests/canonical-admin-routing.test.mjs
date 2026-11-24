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
  assert.ok(!config.rewrites?.some((item) => ["/admin", "/admin/", "/admin.html"].includes(item.source)));
});

test("canonical CMS shell owns the active script chain and excludes indexing", () => {
  const shell = read("public/admin/index.html");
  assert.match(shell, /<meta name="robots" content="noindex,nofollow">/);
  const scripts = [...shell.matchAll(/<script src="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(scripts, [
    "/admin-app.js",
    "/admin-media.js",
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

test("retired legacy CMS files are absent", () => {
  for (const path of [
    "public/admin-v2.html",
    "public/cms2.js",
    "public/admin-a.js",
    "public/admin-skills-image.js",
  ]) {
    assert.equal(existsSync(new URL(path, root)), false, `${path} should be retired`);
  }
});

test("retired /api/admin/files is a 410 mutation-blocking stub", async () => {
  const handler = loadModule("../api/admin/files.ts", {}).default;
  for (const method of ["GET", "POST", "PUT", "DELETE"]) {
    const res = {
      statusCode: 200,
      setHeader(key, value) { this.headers = this.headers || {}; this.headers[key] = value; return this; },
      status(code) { this.statusCode = code; return this; },
      json(value) { this.body = value; return this; },
    };
    await handler({ method }, res);
    assert.equal(res.statusCode, 410);
    assert.equal(res.body.code, "ENDPOINT_RETIRED");
  }
});

test("deployment environment template lists CMS and contact variables", () => {
  const env = read(".env.example");
  for (const name of [
    "GITHUB_OAUTH_CLIENT_ID",
    "GITHUB_OAUTH_CLIENT_SECRET",
    "CMS_SESSION_SECRET",
    "CMS_GITHUB_USERNAME",
    "GITHUB_REPO",
    "GITHUB_BRANCH",
    "RESEND_API_KEY",
    "CONTACT_TO_EMAIL",
    "CONTACT_FROM_EMAIL",
    "CONTACT_ALLOWED_ORIGIN",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
  ]) {
    assert.match(env, new RegExp(`^${name}=`, "m"));
  }
});

test("admin API handlers set authenticated response cache protections", () => {
  for (const path of [
    "api/admin/content.ts",
    "api/admin/media.ts",
    "api/admin/login.ts",
    "api/admin/callback.ts",
    "api/admin/logout.ts",
    "api/admin/files.ts",
  ]) {
    const source = read(path);
    assert.match(source, /no-store/);
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
