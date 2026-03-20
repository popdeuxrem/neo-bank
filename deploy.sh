#!/bin/bash
# Neo-Bank Deployment Script for Laravel Cloud
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment..."

# 1. Clean previous build
echo "📦 Cleaning previous build..."
rm -rf public/build

# 2. Install dependencies
echo "📥 Installing npm dependencies..."
npm install --legacy-peer-deps --no-audit --no-fund

# 3. Build Vite assets
echo "⚡ Building Vite assets..."
npm run build

# 4. Verify build
echo "✅ Verifying build..."
if [ ! -f "public/build/manifest.json" ]; then
    echo "❌ Build failed - manifest.json not found"
    exit 1
fi

# 5. Check storage symlink
echo "🔗 Checking storage symlink..."
if [ ! -L "public/storage" ]; then
    echo "Creating storage symlink..."
    rm -rf public/storage
    ln -sf storage/app/public public/storage
fi

# 6. Summary
echo ""
echo "✅ Deployment ready!"
echo ""
echo "Next steps:"
echo "1. Push to git: git add . && git commit -m 'Build' && git push"
echo "2. Deploy on Laravel Cloud dashboard"
echo "3. Run migrations on Cloud if needed"
echo ""
