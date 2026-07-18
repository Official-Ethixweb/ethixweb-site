import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  logLevel: "info",
  build: {
    target: ["es2019", "safari14"],
    rollupOptions: {
      onwarn(warning, warn) {
        const id = warning.id ?? "";
        if (
          id.includes("node_modules") &&
          (warning.code === "MODULE_LEVEL_DIRECTIVE" || warning.code === "UNUSED_EXTERNAL_IMPORT")
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
  plugins: [
    tailwindcss(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    // @ts-expect-error - `autoCodeSplitting` is the stable, runtime-required
    // option (the plugin throws at startup if the old `experimental.
    // enableCodeSplitting` path is used instead), but this package's shipped
    // .d.ts hasn't caught up yet. Verified via `npm run dev`/`npm run build`.
    tanstackStart({ router: { autoCodeSplitting: true } }),
    nitro({
      preset: "vercel",
      vercel: {
        // Assessment generation waits on multiple Gemini calls - give those
        // routes room beyond the default serverless duration.
        functionRules: {
          "/api/assessment/**": { maxDuration: 300 },
          // Finalizing a Google Ads assessment renders a PDF and sends two
          // emails synchronously - comfortably under a minute, but well
          // beyond the platform default.
          "/api/gads/submit": { maxDuration: 60 },
        },
      },
    }),
    viteReact(),
  ],
});
