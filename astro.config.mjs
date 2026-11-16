import { defineConfig } from "astro/config";
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { SITE_URL, PODCAST_ENABLED } from "./site.config.mjs";

// Podcast off: the files in public/ (cover, social card) are copied by Astro, so drop them from dist.
const podcastOff = {
  name: "podcast-off",
  hooks: {
    "astro:build:done": ({ dir }) => {
      if (PODCAST_ENABLED) return;
      const out = fileURLToPath(dir);
      rmSync(`${out}podcast`, { recursive: true, force: true });
      rmSync(`${out}og/podcast.jpg`, { force: true });
    },
  },
};

// Static site for Cloudflare (Workers static assets), same shape as uxllabs.xyz and hushpane.xyz.
// CSS is inlined into each page so the first screen needs no extra stylesheet request.
export default defineConfig({
  site: SITE_URL,
  output: "static",
  trailingSlash: "always",
  compressHTML: true,
  build: { format: "directory", inlineStylesheets: "always" },
  devToolbar: { enabled: false },
  integrations: [podcastOff],
});
