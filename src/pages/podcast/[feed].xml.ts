// Podcast RSS feed, built from src/data/episodes.json. Zero episodes is a valid feed.
import type { APIRoute } from "astro";
import episodes from "../../data/episodes.json";
import { abs, getCopy, CONTACT_EMAIL, PODCAST_AUTHOR, PODCAST_ENABLED } from "../../lib/site";

const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rfc822 = (d: string) => new Date(d).toUTCString();
const hms = (sec: number) => {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.floor(sec % 60);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
};

export function getStaticPaths() {
  return PODCAST_ENABLED ? [{ params: { feed: "feed" } }] : [];
}

export const GET: APIRoute = () => {
  const c = getCopy("en");
  const list = [...(episodes as any[])].sort((a, b) => +new Date(b.pubDate) - +new Date(a.pubDate));
  const items = list
    .map(
      (e, i) => `    <item>
      <title>${esc(e.title)}</title>
      <description>${esc(e.description)}</description>
      <link>${abs("/podcast/")}</link>
      <guid isPermaLink="false">${esc(e.guid)}</guid>
      <pubDate>${rfc822(e.pubDate)}</pubDate>
      <enclosure url="${esc(e.audioUrl)}" length="${e.audioBytes ?? 0}" type="${esc(e.audioType ?? "audio/mpeg")}" />
      <itunes:title>${esc(e.title)}</itunes:title>
      <itunes:duration>${hms(e.durationSeconds ?? 0)}</itunes:duration>
      <itunes:episode>${e.episodeNumber ?? list.length - i}</itunes:episode>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:explicit>${e.explicit ? "true" : "false"}</itunes:explicit>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Bad Leads</title>
    <link>${abs("/podcast/")}</link>
    <atom:link href="${abs("/podcast/feed.xml")}" rel="self" type="application/rss+xml" />
    <description>${esc(c.podcast.description)}</description>
    <language>en</language>
    <copyright>Bad Leads</copyright>
    <lastBuildDate>${rfc822(list[0]?.pubDate ?? new Date().toISOString())}</lastBuildDate>
    <itunes:author>${esc(PODCAST_AUTHOR)}</itunes:author>
    <itunes:summary>${esc(c.podcast.description)}</itunes:summary>
    <itunes:type>episodic</itunes:type>
    <itunes:explicit>false</itunes:explicit>
    <itunes:image href="${abs("/podcast/cover.jpg")}" />
    <image>
      <url>${abs("/podcast/cover.jpg")}</url>
      <title>Bad Leads</title>
      <link>${abs("/podcast/")}</link>
    </image>
    <itunes:category text="True Crime" />
    <itunes:category text="Comedy" />
    <itunes:owner>
      <itunes:name>${esc(PODCAST_AUTHOR)}</itunes:name>
      <itunes:email>${esc(CONTACT_EMAIL)}</itunes:email>
    </itunes:owner>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};
