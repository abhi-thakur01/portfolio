import assert from "node:assert/strict";
import { test } from "node:test";
import { loadModule } from "./helpers/load-module.mjs";

const origin = "https://portfolio.example.com";
const redisUrl = "https://test-database.upstash.io/";
const validBody = { name: "Test Visitor", email: "visitor@example.com", message: "A useful contact message." };

function json(data, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => data };
}

function setup({ env = {}, fetch: override, shared } = {}) {
  const config = {
    CONTACT_ALLOWED_ORIGIN: origin,
    RESEND_API_KEY: "resend-test-secret",
    CONTACT_TO_EMAIL: "owner@example.com",
    CONTACT_FROM_EMAIL: "Portfolio <sender@example.com>",
    UPSTASH_REDIS_REST_URL: redisUrl,
    UPSTASH_REDIS_REST_TOKEN: "redis-test-secret",
    VERCEL: "1",
    ...env,
  };
  const calls = [];
  const logs = [];
  const redis = shared || { keys: new Map(), now: 0 };
  const handler = loadModule("../api/contact.ts", {
    process: { env: config },
    console: { error: (...args) => logs.push(args) },
    fetch: async (url, options) => {
      const body = JSON.parse(options.body);
      calls.push({ url, options, body });
      if (override) return override(url, options, body);
      if (url === redisUrl) {
        // Model an atomic Redis response shared across independently loaded APIs.
        const [command, script, keyCount, key, limit, window] = body;
        assert.equal(command, "EVAL");
        assert.equal(keyCount, "1");
        assert.equal(typeof script, "string");
        assert.equal(Number(limit), 5);
        assert.equal(Number(window), 600);
        let entry = redis.keys.get(key);
        if (!entry || entry.expires <= redis.now) {
          entry = { count: 0, expires: redis.now + Number(window) * 1000 };
          redis.keys.set(key, entry);
        }
        const allowed = entry.count < Number(limit);
        if (allowed) entry.count++;
        return json({ result: [allowed ? 1 : 0, Math.ceil((entry.expires - redis.now) / 1000)] });
      }
      assert.equal(url, "https://api.resend.com/emails", "No unexpected outbound services");
      return json({ id: "mock-email-id" });
    },
  }).default;

  async function request({ method = "POST", body = validBody, headers = {}, ip = "203.0.113.10", socketIp = "127.0.0.1" } = {}) {
    const res = {
      headers: {}, statusCode: 0, body: null,
      setHeader(key, value) { this.headers[key.toLowerCase()] = value; return this; },
      status(code) { this.statusCode = code; return this; },
      json(value) { this.body = JSON.parse(JSON.stringify(value)); return this; },
      end() { return this; },
    };
    await handler({ method, body, headers: { origin, "content-type": "application/json", "x-forwarded-for": ip, ...headers }, socket: { remoteAddress: socketIp } }, res);
    return res;
  }
  return { request, calls, config, logs, redis };
}

test("accepts a valid submission only after Redis and Resend confirm acceptance", async () => {
  const app = setup();
  const res = await app.request({ body: { ...validBody, name: "  Test Visitor  ", message: "  " + validBody.message + "  " } });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.headers["access-control-allow-origin"], origin);
  assert.equal(res.headers["cache-control"], "no-store");
  assert.equal(res.headers.vary, "Origin");
  assert.equal(app.calls.length, 2);
  const [limit, email] = app.calls;
  assert.equal(limit.url, redisUrl);
  assert.match(limit.body[3], /^contact:rate-limit:[a-f0-9]{64}$/);
  assert.ok(!limit.body[3].includes("203.0.113.10"));
  assert.deepEqual(email.body.to, [app.config.CONTACT_TO_EMAIL]);
  assert.equal(email.body.from, app.config.CONTACT_FROM_EMAIL);
  assert.equal(email.body.reply_to, validBody.email);
  assert.equal(email.body.subject, "New portfolio message from Test Visitor");
  assert.equal(email.options.headers.Authorization, "Bearer resend-test-secret");
  assert.ok(email.body.html.includes(validBody.message));
  assert.ok(!JSON.stringify(res.body).includes("secret"));
});

