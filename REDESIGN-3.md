# Bad Leads site, redesign 3 (owner: "redo badleads.xyz with the same creativity" as the Static City site)

Branch `redesign-3` of this repo (the live state is saved in commit bf8c184). Read the method first: /home/sirius/coding/indieHacking/GUIDES/website-design-playbook.md. The owner already approved this direction: do not stop to ask.

KEEP exactly: Astro setup, every page (/, /privacy/, /support/, 404, robots, sitemap, app-ads.txt, podcast pages behind PODCAST_ENABLED=false), SEO (canonical, OG, JSON-LD, hreflang logic), site.config.mjs (byte-identical), public/app-ads.txt (byte-identical), the App Store badge logic in AppCta, the Apple trademark line, the privacy and support WORDS (Apple reviewed them; restyle only, the check script compares the text), self-hosted fonts, no outside requests, the voiced opening audio public/audio/opening.mp3.
THROW AWAY: the case-file / corkboard / red-yarn / lineup / index-card look of redesigns 1 and 2. Nothing from them may come back.

## Concept: "Kip is sure. Kip is wrong."
The joke of the game is the joke of the site: Kip Hartley, a broke noir detective, is confident and almost always wrong; PEEPS, the little ball robot, scans things and is quietly right; you, the player, solve it.
Signature (one system, used everywhere, nowhere else): **the PEEPS scan**. A thin amber scanline sweeps across a picture or a statement, then a small mono readout appears in PEEPS's broken baby talk, e.g. `PEEPS SCAN · kip is 3% right · we win?`. Every section opens with one confident noir line from Kip; the scan then answers it. Use only real lines and real character facts from the game (see Sources); invent no story facts. Never spoil the culprit.

## Sections (ids are checked)
1. `#hero` — full-bleed night city (src/assets/art/city1.jpg or city2.jpg, pick the stronger), slow 1.04 push-in, a neon sign flicker once. The crisp BAD LEADS wordmark huge. Line: "A comedy murder mystery for iPhone and iPad. Kip is sure. Kip is wrong. You solve it." A round "Play Kip's opening" button: plays opening.mp3 with the narration typed as subtitles in sync (Playfair italic), muted until pressed. CTA: the App Store badge from AppCta.
2. `#theory` — "Kip's theory": one of Kip's real overconfident lines set huge in Playfair Display on a dark slab, Kip's art (kip.png) beside it. On scroll-in the PEEPS scan sweeps the quote, a red rubber stamp lands at an angle: `BAD LEAD`, and the PEEPS readout types under it. One short paragraph on what you actually do.
3. `#search` — "Search everything": a real game room picture (the office, src/assets/art/officeA.jpg, spoiler-safe) with 5 tap spots (quiet outline on hover/focus, keyboard reachable). Tapping one shows that object's REAL line from the game in a small caption card (jokes and useless objects, never a key clue). A counter "3 of 5 searched".
4. `#talk` — "Catch the lie": a visual-novel talk demo (big character art, one line per tap, speakers alternate, faces from the game art; NEVER speech bubbles) using a real spoiler-free exchange (the Granny Fong rent scene is ideal). End with the mechanic shown, not told: a "Show a clue" moment if the real scene has one, else one line explaining "show a clue mid-talk to crack a lie" next to src/assets/shots/talk.jpg.
5. `#office` — "The office": the office panorama (officeB.jpg) as one wide stage; Kip, Nora, PEEPS and Granny Fong are placed in it (their png art). Tap or focus a person: PEEPS scans them and a readout card shows name, role and one deadpan line from the bible (Nora hosts a podcast with 47 episodes and 9 listeners; Granny is sweet until rent day; Inspector Whiskers the cat "never finds clues"). Phone: the panorama pans horizontally with scroll-snap stops on each person.
6. `#court` — "Case closed?": the courthouse art full-bleed, Judge Snorr's gavel line (real, from the game if there is one), how an episode ends (court or a reveal, 1 to 3 stars and a funny rank title), the 8 game languages listed plainly, the App Store CTA again.
7. Footer: quiet one line (Privacy, Support, copyright and the Apple trademark line exactly as now).
Privacy, support, 404: readable documents in the new look (max 68ch). 404: a PEEPS scan over an empty room with "nothing here, friend".

## Sources (read-only)
- /home/sirius/coding/indieHacking/game-development/mystery-game/GAME-BIBLE.md (cast table, tone, rules), OWNER-TASTE.md (grep site, web, joke, Archer).
- The game: research/ep1-next/play.html (all lines, hotspots, talks). Never quote anything that names or hints at the culprit.
- Art already in the site: src/assets/art/*, src/assets/shots/*. No image generation.

## Rules
- Skills to read and follow: /home/sirius/.claude/skills/unslop/SKILL.md, impeccable/SKILL.md, soft-skill/SKILL.md, modern-web-guidance/SKILL.md, scroll-animations/SKILL.md, make-interfaces-feel-better/SKILL.md (all under /home/sirius/.claude/skills/).
- Type: the game's fonts already self-hosted (Bebas Neue for the wordmark only, Playfair Display for Kip's lines, Figtree for body 17-18px), plus one mono for PEEPS readouts if one is self-hosted; else use Figtree tabular. Palette: the current warm-ink night ramp, amber accent for the scan, one red only for the BAD LEAD stamp.
- Tone: deadpan, Archer-like; no exclamation marks, no hype words, no "AI", no review or download numbers.
- Motion: one entrance per section; scanline sweeps once per element; everything decorative off under prefers-reduced-motion; audio only after a press.
- Performance: Lighthouse mobile performance >= 90, accessibility >= 95, SEO 100.
- Do not deploy, do not push, do not touch files outside site/.
