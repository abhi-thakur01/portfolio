import assert from "node:assert/strict";
import { test } from "node:test";
import { createCipheriv, createHash, randomBytes } from "node:crypto";
import { loadModule } from "./helpers/load-module.mjs";

function sessionCookie(secret) {
  const key = createHash("sha256").update(secret).digest();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify({ token: "test-token", login: "test-user", exp: Date.now() + 60000 }), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `cms_session=${Buffer.concat([iv, tag, encrypted]).toString("base64url")}`;
}

function response() {
  return {
    statusCode: 200,
    body: null,
    setHeader(key, value) { this.headers = this.headers || {}; this.headers[key] = value; return this; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
  };
}

function setup(fetchImpl) {
  const secret = "cms-test-secret";
  const handler = loadModule("../api/admin/content.ts", {
    process: {
      env: {
        CMS_SESSION_SECRET: secret,
        GITHUB_REPO: "example/portfolio",
        GITHUB_BRANCH: "release",
      },
    },
    fetch: fetchImpl,
  }).default;
  return { handler, cookie: sessionCookie(secret) };
}

test("content reads and writes use the configured GitHub branch", async () => {
  const { handler, cookie } = setup(async (url) => {
    assert.match(url, /[?&]ref=release$/);
    return {
      ok: true,
      json: async () => ({ content: Buffer.from('{"items":[],"categories":[]}').toString("base64"), sha: "sha-base" }),
    };
  });

  const res = response();
  await handler({ method: "GET", query: { path: "content/projects.json" }, headers: { cookie } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.sha, "sha-base");
});

test("PUT rejects stale SHA conflicts instead of overwriting newer GitHub content", async () => {
  let putCalled = false;
  const { handler, cookie } = setup(async (url, options) => {
    assert.match(url, /[?&]ref=release$/);
    if (options?.method === "PUT") putCalled = true;
    return {
      ok: true,
      json: async () => ({
        content: Buffer.from('{"categories":[],"items":[]}').toString("base64"),
        sha: "sha-new",
      }),
    };
  });

  const res = response();
  await handler({
    method: "PUT",
    query: { path: "content/projects.json" },
    headers: { cookie },
    body: { content: '{"categories":[],"items":[]}', sha: "sha-old" },
  }, res);

  assert.equal(res.statusCode, 409);
  assert.equal(res.body.code, "STALE_SAVE");
  assert.equal(putCalled, false);
});

test("PUT succeeds only with the current SHA and returns the new SHA", async () => {
  let putBody;
  const { handler, cookie } = setup(async (url, options) => {
    if (!options?.method) assert.match(url, /[?&]ref=release$/);
    if (options?.method === "PUT") {
      putBody = JSON.parse(options.body);
      return {
        ok: true,
        json: async () => ({ commit: { sha: "commit-1" }, content: { sha: "sha-new" } }),
      };
    }
    return {
      ok: true,
      json: async () => ({
        content: Buffer.from('{"categories":[],"items":[]}').toString("base64"),
        sha: "sha-current",
      }),
    };
  });

  const res = response();
  await handler({
    method: "PUT",
    query: { path: "content/projects.json" },
    headers: { cookie },
    body: { content: '{"categories":[],"items":[]}', sha: "sha-current" },
  }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.sha, "sha-new");
  assert.equal(putBody.branch, "release");
  assert.equal(putBody.sha, "sha-current");
});
