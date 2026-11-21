// Oracle for the Static City site redesign. Serves dist/ locally, opens every page at 390 and 1440 wide,
// and prints "SITE CHECK PASSED" only if every assertion holds. Run after `npm run build`.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "/home/sirius/.npm/_npx/31e32ef8478fbf80/node_modules/playwright-core/index.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const fail = [];
fs.mkdirSync(path.join(root, "proof/v3"), { recursive: true });
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml", ".json": "application/json", ".mp3": "audio/mpeg" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  let f = path.join(dist, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!fs.existsSync(f)) { res.writeHead(404); res.end(fs.readFileSync(path.join(dist, "404.html"))); return; }
  res.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); res.end(fs.readFileSync(f));
}).listen(0);
const port = server.address().port, origin = `http://127.0.0.1:${port}`;

// 1. Privacy and support words must not change (Apple reviewed them, 2026-11-18). Compare visible <main> text.
const norm = (t) => t.replace(/\s+/g, " ").trim();
for (const pg of ["privacy", "support"]) {
  const h = fs.readFileSync(path.join(dist, pg, "index.html"), "utf8");
  const m = h.match(/<main[^>]*>([\s\S]*)<\/main>/); let t = m ? m[1] : h;
  t = t.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, "").replace(/<[^>]+>/g, " ");
  t = t.replace(/&amp;/g, "&").replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
  const base = fs.readFileSync(path.join(root, "scripts/baseline", pg + ".txt"), "utf8");
  if (norm(t) !== norm(base)) fail.push(`${pg}: visible text changed from the Apple-reviewed version`);
}
import("node:child_process").then(() => {});
{ const { execSync } = await import("node:child_process");
  for (const f of ["public/app-ads.txt", "site.config.mjs"]) {
    const diff = execSync(`git diff --stat bf8c184 -- ${f}`, { cwd: root }).toString().trim();
    if (diff) fail.push(`${f} changed from the live state (bf8c184)`);
  } }
const sections = ["hero", "theory", "search", "talk", "office", "court"];
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome-stable", headless: true, args: ["--mute-audio"] });
for (const page of ["/", "/privacy/", "/support/", "/does-not-exist/"]) {
  for (const w of [390, 1440]) {
    const p = await b.newPage({ viewport: { width: w, height: w === 390 ? 844 : 900 } });
    const errs = [], outside = [];
    p.on("console", (m) => m.type() === "error" && !/404/.test(m.text()) && errs.push(m.text()));
    p.on("pageerror", (e) => errs.push(String(e)));
    p.on("request", (r) => { const u = r.url(); if (!u.startsWith(origin) && !u.startsWith("data:") && !u.startsWith("blob:")) outside.push(u); });
    await p.goto(origin + page, { waitUntil: "networkidle" });
    // scroll through the page so lazy images load and scroll-driven code runs
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 600) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(60); }
    await p.waitForTimeout(600);
    const tag = `${page} @${w}`;
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    if (sw > w) fail.push(`${tag}: sideways scroll (${sw}px wide)`);
    if (errs.length) fail.push(`${tag}: console errors: ${errs.join(" | ")}`);
    if (outside.length) fail.push(`${tag}: outside requests: ${outside.slice(0, 3).join(", ")}`);
    const broken = await p.evaluate(() => [...document.images].filter((i) => { const r = i.getBoundingClientRect(); return i.loading !== "lazy" || (r.left < innerWidth && r.right > 0); }).filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => i.currentSrc || i.src));
    if (broken.length) fail.push(`${tag}: images not loaded: ${broken.slice(0, 3).join(", ")}`);
    const small = await p.evaluate(() => [...document.querySelectorAll("p, li, a, button, span, dd, dt")].filter((e) => e.offsetParent && e.textContent.trim() && parseFloat(getComputedStyle(e).fontSize) < 12).length);
    if (small) fail.push(`${tag}: ${small} visible text elements under 12px`);
    if (page === "/") {
      for (const s of sections) if (!(await p.$(`#${s}`))) fail.push(`${tag}: missing section #${s}`);
      await p.screenshot({ path: path.join(root, `proof/v3/home-${w}.png`), fullPage: true });
    } else {
      await p.screenshot({ path: path.join(root, `proof/v3/${page.replace(/\//g, "") || "home"}-${w}.png`), fullPage: true });
    }
    await p.close();
  }
}
await b.close(); server.close();
if (fail.length) { console.log("FAILED:\n- " + fail.join("\n- ")); process.exit(1); }
console.log("SITE CHECK PASSED");
