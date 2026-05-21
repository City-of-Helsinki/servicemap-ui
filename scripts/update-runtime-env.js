#!/usr/bin/env ts-node-script
import dotenv from 'dotenv';
import fs from 'fs';
import * as path from 'path';

const USE_TEST_ENV = process.env.NODE_ENV === 'test';
const defaultNodeEnv = USE_TEST_ENV ? 'test' : 'development';

/* @ts-ignore */
import.meta.env = {};

import.meta.env.NODE_ENV = process.env.NODE_ENV || defaultNodeEnv;

dotenv.config({
  processEnv: import.meta.env,
  path: ['.env', '.env.local'],
  override: true,
});

// Prevent collision if app is running while tests are started
const configFile = USE_TEST_ENV ? 'test-env-config.js' : 'env-config.js';

// Always write to public/ — the build step copies this to dist/.
const configurationFile = path.join(__dirname, '../public/' + configFile);

const start = async () => {
  try {
    // Only expose client-safe keys — filter out server-only vars (PORT, SSR_FETCH_TIMEOUT, CSP_*, DOMAIN, etc.)
    const allEnv = import.meta.env;
    const envVariables = Object.fromEntries(
      Object.entries(allEnv).filter(([ key ]) => key.startsWith('REACT_APP_') || key === 'NODE_ENV' || key === 'MODE')
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
