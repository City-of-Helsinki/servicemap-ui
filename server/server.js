import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { ServerStyleSheets } from '@mui/styles';
import * as Sentry from '@sentry/node';
import compression from 'compression';
import crypto from 'crypto';
import dotenv from 'dotenv';
import express from 'express';
import IntlPolyfill from 'intl';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import fetch from 'node-fetch';
import schedule from 'node-schedule';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom/server';
import { applyMiddleware, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import config from '../config';
import paths from '../config/paths';
import { sharedIgnoreErrors } from '../config/sentry';
import App from '../src/App';
import ogImage from '../src/assets/images/servicemap-meta-img.png';
import { setLocale } from '../src/redux/actions/user';
import rootReducer from '../src/redux/rootReducer';
import createEmotionCache from './createEmotionCache';
import { fetchEventData, fetchSelectedUnitData } from './dataFetcher';
import ieHandler from './ieMiddleware';
import getReadiness from './readiness';
import {
  generateSitemap,
  getRobotsFile,
  getSitemap,
} from './sitemapMiddlewares';
import {
  getRequestFullUrl,
  languageSubdomainRedirect,
  makeLanguageHandler,
  parseInitialMapPositionFromHostname,
  sitemapActive,
  unitRedirect,
} from './utils';

dotenv.config({ path: ['.env', '.env.local'] });

// Initialize Sentry
if (process.env.SENTRY_DSN_SERVER) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN_SERVER,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    release: process.env.SENTRY_RELEASE,
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0'),
    ignoreErrors: sharedIgnoreErrors,
    initialScope: {
      tags: {
        context: 'server',
        runtime: 'node',
      },
    },
  });
  console.log(
    `Initialized Sentry server with DSN ${process.env.SENTRY_DSN_SERVER}`
  );
}

const setupTests = () => {
  if (global.Intl) {
    Intl.NumberFormat = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
  } else {
    global.Intl = IntlPolyfill;
  }

  if (!global.fetch) {
    global.fetch = fetch;
  }
};
setupTests();

// Handle sitemap creation
if (sitemapActive()) {
  // Generate sitemap on start
  generateSitemap();
  // Update sitemap every monday
  schedule.scheduleJob({ hour: 8, minute: 0, dayOfWeek: 1 }, () => {
    console.log('Updating sitemap...');
    generateSitemap();
  });
}

// Configure constants
const app = express();
app.disable('x-powered-by');
const { supportedLanguages } = config;

// Enable compression for all responses
app.use(compression());

// This is required for proxy setups to work in production
app.set('trust proxy', true);

// Add static folder
app.use(express.static(path.resolve(__dirname, 'src')));
// Also serve files from the root dist directory for index.js and other assets
app.use(express.static(path.resolve(__dirname)));
app.use('/assets', express.static(path.resolve(__dirname, 'assets')));

// Add middlewares
app.use('/*', (req, res, next) => {
  const store = createStore(rootReducer, applyMiddleware(thunk));
  req._context = store;
  next();
});
app.use('/*', ieHandler);
app.use('/sitemap.xml', getSitemap);
app.get('/robots.txt', getRobotsFile);
app.get('/readiness', getReadiness);
app.use('/', languageSubdomainRedirect);
app.use('/', makeLanguageHandler);
app.use('/', unitRedirect);
// Handle treenode redirect
app.use('/', (req, res, next) => {
  if (
    req.query.treenode != null &&
    process.env.DOMAIN.includes(req.get('host'))
  ) {
    const fullUrl = req.originalUrl.replace(/treenode/g, 'service_node');
    res.redirect(301, fullUrl);
    return;
  }
  next();
});
app.use(paths.event.regex, fetchEventData);
app.use(paths.unit.regex, fetchSelectedUnitData);

