import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import viteCommonjs from 'vite-plugin-commonjs';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

import { name } from './package.json';
import { getGitCommit, getGitTag } from './scripts/utils';

export default defineConfig(({ command, mode, ssrBuild }) => {
  const isSsrBuild =
    ssrBuild || (command === 'build' && process.env.BUILD_TARGET === 'server');
  const isDev = command === 'serve';

  return {
    root: isDev ? '.' : undefined,
    publicDir: isDev ? 'public' : false,
    envPrefix: 'REACT_APP_',
    esbuild: {
      jsxInject: `import React from 'react'`,
      define: {
        global: 'globalThis',
      },
    },
    resolve: {
      alias: {
        'http-status-typed': resolve(
          __dirname,
          'node_modules/http-status-typed/dist/index.min.js'
        ),
      },
    },
    plugins: [
      react({
        include: '**/*.{jsx,tsx,js,ts}',
        babel: {
          plugins: [
            ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
          ],
        },
      }),
      ...(isSsrBuild
        ? []
        : [
            viteCommonjs(),
            sentryVitePlugin({
              telemetry: false,
              applicationKey: name,
              sourcemaps: {
                disable: true,
              },
              release: {
                create: false,
              }
            }),
          ]),
      // Node.js polyfills for browser environment (only in development)
      ...(isDev
        ? [
            nodePolyfills({
              include: ['process', 'buffer', 'util', 'path'],
              exclude: ['fs'],
              globals: {
                Buffer: true,
                global: true,
                process: true,
              },
            }),
          ]
        : []),
    ],
    define: {
      'import.meta.env.REACT_APP_GIT_TAG': JSON.stringify(getGitTag()),
      'import.meta.env.REACT_APP_GIT_COMMIT': JSON.stringify(getGitCommit()),
      // Keep global defines for backward compatibility
      GIT_TAG: JSON.stringify(getGitTag()),
      GIT_COMMIT: JSON.stringify(getGitCommit()),
    },

    build: isSsrBuild
      ? {
          ssr: true,
          minify: 'esbuild',
          rollupOptions: {
            input: resolve(__dirname, 'server/server.js'),
            output: {
              dir: 'dist',
              entryFileNames: 'index.js',
              format: 'cjs',
            },
            // Keep external minimal - only truly external dependencies
            external: [
              /^node:/,
              'react',
              'react-dom',
              'react-dom/server',
              'react/jsx-runtime',
            ],
          },
          outDir: 'dist',
          emptyOutDir: false, // Handle directory clearing at script level for better control
        }
      : {
          rollupOptions: {
            input: resolve(__dirname, 'client/client.js'),
            output: {
              dir: 'dist/src',
              entryFileNames: 'index.js',
              format: 'iife',
              name: 'ServiceMapApp',
              sourcemapDebugIds: true,
            },
            external: ['http-status-typed'],
          },
          outDir: 'dist/src',
          emptyOutDir: false, // Handle directory clearing at script level for better control
          sourcemap: true,
        },
    server: {
      port: 5173,
      middlewareMode: true,
    },
    ssr: {
      noExternal: true, // Bundle everything except what's in rollupOptions.external
    },
    optimizeDeps: {
      include: ['leaflet', 'react-leaflet'],
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
  };
});
