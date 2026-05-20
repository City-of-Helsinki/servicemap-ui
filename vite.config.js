import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { cjsInterop } from 'vite-plugin-cjs-interop';

import { name } from './package.json';
import { getGitCommit, getGitTag } from './scripts/utils';

export default defineConfig(({ ssrBuild }) => ({
  envPrefix: 'REACT_APP_',
  plugins: [
    react({
      include: '**/*.{jsx,tsx,js,ts}',
      babel: {
        plugins: [
          [ '@babel/plugin-transform-react-jsx', { runtime: 'automatic' } ],
        ],
      },
    }),
    // Fix CJS/ESM interop for packages that use lazy-getter or module.exports patterns
    // that don't survive Vite's SSR externalization (named ESM imports would fail at runtime).
    cjsInterop({
      dependencies: [
        'react-helmet-async',
        'redux-thunk',
        '@mui/styled-engine',
      ],
    }),
    ...(!ssrBuild
      ? [
        sentryVitePlugin({
          telemetry: false,
          applicationKey: name,
          sourcemaps: {
            disable: true,
          },
          release: {
            create: false,
          },
        }),
      ]
      : []),
  ],
  define: {
    'import.meta.env.REACT_APP_GIT_TAG': JSON.stringify(getGitTag()),
    'import.meta.env.REACT_APP_GIT_COMMIT': JSON.stringify(getGitCommit()),
  },
  build: {
    sourcemap: true,
  },
  resolve: {
    // @mui/icons-material's ESM entry uses a bare directory import for @mui/material/utils
    // that Node.js strict ESM cannot resolve. Map it explicitly to the index file.
    alias: {
      '@mui/material/utils': '@mui/material/utils/index.js',
    },
  },
  // @mui/icons-material and @mui/material (+ its deps) use directory-style imports in their
  // ESM entries that Node.js strict ESM cannot resolve at runtime. Bundle them through Vite
  // so the resolve aliases above apply and all sub-path imports are resolved at build time.
  ssr: {
    noExternal: [ '@mui/icons-material', '@mui/material', '@mui/system', '@mui/utils' ],
  },
  optimizeDeps: {
    include: [ 'leaflet', 'react-leaflet' ],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  assetsInclude: [
    '**/*.woff',
    '**/*.woff2',
    '**/*.ttf',
    '**/*.eot',
    '**/*.ico',
  ],
}));
