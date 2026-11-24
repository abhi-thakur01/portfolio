import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("active CMS registers Education, Certifications, Roles and Addresses", () => {
  const html = read("public/admin.html");
  assert.match(html, /admin-remaining-editors\.js/);

  const app = read("public/admin-app.js");
  for (const name of ["Education", "Certifications", "Roles", "Addresses"]) {
    assert.match(app, new RegExp(name));
  }

  const extension = read("public/admin-remaining-editors.js");
  for (const marker of [
    "uiEducation",
    "uiCertifications",
    "uiRoles",
    "uiAddresses",
    "Start date",
    "End date",
    "Verification URL",
    "Certificate image",
  ]) assert.match(extension, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("education and certifications content is exported for optional future use", () => {
  const source = read("src/data/content.js");
  assert.match(source, /educationJson/);
  assert.match(source, /certificationsJson/);
  assert.match(source, /rolesJson/);
  assert.match(source, /addressesJson/);
  assert.match(source, /export const education/);
  assert.match(source, /export const certifications/);
});

test("existing education and address records remain loaded", () => {
  const education = JSON.parse(read("content/education.json"));
  assert.equal(education.items.length, 1);
  assert.equal(education.items[0].id, "mca");
  assert.equal(education.items[0].degree, "MCA");

  const certifications = JSON.parse(read("content/certifications.json"));
  assert.ok(Array.isArray(certifications.items));

  const roles = JSON.parse(read("content/roles.json"));
  assert.equal(roles.roles.length, 7);

  const addresses = JSON.parse(read("content/addresses.json"));
  assert.deepEqual(addresses.addresses, [
    "abhishekthakur.in",
    "revivedkansas.info",
    "melaniehoggan.com",
  ]);
});

test("project detail fields map to authoritative projects.json without adding GoHighLevel", () => {
  const projects = JSON.parse(read("content/projects.json"));
  const byId = new Map(projects.items.map((item) => [item.id, item]));

  const mappings = [
    ["revived-kansas", "detailDescription", "desc"],
    ["melanie-hoggan", "detailDescription", "desc"],
  ];
  for (const [id, mainField, detailField] of mappings) {
    const detail = JSON.parse(read(`content/projects/${id}.json`));
    const item = byId.get(id);
    assert.ok(item);
    assert.equal(item[mainField], detail[detailField]);
  }

  const revived = byId.get("revived-kansas");
  const revivedDetail = JSON.parse(read("content/projects/revived-kansas.json"));
  assert.equal(revived.url, revivedDetail.url);
  assert.equal(revived.link, revivedDetail.href);
  assert.equal(revived.detailCategory, revivedDetail.category);
  assert.deepEqual(revived.detailTags, revivedDetail.tags);
  assert.deepEqual(revived.highlights, revivedDetail.highlights);
  assert.deepEqual(revived.metrics, revivedDetail.metrics);
  assert.equal(revived.previewColor, revivedDetail.previewColor);
  assert.deepEqual(revived.features, revivedDetail.features);

  const melanie = byId.get("melanie-hoggan");
  const melanieDetail = JSON.parse(read("content/projects/melanie-hoggan.json"));
  assert.equal(melanie.url, melanieDetail.url);
  assert.equal(melanie.link, melanieDetail.href);
  assert.equal(melanie.detailCategory, melanieDetail.category);
  assert.deepEqual(melanie.detailTags, melanieDetail.tags);
  assert.deepEqual(melanie.highlights, melanieDetail.highlights);
  assert.deepEqual(melanie.metrics, melanieDetail.metrics);
  assert.equal(melanie.previewColor, melanieDetail.previewColor);
  assert.deepEqual(melanie.features, melanieDetail.features);

  assert.ok(!projects.items.some((item) => item.id === "gohighlevel-funnels"));
  assert.equal(JSON.parse(read("content/projects/gohighlevel-funnels.json")).id, "gohighlevel-funnels");
});

test("main content API validates remaining collections without replacing unknown fields", () => {
  const api = read("api/admin/content.ts");
  const app = read("public/admin-app.js");
  assert.match(api, /validateItemCollection/);
  assert.match(api, /validateSimpleArrayCollection/);
  assert.match(api, /content\/education\.json/);
  assert.match(api, /content\/certifications\.json/);
  assert.match(api, /content\/roles\.json/);
  assert.match(api, /content\/addresses\.json/);
  assert.match(app, /JSON\.stringify\(D/);
});
