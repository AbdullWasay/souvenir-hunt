import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const isCloudflareBuild = process.argv.includes("build");

export default defineConfig({
  plugins: [
    ...(isCloudflareBuild
      ? [cloudflare({ viteEnvironment: { name: "ssr" } })]
      : []),
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({
      server: { entry: "server" },
    }),
    viteReact(),
  ],
});