test("escapes all five HTML characters and retains optional service/budget fields", async () => {
  const app = setup();
  const raw = `Visitor & <tag> "double" 'single'`;
  const escaped = "Visitor &amp; &lt;tag&gt; &quot;double&quot; &#039;single&#039;";
  await app.request({ body: { ...validBody, name: raw, message: raw, service: raw, budget: raw } });
  const html = app.calls[1].body.html;
  assert.equal(html.split(escaped).length - 1, 4);
  assert.ok(!html.includes(raw));
  assert.ok(html.includes("<strong>Name:</strong>"));
});

test("accepts serialized JSON and exact minimum/maximum field lengths", async () => {
  const app = setup();
  assert.equal((await app.request({ body: JSON.stringify({ ...validBody, name: "AB", message: "1234567890" }) })).statusCode, 200);
  assert.equal((await app.request({ body: { ...validBody, name: "A".repeat(100), message: "M".repeat(5000), service: "S".repeat(200), budget: "B".repeat(200) } })).statusCode, 200);
});

for (const [label, body] of [
  ["empty name", { ...validBody, name: " " }],
  ["short name", { ...validBody, name: "A" }],
  ["long name", { ...validBody, name: "A".repeat(101) }],
  ["subject newline", { ...validBody, name: "Visitor\r\nBcc: victim@example.com" }],
  ["invalid email", { ...validBody, email: "not-an-email" }],
  ["overlong email", { ...validBody, email: "a".repeat(250) + "@example.com" }],
  ["empty message", { ...validBody, message: " " }],
  ["nine-character message", { ...validBody, message: "123456789" }],
  ["padded short message", { ...validBody, message: "   short   " }],
  ["long message", { ...validBody, message: "M".repeat(5001) }],
  ["missing message", { name: "Visitor", email: "visitor@example.com" }],
  ["long service", { ...validBody, service: "S".repeat(201) }],
  ["non-string field", { ...validBody, message: { text: "message" } }],
  ["non-string honeypot", { ...validBody, website: false }],
  ["null body", null],
  ["array body", [validBody]],
  ["invalid JSON", "{invalid}"],
]) {
  test(`rejects ${label} before calling external services`, async () => {
    const app = setup();
    assert.equal((await app.request({ body })).statusCode, 400);
    assert.equal(app.calls.length, 0);
  });
}

test("rejects oversized requests and non-JSON content", async () => {
  const app = setup();
  assert.equal((await app.request({ body: JSON.stringify({ ...validBody, extra: "x".repeat(32768) }) })).statusCode, 413);
  assert.equal((await app.request({ headers: { "content-length": "32769" } })).statusCode, 413);
  assert.equal((await app.request({ headers: { "content-type": "text/plain" } })).statusCode, 415);
  assert.equal(app.calls.length, 0);
});

test("honeypot returns generic success without quota or delivery", async () => {
  const app = setup();
  const res = await app.request({ body: { website: "bot.example" } });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(app.calls.length, 0);
});

test("rejects missing, deceptive, and foreign origins without reflecting them", async () => {
  const app = setup();
  for (const value of [undefined, "null", "https://evil.example", origin + ".evil.example", origin + "/"]) {
    const res = await app.request({ headers: { origin: value } });
    assert.equal(res.statusCode, 403);
    assert.equal(res.headers["access-control-allow-origin"], undefined);
  }
  assert.equal(app.calls.length, 0);
});

test("handles permitted preflight without quota and rejects disallowed headers/methods", async () => {
  const app = setup();
  const res = await app.request({ method: "OPTIONS", headers: { "access-control-request-method": "POST", "access-control-request-headers": "Content-Type, Accept" } });
  assert.equal(res.statusCode, 204);
  assert.equal(res.headers["access-control-allow-origin"], origin);
  assert.equal((await app.request({ method: "OPTIONS", headers: { "access-control-request-method": "DELETE" } })).statusCode, 403);
  assert.equal((await app.request({ method: "OPTIONS", headers: { "access-control-request-headers": "Authorization" } })).statusCode, 403);
  const get = await app.request({ method: "GET" });
  assert.equal(get.statusCode, 405);
  assert.equal(get.headers.allow, "POST, OPTIONS");
  assert.equal(app.calls.length, 0);
});

