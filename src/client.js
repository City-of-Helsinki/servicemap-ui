/* eslint-disable no-underscore-dangle */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import JssProvider from 'react-jss/lib/JssProvider';
import {
  createGenerateClassName,
} from '@material-ui/core/styles';
import rootReducer from './rootReducer';
import App from './App';
import SettingsUtility from './utils/settings';
import LocalStorageUtility from './utils/localStorage';
import config from '../config';
import favicon from './assets/icons/favicon.ico';
import ThemeWrapper from './utils/ThemeWrapper';

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

// Create a new class name generator.
const generateClassName = createGenerateClassName({
  productionPrefix: config.productionPrefix,
});

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(dispose => dispose());
};


ReactDOM.hydrate(
  <Provider store={store}>
    <StyleContext.Provider value={{ insertCss }}>
      <JssProvider generateClassName={generateClassName}>
        <ThemeWrapper>
          {
            // HTML head tags
          }
          <Helmet>
            <link rel="shortcut icon" href={favicon} />
          </Helmet>
          <App />
        </ThemeWrapper>
      </JssProvider>
    </StyleContext.Provider>
  </Provider>, app,
);
