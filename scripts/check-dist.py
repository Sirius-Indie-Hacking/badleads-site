#!/usr/bin/env python3
"""Checks on dist/: no UXL mentions, no dashes or exclamation marks in visible text, JSON-LD parses, every page has canonical + OG + one h1."""
import glob, json, re, sys, os

root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "dist")
bad = 0
for f in glob.glob(root + "/**/*", recursive=True):
    if os.path.isfile(f) and f.endswith((".html", ".xml", ".txt", ".json", ".css")):
        t = open(f, encoding="utf-8").read()
        if re.search(r"uxl", t, re.I):
            print("UXL found in", f); bad += 1
for f in glob.glob(root + "/**/*.html", recursive=True):
    h = open(f, encoding="utf-8").read()
    rel = os.path.relpath(f, root)
    body = re.sub(r"<(script|style)[^>]*>.*?</\1>", "", h, flags=re.S)
    text = re.sub(r"<[^>]+>", " ", body)
    for ch, name in (("—", "em dash"), ("–", "en dash"), ("!", "exclamation mark"), ("·", "middle dot")):
        if ch in text:
            print(rel, "has", name); bad += 1
    metas = re.findall(r'<meta[^>]+content="([^"]*)"', h)
    for m in metas + re.findall(r'<title>(.*?)</title>', h):
        if "—" in m or "!" in m:
            print(rel, "dash/exclamation in meta/title:", m); bad += 1
    for j in re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, flags=re.S):
        try: json.loads(j)
        except Exception as e: print(rel, "bad JSON-LD", e); bad += 1
    n = len(re.findall(r"<h1[ >]", h))
    title = re.search(r"<title>(.*?)</title>", h).group(1)
    desc = re.search(r'name="description" content="([^"]*)"', h).group(1)
    print(f"{rel}: h1={n} canonical={'rel=\"canonical\"' in h} og:image={'og:image' in h} title={len(title)}ch desc={len(desc)}ch jsonld={len(re.findall('ld.json', h))}")
    if n != 1: bad += 1
print("PROBLEMS:", bad)
sys.exit(1 if bad else 0)
