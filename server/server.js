import express from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import thunk from 'redux-thunk';
import config from '../config';
import rootReducer from '../src/redux/rootReducer';
import App from '../src/App';
import { makeLanguageHandler, languageSubdomainRedirect, unitRedirect } from './utils';
import { setLocale } from '../src/redux/actions/user';
import { SheetsRegistry } from 'jss';
import { Helmet } from 'react-helmet';
import { createGenerateClassName, MuiThemeProvider } from '@material-ui/core';
import JssProvider from 'react-jss/lib/JssProvider';
import themes from '../themes';
import fetch from 'node-fetch';
import { fetchEventData, fetchSelectedUnitData } from './dataFetcher';
import IntlPolyfill from 'intl';
import paths from '../config/paths';
import legacyRedirector from './legacyRedirector';
import { matomoTrackingCode, appDynamicsTrackingCode } from './analytics';
import { getLastCommit, getVersion } from './version';

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
// Configure constants
const app = express();
const supportedLanguages = config.supportedLanguages;

const versionTag = getVersion();
const versionCommit = getLastCommit();

// This is required for proxy setups to work in production
app.set('trust proxy', true);

// The request handler must be the first middleware on the app
if (Sentry) {
  app.use(Sentry.Handlers.requestHandler());
}
// Add static folder
app.use(express.static(path.resolve(__dirname, 'src')));

// Add middlewares
app.use(`/*`, (req, res, next) => {
  const store = createStore(rootReducer, applyMiddleware(thunk));
  req._context = store;
  next();
});
app.use(`/rdr`, legacyRedirector);
app.use('/', languageSubdomainRedirect);
app.use(`/`, makeLanguageHandler);
app.use('/', unitRedirect);
// Handle treenode redirect
app.use('/', (req, res, next) => {
  if (req.query.treenode != null) {
    const fullUrl = req.originalUrl.replace(/treenode/g, 'service_node');
    res.redirect(301, fullUrl);
    return;
  }
  next();
});
app.use(paths.event.regex, fetchEventData);
app.use(paths.unit.regex, fetchSelectedUnitData);

app.get('/*', (req, res, next) => {
  // CSS for all rendered React components
  const css = new Set(); 
  const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()));


  // Create a sheetsRegistry instance.
  const sheetsRegistry = new SheetsRegistry();

  // Create a sheetsManager instance.
  const sheetsManager = new Map();

  // Create a new class name generator.
  const generateClassName = createGenerateClassName({
    productionPrefix: config.productionPrefix,
  });

  // Locale for page
  const localeParam = req.params[0].slice(0, 2)
  const locale = supportedLanguages.indexOf(localeParam > -1) ? localeParam : 'fi';

  let store = req._context;
  if (store && store.dispatch) {
    store.dispatch(setLocale(locale))
  }
  
  const jsx = (
    <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
      <MuiThemeProvider theme={themes.SMTheme} sheetsManager={sheetsManager}>
        <Provider store={store}>
          <StaticRouter location={req.url} context={{}}>
            <StyleContext.Provider value={{ insertCss }}>
              <App />
            </StyleContext.Provider>
          </StaticRouter>
        </Provider>
      </MuiThemeProvider>
    </JssProvider>
  );
  const reactDom = renderToString(jsx);
  const helmet = Helmet.renderStatic();

  const jss = sheetsRegistry.toString();

  const preloadedState = store.getState();

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(htmlTemplate(reactDom, preloadedState, css, jss, locale, helmet));
});

// The error handler must be before any other error middleware
if (Sentry) {
  app.use(Sentry.Handlers.errorHandler());
}

console.log(`Starting server on port ${process.env.PORT || 2048}`);
app.listen(process.env.PORT || 2048);

const htmlTemplate = (reactDom, preloadedState, css, jss, locale, helmet) => `
<!DOCTYPE html>
<html lang="${locale || 'fi'}">
  <head>
    <meta charset="utf-8">
    ${helmet.title.toString()}
    <!-- jss-insertion-point -->
    <style id="jss-server-side">${jss}</style>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css"
    integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
    crossorigin=""
      />
    <script
      src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js"
      integrity="sha512-QVftwZFqvtRNi0ZyCtsznlKSWOStnDORoefr1enyq5mVL4tmKB3S/EnC3rRJcxCPavG10IcrVGSmPh6Qw5lwrg=="
      crossorigin="">
    </script>
    <style>
      @import url('https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i');
    </style>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#141823" />
    ${appDynamicsTrackingCode(process.env.APP_DYNAMICS_APP_KEY)}
  </head>

  <body>
    <div id="app">${reactDom}</div>
    <style>${[...css].join('')}</style>
    <script>
        window.nodeEnvSettings = {};
        window.nodeEnvSettings.ACCESSIBILITY_SENTENCE_API = "${process.env.ACCESSIBILITY_SENTENCE_API}";
        window.nodeEnvSettings.SERVICEMAP_API = "${process.env.SERVICEMAP_API}";
        window.nodeEnvSettings.EVENTS_API = "${process.env.EVENTS_API}";
        window.nodeEnvSettings.RESERVATIONS_API = "${process.env.RESERVATIONS_API}";
        window.nodeEnvSettings.PRODUCTION_PREFIX = "${process.env.PRODUCTION_PREFIX}";
        window.nodeEnvSettings.DIGITRANSIT_API = "${process.env.DIGITRANSIT_API}";
        window.nodeEnvSettings.FEEDBACK_URL = "${process.env.FEEDBACK_URL}";
        window.nodeEnvSettings.HEARING_MAP_API = "${process.env.HEARING_MAP_API}";
        window.nodeEnvSettings.MODE = "${process.env.MODE}";
        window.nodeEnvSettings.INITIAL_MAP_POSITION = "${process.env.INITIAL_MAP_POSITION}";
        window.nodeEnvSettings.MAPS = "${process.env.MAPS}";
        window.nodeEnvSettings.OLD_MAP_LINK_EN = "${process.env.OLD_MAP_LINK_EN}";
        window.nodeEnvSettings.OLD_MAP_LINK_FI = "${process.env.OLD_MAP_LINK_FI}";
        window.nodeEnvSettings.OLD_MAP_LINK_SV = "${process.env.OLD_MAP_LINK_SV}";
        
        window.appVersion = {};
        window.appVersion.tag = "${versionTag}";
        window.appVersion.commit = "${versionCommit}";
    </script>
    <script>
      // WARNING: See the following for security issues around embedding JSON in HTML:
      // http://redux.js.org/recipes/ServerRendering.html#security-considerations
      window.PRELOADED_STATE = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    </script>
    <script src="/index.js"></script>
    ${matomoTrackingCode(process.env.MATOMO_URL, process.env.MATOMO_SITE_ID)}
  </body>
</html>
`;
