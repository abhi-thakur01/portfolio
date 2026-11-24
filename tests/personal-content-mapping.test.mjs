import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { resolveHeroContent, resolvePersonalName } from "../src/data/personalMapping.js";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("editing the CMS public name updates normalized public identity without changing full name", () => {
  const savedContent = {
    fullName: "Abhishek Thakur",
    displayName: "Abhishek Thakur",
    name: "Abhishek Thakur",
  };
  const cmsSavedContent = { ...savedContent, displayName: "Abhishek", name: "Abhishek" };
  const publicPersonal = resolvePersonalName(cmsSavedContent);

  assert.equal(publicPersonal.name, "Abhishek");
  assert.equal(publicPersonal.displayName, "Abhishek");
  assert.equal(publicPersonal.fullName, "Abhishek Thakur");
});

test("legacy name values cannot override the public display name", () => {
  const publicPersonal = resolvePersonalName({
    fullName: "Legal Name",
    displayName: "Public Name",
    name: "Older Name",
  });

  assert.equal(publicPersonal.name, "Public Name");
  assert.equal(publicPersonal.fullName, "Legal Name");
});

test("public hero identity follows Personal and configured CTA links reach the component", () => {
  const publicPersonal = {
    name: "Updated Display Name",
    greeting: "Hello",
    role: "Designer",
    bio: "Updated bio",
    ctaPrimary: "Projects",
    ctaSecondary: "Resume",
    resumeUrl: "/resume.pdf",
  };
  const publicHero = resolveHeroContent({
    mainHeading: "Stale Hero Name",
    bioHighlight: "Web Designer",
    button1Url: "#work",
    button2Url: "#resume",
  }, publicPersonal);
  const component = read("src/components/Hero.jsx");

  assert.equal(publicHero.mainHeading, "Updated Display Name");
  assert.equal(publicHero.bio, "Updated bio");
  assert.equal(publicHero.button1Url, "#work");
  assert.equal(publicHero.button2Url, "#resume");
  assert.match(component, /href=\{hero\.button1Url \|\| "#projects"\}/);
});

test("SEO name fallbacks use the same normalized public display name", () => {
  const vite = read("vite.config.js");
  const manager = read("src/components/SeoManager.jsx");

  assert.match(vite, /site\.metaTitle \|\| site\.websiteTitle \|\| personal\.displayName \|\| personal\.fullName/);
  assert.match(manager, /site\.metaTitle \|\| site\.websiteTitle \|\| personal\.name/);
});

test("Personal CMS edits displayName and keeps fullName separate", () => {
  const admin = read("public/admin-app.js");

  assert.match(admin, /I\("displayName",d\.displayName\|\|d\.fullName\|\|d\.name\|\|""\)/);
  assert.match(admin, /if\(field==="displayName"\)D\.name=x\.value/);
  assert.doesNotMatch(admin, /D\.fullName=x\.value/);
  assert.match(admin, /Uses the public display name managed in Personal Info\./);
  assert.match(admin, /Uses the Bio managed in Personal Info\./);
});
