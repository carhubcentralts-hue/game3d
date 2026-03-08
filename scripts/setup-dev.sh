#!/bin/bash
# ProSaaS Tools — Development Setup
set -e

echo "🔧 ProSaaS Tools — Setting up development environment..."

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is required. Install from https://nodejs.org/"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18+ required. Current: $(node -v)"
  exit 1
fi

echo "✅ Node.js $(node -v)"

# Copy env if needed
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env from .env.example"
  echo "⚠️  Edit .env with your actual values"
else
  echo "✅ .env already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create storage directories
mkdir -p storage/projects storage/assets storage/renders storage/temp
echo "✅ Storage directories created"

# Build packages
echo "🔨 Building packages..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env with your configuration"
echo "  2. Run: npm run dev          (start web app)"
echo "  3. Run: npm run render-service (start render service)"
echo "  4. Open: http://localhost:3050"
echo "  5. Login with the default credentials (see .env)"
echo ""
