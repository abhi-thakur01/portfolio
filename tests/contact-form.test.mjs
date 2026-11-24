import assert from "node:assert/strict";
import { test } from "node:test";
import { loadModule } from "./helpers/load-module.mjs";

function setup(fetchResponse = async () => ({ ok: true, status: 200, json: async () => ({ success: true }) })) {
  const hooks = [];
  let cursor = 0;
  const calls = [];
  const timers = new Map();
  let nextTimer = 0;
  const react = {
    useRef(initial) {
      const index = cursor++;
      if (!(index in hooks)) hooks[index] = { current: initial };
      return hooks[index];
    },
    useState(initial) {
      const index = cursor++;
      if (!(index in hooks)) hooks[index] = initial;
      return [hooks[index], value => { hooks[index] = typeof value === "function" ? value(hooks[index]) : value; }];
    },
  };
  const jsx = (type, props) => ({ type, props });
  const { Contact } = loadModule("../src/components/Contact.jsx", {
    modules: {
      react,
      "react/jsx-runtime": { jsx, jsxs: jsx },
      "lucide-react": {},
      "../data/content": { personal: { email: "owner@example.com", phone: "", location: "India" } },
      "./motion": {},
    },
    window: {
      setTimeout(callback) { const id = ++nextTimer; timers.set(id, callback); return id; },
      clearTimeout(id) { timers.delete(id); },
    },
    fetch: async (...args) => { calls.push(args); return fetchResponse(...args); },
  });
  function render() { cursor = 0; return Contact(); }
  function find(predicate) {
    function visit(node) {
      if (Array.isArray(node)) return node.flatMap(visit);
      if (!node || typeof node !== "object") return [];
      return [...(predicate(node) ? [node] : []), ...visit(node.props?.children)];
    }
    return visit(render());
  }
  function fields(values) {
    for (const [name, value] of Object.entries(values)) {
      const field = find(node => node.props?.name === name)[0];
      field.props.onChange({ target: { name, value } });
    }
  }
  function submit() { return find(node => node.type === "form")[0].props.onSubmit({ preventDefault() {} }); }
  function text() {
    function collect(node) {
      if (Array.isArray(node)) return node.map(collect).join(" ");
      if (node && typeof node === "object") return collect(node.props?.children);
      return typeof node === "string" ? node : "";
    }
    return collect(render());
  }
  return { calls, fields, find, submit, text, timers };
}

const valid = { name: "Visitor", email: "visitor@example.com", message: "A useful message." };

test("posts trimmed JSON and honeypot only to the same-origin API, then resets on success", async () => {
  const form = setup();
  form.fields({ name: "  Visitor  ", email: " visitor@example.com ", message: "  A useful message.  ", website: "" });
  await form.submit();
  assert.equal(form.calls.length, 1);
  const [url, options] = form.calls[0];
  assert.equal(url, "/api/contact");
  assert.equal(options.method, "POST");
  assert.equal(options.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(options.body), { ...valid, website: "" });
  assert.ok(!options.headers.Authorization);
  assert.match(form.text(), /Message sent!/);
  assert.equal(form.timers.size, 0);
  const again = form.find(node => node.type === "button" && node.props.children === "Send another message")[0];
  again.props.onClick();
  for (const name of Object.keys(valid)) assert.equal(form.find(node => node.props?.name === name)[0].props.value, "");
});

for (const [label, values, error] of [
  ["missing name", { ...valid, name: " " }, /Name must/],
  ["short name", { ...valid, name: "A" }, /Name must/],
  ["overlong name", { ...valid, name: "A".repeat(101) }, /Name must/],
  ["newline name", { ...valid, name: "Visitor\r\nInjected" }, /Name must/],
  ["invalid email", { ...valid, email: "invalid" }, /Valid email/],
  ["overlong email", { ...valid, email: "a".repeat(250) + "@example.com" }, /Valid email/],
  ["empty message", { ...valid, message: "" }, /Message must/],
  ["short message", { ...valid, message: "123456789" }, /Message must/],
  ["padded short message", { ...valid, message: "    short    " }, /Message must/],
  ["overlong message", { ...valid, message: "M".repeat(5001) }, /Message must/],
]) {
  test(`frontend rejects ${label} before a network request`, async () => {
    const form = setup();
    form.fields(values);
    await form.submit();
    assert.match(form.text(), error);
    assert.equal(form.calls.length, 0);
    assert.equal(form.find(node => node.props?.role === "alert").length, 1);
  });
}

