// Unified SSR server — dev uses Vite middleware mode, prod serves pre-built assets.
// Using .mjs extension for native ESM without requiring "type": "module" in package.json.
import 'dotenv/config';

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as Sentry from '@sentry/node';
import compression from 'compression';
import express from 'express';
import schedule from 'node-schedule';

import appConfig from './config/index.js';
import paths from './config/paths.js';
import { sharedIgnoreErrors } from './config/sentry.js';
import { getGitCommit, getGitTag } from './scripts/utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

const GIT_TAG = getGitTag();
const GIT_COMMIT = getGitCommit();

if (process.env.SENTRY_DSN_SERVER) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN_SERVER,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    release: process.env.SENTRY_RELEASE,
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0'),
    ignoreErrors: sharedIgnoreErrors,
    initialScope: {
      tags: { context: 'server', runtime: 'node' },
    },
  });
  console.log(`Initialized Sentry server with DSN ${process.env.SENTRY_DSN_SERVER}`);
}

const { supportedLanguages } = appConfig;

const generateCSPHeaders = (nonce) => {
  if (process.env.CSP_ENABLED !== 'true') {
    return {};
  }

  const headers = {};
  const csp = {};
  const reportUri = process.env.CSP_REPORT_URI;

  if (reportUri) {
    headers[ 'Reporting-Endpoints' ] = `csp-endpoint="${reportUri}"`;
    csp[ 'report-to' ] = 'csp-endpoint';
    csp[ 'report-uri' ] = reportUri;
  }

  csp[ 'base-uri' ] = `'self'`;
  csp[ 'connect-src' ] = `'self' ${process.env.CSP_CONNECT_SRC}`;
  csp[ 'default-src' ] = `'self'`;
  csp[ 'font-src' ] = `'self' https://fonts.gstatic.com`;
  csp[ 'form-action' ] = `'self'`;
  csp[ 'img-src' ] = `'self' data: https://www.hel.fi ${process.env.CSP_IMG_SRC}`;
  csp[ 'manifest-src' ] = `'self'`;
  csp[ 'script-src' ] = `'self' 'nonce-${nonce}' https://unpkg.com/leaflet@1.9.4/dist/leaflet.js ${process.env.CSP_SCRIPT_SRC}`;
  csp[ 'script-src-attr' ] = `'unsafe-hashes' 'sha256-7Hm4kDnuwRKq0GkRVBPz6YL9PvbRT9e9rAqI5RnLzBQ='`;
  csp[ 'style-src' ] = `'self' 'unsafe-inline' https://unpkg.com/leaflet@1.9.4/dist/leaflet.css https://fonts.googleapis.com`;

  headers[
    process.env.CSP_REPORT_ONLY === 'true'
      ? 'Content-Security-Policy-Report-Only'
      : 'Content-Security-Policy'
  ] = Object.entries(csp)
    .map(([ k, v ]) => `${k} ${v};`)
    .join(' ');

  return headers;
};

const injectHtml = ({
  template,
  html,
  helmet,
  emotionCss,
  preloadedState,
  locale,
  requestFullUrl,
  customValues,
  nonce,
}) => {
  const nodeEnvLines = [
    'window.nodeEnvSettings = {};',
    ...Object.keys(process.env)
      .filter((key) => key.startsWith('REACT_APP_'))
      .map((key) => {
        const value = process.env[ key ];
        if (value !== undefined && value !== null && value !== '' && value !== 'undefined') {
          return `window.nodeEnvSettings.${key} = ${JSON.stringify(value)};`;
        }
        return '';
      })
      .filter(Boolean),
    process.env.MODE !== undefined
      ? `window.nodeEnvSettings.MODE = ${JSON.stringify(process.env.MODE)};`
      : '',
    `window.nodeEnvSettings.REACT_APP_INITIAL_MAP_POSITION = ${JSON.stringify(customValues.initialMapPosition)};`,
    `window.nodeEnvSettings.appVersion = { tag: ${JSON.stringify(GIT_TAG)}, commit: ${JSON.stringify(GIT_COMMIT)} };`,
    `window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')};`,
  ]
    .filter(Boolean)
    .join('\n      ');

  const readSpeakerScript =
    process.env.REACT_APP_READ_SPEAKER_URL &&
      process.env.REACT_APP_READ_SPEAKER_URL !== 'false'
      ? `<script type="text/javascript">
          window.rsConf = { params: '${process.env.REACT_APP_READ_SPEAKER_URL}', general: {usePost:true} };
        </script>
        <script src="${process.env.REACT_APP_READ_SPEAKER_URL}" type="text/javascript"></script>`
      : '';

  const headContent = `
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    <meta property="og:url" data-react-helmet="true" content="${requestFullUrl}" />
    ${emotionCss}
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <style nonce="${nonce}">
      @import url('https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i');
    </style>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#141823" />
    ${readSpeakerScript}
    <script nonce="${nonce}">${nodeEnvLines}</script>`;

  return template
    .replace(/lang="[^"]*"/, `lang="${locale || 'fi'}"`)
    .replace('<!--app-head-->', headContent)
    .replace('<!--app-html-->', html);
};

