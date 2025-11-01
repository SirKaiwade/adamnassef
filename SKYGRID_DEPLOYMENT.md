# SkyGrid Deployment Guide

SkyGrid is configured to be served at `/skygrid` on your main website (adamnassef.com/skygrid).

## Setup Complete ✅

1. **SkyGrid Vite config** - Updated with `base: '/skygrid/'` so all assets load correctly
2. **Main website** - Added SkyGrid project card in the Projects section
3. **Deployment script** - Created `deploy-skygrid.sh` to automate the process

## How to Deploy

### Option 1: Build Everything Together (Recommended)
```bash
npm run build:all
```
This builds both your main site and SkyGrid, then copies SkyGrid to the right location.

### Option 2: Build Separately
```bash
# Build main site
npm run build

# Build and copy SkyGrid
npm run build:skygrid
```

### Option 3: Manual Script
```bash
./deploy-skygrid.sh
```

## How It Works

1. SkyGrid builds to `../SkyGrid/dist/` with base path `/skygrid/`
2. The deployment script copies the build output to `dist/skygrid/` in your main site
3. When deployed, SkyGrid will be accessible at `adamnassef.com/skygrid`

## For Development

- **Main site dev**: `npm run dev` (runs on port 5173)
- **SkyGrid dev**: `cd ../SkyGrid && npm run dev` (runs on port 5174, but configured for `/skygrid/` base path)

Note: For local development, you may want to temporarily change SkyGrid's `base` in `vite.config.ts` to `/` for easier testing, then change it back before building for production.

## Deployment Checklist

- [ ] Build main website: `npm run build`
- [ ] Build SkyGrid: `npm run build:skygrid`
- [ ] Verify `dist/skygrid/` contains SkyGrid files
- [ ] Deploy `dist/` folder to your hosting provider
- [ ] Visit `adamnassef.com/skygrid` to verify it works

