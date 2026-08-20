#!/bin/sh
# Builds the website for Vercel from the workspace root.
#
# Vercel serves whatever it finds in `.vercel/output` (the Build Output API)
# relative to the project's Root Directory — here, the repo root. Astro's
# adapter writes that directory relative to its own root, which is apps/web,
# so the output usually has to be moved up one level. The location has moved
# between adapter versions, so it is located rather than assumed, and printed
# either way to keep the build log self-explanatory.
set -e

pnpm --filter web build

echo "--- Build Output API directories found ---"
find . -maxdepth 5 -type d -path '*/.vercel/output' -not -path './node_modules/*' 2>/dev/null || true
echo "------------------------------------------"

if [ -d .vercel/output ]; then
  echo "output is already at the repo root"
  exit 0
fi

SOURCE=$(find . -maxdepth 5 -type d -path '*/.vercel/output' -not -path './node_modules/*' 2>/dev/null | head -1)

if [ -z "$SOURCE" ]; then
  echo "the build produced no .vercel/output directory" >&2
  exit 1
fi

mkdir -p .vercel
cp -R "$SOURCE" .vercel/output
echo "copied $SOURCE -> .vercel/output"
