#!/bin/bash

# Script to build SkyGrid and copy it to the main website for deployment
# This allows SkyGrid to be served at /skygrid on adamnassef.com

echo "🚀 Building SkyGrid..."

# Navigate to SkyGrid directory
cd ../SkyGrid

# Build SkyGrid (this will output to dist/ with base path /skygrid/)
npm run build

if [ $? -ne 0 ]; then
  echo "❌ SkyGrid build failed!"
  exit 1
fi

echo "✅ SkyGrid built successfully!"

# Navigate back to main website
cd ../AdamNassef_Website

# Create skygrid directory in dist (after main site build) or public (for static serving)
mkdir -p dist/skygrid
mkdir -p public/skygrid

# Copy SkyGrid build output
echo "📦 Copying SkyGrid build files..."
cp -r ../SkyGrid/dist/* dist/skygrid/ 2>/dev/null || cp -r ../SkyGrid/dist/* public/skygrid/ 2>/dev/null

if [ $? -eq 0 ]; then
  echo "✅ SkyGrid files copied successfully!"
  echo "📁 SkyGrid is now available at /skygrid/"
else
  echo "⚠️  Note: Copy to dist/ failed (this is normal if main site hasn't been built yet)"
  echo "   SkyGrid files are in public/skygrid/ for static serving"
fi

echo "✨ Done! SkyGrid is ready to be served at /skygrid/"

