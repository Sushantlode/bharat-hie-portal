#!/bin/bash
# One-shot: commit → GitHub → live GitHub Pages URL
set -euo pipefail
cd "$(dirname "$0")"

echo "==> Building for GitHub Pages…"
export VITE_BASE="/bharat-hie-portal/"
npm run build
cp dist/index.html dist/404.html
# SPA fallback for client routes
cp dist/index.html dist/200.html 2>/dev/null || true


echo "==> Preparing git…"
if [ ! -d .git ]; then
  git init -b main
fi

# Ensure ignore list
grep -q '^node_modules$' .gitignore 2>/dev/null || echo 'node_modules' >> .gitignore
grep -q '^\.env' .gitignore 2>/dev/null || echo '.env*' >> .gitignore

git add -A
git commit -m "Deploy Bharat HIE Portal (React + Vite)" || echo "(nothing new to commit)"

echo "==> GitHub auth check…"
gh auth status || { echo "Run: gh auth login"; exit 1; }
USER=$(gh api user -q .login)
REPO="$USER/bharat-hie-portal"
echo "Account: $USER"

if ! gh repo view "$REPO" >/dev/null 2>&1; then
  echo "==> Creating public repo $REPO…"
  gh repo create "$REPO" --public --source=. --remote=origin --push
else
  echo "==> Repo exists — pushing…"
  git remote remove origin 2>/dev/null || true
  git remote add origin "https://github.com/$REPO.git"
  git push -u origin main
fi

echo "==> Deploying dist → gh-pages…"
npx --yes gh-pages -d dist -m "Live deploy"

# Enable Pages if needed
gh api -X POST "repos/$REPO/pages" \
  -f build_type=legacy \
  -f source='{"branch":"gh-pages","path":"/"}' 2>/dev/null || true

LIVE="https://${USER}.github.io/bharat-hie-portal/"
echo ""
echo "============================================"
echo " LIVE URL:  $LIVE"
echo " REPO:      https://github.com/$REPO"
echo "============================================"
echo "Open the LIVE URL in ~1 minute (Pages can take a moment)."
