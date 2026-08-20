#!/bin/sh
# Builds the website for Vercel, from whatever directory Vercel starts in.
#
# Vercel runs the build command inside the project's configured Root
# Directory and then serves whatever `.vercel/output` it finds *there* (the
# Build Output API). That directory is not necessarily the repo root — this
# project's is a subdirectory — while Astro's adapter always writes its output
# next to apps/web. So the build is run from the repo root and the result is
# placed back in the directory Vercel is watching, whichever that is.
#
# Pointing the project's Root Directory at apps/web makes all of this
# unnecessary: the adapter would write straight to the right place.
set -e

# Where Vercel will look for the output: the directory it invoked us in.
TARGET="$(pwd)/.vercel/output"
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

echo "root directory: $(pwd)"
echo "repository root: $ROOT"

cd "$ROOT"
pnpm --filter web build

SOURCE="$ROOT/apps/web/.vercel/output"
if [ ! -d "$SOURCE" ]; then
  SOURCE="$(find "$ROOT" -maxdepth 5 -type d -path '*/.vercel/output' -not -path '*/node_modules/*' 2>/dev/null | head -1)"
fi

if [ -z "$SOURCE" ] || [ ! -d "$SOURCE" ]; then
  echo "the build produced no .vercel/output directory" >&2
  exit 1
fi

if [ "$SOURCE" != "$TARGET" ]; then
  rm -rf "$TARGET"
  mkdir -p "$(dirname "$TARGET")"
  cp -R "$SOURCE" "$TARGET"
fi

echo "build output ready at $TARGET"
ls "$TARGET"