app.get('/*', (req, res, next) => {
  const [nonce, cspHeaders] = generateCSPHeaders();
  const cache = createEmotionCache(nonce);
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(cache);
  // CSS for all rendered React components
  const css = new Set();
  const insertCss = (...styles) =>
    styles.forEach((style) => css.add(style._getCss()));

  // Locale for page
  const localeParam = req.params[0].slice(0, 2);
  const locale =
    supportedLanguages.indexOf(localeParam) > -1 ? localeParam : 'fi';

  const store = req._context;
  if (store && store.dispatch) {
    store.dispatch(setLocale(locale));
  }

  // Create server style sheets
  const sheets = new ServerStyleSheets();

  // Create helmet context for SSR
  const helmetContext = {};

  const jsx = sheets.collect(
    <HelmetProvider context={helmetContext}>
      <CacheProvider value={cache}>
        <Provider store={store}>
          <StaticRouter location={req.url} context={{}}>
            {/* Provider to help with isomorphic style loader */}
            <StyleContext.Provider value={{ insertCss }}>
              <App />
            </StyleContext.Provider>
          </StaticRouter>
        </Provider>
      </CacheProvider>
    </HelmetProvider>
  );
  const reactDom = ReactDOMServer.renderToString(jsx);
  const { headMarkup: reactHeadMarkup, appMarkup } =
    extractHeadMarkupFromReactDom(reactDom);
  const cssString = sheets.toString();
  // React 19 hoists head tags into render output instead of Helmet context.
  const helmetHeadMarkup = helmetContext.helmet
    ? `${helmetContext.helmet.title.toString()}${helmetContext.helmet.meta.toString()}`
    : '';
  const headMarkup = reactHeadMarkup || helmetHeadMarkup;

  const preloadedState = store.getState();

  const customValues = {
    initialMapPosition: parseInitialMapPositionFromHostname(req, Sentry),
  };

  const emotionChunks = extractCriticalToChunks(reactDom);
  const emotionCss = constructStyleTagsFromChunks(emotionChunks);

  const headers = { 'Content-Type': 'text/html', ...cspHeaders };
  res.writeHead(200, headers);
  res.end(
    htmlTemplate(
      req,
      appMarkup,
      preloadedState,
      css,
      cssString,
      emotionCss,
      locale,
      headMarkup,
      customValues,
      nonce
    )
  );
});

const extractHeadMarkupFromReactDom = (markup) => {
  let remaining = markup;
  let headMarkup = '';
  const headTagPattern = new RegExp(
    '^(?:<title[\\s\\S]*?<\\/title\\b[^>]*>|<meta\\b[^>]*\\/?\\s*>|<link\\b[^>]*\\/?\\s*>' +
      '|<style[\\s\\S]*?<\\/style\\b[^>]*>|<script[\\s\\S]*?<\\/script\\b[^>]*>|<base\\b[^>]*\\/?\\s*>)',
    'i'
  );

  while (true) {
    const trimmed = remaining.replace(/^\s+/, '');
    const match = trimmed.match(headTagPattern);
    if (!match) {
      remaining = trimmed;
      break;
    }

    headMarkup += `${match[0]}\n`;
    remaining = trimmed.slice(match[0].length);
  }

  return {
    headMarkup: normalizeHeadMarkup(headMarkup),
    appMarkup: remaining,
  };
};

