#!/bin/bash
set -e
cd "$(dirname "$0")"
echo "Checking Vite on 5180..."
if ! curl -sf -o /dev/null http://127.0.0.1:5180/; then
  echo "ERROR: Vite is not running. In another terminal run: npm run dev"
  exit 1
fi
echo "Vite OK. Starting Cloudflare tunnel..."
echo "Copy the https://….trycloudflare.com URL from the box below."
echo ""
exec cloudflared tunnel --url http://127.0.0.1:5180
