#!/bin/bash
# Commit → push GitHub → deploy GitHub Pages → print LIVE URL
set -euo pipefail
cd "$(dirname "$0")"

echo "==> 1/5 Build for GitHub Pages"
export VITE_BASE="/bharat-hie-portal/"
npm run build
cp -f dist/index.html dist/404.html

echo "==> 2/5 Git commit"
if [ ! -d .git ]; then git init -b main; fi
git add -A
git commit -m "Deploy Bharat HIE Portal live" || echo "(no new changes)"

echo "==> 3/5 Push to GitHub (Sushantlode/bharat-hie-portal)"
gh auth status
USER=$(gh api user -q .login)
REPO="$USER/bharat-hie-portal"
echo "GitHub user: $USER"

if gh repo view "$REPO" >/dev/null 2>&1; then
  git remote remove origin 2>/dev/null || true
  git remote add origin "https://github.com/$REPO.git"
  git push -u origin main
else
  gh repo create "$REPO" --public --source=. --remote=origin --push
fi

echo "==> 4/5 Publish dist on gh-pages branch"
npx --yes gh-pages -d dist -b gh-pages -m "Live site"

echo "==> 5/5 Enable GitHub Pages from gh-pages branch"
# Try API (ignore errors if already enabled)
gh api -X PUT "repos/$REPO/pages" \
  -H "Accept: application/vnd.github+json" \
  -f build_type=legacy \
  -f "source[branch]=gh-pages" \
  -f "source[path]=/" 2>/dev/null \
|| gh api -X POST "repos/$REPO/pages" \
  -H "Accept: application/vnd.github+json" \
  -f build_type=legacy \
  -f "source[branch]=gh-pages" \
  -f "source[path]=/" 2>/dev/null \
|| true

LIVE="https://${USER}.github.io/bharat-hie-portal/"
SETTINGS="https://github.com/${REPO}/settings/pages"

echo ""
echo "=============================================="
echo " LIVE URL : $LIVE"
echo " REPO     : https://github.com/$REPO"
echo " SETTINGS : $SETTINGS"
echo "=============================================="
echo "If you still see 404 for 1–2 minutes, wait and refresh."
echo "Or open SETTINGS → Pages → Source = Deploy from branch → gh-pages / (root) → Save."
