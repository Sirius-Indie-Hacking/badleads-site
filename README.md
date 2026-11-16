# Bad Leads site (Astro, static)

Not deployed. Edit `site.config.mjs` (domain, store links, podcast links, email), then:
Podcast is OFF for launch: set `PODCAST_ENABLED = true` in `site.config.mjs` to bring back the page, feed, nav link and home section. App Store button: set `APP_STORE_URL`.

1. Buy the domain on Porkbun, add it to Cloudflare (change nameservers). Set `SITE_URL` and the two `routes` in `wrangler.jsonc` to it.
2. `npm install && npm run deploy` (builds, then `wrangler deploy`; Cloudflare creates the DNS records for the `custom_domain` routes).
3. Put the new domain in App Store Connect as the Marketing/Support URL: Google reads `/app-ads.txt` only from the site listed there. Make the `CONTACT_EMAIL` address real (Cloudflare Email Routing) and point the in-game Privacy and Support links here.
4. Podcast: add episodes to `src/data/episodes.json` (guid, title, description, pubDate, audioUrl, audioBytes, durationSeconds). Host the mp3 files yourself (Cloudflare R2). Check with `npm run build && bash scripts/check-feed.sh`.
5. Spotify and Apple Podcasts need at least 1 episode, square cover (`public/podcast/cover.jpg`, 3000x3000, upscaled from the game art), the owner email in the feed, and the feed URL `/podcast/feed.xml`. Paste the listing links into `PODCAST_LINKS`.
6. More languages: add `src/i18n/<lang>.ts`, copy the `src/pages/` files into `src/pages/<lang>/` with `lang="<lang>"`, add the code to `LOCALES`. hreflang and sitemap follow.

Other commands: `npm run assets` rebuilds social cards, cover and icons from the game art. Fonts are self-hosted (OFL).
