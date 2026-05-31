import type { Plugin } from "vite";

const REQUIRE_PREFIX = `import { createRequire as __createRequire } from "node:module";
const require = __createRequire(import.meta.url);
`;

/** Bundled CJS deps (e.g. mongodb) emit bare require() — polyfill for Vercel ESM. */
export function injectCjsRequire(): Plugin {
  return {
    name: "inject-cjs-require",
    apply: "build",
    enforce: "post",
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type !== "chunk") continue;
        // Browser chunks live under assets/ — node:module breaks client hydration on Vercel.
        if (file.fileName.startsWith("assets/")) continue;
        if (!/\brequire\s*\(/.test(file.code)) continue;
        if (file.code.includes("__createRequire")) continue;
        file.code = REQUIRE_PREFIX + file.code;
      }
    },
  };
}
