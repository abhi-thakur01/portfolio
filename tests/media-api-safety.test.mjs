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
    setHeader(key, value) { this.headers = this.headers || {}; this.headers[key] = value; return this; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
    send(value) { this.body = value; return this; },
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

test("an empty media folder reports an empty library", async () => {
  const { handler, cookie } = setup(async (url) => {
    assert.match(url, /\/contents\/public\/media\?ref=release$/);
    return { ok: false, status: 404 };
  });
  const res = response();
  await handler({ method: "GET", headers: { cookie } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.files.length, 0);
});

test("media listing includes nested GitHub files, sizes, types and authenticated preview URLs", async () => {
  const { handler, cookie } = setup(async (url, options) => {
    assert.match(url, /[?&]ref=release$/);
    assert.equal(options.headers.Authorization, "Bearer test-token");
    return { ok: true, json: async () => url.includes("/public/media/projects?") ? [
      { type: "file", name: "screen.png", path: "public/media/projects/screen.png", size: 1234, sha: "screen-sha" },
    ] : [
      { type: "dir", name: "projects", path: "public/media/projects" },
      { type: "file", name: "resume.pdf", path: "public/media/resume.pdf", size: 5678, sha: "pdf-sha" },
    ] };
  });
  const res = response();
  await handler({ method: "GET", headers: { cookie } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.files.length, 2);
  const screen = res.body.files.find((file) => file.name === "screen.png");
  assert.equal(screen.url, "/media/projects/screen.png");
  assert.equal(screen.mime, "image/png");
  assert.equal(screen.size, 1234);
  assert.equal(screen.sha, "screen-sha");
  assert.equal(screen.previewUrl, "/api/admin/media?path=public%2Fmedia%2Fprojects%2Fscreen.png&sha=screen-sha");
  assert.equal(screen.isPdf, false);
  assert.equal(res.body.files.find((file) => file.name === "resume.pdf").isPdf, true);
});

test("failed nested media listing reports an error instead of an incomplete library", async () => {
  const { handler, cookie } = setup(async (url) => ({
    ok: !url.includes("/nested?"),
    status: url.includes("/nested?") ? 403 : 200,
    json: async () => url.includes("/nested?") ? { message: "GitHub rate limit reached" } : [
      { type: "dir", name: "nested", path: "public/media/nested" },
    ],
  }));
  const res = response();
  await handler({ method: "GET", headers: { cookie } }, res);
  assert.equal(res.statusCode, 403);
  assert.match(res.body.error, /rate limit/);
});

test("authenticated previews return validated bytes from the configured GitHub branch", async () => {
  const { handler, cookie } = setup(async (url, options) => {
    assert.match(url, /\/contents\/public\/media\/screen.png\?ref=release$/);
    assert.equal(options.headers.Accept, "application/vnd.github.raw+json");
    return { ok: true, arrayBuffer: async () => png };
  });
  const res = response();
  await handler({ method: "GET", headers: { cookie }, query: { path: "public/media/screen.png" } }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, png);
  assert.equal(res.headers["Content-Type"], "image/png");
  assert.equal(res.headers["X-Content-Type-Options"], "nosniff");
  assert.match(res.headers["Cache-Control"], /no-store/);
});

test("previews reject unsafe paths, unsupported files and mismatched content", async () => {
  let calls = 0;
  const { handler, cookie } = setup(async () => {
    calls++;
    return { ok: true, arrayBuffer: async () => Buffer.from("<svg onload='alert(1)'></svg>") };
  });
  for (const path of ["public/media/../secret.png", "public/media/test.svg", "content/projects.json", "public/media/fake.png"]) {
    const res = response();
    await handler({ method: "GET", headers: { cookie }, query: { path } }, res);
    assert.equal(res.statusCode, 400);
  }
  assert.equal(calls, 1);
});

test("all existing allowed media formats retain MIME and extension validation", async () => {
  let uploads = 0;
  const { handler, cookie } = setup(async (_url, options) => {
    if (options?.method === "PUT") {
      uploads++;
      return { ok: true, json: async () => ({ content: { sha: "uploaded-sha" }, commit: { sha: "commit-sha" } }) };
    }
    return { ok: false, status: 404 };
  });
  const fixtures = [
    ["png", "image/png", png],
    ["jpg", "image/jpeg", Buffer.from([255, 216, 255, 224])],
    ["jpeg", "image/jpeg", Buffer.from([255, 216, 255, 224])],
    ["webp", "image/webp", Buffer.from("RIFF1234WEBPVP8 ")],
    ["gif", "image/gif", Buffer.from("GIF89a1234")],
    ["pdf", "application/pdf", Buffer.from("%PDF-1.7 fixture")],
  ];
  for (const [extension, mime, bytes] of fixtures) {
    const res = response();
    await handler({ method: "POST", headers: { cookie }, body: {
      name: `fixture.${extension}`, dataUrl: `data:${mime};base64,${bytes.toString("base64")}`,
    } }, res);
    assert.equal(res.statusCode, 200, mime);
    assert.equal(res.body.mime, mime);
    assert.equal(res.body.size, bytes.length);
    assert.equal(res.body.sha, "uploaded-sha");
    assert.match(res.body.previewUrl, /sha=uploaded-sha/);
    assert.equal(res.body.commit, "commit-sha");
  }
  assert.equal(uploads, fixtures.length);
});

test("replacement cannot write a different format into an existing extension", async () => {
  let calls = 0;
  const { handler, cookie } = setup(async () => { calls++; throw new Error("No remote operation expected"); });
  const res = response();
  await handler({ method: "POST", headers: { cookie }, body: {
    name: "replacement.png", dataUrl: pngUrl,
    replacePath: "public/media/existing.jpg", confirmReplace: true, sha: "current-sha",
  } }, res);
  assert.equal(res.statusCode, 400);
  assert.match(res.body.error, /format and extension/);
  assert.equal(calls, 0);
});

test("confirmed replacement sends the matching SHA and configured branch", async () => {
  let written;
  const { handler, cookie } = setup(async (url, options) => {
    if (options?.method === "PUT") {
      written = JSON.parse(options.body);
      return { ok: true, json: async () => ({ content: { sha: "new-sha" }, commit: { sha: "new-commit" } }) };
    }
    assert.match(url, /[?&]ref=release$/);
    return { ok: true, json: async () => ({ sha: "current-sha" }) };
  });
  const res = response();
  await handler({ method: "POST", headers: { cookie }, body: {
    name: "replacement.png", dataUrl: pngUrl,
    replacePath: "public/media/existing.png", confirmReplace: true, sha: "current-sha",
  } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(written.sha, "current-sha");
  assert.equal(written.branch, "release");
  assert.equal(res.body.path, "public/media/existing.png");
  assert.equal(res.body.sha, "new-sha");
});

test("an existing generated filename is never overwritten", async () => {
  let writes = 0;
  const { handler, cookie } = setup(async (_url, options) => {
    if (options?.method === "PUT") writes++;
    return { ok: true, status: 200, json: async () => ({ sha: "existing-sha" }) };
  });
  const res = response();
  await handler({ method: "POST", headers: { cookie }, body: { name: "logo.png", dataUrl: pngUrl } }, res);
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.code, "MEDIA_CONFLICT");
  assert.equal(writes, 0);
});

test("GitHub conflicts during a replacement are reported without success", async () => {
  const { handler, cookie } = setup(async (_url, options) => options?.method === "PUT" ? {
    ok: false, status: 409, json: async () => ({ message: "GitHub SHA conflict" }),
  } : { ok: true, json: async () => ({ sha: "current-sha" }) });
  const res = response();
  await handler({ method: "POST", headers: { cookie }, body: {
    name: "replacement.png", dataUrl: pngUrl,
    replacePath: "public/media/existing.png", confirmReplace: true, sha: "current-sha",
  } }, res);
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.code, "STALE_MEDIA");
  assert.equal(res.body.success, undefined);
});

test("deletion fails closed when reference scanning is unavailable or content is invalid", async () => {
  for (const failure of ["listing", "file", "invalid-json", "empty-content", "network"]) {
    let deletes = 0;
    const { handler, cookie } = setup(async (url, options) => {
      if (options?.method === "DELETE") { deletes++; throw new Error("No deletion expected"); }
      if (url.includes("/contents/content?")) {
        if (failure === "network") throw new Error("GitHub connection failed");
        if (failure === "listing") return { ok: false, status: 403, json: async () => ({ message: "Forbidden" }) };
        return { ok: true, json: async () => [{ type: "file", name: "projects.json", path: "content/projects.json" }] };
      }
      if (url.includes("/content/projects.json?")) return {
        ok: failure !== "file", json: async () => ({ content: failure === "empty-content" ? "" : Buffer.from(failure === "invalid-json" ? "invalid" : "{}").toString("base64") }),
      };
      return { ok: true, json: async () => ({ sha: "current-sha" }) };
    });
    const res = response();
    await handler({ method: "DELETE", headers: { cookie }, query: { path: "public/media/screen.png" }, body: { sha: "current-sha" } }, res);
    assert.equal(res.statusCode, 503, failure);
    assert.equal(res.body.code, "REFERENCE_CHECK_FAILED", failure);
    assert.equal(deletes, 0, failure);
  }
});

test("unreferenced media deletion preserves SHA and branch", async () => {
  let deleted;
  const { handler, cookie } = setup(async (url, options) => {
    if (options?.method === "DELETE") {
      deleted = JSON.parse(options.body);
      return { ok: true, json: async () => ({ commit: { sha: "delete-commit" } }) };
    }
    assert.match(url, /[?&]ref=release$/);
    return { ok: true, json: async () => url.includes("/contents/content?") ? [] : { sha: "current-sha" } };
  });
  const res = response();
  await handler({ method: "DELETE", headers: { cookie }, query: { path: "public/media/screen.png" }, body: { sha: "current-sha" } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(deleted.sha, "current-sha");
  assert.equal(deleted.branch, "release");
});
