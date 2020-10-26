/* eslint-disable no-underscore-dangle */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
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
import LocalStorageUtility from '../src/utils/localStorage';
import favicon from '../src/assets/icons/favicon.ico';
import config from '../config';

if (config.sentryDSN) {
  Sentry.init({
    dsn: config.sentryDSN,
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
  const theme = LocalStorageUtility.getItem('theme');
  if (theme) {
    state.user.theme = theme;
  }

  return state;
};

const preloadedState = getPreloadedState();

// Create Redux store with initial state
const store = createStore(rootReducer, preloadedState, applyMiddleware(thunk));

const app = document.getElementById('app');

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(dispose => dispose());
};

function Main() {
  // Remove server side styles
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
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
  );
}


ReactDOM.hydrate(
  <Main />, app,
);
