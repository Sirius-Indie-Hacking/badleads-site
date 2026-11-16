#!/bin/bash
# One-time copy of the existing game art and fonts into the site folder.
set -e
cd "$(dirname "$0")/.."
R=../research/ep1-next
mkdir -p public/fonts src/assets/art
for f in bebas-neue-latin-ext.woff2 bebas-neue-latin.woff2 figtree-latin-ext.woff2 figtree-latin.woff2 playfair-display-italic-latin-ext.woff2 playfair-display-italic-latin.woff2 OFL-bebasneue.txt OFL-figtree.txt OFL-playfairdisplay.txt; do
  cp "$R/fonts/$f" public/fonts/
done
for f in city1.jpg city2.jpg map.jpg officeA.jpg kip.png nora.png peeps.png granny.png; do
  cp "$R/img/$f" src/assets/art/
done
for f in courthouse.jpg hush-note.jpg ladies.jpg; do
  cp "$R/img/part-f/$f" src/assets/art/
done
cp "$R/later-art/sprites/sterling.png" "$R/later-art/sprites/judge.png" src/assets/art/
cp "$R/scene6/assets/kimi.png" src/assets/art/
ls public/fonts src/assets/art
