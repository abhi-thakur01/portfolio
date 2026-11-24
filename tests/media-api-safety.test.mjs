import assert from "node:assert/strict";
import { test } from "node:test";
import { createCipheriv, createHash, randomBytes } from "node:crypto";
import { loadModule } from "./helpers/load-module.mjs";

function sessionCookie(secret) {
  const key = createHash("sha256").update(secret).digest();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify({ token: "test-token", exp: Date.now() + 60000 }), "utf8"),
    cipher.final(),
  ]);
  return `cms_session=${Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url")}`;
}

function response() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
  };
}

function setup(fetchImpl) {
  const secret = "media-test-secret";
  const handler = loadModule("../api/admin/media.ts", {
    process: { env: { CMS_SESSION_SECRET: secret, GITHUB_REPO: "example/portfolio", GITHUB_BRANCH: "release" } },
    fetch: fetchImpl,
  }).default;
  return { handler, cookie: sessionCookie(secret) };
}

const png = Buffer.concat([
  Buffer.from([137,80,78,71,13,10,26,10]),
  Buffer.from("valid-png-test"),
]);
const pngUrl = `data:image/png;base64,${png.toString("base64")}`;

test("unauthorized media requests are rejected", async () => {
  const { handler } = setup(async () => ({ ok: true, json: async () => ({}) }));
  const res = response();
  await handler({ method: "GET", headers: {} }, res);
  assert.equal(res.statusCode, 401);
});

test("valid PNG upload uses the configured branch", async () => {
  let putBody;
  const { handler, cookie } = setup(async (url, options) => {
    if (options?.method === "PUT") {
      assert.equal(JSON.parse(options.body).branch, "release");
      putBody = JSON.parse(options.body);
      return { ok: true, json: async () => ({ commit: { sha: "commit-1" } }) };
    }
    assert.match(url, /[?&]ref=release$/);
    return { ok: false, status: 404, json: async () => ({ message: "Not Found" }) };
  });

  const res = response();
  await handler({
    method: "POST",
    headers: { cookie },
    body: { name: "../../logo name.png", dataUrl: pngUrl },
  }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(putBody.branch, "release");
  assert.match(putBody.message, /cms: upload media/);
});

test("invalid MIME, extension and file content are rejected", async () => {
  const { handler, cookie } = setup(async () => ({ ok: true, json: async () => [] }));
  for (const body of [
    { name: "bad.txt", dataUrl: "data:text/plain;base64,aGVsbG8=" },
    { name: "bad.png", dataUrl: "data:image/png;base64,aGVsbG8=" },
    { name: "bad.jpg", dataUrl: pngUrl },
  ]) {
    const res = response();
    await handler({ method: "POST", headers: { cookie }, body }, res);
    assert.equal(res.statusCode, 400);
  }
});

test("oversized uploads are rejected at the 3 MB effective limit", async () => {
  const { handler, cookie } = setup(async () => ({ ok: true, json: async () => [] }));
  const bytes = Buffer.alloc(3 * 1024 * 1024 + 1);
  bytes.set(png.subarray(0, 8), 0);
  const res = response();
  await handler({
    method: "POST",
    headers: { cookie },
    body: { name: "large.png", dataUrl: `data:image/png;base64,${bytes.toString("base64")}` },
  }, res);
  assert.equal(res.statusCode, 413);
});

test("malformed and SVG uploads are rejected", async () => {
  const { handler, cookie } = setup(async () => ({ ok: true, json: async () => [] }));
  const svg = Buffer.from('<svg onload="alert(1)"></svg>');
  for (const body of [
    { name: "bad.svg", dataUrl: `data:image/svg+xml;base64,${svg.toString("base64")}` },
    { name: "bad.png", dataUrl: "data:image/png;base64,%%%not-base64%%%" },
  ]) {
    const res = response();
    await handler({ method: "POST", headers: { cookie }, body }, res);
    assert.equal(res.statusCode, 400);
  }
});

test("replacement requires confirmation and matching SHA", async () => {
  let calls = 0;
  const { handler, cookie } = setup(async (url) => {
    calls++;
    assert.match(url, /[?&]ref=release$/);
    return { ok: true, json: async () => ({ sha: "sha-current", content: pngUrl }) };
  });

  const unconfirmed = response();
  await handler({
    method: "POST",
    headers: { cookie },
    body: { name: "logo.png", dataUrl: pngUrl, replacePath: "public/media/logo.png" },
  }, unconfirmed);
  assert.equal(unconfirmed.statusCode, 409);
  assert.equal(unconfirmed.body.code, "CONFIRM_REPLACE");

  const stale = response();
  await handler({
    method: "POST",
    headers: { cookie },
    body: { name: "logo.png", dataUrl: pngUrl, replacePath: "public/media/logo.png", confirmReplace: true, sha: "sha-old" },
  }, stale);
  assert.equal(stale.statusCode, 409);
  assert.equal(stale.body.code, "STALE_MEDIA");
  assert.ok(calls >= 1);
});

test("path traversal and unauthorized media paths are rejected", async () => {
  const { handler, cookie } = setup(async () => ({ ok: true, json: async () => ({}) }));
  for (const path of ["public/media/../secret.png", "../secret.png", "other/secret.png"]) {
    const res = response();
    await handler({ method: "DELETE", query: { path }, headers: { cookie }, body: { sha: "sha" } }, res);
    assert.equal(res.statusCode, 400);
  }
});

test("stale SHA deletion is rejected", async () => {
  const { handler, cookie } = setup(async (url) => {
    assert.match(url, /[?&]ref=release$/);
    return { ok: true, json: async () => ({ sha: "sha-current", content: "" }) };
  });
  const res = response();
  await handler({
    method: "DELETE",
    query: { path: "public/media/logo.png" },
    headers: { cookie },
    body: { sha: "sha-old" },
  }, res);
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.code, "STALE_MEDIA");
});

test("referenced media deletion is blocked", async () => {
  let stage = "file";
  const { handler, cookie } = setup(async (url) => {
    assert.match(url, /[?&]ref=release$/);
    if (url.includes("/contents/content?")) {
      return { ok: true, json: async () => [
        { type: "file", name: "projects.json", path: "content/projects.json" },
      ] };
    }
    if (url.includes("content/projects.json")) {
      return { ok: true, json: async () => ({
        content: Buffer.from('{"items":[{"image":"\\/media\\/logo.png"}]}').toString("base64"),
      }) };
    }
    if (stage === "file") return { ok: true, json: async () => ({ sha: "sha-current" }) };
    return { ok: true, json: async () => [] };
  });

  const res = response();
  await handler({
    method: "DELETE",
    query: { path: "public/media/logo.png" },
    headers: { cookie },
    body: { sha: "sha-current" },
  }, res);
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.code, "MEDIA_REFERENCED");
});