const normalizeHeadMarkup = (headMarkup) => {
  const titleTags = [...headMarkup.matchAll(/<title[\s\S]*?<\/title>/gi)];
  if (titleTags.length <= 1) {
    return headMarkup;
  }

  const lastTitleTag = titleTags[titleTags.length - 1][0];
  const markupWithoutTitles = headMarkup.replace(
    /<title[\s\S]*?<\/title>\s*/gi,
    ''
  );

  return `${lastTitleTag}\n${markupWithoutTitles}`;
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const buildFallbackHeadMarkup = (req, headMarkup) => {
  const fallbackTags = [];

  if (!/<meta\b[^>]*property=["']og:url["'][^>]*>/i.test(headMarkup)) {
    fallbackTags.push(
      `<meta property="og:url" data-react-helmet="true" content="${escapeHtml(getRequestFullUrl(req))}" />`
    );
  }

  if (!/<meta\b[^>]*property=["']og:image["'][^>]*>/i.test(headMarkup)) {
    fallbackTags.push(
      `<meta property="og:image" data-react-helmet="true" content="${ogImage}" />`
    );
  }

  if (!/<meta\b[^>]*name=["']twitter:card["'][^>]*>/i.test(headMarkup)) {
    fallbackTags.push(
      '<meta name="twitter:card" data-react-helmet="true" content="summary" />'
    );
  }

  return fallbackTags.join('\n');
};

// Setup Sentry error handler
if (process.env.SENTRY_DSN_SERVER) {
  Sentry.setupExpressErrorHandler(app);
}

console.log('Application version tag:', GIT_TAG, 'commit:', GIT_COMMIT);
console.log(`Starting server on port ${process.env.PORT || 3000}`);
app.listen(process.env.PORT || 3000);

const htmlTemplate = (
  req,
  appMarkup,
  preloadedState,
  css,
  cssString,
  emotionCss,
  locale,
  headMarkup,
  customValues,
  nonce
) => `
<!DOCTYPE html>
<html lang="${locale || 'fi'}">
  <head>
    <meta charset="utf-8">
    ${headMarkup}
    ${buildFallbackHeadMarkup(req, headMarkup)}
    ${emotionCss}
    <!-- jss-insertion-point -->
    <style id="jss-server-side" nonce="${nonce}">${cssString}</style>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""
      />
    <script
      src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
      crossorigin="">
    </script>
    <style nonce="${nonce}">
      @import url('https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i');
    </style>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#141823" />
    <script src="/env-config.js" nonce="${nonce}"></script>
    ${
      process.env.REACT_APP_READ_SPEAKER_URL &&
      process.env.REACT_APP_READ_SPEAKER_URL !== 'false'
        ? `
        <script type="text/javascript">
          window.rsConf = {
            params: '${process.env.REACT_APP_READ_SPEAKER_URL}',
            general: {usePost:true}
          };
        </script>
        <script src="${process.env.REACT_APP_READ_SPEAKER_URL}" type="text/javascript"></script>
      `
        : ''
    }
  </head>

  <body>
    <div id="app">${appMarkup}</div>
    <style nonce="${nonce}">${[...css].join('')}</style>

    <script nonce="${nonce}">
      // Patch the one request-specific value that depends on hostname
      if (window._env_) {
        window._env_.REACT_APP_INITIAL_MAP_POSITION = ${JSON.stringify(customValues.initialMapPosition)};
      }

      // WARNING: See the following for security issues around embedding JSON in HTML:
      // http://redux.js.org/recipes/ServerRendering.html#security-considerations
      window.PRELOADED_STATE = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    </script>
    <script src="/index.js"></script>
  </body>
</html>
`;

const generateCSPHeaders = () => {
  const nonce = crypto.randomBytes(16).toString('base64');

  if (process.env.CSP_ENABLED !== 'true') {
    return [nonce, {}];
  }

  const headers = {};
  const csp = {};
  const reportUri = process.env.CSP_REPORT_URI;

  if (reportUri) {
    headers['Reporting-Endpoints'] = `csp-endpoint="${reportUri}"`;
    csp['report-to'] = `csp-endpoint`;
    csp['report-uri'] = reportUri;
  }

  csp['base-uri'] = `'self'`;
  csp['connect-src'] = `'self' ${process.env.CSP_CONNECT_SRC}`;
  csp['default-src'] = `'self'`;
  csp['font-src'] = `'self' https://fonts.gstatic.com`;
  csp['form-action'] = `'self'`;
  csp['img-src'] = `'self' data: https://www.hel.fi ${process.env.CSP_IMG_SRC}`;
  csp['manifest-src'] = `'self'`;
  // Only allowlist the Matomo source when Matomo is actually enabled, matching
  // the frontend condition in src/App.js, to keep the CSP as strict as possible.
  const matomoEnabled =
    process.env.REACT_APP_MATOMO_ENABLED === 'true' &&
    !!process.env.REACT_APP_MATOMO_URL &&
    !!process.env.REACT_APP_MATOMO_SITE_ID;
  const matomoScriptSrc = matomoEnabled ? process.env.REACT_APP_MATOMO_URL : '';
  csp['script-src'] = `'self' \
    'nonce-${nonce}' \
    https://unpkg.com/leaflet@1.9.4/dist/leaflet.js \
     ${matomoScriptSrc} ${process.env.CSP_SCRIPT_SRC || ''}`;
  csp['script-src-attr'] =
    `'unsafe-hashes' 'sha256-7Hm4kDnuwRKq0GkRVBPz6YL9PvbRT9e9rAqI5RnLzBQ='`;
  csp['style-src'] =
    `'self' 'unsafe-inline' https://unpkg.com/leaflet@1.9.4/dist/leaflet.css https://fonts.googleapis.com`;

  headers[
    process.env.CSP_REPORT_ONLY === 'true'
      ? 'Content-Security-Policy-Report-Only'
      : 'Content-Security-Policy'
  ] = Object.entries(csp)
    .map((e) => `${e.join(' ')};`)
    .join(' ');
  return [nonce, headers];
};