test("shared quota blocks the sixth request across separate API instances and expires", async () => {
  const shared = { keys: new Map(), now: 0 };
  const first = setup({ shared });
  const second = setup({ shared });
  const results = await Promise.all(Array.from({ length: 10 }, (_, i) => (i % 2 ? first : second).request()));
  assert.equal(results.filter(res => res.statusCode === 200).length, 5);
  assert.equal(results.filter(res => res.statusCode === 429).length, 5);
  for (const res of results.filter(res => res.statusCode === 429)) assert.equal(res.headers["retry-after"], "600");
  assert.equal([...first.calls, ...second.calls].filter(call => call.url.includes("resend.com")).length, 5);
  assert.equal((await first.request({ ip: "203.0.113.11" })).statusCode, 200);
  shared.now = 600001;
  assert.equal((await second.request()).statusCode, 200);
});

test("local requests ignore spoofed forwarding headers and IPv6 is normalized", async () => {
  const local = setup({ env: { VERCEL: undefined } });
  await local.request({ ip: "203.0.113.1" });
  await local.request({ ip: "203.0.113.2" });
  assert.equal(local.calls[0].body[3], local.calls[2].body[3]);
  const ipv6 = setup();
  await ipv6.request({ ip: "2001:db8::1" });
  await ipv6.request({ ip: "2001:0db8:0000:0000:0000:0000:0000:0001" });
  assert.equal(ipv6.calls[0].body[3], ipv6.calls[2].body[3]);
  assert.equal((await ipv6.request({ ip: "not-an-IP" })).statusCode, 503);
});

test("all required settings fail closed when missing; invalid origins/Redis URLs fail closed", async () => {
  for (const key of ["CONTACT_ALLOWED_ORIGIN", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL", "RESEND_API_KEY", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"]) {
    const app = setup({ env: { [key]: undefined } });
    assert.equal((await app.request()).statusCode, 503, key);
    assert.equal(app.calls.length, 0);
  }
  for (const value of [origin + "/", "*", "null", "ftp://example.com"]) {
    assert.equal((await setup({ env: { CONTACT_ALLOWED_ORIGIN: value } }).request()).statusCode, 503);
  }
  for (const value of ["http://redis.example.com", "https://user:password@redis.example.com", "not-a-url"]) {
    const app = setup({ env: { UPSTASH_REDIS_REST_URL: value } });
    assert.equal((await app.request()).statusCode, 503);
    assert.equal(app.calls.length, 0);
  }
});

test("Redis outages, errors, and malformed responses never bypass the limiter", async () => {
  for (const result of [json({ error: "secret provider details" }, 401), json({}), json(null), json({ result: [1, -1] }), json({ result: [1, "600"] })]) {
    const app = setup({ fetch: async () => result });
    const res = await app.request();
    assert.equal(res.statusCode, 503);
    assert.equal(app.calls.length, 1);
    assert.ok(!JSON.stringify(res.body).includes("secret"));
  }
  const app = setup({ fetch: async () => { throw new Error("connection secret"); } });
  assert.equal((await app.request()).statusCode, 503);
  assert.equal(app.calls.length, 1);
  assert.ok(!JSON.stringify(app.logs).includes("connection secret"));
});

test("Resend rejection, malformed success, and network failures return errors without fallback or leaks", async () => {
  for (const provider of [json({ message: "private provider details" }, 403), json({ success: true }), json(null), { ok: true, status: 200, json: async () => { throw new Error("not JSON"); } }, null]) {
    const app = setup({ fetch: async (url) => {
      if (url === redisUrl) return json({ result: [1, 600] });
      assert.equal(url, "https://api.resend.com/emails");
      if (!provider) throw new Error("private credentials");
      return provider;
    } });
    const res = await app.request();
    assert.equal(res.statusCode, 502);
    assert.equal(res.body.success, false);
    assert.equal(app.calls.length, 2);
    assert.ok(!JSON.stringify([res.body, app.logs]).includes("private"));
  }
});
