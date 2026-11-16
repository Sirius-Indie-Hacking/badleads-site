// Headless screenshots of every page at phone and desktop size, plus a log of outside requests.
import { chromium } from "playwright";
import fs from "node:fs";
import os from "node:os";
import { serve } from "./serve.mjs";
const exe = `${os.homedir()}/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`;
const pages = { home: "/", podcast: "/podcast/", privacy: "/privacy/", support: "/support/", "404": "/nothing-here/" };
const only = process.argv.slice(2);
const server = await serve(4397);
fs.mkdirSync("proof", { recursive: true });
const browser = await chromium.launch({ executablePath: exe, headless: true });
const outside = new Set();
for (const [w, h, tag] of [[390, 844, "390"], [1440, 900, "1440"]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on("request", (r) => { const u = new URL(r.url()); if (!["127.0.0.1", "localhost"].includes(u.hostname) && u.protocol.startsWith("http")) outside.add(r.url()); });
  for (const [name, p] of Object.entries(pages)) {
    if (only.length && !only.includes(name)) continue;
    await page.goto(`http://127.0.0.1:4397${p}`, { waitUntil: "networkidle" });
    // lazy images: scroll through so they load before the full-page shot
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(400);
    await page.screenshot({ path: `proof/${name}-${tag}.png`, fullPage: true });
    const over = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(name, tag, over ? "HORIZONTAL OVERFLOW" : "ok");
  }
  await ctx.close();
}
console.log("outside requests:", outside.size, [...outside].join(" "));
await browser.close(); server.close();