const createServer = async () => {
  const app = express();
  app.disable('x-powered-by');
  app.use(compression());
  app.set('trust proxy', true);

  let vite;
  let prodEntry;

  if (isProd) {
    app.use(express.static(path.join(__dirname, 'dist/client'), { index: false }));
  } else {
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  }

  const getEntry = async () => {
    if (isProd) {
      if (!prodEntry) prodEntry = await import('./dist/server/server-entry.mjs');
      return prodEntry;
    }
    return vite.ssrLoadModule('./server/server-entry.js');
  };

  // Initialize sitemap at startup
  const { sitemapActive, generateSitemap } = await getEntry();
  if (sitemapActive()) {
    generateSitemap();
    schedule.scheduleJob({ hour: 8, minute: 0, dayOfWeek: 1 }, async () => {
      console.log('Updating sitemap...');
      const entry = await getEntry();
      entry.generateSitemap();
    });
  }

  // Attach a fresh Redux store to every request
  app.use('/*', async (req, res, next) => {
    try {
      const { createAppStore } = await getEntry();
      req._context = createAppStore();
      next();
    } catch (err) {
      next(err);
    }
  });

  app.use('/sitemap.xml', async (req, res, next) => {
    const { getSitemap } = await getEntry();
    getSitemap(req, res, next);
  });

  app.get('/robots.txt', async (req, res, next) => {
    const { getRobotsFile } = await getEntry();
    getRobotsFile(req, res, next);
  });

  app.get('/readiness', async (req, res, next) => {
    const { getReadiness } = await getEntry();
    getReadiness(req, res, next);
  });

  app.use('/', async (req, res, next) => {
    const { languageSubdomainRedirect } = await getEntry();
    languageSubdomainRedirect(req, res, next);
  });

  app.use('/', async (req, res, next) => {
    const { makeLanguageHandler } = await getEntry();
    makeLanguageHandler(req, res, next);
  });

  app.use('/', async (req, res, next) => {
    const { unitRedirect } = await getEntry();
    unitRedirect(req, res, next);
  });

  // Treenode → service_node redirect
  app.use('/', (req, res, next) => {
    if (req.query.treenode != null && process.env.DOMAIN?.includes(req.get('host'))) {
      res.redirect(301, req.originalUrl.replace(/treenode/g, 'service_node'));
      return;
    }
    next();
  });

  app.use(paths.event.regex, async (req, res, next) => {
    const { fetchEventData } = await getEntry();
    fetchEventData(req, res, next);
  });

  app.use(paths.unit.regex, async (req, res, next) => {
    const { fetchSelectedUnitData } = await getEntry();
    fetchSelectedUnitData(req, res, next);
  });

  // SSR render
  app.get('/*', async (req, res, next) => {
    try {
      const nonce = crypto.randomBytes(16).toString('base64');
      const cspHeaders = generateCSPHeaders(nonce);

      const entry = await getEntry();
      const { render, getRequestFullUrl, parseInitialMapPositionFromHostname } = entry;

      let template = fs.readFileSync(
        isProd
          ? path.join(__dirname, 'dist/client/index.html')
          : path.join(__dirname, 'index.html'),
        'utf-8'
      );
      if (!isProd) {
        template = await vite.transformIndexHtml(req.originalUrl, template);
      }

      const localeParam = req.params[ 0 ]?.slice(0, 2) ?? '';
      const locale = supportedLanguages.includes(localeParam) ? localeParam : 'fi';

      const store = req._context;
      const customValues = {
        initialMapPosition: parseInitialMapPositionFromHostname(req, Sentry),
      };

      const { html, helmet, emotionCss } = await render(req.url, { store, nonce, locale });
      const preloadedState = store.getState();

      const fullHtml = injectHtml({
        template,
        html,
        helmet,
        emotionCss,
        preloadedState,
        locale,
        requestFullUrl: getRequestFullUrl(req),
        customValues,
        nonce,
      });

      res.writeHead(200, { 'Content-Type': 'text/html', ...cspHeaders });
      res.end(fullHtml);
    } catch (err) {
      if (!isProd) vite?.ssrFixStacktrace(err);
      next(err);
    }
  });

  if (process.env.SENTRY_DSN_SERVER) {
    Sentry.setupExpressErrorHandler(app);
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log('Application version tag:', GIT_TAG, 'commit:', GIT_COMMIT);
    console.log(`Server listening on port ${port}`);
  });
};

createServer();
