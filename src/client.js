/* eslint-disable no-underscore-dangle */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { MuiThemeProvider } from '@material-ui/core';
import JssProvider from 'react-jss/lib/JssProvider';
import {
  createGenerateClassName,
} from '@material-ui/core/styles';
import rootReducer from './rootReducer';
import App from './App';
import themes from './themes';
import SettingsUtility from './utils/settings';

const getPreloadedState = () => {
  const state = window.PRELOADED_STATE;
  // Allow the passed state to be garbage-collected
  delete window.PRELOADED_STATE;

  // Handle settings fetch from localStorage
  const settings = SettingsUtility.getSettingsFromLocalStorage();
  state.settings = settings;

  return state;
};

const preloadedState = getPreloadedState();

// Create Redux store with initial state
const store = createStore(rootReducer, preloadedState, applyMiddleware(thunk));

const app = document.getElementById('app');

// Create a new class name generator.
const generateClassName = createGenerateClassName();

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(dispose => dispose());
};
ReactDOM.hydrate(
  <Provider store={store}>
    <StyleContext.Provider value={{ insertCss }}>
      <JssProvider generateClassName={generateClassName}>
        <MuiThemeProvider theme={themes.SMTheme}>
          <App />
        </MuiThemeProvider>
      </JssProvider>
    </StyleContext.Provider>
  </Provider>, app,
);
