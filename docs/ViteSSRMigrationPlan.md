# Vite SSR Migration Plan

## Executive Summary

This document outlines a migration plan to modernize the servicemap-ui SSR setup by leveraging Vite's native SSR capabilities. The current implementation uses a custom-built SSR pipeline with separate client/server Vite builds, a monolithic Express server, and manual HTML template assembly. The proposed approach follows Vite's official SSR pattern: a single Express server that uses Vite in middleware mode during development and serves pre-built assets in production.

---

## 1. Current Architecture Analysis

### How It Works Today

The application uses a **dual-build** approach orchestrated by Vite:

```
┌─────────────────────────────────────────────────────────┐
│ Build Phase                                              │
│                                                          │
│  vite build (client)        vite build --ssr (server)    │
│  ─────────────────         ──────────────────────────    │
│  Input: client/client.js    Input: server/server.js      │
│  Output: dist/src/index.js  Output: dist/index.js        │
│  Format: IIFE               Format: CJS                  │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Runtime (node dist)                                      │
│                                                          │
│  Express server (dist/index.js) ──┐                      │
│    ├─ Static files (dist/src/)    │                      │
│    ├─ Middlewares (redirects,     │                      │
│    │   data fetching, sitemap)    │                      │
│    └─ SSR handler:                │                      │
│         1. Create Redux store     │                      │
│         2. Fetch data into store  │                      │
│         3. renderToString(<App/>) │                      │
│         4. Extract Emotion CSS    │                      │
│         5. Extract MUI JSS CSS    │                      │
│         6. Build HTML string      │                      │
│         7. Inject preloaded state │                      │
│         8. Send response          │                      │
│                                                          │
│  Client hydration (dist/src/index.js)                    │
│    ├─ Read window.PRELOADED_STATE                        │
│    ├─ Create Redux store                                 │
│    ├─ hydrateRoot(<App/>)                                │
│    └─ Remove server-injected styles                      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Key Files

| File | Purpose |
|------|---------|
| `server/server.js` | Express server, SSR rendering, HTML template, CSP headers |
| `client/client.js` | Client-side hydration entry point |
| `server/dataFetcher.js` | Server-side data pre-fetching (units, events) |
| `server/utils.js` | Language redirects, URL helpers, map position parsing |
| `server/sitemapMiddlewares.js` | Sitemap generation |
| `server/createEmotionCache.js` | Shared Emotion cache factory |
| `vite.config.js` | Dual-mode config (client/server builds) |
| `config/default.js` | Isomorphic config with env-var defaults |

### Problems with Current Approach

1. **No HMR in development** — The dev workflow (`pnpm dev`) runs two parallel `vite build --watch` processes + `nodemon`, requiring full rebuilds on every change. No hot module replacement.

2. **CJS output format for server** — The server bundle is built as CommonJS despite Vite being ESM-native. This adds complexity and limits tree-shaking.

3. **IIFE client bundle** — Using IIFE format instead of ESM means no code-splitting, no dynamic imports, no tree-shaking on the client. The entire app ships as one large file.

4. **Monolithic server bundle** — Setting `ssr.noExternal: true` bundles *everything* into the server output (except react/react-dom). This creates a very large server bundle and slow cold starts.

5. **Manual CSS extraction** — The server manually collects Emotion CSS, MUI ServerStyleSheets (JSS), and isomorphic-style-loader CSS. This is error-prone and adds latency.

6. **Duplicated rendering logic** — Client and server have separate, manually-maintained rendering trees that must stay in sync.

7. **Legacy dependencies** — `isomorphic-style-loader`, `@mui/styles` (JSS, deprecated), `intl` polyfill, `core-js/regenerator-runtime` (unnecessary on Node 22).

8. **No asset manifest / preload hints** — Client assets have no `<link rel="modulepreload">` directives; the browser must discover resources sequentially.

9. **Environment variable injection** — All `REACT_APP_*` vars are serialized into the HTML at runtime. This works but is verbose and CSP-unfriendly.

---

## 2. Target Architecture (Vite Native SSR)

Following the [official Vite SSR guide](https://vite.dev/guide/ssr) and the [template-ssr-react](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-react) reference:

```
┌─────────────────────────────────────────────────────────┐
│ Development (node server.js)                             │
│                                                          │
│  Express + Vite Dev Server (middleware mode)             │
│    ├─ vite.middlewares (HMR, asset transforms)           │
│    ├─ Custom middlewares (redirects, sitemap, etc.)      │
│    └─ SSR handler:                                       │
│         1. Read index.html from disk                     │
│         2. vite.transformIndexHtml() — inject HMR        │
│         3. vite.ssrLoadModule('/src/entry-server.jsx')   │
│         4. render(url, store) → { html, head, css }      │
│         5. Replace placeholders in template              │
│         6. Send response                                 │
│                                                          │
│  ✓ Full HMR for React components                         │
│  ✓ No build step during development                      │
│  ✓ Instant server-side code reloading                    │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Production Build                                         │
│                                                          │
│  vite build --outDir dist/client --ssrManifest           │
│    → ESM chunks with hashed filenames                    │
│    → .vite/ssr-manifest.json for preload directives      │
│                                                          │
│  vite build --ssr src/entry-server.jsx --outDir dist/server│
│    → ESM server entry (externalized node_modules)        │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Production Runtime (node server.js)                       │
│                                                          │
│  Express server                                          │
│    ├─ compression                                        │
│    ├─ Static serving (dist/client/)                      │
│    ├─ Custom middlewares                                 │
│    └─ SSR handler:                                       │
│         1. Read dist/client/index.html (cached)          │
│         2. import('./dist/server/entry-server.js')       │
│         3. render(url, store) → { html, head, css }      │
│         4. Inject preload directives from ssr-manifest   │
│         5. Replace placeholders in template              │
│         6. Send response                                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### New File Structure

