#!/usr/bin/env bash
# Public URL via Cloudflare quick tunnel (run in your own Terminal app)
set -euo pipefail
PORT="${1:-5180}"
echo "Tunneling http://127.0.0.1:${PORT} …"
echo "Keep npm run dev running on that port."
exec cloudflared tunnel --url "http://127.0.0.1:${PORT}"
