// Builds the social cards, the podcast cover and the icons from the game's own art (headless Chromium).
// Run: npm run assets   (needs the Playwright Chromium in ~/.cache/ms-playwright)
import { chromium } from "playwright";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const exe = `${os.homedir()}/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`;
fs.mkdirSync(`${root}/public/og`, { recursive: true });
fs.mkdirSync(`${root}/public/podcast`, { recursive: true });
const jobs = [
  ["cover", 3000, 3000, "public/podcast/cover.jpg", ""],
  ["og-home", 1200, 630, "public/og/home.jpg", ""],
  ["og-podcast", 1200, 630, "public/og/podcast.jpg", ""],
  ["og-page", 1200, 630, "public/og/page.jpg", ""],
  ["icon", 48, 48, "public/favicon.png", "&s=44"],
  ["icon", 180, 180, "public/apple-touch-icon.png", "&s=150"],
];
const b = await chromium.launch({ executablePath: exe });
for (const [kind, w, h, out, extra] of jobs) {
  const page = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto(`file://${root}/scripts/tpl/card.html?kind=${kind}${extra}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const type = out.endsWith(".png") ? "png" : "jpeg";
  await page.screenshot({ path: `${root}/${out}`, type, ...(type === "jpeg" ? { quality: 84 } : {}) });
  console.log(out, w + "x" + h, Math.round(fs.statSync(`${root}/${out}`).size / 1024) + " KB");
  await page.close();
}
await b.close();
