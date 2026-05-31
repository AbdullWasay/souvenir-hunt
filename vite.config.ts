import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { injectCjsRequire } from "./vite.inject-cjs-require";

const isBuild = process.argv.includes("build");
const deployTarget = process.env.DEPLOY_TARGET ?? (process.env.VERCEL ? "vercel" : "cloudflare");

export default defineConfig({
  plugins: [
    ...(isBuild && deployTarget === "cloudflare"
      ? [cloudflare({ viteEnvironment: { name: "ssr" } })]
      : []),
    ...(isBuild && deployTarget === "vercel"
      ? [
          nitro({
            preset: "vercel",
          }),
          injectCjsRequire(),
        ]
      : []),
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({
      server: { entry: "server" },
    }),
    viteReact(),
  ],
});
