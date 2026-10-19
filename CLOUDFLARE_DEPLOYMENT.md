# Cloudflare Workers Deployment Guide for SpendSensie (OpenNext)

This project is configured to run on **Cloudflare Workers** using the **OpenNext Cloudflare adapter** (`@opennextjs/cloudflare`).

---

## 1. Root Cause Analysis: `ENOENT: pages-manifest.json`

### Error:
```text
Error: ENOENT: no such file or directory, open '.next/standalone/.next/server/pages-manifest.json'
    at Module.getHtmlPages (@opennextjs/aws/dist/build/helper.js:193:25)
    at createCacheAssets (@opennextjs/aws/dist/build/createAssets.js:79:35)
    at build (@opennextjs/cloudflare/dist/cli/build/build.js:85:44)
```

### Why it happened:
1. **Conflicting `output: 'export'` in `next.config.js`**:
   - `opennextjs-cloudflare` internally injects `process.env.NEXT_PRIVATE_STANDALONE = "true"` so Next.js builds in standalone mode and emits `.next/standalone/`.
   - When `output: 'export'` was explicitly set in `next.config.js`, Next.js prioritized static export mode, generating an `out/` folder instead of `.next/standalone/`.
   - When OpenNext proceeded to bundle cache assets in `createCacheAssets()`, it tried to read `pages-manifest.json` from `.next/standalone/.next/server/pages-manifest.json`, which did not exist.
2. **Missing `open-next.config.ts`**:
   - The OpenNext Cloudflare adapter requires `open-next.config.ts` in the project root to define runtime overrides and configuration.
3. **Incompatible `wrangler.jsonc`**:
   - `wrangler.jsonc` was configured for static assets (`assets.directory: "./out"`) without worker entry points (`main: ".open-next/worker.js"`) and runtime compatibility flags (`nodejs_compat`).

---

## 2. Changes Implemented

1. **`Spensensie/next.config.js`**:
   - Removed `output: 'export'`. (OpenNext automatically handles standalone mode via build environment flags).
2. **`Spensensie/open-next.config.ts`**:
   - Created configuration using `defineCloudflareConfig()`.
3. **`Spensensie/wrangler.jsonc`**:
   - Configured Cloudflare Workers output:
     - `"main": ".open-next/worker.js"`
     - `"compatibility_flags": ["nodejs_compat"]`
     - `"assets": { "directory": ".open-next/assets", "binding": "ASSETS" }`
4. **`Spensensie/package.json`**:
   - Installed `@opennextjs/cloudflare` and `wrangler`.
   - Added Cloudflare deployment scripts:
     - `"build": "next build"`
     - `"build:worker": "opennextjs-cloudflare build"`
     - `"preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview"`
     - `"deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"`
5. **`.npmrc` & `.gitignore`**:
   - Added `.npmrc` with `legacy-peer-deps=true` to prevent peer dependency resolution errors during CI builds.
   - Added `.open-next/` and `.wrangler/` to `.gitignore`.

---

## 3. How to Build & Deploy

### Locally:
```bash
# In Spensensie directory:
npm run build:worker

# Preview locally with Miniflare / Wrangler:
npm run preview

# Deploy directly to Cloudflare:
npm run deploy
```

### Cloudflare Dashboard (Workers & Pages Git Integration):
- **Build command**: `npm run build:worker` (or `npx opennextjs-cloudflare build`)
- **Deploy command**: `npx opennextjs-cloudflare deploy`
- **Compatibility flags**: `nodejs_compat`
- **Compatibility date**: `2026-10-12` (or current)
