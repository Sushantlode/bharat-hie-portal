tell application "Terminal"
  activate
  do script "cd '/Users/apple/sushant/HIE /bharat-hie-portal'; echo ''; echo '=== CLOUDFLARE TUNNEL ==='; echo 'Keep this window open.'; echo ''; cloudflared tunnel --url http://127.0.0.1:5180"
end tell
