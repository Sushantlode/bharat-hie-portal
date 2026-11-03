#!/bin/bash
cd "/Users/apple/sushant/HIE /bharat-hie-portal" || exit 1
echo "Deploying Bharat HIE Portal to GitHub Pages..."
chmod +x ./DEPLOY-LIVE.sh
./DEPLOY-LIVE.sh
echo ""
echo "Press Enter to close..."
read
