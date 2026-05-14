#!/bin/bash
# Double-click this file to preview the static site locally.
# It serves the folder over http://localhost:8080 — exactly like a real web host.
# Press Ctrl+C in the Terminal window to stop.

cd "$(dirname "$0")"
URL="http://localhost:8080/"
echo ""
echo "=========================================================="
echo "  RGU static site — local preview"
echo "  Opening:  $URL"
echo "  Press Ctrl+C to stop the server."
echo "=========================================================="
echo ""

# Open the browser after a short delay
( sleep 1 && open "$URL" ) &

# Serve. Python 3 ships with macOS by default.
python3 -m http.server 8080