```
servicemap-ui/
├── index.html                    # Template with <!--app-head--> and <!--app-html-->
├── server.js                     # Unified Express server (dev + prod)
├── src/
│   ├── entry-client.jsx          # Client hydration (replaces client/client.js)
│   ├── entry-server.jsx          # Server render function (new)
│   ├── App.js                    # Unchanged
│   └── ...
├── server/                       # Server-only utilities (kept)
│   ├── middlewares.js            # Consolidated middleware (redirects, sitemap, etc.)
│   ├── dataFetcher.js            # Data pre-fetching (kept, refactored)
│   └── csp.js                    # CSP header generation (extracted)
├── vite.config.js                # Simplified — single config
└── dist/
    ├── client/                   # Production client assets
    │   ├── .vite/ssr-manifest.json
    │   └── assets/
    └── server/
        └── entry-server.js       # Production server entry
```

---

## 3. Migration Steps

### Phase 1: Preparation (Non-Breaking)

**Goal**: Prepare the codebase for migration without changing runtime behavior.

1. **Remove `isomorphic-style-loader` usage**
   - Audit components using `withStyles` / `insertCss` pattern
   - Migrate remaining CSS to Emotion or CSS modules (both natively supported by Vite)
   - Remove `StyleContext.Provider` from both client and server

2. **Remove `@mui/styles` (JSS)**
   - The `ServerStyleSheets` / `makeStyles` pattern is deprecated
   - Migrate remaining JSS usages to `@mui/material`'s `sx` prop or `styled()` (Emotion-based)
   - This eliminates the need for `sheets.collect()` and `sheets.toString()` on the server

3. **Remove legacy polyfills**
   - Remove `core-js/stable`, `regenerator-runtime`, `whatwg-fetch` imports from client entry
   - Remove `intl` polyfill from server (Node 22 has full Intl support)
   - Remove `node-fetch` (Node 22 has native `fetch`)

4. **Audit `REACT_APP_*` environment variable usage**
   - Keep the `REACT_APP_` prefix — configure Vite to expose it via `envPrefix: 'REACT_APP_'` (already set in `vite.config.js`)
   - Build-time vars are accessed via `import.meta.env.REACT_APP_*` on the client
   - Runtime vars keep the server-injected `window.nodeEnvSettings` approach, which remains unchanged

### Phase 2: Create Entry Points

**Goal**: Create the new `entry-client.jsx` and `entry-server.jsx` files following Vite SSR conventions.

1. **Create `src/entry-server.jsx`**
   ```jsx
   import { renderToString } from 'react-dom/server';
   import { StaticRouter } from 'react-router-dom/server';
   import { Provider } from 'react-redux';
   import { HelmetProvider } from 'react-helmet-async';
   import { CacheProvider } from '@emotion/react';
   import createEmotionServer from '@emotion/server/create-instance';
   import createEmotionCache from './createEmotionCache';
   import App from './App';

   export async function render(url, { store, nonce }) {
     const cache = createEmotionCache(nonce);
     const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);
     const helmetContext = {};

     const html = renderToString(
       <HelmetProvider context={helmetContext}>
         <CacheProvider value={cache}>
           <Provider store={store}>
             <StaticRouter location={url}>
               <App />
             </StaticRouter>
           </Provider>
         </CacheProvider>
       </HelmetProvider>
     );

     const emotionChunks = extractCriticalToChunks(html);
     const emotionCss = constructStyleTagsFromChunks(emotionChunks);
     const { helmet } = helmetContext;

     return { html, head: helmet, emotionCss, state: store.getState() };
   }
   ```

