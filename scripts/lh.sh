#!/bin/bash
# Lighthouse (mobile) for one path. Usage: lh.sh <lighthouse-bin> <path> <out-name>
# Needs the dist server running: node scripts/serve.mjs 4399
set -e
export CHROME_PATH="$HOME/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome"
cd "$(dirname "$0")/.."
mkdir -p proof/lh
"$1" "http://127.0.0.1:4399$2" --form-factor=mobile --only-categories=seo,accessibility,performance,best-practices \
  --chrome-flags="--headless=new --no-sandbox" --output=json --output-path="proof/lh/$3.json" --quiet
node -e '
const r=JSON.parse(require("fs").readFileSync("proof/lh/'"$3"'.json","utf8"));
const c=r.categories;
console.log("'"$3"'", Object.entries(c).map(([k,v])=>k+" "+Math.round(v.score*100)).join("  "));
const a=r.audits;
console.log("  LCP",a["largest-contentful-paint"].displayValue,"CLS",a["cumulative-layout-shift"].displayValue,"TBT",a["total-blocking-time"].displayValue);
for (const [id,au] of Object.entries(a)) if (au.score!==null && au.score<1 && au.scoreDisplayMode==="binary") console.log("  FAIL",id,au.title);
'
