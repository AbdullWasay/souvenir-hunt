import { createRequire } from "node:module";

declare global {
  // Bundled CJS dependencies on Vercel may call bare `require()`.
  var require: NodeRequire | undefined;
}

if (typeof globalThis.require !== "function") {
  globalThis.require = createRequire(import.meta.url);
}
