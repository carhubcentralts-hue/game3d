#!/bin/bash
# Start all services for development
echo "🚀 Starting all ProSaaS Tools services..."
echo ""

# Start render service in background
echo "🎬 Starting render service..."
npm run build --workspace=apps/render-service
npm run start --workspace=apps/render-service &
RENDER_PID=$!
echo "   Render service PID: $RENDER_PID"

# Wait a moment for render service
sleep 2

# Start web app
echo "🌐 Starting web app..."
npm run dev --workspace=apps/web &
WEB_PID=$!
echo "   Web app PID: $WEB_PID"

echo ""
echo "✅ All services running:"
echo "   Web:    http://localhost:3050"
echo "   Render: http://localhost:${RENDER_PORT:-4010}"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait and cleanup
trap "kill $RENDER_PID $WEB_PID 2>/dev/null; echo ''; echo '👋 All services stopped.'" EXIT
wait
