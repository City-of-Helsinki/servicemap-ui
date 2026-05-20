#!/usr/bin/env node
import dotenv from 'dotenv';
import fs from 'fs';
import * as path from 'path';

const USE_TEST_ENV = process.env.NODE_ENV === 'test';
const defaultNodeEnv = USE_TEST_ENV ? 'test' : 'development';

// Load .env as defaults — process.env (e.g. Azure ConfigMap) always wins because
// override is not set. At container startup the production stage also has .env,
// so variables absent from the ConfigMap fall back to their committed defaults.
dotenv.config({
  path: ['.env', '.env.local'],
});

process.env.NODE_ENV = process.env.NODE_ENV || defaultNodeEnv;

// Prevent collision if app is running while tests are started
const configFile = USE_TEST_ENV ? 'test-env-config.js' : 'env-config.js';

// Tests require the file directly from public/ (see src/setupTests.js).
// All other contexts write to dist/ — created if it doesn't exist yet (e.g. before first build in dev).
const outputDir = path.resolve(process.cwd(), 'public');
fs.mkdirSync(outputDir, { recursive: true });

const configurationFile = path.join(outputDir, configFile);

const start = async () => {
  try {
    // Only expose client-safe keys — filter out server-only vars
    // (PORT, SSR_FETCH_TIMEOUT, CSP_*, DOMAIN, SENTRY_DSN_SERVER, etc.)
    const envVariables = Object.fromEntries(
      Object.entries(process.env).filter(([ key ]) => key.startsWith('REACT_APP_') || key === 'NODE_ENV' || key === 'MODE')
    );

    fs.writeFile(
      configurationFile,
      `window._env_ = ${JSON.stringify(envVariables, null, 2)};`,
      // eslint-disable-next-line consistent-return
      (err) => {
        if (err) {
          return console.error(err);
        }
        console.log('File created!');
      }
    );
  } catch (err) {
    console.error(err.message); // eslint-disable-line
    process.exit(1);
  }
};

start();