test("a message of exactly ten trimmed characters is accepted", async () => {
  const form = setup();
  form.fields({ ...valid, message: "  1234567890  " });
  await form.submit();
  assert.equal(form.calls.length, 1);
  assert.match(form.text(), /Message sent!/);
});

test("labels, required message constraints and loading state are accessible", () => {
  const form = setup();
  const textarea = form.find(node => node.type === "textarea")[0].props;
  assert.equal(textarea.required, true);
  assert.equal(textarea.minLength, 10);
  assert.equal(textarea.maxLength, 5000);
  for (const name of Object.keys(valid)) {
    const input = form.find(node => node.props?.name === name)[0].props;
    assert.equal(form.find(node => node.type === "label" && node.props.htmlFor === input.id).length, 1);
  }
  assert.equal(form.find(node => node.type === "form")[0].props["aria-busy"], false);
  assert.ok(!form.text().includes("optional"));
});

test("loading disables the button and blocks duplicate submissions before re-render", async () => {
  let resolve;
  const form = setup(() => new Promise(done => { resolve = done; }));
  form.fields(valid);
  const submit = form.find(node => node.type === "form")[0].props.onSubmit;
  const pending = submit({ preventDefault() {} });
  await submit({ preventDefault() {} });
  assert.equal(form.calls.length, 1);
  assert.equal(form.find(node => node.props?.type === "submit")[0].props.disabled, true);
  assert.equal(form.find(node => node.type === "form")[0].props["aria-busy"], true);
  assert.match(form.text(), /Sending/);
  resolve({ ok: true, status: 200, json: async () => ({ success: true }) });
  await pending;
  assert.match(form.text(), /Message sent!/);
});

test("HTTP errors, rate limits, malformed responses and network errors retain values and allow retry", async () => {
  for (const response of [
    async () => ({ ok: false, status: 429, json: async () => ({ success: false, error: "Too many messages. Please try later." }) }),
    async () => ({ ok: false, status: 503, json: async () => ({ error: "Contact form is temporarily unavailable." }) }),
    async () => ({ ok: false, status: 500, json: async () => ({ success: true }) }),
    async () => ({ ok: true, status: 200, json: async () => ({ success: "true" }) }),
    async () => ({ ok: true, status: 200, json: async () => null }),
    async () => ({ ok: false, status: 502, json: async () => { throw new Error("bad JSON"); } }),
    async () => { throw new Error("Network unavailable"); },
  ]) {
    const form = setup(response);
    form.fields(valid);
    await form.submit();
    assert.ok(!form.text().includes("Message sent!"));
    assert.equal(form.find(node => node.props?.role === "alert").length, 1);
    assert.equal(form.find(node => node.props?.type === "submit")[0].props.disabled, false);
    for (const [name, value] of Object.entries(valid)) assert.equal(form.find(node => node.props?.name === name)[0].props.value, value);
    await form.submit();
    assert.equal(form.calls.length, 2);
    assert.equal(form.timers.size, 0);
  }
});

test("server rate-limit messages are displayed and cleared on field edits", async () => {
  const form = setup(async () => ({ ok: false, status: 429, json: async () => ({ success: false, error: "Too many messages. Please try again in a few minutes." }) }));
  form.fields(valid);
  await form.submit();
  assert.match(form.text(), /Too many messages/);
  form.fields({ message: "An edited message." });
  assert.equal(form.find(node => node.props?.role === "alert").length, 0);
});

test("request timeout aborts delivery, shows an error, and clears loading", async () => {
  const form = setup(async (_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })));
  }));
  form.fields(valid);
  const pending = form.submit();
  for (const timeout of form.timers.values()) timeout();
  await pending;
  assert.match(form.text(), /timed out/);
  assert.equal(form.find(node => node.props?.type === "submit")[0].props.disabled, false);
  assert.equal(form.timers.size, 0);
});
