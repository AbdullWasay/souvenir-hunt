import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const serverExternals = [
  "mongodb",
  "bson",
  "bcryptjs",
  "stripe",
  "@emotion/is-prop-valid",
];

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
            rollupConfig: {
              external: serverExternals,
            },
          }),
        ]
      : []),
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({
      server: { entry: "server" },
    }),
    viteReact(),
  ],
  ...(isBuild && deployTarget === "vercel"
    ? {
        environments: {
          ssr: {
            build: {
              rollupOptions: {
                external: serverExternals,
              },
            },
            resolve: {
              external: serverExternals,
            },
          },
        },
      }
    : {}),
});
