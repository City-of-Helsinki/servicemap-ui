import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { ServerStyleSheets } from '@mui/styles';
import crypto from 'crypto';
import express from 'express';
import IntlPolyfill from 'intl';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import fetch from 'node-fetch';
import schedule from 'node-schedule';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import config from '../config';
import paths from '../config/paths';
import App from '../src/App';
import ogImage from '../src/assets/images/servicemap-meta-img.png';
import { setLocale } from '../src/redux/actions/user';
import rootReducer from '../src/redux/rootReducer';
import createEmotionCache from './createEmotionCache';
import { fetchEventData, fetchSelectedUnitData } from './dataFetcher';
import ieHandler from './ieMiddleware';
import legacyRedirector from './legacyRedirector';
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

// Get sentry dsn from environtment variables
const sentryDSN = process.env.SENTRY_DSN_SERVER;
let Sentry = null;

if (sentryDSN) {
  Sentry = require('@sentry/node');
  Sentry.init({ dsn: sentryDSN });
  console.log(`Initialized Sentry client with DSN ${sentryDSN}`);
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

// This is required for proxy setups to work in production
app.set('trust proxy', true);

// Add static folder
app.use(express.static(path.resolve(__dirname, 'src')));

// Add middlewares
app.use('/*', (req, res, next) => {
  const store = createStore(rootReducer, applyMiddleware(thunk));
  req._context = store;
  next();
});
app.use('/*', ieHandler);
app.use('/rdr', legacyRedirector);
app.use('/sitemap.xml', getSitemap);
app.get('/robots.txt', getRobotsFile);
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
  const locale = supportedLanguages.indexOf(localeParam > -1)
    ? localeParam
    : 'fi';

  const store = req._context;
  if (store && store.dispatch) {
    store.dispatch(setLocale(locale));
  }

  // Create server style sheets
  const sheets = new ServerStyleSheets();

  const jsx = sheets.collect(
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
  );
  const reactDom = ReactDOMServer.renderToString(jsx);
  const cssString = sheets.toString();
  const helmet = Helmet.renderStatic();

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
      reactDom,
      preloadedState,
      css,
      cssString,
      emotionCss,
      locale,
      helmet,
      customValues,
      nonce
    )
  );
});

// Setup Sentry error handler
if (Sentry) {
  Sentry.setupExpressErrorHandler(app);
}
console.log('Application version tag:', GIT_TAG, 'commit:', GIT_COMMIT);
console.log(`Starting server on port ${process.env.PORT || 2048}`);
app.listen(process.env.PORT || 2048);

