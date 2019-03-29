/* eslint-disable no-underscore-dangle */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import rootReducer from './rootReducer';
import App from './App';

const preloadedState = window.PRELOADED_STATE;

// Allow the passed state to be garbage-collected
delete window.PRELOADED_STATE;

// Create Redux store with initial state
const store = createStore(rootReducer, preloadedState, applyMiddleware(thunk));

const app = document.getElementById('app');

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(dispose => dispose());
};
ReactDOM.hydrate(
  <Provider store={store}>
    <StyleContext.Provider value={{ insertCss }}>
      <App />
    </StyleContext.Provider>
  </Provider>, app,
);
