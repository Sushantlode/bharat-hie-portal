#!/bin/bash
cd "$(dirname "$0")"
echo "Starting Cloudflare tunnel → http://127.0.0.1:5180"
echo "Keep this window open. Public URL will appear below."
echo ""
cloudflared tunnel --url http://127.0.0.1:5180