const htmlTemplate = (
  req,
  reactDom,
  preloadedState,
  css,
  cssString,
  emotionCss,
  locale,
  helmet,
  customValues,
  nonce
) => `
<!DOCTYPE html>
<html lang="${locale || 'fi'}">
  <head>
    <meta charset="utf-8">
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    <meta property="og:url" data-react-helmet="true" content="${getRequestFullUrl(req)}" />
    <meta property="og:image" data-react-helmet="true" content="${ogImage}" />
    <meta name="twitter:card" data-react-helmet="true" content="summary" />
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
    ${
      process.env.READ_SPEAKER_URL && process.env.READ_SPEAKER_URL !== 'false'
        ? `
        <script type="text/javascript">
          window.rsConf = {
            params: '${process.env.READ_SPEAKER_URL}',
            general: {usePost:true}
          };
        </script>
        <script src="${process.env.READ_SPEAKER_URL}" type="text/javascript"></script>
      `
        : ''
    }
  </head>

  <body>
    <div id="app">${reactDom}</div>
    <style nonce="${nonce}">${[...css].join('')}</style>
    <script nonce="${nonce}">
        window.nodeEnvSettings = {};
        window.nodeEnvSettings.ACCESSIBILITY_SENTENCE_API = "${process.env.ACCESSIBILITY_SENTENCE_API}";
        window.nodeEnvSettings.SERVICEMAP_API = "${process.env.SERVICEMAP_API}";
        window.nodeEnvSettings.SERVICEMAP_API_VERSION = "${process.env.SERVICEMAP_API_VERSION}";
        window.nodeEnvSettings.EVENTS_API = "${process.env.EVENTS_API}";
        window.nodeEnvSettings.RESERVATIONS_API = "${process.env.RESERVATIONS_API}";
        window.nodeEnvSettings.PRODUCTION_PREFIX = "${process.env.PRODUCTION_PREFIX}";
        window.nodeEnvSettings.DIGITRANSIT_API = "${process.env.DIGITRANSIT_API}";
        window.nodeEnvSettings.FEEDBACK_URL = "${process.env.FEEDBACK_URL}";
        window.nodeEnvSettings.HEARING_MAP_API = "${process.env.HEARING_MAP_API}";
        window.nodeEnvSettings.HSL_ROUTE_GUIDE_URL = "${process.env.HSL_ROUTE_GUIDE_URL}";
        window.nodeEnvSettings.HSL_ROUTE_GUIDE_CITIES = "${process.env.HSL_ROUTE_GUIDE_CITIES}";
        window.nodeEnvSettings.MATOMO_MOBILITY_DIMENSION_ID = "${process.env.MATOMO_MOBILITY_DIMENSION_ID}";
        window.nodeEnvSettings.MATOMO_SENSES_DIMENSION_ID = "${process.env.MATOMO_SENSES_DIMENSION_ID}";
        window.nodeEnvSettings.MATOMO_NO_RESULTS_DIMENSION_ID = "${process.env.MATOMO_NO_RESULTS_DIMENSION_ID}";
        window.nodeEnvSettings.MATOMO_URL = "${process.env.MATOMO_URL}";
        window.nodeEnvSettings.MATOMO_SITE_ID = "${process.env.MATOMO_SITE_ID}";
        window.nodeEnvSettings.MATOMO_ENABLED = "${process.env.MATOMO_ENABLED}";
        window.nodeEnvSettings.MODE = "${process.env.MODE}";
        window.nodeEnvSettings.INITIAL_MAP_POSITION = "${customValues.initialMapPosition}";
        window.nodeEnvSettings.SERVICE_MAP_URL = "${process.env.SERVICE_MAP_URL}";
        window.nodeEnvSettings.ACCESSIBLE_MAP_URL = "${process.env.ACCESSIBLE_MAP_URL}";
        window.nodeEnvSettings.ORTOGRAPHIC_MAP_URL = "${process.env.ORTOGRAPHIC_MAP_URL}";
        window.nodeEnvSettings.ORTOGRAPHIC_WMS_URL = "${process.env.ORTOGRAPHIC_WMS_URL}";
        window.nodeEnvSettings.ORTOGRAPHIC_WMS_LAYER = "${process.env.ORTOGRAPHIC_WMS_LAYER}";
        window.nodeEnvSettings.GUIDE_MAP_URL = "${process.env.GUIDE_MAP_URL}";
        window.nodeEnvSettings.PLAIN_MAP_URL = "${process.env.PLAIN_MAP_URL}";
        window.nodeEnvSettings.REITTIOPAS_URL = "${process.env.REITTIOPAS_URL}";
        window.nodeEnvSettings.OUTDOOR_EXERCISE_URL = "${process.env.OUTDOOR_EXERCISE_URL}";
        window.nodeEnvSettings.NATURE_AREA_URL = "${process.env.NATURE_AREA_URL}";
        window.nodeEnvSettings.VANTAA_NATURE_AREA_URL = "${process.env.VANTAA_NATURE_AREA_URL}";
        window.nodeEnvSettings.EMBEDDER_DOCUMENTATION_URL = "${process.env.EMBEDDER_DOCUMENTATION_URL}";
        window.nodeEnvSettings.CITIES = "${process.env.CITIES}";
        window.nodeEnvSettings.ORGANIZATIONS = '${process.env.ORGANIZATIONS}';
        window.nodeEnvSettings.MAPS = "${process.env.MAPS}";
        window.nodeEnvSettings.ACCESSIBILITY_STATEMENT_URL_FI = "${process.env.ACCESSIBILITY_STATEMENT_URL_FI}";
        window.nodeEnvSettings.ACCESSIBILITY_STATEMENT_URL_SV = "${process.env.ACCESSIBILITY_STATEMENT_URL_SV}";
        window.nodeEnvSettings.ACCESSIBILITY_STATEMENT_URL_EN = "${process.env.ACCESSIBILITY_STATEMENT_URL_EN}";
        window.nodeEnvSettings.SHOW_AREA_SELECTION = "${process.env.SHOW_AREA_SELECTION}";
        window.nodeEnvSettings.READ_SPEAKER_URL = "${process.env.READ_SPEAKER_URL}";
        window.nodeEnvSettings.FEEDBACK_ADDITIONAL_INFO_LINK = "${process.env.FEEDBACK_ADDITIONAL_INFO_LINK}";
        window.nodeEnvSettings.FEEDBACK_IS_PUBLISHED = "${process.env.FEEDBACK_IS_PUBLISHED}";
        window.nodeEnvSettings.USE_PTV_ACCESSIBILITY_API = "${process.env.USE_PTV_ACCESSIBILITY_API}";
        window.nodeEnvSettings.SENTRY_DSN_CLIENT = "${process.env.SENTRY_DSN_CLIENT}";
        window.nodeEnvSettings.FEEDBACK_ADDITIONAL_INFO_LINK_FI = "${process.env.FEEDBACK_ADDITIONAL_INFO_LINK_FI}";
        window.nodeEnvSettings.FEEDBACK_ADDITIONAL_INFO_LINK_SV = "${process.env.FEEDBACK_ADDITIONAL_INFO_LINK_SV}";
        window.nodeEnvSettings.FEEDBACK_ADDITIONAL_INFO_LINK_EN = "${process.env.FEEDBACK_ADDITIONAL_INFO_LINK_EN}";
        window.nodeEnvSettings.ADDITIONAL_FEEDBACK_URLS_VANTAA = "${process.env.ADDITIONAL_FEEDBACK_URLS_VANTAA}";
        window.nodeEnvSettings.ADDITIONAL_FEEDBACK_URLS_ESPOO = "${process.env.ADDITIONAL_FEEDBACK_URLS_ESPOO}";
        window.nodeEnvSettings.ADDITIONAL_FEEDBACK_URLS_KIRKKONUMMI =
          "${process.env.ADDITIONAL_FEEDBACK_URLS_KIRKKONUMMI}";
        window.nodeEnvSettings.ADDITIONAL_FEEDBACK_URLS_KAUNIAINEN =
          "${process.env.ADDITIONAL_FEEDBACK_URLS_KAUNIAINEN}";
        window.nodeEnvSettings.READ_FEEDBACK_URLS_HELSINKI = "${process.env.READ_FEEDBACK_URLS_HELSINKI}";
        window.nodeEnvSettings.SLOW_FETCH_MESSAGE_TIMEOUT = "${process.env.SLOW_FETCH_MESSAGE_TIMEOUT}";
        window.nodeEnvSettings.HELSINKI_MAPTILES_ENABLED = "${process.env.HELSINKI_MAPTILES_ENABLED}";

        window.nodeEnvSettings.FEATURE_SERVICEMAP_PAGE_TRACKING = "${process.env.FEATURE_SERVICEMAP_PAGE_TRACKING}";
        window.nodeEnvSettings.FEATURE_SM_COOKIES = "${process.env.FEATURE_SM_COOKIES}";

        window.nodeEnvSettings.appVersion = {};
        window.nodeEnvSettings.appVersion.tag = "${GIT_TAG}";
        window.nodeEnvSettings.appVersion.commit = "${GIT_COMMIT}";
    </script>
    <script nonce="${nonce}">
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
  csp['script-src'] =
    `'self' 'nonce-${nonce}' https://unpkg.com/leaflet@1.9.4/dist/leaflet.js`;
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