2. **Create `src/entry-client.jsx`** (refactored from `client/client.js`)
   ```jsx
   import { hydrateRoot } from 'react-dom/client';
   import { BrowserRouter } from 'react-router-dom';
   import { Provider } from 'react-redux';
   import { HelmetProvider } from 'react-helmet-async';
   import { CacheProvider } from '@emotion/react';
   import createEmotionCache from './createEmotionCache';
   import App from './App';
   import { createAppStore } from './store';

   const preloadedState = window.__PRELOADED_STATE__;
   delete window.__PRELOADED_STATE__;

   const store = createAppStore(preloadedState);
   const cache = createEmotionCache();

   hydrateRoot(
     document.getElementById('app'),
     <HelmetProvider>
       <CacheProvider value={cache}>
         <Provider store={store}>
           <App />
         </Provider>
       </CacheProvider>
     </HelmetProvider>
   );
   ```

3. **Update `index.html`**
   ```html
   <!DOCTYPE html>
   <html lang="fi">
     <head>
       <meta charset="utf-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <!--app-head-->
     </head>
     <body>
       <div id="app"><!--app-html--></div>
       <script type="module" src="/src/entry-client.jsx"></script>
     </body>
   </html>
   ```

### Phase 3: Unified Server

**Goal**: Create a single `server.js` that works in both dev and production modes.

1. **Create root-level `server.js`**
   - In development: create Vite dev server in middleware mode, use `ssrLoadModule`
   - In production: serve static files from `dist/client/`, import `dist/server/entry-server.js`
   - Keep all existing Express middlewares (redirects, data fetching, sitemap, health checks)

2. **Key differences from current `server/server.js`**:
   - No more manual HTML template string — use `index.html` with placeholder replacement
   - Vite handles CSS injection in dev (no manual Emotion/JSS extraction needed during dev)
   - Production still needs Emotion extraction (via entry-server.jsx render function)
   - Use `vite.ssrFixStacktrace(e)` for better dev error messages

3. **Preserve existing functionality**:
   - Data pre-fetching middleware (`fetchEventData`, `fetchSelectedUnitData`)
   - Language/subdomain redirects
   - Sitemap generation (scheduled)
   - CSP header generation
   - Sentry integration (server-side)
   - Readiness endpoint
   - `window.nodeEnvSettings` injection for runtime env vars

### Phase 4: Simplify Vite Config

**Goal**: Replace the complex dual-mode `vite.config.js` with a clean, single configuration.

```js
// vite.config.js
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({ /* ... */ }),
  ],
  build: {
    sourcemap: true,
  },
  ssr: {
    // Let Vite handle externalization automatically
    // (node_modules are externalized by default for SSR)
  },
});
```

- Remove `BUILD_TARGET` environment variable switching
- Remove IIFE format / manual rollup input/output config
- Remove `vite-plugin-commonjs` (no more CJS in source)
- Remove `vite-plugin-node-polyfills` (no polyfills needed)
- Remove `esbuild.jsxInject` (handled by `@vitejs/plugin-react`)

### Phase 5: Update Build Scripts

```json
{
  "scripts": {
    "dev": "node server.js",
    "build": "pnpm build:client && pnpm build:server",
    "build:client": "vite build --outDir dist/client --ssrManifest",
    "build:server": "vite build --ssr src/entry-server.jsx --outDir dist/server",
    "start": "NODE_ENV=production node server.js",
    "preview": "NODE_ENV=production node server.js"
  }
}
```

### Phase 6: Update Dockerfile

```dockerfile
# ============================================================
# STAGE 1: Install dependencies
# ============================================================
FROM helsinki.azurecr.io/ubi9/nodejs-22-pnpm-builder-base AS appbase

COPY --chown=default:root package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=default:root ./public ./public
COPY --chown=default:root ./scripts ./scripts
COPY --chown=default:root ./server ./server
COPY --chown=default:root ./config ./config
COPY --chown=default:root index.html vite.config.js .eslintrc.json .env ./
COPY --chown=default:root ./src ./src

RUN pnpm install --frozen-lockfile --ignore-scripts && pnpm store prune

# ============================================================
# STAGE 2: Build
# ============================================================
FROM appbase AS builder

ARG REACT_APP_SENTRY_RELEASE
ARG NODE_OPTIONS=--max-old-space-size=4096
ENV NODE_OPTIONS=$NODE_OPTIONS

RUN pnpm build

# ============================================================
# STAGE 3: Production Runtime
# ============================================================
FROM registry.access.redhat.com/ubi9/nodejs-22-minimal AS production

WORKDIR /app

# Copy built assets and the unified server entry point
COPY --from=builder --chown=default:root /app/dist ./dist
COPY --from=builder --chown=default:root /app/server.js ./server.js
COPY --from=builder --chown=default:root /app/server ./server
COPY --from=builder --chown=default:root /app/package.json ./package.json

# Copy node_modules for externalized runtime dependencies
COPY --from=appbase --chown=default:root /app/node_modules ./node_modules

ARG REACT_APP_SENTRY_RELEASE
ENV NODE_ENV=production

USER 1001

EXPOSE 3000

CMD ["node", "server.js"]
```

