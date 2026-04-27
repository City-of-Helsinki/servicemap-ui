/* eslint-disable no-underscore-dangle */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';

import { CacheProvider } from '@emotion/react';
import * as Sentry from '@sentry/react';
import {
  HydrationBoundary,
  QueryClientProvider,
} from '@tanstack/react-query';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import config from '../config';
import { name } from '../package.json';
import createEmotionCache from '../server/createEmotionCache';
import { makeQueryClient } from '../src/api/queryClient';
import App from '../src/App';
import favicon from '../src/assets/icons/favicon.ico';
import rootReducer from '../src/redux/rootReducer';
import SettingsUtility from '../src/utils/settings';

if (config.sentryDSN) {
  Sentry.init({
    dsn: config.sentryDSN,
    ignoreErrors: [
      'AbortError',
      // HTTPClient wraps aborted fetches in this typed subclass. iOS Safari
      // aggressively aborts in-flight requests on backgrounding / bfcache /
      // radio switches, so these are navigation noise rather than real errors.
      'AbortAPIError',
      // Ignore fetch related common errors
      /TypeError: (Kumottu|cancelled)/,
      'TypeError: Failed to fetch',
      'TypeError: NetworkError when attempting to fetch resource.',
      /adrum/,
    ],
    environment: config.sentryEnvironment,
    release: config.sentryRelease,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
      Sentry.thirdPartyErrorFilterIntegration({
        filterKeys: [name],
        behaviour: 'drop-error-if-contains-third-party-frames',
      }),
    ],
    tracesSampleRate: parseFloat(config.sentryTracesSampleRate || '0'),
    tracePropagationTargets: (config.sentryTracePropagationTargets || '').split(
      ','
    ),
    replaysSessionSampleRate: parseFloat(
      config.sentryReplaysSessionSampleRate || '0'
    ),
    replaysOnErrorSampleRate: parseFloat(
      config.sentryReplaysOnErrorSampleRate || '0'
    ),
    initialScope: {
      tags: {
        context: 'client',
        runtime: 'browser',
      },
    },
  });
}

const getPreloadedState = () => {
  const state = window.PRELOADED_STATE;

  // Allow the passed state to be garbage-collected
  delete window.PRELOADED_STATE;

  if (state) {
    // Handle settings fetch from localStorage
    const settings = SettingsUtility.getSettingsFromLocalStorage();
    state.settings = settings;

    // Set correct theme from localStorage
    // TODO dark mode is broken after refresh
    // const theme = LocalStorageUtility.getItem('theme');
    const theme = 'default';
    if (theme) {
      if (!state.user) {
        state.user = {};
      }
      state.user.theme = theme;
    }
  }

  return state;
};

const preloadedState = getPreloadedState();

// Create Redux store with initial state
const store = createStore(rootReducer, preloadedState, applyMiddleware(thunk));

// Read dehydrated React Query state from SSR and release the global so it can
// be garbage-collected, mirroring the PRELOADED_STATE pattern above.
const dehydratedQueryState = window.REACT_QUERY_STATE;
delete window.REACT_QUERY_STATE;

const queryClient = makeQueryClient();

const insertCss = (...styles) => {
  const removeCss = styles.map((style) => style._insertCss());
  return () => removeCss.forEach((dispose) => dispose());
};

// Create cache object which will inject emotion styles from cache
const cache = createEmotionCache();

function Main() {
  // Remove server side styles
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <HelmetProvider>
      <CacheProvider value={cache}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydratedQueryState}>
              {/* Provider to help with isomorphic style loader */}
              <StyleContext.Provider value={{ insertCss }}>
                {
                  // HTML head tags
                }
                <Helmet>
                  <link rel="shortcut icon" href={favicon} />
                </Helmet>
                <App />
              </StyleContext.Provider>
            </HydrationBoundary>
          </QueryClientProvider>
        </Provider>
      </CacheProvider>
    </HelmetProvider>
  );
}

hydrateRoot(document.getElementById('app'), <Main />);
