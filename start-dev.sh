#!/bin/bash
# RGU Website - Dev Server Startup Script

echo "🚀 Starting RGU Website Dev Server..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies (first run)..."
  npm install
  echo ""
fi

echo "✅ Starting Next.js dev server at http://localhost:3000"
echo "   Press Ctrl+C to stop"
echo ""
npm run dev
