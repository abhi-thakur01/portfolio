import assert from "node:assert/strict";
import { createCipheriv, createHash, randomBytes } from "node:crypto";
import { test } from "node:test";
import { loadModule } from "./helpers/load-module.mjs";

const copy = (value) => JSON.parse(JSON.stringify(value));

function projectsFixture() {
  return {
    categories: [{ id: "React", label: "React", order: 1 }],
    collectionMetadata: { custom: "Preserve collection fields" },
    items: [
      {
        id: "existing-project-a", title: "Fixture project A", description: "Original description", category: "React",
        platform: "React + Vite", image: "", link: "https://example.test/project-a", tags: ["React", "Vite"],
        order: 1, active: true, detailDescription: "Extended description", url: "example.test/project-a",
        detailCategory: "Client work", detailTags: ["Extended tag"], highlights: ["Highlight"], features: ["Feature"],
        metrics: { label: "Score", value: "100" }, previewColor: "from-blue-600/20 to-transparent",
        customProjectField: { nested: ["Preserve unknown project fields"] },
      },
      {
        id: "existing-project-b", title: "Fixture project B", description: "Independent description", category: "React",
        platform: "React", image: "/media/existing-project-b.webp", imageAlt: "Original project B screenshot",
        link: "https://example.test/project-b", tags: ["JavaScript"], active: false, order: 2,
        customProjectField: { owner: "Second project" },
      },
    ],
  };
}

function sessionCookie(secret) {
  const iv = randomBytes(12);
  const sessionCipher = createCipheriv("aes-256-gcm", createHash("sha256").update(secret).digest(), iv);
  const encrypted = Buffer.concat([
    sessionCipher.update(JSON.stringify({ token: "fixture-token", exp: Date.now() + 60000 }), "utf8"),
    sessionCipher.final(),
  ]);
  return `cms_session=${Buffer.concat([iv, sessionCipher.getAuthTag(), encrypted]).toString("base64url")}`;
}

