#!/bin/bash

# Get the local IP address
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

echo "🚀 Starting Savour East development server..."
echo ""
echo "Access your app at:"
echo "  → http://$IP:5173"
echo "  → http://127.0.0.1:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the dev server
npm run dev