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
