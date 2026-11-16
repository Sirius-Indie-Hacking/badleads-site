#!/bin/bash
# Validates dist/podcast/feed.xml: well-formed, RSS 2.0, iTunes namespace, and every element Apple and Spotify read.
# Usage: bash scripts/check-feed.sh [path-to-feed.xml]
F="${1:-$(dirname "$0")/../dist/podcast/feed.xml}"
fail=0
xmllint --noout "$F" && echo "well-formed: yes" || fail=1
x() { # name xpath
  n=$(xmllint --xpath "count($2)" "$F" 2>/dev/null)
  if [ "${n:-0}" -ge 1 ]; then echo "ok   $1 ($n)"; else echo "MISS $1"; fail=1; fi
}
x "rss version 2.0" "/rss[@version='2.0']"
grep -q 'xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"' "$F" && echo "ok   itunes namespace declared" || { echo "MISS itunes namespace"; fail=1; }
x "channel title" "/rss/channel/title[text()='Bad Leads']"
x "channel link" "/rss/channel/link"
x "channel description" "/rss/channel/description[string-length(text())>10]"
x "language en" "/rss/channel/language[text()='en']"
x "atom self link" "/rss/channel/*[local-name()='link'][@rel='self']"
x "itunes:author" "/rss/channel/*[local-name()='author']"
x "itunes:explicit false" "/rss/channel/*[local-name()='explicit'][text()='false']"
x "itunes:image href" "/rss/channel/*[local-name()='image'][@href]"
x "itunes:category True Crime" "/rss/channel/*[local-name()='category'][@text='True Crime']"
x "itunes:category Comedy" "/rss/channel/*[local-name()='category'][@text='Comedy']"
x "itunes:owner email" "/rss/channel/*[local-name()='owner']/*[local-name()='email']"
items=$(xmllint --xpath "count(/rss/channel/item)" "$F")
echo "items: $items"
if [ "$items" -ge 1 ]; then
  x "item title" "/rss/channel/item/title"
  x "item guid" "/rss/channel/item/guid"
  x "item pubDate" "/rss/channel/item/pubDate"
  x "item enclosure url+length+type" "/rss/channel/item/enclosure[@url and @length and @type]"
  x "item itunes:duration" "/rss/channel/item/*[local-name()='duration']"
  x "item itunes:explicit" "/rss/channel/item/*[local-name()='explicit']"
fi
[ $fail -eq 0 ] && echo "FEED OK" || echo "FEED PROBLEMS"
exit $fail
