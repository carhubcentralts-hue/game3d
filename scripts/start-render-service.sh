#!/bin/bash
# Start the render service
echo "🎬 Starting render service on port ${RENDER_PORT:-4010}..."
npm run build --workspace=apps/render-service
npm run start --workspace=apps/render-service
