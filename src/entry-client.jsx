/* eslint-disable no-underscore-dangle */
import { CacheProvider } from '@emotion/react';
import * as Sentry from '@sentry/react';
import { hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';

import config from '../config';
import { sharedIgnoreErrors } from '../config/sentry';
import { name } from '../package.json';
import App from './App';
import createEmotionCache from './createEmotionCache';
import { createAppStore } from './store';
import SettingsUtility from './utils/settings';

if (config.sentryDSN) {
  Sentry.init({
    dsn: config.sentryDSN,
    ignoreErrors: [
      ...sharedIgnoreErrors,
      /adrum/,
      // Browser extension noise.
      /runtime\.sendMessage/,
      // Browser-imposed rate limit on history.replaceState, not actionable.
      /history\.replaceState\(\).*100 times/,
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
    tracesSampleRate: Number.parseFloat(config.sentryTracesSampleRate || '0'),
    tracePropagationTargets: (config.sentryTracePropagationTargets || '')
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean),
    replaysSessionSampleRate: Number.parseFloat(
      config.sentryReplaysSessionSampleRate || '0'
    ),
    replaysOnErrorSampleRate: Number.parseFloat(
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

const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

if (preloadedState) {
  // Merge settings from localStorage over the server-preloaded settings,
  // preserving any server-provided keys not present in localStorage.
  const localSettings = SettingsUtility.getSettingsFromLocalStorage();
  preloadedState.settings = { ...preloadedState.settings, ...localSettings };

  // TODO: dark mode is broken after refresh — keep 'default' for now.
  const theme = 'default';
  if (!preloadedState.user) {
    preloadedState.user = {};
  }
  preloadedState.user.theme = theme;
}

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