Key changes from the current Dockerfile:
- Stage 1 (`appbase`) is unchanged — keeps `nodejs-22-pnpm-builder-base` with corepack/pnpm
- Stage 2 (`builder`) no longer copies `client/` (replaced by `src/entry-client.jsx` already in `src/`)
- Stage 3 (`production`) copies the new root-level `server.js` and `server/` utilities instead of `dist/index.js`; no longer needs `dist/src/` to be served separately (client assets live under `dist/client/`)

### Phase 7: Cleanup

1. Remove `client/` directory (replaced by `src/entry-client.jsx`)
2. Remove old `server/server.js` (replaced by root `server.js` + `server/` utilities)
3. Remove `.babelrc` if no longer needed (Vite uses esbuild/SWC)
4. Remove unused dependencies:
   - `isomorphic-style-loader`
   - `core-js`
   - `regenerator-runtime`
   - `whatwg-fetch`
   - `intl`
   - `node-fetch`
   - `vite-plugin-commonjs`
   - `vite-plugin-node-polyfills`
   - `nodemon`
5. Add dependencies if not present:
   - `sirv` (production static file serving, lightweight alternative to `express.static`)

---

## 4. Benefits

| Aspect | Before | After |
|--------|--------|-------|
| Dev startup | ~10s (build + nodemon) | ~1s (Vite dev server) |
| HMR | ❌ Full rebuild | ✅ Instant component updates |
| Client bundle | 1 large IIFE | Code-split ESM chunks |
| Server bundle | Everything bundled (CJS) | ESM with externalized deps |
| CSS handling | 3 manual systems | Vite handles automatically |
| Preload hints | None | `<link rel="modulepreload">` from manifest |
| Cold start | Slow (large CJS bundle) | Fast (small ESM entry + externals) |
| DX error messages | Generic | Source-mapped via `ssrFixStacktrace` |

---

## 5. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Leaflet (browser-only) breaks SSR | Use dynamic imports with `import.meta.env.SSR` guards; already partially handled |
| `react-router` StaticRouter vs BrowserRouter mismatch | entry-server uses StaticRouter, entry-client uses BrowserRouter — same as current |
| Emotion SSR extraction changes | Keep `@emotion/server` approach in entry-server; well-documented pattern |
| Runtime env vars must still work | Keep `window.nodeEnvSettings` injection in server HTML template |
| Existing e2e tests may break | Run playwright suite after each phase; SSR output should be equivalent |
| Redux store pre-fetching timing | Keep middleware-based data fetching; pass store to render function |

---

## 6. Migration Order & Dependencies

```
Phase 1 (Preparation)
  ├── Remove isomorphic-style-loader
  ├── Remove @mui/styles (JSS)
  └── Remove legacy polyfills
         │
Phase 2 (Entry Points)
  ├── Create src/entry-server.jsx
  ├── Create src/entry-client.jsx
  └── Update index.html
         │
Phase 3 (Unified Server)
  └── Create root server.js
         │
Phase 4 (Vite Config)
  └── Simplify vite.config.js
         │
Phase 5 (Build Scripts)
  └── Update package.json scripts
         │
Phase 6 (Dockerfile)
  └── Update container build
         │
Phase 7 (Cleanup)
  └── Remove old files & unused deps
```

Phases 1's sub-tasks can be done incrementally as separate PRs. Phases 2–5 should ideally land together in one PR as they're interdependent. Phase 6 can be a follow-up. Phase 7 is cleanup that can happen anytime after Phase 5 is verified.

---

## 7. Estimated Effort

| Phase | Effort | Notes |
|-------|--------|-------|
| Phase 1 | 3–5 days | Depends on how much JSS / isomorphic-style-loader exists |
| Phase 2 | 1 day | Mostly restructuring existing code |
| Phase 3 | 2–3 days | Most complex — must preserve all middleware behavior |
| Phase 4 | 0.5 day | Simplification |
| Phase 5 | 0.5 day | Script updates + CI verification |
| Phase 6 | 0.5 day | Docker build verification |
| Phase 7 | 0.5 day | Cleanup |
| **Total** | **~8–11 days** | |

---

## 8. References

- [Vite SSR Guide](https://vite.dev/guide/ssr)
- [template-ssr-react (official example)](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-react)
- [Vite Middleware Mode API](https://vite.dev/guide/api-javascript#vitedevserver)
- [Emotion SSR docs](https://emotion.sh/docs/ssr)
- [React Router StaticRouter](https://reactrouter.com/en/main/router-components/static-router)
