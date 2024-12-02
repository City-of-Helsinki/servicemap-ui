/* eslint-disable no-underscore-dangle */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import * as Sentry from "@sentry/react";
import { Helmet } from 'react-helmet';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import ac from 'abortcontroller-polyfill';
import rootReducer from '../src/redux/rootReducer';
import App from '../src/App';
import SettingsUtility from '../src/utils/settings';
import favicon from '../src/assets/icons/favicon.ico';
import config from '../config';
import createEmotionCache from '../server/createEmotionCache';
import { CacheProvider } from '@emotion/react';

if (config.sentryDSN) {
  Sentry.init({
    dsn: config.sentryDSN,
    ignoreErrors: [
      'AbortError',
      // Ignore fetch related common errors
      /TypeError: (Kumottu|cancelled)/,
      'TypeError: Failed to fetch',
      'TypeError: NetworkError when attempting to fetch resource.',
      /adrum/,
    ],
  });
}

if (!global.AbortController) {
  global.AbortController = ac.AbortController;
}

const getPreloadedState = () => {
  const state = window.PRELOADED_STATE;
  // Allow the passed state to be garbage-collected
  delete window.PRELOADED_STATE;

  // Handle settings fetch from localStorage
  const settings = SettingsUtility.getSettingsFromLocalStorage();
  state.settings = settings;

  // Set correct theme from localStorage
  // TODO dark mode is broken after refresh
  // const theme = LocalStorageUtility.getItem('theme');
  const theme = 'default';
  if (theme) {
    state.user.theme = theme;
  }

  return state;
};

const preloadedState = getPreloadedState();

// Create Redux store with initial state
const store = createStore(rootReducer, preloadedState, applyMiddleware(thunk));

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(dispose => dispose());
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
    <CacheProvider value={cache}>
      <Provider store={store}>

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
      </Provider>
    </CacheProvider>
  );
}

hydrateRoot(document.getElementById('app'), <Main />);
