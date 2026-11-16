// sitemap.xml: every public page in every enabled language, with hreflang alternates. No 404 page.
import type { APIRoute } from "astro";
import { abs, alternates, localePath, LOCALES, PODCAST_ENABLED } from "../lib/site";

const paths = ["/", ...(PODCAST_ENABLED ? ["/podcast/"] : []), "/privacy/", "/support/"];

export const GET: APIRoute = () => {
  const urls = paths
    .flatMap((p) =>
      LOCALES.map((l) => {
        const alts = alternates(p)
          .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`)
          .join("\n");
        return `  <url>\n    <loc>${abs(localePath(l, p))}</loc>\n${alts}\n  </url>`;
      })
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