function response() {
  return {
    statusCode: 200, body: null,
    setHeader() { return this; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

function repositoryFixture(initial = projectsFixture()) {
  const secret = "isolated-project-publish-test";
  const cookie = sessionCookie(secret);
  const githubUrl = "https://api.github.com/repos/fixture/portfolio/contents/content/projects.json";
  const state = { content: JSON.stringify(initial), sha: "fixture-sha-0", writes: [] };
  const handler = loadModule("../api/admin/content.ts", {
    process: { env: { CMS_SESSION_SECRET: secret, GITHUB_REPO: "fixture/portfolio", GITHUB_BRANCH: "image-fixture-branch" } },
    fetch: async (url, options) => {
      assert.equal(options.headers.Authorization, "Bearer fixture-token");
      if (options.method === "PUT") {
        assert.equal(url, githubUrl);
        const body = JSON.parse(options.body);
        assert.equal(body.branch, "image-fixture-branch");
        if (body.sha !== state.sha) return { ok: false, status: 409, json: async () => ({ message: "GitHub SHA conflict" }) };
        state.content = Buffer.from(body.content, "base64").toString("utf8");
        state.writes.push(body);
        state.sha = `fixture-sha-${state.writes.length}`;
        return { ok: true, json: async () => ({ content: { sha: state.sha }, commit: { sha: `fixture-commit-${state.writes.length}` } }) };
      }
      assert.equal(url, `${githubUrl}?ref=image-fixture-branch`);
      return { ok: true, json: async () => ({ content: Buffer.from(state.content).toString("base64"), sha: state.sha }) };
    },
  }).default;
  async function request(method, body) {
    const res = response();
    await handler({ method, headers: { cookie }, query: { path: "content/projects.json" }, body }, res);
    return res;
  }
  async function read() {
    const result = await request("GET");
    assert.equal(result.statusCode, 200);
    return { content: JSON.parse(result.body.content), sha: result.body.sha, raw: result.body.content };
  }
  async function publish(content, sha = state.sha) {
    return request("PUT", { content: JSON.stringify(content, null, 2) + "\n", sha });
  }
  return { state, request, read, publish };
}

test("publishing project image and alt text persists through a fresh CMS read without losing existing fields", async () => {
  const original = projectsFixture();
  const fixture = repositoryFixture(original);
  const current = await fixture.read();
  current.content.items[0].image = "/media/1730000000000-uploaded-project-a.png";
  current.content.items[0].imageAlt = "Project A dashboard shown on a desktop screen";
  const saved = await fixture.publish(current.content, current.sha);
  assert.equal(saved.statusCode, 200);
  assert.equal(saved.body.success, true);
  assert.equal(saved.body.sha, "fixture-sha-1");
  assert.equal(saved.body.commit, "fixture-commit-1");
  const refreshed = await fixture.read();
  assert.deepEqual(refreshed.content, current.content);
  assert.equal(refreshed.sha, saved.body.sha);
  assert.equal(refreshed.raw, JSON.stringify(current.content, null, 2) + "\n");
  assert.deepEqual(refreshed.content.items.map((item) => item.id), original.items.map((item) => item.id));
  assert.deepEqual(refreshed.content.items[1], original.items[1]);
  const { image, imageAlt, ...unchanged } = refreshed.content.items[0];
  const { image: oldImage, ...originalFields } = original.items[0];
  assert.deepEqual(unchanged, originalFields);
  assert.equal(image, current.content.items[0].image);
  assert.equal(imageAlt, current.content.items[0].imageAlt);
  assert.equal(oldImage, "");
});

test("replacing then removing one project's image leaves every other project unchanged", async () => {
  const fixture = repositoryFixture();
  const original = await fixture.read();
  for (const [image, imageAlt] of [
    ["/media/project-a-first.png", "First screenshot"],
    ["https://images.example.test/project-a-replaced.webp", "Replacement screenshot"],
    ["", ""],
  ]) {
    const current = await fixture.read();
    current.content.items[0].image = image;
    current.content.items[0].imageAlt = imageAlt;
    const saved = await fixture.publish(current.content, current.sha);
    assert.equal(saved.statusCode, 200);
    const refreshed = await fixture.read();
    assert.equal(refreshed.content.items[0].image, image);
    assert.equal(refreshed.content.items[0].imageAlt, imageAlt);
    assert.deepEqual(refreshed.content.items[1], original.content.items[1]);
    assert.deepEqual(refreshed.content.items.map((item) => item.id), original.content.items.map((item) => item.id));
  }
  assert.equal(fixture.state.writes.length, 3);
});

test("a newly added project can publish an uploaded image while retaining all existing projects", async () => {
  const fixture = repositoryFixture();
  const original = await fixture.read();
  const next = copy(original.content);
  next.items.push({
    id: "new-fixture-project", title: "New project", description: "New fixture description", category: "React", platform: "Vite",
    image: "/media/new-project.jpg", imageAlt: "New project's screenshot", link: "https://example.test/new", tags: ["New"], order: 3, active: true,
  });
  const saved = await fixture.publish(next, original.sha);
  assert.equal(saved.statusCode, 200);
  const refreshed = await fixture.read();
  assert.deepEqual(refreshed.content, next);
  assert.deepEqual(refreshed.content.items.slice(0, 2), original.content.items);
});

test("stale or missing SHA cannot overwrite a newer project's image assignment", async () => {
  const fixture = repositoryFixture();
  const oldRead = await fixture.read();
  const latest = copy(oldRead.content);
  latest.items[0].image = "/media/latest-image.png";
  latest.items[0].imageAlt = "Latest published screenshot";
  assert.equal((await fixture.publish(latest, oldRead.sha)).statusCode, 200);
  oldRead.content.items[0].image = "/media/stale-image.png";
  for (const sha of [oldRead.sha, ""]) {
    const rejected = await fixture.publish(oldRead.content, sha);
    assert.equal(rejected.statusCode, 409);
    assert.equal(rejected.body.code, "STALE_SAVE");
    assert.equal(rejected.body.success, undefined);
    assert.deepEqual((await fixture.read()).content, latest);
    assert.equal(fixture.state.writes.length, 1);
  }
});

test("invalid project alt text is rejected before any GitHub write", async () => {
  for (const imageAlt of [null, 3, true, ["Alt text"], { text: "Alt text" }]) {
    const fixture = repositoryFixture();
    const current = await fixture.read();
    current.content.items[0].image = "/media/new-image.png";
    current.content.items[0].imageAlt = imageAlt;
    const rejected = await fixture.publish(current.content, current.sha);
    assert.equal(rejected.statusCode, 400);
    assert.match(rejected.body.error, /imageAlt must be a string/);
    assert.equal(fixture.state.writes.length, 0);
    assert.deepEqual((await fixture.read()).content, projectsFixture());
  }
});

test("publishing an image cannot remove or regenerate an existing project ID", async () => {
  const fixture = repositoryFixture();
  const current = await fixture.read();
  current.content.items[0].image = "/media/new-image.png";
  current.content.items[0].id = "regenerated-id";
  const rejected = await fixture.publish(current.content, current.sha);
  assert.equal(rejected.statusCode, 400);
  assert.match(rejected.body.error, /Existing project id cannot be removed: existing-project-a/);
  assert.equal(fixture.state.writes.length, 0);
  assert.deepEqual((await fixture.read()).content, projectsFixture());
});
