import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const nativeRequire = createRequire(import.meta.url);

// Compile existing TS/JSX in memory so tests need no generated files or new SDKs.
export function loadModule(relativePath, { modules = {}, ...globals } = {}) {
  const file = new URL(relativePath, new URL("../", import.meta.url));
  const compiled = ts.transpileModule(readFileSync(file, "utf8"), {
    fileName: file.pathname,
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    reportDiagnostics: true,
  });
  assert.equal(compiled.diagnostics?.length || 0, 0, "Module must transpile without errors");
  const module = { exports: {} };
  vm.runInNewContext(compiled.outputText, {
    module,
    exports: module.exports,
    require(name) {
      if (Object.hasOwn(modules, name)) return modules[name];
      if (name.startsWith("node:")) return nativeRequire(name);
      throw new Error(`Unexpected import: ${name}`);
    },
    URL,
    Buffer,
    AbortSignal,
    AbortController,
    console,
    ...globals,
  }, { filename: file.pathname });
  return module.exports;
}
